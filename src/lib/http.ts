import ky, { type Input, type Options, type KyResponse } from 'ky'

export interface Response<T = unknown> {
  code: number
  data: T
  msg: string
}

interface requestOptions extends Omit<Options, 'method'> {
  raw?: boolean
}

export const instance = ky.create({
  prefixUrl: import.meta.env.VITE_API_BASE_URL || '',

  timeout: 600000,
  retry: 0,
  hooks: {
    beforeRequest: [
      async (request) => {
        // 自动添加认证 token
        const token = localStorage.getItem('token')
        if (token && !request.headers.has('Authorization')) {
          request.headers.set('Authorization', `Bearer ${token}`)
        }
      },
    ],
    beforeError: [
      (error) => {
        if (error.response?.status === 429) {
          error.name = 'TooManyRequestsError'
          error.message = 'The system is busy, please try again later.'
        }
        return error
      },
    ],
  },
})

function createRequestMethod(method: 'get' | 'post' | 'put' | 'delete'): {
  <T>(url: Input, options?: requestOptions & { raw?: false }): Promise<T>
  <T>(url: Input, options: requestOptions & { raw: true }): Promise<KyResponse<Response<T>>>
}

function createRequestMethod(method: 'get' | 'post' | 'put' | 'delete') {
  return async <T>(url: Input, options?: requestOptions) => {
    const { raw = false, ...kyOptions } = options || {}

    if (raw) return instance[method]<T>(url, kyOptions)

    const response = await instance[method](url, kyOptions)

    const data = (await response.json()) as Response<T>
    if (data.code === 0) return data.data

    console.log("1")
    // 认证失败，清除本地 token 并重定向到登录页
    localStorage.removeItem('token')
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }


  }
}

export const request = {
  get: createRequestMethod('get'),
  post: createRequestMethod('post'),
  put: createRequestMethod('put'),
  delete: createRequestMethod('delete'),
}
