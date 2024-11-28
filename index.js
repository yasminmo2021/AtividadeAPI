import express from "express";
import { buscarInf, buscarInfPorId, buscarInfPorAno, calcularReajuste } from "./serviços/serviços.js";

const app = express();

app.get('/historicoIPCA', (req, res) => {
    const anoInf = req.query.ano;
    const resultado = anoInf ? buscarInfPorAno(anoInf) : buscarInf();
    if (resultado.length > 0) {
        res.json(resultado);
    } else {
        res.status(404).send({ "erro": "Nenhum registro encontrado" });
    }
});

app.get('/historicoIPCA/calculo', (req, res) => {
    const valor = parseFloat(req.query.valor);
    const mesInicial = parseInt(req.query.mesInicial);
    const anoInicial = parseInt(req.query.anoInicial);
    const mesFinal = parseInt(req.query.mesFinal);
    const anoFinal = parseInt(req.query.anoFinal);

    if (isNaN(valor) || isNaN(mesInicial) || isNaN(anoInicial) || isNaN(mesFinal) || isNaN(anoFinal)) {
        return res.status(400).json({ error: "Todos os parâmetros (valor, mesInicial, anoInicial, mesFinal, anoFinal) são obrigatórios e devem ser válidos." });
    }

    if (anoInicial > anoFinal || (anoInicial === anoFinal && mesInicial > mesFinal)) {
        return res.status(400).json({ error: "O mês/ano inicial deve ser menor ou igual ao mês/ano final." });
    }

    try {
        const resultado = calcularReajuste(valor, mesInicial, anoInicial, mesFinal, anoFinal);
        res.json({ valorReajustado: resultado.toFixed(2) });
    } catch (error) {
        res.status(500).json({ "erro": "Erro ao calcular o reajuste." });
    }
});

app.get('/historicoIPCA/:id', (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).send({ "erro": "Requisição inválida, o ID deve ser numérico" });
    }

    const inf = buscarInfPorId(id);

    if (inf) {
        res.json(inf);
    } else {
        res.status(404).send({ "erro": "ID não encontrado" });
    }
});

app.listen(8080, () => {
    console.log('Servidor iniciado na porta 8080');
});
