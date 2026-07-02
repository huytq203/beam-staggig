import React from 'react'
import LeftSettingContent from './LeftSettingContent'
import RightSettingContents from './RightSettingContents'

const SettingContent = () => {
    return (
        <div className="grid grid-cols-2 gap-5">
            <div className="p-5">
                <LeftSettingContent />
            </div>
            <div className="p-5">
                <RightSettingContents />
            </div>
        </div>
    )
}

export default SettingContent