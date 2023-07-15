const express = require ('express')
const { GetAllMeta, GetLastMeta, GetArticle, GetAuthors } = require ('./parsing.js')

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

app.get ("/", async (req, res) => {
    const meta = await GetLastMeta ();
    res.send (meta);
})

app.get ("/catalog", async (req, res) => {
    const meta = await GetAllMeta ();
    res.send (meta);
})

app.get ("/authors", async (req, res) => {
    const info = await GetAuthors ();
    res.send (info);
})

app.get ("/article/:id", async (req, res) => {
    const returnValue = await GetArticle (req.params.id);

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

app.listen (5000, () => { console.log ("Server started on port 5000") })