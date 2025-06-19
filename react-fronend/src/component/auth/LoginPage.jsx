import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { state } = useLocation();

  const redirectPath = state?.from?.pathname || "/home";

  //handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };



  const handleSubmit = async (e) =>{
    e.preventDefault()
    const {email, password} = formData;

    if (!email || !password) {
        setError("Please fill all input")
        setTimeout(() => setError(""), 5000);
        return;
    }

    try {
        const {status, token, role} = await ApiService.loginUser(formData);
        if (status === 200) {
            ApiService.saveToken(token)
            ApiService.saveRole(role)
            navigate(redirectPath, {replace: true})
        }
        
    } catch (error) {
        setError(error.response?.data?.message || error.message)
        setTimeout(() => setError(""), 5000);
        
    }
  }



  return(
    <div className="auth-container">
        {error && (<p className="error-message">{error}</p>)}

        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
            {["email", "password"].map(
                (field) => (
                    <div className="form-group" key={field}>
                        <label>{field.charAt(0).toLocaleUpperCase() + field.slice(1)}: </label>
                        <input type={field} 
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        required
                        />
                    </div>
                )
            )}
            <button type="submit">Login</button>
        </form>
        <p className="register-link"> Don't have an account? <a href="/register">Register</a></p>

    </div>
)




};





export default LoginPage;
