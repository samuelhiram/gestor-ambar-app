import React from "react";
import Image from "next/image";

export default function Logo() {
  return (
    <div className="w-full ">
      <div className="p-2">
        <div className="shadow-md rounded-2xl overflow-hidden border">
          <div className=" bg-gray-100/90 flex flex-col w-full justify-center items-center  ">
            <div className="flex w-full">
              <div className="flex flex-col bg-blue-900/80 w-1/4 justify-center items-center text-white">
                <div>
                  <p className="text-xs font-light text-left">Sistema</p>
                  <p className="font-light text-xl text-left">CIMS</p>
                </div>
              </div>
              <div className="w-3/4 flex justify-center ">
                <Image
                  src="img/logo.svg"
                  alt="TecTijuana"
                  width={175}
                  height={175}
                  className="p-2"
                />
              </div>
            </div>
            <div className="text-sm w-full flex p-1 justify-center gap-4 items-center bg-blue-900 text-gray-50/90 font-light">
              <p className="">
                Control e Inventario de Materiales y Suplementos
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
