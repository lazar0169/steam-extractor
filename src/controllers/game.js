import boom from 'boom';
import games from '../../games.json';

const getAllGames = async (req, reply) => {
    try {
        return reply.code(200).send(games);
    } catch (err) {
        throw boom.boomify(err);
    }
};
// get a single book by id
const getSingleGame = async (req, reply) => {
    try {
        const id = req.params.id;
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
