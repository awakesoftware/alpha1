import React, { useState } from "react";
import Button from '../../../components/FormElements/Button';

export default function Contact(props) {
    
    const [status, setStatus] = useState("Submit");
    /*
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("Sending...");
        const { name, email, message } = e.target.elements;
        let details = {
            name: name.value,
            email: email.value,
            message: message.value,
        };
        let response = await fetch("http://localhost:5000/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
        },
            body: JSON.stringify(details),
        });
        setStatus("Submit");
        let result = await response.json();
        alert(result.status);
    };
    */
  return (
    <div className='contact'>
        {/* <h1>Contact Awake Industries</h1>
        <form onSubmit={'handleSubmit'}>
        <div>
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" required />
        </div>
        <div>
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" required />
        </div>
        <div>
            <label htmlFor="message">Message:</label>
            <textarea id="message" required />
        </div>
        <Button type='submit' onClick={props.onClose} color={'blue'}>
            {status}
        </Button>
        </form> */}
        Need to send us a message? Email us here: <a target="_blank" rel="noopener noreferrer" href="mailto:support@awakestudios.net">Awake Studios</a>
    </div>
  );
};
