import React, { useState } from 'react'
import './css/SearchBar.css';
import { api } from '../apis';

const SearchBar = ({ setReceiver, handleConnection }) => {

    const [searchResult, setSearchResult] = useState([]);
    const [searchInput, setSearchInput] = useState('');


    const handleSearch = async (e) => {
        const userString = e.target.value;
        setSearchInput(userString);
        // add debouncer later
        try {
            const response = await api.get('/search', { params: { searchQuery: userString } });
            if (response.data) {
                const userList = response.data.searchResult;
                setSearchResult(userList);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <nav className='SearchBar'>

            <div className='Search-Container'>                
                <input
                    type='text'
                    name='receiver'
                    placeholder='Search user...'
                    value={searchInput}
                    autoComplete='off'
                    onChange={(e) => handleSearch(e)}                    
                >            
                </input>
            </div>
            
            <div className='Search-Results-Container'>
                <ul>
                    {searchResult.map((user, index) => (
                        <li key={index}> 
                            <div className='chat-header-dp'><i className="fa-solid fa-user"></i></div>
                            <h1>{user.username}</h1>
                        </li>
                    ))}
                </ul>
            </div>

        </nav>
    )
}

export default SearchBar;