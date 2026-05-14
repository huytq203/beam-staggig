import { WidgetContext } from './WidgetContext';
import LoadingIcon from '../../../public/icons/loadingIcon.svg';
import LogoLoading from '../../../public/img/LogoLoading.svg';
import { useState } from 'react';

export const WidgetProvider = ({ children }: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const checkLoadingComponent = async (loading: any) => setIsLoading(loading);

  return (
    <WidgetContext.Provider
      value={{
        checkLoadingComponent: checkLoadingComponent,
      }}
    >
      <>
        <div className={`${isLoading ? '' : 'hidden'}`}>
          <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-black bg-opacity-50 flex flex-col items-center justify-center transition-opacity">
            <div>
              <img
                className="w-20 h-20 animate-spin"
                src={LoadingIcon.src}
                alt="Loading icon"
              />
            </div>
            <img
              className="w-[600px] h-20"
              src={LogoLoading.src}
              alt="Loading logo"
            />
          </div>
        </div>
        <div>{children}</div>
      </>
    </WidgetContext.Provider>
  );
};
