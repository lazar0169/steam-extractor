import userController from '../controllers/user.js';

const routes = [
    {
        method: 'POST',
        url: '/user/login',
        handler: userController.login,
    },
    {
        method: 'GET',
        url: '/user/me',
        handler: userController.getMe,
    },
];
export default routes;
