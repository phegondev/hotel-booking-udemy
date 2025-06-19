import React, { useState, useEffect, useRef } from "react";
import ApiService from "../../service/ApiService";
import { DayPicker } from "react-day-picker";

const RoomSearch = ({ handSearchResult }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndtDate] = useState(null);
  const [roomType, setRoomType] = useState("");
  const [roomTypes, setRoomTypes] = useState([]);
  const [error, setError] = useState("");

  //state for controlling calander visibility
  const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);

  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const types = await ApiService.getRoomTypes();
        setRoomTypes(types);
      } catch (error) {
        console.log("Error fetching RoomTypes" + error);
      }
    };
    fetchRoomTypes();
  }, []);

  const haandleClickOutside = (event) => {
    if (startDateRef.current && !startDateRef.current.contains(event.target)) {
      setStartDatePickerVisible(false);
    }
    if (endDateRef.current && !endDateRef.current.contains(event.target)) {
      setEndDatePickerVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", haandleClickOutside);
    return () => {
      document.removeEventListener("mousedown", haandleClickOutside);
    };
  }, []);

  //shoe error
  const showError = (message, timeout = 5000) => {
    setError(message);
    setTimeout(() => {
      setError("");
    }, timeout);
  };

  //this will fetch the rooms avialbale from our api
  const handleInternalSearch = async () => {
    if (!startDate || !endDate || !roomType) {
      showError("Please select fields");
      return false;
    }

    try {
      const formattedStartDate = startDate
        ? startDate.toLocaleDateString("en-CA")
        : null;
      const formattedEndDate = endDate
        ? endDate.toLocaleDateString("en-CA")
        : null;


      const resp = await ApiService.getAvailableRooms(
        formattedStartDate,
        formattedEndDate,
        roomType
      );

      if (resp.status === 200) {
        if (resp.rooms.length === 0) {
          showError("Room type not cuttently available for the selected date");
          return;
        }
        handSearchResult(resp.rooms);
        setError("");
      }
    } catch (error) {
      showError(error?.response?.data?.message || error.message);
    }
  };


return (
    <section>
      <div className="search-container">
  
          {/* checkj in date and calander field */}
        <div className="search-field" style={{ position: "relative" }}>
          <label>Check-in Date</label>
          <input
            type="text"
            value={startDate ? startDate.toLocaleDateString() : ""}
            placeholder="Select Check-In Date"
            onFocus={() => setStartDatePickerVisible(true)}
            readOnly
          />
  
          {isStartDatePickerVisible && (
            <div className="datepicker-container" ref={startDateRef}>
              <DayPicker
                selected={startDate}
                onDayClick={(date) => {
                  setStartDate(date);
                  setStartDatePickerVisible(false);
                }}
                month={startDate}
              />
            </div>
          )}
        </div>
  
  
          
          {/* checkj out date and calander field */}
        <div className="search-field" style={{ position: "relative" }}>
          <label>Check-Out Date</label>
          <input
            type="text"
            value={endDate ? endDate.toLocaleDateString() : ""}
            placeholder="Select Check-Out Date"
            onFocus={() => setEndDatePickerVisible(true)}
            readOnly
          />
  
          {isEndDatePickerVisible && (
            <div className="datepicker-container" ref={endDateRef}>
              <DayPicker
                selected={endDate}
                onDayClick={(date) => {
                  setEndtDate(date);
                  setEndDatePickerVisible(false);
                }}
                month={startDate}
              />
            </div>
          )}
        </div>
  
        {/* ROOM TYPE SELECTION FIELDS */}
        <div className="search-field">
          <label>Room Type</label>
          <select value={roomType} onChange={(e)=> setRoomType(e.target.value)}>
              <option disabled value="">Select Room Type</option>
              {roomTypes.map((roomType) =>(
                  <option value={roomType} key={roomType}>
                      {roomType}
                  </option>
              ))}
          </select>
        </div>
  
        {/* SEARCH BUTTON */}
        <button className="home-search-button" onClick={handleInternalSearch}>
          Search Roooms
        </button>
      </div>
  
      {error && <p className="error-message">{error}</p>}
    </section>
  );
};


export default RoomSearch;
