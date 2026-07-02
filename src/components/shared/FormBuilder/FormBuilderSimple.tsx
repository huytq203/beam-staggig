import { Input, Row } from '@douyinfe/semi-ui'
import { Controller } from 'react-hook-form'

export const FormBuilderSimple = (props: any) => {
  const { formRenderItems, currentFormState = 'new', control, errors } = props
  return (
    <>
      {formRenderItems
        .filter((x: any) => x[currentFormState])
        .map((item: any) => (
          <Row className="pb-5">
            <Controller
              name={item.key}
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-2">
                  <div>
                    <label>
                      {item.label}{' '}
                      {item?.required && (
                        <span className="text-red-500 text-xs">*</span>
                      )}
                    </label>
                  </div>
                  {item.render ? (
                    item.render(field)
                  ) : (
                    <Input required={true} showClear {...field} />
                  )}
                  {errors[item.key] && (
                    <p className="text-red-500">{errors[item.key].message}</p>
                  )}
                </div>
              )}
            />
          </Row>
        ))}
    </>
  )
}
