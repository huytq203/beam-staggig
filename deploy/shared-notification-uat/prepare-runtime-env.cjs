const fs = require('node:fs');

// Amplify SSR needs private server variables in the deployed runtime bundle.
// Next.js inlines NEXT_PUBLIC_* independently; never copy credentials there.
const expected = 'https://api.dev.ewallet.flexpay.vn/notification';
if (process.env.NEXT_PUBLIC_SHARED_NOTIFICATION_ENABLED !== 'true' ||
    process.env.NEXT_PUBLIC_USE_PROXY !== 'true' ||
    process.env.NOTIFICATION_API_URL !== expected ||
    process.env.NEXT_PUBLIC_API_NOTIFICATION_PROXY !== '/api/proxy/notification') {
  throw new Error('Shared notification DEV preview configuration is incomplete');
}
if (process.env.KEYCLOAK_ISSUER !== 'https://18.140.180.230:8443/realms/ewa' ||
    process.env.IDENTITY_VERIFY_URL !== 'https://identity.devops.beamewa.com.vn') {
  throw new Error('Preview must use the verified EWA DEV identity');
}
const keys = [
  'NOTIFICATION_API_URL', 'IDENTITY_VERIFY_URL', 'KEYCLOAK_ISSUER',
  'DATABASE_URL', 'HEALTH_CHECK_TOKEN', 'CORS_ALLOWED_ORIGINS',
  'CLOUDFLARE_ACCOUNT_ID', 'CLOUDFLARE_R2_ACCESS_KEY_ID',
  'CLOUDFLARE_R2_SECRET_ACCESS_KEY', 'CLOUDFLARE_R2_BUCKET',
  'CLOUDFLARE_R2_PUBLIC_URL',
];
const entries = keys.filter((key) => process.env[key] !== undefined)
  .map((key) => `${key}=${JSON.stringify(process.env[key])}`);
fs.appendFileSync('.env.production', `\n${entries.join('\n')}\n`, { mode: 0o600 });
console.log(`Prepared ${entries.length} server runtime variables; values hidden.`);
