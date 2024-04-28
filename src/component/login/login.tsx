'use client'
import React, { ReactNode, use, useContext, useState,createContext } from 'react'
import './login.scss'
import Input from 'antd/es/input/Input'
import { icon } from '../icon'
import { Button } from 'antd'
import { getData2,getData,addData } from '../firebase/config'
import { and, where } from 'firebase/firestore'
import moment from 'moment'
import { HomeContext } from '@/app/page'
import Cookies from 'js-cookie'
import Loading from '../loading/loading'
import { notification } from 'antd';
export const openNotification = ( api:any,content='') =>( {
    success:()=>  api.success({
        message: `Lưu thành công`,
        description: content,
        placement:'top',
      }),
    
warning:()=>  api.warning({
    message: `Cảnh báo`,
    description: content,
    placement:'top',
  })
});
const LoginContext=createContext({})
const notifiContext=createContext({})
interface ModalType{
    title:string,
    children:ReactNode,
    groupButton?:ReactNode,
    onClose:()=>void ,
}
interface userType{
    name:string,
    password:string,
    gmail:string,
}
interface LoginType{

    onClose:()=>void ,
}
export const Modal=({title,children,groupButton,onClose}:ModalType)=>{

    return <div className='Modal'>
      
        <div className='modal-form'>
            <div className='modal-header'>
                <div className='modal-title'>
                    {title}
                </div>
                <div onClick={onClose} className='modal-close'><img src={icon.close.src}></img></div>
            </div>
            <div className='modal-body'>
              
                {children}</div>
             
            <div className='modal-footer'>
                {groupButton}
                
            </div>
        </div>
    </div>
}
const FormLogin=()=>{
   
    const {setUserLogin,userLogin}:any=useContext(LoginContext)
    return   <div className='formlogin'>
    <div className='inputItem'>
        <div className='label'>Tên đăng nhập</div>
        <Input value={userLogin.userid} onChange={(e:any)=>{
            setUserLogin((pre:any)=>{

                return {...pre,userid:e.target.value}
            })
        }} autoFocus></Input>
    </div>
    <div className='inputItem'>
        <div className='label'>Mật khẩu</div>
        <Input value={userLogin.password} onChange={(e:any)=>{
            setUserLogin((pre:any)=>{

                return {...pre,password:e.target.value}
            })}} type='password'></Input>
    </div>
</div>
}
const Formdangky=()=>{
    const {user,setUser}:any =useContext(LoginContext)
    return   <div className='formlogin'>
    <div className='inputItem'>
        <div className='label'>Tên hiển thị</div>
        <Input value={user.name} onChange={(e)=>setUser((pre:any)=>{
            return {
                ...pre,
                name:e.target.value
            }
        })} autoFocus></Input>
    </div>

    <div className='inputItem'>
        <div className='label'>Tên đăng nhập</div>
        <Input  value={user.userid} onChange={(e)=>setUser((pre:any)=>{
            return {
                ...pre,
                userid:e.target.value
            }
        })} ></Input>
    </div>
    <div className='inputItem'>
        <div className='label'>Gmail</div>
        <Input value={user.gmail} onChange={(e)=>setUser((pre:any)=>{
            return {
                ...pre,
                gmail:e.target.value
            }
        })} ></Input>
    </div>
    <div className='inputItem'>
        <div className='label'>Mật khẩu</div>
        <Input value={user.password} onChange={(e)=>setUser((pre:any)=>{
            return {
                ...pre,
                password:e.target.value
            }
        })}  type='password'></Input>
    </div>
    <div className='inputItem'>
        <div className='label'>Nhập lại mật khẩu</div>
        <Input value={user.prePassword} onChange={(e)=>setUser((pre:any)=>{
            return {
                ...pre,
                prePassword:e.target.value
            }
        })}  type='password'></Input>
    </div>
</div>
}
export default function Login({onClose}:LoginType){
    const [dangky,setDangky]=useState<boolean>(false)
    const [loading,setLoading]=useState(false)
    const [userLogin,setUserLogin]=useState({
        userid:'',   
        password:'',    
    })

    const [user,setUser]=useState({
        name:'',
        gmail:'',
        userid:'',
        password:'',
        prePassword:'',
        time:moment().format('DD/MM/YYYY HH:mm')
        
    })
    const [api, contextHolder] = notification.useNotification();
    return <Modal onClose={onClose} title='Đăng nhập' groupButton={
        dangky?
        <>
        <div onClick={()=>setDangky(false)} className='dangky'>Đăng nhập</div><Button onClick={()=>{
            setLoading(true)
            addData('user',user,()=>{
                setDangky(false)
                setLoading(false)
            })
        }} style={{
            fontSize:20,
            height:45
        }}>Đăng ký</Button> </>:
        <>
        <div onClick={()=>setDangky(true)} className='dangky'>Đăng ký</div>
        <Button
        onClick={()=>{
            setLoading(true)
            
            getData2('user',(e:any)=>{
               setLoading(false)
            if(!e[0]) return openNotification(api,'Đăng nhập thất bại').warning()
            openNotification(api,'Đăng nhập thành công').success()
             
                Cookies.set('user',JSON.stringify({
                  name:e[0].name,
                  id:e[0].id,
                  userid:e[0].userid
                }),{ expires: 360 })
            },and(where('userid','==',userLogin.userid),where('password','==',userLogin.password)))
        }}
        style={{
            fontSize:20,
            height:45
        }}>Đăng nhập</Button> </>
    }>
        {contextHolder}
        {loading&&<Loading></Loading>}
        <LoginContext.Provider value={{
            user,
            setUser,
            userLogin,
            setUserLogin

        }}>
        {dangky?<Formdangky ></Formdangky>: <FormLogin></FormLogin>}
        </LoginContext.Provider>
   
    </Modal>
}