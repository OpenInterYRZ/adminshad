import { useCallback } from 'react'
import { type PaginationData } from '@/components/protable'

export function useProTablePagination<T>(
  data: PaginationData<T> | undefined,
  onPageChange: (page: number) => void,
  onPageSizeChange?: (size: number) => void
) {
  const currentPage = Number(data?.current ?? 1)
  const totalPages = Number(data?.pages ?? 1)
  const pageSize = Number(data?.size ?? 25)
  const total = Number(data?.total ?? 0)

  const canPreviousPage = currentPage > 1
  const canNextPage = currentPage < totalPages

  const previousPage = useCallback(() => {
    if (canPreviousPage) {
      onPageChange(currentPage - 1)
    }
  }, [canPreviousPage, currentPage, onPageChange])

  const nextPage = useCallback(() => {
    if (canNextPage) {
      onPageChange(currentPage + 1)
    }
  }, [canNextPage, currentPage, onPageChange])

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page)
    }
  }, [totalPages, onPageChange])

  return {
    currentPage,
    totalPages,
    pageSize,
    total,
    canPreviousPage,
    canNextPage,
    previousPage,
    nextPage,
    goToPage,
    onPageChange,
    onPageSizeChange
  }
}