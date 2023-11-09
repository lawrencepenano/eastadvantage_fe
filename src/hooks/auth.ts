import useSWR from 'swr'
import { useEffect } from 'react'
import axios from '../lib/axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

interface AuthProps {
    middleware ?: string;
    redirectIfAuthenticated?: string;
}

export const useAuth = ({ middleware, redirectIfAuthenticated = "/" } : AuthProps = {}) => {
    const navigate = useNavigate()

    const { data: user, error, mutate } = useSWR('/api/me', () =>
        axios
            .get('/api/me')
            .then((res : any) => res.data)
            .catch((error: any) => {
                if (error.response.status !== 409) throw error

                navigate('/verify-email')
            }),
    )

    const csrf = () => axios.get('/sanctum/csrf-cookie')

    const login = async ({ setErrors, ...props } : any) => {
        await csrf()

        setErrors([])

        axios
            .post('/login', props)
            .then(() => mutate())
            .catch((error : any) => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const logout = async () => {
        await csrf()
        if (!error) {
            await axios.post('/logout',null,{
                headers: {
                    'X-XSRF-TOKEN ': Cookies.get("XSRF-TOKEN"),
                }
            }).then(() => mutate())
        }
        window.location.pathname = '/login'
    }

    useEffect(() => {
        if (middleware === 'guest' && redirectIfAuthenticated && user)
        {
            navigate(redirectIfAuthenticated)
        }   
        if (
            window.location.pathname === '/verify-email' &&
            user?.email_verified_at
        ){
            navigate(redirectIfAuthenticated)
        }
            
        if (middleware === 'auth' && error) logout()
    }, [user, error])

    return {
        user,
        login,
        logout,
    }
}
