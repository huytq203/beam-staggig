export interface FindParams {
  title?: string;
  page?: number;
  pageSize?: number;
}

export interface CreateNew {
  title:string;
  slug:string;
  coverImage:string;
  description:string;
  content:string;
  isHotNew:boolean;
  tags:string;
  shows:boolean;
  status:string;
  createdBy:string;
  updatedBy:string;
}

export interface UpdateNews {
  title?: string;
  slug?: string;
  coverImage?: string;
  description?: string;
  content?: string;
  isHotNew?: boolean;
  tags?: string;
  shows?: boolean;
  status?: string;
  updatedBy?: string;
}
