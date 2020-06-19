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
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';


import {strMapToObj, objToStrMap } from 'obj2map';
import fetch from 'node-fetch';

var list;

function  comuneApp () {


    const [nodeListString, setNodeListString] = useState("not available yet");
    const [nodeList, setNodeList] = useState([]);

    var interval;

    const httpSharedStateMerge = (table) => {
        const hostUrl = "http://thisnode.info/cgi-bin/shared-state/dnsmasq-hosts";
        return fetch(hostUrl, {
            method: 'POST',
            body: JSON.stringify(strMapToObj(new Map([])))
        })
        .then(res => res.json())
        .catch(err => console.log('Http merge error', err));
    }


    async function fetchNodeList () {

      const nodeData = await httpSharedStateMerge('dnsmasq-hosts');
      const dataMap = objToStrMap(nodeData);

      let listString = "" ;
      let list = [];
      for (let name of dataMap.keys()) {
         console.log (name.toString().split(" ")[1]);
         listString = listString + name;
         list.push({key: name.toString().split(" ")[0], value: name.toString().split(" ")[1]});
      }

      console.log ("list: ");
      console.log (list);


      setNodeListString(listString);
      setNodeList(list);

      var t = new Date().getTime ();
      console.log ("conferindo agora  "+t);

    }


    // Similar to componentDidMount and componentDidUpdate:
    // Will run every time the app is rendered
    // by sending list as second argument, it will only render in the case list has changed
    useEffect(() => {
      //will start a timer to check for the nodes every 5 seconds
      this._interval = setInterval(() => {
        fetchNodeList();
      }, 5000);

    }, [list]);


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
                  <Text style={styles.sectionTitle}>Step One</Text>
                  <Text style={styles.sectionDescription}>
                    Edit <Text style={styles.highlight}>App.js</Text> to change this
                    screen and then come back to see your edits list {nodeListString}
                  </Text>
                  {nodeList.map((item) => (
                          <Button style={styles.sectionDescription} key={item.key} title={item.value} />
                  ))}
                </View>
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>Learn More</Text>
                  <Text style={styles.sectionDescription}>
                    Read the docs to discover what to do next:
                  </Text>
                </View>
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
  });


export default comuneApp;
