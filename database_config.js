const fs = require ('fs');
const { MongoClient } = require ('mongodb');

require ('dotenv').config ();
const MONGODB_URL = process.env.MONGODB_URL;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;
const ARTICLEDIR = process.env.ARTICLEDIR;
const AUTHORDIR = process.env.AUTHORDIR;

function sortDirectory (dir) {
    return dir.sort ( (a, b) => {
        let a1 = Number (a.replace (/\D/g, ""));
        let b1 = Number (b.replace (/\D/g, ""));
        return a1 - b1;
    })
}

async function FetchMetaAuthors ()
{
    const fs = require ('fs');

    const info = [];
    const dir = fs.readdirSync (AUTHORDIR);

    for (const filename of dir)
    {
        const content = fs.readFileSync (AUTHORDIR + filename, 'utf8');
        info.push (JSON.parse (content)[0]);
    }

    return info;
}

async function AddRealNames (meta)
{
    const authors = await FetchMetaAuthors (AUTHORDIR);
    
    for (const article of meta) {
        for (const author of authors) {
            if (article.author === author.id) {
                article.realName = author.name;
                break;
            }
        }
    }
    
    return meta;
}

async function FetchMetaArticles () {
    const fs = require ('fs');

    let meta = [];
    let dir = fs.readdirSync (ARTICLEDIR);
    dir = sortDirectory (dir);

    for (const filename of dir) {
        const content = fs.readFileSync (ARTICLEDIR + filename, 'utf8');
        
        const articleMeta = JSON.parse (content.substring (content.indexOf ("---") + 4, content.indexOf ("---", 1) - 1))
        meta.push (articleMeta [0]);
    }

    meta = await AddRealNames (meta, AUTHORDIR);
    return meta;
}

async function createMongoDB () {
    const client = new MongoClient (MONGODB_URL);

    try {
        await client.connect ();
        const options = { ordered: true };

        const metaArticles = await FetchMetaArticles (ARTICLEDIR, AUTHORDIR);
        let collection = client.db (MONGODB_DB_NAME).collection ("ArticlesMeta");

        let result = await collection.insertMany (metaArticles, options);
        console.log (`${result.insertedCount} documents were inserted`);

        const metaAuthors = await FetchMetaAuthors (AUTHORDIR);
        collection = client.db (MONGODB_DB_NAME).collection ("AuthorsMeta");

        result = await collection.insertMany (metaAuthors, options);
        console.log (`${result.insertedCount} documents were inserted`);
    }
    catch (err) {
        console.log (err);
    }
    finally {
        await client.close();
    }
}

module.exports = { createMongoDB };