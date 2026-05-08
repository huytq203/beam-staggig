import { getContentNavProfile } from '@constants/profile/profile.constant';
import { IconClock, IconHome, IconSetting } from '@douyinfe/semi-icons';
import { Nav } from '@douyinfe/semi-ui';
import { useState } from 'react';

const MainProfile = () => {
  const [activeTab, setActiveTab] = useState(['profile']);
  const handleSelect = (data: any) => {
    setActiveTab([...data?.selectedKeys]);
  };

  return (
    <>
      <div className="flex">
        <Nav
          style={{
            maxWidth: 280,
            width: 280,
            height: '100%',
            backgroundColor: '#fff',
            marginTop: '20px',
          }}
          selectedKeys={activeTab}
          defaultSelectedKeys={['profile']}
          items={[
            {
              itemKey: 'profile',
              text: 'Profile',
              icon: <IconHome size="large" />,
            },
            {
              itemKey: 'changePassword',
              text: 'Change Password',
              icon: <IconClock size="large" />,
            },
            {
              itemKey: 'setting',
              text: 'Setting',
              icon: <IconSetting size="large" />,
            },
          ]}
          onSelect={(data) => handleSelect(data)}
        />
        {getContentNavProfile(activeTab[0])?.content}
      </div>
    </>
  );
};

export default MainProfile;
