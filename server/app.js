const express = require('express');
const path = require('path');
const utils = require('./lib/hashUtils');
const partials = require('express-partials');
const bodyParser = require('body-parser');
const Auth = require('./middleware/auth');
const models = require('./models');

const app = express();

app.set('views', `${__dirname}/views`);
app.set('view engine', 'ejs');
app.use(partials());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));



app.get('/',
(req, res) => {
  res.render('index');
});

app.get('/create',
(req, res) => {
  res.render('index');
});

app.get('/links',
(req, res, next) => {
  models.Links.getAll()
    .then(links => {
      res.status(200).send(links);
    })
    .error(error => {
      res.status(500).send(error);
    });
});

app.post('/links',
(req, res, next) => {
  var url = req.body.url;
  if (!models.Links.isValidUrl(url)) {
    // send back a 404 if link is not valid
    return res.sendStatus(404);
  }

  return models.Links.get({ url })
    .then(link => {
      if (link) {
        throw link;
      }
      return models.Links.getUrlTitle(url);
    })
    .then(title => {
      return models.Links.create({
        url: url,
        title: title,
        baseUrl: req.headers.origin
      });
    })
    .then(results => {
      return models.Links.get({ id: results.insertId });
    })
    .then(link => {
      throw link;
    })
    .error(error => {
      res.status(500).send(error);
    })
    .catch(link => {
      res.status(200).send(link);
    });
});

/************************************************************/
// Write your authentication routes here
/************************************************************/

// get request for signup
app.get("/signup", (req,res) => {
  console.log("you are in the signup page!")
  res.render('signup');
});
// post request for signup
app.post("/signup", (req, res) => {
  // creates username and password
  var username = req.body.username;
  var password = req.body.password;

  // compare the username with the database
  // if exists then redirect to signup
  models.Users.get({ username })
    .then((userInfo) => {
      if(!userInfo) {
        // uses the functions from /models/users create
        models.Users.create({ username, password})
        .then(() => res.redirect('/').status(201).send("it worked fam!!!"))
        .catch((err) => res.status(401).send(err))
      } else {
        res.status(201).redirect('/signup')
      }
    })
    .catch((err) => res.status(401).send(err))
});




// get request for login
app.get("/login", (req,res) => {
  console.log("you are in the login page!")
  res.render('login');
});

app.post("/login", (req, res) => {
  // login username and password
  var { username, password } = req.body
  // if (username && password) {
  //   console.log("test",username)
  //   console.log("test2",password)



    // models.Users.getAll({ username, password })
    //   .then((data) => {
    //     // console.log("username", username);
    //     // console.log('pw', password);
    //     // console.log(data);
    //     if(username === data.username && password === data.password){
    //       console.log(data);
    //       res.redirect('/').status(200).send("message");
    //     } else {
    //       res.redirect('/login');
    //     }
    //     //compare the entered password with data returned from line 125?
    //   })
    //   .catch((err) => {
    //     console.log('hits .catch with error', err);
    //   })
    //   // .then(() => res.redirect('/').status(201).send("you have logged in"))
    //   // .catch((err) => res.status(401).send(err))


      models.Users.get({ username })
      .then((userInfo) => {
        console.log('username', username)
        console.log("password", password)
        // console.log("ui pw", userInfo.password)
        // console.log("salt", salt)
        console.log("ui", userInfo);
        if (userInfo) {
          console.log('psdlfdsfsdf' ,userInfo)
          if(models.Users.compare(password, userInfo.password, salt)) {
            console.log('this is the if statement',password)
            console.log("salt", salt)
            res.redirect('/')
          } else {
            res.redirect('/login')
          }
        } else {
          console.log("this is the else ")
          res.redirect('/login')
        }

      })
      .catch((err) => res.status(401).send(err))

      // if user exist
      // if password matches attempt
      // redirect homepage
      // else redirect to login page
    // else if user doesn't exist
    // redirect to login page

  //     models.Users.get({ username })
  //     .then((userInfo) => {
  //       if(!userInfo) {
  //         // uses the functions from /models/users create
  //         models.Users.create({ username, password})
  //         .then(() => res.redirect('/').status(201).send("it worked fam!!!"))
  //         .catch((err) => res.status(401).send(err))
  //       } else {
  //         res.status(201).redirect('/signup')
  //       }
  //     })
  //     .catch((err) => res.status(401).send(err))
  // });


});


/************************************************************/
// Handle the code parameter route last - if all other routes fail
// assume the route is a short code and try and handle it here.
// If the short-code doesn't exist, send the user to '/'
/************************************************************/

app.get('/:code', (req, res, next) => {

  return models.Links.get({ code: req.params.code })
    .tap(link => {

      if (!link) {
        throw new Error('Link does not exist');
      }
      return models.Clicks.create({ linkId: link.id });
    })
    .tap(link => {
      return models.Links.update(link, { visits: link.visits + 1 });
    })
    .then(({ url }) => {
      res.redirect(url);
    })
    .error(error => {
      res.status(500).send(error);
    })
    .catch(() => {
      res.redirect('/');
    });
});

module.exports = app;
