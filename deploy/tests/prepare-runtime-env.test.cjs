const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { prepareRuntimeEnv, DEV_NOTIFICATION_ENV } = require('../prepare-runtime-env.cjs');

function fixture(t) {
  const tempRoot = fs.realpathSync(os.tmpdir());
  const directory = fs.mkdtempSync(path.join(tempRoot, 'notification-env-test-'));
  t.after(() => {
    const target = fs.realpathSync(directory);
    assert.equal(target, directory);
    assert.equal(path.dirname(target), tempRoot);
    assert.ok(path.basename(target).startsWith('notification-env-test-'));
    fs.rmSync(target, { recursive: true, force: true });
  });
  return directory;
}

test('dev writes shared inbox, retained EWA management and explicit browser flags', (t) => {
  const directory = fixture(t);
  const result = prepareRuntimeEnv({ env: { AWS_BRANCH: 'dev' }, directory });
  assert.equal(result.prepared, true);
  const content = fs.readFileSync(path.join(directory, '.env.production'), 'utf8');
  for (const [key, value] of Object.entries(DEV_NOTIFICATION_ENV)) {
    assert.ok(content.includes(`${key}=${JSON.stringify(value)}\n`), key);
  }
  assert.ok(content.includes('NOTIFICATION_API_URL="https://api.dev.ewallet.flexpay.vn/notification"'));
  assert.ok(content.includes('EWA_NOTIFICATION_MANAGEMENT_URL="https://18.140.180.230:8082"'));
  assert.ok(content.includes('NEXT_PUBLIC_BEAM_API_DIRECT="https://identity.devops.beamewa.com.vn"'));
  assert.ok(content.includes('NEXT_PUBLIC_BEAM_API_PROXY="/api/proxy/beam-api"'));
});

test('dev fails before writing for an invalid notification, management or identity target', (t) => {
  for (const key of ['NOTIFICATION_API_URL', 'EWA_NOTIFICATION_MANAGEMENT_URL',
    'IDENTITY_VERIFY_URL', 'KEYCLOAK_ISSUER', 'NEXT_PUBLIC_SHARED_NOTIFICATION_API_URL',
    'NEXT_PUBLIC_BEAM_API_DIRECT', 'NEXT_PUBLIC_BEAM_API_PROXY']) {
    const directory = fixture(t);
    assert.throws(() => prepareRuntimeEnv({
      env: { AWS_BRANCH: 'dev', [key]: 'https://wrong-environment.invalid' }, directory,
    }), new RegExp(key));
    assert.equal(fs.existsSync(path.join(directory, '.env.production')), false);
  }
});

test('dev rejects conflicting public mode rather than silently building legacy browser routing', (t) => {
  const directory = fixture(t);
  assert.throws(() => prepareRuntimeEnv({
    env: { AWS_BRANCH: 'dev', NEXT_PUBLIC_SHARED_NOTIFICATION_ENABLED: 'false' }, directory,
  }), /NEXT_PUBLIC_SHARED_NOTIFICATION_ENABLED/);
  assert.equal(fs.existsSync(path.join(directory, '.env.production')), false);
});

test('main and other branches leave existing private and public runtime configuration untouched', (t) => {
  for (const branch of ['main', 'pro', 'release/example', undefined]) {
    const directory = fixture(t);
    const filename = path.join(directory, '.env.production');
    const before = 'EXISTING_RUNTIME="synthetic-value"\n';
    fs.writeFileSync(filename, before);
    const result = prepareRuntimeEnv({ env: { AWS_BRANCH: branch }, directory });
    assert.equal(result.prepared, false);
    assert.equal(fs.readFileSync(filename, 'utf8'), before);
  }
});

test('private credentials are allowlisted without public aliases or assignment injection', (t) => {
  const directory = fixture(t);
  const syntheticSecret = 'fixture-only\nINJECTED=unexpected';
  prepareRuntimeEnv({ env: {
    AWS_BRANCH: 'dev', DATABASE_URL: syntheticSecret,
    CLOUDFLARE_R2_SECRET_ACCESS_KEY: 'fixture-only-private',
    UNAPPROVED_PRIVATE_KEY: 'must-not-copy',
    NEXT_PUBLIC_DATABASE_URL: 'must-not-copy',
  }, directory });
  const content = fs.readFileSync(path.join(directory, '.env.production'), 'utf8');
  assert.ok(content.includes(`DATABASE_URL=${JSON.stringify(syntheticSecret)}\n`));
  assert.equal(/^INJECTED=/m.test(content), false);
  assert.equal(content.includes('NEXT_PUBLIC_DATABASE_URL='), false);
  assert.equal(content.includes('UNAPPROVED_PRIVATE_KEY='), false);
  if (process.platform !== 'win32') {
    assert.equal(fs.statSync(path.join(directory, '.env.production')).mode & 0o777, 0o600);
  }
});

test('dedicated UAT preview also persists the EWA management SSR target', (t) => {
  const directory = fixture(t);
  prepareRuntimeEnv({ env: { AWS_BRANCH: 'feature/notification-uat' }, directory, devPreview: true });
  const content = fs.readFileSync(path.join(directory, '.env.production'), 'utf8');
  assert.ok(content.includes('EWA_NOTIFICATION_MANAGEMENT_URL="https://18.140.180.230:8082"'));
});

test('helper leaves core, payment and reporting owners untouched', (t) => {
  const directory = fixture(t);
  prepareRuntimeEnv({ env: {
    AWS_BRANCH: 'dev', CORE_API_URL: 'synthetic-core-owner',
    NEXT_PUBLIC_API_PAYMENT_DIRECT: 'synthetic-payment-owner',
    NEXT_PUBLIC_API_CORE2_DIRECT: 'synthetic-reporting-owner',
  }, directory });
  const content = fs.readFileSync(path.join(directory, '.env.production'), 'utf8');
  assert.equal(content.includes('synthetic-core-owner'), false);
  assert.equal(content.includes('synthetic-payment-owner'), false);
  assert.equal(content.includes('synthetic-reporting-owner'), false);
});
