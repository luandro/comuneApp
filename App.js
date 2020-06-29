/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component ,  useState, useEffect }  from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Button,
  StatusBar,
  TouchableOpacity,
  DeviceEventEmitter,
  Alert,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import Sockets from 'react-native-sockets';

import {strMapToObj, objToStrMap } from 'obj2map';
import fetch from 'node-fetch';

// DeviceEventEmitter.addListener('socketServer_data', (payload) => {
//       console.log('socketServer_data message:', payload.data);
//       console.log('socketServer_data client id:', payload.client);
//     });


var leaseList;

//on new message
DeviceEventEmitter.addListener('socketServer_data', (payload) => {
  console.log('socketServer_data message:', payload.data);
  console.log('socketServer_data client id:', payload.client);
  Alert.alert(payload.data+" "+payload.client);
});

function  comuneApp () {

//from https://github.com/rajiff/ws-react-demo

  const serverPort = 8241;
  Sockets.startServer(serverPort);

  //will start a timer to check for the nodes every 5 seconds
  if (this._interval === undefined) {
    console.log("strtng timer");
    this._interval = setInterval(() => {
      fetchNodeList();
    }, 5000);
  }

    if (leaseList === undefined){
      leaseList = []
    }

    const [nodeList, setNodeList] = useState([]);
    let  [,setState]=useState();

    // Sockets.getIpAddress(ipList => {
    //   console.log('Ip address list', ipList);
    // }, err => {
    //   console.log('getIpAddress_error', err);
    // })

    const httpSharedStateList = () => {
        const hostUrl = "http://thisnode.info/cgi-bin/shared-state/dnsmasq-leases";
        return fetch(hostUrl, {
            method: 'POST',
            body: JSON.stringify(strMapToObj(new Map([])))
        })
        .then(res => res.json())
        .catch(err => console.log('Http error', err));
    }


  async function fetchNodeList () {

      const nodeData = await httpSharedStateList();
      const dataMap = objToStrMap(nodeData);

      dataMap.forEach (function (node, dataMapIndex) {
        if (dataMapIndex.indexOf(":")==-1) {
          if (node.data!==undefined) {
            let name = node.data.hostname;
            if ((node.data.hostname==="*")||(node.data.hostname==="")){
              name = dataMapIndex; //use ip
            }
            myNode = {ip: dataMapIndex, value: name, hasApp: false, r: 50};

            notFound = true;
            leaseList.forEach(function (lease, leaseIndex) {
              if (lease.ip === dataMapIndex) {
                notFound = false;
              }
            })
            if (notFound) {
              console.log("not found ip in list")
              leaseList.push(myNode);
            }
          }
        }
      })

      if (leaseList.length !== 0) {
        checkServer(0);
      }
      //will start a timer to check for the nodes every 5 seconds
      if (this._interval === undefined) {
        console.log("strtng timer");
        this._interval = setInterval(() => {
          fetchNodeList();
        }, 5000);
      }


      setNodeList(leaseList);
      setState({});
      //var t = new Date().getTime ();
      console.log (leaseList);

    }

     async function checkServer (index) {
      //the fancy recursion here is so that a new call only gets done
      // after the last call is resolved
        Sockets.isServerAvailable(leaseList[index].ip,serverPort,100,success => {
          console.log("found server "+leaseList[index].ip);
          leaseList[index].hasApp=true;

          index++;
          if ((index < leaseList.length)&&(leaseList.length!==0)) {
              checkServer(index);
          }
        }, err => {
              console.log("no server in "+leaseList[index].ip);
              //leaseList[index].hasApp=false;
              index++;
              if ((index < leaseList.length)&&(leaseList.length!==0)) {
                  checkServer(index);
              }
        })
    }



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


    function sayHi(ip) {
      config={
        address: ip, //ip address of server
        port: 8080, //port of socket server
        timeout: 5000, // OPTIONAL (default 60000ms): timeout for response
        reconnect:true, //OPTIONAL (default false): auto-reconnect on lost server
        reconnectDelay:500, //OPTIONAL (default 500ms): how often to try to auto-reconnect
        maxReconnectAttempts:10, //OPTIONAL (default infinity): how many time to attemp to auto-reconnect
      }
      Sockets.startClient(config);
      Sockets.write("hi!");
      Sockets.disconnect();


    }

    // Similar to componentDidMount and componentDidUpdate:
    // Will run every time the app is rendered
    // by sending nodeList as second argument, it will only render in the case list has changed
    useEffect(() => {

      console.log("redraw");

    }, [leaseList]);

      return (
        <>
          <StatusBar barStyle="dark-content" />
          <SafeAreaView>
            <ScrollView
              contentInsetAdjustmentBehavior="automatic"
              style={styles.scrollView}>
              {global.HermesInternal == null ? null : (
                <View style={styles.engine}>
                  <Text style={styles.footer}>Engine: Hermes</Text>
                </View>
              )}
              <View style={styles.body}>
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>ComuneApp</Text>
                  <Text style={styles.sectionDescription}>
                    This is the list of devices in your network. The ones with ComuneApp installed are enabled. Click to send them "Hi!"
                  </Text>
                </View>
                {leaseList.map((item) => (
                    <View style={styles.separator} key={item.ip} >
                        <Button key={item.ip} title={item.value}
                        onPress={() => sayHi(item.ip)}
                        disabled={item.hasApp? false : true }
                        />
                    </View>

                ))}
              </View>
            </ScrollView>
          </SafeAreaView>
        </>
      );
}

const styles = StyleSheet.create({
    scrollView: {
      backgroundColor: Colors.lighter,
    },
    engine: {
      position: 'absolute',
      right: 0,
    },
    body: {
      backgroundColor: Colors.white,
    },
    sectionContainer: {
      marginTop: 32,
      paddingHorizontal: 24,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: '600',
      color: Colors.black,
    },
    sectionDescription: {
      marginTop: 8,
      fontSize: 18,
      fontWeight: '400',
      color: Colors.dark,
    },
    highlight: {
      fontWeight: '700',
    },
    footer: {
      color: Colors.dark,
      fontSize: 12,
      fontWeight: '600',
      padding: 4,
      paddingRight: 12,
      textAlign: 'right',
    },
    separator: {
      marginVertical: 8,
      borderBottomColor: '#737373',
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
  });


export default comuneApp;
