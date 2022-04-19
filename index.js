require('dotenv').config()
const _ = require('lodash');

const express = require('express');
const { get } = require('express/lib/request');
const app = express();

// enable the static folder...
app.use(express.static('public'));
// enable the req.body object
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// import the dataset to be used here
const garments = require('./garments.json');

const jwt = require('jsonwebtoken')
app.use(express.json())

// API routes to be added here

app.get('/api/garments', authenticateToken, (req, res) => {
	const gender = req.query.gender;
	const season = req.query.season;

	const filteredGarments = garments.filter(garment => {
		// if both gender & season was supplied
		if (gender != 'All' && season != 'All') {
			return garment.gender === gender
				&& garment.season === season;
		} else if (gender != 'All') { // if gender was supplied
			return garment.gender === gender
		} else if (season != 'All') { // if season was supplied
			return garment.season === season
		}
		return true;
	});
	// note that this route just send JSON data to the browser
	// there is no template
	res.json({ garments: filteredGarments });
});
app.get('/api/garments/price/:price', authenticateToken, (req, res) => {
	const maxPrice = Number(req.params.price);
	const filteredGarments = garments.filter( garment => {
		// filter only if the maxPrice is bigger than maxPrice
		if (maxPrice > 0) {
			return garment.price <= maxPrice;
		}
		return true;
	});

	res.json({ 
		garments : filteredGarments
	});
});
app.post('/api/garments', authenticateToken, (req, res) => {

	// get the fields send in from req.body
	const {
		description,
		img,
		gender,
		season,
		price
	} = req.body;

	// add some validation to see if all the fields are there.
	// only 3 fields are made mandatory here
	// you can change that

	if (!description || !img || !price) {
		res.json({
			status: 'error',
			message: 'Please fill in the empty fields',
		});
	} else if (
		garments.find((garment) =>
		  _.isEqual(garment, {description, img, gender, season, price}),)) 
		{
		res.json({
		  status: 'error',
		  message: 'Garment already exists',
		});
	  }else {

		// you can check for duplicates here using garments.find
		
		// add a new entry into the garments list
		garments.push({
			description,
			img,
			gender,
			season,
			price
		});

		res.json({
			status: 'success',
			message: 'New garment added.',
		});
	}

});

const generateAccessToken = (user) => {
	return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
	  expiresIn: '24h',
	});
  };
  
  app.post('/auth', (req, res) => {
	const username = req.query.username;
	if (username == 'matjutapretty') {
	  const user = {username: 'matjutapretty'};
	  const accessToken = generateAccessToken(user);
	  //const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '24h'});
	  res.json({accessToken: accessToken});
	}
	res.sendStatus(401);
  });
  
  function authenticateToken(req, res, next) {
	const token = req.query.token;
	if (token == null) return res.sendStatus(401);
  
	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
	  if (err) return res.sendStatus(403);
	  req.user = user;
	  next();
	});
  }

const PORT = process.env.PORT || 4020;
app.listen(PORT, function () {
	console.log(`App started on port ${PORT}`)
});

