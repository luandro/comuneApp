import Sockets from 'react-native-sockets'

export default ip => {
  config = {
    address: ip, //ip address of server
    port: 8080, //port of socket server
    timeout: 5000, // OPTIONAL (default 60000ms): timeout for response
    reconnect: true, //OPTIONAL (default false): auto-reconnect on lost server
    reconnectDelay: 500, //OPTIONAL (default 500ms): how often to try to auto-reconnect
    maxReconnectAttempts: 10 //OPTIONAL (default infinity): how many time to attemp to auto-reconnect
  }
  Sockets.startClient(config)
  Sockets.write('hi!')
  Sockets.disconnect()
}
