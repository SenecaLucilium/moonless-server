const express = require ('express');
const { getInfo } = require ('./parsing.js');

//Configure database
// const { createMongoDB } = require ('./database_config.js');
// createMongoDB ();

const app = express ()

app.all ("/", function (req, res, next) {
    res.header ("Access-Control-Allow-Origin", "*");
    res.header ("Access-Control-Allow-Headers", "X-Requested-with");
    next();
});

app.all ("/catalog", function (req, res, next) {
    res.header ("Access-Control-Allow-Origin", "*");
    res.header ("Access-Control-Allow-Headers", "X-Requested-with");
    next();
});

app.all ("/authors", function (req, res, next) {
    res.header ("Access-Control-Allow-Origin", "*");
    res.header ("Access-Control-Allow-Headers", "X-Requested-with");
    next();
});

app.all ("/article/:id", function (req, res, next) {
    res.header ("Access-Control-Allow-Origin", "*");
    res.header ("Access-Control-Allow-Headers", "X-Requested-with");
    next();
});

app.all ("/author/:id", function (req, res, next) {
    res.header ("Access-Control-Allow-Origin", "*");
    res.header ("Access-Control-Allow-Headers", "X-Requested-with");
    next();
});

app.get ("/", async (req, res) => {
    const returnValue = await getInfo ('/');
    res.send (returnValue);
})

app.get ("/catalog", async (req, res) => {
    const returnValue = await getInfo ('/catalog');
    res.send (returnValue);
})

app.get ("/authors", async (req, res) => {
    const returnValue = await getInfo ('/authors');
    res.send (returnValue);
})

app.get ("/article/:id", async (req, res) => {
    const returnValue = await getInfo ('/article', req.params.id);

    if (returnValue != null){
        const article = {
            meta: returnValue [0],
            content: returnValue [1]
        }

        res.send (article);
    }
    else {
        res.send (null);
    }
})

app.get ("/author/:id", async (req, res) => {
    const returnValue = await getInfo ('/author', req.params.id);

    if (returnValue != null) {
        const author = {
            articlesCounter: returnValue [0],
            tagsCounter: returnValue [1],
            viewsCounter: returnValue [2]
        }

        res.send (author)
    }
    else {
        res.send (null);
    }
})

app.listen (5000, () => { console.log ("Server started on port 5000") })