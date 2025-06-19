import React, { useState, useEffect } from "react";
import ApiService from "../../service/ApiService";
import { useNavigate, useParams } from "react-router-dom";
import { DayPicker } from "react-day-picker";

const RoomDetailsPage = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();

  //state management
  const [room, setRoom] = useState(null);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalDaysToStay, setTotalDaysToStay] = useState(0);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showBookingPreview, setShowBookingPreview] = useState(false);
  const [showMessage, setShowMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  //fetch room details

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const resp = await ApiService.getRoomById(roomId);
        setRoom(resp.room);

        console.log(resp);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRoomDetails();
  }, []);

  //Calculate total price
  const calculateTotalPrice = () => {
    if (!checkInDate || !checkOutDate) return 0;

    const oneDay = 24 * 60 * 60 * 1000; ///this is number in milisec

    const totalDays = Math.round(
      Math.abs((new Date(checkOutDate) - new Date(checkInDate)) / oneDay)
    ); //give the difference in millsec

    setTotalDaysToStay(totalDays);

    return room?.pricePerNight * totalDays || 0;
  };

  //handle booking confirmation
  const handleConfirmation = () => {
    if (!checkInDate || !checkOutDate) {
      setErrorMessage("Please select both check-in and check-out dates");
      setTimeout(() => setErrorMessage(null), 5000);
      return;
    }

    setTotalPrice(calculateTotalPrice());
    setShowBookingPreview(true);
  };

  const acceptBooking = async () => {
    console.log("Inside acceptBooking()");
    try {
      const formattedCheckInDate = checkInDate.toLocaleDateString("en-CA");
      const formatterdCheckOutDate = checkOutDate.toLocaleDateString("en-CA");

      const booking = {
        checkInDate: formattedCheckInDate,
        checkOutDate: formatterdCheckOutDate,
        roomId: room.id,
      };

      const resp = await ApiService.bookRoom(booking);

      if (resp.status === 200) {
        setShowMessage(
          "Your Booking is Successful. Your booking details have been sent to your email . Please proceeed for payment"
        );
        setTimeout(() => {
          setShowMessage(null);
          navigate("/rooms");
        }, 8000);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message);
    }
  };

  // If room is null, show loading
  if (!room) {
    return <div>Loading...</div>;
  }

  const { roomNumber, type, pricePerNight, capacity, description, imageUrl } = room;

  
  return (
    <div className="room-details-booking">
      {/* Success and Error Messages */}
      {showMessage && <p className="booking-success-message">{showMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {/* Room Details */}
      <h2>Room Details</h2>
      <img src={imageUrl} alt={type} className="room-details-image" />
      <div className="room-details-info">
        <h3>{type}</h3>
        <p>Room Number: {roomNumber}</p>
        <p>Capacity: {capacity}</p>
        <p>Price: ${pricePerNight} / night</p>
        <p>{description}</p>
      </div>

      {/* Booking Controls */}
      <div className="booking-info">
        <button
          className="book-now-button"
          onClick={() => setShowDatePicker(true)}
        >
          Select Dates
        </button>
        {showDatePicker && (
          <div className="date-picker-container">
            <div className="date-picker">
              <label>Check-in Date</label>
              <DayPicker
                selected={checkInDate}
                onDayClick={setCheckInDate}
                disabled={(date) => checkOutDate && date > checkOutDate}
              />
            </div>

            <div className="date-picker">
              <label>Check-out Date</label>
              <DayPicker
                selected={checkOutDate}
                onDayClick={setCheckOutDate}
                disabled={(date) => checkInDate && date < checkInDate}
              />
            </div>

            <button className="confirm-booking" onClick={handleConfirmation}>
              Proceed
            </button>
          </div>
        )}

        {/* Booking Preview and submit */}
        {showBookingPreview && (
          <div className="booking-preview">
            <h3>Booking Preview</h3>
            <p>
              <strong>Check-in Date:</strong>{" "}
              {checkInDate?.toLocaleDateString("en-CA")}
            </p>
            <p>
              <strong>Check-out Date:</strong>{" "}
              {checkOutDate?.toLocaleDateString("en-CA")}
            </p>
            <p>
              <strong>Total Days To Stay:</strong> {totalDaysToStay}
            </p>
            <p>
              <strong>Total Price:</strong> ${totalPrice}
            </p>
            <button onClick={acceptBooking}>Confirm and Book</button>
            <button
              className="cancel-booking"
              onClick={() => setShowBookingPreview(false)}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomDetailsPage;
