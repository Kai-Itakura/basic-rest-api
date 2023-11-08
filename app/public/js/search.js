const searchModule = (() => {
  const BASE_PATH = 'http://localhost:3000/api/v1/search'

  return {
    searchUsers: async () => {
      const query = document.querySelector('#search').value

      const res = await fetch(`${BASE_PATH}?q=${query}`)
      const users = await res.json()

      let body = ''
      users.map((user) => {
        body += `<tr>
                  <td>${user.id}</td>
                  <td>${user.name}</td>
                  <td>${user.profile}</td>
                  <td>${user.date_of_birth}</td>
                  <td>${user.created_at}</td>
                  <td>${user.updated_at}</td>
                </tr>`

        document.querySelector('#users-list').innerHTML = body
      })
    },
  }
})()
