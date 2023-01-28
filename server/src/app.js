require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3000;
const indexRouter = require('./routers/index');
const errorHandler = require('./middlewares/errorHandler');
const fs = require('fs');
const serverUrl = require("./helpers/serverUrl");

app.use(cors({ origin: '*', methods: 'GET,PUT,POST,DELETE' }));
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use('/uploads', express.static('uploads'));


app.get('/files/all', (req, res) => {
	let html = '<ul>';
	fs.readdirSync('./uploads').forEach((file) => {
		if (file !== '.gitkeep') html += `<li><a href="/uploads/${file}">${file}</a> <br /> LINK: ${serverUrl + 'uploads/' + file} </li>`;
	});
	html += '</ul>';

	// html += `
	// <br />
	// <br />
	// <form action="/upload-pdf" method="POST" enctype="multipart/form-data">
	// <input type="file" name="pdf">
	// <input type="submit">
	// </form>`;

	res.send(html);
});

app.use(indexRouter);

app.use((req, res) => {
    res.status(404).send('Not Found');
});
app.use(errorHandler);

app.listen(PORT, () => console.log(`Running on port: ${PORT}`));
