const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { verificarCredenciales, registrarUsuario, obtenerUsuarioPorEmail } = require('./consultas');
const { verificarCredencialesMiddleware, validarTokenMiddleware, reportarConsultasMiddleware } = require('./middlewares');
const port = 3000;

const app = express();
app.use(express.json());
app.use(cors());
app.use(reportarConsultasMiddleware);

app.listen(port, () => console.log('servidor corriendo en puerto', port));

app.post("/login", verificarCredencialesMiddleware, async (req, res) => {
    try {
        const { email, password } = req.body;
        await verificarCredenciales(email, password);
        const token = jwt.sign({ email }, "az_AZ");
        res.send({ token });
    } catch (error) {
        console.log(error);
        res.status(error.code || 500).send(error.message);
    }
});

app.post("/usuario", verificarCredencialesMiddleware, async (req, res) => {
    try {
        const usuario = req.body;
        console.log("dentro de registrarse");
        await registrarUsuario(usuario);
        res.send("Usuario creado con exito");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get("/usuario", validarTokenMiddleware, async (req, res) => {
    try {
        const email = req.email;
        const usuario = await obtenerUsuarioPorEmail(email);
        res.send(usuario);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = app;
