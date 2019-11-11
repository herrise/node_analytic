const esClient = require('./client');

esClient.ping({
    //ping
    requestTimeout : 1000
}, function (error){
    if (error) {
        Console.trace('elasticsearch cluster is down');
    }
    else {
        console.log('connected');
    }
});