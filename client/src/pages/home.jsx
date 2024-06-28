import { useEffect, useState } from 'react';
import io from 'socket.io-client';

import './css/home.css';

import SideBar from '../components/SideBar';
import SearchBar from '../components/SearchBar';
import ChatList from '../components/ChatList';
import ChatHeader from '../components/ChatHeader';
import ChatContent from '../components/ChatContent';
import MessageInputBar from '../components/MessageInputBar';
import CreateGroupModal from '../components/CreateGroupModal';
import JoinGroupModal from '../components/JoinGroupModal';
import AddParticipantModal from '../components/AddParticipantModal';
import ViewGroupModal from '../components/ViewGroupModal';

import globalLoaderImage from '../static/loader.gif';
import componentLoaderImage from '../static/componentLoader.gif';

const SOCKET_SERVER_URL = process.env.REACT_APP_SOCKET_SERVER_URL

const Home = ({ setIsLoggedIn }) => {

    const [socket, setSocket] = useState(null);
    const [userName, setUserName] = useState('');
    const [activeGroup,setActiveGroup] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [chats, setChats] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [onlineUsers, setOnlineUsers] = useState('');
    
    // loaders states

    const [globalLoading,setGlobalLoading] = useState(true);
    const [chatLoading,setChatLoading] = useState(false);

    //modal states

    const [chatSectionOpen, setChatSectionOpen] = useState(true);
    const [createGroupModalOpen, setCreateGroupModalOpen] = useState(false);
    const [joinGroupModalOpen, setJoinGroupModalOpen] = useState(false);
    const [addParticipantModalOpen, setAddParticipantModalOpen] = useState(false);
    const [viewGroupModalOpen, setViewGroupModalOpen] = useState(false);

    // on-mount only useEffect -> sets up new socket connection

    useEffect(() => {
        const newSocket = io(SOCKET_SERVER_URL);
        setSocket(newSocket);
        return () => {
            newSocket.disconnect();
        };
    }, []);

    //  socket events

    useEffect(() => {

        if (!socket) return;

        const handleConnect = () => {
            const username = JSON.parse(localStorage.getItem('user')).username;
            setUserName(username);            

            socket.emit('setUserId', username);
            socket.emit('getUsers', username, (userList) => {
                setConversations(userList);
                setGlobalLoading(false);
            });
        };

        const handleOnlineUsers = (userList) => {
            setOnlineUsers(userList);
        }

        const handleReceiveMsg = (msg, sender, groupId) => {             

            if (groupId === activeGroup.group_id) {            
                setChats(prevChats => [...prevChats, { sender, message: msg }]);
            }            

        };

        const handleDisconnect = () => {
            if (socket) {
                setActiveGroup('');
                setChats([]);
            }

        };

        socket.on('connect', handleConnect);
        socket.on('disconnect', handleDisconnect);
        socket.on('receive-msg', handleReceiveMsg);
        socket.on('online-users', handleOnlineUsers);

        //cleanup function

        return () => {
            socket.off('connect', handleConnect);
            socket.off('receive-msg', handleReceiveMsg);
            socket.off('online-users', handleOnlineUsers);
            socket.off('disconnect', handleDisconnect);
        };

    }, [activeGroup, socket, userName]);



    const handleConnection = (group) => {
        if (socket ) {
            setChatLoading(true);
            const group_id = group.group_id;
            const group_name = group.group_name;

            socket.emit('connection-request', group_id, (chats) => {

                setChats(chats);
                setChatLoading(false);
                
                if (!conversations.find(group => group.group_id===group_id)) {                 // add the group to the list of conversations.                    
                    setConversations(prev => [...prev, {group_name,group_id}]);
                }

            });

        }
    };


    const handleSender = (e) => {
        e.preventDefault();

        if (socket && messageInput && userName && activeGroup) {
            socket.emit('send-msg', messageInput, userName, activeGroup.group_id);
            setChats(prevChats => [...prevChats, { sender: userName, message: messageInput }]);
            setMessageInput('');
        }
    };


    return (
        <>
        { globalLoading ?
            <div className='Home Loader '>
                <img src={globalLoaderImage} alt="Loading..." />
            </div>
        :
        
            <div className='Home'>
                
                {joinGroupModalOpen && 
                    <JoinGroupModal 
                        setJoinGroupModalOpen={setJoinGroupModalOpen} 
                        username={userName}
                        conversations={conversations}
                    />
                }

                {createGroupModalOpen && 
                    <CreateGroupModal 
                        setCreateGroupModalOpen={setCreateGroupModalOpen} 
                        username={userName} 
                        setActiveGroup={setActiveGroup}
                        setConversations={setConversations}
                    />
                }

                {addParticipantModalOpen && 
                    <AddParticipantModal 
                        setAddParticipantModalOpen={setAddParticipantModalOpen}
                        activeGroup={activeGroup}
                    />
                }

                {viewGroupModalOpen &&
                    <ViewGroupModal
                        setViewGroupModalOpen={setViewGroupModalOpen}
                        activeGroup={activeGroup}
                        userName={userName}
                        onlineUsers={onlineUsers}
                    />                    
                }

                <SideBar 
                    setIsLoggedIn={setIsLoggedIn}
                    setChatSectionOpen={setChatSectionOpen}
                    setJoinGroupModalOpen={setJoinGroupModalOpen}
                    setCreateGroupModalOpen={setCreateGroupModalOpen}
                />

                <section className={`Conversation-Section ${chatSectionOpen ? 'slide-in' : 'slide-out'}`}  >

                    <SearchBar
                        setActiveGroup={setActiveGroup}
                        handleConnection={handleConnection}
                    />
                    
                    <ChatList
                        conversations={conversations}
                        setActiveGroup={setActiveGroup}
                        handleConnection={handleConnection}
                    />            

                </section>
                
                <section className='Chat-Section'>

                    <ChatHeader
                        activeGroup={activeGroup}
                        setAddParticipantModalOpen={setAddParticipantModalOpen}
                        setViewGroupModalOpen={setViewGroupModalOpen}
                    />
                    {chatLoading ? 
                        <div className='Loader Chat-Content'>
                            loading chats... <img src={componentLoaderImage} className='ChatLoaderImg' alt="" />
                        </div>
                     :
                        <ChatContent
                            userName={userName}
                            activeGroup={activeGroup}
                            chats={chats}
                        />
                    }

                    <MessageInputBar
                        messageInput={messageInput}
                        setMessageInput={setMessageInput}
                        activeGroup={activeGroup}
                        handleSender={handleSender}
                    />

                </section>
               
            </div>        
        }
        </>
    )
    
}

export default Home;