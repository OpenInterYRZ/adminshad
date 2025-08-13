import { useState, useCallback, useMemo } from 'react'
import { debounce } from 'lodash-es'

export function useProTableSearch<T>(
  initialParams: Record<string, any> = {}
) {
  // 搜索参数状态（用于API请求）
  const [searchParams, setSearchParams] = useState({
    page: 1,
    size: 25,
    ...initialParams
  })
  
  // 输入框显示状态（立即更新）
  const [inputValues, setInputValues] = useState({
    ...initialParams
  })

  const updateParam = useCallback((
    key: string, 
    value: any
  ) => {
    setSearchParams(prev => ({
      ...prev,
      [key]: value,
      page: 1 // 搜索条件变化时重置页码
    }))
  }, [])

  const updateParams = useCallback((
    params: Record<string, any>
  ) => {
    setSearchParams(prev => ({
      ...prev,
      ...params,
      page: 1
    }))
  }, [])

  // 立即更新输入框显示
  const updateInput = useCallback((
    key: string, 
    value: any
  ) => {
    setInputValues(prev => ({
      ...prev,
      [key]: value
    }))
  }, [])

  const resetSearch = useCallback(() => {
    const resetValues = {
      page: 1,
      size: 25,
      ...initialParams
    }
    setSearchParams(resetValues)
    setInputValues({ ...initialParams })
  }, [initialParams])

  const changePage = useCallback((page: number) => {
    setSearchParams(prev => ({ ...prev, page }))
  }, [])

  const changePageSize = useCallback((size: number) => {
    setSearchParams(prev => ({ 
      ...prev, 
      size,
      page: 1
    }))
  }, [])

  // 防抖更新搜索参数
  const debouncedSearch = useMemo(
    () => debounce(updateParam, 300),
    [updateParam]
  )

  return {
    searchParams,
    inputValues,
    updateParam,
    updateParams,
    updateInput,
    resetSearch,
    changePage,
    changePageSize,
    debouncedSearch
  }
}