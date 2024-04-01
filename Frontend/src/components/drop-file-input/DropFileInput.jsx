import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios'
import { Box, Button, Stack } from '@mui/material';
import { useSelector } from 'react-redux';
import styles from './drop-file-input.module.css'
import { ImageConfig } from '../../config/ImageConfig';
import uploadImg from '../../assets/cloud-upload-regular-240.png';

import Typography from '@mui/material/Typography';
import Popover from '@mui/material/Popover';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';

import { download, getFileSize, upload, uploadFileWithChunks, getContentTypeFromExtension } from './FileUploadDownload';

const DropFileInput = props => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const wrapperRef = useRef(null);

    const [fileList, setFileList] = useState([]);
    const [error, setError] = useState(null)
    const pathValue = useSelector((state) => state.path.value)
    const onDragEnter = () => wrapperRef.current.classList.add('dragover');

    const onDragLeave = () => wrapperRef.current.classList.remove('dragover');

    const onDrop = () => wrapperRef.current.classList.remove('dragover');

    const onFileDrop = (e) => {
        const newFile = e.target.files[0];
        console.log(newFile + " new file");
        if (newFile) {
            const fileName = newFile.name;
            console.log(fileName + " file nameeee")
            const fileNameWithoutExtension = fileName.replace(/\.[^.]+$/, '');
            console.log(fileNameWithoutExtension + " Without extension")
            const hasSpecialCharacters = /^[a-zA-Z0-9_\-()\[\]\s]*$/.test(fileNameWithoutExtension);
            console.log(hasSpecialCharacters)

            if (!hasSpecialCharacters) {
                alert("File name must not contain special characters");
            } else {
                const updatedList = [...fileList, newFile];
                setFileList(updatedList);
                props.onFileChange(updatedList);
            }
        }
    }

    const fileRemove = (file) => {
        const updatedList = [...fileList];
        updatedList.splice(fileList.indexOf(file), 1);
        setFileList(updatedList);
        props.onFileChange(updatedList);
    }


    // const getFileSize = async(fileName) => {
    //     let response;
    //     try{
    //         const url  = backendUrl + "/download"
    //         response = await axios.get(url, {
    //             headers: {
    //               Range: `bytes=0-0`,
    //               "X-Filename": fileName
    //             }
    //           });
    //           console.log(response.data)
    //           return response.data.fileSize
    //     }catch(error){

    //     }
    // }

    // function getContentTypeFromExtension(extension) {
    //     const mimeTypes = {
    //       txt: 'text/plain',
    //       pdf: 'application/pdf',
    //       doc: 'application/msword',
    //       docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    //       xls: 'application/vnd.ms-excel',
    //       xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    //       ppt: 'application/vnd.ms-powerpoint',
    //       pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    //       png: 'image/png',
    //       jpg: 'image/jpeg',
    //       jpeg: 'image/jpeg',
    //       gif: 'image/gif',
    //       bmp: 'image/bmp', // remain from here
    //       svg: 'image/svg+xml',
    //       mp3: 'audio/mpeg',
    //       wav: 'audio/wav',
    //       mp4: 'video/mp4',
    //       avi: 'video/x-msvideo',
    //       mkv: 'video/x-matroska',
    //       zip: 'application/zip',
    //       rar: 'application/x-rar-compressed',
    //       tar: 'application/x-tar',
    //       // Add more mappings for other file types as needed
    //   };


    //     return mimeTypes[extension] || 'application/octet-stream'; // Default to generic binary if extension not found
    //   }

    //         const download = async (fileName) => {
    //           const fileExtension = fileName.split('.')[1];
    //           let fileSize = await getFileSize(fileName);
    //           console.log('file size is', fileSize)
    //           let chunkSize = 1000 * 1024 * 1024;
    //           try {
    //           //   let end = chunkSize - 1; // Initial chunk size

    //           //   let chunks = []; // Array to store chunks

    //           // e-Sanrakshan => 
    //               //keyFolder => keyFiles 
    //               //userName => 

    //           // security => file path expose 

    //             while (start < fileSize) {
    //               const url  = backendUrl + "/download"
    //               const response = await axios.get(url, {
    //                 headers: {
    //                   Range: `bytes=${start}-${end}`,
    //                   "X-Filename": fileName
    //                 },
    //                 responseType: 'arraybuffer',
    //               });

    //               // Push the chunk to the array
    //               chunks.push(new Blob([response.data]));

    //               // Update the byte range for the next chunk
    //               start = end + 1;
    //               end = Math.min(start + chunkSize - 1, fileSize - 1);
    //               console.log('chunks',chunks)
    //             }

    //             // Create a single Blob from the chunks
    //             const combinedBlob = new Blob(chunks, { type: getContentTypeFromExtension(fileExtension) });

    //             // Create a URL for the Blob
    //             const blobUrl = URL.createObjectURL(combinedBlob, { type: getContentTypeFromExtension(fileExtension) });

    //             // Create a new anchor element
    //             const anchor = document.createElement('a');
    //             anchor.href = blobUrl;
    //             anchor.download = `${fileName}`;

    //             // Attach the anchor element to the DOM temporarily
    //             document.body.appendChild(anchor);


    //             // Programmatically trigger a click event on the anchor element
    //             anchor.click();

    //             // Clean up: revoke the URL and remove the dynamically created anchor element
    //             URL.revokeObjectURL(blobUrl);

    //             document.body.removeChild(anchor);

    //             chunks = [];
    //             start = 0;

    //           } catch (error) {

    //             alert(`download failed for text.txt`)
    //             console.error('Error downloading file:', error);
    //           }
    //         };

    //       async function uploadFileWithChunks(file) {
    //           const chunkSize = 500 * 1024 * 1024; // 500MB chunk size
    //           const totalChunks = Math.ceil(file.size / chunkSize);

    //           for (let chunkNumber = 0; chunkNumber < totalChunks; chunkNumber++) {
    //             const start = chunkNumber * chunkSize;
    //             const end = Math.min(start + chunkSize - 1, file.size - 1);
    //             console.log('end',end)
    //             const contentType = getContentTypeFromExtension(file.name.split(".")[1]);
    //               console.log('content type', contentType)
    //             const headers = {
    //               'X-File-Name': encodeURIComponent(file.name),
    //               'X-Total-Chunks': totalChunks,
    //               'X-Current-Chunk': chunkNumber,
    //               'X-Chunk-Size': chunkSize,
    //               'Content-Type': contentType,
    //               Range: `bytes=${start}-${end}`,
    //             };

    //             const chunk = file.slice(start, end + 1);

    //             try {
    //               const url  = backendUrl + "/upload"
    //               const response = await fetch(url, {
    //                 method: 'POST',
    //                 body: chunk,
    //                 headers: headers,
    //               });

    //               if (response.ok) {
    //                 const data = await response.json();
    //                 console.log(`Chunk ${chunkNumber + 1}/${totalChunks} uploaded successfully`);
    //               } else {
    //                 console.error(`Chunk ${chunkNumber + 1}/${totalChunks} upload failed`);
    //               }
    //             } catch (error) {
    //               console.error(`Chunk ${chunkNumber + 1}/${totalChunks} upload error:`, error.message);
    //             }
    //           }
    //         }

    //         async function upload() {
    //           if (fileList.length === 0) {
    //             console.log('Please select one or more files to upload.');
    //             return;
    //           }

    //           for (let i = 0; i < fileList.length; i++) {
    //             const file = fileList[i];
    //             await uploadFileWithChunks(file);
    //           }

    //           console.log('All files upload completed.');
    //         }


    /* here we will make this array of objects, 1. filename 2.value so that we can have
    this feature for multiple files */
    //  let chunks = []
    //  let start = 0;
    //  let end = 100 * 1024 * 1024 - 1;
    const url = backendUrl + "/createPermissions";
    const endpoint = backendUrl + "/getUsernames"
    useEffect(() => {
        const fetchData = async () => {
            const { data } = await axios.post(endpoint, null)
            // console.log(data.usernames)
            setUserList(data.usernames)
        }
        fetchData()
    }, [])
    const [userList, setUserList] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [selectedFile, setSelectedFile] = useState('');
    const handlePermissionChange = (e, user, filename) => {
        if (!e.target.checked) {
            const matchingPermission = permissions.find(item => item.filename === selectedFile);
            if (matchingPermission) {
                if (e.target.name === 'read') {
                    const updatedReadArray = matchingPermission.read.filter(item => item !== user);
                    setPermissions(prev => prev.map(permission =>
                        permission.filename === selectedFile
                            ? { ...permission, read: updatedReadArray }
                            : permission
                    ));
                }
                else {
                    const updatedReadArray = matchingPermission.write.filter(item => item !== user);
                    setPermissions(prev => prev.map(permission =>
                        permission.filename === selectedFile
                            ? { ...permission, write: updatedReadArray }
                            : permission
                    ));
                }
            }
        }
        else {
            const check = permissions.find((item) => item.filename === filename);
            if (check) {
                if (e.target.name === 'read') {
                    setPermissions((prev) =>
                        prev.map((item) =>
                            item.filename === filename
                                ? {
                                    ...item,
                                    read: item.read.includes(user) ? item.read : [...item.read, user],
                                }
                                : item
                        )
                    );
                } else {
                    setPermissions((prev) =>
                        prev.map((item) =>
                            item.filename === filename
                                ? {
                                    ...item,
                                    write: item.write.includes(user) ? item.write : [...item.write, user],
                                }
                                : item
                        )
                    );
                }
            } else {
                const newPermission = {
                    filename: filename,
                    filePath: `${pathValue}/${filename}`,
                    read: e.target.name === 'read' ? [user] : [],
                    write: e.target.name === 'write' ? [user] : [],
                };
                setPermissions((prev) => [...prev, newPermission]);
            }
        }
    };
    const handleHitBackPoint = async () => {
        await axios.post(url, { permissions: permissions })
        setPermissions([])
    }
    const handleUpload = async () => {
        await upload(fileList, pathValue, props.getData)
        await handleHitBackPoint()
        props.setOpen(false)
    }
    const handleSelectedFileChange = (name) => {
        setSelectedFile(name);
    }
    function formatSize(sizeInBytes) {
        if (sizeInBytes < 1024) {
            return sizeInBytes + ' bytes';
        } else if (sizeInBytes < 1024 * 1024) {
            return (sizeInBytes / 1024).toFixed(1) + ' KB';
        } else {
            return (sizeInBytes / (1024 * 1024)).toFixed(1) + ' MB';
        }
    }
    const truncateFileName = (fname, maxLength = 10) => {
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
            const truncatedName = `${baseName.slice(0, 8)}..${baseName.slice(-3)}`;
            return `${truncatedName}.${extension}`;
        }
    };
    return (
        <>
            <div
                ref={wrapperRef}
                className={styles['drop-file-input']}
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                style={{
                    border: '2px dashed #ccc',
                    borderRadius: '5px',
                    padding: '20px',
                    textAlign: 'center',
                    marginBottom: '20px',
                }}
            >
                <div className={styles['drop-file-input__label']}>
                    <img src={uploadImg} style={{ width: '100%', height: "150px", marginBottom: '10px' }} alt="" />
                    <p style={{ fontSize: '18px', fontWeight: 'bold' }}>Drag & Drop your files here</p>
                </div>
                <input type="file" value="" onChange={onFileDrop} />
            </div>
            {
                fileList.length > 0 ? (
                    <>
                        <p>UPLOAD LIST</p>
                        <div className={styles['drop-file-preview']}>
                            {/* <p className={styles['drop-file-preview__title']}>
                            Ready to upload
                        </p> */}
                            {
                                fileList.map((item, index) => (
                                    <>
                                        <Stack sx={{ backgroundColor: '#f5f8ff', alignItems: 'center', borderRadius: '10px' }}>
                                            <div key={index} className={styles['drop-file-preview__item']}>
                                                <img src={ImageConfig[item.name.split('.')[1]] || ImageConfig['default']} alt="" />
                                                <div className={styles['drop-file-preview__item__info']}>
                                                    <p>{truncateFileName(item.name)}</p>
                                                    <p>{formatSize(item.size)}</p>
                                                </div>
                                                <span className={styles['drop-file-preview__item__del']} onClick={() => fileRemove(item)}>x</span>
                                            </div>
                                            <PopupState variant="popover" popupId="demo-popup-popover">
                                                {(popupState) => (
                                                    <Box>
                                                        <Button variant="text" {...bindTrigger(popupState)} sx={{ marginBottom: '10px' }} onClick={(e) => {
                                                            popupState.open()
                                                            handleSelectedFileChange(item.name)
                                                        }}>
                                                            ADD USER ACCESS
                                                        </Button>
                                                        <Popover
                                                            {...bindPopover(popupState)}
                                                            anchorOrigin={{
                                                                vertical: 'center',
                                                                horizontal: 'center',
                                                            }}
                                                            transformOrigin={{
                                                                vertical: 'center',
                                                                horizontal: 'center',
                                                            }}
                                                        >
                                                            <Box sx={{ padding: '10px' }}>
                                                                <h3>give Permission for {item.name}</h3>
                                                                <hr style={{ margin: '10px 0px' }} />
                                                                <div className={styles['username-container']} >
                                                                    {userList.map((user, index) => (
                                                                        <>
                                                                            <Stack flexDirection='row' gap={2} padding={1} justifyContent='space-around'>
                                                                                <label style={{ width: '60px' }}>{index + 1}</label>
                                                                                <label style={{ width: '60px' }}>{user}</label>
                                                                                <label style={{ width: '60px' }}>
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        name='read'
                                                                                        checked={((permissions.filter((ele) => ele.filename === selectedFile)[0])?.read.includes(user))}
                                                                                        onChange={(e) => handlePermissionChange(e, user, item.name)}
                                                                                    />
                                                                                    Read
                                                                                </label>
                                                                                <label style={{ width: '60px' }}>
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        name='write'
                                                                                        checked={((permissions.filter((ele) => ele.filename === selectedFile)[0])?.write.includes(user))}
                                                                                        onChange={(e) => handlePermissionChange(e, user, item.name)}
                                                                                    />
                                                                                    Write
                                                                                </label>
                                                                            </Stack>
                                                                        </>
                                                                    ))}
                                                                </div>
                                                                <hr style={{ margin: '10px 0px' }} />
                                                                <Stack flexDirection='row' justifyContent='center'>
                                                                    <Box>
                                                                        <Button variant='contained' color='success' onClick={popupState.close}>ok</Button>
                                                                    </Box>
                                                                </Stack>
                                                            </Box>
                                                        </Popover>
                                                    </Box>
                                                )}
                                            </PopupState>
                                        </Stack >
                                    </>
                                ))
                            }
                        </div>
                    </>
                ) : null
            }
            <Button variant='outlined' onClick={handleUpload} className={styles['upload-button']}>Upload</Button>
            {/* <button onClick={() => {download("CP_SP-MIS.png")}}>download</button>
                      <button onClick={() => {download("CP_SP-MIS.png")}} style={{marginLeft: 20}}>resume</button> */}
        </>
    );
}

DropFileInput.propTypes = {
    onFileChange: PropTypes.func
}

export default DropFileInput;
