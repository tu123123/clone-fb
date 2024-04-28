'use client'
import { Button, Upload } from 'antd';
import './myuser.scss'
import { icon } from '@/component/icon'
import { ReactElement, ReactNode, useEffect, useState } from 'react'
import { getDownloadURL,ref,uploadBytes } from 'firebase/storage';
import ImgCrop from 'antd-img-crop';
import { getData2, imgDb, updateData } from '@/component/firebase/config';
import { documentId, where } from 'firebase/firestore';
import { getUser } from '@/component/home/content';
import HomeContent from '@/component/home/content';
import firebase from 'firebase/compat/app';
import { v4  } from 'uuid';
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
export default function MyUser(){

const [user,setUser]=useState<any>()
const getUserInfo=()=>{
    if(getUser())
    getData2('user',(e:any)=>{
     
        setUser(e[0])
    },where(documentId(),'==',getUser()?.id))
}
useEffect(()=>{
 
    getUserInfo()
},[])

return <div className='MyUser'>
        
    <div className='mycontent'>
    <div style={{
            backgroundImage:`url("${user?.backgroundUrl}")`
        }} className='MyUser-background'>
           <div className='button'>
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
           
           </div>
        </div>
       <div className='user-info'>
       <div  style={{
            backgroundImage:`url("${user?.imgURL}")`
        }} className='MyUser-avatar'>
           <div  className='edit'>
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
            
           </div>
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
             </div>
             <HomeContent home></HomeContent>
             </div>
    </div>
   
</div>
}