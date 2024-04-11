"use client";
import { useEffect, useRef, useState } from "react";
import { IoIosSend } from "react-icons/io";
import LoadingDots from "../components/LoadingDots";

export default function Home() {
  const [history, setHistory] = useState([]);

  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    if (message == "") return;
    setHistory((oldHistory) => [
      ...oldHistory,
      { role: "user", content: message },
    ]);
    setMessage("");
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input_question: message, history: history }),
    })
      .then(async (res) => {
        const r = await res.json();
        setHistory((oldHistory) => [...oldHistory, r]);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const lastMessageRef = useRef();

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [history]);
  return (
    <main className="h-screen bg-white p-6 flex flex-col">
      <div className="flex flex-col gap-8 w-full items-center flex-grow max-h-full">
        <h1 className=" text-4xl text-transparent font-extralight bg-clip-text bg-gradient-to-r from-violet-800 to-fuchsia-500">
          AI CHATBOT
        </h1>

        <form
          className="rounded-2xl border-purple-700 border-opacity-5  border lg:w-3/4 flex-grow flex flex-col bg-[url('/images/bg.png')] bg-cover max-h-full overflow-clip"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="overflow-y-scroll flex flex-col gap-5 p-10 h-full">
            {history.map((message, idx) => {
              const isLastMessage = idx === history.length - 1;
              switch (message.role) {
                case "assistant":
                  return (
                    <div
                      ref={isLastMessage ? lastMessageRef : null}
                      key={idx}
                      className="flex gap-2"
                    >
                      <img
                        src="images/assistant-avatar.png"
                        className="h-12 w-12 rounded-full"
                      />
                      <div className="w-auto max-w-xl break-words bg-white rounded-b-xl rounded-tr-xl text-black py-2 px-3 shadow-[0_10px_40px_0px_rgba(0,0,0,0.15)]">
                        <p className="text-sm font-medium text-violet-500 mb-2">
                          AI assistant
                        </p>
                        {message.content}
                      </div>
                    </div>
                  );
                case "user":
                  return (
                    <div
                      className="self-end flex flex-row-reverse gap-2 items-start"
                      key={idx}
                    >
                      <div
                        className=" w-auto px-3 py-2 max-w-xl break-words bg-white rounded-b-xl rounded-tl-xl text-black   shadow-[0_10px_40px_0px_rgba(0,0,0,0.15)]"
                        key={idx}
                        ref={isLastMessage ? lastMessageRef : null}
                      >
                        <p className="text-sm font-medium text-violet-500 mb-2">
                          You
                        </p>
                        {message.content}
                      </div>
                    </div>
                  );
              }
            })}
            {loading && (
              <div ref={lastMessageRef} className="flex gap-2">
                <img
                  src="images/assistant-avatar.png"
                  className="h-12 w-12 rounded-full"
                />
                <div className="w-auto max-w-xl break-words bg-white rounded-b-xl rounded-tr-xl text-black px-5 py-3 shadow-[0_10px_40px_0px_rgba(0,0,0,0.15)]">
                  <p className="text-sm font-medium text-violet-500 mb-4">
                    AI assistant
                  </p>
                  <LoadingDots />
                </div>
              </div>
            )}
          </div>
          {/* input area */}
          <div className="flex sticky bottom-0 w-full px-6 pb-6 h-20">
            <div className="w-full relative flex items-center">
              <input
                aria-label="chat input"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message"
                className="w-full h-full resize-none rounded-full border border-slate-900/10 bg-white pl-6 pr-24  text-base placeholder:text-slate-400 focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-500/10 shadow-[0_10px_40px_0px_rgba(0,0,0,0.15)] text-gray-900"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleClick();
                  }
                }}
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleClick();
                }}
                className="flex p-2 items-center justify-center rounded-full text-sm  bg-violet-600 font-semibold text-white hover:bg-violet-700 active:bg-violet-800 absolute right-2  disabled:bg-violet-100 disabled:text-violet-400"
                type="submit"
                aria-label="Send"
                disabled={!message || loading}
              >
                <IoIosSend className="text-2xl" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
