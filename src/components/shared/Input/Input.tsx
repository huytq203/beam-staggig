import { Input as SemiInput } from '@douyinfe/semi-ui'
import { InputProps } from '@douyinfe/semi-ui/lib/es/input'
import { forwardRef } from 'react'

export interface CustomInputProps extends InputProps {}
export const Input = forwardRef<any, CustomInputProps>((props, ref) => {
  return <SemiInput {...props} ref={ref} />
})
Input.displayName = 'Input'
