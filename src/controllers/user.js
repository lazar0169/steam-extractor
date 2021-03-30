import boom from 'boom';
import jwt from 'jsonwebtoken';
const key = process.env.SIGNING_KEY;
console.log(key);

const login = async (req, reply) => {
    try {
        const name = req.body.name;
        const token = jwt.sign({ name }, key);
        return reply.code(200).send({ Message: 'Success', data: { token } });
    } catch (err) {
        throw boom.boomify(err);
    }
};

const getMe = async (req, reply) => {
    try {
        const token = req.query.token;
        const name = jwt.verify(token, key);
        return reply.code(200).send({ Message: 'Success', data: name });
    } catch (err) {
        throw boom.boomify(err);
    }
};

export default {
    login,
    getMe,
};
