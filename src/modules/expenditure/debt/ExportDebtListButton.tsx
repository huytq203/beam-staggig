import { ProtectedWrapper } from '@components/widgets/Auth';
import { UserRole } from '@constants/auth.constants';
import { IconDownload } from '@douyinfe/semi-icons';
import { Button } from '@douyinfe/semi-ui';
import { DebtService } from '@services/debt-cash';
import DownloadLink from 'react-download-link';
export const ExportDebtListButton = (props: any) => {
  const { filterExport, companyData } = props;

  const onClickExportData = async () => {
    const filterDebtExport = {
      companyId: filterExport.companyIds[0],
      periods: filterExport.periods,
    };
    const downloadData: any = await DebtService.exportDebt(filterDebtExport);
    return downloadData;
  };
  const companyShortName = companyData?.filter(
    (x: any) => x.id === filterExport?.companyIds[0]
  )[0]?.shortName;
  return (
    <>
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
                disabled={!filterExport?.periods.length}
              >
                Xuất dữ liệu
              </Button>
            </>
          }
          filename={`${companyShortName}_Cong_no.xlsx`}
          exportFile={onClickExportData}
        />
      </ProtectedWrapper>
    </>
  );
};
