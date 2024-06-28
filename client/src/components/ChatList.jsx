import React from 'react'
import './css/ChatList.css';

const ChatList = ({conversations,setActiveGroup,handleConnection}) => {

  return (
        <ul className='Chat-List'>
          {conversations.map((group) => (
            <li key={group.group_id} onClick={() => {
              setActiveGroup(group);
              handleConnection(group);
            }}>
              <div className='chat-header-dp'><i className="fa-solid fa-users-line"></i></div>
              <h2>{group.group_name}</h2>
     
            </li>
          )
          )}
        </ul>
  )
}

export default ChatList