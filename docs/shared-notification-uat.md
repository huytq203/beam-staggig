# Shared notification DEV/UAT

Branch `feature/codex-shared-notification-20261011` is based on the official `dev` branch. The browser endpoint and BFF target change independently from identity, core, payment, and reporting.

Apply the nonsecret values in `.env.notification-uat.example` to an isolated UAT Amplify branch and rebuild. Keep production `NEXT_PUBLIC_SHARED_NOTIFICATION_ENABLED=false` until cutover is explicitly approved. In proxy mode, `NOTIFICATION_API_URL` is the server-side upstream. Direct mode uses `NEXT_PUBLIC_SHARED_NOTIFICATION_API_URL`.

Shared mode uses authenticated REST polling every 15 seconds while the browser tab is visible; it refreshes on focus. Existing notifications are not replayed as new popups on first load. The inbox cache is scoped by authenticated username and pagination stops at the server's last page. Seen actions refresh the count. The shared mode does not place the access token in a WebSocket URL. Legacy mode retains its existing STOMP behavior for the current production host.

Template and campaign editors retain their existing `/notification-template` and `/schedule-notification` contracts and EWA service/database ownership. In proxy mode, set server-only `EWA_NOTIFICATION_MANAGEMENT_URL` to the verified EWA DEV email base. In direct mode, set `NEXT_PUBLIC_EWA_NOTIFICATION_MANAGEMENT_API_URL` to that base. Inbox/count/read/device calls use the shared ECS URL. Uploads and EWA business lookup routes keep their existing owners. The BFF forwards the authenticated Bearer token without cookie/API-key credentials for shared notification routes; downstream services enforce their own permissions.

Public DEV base: `https://api.dev.ewallet.flexpay.vn/notification`; Gateway strips the outer `/notification` prefix, preserving the backend legacy route prefix. No notification data or old campaign execution state is migrated by this change.

Before UAT acceptance, confirm common ECS inbox/count/read/badge and retained EWA template listing/editing/campaign creation/update independently. EWA business templates replicate versioned configuration to ECS; edits become effective after outbox relay. EWA campaigns retain their own audience/Quartz scheduler and forward rendered messages to ECS. DEV historic Quartz stays paused; no broadcast to actual employees or historical replay is part of smoke validation. The wallet's native scheduler manages wallet campaigns only.
