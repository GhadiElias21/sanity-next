'use client'
 
import { useState } from "react";
function Home() {
  const [number,setNumber]=useState(9)
  return (
    <div onClick={()=>setNumber((prev)=>  {
      console.log(prev)
      return prev+1})} className="w-[100vw] bg-red-300 ">
        {number} dashboard
       </div>
  );
}
export default Home
