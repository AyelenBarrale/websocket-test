const express = require("express");
const emoji = require("node-emoji");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

const Contenedor = require("../src/contenedor");
const contProductos = new Contenedor("./src/data/productos.json");
const contMensajes = new Contenedor("./src/data/mensajes.json");

const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

httpServer.listen(8080, () =>
  console.log(emoji.get("computer"), "Server started on 8080")
);

app.get("/", (req, res) => {
  // eslint-disable-next-line no-undef
  res.sendFile(__dirname + "/viewClient/index.html");
});

app.get("/", async (req, res) => {
  const productos = await contProductos.getAll();
  res.render("index", {
    productos,
  });
});

/* ------------------------------ io.connection ----------------------------- */

io.on("connection", async (socket) => {
  console.log("usuario nuevo conectado");

  socket.on("disconnect", () => {
    console.log("usuario desconectado");
  });

  //PRODUCTOS
  const productos = await contProductos.getAll();

  socket.emit("productos", productos);

  socket.on("update", async (producto) => {
    await contProductos.saveNuevoProd(producto);
    io.socket.emit("productos", productos);
  });

  //MENSAJES
  const mensajes = await contMensajes.getAll();

  socket.emit('mensajes', mensajes)

  socket.on('nuevoMensaje', async (msn) => {
    msn.fyh = new Date().toLocaleString()
    await contMensajes.saveNuevoProd(msn)
    io.socket.emit('mensajes', mensajes)
  })
});
