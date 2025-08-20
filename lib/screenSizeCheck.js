"use client"
import React, { useEffect,useState } from "react";
import { Alert } from "@/components/ui/alert"
import { TriangleAlert } from "lucide-react"
const CheckScreenSize=({children})=>{
    const[isMobile,setIsMobile]=useState(false);
    const [isChecked, setIsChecked] = useState(false); // Ensures initial check is done

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1200); // Adjust if needed
      setIsChecked(true);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!isChecked) return null; // Prevent flash before check

    if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80">
         <Alert
        layout="row"
        variant="warning"
        icon={
          <TriangleAlert className="opacity-60" size={16} strokeWidth={2} />}>
        <p className="text-sm">This website is only accessible on Desktop</p>
      </Alert>
        </div>
    );
  }
  return children;
}

export default CheckScreenSize;
