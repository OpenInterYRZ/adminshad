import { request } from '@/lib/http'


type LoginResponse = {
    code: string
    data: {
        token: string
    }
}

/** 登录接口 GET /user/login */
export async function login(params: { username: string, password: string }) {
    return request.get<LoginResponse>('user/login', {
        searchParams: { ...params },
    })
}

type UserResponse = {
    code: string
    data: {
        id: number
        name: string
    }
}

/** 获取用户信息 GET /user/get */
export async function getUser() {
    return request.get<UserResponse>('user/get')
}


type LogoutResponse = {
    code: string
    data: null
}

/** 退出登录 GET /user/logout */
export async function logout(params: { name: string }) {
    return request.get<LogoutResponse>('user/logout', {
        searchParams: { ...params },
    })
}