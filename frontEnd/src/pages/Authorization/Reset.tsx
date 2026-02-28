import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Reset = () => {
     const [newPassword,setNewpassword]=useState<string>('')
    const [cpassword,setCpassword]=useState<string>('');
    const [match,setMatch]=useState<boolean>(true)
    const [id,setId]=useState<string>('')
    const navigate=useNavigate();
  return (
    <div className='absolute w-full top-[20%]'>
  <form   
  className="flex flex-col items-center justify-center shadow-md h-fit w-[70%] lg:w-[50%] mx-auto bg-white rounded-lg p-8 border border-gray-300"
  onSubmit={(e)=>{


  e.preventDefault();

  if(newPassword!==''){

  if(newPassword==cpassword){

                const formData = new FormData(e.target);
                const payload = {
                  ...Object.fromEntries(formData.entries()),
                };


                axios.post("http://localhost:3000/authentication/reset",payload).then(
                  response=>{
                    if(response.data=="user updated successfully"){
const encoded = encodeURIComponent(id);
navigate(`/otp/${encoded}`);
                    }})}
                    else{
                     setMatch(false)
                    }}
                    else{
                      alert("please fill all the input fields");
                    }

  }}>
    <div >
<label className='text-lg font-semibold'>Enter userName:</label>
<input type="text" name='userName' onChange={(e)=>setId(e.target.value)}
className='text-lg text-slate-700'/>      
    </div>
  
    
    <div>
<label  className='text-lg font-semibold'>Enter Email:</label>
<input type="email" name='email' className='text-lg text-slate-700' />      
    </div>
  
    <div>
<label className='text-lg font-semibold'>New PassWord:</label>
<input type="password" name='password' onChange={e=>setNewpassword(e.target.value)}
className='text-lg text-slate-700'/>      
    </div>

    <div>
        <label  className='text-lg font-semibold'>
Confirm Password:
        </label>
        <input type="text" onChange={e=>{setCpassword(e.target.value);setMatch(true)}}
         className='mb-0 text-lg text-slate-700'/>
        <p className={`text-red-600 text-sm mt-0 ${match?'hidden':'block'}`}>no match between the passwords!</p>
    </div>

    <input type="submit" value="Submit" className='px-4 py-1 mt-3 text-white bg-blue-600 hover:cursor-pointer hover:bg-blue-500'/>

  </form>

    </div>
  )
}

export default Reset