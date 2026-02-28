 

import { useNavigate, useParams } from "react-router-dom";
import OTPInput from "./OTPInput";


export default function ResetPasswordPage() {
  const navigate=useNavigate();
  const {reg}=useParams<{reg:string}>();
  const regNo=encodeURIComponent(reg)
  const handleOTPComplete = async (otp: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/authentication/otp/${regNo}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ otp }),
        }
      );

      const data = await response.json();
 
      if (data.message === "password updated successfully") {
        alert("password updated successfully");
        navigate("/");
      }
    }catch (error) {
  console.error((error as Error).message);
}

  }

  return (
    <div className="absolute top-[30%] w-full">
    <div className="flex flex-col items-center justify-center shadow-md h-fit w-[70%] lg:w-[50%] mx-auto bg-white rounded-lg p-8 border border-gray-300" >
      <h2 className="mb-3 text-lg font-bold text-black">Enter Verification Code</h2>
      <OTPInput length={6} onComplete={handleOTPComplete} />
    </div>
    </div>
  );
}

