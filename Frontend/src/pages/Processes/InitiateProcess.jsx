import * as React from "react";
import {
  Box,
  Button,
  Fab,
  Grid,
  Paper,
  Stack,
  TextField,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Modal,
  FormControlLabel,
  Radio,
  MenuItem,
  CircularProgress,
  Select,
  Alert,
  AlertTitle,
  Chip,
} from "@mui/material";
import styles from "./InitiateProcess.module.css";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import { Typography } from "@mui/material";
import { useState } from "react";
import { useRef } from "react";
import { upload } from "../../components/drop-file-input/FileUploadDownload";
import { useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { InfoOutlined } from "@mui/icons-material";
import { toast } from "react-toastify";

export default function LabelBottomNavigation(props) {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [workNameError, setWorkNameError] = useState("");
  const [cabinetNoError, setCabinetNoError] = useState("");
  const [fileInputError, setFileInputError] = useState("");
  const [fileData, setFileData] = useState([]);
  const [workName, setWorkName] = useState("");
  const [cabinetNo, setCabinetNo] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStep, setSelectedStep] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const urlData = params.get("data");
  const decodedObject = decodeURIComponent(urlData);
  const [pathList, setPathList] = useState([]);
  const [remarks, setRemarks] = useState();
  const [loading, setLoading] = useState(false);
  const [initiateProcessLoading, setInitiateProcessLoading] = useState(false);
  const [pathDetails, setPathDetails] = useState({ path: "", folderName: "" });
  // const [selectedDepartment, setSelectedDepartment] = useState(
  //   JSON.parse(decodedObject)
  // );
  // const {
  //   selectedDepartment,
  //   workFlow,
  //   connectors,
  //   setSelectedDepartment,
  //   setWorkFlow,
  //   setConnectors,
  // } = sessionData();
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
  const navigate = useNavigate();
  const addProcess = async (finalData, departmentPath) => {
    try {
      const url = backendUrl + "/addProcess";
      const res = await axios.post(
        url,
        {
          workFlow: props.workFlow,
          connectors: props.connectors,
          isInterBranchProcess: props.interBranch,
          remarks: remarks,
          documents: finalData,
          initiatorDepartment: props.initiatorDepartment,
          documentsPath: departmentPath,
          isHeadofficeIncluded: props.isHeadofficeIncluded,
          departmentName: props.selectedDepartment.department,
          ...(selectedStep ? { nextStepNumber: selectedStep } : {}),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      if (res.status === 200) {
        toast.success("Process is initiated");
        navigate("/processes/work");
        props.setWorkFlow("");
        props.setConnectors([]);
        props.setSelectedDepartment({});
      }
    } catch (error) {
      toast.error("Unable to initiate process");
    }
    setInitiateProcessLoading(false);
    modalClose();
  };
  const createFolder = async (department) => {
    try {
      // let path = pathDetails.path
      //   ? pathDetails.folderName
      //     ? `${pathDetails.path}/${pathDetails.folderName}`
      //     : pathDetails.path
      //   : `../${department}`;

      let path = `${pathDetails.path}/${pathDetails.folderName}`;
      const response = await axios.post(
        backendUrl + "/createFolder",
        {
          path: path,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      return path;
    } catch (error) {
      console.error("unable to create folder at given path");
    }
  };

  const setLoadingTrue = () => {
    setLoading(true);
  };

  const setLoadingFalse = () => {
    setLoading(false);
  };

  const handleInitiat = async () => {
    setInitiateProcessLoading(true);
    const url = backendUrl + "/getProcessDocumentName";
    const filelist = fileData.map((item) => item.file);
    const dummy = () => { };
    let finalData = [];
    try {
      let department;
      if (props.selectedDepartment.branch === "headOffice") {
        const [, outputString] =
          props.selectedDepartment.department.split("headOffice_");
        department = outputString;
      } else {
        department = props.selectedDepartment.branch;
      }
      let path = `../${department}`;
      if (pathDetails.path && pathDetails.folderName) {
        path = await createFolder();
      } else if (pathDetails.path) {
        path = pathDetails.path;
      } else {
        path = `../${department}`;
      }
      for (let i = 0; i < fileData.length; i++) {
        let res = await axios.post(
          url,
          {
            department: department,
            workName: fileData[i].workName,
            cabinetNo: fileData[i].cabinetNo,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        if (res.status !== 200) {
          setInitiateProcessLoading(false);
          toast.error("Not able to generate document name");
          return;
        }

        let ext = filelist[i].name.split(".").pop();
        // console.log(path + " path after all");
        // return
        try {
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
        } catch (error) {
          console.log(error);
          // console.error(error);
          toast.error(
            error?.response?.data?.message || "Document upload error"
          );
          setInitiateProcessLoading(false);
          return;
        }
      }
      await addProcess(finalData, path);
      setFileData([]);
    } catch (error) {
      alert("Unable to initiate process");
    }
    setLoadingFalse();
  };
  // modal for skip
  const openModal = () => {
    setModalOpen(true);
  };
  const modalClose = () => {
    setModalOpen(false);
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
  const handleDeleteFile = (index) => {
    if (index >= 0 && index < fileData.length) {
      const updatedFileData = [...fileData];
      updatedFileData.splice(index, 1);
      setFileData(updatedFileData);
    } else {
      console.log("Invalid index provided");
    }
  };
  const handlePathDetailsChange = (e) => {
    setPathDetails({
      ...pathDetails,
      [e.target.name]: e.target.value,
    });
  };
  useEffect(() => {
    const getPath = async () => {
      try {
        let department;
        if (props.selectedDepartment.branch === "headOffice") {
          const [, outputString] =
            props.selectedDepartment.department.split("headOffice_");
          department = outputString;
        } else {
          department = props.selectedDepartment.branch;
        }
        const getPathUrl =
          backendUrl + "/getDocumentChildren";
        const res = await axios.post(
          getPathUrl,
          {
            path: `../${department}`,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        setPathList(res.data.children);
      } catch (error) {
        alert("something is wrong");
      }
    };
    getPath();
  }, []);
  const username = localStorage.getItem("username");
  return (
    <Stack>
      <div
        style={{ width: "100%" }}
      >
        <Stack alignItems="center" sx={{ margin: "5px", gap: "1px" }}>
          <Box
            sx={{
              padding: "5px",
              width: "100%",
              maxWidth: "600px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Grid container spacing={3} sx={{ marginBottom: "20px" }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="File Path"
                  name="path"
                  select
                  value={pathDetails.path}
                  onChange={(e) => handlePathDetailsChange(e)}
                  sx={{ mb: 2, backgroundColor: "white" }}
                >
                  {pathList?.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Folder Name"
                  name="folderName"
                  value={pathDetails.folderName}
                  disabled={!pathDetails.path}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    const isValidInput = /^[a-zA-Z0-9_\-()\[\]\s]*$/.test(
                      inputValue
                    );

                    if (isValidInput || inputValue === "") {
                      handlePathDetailsChange(e);
                    }
                  }}
                  // helperText="Field must contain only letters, numbers, and spaces."
                  sx={{ mb: 2, backgroundColor: "white" }}
                />
              </Grid>
              <Grid item xs={12}>
                <h4 style={{ textAlign: "center", color: "red" }}>
                  The documents save location is{" "}
                  {pathDetails.path
                    ? pathDetails.folderName
                      ? `${pathDetails.path}/${pathDetails.folderName}`
                      : `${pathDetails.path}`
                    : `/${props?.selectedDepartment?.branch?.toLowerCase() ===
                      "headoffice"
                      ? props?.selectedDepartment?.department?.split("_")[1]
                      : props?.selectedDepartment?.branch
                    }`}
                </h4>
              </Grid>
            </Grid>
            <Typography variant="h6" sx={{ mb: 0.5, textAlign: "center" }}>
              Add Files
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              label="Work Name"
              value={workName}
              error={!!workNameError}
              // helperText={workNameError}
              onChange={(e) => {
                const inputValue = e.target.value;
                const isValidInput = /^[a-zA-Z0-9\s]*$/.test(inputValue);

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
              // helperText={cabinetNoError}
              onChange={(e) => setCabinetNo(e.target.value)}
              sx={{ mb: 2, backgroundColor: "white" }}
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
                  Only the following file types are allowed for upload :
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
              <Button variant="outlined" onClick={handleFileAdd} sx={{ mt: 2 }}>
                Add File
              </Button>
            </Box>
          </Box>
          <TableContainer
            component={Paper}
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
                        <IconButton onClick={() => handleDeleteFile(index)}>
                          <DeleteOutlineIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Modal open={modalOpen} className="create-folder-modal">
            <div
              style={{ gap: "10px", position: "relative" }}
              className="create-folder-modal-content-container"
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    color: "#333",
                    marginBottom: "10px",
                    background: "lightblue",
                    width: "100%",
                    textAlign: "center",
                    borderRadius: "10px",
                  }}
                >
                  Workflow Step Skip
                </Typography>
                <p style={{ fontSize: "18px", marginBottom: "10px" }}>
                  do you want to skip any step from work flow?
                </p>
                <Stack
                  flexDirection="row"
                  gap={4}
                  sx={{ marginBottom: "10px" }}
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
                    label="Yes"
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
                    label="No"
                  />
                </Stack>
                {selectedOption === "yes" && (
                  <Stack width="100%" spacing={3} sx={{ marginBottom: "20px" }}>
                    <Typography sx={{ color: "#333" }}>
                      Step Number to forward process:
                    </Typography>
                    <Select
                      value={selectedStep}
                      onChange={handleStepChange}
                      size="small"
                      sx={{ minWidth: "150px", color: "#333" }}
                    >
                      {props.selectedDepartment.workFlow
                        .filter((item) => !item.users.some(user => user.user === username))
                        .map((item) => (
                          <MenuItem key={item.step} value={item.step}>
                            forward for work {item.work} to step no {item.step}
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
                    variant="outlined"
                    size="small"
                    multiline
                    rows={3}
                    fullWidth
                    onChange={(e) => setRemarks(e.target.value)}
                  />
                </Stack>
                <Stack gap={1} flexDirection="row">
                  <Button
                    variant="contained"
                    onClick={handleInitiat}
                    disabled={initiateProcessLoading}
                    color={initiateProcessLoading ? "inherit" : "primary"}
                  >
                    {initiateProcessLoading ? (
                      <CircularProgress size={20} />
                    ) : (
                      "Initiate"
                    )}
                  </Button>
                  <Button
                    variant="contained"
                    onClick={modalClose}
                    color="error"
                    disabled={initiateProcessLoading}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Box>
            </div>
          </Modal>
          {fileData.length > 0 && (
            <Button
              variant="contained"
              onClick={
                props.interBranch && !props.isHeadofficeIncluded
                  ? handleInitiat
                  : openModal
              }
              disabled={initiateProcessLoading}
              sx={{ marginTop: "15px" }}
            >
              {/*  */}
              {props.interBranch && !props.isHeadofficeIncluded ? (
                initiateProcessLoading ? (
                  <CircularProgress size={20} />
                ) : (
                  "Initiate"
                )
              ) : (
                "Next"
              )}
            </Button>
          )}
        </Stack>
        {/* </Paper> */}
        {loading && (
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              zIndex: "500",
            }}
          >
            <CircularProgress color="inherit" size={30} />
          </div>
        )}
      </div>
    </Stack >
  );
}
