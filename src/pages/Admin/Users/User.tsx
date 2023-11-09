import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select'
import axios from '../../../lib/axios';
import Swal from 'sweetalert2'
import InputError from '../../../components/common/InputError';
import Input from '../../../components/common/Input';
import Label from '../../../components/common/Label';

interface FormProps {
    name: string;
    email: string;
    roles: {
        value: string;
        label: string;
    }[];
}

const User = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formValue, setformValue] = useState<FormProps>({
        name: "",
        email: "",
        roles: [],
    })
    const [errors, setErrors] = useState<any>([])

    const handleRoleChange = (value : any) => {
        setformValue((prev) => {
            return {
                ...prev, 
                roles: value
            }
        })
    }

    const handleOnchange = (event : any) => {
        setformValue((prev) => {
            return {
                ...prev, 
                [event.target.name]: event.target.value
            }
        })  
    }


    const options = [
        { value: '1', label: 'Author' },
        { value: '2', label: 'Editor' },
        { value: '3', label: 'Subscriber' },
        { value: '4', label: 'Administrator' }
    ]

    const getUsers = () => {
        axios
        .get(`/api/users/${id}`)
        .then((res : any) => {
            let name = res?.data?.attributes?.name;
            let email = res?.data?.attributes?.email;
            let roles = res?.data?.attributes?.roles;

            setformValue({
                name: name,
                email: email,
                roles: roles,
            })
        })
        .catch((error: any) => {
            if (error.response.status !== 409) throw error
            // alert("Error")
        })
    }
    
    
    const handleSubmit = () => {
    
        const payload = {
            id: id ? parseInt(id) : undefined,
            name: formValue.name,
            email: formValue.email,
            roles: formValue.roles.map(ea => ea?.value),
        }

        axios
        .post('/api/users', payload)
        .then((res : any) => {
            let name = res?.data?.attributes?.name;
            let email = res?.data?.attributes?.email;
            let roles = res?.data?.attributes?.roles;
           
            setformValue({
                name: name,
                email: email,
                roles: roles,
            })

            if(!id){
                navigate(`/admin/users/${res?.data?.attributes?.id}`)
            }

            Swal.fire(
                'Good job!',
                'You succesfully update the user!',
                'success'
              )
            setErrors([])
        })
        .catch((error: any) => {
            setErrors(error.response.data.errors)
            console.log(error);
            // alert("Error")
        })
    }

      useEffect(() => {
            if(!!id){
                getUsers()
            }
      }, [id])
      
  return (
    <form className="space-y-8 divide-y divide-gray-200">
        <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
            <div className="pt-8 space-y-6 sm:pt-10 sm:space-y-5">
                <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Personal Information</h3>
                </div>

                
                <div className="space-y-6 sm:space-y-5">
                    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                        <Label htmlFor="name"  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                            Full name
                        </Label>
                        <div className="mt-1 sm:mt-0 sm:col-span-2">
                            <Input
                                type="text"
                                name="name"
                                id="name"
                                autoComplete="given-name"
                                placeholder="Full name"
                                onChange={handleOnchange}
                                value={formValue.name}
                                className="border h-8 px-2 max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-sm"
                            />
                         <InputError messages={errors?.name} className="mt-2" />
                    </div>
                </div>

                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                    <Label htmlFor="email"  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                        Email address
                    </Label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                        <Input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                onChange={handleOnchange}
                                value={formValue.email}
                                placeholder="Email Address"
                                className=" hover:border-2-red border h-8 px-2 max-w-lg block w-full shadow-sm active:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-sm"
                        />
                    <InputError messages={errors?.email} className="mt-2" />
                    </div>
                </div>

                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                    <label htmlFor="Roles" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                        Roles
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                        <Select 
                            options={options} 
                            isMulti 
                            value={formValue.roles}
                            onChange={handleRoleChange}
                            className="max-w-lg block w-full focus:ring-red-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm"
                        />
                        <InputError messages={errors?.roles} className="mt-2" />
                    </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="pt-5">
        <div className="flex justify-end">
            <button
            type="button"
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={()=>navigate("/admin/users")}
            >
            Cancel
            </button>
            <button
                type="button"
                onClick={handleSubmit}
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                Save
            </button>
        </div>
        </div>
    </form>
  )
}

export default User