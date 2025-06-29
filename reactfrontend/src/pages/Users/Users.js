import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import './UsersListPage.scss';
import { useNavigate } from 'react-router-dom';

const UsersListPage = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [size] = useState(10);

    const [sortBy, setSortBy]   = useState('username');
    const [sortDir, setSortDir] = useState('asc');

    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);

    const [search, setSearch] = useState('');
    const [serverMsg, setServerMsg] = useState({ text: '', type: '' });

    const navigate = useNavigate();

    const fetchData = async (searchTerm = '') => {
        setServerMsg({ text: '', type: '' });
        try {
            const params = { page, size, sortBy, sortDir };
            let url = 'http://localhost:8082/users/get';
            if (searchTerm) {
                url = 'http://localhost:8082/users/search';
                params.textValue = searchTerm;
            }
            const { data } = await axios.get(url, { params });
            setUsers(data.users);
            setTotalPages(data.totalPages);
            setTotalItems(data.totalItems);
        } catch (e) {
            console.error('Error fetching users', e);
            setServerMsg({
                text: 'Nie udało się pobrać użytkowników. Spróbuj ponownie później.',
                type: 'error'
            });
        }
    };

    useEffect(() => {
        fetchData(search.trim());
    }, [page, size, sortBy, sortDir]);

    const handlePrev   = () => setPage(p => Math.max(0, p - 1));
    const handleNext   = () => setPage(p => Math.min(totalPages - 1, p + 1));
    const handleSearch = () => { setPage(0); fetchData(search.trim()); };
    const onKeyDown    = e => { if (e.key === 'Enter') handleSearch(); };

    const handleSort = col => {
        if (sortBy === col) {
            setSortDir(dir => dir === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(col);
            setSortDir('asc');
        }
    };

    const handleDelete = async id => {
        if (!window.confirm('Na pewno chcesz usunąć tego użytkownika?')) return;
        try {
            await axios.delete(`http://localhost:8082/users/${id}`);
            setServerMsg({ text: 'Użytkownik usunięty pomyślnie.', type: 'success' });
            fetchData(search.trim());
        } catch (err) {
            console.error('Error deleting user', err);
            setServerMsg({
                text: err.response?.data?.Błąd || 'Nie udało się usunąć użytkownika.',
                type: 'error'
            });
        }
    };

    return (
        <div className="users-list-container">
            <div className="users-list-header">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Szukaj użytkownika..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        onKeyDown={onKeyDown}
                        className="search-input"
                    />
                    <FaSearch className="search-icon" onClick={handleSearch} />
                </div>
                <div className="results-count">
                    Łącznie: <span className="count-badge">{totalItems}</span>
                </div>
            </div>

            {serverMsg.text && (
                <div className={`server-msg server-msg--${serverMsg.type}`}>
                    {serverMsg.text}
                </div>
            )}

            <div className="table-wrapper">
                <table className="users-table">
                    <thead>
                    <tr>
                        {[
                            { key: 'id',    label: '#' },
                            { key: 'username',   label: 'Nazwa' },
                            { key: 'firstname',  label: 'Imię' },
                            { key: 'lastname',   label: 'Nazwisko' },
                            { key: 'dateOfBirth',label: 'Data ur.' },
                            { key: 'email',      label: 'Email' },
                            { key: 'gender',     label: 'Płeć' },
                        ].map(col => (
                            <th
                                key={col.key}
                                className={`sortable${sortBy === col.key ? ' sorted' : ''}`}
                                onClick={() => handleSort(col.key)}
                            >
                                {col.label}
                                {sortBy === col.key && (
                                    <span className={`arrow ${sortDir}`}></span>
                                )}
                            </th>
                        ))}
                        <th>Akcje</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((u, i) => (
                        <tr key={u.id}>
                            <td>{page * size + i + 1}</td>
                            <td>{u.username}</td>
                            <td>{u.firstname}</td>
                            <td>{u.lastname}</td>
                            <td>{u.dateOfBirth}</td>
                            <td>{u.email}</td>
                            <td>{u.gender}</td>
                            <td className="actions-cell">
                                <button
                                    className="btn edit"
                                    title="Edytuj"
                                    onClick={() => navigate(`/users/edit/${u.id}`)}
                                >
                                    <FaEdit />
                                </button>
                                <button
                                    className="btn delete"
                                    title="Usuń"
                                    onClick={() => handleDelete(u.id)}
                                >
                                    <FaTrash />
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className="pagination">
                <button onClick={handlePrev} disabled={page === 0}>
                    Poprzednia
                </button>
                <span>
          Strona {page + 1} z {totalPages}
        </span>
                <button onClick={handleNext} disabled={page === totalPages - 1}>
                    Następna
                </button>
            </div>
        </div>
    );
};

export default UsersListPage;
