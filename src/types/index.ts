export type ViewMode = 'desktop';

export type NavTab = 
  | 'dashboard'
  | 'flowchart'
  | 'leads'
  | 'customers'
  | 'products'
  | 'orders'
  | 'invoices'
  | 'automations'
  | 'integrations'
  | 'reports'
  | 'settings';

export type LeadSource = 'Meta Lead Form' | 'WhatsApp' | 'Website Form' | 'Manual Entry';
export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Order Placed' | 'Lost';
export type ConsentStatus = 'Opted In' | 'Opted Out' | 'Pending';

export interface Lead {
  id: string;
  businessId: string;
  name: string;
  phone: string;
  email: string;
  source: LeadSource;
  status: LeadStatus;
  productInterest?: string;
  notes: string;
  consentRef: string;
  consentStatus: ConsentStatus;
  nextFollowUpAt?: string;
  createdAt: string;
  isDuplicate?: boolean;
  duplicateOf?: string;
  isDemo?: boolean;
}

export interface Customer {
  id: string;
  businessId: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  address: string;
  consentStatus: ConsentStatus;
  consentTimestamp: string;
  totalSpent: number;
  orderCount: number;
  lastOrderAt?: string;
  tags: string[];
  createdAt: string;
  isDemo?: boolean;
}

export interface Product {
  id: string;
  businessId: string;
  sku: string;
  name: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
  stockQuantity: number;
  active: boolean;
  unit: string;
  badge?: string;
  isDemo?: boolean;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

export type OrderPaymentStatus = 'Pending Verification' | 'Verified Paid' | 'Failed' | 'Refunded';
export type OrderFulfilmentStatus = 'Unfulfilled' | 'In Progress' | 'Shipped' | 'Delivered' | 'Cancelled';
export type OrderLifecycleState = 'Draft' | 'Pending Confirmation' | 'Confirmed' | 'Paid' | 'Fulfilled' | 'Cancelled';

export interface Order {
  id: string;
  businessId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  phone: string;
  shippingAddress: string;
  items: OrderItem[];
  subtotal: number;
  taxRate: number; // e.g. 5 for 5% GST
  taxAmount: number;
  shippingFee: number;
  total: number;
  paymentStatus: OrderPaymentStatus;
  paymentMethod: string;
  paymentVerifiedBy?: string;
  paymentProofRef?: string;
  fulfilmentStatus: OrderFulfilmentStatus;
  lifecycleState: OrderLifecycleState;
  stockConfirmed: boolean;
  notes?: string;
  invoiceId?: string;
  createdAt: string;
  isDemo?: boolean;
}

export interface Invoice {
  id: string;
  businessId: string;
  invoiceNumber: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  subtotal: number;
  cgstRate: number;
  cgstAmount: number;
  sgstRate: number;
  sgstAmount: number;
  totalTax: number;
  grandTotal: number;
  issuedAt: string;
  dueDate: string;
  status: 'Paid' | 'Issued' | 'Pending' | 'Cancelled';
  paymentMethod: string;
  isDemo?: boolean;
}

export interface WorkflowDefinition {
  id: string;
  businessId: string;
  title: string;
  description: string;
  trigger: string;
  conditions: string[];
  actions: string[];
  active: boolean;
  category: 'Lead Capture' | 'Sales Nurturing' | 'Order Fulfilment' | 'Repeat Purchase';
  executionCount: number;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  workflowName: string;
  businessId: string;
  eventId: string;
  triggerSource: string;
  status: 'success' | 'failed' | 'retrying' | 'skipped';
  idempotencyKey: string;
  attempts: number;
  maxRetries: number;
  errorMessage?: string;
  logs: {
    step: string;
    status: 'pass' | 'fail' | 'warn' | 'info';
    message: string;
    timestamp: string;
  }[];
  createdAt: string;
}

export interface IntegrationSetting {
  id: string;
  name: string;
  provider: 'meta' | 'whatsapp' | 'msgpedia' | 'invoice' | 'ai';
  category: string;
  description: string;
  status: 'connected' | 'demo' | 'disconnected';
  mode: 'demo' | 'live';
  webhookVerified: boolean;
  webhookUrl: string;
  secretMasked: string;
  lastPing: string;
  quotaUsed: string;
}

export interface ConsentRecord {
  id: string;
  businessId: string;
  contactRef: string;
  contactName: string;
  phone: string;
  channel: 'WhatsApp' | 'SMS' | 'Email';
  purpose: 'Enquiry Response' | 'Order Updates' | 'Repeat Purchase Offers';
  source: string;
  status: 'Opted In' | 'Opted Out';
  timestamp: string;
  ipOrAgent?: string;
}

export interface AuditLog {
  id: string;
  businessId: string;
  actorId: string;
  actorName: string;
  role: string;
  action: string;
  entityType: 'Lead' | 'Order' | 'Invoice' | 'Workflow' | 'Integration' | 'Settings';
  entityId: string;
  details: string;
  timestamp: string;
  ipAddress: string;
}

export interface BusinessWorkspace {
  id: string;
  name: string;
  category: string;
  niche: string;
  currency: string;
  currencySymbol: string;
  timezone: string;
  gstNumber: string;
  phone: string;
  email: string;
  address: string;
  pilotStatus: 'Phase 1: Managed Pilot' | 'Phase 2: Reusable Engine' | 'Phase 3: SaaS';
  excludeDemoFromMetrics: boolean;
}

export interface DashboardTask {
  id: string;
  text: string;
  time: string;
  done: boolean;
  category?: 'followup' | 'order' | 'setup';
  dueDate?: 'today' | 'tomorrow' | 'week';
}

export interface DashboardNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'lead' | 'order' | 'automation' | 'integration' | 'alert';
  read: boolean;
}
