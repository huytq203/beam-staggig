export const AuthCard = (props: any) => {
  const { title, description, children } = props;
  return (
    <div className='w-full pt-12'>
      <div className='text-2xl font-bold text-main'>{title}</div>
      <div className='font-normal mt-4 pb-6'>{description}</div>
      {children}
    </div>
  );
};
