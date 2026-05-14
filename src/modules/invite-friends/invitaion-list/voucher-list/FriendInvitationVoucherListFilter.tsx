import { InputWrapper } from "@components/shared";
import { CustomMonthRangePicker } from "@components/shared/CustomMonthRangePicker";
import { ProtectedWrapper } from "@components/widgets/Auth";
import { CompanyNameSelect } from "@components/widgets/Select/CompanyNameSelect";
import { UserRole } from "@constants/auth.constants";
import { TIMEZONE_FORMAT } from "@constants/common-format";
import { IconDownload, IconFilter, IconSearch } from "@douyinfe/semi-icons";
import { Button, Input, Select } from "@douyinfe/semi-ui";
import { DateTimeHelper } from "@helpers/date-time.helper";
import { CampaignService } from "@services/campaigns";
import { useRouter } from "next/router";
import { useEffect } from "react";
import DownloadLink from "react-download-link";
import { useForm } from "react-hook-form";

export const FriendInvitationVoucherListFilter = (props: any) => {
  const { onFilter, refetch, showType = true, filter } = props;
  const router = useRouter();

  const onClickExportData = async () => {
    const downloadData: any =
      await CampaignService.exportFriendInvitationVoucherMilestone(filter);
    return downloadData;
  };

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      customerSearch: "",
      companySearch: "",
      status: "",
      dateType: "all",
      dateRanges: [""],
      page: 1,
      size: 10,
    },
  });

  useEffect(() => {
    reset({
      ...getValues(),
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
    <form
      onSubmit={handleSubmit(onSubmitValues)}
      onKeyDown={(e) => {
        e.key === "Enter" && e.preventDefault();
        e.key === "Enter" && onSubmitValues(getValues());
      }}
    >
      <div className="grid grid-cols-3 gap-4 items-end">
        <InputWrapper
          field="customerSearch"
          label="Người được giới thiệu"
          control={control}
          errors={errors}
          component={(field: any) => (
            <Input
              size="large"
              prefix={<IconSearch />}
              showClear
              autoComplete="off"
              placeholder="SĐT, Tên Người giới thiệu"
              {...field}
            />
          )}
        />
        <InputWrapper
          field="companySearch"
          label="Doanh nghiệp Người được giới thiệu"
          control={control}
          errors={errors}
          component={(field: any) => (
            <CompanyNameSelect
              size="large"
              prefix={<IconSearch />}
              showClear
              autoComplete="off"
              placeholder="Nhập tên doanh nghiệp"
              {...field}
            />
          )}
        />
        <InputWrapper
          field="dateType"
          label="Xem theo ngày"
          control={control}
          errors={errors}
          component={(field: any) => (
            <Select
              size="large"
              optionList={[
                { label: "Tất cả", value: "all" },
                { label: "Ngày đăng ký dịch vụ ứng lương", value: "service" },
                { label: "Ngày khảo sát", value: "survey" },
                { label: "Ngày ứng lương lần đầu", value: "firstAdvance" },
              ]}
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
            <Select
              size="large"
              optionList={[
                { label: "Tất cả", value: "" },
                { label: "Đã chi thưởng", value: "paid" },
                { label: "Chưa chi thưởng", value: "unpaid" },
              ]}
              {...field}
            />
          )}
        />
        <InputWrapper
          field="dateRanges"
          label="Ngày"
          control={control}
          errors={errors}
          component={(customProps: any) => (
            <CustomMonthRangePicker
              className="w-full"
              type="dateTime"
              placeholder="DD/MM/YYYY ~ DD/MM/YYYY"
              format="dd/MM/yyyy"
              {...customProps}
              size="large"
            />
          )}
        />
        <div className="flex gap-4 items-center">
          <Button
            icon={<IconFilter />}
            theme="solid"
            type="secondary"
            onClick={() => onSubmitValues(getValues())}
          >
            Tìm kiếm
          </Button>

          <ProtectedWrapper
            allowedRoles={[
              UserRole.BEAM_ADMIN,
              UserRole.SUPER_ADMIN,
              UserRole.SALE,
              UserRole.CUSTOMER_SERVICE,
              UserRole.CONTROLLER,
              UserRole.ACCOUNTANT,
            ]}
          >
            <DownloadLink
              style={{
                textDecoration: "none",
                width: "110px",
              }}
              label={
                <>
                  <Button
                    size="large"
                    theme="light"
                    icon={<IconDownload />}
                    onClick={() => {
                      // TODO: implement export logic
                    }}
                  >
                    Xuất dữ liệu
                  </Button>
                </>
              }
              filename={`Danh_sách_Người_giới_thiệu_đạt_thưởng_voucher_${DateTimeHelper.formatDateTime(
                new Date()
              )}.xlsx`}
              exportFile={onClickExportData}
            />
          </ProtectedWrapper>
        </div>
      </div>
    </form>
  );
};
