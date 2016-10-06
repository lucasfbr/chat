var express = require('express');
var path = require('path');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var usuarios = {};

server.listen(3000);

app.use(express.static(path.join(__dirname, 'publico')));

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/publico/index.html');
})

//escutando o evento connection do socket.io
//ao abrir o navegador sera emitido o evento connection
io.sockets.on('connection', function (socket) {

    //escutando o evento novo usuario, enviado pelo main.js do chat
    socket.on('novo_usuario', function (nickname, callback) {


        if(nickname in usuarios){
            callback({retorno: false, msg: 'O apelido ' + nickname + ' ja existe, escolha outro!'});
        }else{

            console.log('Novo usuario no Chat - NICKNAME : ' + nickname)
            //retorno com um objeto contendo status(retorno) e msg
            callback({retorno: true, msg: ''});
            //o nickname esta sendo criado dentro do socket
            socket.nickname = nickname;
            usuarios[socket.nickname] = socket;

            //atualiza nossa lista de usuarios
            atualizarUsuarios();

        }

    });


    //existem duas formas de enviar mensagens, restritas(um para um) e publicas(todos)
    //aqui nos vamos receber uma mensagem e enviar de forma publica
    //escutando o evento "enviar mensagem" que será emitido no arquivo main.js
    socket.on('enviar mensagem', function (data) {

        //removendo os espaços em branco do inicio e do final da string
        var mensagem     = data.trim();
        var dataAtual    = pegarDataAtual();

        var letra = mensagem.substr(0,1)

        if(letra === "/"){

            var nome = mensagem.substr(1, mensagem.indexOf(" ")).trim();
            var msg = mensagem.substr(mensagem.indexOf(" ")+1);

            if(nome in usuarios){
                usuarios[nome].emit('nova mensagem', {msg : "(mensagem privada de " + socket.nickname + ") "+ msg, nick: socket.nickname, dataAtual: dataAtual})

                socket.emit('nova mensagem', {msg : "(Você enviou para: "+nome+")" + msg,  nick : usuarios[nome].nickname, dataAtual: dataAtual});
            }else{

                socket.emit('nova mensagem', {msg : "O usuário "+nome+" não foi encontrado", nick : socket.nickname});

            }

        }else{

            //emitindo um evento de forma publica, todod registrados no socket vao receber
            //io.sockets.emit('nova mensagem', {msg: mensagem, nick: socket.nickname, dataAtual: dataAtual})
            io.sockets.emit('nova mensagem', {msg: mensagem, nick: socket.nickname, dataAtual: dataAtual})
        }

    });

    //simplesmente ao fechar o navegador o socket.io emite um evento disconnect
    socket.on('disconnect', function () {

        //se o nickname nao existir no socket para a execuçaõ
        if (!socket.nickname) return;
        //deleta o nickname da posicao onde foi encontrado o nickname
        delete usuarios[socket.nickname];

        console.log('o usuario : ' + socket.nickname + ' foi removido')

        //atualiza nossa lista de usuarios
        atualizarUsuarios();
    })


    function atualizarUsuarios() {

        //usuarios.forEach(function (el, i) {
        //    console.log(usuarios[i].nickname)
        //});

        //console.log(' dddd ' + usuarios);

        io.sockets.emit('atualiza usuarios', Object.keys(usuarios));
    }

    function pegarDataAtual() {
        var dataAtual = new Date();
        var dia = (dataAtual.getDate() < 10 ? '0' : '') + dataAtual.getDate();
        var mes = ((dataAtual.getMonth() + 1) < 10 ? '0' : '') + (dataAtual.getMonth() + 1);
        var ano = dataAtual.getFullYear();
        var hora = (dataAtual.getHours() < 10 ? '0' : '') + dataAtual.getHours();
        var minuto = (dataAtual.getMinutes() < 10 ? '0' : '') + dataAtual.getMinutes();
        var segundo = (dataAtual.getSeconds() < 10 ? '0' : '') + dataAtual.getSeconds();

        var dataFormatada = dia + "/" + mes + "/" + ano + " " + hora + ":" + minuto + ":" + segundo;
        return dataFormatada;
    }

    function insertUsuario(idUsuario, nickName) {


        if (usuarios.length == 0 || usuarios == null) {

            //var text = '{ "usuarios" : [{ "id": "1" , "nome":"Luca Rosa" , "nickname":"lucas-rosa" }]}';

            var text = '{ "id": "' + idUsuario + '" , "nickname":"' + nickName + '" }';


            usuarios.push(JSON.parse(text));

        } else {

            var text2 = '{ "id": "' + idUsuario + '" , "nickname":"' + nickName + '" }';
            usuarios.push(JSON.parse(text2));
        }


    }

});