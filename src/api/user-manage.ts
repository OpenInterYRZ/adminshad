import { request } from '@/lib/http'

// 用户管理相关类型定义
type UserInfoRequest = {
  keyword?: string
  page?: number
  size?: number
}

type UserRecord = {
  credit: number
  email: string
  name: string
  registerTime: string
  userType: string
  userId: bigint
}

type UserInfoData = {
  current: string
  pages: string
  records: UserRecord[]
  size: string
  total: string
}

type UserInfoResponse = {
  code: string
  data: UserInfoData
  failed: boolean
  msg: string
  success: boolean
}

// 充值历史相关类型定义
type CreditHistoryRequest = {
  endTime?: string
  page?: number
  size?: number
  startTime?: string
  userId?: string
}

type CreditRecord = {
  addCredit?: number
  cost?: number
  email?: string
  name?: string
  orderId?: string
  payChannel?: string
  rechargeTime?: string
  type?: string
  userType?: string
}

type CreditHistoryData = {
  current: string
  pages: string
  records: CreditRecord[]
  size: string
  total: string
}

type CreditHistoryResponse = {
  code: string
  data: CreditHistoryData
  failed: boolean
  msg: string
  success: boolean
}

// 积分变动相关类型定义
type CreditChangeRequest = {
  endTime?: string
  page?: number
  size?: number
  startTime?: string
  userId?: string
}

type CreditChangeRecord = {
  changeAmount?: number
  changeTime?: string
  credit?: number
  email?: string
  name?: string
  source?: string
  userType?: string
}

type CreditChangeData = {
  current: string
  pages: string
  records: CreditChangeRecord[]
  size: string
  total: string
}

type CreditChangeResponse = {
  code: string
  data: CreditChangeData
  failed: boolean
  msg: string
  success: boolean
}

/**GET /user/info */
export async function getUserInfo(params: UserInfoRequest) {
  return request.get<UserInfoResponse>('user/info', {
    searchParams: { ...params },
  })
}

/** 获取用户充值历史 GET /user/{userId}/recharge-records */
export async function getCreditHistory(params: CreditHistoryRequest) {
  return request.get<CreditHistoryResponse>(`payment/${params.userId}/recharge-records`, {
    searchParams: {
      ...params,
    },
  })
}

/** 获取用户积分变动记录 GET /{userId}/credit-records */
export async function getCreditChangeRecords(params: CreditChangeRequest) {
  return request.get<CreditChangeResponse>(`credit/${params.userId}/credit-records`, {
    searchParams: {
      ...params,
    },
  })
}

/** 导出用户充值历史Excel GET /{userId}/recharge-records/export */
export async function exportCreditHistory(
  params: {
    startTime?: string
    endTime?: string
    userId?: string,
  }
) {


  const response = await request.get(`report/${params.userId}/recharge-records/export`, {
    searchParams: {
      ...params,
    },
    raw: true
  })


  const blob = await response.blob()


  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `充值历史_${params.userId}_${new Date().getTime()}.xlsx`
  document.body.appendChild(a)
  a.click()


  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)

  return { success: true }

}


export async function exportCreditRecords(params: {
  startTime?: string
  endTime?: string
  userId?: string,
}) {

  const response = await request.get(`report/${params.userId}/credit-records/export`, {
    searchParams: {
      ...params,
    },
    raw: true
  })
  const blob = await response.blob()
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `积分历史_${params.userId}_${new Date().getTime()}.xlsx`
  document.body.appendChild(a)
  a.click()

  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)

  return { success: true }
}