import React, { useState } from 'react'
import { chatApi } from '../apis';
import toast from 'react-hot-toast';

const AddParticipantModal = ({ setAddParticipantModalOpen, activeGroup }) => {

    const [inputUserName, setInptUserName] = useState('');

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {
            const body = { username: inputUserName, groupId: activeGroup.group_id }
            const response = await chatApi.post('/add-participant', body);
            const data = response.data;
            console.log(data.success);
            if (data.success) {
                toast.success("User added to group.");
                setAddParticipantModalOpen(false);
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
            <div className='Modal' onClick={() => setAddParticipantModalOpen(false)}></div>
            <div className="login-form overlay-container">
                <h2>Add participant</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Username</label>
                        <input
                            type="text"
                            id="add-participant"
                            placeholder='Enter username'
                            value={inputUserName}
                            onChange={(e) => setInptUserName(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn">Add user to group</button>
                </form>
            </div>
        </>
    )
}

export default AddParticipantModal;