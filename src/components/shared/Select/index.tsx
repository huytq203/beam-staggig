import { Select } from '@douyinfe/semi-ui'
import { SelectProps } from '@douyinfe/semi-ui/lib/es/select'
import { forwardRef } from 'react'

interface CustomSelectProps extends SelectProps {
  allSelectValue?: boolean
}

export const CustomSelect = forwardRef<any, CustomSelectProps>((props, ref) => {
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
      ref={ref}
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
})
CustomSelect.displayName = 'CustomSelect'
