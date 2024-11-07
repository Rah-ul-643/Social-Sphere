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
import Loader from '../components/Loader';

const SOCKET_SERVER_URL = process.env.REACT_APP_SOCKET_SERVER_URL

const Home = ({ setIsLoggedIn }) => {

    const [isDarkMode, setIsDarkMode] = useState(true);
    const [socket, setSocket] = useState(null);
    const [userName, setUserName] = useState('');
    const [activeGroup, setActiveGroup] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [chats, setChats] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [onlineUsers, setOnlineUsers] = useState('');

    // loaders states

    const [globalLoading, setGlobalLoading] = useState(true);
    const [chatLoading, setChatLoading] = useState(false);

    //modal states

    const [isSmallScreen,] = useState(window.innerWidth <= 768);

    const [conversationSectionOpen, setConversationSectionOpen] = useState(true);
    const [chatSectionOpen, setChatSectionOpen] = useState(!isSmallScreen);
    const [createGroupModalOpen, setCreateGroupModalOpen] = useState(false);
    const [joinGroupModalOpen, setJoinGroupModalOpen] = useState(false);
    const [addParticipantModalOpen, setAddParticipantModalOpen] = useState(false);
    const [viewGroupModalOpen, setViewGroupModalOpen] = useState(false);

    // on-mount only useEffect -> sets up new socket connection

    useEffect(() => {
        const newSocket = io(SOCKET_SERVER_URL, {
            query: {
                token: JSON.parse(localStorage.getItem('token'))
            }
        });
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };

    }, []);

    //  socket events

    useEffect(() => {

        if (!socket) return;

        const handleConnect = () => {

            socket.emit('retrieve-conversations', (groupList) => {
                setConversations(groupList);
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

        socket.on('connect_error', () => {
            localStorage.removeItem('token');
            setIsLoggedIn(false);
        });

        socket.on('set-username', (username) => {
            setUserName(username);
        })

        //cleanup function

        return () => {
            socket.off('connect', handleConnect);
            socket.off('receive-msg', handleReceiveMsg);
            socket.off('online-users', handleOnlineUsers);
            socket.off('disconnect', handleDisconnect);
        };

    }, [activeGroup, setIsLoggedIn, socket, userName]);



    const fetchChatHistory = (group) => {
        if (socket) {
            setChatLoading(true);
            const group_id = group.group_id;
            const group_name = group.group_name;

            socket.emit('chat-history', group_id, (chats) => {

                setChats(chats);
                setChatLoading(false);

                if (!conversations.find(group => group.group_id === group_id)) {                 // add the group to the list of conversations.                    
                    setConversations(prev => [...prev, { group_name, group_id }]);
                }

            });

        }
    };


    const handleSendMsg = (e) => {
        e.preventDefault();

        if (socket && messageInput && activeGroup) {
            socket.emit('send-msg', messageInput, activeGroup.group_id);
            setMessageInput('');
        }
    };


    return (
        <>
            {globalLoading ?

                <Loader
                    divClasses={'Loader Home'}
                    loaderImage={globalLoaderImage}
                />

                :

                <div className='Home'>

                    {joinGroupModalOpen &&
                        <JoinGroupModal
                            setJoinGroupModalOpen={setJoinGroupModalOpen}
                            conversations={conversations}
                        />
                    }

                    {createGroupModalOpen &&
                        <CreateGroupModal
                            setCreateGroupModalOpen={setCreateGroupModalOpen}
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
                        setConversationSectionOpen={setConversationSectionOpen}
                        setChatSectionOpen={setChatSectionOpen}
                        setJoinGroupModalOpen={setJoinGroupModalOpen}
                        setCreateGroupModalOpen={setCreateGroupModalOpen}
                        isDarkMode={isDarkMode}
                        setIsDarkMode={setIsDarkMode}
                    />

                    {conversationSectionOpen && <section className=
                        {`Conversation-Section ${conversationSectionOpen ? 'slide-in' : 'slide-out'}`}
                        style={{ borderRight: isDarkMode ? 'solid white 2px' : 'solid black 2px' }}
                    >

                        <SearchBar />
                        <h1 className='chats-header'>Chats</h1>
                        <ChatList
                            conversations={conversations}
                            activeGroup={activeGroup}
                            setActiveGroup={setActiveGroup}
                            fetchChatHistory={fetchChatHistory}
                            setChatSectionOpen={setChatSectionOpen}
                            setConversationSectionOpen={setConversationSectionOpen}
                            isSmallScreen={isSmallScreen}
                        />

                    </section>
                    }

                    {chatSectionOpen && <section className='Chat-Section'>

                        <ChatHeader
                            activeGroup={activeGroup}
                            setAddParticipantModalOpen={setAddParticipantModalOpen}
                            setViewGroupModalOpen={setViewGroupModalOpen}
                        />
                        <hr style={{
                            backgroundColor: isDarkMode ? 'white' : 'black',
                            width: '75%',
                            margin: 'auto',
                            height: '1.5px'
                        }} />
                        {chatLoading ?

                            <Loader
                                divClasses={'Chat-Content Loader'}
                                loaderImage={componentLoaderImage}
                                imageClasses={'ChatLoaderImg'}
                                content={'loading chats...'}
                            />

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
                            handleSendMsg={handleSendMsg}
                        />

                    </section>
                    }

                </div>
            }
        </>
    )

}

export default Home;