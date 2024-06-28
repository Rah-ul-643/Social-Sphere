import React from 'react'
import './css/ChatHeader.css';
import toast from 'react-hot-toast';


const ChatHeader = ({ activeGroup, setAddParticipantModalOpen, setViewGroupModalOpen }) => {

    const handleParticipantModal = () => {
        setAddParticipantModalOpen(prev => !prev);
    }

    const handleViewGroupModal = () => {
        setViewGroupModalOpen(prev => !prev);
    }

    const handleCopyButton = async () => {
        await navigator.clipboard.writeText(activeGroup.group_id);
        toast.success('Code copied to clipboard!');
    }

    return (
        <div className='chat-header'>
            {activeGroup &&
                <>
                    <div className='chat-header-dp'><i className="fa-solid fa-users-line"></i></div>
                    <div className='chat-header-user'>
                        <h1>{activeGroup.group_name}</h1>
                    </div>

                    <div className='chat-header-features'>
                        <button onClick={handleViewGroupModal}>View Group  </button>
                        <button className='add-participant' onClick={handleParticipantModal}>Add  <i className="fa-solid fa-user-plus"></i></button>
                        <button onClick={handleCopyButton}>Copy ID  <i className="fa-regular fa-copy"></i></button>
                    </div>
                </>
            }
            {!activeGroup && <h1 className='header-title'>Social Sphere</h1>}

        </div>

    )
}

export default ChatHeader;