// Variables

const searchBtn = document.querySelector(".btn");
const searchInp = document.querySelector(".search-input");
const container = document.querySelector(".container-main");
const overlay = document.querySelector(".overlay");
const menu = document.querySelector(".fa-bars");
const main = document.querySelector(".main");
const notificationCont = document.querySelector(".notifications-cont");
const notification = document.querySelector(".fa-bell");
const notifications = document.querySelector(".notifications");
const apiKey = "AIzaSyCNJoTAsZVT4y2_ssn1wp_Yz2gWNDDvP90"; // Replace with your actual YouTube API key
const apiUrl = `https://www.googleapis.com/youtube/v3/search/?part=snippet&type=video&key=${apiKey}&maxResults=26&videoEmbeddable=true&videoLicense=youtube&safeSearch=strict&regionCode=EG&q=`;
let searched = "";
const sidebar = document.querySelector(".sidebar");
const categories = document.querySelector(".categories");
const categoriesList = [
  "javascript",
  "ReactJs",
  "flutter",
  "Sheikh",
  "Al Ahly Fc",
];

// Event Listeners

// when click in it it change the icon an open the notification list
notification.addEventListener("click", (e) => {
  e.preventDefault();
  notification.classList.toggle("fa-solid");
  notifications.classList.toggle("active");
});
// Generate the videos and append it to the page
const generateData = (data) => {
  container.innerHTML = "";
  data?.items.forEach((element) => {
    const { videoId } = element.id;
    container.insertAdjacentHTML(
      "beforeend",
      `
      <div class="video">
        <iframe
          src="https://www.youtube.com/embed/${videoId}"
          frameborder="0"
          allowfullscreen
        ></iframe>
      </div>
    `
    );
  });
};
const generateNotifications = (data) => {
  notification.innerHTML = "";
  data.items.forEach((el, i) => {
    const { thumbnails, title } = el.snippet;
    if (i <= 4)
      notificationCont.insertAdjacentHTML(
        "beforeend",
        `  <div class="notification-item">
    <div class="left"><img src="${thumbnails.default.url}" alt="" /></div>
    <div class="middle">
      <p>
      ${title}
       </p>
    </div>
    <div class="right">
      <img src="${thumbnails.high.url}" alt="" />
    </div>
  </div>`
      );
  });
};
// Fetch data from youtube api
const fetchData = (search) => {
  overlay.classList.add("active");
  fetch(apiUrl + search, {
    headers: {
      Authorization: apiKey,
    },
  })
    .then((response) => {
      console.log(response);
      if (response.ok) overlay.classList.remove("active");
      return response.json();
    })
    .then((data) => {
      // Handle the API response data
      generateData(data);
    })
    .catch((error) => {
      // Handle errors
      console.error("Error fetching data:", error);
      overlay.classList.remove("active");
    });
};

(function createCategories() {
  categoriesList.forEach((category) =>
    categories.insertAdjacentHTML(
      "beforeend",
      `<span class="category">${category}</span>`
    )
  );
})();
categories.addEventListener("click", (e) => {
  const target = e.target.closest(".category");
  categories.querySelectorAll(".category").forEach((el) => {
    if (el !== target) el.classList.remove("active");
  });
  target.classList.add("active");
  if (target) fetchData(target.textContent);
});
searchInp.addEventListener("change", (e) => {
  searched = e.target.value.trim(); // Trim whitespace from the input value
});
menu.addEventListener("click", (e) => {
  e.preventDefault();
  sidebar.classList.toggle("active");
  main.classList.toggle("active");
});
searchBtn.addEventListener("click", (e) => {
  overlay.classList.add("active");
  e.preventDefault();
  fetch(apiUrl + searchInp.value, {
    headers: {
      Authorization: apiKey,
    },
  })
    .then((response) => {
      console.log(response);
      if (response.ok) overlay.classList.remove("active");
      return response.json();
    })
    .then((data) => {
      generateData(data);
    })
    .catch((error) => {
      // Handle errors
      console.error("Error fetching data:", error);
      overlay.classList.remove("active");
    });
  searchInp.value = "";
});

// Function (IIEF) immediately Called when page works for the only first time or every time page reloaded
(function () {
  overlay.classList.add("active");
  fetch(apiUrl + "quran", {
    headers: {
      Authorization: apiKey,
    },
  })
    .then((response) => {
      if (response.ok) overlay.classList.remove("active");
      return response.json();
    })
    .then((data) => {
      // Handle the API response data
      generateData(data);
      generateNotifications(data);
    })
    .catch((error) => {
      // Handle errors
      console.error("Error fetching data:", error);
      overlay.classList.remove("active");
    });
})();

// Other Actions

// Select First category and make it active
document.querySelector(".category").classList.add("active");
