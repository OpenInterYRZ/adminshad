import React, { useEffect, useMemo, useState } from 'react'
import { type ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import Calendar23 from './calendar-23'
import { type DateRange } from 'react-day-picker'
import { Pgeli } from './elipg'

// 定义用户数据类型
export interface UserData {
  userId: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive' | 'pending'
  createdAt: string
}

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
}

const mockData: any[] = [
  {
    userId: '585282961264480256',
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
  pages: '100',
  records: mockData,
  size: '25',
  total: '100',
}

export function ProTable<T extends Record<string, any>>({ columns, loading = false, onSearch, searchItems, buttons, params = {} }: ProTableProps<T>) {
  const [searchValues, setSearchValues] = useState<Record<string, any>>({ page: 1, size: 25, ...params })
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [pgData, setPgData] = useState<PaginationData<T> | null>(mockPaginationData)

  useEffect(() => {
    if (onSearch) {
      console.log('searchValues', searchValues)
      onSearch(searchValues).then((result: any) => {
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
    const resetValues = { page: 1, size: 25, ...params }
    setSearchValues(resetValues)
    setDateRange(undefined)

    if (onSearch) {
      const result = await onSearch(resetValues)
      setPgData(result)
    }
  }

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
      <div className="flex items-center gap-4 mb-8 md:flex-row flex-col">
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
        <div className="flex-start">{searchItems?.calendar && <Calendar23 dateRange={dateRange} onDateRangeChange={handleDateRangeChange} />} </div>
        <div className="flex gap-4">
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
        </div>
      </div>

      <div className="flex items-center gap-2 justify-start">
        {buttons &&
          buttons.map((item) => (
            <Button
              key={item.title}
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

      {pgData && (
        <Pgeli pgData={pgData} handlePreviousPage={handlePreviousPage} handleNextPage={handleNextPage} handlePageChange={handlePageChange} />
      )}
    </div>
  )
}
