import { useParams } from 'react-router-dom'
import * as R from 'ramda'

import useHostSession from './hooks/useHostSession'

const HostSession = () => {
  const {sessionId} = useParams<{sessionId: string}>()
  const signupUrl = R.replace(/host-session\/[\w-]+/, '', window.location.href)

  const voters = useHostSession(sessionId)

  return (
    <div>
      <h1>Host Session</h1>

      <p>
        Have everyone go to <a href={signupUrl}>{signupUrl}</a> and join session
        using the id <strong>{sessionId}</strong>
      </p>

      <section>
        <h3>Connections</h3>
        <ul>
          {voters.map(({name, id}) => (
            <li key={id}>{name ?? "<unknown>"}</li>
          ))}
        </ul>
      </section>


    </div>
  )
}

export default HostSession