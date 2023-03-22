const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const uuid = require('uuid');

server.use(jsonServer.bodyParser);
server.use(middlewares);

server.post('/layers', (req, res) => {
  const layer = req.body;
  layer.id = uuid.v4();
  router.db.get('layers').push(layer).write();
  res.send(layer);
});


server.put('/layers/:id', (req, res) => {
    const id = req.params.id;
    const layer = req.body;
    layer.id = id;
    router.db.get('layers')
      .find({ id: id })
      .assign(layer)
      .write()
    res.json(layer);
  })
  

server.delete('/layers/:id', (req, res) => {
  router.db.get('layers').remove({ id: req.params.id }).write();
  res.sendStatus(200);
});

server.get('/layers', (req, res) => {
  const layers = router.db.get('layers').value();
  res.send(layers);
});

server.use(router);

server.listen(3001, () => {
  console.log('JSON Server is running');
});
 