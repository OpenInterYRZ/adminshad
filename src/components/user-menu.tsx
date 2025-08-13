import { LogOut, User } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { logout } from '@/api/auth'
import { toast } from 'sonner'

export function UserMenu() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      const username = localStorage.getItem('username') || 'user'

      await logout({ name: username })

      localStorage.removeItem('token')
      localStorage.removeItem('username')

      navigate({ to: '/login', replace: true })
    } catch (error) {
      toast.error('退出登录失败')

      localStorage.removeItem('token')
      localStorage.removeItem('username')
      navigate({ to: '/login', replace: true })
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <User className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">用户菜单</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          登出
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
