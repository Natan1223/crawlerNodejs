const rp = require('request-promise')
const cheerio = require('cheerio')
const express = require('express');

const router = express.Router();


router.get('/import-detalhes/:numeroLote',(req, res)=> {

    numeroLote = req.params.numeroLote;

    data = new Date();
    mes = (data.getMonth()+1)
    ano = data.getFullYear()

    const options = {
        uri: 'http://localhost/img/'+ano+'/'+mes+'/captacao'+numeroLote+'.html',
        transform: function (body) {
            return cheerio.load(body)
        }
    }

    function processarDados(dados){
        res.json(dados);
    }

    rp(options).then(($) => {
        const results = []
        $('tbody tr').each((i, item) => {

            valorArquivo = $(item).find('td').text().trim()
            const result = {
                resultNumero : parseInt(valorArquivo.substring(4,13), 10),
                resultStatus : valorArquivo.substring(13,14)
            }

            if(result.resultNumero !== "")
                results.push(result)
        })

        resultContatos = results.slice(6);

        processarDados(resultContatos)
    })
    .catch((err) => {
    console.log(err);
    });
});



router.get('/import-dados-gerais/:numeroLote',(req, res)=> {

    numeroLote = req.params.numeroLote;

    data = new Date();
    mes = (data.getMonth()+1)
    ano = data.getFullYear()

    const options = {
        uri: 'http://localhost/img/'+ano+'/'+mes+'/captacao'+numeroLote+'.html',
        transform: function (body) {
            return cheerio.load(body)
        }
    }

    function processarDados(dados){
        res.json(dados);
    }

    rp(options).then(($) => {
       
        const resultsCab = []

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

        
        processarDados(resultCabecalho)
    })
    .catch((err) => {
    console.log(err);
    });
});

module.exports = router;