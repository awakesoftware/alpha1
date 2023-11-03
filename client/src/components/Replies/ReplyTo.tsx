import React, { useContext, useState } from 'react'
import Button from '../FormElements/Button';
import { AuthContext } from '../../context/auth-context'
import { toast } from 'react-toastify';
import axios from 'axios';
import { useHistory } from 'react-router-dom';


export default function ReplyTo(props: { cancel?: any; id?: any; }) {
    const { id } = props;
    const auth = useContext(AuthContext);
    const history = useHistory();

    const [ replies, setReplies ] = useState([]);

    // reply state
    const [ text, setText ] = useState('');
    const handleChangeReply = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setText(event.target.value);
    }

    const submitReply = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();

        if( !auth.token || !auth.userId || !auth.username ) {
            return toast.error('Please log in.', { position: toast.POSITION.TOP_CENTER });
        }

        const variables = {
            text: text,
            creator: auth.userId
        }

        try {
            const headers = {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + auth.token
            }

            await axios.post(`http://localhost:5000/api/replies/${id}`, variables, {
                headers: headers
            }).then(res => {
                setReplies(prevReplies => ({
                    ...prevReplies,
                    replies: [...prevReplies, res.data.newReply]
                }))
                toast.success('Reply added.', { position: toast.POSITION.BOTTOM_LEFT });
                history.push(`/`);

            }).catch(() => {

            })

        } catch (error) {
            toast.error('Internal error, please try again.', { position: toast.POSITION.TOP_CENTER });
        }
    }

    return (
        <form onSubmit={submitReply}>
            <input
                style={{
                    marginLeft: '50px',
                    width: '25%'
                }}
                id='text'
                type='text'
                placeholder={`Replying as ${auth.firstName} ${auth.lastName}`}
                onChange={handleChangeReply}
                autoComplete='off'
            />

            <br/>

            <Button size='small' type='button' onClick={props.cancel} color={'red'}>
                Cancel
            </Button>

            <Button disabled size='small' type='submit' color={'blue'}>
                Reply
            </Button>

        </form>
    )
}
