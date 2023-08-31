import { renderComments } from "./render.js";
import { postApi } from "./api.js";
import { appElement } from "./vars.js";
export { initLikeComments, initReplyComment, checkInput, addComment };


function initLikeComments ({ comments }) {       
    
    const listLikeButtons = document.querySelectorAll('.like-button');
  
    for (let like of listLikeButtons) {
      like.addEventListener("click", (event) => {
        event.stopPropagation();
        let indexLike = like.dataset.index;
        if (comments[indexLike].isLiked) {
          comments[indexLike].likes -= 1;
          comments[indexLike].isLiked = false;
        } else {
          comments[indexLike].likes += 1;
          comments[indexLike].isLiked = true;
        }
  
        renderComments({ comments });
  
      })
    }
}


function initReplyComment ({ comments }) {         

   const listLiItems = document.querySelectorAll('.comment');
   const textElement = document.querySelector('textarea[class="add-form-text"]');
 
        for (let liItem of listLiItems) {
            liItem.addEventListener("click", () => {
            let indexLiItem = liItem.dataset.index;
            let replyComment = `QUOTE_BEGIN ${comments[indexLiItem].author.name}:\n${comments[indexLiItem].text} QUOTE_END \n`;
            textElement.value = replyComment;
            renderComments({ comments });
            })
        }
}

function checkInput ({ buttonElement, nameElement, textElement }) {

    buttonElement.className = 'error-add-form-button'; 
    let nameElementCheck = false;                  
    let textElementCheck = false;         
    function handleInputs() {             
      if (nameElementCheck && textElementCheck) {     
        buttonElement.className = 'add-form-button';   
      }
    }
    nameElement.addEventListener("input", () => {   
      nameElementCheck = true;
      handleInputs();
    })
    textElement.addEventListener("input", () => {   
      textElementCheck = true;
      handleInputs();
    })
}

function addComment ({ buttonElement, addFormElement, addFormProgressElement, nameElement, textElement, comments, fetchAndRenderComments }) {
    let buttonCheck = false;  
    let enterCheck = false;   
    function handleAddButtons() {          
      if (buttonCheck || enterCheck) {  
        if (nameElement.value === '' || textElement.value === '') { 
          buttonElement.className = 'error-add-form-button';        
          return;
        }
      addFormElement.style.display = 'none';
      addFormProgressElement.style.display = 'block'
        
          function postComment() {
          postApi ({
              name: nameElement.value,
              text: textElement.value,
          })
          .then((responseData) => {
            comments = responseData.comments;
          })
          .then(() => {
            return fetchAndRenderComments();  
          })
          .then((data) => {
            addFormProgressElement.style.display = 'none';
            addFormElement.style.display = 'flex';
            nameElement.value = '';           
            textElement.value = '';
            checkInput ({ buttonElement, nameElement, textElement });
          })
          .catch((error, typeError) => {
            addFormProgressElement.style.display = 'none';
            addFormElement.style.display = 'flex';
            if (error.message === "Плохой запрос") {
              alert("Имя и комментарий должны быть не короче 3 символов");
              return;
            }
            if (error.message === "Сервер сломался") {
              addFormElement.style.display = 'none';
              addFormProgressElement.style.display = 'block';
              postComment();
            }
            else {
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

    })

    document.addEventListener("keyup", (event) => {   
      if (event.key === 'Enter') {
        enterCheck = true;
        handleAddButtons();
      }
    })
}

export function initLoaderComments() {
  appElement.innerHTML = `
  <div class="comments-progress">
    <p>Подождите, комментарии загружаются...</p>
  </div>`;
}