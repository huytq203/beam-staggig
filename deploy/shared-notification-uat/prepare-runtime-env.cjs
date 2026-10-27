const { prepareRuntimeEnv } = require('../prepare-runtime-env.cjs');

// The dedicated UAT buildspec is explicitly DEV-only, regardless of branch name.
const result = prepareRuntimeEnv({ devPreview: true });
console.log(`Prepared ${result.entries} DEV preview runtime variables; values hidden.`);
