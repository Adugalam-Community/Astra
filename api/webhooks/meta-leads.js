/**
 * Vercel Serverless Function: Meta Ads Leadgen Webhook Endpoint
 * Route: /api/webhooks/meta-leads
 */
import https from 'https';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 1. Meta Webhook Handshake Verification (GET request)
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    const expectedToken = process.env.META_VERIFY_TOKEN || 'scaleastra_meta_webhook_token_2026';

    if (mode === 'subscribe' && token === expectedToken && challenge) {
      console.log('✅ Meta Webhook Verification Handshake passed on Vercel!');
      res.setHeader('Content-Type', 'text/plain');
      return res.status(200).send(challenge);
    } else {
      console.warn('❌ Handshake failed: Invalid verify token or mode');
      return res.status(403).send('Forbidden');
    }
  }

  // 2. Inbound Meta Lead Event Processing (POST request)
  if (req.method === 'POST') {
    try {
      const payload = req.body || {};
      console.log('📩 Real-time Meta Lead received on Vercel:', JSON.stringify(payload));

      // Fast 200 response to Meta within timeout
      res.status(200).json({ status: 'EVENT_RECEIVED', timestamp: Date.now() });

      const changes = payload.entry?.[0]?.changes?.[0];
      const leadgenId = changes?.value?.leadgen_id;
      const pageAccessToken = process.env.META_PAGE_ACCESS_TOKEN;

      let fullName = 'Instagram Customer';
      let phone = '+91 98402 12345';
      let email = 'customer@example.com';
      let consent = true;

      if (leadgenId && pageAccessToken) {
        try {
          const graphUrl = `https://graph.facebook.com/v20.0/${leadgenId}?access_token=${encodeURIComponent(pageAccessToken)}`;
          const graphResponse = await fetch(graphUrl);
          const graphData = await graphResponse.json();

          if (graphData && graphData.field_data) {
            for (const f of graphData.field_data) {
              const val = f.values?.[0] || '';
              const k = f.name.toLowerCase();
              if (k.includes('full_name') || k === 'name') fullName = val;
              else if (k.includes('phone')) phone = val;
              else if (k.includes('email')) email = val;
              else if (k.includes('consent') || k.includes('whatsapp')) {
                consent = val.toLowerCase() === 'yes' || val === '1' || val.toLowerCase() === 'true';
              }
            }
          }
        } catch (fetchErr) {
          console.error('Error fetching Graph API lead details:', fetchErr);
        }
      } else if (payload.custom_test_lead) {
        fullName = payload.custom_test_lead.name || fullName;
        phone = payload.custom_test_lead.phone || phone;
        email = payload.custom_test_lead.email || email;
        consent = payload.custom_test_lead.consent !== undefined ? payload.custom_test_lead.consent : true;
      }

      // 10-digit Indian phone validation
      const cleanPhone = phone.replace(/\D/g, '').slice(-10);
      const isValidPhone = cleanPhone.length === 10 && /^[6-9]\d{9}$/.test(cleanPhone);

      // WhatsApp Cloud API Dispatch
      const whatsappToken = process.env.WHATSAPP_ACCESS_TOKEN;
      const whatsappPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

      if (whatsappToken && whatsappPhoneId && isValidPhone && consent) {
        console.log(`📲 Dispatching WhatsApp template to +91${cleanPhone}...`);
        await fetch(`https://graph.facebook.com/v20.0/${whatsappPhoneId}/messages`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${whatsappToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: `91${cleanPhone}`,
            type: 'template',
            template: {
              name: 'welcome_honey_catalogue_v1',
              language: { code: 'en' },
              components: [
                {
                  type: 'body',
                  parameters: [{ type: 'text', text: fullName }]
                },
                {
                  type: 'button',
                  sub_type: 'url',
                  index: 0,
                  parameters: [{ type: 'text', text: 'catalogue.pdf' }]
                }
              ]
            }
          })
        });
      }

      return;
    } catch (err) {
      console.error('Error in Vercel webhook function:', err);
      return res.status(400).json({ error: 'Failed to process lead' });
    }
  }

  return res.status(405).send('Method Not Allowed');
}
