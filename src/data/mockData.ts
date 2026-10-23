import {
  BusinessWorkspace,
  Lead,
  Customer,
  Product,
  Order,
  Invoice,
  WorkflowDefinition,
  WorkflowExecution,
  IntegrationSetting,
  ConsentRecord,
  AuditLog
} from '../types';

export const initialWorkspace: BusinessWorkspace = {
  id: 'biz_purewild_001',
  name: 'PureWild Honey Co.',
  category: 'Packaged Natural Foods & Honey',
  niche: 'Organic Forest Honey & Bee Products',
  currency: 'INR',
  currencySymbol: '₹',
  timezone: 'Asia/Kolkata (IST)',
  gstNumber: '33AABCP9923K1ZM',
  phone: '+91 98765 43210',
  email: 'contact@purewildhoney.in',
  address: 'Plot 42, Western Ghats Organic Estate, Pollachi, Tamil Nadu 642001',
  pilotStatus: 'Phase 1: Managed Pilot',
  excludeDemoFromMetrics: false
};

export const initialProducts: Product[] = [
  {
    id: 'prod_honey_01',
    businessId: 'biz_purewild_001',
    sku: 'PWH-RAW-500G',
    name: 'Raw Himalayan Wildflower Honey (500g)',
    description: 'Unprocessed, unprocessed cold-extracted wild honey rich in natural pollens and enzymes.',
    category: 'Pure Honey',
    price: 499,
    currency: 'INR',
    stockStatus: 'In Stock',
    stockQuantity: 142,
    active: true,
    unit: 'Jar',
    badge: 'Bestseller',
    isDemo: false
  },
  {
    id: 'prod_honey_02',
    businessId: 'biz_purewild_001',
    sku: 'PWH-JAMUN-500G',
    name: 'Single-Origin Jamun Flora Honey (500g)',
    description: 'Dark, low glycemic index medicinal honey for wellness and sugar management.',
    category: 'Medicinal Honey',
    price: 649,
    currency: 'INR',
    stockStatus: 'In Stock',
    stockQuantity: 88,
    active: true,
    unit: 'Jar',
    badge: 'Diabetic Friendly',
    isDemo: false
  },
  {
    id: 'prod_honey_03',
    businessId: 'biz_purewild_001',
    sku: 'PWH-ACACIA-1000G',
    name: 'Kashmir Acacia White Honey (1000g / 1kg)',
    description: 'Ultra-clear, mild floral sweetness that rarely crystallizes. Export grade.',
    category: 'Premium Reserves',
    price: 1199,
    currency: 'INR',
    stockStatus: 'Low Stock',
    stockQuantity: 14,
    active: true,
    unit: 'Glass Jar',
    badge: 'Limited Harvest',
    isDemo: false
  },
  {
    id: 'prod_honey_04',
    businessId: 'biz_purewild_001',
    sku: 'PWH-POLLEN-200G',
    name: 'Sun-Dried Mountain Bee Pollen (200g)',
    description: 'Dense protein and vitamin booster. Great for smoothies and breakfast bowls.',
    category: 'Superfoods',
    price: 549,
    currency: 'INR',
    stockStatus: 'In Stock',
    stockQuantity: 65,
    active: true,
    unit: 'Bottle',
    isDemo: false
  },
  {
    id: 'prod_honey_05',
    businessId: 'biz_purewild_001',
    sku: 'PWH-COMB-350G',
    name: 'Raw Honeycomb Box (350g)',
    description: '100% edible natural beeswax comb dripping with fresh mountain nectar.',
    category: 'Specialty Comb',
    price: 899,
    currency: 'INR',
    stockStatus: 'Out of Stock',
    stockQuantity: 0,
    active: true,
    unit: 'Seal Box',
    badge: 'Sold Out',
    isDemo: false
  }
];

export const initialLeads: Lead[] = [
  {
    id: 'lead_101',
    businessId: 'biz_purewild_001',
    name: 'Karthik Subramanian',
    phone: '+91 98401 23456',
    email: 'karthik.s@gmail.com',
    source: 'Meta Lead Form',
    status: 'Contacted',
    productInterest: 'Raw Himalayan Wildflower Honey (500g)',
    notes: 'Inquired from Instagram Ad campaign. Requested COD options and combo discount.',
    consentRef: 'CONS-META-101',
    consentStatus: 'Opted In',
    nextFollowUpAt: '2026-10-23T10:00:00Z',
    createdAt: '2026-10-22T08:15:00Z',
    isDemo: false
  },
  {
    id: 'lead_102',
    businessId: 'biz_purewild_001',
    name: 'Pooja Venkatesh',
    phone: '+91 97910 88776',
    email: 'pooja.v@outlook.com',
    source: 'WhatsApp',
    status: 'Qualified',
    productInterest: 'Single-Origin Jamun Flora Honey (500g)',
    notes: 'WhatsApp enquiry about glycemic index for father. Verified consent via opt-in template.',
    consentRef: 'CONS-WA-102',
    consentStatus: 'Opted In',
    nextFollowUpAt: '2026-10-22T16:30:00Z',
    createdAt: '2026-10-22T09:40:00Z',
    isDemo: false
  },
  {
    id: 'lead_103',
    businessId: 'biz_purewild_001',
    name: 'Arun Kumar',
    phone: '+91 94432 11223',
    email: 'arun.tech@yahoo.co.in',
    source: 'Website Form',
    status: 'Order Placed',
    productInterest: 'Kashmir Acacia White Honey (1000g / 1kg)',
    notes: 'Converted to Order #ORD-2026-088. Sent instant WhatsApp invoice.',
    consentRef: 'CONS-WEB-103',
    consentStatus: 'Opted In',
    createdAt: '2026-10-21T14:20:00Z',
    isDemo: false
  },
  {
    id: 'lead_104',
    businessId: 'biz_purewild_001',
    name: 'Sangeetha Raman',
    phone: '+91 98840 55443',
    email: 'sangeetha.r@gmail.com',
    source: 'Meta Lead Form',
    status: 'New',
    productInterest: 'Sun-Dried Mountain Bee Pollen (200g)',
    notes: 'Lead captured 15 mins ago from Facebook form. Automated WhatsApp welcome queued.',
    consentRef: 'CONS-META-104',
    consentStatus: 'Opted In',
    nextFollowUpAt: '2026-10-22T14:00:00Z',
    createdAt: '2026-10-22T11:15:00Z',
    isDemo: false
  },
  {
    id: 'lead_105',
    businessId: 'biz_purewild_001',
    name: 'Deepak Narayanan',
    phone: '+91 98401 23456', // Notice same phone as Karthik -> Duplicate detected!
    email: 'deepak.n@gmail.com',
    source: 'Manual Entry',
    status: 'Lost',
    productInterest: 'Raw Forest Honey',
    notes: 'Duplicate phone detected. Linked to Karthik Subramanian.',
    consentRef: 'CONS-MAN-105',
    consentStatus: 'Opted Out',
    isDuplicate: true,
    duplicateOf: 'lead_101',
    createdAt: '2026-10-20T11:00:00Z',
    isDemo: true
  }
];

export const initialCustomers: Customer[] = [
  {
    id: 'cust_01',
    businessId: 'biz_purewild_001',
    name: 'Dr. Anand Mahadevan',
    phone: '+91 98410 99881',
    email: 'anand.m@apollohospitals.org',
    city: 'Chennai',
    state: 'Tamil Nadu',
    address: 'Flat 4B, Emerald Heights, Anna Nagar, Chennai 600040',
    consentStatus: 'Opted In',
    consentTimestamp: '2026-09-12T10:00:00Z',
    totalSpent: 4296,
    orderCount: 4,
    lastOrderAt: '2026-10-18T15:20:00Z',
    tags: ['VIP Repeat Buyer', 'Jamun Honey Enthusiast'],
    createdAt: '2026-09-12T10:00:00Z',
    isDemo: false
  },
  {
    id: 'cust_02',
    businessId: 'biz_purewild_001',
    name: 'Meera Krishnan',
    phone: '+91 99620 44332',
    email: 'meera.k@tcs.com',
    city: 'Bengaluru',
    state: 'Karnataka',
    address: 'Villa 18, Palm Meadows, Whitefield, Bengaluru 560066',
    consentStatus: 'Opted In',
    consentTimestamp: '2026-10-02T11:30:00Z',
    totalSpent: 1698,
    orderCount: 2,
    lastOrderAt: '2026-10-19T09:10:00Z',
    tags: ['Organic Advocate', 'Bee Pollen User'],
    createdAt: '2026-10-02T11:30:00Z',
    isDemo: false
  },
  {
    id: 'cust_03',
    businessId: 'biz_purewild_001',
    name: 'Rajesh Varadhan',
    phone: '+91 97890 66554',
    email: 'rajesh.v@varadhantraders.com',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    address: '12 Trichy Road, Singanallur, Coimbatore 641005',
    consentStatus: 'Opted Out',
    consentTimestamp: '2026-10-15T14:00:00Z',
    totalSpent: 1199,
    orderCount: 1,
    lastOrderAt: '2026-10-15T12:00:00Z',
    tags: ['Opted Out Marketing'],
    createdAt: '2026-10-15T12:00:00Z',
    isDemo: false
  }
];

export const initialOrders: Order[] = [
  {
    id: 'ord_2026_088',
    businessId: 'biz_purewild_001',
    orderNumber: 'ORD-2026-088',
    customerId: 'cust_01',
    customerName: 'Dr. Anand Mahadevan',
    phone: '+91 98410 99881',
    shippingAddress: 'Flat 4B, Emerald Heights, Anna Nagar, Chennai 600040',
    items: [
      {
        productId: 'prod_honey_02',
        name: 'Single-Origin Jamun Flora Honey (500g)',
        price: 649,
        quantity: 2,
        total: 1298
      }
    ],
    subtotal: 1298,
    taxRate: 5, // 5% GST on packaged natural honey
    taxAmount: 64.9,
    shippingFee: 50,
    total: 1412.9,
    paymentStatus: 'Verified Paid',
    paymentMethod: 'UPI / Razorpay (Ref: pay_On789128)',
    paymentVerifiedBy: 'Founder / Verified Webhook',
    paymentProofRef: 'UTR-9912093412',
    fulfilmentStatus: 'Shipped',
    lifecycleState: 'Paid',
    stockConfirmed: true,
    invoiceId: 'inv_2026_088',
    notes: 'Regular doctor customer. Dispatched via Delhivery Express.',
    createdAt: '2026-10-21T14:30:00Z',
    isDemo: false
  },
  {
    id: 'ord_2026_089',
    businessId: 'biz_purewild_001',
    orderNumber: 'ORD-2026-089',
    customerId: 'cust_02',
    customerName: 'Meera Krishnan',
    phone: '+91 99620 44332',
    shippingAddress: 'Villa 18, Palm Meadows, Whitefield, Bengaluru 560066',
    items: [
      {
        productId: 'prod_honey_01',
        name: 'Raw Himalayan Wildflower Honey (500g)',
        price: 499,
        quantity: 2,
        total: 998
      },
      {
        productId: 'prod_honey_04',
        name: 'Sun-Dried Mountain Bee Pollen (200g)',
        price: 549,
        quantity: 1,
        total: 549
      }
    ],
    subtotal: 1547,
    taxRate: 5,
    taxAmount: 77.35,
    shippingFee: 0, // Free delivery above 1000
    total: 1624.35,
    paymentStatus: 'Pending Verification',
    paymentMethod: 'Bank Transfer / GPay pending screenshot confirmation',
    fulfilmentStatus: 'Unfulfilled',
    lifecycleState: 'Pending Confirmation',
    stockConfirmed: true,
    notes: 'Customer submitted payment UTR on WhatsApp. Awaiting owner bank verification.',
    createdAt: '2026-10-22T09:15:00Z',
    isDemo: false
  },
  {
    id: 'ord_2026_090',
    businessId: 'biz_purewild_001',
    orderNumber: 'ORD-2026-090',
    customerId: 'cust_03',
    customerName: 'Rajesh Varadhan',
    phone: '+91 97890 66554',
    shippingAddress: '12 Trichy Road, Singanallur, Coimbatore 641005',
    items: [
      {
        productId: 'prod_honey_03',
        name: 'Kashmir Acacia White Honey (1000g / 1kg)',
        price: 1199,
        quantity: 1,
        total: 1199
      }
    ],
    subtotal: 1199,
    taxRate: 5,
    taxAmount: 59.95,
    shippingFee: 0,
    total: 1258.95,
    paymentStatus: 'Verified Paid',
    paymentMethod: 'UPI Auto-confirm',
    paymentVerifiedBy: 'Founder / Verified Webhook',
    fulfilmentStatus: 'Delivered',
    lifecycleState: 'Fulfilled',
    stockConfirmed: true,
    invoiceId: 'inv_2026_090',
    notes: 'Delivered by BlueDart. Customer opted out of promotional reorders.',
    createdAt: '2026-10-15T12:30:00Z',
    isDemo: false
  }
];

export const initialInvoices: Invoice[] = [
  {
    id: 'inv_2026_088',
    businessId: 'biz_purewild_001',
    invoiceNumber: 'INV-2026-0088',
    orderId: 'ord_2026_088',
    orderNumber: 'ORD-2026-088',
    customerName: 'Dr. Anand Mahadevan',
    customerPhone: '+91 98410 99881',
    customerAddress: 'Flat 4B, Emerald Heights, Anna Nagar, Chennai 600040',
    items: [
      {
        productId: 'prod_honey_02',
        name: 'Single-Origin Jamun Flora Honey (500g)',
        price: 649,
        quantity: 2,
        total: 1298
      }
    ],
    subtotal: 1298,
    cgstRate: 2.5,
    cgstAmount: 32.45,
    sgstRate: 2.5,
    sgstAmount: 32.45,
    totalTax: 64.9,
    grandTotal: 1412.9,
    issuedAt: '2026-10-21T14:35:00Z',
    dueDate: '2026-10-21T14:35:00Z',
    status: 'Paid',
    paymentMethod: 'UPI Verified',
    isDemo: false
  },
  {
    id: 'inv_2026_090',
    businessId: 'biz_purewild_001',
    invoiceNumber: 'INV-2026-0090',
    orderId: 'ord_2026_090',
    orderNumber: 'ORD-2026-090',
    customerName: 'Rajesh Varadhan',
    customerPhone: '+91 97890 66554',
    customerAddress: '12 Trichy Road, Singanallur, Coimbatore 641005',
    items: [
      {
        productId: 'prod_honey_03',
        name: 'Kashmir Acacia White Honey (1000g / 1kg)',
        price: 1199,
        quantity: 1,
        total: 1199
      }
    ],
    subtotal: 1199,
    cgstRate: 2.5,
    cgstAmount: 29.98,
    sgstRate: 2.5,
    sgstAmount: 29.98,
    totalTax: 59.95,
    grandTotal: 1258.95,
    issuedAt: '2026-10-15T12:40:00Z',
    dueDate: '2026-10-15T12:40:00Z',
    status: 'Paid',
    paymentMethod: 'UPI Auto-confirm',
    isDemo: false
  }
];

export const initialWorkflows: WorkflowDefinition[] = [
  {
    id: 'wf_01',
    businessId: 'biz_purewild_001',
    title: 'Meta Ad Form Lead -> WhatsApp Quick Welcome',
    description: 'Validates phone, checks consent, deduplicates, and sends the approved Honey Catalogue menu within 60 seconds.',
    trigger: 'lead.created (Source: Meta Instant Form)',
    conditions: [
      'Phone format valid Indian 10-digit (+91)',
      'Lead is not duplicate in last 48 hours',
      'User checked Meta WhatsApp consent checkbox'
    ],
    actions: [
      'Record consent timestamp & source reference',
      'Send Approved WhatsApp Template: welcome_honey_catalogue_v1',
      'Assign follow-up reminder task to Salesperson',
      'Log execution with idempotency key'
    ],
    active: true,
    category: 'Lead Capture',
    executionCount: 142
  },
  {
    id: 'wf_02',
    businessId: 'biz_purewild_001',
    title: 'Order Confirmed -> Auto Invoice & WhatsApp Tracking',
    description: 'Generates GST invoice only after owner confirms payment, creates shipment alert on WhatsApp.',
    trigger: 'order.payment_verified',
    conditions: [
      'Payment verified by authorized owner or gateway webhook',
      'All ordered items confirmed in stock',
      'Valid delivery pincode and address'
    ],
    actions: [
      'Generate sequential tax invoice (INV-YYYY-XXXX)',
      'Send WhatsApp PDF Invoice download link',
      'Deduct reserved inventory count in catalogue',
      'Notify warehouse fulfillment team'
    ],
    active: true,
    category: 'Order Fulfilment',
    executionCount: 89
  },
  {
    id: 'wf_03',
    businessId: 'biz_purewild_001',
    title: '30-Day Honey Reorder Check (Consent Compliant)',
    description: 'Calculates consumption cycle for 500g honey jars and sends a gentle restock prompt with opt-out link.',
    trigger: 'order.delivered + 30 days',
    conditions: [
      'Customer has not opted out of marketing',
      'No active orders in past 15 days',
      'Customer lifetime orders >= 1'
    ],
    actions: [
      'Verify active consent status in Consent Ledger',
      'Send Approved Template: honey_reorder_refill_prompt',
      'Provide instant 1-tap "STOP" opt-out keyword support'
    ],
    active: true,
    category: 'Repeat Purchase',
    executionCount: 47
  }
];

export const initialExecutions: WorkflowExecution[] = [
  {
    id: 'exec_8819',
    workflowId: 'wf_01',
    workflowName: 'Meta Ad Form Lead -> WhatsApp Quick Welcome',
    businessId: 'biz_purewild_001',
    eventId: 'evt_meta_9811',
    triggerSource: 'Meta Webhook (Leadgen Form #88219)',
    status: 'success',
    idempotencyKey: 'idemp_lead_104_meta',
    attempts: 1,
    maxRetries: 3,
    logs: [
      { step: 'Payload Verification', status: 'pass', message: 'HMAC-SHA256 signature verified against App Secret', timestamp: '11:15:02' },
      { step: 'Data Validation', status: 'pass', message: 'Name: Sangeetha Raman, Phone: +919884055443 normalized', timestamp: '11:15:03' },
      { step: 'Deduplication Check', status: 'pass', message: 'No existing lead for phone in last 48h. Unique lead confirmed', timestamp: '11:15:04' },
      { step: 'Consent Check', status: 'pass', message: 'Consent box checked in Instant Form. Ref: CONS-META-104', timestamp: '11:15:04' },
      { step: 'WhatsApp Template Send', status: 'pass', message: 'Message ID wamid.HBgMOTE5ODg... status: accepted by provider', timestamp: '11:15:05' }
    ],
    createdAt: '2026-10-22T11:15:00Z'
  },
  {
    id: 'exec_8818',
    workflowId: 'wf_02',
    workflowName: 'Order Confirmed -> Auto Invoice & WhatsApp Tracking',
    businessId: 'biz_purewild_001',
    eventId: 'evt_ord_088_verify',
    triggerSource: 'Owner Action (Manual UTR Verification)',
    status: 'success',
    idempotencyKey: 'idemp_ord_088_invoice',
    attempts: 1,
    maxRetries: 3,
    logs: [
      { step: 'Auth Check', status: 'pass', message: 'Owner authorized payment verification for Dr. Anand Mahadevan', timestamp: '14:34:50' },
      { step: 'Stock Check', status: 'pass', message: 'Stock confirmed: Jamun Flora Honey (500g) x 2 available', timestamp: '14:34:52' },
      { step: 'Invoice Generation', status: 'pass', message: 'Tax Invoice INV-2026-0088 created with 5% GST', timestamp: '14:34:55' },
      { step: 'WhatsApp Dispatch', status: 'pass', message: 'Invoice link sent to +919841099881. Callback: delivered', timestamp: '14:34:58' }
    ],
    createdAt: '2026-10-21T14:35:00Z'
  },
  {
    id: 'exec_8817',
    workflowId: 'wf_01',
    workflowName: 'Meta Ad Form Lead -> WhatsApp Quick Welcome',
    businessId: 'biz_purewild_001',
    eventId: 'evt_meta_9810',
    triggerSource: 'Manual Entry Form',
    status: 'skipped',
    idempotencyKey: 'idemp_lead_105_dup',
    attempts: 1,
    maxRetries: 3,
    errorMessage: 'Duplicate lead phone number (+91 98401 23456) already active as lead_101. Aborted automated message.',
    logs: [
      { step: 'Payload Verification', status: 'pass', message: 'Manual form validation passed', timestamp: '11:00:01' },
      { step: 'Deduplication Check', status: 'warn', message: 'Existing phone match found in lead_101 (Karthik Subramanian)', timestamp: '11:00:02' },
      { step: 'Consent Check', status: 'fail', message: 'User requested opt-out. Outbound messaging cancelled', timestamp: '11:00:03' }
    ],
    createdAt: '2026-10-20T11:00:00Z'
  }
];

export const initialIntegrations: IntegrationSetting[] = [
  {
    id: 'integ_meta',
    name: 'Meta Lead Ads & Webhooks',
    provider: 'meta',
    category: 'Lead Capture',
    description: 'Subscribes to Instagram & Facebook Instant Lead Forms. Verifies app secret HMAC signature.',
    status: 'connected',
    mode: 'demo', // Clearly distinguished as required by spec!
    webhookVerified: true,
    webhookUrl: 'https://api.scaleastra.com/v1/webhooks/meta-leads',
    secretMasked: 'eaac_••••••••••••••••38f0',
    lastPing: '2 mins ago',
    quotaUsed: '142 / 1,000 leads'
  },
  {
    id: 'integ_whatsapp',
    name: 'WhatsApp Business Platform / MSGPEDIA Adapter',
    provider: 'msgpedia',
    category: 'Messaging',
    description: 'Direct Cloud API / MSGPEDIA gateway with verified approved templates, rate limits, and delivery webhooks.',
    status: 'connected',
    mode: 'demo',
    webhookVerified: true,
    webhookUrl: 'https://api.scaleastra.com/v1/webhooks/whatsapp-callbacks',
    secretMasked: 'msg_live_••••••••••••9941',
    lastPing: '1 min ago',
    quotaUsed: '389 / 5,000 msgs'
  },
  {
    id: 'integ_invoice',
    name: 'Validated Tax Invoicing Engine',
    provider: 'invoice',
    category: 'Billing',
    description: 'Sequential GST-compliant invoice generation with CGST, SGST, IGST rules and printable PDF previews.',
    status: 'connected',
    mode: 'live',
    webhookVerified: true,
    webhookUrl: 'Internal Service Module',
    secretMasked: 'enc_sys_••••••••••••a1b2',
    lastPing: 'Active',
    quotaUsed: '89 / Unlimited'
  },
  {
    id: 'integ_ai',
    name: 'Gemini AI Lead Classifier & Summary (Optional)',
    provider: 'ai',
    category: 'AI Assistant',
    description: 'Non-autonomous AI classifier for lead qualification and intent extraction. No commitments on price or stock.',
    status: 'demo',
    mode: 'demo',
    webhookVerified: false,
    webhookUrl: 'Server-side API Gateway',
    secretMasked: 'AIzaSy••••••••••••••z8Y0',
    lastPing: '10 mins ago',
    quotaUsed: '45 / 500 requests'
  }
];

export const initialConsentRecords: ConsentRecord[] = [
  {
    id: 'cons_01',
    businessId: 'biz_purewild_001',
    contactRef: 'lead_101',
    contactName: 'Karthik Subramanian',
    phone: '+91 98401 23456',
    channel: 'WhatsApp',
    purpose: 'Enquiry Response',
    source: 'Meta Lead Form Checkbox',
    status: 'Opted In',
    timestamp: '2026-10-22T08:15:00Z',
    ipOrAgent: 'Meta Form API v20.0'
  },
  {
    id: 'cons_02',
    businessId: 'biz_purewild_001',
    contactRef: 'lead_102',
    contactName: 'Pooja Venkatesh',
    phone: '+91 97910 88776',
    channel: 'WhatsApp',
    purpose: 'Enquiry Response',
    source: 'Inbound WhatsApp "START"',
    status: 'Opted In',
    timestamp: '2026-10-22T09:40:00Z',
    ipOrAgent: 'WhatsApp Inbound Webhook'
  },
  {
    id: 'cons_03',
    businessId: 'biz_purewild_001',
    contactRef: 'cust_03',
    contactName: 'Rajesh Varadhan',
    phone: '+91 97890 66554',
    channel: 'WhatsApp',
    purpose: 'Repeat Purchase Offers',
    source: 'User Sent "STOP"',
    status: 'Opted Out',
    timestamp: '2026-10-15T14:00:00Z',
    ipOrAgent: 'WhatsApp Opt-Out Webhook'
  }
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: 'audit_01',
    businessId: 'biz_purewild_001',
    actorId: 'usr_founder',
    actorName: 'Dhanaraj',
    role: 'Owner',
    action: 'VERIFY_PAYMENT',
    entityType: 'Order',
    entityId: 'ord_2026_088',
    details: 'Verified bank UTR payment of ₹1,412.90 for Dr. Anand Mahadevan. State moved to Paid.',
    timestamp: '2026-10-21T14:34:50Z',
    ipAddress: '122.178.44.12'
  },
  {
    id: 'audit_02',
    businessId: 'biz_purewild_001',
    actorId: 'sys_workflow',
    actorName: 'Workflow Engine',
    role: 'System',
    action: 'GENERATE_INVOICE',
    entityType: 'Invoice',
    entityId: 'inv_2026_088',
    details: 'Auto-generated GST tax invoice INV-2026-0088 from validated order data.',
    timestamp: '2026-10-21T14:35:00Z',
    ipAddress: '10.0.4.12'
  },
  {
    id: 'audit_03',
    businessId: 'biz_purewild_001',
    actorId: 'sys_webhook',
    actorName: 'Meta Webhook Receiver',
    role: 'System',
    action: 'INGEST_LEAD',
    entityType: 'Lead',
    entityId: 'lead_104',
    details: 'Validated incoming lead Sangeetha Raman. Checked consent & deduplication. Success.',
    timestamp: '2026-10-22T11:15:02Z',
    ipAddress: '31.13.115.12'
  },
  {
    id: 'audit_04',
    businessId: 'biz_purewild_001',
    actorId: 'usr_founder',
    actorName: 'Dhanaraj',
    role: 'Owner',
    action: 'STOCK_UPDATE',
    entityType: 'Settings',
    entityId: 'prod_honey_05',
    details: 'Updated Honeycomb Box stock to 0 (Out of Stock).',
    timestamp: '2026-10-20T17:00:00Z',
    ipAddress: '122.178.44.12'
  }
];
