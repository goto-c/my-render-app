require('dotenv').config(); // ← 一番最初に書くのがベスト！

const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// 追加: JSONリクエストをパース
app.use(express.json());

// PostgreSQLの接続設定（.envから読み込む）
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Renderの場合は推奨
});

// 接続テスト
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('接続エラー', err);
    } else {
        console.log('データベース接続成功！', res.rows);
    }
});

// 追加: 会員登録API
app.post('/register', async (req, res) => {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
        return res.status(400).json({ error: '全ての項目を入力してください' });
    }
    try {
        const result = await pool.query(
            'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING id, username, email',
            [username, password, email]
        );
        res.status(201).json({ user: result.rows[0] });
    } catch (err) {
        console.error('登録エラー', err);
        res.status(500).json({ error: '登録に失敗しました' });
    }
});

// ルートパスにアクセスしたときの応答
app.get('/', (req, res) => {
    res.send('こんにちは、Renderからの世界！🌍');
});

// サーバー起動
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
