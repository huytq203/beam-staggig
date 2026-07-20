import { COMMON_FORMAT } from '@constants/common-format';
import { Divider, Tag } from '@douyinfe/semi-ui';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { StringHelper } from '@helpers/string.helper';
import { CompanyService } from '@services/companies';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

const CompanyProfileDetailRow = (props: any) => {
  const { label, children, className } = props;
  return (
    <div className="grid grid-cols-3 gap-2">
      <div>
        <label>{label}:</label>
      </div>
      <div className="col-span-2">
        <span className="font-bold">{children}</span>
      </div>
    </div>
  );
};

const CompanyProfileDetail = (props: any) => {
  const { profileId, setCheckData, setStatusProfile, companyData } = props;
  const [workDayType, setWorkDayType] = useState(null);
  const { data, isFetching, isLoading, error, isError } = useQuery(
    ['profile_detail', profileId],
    () => CompanyService.getProfile(profileId),
    {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
      enabled: profileId != null,
    }
  );

  const isNull = (value: any) => {
    return value == null || value == '' ||value==undefined;
  };

  useEffect(() => {
    setWorkDayType(companyData?.workDayType);
  }, [companyData]);
  const fields = [
    {
      label: 'Chính sách hạn mức ứng',
      dataField: 'payLimitType',
      render: (data: any) => {
        let label = '';
        switch (data) {
          case 0:
            label = 'Hạn mức theo giá trị cố định';
            break;
          case 1:
            label = 'Hạn mức theo % lương';
            break;
        }
        return <p>{label}</p>;
      },
      hidden: false,
    },
    {
      label: 'Hạn mức theo % lương',
      dataField: 'payLimitSalary',
      render: (x: any, record: any) => (
        <p>{x === null || data?.payLimitType == 0 ? `-` : `${x}%`}</p>
      ),
      hidden: false,
    },
    {
      label: 'Tổng hạn mức',
      dataField: 'creditLimit',
      render: (e: any, record: any) => {
        return <span>{isNull(e) ?  '-':StringHelper.formatVND(e) }</span>;
      },
      hidden: false,
    },
    {
      label: 'Tỉ lệ hạn mức mỗi người lao động',
      dataField: 'maxPayLimitRatioPerEmployee',
      render: (e: any, record: any) => {
        return <span>{isNull(e) ?  '-':e + '%' }</span>;
      },
      hidden: false,
    },
    {
      label: 'Hạn mức tối đa mỗi người lao động',
      dataField: 'maxPayLimitValuePerEmployee',
      render: (e: any, record: any) => {
        return <span>{isNull(e) ?  '-':StringHelper.formatVND(e) }</span>;
      },
      hidden: false,
    },
    {
      label: 'Hạn mức khả dụng',
      dataField: 'availablePaylimit',
      render: (e: any, record: any) => {
        return <span>{isNull(e) ?  '-':StringHelper.formatVND(e) }</span>;
      },
      hidden: false,
    },
    {
      label: 'Công nợ chưa thanh toán',
      dataField: 'unpaid',
      render: (e: any, record: any) => {
        return <span>{isNull(e) ?  '-':StringHelper.formatVND(e) }</span>;
      },
      hidden: false,
    },
    {
      label: 'Ngày bắt đầu',
      dataField: 'startTime',
      render: (e: any) => (
        <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE_TIME)}</>
      ),
      hidden: false,
    },
    {
      label: 'Ngày kết thúc',
      dataField: 'endTime',
      render: (e: any) => (
        <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE_TIME)}</>
      ),
      hidden: false,
    },
    {
      label: 'Loại hình trả lương ',
      dataField: 'payForm',
      render: (data: any) => {
        let label = '';
        switch (data) {
          case 0:
            label = '01 ngày cố định trong tháng';
            break;
          case 1:
            label = '02 ngày cố định trong tháng';
            break;
        }
        return <p>{label}</p>;
      },
      hidden: false,
    },
    {
      label: 'Ngày trả lương',
      dataField: 'payDay',
      hidden: false,
    },
    {
      label: 'Ngày bắt đầu Chu kỳ công',
      dataField: 'workday',
      hidden: false,
    },
    {
      label: 'Ngày chốt công',
      dataField: 'lastWorkingDayOfPeriod',
      render: (x: any) => {
        return <p>{!x ? '' : x == 32 ? `Ngày cuối tháng` : `${x}`}</p>;
      },
      hidden: false,
    },
    {
      label: 'Kỳ trả lương',
      dataField: 'payPolicy',
      render: (x: any, record: any) => {
        let label = '';
        let status = x;
        switch (status) {
          case 0:
            label = 'Kỳ lương tháng trước';
            break;
          case 1:
            label = 'Kỳ lương tháng hiện tại';
            break;
          case 2:
            label = 'Kỳ lương tháng sau';
            break;
        }

        return <p>{label}</p>;
      },
      hidden: false,
    },
    {
      label: 'Ngày bắt đầu ứng lương',
      dataField: 'startSalaryAdvanceDay',
      hidden: false,
    },
    {
      label: 'Ngày kết thúc ứng lương',
      dataField: 'endSalaryAdvanceDay',
      hidden: false,
    },
    {
      label: 'Ngày bắt đầu tải lên danh sách NLĐ',
      dataField: 'uploadEmployeeStartDay',
      hidden: workDayType !== 'FIXED_WORKDAY',
    },
    {
      label: 'Ngày kết thúc tải lên danh sách NLĐ',
      dataField: 'uploadEmployeeEndDay',
      hidden: workDayType !== 'FIXED_WORKDAY',
    },
    {
      label: 'Ngày bắt đầu tính hạn mức',
      dataField: 'payLimitByDateEnabledStartDay',
      hidden: workDayType !== 'PAY_LIMIT_FIXED_DATE',
    },
    {
      label: 'Ngày kết thúc tính hạn mức',
      dataField: 'payLimitByDateEnabledEndDay',
      hidden: workDayType !== 'PAY_LIMIT_FIXED_DATE',
    },
    // {
    //   label: 'Hạn mức Thứ 7 và CN',
    //   dataField: 'payLimitWeekendEnabled',
    //   render: (x: any) => (x ? 'Có' : 'Không'),
    //   hidden: workDayType !== 'PAY_LIMIT_FIXED_DATE',
    // },
    {
      label: 'Trạng thái',
      dataField: 'status',
      render: (x: any, record: any) => {
        let label = '';
        let className: any = '';
        let status = x;
        switch (status) {
          case 0:
            label = 'Hoạt động';
            className = 'green';
            break;
          case 1:
            label = 'Không hoạt động';
            className = 'grey';
            break;
          case 2:
            label = 'Hết hạn';
            className = 'teal';
            break;
          case 3:
            label = 'Tạm dừng hoạt động';
            className = 'cyan';
        }
        return (
          <Tag size="small" color={className}>
            {label}
          </Tag>
        );
      },
      hidden: false,
    },
  ];
  useEffect(() => {
    if (!data && !isLoading) {
      setCheckData(false);
    }
  }, [isLoading]);

  useEffect(() => {
    setStatusProfile(data?.status);
  });
  if (isLoading) return <></>;
  const RowBuilder = (props: any) => {
    const { title, data, fields } = props;

    return (
      <>
        {title && <div className="font-bold">{title}</div>}

        {fields
          .map((field: any) => {
            return (
              <CompanyProfileDetailRow
                label={field.label}
                hidden={field.hidden}
              >
                {field?.render && field?.render(data?.[field?.dataField])}
                {!field?.render && data?.[field.dataField]}
              </CompanyProfileDetailRow>
            );
          })
          .filter((x: any) => x?.props?.hidden == false)}
      </>
    );
  };

  if (isLoading) return <>...loading</>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        {/* <div className="font-bold">Thông tin hồ sơ</div> */}
        <div>
          <RowBuilder data={data} fields={fields} />
        </div>
      </div>
    </div>
  );
};

export default CompanyProfileDetail;
