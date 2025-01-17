import React, { useState } from 'react';
import './css/Modals.css';
import { chatApi } from '../apis';
import toast from 'react-hot-toast';

const JoinGroupModal = ({ setJoinGroupModalOpen, conversations }) => {

    const [groupId, setGroupId] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (conversations.find(group => group.group_id === groupId)) {
            toast.error("Already a member of the group.");
            return;
        }
        try {
            const response = await chatApi.post('join-group', { groupId });
            const data = response.data;
            console.log(data);
            if (data.success) {
                toast.success("Join request sent...");
                setJoinGroupModalOpen(false);
            }
            else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            localStorage.clear();
            window.location.reload();
        }

    }

    return (
        <>
            <div className='Modal' onClick={() => setJoinGroupModalOpen(false)}></div>
            <div className="login-form overlay-container">
                <h2>Join Group</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Group ID</label>
                        <input
                            type="text"
                            id="join-group"
                            placeholder='Enter Group ID'
                            value={groupId}
                            onChange={(e) => setGroupId(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn">Request to join group</button>
                </form>
            </div>
        </>
    )
}

export default JoinGroupModal;