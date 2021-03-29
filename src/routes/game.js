import gameController from '../controllers/game.js';

const routes = [
    {
        method: 'GET',
        url: '/games',
        handler: gameController.getAllGames,
    },
    {
        method: 'GET',
        url: '/games/:id',
        handler: gameController.getSingleGame,
    },
];
export default routes;
