var mysql = require('promise-mysql')

//pool
var pool

mysql.createPool({
    connectionLimit : 3,
    host            : 'localhost',
    user            : 'root',
    password        : 'bungiez7',
    database        : 'geography'
})
.then((result) => {
    pool = result
})
.catch((error) => {
    console.log(error)
});

var getCities = function() {
    return new Promise((resolve, reject) => {
    pool.query('select * from city')
        .then((result) => {
            resolve(result)
        })
        .catch((error) => {
            reject(error)
        })
    })
}

var getCountries = function() {
    return new Promise((resolve, reject) => {
        pool.query('select * from country')
        .then((result) => {
            resolve(result)
        })
        .catch((error) => {
            reject(error)
        })
    })
}

var deleteCountry = function(co_code) {
    return new Promise((resolve, reject) => {
        var myQuery = {
            sql: 'delete from country where co_code = ?',
            values: [co_code]
        }
        pool.query(myQuery)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

var addCountry = function(co_code, co_name, co_details) {
    return new Promise((resolve, reject) => {
        var myQuery = {
            sql: 'insert into country values (?, ?, ?)',
            values: [co_code, co_name, co_details]
        }
        pool.query(myQuery)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

// cc check
var isCountryCodeUsed = function(co_code){
    return new Promise((resolve,reject) => {
        pool.query('select count(*) as total from country where co_code = ?',
        [co_code], function(error, result, fields){
            if(!error){
                return resolve(result[0].total > 0);
            } else {
                return reject(new Error('ERROR'));
            }
        });
    })
}

var updateCountry = function(co_code, co_name, co_details) {
    return new Promise((resolve, reject) => {
        var myQuery = {
            sql: 'update country set co_name=?, co_details=? where co_code=?',
            values: [co_name, co_details, co_code]
        }
        pool.query(myQuery)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

module.exports = { getCities, getCountries,addCountries }