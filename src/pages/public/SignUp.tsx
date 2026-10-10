import { Link } from "react-router-dom";
import { isAlphaNum, send, validateEmail } from "../../lib/io";
import { useState } from "react";

interface props {
  setUser: any;
  user: any;
  setLoggedIn: any;
}

export default function SignUp(props: props) {
  const [er, setEr] = useState("");

  async function submit() {
    setEr("");

    const uname = (document.getElementById("uname") as HTMLInputElement).value;
    const email = (document.getElementById("email") as HTMLInputElement).value;
    const pass = (document.getElementById("pass") as HTMLInputElement).value;
    const rePass = (document.getElementById("repass") as HTMLInputElement)
      .value;

    if (uname.length < 3) {
      setEr("User name is less than minimum length (3)");
      return;
    }
    if (uname.length > 255) {
      setEr("User name is over maximum length (255)");
      return;
    }
    if (!isAlphaNum(uname)) {
      setEr("Invalid symbol in user name");
      return;
    }
    if (email.length > 255) {
      setEr("Email is over maximum length (255)");
      return;
    }
    if (!validateEmail(email)) {
      setEr("Improper syntax for Email");
      return;
    }
    if (pass.length < 8) {
      setEr("Password is less than minimum length (8)");
      return;
    }
    if (pass.length > 255) {
      setEr("password is over maximum length (255)");
      return;
    }
    if (pass != rePass) {
      setEr("Re-Entered password does not match");
      return;
    }
    const y = {
      type: "create-user",
      _uname: uname,
      _pass: pass,
      _email: email,
    };
    console.log("submit");

    var x = await send(y);

    if (x.error != 0) setEr(x.msg);
    else
      props.setUser(() => {
        var ret = props.user;
        (ret.uid = x._id), (ret.pass = pass);

        props.setLoggedIn(true);
        return ret;
      });

    return;
  }

  return (
    <div className="w-2/3 text-center mx-auto mt-10 rounded-3xl p-5 flex animate-fade-in overflow-hidden"
         style={{
           background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.6))',
           border: '1px solid rgba(99, 102, 241, 0.15)',
           boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(99, 102, 241, 0.1)',
           backdropFilter: 'blur(20px)',
         }}>
      <div className="w-1/2 mx-auto xl:mx-0 flex flex-col items-center justify-center">
        <div className="font-bold text-7xl my-5"
             style={{
               background: 'linear-gradient(135deg, #818cf8, #6366f1, #a78bfa)',
               WebkitBackgroundClip: 'text',
               WebkitTextFillColor: 'transparent',
             }}>
          Welcome
        </div>
        <div className="text-xl text-slate-400">sign up and have fun!</div>
        <div className="mt-12">
          <input
            type="text"
            id="uname"
            autoComplete="new-password"
            placeholder="Username"
            className="w-96 h-16 p-4 my-2 text-xl rounded-2xl"
          />
          <br />
          <input
            type="email"
            id="email"
            placeholder="Email"
            autoComplete="new-password"
            className="w-96 h-16 p-4 my-2 text-xl rounded-2xl"
          />
          <br />
          <input
            type="password"
            id="pass"
            autoComplete="new-password"
            placeholder="Password"
            className="w-96 h-16 p-4 my-2 text-xl rounded-2xl"
          />
          <br />
          <input
            type="password"
            id="repass"
            autoComplete="new-password"
            placeholder="Re-enter password"
            className="w-96 h-16 p-4 my-2 text-xl rounded-2xl"
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
            Sign up
          </button>
        </div>
        <div className="text-slate-400">
          Already have an account?{" "}
          <Link to={"/sign-in"} className="font-semibold">Sign in</Link>
        </div>
      </div>
      <img src="signIn.jpeg" className="w-0 rounded-3xl xl:w-1/2 object-cover" style={{ maxHeight: '48rem', filter: 'brightness(0.85) contrast(1.1)' }} />
    </div>
  );
}
