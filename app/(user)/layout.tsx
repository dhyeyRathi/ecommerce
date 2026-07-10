import React, { Suspense } from 'react'
import NavBar from "@/app/components/NavBar";
import Footer from '../components/Footer';

const UserLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>)  => {
  return (
    <div className=''>
       <Suspense fallback={<div className="h-20 bg-background border-b border-border" />}>
         <NavBar />
       </Suspense>
       {children}
       <Footer></Footer>
    </div>
  )
}

export default UserLayout
