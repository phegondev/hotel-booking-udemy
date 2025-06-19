import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";



const EditRoomPage = () => {

  const { roomId } = useParams();
  const navigate = useNavigate();

  const [roomDetails, setRoomDetails] = useState({
    roomNumber: "",
    type: "",
    pricePerNight: "",
    capacity: "",
    description: "",
    imageUrl: "",
  });


  const [roomTypes, setRoomTypes] = useState([]); // Store room types
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  
  // Fetch room details and room types
  useEffect(() => {
    const fetchData = async () => {
      try {
        const roomResponse = await ApiService.getRoomById(roomId);
        setRoomDetails({
          roomNumber: roomResponse.room.roomNumber,
          type: roomResponse.room.type,
          pricePerNight: roomResponse.room.pricePerNight,
          capacity: roomResponse.room.capacity,
          description: roomResponse.room.description,
          imageUrl: roomResponse.room.imageUrl,
        });

        const typesResponse = await ApiService.getRoomTypes();
        setRoomTypes(typesResponse); // Set available room types
      } catch (error) {
        setError(error.response?.data?.message || error.message);
      }
    };
    fetchData();
  }, [roomId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoomDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setFile(null);
      setPreview(null);
    }
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("type", roomDetails.type);
      formData.append("pricePerNight", roomDetails.pricePerNight);
      formData.append("description", roomDetails.description);
      formData.append("capacity", roomDetails.capacity);
      formData.append("id", roomId);

      if (file) {
        formData.append("imageFile", file);
      }

      const result = await ApiService.updateRoom(formData);
      if (result.status === 200) {
        setSuccess("Room updated successfully.");
        setTimeout(() => {
          navigate("/admin/manage-rooms");
        }, 3000);
      }
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setTimeout(() => {
        setError("");
        setSuccess("");
      }, 5000);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Do you want to delete this room?")) {
      try {
        const result = await ApiService.deleteRoom(roomId);
        if (result.status === 200) {
          setSuccess("Room deleted successfully.");
          setTimeout(() => {
            navigate("/admin/manage-rooms");
          }, 3000);
        }
      } catch (error) {
        setError(error.response?.data?.message || error.message);
      } finally {
        setTimeout(() => setError(""), 5000);
      }
    }
  };

  return (
    <div className="edit-room-container">
      <h2>Edit Room</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <div className="edit-room-form">
        <div className="form-group">
          {preview ? (
            <img
              src={preview}
              alt="Room Preview"
              className="room-photo-preview"
            />
          ) : (
            roomDetails.imageUrl && (
              <img
                src={roomDetails.imageUrl}
                alt="Room"
                className="room-photo"
              />
            )
          )}
          <input type="file" name="file" onChange={handleFileChange} />
        </div>

        <div className="form-group">
          <label>Room Type</label>
          <select name="type" value={roomDetails.type} onChange={handleChange}>
            <option value="">Select a type</option>
            {roomTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Room Price</label>
          <input
            type="text"
            name="pricePerNight"
            value={roomDetails.pricePerNight}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Room Number</label>
          <input
            type="text"
            name="roomNumber"
            value={roomDetails.roomNumber}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Room Capacity</label>
          <input
            type="text"
            name="capacity"
            value={roomDetails.capacity}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Room Description</label>
          <textarea
            name="description"
            value={roomDetails.description}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="form-actions">
          <button className="update-button" onClick={handleUpdate}>
            Update Room
          </button>
          <button className="delete-button" onClick={handleDelete}>
            Delete Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditRoomPage;
