import { UserRole } from '@constants/auth.constants';
import { IconDelete, IconImport, IconPlus } from '@douyinfe/semi-icons';
import { Button } from '@douyinfe/semi-ui';
import { ProtectedWrapper } from '../Auth';

export interface CardActionTitleProps {
  showDelete?: boolean;
  showAdd?: boolean;
  showImport?: boolean;
  textDelete?: string;
  textAdd?: string;
  textImport?: string;
  title: string;
  onDelete?: () => void;
  onAdd?: any;
  onImport?: () => void;
  extra?: any;
  allowedRoles?: any;
}

export const CardActionTitle = ({
  showDelete = true,
  showAdd = true,
  showImport = false,
  textAdd = 'Add',
  textDelete = 'Delete',
  textImport = 'Import',
  onAdd,
  onDelete,
  onImport,
  title,
  extra,
  allowedRoles = [UserRole.BEAM_ADMIN, UserRole.SUPER_ADMIN],
}: CardActionTitleProps) => {
  return (
    <div className="flex justify-between items-center border border-b-2">
      <span className="font-bold text-2xl">{title}</span>
      <div className="flex gap-2 items-center">
        {extra && <>{extra}</>}
        {showDelete && (
          <Button
            theme="solid"
            type="danger"
            onClick={onDelete}
            icon={<IconDelete />}
          >
            {textDelete}
          </Button>
        )}

        {showAdd && (
          <ProtectedWrapper allowedRoles={allowedRoles}>
            <Button theme="solid" onClick={onAdd} icon={<IconPlus />}>
              {textAdd}
            </Button>
          </ProtectedWrapper>
        )}

        {showImport && (
          <Button
            theme="solid"
            type="secondary"
            onClick={onImport}
            icon={<IconImport />}
          >
            {textImport}
          </Button>
        )}
      </div>
    </div>
  );
};
