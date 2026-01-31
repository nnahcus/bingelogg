"use client"
import { useState, MouseEvent } from "react"
import { FaStar, FaStarHalf } from "react-icons/fa"

interface StarRatingProps {
  value?: number
  onChange?: (rating: number) => void
  readonly?: boolean
  color?: string
  emptyColor?: string
}


export default function StarRating ({value = 0, onChange, readonly = false, color = "#FFDE4D", emptyColor="#EBE8DB"}:StarRatingProps) {
    const[hover,setHover] = useState(0)
    const stars = Array(5).fill(0)

    // หาตำแหน่งของดาวคืนค่า rating
    const HandleMouse = (e: MouseEvent<HTMLDivElement>, index: number):number => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const isLeftHalf = x < rect.width / 2;
        return isLeftHalf ? index + 0.5 : index + 1;
  };
//   เรนเดอร์ดาว
  const renderStar = (index: number) => {
    const starValue = index + 1;
    const currentRating = hover || value;

    if (currentRating >= starValue) {
      return <FaStar color={color} />;
    } else if (currentRating >= starValue - 0.5) {
      return <FaStarHalf color={color} />;
    } else {
      return <FaStar color={emptyColor} />;
    }
  };

 
return(
    <div className="flex flex-row">
        {stars.map((_,index) =>{
        return( 
        <div key={index} 
        onClick={ readonly || !onChange ? undefined : (e) => onChange(HandleMouse(e, index))}
        onMouseMove={ readonly ? undefined : (e) => setHover(HandleMouse(e, index))}
        onMouseLeave={ readonly ? undefined : () => setHover(0)}
        className={`${readonly ? "text-xl cursor-default" : "text-2xl cursor-pointer"}`}>
          {renderStar(index)}
        </div>
    )
        })}
    </div>
)
}