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

  const dummySpace = useRef<HTMLDivElement | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    db.collection("messages").add({
      text: newMessage,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      displayName,
    });

    setNewMessage("");

    // scroll down
    dummySpace.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main>
      <ul>
        {messages.map((message) => (
          <li key={message.id}>
            <section>
              <p>{message.text}</p>

              {message.displayName ? <span>{message.displayName}</span> : null}
              <br />
              {message.createdAt?.seconds ? (
                <span>
                  {formatRelative(
                    new Date(message.createdAt.seconds * 1000),
                    new Date()
                  )}
                </span>
              ) : null}
            </section>
          </li>
        ))}
      </ul>

      {/*Will be used to scroll new messages into view */}
      <div ref={dummySpace}></div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Message friends..."
        />
        <button type="submit" disabled={!newMessage}>
          Send
        </button>
      </form>
    </main>
  );
}
