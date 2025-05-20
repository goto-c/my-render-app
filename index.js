require('dotenv').config(); // ← 一番最初に書くのがベスト！

const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// PostgreSQLの接続設定（.envから読み込む）
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// 接続テスト
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('接続エラー', err);
    } else {
        console.log('データベース接続成功！', res.rows);
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
