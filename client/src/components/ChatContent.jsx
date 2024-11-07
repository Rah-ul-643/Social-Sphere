import React, { useEffect, useRef } from 'react'
import './css/ChatContent.css';


const ChatContent = ({ userName, activeGroup, chats }) => {
    const chatContainerRef = useRef(null);
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chats]);

    return (
        <ul className='Chat-Content' ref={chatContainerRef}>
            {activeGroup ?
                !chats.length ?
                    <div className='Empty-Chats'>
                        <p>Be the first to start the conversation </p>
                        <p>Greet everyone by saying hello...</p>
                    </div>
                    :
                    chats.map((item, index) => (
                        <li key={index} className={item.sender === userName ? 'sender-message' : 'receiver-message'}>
                            <h3>{item.sender!==userName && item.sender.toUpperCase()}</h3>
                            <p>{item.message}</p>
                        </li>
                    ))
                :
                <div className='Empty-Chats'>
                    <h1>Welcome !</h1>
                    <p>Start a conversation by clicking on a group name</p>
                    <h2>or</h2>
                    <p>Explore the sidebar to create a new group or join a group...</p>
                </div>
            }
        </ul>
    )
}

export default ChatContent;