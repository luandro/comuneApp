/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { useState, useEffect } from 'react'
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  DeviceEventEmitter,
  ActivityIndicator,
  Alert
} from 'react-native'

import { Colors } from 'react-native/Libraries/NewAppScreen'

import Sockets from 'react-native-sockets'
import fetchNodeList from './src/lib/fetchNodeList'
import LeaseList from './src/components/LeaseList'

//on new message
DeviceEventEmitter.addListener('socketServer_data', payload => {
  console.log('socketServer_data message:', payload.data)
  console.log('socketServer_data client id:', payload.client)
  Alert.alert(payload.data + ' ' + payload.client)
})

function comuneApp () {
  /* from https://github.com/rajiff/ws-react-demo */
  const serverPort = 8241
  Sockets.startServer(serverPort)
  const [nodeList, setNodeList] = useState([])
  const [leaseList, setLeaseList] = useState([])
  //will start a timer to check for the nodes every 5 seconds
  useEffect(() => {
    const fetchData = async () => {
      await fetchNodeList(setNodeList, setLeaseList, leaseList)
    }
    fetchData()
  }, [])
  // if (this._interval === undefined) {
  //   console.log('starting timer')
  //   this._interval = setInterval(() => {
  //     fetchNodeList(setNodeList, setLeaseList, leaseList)
  //   }, 5000)
  // }

  // Sockets.getIpAddress(ipList => {
  //   console.log('Ip address list', ipList);
  // }, err => {
  //   console.log('getIpAddress_error', err);
  // })

  // leaseList.forEach(function (host, index){
  //   ip = host.ip;
  //   console.log("chking ip "+ip+" INDEX "+index);
  //   Sockets.isServerAvailable(ip,serverPort,100,success => {
  //     console.log("found server "+ip);
  //     leaseList[index].hasApp=true;
  //   }, err => {
  //         //console.log("no server in "+ip);
  //         //leaseList[index].hasApp=false;
  //   })

  // for (let host of leaseList) {
  //   ip = host.ip;
  //   console.log("chking ip "+ip);
  //     Sockets.isServerAvailable(ip,serverPort,100,success => {
  //       console.log("found server "+ip);
  //       if (peerList.includes(ip) == false) {
  //             console.log("adding server "+ip);
  //             peerList.push(ip);
  //       }
  //     }, err => {
  //           console.log("no server in "+ip);
  //           // TODO  remove non-existing servers
  //           // if (peerList.includes(ip)) {
  //           //   position = peerList.indexOf(ip);
  //           //   peerList.splice(position,1); //remove the ip from the peer list
  //           // }
  //     })
  // }

  // Similar to componentDidMount and componentDidUpdate:
  // Will run every time the app is rendered
  // by sending nodeList as second argument, it will only render in the case list has changed
  useEffect(() => {
    console.log('redraw')
  }, [leaseList])

  return (
    <>
      <StatusBar barStyle='dark-content' />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior='automatic'
          style={styles.scrollView}
        >
          {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )}
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>ComuneApp</Text>
              <Text style={styles.sectionDescription}>
                This is the list of devices in your network. The ones with
                ComuneApp installed are enabled. Click to send them "Hi!"
              </Text>
            </View>
            {leaseList.length === 0 && (
              <ActivityIndicator
                style={styles.spinner}
                size='large'
                color='#0000ff'
              />
            )}
            {leaseList.length > 0 && <LeaseList leaseList={leaseList} />}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter
  },
  engine: {
    position: 'absolute',
    right: 0
  },
  body: {
    backgroundColor: Colors.white
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark
  },
  spinner: {
    paddingTop: 30
  },
  highlight: {
    fontWeight: '700'
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right'
  }
})

export default comuneApp
