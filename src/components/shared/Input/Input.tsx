import { Input as SemiInput } from '@douyinfe/semi-ui'
import { InputProps } from '@douyinfe/semi-ui/lib/es/input'
export interface CustomInputProps extends InputProps {}
export const Input = (props: CustomInputProps) => {
  return <SemiInput {...props} />
}
