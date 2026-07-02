import { COMMON_FORMAT } from '@constants/common-format'
import { Image, Table } from '@douyinfe/semi-ui'
import { DateTimeHelper } from '@helpers/date-time.helper'
export interface FileManagerGridViewProps {
  data: any[]
  onClickItem: any
  selected: any
}

export const ListView = (props: FileManagerGridViewProps) => {
  const { data, onClickItem, selected } = props

  const columns = [
    {
      title: 'File Name',
      dataIndex: 'originalName',
      render: (e: any, record: any) => {
        return (
          <div className="flex gap-2 items-center">
            <Image src={record.url} width={18} height={18} />
            <span>{e}</span>
          </div>
        )
      },
    },
    {
      title: 'Date Modified',
      dataIndex: 'createdAt',
      render: (value: any) => {
        return (
          <>
            {DateTimeHelper.formatDateTime(value, COMMON_FORMAT.DATETIME_SHORT)}
          </>
        )
      },
    },
    {
      title: 'Kind',
      dataIndex: 'fileType',
      render: (e: any) => {
        return <>{e.split('/')[0]}</>
      },
    },
  ]

  const handleRow = (record: any, index: any) => {
    const isSelected = record.id == selected?.id
    let rowObjs = {}

    if (isSelected) {
      rowObjs = {
        className: 'bg-blue-700 text-white font-semibold',
      }
    } else {
      rowObjs = {}
    }
    return {
      ...rowObjs,
      onClick: (data: any) => onClickItem(record, !isSelected),
    }
  }

  return (
    <div className="flex flex-col gap-4 max-h-64 overflow-auto">
      <Table
        onRow={handleRow}
        pagination={false}
        dataSource={data}
        columns={columns}
        size="small"
      />
    </div>
  )
}
