import got from 'got';
import jsdom from 'jsdom';
import fs from 'fs';
import { promisify } from 'util';
import pkg from 'tough-cookie';
const { CookieJar } = pkg;
const { JSDOM } = jsdom;
let raw = fs.readFileSync('games.json');
let games = JSON.parse(raw);

const genres = [];

for (let game of games) {
    for  (let genre of game.genre) {
        if (!genres.includes(genre)) genres.push(genre);
    }
}

console.log(genres);

const getSite = async (site) => {
    const cookieJar = new CookieJar();
	const setCookie = promisify(cookieJar.setCookie.bind(cookieJar));
	await setCookie('birthtime=628470001', 'https://store.steampowered.com');
	await setCookie('lastagecheckage=1-0-1990', 'https://store.steampowered.com');
	await setCookie('wants_mature_content=1', 'https://store.steampowered.com');
    const res = await got(site, { cookieJar });
    const dom = new JSDOM(res.body);
    return dom;
}

const getElemFromSite = (dom, selector, all = false) => {
    return dom.window.document[all ? 'querySelectorAll' : 'querySelector'](selector);
}

const populate = async () => {
    let counter = 1;
    try {
        for (let game of games) {
            console.log(`${counter}. ${game.name}`);
            let genres = [];
            const dom = await getSite(game.url);
            const desc = getElemFromSite(dom, '.game_description_snippet').textContent.trim();
            const priceDom = getElemFromSite(dom, '.game_purchase_price.price');
            const genreDom = getElemFromSite(dom, '.details_block>a', true);
            for (let element of genreDom) {
                if (!element.className.includes('linkbar')) {
                    genres.push(element.textContent);
                } else {
                    break;
                }
            }
            console.log(genres.toString());
            const price = priceDom && (priceDom.textContent.includes('€') || priceDom.textContent.includes('Free')) ? priceDom.textContent.trim() : '15,99€';
            const allMetas = getElemFromSite(dom, 'meta', true);
            let rating;
            for (let meta of allMetas) {
                if (meta.getAttribute('itemprop') === 'ratingValue') {
                    rating = meta.content;
                    break;
                }
            }
            game.rating = rating;
            game.description = desc;
            game.price = price;
            game.genre = genres;
            ++counter;
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
    const dom = await getSite('https://store.steampowered.com/stats/Steam-Game-and-Player-Statistics?l=t'); 
    const children = await getElemFromSite(dom, '.gameLink', true);
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

// writeGames();


