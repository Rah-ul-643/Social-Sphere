import React, { useEffect, useState } from 'react';
import './css/ViewGroup.css';
import { api } from '../apis';
import toast from 'react-hot-toast';


const ViewGroupModal = ({ setViewGroupModalOpen, activeGroup, userName, onlineUsers }) => {

    const [groupData, setGroupData] = useState(null);

    useEffect(() => {

        const fetchGroupData = async () => {
            try {
                const params = { group_id: activeGroup.group_id };
                const response = await api.get('/group', { params });
                const data = response.data;

                if (data.success) {
                    setGroupData(data.groupDetails);
                }
            } catch (error) {
                console.log(error);
            }
        }

        fetchGroupData();

    },[activeGroup]);

    const handleRequest = async (acceptStatus,username) => {
        try {
            const params = { acceptStatus: acceptStatus.toString(), group_id: activeGroup.group_id, username };
            const response = await api.put('/join-request-response', null, { params });
            const data = response.data;

            if (data.success) {
                acceptStatus ? toast.success('Join Request accepted') : toast.success('Join Request rejected');
                setGroupData(data.groupList);
            }

        } catch (error) {
            console.log(error);
        }
    }

    const handleDelete = async () => {
        if (userName === groupData.admin && groupData.participants.length>1){
            toast.error("Admin cannot leave group first!");
            return;
        }

        try {
            const params = {  group_id: activeGroup.group_id, username:userName };
            const response = await api.delete('/leave-group', { params });
            const data = response.data;

            if (data.success) {
                toast.success('Left group');
                window.location.reload();                
            }
        } catch (error) {
            console.log(error);
            toast.error("Unable to process request!");
        }
    }

    return (
        <>
            <div className='Modal' onClick={() => setViewGroupModalOpen(false)}></div>
            <div className='view-group overlay-container'> 
            {groupData &&  
                <>
                
                <section>
                    <h1>Group Participants</h1>
                    <ul className='participants-list'>
                        {groupData.participants.map(username => (
                            <li>
                                <div className='list-name'>

                                    <h2>{username}</h2>
                                    {groupData.admin===username && <h4>(admin)</h4>}

                                </div>
                                <div className={onlineUsers.includes(username) ? 'online' : 'offline'}><i className="fa-solid fa-circle"></i></div>
                            </li>
                        ))}
                    </ul>
                </section>
                
                <section>
                    <h1>Active Join Requests</h1>
                    <ul className='join-requests-list'>
                        {groupData.join_requests.length ?
                            groupData.join_requests.map(username => (
                            <li>
                                <h2>{username}</h2>
                                {groupData.admin===userName &&
                                    <div className='request-button-tab'>
                                        <button className='accept' onClick={()=>handleRequest(true,username)}><i class="fa-regular fa-circle-check"></i></button>
                                        <button className='reject' onClick={()=>handleRequest(false,username)}><i class="fa-regular fa-circle-xmark"></i></button>
                                    </div>
                                }
                            </li>
                        ))
                        :
                        <p>No active requests...</p>
                        }
                    </ul>
                    <div className='leave-group'>
                        <button onClick={handleDelete}>Leave group</button>
                    </div>
                </section>
                </>
                }

                {!groupData && 
                    <h2>loading...</h2>
                }
            </div>
            
        </>
    )
}

export default ViewGroupModal;