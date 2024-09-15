import React from "react";
import Image from "next/image";

export default function Logo() {
  return (
    <div className="w-full border-b">
      <div className="p-2">
        <div className="shadow-md border rounded-sm">
          <div className=" bg-gray-100/90 flex flex-col w-full justify-center items-center  rounded-sm overflow-hidden ">
            <div className="  flex justify-center ">
              <Image
                src="img/logo.svg"
                alt="TecTijuana"
                width={150}
                height={150}
                className="p-2"
              />
            </div>
            <div className=" w-full flex  text-sm p-1 justify-center items-center bg-blue-900 text-gray-50/90 font-light">
              <div className="flex space-x-1 items-baseline">
                <div className="font-semibold text-sm text-nowrap">
                  Control e Inventario
                </div>{" "}
                <div>-</div> <strong>TecNM</strong>
              </div>
              {/* <p className="text-sm flex w-full justify-center text-center">
            Control e Inventario de Materiales y Suplementos
          </p> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
