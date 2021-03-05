import React from 'react'
import { Link, useParams } from 'react-router-dom'
import * as R from 'ramda'
import UUID from 'uuid'

import './HostSession.css';
import useHostSession from './hooks/useHostSession'

interface Story {
  id: string;
  name: string;
  estimate: string;
}

const blankStories = R.filter(R.propEq('name', ''))
const noBlankStories = R.pipe<Story[], Story[], boolean>(blankStories, R.isEmpty)

const HostSession = () => {
  const {sessionId} = useParams<{sessionId: string}>()

  const signupUrl = R.replace(/host-session\/[\w-]+/, '', window.location.href)
  const joinUrl = `${signupUrl}join-session/${sessionId}`

  const [cards, setCards] = React.useState(['1', '2', '4', '8', '12', '20', '40', '🤷'])
  const [stories, setStories] = React.useState<Story[]>([])

  React.useEffect(() => {
    if (noBlankStories(stories)) {
      setStories(R.append({ id: UUID.v4(), name: '', estimate: '' }))
    }
  }, [stories])

  const [currentStory, setCurrentStory] = React.useState<Story | null>(null)
  const voters = useHostSession(sessionId, cards, currentStory)


  return (
    <div className="HostSession">
      <h1>Host Session</h1>

      <dl className="InviteVoter">
        <div>
          <dt>Session ID:</dt>
          <dd>{sessionId}</dd>
        </div>
        <div>
          <dt>Link:</dt>
          <dd><Link to={joinUrl}>Join</Link></dd>
        </div>
      </dl>

      <section>
        <h3>Options</h3>
          <label>
            Cards (comma separated)
            <input value={cards.join(', ')} onChange={event => setCards(event.target.value.split(/, */))}/>
          </label>

          <hr />

          {stories.map((story, i) =>
            <form key={story.id} onSubmit={(event) => {
              event.preventDefault()
              setCurrentStory(story)
            }}>
              <label>
                Name
                <input value={story.name} onChange={event => setStories(R.assocPath([i, 'name'], event.target.value))} />
              </label>

              <label>
                estimate
                <input value={story.estimate} onChange={event => setStories(R.assocPath([i, 'estimate'], event.target.value))} />
              </label>

              <br />

              <button type="submit">Start Voting</button>

              <ul>
                {R.filter(R.hasPath(['votes', story.id]), voters).map(voter => (
                  <li key={voter.id}>{voter.name} - {R.path(['votes', story.id], voter)}</li>
                ))}
              </ul>

              <hr />
            </form>
          )}
      </section>

      <section>
        <h3>Voters</h3>
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