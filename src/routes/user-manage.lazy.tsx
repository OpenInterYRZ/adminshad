import { createLazyFileRoute, useRouter } from '@tanstack/react-router'
import { ProTable, type ProTableColumn } from '@/components/protable'
import { Button } from '@/components/ui/button'

import { getUserInfo } from '@/api/user-manage'

export const Route = createLazyFileRoute('/user-manage')({
  component: UserManage,
})

function UserManage() {
  const router = useRouter()

  const columns: ProTableColumn<any>[] = [
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
      key: 'registerTime',
      title: '注册时间',
      dataIndex: 'registerTime',
    },
    {
      key: 'credit',
      title: '剩余积分',
      dataIndex: 'credit',
    },
    {
      key: 'userType',
      title: '订阅类型',
      dataIndex: 'userType',
    },
    {
      key: 'actions',
      title: '操作',
      render: (_, record: any) => (
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
          queryKey={['user-manage']}
          searchItems={{
            input: [
              { title: '名字/邮箱', apiName: 'keyword' },
              { title: '名字/邮箱1', apiName: 'keyword1' },
              { title: '名字/邮箱2', apiName: 'keyword2' },
              { title: '名字/邮箱3', apiName: 'keyword3' },
              { title: '名字/邮箱4', apiName: 'keyword4' },
            ],
            calendar: true,
          }}
        />
      </div>
    </div>
  )
}
