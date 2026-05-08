import { Select } from '@douyinfe/semi-ui'
import { SelectProps } from '@douyinfe/semi-ui/lib/es/select'

interface CustomSelectProps extends SelectProps {
  allSelectValue?: boolean
}

export const CustomSelect = (props: CustomSelectProps) => {
  const { allSelectValue, optionList, value = [] as any, onChange } = props

  const getSelectOptions = (): any => {
    const hasSelectAll = value.includes(allSelectValue)
    return optionList?.map((option: any) => {
      return {
        ...option,
        disabled: option.value != allSelectValue && hasSelectAll == true,
      }
    })
  }
  return (
    <Select
      multiple
      {...props}
      onChange={(e: any) => {
        let values = e
        if (e.includes(allSelectValue)) {
          values = [allSelectValue]
        }
        onChange && onChange(values)
      }}
      optionList={getSelectOptions()}
    />
  )
}
