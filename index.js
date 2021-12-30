const express = require("express");
const axios = require("axios");
const fs = require("fs/promises");

const app = express();
app.use(express.json());

let votes = require("./votos.json");


app.post("/votacao/:pais/:ip", async (req, res) => {
    const pais = req.params.pais;
    const ip = Number(req.params.ip);

    const instanciaAxios = axios.create({
        baseURL: 'https://ipgeolocation.abstractapi.com/v1/',
        params: {
            api_key: '062c69cb677449ebb027baade83b552a',
            ip: ip
        }
    });

    const promise = await instanciaAxios.get();

    if (promise.data.country === pais) {
        const newObject = {
            ip: promise.data.ip_address,
            voto: req.body.voto
        }
        votes.push(newObject)
        fs.writeFile("./votos.json", JSON.stringify(votes));

        res.json(newObject);
    } else {
        res.status(400).json({
            erro: `IP enviado não coincide com o país da votação`
        })
    }
})

app.listen(8000);

