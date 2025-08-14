import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { login } from '@/api/auth'
import Logo from '@/assets/logo.svg'

export const Route = createLazyFileRoute('/login')({
  component: Login,
})

function Login() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (error) setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    const response = await login({
      username: formData.username,
      password: formData.password,
    })
    localStorage.setItem('token', response.token)
    localStorage.setItem('username', formData.username)
    console.log('response', response)
    navigate({ to: '/', replace: true })
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-6">
            <div className="relative flex justify-center">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-xl opacity-20 scale-110" />
              <div className="relative bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
                {/* @ts-ignore */}
                <Logo className="h-12 w-auto text-slate-700 dark:text-slate-200" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold  text-slate-900 dark:text-slate-50">欢迎回来</h1>
            </div>
          </div>

          <Card className="border-0 shadow-xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800">
                    {error}
                  </div>
                )}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      用户名
                    </Label>
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="请输入您的用户名"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                      className="h-12 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 "
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        密码
                      </Label>
                      {/* <a href="#" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 ">
                        忘记密码？
                      </a> */}
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="请输入您的密码"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                      className="h-12 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 "
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 cursor-pointer bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-200 shadow-lg "
                >
                  {isLoading ? '登录中...' : '登录'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="text-center text-xs text-slate-500 dark:text-slate-400">© 2025 Memories.ai</div>
        </div>
      </div>
    </div>
  )
}
