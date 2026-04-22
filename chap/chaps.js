const container = document.getElementById("btn-container");
const readBtn = document.getElementById("readBtn");
const readBtnText = document.getElementById("readBtnT");
const resetBtn = document.getElementById("resetBtn");

const param = new URLSearchParams(window.location.search);
const nvl = param.get("nvl");
const reading_key = param.get("readingKey");
const chapters_len = param.get("chapters");
const title = param.get("nvlTitle");
const htmlBtnId = param.get("htmlBtnId");
let chap;
if (typeof Capacitor !== "undefined" && Capacitor.Plugins?.Preferences) {
  const { value } = await Capacitor.Plugins.Preferences.get({
    key: reading_key,
  });
  chap = value ? JSON.parse(value) : "1";
} else {
  chap = localStorage.getItem(reading_key) || "1";
}

document.getElementById("title").textContent = title;

readBtnText.textContent = `Read: ${chap}`;

document.getElementById("readBtn").addEventListener("click", async function () {
  window.location.href = `../reader/reader.html?nvl=${nvl}&chapter=${chap}&chapters=${chapters_len}&readingKey=${reading_key}&htmlBtnId=${htmlBtnId}&selectedChapter=${chap}&nvlTitle=${title}`;
});

for (let i = chapters_len; i > 0; i--) {
  const btn = document.createElement("button");
  btn.innerText = `${i}`;
  btn.classList = "chapBtn";

  btn.addEventListener("click", () => {
    window.location.href = `../reader/reader.html?nvl=${nvl}&selectedChapter=${i}&chapters=${chapters_len}&chapter=${chap}&readingKey=${reading_key}&htmlBtnId=${htmlBtnId}&nvlTitle=${title}`;
  });

  container.appendChild(btn);
}

resetBtn.addEventListener("click", async () => {
  if (typeof Capacitor !== "undefined" && Capacitor.Plugins?.Preferences) {
    await Capacitor.Plugins.Preferences.set({
      key: reading_key,
      value: JSON.stringify(1),
    });
  } else {
    localStorage.setItem(reading_key, 1);
  }
  window.location.reload();
});

[
  document.getElementById("backBtn"),
  document.getElementById("backBtn-r"),
].forEach((btn) => {
  btn.addEventListener("click", () => {
    window.location.href = `../index.html`;
  });
});
