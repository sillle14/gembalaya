import { Server } from "boardgame.io/server"
import { Splendor } from "./Game"

const server = Server({ games: [Splendor] })

server.run(8000);
