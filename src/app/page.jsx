"use client";
import { use } from "bcrypt/promises";
import Login from "./auth/Login";
import DialogMessage from "./components/DialogMessage";
import { useEffect, useState } from "react";

export default function Home() {
  const [hasSession, setHasSession] = useState(true);
  var token;
  var userId;
  useEffect(() => {
    //fetch create defaultUser
    fetch("/api/createDefaults")
      .then((res) => res.json())
      .then((data) => console.log(data));

    userId = localStorage.getItem("userId");
    token = localStorage.getItem("token");
    if (token && userId) {
      document.location.href = "/main";
    } else {
      setHasSession(false);
    }
  }, []);
  return (
    <>
      {hasSession ? null : <Login />}
      <DialogMessage />
    </>
  );
}
