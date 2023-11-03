import React, { useContext, useState } from 'react';
import CModal from '../UIElements/CModal';
import Button from '../FormElements/Button';
import { AuthContext } from '../../context/auth-context';
import { Link } from 'react-router-dom';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

export default function Reply(props: { key: any; id: any; text: any; likes: any; creator: any; creatorName: any; creatorImage: any; belongsTo: any; posted: any; }) {
    const {
        key,
        id,
        text,
        likes,
        creator,
        creatorName,
        creatorImage,
        belongsTo,
        posted
    } = props

    const [ toggleButton, setToggleButton ] = useState(false);
    const handleToggle = () => {
        setToggleButton(prevToggle => !prevToggle)
    }

    const auth = useContext(AuthContext);

    return (
        <div className='reply' >
            {
                text !== undefined
                ?
                    <section>
                        <Link
                            to={
                                auth.userId === creator
                                ?
                                    '/profile'
                                :
                                    `/user/${creator}`
                            }
                        >
                            <img
                                src={`http://localhost:5000/${creatorImage}`}
                                className='reply-image'
                            />
                        </Link>
                        <div>
                            <Link to={
                                auth.userId === creator
                                ?
                                    '/profile'
                                :
                                    `/user/${creator}`
                            }>
                                <h5>{creatorName || 'Deleted user'}</h5>
                            </Link>
                            <p>{text}</p>
                        </div>

                        <CModal className='reply-modal' title={`Edit reply`} onClose={() => setToggleButton(p => !p)} show={toggleButton}>
                            <form>
                                <input
                                    id='text'
                                    type='text'
                                    value={text}
                                    placeholder='Edit reply...'
                                    autoComplete='off'
                                    required
                                    // minLength='1'
                                    // maxLength='250'
                                    // onChange={handleChangeComment}
                                    // disabled={toggleComment === true ? false : true}
                                />
                                <Button disabled size='small' type='submit' color={'blue'}>
                                    Submit edits
                                </Button>
                            </form>
                        </CModal>

                        <div style={{ margin: '0px 0px 0px 50px' }}>
                            <Tippy placement='bottom' arrow={false} delay={0} content='Like comment'>
                                <i
                                    className="far fa-thumbs-up interaction"
                                    // onClick={''}
                                >{likes || ' ' + 0}</i>
                            </Tippy>

                            {
                                auth.userId === creator &&
                                <Tippy placement='bottom' arrow={false} delay={0} content='Edit reply'>
                                    <button className="fas fa-ellipsis-h" onClick={handleToggle}></button>
                                </Tippy>
                            }
                        </div>
                        
                        <br/>

                    </section>
                :
                    <p>Deleted user</p>
            }
        </div>
    )
}
