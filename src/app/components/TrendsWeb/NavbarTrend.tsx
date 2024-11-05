import React from 'react'
import { useRouter } from 'next/navigation';

const NavbarTrend = () => {
  const router = useRouter();

  const handleRoute = ()=>{
    router.push("/")
  }

  return (
    <div className=' w-full relative z-50'>
      <div className='shadow-md'>
        <img
        src="/nifoimage.png"
        alt="Nifo Logo"
        className='w-24 cursor-pointer'
        onClick={handleRoute}/>
      </div>
    </div>
  )
}

export default NavbarTrend
