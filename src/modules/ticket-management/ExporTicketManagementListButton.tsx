import { COMMON_FORMAT } from '@constants/common-format';
import { IconDownload } from '@douyinfe/semi-icons';
import { Button } from '@douyinfe/semi-ui';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { ObjectHelper } from '@helpers/object.helper';
import { TicketService } from '@services/ticket-management';
import DownloadLink from 'react-download-link';
export const ExportTicketManagementListButton = (props: any) => {
  const { filter } = props;

  const onClickExportData = async () => {
    const downloadData: any = await TicketService.exportReportTransaction(
      filter
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
        <Button
          className="decor-none o-underline"
          theme="solid"
          type="warning"
          icon={<IconDownload />}
        >
          Xuất dữ liệu
        </Button>
      }
      filename={`DS_DangKyDichVuUngLuong_${DateTimeHelper.formatDateTime(
        new Date(),
        COMMON_FORMAT.EXPORT_DATE_TICKET
      )}.xlsx`}
      exportFile={onClickExportData}
    />
  );
};
