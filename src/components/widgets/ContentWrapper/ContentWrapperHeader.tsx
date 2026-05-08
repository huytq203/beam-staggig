import { UserRole } from '@constants/auth.constants';
import { IconDelete, IconPlus } from '@douyinfe/semi-icons';
import { Button } from '@douyinfe/semi-ui';
import { ProtectedWrapper } from '../Auth';

export interface ContentWrapperHeaderProps {
  pageTitle?: string;
  extraRight?: any;
  primaryButtonText?: string;
  onClickPrimaryButton?: any;
  showPrimaryButton?: boolean;
  secondaryButtonText?: string;
  onClickSecondaryButton?: any;
  showSecondaryButton?: boolean;
  extra?: any;
  allowedRoles?: any;
}

export const ContentWrapperHeader = ({
  pageTitle,
  primaryButtonText,
  onClickPrimaryButton,
  secondaryButtonText,
  onClickSecondaryButton,
  extra,
  allowedRoles = [UserRole.BEAM_ADMIN, UserRole.SUPER_ADMIN],
}: ContentWrapperHeaderProps) => {
  return (
    <div className="flex justify-between items-center border border-b-2">
      <span className="font-bold text-2xl">{pageTitle}</span>
      <div className="flex gap-2 items-center">
        {extra && <>{extra}</>}
        {secondaryButtonText != null && (
          <Button type="primary" onClick={onClickSecondaryButton}>
            {secondaryButtonText}
          </Button>
        )}

        {primaryButtonText != null && (
          <ProtectedWrapper allowedRoles={allowedRoles}>
            <Button
              theme="solid"
              onClick={onClickPrimaryButton}
              icon={<IconPlus />}
            >
              {primaryButtonText}
            </Button>
          </ProtectedWrapper>
        )}
      </div>
    </div>
  );
};
