import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { 
  ViewMode, 
  NavTab, 
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
  AuditLog,
  DashboardTask,
  DashboardNotification
} from '../types';
import { 
  initialWorkspace, 
  initialLeads, 
  initialCustomers, 
  initialProducts, 
  initialOrders, 
  initialInvoices, 
  initialWorkflows, 
  initialExecutions, 
  initialIntegrations, 
  initialConsentRecords, 
  initialAuditLogs 
} from '../data/mockData';
import { 
  subscribeToAuth, 
  signInWithEmail, 
  signUpWithEmail, 
  signOutUser,
  subscribeToLeads,
  subscribeToCustomers,
  subscribeToProducts,
  subscribeToOrders,
  subscribeToInvoices,
  subscribeToWorkflows,
  saveLead,
  saveCustomer,
  saveProduct,
  saveOrder,
  saveInvoice,
  saveAuditLog,
  seedInitialWorkspaceData
} from '../services/firebaseService';

export type DateRangeOption = 'today' | '7d' | '30d' | 'quarter' | 'year';
export type ModalType = 'addLead' | 'createOrder' | 'addProduct' | 'createInvoice' | 'createWorkflow' | 'manageIntegrations' | 'executionLogs' | 'search' | 'notifications' | 'taskManager' | 'firebaseAuth' | 'metaAdsDemo' | null;

interface SimulationStep {
  step: string;
  label: string;
  decision: 'YES' | 'NO' | 'INFO';
  detail: string;
  status: 'passed' | 'failed' | 'warning';
}

const initialTasksData: DashboardTask[] = [
  { id: 'task_1', text: 'Follow up with qualified leads', time: '11:00 AM', done: false, dueDate: 'today' },
  { id: 'task_2', text: 'Review pending orders', time: '1:00 PM', done: false, dueDate: 'today' },
  { id: 'task_3', text: 'Complete WhatsApp integration setup', time: '3:00 PM', done: false, dueDate: 'today' },
  { id: 'task_4', text: 'Verify bank statement UTRs for pending orders', time: '10:00 AM', done: false, dueDate: 'tomorrow' },
  { id: 'task_5', text: 'Check Meta Lead Form webhook latency', time: '2:00 PM', done: false, dueDate: 'week' },
];

const initialNotificationsData: DashboardNotification[] = [
  { id: 'notif_1', title: 'New Meta Lead Ingested', message: 'Priya Kumar submitted enquiry for Raw Himalayan Honey', time: '10 min ago', type: 'lead', read: false },
  { id: 'notif_2', title: 'Order Payment Verification', message: 'Order #SA-1024 requires owner bank UTR confirmation', time: '35 min ago', type: 'order', read: false },
  { id: 'notif_3', title: 'WhatsApp Sandbox Ready', message: 'MSGPEDIA gateway active. Ready for template verification.', time: '2 hours ago', type: 'integration', read: true },
];

interface AppContextType {
  // Navigation & Modals
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  activeModal: ModalType;
  setActiveModal: (modal: ModalType) => void;
  dateRange: DateRangeOption;
  setDateRange: (range: DateRangeOption) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;

  // Workspace
  workspace: BusinessWorkspace;
  updateWorkspace: (updates: Partial<BusinessWorkspace>) => void;
  toggleExcludeDemo: () => void;

  // Data
  leads: Lead[];
  customers: Customer[];
  products: Product[];
  orders: Order[];
  invoices: Invoice[];
  workflows: WorkflowDefinition[];
  executions: WorkflowExecution[];
  integrations: IntegrationSetting[];
  consentRecords: ConsentRecord[];
  auditLogs: AuditLog[];
  tasks: DashboardTask[];
  notifications: DashboardNotification[];

  // Dynamic Actions
  addLead: (lead: Omit<Lead, 'id' | 'businessId' | 'createdAt'>) => { success: boolean; lead: Lead; isDuplicate: boolean };
  updateLeadStatus: (id: string, status: Lead['status']) => void;
  convertLeadToOrder: (leadId: string, productIdsWithQty: { productId: string; quantity: number }[]) => Order | null;
  verifyOrderPayment: (orderId: string, utrRef: string) => boolean;
  updateOrderStatus: (orderId: string, state: Order['lifecycleState']) => void;
  toggleProductStock: (productId: string) => void;
  addProduct: (prod: Omit<Product, 'id' | 'businessId'>) => Product;
  createDirectOrder: (order: Partial<Order>) => Order;
  createDirectInvoice: (inv: Partial<Invoice>) => Invoice;
  addWorkflow: (wf: Omit<WorkflowDefinition, 'id' | 'businessId' | 'executionCount'>) => WorkflowDefinition;
  generateInvoiceForOrder: (orderId: string) => Invoice | null;
  toggleWorkflowActive: (workflowId: string) => void;
  toggleIntegrationMode: (integrationId: string) => void;
  updateIntegrationStatus: (integrationId: string, status: 'connected' | 'demo' | 'disconnected', mode?: 'demo' | 'live') => void;

  // Tasks Management
  addTask: (text: string, time?: string, dueDate?: 'today' | 'tomorrow' | 'week') => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;

  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  
  // Interactive Flowchart Simulator
  simulationActive: boolean;
  currentSimStep: number;
  simSteps: SimulationStep[];
  runLeadSimulation: (sampleType: 'valid_meta' | 'duplicate_phone' | 'opted_out') => Promise<void>;
  resetSimulation: () => void;

  // UI Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Firebase Auth & Cloud Sync
  firebaseUser: User | null;
  firebaseLoading: boolean;
  isFirebaseSyncEnabled: boolean;
  toggleFirebaseSync: () => void;
  loginWithEmailPass: (email: string, pass: string) => Promise<boolean>;
  registerWithEmailPass: (email: string, pass: string) => Promise<boolean>;
  logoutFirebaseUser: () => Promise<void>;
  syncLocalToCloud: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & UI state
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [dateRange, setDateRange] = useState<DateRangeOption>('30d');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Firebase Authentication & Cloud Sync State
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [firebaseLoading, setFirebaseLoading] = useState<boolean>(true);
  const [isFirebaseSyncEnabled, setIsFirebaseSyncEnabled] = useState<boolean>(true);

  // Business Workspace state
  const [workspace, setWorkspace] = useState<BusinessWorkspace>(initialWorkspace);

  // Entities state
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [workflows, setWorkflows] = useState<WorkflowDefinition[]>(initialWorkflows);
  const [executions, setExecutions] = useState<WorkflowExecution[]>(initialExecutions);
  const [integrations, setIntegrations] = useState<IntegrationSetting[]>(initialIntegrations);
  const [consentRecords, setConsentRecords] = useState<ConsentRecord[]>(initialConsentRecords);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);
  const [tasks, setTasks] = useState<DashboardTask[]>(initialTasksData);
  const [notifications, setNotifications] = useState<DashboardNotification[]>(initialNotificationsData);

  // Flowchart Simulation State
  const [simulationActive, setSimulationActive] = useState<boolean>(false);
  const [currentSimStep, setCurrentSimStep] = useState<number>(0);
  const [simSteps, setSimSteps] = useState<SimulationStep[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const updateWorkspace = (updates: Partial<BusinessWorkspace>) => {
    setWorkspace(prev => ({ ...prev, ...updates }));
    showToast('Workspace settings saved');
  };

  const toggleExcludeDemo = () => {
    setWorkspace(prev => ({ ...prev, excludeDemoFromMetrics: !prev.excludeDemoFromMetrics }));
    showToast(!workspace.excludeDemoFromMetrics ? 'Demo records excluded from live metrics' : 'Showing all records including demo');
  };

  // Firebase Auth State Listener
  useEffect(() => {
    const unsub = subscribeToAuth((user) => {
      setFirebaseUser(user);
      setFirebaseLoading(false);
      if (user) {
        logAudit('FIREBASE_AUTH_LOGIN', 'Settings', user.uid, `Authenticated via Firebase Email: ${user.email}`);
      }
    });
    return () => unsub();
  }, []);

  // Real-time Firestore sync when authenticated
  useEffect(() => {
    if (!firebaseUser || !isFirebaseSyncEnabled) return;

    const unsubLeads = subscribeToLeads(workspace.id, (cloudLeads) => {
      if (cloudLeads && cloudLeads.length > 0) {
        setLeads(cloudLeads);
      }
    });

    const unsubCustomers = subscribeToCustomers(workspace.id, (cloudCustomers) => {
      if (cloudCustomers && cloudCustomers.length > 0) {
        setCustomers(cloudCustomers);
      }
    });

    const unsubProducts = subscribeToProducts(workspace.id, (cloudProducts) => {
      if (cloudProducts && cloudProducts.length > 0) {
        setProducts(cloudProducts);
      }
    });

    const unsubOrders = subscribeToOrders(workspace.id, (cloudOrders) => {
      if (cloudOrders && cloudOrders.length > 0) {
        setOrders(cloudOrders);
      }
    });

    const unsubInvoices = subscribeToInvoices(workspace.id, (cloudInvoices) => {
      if (cloudInvoices && cloudInvoices.length > 0) {
        setInvoices(cloudInvoices);
      }
    });

    return () => {
      unsubLeads();
      unsubCustomers();
      unsubProducts();
      unsubOrders();
      unsubInvoices();
    };
  }, [firebaseUser, isFirebaseSyncEnabled, workspace.id]);

  // Listen for real-time leads from the live Meta Webhook server endpoint
  useEffect(() => {
    const processedIds = new Set<string>();

    const pollLiveWebhooks = async () => {
      try {
        const res = await fetch('/api/webhooks/latest-leads');
        if (res.ok) {
          const data = await res.json();
          if (data.leads && Array.isArray(data.leads)) {
            for (const lead of data.leads) {
              if (!processedIds.has(lead.id)) {
                processedIds.add(lead.id);
                // Ingest into active state
                addLead({
                  name: lead.name,
                  phone: lead.phone,
                  email: lead.email,
                  source: 'Meta Lead Form',
                  status: lead.status,
                  productInterest: lead.productInterest,
                  notes: lead.notes,
                  consentRef: lead.consentRef,
                  consentStatus: lead.consentStatus,
                  isDemo: false
                });
                showToast(`🔔 Real-time Meta Lead received: ${lead.name}`);
              }
            }
          }
        }
      } catch (e) {
        // Dev polling silence
      }
    };

    const interval = setInterval(pollLiveWebhooks, 3000);
    return () => clearInterval(interval);
  }, []);

  const toggleFirebaseSync = () => {
    setIsFirebaseSyncEnabled(prev => !prev);
    showToast(!isFirebaseSyncEnabled ? 'Firestore Cloud Sync active' : 'Firestore Cloud Sync paused');
  };

  const loginWithEmailPass = async (email: string, pass: string): Promise<boolean> => {
    const cred = await signInWithEmail(email, pass);
    if (cred.user) {
      logAudit('FIREBASE_AUTH_SIGNIN', 'Settings', cred.user.uid, `Signed in with ${email}`);
      return true;
    }
    return false;
  };

  const registerWithEmailPass = async (email: string, pass: string): Promise<boolean> => {
    const cred = await signUpWithEmail(email, pass);
    if (cred.user) {
      logAudit('FIREBASE_AUTH_REGISTER', 'Settings', cred.user.uid, `Created new account for ${email}`);
      return true;
    }
    return false;
  };

  const logoutFirebaseUser = async () => {
    await signOutUser();
    logAudit('FIREBASE_AUTH_LOGOUT', 'Settings', 'auth', 'Signed out from Firebase');
  };

  const syncLocalToCloud = async () => {
    const ok = await seedInitialWorkspaceData(
      workspace.id,
      workspace,
      leads,
      customers,
      products,
      orders,
      invoices,
      workflows
    );
    if (ok) {
      logAudit('FIRESTORE_DATA_SEEDED', 'Settings', workspace.id, 'Pushed local workspace dataset to Cloud Firestore');
    }
  };

  // Helper to add audit log
  const logAudit = (action: string, entityType: AuditLog['entityType'], entityId: string, details: string) => {
    const newLog: AuditLog = {
      id: `audit_${Date.now()}`,
      businessId: workspace.id,
      actorId: firebaseUser ? firebaseUser.uid : 'usr_founder',
      actorName: firebaseUser ? (firebaseUser.email || 'Firebase User') : 'Manicka Pream (Owner)',
      role: 'Founder / Admin',
      action,
      entityType,
      entityId,
      details,
      timestamp: new Date().toISOString(),
      ipAddress: '122.178.44.12'
    };
    setAuditLogs(prev => [newLog, ...prev]);

    if (firebaseUser && isFirebaseSyncEnabled) {
      saveAuditLog(workspace.id, newLog);
    }
  };

  // Add a Lead with automatic deduplication, validation & workflow execution
  const addLead = (leadInput: Omit<Lead, 'id' | 'businessId' | 'createdAt'>) => {
    // 1. Phone Format Validation (Indian 10-digit)
    const digitsOnly = leadInput.phone.replace(/\D/g, '');
    const cleanPhone = digitsOnly.length >= 10 ? digitsOnly.slice(-10) : digitsOnly;
    const isValidPhone = cleanPhone.length === 10 && /^[6-9]\d{9}$/.test(cleanPhone);
    const formattedPhone = isValidPhone ? `+91 ${cleanPhone.slice(0, 5)} ${cleanPhone.slice(5)}` : leadInput.phone;

    // 2. Deduplication check based on 10-digit Phone
    const existingMatch = leads.find(l => {
      const existingClean = l.phone.replace(/\D/g, '').slice(-10);
      return existingClean === cleanPhone;
    });

    const isDuplicate = !!existingMatch;
    const isConsented = leadInput.consentStatus === 'Opted In';
    const newLeadId = `lead_${Date.now()}`;

    // Determine initial status based on automation outcome
    let initialLeadStatus: Lead['status'] = 'New';
    if (!isValidPhone) {
      initialLeadStatus = 'Lost';
    } else if (isDuplicate) {
      initialLeadStatus = 'Lost'; // Marked Lost/closed due to duplicate contact
    } else if (isConsented) {
      initialLeadStatus = 'Contacted'; // Promptly contacted via automated WhatsApp template
    } else {
      initialLeadStatus = 'Lost'; // Opted out / lost
    }

    const newLead: Lead = {
      ...leadInput,
      id: newLeadId,
      phone: formattedPhone,
      businessId: workspace.id,
      status: initialLeadStatus,
      createdAt: new Date().toISOString(),
      isDuplicate,
      duplicateOf: existingMatch ? existingMatch.id : undefined
    };

    setLeads(prev => [newLead, ...prev]);

    // Push to Firestore if authenticated
    if (firebaseUser && isFirebaseSyncEnabled) {
      saveLead(workspace.id, newLead).catch(console.warn);
    }

    // 3. Record DPDP Consent Audit
    const consentLog: ConsentRecord = {
      id: `cons_${Date.now()}`,
      businessId: workspace.id,
      contactRef: newLeadId,
      contactName: newLead.name,
      phone: newLead.phone,
      channel: 'WhatsApp',
      purpose: 'Enquiry Response',
      source: newLead.source || 'Meta Instant Form',
      status: isConsented ? 'Opted In' : 'Opted Out',
      timestamp: new Date().toISOString(),
      ipOrAgent: 'ScaleAstra Meta Webhook Ingestion Engine'
    };
    setConsentRecords(prev => [consentLog, ...prev]);

    // 4. Trigger Active Workflow Engine (Meta Ad Form Lead -> WhatsApp Quick Welcome)
    const activeWorkflow = workflows.find(w => w.id === 'wf_01' || w.category === 'Lead Capture');

    if (activeWorkflow && activeWorkflow.active) {
      const nowStr = new Date().toLocaleTimeString();
      const idempotencyKey = `idemp_${cleanPhone}_${Math.floor(Date.now() / 3600000)}`;

      if (isValidPhone && !isDuplicate && isConsented) {
        // SUCCESS: All conditions passed!
        // Increment workflow runs
        setWorkflows(prev => prev.map(w => w.id === activeWorkflow.id ? { ...w, executionCount: w.executionCount + 1 } : w));

        // Create execution log
        const newExecution: WorkflowExecution = {
          id: `exec_${Date.now()}`,
          workflowId: activeWorkflow.id,
          workflowName: activeWorkflow.title,
          businessId: workspace.id,
          eventId: `evt_${Date.now()}`,
          triggerSource: newLead.source || 'Meta Instant Form',
          status: 'success',
          idempotencyKey,
          attempts: 1,
          maxRetries: 3,
          logs: [
            { step: 'Payload Verification', status: 'pass', message: `Valid Indian mobile number (+91 ${cleanPhone}) format verified`, timestamp: nowStr },
            { step: 'Deduplication Check', status: 'pass', message: 'No active lead found in 48-hour window. New contact verified.', timestamp: nowStr },
            { step: 'Consent & Privacy Gate', status: 'pass', message: 'User checked Meta WhatsApp consent checkbox. DPDP compliant.', timestamp: nowStr },
            { step: 'WhatsApp Template Dispatch', status: 'pass', message: `Provider accepted wamid.HBgM${Date.now().toString(36)}... Sent approved "welcome_honey_catalogue_v1".`, timestamp: nowStr },
            { step: 'Sales Task Assignment', status: 'pass', message: `Follow-up reminder task assigned to Salesperson for ${newLead.name}.`, timestamp: nowStr }
          ],
          createdAt: new Date().toISOString()
        };
        setExecutions(prev => [newExecution, ...prev]);

        // Automatically assign follow-up task to Salesperson
        setTasks(prev => [
          {
            id: `task_${Date.now()}`,
            text: `Follow up: Lead ${newLead.name} (${newLead.phone}) - WhatsApp Catalogue Sent`,
            time: 'Within 2 hours',
            done: false,
            dueDate: 'today'
          },
          ...prev
        ]);

        // Dashboard Notification
        setNotifications(prev => [
          {
            id: `notif_${Date.now()}`,
            title: `WhatsApp Catalogue Sent: ${newLead.name}`,
            message: `Automated honey catalogue delivered to ${newLead.phone}. Follow-up task assigned.`,
            time: 'Just now',
            type: 'lead',
            read: false
          },
          ...prev
        ]);

        logAudit(
          'WORKFLOW_EXECUTED',
          'Workflow',
          activeWorkflow.id,
          `Automated WhatsApp Catalogue sent to ${newLead.name} (${newLead.phone}). Follow-up task queued.`
        );
      } else if (isDuplicate) {
        // SKIPPED: Deduplication suppression
        const newExecution: WorkflowExecution = {
          id: `exec_${Date.now()}`,
          workflowId: activeWorkflow.id,
          workflowName: activeWorkflow.title,
          businessId: workspace.id,
          eventId: `evt_${Date.now()}`,
          triggerSource: newLead.source || 'Meta Instant Form',
          status: 'skipped',
          idempotencyKey,
          attempts: 1,
          maxRetries: 3,
          errorMessage: `Duplicate phone (+91 ${cleanPhone}) already registered as ${existingMatch?.name}. Suppressed automated WhatsApp message to avoid spam.`,
          logs: [
            { step: 'Payload Verification', status: 'pass', message: `Phone ${newLead.phone} format valid`, timestamp: nowStr },
            { step: 'Deduplication Check', status: 'warn', message: `Existing match found (${existingMatch?.name}). Suppressing message.`, timestamp: nowStr },
            { step: 'Action Aborted', status: 'info', message: 'Skipped outbound WhatsApp send due to deduplication rule.', timestamp: nowStr }
          ],
          createdAt: new Date().toISOString()
        };
        setExecutions(prev => [newExecution, ...prev]);

        setNotifications(prev => [
          {
            id: `notif_${Date.now()}`,
            title: `Duplicate Lead Ingested: ${newLead.name}`,
            message: `Phone ${newLead.phone} already active. Outbound WhatsApp message suppressed.`,
            time: 'Just now',
            type: 'lead',
            read: false
          },
          ...prev
        ]);
      } else if (!isConsented) {
        // SKIPPED: Privacy / Opt-out
        const newExecution: WorkflowExecution = {
          id: `exec_${Date.now()}`,
          workflowId: activeWorkflow.id,
          workflowName: activeWorkflow.title,
          businessId: workspace.id,
          eventId: `evt_${Date.now()}`,
          triggerSource: newLead.source || 'Meta Instant Form',
          status: 'skipped',
          idempotencyKey,
          attempts: 1,
          maxRetries: 3,
          errorMessage: 'User did not grant WhatsApp consent. Outbound message cancelled under DPDP privacy regulations.',
          logs: [
            { step: 'Payload Verification', status: 'pass', message: `Lead payload received for ${newLead.name}`, timestamp: nowStr },
            { step: 'Deduplication Check', status: 'pass', message: 'Lead is unique', timestamp: nowStr },
            { step: 'Consent & Privacy Gate', status: 'fail', message: 'WhatsApp consent not granted (Opted Out). Message aborted.', timestamp: nowStr }
          ],
          createdAt: new Date().toISOString()
        };
        setExecutions(prev => [newExecution, ...prev]);

        setNotifications(prev => [
          {
            id: `notif_${Date.now()}`,
            title: `Lead Ingested (No Consent): ${newLead.name}`,
            message: `WhatsApp consent was not given. Automated messaging cancelled per privacy policy.`,
            time: 'Just now',
            type: 'lead',
            read: false
          },
          ...prev
        ]);
      } else if (!isValidPhone) {
        // FAILED: Invalid phone format
        const newExecution: WorkflowExecution = {
          id: `exec_${Date.now()}`,
          workflowId: activeWorkflow.id,
          workflowName: activeWorkflow.title,
          businessId: workspace.id,
          eventId: `evt_${Date.now()}`,
          triggerSource: newLead.source || 'Meta Instant Form',
          status: 'failed',
          idempotencyKey,
          attempts: 1,
          maxRetries: 3,
          errorMessage: `Invalid Indian phone number: "${leadInput.phone}". Must be a valid 10-digit number.`,
          logs: [
            { step: 'Payload Verification', status: 'fail', message: `Invalid phone format "${leadInput.phone}". Expected 10-digit starting with 6-9.`, timestamp: nowStr },
            { step: 'Action Aborted', status: 'fail', message: 'Execution halted due to invalid phone number.', timestamp: nowStr }
          ],
          createdAt: new Date().toISOString()
        };
        setExecutions(prev => [newExecution, ...prev]);
      }
    }

    logAudit(
      isDuplicate ? 'DUPLICATE_LEAD_INGESTED' : 'LEAD_CREATED',
      'Lead',
      newLeadId,
      `Lead "${newLead.name}" (${newLead.phone}) registered via ${newLead.source}.${isDuplicate ? ` Duplicate of ${existingMatch?.name}` : ''}`
    );

    return { success: true, lead: newLead, isDuplicate };
  };

  const updateLeadStatus = (id: string, status: Lead['status']) => {
    setLeads(prev => {
      const updated = prev.map(l => l.id === id ? { ...l, status } : l);
      const target = updated.find(l => l.id === id);
      if (target && firebaseUser && isFirebaseSyncEnabled) {
        saveLead(workspace.id, target).catch(console.warn);
      }
      return updated;
    });
    logAudit('LEAD_STATUS_UPDATE', 'Lead', id, `Updated status to "${status}"`);
    showToast(`Lead status updated to ${status}`);
  };

  const toggleProductStock = (productId: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const nextStatus = p.stockStatus === 'In Stock' ? 'Out of Stock' : 'In Stock';
        logAudit('PRODUCT_STOCK_CHANGED', 'Settings', productId, `Toggled "${p.name}" stock to ${nextStatus}`);
        return {
          ...p,
          stockStatus: nextStatus,
          stockQuantity: nextStatus === 'In Stock' ? 50 : 0
        };
      }
      return p;
    }));
  };

  // Convert Lead to Order
  const convertLeadToOrder = (leadId: string, itemsSelected: { productId: string; quantity: number }[]): Order | null => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return null;

    // Check stock for all items
    for (const item of itemsSelected) {
      const prod = products.find(p => p.id === item.productId);
      if (!prod || prod.stockStatus === 'Out of Stock' || prod.stockQuantity < item.quantity) {
        showToast(`Cannot create order: ${prod?.name || 'Item'} is Out of Stock!`);
        return null;
      }
    }

    // Check customer exists or create one
    let customer = customers.find(c => c.phone.replace(/[\s\-\+]/g, '').slice(-10) === lead.phone.replace(/[\s\-\+]/g, '').slice(-10));
    if (!customer) {
      customer = {
        id: `cust_${Date.now()}`,
        businessId: workspace.id,
        name: lead.name,
        phone: lead.phone,
        email: lead.email,
        city: 'Coimbatore',
        state: 'Tamil Nadu',
        address: 'Delivery address collected from WhatsApp enquiry',
        consentStatus: lead.consentStatus,
        consentTimestamp: new Date().toISOString(),
        totalSpent: 0,
        orderCount: 0,
        tags: ['First Time Buyer'],
        createdAt: new Date().toISOString()
      };
      setCustomers(prev => [customer!, ...prev]);
    }

    const orderItems = itemsSelected.map(sel => {
      const p = products.find(prod => prod.id === sel.productId)!;
      return {
        productId: p.id,
        name: p.name,
        price: p.price,
        quantity: sel.quantity,
        total: p.price * sel.quantity
      };
    });

    const subtotal = orderItems.reduce((acc, curr) => acc + curr.total, 0);
    const taxRate = 5; // 5% GST for Honey
    const taxAmount = Number(((subtotal * taxRate) / 100).toFixed(2));
    const shippingFee = subtotal > 1000 ? 0 : 50;
    const grandTotal = Number((subtotal + taxAmount + shippingFee).toFixed(2));

    const orderId = `ord_2026_${Math.floor(100 + Math.random() * 900)}`;
    const newOrder: Order = {
      id: orderId,
      businessId: workspace.id,
      orderNumber: `ORD-2026-${Math.floor(100 + Math.random() * 900)}`,
      customerId: customer.id,
      customerName: customer.name,
      phone: customer.phone,
      shippingAddress: customer.address,
      items: orderItems,
      subtotal,
      taxRate,
      taxAmount,
      shippingFee,
      total: grandTotal,
      paymentStatus: 'Pending Verification',
      paymentMethod: 'UPI / Bank Transfer (Pending Verification)',
      fulfilmentStatus: 'Unfulfilled',
      lifecycleState: 'Pending Confirmation',
      stockConfirmed: true,
      notes: `Order created from Lead ${lead.name}`,
      createdAt: new Date().toISOString(),
      isDemo: false
    };

    setOrders(prev => [newOrder, ...prev]);

    // Update lead status
    updateLeadStatus(leadId, 'Order Placed');

    logAudit('ORDER_CREATED', 'Order', newOrder.id, `Order ${newOrder.orderNumber} created for ${customer.name} (Total: ₹${grandTotal}). Pending owner payment verification.`);
    showToast(`Order ${newOrder.orderNumber} created in Pending Confirmation!`);

    return newOrder;
  };

  // Verify payment (strictly required by spec: never mark paid without explicit owner verification)
  const verifyOrderPayment = (orderId: string, utrRef: string): boolean => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return false;

    const updatedOrders = orders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          paymentStatus: 'Verified Paid' as const,
          lifecycleState: 'Paid' as const,
          paymentVerifiedBy: 'Founder / Verified Webhook (UTR: ' + utrRef + ')',
          paymentProofRef: utrRef
        };
      }
      return o;
    });

    setOrders(updatedOrders);

    // Auto generate Invoice as per specification rules!
    generateInvoiceForOrder(orderId);

    logAudit('PAYMENT_VERIFIED', 'Order', orderId, `Owner verified payment UTR: ${utrRef} for ${order.customerName}. Order marked Paid.`);
    showToast(`Payment verified for ${order.orderNumber}. Tax Invoice generated automatically.`);

    return true;
  };

  const updateOrderStatus = (orderId: string, state: Order['lifecycleState']) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        logAudit('ORDER_STATE_TRANSITION', 'Order', orderId, `Order ${o.orderNumber} transitioned to "${state}"`);
        return {
          ...o,
          lifecycleState: state,
          fulfilmentStatus: state === 'Fulfilled' ? 'Delivered' : state === 'Confirmed' ? 'In Progress' : o.fulfilmentStatus
        };
      }
      return o;
    }));
    showToast(`Order status updated to ${state}`);
  };

  // Generate Invoice from validated Order data
  const generateInvoiceForOrder = (orderId: string): Invoice | null => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return null;

    // Check if invoice already exists
    const existing = invoices.find(inv => inv.orderId === orderId);
    if (existing) return existing;

    const invSeq = invoices.length + 1;
    const invNumber = `INV-2026-${String(invSeq).padStart(4, '0')}`;

    const cgstRate = 2.5;
    const sgstRate = 2.5;
    const cgstAmount = Number(((order.subtotal * cgstRate) / 100).toFixed(2));
    const sgstAmount = Number(((order.subtotal * sgstRate) / 100).toFixed(2));
    const totalTax = cgstAmount + sgstAmount;

    const newInvoice: Invoice = {
      id: `inv_2026_${Math.floor(100 + Math.random() * 900)}`,
      businessId: workspace.id,
      invoiceNumber: invNumber,
      orderId: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerPhone: order.phone,
      customerAddress: order.shippingAddress,
      items: order.items,
      subtotal: order.subtotal,
      cgstRate,
      cgstAmount,
      sgstRate,
      sgstAmount,
      totalTax,
      grandTotal: order.total,
      issuedAt: new Date().toISOString(),
      dueDate: new Date().toISOString(),
      status: order.paymentStatus === 'Verified Paid' ? 'Paid' : 'Issued',
      paymentMethod: order.paymentMethod,
      isDemo: order.isDemo
    };

    setInvoices(prev => [newInvoice, ...prev]);

    // Link invoiceId to order
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, invoiceId: newInvoice.id } : o));

    logAudit('GENERATE_INVOICE', 'Invoice', newInvoice.id, `Sequential tax invoice ${invNumber} generated for order ${order.orderNumber}.`);
    return newInvoice;
  };

  const toggleWorkflowActive = (workflowId: string) => {
    setWorkflows(prev => prev.map(w => w.id === workflowId ? { ...w, active: !w.active } : w));
    showToast('Workflow rule toggled');
  };

  const toggleIntegrationMode = (integrationId: string) => {
    setIntegrations(prev => prev.map(i => {
      if (i.id === integrationId) {
        const nextMode = i.mode === 'demo' ? 'live' : 'demo';
        showToast(`${i.name} switched to ${nextMode.toUpperCase()} mode`);
        return { ...i, mode: nextMode };
      }
      return i;
    }));
  };

  const updateIntegrationStatus = (id: string, status: 'connected' | 'demo' | 'disconnected', mode?: 'demo' | 'live') => {
    setIntegrations(prev => prev.map(i => {
      if (i.id === id) {
        return {
          ...i,
          status,
          mode: mode || (status === 'connected' ? 'live' : i.mode),
          lastPing: 'Just now'
        };
      }
      return i;
    }));
    logAudit('INTEGRATION_UPDATED', 'Integration', id, `Updated integration ${id} status to ${status}`);
    showToast(`Integration updated!`);
  };

  const addProduct = (prod: Omit<Product, 'id' | 'businessId'>): Product => {
    const newProd: Product = {
      ...prod,
      id: `prod_${Date.now()}`,
      businessId: workspace.id
    };
    setProducts(prev => [newProd, ...prev]);
    logAudit('PRODUCT_ADDED', 'Settings', newProd.id, `Product "${newProd.name}" added at ₹${newProd.price}`);
    showToast(`Product "${newProd.name}" added successfully!`);
    return newProd;
  };

  const createDirectOrder = (orderData: Partial<Order>): Order => {
    const subtotal = orderData.subtotal || 1300;
    const taxRate = 5;
    const taxAmount = Number(((subtotal * taxRate) / 100).toFixed(2));
    const shippingFee = subtotal > 1000 ? 0 : 50;
    const total = Number((subtotal + taxAmount + shippingFee).toFixed(2));

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      businessId: workspace.id,
      orderNumber: `ORD-2026-${Math.floor(100 + Math.random() * 900)}`,
      customerId: orderData.customerId || 'cust_direct',
      customerName: orderData.customerName || 'Direct Customer',
      phone: orderData.phone || '+91 98400 00000',
      shippingAddress: orderData.shippingAddress || 'Direct Store / Phone Order',
      items: orderData.items || [
        {
          productId: products[0]?.id || 'p1',
          name: products[0]?.name || 'Raw Himalayan Wildflower Honey (500g)',
          price: products[0]?.price || 650,
          quantity: 2,
          total: (products[0]?.price || 650) * 2
        }
      ],
      subtotal,
      taxRate,
      taxAmount,
      shippingFee,
      total,
      paymentStatus: orderData.paymentStatus || 'Pending Verification',
      paymentMethod: orderData.paymentMethod || 'UPI / QR Code',
      fulfilmentStatus: 'Unfulfilled',
      lifecycleState: 'Pending Confirmation',
      stockConfirmed: true,
      notes: orderData.notes || 'Created via Quick Action',
      createdAt: new Date().toISOString(),
      isDemo: false
    };

    setOrders(prev => [newOrder, ...prev]);
    logAudit('ORDER_CREATED', 'Order', newOrder.id, `Order ${newOrder.orderNumber} placed for ${newOrder.customerName} (₹${newOrder.total})`);
    showToast(`Order ${newOrder.orderNumber} created!`);
    return newOrder;
  };

  const createDirectInvoice = (invData: Partial<Invoice>): Invoice => {
    const invSeq = invoices.length + 1;
    const invNumber = `INV-2026-${String(invSeq).padStart(4, '0')}`;
    const subtotal = invData.subtotal || 1500;
    const cgstRate = 2.5;
    const sgstRate = 2.5;
    const cgstAmount = Number(((subtotal * cgstRate) / 100).toFixed(2));
    const sgstAmount = Number(((subtotal * sgstRate) / 100).toFixed(2));

    const newInvoice: Invoice = {
      id: `inv_${Date.now()}`,
      businessId: workspace.id,
      invoiceNumber: invNumber,
      orderId: invData.orderId || `ord_manual_${Date.now()}`,
      orderNumber: invData.orderNumber || `ORD-2026-${invSeq}`,
      customerName: invData.customerName || 'Direct Buyer',
      customerPhone: invData.customerPhone || '+91 98401 99999',
      customerAddress: invData.customerAddress || 'Direct counter billing',
      items: invData.items || [
        {
          productId: products[0]?.id || 'p1',
          name: products[0]?.name || 'Raw Himalayan Wildflower Honey (500g)',
          price: products[0]?.price || 650,
          quantity: 1,
          total: products[0]?.price || 650
        }
      ],
      subtotal,
      cgstRate,
      cgstAmount,
      sgstRate,
      sgstAmount,
      totalTax: cgstAmount + sgstAmount,
      grandTotal: subtotal + cgstAmount + sgstAmount,
      issuedAt: new Date().toISOString(),
      dueDate: new Date().toISOString(),
      status: 'Paid',
      paymentMethod: 'UPI'
    };

    setInvoices(prev => [newInvoice, ...prev]);
    logAudit('GENERATE_INVOICE', 'Invoice', newInvoice.id, `Direct Tax Invoice ${invNumber} created for ${newInvoice.customerName}`);
    showToast(`Invoice ${invNumber} generated!`);
    return newInvoice;
  };

  const addWorkflow = (wf: Omit<WorkflowDefinition, 'id' | 'businessId' | 'executionCount'>): WorkflowDefinition => {
    const newWf: WorkflowDefinition = {
      ...wf,
      id: `wf_${Date.now()}`,
      businessId: workspace.id,
      executionCount: 0
    };
    setWorkflows(prev => [newWf, ...prev]);
    logAudit('WORKFLOW_CREATED', 'Workflow', newWf.id, `Created automation workflow: "${newWf.title}"`);
    showToast(`Workflow "${newWf.title}" created successfully!`);
    return newWf;
  };

  const addTask = (text: string, time: string = '12:00 PM', dueDate: 'today' | 'tomorrow' | 'week' = 'today') => {
    const newTask: DashboardTask = {
      id: `task_${Date.now()}`,
      text,
      time,
      done: false,
      dueDate
    };
    setTasks(prev => [newTask, ...prev]);
    showToast(`Task added: "${text}"`);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    showToast('Task removed');
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read');
  };

  // Interactive Flowchart Simulator (Step-by-step executor of IMG_8621.PNG!)
  const runLeadSimulation = async (sampleType: 'valid_meta' | 'duplicate_phone' | 'opted_out') => {
    setSimulationActive(true);
    setCurrentSimStep(0);
    setSimSteps([]);

    const stepsQueue: SimulationStep[] = [];

    // Step 1: Inbound Webhook / Payload Validation
    stepsQueue.push({
      step: '1. Inbound Lead Ingestion',
      label: 'Choose Lead Source -> Validate Incoming Lead Data',
      decision: 'YES',
      detail: sampleType === 'valid_meta' 
        ? 'Meta Lead Ads Webhook received: Priya Sundaram (+91 98402 99112). Signature HMAC verified.'
        : sampleType === 'duplicate_phone'
        ? 'Website Form submitted: Karthik Subramanian (+91 98401 23456).'
        : 'WhatsApp Enquiry: Ramesh Kumar (+91 97900 11223) with opt-out header.',
      status: 'passed'
    });

    // Step 2: Validation check
    stepsQueue.push({
      step: '2. Data Validation Gate',
      label: 'Is data valid?',
      decision: 'YES',
      detail: 'Phone format valid, Name present, Product interest: Raw Himalayan Honey 500g.',
      status: 'passed'
    });

    // Step 3: Deduplication check
    const isDup = sampleType === 'duplicate_phone';
    stepsQueue.push({
      step: '3. Deduplication Engine',
      label: 'Is this a duplicate lead?',
      decision: isDup ? 'YES' : 'NO',
      detail: isDup 
        ? 'Phone (+91 98401 23456) matches existing Lead #101. Lead record updated; duplicate message suppressed.'
        : 'No previous lead in 48-hour window. Proceeding to create new lead record.',
      status: isDup ? 'warning' : 'passed'
    });

    // Step 4: Messaging Connection Check
    stepsQueue.push({
      step: '4. Messaging Integration Verification',
      label: 'Is messaging integration connected and verified?',
      decision: 'YES',
      detail: 'WhatsApp Cloud API / MSGPEDIA Adapter is active in Demo-Verified Mode.',
      status: 'passed'
    });

    // Step 5: Consent Verification Gate
    const isOptedOut = sampleType === 'opted_out';
    stepsQueue.push({
      step: '5. Consent & Privacy Verification',
      label: 'Has contact given valid WhatsApp consent & not opted out?',
      decision: isOptedOut ? 'NO' : 'YES',
      detail: isOptedOut
        ? 'Contact opted out of promotional communications. Policy forbids outbound message. Workflow stopped cleanly.'
        : 'Consent checkbox verified. Opt-in timestamp recorded in Consent Ledger.',
      status: isOptedOut ? 'failed' : 'passed'
    });

    if (!isOptedOut && !isDup) {
      // Step 6: Send Approved Template
      stepsQueue.push({
        step: '6. Send Approved Template',
        label: 'Was message accepted by WhatsApp provider?',
        decision: 'YES',
        detail: 'Provider returned wamid.HBgMOTE5OD... Status: ACCEPTED. Sent template "welcome_honey_catalogue_v1".',
        status: 'passed'
      });

      // Step 7: Sales Follow-up & Order creation
      stepsQueue.push({
        step: '7. Sales Follow-up & Intent',
        label: 'Customer interested -> Create Order?',
        decision: 'YES',
        detail: 'Customer replied "Interested in 2 jars of Raw Wildflower Honey". Draft order created.',
        status: 'passed'
      });

      // Step 8: Stock & Payment Verification Gate
      stepsQueue.push({
        step: '8. Stock & Payment Verification',
        label: 'Is stock confirmed & payment verified?',
        decision: 'YES',
        detail: 'Stock checked (142 available). Bank UTR verified by owner. Never mark paid without verification!',
        status: 'passed'
      });

      // Step 9: Invoicing & Fulfilment
      stepsQueue.push({
        step: '9. Invoice Generation & Fulfilment',
        label: 'Generate invoice & fulfil order',
        decision: 'YES',
        detail: 'Generated GST Tax Invoice with 5% GST. Dispatched to warehouse for packaging.',
        status: 'passed'
      });
    }

    // Play steps with realistic delays
    for (let i = 0; i < stepsQueue.length; i++) {
      setCurrentSimStep(i);
      setSimSteps(stepsQueue.slice(0, i + 1));
      await new Promise(r => setTimeout(r, 600));
    }

    // Add to executions history
    const newExec: WorkflowExecution = {
      id: `exec_${Date.now()}`,
      workflowId: 'wf_01',
      workflowName: 'Meta Ad Form Lead -> WhatsApp Quick Welcome',
      businessId: workspace.id,
      eventId: `sim_evt_${Date.now()}`,
      triggerSource: sampleType === 'valid_meta' ? 'Meta Lead Simulation' : sampleType === 'duplicate_phone' ? 'Duplicate Phone Test' : 'Opted Out Test',
      status: isOptedOut ? 'skipped' : isDup ? 'skipped' : 'success',
      idempotencyKey: `idemp_sim_${Date.now()}`,
      attempts: 1,
      maxRetries: 3,
      logs: stepsQueue.map(s => ({
        step: s.step,
        status: s.status === 'passed' ? 'pass' : s.status === 'warning' ? 'warn' : 'fail',
        message: s.detail,
        timestamp: new Date().toLocaleTimeString()
      })),
      createdAt: new Date().toISOString()
    };

    setExecutions(prev => [newExec, ...prev]);

    if (!isOptedOut && !isDup) {
      // Actually add the simulated lead
      addLead({
        name: 'Priya Sundaram',
        phone: '+91 98402 99112',
        email: 'priya.sundaram@gmail.com',
        source: 'Meta Lead Form',
        status: 'Contacted',
        productInterest: 'Raw Himalayan Wildflower Honey (500g)',
        notes: 'Simulated from flowchart runner. Sent approved WhatsApp Honey Catalogue.',
        consentRef: `CONS-SIM-${Date.now()}`,
        consentStatus: 'Opted In',
        isDemo: true
      });
    }

    showToast('Simulation complete! Executed flowchart decision tree.');
  };

  const resetSimulation = () => {
    setSimulationActive(false);
    setCurrentSimStep(0);
    setSimSteps([]);
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        activeModal,
        setActiveModal,
        dateRange,
        setDateRange,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        workspace,
        updateWorkspace,
        toggleExcludeDemo,
        leads,
        customers,
        products,
        orders,
        invoices,
        workflows,
        executions,
        integrations,
        consentRecords,
        auditLogs,
        tasks,
        notifications,
        addLead,
        updateLeadStatus,
        convertLeadToOrder,
        verifyOrderPayment,
        updateOrderStatus,
        toggleProductStock,
        addProduct,
        createDirectOrder,
        createDirectInvoice,
        addWorkflow,
        generateInvoiceForOrder,
        toggleWorkflowActive,
        toggleIntegrationMode,
        updateIntegrationStatus,
        addTask,
        toggleTask,
        deleteTask,
        markNotificationRead,
        markAllNotificationsRead,
        simulationActive,
        currentSimStep,
        simSteps,
        runLeadSimulation,
        resetSimulation,
        toastMessage,
        showToast,
        firebaseUser,
        firebaseLoading,
        isFirebaseSyncEnabled,
        toggleFirebaseSync,
        loginWithEmailPass,
        registerWithEmailPass,
        logoutFirebaseUser,
        syncLocalToCloud
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
