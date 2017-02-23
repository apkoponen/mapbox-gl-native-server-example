# Mapbox GL Native Server Example

This is just a simple Mapbox GL Native server example written in Node.js using Express. The server has a single endpoint that takes z, x and y and renders a png image tile based on the configured base vector tiles.

## Installation

Run `npm install` to install all dependencies.

NOTE: The mapbox-gl-native package requires that you're using node version 4.X. 

## Usage

Update the values in "config.js" to match you configuration and run `npm start` to start the server. 

You can then go to http://localhost:3000/0/0/0/ to see the World from the equator (or something else, depending on your vector map source).