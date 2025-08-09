import { createLazyFileRoute, Link } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/user-manage')({
  component: UserManage,
})

function UserManage() {
  return (
    <div>
      <Link to="/sub-history/$id" params={{ id: '1' }}>
        sub-history
      </Link>
      <h1>User Manage</h1>
    </div>
  )
}
