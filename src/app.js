const choo = require('choo')
const sf = require('sheetify')

sf('./styles.css', {global: true})

const app = choo()

const handleKeyDown = e => {
  e.preventDefault()

  console.log(e)
}

const mainView = (params, state, send) =>
  choo.view`
  <div>
    <p>hi <span class="cursor">|</span></p>
  </div>`

app.router(route => [
  route('/', mainView)
])

const tree = app.start()
document.addEventListener('keydown', handleKeyDown)
document.body.appendChild(tree)
