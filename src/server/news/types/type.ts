export interface FindParams {
  title?: string;
  page?: number;
  pageSize?: number;
}

export interface CreateNew {
  title: string;
  slug: string;
  coverImage?: string | null;
  description?: string | null;
  content?: string | null;
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
  isHotNew?: boolean;
  tags?: string[] | null;
  shows?: boolean;
  status?: string;
}
