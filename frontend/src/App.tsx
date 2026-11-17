
import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  const [Message, SetMessage] = useState(["hi from default message"])
  const [input, setInput] = useState("")
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080")

    ws.onopen = () => {
      console.log("Connected to server")

      ws.send(JSON.stringify({
        type: "join",
        payload: {
          roomId: "123"
        }
      }))
    }

    ws.onmessage = (event) => {
      SetMessage(m => [...m, event.data])
    }

    ws.onerror = (error) => {
      console.log("WebSocket error:", error)
    }

    ws.onclose = () => {
      console.log("WebSocket disconnected")
    }

    wsRef.current = ws

    return () => {
      ws.close()
      wsRef.current = null
    }
  }, [])

  const sendMessage = () => {
    if (!input.trim()) return

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: "chat",
        payload: {
          message: input
        }
      }))

      setInput("")
    }
  }

  return (
    <div className="h-screen bg-black">
      <div className="h-[95vh] flex flex-col gap-4 p-4">
        {Message.map((message, index) => (
          <span
            key={index}
            className="bg-white text-black rounded-b-2xl p-4 w-60"
          >
            {message}
          </span>
        ))}
      </div>

      <div className="w-full bg-white flex">
        <input
          className="flex-1 p-4"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />

        <button
          className="bg-purple-600 text-white p-4"
          onClick={sendMessage}
        >
          Send Message
        </button>
      </div>
    </div>
  )
}

export default App

