import { FormActionButton } from './FormActionButton';

export interface FormWrapperProps2 {
  children: any;
  onSubmit: any;
  onCancel: any;
  title?: string;
  loading?: boolean;
}

export const FormWrapper2 = (props: FormWrapperProps2) => {
  const { title, children, onSubmit, onCancel, loading } = props;
  if (loading) return <></>;
  return (
    <>
      <form onSubmit={onSubmit}>
        <div className="flex flex-col gap-4">
          {title && <div className="font-bold text-xl">{title}</div>}
          {children}
          <FormActionButton onCancel={onCancel} />
        </div>
      </form>
    </>
  );
};
