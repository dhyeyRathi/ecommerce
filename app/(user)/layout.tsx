import React from 'react'
import NavBar from "@/app/components/NavBar";
import Footer from '../components/Footer';

const UserLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>)  => {
  return (
    <div className=''>
       <NavBar></NavBar>
       {children}
       <Footer></Footer>
    </div>
  )
}

export default UserLayout
