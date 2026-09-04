# Auto-logout khi không tương tác — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tự động đăng xuất khi user không tương tác với web trong 15 phút, xoá sạch access + refresh token, và mất phiên khi đóng trình duyệt.

> **Cập nhật yêu cầu sau triển khai (04/09/2026):** Bỏ modal cảnh báo và thời
> gian chờ 60 giây; khi đủ 15 phút không tương tác thì đăng xuất ngay. Giảm
> throttle ghi nhận hoạt động từ 5 giây xuống 1 giây và kiểm tra trạng thái phiên
> mỗi 500ms. Cập nhật này thay thế các phần liên quan đến `IDLE_WARNING_MS`,
> `IdleWarningModal`, `showWarning`, `remainingMs` và `extendSession` bên dưới;
> các phần đó được giữ lại để lưu lịch sử quyết định ban đầu.

**Architecture:** Một hook `useIdleLogout` chạy `setInterval(500ms)` trong `AuthenticationProvider`, so sánh timestamp thay vì dùng `setTimeout` dài (timer dài bị browser throttle khi tab ở nền và sai giờ khi máy sleep). Mốc hoạt động cuối lưu ở `localStorage` nên đồng bộ giữa mọi tab. Cookie token đổi sang dạng session cookie (không có `expires`) để chết khi đóng browser. Mốc hết hạn tuyệt đối của phiên đọc động từ claim `exp` của refresh token thay vì hardcode.

**Tech Stack:** Next.js 15 (Pages Router), React 18, TypeScript, `js-cookie`, `jwt-decode@3.1.2`, Semi UI (`@douyinfe/semi-ui`), axios.

**Spec:** Không có file spec riêng. Toàn bộ quyết định thiết kế và lý do nằm ở mục "Bối cảnh" ngay bên dưới — đọc hết trước khi code.

---

## Bối cảnh (đọc trước khi làm Task 1)

### Hệ thống auth hiện tại

- Token lưu trong cookie **không HttpOnly** (`ACCESS_TOKEN`, `REFRESH_TOKEN`) vì axios đọc bằng JS để gắn header `Authorization`. Thông tin user lưu ở cookie `user` (JSON). Đây là ràng buộc kiến trúc có sẵn — **không** đổi trong plan này.
- `AuthenticationProvider` bọc toàn bộ app tại `pages/_app.tsx:31`.
- Cookie hiện đặt `expires: 7` ngày ở 2 chỗ → **đóng browser vẫn còn đăng nhập**. Đây là bug so với yêu cầu.
- Repo **không có test framework nào** (không jest, không vitest, không playwright — đã kiểm `package.json`). Vì vậy plan này dùng `npx tsc --noEmit` làm cổng tự động, cộng với kịch bản kiểm thử tay cụ thể ở mỗi task. Không bịa lệnh test không tồn tại.

### Vòng đời token thật (đã decode từ token staging)

| Token | Vòng đời |
|---|---|
| access (`typ: Bearer`) | **5 phút** |
| refresh (`typ: Refresh`) | **24 giờ** |

**Hệ quả bắt buộc phải nhớ:** access token hết hạn mỗi 5 phút là chuyện bình thường, axios tự refresh ngầm (`src/services/api/axiosInstance.tsx:215-233`). Nó **KHÔNG** có nghĩa là phiên kết thúc.

> ⚠️ **Tuyệt đối không dùng `exp` của access token làm mốc đăng xuất.** Access token sống 5 phút, ngắn hơn timeout idle 15 phút — user chỉ ngồi đọc báo cáo 6 phút là bị đá ra oan. Mốc hết hạn phiên **chỉ** lấy từ **refresh token**.

Cấu hình lifespan phía Keycloak đang bị thay đổi giữa các lần deploy (đã quan sát 2 phiên cách nhau 28 phút có lifespan khác nhau). Vì vậy plan này **đọc `exp` động từ token** thay vì hardcode bất kỳ con số ngày/giờ nào.

### Ba điều kiện đăng xuất (đúng 3, không hơn)

1. Không có thao tác (`click` / `scroll` / `keydown` / `mousedown` / `touchstart` / `wheel`) trong 15 phút.
2. Đóng hẳn trình duyệt → cookie session tự chết.
3. `exp` của refresh token đã qua → phiên hết hạn tuyệt đối.

### Các quyết định đã chốt với chủ dự án (không tự ý đổi)

- **Có** modal cảnh báo đếm ngược 60 giây trước khi đăng xuất, có nút "Tiếp tục làm việc".
- **Session cookie thuần** (bỏ hẳn `expires`), chấp nhận mất tính năng "giữ đăng nhập 7 ngày".
- **Đồng bộ toàn cục đa tab** qua `localStorage` — hoạt động ở tab bất kỳ reset timer chung.
- **Có gọi API revoke** `POST /account/logout`. Endpoint đã khai báo sẵn (`AuthAPIEnums.LOGOUT_ACCESS_TOKEN` tại `src/services/auth/apis.ts:6`) và có wrapper `AuthServices.logout()` tại `auth.services.ts:15`, nhưng hiện là code chết. Plan này **không** dùng wrapper đó — xem mục chống import vòng bên dưới.
- **Không** đụng vào luồng refresh token hiện tại (đã thống nhất là ngoài scope).

### Hai cái bẫy đã biết — phải xử lý đúng

1. **Modal đang mở thì phải NGƯNG lắng nghe tương tác thường.** Nếu không, chính cú click mở modal hoặc một cú scroll vô ý sẽ tự gia hạn phiên và modal biến mất ngay lập tức → cảnh báo trở nên vô nghĩa. Chỉ nút "Tiếp tục làm việc" mới được gia hạn.
2. **Sau khi đăng nhập phải ghi đè mốc hoạt động.** `LAST_ACTIVITY_AT` sống ở `localStorage` nên tồn tại qua lần đóng browser. Nếu không ghi đè lúc login, giá trị cũ đã quá 15 phút sẽ đá user ra ngay giây đầu tiên sau khi đăng nhập thành công.

### Chống import vòng (circular import)

Codebase đã có sẵn vòng `AuthenticationProvider → @services/auth → axiosInstance → @contexts/authentication`. **Đừng thêm vòng mới:**

- Hook `useIdleLogout` **không** được import `byPassUrl` từ `@contexts/authentication`. Thay vào đó gate bằng sự tồn tại của cookie `user` — trang chưa đăng nhập thì không có cookie này, hiệu quả tương đương và không tạo vòng.
- `AuthenticationProvider` import `IdleWarningModal` bằng **đường dẫn trực tiếp** `@components/widgets/IdleWarningModal`, và **KHÔNG** thêm nó vào `src/components/widgets/index.ts` (file barrel đó kéo theo `Layouts` vốn import ngược lại contexts).
- `session.cleanup.ts` **KHÔNG** được import `AuthServices` từ `./auth.services`. `auth.services` import `axiosInstance`, mà `axiosInstance` lại import `clearSession` từ chính `session.cleanup` → vòng trực tiếp. Gọi thẳng endpoint bằng **axios trần**, đúng như `src/services/auth/token.refresh.ts:41` đang làm.

---

## Global Constraints

- TypeScript strict theo `tsconfig.json` sẵn có. Cổng kiểm tra duy nhất chạy được tự động: `npx tsc --noEmit`. Phải PASS trước mỗi commit.
- Path alias có sẵn: `@components/*`, `@modules/*`, `@services/*`, `@constants/*`, `@contexts/*`, `@helpers/*`, `@hooks/*`, `@images/*`. Dùng alias, không dùng đường dẫn tương đối dài.
- Mọi text hiển thị cho user viết bằng **tiếng Việt có dấu**.
- Comment trong code viết **tiếng Việt**, và chỉ giải thích **tại sao**, không mô tả lại **cái gì** — theo đúng văn phong comment sẵn có trong `src/services/auth/token.refresh.ts` và `src/contexts/authentication/AuthenticationProvider.tsx`.
- Mọi truy cập `window` / `localStorage` phải an toàn với SSR (Next.js render server-side): bọc trong `useEffect` hoặc kiểm `typeof window !== 'undefined'`.
- Mọi thao tác `localStorage` bọc `try/catch` — chế độ ẩn danh và một số cấu hình bảo mật doanh nghiệp sẽ ném lỗi.
- Không đổi tên/xoá bất kỳ export công khai nào đang được dùng. Không refactor ngoài phạm vi từng task.
- Commit theo Conventional Commits, message tiếng Việt hoặc tiếng Anh đều được, nhất quán trong một task.
- Branch làm việc: tạo nhánh mới từ `dev`, không commit thẳng vào `dev`.

---

## File Structure

**Tạo mới:**

| File | Trách nhiệm |
|---|---|
| `src/constants/session.constants.ts` | Toàn bộ hằng số thời gian, tên key localStorage, danh sách event tương tác |
| `src/services/auth/token.helper.ts` | Đọc claim `exp` từ JWT. Thuần tuý, không side effect |
| `src/services/auth/session.activity.ts` | Đọc/ghi/xoá mốc hoạt động cuối trên `localStorage` |
| `src/services/auth/session.cleanup.ts` | `clearSession()` + `forceSignOut()` — một nguồn sự thật duy nhất cho việc dọn phiên |
| `src/hooks/useIdleLogout.ts` | Bộ đếm 1s, gắn listener tương tác, đồng bộ đa tab |
| `src/components/widgets/IdleWarningModal/index.tsx` | Modal đếm ngược 60s. Thuần trình bày, nhận props |

**Sửa:**

| File | Việc |
|---|---|
| `src/services/auth/token.refresh.ts:5-17` | Bỏ `TOKEN_COOKIE_EXPIRES_DAYS` và `expires` → session cookie |
| `src/contexts/authentication/AuthenticationProvider.tsx` | Bỏ `expires: 7`; gọi `startSessionTracking()` lúc login; dùng `clearSession()`; mount hook + modal |
| `src/services/api/axiosInstance.tsx:76-78, 130-134, 236-238` | Thay 3 block xoá cookie lặp bằng `clearSession()` |
| `src/modules/auth/forms/LoginForm.tsx:55-63` | Hiện thông báo theo query `?reason=` |
| `src/constants/index.ts` | Export file hằng số mới |
| `src/hooks/index.ts` | Export hook mới |

---

### Task 1: Hằng số phiên + đọc `exp` từ JWT

Nền móng thuần tuý, chưa đổi hành vi gì của app.

**Files:**
- Create: `src/constants/session.constants.ts`
- Create: `src/services/auth/token.helper.ts`
- Modify: `src/constants/index.ts`

**Interfaces:**
- Consumes: không có (task đầu tiên)
- Produces:
  - `IDLE_TIMEOUT_MS: number`, `IDLE_WARNING_MS: number`, `ACTIVITY_THROTTLE_MS: number`, `LOGOUT_API_TIMEOUT_MS: number`
  - `LAST_ACTIVITY_KEY: string`, `SESSION_ENDED_KEY: string`
  - `ACTIVITY_EVENTS: readonly string[]`
  - `getTokenExpMs(token?: string | null): number | null`

- [ ] **Step 1: Tạo file hằng số**

Tạo `src/constants/session.constants.ts`:

```ts
// Cho phép hạ timeout qua env khi QA/dev, vì ngồi chờ đủ 15 phút để test là bất khả thi.
// Không đặt env thì dùng giá trị thật theo yêu cầu nghiệp vụ.
const readEnvMs = (raw: string | undefined, fallback: number): number => {
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

/** Không thao tác quá mốc này thì đăng xuất. */
export const IDLE_TIMEOUT_MS = readEnvMs(
  process.env.NEXT_PUBLIC_IDLE_TIMEOUT_MS,
  15 * 60 * 1000
);

/** Hiện modal cảnh báo trước thời điểm đăng xuất bấy nhiêu lâu. */
export const IDLE_WARNING_MS = readEnvMs(
  process.env.NEXT_PUBLIC_IDLE_WARNING_MS,
  60 * 1000
);

// Scroll bắn hàng trăm event mỗi giây; ghi localStorage mỗi event sẽ giật UI.
export const ACTIVITY_THROTTLE_MS = 5 * 1000;

// Mạng chậm không được phép giữ user ở lại trong phiên đáng ra đã chết.
export const LOGOUT_API_TIMEOUT_MS = 3 * 1000;

/** Mốc hoạt động cuối (epoch ms). Đặt ở localStorage để mọi tab dùng chung. */
export const LAST_ACTIVITY_KEY = 'LAST_ACTIVITY_AT';

/** Cờ báo các tab khác biết phiên đã kết thúc và vì lý do gì. */
export const SESSION_ENDED_KEY = 'SESSION_ENDED_REASON';

// mousemove CỐ TÌNH bị loại: chuột rê vô ý hoặc cảm biến rung sẽ gia hạn phiên
// vĩnh viễn, phá đúng mục đích bảo mật của idle timeout.
// keydown BẮT BUỘC có: user gõ form 15 phút mà không click sẽ bị đá ra oan.
export const ACTIVITY_EVENTS = [
  'click',
  'scroll',
  'keydown',
  'mousedown',
  'touchstart',
  'wheel',
] as const;
```

- [ ] **Step 2: Tạo helper đọc `exp`**

Tạo `src/services/auth/token.helper.ts`:

```ts
import jwt_decode from 'jwt-decode';

interface JwtExpPayload {
  exp?: number;
}

/**
 * Trả về mốc hết hạn của JWT theo epoch milisecond, hoặc null nếu token rỗng /
 * hỏng / không có claim `exp`.
 *
 * Đọc động từ token thay vì hardcode số ngày, vì lifespan phía Keycloak bị đổi
 * giữa các lần deploy — mọi con số cứng trong FE sẽ sai.
 */
export const getTokenExpMs = (token?: string | null): number | null => {
  if (!token) {
    return null;
  }
  try {
    const payload = jwt_decode<JwtExpPayload>(token);
    if (typeof payload?.exp !== 'number') {
      return null;
    }
    // Claim `exp` của JWT tính bằng giây, Date.now() tính bằng milisecond.
    return payload.exp * 1000;
  } catch {
    return null;
  }
};
```

- [ ] **Step 3: Export hằng số ra barrel**

Sửa `src/constants/index.ts`, thêm dòng cuối:

```ts
export * from './session.constants';
```

Lưu ý: **KHÔNG** thêm `token.helper` vào `src/services/auth/index.ts` — import trực tiếp từ `@services/auth/token.helper` để tránh kéo theo `auth.services` (vốn import `axiosInstance`) vào những chỗ chỉ cần decode token.

- [ ] **Step 4: Kiểm tra biên dịch**

Chạy: `npx tsc --noEmit`
Kỳ vọng: PASS, không lỗi.

- [ ] **Step 5: Kiểm chứng `getTokenExpMs` bằng tay**

Chạy `npm run dev`, mở trang bất kỳ, dán vào DevTools Console:

```js
// Access token staging thật, exp = 1788492289 (04/09/2026 10:24:49 +07)
const t = 'eyJhbGciOiJSUzI1NiJ9.eyJleHAiOjE3ODg0OTIyODksImlhdCI6MTc4ODQ5MTk4OX0.x';
JSON.parse(atob(t.split('.')[1])).exp * 1000 === 1788492289000;
```

Kỳ vọng: `true`. (Kiểm tra logic nhân 1000 — lỗi giây/milisecond là lỗi hay gặp nhất ở đây.)

- [ ] **Step 6: Commit**

```bash
git add src/constants/session.constants.ts src/services/auth/token.helper.ts src/constants/index.ts
git commit -m "feat(auth): them hang so phien va helper doc exp tu JWT"
```

---

### Task 2: Gom logic dọn phiên về một chỗ

Refactor thuần, không đổi hành vi người dùng thấy được — trừ một bug được sửa kèm.

**Bug đang tồn tại:** `src/services/api/axiosInstance.tsx:130-134` xoá `ACCESS_TOKEN` và `REFRESH_TOKEN` nhưng **quên xoá cookie `user`**. Hậu quả: sau khi bị đá ra vì 401/403, `AuthenticationProvider.tsx:105` vẫn thấy `userData` tồn tại nên coi như đang đăng nhập, dẫn tới trạng thái nửa vời. Gom code lại sẽ sửa luôn.

**Files:**
- Create: `src/services/auth/session.activity.ts`
- Create: `src/services/auth/session.cleanup.ts`
- Modify: `src/services/api/axiosInstance.tsx:76-78, 130-134, 236-238`
- Modify: `src/contexts/authentication/AuthenticationProvider.tsx:307-322`

**Interfaces:**
- Consumes: `LAST_ACTIVITY_KEY`, `SESSION_ENDED_KEY`, `LOGOUT_API_TIMEOUT_MS` từ Task 1; `AuthAPIs.LOGOUT_ACCESS_TOKEN` từ `src/services/auth/apis.ts` (đã có sẵn)
- Produces:
  - `readLastActivity(): number` — trả `0` nếu chưa có/hỏng
  - `touchLastActivity(): void`
  - `startSessionTracking(): void` — dùng lúc đăng nhập thành công
  - `clearSession(): void`
  - `SignOutReason = 'idle' | 'expired' | 'manual'`
  - `forceSignOut(reason: SignOutReason): Promise<void>`

- [ ] **Step 1: Tạo module mốc hoạt động**

Tạo `src/services/auth/session.activity.ts`:

```ts
import { LAST_ACTIVITY_KEY, SESSION_ENDED_KEY } from '@constants/session.constants';

// localStorage ném lỗi ở chế độ ẩn danh và một số policy bảo mật doanh nghiệp;
// mất mốc hoạt động không được phép làm sập cả app.
const safeGet = (key: string): string | null => {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

const safeSet = (key: string, value: string): void => {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // bỏ qua
  }
};

const safeRemove = (key: string): void => {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // bỏ qua
  }
};

/** Mốc hoạt động cuối theo epoch ms; trả 0 nếu chưa có hoặc giá trị hỏng. */
export const readLastActivity = (): number => {
  const parsed = Number(safeGet(LAST_ACTIVITY_KEY));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
};

export const touchLastActivity = (): void => {
  safeSet(LAST_ACTIVITY_KEY, String(Date.now()));
};

export const clearLastActivity = (): void => {
  safeRemove(LAST_ACTIVITY_KEY);
};

/**
 * Gọi ngay khi đăng nhập thành công.
 *
 * Bắt buộc ghi đè mốc hoạt động: LAST_ACTIVITY_AT sống ở localStorage nên tồn
 * tại qua lần đóng browser. Không ghi đè thì giá trị cũ đã quá 15 phút sẽ đá
 * user ra ngay giây đầu tiên sau khi đăng nhập thành công.
 */
export const startSessionTracking = (): void => {
  safeRemove(SESSION_ENDED_KEY);
  touchLastActivity();
};
```

- [ ] **Step 2: Tạo module dọn phiên**

Tạo `src/services/auth/session.cleanup.ts`:

```ts
import { LOGOUT_API_TIMEOUT_MS, SESSION_ENDED_KEY } from '@constants/session.constants';
import axios from 'axios';
import Cookies from 'js-cookie';
import { AuthAPIs } from './apis';
import { clearLastActivity } from './session.activity';

export type SignOutReason = 'idle' | 'expired' | 'manual';

/**
 * Nguồn sự thật duy nhất cho việc xoá phiên phía client.
 *
 * Trước đây logic này bị chép ở 3 nơi và không đồng nhất (một chỗ quên xoá
 * cookie `user`, để lại trạng thái nửa đăng nhập).
 */
export const clearSession = (): void => {
  Cookies.remove('ACCESS_TOKEN');
  Cookies.remove('REFRESH_TOKEN');
  Cookies.remove('user');
  clearLastActivity();
  try {
    window.localStorage.setItem('isLogout', 'true');
  } catch {
    // bỏ qua
  }
};

/**
 * Kết thúc phiên: báo các tab khác, revoke phía BE, dọn client, về trang đăng nhập.
 */
export const forceSignOut = async (reason: SignOutReason): Promise<void> => {
  // Báo các tab khác TRƯỚC khi xoá cookie, để chúng đi theo mà không tự gọi
  // lại API logout lần nữa.
  try {
    window.localStorage.setItem(SESSION_ENDED_KEY, reason);
  } catch {
    // bỏ qua
  }

  // reason 'expired' nghĩa là refresh token đã chết -> gọi revoke chỉ tổ ăn 401
  // vô ích. Bỏ qua luôn.
  const accessToken = Cookies.get('ACCESS_TOKEN');
  if (reason !== 'expired' && accessToken) {
    try {
      await Promise.race([
        // axios trần chứ KHÔNG qua axiosInstance, vì hai lý do:
        //   1. axiosInstance import clearSession từ chính file này -> vòng import;
        //   2. response interceptor của nó tự redirect khi gặp 401, cướp mất
        //      redirect kèm tham số `reason` ở cuối hàm.
        axios.post(
          AuthAPIs.LOGOUT_ACCESS_TOKEN,
          {},
          { headers: { Authorization: `Bearer ${accessToken}` } }
        ),
        new Promise((resolve) => {
          window.setTimeout(resolve, LOGOUT_API_TIMEOUT_MS);
        }),
      ]);
    } catch {
      // Revoke là best-effort: BE lỗi hay mạng chậm không được chặn đăng xuất.
    }
  }

  clearSession();

  const redirectUrl = encodeURIComponent(
    window.location.pathname + window.location.search
  );
  window.location.href = `/auth/signin?reason=${reason}&redirectUrl=${redirectUrl}`;
};
```

- [ ] **Step 3: Thay 3 chỗ lặp trong axiosInstance**

Trong `src/services/api/axiosInstance.tsx`, thêm import:

```ts
import { clearSession } from '../auth/session.cleanup';
```

Thay block ở khoảng dòng 76-78 (trong `catch (refreshError)` của request interceptor):

```ts
      } catch (refreshError) {
        // Refresh token cũng hết hạn -> dọn phiên + về trang đăng nhập.
        clearSession();
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/signin';
        }
      }
```

Thay block ở khoảng dòng 129-135 (nhánh `statusCode == 403 || statusCode == 401` trong response interceptor thành công):

```ts
    if (statusCode == 403 || statusCode == 401) {
      clearSession();
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/signin';
      }
    }
```

Thay block ở khoảng dòng 235-243 (nhánh `statusCode == 401` trong error handler):

```ts
    if (statusCode == 401) {
      clearSession();
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/signin';
      }
    }
```

- [ ] **Step 4: Dùng `clearSession` trong `signOut`**

Trong `src/contexts/authentication/AuthenticationProvider.tsx`, thêm import:

```ts
import { clearSession } from '@services/auth/session.cleanup';
```

Sửa thân hàm `signOut` (dòng ~307-322), thay 3 lệnh `Cookies.remove` và lệnh `localStorage.setItem('isLogout', ...)`:

```ts
  const signOut = async (config: AuthenticationSignOutRequestProps = {}) => {
    const redirectPath = config.redirectPath;
    stopLoadingState();
    const path = config.noRedirect ? '/' : decodeURIComponent(redirectPath);
    clearSession();
    window.location.href = decodeURIComponent(
      `${getAuthUrl()}/auth/signin?redirectUrl=${path}`
    );
  };
```

Lưu ý: `clearSession()` đã set `isLogout = 'true'`, nên bỏ dòng `localStorage.setItem('isLogout', 'true')` cũ. Giữ nguyên phần `redirectPath` và `getAuthUrl()`.

- [ ] **Step 5: Kiểm tra biên dịch**

Chạy: `npx tsc --noEmit`
Kỳ vọng: PASS.

- [ ] **Step 6: Kiểm thử tay — đăng xuất thủ công vẫn chạy đúng**

1. `npm run dev`, đăng nhập vào app.
2. Mở DevTools > Application > Cookies, xác nhận có `ACCESS_TOKEN`, `REFRESH_TOKEN`, `user`.
3. Bấm menu avatar > **Đăng xuất**.
4. Kỳ vọng: về `/auth/signin`, và **cả 3 cookie đều biến mất**, `localStorage.isLogout === 'true'`.
5. Bấm nút Back của trình duyệt. Kỳ vọng: vẫn ở màn đăng nhập, không vào lại được app.

- [ ] **Step 7: Commit**

```bash
git add src/services/auth/session.activity.ts src/services/auth/session.cleanup.ts src/services/api/axiosInstance.tsx src/contexts/authentication/AuthenticationProvider.tsx
git commit -m "refactor(auth): gom logic don phien vao clearSession, sua thieu sot xoa cookie user"
```

---

### Task 3: Session cookie — đóng trình duyệt là mất phiên

**Files:**
- Modify: `src/services/auth/token.refresh.ts:5-17`
- Modify: `src/contexts/authentication/AuthenticationProvider.tsx:172-189`

**Interfaces:**
- Consumes: `startSessionTracking()` từ Task 2
- Produces: không có API mới; đổi hành vi lưu cookie

- [ ] **Step 1: Bỏ `expires` khỏi cookie token**

Trong `src/services/auth/token.refresh.ts`, xoá hằng `TOKEN_COOKIE_EXPIRES_DAYS` và sửa `getCookieOptions`:

```ts
// Không đặt `expires` -> đây là session cookie, trình duyệt tự xoá khi đóng
// hẳn browser. Đây chính là cơ chế đáp ứng yêu cầu "đóng trình duyệt thì mất
// phiên"; đừng thêm `expires` lại vì tiện, sẽ phá yêu cầu đó.
//
// Mốc hết hạn thật của phiên không nằm ở cookie mà ở claim `exp` của refresh
// token, do useIdleLogout kiểm mỗi giây.
const getCookieOptions = (): Cookies.CookieAttributes => {
  const isSecure =
    typeof window !== 'undefined' && window.location.protocol === 'https:';
  return {
    secure: isSecure,
    sameSite: 'lax',
  };
};
```

Giữ nguyên hàm `saveAuthTokens` và `refreshAccessToken` phía dưới.

- [ ] **Step 2: Bỏ `expires` khỏi cookie `user` và bật theo dõi phiên**

Trong `src/contexts/authentication/AuthenticationProvider.tsx`, thêm import:

```ts
import { startSessionTracking } from '@services/auth/session.activity';
```

Trong hàm `establishSession`, sửa `secureCookieOptions` và thêm lời gọi `startSessionTracking()`:

```ts
    // Cookie do client set qua js-cookie nên KHÔNG thể đặt HttpOnly (chỉ server
    // đặt được qua Set-Cookie). Vì axios đọc token bằng JS để gắn header
    // Authorization, HttpOnly thật sự cần chuyển sang mô hình BFF (server proxy).
    // Trong kiến trúc hiện tại, hardening tối đa: Secure (chỉ gửi qua HTTPS) +
    // SameSite=Lax + session cookie (không `expires`) để đóng browser là mất phiên.
    const isSecure =
      typeof window !== 'undefined' && window.location.protocol === 'https:';
    const secureCookieOptions: Cookies.CookieAttributes = {
      secure: isSecure,
      sameSite: 'lax',
    };

    Cookies.set('user', JSON.stringify(user), secureCookieOptions);

    saveAuthTokens(accessToken, refreshToken);
    localStorage.setItem('isLogout', 'false');
    startSessionTracking();
```

Giữ nguyên phần `setState` và `callbackUrl` phía dưới.

- [ ] **Step 3: Kiểm tra biên dịch**

Chạy: `npx tsc --noEmit`
Kỳ vọng: PASS.

- [ ] **Step 4: Kiểm thử tay — cookie đúng dạng session**

1. `npm run dev`, đăng nhập.
2. DevTools > Application > Cookies > chọn origin đang chạy.
3. Kỳ vọng: cột **Expires / Max-Age** của cả `ACCESS_TOKEN`, `REFRESH_TOKEN`, `user` đều hiển thị **`Session`**, không phải một ngày cụ thể.
4. Console: `localStorage.getItem('LAST_ACTIVITY_AT')` phải trả về một chuỗi số (mốc vừa được ghi lúc đăng nhập).

- [ ] **Step 5: Kiểm thử tay — đóng trình duyệt thì mất phiên**

1. Đang đăng nhập, **đóng toàn bộ cửa sổ Chrome** (đóng hết mọi cửa sổ, không phải chỉ đóng tab).
2. Mở lại Chrome, vào thẳng URL app.
3. Kỳ vọng: bị đưa về `/auth/signin`, phải đăng nhập lại.

> Nếu Chrome bật "Continue where you left off" thì session cookie có thể được khôi phục và bước này vẫn còn đăng nhập. Đây là hạn chế đã biết và **được chấp nhận** — Task 4 sẽ bịt nốt bằng cách kiểm mốc hoạt động lúc app khởi động. Nếu gặp trường hợp này, ghi lại và đi tiếp, đừng cố sửa ở task này.

- [ ] **Step 6: Commit**

```bash
git add src/services/auth/token.refresh.ts src/contexts/authentication/AuthenticationProvider.tsx
git commit -m "feat(auth): doi token cookie sang session cookie de dong browser la mat phien"
```

---

### Task 4: Hook đếm idle 15 phút, đồng bộ đa tab

Task này làm phần đăng xuất. Modal cảnh báo để sang Task 5 — ở đây `showWarning` đã được tính nhưng chưa có gì hiển thị nó.

**Files:**
- Create: `src/hooks/useIdleLogout.ts`
- Modify: `src/hooks/index.ts`
- Modify: `src/contexts/authentication/AuthenticationProvider.tsx` (gọi hook)

**Interfaces:**
- Consumes: `IDLE_TIMEOUT_MS`, `IDLE_WARNING_MS`, `ACTIVITY_THROTTLE_MS`, `LAST_ACTIVITY_KEY`, `SESSION_ENDED_KEY`, `ACTIVITY_EVENTS` (Task 1); `getTokenExpMs` (Task 1); `readLastActivity`, `touchLastActivity` (Task 2); `forceSignOut` (Task 2)
- Produces: `useIdleLogout(): { showWarning: boolean; remainingMs: number; extendSession: () => void }`

- [ ] **Step 1: Viết hook**

Tạo `src/hooks/useIdleLogout.ts`:

```ts
import {
  ACTIVITY_EVENTS,
  ACTIVITY_THROTTLE_MS,
  IDLE_TIMEOUT_MS,
  IDLE_WARNING_MS,
  LAST_ACTIVITY_KEY,
  SESSION_ENDED_KEY,
} from '@constants/session.constants';
import {
  readLastActivity,
  touchLastActivity,
} from '@services/auth/session.activity';
import { forceSignOut } from '@services/auth/session.cleanup';
import { getTokenExpMs } from '@services/auth/token.helper';
import Cookies from 'js-cookie';
import { useCallback, useEffect, useRef, useState } from 'react';

// Gate bằng cookie `user` thay vì import byPassUrl từ @contexts/authentication:
// contexts đã import ngược lại hook này, thêm import kia sẽ tạo vòng.
const isAuthenticated = (): boolean => Boolean(Cookies.get('user'));

interface UseIdleLogoutResult {
  showWarning: boolean;
  remainingMs: number;
  extendSession: () => void;
}

export const useIdleLogout = (): UseIdleLogoutResult => {
  const [showWarning, setShowWarning] = useState(false);
  const [remainingMs, setRemainingMs] = useState(IDLE_WARNING_MS);

  // Listener đọc showWarning qua ref: closure của addEventListener sẽ giữ giá
  // trị state cũ nếu đọc trực tiếp.
  const showWarningRef = useRef(false);
  const lastWriteRef = useRef(0);
  // Chặn gọi forceSignOut nhiều lần khi tick 1s chạy chồng lúc đang redirect.
  const signingOutRef = useRef(false);

  useEffect(() => {
    showWarningRef.current = showWarning;
  }, [showWarning]);

  const registerActivity = useCallback((force = false) => {
    const nowMs = Date.now();
    if (!force && nowMs - lastWriteRef.current < ACTIVITY_THROTTLE_MS) {
      return;
    }
    lastWriteRef.current = nowMs;
    touchLastActivity();
  }, []);

  const extendSession = useCallback(() => {
    registerActivity(true);
    setShowWarning(false);
  }, [registerActivity]);

  // Lắng nghe tương tác của user.
  useEffect(() => {
    if (!isAuthenticated()) {
      return;
    }

    // Mốc rỗng nghĩa là chưa từng theo dõi (lần đầu vào app) -> khởi tạo từ bây
    // giờ. Mốc cũ mà quá hạn thì để tick bên dưới xử lý: đó chính là cách bịt
    // trường hợp Chrome khôi phục session cookie sau khi đóng browser.
    if (readLastActivity() === 0) {
      touchLastActivity();
    }

    const onActivity = () => {
      // Khi modal cảnh báo đang mở, tương tác thường KHÔNG được gia hạn phiên.
      // Nếu cho phép, chính cú click mở modal hoặc một cú scroll vô ý sẽ đóng
      // modal ngay lập tức và cảnh báo trở nên vô nghĩa. Chỉ nút "Tiếp tục làm
      // việc" mới gia hạn.
      if (showWarningRef.current) {
        return;
      }
      registerActivity();
    };

    ACTIVITY_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, onActivity, { passive: true });
    });

    return () => {
      ACTIVITY_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, onActivity);
      });
    };
  }, [registerActivity]);

  // Vòng kiểm tra mỗi giây.
  useEffect(() => {
    if (!isAuthenticated()) {
      return;
    }

    // So sánh timestamp thay vì setTimeout dài: timer dài bị browser throttle
    // khi tab ở nền và chạy sai hoàn toàn khi máy sleep.
    const intervalId = window.setInterval(() => {
      if (signingOutRef.current) {
        return;
      }

      // 1. Hết hạn tuyệt đối. Đọc lại cookie mỗi tick, KHÔNG cache: nếu Keycloak
      //    bật refresh token rotation thì mỗi lần refresh sẽ cấp token mới với
      //    exp mới, mốc này trượt về sau.
      //    Chỉ dùng refresh token. Access token sống 5 phút, ngắn hơn timeout
      //    idle 15 phút — lấy nhầm nó sẽ đá user ra oan.
      const refreshExpMs = getTokenExpMs(Cookies.get('REFRESH_TOKEN'));
      if (refreshExpMs === null || refreshExpMs <= Date.now()) {
        signingOutRef.current = true;
        void forceSignOut('expired');
        return;
      }

      const idleForMs = Date.now() - readLastActivity();

      // 2. Đủ 15 phút không thao tác.
      if (idleForMs >= IDLE_TIMEOUT_MS) {
        signingOutRef.current = true;
        void forceSignOut('idle');
        return;
      }

      // 3. Sắp hết giờ -> bật cảnh báo và đếm ngược.
      if (idleForMs >= IDLE_TIMEOUT_MS - IDLE_WARNING_MS) {
        setShowWarning(true);
        setRemainingMs(IDLE_TIMEOUT_MS - idleForMs);
      } else {
        setShowWarning(false);
      }
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  // Đồng bộ giữa các tab.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === SESSION_ENDED_KEY && event.newValue) {
        // Tab khác đã kết thúc phiên và đã revoke rồi; tab này chỉ việc đi theo,
        // không gọi lại API logout lần nữa.
        signingOutRef.current = true;
        window.location.href = `/auth/signin?reason=${event.newValue}`;
        return;
      }

      if (event.key === LAST_ACTIVITY_KEY) {
        // Tab khác vừa có thao tác (hoặc vừa bấm "Tiếp tục làm việc") -> tab này
        // đóng cảnh báo theo, tránh cảnh báo ma ở tab đang nằm nền.
        const ts = Number(event.newValue);
        if (
          Number.isFinite(ts) &&
          Date.now() - ts < IDLE_TIMEOUT_MS - IDLE_WARNING_MS
        ) {
          setShowWarning(false);
        }
      }
    };

    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  return { showWarning, remainingMs, extendSession };
};
```

- [ ] **Step 2: Export hook**

Sửa `src/hooks/index.ts`:

```ts
export * from "./useIsMount"
export * from "./useTranslate"
export * from "./useIdleLogout"
```

- [ ] **Step 3: Gọi hook trong AuthenticationProvider**

Trong `src/contexts/authentication/AuthenticationProvider.tsx`, thêm import:

```ts
import { useIdleLogout } from '@hooks/useIdleLogout';
```

Thêm dòng này ngay sau `const [profile, setProfile] = useState<any>(null);`:

```ts
  // Đặt ở đây vì AuthenticationProvider bọc toàn bộ app (pages/_app.tsx),
  // không cần thêm provider riêng.
  const { showWarning, remainingMs, extendSession } = useIdleLogout();
```

Tạm thời chưa dùng 3 giá trị này (Task 5 sẽ dùng). Để tránh lỗi lint "unused", thêm ngay dưới:

```ts
  void showWarning;
  void remainingMs;
  void extendSession;
```

Ba dòng `void` này **bắt buộc phải xoá ở Task 5 Step 3**.

- [ ] **Step 4: Kiểm tra biên dịch**

Chạy: `npx tsc --noEmit`
Kỳ vọng: PASS.

- [ ] **Step 5: Kiểm thử tay — đăng xuất do idle (dùng timeout rút gọn)**

Tạo file `.env.development.local` (đã nằm trong `.gitignore` của Next.js, **không commit**):

```
NEXT_PUBLIC_IDLE_TIMEOUT_MS=30000
NEXT_PUBLIC_IDLE_WARNING_MS=10000
```

Khởi động lại `npm run dev` (env chỉ đọc lúc build/khởi động).

1. Đăng nhập, để yên chuột và bàn phím **30 giây**.
2. Kỳ vọng: tự chuyển về `/auth/signin?reason=idle&redirectUrl=...`, cả 3 cookie đã bị xoá.
3. Đăng nhập lại, cứ ~10 giây lại click hoặc scroll một cái, giữ trong 1 phút.
4. Kỳ vọng: **không** bị đăng xuất. Trong Console, `localStorage.getItem('LAST_ACTIVITY_AT')` tăng dần.
5. Đăng nhập lại, chỉ **gõ phím** vào một ô input, không click gì, trong 40 giây.
6. Kỳ vọng: **không** bị đăng xuất (kiểm chứng `keydown` có được tính).

- [ ] **Step 6: Kiểm thử tay — đồng bộ đa tab**

1. Đăng nhập, mở app ở **2 tab**.
2. Để tab A nằm yên, sang tab B click/scroll liên tục trong 40 giây.
3. Kỳ vọng: **cả hai tab đều không bị đăng xuất** (hoạt động ở B reset timer chung).
4. Để yên **cả hai tab** 30 giây.
5. Kỳ vọng: **cả hai tab** cùng chuyển về màn đăng nhập.

- [ ] **Step 7: Kiểm thử tay — mở lại sau khi để quá hạn**

1. Đăng nhập. Trong Console: `localStorage.setItem('LAST_ACTIVITY_AT', String(Date.now() - 60000))`
2. Kỳ vọng: trong vòng 1 giây bị đá về màn đăng nhập (giả lập đóng browser lâu rồi mở lại).

- [ ] **Step 8: Commit**

```bash
git add src/hooks/useIdleLogout.ts src/hooks/index.ts src/contexts/authentication/AuthenticationProvider.tsx
git commit -m "feat(auth): tu dong dang xuat sau 15 phut khong tuong tac, dong bo da tab"
```

Kiểm tra `git status` để chắc chắn `.env.development.local` **không** nằm trong commit.

---

### Task 5: Modal cảnh báo đếm ngược 60 giây

**Files:**
- Create: `src/components/widgets/IdleWarningModal/index.tsx`
- Modify: `src/contexts/authentication/AuthenticationProvider.tsx` (render modal, xoá 3 dòng `void`)

**Interfaces:**
- Consumes: `showWarning`, `remainingMs`, `extendSession` từ Task 4
- Produces: `IdleWarningModal` — named export, props `{ visible: boolean; remainingMs: number; onExtend: () => void }`

- [ ] **Step 1: Viết component modal**

Tạo `src/components/widgets/IdleWarningModal/index.tsx`:

```tsx
import { Button, Modal } from '@douyinfe/semi-ui';

interface IdleWarningModalProps {
  visible: boolean;
  remainingMs: number;
  onExtend: () => void;
}

export const IdleWarningModal = ({
  visible,
  remainingMs,
  onExtend,
}: IdleWarningModalProps) => {
  const seconds = Math.max(0, Math.ceil(remainingMs / 1000));

  return (
    <Modal
      title="Phiên đăng nhập sắp hết hạn"
      visible={visible}
      centered
      // closable/maskClosable phải tắt: click ra ngoài hay bấm X đều là "tương
      // tác", nhưng ở đây tương tác KHÔNG được ngầm gia hạn phiên. Chỉ nút bên
      // dưới mới gia hạn.
      closable={false}
      maskClosable={false}
      footer={
        <Button theme="solid" type="primary" onClick={onExtend}>
          Tiếp tục làm việc
        </Button>
      }
    >
      <div>
        Bạn sẽ được tự động đăng xuất sau <b>{seconds}</b> giây do không có thao
        tác nào. Bấm &quot;Tiếp tục làm việc&quot; để giữ phiên đăng nhập.
      </div>
    </Modal>
  );
};
```

**KHÔNG** thêm file này vào `src/components/widgets/index.ts` — barrel đó kéo theo `Layouts`, vốn import ngược lại contexts và sẽ tạo import vòng.

- [ ] **Step 2: Render modal trong AuthenticationProvider**

Thêm import:

```ts
import { IdleWarningModal } from '@components/widgets/IdleWarningModal';
```

- [ ] **Step 3: Xoá 3 dòng `void` và render modal**

Xoá 3 dòng đã thêm ở Task 4 Step 3:

```ts
  void showWarning;
  void remainingMs;
  void extendSession;
```

Sửa phần `return` của provider:

```tsx
  return (
    <AuthenticationContext.Provider
      value={{
        signIn: signIn,
        requestLoginOtp: requestLoginOtp,
        verifyLoginOtp: verifyLoginOtp,
        signOut: signOut,
        state: state,
        profile: profile,
        authCheckByRole: authCheckByRole,
      }}
    >
      {children}
      <IdleWarningModal
        visible={showWarning}
        remainingMs={remainingMs}
        onExtend={extendSession}
      />
    </AuthenticationContext.Provider>
  );
```

- [ ] **Step 4: Kiểm tra biên dịch**

Chạy: `npx tsc --noEmit`
Kỳ vọng: PASS.

- [ ] **Step 5: Kiểm thử tay — modal hiện và đếm ngược**

Vẫn dùng `.env.development.local` với `NEXT_PUBLIC_IDLE_TIMEOUT_MS=30000`, `NEXT_PUBLIC_IDLE_WARNING_MS=10000`.

1. Đăng nhập, để yên 20 giây.
2. Kỳ vọng: modal hiện với tiêu đề "Phiên đăng nhập sắp hết hạn", số giây **đếm lùi từng giây** 10, 9, 8...
3. Không bấm gì, để đếm về 0.
4. Kỳ vọng: đăng xuất, về `/auth/signin?reason=idle&...`.

- [ ] **Step 6: Kiểm thử tay — cái bẫy quan trọng nhất**

1. Đăng nhập, để yên 20 giây cho modal hiện.
2. **Scroll chuột và click vào vùng nền tối (mask) bên ngoài modal.**
3. Kỳ vọng: modal **KHÔNG** đóng, số đếm ngược **KHÔNG** reset, vẫn tiếp tục lùi về 0 rồi đăng xuất.

> Nếu modal đóng hoặc bộ đếm reset ở bước này thì `showWarningRef` đang không chặn được listener — quay lại kiểm `useIdleLogout` Step 1, phần `onActivity`. Đây là lỗi dễ mắc nhất của cả plan.

- [ ] **Step 7: Kiểm thử tay — nút "Tiếp tục làm việc"**

1. Để modal hiện, bấm **Tiếp tục làm việc**.
2. Kỳ vọng: modal đóng, **không** bị đăng xuất, bộ đếm bắt đầu lại từ đầu (20 giây sau modal mới hiện lại).
3. Mở 2 tab, để cả hai tới lúc modal hiện, bấm "Tiếp tục làm việc" ở **tab A**.
4. Kỳ vọng: modal ở **tab B** cũng tự đóng theo.

- [ ] **Step 8: Commit**

```bash
git add src/components/widgets/IdleWarningModal/index.tsx src/contexts/authentication/AuthenticationProvider.tsx
git commit -m "feat(auth): them modal canh bao dem nguoc truoc khi tu dong dang xuat"
```

---

### Task 6: Thông báo lý do ở màn đăng nhập

**Files:**
- Modify: `src/modules/auth/forms/LoginForm.tsx:55-63`

**Interfaces:**
- Consumes: query param `reason` do `forceSignOut()` (Task 2) gắn vào URL — giá trị `'idle' | 'expired' | 'manual'`
- Produces: không có API mới

- [ ] **Step 1: Thêm xử lý query `reason`**

Trong `src/modules/auth/forms/LoginForm.tsx`, ngay **sau** `useEffect` đang xử lý `router.query.error` (kết thúc ở dòng ~63), thêm:

```tsx
  useEffect(() => {
    const reason = router.query.reason;
    if (!reason) {
      return;
    }

    // Nội dung khác nhau vì hai lý do này khác nhau với user: một cái do họ để
    // máy không dùng, một cái do phiên đã sống hết đời.
    const messages: Record<string, string> = {
      idle: 'Phiên làm việc đã hết hạn do không có thao tác trong 15 phút. Vui lòng đăng nhập lại!',
      expired: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!',
    };
    const content = messages[String(reason)];
    if (!content) {
      return;
    }

    Notification.warning({
      content,
      theme: 'light',
      position: 'top',
      duration: 8,
    });
  }, [router.query.reason]);
```

`Notification` và `useEffect` đã được import sẵn ở đầu file, không cần thêm import.

Lưu ý: nếu `IDLE_TIMEOUT_MS` được override bằng env thì câu chữ "15 phút" sẽ không khớp. Chấp nhận được — env override chỉ dùng cho QA, không dùng ở production.

- [ ] **Step 2: Kiểm tra biên dịch**

Chạy: `npx tsc --noEmit`
Kỳ vọng: PASS.

- [ ] **Step 3: Kiểm thử tay**

1. Mở thẳng `http://localhost:3000/auth/signin?reason=idle`.
2. Kỳ vọng: hiện thông báo vàng "Phiên làm việc đã hết hạn do không có thao tác trong 15 phút...".
3. Mở `http://localhost:3000/auth/signin?reason=expired`.
4. Kỳ vọng: hiện thông báo "Phiên đăng nhập đã hết hạn...".
5. Mở `http://localhost:3000/auth/signin` (không có param).
6. Kỳ vọng: **không** có thông báo nào.

- [ ] **Step 4: Commit**

```bash
git add src/modules/auth/forms/LoginForm.tsx
git commit -m "feat(auth): hien thong bao ly do het phien o man dang nhap"
```

---

## Kiểm thử nghiệm thu cuối (chạy sau khi xong cả 6 task)

**Xoá `.env.development.local`** để về đúng giá trị thật 15 phút / 60 giây, rồi khởi động lại dev server. Chạy `npx tsc --noEmit` lần cuối, phải PASS.

| # | Kịch bản | Kỳ vọng |
|---|---|---|
| 1 | Đăng nhập, để yên 15 phút | Phút 14 hiện modal đếm ngược, phút 15 đăng xuất về `/auth/signin?reason=idle` |
| 2 | Modal hiện, bấm "Tiếp tục làm việc" | Modal đóng, phiên còn, bộ đếm về 0 |
| 3 | Modal hiện, scroll + click ra ngoài modal | Modal **không** đóng, vẫn đăng xuất đúng giờ |
| 4 | Hai tab, thao tác liên tục ở tab A trong 20 phút | Không tab nào bị đăng xuất |
| 5 | Đăng xuất ở một tab | Mọi tab đều về màn đăng nhập |
| 6 | Đóng hẳn trình duyệt, mở lại | Phải đăng nhập lại |
| 7 | Làm việc liên tục 10 phút (access token hết hạn 2 lần) | **Không** bị đăng xuất, API vẫn chạy — access token tự refresh ngầm |
| 8 | Sau đăng xuất, kiểm DevTools > Cookies | `ACCESS_TOKEN`, `REFRESH_TOKEN`, `user` đều đã bị xoá |
| 9 | Sau đăng xuất, kiểm tab Network | Có request `POST /account/logout` (trừ khi lý do là `expired`) |

Kịch bản **số 7 là quan trọng nhất** — nó chứng minh không nhầm lẫn giữa hạn của access token (5 phút) và hạn của phiên. Nếu nó fail thì gần như chắc chắn có chỗ nào đó đang đọc `exp` của access token thay vì refresh token.

## Ngoài phạm vi (đã thống nhất, đừng tự ý làm)

- Không đụng vào luồng refresh token trong `axiosInstance.tsx:215-233`.
- Không thêm proactive refresh (tự refresh trước khi access token hết hạn).
- Không chuyển sang mô hình BFF / cookie HttpOnly.
- Không đổi cấu hình lifespan phía Keycloak (việc của BE).
- Không thêm test framework vào repo.
