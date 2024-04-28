'use client'
import './home.scss'
import { Avatar } from './content'
import { icon } from '../icon'
import Link from 'next/link'
import { getUser } from './content'
import { useEffect, useState } from 'react'
export default function LeftContent(){
    const [user,setUser]=useState<any>()
    useEffect(()=>{
      setUser(getUser())
    },[])
    return <div className='LeftContent'>
        {user&&<Link href={'/'+user?.name}> <div className='LeftContent-item user'>
            <Avatar></Avatar> <p>{user?.name}</p>
        </div></Link>}
       
        <div className='LeftContent-item'>
            <img src={icon.peoplecolor.src}></img> <p>Tìm kiếm bạn bè</p>
        </div>
        <div className='LeftContent-item'>
            <img src={icon.marketcolor.src}></img> <p>Marketplace</p>
        </div>
    </div>
}