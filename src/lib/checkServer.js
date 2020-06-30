import Sockets from 'react-native-sockets'

const checkServer = async (index, leaseList) => {
  //the fancy recursion here is so that a new call only gets done
  // after the last call is resolved
  Sockets.isServerAvailable(
    leaseList[index].ip,
    serverPort,
    100,
    success => {
      console.log('found server ' + leaseList[index].ip)
      leaseList[index].hasApp = true

      index++
      if (index < leaseList.length && leaseList.length !== 0) {
        checkServer(index, leaseList)
      }
    },
    err => {
      console.log('no server in ' + leaseList[index].ip)
      //leaseList[index].hasApp=false;
      index++
      if (index < leaseList.length && leaseList.length !== 0) {
        checkServer(index, leaseList)
      }
    }
  )
}

export default checkServer
