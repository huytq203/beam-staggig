import { RequiredAsterisk } from '@components/shared';
import { InputWrapper } from '@components/shared/InputWrapper';
import {
  FormWrapper,
  MainContentWrapper,
  NotificationSubTypeSelect,
  NotificationTypeSelect,
} from '@components/widgets';
import { UserRole } from '@constants/auth.constants';
import { Notification, Select, TextArea } from '@douyinfe/semi-ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { useIsMount } from '@hooks/useIsMount';
import { NotificationManagementService } from '@services/notification-management';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { useAuth } from '@contexts/authentication';
import { CreateNotification } from 'validations/notification';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { SpinWrapper } from '@components/widgets/ContentWrapper/SpinWrapper';
import { FunctionBase } from '@helpers/fuction-base.helpers';
export interface INotification {
  id?: string;
  type?: string;
  subType?: string;
  title?: string;
  content?: string;
  timeType?: any;
  sendTime?: null;
  resendType?: any;
  receiver?: any;
  status?: any;
  params?: any;
}

const initValues = {
  type: '',
  subType: '',
  title: '',
  content: '',
  timeType: 0,
  sendTime: null,
  resendType: 0,
  receiver: 0,
  status: 0,
};

export const CreateNotificationForm = (props: any) => {
  const { isNew, onClickCancel, notificationId } = props;
  const router = useRouter();
  const isFirstMount = useIsMount();
  const { authCheckByRole, profile } = useAuth();
  authCheckByRole([UserRole.BEAM_ADMIN, UserRole.SUPER_ADMIN]);
  const { data, isFetching, isLoading, error, isError } = useQuery(
    ['notification_detail', notificationId],
    () => NotificationManagementService.getDetailNotification(notificationId),
    {
      enabled: !isNew,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    }
  );
  const [notiData, setNotiData] = useState<INotification>({});
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    watch,
    reset,
    getValues,
    setValue,
    setFocus,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(CreateNotification),
    defaultValues: initValues,
  });

  const onSubmitValues = (values: any) => {
    const payload = {
      ...values,
      sendTime: DateTimeHelper.fomartDateRangeSubmit(values.sendTime),
      resendType: 0,
      receiver: 0,
    };
    setLoading(true);
    NotificationManagementService.addOrUpdateNotification(payload)
      .then((response: any) => {
        if (response) {
          Notification.success({
            title: 'Thành công',
            content: `${isNew ? 'Thêm mới' : 'Cập nhật'} thông báo thành công!`,
            duration: 3,
            theme: 'light',
          });
          router.push(`/notifications/templates`);
        } else {
          {
            Notification.error({
              title: 'Thất bại',
              content: `${isNew ? 'Thêm mới' : 'Cập nhật'} thông báo thất bại!`,
              duration: 3,
              theme: 'light',
            });
          }
          setLoading(false);
        }
      })
      .catch((e: any) => {});
  };

  useEffect(() => {
    if (watch('subType') && watch('type')) {
      NotificationManagementService.getNotificationByType({
        type: watch('type'),
        subType: watch('subType'),
      }).then((x: any) => setNotiData(x));
    }
  }, [watch('subType'), watch('type')]);

  useEffect(() => {
    if (isNew) {
      const updatedData = notiData ?? {
        ...initValues,
        subType: watch('subType'),
        type: watch('type'),
      };
      reset(updatedData);
    }
  }, [isNew, notiData]);

  useEffect(() => {
    if (!isLoading && !isNew) {
      let resetData = data;
      resetData = {
        ...resetData,
      };
      reset(resetData);
    }
  }, [isLoading, isFetching]);
  if (isLoading) return <></>;
  return (
    <MainContentWrapper isNew={isNew} data={data} isLoading={isLoading}>
      <SpinWrapper spinning={loading}>
        <FormWrapper
          pageTitle={isNew ? 'Tạo mới thông báo' : 'Cập nhật thông báo'}
          onCancel={onClickCancel}
          onSubmit={handleSubmit(onSubmitValues, (errors) =>
            FunctionBase.scrollToErrorField(errors as any, setFocus)
          )}
          loading={loading}
        >
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4 mb-4">
              <div className="grid grid-cols-2 gap-12">
                <InputWrapper
                  required
                  field="type"
                  label="Nhóm thông báo"
                  control={control}
                  errors={errors}
                  component={(props: any) => (
                    <NotificationTypeSelect
                      size="large"
                      {...props}
                      disabled={!isNew}
                      onChange={(e: any) => {
                        props.onChange(e);
                        setValue('subType', '');
                      }}
                    />
                  )}
                />
                <InputWrapper
                  required
                  field="subType"
                  label="Loại thông báo"
                  control={control}
                  errors={errors}
                  component={(e: any) => (
                    <NotificationSubTypeSelect
                      type={watch('type')}
                      disabled={!isNew}
                      size="large"
                      {...e}
                    />
                  )}
                />
              </div>
              {watch('type') && watch('subType') && (
                <div>
                  <p>
                    Nội dung <RequiredAsterisk />
                  </p>
                  <div className="grid grid-cols-1 gap-12">
                    <InputWrapper
                      required
                      field="title"
                      label="Tiêu đề"
                      control={control}
                      errors={errors}
                      component={(props: any) => (
                        <TextArea
                          maxLength={100}
                          maxCount={100}
                          rows={1}
                          showCounter
                          showClear
                          {...props}
                        />
                      )}
                    />
                    <InputWrapper
                      required
                      field="content"
                      label="Chi tiết"
                      control={control}
                      errors={errors}
                      component={(props: any) => (
                        <TextArea
                          maxLength={500}
                          maxCount={500}
                          rows={4}
                          showCounter
                          showClear
                          {...props}
                        />
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 mt-3">
                    {notiData?.params?.length > 0 && (
                      <div>
                        <p>Tham số:</p>
                        <p>
                          Đây là các tham số có thể đặt vào trong tiêu đề và nội
                          dung thông báo:
                        </p>
                        {notiData?.params?.length > 0
                          ? notiData?.params?.map((x: any) => {
                              return <p>{`${x.key} : ${x.value}`}</p>;
                            })
                          : ''}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 my-3">
                    {/* <div>
                    <InputWrapper
                      required
                      field="timeType"
                      label="Thời gian gửi"
                      component={(props: any) => (
                        <RadioGroup
                          name="timeType-group"
                          value={props.value}
                          {...props}
                          className="flex flex-col"
                        >
                          <Radio value={0}>Gửi ngay</Radio>
                          <Radio
                            disabled={watch('type') != 'CUSTOMER_CARE'}
                            value={1}
                          >
                            Tuỳ chỉnh thời gian
                          </Radio>
                        </RadioGroup>
                      )}
                      errors={errors}
                      control={control}
                    />
                    <InputWrapper
                      field="sendTime"
                      control={control}
                      errors={errors}
                      component={(props: any) => (
                        <DatePicker
                          showClear={false}
                          disabled={watch('type') != 'CUSTOMER_CARE'}
                          type="dateTime"
                          format="dd/MM/yyyy HH:mm:ss"
                          className="mt-3"
                          {...props}
                          disabledDate={(current: any) => {
                            return moment().add(-1, 'days') >= current;
                          }}
                        />
                      )}
                    />
                  </div> */}
                    <InputWrapper
                      required
                      field="resendType"
                      label="Gửi lại"
                      control={control}
                      errors={errors}
                      component={(props: any) => (
                        <Select
                          optionList={[
                            {
                              value: 0,
                              label: 'Không gửi lại',
                            },
                            {
                              value: 1,
                              label: 'Gửi các ngày làm việc',
                            },
                            {
                              value: 2,
                              label: 'Gửi hàng ngày',
                            },
                            {
                              value: 3,
                              label: 'Gửi hàng tuần',
                            },
                            {
                              value: 4,
                              label: 'Gửi hàng tháng',
                            },
                          ]}
                          disabled={watch('type') == 'TRANSACTION'}
                          {...props}
                        />
                      )}
                    />
                    <InputWrapper
                      required
                      field="status"
                      label="Trạng thái"
                      control={control}
                      errors={errors}
                      component={(props: any) => (
                        <Select
                          optionList={[
                            {
                              value: 0,
                              label: 'Hoạt động',
                            },
                            {
                              value: 1,
                              label: 'Không hoạt động',
                            },
                          ]}
                          {...props}
                        />
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* <InputWrapper
                    required
                    field="receiver"
                    label="Người nhận"
                    control={control}
                    errors={errors}
                    component={(props: any) => (
                      <Select
                        optionList={[
                          {
                            value: 0,
                            label: 'Tất cả',
                          },
                          {
                            value: 1,
                            label: 'Đã xác định',
                          },
                          {
                            value: 2,
                            label: 'Beam Admin',
                          },
                          {
                            value: 3,
                            label: 'HR Admin',
                          },
                          {
                            value: 4,
                            label: 'Kế toán',
                          },
                          {
                            value: 5,
                            label: 'Đối soát viên',
                          },
                          {
                            value: 6,
                            label: 'Kiểm soát viên',
                          },
                          {
                            value: 7,
                            label: 'End user',
                          },
                        ]}
                        disabled
                        {...props}
                      />
                    )}
                  /> */}
                    {/* <InputWrapper
                    required
                    field="status"
                    label="Trạng thái"
                    control={control}
                    errors={errors}
                    component={(props: any) => (
                      <Select
                        optionList={[
                          {
                            value: 0,
                            label: 'Hoạt động',
                          },
                          {
                            value: 1,
                            label: 'Không hoạt động',
                          },
                        ]}
                        {...props}
                      />
                    )}
                  /> */}
                  </div>
                </div>
              )}
            </div>
          </div>
        </FormWrapper>
      </SpinWrapper>
    </MainContentWrapper>
  );
};
