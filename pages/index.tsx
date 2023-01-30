import Head from "next/head";
import { auth, googleProvider, db } from "../firebase_library/firebase";
import { useEffect, useState } from "react";
import ChatRoom from "@/components/ChatRoom";

export default function Home() {
  // setting up auto checking if user is logged in or not
  const [user, setUser] = useState(() => auth.currentUser);
  // auto check the state of the user and update state appropriately
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, []);

  // setting up a pop up to sign up using a google account
  const signInWithGoogle = async () => {
    const provider = googleProvider;

    try {
      await auth.signInWithPopup(provider);
    } catch (error) {
      console.log(error);
    }
  };

  // simple sign out feature
  const signOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Head>
        <title>Justin's Chat App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="bg-neutral-700 text-neutral-200 h-screen w-screen flex flex-col items-center justify-center gap-10">
        {user ? (
          <>
            <nav className="flex w-full fixed top-0 p-4 bg-slate-600 justify-center items-center">
              <h2 className="grow text-xl p-2 font-bold">Chat With Friends</h2>
              <button
                onClick={signOut}
                className="m-auto py-2 px-8 rounded-lg bg-red-700 hover:bg-red-600 hover:italic"
              >
                Sign Out
              </button>
            </nav>
            <ChatRoom database={db} user={user} />
          </>
        ) : (
          <>
            <h1 className="text-6xl font-bold">Welcome To My Chat App</h1>
            <button
              onClick={signInWithGoogle}
              className="bg-blue-700 p-4 rounded-lg hover:bg-blue-600 hover:text-neutral-100 hover:italic"
            >
              Sign In With Google
            </button>
          </>
        )}
      </div>
    </>
  );
}
