import boom from 'boom';
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
        const id = Number(req.params.id);
        let game = games.find(game => game.id === id);
        return reply.code(200).send({ Message: 'Success', data: game });
    } catch (err) {
        throw boom.boomify(err);
    }
};

export default {
    getAllGames,
    getSingleGame,
};
