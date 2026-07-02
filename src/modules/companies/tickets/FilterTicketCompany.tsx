import { InputWrapper } from '@components/shared';
import { Button, Input, Select } from '@douyinfe/semi-ui';
import React from 'react';
import { useForm } from 'react-hook-form';
import { IconSearch } from '@douyinfe/semi-icons';
export const FilterTicket = (props: any) => {
  const {
    onFilter,
    companyId,
    refetch,
    acceptTicket,
    rejectTicket,
    isSelectBatch,
  } = props;
  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      searchWord: '',
      type: '',
      subtype: 'ALL',
      status: '',
      companyId: companyId,
    },
  });
  const onHandleSubmit = (values: any) => {
    if (values.companyId === undefined) {
      values.companyId = '';
    }
    onFilter &&
      onFilter({
        ...values,
        searchWord: values.searchWord.trim(),
        page: 1,
        size: 10,
        companyId: companyId,
      });
    refetch();
  };
  return (
    <div>
      {/* <BoxWrapper padding={6}> */}
      <form onSubmit={handleSubmit(onHandleSubmit)} className="grid gap-6">
        <div className="grid grid-cols-2 gap-6">
          <InputWrapper
            label="Mã yêu cầu/Số điện thoại/Họ và tên"
            field="searchWord"
            control={control}
            errors={errors}
            component={(e: any) => {
              return (
                <Input
                  prefix={<IconSearch />}
                  showClear
                  autoComplete="off"
                  placeholder="Mã yêu cầu/Số điện thoại/Họ và tên"
                  size="large"
                  {...e}
                />
              );
            }}
          />
          {/* <ProtectedWrapper
              allowedRoles={[UserRole.BEAM_ADMIN, UserRole.SUPER_ADMIN]}
            >
              <InputWrapper
                field="companyId"
                label="Doanh nghiệp"
                control={control}
                errors={errors}
                component={(e: any) => <CompanySelect size="large" {...e} />}
              />
            </ProtectedWrapper> */}

          <InputWrapper
            label="Nhóm yêu cầu"
            field="type"
            control={control}
            errors={errors}
            component={(e: any) => {
              return (
                <Select
                  placeholder="Nhóm yêu cầu"
                  size="large"
                  optionList={[
                    {
                      label: 'Tất cả',
                      value: '',
                    },
                    {
                      label: 'Cập nhật thông tin',
                      value: 'INFORMATION',
                    },
                    {
                      label: 'Đăng ký dịch vụ ứng lương',
                      value: 'REGISTER_SALARY_ADVANCE',
                    },
                  ]}
                  {...e}
                />
              );
            }}
          />
          <InputWrapper
            label="Loại yêu cầu"
            field="subtype"
            control={control}
            errors={errors}
            component={(e: any) => {
              return (
                <Select
                  placeholder="Loại yêu cầu"
                  size="large"
                  optionList={[
                    {
                      label: 'Tất cả',
                      value: 'ALL',
                    },
                    {
                      label: 'Thay đổi thông tin',
                      value: 'UPDATE',
                    },
                    {
                      label: 'Đăng ký mới',
                      value: 'CREATE',
                    },
                  ]}
                  {...e}
                />
              );
            }}
          />
          <InputWrapper
            label="Trạng thái"
            field="status"
            control={control}
            errors={errors}
            component={(e: any) => {
              return (
                <Select
                  placeholder="Trạng thái"
                  size="large"
                  optionList={[
                    {
                      label: 'Tất cả',
                      value: '',
                    },
                    {
                      label: 'Chờ duyệt',
                      value: 0,
                    },
                    {
                      label: 'Đã duyệt',
                      value: 1,
                    },
                    {
                      label: 'Từ chối',
                      value: 2,
                    },
                    {
                      label: 'Huỷ',
                      value: 3,
                    },
                  ]}
                  {...e}
                />
              );
            }}
          />
          <div className={'flex items-end gap-3'}>
            {isSelectBatch && (
              <div className={'flex gap-3'}>
                <InputWrapper
                  label=""
                  component={(e: any) => {
                    return (
                      <Button
                        onClick={acceptTicket}
                        className={'bg-green-600'}
                        theme="solid"
                      >
                        Phê duyệt
                      </Button>
                    );
                  }}
                />
                <InputWrapper
                  label=""
                  component={(e: any) => {
                    return (
                      <Button
                        onClick={rejectTicket}
                        type="tertiary"
                        theme="solid"
                      >
                        Từ chối
                      </Button>
                    );
                  }}
                />
              </div>
            )}
            <div className={'flex-grow'}>
              <InputWrapper
                label=""
                component={(e: any) => {
                  return (
                    <Button type={'primary'} theme="solid" htmlType="submit">
                      Tra cứu
                    </Button>
                  );
                }}
              />
            </div>
          </div>
        </div>
      </form>
      {/* </BoxWrapper> */}
    </div>
  );
};
