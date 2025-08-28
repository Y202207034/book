// Mock book data
const books = [
  { id: 1, title: "모래성", author: "한도윤", genre: ["소설", "드라마"], year: 2022, rating: 4.2 },
  { id: 2, title: "초보 개발자의 하루", author: "이지은", genre: ["IT", "에세이"], year: 2020, rating: 4.6 },
  { id: 3, title: "파란 바다의 기억", author: "김하늘", genre: ["로맨스"], year: 2018, rating: 4.0 },
  { id: 4, title: "데이터 구조와 알고리즘", author: "박정우", genre: ["IT", "교육"], year: 2023, rating: 4.8 },
  { id: 5, title: "우주 여행 가이드", author: "최유나", genre: ["SF", "과학"], year: 2019, rating: 4.1 },
  { id: 6, title: "도시의 미학", author: "오세진", genre: ["예술", "인문"], year: 2017, rating: 4.3 },
  { id: 7, title: "부엌에서 만나는 세계", author: "장미", genre: ["요리", "에세이"], year: 2021, rating: 4.4 },
  { id: 8, title: "겨울 숲", author: "정민호", genre: ["시", "문학"], year: 2015, rating: 3.9 },
  { id: 9, title: "디자인 씽킹", author: "윤소라", genre: ["디자인", "비즈니스"], year: 2016, rating: 4.5 },
  { id: 10, title: "여행자의 노트", author: "강준", genre: ["여행", "에세이"], year: 2014, rating: 4.0 },
  // Added categories: 게임, 자격증, 과학 세분화
  { id: 11, title: "게임 디자인 입문", author: "류현", genre: ["게임", "디자인"], year: 2019, rating: 4.2 },
  { id: 12, title: "e스포츠의 세계", author: "박성훈", genre: ["게임", "비즈니스"], year: 2021, rating: 4.1 },
  { id: 13, title: "과학의 현재", author: "노유진", genre: ["과학"], year: 2020, rating: 4.3 },
  { id: 14, title: "생활 과학 실험", author: "문지호", genre: ["과학", "교육"], year: 2018, rating: 4.0 },
  { id: 15, title: "자격증 한 번에 끝내기", author: "이강", genre: ["자격증", "교육"], year: 2022, rating: 4.6 },
  { id: 16, title: "정보처리기사 필수노트", author: "정연우", genre: ["자격증", "IT"], year: 2023, rating: 4.7 }
];

const recommendContainer = document.getElementById("recommend");
const rerollButton = document.getElementById("reroll");
const searchForm = document.getElementById("search-form");
const queryInput = document.getElementById("query");
const resultsContainer = document.getElementById("results");
const menuToggle = document.getElementById("menu-toggle");
const menuClose = document.getElementById("menu-close");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const categoryButtons = () => Array.from(document.querySelectorAll('.cat-btn'));
let currentCategory = "ALL";

function pickRandomBook() {
  const index = Math.floor(Math.random() * books.length);
  return books[index];
}

function renderTags(genres) {
  return genres.map(g => `<span class="tag">${g}</span>`).join("");
}

function renderRecommendation(book) {
  recommendContainer.innerHTML = `
    <div class="cover" aria-hidden="true">${book.title.slice(0,2)}</div>
    <div class="meta">
      <h3>${book.title}</h3>
      <div class="dim">${book.author} · ${book.year} · ★ ${book.rating}</div>
      <div class="tags" aria-label="장르">${renderTags(book.genre)}</div>
    </div>
  `;
}

function searchBooks(q) {
  if (!q) return [];
  const query = q.trim().toLowerCase();
  return books.filter(b => {
    const inTitle = b.title.toLowerCase().includes(query);
    const inAuthor = b.author.toLowerCase().includes(query);
    const inGenre = b.genre.some(g => g.toLowerCase().includes(query));
    return inTitle || inAuthor || inGenre;
  });
}

function renderResults(items) {
  if (!items.length) {
    resultsContainer.innerHTML = `<p class="dim">검색 결과가 없습니다.</p>`;
    return;
  }
  resultsContainer.innerHTML = items.map(b => `
    <article class="result-item" aria-label="검색 결과 아이템">
      <div class="cover" aria-hidden="true">${b.title.slice(0,2)}</div>
      <h4>${b.title}</h4>
      <div class="dim">${b.author} · ${b.year}</div>
      <div class="tags">${renderTags(b.genre)}</div>
    </article>
  `).join("");
}

function filterByCategory(items, category) {
  if (category === "ALL") return items;
  return items.filter(b => b.genre.includes(category));
}

function applyFilters() {
  const q = queryInput.value.trim();
  const base = q ? searchBooks(q) : books;
  const filtered = filterByCategory(base, currentCategory);
  renderResults(filtered);
}

// Initialize
const first = pickRandomBook();
renderRecommendation(first);

rerollButton.addEventListener("click", () => {
  renderRecommendation(pickRandomBook());
});

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  applyFilters();
});

// Instant search (optional UX)
queryInput.addEventListener("input", () => {
  if (queryInput.value.trim() === "" && currentCategory === "ALL") {
    resultsContainer.innerHTML = "";
    return;
  }
  applyFilters();
});

function openSidebar() {
  sidebar.classList.add('open');
  overlay.hidden = false;
  sidebar.setAttribute('aria-hidden', 'false');
  menuToggle.setAttribute('aria-expanded', 'true');
}
function closeSidebar() {
  sidebar.classList.remove('open');
  overlay.hidden = true;
  sidebar.setAttribute('aria-hidden', 'true');
  menuToggle.setAttribute('aria-expanded', 'false');
}

menuToggle.addEventListener('click', openSidebar);
menuClose.addEventListener('click', closeSidebar);
overlay.addEventListener('click', closeSidebar);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeSidebar();
});

document.addEventListener('click', (e) => {
  const btn = e.target.closest('.cat-btn');
  if (!btn) return;
  currentCategory = btn.dataset.category;
  categoryButtons().forEach(b => b.classList.toggle('active', b === btn));
  applyFilters();
  closeSidebar();
});

