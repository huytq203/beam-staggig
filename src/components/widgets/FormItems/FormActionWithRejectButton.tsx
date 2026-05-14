import React from 'react';
import { UserRole } from '@constants/auth.constants';
import { Button } from '@douyinfe/semi-ui';
import { ProtectedWrapper } from '../Auth';
export const FormActionWithRejectButton = (props: any) => {
  const {
    onCancel,
    showDoneButton = false,
    onDone,
    doneButtonText = 'Hoàn thành yêu cầu',
    disabled = false,
    onProcess,
    processButtonText = 'Xử lý yêu cầu',
    showProcessButton = false,
    showRejectButton = false,
    rejectButtonText = 'Từ chối yêu cầu',
    onReject,
    loading,
  } = props;
  return (
    <div className="flex gap-4 justify-end">
      <Button type="primary" onClick={onCancel}>
        Quay lại
      </Button>

      {showRejectButton && (
        <>
          <Button
            type="primary"
            theme="solid"
            onClick={onReject}
            className="text-white"
            disabled={disabled}
            loading={loading}
          >
            {rejectButtonText}
          </Button>
        </>
      )}
      {showProcessButton && (
        <>
          <Button
            type="tertiary"
            theme="solid"
            onClick={onProcess}
            className="text-white"
            disabled={disabled}
            loading={loading}
          >
            {processButtonText}
          </Button>
        </>
      )}
      {showDoneButton && (
        <>
          <Button
            type="secondary"
            theme="solid"
            onClick={onDone}
            className="text-white"
            disabled={disabled}
            loading={loading}
          >
            {doneButtonText}
          </Button>
        </>
      )}
    </div>
  );
};
