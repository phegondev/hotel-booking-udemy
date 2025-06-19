import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";


const RegisterPage = () => {

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phoneNumber: ""
    });

    const [message, setMessage] = useState({type: "", text: ""});
    const navigate = useNavigate();

    //handle inouyt change
    const handleInputChange = ({target: {name, value}}) => 
        setFormData((prev) => ({... prev, [name]:value}));

    //validate from field
    const isFormValid = Object.values(formData).every((field) => field.trim());

    //handle form submissiion
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) {
            setMessage({type: "error", text: "Please fill all fields"})
            setTimeout(()=> setMessage({}), 5000);
            return;
        }
        try {
            const resp = await ApiService.registerUser(formData);
            if (resp.status === 200) {
                setMessage({type: "success", text: "User Registered successfully"})
                setTimeout(()=> navigate("/login"), 3000);
            }
            
        } catch (error) {
            setMessage({type: "error", text: error.response?.data?.message || error.message})
            setTimeout(()=> setMessage({}), 5000);
            
        }
    }


    return(
        <div className="auth-container">
            {message.text && (<p className={`${message.type}-message`}>{message.text}</p>)}

            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                {["firstName", "lastName", "email", "phoneNumber", "password"].map(
                    (field) => (
                        <div className="form-group" key={field}>
                            <label>{field.replace(/([A-Z])/g, " $1").trim()}: </label>
                            <input type={field === "email" ? "email" : "text"} 
                            name={field}
                            value={formData[field]}
                            onChange={handleInputChange}
                            required
                            />
                        </div>
                    )
                )}
                <button type="submit">Register</button>
            </form>
            <p className="register-link"> Already have an account? <a href="/login">Login</a></p>

        </div>
    )

}

export default RegisterPage;