import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import './css/SideBar.css';

const SideBar = ({ setIsLoggedIn, setChatSectionOpen, setConversationSectionOpen, setJoinGroupModalOpen, setCreateGroupModalOpen, isDarkMode, setIsDarkMode }) => {

  
  useEffect(() => {
    document.body.className = isDarkMode ? 'dark' : 'light';
  }, [isDarkMode]);

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

  const handleAppearenceChange = () => {    
    setIsDarkMode((prev) => !prev);
  }

  return (

    <div className='Side-bar'>
      <button title='change mode' onClick={handleAppearenceChange}><i class="fa-solid fa-sun"></i></button>
      <button className='modal-btn' title='view chats' onClick={handleModalButtonClick} ><i className="fa-solid fa-list"></i></button>
      <button title='join group' onClick={handleJoinGroupModalClick}><i className="fa-solid fa-users-gear"></i></button>
      <button title='create new group' onClick={handleCreateGroupModalClick}><i className="fa-solid fa-plus"></i></button>
      <button title='view profile' ><i className="fa-solid fa-user"></i></button>
      <button title='logout' onClick={handleLogOut}><i className="fa-solid fa-right-from-bracket"></i></button>
    </div>
  )
}

export default SideBar;