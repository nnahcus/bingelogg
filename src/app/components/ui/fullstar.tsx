"use client"
import { useState, MouseEvent } from "react"
import { FaStar, FaStarHalf, FaRegStar,  } from "react-icons/fa"


export default function Fullstar () {
    const[rating,setRating] = useState(0)
    const[hover,setHover] = useState(0)

    const stars = Array(5).fill(0)

return(
    <div className="flex flex-row">
        {stars.map((_,index) =>{
            const value= index+1
        return( 
        <FaStar key={value} size={24} 
        color={(hover || rating) > index ? "#FFED29" : "#C4C4C4"}
        onClick={() => setRating(value)}
        onMouseEnter={() => setHover(value)}
        onMouseLeave={() => setHover(0)}
        />
    )
        })}
    </div>
)
}