import { AppPagination } from '@components/shared';
import AppTable from '@components/shared/AppTable/AppTable';
import { Typography } from '@douyinfe/semi-ui';
import {
  IconCaretup,
  IconCaretdown,
  IconTriangleUp,
  IconTriangleDown,
} from '@douyinfe/semi-icons';
import { StringHelper } from '@helpers/string.helper';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { CustomerClassificationListFilter } from './CustomerClassificationListFilter';
import { ContentWrapper } from '@components/widgets';
import { ReportService } from '@services/report';
import TextOverflow from '@components/shared/TextOverflow/TextOverflow';

type FilterType = {
  page: number;
  size: number;
  sort: any[];
};

export const CustomerClassificationList = (props: any) => {
  const { basePath, onClickViewDetail, showFilter = true } = props;
  const [filter, setFilter] = useState<FilterType>({
    page: 1,
    size: 10,
    sort: [],
  });

  const { data, isLoading, refetch } = useQuery(
    ['campaign-list', filter],
    () => ReportService.getAllCustomerClassification(filter),
    {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
    }
  );

  const { Text } = Typography;

  const router = useRouter();

  const getTableData = () => {
    if (isLoading || !data?.data?.content) return [];
    return data?.data?.content;
  };

  const sortColum = (dataIndex: string, type: string) => {
    setFilter({
      ...filter,
      page: 1,
      size: 10,
      sort: [dataIndex, type],
    });
  };

  const titleSortRender = (title: string, dataIndex: string) => {
    return (
      <div className="black flex items-center min-w-max">
        <p className=" w-full">{title}</p>
        <div className="flex flex-col ml-3 mt-1 cursor-pointer">
          <span className="h-[12px]">
            <IconTriangleUp
              size="small"
              onClick={() => sortColum(dataIndex, 'asc')}
            />
          </span>
          <span>
            <IconTriangleDown
              size="small"
              onClick={() => sortColum(dataIndex, 'desc')}
            />
          </span>
        </div>
      </div>
    );
  };

  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 100,
      render: (name: any, record: any, index: any) => {
        return (
          <Text>
            <span>{StringHelper.indexTable(filter.page, index)}</span>
          </Text>
        );
      },
    },
    {
      title: titleSortRender('SĐT khách hàng', 'phoneNumber'),
      dataIndex: 'phoneNumber',
      width: 150,
      render: (e: any, record: any, a: any) => {
        return StringHelper.convertStringToArray(e, ',').map(
          (x: any, idx: any) => x && <p key={`${x}-${idx}`}>{x}</p>
        );
      },
    },
    {
      title: titleSortRender('Họ Tên khách hàng', 'name'),
      dataIndex: 'name',
      width: 250,
      render: (e: any, record: any, a: any) => {
        return <p>{e}</p>;
      },
    },
    {
      title: titleSortRender('Tên doanh nghiệp', 'companyName'),
      dataIndex: 'companyName',
      width: 250,
      render: (e: any, render: any) => {
        return (
          <TextOverflow line={1}>
            <p className="beam-break-world">{e}</p>
          </TextOverflow>
        );
      },
    },
    {
      title: titleSortRender('Hạn mức tháng hiện tại', 'currentMaxPayLimit'),
      dataIndex: 'currentMaxPayLimit',
      width: 200,
      render: (e: any) => <p>{StringHelper.formatVND(e)}</p>,
    },
    {
      title: titleSortRender('Số tiền đã ứng', 'totalAmountOfAdvanceSalary'),
      dataIndex: 'totalAmountOfAdvanceSalary',
      width: 150,
      render: (e: any) => <p>{StringHelper.formatVND(e)}</p>,
    },
    {
      title: titleSortRender('Số lần ứng lương', 'numberOfSalaryAdvances'),
      dataIndex: 'numberOfSalaryAdvances',
      width: 160,
    },
    {
      title: titleSortRender('Số lần đăng nhập', 'numberOfLoginTimes'),
      dataIndex: 'numberOfLoginTimes',
      width: 160,
    },
    {
      title: titleSortRender('Tỉ lệ ứng lương', 'salaryAdvanceRate'),
      dataIndex: 'salaryAdvanceRate',
      width: 160,
      render: (x: any) => {
        return <p>{x}%</p>;
      },
    },
    {
      title: titleSortRender('Tần suất ứng lương', 'frequencySalaryAdvance'),
      dataIndex: 'frequencySalaryAdvance',
      width: 160,
      render: (x: any) => {
        return <p>{x}</p>;
      },
    },
    {
      title: titleSortRender('Phân loại khách hàng', 'customerClassification'),
      dataIndex: 'customerClassification',
      width: 250,
      render: (x: any) => {
        let label = '';

        switch (x) {
          case 0:
            label = 'Khách hàng có hạn mức lớn (Chưa đăng ký DVUL)';
            break;
          case 1:
            label = 'Khách hàng có hạn mức thấp (Chưa đăng ký DVUL)';
            break;
          case 2:
            label = 'Khách hàng thân thiết';
            break;
          case 3:
            label = 'Khách hàng tiềm năng';
            break;
        }
        return <p className="beam-break-world">{label}</p>;
      },
    },
  ];

  return (
    <ContentWrapper pageTitle="Phân loại khách hàng">
      <div className="flex flex-col gap-5">
        {showFilter && (
          <CustomerClassificationListFilter
            onFilter={setFilter}
            refetch={refetch}
          />
        )}

        <AppTable
          size="small"
          loading={isLoading}
          columns={columns}
          className="beam-break-world"
          dataSource={getTableData()}
          scroll={{ x: 'scroll' }}
          renderPagination={(e: any) => {
            return (
              <div className="py-2 w-full flex justify-end">
                <AppPagination
                  {...data?.data}
                  onChange={(e: any) => {
                    setFilter({
                      ...filter,
                      page: e,
                    });
                  }}
                />
              </div>
            );
          }}
        />
      </div>
    </ContentWrapper>
  );
};
