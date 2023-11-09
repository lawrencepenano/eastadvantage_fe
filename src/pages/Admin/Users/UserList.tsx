import {
  HiTrash,
  HiPencilAlt
} from "react-icons/hi"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import axios from "../../../lib/axios";
import Input from "../../../components/common/Input";
import Swal from "sweetalert2";


interface GridProps {
  id: number;
  name: string;
  email: string;
  roles: {
      value: string;
      label: string;
  }[];
}
  
const UserList = () => {
    const navigate = useNavigate();
    const [userGrid, setuserGrid] = useState<GridProps[]| undefined>(undefined)
    const [search, setsearch] = useState("")

    const getUsers = () => {
        axios
        .get(`/api/users?search=${search}`)
        .then((res : any) => {
          console.log(res?.data?.attributes?.data);
            setuserGrid(res?.data?.attributes?.data)
        })
        .catch((error: any) => {
            if (error.response.status !== 409) throw error
            // alert("Error")
        })
    }

    const handleDeleteUser = (id: number) => {
      axios
        .delete('/api/users/' + id)
        .then(() => {
            navigate(`/admin/users`)
            Swal.fire(
                'Good job!',
                'You succesfully deleted the user!',
                'success'
            )
            getUsers()
        })
    }

    useEffect(() => {
      getUsers();
    }, [search])


    return (
      <>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold text-gray-900">Users</h1>
              <p className="mt-2 text-sm text-gray-700">
                A list of all the users in your account including their name, email and role.
              </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              <button
                type="button"
                onClick={() => navigate('/admin/users/add')}
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
              >
                Add user
              </button>
            </div>
          </div>
          <div className="mt-8 flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="mb-2">
                    <Input
                        type="text"
                        name="search"
                        id="search"
                        autoComplete="given-name"
                        placeholder="Search"
                        value={search}
                        onChange={(event : any) => setsearch(event.target.value)}
                        className="border h-8 px-2 max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-sm"
                    />
                </div>

                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr className="divide-x divide-gray-200">
                        <th scope="col" className="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                          Name
                        </th>
                        <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Email
                        </th>
                        <th scope="col" className="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pr-6">
                          Role
                        </th>
                        <th scope="col" className="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pr-6">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {userGrid?.map((person) => (
                        <tr key={person.email} className="divide-x divide-gray-200">
                          <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-6">
                            {person.name}
                          </td>
                          <td className="whitespace-nowrap p-4 text-sm text-gray-500">{person.email}</td>
                          <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">{person.roles.map(ea => ea?.label).toString()}</td>
                          <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6 flex justify-center">
                              <button onClick={()=>navigate(`/admin/users/${person?.id}`)} className="text-xl text-yellow-400" type="button"><HiPencilAlt/></button>
                              <button onClick={() => handleDeleteUser(person.id)} className="text-xl text-red-400" type="button"><HiTrash/></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  export default UserList