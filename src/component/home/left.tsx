'use client'
import './home.scss'
import { Avatar } from './content'
import { icon } from '../icon'
import Link from 'next/link'
import { getUser } from './content'
import { useEffect, useState } from 'react'
import { getData2 } from '../firebase/config'
import { documentId, where } from 'firebase/firestore'
export default function LeftContent(){
    const [user,setUser]=useState<any>()
    useEffect(()=>{
        if(getUser())
        getData2('user',(e:any)=>{
         
            setUser(e[0])
        },where(documentId(),'==',getUser()?.id))
    },[])
    return <div className='LeftContent'>
        {user&&<Link href={'/'+user?.id}> <div className='LeftContent-item user'>
            <Avatar img={user.imgURL}></Avatar> <p>{user?.name}</p>
        </div></Link>}
       
        <div className='LeftContent-item'>
            <img src={icon.peoplecolor.src}></img> <p>Tìm kiếm bạn bè</p>
        </div>
        <div className='LeftContent-item'>
            <img src={icon.marketcolor.src}></img> <p>Marketplace</p>
        </div>
    </div>
}