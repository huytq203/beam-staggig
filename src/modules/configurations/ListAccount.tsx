import { Table, Typography } from '@douyinfe/semi-ui'

const accountData = [
  {
    name: 'Nguyễn Văn A',
    phoneNumber: '0792823811',
    email: 'anv@beam.com.vn',
    companyName: 'Beam Company',
  },
  {
    name: 'Nguyễn Văn B',
    phoneNumber: '0351235585',
    email: 'bnv@beam.com.vn',
    companyName: 'VNA Company',
  },
  {
    name: 'Nguyễn Văn C',
    phoneNumber: '095727217',
    email: 'dnv@beam.com.vn',
    companyName: 'VNA Company',
  },
  {
    name: 'Nguyễn Văn D',
    phoneNumber: '031551223',
    email: 'bca@beam.com.vn',
    companyName: 'Beam Company',
  },
]

export const ListAccount = (props: any) => {
  const { Text } = Typography

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      width: 250,
      render: (name: any, record: any, a: any) => {
        return <Text link>{name}</Text>
      },
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      width: 250,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: 250,
    },
    {
      title: 'Company',
      dataIndex: 'companyName',
      width: 250,
    },
  ]

  const rowSelection = {
    getCheckboxProps: (record: any) => ({
      disabled: record.name === 'Design docs',
      name: record.name,
    }),
    onSelect: (record: any, selected: any) => {
    },
    onSelectAll: (selected: any, selectedRows: any) => {
    },
    onChange: (selectedRowKeys: any, selectedRows: any) => {
    },
  }

  return (
    <Table
      columns={columns}
      dataSource={accountData}
      rowSelection={rowSelection}
    />
  )
}
