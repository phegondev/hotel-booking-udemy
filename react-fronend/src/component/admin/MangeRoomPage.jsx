import React, { useState, useEffect } from "react";
import ApiService from "../../service/ApiService";
import Pagination from "../common/Pagination";
import RoomResult from "../common/RoomResult";
import { useNavigate } from "react-router-dom";



const ManageRoomPage = () => {
    
    const [rooms, setRooms] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([])
    const [roomTypes, setRoomTypes] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [roomsPerPage] = useState(8)
    const navigate = useNavigate();



    useEffect(()=> {
        const fetchRooms = async () => {
            try {
                const resp = await ApiService.getAllRooms();
                setRooms(resp.rooms)
                setFilteredRooms(resp.rooms)
            } catch (error) {
                console.log(error.message)
            }
        };

        const fetchRoomTypes = async () => {
            try {
                const resp = await ApiService.getRoomTypes();
                setRoomTypes(resp)
            } catch (error) {
                console.log(error.message)
            }
        }

        fetchRooms();
        fetchRoomTypes()
    }, [])

    const handleRoomTypeChange = (e) => {
        filterRoomFunction(e.target.value)
    }

    const filterRoomFunction = (type) => {
        if (type === '' || type === null) {
            setFilteredRooms(rooms)
        }else{
            const filtered = rooms.filter((room) => room.type === type)
            setFilteredRooms(filtered)
        }
        setCurrentPage(1)
    }


    //pagination calculation
    const indexOfLastRoom = currentPage * roomsPerPage;
    const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
    const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);


    //change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className='all-rooms'>
          <h2>All Rooms</h2>
          <div className='all-room-filter-div' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className='filter-select-div'>
              <label>Filter by Room Type:</label>
              <select onChange={handleRoomTypeChange}>
                <option value="">All</option>
                {roomTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <button className='add-room-button' onClick={() => navigate('/admin/add-room')}>
                Add Room
              </button>
            </div>
          </div>
    
          <RoomResult roomSearchResults={currentRooms} />
    
          <Pagination
            roomPerPage={roomsPerPage}
            totalRooms={filteredRooms.length}
            currentPage={currentPage}
            paginate={paginate}
          />

        </div>
      );


}

export default ManageRoomPage;