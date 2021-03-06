/* eslint-disable no-console */
const async = () => {
    return Promise.resolve();
};

class Server {
    getApp(config) {
        return async()
            .then(() => require('./../db').init(config.connectionString))
            .then((db) => require('./../data').init(db))
            .then((data) => require('./../app').init(data, config))
            .then(({ app, http }) => {
                return Promise.resolve({ app, http });
            })
            .catch((err) => {
                console.log(err);
                return Promise.reject(err);
            });
    }

    run(config) {
        return this.getApp(config)
            .then(({ http }) => {
                this.instance = http;
                this.instance.listen(config.port, () =>
                    // eslint-disable-next-line max-len
                    console.log(`Car Rentals is now live at ${config.url}:${config.port}`));
                this.port = config.port;
                this.connectionString = config.connectionString;
                return Promise.resolve(this.instance);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    stop(dropDatabase) {
        return async()
            .then(() => {
                if (!this.instance) {
                    return Promise.reject('No parameter for server');
                }
                return Promise.resolve(this.instance);
            })
            .then((server) => {
                return server.close(() => {
                    console.log(`Server at: ${this.port} now closed `);
                });
            })
            .then(() => {
                if (dropDatabase) {
                    const { MongoClient } = require('mongodb');
                    return MongoClient.connect(this.connectionString)
                        .then((db) => {
                            return db.dropDatabase();
                        })
                        .then(() => {
                            // eslint-disable-next-line max-len
                            console.log(`Database: ${this.connectionString} sucessfully dropped`);
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                }
                return Promise.resolve();
            })
            .catch((err) => {
                console.log(err);
            });
    }
}


module.exports = { Server };
