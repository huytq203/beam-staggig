"server-only";

import sanitizeHtml from "sanitize-html";

const RICH_TEXT_CONFIG: sanitizeHtml.IOptions = {
  allowedTags: [
    "p", "br", "strong", "em", "u", "s", "blockquote", "code", "pre",
    "ul", "ol", "li",
    "h1", "h2", "h3", "h4", "h5", "h6",
    "a", "img",
    "table", "thead", "tbody", "tr", "th", "td",
    "span", "div", "hr", "figure", "figcaption",
    "iframe",
  ],
  allowedAttributes: {
    a: ["href", "name", "target", "rel"],
    img: ["src", "alt", "title", "width", "height"],
    iframe: ["src", "width", "height", "frameborder", "allowfullscreen"],
    "*": ["class", "id", "style"],
  },
  // Chỉ cho phép một tập thuộc tính CSS an toàn: giữ định dạng cơ bản,
  // chặn position/url() (clickjacking, tải tài nguyên ngoài / rò rỉ dữ liệu).
  allowedStyles: {
    "*": {
      color: [/.*/],
      "background-color": [/.*/],
      "text-align": [/^(left|right|center|justify)$/],
      "text-decoration": [/.*/],
      "font-weight": [/.*/],
      "font-style": [/.*/],
      "font-size": [/^[\d.]+(px|em|rem|%|pt)$/],
      "line-height": [/.*/],
      width: [/^[\d.]+(px|em|rem|%)$/],
      height: [/^[\d.]+(px|em|rem|%)$/],
      margin: [/.*/],
      padding: [/.*/],
    },
  },
  // Bỏ "data:" khỏi scheme mặc định để chặn <a href="data:...">
  // (vector phishing/XSS). data: chỉ còn được phép cho <img> bên dưới.
  allowedSchemes: ["http", "https", "mailto"],
  allowedSchemesByTag: { img: ["http", "https", "data"] },
  allowedIframeHostnames: ["www.youtube.com", "youtube.com", "player.vimeo.com"],
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer", target: "_blank" }),
  },
};

export function sanitizeRichText(html: string | null | undefined): string | null {
  if (html == null || html === "") return null;
  return sanitizeHtml(html, RICH_TEXT_CONFIG);
}

export function sanitizePlainText(text: string | null | undefined): string | null {
  if (text == null || text === "") return null;
  return sanitizeHtml(text, { allowedTags: [], allowedAttributes: {} });
}
