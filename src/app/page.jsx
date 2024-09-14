"use client";
import Login from "./auth/Login";
import DialogMessage from "./components/DialogMessage";

export default function Home() {
  return (
    <>
      <Login />
      <DialogMessage />
    </>
  );
}
