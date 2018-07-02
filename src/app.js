const express = require('express');
const bodyParser = require('body-parser');
const TronRouter = require('./tron.js');

const app = express();
const tronRouter = new TronRouter();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST',
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With, content-type, Authorization, Content-Type',
  );
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use('/:route', async (req, res) => {
  if (tronRouter.isRoute(req.params.route)) {
    return handleRequest(res, tronRouter.execRequest(req.params.route));
  } else {
    res.json({
      successful: false,
      message: `Request endpoint doesn\'t exist. Methods available: ${tronRouter.methods.join(', ')}`
    });
  }
});

app.use('/*', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Tronix.js Gateway</title>
      </head>
      <body>
        <h1>Available endpoints</h1>
        <ul>
          ${tronRouter.methods.map(method => {
            return `<li><a href="/${method}">${method}</a></li>`;
          }).sort().join('\n')}
        </ul>
      </body>
    </html>
  `);
});

const handleRequest = async (res, promise) => {
  try {
    const data = await promise();
    res.json({
      successful: true,
      response: data
    });
  } catch(err) {
    res.json({
      successful: false,
      response: err.toString()
    })
  }
};

app.listen(3000, () => {
  console.log('Listening on port 3000!');
});
