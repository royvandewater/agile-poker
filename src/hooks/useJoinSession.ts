import React from 'react'
import Peer from 'peerjs'

import hostPeerId from '../utils/hostPeerId'

const pingInterval = 1000

interface Story {
  id: string;
  name: string;
}

const useJoinSession = (sessionId: string, name: string) => {
  const [n, setN] = React.useState(0)
  const [conn, setConn] = React.useState<Peer.DataConnection | null>(null)
  const [story, setStory] = React.useState<Story | null>(null)
  const [cards, setCards] = React.useState<string[]>([])
  const [estimate, setEstimate] = React.useState<string | null>(null)

  React.useEffect(() => {
    const peer = new Peer({debug: 2})
    peer.on('open', id => {
      let lastPing = Date.now()

      const c = peer.connect(hostPeerId(sessionId), {serialization: 'json'})
      c.on('open', () => setConn(c))
      c.on('data', data => {
        switch (data.event) {
          case 'ping':
            lastPing = Date.now()
            c.send({event: 'pong'})
            break;

          case 'setStory':
            setCards(data.cards)
            setStory(story => {
              if (data.story.id !== story?.id) setEstimate(null)
              return data.story
            })
            break;

          default:
            break;
        }
      })

      const interval = setInterval(() => {
        if (pingInterval * 2 < Date.now() - lastPing) {
          console.log('it has been too long, reconnecting')
          clearInterval(interval)
          return setN(n => n + 1)
        }

      }, pingInterval)
    })

    return () => {
      peer.destroy()
      setConn(null)
    }
  }, [sessionId, n])

  React.useEffect(() => {
    if (!conn) return;
    if (name === "") return;

    conn.send({event: 'setName', name})
  }, [conn, name])

  React.useEffect(() => {
    if (!conn) return;
    if (story === null) return;
    if (estimate === null) return;

    conn.send({event: 'setEstimate', storyId: story.id, estimate})
  }, [estimate, story, conn])

  return { cards, story, estimate, setEstimate }
}

export default useJoinSession