import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import Chance from 'chance'
import dashify from 'dashify'
import * as R from 'ramda'

const randomAnimal = () => dashify(new Chance().animal())

const HostSessionOption = () => {
  const [sessionId] = React.useState(randomAnimal())

  return (
    <section className="HostSessionOption">
      <div>
        <h2>Start new session</h2>
        <Link to={`host-session/${sessionId}`}>Host</Link>
      </div>
    </section>
  )
}


const JoinSessionOption = () => {
  const [sessionId, setSessionId] = React.useState('')
  const history = useHistory()

  return (
    <section className="JoinSessionOption">
      <div>
        <h2>Join existing session</h2>

        <form onSubmit={() => history.push(`join-session/${sessionId}`)}>
          <label>
            Code
            <input onChange={event => setSessionId(event.target.value)} value={sessionId} />
          </label>
          {R.isEmpty(sessionId)
          ? <button disabled type="button">Join</button>
          : <Link to={`join-session/${sessionId}`}>Join</Link>}
        </form>
      </div>
    </section>
  )
}

const MainMenu = () => (
  <div className="MainMenu">
    <h1>Agile Poker</h1>

    <div className="Options">
      <HostSessionOption />
      <JoinSessionOption />
    </div>
  </div>
)

export default MainMenu