import { ChangeEvent, useState } from 'react'
import { useAuth } from '../../../hooks/auth'
import Label from '../../../components/common/Label'
import Input from '../../../components/common/Input'
import InputError from '../../../components/common/InputError'


const initialValue = {
    email: "admin@gmail.com",
    password: "password"
}

const Login = () => {
    const [formState, setformState] = useState(initialValue)
    const [errors, setErrors] = useState<any>([])
    const [setStatus] = useState(null)
    // const navigate = useNavigate();

    const handleOnChange =  (event: ChangeEvent<HTMLInputElement>) => {
        setformState(prev => {
            return {
                ...prev, 
                [event.target.id]: event.target.value
            }
        })
    }

    const { login } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/admin/users',
    })

    
    const handleSubmit = async (event : any) => {
        event.preventDefault()

        login({
            email: formState.email,
            password: formState.password,
            setErrors,
            setStatus,
        })
    }

   

  return (
        <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col ">
                <img
                    className="mx-auto h-12"
                    src="/public/ea_logo.png" 
                    alt="Eastadvantage"
                />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-700">Sign in to your account</h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                <form className="space-y-6">
                <div>
                        <Label htmlFor="email">Email</Label>

                        <Input
                            id="email"
                            type="email"
                            value={formState.email}
                            className="block mt-1 w-full p-2"
                            onChange={handleOnChange}
                            required
                            autoFocus
                        />

                        <InputError messages={errors?.email} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <Label htmlFor="password">Password</Label>

                        <Input
                            id="password"
                            type="password"
                            value={formState.password}
                            className="block mt-1 w-full p-2"
                            onChange={handleOnChange}
                            required
                            autoComplete="current-password"
                        />

                        <InputError
                            messages={errors.password}
                            className="mt-2"
                        />
                    </div>
                <div>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                    Sign in
                    </button>
                </div>
                </form>

                <div className="mt-6">
                </div>
            </div>
            </div>
        </div>
  )
}

export default Login