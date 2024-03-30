import {
    Box,
    IconButton,
    Menu,
    MenuItem,
    Paper,
    Stack,
    Typography,
    CircularProgress,
    Grid,
    TextField,
    Modal,
    Radio,
    FormControlLabel,
    Select,
    TableCell,
    TableBody,
    TableHead,
    Table,
    TableContainer,
    TableRow,
    Autocomplete,
    Checkbox,
    Chip,
    ListItemText,
    MenuList,
    Alert,
    AlertTitle,
    Dialog,
    DialogTitle,
    DialogActions,
    FormControl,
    Tooltip,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CheckboxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckboxIcon from "@mui/icons-material/CheckBox";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./View.module.css";
import { ImageConfig } from "../../config/ImageConfig";
import moment from "moment";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { download, upload } from "../../components/drop-file-input/FileUploadDownload";
import View from "../view/View";
import { Button } from "@mui/material";
import { useRef } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
    IconBan,
    IconDownload,
    IconEye,
    IconFileOff,
    IconUpload,
    IconWritingSign,
    IconX,
} from "@tabler/icons-react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { InfoOutlined, Tune } from "@mui/icons-material";
import { toast } from "react-toastify";
import sessionData from "../../Store";
import { useQueryClient } from "react-query";
import DefaultLayout from "../../layout/DefaultLayout";
import ComponentLoader from "../../common/Loader/ComponentLoader";
export default function ViewProcess(props) {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "50vw",
        bgcolor: "background.paper",
        border: "2px solid #000",
        boxShadow: 24,
        p: 3,
    };
    const { work, setWork } = sessionData();
    const [processData, setProcessData] = useState();
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const receivedData = params.get("data");
    const viewId = decodeURIComponent(receivedData);
    const workflowFollow = params.get("workflow");
    const workFlowToBeFollowed = decodeURIComponent(workflowFollow);
    const navigate = useNavigate();
    const publishCheck = processData?.workFlow[processData?.lastStepDone];
    const lastWork = processData?.workFlow[processData?.lastStepDone - 1];
    const username = localStorage.getItem("username");
    const [operable, setOperable] = useState(true);
    const [fileView, setFileView] = useState();
    const [itemName, setItemName] = useState("");
    const [anchorEl1, setAnchorEl1] = useState(null);
    const [anchorEl2, setAnchorEl2] = useState(null);
    const [anchorEl3, setAnchorEl3] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openComman, setOpenComman] = useState(false);
    const [open, setOpen] = useState(false);
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState({});
    const [selectedBranches, setSelectedBranches] = useState([]);
    const [selectedDepartments, setSelectedDepartments] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [roleList, setRoleList] = useState([]);
    const [remarks, setRemarks] = useState();
    const [reasonOfRejection, setReasonOfRejection] = useState();
    const [rejectFileId, setRejectFileId] = useState();
    const [workNameError, setWorkNameError] = useState("");
    const [cabinetNoError, setCabinetNoError] = useState("");
    const [fileInputError, setFileInputError] = useState("");
    const [fileData, setFileData] = useState([]);
    const [workName, setWorkName] = useState("");
    const [cabinetNo, setCabinetNo] = useState("");
    const [forwardProcessLoading, setForwardProcessLoading] = useState(false);
    const [rejectProcessLoading, setRejectProcessLoading] = useState(false);
    const [reUploadLoading, setreUploadLoading] = useState(false);
    const [openC, setOpenC] = useState(false);
    const [openE, setOpenE] = useState(false);
    const [fileToBeOperated, setFileToBeOperated] = useState({
        signedBy: [],
    });
    const [signedBy, setSignedBy] = useState([]);

    // view functionality
    const handleClick1 = (event, name, item) => {
        setItemName(name);
        setAnchorEl1(event.currentTarget);
    };
    const handleClick2 = (event, name, item) => {
        setItemName(name);
        setAnchorEl3(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl1(null);
    };
    const sampleDocMenuClose = () => {
        setAnchorEl3(null);
    };
    const handleCloseSignedBymenu = () => {
        setAnchorEl2(null);
    };
    const handleOpenSignedByMenu = (e) => {
        setAnchorEl2(e.currentTarget);
    };
    const [rejectedMenu, setRejectedMenu] = useState(null);
    const [file, setFile] = useState([]);
    const handleOpenRejectedMenu = (e) => {
        setRejectedMenu(e.currentTarget);
    };
    const handleViewClose = () => {
        setFileView(null);
    };
    const handleDownload = (path, name) => {
        try {
            download(name, path);
        } catch (error) {
            console.error("Error downloading file:", error);
            toast.error("An error occurred while downloading the file.");
        }
        handleClose();
    };
    const handleUpload = async () => {
        let newDoc = [];
        setreUploadLoading(true);
        const url = backendUrl + "/getProcessDocumentName";
        const filelist = fileData.map((item) => item.file);
        const dummy = () => { };
        let finalData = [];
        try {
            const branch = processData.documentsPath.split("/");

            let path = processData.documentsPath;
            for (let i = 0; i < fileData.length; i++) {
                let res = await axios.post(
                    url,
                    {
                        department: branch[1],
                        workName: fileData[i].workName,
                        cabinetNo: fileData[i].cabinetNo,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                        },
                    }
                );
                const currentTime = new Date();
                newDoc.push({
                    workName: fileData[i].workName,
                    cabinetNo: fileData[i].cabinetNo,
                    signedBy: [],
                    details: { name: res.data.name + ".pdf", createdOn: currentTime },
                });
                let ext = filelist[i].name.split(".").pop();
                let data = await upload(
                    [filelist[i]],
                    `${path}`,
                    dummy,
                    `${res.data.name}.${ext}`,
                    true
                );
                data = data[0];
                if (data && typeof fileData[i] === "object") {
                    const updatedFileItem = {
                        ...fileData[i],
                        documentId: data,
                    };
                    delete updatedFileItem.file;
                    finalData.push(updatedFileItem);
                } else {
                    console.log("Error: data.id or filelist[i] is missing or invalid.");
                }
            }
            // await addProcess(finalData, path); call uploadDocumentsInProcess
            setFileData([]);
        } catch (error) {
            toast.error("unable to upload documents");
            setreUploadLoading(false);
            return;
        }
        try {
            const url =
                backendUrl + "/uploadDocumentsInProcess";
            const res = await axios.post(
                url,
                {
                    processId: viewId,
                    documents: finalData,
                    workFlowToBeFollowed: workFlowToBeFollowed,
                    isInterBranchProcess: processData.isInterBranchProcess,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            if (res.status === 200) {
                processData.documents.push(...newDoc);
                toast.success("Documents is uploaded");
            }
        } catch (error) {
            console.error("error", error);
        }
        setreUploadLoading(false);
    };
    // const handlePathDetailsChange = (e) => {
    //   setPathDetails({
    //     ...pathDetails,
    //     [e.target.name]: e.target.value,
    //   });
    // };
    const handleView = async (path, name) => {
        setLoading(true);
        try {
            const fileData = await download(name, path, true);
            if (fileData) {
                setFileView({ url: fileData.data, type: fileData.fileType });
                setLoading(false);
            } else {
                console.error("Invalid fileData:", fileData);
                toast.error("Invalid file data.");
                setLoading(false);
            }
        } catch (error) {
            console.error("Error viewing file:", error);
            toast.error("Unable to view the file.");
            setLoading(false);
        }
        handleClose();
    };

    const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
    const completeModalClose = () => {
        setIsCompleteModalOpen(false);
    };
    const [completeProcessLoading, setCompleteProcessLoading] = useState(false);
    const completeModalContent = (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <p style={{ fontSize: "18px", marginBottom: "10px" }}>
                ARE YOU SURE YOU WANT TO COMPLETE THIS PROCESS?
            </p>
            <Stack flexDirection="row" gap={3}>
                <Button
                    variant="contained"
                    size="small"
                    color={completeProcessLoading ? "inherit" : "error"}
                    onClick={() => handleForward(true)}
                    disabled={completeProcessLoading}
                    sx={{
                        // backgroundColor: 'red',
                        // color: 'white',
                        "&:hover": {
                            backgroundColor: "#ff0000",
                        },
                    }}
                >
                    {completeProcessLoading ? <CircularProgress size={20} /> : "Yes"}
                </Button>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={completeModalClose}
                    disabled={completeProcessLoading}
                    sx={{
                        backgroundColor: "#007bff",
                        color: "white",
                        "&:hover": {
                            backgroundColor: "#0056b3",
                        },
                    }}
                >
                    No
                </Button>
            </Stack>
        </Box>
    );

    // modal functionality
    const modalOpen = (name) => {
        if (name === "head") {
            setOpen(true);
        } else {
            setOpenComman(true);
        }
    };
    const modalClose = () => {
        setSelectedDepartments([]);
        setSelectedBranch();
        setSelectedRoles([]);
        setOpen(false);
    };
    const closeCommanModal = () => {
        setSelectedBranches([]);
        setSelectedRoles([]);
        setOpenComman(false);
    };

    // publish functionality
    const handleChange = (event, value) => {
        setSelectedDepartments(value);
    };
    const [selectAllCheck, setSelectAllCheck] = useState(false);
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedDepartments(
                selectedBranch.departments
                    .filter((item) => !processData.name.includes(item.name))
                    .map((item) => item.name)
            );
            setSelectAllCheck(true);
        } else {
            setSelectedDepartments([]);
            setSelectAllCheck(false);
        }
    };

    const handleRoleChange = (event) => {
        setSelectedRoles(event.target.value);
    };
    const handleBranchChange = (e) => {
        const branch = branches.find((item) => item.name === e.target.value);
        setSelectedBranch(branch);
        // setSelectedBranches(e.target.value);
    };
    const handleCommanBranchChange = (e, value) => {
        setSelectedBranches(value);
    };
    const [selectAllCheckBranches, setSelectAllCheckBranches] = useState(false);
    const handleSelectAllBranches = (e) => {
        if (e.target.checked) {
            const nonHeadOfficeBranches = branches
                .filter((item) => item.name !== "headOffice")
                .filter((item) => !processData.name.includes(item.name))
                .map((item) => item.name);
            setSelectedBranches(nonHeadOfficeBranches);
            setSelectAllCheckBranches(true);
        } else {
            setSelectedBranches([]);
            setSelectAllCheckBranches(false);
        }
    };
    const [publishLoading, setPublishLoading] = useState(false);
    const handlePublish = async (name) => {
        setPublishLoading(true);
        let message = "";

        if (name === "head") {
            if (
                selectedBranch &&
                Object.keys(selectedBranch).length === 0 &&
                selectedDepartments.length === 0 &&
                selectedRoles.length === 0
            ) {
                message = "Please select inputs";
                setPublishLoading(false);
            } else if (
                selectedRoles.length === 0 &&
                selectedDepartments.length === 0
            ) {
                message = "Please select roles & departments";
                setPublishLoading(false);
            } else if (selectedDepartments.length === 0) {
                message = "Please select departments";
                setPublishLoading(false);
            } else if (selectedRoles.length === 0) {
                message = "Please select roles";
                setPublishLoading(false);
            }
        } else {
            if (selectedBranches.length === 0 && selectedRoles.length === 0) {
                message = "Please select inputs";
                setPublishLoading(false);
            } else if (selectedBranches.length === 0) {
                message = "Please select branch";
                setPublishLoading(false);
            } else if (selectedRoles.length === 0) {
                message = "Please select roles";
                setPublishLoading(false);
            }
        }
        if (message) {
            toast.info(message);
            return; // Stop further execution if there's a message
        }
        try {
            const url = backendUrl + "/publishProcess";
            const response = await axios.post(
                url,
                name === "head"
                    ? {
                        processId: viewId,
                        roles: selectedRoles,
                        departments: selectedDepartments,
                    }
                    : {
                        processId: viewId,
                        roles: selectedRoles,
                        branches: selectedBranches,
                    },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            if (response.status === 200) {
                toast.success("Process is published");
                closeCommanModal();
                modalClose();
            } else {
                toast.error("Unable to publish");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while publishing");
        }
        setPublishLoading(false);
    };
    const queryClient = useQueryClient();
    const handleForward = async (completeBefore) => {
        setCompleteProcessLoading(true);
        setForwardProcessLoading(true);
        try {
            const forwardUrl = backendUrl + "/forwardProcess";
            const response = await axios.post(
                forwardUrl,
                {
                    processId: viewId,
                    currentStep: processData.currentStepNumber,
                    ...(selectedStep ? { nextStepNumber: selectedStep } : {}),
                    completeBeforeLastStep: completeBefore ? true : false,
                    remarks: remarks,
                    workFlowToBeFollowed: workFlowToBeFollowed,
                    isInterBranchProcess: processData.isInterBranchProcess,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );

            if (response.status === 200) {
                toast.success("Process is forwarded");
                queryClient.removeQueries();
                navigate("/processes");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Cannot forward !!");
        } finally {
            setIsModalOpen(false);
            setCompleteProcessLoading(false);
            setForwardProcessLoading(false);
        }
    };
    const currentUserData = processData?.workFlow.find(
        (item) => item?.user === username
    );
    const rejectProcess = async () => {
        setRejectProcessLoading(true);
        try {
            setLoading(true);
            const url = backendUrl + "/revertProcess";
            const res = await axios.post(
                url,
                {
                    processId: viewId,
                    currentStep: currentUserData?.step,
                    remarks: remarks,
                    workFlowToBeFollowed: workFlowToBeFollowed,
                    isInterBranchProcess: processData.isInterBranchProcess,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            setLoading(false);
            if (res.status === 200) {
                toast.success("Process is rejected");
                queryClient.removeQueries();
                navigate("/processes");
            }
        } catch (error) {
            toast.error("unable to reject process");
            setLoading(false);
        } finally {
            setRejectProcessLoading(false);
            setRejectModalOpen(false);
        }
    };
    // modal for skip
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [rejectFileModalOpen, setRejectFileModalOpen] = useState(false);
    const [rejectFileLoading, setRejectFileLoading] = useState(false);
    const [selectedStep, setSelectedStep] = useState("");
    const openModal = () => {
        setIsModalOpen(true);
    };
    const handleModalClose = () => {
        setRemarks("");
        setIsModalOpen(false);
    };
    const openRejectModal = () => {
        setRejectModalOpen(true);
    };
    const CloseRejectModal = () => {
        setRemarks("");
        setRejectModalOpen(false);
    };
    const openRejectFileModal = () => {
        setRejectFileModalOpen(true);
    };
    const CloseRejectFileModal = () => {
        setReasonOfRejection("");
        setRejectFileModalOpen(false);
    };
    const [selectedOption, setSelectedOption] = useState("");
    const handleOptionChange = (event) => {
        setSelectedOption("");
        setSelectedOption(event.target.value);
    };
    // Default step number
    const handleStepChange = (event) => {
        setSelectedStep(event.target.value);
    };
    //
    // upload files
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);
    // const filelist = fileData.map((item) => item.file);
    const [signLoading, setSignLoading] = useState(false);
    const handleFileSelect = (e) => {
        const selected = e.target.files[0];
        if (selected && selected.type !== "application/pdf") {
            toast.info("Only pdf is allowed");
            fileInputRef.current.value = "";
        } else {
            setSelectedFile(selected);
        }
    };
    const handleFileAdd = () => {
        setWorkNameError("");
        setCabinetNoError("");
        setFileInputError("");

        if (workName.trim() === "") {
            setWorkNameError("Work Name is required");
        }

        if (cabinetNo.trim() === "") {
            setCabinetNoError("Cabinet Number is required");
        }

        if (!fileInputRef?.current?.files?.length) {
            setFileInputError("Please select a file");
        }
        if (workName && cabinetNo && selectedFile) {
            const newFile = {
                file: selectedFile,
                workName: workName,
                cabinetNo: cabinetNo,
            };
            setFileData([...fileData, newFile]);
            setWorkName("");
            setCabinetNo("");
            setSelectedFile(null);
            fileInputRef.current.value = "";
        }
    };

    const handleSign = async (processId, fileId) => {
        setSignLoading((value) => !value);
        const signUrl = backendUrl + "/signDocument";
        try {
            const res = await axios.post(
                signUrl,
                {
                    processId: processId,
                    documentId: fileId,
                    workFlowToBeFollowed,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );

            if (res.status === 200) {
                toast.success("Document signed");
                setProcessData((prevProcessData) => {
                    // create a copy of the previous state
                    const updatedProcessData = { ...prevProcessData };

                    // Find the document to update
                    const documents = updatedProcessData.documents.map((file) => {
                        if (file.details._id === fileId) {
                            // Update the signedBy array
                            return {
                                ...file,
                                signedBy: [
                                    ...file.signedBy,
                                    { username: localStorage.getItem("username") },
                                ],
                            };
                        }
                        return file;
                    });

                    // Update the documents array in the state
                    updatedProcessData.documents = documents;

                    // Return the updated state
                    return updatedProcessData;
                });
                setSignLoading((value) => !value);
            }
        } catch (error) {
            console.log("error", error);
            toast.error(error.response.data.message);
            setSignLoading(false);
        }
    };
    const handleRejectFile = async (processId, fileId) => {
        setRejectFileLoading(true);
        const rejectUrl = backendUrl + "/rejectDocument";
        try {
            const res = await axios.post(
                rejectUrl,
                {
                    processId: processId,
                    documentId: fileId,
                    reason: reasonOfRejection,
                    workFlowToBeFollowed,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            if (res.status === 200) {
                toast.success("Document is rejected");
                setProcessData((prevProcessData) => {
                    const updatedProcessData = { ...prevProcessData };

                    const documents = updatedProcessData.documents.map((file) => {
                        if (file.details._id === fileToBeOperated.details._id) {
                            // Update the signedBy array
                            return {
                                ...file,
                                rejection: localStorage.getItem("username"),
                            };
                        }
                        return file;
                    });

                    // Update the documents array in the state
                    updatedProcessData.documents = documents;

                    // Return the updated state
                    return updatedProcessData;
                });
            }
            // if (res.status === 200) {
            //   let process = processData;

            //   let documents = process.documents;

            //   let document = documents.find(
            //     (file) => file.details._id === fileToBeOperated.details._id
            //   );

            //   document.rejection = {
            //     rejectedBy: localStorage.getItem("username"),
            //   };

            //   documents = documents.filter(
            //     (file) => file.details._id !== fileToBeOperated.details._id
            //   );

            //   documents.push(document);

            //   process.documents = documents;

            //   setProcessData(process);
            // }
        } catch (error) {
            toast.error("not able to reject document");
        }
        CloseRejectFileModal();
        setReasonOfRejection("");
        setRejectFileLoading(false);
    };
    const handleDeleteFile = (index) => {
        if (index >= 0 && index < fileData.length) {
            const updatedFileData = [...fileData];
            updatedFileData.splice(index, 1);
            setFileData(updatedFileData);
        } else {
            console.log("Invalid index provided");
        }
    };
    const truncateFileName = (fname, maxLength = 25) => {
        if (fname.length <= maxLength) {
            return fname;
        } else {
            const [baseName, extension] = fname.split(".").reduce(
                (result, part, index, array) => {
                    if (index === array.length - 1) {
                        result[1] = part;
                    } else {
                        result[0] += part;
                    }
                    return result;
                },
                ["", ""]
            );
            const truncatedName = `${baseName.slice(0, 15)}...${baseName.slice(-2)}`;
            return `${truncatedName}.${extension}`;
        }
    };
    const handleSignClick = async () => {
        // const clickedFile = processData.documents[i];
        await handleSign(processData._id, fileToBeOperated.details._id);
        handleClose();
    };
    const checkFileIsOperable = () => {
        // const clickedFile = processData.documents[i];

        return (
            fileToBeOperated.signedBy
                .map((item) => item.username)
                .includes(localStorage.getItem("username")) ||
            fileToBeOperated.rejection !== undefined
        );
    };

    const [works, setWorks] = useState([]);
    const [selectedWork, setSelectedWork] = useState("");
    const getWorks = async () => {
        try {
            const url = backendUrl + "/getWorks";
            const accessToken = localStorage.getItem("accessToken");
            const { data } = await axios.post(url, null, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setWorks(data.works);
        } catch (error) {
            console.log(error);
        }
    };
    const handleWorkChange = (e) => {
        setSelectedWork(e.target.value);
    };
    const [sendLoading, setSendLoading] = useState(false);
    const sendToClerk = async () => {
        setSendLoading(true);
        if (selectedWork === "") {
            toast.info("please select work");
            setSendLoading(false);
            return;
        }
        const clerkUrl =
            backendUrl + `/sendToClerk/${viewId}`;
        try {
            const res = await axios.post(
                clerkUrl,
                { work: selectedWork, workFlowToBeFollowed: workFlowToBeFollowed },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            if (res.status === 200) {
                toast.success("Sent to clerk");
                setWork("");
                setSendLoading(false);
                queryClient.removeQueries();
                setOpenC(false);
                navigate("/processes");
            }
        } catch (error) {
            toast.error(error);
            setSendLoading(false);
            setOpenC(false);
        }
    };
    const [approveLoading, setApproveLoading] = useState(false);
    const handleApprove = async () => {
        setApproveLoading(true);
        const appUrl =
            backendUrl + `/approveProcess/${viewId}`;
        try {
            const res = await axios.post(
                appUrl,
                { workFlowToBeFollowed, currentStep: processData.currentStepNumber },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            if (res.status === 200) {
                toast.success("Approved");
                queryClient.removeQueries();
                navigate("/processes");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
        } finally {
            setApproveLoading(false);
        }
    };
    useEffect(() => {
        const fetchViewData = async () => {
            // setProcessData([]);
            let shouldNavigate = false;
            try {
                const url = backendUrl + `/getProcess/${viewId}`;
                const res = await axios.post(
                    url,
                    { workFlowToBeFollowed },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                        },
                    }
                );
                setProcessData(res.data.process);
            } catch (error) {
                shouldNavigate = true;
            }
            setLoading(false);
            if (shouldNavigate) {
                navigate("/processes");
                toast.error("Unable to fetch process data");
            }
        };
        const fetchBranches = async () => {
            const url =
                backendUrl + "/getBranchesWithDepartments";
            try {
                const accessToken = localStorage.getItem("accessToken");
                const { data } = await axios.post(url, null, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                setBranches(data.branches);
            } catch (error) {
                console.error("Error:", error);
            }
        };
        const fetchRoles = async () => {
            const url = backendUrl + "/getRoleNames";
            try {
                const res = await axios.post(url, null, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                });
                setRoleList(res.data.roles);
            } catch (error) {
                console.error("error");
            }
        };
        const params = new URLSearchParams(search);
        const receivedStatus = params.get("status");
        const status = decodeURIComponent(receivedStatus);
        if (status.toLowerCase() === "received") {
            setOperable(false);
        }
        fetchViewData();
        fetchBranches();
        fetchRoles();
        getWorks();
        return () => {
            setWork("");
        };
    }, []);
    const InfoRow = ({ label, value }) => (
        <Stack
            flexDirection="row"
            justifyContent="space-between"
            sx={{
                minWidth: { xs: "99%", sm: "500px", md: "70%" },
                margin: "5px",
                borderRight: "4px solid #6C22A6",
                borderLeft: "4px solid #6C22A6",
                borderTop: "1px solid #6C22A6",
                borderBottom: "1px solid #6C22A6",
                borderRadius: "5px",
                backgroundColor: "white",
            }}
        >
            <Typography sx={{ padding: "5px" }} variant="body1" fontWeight="700">{label}:</Typography>
            <Typography sx={{ padding: "5px" }} variant="body1">{value}</Typography>
        </Stack>
    );

    const Divider = () => (
        <hr style={{ margin: "5px 0", borderWidth: "0.1px solid" }} />
    );
    const handleEndProcess = async () => {
        setEndProcessLoading(true);
        const endUrl = backendUrl + `/endProcess/${viewId}`;
        try {
            const res = await axios.post(
                endUrl,
                { work },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            if (res.status === 200) {
                toast.success("Process ended successfully");
                queryClient.removeQueries();
                navigate("/processes");
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
        setEndProcessLoading(false);
    };
    const [endProcessLoading, setEndProcessLoading] = useState(false);
    const deleteModalContent = (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingBottom: "20px",
            }}
        >
            <Stack flexDirection="row" gap={3}>
                <Button
                    variant="contained"
                    size="small"
                    color={endProcessLoading ? "inherit" : "error"}
                    disabled={endProcessLoading}
                    onClick={handleEndProcess}
                    sx={{
                        "&:hover": {
                            backgroundColor: "#ff0000",
                        },
                    }}
                >
                    {endProcessLoading ? <CircularProgress size={20} /> : "Yes"}
                </Button>
                <Button
                    variant="outlined"
                    size="small"
                    disabled={endProcessLoading}
                    onClick={() => setOpenE(false)}
                    sx={{
                        backgroundColor: "#007bff",
                        color: "white",
                        "&:hover": {
                            backgroundColor: "#0056b3",
                        },
                    }}
                >
                    No
                </Button>
            </Stack>
        </Box>
    );
    return (
        <DefaultLayout>
            {loading ? <ComponentLoader /> : <Stack flexDirection="row">
                <div
                    style={{
                        width: "100%",
                        maxHeight: "fit-content",
                        position: "relative",
                        backgroundColor: " white"
                    }}
                >
                    {processData && (
                        <>
                            {processData?.samples?.length ? (
                                <Box sx={{ padding: "10px" }}>
                                    <Accordion
                                        sx={{
                                            // border: "1px solid",
                                            boxShadow:
                                                "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
                                        }}
                                    >
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="samples"
                                            id="samples"
                                        >
                                            <h3>Sample Documents : </h3>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Box sx={{ width: "99%", overflow: "auto" }}>
                                                <Stack
                                                    flexDirection="row"
                                                    gap={1}
                                                    flexWrap="wrap"
                                                    justifyContent="center"
                                                >
                                                    {processData?.samples?.map((file, index) => {
                                                        // const i = index;
                                                        const clickedFile = processData?.documents[index];
                                                        return (
                                                            <Box
                                                                sx={{ padding: "10px" }}
                                                                key={file?.details?._id}
                                                            >
                                                                <Stack
                                                                    sx={{
                                                                        minHeight: "270px",
                                                                        width: "250px",
                                                                        borderRadius: "15px",
                                                                        flex: "1 1 auto",
                                                                        margin: "10px",
                                                                        backgroundColor: "white",
                                                                        boxShadow:
                                                                            "2px 2px 6px -1px rgba(0,0,0,0.2), 0px 0px 8px 0px rgba(0,0,0,-0.86), 0px 0px 6px 3px rgba(1,1,2,0.12)",
                                                                    }}
                                                                // gap={2}
                                                                >
                                                                    <Stack alignItems="flex-end">
                                                                        <IconButton
                                                                            onClick={(e) => {
                                                                                handleClick2(
                                                                                    e,
                                                                                    file?.details?.name,
                                                                                    file
                                                                                );
                                                                                setFileToBeOperated({
                                                                                    ...file,
                                                                                });
                                                                            }}
                                                                        >
                                                                            <MoreVertIcon />
                                                                        </IconButton>
                                                                    </Stack>
                                                                    <div>
                                                                        <div className={styles.iconContainer}>
                                                                            <img
                                                                                style={{
                                                                                    width: "70px",
                                                                                    height: "70px",
                                                                                }}
                                                                                src={
                                                                                    ImageConfig[
                                                                                    file?.details?.name
                                                                                        .split(".")
                                                                                        .pop()
                                                                                        .toLowerCase()
                                                                                    ] || ImageConfig["default"]
                                                                                }
                                                                                alt=""
                                                                            />
                                                                        </div>
                                                                        <div className={styles.fileNameContainer}>
                                                                            <Tooltip
                                                                                title={file.details.name}
                                                                                enterDelay={900}
                                                                            >
                                                                                <h4>
                                                                                    {file?.details?.name <= 20
                                                                                        ? file.details.name
                                                                                        : truncateFileName(file.details.name)}
                                                                                </h4>
                                                                            </Tooltip>
                                                                        </div>
                                                                        <div className={styles.fileTimeContainer}>
                                                                            <p>
                                                                                -{" "}
                                                                                {moment(file?.details?.createdOn).format(
                                                                                    "DD-MMM-YYYY hh:mm A"
                                                                                )}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <div className={styles.filePartTwo}>
                                                                        <p className={styles.fileElements}>
                                                                            <b>Work assigned</b> :{file?.workName}
                                                                        </p>
                                                                        <p className={styles.fileElements}>
                                                                            <b>Cabinet no</b> : {file?.cabinetNo}
                                                                        </p>
                                                                    </div>
                                                                </Stack>
                                                                <>
                                                                    {signLoading && (
                                                                        <div
                                                                            style={{
                                                                                position: "fixed",
                                                                                zIndex: "999",
                                                                                top: "50%",
                                                                                left: "50%",
                                                                                transform: "translate(-50%, -50%)",
                                                                            }}
                                                                        >
                                                                            <CircularProgress
                                                                                color="inherit"
                                                                                size={30}
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </>
                                                            </Box>
                                                        );
                                                    })}
                                                </Stack>
                                            </Box>
                                        </AccordionDetails>
                                    </Accordion>
                                </Box>
                            ) : null}
                            <Stack sx={{ padding: "5px" }}>
                                <Box>
                                    <Stack>
                                        <Stack
                                            alignItems="center"
                                            sx={{
                                                marginBottom: "20px",
                                                padding: "15px",
                                            }}
                                        >
                                            <InfoRow label="Name" value={processData?.name} />
                                            <InfoRow
                                                label="Status"
                                                value={
                                                    processData?.completed ? (
                                                        <span style={{ color: "green" }}>Completed</span>
                                                    ) : (
                                                        <span style={{ color: "red" }}>Pending</span>
                                                    )
                                                }
                                            />
                                            <InfoRow
                                                label="Document Path"
                                                value={processData?.documentsPath}
                                            />
                                            <InfoRow
                                                label="Created Date"
                                                value={moment(processData?.createdAt).format(
                                                    "DD-MM-YYYY hh:mm A"
                                                )}
                                            />
                                            <InfoRow
                                                label="Previous Step"
                                                value={
                                                    processData?.lastStepDone === 0
                                                        ? "Process is just initiated"
                                                        : `last step was ${lastWork?.work}`
                                                }
                                            />
                                            <InfoRow
                                                label="Remarks"
                                                value={
                                                    processData.remarks ? processData.remarks : "No Remarks"
                                                }
                                            />
                                            <InfoRow label="Documents" />
                                        </Stack>
                                    </Stack>
                                    <Box sx={{ width: "99%", overflow: "auto" }}>
                                        <Stack
                                            flexDirection="row"
                                            gap={1}
                                            flexWrap="wrap"
                                            justifyContent="center"
                                        >
                                            {processData?.documents?.map((file, index) => {
                                                const clickedFile = processData?.documents[index];
                                                return (
                                                    <Box sx={{ padding: "10px" }} key={file?.details?._id}>
                                                        <Stack
                                                            sx={{
                                                                minHeight: "270px",
                                                                width: "250px",
                                                                borderRadius: "15px",
                                                                flex: "1 1 auto",
                                                                margin: "10px",
                                                                backgroundColor: "white",
                                                                boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px"
                                                            }}
                                                        >
                                                            <div className={styles.filePartOne}>
                                                                <div className={styles.fileHeading}>
                                                                    <h5
                                                                        style={{
                                                                            height: "100%",
                                                                            display: "flex",
                                                                            alignItems: "center",
                                                                        }}
                                                                    >
                                                                        {file?.rejection &&
                                                                            Object.keys(file.rejection).length > 0 ? (
                                                                            <p
                                                                                style={{
                                                                                    color: "red",
                                                                                    display: "flex",
                                                                                    alignItems: "center",
                                                                                }}
                                                                            >
                                                                                <Button
                                                                                    onClick={(e) => {
                                                                                        handleOpenRejectedMenu(e);
                                                                                        setFile(file);
                                                                                    }}
                                                                                    startIcon={<IconBan />}
                                                                                    sx={{ color: "red" }}
                                                                                >
                                                                                    Rejected
                                                                                </Button>
                                                                            </p>
                                                                        ) : file?.signedBy
                                                                            .map((item) => item.username)
                                                                            .includes(
                                                                                localStorage.getItem("username")
                                                                            ) ? (
                                                                            <Button
                                                                                onClick={(e) => {
                                                                                    handleOpenSignedByMenu(e);
                                                                                    setSignedBy(file.signedBy);
                                                                                }}
                                                                                style={{ color: "green", zIndex: "999" }}
                                                                            >
                                                                                signed
                                                                            </Button>
                                                                        ) : (
                                                                            <p style={{ color: "red" }}>un-signed</p>
                                                                        )}
                                                                    </h5>
                                                                    <IconButton
                                                                        onClick={(e) => {
                                                                            handleClick1(e, file?.details?.name, file);
                                                                            setFileToBeOperated({
                                                                                ...file,
                                                                            });
                                                                        }}
                                                                    >
                                                                        <MoreVertIcon />
                                                                    </IconButton>
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <div className={styles.iconContainer}>
                                                                    <img
                                                                        style={{
                                                                            width: "70px",
                                                                            height: "70px",
                                                                        }}
                                                                        src={
                                                                            ImageConfig[
                                                                            file?.details?.name
                                                                                .split(".")
                                                                                .pop()
                                                                                .toLowerCase()
                                                                            ] || ImageConfig["default"]
                                                                        }
                                                                        alt=""
                                                                    />
                                                                </div>
                                                                <div className={styles.fileNameContainer}>
                                                                    <Tooltip
                                                                        title={file.details.name}
                                                                        enterDelay={900}
                                                                    >
                                                                        <h4>
                                                                            {file?.details?.name <= 20
                                                                                ? file.details.name
                                                                                : truncateFileName(file.details.name)}
                                                                        </h4>
                                                                    </Tooltip>
                                                                </div>
                                                                <div className={styles.fileTimeContainer}>
                                                                    <p>
                                                                        -{" "}
                                                                        {moment(file?.details?.createdOn).format(
                                                                            "DD-MMM-YYYY hh:mm A"
                                                                        )}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className={styles.filePartTwo}>
                                                                <p className={styles.fileElements}>
                                                                    <b>Work assigned</b> :{file?.workName}
                                                                </p>
                                                                <p className={styles.fileElements}>
                                                                    <b>Cabinet no</b> : {file?.cabinetNo}
                                                                </p>
                                                            </div>
                                                        </Stack>
                                                        <>
                                                            {signLoading && (
                                                                <div
                                                                    style={{
                                                                        position: "fixed",
                                                                        zIndex: "999",
                                                                        top: "50%",
                                                                        left: "50%",
                                                                        transform: "translate(-50%, -50%)",
                                                                    }}
                                                                >
                                                                    <CircularProgress color="inherit" size={30} />
                                                                </div>
                                                            )}
                                                        </>
                                                    </Box>
                                                );
                                            })}
                                        </Stack>
                                    </Box>
                                </Box>
                                {((publishCheck?.user === username &&
                                    publishCheck?.work === "publish" &&
                                    !processData.isInterBranchProcess &&
                                    !processData.isHead) ||
                                    work === "publish") && (
                                        <>
                                            <Stack justifyContent="center" flexDirection="row">
                                                <Button
                                                    onClick={() => modalOpen("head")}
                                                    variant="outlined"
                                                    disabled={completeProcessLoading}
                                                    sx={{ m: 1 }}
                                                >
                                                    publish to headOffice
                                                </Button>
                                                <Button
                                                    onClick={() => modalOpen("comman")}
                                                    disabled={completeProcessLoading}
                                                    variant="outlined"
                                                    sx={{ m: 1 }}
                                                >
                                                    publish to branches
                                                </Button>
                                            </Stack>
                                        </>
                                    )}
                                {(publishCheck?.work === "upload" || work === "upload") &&
                                    !processData?.isHead &&
                                    !processData?.isToBeSentToClerk && (
                                        <Box sx={{ padding: "5px" }}>
                                            <Typography
                                                variant="h5"
                                                sx={{ textAlign: "center", mb: 2 }}
                                            >
                                                Upload Section
                                            </Typography>
                                            <Stack
                                                alignItems="center"
                                                sx={{ margin: "5px", gap: "1px" }}
                                            >
                                                <Box
                                                    sx={{
                                                        padding: "5px",
                                                        width: "100%",
                                                        maxWidth: "600px",
                                                        display: "flex",
                                                        flexDirection: "column",
                                                    }}
                                                >
                                                    <Grid
                                                        container
                                                        spacing={3}
                                                        sx={{ marginBottom: "20px" }}
                                                    ></Grid>

                                                    <TextField
                                                        fullWidth
                                                        variant="outlined"
                                                        label="Work Name"
                                                        value={workName}
                                                        error={!!workNameError}
                                                        onChange={(e) => {
                                                            const inputValue = e.target.value;
                                                            const isValidInput = /^[a-zA-Z0-9\s]*$/.test(
                                                                inputValue
                                                            );

                                                            if (isValidInput || inputValue === "") {
                                                                setWorkName(inputValue);
                                                            }
                                                        }}
                                                        // helperText="Field must contain only letters, numbers, and spaces."
                                                        sx={{ mb: 2, backgroundColor: "white" }}
                                                    />
                                                    <TextField
                                                        fullWidth
                                                        variant="outlined"
                                                        label="Cabinet Number"
                                                        type="number"
                                                        value={cabinetNo}
                                                        error={!!cabinetNoError}
                                                        inputProps={{ min: 1 }}
                                                        onKeyDown={(e) => {
                                                            (e.key === "e" ||
                                                                e.key === "E" ||
                                                                e.key === "-" ||
                                                                e.key === "+") &&
                                                                e.preventDefault();
                                                        }}
                                                        onChange={(e) => setCabinetNo(e.target.value)}
                                                        sx={{ mb: 2, backgroundColor: 'white' }}
                                                    />
                                                    <Box>
                                                        <input
                                                            type="file"
                                                            onChange={handleFileSelect}
                                                            ref={fileInputRef}
                                                            accept=".pdf"
                                                        />
                                                    </Box>
                                                    <Typography variant="body2" color="error">
                                                        {fileInputError}
                                                    </Typography>
                                                    <div style={{ padding: "10px", width: "100%" }}>
                                                        <Alert severity="error" icon={<InfoOutlined />}>
                                                            <AlertTitle>{"Note"}</AlertTitle>
                                                            <Typography sx={{ my: 0.4 }}>
                                                                Only the following file types are allowed for
                                                                upload :
                                                            </Typography>
                                                            <Box>
                                                                <Chip
                                                                    label={"PDF"}
                                                                    color="error"
                                                                    // variant="outlined"
                                                                    sx={{
                                                                        padding: 0,
                                                                        height: "22px",
                                                                        mr: 0.6,
                                                                        my: 0.4,
                                                                    }}
                                                                />
                                                            </Box>
                                                        </Alert>
                                                    </div>
                                                    <Box sx={{ alignSelf: "center" }}>
                                                        <Button
                                                            variant="outlined"
                                                            onClick={handleFileAdd}
                                                            sx={{ mt: 2 }}
                                                        >
                                                            Add File
                                                        </Button>
                                                    </Box>
                                                </Box>
                                                <TableContainer
                                                    component={Paper}
                                                    sx={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}
                                                    elevation={3}
                                                    className={styles.tableContainer}
                                                >
                                                    <Table>
                                                        <TableHead>
                                                            <TableRow className={styles.tableRow}>
                                                                <TableCell className={styles.tableHeaderCell}>
                                                                    File Name
                                                                </TableCell>
                                                                <TableCell className={styles.tableHeaderCell}>
                                                                    Work Name
                                                                </TableCell>
                                                                <TableCell className={styles.tableHeaderCell}>
                                                                    Cabinet Name
                                                                </TableCell>
                                                                <TableCell className={styles.tableHeaderCell}>
                                                                    Remove
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {fileData.length === 0 ? (
                                                                <TableRow>
                                                                    <TableCell colSpan={4} align="center">
                                                                        No data available
                                                                    </TableCell>
                                                                </TableRow>
                                                            ) : (
                                                                fileData.map((file, index) => (
                                                                    <TableRow key={index}>
                                                                        <TableCell>{file.file.name}</TableCell>
                                                                        <TableCell>{file.workName}</TableCell>
                                                                        <TableCell>{file.cabinetNo}</TableCell>
                                                                        <TableCell>
                                                                            <IconButton
                                                                                onClick={() => handleDeleteFile(index)}
                                                                            >
                                                                                <DeleteOutlineIcon />
                                                                            </IconButton>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                                <Stack margin={2}>
                                                    {/* cheche */}
                                                    <Button
                                                        variant="outlined"
                                                        onClick={handleUpload}
                                                        disabled={reUploadLoading}
                                                    >
                                                        {reUploadLoading ? (
                                                            <CircularProgress size={25} />
                                                        ) : (
                                                            <>
                                                                <IconUpload
                                                                    size={20}
                                                                    style={{ marginRight: "3px" }}
                                                                />
                                                                <p>Upload</p>
                                                            </>
                                                        )}
                                                    </Button>
                                                </Stack>
                                            </Stack>
                                        </Box>
                                    )}
                                {/* <Stack
                                    alignItems="center"
                                    flexDirection="row"
                                    gap={3}
                                    justifyContent="center"
                                    sx={{ marginX: "10px" }}
                                >
                                    {processData?.workFlow[0]?.user !== username &&
                                        !(
                                            processData.isHead &&
                                            processData.isToBeSentToClerk &&
                                            processData.isInterBranchProcess
                                        ) &&
                                        !processData.completed &&
                                        processData?.workFlow
                                            .map((item) => item.user)
                                            .includes(username) && (
                                            <Box>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    onClick={openRejectModal}
                                                    disabled={
                                                        processData.completed ||
                                                        completeProcessLoading ||
                                                        approveLoading
                                                    }
                                                >
                                                    Reject
                                                </Button>
                                            </Box>
                                        )}
                                    <Box>
                                        {processData?.workFlow[processData.workFlow.length - 1]
                                            .user !== username &&
                                            !processData?.isToBeSentToClerk &&
                                            !processData?.isHead &&
                                            work === "" &&
                                            !processData.completed &&
                                            processData?.workFlow
                                                .map((step) => step.user)
                                                .includes(username) &&
                                            operable && (
                                                <Button variant="contained" onClick={openModal}>
                                                    Next
                                                </Button>
                                            )}
                                        {processData?.workFlow[processData.workFlow.length - 1]
                                            .user === username &&
                                            work === "" &&
                                            !processData.completed &&
                                            (!processData.isInterBranchProcess ||
                                                (processData.isInterBranchProcess &&
                                                    processData?.processWorkFlow === workFlowToBeFollowed &&
                                                    processData?.workFlow
                                                        .map((item) => item.user)
                                                        .includes(username))) && (
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    disabled={completeProcessLoading}
                                                    onClick={() => handleForward(false)}
                                                >
                                                    {completeProcessLoading ? (
                                                        <CircularProgress size={20} />
                                                    ) : (
                                                        "Complete"
                                                    )}
                                                </Button>
                                            )}
                                    </Box>
                                    <Box>
                                        {processData.isInterBranchProcess &&
                                            processData?.isHead &&
                                            processData?.processWorkFlow !== workFlowToBeFollowed && (
                                                <Stack
                                                    gap={1}
                                                    flexDirection="row"
                                                    justifyContent="center"
                                                >
                                                    <Button
                                                        disabled={
                                                            processData.isToBeSentToClerk
                                                                ? null
                                                                : approveLoading
                                                        }
                                                        onClick={() =>
                                                            processData.isToBeSentToClerk
                                                                ? setOpenC(true)
                                                                : handleApprove()
                                                        }
                                                        size="medium"
                                                        variant="contained"
                                                    >
                                                        {processData.isToBeSentToClerk ? (
                                                            "SEND TO CLERK"
                                                        ) : approveLoading ? (
                                                            <CircularProgress size={20} />
                                                        ) : (
                                                            "Approve"
                                                        )}
                                                    </Button>
                                                </Stack>
                                            )}
                                    </Box>
                                </Stack>
                                {processData.processWorkFlow === workflowFollow ? (
                                    <Stack alignItems="center" m={2}>
                                        {processData?.workFlow[0].user !== username &&
                                            !processData.completed &&
                                            work === "" &&
                                            processData?.workFlow[processData.workFlow.length - 1]
                                                .user !== username &&
                                            processData?.workFlow
                                                .map((item) => item.user)
                                                .includes(username) && (
                                                <Button
                                                    variant="outlined"
                                                    color="success"
                                                    onClick={() => setIsCompleteModalOpen(true)}
                                                >
                                                    complete this process here
                                                </Button>
                                            )}
                                    </Stack>
                                ) : null}
                                {currentUserData &&
                                    processData?.completed &&
                                    processData.isHead ? (
                                    <Stack alignItems="center" m={2}>
                                        <Button
                                            onClick={() => setOpenC(true)}
                                            size="medium"
                                            variant="contained"
                                        >
                                            SEND TO CLERK
                                        </Button>
                                    </Stack>
                                ) : null}
                                {processData?.completed &&
                                    processData?.workFlow[0]?.user === username ? (
                                    <Stack alignItems="center" m={2}>
                                        <Button
                                            onClick={() => setOpenE(true)}
                                            size="medium"
                                            variant="contained"
                                            color="error"
                                        >
                                            END PROCESS
                                        </Button>
                                    </Stack>
                                ) : null} */}
                                <Modal open={isCompleteModalOpen} className="create-folder-modal">
                                    <div
                                        style={{ gap: "10px", position: "relative" }}
                                        className="create-folder-modal-content-container"
                                    >
                                        {completeModalContent}
                                    </div>
                                </Modal>
                                <Modal
                                    open={rejectFileModalOpen}
                                    // onClose={CloseRejectFileModal}
                                    className={styles.modalDesign}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            gap: "10px",
                                            position: "relative",
                                            padding: "18px",
                                            borderRadius: "10px",
                                            backgroundColor: "#fff",
                                            boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                background: "lightblue",
                                                padding: "5px",
                                                mb: "10px",
                                                borderRadius: "5px",
                                            }}
                                        >
                                            <Typography variant="h6" sx={{ marginBottom: "10px" }}>
                                                Give reason why you want to reject this file!!!
                                            </Typography>
                                        </Box>
                                        <Stack
                                            alignItems="center"
                                            justifyContent="center"
                                            spacing={1}
                                            sx={{
                                                alignSelf: "center",
                                                marginBottom: "10px",
                                                width: "100%",
                                            }}
                                        >
                                            <Box sx={{ width: "100%" }}>
                                                <Typography>Reason of rejection:</Typography>
                                                <TextField
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                    onChange={(e) => setReasonOfRejection(e.target.value)}
                                                />
                                            </Box>
                                        </Stack>
                                        <Stack flexDirection="row" gap={2}>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                disabled={rejectFileLoading}
                                                onClick={() =>
                                                    handleRejectFile(processData._id, rejectFileId)
                                                }
                                            >
                                                {rejectFileLoading ? (
                                                    <CircularProgress size={20} />
                                                ) : (
                                                    " Reject File"
                                                )}
                                            </Button>
                                            <Button
                                                variant="contained"
                                                disabled={rejectFileLoading}
                                                // color="error"
                                                onClick={() => setRejectFileModalOpen(false)}
                                            >
                                                Cancel
                                            </Button>
                                        </Stack>
                                    </Box>
                                </Modal>
                                <Modal open={isModalOpen} className="create-folder-modal">
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            gap: "3px",
                                            position: "relative",
                                            padding: "20px",
                                            width: "400px",
                                            borderRadius: "10px",
                                            backgroundColor: "#f5f5f5", // Light gray background
                                            boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                                        }}
                                    >
                                        <Typography
                                            variant="h5"
                                            sx={{
                                                color: "#333",
                                                marginBottom: "10px",
                                                borderRadius: "5px",
                                                background: "lightblue",
                                                width: "100%",
                                                textAlign: "center",
                                            }}
                                        >
                                            Workflow Skip Form
                                        </Typography>
                                        <Typography>Do you want to skip any step?</Typography>
                                        <Stack
                                            direction="row"
                                            spacing={4}
                                            sx={{ marginBottom: "20px" }}
                                        >
                                            <FormControlLabel
                                                value="yes"
                                                control={
                                                    <Radio
                                                        checked={selectedOption === "yes"}
                                                        onChange={handleOptionChange}
                                                        value="yes"
                                                        name="radio-yes"
                                                    />
                                                }
                                                label={
                                                    <Typography sx={{ color: "#333" }}>Yes</Typography>
                                                }
                                            />
                                            <FormControlLabel
                                                value="no"
                                                control={
                                                    <Radio
                                                        checked={selectedOption === "no"}
                                                        onChange={handleOptionChange}
                                                        value="no"
                                                        name="radio-no"
                                                    />
                                                }
                                                label={<Typography sx={{ color: "#333" }}>No</Typography>}
                                            />
                                        </Stack>

                                        {selectedOption === "yes" && (
                                            <Stack
                                                width="100%"
                                                spacing={3}
                                                sx={{ marginBottom: "20px" }}
                                            >
                                                <Typography sx={{ color: "#333" }}>
                                                    Step Number to forward process:
                                                </Typography>
                                                <Select
                                                    value={selectedStep}
                                                    onChange={handleStepChange}
                                                    size="small"
                                                    sx={{ minWidth: "150px", color: "#333" }}
                                                >
                                                    {processData?.workFlow
                                                        .filter((item) => item.user !== username)
                                                        .filter((item) => item.step > publishCheck.step)
                                                        .map((item) => (
                                                            <MenuItem key={item.step} value={item.step}>
                                                                forward to {item.user} for {item.work}
                                                            </MenuItem>
                                                        ))}
                                                </Select>
                                            </Stack>
                                        )}

                                        <Stack
                                            direction="column"
                                            alignItems="flex-start"
                                            spacing={2}
                                            width="100%"
                                            sx={{ marginBottom: "20px" }}
                                        >
                                            <Typography sx={{ color: "#333", textAlign: "start" }}>
                                                Remarks:
                                            </Typography>
                                            <TextField
                                                multiline
                                                rows={3}
                                                variant="outlined"
                                                size="small"
                                                fullWidth
                                                onChange={(e) => setRemarks(e.target.value)}
                                            />
                                        </Stack>
                                        <Stack flexDirection="row" gap={1}>
                                            <Button
                                                variant="contained"
                                                onClick={() => handleForward(false)}
                                                disabled={forwardProcessLoading}
                                                color={forwardProcessLoading ? "inherit" : "primary"}
                                            >
                                                {forwardProcessLoading ? (
                                                    <CircularProgress size={20} />
                                                ) : (
                                                    "Forward"
                                                )}
                                            </Button>
                                            <Button
                                                variant="contained"
                                                onClick={handleModalClose}
                                                disabled={forwardProcessLoading}
                                                color="error"
                                            >
                                                Cancel
                                            </Button>
                                        </Stack>
                                    </Box>
                                </Modal>
                                <Modal open={rejectModalOpen} className={styles.modalDesign}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            gap: "10px",
                                            position: "relative",
                                            padding: "20px",
                                            borderRadius: "10px",
                                            backgroundColor: "#fff",
                                            boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                background: "lightblue",
                                                padding: "5px",
                                                mb: "10px",
                                                borderRadius: "5px",
                                            }}
                                        >
                                            <Typography variant="h6" sx={{ marginBottom: "10px" }}>
                                                Give reason to reject this process!!
                                            </Typography>
                                        </Box>
                                        <Stack
                                            alignItems="flex-start"
                                            justifyContent="center"
                                            spacing={1}
                                            sx={{
                                                alignSelf: "flex-start",
                                                marginBottom: "10px",
                                                width: "100%",
                                            }}
                                        >
                                            <Box sx={{ width: "100%" }}>
                                                <Typography>Remarks:</Typography>
                                                <TextField
                                                    multiline
                                                    variant="outlined"
                                                    size="large"
                                                    sx={{ width: "100%" }}
                                                    fullWidth
                                                    onChange={(e) => setRemarks(e.target.value)}
                                                />
                                            </Box>
                                        </Stack>
                                        <Stack flexDirection="row" gap={1}>
                                            <Button
                                                variant="contained"
                                                color={rejectProcessLoading ? "inherit" : "error"}
                                                onClick={rejectProcess}
                                            >
                                                {rejectProcessLoading ? (
                                                    <CircularProgress size={20} />
                                                ) : (
                                                    "Reject"
                                                )}
                                            </Button>
                                            <Button
                                                variant="contained"
                                                disabled={rejectProcessLoading}
                                                onClick={CloseRejectModal}
                                            >
                                                Cancel
                                            </Button>
                                        </Stack>
                                    </Box>
                                </Modal>
                                <Modal
                                    open={open}
                                    onClose={modalClose}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                >
                                    <Box sx={style}>
                                        <Typography
                                            variant="h6"
                                            sx={{ textAlign: "center", marginBottom: "10px" }}
                                        >
                                            PUBLISH DETAILS :
                                        </Typography>
                                        <Grid container spacing={4} sx={{ marginBottom: "10px" }}>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    select
                                                    label="Branch"
                                                    variant="outlined"
                                                    onChange={handleBranchChange}
                                                >
                                                    {branches
                                                        .filter((item) => item.name === "headOffice")
                                                        ?.map((branch) => (
                                                            <MenuItem
                                                                value={branch.name}
                                                                key={branch._id}
                                                                style={{
                                                                    margin: "2px",
                                                                    backgroundColor: selectedBranch?.name?.includes(
                                                                        branch.name
                                                                    )
                                                                        ? "lightblue"
                                                                        : "initial",
                                                                }}
                                                            >
                                                                {branch.name}
                                                            </MenuItem>
                                                        ))}
                                                </TextField>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Autocomplete
                                                    multiple
                                                    id="checkboxes-tags-demo"
                                                    options={(selectedBranch?.departments || [])
                                                        .filter(
                                                            (item) => !processData.name.includes(item.name)
                                                        )
                                                        .map((item) => item.name || [])}
                                                    disableCloseOnSelect
                                                    getOptionLabel={(option) => option}
                                                    renderOption={(props, option, { selected }) => (
                                                        <li {...props}>
                                                            <Checkbox
                                                                icon={
                                                                    <CheckboxOutlineBlankIcon fontSize="small" />
                                                                }
                                                                checkedIcon={<CheckboxIcon fontSize="small" />}
                                                                style={{ marginRight: 8 }}
                                                                checked={selected}
                                                            />
                                                            <ListItemText primary={option} />
                                                        </li>
                                                    )}
                                                    fullWidth
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Select Departments"
                                                            variant="outlined"
                                                        />
                                                    )}
                                                    value={selectedDepartments}
                                                    onChange={handleChange}
                                                    renderTags={(value, getTagProps) =>
                                                        value.map((option, index) => (
                                                            <Chip
                                                                variant="outlined"
                                                                label={option}
                                                                {...getTagProps({ index })}
                                                            />
                                                        ))
                                                    }
                                                />
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={selectAllCheck}
                                                            disabled={!selectedBranch}
                                                            onChange={handleSelectAll}
                                                            name="selectAllDepartments"
                                                        />
                                                    }
                                                    label="SELECT ALL DEPARTMENTS"
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    select
                                                    name="roles"
                                                    onChange={handleRoleChange}
                                                    label="select roles"
                                                    value={selectedRoles}
                                                    SelectProps={{
                                                        multiple: true,
                                                        renderValue: (selected) => selected.join(", "),
                                                    }}
                                                >
                                                    {roleList.length > 0 &&
                                                        roleList?.map((role) => (
                                                            <MenuItem
                                                                key={role}
                                                                value={role}
                                                                style={{
                                                                    margin: "2px",
                                                                    backgroundColor: selectedRoles.includes(role)
                                                                        ? "lightblue"
                                                                        : "initial",
                                                                }}
                                                            >
                                                                {role}
                                                            </MenuItem>
                                                        ))}
                                                </TextField>
                                            </Grid>
                                        </Grid>
                                        <Stack alignItems="center">
                                            <Box>
                                                <Button
                                                    variant="contained"
                                                    // color={publishLoading ? "primary" : "inherit"}
                                                    onClick={() => handlePublish("head")}
                                                >
                                                    Publish
                                                </Button>
                                            </Box>
                                        </Stack>
                                    </Box>
                                </Modal>
                                <Modal
                                    open={openComman}
                                    onClose={closeCommanModal}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                >
                                    <Box sx={style}>
                                        <Typography
                                            variant="h6"
                                            sx={{ textAlign: "center", marginBottom: "10px" }}
                                        >
                                            PUBLISH DETAILS:
                                        </Typography>
                                        <Grid container spacing={4} sx={{ marginBottom: "10px" }}>
                                            <Grid item xs={12}>
                                                <Autocomplete
                                                    multiple
                                                    id="checkboxes-tags-demo"
                                                    options={branches
                                                        .filter((item) => item.name !== "headOffice")
                                                        .filter(
                                                            (item) => !processData.name.includes(item.name)
                                                        )
                                                        .filter((item) => item.departments.length >= 0)
                                                        ?.map((branch) => branch.name)}
                                                    disableCloseOnSelect
                                                    getOptionLabel={(option) => option}
                                                    renderOption={(props, option, { selected }) => (
                                                        <li {...props}>
                                                            <Checkbox
                                                                icon={
                                                                    <CheckboxOutlineBlankIcon fontSize="small" />
                                                                }
                                                                checkedIcon={<CheckboxIcon fontSize="small" />}
                                                                style={{ marginRight: 8 }}
                                                                checked={selected}
                                                            />
                                                            <ListItemText primary={option} />
                                                        </li>
                                                    )}
                                                    fullWidth
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Select Branches"
                                                            variant="outlined"
                                                        />
                                                    )}
                                                    value={selectedBranches}
                                                    onChange={handleCommanBranchChange}
                                                    renderTags={(value, getTagProps) =>
                                                        value.map((option, index) => (
                                                            <Chip
                                                                variant="outlined"
                                                                label={option}
                                                                {...getTagProps({ index })}
                                                            />
                                                        ))
                                                    }
                                                />
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={selectAllCheckBranches}
                                                            // disabled={!selectedBranch}
                                                            onChange={handleSelectAllBranches}
                                                            name="selectAllBranches"
                                                        />
                                                    }
                                                    label="SELECT ALL BRANCHES"
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    variant="outlined"
                                                    label={"departments"}
                                                    value={"general department"}
                                                    disabled={true}
                                                ></TextField>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    select
                                                    name="roles"
                                                    onChange={handleRoleChange}
                                                    label="select roles"
                                                    value={selectedRoles}
                                                    SelectProps={{
                                                        multiple: true,
                                                        renderValue: (selected) => selected.join(", "),
                                                    }}
                                                >
                                                    {roleList.length > 0 &&
                                                        roleList?.map((role) => (
                                                            <MenuItem
                                                                key={role}
                                                                value={role}
                                                                style={{
                                                                    margin: "2px",
                                                                    backgroundColor: selectedRoles.includes(role)
                                                                        ? "lightblue"
                                                                        : "initial",
                                                                }}
                                                            >
                                                                {role}
                                                            </MenuItem>
                                                        ))}
                                                </TextField>
                                            </Grid>
                                        </Grid>
                                        <Stack alignItems="center">
                                            <Box>
                                                <Button
                                                    variant="contained"
                                                    onClick={() => handlePublish("comman")}
                                                >
                                                    publish
                                                </Button>
                                            </Box>
                                        </Stack>
                                    </Box>
                                </Modal>
                                <Menu
                                    anchorEl={anchorEl2}
                                    open={Boolean(anchorEl2)}
                                    onClose={handleCloseSignedBymenu}
                                >
                                    {signedBy?.map((item) => (
                                        <MenuItem
                                            key={item.username}
                                            onClick={handleCloseSignedBymenu}
                                        >
                                            {item.username}
                                        </MenuItem>
                                    ))}
                                </Menu>
                                <Menu
                                    anchorEl={rejectedMenu}
                                    open={Boolean(rejectedMenu)}
                                    onClose={() => setRejectedMenu(false)}
                                >
                                    <div
                                        style={{
                                            padding: "10px",
                                            maxWidth: "300px",
                                            maxHeight: "150px",
                                            overflow: "auto",
                                        }}
                                    >
                                        <strong>Rejected By:</strong> {file?.rejection?.step?.user}
                                        <br />
                                        <strong>Reason:</strong> {file?.rejection?.reason}
                                    </div>
                                </Menu>
                                <Menu
                                    anchorEl={anchorEl1}
                                    open={Boolean(anchorEl1)}
                                    onClose={handleClose}
                                    PaperProps={{ elevation: 2 }}
                                >
                                    <MenuItem
                                        disabled={itemName.split(".").pop().trim() === "zip"}
                                        sx={{ gap: "5px" }}
                                        onClick={() => {
                                            handleView(processData.documentsPath, itemName);
                                            handleClose();
                                        }}
                                    >
                                        <IconEye />
                                        View
                                    </MenuItem>
                                    <MenuItem
                                        disabled={itemName?.split(".").pop().trim() === "zip"}
                                        sx={{ gap: "5px" }}
                                        onClick={() => {
                                            handleDownload(processData?.documentsPath, itemName);
                                            handleClose();
                                        }}
                                    >
                                        <IconDownload />
                                        Download
                                    </MenuItem>
                                    {operable && username !== "admin" && (
                                        <>
                                            <MenuItem
                                                sx={{ gap: "5px" }}
                                                onClick={async () => {
                                                    await handleSignClick();
                                                }}
                                                disabled={
                                                    checkFileIsOperable() || publishCheck.work === "upload"
                                                }
                                            >
                                                <IconWritingSign />
                                                Sign
                                            </MenuItem>
                                            <MenuItem
                                                sx={{ gap: "5px" }}
                                                onClick={() => {
                                                    setRejectFileId(fileToBeOperated.details._id);
                                                    handleClose();
                                                    openRejectFileModal();
                                                }}
                                                disabled={
                                                    checkFileIsOperable() || publishCheck.work === "upload"
                                                }
                                            >
                                                <IconFileOff />
                                                Reject
                                            </MenuItem>
                                        </>
                                    )}
                                    {/* <hr /> */}
                                </Menu>
                                <Menu
                                    anchorEl={anchorEl3}
                                    open={Boolean(anchorEl3)}
                                    onClose={sampleDocMenuClose}
                                    PaperProps={{ elevation: 2 }}
                                >
                                    <MenuItem
                                        disabled={itemName.split(".").pop().trim() === "zip"}
                                        sx={{ gap: "5px" }}
                                        onClick={() => {
                                            handleView(processData.documentsPath, itemName);
                                            handleClose();
                                        }}
                                    >
                                        <IconEye />
                                        View
                                    </MenuItem>
                                    <MenuItem
                                        disabled={itemName?.split(".").pop().trim() === "zip"}
                                        sx={{ gap: "5px" }}
                                        onClick={() => {
                                            handleDownload(processData?.documentsPath, itemName);
                                            handleClose();
                                        }}
                                    >
                                        <IconDownload />
                                        Download
                                    </MenuItem>
                                </Menu>
                            </Stack>
                        </>
                    )}
                    <Dialog open={openC}>
                        <h3
                            style={{
                                textAlign: "center",
                                padding: "10px",
                                backgroundColor: "lightblue",
                                margin: "10px",
                                borderRadius: "5px",
                            }}
                        >
                            Select work
                        </h3>
                        <Box width={300} padding={1}>
                            <Typography variant="body1">Work:</Typography>
                            <FormControl fullWidth variant="outlined">
                                <Select
                                    size="small"
                                    name="work"
                                    onChange={handleWorkChange}
                                    value={selectedWork}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {works?.map((data) => (
                                        <MenuItem key={data.name} value={data.name}>
                                            {data.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        <DialogActions
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Button
                                variant="contained"
                                color={!sendLoading ? "primary" : "inherit"}
                                sx={{ width: "100px" }}
                                onClick={() => {
                                    sendToClerk(processData?.workFlowToBeFollowed);
                                }}
                            >
                                {!sendLoading ? (
                                    "SEND"
                                ) : (
                                    <CircularProgress size={20}></CircularProgress>
                                )}
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => setOpenC(false)}
                                disabled={sendLoading}
                                sx={{ width: "100px" }}
                            >
                                Cancel
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog open={openE}>
                        <DialogTitle textAlign="center">
                            Are you sure you want to end this process here?
                        </DialogTitle>
                        {deleteModalContent}
                    </Dialog>
                    {/* </Paper> */}
                </div>

                {fileView && (
                    <View
                        docu={fileView}
                        setFileView={setFileView}
                        handleViewClose={handleViewClose}
                    />
                )}
            </Stack>}
            {processData ? <div style={{
                position: 'sticky',
                bottom: 5,
                right: -10,
                zIndex: 999,
                height: "70px",
                width: '100%',
                padding: '15px',
                border: "1px solid",
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                // boxShadow: "0px -2px 5px rgba(0, 0, 0, 0.2)"
            }}>
                <Stack
                    alignItems="center"
                    flexDirection="row"
                    gap={3}
                    justifyContent="center"
                    sx={{ marginX: "10px" }}
                >
                    {processData?.workFlow[0]?.user !== username &&
                        !(
                            processData?.isHead &&
                            processData?.isToBeSentToClerk &&
                            processData?.isInterBranchProcess
                        ) &&
                        !processData?.completed &&
                        processData?.workFlow
                            .map((item) => item.user)
                            .includes(username) && (
                            <Box>
                                <Button
                                    variant="contained"
                                    color="error"
                                    sx={{ width: "110px" }}
                                    onClick={openRejectModal}
                                    disabled={
                                        processData.completed ||
                                        completeProcessLoading ||
                                        approveLoading
                                    }
                                >
                                    Reject
                                </Button>
                            </Box>
                        )}
                    <Box>
                        {processData?.workFlow[processData.workFlow.length - 1]
                            .user !== username &&
                            !processData?.isToBeSentToClerk &&
                            !processData?.isHead &&
                            work === "" &&
                            !processData.completed &&
                            processData?.workFlow
                                .map((step) => step.user)
                                .includes(username) &&
                            operable && (
                                <Button variant="contained" sx={{ width: "110px" }} onClick={openModal}>
                                    Next
                                </Button>
                            )}
                        {processData?.workFlow[processData.workFlow.length - 1]
                            .user === username &&
                            work === "" &&
                            !processData.completed &&
                            (!processData.isInterBranchProcess ||
                                (processData.isInterBranchProcess &&
                                    processData?.processWorkFlow === workFlowToBeFollowed &&
                                    processData?.workFlow
                                        .map((item) => item.user)
                                        .includes(username))) && (
                                <Button
                                    variant="contained"
                                    color="success"
                                    disabled={completeProcessLoading}
                                    sx={{ width: "110px" }}
                                    onClick={() => handleForward(false)}
                                >
                                    {completeProcessLoading ? (
                                        <CircularProgress size={20} />
                                    ) : (
                                        "Complete"
                                    )}
                                </Button>
                            )}
                    </Box>
                    {processData.isInterBranchProcess &&
                        processData?.isHead &&
                        processData?.processWorkFlow !== workFlowToBeFollowed && (
                            <Stack
                                gap={1}
                                flexDirection="row"
                                justifyContent="center"
                            >
                                <Button
                                    disabled={
                                        processData.isToBeSentToClerk
                                            ? null
                                            : approveLoading
                                    }
                                    onClick={() =>
                                        processData.isToBeSentToClerk
                                            ? setOpenC(true)
                                            : handleApprove()
                                    }
                                    size="medium"
                                    variant="contained"
                                >
                                    {processData.isToBeSentToClerk ? (
                                        "SEND TO CLERK"
                                    ) : approveLoading ? (
                                        <CircularProgress size={20} />
                                    ) : (
                                        "Approve"
                                    )}
                                </Button>
                            </Stack>
                        )}
                    {processData.processWorkFlow === workflowFollow ? (
                        <>
                            {processData?.workFlow[0].user !== username &&
                                !processData.completed &&
                                work === "" &&
                                processData?.workFlow[processData.workFlow.length - 1]
                                    .user !== username &&
                                processData?.workFlow
                                    .map((item) => item.user)
                                    .includes(username) && (
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={() => setIsCompleteModalOpen(true)}
                                    >
                                        complete process
                                    </Button>
                                )}
                        </>
                    ) : null}
                    {currentUserData &&
                        processData?.completed &&
                        processData.isHead ? (
                        <Stack alignItems="center" m={2}>
                            <Button
                                onClick={() => setOpenC(true)}
                                size="medium"
                                variant="contained"
                            >
                                SEND TO CLERK
                            </Button>
                        </Stack>
                    ) : null}
                    {processData?.completed &&
                        processData?.workFlow[0]?.user === username ? (
                        <Stack alignItems="center" m={2}>
                            <Button
                                onClick={() => setOpenE(true)}
                                size="medium"
                                variant="contained"
                                color="error"
                            >
                                END PROCESS
                            </Button>
                        </Stack>
                    ) : null}
                </Stack>
            </div> : null}
        </DefaultLayout>
    );
}
