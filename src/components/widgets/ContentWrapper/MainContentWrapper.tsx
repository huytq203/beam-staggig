import React from 'react';
import NotFound from '../Layouts/NotFound/NotFound';

export interface MainContentProps {
  data: any;
  children: any;
  isLoading?: boolean;
  isNew?: boolean;
}

export const MainContentWrapper = (props: MainContentProps) => {
  const { children, data, isLoading, isNew } = props;

  if (isNew || data) return <>{children}</>;
  if (!data)
    return (
      <React.Fragment>
        <NotFound />
      </React.Fragment>
    );
  // if (!data && !isLoading && !isNew)
  //   return (
  //     <React.Fragment>
  //       <NotFound />
  //     </React.Fragment>
  //   );
  return <React.Fragment />;
};
