import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './UserFormPage.scss';

const initialState = {
    username: '',
    firstname: '',
    lastname: '',
    password: '',
    dateOfBirth: '',
    email: '',
    gender: ''
};

const genders = [
    { value: '', label: 'Wybierz płeć' },
    { value: 'Mężczyzna',   label: 'Mężczyzna' },
    { value: 'Kobieta', label: 'Kobieta' },
];

const UserFormPage = () => {
    const [form, setForm] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [serverMsg, setServerMsg] = useState('');
    const [serverMsgType, setServerMsgType] = useState('success');
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            axios.get(`http://localhost:8082/users/${id}`)
                .then(resp => {
                    if (resp.data.Sukces) setForm(resp.data.Sukces);
                });
        }
    }, [id]);

    const validate = () => {
        const errs = {};
        if (!form.username.trim())     errs.username    = 'Pole wymagane';
        if (!form.firstname.trim())    errs.firstname   = 'Pole wymagane';
        if (!form.lastname.trim())     errs.lastname    = 'Pole wymagane';
        if (!id && !form.password)     errs.password    = 'Pole wymagane';
        if (!form.email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/))
            errs.email       = 'Niepoprawny email';
        if (!form.dateOfBirth)         errs.dateOfBirth = 'Pole wymagane';
        if (!form.gender)              errs.gender      = 'Pole wymagane';
        return errs;
    };

    const handleSubmit = async e => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) {
            setErrors(errs);
            setServerMsgType('error');
            setServerMsg('Popraw błędy formularza');
            return;
        }
        setErrors({});
        try {
            const url    = id ? `http://localhost:8082/users/${id}` : 'http://localhost:8082/users';
            const method = id ? axios.put : axios.post;
            const resp   = await method(url, form);

            setServerMsgType('success');
            setServerMsg(resp.data.Sukces || 'Operacja zakończona pomyślnie');
        } catch (err) {
            if (err.response?.status === 400 && typeof err.response.data === 'object') {
                setErrors(err.response.data);
                setServerMsgType('error');
                setServerMsg('Popraw błędy formularza');
            } else {
                setServerMsgType('error');
                setServerMsg(err.response?.data?.Błąd || 'Wystąpił nieoczekiwany błąd');
            }
        }
    };

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    return (
        <div className="user-form-container">
            <h2>{id ? 'Edytuj użytkownika' : 'Dodaj użytkownika'}</h2>
            {serverMsg &&
                <div className={`server-msg server-msg--${serverMsgType}`}>
                    {serverMsg}
                </div>
            }
            <form onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                    <label>Nazwa użytkownika</label>
                    <input
                        className={errors.username ? 'error' : ''}
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                    />
                    {errors.username && <span className="error-text">{errors.username}</span>}
                </div>
                <div className="form-group">
                    <label>Imię</label>
                    <input
                        className={errors.firstname ? 'error' : ''}
                        name="firstname"
                        value={form.firstname}
                        onChange={handleChange}
                    />
                    {errors.firstname && <span className="error-text">{errors.firstname}</span>}
                </div>
                <div className="form-group">
                    <label>Nazwisko</label>
                    <input
                        className={errors.lastname ? 'error' : ''}
                        name="lastname"
                        value={form.lastname}
                        onChange={handleChange}
                    />
                    {errors.lastname && <span className="error-text">{errors.lastname}</span>}
                </div>
                <div className="form-group">
                    <label>Hasło</label>
                    <input
                        className={errors.password ? 'error' : ''}
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                    />
                    {errors.password && <span className="error-text">{errors.password}</span>}
                </div>
                <div className="form-group">
                    <label>Data urodzenia</label>
                    <input
                        className={errors.dateOfBirth ? 'error' : ''}
                        type="date"
                        name="dateOfBirth"
                        value={form.dateOfBirth}
                        onChange={handleChange}
                    />
                    {errors.dateOfBirth && <span className="error-text">{errors.dateOfBirth}</span>}
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        className={errors.email ? 'error' : ''}
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                </div>
                <div className="form-group">
                    <label>Płeć</label>
                    <select
                        className={errors.gender ? 'error' : ''}
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                    >
                        {genders.map(g => (
                            <option key={g.value} value={g.value}>{g.label}</option>
                        ))}
                    </select>
                    {errors.gender && <span className="error-text">{errors.gender}</span>}
                </div>
                <button type="submit" className="btn-submit">
                    {id ? 'Zapisz' : 'Dodaj'}
                </button>
            </form>
        </div>
    );
};

export default UserFormPage;
