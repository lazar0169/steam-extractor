import boom from 'boom';
import { getCommentsFromUrl } from '../extraction.js';
import games from '../../games.json';

const getAllGames = async (_req, reply) => {
    try {
        return reply.code(200).send({ Message: 'Success', data: games });
    } catch (err) {
        throw boom.boomify(err);
    }
};

const getSingleGame = async (req, reply) => {
    try {
        const id = req.params.id;
        let game = games.find((game) => game.id === id);
        if (game) {
            game.comments = game.comments || (await getCommentsFromUrl(game.commentsUrl));
            return reply.code(200).send({ Message: 'Success', data: game });
        }
        return reply.code(404).send({ Message: 'Game not found!' });
    } catch (err) {
        throw boom.boomify(err);
    }
};

export default {
    getAllGames,
    getSingleGame,
};
