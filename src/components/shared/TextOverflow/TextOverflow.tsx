import { Tooltip } from '@douyinfe/semi-ui';
import Link from 'next/link';
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
const TextOverflow = (props: TextOverflowProps) => {
  const {
    line = 1,
    style,
    className,
    children,
    title,
    href,
    contentText = null,
  } = props;

  const content = () => {
    const wrapStyle = {
      WebkitLineClamp: line,
      ...style,
    };
    return (
      <div
        className={`${styles['line-clamp']} ${className ?? ''} ${
          href ? 'cursor-pointer' : ''
        }`}
        style={wrapStyle}
      >
        <Tooltip position="top" content={contentText ? contentText : children}>
          <p className="beam-break-world">{children}</p>
        </Tooltip>
      </div>
    );
  };
  return (
    <>
      {href ? (
        <Link href={href}>
          <a>{content()}</a>
        </Link>
      ) : (
        content()
      )}
    </>
  );
};

export default TextOverflow;
