import React, { useState, useContext, useRef } from 'react';

import Input from '../../FormElements/Input';
import Button from '../../FormElements/Button';

import {
    VALIDATOR_EMAIL,
    VALIDATOR_MAXLENGTH,
    VALIDATOR_MINLENGTH,
    VALIDATOR_REQUIRE
} from '../../../util/validators';

import { useForm } from '../../../hooks/form-hook';
import { useHttpClient } from '../../../hooks/http-hook';
import { AuthContext } from '../../../context/auth-context';

export let loginDropdownOpen = () => {
    console.log('open the login dropdown');
};

export default function LoginDropdown() {
    
    const auth = useContext(AuthContext);
    const [isLoginMode, setIsLoginMode] = useState(false);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const loginDropdownRef = useRef<any>();
   
    const [formState, inputHandler, setFormData] = useForm(
      {
        email: {
          value: '',
          isValid: false
        },
        password: {
          value: '',
          isValid: false
        }
      },
      false
    );

    const authSubmitHandler = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
    
        try {
            const responseData = await sendRequest(
                'http://localhost:5000/api/users/login',
                'POST',
                JSON.stringify({
                email: formState.inputs.email.value,
                password: formState.inputs.password.value
                }),
                {
                'Content-Type': 'application/json'
                }
            );
            
            auth.login(
                responseData.userId,
                responseData.email,
                responseData.image,
                responseData.username,
                responseData.firstName,
                responseData.lastName,
                responseData.token
            );

        } catch (error) {  }
    }

    function checkName(event: { clipboardData: { getData: (arg0: string) => any; }; preventDefault: () => void; }) {
        var data = event.clipboardData.getData("text/plain");
        var isNullOrContainsWhitespace = (!data || data.length === 0 || /\s/g.test(data));
        
        if(isNullOrContainsWhitespace)
        {
            event.preventDefault();
        }
    }

    return (
        <form 
            className='login-dropdown'
            onSubmit={authSubmitHandler}
            ref={loginDropdownRef}
        >
            <h2>Login</h2>
            <section>
                <Input
                    element="input"
                    id="email"
                    type="email"
                    label="E-Mail"
                    validators={[VALIDATOR_EMAIL()]}
                    errorText="Please enter a valid email address."
                    onInput={inputHandler}
                    onPaste={checkName}
                />
            </section>
            <section>
                <Input
                    element="input"
                    id="password"
                    type="password"
                    label="Password"
                    validators={[ VALIDATOR_MINLENGTH(6), VALIDATOR_MAXLENGTH(25) ]}
                    minLength='6'
                    maxLength='25'
                    errorText="Please enter a valid password, of 6-25 characters."
                    onInput={inputHandler}
                    // onKeyDown={NameKeyDown}
                    onPaste={checkName}
                />
            </section>
            <Button type="submit" disabled={!formState.isValid} color='blue'>
                LOGIN
            </Button>
        </form>
    )
}
