import { InputWrapper } from '@components/shared';
import { Button, Checkbox, Dropdown } from '@douyinfe/semi-ui';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export const BankTransactionListAction = (props: any) => {
  const { onSubmit, id, bankReverse, updateAmount, updateBeamStatus } = props;
  const [isShowMenu, setIsShowMenu] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      updateBeamStatus: 0,
      updateAmount: 0,
      bankReverse: 0,
    },
  });
  useEffect(() => {
    reset({
      updateBeamStatus: updateBeamStatus,
      updateAmount: updateAmount,
      bankReverse: bankReverse,
    });
  }, []);

  const onClose = () => {
    setIsShowMenu(false);
  };

  const onOpen = () => {
    setIsShowMenu(true);
  };

  const onSubmitForm = (values: any) => {
    onSubmit && onSubmit({ ...values, id: id });
    onClose();
  };
  return (
    <div>
      <Dropdown
        trigger='custom'
        position='bottomLeft'
        visible={isShowMenu}
        onClickOutSide={onClose}
        closeOnEsc={true}
        render={
          <form onSubmit={handleSubmit(onSubmitForm)}>
            <Dropdown.Menu>
              <Dropdown.Item>
                <InputWrapper
                  control={control}
                  errors={errors}
                  field='updateBeamStatus'
                  component={(props: any) => (
                    <Checkbox
                      defaultChecked={updateBeamStatus == 1}
                      onChange={(e: any) => props.onChange(e.target.checked ? 1 : 0)}
                      value={props.value}
                    >
                      Cập nhật trạng thái
                    </Checkbox>
                  )}
                />
              </Dropdown.Item>
              <Dropdown.Item>
                <InputWrapper
                  control={control}
                  errors={errors}
                  field='updateAmount'
                  component={(props: any) => (
                    <Checkbox
                      defaultChecked={updateAmount == 1}
                      onChange={(e: any) => props.onChange(e.target.checked ? 1 : 0)}
                      value={props.value}
                    >
                      Cập nhật số tiền
                    </Checkbox>
                  )}
                />
              </Dropdown.Item>
              <Dropdown.Item>
                <InputWrapper
                  control={control}
                  errors={errors}
                  field='bankReverse'
                  component={(props: any) => (
                    <Checkbox
                      defaultChecked={bankReverse == 1}
                      onChange={(e: any) => props.onChange(e.target.checked ? 1 : 0)}
                      value={props.value}
                    >
                      Ngân hàng truy thu
                    </Checkbox>
                  )}
                />
              </Dropdown.Item>
              <Dropdown.Item>
                <Button htmlType='submit' theme='solid' type='primary' className='w-full'>
                  Cập nhật
                </Button>
              </Dropdown.Item>
            </Dropdown.Menu>
          </form>
        }
      >
        <Button size='small' type='tertiary' onClick={onOpen}>
          Cập nhật
        </Button>
      </Dropdown>
    </div>
  );
};
