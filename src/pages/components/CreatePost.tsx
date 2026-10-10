import { useState } from "react";
import { send, toBase64 } from "../../lib/io";

interface props {
  setEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  user: {
    uid: number;
    pass: string;
  };
}
export default function CreatePost(props: props) {
  const [postType, setPostType] = useState(1);
  const [src, setSrc] = useState("");

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSrc(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  function imageSubmit() {
    const img = document.getElementById("file") as HTMLInputElement;
    img.click();
  }

  async function submit() {
    const img = document.getElementById("file") as HTMLInputElement;
    console.log(img.files);

    if (img.files?.length) {
      let b64 = await toBase64(img.files[0]);

      const x = {
        type: "post-img",
        base64: b64 ? b64.replace(/^data:(.*,)?/, "") : "",
        img_type: img.files[0].type.replace("image/", ""),
      };

      var y = (await send(x)).loc;
    } else {
      if ((document.getElementById("Text") as HTMLInputElement).value == "") {
        console.log("can't send");
        return;
      }
      y = "";
    }

    const x1 = {
      type: "create-post",
      _id: props.user.uid,
      _img: y,
      _postType: postType,
      _text: (document.getElementById("Text") as HTMLInputElement).value,
    };

    await send(x1);
    props.setEnabled(false);
  }

  return (
    <div className="absolute z-30 w-screen h-screen"
         style={{ background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)' }}>
      <div className="absolute rounded-2xl w-1/2 right-1/4 top-10 overflow-y-auto animate-fade-in"
           style={{
             background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95))',
             border: '1px solid rgba(99, 102, 241, 0.2)',
             boxShadow: '0 8px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(99, 102, 241, 0.1)',
             backdropFilter: 'blur(20px)',
             maxHeight: '40rem',
           }}>
        <span
          onClick={() => {
            props.setEnabled(false);
          }}
          className="material-symbols-rounded p-1 px-2 absolute right-5 top-3 text-3xl hover:cursor-pointer rounded-full transition-all duration-200"
          style={{ color: '#94a3b8' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)'; e.currentTarget.style.color = '#818cf8'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; }}
        >
          Close
        </span>
        <div className="text-2xl m-5 font-bold"
             style={{
               background: 'linear-gradient(135deg, #818cf8, #a78bfa)',
               WebkitBackgroundClip: 'text',
               WebkitTextFillColor: 'transparent',
             }}>Create Post</div>
        <hr />
        <div
          onClick={imageSubmit}
          className={
            (src ? "" : "border-dashed") +
            " border w-1/2 h-96 mx-auto mt-10 flex justify-center rounded-xl transition-all duration-200"
          }
          style={{
            borderColor: 'rgba(99, 102, 241, 0.3)',
            background: src ? 'transparent' : 'rgba(99, 102, 241, 0.05)',
            cursor: 'pointer',
          }}
        >
          <input
            onChange={handleFileChange}
            type="file"
            id="file"
            className="hidden"
            accept="image/*"
          />
          {src != "" ? (
            <img src={src} className="object-contain rounded-xl" />
          ) : (
            <div className="text-center" style={{ color: '#64748b' }}>
              <span className="material-symbols-rounded block text-7xl mt-36 mx-8"
                    style={{ color: '#6366f1' }}>
                photo_library
              </span>
              Click To Choose File
            </div>
          )}
        </div>
        <textarea
          id="Text"
          placeholder="What's on your mind?"
          maxLength={255}
          className="relative translate-x-1/2 mt-5 p-3 w-1/2 h-40 text-xl resize-none rounded-xl"
        />

        <div className="mx-auto w-64 flex mt-10 mb-20 rounded-full overflow-hidden"
             style={{
               background: 'rgba(30, 41, 59, 0.8)',
               border: '1px solid rgba(99, 102, 241, 0.2)',
             }}>
          <div
            onClick={() => setPostType(0)}
            className={"w-32 px-9 py-3 text-xl rounded-full hover:cursor-pointer transition-all duration-200 text-center font-medium"}
            style={{
              background: postType === 0 ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'transparent',
              color: postType === 0 ? '#fff' : '#94a3b8',
            }}
          >
            Public
          </div>
          <div
            onClick={() => setPostType(1)}
            className={"w-32 px-10 py-3 text-xl rounded-full hover:cursor-pointer transition-all duration-200 text-center font-medium"}
            style={{
              background: postType === 1 ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'transparent',
              color: postType === 1 ? '#fff' : '#94a3b8',
            }}
          >
            Private
          </div>
        </div>
        <br />
        <button
          onClick={submit}
          className="m-5 text-xl absolute right-24 -translate-y-24 font-semibold"
          style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            border: 'none',
            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
            padding: '0.7em 2em',
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}
