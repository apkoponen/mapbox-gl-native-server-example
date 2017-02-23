'use strict';

const express = require('express');
const mbgl = require('mapbox-gl-native');
const request = require('request');
const sharp = require('sharp');
const config = require('./config');

const app = express();

let map = new mbgl.Map({
    request: function (req, callback) {
        request({
            url: req.url,
            encoding: null,
            gzip: true
        }, function (err, res, body) {
            if (err) {
                callback(err);
            } else if (res.statusCode == 200) {
                var response = {};

                if (res.headers.modified) { response.modified = new Date(res.headers.modified); }
                if (res.headers.expires) { response.expires = new Date(res.headers.expires); }
                if (res.headers.etag) { response.etag = res.headers.etag; }

                response.data = body;

                callback(null, response);
            } else {
                callback(new Error(JSON.parse(body).message));
            }
        });
    }
});

map.load(config.STYLE);

app.get('/:z/:x/:y', function (req, res) {
    let options = {
        zoom: req.params.z,
        center: [req.params.x, req.params.y]
    };
    map.render(options, function (err, buffer) {
        if (err) {
            console.error(err);
            res.send(err);
        } else {
            let image = sharp(buffer, {
                raw: {
                    width: 512,
                    height: 512,
                    channels: 4
                }
            });
            res.set('Content-Type', 'image/png');
            image.png().toBuffer()
                .then((result) => {
                    res.send(result);
                });
        }

    });

});

app.listen(config.SERVER_PORT, function () {
    console.log(`Server app listening on port ${config.SERVER_PORT}!`);
});