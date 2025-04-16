import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import authService from '../../appwrite/Auth'
import { logout } from '../../store/AuthSlice'

function LogOutBtn() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const logoutHandler = async () => {
        try {
            await authService.logOut();
        } catch (e) {
            console.warn("Logout error (probably already logged out):", e.message);
        } finally {
            dispatch(logout());
            navigate('/');
        }
    };

  return (
    <button className='py-2 px-4 bg-red-400 hover:bg-red-500 rounded-full font-semibold' onClick={logoutHandler}>Log OUT</button>
  )
}

export default LogOutBtn