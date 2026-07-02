import { AppPagination } from '@components/shared';
import AppTable from '@components/shared/AppTable/AppTable';
import { BoxWrapper, ContentWrapper } from '@components/widgets';
import { COMMON_FORMAT, TIMEZONE_FORMAT } from '@constants/common-format';
import { IconAlignBottom } from '@douyinfe/semi-icons';
import moment from 'moment-timezone';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { StringHelper } from '@helpers/string.helper';
import { ReconciliationService } from '@services/reconciliation';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import ReconciliationConcernFilter from './ReconciliationConcernFilter';
import TextOverflow from '@components/shared/TextOverflow/TextOverflow';
import { UserRole } from '@constants/auth.constants';
import { useAuth } from '@contexts/authentication';
import { ArrayHelper } from '@helpers/array.helper';

enum BeamReportTypeEnum {
  'BEAM_REPORT' = 0,
  'BEAM_UPLOAD' = 1,
  'BEAM_FINAL' = 4,
  'BEAM_FINAL_PDF' = 5,
}

enum ConcernReportTypeEnum {
  'COMPANY_UPLOAD' = 2,
  'COMPANY_FINAL' = 3,
}

const ReconciliationConcernList = (props: any) => {
  const { companyData } = props;
  const [filter, setFilter] = useState<any>(null);
  const { authCheckByRole } = useAuth();
  authCheckByRole([
    UserRole.BEAM_ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.HR_ADMIN,
    UserRole.RECONCILER,
    UserRole.ACCOUNTANT,
    UserRole.CONTROLLER,
  ]);
  const { data, isLoading, isFetching, refetch } = useQuery(
    ['cash_flow_list_details', filter],
    () => ReconciliationService.getListCompaniesReconciliation(filter),
    {
      enabled: filter !== null,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    }
  );
  useEffect(() => {
    if (filter !== null) {
      refetch();
    }
  }, [filter]);

  const onFilter = (values: any) => {
    const periods = values?.periods.map((x: any) => {
      const periodsString = x.split('|');
      return periodsString[0] + 'T00:00:00';
    });
    const request = {
      // ...values,
      companyId: values?.companyIds,
      periods: periods,
      type: ArrayHelper.convertEmptyArrayToNull(values.type),
      endTime:
        Array.isArray(values?.dateRanges) && values?.dateRanges.length > 0
          ? moment(values?.dateRanges[1])
              .tz(TIMEZONE_FORMAT.GMT0)
              .format()
              .replace('Z', '')
          : null,
      startTime:
        Array.isArray(values?.dateRanges) && values?.dateRanges.length > 0
          ? moment(values?.dateRanges[0])
              .tz(TIMEZONE_FORMAT.GMT0)
              .format()
              .replace('Z', '')
          : null,
      source: values.source,
    };

    setFilter(request);
  };

  const getTableData = () => {
    if (!data) return [];
    return data;
  };
  const convertZeroMoney = (type: any, value: any) => {
    return [5, 6].includes(type) ? '-' : StringHelper.formatVND(value);
  };
  const convertZeroRecord = (type: any, value: any) => {
    return [5, 6].includes(type) ? '-' : value;
  };
  const columns = [
    {
      title: 'File đối soát',
      dataIndex: 'filePath',
      align: 'right' as 'right',
      width: 150,
      render: (e: any) => (
        <IconAlignBottom
          size="large"
          className="cursor-pointer text-blue-700"
          onClick={() => {
            const URL = `${e}`;
            if (typeof window !== 'undefined') {
              window.location.href = URL;
            }
          }}
        />
      ),
    },
    {
      title: 'Kỳ đối soát',
      dataIndex: 'term',
      align: 'right' as 'right',
      width: 250,
      render: (e: any, record: any) => (
        <p>
          {DateTimeHelper.formatDateTime(record.startTime, COMMON_FORMAT.DATE)}{' '}
          - {DateTimeHelper.formatDateTime(record.endTime, COMMON_FORMAT.DATE)}
        </p>
      ),
    },
    {
      title: 'Tên file đối soát',
      dataIndex: 'fileName',
      align: 'right' as 'right',
      width: 260,
      // render: (name: any) => <p className='beam-break-world'>{name}</p>,
    },
    {
      title: 'Loại báo cáo',
      dataIndex: 'type',
      align: 'right' as 'right',
      width: 270,
      render: (e: any) => {
        let label = '';
        switch (e) {
          case 0:
            label = 'Báo cáo gốc';
            break;
          case 1:
            label = 'Báo cáo đối soát';
            break;
          case 2:
            label = 'Báo cáo đối soát';
            break;
          case 3:
            label = 'Báo cáo chốt đối soát';
            break;
          case 4:
            label = 'Báo cáo chốt đối soát';
            break;
          case 5:
            label = 'Báo cáo chốt có xác nhận (PDF)';
            break;
          case 6:
            label = 'Báo cáo chốt có xác nhận (PDF)';
            break;
        }
        return <p>{label}</p>;
      },
    },

    {
      title: 'Ngày gửi báo cáo',
      dataIndex: 'createdTime',
      align: 'right' as 'right',
      width: 250,
      render: (e: any) => (
        <p>
          {e === null
            ? ''
            : DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE_TIME)}
        </p>
      ),
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updatedTime',
      align: 'right' as 'right',
      width: 250,
      render: (e: any) => (
        <p>
          {e === null
            ? ''
            : DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE_TIME)}
        </p>
      ),
    },
    {
      title: 'Nguồn báo cáo',
      dataIndex: 'type',
      align: 'right' as 'right',
      width: 250,
      render: (e: any) => {
        let label = '';
        switch (e) {
          case 0:
            label = 'BEAM';
            break;
          case 1:
            label = 'BEAM';
            break;
          case 2:
            label = 'Doanh nghiệp';
            break;
          case 3:
            label = 'Doanh nghiệp';
            break;
          case 4:
            label = 'BEAM';
            break;
          case 5:
            label = 'BEAM';
            break;
          case 6:
            label = 'Doanh nghiệp';
            break;
        }
        return <p>{label}</p>;
      },
    },
    {
      title: 'Người chốt đối soát',
      dataIndex: 'reconcilerUsername',
      align: 'right' as 'right',
      width: 270,
      render: (e: any) => {
        return <p>{e}</p>;
      },
    },
    {
      title: 'Nguồn chốt đối soát',
      dataIndex: 'reconciliationSourceType',
      align: 'right' as 'right',
      width: 270,
      render: (e: any) => {
        let label = '';
        switch (e) {
          case 0:
            label = 'Web Portal';
            break;
          case 1:
            label = 'Email';
            break;
        }
        return <p>{label}</p>;
      },
    },
    {
      title: 'Số lượng bản ghi',
      dataIndex: 'totalRecord',
      align: 'right' as 'right',
      width: 250,
      render: (name: any, record: any) => (
        <p>{convertZeroRecord(record.type, name)} </p>
      ),
    },
    {
      title: 'Tổng số tiền',
      dataIndex: 'totalRequestAmount',
      align: 'right' as 'right',
      width: 250,
      render: (e: any, record: any) => (
        <p>{convertZeroMoney(record.type, e)}</p>
      ),
    },
    {
      title: 'Số giao dịch hợp lệ',
      dataIndex: 'totalValidRecord',
      align: 'right' as 'right',
      width: 250,
      render: (e: any, record: any) => (
        <p>{convertZeroRecord(record.type, e)} </p>
      ),
    },
    {
      title: 'Tổng số tiền giao dịch hợp lệ',
      dataIndex: 'totalValidAmount',
      align: 'right' as 'right',
      width: 250,
      render: (e: any, record: any) => (
        <p>{convertZeroMoney(record.type, e)}</p>
      ),
    },
    {
      title: 'Số giao dịch không hợp lệ',
      dataIndex: 'totalInvalidRecord',
      align: 'right' as 'right',
      width: 250,
      render: (e: any, record: any) => (
        <p>{convertZeroRecord(record.type, e)} </p>
      ),
    },
    {
      title: 'Tổng số tiền giao dịch không hợp lệ',
      dataIndex: 'totalInvalidAmount',
      align: 'right' as 'right',
      width: 270,
      render: (e: any, record: any) => (
        <p>{convertZeroMoney(record.type, e)}</p>
      ),
    },
    {
      title: 'Ghi chú',
      dataIndex: 'description',
      width: 250,
      render: (text: any) => (
        <TextOverflow className="beam-break-world" line={3}>
          {text}
        </TextOverflow>
      ),
    },
  ];

  return (
    <>
      <div className="pt-6 px-6 flex flex-col gap-4">
        <BoxWrapper padding={6}>
          <ReconciliationConcernFilter
            onSubmit={onFilter}
            setFilter={setFilter}
            filter={filter}
            refetch={refetch}
            companyData={companyData}
          />
        </BoxWrapper>
      </div>
      <ContentWrapper>
        <AppTable
          size="small"
          columns={columns}
          className="beam-break-world"
          dataSource={getTableData()}
          loading={isLoading}
          pagination={{
            // currentPage: data?.data?.repostCompanies?.number + 1,
            pageSize: 10,
            total: data?.length,
            // onChange: (e: any) => {
            //   setFilter({ ...filter, page: e });
            // },
          }}
        />
      </ContentWrapper>
    </>
  );
};

export default ReconciliationConcernList;
