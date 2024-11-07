import React from 'react'
import './css/ChatList.css';

const ChatList = ({ conversations, activeGroup,  setActiveGroup, fetchChatHistory , setChatSectionOpen, setConversationSectionOpen, isSmallScreen}) => {

  const handleClick = (group) => {
    setActiveGroup(group);
    fetchChatHistory(group);

    if (isSmallScreen){
      setConversationSectionOpen(false);
      setChatSectionOpen(true);
    }   
  }

  return (
    <ul className='Chat-List'>
      {conversations.map((group) => (
        <li key={group.group_id} onClick={() => handleClick(group)} className={activeGroup===group ? 'active' : ''}>
          <div className='chat-header-dp'><i className="fa-solid fa-users-line"></i></div>
          <h2>{group.group_name}</h2>
        </li>
      )
      )}
    </ul>
  )
}

export default ChatList