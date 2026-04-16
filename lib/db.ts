import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'invoices.db');

let db: Database.Database;

function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initSchema(db);
  }
  return db;
}

function initSchema(database: Database.Database): void {
  database.exec(`
    CREATE TABLE IF NOT EXISTS invoices (
      id TEXT PRIMARY KEY,
      invoice_number TEXT NOT NULL UNIQUE,
      client_name TEXT NOT NULL,
      client_email TEXT NOT NULL,
      client_company TEXT,
      client_address TEXT,
      due_date TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'draft',
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS line_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_id TEXT NOT NULL,
      description TEXT NOT NULL,
      quantity REAL NOT NULL DEFAULT 1,
      unit_price REAL NOT NULL DEFAULT 0,
      sort_order INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
    );
  `);
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid';

export interface LineItem {
  id?: number;
  invoice_id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  sort_order?: number;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  client_name: string;
  client_email: string;
  client_company?: string;
  client_address?: string;
  due_date: string;
  status: InvoiceStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
  line_items?: LineItem[];
  total?: number;
}

export interface InvoiceWithTotal extends Invoice {
  total: number;
}

export function getInvoices(): InvoiceWithTotal[] {
  const database = getDb();
  const rows = database
    .prepare(`
      SELECT i.*,
             COALESCE(SUM(li.quantity * li.unit_price), 0) AS total
      FROM invoices i
      LEFT JOIN line_items li ON li.invoice_id = i.id
      GROUP BY i.id
      ORDER BY i.created_at DESC
    `)
    .all() as InvoiceWithTotal[];
  return rows;
}

export function getInvoiceById(id: string): Invoice | null {
  const database = getDb();
  const invoice = database
    .prepare('SELECT * FROM invoices WHERE id = ?')
    .get(id) as Invoice | undefined;
  if (!invoice) return null;

  const items = database
    .prepare('SELECT * FROM line_items WHERE invoice_id = ? ORDER BY sort_order')
    .all(id) as LineItem[];

  invoice.line_items = items;
  invoice.total = items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);
  return invoice;
}

export interface CreateInvoiceInput {
  id: string;
  invoice_number: string;
  client_name: string;
  client_email: string;
  client_company?: string;
  client_address?: string;
  due_date: string;
  notes?: string;
  line_items: Omit<LineItem, 'id' | 'invoice_id'>[];
}

export function createInvoice(input: CreateInvoiceInput): Invoice {
  const database = getDb();

  const insertInvoice = database.prepare(`
    INSERT INTO invoices (id, invoice_number, client_name, client_email, client_company, client_address, due_date, notes)
    VALUES (@id, @invoice_number, @client_name, @client_email, @client_company, @client_address, @due_date, @notes)
  `);

  const insertLineItem = database.prepare(`
    INSERT INTO line_items (invoice_id, description, quantity, unit_price, sort_order)
    VALUES (@invoice_id, @description, @quantity, @unit_price, @sort_order)
  `);

  const transaction = database.transaction(() => {
    insertInvoice.run({
      id: input.id,
      invoice_number: input.invoice_number,
      client_name: input.client_name,
      client_email: input.client_email,
      client_company: input.client_company ?? null,
      client_address: input.client_address ?? null,
      due_date: input.due_date,
      notes: input.notes ?? null,
    });

    input.line_items.forEach((item, idx) => {
      insertLineItem.run({
        invoice_id: input.id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        sort_order: item.sort_order ?? idx,
      });
    });
  });

  transaction();
  return getInvoiceById(input.id) as Invoice;
}

export interface UpdateInvoiceInput {
  client_name: string;
  client_email: string;
  client_company?: string;
  client_address?: string;
  due_date: string;
  notes?: string;
  status?: InvoiceStatus;
  line_items: Omit<LineItem, 'id' | 'invoice_id'>[];
}

export function updateInvoice(id: string, input: UpdateInvoiceInput): Invoice | null {
  const database = getDb();

  const updateStmt = database.prepare(`
    UPDATE invoices
    SET client_name = @client_name,
        client_email = @client_email,
        client_company = @client_company,
        client_address = @client_address,
        due_date = @due_date,
        notes = @notes,
        status = @status,
        updated_at = datetime('now')
    WHERE id = @id
  `);

  const deleteItems = database.prepare('DELETE FROM line_items WHERE invoice_id = ?');
  const insertLineItem = database.prepare(`
    INSERT INTO line_items (invoice_id, description, quantity, unit_price, sort_order)
    VALUES (@invoice_id, @description, @quantity, @unit_price, @sort_order)
  `);

  const existing = getInvoiceById(id);
  if (!existing) return null;

  const transaction = database.transaction(() => {
    updateStmt.run({
      id,
      client_name: input.client_name,
      client_email: input.client_email,
      client_company: input.client_company ?? null,
      client_address: input.client_address ?? null,
      due_date: input.due_date,
      notes: input.notes ?? null,
      status: input.status ?? existing.status,
    });

    deleteItems.run(id);
    input.line_items.forEach((item, idx) => {
      insertLineItem.run({
        invoice_id: id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        sort_order: item.sort_order ?? idx,
      });
    });
  });

  transaction();
  return getInvoiceById(id);
}

export function updateInvoiceStatus(id: string, status: InvoiceStatus): boolean {
  const database = getDb();
  const result = database
    .prepare(`UPDATE invoices SET status = ?, updated_at = datetime('now') WHERE id = ?`)
    .run(status, id);
  return result.changes > 0;
}

export function deleteInvoice(id: string): boolean {
  const database = getDb();
  const result = database.prepare('DELETE FROM invoices WHERE id = ?').run(id);
  return result.changes > 0;
}

export interface DashboardStats {
  total_invoiced: number;
  total_paid: number;
  total_outstanding: number;
  invoice_count: number;
  paid_count: number;
  draft_count: number;
}

export function getDashboardStats(): DashboardStats {
  const database = getDb();
  const row = database
    .prepare(`
      SELECT
        COALESCE(SUM(li.quantity * li.unit_price), 0) AS total_invoiced,
        COALESCE(SUM(CASE WHEN i.status = 'paid' THEN li.quantity * li.unit_price ELSE 0 END), 0) AS total_paid,
        COALESCE(SUM(CASE WHEN i.status != 'paid' THEN li.quantity * li.unit_price ELSE 0 END), 0) AS total_outstanding,
        COUNT(DISTINCT i.id) AS invoice_count,
        COUNT(DISTINCT CASE WHEN i.status = 'paid' THEN i.id END) AS paid_count,
        COUNT(DISTINCT CASE WHEN i.status = 'draft' THEN i.id END) AS draft_count
      FROM invoices i
      LEFT JOIN line_items li ON li.invoice_id = i.id
    `)
    .get() as DashboardStats;
  return row;
}

export function getNextInvoiceNumber(): string {
  const database = getDb();
  const year = new Date().getFullYear();
  const row = database
    .prepare(`SELECT COUNT(*) as count FROM invoices WHERE invoice_number LIKE 'INV-${year}-%'`)
    .get() as { count: number };
  const seq = String(row.count + 1).padStart(4, '0');
  return `INV-${year}-${seq}`;
}
