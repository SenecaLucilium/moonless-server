const fs = require ('fs')
const ArticleDir = "./Tests for Moonless/"
const AuthorDir = "./Test Authors/"

function FetchContent (text)
{
    const content = text.substring (text.indexOf ("---", 1) + 4)
    return content
}

function FetchMeta (text)
{
    const meta = JSON.parse (text.substring (text.indexOf ("---") + 4, text.indexOf ("---", 1) - 1))
    return meta
}

async function AddRealNames (meta)
{
    const authors = await GetAuthors ();
    
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

async function GetAllMeta ()
{
    let meta = [];
    const dir = fs.readdirSync (ArticleDir);

    for (const filename of dir)
    {
        const content = fs.readFileSync (ArticleDir + filename, 'utf8');
        meta.push (FetchMeta (content)[0]);
    }

    meta = await AddRealNames (meta);
    return meta;
}

async function GetLastMeta ()
{
    let meta = [];
    const dir = fs.readdirSync (ArticleDir);

    for (let i = dir.length - 1; i > dir.length - 5; i--)
    {
        const content = fs.readFileSync (ArticleDir + dir[i], 'utf8');
        meta.push (FetchMeta (content)[0]);
    }

    meta = await AddRealNames (meta);
    return meta;
}

async function GetArticle (id)
{
    try {
        const text = fs.readFileSync (ArticleDir + id + ".md", 'utf8');

        let meta = FetchMeta (text)[0];
        const content = FetchContent (text);
        
        const authors = await GetAuthors ();
        for (const author of authors) {
            if (meta.author === author.id) {
                meta.realName = author.name;
                break;
            }
        }
        return [meta, content];
    }
    catch (e) {
        console.log ("No such article: " + e);
    }

    return null;
}

async function GetAuthors ()
{
    const info = [];

    const dir = fs.readdirSync (AuthorDir);
    for (const filename of dir)
    {
        const content = fs.readFileSync (AuthorDir + filename, 'utf8');
        info.push (JSON.parse (content)[0]);
    }

    return info;
}

module.exports = { GetAllMeta, GetLastMeta, GetArticle, GetAuthors };