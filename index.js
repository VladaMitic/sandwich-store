const fs = require('fs');
const http = require('http');
const url = require('url');

const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const sandwichData = JSON.parse(json);

const server = http.createServer((req, res) => {

    const pathName = url.parse(req.url, true).pathname;
    const id = url.parse(req.url, true).query.id;

    //sandwichs overview
    if(pathName === '/product' || pathName === '/') {
        res.writeHead(200, { 'Content-type': 'text/html' });

        fs.readFile(`${__dirname}/templates/template-overview.html`, 'utf-8', (err, data) => {

            let overviewOutput = data;
            
            fs.readFile(`${__dirname}/templates/template-card.html`, 'utf-8', (err, data) => {
            
                const cardsOutput = sandwichData.map(el => replaceTemplate(data, el)).join('');
                overviewOutput = overviewOutput.replace('{%CARDS%}', cardsOutput);
                res.end(overviewOutput);
            });
        });
    }

    //sandwich detail
    else if (pathName ==='/sandwich' && id < sandwichData.length) {
        res.writeHead(200, { 'Content-type': 'text/html' });

        fs.readFile(`${__dirname}/templates/template-sandwich.html`, 'utf-8', (err, data) => {
            let sandwich = sandwichData[id];
            const output = replaceTemplate(data, sandwich);
            res.end(output);
        });
    } 

    //images routing
    else if ((/\.(jpg|jpeg|png|gif)$/i).test(pathName)) {
        fs.readFile(`${__dirname}/data/img/${pathName}`, (err, data) => {
            res.writeHead(200, { 'Content-type': 'image/jpg' });
            res.end(data);
        })
    }

    //URL not found
    else {
        res.writeHead(404, { 'Content-type': 'text/html' });
        res.end('Url was not found on the server');
    }
});

server.listen(1337, '127.0.0.1', () => {
    console.log('Listening for request now');
});

function replaceTemplate(originalHTML, sandwich) {
    let output = originalHTML.replace(/{%SANDWICHNAME%}/g, sandwich.sandwichName);
    output = output.replace(/{%IMAGE%}/g, sandwich.image);
    output = output.replace(/{%PRICE%}/g, sandwich.price);
    output = output.replace(/{%MEAT%}/g, sandwich.meat);
    output = output.replace(/{%BREAD%}/g, sandwich.bread);
    output = output.replace(/{%SALAD%}/g, sandwich.salad);
    output = output.replace(/{%SIDE%}/g, sandwich.side);
    output = output.replace(/{%DESCRIPTION%}/g, sandwich.description);
    output = output.replace(/{%ID%}/g, sandwich.id);
    return output;
};