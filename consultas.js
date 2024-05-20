const bcrypt = require('bcryptjs');
const pool = require('./db');

const verificarCredenciales = async (email, password) => {
    const values = [email];
    const query = "SELECT * FROM usuario WHERE email = $1";
    
    const { rows: [usuario], rowCount } = await pool.query(query, values);
    
    if (!rowCount) {
        throw {
            code: 401,
            message: 'Email o contraseña incorrecta'
        };
    }

    const { password: passwordEncriptada } = usuario;
    const passwordCorrecta = bcrypt.compareSync(password, passwordEncriptada);

    if (!passwordCorrecta) {
        throw {
            code: 401,
            message: 'Email o contraseña incorrecta'
        };
    }

    return usuario;
};

const registrarUsuario = async (usuario) => {
    try {
        console.log("dentro de registrarUsuario");
        let { email, password, rol, lenguage } = usuario;
        const passwordEncriptada = bcrypt.hashSync(password);
        console.log("password encriptada ", passwordEncriptada);
        const values = [email, passwordEncriptada, rol, lenguage];
        const query = "INSERT INTO usuario(email, password, rol, lenguage) VALUES ($1, $2, $3, $4)";
        await pool.query(query, values);
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const obtenerUsuarioPorEmail = async (email) => {
    const values = [email];
    const query = "SELECT * FROM usuario WHERE email = $1";
    const { rows: [usuario] } = await pool.query(query, values);
    return usuario;
};

module.exports = { verificarCredenciales, registrarUsuario, obtenerUsuarioPorEmail };
