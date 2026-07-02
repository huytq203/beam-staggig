import { Collapse, Tag } from '@douyinfe/semi-ui';
import { CampaignService } from '@services/campaigns';
import { useQuery } from 'react-query';
import { IconMinus, IconPlus } from '@douyinfe/semi-icons';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { COMMON_FORMAT } from '@constants/common-format';
import { CompanyService, GroupsServices } from '@services/companies';
import { EmployeesServices } from '@services/companies/accounts';
import { useState } from 'react';
import AppTable from '@components/shared/AppTable/AppTable';
import { StringHelper } from '@helpers/string.helper';

export const CampaignDetail = (props: any) => {
  const { campaignId } = props;

  const [filter, setFilter] = useState({
    salaryAdvance: '',
    searchKey: '',
    enable: '',
    accountStatus: 'ALL',
    timeType: 'ALL',
    startTime: '',
    endTime: '',
    page: 1,
    size: 1000,
    sort: ['updatedAt,desc'],
  });

  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
  });

  const { data, isFetching, isLoading, error, isError } = useQuery(
    `campaign_detail_${campaignId}`,
    () => CampaignService.getCampaign(campaignId),
    {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    }
  );

  const { data: companyList } = useQuery(
    'company_data',
    async () => {
      const response = await CompanyService.getAllCompaniesDropdown({});
      return response;
    },
    {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
    }
  );

  const { data: campaignType } = useQuery(
    ['campaign-type-selection-list'],
    () => CampaignService.getCampaignTypes({}),
    {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    }
  );

  const campaignNames = campaignType?.content
    ?.filter((campaign: any) => data?.campaignTypeId?.includes(campaign.id))
    ?.map((campaign: any) => campaign.name);

  const companyId = data?.companyEmployeeId;

  const { data: employeeInCompany } = useQuery(
    ['accounts', filter, companyId],
    () => EmployeesServices.getListEmployeesInCompany(filter, companyId),
    {
      enabled: !!companyId,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
    }
  );

  const { data: groupData } = useQuery(
    [`campaign-select`, companyId],
    () =>
      GroupsServices.getListGroupsInComany(
        {
          size: 100,
        },
        companyId
      ),
    {
      cacheTime: 0,
      refetchOnWindowFocus: false,
      enabled: companyId != null,
    }
  );
  const groupNames = Array.isArray(groupData?.content)
    ? groupData.content
        .filter((group: any) => data?.groupIds.includes(group.id))
        .map((group: any) => group.name)
    : [];
  const company = companyList?.find(
    (company: any) => company.id === data?.companyEmployeeId
  );

  const applyIds = data?.applyIds || [];

  const matchedCompanies = companyList?.filter((company: any) =>
    applyIds.includes(company.id)
  );

  const filteredEmployees = employeeInCompany?.content?.filter(
    (employee: any) => applyIds.includes(employee.id)
  );

  const handlePageChange = (page: number) => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      page: page,
    }));
  };

  const paginatedEmployees = filteredEmployees?.slice(
    (pagination.page - 1) * pagination.size,
    pagination.page * pagination.size
  );

  const paginatedCompanies = matchedCompanies?.slice(
    (pagination.page - 1) * pagination.size,
    pagination.page * pagination.size
  );

  const columnsConpany = [
    {
      title: 'STT',
      key: 'index',
      render: (name: any, record: any, index: any) => {
        return <span>{StringHelper.indexTable(pagination.page, index)}</span>;
      },
    },
    {
      title: 'Tên công ty',
      dataIndex: 'name',
      key: 'name',
    },
  ];

  const columnsEmployee = [
    {
      title: 'STT',
      key: 'index',
      render: (name: any, record: any, index: any) => {
        return <span>{StringHelper.indexTable(pagination.page, index)}</span>;
      },
    },
    {
      title: 'Tên nhân viên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mã nhân viên',
      dataIndex: 'employeeCode',
      key: 'employeeCode',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
  ];
  return (
    <div className="flex flex-col gap-5">
      <Collapse
        expandIcon={<IconPlus />}
        collapseIcon={<IconMinus />}
        className="p-0"
        defaultActiveKey={[
          'campaignInformation',
          'applyRange',
          'applyCondition',
        ]}
      >
        <Collapse.Panel
          header="THÔNG TIN CHIẾN DỊCH"
          itemKey="campaignInformation"
        >
          <div className="flex flex-col gap-4 p-4">
            <div className="grid grid-cols-2 gap-4">
              <span>Tên chiến dịch</span>
              <span className="font-semibold">{data?.name}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <span>Loại chiến dịch</span>
              <span className="font-semibold">{campaignNames}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <span>Mã chiến dịch</span>
              <span className="font-semibold">{data?.code}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <span>Mô tả</span>
              <span className="font-semibold">{data?.description}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <span>Ngày bắt đầu</span>
              <span className="font-semibold">
                {data?.startTime
                  ? DateTimeHelper.convertTimeZone(
                      data.startTime,
                      COMMON_FORMAT.DATE_TIME
                    )
                  : null}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <span>Ngày kết thúc</span>
              <span className="font-semibold">
                {data?.endTime
                  ? DateTimeHelper.convertTimeZone(
                      data.endTime,
                      COMMON_FORMAT.DATE_TIME
                    )
                  : null}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <span>Số lượng</span>
              <span className="font-semibold">{data?.quantity}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <span>Ngân sách chiến dịch</span>
              <span className="font-semibold">
                {StringHelper.formatVND(data?.maximumBudget)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <span>Ngân sách đã dùng</span>
              <span className="font-semibold">
                {StringHelper.formatVND(data?.maximumBudgetUsed)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <span>Ngân sách còn lại</span>
              <span className="font-semibold">
                {StringHelper.formatVND(data?.maximumBudgetLeft)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <span>Giá trị</span>
              <span className="font-semibold">
                {data?.value}{' '}
                {
                  campaignValueTypes.find(
                    (type) => type.value === data?.valueType
                  )?.label
                }
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <span>Giảm tối đa</span>
              <span className="font-semibold">
                {StringHelper.formatVND(data?.maximumDiscount)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <span>Trạng thái</span>
              <span className="font-semibold">
                {data?.status == 0 && (
                  <Tag size="large" color="green">
                    Hoạt động
                  </Tag>
                )}
                {data?.status == 1 && (
                  <Tag size="large" color="grey">
                    Không hoạt động
                  </Tag>
                )}
                {data?.status == 2 && (
                  <Tag size="large" color="yellow">
                    Lưu nháp
                  </Tag>
                )}
                {data?.status == 3 && (
                  <Tag size="large" color="red">
                    Hết hạn
                  </Tag>
                )}
              </span>
            </div>
          </div>
        </Collapse.Panel>
        <Collapse.Panel header="PHẠM VI ÁP DỤNG" itemKey="applyRange">
          <div className="flex flex-col gap-4 p-4">
            <div className="grid grid-cols-2 gap-4">
              <span className="self-center">Phạm vi áp dụng</span>
              <div className="flex items-center gap-2">
                {data?.applyType === 0 ? (
                  <>
                    <div className="flex flex-col">
                      <span className="font-semibold">1 doanh nghiệp</span>
                      <span className="font-semibold">{company?.name}</span>
                      {data?.applyAll && (
                        <span className="font-semibold">
                          (Áp dụng tất cả nhân viên)
                        </span>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <span className="font-semibold">Nhiều doanh nghiệp</span>
                    {data?.applyAll && (
                      <span className="font-semibold">
                        (Áp dụng tất cả các Doanh nghiệp)
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>

            <div>
              {data?.applyType === 0
                ? !data?.applyAll && (
                    <div>
                      <AppTable
                        columns={columnsEmployee}
                        dataSource={paginatedEmployees?.map(
                          (employee: any) => ({
                            key: employee.id,
                            name: employee.name,
                            employeeCode: employee.employeeCode,
                            phoneNumber: employee.phoneNumber,
                          })
                        )}
                        pagination={{
                          currentPage: pagination.page,
                          pageSize: pagination.size,
                          total: filteredEmployees?.length,
                          onChange: handlePageChange,
                        }}
                      />
                    </div>
                  )
                : !data?.applyAll && (
                    <div>
                      <AppTable
                        columns={columnsConpany}
                        dataSource={paginatedCompanies?.map((company: any) => ({
                          key: company.id,
                          name: company.name,
                        }))}
                        pagination={{
                          currentPage: pagination.page,
                          pageSize: pagination.size,
                          total: matchedCompanies?.length,
                          onChange: handlePageChange,
                        }}
                      />
                    </div>
                  )}
            </div>
          </div>
        </Collapse.Panel>
        <Collapse.Panel header="ĐIỀU KIỆN ÁP DỤNG" itemKey="applyCondition">
          <div className="flex flex-col gap-4 p-4">
            <div className="grid grid-cols-2 gap-4">
              <span>Số lần áp dụng (trên một tài khoản)</span>
              <span className="font-semibold">
                {
                  applyNumberOptions.find(
                    (option) => option.value === data?.applyNumber[0]
                  )?.label
                }
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <span>Giới tính</span>
              <span className="font-semibold">
                {
                  sexOptions.find((option) => option.value === data?.sex[0])
                    ?.label
                }
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <span>Sinh nhật</span>
              <span className="font-semibold">
                {data?.birthMonth
                  ?.map(
                    (month: any) =>
                      birthMonthOptions.find((option) => option.value === month)
                        ?.label
                  )
                  .join(',')}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <span>Độ tuổi</span>
              <span className="font-semibold">
                {data?.ageRange
                  .map(
                    (age: any) =>
                      ageRangeOptions.find((option) => option.value === age)
                        ?.label
                  )
                  .join(', ')}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <span>Chức vụ</span>
              <span className="font-semibold">
                {
                  jobRoleOptions.find(
                    (option) => option.value === data?.jobRole[0]
                  )?.label
                }
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <span>Mức giao dịch tối thiểu</span>
              <span className="font-semibold">
                {
                  minimumTransferOptions.find(
                    (option) => option.value === data?.minimumTransfer[0]
                  )?.label
                }
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <span>Nhóm</span>
              <span className="font-semibold">{groupNames?.join(', ')}</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <span>Áp dụng đồng thời với các chiến dịch khác</span>
              <div>{data?.multipleApply ? 'Có' : 'Không'}</div>
            </div>
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

const applyNumberOptions = [
  { value: 0, label: '01' },
  { value: 1, label: '02' },
  { value: 2, label: '03' },
  { value: 3, label: 'Không giới hạn' },
];

const sexOptions = [
  { value: 0, label: 'Tất cả' },
  { value: 1, label: 'Nam' },
  { value: 2, label: 'Nữ' },
  { value: 3, label: 'Khác' },
];

const birthMonthOptions = [
  { value: 0, label: 'Tất cả' },
  { value: 1, label: 'Tháng 1' },
  { value: 2, label: 'Tháng 2' },
  { value: 3, label: 'Tháng 3' },
  { value: 4, label: 'Tháng 4' },
  { value: 5, label: 'Tháng 5' },
  { value: 6, label: 'Tháng 6' },
  { value: 7, label: 'Tháng 7' },
  { value: 8, label: 'Tháng 8' },
  { value: 9, label: 'Tháng 9' },
  { value: 10, label: 'Tháng 10' },
  { value: 11, label: 'Tháng 11' },
  { value: 12, label: 'Tháng 12' },
];

const ageRangeOptions = [
  { value: 0, label: 'Tất cả' },
  { value: 1, label: 'Dưới 20' },
  { value: 2, label: '20 - 29' },
  { value: 3, label: '30 - 39' },
  { value: 4, label: '40 - 49' },
  { value: 5, label: '50 - 59' },
  { value: 6, label: 'Trên 60' },
];

const jobRoleOptions = [
  { value: 0, label: 'Tất cả' },
  { value: 1, label: 'Nhân viên' },
  { value: 2, label: 'Quản lý' },
];

const minimumTransferOptions = [
  { value: 0, label: '0' },
  { value: 1, label: '100,000' },
  { value: 2, label: '1,000,000' },
  { value: 3, label: '3,000,000' },
  { value: 4, label: '5,000,000' },
];

const campaignValueTypes = [
  {
    label: 'VNĐ',
    value: 0,
  },
  {
    label: '%',
    value: 1,
  },
];
