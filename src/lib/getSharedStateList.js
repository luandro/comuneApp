import fetch from 'node-fetch'
import { strMapToObj } from 'obj2map'

export default async () => {
  try {
    const hostUrl = 'http://thisnode.info/cgi-bin/shared-state/dnsmasq-leases'
    const res = await fetch(hostUrl, {
      method: 'POST',
      body: JSON.stringify(strMapToObj(new Map([])))
    })
    const json = res.json()
    return json
  } catch (err) {
    console.log('Http error', err)
  }
}
