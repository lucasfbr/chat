module.exports = function (sequelize, Sequelize) {
    var Usuarios = sequelize.define('Usuarios', {
        nome     : Sequelize.STRING,
        email    : Sequelize.STRING,
        nickname : Sequelize.STRING
    });

    return Usuarios;
}
