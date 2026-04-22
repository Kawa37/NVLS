const saveBtn = document.getElementById("saveBtn");
const nextBtn = document.getElementById("nextBtn");
const preBtn = document.getElementById("preBtn");
const backBtnL = document.getElementById("backBtn-l");
const backBtnR = document.getElementById("backBtn-r");
const homeBtn = document.getElementById("homeBtn");

const param = new URLSearchParams(window.location.search);
const chapter = param.get("chapter");
console.log('chapter: ',chapter)
const nvlName = param.get("nvl");
const chapters = param.get("chapters");
const htmlBtnId = param.get("htmlBtnId");
const readingKey = param.get("readingKey");
const title = param.get("nvlTitle");
const selectedChapter = param.get("selectedChapter");

backBtnL.addEventListener("click", async () => {
  await saveScrollPos();
  window.location.href = `../chaps/chaps.html?nvl=${nvlName}&chapters=${chapters}&nvlTitle=${title}&readingKey=${readingKey}&htmlBtnId=${htmlBtnId}&`;
});
backBtnR.addEventListener("click", async () => {
  await saveScrollPos();
  window.location.href = `../chaps/chaps.html?nvl=${nvlName}&chapters=${chapters}&nvlTitle=${title}&readingKey=${readingKey}&htmlBtnId=${htmlBtnId}&`;
});

saveBtn.addEventListener("click", async function () {
  if (typeof Capacitor !== "undefined" && Capacitor.Plugins?.Preferences) {
    await Capacitor.Plugins.Preferences.set({
      key: readingKey,
      value: JSON.stringify(Number(selectedChapter) + 1),
    });
    console.log("saved");
  } else {
    localStorage.setItem(
      (key = readingKey),
      (value = Number(selectedChapter) + 1),
    );
  }
  saveBtn.innerHTML = `<i class="fa-solid fa-bookmark"></i>`;
  console.log("chapter saved");
});

const saveScrollPos = async () => {
  const scrollKey = `scroll_${nvlName}_${selectedChapter}`;
  const scrollValue = window.scrollY.toString();

  if (typeof Capacitor !== "undefined" && Capacitor.Plugins?.Preferences) {
    await Capacitor.Plugins.Preferences.set({
      key: scrollKey,
      value: scrollValue,
    });
  } else {
    localStorage.setItem(scrollKey, scrollValue);
  }
};

nextBtn.addEventListener("click", async () => {
  await saveScrollPos();
  if (Number(selectedChapter) + 1 <= Number(chapters)) {
    window.location.href = `reader.html?nvl=${nvlName}&chapter=${chapter}&chapters=${chapters}&nvlTitle=${title}&htmlBtnId=${htmlBtnId}&readingKey=${readingKey}&selectedChapter=${String(Number(selectedChapter) + 1)}`;
  }
});

preBtn.addEventListener("click", async () => {
  await saveScrollPos();
  if (Number(selectedChapter) > 1) {
    window.location.href = `reader.html?nvl=${nvlName}&chapter=${chapter}&chapters=${chapters}&nvlTitle=${title}&htmlBtnId=${htmlBtnId}&readingKey=${readingKey}&selectedChapter=${String(Number(selectedChapter) - 1)}`;
  }
});

homeBtn.addEventListener("click", async () => {
  await saveScrollPos();
  window.location.href = `../index.html`;
});

const loadChapter = async () => {
  document.getElementById("chapter-title").innerHTML =
    `<span class="chapter-title-span">Chapter ${selectedChapter}</span>`;

  try {
    // 2. Fetch the specific file
    const response = await fetch(`../nvls/${nvlName}/${selectedChapter}.txt`);
    if (!response.ok) throw new Error("Datei nicht gefunden");

    const text = await response.text();
    document.getElementById("content").textContent = text;
  } catch (err) {
    document.getElementById("content").innerText = "Fehler beim Laden.";
  }

  if (Number(selectedChapter) == Number(chapter) - 1) {
    saveBtn.innerHTML = `<i class="fa-solid fa-bookmark"></i>`;
  }

  const scrollKey = `scroll_${nvlName}_${selectedChapter}`;
  let scrollPos;

  if (typeof Capacitor !== "undefined" && Capacitor.Plugins?.Preferences) {
    const { value } = await Capacitor.Plugins.Preferences.get({
      key: scrollKey,
    });
    scrollPos = value;
  } else {
    scrollPos = localStorage.getItem(scrollKey);
  }

  if (scrollPos) {
    setTimeout(() => {
      window.scrollTo(0, parseInt(scrollPos));
    }, 100);
  }
};

loadChapter();
