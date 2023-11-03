import React, { useState, useContext } from 'react';
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
import { useForm } from '../../hooks/form-hook';
import { useHttpClient } from '../../hooks/http-hook';
import { AuthContext } from '../../context/auth-context';

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

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
    if (!isLoginMode) {
      //* in signup mode, switching to login mode
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
      //* in login mode, switching to signup mode
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
    setIsLoginMode(prevMode => !prevMode);
  };

  const authSubmitHandler = async event => {
    event.preventDefault();

    if(isLoginMode) {
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

  function between(x, min, max) {
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

  function checkName(event) {
    var data = event.clipboardData.getData("text/plain");
    var isNullOrContainsWhitespace = (!data || data.length === 0 || /\s/g.test(data));
  
    if(isNullOrContainsWhitespace)
    {
      event.preventDefault();
    }
  }

  const [animationTest, setAnimationTest] = useState(false);
  const animationHandler = () => {
    // setTimeout(() => {
      
    // }, 500);
    setAnimationTest(!animationTest)
  }

  const switchModeTimer = () => {
    setTimeout(() => {
      switchModeHandler();
    }, 150);
    animationHandler()
  }

  return (
    <>
      <img className='auth-background-img' src='http://localhost:5000/lion.png' alt='background image'/>
      <section className="auth-grid">
        <section className='auth-desc'>
            <article className='right'>
              <h1>Welcome!</h1>
              <h3>
                Already a member? <a className='auth-swap' onClick={switchModeTimer}>Login <span className='swapper' style={{color: 'blue', cursor: 'pointer'}}>here</span>!</a>
              </h3>
            </article>
            <article className='left'>
              <h3>
                Not a member? <a onClick={switchModeTimer}>Signup <span className='swapper' style={{color: 'blue', cursor: 'pointer'}}>here</span>!</a>
              </h3>
            </article>
        </section>
        <form className={`${isLoginMode ?  `auth-form-left` : 'auth-form-right'}`} onSubmit={authSubmitHandler}>
          <article className={`auth-swap-cover${animationTest ? ' trigger-cover' : ' cover-trigger'}`}></article>
          <ErrorModal error={error} onClear={clearError} />
            { isLoading && <LoadingSpinner asOverlay /> }
            {/* <h1 className='login-header'>{ isLoginMode ? 'Login' : 'Signup'}</h1> */}
            <h1 className='login-header' style={ isLoginMode ? {display: 'inline'} : {display: 'none'}}>Login</h1>
            <h1 className='signup-header' style={ !isLoginMode ? {display: 'inline'} : {display: 'none'}}>Signup</h1>
              {!isLoginMode && (
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
              {!isLoginMode && (
                <>
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
                style={{fontSize: '2em'}}
              />
              {!isLoginMode && (
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
              <Button type="submit" disabled={!formState.isValid} color='blue'>
                {isLoginMode ? 'LOGIN' : 'SIGNUP'}
              </Button>
        </form>
      </section>
    </>
  );
};

export default Auth;


//* Old Auth SCSS Styling
// @use '../base' as *;

// .auth-background-img{
//     width: 100%;
//     margin: -200px auto 0 0;
//     display: inline-block;
//     z-index: 1;
//     position: absolute;
// }

// .auth-grid{
//     box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
//     margin: 100px auto;
//     width: 60%;
//     height: 500px;
//     display: grid;
//     grid-template-columns: 1fr 1fr;
//     padding: 0;
//     position: sticky;
//     border-radius: 5px;
//     overflow: hidden;
//     z-index: 2;

//     .auth-desc{
//         grid-column: 1/3;

//         h1, h3 {
//             font-size: 1.5em;
//             height: min-content;
//         }
        
//         > article {
//             width: 50%;
//             height: 100%;
//             display: flex;
//             text-align: center;

//             > h3 {
//                 align-self:flex-end;
//             }
//         }

//         .right{
//             float: right;
//         }

//         .left{
//             float: left;
//         }
//     }

//     .auth-form-left, .auth-form-right {
//         width: 100%;
//         height: inherit;
//         transition: 500ms cubic-bezier(0.54,-0.29, 0.74, 0.05);
//         text-align: center;
//         overflow-y: scroll;
//         grid-column: 2/3;
//         position: absolute;
//         z-index: 1;
        
//         > h1{
//             text-decoration: underline;
//             padding: 25px 0;
//             font-size: 2em;
//         }
        
//         input{
//             width: 80%;
//             height: 2rem;
//             margin: 10px auto;
//             border-radius: 5px;
//             box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
//             font-size: 1.25em;
//         }
        
//         > button{
//             width: 40%;
//             font-size: 1.5rem;
//             cursor: pointer;
//             height: 2em;
//             margin: 10px auto;
//             box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
//             border-radius: 5px;
//         }
//     }
    
//     .auth-swap-cover{
//         position: absolute;
//         z-index: 2;
//         grid-column: 2/3;
//         height: 0%;
//         width: 100%;
        
//     }
    
//     .trigger-cover{
//         animation: swap-cover 600ms ease-in-out; 
        
//     }
    
//     @keyframes swap-cover {
//         0% {top: 0; background-color: $awake-red; height: 0%;}
//         33% {height: 100%; background-color: $awake-red;}
//         66% {height: 100%; background-color: $awake-gold;}
//         100% {bottom: 0; height: 0%; background-color: $awake-gold;}
//     }
    
//     .cover-trigger{
//         animation: cover-swap 600ms ease-in-out; 

//     }
    
//     @keyframes cover-swap {
//         0% {top: 0; background-color: $awake-red; height: 0%;}
//         33% {height: 100%; background-color: $awake-red;}
//         66% {height: 100%; background-color: $awake-gold;}
//         100% {bottom: 0; height: 0%; background-color: $awake-gold;}
//     }

//     .auth-form-left{
//         transform: translateX(0%);
//     }
//     .auth-form-right{
//         transform: translateX(-100%);
//         width: 100%;
//     }
// }

// @media only screen and (max-width: 600px){
//     .auth-form-left, .auth-form-right{
//         margin: 0 auto;
//     }

//     .auth-background-img{
//         display: none;
//     }
//     .auth-form{
//         grid-column: 1/3;
//     }
// }


