import { IMenuOption, menuOptions } from '@constants/menu.constant';
import { useAuth } from '@contexts/authentication';
import { Layout, Nav } from '@douyinfe/semi-ui';
import { AuthHelper } from '@helpers/auth.helper';

import { useRouter } from 'next/router';
import logo from '../../../../../../public/img/logo.png';
import styles from './PrimarySidebar.module.scss';

const PrimarySidebar = (props: any) => {
  const { profile } = useAuth();
  const router = useRouter();
  const currentPath: any[] = router.pathname.split('/');

  const { Sider } = Layout;

  const getCurrentActive = () => {
    let path: any = currentPath[1];
    let slug: any = router.query?.slug;

    let itemKey = router.asPath.slice(1).split('?')[0].split('/').join('-');
    let keyArr = [];
    if (slug) {
      keyArr.push([path, slug.join('-')].join('-'));
      keyArr.push([path, slug[0]].join('-'));
    }

    return [
      ...keyArr,
      path,
      itemKey,
      [currentPath[1], currentPath[2]].join('-'),
      [currentPath[1], currentPath[2]].join('-'),
    ];
  };

  const onClickMenuItem = (item: any) => {
    let currentItem: any;
    for (let i = 0; i < menuOptions.length; i++) {
      if (menuOptions[i].itemKey == item.itemKey) {
        currentItem = menuOptions[i];
        break;
      }
      if (menuOptions[i]?.items) {
        const arr: any = menuOptions[i].items;
        currentItem = arr.find((y: any) => y.itemKey === item.itemKey);
        if (currentItem) break;

        // Check nested items
        for (const subItem of arr) {
          if (subItem.items) {
            currentItem = subItem.items.find(
              (z: any) => z.itemKey === item.itemKey
            );
            if (currentItem) break;
          }
        }
        if (currentItem?.url && !currentItem?.items) {
          router.push(currentItem.url);
        }
      }
    }
    if (currentItem?.url && !currentItem?.items) {
      router.push(currentItem.url);
    }
  };

  const getMenuOptions = () => {
    const listMenuItems: IMenuOption[] = [];

    for (const menuItem of menuOptions) {
      const isLegal = AuthHelper.allowRoleCheck(
        menuItem.allowedRoles,
        profile?.roles
      );

      if (!isLegal) continue;

      if (!menuItem?.items) {
        listMenuItems.push(menuItem);
        continue;
      }

      const itemList = menuItem?.items ?? [];
      const filteredListSubItems = itemList.filter((item: IMenuOption) => {
        if (!item?.allowedRoles) return true;
        return AuthHelper.allowRoleCheck(item.allowedRoles, profile?.roles);
      });

      if (filteredListSubItems.length > 0) {
        const newStateItem = {
          ...menuItem,
          items: filteredListSubItems,
        };

        listMenuItems.push(newStateItem);
      }
    }
    return listMenuItems;
  };

  return (
    <Sider className="hidden md:block">
      <Nav
        bodyStyle={{
          width: '100%',
          height: `calc(100% - 92px)`,
        }}
        onClick={onClickMenuItem}
        className={`h-full text-sidebar ${styles['navbar']} semi-always-dark`}
        style={{
          background: `${
            process.env.NEXT_PUBLIC_BASE !== 'https://admin.flexpay.vn'
              ? '#008000b0'
              : 'linear-gradient(180deg, #1F5567 0%, #1F5567 0.01%, #0D242B 100%)'
          }`,
          color: 'white !important!',
        }}
        items={getMenuOptions()}
        selectedKeys={getCurrentActive()}
        footer={{
          collapseButton: true,
          // collapseText: () => <>Toggle</>,
        }}
      >
        <Nav.Header>
          <img src={logo.src} alt="logo" className="object-cover" id="logo" />
        </Nav.Header>
      </Nav>
    </Sider>
  );
};

export default PrimarySidebar;
