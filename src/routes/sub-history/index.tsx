import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/sub-history/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">充值历史</h1>
        </div>
      </div>
    </div>
  )
}
