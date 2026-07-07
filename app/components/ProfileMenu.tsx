"use client"
import { div } from 'motion/react-client'
import React, { ReactNode } from 'react'
import Link from 'next/link'
import {motion } from "motion/react"

type props = {
    children: React.ReactNode
}

const ProfileMenu = ({children} : props) => {
  return (
    <motion.div initial={{ scaleY:0.8, opacity: 0 , originY:0}}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
           exit={{ scaleY:0.8, opacity: 0 , originY:0}}
           className='absolute bg-background border-1 border-b-0 border-border top-14 flex-col right-[-80] '>
        {children}
    </motion.div>
  )
}

export default ProfileMenu



export const ProfileMenuItem =({children, href, className, onClick} : {children:string | React.ReactNode , href: string, className?:string , onClick?:()=>void}) => {
    return (<Link href={href} className={`w-50 border-b-1 border-border text-left hover:bg-heading  hover:text-background px-5 py-3 flex justify-start gap-4 items-center ${className}`}
    onClick={onClick}>
{children}
    </Link>)

}


