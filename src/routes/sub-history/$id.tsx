import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getCreditHistory } from '@/api/user-manage'

export const Route = createFileRoute('/sub-history/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  const { data, isLoading } = useQuery({
    queryKey: ['credit-history', id],
    queryFn: () => getCreditHistory(id, {}),
  })
  return <div>Hello "/sub-history/$id" {id}!</div>
}
