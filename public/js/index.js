// eslint-disable-next-line no-undef
const socket = io();

//PRODUCTOS TABLA
const tablaResults = (productos) =>
  productos
    .map(
      (p) =>
        `<tr>
        <th scope="row">${p.title} </th>
        <td>${p.price} </td>
        <td><img style="width: 25%" src="${p.thumbnail}" alt="" /></td>
    </tr> `
    )
    .reverse()
    .join(" ");

socket.on("productos", (productos) => {
  const html = tablaResults(productos);
  document.getElementById("listaProductos").innerHTML = html;
});

//PRODUCTOS FORM
const productForm = document.getElementById("productForm");

productForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const producto = {
    title: productForm[0].value,
    price: productForm[1].value,
    thumbnail: productForm[2].value,
  };

  socket.emit("update", producto);

  productForm.reset();
});

//MENSAJES

const user = document.getElementById("user");
const mensaje = document.getElementById("inputMsg");
const mensajesForm = document.getElementById("mensajesForm");
const listaMensajes = document.getElementById("listaMensajes");

//data tomada desde form
mensajesForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const msn = {
    author: user.value,
    text: mensaje.value,
  };

  socket.emit("nuevoMensaje", msn);

  mensajesForm.reset();
  mensaje.focus();
});

//mensajes provenientes de servidor
const msnBox = (mensajes) =>
  mensajes
    .map(
      (m) =>
        `<div style="display: flex">
        <p style="color: blue">${m.author}, (${m.fyh}): </p>
        <p> ${m.text}</p>
    </div>`
    )
    .reverse()
    .join(" ");

socket.on("mensajes", (mensajes) => {
  const html = msnBox(mensajes);
  listaMensajes.innerHTML = html;
});
