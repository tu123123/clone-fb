'use client'
import Image from 'next/image'
import { Avatar, CommentInput } from '../home/content'
import './messenger.scss'
import { icon } from '../icon'
import { ReactNode, memo, useContext, useEffect, useRef, useState } from 'react'
import { addData, getData, getData2, updateData } from '../firebase/config'
import { and, documentId, where } from 'firebase/firestore'
import { HomeContext } from '@/app/page'
import moment from 'moment'
import { v4 } from 'uuid'
import Link from 'next/link'
import { Loading2 } from '../loading/loading'
import { message } from 'antd'



const MessItem=({value,list,index}:{value:any,list:any,index:number})=>{
    let item=list[index-1]
    const {user}=useContext(HomeContext)
    return <div className={`MessItem ${value.id==user.id&&'userchat'}`}>
       {value.id==user.id?<></>:item&&item.id==value.id?<div style={{
        minWidth:30
       }}></div>: <Avatar img={value.imgURL}></Avatar>}
        <div className='MessItem-content'>
            <p>{value.chat}</p>
            <div className='MessItem-content-time'>{moment(value.time,'DD/MM/YYYY HH:mm').toNow()}</div>
        </div>
    </div>
}
const MessInput=({data,value}:{data:any,value:any})=>{
    const [text,setText]=useState<string>('')
    const {user}=useContext(HomeContext)
    const onSend=(e?:any)=>{
        if(e) e.preventDefault()
            if(text.trim()=='')return
       setText('')
        updateData('messenger',data?.id,{
            chats:[...data.chats,{...user,chat:text,idchat:v4(),time:moment().format('DD/MM/YYYY HH:mm')}]
        },()=>{
            getData2('thongbaotinnhan',(e:any)=>{
                let find=e.find((i:any)=>i.userSend.id==user.id)
                if(find)
                    {
                        updateData('thongbaotinnhan',find.id,{
                            message:text
                        },()=>{

                        },()=>{})
                    }
                else{
                    addData('thongbaotinnhan',{
                        message:text,
                        userid:value.id,
                        userSend:{...user},
                        read:false,
                        time:moment().format('DD/MM/YYYY HH:mm')
                    },()=>{})
                }
                updateData('realtime','08ORLO3C2HSF4aCTZwcf',{user:{...value},userSend:{...user},time:moment().format('DD/MM/YYYY HH:mm')},()=>{},()=>{})
            },where('userid','==',value.id))
        },()=>{})
    }
    return <div className='MessInput'>
        <textarea autoFocus onKeyPress={(e:any)=>{
        if(e.key=='Enter'&&e.shiftKey) return
        
        if(e.key=='Enter'){
            onSend(e)
        }
       }} value={text} onChange={(e)=>{
            setText(e.target.value)
        }} rows={1}></textarea> <Image onClick={()=>{
            onSend()
        }} alt='' width={20} height={20} src={icon.send.src} ></Image>
    </div>
}
 const Messenger=({value}:{
    value:any
})=>{
    const {user,setListChat}=useContext(HomeContext)
    const [chat,setChat]=useState<any>({})
    const [loading,setLoading]=useState(true)
    const count=useRef(1)
    const getDataChat=()=>{
        if(user)
        getData('messenger',((e:any)=>{
            setLoading(false)
            if(e[0])
            setChat(e.find((i:any)=>i.member.find((a:string)=>a==value.id)))
            
                
            
                   
                }),where('member','array-contains',user.id))
           }
    
    useEffect(()=>{
        if(count.current==1&&user)
       {
        
                getData2('messenger',((e:any)=>{
    
                        if(!e?.find((i:any)=>i.member.find((a:string)=>a==i.id)))
                            {
                           
                            addData('messenger',{
                                member:[user.id,value.id],
                                chats:[]
                            },()=>{    

                                getDataChat()  
                            })}
                            else getDataChat()
     
                            }),where('member','array-contains',user.id)
                         
                    
                    )}
  
        count.current=2
       return ()=>{}
    },[])
   
    return <div className='Messenger'>

        <div className={`Messenger-header`}>
            <Link href={'/'+value.id}><Avatar img={value.imgURL}></Avatar></Link>
            <p> {value.name}</p>
            <div className='Messenger-button'>
                <Image onClick={()=>{
                    setListChat((pre:any)=>{
                        return pre.filter((i:any)=>i.id!=value.id)
                    })
                }} alt='' className='img' width={30} height={30} src={icon.closewhite.src}></Image>
            </div>
        </div>
        <div ref={(e:HTMLDivElement )=>{
            if(e)
            e.scrollTop=e.scrollHeight
        }} className='Messenger-content' >
           {loading&& <Loading2></Loading2>}
          {chat?.chats?.map((i:{idchat:string},index:number)=>{
            return   <MessItem key={i.idchat} index={index} list={chat?.chats} value={i}></MessItem>
          })}
     
        </div>
        <div className='Messenger-footer'>
         <MessInput value={value} data={chat}></MessInput>
        </div>
    </div>
}
export {Messenger}
 function ListMess({children}:{
    children?:any
}){
    const {setListChat,user}=useContext(HomeContext)
    useEffect(()=>{
        if(user)
        getData('realtime',(e:any)=>{
           
            if(e[0]?.user.id==user.id)
               {
                setListChat((pre:any)=>{
                    if(pre.find(((a:{id:string})=>a.id==e[0]?.userSend.id))) return pre
                    return [...pre,{
                        ...e[0]?.userSend
                    }]
                })
                updateData('realtime','08ORLO3C2HSF4aCTZwcf',{user:{},userSend:{},time:moment().format('DD/MM/YYYY HH:mm')},()=>{},()=>{})
               }
        },where(documentId(),'==','08ORLO3C2HSF4aCTZwcf'))
    },[user])
    return <div className='ListMess'>

       {children}
    </div>
}
export default memo(ListMess)
