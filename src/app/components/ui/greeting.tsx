"use client"
import { useSession } from "next-auth/react"
import React, { useEffect, useRef, useState } from 'react'
type period = "morning" | "afternoon" | "evening"
export default function Greeting() {
        const [greeting, setGreeting] = useState("")
        const currentPeriod = useRef<period | null>(null);

        const getPeriod = (): period => {
            const hour = new Date().getHours();

            if (hour >=5 && hour < 12 ) {return "morning";}
            else if (hour >=12 && hour < 17 ) {return "afternoon";}
            else {return "evening"}
        };

        const { data: session } = useSession();

        const getPeriodWords = (period:period) => {
            const map: Record<period, string[]> = {
                 morning: ["Good morning~", "Wishing you a wonderful morning", "Have a great morning",
                    "Morning!", "Have an amazing day!"
                ],
                 afternoon: ["Good afternoon~~", "Hope your day is going well!", "Wishing you a lovely afternoon",
                    "Hi there!","Have a happy afternoon!"
                ],
                 evening: ["Good evening!!", "Hi there!", "Hello", "Hope you have the best evening",
                    "I hope you have a beautiful evening"
                ],
            };

            const words = map[period];
            return words[Math.floor(Math.random() * words.length)];
        };
        useEffect(() => {
            const updateGreeting = () => {
                const newPeriod = getPeriod();

            if(currentPeriod.current !== newPeriod) 
                {currentPeriod.current = newPeriod;
            setGreeting(getPeriodWords(newPeriod));
        }};
        updateGreeting();

        const interval = setInterval(updateGreeting, 60000);
        return () => clearInterval(interval); 

    }, []);
  return (
    <div className="pt-3 px-2 md:px-6"><h1 className="text-3xl font-light">{greeting}, {session?.user?.name}</h1></div>
  )
}
