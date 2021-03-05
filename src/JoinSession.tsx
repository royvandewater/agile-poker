import React from 'react'
import { useParams } from 'react-router-dom'
import { useLocalStorage } from 'react-use'
import useJoinSession from './hooks/useJoinSession'

const JoinSession = () => {
  const [name, setName] = useLocalStorage<string>('username', '')
  const { sessionId } = useParams<{sessionId: string}>()

  const {cards, story, estimate, setEstimate} = useJoinSession(sessionId, name!)

  return (
    <div>
      <h1>Join Session: {sessionId}</h1>

      <section>
        <label>
          Your Name
          <input value={name} onChange={event => setName(event.target.value)} />
        </label>
      </section>

      {story && (
        <section>
          <h3>{story?.name}</h3>
          {cards.map(card => (
            <button key={card} type="button" onClick={() => setEstimate(card)} className={card === estimate ? "selected card" : "card"}>{card}</button>
          ))}
        </section>
      )}
    </div>
  )
}

export default JoinSession