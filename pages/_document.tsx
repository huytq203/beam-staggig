import { Html, Head, Main, NextScript } from 'next/document';
import React from 'react';

export default function Document() {
  return (
    <Html>
      <Head>
        <meta
          name="viewport"
          content="width=1440, initial-scale=0, shrink-to-fit=no"
        />
        <link rel="icon" href="/logo.svg" />
        <link rel="mask-icon" href="/logo.svg" />
        <title>FlexPay - Chi lương linh hoạt</title>
      </Head>
      <body>
        <Main />
        <NextScript />
        <script dangerouslySetInnerHTML={{ __html: `
          document.addEventListener('click', function(e) {
            // Tìm header được click
            const clickedHeader = e.target.closest('.notion-toggle-header');
            if (clickedHeader) {
              // Ngăn chặn sự kiện lan tỏa ngay lập tức
              e.stopPropagation();
              
              // Tìm wrapper chứa header được click
              const wrapper = clickedHeader.closest('.notion-toggle-wrapper');
              if (wrapper) {
                // Toggle class expanded cho wrapper
                wrapper.classList.toggle('expanded');
              }
            }
          }, true); // Thêm true để sử dụng capture phase thay vì bubbling
        `}} />
      </body>
    </Html>
  );
}
