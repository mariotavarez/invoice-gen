'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  createInvoice,
  updateInvoice,
  updateInvoiceStatus,
  deleteInvoice,
  getNextInvoiceNumber,
  type InvoiceStatus,
} from './db';
import { generateId } from './utils';

export interface LineItemInput {
  description: string;
  quantity: number;
  unit_price: number;
}

export interface InvoiceFormInput {
  client_name: string;
  client_email: string;
  client_company?: string;
  client_address?: string;
  due_date: string;
  notes?: string;
  line_items: LineItemInput[];
}

function parseFormData(formData: FormData): InvoiceFormInput {
  const client_name = formData.get('client_name') as string;
  const client_email = formData.get('client_email') as string;
  const client_company = (formData.get('client_company') as string) || undefined;
  const client_address = (formData.get('client_address') as string) || undefined;
  const due_date = formData.get('due_date') as string;
  const notes = (formData.get('notes') as string) || undefined;

  // Parse line items from FormData
  const descriptions = formData.getAll('li_description') as string[];
  const quantities = formData.getAll('li_quantity') as string[];
  const unit_prices = formData.getAll('li_unit_price') as string[];

  const line_items: LineItemInput[] = descriptions
    .map((desc, idx) => ({
      description: desc,
      quantity: parseFloat(quantities[idx] ?? '1') || 1,
      unit_price: parseFloat(unit_prices[idx] ?? '0') || 0,
    }))
    .filter((item) => item.description.trim() !== '');

  return { client_name, client_email, client_company, client_address, due_date, notes, line_items };
}

export async function createInvoiceAction(formData: FormData): Promise<void> {
  const input = parseFormData(formData);

  if (!input.client_name || !input.client_email || !input.due_date) {
    throw new Error('Missing required fields');
  }

  if (input.line_items.length === 0) {
    throw new Error('At least one line item is required');
  }

  const id = generateId();
  const invoice_number = getNextInvoiceNumber();

  createInvoice({ id, invoice_number, ...input });

  revalidatePath('/');
  revalidatePath('/invoices');
  redirect(`/invoices/${id}`);
}

export async function updateInvoiceAction(id: string, formData: FormData): Promise<void> {
  const input = parseFormData(formData);

  if (!input.client_name || !input.client_email || !input.due_date) {
    throw new Error('Missing required fields');
  }

  updateInvoice(id, input);

  revalidatePath('/');
  revalidatePath('/invoices');
  revalidatePath(`/invoices/${id}`);
  redirect(`/invoices/${id}`);
}

export async function markAsPaidAction(id: string): Promise<void> {
  updateInvoiceStatus(id, 'paid');
  revalidatePath('/');
  revalidatePath('/invoices');
  revalidatePath(`/invoices/${id}`);
}

export async function markAsSentAction(id: string): Promise<void> {
  updateInvoiceStatus(id, 'sent');
  revalidatePath('/');
  revalidatePath('/invoices');
  revalidatePath(`/invoices/${id}`);
}

export async function markAsDraftAction(id: string): Promise<void> {
  updateInvoiceStatus(id, 'draft');
  revalidatePath('/');
  revalidatePath('/invoices');
  revalidatePath(`/invoices/${id}`);
}

export async function updateStatusAction(id: string, status: InvoiceStatus): Promise<void> {
  updateInvoiceStatus(id, status);
  revalidatePath('/');
  revalidatePath('/invoices');
  revalidatePath(`/invoices/${id}`);
}

export async function deleteInvoiceAction(id: string): Promise<void> {
  deleteInvoice(id);
  revalidatePath('/');
  revalidatePath('/invoices');
  redirect('/invoices');
}
