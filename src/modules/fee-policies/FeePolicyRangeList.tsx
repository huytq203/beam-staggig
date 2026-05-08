import { InputWrapper } from '@components/shared';
import { Button, Card, Checkbox, Switch } from '@douyinfe/semi-ui';
import { useState } from 'react';
import { FeeRangeListRow } from './FeeRangeListRow';

export const FeePolicyRangeList = (props: any) => {
  const [limitRange, setLimitRange] = useState(false);
  const {
    data = [],
    onClickAddMoreRange,
    errors,
    watch,
    control,
    validateStatus,
    onRemoveRangeValue,
    showAddMoreButton = true,
    showRemoveButton = true,
  } = props;
  if (!data.length) {
    return <Button onClick={onClickAddMoreRange}>Thêm phạm vi mới +</Button>;
  }
  return (
    <Card
      style={{
        borderColor: validateStatus == 'error' ? 'red' : '',
      }}
    >
      <div className={`flex flex-col gap-2 items-center`}>
        {data.map((x: any, idx: any) => (
          <FeeRangeListRow
            key={x.uuid}
            isFirst={idx == 0}
            isLast={idx == data.length - 1}
            errors={errors}
            control={control}
            index={idx}
            noLimitUpper={watch('noLimitUpper')}
            data={x}
            next={idx != data.length - 1 ? data[idx + 1] : 0}
            prev={idx > 0 ? data[idx - 1] : 0}
            onRemove={onRemoveRangeValue}
            watch={watch}
            isRemovable={!(data.length > 2)}
            showRemoveButton={showRemoveButton}
            finalLimit={watch('finalLimit')}
          />
        ))}

        {/* {!watch('noLimitUpper') && ( */}
        {showAddMoreButton && (
          <>
            <div className="flex gap-4 w-full">
              <InputWrapper
                required
                field="finalLimit"
                label="Mức cuối"
                component={(props: any) => (
                  <Switch {...props} checked={props.value} />
                )}
                errors={errors}
                control={control}
              />
            </div>
            <Button
              disabled={watch('finalLimit') === true}
              onClick={onClickAddMoreRange}
            >
              Thêm nhiều hơn +
            </Button>
          </>
        )}
        {/* )} */}
      </div>
    </Card>
  );
};
