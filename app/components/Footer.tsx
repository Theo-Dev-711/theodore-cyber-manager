import Link from 'next/link'
import React from 'react'
import Image from "next/image"

const Footer = () => {
    return (
        <div className='mt-16 flex flex-col gap-8 items-center md:justify-between md:gap-0 md:flex-row md:items-start bg-gray-800 rounded-lg p-8'>
            {/* first Box */}
            <div className='flex flex-col items-center gap-4 md:items-start'>
                <Link href="/home" className='flex items-center relative aspect-[2/1]'>
                    <Image
                        src="/logo.png"
                        alt='Cyber Pgs'
                        fill
                        className='w-6 h-6 md:w-9 md:h-9 object-cover'
                    />
                    <p className='text-md font-medium tracking-wider  text-white'>CYBER PGS</p>
                </Link>
                <p className='text-gray-400 text-sm'>© 2025cyberpgs.</p>
                <p className='text-gray-400 text-sm'>All rights reserved.</p>
            </div>
            {/* SecondBox */}
            <div className='flex flex-col gap-4 text-sm text-gray-400 items-center md:items-start'>
                <p className='text-sm text-amber-50'>Links</p>
                <Link href="/home">Homepage</Link>
                <Link href="/home">Contact</Link>
                <Link href="/home">Terms of Service</Link>
                <Link href="/home">Privacy Policy</Link>
                
            </div>
            <div className='flex flex-col gap-4 text-sm text-gray-400 items-center md:items-start'>
                <p className='text-sm text-amber-50'>Links</p>
                <Link href="/home">About</Link>
                <Link href="/home">Contact</Link>
                <Link href="/home">Affiliate Program</Link>
               
            </div>
        </div>
    )
}

export default Footer
