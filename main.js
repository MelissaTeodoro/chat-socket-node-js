const express = require("express");
const app = express();

const path = require("path");
const http = require("http").Server(app);
const io   = require("socket.io")(http);

app.use(express.static("public_html"));

app.get("/", function(req, res){
    res.sendFile(path.resolve("public_html/index.html"));
});

var usuariosAtivos = [];
var usuariosAtivosSocket = [];
var usuariosLastID = 0;

io.on("connection", client => {
    client.on("message", mensagem => {
        mensagem = JSON.parse(mensagem);

        switch(mensagem.type){
            case "c":
                usuariosAtivos[usuariosLastID] = mensagem.data;
                usuariosAtivosSocket[usuariosLastID] = client;
                usuariosLastID += 1;

                io.emit("message", JSON.stringify({type: "l", data: usuariosAtivos}));

                break;

            case "m":
                var to = mensagem.data[0];
                var msg = mensagem.data[1];
                var from = usuariosAtivosSocket.indexOf(client);
                var sock = usuariosAtivosSocket[to];

                sock.emit("message", JSON.stringify({type: "m", data: [from, msg]}));

                break;
        }
    });

    client.on("disconnect", () => {
        var id = usuariosAtivosSocket.indexOf(client);

        delete usuariosAtivos[id];
        delete usuariosAtivosSocket[id];

        io.emit("message", JSON.stringify({type: "l", data: usuariosAtivos}));
    });
});

http.listen(80, function(){
    console.log("Servidor ativo na porta 80");
});