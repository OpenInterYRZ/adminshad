import React, { useMemo, useState } from 'react'
import { type ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useQuery } from '@tanstack/react-query'
import Calendar23 from './calendar-23'
import { type DateRange } from 'react-day-picker'
import { Pgeli } from './elipg'
import { Loader2 } from 'lucide-react'

export interface PaginationData<T> {
  current: string
  pages: string
  records: T[]
  size: string
  total: string
}

export interface ProTableColumn<T> {
  key: keyof T | string
  title: string
  dataIndex?: keyof T
  render?: (value: any, record: T, index: number) => React.ReactNode
  width?: number
}

export interface FilterConfig {
  name?: string
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
  const [searchValues, setSearchValues] = useState<Record<string, any>>({ page: 1, size: 25, ...params })
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)

  const { data, isLoading, refetch } = useQuery({
    queryKey: [queryKey, searchValues],
    queryFn: () => onSearch(searchValues),
    enabled: !!onSearch,
  })
  console.log('queryKey', searchValues)
  const formatDateToString = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target
    setSearchValues((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range)
    if (range?.from && range?.to) {
      const startTime = formatDateToString(range.from)
      const endTime = formatDateToString(range.to)

      setSearchValues((prev) => ({
        ...prev,
        startTime,
        endTime,
      }))
    } else {
      setSearchValues((prev) => ({
        ...prev,
        startTime: '',
        endTime: '',
      }))
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
      size: col.width,
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
    const resetValues = { page: 1, size: 25, ...params }
    setSearchValues(resetValues)
    setDateRange(undefined)
  }

  const handlePageChange = async (page: number) => {
    const newSearchValues = { ...searchValues, page }
    setSearchValues(newSearchValues)
  }

  const handlePreviousPage = () => {
    const currentPage = Number(data?.current || 1)
    if (currentPage > 1) {
      handlePageChange(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    const currentPage = Number(data?.current || 1)
    const totalPages = Number(data?.pages || 1)
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-start">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-4 items-center">
          {searchItems?.input?.map((item) => (
            <div key={item.apiName} className="flex flex-col space-y-2">
              <span className="text-sm font-medium text-muted-foreground">{item.title}</span>
              <Input
                name={item.apiName}
                value={searchValues[item.apiName] || ''}
                placeholder={`请输入${item.title}`}
                className="h-10"
                onChange={handleInputChange}
              />
            </div>
          ))}
          {searchItems?.calendar && (
            <div className="flex flex-col space-y-2">
              <span className="text-sm font-medium text-muted-foreground">日期筛选</span>
              <Calendar23 dateRange={dateRange} onDateRangeChange={handleDateRangeChange} />
            </div>
          )}
        </div>
        <div className="flex gap-3 items-start pt-7">
          <Button
            size="default"
            className="min-w-[72px]"
            onClick={async () => {
              if (onSearch) {
                refetch(searchValues)
              }
            }}
          >
            查询
          </Button>
          <Button variant="outline" size="default" className="min-w-[72px]" onClick={handleReset}>
            重置
          </Button>
        </div>
      </div>

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
                  console.log('searchValues', searchValues)
                  const { page, size, ...rest } = searchValues
                  console.log('rest', rest)
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
      {data && <Pgeli pgData={data} handlePreviousPage={handlePreviousPage} handleNextPage={handleNextPage} handlePageChange={handlePageChange} />}
    </div>
  )
}
