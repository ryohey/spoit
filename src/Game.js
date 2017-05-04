import { Graphics, Sprite, Point } from "pixi.js"

const WATER_RADIUS = 5
const INK_RADIUS = 10

export default class Game {
  constructor(app) {
    this.app = app
  }

  start() {
    const { stage, renderer } = this.app

    const background = new Graphics()
    background.beginFill(0xFFFFFF)
    background.drawRect(0, 0, renderer.width, renderer.height)
    background.interactive = true

    const waterDrops = []

    function addSingleWaterDrop(x, y) {
      const drop = new Graphics()
        .beginFill(0xEEEEEE)
        .drawCircle(0, 0, WATER_RADIUS)
      drop.position = new Point(x, y)
      drop.alpha = 0.5
      stage.addChild(drop)
      waterDrops.push(drop)
    }

    // 指定位置に water drop のかたまりを配置する
    function addWaterDrop(x, y, r = 20) {
      for (let i = 0; i < 10; i++) {
        addSingleWaterDrop(
          x + Math.random() * r,
          y + Math.random() * r)
      }
    }

    function addInkDrop(x, y) {
      const drop = new Graphics()
        .beginFill(0x22CC88)
        .drawCircle(0, 0, INK_RADIUS)
      drop.position = new Point(x, y)
      stage.addChild(drop)
    }

    function distance(x1, y1, x2, y2) {
      return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
    }

    // 指定位置の円に接する water drop を取得する
    function getWaterDropsIntersectCircle(x, y, radius) {
      const r = radius + WATER_RADIUS
      return waterDrops.filter(d => distance(x, y, d.x, d.y) <= r)
    }

    // ひとつの water drop を染める
    function dyeDrop(drop) {
      drop.clear()
        .beginFill(0x22CC88)
        .drawCircle(0, 0, WATER_RADIUS)
        .isDyed = true
    }

    // 指定位置の water drop を再帰的に染める
    function dyeAt(x, y, radius) {
      getWaterDropsIntersectCircle(x, y, radius)
        .filter(d => !d.isDyed)
        .forEach(drop => {
          dyeDrop(drop)
          // 時間差で近くの drop を染める
          setTimeout(() => dyeAt(drop.x, drop.y, WATER_RADIUS), 50)
        })
    }

    background.on("mousedown", ({ data }) => {
      const drop = new Graphics()
      addWaterDrop(data.global.x, data.global.y)
    })

    background.on("mousemove", ({ data }) => {
      switch(data.originalEvent.buttons) {
        case 0: // クリック中ではない
          break
        case 1: // 左クリック中
          addWaterDrop(data.global.x, data.global.y)
          break
        case 2: // 右クリック中
          break
        case 4: // 中クリック中
          break
      }
    })

    background.on("rightdown", ({ data }) => {
      const { x, y } = data.global
      addInkDrop(x, y)
      dyeAt(x, y, INK_RADIUS)
    })

    stage.addChild(background)
  }
}
