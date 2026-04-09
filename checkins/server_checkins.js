require('dotenv').config();
const express = require('express');
cors = require('cors');
mysql = require('mysql2/promise');

const app = express();
app.use(cors(), express.json());

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
};

// endpoint para checkin

app.post('/checkin', async (req, res) => {
    const { id_usuario, id_convidado } = req.body;
    if (!id_usuario || !id_convidado) return res.status(400).json({ erro: 'ID do úsuario e do convidado são obrigatórios' });

    try {
        const conn = await mysql.createConnection(dbConfig);

        const [result] = await conn.execute('INSERT INTO checkins (id_usuario, id_convidado) VALUES (?,?)', [id_usuario, id_convidado]);
        await conn.end();
        return res.status(201).json({ mensagem: 'Check-In realizado com sucesso!', id_checkin: result.insertId });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ erro: 'Este convidado já fez o Check-In' });
        return res.status(500).json({ erro: 'Erro interno no servidor de Check-Ins' });
    }
});

//endpoint para mandar dados para a dashboard

app.get('/estatisticas', async (req, res) => {

    try {
        const conn = await mysql.createConnection(dbConfig);
        const [[{ presentes }]] = await conn.execute('SELECT COUNT(*) AS presentes FROM checkins');
        await conn.end();

        const totalEsperado = 30;
        return res.json({ presentes, ausentes: Math.max(totalEsperado - presentes, 0), totalEsperado });
    } catch (error) {
        console.error({ erro: 'Erro nas estatísticas: ', error });
        return res.status(500).json({ erro: 'Erro ao carregar estatísticas.' })
    }
});

app.listen(process.env.PORT || 3003, () => {
    console.log(`[Checkins] Servidor rodanndo na porta ${process.env.PORT || 3003}`);
})