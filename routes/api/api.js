let DataManager = require('../../data/data-manager');
let express = require('express');
let router = express.Router();
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

router.get('/artists', function(req, res, next) {
    dm.listArtists((err, data) => {
        if (err) {
            res.status(400).json({ msg: 'Data not found' });
        } else {
            res.status(200).json(data);
        }
    });

});

router.get('/artists/:artist', function(req, res, next) {
    let artist = req.params.artist;
    dm.attributesByArtist(artist, (err, data) => {
        if (err) {
            res.status(400).json({ msg: 'Data not found' });
        } else {
            let series = [];
            Object.entries(data).forEach((entry) => {
                if (entry[0] != "_id") {
                    series.push({
                        x: entry[0],
                        y: entry[1]
                    });
                }
            });
            res.status(200).json(series);
        }
    });

});


router.get('/artists/:artist/top', function(req, res, next) {
    let artist = req.params.artist;
    dm.popularSongsByArtist(artist, 5, (err, data) => {
        if (err) {
            res.status(400).json({ msg: 'Data not found' });
        } else {
            res.status(200).json(data);
        }
    });

});

router.get('/songs/range/:start?/:end?', function(req, res, next) {
    let start = req.params.start;
    let end = req.params.end;
    if (!start) {
        start = 1921;
    } else {
        start = parseInt(start);
    }
    if (!end) {
        end = 2020;
    } else {
        end = parseInt(end);
    }
    dm.songsByYear(start, end, (err, data) => {
        if (err) {
            res.status(400).json({ msg: 'Data not found' });
        } else {
            res.status(200).json(data);
        }
    });

});

router.get('/songs/:year', function(req, res, next) {
    let year = req.params.year;
    if (year == 'attributes' || year == 'top') {
        return next();
    }
    year = parseInt(year);
    dm.songsByMonth(year, (err, data) => {
        if (err) {
            res.status(400).json({ msg: 'Data not found' });
        } else {
            res.status(200).json(data);
        }
    });

});


router.get('/songs/attributes/:start/:end?', function(req, res, next) {
    let start = req.params.start;
    let end = req.params.end;
    if (!start) {
        start = 1921;
    } else {
        start = parseInt(start);
    }
    if (!end) {
        return next();
    } else {
        end = parseInt(end);
    }
    dm.songsAttributes(start, end, (err, data) => {
        if (err) {
            res.status(400).json({ msg: 'Data not found' });
        } else {
            res.status(200).json(data);
        }
    });

});

router.get('/songs/attributes/:year', function(req, res, next) {
    let year = req.params.year;
    year = parseInt(year);
    dm.songsAttributesByMonth(year, (err, data) => {
        if (err) {
            res.status(400).json({ msg: 'Data not found' });
        } else {
            res.status(200).json(data);
        }
    });

});

router.get('/songs/top/:attr/:year/:month', function(req, res, next) {

    let year = req.params.year;
    year = parseInt(year);
    let month = req.params.month;
    month = months[month];
    let attr = req.params.attr;

    dm.topSongsAttributes(attr, year, month, 5, (err, data) => {
        if (err) {
            res.status(400).json({ msg: 'Data not found' });
        } else {
            res.status(200).json(data);
        }
    });

});

router.get('/lucky/:count?', function(req, res, next) {

    let count = req.params.count;
    if (!count) {
        count = 5;
    }
    dm.randomSongs(count, (err, data) => {
        if (err) {
            res.status(400).json({ msg: 'Data not found' });
        } else {
            res.status(200).json(data);
        }
    });

});




module.exports = router;