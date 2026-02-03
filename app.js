const PLAYLIST_URL = "./playlist.json";

const stage = document.getElementById("stage");
const captionEl = document.getElementById("caption");

let slides = [];
let idx = -1;
let defaultDuration = 10;

async function loadPlaylist() {
  const res = await fetch(`${PLAYLIST_URL}?t=${Date.now()}`); // cache bust
  if (!res.ok) throw new Error(`Playlist fetch failed: ${res.status}`);
  const data = await res.json();
  slides = data.slides || [];
  defaultDuration = data.defaultDuration || 10;
}

function render(slide) {
  stage.innerHTML = "";

  if (slide.caption && slide.caption.trim()) {
    captionEl.style.display = "block";
    captionEl.textContent = slide.caption;
  } else {
    captionEl.style.display = "none";
  }

  const duration = Number(slide.duration || defaultDuration);

  const img = document.createElement("img");
  img.src = slide.src;
  img.alt = slide.caption || "";
  stage.appendChild(img);

  setTimeout(next, duration * 1000);
}

function next() {
  if (!slides.length) {
    stage.innerHTML = '<div style="color:#fff;font:20px system-ui">Playlist is empty</div>';
    return;
  }
  idx = (idx + 1) % slides.length;
  render(slides[idx]);
}

(async function start() {
  try {
    await loadPlaylist();
    next();
    setInterval(loadPlaylist, 10 * 60 * 1000); // reload playlist every 10 min
  } catch (e) {
    console.error(e);
    stage.innerHTML = '<div style="color:#fff;font:20px system-ui">Error loading playlist</div>';
  }
})();
