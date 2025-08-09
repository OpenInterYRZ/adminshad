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
  userId: number
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
  return request.get<UserInfoResponse>('/user/info', {
    searchParams: { ...params },
  })
}

/** 获取用户充值历史 GET /user/{userId}/recharge-records */
export async function getCreditHistory(userId: string, params: CreditHistoryRequest) {
  return request.get<CreditHistoryResponse>(`/user/${userId}/recharge-records`, {
    searchParams: {
      ...params,
    },
  })
}

/** 获取用户积分变动记录 GET /user/{userId}/credit-records */
export async function getCreditChangeRecords(userId: string, params: CreditChangeRequest) {
  return request.get<CreditChangeResponse>(`/user/${userId}/credit-records`, {
    searchParams: {
      ...params,
    },
  })
}

/** 导出用户充值历史Excel GET /user/{userId}/recharge-records/export */
export async function exportCreditHistory(
  userId: string,
  params: {
    startTime?: string
    endTime?: string
  }
) {
  return request.get(`/user/${userId}/recharge-records/export`, {
    searchParams: {
      ...params,
    },
  })
}
