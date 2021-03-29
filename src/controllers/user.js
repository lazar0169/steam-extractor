import boom from 'boom';
import jwt from 'jsonwebtoken';

const login = async (req, reply) => {
    try {
        const name = req.params.name;
        const token = jwt.sign(name);
        return reply.code(200).send({ Message: 'Success', data: token });
    } catch (err) {
        throw boom.boomify(err);
    }
};

const getMe = async (req, reply) => {
    try {
        const token = req.params.token;
        const name = jwt.verify(token);
        return reply.code(200).send({ Message: 'Success', data: name });
    } catch (err) {
        throw boom.boomify(err);
    }
};

export default {
    login,
    getMe,
};
