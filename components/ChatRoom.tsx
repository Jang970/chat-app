import firebase from "firebase/compat/app";
import React, { useEffect, useRef, useState } from "react";
import { formatRelative } from "date-fns";

interface ChatRoomProps {
  database: firebase.firestore.Firestore;
  user: firebase.User;
}

type CollectionData = Array<firebase.firestore.DocumentData>;

export default function ChatRoom({ database, user }: ChatRoomProps) {
  const db = database;
  const { uid, displayName } = user;
  const [newMessage, setNewMessage] = useState<string>("");
  const [messages, setMessages] = useState<CollectionData>([]);

  // load all messages
  useEffect(() => {
    db.collection("messages")
      .orderBy("createdAt")
      .limit(100)
      .onSnapshot((querySnapShot) => {
        const data: CollectionData = querySnapShot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        setMessages(data);
      });
  }, [db]);

  // const dummySpace = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  listRef.current?.lastElementChild?.scrollIntoView({ behavior: "smooth" });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    db.collection("messages").add({
      text: newMessage,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      displayName,
    });

    setNewMessage("");

    const id = setInterval(() => {
      listRef.current?.lastElementChild?.scrollIntoView({ behavior: "smooth" });
      clearInterval(id);
    }, 150);

    // // scroll down
    // dummySpace.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScroll = () => {
    listRef.current?.lastElementChild?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="flex flex-col p-7 bg-neutral-700 gap-5 h-full w-full overflow-hidden items-center">
      <button
        onClick={handleScroll}
        className="bg-slate-500 w-1/12 h-8 font-bold rounded-md hover:bg-slate-600"
      >
        To Bottom
      </button>
      <ul
        className="flex flex-col h-full w-full overflow-y-auto gap-y-3 p-3"
        ref={listRef}
      >
        {messages.map((message) => (
          <li
            key={message.id}
            className={
              message.uid === uid
                ? "bg-blue-900 rounded-full rounded-bl-none py-3 px-7"
                : "bg-neutral-800 rounded-full rounded-br-none italic py-3 px-7"
            }
          >
            <section className="flex flex-col grow">
              {message.displayName ? (
                <span className="font-bold">{message.displayName}</span>
              ) : null}

              <div className="flex mt-0.5">
                <p className="grow text-base flex-wrap"> {message.text}</p>
                {message.createdAt?.seconds ? (
                  <span className="text-xs italic">
                    {formatRelative(
                      new Date(message.createdAt.seconds * 1000),
                      new Date()
                    )}
                  </span>
                ) : null}
              </div>
            </section>
          </li>
        ))}
      </ul>

      <form
        onSubmit={handleSubmit}
        className="flex gap-x-2 w-full bg-neutral-700 py-1 px-3"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Message friends..."
          className="w-11/12 px-2 rounded-lg text-black"
        />
        <button
          type="submit"
          disabled={!newMessage}
          className={
            newMessage
              ? "grow py-0.5 bg-blue-600 hover:bg-blue-700"
              : "grow py-0.5 bg-gray-400"
          }
        >
          Send
        </button>
      </form>
    </main>
  );
}
