const fs = require("fs");
class Contenedor {
  constructor(archivo) {
    this.archivo = archivo;
  }

  getAll() {
    const productos = fs.readFileSync(
      this.archivo,
      "utf-8",
      // eslint-disable-next-line no-unused-vars
      function (err, data) {
        if (err) console.log("error", err);
      }
    );
    return JSON.parse(productos);
  }

  async save(nuevaLista) {
    try {
      await fs.promises.writeFile(
        this.archivo,
        nuevaLista,
        // eslint-disable-next-line no-unused-vars
        function (err, result) {
          if (err) console.log("error", err);
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  async saveNuevoProd(product) {
    const lista = await this.getAll();
    const ultId = lista.length ? lista[lista.length - 1].id : 0;
    product.id = ultId + 1;
    lista.push(product);

    const nuevaLista = JSON.stringify(lista);

    await this.save(nuevaLista);
    return product.id;
  }

  async getById(id) {
    try {
      const lista = await this.getAll();
      const prodById = lista.find((prod) => prod.id == id);
      const resultado = prodById ? prodById : null;
      return resultado;
    } catch (error) {
      console.log(error);
    }
  }

  async updateById(id, newProduct) {
    let lista = await this.getAll();

    const index = lista.findIndex((product) => product.id == id);
    let producto = lista[index];

    if (producto) {
      const { title, price, thumbnail } = newProduct;

      producto.title = title;
      producto.price = price;
      producto.thumbnail = thumbnail;

      lista[index] = producto;

      const nuevaListaJson = JSON.stringify(lista);

      await this.save(nuevaListaJson);
      return producto;
    } else {
      return null;
    }
  }

  async deleteById(id) {
    const lista = await this.getAll();
    const producto = await this.getById(id);

    if (producto) {
      const nuevaLista = lista.filter((product) => product.id != id);
      const nuevaListaJson = JSON.stringify(nuevaLista);

      await this.save(nuevaListaJson);
      return producto;
    } else {
      return null;
    }
  }
}

module.exports = Contenedor;
