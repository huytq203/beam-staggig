import { InputWrapper } from '@components/shared';
import { Button, Input, Modal, Notification } from '@douyinfe/semi-ui';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { StringHelper } from '@helpers/string.helper';
import { AuthServices } from '@services/auth';
import Cookies from 'js-cookie';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoginSchema } from 'validations/Auth.schema';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { COMMON_FORMAT } from '@constants/common-format';
import { useQuery } from 'react-query';
import { ReconciliationService } from '@services/reconciliation';
export default function CheckReconciliationPage() {
  const router = useRouter();
  const {
    companyId: companyId,
    startDate: startDate,
    endDate: endDate,
    accessKey: accessKey,
  } = router.query;
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const param = {
    companyId: companyId,
    startTime: startDate,
    endTime: endDate,
    accessKey: accessKey,
  };

  const { data, isLoading, refetch } = useQuery(
    ['reconciliation-landing', param],
    () => ReconciliationService.getReconciliationLandingPage(param),
    {
      enabled: companyId !== undefined,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
    }
  );
  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues: {
      username: null,
      password: null,
    },
  });

  const handleConfirm = () => {
    setShowLoginForm(true);
  };

  const onSubmit = async (values: any) => {
    const { username, password } = values;
    const fileName = data?.fileName;
    const login = async () => {
      setLoading(true);

      const loginResponse = await AuthServices.loginReciliation({
        username: username,
        password: password,
      });
      const response = loginResponse?.data?.data;
      if (response) {
        const { access_token: accessToken, refresh_token: refreshToken } =
          response;

        Cookies.set('ACCESS_TOKEN_LANDING', accessToken, {
          secure:
            typeof window !== 'undefined' &&
            window.location.protocol === 'https:',
          sameSite: 'lax',
        });
        setLoading(false);
      }
      return response;
    };
    login().then((x: any) => {
      setLoading(true);

      if (x?.access_token !== undefined) {
        const dataForm = new FormData();
        dataForm.append('companyId', `${companyId}`);
        dataForm.append('type', 'COMPANY_FINAL');
        dataForm.append('startDate', `${startDate}`);
        dataForm.append('endDate', `${endDate}`);
        dataForm.append('description', '');
        dataForm.append('reconciliationSourceType', 'EMAIL');
        dataForm.append('fileName', fileName);
        fetch(
          `${process.env.NEXT_PUBLIC_API_CORE2}/reconciliation/upload-companies-reconciliation`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${x?.access_token}`,
              // 'Content-Type': 'application/json',
            },
            body: dataForm,
          }
        ).then((res: any) => {
          if (res?.status == 200) {
            Notification.success({
              content: `Chốt đối soát thành công`,
              theme: 'light',
            });
            localStorage.setItem('isReconcilied', 'true');
            setShowLoginForm(false);
            setLoading(false);
            refetch();
          } else {
            const errorMessage = {
              RECONCILIATION_REPORT_UNAUTHORIZED_ACCESS:
                'Tài khoản không có quyền chốt đối soát',
              RECONCILIATION_NOT_ELIGIBLE:
                'Tài khoản không có quyền chốt đối soát',
            };
            Notification.error({
              // content: ObjectHelper.handleMessage(errorMessage, x.message),
              content: 'Tài khoản không có quyền chốt đối soát',
              theme: 'light',
            });
            setLoading(false);
          }
        });
      } else {
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    window.addEventListener('storage', handleReconciliation);

    function handleReconciliation() {
      let reconciliationValue = JSON.parse(
        localStorage.getItem('isReconcilied') || ''
      );

      if (reconciliationValue === true || reconciliationValue === '') {
        if (typeof window !== 'undefined') {
          setShowLoginForm(false);
          refetch();
          localStorage.setItem('isReconcilied', 'false');
        }
      }
    }

    return () => {
      window.removeEventListener('click', handleReconciliation);
    };
  }, []);

  return (
    <div
      className="w-full h-screen flex flex-col justify-center items-center "
      style={{
        backgroundImage: `url("/img/bgcheckreconcilistion.png")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {showLoginForm && (
        <Modal
          width={700}
          size="small"
          visible={showLoginForm}
          onOk={() => setShowLoginForm(false)}
          onCancel={() => setShowLoginForm(false)}
          footer={[]}
        >
          <p className="mb-5">
            Để thực hiện chốt đối soát vui lòng nhập thông tin tài khoản đã được
            cấp quyền
          </p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <InputWrapper
              field="username"
              label="Tài khoản"
              component={(props: any) => (
                <Input
                  size="large"
                  placeholder="Nhập vào tài khoản"
                  type="text"
                  maxLength={30}
                  {...props}
                />
              )}
              control={control}
              errors={errors}
            />

            <InputWrapper
              field="password"
              label="Mật khẩu"
              component={(props: any) => (
                <Input
                  size="large"
                  placeholder="Password"
                  mode="password"
                  type="password"
                  maxLength={30}
                  {...props}
                />
              )}
              control={control}
              errors={errors}
            />
            <div className="mt-7 text-right">
              <Button
                // className="w-11/12"
                onClick={() => setShowLoginForm(false)}
                type="primary"
              >
                Đóng
              </Button>

              <Button
                className="ml-5"
                loading={loading}
                htmlType="submit"
                type="primary"
                theme="solid"
              >
                Chốt đối soát
              </Button>
            </div>
          </form>
        </Modal>
      )}
      <div className="w-3/5 h-96 rounded-xl flex-col justify-center items-center flex mt-6">
        <table className="table-auto w-2/3 border-black border-2 border-solid border-collapse">
          <tbody>
            <tr className="h-20">
              <th className="text-xl text-center border-black border-2 border-solid border-collapse font-normal">
                Tổng số NLĐ ứng lương
              </th>
              <td className="font-bold text-xl border-black border-2 border-solid border-collapse text-center">
                {data?.totalEmployeeSalaryAdvance
                  ? data?.totalEmployeeSalaryAdvance
                  : 0}
              </td>
            </tr>
            <tr className="h-20">
              <th className="text-xl text-center border-black border-2 border-solid border-collapse font-normal">
                Tổng số lượng giao dịch
              </th>
              <td className="font-bold text-xl border-black border-2 border-solid border-collapse text-center">
                {data?.totalTransaction ? data?.totalTransaction : 0}
              </td>
            </tr>
            <tr className="h-20">
              <th className="text-xl text-center border-black border-2 border-solid border-collapse  font-normal">
                Tổng số tiền NLĐ yêu cầu
              </th>
              <td className="font-bold text-xl border-black border-2 border-solid border-collapse text-center">
                {StringHelper.formatVND(data?.totalTransactionAmount, '0 ₫')}
              </td>
            </tr>
            <tr className="h-20">
              <th className=" text-xl text-center border-black border-2 border-solid border-collapse font-normal">
                Phí DN chia sẻ
              </th>
              <td className="font-bold text-xl border-black border-2 border-solid border-collapse text-center">
                {StringHelper.formatVND(data?.totalFeeCompanySharing, '0 ₫')}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {data?.processed && (
        <p className="font-bold text-xl">
          {`Đối soát chốt kỳ lương từ ${DateTimeHelper.convertTimeZone(
            startDate,
            COMMON_FORMAT.DATE
          )} - ${DateTimeHelper.convertTimeZone(
            endDate,
            COMMON_FORMAT.DATE
          )} đã được ghi nhận thành công, vui lòng kiểm tra chi tiết`}{' '}
          <a
            className="font-bold text-xl text-red-600"
            href={`/reconciliation/concern?companyId=${companyId}&startDate=${startDate}&endDate=${endDate}`}
            target="_blank"
          >
            tại đây
          </a>
        </p>
      )}
      {data?.reconciliationExpired && (
        <p className="font-bold text-xl">Báo cáo đã hết hạn chốt đối soát</p>
      )}
      {!data?.reconciliationExpired && !data?.processed && (
        <div className="w-2/5 h-28 rounded-xl flex-col justify-center items-center flex border-black border-2 border-solid">
          <p className="font-bold xl:text-lg 2xl:text-xl">
            Bạn có chắc chắn muốn xác nhận chốt đối soát không?
          </p>
          <div className="w-1/2 flex justify-around mt-4">
            <Button theme="solid" onClick={handleConfirm}>
              Chắc chắn
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
