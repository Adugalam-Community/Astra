import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  onSnapshot, 
  query, 
  orderBy, 
  limit,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { 
  Lead, 
  Customer, 
  Product, 
  Order, 
  Invoice, 
  WorkflowDefinition, 
  WorkflowExecution, 
  AuditLog, 
  ConsentRecord,
  BusinessWorkspace
} from '../types';

// ==========================================
// 1. Firebase Authentication Service
// ==========================================

export const signUpWithEmail = async (email: string, pass: string) => {
  return await createUserWithEmailAndPassword(auth, email, pass);
};

export const signInWithEmail = async (email: string, pass: string) => {
  return await signInWithEmailAndPassword(auth, email, pass);
};

export const signOutUser = async () => {
  return await signOut(auth);
};

export const subscribeToAuth = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// ==========================================
// 2. Cloud Firestore Real-Time Sync & CRUD
// ==========================================

// --- Leads ---
export const subscribeToLeads = (businessId: string, onUpdate: (leads: Lead[]) => void) => {
  const leadsRef = collection(db, 'businesses', businessId, 'leads');
  const q = query(leadsRef, orderBy('createdAt', 'desc'), limit(100));

  return onSnapshot(q, (snapshot) => {
    const leads: Lead[] = [];
    snapshot.forEach((doc) => {
      leads.push({ id: doc.id, ...doc.data() } as Lead);
    });
    onUpdate(leads);
  }, (err) => {
    console.warn('[Firestore] Error subscribing to leads:', err.message);
  });
};

export const saveLead = async (businessId: string, lead: Lead) => {
  const leadRef = doc(db, 'businesses', businessId, 'leads', lead.id);
  await setDoc(leadRef, {
    ...lead,
    syncedAt: new Date().toISOString()
  }, { merge: true });
};

// --- Customers ---
export const subscribeToCustomers = (businessId: string, onUpdate: (customers: Customer[]) => void) => {
  const custRef = collection(db, 'businesses', businessId, 'customers');
  const q = query(custRef, orderBy('createdAt', 'desc'), limit(100));

  return onSnapshot(q, (snapshot) => {
    const list: Customer[] = [];
    snapshot.forEach((doc) => {
      list.push({ id: doc.id, ...doc.data() } as Customer);
    });
    onUpdate(list);
  }, (err) => {
    console.warn('[Firestore] Error subscribing to customers:', err.message);
  });
};

export const saveCustomer = async (businessId: string, customer: Customer) => {
  const custRef = doc(db, 'businesses', businessId, 'customers', customer.id);
  await setDoc(custRef, customer, { merge: true });
};

// --- Products ---
export const subscribeToProducts = (businessId: string, onUpdate: (products: Product[]) => void) => {
  const prodRef = collection(db, 'businesses', businessId, 'products');

  return onSnapshot(prodRef, (snapshot) => {
    const list: Product[] = [];
    snapshot.forEach((doc) => {
      list.push({ id: doc.id, ...doc.data() } as Product);
    });
    onUpdate(list);
  }, (err) => {
    console.warn('[Firestore] Error subscribing to products:', err.message);
  });
};

export const saveProduct = async (businessId: string, product: Product) => {
  const prodRef = doc(db, 'businesses', businessId, 'products', product.id);
  await setDoc(prodRef, product, { merge: true });
};

// --- Orders ---
export const subscribeToOrders = (businessId: string, onUpdate: (orders: Order[]) => void) => {
  const orderRef = collection(db, 'businesses', businessId, 'orders');
  const q = query(orderRef, orderBy('createdAt', 'desc'), limit(100));

  return onSnapshot(q, (snapshot) => {
    const list: Order[] = [];
    snapshot.forEach((doc) => {
      list.push({ id: doc.id, ...doc.data() } as Order);
    });
    onUpdate(list);
  }, (err) => {
    console.warn('[Firestore] Error subscribing to orders:', err.message);
  });
};

export const saveOrder = async (businessId: string, order: Order) => {
  const orderRef = doc(db, 'businesses', businessId, 'orders', order.id);
  await setDoc(orderRef, order, { merge: true });
};

// --- Invoices ---
export const subscribeToInvoices = (businessId: string, onUpdate: (invoices: Invoice[]) => void) => {
  const invRef = collection(db, 'businesses', businessId, 'invoices');
  const q = query(invRef, orderBy('issuedAt', 'desc'), limit(100));

  return onSnapshot(q, (snapshot) => {
    const list: Invoice[] = [];
    snapshot.forEach((doc) => {
      list.push({ id: doc.id, ...doc.data() } as Invoice);
    });
    onUpdate(list);
  }, (err) => {
    console.warn('[Firestore] Error subscribing to invoices:', err.message);
  });
};

export const saveInvoice = async (businessId: string, invoice: Invoice) => {
  const invRef = doc(db, 'businesses', businessId, 'invoices', invoice.id);
  await setDoc(invRef, invoice, { merge: true });
};

// --- Workflows ---
export const subscribeToWorkflows = (businessId: string, onUpdate: (wfs: WorkflowDefinition[]) => void) => {
  const wfRef = collection(db, 'businesses', businessId, 'workflows');

  return onSnapshot(wfRef, (snapshot) => {
    const list: WorkflowDefinition[] = [];
    snapshot.forEach((doc) => {
      list.push({ id: doc.id, ...doc.data() } as WorkflowDefinition);
    });
    onUpdate(list);
  }, (err) => {
    console.warn('[Firestore] Error subscribing to workflows:', err.message);
  });
};

export const saveWorkflow = async (businessId: string, wf: WorkflowDefinition) => {
  const wfRef = doc(db, 'businesses', businessId, 'workflows', wf.id);
  await setDoc(wfRef, wf, { merge: true });
};

// --- Audit Logs ---
export const saveAuditLog = async (businessId: string, log: AuditLog) => {
  try {
    const logRef = doc(db, 'businesses', businessId, 'auditLogs', log.id);
    await setDoc(logRef, log);
  } catch (err) {
    console.warn('[Firestore] Audit log save failed (non-blocking):', err);
  }
};

// --- Initial Workspace Seeding ---
export const seedInitialWorkspaceData = async (
  businessId: string,
  workspace: BusinessWorkspace,
  leads: Lead[],
  customers: Customer[],
  products: Product[],
  orders: Order[],
  invoices: Invoice[],
  workflows: WorkflowDefinition[]
) => {
  try {
    const bizRef = doc(db, 'businesses', businessId);
    await setDoc(bizRef, workspace, { merge: true });

    // Seed products
    for (const prod of products) {
      await saveProduct(businessId, prod);
    }
    // Seed workflows
    for (const wf of workflows) {
      await saveWorkflow(businessId, wf);
    }
    // Seed initial leads
    for (const l of leads.slice(0, 5)) {
      await saveLead(businessId, l);
    }
    // Seed initial customers
    for (const c of customers.slice(0, 5)) {
      await saveCustomer(businessId, c);
    }
    // Seed initial orders
    for (const o of orders.slice(0, 5)) {
      await saveOrder(businessId, o);
    }
    // Seed initial invoices
    for (const inv of invoices.slice(0, 5)) {
      await saveInvoice(businessId, inv);
    }
    return true;
  } catch (error) {
    console.error('[Firestore] Seeding error:', error);
    return false;
  }
};
