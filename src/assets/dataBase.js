const jsonServer = require('json-server');
const app = jsonServer.create();
const middlewares = jsonServer.defaults();
const router = jsonServer.router('db.json');

const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  },
});

app.use(middlewares);

// Middleware personnalisé pour intercepter les requêtes
app.use((req, res, next) => {
  console.log('Méthode : ' + req.method);
  next(); // Très important pour éviter les timeout
});

app.use(router);

io.on('connection', (socket) => {
  console.log('Un client est connecté');
});

// Sauvegarde de la fonction de rendu d'origine
const originalRender = router.render;
router.render = (req, res) => {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    io.emit('database_changed');
  }
  originalRender(req, res); // Assurez-vous d'appeler la fonction d'origine
};

server.listen(3010, () => {
  console.log('JSON Server et Socket.IO en écoute sur le port 3010');
});
