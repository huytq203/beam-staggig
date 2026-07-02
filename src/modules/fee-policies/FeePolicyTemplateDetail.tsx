import { FormActionButton } from '@components/widgets';
import { Divider, Tag } from '@douyinfe/semi-ui';
import { StringHelper } from '@helpers/string.helper';
import { FeePolicyTemplateService } from '@services/fee-policy-templates';
import { useQuery } from 'react-query';
import { useAuth } from '@contexts/authentication';
import { useEffect } from 'react';
import { RangeComponent } from '@components/shared';
export const FeePolicyTemplateDetail = (props: any) => {
  const { onCancel, feePolicyId, onEdit, setCheckData } = props;
  const { profile }: any = useAuth();
  const { data, isFetching, isLoading, error, isError } = useQuery(
    'fee_policy_detail',
    () => FeePolicyTemplateService.getFeePolicy(feePolicyId),
    {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
    }
  );
  useEffect(() => {
    if (!data && !isLoading) {
      setCheckData(false);
    }
  }, [isLoading]);
  if (isLoading) return <></>;

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="grid grid-cols-2 gap-4">
        <span>Tên chính sách phí</span>
        <span className="font-semibold">{data?.name}</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <span>Loại chính sách phí</span>
        <span className="font-semibold">
          {data?.feeType == 0 ? 'Phí cố định' : 'Phí theo khoảng'}
        </span>
      </div>

      {data?.feeType == 0 && (
        <div className="grid grid-cols-2 gap-4">
          <span>Giá trị</span>
          <span className="font-semibold">
            {data?.feeRangeType[0] == 0
              ? StringHelper.formatVND(data?.feeValue[0])
              : data?.feeValue[0]}{' '}
            {data?.feeRangeType[0] == 0 ? '' : '%'}
          </span>
        </div>
      )}
      {data?.feeType == 0 && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <span>Giá trị tối thiểu</span>
            <span className="font-semibold">
              {data?.feeRangeType[0] == 1 && data?.applyLowerFeeLimit
                ? StringHelper.formatVND(data?.lowerFeeLimit)
                : '-'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <span>Giá trị tối đa</span>
            <span className="font-semibold">
              {data?.feeRangeType[0] == 1 && data?.applyUpperFeeLimit
                ? StringHelper.formatVND(data?.upperFeeLimit)
                : '-'}
            </span>
          </div>
        </>
      )}

      {data?.feeType == 1 && (
        <div className="grid grid-cols-2 gap-4">
          <span>Giá trị</span>
          <RangeComponent
            feeRange={data?.feeRange}
            feeRangeType={data?.feeRangeType}
            feeValue={data?.feeValue}
          />
        </div>
      )}

      <Divider dashed />

      {data?.feeType == 1 && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <span>Thiết lập giá trị tối đa</span>
            <span className="font-semibold">
              {data?.applyUpperFeeLimit
                ? StringHelper.formatVND(data?.upperFeeLimit)
                : 'Không thiết lập'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <span>Thiết lập giá trị tối thiểu</span>
            <span className="font-semibold">
              {data?.applyLowerFeeLimit
                ? StringHelper.formatVND(data?.lowerFeeLimit)
                : 'Không thiết lập'}
            </span>
          </div>
        </>
      )}

      <div className="grid grid-cols-2 gap-4">
        <span>
          Tỉ lệ chia sẻ phí ({data?.feeSharingType == 0 ? 'VNĐ' : '%'})
        </span>
        <span className="font-semibold">
          {data?.feeSharingType == 0
            ? 'Cố định'
            : data?.feeSharingType == 1
            ? 'Theo tỉ lệ (%)'
            : 'Phí cố định theo %'}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <span>- Doanh Nghiệp trả</span>
        <span className="font-semibold">
          {data?.feeSharingType == 0
            ? StringHelper.formatVND(data?.feeSharingValue)
            : data?.feeSharingValue}{' '}
          {data?.feeSharingType == 0 ? '' : '%'}
        </span>
      </div>
      {data?.feeSharingType !== 0 && (
        <div className="grid grid-cols-2 gap-4">
          <span>- Người lao động trả</span>
          <span className="font-semibold">
            {data?.feeSharingType == 1
              ? 100 - data?.feeSharingValue
              : (data?.feeValue[0] * 10 - data?.feeSharingValue * 10) / 10}{' '}
            %
          </span>
        </div>
      )}
      <Divider dashed />
      <div className="grid grid-cols-2 gap-4">
        <span>Mô tả</span>
        <span>{data?.description}</span>
      </div>
      <Divider dashed />
      <div className="grid grid-cols-2 gap-4">
        <span>Trạng thái</span>
        {data?.status == 2 && (
          <Tag size="large" color="green">
            Nháp
          </Tag>
        )}

        {data?.status == 0 && (
          <Tag size="large" color="green">
            Hoạt động
          </Tag>
        )}

        {data?.status == 1 && (
          <Tag size="large" color="red">
            Không hoạt động
          </Tag>
        )}
      </div>
      <Divider dashed />
      <FormActionButton
        onSubmit={onEdit}
        submitButtonText="Chỉnh sửa"
        onCancel={onCancel}
        showSubmitButton={
          profile?.roles[0] === 'beam_admin' ||
          profile?.roles[0] === 'super_admin'
        }
        cancelText="Quay lại"
      />
    </div>
  );
};
