import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import ErrorModal from '../../../components/UIElements/ErrorModal';
import LoadingSpinner from '../../../components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../../hooks/http-hook';
import { AuthContext } from '../../../context/auth-context';
import { VALIDATOR_MIN, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../../util/validators';
import Dropzone from 'react-dropzone';
import axios from 'axios';

import AwakeVideo from '../../../abis/AwakeVideo.json';
import Web3 from 'web3';

import { toast } from 'react-toastify';


export default function Upload(props) {
    // Context
    const auth = useContext(AuthContext);

    // State
    const [ title, setTitle ] = useState("");
    const [ description, setDescription ] = useState("");
    const [ category, setCategory ] = useState("");
    const [ privacy, setPrivacy ] = useState("");
    const [ filePath, setFilePath ] = useState("");
    const [ thumbnailPath, setThumbnailPath ] = useState("");

    // Ethereum state
    const [ buffer, setBuffer ] = useState(null);
    const [ account, setAccount ] = useState('');
    const [ awakeVideo, setAwakeVideo ] = useState(null);
    const [ videos, setVideos ] = useState([]);
    const [ videoCount, setVideoCount ] = useState(0);

    // HTTP Hook
    const { isLoading, error, clearError } = useHttpClient();

    // Router History
    const history = useHistory();

    // On Upload.js render
    useEffect(() => {
        const loadData = async () => {
            await loadWeb3();
            await loadBlockchainData();
        }
        loadData();
    }, []);

    // Load web3; connect browser to MetaMask
    const loadWeb3 = async () => {
        if(window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
            toast.info('Connected to MetaMask.', { position: toast.POSITION.BOTTOM_LEFT });
        } else if(window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
            toast.info('Connected to MetaMask.', { position: toast.POSITION.BOTTOM_LEFT });
        } else {
            toast.error('Please install & setup MetaMask: https://metamask.io/', { position: toast.POSITION.TOP_CENTER });
        }
    }

    // Connect AwakeVideo contract to application
    const loadBlockchainData = async () => {
        let web3;
        let accounts;
        let networkId;
        let networkData;

        try {
            web3 = window.web3;

            // Load account
            accounts = await web3.eth.getAccounts();
            setAccount(accounts[0]);

            // Network ID
            networkId = await web3.eth.net.getId();
            networkData = AwakeVideo.networks[networkId];
        } catch (error) {
            console.log('Please install & setup MetaMask.');
        }
        

        if(networkData) {
            const awakeVideo = new web3.eth.Contract(AwakeVideo.abi, networkData.address);
            setAwakeVideo(awakeVideo);

            const videoCount = await awakeVideo.methods.videoCount().call();
            setVideoCount(videoCount);

            for(let i = videoCount; i >= 1; i--) {
                const video = await awakeVideo.methods.videos(i).call();
                setVideos(prevVideos => ({
                    ...prevVideos, video
                }))
            }

            // Set default video
            const latest = await awakeVideo.methods.videos(videoCount).call();
            setTitle(latest.title);
        } else {
            // toast.warn('AwakeVideo smart contract was not deployed to the detected network.', { position: toast.POSITION.TOP_CENTER });
        }
    }

    // Title state
    const handleChangeTitle = (event) => {
        setTitle(event.target.value);
    }

    // Description state
    const handleChangeDescription = (event) => {
        setDescription(event.target.value);
    }

    // Category state
    const handleChangeCategory = (event) => {
        setCategory(event.target.value);
    }

    // Privacy state
    const handleChangePrivacy = (event) => {
        setPrivacy(event.target.value);
    }


    // Submit form
    const onSubmit = async (event) => {
        event.preventDefault();

        if( !auth.token || !auth.userId || !auth.username ) {
            return toast.error('Please log in first.', { position: toast.POSITION.TOP_CENTER });
        }

        const variables = {
            username: auth.username,
            title: title,
            description: description,
            category: category,
            private: privacy,
            thumbnailPath: thumbnailPath,
            filePath: filePath,
            account: account,
            videos: videos,
            videoCount: videoCount
        }

            if( filePath === '' || filePath === null || filePath === undefined || thumbnailPath === '' || thumbnailPath === null || thumbnailPath === undefined ) {
                return;
            } else {
                await awakeVideo.methods.uploadVideo(title).send({ from: account });
            }

            try {
                const headers = {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token
                }

                axios.post('http://localhost:5000/api/videos', variables, {
                    headers: headers
                })
                    .then(res => {
                        toast.success('Video uploaded successfully.', { position: toast.POSITION.BOTTOM_LEFT });
                        history.push(`/video/${res.data.video.id}`);
                    }).catch(error => {
                        // <ErrorModal error={error} />
                        console.log(`1.1: ${error}`);
                    })
                    
            } catch (error) {
                console.log(`1.2: ${error}`);
            }

    } 

    // Select & upload video file
    const onDrop = (files) => {
        let formData = new FormData();
        const headers = {
            'content-type': 'multipart/form-data',
            Authorization: 'Bearer ' + auth.token
        }

        formData.append('file', files[0]);

        axios.post('http://localhost:5000/api/videos/videoFile', formData, {
            headers: headers
        }).then(res => {
            if(res.data.success) {
                setFilePath(res.data.filePath);
            } else {
                console.log('Failed to save the video.');
            }
        })
            
    }

    const onThumbnailDrop = (files) => {
        let formData = new FormData();
        const headers = {
            'content-type': 'multipart/form-data',
            Authorization: 'Bearer ' + auth.token
        }

        formData.append('file', files[0]);

        axios.post('http://localhost:5000/api/videos/thumbnailFile', formData, {
            headers: headers
        }).then(res => {
            if(res.data.success) {
                setThumbnailPath(res.data.thumbnailPath);
            } else {
                console.log('Failed to save the thumbnail.');
            }
        })
            
    }


    return (
        <div className='upload'>
            <ErrorModal error={error} onClear={clearError} />

            <div className='upload-form'>

                <form className='' onSubmit={onSubmit}>
                    <h2 className='title'>Upload Video</h2>
                    <h5>Ethereum Address: {account}</h5>

                    {
                        isLoading && <LoadingSpinner asOverlay />
                    }

                    <div className='upload-inputs'>
                        <div>
                            <label>
                                <h4>Title</h4>
                            </label>
                            <div>
                                <input
                                    id='title'
                                    className='upload-inputarea'
                                    type='text'
                                    placeholder='Video title...'
                                    autoComplete='off'
                                    required
                                    minLength='5'
                                    maxLength='75'
                                    onChange={handleChangeTitle}
                                />
                            </div>
                        </div>

                        <div>
                            <label>
                                <h4>Description</h4>
                            </label>
                            <div>
                                <textarea
                                    id='description'
                                    className='upload-textarea'
                                    placeholder='Video description...'
                                    autoComplete='off'
                                    required
                                    minLength='5'
                                    maxLength='250'
                                    onChange={handleChangeDescription}
                                />
                            </div>
                        </div>

                        <br/>
                        <hr style={{ width:'50%', margin: 'auto' }}/>
                        <br/>

                        <div>
                            <label>
                                <h4>Category</h4>
                            </label>
                            <select onChange={handleChangeCategory}>
                                <option value='none' selected disabled hidden>Choose category...</option>
                                <option value='action'>Action</option>
                                <option value='animation'>Animation</option>
                                <option value='bts'>Behind the Scenes</option>
                                <option value='fantasy'>Fantasy</option>
                                <option value='historical'>Historical</option>
                                <option value='thriller'>Thriller</option>
                            </select>
                        </div>
                        <br/>
                        <hr style={{ width:'50%', margin: 'auto' }}/>
                        <br/>

                        <div>
                            <label>
                                <h4>Privacy</h4>
                            </label>
                            <select onChange={handleChangePrivacy}>
                                <option value='none' selected disabled hidden>Choose privacy...</option>
                                <option value='false'>Public</option>
                                <option value='true'>Private</option>
                            </select>
                        </div>

                        <br/>
                        <hr style={{ width:'50%', margin: 'auto' }}/>

                        <div className='selectors'>
                            <div>
                                <label>
                                    <h4>Thumbnail</h4>
                                </label>
                                <div>
                                    <Dropzone
                                        onDrop={onThumbnailDrop}
                                        multiple={false}
                                        maxSize={800000000}>
                                        {({ getRootProps, getInputProps }) => (
                                            <span
                                                {...getRootProps()}
                                            >
                                                <button style={{width:'50px', cursor: 'pointer'}} >
                                                    <i className='fas fa-image'></i><br/>
                                                    <input {...getInputProps()} />
                                                </button>
                                            </span>
                                        )}
                                    </Dropzone>
                                </div>
                            </div>

                            <br/>
                            <br/>
                            <hr style={{ width:'50%', margin: 'auto' }}/>
                            <br/>

                            <div>
                                <label>
                                    <h4>Video</h4>
                                </label>
                                <div>
                                    <Dropzone
                                        onDrop={onDrop}
                                        multiple={false}
                                        maxSize={800000000}>
                                        {({ getRootProps, getInputProps }) => (
                                            <span
                                                {...getRootProps()}
                                            >
                                                <button style={{width:'50px' , cursor: 'pointer'}} >
                                                    <i className='fas fa-video'></i><br/>
                                                    <input {...getInputProps()} />
                                                </button>
                                            </span>
                                        )}
                                    </Dropzone>
                                </div>
                            </div>

                        </div>

                    </div>

                    <br/>
                    <br/>
                    <hr style={{ width:'75%' }}/>
                    <br/>

                    <button className='blue-btn'>
                        Upload
                    </button>

                </form>
            </div>
            <div className='upload-display'>
                
            </div>
        </div>
    )
}
