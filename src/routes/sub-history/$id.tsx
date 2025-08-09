import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/sub-history/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  return <div>Hello "/sub-history/$id" {id}!</div>
}
