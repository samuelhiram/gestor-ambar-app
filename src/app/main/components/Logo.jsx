import React from "react";
import Image from "next/image";

export default function Logo() {
  return (
    <div className="w-full ">
      <div className="p-2">
        <div className="shadow-md rounded-2xl overflow-hidden border">
          <div className=" bg-gray-100/90 flex flex-col w-full justify-center items-center">
            <div className="flex w-full">
              <div className="p- flex flex-wrap bg-blue-900/90 w-2/5 justify-center items-center text-white">
                {/* <Image
                  src="img/ittlogo_.svg"
                  alt="TecTijuana"
                  width={60}
                  height={60}
                /> */}
                <div>
                  <p className="font-extralight text-sm  text-left">Sistema</p>
                  <p className="font-bold text-2xl text-left">CIMS</p>
                </div>
              </div>
              <div className="w-3/5 flex justify-center">
                <Image
                  src="img/logo.svg"
                  alt="TecTijuana"
                  width={175}
                  height={175}
                  className="p-2"
                />
              </div>
            </div>
            <div className="text-md w-full flex px-4 py-2 justify-center gap-4 items-center bg-blue-900 text-gray-50/90 font-light">
              <p className="text-center">
                Control e Inventario de Materiales y Suplementos
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
