import { Nav } from '@douyinfe/semi-ui'
import React from 'react'
import { IconApartment, IconBolt, IconSetting, IconTop, IconGift } from '@douyinfe/semi-icons';

const NavSettingContent = () => {
    return (
        <>
            <div style={{ width: '100%' }}>
                <Nav
                    mode={'horizontal'}
                    items={[
                        { itemKey: 'normal', text: 'Normal Settings', icon: <IconSetting /> },
                        { itemKey: 'advance', text: 'Advance Settings', icon: <IconBolt /> },
                        { itemKey: 'compay', text: 'Company Settings', icon: <IconApartment /> },
                        { itemKey: 'salary', text: 'Salary Settings', icon: <IconGift /> },
                        { itemKey: 'limit', text: 'Limit Settings', icon: <IconTop /> },
                    ]}
                    header={{

                    }}
                />
            </div>
        </>
    )
}

export default NavSettingContent