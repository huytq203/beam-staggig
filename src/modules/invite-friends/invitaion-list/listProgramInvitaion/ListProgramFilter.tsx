import { InputWrapper } from "@components/shared";
import { CustomMonthRangePicker } from "@components/shared/CustomMonthRangePicker";
import { TIMEZONE_FORMAT } from "@constants/common-format";
import { invitationFriendCampaignStatusOptions, listStatusCampaign } from "@constants/select-options.constants";
import { IconFilter, IconPlus, IconSearch } from "@douyinfe/semi-icons";
import { Button, Input, Select } from "@douyinfe/semi-ui";
import { DateTimeHelper } from "@helpers/date-time.helper";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export const ListProgramFilter = (props: any) => {
  const { onFilter, refetch, showType = true } = props;
  const router = useRouter();

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      searchKey: "",
      campaignType: "",
      dateRanges: [""],
      page: 1,
      size: 10,
      status: "",
    },
  });

  useEffect(() => {
    reset({
      ...getValues(),
      searchKey: "",
    });
  }, []);
  const onSubmitValues = (values: any) => {
    // if (values.status === 5) {
    //   delete values.status;
    //   return onFilter({
    //     ...values,
    //     searchKey: values.searchKey.trim(),
    //     campaignType: values.campaignType,
    //     endTime: DateTimeHelper.fomartDateRangeSubmit(
    //       DateTimeHelper.setEndTime(
    //         values.dateRanges[1],
    //         TIMEZONE_FORMAT.GMT7
    //       ).format()
    //     ),
    //     startTime: DateTimeHelper.fomartDateRangeSubmit(
    //       DateTimeHelper.setStartTime(
    //         values.dateRanges[0],
    //         TIMEZONE_FORMAT.GMT7
    //       ).format()
    //     ),
    //   });
    // }
    refetch();

    return onFilter({
      ...values,
      searchKey: values.searchKey.trim(),
      campaignTypeId: values.campaignType,
      endTime: values.dateRanges[1]
        ? DateTimeHelper.fomartDateRangeSubmit(
            DateTimeHelper.setEndTime(
              values.dateRanges[1],
              TIMEZONE_FORMAT.GMT7
            ).format()
          )
        : "",
      startTime: values.dateRanges[0]
        ? DateTimeHelper.fomartDateRangeSubmit(
            DateTimeHelper.setStartTime(
              values.dateRanges[0],
              TIMEZONE_FORMAT.GMT7
            ).format()
          )
        : "",
    });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmitValues)}
        onKeyDown={(e) => {
          e.key === "Enter" && e.preventDefault();
          e.key === "Enter" && onSubmitValues(getValues());
        }}
      >
        <div className="grid grid-cols-3 gap-4 ">
          <InputWrapper
            field="searchKey"
            label="Tìm kiếm chương trình"
            control={control}
            errors={errors}
            component={(field: any) => (
              <Input
                size="large"
                prefix={<IconSearch />}
                showClear
                autoComplete="off"
                placeholder="Tên chiến dịch, mã chiến dịch"
                {...field}
              />
            )}
          />
          <InputWrapper
            field="status"
            label="Trạng thái"
            control={control}
            errors={errors}
            component={(field: any) => (
              <Select size="large" optionList={invitationFriendCampaignStatusOptions} {...field} />
            )}
          />

          <InputWrapper
            field="dateRanges"
            label="Lựa chọn thời gian"
            control={control}
            errors={errors}
            component={(customProps: any) => (
              <CustomMonthRangePicker
                className="w-full"
                type="dateTime"
                placeholder="Ngày"
                format="dd/MM/yyyy"
                {...customProps}
                size="large"
              />
            )}
          />
          <div className="flex gap-4">
            <Button
              icon={<IconFilter />}
              theme="solid"
              type="secondary"
              onClick={() => onSubmitValues(getValues())}
              // htmlType="submit"
            >
              Tìm kiếm
            </Button>

            <Button
              size="large"
              theme="solid"
              icon={<IconPlus />}
              onClick={() =>
                router.push(
                  "/invite-friends/referral-program/create-program-invitation"
                )
              }
            >
              Thiết lập chương trình
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};
