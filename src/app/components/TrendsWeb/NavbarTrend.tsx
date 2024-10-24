import React from 'react'
import { useRouter } from 'next/navigation';

const NavbarTrend = () => {
  const router = useRouter();
  return (
    <div className=' w-full z-50'>
      <div className='shadow-md'>
        <img
        src="/nifoimage.png"
        alt="Nifo Logo"
        className='w-24'/>
      </div>
    </div>
  )
}

export default NavbarTrend
