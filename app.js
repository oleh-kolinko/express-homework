const express = require('express'); //get express from modules
//requires the express framework sets to const express

const bodyParser = require('body-parser');//get body parser module

const app = express(); //run constuctor on express app - main object that we will be working with all time
//runs the built in method express

app.use(express.static('public'));// Use public folder for all CS JS IMG etc
app.set('views', __dirname + '/views');// Get all html files from views folders
app.set('view engine','ejs'); // set view engige to read ejs files instead of html

const expessLayout = require ('express-ejs-layouts'); //require ejs-layouts
app.use(expessLayout);//Use layouts
app.set('layout', 'layouts/main-layout');//set main layout(blueprint of section that will repeat on all pages) for all pages
app.use(bodyParser.urlencoded( {extended: true} ));//Configure body parser for post requests

const SpotifyWebApi = require('spotify-web-api-node');//Get spotify api
const spotify = new SpotifyWebApi();//Init spotify

app.get('/', (req, resp, next) =>{
  resp.render('index');//Show index page on get request with url '/'
});

app.get('/about', (req, resp, next) =>{
  resp.render('about');////Show about page on get request with url 'about'
});

app.get('/celebrity', (req, resp, next) =>{

  const bday = new Date (1973,9,26);
  const today = new Date();

  let pastBday;//Is his bday already past this year
  if(today.getMonth > bday.getMonth){
     pastBday = true;
  }else {
     pastBday = false;
  }

  let age = today.getFullYear() - bday.getFullYear();
  if(!pastBday) age--;

  let monthToBday;
  if(pastBday){
    monthToBday = (12 - today.getMonth()) + bday.getMonth();
  }else{
    monthToBday = bday.getMonth() - today.getMonth();
  }

  let daysToBday;
  if(today.getDate() > bday.getDate()){
    daysToBday = (30 - today.getDate()) + bday.getDate();
  }else{
    daysToBday = bday.getDate() - today.getDate();
  }


  const data = {
    age : age,
    monthToBday : monthToBday,
    bday: bday.getFullYear() + '/' + bday.getMonth() + '/' + bday.getDate(),
    daysToBday: daysToBday
  };

  resp.render('celebrity',data);
});

app.get('/login', (req, res, next)=>{
  res.render('login');
});

app.post('/login', (req, res, next)=>{
  const email = req.body.email;
  const password = req.body.password;

  if( email === 'pizza@gmail.com' && password === 'pizza'){
    res.render('welcome');
  }else{
    res.render('login');
  }
});

app.get('/search-spotify', (req, res, next) =>{
    const searchTerm = req.query.searchTerm;

    //Spotify api search
    spotify.searchTracks(searchTerm, {} , (err,results) =>{
      if(err){
        res.send('Oh no! Error');
        return;
      }

      const theTrack = results.body.tracks.items[0];

      res.render('track-search', {
        track : theTrack,
        searchTerm: searchTerm
      });
    });

});

app.listen(3000, ()=>{
  console.log('BackEnd Online!');
});
