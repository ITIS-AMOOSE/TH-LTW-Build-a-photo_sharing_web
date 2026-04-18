const SERVER_URL = "http://localhost:8088";

const fetchModel = (url) =>
  fetch(SERVER_URL + url).then((response) => {
    if (!response.ok) {
      throw new Error("HTTP error " + response.status);
    }
    return response.json();
  });

export default fetchModel;