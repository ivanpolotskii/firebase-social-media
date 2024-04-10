import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../config/firebase";
import { Post as IPost } from "./main";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { IconButton } from "@mui/material";
import "./post.scss";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";

interface Props {
  post: IPost; // Предполагается, что Post - это ваш тип данных для поста
  postsList: IPost[]; // Добавляем postsList в пропсы
  setPostsList: React.Dispatch<React.SetStateAction<IPost[] | null>>; // Тип для функции обновления состояния
}

interface Like {
  likeId: string;
  userId: string;
}

const Post = (props: Props) => {
  const { post, postsList, setPostsList } = props;
  const [user] = useAuthState(auth);

  const [likes, setLikes] = useState<Like[] | null>(null);
  // const [posts, setPosts] = useState<Post[] | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const postsRef = collection(db, "posts");
  // const [postsList, setPostsList] = useState<IPost[] | null>(null);

  const getPosts = async () => {
    const data = await getDocs(postsRef);
    setPostsList(
      data.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as IPost[]
    );
  };

  const likesRef = collection(db, "likes");

  const likesDoc = query(likesRef, where("postId", "==", post.id));

  const getLikes = async () => {
    const data = await getDocs(likesDoc);
    setLikes(
      data.docs.map((doc) => ({ userId: doc.data().userId, likeId: doc.id }))
    );
  };
  const addLike = async () => {
    try {
      const newDoc = await addDoc(likesRef, {
        userId: user?.uid,
        postId: post.id,
      });
      if (user) {
        setLikes((prev) =>
          prev
            ? [...prev, { userId: user?.uid, likeId: newDoc.id }]
            : [{ userId: user?.uid, likeId: newDoc.id }]
        );
      }
    } catch (err) {
      console.log(err);
    }
  };
  const removeLike = async () => {
    try {
      const likeToDeleteQuery = query(
        likesRef,
        where("postId", "==", post.id),
        where("userId", "==", user?.uid)
      );

      const likeToDeleteData = await getDocs(likeToDeleteQuery);
      const likeId = likeToDeleteData.docs[0].id;
      const likeToDelete = doc(db, "likes", likeId);
      await deleteDoc(likeToDelete);
      if (user) {
        setLikes(
          (prev) => prev && prev.filter((like) => like.likeId !== likeId)
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Добавляем функцию для удаления поста в компоненте Post
  const deletePost = async () => {
    try {
      await deleteDoc(doc(db, "posts", post.id)); // Удаление документа поста из Firestore
      if (user) {
        setPostsList(
          postsList && postsList.filter((postItem) => postItem.id !== post.id)
        );
      }
    } catch (error) {
      console.error("Ошибка при удалении поста: ", error);
      alert("Не удалось удалить пост. Пожалуйста, попробуйте снова.");
    }
  };
  // Добавляем функцию для изменения поста в компоненте Post
  // const changePost = async () => {
  //   try {
  //     await deleteDoc(doc(db, "posts", post.id)); // Удаление документа поста из Firestore
  //     if(user){
  //       setPostsList(postsList && postsList.filter(postItem => postItem.id !== post.id));
  //     }
  //   } catch (error) {
  //     console.error("Ошибка при удалении поста: ", error);
  //     alert("Не удалось удалить пост. Пожалуйста, попробуйте снова.");
  //   }
  // };

  const hasUserLiked = likes?.find((like) => like.userId === user?.uid);

  useEffect(() => {
    getLikes();
  }, []);
  function RenderAutoLinkedText(text:string) {
    // Example: Converts URLs in text to clickable links.
    // This is a simplified version; you might need a more complex implementation.
    const linkifiedText = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1">$1</a>');
    return linkifiedText;
  }
  return (
    <div className="post">
      <div className="title">
        <h1>{RenderAutoLinkedText(post.title)}</h1>
        {user && user.uid === post.userId && (
          <>
            <IconButton
              aria-label="more"
              aria-controls="long-menu"
              aria-haspopup="true"
              onClick={handleClick}
              style={{ color: "#fff" }} // Применяем стиль для иконки
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="long-menu"
              anchorEl={anchorEl}
              keepMounted
              open={open}
              onClose={handleClose}
              PaperProps={{
                style: {
                  maxHeight: 48 * 4.5,
                  width: "20ch",
                  backgroundColor: "#424242", // Применяем стиль для фона меню
                  color: "#fff", // Текст в меню
                },
              }}
            >
              <MenuItem
                onClick={() => {
                  deletePost();
                  handleClose();
                }}
                style={{ color: "#fff" }}
              >
                Удалить
              </MenuItem>
              {/* <MenuItem onClick={() => { handleClose(); }} style={{ color: '#fff' }}>Редактировать</MenuItem> */}
            </Menu>
          </>
        )}
      </div>
      <div className="body">
        <pre
          dangerouslySetInnerHTML={{
            __html: RenderAutoLinkedText(post.description),
          }}
        ></pre>
      </div>
      <div className="footer">
        <p>
          @{post.username}
          <span style={{ color: "orange" }}>
            {post.userId == "1g4Dx2gfujcpmXiwUl4oDG8nNz02"
              ? " (создатель сайта)"
              : ""}
          </span>
        </p>

        <IconButton onClick={hasUserLiked ? removeLike : addLike}>
          {hasUserLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          {likes && <p>{likes?.length}</p>}
        </IconButton>
      </div>
    </div>
  );
};

export default Post;
