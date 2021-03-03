import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import Chance from 'chance'
import dashify from 'dashify'

const randomAnimal = () => dashify(new Chance().animal())

const HostSessionOption = () => {
  const [sessionId] = React.useState(randomAnimal())

  return <a href={`host-session/${sessionId}`}>Host</a>
}


const JoinSessionOption = () => {
  const [sessionId, setSessionId] = React.useState('')
  const history = useHistory()

  return (
    <form onSubmit={() => history.push(`join-session/${sessionId}`)}>
      <input onChange={event => setSessionId(event.target.value)} />
      <Link to={`join-session/${sessionId}`}>Join</Link>
    </form>
  )
}

const MainMenu = () => (
  <div>
    <h1>Main Menu</h1>

    <section>
      <HostSessionOption />
    </section>

    <section>
      <JoinSessionOption />
    </section>
  </div>
)

export default MainMenu