import {ProtectedWrapper} from '@components/widgets/Auth';
import {UserRole} from '@constants/auth.constants';
import {IconDownload} from '@douyinfe/semi-icons';
import {Button} from '@douyinfe/semi-ui';
import DownloadLink from 'react-download-link';
import {TicketService} from "@services/ticket-management";
import {DateTimeHelper} from "@helpers/date-time.helper";
import {COMMON_FORMAT} from "@constants/common-format";

interface ExportTicketListButtonProps {
    filterExport: {
        searchWord: string,
        type: string,
        status: string,
    },
    companyShortName: string
}

export const ExportTicketListButton = ({filterExport, companyShortName}: ExportTicketListButtonProps) => {
    const onClickExportData = async () => {
        const downloadData: any = await TicketService.exportTicketList(
            filterExport
        );
        return downloadData;
    };
    return (
        <ProtectedWrapper
            allowedRoles={[
                UserRole.HR_ADMIN,
                UserRole.BEAM_ADMIN,
                UserRole.SUPER_ADMIN,
                UserRole.CUSTOMER_SERVICE,
                UserRole.CONTROLLER
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
                            icon={<IconDownload/>}
                        >
                            Xuất dữ liệu
                        </Button>
                    </>
                }
                filename={`${companyShortName}_yeu_cau_${DateTimeHelper.formatDateTime(
                    DateTimeHelper.getCurrentTime(),
                    COMMON_FORMAT.EXPORT_DATE_TICKET
                )}.xlsx`}
                exportFile={onClickExportData}
            />
        </ProtectedWrapper>
    );
};
