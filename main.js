import { getComments } from "./modules/api.js";
import { renderComments, renderForms } from "./modules/render.js";
import { checkInput, addComment, initLoaderComments } from "./modules/actions.js";
import { initRenderLoginForm } from "./modules/renderLogin.js";
export { fetchAndRenderComments, globalAdd };



let comments = [];        

function fetchAndRenderComments() {   // ЗАГРУЗКА С СЕРВЕРА И РЕНДЕР ВСЕХ КОММЕНТАРИЕВ
      initLoaderComments();
      getComments().then((responseData) => {
      comments = responseData.comments;
      renderComments({ comments });
      return true;
    })
    .catch((error) => {
      alert("Кажется, у вас сломался интернет, попробуйте позже обновить страницу...");
      console.warn(error);
    }); 
}

fetchAndRenderComments();

initRenderLoginForm();

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

// globalAdd();