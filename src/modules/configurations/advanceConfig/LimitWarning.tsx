import AppTable from '@components/shared/AppTable/AppTable';
import {
  Table,
  Checkbox,
  Button,
  Modal,
  Notification,
} from '@douyinfe/semi-ui';
import { ConfigurationService } from '@services/configuration';
import { useState } from 'react';
import { useQuery } from 'react-query';
import AdvanceReceiverConfigForm from './formAdvanceConfig/AdvanceReceiverConfigForm';
import BaseAdvanceConfigForm from './formAdvanceConfig/BaseAdvanceConfigForm';

enum AdvanceReceiver {
  SMS,
  EMAIL,
  NOTI,
}

const LimitWarning = () => {
  const [visibleConfig, setVisibleConfig] = useState(false);
  const [visibleReceiver, setVisibleReceiver] = useState(false);
  const [id, setId] = useState();
  const [advanceReceiverID, setAdvanceReceiverID] = useState<any | null>(null);
  const { data, isLoading, refetch } = useQuery(['limit-warning'], () =>
    ConfigurationService.getAdvanceConfigurationByType(0)
  );
  const columns = [
    {
      title: 'Tên cảnh báo',
      width: 250,
      dataIndex: 'name',
      render: (e: any) => {
        let label = '';

        switch (e) {
          case 'COMPANY_OUT_OF_LIMIT':
            label = 'Hết hạn mức doanh nghiệp';
            break;
          case 'COMPANY_LIMIT':
            label = 'Hạn mức doanh nghiệp';
            break;
          case 'BEAM_OUT_OF_LIMIT':
            label = 'Hết hạn mức của Beam';
            break;
          case 'BEAM_LIMIT':
            label = 'Hạn mức Beam';
            break;
        }
        return <p>{label}</p>;
      },
    },
    {
      title: 'Ngưỡng cảnh báo',
      width: 200,
      dataIndex: 'threshold',
      render: (e: any) => {
        return <span>{e}%</span>;
      },
    },
    {
      title: 'Nhắc lại cảnh báo',
      width: 200,
      dataIndex: 'remind',
      render: (e: any, record: any) => {
        return <Checkbox checked={e} disabled />;
      },
    },
    {
      title: 'Phương thức cảnh báo',
      children: [
        {
          title: 'SMS',
          dataIndex: 'sms',
          width: 100,
          render: (value: any, record: any) => {
            return <Checkbox checked={value} disabled />;
          },
        },
        {
          title: 'Email',
          dataIndex: 'email',
          width: 100,
          render: (value: any, record: any) => {
            return <Checkbox checked={value} disabled />;
          },
        },
        {
          title: 'Thông báo',
          dataIndex: 'notification',
          width: 120,
          render: (value: any, record: any) => {
            return <Checkbox checked={value} disabled />;
          },
        },
      ],
    },
    {
      title: 'Người nhận thông tin',
      children: [
        {
          title: 'SMS',
          dataIndex: 'smsReceiverId',
          width: 200,
          render: (text: any, record: any, index: any) => {
            return (
              <Button
                onClick={() => {
                  setVisibleReceiver(true);
                  setAdvanceReceiverID(record.smsReceiverId);
                }}
              >
                Xem chi tiết
              </Button>
            );
          },
        },
        {
          title: 'Email',
          width: 200,
          dataIndex: 'emailReceiverId',
          render: (text: any, record: any, index: any) => {
            return (
              <Button
                onClick={() => {
                  setVisibleReceiver(true);
                  setAdvanceReceiverID(record.emailReceiverId);
                }}
              >
                Xem chi tiết
              </Button>
            );
          },
        },
        {
          title: 'Thông báo',
          width: 200,
          dataIndex: 'notificationReceiverId',
          render: (text: any, record: any, index: any) => {
            return (
              <Button
                onClick={() => {
                  setVisibleReceiver(true);
                  setAdvanceReceiverID(record.notificationReceiverId);
                }}
              >
                Xem chi tiết
              </Button>
            );
          },
        },
      ],
    },
    {
      title: 'Trạng thái',
      width: 200,
      dataIndex: 'status',
      render: (e: any) => {
        return <p>{e ? 'Đang hoạt động' : 'Không hoạt động'}</p>;
      },
    },
    {
      title: 'Hành động',
      width: 200,
      dataIndex: 'action',
      render: (e: any, record: any) => {
        return (
          <Button
            onClick={() => {
              setVisibleConfig(true);
              setId(record.id);
            }}
          >
            Chỉnh sửa
          </Button>
        );
      },
    },
  ];
  const getTableData = () => {
    if (isLoading || !data?.data) return [];
    return data?.data;
  };

  const closeModal = () => {
    setVisibleConfig(false);
    refetch();
  };
  const closeModalReceiver = () => {
    setVisibleReceiver(false);
    refetch();
  };

  const onHandleSubmit = (values: any) => {
    const payload = {
      id: values.id,
      type: 0,
      threshold: values.threshold,
      remind: values.remind,
      sms: values.sms,
      email: values.email,
      notification: values.notification,
      status: values.status,
    };
    ConfigurationService.baseAdvanceConfig(payload)
      .then((response: any) => {
        if (response) {
          Notification.success({
            title: 'Thành công',
            content: `Chỉnh sửa cài đặt thành công`,
            duration: 3,
            theme: 'light',
          });
          refetch();
          closeModal();
        } else {
          Notification.error({
            title: 'Error',
            content: 'Chỉnh sửa cài đặt thất bại',
            duration: 3,
            theme: 'light',
          });
        }
      })
      .catch((e) => {});
  };
  const onHandleSubmitReceiver = (values: any) => {
    const payload = {
      id: values.id,
      receiverType: values.receiverType,
      toBeamAdmin: values.toBeamAdmin,
      toHRAdmin: values.toHRAdmin,
      toAccounting: values.toAccounting,
      toEmployees: values.toEmployees,
    };
    ConfigurationService.advanceReceiverConfig(payload)
      .then((response: any) => {
        if (response) {
          Notification.success({
            title: 'Thành công',
            content: `Chỉnh sửa cài đặt thành công`,
            duration: 3,
            theme: 'light',
          });
          refetch();
          closeModalReceiver();
        } else {
          Notification.error({
            title: 'Error',
            content: 'Chỉnh sửa cài đặt thất bại',
            duration: 3,
            theme: 'light',
          });
        }
      })
      .catch((e) => {});
  };

  return (
    <div>
      <AppTable
        size="small"
        dataSource={getTableData()}
        loading={isLoading}
        scroll={{ y: 400 }}
        columns={columns}
        pagination={false}
      />
      <div>
        <Modal
          title="Chỉnh sửa cài đặt"
          visible={visibleConfig}
          footer={''}
          onCancel={() => setVisibleConfig(false)}
          closeOnEsc={true}
        >
          <BaseAdvanceConfigForm
            advanceId={id}
            onCancel={closeModal}
            onSubmit={onHandleSubmit}
            type={0}
            displayType={1}
          />
        </Modal>
      </div>
      <div>
        <Modal
          title="Đối tượng nhận cảnh báo"
          visible={visibleReceiver}
          footer={''}
          width={1000}
          onCancel={() => setVisibleReceiver(false)}
          closeOnEsc={true}
        >
          <AdvanceReceiverConfigForm
            advanceReceiverID={advanceReceiverID}
            onCancel={closeModalReceiver}
            onSubmit={onHandleSubmitReceiver}
          />
        </Modal>
      </div>
    </div>
  );
};

export default LimitWarning;
