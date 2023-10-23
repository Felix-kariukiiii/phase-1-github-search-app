document.addEventListener("DOMContentLoaded", () => {
    // Selecting elements from the DOM
    const searchForm = document.getElementById("github-form");
    const searchInput = document.getElementById("search");
    const userList = document.getElementById("user-list");
    const reposList = document.getElementById("repos-list");

    // Event listener for the search form submission
    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const searchQuery = searchInput.value;

        // Clear previous search results
        userList.innerHTML = "";
        reposList.innerHTML = "";

        // Search for GitHub users
        fetch(`https://api.github.com/search/users?q=${searchQuery}`, {
            headers: {
                Accept: "application/vnd.github.v3+json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                // Display user search results
                data.items.forEach((user) => {
                    const userItem = document.createElement("li");
                    userItem.innerHTML = `
                        <img src="${user.avatar_url}" alt="${user.login}">
                        <a href="${user.html_url}" target="_blank">${user.login}</a>
                    `;
                    userItem.classList.add("user-item");
                    userItem.addEventListener("click", () => {
                        // When a user is clicked, fetch and display their repositories
                        fetch(user.repos_url)
                            .then((response) => response.json())
                            .then((repos) => {
                                reposList.innerHTML = "";
                                repos.forEach((repo) => {
                                    const repoItem = document.createElement("li");
                                    repoItem.innerHTML = `
                                        <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                                    `;
                                    reposList.appendChild(repoItem);
                                });
                            });
                    });
                    userList.appendChild(userItem);
                });
            })
            .catch((error) => {
                console.error("Error fetching data: ", error);
            });
    });
});