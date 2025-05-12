import Document, { Html, Head, Main, NextScript, DocumentProps } from 'next/document';
import { ReactElement } from 'react';

export default function MyDocument(props: DocumentProps): ReactElement {
  return (
    <Html lang="en">
      <Head />
      <body
        // 允许 Grammarly 扩展添加的属性
        suppressHydrationWarning={true}
      >
        <Main />
        <NextScript />
      </body>
    </Html>
  );
} 