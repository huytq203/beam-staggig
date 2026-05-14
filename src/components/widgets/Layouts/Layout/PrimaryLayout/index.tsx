import TextOverflow from '@components/shared/TextOverflow/TextOverflow';
import { PrimarySidebar } from '@components/widgets/Layouts';
import { COMMON_FORMAT } from '@constants/common-format';
import { menuOptions } from '@constants/menu.constant';
import { useAuth } from '@contexts/authentication';
import { IconBell, IconLanguage, IconHome } from '@douyinfe/semi-icons';
import {
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Card,
  Dropdown,
  Layout,
  Nav,
  Skeleton,
  TabPane,
  Tabs,
} from '@douyinfe/semi-ui';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { useNotification } from '@hooks/use-sockjs/useNotification';
import { NotificationManagementService } from '@services/notification-management';
import { useRouter } from 'next/router';
import flexpayLogo from '../../../../../../public/img/noavatar.png';
import { useEffect, useState } from 'react';
import ReactCountryFlag from 'react-country-flag';
import { notificationConfigs } from '@constants/notificationConfis.constants';
const PrimaryLayout = (props: any) => {
  const { children, breadcrumbs = [] } = props;
  const { signOut }: any = useAuth();
  const { Content } = Layout;
  const router = useRouter();
  const [visibileItem, setVisibileItem] = useState(false);
  const [notiMaintenance, setNotiMaintenance] = useState('');
  useEffect(() => {
    setNotiMaintenance(localStorage.getItem('isMaintenanceNoti') || '');
  }, []);
  const {
    notifications,
    refetch: reFetchNotification,
    isLoading: isLoadingNotification,
    isFetching: isFetchingNotification,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useNotification();

  const currentPath: any = router.pathname.split('/');
  const defaultKey: any = currentPath[1];

  const getCurrentActive = () => {
    let path: any = currentPath[1];
    let slug: any = router.query?.slug;

    let itemKey = router.asPath.slice(1).split('?')[0].split('/').join('-');
    if (slug) {
      itemKey = [path, slug.join('-')].join('-');
    }
    return [itemKey];
  };
  const activeItem: any = getCurrentActive();

  const getBreadCrumbLabel = () => {
    for (const menu of menuOptions) {
      if (menu.itemKey == activeItem) {
        return [menu.text];
      }
      if (menu.items) {
        for (const subMenu of menu.items) {
          if (subMenu.itemKey == activeItem) {
            return [menu.text, subMenu.text];
          }
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener('storage', handleLogout);

    function handleLogout() {
      let logoutValue = JSON.parse(localStorage.getItem('isLogout') || '');

      if (logoutValue === true || logoutValue === '') {
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/signin';
        }
      }
    }

    return () => {
      window.removeEventListener('click', handleLogout);
    };
  }, []);

  const getDefaultLabel = () => {
    for (const menu of menuOptions) {
      if (menu.itemKey == defaultKey) {
        return [menu.text];
      }
    }
    return null;
  };
  const getNotificationList = () => {
    return notifications?.pages.map((noti: any) => {
      return noti?.notifications?.content;
    });
    // return notifications?.pages[0]?.notifications?.content ?? [];
  };
  const getTotalUnview = () => {
    // if (!notifications?.pages[0]) {
    //   reFetchNotification();
    // }
    return notifications?.pages[0]?.totalUnView;
  };
  const getSeenAll = async () => {
    const response = await NotificationManagementService.seenAllNotification();
    reFetchNotification();
    return response;
  };

  const checkViewAll = async () => {
    const response = await NotificationManagementService.viewAllNotification();
    setVisibileItem(!visibileItem);
    return response;
  };

  const onSeenNotification = async (notificationId: any) => {
    const response = await NotificationManagementService.seenNotification(
      notificationId
    );
  };
  const onViewNotification = async (notificationId: any, data: any) => {
    if (!data) return;
    const companyId = data?.data ? data?.data.companyId : null;
    const employeeId = data?.data.employeeId;
    const profileId = data?.data?.profileId ? data?.data?.profileId : null;
    const startTime = data?.data?.startTime ? data?.data?.startTime : null;
    const endTime = data?.data?.endTime ? data?.data?.endTime : null;
    const phoneNumber = data?.data?.phoneNumber
      ? data?.data?.phoneNumber
      : null;
    const feePolicyId = data?.data?.feePolicyId
      ? data?.data?.feePolicyId
      : null;
    const { type, id: ticketId } = data;
    const notificationConfig = notificationConfigs.find(
      (x: any) => x.type == type
    );
    notificationConfig?.onAction({
      ticketId: ticketId,
      type: type,
      companyId: companyId,
      profileId: profileId,
      endTime: endTime,
      startTime: startTime,
      employeeId: employeeId,
      phoneNumber: phoneNumber,
      feePolicyId: feePolicyId,
    });
    await onSeenNotification(notificationId);
  };
  return (
    <Layout className="h-screen">
      <PrimarySidebar />
      <Layout className="flex-1 overflow-auto bg-slate-200">
        <div className="bg-white">
          <Nav
            mode="horizontal"
            defaultSelectedKeys={['Home']}
            header={
              <div className="font-semibold">Flexpay Dashboard Admin</div>
            }
            footer={
              <>
                <Dropdown
                  showTick
                  position="bottomLeft"
                  className="max-h-[400px] overflow-auto"
                  // clickToHide
                  onClickOutSide={() => setVisibileItem(!visibileItem)}
                  onVisibleChange={(visibile: any) => {
                    // if (visibile) {
                    //   getSeenAll()
                    // } else {
                    reFetchNotification();
                    // }
                  }}
                  render={
                    <div className="flex flex-col px-4 py-6 rounded-3xl max-w-lg min-w-[480px]">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xl">Thông báo</span>
                        <p
                          className="text-gray-700 font-bold cursor-pointer"
                          onClick={getSeenAll}
                        >
                          Đã đọc tất cả
                        </p>
                      </div>
                      <Tabs size="small" type="line" className="mt-3">
                        <TabPane tab="Hệ thống" itemKey="1">
                          {/* {!isLoadingNotification && !isFetchingNotification ? ( */}
                          <div className="flex flex-col gap-2">
                            {notifications?.pages[0]?.notifications?.content
                              ?.length > 0 && notiMaintenance == 'false' ? (
                              <>
                                {getNotificationList()
                                  .flat(1)
                                  .map((notification: any) => {
                                    const responseBody = notification;
                                    let responseSetting: any = null;
                                    try {
                                      responseSetting = JSON.parse(
                                        responseBody?.body
                                      );
                                    } catch (e) {
                                      responseSetting = null;
                                    }
                                    return (
                                      <div
                                        key={responseBody?.id}
                                        onClick={() => {
                                          return onViewNotification(
                                            responseBody.id,
                                            responseSetting
                                          );
                                        }}
                                      >
                                        <Card
                                          className={`${
                                            !notification?.seen
                                              ? 'bg-slate-100'
                                              : ''
                                          } hover:bg-gray-200 cursor-pointer`}
                                        >
                                          <div
                                            onClick={() =>
                                              setVisibileItem(!visibileItem)
                                            }
                                          >
                                            <div className="font-bold flex justify-between">
                                              <div className="flex gap-1 items-center">
                                                {!notification?.seen && (
                                                  <div className="circle text-primary"></div>
                                                )}
                                                {notification?.title}
                                              </div>
                                            </div>
                                            <div className="grid grid-cols-5 gap-4   mt-2">
                                              <div className="col-span-4">
                                                <TextOverflow line={3}>
                                                  {notification?.message}
                                                </TextOverflow>
                                              </div>
                                              <div className="text-sm text-primary font-semibold flex flex-col justify-end items-end">
                                                <div>
                                                  {DateTimeHelper.convertTimeZone(
                                                    notification?.createdAt,
                                                    COMMON_FORMAT.DATE
                                                  )}
                                                </div>
                                                <div>
                                                  {DateTimeHelper.convertTimeZone(
                                                    notification?.createdAt,
                                                    COMMON_FORMAT.FULL_TIME
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </Card>
                                      </div>
                                    );
                                  })}
                                {hasNextPage &&
                                notifications?.pages[0]?.notifications?.content
                                  .length > 0 ? (
                                  <Button onClick={() => fetchNextPage()}>
                                    Tải thêm
                                  </Button>
                                ) : (
                                  ''
                                )}
                              </>
                            ) : (
                              <p>
                                {notiMaintenance == 'true'
                                  ? 'Thông báo đang được bảo trì'
                                  : 'Không có thông báo'}
                              </p>
                            )}
                          </div>
                          {/* ) : (
                          <>
                            <Skeleton />
                          </>
                        )} */}
                        </TabPane>
                      </Tabs>
                    </div>
                  }
                  trigger={'click'}
                  visible={visibileItem}
                >
                  <Badge
                    count={getTotalUnview() <= 0 ? null : getTotalUnview()}
                    theme="solid"
                    className="transform translate-x-4 translate-y-5"
                  >
                    <Button
                      theme="borderless"
                      onClick={checkViewAll}
                      icon={<IconBell size="large" />}
                    />
                  </Badge>
                </Dropdown>

                <Button
                  theme="borderless"
                  icon={
                    <ReactCountryFlag
                      className="emojiFlag"
                      countryCode="vn"
                      svg
                      style={{
                        fontSize: '1.5em',
                        lineHeight: '1.5em',
                      }}
                      aria-label="Viet Nam"
                    />
                  }
                  style={{
                    color: 'var(--semi-color-text-2)',
                    marginRight: '12px',
                  }}
                />

                <Dropdown
                  trigger="click"
                  render={
                    <Dropdown.Menu>
                      <Dropdown.Item
                        onClick={() =>
                          router.push('/accounts/edit-information')
                        }
                      >
                        Thông tin tài khoản
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          signOut({
                            noRedirect: true,
                          })
                        }
                      >
                        Đăng xuất
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  }
                >
                  <Avatar
                    color="orange"
                    size="extra-small"
                    src={flexpayLogo.src}
                  >
                    {/* {profile?.given_name[0]} */}
                  </Avatar>
                </Dropdown>
              </>
            }
          />
        </div>

        <div className="bg-gray-100 py-2 px-5">
          <Breadcrumb>
            <Breadcrumb.Item icon={<IconHome />}>Trang chủ</Breadcrumb.Item>
            {/* <Breadcrumb.Item icon={<IconArticle />}>
              Hệ thống quản lý
            </Breadcrumb.Item> */}

            {!breadcrumbs &&
              getBreadCrumbLabel()?.map((x: any, idx: any) => (
                <Breadcrumb.Item key={idx}>{x}</Breadcrumb.Item>
              ))}

            <Breadcrumb.Item>{getDefaultLabel()}</Breadcrumb.Item>

            {breadcrumbs.map((x: any, idx: any) => (
              <Breadcrumb.Item key={idx}>{x}</Breadcrumb.Item>
            ))}
          </Breadcrumb>
        </div>
        <Content>{children}</Content>
      </Layout>
    </Layout>
  );
};

export default PrimaryLayout;
