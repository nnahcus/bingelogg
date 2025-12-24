import React from 'react'

const CurrentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="w-full pt-4 py-4 border-t bg-[#111112] border-gray-600/30 text-[#BEBEBE] text-center font-poppins">      
        <div className="container mx-auto">
        <p>&copy; {CurrentYear} Bingelogg. All rights reserved.</p>
      </div>
    </footer>
  )
}

