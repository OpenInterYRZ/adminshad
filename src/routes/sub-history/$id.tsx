import { createFileRoute } from '@tanstack/react-router'

import { exportCreditHistory, getCreditHistory } from '@/api/user-manage'
import { ProTable, type ProTableColumn } from '@/components/protable'

export const Route = createFileRoute('/sub-history/$id')({
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
    key: 'paymentType',
    title: '消费类型',
    dataIndex: 'paymentType',
  },
  {
    key: 'rechargeTime',
    title: '消费时间',
    dataIndex: 'rechargeTime',
  },
  {
    key: 'addCredit',
    title: '兑换积分',
    dataIndex: 'addCredit',
  },
]

function RouteComponent() {
  const { id } = Route.useParams() as { id: string }

  // 处理导出按钮点击
  const handleExport = async (searchParams: any) => {
    await exportCreditHistory({
      userId: id,
      startTime: searchParams?.startTime,
      endTime: searchParams?.endTime,
    })
  }

  // const { data, isLoading } = useQuery({
  //   queryKey: ['creditHistory', id],
  //   queryFn: () => getCreditHistory(id, { page: 1, size: 10 }),
  // })
  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">充值历史</h1>
        </div>

        <ProTable
          columns={columns}
          onSearch={getCreditHistory}
          queryKey={['sub-history', id]}
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
