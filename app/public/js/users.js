const usersModule = (() => {
  const BASE_URL = 'http://localhost:3000/api/v1/users'

  // ヘッダーの設定
  const headers = new Headers()
  headers.set('Content-Type', 'application/json')

  /**
   * レスポンスをフィールドに持つカスタムエラークラス
   * @extends {Error}
   * @param {string} message - エラーメッセージ
   * @param {Response} res - エラーに関連付けられたレスポンスオブジェクト
   */
  class ResponseError extends Error {
    constructor(message, res) {
      super(message)
      this.response = res
    }
  }

  /**
   * フェッチを実行しレスポンスをハンドル
   * @param {RequestInfo} path
   * @param {RequestInit} options
   * @returns {Response} レスポンス
   */
  const fetchFunc = async (path, options) => {
    const res = await fetch(path, options)
    if (!res.ok) {
      throw new ResponseError('Bad fetch response', res)
    }
    return res
  }

  return {
    fetchAllUsers: async () => {
      try {
        const res = await fetchFunc(BASE_URL)
        const users = await res.json()

        users.map((user) => {
          const body = `<tr>
                          <td>${user.id}</td>
                          <td><a href='user-info.html?uid=${users.id}'>${user.name}</a></td>
                          <td>${user.profile}</td>
                          <td>${user.date_of_birth}</td>
                          <td>${user.created_at}</td>
                          <td>${user.updated_at}</td>
                          <td><a href='edit.html?uid=${user.id}'>編集</a></td>
                        </tr>`

          document.querySelector('#users-list').insertAdjacentHTML('beforeend', body)
        })
      } catch (error) {
        const resJson = await error.response.json()
        alert(resJson.error)
      }
    },
    createUser: async () => {
      const name = document.querySelector('#name').value
      const profile = document.querySelector('#profile').value
      const dateOfBirth = document.querySelector('#date-of-birth').value

      const body = {
        name,
        profile,
        date_of_birth: dateOfBirth,
      }

      try {
        const res = await fetchFunc(BASE_URL, {
          method: 'POST',
          headers,
          body: JSON.stringify(body),
        })
        const resJson = await res.json()

        alert(resJson.message)
        window.location.href = '/'
      } catch (err) {
        const errRes = await err.response.json()
        alert(errRes.error)
      }
    },
    setExistingValue: async (uid) => {
      try {
        const res = await fetchFunc(`${BASE_URL}/${uid}`)
        const body = await res.json()

        document.querySelector('#uid').placeholder = body.id
        document.querySelector('#name').value = body.name
        document.querySelector('#profile').value = body.profile
        document.querySelector('#date-of-birth').value = body.date_of_birth
      } catch (error) {
        const res = await error.response.json()
        alert(res.error)
        window.location.href = '/'
      }
    },
    saveUser: async (uid) => {
      const name = document.querySelector('#name').value
      const profile = document.querySelector('#profile').value
      const dateOfBirth = document.querySelector('#date-of-birth').value

      const body = {
        name,
        profile,
        date_of_birth: dateOfBirth,
      }

      try {
        const res = await fetchFunc(`${BASE_URL}/${uid}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(body),
        })

        const resJson = await res.json()
        alert(resJson.message)
        window.location.href = '/'
      } catch (error) {
        const resJson = await error.response.json()
        alert(resJson.error)
      }
    },
    deleteUser: async (uid) => {
      const ret = window.confirm('このユーザーを削除しますか？')

      if (!ret) {
        return false
      } else {
        try {
          const res = await fetchFunc(`${BASE_URL}/${uid}`, {
            method: 'DELETE',
            headers,
          })

          const resJson = await res.json()
          alert(resJson.message)
          window.location.href = '/'
        } catch (error) {
          const errRes = await error.response.json()
          alert(errRes.error)
        }
      }
    },
  }
})()
