const rp = require('request-promise')
const cheerio = require('cheerio')
const express = require('express');

const router = express.Router();


router.get('/teste/:numeroLote',(req, res)=> {

    numeroLote = req.params.numeroLote;

    const options = {
        uri: 'http://localhost/img/captacao'+numeroLote+'.html',
        transform: function (body) {
            return cheerio.load(body)
        }
    }

    function processarDados(dados){
        res.json(dados);
    }

    rp(options).then(($) => {
        const results = []
        const resultsCab = []
        $('tbody tr').each((i, item) => {

            valorArquivo = $(item).find('td').text().trim()
            const result = {
                resultNumero : parseInt(valorArquivo.substring(0,13), 10),
                resultStatus :valorArquivo.substring(13,20)
            }

            if(result.resultNumero !== "")
                results.push(result)
        })

        $('#overview > table > tbody > tr:nth-child(2)').each((i, item) => {

            valortotalDeNumeros = $(item).find('td[style="width: 89px"]').text()
            valorSucesso = $(item).find('td[style="width: 71px"]').text()
            valorFalha = $(item).find('td[style="width: 63px"]').text()

            const resultCab = {
                totalDeNumeros: valortotalDeNumeros,
                sucesso: valorSucesso,
                falha: valorFalha 
            }

            if(resultCab.totalDeNumeros !== "")
                resultsCab.push(resultCab)
        })

        resultCabecalho = resultsCab[0];
        resultContatos = results.slice(6);
        
        data = {
            resultCabecalho,
            resultContatos
        }

        processarDados(data)
    })
    .catch((err) => {
    console.log(err);
    });
});

module.exports = router;