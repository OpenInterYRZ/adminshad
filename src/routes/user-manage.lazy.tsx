import { createLazyFileRoute } from '@tanstack/react-router'
import { ProTable, type ProTableColumn, type UserData, mockUserData, type FilterConfig } from '@/components/protable'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export const Route = createLazyFileRoute('/user-manage')({
  component: UserManage,
})

function UserManage() {
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
      render: (value: UserData['status']) => {
        const statusConfig = {
          active: { label: '活跃', variant: 'success' as const },
          inactive: { label: '非活跃', variant: 'secondary' as const },
          pending: { label: '待审核', variant: 'warning' as const },
        }
        const config = statusConfig[value]
        return <Badge variant={config.variant}>{config.label}</Badge>
      },
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
          <Button size="sm" variant="outline" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button size="sm" variant="destructive" onClick={() => handleDelete(record)}>
            删除
          </Button>
        </div>
      ),
    },
  ]

  const handleSearch = (filters: FilterConfig) => {
    console.log('搜索条件:', filters)
  }

  const handleReset = () => {
    console.log('重置筛选条件')
  }

  const handleEdit = (record: UserData) => {
    console.log('编辑用户:', record)
  }

  const handleDelete = (record: UserData) => {
    console.log('删除用户:', record)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">用户管理</h1>
          <p className="text-muted-foreground">管理系统用户信息</p>
        </div>

        <ProTable columns={columns} dataSource={mockUserData} onSearch={handleSearch} onReset={handleReset} searchItems={{ input: ['name'] }} />
      </div>
    </div>
  )
}
