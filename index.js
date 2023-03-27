var express = require('express');
var app = express();

const { Sequelize, DataTypes } = require('sequelize');
// const sequelize = new Sequelize('sqlite::memory:'); // memory에 db를 올려서 쓰면 프로그램 끄면 날라가 

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
});

const Comments = sequelize.define('Comments', { // Comments : Table name
  // Model attributes are defined here
  content: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  // Other model options go here
});

(async() => {
await Comments.sync();
console.log("The table for the User model was just (re)created!");
})();

// post 쓸 때 필요 req.body read 하기위해 
// post 요청으로 body에 담아 값을 보낼때 express에서 어떻게 읽어야할지 기본 설정이 안되있어서 undefined로 오기때문에 설정해줘야 값 읽을 수 0
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded(현재)

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page
// app.get('/', function(req, res) {
//   res.render('index', {num : 3} );
// });
app.get('/', async function(req, res) {
  const comments = await Comments.findAll();

  // console.log(comments);

  res.render('index', { comments: comments});
});



app.post('/create', async function (req, res) {
  console.log(req.body)

  const { content } = req.body

  // Create a new user
  await Comments.create({ content: content });

  res.redirect('/') // 다시 get으로 가서 index page 표출

})

app.post('/update/:id', async function (req, res) {
  console.log(req.params)
  console.log(req.body)

  const { content } = req.body
  const { id } = req.params

  await Comments.update({ content: content }, {
    where: {
      id: id
    }
  });
  res.redirect('/') // 다시 get으로 가서 index page 표출
});

app.post('/delete/:id', async function (req, res) {
  console.log(req.params)

  const { id } = req.params

  await Comments.destroy({
    where: {
      id: id
    }
  });
  res.redirect('/') // 다시 get으로 가서 index page 표출
});

// about page
app.get('/about', function(req, res) { // a tag = get 방식
  res.render('about');
});

app.listen(3000);
console.log('Server is listening on port 3000');