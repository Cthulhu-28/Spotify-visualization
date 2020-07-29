const MongoClient = require('mongodb').MongoClient;
const moment = require('moment')
const uri = require('../secret/secret');



function DataManager() {

    this.listArtists = function(callback) {
        const client = new MongoClient(uri, { useNewUrlParser: true });
        client.connect((err, db) => {
            if (err) {
                console.log(err);
                callback(err, []);
            } else {
                let dbo = db.db();
                let collection = dbo.collection('spotify_tracks');
                collection.distinct('artists', (err, data) => {
                    client.close();
                    callback(err, data);
                });

            }
        });
    }

    this.songsByYear = function(start, end, callback) {
        const client = new MongoClient(uri, { useNewUrlParser: true });
        client.connect((err, db) => {
            if (err) {
                console.log(err);
                callback(err, []);
            } else {
                let dbo = db.db();

                var collection = dbo.collection("tracks");

                var options = {
                    allowDiskUse: false
                };

                var pipeline = [{
                        "$group": {
                            "_id": "$year",
                            "count": {
                                "$sum": 1.0
                            }
                        }
                    },
                    {
                        "$match": {
                            "_id": { "$gte": start, "$lte": end }
                        }
                    },
                    {
                        "$sort": {
                            "_id": 1
                        }
                    },
                ];

                var cursor = collection.aggregate(pipeline, options);
                data = [];
                cursor.forEach(
                    function(doc) {
                        data.push({ x: doc._id, y: doc.count });
                    },
                    function(err) {
                        client.close();
                        callback(err, data);
                    }
                );
                // client.close();

            }
        });
    }


    this.songsByMonth = function(year, callback) {
        const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
        ];
        const client = new MongoClient(uri, { useNewUrlParser: true });
        client.connect((err, db) => {
            if (err) {
                console.log(err);
                callback(err, []);
            } else {
                let dbo = db.db();

                var collection = dbo.collection("tracks");

                var options = {
                    allowDiskUse: false
                };

                var pipeline = [{
                        "$match": {
                            "release_date": {
                                "$ne": moment("1799-12-31 18:00:00.000-06:00").toDate()
                            },
                            "year": year
                        }
                    },
                    {
                        "$group": {
                            "_id": {
                                "$month": "$release_date"
                            },
                            "count": {
                                "$sum": 1.0
                            }
                        }
                    },
                    {
                        "$sort": {
                            "_id": 1.0
                        }
                    },
                    {
                        "$addFields": {
                            "month": {
                                "$let": {
                                    "vars": {
                                        "monthString": [
                                            "",
                                            "Jan",
                                            "Feb",
                                            "Mar",
                                            "Apr",
                                            "May",
                                            "Jun",
                                            "Jul",
                                            "Aug",
                                            "Sep",
                                            "Oct",
                                            "Nov",
                                            "Dec"
                                        ]
                                    },
                                    "in": {
                                        "$arrayElemAt": [
                                            "$$monthString",
                                            "$_id"
                                        ]
                                    }
                                }
                            }
                        }
                    }
                ];

                var cursor = collection.aggregate(pipeline, options);
                data = [];
                cursor.forEach(
                    function(doc) {
                        data.push({
                            x: doc.month,
                            y: doc.count
                        });
                    },
                    function(err) {
                        tmp = []
                        for (let month of months) {
                            let row = data.find(e => e.x == month);
                            if (row) {
                                tmp.push({
                                    x: month,
                                    y: row.y
                                })
                            } else {
                                tmp.push({
                                    x: month,
                                    y: 0
                                })
                            }
                        }
                        client.close();
                        callback(err, tmp);
                    }
                );
                // client.close();

            }
        });
    }


    this.attributesByArtist = function(artist, callback) {
        const client = new MongoClient(uri, { useNewUrlParser: true });
        client.connect((err, db) => {
            if (err) {
                console.log(err);
                callback(err, []);
            } else {
                let dbo = db.db();

                var collection = dbo.collection("tracks");

                var options = {
                    allowDiskUse: false
                };

                var pipeline = [{
                        "$match": {
                            "artists": artist
                        }
                    },
                    {
                        "$group": {
                            "_id": "$artists",
                            "danceability": {
                                "$avg": "$danceability"
                            },
                            "energy": {
                                "$avg": "$energy"
                            },
                            "instrumentalness": {
                                "$avg": "$instrumentalness"
                            },
                            "liveness": {
                                "$avg": "$liveness"
                            },
                            "speechiness": {
                                "$avg": "$speechiness"
                            },
                            "valence": {
                                "$avg": "$valence"
                            }
                        }
                    }
                ];

                var cursor = collection.aggregate(pipeline, options);
                data = [];
                cursor.forEach(
                    function(doc) {
                        data = doc;
                    },
                    function(err) {
                        client.close();
                        callback(err, data);
                    }
                );
            }
        });
    }

    this.popularSongsByArtist = function(artist, attr, count, callback) {
        const client = new MongoClient(uri, { useNewUrlParser: true });
        client.connect((err, db) => {
            if (err) {
                console.log(err);
                callback(err, []);
            } else {
                let dbo = db.db();

                var collection = dbo.collection("tracks");

                var options = {
                    allowDiskUse: false
                };

                var pipeline = [{
                        "$match": {
                            "artists": artist
                        }
                    },
                    {
                        "$project": {
                            "artists": "$artists",
                            "song": "$id",
                            "name": "$name",
                            "attr": `$${attr}`
                        }
                    },
                    {
                        "$sort": {
                            "attr": -1.0
                        }
                    },
                    {
                        "$limit": count
                    }
                ];

                var cursor = collection.aggregate(pipeline, options);
                data = [];
                cursor.forEach(
                    function(doc) {
                        data.push(doc);
                    },
                    function(err) {
                        client.close();
                        callback(err, data);
                    }
                );
            }
        });
    }

    this.songsAttributes = function(start, end, callback) {
        const client = new MongoClient(uri, { useNewUrlParser: true });
        client.connect((err, db) => {
            if (err) {
                console.log(err);
                callback(err, []);
            } else {
                let dbo = db.db();

                var collection = dbo.collection("tracks");

                var options = {
                    allowDiskUse: false
                };

                var pipeline = [{
                        "$group": {
                            "_id": "$year",
                            "danceability": {
                                "$avg": "$danceability"
                            },
                            "energy": {
                                "$avg": "$energy"
                            },
                            "instrumentalness": {
                                "$avg": "$instrumentalness"
                            },
                            "liveness": {
                                "$avg": "$liveness"
                            },
                            "speechiness": {
                                "$avg": "$speechiness"
                            },
                            "valence": {
                                "$avg": "$valence"
                            }
                        }
                    },
                    {
                        "$match": {
                            "_id": { "$gte": start - 1, "$lte": end }
                        }
                    },
                    {
                        "$sort": {
                            "_id": 1.0
                        }
                    }
                ];

                var cursor = collection.aggregate(pipeline, options);
                data = new Map();
                cursor.forEach(
                    function(doc) {
                        let keys = Object.keys(doc);
                        for (let key of keys) {
                            if (key != "_id") {
                                if (data.has(key)) {
                                    let series = data.get(key);
                                    series.push({
                                        x: doc._id,
                                        y: doc[key]
                                    });
                                } else {
                                    data.set(key, []);
                                }
                            }
                        }
                    },
                    function(err) {
                        client.close();
                        let tmp = [];
                        data.forEach((value, key) => {
                            tmp.push({
                                name: key,
                                data: value
                            });
                        });
                        callback(err, tmp);
                    }
                );
            }
        });
    }

    this.songsAttributesByMonth = function(year, callback) {
        const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
        ];
        const client = new MongoClient(uri, { useNewUrlParser: true });
        client.connect((err, db) => {
            if (err) {
                console.log(err);
                callback(err, []);
            } else {
                let dbo = db.db();

                var collection = dbo.collection("tracks");

                var options = {
                    allowDiskUse: false
                };

                var pipeline = [{
                        "$match": {
                            "release_date": {
                                "$ne": moment("1799-12-31 18:00:00.000-06:00").toDate()
                            },
                            "year": year
                        }
                    },
                    {
                        "$group": {
                            "_id": {
                                "$month": "$release_date"
                            },
                            "danceability": {
                                "$avg": "$danceability"
                            },
                            "energy": {
                                "$avg": "$energy"
                            },
                            "instrumentalness": {
                                "$avg": "$instrumentalness"
                            },
                            "liveness": {
                                "$avg": "$liveness"
                            },
                            "speechiness": {
                                "$avg": "$speechiness"
                            },
                            "valence": {
                                "$avg": "$valence"
                            }
                        }
                    },
                    {
                        "$sort": {
                            "_id": 1.0
                        }
                    },
                    {
                        "$addFields": {
                            "month": {
                                "$let": {
                                    "vars": {
                                        "monthString": [
                                            "",
                                            "Jan",
                                            "Feb",
                                            "Mar",
                                            "Apr",
                                            "May",
                                            "Jun",
                                            "Jul",
                                            "Aug",
                                            "Sep",
                                            "Oct",
                                            "Nov",
                                            "Dec"
                                        ]
                                    },
                                    "in": {
                                        "$arrayElemAt": [
                                            "$$monthString",
                                            "$_id"
                                        ]
                                    }
                                }
                            }
                        }
                    }
                ];

                var cursor = collection.aggregate(pipeline, options);
                data = new Map();
                cursor.forEach(
                    function(doc) {
                        let keys = Object.keys(doc);
                        for (let key of keys) {
                            if (key != "_id" && key != "month") {
                                if (data.has(key)) {
                                    let series = data.get(key);
                                    series.push({
                                        x: doc.month,
                                        y: doc[key]
                                    });
                                } else {
                                    data.set(key, []);
                                }
                            }
                        }
                    },
                    function(err) {
                        client.close();
                        let tmp = [];
                        data.forEach((value, key) => {
                            newValues = []
                            for (let month of months) {
                                let row = value.find(e => e.x == month);
                                if (row) {
                                    newValues.push({
                                        x: month,
                                        y: row.y
                                    })
                                } else {
                                    newValues.push({
                                        x: month,
                                        y: 0
                                    })
                                }
                            }
                            tmp.push({
                                name: key,
                                data: newValues
                            });

                        });
                        callback(err, tmp);
                    }
                );
                // client.close();

            }
        });
    }


    this.topSongsAttributes = function(attr, year, month, count = 5, callback) {
        const client = new MongoClient(uri, { useNewUrlParser: true });
        client.connect((err, db) => {
            if (err) {
                console.log(err);
                callback(err, []);
            } else {
                let dbo = db.db();

                var collection = dbo.collection("tracks");

                var options = {
                    allowDiskUse: false
                };

                var pipeline = [{
                        "$match": {
                            "release_date": {
                                "$ne": moment("1799-12-31 18:00:00.000-06:00").toDate()
                            },
                            "year": year,
                        }
                    },
                    {
                        "$project": {
                            "artists": "$artists",
                            "song": "$id",
                            "name": "$name",
                            "attr": `$${attr}`,
                            "month": {
                                "$month": "$release_date"
                            }
                        }
                    },
                    {
                        "$match": {
                            "month": month
                        }
                    },
                    {
                        "$sort": {
                            "attr": -1.0
                        }
                    },
                    {
                        "$limit": count
                    }
                ];

                var cursor = collection.aggregate(pipeline, options);
                data = [];
                cursor.forEach(
                    function(doc) {
                        data.push(doc);
                    },
                    function(err) {
                        client.close();
                        callback(err, data);
                    }
                );
            }
        });
    }

    this.topSongsOfYear = function(attr, year, count = 5, callback) {
        const client = new MongoClient(uri, { useNewUrlParser: true });
        client.connect((err, db) => {
            if (err) {
                console.log(err);
                callback(err, []);
            } else {
                let dbo = db.db();

                var collection = dbo.collection("tracks");

                var options = {
                    allowDiskUse: false
                };

                var pipeline = [{
                        "$match": {
                            "year": year,
                        }
                    },
                    {
                        "$project": {
                            "artists": "$artists",
                            "song": "$id",
                            "name": "$name",
                            "attr": `$${attr}`,
                            "month": {
                                "$month": "$release_date"
                            }
                        }
                    },
                    {
                        "$sort": {
                            "attr": -1.0
                        }
                    },
                    {
                        "$limit": count
                    }
                ];

                var cursor = collection.aggregate(pipeline, options);
                data = [];
                cursor.forEach(
                    function(doc) {
                        data.push(doc);
                    },
                    function(err) {
                        client.close();
                        callback(err, data);
                    }
                );
            }
        });
    }


    this.randomSongs = function(count = 5, callback) {
        const client = new MongoClient(uri, { useNewUrlParser: true });
        client.connect((err, db) => {
            if (err) {
                console.log(err);
                callback(err, []);
            } else {
                let dbo = db.db();

                var collection = dbo.collection("tracks");

                var options = {
                    allowDiskUse: false
                };

                var pipeline = [{ "$sample": { "size": count } },
                    {
                        "$project": {
                            "artists": "$artists",
                            "song": "$id",
                            "name": "$name"
                        }
                    }
                ];

                var cursor = collection.aggregate(pipeline, options);
                data = [];
                cursor.forEach(
                    function(doc) {
                        data.push(doc);
                    },
                    function(err) {
                        client.close();
                        callback(err, data);
                    }
                );
            }
        });
    }
}

module.exports = DataManager;