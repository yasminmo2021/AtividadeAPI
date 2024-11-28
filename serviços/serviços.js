import colecaoInf from "../dados/dados.js";

export const buscarInf = () =>{
    return colecaoInf;
}

export const buscarInfPorAno = (anoInf) => {
    return colecaoInf.filter(inf => inf.ano == anoInf)
};

export const buscarInfPorId = (id) =>{
    const idInf = parseInt(id);
    return colecaoInf.find(inf => inf.id === idInf);
}

export const calcularReajuste = (valor, mesInicial, anoInicial, mesFinal, anoFinal) => {
    const ipcaFiltrado = colecaoInf.filter((item) => {
        const anoMes = item.ano * 12 + item.mes;
        const anoMesInicial = anoInicial * 12 + mesInicial;
        const anoMesFinal = anoFinal * 12 + mesFinal;
        return anoMes >= anoMesInicial && anoMes <= anoMesFinal;
    });

    if (ipcaFiltrado.length === 0) {
        throw new Error("Nenhum índice IPCA encontrado no período informado.");
    }

    let resultado = valor;
    ipcaFiltrado.forEach((item) => {
        resultado *= 1 + item.ipca / 100;
        console.log(resultado)
    });

    return resultado;
}
