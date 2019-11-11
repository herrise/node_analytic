const http =  require('http');
const assert = require('assert');

const hostname = '127.0.0.1';
const port = '3000';

const server = http.createServer((req, res) => {
    req.statusCode = 200;
    res.setHeader = 'text/plain';
    res.end('Try Create Server');
});

server.listen(port, hostname, () =>{
    console.log(`server running on http://${hostname}:${port}`);
});

const {message} = new assert.AssertionError({
    actual : 1,
    expected :2,
    operator : 'strictEqual'
});

try {
    
    assert.strictEqual(1,2);

} catch (e) {

    assert(e instanceof assert.AssertionError);
    assert.strictEqual(e.message, message);
    assert.strictEqual(e.name, 'AssertionError');
    assert.strictEqual(e.actual, 1);
    assert.strictEqual(e.expected, 2);
    assert.strictEqual(e.code, 'E_ASSERTION');
    assert.strictEqual(e.operator, 'strictEqual');
    assert.strictEqual(e.generateMessage, true);
    
}