import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./create-form.scss";
import IconButton from "@mui/material/IconButton";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatColorTextIcon from "@mui/icons-material/FormatColorText";

interface CreateFormData {
  title: string;
  description: string;
}

const CreateForm = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const schema = yup.object().shape({
    title: yup.string().required("You must add a title"),
    description: yup.string().required("You must add a description"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue, // Добавляем setValue
  } = useForm<CreateFormData>({
    resolver: yupResolver(schema),
  });

  const postsRef = collection(db, "posts");

  const onCreatePost = async (data: CreateFormData) => {
    await addDoc(postsRef, {
      ...data,
      username: user?.displayName,
      userId: user?.uid,
    });
    navigate("/");
  };

  // Обновляем handleChangeTitle для использования setValue
  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    sessionStorage.setItem("title", newValue);
    setValue("title", newValue); // Обновляем значение с помощью setValue
  };

  // Обновляем handleChangeTextArea для использования setValue
  const handleChangeTextArea = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newValue = event.target.value;
    sessionStorage.setItem("textarea", newValue);
    setValue("description", newValue); // Обновляем значение с помощью setValue
  };
  useEffect(() => {
    const input = document.querySelector(".inp") as HTMLInputElement;
    if (input) {
      // Проверяем, что элемент существует, перед тем как обращаться к свойству value
      input.value = sessionStorage.getItem("title") || ""; // Устанавливаем значение из localStorage или пустую строку, если значение отсутствует
    }
    const textarea = document.querySelector(".tex") as HTMLTextAreaElement;
    if (textarea) {
      // Проверяем, что элемент существует, перед тем как обращаться к свойству value
      textarea.value = sessionStorage.getItem("textarea") || ""; // Устанавливаем значение из localStorage или пустую строку, если значение отсутствует
    }
  }, []);
  // Функции для обработки кликов по кнопкам форматирования
  const handleFormatClick = (formatType: string, color?: string) => {
    const textarea = document.querySelector(".tex") as HTMLTextAreaElement;
    if (!textarea) return;

    let start = textarea.selectionStart;
    let end = textarea.selectionEnd;
    let selectedText = textarea.value.substring(start, end);
    let beforeText = textarea.value.substring(0, start);
    let afterText = textarea.value.substring(end);

    switch (formatType) {
      case "bold":
        selectedText = `<b>${selectedText}</b>`;
        break;
      case "italic":
        selectedText = `<i>${selectedText}</i>`;
        break;
      case "underline":
        selectedText = `<u>${selectedText}</u>`;
        break;
      case "color":
        if (color) {
          selectedText = `<span style="color: ${color};">${selectedText}</span>`;
        }
        break;
      default:
        break;
    }

    textarea.value = beforeText + selectedText + afterText;
    // Обновление состояния form для описания
    setValue("description", textarea.value);
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit(onCreatePost)}>
        <input
          className="inp"
          placeholder="Название..."
          {...register("title")}
          onChange={handleChangeTitle} // Применяем измененный обработчик
        />
        <p style={{ color: "red" }}>{errors.title?.message}</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <IconButton
            color="secondary"
            onClick={() => handleFormatClick("bold")}
          >
            <FormatBoldIcon />
          </IconButton>
          <IconButton
            color="secondary"
            onClick={() => handleFormatClick("italic")}
          >
            <FormatItalicIcon />
          </IconButton>
          <IconButton
            color="secondary"
            onClick={() => handleFormatClick("underline")}
          >
            <FormatUnderlinedIcon />
          </IconButton>
          <input type="color" id="textColorPicker" />
          <IconButton
            color="secondary"
            onClick={() =>
              handleFormatClick(
                "color",
                (
                  document.getElementById(
                    "textColorPicker"
                  ) as HTMLTextAreaElement
                ).value
              )
            }
          >
            <FormatColorTextIcon />
          </IconButton>
        </div>
        <textarea
          className="tex"
          placeholder="Описание..."
          {...register("description")}
          onChange={handleChangeTextArea}
        />
        <p style={{ color: "red" }}>{errors.description?.message}</p>
        <input type="submit" value="Выложить" />
      </form>
    </div>
  );
};

export default CreateForm;
