import {useState, useEffect} from 'react';
import ListTable from '../common/ListTable';
import ConfirmDialog from '../common/ConfirmDialog';
import { Button } from 'antd';

import { getAllEmployers, employerListUnList } from '@/apiServices/adminApi';

const Employers = () => {
  const [employers, setEmployers] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const rowsPerPage = 5

  useEffect(() => {
    fetchEmployers(currentPage)
  }, [currentPage])

  async function fetchEmployers(page) {
    try {
      const result = await getAllEmployers(page, rowsPerPage)

      if(result?.data?.response){
        const {employers, totalPages} = result.data.response
        setEmployers(employers)
        setTotalPages(totalPages)
      }
    } catch (error) {
      console.log('Error in employers listing component: ', error.message)
      toast.error('An unexpected error occured')
    }
  }


  const handleBlockUnblock = async (employerId) => {
      try{
          const result = await employerListUnList(employerId)
          console.log('response after employer change status: ', result)
          if(result?.data?.response){
            const updated = result.data.response
            setEmployers((prev) =>
              prev.map((item) =>
                item._id === employerId ? { ...item, isBlocked: updated.isBlocked } : item
              )
            );
          }
      }catch(error){
        console.log('Error in handleBlockUnblock at employer listing component: ', error.message)
        toast.error('An unexpected error occured')
      }
  }



  const columns = [
    {key: 'name', label: 'Name'},
    {key: 'email', label: 'Email'},
    {key: 'phone', label: 'Mobile'},
    {key: 'location', label: 'Location'},
    {key: 'status', label: 'Status'},
    {key: 'action', label: ''},
  ]


  const tableData = employers.map((item) => ({
    ...item,
    status: item.isBlocked 
              ? <span className='text-red-500'>blocked</span> 
              : <span className='text-green-500'>active</span>,
              
    action: (
      <ConfirmDialog
        title={item.isBlocked ? "Unblock employer" : "Block employer"}
        description={`Are you sure you want to ${item.isBlocked ? "unblock" : "block"} this employer?`}
        onConfirm={() => handleBlockUnblock(item._id)}
        >
        <Button 
        className='font-semibold w-28'>
        {item.isBlocked ? 'Unblock' : 'Block'}
        </Button>
      </ConfirmDialog>
      )         

  }))

  return (
    <div className='mt-6 px-6'>
      <h1 className='text-start text-2xl font-bold mb-4'>Employers</h1>
      <div className='mt-2'>
        <ListTable
        columns={columns}
        data={tableData}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default Employers;

