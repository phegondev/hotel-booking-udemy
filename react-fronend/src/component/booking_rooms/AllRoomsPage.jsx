 import React, { useState, useEffect } from "react";
 import ApiService from "../../service/ApiService";
 import Pagination from "../common/Pagination";
 import RoomResult from "../common/RoomResult";
 import RoomSearch from "../common/RoomSearch";


 
 const AllRoomsPage =() => {
    const [rooms, setRooms] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [roomTypes, setRoomTypes] = useState([]);
    const [selectedRoomType, setSelectedRoomType] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [roomsPerPage] = useState(9);


    const handleSearchResult = (results) => {
        setRooms(results)
        setFilteredRooms(results)
    }

    useEffect(() => {

        //get all rooms
        const fetchRooms = async () => {
            try {
                const resp = await ApiService.getAllRooms();
                setRooms(resp.rooms)
                setFilteredRooms(resp.rooms)
            } catch (error) {
                console.log(error)
            }
        }

        //get room types
        const ftechRoomsType = async() =>{

            try {
                const types = await ApiService.getRoomTypes();
                setRoomTypes(types)
                
            } catch (error) {
                
                console.log(error)
            }
        };
        fetchRooms();
        ftechRoomsType();
    }, []);


    //handle changes to room type filter
    const handleRoomTypeChange = (e) => {
        const selectedType = e.target.value;
        setSelectedRoomType(selectedType)
        filterRooms(selectedType)
    }

    //filter rooms by type
    const filterRooms = (type) => {
        if (type === "") {
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

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return(
        <div className="all-rooms">
            <h2>All Rooms</h2>

            <div className="all-room-filter-div">
                <label>Filter By Room Type</label>
                <select value={selectedRoomType} onChange={handleRoomTypeChange}>
                    <option value="">All</option>
                    {roomTypes.map((type) => (
                        <option value={type} key={type}>
                            {type}
                        </option>
                    ))}
                </select>
            </div>

            <RoomSearch handSearchResult={handleSearchResult}/>
            <RoomResult roomSearchResults={currentRooms}/>

            <Pagination
            roomPerPage={roomsPerPage}
            totalRooms={filteredRooms.length}
            currentPage={currentPage}
            paginate={paginate}
            />
        </div>
    )

 }

 export default AllRoomsPage;