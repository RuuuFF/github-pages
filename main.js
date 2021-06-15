const DOM = {
  form: document.getElementById('form'),
  search: document.getElementById('search'),
  main: document.getElementById('main'),
  
  createUserCard(user) {
    const cardHTML = `
      <div class="card">
        <div>
          <img src="${user.avatar_url}" alt="${user.name !== null ? user.name : user.login}" class="avatar">
        </div>
  
        <div class="user-info">
          <h2>${user.name == null ? user.login : user.name}</h2>
          <p>${user.bio}</p>
  
          <ul>
            <li>${user.followers} <strong>Followers</strong></li>
            <li>${user.following} <strong>Following</strong></li>
            <li>${user.public_repos} <strong>Repos</strong></li>
          </ul>
  
          <div id="repos"></div>
        </div>
      </div>
    `
    DOM.main.innerHTML = cardHTML
  },
  
  addReposToCard(repos) {
    const reposEl = document.getElementById('repos')

    repos.slice(0, 10).forEach(repo => {
      const repoEl = document.createElement('a')
      repoEl.classList.add('repo')
      repoEl.href = repo.html_url
      repoEl.target = '_blank'
      repoEl.innerText = repo.name

      reposEl.appendChild(repoEl)
    })
  },

  createErrorCard(message) {
    const cardHTML = `
      <div class="card">
        <h1 style="text-align: center; width: 100%;">${message}</h1>
      </div>
    `
    DOM.main.innerHTML = cardHTML
  }
}

const GitHubAPI = {
  APIURL: 'https://api.github.com/users/',

  async getUser(username) {
    try {
      const { data } = await axios(GitHubAPI.APIURL + username)
  
      DOM.createUserCard(data)
      GitHubAPI.getRepos(username)
    } catch(error) {
      if (error.response.status == 404) {
        DOM.createErrorCard(`No profile with this username`)
      }
    }
  },

  async getRepos(username) {
    try {
      const { data } = await axios(GitHubAPI.APIURL + username + '/repos?sort=created')
  
      DOM.addReposToCard(data)
    } catch(error) {
      if (error.response.status == 404) {
        DOM.createErrorCard(`Problem fetching repos`)
      }
    }
  }
}

DOM.form.addEventListener('submit', event => {
  event.preventDefault()

  const user = DOM.search.value

  if (user) {
    GitHubAPI.getUser(user)
    DOM.search.value = ''
  }
})