import { FormBuilderSimple } from '@components/shared';
import { Button, Divider, Notification, Switch } from '@douyinfe/semi-ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { CompanyService } from '@services/companies';
import { UserSevice } from '@services/users';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CreateAccount } from 'validations/creatAccount.schema';

export const CreateAccountForm = (props: any) => {
  const [listCompanies, setListCompanies] = useState([]);
  const { userData } = props;
  const router = useRouter();

  const formRenderItems = [
    {
      key: 'username',
      label: 'Tên tài khoản',
      new: true,
      edit: false,
      required: true,
    },
    {
      key: 'email',
      label: 'Email',
      new: true,
      edit: false,
      required: true,
    },
    {
      label: 'Tên đầy đủ',
      key: 'fullName',
      new: true,
      edit: true,
      required: true,
    },
    {
      key: 'phoneNumber',
      label: 'Số điện thoại',
      new: true,
      edit: true,
    },
    {
      key: 'enabled',
      label: 'Trạng thái',
      new: true,
      edit: true,
      render: (field: any) => {
        return <Switch {...field} checked={field.value} />;
      },
    },
  ];

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(CreateAccount),
    defaultValues: {
      username: userData?.username,
      email: userData?.email,
      fullName: userData?.fullName,
      phoneNumber: userData?.phoneNumber,
      // company: userData?.company,
      enabled: userData?.enabled,
    },
  });

  const onSubmitValues = (values: any) => {
    // const payload = {
    //   username: values.username,
    //   email: values.email,
    //   fullName: values.fullName,
    //   phoneNumber: values.phoneNumber,
    //   company: values.company,
    //   enabled: values.enabled,
    // }
    // UserSevice.addOrUpdateUser(payload, userData?.id)
    //   .then((response) => {
    //     if (response) {
    //       if (response.data.message == 'OK') {
    //         Notification.success({
    //           content: 'Creat account successfully',
    //           theme: 'light',
    //         })
    //         router.push('/accounts')
    //       } else {
    //         Notification.error({
    //           content: response.data.message,
    //           theme: 'light',
    //         })
    //       }
    //     }
    //   })
    //   .catch((err) => {
    //     Notification.error({ content: 'Some thing wrong', theme: 'light' })
    //   })
  };

  useEffect(() => {
    CompanyService.getAll({}).then((response: any) => {
      const dataResponse = response?.content;
      const dataX = dataResponse?.map((cur: any) => {
        return {
          value: cur.id,
          label: cur.name,
        };
      });
      setListCompanies(dataX);
    });
  }, []);

  const currentFormState = userData ? 'edit' : 'new';

  return (
    <form onSubmit={handleSubmit(onSubmitValues)}>
      <FormBuilderSimple
        formRenderItems={formRenderItems}
        currentFormState={currentFormState}
        control={control}
        errors={errors}
      />

      <Divider dashed />

      <div className="w-full py-4">
        <div className="flex items-center gap-4 justify-end">
          <Button type="primary" theme="solid" htmlType="submit">
            Gửi
          </Button>
          <Button type="primary" onClick={() => router.push('/employees')}>
            Huỷ
          </Button>
        </div>
      </div>
    </form>
  );
};
