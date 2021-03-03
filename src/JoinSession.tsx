import React from 'react'
import { useParams } from 'react-router-dom'
import useJoinSession from './hooks/useJoinSession'

const JoinSession = () => {
  const [name, setName] = React.useState<string>('')
  const { sessionId } = useParams<{sessionId: string}>()

  useJoinSession(sessionId, name)

  return (
    <div>
      <h1>Join Session: {sessionId}</h1>

      <section>
        <input value={name} onChange={event => setName(event.target.value)} />
      </section>
    </div>
  )
}

export default JoinSession