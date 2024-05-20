const jwt = require('jsonwebtoken');

const verificarCredencialesMiddleware = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send('Faltan credenciales');
    }
    next();
};

const validarTokenMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).send('Token no proporcionado');
    }
    jwt.verify(token, "az_AZ", (err, decoded) => {
        if (err) {
            return res.status(401).send('Token inválido');
        }
        req.email = decoded.email;
        next();
    });
};

const reportarConsultasMiddleware = (req, res, next) => {
    console.log(`Consulta recibida: ${req.method} ${req.url}`);
    next();
};

module.exports = { verificarCredencialesMiddleware, validarTokenMiddleware, reportarConsultasMiddleware };
