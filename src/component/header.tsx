'use client'
import { icon } from "./icon"
import { button } from "./button/button"
import './header.scss'
import { useEffect, useRef, useState } from "react"
import Login from "./login/login"
import Link from "next/link"
import Cookies from "js-cookie"
import { getUser } from "./home/content"
import { getData2 } from "./firebase/config"
import { documentId, where } from "firebase/firestore"

export default  function Header(){
    const [login,setLogin]=useState(false)
    const menu=useRef<any>()
    const [user,setUser]=useState<any>({name:''})
    useEffect(()=>{
        if(getUser())
            getData2('user',(e:any)=>{
             
                setUser(e[0])
            },where(documentId(),'==',getUser()?.id))
    },[])
    if(user!=null)
    return <div className="header-component">
        <div ref={menu}className="menu2">
        <div className="menu-option">
        <div className="menu-option-header">
        <div className="logo-img">
                <img src={icon.logo.src}></img>
              
            </div>
            <div className="logo-close"><img onClick={()=>{
            menu.current.style.transform='translateX(-100vw)'
            }} src={icon.closewhite.src}></img></div>
        </div>
        <Link href={'/'}>
            <div  className="bottion-icon">          <img src={icon.home.src}></img></div>
            </Link>
            <div className="bottion-icon">          <img src={icon.group.src}></img>Group</div>
            <div className="bottion-icon">          <img src={icon.video.src}></img>Videos</div>
            <div className="bottion-icon">          <img src={icon.market.src}></img>MarketPlace</div>
        </div>
        <div className="menu-close"></div>
        </div>
          {login&&<Login onClose={()=>setLogin(false)}></Login>}
        <div className="logo">
            <div className="logo-img">
                <img src={icon.logo.src}></img>
            </div>
            <div className="logo-search"></div>
        </div>
     
        <div className="button-header">
        <div onClick={()=>{
       menu.current.style.transform='translateX(0)'
        }} className="bottion-icon menu">          <img src={icon.menu.src}></img></div>
            <Link href={'/'}>
            <div  className="bottion-icon">          <img src={icon.home.src}></img></div>
            </Link>
          
            <div className="bottion-icon">          <img src={icon.group.src}></img></div>
            <div className="bottion-icon">          <img src={icon.video.src}></img></div>
            <div className="bottion-icon">          <img src={icon.market.src}></img></div>
        </div>
        <div className="user-icon">
            {!user?.name?  <div onClick={()=>setLogin(true)} className="bottion-icon"> Đăng nhập</div>:
            <><div className="user-button">          <img src={icon.mess.src}></img></div>
            <div className="user-button">          <img src={icon.bell.src}></img></div>
      
            <div className="user-avatar">          <img src={ user?.imgURL||'https://fptshop.com.vn/uploads/originals/2023/11/14/638356007024019763_anime-ai-la-gi-bat-mi-cach-tao-anime-bang-ai-cuc-don-gian.png'}></img></div>
            </>}
        
        </div>
    </div>
}