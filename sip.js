Object.assign(global, {
    WebSocket: require('ws')
})

const JsSIP = require('jssip')
JsSIP.debug.enable('*')

var ua = new JsSIP.UA({
  sockets: [
    new JsSIP.WebSocketInterface('wss://iridiumgo.local:8081')
  ],
  uri: 'sip:guest@iridiumgo.local',
  password: 'guest',
  register: false
})

ua.start()

return

ua.on('connected', function(e) {
  console.log(' ------------------------------------------------- ')
  console.log(' ------------------- connected ------------------- ')
  console.log(' ------------------------------------------------- ')
  console.log(e)
})

ua.on('disconnected', function(e) {
  console.log(' ------------------------------------------------- ')
  console.log(' ------------------ disconnected ----------------- ')
  console.log(' ------------------------------------------------- ')
  console.log(e)
})

ua.on('newMessage', function(e) {
  console.log(' ------------------------------------------------- ')
  console.log(' ------------------- new message ----------------- ')
  console.log(' ------------------------------------------------- ')
  console.log(e)
})

ua.sendMessage('sip:mail@test.com', 'Hello Bob', {
  'eventHandlers': {
    'succeeded': function(e) {
      console.log(' ------------------------------------------------- ')
      console.log(' ------------------- succeeded ------------------- ')
      console.log(' ------------------------------------------------- ')
      console.log(e)
    },
    'failed':    function(e) {
      console.log(' ---------------------------------------------- ')
      console.log(' ------------------- failed -------------------')
      console.log(' ---------------------------------------------- ')
      console.log(e)
    }
  }
})
