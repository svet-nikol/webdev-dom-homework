import { renderComments } from "./render.js";
import { postApi, deleteCommentApi, switchLike } from "./api.js";
import { appElement } from "./vars.js";
export {
  initLikeComments,
  initReplyComment,
  checkInput,
  addComment,
  deleteComment,
};
import { fetchAndRenderComments } from "../main.js";

function initLikeComments({ comments }) {
  const listLikeButtons = document.querySelectorAll(".like-button");

  for (let like of listLikeButtons) {
    like.addEventListener("click", (event) => {
      event.stopPropagation();
      let id = like.dataset.index;

      like.disabled = true;

      switchLike({ id })
        .then((data) => {
          let indexLike = comments.findIndex(function (comment) {
            return comment.id === id;
          });
          comments[indexLike].likes = data.result.likes;
          comments[indexLike].isLiked = data.result.isLiked;
          renderComments({ comments });
        })
        .catch((error) => {
          if (error.message === "Нет авторизации") {
            alert("Сначала авторизуйтесь!");
            like.disabled = false;
            return;
          } else {
            alert("Кажется, у вас сломался интернет, попробуйте позже");
            like.disabled = false;
          }
          console.warn(error);
        });
    });
  }
}

function initReplyComment({ comments }) {
  const listLiItems = document.querySelectorAll(".comment");
  const textElement = document.querySelector('textarea[class="add-form-text"]');

  for (let liItem of listLiItems) {
    liItem.addEventListener("click", () => {
      let idComment = liItem.dataset.index;

      let indexComment = comments.findIndex(function (comment) {
        return comment.id === idComment;
      });

      let replyComment = `QUOTE_BEGIN ${comments[indexComment].author.name}(${comments[indexComment].author.login}):\n${comments[indexComment].text}QUOTE_END \n`;
      textElement.value = replyComment;
      renderComments({ comments });
    });
  }
}

function checkInput({ buttonElement, textElement }) {
  buttonElement.className = "error-add-form-button";
  let textElementCheck = false;
  function handleInputs() {
    if (textElementCheck) {
      buttonElement.className = "add-form-button";
    }
  }
  textElement.addEventListener("input", () => {
    textElementCheck = true;
    handleInputs();
  });
}

function addComment({
  buttonElement,
  addFormElement,
  addFormProgressElement,
  textElement,
  comments,
  fetchAndRenderComments,
}) {
  let buttonCheck = false;
  let enterCheck = false;
  function handleAddButtons() {
    if (buttonCheck || enterCheck) {
      if (textElement.value === "") {
        buttonElement.className = "error-add-form-button";
        return;
      }
      addFormElement.style.display = "none";
      addFormProgressElement.style.display = "block";

      function postComment() {
        postApi({
          text: textElement.value,
        })
          .then((responseData) => {
            comments = responseData.comments;
          })
          .then(() => {
            return fetchAndRenderComments();
          })
          .then((data) => {
            addFormProgressElement.style.display = "none";
            addFormElement.style.display = "flex";
            textElement.value = "";
            checkInput({ buttonElement, textElement });
          })
          .catch((error, typeError) => {
            addFormProgressElement.style.display = "none";
            addFormElement.style.display = "flex";
            if (error.message === "Плохой запрос") {
              alert("Rомментарий должны быть не короче 3 символов");
              return;
            }
            if (error.message === "Сервер сломался") {
              addFormElement.style.display = "none";
              addFormProgressElement.style.display = "block";
              postComment();
            } else {
              alert("Кажется, у вас сломался интернет, попробуйте позже");
            }
            console.warn(error);
          });
      }
      postComment();
    }
  }

  buttonElement.addEventListener("click", () => {
    buttonCheck = true;
    handleAddButtons();
  });

  document.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      enterCheck = true;
      handleAddButtons();
    }
  });
}

function deleteComment({ comments }) {
  let indexDeleteComment = comments.length - 1;
  let id = comments[indexDeleteComment].id;
  let buttonDelete = document.querySelector(
    'button[class="delete-form-button"]',
  );
  buttonDelete.addEventListener("click", () => {
    buttonDelete.disabled = true;
    buttonDelete.textContent = "Комментарий удаляется...";
    deleteCommentApi({ id })
      .then(() => {
        fetchAndRenderComments();
      })
      .catch((error) => {
        if (error.message === "Нет авторизации") {
          alert("Сначала авторизуйтесь!");
          buttonDelete.disabled = false;
          buttonDelete.textContent = "Удалить последний комментарий";
          return;
        } else {
          alert("Кажется, у вас сломался интернет, попробуйте позже");
          buttonDelete.disabled = false;
          buttonDelete.textContent = "Удалить последний комментарий";
        }
        console.warn(error);
      });
  });
}

export function initLoaderComments() {
  appElement.innerHTML = `
  <div class="comments-progress">
    <p>Подождите, комментарии загружаются...</p>
  </div>`;
}
