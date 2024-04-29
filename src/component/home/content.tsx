"use client"
import { ReactNode, useContext, useEffect, useState, createContext, useRef, use,} from 'react'
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
import { documentId, where } from 'firebase/firestore'
import addNotification from 'react-push-notification';
import { title } from 'process'
import { UserContext } from '@/app/[myid]/page'
const CommentContext= createContext<any>({})
moment.locale('vi')
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
export const Avatar=({img}:{img?:string})=>{

    
    return <div  style={{
        backgroundImage:`url("${img||"https://images.fpt.shop/unsafe/filters:quality(90)/fptshop.com.vn/uploads/images/tin-tuc/169746/Originals/avatar-anime.jpg"}")`}} className='avatar'></div>
}
interface ModalCreateBlogType{
    onClose:()=>void
}

const ModalCreateBlog=({onClose}:ModalCreateBlogType)=>{
    const [upimg,setUpimg]=useState<any>([])
    const {setLoading}=useContext(HomeContext)
    const {setLoadinghome}=useContext(UserContext)
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
            if(setLoading)
            setLoading(true)
        else 
        setLoadinghome(true)
            const loopUpdate=(data=upimg,index=0)=>{
                if(!data[index]) return addData('blog',{...status,time:moment().format('MM/DD/YYYY HH:mm')},()=>{
                    if(setLoading)
                        setLoading(false)
                    else 
                    setLoadinghome(false)
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
    const {user}:any=useContext(HomeContext)
    const {userhome}:any=useContext(UserContext)
    useEffect(()=>{

    },[])
    return <div className='AddStatus'>
        {open&&<ModalCreateBlog onClose={()=>setOpen(false)}></ModalCreateBlog>}
        <Avatar img={user?.imgURL||userhome?.imgURL}></Avatar>
        <div onClick={()=>(user||userhome)&&setOpen(true)} className='AddStatus-button'>{user||userhome?'Bạn đang nghĩ gì thế?':'Bạn cần đăng nhập để đăng bài'}</div>
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
const CommentItem= ({rep=true,onRef,value}:{rep?:boolean,onRef?:any,value:any})=>{
    const [repcomment,setRep]=useState<any>()
    const [showrep,setShowrep]=useState(false)
    const {data}:any=useContext(CommentContext)
    const getHeight=(x1:any)=>{
        if(!x1) return 0
        let x=x1.getBoundingClientRect();
        let x2=repcomment.getBoundingClientRect()
        return x2.y-x.y+19
        
    }
    const refele=useRef<any>()
    const [repinput,setRepinput]=useState(false)
    const [img,setImg]=useState<string>()
    useEffect(()=>{
        
      
        getData2('user',(e:any)=>{
         
            setImg(e[0].imgURL||'')
        },where(documentId(),'==',value?.id))

    },[])
    return <div className={`CommentItem `}>
        {rep&&repcomment&&<div ref={(e)=>{
            if(e)
                {
                    e.style.height=getHeight(e)+(showrep||repinput?0:-10)+'px'
                }
        }}
            className='draw'></div>}
        <div className='commientItem-content'>
        <Avatar img={img}></Avatar>
        <div className='comment-container'>
        <div className='CommentItem-content'>
        
        <p  ref={(e)=>{
            refele.current=e
                if(onRef){
               
                    onRef(e)
                }
        
        }} >{value.name}<br></br>
      
        {value.comment}

        </p>
<div ref={(e:any)=>{
    if(e)
        {
            e.style.width=refele.current.offsetWidth+'px'
        }
}} className='CommentItem-footer'>
            <div className='CommentItem-footer-time'>{value.time?moment(value.time).fromNow(true):'1 ngày'}</div>
            <div style={{
                color:value.likes?.find((i:string)=>i===getUser()?.id)&&'#34d8ff'
            }} onClick={()=>{
                let listlike=[...value.likes||[]]
                let user=getUser();
             
                if(listlike.find((i:string)=>i==user.id))
                    {
                        listlike=   listlike.filter((i:string)=>i!=user.id)
                    }
                else listlike.push(user.id)
                value.likes=[...listlike]
                    updateData('blog',data.id,{
                        comments:[...data.comments]
                    },()=>{
    
                    },(e:any)=>{console.log(e)})
                  
            }}  className='CommentItem-footer-button'>Thích</div>
            <div onClick={()=>setRepinput(!repinput)} className='CommentItem-footer-button'>Phản hồi</div>
            {
                value.likes?.length>0&&<div className='CommentItem-like'><img src={icon.like.src}></img></div>
            }
        
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
const addNotifications=(notifi:any)=>{
    updateData('realtime','CGz3WFV4WK4cKndhHFSX',{...notifi,time:moment().format('DD/MM/YYYY HH:mm')},()=>{},()=>{})
}
const CommentInput=({value,setRep}:{value?:any,setRep?:any})=>{
    const {data}:any=useContext(CommentContext)
    const [text,setText]=useState<string>('')
    const {user}:any=useContext(HomeContext)
    const {userhome}:any=useContext(UserContext)
    const enter=()=>{
        if(text.trim()=='')return
        setText('')
        let listcomment=data.comments||[]
     
        if(value){
            value.comments=[...value.comments||[], {...getUser(),
             time:moment().format('MM/DD/YYYY HH:mm'),
                comment:text}]
                updateData('blog',data.id,{
                    comments:[...data.comments]
                },()=>{
                 addNotifications({
                     thongbao:text,title:(user.name||userhome.name)+ ' đã gửi tin nhắn mới',userid:user.name||userhome.name
                 })
                },(e:any)=>{
                        console.log(e)
                })
                
        }
        else
        updateData('blog',data.id,{
            comments:[...listcomment,{
                ...getUser(),
                idcmt:v4(),
                time:moment().format('MM/DD/YYYY HH:mm'),
                comment:text
            }]
        },()=>{ addNotifications({
         thongbao:text,title:(user.name||userhome.name)+ ' đã gửi tin nhắn mới',userid:user.name||userhome.name
     })},(e:any)=>{
                console.log(e)
        })
    }
    return <div className={`CommentInput ${setRep&&'repcomment'}`}>
       <Avatar img={user?.imgURL||userhome?.imgURL}></Avatar><div className='iput'>{user||userhome?
       <><textarea onKeyDown={(e)=>{
        if(e.key=='Enter'&&e.shiftKey) return
        if(e.key=='Enter'){
            enter()
        }
       }} ref={(e)=>{
        if(setRep)
        setRep(e)
       }} value={text} onChange={(e:any)=>{
        setText(e.target.value)
       }} onKeyUp={(e:any )=>{
       e.target.style.height = "auto";
        e.target.style.height=e.target.scrollHeight+'px'
  
       }} autoFocus></textarea><div className='inputfooter'>
       <div className='inputfooter-button'><img onClick={()=>{enter()
          
       }} src={icon.send.src}></img></div></div></>
       :<div style={{
        padding:10
       }} ref={(e)=>{
        if(setRep)
        setRep(e)
       }}>Bạn cần phải đăng nhập để bình luận!</div>}
       </div>
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
    
    const [img,setImg]=useState<any>()
    useEffect(()=>{
 getData2('user',(e:any)=>{
         
            setImg(e[0].imgURL||'')
        },where('userid','==',data?.userid))
    },[])
    const [cmt,setCmt]=useState<boolean>(false)
    return <div className='Blog'>
        <div className='Blog-head'>
            <div className='Blog-head-detail'>
            <Avatar img={img}></Avatar>
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
export default function HomeContent({params}:{params:{
    myid:string,
    myuser:any
}}){
    const [blogs,setBlogs]=useState<any>([])
    const {user}:any=useContext(HomeContext)
    useEffect(()=>{
   
    getData('blog',(e:any)=>{
       let arr:any=[...e].reverse()
     
        setBlogs([...arr])
    })
    getData('realtime',(e:any)=>{
       
        if(e[0]?.thongbao)
            {addNotification({
                title: e[0].title,
                    subtitle: e[0].userid,
                    message: e[0].thongbao,
                    theme: 'darkblue',
                    native: true 
               })
            addNotifications({thongbao:'',title:'',userid:''})}
    })
    },[])
    
    return <div className='HomeContent'>
        {!params&&<ListCard></ListCard>}
        {(!params||params&&params.myid==params.myuser?.id)&&<AddStatus></AddStatus>}
    {
        blogs?.filter((i:any)=>{
            if (!params) return true
            return i.userid===params.myuser.userid
        }).map((i:any)=>{
            return <Blog data={i} key={i.id}></Blog>
        })
    }


    </div>
}