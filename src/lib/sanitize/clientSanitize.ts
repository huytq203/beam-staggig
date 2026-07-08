import DOMPurify from "dompurify";

/**
 * Client-side rich-text sanitizer — lớp phòng thủ chiều sâu (defense-in-depth)
 * trước khi render nội dung bằng dangerouslySetInnerHTML.
 *
 * Nội dung news vốn đã được sanitize ở server khi ghi (src/lib/api/sanitize.ts).
 * Hàm này bảo vệ thêm cho: dữ liệu cũ trước khi có sanitizer, dữ liệu ghi qua
 * đường khác (DB trực tiếp / service khác), hoặc bất kỳ trường hợp bypass nào.
 *
 * Allowlist được giữ khớp với server để nội dung hiển thị nhất quán.
 */

const ALLOWED_TAGS = [
  "p", "br", "strong", "em", "u", "s", "blockquote", "code", "pre",
  "ul", "ol", "li",
  "h1", "h2", "h3", "h4", "h5", "h6",
  "a", "img",
  "table", "thead", "tbody", "tr", "th", "td",
  "span", "div", "hr", "figure", "figcaption",
  "iframe",
];

const ALLOWED_ATTR = [
  "href", "name", "target", "rel",
  "src", "alt", "title", "width", "height",
  "frameborder", "allowfullscreen",
  "class", "id", "style",
];

// Chỉ cho phép nhúng iframe từ các host tin cậy (giống server).
const ALLOWED_IFRAME_HOSTS = new Set([
  "www.youtube.com",
  "youtube.com",
  "player.vimeo.com",
]);

let hooksRegistered = false;

function registerHooks() {
  if (hooksRegistered) return;
  hooksRegistered = true;

  // Gỡ iframe có src không thuộc host tin cậy.
  DOMPurify.addHook("uponSanitizeElement", (node, data) => {
    if (data.tagName !== "iframe") return;
    const el = node as Element;
    const src = el.getAttribute?.("src") ?? "";
    let host = "";
    try {
      host = new URL(src, "https://invalid.local").hostname;
    } catch {
      host = "";
    }
    if (!ALLOWED_IFRAME_HOSTS.has(host)) {
      el.parentNode?.removeChild(el);
    }
  });

  // Ép link mở tab mới an toàn, tránh reverse tabnabbing.
  DOMPurify.addHook("afterSanitizeAttributes", (node) => {
    const el = node as Element;
    if (el.tagName === "A" && el.hasAttribute?.("href")) {
      el.setAttribute("rel", "noopener noreferrer");
      el.setAttribute("target", "_blank");
    }
  });
}

export function sanitizeRichTextClient(html: string | null | undefined): string {
  if (!html) return "";
  // DOMPurify cần DOM của trình duyệt. Trên server (SSR) nội dung news đã được
  // sanitize khi ghi nên trả về nguyên trạng; các component dùng hàm này chỉ
  // render nội dung sau tương tác phía client.
  if (typeof window === "undefined") return html;

  registerHooks();
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    ADD_ATTR: ["target"],
  });
}
