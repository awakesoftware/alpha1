import React, { useContext, useState } from 'react';
import {AuthContext} from '../../../context/auth-context';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function Account() {
    const auth = useContext(AuthContext);
    const [ selectedDate, setSelectedDate ] = useState(null);

    return (
        <div className='settings-account'>
            <section>
                <h2>Account Information</h2>
                <img
                    src={`http://localhost:5000/${auth.image}`}
                    alt={auth.firstName}
                    onClick={() => {
                        // setEditPicture(true)
                    }}
                    className='rounded-profile-pic'
                    style={{width: '300px'}}
                />
            </section>

            <section>
                <h3>Personal Info</h3>
                <>
                    <label>
                        First Name
                        <input
                            value={auth.firstName}
                        />
                    </label>
                </>

                <>
                    <label>
                        Last Name
                        <input
                            value={auth.lastName}
                        />
                    </label>
                </>

                <>
                    <label>
                        Username
                        <input
                            value={auth.username}
                        />
                    </label>
                </>

                <>
                    <label>
                        Email
                        <input
                            value={auth.userEmail}
                        />
                    </label>
                </>
                <label>
                    <p>Birthday</p>
                    <DatePicker
                        selected={selectedDate}
                        onChange={date => setSelectedDate(date)}
                        maxDate={new Date()}
                        isClearable
                        showYearDropdown
                        scrollableMonthYearDropdown
                        placeholderText='01/30/2000'
                    />
                </label>
            </section>
            
            <section>
                <h3>Address</h3>
                <>
                    <label>
                        Street
                        <input
                            type='text'
                            placeholder='1234 Main Street'
                        />
                    </label>
                </>

                <>
                    <label>
                        Apt./Suite #
                        <input
                            type='text'
                            placeholder='(optional)'
                        />
                    </label>
                </>
                
                <>
                    <label>
                        State
                        <input
                            type='text'
                            placeholder='AZ'
                            minLength={2}
                            maxLength={2}
                        />
                    </label>
                </>

                <>
                    <label>
                        Zip Code
                        <input
                            type='text'
                            placeholder='88888'
                            minLength={5}
                            maxLength={5}
                        />
                    </label>
                </>
            </section>
        </div>
    )
}
