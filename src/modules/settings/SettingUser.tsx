import NavSettingContent from '@modules/settings/NavSettingContent'
import React from 'react'
import SettingContent from './SettingContent'
import SettingHeader from './SettingHeader'

const SettingUser = () => {
    return (
        <div className="">
            <div>
                <SettingHeader />
            </div>
            <div>
                <NavSettingContent />
            </div>
            <div>
                <SettingContent />
            </div>
        </div>
    )
}

export default SettingUser