import { ProtectedWrapper } from '@components/widgets/Auth';
import { UserRole } from '@constants/auth.constants';
import { COMMON_FORMAT } from '@constants/common-format';
import { useAuth } from '@contexts/authentication';
import { Divider, Tag } from '@douyinfe/semi-ui';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { StringHelper } from '@helpers/string.helper';
import { useEffect } from 'react';

const CompanyDetailRow = (props: any) => {
  const { label, children } = props;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
      <div>
        <label>{label}:</label>
      </div>
      <div className="col-span-2">
        <span className="font-bold">{children}</span>
      </div>
    </div>
  );
};

export const CompanyDetail = (props: any) => {
  const { companyData, currentProfile, isLoadingCompanyData, setCheckData } =
    props;
  const { profile }: any = useAuth();
  const fields = [
    {
      label: 'Tên công ty',
      dataField: 'name',
    },
    {
      label: 'Tên viết tắt',
      dataField: 'shortName',
    },
    {
      label: 'Mã doanh nghiệp',
      dataField: 'index',
    },
    {
      label: 'Mã số thuế',
      dataField: 'taxIdentificationNumber',
    },
    {
      label: 'Địa chỉ',
      dataField: 'address',
    },
    {
      label: 'Số điện thoại',
      dataField: 'phoneNumber',
    },
    {
      label: 'Email',
      dataField: 'email',
    },

    // {
    //   label: 'Hạn mức',
    //   dataField: 'creditLimit',
    //   render: (e: any) => {
    //     return <span>{StringHelper.formatVND(e)}</span>;
    //   },
    // },
    {
      label: 'Quy mô nhân sự',
      dataField: 'companySize',
    },
    {
      label: 'Ghi chú',
      dataField: 'description',
    },

    // {
    //   label: 'Hệ số ứng',
    //   dataField: 'companyPayRate',
    //   render: (e: any) => {
    //     return <span>{e} %</span>;
    //   },
    // },
    {
      label: 'Trạng thái',
      dataField: 'enabled',
      render: (data: any) => {
        return (
          <Tag type="solid" color={data ? 'green' : 'red'}>
            {data ? 'Hoạt động' : 'Không hoạt động'}
          </Tag>
        );
      },
    },
  ];

  const configFields = [
    {
      label: 'Nhóm doanh nghiệp',
      dataField: 'workDayType',
      render: (x: any) => {
        let label = '';
        switch (x) {
          case 'DEFAULT':
            label = 'Nhóm doanh nghiệp mặc định';
            break;
          case 'UPLOAD_WORKDAY':
            label = 'Doanh nghiệp tải lên ngày công';
            break;
          case 'API_MIGRATION':
            label = 'Doanh nghiệp tích hợp dữ liệu';
            break;
          case 'FIXED_WORKDAY':
            label = 'Doanh nghiệp ứng lương không theo ngày công';
            break;
          case 'PAY_LIMIT_FIXED_DATE':
            label = 'Doanh nghiệp có thời gian tính hạn mức';
            break;
        }
        return <p>{label}</p>;
      },
      // hidden: companyData?.workDayType !== 'FIXED_WORKDAY',
    },
    {
      label: 'Công ty tự động sinh mã nhân viên',
      dataField: 'autoGenEmployeeCode',
      render: (x: any) => <p>{x ? `Có` : `Không`}</p>,
      hidden: profile?.roles[0] == UserRole.HR_ADMIN,
    },

    {
      label: 'Doanh nghiệp phê duyệt đăng ký ứng lương',
      dataField: 'ticketRegisterSalaryAdvance',
      render: (x: any) => <p>{x ? `Có` : `Không`}</p>,
      hidden: profile?.roles[0] == UserRole.HR_ADMIN,
    },
    {
      label: 'Thay đổi thông tin tài khoản ứng lương',
      dataField: 'ticketChangeInformation',
      render: (x: any) => <p>{x ? `Có` : `Không`}</p>,
      hidden: profile?.roles[0] == UserRole.HR_ADMIN,
    },
    {
      label: 'Doanh nghiệp phê duyệt ứng lương từng lần',
      dataField: 'manageSalaryAdvanceRequest',
      render: (x: any) => <p>{x ? `Có` : `Không`}</p>,
      hidden: profile?.roles[0] == UserRole.HR_ADMIN,
    },
    {
      label: 'HR chỉnh sửa thông tin nhân sự',
      dataField: 'employeeInformationChange',
      render: (x: any) => <p>{x ? `Có` : `Không`}</p>,
      hidden: profile?.roles[0] == UserRole.HR_ADMIN,
    },
    {
      label: 'Mã số BHXH',
      dataField: 'requireSocialInsuranceNumber',
      render: (x: any) => <p>{x ? `Có` : `Không`}</p>,
      hidden: companyData?.workDayType !== 'FIXED_WORKDAY',
    },
  ];

  const changeLogFields = [
    {
      label: 'Người tạo công ty',
      dataField: 'createdBy',
    },
    {
      label: 'Ngày tạo công ty',
      dataField: 'createdAt',
      render: (e: any) => (
        <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE)}</>
      ),
    },
  ];

  const detailProfileDataFields = [
    {
      dataField: 'workday',
      label: 'Chu kỳ công',
    },
    {
      dataField: 'lastWorkingDayOfPeriod',
      label: 'Ngày chốt công',
      render: (x: any) => {
        return <p>{!x ? '' : x == 32 ? `Ngày cuối tháng` : `${x}`}</p>;
      },
    },
    {
      dataField: 'creditLimit',
      label: 'Tổng hạn mức',
      render: (e: any, record: any) => {
        return <span>{StringHelper.formatVND(e)}</span>;
      },
    },
    {
      dataField: 'startTime',
      label: 'Ngày bắt đầu',
      render: (e: any) => (
        <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE)}</>
      ),
    },
    {
      dataField: 'endTime',
      label: 'Ngày kết thúc',
      render: (e: any) => (
        <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE)}</>
      ),
    },
    {
      label: 'Trạng thái',
      dataField: 'status',
      render: (data: any) => {
        return (
          <Tag type="solid" color={data === 0 ? 'green' : 'red'}>
            {data === 0 ? 'Hoạt động' : 'Không hoạt động'}
          </Tag>
        );
      },
    },
  ];

  const paymentFields = [
    {
      label: 'Người đại diện',
      dataField: 'companyRepresentativeName',
    },
    {
      label: 'Chức vụ',
      dataField: 'companyRepresentativeRole',
    },
    {
      label: 'Tên chủ tài khoản doanh nghiệp',
      dataField: 'bankHolderName',
    },
    {
      label: 'Số tài khoản ngân hàng',
      dataField: 'bankAccountNumber',
    },
    {
      label: 'Ngân hàng',
      dataField: 'bankName',
    },
  ];
  const creditFields = [
    {
      label: 'Tổng hạn mức tối đa',
      dataField: 'creditLimit',
      render: (e: any) => <>{StringHelper.formatVND(e, '-')}</>,
    },
    {
      label: 'Tỉ lệ ứng thực tế (%)',
      dataField: 'companyPayRate',
      render: (e: any) => <>{e !== null ? `${e}%` : '-'}</>,
    },
    {
      label: 'Hạn mức tối đa doanh nghiệp được ứng trong 1 kỳ công',
      dataField: 'maxCreditLimitPerPeriod',
      render: (e: any) => <>{StringHelper.formatVND(e)}</>,
      hidden: companyData?.workDayType !== 'FIXED_WORKDAY',
    },
  ];
  const contractFields = [
    {
      label: 'Không thời hạn hợp đồng',
      dataField: 'noExpiredDates',
      render: (data: any) => {
        return (
          <Tag type="solid" color={data === false ? 'green' : 'grey'}>
            {data === false ? 'Có thời hạn' : 'Không thời hạn'}
          </Tag>
        );
      },
    },
    {
      label: 'Ngày ân hạn',
      dataField: 'gracePeriod',
    },
  ];

  const RowBuilder = (props: any) => {
    const { title, data, fields } = props;
    return (
      <>
        {title && <div className="font-bold">{title}</div>}

        {fields
          .map((field: any) => (
            <CompanyDetailRow
              label={field.label}
              hidden={field.hidden ?? false}
            >
              {field?.render && field.render(data?.[field.dataField])}
              {!field?.render && data?.[field.dataField]}
            </CompanyDetailRow>
          ))
          .filter((x: any) => x?.props?.hidden == false)}
      </>
    );
  };

  useEffect(() => {
    if (!companyData && !isLoadingCompanyData) {
      setCheckData(false);
    }
  }, [isLoadingCompanyData]);
  return (
    <div className="flex flex-col gap-4">
      <RowBuilder title="Thông tin chung" data={companyData} fields={fields} />
      <RowBuilder data={companyData} fields={paymentFields} />

      {/* {profile?.roles[0] !== UserRole.HR_ADMIN && ( */}
      <div>
        <Divider dashed />

        <RowBuilder
          title="Cấu hình doanh nghiệp"
          data={companyData}
          fields={configFields}
        />
      </div>
      {/* )} */}

      <ProtectedWrapper
        allowedRoles={[
          UserRole.BEAM_ADMIN,
          UserRole.SUPER_ADMIN,
          UserRole.ACCOUNTANT,
          UserRole.CONTROLLER,
          UserRole.RECONCILER,
        ]}
      >
        <Divider dashed />
        <RowBuilder
          title="Thông tin hạn mức"
          data={companyData}
          fields={creditFields}
        />
      </ProtectedWrapper>
      <Divider dashed />
      <RowBuilder
        title="Thông tin hợp đồng"
        data={companyData}
        fields={contractFields}
      />
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label>Ngày kết thúc hợp đồng:</label>
        </div>
        <div className="col-span-2">
          <span className="font-bold">
            {companyData?.noExpiredDates === false
              ? companyData?.contractExpiredDates
                  .map((contract: any) =>
                    DateTimeHelper.convertTimeZone(contract, COMMON_FORMAT.DATE)
                  )
                  .join(', ')
              : '-'}
          </span>
        </div>
      </div>
      <Divider dashed />

      <div className="flex flex-col gap-4">
        <div className="font-bold">Hồ sơ đang kích hoạt</div>
        {currentProfile ? (
          <div>
            <RowBuilder
              data={currentProfile}
              fields={detailProfileDataFields}
            />
          </div>
        ) : (
          <>Hiện chưa có hồ sơ nào được kích hoạt</>
        )}
      </div>
      {profile?.roles[0] !== UserRole.HR_ADMIN && (
        <>
          <Divider dashed />

          <div className="flex flex-col gap-4">
            <RowBuilder
              title="Lịch sử thay đổi"
              data={companyData}
              fields={changeLogFields}
            />
          </div>
        </>
      )}
    </div>
  );
};
