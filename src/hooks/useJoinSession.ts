import React from 'react'
import Peer from 'peerjs'
import hostPeerId from '../utils/hostPeerId'


const useJoinSession = (sessionId: string, name: string) => {
  const connRef = React.useRef<Peer.DataConnection>()
  const conn = connRef.current

  React.useEffect(() => {
    const peer = new Peer()
    peer.on('open', id => {
      const c = peer.connect(hostPeerId(sessionId))
      c.on('open', () => connRef.current = c)
      c.on('data', data => console.log('client:data', data))
      connRef.current = c
    })

    return () => peer.destroy()
  },[sessionId])

  React.useEffect(() => {
    if (!conn) return;
    if (name === "") return;

    conn.send(JSON.stringify({event: 'setName', name}))

  }, [conn, name])

}

export default useJoinSession