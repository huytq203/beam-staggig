import {
  ContentWrapperHeader,
  ContentWrapperHeaderProps,
} from './ContentWrapperHeader';

export interface ContentWrapperProps extends ContentWrapperHeaderProps {
  children?: any;
  headerRender?: any;
  loading?: any;
}

export const ContentWrapper = (props: ContentWrapperProps) => {
  const {
    pageTitle,
    primaryButtonText,
    onClickPrimaryButton,
    showPrimaryButton,
    secondaryButtonText,
    onClickSecondaryButton,
    showSecondaryButton,
    children,
    extra,
    headerRender,
    allowedRoles,
  } = props;
  return (
    <>
      <div className="p-4 flex flex-col gap-6">
        {!headerRender && (
          <ContentWrapperHeader
            pageTitle={pageTitle}
            primaryButtonText={primaryButtonText}
            showPrimaryButton={showPrimaryButton}
            onClickPrimaryButton={onClickPrimaryButton}
            secondaryButtonText={secondaryButtonText}
            showSecondaryButton={showSecondaryButton}
            onClickSecondaryButton={onClickSecondaryButton}
            extra={extra}
            allowedRoles={allowedRoles}
          />
        )}

        {headerRender && <>{headerRender}</>}

        <div className="bg-white border-none rounded-lg shadow-md overflow-auto p-5">
          {children}
        </div>
      </div>
    </>
  );
};
