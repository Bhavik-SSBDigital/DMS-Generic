import React, { useEffect, useState } from "react";
import {
    Paper,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Typography,
    Grid,
    Box,
    TextField,
    Stack,
    CircularProgress,
    Autocomplete,
} from "@mui/material";
import axios from "axios";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Filefolders from "../Filefolders/Filefolders";
import { toast } from "react-toastify";
import DefaultLayout from "../../layout/DefaultLayout";

export default function NewRole() {
    const { id } = useParams();
    // const { editObject, setEditObject } = sessionData();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [editObject, setEditObject] = useState({});
    const url = backendUrl + "/getAllBranches";
    const initialUser = {
        branch: "",
        role: "",
    };
    const [formData, setFormData] = useState({ ...initialUser });
    const [branches, setBranches] = useState([]);
    const [roles, setRoles] = useState([]);
    const [selection, setSelection] = useState({
        selectedView: [],
        selectedDownload: [],
        selectedUpload: [],
        // foldersWithFullPermission: [],
        fullAccess: [],
    });
    const getBranches = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            const { data } = await axios.post(url, null, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            setBranches(data.branches);
        } catch (error) {
            // Handle the error and show an alert
            // console.error('Error:', error);
            alert("Unable to fetch branches. Please try again.");
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const navigate = useNavigate();
    const handleSubmit = async (editId) => {
        setLoading(true);
        const url =
            backendUrl +
            (Object.keys(editObject).length > 0 ? `/editRole/${editId}` : "/AddRole");

        try {
            let combinedData = {
                ...formData,
                ...selection,
            };

            const response = await axios.post(url, combinedData);

            if (response.status === 200) {
                setEditObject({});
                Object.keys(editObject).length > 0
                    ? toast.success("Role edited")
                    : toast.success("Role created");
                navigate("/ManageRoles");
                setLoading(false);
                setFormData({ ...initialUser });
            }
        } catch (error) {
            setLoading(false);
            // Handle the error and show an alert
            console.error("Error:", error);
            Object.keys(editObject).length > 0
                ? toast.error("Error editing role")
                : toast.error("Error creating role");
        }
    };
    const [loading, setLoading] = useState(false);

    const getEditDetails = async () => {
        setLoading(true);
        try {
            const url = backendUrl + `/getRole/${id}`
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
            setLoading(false)
        }
    }
    useEffect(() => {
        if (id) {
            getEditDetails();
        }
        getBranches();
        const getRoles = async () => {
            try {
                const urlRole = backendUrl + "/getRoleNames";
                const accessToken = localStorage.getItem("accessToken");
                const { data } = await axios.post(urlRole, null, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setRoles(data.roles);
            } catch (error) {
                console.error("error", error);
            }
        };
        getRoles();
    }, []);
    return (
        <DefaultLayout>
            <Stack flexDirection="row">
                <div
                    style={{
                        width: "100%",
                    }}
                >
                    {/* <Paper elevation={2} sx={{ padding: 1, height: "100%" }}> */}
                    {/* <Stack
                        alignItems="center"
                        sx={{
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
                            Role details
                        </Typography>
                    </Stack> */}
                    <Grid container spacing={4} mt={1}>
                        <Grid item xs={12} sm={6} md={6}>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                User Branch :
                            </Typography>
                            <FormControl fullWidth variant="outlined">
                                {/* <InputLabel>User Branch</InputLabel> */}
                                <Select
                                    name="branch"
                                    sx={{ backgroundColor: 'white' }}
                                    value={formData.branch}
                                    onChange={handleInputChange}
                                // label="branch"
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {/* <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Deactive">Deactive</MenuItem> */}
                                    {branches?.map((data) => (
                                        <MenuItem value={data.name}>{data.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6}>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                User Role:
                            </Typography>
                            <Autocomplete
                                fullWidth
                                id="role"
                                sx={{ backgroundColor: "white" }}
                                options={roles}
                                freeSolo
                                value={formData.role}
                                onInputChange={(event, newValue) =>
                                    handleInputChange({
                                        target: { name: "role", value: newValue },
                                    })
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                    // onChange={handleInputChange}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Box
                                sx={{
                                    padding: "10px",
                                    maxHeight: "350px",
                                    overflow: "auto",
                                }}
                            >
                                <Typography variant="body1">select permissions :</Typography>
                                {Object.keys(editObject).length > 0 ? (
                                    <Filefolders
                                        selection={selection}
                                        setSelection={setSelection}
                                        checkShow={true}
                                        id={formData._id}
                                    />
                                ) : (
                                    <Filefolders
                                        selection={selection}
                                        setSelection={setSelection}
                                        checkShow={true}
                                        id={null}
                                    />
                                )}
                            </Box>
                        </Grid>
                        <Grid item xs={12} sx={{ textAlign: "center" }}>
                            <Button
                                variant="contained"
                                color="success"
                                disabled={loading}
                                onClick={() =>
                                    Object.keys(editObject).length > 0
                                        ? handleSubmit(editObject._id)
                                        : handleSubmit()
                                }
                                sx={{ margin: "5px" }}
                            >
                                {Object.keys(editObject).length > 0 ? "update" : "Save"}
                            </Button>
                            <Link to="/ManageRoles">
                                <Button
                                    variant="contained"
                                    color="error"
                                    disabled={loading}
                                    sx={{ margin: "5px" }}
                                >
                                    Cancel
                                </Button>
                            </Link>
                        </Grid>
                    </Grid>
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
                </div>
            </Stack>
        </DefaultLayout>
    );
}
