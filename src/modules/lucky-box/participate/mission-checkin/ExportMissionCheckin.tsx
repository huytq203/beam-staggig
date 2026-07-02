import { ProtectedWrapper } from '@components/widgets/Auth';
import { UserRole } from '@constants/auth.constants';
import { IconDownload } from '@douyinfe/semi-icons';
import { Button } from '@douyinfe/semi-ui';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { LuckyBoxService } from '@services/lucky-box';
import DownloadLink from 'react-download-link';
export const ExportMissionCheckinButton = (props: any) => {
  const { filterExport } = props;

  const onClickExportData = async () => {
    const downloadData: any = await LuckyBoxService.exportUserCheckedIn(
      filterExport
    );
    return downloadData;
  };

  return (
    <>
      <ProtectedWrapper
        allowedRoles={[
          UserRole.BEAM_ADMIN,
          UserRole.SUPER_ADMIN,
          UserRole.SALE,
          UserRole.CUSTOMER_SERVICE,
          UserRole.CONTROLLER,
          UserRole.ACCOUNTANT,
        ]}
      >
        <DownloadLink
          style={{
            textDecoration: 'none',
            width: '110px',
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
          filename={`Danhsachthamgia_NhiemvuCheckin_${DateTimeHelper.formatDateTime(
            new Date()
          )}.xlsx`}
          exportFile={onClickExportData}
        />
      </ProtectedWrapper>
    </>
  );
};
