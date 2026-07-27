import {
  Children,
  ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

/** Thời lượng chuyển bước, dùng chung cho trượt ngang + đổi chiều cao + thanh tiến trình
 *  đi kèm, để ba chuyển động khoá cùng một nhịp thay vì lệch nhau. */
export const STEP_SLIDE_MS = 420;
/** Ease-out mũ: bung nhanh rồi hãm dần — bước mới có mặt gần như tức thì,
 *  phần đuôi mới là thứ tạo cảm giác mượt. */
export const STEP_SLIDE_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

/** Người dùng bật giảm chuyển động ở cấp hệ điều hành thì mọi hiệu ứng ở đây
 *  rút về 0ms — bước vẫn đổi, chỉ là không trượt. */
export const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  return reduced;
};

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export interface StepSliderProps {
  /** Bước đang hiển thị, tính từ 0. */
  activeIndex: number;
  /** Gọi khi hiệu ứng trượt kết thúc — dùng để trả focus vào bước vừa hiện ra. */
  onSettled?: (index: number) => void;
  /** Mỗi child là một bước, chiếm trọn bề ngang khung. */
  children: ReactNode;
}

/**
 * Xếp các bước cạnh nhau trên một băng ngang và dịch băng đó khi đổi bước:
 * bước cũ trượt sang trái, bước mới trượt vào từ phải.
 *
 * Chiều cao khung được đo theo bước đang hiện và cũng chạy transition — nếu để
 * `height: auto`, modal sẽ nhảy một nhịp ngay lúc đổi bước.
 */
export const StepSlider = (props: StepSliderProps) => {
  const { activeIndex, onSettled, children } = props;

  const steps = Children.toArray(children);
  const stepRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [height, setHeight] = useState<number | null>(null);
  const [isSliding, setIsSliding] = useState(false);
  const previousIndex = useRef(activeIndex);
  const reduced = usePrefersReducedMotion();
  const duration = reduced ? 0 : STEP_SLIDE_MS;

  // Đo bước đang hiện và bám theo mọi thay đổi chiều cao của nó (hiện lỗi
  // validate, hiện thông báo OTP sai...) để khung co giãn mượt theo nội dung.
  useIsomorphicLayoutEffect(() => {
    const element = stepRefs.current[activeIndex];
    if (!element) return;

    const measure = () => setHeight(element.offsetHeight);
    measure();

    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [activeIndex, steps.length]);

  useEffect(() => {
    if (previousIndex.current === activeIndex) return;
    previousIndex.current = activeIndex;

    if (duration === 0) {
      onSettled?.(activeIndex);
      return;
    }

    setIsSliding(true);
    const timer = setTimeout(() => {
      setIsSliding(false);
      onSettled?.(activeIndex);
    }, duration);
    return () => clearTimeout(timer);
    // onSettled cố tình không nằm trong deps: nó là callback inline ở phía gọi,
    // đưa vào sẽ khiến timer bị huỷ và tạo lại mỗi lần cha render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, duration]);

  return (
    <div
      className="overflow-hidden"
      style={{
        height: height === null ? 'auto' : height,
        transition: `height ${duration}ms ${STEP_SLIDE_EASE}`,
      }}
    >
      <div
        className="flex items-start"
        style={{
          width: `${steps.length * 100}%`,
          transform: `translateX(-${(activeIndex * 100) / steps.length}%)`,
          transition: `transform ${duration}ms ${STEP_SLIDE_EASE}`,
        }}
      >
        {steps.map((step, index) => {
          // Trong lúc trượt cả hai bước đều phải hiện diện — với mắt lẫn với trình
          // đọc màn hình, vì bước đang rời đi có thể vẫn đang giữ focus. Trượt xong
          // mới ẩn hẳn bước ngoài khung: visibility:hidden giữ nguyên phép đo chiều
          // cao, đồng thời loại phần tử khỏi thứ tự tab và khỏi vùng bấm.
          const isPresent = isSliding || index === activeIndex;
          return (
            <div
              key={index}
              ref={(element) => {
                stepRefs.current[index] = element;
              }}
              className="shrink-0"
              style={{
                width: `${100 / steps.length}%`,
                visibility: isPresent ? 'visible' : 'hidden',
              }}
              aria-hidden={isPresent ? undefined : true}
            >
              {step}
            </div>
          );
        })}
      </div>
    </div>
  );
};
