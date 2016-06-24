const choo = require('choo')
const sf = require('sheetify')

sf('./styles.css', {global: true})

const app = choo()

const mainView = (params, state, send) =>
  choo.view`<p>hi</p>`

app.router(route => [
  route('/', mainView)
])

const tree = app.start()
document.body.appendChild(tree)
