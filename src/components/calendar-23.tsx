import * as React from 'react'
import { ChevronDownIcon } from 'lucide-react'
import { type DateRange } from 'react-day-picker'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface Calendar23Props {
  dateRange?: DateRange | undefined
  onDateRangeChange?: (range: DateRange | undefined) => void
}

export default function Calendar23({ dateRange, onDateRangeChange }: Calendar23Props) {
  const [range, setRange] = React.useState<DateRange | undefined>(dateRange)

  // 当外部 dateRange prop 改变时，同步内部状态
  React.useEffect(() => {
    setRange(dateRange)
  }, [dateRange])

  const handleDateSelect = (newRange: DateRange | undefined) => {
    setRange(newRange)
    onDateRangeChange?.(newRange)
  }

  return (
    <div className="flex flex-row items-center justify-center gap-2">
      <span className="px-1">日期</span>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" id="dates" className="w-56 justify-between font-normal">
            {range?.from && range?.to
              ? `${range.from.toLocaleDateString('zh-CN')} - ${range.to.toLocaleDateString('zh-CN')}`
              : range?.from
              ? `${range.from.toLocaleDateString('zh-CN')} - 选择结束日期`
              : '选择日期范围'}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar mode="range" selected={range} captionLayout="dropdown" onSelect={handleDateSelect} />
        </PopoverContent>
      </Popover>
    </div>
  )
}
