const exp = require("constants");
const express = require("express");
const path = require("path");

const app = express();

app.use(express.static("public_html"))
app.get("/", (request, response) => {
    response.sendFile(path.resolve("public_html/index.html"));
});

app.listen(80, () => console.log("Servidor ativo na porta 80"));