import { login, setToken, token } from "./api.js";
import { fetchAndRenderComments, globalAdd } from "../main.js";

export const initRenderLoginForm = () => {
    const containerFormsElement = document.querySelector('div[class="containerForms"]');
    containerFormsElement.innerHTML = `<p class="comment-header">Чтобы добавить комментарий,&nbsp;<span id="enter-link" style="text-decoration: underline; cursor: pointer">авторизуйтесь</span></p>`;
    const enterLinkElement = document.getElementById("enter-link");
    let enterLinkCheck = false;

    enterLinkElement.addEventListener("click", () => {
        enterLinkCheck = true;
        containerFormsElement.innerHTML = `    <div class="enter-form">
        <p class="enter-form-header"><b>Форма входа</b></p>
        <input type="text" class="enter-form-name" id="enter-form-login" placeholder="Введите логин" />
        <input type="text" class="enter-form-name" id="enter-form-password" placeholder="Введите пароль" />
        <div class="enter-form-row">
        <button class="enter-form-button" id="enter-form-button">Войти</button>
        <p class="enter-form-link id="enter-form-link">Зарегистрироваться</p>
        </div>
        </div>`;

        if (enterLinkCheck) {
            const enterFormButton = document.getElementById("enter-form-button");
            const loginInputElement = document.getElementById("enter-form-login");
            const passwordInputElement = document.getElementById("enter-form-password");
        
            enterFormButton.addEventListener("click", () => {
                login({
                    login: loginInputElement.value,
                    password: passwordInputElement.value,
                })
                .then((responseData) => {
                    console.log(token);
                    setToken(responseData.user.token);
                    console.log(token);
                })
                .then(() => {
                    fetchAndRenderComments();
                    globalAdd();
                });
            })
        }

    });







}