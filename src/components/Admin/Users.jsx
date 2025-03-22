import {useEffect, useState} from 'react';
import ListTable from '../common/ListTable';
import ConfirmDialog from '../common/ConfirmDialog';
import { Button } from 'antd';
import { toast } from 'sonner';
// import { Button } from '../ui/button';

import { getAllUsersSerive, userChangeStatusService } from '@/apiServices/adminApi';

const Users = () => {
  
  const [users, setUsers] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const rowsPerPage = 5


  useEffect(() => {
    fetchUsers(currentPage)
  }, [currentPage])


  async function fetchUsers(page) {
    try {
      const result = await getAllUsersSerive(page, rowsPerPage)
      console.log('Reeeesss', result)
      if(result?.data?.response){
        const {users, totalPages} = result.data.response
        setUsers(users)
        setTotalPages(totalPages)
      }

    } catch (error) {
      console.log('Error in user listing component: ', error.message)
      toast.error('An unexpected error occured')
    }
  }


  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Mobile" },
    { key: "status", label: "Status" },
    { key: "action", label: "" },
  ]



  const handleBlockUnblock = async (userId) => {
    try {
      const result = await userChangeStatusService(userId)

      if(result?.data?.response){
        const {message, response} = result.data
        toast.success(message)
        setUsers((prev) => 
          prev.map((item) => (
            item._id === response._id ? {...item, isBlocked: response.isBlocked} : item
          ))
        )
      }
    } catch (error) {
      console.log('Error in handleBlockUnblock at user listing: ', error)
      toast.error('An unexpected error occured')
    }
  }


  const tableData = users.map((item) => ({
    ...item,
       name: `${item.firstName}  ${item.lastName}`,
       status: item.isBlocked 
              ? <span className='text-red-500'>blocked</span> 
              : <span className='text-green-500'>active</span>,
      action: (
        <ConfirmDialog
        title={item.isBlocked ? "Unblock user" : "Block user"}
        description={`Are you sure you want to ${item.isBlocked ? "unblock" : "block"} this user?`}
        onConfirm={() => handleBlockUnblock(item._id)}
        >
          <Button 
          className='font-semibold min-w-28'>
            {item.isBlocked ? 'Unblock' : 'Block'}
          </Button>
        </ConfirmDialog>
      )
  }))


  return (
    <div className='mt-6 px-6'>
      <h1 className="text-start text-2xl font-bold mb-4 ">Users</h1>
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

export default Users;

