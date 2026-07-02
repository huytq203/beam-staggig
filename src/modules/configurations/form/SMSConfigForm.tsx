import { InputWrapper } from '@components/shared/InputWrapper'
import {
  Card,
  Checkbox,
  Divider,
  InputNumber,
  Radio,
  Switch,
  TabPane,
  Tabs,
} from '@douyinfe/semi-ui'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { ListAccount } from '../ListAccount'

export const SMSConfigForm = () => {
  const {
    control,
    handleSubmit,
    watch,
    reset,
    getValues,
    formState: { errors },
  } = useForm({})

  useEffect(() => {
    const followCustom = watch('followCustom')
    if (followCustom) {
      reset({
        ...getValues(),
        followPermission: false,
      })
    }
  }, [watch('followCustom')])

  useEffect(() => {
    const followCustom = watch('followPermission')
    if (followCustom) {
      reset({
        ...getValues(),
        followCustom: false,
      })
    }
  }, [watch('followPermission')])

  const NotificationConfigForm = () => (
    <div className="flex flex-col gap-4 py-4">
      <div className="flex gap-4">
        <InputWrapper
          required
          field="followPermission"
          label="Theo quyền"
          component={(props: any) => <Radio {...props} />}
          errors={errors}
          control={control}
          labelPosition="right"
        />

        <InputWrapper
          required
          field="employeeId"
          label="Beam Admin"
          component={(props: any) => <Checkbox {...props} />}
          errors={errors}
          control={control}
          labelPosition="right"
        />

        <InputWrapper
          required
          field="employeeId"
          label="HR Admin"
          component={(props: any) => <Checkbox {...props} />}
          errors={errors}
          control={control}
          labelPosition="right"
        />

        <InputWrapper
          required
          field="employeeId"
          label="Kế toán"
          component={(props: any) => <Checkbox {...props} />}
          errors={errors}
          control={control}
          labelPosition="right"
        />
      </div>
      <div className="flex">
        <InputWrapper
          required
          field="followCustom"
          label="Tuỳ chỉnh"
          component={(props: any) => <Radio {...props} />}
          errors={errors}
          control={control}
          labelPosition="right"
        />
      </div>
      <div>
        <Divider dashed />
        <ListAccount />
      </div>
      <div>
        <InputWrapper
          field="employeeId"
          label="Kích hoạt"
          component={(props: any) => <Switch {...props} />}
          errors={errors}
          control={control}
          labelPosition="left"
          align="center"
        />
      </div>
    </div>
  )
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <div className="flex flex-col gap-4">
          <InputWrapper
            required
            field="employeeId"
            label="Ngưỡng cảnh báo"
            component={(props: any) => <InputNumber {...props} />}
            errors={errors}
            control={control}
          />
          <div className="grid grid-cols-2">
            <InputWrapper
              required
              field="employeeId"
              label="Nhắc lại cảnh báo"
              component={(props: any) => <Checkbox {...props} />}
              errors={errors}
              control={control}
            />
            <InputWrapper
              required
              field="employeeId"
              label="Kích hoạt"
              component={(props: any) => <Switch {...props} />}
              errors={errors}
              control={control}
            />
          </div>
        </div>
      </Card>
      <Card className="flex flex-col gap-4">
        <Tabs type="line">
          <TabPane tab="SMS Config" itemKey="1">
            <NotificationConfigForm />
          </TabPane>
          <TabPane tab="Email Config" itemKey="2">
            <NotificationConfigForm />
          </TabPane>
          <TabPane tab="Notification Config" itemKey="3">
            <NotificationConfigForm />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  )
}
