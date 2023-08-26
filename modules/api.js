export function getComments() {
    return fetch("https://wedev-api.sky.pro/api/v1/:sveta-plaksina/comments",      // FETCH GET - получение комментов с сервера
    {
      method: "GET",
    })
    .then((response) => {
      return response.json();
    })
}

export function postApi({ name, text }) {
    return fetch("https://wedev-api.sky.pro/api/v1/:sveta-plaksina/comments",    // FETCH POST - отправляем коммент на сервер
    {
      method: "POST",
      body: JSON.stringify({
        name: name
              .replaceAll("&", "&amp;")
              .replaceAll("<", "&lt;")
              .replaceAll(">", "&gt;")
              .replaceAll('"', "&quot;"),
        text: text
              .replaceAll("&", "&amp;")
              .replaceAll("<", "&lt;")
              .replaceAll(">", "&gt;")
              .replaceAll('"', "&quot;"),
        isLiked:	false,
        likes: 0,
        forceError: true,
      }),
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