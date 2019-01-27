# Procedural Galaxy 
Hello,
This is a fully generated solar system made with [three.js](https://threejs.org/) & a lot of canvas. It uses the [diamond square algorithm](https://en.wikipedia.org/wiki/Diamond-square_algorithm) to generate the texture.

## Requirements
* A modern browser (Chrome, Edge, Firefox & Safari)
* A somewhat 'okay' computer 
* A mouse for that '_cinematic experience_'

## Features
* Look at a procedural generated solar system
* Interact with the settings, careful with the size of the resolution, it might crash
* Generates 4 types of texture (map, bumpmap, roughmap & specularmap)
* Generates custom atmosphere for the planets
* You can look at the logs to see the generation doing its work (false by default)

## Remarks for correction
I'd like to add more to the generation, but I wanted to spent my time playing around with three.js and not only the canvas.

## Ressources
I used [seedrandom.js](https://www.npmjs.com/package/seedrandom) to generate the planets, made by [David Bau](http://davidbau.com).

I also used [dat.gui](https://github.com/dataarts/dat.gui) for the graphical user interface.

## Usage
You can go see the project on my [website](https://thomaslacroix.fr/procedural_planets).

## Setup
Install dependencies
```sh
$ npm install
```

## Development
Run the local webpack-dev-server with hotreload and autocompile on [http://localhost:8080/](http://localhost:8080/)
```sh
$ npm run dev
```
## Deployment
Build the current application
```sh
$ npm run build
```

## Versioning
See on [github](https://github.com/majejam/webgl-hw/)

## Acknowledgment
Thank you [stackoverflow](https://stackoverflow.com/) & [three.js documentation](https://threejs.org/docs/)


