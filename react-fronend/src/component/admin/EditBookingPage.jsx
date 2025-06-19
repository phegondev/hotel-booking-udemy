import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService"; // Import API service

const EditBookingPage = () => {

  const { bookingCode } = useParams(); // Retrieve booking reference from URL
  const navigate = useNavigate();

  const [bookingDetails, setBookingDetails] = useState(null); // Store booking details

  const [formState, setFormState] = useState({
    id:"",
    bookingStatus: "",
    paymentStatus: "",
  }); // Form for updating status

  const [message, setMessage] = useState({ type: "", text: "" }); // For error/success messages

  // Fetch booking details on component mount
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await ApiService.getBookingByReference(bookingCode);
        setBookingDetails(response.booking);
        setFormState({
            id:response.booking.id,
          bookingStatus: response.booking.bookingStatus || "",
          paymentStatus: response.booking.paymentStatus || "",
        });
      } catch (error) {
        setMessage({
          type: "error",
          text: error.response?.data?.message || error.message,
        });
      }
    };

    fetchBookingDetails();
  }, [bookingCode]);

  // Handle input changes for bookingStatus and paymentStatus
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  // Handle update submission
  const handleUpdate = async () => {
    if (!formState.bookingStatus && !formState.paymentStatus) {
      setMessage({ type: "error", text: "Please update at least one field." });
      return;
    }

    try {
      await ApiService.updateBooking(formState);
      setMessage({ type: "success", text: "Booking updated successfully." });

      setTimeout(() => {
        setMessage({ type: "", text: "" });
        navigate("/admin/manage-bookings");
      }, 3000);
    } catch (error) {

        console.log(error);

      setMessage({
        type: "error",
        text: error.response?.data?.message || error.message,
      });
    }
  };

  // Render the component
  return (
    <div className="edit-booking-page">
      <h2>Update Booking</h2>

      {/* Display success or error messages */}
      {message.text && (
        <p className={`${message.type}-message`}>{message.text}</p>
      )}

      {/* Render booking details and update form */}
      {bookingDetails ? (
        <div className="booking-details">
          <h3>Booking Details</h3>
          <p>Confirmation Code: {bookingDetails.bookingReference}</p>
          <p>Check-in Date: {bookingDetails.checkInDate}</p>
          <p>Check-out Date: {bookingDetails.checkOutDate}</p>
          <p>Total Price: {bookingDetails.totalPrice}</p>
          <p>Payment Status: {bookingDetails.paymentStatus}</p>
          <p>Booking Status: {bookingDetails.bookingStatus}</p>

          <br />
          <hr />
          <br />
          <h3>User Who Made The Booking</h3>
          <div>
            <p> First Name: {bookingDetails.user.firstName}</p>
            <p> First Name: {bookingDetails.user.lastName}</p>
            <p> Email: {bookingDetails.user.email}</p>
            <p> Phone Number: {bookingDetails.user.phoneNumber}</p>
          </div>

          <br />
          <hr />
          <br />
          <h3>Room Details</h3>
          <div>
            <p> Type: {bookingDetails.room.type}</p>
            <p> Price per Night: ${bookingDetails.room.pricePerNight}</p>
            <p> Capacity : ${bookingDetails.room.capacity}</p>
            <p> Description: {bookingDetails.room.description}</p>
            <img src={bookingDetails.room.imageUrl} alt="" height="200" />
          </div>
          <hr />

          <h3>Update Status</h3>

          <div className="form-group">
            <label htmlFor="bookingStatus">Booking Status</label>
            <select
              id="bookingStatus"
              name="bookingStatus"
              value={formState.bookingStatus}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="BOOKED">BOOKED</option>
              <option value="CANCELLED">CANCELLED</option>
              <option value="CHECKED_IN">CHECKED IN</option>
              <option value="CHECKED_OUT">CHECKED OUT</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="paymentStatus">Payment Status</label>
            <select
              id="paymentStatus"
              name="paymentStatus"
              value={formState.paymentStatus}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="PENDING">PENDING</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="FAILED">FAILED</option>
              <option value="REFUNDED">REFUNDED</option>
              <option value="REVERSED">REVERSED</option>
            </select>
          </div>

          <button className="update-button" onClick={handleUpdate}>
            Update Booking
          </button>
        </div>
      ) : (
        <p>Loading booking details...</p>
      )}
    </div>
  );
};

export default EditBookingPage;
