import logo from '../../../../../../public/img/LogoLogin.png'

export const AuthLayoutRight = (props: any) => {
  const { children } = props
  return (
    <div className="hidden xl:block md:col-span-1 xl:col-span-2 md:bg-[url('/img/bg-right-login.png')] h-screen">
      <div className="px-16 pt-16 flex justify-center">
        <div className="text-white text-4xl font-bold">
          Chào mừng bạn đến với flexpay
        </div>
      </div>
      <div className="pt-16 flex justify-center">
        <img
          className="md:max-w-xs xl:max-w-lg"
          src="/img/bg-right2-login.png"
        />
      </div>
    </div>
  )
}
export const AuthLayoutLeft = (props: any) => {
  const { children } = props
  return (
    <div className="col-span-1 xl:container mx-auto xl:bg-[url('/img/bg-left-login.png')] bg-cover">
      <div className={`px-12 pt-10 `}>
        <img src={logo.src} alt="logo" />
        <div className="flex flex-col items-center">{children}</div>
      </div>
    </div>
  )
}
export const AuthLayout = (props: any) => {
  const { children } = props
  return (
    <div className="h-screen">
      <div className="flex flex-col">
        <div className="grid xl:grid-cols-3">{children}</div>
      </div>
    </div>
  )
}
