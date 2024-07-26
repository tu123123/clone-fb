"use client";
import { icon } from "./icon";
import { button } from "./button/button";
import "./header.scss";
import { useEffect, useRef, useState } from "react";
import Login from "./login/login";
import Link from "next/link";
import Cookies from "js-cookie";
import { Avatar, getUser } from "./home/content";
import { getData, getData2, updateData } from "./firebase/config";
import { documentId, where } from "firebase/firestore";
import moment from "moment";

const NotiItem = ({ value }: { value: any }) => {
  return (
    <div className="NotiItem">
      <Avatar img={value.userSend.imgURL}></Avatar>{" "}
      <div className="NotiItem-content">
        {value.userSend.name}
        <br></br>
        <span
          style={{
            color: "white",
          }}
        >
          {value.message}
        </span>
      </div>
    </div>
  );
};
const NotificationEl = ({ listNott }: { listNott: any }) => {
  if (listNott.length == 0)
    return <div className="notification">Chưa có thông báo mới</div>;
  return (
    <div className="notification">
      {listNott.map((i: any) => {
        return <NotiItem value={i} key={i.id}></NotiItem>;
      })}
    </div>
  );
};
export default function Header() {
  const [listNott, setListNoti] = useState([]);
  useEffect(() => {
    if (getUser())
      getData(
        "thongbaotinnhan",
        (e: any) => {
          setListNoti(e);
        },
        where("userid", "==", getUser().id)
      );
  }, []);
  const [login, setLogin] = useState(false);
  const [openNoti, setOpenNoti] = useState<boolean>(false);
  const menu = useRef<any>();
  const [user, setUser] = useState<any>({ name: "" });
  useEffect(() => {
    window.addEventListener("click", (e: any) => {
      if (
        e.target.className == "user-button" ||
        e.target.className == "opennoti"
      ) {
        setOpenNoti(true);
      }
      if (
        e.target.className != "user-button" &&
        e.target.className != "opennoti" &&
        e.target.className != "NotiItem" &&
        e.target.className != "NotiItem-content" &&
        e.target.className != "notification"
      ) {
        setOpenNoti(false);
      }
    });
    if (getUser()) {
      getData2(
        "user",
        (e: any) => {
          setUser(e[0]);
        },
        where(documentId(), "==", getUser()?.id)
      );
      window.addEventListener("beforeunload", (ev) => {
        updateData(
          "user",
          getUser().id,
          { online: false },
          () => {},
          () => {}
        );
      });
    }
  }, []);
  if (user != null)
    return (
      <div className="header-component">
        <div ref={menu} className="menu2">
          <div className="menu-option">
            <div className="menu-option-header">
              <div className="logo-img">
                <img src={icon.logo.src}></img>
              </div>
              <div className="logo-close">
                <img
                  onClick={() => {
                    menu.current.style.transform = "translateX(-100vw)";
                  }}
                  src={icon.closewhite.src}
                ></img>
              </div>
            </div>
            <Link href={"/"}>
              <div className="bottion-icon">
                {" "}
                <img src={icon.home.src}></img>Home
              </div>
            </Link>
            <Link href={"/language"}>
              <div className="LeftContent-item">
                <img src={icon.language.src}></img> <p>日本語</p>
              </div>
            </Link>
            <div className="bottion-icon">
              {" "}
              <img src={icon.group.src}></img>Group
            </div>
            <div className="bottion-icon">
              {" "}
              <img src={icon.video.src}></img>Videos
            </div>
            <div className="bottion-icon">
              {" "}
              <img src={icon.market.src}></img>MarketPlace
            </div>
          </div>
          <div className="menu-close"></div>
        </div>
        {login && <Login onClose={() => setLogin(false)}></Login>}
        <div className="logo">
          <div className="logo-img">
            <img src={icon.logo.src}></img>
          </div>
          <div className="logo-search"></div>
        </div>

        <div className="button-header">
          <div
            onClick={() => {
              menu.current.style.transform = "translateX(0)";
            }}
            className="bottion-icon menu"
          >
            {" "}
            <img src={icon.menu.src}></img>
          </div>
          <Link href={"/"}>
            <div className="bottion-icon">
              {" "}
              <img src={icon.home.src}></img>
            </div>
          </Link>

          <div className="bottion-icon">
            {" "}
            <img src={icon.group.src}></img>
          </div>
          <div className="bottion-icon">
            {" "}
            <img src={icon.video.src}></img>
          </div>
          <div className="bottion-icon">
            {" "}
            <img src={icon.market.src}></img>
          </div>
        </div>
        <div className="user-icon">
          {!user?.name ? (
            <div onClick={() => setLogin(true)} className="bottion-icon">
              {" "}
              Đăng nhập
            </div>
          ) : (
            <>
              <div className="user-button">
                {" "}
                <img className="opennoti" src={icon.mess.src}></img>
                {listNott.length > 0 && (
                  <div className="notinumber">{listNott.length}</div>
                )}
                {openNoti && (
                  <NotificationEl listNott={listNott}></NotificationEl>
                )}
              </div>
              <div className="user-button">
                {" "}
                <img src={icon.bell.src}></img>
              </div>

              <div className="user-avatar">
                {" "}
                <Link href={"/" + user.id}>
                  {" "}
                  <img
                    src={
                      user?.imgURL ||
                      "https://fptshop.com.vn/uploads/originals/2023/11/14/638356007024019763_anime-ai-la-gi-bat-mi-cach-tao-anime-bang-ai-cuc-don-gian.png"
                    }
                  ></img>
                </Link>{" "}
              </div>
            </>
          )}
        </div>
      </div>
    );
}
