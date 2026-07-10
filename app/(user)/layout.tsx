import React, { Suspense } from 'react'
import NavBar from "@/app/components/NavBar";
import Footer from '../components/Footer';

const UserLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>)  => {
  return (
    <div className="flex flex-col min-h-screen">
       <Suspense fallback={<div className="h-20 bg-background border-b border-border" />}>
         <NavBar />
       </Suspense>
       <main className="flex-1">
         {children}
       </main>
       <Footer></Footer>
    </div>
  )
}

export default UserLayout
