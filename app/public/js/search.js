const searchModule = (() => {
  const BASE_PATH = 'http://localhost:3000/api/v1/search'

  return {
    searchUsers: async () => {
      const query = document.querySelector('#search').value
      const listWrapper = document.querySelector('#users-list')
      let body = ''

      const res = await fetch(`${BASE_PATH}?q=${query}`)
      // コンテンツがない場合
      if (res.status === 404) {
        const resJson = await res.json()
        listWrapper.innerHTML = `<p>${resJson.error}</p>`
        // フェッチが成功した場合
      } else if (res.ok) {
        const users = await res.json()

        users.map((user) => {
          body += `<tr>
                      <td>${user.id}</td>
                      <td><a href='user-info.html?uid=${users.id}'>${user.name}</a></td>
                      <td>${user.profile}</td>
                      <td>${user.date_of_birth}</td>
                      <td>${user.created_at}</td>
                      <td>${user.updated_at}</td>
                      <td><a href='edit.html?uid=${user.id}'>編集</a></td>
                    </tr>`

          listWrapper.innerHTML = body
        })
      } else {
        const resJson = await res.json()
        alert(resJson.error)
      }
    },
  }
})()
