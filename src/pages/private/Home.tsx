import { useEffect, useRef, useState } from "react";
import { send, toImg, useIsVisible } from "../../lib/io";
import Sidebar from "../components/Sidebar";

interface homeProps {
  setUser: React.Dispatch<
    React.SetStateAction<{
      uid: number;
      pass: string;
    }>
  >;
  user: {
    uid: number;
    pass: string;
  };
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

interface postPros {
  src: string | number;
  pid: number;
  text: string;
  pfp: string;
  uname: string;
  user: any;
  liked: boolean;
  saved: boolean;
  mid: boolean;
  alert: number;
  data: never[];
  setData: React.Dispatch<React.SetStateAction<never[]>>;
}
var alertNo = -1;
var alertArr = [] as number[];
var indx = 0;
export function Post(props: postPros) {
  const [saved, setSaved] = useState(props.saved);
  const [liked, setLiked] = useState(props.liked);
  async function likedChange() {
    const x = {
      type: "like-post",
      _uid: props.user.uid,
      _pid: props.pid,
    };
    await send(x);
    setLiked(!liked);
  }
  async function saveChange() {
    const x = {
      type: "save-post",
      _uid: props.user.uid,
      _pid: props.pid,
    };
    await send(x);
    setSaved(!saved);
  }

  const _ref = useRef<HTMLDivElement>() as React.LegacyRef<HTMLDivElement>;
  const isVisible = useIsVisible(_ref);
  useEffect(() => {
    if (props.mid && alertArr[props.alert] < 2) {
      alertArr[props.alert]++;
      if (alertArr[props.alert] == 1) {
        async function fun() {
          const x = {
            type: "get-home-post",
            _id: props.user.uid,
          };
          const y = await send(x);
          if (y.error == -2) {
            setTimeout(async () => await fun(), 100);
            return;
          }
          props.setData(props.data.concat(y._data));
        }
        fun();
      }
    }
  }, [isVisible]);

  return (
    <div ref={_ref} className="w-[32rem] p-4 m-3 rounded-2xl top-10 animate-fade-in"
         style={{
           background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.6))',
           border: '1px solid rgba(99, 102, 241, 0.12)',
           boxShadow: '0 4px 24px rgba(0, 0, 0, 0.3)',
           backdropFilter: 'blur(12px)',
         }}>
      <div className="mb-3">
        <img
          src={toImg(props.pfp, props.uname)}
          className="w-14 h-14 mr-3 inline-block rounded-full object-cover"
          style={{ border: '2px solid rgba(99, 102, 241, 0.3)' }}
        />
        <div className=" inline-block relative translate-y-1 text-slate-200 ">
          <div className="text-lg font-semibold">{props.uname}</div>
        </div>
      </div>
      <hr />
      <div className="text-slate-200 my-2">
        {props.src && (
          <img
            src={toImg(props.src as string)}
            className="h-min w-full mx-auto object-contain rounded-xl"
          />
        )}
        <div className="mt-2 text-slate-300">{props.text}</div>
      </div>
      <hr />
      <div className="mt-3">
        <div
          onClick={likedChange}
          className="inline-block mx-3 px-4 py-2 rounded-xl hover:cursor-pointer transition-all duration-200"
          style={{ color: liked ? '#818cf8' : '#94a3b8' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        >
          <span
            className={
              "material-symbols-rounded pr-3 text-3xl " +
              (liked && "text-indigo-400")
            }
          >
            thumb_up
          </span>
          <div className="inline-block relative -translate-y-2 font-medium">Like</div>
        </div>
        <div
          onClick={saveChange}
          className="inline-block mx-3 px-4 py-2 rounded-xl hover:cursor-pointer transition-all duration-200"
          style={{ color: saved ? '#818cf8' : '#94a3b8' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        >
          <span
            className={
              "material-symbols-rounded pr-3 text-3xl " +
              (saved && "text-indigo-400")
            }
          >
            Bookmark
          </span>
          <div className="inline-block relative -translate-y-2 font-medium">Save</div>
        </div>
      </div>
    </div>
  );
}

export default function Home(props: homeProps) {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fun() {
      const x = {
        type: "get-home-post",
        _id: props.user.uid,
      };
      const y = await send(x);
      if (y.error == -2) {
        setTimeout(async () => await fun(), 100);
        return;
      }
      setData(y._data);
    }
    fun();
  }, []);

  return (
    <>
      <Sidebar
        setUser={props.setUser}
        user={props.user}
        setLoggedIn={props.setLoggedIn}
      />
      <div className="ml-80">
        <div className="mx-auto flex w-[56rem] m-2 px-6 py-4 rounded-2xl items-center gap-6 overflow-x-auto"
             style={{
               background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.6), rgba(15, 23, 42, 0.4))',
               border: '1px solid rgba(99, 102, 241, 0.1)',
             }}>
             {/* Dummy Story Circles for Visual Enhancement */}
             {[1, 2, 3, 4, 5, 6].map((i) => (
                 <div key={i} className="flex flex-col items-center gap-2 cursor-pointer flex-shrink-0 group">
                    <div className="w-16 h-16 rounded-full p-[2px] transition-transform duration-300 group-hover:scale-105"
                         style={{ background: 'linear-gradient(135deg, #6366f1, #a78bfa, #ec4899)' }}>
                        <div className="w-full h-full rounded-full border-2 border-slate-900 overflow-hidden bg-slate-800">
                             <img src={`https://api.dicebear.com/9.x/glass/svg?seed=Story${i}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                        </div>
                    </div>
                    <span className="text-xs text-slate-400 font-medium group-hover:text-slate-200 transition-colors">User {i}</span>
                 </div>
             ))}
        </div>
        <div className="mx-auto w-min mt-14">
          {data.map((el: any, index: number, arr: never[]) => {
            var alert_ = -1;
            if (index == Math.floor(arr.length / 2)) {
              alertNo++;
              alertArr.push(-1);
              alert_ = alertNo;
            }

            return (
              <Post
                pid={el[0]}
                key={indx++}
                src={el[2]}
                text={el[3]}
                pfp={el[6]}
                uname={el[5]}
                user={props.user}
                saved={el[8]}
                liked={el[7]}
                alert={alert_}
                data={data}
                setData={setData}
                mid={index == Math.floor(arr.length / 2)}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
