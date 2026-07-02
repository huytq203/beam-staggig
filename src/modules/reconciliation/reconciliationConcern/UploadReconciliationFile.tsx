import {
  Button,
  Checkbox,
  Modal,
  Notification,
  Spin,
  TextArea,
  Typography,
  Upload,
} from '@douyinfe/semi-ui';
import { IconUpload, IconBolt } from '@douyinfe/semi-icons';
import { useEffect, useRef, useState } from 'react';
import { ReportTypeFormSelect } from '@components/widgets/Select/ReportTypeFormSelect';
import { NEXT_PUBLIC_API_CORE2 } from '@constants/endpoints';
import { SalaryPeriodRecoliiationSelect } from '@components/widgets/Select/SalaryPeriodRecoliiationSelect';
import { UserRole } from '@constants/auth.constants';
import { ProtectedWrapper } from '@components/widgets/Auth';
import { ReconciliationService } from '@services/reconciliation';
import { RequiredAsterisk } from '@components/shared';
import { useQuery } from 'react-query';
export const UploadReconciliationFile = (props: any) => {
  const { afterSubmit, companyId, hr } = props;
  const [isOpenConfrimModal, setIsOpenConfirmModal] = useState(false);
  const [reportType, setReportType] = useState('BEAM_UPLOAD');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [finalReport, setFinalReport] = useState(false);
  const { Text } = Typography;
  const uploadRef = useRef<any>(null);
  const [hasFile, setHasFile] = useState(false);

  const { data, isLoading, isFetching, refetch } = useQuery(
    ['get_access_reconciliation', companyId],
    () => ReconciliationService.getAccessReconciliation(companyId),
    {
      enabled: hr === 'hr_admin' && companyId !== null,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    }
  );
  const onCloseModal = () => {
    setIsOpenConfirmModal(false);
    setHasFile(false);
    setFinalReport(false);
    setLoading(false);
    setReportType('BEAM_UPLOAD');
  };

  const manulUpload = (e: any) => {
    setLoading(true);
    e.stopPropagation();
    uploadRef.current.upload();
    afterSubmit && afterSubmit();
  };
  const type = finalReport
    ? 'COMPANY_FINAL'
    : hr === 'hr_admin' && reportType == 'BEAM_UPLOAD'
    ? 'COMPANY_UPLOAD'
    : hr === 'hr_admin' && reportType == 'BEAM_FINAL_PDF'
    ? 'COMPANY_FINAL_PDF'
    : reportType;
  const onUpload = async (data: any) => {
    setLoading(true);

    return await ReconciliationService.uploadFileReconciliationConcern(
      data
    ).then((x: any) => {
      if (x.status == 200) {
        Notification.success({
          content: `Tải lên file thành công`,
          theme: 'light',
        });
        setIsOpenConfirmModal(false);
        setHasFile(false);
        setFinalReport(false);
        setLoading(false);
        afterSubmit && afterSubmit();
      }
      setLoading(false);
      setReportType('BEAM_UPLOAD');
    });
  };
  const reportTypeChange = (value: any) => {
    setReportType(value);
    setFinalReport(false);
  };
  const descriptionChange = (value: any) => {
    setDescription(value);
  };
  const finalReportChange = (value: any) => {
    setFinalReport(value.target.checked);
  };
  const changeDate = (values: any) => {
    const salaryPeriod = typeof values === 'string' ? values?.split('|') : '|';
    setStartDate(salaryPeriod[0]);
    setEndDate(salaryPeriod[1]);
  };
  return (
    <>
      <ProtectedWrapper
        allowedRoles={[
          UserRole.BEAM_ADMIN,
          UserRole.SUPER_ADMIN,
          UserRole.HR_ADMIN,
          UserRole.RECONCILER,
        ]}
      >
        {(hr !== 'hr_admin' || data?.canUploadFile) && (
          <Button
            className="float-right"
            onClick={() => setIsOpenConfirmModal(true)}
            icon={<IconUpload />}
            theme="solid"
            iconPosition="right"
            disabled={companyId === null || companyId === undefined}
          >
            Tải lên file
          </Button>
        )}
      </ProtectedWrapper>
      <Modal
        visible={isOpenConfrimModal}
        onCancel={onCloseModal}
        // onOk={onCloseModal}
        footer={
          <>
            <Button type="primary" onClick={onCloseModal} disabled={loading}>
              Huỷ bỏ
            </Button>
            <Button
              disabled={hasFile == false || endDate === undefined}
              theme="solid"
              onClick={manulUpload}
              loading={loading}
            >
              Tải lên
            </Button>
          </>
        }
        title="Tải lên file báo cáo đối soát"
      >
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 items-center gap-4">
            <div className="grid grid-cols-1 items-center gap-4">
              <Text>Loại file báo cáo</Text>
              <ReportTypeFormSelect
                placeholder="Chọn file báo cáo"
                onChange={reportTypeChange}
                hr={hr}
              />
            </div>
            <div className="grid grid-cols-1 items-center gap-4">
              <Text>
                Kỳ lương <RequiredAsterisk />
              </Text>
              <SalaryPeriodRecoliiationSelect
                placeholder="Chọn kỳ lương"
                companyId={companyId}
                onChange={changeDate}
                multiple={false}
                hasCurrentPeriod={false}
              />
            </div>
            <div className="grid grid-cols-1 items-center gap-4">
              <TextArea
                autosize
                maxCount={500}
                maxLength={500}
                placeholder="Ghi chú"
                onChange={descriptionChange}
              />
            </div>
            {reportType == 'BEAM_UPLOAD' && (
              <div className="grid grid-cols-1 items-center gap-4">
                <ProtectedWrapper allowedRoles={[UserRole.HR_ADMIN]}>
                  <Checkbox
                    onChange={finalReportChange}
                    aria-label="Checkbox demo"
                  >
                    <div className="flex flex-col">
                      <p className="font-bold">Đồng ý chốt đối soát</p>
                      <p>
                        Lưu ý : Chỉ chọn khi chắc chắn rằng đây là file đối soát
                        mà bạn đồng ý
                      </p>
                    </div>
                  </Checkbox>
                </ProtectedWrapper>
              </div>
            )}
            <Upload
              ref={uploadRef}
              uploadTrigger="custom"
              limit={1}
              maxSize={51199}
              action={`${NEXT_PUBLIC_API_CORE2}/reconciliation/upload-companies-reconciliation`}
              dragIcon={<IconBolt />}
              draggable={true}
              onFileChange={() => {
                setHasFile(true);
              }}
              onSuccess={(e: any) => {
                Notification.success({
                  content: `Tải lên file thành công!`,
                  theme: 'light',
                });
              }}
              customRequest={(options: any) => {
                const data = new FormData();
                data?.append('file', options.file.fileInstance);
                data?.append('companyId', companyId);
                data?.append('type', type);
                data?.append('startDate', startDate);
                data?.append('endDate', endDate);
                data?.append('description', description);
                data?.append('reconciliationSourceType', 'WEB_PORTAL');
                data?.append('fileName', '');
                onUpload(data)
                  .then((res: any) => {
                    options.onSuccess(res.data, options.file);
                    setLoading(false);
                  })
                  .catch((err: Error) => {
                    setLoading(false);
                  });
              }}
              accept=".xlsx,.pdf,.csv"
              dragMainText={'Tải tệp lên hoặc thả tệp tại đây'}
              dragSubText="XLSX, PDF không quá 50MB"
              style={{ marginTop: 10 }}
            />
          </div>

          {/* <div className='grid grid-cols-2 items-center gap-4'>
        </div> */}
        </div>
      </Modal>
    </>
  );
};
