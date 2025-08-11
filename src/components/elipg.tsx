import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@/components/ui/pagination'

export const Pgeli = ({
  pgData,
  handlePreviousPage,
  handleNextPage,
  handlePageChange,
}: {
  pgData: any
  handlePreviousPage: () => void
  handleNextPage: () => void
  handlePageChange: (page: number) => void
}) => {
  return (
    <div className="flex justify-center ">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={handlePreviousPage}
              className={Number(pgData.current) <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            />
          </PaginationItem>

          {(() => {
            const current = Number(pgData.current)
            const total = Number(pgData.pages)
            const pages = []

            if (total <= 8) {
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
              pages.push(
                <PaginationItem key={1}>
                  <PaginationLink onClick={() => handlePageChange(1)} isActive={1 === current} className="cursor-pointer">
                    1
                  </PaginationLink>
                </PaginationItem>
              )

              if (current > 5) {
                pages.push(
                  <PaginationItem key="ellipsis-start">
                    <PaginationEllipsis />
                  </PaginationItem>
                )
              }

              const start = Math.max(2, current - 1)
              const end = Math.min(total - 2, current + 2)

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
                pages.push(
                  <PaginationItem key="ellipsis-end">
                    <PaginationEllipsis />
                  </PaginationItem>
                )
              }

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
  )
}
