var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var app = express();

var provinces_arr = [];

app.get('/', function(req, res) {

    request('http://en.wikipedia.org/wiki/Provinces_of_Indonesia', function(error, response, html) {

        var $ = cheerio.load(html);

        var table_row = $('table.wikitable').first().find('tr');

        async.each(table_row, function( row, callback ) {

            var json = {};

            var current_row = $(row);

            if(current_row.children('td').length) {

                json.seal = current_row.children('td').eq(0).find('img').attr('src');

                json.province = current_row.children('td').eq(1).text();

                json.iso_3 = current_row.children('td').eq(2).text();

                json.capital = current_row.children('td').eq(3).text();

                json.population = current_row.children('td').eq(4).text();

                json.area = current_row.children('td').eq(5).text();

                json.population_density = current_row.children('td').eq(6).text()

                json.geographical = current_row.children('td').eq(7).text()

                json.number_of_cities = current_row.children('td').eq(8).text()

                json.number_of_regencies = current_row.children('td').eq(9).text()

                json.number_of_districts = current_row.children('td').eq(10).text()

                json.number_of_villages = current_row.children('td').eq(11).text()

                provinces_arr.push(json);

            }

            callback();

        }, function (err) {
            res.json(provinces_arr);
            fs.writeFile('data.json', JSON.stringify(provinces_arr, null, 4));
        });
    })
})

app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;
