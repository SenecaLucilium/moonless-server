const fs = require ('fs')
const { MongoClient } = require ('mongodb')

require ('dotenv').config ();
const MONGODB_URL = process.env.MONGODB_URL;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;
const ARTICLEDIR = process.env.ARTICLEDIR;

async function GetAllMeta (client)
{
    const info = [];

    try {
        await client.connect ();
        const collection = client.db (MONGODB_DB_NAME).collection ("ArticlesMeta");

        for await (const article of collection.find()) {
            info.push (article);
        } 
        
    }
    catch (e) {
        console.log ("Error: " + e);
    }
    finally {
        return info;
    }
}

async function GetLastMeta (client) {
    const info = [];

    try {
        await client.connect ();
        const collection = client.db (MONGODB_DB_NAME).collection ("ArticlesMeta");

        const sort = { id: -1 };

        for await (const article of collection.find ().sort (sort).limit (5)) {
            info.push (article);
        } 
        
    }
    catch (e) {
        console.log ("Error: " + e);
    }
    finally {
        return info;
    }
}

async function GetArticle (client, id) {
    let text = null;
    let meta = null;

    try {
        text = fs.readFileSync (ARTICLEDIR + id + ".md", 'utf8');

        await client.connect ();
        const collection = client.db (MONGODB_DB_NAME).collection ("ArticlesMeta");
        const query = { "id": Number(id) };

        await collection.updateOne (
            query,
            { $inc: { "views": 1, } }
        )

        meta = await collection.findOne (query);

        
    }
    catch (e) {
        console.log ("No such article: " + e);
    }
    finally {
        return [meta, text];
    }
}

async function GetAuthors (client) {
    const info = [];

    try {
        await client.connect ();
        const collection = client.db (MONGODB_DB_NAME).collection ("AuthorsMeta");

        for await (const author of collection.find ()) {
            info.push (author);
        } 
        
    }
    catch (e) {
        console.log ("Error: " + e);
    }
    finally {
        return info;
    }
}

async function getInfo (caseName, id = null) {
    const client = new MongoClient (MONGODB_URL);
    let info = null;

    try {
        await client.connect ();

        switch (caseName) {
            case '/':
                info = await GetLastMeta (client);
                break;
            case '/catalog':
                info = await GetAllMeta (client);
                break;
            case '/authors':
                info = await GetAuthors (client);
                break;
            case '/article':
                info = await GetArticle (client, id);
                break;
            default:
                throw "404 Error";
        }
    }
    catch (err) {
        console.log (err);
    }
    finally {
        await client.close();
        return info;
    }
}

module.exports = { getInfo };