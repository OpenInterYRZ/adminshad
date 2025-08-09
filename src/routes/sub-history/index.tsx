import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/sub-history/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/sub-history/"!</div>
}
