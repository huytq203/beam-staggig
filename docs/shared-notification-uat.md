# Shared notification DEV/UAT

Branch `feature/codex-shared-notification-20261011` is based on the official `dev` branch. The browser endpoint and BFF target change independently from identity, core, payment, and reporting.

Apply the nonsecret values in `.env.notification-uat.example` to an isolated UAT Amplify branch and rebuild. Keep production `NEXT_PUBLIC_SHARED_NOTIFICATION_ENABLED=false` until cutover is explicitly approved. In proxy mode, `NOTIFICATION_API_URL` is the server-side upstream. Direct mode uses `NEXT_PUBLIC_SHARED_NOTIFICATION_API_URL`.

Shared mode uses authenticated REST polling every 15 seconds while the browser tab is visible; it refreshes on focus. Existing notifications are not replayed as new popups on first load. The inbox cache is scoped by authenticated username and pagination stops at the server's last page. Seen actions refresh the count. The shared mode does not place the access token in a WebSocket URL. Legacy mode retains its existing STOMP behavior for the current production host.

Template and campaign editors retain their existing `/notification-template` and `/schedule-notification` contracts. Uploads and EWA business lookup routes keep their existing owners. The new service must authorize admin template/campaign actions independently of frontend menu permissions.

Public DEV base: `https://api.dev.ewallet.flexpay.vn/notification`; Gateway strips the outer `/notification` prefix, preserving the backend legacy route prefix. No notification data or old campaign execution state is migrated by this change.

Before UAT acceptance, confirm the inbox, template listing/editing, campaign creation/update, and new-notification badge through the actual shared service. Backend campaign workers must be enabled only in the intended environment.
