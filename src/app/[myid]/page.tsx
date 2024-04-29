'use client'
import { Button, Upload } from 'antd';
import './myuser.scss'
import { icon } from '@/component/icon'
import { ReactElement, ReactNode, useEffect, useRef, useState } from 'react'
import { getDownloadURL,ref,uploadBytes } from 'firebase/storage';
import ImgCrop from 'antd-img-crop';
import { getData2, imgDb, updateData } from '@/component/firebase/config';
import { documentId, where } from 'firebase/firestore';
import { getUser } from '@/component/home/content';
import HomeContent from '@/component/home/content';
import firebase from 'firebase/compat/app';
import { v4  } from 'uuid';
import { useRouter, useSearchParams } from 'next/navigation';
import Loading from '@/component/loading/loading';
import { createContext } from 'react';
import Cookies from 'js-cookie';
export const UserContext:any=createContext({})

const UploadImg=({children,onSave}:any)=>{

    const getSrcFromFile = (file:any) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
        });
      };
    return <ImgCrop onModalOk={(e:any)=>{
             
        getSrcFromFile(e).then((a:any)=>{
        
            onSave( {src:a,uid:e.uid,data:e})
     
      })
    
      }} showGrid rotationSlider aspectSlider>
<Upload
>
  <Button style={{
      fontSize:17,
      height:40
  }}>{children}</Button>
</Upload>
</ImgCrop>
}
export default function MyUser({params}:{params:{myid:string}}){
   const myuser=useRef<any>()

const [user,setUser]=useState<any>()
const getUserInfo=()=>{
myuser.current=getUser()
    if(getUser())
    getData2('user',(e:any)=>{
        
        setUser(e[0])
    },where(documentId(),'==',params.myid))
}
const checkuser=useRef<any>()
useEffect(()=>{
   checkuser.current=getUser()
    
    getUserInfo()
},[])
const [loading,setLoading]=useState<any>(false)
if(user)
return <div className='MyUser'>
       {loading&&<Loading></Loading>}
    <div className='mycontent'>
    <div style={{
            backgroundImage:`url("${user?.backgroundUrl}")`
        }} className='MyUser-background'>
           {checkuser.current?.id===params.myid&&<div className='button'>
            <UploadImg onSave={(e:any)=>{
                   let imgRef=ref(imgDb,'files/'+v4()+e.data.name,)
                   uploadBytes(imgRef,e.data).then(value=>{
                       getDownloadURL(value.ref).then((url:string)=>{updateData('user',user.id,{
                        backgroundUrl:url
                       },()=>
                        getUserInfo(),(e:any)=>{console.log(e)})})
                       
               })
            }}>
                Chỉnh sửa ảnh
          </UploadImg>
           
           </div>}
        </div>
       <div className='user-info'>
       <div  style={{
            backgroundImage:`url("${user?.imgURL}")`
        }} className='MyUser-avatar'>
           {checkuser.current?.id===params.myid&&<div  className='edit'>
           <UploadImg onSave={(e:any)=>{
                    let imgRef=ref(imgDb,'files/'+e.data.name)
                    uploadBytes(imgRef,e.data).then(value=>{
                        getDownloadURL(value.ref).then((url:string)=>{updateData('user',user.id,{
                         imgURL:url
                        },()=>
                         getUserInfo(),(e:any)=>{console.log(e)})})
                        
                })
             }}>
                 <img src={icon.camera.src}></img>
           </UploadImg>
            
           </div>}
        </div>
        <div className='user-name'>
        {user?.name}
        </div>
       </div>
             <div className='user-homebody'>
             <div className='detail-user'>
                <div className='detail-header'>
                Giới thiệu
                </div>
                <div className='button-detail'>Thêm tiểu sử</div>
                <div className='button-detail'>Chỉnh sửa chi tiết</div>
                <div className='button-detail'>Thêm nội dung đáng chú ý</div>
                <div onClick={()=>{
                    Cookies.remove('user')
                    window.location.href='/'
                }} className='button-detail'>Đăng xuất</div>
             </div>
             <UserContext.Provider value={{userhome:user,setLoadinghome:setLoading}}> <HomeContent params={{...params,myuser:{...myuser.current}}}></HomeContent></UserContext.Provider>
           
            
             </div>
    </div>
   
</div>
}