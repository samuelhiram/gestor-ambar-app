"use client";
import { use } from "bcrypt/promises";
import Login from "./auth/Login";
import DialogMessage from "./components/DialogMessage";
import { useEffect, useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [hasSession, setHasSession] = useState(true);
  var token;
  var userId;
  useEffect(() => {
    setLoading(true);
    // fetch create defaultUser
    const fetchDefaults = async () => {
      const response = await fetch("/api/createDefaults");
    };
    fetchDefaults();

    userId = localStorage.getItem("userId");
    token = localStorage.getItem("token");
    if (token && userId) {
      document.location.href = "/main";
    } else {
      setHasSession(false);
    }
    setLoading(false);
  }, []);
  return (
    <>
      {loading && <div>Loading...</div>}
      {!hasSession && !loading && <Login />}
      <DialogMessage />
    </>
  );
}
