export class BaseFilter {
  name?: string;
  currentPage: number;
  pageSize: number;

  constructor(currentPage = 1, pageSize = 10) {
    this.currentPage = currentPage;
    this.pageSize = pageSize;
  }
}
