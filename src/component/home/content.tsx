"use client"
import { ReactNode, useContext, useEffect, useState, createContext,} from 'react'
import { icon } from '../icon'
import './home.scss'
import Cookies from 'js-cookie'
import { Modal } from '../login/login'
import TextArea from 'antd/es/input/TextArea'
import ImgCrop from 'antd-img-crop';
import { getDownloadURL,ref,uploadBytes } from 'firebase/storage';
import { v4  } from 'uuid';
import { imgDb,addData, getData,updateData, getData2  } from '../firebase/config'
import { Button, Upload } from 'antd';
import { HomeContext } from '@/app/page'
import moment from 'moment'
const CommentContext= createContext<any>({})
const Card=()=>{

    return <div style={{
        backgroundImage:'url("https://images.fpt.shop/unsafe/filters:quality(90)/fptshop.com.vn/uploads/images/tin-tuc/169746/Originals/avatar-anime.jpg")'
    }} className='Card'>
        <div  style={{
        backgroundImage:'url("https://images.fpt.shop/unsafe/filters:quality(90)/fptshop.com.vn/uploads/images/tin-tuc/169746/Originals/avatar-anime.jpg")'
    }} className='Card-avatar'></div>
        <div className='Card-footer'>sss</div>
    </div>
}
const ListCard=()=>{

    return <div className='ListCard'>
        <div className='buttonlistCard back'>
            <img src={icon.next.src}></img>
        </div>
        <div className='buttonlistCard next'>
            <img src={icon.next.src}></img>
        </div>
        <div className='listCard-content'>
        <Card></Card>
          <Card></Card>
          <Card></Card>
   
        </div>
    </div>
}
export const getUser=()=>{
    if(!Cookies.get('user')) return null
    return JSON.parse(Cookies.get('user') as string)
}
export const Avatar=()=>{
    return <div  style={{
        backgroundImage:'url("https://images.fpt.shop/unsafe/filters:quality(90)/fptshop.com.vn/uploads/images/tin-tuc/169746/Originals/avatar-anime.jpg")'}} className='avatar'></div>
}
interface ModalCreateBlogType{
    onClose:()=>void
}

const ModalCreateBlog=({onClose}:ModalCreateBlogType)=>{
    const [upimg,setUpimg]=useState<any>([])
    const {setLoading}=useContext(HomeContext)
    const getSrcFromFile = (file:any) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
        });
      };
      const [status]=useState<any>({
        content:'',img:[],
        ...getUser()
      })
    return <Modal groupButton={
        <><Button onClick={async()=>{
            setLoading(true)
            const loopUpdate=(data=upimg,index=0)=>{
                if(!data[index]) return addData('blog',{...status,time:moment().format('MM/DD/YYYY HH:mm')},()=>{
                    setLoading(false)
                    onClose()
                        })  
                let i=data[index]
                let imgRef=ref(imgDb,'files/'+i.data.name)
                uploadBytes(imgRef,i.data).then(value=>{
                    getDownloadURL(value.ref).then((url:string)=>{status.img.push(url);loopUpdate(data,index+1)})
                    
            })
            }
            loopUpdate()
        
            
        }} style={{
            fontSize:17,
            background:'#88ceff',
            color:'white',
            height:40
        }}>Đăng</Button></>
    } title='Tạo nội dung' onClose={onClose}>
       
        <div className='ModalCreateBlog'>
            <p>Cảm nghĩ của bạn</p>
            <TextArea onChange={(e:any)=>status.content=e.target.value}></TextArea>
            <ImgCrop onModalOk={(e:any)=>{
             
              getSrcFromFile(e).then((a:any)=>{
              
                setUpimg((pre:any)=>{
                    return [
                        ...pre,
                        {src:a,uid:e.uid,data:e}
                    ]
                })
           
            })
          
            }} showGrid rotationSlider aspectSlider>
      <Upload
        onRemove={(e:any)=>{
          
            setUpimg(upimg.filter((i:any)=>i.uid!==e.uid))
        }}
  

      >
        <Button style={{
            fontSize:17,
            height:40
        }}>Tải ảnh lên</Button>
      </Upload>
    </ImgCrop>
        <div className='listimg'>
        {upimg.map((i:any)=>{
        return <img key={i.src} src={i.src}></img>
    })}
        </div>
        </div>

    </Modal>
}
const AddStatus=()=>{
    const [open,setOpen]=useState(false)
    return <div className='AddStatus'>
        {open&&<ModalCreateBlog onClose={()=>setOpen(false)}></ModalCreateBlog>}
        <Avatar></Avatar>
        <div onClick={()=>setOpen(true)} className='AddStatus-button'>Bạn đang nghĩ gì thế?</div>
    </div>
}
const countCmt=(data:any,count=0)=>{
  
    const loop=(value=data.comments)=>{
        
        if(value)
            {
                count+=value.length
                for(let i of value)
                    {   if(i.comments)
                        loop(i.comments)
                    }
            }
    }
    loop()
    return count
}
const CommentItem=({rep=true,onRef,value}:{rep?:boolean,onRef?:any,value:any})=>{
    const [repcomment,setRep]=useState<any>()
    const [showrep,setShowrep]=useState(false)
    const getHeight=(x1:any)=>{
        if(!x1) return 0
        let x=x1.getBoundingClientRect();
        let x2=repcomment.getBoundingClientRect()
        return x2.y-x.y+19
        
    }
    const [repinput,setRepinput]=useState(false)
    return <div className={`CommentItem `}>
        {rep&&repcomment&&<div ref={(e)=>{
            if(e)
                {
                    e.style.height=getHeight(e)+(showrep||repinput?0:-10)+'px'
                }
        }}
            className='draw'></div>}
        <div className='commientItem-content'>
        <Avatar></Avatar>
        <div className='comment-container'>
        <div className='CommentItem-content'>
        
        <p  ref={(e)=>{
                if(onRef){
               
                    onRef(e)
                }
        
        }} >{value.name}<br></br>
      
        {value.comment}

        </p>
<div className='CommentItem-footer'>
            <div className='CommentItem-footer-time'>1 ngày</div>
            <div className='CommentItem-footer-button'>Thích</div>
            <div onClick={()=>setRepinput(!repinput)} className='CommentItem-footer-button'>Phản hồi</div>
        
        </div>
        
        </div>
     
        {!showrep&&value.comments?<div ref={(e:any)=>setRep(e)} onClick={()=>{
                setShowrep(true)
            }} className='repcomment showrepcomment'>Có {countCmt(value)} phản hồi</div>:value.comments?.map((i:any)=>{
            return  <div key={i.idcmt||i.comment} className='repcomment'>
            <CommentItem rep={i.comments} onRef={setRep} value={i}></CommentItem></div>
        })  }
        {repinput&&<CommentInput setRep={setRep}  value={value}></CommentInput>}
        </div>
        
        </div>
    
    </div>
}
const CommentInput=({value,setRep}:{value?:any,setRep?:any})=>{
    const {data}:any=useContext(CommentContext)
    const [text,setText]=useState<string>('')

    return <div className={`CommentInput ${setRep&&'repcomment'}`}>
       <Avatar></Avatar><div className='iput'><textarea ref={(e)=>{
        if(setRep)
        setRep(e)
       }} value={text} onChange={(e:any)=>{
        setText(e.target.value)
       }} onKeyUp={(e:any )=>{
       e.target.style.height = "auto";
        e.target.style.height=e.target.scrollHeight+'px'
  
       }} autoFocus></textarea>
       <div className='inputfooter'>
        <div className='inputfooter-button'><img onClick={()=>{
            if(text=='')return
            setText('')
            let listcomment=data.comments||[]
            console.log(data,value)
            if(value){
                value.comments=[...value.comments||[], {...getUser(),
                    comment:text}]
                    updateData('blog',data.id,{
                        comments:[...data.comments]
                    },()=>{},(e:any)=>{
                            console.log(e)
                    })
            }
            else
            updateData('blog',data.id,{
                comments:[...listcomment,{
                    ...getUser(),
                    idcmt:v4(),
                    comment:text
                }]
            },()=>{},(e:any)=>{
                    console.log(e)
            })
        }} src={icon.send.src}></img></div></div></div>
    </div>
}

const Comment=({data}:{
    data:any
})=>{
    return <CommentContext.Provider value={{data}}>
        <div className='Comment'>
        {data.comments?.map((i:any)=>{
            return <CommentItem rep={i.comments} key={i.id} value={i}></CommentItem>
        })}
       
        <CommentInput></CommentInput>
    </div>
    </CommentContext.Provider>
}

const Blog=({data}:any)=>{
  
    const [cmt,setCmt]=useState<boolean>(false)
    return <div className='Blog'>
        <div className='Blog-head'>
            <div className='Blog-head-detail'>
            <Avatar></Avatar>
            <div className='Blog-head-detail-button'>
                <div className='name'>{data?.name||'Vô danh'}</div>
                <div className='time'>{moment(data?.time).format('DD/MM/YYYY HH:mm')}</div>
            </div>
            </div>
        </div>
        <div className='Blog-content'>
            <div className='blog-content-body'>{data?.content}</div>
           <div className='listimg'>
           {data?.img?.map((i:any)=>{
                return  <img key={i}src={i}></img>
            })}
           </div>
           
        </div>
        <div className='Blog-footer'>
            <div className='Blog-footer-left'>
                <img src={icon.like.src}></img> <div>{data.likes?.length|0}</div>
            </div>
            <div onClick={()=>setCmt(true)} className='Blog-footer-right'>{countCmt(data)} Bình luận</div>
        </div>
        <div className='Blog-footer blog-button'>
            
        <div className={`bottion-icon-blog ${data.likes?.find((i:string)=>i==getUser()?.id)&&'onlike'}`} onClick={()=>{
            let listlike=[...data.likes||[]]
            let user=getUser();
         
            if(listlike.find((i:string)=>i==user.id))
                {
                    listlike=   listlike.filter((i:string)=>i!=user.id)
                }
            else listlike.push(user.id)
                updateData('blog',data.id,{
                    likes:listlike
                },()=>{

                },(e:any)=>{console.log(e)})
        }}>          <img src={icon.likeWhite.src}></img> Thích</div>
        <div onClick={()=>setCmt(!cmt)} className="bottion-icon-blog">          <img src={icon.comment.src}></img> Bình luận</div>
        <div className="bottion-icon-blog">          <img src={icon.share.src}></img> Chia sẻ</div>
        </div>
        {cmt&&<div className='Blog-footer blog-comment'>
            <Comment data={data}></Comment>
        
            </div>}
    </div>
}
export default function HomeContent({home}:{home:boolean}){
    const [blogs,setBlogs]=useState([])
    useEffect(()=>{
    getData('blog',(e:any)=>{
       
        setBlogs(e)
    })

    },[])
    return <div className='HomeContent'>
        {!home&&<ListCard></ListCard>}
        <AddStatus></AddStatus>
    {
        blogs?.map((i:any)=>{
            return <Blog data={i} key={i.id}></Blog>
        })
    }


    </div>
}