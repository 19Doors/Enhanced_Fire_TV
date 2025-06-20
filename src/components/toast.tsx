"use client";

import React from "react";
import { toast as sonnerToast } from "sonner";

/** I recommend abstracting the toast function
 *  so that you can call it without having to use toast.custom everytime. */
export function toast(toast: Omit<ToastProps, "id">) {
  return sonnerToast.custom((id) => <Toast title={toast.title} />);
}

/** A fully custom toast that still maintains the animations and interactions. */
function Toast(props: ToastProps) {
  const { title } = props;

  return (
    <div className="border border-white flex rounded-lg bg-[#000000] text-white shadow-lg ring-1 ring-black/5 w-full md:max-w-[364px] items-center p-4">
      <div className="flex flex-1 items-center">
        <div className="w-full">
          <p className="font-inter font-bold text-xs text-white">
            {title}
          </p>
        </div>
      </div>
    </div>
  );
}

interface ToastProps {
  title: string;
}
