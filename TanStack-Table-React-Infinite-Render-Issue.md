# TanStack Table 与 React 无限重渲染问题详解

I'll create a comprehensive markdown document explaining this issue and how TanStack Table works with React.

Write(TanStack-Table-React-Infinite-Render-Issue.md) ⎿ Wrote 1 lines to TanStack-Table-React-Infinite-Render-Issue.md # TanStack Table 与 React 无限重
渲染问题详解 ## 问题现象 当使用 TanStack Table 时，如果没有正确处理引用稳定性，会导致组件无限重渲染： ```tsx // ❌ 错误的写法 - 会导致无限重渲染 const
table = useReactTable({ data: data?.records || [], // 每次渲染都创建新数组

● 已经为你创建了一个详细的 Markdown 文档，解释了：

1. 问题的根本原因 - React 的引用比较机制和 TanStack Table 的内部工作原理
2. 无限重渲染的形成过程 - 从组件渲染到状态更新的完整循环
3. 多种解决方案 - useMemo、组件外常量、useState 等不同方法
4. 完整的使用示例 - 包括基础用法、高级功能、服务端分页等
5. 最佳实践 - 性能优化、类型安全等建议
6. 常见错误对照表 - 快速诊断和解决问题

核心要点是：React 组件每次渲染时，data?.records || [] 都会创建一个新的数组实例，即使内容相同，引用也不同。TanStack Table 检测到引用变化就会触发内部状
态更新，导致组件重新渲染，形成无限循环。

使用 useMemo 可以确保只有在依赖项真正变化时才创建新的引用，从而打破这个循环。

## 问题现象

当使用 TanStack Table 时，如果没有正确处理引用稳定性，会导致组件无限重渲染：

```tsx
// ❌ 错误的写法 - 会导致无限重渲染
const table = useReactTable({
  data: data?.records || [], // 每次渲染都创建新数组
  columns: tableColumns,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
})
```

## 根本原因分析

### 1. React 的重渲染机制

React 使用 `Object.is()` 来比较依赖项是否发生变化。对于对象和数组，比较的是引用而不是内容：

```javascript
// 每次都是新的数组引用，即使内容相同
[] === [] // false
{} === {} // false

// 相同引用
const arr1 = []
const arr2 = arr1
arr1 === arr2 // true
```

### 2. TanStack Table 的内部机制

`useReactTable` 内部使用了类似 `useEffect` 的机制来监听 `data` 和 `columns` 的变化：

```tsx
// TanStack Table 内部的简化逻辑
function useReactTable(options) {
  const [tableState, setTableState] = useState(initialState)

  // 监听 data 和 columns 变化
  useEffect(() => {
    // 当 data 或 columns 引用发生变化时，重新计算表格状态
    updateTableState(options.data, options.columns)
  }, [options.data, options.columns]) // 依赖数组

  return table
}
```

### 3. 无限循环的形成

```
1. 组件渲染 → 创建新的 data?.records || [] 数组
2. useReactTable 检测到 data 引用变化 → 触发内部状态更新
3. 状态更新 → 组件重新渲染
4. 回到步骤 1，形成无限循环
```

## 解决方案

### 方案一：使用 `useMemo` 稳定引用

```tsx
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
  }))
}, [columns]) // 只有当 columns 真正变化时才重新计算

// 稳定 data 引用
const tableData = useMemo(() => data?.records || [], [data?.records])

const table = useReactTable({
  data: tableData,
  columns: tableColumns,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
})
```

### 方案二：组件外定义常量

```tsx
// 在组件外部定义，确保引用稳定
const EMPTY_ARRAY: T[] = []

function MyComponent() {
  const table = useReactTable({
    data: data?.records || EMPTY_ARRAY,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })
}
```

### 方案三：使用 `useState` 管理数据

```tsx
const [tableData, setTableData] = useState<T[]>([])

useEffect(() => {
  if (data?.records) {
    setTableData(data.records)
  }
}, [data?.records])

const table = useReactTable({
  data: tableData,
  columns: tableColumns,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
})
```

## TanStack Table 在组件中的完整用法

### 1. 基础设置

```tsx
import { useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table'

type User = {
  id: string
  name: string
  email: string
  age: number
}
```

### 2. 定义列配置

```tsx
const columns: ColumnDef<User>[] = useMemo(
  () => [
    {
      id: 'id',
      accessorKey: 'id',
      header: 'ID',
      size: 100,
    },
    {
      id: 'name',
      accessorKey: 'name',
      header: 'Name',
      size: 200,
    },
    {
      id: 'email',
      accessorKey: 'email',
      header: 'Email',
      size: 250,
    },
    {
      id: 'age',
      accessorKey: 'age',
      header: 'Age',
      size: 100,
      cell: ({ getValue }) => {
        const age = getValue<number>()
        return `${age} 岁`
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div>
          <button onClick={() => handleEdit(row.original)}>Edit</button>
          <button onClick={() => handleDelete(row.original.id)}>Delete</button>
        </div>
      ),
    },
  ],
  []
) // 空依赖数组，因为列定义是静态的
```

### 3. 创建表格实例

```tsx
function UserTable({ data, loading }: { data?: User[]; loading: boolean }) {
  // 稳定化数据引用
  const tableData = useMemo(() => data || [], [data])

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // 分页配置
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      {/* 搜索框 */}
      <input placeholder="Search all columns..." value={globalFilter ?? ''} onChange={(value) => setGlobalFilter(String(value))} />

      {/* 表格 */}
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} style={{ width: header.getSize() }}>
                  {header.isPlaceholder ? null : (
                    <div className={header.column.getCanSort() ? 'cursor-pointer' : ''} onClick={header.column.getToggleSortingHandler()}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: ' 🔼',
                        desc: ' 🔽',
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* 分页控件 */}
      <div>
        <button onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
          {'<<'}
        </button>
        <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          {'<'}
        </button>
        <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          {'>'}
        </button>
        <button onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
          {'>>'}
        </button>
        <span>
          Page{' '}
          <strong>
            {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </strong>
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
```

### 4. 高级功能示例

#### 状态管理

```tsx
const [sorting, setSorting] = useState<SortingState>([])
const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
const [globalFilter, setGlobalFilter] = useState('')

const table = useReactTable({
  data: tableData,
  columns,
  state: {
    sorting,
    columnFilters,
    globalFilter,
  },
  onSortingChange: setSorting,
  onColumnFiltersChange: setColumnFilters,
  onGlobalFilterChange: setGlobalFilter,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getSortedRowModel: getSortedRowModel(),
})
```

#### 服务端分页

```tsx
const [pagination, setPagination] = useState({
  pageIndex: 0,
  pageSize: 10,
})

// 根据状态获取数据
const { data, isLoading } = useQuery({
  queryKey: ['users', sorting, columnFilters, pagination],
  queryFn: () =>
    fetchUsers({
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      sort: sorting,
      filters: columnFilters,
    }),
})

const table = useReactTable({
  data: data?.records || [],
  columns,
  state: {
    sorting,
    columnFilters,
    pagination,
  },
  onSortingChange: setSorting,
  onColumnFiltersChange: setColumnFilters,
  onPaginationChange: setPagination,
  getCoreRowModel: getCoreRowModel(),
  manualPagination: true, // 服务端分页
  manualSorting: true, // 服务端排序
  manualFiltering: true, // 服务端过滤
  pageCount: data?.totalPages ?? -1,
})
```

## 最佳实践总结

### 1. 始终使用稳定引用

- 使用 `useMemo` 包装 `data` 和 `columns`
- 避免在渲染函数中创建新的对象或数组

### 2. 合理使用依赖数组

```tsx
// ✅ 正确：只有真正变化时才重新计算
const columns = useMemo(() => [...], [actualDependency])

// ❌ 错误：每次都重新计算
const columns = [...] // 没有使用 useMemo
```

### 3. 性能优化

- 对于大量数据，考虑使用虚拟化
- 合理使用 `manualPagination`、`manualSorting` 等服务端功能
- 避免在 cell 渲染函数中进行复杂计算

### 4. 类型安全

```tsx
// 使用泛型确保类型安全
const table = useReactTable<User>({...})

// 或使用 createColumnHelper
const columnHelper = createColumnHelper<User>()
```

## 常见错误与解决方法

| 错误现象   | 原因                       | 解决方案                               |
| ---------- | -------------------------- | -------------------------------------- |
| 无限重渲染 | data 或 columns 引用不稳定 | 使用 useMemo 或组件外常量              |
| 性能问题   | 每次都重新计算列定义       | 将静态列定义移到组件外或使用 useMemo   |
| 状态丢失   | 状态管理不当               | 正确使用 state 和 onXXXChange          |
| 类型错误   | 泛型使用不当               | 正确定义数据类型并传递给 useReactTable |

通过遵循这些最佳实践，可以避免常见的性能问题，充分发挥 TanStack Table 的强大功能。
