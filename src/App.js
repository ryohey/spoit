import React, { Component } from "react"
import { Application } from "pixi.js"
import Game from "./Game"

import "./App.css"

class App extends Component {
  componentDidMount() {
    const app = new Application({
      view: this.canvas
    })
    const game = new Game(app)
    game.start()
  }

  render() {
    return (
      <div className="App">
        <canvas
          width="640" height="640"
          ref={c => this.canvas = c}
          onContextMenu={e => e.preventDefault()} />
      </div>
    )
  }
}

export default App
