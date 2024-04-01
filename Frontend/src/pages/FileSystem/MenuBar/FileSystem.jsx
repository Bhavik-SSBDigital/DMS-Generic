import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Stack, TextField, Modal, CircularProgress, Breadcrumbs, Typography } from '@mui/material';
// import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import './MenuBar.css';
import { useDispatch, useSelector } from 'react-redux';
import { setPath } from '../../../Slices/PathSlice';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import axios from 'axios';
import DropFileInput from '../../../components/drop-file-input/DropFileInput';
import { useQuery, useQueryClient } from 'react-query'
import imageSrc from '../../../assets/images/folder.png';
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import FilesStructure from './FileStructure';
import Path from '../../../components/path/PathBar';
import { IconFolder, IconFolderPlus } from '@tabler/icons-react';
import DefaultLayout from '../../../layout/DefaultLayout';
import ComponentLoader from '../../../common/Loader/ComponentLoader';


const FileSystem = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const isAdmin = localStorage.getItem('username') === 'admin' ? true : false;
    const url = backendUrl + "/getProjects";
    const pathValue = useSelector(state => state.path.value);
    const [fileFolders, setFileFolders] = useState([])
    const [showButtons, setShowButtons] = useState(false)
    const [error, setError] = useState('');

    const fetchProjects = async () => {
        const accessToken = localStorage.getItem('accessToken')
        const { data } = await axios.post(url, null, {
            headers: {
                Authorization: `Bearer ${accessToken}`
                // 'Content-Type': 'multipart/form-data'
            }
        }
        )
        return data

    }
    const { data: filesData, isLoading, isFetching } = useQuery("Projects", fetchProjects, {
        onSuccess: (data) => {
            setFileFolders([...data.children])
        },
        onError: () => {
            setError('something went wrong')
        },
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
    });
    const queryClient = useQueryClient();
    useEffect(() => {
        const cachedData = queryClient.getQueryData("Projects");
        if (cachedData) {
            setFileFolders(cachedData.children)
        }
    }, [])
    const [modalContentFor, setModalContentFor] = useState(null);
    const [open, setOpen] = useState(false);
    const [folderName, setFolderName] = useState('');
    const dispatch = useDispatch()
    const handleFolderClick = (name) => {
        dispatch(setPath(name));
        localStorage.setItem('path', `../${name}`);
    }
    const openModal = (action) => {
        setModalContentFor(action);
        setOpen(true);
    };
    const closeModal = () => {
        setOpen(false);
    };
    const onFileChange = (files) => {
        console.log(files);
    };
    const handlePlus = () => {
        setShowButtons(!showButtons)
    }
    const createFolder = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            // const path = `../DMS/${folderName}`;
            const response = await axios.post(
                backendUrl + '/createFolder',
                pathValue === ".."
                    ?
                    {
                        path: `${pathValue}/${folderName}`,
                        isProject: true
                    }
                    :
                    {
                        path: `${pathValue}/${folderName}`
                    }
                ,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            );
            if (response.status === 200) {
                const currentDate = new Date();
                const currentDateTimeString = currentDate.toString();
                setFileFolders(prev => [...prev, {
                    createdBy
                        :
                        accessToken,
                    createdOn
                        :
                        currentDateTimeString,
                    name
                        :
                        folderName,
                    type
                        :
                        "folder",
                }])
            }
            setOpen(false);
            setFolderName('');
        } catch (error) {
            alert('unable to create project');
        }
    };
    const ModelContent = modalContentFor === 'createFolder' ? (
        <>
            <Box sx={{ height: '40px', width: '100%', display: 'flex', gap: "3px", alignItems: "center", justifyContent: 'center', borderRadius: '5px', background: 'lightblue' }}>
                <IconFolderPlus />
                <h4>CREATE FOLDER</h4>
            </Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column', alignItems: 'center', padding: '20px'
            }}>
                {/* <form className='create-folder-modal-content'> */}
                {/* <p style={{ fontSize: '18px', marginBottom: '10px' }}>Enter the name of a folder</p> */}
                <div>
                    <Typography>Folder Name :</Typography>
                    <TextField
                        id='folderName'
                        // label='Enter Folder Name'
                        variant='outlined'
                        name='folderName'
                        value={folderName}
                        onChange={(e) => {
                            const inputValue = e.target.value;
                            const isValidInput = /^[a-zA-Z0-9_\-()\[\]\s]*$/.test(inputValue);
                            if (isValidInput || inputValue === '') {
                                setFolderName(e.target.value)
                            }
                        }}
                        helperText="Field must contain only letters, numbers, and spaces."
                        sx={{ width: '100%', marginBottom: '10px' }}
                    />
                </div>
                <div className='createFolderButtonsContainer'>
                    <Button
                        variant='contained'
                        size='small'
                        color='success'
                        onClick={createFolder}
                        sx={{
                            '&:hover': {
                                backgroundColor: '#0056b3',
                            }
                        }}
                    >
                        Create
                    </Button>
                    <Button
                        variant='contained'
                        size='small'
                        onClick={() => setOpen(false)}
                        color='error'
                        sx={{
                            color: 'white',
                            '&:hover': {
                                backgroundColor: '#0056b3',
                            }
                        }}
                    >
                        Cancel
                    </Button>
                </div>
                {/* </form> */}
            </Box></>
    ) : (
        <DropFileInput setOpen={setOpen} onFileChange={onFileChange} />
    );
    return (
        <DefaultLayout>
            {isLoading ? <ComponentLoader /> : <>
                <Path />
                <div style={{ display: 'flex', flexDirection: "row" }}>
                    {/* <Stack className='sidebarSize' margin={1} flex="25%" height='100%' gap={12} sx={{ height: '77vh', borderRadius: '3px', backgroundColor: 'white' }}>
                    <FilesStructure fileFolders={fileFolders} isLoading={isLoading} isFetching={isFetching} />
                </Stack> */}
                    {/* removerd from under stack */}
                    {/* margin={1} height='100%' gap={12} sx={{ padding: '20px', height: '87vh', backgroundColor: '#f5f5f5', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }} */}
                    <Stack mt={2} height='100%' flex="75%" gap={12} sx={{ borderRadius: '3px', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: "translate(-50%, -50%)" }}>
                            {isLoading || isFetching ? (
                                <CircularProgress color="inherit" size={30} />
                            ) : (
                                error ? error : (fileFolders.length === 0 ? "There is no files or folders in the current directory" : null)
                            )}
                        </div>
                        <Box>
                            {!error && <Stack spacing={{ xs: 2, sm: 4 }} direction='row' useFlexGap flexWrap='wrap' overflow="auto" maxHeight="65vh">
                                <Stack flexWrap='wrap' alignContent='center' width='100%' flexDirection="row" gap={1}>
                                    {fileFolders.map((item, index) => (
                                        <Link to={item.name} key={index} style={{ width: '130px', height: "130px" }}> {/* Adjust width based on the number of items you want to display horizontally */}
                                            <Button
                                                onClick={() => handleFolderClick(item.name)}
                                                sx={{
                                                    flexDirection: 'column',
                                                    backgroundColor: "white",
                                                    borderRadius: "15px",
                                                    width: '100%',
                                                    height: '100%',
                                                    textTransform: 'none',
                                                }}
                                                variant='text'
                                                color='primary'
                                                size='medium'
                                            >
                                                <Box
                                                    sx={{
                                                        height: '60px',
                                                        width: '60px',
                                                    }}
                                                >
                                                    <img style={{ height: '100%', width: '100%' }} src={imageSrc} alt="im" />
                                                </Box>
                                                <p style={{ color: 'black', textAlign: 'center', margin: 0 }}>{item.name}</p>
                                            </Button>
                                        </Link>
                                    ))}
                                </Stack>
                            </Stack>}
                            {open && (
                                <Modal open={open} onClose={closeModal} className='create-folder-modal'>
                                    <div style={{ gap: '10px' }} className='create-folder-modal-content-container'>{ModelContent}</div>
                                </Modal>
                            )}
                        </Box>
                    </Stack>
                </div>
                {isAdmin &&
                    <Stack position='relative'>
                        <Fab color="primary" onClick={handlePlus} aria-label="add" sx={{ position: 'fixed', bottom: '5%', right: '5%' }}>
                            <AddIcon />
                            {showButtons && <Box gap='10px' flexDirection='column' display='flex' sx={{ width: '150px', borderRadius: '15px', position: 'absolute', top: '-130%', right: '0%' }}>
                                <Button
                                    variant='contained'
                                    sx={{
                                        flexDirection: 'row', marginBottom: '5px', padding: '10px', height: '35px', alignItems: "center"
                                    }}
                                    color='info'
                                    size='small'
                                    onClick={() => openModal('createFolder')}
                                >
                                    <CreateNewFolderIcon fontSize='small' sx={{ height: '20px', width: '20px', color: 'white', marginRight: '5px' }} />
                                    {/* <img src={imageSrc} alt="image" /> */}
                                    <p style={{ fontSize: '10px', textAlign: 'center', color: 'white' }}>NEW PROJECT</p>
                                </Button>
                            </Box>}
                        </Fab>
                    </Stack>}</>}
        </DefaultLayout>
    );
};

export default FileSystem;
