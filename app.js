var express = require('express');
var path = require('path');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var usuarios = [];
var idUsuario = 0;

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

        console.log('usuarios lenght: '+usuarios.length );

        if(usuarios.length == 0){
            //metodo que adiciona usuario e id ao array usuarios
            addUsuario(nickname, callback);
        }else{

            //percorre o array usuarios
            usuarios.forEach(function (el, i) {

                //verifica se usuario ja existe no array, caso exista retorna uma mensagem
                //caso nao exista, adiciona ao array
                if (usuarios[i].usuarios[i].nickname == nickname) {

                    console.log('entrou 1')

                    callback({retorno: false, msg: 'O apelido ' + nickname + ' ja existe, escolha outro!'});

                }else{

                    console.log('entrou 2')

                    //metodo que adiciona usuario e id ao array usuarios
                    addUsuario(nickname, callback);
                }

            });
        }

    });


    socket.on('enviar mensagem privada', function (data) {

        //removendo os espaços em branco do inicio e do final da string
        var mensagem = data.trim();
        var dataAtual = pegarDataAtual();

    })


    //existem duas formas de enviar mensagens, restritas(um para um) e publicas(todos)
    //aqui nos vamos receber uma mensagem e enviar de forma publica
    //escutando o evento "enviar mensagem" que será emitido no arquivo main.js
    socket.on('enviar mensagem publica', function (data) {

        //removendo os espaços em branco do inicio e do final da string
        var mensagem = data.trim();
        var dataAtual = pegarDataAtual();

        //emitindo um evento de forma publica, todod registrados no socket vao receber
        io.sockets.emit('nova mensagem', {msg: mensagem, nick: socket.nickname, dataAtual: dataAtual})

    });

    //simplesmente ao fechar o navegador o socket.io emite um evento disconnect
    socket.on('disconnect', function () {


        if (!socket.nickname) return;

        //delete usuarios[socket.nickname];
        delete usuarios[1]

        //atualiza nossa lista de usuarios
        atualizarUsuarios();
    })


    function addUsuario(nickname, callback) {

        //retorno com um objeto contendo status(retorno) e msg
        callback({retorno: true, msg: ''});
        //o nickname esta sendo criado dentro do socket
        socket.nickname = nickname;
        socket.idUsuario = ++idUsuario;

        //var dados = '{"usuarios" : [{"id" : "'+socket.idUsuario+'" , "nickname" : "'+socket.nickname+'"}]}';

        var text = '{ "employees" : [' +
            '{ "firstName": "xxx" , "lastName":"Doe" },' +
            '{ "firstName":"Anna" , "lastName":"Smith" },' +
            '{ "firstName":"Peter" , "lastName":"Jones" } ]}';


        usuarios.push(JSON.parse(text));


        //atualiza nossa lista de usuarios
        atualizarUsuarios();

        console.log('Novo usuario no Chat ID : ' + socket.idUsuario + ' NICKNAME : ' + socket.nickname)

    }

    function atualizarUsuarios() {

        //console.log(usuarios[0].usuarios[0].id);
        //console.log(usuarios[0].usuarios[0].nickname);


        usuarios.forEach(function (el, i) {
            console.log(usuarios[i].usuarios[i].nickname);
        })


        io.sockets.emit('atualiza usuarios', usuarios);
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

});