import { Button } from '@douyinfe/semi-ui'

export interface FormActionButtonProps {
  showSubmitButton?: boolean
  submitButtonText?: string
  showCancelButton?: boolean
  cancelButtonText?: string
  position?: 'end' | 'start' | 'center'
  onCancel?: () => void
  onSubmit?: () => void
}
export const FormActionButton = (props: FormActionButtonProps) => {
  const {
    showSubmitButton = true,
    submitButtonText = 'Gửi',
    showCancelButton = true,
    cancelButtonText = 'Huỷ',
    position = 'end',
    onCancel,
    onSubmit,
  } = props
  return (
    <div className="w-full py-4">
      <div className={`flex items-center gap-4 justify-${position}`}>
        {showSubmitButton && !onSubmit && (
          <Button type="primary" theme="solid" htmlType="submit">
            {submitButtonText}
          </Button>
        )}

        {showSubmitButton && onSubmit && (
          <Button type="primary" theme="solid" onClick={onSubmit}>
            {submitButtonText}
          </Button>
        )}
        {showCancelButton && (
          <Button type="primary" onClick={onCancel}>
            {cancelButtonText}
          </Button>
        )}
      </div>
    </div>
  )
}
