import { TableProps } from '@douyinfe/semi-ui/lib/es/table'

export interface AppTableProps extends TableProps {
  singleSelection: boolean
}
export const Table = (props: AppTableProps) => {
  const { singleSelection } = props
  return <Table {...props} />
}
