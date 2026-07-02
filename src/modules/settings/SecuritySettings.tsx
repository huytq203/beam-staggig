import { Card, Input, Switch } from '@douyinfe/semi-ui'
import React from 'react'

const SecuritySettings = () => {
    return (
        <div>
            <Card className="p-4">
                <div className="pb-4 font-bold text-xl">
                    Security Settings
                </div>

                <div className="pt-6">
                    <label className="pb-4 font-bold">
                        Notify
                    </label>
                    <div className="grid grid-cols-4 gap-5">
                        <div className="pl-5 pt-4">
                            <div className="pb-6">
                                Email
                            </div>
                            <div className="pb-6">
                                Comment
                            </div>
                            <div className="pb-4">
                                Reminder
                            </div>
                        </div>
                        <div className="pt-2">
                            <div className="pb-1">
                                <Switch checkedText="on" uncheckedText="off" size="large" />
                            </div>
                            <div className="pb-2">
                                <Switch checkedText="on" uncheckedText="off" size="large" />
                            </div>
                            <div className="pb-2">
                                <Switch checkedText="on" uncheckedText="off" size="large" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-6">
                    <label className="pb-4 font-bold  flex items-center gap-5">
                        Enable
                        <Switch checkedText="on" uncheckedText="off" size="large" />
                    </label>
                </div>
            </Card>
        </div>
    )
}

export default SecuritySettings