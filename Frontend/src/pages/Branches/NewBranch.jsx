import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    Grid,
    MenuItem,
    Paper,
    Select,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
// import { useHistory } from 'react-router-dom';
import axios from "axios";
// import NavBar from "../Home/NavBar/NavBar";
import { Link } from "react-router-dom";
// import Sidedrawer from "../drawer/Sidedrawer";
import { toast } from "react-toastify";
import DefaultLayout from "../../layout/DefaultLayout";
// import useStoreData, { sessionData } from "../../Store";

const NewBranch = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { id } = useParams();
    console.log(id)
    const [editObject, setEditObject] = useState({});
    const [formData, setFormData] = useState({
        code: 0,
        name: "",
        status: "",
    });
    const getId = (obj) => {
        return;
    };


    console.log(formData);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const navigate = useNavigate();
    // ...
    const [loading, setLoading] = useState(false);
    async function handleSubmit(editId) {
        if (!formData.code >= 0 || !formData.name || !formData.status) {
            toast.info("Please fill all details");
            return;
        }
        setLoading(true);
        console.log(editId + "id");
        try {
            const url =
                process.env.REACT_APP_BACKEND_URL +
                (Object.keys(editObject).length > 0
                    ? `/editBranch/${editId}`
                    : "/createBranch");
            const accessToken = localStorage.getItem("accessToken");
            const response = await axios.post(url, formData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (response.status === 200) {
                Object.keys(editObject).length > 0
                    ? toast.success("Branch is edited")
                    : toast.success("Branch is created");
                setEditObject({});
                setLoading(false);
                navigate("/Branches");
                setFormData({
                    code: 0,
                    name: "",
                    // totalCreditSourcingOfficer: 0,
                    // totalCreditProcessingOfficer: 0,
                    // totalCreditUnderWritingOfficer: 0,
                    // totalCreditDeviationOfficer: 0,
                    status: "",
                });
            } else {
                setLoading(false);
                toast.error("Error");
            }
        } catch (error) {
            setLoading(false);
            toast.error("Something went wrong");
        }
    }
    const getEditDetails = async () => {
        setLoading(true);
        try {
            const url = backendUrl + `/getBranch/${id}`
            const res = await axios.post(url, null, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            })
            if (res.status === 200) {
                setEditObject(res.data);
                setFormData(res.data);
            }
        } catch (error) {
            console.error(error.message);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        if (id) {
            getEditDetails();
        }
    }, [])
    return (
        <DefaultLayout>
            <Stack flexDirection="row">
                <div
                    style={{
                        width: "100%",
                        maxHeight: "fit-content",
                    }}
                >
                    {/* <Stack
                        alignItems="center"
                        sx={{
                            // mx: 1,
                            borderRadius: "10px",
                            width: { xs: "300px" },
                            mx: "auto",
                        }}
                    >
                        <Typography
                            variant="h4"
                            component="span"
                            gutterBottom
                            sx={{
                                textAlign: "center",
                                width: 270,
                                height: 35,
                                fontWeight: 700,
                                borderRadius: "10px",
                                m: "5px",
                                // color: "lightblue",
                            }}
                        >
                            Branch Details
                        </Typography>
                    </Stack> */}
                    <Stack alignItems="center" m="20px 0" gap={5}>
                        <Box>
                            <Typography variant="body1">Branch code :</Typography>
                            <TextField
                                variant="outlined"
                                // label="Branch Code"
                                type="number"
                                name="code"
                                inputProps={{ min: "0" }}
                                value={formData?.code}
                                onChange={handleInputChange}
                                sx={{ backgroundColor: "white", width: "350px" }}
                            />
                        </Box>
                        <Box>
                            <Typography variant="body1">Brach Name :</Typography>
                            <TextField
                                variant="outlined"
                                // label="Branch Name"
                                name="name"
                                value={formData?.name}
                                onChange={handleInputChange}
                                sx={{ backgroundColor: "white", width: "350px" }}
                            />
                        </Box>
                        <Box>
                            <Typography variant="body1">status :</Typography>
                            <FormControl fullWidth variant="outlined">
                                <Select
                                    // label="Status"
                                    name="status"
                                    value={formData?.status}
                                    onChange={handleInputChange}
                                    sx={{ backgroundColor: "white", width: "350px" }}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value="Active">Active</MenuItem>
                                    <MenuItem value="Deactive">Deactive</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        <Stack>
                            <Stack spacing={2} direction="row" justifyContent="center">
                                <Button
                                    variant="contained"
                                    color="success"
                                    disabled={loading}
                                    onClick={() =>
                                        Object.keys(editObject).length > 0
                                            ? handleSubmit(editObject._id)
                                            : handleSubmit()
                                    }
                                >
                                    {Object.keys(editObject).length > 0 ? "update" : "Save"}
                                </Button>
                                <Link to="/branches/list">
                                    <Button variant="contained" color="error" disabled={loading}>
                                        Cancel
                                    </Button>
                                </Link>
                            </Stack>
                        </Stack>
                    </Stack>
                    {loading && (
                        <Stack
                            justifyContent="center"
                            alignItems="center"
                            sx={{ width: "100%", m: 1 }}
                        >
                            <CircularProgress color="inherit" size={30} />
                        </Stack>
                    )}
                    {/* </Paper> */}
                    {/* </Box> */}
                </div>
            </Stack>
        </DefaultLayout>
    );
};
export default NewBranch;
