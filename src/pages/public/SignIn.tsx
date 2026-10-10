import { Link } from "react-router-dom";
import { send } from "../../lib/io";
import { useState } from "react";

interface props {
  setUser: any;
  user: any;
  setLoggedIn: any;
}

export default function SignIn(props: props) {
  const [er, setEr] = useState("");

  async function submit() {
    const email = (document.getElementById("email") as HTMLInputElement).value;
    const pass = (document.getElementById("pass") as HTMLInputElement).value;

    const y = {
      type: "validate-user",
      _pass: pass,
      _email: email,
    };

    const x = await send(y);

    if (x.error != 0) {
      setEr(x.msg);
      return;
    } else {
      props.setUser(() => {
        var ret = props.user;
        (ret.uid = x._id), (ret.pass = pass);
        console.log(ret);

        return ret;
      });
      props.setLoggedIn(true);
    }
  }

  return (
    <div className="w-2/3 text-center mx-auto mt-10 rounded-3xl p-5 flex animate-fade-in overflow-hidden"
         style={{
           background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.6))',
           border: '1px solid rgba(99, 102, 241, 0.15)',
           boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(99, 102, 241, 0.1)',
           backdropFilter: 'blur(20px)',
         }}>
      <img src="signIn.jpeg" className="w-1/2 rounded-3xl object-cover" style={{ maxHeight: '48rem', filter: 'brightness(0.85) contrast(1.1)' }} />
      <div className="w-1/2 flex flex-col items-center justify-center">
        <div className="font-bold text-7xl my-5"
             style={{
               background: 'linear-gradient(135deg, #818cf8, #6366f1, #a78bfa)',
               WebkitBackgroundClip: 'text',
               WebkitTextFillColor: 'transparent',
             }}>
          Hello Again
        </div>
        <div className="text-xl text-slate-400">login again to get connected!</div>
        <div className="mt-12">
          <input
            type="email"
            id="email"
            autoComplete="off"
            placeholder="Email"
            className="w-96 h-16 p-4 my-3 text-xl rounded-2xl"
          />
          <br />
          <input
            type="password"
            id="pass"
            placeholder="Password"
            className="w-96 h-16 p-4 my-3 text-xl rounded-2xl"
          />
          <br />

          <div className="mt-8 mb-4 text-red-400 text-xl">{er}</div>
          <button
            onClick={submit}
            className="w-40 h-14 p-3 mb-10 text-xl rounded-2xl font-semibold"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              border: 'none',
              boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
            }}
          >
            Sign in
          </button>
        </div>
        <div className="text-slate-400">
          new to Kite? Create an account...{" "}
          <Link to={"/sign-up"} className="font-semibold">Sign up</Link>
        </div>
      </div>
    </div>
  );
}
