import React, { useEffect, useState } from 'react';
import './css/ViewGroup.css';
import { chatApi } from '../apis';
import toast from 'react-hot-toast';


const ViewGroupModal = ({ setViewGroupModalOpen, userName, activeGroup, onlineUsers }) => {

    const [groupData, setGroupData] = useState(null);

    useEffect(() => {

        const fetchGroupData = async () => {
            try {
                const params = { group_id: activeGroup.group_id };
                const response = await chatApi.get('/group', { params });
                const data = response.data;

                if (data.success) {
                    setGroupData(data.groupDetails);
                }
            } catch (error) {
                console.log(error);
                localStorage.clear();
                window.location.reload();
            }
        }

        fetchGroupData();

    }, [activeGroup]);

    const handleRequest = async (acceptStatus, username) => {
        try {
            const params = { acceptStatus: acceptStatus.toString(), group_id: activeGroup.group_id, username };
            const response = await chatApi.put('/join-request-response', null, { params });
            const data = response.data;

            if (data.success) {
                acceptStatus ? toast.success('Join Request accepted') : toast.success('Join Request rejected');
                setGroupData(data.groupList);
            }

        } catch (error) {
            console.log(error);
            localStorage.clear();
            window.location.reload();
        }
    }

    const handleDelete = async () => {

        try {
            const params = { group_id: activeGroup.group_id };
            const response = await chatApi.delete('/leave-group', { params });
            const data = response.data;

            if (data.success) {
                toast.success('Left group');
                window.location.reload();
            }
            else
                toast.error("Admin cannot leave first!");

        } catch (error) {
            console.log(error);
            localStorage.clear();
            window.location.reload();
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
                                            {groupData.admin === username && <h4>(admin)</h4>}

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
                                            {groupData.admin === userName &&
                                                <div className='request-button-tab'>
                                                    <button className='accept' onClick={() => handleRequest(true, username)}><i class="fa-regular fa-circle-check"></i></button>
                                                    <button className='reject' onClick={() => handleRequest(false, username)}><i class="fa-regular fa-circle-xmark"></i></button>
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