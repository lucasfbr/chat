$( document ).ready(function() {

    var socket = io.connect();
    var salaChat = $("#salaChat");
    var telaUsername = $("#telaUsername");
    var nickName = $("#nickname");
    var frmInformeUsuario = $("#frmInformeUsuario");
    var frmMensagens = $("#frmMensagens");
    var cpMensagem = $("#cpMensagem");
    var divMensagens = $("#mensagens");
    var divusuario = $("#usuario");
    var usuarioTitular = $("#usuarioTitular");
    var usuarioSecundario = $("#usuarioSecundario");


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

                usuarioTitular.append("<div class='usuarioTitularImg'><div class='usuarioTitular_img'><img src='img/default.jpg' alt='...' title='"+data.nickname+"' class='img-circle'></div></div>");


            } else {
                alert(data.msg);
                nickName.val("");
            }
        })

    });

    //envio de mensagens de forma publica(broadcast)
    frmMensagens.submit(function (e) {
        e.preventDefault();

        var nickname = $('.usuarioSecundario_txt').attr("data-nome");

        //emitindo um evento com a mensagem digitada
        socket.emit('enviar mensagem', cpMensagem.val(), nickname);
        cpMensagem.val("");
    });

    //escutando
    socket.on('nova mensagem', function (data) {

        var id = 'msgUm';

        if(data.cor){
            id = "msgDois";
        }

        divMensagens.append("<div id='contemMsg'><div id='"+id+"'><span class='dataAtual'>[" + data.dataAtual + "]:</span>  "+ data.msg + "</div></div>");

    });

    socket.on('atualiza usuarios', function (usuarios) {

        var listaUsuarios = '';

        $.each(usuarios, function(key, value){


                listaUsuarios += "<button id='nickUsuario' data-nome='"+value+"' type='button' class='list-group-item'><div class='usuario_img'><img id='teste' src='img/default.jpg' alt='...' class='img-circle'></div>";
                listaUsuarios += "<div class='usuario_txt'><p>" + value + "</p></div></button>";

        });

        divusuario.empty().append(listaUsuarios);

    });


    $(document).on('click', '#nickUsuario', function(){

        var nickname = $(this).attr("data-nome");
        var usuarioSecundarioImg = $('.usuarioSecundarioImg');
        var usuarioSecundarioTxt = $('.usuarioSecundarioTxt');

        var usuariosecundario_img = '';
        var usuariosecundario_txt = '';

        usuariosecundario_img = "<div class='usuarioSecundario_img'> <img src='img/default.jpg' alt='...' class='img-circle'> </div>";
        usuariosecundario_txt = "<div class='usuarioSecundario_txt' data-nome='"+nickname+"' ><p>"+nickname+"</p></div>";

        usuarioSecundarioImg.empty().append(usuariosecundario_img);
        usuarioSecundarioTxt.empty().append(usuariosecundario_txt);

    });

});





