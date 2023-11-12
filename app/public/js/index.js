const indexModule = (() => {
  const path = window.location.pathname

  switch (path) {
    case '/':
      const handleClick = (e) => {
        e.preventDefault()

        return searchModule.searchUsers()
      }
      // 検索ボタンを押した時のイベントリスナー設定
      document.querySelector('#search-button').addEventListener('click', handleClick)
      // UsersモジュールのfetchAllUsersメソッドを呼び出す
      return usersModule.fetchAllUsers()

    case '/create.html':
      const handleClickSaveButton = (e) => {
        e.preventDefault()

        return usersModule.createUser()
      }

      const handleClickCancelButton = (e) => {
        e.preventDefault()

        window.location.href = '/'
      }

      document.querySelector('#save-button').addEventListener('click', handleClickSaveButton)
      document.querySelector('#cancel-button').addEventListener('click', handleClickCancelButton)

      break

    case '/edit.html':
      const uid = window.location.search.split('?uid=')[1]

      const handleClickEditSaveButton = (e) => {
        e.preventDefault()

        usersModule.saveUser(uid)
      }

      const handleClickEditCancelButton = (e) => {
        e.preventDefault()

        window.location.href = '/'
      }

      const handleClickDeleteButton = (e) => {
        e.preventDefault()

        usersModule.deleteUser(uid)
      }

      document.querySelector('#save-button').addEventListener('click', handleClickEditSaveButton)
      document.querySelector('#cancel-button').addEventListener('click', handleClickEditCancelButton)
      document.querySelector('#delete-button').addEventListener('click', handleClickDeleteButton)

      return usersModule.setExistingValue(uid)

    case '/user-info.html':

    default:
      break
  }
})()
