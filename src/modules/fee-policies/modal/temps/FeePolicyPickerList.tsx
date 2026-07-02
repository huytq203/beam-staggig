import { AppPagination } from '@components/shared';
import AppTable from '@components/shared/AppTable/AppTable';
import TextOverflow from '@components/shared/TextOverflow/TextOverflow';
import { CardActionTitle } from '@components/widgets';
import { BaseFilter } from '@constants/models/BaseFilter';
import { Divider, Pagination, Radio, Table, Tooltip } from '@douyinfe/semi-ui';
import { FeePolicyTemplateService } from '@services/fee-policy-templates';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useQuery } from 'react-query';

export const FeePolicyPickerList = (props: any) => {
  const { feePolicyType, templateType, selectedTemplate, onSelectTemplate } =
    props;
  const router = useRouter();
  const [filter, setFilter] = useState({
    name: '',
    page: 1,
    size: 10,
  });

  const { data, isLoading } = useQuery(
    ['select-fee-policy-list', feePolicyType, templateType, filter],
    () =>
      FeePolicyTemplateService.getAll({
        ...filter,
        status: 0,
        feeType: templateType,
      })
  );

  const columns = [
    {
      title: 'Tên chính sách phí',
      dataIndex: 'name',
      width: 250,
    },
    {
      title: 'Loại chính sách phí',
      dataIndex: 'feeType',
      width: 250,
      render: (e: any) => {
        return <>{e == 0 ? 'Cố định' : 'Theo khoảng'}</>;
      },
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      width: 250,
      render: (e: any) => (
        <Tooltip position="top" content={e}>
          <TextOverflow children={e} />
        </Tooltip>
      ),
    },
    {
      title: 'Hành động',
      dataIndex: 'id',
      width: 250,
      render: (userId: any, record: any, index: any) => {
        return (
          <Radio
            className="cursor-pointer"
            checked={selectedTemplate?.id == record.id}
            onChange={() => onSelectTemplate(record)}
          />
        );
      },
    },
  ];

  const getTableData = () => {
    if (!data?.content) return [];
    return data?.content;
  };

  return (
    <>
      <CardActionTitle
        title="Danh sách biểu mẫu chính sách phí"
        showDelete={false}
        showAdd={false}
        showImport={false}
        onAdd={() => router.push('/fee-policies/templates/create')}
      />
      <Divider dashed />
      <AppTable
        loading={isLoading}
        columns={columns}
        size="small"
        dataSource={getTableData()}
        renderPagination={(e: any) => {
          return (
            <div className="py-2 w-full flex justify-end">
              <AppPagination
                {...data}
                onChange={(e: any) => {
                  setFilter({
                    ...filter,
                    page: e,
                  });
                }}
              />
            </div>
          );
        }}
        rowKey="id"
      />
    </>
  );
};
