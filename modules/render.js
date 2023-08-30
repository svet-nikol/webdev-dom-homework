import { containerFormsElement  } from "./vars.js";
import { initLikeComments, initReplyComment } from "./actions.js";

export { renderComments, renderForms };


    function renderComments({ comments }) {  
        const appElement = document.querySelector('div[class="containerComments"]');
        let appHTML = `
        <div class="comments-progress">
          <p>Подождите, комментарии загружаются...</p>   <!-- для лоудера на момент загрузки всех комментариев с свервера -->
        </div>`;
        appElement.innerHTML = appHTML;

        const commentsHTML = comments
          .map((comment, ind) => {
          let currentTime = new Date(comment.date);
          let commentTime = `${currentTime.toLocaleDateString('ru-Ru', { day: "2-digit", month: "2-digit", year: "2-digit" })} ${currentTime.toLocaleTimeString('ru-Ru', { hour: "2-digit", minute: "2-digit" })}`;
          return `
              <li data-index="${ind}" class="comment">
                  <div class="comment-header">
                      <div>${comment.author.name}</div>
                      <div>${commentTime}</div>
                  </div>
                  <div class="comment-body">
                      <div class="comment-text">
                      ${comment.text.replaceAll("QUOTE_BEGIN", "<div class='quote'>").replaceAll("QUOTE_END", "</div>")}
                      </div>
                  </div>
                  <div class="comment-footer">
                      <div class="likes">
                      <span class="likes-counter">${comment.likes}</span>
                      <button data-index="${ind}" class="like-button ${comment.isLiked ? "-active-like" : ""}"></button>
                      </div>
                  </div>
              </li> `;
        }).join("");

        appHTML = `<ul class="comments">${commentsHTML}</ul>
        <div class="comments-progress">
          <p>Подождите, комментарии загружаются...</p>   <!-- для лоудера на момент загрузки всех комментариев с свервера -->
        </div>`;
    
        appElement.innerHTML = appHTML;

        const ulElement = document.querySelector('ul[class="comments"]');
        const ulProgressElement = document.querySelector('div[class="comments-progress"]');

        ulElement.style.display = 'none';
        ulProgressElement.style.display = 'block';
    
        initLikeComments({ comments }); 
        initReplyComment({ comments });
    
    }

    function renderForms() {         
        containerFormsElement.innerHTML = `  <div class="delete-form">
        <button class="delete-form-button">Удалить последний комментарий</button>
      </div>
      <div class="add-form">
        <input type="text" class="add-form-name" placeholder="Введите ваше имя" />
        <textarea type="textarea" class="add-form-text" placeholder="Введите ваш коментарий" rows="4"></textarea>
        <div class="add-form-row">
          <button class="add-form-button">Написать</button>
        </div>
      </div>
      <div class="add-form-progress">
      <p>Ваш комментарий добавляется...</p>
      </div>`;

  
    
        // функционал удаления последнего комментария
        let buttonDelete = document.querySelector('button[class="delete-form-button"]');
        buttonDelete.addEventListener("click", () => {
          let lis = document.querySelectorAll('.comment');  
          let liDelete = lis[lis.length - 1];  
          liDelete.parentNode.removeChild(liDelete); 
        });
    }

