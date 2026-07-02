import { useProfileContext } from '@contexts/Can';
import { Avatar } from '@douyinfe/semi-ui';
import React from 'react';

const TopProfile = () => {
  const { profile } = useProfileContext();
  return (
    <div>
      <div style={{ position: 'relative' }}>
        <img src="/img/header_profile.png" style={{ width: '100%' }}></img>
        <div
          style={{ position: 'absolute', top: '65%', left: '5%' }}
          className="flex gap-10"
        >
          <Avatar
            src="/img/noavatar.png"
            style={{
              width: '200px',
              height: '200px',
              boxSizing: 'border-box',
              borderRadius: '50%',
              border: '8px solid rgba(38, 184, 147, 0.5)',
              filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))',
            }}
          ></Avatar>
          <div style={{ paddingTop: '80px', paddingLeft: '30px' }}>
            <div className="font-bold text-3xl">{profile?.data?.username}</div>
            <div className="text-xl font-normal" style={{ paddingTop: '20px' }}>
              Software Engineer
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopProfile;
