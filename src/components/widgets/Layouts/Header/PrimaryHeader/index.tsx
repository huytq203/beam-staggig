import { Container, LocaleSwitcher } from '@components/widgets';
import {
  IconAppCenter,
  IconBell,
  IconLanguage,
  IconStar,
  IconUser,
} from '@douyinfe/semi-icons';
import { Avatar, Button, Layout, Nav } from '@douyinfe/semi-ui';
import { useRouter } from 'next/router';

const PrimaryHeader = () => {
  const { Header } = Layout;

  const router = useRouter();

  const handleLocaleChange = (event: any) => {
    const value = event.target.value;

    router.push(router.route, router.asPath, {
      locale: value,
    });
  };

  return (
    <Header className="w-full">
      <div className="bg-slate-800">
        <Container>
          <Nav
            mode="horizontal"
            className="bg-inherit px-0"
            style={{
              height: '70px',
            }}
            defaultSelectedKeys={['Home']}
          >
            <Nav.Header>
              <span className="font-bold text-white">BEAM</span>
            </Nav.Header>
            <Nav.Footer>
              <div className="flex items-center gap-2">
                <LocaleSwitcher />
                <Button theme="borderless" icon={<IconBell size="large" />} />
                <Button
                  theme="borderless"
                  color="white"
                  icon={<IconLanguage size="large" />}
                />
                <Avatar
                  onClick={() => router.push('/profile')}
                  color="orange"
                  size="small"
                >
                  D
                </Avatar>
              </div>
            </Nav.Footer>
          </Nav>
        </Container>
      </div>

      <div className="bg-white shadow-navbar">
        <Container>
          <Nav
            mode="horizontal"
            className="bg-white px-0 border-none"
            style={{
              height: '46px',
            }}
            defaultSelectedKeys={['Home']}
          >
            <Nav.Sub
              itemKey={'union-management'}
              text="Dashboards"
              icon={<IconAppCenter />}
            >
              <Nav.Item itemKey={'notice'} text={'Account Management'} />
              <Nav.Item itemKey={'query'} text={'Transactions'} />
              <Nav.Item itemKey={'info'} text={'Billings'} />
            </Nav.Sub>
            <Nav.Item
              icon={<IconUser />}
              onClick={() => router.push('/accounts')}
              itemKey={'info'}
              text={'Account Management'}
            />
            <Nav.Item
              itemKey={'union'}
              text={'Transactions'}
              icon={<IconStar />}
            />
          </Nav>
        </Container>
      </div>
    </Header>
  );
};

export default PrimaryHeader;
