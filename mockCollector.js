const http = require('http');

// Create an HTTP server
const server = http.createServer((req, res) => {
    if (req.url === '/v1/traces' && req.method === 'POST') {
        let body = '';
        
        // Read data from the request
        req.on('data', chunk => {
            body += chunk.toString();
        });

        // When the entire body has been read
        req.on('end', () => {
            console.log('Received data on /v1/traces:', body);

            // Send a response back to the client
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('Data received\n');
        });
    } else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Not Found\n');
    }
});

// Start the server on port 4318
server.listen(4318, () => {
    console.log('Server listening on http://localhost:4318');
});
