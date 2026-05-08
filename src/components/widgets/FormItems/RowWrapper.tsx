export interface RowWrapperProps {
  cols?: number
  children: any
}
export const RowWrapper = (props: RowWrapperProps) => {
  const { children, cols = 1 } = props
  const className = `grid grid-cols-${cols} gap-7`
  return <div className={className}>{children}</div>
}
