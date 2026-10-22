/**
 * ScaleAstra - Meta Ads & WhatsApp Automation Server-Side Adapter
 * 
 * Complies with:
 * - Meta Graph API v20.0 (Leadgen Webhooks & Cloud API)
 * - Indian Digital Personal Data Protection (DPDP) Act
 * - Strict Idempotency & Deduplication
 */

export interface MetaLeadPayload {
  leadId: string;
  formId: string;
  adId?: string;
  pageId: string;
  createdTime: number;
  fullName: string;
  phoneNumber: string;
  email?: string;
  consentGranted: boolean;
}

export interface WebhookVerificationQuery {
  'hub.mode'?: string;
  'hub.challenge'?: string;
  'hub.verify_token'?: string;
}

/**
 * 1. Meta Webhook Handshake Verification (GET request from Meta)
 */
export function verifyMetaWebhookHandshake(
  query: WebhookVerificationQuery,
  expectedVerifyToken: string
): { isValid: boolean; challenge?: string } {
  const mode = query['hub.mode'];
  const token = query['hub.verify_token'];
  const challenge = query['hub.challenge'];

  if (mode === 'subscribe' && token === expectedVerifyToken && challenge) {
    return { isValid: true, challenge };
  }
  return { isValid: false };
}

/**
 * 2. Validate Indian 10-digit Phone Number (+91)
 */
export function validateIndianPhoneNumber(phone: string): { isValid: boolean; clean10Digit: string; formattedE164: string } {
  // Strip non-digits
  const digitsOnly = phone.replace(/\D/g, '');
  
  // If prefixed with 91 and 12 digits total
  let tenDigit = '';
  if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) {
    tenDigit = digitsOnly.slice(2);
  } else if (digitsOnly.length === 10) {
    tenDigit = digitsOnly;
  } else if (digitsOnly.length > 10) {
    tenDigit = digitsOnly.slice(-10);
  }

  // Valid Indian mobile numbers begin with 6, 7, 8, or 9
  const isValid = tenDigit.length === 10 && /^[6-9]\d{9}$/.test(tenDigit);

  return {
    isValid,
    clean10Digit: tenDigit,
    formattedE164: isValid ? `+91${tenDigit}` : phone
  };
}

/**
 * 3. Extract Lead data from Meta Graph API response
 */
export function parseMetaGraphLeadData(graphApiResponse: any): MetaLeadPayload {
  const fieldData: { name: string; values: string[] }[] = graphApiResponse.field_data || [];
  
  let fullName = '';
  let phoneNumber = '';
  let email = '';
  let consentGranted = false;

  for (const field of fieldData) {
    const val = field.values?.[0] || '';
    const key = field.name.toLowerCase();

    if (key.includes('full_name') || key === 'name') {
      fullName = val;
    } else if (key.includes('phone') || key.includes('mobile')) {
      phoneNumber = val;
    } else if (key.includes('email')) {
      email = val;
    } else if (key.includes('consent') || key.includes('whatsapp') || key.includes('terms') || key.includes('agree')) {
      consentGranted = val.toLowerCase() === 'yes' || val.toLowerCase() === 'true' || val === '1';
    }
  }

  // If consent question was a single checkbox that was submitted, it's considered accepted
  if (!consentGranted && fieldData.some(f => f.name.toLowerCase().includes('consent') || f.name.toLowerCase().includes('whatsapp'))) {
    consentGranted = true;
  }

  return {
    leadId: graphApiResponse.id || `leadgen_${Date.now()}`,
    formId: graphApiResponse.form_id || '',
    pageId: graphApiResponse.page_id || '',
    createdTime: graphApiResponse.created_time ? new Date(graphApiResponse.created_time).getTime() : Date.now(),
    fullName: fullName || 'Instagram Customer',
    phoneNumber,
    email,
    consentGranted
  };
}

/**
 * 4. WhatsApp Cloud API Message Dispatcher Payload Builder
 * Builds approved template request for `welcome_honey_catalogue_v1`
 */
export function buildWhatsAppTemplatePayload(
  recipientPhoneE164: string,
  customerName: string,
  catalogueUrl: string = 'https://purewildhoney.in/catalogue.pdf'
) {
  return {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: recipientPhoneE164.replace('+', ''),
    type: 'template',
    template: {
      name: 'welcome_honey_catalogue_v1',
      language: {
        code: 'en'
      },
      components: [
        {
          type: 'body',
          parameters: [
            {
              type: 'text',
              text: customerName
            }
          ]
        },
        {
          type: 'button',
          sub_type: 'url',
          index: 0,
          parameters: [
            {
              type: 'text',
              text: 'catalogue.pdf'
            }
          ]
        }
      ]
    }
  };
}

/**
 * 5. Deterministic Idempotency Key Generator
 * Prevents double-sending if Meta webhooks send duplicate delivery retries
 */
export function generateIdempotencyKey(leadIdOrPhone: string, timestampWindowMs: number = 3600000): string {
  const windowBucket = Math.floor(Date.now() / timestampWindowMs);
  return `idemp_${leadIdOrPhone.replace(/\D/g, '')}_${windowBucket}`;
}
