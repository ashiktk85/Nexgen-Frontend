import { MdOutlineKeyboardArrowRight, MdOutlineKeyboardArrowLeft } from "react-icons/md";
import Pagination from "@/components/ui/Pagination";

const ListTable = ({ columns, data, currentPage, totalPages, setCurrentPage }) => {
  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <>
      <div className="mt-4 max-w-5xl mx-auto font-rubik bg-white rounded-lg overflow-hidden shadow-lg">
        <div className="overflow-auto md:overflow-visible">
          <table className="w-full table-auto">
            <thead className="bg-gray-700 text-white">
              <tr>
                {columns.map((column) => (
                  <th key={column.key} className="p-2 md:p-4 text-left text-sm font-normal">
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="whitespace-nowrap">
              {data.length > 0 ? (
                data.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-100 border-b">
                    {columns.map((column) => (
                      <td key={column.key} className="p-2 md:p-4 text-sm text-gray-700 font-bold">
                        {row[column.key]}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="p-4 text-center text-gray-500">
                    No entries available here...
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex flex-col md:flex-row items-center justify-between p-4 gap-4">
            <p className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </p>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              variant="compact"
              prevLabel={<MdOutlineKeyboardArrowLeft />}
              nextLabel={<MdOutlineKeyboardArrowRight />}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ListTable;
