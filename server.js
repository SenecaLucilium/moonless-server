const express = require ('express')
const { GetAllMeta, GetLastMeta, GetArticle, GetAuthors } = require ('./parsing.js')

//Теги сортировать по алфавиту
//Жестко почистить весь код и оптимизировать (оч жестко)
//Если ссылки на сервисы бусти или тг не предоставлены - делать их серыми (может быть подготовить в пеинте такие серые иконки, а в css вызывать соотв. отображение)
//В окошке фильтров добавить снизу "текущие фильтры"
//Писать дизайн для мобильников также
//Перенести все повсторяющиеся функции в отдельные

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
    console.log (meta);
    res.send (meta);
})

app.get ("/catalog", async (req, res) => {
    const meta = await GetAllMeta ();
    console.log (meta);
    res.send (meta);
})

app.get ("/authors", async (req, res) => {
    const info = await GetAuthors ();
    console.log (info);
    res.send (info);
})

app.get ("/article/:id", async (req, res) => {
    const returnValue = await GetArticle (req.params.id);
    console.log (returnValue);

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