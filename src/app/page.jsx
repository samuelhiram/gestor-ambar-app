"use client";
import Login from "./auth/Login";
import DialogMessage from "./components/DialogMessage";
import { useEffect, useState } from "react";
import Loader from "./components/Loader/Loader";
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
      setLoading(false);
      document.location.href = "/main";
    } else {
      setHasSession(false);
    }
    setLoading(false);
  }, []);
  return (
    <div className="w-full min-h-screen flex justify-center items-center gap-2">
      {loading && <Loader />}
      {!hasSession && !loading && <Login />}
      <DialogMessage />
    </div>
  );
}
