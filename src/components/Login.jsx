import { useState } from "react";

const Login = () => {
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

    const response = await fetch("http://localhost:3600/login", {
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
        localStorage.setItem("currentUser", data);
      }
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <label htmlFor="username">Username: </label>
        <input type="text" name="username" onChange={handleInputChange} />
        <label htmlFor="password">Password: </label>
        <input type="password" name="password" onChange={handleInputChange} />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
