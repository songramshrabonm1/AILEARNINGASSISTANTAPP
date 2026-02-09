import React from 'react'
import Loading from '../../pages/Loading/Loading';
import { Navigate, Outlet } from 'react-router-dom';
import Applyaout from '../layout/Applyaout';

const ProtecetedRoute = () => {
    const isAuthenticate = true ; 
    const loading = false ; 
    if(loading) {
        return(
            <Loading></Loading>
        )
    }
  return isAuthenticate ? (
    <Applyaout>
        <Outlet></Outlet>
    </Applyaout>
  ): <Navigate to={'/login'}></Navigate>
}

export default ProtecetedRoute