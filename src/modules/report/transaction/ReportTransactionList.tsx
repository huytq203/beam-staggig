import { COMMON_FORMAT } from '@constants/common-format';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { StringHelper } from '@helpers/string.helper';
import Table from 'rc-table';
import React, { useCallback, useEffect, useState } from 'react';
import { IconTriangleUp, IconTriangleDown } from '@douyinfe/semi-icons';
import { useAuth } from '@contexts/authentication';
export const ReportTransactionList = (props: any) => {
  const { data, setFilter, filter } = props;
  const [sort, setSort] = useState({ keySort: '' });
  const { profile } = useAuth();
  const [directionSort, setDirectionSort] = useState('');
  const getTableData = () => {
    if (!data) return [];
    return data?.data?.transactions?.content;
  };
  const handleSortClick = useCallback((dataIndex: string) => {
    // Thay đổi giá trị directionSort khi nhấp chuột
    setDirectionSort((prevDirectionSort) => {
      if (prevDirectionSort === '') {
        return 'asc';
      } else if (prevDirectionSort === 'asc') {
        return 'desc';
      } else {
        return '';
      }
    });

    // Cập nhật thông tin sắp xếp
    setSort({
      keySort: dataIndex,
    });
  }, []); // Sử dụng useCallback để tránh tái tạo hàm khi không cần thiết

  // Sử dụng useEffect để cập nhật bộ lọc sau khi directionSort thay đổi
  useEffect(() => {
    setFilter((prevFilter: any) => ({
      ...prevFilter,
      page: 1, // Reset trang về 1 khi thay đổi sắp xếp
      size: 10, // Giới hạn số lượng mỗi trang (nếu cần)
      sort: directionSort === '' ? [''] : [sort.keySort, directionSort], // Cập nhật bộ lọc
    }));
  }, [directionSort, sort.keySort]);
  const titleSortRender = (title: string, dataIndex: string) => {
    return (
      <div
        onClick={() => handleSortClick(dataIndex)}
        className="black flex items-center min-w-max cursor-pointer"
      >
        <p className=" w-full">{title}</p>
        <div className="ml-3">
          {dataIndex === sort.keySort ? (
            <span className="h-[12px]">
              {directionSort == 'asc' ? (
                <IconTriangleUp size="small" />
              ) : directionSort == 'desc' ? (
                <IconTriangleDown size="small" />
              ) : (
                <div className="flex flex-col ml-1 mt-1 cursor-pointer">
                  <span className="h-[2px] mb-2">
                    <IconTriangleUp size="small" />
                  </span>
                  <span>
                    <IconTriangleDown size="small" />
                  </span>
                </div>
              )}
            </span>
          ) : (
            <div className="flex flex-col ml-1 mt-1 cursor-pointer">
              <span className="h-[2px] mb-2">
                <IconTriangleUp size="small" />
              </span>
              <span>
                <IconTriangleDown size="small" />
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };
  const columns = [
    {
      title: 'STT',
      dataIndex: 'id',
      width: 50,
      align: 'right' as 'right',
      render: (value: any, record: any, index: any) => (
        <span>{data?.data?.transactions.number * 10 + index + 1}</span>
      ),
    },
    {
      title: 'Mã nhân viên',
      dataIndex: 'employeeCode',
      width: 100,
      align: 'right' as 'right',
    },
    {
      title: 'Tên đăng nhập',
      dataIndex: 'phoneNumber',
      width: 100,
      align: 'right' as 'right',
    },
    {
      title: titleSortRender('Thời gian', 'createdTime'),
      dataIndex: 'createdTime',
      width: 130,
      align: 'right' as 'right',
      render: (value: any) => (
        <span>
          {DateTimeHelper.convertTimeZone(value, COMMON_FORMAT.DATE_TIME)}
        </span>
      ),
    },
    {
      title: titleSortRender('Số tiền yêu cầu', 'requestedAmount'),
      dataIndex: 'requestedAmount',
      width: 120,
      align: 'right' as 'right',
      render: (e: any) => StringHelper.formatVND(e),
    },
    {
      title: titleSortRender('Phí theo chính sách', 'feeByPolicy'),
      dataIndex: 'feeByPolicy',
      width: 150,
      align: 'right' as 'right',
      render: (e: any) => StringHelper.formatVND(e),
    },
    {
      title: titleSortRender('Phí doanh nghiệp chia sẻ', 'feeSharing'),
      dataIndex: 'feeSharing',
      width: 180,
      align: 'right' as 'right',
      render: (e: any) => StringHelper.formatVND(e),
    },
    {
      title: titleSortRender('Phí Beam chia sẻ', 'discount'),
      dataIndex: 'discount',
      width: 120,
      align: 'right' as 'right',
      render: (e: any) => StringHelper.formatVND(e),
    },
    {
      title: titleSortRender('Phí NLĐ phải trả', 'fee'),
      dataIndex: 'fee',
      width: 120,
      align: 'right' as 'right',
      render: (e: any) => StringHelper.formatVND(e),
    },
    {
      title: titleSortRender('Số tiền chuyển khoản', 'amount'),
      dataIndex: 'amount',
      width: 150,
      align: 'right' as 'right',
      render: (e: any) => StringHelper.formatVND(e),
    },
    {
      title: 'Doanh nghiệp thanh toán cho Beam',
      dataIndex: 'amountToPay',
      width: 200,
      align: 'right' as 'right',
      render: (e: any) => StringHelper.formatVND(e),
    },
    {
      title: 'Chủ tài khoản',
      dataIndex: 'employeeName',
      width: 160,
      align: 'right' as 'right',
    },
    {
      title: 'Ngân hàng',
      dataIndex: 'bankName',
      width: 140,
      align: 'right' as 'right',
    },
    {
      title: 'Số tài khoản',
      dataIndex: 'bankAccountNumber',
      width: 120,
      align: 'right' as 'right',
    },
    {
      title: 'Doanh nghiệp',
      dataIndex: 'companyName',
      width: 250,
      align: 'right' as 'right',
      // render: (e: any, render: any) => {
      //   return (
      //     <TextOverflow line={1}>
      //       <p className="beam-break-world">{e}</p>
      //     </TextOverflow>
      //   );
      // },
    },
    {
      title: 'Hình thức giao dịch',
      dataIndex: 'transferType',
      width: 150,
      align: 'right' as 'right',
      render: (value: any) => {
        return <p>{value == 1 ? 'CITAD' : 'NAPAS'}</p>;
      },
    },
    {
      title: 'Mã giao dịch',
      dataIndex: 'refNum',
      width: 200,
      align: 'right' as 'right',
    },
    {
      title: 'FT',
      dataIndex: 'bankId',
      width: 150,
      align: 'right' as 'right',
    },
    {
      title: 'Ngân hàng đi tiền',
      dataIndex: 'bankSource',
      width: 150,
      align: 'right' as 'right',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 100,
      align: 'right' as 'right',
      render: (value: any) => {
        let label = '';
        switch (value) {
          case 'SUCCESS':
            label = 'Thành công';
            break;
          case 'FAIL':
            label = 'Thất bại';
            break;
          case 'PENDING':
            label = 'Đang xử lý';
            break;
          case 'REFUND':
            label = 'Hoàn trả';
            break;
        }
        return <span>{label}</span>;
      },
    },
    {
      title: titleSortRender('Ngày cập nhật', 'updatedAt'),
      dataIndex: 'updatedAt',
      width: 130,
      align: 'right' as 'right',
      render: (value: any) => (
        <span>
          {DateTimeHelper.convertTimeZone(value, COMMON_FORMAT.DATE_TIME)}
        </span>
      ),
    },
  ].filter((x: any) => {
    if (profile?.roles[0] == 'hr_admin') {
      return x.dataIndex !== 'bankSource';
    }
    return x;
  });

  return (
    <div className="transaction-list">
      <Table
        data={getTableData()}
        columns={columns}
        scroll={{ x: 3900, y: 400 }}
        emptyText={'Không có kết quả'}
        summary={(dataSummary: any) => {
          let totalRequestedAmount = 0;
          let totalFeePolicy = 0;
          let totalFeeSharing = 0;
          let totalDiscount = 0;
          let totalFee = 0;
          let totalAmount = 0;
          let totalAmountToPay = 0;

          dataSummary.forEach(
            ({
              requestedAmount,
              amount,
              fee,
              feeSharing,
              feeByPolicy,
              discount,
              amountToPay,
            }: {
              requestedAmount: any;
              amount: any;
              fee: any;
              feeSharing: any;
              feeByPolicy: any;
              discount: any;
              amountToPay: any;
            }) => {
              totalRequestedAmount += requestedAmount;
              totalFeePolicy += feeByPolicy;
              totalFeeSharing += feeSharing;
              totalDiscount += discount;
              totalFee += fee;
              totalAmount += amount;
              totalAmountToPay += amountToPay;
            }
          );
          return (
            <Table.Summary fixed={true}>
              {data && (
                <>
                  <Table.Summary.Row className="total-page">
                    <Table.Summary.Cell index={0} colSpan={2}>
                      Tổng giao dịch trang
                    </Table.Summary.Cell>
                    {/* <Table.Summary.Cell index={1} /> */}
                    <Table.Summary.Cell index={2} />
                    <Table.Summary.Cell index={3} />
                    <Table.Summary.Cell index={4}>
                      <div className="float-right">
                        <p>{StringHelper.formatVND(totalRequestedAmount)}</p>
                      </div>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={5}>
                      <div className="float-right">
                        <p>{StringHelper.formatVND(totalFeePolicy)}</p>
                      </div>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={6}>
                      <div className="float-right">
                        <p>{StringHelper.formatVND(totalFeeSharing)}</p>
                      </div>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={7}>
                      <div className="float-right">
                        <p>{StringHelper.formatVND(totalDiscount)}</p>
                      </div>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={8}>
                      <div className="float-right">
                        <p>{StringHelper.formatVND(totalFee)}</p>
                      </div>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={9}>
                      <div className="float-right">
                        <p>{StringHelper.formatVND(totalAmount)}</p>
                      </div>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={10}>
                      <div className="float-right">
                        <p>{StringHelper.formatVND(totalAmountToPay)}</p>
                      </div>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={11} />
                    <Table.Summary.Cell index={12} />
                    <Table.Summary.Cell index={13} />
                    <Table.Summary.Cell index={14} />
                    <Table.Summary.Cell index={15} />
                    <Table.Summary.Cell index={16} />
                    <Table.Summary.Cell index={17} />
                    <Table.Summary.Cell index={18} />
                    <Table.Summary.Cell index={19} />
                    <Table.Summary.Cell index={20} />
                  </Table.Summary.Row>
                  <Table.Summary.Row className="total">
                    <Table.Summary.Cell index={0} colSpan={2}>
                      Tổng giao dịch
                    </Table.Summary.Cell>
                    {/* <Table.Summary.Cell index={1} /> */}
                    <Table.Summary.Cell index={2} />
                    <Table.Summary.Cell index={3} />
                    <Table.Summary.Cell index={4}>
                      <div className="float-right">
                        <p>
                          {StringHelper.formatVND(
                            data?.data?.totalRequestedAmount
                          )}
                        </p>
                      </div>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={5}>
                      <div className="float-right">
                        <p>
                          {StringHelper.formatVND(data?.data?.totalFeeByPolicy)}
                        </p>
                      </div>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={6}>
                      <div className="float-right">
                        <p>
                          {StringHelper.formatVND(data?.data?.totalFeeSharing)}
                        </p>
                      </div>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={7}>
                      <div className="float-right">
                        <p>
                          {StringHelper.formatVND(data?.data?.totalDiscount)}
                        </p>
                      </div>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={8}>
                      <div className="float-right">
                        <p>{StringHelper.formatVND(data?.data?.totalFee)}</p>
                      </div>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={9}>
                      <div className="float-right">
                        <p>{StringHelper.formatVND(data?.data?.totalAmount)}</p>
                      </div>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={10}>
                      <div className="float-right">
                        <p>
                          {StringHelper.formatVND(data?.data?.totalAmountToPay)}
                        </p>
                      </div>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={11} />
                    <Table.Summary.Cell index={12} />
                    <Table.Summary.Cell index={13} />
                    <Table.Summary.Cell index={14} />
                    <Table.Summary.Cell index={15} />
                    <Table.Summary.Cell index={16} />
                    <Table.Summary.Cell index={17} />
                    <Table.Summary.Cell index={18} />
                    <Table.Summary.Cell index={19} />
                    <Table.Summary.Cell index={20} />
                  </Table.Summary.Row>
                </>
              )}
            </Table.Summary>
          );
        }}
      />
    </div>
  );
};
