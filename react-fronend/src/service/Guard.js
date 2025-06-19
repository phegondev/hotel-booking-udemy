import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import ApiService from "./ApiService";



export const CustomerRoute = ({element: Component}) =>{
    const location = useLocation();
    return ApiService.isAthenticated() ? (
        Component
    ):(
        <Navigate to="/login" replace state={{from: location}}/>
    )
}


export const AdminRoute = ({element: Component}) =>{
    const location = useLocation();
    return ApiService.isAdmin() ? (
        Component
    ):(
        <Navigate to="/login" replace state={{from: location}}/>
    )
}