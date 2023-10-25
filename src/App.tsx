import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Auth/Login/Login'
import AdminLayout from './pages/Admin/AdminLayout'
import Dashboard from './pages/Admin/Dashboard/Dashboard'
import UserList from './pages/Admin/Users/UserList'
import User from './pages/Admin/Users/User'

function App() {
  return (
    <>
      <Router>  
          <Routes>
            <Route path='/login' element={<Login/>}/>
            <Route path="/admin" element={<AdminLayout/>}>
                  <Route path='dashboard' element={<Dashboard/>}/>
                  <Route path='users' element={<UserList/>}/>
                  <Route path='users/add' element={<User/>}/>
            </Route>
          </Routes>
      </Router> 
    </>
  )
}

export default App
