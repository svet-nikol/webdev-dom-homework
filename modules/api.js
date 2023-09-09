const baseUrl = 'https://wedev-api.sky.pro/api/v2/:sveta-plaksina';
const userUrl = 'https://wedev-api.sky.pro/api/user';

export let token;
export const setToken = (newToken) => {
  token = newToken
};


export function getComments() {
    return fetch(`${baseUrl}/comments`,      // FETCH GET - получение комментов с сервера
    {
      method: "GET",
    })
    .then((response) => {
      return response.json();
    })
}

export function postApi({ text }) {
    return fetch(`${baseUrl}/comments`,    //  FETCH POST - отправляем коммент на сервер   
    {
      method: "POST",
      body: JSON.stringify({
        text: text
              .replaceAll("&", "&amp;")
              .replaceAll("<", "&lt;")
              .replaceAll(">", "&gt;")
              .replaceAll('"', "&quot;"),
        isLiked:	false,
        likes: 0,
      }),
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      if (response.status === 500) {
        throw new Error("Сервер сломался");
      }
      if (response.status === 400) {
        throw new Error("Плохой запрос");
      }
      return response.json();
    })
}

export function login({login, password}) {
  return fetch(`${userUrl}/login`, {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
    }),
  })
  .then((response) => {
    if (response.status === 400) {
      throw new Error("Плохой запрос");
    };
    return response.json();
  });
}

export function registration({login, name, password}) {
  return fetch(userUrl, {
    method: "POST",
    body: JSON.stringify({
      login,
      name,
      password,
    }),
  })
  .then((response) => {
    if (response.status === 400) {
      throw new Error("Плохой запрос");
    };
    return response.json();
  });
}

export function deleteCommentApi({ id }) {
  return fetch(`${baseUrl}/comments/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },    
  })
  .then((response) => {
    if (response.status === 401) {
      throw new Error("Нет авторизации");
    }
    return response.json();
  });
}

export function switchLike({ id }) {
  return fetch(`${baseUrl}/comments/${id}/toggle-like`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },    
  })
  .then((response) => {
    console.log(response);
    if (response.status === 401) {
      throw new Error("Нет авторизации");
    }    
    return response.json();
  });
}