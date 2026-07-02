import React from 'react'

const AccountInfo = (props: any) => {
    const { profile } = props
    const listInfor = [
        {
            label: 'Loại tài khoản nhận ứng',
            content: "Tài khoản ngân hàng",
        },
        {
            label: 'Tên ngân hàng',
            content: profile.bankName,
        },
        {
            label: 'Số tài khoản',
            content: profile.bankAccountNumber
        },
        {
            label: 'Tên chủ tài khoản',
            content: profile.bankHolderName
        },

    ]

    return (
        <div className="grid grid-cols-2 gap-4">
            {listInfor.map((cur: any) => {
                return (<>
                    <InfoDetails label={cur.label} content={cur.content} />
                </>)
            })}
        </div>
    )
}

const InfoDetails = (props: any) => {
    const { label, content } = props
    return (
        <div>
            <div>
                <strong>{label}</strong>
            </div>
            <div>
                <>{content}</>
            </div>
        </div>
    )
}
export default AccountInfo