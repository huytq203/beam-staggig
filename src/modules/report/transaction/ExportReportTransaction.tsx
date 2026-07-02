import { COMMON_FORMAT } from '@constants/common-format';
import { IconDownload } from '@douyinfe/semi-icons';
import { Button } from '@douyinfe/semi-ui';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { ReportService } from '@services/report';
import DownloadLink from 'react-download-link';
export const ExportReportTransactionListButton = (props: any) => {
  const { filter } = props;
  const onClickExportData = async () => {
    const downloadData: any = await ReportService.exportReportTransaction(
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
      filename={`BaoCaoGiaoDich_[${
        filter?.startTime
          ? DateTimeHelper.formatDateTime(
              filter?.startTime,
              COMMON_FORMAT.EXPORT_DATE_REPORT
            )
          : DateTimeHelper.formatDateTime(
              '01/01/2023',
              COMMON_FORMAT.EXPORT_DATE_REPORT
            )
      }]_[${
        filter?.endTime
          ? DateTimeHelper.formatDateTime(
              filter?.endTime,
              COMMON_FORMAT.EXPORT_DATE_REPORT
            )
          : DateTimeHelper.formatDateTime(
              DateTimeHelper.getCurrentDate(),
              COMMON_FORMAT.EXPORT_DATE_REPORT
            )
      }].xlsx`}
      exportFile={onClickExportData}
    />
  );
};
