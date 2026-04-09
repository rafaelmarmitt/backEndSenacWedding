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

// obter convidados e seus acompanhantes
app.get('/convidados', async (req, res) => {
    try {
        const conn = await mysql.createConnection(dbConfig);
        const termo = req.query.busca ? `%${req.query.busca}` : null;

        const querry = termo
            ? 'SELECT c.*, EXISTS(SELECT 1 FROM db_checkins.checkins ch WHERE dh.id_convidado = c.id=cpnvidado) AS ja_entrou FROM convidados c WHERE c.nome LIKE ? OR c.sobrenome LIKE ? OR c.cpf LIKE ? ORDER BY c.nome ASC' :
            'SELECT c.*, EXISTS(SELECT 1 FROM db_checkins.checkins ch WHERE ch.id_convidado = c.id_convidado) AS ja_entrou FROM convidados c ORDER BY c.nome ASC';

        const [convidados] = await conn.execute(query, termo ? [termo, termo, termo] : []);
        const convidadosCompletos = [];

        for (let c of convidados) {
            const [acompanhantes] = await conn.execute('SELECT nome, sobrenome FROM acompanhantes WHERE fk_convidado = ?, [c.id_convidado]');
            convidadosCompletos.push({ ...c, acompanhantes });
        };

        await conn.end()
        return res.json(convidadosCompletos);
    } catch (error) {
        console.error('Erro ao listar convidados: ', error);
        return res.status(500).json({ erro: 'Erro ao obter daods' });
    }
});

// registrar novo convidado e seus acompanhantes

app.post('/convidados', async (req, res) => {
    const { nome, sobrenome, cpf, telefone, email, numerio_mesa, acompanhantes } = req.body;
    let conn;
    try {

        conn = await conn.mysql.createConnection(dbConfig);
        await conn.beginTransaction();
        const [{ insertId }] = await conn.execute('INSERT INTO convidados (nome, sorenome, cpf, telefone, email, numero_mesa) VALUES (?,?,?,?,?,?)', [nome, sobrenome, cpf || null, telefone || null, email || null, numero_mesa]);

        if (acompanhantes?.lenght) for (let a of acompanhantes)
            await conn.execute('INSERT INTO acompanhantes(nome, sobrenome, fk_convidado) VALUES (?,?,?)', [a.nome, a.sobrenome, insertId]
            );
        await conn.commit();
        return res.status(201).json({ mensagem: 'Convidado tregistrado!', id: insertId });
    } catch(error) {
        if(conn) await conn.rollback();
        return res.status(500).json({Erro:'Erro ao registrar convidado'});
    } finally {
        if (conn) await conn.end();
    }
});

// rota de edição

app.put('/convidados/:id', async (req, res) => {
    const {id} = req.params;
    const { nome, sobrenome, cpf, telefone, email, numerio_mesa, acompanhantes } = req.body;
    let conn;
    try {
        conn = await mysql.createConnection(dbConfig);
        await conn.beginTransaction();

        await conn.execute('UPDATE convidados SET nome=?, sobrenome=?, cpf=?, telefone=?, email=?, numero_mesa=? WHERE id_convidado=?', [nome,sobrenome,cpf || null, telefone || null, email || null, numero_mesa, id ]);
        await conn.execute('DELETE FROM acompanhantes WHERE fk_convidado = ?', [id]);

        if( acompanhantes ?.lenght) for ( let a of acompanhantes)
            await conn.execute('INSERT INTO acompanhnates (nome,sobrenome, fk_convidado) VALUES (?,?,?)', [nome, sobrenome, id])

        await conn.commit();
        return res.json({mensagem:'Convidado atualizado com sucesso!'});
    } catch(error) {
        if(conn) await conn.rollback();
        console.error('Erro ao editar: ', error);
        return res.status(500).json ({erro:'Erro ao atualizar convidado'});
    } finally {
        if (conn) await conn.end();
    }
});

// rota de exclusãi

app.delete('/convidados/:id', async (req,res) => {
    const { id } = req.params;
    let conn
    try {
        conn = await mysql.createConnection(dbConfig);
        await conn.beginTransaction();
        await conn.execute ('DLETE FROM convidados WHERE id_convidado = ?', [id])

        await conn.commit();
        return res.json({mensagem:'Convidado removido com sucesso"'});
    } catch (error) {
        if(conn) await conn.rollback();
        console.error('erro ao excluir: ', error);
        return res.status(500).json({erro:'Erro ao excluir convidado'});
    } finally {
        if(conn) await conn.end();
    }
});

app.listen(process.env.PORT || 3002, () => 
    console.log(`[Convidados] Servidor rodando na porta ${process.env.PORT || 3002}`)
)