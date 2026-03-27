import express from 'express';
const app = express();
app.get('/', (req, res) => res.send('DIRECT SERVER WORKS'));
app.listen(3002, () => console.log('DEBUG SERVER ON 3002'));
