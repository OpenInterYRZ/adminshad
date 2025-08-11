import { createLazyFileRoute, useRouter } from '@tanstack/react-router'
import { ProTable, type ProTableColumn, type UserData } from '@/components/protable'
import { Button } from '@/components/ui/button'

import { getUserInfo, exportCreditHistory } from '@/api/user-manage'

export const Route = createLazyFileRoute('/user-manage')({
  component: UserManage,
})

function UserManage() {
  const router = useRouter()

  const columns: ProTableColumn<UserData>[] = [
    {
      key: 'name',
      title: '姓名',
      dataIndex: 'name',
    },
    {
      key: 'email',
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      key: 'role',
      title: '角色',
      dataIndex: 'role',
    },
    {
      key: 'status',
      title: '状态',
      dataIndex: 'status',
    },
    {
      key: 'createdAt',
      title: '创建时间',
      dataIndex: 'createdAt',
    },
    {
      key: 'actions',
      title: '操作',
      render: (_, record: UserData) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              router.navigate({
                to: '/sub-history/$id',
                params: {
                  id: record.userId,
                },
              })
            }}
          >
            充值历史
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              router.navigate({
                to: '/credit-history/$id',
                params: {
                  id: record.userId,
                },
              })
            }}
          >
            积分历史
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">用户管理</h1>
        </div>

        <ProTable
          columns={columns}
          onSearch={getUserInfo}
          searchItems={{
            input: [
              { title: '名字', apiName: 'name' },
              { title: '邮箱', apiName: 'email' },
            ],
            calendar: true,
          }}
        />
      </div>
    </div>
  )
}
