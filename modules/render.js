import { appElement, containerFormsElement } from "./vars.js";
import {
  initLikeComments,
  initReplyComment,
  deleteComment,
} from "./actions.js";
import { format } from "date-fns";

export let loginUser;
export const setLoginUser = (newLoginUser) => {
  loginUser = newLoginUser;
};

export { renderComments, renderForms };

function renderComments({ comments }) {
  const commentsHTML = comments
    .map((comment) => {
      const commentTime = format(new Date(comment.date), "yyyy-MM-dd hh.mm.ss");
      return `
              <li data-index="${comment.id}" class="comment">
                  <div class="comment-header">
                      <div>${comment.author.name} (${
                        comment.author.login
                      })</div>
                      <div>${commentTime}</div>
                  </div>
                  <div class="comment-body">
                      <div class="comment-text">
                      ${comment.text
                        .replaceAll("QUOTE_BEGIN", "<div class='quote'>")
                        .replaceAll("QUOTE_END", "</div>")}
                      </div>
                  </div>
                  <div class="comment-footer">
                      <div class="likes">
                      <span class="likes-counter">${comment.likes}</span>
                      <button data-index="${comment.id}" class="like-button ${
                        comment.isLiked ? "-active-like" : ""
                      }"></button>
                      </div>
                  </div>
              </li> `;
    })
    .join("");

  appElement.innerHTML = `<ul class="comments">${commentsHTML}</ul>
      <div class="delete-form">
      <button class="delete-form-button">Удалить последний комментарий</button>
      </div>`;

  initLikeComments({ comments });
  initReplyComment({ comments });
  deleteComment({ comments });
}

function renderForms() {
  containerFormsElement.innerHTML = `
        <div class="add-form">
          <input type="text" class="add-form-name" value="${loginUser}" readonly style="background: grey; color: #ffffff;"> 
          <textarea type="textarea" class="add-form-text" placeholder="Введите ваш коментарий" rows="4"></textarea>
          <div class="add-form-row">
            <button class="add-form-button">Написать</button>
          </div>
        </div>
        <div class="add-form-progress">
        <p>Ваш комментарий добавляется...</p>
        </div>`;
}
