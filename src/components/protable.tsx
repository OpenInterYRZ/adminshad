import { useMemo, useState } from 'react'
import { type ColumnDef, type ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useQuery } from '@tanstack/react-query'

// 定义用户数据类型
export interface UserData {
  userId: string
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
    input?: { title: string; apiName: string }[]
    calendar?: boolean
    select?: {
      options: { label: string; value: string }[]
    }
  }

  loading?: boolean
  onSearch?: any
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
]

export function ProTable<T extends Record<string, any>>({ columns, loading = false, onSearch, onReset, searchItems }: ProTableProps<T>) {
  const [searchValues, setSearchValues] = useState({})
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['user-manage', searchValues], // 添加 searchValues 作为依赖
    queryFn: () => {
      console.log('useQuery 正在执行，参数：', searchValues)
      return onSearch(searchValues)
    },
    enabled: !!onSearch, // 只有当 onSearch 函数存在时才启用
  })

  // 将ProTable列配置转换为TanStack Table列配置
  const tableColumns: ColumnDef<T>[] = useMemo(() => {
    return columns.map((col) => ({
      id: col.key as string,
      accessorKey: col.dataIndex || col.key,
      header: col.title,
      cell: ({ row, getValue }) => {
        const value = getValue()
        const record = row.original
        const index = row.index
        // console.log('value', value)
        // console.log('record', record)
        // console.log('index', index)
        if (col.render) {
          return col.render(value, record, index)
        }

        return value
      },
      size: col.width,
    }))
  }, [columns])

  const table = useReactTable({
    data: data || [],
    columns: tableColumns,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  // 处理重置
  const handleReset = () => {
    console.log('handleReset')
    console.log(searchValues)
    refetch()
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
            <span>{item.title}</span>
            <input
              key={item.apiName}
              onChange={(event) => setSearchValues({ ...searchValues, [item.apiName]: event.target.value })}
              className="w-60"
            />
          </>
        ))}
        <Button onClick={() => refetch()}>查询</Button>
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
