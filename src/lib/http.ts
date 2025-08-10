import ky, { type Input, type Options, type KyResponse } from 'ky'

export interface Response<T = unknown> {
  code: string
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
        if (!request.headers.has('Authorization')) {
          console.log('!request.headers.hasAuthorizatio')
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
    if (data.code === '0000') return data.data

    if (data.code === '9004') {
      if (typeof window === 'undefined') {
        // redirect('/login')
      } else {
        // signOut()
      }
    }

    // if (data.code === '0402') useUserStore.setState({ credits: true })

    throw new Error(data.msg || 'Unknown error')
  }
}

export const request = {
  get: createRequestMethod('get'),
  post: createRequestMethod('post'),
  put: createRequestMethod('put'),
  delete: createRequestMethod('delete'),
}
