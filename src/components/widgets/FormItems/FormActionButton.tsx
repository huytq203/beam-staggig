import { UserRole } from '@constants/auth.constants';
import { Button } from '@douyinfe/semi-ui';
import { ProtectedWrapper } from '../Auth';

export const FormActionButton = (props: any) => {
  const {
    onCancel,
    showSubmitButton = true,
    onSubmit,
    submitButtonText = 'Lưu thông tin',
    cancelText = 'Huỷ',
    disabled = false,
    loading,
  } = props;
  return (
    <div className="flex gap-4 justify-end">
      <Button type="primary" onClick={onCancel}>
        {cancelText}
      </Button>

      {showSubmitButton && (
        <>
          <ProtectedWrapper
            allowedRoles={[
              UserRole.BEAM_ADMIN,
              UserRole.SUPER_ADMIN,
              UserRole.ACCOUNTANT,
              UserRole.HR_ADMIN,
              UserRole.CUSTOMER_SERVICE,
              UserRole.SALE,
            ]}
          >
            <Button
              type="primary"
              theme="solid"
              onClick={onSubmit}
              htmlType={!onSubmit ? 'submit' : 'button'}
              className="text-white"
              disabled={disabled}
              loading={loading}
            >
              {submitButtonText}
            </Button>
          </ProtectedWrapper>
        </>
      )}
    </div>
  );
};
