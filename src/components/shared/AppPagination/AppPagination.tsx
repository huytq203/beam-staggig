import { Pagination } from '@douyinfe/semi-ui';

export interface AppPaginationProps {
  //   pageable: {
  //     sort: {
  //       empty: false
  //       unsorted: false
  //       sorted: true
  //     }
  //     offset: 0
  //     pageNumber: 0
  //     pageSize: 10
  //     paged: true
  //     unpaged: false
  //   }
  //   last: false
  //   totalElements: 26
  //   totalPages: 3
  //   first: true
  //   size: 10
  //   number: 0
  //   sort: {
  //     empty: false
  //     unsorted: false
  //     sorted: true
  //   }
  //   numberOfElements: 10
  //   empty: false

  totalElements: number;
  number: number;
  numberOfElements: number;
  size: number;
  onChange: any;
}

export const AppPagination = (props: AppPaginationProps) => {
  const {
    totalElements,
    number = 0,
    size,
    numberOfElements = 0,
    onChange,
  } = props;

  return (
    <div className="flex justify-end">
      <Pagination
        currentPage={number + 1}
        total={totalElements}
        pageSize={size}
        onChange={onChange}
        showTotal
      />
    </div>
  );
};
