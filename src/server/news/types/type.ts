export interface FindParams {
  title?: string;
  page?: number;
  pageSize?: number;
}

export interface PublicFindParams {
  /** Tìm theo tiêu đề. BE cũ dùng query param tên `name`. */
  name?: string;
  /** 1-based, giống contract cũ. */
  page?: number;
  size?: number;
}

export interface CreateNew {
  title: string;
  slug: string;
  coverImage?: string | null;
  description?: string | null;
  content?: string | null;
  ref?: string | null;
  isHotNew?: boolean;
  tags?: string[] | null;
  shows?: boolean;
  status?: string;
}

export interface UpdateNews {
  title?: string;
  slug?: string;
  coverImage?: string | null;
  description?: string | null;
  content?: string | null;
  ref?: string | null;
  isHotNew?: boolean;
  tags?: string[] | null;
  shows?: boolean;
  status?: string;
}
