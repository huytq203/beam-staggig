import { ContentWrapper } from '@components/widgets'
import ConfirmModal from '@components/widgets/ConfirmModal'
import { PrimaryLayout } from '@components/widgets/Layouts'
import { IconEdit, IconSetting, IconSync } from '@douyinfe/semi-icons'

import {
  Modal,
  Notification,
  Pagination,
  Select,
  Table,
  Tag,
} from '@douyinfe/semi-ui'
import { ListFilter } from '@modules/accounts'
import { RolePermissionForm } from '@modules/accounts/form/RolePermissionForm'
import { UserSevice } from '@services/users'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useQuery } from 'react-query'

export async function getServerSideProps(props: any) {
  return {
    props: {
      
    },
  }
}

export default function AccountPage() {
  const router = useRouter()
  const [filter, setFilter] = useState({
    username: '',
    currentPage: 1,
    pageSize: 10,
    accountType: 0,
  })
  const [openModalConfirm, setOpenModalConfirm] = useState(false)
  const [openRolePermission, setOpenRolePermission] = useState(false)
  const [idResetPassword, setIdResetPassword] = useState('')
  const { data, isLoading, refetch } = useQuery(['users', filter], () =>
    UserSevice.getAll(filter),
  )

  const ResetPassword = async (username: any) => {
    const data = await UserSevice.resetPasswordUser(username)
    if (data) {
      Notification.success({
        content: `Cập nhật mật khẩu mới thành công`,
        theme: 'light',
      })
      setOpenModalConfirm(false)
      refetch()
    }
  }

  const columns = [
    {
      title: 'Tên tài khoản',
      dataIndex: 'username',
      width: 200,
    },
    {
      title: 'Tên',
      dataIndex: 'fullName',
      width: 200,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: 200,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      width: 200,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'enabled',
      render: (x: any) => (
        <Tag size="small" color={x ? 'green' : 'red'}>
          {x ? 'Hoạt động' : 'Không hoạt động'}
        </Tag>
      ),
      width: 200,
    },
    {
      title: 'Hành động',
      dataIndex: 'id',
      width: 120,
      render: (userId: any, username: any) => {
        return (
          <div className="flex gap-3 pl-3">
            <IconEdit
              onClick={() => router.push(`/accounts/${userId}`)}
              className="cursor-pointer"
            />
            <IconSetting
              className="cursor-pointer "
              onClick={() => router.push(`/accounts/${userId}/roles`)}
            />
            <IconSync
              className="cursor-pointer text-red-500"
              onClick={() => {
                setOpenModalConfirm(true), setIdResetPassword(username.username)
              }}
            />
          </div>
        )
      },
    },
  ]

  const rowSelection = {
    getCheckboxProps: (record: any) => ({
      disabled: record.name === 'Design docs',
      name: record.name,
    }),
    onSelect: (record: any, selected: any) => {},
    onSelectAll: (selected: any, selectedRows: any) => {},
    onChange: (selectedRowKeys: any, selectedRows: any) => {},
  }

  const getTableData = () => {
    if (!data) return []

    return data?.results.map((x: any) => {
      return {
        ...x,
        key: x.id,
      }
    })
  }

  const accountTypeOptions = [
    {
      label: 'All',
      value: 0,
    },
    {
      label: 'Admin',
      value: 1,
    },
    {
      label: 'HR Account',
      value: 2,
    },
  ]

  return (
    <PrimaryLayout>
      <ContentWrapper
        pageTitle={'Quản lý Quản trị viên'}
        primaryButtonText="Thêm quản trị viên"
        onClickPrimaryButton={() => router.push('/accounts/new')}
        extra={
          <Select
            size="large"
            defaultValue={0}
            onChange={(e: any) => {
              setFilter({ ...filter, accountType: e })
            }}
            optionList={accountTypeOptions}
          />
        }
      >
        <div className="flex flex-col gap-5">
          <ListFilter onFilter={setFilter} />
          <Table
            key="account"
            size="small"
            loading={isLoading}
            columns={columns}
            dataSource={getTableData()}
            pagination={false}
            rowSelection={rowSelection}
          />
          <div className="flex justify-end">
            <Pagination
              currentPage={data?.currentPage}
              total={data?.totalCount}
              pageSize={data?.pageSize}
              onChange={(e: any) => {
                setFilter({
                  ...filter,
                  currentPage: e,
                })
              }}
              showTotal
              {...data}
            />
          </div>
        </div>
        <ConfirmModal
          onOpen={openModalConfirm}
          onClose={() => setOpenModalConfirm(false)}
          onConfirm={() => ResetPassword(idResetPassword)}
          title="Đặt lại mật khẩu"
          content="Bạn có chắc chắn muốn đặt lại mật khẩu ?"
        />

        <Modal visible={openRolePermission} title="Thiết lập quyền hạn">
          <RolePermissionForm />
        </Modal>
      </ContentWrapper>
    </PrimaryLayout>
  )
}
