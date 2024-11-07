import React, { useState } from 'react'
import './css/SearchBar.css';
import { chatApi } from '../apis';

const SearchBar = () => {

    const [searchResult, setSearchResult] = useState([]);
    const [searchInput, setSearchInput] = useState('');

    const handleSearch = async (e) => {
        const userString = e.target.value;
        setSearchInput(userString);
        // add debouncer later
        try {
            const response = await chatApi.get('/search', { params: { searchQuery: userString } });
            if (response.data) {
                const userList = response.data.searchResult;
                setSearchResult(userList);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleClearButton = () => {
        setSearchInput('');
        setSearchResult([]);
    }

    return (
        <nav className='SearchBar'>
            <h1>Social Sphere</h1>
            <div className='Search-Container'>
                <div className='input-wrapper'>
                    <input
                        type='text'
                        name='receiver'
                        placeholder='Search user...'
                        value={searchInput}
                        autoComplete='off'
                        onChange={(e) => handleSearch(e)}
                    >                
                    </input>
                    <button onClick={() => handleClearButton()} className='clear-search'>
                        <i className="fa-regular fa-circle-xmark"></i>
                    </button> 
                </div>
            </div>

            <div className='Search-Results-Container'>
                <ul>
                    {searchResult.map((user, index) => (
                        <li key={index}>
                            <div className='chat-header-dp'><i className="fa-solid fa-user"></i></div>
                            <h2>{user.username}</h2>
                        </li>
                    ))}
                </ul>
            </div>

        </nav>
    )
}

export default SearchBar;