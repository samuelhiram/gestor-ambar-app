import Login from "./auth/Login";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="min-h-screen w-full flex flex-col gap-6 justify-center items-center ">
        <Image src="img/logo.svg" alt="TecTijuana" width={250} height={250} />
        <p className="font-light text-2xl">Gestor Ambar - TecNM</p>
        <Login />
      </div>
    </>
  );
}
