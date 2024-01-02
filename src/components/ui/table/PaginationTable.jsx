import { OFFSET } from "@/lib/constant";
import Pagination from "../pagination";
import RecordInfo from "./RecordInfo";

export default function PaginationTable({
  onNext,
  onPrev,
  currentPage,
  pagination,
}) {
  const getStart = () => {
    if (currentPage === 1) return 1;
    return OFFSET * (currentPage - 1);
  };

  const getTo = () => {
    const to = OFFSET * currentPage;
    return to > pagination.total_items ? pagination.total_items : to;
  };
  return (
    <div className="mt-2 flex items-center justify-between">
      <RecordInfo
        start={getStart()}
        to={getTo()}
        from={pagination.total_items || 0}
      />
      <Pagination
        onNext={onNext}
        onPrev={onPrev}
        currentPage={currentPage}
        position="right"
        lastPage={currentPage === pagination.total_page}
      />
    </div>
  );
}