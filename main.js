import { getComments } from "./modules/api.js";
// import { ulElement, ulProgressElement } from "./modules/vars.js";
import { renderComments, renderForms } from "./modules/render.js";
import { checkInput, addComment } from "./modules/actions.js";
export { fetchAndRenderComments };



let comments = [];        

function fetchAndRenderComments() {   // ЗАГРУЗКА С СЕРВЕРА И РЕНДЕР ВСЕХ КОММЕНТАРИЕВ
  
  // ulElement.style.display = 'none';
  // ulProgressElement.style.display = 'block';
  getComments().then((responseData) => {
      comments = responseData.comments;
      renderComments({ comments });
      // const ulElement = document.querySelector('ul[class="comments"]');
      // const ulProgressElement = document.querySelector('div[class="comments-progress"]');
      return true;
    })
    .then(() => {
      const ulElement = document.querySelector('ul[class="comments"]');
      const ulProgressElement = document.querySelector('div[class="comments-progress"]');
      ulElement.style.display = 'flex';
      ulProgressElement.style.display = 'none';
    })
    .catch((error) => {
      // const ulElement = document.querySelector('ul[class="comments"]');
      // const ulProgressElement = document.querySelector('div[class="comments-progress"]');
      // ulElement.style.display = 'flex';
      // ulProgressElement.style.display = 'none';
      alert("Кажется, у вас сломался интернет, попробуйте позже обновить страницу...");
      console.warn(error);
    }); 
}

fetchAndRenderComments();



function globalAdd() {   // ДОБАВЛЕНИЕ НОВОГО КОММЕНТАРИЙ ЧЕРЕЗ ФОРМУ ВВОДА
    
    renderForms();

    const buttonElement = document.querySelector('button[class="add-form-button"]');
    const nameElement = document.querySelector('input[class="add-form-name"]');
    const textElement = document.querySelector('textarea[class="add-form-text"]');
    const addFormElement = document.querySelector('div[class="add-form"]');
    const addFormProgressElement = document.querySelector('div[class="add-form-progress"]');

    checkInput({ buttonElement, nameElement, textElement });

    addComment ({ buttonElement, addFormElement, addFormProgressElement, nameElement, textElement, comments, fetchAndRenderComments });

}

globalAdd();