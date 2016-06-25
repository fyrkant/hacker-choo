const choo = require('choo')
const http = require('choo/http')
const sf = require('sheetify')

sf('./styles.css', {global: true})

const app = choo()

app.model({
  state: {
    index: 0,
    text: null
  },
  reducers: {
    addText: (action, state) => ({ text: action.payload }),
    increaseIndex: (action, state) => ({ index: state.index + 3 }),
    decreasIndex: (action, state) => ({ index: state.index - 3 })
  },
  subscriptions: [
    function (send) {
      onkeydown = (e) => {
        e.preventDefault()
        send('handleKeyDown', { payload: e })
      }
    }
  ],
  effects: {
    handleKeyDown: (action, state, send) => {
      send('scrollToBottom')
      if (action.payload.keyCode === 8) {
        send('decreasIndex')
      } else {
        send('increaseIndex')
      }
    },
    getData: (action, state, send) => {
      http.get('/kernel.txt', (err, res, body) => {
        if (err) console.log(err)

        send('addText', { payload: body })
      })
    },
    scrollToBottom: () => window.scrollTo(0, document.body.scrollHeight)
  }
})

const codeLiner = (text, index) => {
  const formattedText = text && text.substr(0, index)
                                    .replace(/\n/g, '<br/>')
                                    .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;')
                                    .replace(/\s/g, '&nbsp;')

  const container = document.createElement('span')
  container.innerHTML = formattedText
  return choo.view`${container}`
}

const mainView = (params, state, send) => {
  if (state.text === null) send('getData')
  return choo.view`
    <div>
      <p>${codeLiner(state.text, state.index)}<span class="cursor">|</span></p>
    </div>`
}

app.router(route => [
  route('/', mainView)
])

const tree = app.start()
document.body.appendChild(tree)
