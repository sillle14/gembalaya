# Gembalaya

My implementation of the board game [Splendor](https://boardgamegeek.com/boardgame/148228/splendor) using [boardgame.io](boardgame.io) and React. You can play Gembalaya as well as some other games at https://lhog.herokuapp.com/.

## Development

Run `npm install` to install the necessary packages. Run the server using `npm run dev-server` and the client using `npm run dev`. This will instantiate two game boards in a single window for easy testing.

Alternatively, you can run `npm run dev-lobby` (with the server running) to use the basic lobby provided by boardgame.io. 

## Deployment

This is currently setup for deployment to Heroku with the server and client running at a single port. Run `npm start` to deploy.

However, this deployment only has a simple lobby implementation and no persistence. Check out [Lewis' House of Games](https://github.com/sillle14/lhog) for a more robust lobby implementation meant to host many boardgame.io games.