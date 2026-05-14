import { InputNumber, InputWrapper } from "@components/shared";
import { BeamEditor } from "@components/shared/RichText/NanoEditor";
import {
  CompanySelect,
  FormWrapper,
  MainContentWrapper,
} from "@components/widgets";
import { SpinWrapper } from "@components/widgets/ContentWrapper/SpinWrapper";
import { CampaignCodeSelect } from "@components/widgets/Select/CampaignCodeSelect";
import { UserRole } from "@constants/auth.constants";
import { COMMON_FORMAT } from "@constants/common-format";
import { simpleStatusOptions } from "@constants/select-options.constants";
import { useAuth } from "@contexts/authentication";
import { IconMinus, IconPlus } from "@douyinfe/semi-icons";
import {
  Collapse,
  DatePicker,
  Input,
  Notification,
  Select,
  Switch,
} from "@douyinfe/semi-ui"; // Thêm Notification
import { DateTimeHelper } from "@helpers/date-time.helper";
import { yupResolver } from "@hookform/resolvers/yup";
import { CampaignService } from "@services/campaigns";
import moment from "moment-timezone";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useQuery } from "react-query";
import { CreateFriendInvitationCampaignSchema } from "validations/CreateCampaignSchema.schema";

export const CreateProgram = (props: any) => {
  const { onCancel, isNew, campaignId, onClickCancel } = props;
  const { authCheckByRole, profile } = useAuth();
  const [visible, setVisible] = useState(false);
  const [expiredCampaign, setExpiredCampaign] = useState(false);

  const [applyToAllCompanies, setApplyToAllCompanies] = useState(true);

  const { data, isFetching, isLoading, error, isError } = useQuery(
    ["campaign_detail", campaignId],
    () => CampaignService.getFriendInvitationCampaign(campaignId),
    {
      enabled: !isNew,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    }
  );

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(CreateFriendInvitationCampaignSchema),
    defaultValues: {
      programName: "",
      programCode: "",
      status: 0,
      applyType: 1,
      applyIds: [],
      programDescription: "",
      startTime: "",
      endTime: null,
      maxParticipants: null,
      budget: null,
      maxRewardPerUser: null,
      discountCampaignCode: "",
      programStatus: "ACTIVE",
      applyAll: true,

      companyIds: [],
      rewardConfigs: [
        {
          role: "REFERRER",
          taskType: "REGISTER_NEW_COMPANY",
          rewardAmount: 500000,
        },
        {
          role: "REFEREE",
          taskType: "REGISTER_NEW_COMPANY",
          rewardAmount: 200000,
        },
        {
          role: "REFERRER",
          taskType: "REGISTER_SALARY_ADVANCE",
          rewardAmount: 300000,
        },
      ],
    },
  });

  useEffect(() => {
    if (!isLoading && !isNew) {
      let resetData = data;
      const apply = data?.applyIds;

      // Map rewardConfigs về các field input
      const rewardConfigs = data?.rewardConfigs || [];
      const rewardFieldMap: Record<string, number> = {};
      rewardConfigs.forEach((item: any) => {
        if (
          item.role === "REFERRER" &&
          item.taskType === "REGISTER_NEW_COMPANY"
        ) {
          rewardFieldMap["ref_ct1_signup"] = item.rewardAmount;
        }
        if (
          item.role === "REFERRER" &&
          item.taskType === "REGISTER_SALARY_ADVANCE"
        ) {
          rewardFieldMap["ref_ct2_signup"] = item.rewardAmount;
        }
        if (
          item.role === "REFERRER" &&
          item.taskType === "FIRST_SALARY_ADVANCE"
        ) {
          rewardFieldMap["ref_ct2_advance_success"] = item.rewardAmount;
        }
        if (
          item.role === "INVITEE" &&
          item.taskType === "REGISTER_NEW_COMPANY"
        ) {
          rewardFieldMap["invitee_ct1_signup"] = item.rewardAmount;
        }
        if (
          item.role === "INVITEE" &&
          item.taskType === "REGISTER_SALARY_ADVANCE"
        ) {
          rewardFieldMap["invitee_ct2_signup"] = item.rewardAmount;
        }
      });

      resetData = {
        ...resetData,
        ...rewardFieldMap,
        applyIds: apply,
        startTime: DateTimeHelper.convertTimeZone(
          data?.startTime,
          COMMON_FORMAT.EMPTY_FORMAT
        ),
        endTime: DateTimeHelper.convertTimeZone(
          data?.endTime,
          COMMON_FORMAT.EMPTY_FORMAT
        ),
      };
      reset(resetData);
    }
  }, [isLoading, isFetching]);

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control,
      name: "applyIds",
    } as any
  );

  useEffect(() => {
    if (watch("applyAll") === true && isNew) {
      setValue("applyIds", []);
    }
  }, [watch("applyAll")]);

  const onSubmit = (data: any) => {
    const {
      ref_ct1_signup,
      ref_ct2_signup,
      ref_ct2_advance_success,
      invitee_ct1_signup,
      invitee_ct2_signup,
      ...mainProgramData
    } = data;

    // Map đúng cấu trúc và taskType
    const rewardConfigs = [
      {
        role: "REFERRER",
        taskType: "REGISTER_NEW_COMPANY",
        rewardAmount: Number(ref_ct1_signup) || 0,
      },
      {
        role: "REFERRER",
        taskType: "REGISTER_SALARY_ADVANCE",
        rewardAmount: Number(ref_ct2_signup) || 0,
      },
      {
        role: "REFERRER",
        taskType: "FIRST_SALARY_ADVANCE",
        rewardAmount: Number(ref_ct2_advance_success) || 0,
      },
      {
        role: "INVITEE",
        taskType: "REGISTER_NEW_COMPANY",
        rewardAmount: Number(invitee_ct1_signup) || 0,
      },
      {
        role: "INVITEE",
        taskType: "REGISTER_SALARY_ADVANCE",
        rewardAmount: Number(invitee_ct2_signup) || 0,
      },
    ].filter((item) => item.rewardAmount > 0);

    const finalPayload = {
      ...mainProgramData,
      applyIds: mainProgramData.applyAll ? [] : mainProgramData.applyIds,
      companyIds: applyToAllCompanies ? [] : mainProgramData.companyIds,
      rewardConfigs,
    };
    onSubmitValues(finalPayload);
  };

  const onSubmitValues = (values: any) => {
    setLoading(true);

    const payload = {
      ...values,
      id: values?.id,
      name: values.name,
      code: values.code,
      description: values.description,
      quantity: values.maxParticipants,
      maxParticipants: values.maxParticipants,
      maximumBudget: values.maximumBudget,
      maxRewardPerUser: values.maxRewardPerUser,
      discountCampaignCode: values.discountCampaignCode,
      status: values.status,
      startTime: moment(values.startTime).toISOString(),
      endTime: values.endTime ? moment(values.endTime).toISOString() : null,
      companyIds: values.companyIds,
      rewardConfigs: values.rewardConfigs,
      valueType: 0,
      applyType: 1,
    };

    CampaignService.addOrUpdateInvitationCampaign(payload)
      .then((response) => {
        if (response) {
          Notification.success({
            title: "Thành công",
            content: `${
              isNew ? "Thêm mới" : "Cập nhật"
            } chương trình thành công!`,
            duration: 3,
            theme: "light",
          });
          router.push(`/invite-friends/referral-program/listProgram`);
        } else {
          Notification.error({
            title: "Thất bại",
            content: `${
              isNew ? "Thêm mới" : "Cập nhật"
            } chương trình thất bại!`,
            duration: 3,
            theme: "light",
          });
        }
      })
      .catch((e) => {
        Notification.error({
          title: "Có lỗi xảy ra",
          content: e?.response?.data?.message || "Vui lòng thử lại sau.",
          duration: 3,
          theme: "light",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const checkDisabled = () => {
    if (!isNew && watch("status") === 1) {
      return true;
    } else if (
      [
        UserRole.ACCOUNTANT,
        UserRole.SALE,
        UserRole.CONTROLLER,
        UserRole.RECONCILER,
      ].includes(profile?.roles[0])
    ) {
      return true;
    }

    return false;
  };

  const onSelectEmployee = (employeeId: any) => {
    remove();
    append(employeeId);
  };
  const onSelectCompany = (listIds: any[]) => {
    console.log("onSelectCompany", listIds);
    remove();
    console.log("listIds", listIds);
    append(listIds);
  };

  if (isLoading) return <></>;

  return (
    <MainContentWrapper isNew={isNew} data={data} isLoading={isLoading}>
      <SpinWrapper isLoading={loading}>
        <FormWrapper
          pageTitle={
            isNew
              ? "Thiết lập chương trình giới thiệu bạn bè"
              : "Chỉnh sửa chương trình giới thiệu bạn bè"
          }
          onCancel={onClickCancel}
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-8">
            <Collapse
              expandIcon={<IconPlus />}
              collapseIcon={<IconMinus />}
              className="p-0"
              defaultActiveKey={[
                "campaignInformation",
                "applyRange",
                "applyCondition",
              ]}
            >
              <Collapse.Panel
                header="THÔNG TIN CHƯƠNG TRÌNH"
                itemKey="campaignInformation"
              >
                <div className="flex flex-col gap-4 mb-4">
                  <div className="grid grid-cols-2 gap-12">
                    <InputWrapper
                      required
                      field="name"
                      label="Tên chương trình"
                      component={(props: any) => (
                        <Input
                          disabled={checkDisabled()}
                          maxLength={150}
                          showClear
                          {...props}
                        />
                      )}
                      errors={errors}
                      control={control}
                    />
                    <InputWrapper
                      required
                      field="code"
                      label="Mã chương trình"
                      component={(props: any) => (
                        <Input
                          maxLength={10}
                          showClear
                          {...props}
                          disabled={!isNew}
                          onChange={(e: any) => {
                            props.onChange(e.toUpperCase());
                          }}
                        />
                      )}
                      errors={errors}
                      control={control}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-12">
                    <InputWrapper
                      required
                      field="startTime"
                      label="Ngày bắt đầu"
                      component={(props: any) => (
                        <DatePicker
                          insetInput
                          disabled={checkDisabled()}
                          type="dateTime"
                          format="dd/MM/yyyy HH:mm:ss"
                          disabledDate={(current: any) => {
                            return moment().add(-1, "days") >= current;
                          }}
                          {...props}
                        />
                      )}
                      errors={errors}
                      control={control}
                    />
                    <InputWrapper
                      field="endTime"
                      label="Ngày kết thúc"
                      component={(props: any) => (
                        <DatePicker
                          insetInput
                          disabled={checkDisabled()}
                          type="dateTime"
                          format="dd/MM/yyyy HH:mm:ss"
                          disabledDate={(current: any) => {
                            return moment().add(-1, "days") >= current;
                          }}
                          {...props}
                        />
                      )}
                      errors={errors}
                      control={control}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-12">
                    <InputWrapper
                      field="maxParticipants"
                      label="Tổng số người tham gia tối đa"
                      component={(props: any) => (
                        <InputNumber
                          disabled={checkDisabled()}
                          maxLength={10}
                          // min={0}
                          max={999999999}
                          {...props}
                        />
                      )}
                      errors={errors}
                      control={control}
                    />
                    <InputWrapper
                      field="maximumBudget"
                      label="Ngân sách chương trình"
                      component={(props: any) => (
                        <InputNumber
                          disabled={checkDisabled()}
                          // min={0}
                          {...props}
                          suffix="VND"
                        />
                      )}
                      errors={errors}
                      control={control}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-12">
                    <InputWrapper
                      field="status"
                      label="Trạng thái"
                      component={(props: any) => (
                        <Select
                          disabled={checkDisabled()}
                          optionList={simpleStatusOptions}
                          {...props}
                          onSelect={(value: any) => {
                            if (!isNew && value === 1) {
                              return setVisible(true);
                            }
                          }}
                        />
                      )}
                      errors={errors}
                      control={control}
                    />
                  </div>
                  <div className="grid grid-cols-1">
                    <InputWrapper
                      field="description"
                      label="Mô tả chương trình"
                      component={(props: any) => (
                        <BeamEditor
                          disabled={checkDisabled()}
                          value={props.value}
                          onChange={props.onChange}
                        />
                      )}
                      errors={errors}
                      control={control}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-4 mb-4">
                  <div className="grid grid-cols-2 gap-12">
                    <InputWrapper
                      required={watch("applyAll") == false}
                      field="applyIds"
                      label="Doanh nghiệp"
                      component={(props: any) => (
                        <CompanySelect
                          {...props}
                          value={watch("applyAll") == true ? [] : props.value}
                          multiple={true}
                          filter={true}
                          disabled={
                            watch("applyAll") == true || checkDisabled()
                          }
                          checkAllCompany={onSelectCompany}
                        />
                      )}
                      errors={errors}
                      control={control}
                    />
                    <InputWrapper
                      field="applyAll"
                      label="Tất cả doanh nghiệp"
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

                  {/* <CampaignCompanyPicker
                    remove={remove}
                    control={control}
                    errors={errors}
                    watch={watch}
                    triggerValue={watch("applyType")}
                    onSelect={onSelectCompany}
                    disabledPicker={checkDisabled()}
                  /> */}
                </div>
              </Collapse.Panel>

              <Collapse.Panel
                header="CƠ CẤU GIẢI THƯỞNG"
                itemKey="applyCondition"
              >
                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-2 gap-12">
                    <InputWrapper
                      field="maxRewardPerUser"
                      label="Tổng tiền tối đa 1 người nhận được"
                      component={(props: any) => (
                        <InputNumber
                          disabled={checkDisabled()}
                          // min={0}
                          min={0}
                          {...props}
                          suffix="VND"
                        />
                      )}
                      errors={errors}
                      control={control}
                    />
                    <InputWrapper
                      field="discountCampaignCode"
                      label="Mã chiến dịch giảm phí (nếu có)"
                      component={(props: any) => (
                        <CampaignCodeSelect
                          {...props}
                          multiple={false}
                          filter={true}
                          disabled={checkDisabled()}
                        />
                      )}
                      errors={errors}
                      control={control}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                    <div>
                      <p className="font-bold mb-3 text-gray-700">
                        Người giới thiệu (Referrer)
                      </p>
                      <div className="flex flex-col gap-4">
                        <InputWrapper
                          field="ref_ct1_signup"
                          label="Số tiền CT1: Đăng ký thành công"
                          component={(props: any) => (
                            <InputNumber
                              disabled={checkDisabled()}
                              // min={0}
                              min={0}
                              {...props}
                              suffix="VND"
                            />
                          )}
                          errors={errors}
                          control={control}
                        />
                        <InputWrapper
                          field="ref_ct2_signup"
                          label="Số tiền CT2: Đăng ký thành công"
                          component={(props: any) => (
                            <InputNumber
                              disabled={checkDisabled()}
                              // min={0}
                              min={0}
                              {...props}
                              suffix="VND"
                            />
                          )}
                          errors={errors}
                          control={control}
                        />
                        <InputWrapper
                          field="ref_ct2_advance_success"
                          label="Số tiền CT2: Ứng lương thành công"
                          component={(props: any) => (
                            <InputNumber
                              disabled={checkDisabled()}
                              // min={0}
                              min={0}
                              {...props}
                              suffix="VND"
                            />
                          )}
                          errors={errors}
                          control={control}
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="font-bold mb-4 text-gray-700">
                        Người được giới thiệu (Invitee)
                      </p>
                      <div className="flex flex-col gap-4">
                        <InputWrapper
                          field="invitee_ct1_signup"
                          label="Số tiền CT1: Đăng ký thành công"
                          component={(props: any) => (
                            <InputNumber
                              disabled={checkDisabled()}
                              // min={0}
                              min={0}
                              {...props}
                              suffix="VND"
                            />
                          )}
                          errors={errors}
                          control={control}
                        />
                        <InputWrapper
                          field="invitee_ct2_signup"
                          label="Số tiền CT2: Đăng ký thành công"
                          component={(props: any) => (
                            <InputNumber
                              disabled={checkDisabled()}
                              // min={0}
                              min={0}
                              {...props}
                              suffix="VND"
                            />
                          )}
                          errors={errors}
                          control={control}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Collapse.Panel>
            </Collapse>

            <hr />
          </div>
        </FormWrapper>
      </SpinWrapper>
    </MainContentWrapper>
  );
};
