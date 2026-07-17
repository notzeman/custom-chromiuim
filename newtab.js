function updateClock() {
    const now = new Date();

    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");

    hours = hours % 12 || 12;

    document.getElementById("clock").textContent =
        `${hours}:${minutes}`;

    document.getElementById("date").textContent =
        now.toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });
}

updateClock();
setInterval(updateClock, 1000);

const saved = localStorage.getItem("wallpaper");
const layer = document.getElementById("wallpaper-layer");
if (saved) {
    layer.style.backgroundImage = `url("${saved}")`;
}
requestAnimationFrame(() => {
    requestAnimationFrame(() => {
        layer.classList.add("show");
    });
});

document.getElementById("wallpaper-btn").addEventListener("click", () => {
    document.getElementById("wallpaper-input").click();
});

document.getElementById("wallpaper-input").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
        const dataUrl = ev.target.result;
        layer.classList.remove("show");
        setTimeout(() => {
            layer.style.backgroundImage = `url("${dataUrl}")`;
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    layer.classList.add("show");
                });
            });
        }, 400);
        localStorage.setItem("wallpaper", dataUrl);
    };
    reader.readAsDataURL(file);
});

const weatherIcons = {
    sunny: '<path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z"/>',
    cloudy: '<path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>',
    rainy: '<path d="M7.38 21.01c.49.49 1.28.49 1.77 0l8.31-8.31c.39-.39.39-1.02 0-1.41L14.93 8.9c-.39-.39-1.02-.39-1.41 0L5.38 17.24c-.49.49-.49 1.28 0 1.77z"/><path d="M4.12 11.56l-2.42 2.42c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l2.42-2.42c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0z" opacity=".5"/><path d="M17.88 11.56l-2.42 2.42c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l2.42-2.42c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0z" opacity=".5"/>',
    snowy: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-.97 14.76l-.03.03-.03-.03v-2.38l-1.12.65-.7-.7 1.12-.65-1.12-.65.7-.7 1.12.65V9.97l-.03-.03.03-.03 1.06 1.06-1.06 1.06.71.71 1.06-1.06c.39.39.39 1.02 0 1.41l-1.06 1.06-.71-.71 1.06-1.06-1.06-1.06z" opacity=".6"/><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>',
    foggy: '<path d="M3 15.5h18v-2H3v2zm0 4h12v-2H3v2zm0-8h18v-2H3v2zm0-6v2h18v-2H3z" opacity=".8"/><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" opacity=".4"/>'
};

function getWeatherIcon(code) {
    const c = Number(code);
    if (c === 113) return weatherIcons.sunny;
    if (c >= 116 && c <= 122) return weatherIcons.cloudy;
    if (c === 143 || (c >= 248 && c <= 260)) return weatherIcons.foggy;
    if (c >= 176 && c <= 200) return weatherIcons.rainy;
    if ((c >= 227 && c <= 230) || (c >= 392 && c <= 400) || c === 622) return weatherIcons.snowy;
    if ((c >= 263 && c <= 389) || (c >= 455 && c <= 531) || (c >= 571 && c <= 620)) return weatherIcons.rainy;
    return weatherIcons.cloudy;
}

async function fetchWeather() {
    try {
        const res = await fetch("https://wttr.in/?format=j1");
        const data = await res.json();
        const curr = data.current_condition[0];
        const area = data.nearest_area[0];
        const temp = curr.temp_C;
        const code = curr.weatherCode;
        const location = area.areaName[0].value;

        document.getElementById("weather-icon").innerHTML = getWeatherIcon(code);
        document.getElementById("weather-temp").textContent = temp + "\u00B0C";
        document.getElementById("weather-location").textContent = location;
    } catch {
        document.getElementById("weather-icon").innerHTML = weatherIcons.cloudy;
        document.getElementById("weather-temp").textContent = "--\u00B0C";
        document.getElementById("weather-location").textContent = "--";
    }
}

fetchWeather();
setInterval(fetchWeather, 600000);

function faviconImg(url) {
    let domain;
    try { domain = new URL(url).hostname; } catch { domain = ""; }
    return `<img class="bookmark-icon" src="https://www.google.com/s2/favicons?domain=${domain}&sz=16"
         onerror="this.style.display='none'" alt="">`;
}

function makeBookmarkEl(node) {
    const pill = document.createElement("a");
    pill.className = "bookmark-pill";
    pill.href = node.url;
    pill.target = "_blank";
    pill.rel = "noopener";
    pill.innerHTML = `
        ${faviconImg(node.url)}
        <span class="bookmark-title">${node.title || node.url}</span>
        <span class="bookmark-trash" data-id="${node.id}">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
        </span>
    `;
    pill.querySelector(".bookmark-trash").addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = node.id;
        chrome.bookmarks.remove(id, () => {
            pill.remove();
            handleOverflow(document.getElementById("bookmarks-bar"));
        });
    });
    return pill;
}

function makeFolderEl(node) {
    const wrap = document.createElement("div");
    wrap.className = "bookmark-folder-wrap";

    const folder = document.createElement("div");
    folder.className = "bookmark-pill folder-pill";
    folder.innerHTML = `
        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
            <path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
        </svg>
        <span class="bookmark-title">${node.title}</span>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" class="dropdown-arrow">
            <path d="M7 10l5 5 5-5z"/>
        </svg>
    `;
    wrap.appendChild(folder);

    folder.addEventListener("click", (e) => {
        e.stopPropagation();
        const wasOpen = wrap.classList.contains("active");
        document.querySelectorAll(".bookmark-folder-wrap.active").forEach(el => el.classList.remove("active"));
        if (!wasOpen) wrap.classList.add("active");
    });

    const dropdown = document.createElement("div");
    dropdown.className = "bookmark-dropdown";

    for (const child of node.children) {
        if (!child.url) continue;
        const item = document.createElement("a");
        item.className = "dropdown-item";
        item.href = child.url;
        item.target = "_blank";
        item.rel = "noopener";
        item.innerHTML = `
            ${faviconImg(child.url)}
            <span>${child.title || child.url}</span>
            <span class="dropdown-trash" data-id="${child.id}">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
            </span>
        `;
        item.querySelector(".dropdown-trash").addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            chrome.bookmarks.remove(child.id, () => {
                item.remove();
            });
        });
        dropdown.appendChild(item);
    }

    if (dropdown.children.length > 0) {
        wrap.appendChild(dropdown);
    }
    return wrap;
}

function handleOverflow(container) {
    const items = [...container.children];
    const overflowItems = [];

    container.innerHTML = "";

    for (const el of items) {
        container.appendChild(el);
        if (container.scrollWidth > container.clientWidth) {
            container.removeChild(el);
            overflowItems.push(el);
        }
    }

    if (overflowItems.length === 0) return;

    const moreWrap = document.createElement("div");
    moreWrap.className = "bookmark-folder-wrap";

    const moreBtn = document.createElement("div");
    moreBtn.className = "bookmark-pill more-btn";
    moreBtn.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg>`;
    moreWrap.appendChild(moreBtn);

    const moreDropdown = document.createElement("div");
    moreDropdown.className = "bookmark-dropdown more-dropdown";

    for (const el of overflowItems) {
        if (el.classList.contains("bookmark-folder-wrap")) {
            const folderTrigger = el.querySelector(".folder-pill");
            const folderDropdown = el.querySelector(".bookmark-dropdown");
            if (folderDropdown) {
                const cloned = folderDropdown.cloneNode(true);
                const header = document.createElement("div");
                header.className = "dropdown-header";
                header.textContent = folderTrigger?.querySelector(".bookmark-title")?.textContent || "Folder";
                moreDropdown.appendChild(header);
                for (const child of cloned.children) {
                    moreDropdown.appendChild(child);
                }
            }
        } else {
            const trashEl = el.querySelector(".bookmark-trash");
            const id = trashEl?.getAttribute("data-id");
            const item = document.createElement("a");
            item.className = "dropdown-item";
            item.href = el.href;
            item.target = "_blank";
            item.rel = "noopener";
            const icon = el.querySelector(".bookmark-icon");
            item.innerHTML = `
                ${icon ? icon.outerHTML : ""}
                <span>${el.querySelector(".bookmark-title")?.textContent || el.textContent}</span>
                ${id ? `<span class="dropdown-trash" data-id="${id}">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                </span>` : ""}
            `;
            if (id) {
                item.querySelector(".dropdown-trash").addEventListener("click", (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    chrome.bookmarks.remove(id, () => {
                        item.remove();
                    });
                });
            }
            moreDropdown.appendChild(item);
        }
    }

    moreWrap.appendChild(moreDropdown);
    container.appendChild(moreWrap);

    moreBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const wasOpen = moreWrap.classList.contains("active");
        document.querySelectorAll(".bookmark-folder-wrap.active").forEach(el => el.classList.remove("active"));
        if (!wasOpen) moreWrap.classList.add("active");
    });
}

document.addEventListener("click", () => {
    document.querySelectorAll(".bookmark-folder-wrap.active").forEach(el => el.classList.remove("active"));
});

try {
    chrome.bookmarks.getTree((tree) => {
        const bar = tree[0].children.find(c => c.id === "1" || c.title === "Bookmarks Bar");
        if (!bar || !bar.children) return;

        const container = document.getElementById("bookmarks-bar");
        const all = [];

        for (const node of bar.children) {
            if (node.url && !node.url.startsWith("chrome://") && !node.url.startsWith("edge://") && !node.url.startsWith("about:")) {
                all.push(makeBookmarkEl(node));
            } else if (!node.url) {
                const folderEl = makeFolderEl(node);
                if (folderEl.querySelector(".bookmark-dropdown")) {
                    all.push(folderEl);
                }
            }
        }

        for (const el of all) {
            container.appendChild(el);
        }

        handleOverflow(container);
    });
} catch (e) {
    console.warn("Bookmarks API unavailable:", e);
}