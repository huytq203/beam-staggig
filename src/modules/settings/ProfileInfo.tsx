import { Card, Input, Upload } from '@douyinfe/semi-ui';
import React from 'react'
import { IconPlus } from '@douyinfe/semi-icons';

const ProfileInfo = () => {

    let action = '//semi.design/api/upload';
    const defaultFileList = [
        {
            uid: '1',
            name: 'dy.png',
            status: 'success',
            size: '130KB',
            preview: true,
            url: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/dy.png',
        },
    ];

    return (
        <>
            <Card>
                <div className="pb-4 font-bold">
                    Avarta Settings
                </div>
                <Upload action={action} listType="picture" accept="image/*" multiple defaultFileList={defaultFileList as any}>
                    <IconPlus size="extra-large" />
                </Upload>
                <div className="pt-6">
                    <label className="pb-4 font-bold">
                        Username
                    </label>
                    <Input />
                </div>

                <div className="pt-6">
                    <label className="pb-4 font-bold">
                        Fullname
                    </label>
                    <Input />
                </div>
            </Card>
        </>
    );

}

export default ProfileInfo