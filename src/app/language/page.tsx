"use client";
import { createContext, useContext, useEffect, useState } from "react";
import "./page.scss";
import { Modal } from "@/component/login/login";
import { icon } from "@/component/icon";
import { addData, getData, updateData } from "@/component/firebase/config";
import { Button, Input } from "antd";
import { v4 } from "uuid";
import { button } from "@/component/button/button";
import Loading from "@/component/loading/loading";
const languageContext = createContext<any>({});
const ModalContent = ({ open, onclose }: { open: any; onclose: any }) => {
  const { data, setLd } = useContext(languageContext);

  return (
    <Modal onClose={onclose} title={open.title}>
      <div className="ModalContent">
        {data[open.type]?.map((i: any) => {
          let clickitem: any = null;
          return open.type == "nguphap" ? (
            <div
              onClick={() => {
                console.log(clickitem.scrollHeight);
                if (clickitem) {
                  if (clickitem.offsetHeight <= 0)
                    clickitem.style.height = clickitem.scrollHeight + "px";
                  else clickitem.style.height = "0px";
                }
              }}
              className="nguphap-item"
            >
              <p>{i.name}</p>
              <ul
                ref={(e: any) => {
                  clickitem = e;
                }}
              >
                <li>Công thức: {i.value}</li>
                <li>Diễn giải: </li>
                <div>{i.mota}</div>
              </ul>
            </div>
          ) : open.type == "tuvung" ? (
            <div className="tuvung-item">
              <p>{i.value}</p>
              <ul>
                <li>Nghĩa: {i.nghia}</li>
              </ul>
            </div>
          ) : (
            <div className="tuvung-item">
              <p>{i.value}</p>
              <ul>
                <li>Hiragana: {i.hiragana}</li>
                <li>Nghĩa: {i.nghia}</li>
              </ul>
            </div>
          );
        })}
      </div>
    </Modal>
  );
};

const ModalAdd = ({ open, onclose }: { open: any; onclose: any }) => {
  const { data, setLd } = useContext(languageContext);
  const tuvung = {
    value: "",
    nghia: "",
    id: v4(),
  };
  const kanji = {
    value: "",
    nghia: "",
    hiragana: "",
    id: v4(),
  };
  const nguphap = {
    value: "",
    mota: "",
    name: "",
    id: v4(),
  };
  return (
    <Modal
      groupButton={
        <Button
          onClick={() => {
            setLd(true);
            let itemadd =
              open.type == "kanji"
                ? kanji
                : open.type == "tuvung"
                ? tuvung
                : nguphap;
            updateData(
              "language",
              "T25lMOEuJ1MtlCmeC5yU",
              {
                [open.type]: data[open.type]
                  ? [...data[open.type], itemadd]
                  : [itemadd],
              },
              () => {
                setLd(false);
                onclose();
              },
              (e: any) => {
                setLd(false);
                console.log(e);
              }
            );
          }}
        >
          Lưu
        </Button>
      }
      onClose={onclose}
      title={open.title}
    >
      <div className="ModaladdContent">
        {open.type == "nguphap" ? (
          <>
            <div className="addinput">
              <p>Tên</p>
              <Input onChange={(e) => (nguphap.name = e.target.value)}></Input>
            </div>
            <div className="addinput">
              <p>Công thức</p>
              <Input onChange={(e) => (nguphap.value = e.target.value)}></Input>
            </div>
            <div className="addinput">
              <p>Diễn giải</p>
              <textarea
                onChange={(e) => (nguphap.mota = e.target.value)}
                rows={6}
              ></textarea>
            </div>
          </>
        ) : open.type == "kanji" ? (
          <>
            <div className="addinput">
              <p>Kanji</p>
              <Input onChange={(e) => (kanji.value = e.target.value)}></Input>
            </div>
            <div className="addinput">
              <p>Hiragana</p>
              <Input
                onChange={(e) => (kanji.hiragana = e.target.value)}
              ></Input>
            </div>

            <div className="addinput">
              <p>Nghĩa</p>
              <Input onChange={(e) => (kanji.nghia = e.target.value)}></Input>
            </div>
          </>
        ) : (
          <>
            <div className="addinput">
              <p>Từ vựng</p>
              <Input onChange={(e) => (tuvung.value = e.target.value)}></Input>
            </div>
            <div className="addinput">
              <p>Nghĩa</p>
              <Input onChange={(e) => (tuvung.nghia = e.target.value)}></Input>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};
const FlashCard = ({ open, onclose }: { onclose: any; open: any }) => {
  const { data } = useContext(languageContext);
  const [openmota, setopenmota] = useState({
    hiragana: false,
    nghia: false,
  });
  const [index, setIndex] = useState(0);
  return (
    <Modal
      groupButton={
        <>
          <Button
            onClick={() =>
              setopenmota({ ...openmota, hiragana: !openmota.hiragana })
            }
          >
            hiragana
          </Button>
          <Button
            onClick={() => setopenmota({ ...openmota, nghia: !openmota.nghia })}
          >
            nghĩa
          </Button>
          <div>
            {data[open.type].length}/{index + 1}
          </div>
          <Button
            onClick={() => {
              if (index + 1 > 1) {
                setIndex(index - 1);

                setopenmota({ nghia: false, hiragana: false });
              }
            }}
          >
            Lùi
          </Button>
          <Button
            onClick={() => {
              if (data[open.type].length > index + 1) {
                setIndex(index + 1);

                setopenmota({ nghia: false, hiragana: false });
              }
            }}
          >
            Tiếp
          </Button>
        </>
      }
      onClose={onclose}
      title={open.title}
    >
      <div className="Flashcard">{data && data[open.type][index].value}</div>
      {openmota.hiragana && (
        <div className="mota">Hiragana:{data[open.type][index].hiragana}</div>
      )}
      {openmota.nghia && (
        <div className="mota">Nghĩa:{data[open.type][index].nghia}</div>
      )}
    </Modal>
  );
};
export default function Language() {
  const [open, setOpen] = useState({ open: false, type: "", title: "" });
  const [opentest, setOpentest] = useState({
    open: false,
    type: "",
    title: "",
  });
  const [ld, setLd] = useState(false);
  const [openAdd, setOpenAdd] = useState({
    open: false,
    type: "",
    title: "",
  });
  const [data, setData] = useState();
  useEffect(() => {
    getData("language", (e: any) => {
      setData(e[0]);
    });
  }, []);
  return (
    <languageContext.Provider value={{ data: data, setLd }}>
      {opentest.open && (
        <FlashCard
          open={opentest}
          onclose={() => setOpentest({ open: false, type: "", title: "" })}
        ></FlashCard>
      )}
      <div className="Language">
        {ld && <Loading></Loading>}
        {openAdd.open && (
          <ModalAdd
            open={openAdd}
            onclose={() => setOpenAdd({ open: false, type: "", title: "" })}
          ></ModalAdd>
        )}

        {open.open && (
          <ModalContent
            open={open}
            onclose={() => setOpen({ open: false, type: "", title: "" })}
          ></ModalContent>
        )}
        <div className="langageTitle">一緒に日本語を学びましょう</div>
        <div className="Language-group">
          <div className="g-title">Cấp độ N3</div>
          <ul>
            <span>
              <li
                onClick={() =>
                  setOpen({ open: true, type: "tuvung", title: "Từ vựng" })
                }
              >
                Từ vựng
              </li>{" "}
              <img
                onClick={() =>
                  setOpenAdd({ open: true, type: "tuvung", title: "Từ vựng" })
                }
                src={icon.add.src}
              />
            </span>
            <span>
              <li
                onClick={() =>
                  setOpen({ open: true, type: "kanji", title: "Kanji" })
                }
              >
                Kanji
              </li>{" "}
              <img
                onClick={() =>
                  setOpenAdd({ open: true, type: "kanji", title: "Kanji" })
                }
                src={icon.add.src}
              />
              <img
                onClick={() =>
                  setOpentest({ open: true, type: "kanji", title: "Kanji" })
                }
                src={icon.test.src}
              />
            </span>
            <span>
              <li
                onClick={() =>
                  setOpen({ open: true, type: "nguphap", title: "Ngữ pháp" })
                }
              >
                Ngữ pháp
              </li>{" "}
              <img
                onClick={() =>
                  setOpenAdd({ open: true, type: "nguphap", title: "Ngữ pháp" })
                }
                src={icon.add.src}
              />
            </span>
          </ul>
        </div>
      </div>
    </languageContext.Provider>
  );
}