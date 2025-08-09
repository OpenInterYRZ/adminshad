'use client'

import * as React from 'react'
import { type ColumnDef, type ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { SearchIcon } from 'lucide-react'

// 定义用户数据类型
export interface UserData {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive' | 'pending'
  createdAt: string
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
    input?: string[]
    calendar?: boolean
    select?: {
      options: { label: string; value: string }[]
    }
  }
  dataSource: T[]
  loading?: boolean
  onSearch?: (filters: FilterConfig) => void
  onReset?: () => void
}

// Mock数据
export const mockUserData: UserData[] = [
  {
    id: '1',
    name: '张三',
    email: 'zhangsan@example.com',
    role: '管理员',
    status: 'active',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: '李四',
    email: 'lisi@example.com',
    role: '用户',
    status: 'active',
    createdAt: '2024-01-20',
  },
  {
    id: '3',
    name: '王五',
    email: 'wangwu@example.com',
    role: '编辑',
    status: 'inactive',
    createdAt: '2024-02-01',
  },
  {
    id: '4',
    name: '赵六',
    email: 'zhaoliu@example.com',
    role: '用户',
    status: 'pending',
    createdAt: '2024-02-10',
  },
  {
    id: '5',
    name: '钱七',
    email: 'qianqi@example.com',
    role: '管理员',
    status: 'active',
    createdAt: '2024-02-15',
  },
]

export function ProTable<T extends Record<string, any>>({ columns, dataSource, loading = false, onSearch, onReset, searchItems }: ProTableProps<T>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [searchValues, setSearchValues] = React.useState({})

  // 将ProTable列配置转换为TanStack Table列配置
  const tableColumns: ColumnDef<T>[] = React.useMemo(() => {
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
    data: dataSource,
    columns: tableColumns,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  })

  // 处理搜索
  const handleSearch = () => {
    // 调用外部搜索回调
    if (onSearch) {
      onSearch(searchValues)
    }
  }

  // 处理重置
  const handleReset = () => {
    setSearchValues({})
    setColumnFilters([])

    if (onReset) {
      onReset()
    }
  }

  return (
    <div className="space-y-4">
      {/* 筛选区域 */}
      <div className="flex items-center space-x-2">
        {searchItems?.input?.map((item) => (
          <>
            <span>{item}</span>
            <Input key={item} onChange={(event) => setSearchValues({ ...searchValues, [item]: event.target.value })} className="w-60" />
          </>
        ))}
        <Button onClick={handleSearch}>查询</Button>
        <Button variant="outline" onClick={handleReset}>
          重置
        </Button>
      </div>

      {/* 表格区域 */}
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
    </div>
  )
}
