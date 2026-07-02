import { VIEW_TYPE } from './FileManager'
import { GridView } from './FileManagerGridView'
import { ListView } from './FileManagerListView'

export interface FileManagerMainViewProps {
  data: any[]
  onClickItem: any
  selected: any
  currentViewType: VIEW_TYPE
}
export const FileManagerMainView = (props: FileManagerMainViewProps) => {
  const { data, onClickItem, selected, currentViewType } = props
  return (
    <>
      {currentViewType == VIEW_TYPE.GRID && (
        <GridView data={data} onClickItem={onClickItem} selected={selected} />
      )}
      {currentViewType == VIEW_TYPE.LIST && (
        <ListView data={data} onClickItem={onClickItem} selected={selected} />
      )}
    </>
  )
}
