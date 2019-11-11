const esClient = require('./client');

esClient.cluster.health({}, function (err, res, status) {
    console.log("-- Client Health --", res);
});