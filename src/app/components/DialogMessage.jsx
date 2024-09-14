import React from "react";
import { Button } from "@/components/ui/button";
import { useAppContext } from "./GlobalContextApp";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

export default function DialogMessage() {
  const { state, setState } = useAppContext();
  return (
    <>
      {state.showDialogAlert === true ? (
        <div>
          <Dialog defaultOpen={true}>
            <DialogContent>
              <DialogHeader>
                <div className="justify-start text-start flex gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <rect width="24" height="24" fill="none" />
                    <path
                      fill="#1e3a8a"
                      d="M1 21L12 2l11 19zm11-3q.425 0 .713-.288T13 17t-.288-.712T12 16t-.712.288T11 17t.288.713T12 18m-1-3h2v-5h-2z"
                    />
                  </svg>
                  <DialogTitle>Aviso</DialogTitle>
                </div>
              </DialogHeader>
              <DialogDescription>{state.dialogMessage}</DialogDescription>
              <Button
                onClick={() => {
                  setState((prev) => ({
                    ...prev,
                    showDialogAlert: false,
                  }));
                }}
              >
                Aceptar
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      ) : null}
    </>
  );
}
