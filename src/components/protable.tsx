import React, { useMemo, useState } from 'react'
import { type ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import Calendar23 from './calendar-23'
import { type DateRange } from 'react-day-picker'

// 定义用户数据类型
export interface UserData {
  userId: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive' | 'pending'
  createdAt: string
}

// 定义分页数据接口
export interface PaginationData<T> {
  current: string
  pages: string
  records: T[]
  size: string
  total: string
}

// 定义表格配置接口
export interface ProTableColumn<T> {
  key: keyof T | string
  title: string
  dataIndex?: keyof T
  render?: (value: any, record: T, index: number) => React.ReactNode
  width?: number
}

// 定义筛选配置
export interface FilterConfig {
  name?: string
}

// ProTable组件属性
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
  onSearch?: (params: any) => Promise<PaginationData<T>>
  onReset?: any
}

const mockData: any[] = [
  {
    userId: '1',
    name: '张三',
    email: 'zhangsan@example.com',
    role: '管理员',
    status: 'active',
    createdAt: '2024-01-15',
  },
  {
    userId: '2',
    name: '李四',
    email: 'lisi@example.com',
    role: '用户',
    status: 'inactive',
    createdAt: '2024-01-16',
  },
  {
    userId: '3',
    name: '王五',
    email: 'wangwu@example.com',
    role: '管理员',
    status: 'active',
    createdAt: '2024-01-17',
  },
  {
    userId: '1',
    name: '张三',
    email: 'zhangsan@example.com',
    role: '管理员',
    status: 'active',
    createdAt: '2024-01-15',
  },
]

const mockPaginationData: PaginationData<any> = {
  current: '1',
  pages: '10',
  records: mockData,
  size: '25',
  total: '100',
}

export function ProTable<T extends Record<string, any>>({ columns, loading = false, onSearch, onReset, searchItems }: ProTableProps<T>) {
  const [searchValues, setSearchValues] = useState<Record<string, any>>({ page: 1, size: 25 })
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [pgData, setPgData] = useState<PaginationData<T> | null>(mockPaginationData)

  // 初始加载数据
  React.useEffect(() => {
    if (onSearch) {
      onSearch(searchValues).then((result) => {
        setPgData(result)
      })
    }
  }, [])

  // const { data, isLoading, refetch } = useQuery({
  //   queryKey: ['user-manage'],
  //   queryFn: () => onSearch(searchValues),
  //   enabled: !!onSearch,
  // })

  const formatDateToString = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target
    console.log('name', name)
    console.log('value', value)
    setSearchValues((prev) => ({
      ...prev,
      [name]: value,
    }))
    console.log('searchValues', searchValues)
  }

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range)
    if (range?.from && range?.to) {
      const startDate = formatDateToString(range.from)
      const endDate = formatDateToString(range.to)

      setSearchValues((prev) => ({
        ...prev,
        startDate,
        endDate,
      }))
    } else {
      setSearchValues((prev) => ({
        ...prev,
        startDate: '',
        endDate: '',
      }))
    }
  }

  const tableColumns: ColumnDef<T>[] = useMemo(() => {
    return columns.map((col) => ({
      id: col.key as string,
      accessorKey: col.dataIndex || col.key,
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
    }))
  }, [columns])

  const table = useReactTable({
    data: pgData?.records || [],
    columns: tableColumns,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  const handleReset = async () => {
    const resetValues = { page: 1, size: 25 }
    setSearchValues(resetValues)
    setDateRange(undefined)

    if (onSearch) {
      const result = await onSearch(resetValues)
      setPgData(result)
    }

    if (onReset) {
      onReset()
    }
  }

  // 分页处理函数
  const handlePageChange = async (page: number) => {
    const newSearchValues = { ...searchValues, page }
    setSearchValues(newSearchValues)
    if (onSearch) {
      const result = await onSearch(newSearchValues)
      setPgData(result)
    }
  }

  const handlePreviousPage = () => {
    const currentPage = Number(pgData?.current || 1)
    if (currentPage > 1) {
      handlePageChange(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    const currentPage = Number(pgData?.current || 1)
    const totalPages = Number(pgData?.pages || 1)
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        {searchItems?.input?.map((item) => (
          <div key={item.apiName} className="flex items-center space-x-2">
            <span>{item.title}</span>
            <Input
              name={item.apiName}
              value={searchValues[item.apiName] || ''}
              placeholder={`请输入${item.title}`}
              className="w-60"
              onChange={handleInputChange}
            />
          </div>
        ))}
        {searchItems?.calendar && <Calendar23 dateRange={dateRange} onDateRangeChange={handleDateRangeChange} />}
      </div>
      <Button
        onClick={async () => {
          if (onSearch) {
            const result = await onSearch(searchValues)
            setPgData(result)
          }
        }}
      >
        查询
      </Button>
      <Button variant="outline" onClick={handleReset}>
        重置
      </Button>
      <div className="overflow-hidden rounded-md border">
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

      {/* 分页组件 */}
      {pgData && (
        <div className="flex justify-center ">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={handlePreviousPage}
                  className={Number(pgData.current) <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>

              {/* 页码 */}
              {(() => {
                const current = Number(pgData.current)
                const total = Number(pgData.pages)
                const pages = []

                if (total <= 7) {
                  // 总页数不超过7页，显示所有页码
                  for (let i = 1; i <= total; i++) {
                    pages.push(
                      <PaginationItem key={i}>
                        <PaginationLink onClick={() => handlePageChange(i)} isActive={i === current} className="cursor-pointer">
                          {i}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  }
                } else {
                  // 总页数超过7页，使用省略号
                  // 始终显示第一页
                  pages.push(
                    <PaginationItem key={1}>
                      <PaginationLink onClick={() => handlePageChange(1)} isActive={1 === current} className="cursor-pointer">
                        1
                      </PaginationLink>
                    </PaginationItem>
                  )

                  if (current > 3) {
                    // 如果当前页距离第一页较远，显示省略号
                    pages.push(
                      <PaginationItem key="ellipsis-start">
                        <PaginationEllipsis />
                      </PaginationItem>
                    )
                  }

                  // 显示当前页前后的页码
                  const start = Math.max(2, current - 1)
                  const end = Math.min(total - 1, current + 1)

                  for (let i = start; i <= end; i++) {
                    if (i !== 1 && i !== total) {
                      pages.push(
                        <PaginationItem key={i}>
                          <PaginationLink onClick={() => handlePageChange(i)} isActive={i === current} className="cursor-pointer">
                            {i}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    }
                  }

                  if (current < total - 2) {
                    // 如果当前页距离最后一页较远，显示省略号
                    pages.push(
                      <PaginationItem key="ellipsis-end">
                        <PaginationEllipsis />
                      </PaginationItem>
                    )
                  }

                  // 始终显示最后一页
                  if (total > 1) {
                    pages.push(
                      <PaginationItem key={total}>
                        <PaginationLink onClick={() => handlePageChange(total)} isActive={total === current} className="cursor-pointer">
                          {total}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  }
                }

                return pages
              })()}

              <PaginationItem>
                <PaginationNext
                  onClick={handleNextPage}
                  className={Number(pgData.current) >= Number(pgData.pages) ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}
