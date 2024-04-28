'use client'
import { icon } from "./icon"
import { button } from "./button/button"
import './header.scss'
import { useEffect, useState } from "react"
import Login from "./login/login"
import Link from "next/link"
import Cookies from "js-cookie"
import { getUser } from "./home/content"

export default  function Header(){
    const [login,setLogin]=useState(false)
    const [user,setUser]=useState({name:''})
    useEffect(()=>{
        setUser(getUser()||{name:''})
    },[])
    if(user!=null)
    return <div className="header-component">
          {login&&<Login onClose={()=>setLogin(false)}></Login>}
        <div className="logo">
            <div className="logo-img">
                <img src={icon.logo.src}></img>
            </div>
            <div className="logo-search"></div>
        </div>
     
        <div className="button-header">
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
      
            <div className="user-avatar">          <img src='https://fptshop.com.vn/uploads/originals/2023/11/14/638356007024019763_anime-ai-la-gi-bat-mi-cach-tao-anime-bang-ai-cuc-don-gian.png'></img></div>
            </>}
        
        </div>
    </div>
}