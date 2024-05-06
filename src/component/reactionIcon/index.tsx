import { Dispatch, SetStateAction } from "react";
import { icon } from "../icon";
import { Tooltip } from "antd";
import "./reactionIcon.scss";
import { updateData } from "../firebase/config";
import { getUser } from "../home/content";
import React from "react";

const ReactionIcon = ({
  visible,
  setVisible,
  data,
  location,
  comment,
}: {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  data: any;
  location: string;
  comment: any;
}) => {
  const updateReaction = (type: string) => {
    let objectFind = location == "comment" ? comment : data;
    let listReaction = [...(objectFind[type] || [])];
    let user = getUser();

    let listOldReaction: any[] = [];

    let oldType = "";

    Object.entries(objectFind).every((key) => {
      if (Array.isArray(key[1]) && key[1].includes(user.id)) {
        oldType = key[0];
        if (oldType != type) {
          listOldReaction = [...key[1]];
          listOldReaction = listOldReaction.filter((x: string) => x != user.id);
        }
        return false;
      }
      return true;
    });

    if (listReaction.find((i: string) => i == user.id)) {
      listReaction = listReaction.filter((i: string) => i != user.id);
    }

    if (oldType != type) listReaction.push(user.id);

    let newData = {
      [type]: listReaction,
    };

    if (oldType != "" && oldType != type) newData[oldType] = listOldReaction;

    updateData(
      "blog",
      data.id,
      location != "comment"
        ? newData
        : {
            comments: data.comments.map((item: any) => {
              item.comments = (item.comments || []).map((childComment: any) => {
                if (
                  childComment.comment == objectFind.comment &&
                  childComment.id == objectFind.id &&
                  childComment.time == objectFind.time
                ) {
                  return {
                    ...childComment,
                    ...newData,
                  };
                }
                return childComment;
              });

              if (item.comments.length == 0) delete item.comments;
              if (item.idcmt == objectFind.idcmt) {
                return {
                  ...item,
                  ...newData,
                };
              }
              return item;
            }),
          },
      () => {},
      (e: any) => {
        console.log(e);
      }
    );
  };

  return (
    <div
      onMouseLeave={() => {
        setVisible(false);
      }}
      onMouseOver={() => {
        if (!visible) setVisible(true);
      }}
      className={`icon-container ${visible ? "icon-visible" : ""} ${
        location == "comment" ? "no-bottom" : ""
      }`}
    >
      <div className="icons-content">
        <IconItem
          icon={icon.likeReaction.src}
          title={"Thích"}
          onClick={() => updateReaction("likes")}
        />
        <IconItem
          icon={icon.love.src}
          title={"Yêu thích"}
          onClick={() => updateReaction("love")}
        />
        <IconItem
          icon={icon.care.src}
          title={"Thương thương"}
          onClick={() => updateReaction("care")}
        />
        <IconItem
          icon={icon.haha.src}
          title={"Haha"}
          onClick={() => updateReaction("haha")}
        />
        <IconItem
          icon={icon.wow.src}
          title={"Wow"}
          onClick={() => updateReaction("wow")}
        />
        <IconItem
          icon={icon.sad.src}
          title={"Buồn"}
          onClick={() => updateReaction("sad")}
        />
        <IconItem
          icon={icon.angry.src}
          title={"Phẫn nộ"}
          onClick={() => updateReaction("angry")}
        />
      </div>
    </div>
  );
};

const IconItem = ({
  icon,
  title,
  onClick,
}: {
  icon: string;
  title: string;
  onClick: () => void;
}) => {
  return (
    <Tooltip arrow={false} title={title}>
      <img src={icon} onClick={onClick} />
    </Tooltip>
  );
};

export default ReactionIcon;
