
const indexContainerElement = document.querySelector('div[class="container"]');
const ulElement = document.querySelector('ul[class="comments"]');
const ulProgressElement = document.querySelector('div[class="comments-progress"]');
const addFormProgressElement = document.querySelector('div[class="add-form-progress"]');




// СТРУКТУРА ХРАНЕНИЯ ДАННЫХ - МАССИВ ОБЪЕКТОВ

let comments = [];       // объекты получаем с сервера по API в функции fetchAndRenderComments 



// FETCH GET - получение комментов с сервера

const fetchAndRenderComments = () => {
  return fetch("https://wedev-api.sky.pro/api/v1/:sveta-plaksina/comments",      // FETCH GET - получение комментов с сервера
      {
        method: "GET",
      }).then((response) => {
        return response.json();
      }).then((responseData) => {
        comments = responseData.comments;
        renderComments();
      });
  };


const initGetComments = () => {          // подождите, комментарии загружаются при первой загрузке страницы
  ulElement.style.display = 'none';
  ulProgressElement.style.display = 'block';
  fetchAndRenderComments()
  .then((data) => {
    ulElement.style.display = 'flex';
    ulProgressElement.style.display = 'none';
  })
  .catch((error) => {
    ulElement.style.display = 'flex';
    ulProgressElement.style.display = 'none';
    alert("Кажется, у вас сломался интернет, попробуйте позже обновить страницу...");
    console.warn(error);
  }); 
}
initGetComments();



// ЛАЙК КОММЕНТАРИЯ                  

const initLikeComments = () => {       // объявление функции добавления/удаления лайка(нажатие на сердечко)
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

      renderComments();

    })
  }
};


        // РЕПЛАЙ НА КОММЕНТАРИЙ

  function initReplyComment() {         // объявление функции ответа на комментарий с цитированием автора и текста

  const listLiItems = document.querySelectorAll('.comment');
  const textElement = document.querySelector('textarea[class="add-form-text"]');

    for (let liItem of listLiItems) {
        liItem.addEventListener("click", () => {
        let indexLiItem = liItem.dataset.index;
        let replyComment = `QUOTE_BEGIN ${comments[indexLiItem].author.name}:\n${comments[indexLiItem].text} QUOTE_END \n`;
        textElement.value = replyComment;

        // renderComments();

        })
    }
  }

  // initReplyComment();  

// РЕНДЕРИНГ СТРАНИЦЫ

const renderComments = () => {         // объявление функции рендеринга

  const commentsHTML = comments.map((comment, ind) => {

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
  // ulElement.innerHTML = commentsHTML;
  indexContainerElement.innerHTML = `<ul class="comments">${commentsHTML}</ul>
  <div class="delete-form">
    <button class="delete-form-button">Удалить последний комментарий</button>
  </div>
  <div class="add-form">
    <input type="text" class="add-form-name" placeholder="Введите ваше имя" />
    <textarea type="textarea" class="add-form-text" placeholder="Введите ваш коментарий" rows="4"></textarea>
    <div class="add-form-row">
      <button class="add-form-button">Написать</button>
    </div>
  </div>`;

  const buttonElement = document.querySelector('button[class="add-form-button"]');
  const nameElement = document.querySelector('input[class="add-form-name"]');
  const textElement = document.querySelector('textarea[class="add-form-text"]');
  const addFormElement = document.querySelector('div[class="add-form"]');
  
//   const listLiItems = document.querySelectorAll('.comment');


  initLikeComments();           // вызов функции добавления/удаления лайка(нажатие на сердечко)



  initReplyComment();           // вызов функции ответа на комментарий с цитированием автора и текста



    // ПЕРЕКРАСКА КНОПКИ "НАПИСАТЬ" В ФОРМЕ ВВОДА КОММЕНТАРИЯ ПОСЛЕ НАЧАЛА ВВОДА В ПОЛЕ ИМЕНИ И ТЕКСТА

    buttonElement.className = 'error-add-form-button'; // сбрасываю стиль кнопки "Написать" на серый, чтобы было понятно,
    // что без заполнения полей Имя и Комментарий отправить форму нельзя

    let nameElementCheck = false;          // для проверки событий пользователь начинает печать и в поле Имя,
    let textElementCheck = false;          // и в поле Комментарий ввожу булевые переменные

    function handleInputs() {              // объявление функции, которая перекрашивает кнопку "Написать" в зеленый цвет
      if (nameElementCheck && textElementCheck) {      // ввод и в Имя и в текст произошел
        buttonElement.className = 'add-form-button';   // перекрашиваем кнопку
      }
    }

    nameElement.addEventListener("input", () => {   // вызов функции перекраски "Написать" в зеленый цвет
      nameElementCheck = true;
      handleInputs();
    });

    textElement.addEventListener("input", () => {   // вызов функции перекраски "Написать" в зеленый цвет
      textElementCheck = true;
      handleInputs();
    });





    // ДОБАВЛЕНИЕ НОВОГО КОММЕНТАРИЙ ЧЕРЕЗ ФОРМУ ВВОДА

    let buttonCheck = false;  // для проверки событий нажата либо кнопка "Написать",
    let enterCheck = false;   // либо кнопка "Enter" ввожу переменные, со значением по умолчанию

    function handleAddButtons() {          // объявление функции добавления комментария

        


      if (buttonCheck || enterCheck) {  // клик либо на кнопку "Написать", либо на "Enter" произошел
        if (nameElement.value === '' || textElement.value === '') { // если имя или текст незаполнены, но кнопка "Написать" или "Enter" нажата,
          buttonElement.className = 'error-add-form-button';        // то элемент не добавлять и кнопку "Написать" покрасить в серый цвет
          return;
        }


        addFormElement.style.display = 'none';
        addFormProgressElement.style.display = 'block'


        // FETCH POST - добавление коммента на страницу через отправку по API на сервер
        
        function postComment() {
          fetch("https://wedev-api.sky.pro/api/v1/:sveta-plaksina/comments",    // FETCH POST - отправляем коммент на сервер
          {
            method: "POST",
            body: JSON.stringify({
              name: nameElement.value
                    .replaceAll("&", "&amp;")
                    .replaceAll("<", "&lt;")
                    .replaceAll(">", "&gt;")
                    .replaceAll('"', "&quot;"),
              text: textElement.value
                    .replaceAll("&", "&amp;")
                    .replaceAll("<", "&lt;")
                    .replaceAll(">", "&gt;")
                    .replaceAll('"', "&quot;"),
              isLiked:	false,
              likes: 0,
              forceError: true,
            }),
          }).then((response) => {
            if (response.status === 500) {
              throw new Error("Сервер сломался");
            }
            if (response.status === 400) {
              throw new Error("Плохой запрос");
            }
            return response.json();
          }).then((responseData) => {
            comments = responseData.comments;
          }).then(() => {
            return fetchAndRenderComments();                          // FETCH GET - получение комментов с сервера и их рендеринг
          }).then((data) => {
            addFormProgressElement.style.display = 'none';
            addFormElement.style.display = 'flex';

            nameElement.value = '';           // возвращаем начальные значения полям формы ввода
            textElement.value = '';
            buttonElement.className = 'error-add-form-button';
            nameElementCheck = false;
            textElementCheck = false;
          }).catch((error, typeError) => {
            addFormProgressElement.style.display = 'none';
            addFormElement.style.display = 'flex';
            if (error.message === "Плохой запрос") {
              alert("Имя и комментарий должны быть не короче 3 символов");
              return;
            }
            if (error.message === "Сервер сломался") {
              postComment();
            }
            else {
              alert("Кажется, у вас сломался интернет, попробуйте позже");
            }
            console.warn(error);
          });
        }

      postComment();

      };
    };

    buttonElement.addEventListener("click", () => {   // вызов функции добавления комментария по клику на кнопку "Написать"
      buttonCheck = true;
      handleAddButtons();

    });

    document.addEventListener("keyup", (event) => {   // вызов функции добавления комментария по клику на кнопку "Enter"
      if (event.key === 'Enter') {
        enterCheck = true;
        handleAddButtons();
      }
    });

      // функционал удаления последнего комментария
    let buttonDelete = document.querySelector('button[class="delete-form-button"]');
    buttonDelete.addEventListener("click", () => {
      let lis = document.querySelectorAll('.comment');  // создаем коллекцию/псевдомассив из элементов с классом '.comment'
      let liDelete = lis[lis.length - 1];  // определяем элемент для удаления по индексу последнего в коллекции
      liDelete.parentNode.removeChild(liDelete); // вызываем метод удаления потомка коллекции - элемента для удаления
    });


};