import { FormActionButton } from '../FormItems';
import { FormActionWithRejectButton } from '../FormItems/FormActionWithRejectButton';
import { ContentWrapper, ContentWrapperProps } from './ContentWrapper';

export interface FormWrapperProps extends ContentWrapperProps {
  onSubmit?: any;
  onCancel?: any;
  showSubmitButton?: any;
  rejectButton?: any;
  onProcess?: any;
  onReject?: any;
  onDone?: any;
  showDoneButton?: any;
  showProcessButton?: any;
  showRejectButton?: any;
  doneButtonText?: any;
  submitButtonText?: any;
  cancelText?: any;
  loading?: any;
}

export const FormWrapper = (props: FormWrapperProps) => {
  const {
    onSubmit,
    onCancel,
    rejectButton = false,
    onProcess,
    submitButtonText,
    cancelText,
    onReject,
    onDone,
    showDoneButton,
    showProcessButton,
    showRejectButton,
    doneButtonText,
    showSubmitButton,
    loading,
  } = props;

  return (
    <form onSubmit={onSubmit} autoComplete="off">
      <ContentWrapper
        {...props}
        extra={
          rejectButton ? (
            <FormActionWithRejectButton
              onCancel={onCancel}
              onProcess={onProcess}
              doneButtonText={doneButtonText}
              onReject={onReject}
              onDone={onDone}
              showDoneButton={showDoneButton}
              showProcessButton={showProcessButton}
              showRejectButton={showRejectButton}
              loading={loading}
            />
          ) : (
            <FormActionButton
              onCancel={onCancel}
              showSubmitButton={showSubmitButton}
              submitButtonText={submitButtonText}
              cancelText={cancelText}
              loading={loading}
            />
          )
        }
      >
        {props.children}
      </ContentWrapper>
    </form>
  );
};
