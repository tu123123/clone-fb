'use client'
import Image from "next/image";
import './page.scss'
import HomeContent from "@/component/home/content";
import { ListContract } from "@/component/home/right";
import LeftContent from "@/component/home/left";
import Loading from "@/component/loading/loading";
import React,{useState} from "react";

export const HomeContext= React.createContext<any>({})
export default function Home() {
  const [loading,setLoading]=useState(false)
 
  return (
    <HomeContext.Provider value={{loading,setLoading}}>
      {loading&&<Loading></Loading>}
            <div className="home-container">
      
        <div className="home-left"><LeftContent></LeftContent></div>
        <div className="home-content"><HomeContent></HomeContent></div>
        <div className="home-right"><ListContract></ListContract></div>
      </div>
    </HomeContext.Provider>
  );
}
