import React, { useEffect, useState } from "react";
import styles from "./ViewLog.module.css";
import { ImageConfig } from "../../config/ImageConfig";
import {
    Typography,
    Table,
    TableContainer,
    TableBody,
    TableRow,
    TableCell,
    Stack,
    Box,
    CircularProgress,
    IconButton,
    Menu,
    MenuItem,
    Button,
    MenuList,
    Tooltip,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import moment from "moment";
import axios from "axios";
import { IconBan, IconDownload, IconEye } from "@tabler/icons-react";
import { download } from "../../components/drop-file-input/FileUploadDownload";
import View from "../view/View";
import { toast } from "react-toastify";
import DefaultLayout from "../../layout/DefaultLayout";
import ComponentLoader from "../../common/Loader/ComponentLoader";

export default function ViewLog(props) {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const encodedData = params.get("data");
    const ID = JSON.parse(decodeURIComponent(encodedData));
    const [Data, setData] = useState();
    const [loading, setLoading] = useState(true);
    const [itemName, setItemName] = useState("");
    const [anchorEl1, setAnchorEl1] = useState(null);
    const [anchorEl2, setAnchorEl2] = useState(null);
    const [fileView, setFileView] = useState();

    const getFilePath = (path) => {
        const x_file_path = ".." + path.substring(19);

        // Finding the index of the last occurrence of '/'
        const lastIndex = x_file_path.lastIndexOf("/");

        // Extracting the substring before the last '/'
        const result =
            lastIndex !== -1 ? x_file_path.substring(0, lastIndex) : x_file_path;

        return result; // Output: ../EST
    };
    const handleClose = () => {
        setAnchorEl1(null);
    };
    const [filePath, setFilePath] = useState();
    const [signedBy, setSignedBy] = useState([]);
    const handleClick1 = (event, name, path, sign) => {
        setItemName(name);
        setAnchorEl1(event.currentTarget);
        setFilePath(path);
        setSignedBy(sign);
    };
    const handleCloseSignedBymenu = () => {
        setAnchorEl2(null);
    };
    const handleOpenSignedByMenu = (e) => {
        setAnchorEl2(e.currentTarget);
    };
    const handleView = async (path, name) => {
        setLoading(true);
        try {
            const filePath = getFilePath(path);
            const fileData = await download(name, filePath, true);
            if (fileData) {
                setFileView({ url: fileData.data, type: fileData.fileType });
                setLoading(false);
            } else {
                console.error("Invalid fileData:", fileData);
                alert("Invalid file data.");
                setLoading(false);
            }
        } catch (error) {
            console.error("Error viewing file:", error);
            alert("Unable to view the file.");
            setLoading(false);
        }
        handleClose();
    };
    const handleViewClose = () => {
        setFileView(null);
    };
    const handleDownload = (path, name) => {
        const filePath = getFilePath(path);
        try {
            download(name, filePath);
        } catch (error) {
            console.error("Error downloading file:", error);
            toast.error("download error");
        }
        handleClose();
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
    useEffect(() => {
        const fetchLogDetails = async () => {
            const url = backendUrl + `/getUserLog/${ID}`;
            const res = await axios.post(url, null, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            if (res.status === 200) {
                setData(res.data.log);
            }
            setLoading(false);
        };
        fetchLogDetails();
    }, []);
    return (
        <DefaultLayout>
            {loading ? <ComponentLoader /> : <Stack flexDirection="row">
                <div
                    style={{
                        width: "100%",
                        padding: "15px",
                        maxHeight: "fit-content",
                        position: "relative",
                        backgroundColor: "white",
                    }}
                >
                    {Data && (
                        <Box>
                            <TableContainer sx={{ border: "1px solid #ebe3e3" }}>
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>
                                                <Typography variant="subtitle1">
                                                    <b>Process Name:</b>
                                                </Typography>
                                            </TableCell>
                                            <TableCell>{Data.processName}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                <Typography variant="subtitle1">
                                                    <b>Time:</b>
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                {moment(Data.time).format("DD-MM-YYYY, h:mm:ss a")}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                <Typography variant="subtitle1">
                                                    <b>Reverted:</b>
                                                </Typography>
                                            </TableCell>
                                            <TableCell>{Data.reverted ? "Yes" : "No"}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                <Typography variant="subtitle1">
                                                    <b>Your Details</b>
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <b>Work:</b> {Data?.currentStep?.work}
                                                <br /> <b>User:</b> {Data?.currentStep?.user}
                                                <br />
                                                <b>Role:</b> {Data?.currentStep?.role}
                                                <br />
                                                <b> Step Number:</b> {Data?.currentStep?.step}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                <Typography variant="subtitle1">
                                                    <b>Next Step:</b>
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <b>Work:</b> {Data?.nextStep?.work} <br /> <b>User:</b>{" "}
                                                {Data?.nextStep?.user} <br /> <b>Role:</b>{" "}
                                                {Data?.nextStep?.role} <br />
                                                <b> Step Number:</b>{" "}
                                                {Data?.nextStep?.step
                                                    ? Data?.nextStep.step
                                                    : "No next step"}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell colSpan={2} align="center">
                                                <h3
                                                    style={{ color: Data.reverted ? "red" : "forestgreen" }}
                                                >
                                                    {Data.reverted
                                                        ? "You have reverted the process"
                                                        : Data.nextStep.user !== "N/A"
                                                            ? `You have forwarded the process to ${Data.nextStep.user} for ${Data.nextStep.work}`
                                                            : "Process is completed / ended"}
                                                </h3>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Typography variant="subtitle1" sx={{ marginX: "10px", fontWeight: 700 }}>documents : </Typography>
                            <Box sx={{ width: "99%", overflow: "auto" }}>
                                <Stack
                                    flexDirection="row"
                                    gap={1}
                                    flexWrap="wrap"
                                    justifyContent="center"
                                >
                                    {Data?.documents.map((file) => (
                                        <Box sx={{ padding: "10px" }} key={file?.details?._id}>
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
                                                <div className={styles.filePartOne}>
                                                    <div className={styles.fileHeading}>
                                                        <h5
                                                            style={{
                                                                height: "100%",
                                                                display: "flex",
                                                                alignItems: "center",
                                                            }}
                                                        >
                                                            {(
                                                                file.rejection
                                                                    ? Object.keys(file?.rejection)?.length > 0
                                                                    : null
                                                            ) ? (
                                                                <p
                                                                    style={{
                                                                        color: "red",
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                    }}
                                                                >
                                                                    <IconBan />
                                                                    Rejected
                                                                </p>
                                                            ) : file.signedBy.length === 0 ? (
                                                                <p style={{ color: "red" }}>un-signed</p>
                                                            ) : (
                                                                <Button
                                                                    onClick={handleOpenSignedByMenu}
                                                                    style={{ color: "green", zIndex: "999" }}
                                                                >
                                                                    signed
                                                                </Button>
                                                            )}
                                                        </h5>

                                                        <IconButton
                                                            onClick={(e) =>
                                                                handleClick1(
                                                                    e,
                                                                    file?.details?.name,
                                                                    file?.details.path,
                                                                    file?.signedBy
                                                                )
                                                            }
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
                                                                    ?.split(".")
                                                                    .pop()
                                                                    .toLowerCase()
                                                                ] || ImageConfig["default"]
                                                            }
                                                            alt=""
                                                        />
                                                    </div>
                                                    <div className={styles.fileNameContainer}>
                                                        <Tooltip title={file.details.name} enterDelay={900}>
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
                                                        <b>Work assigned</b> : {file?.workName}
                                                    </p>

                                                    <p className={styles.fileElements}>
                                                        <b>Cabinet no</b> : {file?.cabinetNo}
                                                    </p>
                                                    {file.rejection &&
                                                        Object.keys(file.rejection).length > 0 && (
                                                            <p style={{ padding: "3px" }}>
                                                                ● <b>Reason to reject file</b> :{" "}
                                                                {file?.rejection?.reason}
                                                            </p>
                                                        )}
                                                </div>
                                            </Stack>
                                        </Box>
                                    ))}
                                </Stack>
                            </Box>
                        </Box>
                    )}
                    <Menu
                        anchorEl={anchorEl2}
                        open={Boolean(anchorEl2)}
                        onClose={handleCloseSignedBymenu}
                        PaperProps={{ elevation: 2 }}
                    >
                        <MenuList
                            sx={{ padding: "5px", maxHeight: "200px", overflow: "auto" }}
                        >
                            <h4 style={{ textAlign: "center" }}>SIGNATURES :</h4>
                            {signedBy.map((item) => (
                                <>
                                    <MenuItem key={item.username} onClick={handleCloseSignedBymenu}>
                                        {item.username}
                                    </MenuItem>
                                </>
                            ))}
                        </MenuList>
                    </Menu>
                    <Menu
                        anchorEl={anchorEl1}
                        open={Boolean(anchorEl1)}
                        onClose={handleClose}
                        PaperProps={{ elevation: 2 }}
                    >
                        <MenuItem
                            disabled={itemName?.split(".").pop().trim() === "zip"}
                            sx={{ gap: "5px" }}
                            onClick={() => {
                                handleView(filePath, itemName);
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
                                handleDownload(filePath, itemName);
                                handleClose();
                            }}
                        >
                            <IconDownload />
                            Download
                        </MenuItem>
                        {/* <hr /> */}
                    </Menu>
                    {loading && (
                        <div
                            style={{
                                // height: "100%",
                                // width: "100%",
                                // display: "flex",
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                            }}
                        >
                            <CircularProgress color="inherit" size={30} />
                        </div>
                    )}
                    {fileView && (
                        <View
                            docu={fileView}
                            setFileView={setFileView}
                            handleViewClose={handleViewClose}
                        />
                    )}
                </div>
            </Stack>}
        </DefaultLayout>
    );
}
