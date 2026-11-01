import ProtectedRoute from './context/authContext.jsx'
import Login from './pages/login.jsx'
import {Routes,Route} from 'react-router'
import Home from './pages/home.jsx'
import './App.css'

function App() {


  return (
   <Routes>
    <Route path='/login' element={<Login/>}/>
    <Route element={<ProtectedRoute/>}>
        <Route path="/" element={<Home/>}/>
    </Route>
   </Routes>
  )
}

export default App
