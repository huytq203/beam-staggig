import { Spin } from '@douyinfe/semi-ui';

export const SpinWrapper = (props: any) => {
  const { children, spinning = false, size = 'large' } = props;
  return (
    <>
      <Spin spinning={spinning} size={size}>
        {children}
      </Spin>
    </>
  );
};
