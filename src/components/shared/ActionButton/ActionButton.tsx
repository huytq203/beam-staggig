import { forwardRef } from 'react'

export const ActionButton = forwardRef((props: any, ref: any) => {
  const { children, onClick } = props
  return (
    <div
      {...props}
      ref={ref}
      onClick={onClick}
      className="flex justify-center items-center rounded-full p-1 bg-gray-200"
      style={{
        background: '#E9F7F7',
        border: '1px solid #208E91',
      }}
    >
      {children}
    </div>
  )
})
