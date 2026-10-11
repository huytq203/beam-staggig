const fs = require('node:fs');
const path = require('node:path');

const DEV_NOTIFICATION_ENV = Object.freeze({
  NEXT_PUBLIC_SHARED_NOTIFICATION_ENABLED: 'true',
  NEXT_PUBLIC_USE_PROXY: 'true',
  NEXT_PUBLIC_API_NOTIFICATION_PROXY: '/api/proxy/notification',
  NEXT_PUBLIC_SHARED_NOTIFICATION_API_URL: 'https://api.dev.ewallet.flexpay.vn/notification',
  NEXT_PUBLIC_EWA_NOTIFICATION_MANAGEMENT_API_URL: 'https://18.140.180.230:8082',
  NEXT_PUBLIC_BEAM_API_DIRECT: 'https://identity.devops.beamewa.com.vn',
  NEXT_PUBLIC_BEAM_API_PROXY: '/api/proxy/beam-api',
  NOTIFICATION_API_URL: 'https://api.dev.ewallet.flexpay.vn/notification',
  EWA_NOTIFICATION_MANAGEMENT_URL: 'https://18.140.180.230:8082',
  IDENTITY_VERIFY_URL: 'https://identity.devops.beamewa.com.vn',
  KEYCLOAK_ISSUER: 'https://18.140.180.230:8443/realms/ewa',
});

// Only these approved private variables may enter the Amplify SSR runtime file.
// Credentials never receive a NEXT_PUBLIC_ alias.
const PRIVATE_RUNTIME_KEYS = Object.freeze([
  'NOTIFICATION_API_URL', 'EWA_NOTIFICATION_MANAGEMENT_URL',
  'IDENTITY_VERIFY_URL', 'KEYCLOAK_ISSUER',
  'DATABASE_URL', 'HEALTH_CHECK_TOKEN', 'CORS_ALLOWED_ORIGINS',
  'CLOUDFLARE_ACCOUNT_ID', 'CLOUDFLARE_R2_ACCESS_KEY_ID',
  'CLOUDFLARE_R2_SECRET_ACCESS_KEY', 'CLOUDFLARE_R2_BUCKET',
  'CLOUDFLARE_R2_PUBLIC_URL',
]);

function prepareRuntimeEnv({ env = process.env, directory = process.cwd(), devPreview = false } = {}) {
  // Main/production retain the existing buildspec/runtime preparation unchanged.
  if (env.AWS_BRANCH !== 'dev' && !devPreview) return { prepared: false, entries: 0 };

  const values = { ...env };
  for (const [key, expected] of Object.entries(DEV_NOTIFICATION_ENV)) {
    if (values[key] !== undefined && values[key] !== expected) {
      throw new Error(`DEV notification configuration rejected: ${key}`);
    }
    values[key] = expected;
  }
  const publicKeys = Object.keys(DEV_NOTIFICATION_ENV).filter((key) => key.startsWith('NEXT_PUBLIC_'));
  const keys = [...PRIVATE_RUNTIME_KEYS, ...publicKeys];
  const entries = keys.filter((key) => values[key] !== undefined).map((key) => {
    if (typeof values[key] !== 'string' || values[key].includes('\0')) {
      throw new Error(`Invalid runtime variable: ${key}`);
    }
    // Encode on one physical line so a value cannot inject another env assignment.
    return `${key}=${JSON.stringify(values[key])}`;
  });
  const filename = path.join(directory, '.env.production');
  if (fs.existsSync(filename) && !fs.lstatSync(filename).isFile()) {
    throw new Error('Runtime env target must be a regular file');
  }
  fs.appendFileSync(filename, `\n${entries.join('\n')}\n`, { mode: 0o600 });
  fs.chmodSync(filename, 0o600);
  return { prepared: true, entries: entries.length };
}

if (require.main === module) {
  const result = prepareRuntimeEnv();
  console.log(result.prepared
    ? `Prepared ${result.entries} DEV runtime variables; values hidden.`
    : 'Non-DEV branch: existing runtime configuration preserved.');
}

module.exports = { prepareRuntimeEnv, DEV_NOTIFICATION_ENV, PRIVATE_RUNTIME_KEYS };
