import { ContentWrapper } from '@components/widgets';
import { ProtectedWrapper } from '@components/widgets/Auth';
import { UserRole } from '@constants/auth.constants';
import { GeneralSubPath, NEXT_PUBLIC_API_CORE } from '@constants/index';
import { useAuth } from '@contexts/authentication';
import {
  IconChevronDown,
  IconEdit,
  IconExport,
  IconHistory,
  IconListView,
  IconPlus,
  IconUpload,
} from '@douyinfe/semi-icons';
import {
  Button,
  Dropdown,
  Notification,
  Skeleton,
  Tabs,
} from '@douyinfe/semi-ui';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { CompanyDetail } from './CompanyDetail';
import { CompanyFeePolicyList } from './CompanyFeePolicyList';
import CompanyProfileDetail from './CompanyProfileDetail';
import { CompanyProfileList } from './CompanyProfileList';
import { ExportCompanyAccountListButton } from './ExportCompanyAccountListButton';
import ListAccountsCompany from './accounts/ListAccountsCompany';
import AccountCompanyDetails from './accounts/details/AccountCompanyDetails';
import {
  CreateCompanyForm,
  CreateCompanyProfileForm,
  MultipleSalaryAdvanceForm,
} from './form';
import CreateCompanyAccountForm from './form/CreateCompanyAccountForm';
import CreateCompanyGroupForm from './form/CreateCompanyGroupForm';
import { CreateCompanyHRForm } from './form/CreateCompanyHRForm';
import { EditCompanyHRForm } from './form/EditCompanyHRForm';
import ImportCompanyAccountForm from './form/ImportCompanyAccountForm';
import ImportWorkDayEmployeeForm from './form/ImportWorkDayEmployeeForm';
import { GroupDetail } from './groups';
import ListGroupsCompany from './groups/ListGroupCompany';
import { ListHRCompany } from './hr/ListHRCompany';
import { ListTicketSalaryAdvance } from './tickets-salary-advance/ListTicketSalaryAdvance';
import { TicketSalaryAdvanceForm } from './tickets-salary-advance/TicketSalaryAdvanceForm';
import { ListTicketCompany } from './tickets/ListTicketCompany';
import { TicketUpdateInformationForm } from './tickets/form';
import { TicketRegisterSalaryForm } from './tickets/form/TicketRegisterSalaryForm';
import { ExportTicketListButton } from '@modules/companies/tickets/ExportTicketListButton';
import { AcceptTicketBatchButton } from '@modules/ticket-management/AcceptTicketBatchButton';

enum PageActionEnum {
  Null,
  CompanyDetail,
  CompanyEdit,
  Create,
  ProfileList,
  ProfileCreate,
  ProfileEdit,
  ProfileDetail,
  AccountList,
  AccountCreate,
  AccountDetail,
  AccountEdit,
  AccountImport,
  AccountChangelog,
  AccountMultipleSalary,
  GroupList,
  GroupCreate,
  GroupDetail,
  GroupEdit,
  FeePolicyList,
  HRAdminList,
  HRAdminCreate,
  HRAdminEdit,
  TicketList,
  TicketUpdateInfor,
  TicketRegisterSalary,
  ImportWorkDay,
  TicketSalaryAdvance,
  TicketSalaryAdvanceForm,
}

export const CompanyGeneralInformation = (props: any) => {
  const {
    isLoading,
    currentProfile,
    companyData,
    reFetchCompanyData,
    reFetchProfileData,
    setCheckData,
    isLoadingCompanyData,
    isShowTicket,
  } = props;
  const { profile }: any = useAuth();
  const [filterExport, setFilterExport] = useState({
    salaryAdvance: '',
    searchKey: '',
    enable: '',
    accountStatus: 'ALL',
    timeType: 'ALL',
    startTime: '',
    endTime: '',
  });
  const [isOpenUploadFile, setIsOpenUploadFile] = useState<boolean>(false);
  const [isSelectBatch, setIsSelectBatch] = useState<boolean>(false);

  const router = useRouter();
  const companyId = router.query.companyId;
  const [filterTicketExport, setFilterTicketExport] = useState({
    companyId: companyId,
    searchWord: '',
    type: '',
    status: '',
    subtype: '',
  });
  const [statusProfile, setStatusProfile] = useState(0);
  const roles = profile?.roles[0];
  const slug = (router.query.slug as string[]) || ['home'];
  const originalRoute = `/companies/${companyId}`;
  const originalProfileRoute = `/companies/${companyId}/profiles`;
  const originalAccountRoute = `/companies/${companyId}/employees`;
  const originalHRRoute = `/companies/${companyId}/hr-admin`;
  const originalTicketRoute = `/companies/${companyId}/ticket`;
  const originalTicketSalaryAdvanceRoute = `/companies/${companyId}/ticket-salary-advance`;
  const originalGroupRoute = `/companies/${companyId}/groups`;
  const originalAccountImportRoute = `${NEXT_PUBLIC_API_CORE}/companies/${companyId}/employees/upload-employees`;
  const originalWorkDayImportRoute = `${NEXT_PUBLIC_API_CORE}/work-day-manage/company/${companyId}`;
  const getCurrentSlug = (): PageActionEnum => {
    switch (slug[0]) {
      case 'home':
        return PageActionEnum.CompanyDetail;
      case 'edit':
        return PageActionEnum.CompanyEdit;
      case 'profiles':
        if (slug[1] == GeneralSubPath.CREATE) {
          return PageActionEnum.ProfileCreate;
        } else if (slug[1]) {
          if (slug[2] == GeneralSubPath.EDIT) {
            return PageActionEnum.ProfileEdit;
          }
          return PageActionEnum.ProfileDetail;
        }
        return PageActionEnum.ProfileList;
      case 'employees':
        if (slug[1] == GeneralSubPath.CREATE) {
          return PageActionEnum.AccountCreate;
        } else if (slug[1] == GeneralSubPath.IMPORT) {
          return PageActionEnum.AccountImport;
        } else if (slug[1] == GeneralSubPath.MULTIPLESALARY) {
          return PageActionEnum.AccountMultipleSalary;
        } else if (slug[1] == GeneralSubPath.IMPORT_WORK_DAY) {
          return PageActionEnum.ImportWorkDay;
        } else if (slug[1]) {
          if (slug[2] == GeneralSubPath.EDIT) {
            return PageActionEnum.AccountEdit;
          } else if (slug[2] === GeneralSubPath.CHANGELOG) {
            return PageActionEnum.AccountChangelog;
          }
          return PageActionEnum.AccountDetail;
        }
        return PageActionEnum.AccountList;
      case 'groups':
        if (slug[1] == GeneralSubPath.CREATE) {
          return PageActionEnum.GroupCreate;
        } else if (slug[1]) {
          if (slug[2] == GeneralSubPath.EDIT) {
            return PageActionEnum.GroupEdit;
          }
          return PageActionEnum.GroupDetail;
        }
        return PageActionEnum.GroupList;
      case 'hr-admin':
        if (slug[1] == GeneralSubPath.CREATE) {
          return PageActionEnum.HRAdminCreate;
        } else if (slug[1]) {
          if (slug[2] == GeneralSubPath.EDIT) {
            return PageActionEnum.HRAdminEdit;
          }
        }
        return PageActionEnum.HRAdminList;
      case 'fee-policies':
        return PageActionEnum.FeePolicyList;
      case 'ticket':
        if (slug[1]) {
          if (slug[2] == GeneralSubPath.TICKETUPDATEINFOR) {
            return PageActionEnum.TicketUpdateInfor;
          } else if (slug[2] == GeneralSubPath.TICKETREGISTERSALARY) {
            return PageActionEnum.TicketRegisterSalary;
          }
        }
        return PageActionEnum.TicketList;
      case 'ticket-salary-advance':
        if (slug[1]) {
          if (slug[2] == GeneralSubPath.TICKETSALARYADVANCE) {
            return PageActionEnum.TicketSalaryAdvanceForm;
          }
        }
        return PageActionEnum.TicketSalaryAdvance;
      default:
        return PageActionEnum.Null;
    }
  };

  const currentPageAction = getCurrentSlug();
  // useEffect(() => {
  //   if (!currentProfile) {
  //     Notification.warning({ content: 'Doanh nghiệp cần có profile hoạt động để thực hiện tác vụ', duration: 3 });
  //   }
  // }, [currentPageAction]);
  const tabActivation = [
    {
      key: 'general',
      includes: [PageActionEnum.CompanyDetail, PageActionEnum.CompanyEdit],
      defaultUrl: '/',
    },
    {
      key: 'profiles',
      includes: [
        PageActionEnum.ProfileList,
        PageActionEnum.ProfileCreate,
        PageActionEnum.ProfileEdit,
        PageActionEnum.ProfileDetail,
      ],
      defaultUrl: '/profiles',
    },
    {
      key: 'employees',
      includes: [
        PageActionEnum.AccountList,
        PageActionEnum.AccountCreate,
        PageActionEnum.AccountDetail,
        PageActionEnum.AccountEdit,
        PageActionEnum.AccountImport,
        PageActionEnum.AccountMultipleSalary,
        PageActionEnum.AccountChangelog,
        PageActionEnum.ImportWorkDay,
      ],
      defaultUrl: '/employees',
    },
    {
      key: 'groups',
      includes: [
        PageActionEnum.GroupList,
        PageActionEnum.GroupCreate,
        PageActionEnum.GroupDetail,
        PageActionEnum.GroupEdit,
      ],
      defaultUrl: '/groups',
    },
    {
      key: 'hr-admin',
      includes: [
        PageActionEnum.HRAdminList,
        PageActionEnum.HRAdminCreate,
        PageActionEnum.HRAdminEdit,
      ],
      defaultUrl: '/hr-admin',
    },
    {
      key: 'fees',
      includes: [PageActionEnum.FeePolicyList],
      defaultUrl: '/fee-policies/assign',
    },
    {
      key: 'ticket',
      includes: [
        PageActionEnum.TicketList,
        PageActionEnum.TicketUpdateInfor,
        PageActionEnum.TicketRegisterSalary,
      ],
      defaultUrl: '/ticket',
    },
    {
      key: 'ticket-salary-advance',
      includes: [
        PageActionEnum.TicketSalaryAdvance,
        PageActionEnum.TicketSalaryAdvanceForm,
      ],
      defaultUrl: '/ticket-salary-advance',
    },
  ];
  const ExtraButton = () => {
    switch (currentPageAction) {
      case PageActionEnum.CompanyDetail:
        return (
          <>
            <ProtectedWrapper
              allowedRoles={[
                UserRole.BEAM_ADMIN,
                UserRole.SUPER_ADMIN,
                UserRole.CUSTOMER_SERVICE,
              ]}
            >
              <Button
                theme="solid"
                onClick={() =>
                  router.push(`${originalRoute}/${GeneralSubPath.EDIT}`)
                }
                icon={<IconEdit />}
              >
                Chỉnh sửa thông tin
              </Button>
            </ProtectedWrapper>
            <ProtectedWrapper
              allowedRoles={[
                UserRole.BEAM_ADMIN,
                UserRole.SUPER_ADMIN,
                UserRole.SALE,
                UserRole.CUSTOMER_SERVICE,
                UserRole.RECONCILER,
                UserRole.ACCOUNTANT,
                UserRole.CONTROLLER,
              ]}
            >
              <Button
                theme="solid"
                type="secondary"
                onClick={() => router.push(`/change-log/Company/${companyId}`)}
                icon={<IconHistory />}
              >
                Xem lịch sử thay đổi
              </Button>
            </ProtectedWrapper>
          </>
        );
      case PageActionEnum.ProfileList:
        return (
          <>
            <ProtectedWrapper
              allowedRoles={[
                UserRole.BEAM_ADMIN,
                UserRole.SUPER_ADMIN,
                UserRole.CUSTOMER_SERVICE,
              ]}
            >
              <Button
                theme="solid"
                onClick={() =>
                  router.push(
                    `${originalProfileRoute}/${GeneralSubPath.CREATE}`
                  )
                }
                icon={<IconPlus />}
              >
                Thêm mới hồ sơ
              </Button>
            </ProtectedWrapper>
          </>
        );
      case PageActionEnum.ProfileDetail:
        return (
          <>
            {statusProfile !== 2 && (
              <ProtectedWrapper
                allowedRoles={[
                  UserRole.BEAM_ADMIN,
                  UserRole.SUPER_ADMIN,
                  UserRole.CUSTOMER_SERVICE,
                ]}
              >
                <Button
                  onClick={() =>
                    router.push(
                      `${originalProfileRoute}/${slug[1]}/${GeneralSubPath.EDIT}`
                    )
                  }
                  icon={<IconEdit />}
                  theme="solid"
                >
                  Chỉnh sửa hồ sơ
                </Button>
              </ProtectedWrapper>
            )}
            <Button onClick={() => router.push(originalProfileRoute)}>
              Quay lại
            </Button>
          </>
        );
      case PageActionEnum.AccountList:
        return (
          <div className="flex gap-4 items-center">
            <ProtectedWrapper
              allowedRoles={[
                UserRole.BEAM_ADMIN,
                UserRole.SUPER_ADMIN,
                UserRole.HR_ADMIN,
                UserRole.SALE,
                UserRole.CUSTOMER_SERVICE,
                UserRole.CONTROLLER,
              ]}
            >
              {currentProfile && (
                <ExportCompanyAccountListButton
                  companyData={companyData}
                  filterExport={filterExport}
                />
              )}
            </ProtectedWrapper>
            <ProtectedWrapper
              allowedRoles={[
                UserRole.BEAM_ADMIN,
                UserRole.SUPER_ADMIN,
                UserRole.HR_ADMIN,
                UserRole.CUSTOMER_SERVICE,
                UserRole.RECONCILER,
                UserRole.CONTROLLER,
              ]}
            >
              {currentProfile &&
                companyData?.employeeInformationChange == true &&
                companyData?.workDayType !== 'API_MIGRATION' && (
                  <Dropdown
                    // trigger={'click'}
                    position={'bottomLeft'}
                    render={
                      <Dropdown.Menu>
                        {companyData?.workDayType !== 'FIXED_WORKDAY' && (
                          <ProtectedWrapper
                            allowedRoles={[
                              UserRole.BEAM_ADMIN,
                              UserRole.SUPER_ADMIN,
                              UserRole.HR_ADMIN,
                              UserRole.CUSTOMER_SERVICE,
                            ]}
                          >
                            <Dropdown.Item>
                              {currentProfile && (
                                <div>
                                  <Button
                                    theme="solid"
                                    onClick={() =>
                                      router.push(
                                        originalAccountRoute + '/create'
                                      )
                                    }
                                    icon={<IconPlus />}
                                  >
                                    Thêm mới nhân viên
                                  </Button>
                                </div>
                              )}
                            </Dropdown.Item>
                          </ProtectedWrapper>
                        )}
                        <Dropdown.Item>
                          {currentProfile && (
                            <div>
                              <Button
                                theme="solid"
                                type="tertiary"
                                onClick={() =>
                                  router.push(originalAccountRoute + '/import')
                                }
                                icon={<IconPlus />}
                              >
                                Nhập từ tệp
                              </Button>
                            </div>
                          )}
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    }
                  >
                    <div data-testid={'add'}>
                      <Button
                        theme="solid"
                        type="secondary"
                        icon={<IconChevronDown />}
                        iconPosition="right"
                      >
                        Thêm mới
                      </Button>
                    </div>
                  </Dropdown>
                )}
              <ProtectedWrapper
                allowedRoles={[
                  UserRole.BEAM_ADMIN,
                  UserRole.SUPER_ADMIN,
                  UserRole.HR_ADMIN,
                  UserRole.CUSTOMER_SERVICE,
                ]}
              >
                {currentProfile &&
                  companyData?.workDayType === 'UPLOAD_WORKDAY' && (
                    <div>
                      <Button
                        theme="solid"
                        // type="tertiary"
                        onClick={() =>
                          router.push(originalAccountRoute + '/import-work-day')
                        }
                        icon={<IconUpload />}
                        className="bg-[#5dbea3]"
                      >
                        Tải lên ngày công
                      </Button>
                    </div>
                  )}
              </ProtectedWrapper>
              {currentProfile && (
                <ProtectedWrapper
                  allowedRoles={[
                    UserRole.BEAM_ADMIN,
                    UserRole.SUPER_ADMIN,
                    UserRole.HR_ADMIN,
                    UserRole.CUSTOMER_SERVICE,
                  ]}
                >
                  <Button
                    theme="solid"
                    type="tertiary"
                    onClick={() =>
                      router.push(originalAccountRoute + '/multipleSalary')
                    }
                  >
                    Chuyển trạng thái ứng lương theo danh sách
                  </Button>
                </ProtectedWrapper>
              )}
            </ProtectedWrapper>
          </div>
        );
      case PageActionEnum.AccountChangelog:
        return (
          <div className="flex gap-4 items-center">
            <Button
              // theme="solid"
              onClick={() => router.push(originalAccountRoute)}
            >
              Quay lại
            </Button>
          </div>
        );
      case PageActionEnum.HRAdminList:
        return (
          <div className="flex gap-4 items-center">
            <ProtectedWrapper
              allowedRoles={[UserRole.BEAM_ADMIN, UserRole.SUPER_ADMIN]}
            >
              <Button
                theme="solid"
                onClick={() => router.push(originalHRRoute + '/create')}
                icon={<IconPlus />}
              >
                Thêm mới HR Admin
              </Button>
            </ProtectedWrapper>
          </div>
        );
      case PageActionEnum.GroupList:
        return (
          <>
            {currentProfile && (
              <ProtectedWrapper
                allowedRoles={[
                  UserRole.BEAM_ADMIN,
                  UserRole.SUPER_ADMIN,
                  UserRole.HR_ADMIN,
                  UserRole.CUSTOMER_SERVICE,
                ]}
              >
                <Button
                  theme="solid"
                  onClick={() => router.push(originalGroupRoute + '/create')}
                  icon={<IconPlus />}
                >
                  Thêm nhóm mới
                </Button>
              </ProtectedWrapper>
            )}
          </>
        );
      case PageActionEnum.GroupDetail:
        return (
          <>
            <ProtectedWrapper
              allowedRoles={[
                UserRole.BEAM_ADMIN,
                UserRole.SUPER_ADMIN,
                UserRole.HR_ADMIN,
              ]}
            >
              <Button
                onClick={() =>
                  router.push(
                    `${originalGroupRoute}/${slug[1]}/${GeneralSubPath.EDIT}`
                  )
                }
                icon={<IconEdit />}
                theme="solid"
              >
                Chỉnh sửa nhóm
              </Button>
            </ProtectedWrapper>
            <Button onClick={() => router.push(originalGroupRoute)}>
              Quay lại
            </Button>
          </>
        );
      case PageActionEnum.AccountDetail:
        return (
          <div className="flex items-center gap-4">
            <Button
              onClick={() =>
                router.push(
                  `${originalAccountRoute}/${slug[1]}/${GeneralSubPath.EDIT}`
                )
              }
              icon={<IconEdit />}
            >
              Chỉnh sửa nhân viên
            </Button>
          </div>
        );

      case PageActionEnum.TicketList:
        return (
          <div className="flex gap-4 mr-3 items-center">
            <ProtectedWrapper
              allowedRoles={[
                UserRole.BEAM_ADMIN,
                UserRole.RECONCILER,
                UserRole.CONTROLLER,
                UserRole.CUSTOMER_SERVICE,
                UserRole.HR_ADMIN,
              ]}
            >
              <Dropdown
                // trigger={'click'}
                position={'bottomLeft'}
                render={
                  <Dropdown.Menu>
                    <ProtectedWrapper allowedRoles={[UserRole.HR_ADMIN]}>
                      <Dropdown.Item>
                        <AcceptTicketBatchButton
                          setIsSelectBatch={setIsSelectBatch}
                          setIsOpenUploadFile={setIsOpenUploadFile}
                        ></AcceptTicketBatchButton>
                      </Dropdown.Item>
                    </ProtectedWrapper>
                    <Dropdown.Item>
                      <ProtectedWrapper
                        allowedRoles={[
                          UserRole.BEAM_ADMIN,
                          UserRole.RECONCILER,
                          UserRole.CONTROLLER,
                          UserRole.CUSTOMER_SERVICE,
                          UserRole.HR_ADMIN,
                        ]}
                      >
                        <div className={'w-full'}>
                          <Button
                            className={'w-full flex items-start justify-start'}
                            theme="solid"
                            type="tertiary"
                            onClick={() => {
                              setIsOpenUploadFile(true);
                              setIsSelectBatch(false);
                            }}
                            icon={<IconExport />}
                          >
                            Nhập từ tệp
                          </Button>
                        </div>
                      </ProtectedWrapper>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                }
              >
                <div data-testid={'add'}>
                  <Button
                    theme="solid"
                    type="secondary"
                    icon={<IconChevronDown />}
                    iconPosition="right"
                  >
                    Xử lý yêu cầu
                  </Button>
                </div>
              </Dropdown>
            </ProtectedWrapper>
            <ProtectedWrapper
              allowedRoles={[
                UserRole.BEAM_ADMIN,
                UserRole.RECONCILER,
                UserRole.CONTROLLER,
                UserRole.CUSTOMER_SERVICE,
                UserRole.HR_ADMIN,
              ]}
            >
              <ExportTicketListButton
                filterExport={filterTicketExport}
                companyShortName={companyData?.shortName}
              />
            </ProtectedWrapper>
          </div>
        );
      case PageActionEnum.FeePolicyList:
        return (
          <ProtectedWrapper
            allowedRoles={[UserRole.BEAM_ADMIN, UserRole.SUPER_ADMIN]}
          >
            <div className="flex items-center gap-4">
              <Button
                theme="solid"
                onClick={() =>
                  router.push({
                    pathname: '/fee-policies/assign/create',
                    query: { companyId: companyId },
                  })
                }
              >
                Gán chính sách phí
              </Button>
            </div>
          </ProtectedWrapper>
        );

      default:
        return <></>;
    }
  };

  const getActiveTab = () => {
    const activeTab =
      tabActivation.find((x: any) =>
        x.includes.some((e: any) => e == currentPageAction)
      ) ?? tabActivation[0];
    return activeTab;
  };

  const currentActiveTab = getActiveTab();

  const getTabItem = (key: any) => {
    const tab =
      tabActivation.find((x: any) => x.key == key) ?? tabActivation[0];
    return tab;
  };

  const subSlugLevel1 = slug[1];

  const onClickViewGroupDetail = (rowData: any) => {
    router.push(`${originalGroupRoute}/${rowData.id}`);
  };

  const onCancelGroup = () => {
    if (currentPageAction == PageActionEnum.GroupCreate) {
      router.push(originalGroupRoute);
    } else if (currentPageAction == PageActionEnum.GroupEdit) {
      router.push(`${originalGroupRoute}/${slug[1]}`);
    } else {
      router.push(`${originalGroupRoute}`);
    }
  };

  const onClickViewAccountDetail = (rowData: any) => {
    router.push(`${originalAccountRoute}/${rowData.id}`);
  };

  const roleFilterTab = [
    {
      role: UserRole.ACCOUNTANT,
      tabs: (tab: any) =>
        tab.itemKey !== 'ticket' &&
        tab.itemKey !== 'ticket-salary-advance' &&
        tab.itemKey !== 'hr-admin',
    },
    {
      role: UserRole.RECONCILER,
      tabs: (tab: any) =>
        tab.itemKey !== 'ticket' &&
        tab.itemKey !== 'ticket-salary-advance' &&
        tab.itemKey !== 'hr-admin',
    },
    {
      role: UserRole.HR_ADMIN,
      tabs: (tab: any) => {
        // return isShowTicket?.canShowTicketSalaryAdvance == false &&
        // companyData?.manageSalaryAdvanceRequest == false
        //   ? tab.itemKey !== 'ticket-salary-advance' &&
        //       tab.itemKey !== 'hr-admin'
        //   : tab.itemKey !== 'hr-admin';
        return tab.itemKey !== 'hr-admin';
      },
    },
    // {
    //   role: UserRole.CONTROLLER,
    //   tabs: (tab: any) => {
    //     return tab.itemKey !== 'groups';
    //   },
    // },
  ];

  const tabList = [
    { tab: 'Thông tin chung', itemKey: 'general' },
    { tab: 'Hồ sơ', itemKey: 'profiles' },
    { tab: 'Nhóm', itemKey: 'groups' },
    { tab: 'Nhân viên', itemKey: 'employees' },
    { tab: 'HR Admin', itemKey: 'hr-admin' },
    { tab: 'Chính sách phí', itemKey: 'fees' },
    { tab: 'Quản lý yêu cầu', itemKey: 'ticket' },
    { tab: 'Yêu cầu ứng lương', itemKey: 'ticket-salary-advance' },
  ]
    .filter((tabs: any) => {
      if (roles == UserRole.HR_ADMIN) {
        if (
          isShowTicket?.canShowTicket == false &&
          isShowTicket?.canShowTicketSalaryAdvance == false
        ) {
          return (
            tabs?.itemKey !== 'ticket-salary-advance' &&
            tabs?.itemKey !== 'ticket'
          );
        } else if (isShowTicket?.canShowTicket == false) {
          return tabs?.itemKey !== 'ticket';
        } else if (isShowTicket?.canShowTicketSalaryAdvance == false) {
          return tabs?.itemKey !== 'ticket-salary-advance';
        }
      }
      return tabs;
    })
    .filter((tabs: any) => {
      const found = roleFilterTab.find((x: any) => x.role == roles);
      return found ? found.tabs(tabs) : true;
    });
  if (isLoading) return <Skeleton />;
  useEffect(() => {
    if (currentProfile?.status === 2) {
      Notification.warning({
        title: 'Cảnh báo!',
        content: (
          <>
            <div>
              <p>
                Không có hồ sơ đang hoạt động, vui lòng liên hệ BEAM để được hỗ
                trợ.
              </p>
            </div>
          </>
        ),
        duration: 3,
        theme: 'light',
      });
    }
  }, []);

  return (
    <div>
      <div className="px-6 pt-6">
        <div className="bg-white pt-6 pb-3 px-6 rounded-lg">
          <Tabs
            type="button"
            keepDOM={false}
            tabList={tabList}
            activeKey={currentActiveTab.key}
            onChange={(tabKey: any) => {
              const tabData = getTabItem(tabKey);
              router.push(originalRoute + tabData.defaultUrl);
            }}
            // tabBarExtraContent={<ExtraButton />}
          />
        </div>
      </div>

      <div>
        {currentPageAction == PageActionEnum.CompanyDetail && (
          <ContentWrapper
            pageTitle="Thông tin doanh nghiệp"
            extra={<ExtraButton />}
          >
            <CompanyDetail
              currentProfile={currentProfile}
              companyData={companyData}
              setCheckData={setCheckData}
              isLoadingCompanyData={isLoadingCompanyData}
            />
          </ContentWrapper>
        )}
        {currentPageAction == PageActionEnum.CompanyEdit && (
          <CreateCompanyForm
            onClickCancel={() => router.push(originalRoute)}
            companyId={companyId}
            isNew={currentPageAction !== PageActionEnum.CompanyEdit}
            reFetchCompanyData={reFetchCompanyData}
            setCheckData={setCheckData}
          />
        )}

        {(currentPageAction == PageActionEnum.ProfileCreate ||
          currentPageAction == PageActionEnum.ProfileEdit) && (
          <CreateCompanyProfileForm
            basePath={originalRoute}
            companyData={companyData}
            reFetchProfileData={reFetchProfileData}
            originalProfileRoute={originalProfileRoute}
            profileId={slug[1]}
            currentProfile={currentProfile}
            onCancel={() => router.push(originalProfileRoute)}
            isNew={currentPageAction == PageActionEnum.ProfileCreate}
            setCheckData={setCheckData}
          />
        )}
        {currentPageAction == PageActionEnum.ProfileList && (
          <ContentWrapper pageTitle="Danh sách hồ sơ" extra={<ExtraButton />}>
            <CompanyProfileList
              companyId={companyId}
              basePath={originalProfileRoute}
            />
          </ContentWrapper>
        )}
        {currentPageAction == PageActionEnum.ProfileDetail && (
          <ContentWrapper pageTitle="Thông tin hồ sơ" extra={<ExtraButton />}>
            <CompanyProfileDetail
              profileId={slug[1]}
              setCheckData={setCheckData}
              setStatusProfile={setStatusProfile}
              companyData={companyData}
            />
          </ContentWrapper>
        )}

        {currentProfile !== undefined && currentProfile?.status != 2 ? (
          <>
            <>
              {(currentPageAction == PageActionEnum.GroupCreate ||
                currentPageAction == PageActionEnum.GroupEdit) && (
                <CreateCompanyGroupForm
                  companyId={companyId}
                  groupId={slug[1]}
                  currentProfile={currentProfile}
                  isNew={currentPageAction == PageActionEnum.GroupCreate}
                  onCancel={onCancelGroup}
                  setCheckData={setCheckData}
                  companyData={companyData}
                />
              )}
              {currentPageAction == PageActionEnum.GroupList &&
                currentProfile !== undefined && (
                  <div>
                    {currentProfile === null ? (
                      <div className="bg-white border-none rounded-lg shadow-md  h-20 flex items-center m-6">
                        <p className="text-lg p-4">
                          Chưa có hồ sơ nào hoạt động. Vui lòng liên hệ BEAM để
                          được hỗ trợ.
                        </p>
                      </div>
                    ) : (
                      <ContentWrapper
                        pageTitle="Danh sách nhóm"
                        extra={<ExtraButton />}
                      >
                        <ListGroupsCompany
                          basePath={originalGroupRoute}
                          onClickViewDetail={onClickViewGroupDetail}
                        />
                      </ContentWrapper>
                    )}
                  </div>
                )}
              {currentPageAction == PageActionEnum.GroupDetail && (
                <GroupDetail
                  basePath={originalAccountRoute}
                  companyId={companyId}
                  onCancel={onCancelGroup}
                  groupId={slug[1]}
                  originalGroupRoute={originalGroupRoute}
                />
                // </ContentWrapper>
              )}
            </>
          </>
        ) : (
          ''
        )}

        {currentProfile !== undefined ? (
          <>
            {(currentPageAction == PageActionEnum.AccountCreate ||
              currentPageAction == PageActionEnum.AccountEdit) && (
              <CreateCompanyAccountForm
                accountId={slug[1]}
                // currentProfile={currentProfile}
                companyData={companyData}
                isNew={currentPageAction == PageActionEnum.AccountCreate}
                setCheckData={setCheckData}
              />
            )}
            {currentPageAction == PageActionEnum.AccountImport && (
              <ContentWrapper
                pageTitle="Tải lên danh sách người lao động"
                extra={<ExtraButton />}
              >
                <ImportCompanyAccountForm
                  companyId={companyId}
                  basePath={originalAccountImportRoute}
                  onCancel={() => router.push(originalAccountRoute)}
                  companyData={companyData}
                />
              </ContentWrapper>
            )}
            {currentPageAction == PageActionEnum.ImportWorkDay && (
              <ContentWrapper
                pageTitle="Tải lên danh sách ngày công thực tế"
                extra={<ExtraButton />}
              >
                <ImportWorkDayEmployeeForm
                  companyId={companyId}
                  basePath={originalWorkDayImportRoute}
                  onCancel={() => router.push(originalAccountRoute)}
                  companyData={companyData}
                />
              </ContentWrapper>
            )}
            {currentPageAction == PageActionEnum.AccountMultipleSalary && (
              <ContentWrapper
                pageTitle="Chuyển trạng thái ứng lương theo danh sách"
                extra={<ExtraButton />}
              >
                <MultipleSalaryAdvanceForm
                  basePath={originalAccountRoute}
                  companyId={companyId}
                  currentProfile={currentProfile}
                  onCancel={() => router.push(originalAccountRoute)}
                  companyData={companyData}
                />
              </ContentWrapper>
            )}
            {currentPageAction == PageActionEnum.AccountDetail && (
              <ContentWrapper
                pageTitle="Thông tin người lao động"
                extra={<ExtraButton />}
              >
                <AccountCompanyDetails
                  onCancel={() => router.push(originalAccountRoute)}
                />
              </ContentWrapper>
            )}

            {currentPageAction == PageActionEnum.AccountList &&
              currentProfile !== undefined && (
                <div>
                  {currentProfile === null ? (
                    <div className="bg-white border-none rounded-lg shadow-md  h-20 flex items-center m-6">
                      <p className="text-lg p-4">
                        Chưa có hồ sơ nào hoạt động. Vui lòng liên hệ BEAM để
                        được hỗ trợ.
                      </p>
                    </div>
                  ) : (
                    <ContentWrapper
                      pageTitle="Danh sách người lao động"
                      extra={<ExtraButton />}
                    >
                      <ListAccountsCompany
                        basePath={originalAccountRoute}
                        companyId={companyId}
                        currentProfile={currentProfile}
                        onClickViewDetail={onClickViewAccountDetail}
                        hiddenSelection={true}
                        setFilterExport={setFilterExport}
                        companyData={companyData}
                      />
                    </ContentWrapper>
                  )}
                </div>
              )}
          </>
        ) : (
          <>
            {(currentPageAction == PageActionEnum.AccountCreate ||
              currentPageAction == PageActionEnum.AccountEdit) && (
              <CreateCompanyAccountForm
                accountId={slug[1]}
                // currentProfile={currentProfile}
                companyData={companyData}
                isNew={currentPageAction == PageActionEnum.AccountCreate}
                setCheckData={setCheckData}
              />
            )}
            {currentPageAction == PageActionEnum.AccountImport && (
              <ContentWrapper
                pageTitle="Tải lên danh sách người lao động"
                extra={<ExtraButton />}
              >
                <ImportCompanyAccountForm
                  companyId={companyId}
                  basePath={originalAccountImportRoute}
                  onCancel={() => router.push(originalAccountRoute)}
                  companyData={companyData}
                />
              </ContentWrapper>
            )}
            {currentPageAction == PageActionEnum.ImportWorkDay && (
              <ContentWrapper
                pageTitle="Tải lên danh sách ngày công thực tế"
                extra={<ExtraButton />}
              >
                <ImportWorkDayEmployeeForm
                  companyId={companyId}
                  basePath={originalWorkDayImportRoute}
                  onCancel={() => router.push(originalAccountRoute)}
                  companyData={companyData}
                />
              </ContentWrapper>
            )}
            {currentPageAction == PageActionEnum.AccountMultipleSalary && (
              <ContentWrapper
                pageTitle="Chuyển trạng thái ứng lương theo danh sách"
                extra={<ExtraButton />}
              >
                <MultipleSalaryAdvanceForm
                  basePath={originalAccountRoute}
                  companyId={companyId}
                  currentProfile={currentProfile}
                  onCancel={() => router.push(originalAccountRoute)}
                  companyData={companyData}
                />
              </ContentWrapper>
            )}
            {currentPageAction == PageActionEnum.AccountDetail && (
              <ContentWrapper
                pageTitle="Thông tin người lao động"
                extra={<ExtraButton />}
              >
                <AccountCompanyDetails
                  onCancel={() => router.push(originalAccountRoute)}
                />
              </ContentWrapper>
            )}

            {currentPageAction == PageActionEnum.AccountList && (
              <div>
                <ContentWrapper
                  pageTitle="Danh sách người lao động"
                  extra={<ExtraButton />}
                >
                  <ListAccountsCompany
                    basePath={originalAccountRoute}
                    companyId={companyId}
                    currentProfile={currentProfile}
                    onClickViewDetail={onClickViewAccountDetail}
                    hiddenSelection={true}
                  />
                </ContentWrapper>
              </div>
            )}
          </>
        )}
        {currentPageAction == PageActionEnum.HRAdminList && (
          <ContentWrapper pageTitle="Danh sách HR" extra={<ExtraButton />}>
            <ListHRCompany companyId={companyId} basePath={originalHRRoute} />
          </ContentWrapper>
        )}
        {currentPageAction == PageActionEnum.HRAdminCreate && (
          <CreateCompanyHRForm
            companyId={companyId}
            isNew={currentPageAction == PageActionEnum.HRAdminCreate}
            onCancel={() => router.push(originalHRRoute)}
            setCheckData={setCheckData}
          />
        )}
        {currentPageAction == PageActionEnum.HRAdminEdit && (
          <EditCompanyHRForm
            companyId={companyId}
            onCancel={() => router.push(originalHRRoute)}
            setCheckData={setCheckData}
          />
        )}
        {currentPageAction == PageActionEnum.FeePolicyList && (
          <ContentWrapper
            pageTitle="Danh sách các chính sách phí"
            extra={<ExtraButton />}
          >
            <CompanyFeePolicyList
              companyId={companyId}
              basePath={originalProfileRoute}
            />
          </ContentWrapper>
        )}
        {currentPageAction == PageActionEnum.TicketUpdateInfor && (
          <TicketUpdateInformationForm
            ticketId={slug[1]}
            onCancel={() => router.push(originalTicketRoute)}
            setCheckData={setCheckData}
          />
        )}
        {currentPageAction == PageActionEnum.TicketRegisterSalary && (
          <TicketRegisterSalaryForm
            ticketId={slug[1]}
            onCancel={() => router.push(originalTicketRoute)}
            setCheckData={setCheckData}
          />
        )}
        {currentPageAction == PageActionEnum.TicketList && (
          <ContentWrapper pageTitle="Danh sách yêu cầu" extra={<ExtraButton />}>
            <ListTicketCompany
              isShowTicket={isShowTicket}
              companyId={companyId}
              basePath={originalTicketRoute}
              setFilterExport={setFilterTicketExport}
              isOpenUploadFile={isOpenUploadFile}
              setIsOpenUploadFile={setIsOpenUploadFile}
              isSelectBatch={isSelectBatch}
              setIsSelectBatch={setIsSelectBatch}
            />
          </ContentWrapper>
        )}
        {currentPageAction == PageActionEnum.TicketSalaryAdvanceForm && (
          <TicketSalaryAdvanceForm
            ticketId={slug[1]}
            onCancel={() => router.push(originalTicketSalaryAdvanceRoute)}
            companyData={companyData}
          />
        )}
        {currentPageAction == PageActionEnum.TicketSalaryAdvance && (
          <ContentWrapper
            pageTitle="Danh sách yêu cầu ứng lương"
            // extra={<ExtraButton />}
          >
            <ListTicketSalaryAdvance
              isShowTicket={isShowTicket}
              companyId={companyId}
              basePath={originalTicketSalaryAdvanceRoute}
            />
          </ContentWrapper>
        )}
      </div>
    </div>
  );
};
