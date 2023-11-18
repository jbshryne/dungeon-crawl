import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleInputChange = (event) => {
    setFormData((currentFormData) => {
      return {
        ...currentFormData,
        [event.target.name]: event.target.value,
      };
    });
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log("Login");

    const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    // console.log(response);

    if (response.ok) {
      console.log("Login successful!");
      const data = await response.json();

      if (data.username) {
        localStorage.setItem("currentUser", JSON.stringify(data));
        navigate("/game");
      }
    }
  };

  return (
    <div className="auth-component">
      <h1>LOGIN</h1>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleInputChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleInputChange}
        />
        <button type="submit">Login</button>
      </form>
      <p> </p>
    </div>
  );
};

export default Login;
