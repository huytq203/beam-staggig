import { RowWrapper } from '@components/widgets'
import { InputWrapper } from '../InputWrapper'
import { FormBuilderItem, FormBuilderOption } from './types'

export interface FormBuilderProps {
  itemOptions: FormBuilderOption[]
  control: any
  errors: any
}

export const FormBuilder = (props: FormBuilderProps) => {
  const { itemOptions, control, errors } = props

  const renderComponent = (item: FormBuilderItem) => {
    const {
      name,
      label,
      required,
      component,
      customProps,
      isCustomRender,
      labelPosition,
      displayConditions,
    } = item

    const T = component

    const conditionPass = displayConditions?.findIndex((x: any) => x == false)

    if (displayConditions?.length && conditionPass != -1) {
      return <></>
    }

    return (
      <InputWrapper
        key={name}
        required={required}
        field={name}
        label={label}
        control={control}
        errors={errors}
        labelPosition={labelPosition}
        component={(renderProps: any) => {
          if (isCustomRender) {
            return component(renderProps)
          }
          return <T {...customProps} {...renderProps} />
        }}
      />
    )
  }

  const render = () => {
    return (
      <>
        {itemOptions.map((itemOptions: FormBuilderOption, key: number) => (
          <RowWrapper key={key} cols={itemOptions?.cols}>
            {itemOptions.items.map((x: FormBuilderItem, keyY: any) => (
              <div key={keyY}>{renderComponent(x)}</div>
            ))}
          </RowWrapper>
        ))}
      </>
    )
  }

  return <>{render()}</>
}
