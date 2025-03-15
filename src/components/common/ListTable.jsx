import { Button } from "antd"


const ListTable = ({columns, data, currentPage, totalPages, onNext, onPrev}) => {
  

  return (
    <>
    <div className='mt-4 max-w-5xl mx-auto font-rubik bg-white rounded-lg overflow-hidden shadow-lg'>
    <div className="overflow-x-auto">
    <table className="w-full table-auto">
      <thead className="whitespace-nowrap bg-gray-700 text-white">
        <tr>
            {columns.map((column) => (
                <th key={column.key} className="p-4 text-left text-sm font-normal">
                    {column.label}
                </th>
            ))}

        </tr>
      </thead>
     
      <tbody className="whitespace-nowrap">
        {data.length > 0 ? (
            data.map((row, index) => (
                <tr key={index} className='hover:bg-gray-100'>
                    {columns.map((column) => (
                        <td key={column.key} className='p-4 text-sm text-gray-700 font-bold'>
                            {row[column.key]}
                        </td>
                    ))}
                </tr>
            ))
        ) : (
            <tr>
                <td colSpan={columns.length} className='p-4 text-center text-gray-500'>
                    No entries available here...
                </td>
            </tr>
        )}  
    
      </tbody>
    </table>

    <div className="md:flex m-4 mt-10">
      <p className="text-sm text-gray-500 flex-1">
        Page {currentPage} of {totalPages}
        </p>
      <div className="flex items-center max-md:mt-4">

        <div className="flex space-x-1">
          <Button type="button" 
                 className={`px-3 py-2 text-sm rounded-md ${
                 currentPage === 1 ? 'bg-gray-200' : 'bg-gray-600 text-white'
                 }`}
                 disabled={currentPage === 1}
                 onClick={onPrev}
                 >
                     Prev...
            </Button>

         <Button type="button" 
                 className={`px-3 py-2 text-sm rounded-md ${
                 currentPage === totalPages ? 'bg-gray-200' : 'bg-gray-600 text-white'
                 }`}
                 disabled={currentPage === totalPages}
                 onClick={onNext}
                 >
                     Next
            </Button>
        </div>
      </div>
    </div>
  </div>
</div>
</>
  )
}

export default ListTable
