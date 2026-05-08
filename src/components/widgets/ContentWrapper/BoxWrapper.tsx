export const BoxWrapper = (props: any) => {
  const { children, padding = 0 } = props
  const paddingClass = `p-${padding}`
  return (
    <>
      <div
        className={`bg-white border-none rounded-lg shadow-md overflow-auto ${paddingClass}`}
      >
        {children}
      </div>
    </>
  )
}
