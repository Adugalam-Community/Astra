import type { Plugin } from 'vite';
import https from 'node:https';
import crypto from 'node:crypto';

interface StoredInboundLead {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: string;
  status: 'New' | 'Contacted' | 'Lost';
  productInterest: string;
  notes: string;
  consentRef: string;
  consentStatus: 'Opted In' | 'Opted Out';
  isDuplicate?: boolean;
  receivedAt: string;
}

// In-memory queue of recent real-time leads received via HTTP Webhook
const recentInboundLeads: StoredInboundLead[] = [];
const processedEventIds = new Set<string>();

/**
 * ScaleAstra Real-Time Meta Ads & WhatsApp Webhook Server Plugin for Vite
 */
export function metaWebhookServerPlugin(): Plugin {
  return {
    name: 'scaleastra-meta-webhook-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const reqUrl = req.url || '';

        // -------------------------------------------------------------
        // 1. Meta Webhook Handshake Verification (GET request from Meta)
        // -------------------------------------------------------------
        if (req.method === 'GET' && reqUrl.startsWith('/api/webhooks/meta-leads')) {
          const url = new URL(reqUrl, `http://${req.headers.host || 'localhost:3000'}`);
          const mode = url.searchParams.get('hub.mode');
          const token = url.searchParams.get('hub.verify_token');
          const challenge = url.searchParams.get('hub.challenge');

          const expectedToken = process.env.META_VERIFY_TOKEN || 'scaleastra_meta_webhook_token_2026';

          if (mode === 'subscribe' && token === expectedToken && challenge) {
            console.log('✅ [ScaleAstra Webhook] Meta Webhook Verification Handshake SUCCEEDED! Responding with challenge.');
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.end(challenge);
            return;
          } else {
            console.warn(`❌ [ScaleAstra Webhook] Handshake rejected. Expected token "${expectedToken}", received "${token}"`);
            res.statusCode = 403;
            res.setHeader('Content-Type', 'text/plain');
            res.end('Forbidden: Invalid Verify Token');
            return;
          }
        }

        // -------------------------------------------------------------
        // 2. Inbound Meta Lead Ingestion (POST request from Meta)
        // -------------------------------------------------------------
        if (req.method === 'POST' && reqUrl.startsWith('/api/webhooks/meta-leads')) {
          let rawBody = '';
          req.on('data', chunk => { rawBody += chunk; });
          req.on('end', async () => {
            try {
              const payload = JSON.parse(rawBody || '{}');
              console.log('📩 [ScaleAstra Webhook] Inbound Meta Leadgen Event Received:', JSON.stringify(payload, null, 2));

              // Return 200 OK to Meta immediately within required 20-second timeout
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ status: 'EVENT_RECEIVED', timestamp: Date.now() }));

              // Process payload asynchronously
              const changes = payload.entry?.[0]?.changes?.[0];
              const leadgenId = changes?.value?.leadgen_id;
              const formId = changes?.value?.form_id;

              if (leadgenId) {
                // Idempotency check: has this event been processed?
                if (processedEventIds.has(leadgenId)) {
                  console.log(`⚠️ [ScaleAstra Webhook] Duplicate leadgen_id ${leadgenId} ignored (Idempotent protection).`);
                  return;
                }
                processedEventIds.add(leadgenId);

                const pageAccessToken = process.env.META_PAGE_ACCESS_TOKEN;
                let fullName = 'Meta Instagram Lead';
                let phone = '+91 98402 12345';
                let email = 'lead@example.com';
                let product = 'Raw Himalayan Wildflower Honey (500g)';
                let consent = true;

                if (pageAccessToken) {
                  // Fetch real data from Meta Graph API
                  try {
                    console.log(`🌐 [ScaleAstra Webhook] Querying Meta Graph API for leadgen_id: ${leadgenId}...`);
                    const graphData = await fetchMetaGraphLead(leadgenId, pageAccessToken);
                    if (graphData && graphData.field_data) {
                      for (const field of graphData.field_data) {
                        const val = field.values?.[0] || '';
                        const key = field.name.toLowerCase();
                        if (key.includes('full_name') || key === 'name') fullName = val;
                        else if (key.includes('phone')) phone = val;
                        else if (key.includes('email')) email = val;
                        else if (key.includes('consent') || key.includes('whatsapp')) {
                          consent = val.toLowerCase() === 'yes' || val === '1' || val.toLowerCase() === 'true';
                        }
                      }
                    }
                  } catch (fetchErr) {
                    console.error('Error fetching from Graph API:', fetchErr);
                  }
                } else if (payload.custom_test_lead) {
                  // Test lead submitted via live tester
                  fullName = payload.custom_test_lead.name || fullName;
                  phone = payload.custom_test_lead.phone || phone;
                  email = payload.custom_test_lead.email || email;
                  product = payload.custom_test_lead.product || product;
                  consent = payload.custom_test_lead.consent !== undefined ? payload.custom_test_lead.consent : true;
                }

                // Indian Phone format validation
                const cleanPhone = phone.replace(/\D/g, '').slice(-10);
                const isValidPhone = cleanPhone.length === 10 && /^[6-9]\d{9}$/.test(cleanPhone);
                const formattedPhone = isValidPhone ? `+91 ${cleanPhone.slice(0, 5)} ${cleanPhone.slice(5)}` : phone;

                // 48h deduplication check
                const isDuplicate = recentInboundLeads.some(l => l.phone.replace(/\D/g, '').slice(-10) === cleanPhone);

                // Dispatch WhatsApp Cloud API if live credentials exist
                const whatsappToken = process.env.WHATSAPP_ACCESS_TOKEN;
                const whatsappPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

                if (whatsappToken && whatsappPhoneId && isValidPhone && !isDuplicate && consent) {
                  console.log(`📲 [WhatsApp Cloud API] Dispatching approved template "welcome_honey_catalogue_v1" to +91${cleanPhone}...`);
                  await sendRealWhatsAppTemplate(whatsappPhoneId, whatsappToken, `91${cleanPhone}`, fullName);
                } else {
                  console.log(`ℹ️ [ScaleAstra Webhook] Ingested lead: ${fullName} (${formattedPhone}). WhatsApp template logged.`);
                }

                const newLead: StoredInboundLead = {
                  id: `lead_meta_${Date.now()}`,
                  name: fullName,
                  phone: formattedPhone,
                  email,
                  source: 'Meta Lead Form',
                  status: !isValidPhone ? 'Lost' : isDuplicate ? 'Lost' : consent ? 'Contacted' : 'Lost',
                  productInterest: product,
                  notes: `Live Webhook from Meta Form ID: ${formId || 'INSTANT_FORM'} (Leadgen ID: ${leadgenId})`,
                  consentRef: `CONS-META-${Date.now()}`,
                  consentStatus: consent ? 'Opted In' : 'Opted Out',
                  isDuplicate,
                  receivedAt: new Date().toISOString()
                };

                recentInboundLeads.unshift(newLead);
                if (recentInboundLeads.length > 50) recentInboundLeads.pop();
              }
            } catch (err: any) {
              console.error('Error parsing Meta Webhook POST:', err);
              res.statusCode = 400;
              res.end('Invalid Payload');
            }
          });
          return;
        }

        // -------------------------------------------------------------
        // 3. API endpoint for frontend to receive latest live leads
        // -------------------------------------------------------------
        if (req.method === 'GET' && reqUrl.startsWith('/api/webhooks/latest-leads')) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            status: 'online',
            webhookEndpoint: '/api/webhooks/meta-leads',
            verifyToken: process.env.META_VERIFY_TOKEN || 'scaleastra_meta_webhook_token_2026',
            leads: recentInboundLeads
          }));
          return;
        }

        next();
      });
    }
  };
}

/**
 * Fetch lead data from Meta Graph API v20.0
 */
function fetchMetaGraphLead(leadgenId: string, accessToken: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const url = `https://graph.facebook.com/v20.0/${leadgenId}?access_token=${encodeURIComponent(accessToken)}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

/**
 * Send real WhatsApp Cloud API template
 */
function sendRealWhatsAppTemplate(phoneId: string, token: string, toPhoneWithoutPlus: string, customerName: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      messaging_product: 'whatsapp',
      to: toPhoneWithoutPlus,
      type: 'template',
      template: {
        name: 'welcome_honey_catalogue_v1',
        language: { code: 'en' },
        components: [
          {
            type: 'body',
            parameters: [{ type: 'text', text: customerName }]
          },
          {
            type: 'button',
            sub_type: 'url',
            index: 0,
            parameters: [{ type: 'text', text: 'catalogue.pdf' }]
          }
        ]
      }
    });

    const options = {
      hostname: 'graph.facebook.com',
      path: `/v20.0/${phoneId}/messages`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          console.log('✅ WhatsApp API response:', data);
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    });

    req.on('error', (err) => {
      console.error('❌ Error sending WhatsApp Cloud API message:', err);
      reject(err);
    });

    req.write(payload);
    req.end();
  });
}
