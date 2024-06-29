import React from 'react'
import './css/MessageInputBar.css';

const MessageInputBar = ({ messageInput, setMessageInput, activeGroup, handleSender }) => {

  const handleMessageInput = (e) => {
    if (activeGroup) {
      setMessageInput(e.target.value);
    }
  }

  return (
    <form className='Message-Input-Bar'>

      <input
        type='text'
        placeholder='Write messages...'
        value={messageInput}
        onChange={handleMessageInput}
        className={!activeGroup ? 'no-cursor' : undefined}
      />
      <button onClick={handleSender} type='submit'><i className="fa-solid fa-paper-plane"></i></button>

    </form>
  )
}

export default MessageInputBar