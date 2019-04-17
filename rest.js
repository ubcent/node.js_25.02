const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const user = {
  username: 'admin',
  password: 'admin',
};

const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: ['*.domain.com', 'domain.com'] }));

app.post('/refresh', (req, res) => {

});

app.post('/auth', (req, res) => {
  const { username, password } = req.body;

  if(username === user.username && password === user.password) {
    // не забываем убрать sensitive информацию (password)
    res.json({ token: jwt.sign(user, 'secret') });
  } else {
    res.json({ message: 'Wrong credentials' });
  }
});

function checkAuth(req, res, next) {
  const auth = req.headers.authorization || '';
  const [, token] = auth.split(' ');
  if(token) {
    jwt.verify(token, 'secret', (err, decoded) => {
      if(err) {
        return res.json({ message: 'Wrong token' });
      }

      req.user = decoded;
      next();
    });
  } else {
    return res.json({ message: 'No token present' });
  }
}

app.use('/users', checkAuth);

app.get('/users', (req, res) => {
  res.json([
    { name: 'Vasya Pupkin', age: 30 },
    { name: 'Kolya Pupkin', age: 30 },
  ])
});

app.listen(8888);

// domain.com ->
// api.domain.com
// CORS
// domain.com -> preflight OPTIONS
// api.domain.com -> Access-Control-Allow-Origin
// отправка запроса разрешена
// браузер отправляет исходный запрос