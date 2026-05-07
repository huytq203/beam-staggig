import { COMMON_FORMAT } from '@constants/common-format';
import { IconDownload } from '@douyinfe/semi-icons';
import { Button } from '@douyinfe/semi-ui';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { FriendInvatationService } from '@services/friend-invitation';
import { ReportService } from '@services/report';
import DownloadLink from 'react-download-link';
export const ExportBonusInvitedButton = (props: any) => {
  const { data } = props;
  const onClickExportData = async () => {
    const downloadData: any = await FriendInvatationService.exportBounsInvited(
      data
    );
    return downloadData;
  };
  return (
    <DownloadLink
      style={{
        textDecoration: 'none',
        width: '110px',
      }}
      label={
        <>
          <Button
            className="decor-none o-underline mt-7"
            theme="solid"
            type="warning"
            icon={<IconDownload />}
          >
            Xuất dữ liệu
          </Button>
        </>
      }
      filename={`Danh_sach_nguoi_duoc_gioi_thieu_dat_thuong_${DateTimeHelper.formatDateTime(
        DateTimeHelper.getCurrentDate(),
        COMMON_FORMAT.EXPORT_DATE_REPORT
      )}.xlsx`}
      exportFile={onClickExportData}
    />
  );
};
