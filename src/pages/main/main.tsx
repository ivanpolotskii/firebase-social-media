import React, { useEffect, useState } from "react";
import { auth, db } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDocs, collection } from "firebase/firestore";
import Post from "./post";

export interface Post {
  id: string;
  userId: string;
  title: string;
  username: string;
  description: string;
}

const Main = () => {
  const [user] = useAuthState(auth);
  const postsRef = collection(db, "posts");
  const [postsList, setPostsList] = useState<Post[] | null>(null);

  const getPosts = async () => {
    const data = await getDocs(postsRef);
    setPostsList(
      data.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as Post[]
    );
  };
  useEffect(() => {
    getPosts();
  }, []);
  return (
    <div className="main">
      {/* Главная страница
      <h1>{user && "Вы вошли как " + user?.displayName}</h1> */}
      {postsList?.map((post) => (
        <Post
        key={post.id}
        post={post}
        postsList={postsList}
        setPostsList={setPostsList}
      />
      ))}
    </div>
  );
};

export default Main;
