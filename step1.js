const express = require('express');
const fs = require('fs');
const app = express();

// Middleware per leggere i dati dal form HTML
app.use(express.urlencoded({ extended: true }));

// Rotta GET: Renderizza il form minimale
app.get('/post', (req, res) => {
    res.send(`
        <h1>Aggiungi Post</h1>
        <form action="/post" method="POST">
            <input type="text" name="contenuto" placeholder="Scrivi qui..." required>
            <button type="submit">Salva</button>
        </form>
    `);
});

// Rotta POST: Riceve i dati e scrive su post.json
app.post('/post', (req, res) => {
    const nuovoDato = req.body;
    let archivio = [];

    // 1. Controlla se il file esiste e leggi i dati attuali
    if (fs.existsSync('post.json')) {
        const fileContent = fs.readFileSync('post.json', 'utf8');
        // Se il file non è vuoto, parsa il JSON
        if (fileContent) {
            archivio = JSON.parse(fileContent);
        }
    }

    // 2. Aggiungi il nuovo dato all'array
    archivio.push(nuovoDato);

    // 3. Scrivi tutto nel file post.json (formattato per leggibilità)
    fs.writeFileSync('post.json', JSON.stringify(archivio, null, 2));

    res.send('Salvato con successo. <a href="/post">Torna indietro</a>');
});

// Avvio del server
app.listen(3000, () => {
    console.log('Server attivo su http://localhost:3000/post');
});
