import { objToStrMap } from 'obj2map'
import checkServer from './checkServer'
import getSharedStateList from './getSharedStateList'

const fetchNodeList = async (setNodeList, setLeaseList, leaseList) => {
  console.log('Start fetching!')
  const nodeData = await getSharedStateList()
  const dataMap = objToStrMap(nodeData)

  dataMap.forEach(function (node, dataMapIndex) {
    if (dataMapIndex.indexOf(':') == -1) {
      if (node.data !== undefined) {
        let name = node.data.hostname
        if (node.data.hostname === '*' || node.data.hostname === '') {
          name = dataMapIndex //use ip
        }
        myNode = { ip: dataMapIndex, value: name, hasApp: false, r: 50 }

        notFound = true
        leaseList.forEach(function (lease, leaseIndex) {
          if (lease.ip === dataMapIndex) {
            notFound = false
          }
        })
        if (notFound) {
          console.log('not found ip in list')
          setLeaseList([...leaseList, myNode])
        }
      }
    }
  })

  if (leaseList.length !== 0) {
    checkServer(0, leaseList)
  }
  //will start a timer to check for the nodes every 5 seconds
  if (this._interval === undefined) {
    console.log('strtng timer')
    this._interval = setInterval(() => {
      fetchNodeList()
    }, 5000)
  }

  setNodeList(leaseList)
  //var t = new Date().getTime ();
  console.log('fetchNodeList -> leaseList', leaseList)
}

export default fetchNodeList
