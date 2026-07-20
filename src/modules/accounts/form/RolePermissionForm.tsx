import { InputWrapper } from '@components/shared';
import { FormActionButton } from '@components/widgets';
import { Notification, Select, Switch } from '@douyinfe/semi-ui';
import { FunctionBase } from '@helpers/fuction-base.helpers';
import { CompanyService } from '@services/companies';
import { UserSevice } from '@services/users';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export const RolePermissionForm = (props: any) => {
  const { userData, roles, userCompany } = props;
  const router = useRouter();
  const [listCompanies, setListCompanies] = useState([]);

  const isHasRoles = (role: any) => {
    return roles.includes(role);
  };

  useEffect(() => {
    CompanyService.getAll({
      size: 1000,
    }).then((response: any) => {
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

  const {
    register,
    control,
    handleSubmit,
    watch,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      companyId: userCompany?.companyId,
      beam_admin: isHasRoles('beam_admin'),
      hr: isHasRoles('hr'),
    },
  });

  const onSubmitValues = (values: any) => {
    let roles: any = [];
    if (getValues('beam_admin')) {
      roles.push('beam_admin');
    }

    if (getValues('hr')) {
      roles.push('hr');
    }

    return UserSevice.assignRole(userData?.id, {
      roles: roles,
    })
      .then((response) => {
        if (response) {
          if (response.data.message == 'OK') {
            Notification.success({
              content: 'Assign roles successfully',
              theme: 'light',
            });

            if (getValues('hr')) {
              const companyId = getValues('companyId');
              CompanyService.assignHR(companyId, userData?.id);
            }

            router.push('/accounts');
          } else {
            Notification.error({
              content: response.data.message,
              theme: 'light',
            });
          }
        }
      })
      .catch((err) => {
        Notification.error({ content: 'Some thing wrong', theme: 'light' });
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmitValues)}>
      <div className="flex gap-4">
        <InputWrapper
          required
          field="beam_admin"
          label="Beam Admin"
          labelPosition="right"
          component={(props: any) => (
            <Switch checked={props.value} {...props} />
          )}
          errors={errors}
          control={control}
        />
        <InputWrapper
          required
          field="hr"
          label="HR"
          labelPosition="right"
          component={(props: any) => (
            <Switch checked={props.value} {...props} />
          )}
          errors={errors}
          control={control}
        />
      </div>

      {watch('hr') && listCompanies.length > 0 && (
        <div className="mt-4">
          <InputWrapper
            required
            field="companyId"
            label="Chọn doanh nghiệp"
            component={(props: any) => (
              <Select
                filter={FunctionBase.customSelectFilterOption}
                placeholder="Chọn doanh nghiệp"
                className="w-full"
                {...props}
              >
                {listCompanies?.map((company: any) => (
                  <Select.Option value={company.value}>
                    {company.label}
                  </Select.Option>
                ))}
              </Select>
            )}
            errors={errors}
            control={control}
          />
        </div>
      )}

      <FormActionButton
        onCancel={() => router.push('/accounts')}
        loading={isSubmitting}
      />
    </form>
  );
};
