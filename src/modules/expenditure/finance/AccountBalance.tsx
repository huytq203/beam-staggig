import { Input, InputNumber } from '@components/shared';
import { BoxWrapper } from '@components/widgets';
import { COMMON_FORMAT } from '@constants/common-format';
import { Button } from '@douyinfe/semi-ui';
import { isProduction } from '@helpers/common.helper';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { PaymentService } from '@services/payment';
import { useQuery } from 'react-query';

export const AccountBalance = () => {
  const {
    data: dataVP,
    isLoading: isLoadingVP,
    refetch: refetchVP,
    isFetching: isFetchingVP,
  } = useQuery(
    ['current_account_payment_balance_VPBANK'],
    () => PaymentService.getPaymentAccountInfoVPBank(),
    {
      refetchOnWindowFocus: false,
    }
  );
  const {
    data: dataPVC,
    isLoading: isLoadingPVC,
    refetch: refetchPVC,
    isFetching: isFetchingPVC,
  } = useQuery(
    ['current_account_payment_balance_PVBANK'],
    () => PaymentService.getPaymentAccountInfoPVBank(),
    {
      refetchOnWindowFocus: false,
    }
  );
  const {
    data: dataVCB,
    isLoading: isLoadingVCB,
    refetch: refetchVCB,
    isFetching: isFetchingVCB,
  } = useQuery(
    ['current_account_payment_balance_VCB'],
    () => PaymentService.getPaymentAccountInfoVCB(),
    {
      refetchOnWindowFocus: false,
    }
  );

  const accountInfoBankVPBANK = (
    dataInfo: any,
    isLoading: boolean,
    isFetching: boolean,
    refetch: any
  ) => {
    return (
      <div className="flex flex-col gap-4">
        <label>Tên tài khoản</label>
        <Input size="large" value={dataInfo?.accountName ?? 'N/A'} disabled />
        <label>Số tài khoản thanh toán</label>
        <Input size="large" value={dataInfo?.accountNumber ?? 'N/A'} disabled />
        <label>Số dư</label>
        <InputNumber
          size="large"
          value={dataInfo?.availableBalance ?? 0}
          format="thousands"
          disabled
        />
        <div className="flex gap-4 items-center">
          <Button loading={isLoading && isFetching} onClick={() => refetch()}>
            Làm mới
          </Button>
          <span>
            {DateTimeHelper.formatDateTime(
              dataInfo?.date,
              COMMON_FORMAT.DATE_TIME
            )}
          </span>
        </div>
      </div>
    );
  };
  const accountInfoBankPVBANK = (
    dataInfo: any,
    isLoading: boolean,
    isFetching: boolean,
    refetch: any
  ) => {
    return (
      <div className="flex flex-col gap-4">
        <label>Tên tài khoản</label>
        <Input
          size="large"
          value={dataInfo?.data?.creditorAccount?.sourceName ?? 'N/A'}
          disabled
        />
        <label>Số tài khoản thanh toán</label>
        <Input
          size="large"
          value={dataInfo?.data?.creditorAccount?.sourceNumber ?? 'N/A'}
          disabled
        />
        <label>Số dư</label>
        <InputNumber
          size="large"
          value={dataInfo?.data?.creditorAccount?.amount ?? 0}
          format="thousands"
          disabled
        />
        <div className="flex gap-4 items-center">
          <Button loading={isLoading && isFetching} onClick={() => refetch()}>
            Làm mới
          </Button>
          <span>
            {DateTimeHelper.formatDateTime(
              dataInfo?.date,
              COMMON_FORMAT.DATE_TIME
            )}
          </span>
        </div>
      </div>
    );
  };
  const accountInfoBankVCB = (
    dataInfo: any,
    isLoading: boolean,
    isFetching: boolean,
    refetch: any
  ) => {
    return (
      <div className="flex flex-col gap-4">
        <label>Tên tài khoản</label>
        <Input size="large" value={'CTCP DICH VU CONG NGHE BEAM'} disabled />
        <label>Số tài khoản thanh toán</label>
        <Input
          size="large"
          value={isProduction() ? '3137686868' : '1018082407'}
          disabled
        />
        <label>Số dư</label>
        <InputNumber
          size="large"
          value={dataInfo?.payload?.balance?.amount ?? 0}
          format="thousands"
          disabled
        />
        <div className="flex gap-4 items-center">
          <Button loading={isLoading && isFetching} onClick={() => refetch()}>
            Làm mới
          </Button>
          <span>
            {DateTimeHelper.formatDateTime(
              dataInfo?.date,
              COMMON_FORMAT.DATE_TIME
            )}
          </span>
        </div>
      </div>
    );
  };
  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <BoxWrapper padding={6}>
          <h2>PVCOMBANK</h2>
          {accountInfoBankPVBANK(
            dataPVC,
            isLoadingPVC,
            isFetchingPVC,
            refetchPVC
          )}
        </BoxWrapper>
      </div>
      <div className="flex-1">
        <BoxWrapper padding={6}>
          <h2>VIETCOMBANK</h2>
          {accountInfoBankVCB(dataVCB, isLoadingVCB, isFetchingVCB, refetchVCB)}
        </BoxWrapper>
      </div>
      <div className="flex-1">
        <BoxWrapper padding={6}>
          <h2>VPBANK</h2>
          {accountInfoBankVPBANK(dataVP, isLoadingVP, isFetchingVP, refetchVP)}
        </BoxWrapper>
      </div>
    </div>
  );
};
