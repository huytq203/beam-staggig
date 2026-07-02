import { ActionButton, AppPagination, InputWrapper } from '@components/shared';
import TextOverflow from '@components/shared/TextOverflow/TextOverflow';
import { ContentWrapper, FormActionButton } from '@components/widgets';
import { ProtectedWrapper } from '@components/widgets/Auth';
import { UserRole } from '@constants/auth.constants';
import { IconEdit } from '@douyinfe/semi-icons';
import {
  Card,
  Image,
  Modal,
  Notification,
  Tag,
  TextArea,
  Typography,
} from '@douyinfe/semi-ui';
import { CompanyService } from '@services/companies';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { CompanyListFilter } from './CompanyListFilter';
import { CompanyLockableButton } from './CompanyLockableButton';
import { yupResolver } from '@hookform/resolvers/yup';
import { BlockSalaryCompany } from 'validations/companies';
import moment from 'moment-timezone';
import { useWidget } from '@contexts/widgets';
import NoResults from '../../../public/img/noResults.svg';
import { TIMEZONE_FORMAT } from '@constants/common-format';
import { CustomMonthRangePicker } from '@components/shared/CustomMonthRangePicker';
export const CompanyGridList = (props: any) => {
  const [visible, setVisible] = useState(false);
  const [id, setId] = useState('');
  const { Text } = Typography;
  const { checkLoadingComponent } = useWidget();
  const {
    rowSelection,
    showFilter = true,
    showActionButton = true,
    pageSize = 10,
    showSelection = false,
    showDelete = false,
    showEdit = false,
    feePolicyId,
  } = props;

  const router = useRouter();
  const {
    page: pageRouter,
    name: nameRouter,
    employeeKeyWord: employeeKeyWordRouter,
  } = router.query;
  const [filter, setFilter] = useState({
    name: String(nameRouter || ''),
    employeeKeyWord: String(employeeKeyWordRouter || ''),
    page: pageRouter ?? 1,
    size: pageSize,
    sort: ['createdAt', 'desc'],
  });
  const { data, isLoading, isFetching, refetch } = useQuery(
    ['companies', filter],
    () =>
      CompanyService.getAll({
        ...filter,
        feePolicyId: feePolicyId,
      }),
    {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
    }
  );

  useEffect(() => {
    checkLoadingComponent(isLoading);
  }, [isLoading]);
  const {
    control,
    getValues,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(BlockSalaryCompany),
    defaultValues: {
      reason: '',
      blockDateTimeRange: [
        new Date(),
        moment(new Date()).add(1, 'days').toDate(),
      ],
    },
  });
  useEffect(() => {
    setFilter({
      ...filter,
      page: pageRouter ?? 1,
    });
  }, [pageRouter]);
  const onSubmit = (values: any) => {
    const payload = {
      id: id,
      blockStart: values.blockDateTimeRange[0]
        ? moment(values.blockDateTimeRange[0])
            .set('second', 0)
            .tz(TIMEZONE_FORMAT.GMT0)
            .format()
        : '',
      blockEnd: values.blockDateTimeRange[1]
        ? moment(values.blockDateTimeRange[1])
            .set('second', 0)
            .tz(TIMEZONE_FORMAT.GMT0)
            .format()
        : null,

      reason: values.reason,
    };
    CompanyService.blockCompany(payload)
      .then((response: any) => {
        if (response.code == 200) {
          Notification.success({
            title: 'Thành công',
            content: 'Tạm khoá khóa ứng lương của doanh nghiệp thành công',
            duration: 3,
            theme: 'light',
          });
          setVisible(false);
          refetch();
        } else {
          Notification.error({
            title: 'Thất bại',
            content: 'Tạm khóa ứng lương của doanh nghiệp thất bại',
            duration: 3,
            theme: 'light',
          });
        }
      })
      .catch((e: any) => {});
  };
  const onLockCompany = (id: any) => {
    setVisible(true);
    setId(id);
  };
  const onUnblockCompany = (id: any) => {
    CompanyService.unBlockCompany({ id: id })
      .then((response: any) => {
        if (response.code == 200) {
          Notification.success({
            title: 'Thành công',
            content: 'Mở khóa ứng lương của doanh nghiệp thành công',
            duration: 5,
            theme: 'light',
          });
          refetch();
        } else {
          Notification.error({
            title: 'Thất bại',
            content: 'Mở khóa ứng lương của doanh nghiệp không thành công',
            duration: 5,
            theme: 'light',
          });
          reset();
        }
      })
      .catch((e: any) => {});
  };
  const getTableData = () => {
    if (!data?.content) {
      return [];
    }
    return data?.content.map((x: any) => {
      return {
        ...x,
        key: x.id,
      };
    });
  };
  const basePath = `/companies`;
  return (
    <>
      <ContentWrapper
        pageTitle="Danh sách doanh nghiệp"
        primaryButtonText="Thêm mới"
        onClickPrimaryButton={() => router.push('/companies/new')}
        allowedRoles={[
          UserRole.BEAM_ADMIN,
          UserRole.SUPER_ADMIN,
          UserRole.CUSTOMER_SERVICE,
        ]}
      >
        <div className="flex flex-col gap-5">
          {showFilter && (
            <CompanyListFilter
              onFilter={setFilter}
              listCompany={data}
              refetch={refetch}
            />
          )}

          {isFetching || isLoading ? (
            <div></div>
          ) : data?.totalElements > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {getTableData().map((company: any) => (
                <Card
                  key={company.id}
                  loading={isFetching}
                  footerStyle={{ background: '#E9EEF0' }}
                  footer={
                    <div className="flex flex-col gap-2 justify-center items-center">
                      <div className="flex gap-1 items-center font-bold text-sm text-center h-16 overflow-hidden">
                        <TextOverflow line={2}>
                          <span
                            className="cursor-pointer beam-break-world"
                            onClick={() =>
                              router.push(`${basePath}/${company?.id}`)
                            }
                          >
                            {company.name}
                          </span>
                        </TextOverflow>
                      </div>
                      <span>
                        {company.enabled ? (
                          <Tag color="green">Hoạt động</Tag>
                        ) : (
                          <Tag color="red">Không hoạt động</Tag>
                        )}
                      </span>
                    </div>
                  }
                >
                  <div className="relative">
                    <div
                      className="flex justify-center cursor-pointer"
                      onClick={() => router.push(`${basePath}/${company?.id}`)}
                    >
                      <Image
                        width={150}
                        height={100}
                        preview={false}
                        src={company.logoUrl}
                      />
                    </div>

                    <div className="flex flex-col absolute top-0 gap-1.5 right-0">
                      <ProtectedWrapper
                        allowedRoles={[
                          UserRole.BEAM_ADMIN,
                          UserRole.SUPER_ADMIN,
                          UserRole.CUSTOMER_SERVICE,
                        ]}
                      >
                        <CompanyLockableButton
                          companyData={company}
                          onLock={onLockCompany}
                          onUnlock={onUnblockCompany}
                        />

                        <ActionButton
                          onClick={() =>
                            router.push(`/companies/${company.id}/edit`)
                          }
                        >
                          <IconEdit size="small" />
                        </ActionButton>
                      </ProtectedWrapper>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex items-center flex-col justify-center">
              <img
                src={NoResults.src}
                alt="logo"
                className="w-[300px]"
                id="logo"
              />
              <h3 className="ml-[-20px]">Không có dữ liệu</h3>
            </div>
          )}

          {data?.totalElements > 10 && (
            <AppPagination
              {...data}
              onChange={(e: any) => {
                router.push({
                  pathname: router.pathname,
                  // Thêm search query vào URL
                  query: {
                    ...router.query,
                    page: e,
                  },
                });
                setFilter({
                  ...filter,
                  page: e,
                });
              }}
            />
          )}
        </div>
      </ContentWrapper>
      <Modal
        title="Tạm khoá dịch vụ ứng lương"
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        footer={[]}
        closeOnEsc={true}
        afterClose={() => {
          setValue('reason', '');
          setValue('blockDateTimeRange', [
            new Date(),
            moment(new Date()).add(1, 'days').toDate(),
          ]);
        }}
      >
        <div>Chọn thời gian tạm khoá dịch vụ ứng lương cho doanh nghiệp</div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 my-4">
            <InputWrapper
              required
              field="blockDateTimeRange"
              label="Thời gian bắt đầu / Thời gian kết thúc"
              component={(props: any) => (
                // <DatePicker
                //   showClear={false}
                //   type="dateTimeRange"
                //   format="dd/MM/yyyy HH:mm"
                //   disabledDate={(current: any) => {
                //     return moment().add(-1, 'days') >= current;
                //   }}
                //   {...props}
                // />
                <CustomMonthRangePicker
                  className="w-full"
                  type="dateTime"
                  placeholder="Ngày"
                  format="dd/MM/yyyy HH:mm"
                  {...props}
                />
              )}
              errors={errors}
              control={control}
            />
            <InputWrapper
              required
              field="reason"
              label="Lí do tạm khoá"
              component={(props: any) => (
                <TextArea
                  maxLength={200}
                  maxCount={200}
                  showCounter
                  showClear
                  {...props}
                />
              )}
              errors={errors}
              control={control}
            />
          </div>
          <FormActionButton
            // onSubmit={() => {
            //   return onSubmit(getValues());
            // }}
            onCancel={() => setVisible(false)}
          />
        </form>
      </Modal>
    </>
  );
};
