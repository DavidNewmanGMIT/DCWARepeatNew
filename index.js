//Exprees function, top level.
var express = require('express')
var mySqlDAO = require('./mySqlDAO')
var mongoDAO = require('./mongoDAO')

var app = express();

app.set('view engine', 'ejs')

// Index Page
app.get('/', (req, res) => {
    res.send("<a href='/showCountries'>List Countries</a> </br> <a href='/showCities'>List Cities</a> </br> <a href='/showHoS'>List Heads of State</a>")
})

//List Countries
app.get('/Countries', (req, res) => {
    mySqlDAO.getCountries()
        .then((result) => {
            res.render('showCountries', {countries:result})
        })
        .catch((error) => {
            res.send(error)
        })
})

//List Cites
app.get('/Cities', (req, res) => {
    mySqlDAO.getCities()
        .then((result) => {
            res.render('showCities', {cities:result})
        })
        .catch((error) => {
            res.send(error)
        })
})

//List HeadsOfState
app.get('/HeadsOfState', (req, res) => {
    mongoDAO.getHeadsOfState()
    .then((documents) => {
        res.send(documents)
    })
    .catch((error) => {
        res.send(error)
    })
})

//add country
app.get('/addCountry', (req, res) => {
    mySqlDAO.getCountries()
        .then((result) => {
            res.render('showCountries', {countries:result})
        })
        .catch((error) => {
            res.send(error)
        })
})

app.get('/delete/:country', (req, res) => {
    mySQLDAO.deleteCountry(req.params.country)
        .then((result) => {
            if (result.affectedRows == 0) {
                res.send("<h4>Country: " + req.params.country + " doesn't exist!</h4></br><a href='/'>Home</a>")
            } else {
                res.send("<h4>Country: " + req.params.country + " deleted!</h4></br><a href='/'>Home</a>")
            } // If - Else - END
        }) // .then - END
        .catch((error) => {
            res.send("<h1>ERROR</h1> <br><br> <h2>" + req.params.country + " has cities, can't delete.</h2></br><a href='/'>Home</a>")
        }) // .catch - END
})

app.get('/addHeadOfState', (req, res) => {
    res.render("addHeadOfState")
})

app.post('/addCountry', 
    [check('co_code').isLength({min:1, max: 3}).withMessage("Country Code must be 3 characters!"),
        check('co_name').isLength({min:3}).withMessage("Country Name must be at least 3 characters!"),
        check('co_code')
        .exists()
        .custom(async co_code => {
            const value = await mySQLDAO.isCountryCodeUsed(co_code);
            if (value) {
                //error message
                throw new Error('ERROR: ' + co_code + ' already exists in the database!')
            } // If - END
        })
     .withMessage('ERROR: Country already exists in the database!')
    ],
    (req,res) => {
        var errors = validationResult(req)
        if(!errors.isEmpty()) {
            res.render("addCountry", {errors:errors.errors})
            console.log("ERROR: Adding new country was not successful!")
        } else {
            mySQLDAO.addCountry(req.body.co_code, req.body.co_name, req.body.co_details)
            res.redirect("/listCountries")
        }
})

app.listen(3000, () => {
    console.log("Report from port 3000")
})


