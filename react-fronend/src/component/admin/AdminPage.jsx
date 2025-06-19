import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import ApiService from '../../service/ApiService';


const AdminPage = () => {

    const [adminName, setAdminName] = useState('');
    const navigate = useNavigate()


    useEffect(() =>{
        const fetchAdminName = async () => {
            try {
                const resp = await ApiService.myProfile();
                setAdminName(resp.user.firstName)
                
            } catch (error) {
                console.log(error.message)
            }
        }
        fetchAdminName();
    }, []);


    return(
        <div className="admin-page">
            <h1 className="welcome-message">Welcome, {adminName}</h1>
            <div className="admin-actions">
                <button className="admin-button" onClick={()=> navigate('/admin/manage-rooms')}> Manage Rooms</button>
                <button className="admin-button" onClick={()=> navigate('/admin/manage-bookings')}> Manage Bookings</button>
            </div>
        </div>
    )

}
export default AdminPage;