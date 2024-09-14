import Login from "./auth/Login";
import Image from "next/image";
import PassRecovery from "./auth/PassRecovery";

export default function Home() {
  return (
    <>
      <div className="min-h-screen w-full flex flex-col gap-8 justify-center items-center">
        <div className="flex flex-col gap-4">
          <Image src="img/logo.svg" alt="TecTijuana" width={250} height={250} />
          <div>
            <p className="font-light text-2xl w-full flex justify-center items-center">
              Gestor Ambar - TecNM
            </p>
            <p className="text-sm flex w-full justify-center">
              Control e inventario de materiales
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 justify-center items-center ">
          <Login />
          <PassRecovery />
        </div>
      </div>
    </>
  );
}
