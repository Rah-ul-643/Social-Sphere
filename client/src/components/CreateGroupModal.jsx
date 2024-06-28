import React, { useState } from 'react'
import './css/Modals.css';
import toast from 'react-hot-toast';
import { api } from '../apis';

const CreateGroupModal = ({ setCreateGroupModalOpen, username, setConversations, setActiveGroup }) => {

  const [groupName, setGroupName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await api.post('create-group', { groupName, username });
        const data = response.data;
        console.log(data);
        if (data.success) {
            const newGroup = data.group;
            setActiveGroup(newGroup);
            setConversations(prev => [...prev,newGroup]);
            
            toast.success("New group created.");
            setCreateGroupModalOpen(false);
        }
        
    } catch (error) {
        console.log(error);
        toast.error("Unable to process request!");
    }

}

  return (
    <>
      <div className='Modal' onClick={() => setCreateGroupModalOpen(false)}></div>
      <div className="login-form overlay-container">
        <h2>Create Group</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Group Name</label>
            <input
              type="text"
              id="new-group"
              placeholder='Group Name'
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn">Create Group</button>
        </form>
      </div>

    </>
  )
}

export default CreateGroupModal;