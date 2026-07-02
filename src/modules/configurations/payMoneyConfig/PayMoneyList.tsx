import { Radio, RadioGroup, Tag, Typography } from "@douyinfe/semi-ui";
import { PayMoneyConfigurationFilter } from "./PayMoneyConfigurationFilter";
import AppTable from "@components/shared/AppTable/AppTable";
import { title } from "process";
import { useState } from "react";
import { useQuery } from "react-query";
import { PaymentSendingMethodService } from "@services/payment-sending-method";
import { useRouter } from "next/router";
import { AppPagination } from "@components/shared";
import { Text } from "recharts";
import { DateTimeHelper } from "@helpers/date-time.helper";
import { COMMON_FORMAT } from "@constants/common-format";
import { render, status } from "nprogress";
import { ProtectedWrapper } from "@components/widgets/Auth";
import { UserRole } from "@constants/auth.constants";
import { IconDelete, IconEdit } from '@douyinfe/semi-icons';
import Label from "@douyinfe/semi-ui/lib/es/form/label";

export const PayMoneyList = () => {
  const { Text } = Typography;

  const [filter, setFilter] = useState({
    companyIds: [],
    bankCode: '',
    dateRanges: [],
    status: '',
    page: 1,
    size: 10,
  });

  
  const { data, isLoading, refetch } = useQuery(
    ['paymoney-list', filter],
    () => PaymentSendingMethodService.getAll(filter),
    {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
    }
    
  );

  const router = useRouter();
  const getTableData = () => {
    if (isLoading || !data?.content) return [];
    return data?.content;
  };

  const onFilter = (values: any) => {
    setFilter(values);
    refetch();
  }


    const columns = [
    {
      title: 'Mã số doanh nghiệp',
      dataIndex: 'index',
      width: 200,
      render: (index: any) => `${index}`
    },
    {
      title: 'Tên doanh nghiệp',
      dataIndex: 'companyName',
      width: 350,
    },
    {
      title: 'Mã số thuế',
      dataIndex: 'taxIdentificationNumber',
      width: 150,
    },
    {
     
      title: 'Ngân hàng đi tiền',
      dataIndex: 'bankCode',
      width: 200,
      render: (x:any) => {
        let label = '';
        switch (x) {
          case 'VPBANK':
            label = 'VPBank';
            break;
          case 'PVCOMBANK':
            label = 'PVcomBank';
            break;
          case 'VIETCOMBANK':
            label = 'VietcomBank';
            break;
        }
        return (
          <p>{label}</p>
        );
      },
    },
    {
      title: 'Thời gian áp dụng',
      render: (text: any, record: any) => {
        const { startAppliedDate, endAppliedDate } = record;
        if (startAppliedDate && endAppliedDate) {
          return (
            <>
              {DateTimeHelper.convertTimeZone(startAppliedDate, COMMON_FORMAT.DATE)} - {DateTimeHelper.convertTimeZone(endAppliedDate, COMMON_FORMAT.DATE)}
            </>
          );
        } else if (startAppliedDate && !endAppliedDate) {
          return (
            <>
              {DateTimeHelper.convertTimeZone(startAppliedDate, COMMON_FORMAT.DATE)}
            </>
          );
        } else {
          return '';
        }
      },
      width: 350,
    },
    {
      title: 'Nội dung cập nhật',
      dataIndex: 'id',
      width: 180,
      render: (userId: any, record: any) => {
        return (
          <Text
            onClick={() => router.push(`/change-log/PaymentSendingMethod/${record.id}`)}
            link
            className="beam-break-world"
          >
            Xem lịch sử
          </Text>
        ) ;
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 250,
      render: (x: any) => {
        let label = '';
        let className: any = '';

        switch (x) {
          case 'ACTIVE':
            label = 'Hoạt động';
            className = 'green';
            break;
          case 'INACTIVE':
            label = 'Không hoạt động';
            className = 'grey';
            break;
          case 'EXPIRED':
            label = 'Hết hạn';
            className = 'red';
            break;
        }
        return (
          <Tag size="small" color={className}>
            {label}
          </Tag>
        );
      },
    },
    
    {
      title: 'Hành động',
      width: 250,
      dataIndex: 'id',
      align: 'left' as 'left',
      render: (id: any, record: any) => {
        return (
          <ProtectedWrapper
            allowedRoles={[UserRole.BEAM_ADMIN, UserRole.SUPER_ADMIN]}
          >
            <div className="flex gap-3 pl-3">
            {record.status !== 'EXPIRED' && (
            <IconEdit
              onClick={() => {
                router.push(`/configurations/pay-money/${id}/edit`);
              }}
              className="cursor-pointer"
            />
          )}
            </div>
          </ProtectedWrapper>
        );
      }
    },
  ];


  return (
    <div className="flex flex-col gap-4">
      <PayMoneyConfigurationFilter onFilter = {onFilter} />
      <AppTable
        size="small"
        dataSource={getTableData()}
        columns={columns}
        renderPagination={(e: any) => {
          return (
            <div className="py-2 w-full flex justify-end">
              <AppPagination
                {...data}
                onChange={(e: any) => {
                  setFilter({
                    ...filter,
                    page: e,
                  });
                  refetch();
                }}
              />
            </div>
          );
        }}
      />
    </div>
  );
}