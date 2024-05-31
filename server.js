const express = require('express');
const path = require('path');
const morgan = require('morgan');
const find = require('local-devices');
const net = require('net');
const os = require('os');

const app = express();

app.set('view engine', 'ejs');

const PORT = 3000;

const createPath = (page) => path.resolve(__dirname, 'ejs-views', `${page}.ejs`);

app.listen(PORT, (error) => {
  error ? console.log(error) : console.log(`listening port ${PORT}`);
});


app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.use(express.static('styles'));

app.get('/', (req, res) => {
  const title = 'Home';
  res.render(createPath('index'), { title });
});

app.get('/info', (req, res) => {
  const title = 'info';  
  const networkInterfaces = os.networkInterfaces();
  Object.keys(networkInterfaces).forEach(interfaceName => {
    const interfaceInfo = networkInterfaces[interfaceName];
    interfaceInfo.forEach(info => {
      if (info.family === 'IPv4' && !info.internal) {
        console.log(`Имя интерфейса: ${interfaceName}`);
        console.log(`IP-адрес: ${info.address}`);
        res.render(createPath('info'), { title, interfaceName, info});
      }
    });
  });
  
});

app.use((req, res) => {
  const title = 'Error Page';
  res
    .status(404)
    .render(createPath('error'), { title });
});