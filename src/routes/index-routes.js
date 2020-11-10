const express = require('express');
var request = require('request');
var cheerio = require('cheerio');
const router = express.Router();

var result = [];
var result1 = [];

router.get('/', (req, res, next) => {
  res.status(200).send({
    title: 'MentionsAPI',
    version: '1.0.0'
  });
});

router.get('/result/:numeroLote',(req, res)=> {
    
    var numeroLote = req.params.numeroLote;
    var url = 'http://localhost/img/captacao'+numeroLote+'.html';

    request(url, function(err, res, body){

        var $ = cheerio.load(body);

        if(result.length > 0){
            result = [];
        }

        $('tbody tr').each(function() {
            var valorArquivo = $(this).find('td').text().trim();

            var resultNumero = parseInt(valorArquivo.substring(0,13), 10);
            var resultStatus = valorArquivo.substring(13,20);

            result.push({
                resultNumero,
                resultStatus
            });

        });

        $('#overview > table > tbody > tr:nth-child(2)').each(function() {
            var valortotalDeNumeros = $(this).find('td[style="width: 89px"]').text().trim();
            var valorSucesso = $(this).find('td[style="width: 71px"]').text().trim();
            var valorFalha = $(this).find('td[style="width: 63px"]').text().trim();

            var totalDeNumeros = valortotalDeNumeros ? valortotalDeNumeros : null;
            var sucesso = valorSucesso ? valorSucesso : null;
            var falha = valorFalha ? valorFalha : null;
            // var resultStatus = valorArquivo.substring(13,20);

            result1.push({
                totalDeNumeros,
                sucesso,
                falha
            });
        });
        
    });

    resultCabecalho = result1[0];
    resultContatos = result.slice(6);
    
    data = {
        resultCabecalho,
        resultContatos
    }
    if(result != ''){
        res.json(data);
    }else{
        res.json({'menssage': 'Nenhum resultado'});
    }
    
});

// router.get('/valores/:numeroLote',(req, res)=> {
    
//     var numeroLote = req.params.numeroLote;
//     var url = 'http://localhost/img/captacao'+numeroLote+'.html';

//     request(url, function(err, res, body){

//         var $ = cheerio.load(body);

//         if(result.length > 0){
//             result1 = [];
//         }

//         $('#overview > table > tbody > tr:nth-child(2)').each(function() {
//             var valorArquivo1 = $(this).find('td[style="width: 89px"]').text().trim();
//             var valorArquivo2 = $(this).find('td[style="width: 71px"]').text().trim();
//             var valorArquivo3 = $(this).find('td[style="width: 63px"]').text().trim();

//             var totalDeNumeros = valorArquivo1 ? valorArquivo1 : null;
//             var sucesso = valorArquivo2 ? valorArquivo2 : null;
//             var falha = valorArquivo3 ? valorArquivo3 : null;
//             // var resultStatus = valorArquivo.substring(13,20);

//             result1.push({
//                 totalDeNumeros,
//                 sucesso,
//                 falha
//             });
//             // console.log(result1)
//         });
        
//     });

//     if(result1 != ''){
//         res.json(result1[0]);
//     }else{
//         res.json({'menssage': 'Nenhum resultado'});
//     }

// });

module.exports = router;