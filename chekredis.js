const redis = require('redis');
const client = redis.createClient(6379, 'localhost');

client.on('connect', () => {
    console.log('connected');
});

client.set('my', 'my test value', redis.print);
client.get('my test key', function (error, result) {
    if (error) {
        console.log(error);
        throw error;
    }
    console.log('GET result ->' + result);
});