"use client";
import Image from "next/image";
import "./page.scss";
import HomeContent, { getUser } from "@/component/home/content";
import { ListContract } from "@/component/home/right";
import LeftContent from "@/component/home/left";
import Loading from "@/component/loading/loading";
import React, { memo, useEffect, useMemo, useState } from "react";
import { getData, getData2 } from "@/component/firebase/config";
import { documentId, where } from "firebase/firestore";
import ListMess, { Messenger } from "@/component/messenger/messenger";

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

  return (
    <HomeContext.Provider
      value={{ loading, setLoading, user, listChat, setListChat, listUser }}
    >
      {loading && <Loading></Loading>}
      <div className="home-container">
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
