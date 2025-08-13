import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="space-y-3">
          <h1 className="text-4xl font-light tracking-wide text-slate-900 dark:text-slate-50">Welcome</h1>
          <div className="w-24 h-px bg-slate-200 dark:bg-slate-700 mx-auto"></div>
          <p className="text-lg text-muted-foreground font-light">Memories.ai 管理系统</p>
        </div>
      </div>
    </div>
  )
}
