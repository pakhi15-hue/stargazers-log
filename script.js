const repositoryList = document.querySelector("#repository-list");
const repositoryCount = document.querySelector("#repository-count");

function formatDate(dateString) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium"
  }).format(new Date(dateString));
}

function createRepositoryCard(event) {
  const repository = event.repo;
  const card = document.createElement("a");
  card.className = "repository";
  card.href = repository.html_url;
  card.target = "_blank";
  card.rel = "noreferrer";

  const topline = document.createElement("div");
  topline.className = "repository-topline";

  const name = document.createElement("h3");
  name.className = "repository-name";
  name.textContent = repository.name;

  const date = document.createElement("time");
  date.className = "repository-date";
  date.dateTime = event.created_at;
  date.textContent = formatDate(event.created_at);

  const description = document.createElement("p");
  description.className = "repository-description";
  description.textContent = repository.description;

  const metadata = document.createElement("div");
  metadata.className = "repository-meta";
  metadata.innerHTML = `<span class="language">${repository.language}</span><span>${repository.stargazers_count.toLocaleString()} stars</span>`;

  topline.append(name, date);
  card.append(topline, description, metadata);
  return card;
}

async function renderRepositories() {
  try {
    const response = await fetch("events.json");
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const events = await response.json();
    repositoryList.replaceChildren(...events.map(createRepositoryCard));
    repositoryCount.textContent = `${events.length} saved`;
  } catch (error) {
    repositoryList.innerHTML = "<p class=\"status\">Unable to load the repository log right now.</p>";
    repositoryCount.textContent = "Unavailable";
    console.error(error);
  }
}

renderRepositories();