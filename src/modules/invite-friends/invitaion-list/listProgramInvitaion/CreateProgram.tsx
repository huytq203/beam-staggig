import { InputWrapper } from "@components/shared";
import { CompanySelect, FormWrapper, MainContentWrapper } from "@components/widgets";
import { SpinWrapper } from "@components/widgets/ContentWrapper/SpinWrapper";
import { Button, DatePicker, Input, Select, Switch } from "@douyinfe/semi-ui";
import { useForm } from "react-hook-form";
import moment from 'moment-timezone';
import { BeamEditor } from "@components/shared/RichText/NanoEditor";
import { CampaignCompanyPickList } from "@modules/campaigns/CampaignCompanyPickList";
import { useState } from "react";

export const CreateProgram = (props: any) => {
  const { onCancel, isNew } = props;
  const [checkAllCompany, setCheckAllCompany] = useState(true);

  const { control, handleSubmit, reset, getValues, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      code: '',
      budget: '',
      companyId: '',
      startDate: '',
      endDate: '',
    },
  });

  return (
    <MainContentWrapper isNew={isNew} data={null}>
      <SpinWrapper>
        <FormWrapper
          pageTitle={isNew ? "Thiết lập chương trình giới thiệu bạn bè" : "Chỉnh sửa chương trình giới thiệu bạn bè"}
          onCancel={onCancel}
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-5">
            <p className="font-bold">Thông tin chương trình</p>

            <div className="flex flex-col gap-4 mb-4">
              <div className="grid grid-cols-2 gap-12">
                <InputWrapper
                  required
                  field="name"
                  label="Tên chương trình"
                  component={(props: any) => (
                    <Input maxLength={100} showClear {...props} />
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
                      maxLength={50}
                      showClear
                      onInput={(e: any) => (e.target.value = e.target.value.toUpperCase())}
                      value={props.value}
                      onChange={(value: any) => {
                        const reg = /^[a-zA-Z0-9]*$/;
                        if ((!Number.isNaN(value) && reg.test(value)) || value === '' || value === '-') {
                          props.onChange(value);
                        }
                      }}
                    />
                  )}
                  errors={errors}
                  control={control}
                />
              </div>

              <div className="grid grid-cols-2 gap-12">
                <div className="flex flex-col gap-4">
                  <InputWrapper
                    required
                    field="startTime"
                    label="Thời gian bắt đầu"
                    component={(props: any) => (
                      <DatePicker
                        insetInput
                        type="dateTime"
                        format="dd/MM/yyyy HH:mm:ss"
                        disabledDate={(current: any) => {
                          return moment().add(-1, 'days') >= current;
                        }}
                        {...props}
                      />
                    )}
                    errors={errors}
                    control={control}
                  />

                  <InputWrapper
                    required
                    field="endTime"
                    label="Thời gian kết thúc"
                    component={(props: any) => (
                      <DatePicker
                        insetInput
                        type="dateTime"
                        format="dd/MM/yyyy HH:mm:ss"
                        disabledDate={(current: any) => {
                          return moment().add(-1, 'days') >= current;
                        }}
                        {...props}
                      />
                    )}
                    errors={errors}
                    control={control}
                  />

                  <InputWrapper
                    field="total"
                    label="Tổng số lượng người"
                    component={(props: any) => (
                      <Input type="number" min={0} {...props} />
                    )}
                    errors={errors}
                    control={control}
                  />

                  <InputWrapper
                    field="budget"
                    label="Ngân sách chương trình"
                    component={(props: any) => (
                      <Input type="text" {...props} />
                    )}
                    errors={errors}
                    control={control}
                  />
                </div>

                <div>
                  <InputWrapper
                    field="guide"
                    label="Cách thức tham gia"
                    component={(props: any) => (
                      <BeamEditor
                        value={props.value}
                        onChange={props.onChange}
                        fontsize={false}
                        font={false}
                      />
                    )}
                    errors={errors}
                    control={control}
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-12">
                    <InputWrapper
                      required
                      field="companyId"
                      label="Doanh nghiệp"
                      component={(props: any) => (
                      <CompanySelect
                        {...props}
                        multiple={false}
                        disabled={props.disabled}
                        onChange={(value: any) => props.onChange(value)}
                        checkAllCompany={setCheckAllCompany}
                      />
                      )}
                        errors={errors}
                        control={control}
                    />
                    <InputWrapper
                      field="selectdAll"
                      label="Chọn tất cả doanh nghiệp"
                      component={(props: any) => (
                        <Switch
                          checked={checkAllCompany}
                          onChange={(checked: boolean) => {
                            setCheckAllCompany(checked);
                            props.onChange(checked ? 'all' : '');
                          }}
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
                          optionList={
                            [
                              { label: 'Đang hoạt động', value: 'active' },
                              { label: 'Không hoạt đông', value: 'inactive' },
                            ]
                          }
                          {...props}
                          onChange={(value: any) => props.onChange(value)}
                        />
                      )}
                      errors={errors}
                      control={control}
                    />
                </div>
                <div>
                </div>
                <div>
                   <p className="font-bold mb-4"> Cơ cấu giải thưởng</p>
                  <div className="grid grid-cols-2 gap-12">
                    <InputWrapper
                      required
                      field="reward"
                      label="Tổng tiền tối đa 1 người nhận được"
                      component={(props: any) => (
                        <Input type="number" min={0} {...props} />
                      )}
                      errors={errors}
                      control={control}               
                    />
                   <InputWrapper
                      required
                      field="reward"
                      label="Mã chiến dịch"
                      component={(props: any) => (
                        <Input type="number" min={0} {...props} />
                      )}
                      errors={errors}
                      control={control}               
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-12 mt-6">
                  {/* Người giới thiệu */}
                  <div>
                    <p className="font-bold mb-3">Người giới thiệu</p>
                    <div className="flex flex-col gap-4">
                      <InputWrapper
                        field="ref_ct1_signup"
                        label="Số tiền CT1: đăng ký thành công"
                        component={(props: any) => <Input type="number" min={0} {...props} />}
                        errors={errors}
                        control={control}
                      />
                      <InputWrapper
                        field="ref_ct2_signup"
                        label="Số tiền CT2: đăng ký thành công"
                        component={(props: any) => <Input type="number" min={0} {...props} />}
                        errors={errors}
                        control={control}
                      />
                      <InputWrapper
                        field="ref_ct2_advance_success"
                        label="Số tiền CT2: ứng lương thành công"
                        component={(props: any) => <Input type="number" min={0} {...props} />}
                        errors={errors}
                        control={control}
                      />
                    </div>
                  </div>

                  <div>
                    <p className="font-bold mb-3">Người được giới thiệu</p>
                    <div className="flex flex-col gap-4">
                      <InputWrapper
                        field="invitee_ct1_signup"
                        label="Số tiền CT1: đăng ký thành công"
                        component={(props: any) => <Input type="number" min={0} {...props} />}
                        errors={errors}
                        control={control}
                      />
                      <InputWrapper
                        field="invitee_ct2_signup"
                        label="Số tiền CT2: đăng ký thành công"
                        component={(props: any) => <Input type="number" min={0} {...props} />}
                        errors={errors}
                        control={control}
                      />
                    </div>
                  </div>
                </div>
                
                  

                </div>

          </div>
        </FormWrapper>
      </SpinWrapper>
    </MainContentWrapper>
  );
};
