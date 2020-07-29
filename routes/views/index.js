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
    res.render('test', { title: 'Spotify data' });
});

router.get('/about', function(req, res, next) {
    res.render('about', { title: 'About' });
});

router.get('/songs', function(req, res, next) {
    res.render('songs-year', { title: 'Songs' });
});

router.get('/songs/:year', function(req, res, next) {
    var year = req.params.year;
    if (year == 'attributes') {
        return next();
    }
    res.render('songs-month', { title: 'Songs', year: year });
});

router.get('/songs/attributes', function(req, res, next) {
    var year = req.params.year;
    res.render('songs-attributes', { title: 'Songs', year: year });
});

router.get('/songs/attributes/:year', function(req, res, next) {
    var year = req.params.year;
    res.render('songs-attributes-month', { title: 'Songs', year: year });
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
            title: 'Songs',
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
            title: 'Artists',
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
                title: 'Artists',
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
                title: ':)',
                songs: data,
                count: data.length
            });
        }
    });

});

router.get('/top/:year', function(req, res, next) {
    let year = req.params.year;
    year = parseInt(year);
    dm.topSongsOfYear('popularity', year, 5, (err, data) => {
        if (err) {
            res.status(400);
        } else {
            res.render('top-year', {
                title: 'Top 5',
                songs: data,
                count: data.length,
                year: year
            });
        }
    });

});

module.exports = router;