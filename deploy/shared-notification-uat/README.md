# Dedicated notification DEV/UAT admin preview

Only the web feature branch `feature/codex-shared-notification-20261011` is published. Existing Amplify `dev`/`main` branches, production domain routing and mobile branches remain unchanged.

Verified 11 October 2026: official app `d42afkpbarff5`, profile `ewa-prod`, region `ap-southeast-1`, platform `WEB_COMPUTE`, repository `gitlab.com/lqtuantk19/flexpay-web`. Auto branch creation is disabled. Existing `dev` job66 succeeded at commit `2aa88a0`; its default domain redirects to sign-in. The production custom domain maps to `main`.

The dedicated feature branch uses stage `DEVELOPMENT`, display name `notification-uat-20261011`, auto-build disabled, and the public configuration in `preview-env.json`. Expected preview URL: `https://notification-uat-20261011.d42afkpbarff5.amplifyapp.com`. Verify that URL after a successful job before declaring it live.

`NOTIFICATION_API_URL` stays server-side. The branch-specific build spec runs `prepare-runtime-env.cjs`, which persists the approved server runtime variables without printing values. Do not use the repository's existing root Amplify build spec for this preview: it does not persist this private notification variable. No Keycloak client secret is passed to the browser or added to the frontend environment. Admin login remains `/api/proxy/beam-api/account/login`; the DEV identity backend owns its `admin_jwt` client and credential.

Notification changes use the shared DEV Gateway. Identity stays on the verified EWA DEV host with issuer `https://18.140.180.230:8443/realms/ewa`; server token verification uses identity `/external/jwt/verify`. Core/payment/reporting keep their existing EWA DEV routes. Their DNS targets are not all the identity machine; salary-advance acceptance must use the separately verified UAT producer and must not infer isolation from a hostname containing `dev`.

Publish only the feature branch, create only its Amplify branch with the custom build spec and environment, then start a `RELEASE` job for that branch. [AWS does not support manual ZIP deployment for SSR apps](https://docs.aws.amazon.com/amplify/latest/userguide/manual-deploys.html); [RELEASE builds the latest change of the connected branch](https://docs.aws.amazon.com/cli/latest/reference/amplify/start-job.html).

Acceptance: sign-in page reachable; anonymous notification BFF call returns401; valid DEV admin cookie reaches shared inbox/template APIs; backend `/internal/*` cannot be reached through the notification BFF; existing EWA core/payment/reporting targets remain unchanged. A successful build alone does not prove FCM delivery, campaign execution, or mobile installation.

Rollback the preview by disabling its shared notification flag and rebuilding the same feature branch, or deleting only the dedicated Amplify feature branch after keeping its receipt. The existing `dev` and `main` deployments are unaffected. Keep receipts and any runtime snapshots outside Git; do not print their secret values.
