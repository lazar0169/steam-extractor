export default {
    origin: (origin, cb) => {
        if (/localhost/.test(origin) || origin === undefined){
            cb(null, true);
            return;
        }
        cb(new Error('Not allowed'));
    },
};
