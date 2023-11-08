const indexModule = (() => {
  usersModule.fetchAllUsers()

  const searchButton = document.querySelector('#search-button')

  const handleClick = (e) => {
    e.preventDefault()

    searchModule.searchUsers()
  }

  searchButton.addEventListener('click', handleClick)
})()
