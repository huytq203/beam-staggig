import AppTable from '@components/shared/AppTable/AppTable';
import { COMMON_FORMAT } from '@constants/common-format';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { StringHelper } from '@helpers/string.helper';
import React from 'react';
import { UserRole } from '@constants/auth.constants';
import { useAuth } from '@contexts/authentication';
interface ReportDate {
  nameReport: string;
  values: number;
}
export const ReportOperationsList = (props: any) => {
  const { data, filter, setFilter, isFetching } = props;
  const { authCheckByRole } = useAuth();
  authCheckByRole([
    UserRole.BEAM_ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.SALE,
    UserRole.CUSTOMER_SERVICE,
    UserRole.CONTROLLER,
    UserRole.RECONCILER,
  ]);

  const sortMonth = (a: any, b: any) => {
    // Split the strings into month and year parts
    const [monthA, yearA] = a.dataIndex.split('/');
    const [monthB, yearB] = b.dataIndex.split('/');

    // Convert the month and year parts to numbers
    const numericMonthA = parseInt(monthA, 10);
    const numericYearA = parseInt(yearA, 10);
    const numericMonthB = parseInt(monthB, 10);
    const numericYearB = parseInt(yearB, 10);

    // Compare years first
    if (numericYearA !== numericYearB) {
      return numericYearA - numericYearB;
    }

    // If years are the same, compare months
    return numericMonthA - numericMonthB;
  };

  const getFlattenColumns = () => {
    const response = data?.data;

    if (!response) return [];
    const getFirstColumn = data?.data?.companySize;
    if (!getFirstColumn) return [];
    const monthColumns = Object.keys(getFirstColumn)
      .map((x: any) => {
        const date = x.split('-');
        return {
          dataIndex: x,
          title: `Tháng ${date[1]} - ${date[0]}`,
          width: 150,
          render: (e: any) => <p>{e ? e : '0'}</p>,
        };
      })
      .sort((a: any, b: any) => sortMonth(a, b));

    let yearColumns: any[] = [];
    const getYearColumn = data?.data?.wholeYear?.companySize;

    if (getYearColumn) {
      yearColumns = Object.keys(getYearColumn).map((x: any) => {
        return {
          dataIndex: x,
          title: `Năm ${x}`,
          width: 150,
          render: (e: any) => <p>{e ? e : '0'}</p>,
        };
      });
    }
    if (filter.isMonth == 1) {
      return [
        {
          dataIndex: 'nameReport',
          title: 'Nội dung',
          fixed: true,
          render: (e: any) => (
            <p className="beam-break-world">{convertName(e)}</p>
          ),
        },
        {
          dataIndex: 'values',
          title: `${
            filter.startTime
              ? `${DateTimeHelper.convertTimeZone(
                  filter.startTime,
                  COMMON_FORMAT.DATE
                )} - ${DateTimeHelper.convertTimeZone(
                  filter.endTime,
                  COMMON_FORMAT.DATE
                )}`
              : `${DateTimeHelper.convertTimeZone(
                  DateTimeHelper.addMonth(new Date(), -5),
                  COMMON_FORMAT.DATE
                )} - ${DateTimeHelper.convertTimeZone(
                  Date(),
                  COMMON_FORMAT.DATE
                )}`
          }`,
        },
      ];
    }

    return [
      {
        dataIndex: 'nameReport',
        title: 'Nội dung',
        fixed: true,
        width: 250,
        render: (e: any) => (
          <p className="beam-break-world">{convertName(e)}</p>
        ),
      },
      ...yearColumns,
      ...monthColumns,
    ];
  };
  const convertName = (field: any) => {
    const nameObj: any = {
      onboardedCompany: 'Số lượng DN Onboard',
      installedApp: 'Tổng số lượng tải app',
      companySize: 'Quy mô nhân sự',
      numberOfOperatingBusinesses: 'Số lượng DN đang hoạt động',
      employeesRegisterAccountNew: 'Số lượng NLĐ đăng ký tài khoản (mới)',
      employeeRegisterSalaryAdvance:
        'Số lượng NLĐ đăng ký dịch vụ ứng lương (mới)',
      employeeSalaryAdvanceNew: 'NLĐ thực hiện ứng lương (mới)',
      totalTransaction: 'Số lượng giao dịch',
      totalTransactionAmount: 'Giá trị giao dịch',
      employeeSalaryAdvance: 'NLĐ thực hiện ứng lương',
      limitGrantedBusinesses: 'Hạn mức cấp cho DN (giai đoạn báo cáo)',
      salaryAdvanceRateLimitGrantedBusinesses:
        'Tỷ lệ ứng lương/hạn mức cấp cho DN',
      overdueDebt: 'Công nợ quá hạn',
      numberOfEmployeesEligibleForSalary: 'Số lượng NLĐ đủ điều kiện ứng lương',
      employeesRegisterCurrentAccount: 'NLĐ vãng lai đăng ký tài khoản mới',
      // employeeRegisterSalaryAdvanceService: 'NLĐ đăng ký dịch vụ ứng lương',
    };

    if (!nameObj[field]) return field;
    return nameObj[field];
  };

  const convertDataSource = (): any => {
    const response = data?.data;
    const reportingByYear = data?.data?.wholeYear || {};
    const reportingByDate = data?.data?.reportingByDate || {};

    if (!response) return [];
    if (response) {
      const keyFields = Object.keys(response);
      const source = keyFields.map((x: any) => {
        return {
          nameReport: x,
          ...response[x],
        };
      });
      const keyFieldsYear = Object.keys(reportingByYear);
      const sourceYear = keyFieldsYear.map((x: any) => {
        return {
          nameReport: x,
          ...reportingByYear[x],
        };
      });
      const keyFieldsReport = Object.keys(reportingByDate);
      const sourceReportByDate = keyFieldsReport.map((x: any) => {
        return {
          nameReport: x,
          values: reportingByDate[x],
        };
      });
      if (filter.isMonth == 1) {
        Object.keys(sourceReportByDate).forEach((key: any) => {
          if (
            sourceReportByDate[key].nameReport == 'totalTransactionAmount' ||
            sourceReportByDate[key].nameReport == 'limitGrantedBusinesses' ||
            source[key].nameReport == 'overdueDebt'
          ) {
            sourceReportByDate[key].values = StringHelper.formatVND(
              sourceReportByDate[key].values
            );
          }
          if (
            sourceReportByDate[key].nameReport ==
            'salaryAdvanceRateLimitGrantedBusinesses'
          ) {
            Object.keys(sourceReportByDate[key]).forEach((month: any) => {
              if (
                typeof sourceReportByDate[key][month as keyof ReportDate] !==
                'string'
              ) {
                sourceReportByDate[key][month as keyof ReportDate] =
                  sourceReportByDate[key][month as keyof ReportDate] > 0
                    ? sourceReportByDate[key][month as keyof ReportDate] + '%'
                    : '0%';
              }
            });
          }
        });

        return sourceReportByDate;
      }
      const mergedArr: any[] = [];
      [...source, ...sourceYear].forEach((item) => {
        const existingItem = mergedArr.find(
          (mergedItem) => mergedItem.nameReport === item.nameReport
        );

        if (existingItem) {
          // Merge properties from the current item into the existing item
          for (const key in item) {
            if (key !== 'nameReport') {
              existingItem[key] = item[key];
            }
          }
        } else {
          // If no existing item is found, push the current item to the merged array
          mergedArr.push(item);
        }
      });
      Object.keys(mergedArr).forEach((key: any) => {
        Object.keys(mergedArr[key]).forEach((month: any) => {
          if (
            mergedArr[key][month] == null ||
            mergedArr[key][month] == undefined
          ) {
            mergedArr[key][month] = 0;
          }
        });

        if (
          mergedArr[key].nameReport == 'totalTransactionAmount' ||
          mergedArr[key].nameReport == 'limitGrantedBusinesses' ||
          mergedArr[key].nameReport == 'overdueDebt'
        ) {
          Object.keys(mergedArr[key]).forEach((month: any) => {
            if (typeof mergedArr[key][month] !== 'string') {
              mergedArr[key][month] =
                mergedArr[key][month] != 0
                  ? StringHelper.formatVND(mergedArr[key][month])
                  : 0;
            }
          });
        }

        if (
          mergedArr[key].nameReport == 'salaryAdvanceRateLimitGrantedBusinesses'
        ) {
          Object.keys(mergedArr[key]).forEach((month: any) => {
            if (typeof mergedArr[key][month] !== 'string') {
              mergedArr[key][month] =
                mergedArr[key][month] > 0 ? mergedArr[key][month] + '%' : '0%';
            }
          });
        }
      });

      return mergedArr.filter((x: any) => {
        return (
          x.nameReport != 'wholeYear' &&
          x.nameReport != 'reportingByDate' &&
          x.nameReport != 'companyId' &&
          x.nameReport != 'companyName'
        );
      });
    }
  };

  const getFlattenCompanyColumns = () => {
    if (filter.type === 'COMPANY') {
      const reportingCompany = data?.data?.repostCompanies?.content[0];

      if (!reportingCompany) return [];
      const getFirstColumn =
        data?.data?.repostCompanies?.content[0].companySize;
      if (!getFirstColumn) return [];
      const monthColumns = Object.keys(getFirstColumn)
        .map((x: any) => {
          const date = x.split('-');
          return {
            dataIndex: x,
            title: `Tháng ${date[1]} - ${date[0]}`,
            width: 180,
            render: (e: any) => <p>{e ? e : '0'}</p>,
          };
        })
        .sort((a: any, b: any) => sortMonth(a, b));

      let yearColumns: any[] = [];
      const getYearColumn =
        data?.data?.repostCompanies?.content[0]?.wholeYear?.companySize;

      if (getYearColumn) {
        yearColumns = Object.keys(getYearColumn).map((x: any) => {
          return {
            dataIndex: x,
            title: `Năm ${x}`,
            width: 180,
            render: (e: any) => <p>{e ? e : '0'}</p>,
          };
        });
      }
      if (filter.isMonth == 1) {
        return [
          {
            dataIndex: 'companyName',
            title: 'Công ty',
            fixed: true,
            render: (e: any) => <p className="beam-break-world">{e}</p>,
          },
          {
            dataIndex: 'nameReport',
            title: 'Nội dung',
            fixed: true,
            render: (e: any) => (
              <p className="beam-break-world">{convertName(e)}</p>
            ),
          },
          {
            dataIndex: 'values',
            title: `${
              filter.startTime
                ? `${DateTimeHelper.convertTimeZone(
                    filter.startTime,
                    COMMON_FORMAT.DATE
                  )} - ${DateTimeHelper.convertTimeZone(
                    filter.endTime,
                    COMMON_FORMAT.DATE
                  )}`
                : `${DateTimeHelper.convertTimeZone(
                    DateTimeHelper.addMonth(new Date(), -5),
                    COMMON_FORMAT.DATE
                  )} - ${DateTimeHelper.convertTimeZone(
                    Date(),
                    COMMON_FORMAT.DATE
                  )}`
            }`,
          },
        ];
      }

      return [
        {
          dataIndex: 'companyName',
          title: 'Công ty',
          width: 250,
          fixed: true,
          render: (e: any) => <p className="beam-break-world">{e}</p>,
        },
        {
          dataIndex: 'nameReport',
          title: 'Nội dung',
          fixed: true,
          width: 200,
          render: (e: any) => (
            <p className="beam-break-world">{convertName(e)}</p>
          ),
        },
        ...yearColumns,
        ...monthColumns,
      ];
    }
  };

  const convertDataSourceCompany = (): any => {
    if (filter.type === 'COMPANY') {
      const reportingCompany = data?.data?.repostCompanies?.content[0];
      const companyName = data?.data?.repostCompanies?.content[0]?.companyName;
      const reportingByDate =
        data?.data?.repostCompanies?.content[0]?.reportingByDate || {};
      const reportingByYear =
        data?.data?.repostCompanies?.content[0]?.wholeYear || {};
      if (reportingCompany) {
        const keyFieldsReportCompany = Object.keys(reportingCompany);
        const sourceCompany = keyFieldsReportCompany.map((x: any) => {
          return {
            nameReport: x,
            ...reportingCompany[x],
          };
        });

        const keyFieldsYear = Object.keys(reportingByYear);
        const sourceYear = keyFieldsYear.map((x: any) => {
          return {
            nameReport: x,
            ...reportingByYear[x],
          };
        });

        if (companyName) {
          sourceCompany[0].companyName = companyName;
        }
        const keyFieldsReport = Object.keys(reportingByDate);
        const sourceReportByDate: any = keyFieldsReport.map((x: any) => {
          return {
            nameReport: x,
            values: reportingByDate[x],
          };
        });

        if (
          filter.isMonth == 1 &&
          companyName &&
          sourceReportByDate.length > 0
        ) {
          sourceReportByDate[0].companyName = companyName;
          Object.keys(sourceReportByDate).forEach((key: any) => {
            if (
              sourceReportByDate[key].nameReport == 'totalTransactionAmount' ||
              sourceReportByDate[key].nameReport == 'limitGrantedBusinesses' ||
              sourceReportByDate[key].nameReport == 'overdueDebt'
            ) {
              sourceReportByDate[key].values =
                sourceReportByDate[key].values != 0
                  ? StringHelper.formatVND(sourceReportByDate[key].values)
                  : 0;
            }
            if (
              sourceReportByDate[key].nameReport ==
              'salaryAdvanceRateLimitGrantedBusinesses'
            ) {
              Object.keys(sourceReportByDate[key]).forEach((month: any) => {
                if (
                  typeof sourceReportByDate[key][month as keyof ReportDate] !==
                  'string'
                ) {
                  sourceReportByDate[key][month as keyof ReportDate] =
                    sourceReportByDate[key][month as keyof ReportDate] > 0
                      ? sourceReportByDate[key][month as keyof ReportDate] + '%'
                      : '0%';
                }
              });
            }
          });
          return sourceReportByDate;
        }
        const mergedArr: any[] = [];
        [...sourceCompany, ...sourceYear].forEach((item) => {
          const existingItem = mergedArr.find(
            (mergedItem) => mergedItem.nameReport === item.nameReport
          );

          if (existingItem) {
            // Merge properties from the current item into the existing item
            for (const key in item) {
              if (key !== 'nameReport') {
                existingItem[key] = item[key];
              }
            }
          } else {
            // If no existing item is found, push the current item to the merged array
            mergedArr.push(item);
          }
        });
        Object.keys(mergedArr).forEach((key: any) => {
          Object.keys(mergedArr[key]).forEach((month: any) => {
            if (
              mergedArr[key][month] == null ||
              mergedArr[key][month] == undefined
            ) {
              mergedArr[key][month] = 0;
            }
          });

          if (
            mergedArr[key].nameReport == 'totalTransactionAmount' ||
            mergedArr[key].nameReport == 'limitGrantedBusinesses' ||
            mergedArr[key].nameReport == 'overdueDebt'
          ) {
            Object.keys(mergedArr[key]).forEach((month: any) => {
              if (typeof mergedArr[key][month] !== 'string') {
                mergedArr[key][month] =
                  mergedArr[key][month] != 0
                    ? StringHelper.formatVND(mergedArr[key][month])
                    : 0;
              }
            });
          }

          if (
            mergedArr[key].nameReport ==
            'salaryAdvanceRateLimitGrantedBusinesses'
          ) {
            Object.keys(mergedArr[key]).forEach((month: any) => {
              if (typeof mergedArr[key][month] !== 'string') {
                mergedArr[key][month] =
                  mergedArr[key][month] > 0
                    ? mergedArr[key][month] + '%'
                    : '0%';
              }
            });
          }
        });
        return mergedArr.filter((x: any) => {
          return (
            x.nameReport != 'wholeYear' &&
            x.nameReport != 'reportingByDate' &&
            x.nameReport != 'companyId' &&
            x.nameReport != 'companyName'
          );
        });
      }
      return [];
    }
  };
  return (
    <div className="transaction-list">
      <AppTable
        scroll={{ x: 2000, y: 600 }}
        dataSource={
          filter.type == 'OVERVIEW'
            ? convertDataSource()
            : convertDataSourceCompany()
        }
        columns={
          filter.type == 'OVERVIEW'
            ? getFlattenColumns()
            : getFlattenCompanyColumns()
        }
        pagination={
          filter.type === 'OVERVIEW'
            ? false
            : {
                currentPage: data?.data?.repostCompanies?.number + 1,
                pageSize: convertDataSourceCompany().length,
                total:
                  convertDataSourceCompany().length *
                  data?.data?.repostCompanies?.totalPages,
                onChange: (e: any) => {
                  setFilter({ ...filter, page: e });
                },
              }
        }
      />
    </div>
  );
};
