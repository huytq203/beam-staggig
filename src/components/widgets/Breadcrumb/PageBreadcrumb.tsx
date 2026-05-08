import { Breadcrumb } from '@douyinfe/semi-ui'

export const PageBreadcrumb = (props: any) => {
  const { title, urlList } = props

  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <span className="font-bold text-xl">{title}</span>
        {urlList && (
          <>
            <Breadcrumb className="mb-4">
              {urlList?.map((element: string, index: number) => {
                return <Breadcrumb.Item>{element}</Breadcrumb.Item>
              })}
            </Breadcrumb>
          </>
        )}
        {!urlList && (
          <>
            <Breadcrumb className="mb-4">
              <Breadcrumb.Item>BEAM</Breadcrumb.Item>
              <Breadcrumb.Item>{title}</Breadcrumb.Item>
            </Breadcrumb>
          </>
        )}
      </div>
    </>
  )
}
