import { InputNumberByType } from '@components/shared';
import { InputWrapper } from '@components/shared/InputWrapper';
import { FormWrapper } from '@components/widgets/ContentWrapper';
import { UserRole } from '@constants/auth.constants';
import { COMMON_FORMAT } from '@constants/common-format';
import { useAuth } from '@contexts/authentication';
import { IconMinus, IconPlus } from '@douyinfe/semi-icons';
import {
  Collapse,
  DatePicker,
  Input,
  Modal,
  Notification,
  Select,
  Switch,
} from '@douyinfe/semi-ui';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { FunctionBase } from '@helpers/fuction-base.helpers';
import { StringHelper } from '@helpers/string.helper';
import { yupResolver } from '@hookform/resolvers/yup';
import { useIsMount } from '@hooks/useIsMount';
import { BankServices } from '@services/banks';
import { EmployeesServices } from '@services/companies/accounts';
import { GroupsServices } from '@services/companies/groups/groups.service';
import { TicketService } from '@services/ticket-management';
import moment from 'moment-timezone';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { creatAccountCompany } from 'validations/CreatAccountSchema.schema';
import {
  listGenders,
  listPosition,
  listReceivingType,
} from './dataType.constants';
import { SpinWrapper } from '@components/widgets/ContentWrapper/SpinWrapper';
import { CompanyService } from '@services/companies';

interface CreateCompanyAccountFormProps {
  accountId: any;
  isNew?: boolean;
  // currentProfile?: any;
  companyData?: any;
  setCheckData?: any;
}
interface ListBankConvert {
  bankCode: string;
  id: any;
  value: any;
  label: any;
  bin: any;
}

export enum BankType {
  CITAD = 'CITAD',
  NAPAS = 'NAPAS',
}
const CreateCompanyAccountForm = (props: CreateCompanyAccountFormProps) => {
  const {
    accountId,
    isNew,
    // currentProfile,
    companyData,
    setCheckData,
  } = props;
  const [listBankConvert, setListBankConvert] = useState<ListBankConvert[]>([]);
  const [listBankBranchsConvert, setListBankBranchsConvert] = useState(null);
  const [listGroupsConvert, setListGroupsConvert] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { companyId } = router.query;
  const { authCheckByRole, profile } = useAuth();
  authCheckByRole([
    UserRole.BEAM_ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.HR_ADMIN,
    UserRole.ACCOUNTANT,
    UserRole.SALE,
    UserRole.RECONCILER,
    UserRole.CUSTOMER_SERVICE,
    UserRole.CONTROLLER,
  ]);
  const isAmount = useIsMount();
  useEffect(() => {
    BankServices.getListBanks({}).then((response: any) => {
      const dataResponse = response?.data?.data;
      const dataX = dataResponse?.map((cur: any) => {
        return {
          bankCode: cur.bankCode,
          id: cur.id,
          value: `${cur.bankCode}|${cur.id}`,
          label: `${cur.bankName} (${cur.shortName})`,
          bin: cur?.bin,
        };
      });
      setListBankConvert(dataX);
    });

    GroupsServices.getListGroupsInComany({}, companyId).then((response) => {
      const dataResponse = response?.content;
      const dataX = dataResponse?.map((cur: any) => {
        return {
          value: cur?.id,
          label:
            cur?.name +
            `${
              cur?.payLimitSalary !== null ? ` (${cur?.payLimitSalary}%)` : ''
            }`,
        };
      });

      setListGroupsConvert(dataX);
    });
  }, []);
  const ticketId = router.query.ticketId;

  const { data, isFetching, isLoading, error, isError } = useQuery(
    ['account_detail', accountId],
    () => EmployeesServices.getEmployeeAccount(accountId),
    {
      enabled: !isNew,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
      retry: false,
    }
  );

  const {
    data: currentCompanyProfile,
    isLoading: isLoadingCurrentCompanyProfile,
    isFetching: isFetchingCurrentCompanyProfile,
    refetch: reFetchProfileData,
  } = useQuery(
    ['current-company-profile-data', companyId],
    async () => {
      const response = await CompanyService.getCurrentProfile(companyId);
      return response;
    },
    {
      enabled: true,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
    }
  );
  const {
    data: currentTicket,
    isLoading: isLoadingTicket,
    isFetching: isFetchingTicket,
  } = useQuery(
    ['ticket_detail', ticketId],
    () => TicketService.getTicket(ticketId),
    {
      enabled: ticketId != null,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
    }
  );
  const autoGenEmployeeCode = companyData?.autoGenEmployeeCode;
  const autoGenEmpTicket = currentTicket?.autoGenCode;
  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    getValues,
    setFocus,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(creatAccountCompany),
    shouldFocusError: true,
    defaultValues: {
      companyId: companyId,
      employeeCode: null,
      name: null,
      phoneNumber: null,
      email: null,
      position: null,
      dob: null,
      gender: null,
      identityNumber: null,
      groupIds: [],
      bankAccountNumber: null,
      payAccountType: 0,
      bankCode: '',
      bankCity: null,
      bankType: null,
      bankBranch: null,
      bankHolderName: null,
      salary: null,
      defaultWithName: false,
      groupIdPercentage: 0,
      payLimitValue: null,
      identificationAddress: null,
      identificationProvideDay: null,
      // payLimitSalaryPercentage: '',
      autoGenEmployeeCode: autoGenEmployeeCode ?? autoGenEmpTicket,
      enabled: true,
      payLimitSalaryType: 0,
      payLimitType: currentCompanyProfile?.payLimitType ?? 0,
      advancedAmount: 0,
      socialInsuranceNumber: null,
    },
  });

  useEffect(() => {
    if (isNew) {
      authCheckByRole([
        UserRole.BEAM_ADMIN,
        UserRole.HR_ADMIN,
        UserRole.SUPER_ADMIN,
        UserRole.CUSTOMER_SERVICE,
      ]);
    }
  }, []);

  useEffect(() => {
    if (!isLoading && !isNew && !isFetching) {
      const dob = DateTimeHelper.convertTimeZone(
        data?.dob,
        COMMON_FORMAT.EMPTY_FORMAT
      );
      const startApplyDate = DateTimeHelper.convertTimeZone(
        data?.startApplyDate,
        COMMON_FORMAT.EMPTY_FORMAT
      );
      const identificationProvideDay = data?.identificationProvideDay;
      const bankCode = `${data?.bankCode}|${data?.bankId}`;

      const bankCodeOnly = bankCode?.split('|');
      let bankFromCode: any;
      let bankType;
      if (listBankConvert.length > 0) {
        bankFromCode = listBankConvert?.find(
          (bank: any) => bank?.bankCode == bankCodeOnly[0]
        );
        bankType =
          bankFromCode?.bin || bankFromCode?.bankCode == 'VPBKVNVX'
            ? BankType.NAPAS
            : BankType.CITAD;
      }
      if (data?.payLimitSalaryType == 2) {
        return reset({
          ...data,
          dob: dob,
          bankCode: bankCode,
          startApplyDate: startApplyDate,
          identificationProvideDay: identificationProvideDay,
          groupIdPercentage: 2,
          bankType: bankType,
          payLimitType: currentCompanyProfile?.payLimitType,
          socialInsuranceNumber: data?.socialInsuranceNumber,
        });
      } else if (data?.payLimitSalaryType == 0) {
        return reset({
          ...data,
          dob: dob,
          bankCode: bankCode,
          startApplyDate: startApplyDate,
          identificationProvideDay: identificationProvideDay,
          groupIdPercentage: 0,
          bankType: bankType,
          payLimitType: currentCompanyProfile?.payLimitType,
          socialInsuranceNumber: data?.socialInsuranceNumber,
        });
      }
      return reset({
        ...data,
        dob: dob,
        bankCode: bankCode,
        startApplyDate: startApplyDate,
        bankType: bankType,
        payLimitType: currentCompanyProfile?.payLimitType,
        socialInsuranceNumber: data?.socialInsuranceNumber,
      });
    }
  }, [isLoading, isFetching]);

  useEffect(() => {
    reFetchProfileData();
    if (!isLoadingTicket && !isFetchingTicket) {
      const nameEmpTicket = currentTicket?.newEmployee?.name;
      const identityNumberEmpTicket =
        currentTicket?.newEmployee?.identityNumber;
      const phoneEmpTicket = currentTicket?.phoneNumber;
      const employeeCodeTicket = currentTicket?.newEmployee?.employeeCode;
      const dobTicket = currentTicket?.newEmployee.birthDay;
      const identificationProvideDayTicket =
        currentTicket?.newEmployee.identificationProvideDay;
      const currentFormData = getValues();
      return reset({
        ...currentFormData,
        name: nameEmpTicket,
        phoneNumber: phoneEmpTicket,
        identityNumber: identityNumberEmpTicket,
        employeeCode: employeeCodeTicket ? employeeCodeTicket : null,
        dob: dobTicket,
        payLimitType:
          currentCompanyProfile && currentCompanyProfile?.payLimitType,
        identificationProvideDay: identificationProvideDayTicket,
      });
    }
  }, [isFetchingTicket, isLoadingTicket]);

  useEffect(() => {
    if (!isAmount) {
      const defaultByName = getValues('defaultWithName');
      if (defaultByName) {
        setValue(
          'bankHolderName',
          StringHelper.removeVietnameseTones(getValues('name')).toUpperCase()
        );
      }
    }
  }, [watch('defaultWithName')]);

  useEffect(() => {
    const defaultByName = getValues('defaultWithName');
    if (!isAmount && defaultByName) {
      setValue(
        'bankHolderName',
        StringHelper.removeVietnameseTones(getValues('name')).toUpperCase()
      );
    }
  }, [watch('name')]);
  useEffect(() => {
    if (watch('bankCode')) {
      let bankId = watch('bankCode').split('|');
      if (bankId[1] !== undefined) {
        BankServices.getListBankBranchs(bankId[1]).then((response: any) => {
          // const dataResponse = response?.data?.data;
          const dataX = response?.map((cur: any) => {
            if (bankId[1] !== undefined) {
              return {
                value: cur?.name,
                label: cur?.name,
              };
            }
          });
          setListBankBranchsConvert(dataX);
        });
      }
    }
  }, [watch('bankCode')]);

  const showConfirmModal = (message: any, onConfirm: any, payload: any) => {
    return Modal.confirm({
      title: 'Xác nhận hành động',
      cancelText: 'Để sau',
      okText: 'Đồng ý',
      onOk: () => onConfirm(payload),
      content: message,
      onCancel: () => setLoading(false),
    });
  };

  const errorNoti = (content: any) => {
    return Notification.error({
      title: 'Có lỗi xảy ra!',
      content: content,
      duration: 6,
      theme: 'light',
    });
  };

  const showErrorNoti = (response: any) => {
    switch (response?.message) {
      case 'EXISTED_EMPLOYEE_PHONE_NUMBER_AND_IDENTITY_NUMBER_IN_OTHER_COMPANY':
        errorNoti(
          <p>
            SĐT {response?.data?.phoneNumber} và CMT/CCCD/Số hộ chiếu{' '}
            {response?.data?.identityNumber} này đã tồn tại. Vui lòng cập nhật
            lại thông tin của NLĐ.
          </p>
        );
        break;
      case 'EXISTED_EMPLOYEE_PHONE_NUMBER':
        errorNoti(
          <p>
            SĐT {response?.data?.phoneNumber} này đã tồn tại. Vui lòng cập nhật
            lại thông tin của NLĐ.
          </p>
        );
        break;
      case 'EXISTED_IDENTITY_NUMBER':
        errorNoti(
          <p>
            CCCD {response.data?.identityNumber} này đã tồn tại. Vui lòng cập
            nhật lại thông tin của NLĐ.
          </p>
        );
        break;
      case 'EXISTED_EMPLOYEE_PHONE_NUMBER_AND_IDENTITY_NUMBER':
        errorNoti(
          <p>
            SĐT {response?.data?.phoneNumber} và CMT/CCCD/Số hộ chiếu{' '}
            {response?.data?.identityNumber} này đã tồn tại. Vui lòng cập nhật
            lại thông tin của NLĐ.
          </p>
        );
        break;
    }
  };

  const handleEmployeeUpdate = async (payload: any) => {
    try {
      const response = await EmployeesServices.addOrUpdateEmployee(payload);
      FunctionBase.formNotification({
        response,
        cancel: () => router.push(`/companies/${companyId}/employees`),
        content: `${isNew ? 'Thêm mới' : 'Cập nhật thông tin'} người lao động`,
      });
      showErrorNoti(response);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const checkErrorEmployeeUpdate = async (payload: any) => {
    const response = await EmployeesServices.checkErrorEmployee(payload);
    if (response?.data?.data?.message === null) {
      await handleEmployeeUpdate(payload);
    } else {
      if (response?.data?.data?.message === 'NEGATIVE_PAY_LIMIT') {
        showConfirmModal(
          `Số tiền đã ứng vượt quá hạn mức được cấp. Bạn có chắc chắn muốn cập nhật thông tin NLĐ không?`,
          handleEmployeeUpdate,
          payload
        );
      } else {
        showErrorNoti(response?.data);
      }
      setLoading(false);
    }
  };

  const onSubmitValues = async (values: any) => {
    setLoading(true);
    const bankCode = values?.bankCode.split('|');
    const payload = {
      ticketId: ticketId,
      companyId: companyId,
      id: values.id,
      employeeCode: values.employeeCode,
      name: values.name.trim(),
      phoneNumber: values.phoneNumber.trim(),
      email: FunctionBase.checkTypeofVal(values.email, 'string')
        ? values.email.trim()
        : null,
      position: values.position,
      dob: DateTimeHelper.fomartDateRangeSubmit(values.dob),
      gender: values.gender,
      identityNumber: values.identityNumber.trim(),
      groupIds: values.groupIds,
      startApplyDate: DateTimeHelper.fomartDateRangeSubmit(
        values.startApplyDate
      ),
      bankAccountNumber: values.bankAccountNumber.trim(),
      payAccountType: values.payAccountType,
      bankCode: bankCode[0],
      bankCity: values.bankCity,
      bankBranch: values.bankBranch,
      bankHolderName: StringHelper.removeVietnameseTones(
        values?.bankHolderName?.trim()
      ).toUpperCase(),
      payLimitValue: values.payLimitValue,
      payLimitSalaryPercentage: values.payLimitSalaryPercentage,
      payLimitSalaryType: values.payLimitSalaryType,
      groupIdPercentage: values.groupIdPercentage,
      salary: values.salary,
      enabled: values.enabled,
      defaultWithName: values.defaultWithName,
      identificationProvideDay: values.identificationProvideDay
        ? moment(values.identificationProvideDay).format('YYYY-MM-DD')
        : null,
      identificationAddress: values.identificationAddress,
      advancedAmount: values.advancedAmount ?? 0,
      socialInsuranceNumber: watch('socialInsuranceNumber')
        ? watch('socialInsuranceNumber')
        : null,
    };

    if (!ticketId) {
      delete payload.ticketId;
    }

    if (watch('groupIdPercentage') == 0) {
      payload.payLimitSalaryType = 0;
      delete payload.payLimitSalaryPercentage;
      delete payload.groupIdPercentage;
    } else if (watch('groupIdPercentage') == 2) {
      payload.payLimitSalaryType = 2;
      delete payload.groupIdPercentage;
    } else {
      payload.payLimitSalaryType = 1;
      delete payload.payLimitSalaryPercentage;
    }
    const requestObject = {
      employeeId: values?.id,
      bankAccountNumber: values?.bankAccountNumber,
    };
    const isBankAccountDuplicate =
      await EmployeesServices.checkDuplicateBankAccountNumber(requestObject);

    if (isBankAccountDuplicate) {
      if (!isNew) {
        checkErrorEmployeeUpdate(payload);
      } else {
        await handleEmployeeUpdate(payload);
      }
    } else {
      if (!isNew) {
        showConfirmModal(
          `STK của NLĐ đã bị trùng. Bạn có chắc chắn muốn ${
            isNew ? 'thêm mới' : 'cập nhật thông tin'
          } NLĐ không?`,
          checkErrorEmployeeUpdate,
          payload
        );
      } else {
        await handleEmployeeUpdate(payload);
      }
    }
  };

  const getGroupIdPercentageOptions = (groupIds: any) => {
    const groupSalary = listGroupsConvert?.filter((x: any) =>
      groupIds?.includes(x?.value)
    );
    return [
      {
        label: 'Mặc định',
        value: 0,
      },
      {
        label: 'Tuỳ chỉnh',
        value: 2,
      },
      ...groupSalary,
    ];
  };
  useEffect(() => {
    const checkGroupSalary = watch('groupIds')?.some(
      (x: any) => x == watch('groupIdPercentage')
    );
    if (
      !checkGroupSalary &&
      watch('groupIdPercentage') != 0 &&
      watch('groupIdPercentage') != 2
    ) {
      setValue('groupIdPercentage', 0);
    }
  }, [watch('groupIds')]);

  const getSelectedBank = (val: any) => {
    const found: any = listBankConvert?.find((x: any) => x.bankCode == val);
    if (!found) return val;
    return `${found?.bankCode}|${found?.id}`;
  };
  const checkDisable = (type = 1, value: any = null) => {
    if (
      [
        UserRole.ACCOUNTANT,
        UserRole.SALE,
        UserRole.RECONCILER,
        UserRole.CONTROLLER,
      ].includes(profile?.roles[0]) ||
      companyData?.employeeInformationChange == false ||
      companyData?.workDayType === 'FIXED_WORKDAY'
    )
      return true;
    if (ticketId && value && type == 2) return true;
    return false;
  };
  useEffect(() => {
    if (!data && !isLoading && !isNew) {
      setCheckData(false);
    }
  }, [isLoading]);
  if (isLoading) return <></>;
  return (
    <SpinWrapper spinning={loading}>
      <FormWrapper
        pageTitle={`${
          isNew ? 'Thêm mới' : 'Chỉnh sửa'
        } thông tin người lao động`}
        onCancel={() => router.push(`/companies/${companyId}/employees`)}
        onSubmit={handleSubmit(onSubmitValues, (errors) =>
          FunctionBase.scrollToErrorField(errors as any, setFocus)
        )}
        showSubmitButton={!checkDisable()}
        loading={loading}
      >
        <Collapse
          expandIcon={<IconPlus />}
          collapseIcon={<IconMinus />}
          defaultActiveKey={['personalInfor', 'accountInfor', 'limitInfor']}
        >
          <Collapse.Panel header="Thông tin nhân viên" itemKey="personalInfor">
            <div className="flex flex-col gap-4 mb-4">
              <div className="grid grid-cols-2 gap-12">
                <InputWrapper
                  required
                  field="name"
                  label="Tên nhân viên"
                  component={(props: any) => (
                    <Input
                      disabled={checkDisable(
                        2,
                        currentTicket?.newEmployee?.name
                      )}
                      showClear
                      {...props}
                    />
                  )}
                  errors={errors}
                  control={control}
                />
                <InputWrapper
                  required
                  field="employeeCode"
                  label="Mã nhân viên"
                  component={(props: any) => (
                    <Input
                      disabled={
                        autoGenEmployeeCode ||
                        checkDisable(
                          2,
                          currentTicket?.newEmployee?.employeeCode
                        )
                      }
                      placeholder={
                        autoGenEmployeeCode ? 'Công ty tự động tạo mã' : ''
                      }
                      showClear
                      {...props}
                    />
                  )}
                  errors={errors}
                  control={control}
                />
              </div>

              <div className="grid grid-cols-2 gap-12">
                <InputWrapper
                  required
                  field="phoneNumber"
                  label="Số điện thoại"
                  component={(props: any) => (
                    <Input
                      disabled={checkDisable(2, currentTicket?.phoneNumber)}
                      showClear
                      {...props}
                    />
                  )}
                  errors={errors}
                  control={control}
                />

                <InputWrapper
                  field="email"
                  label="Email"
                  component={(props: any) => (
                    <Input disabled={checkDisable()} showClear {...props} />
                  )}
                  errors={errors}
                  control={control}
                />
              </div>

              <div className="grid grid-cols-2 gap-12">
                <InputWrapper
                  required
                  field="position"
                  label="Chức vụ"
                  component={(props: any) => (
                    <Select
                      disabled={checkDisable()}
                      placeholder="Chọn chức vụ"
                      optionList={listPosition}
                      {...props}
                    />
                  )}
                  errors={errors}
                  control={control}
                />

                <InputWrapper
                  required
                  field="dob"
                  label="Ngày sinh"
                  component={(props: any) => (
                    <DatePicker
                      disabled={checkDisable(
                        2,
                        currentTicket?.newEmployee?.birthDay
                      )}
                      format="dd/MM/yyyy"
                      value={props.value}
                      {...props}
                      showClear={false}
                      // density="compact"
                      type="date"
                      className="w-full"
                    />
                  )}
                  errors={errors}
                  control={control}
                />
              </div>

              <div className="grid grid-cols-2 gap-12">
                <InputWrapper
                  required
                  field="gender"
                  label="Giới tính"
                  component={(props: any) => (
                    <Select
                      disabled={checkDisable()}
                      placeholder="Giới tính"
                      {...props}
                      optionList={listGenders}
                    />
                  )}
                  errors={errors}
                  control={control}
                />

                <InputWrapper
                  required
                  field="identityNumber"
                  label="CMT/CCCD/Số hộ chiếu"
                  component={(props: any) => (
                    <Input
                      disabled={checkDisable(
                        2,
                        currentTicket?.newEmployee?.identityNumber
                      )}
                      showClear
                      {...props}
                    />
                  )}
                  errors={errors}
                  control={control}
                />
              </div>
              <div className="grid grid-cols-2 gap-12">
                <InputWrapper
                  field="identificationAddress"
                  label="Nơi cấp CMT/CCCD/Hộ chiếu"
                  component={(props: any) => (
                    <Input disabled={checkDisable()} showClear {...props} />
                  )}
                  errors={errors}
                  control={control}
                />

                <InputWrapper
                  field="identificationProvideDay"
                  label="Ngày cấp CMT/CCCD/Hộ chiếu"
                  component={(props: any) => (
                    <DatePicker
                      disabled={checkDisable(
                        2,
                        currentTicket?.newEmployee?.identificationProvideDay
                      )}
                      format="dd/MM/yyyy"
                      showClear
                      {...props}
                      // density="compact"
                      type="date"
                      className="w-full"
                    />
                  )}
                  errors={errors}
                  control={control}
                />
              </div>
              <div className="grid grid-cols-2 gap-12">
                <InputWrapper
                  field="groupIds"
                  label="Nhóm"
                  component={(props: any) => (
                    <Select
                      disabled={checkDisable()}
                      optionList={listGroupsConvert}
                      multiple
                      {...props}
                    />
                  )}
                  errors={errors}
                  control={control}
                />
                <InputWrapper
                  field="startApplyDate"
                  label="Ngày bắt đầu ứng lương"
                  component={(props: any) => (
                    <DatePicker
                      disabled={checkDisable()}
                      showClear
                      {...props}
                      format="dd/MM/yyyy"
                      // density="compact"
                      type="date"
                      className="w-full"
                    />
                  )}
                  errors={errors}
                  control={control}
                />
              </div>
            </div>
          </Collapse.Panel>
          <Collapse.Panel header="Thông tin tài khoản" itemKey="accountInfor">
            <div className="flex flex-col gap-4 mb-4">
              <div className="grid grid-cols-2 gap-12">
                <InputWrapper
                  required
                  field="payAccountType"
                  label="Loại tài khoản nhận ứng"
                  component={(props: any) => (
                    <Select
                      disabled={checkDisable()}
                      placeholder="Tài khoản ngân hàng"
                      optionList={listReceivingType}
                      {...props}
                    />
                  )}
                  errors={errors}
                  control={control}
                />
                <InputWrapper
                  required
                  field="bankCode"
                  label="Ngân hàng"
                  component={(props: any) => (
                    <Select
                      disabled={checkDisable()}
                      placeholder="Chọn ngân hàng"
                      optionList={listBankConvert}
                      filter
                      value={getSelectedBank(watch('bankCode'))}
                      onChange={(e: any) => {
                        const bankArr = e.split('|');
                        const bankCode = bankArr[0];
                        const bankFromCode: any = listBankConvert?.find(
                          (bank: any) => bank.bankCode == bankCode
                        );

                        const bankType: any =
                          bankFromCode?.bin ||
                          bankFromCode?.bankCode == 'VPBKVNVX'
                            ? BankType.NAPAS
                            : BankType.CITAD;

                        setValue('bankType', bankType);
                        props.onChange(e);
                        setValue('bankBranch', null);
                      }}
                    />
                  )}
                  errors={errors}
                  control={control}
                />
              </div>
              <div className="grid grid-cols-2 gap-12">
                <InputWrapper
                  field="bankCity"
                  label="Tỉnh/Thành phố"
                  component={(props: any) => (
                    <Input disabled={checkDisable()} showClear {...props} />
                  )}
                  errors={errors}
                  control={control}
                />
                <InputWrapper
                  field="bankBranch"
                  label="Chi nhánh Ngân hàng"
                  required={watch('bankType') == BankType.CITAD}
                  component={(props: any) => (
                    <Select
                      disabled={checkDisable()}
                      placeholder="Chọn chi nhánh"
                      optionList={listBankBranchsConvert}
                      filter
                      {...props}
                    />
                  )}
                  errors={errors}
                  control={control}
                />
              </div>
              <div className="grid grid-cols-2 gap-12">
                <InputWrapper
                  required
                  field="bankHolderName"
                  label="Tên chủ tài khoản"
                  component={(props: any) => (
                    <Input
                      disabled={checkDisable() || watch('defaultWithName')}
                      value={watch('name')}
                      showClear
                      {...props}
                    />
                  )}
                  errors={errors}
                  control={control}
                />
                <InputWrapper
                  required
                  field="bankAccountNumber"
                  label="Số tài khoản"
                  component={(props: any) => (
                    <Input
                      disabled={checkDisable()}
                      maxLength={24}
                      showClear
                      {...props}
                    />
                  )}
                  errors={errors}
                  control={control}
                />
              </div>
              <div className="grid grid-cols-2 gap-x-12">
                <InputWrapper
                  field="defaultWithName"
                  label="Mặc định theo họ tên"
                  component={(props: any) => (
                    <Switch
                      disabled={checkDisable()}
                      {...props}
                      checked={props.value}
                    />
                  )}
                  errors={errors}
                  control={control}
                />
              </div>
            </div>
          </Collapse.Panel>
          <Collapse.Panel header="Thông tin hạn mức" itemKey="limitInfor">
            <div className="flex flex-col gap-4">
              <div className="text-green-500 italic">
                {currentCompanyProfile?.payLimitType === 0
                  ? ' Hạn mức theo giá trị cố định'
                  : 'Hạn mức theo % lương'}
              </div>
              <div className="grid grid-cols-2 gap-x-12">
                <InputWrapper
                  required={currentCompanyProfile?.payLimitType == 1}
                  field="salary"
                  label="Lương"
                  component={(props: any) => (
                    <InputNumberByType
                      disabled={checkDisable()}
                      displayType={0}
                      min={0}
                      {...props}
                    />
                  )}
                  errors={errors}
                  control={control}
                />

                <InputWrapper
                  required={currentCompanyProfile?.payLimitType == 1}
                  field="groupIdPercentage"
                  label="Quy tắc ứng"
                  component={(props: any) => (
                    <Select
                      disabled={checkDisable()}
                      optionList={getGroupIdPercentageOptions(
                        watch('groupIds')
                      )}
                      {...props}
                    />
                  )}
                  errors={errors}
                  control={control}
                />
              </div>
              <div className="grid grid-cols-2 gap-x-12">
                <InputWrapper
                  required={currentCompanyProfile?.payLimitType == 0}
                  field="payLimitValue"
                  label="Hạn mức cố định"
                  component={(props: any) => (
                    <InputNumberByType
                      disabled={checkDisable()}
                      displayType={0}
                      {...props}
                    />
                  )}
                  errors={errors}
                  control={control}
                />
                {watch('groupIdPercentage') === 2 && (
                  <InputWrapper
                    required={watch('groupIdPercentage') === 2}
                    field="payLimitSalaryPercentage"
                    label="Tuỳ chỉnh"
                    component={(props: any) => (
                      <InputNumberByType
                        disabled={checkDisable()}
                        displayType={1}
                        {...props}
                      />
                    )}
                    errors={errors}
                    control={control}
                  />
                )}
              </div>
              <div className="grid grid-cols-2 gap-12">
                {companyData?.haveAdvancedAmount && (
                  <InputWrapper
                    field="advancedAmount"
                    label="Giá trị đã ứng mồng 1"
                    component={(props: any) => (
                      <InputNumberByType
                        disabled={checkDisable()}
                        displayType={0}
                        {...props}
                      />
                    )}
                    errors={errors}
                    control={control}
                  />
                )}
                <InputWrapper
                  field="enabled"
                  label="Đang làm việc"
                  component={(props: any) => (
                    <Switch
                      disabled={checkDisable()}
                      {...props}
                      checked={props.value}
                    />
                  )}
                  errors={errors}
                  control={control}
                />
              </div>
            </div>
          </Collapse.Panel>
        </Collapse>
      </FormWrapper>
    </SpinWrapper>
  );
};

export default CreateCompanyAccountForm;
