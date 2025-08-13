import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Calendar23 from './calendar-23'
import { type DateRange } from 'react-day-picker'

export interface SearchInputItem {
  title: string
  field: string
  placeholder?: string
  type?: 'text' | 'number' | 'email'
}

export interface SearchSelectItem {
  title: string
  field: string
  options: Array<{ label: string; value: string | number }>
  placeholder?: string
}

export interface SearchDateRangeItem {
  title?: string
  startField: string
  endField: string
}

export interface ProTableSearchProps {
  searchItems?: {
    inputs?: SearchInputItem[]
    selects?: SearchSelectItem[]
    dateRange?: SearchDateRangeItem
    calendar?: boolean
    input?: { title: string; apiName: string }[]
    select?: { options: { label: string; value: string }[] }
  }
  values: Record<string, any>
  dateRange?: DateRange | undefined
  onChange: (key: string, value: any) => void
  onDateRangeChange?: (range: DateRange | undefined) => void
  onSearch: () => void
  onReset: () => void
}

export function ProTableSearch({ searchItems, values, dateRange, onChange, onDateRangeChange, onSearch, onReset }: ProTableSearchProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-start">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-4 items-center">
          {searchItems?.input?.map((item) => (
            <div key={item.apiName} className="flex flex-col space-y-2">
              <span className="text-sm font-medium text-muted-foreground">{item.title}</span>
              <Input
                value={values[item.apiName] || ''}
                placeholder={`请输入${item.title}`}
                className="h-10"
                onChange={(e) => onChange(item.apiName, e.target.value)}
              />
            </div>
          ))}

          {searchItems?.selects?.map((item) => (
            <div key={item.field} className="flex flex-col space-y-2">
              <span className="text-sm font-medium text-muted-foreground">{item.title}</span>
              <Select value={values[item.field]} onValueChange={(value) => onChange(item.field, value)}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder={item.placeholder || `请选择${item.title}`} />
                </SelectTrigger>
                <SelectContent>
                  {item.options.map((option) => (
                    <SelectItem key={option.value} value={String(option.value)}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}

          {searchItems?.calendar && (
            <div className="flex flex-col space-y-2">
              <span className="text-sm font-medium text-muted-foreground">日期</span>
              <Calendar23 dateRange={dateRange} onDateRangeChange={onDateRangeChange} />
            </div>
          )}
        </div>

        <div className="flex gap-3 items-start pt-7">
          <Button size="default" className="min-w-18" onClick={onSearch}>
            查询
          </Button>
          <Button variant="outline" size="default" className="min-w-18" onClick={onReset}>
            重置
          </Button>
        </div>
      </div>
    </div>
  )
}
