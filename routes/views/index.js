var express = require('express');
var router = express.Router();
let DataManager = require('../../data/data-manager');
let dm = new DataManager();

const months = {
    "Jan": 1,
    "Feb": 2,
    "Mar": 3,
    "Apr": 4,
    "May": 5,
    "Jun": 6,
    "Jul": 7,
    "Aug": 8,
    "Sep": 9,
    "Oct": 10,
    "Nov": 11,
    "Dec": 12
};

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('test', { title: 'Express' });
});

router.get('/songs', function(req, res, next) {
    res.render('songs-year', { title: 'Songs-year' });
});

router.get('/songs/:year', function(req, res, next) {
    var year = req.params.year;
    if (year == 'attributes') {
        return next();
    }
    res.render('songs-month', { title: 'Songs-month', year: year });
});

router.get('/songs/attributes', function(req, res, next) {
    var year = req.params.year;
    res.render('songs-attributes', { title: 'Songs-month', year: year });
});

router.get('/songs/attributes/:year', function(req, res, next) {
    var year = req.params.year;
    res.render('songs-attributes-month', { title: 'Songs-month', year: year });
});

router.get('/songs/attributes/:attr/:year/:month', function(req, res, next) {
    let year = req.params.year;
    year = parseInt(year);
    let month = req.params.month;
    let monthName = month;
    month = months[month];
    let attr = req.params.attr;
    dm.topSongsAttributes(attr, year, month, 5, (err, data) => {
        console.log('HI 2');
        res.render('songs-top', {
            title: 'Songs-month',
            year: year,
            month: monthName,
            attr: attr,
            songs: data,
            count: data.length
        });
    });

});

router.get('/artists', function(req, res, next) {
    dm.listArtists((err, data) => {
        res.render('artists', {
            title: 'Songs-year',
            data: data
        });
    });

});

router.get('/artists/:attr/:artist', function(req, res, next) {
    let artist = req.params.artist;
    let attr = req.params.attr;
    dm.popularSongsByArtist(artist, attr, 5, (err, data) => {
        if (err) {
            res.status(400);
        } else {
            res.render('artists-top', {
                title: 'Songs-year',
                artist: artist,
                attr: attr,
                songs: data,
                count: data.length
            });
        }
    });

});

router.get('/lucky', function(req, res, next) {
    dm.randomSongs(5, (err, data) => {
        if (err) {
            res.status(400);
        } else {
            res.render('random', {
                title: 'Songs-year',
                songs: data,
                count: data.length
            });
        }
    });

});

module.exports = router;