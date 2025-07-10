import { useEffect, useState } from "react";

import { usePage } from "@inertiajs/react";

interface IFlash {
  success?: string;
  error?: string;
}

export default function FlashMessage({ externalFlash = null }) {
  const { flash } = usePage().props;
  const [visible, setVisible] = useState(false);
  const [showing, setShowing] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("success");
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const realFlash: IFlash = externalFlash || (flash as IFlash);

    if (realFlash?.success) {
      setType("success");
      setMessage(realFlash.success);
      setVisible(true);
      setProgress(100);
    } else if (realFlash?.error) {
      setType("error");
      setMessage(realFlash.error);
      setVisible(true);
      setProgress(100);
    }
  }, [flash, externalFlash]);

  useEffect(() => {
    if (visible) {
      setShowing(true);
      const duration = 5000;
      const interval = 30;
      let elapsed = 0;

      const timer = setInterval(() => {
        elapsed += interval;
        setProgress(100 - (elapsed / duration) * 100);
        if (elapsed >= duration) {
          clearInterval(timer);
          setShowing(false);
          setTimeout(() => setVisible(false), 300);
        }
      }, interval);

      return () => clearInterval(timer);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className={`fixed top-5 right-5 z-50 w-80 transition-all duration-300 ${
        showing ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <div
        className={`flex items-start justify-between px-4 py-3 rounded shadow-lg text-white ${
          type === "success" ? "bg-green-500" : "bg-red-500"
        }`}
      >
        <div className="mr-4 font-secondary">{message}</div>
        <button
          onClick={() => {
            setShowing(false);
            setTimeout(() => setVisible(false), 300);
          }}
          className="ml-auto text-4xl text-white hover:text-gray-200"
        >
          &times;
        </button>
      </div>
      <div className="h-1 w-full bg-white bg-opacity-30 rounded-b overflow-hidden">
        <div
          className="h-full bg-white transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
