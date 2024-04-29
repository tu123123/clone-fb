'use client'
import './home.scss'
import { Avatar, getUser } from './content'
import { getData, getData2 } from '../firebase/config'
import { useContext, useEffect, useState } from 'react'
import { HomeContext } from '@/app/page'
import { where } from 'firebase/firestore'
export function ListContract(){
    let user=getUser()
    const [users,setUsers]=useState<any>()
    useEffect(()=>{
        if(user)
        getData('user',(e:any)=>{
            setUsers(e||[])
        })

    },[])



    return <div className='ListContract'>

        <div className='header'>Người liên hệ</div>
        <div className='ListUser'>
            {!users? <div style={{
        color:'white'
    }}>Không có dữ liệu</div>:users?.map((i:any)=>{

                return <div key={i.id} className={`UserItem ${i.online&&'online'}`}>
                <Avatar img={i.imgURL}></Avatar> <p>{i.name}</p>
               
            </div>
            })}
      
       
    
        
        </div>
    </div>
}