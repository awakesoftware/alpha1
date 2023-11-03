import React, { useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// import Footer from '../../components/Footer/Footer';

import ErrorModal from '../../components/UIElements/ErrorModal';
import LoadingSpinner from '../../components/UIElements/LoadingSpinner';
import Input from '../../components/FormElements/Input';
import Button from '../../components/FormElements/Button';
import ImageUpload from '../../components/FormElements/ImageUpload';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MAXLENGTH,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE
} from '../../util/validators';
import { loginDropdownOpen } from '../../components/Navbar/DropdownMenus/LoginDropdown';
import { useForm } from '../../hooks/form-hook';
import { useHttpClient } from '../../hooks/http-hook';
import { AuthContext } from '../../context/auth-context';

interface Location {
  state: {
    loginView: boolean
  }
} 

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLoginModeActive, setIsLoginModeActive] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  // const location: Location = useLocation();  

  // useEffect(() => {
  //   setIsLoginModeActive(location.state.loginView)
  // }, [location])

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

  const switchModeHandler = () => {
    if (!isLoginModeActive) {
      //* in signup mode
      setFormData(
        {
          ...formState.inputs,
          image: undefined,
          firstName: undefined,
          lastName: undefined,
          username: undefined,
          phone: undefined
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      //* in login mode
      setFormData(
        {
          ...formState.inputs,
          image: {
            value: null,
            isValid: false
          },
          firstName: {
            value: '',
            isValid: false
          },
          lastName: {
            value: '',
            isValid: false
          },
          username: {
            value: '',
            isValid: false
          },
          phone: {
            value: '',
            isValid: false
          }
        },
        false
      );
    }
    setIsLoginModeActive(prevMode => !prevMode);
  };

  const authSubmitHandler = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    
    if(isLoginModeActive) {
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

    } else {
      try {
        
        //* form data (image)
        const formData = new FormData();
        formData.append('image', formState.inputs.image.value);
        formData.append('firstName', formState.inputs.firstName.value);
        formData.append('lastName', formState.inputs.lastName.value);
        formData.append('email', formState.inputs.email.value);
        formData.append('username', formState.inputs.username.value);
        formData.append('password', formState.inputs.password.value);
        formData.append('phone', formState.inputs.phone.value);

        //* json data (user text)
        const responseData = await sendRequest(
          'http://localhost:5000/api/users/signup',
          'POST',
          formData
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

  };

  function between(x: number, min: number, max: number) {
    return x >= min && x <= max;
  }

  function NameKeyDown(e) { 
    var e = window.event || e;
    var key = e.keyCode;

    
    //* if((key >= 65 && key <= 90) || key == 8) {
    if( (between(key, 0, 7) || between(key, 9, 64) || between(key, 91, 96) || between(key, 123, 1000) )) {
      e.preventDefault();
    }
  }

  function NumberKeyDown(e) { 
    var e = window.event || e;
    var key = e.keyCode;

    //* if( !( between(key, 48, 57) ))  {
    if( (between(key, 0, 7) || between(key, 9, 47) || between(key, 58, 1000) )) {
      e.preventDefault();
    }
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
    <>
      <img className='auth-background-img' src='http://localhost:5000/lion.png' alt='background image'/>
      <form
        className={`auth-form ${isLoginModeActive ? 'active' : ''}`}
        onSubmit={authSubmitHandler}
      >
        <ErrorModal error={error} onClear={clearError} />
        { isLoading && <LoadingSpinner asOverlay /> }
        <section className='auth-grid'>
          <h1 className='login-header'>{ isLoginModeActive ? 'Login' : 'Signup'}</h1>
          <article>
          {!isLoginModeActive && (
            <>
              <ImageUpload
                center
                id='image'
                // initBtn='Image'
                initValue='Please select a profile picture.'
                onInput={inputHandler}
                errorText='Please provide an image.'
              />
              <Input
                element="input"
                id="username"
                type="text"
                label="Username"
                validators={[ VALIDATOR_MINLENGTH(6), VALIDATOR_MAXLENGTH(18) ]}
                minLength='6'
                maxLength='18'
                errorText="Please enter a valid username, of 6-18 characters."
                onInput={inputHandler}
                // onKeyDown={NameKeyDown}
                onPaste={checkName}
              />
            </>
          )}
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
          </article>
          <article>
            {!isLoginModeActive && (
              <>
                <Input
                  element="input"
                  id="firstName"
                  type="text"
                  label="First Name"
                  validators={[ VALIDATOR_MINLENGTH(1), VALIDATOR_MAXLENGTH(20) ]}
                  minLength='1'
                  maxLength='20'
                  errorText="Please enter your first name."
                  onInput={inputHandler}
                  onKeyDown={NameKeyDown}
                  onPaste={checkName}
                />
                <Input
                  element="input"
                  id="lastName"
                  type="text"
                  label="Last Name"
                  validators={[ VALIDATOR_MINLENGTH(1), VALIDATOR_MAXLENGTH(20) ]}
                  minLength='1'
                  maxLength='20'
                  errorText="Please enter your last name."
                  onInput={inputHandler}
                  onKeyDown={NameKeyDown}
                  onPaste={checkName}
                />
              </>
            )}
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
            {!isLoginModeActive && (
              <>
                <Input
                  element="input"
                  id="phone"
                  type="text"
                  label="Phone"
                  validators={[ VALIDATOR_MINLENGTH(10), VALIDATOR_MAXLENGTH(10) ]}
                  minLength='10'
                  maxLength='10'
                  errorText="Please enter a 10 digit phone number."
                  onInput={inputHandler}
                  onKeyDown={NumberKeyDown}
                  onPaste={checkName}
                />
              </>
            )}
          </article>
          <Button type="submit" disabled={!formState.isValid} color='blue'>
            {isLoginModeActive ? 'LOGIN' : 'SIGNUP'}
          </Button>
        </section>
        <p>
          {isLoginModeActive ? 'Not yet a member?' : 'Already a member?'}
          <span
            onClick={() => {
              switchModeHandler()
            }}
          >
            {isLoginModeActive ? ' Signup here' : ' Login here'}
          </span>
        </p>
      </form>
    </>
  );
};

export default Auth;
