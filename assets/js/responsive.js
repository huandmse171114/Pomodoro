const menuBar = document.querySelector(".menu-bar");
const settingList = document.querySelector(".setting-list");
const backBtn = document.querySelector(".back-btn");

menuBar.addEventListener("click", () => {
    menuBar.style.opacity = "0";
    settingList.style.transform = "translateY(0)";
    settingList.style.transition = "all 0.5s linear";
})

backBtn.addEventListener("click", () => {
    menuBar.style.opacity = "1";
    settingList.style.transform = "translateX(140%)";
})