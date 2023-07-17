const fs = require ('fs')
const ARTICLEDIR = "C:/Main/Documents/Obsidian\ Vault/Moonless\ Project/Articles/"
const AUTHORDIR = "C:/Main/Documents/Obsidian\ Vault/Moonless\ Project/Authors/"

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

function sortDirectory (dir) {
    return dir.sort ( (a, b) => {
        let a1 = Number (a.replace (/\D/g, ""));
        let b1 = Number (b.replace (/\D/g, ""));
        return a1 - b1;
    })
}

async function GetAllMeta ()
{
    let meta = [];
    let dir = fs.readdirSync (ARTICLEDIR);
    dir = sortDirectory (dir);

    for (const filename of dir)
    {
        console.log (filename);
        const content = fs.readFileSync (ARTICLEDIR + filename, 'utf8');
        meta.push (FetchMeta (content)[0]);
    }

    meta = await AddRealNames (meta);
    return meta;
}

async function GetLastMeta ()
{
    let meta = [];
    let dir = fs.readdirSync (ARTICLEDIR);
    dir = sortDirectory (dir);

    for (let i = dir.length - 1; i > dir.length - 5; i--)
    {
        const content = fs.readFileSync (ARTICLEDIR + dir[i], 'utf8');
        meta.push (FetchMeta (content)[0]);
    }

    meta = await AddRealNames (meta);
    return meta;
}

async function GetArticle (id)
{
    try {
        const text = fs.readFileSync (ARTICLEDIR + id + ".md", 'utf8');

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

    const dir = fs.readdirSync (AUTHORDIR);
    for (const filename of dir)
    {
        const content = fs.readFileSync (AUTHORDIR + filename, 'utf8');
        info.push (JSON.parse (content)[0]);
    }

    return info;
}

module.exports = { GetAllMeta, GetLastMeta, GetArticle, GetAuthors };