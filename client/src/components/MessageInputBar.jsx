import React from 'react'
import './css/MessageInputBar.css';
import EmojiPicker from 'emoji-picker-react';

const MessageInputBar = ({ messageInput, setMessageInput, activeGroup, handleSendMsg }) => {

  const handleMessageInput = (e) => {
    if (activeGroup) {
      let inputValue = e.target.value;
      const len = inputValue.length;
      const charList = ['.','?','!'];
      
      setMessageInput(prev => {

        if (prev.length<len){
          if (inputValue.length===1){
            return inputValue.toUpperCase();  
          }
          else if (charList.includes(inputValue[len-2]) && inputValue[len-1]!== inputValue[len-2] ) {
            return prev + ' ' + inputValue[len-1].toUpperCase();
          }
        }
        return inputValue;
        
      });
  
    }
  }

  return (
    <form className='Message-Input-Bar'>
{/*    
      <EmojiPicker 
        theme='dark'
        emojiStyle='google'
      /> */}

      <input
        type='text'
        placeholder='Write messages...'
        value={messageInput}
        onChange={handleMessageInput}
        className={!activeGroup ? 'no-cursor' : undefined}
      />
      <button onClick={handleSendMsg} type='submit'><i className="fa-solid fa-paper-plane"></i></button>

    </form>
  )
}

export default MessageInputBar