import { FormActionButton } from '@components/widgets';
import { Modal, Notification, Spin } from '@douyinfe/semi-ui';
import { CompanyList } from '@modules/companies';
import { CompanyFeePolicyService } from '@services/company-fee';
import { FeePolicyService } from '@services/fee-policy';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { useFieldArray, useForm } from 'react-hook-form';
import { useAuth } from '@contexts/authentication';
import { UserRole } from '@constants/auth.constants';
export const FeePolicyAssignForm = (props: any) => {
  const { feePolicyId, onCancel } = props;
  const router = useRouter();
  const feePolicyIdData = feePolicyId ? feePolicyId : router.query.id;
  const { authCheckByRole } = useAuth();
  authCheckByRole([
    UserRole.BEAM_ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.CUSTOMER_SERVICE,
  ]);
  const isNew = true;
  const [loading, setLoading] = useState(false);
  const { data, isLoading, isFetching, refetch } = useQuery(
    ['fee-policy', feePolicyIdData],
    () => FeePolicyService.getListAssignedCompany(feePolicyIdData),
    {
      // enabled: !isLoading,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
    }
  );
  const {
    control,
    handleSubmit,
    reset,
    watch,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      toCompany: [],
    } as any,
  });
  useEffect(() => {
    if (!isLoading) {
      const companyIds = data?.map((x: any) => x.id);
      reset({
        ...data?.data,
        toCompany: companyIds,
      });
    }
  }, [isLoading, isFetching]);

  const { append, remove } = useFieldArray({
    control,
    name: 'toCompany',
  } as any);

  const onSelectCompany = (companyId: any) => {
    remove();
    append(companyId);
  };
  const onSubmitAssign = (values: any) => {
    setLoading(true);

    const companyIds = values.toCompany.map((x: any) => {
      return x;
    });

    const assignRequest = {
      companyIds: companyIds,
      feePolicyId: feePolicyIdData,
    };
    FeePolicyService.getCompaniesOverlapFP(assignRequest).then((x: any) => {
      if (x.length > 0) {
        Modal.confirm({
          title: 'Xác nhận hành động',
          cancelText: 'Quay lại',
          okText: 'Tiếp tục',
          onOk: async () => {
            CompanyFeePolicyService.assignToCompanies(assignRequest).then(
              (x: any) => {
                if (x) {
                  Notification.success({
                    content: `Gán chính sách phí thành công!`,
                    theme: 'light',
                  });
                  onCancel && onCancel();
                }
              }
            );
          },
          onCancel: () => setLoading(false),
          content: (
            <div>
              <div>
                Có một số doanh nghiệp bị trùng thời gian với chính sách phí
                khác. Bạn có muốn dừng và áp dụng chính sách mới cho tất cả
                doanh nghiệp vừa chọn không?
              </div>
              <div>
                <p className="m-2">Các doanh nghiệp bị trùng thời gian:</p>
                {x.map((company: any) => (
                  <p className="m-2">- {company.name}</p>
                ))}
              </div>
            </div>
          ),
        });
      } else {
        setLoading(true);
        CompanyFeePolicyService.assignToCompanies(assignRequest).then(
          (x: any) => {
            if (x) {
              Notification.success({
                content: `Gán chính sách phí thành công!`,
                theme: 'light',
              });
              onCancel && onCancel();
            } else {
              Notification.error({
                content: `Gán chính sách phí thất bại!`,
                theme: 'light',
              });
              setLoading(false);
            }
            setLoading(false);
          }
        );
      }
    });
  };

  const rowSelection = {
    selectedRowKeys: watch('toCompany'),
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      onSelectCompany(selectedRowKeys);
    },
  };
  return (
    <div>
      <Spin spinning={loading} size="large">
        <form onSubmit={handleSubmit(onSubmitAssign)}>
          <div>
            <CompanyList
              showActionButton={false}
              rowSelection={rowSelection}
              size={5}
            />
            <FormActionButton
              submitButtonText="Áp dụng"
              onCancel={onCancel}
              loading={loading}
            />
          </div>
        </form>
      </Spin>
    </div>
  );
};
