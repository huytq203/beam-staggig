import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { InputWrapper } from '@components/shared';
import { Button, DatePicker, Input, Select } from '@douyinfe/semi-ui';
import { IconFilter, IconSearch, IconPlus } from '@douyinfe/semi-icons';
import { CustomMonthRangePicker } from '@components/shared/CustomMonthRangePicker';
import { listStatusBoolean } from '@constants/select-options.constants';

type InputForm = {
  status: any;
  page: number;
  size: number;
};

export const ListProgramFilter = (props: any) => {
    // const { onFilter, refetch } = props;
    const { control, handleSubmit, reset, getValues } = useForm<InputForm>({
        defaultValues: {
            status: '',
            page: 1,
            size: 10,
        },
    });

    const onSubmitValues = (values: any) => {
    // refetch();
    // return onFilter({
    //   searchWord: values.searchWord.trim(),
    //   page: 1,
    //   size: 10,
    };
     const router = useRouter();

    return (
        <form onSubmit={handleSubmit(onSubmitValues)}>
        <div className="grid grid-cols-2 gap-4">
            <InputWrapper
                field="searchWord"
                label="Tìm kiếm chương trình"
                control={control}
                component={(e: any) => (
                <Input
                    showClear
                    autoComplete="off"
                    placeholder="Tên chương trình"
                    size="large"
                    {...e}
                />
                )}
            />

            <InputWrapper
                field="code"
                label="Mã chương trình"
                control={control}
                component={(e: any) => (
                <Input
                    showClear
                    autoComplete="off"
                    placeholder="Mã chương trình"
                    size="large"
                    {...e}
                />
                )}
            />

            <InputWrapper
                field="dateRanges"
                label="Thời gian áp dụng"
                control={control}
                component={(customProps: any) => (
                <CustomMonthRangePicker
                    className="w-full"
                    type="dateTime"
                    placeholder="Ngày"
                    format="dd/MM/yyyy HH:mm:ss"
                    {...customProps}
                    size="large"
                />
                )}
            />
            <InputWrapper
                field="status"
                label="Trạng thái"
                control={control}
                component={(field: any) => (
                <Select size="large" optionList={listStatusBoolean} {...field} />
                )}
            />
            <InputWrapper
                field="dateRanges"
                label="Thời gian tạo"
                control={control}
                component={(customProps: any) => (
                <CustomMonthRangePicker
                    className="w-full"
                    type="dateTime"
                    placeholder="Ngày"
                    format="dd/MM/yyyy HH:mm:ss"
                    {...customProps}
                    size="large"
                />
                )}
            />
            <div className='flex items-center gap-2'>
                <Button
                    icon={<IconFilter />}
                    theme="solid"
                    type="secondary"
                    onClick={() => onSubmitValues(getValues())}
                >
                    Tìm kiếm
                </Button>
                <Button
                size="large"
                theme="solid"
                icon={<IconPlus />}
                  onClick={() => router.push('/invite-friends/referral-program/create-program-invitation')}
              >
                Thiết lập chương trình
              </Button>

            </div>
        </div>
        </form>
    );
}