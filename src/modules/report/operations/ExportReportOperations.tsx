import { COMMON_FORMAT } from '@constants/common-format';
import { IconDownload } from '@douyinfe/semi-icons';
import { Button } from '@douyinfe/semi-ui';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { ReportService } from '@services/report';
import DownloadLink from 'react-download-link';
export const ExportReportOperationsButton = (props: any) => {
  const { filter } = props;

  const onClickExportData = async () => {
    const downloadData: any = await ReportService.exportOperationReport(filter);
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
      filename={`${
        filter.type == 'COMPANY'
          ? 'BaoCaoDoanhNghiep'
          : filter.type == 'OVERVIEW' && filter.companyIds.length > 0
          ? 'BaoCaoNhomDoanhNghiep'
          : 'BaoCaoTongQuan'
      }_[${
        filter?.startTime && filter.isMonth == 1
          ? DateTimeHelper.formatDateTime(filter?.startTime, COMMON_FORMAT.DATE)
          : filter?.startTime && filter.isMonth == 0
          ? DateTimeHelper.formatDateTime(
              filter?.startTime,
              COMMON_FORMAT.MONTH_YEAR
            )
          : DateTimeHelper.formatDateTime(
              DateTimeHelper.addMonth(new Date(), -5),
              COMMON_FORMAT.MONTH_YEAR
            )
      }]_[${
        filter?.endTime && filter.isMonth == 1
          ? DateTimeHelper.formatDateTime(filter?.endTime, COMMON_FORMAT.DATE)
          : filter?.endTime && filter.isMonth == 0
          ? DateTimeHelper.formatDateTime(
              filter?.endTime,
              COMMON_FORMAT.MONTH_YEAR
            )
          : DateTimeHelper.formatDateTime(
              DateTimeHelper.getCurrentDate(),
              COMMON_FORMAT.MONTH_YEAR
            )
      }].xlsx`}
      exportFile={onClickExportData}
    />
  );
};
