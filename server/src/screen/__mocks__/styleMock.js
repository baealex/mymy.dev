const handler = {
    get() {
        return new Proxy({}, {
            get(_, prop) {
                return prop;
            }
        });
    }
};

module.exports = new Proxy({}, handler);
