const express = require('express')
const path = require('path')
const app = express()
const sqlite3 = require('sqlite3')

const dbPath = 'app/db/database.sqlite3'

// リクエストのbodyをパース
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// publicディレクトリを静的ファイル群のルートディレクトリとして設定
app.use(express.static(path.join(__dirname, 'public')))

/**
 * Get all users
 */
app.get('/api/v1/users', (req, res) => {
  // connect database
  const db = new sqlite3.Database(dbPath)

  db.all('SELECT * FROM users', (err, rows) => {
    if (err) {
      res.status(500).send({ error: err })
    }

    if (rows.length === 0) {
      res.status(404).send({ error: 'ユーザーが登録されていません。' })
    } else {
      res.status(200).send(rows)
    }
  })

  db.close()
})

/**
 * Get a user
 */
app.get('/api/v1/users/:id', (req, res) => {
  // connect database
  const db = new sqlite3.Database(dbPath)
  const id = req.params.id

  db.get(`SELECT * FROM users WHERE id=${id}`, (err, row) => {
    if (err) {
      res.status(500).send({ error: err })
      return
    }

    if (!row) {
      res.status(404).send({ error: 'ユーザーが存在しません。' })
    } else {
      res.status(200).json(row)
    }
  })

  db.close()
})

/**
 * Get following users
 */
app.get('/api/v1/users/:id/following', (req, res) => {
  // connect database
  const db = new sqlite3.Database(dbPath)
  const id = req.params.id

  db.all(
    `SELECT * FROM following LEFT JOIN users ON following.followed_id=users.id WHERE following_id=${id}`,
    (err, rows) => {
      if (err) {
        res.status(500).send({ error: err })
      }

      if (rows.length === 0) {
        res.status(404).send({ error: 'フォローしているユーザーがいません。' })
      } else {
        res.status(200).json(rows)
      }
    }
  )

  db.close()
})

/**
 * Search users match keywords
 */
app.get('/api/v1/search', (req, res) => {
  // connect database
  const db = new sqlite3.Database(dbPath)

  const keyword = req.query.q

  db.all(`SELECT * FROM users WHERE name LIKE "%${keyword}%"`, (err, rows) => {
    if (err) {
      res.status(500).send({ error: err })
    }

    if (rows.length === 0) {
      res.status(404).send({ error: '検索条件に合うユーザーがいません。' })
    } else {
      res.json(rows)
    }
  })

  db.close()
})

const run = async (sql, db) => {
  return new Promise((resolve, reject) => {
    db.run(sql, (err) => {
      if (err) {
        return reject(err)
      } else {
        return resolve()
      }
    })
  })
}

/**
 * Create new user
 */
app.post('/api/v1/users', async (req, res) => {
  if (!req.body.name || req.body.name === '') {
    res.status(400).send({ error: 'ユーザー名が指定されていません!' })
  } else {
    // connect database
    const db = new sqlite3.Database(dbPath)

    const name = req.body.name
    const profile = req.body.profile ? req.body.profile : ''
    const dateOfBirth = req.body.date_of_birth ? req.body.date_of_birth : ''

    try {
      await run(
        `INSERT INTO users (name, profile, date_of_birth) VALUES ('${name}', '${profile}', '${dateOfBirth}')`,
        db
      )
      res.status(201).send({ message: '新規ユーザーを作成しました!' })
    } catch (err) {
      res.status(500).send({ error: err })
    }

    db.close()
  }
})

/**
 * Update user data
 */
app.put('/api/v1/users/:id', async (req, res) => {
  if (!req.body.name || req.body.name === '') {
    res.status(400).send({ error: 'ユーザー名が指定されていません!' })
  } else {
    // connect database
    const db = new sqlite3.Database(dbPath)
    const id = req.params.id

    db.get(`SELECT * FROM users WHERE id=${id}`, async (err, row) => {
      if (err) {
        res.status(500).send({ error: err })
      }

      if (!row) {
        res.status(404).send({ error: '指定されたユーザーが存在しません!' })
      } else {
        const name = req.body.name ? req.body.name : row.name
        const profile = req.body.profile ? req.body.profile : row.profile
        const dateOfBirth = req.body.date_of_birth ? req.body.date_of_birth : row.date_of_birth

        try {
          await run(
            `UPDATE users SET name="${name}", profile="${profile}", date_of_birth="${dateOfBirth}" WHERE id=${id}`,
            db
          )
          res.status(200).send({ message: 'ユーザー情報を更新しました!' })
        } catch (err) {
          res.status(500).send({ error: err })
        }
      }
    })

    db.close()
  }
})

/**
 * Delete user
 */
app.delete('/api/v1/users/:id', async (req, res) => {
  // connect database
  const db = new sqlite3.Database(dbPath)
  const id = req.params.id

  db.get(`SELECT * FROM users WHERE id=${id}`, async (err, row) => {
    if (err) {
      res.status(500).send({ error: err })
    }

    if (!row) {
      res.status(404).send({ error: '指定されたユーザーが存在しません!' })
    } else {
      try {
        await run(`DELETE FROM users WHERE id=${id}`, db)
        res.status(200).send({ message: 'ユーザーを削除しました！' })
      } catch (err) {
        res.status(500).send({ error: err })
      }
    }
  })

  db.close()
})

const PORT = process.env.PORT || 3000
app.listen(PORT)
console.log(`Listen on port ${PORT}!`)
