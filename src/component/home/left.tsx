'use client'
import './home.scss'
import { Avatar } from './content'
import { icon } from '../icon'
import Link from 'next/link'
import { getUser } from './content'
export default function LeftContent(){
  
    return <div className='LeftContent'>
        <Link href={'/'+getUser()?.name}> <div className='LeftContent-item user'>
            <Avatar></Avatar> <p>{getUser()?.name}</p>
        </div></Link>
       
        <div className='LeftContent-item'>
            <img src={icon.peoplecolor.src}></img> <p>Tìm kiếm bạn bè</p>
        </div>
        <div className='LeftContent-item'>
            <img src={icon.marketcolor.src}></img> <p>Marketplace</p>
        </div>
    </div>
}