import React from 'react';
import toast from 'react-hot-toast';
import './css/SideBar.css';

const SideBar = ({ setIsLoggedIn, setChatSectionOpen, setConversationSectionOpen, setJoinGroupModalOpen, setCreateGroupModalOpen }) => {

  const handleLogOut = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('token');
    toast.success("Logged out successfully!");
  }

  const handleModalButtonClick = () => {
    setChatSectionOpen(prev => {
      setConversationSectionOpen(prev);
      return !prev;
  });
    
  }

  const handleJoinGroupModalClick = () => {
    setCreateGroupModalOpen(prev => prev ? !prev : prev);
    setJoinGroupModalOpen(prev => !prev);
  }

  const handleCreateGroupModalClick = () => {
    setJoinGroupModalOpen(prev => prev ? !prev : prev);
    setCreateGroupModalOpen(prev => !prev);
  }

  return (

    <div className='Side-bar'>
      <button className='modal-btn' onClick={handleModalButtonClick} ><i className="fa-solid fa-list"></i></button>
      <button onClick={handleJoinGroupModalClick}><i className="fa-solid fa-users-gear"></i></button>
      <button onClick={handleCreateGroupModalClick}><i className="fa-solid fa-plus"></i></button>
      <button><i className="fa-solid fa-user"></i></button>
      <button onClick={handleLogOut}><i className="fa-solid fa-right-from-bracket"></i></button>
    </div>
  )
}

export default SideBar;