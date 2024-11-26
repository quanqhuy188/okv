import { useState, useEffect } from 'react'
import { HubConnectionBuilder } from '@microsoft/signalr'

// eslint-disable-next-line react/prop-types
const CommentSection = ({ productId }) => {
  const [connection, setConnection] = useState(null)
  const [comments, setComments] = useState([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    // Tạo kết nối đến SignalR Hub
    const newConnection = new HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_PUBLIC_API_ENDPOINT_URL}commentHub`)
      .build()

    newConnection
      .start()
      .then(() => {
        console.log('SignalR Connected')
      })
      .catch((err) => console.error('SignalR Connection Error: ', err))

    newConnection.on('ReceiveComment', (productId, userName, comment) => {
      setComments((prevComments) => [...prevComments, { userName, comment, productId }])
    })

    setConnection(newConnection)

    return () => {
      newConnection.stop()
    }
  }, [])

  const sendComment = () => {
    if (connection && message.trim()) {
      connection
        .invoke('SendComment', productId, 'User', message)
        .then(() => setMessage(''))
        .catch((err) => console.error('Error sending comment: ', err))
    }
  }

  return (
    <div>
      <div>
        <h3>Comments:</h3>
        <div>
          {comments.map((comment, index) => (
            <div key={index}>
              <strong>{comment.userName}:</strong> {comment.comment}
            </div>
          ))}
        </div>
      </div>
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder='Enter your comment...' />
      <button onClick={sendComment}>Send Comment</button>
    </div>
  )
}

export default CommentSection
