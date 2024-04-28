'use client'
import Image from "next/image";
import './page.scss'
import HomeContent, { getUser } from "@/component/home/content";
import { ListContract } from "@/component/home/right";
import LeftContent from "@/component/home/left";
import Loading from "@/component/loading/loading";
import React,{useEffect, useState} from "react";
import { getData, getData2 } from "@/component/firebase/config";
import { documentId, where } from "firebase/firestore";

export const HomeContext= React.createContext<any>({})
export default function Home() {
  const [loading,setLoading]=useState(false)
  const [user,setUser]=useState<any>()
  useEffect(()=>{
    if(getUser())
    getData2('user',(e:any)=>{
    
      setUser(e[0])
  },where(documentId(),'==',getUser()?.id))
  },[])
  return (
    <HomeContext.Provider value={{loading,setLoading,user}}>
      {loading&&<Loading></Loading>}
            <div className="home-container">
      
        <div className="home-left"><LeftContent></LeftContent></div>
        <div className="home-content"><HomeContent home={false}></HomeContent></div>
        <div className="home-right"><ListContract></ListContract></div>
      </div>
    </HomeContext.Provider>
  );
}
