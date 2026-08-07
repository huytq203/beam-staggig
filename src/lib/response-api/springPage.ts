/**
 * Dựng lại đúng payload `org.springframework.data.domain.Page` mà BE cũ
 * (core.devops.beamewa.com.vn) trả cho landing page, để đổi backend mà không
 * phải đụng vào code phía landing.
 *
 * Landing chỉ đọc `data.content`, nhưng ta trả đủ các khoá còn lại để giữ
 * contract nguyên vẹn cho bất kỳ consumer nào khác.
 */

/** BE cũ không truyền Sort vào Pageable (sort nằm trong query) nên luôn là "unsorted". */
const UNSORTED = { empty: true, sorted: false, unsorted: true } as const;

export interface SpringPage<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: typeof UNSORTED;
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  numberOfElements: number;
  sort: typeof UNSORTED;
  first: boolean;
  empty: boolean;
}

/**
 * @param page 1-based (đúng như query param client gửi lên). Trường `number`
 *             trong payload trả về là 0-based, giống Spring.
 */
export function toSpringPage<T, R>(
  rows: T[],
  total: number,
  page: number,
  size: number,
  mapper: (item: T) => R
): SpringPage<R> {
  const number = Math.max(page - 1, 0);
  const totalPages = size > 0 ? Math.ceil(total / size) : 1;
  const hasContent = rows.length > 0;

  return {
    content: rows.map(mapper),
    pageable: {
      pageNumber: number,
      pageSize: size,
      sort: UNSORTED,
      offset: number * size,
      paged: true,
      unpaged: false,
    },
    totalElements: total,
    totalPages,
    // Spring: hasNext() = number + 1 < totalPages && hasContent()
    last: !(number + 1 < totalPages && hasContent),
    size,
    number,
    numberOfElements: rows.length,
    sort: UNSORTED,
    // Spring: hasPrevious() = number > 0
    first: number === 0,
    empty: !hasContent,
  };
}
