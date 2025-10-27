import express from 'express';
const solarSystem = (await import('npm-solarsystem')).default

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get('/planet', (req, res) => {
    let planet_name = req.query.planetName;
    let planetInfo = solarSystem[`get${planet_name}`]();
    res.render('planetInfo.ejs', { planetInfo, planet_name })
});

app.get('/', async (req, res) => {
    let imgResponse = await fetch('https://pixabay.com/api/?key=52800745-f52e8441750acdaa430f09481&q=solar+system+space&orientation=horizontal');
    let imgData = await imgResponse.json();
    let hits = Array.isArray(imgData.hits) ? imgData.hits : [];
    let randomImg = hits.length ? hits[Math.floor(Math.random() * hits.length)].largeImageURL : null;
    res.render('home.ejs', { randomImg });
});

app.get('/nasaPOD', async (req, res) => {
    const api = 'https://api.nasa.gov/planetary/apod?api_key=9mUzIkhlZCZaOoMfspg7jMmwZCZ4LiRHtkgkambD&date=2025-10-14';
    const r = await fetch(api);
    const data = await r.json();
    const isImage = data.media_type === 'image';
    const mediaUrl = data.hdurl || data.url || null;
    res.render('nasaPOD.ejs', { data, isImage, mediaUrl });

});

app.listen(3000, () => {
    console.log('server started');
});