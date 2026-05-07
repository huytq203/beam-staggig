import React from 'react';
import { Divider, Modal, Notification, Switch } from '@douyinfe/semi-ui';
import { useQuery } from 'react-query';
import { ConfigurationService } from '@services/configuration';
import AppTable from '@components/shared/AppTable/AppTable';

const BasicConfiguration = () => {
  const { data, isLoading, refetch } = useQuery(['basic-config-list'], () =>
    ConfigurationService.getBasicConfiguration()
  );
  const columns = [
    {
      title: 'Loại cài đặt',
      dataIndex: 'configType',
      width: 250,
      render: (e: any) => {
        let label = '';
        switch (e) {
          case 'LANGUAGE':
            label = 'Ngôn ngữ';
            break;
          case 'NOTIFICATION':
            label = 'Thông báo';
            break;
        }
        return <p>{label}</p>;
      },
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      width: 250,
      render: (e: any) => {
        let label = '';
        switch (e) {
          case 'VIETNAM':
            label = 'Việt Nam';
            break;
          case 'RECEIVE':
            label = 'Tự động nhận thông báo';
            break;
        }
        return <p>{label}</p>;
      },
    },
  ];

  const onClickAction = (record: any) => {
    const onDisableBasicConfig = async (record: any) => {
      const payload = {
        id: record.id,
        action: record.action,
        enabled: record.enabled,
      };
      const data = await ConfigurationService.disableBasicConfig(payload);
      return data;
    };
    Modal.confirm({
      title: 'Xác nhận hành động',
      cancelText: 'Huỷ',
      okText: 'Thực hiện',
      onOk: async () => {
        const data = await onDisableBasicConfig(record);
        if (data) {
          Notification.success({
            content: `Thay đổi trạng thái thành công`,
            theme: 'light',
          });
          refetch();
        }
      },
      content: 'Bạn có chắc muốn chuyển trạng thái của cài đặt này không?',
    });
  };

  const getTableData = () => {
    if (!data?.data) {
      return [];
    }

    return data?.data
      .filter((x: any) => {
        if (x.configType === 'TIMEZONE') {
          return false;
        }
        return true;
      })
      .map((x: any) => {
        return {
          ...x,
          key: x.id,
        };
      });
  };

  const getTableColumn = () => {
    let currentColumns: any = [...columns];
    currentColumns.push({
      title: 'Bật/tắt',
      dataIndex: 'id',
      width: 110,
      render: (id: any, record: any) => {
        return (
          <>
            {record.configType !== 'LANGUAGE' && (
              <Switch
                checked={record.enabled}
                onChange={(values) =>
                  onClickAction({
                    ...record,
                    enabled: values,
                  })
                }
              />
            )}
          </>
        );
      },
    });

    return currentColumns;
  };

  return (
    <div>
      <AppTable
        key='basicConfig'
        size='small'
        loading={isLoading}
        columns={getTableColumn()}
        dataSource={getTableData()}
        pagination={false}
      />
    </div>
  );
};

export default BasicConfiguration;
