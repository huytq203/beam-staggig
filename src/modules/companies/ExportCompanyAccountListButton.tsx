import { ProtectedWrapper } from '@components/widgets/Auth';
import { UserRole } from '@constants/auth.constants';
import { IconDownload, IconChevronDown } from '@douyinfe/semi-icons';
import { Button, Dropdown } from '@douyinfe/semi-ui';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { CompanyService } from '@services/companies';
import DownloadLink from 'react-download-link';
export const ExportCompanyAccountListButton = (props: any) => {
  const { companyData, filterExport } = props;

  const onClickExportData = async () => {
    const downloadData: any = await CompanyService.exportEmployeeFromCompanyId(
      companyData?.id,
      filterExport
    );
    return downloadData;
  };

  // const onClickExportDataOPS = async () => {
  //   const downloadData: any =
  //     await CompanyService.exportEmployeeOPSFromCompanyId(companyData?.id);
  //   return downloadData;
  // };
  return (
    <>
      {/* <ProtectedWrapper
        allowedRoles={[
          UserRole.BEAM_ADMIN,
          UserRole.SUPER_ADMIN,
          UserRole.SALE,
        ]}
      >
        <Dropdown
          // trigger={'click'}
          position={'bottomLeft'}
          render={
            <Dropdown.Menu>
              <Dropdown.Item>
                <DownloadLink
                  style={{
                    textDecoration: 'none',
                  }}
                  label={
                    <>
                      <Button
                        className="decor-none o-underline"
                        theme="solid"
                        type="warning"
                        style={{ backgroundColor: 'rgb(45 212 191)' }}
                        icon={<IconDownload />}
                      >
                        Xuất dữ liệu HR
                      </Button>
                    </>
                  }
                  filename={`${
                    companyData?.shortName
                  }_DS_Nhanvien_${DateTimeHelper.formatDateTime(
                    new Date()
                  )}.xlsx`}
                  exportFile={onClickExportData}
                />
              </Dropdown.Item>
              <Dropdown.Item>
                <DownloadLink
                  style={{
                    textDecoration: 'none',
                  }}
                  label={
                    <>
                      <Button
                        className="decor-none o-underline"
                        theme="solid"
                        type="warning"
                        icon={<IconDownload />}
                        style={{ backgroundColor: 'rgb(16 185 129)' }}
                      >
                        Xuất dữ liệu OPS
                      </Button>
                    </>
                  }
                  filename={`${
                    companyData?.shortName
                  }_DS_Nhanvien_OPS_${DateTimeHelper.formatDateTime(
                    new Date()
                  )}.xlsx`}
                  exportFile={onClickExportDataOPS}
                />
              </Dropdown.Item>
            </Dropdown.Menu>
          }
        >
          <div data-testid={'add'}>
            <Button
              theme="solid"
              type="warning"
              icon={<IconChevronDown />}
              iconPosition="right"
            >
              Xuất dữ liệu
            </Button>
          </div>
        </Dropdown>
      </ProtectedWrapper> */}
      <ProtectedWrapper
        allowedRoles={[
          UserRole.HR_ADMIN,
          UserRole.BEAM_ADMIN,
          UserRole.SUPER_ADMIN,
          UserRole.CUSTOMER_SERVICE,
        ]}
      >
        <DownloadLink
          style={{
            textDecoration: 'none',
          }}
          label={
            <>
              <Button
                className="decor-none o-underline"
                theme="solid"
                type="warning"
                icon={<IconDownload />}
              >
                Xuất dữ liệu
              </Button>
            </>
          }
          filename={`${
            companyData?.shortName
          }_DS_Nhanvien_${DateTimeHelper.formatDateTime(new Date())}.xlsx`}
          exportFile={onClickExportData}
        />
      </ProtectedWrapper>
    </>
  );
};
