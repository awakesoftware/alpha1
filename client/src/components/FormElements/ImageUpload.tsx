import React, { useRef, useState, useEffect } from 'react'
import Button from './Button'

interface PropType { 
    onInput?: (arg0: any, arg1: any, arg2: boolean) => void,
    id: any, 
    center: any,
    initValue: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal,
    errorText?: string
}

export default function ImageUpload(props: PropType) {
    const [ file, setFile ] = useState()
    const [ previewUrl, setPreviewUrl ] = useState()
    const [ isValid, setIsValid ] = useState(false)

    // useRef; to store value (image) which does survive rerender cycles; establishes a connection to DOM element
    const filePickerRef = useRef<any>(null)

    // trigger when file changes
    useEffect(() => {
        // whenever a new file is picked: (want to generate a preview)
        if(!file) {
            return;
        }
        const fileReader:any = new FileReader()

        // whenever fileReader loads a new file; done parsing a file
            // executes once readAsDataURL is done
        fileReader.onload = () => {
            setPreviewUrl(fileReader.result)
        }

        fileReader.readAsDataURL(file)

    }, [ file ])

    const pickedHandler = (event: { target: { files: string | any[] } } | any) => {
        // event.preventDefault()

        let pickedFile;
        let fileIsValid = isValid

        // event.target is file input

        if (event.target.files && event.target.files.length === 1) {
            pickedFile = event.target.files[0]
            setFile(pickedFile)
            setIsValid(true)
            fileIsValid = true
        } else {
            setIsValid(false)
            fileIsValid = false
        }

        props.onInput ? props.onInput( props.id, pickedFile, fileIsValid ): console.log('potato');
        

        // preview file; when get new file/update setFile state
            // doing something on state change, always use useEffect

        // forward file to component where we use ImageUpload comp

    }

    // const pickImageHandler = () => {
    //     // call click method on input tag; "links" the button to the hidden input's click method
    //     filePickerRef.current.click()
    // }

    return (
        <div className='form-control'>
            <input
                // id={props.id}
                id="test"
                name="test"
                ref={ filePickerRef }
                style={{ display: 'none' }}
                type='file'
                accept='.jpg, .png, .jpeg'
                onChange={ pickedHandler }
            />
            <label htmlFor='test' className={`image-upload ${props.center && 'center'}`}>
                <div className='image-upload__preview'>
                    { previewUrl && <img src={previewUrl} alt='Preview' /> }
                    { !previewUrl && <p>{props.initValue}</p> }
                </div>
                {/* <Button type='button' id='upload-button' color='green' onClick={ pickImageHandler } >{props.initBtn}</Button> */}
            </label>
            {/* {
                !isValid &&
                <p> {props.errorText} </p>
            } */}
        </div>
    )
}