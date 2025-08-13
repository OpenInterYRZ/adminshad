import React, { useMemo, useState } from 'react'
import { type ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useQuery } from '@tanstack/react-query'
import { type DateRange } from 'react-day-picker'
import { Pgeli } from './elipg'
import { Loader2 } from 'lucide-react'
import { useProTableSearch } from '@/hooks/useProTableSearch'
import { useProTablePagination } from '@/hooks/useProTablePagination'
import { ProTableSearch } from './ProTableSearch'

export interface PaginationData<T> {
  current: string
  pages: string
  records: T[]
  size: string
  total: string
}

export interface ProTableColumn<T> {
  key: string // 唯一标识
  title: string
  dataIndex?: keyof T | string
  render?: (value: any, record: T, index: number) => React.ReactNode
  width?: number | string
  align?: 'left' | 'center' | 'right'
  ellipsis?: boolean
  sortable?: boolean
  filterable?: boolean
}

export interface ProTableProps<T> {
  columns: ProTableColumn<T>[]
  searchItems?: {
    input?: { title: string; apiName: string }[]
    calendar?: boolean
    select?: {
      options: { label: string; value: string }[]
    }
  }
  loading?: boolean
  onSearch?: any
  params?: any
  buttons?: {
    title: string
    onClick: any
  }[]
  queryKey?: string[] // 添加queryKey参数
}

export function ProTable<T extends Record<string, any>>({
  columns,
  loading = false,
  onSearch,
  searchItems,
  buttons,
  params = {},
  queryKey = ['pro-table'],
}: ProTableProps<T>) {
  const { searchParams, inputValues, updateInput, updateParam, resetSearch, changePage, debouncedSearch } = useProTableSearch(params)
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)

  const { data, isLoading, refetch } = useQuery({
    queryKey: [queryKey, searchParams],
    queryFn: () => onSearch(searchParams),
    enabled: !!onSearch,
  })

  const { previousPage, nextPage, goToPage } = useProTablePagination(data, changePage)
  const formatDateToString = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range)
    if (range?.from && range?.to) {
      const startTime = formatDateToString(range.from)
      let endTime = formatDateToString(range.to)

      if (startTime === endTime) {
        const nextDay = new Date(range.to)
        nextDay.setDate(nextDay.getDate() + 1)
        endTime = formatDateToString(nextDay)
      }

      updateParam('startTime', startTime)
      updateParam('endTime', endTime)
    } else {
      updateParam('startTime', '')
      updateParam('endTime', '')
    }
  }

  const tableColumns: ColumnDef<T>[] = useMemo(() => {
    return columns.map((col) => ({
      id: col.key as string,
      accessorKey: col.key,
      header: col.title,
      cell: ({ row, getValue }) => {
        const value = getValue()
        const record = row.original
        const index = row.index

        if (col.render) {
          return col.render(value, record, index)
        }

        return value
      },
      size: typeof col.width === 'number' ? col.width : undefined,
      // enableSorting: col.sorter !== false, // 如果有sorter配置
    }))
  }, [columns])
  const tableData = useMemo(() => data?.records || [], [data?.records])
  const table = useReactTable({
    data: tableData,
    columns: tableColumns,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  const handleReset = async () => {
    resetSearch()
    setDateRange(undefined)
    console.log('searchParams', searchParams)
    refetch()
  }

  return (
    <div className="space-y-6">
      <ProTableSearch
        searchItems={searchItems}
        values={inputValues}
        dateRange={dateRange}
        onChange={(key, value) => {
          updateInput(key, value)
          debouncedSearch(key, value)
        }}
        onDateRangeChange={handleDateRangeChange}
        onSearch={async () => {
          if (onSearch) {
            refetch()
          }
        }}
        onReset={handleReset}
      />

      {buttons && buttons.length > 0 && (
        <div className="flex items-center gap-3 pt-2 border-t border-border/40">
          <div className="text-sm text-muted-foreground font-medium py-3">操作</div>
          <div className="flex gap-2">
            {buttons.map((item) => (
              <Button
                key={item.title}
                variant="default"
                size="sm"
                onClick={() => {
                  const { page, size, ...rest } = searchParams
                  item.onClick({ ...rest })
                }}
              >
                {item.title}
              </Button>
            ))}
          </div>
        </div>
      )}
      {isLoading ? (
        <div className="rounded-md border bg-card h-100 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Loader2 className="animate-spin" />
            加载中...
          </div>
        </div>
      ) : (
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    {loading ? '加载中...' : '暂无数据'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
      {data && <Pgeli pgData={data} handlePreviousPage={previousPage} handleNextPage={nextPage} handlePageChange={goToPage} />}
    </div>
  )
}
