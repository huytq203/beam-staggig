export type FormBuilderOption = {
  cols: number
  items: FormBuilderItem[]
}

export type FormBuilderItem = {
  name: string
  label?: string
  required?: boolean
  component: 'select' | 'input' | any
  isCustomRender?: boolean
  customProps?: any
  labelPosition?: 'top' | 'right' | 'left' | 'bottom'
  displayConditions?: boolean[]
}
