import React from 'react'
import sayHi from '../lib/sayHi'
import { View, Button, StyleSheet } from 'react-native'
export default ({ leaseList }) => {
  leaseList.map(item => (
    <View style={styles.separator} key={item.ip}>
      <Button
        key={item.ip}
        title={item.value}
        onPress={() => sayHi(item.ip)}
        disabled={item.hasApp ? false : true}
      />
    </View>
  ))
}

const styles = StyleSheet.create({
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth
  }
})
