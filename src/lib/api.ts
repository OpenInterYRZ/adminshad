import ky from 'ky'

// 创建 ky 实例
export const api = ky.create({
    prefixUrl: '/api',
    timeout: 10000,
    retry: {
        limit: 3,
        methods: ['get', 'post', 'put', 'delete'],
        statusCodes: [408, 413, 429, 500, 502, 503, 504]
    },
    hooks: {
        beforeRequest: [
            (request) => {
                // 添加认证头
                const token = localStorage.getItem('token')
                if (token) {
                    request.headers.set('Authorization', `Bearer ${token}`)
                }

                // 添加通用请求头
                request.headers.set('Content-Type', 'application/json')
            }
        ],
        afterResponse: [
            async (request, options, response) => {
                // 处理未授权响应
                if (response.status === 401) {
                    localStorage.removeItem('token')
                    window.location.href = '/login'
                }
                return response
            }
        ]
    }
})

// 导出便捷方法
export const apiGet = (url: string, options?: any) => api.get(url, options)
export const apiPost = (url: string, options?: any) => api.post(url, options)
export const apiPut = (url: string, options?: any) => api.put(url, options)
export const apiDelete = (url: string, options?: any) => api.delete(url, options)
