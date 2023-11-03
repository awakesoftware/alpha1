import React, {useReducer, useEffect} from 'react';
import {validate} from '../../util/validators';


interface PropType { 
    initialValue?: any, 
    initialValid?: any, 
    validators?: any, 
    element?: any, 
    className?: any, 
    id: any, 
    type?: any, 
    placeholder?: any, 
    onKeyDown?: any, 
    onPaste?: any, 
    minLength?: any, 
    maxLength?: any, 
    autoComplete?: any, 
    required?: any, 
    style?: any, 
    rows?: any, 
    label?: any, 
    errorText?: any, 
    onInput?: any
}


const inputReducer = (state: any, action: any) => {
    switch (action.type){
        case "CHANGE":
            return {
                ...state,
                value: action.val,
                isValid: validate(action.val, action.validators)
            };
        case "TOUCH":
            return {
                ...state,
                isTouched: true
            };
        default:
            return state;
    };
};

export default function Input(props: PropType) {
    const [inputState, dispatch] = useReducer(inputReducer, {value: props.initialValue || '', isTouched: false, isValid: props.initialValid || false});

    const {id, onInput} = props;
    const {value, isValid} = inputState;

    useEffect(() => {
        onInput(id, value, isValid)
    }, [id, value, isValid, onInput])

    const changeHandler = (event: { target: { value: any; }; }) => {
        dispatch({type: "CHANGE", val: event.target.value, validators: props.validators})
    };

    const touchHandler = () => {
        dispatch({
            type: "TOUCH"
        });
    };

    const element =
        props.element === 'input' ? (
            <input
                className={props.className}
                id={props.id}
                type={props.type}
                placeholder={props.placeholder}
                onChange={changeHandler}
                onKeyDown={props.onKeyDown}
                onPaste={props.onPaste}
                onBlur={touchHandler}
                value={inputState.value}
                minLength={props.minLength}
                maxLength={props.maxLength}
                autoComplete={props.autoComplete}
                required={props.required}
                style={props.style}
            />
      ) : (
        <textarea
          className={props.className}
          id={props.id}
          rows={props.rows || 3}
          placeholder={props.placeholder}
          onChange={changeHandler}
          onBlur={touchHandler}
          value={inputState.value}
          style={props.style}
        />
      );

    return (
        <div className={`form-control ${!inputState.isValid && inputState.isTouched && 'form-control--invalid'}`}>
            <label htmlFor={props.id}>{props.label}</label>
            {element}
            {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
        </div>
    );
};