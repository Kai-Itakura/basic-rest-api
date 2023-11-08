const usersModule = (() => {
  const BASE_PATH = 'http://localhost:3000/api/v1/users'

  return {
    fetchAllUsers: async () => {
      const res = await fetch(BASE_PATH)
      const users = await res.json()

      users.map((user) => {
        const body = `<tr>
                        <td>${user.id}</td>
                        <td>${user.name}</td>
                        <td>${user.profile}</td>
                        <td>${user.date_of_birth}</td>
                        <td>${user.created_at}</td>
                        <td>${user.updated_at}</td>
                      </tr>`

        document.querySelector('#users-list').insertAdjacentHTML('beforeend', body)
      })
    },
  }
})()
