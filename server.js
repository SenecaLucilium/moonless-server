const express = require ('express')
const cors = require ('cors')
const { GetAllMeta, GetLastMeta, GetArticle, GetAuthors } = require ('./parsing.js')

//Перенести все доволнительные вызовы сервера на сами вызовы
//Теги сортировать по алфавиту
//Жестко почистить весь код и оптимизировать (оч жестко)
//Если ссылки на сервисы бусти или тг не предоставлены - делать их серыми (может быть подготовить в пеинте такие серые иконки, а в css вызывать соотв. отображение)
//В окошке фильтров добавить снизу "текущие фильтры"
//Писать дизайн для мобильников также
//Перенести все повсторяющиеся функции в отдельные

const app = express ()

// app (cors());

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