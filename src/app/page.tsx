"use client";
import Image from "next/image";
import "./page.scss";
import HomeContent, { getUser } from "@/component/home/content";
import { ListContract } from "@/component/home/right";
import LeftContent from "@/component/home/left";
import Loading from "@/component/loading/loading";
import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import { getData, getData2 } from "@/component/firebase/config";
import { documentId, where } from "firebase/firestore";
import ListMess, { Messenger } from "@/component/messenger/messenger";
import { icon } from "@/component/icon";

export const HomeContext = React.createContext<any>({});
function Home() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>();
  const [listUser, setListUser] = useState<any>([]);

  useEffect(() => {
    getData2("user", (e: any) => {
      setListUser(e);
    });
    if (getUser())
      getData2(
        "user",
        (e: any) => {
          setUser(e[0]);
        },
        where(documentId(), "==", getUser()?.id)
      );
  }, []);
  const [listChat, setListChat] = useState([]);
  const renderList = useMemo(() => {
    return (
      <ListMess>
        {listChat?.map((i: any) => {
          return <Messenger key={i.id} value={i}></Messenger>;
        })}
      </ListMess>
    );
  }, [listChat.length]);
  const [counts, setCount] = useState(5);
  const setcounts = useRef(0);
  const refRight = useRef<any>(undefined);
  return (
    <HomeContext.Provider
      value={{
        setcounts,
        counts,
        refRight,
        loading,
        setLoading,
        user,
        listChat,
        setListChat,
        listUser,
      }}
    >
      {loading && <Loading></Loading>}

      <div
        onScroll={(e: any) => {
          if (
            e.target.scrollHeight - e.target.scrollTop - e.target.offsetHeight <
              100 &&
            counts < setcounts.current
          ) {
            setCount(counts + 3);
          }
        }}
        className="home-container"
      >
        <div
          onClick={() => {
            if (refRight) {
              refRight.current.style.transform = "translateX(15px)";
            }
          }}
          className="openuser"
        >
          <img src={icon.mess.src}></img>
        </div>
        <div className="home-left">
          <LeftContent></LeftContent>
        </div>
        <div className="home-content">
          <HomeContent></HomeContent>
        </div>
        <div className="home-right">
          <ListContract></ListContract>
        </div>

        {renderList}
      </div>
    </HomeContext.Provider>
  );
}
export default memo(Home);
