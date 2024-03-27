import { Box, Button, Stack, TextField, Modal, CircularProgress, Paper, IconButton, Menu, MenuItem, Select, FormControl, InputLabel, FormControlLabel, RadioGroup, Radio, Typography, Tooltip } from '@mui/material';

import React, { useEffect, useState } from 'react'
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DropFileInput from '../../components/drop-file-input/DropFileInput';
import { ImageConfig } from '../../config/ImageConfig';
import axios from 'axios';

import { useSelector, useDispatch } from 'react-redux';
import { backButtonPath, copy, cut, onReload, setPath } from '../../Slices/PathSlice';

import imageSrc from '../../assets/images/folder.png';

import { download } from '../../components/drop-file-input/FileUploadDownload';
import styles from './ShowFolder.module.css'
import moment from 'moment';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import Path from '../../components/path/PathBar';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import HandymanIcon from '@mui/icons-material/Handyman';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import View from '../view/View';
import { IconDownload, IconEye, IconClipboard, IconScissors, IconTrash, IconTool } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom';
import { IconFolderPlus } from '@tabler/icons-react';
import { toast } from 'react-toastify';
import { IconUpload } from '@tabler/icons-react';
import DefaultLayout from '../../layout/DefaultLayout';

export default function ShowFolder(props) {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const url = backendUrl + "/accessFolder";
    const dispatch = useDispatch();
    const pathValue = useSelector((state) => state.path.value)
    const [loading, setLoading] = useState(true);
    const [showDetails, setShowDetails] = useState('')
    const [showButtons, setShowButtons] = useState(false);
    const [error, setError] = useState('');
    const [isUploadable, setIsUploadable] = useState(false);
    const getData = async () => {
        const accessToken = localStorage.getItem('accessToken')
        try {
            const { data } = await axios.post(url, {
                path: `${pathValue}`
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                    // 'Content-Type': 'multipart/form-data'
                }
            }
            )
            // console.log(data);
            if (data) {
                setLoading(false);
                setError('');
            }
            setFileFolders([...data.children]);
            setIsUploadable(data.isUploadable);
        } catch (error) {
            setLoading(false);
            setError(error?.response?.data?.message);
        }
    }
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        const checkPath = localStorage.getItem('path');
        if (checkPath && checkPath !== pathValue) {
            dispatch(onReload(checkPath));
        }
        setLoaded(true);
    }, [])
    useEffect(() => {
        if (loaded && pathValue !== '..') {
            getData();
        }
    }, [loaded, pathValue]);
    const [fileFolders, setFileFolders] = useState([])
    const [open, setOpen] = useState(false);
    const [modalContentFor, setModalContentFor] = useState(null);
    const [folderName, setFolderName] = useState('');
    const onFileChange = (files) => {
        console.log(files);
    };
    const createFolder = async () => {
        setOpen(false);
        setLoading(true);
        const accessToken = localStorage.getItem('accessToken');

        const response = await axios.post(
            backendUrl + '/createFolder',
            {
                path: `${pathValue}/${folderName}`
            },
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
        setLoading(false);
        setFolderName('');
    };
    const openModal = (action) => {
        setModalContentFor(action);
        setOpen(true);
    };
    const handleFolderClick = (name) => {
        setLoading(true);
        setShowProterties(false);
        dispatch(setPath(name))
        const localPath = localStorage.getItem('path')
        localStorage.setItem('path', `${localPath}/${name}`);
    }
    const closeModal = () => {
        setOpen(false);
    };
    const navigate = useNavigate();
    const handleBackPress = () => {
        setLoading(true);
        var pathParts = pathValue.split('/');
        pathParts.pop();
        var newPath = pathParts.join('/');
        localStorage.setItem('path', newPath);
        dispatch(backButtonPath(newPath));
        if (newPath === '..') {
            navigate('/files');
        }
    }
    const handleDownload = (path, name) => {
        try {
            download(name, path);
        } catch (error) {
            console.error('Error downloading file:', error);
            // alert('An error occurred while downloading the file.');
        }
        handleClose();
    };
    // view files
    const [fileView, setFileView] = useState();
    // const [visibleFile, setVisibleFile] = useState(false);
    const handleViewClose = () => {
        setFileView(null);
    };
    const handleView = async (path, name) => {
        setLoading(true);
        try {
            const fileData = await download(name, path, true);
            if (fileData) {
                setFileView({ url: fileData.data, type: fileData.fileType });
                setLoading(false);
            } else {
                console.error('Invalid fileData:', fileData);
                toast.error('Invalid file data.');
                setLoading(false);
            }
        } catch (error) {
            console.error('Error viewing file:', error);
            toast.error('Unable to view the file.');
            setLoading(false);
        }
    }
    // end view
    const handleDownloadFolder = async (path, name) => {
        const urlDownload = `${backendUrl}/downloadFolder`;
        const accessToken = localStorage.getItem('accessToken');

        try {
            const response = await axios.post(
                urlDownload,
                {
                    folderPath: path,
                    folderName: name,
                },
                {
                    responseType: 'arraybuffer',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            const contentType = response.headers['content-type'];

            if (contentType === 'application/zip') {
                const blob = new Blob([response.data], { type: contentType });
                const blobUrl = URL.createObjectURL(blob);

                const anchor = document.createElement('a');
                anchor.href = blobUrl;
                anchor.download = `${name}.zip`;

                document.body.appendChild(anchor);
                anchor.click();
                URL.revokeObjectURL(blobUrl);
                document.body.removeChild(anchor);
            } else {
                console.error('Unsupported content type:', contentType);
                toast.error('Unsupported content type');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('An error occurred while downloading the folder.');
        }
        handleClose();
    };

    const handleMouseOver = (name) => {
        setShowDetails(name);
    }
    const handleMouseOut = () => {
        setShowDetails('')
    }
    const handlePlus = () => {
        setShowButtons(!showButtons)
    }
    const closePlus = () => {
        setShowButtons(false);
    }
    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorEl1, setAnchorEl1] = useState(null);
    const [itemName, setItemName] = useState('');
    const [properties, setProperties] = useState();
    // console.log(JSON.stringify(properties) + " properties");
    const [showProperties, setShowProterties] = useState(false);
    const handleClick = (event, name, item) => {
        setShowProterties(false);
        setItemName(name);
        setAnchorEl(event.currentTarget);
        setProperties(item);
    };
    const handleClick1 = (event, name, item) => {
        setShowProterties(false);
        setItemName(name);
        setAnchorEl1(event.currentTarget);
        setProperties(item);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setAnchorEl1(null);
    };

    // copy paste functionality
    const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
    const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });

    const handleContextMenu = (event, item) => {
        event.preventDefault();
        const scrollX = window.scrollX || window.pageXOffset;
        const scrollY = window.scrollY || window.pageYOffset;
        setContextMenuPos({ x: event.clientX, y: event.clientY });
        setIsContextMenuOpen(true);
    };

    const fileName = useSelector((state) => state.path.fileName);
    const sourcePath = useSelector((state) => state.path.sourcePath);
    const method = useSelector((state) => state.path.method);
    const handleCopy = (name) => {
        toast.success('File copied')
        dispatch(copy({ name, pathValue, method: 'copy' }));
        handleClose();
    }
    const handleCut = (name) => {
        toast.success('File cut successfully')
        dispatch(cut({ name, pathValue, method: 'cut' }));
        handleClose();
    }

    const [isModalOpen, setModalOpen] = useState(false);
    const deleteModalOpen = () => {
        handleClose();
        setModalOpen(true);
    }
    const deleteModalClose = () => {
        setModalOpen(false);
    }
    const handleDelete = async (name) => {
        setLoading(true);
        const accessToken = localStorage.getItem('accessToken');
        try {
            const res = await axios.post(`${backendUrl}/deleteFile`, {
                path: `${pathValue}/${name}`
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            });

            if (res.status === 200) {
                const update = fileFolders.filter(item => item.name !== name);
                setFileFolders(update);
                setLoading(false);
                toast.success('File deleted');
            } else {
                // Handle unexpected response status codes
                setLoading(false);
                toast.error('Unable to delete file');
            }
        } catch (error) {
            // Handle network errors
            setLoading(false);
            toast.error('Unable to delete file');
        } finally {
            deleteModalClose();
        }
    }
    const handlePaste = async () => {
        setIsContextMenuOpen(false);
        setLoading(true);
        try {
            const accessToken = localStorage.getItem('accessToken');
            const copyCutUrl = `${backendUrl}/${method === 'copy' ? 'copyFile' : 'cutFile'}`;
            const res = await axios.post(
                copyCutUrl,
                {
                    sourcePath: sourcePath,
                    name: fileName,
                    destinationPath: pathValue,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (res.status === 200) {
                await getData();
                setLoading(false);
                toast.success('File pasted')
                dispatch(method === 'copy' ? copy({ name: '', pathValue: '', method: '' }) : cut({ name: '', pathValue: '', method: '' }));
            } else {
                setLoading(false);
                toast.error('Operation failed. Please check the source and destination paths.');
            }
        } catch (error) {
            setLoading(false);
            console.error('Error:', error);
            toast.error('unable to paste file.');
        }
    };

    // Context Menu component
    const ContextMenu = ({ xPos, yPos }) => {
        return (
            <div
                className='context-menu'
                style={{
                    position: 'fixed',
                    top: yPos,
                    left: xPos,
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    zIndex: 1000,
                }}
            >
                <Paper elevation={1} sx={{ padding: "10px" }}>
                    <Button sx={{ display: 'flex', gap: "5px" }} onClick={handlePaste}>
                        <ContentPasteIcon />
                        paste
                    </Button>
                </Paper>
            </div>
        );
    };
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isContextMenuOpen && !event.target.closest('.context-menu')) {
                setIsContextMenuOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isContextMenuOpen]);
    // end of copy paste
    function formatSize(sizeInBytes) {
        if (sizeInBytes < 1024) {
            return sizeInBytes + ' bytes';
        } else if (sizeInBytes < 1024 * 1024) {
            return (sizeInBytes / 1024).toFixed(1) + ' KB';
        } else {
            return (sizeInBytes / (1024 * 1024)).toFixed(1) + ' MB';
        }
    }
    const truncateFileName = (fname, maxLength = 15) => {
        if (fname.length <= maxLength) {
            return fname;
        } else {
            const [baseName, extension] = fname.split('.').reduce(
                (result, part, index, array) => {
                    if (index === array.length - 1) {
                        result[1] = part;
                    } else {
                        result[0] += part;
                    }
                    return result;
                },
                ['', '']
            );
            const truncatedName = `${baseName.slice(0, 8)}...${baseName.slice(-3)}`;
            return `${truncatedName}.${extension}`;
        }
    };
    const ModelContent = modalContentFor === 'createFolder' ? (

        <>
            <Box sx={{ height: '40px', width: '100%', display: 'flex', gap: "3px", alignItems: "center", justifyContent: 'center', borderRadius: '5px', background: 'burlywood' }}>
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
        <DropFileInput getData={getData} setOpen={setOpen} setFileFolders={setFileFolders} onFileChange={onFileChange} />
    );
    const deleteModalContent = (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            <p style={{ fontSize: '18px', marginBottom: '10px' }}>
                ARE YOU SURE YOU WANT TO DELETE FILE?
            </p>
            <Stack flexDirection="row" gap={3}>
                <Button
                    variant='contained'
                    size='small'
                    color='error'
                    onClick={() => handleDelete(itemName)}
                    sx={{
                        // backgroundColor: 'red',
                        // color: 'white',
                        '&:hover': {
                            backgroundColor: '#ff0000',
                        }
                    }}
                >
                    Yes
                </Button>
                <Button
                    variant='outlined'
                    size='small'
                    onClick={deleteModalClose}
                    sx={{
                        backgroundColor: '#007bff',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#0056b3',
                        }
                    }}
                >
                    No
                </Button>
            </Stack>
        </Box>
    );
    // search and sort
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('');
    const handleSearchQueryChange = (e) => {
        setSearchQuery(e.target.value);
    };
    const handleSortByChange = (e) => {
        setSortBy(e.target.value);
    };
    const [sortOrder, setSortOrder] = useState("asc");
    const handleSortOrderChange = (event) => {
        setSortOrder(event.target.value);
    };
    // Mock data for the sort options
    const sortOptions = [
        { value: 'name', label: 'Name' },
        { value: 'date', label: 'Date' },
        { value: 'size', label: 'Size' },
    ];
    const filteredFileFolders = fileFolders
        .filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => {
            if (sortBy === "name") {
                const compareResult = b.name.localeCompare(a.name);
                return sortOrder === "asc" ? compareResult : -compareResult;
            } else if (sortBy === "date") {
                const dateA = new Date(a.createdOn);
                const dateB = new Date(b.createdOn);
                const dateCompareResult = dateB - dateA;
                return sortOrder === "asc" ? dateCompareResult : -dateCompareResult;
            } else if (sortBy === "size") {
                const sizeCompareResult = b.size - a.size;
                return sortOrder === "asc" ? sizeCompareResult : -sizeCompareResult;
            }
            return 0;
        });
    return (
        <DefaultLayout>
            <Stack flexDirection='row'>
                <div style={{ width: "100%" }}>
                    <Stack flexDirection='row' gap='10px' justifyContent='space-between' sx={{ marginBottom: '5px' }}>
                        <Box sx={{ display: { xs: 'none', sm: 'block', md: 'block', } }}>
                            <Button onClick={handleBackPress} sx={{ background: 'orange', height: '30px' }} variant="contained" color='warning'>
                                <ArrowBackIosIcon sx={{ height: '15px' }}></ArrowBackIosIcon>
                                Back
                            </Button>
                        </Box>
                        <Box gap={2} display='flex'>
                            <TextField
                                label="Search"
                                sx={{ maxWidth: { lg: "250px", xs: "150px" }, background: "white" }}
                                disabled={fileFolders.length === 0 || loading}
                                variant="outlined"
                                size='small'
                                value={searchQuery}
                                onChange={handleSearchQueryChange}
                            />

                            <FormControl size='small' variant="outlined">
                                <InputLabel>Sort By</InputLabel>
                                <Select
                                    size='small'
                                    value={sortBy}
                                    sx={{ background: "white" }}
                                    disabled={fileFolders.length === 0 || loading}
                                    onChange={handleSortByChange}
                                    label="Sort By"
                                    style={{ minWidth: '150px' }}
                                >
                                    {sortOptions.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                    <RadioGroup
                                        aria-label="sort-order"
                                        name="sortOrder"
                                        defaultValue={sortOrder}
                                        onChange={handleSortOrderChange}
                                        style={{ display: "flex", flexDirection: "column", padding: '10px' }}
                                    >
                                        <FormControlLabel
                                            value="asc"
                                            control={<Radio />}
                                            label="Ascending"
                                        />
                                        <FormControlLabel
                                            value="desc"
                                            control={<Radio />}
                                            label="Descending"
                                        />
                                    </RadioGroup>
                                </Select>
                            </FormControl>
                        </Box>
                    </Stack>
                    <Path />
                    <Stack flexDirection="row">
                        <Stack flex={showProperties ? "75%" : "100%"} gap={7} sx={{ position: 'relative' }} onContextMenu={(e) => handleContextMenu(e, 'viraj')}>
                            <Box>
                                <Stack pt="15px" direction="row" gap="10px" flexWrap="wrap" sx={{ justifyContent: { xs: 'flex-start', sm: 'flex-start', md: 'flex-start' } }} overflow="auto" maxHeight="60vh">
                                    {!loading && filteredFileFolders.map((item, index) => (
                                        <div key={index}>
                                            {item.type === 'folder' ? (
                                                <Stack flexWrap='wrap' width='100%' position='relative' sx={{ height: '150px', width: '130px' }}>
                                                    <Tooltip title={item.name} enterDelay={1000}>
                                                        <Link to={item.name}>
                                                            <Button
                                                                onMouseOver={() => handleMouseOver(item.name)}
                                                                onMouseOut={handleMouseOut}
                                                                onClick={() => handleFolderClick(item.name)}
                                                                sx={{
                                                                    flexDirection: 'column',
                                                                    width: '100%',
                                                                    height: '100%',
                                                                    textTransform: 'none',
                                                                    backgroundColor: properties?._id === item?._id && showProperties ? "lightblue" : "white !important",
                                                                    borderRadius: '15px',
                                                                    padding: '5px',
                                                                    textDecoration: 'none',
                                                                    color: 'inherit',
                                                                }}
                                                                variant='text'
                                                                color='primary'
                                                                size='medium'
                                                            >
                                                                <div>
                                                                    <img className={styles.responsive} src={imageSrc} alt="Folder" />
                                                                </div>
                                                                <div>
                                                                    <p className={styles.textResponsive}>{item.name}</p>
                                                                </div>
                                                            </Button>
                                                        </Link>
                                                    </Tooltip>
                                                    <IconButton
                                                        onClick={(e) => handleClick1(e, item.name, item)}
                                                        sx={{ position: 'absolute', right: '-10px', top: '5px', padding: '5px' }}
                                                    >
                                                        <MoreVertIcon />
                                                    </IconButton>
                                                </Stack>
                                            ) : (
                                                <Stack flexWrap='wrap' width='150px' height='130px' position='relative'>
                                                    <Tooltip title={item.name} enterDelay={900}>
                                                        <Button
                                                            onMouseOver={() => handleMouseOver(item.name)}
                                                            onMouseOut={handleMouseOut}
                                                            sx={{
                                                                flexDirection: 'column',
                                                                width: '100%',
                                                                height: '100%',
                                                                textTransform: 'none',
                                                                backgroundColor: properties?._id === item?._id && showProperties ? "lightblue" : "white",
                                                                borderRadius: '15px',
                                                                padding: '5px',
                                                            }}
                                                            variant='text'
                                                            color='primary'
                                                            size='medium'
                                                        >
                                                            <div>
                                                                <img className={styles.responsive} src={ImageConfig[item.name.split('.').pop().toLowerCase()] || ImageConfig['default']} alt="File" />
                                                            </div>
                                                            <div>
                                                                <p className={styles.textResponsive}>{item.name.length <= 10 ? item.name : truncateFileName(item.name)}</p>
                                                            </div>
                                                        </Button>
                                                    </Tooltip>
                                                    <IconButton
                                                        onClick={(e) => handleClick(e, item.name, item)}
                                                        sx={{ position: 'absolute', right: '0px', top: '5px', padding: '5px' }}
                                                    >
                                                        <MoreVertIcon />
                                                    </IconButton>
                                                </Stack>
                                            )}
                                        </div>
                                    ))}
                                    {(loading === false && fileFolders.length === 0 && !error && !searchQuery) && <Stack justifyContent='center' width='100%' height='40vh' alignItems='center'>There is no Files and folders in current directory </Stack>}
                                    {(loading === false && filteredFileFolders.length === 0 && !error && searchQuery) && <Stack justifyContent='center' width='100%' height='100%' alignItems='center'>No item found </Stack>}
                                    {error && <Stack justifyContent='center' width='100%' height='100%' alignItems='center'>{error}</Stack>}
                                    {fileView && <View docu={fileView} setFileView={setFileView} handleViewClose={handleViewClose} />}
                                </Stack>
                            </Box>
                            {/* file actions menu */}
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            // PaperProps={{ elevation: 1 }}
                            >
                                <MenuItem disabled={!properties?.isDownloadable} sx={{ gap: "5px" }} onClick={() => {

                                    handleDownload(pathValue, itemName);
                                }}>
                                    <IconDownload fontSize='medium' />
                                    Download
                                </MenuItem>
                                {/* <hr /> */}
                                <MenuItem disabled={itemName.split('.').pop().trim() === "zip"} sx={{ gap: "5px" }} onClick={() => { handleView(pathValue, itemName); handleClose() }}>
                                    <IconEye />
                                    View
                                </MenuItem>
                                {/* <hr /> */}
                                <MenuItem sx={{ gap: "5px" }} onClick={() => handleCopy(itemName)} disabled={properties?.isInvolvedInProcess}>
                                    <IconClipboard />
                                    copy</MenuItem>
                                {/* <hr /> */}
                                <MenuItem sx={{ gap: "5px" }} onClick={() => handleCut(itemName)} disabled={properties?.isInvolvedInProcess}>
                                    <IconScissors />
                                    cut</MenuItem>
                                {/* <hr /> */}
                                <MenuItem sx={{ gap: "5px" }} onClick={deleteModalOpen} disabled={properties?.isInvolvedInProcess}>
                                    <IconTrash />
                                    delete</MenuItem>
                                {/* <hr /> */}
                                <MenuItem sx={{ gap: "5px" }} onClick={() => { setShowProterties(true); handleClose() }}>
                                    <IconTool />
                                    propterties
                                </MenuItem>
                            </Menu>
                            {/* folder actions menu */}
                            <Menu
                                anchorEl={anchorEl1}
                                open={Boolean(anchorEl1)}
                                onClose={handleClose}
                            >
                                <MenuItem disabled={!properties?.isDownloadable} sx={{ gap: "5px" }} onClick={() => {
                                    handleDownloadFolder(pathValue, itemName);
                                }}>
                                    <IconDownload fontSize='medium' />
                                    Download
                                </MenuItem>
                                <MenuItem sx={{ gap: "5px" }} onClick={() => { setShowProterties(true); handleClose() }}>
                                    <IconTool />
                                    propterties
                                </MenuItem>
                            </Menu>
                            {open && (
                                <Modal open={open} onClose={closeModal} className='create-folder-modal'>
                                    <div style={{ gap: '10px', position: 'relative' }} className='create-folder-modal-content-container'>{ModelContent}</div>
                                </Modal>
                            )}
                            {isModalOpen && (
                                <Modal open={isModalOpen} onClose={deleteModalClose} className='create-folder-modal'>
                                    <div style={{ gap: '10px', position: 'relative' }} className='create-folder-modal-content-container'>{deleteModalContent}</div>
                                </Modal>
                            )}
                            {(isContextMenuOpen && fileName) && (
                                <ContextMenu
                                    xPos={contextMenuPos.x}
                                    yPos={contextMenuPos.y}
                                    handlePaste={handlePaste}
                                />
                            )}
                            {(loading) && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: "translate(-50%,-50%)" }}><CircularProgress color="inherit" size={30} /></div>}
                        </Stack>
                        {showProperties && <Stack flex={showProperties ? "25%" : "none"} sx={{ position: 'relative', padding: '10px', minHeight: '77vh', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', backgroundColor: "white", margin: '5px', border: "1px solid darkgray" }}>
                            <IconButton onClick={() => setShowProterties(false)} sx={{ top: '5px', right: '5px', height: '50px', width: '50px', position: 'absolute' }}>
                                <CloseIcon />
                            </IconButton>
                            <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>PROPERTIES</h2>
                            <hr style={{ marginBottom: '20px' }} />
                            <p> <b>Name:</b> {properties.name}</p>
                            <br />
                            {/* <p>type: {properties.type}</p> */}
                            <p><b>Size:</b> {formatSize(properties.size)}</p>
                            <br />
                            {/* createdBY: {item.createdBy} */}
                            <p><b>Created on: </b>{moment(properties.createdOn).format('DD-MM-YYYY HH:mm')}</p>
                            <br />
                            <p><b>Last Accessed:</b> {moment(properties.lastAccessed).format('DD-MM-YYYY HH:mm')}</p>
                            <br />
                            <p><b>Last Updated:</b> {moment(properties.lastUpdated).format('DD-MM-YYYY HH:mm')}</p>
                        </Stack>}
                    </Stack>
                </div>
            </Stack>
            {/* color for plus background background: 'linear-gradient(to right, #3E5151 , #DECBA4)' */}
            {isUploadable && <Stack position='relative'>
                <Fab color="primary" onClick={handlePlus} aria-label="add" sx={{ position: 'fixed', bottom: '5%', right: '5%' }}>
                    <AddIcon />
                    {showButtons && <Box gap='10px' flexDirection='column' display='flex' sx={{ width: '150px', borderRadius: '15px', padding: '15px', position: 'absolute', top: '-220%', right: '0%' }}>
                        <Button
                            sx={{
                                flexDirection: 'row', marginBottom: '5px', padding: '10px', height: '35px', alignItems: "center"
                            }}
                            // color='info'
                            size='small'
                            variant='contained'
                            onClick={() => openModal('createFolder')}
                        >
                            <IconFolderPlus size={17} style={{ marginRight: '3px' }} />
                            {/* <img src={imageSrc} alt="image" /> */}
                            <p style={{ fontSize: '12px', textAlign: 'center', color: 'white' }}>NEW FOLDER</p>
                        </Button>
                        <Button
                            sx={{
                                flexDirection: 'row', marginBottom: '5px', padding: '10px', height: '35px', alignItems: 'center',
                            }}

                            variant='contained'
                            size='small'
                            onClick={() => openModal('uploadFiles')}
                        >
                            <IconUpload size={16} style={{ marginRight: '3px' }} />
                            <p style={{ fontSize: '12px', textAlign: 'center', color: 'white' }}>UPLOAD FILE</p>
                        </Button>
                    </Box>}
                </Fab>
            </Stack>}
        </DefaultLayout>
    )
}