import { createFileRoute } from '@tanstack/react-router'

import { exportCreditRecords, getCreditChangeRecords } from '@/api/user-manage'
import { ProTable, type ProTableColumn } from '@/components/protable'
import { useQuery } from '@tanstack/react-query'

export const Route = createFileRoute('/credit-history/$id')({
  component: RouteComponent,
})

const columns: ProTableColumn<any>[] = [
  {
    key: 'name',
    title: '用户昵称',
    dataIndex: 'name',
  },
  {
    key: 'email',
    title: '邮箱',
    dataIndex: 'email',
  },
  {
    key: 'userType',
    title: '订阅类型',
    dataIndex: 'userType',
  },

  {
    key: 'changeTime',
    title: '变动时间',
    dataIndex: 'changeTime',
  },
  {
    key: 'changeAmount',
    title: '兑换积分',
    dataIndex: 'changeAmount',
  },
]

function RouteComponent() {
  const { id } = Route.useParams() as { id: string }

  // 处理导出按钮点击
  const handleExport = async (searchParams: any) => {
    await exportCreditRecords({
      userId: id,
      startTime: searchParams?.startTime,
      endTime: searchParams?.endTime,
    })
  }

  const { data, isLoading } = useQuery({
    queryKey: ['creditHistory', id],
    queryFn: () => getCreditChangeRecords({ userId: id, page: 1, size: 10 }),
  })
  // @ts-ignore
  const credit = data?.records[0]?.credit
  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">
            积分历史 -- 用户 {id} -- 积分剩余：{credit} 积分
          </h1>
        </div>

        <ProTable
          columns={columns}
          onSearch={getCreditChangeRecords}
          queryKey={['credit-history', id]}
          params={{ userId: id }}
          searchItems={{
            calendar: true,
          }}
          buttons={[{ title: '导出', onClick: handleExport }]}
        />
      </div>
    </div>
  )
}
