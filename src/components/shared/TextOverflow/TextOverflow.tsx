import { Tooltip } from '@douyinfe/semi-ui';
import Link from 'next/link';
import { forwardRef } from 'react';
import styles from './TextOverflow.module.css';

interface TextOverflowProps {
  className?: string;
  style?: any;
  line?: number;
  children: any;
  title?: string;
  href?: any;
  contentText?: any;
}
const TextOverflow = forwardRef<any, TextOverflowProps>((props, ref) => {
  const {
    line = 1,
    style,
    className,
    children,
    href,
    contentText = null,
  } = props;

  const wrapStyle = {
    WebkitLineClamp: line,
    ...style,
  };
  const wrapClass = `${styles['line-clamp']} ${className ?? ''} ${
    href ? 'cursor-pointer' : ''
  }`;
  const inner = (
    <Tooltip position="top" content={contentText ? contentText : children}>
      <span className="beam-break-world">{children}</span>
    </Tooltip>
  );

  if (href) {
    return (
      <Link href={href} legacyBehavior>
        <a ref={ref} className={wrapClass} style={wrapStyle}>
          {inner}
        </a>
      </Link>
    );
  }
  return (
    <div ref={ref} className={wrapClass} style={wrapStyle}>
      {inner}
    </div>
  );
});

TextOverflow.displayName = 'TextOverflow';

export default TextOverflow;
