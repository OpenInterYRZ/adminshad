import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/credit-history/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/credit-history/"!</div>
}
