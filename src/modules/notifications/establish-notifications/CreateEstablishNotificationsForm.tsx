import { InputWrapper } from '@components/shared/InputWrapper';
import {
  CompanySelect,
  FormWrapper,
  MainContentWrapper,
} from '@components/widgets';
import {
  listReceiver,
  listResendType,
  notificationEstablishType,
  simpleStatusOptions,
} from '@constants/select-options.constants';
import { IconBolt, IconUpload } from '@douyinfe/semi-icons';
import {
  Button,
  DatePicker,
  Input,
  Notification,
  Select,
  Switch,
  TextArea,
  Toast,
  Upload,
} from '@douyinfe/semi-ui';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { yupResolver } from '@hookform/resolvers/yup';
import moment from 'moment-timezone';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useQuery } from 'react-query';
import { useAuth } from '@contexts/authentication';
import { UserRole } from '@constants/auth.constants';
import { NotificationManagementService } from '@services/notification-management';
import { COMMON_FORMAT, TIMEZONE_FORMAT } from '@constants/common-format';
import { CreateScheduleNotification } from 'validations/notification';
import { CampaignCodeSelect } from '@components/widgets/Select/CampaignCodeSelect';
import { SpinWrapper } from '@components/widgets/ContentWrapper/SpinWrapper';
import { FunctionBase } from '@helpers/fuction-base.helpers';
import { EmpolyeeFromCompanies } from '@components/widgets/Select/EmpolyeeFromCompanies';
import { NEXT_PUBLIC_API_CORE } from '@constants/endpoints';
import { axiosInstance } from '@services/api';
import { ArrayHelper } from '@helpers/array.helper';
import { isProduction } from '@helpers/common.helper';

export const CreateEstablishNotificationsForm = (props: any) => {
  const { notificationId, isNew, onClickCancel } = props;
  const [loading, setLoading] = useState(false);
  const [expiredCampaign, setExpiredCampaign] = useState(false);
  const [checkAllCompany, setCheckAllCompany] = useState(false);
  const router = useRouter();
  const { data, isFetching, isLoading, error, isError } = useQuery(
    ['notification_detail', notificationId],
    () =>
      NotificationManagementService.getDetailScheduleNotification(
        notificationId
      ),
    {
      enabled: !isNew,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    }
  );
  const { authCheckByRole } = useAuth();
  authCheckByRole([UserRole.BEAM_ADMIN, UserRole.SUPER_ADMIN, UserRole.SALE]);
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
    resolver: yupResolver(CreateScheduleNotification),
    defaultValues: {
      title: '',
      receiver: 'user',
      type: '',
      sendTime: DateTimeHelper.setStartTime(
        DateTimeHelper.getCurrentDate(),
        TIMEZONE_FORMAT.GMT7
      )
        .tz(TIMEZONE_FORMAT.GMT0)
        .format(),
      companyId: [],
      resendType: 0,
      status: 0,
      content: '',
      isAllCompany: false,
      reason: '',
      image: '',
      attachUrl:
        'https://beam-common.s3.ap-southeast-1.amazonaws.com/logo_mail.svg',
      originalNameImage: '',
      imageId: '',
      idTypeNotification: '',
      campaignCode: '',
      isAllEmployee: true,
      customEmployee: [],
    },
  });

  const attachUrlValue = watch('attachUrl');
  const [displayImageUrl, setDisplayImageUrl] = useState(
    getValues('attachUrl')
  );
  useEffect(() => {
    if (watch('isAllCompany') === true) {
      setValue('companyId', []);
    }
  }, [watch('isAllCompany')]);

  useEffect(() => {
    if (watch('receiver') !== 'user' && watch('receiver') !== 'hr_admin') {
      if (watch('type') === 'CUS_PROMOTION') {
        setValue('type', 'CUS_TICKET');
      }
    }
  }, [watch('receiver')]);

  const companyId = useWatch({ control, name: 'companyId' }); // array
  const isAllEmployee = useWatch({ control, name: 'isAllEmployee' });
  const isAllCompany = useWatch({ control, name: 'isAllCompany' });

  const prevCompanyKeyRef = useRef<string>('');

  const companyKey = Array.isArray(companyId) ? companyId.join('|') : '';

  useEffect(() => {
    const companyChanged = prevCompanyKeyRef.current !== companyKey;
    if (
      companyChanged ||
      isAllEmployee === true ||
      (isAllCompany === false && watch('companyId').length < 1)
    ) {
      setValue('customEmployee', []);
    }
    if (
      !isNew &&
      ArrayHelper.compareArray(companyId, data?.companyId) &&
      isAllEmployee === false
    ) {
      setValue('customEmployee', data?.customEmployee);
    }

    prevCompanyKeyRef.current = companyKey;
  }, [companyKey, isAllEmployee, isNew, setValue]);

  const idTypeNotification = useWatch({ control, name: 'idTypeNotification' });

  useEffect(() => {
    setValue('isAllCompany', checkAllCompany);
    setValue('companyId', []);
  }, [idTypeNotification, checkAllCompany]);
  useEffect(() => {
    if (!attachUrlValue) {
      setDisplayImageUrl(
        'https://beam-common.s3.ap-southeast-1.amazonaws.com/logo_mail.svg'
      );
      return;
    }

    const isImageUrl = /\.(jpeg|jpg|gif|png|svg|webp)$/i.test(attachUrlValue);

    if (isImageUrl) {
      setDisplayImageUrl(attachUrlValue);
    } else {
      fetch(
        `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(
          attachUrlValue
        )}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.text();
        })
        .then((html) => {
          const match = html.match(
            /<meta\s+(?:property|name)="og:image"[^>]*content="([^"]+)"/
          );
          console.log(html);
          if (match && match[1]) {
            setDisplayImageUrl(match[1]);
          } else {
            setDisplayImageUrl(attachUrlValue);
          }
        })
        .catch((error) => {
          setDisplayImageUrl(attachUrlValue);
        });
    }
  }, [attachUrlValue]);
  const onSubmitValues = (values: any) => {
    const payload = {
      ...values,
      sendTime: DateTimeHelper.fomartDateRangeSubmit(values.sendTime),
      title: values.title.trim(),
      content: values.content.trim(),
      receiver: [values.receiver],
      attachUrl: FunctionBase.checkTypeofVal(values.attachUrl, 'string')
        ? values.attachUrl.trim()
        : '',
      //hard code
      isAllCompany:
        values.receiver !== 'user' && values.receiver !== 'hr_admin'
          ? true
          : values.isAllCompany,
    };
    if (values.type == 'CUS_PROMOTION') {
      setLoading(true);
      NotificationManagementService.addOrUpdateScheduleNotification(payload)
        .then((response: any) => {
          if (response) {
            Notification.success({
              title: 'Thành công',
              content: `${
                isNew ? 'Thêm mới' : 'Cập nhật'
              } thông báo thành công!`,
              duration: 3,
              theme: 'light',
            });
            router.push(`/notifications/establish`);
          }
        })
        .catch((e: any) => {});
      setLoading(false);
    } else {
      setLoading(true);
      NotificationManagementService.addOrUpdateScheduleNotification(payload)
        .then((response: any) => {
          if (response) {
            Notification.success({
              title: 'Thành công',
              content: `${
                isNew ? 'Thêm mới' : 'Cập nhật'
              } thông báo thành công!`,
              duration: 3,
              theme: 'light',
            });
            router.push(`/notifications/establish`);
          } else {
            Notification.error({
              title: 'Thất bại',
              content: `${isNew ? 'Thêm mới' : 'Cập nhật'} thông báo thất bại!`,
              duration: 3,
              theme: 'light',
            });
            setLoading(false);
          }
        })
        .catch((e: any) => {});
    }
  };

  useEffect(() => {
    if (!isLoading && !isNew) {
      let resetData;
      if (!expiredCampaign) {
        resetData = {
          ...data,
          idTypeNotification: data?.idTypeNotification,
          sendTime: DateTimeHelper.convertTimeZone(
            data?.sendTime,
            COMMON_FORMAT.EMPTY_FORMAT
          ),
          receiver: data?.receiver[0],
          customEmployee: data?.customEmployee,
        };
      } else {
        resetData = {
          ...data,
          idTypeNotification: data?.idTypeNotification,
          sendTime: DateTimeHelper.convertTimeZone(
            data?.sendTime,
            COMMON_FORMAT.EMPTY_FORMAT
          ),
          receiver: data?.receiver[0],
          customEmployee: data?.customEmployee,
        };
      }

      reset(resetData);
    }
  }, [isLoading, isFetching, expiredCampaign]);

  if (isLoading) return <></>;

  const checkDisabled = () => {
    const receiver: string = watch('receiver');
    if (
      !isNew &&
      moment(new Date()).isAfter(watch('sendTime')) &&
      data?.resendType == 0
    ) {
      return true;
    }

    const checkReceiver =
      receiver?.includes('hr_admin') || receiver?.includes('user');
    return !checkReceiver;
  };

  const checkDisabledTime = () => {
    if (
      !isNew &&
      moment(new Date()).isAfter(watch('sendTime')) &&
      data?.resendType == 0
    ) {
      return true;
    }
    if (watch('campaignCode') && watch('idTypeNotification').length > 0) {
      if (watch('type') === 'CUS_PROMOTION' && !isNew && !expiredCampaign) {
        return true;
      }
    }
  };
  const notificationTypeOptions = () => {
    if (watch('receiver') !== 'user' && watch('receiver') !== 'hr_admin') {
      return notificationEstablishType.filter(
        (item) => item.value !== 'CUS_PROMOTION'
      );
    }
    return notificationEstablishType;
  };
  return (
    <MainContentWrapper isNew={isNew} isLoading={isLoading} data={data}>
      <SpinWrapper spinning={loading}>
        <FormWrapper
          pageTitle={isNew ? 'Tạo mới thông báo' : 'Cập nhật thông báo'}
          onCancel={onClickCancel}
          onSubmit={handleSubmit(onSubmitValues, (errors) =>
            FunctionBase.scrollToErrorField(errors as any, setFocus)
          )}
          showSubmitButton={!checkDisabledTime()}
          loading={loading}
          // cancelText={watch('status') == 3 ? 'Quay lại' : 'Huỷ'}
        >
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4 mb-4">
              <div className="grid grid-cols-2 gap-12">
                <InputWrapper
                  required
                  field="title"
                  label="Tiêu đề thông báo"
                  component={(props: any) => (
                    <Input
                      disabled={checkDisabledTime()}
                      maxLength={100}
                      showClear
                      {...props}
                    />
                  )}
                  errors={errors}
                  control={control}
                />

                <InputWrapper
                  required
                  field="receiver"
                  label="Người nhận thông báo"
                  component={(props: any) => (
                    <Select
                      disabled={checkDisabledTime()}
                      optionList={listReceiver}
                      {...props}
                    />
                  )}
                  errors={errors}
                  control={control}
                />
              </div>

              <div className="grid grid-cols-2 gap-12">
                <InputWrapper
                  required
                  field="type"
                  label="Loại thông báo"
                  component={(props: any) => (
                    <Select
                      disabled={checkDisabledTime()}
                      optionList={notificationTypeOptions()}
                      placeholder="Chọn loại thông báo"
                      {...props}
                    />
                  )}
                  errors={errors}
                  control={control}
                />
                <InputWrapper
                  required
                  field="sendTime"
                  label="Thời gian gửi"
                  component={(props: any) => (
                    <DatePicker
                      insetInput
                      disabled={checkDisabledTime()}
                      type="dateTime"
                      placeholder={'Chọn ngày và giờ gửi'}
                      format="dd/MM/yyyy HH:mm:ss"
                      disabledDate={(current: any) => {
                        if (watch('resendType') == 0) {
                          return moment().add(-1, 'days') >= current;
                        } else {
                          return false;
                        }
                      }}
                      showClear={false}
                      {...props}
                    />
                  )}
                  errors={errors}
                  control={control}
                />
              </div>
              {watch('type') == 'CUS_PROMOTION' && (
                <div className="grid grid-cols-2 gap-12">
                  <InputWrapper
                    required
                    field="idTypeNotification"
                    label="Mã chiến dịch"
                    component={(props: any) => (
                      <CampaignCodeSelect
                        {...props}
                        multiple={false}
                        filter={true}
                        disabled={checkDisabledTime()}
                        campaignCode={data?.campaignCode}
                        idTypeNotification={data?.idTypeNotification}
                        setExpiredCampaign={setExpiredCampaign}
                      />
                    )}
                    errors={errors}
                    control={control}
                  />
                </div>
              )}
              {(watch('receiver')?.includes('user') ||
                watch('receiver')?.includes('hr_admin')) && (
                <div className="grid grid-cols-2 gap-12">
                  <InputWrapper
                    required
                    field="companyId"
                    label="Doanh nghiệp"
                    component={(props: any) => (
                      <CompanySelect
                        {...props}
                        multiple={true}
                        filter={true}
                        idTypeNotification={watch('idTypeNotification')}
                        disabled={
                          watch('isAllCompany') == true ||
                          checkDisabled() ||
                          (checkAllCompany && watch('type') == 'CUS_PROMOTION')
                        }
                        checkAllCompany={setCheckAllCompany}
                      />
                    )}
                    errors={errors}
                    control={control}
                  />
                  <InputWrapper
                    field="isAllCompany"
                    label="Tất cả doanh nghiệp"
                    component={(props: any) => (
                      <Switch
                        disabled={
                          checkDisabled() ||
                          (typeof checkAllCompany === 'boolean' &&
                            watch('type') == 'CUS_PROMOTION')
                        }
                        {...props}
                        checked={props.value}
                      />
                    )}
                    errors={errors}
                    control={control}
                  />
                </div>
              )}
              {watch('receiver')?.includes('user') && (
                <div className="grid grid-cols-2 gap-12">
                  <InputWrapper
                    required
                    field="customEmployee"
                    label="Người lao động"
                    component={(props: any) => (
                      <EmpolyeeFromCompanies
                        {...props}
                        multiple={true}
                        companyIds={watch('companyId')}
                        isAllCompany={watch('isAllCompany')}
                        filter={true}
                        disabled={
                          watch('isAllEmployee') == true || checkDisabled()
                        }
                      />
                    )}
                    errors={errors}
                    control={control}
                  />
                  <InputWrapper
                    field="isAllEmployee"
                    label="Tất cả người lao động"
                    component={(props: any) => (
                      <Switch
                        disabled={checkDisabled()}
                        {...props}
                        checked={props.value}
                      />
                    )}
                    errors={errors}
                    control={control}
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-12">
                <div className="flex flex-col gap-4">
                  <img
                    className="w-40 h-40 object-fill border-dashed border-gray-500 rounded p-0.5"
                    src={displayImageUrl}
                  />
                  <div>
                    <InputWrapper
                      field="attachUrl"
                      label="Link liên kết"
                      component={(props: any) => (
                        <Input
                          {...props}
                          disabled={watch('receiver') !== 'user'}
                        />
                      )}
                      errors={errors}
                      control={control}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="h-40">
                    <img
                      className="w-40 h-40 object-fill border-dashed border-gray-500 rounded p-0.5 mr-3"
                      src={
                        watch('imageId')
                          ? `${
                              isProduction()
                                ? 'https://cdn.api.flexpay.vn/'
                                : 'https://cdn.devops.beamewa.com.vn/'
                            }${watch('imageId')}`
                          : ''
                      }
                    />
                  </div>
                  <InputWrapper
                    field="image"
                    label="Ảnh đính kèm"
                    component={(props: any) => (
                      <>
                        <div className="w-28">
                          <Upload
                            action={`${NEXT_PUBLIC_API_CORE}/file-manager/public-notification/upload`}
                            dragIcon={<IconBolt />}
                            draggable={true}
                            accept=".jpg,.png,.jpeg"
                            maxSize={2049}
                            disabled={checkDisabled()}
                            customRequest={(options: any) => {
                              const data = new FormData();
                              data.append('file', options.file.fileInstance);
                              axiosInstance
                                .post(options.action, data)
                                .then((res: any) => {
                                  options.onSuccess(res.data, options.file);
                                })
                                .catch((err: Error) => {});
                            }}
                            showUploadList={false}
                            onSuccess={(e: any) => {
                              Notification.success({
                                content: `Tải lên thành công!`,
                                theme: 'light',
                              });

                              reset({
                                ...getValues(),
                                imageId: e?.data.name,
                              });
                            }}
                            onSizeError={(file, fileList) =>
                              Toast.error(
                                `Vui lòng tải lên file có dung lượng <= 2MB`
                              )
                            }
                          >
                            <Button
                              className="self-start h-8"
                              icon={<IconUpload />}
                              theme="solid"
                            >
                              Tải lên file
                            </Button>
                          </Upload>
                        </div>
                      </>
                    )}
                    errors={errors}
                    control={control}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-12">
                <InputWrapper
                  required
                  field="resendType"
                  label="Gửi lại"
                  component={(props: any) => (
                    <Select
                      disabled={checkDisabledTime()}
                      optionList={listResendType}
                      {...props}
                    />
                  )}
                  errors={errors}
                  control={control}
                />
                <InputWrapper
                  required
                  field="status"
                  label="Trạng thái"
                  component={(props: any) => (
                    <Select
                      disabled={checkDisabledTime()}
                      optionList={simpleStatusOptions}
                      {...props}
                    />
                  )}
                  errors={errors}
                  control={control}
                />
              </div>
              <div className="grid grid-cols-1 gap-12">
                <InputWrapper
                  required
                  field="content"
                  label="Nội dung thông báo"
                  component={(props: any) => (
                    <TextArea
                      disabled={checkDisabledTime()}
                      maxLength={500}
                      maxCount={500}
                      showCounter
                      showClear
                      {...props}
                    />
                  )}
                  errors={errors}
                  control={control}
                />
              </div>
            </div>
          </div>
        </FormWrapper>
      </SpinWrapper>
    </MainContentWrapper>
  );
};
