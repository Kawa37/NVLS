const container = document.getElementById("btnContainer");
const lightBtn = document.getElementById("lightBtn");
const statusEl = document.getElementById("status");
const para = document.createElement("p");
let chap2read = [];
let totalChaps = 0;
let chaptersRead = 0;

let nvlsData = {};
const getNvlsData = async () => {
  try {
    const response = await fetch("data.json");
    if (!response.ok) throw new Error("response is not ok");
    nvlsData = await response.json();
  } catch (e) {
    console.log("couldn't fetch data");
  }
};

if (typeof Capacitor !== "undefined" && Capacitor.Plugins?.App) {
  Capacitor.Plugins.App.addListener("backButton", () => {
    const path = window.location.pathname;

    if (path.includes("index.html") || path.endsWith("/")) {
      Capacitor.Plugins.App.exitApp();
    } else if (path.includes("reader.html")) {
      window.location.href = "../chaps/chaps.html" + window.location.search;
    } else if (path.includes("chaps.html")) {
      window.location.href = "../index.html";
    } else {
      window.history.back();
    }
  });
}

const statusText = async () => {
  if (Object.entries(nvlsData).length !== 0) {
    for (const [novel, content] of Object.entries(nvlsData)) {
      if (typeof Capacitor !== "undefined" && Capacitor.Plugins?.Preferences) {
        const { value } = await Capacitor.Plugins.Preferences.get({
          key: content.readingKey,
        });

        chap2read.push(
          `<span class="novel-title">${content.title}: </span> <span class="novel-number"> ${value ? JSON.parse(value) : "1"}</span>`,
        );
        chaptersRead += value ? Number(JSON.parse(value)) : 1;
      } else {
        const chapterReading = localStorage.getItem(content.readingKey) || 1;

        chap2read.push(
          `<span class="novel-title">${content.title}: </span> <span class="novel-number"> ${chapterReading}</span>`,
        );
        chaptersRead += Number(chapterReading);
      }
    }
  }
};

const addBtns = async () => {
  if (Object.entries(nvlsData).length == 0) {
    const msg = document.createElement("p");
    msg.textContent = "No Novels";
    container.appendChild(msg);
  } else {
    let xo = 0;
    for (const [novel, content] of Object.entries(nvlsData)) {
      const btn = document.createElement("button");
      btn.innerHTML = chap2read[xo];
      btn.id = content.htmlBtnId;
      btn.addEventListener("click", async () => {
        window.location.href = `./chaps/chaps.html?nvl=${novel}&chapters=${content.chapters}&nvlTitle=${content.title}&htmlBtnId=${content.htmlBtnId}&readingKey=${content.readingKey}`;
      });
      container.appendChild(btn);
      xo++;
      totalChaps += content.chapters;
    }
  }
  statusEl.innerHTML = `${chaptersRead}/${totalChaps}\n<span>${(chaptersRead/totalChaps*100).toFixed(2)}<i class="fa-solid fa-percent"></i></span>`;
};

const main = async () => {
  await getNvlsData();
  await statusText();
  await addBtns();
};

main();
