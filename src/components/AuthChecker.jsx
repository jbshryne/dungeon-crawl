import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthChecker = (props) => {
  const currentUser = localStorage.getItem("currentUser");

  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) navigate("/auth");
  }, [currentUser, navigate]);
  return <div>{props.children}</div>;
};

export default AuthChecker;
