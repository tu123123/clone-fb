"use client";
import "./home.scss";
import { Avatar, getUser } from "./content";
import { addData, getData, getData2 } from "../firebase/config";
import { memo, useContext, useEffect, useState } from "react";
import { HomeContext } from "@/app/page";
import { and, where } from "firebase/firestore";
import Link from "next/link";
import moment from "moment";
import { icon } from "../icon";

function ListContract() {
  const { setListChat, user, refRight } = useContext(HomeContext);
  const [listonline, setListOnline] = useState([]);
  const [users, setUsers] = useState<any>();
  useEffect(() => {
    if (user)
      getData2("user", (e: any) => {
        setUsers(e || []);
      });
    getData("useronline", (e: any) => {
      setListOnline(e[0]?.online || []);
    });
  }, [user]);

  return (
    <div ref={refRight} className="ListContract">
      <div className="header">
        <div>Người liên hệ</div>
        <img
          onClick={() => {
            if (refRight?.current) {
              refRight.current.style.transform = "translateX(100vw)";
            }
          }}
          src={icon.closewhite.src}
        ></img>
      </div>
      <div className="ListUser">
        {!users ? (
          <div
            style={{
              color: "white",
            }}
          >
            Không có dữ liệu
          </div>
        ) : (
          users?.map((i: any) => {
            // return <Link  href={'/'+i.id} key={i.id}>
            // <div  className={`UserItem ${i.online&&'online'}`}>
            //     <Avatar img={i.imgURL}></Avatar> <p>{i.name}</p>

            // </div></Link>
            return (
              <div
                key={i.id}
                onClick={() => {
                  // getData2('messenger',((e:any)=>{

                  //         if(!e?.find((i:any)=>i.member.find((a:string)=>a==i.id)))
                  //             {

                  //             addData('messenger',{
                  //                 member:[user.id,i.id],
                  //                 chats:[]
                  //             },()=>{       setListChat((pre:any)=>{
                  //                 if(pre.find(((a:{id:string})=>a.id==i.id))) return pre
                  //                 return [...pre,{
                  //                     ...i
                  //                 }]
                  //             })})
                  //             }
                  //             else setListChat((pre:any)=>{
                  //                 return [...pre,{
                  //                     ...i
                  //                 }]
                  //             })

                  //             }),where('member','array-contains',user.id)

                  //     )
                  setListChat((pre: any) => {
                    if (pre.find((a: { id: string }) => a.id == i.id))
                      return pre;
                    return [
                      ...pre,
                      {
                        ...i,
                      },
                    ];
                  });
                }}
                className={`UserItem ${
                  listonline.find((a: any) => a == i.id) && "online"
                }`}
              >
                <Avatar img={i.imgURL}></Avatar> <p>{i.name}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
export { ListContract };
