import React from "react";
import { FaHome, FaInfoCircle, FaUsers } from "react-icons/fa";
import { HiOutlineMenu, HiOutlineSupport, HiOutlineX } from "react-icons/hi";
import { Link } from "react-router-dom";

const Headers = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  return (
    <>
    <div className="hidden flex-row items-center justify-between px-[8%] py-4 bg-white shadow-md md:flex">
      <section>
        <img src="" alt="" />
        <h1 className="text-xl font-bold text-blue-600">CSA Kirinyaga</h1>
      </section>

      <ul className="flex flex-row gap-[10%]">
        <Link to="/" className="flex flex-row items-center gap-1">
          <FaHome className="w-5 h-5" />
          <li className="font-semibold">Home</li>
        </Link>
         <Link to="/about" className="flex flex-row items-center gap-1">
         <FaInfoCircle className="inline w-5 h-5" />
          <li className="font-semibold">About</li>
        </Link>
        <Link to="/community" className="flex flex-row items-center gap-1">
         <FaUsers className="w-5 h-5"/>
          <li className="font-semibold">community</li>
        </Link>
        <Link to="/support" className="flex flex-row items-center gap-1">
        <HiOutlineSupport className="w-5 h-5" />
          <li className="font-semibold">support</li>
        </Link>
      </ul>
      <section>
        <button className="px-5 py-1 text-white transition duration-200 bg-blue-600 rounded-md hover:bg-blue-700">Login</button>
      </section>
    </div>

    <div className="flex flex-row items-center justify-between px-[8%] py-4 bg-white shadow-md md:hidden">
      <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 focus:outline-none">
        <HiOutlineMenu className={`w-6 h-6 ${!isMenuOpen? 'block' : 'hidden'}`} />
        <HiOutlineX className={`w-6 h-6 ${isMenuOpen ? 'block' : 'hidden'}`} />
       </button>
<div>
      {isMenuOpen && (
        <ul className="absolute left-0 flex flex-col items-center w-full gap-4 py-4 transition duration-500 bg-white shadow-md top-16">

           <section>
        <img src="" alt="" />
        <h1 className="text-xl font-bold text-blue-600">CSA Kirinyaga</h1>
      </section>
          <Link to="/" className="flex flex-row items-center gap-1 px-4 py-2">
          <FaHome className="w-5 h-5" />
          <li className="font-semibold">Home</li>
        </Link>
          <Link to="/about" className="flex flex-row items-center gap-1 px-4 py-2">
          <FaInfoCircle className="inline w-5 h-5" />
          <li className="font-semibold">About</li>
        </Link>
          <Link to="/community" className="flex flex-row items-center gap-1 px-4 py-2">
          <FaUsers className="w-5 h-5"/>
          <li className="font-semibold">community</li>
        </Link>
          <Link to="/support" className="flex flex-row items-center gap-1 px-4 py-2">
          <HiOutlineSupport className="w-5 h-5" />
          <li className="font-semibold">support</li>
        </Link>
          <Link to="/login" className="block px-4 py-2 text-center text-white bg-blue-600 rounded-md hover:bg-blue-700">
            Login
          </Link>
        </ul>
      )}
</div>
      
 
    </div>

    </>
  );
};

export default Headers;
