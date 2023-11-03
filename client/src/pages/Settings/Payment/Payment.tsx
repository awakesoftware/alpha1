import React, { useState } from 'react';
import Button from '../../../components/FormElements/Button';
import Cards from 'react-credit-cards';
import 'react-credit-cards/es/styles-compiled.css';
 
export default function PaymentForm() {
    const [ number, setNumber ] = useState('');
    const [ name, setName ] = useState('');
    const [ expiry, setExpiry ] = useState('');
    const [ cvc, setCvc ] = useState('');
    const [ focus, setFocus ] = useState('');
    
    // const handleInputFocus = (e) => {
    //     setState({ focus: e.target.name });
    // }
    
    // const handleInputChange = (e) => {
    //     const { name, value } = e.target;
        
    //     setState({ [name]: value });
    // }
  
    return (
        <div id="PaymentForm">
            <form>
                <h3>Card Information</h3>
                <input
                    type="tel"
                    name="number"
                    placeholder="Card Number"
                    value={number}
                    onChange={(e) => {
                        setNumber(e.target.value);
                    }}
                    onFocus={(e) => {
                        setFocus(e.target.name);
                    }}
                />


                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                    }}
                    onFocus={(e) => {
                        setFocus(e.target.name);
                    }}
                />


                <input
                    type="text"
                    name="expiry"
                    placeholder="MM/YY Expiry"
                    value={expiry}
                    onChange={(e) => {
                        setExpiry(e.target.value);
                    }}
                    onFocus={(e) => {
                        setFocus(e.target.name);
                    }}
                />


                <input
                    type="tel"
                    name="cvc"
                    placeholder="CVC"
                    value={cvc}
                    onChange={(e) => {
                        setCvc(e.target.value);
                    }}
                    onFocus={(e) => {
                        setFocus(e.target.name);
                    }}
                />


                <Button type='submit' color={'blue'}>
                    Add card
                </Button>
            </form>

            <Cards
                number={number}
                name={name}
                expiry={expiry}
                cvc={cvc}
                focused={focus}
            />
        </div>
    );
}