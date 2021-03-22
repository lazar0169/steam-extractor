import got from 'got';
import jsdom from 'jsdom';
import fs from 'fs';
const { JSDOM } = jsdom;
let raw = fs.readFileSync('games.json');
let games = JSON.parse(raw);

const getElemFromSite = async (site, selector, all = false) => {
 const res = await got(site);
 const dom = new JSDOM(res.body);
 return dom.window.document[all ? 'querySelectorAll' : 'querySelector'](selector);
}

const populate = async () => {
    try {
        for (let game of games) {
            console.log(game.name);
            const desc = (await getElemFromSite(game.url, '.game_description_snippet')).textContent.trim();
            const allMetas = (await getElemFromSite(game.url, 'meta', true));
            let rating;
            for (let meta of allMetas) {
                if (meta.getAttribute('itemprop') === 'ratingValue') {
                    rating = meta.content;
                    break;
                }
            }
            console.log(rating);
            game.rating = rating;
            game.description = desc;
        }
    } catch (error) {
        console.error(error);
    }
}

const writeGames = async () => {
    await populate();
    fs.writeFileSync('populated.json', JSON.stringify(games));
}

const get100games = async () => {
    let all = [];
    const children = await getElemFromSite('https://store.steampowered.com/stats/Steam-Game-and-Player-Statistics?l=t', '.gameLink', true);
    for (let child of children) {
        all.push({
            id: Math.floor(Math.random() * 100000),
            name: child.textContent.trim(),
            url: child.getAttribute('href'),
        })
    }
    fs.writeFileSync('list.json', JSON.stringify(all)); 
}

// get100games();

writeGames();


