import React from 'react'
import Peer from 'peerjs'
import * as R from 'ramda'
import hostPeerId from '../utils/hostPeerId'

interface Voter {
  name: string | null;
  id: string;
}

interface VoterMap {
  [id: string]: Voter
}

const useHostSession = (sessionId: string) => {
  const [voters, setVoters] = React.useState<VoterMap>({})

  React.useEffect(() => {
    const peer = new Peer(hostPeerId(sessionId))

    peer.on('connection', conn => {
      const id = conn.peer

      conn.on('data', dataStr => {
        const data = JSON.parse(dataStr)

        switch (data.event) {
          case "setName":
            setVoters(R.assocPath([id, 'name'], data.name))
            break;

          default:
            break;
        }

        if (data.event === 'name') {

        }
      })

      conn.on('close', () => setVoters(R.dissoc(id)))

      setVoters(R.assoc(id, {name: null, id}))
    })

    return () => {
      setVoters({})
      peer.destroy()
    }
  },[sessionId])

  return R.values(voters)
}

export default useHostSession