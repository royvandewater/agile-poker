import { appId } from "../config"

const connectionId = (sessionId: string) => `${appId}-${sessionId}`

export default connectionId