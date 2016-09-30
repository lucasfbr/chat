$(function () {

    var socket = io.connect();
    var salaChat = $("#salaChat");
    var telaUsername = $("#telaUsername");
    var nickName = $("#nickname");
    var frmInformeUsuario = $("#frmInformeUsuario");
    var frmMensagens = $("#frmMensagens");
    var cpMensagem = $("#cpMensagem");
    var divMensagens = $("#mensagens");
    var divusuario = $("#usuario");


    salaChat.hide();

    frmInformeUsuario.submit(function (e) {
        e.preventDefault();

        //emitindo o evento novo usuario com o nickName e uma funcao de callback
        //este evento esta sendo escutado pelo método "on" do socket.io no app.js
        socket.emit('novo_usuario', nickName.val(), function (data) {
            if (data.retorno) {
                telaUsername.hide();
                salaChat.show();
                cpMensagem.focus();
            } else {
                alert(data.msg);
                nickName.val("");
            }
        })

        socket.on('atualiza usuarios', function (usuarios) {

            var listaUsuarios = '';

            usuarios.forEach(function (el, i) {

                listaUsuarios += "<button type='button' class='list-group-item'><div class='usuario_img'><img src='img/default.jpg' alt='...' class='img-circle'></div>";
                listaUsuarios += "<div class='usuario_txt'><p>"+usuarios[i].usuarios[i].nickname+"</p></div></button>";

            })

            divusuario.empty().append(listaUsuarios);

        });

        //envio de mensagens de forma publica(broadcast)
        /*frmMensagens.submit(function (e) {
            e.preventDefault();

            //emitindo um evento com a mensagem digitada
            socket.emit('enviar mensagem publica', cpMensagem.val());
            cpMensagem.val("");
        })*/

        frmMensagens.submit(function (e) {
            e.preventDefault();

            //socket.emit
        })


        //escutando
        socket.on('nova mensagem', function (data) {

            divMensagens.append("<div class='container'><div class='row'><div id='msgUm' class='col-xs-5'><span class='dataAtual'>[" + data.dataAtual + "]:</span>  "+ data.msg + "</div></div></div>");

        });
    });


});
