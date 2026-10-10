import { Key, MouseEventHandler, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { send, toImg } from "../../lib/io";
import CreatePost from "./CreatePost";

var onChanging = false;
var gotNotifications = false;
interface plateProps {
  icon: string;
  name: string;
  action: MouseEventHandler<HTMLDivElement> | undefined;
}
interface searchPlateProps {
  pfp: string;
  key: Key;
  rname: string;
  uname: string;
}

interface searchProps {
  enabled: boolean;
}
interface moreMenuProps {
  enabled: boolean;
  setUser: any;
  setLoggedIn?: any;
}
interface sidebarProps {
  setUser?: any;
  user?: any;
  setLoggedIn?: React.Dispatch<React.SetStateAction<boolean>>;
}

function SidebarPlate(props: plateProps) {
  return (
    <div
      onClick={props.action}
      className="m-2 p-5 rounded-xl hover:cursor-pointer transition-all duration-200"
      style={{
        color: '#cbd5e1',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(99, 102, 241, 0.15)';
        e.currentTarget.style.color = '#818cf8';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.color = '#cbd5e1';
      }}
    >
      <span className="material-symbols-rounded mr-10 ml-3 text-4xl">
        {props.icon}
      </span>
      <div className="inline-block relative -translate-y-2 font-medium">{props.name}</div>
    </div>
  );
}
export function SearchPlate(props: searchPlateProps) {
  const navigate = useNavigate();
  function onClick() {
    navigate("/usr/" + props.uname);
  }

  return (
    <div
      key={props.uname}
      className="m-2 p-5 rounded-xl hover:cursor-pointer transition-all duration-200"
      style={{ color: '#e2e8f0' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(99, 102, 241, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
      }}
      onClick={onClick}
    >
      <img
        src={toImg(props.pfp, props.uname)}
        className="w-14 h-14 mr-7 rounded-full inline object-cover"
        style={{ border: '2px solid rgba(99, 102, 241, 0.3)' }}
      />
      <div className="inline-block relative -translate-y-3 text-xl">
        {props.uname}
      </div>
      <div className="inline-block relative -translate-x-14 translate-y-3 text-slate-400">
        {props.rname}
      </div>
    </div>
  );
}
function SearchMenu(props: searchProps) {
  const [list, setList] = useState([]);

  async function onChange() {
    if (!onChanging) {
      onChanging = true;

      const sb = document.getElementById("searchBar") as HTMLInputElement;
      if (sb.value.length != 0) {
        const x = {
          type: "search-accounts",
          _name: sb.value,
        };
        const y = await send(x);
        setList(y._data);
        console.log(y._data);
      }
      onChanging = false;
    }
  }

  return (
    <div
      className={
        "absolute w-80 h-screen z-10 transition-all " +
        (props.enabled ? "left-80" : "left-0")
      }
      style={{
        background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95), rgba(30, 27, 75, 0.95))',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(99, 102, 241, 0.15)',
      }}
    >
      <div className="text-3xl mt-5 ml-4 mb-5 font-bold"
           style={{
             background: 'linear-gradient(135deg, #818cf8, #a78bfa)',
             WebkitBackgroundClip: 'text',
             WebkitTextFillColor: 'transparent',
           }}>Search</div>
      <hr className="mx-2 mb-3" />
      <input
        type="text"
        id="searchBar"
        className="ml-4 w-72"
        placeholder="Search..."
        onChange={onChange}
      />
      <div>
        {list.map((el: any) => {
          return (
            <SearchPlate key={el[0]} pfp={el[2]} uname={el[0]} rname={el[1]} />
          );
        })}
      </div>
    </div>
  );
}
function NotificationPlate({ str }: { str: string }) {
  return (
    <div className="m-2 p-5 rounded-xl transition-all duration-200 overflow-clip"
         style={{
           background: 'rgba(99, 102, 241, 0.1)',
           border: '1px solid rgba(99, 102, 241, 0.15)',
           color: '#e2e8f0',
         }}>
      {str}
    </div>
  );
}
function NotificationMenu(props: { enabled: boolean; user: any }) {
  const [list, setList] = useState([]);

  async function fun() {
    if (!gotNotifications) {
      gotNotifications = true;

      const x = {
        type: "get-notifications",
        _id: props.user.uid,
      };
      console.log(x);
      const y = await send(x);
      setList(y._data);
      console.log(y._data);
    }
  }

  useEffect(() => {
    fun();
  });
  return (
    <div
      className={
        "absolute w-96 h-screen z-10 transition-all " +
        (props.enabled ? "left-80" : "-left-16")
      }
      style={{
        background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95), rgba(30, 27, 75, 0.95))',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(99, 102, 241, 0.15)',
      }}
    >
      <div className="text-3xl mt-5 ml-4 mb-5 font-bold"
           style={{
             background: 'linear-gradient(135deg, #818cf8, #a78bfa)',
             WebkitBackgroundClip: 'text',
             WebkitTextFillColor: 'transparent',
           }}>Notifications</div>
      <hr className="mx-2 mb-3" />
      <div>
        {list.map((el: any) => {
          return <NotificationPlate str={el[0]} key={el[0]} />;
        })}
      </div>
    </div>
  );
}
function MoreMenu(props: moreMenuProps) {
  const navigate = useNavigate();
  return (
    <div
      className={
        "absolute w-72 rounded-xl z-40 left-2 bottom-28 overflow-hidden transition-all duration-100 " +
        (!props.enabled ? "h-0" : "h-auto")
      }
      style={{
        background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95))',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <SidebarPlate
        icon="logout"
        name="Log out"
        action={() => {
          props.setUser({
            uid: 0,
            pass: "",
          });
          props.setLoggedIn(false);
        }}
      />
      <SidebarPlate
        icon="Bookmark"
        name="Saved"
        action={() => {
          navigate("/saved");
        }}
      />
    </div>
  );
}
export default function Sidebar(props: sidebarProps) {
  const navigate = useNavigate();
  const [searchEnabled, setSearchEnabled] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [moreEnabled, setMoreEnabled] = useState(false);
  const [createNewEnabled, setCreateNewEnabled] = useState(false);

  return (
    <>
      <SearchMenu enabled={searchEnabled} />
      <MoreMenu
        enabled={moreEnabled}
        setUser={props.setUser}
        setLoggedIn={props.setLoggedIn}
      />
      <NotificationMenu enabled={notificationEnabled} user={props.user} />
      {createNewEnabled && (
        <CreatePost user={props.user} setEnabled={setCreateNewEnabled} />
      )}
      <span className="fixed z-20 w-80 text-3xl h-full"
            style={{
              background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.98), rgba(30, 27, 75, 0.95))',
              borderRight: '1px solid rgba(99, 102, 241, 0.15)',
              backdropFilter: 'blur(20px)',
            }}>
        <span className="material-symbols-rounded text-4xl w-full py-7 pl-5 hover:cursor-pointer block font-bold"
              style={{
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.1))',
                color: '#818cf8',
                borderBottom: '1px solid rgba(99, 102, 241, 0.15)',
              }}>
          KITE
        </span>
        <SidebarPlate
          icon="Home"
          name="Home"
          action={() => {
            navigate("/");
          }}
        />
        <SidebarPlate
          icon="Search"
          name="Search"
          action={() => setSearchEnabled(!searchEnabled)}
        />
        <SidebarPlate
          icon="add_box"
          name="Create"
          action={() => setCreateNewEnabled(true)}
        />
        <SidebarPlate
          icon={"notifications"}
          name="Notifications"
          action={() => {
            setNotificationEnabled(!notificationEnabled);
            gotNotifications = false;
          }}
        />
        <SidebarPlate
          icon="person"
          name="Profile"
          action={() => navigate("/profile")}
        />
        <div
          onClick={() => setMoreEnabled(!moreEnabled)}
          className="m-2 p-5 rounded-xl absolute w-72 bottom-0 hover:cursor-pointer transition-all duration-200"
          style={{ color: '#cbd5e1' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(99, 102, 241, 0.15)';
            e.currentTarget.style.color = '#818cf8';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#cbd5e1';
          }}
        >
          <span className="material-symbols-rounded mr-10 ml-3 text-4xl">
            Menu
          </span>
          <div className="inline-block relative -translate-y-2 font-medium">More</div>
        </div>
      </span>
    </>
  );
}
