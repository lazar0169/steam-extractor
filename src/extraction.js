import got from 'got';
import jsdom from 'jsdom';
import fs from 'fs';
import fetch from 'node-fetch';
import faker from 'faker';
import { promisify } from 'util';
import pkg from 'tough-cookie';
const { CookieJar } = pkg;
const { JSDOM } = jsdom;

export const getSite = async (site) => {
    const cookieJar = new CookieJar();
    const setCookie = promisify(cookieJar.setCookie.bind(cookieJar));
    await setCookie('birthtime=628470001', 'https://store.steampowered.com');
    await setCookie('lastagecheckage=1-0-1990', 'https://store.steampowered.com');
    await setCookie('wants_mature_content=1', 'https://store.steampowered.com');
    const res = await got(site, { cookieJar });
    const dom = new JSDOM(res.body);
    return dom;
};

export const getElemFromSite = (dom, selector, all = false) => {
    return dom.window.document[all ? 'querySelectorAll' : 'querySelector'](selector);
};

export const getCommentsFromUrl = async (url) => {
    const dom = await getSite(`https://www.metacritic.com/${url}`);
    const commElements = getElemFromSite(dom, '.reviews.user_reviews .blurb.blurb_expanded', true);
    const comments = [];
    for (let comm of commElements) {
        comments.push({
            name: faker.name.findName(),
            comment: comm.textContent.trim().replace(/\n/g, '').replace(/\t/g, '')
        });
    }
    return comments;
};

const populate = async () => {
    const raw = fs.readFileSync('list.json');
    const list = JSON.parse(raw);
    let games = [];
    let counter = 1;
    try {
        for (let game of list) {
            console.log(`${counter}. ${game.name}`);
            let genres = [];
            const dom = await getSite(game.url);
            const descDom = getElemFromSite(dom, '.game_description_snippet');
            if (!descDom) {
                continue;
            }
            const desc = descDom.textContent.trim();
            const priceDom = getElemFromSite(dom, '.game_purchase_price.price');
            const genreDom = getElemFromSite(dom, '.details_block>a', true);
            for (let element of genreDom) {
                if (!element.className.includes('linkbar')) {
                    genres.push(element.textContent);
                } else {
                    break;
                }
            }
            const commentsDom = await getSite(`https://www.metacritic.com/search/all/${game.name}/results`);
            const linkDom = getElemFromSite(commentsDom, '.result.first_result a');
            const commentsUrl = linkDom && linkDom.getAttribute('href');
            game.commentsUrl = commentsUrl;
            const price =
                priceDom && (priceDom.textContent.includes('€') || priceDom.textContent.includes('Free'))
                    ? priceDom.textContent.trim()
                    : '15,99€';
            const allMetas = getElemFromSite(dom, 'meta', true);
            let rating;
            for (let meta of allMetas) {
                if (meta.getAttribute('itemprop') === 'ratingValue') {
                    rating = Number(meta.content);
                    break;
                }
            }
            const gameRes = await fetch(`https://store.steampowered.com/api/appdetails?appids=${game.id}`);
            const gameInfo = await gameRes.json();
            game.images = gameInfo[game.id].data.screenshots;
            game.date = gameInfo[game.id].data.release_date.date
            game.rating = rating;
            game.description = desc;
            game.price = price;
            game.genre = genres;
            games.push(game);
            ++counter;
        }
    } catch (error) {
        console.error(error);
    }
    return games;
};

export const writeGames = async () => {
    const games = await populate();
    fs.writeFileSync('games.json', JSON.stringify(games));
    fs.unlinkSync('list.json');
};

export const get100games = async () => {
    let all = [];
    const dom = await getSite('https://store.steampowered.com/stats/Steam-Game-and-Player-Statistics?l=t');
    const children = await getElemFromSite(dom, '.gameLink', true);
    for (let child of children) {
        const link = child.getAttribute('href');
        all.push({
            id: link.split('/app/')[1].split('/')[0],
            name: child.textContent.trim(),
            url: link,
        });
    }
    fs.writeFileSync('list.json', JSON.stringify(all));
};

export default async () => {
    await get100games();
    await writeGames();
};
