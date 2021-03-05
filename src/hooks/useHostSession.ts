import React from 'react'
import Peer from 'peerjs'
import * as R from 'ramda'
import hostPeerId from '../utils/hostPeerId'

interface Story {
  id: string;
  name: string;
  estimate: string;
}

interface Voter {
  id: string;
  name: string | null;
  conn: Peer.DataConnection;
  votes: {
    [storyId: string]: string
  }
}

interface VoterMap {
  [id: string]: Voter
}

const pingInterval = 1000

const useHostSession = (sessionId: string, cards: string[], story: Story | null) => {
  const [voters, setVoters] = React.useState<VoterMap>({})

  React.useEffect(() => {
    const peer = new Peer(hostPeerId(sessionId), {debug: 2})

    peer.on('connection', conn => {
      const id = conn.peer
      let lastPongAt = Date.now()

      conn.on('data', data => {

        switch (data.event) {
          case "setName":
            setVoters(R.assocPath([id, 'name'], data.name))
            break;

          case "setEstimate":
            setVoters(R.assocPath([id, 'votes', data.storyId], data.estimate))
            break;

          case "pong":
            lastPongAt = Date.now()
            break;

          default:
            break;
        }
      })

      conn.on('close', () => setVoters(R.dissoc(id)))

      const interval = setInterval(() => {
        if (2 * pingInterval < Date.now() - lastPongAt) {
          setVoters(R.dissoc(id))
          conn.close()
          clearInterval(interval)
          return
        }

        conn.send({event: 'ping'})
      }, pingInterval)

      const voter: Voter = {name: null, id, conn, votes: {}}
      setVoters(R.assoc(id, voter))
    })

    return () => {
      setVoters({})
      peer.destroy()
    }
  },[sessionId])

  React.useEffect(() => {
    if (story === null) return;

    R.values(voters).forEach(voter => {
      voter.conn.send({event: 'setStory', cards, story: R.pick(['id','name'], story)})
    })
  }, [voters, cards, story])

  return R.map(R.omit(['conn']), R.values(voters))
}

export default useHostSession