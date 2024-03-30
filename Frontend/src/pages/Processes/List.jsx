import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";

import {
    Box,
    CircularProgress,
    Fab,
    Paper,
    Stack,
    TablePagination,
    TextField,
} from "@mui/material";
import styles from './List.module.css'
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import moment from "moment";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import sessionData from "../../Store";
// import useStoreData from "../../Store";
// import { sessionData } from "../../Store";
import { toast } from "react-toastify";
// icons
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DefaultLayout from "../../layout/DefaultLayout";
import ComponentLoader from "../../common/Loader/ComponentLoader";
export default function List() {
    const { setWork } = sessionData();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const queryClient = new useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");
    const [page1, setPage1] = useState(0);
    // const [enableProcessFetch, setEnableProcessFetch] = useState(true);
    const fetchProcesses = async () => {
        const url = backendUrl + "/getProcessesForUser";
        console.log(url);

        const res = await axios.post(
            url,
            {
                startingIndex: page1 * 10, // Use the length of the current data as the starting index
                pageSize: 10,
                forPublishedProcesses: false,
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            }
        );

        if (res.status === 200) {
            return res.data;
        } else {
            throw new Error("Unable to fetch process for user");
        }
    };
    const { data, error, isLoading, isFetching, status } = useQuery(
        ["pendingProcesses", page1],
        fetchProcesses,
        {
            onError: (error) => {
                toast.error(error.message);
            },
            // retry: 1,
            // enabled: enableProcessFetch,
            staleTime: 60000,
            initialData: { processes: [], remaining: false },
            initialDataUpdatedAt: 0,
            cacheTime: 60000,
            refetchOnMount: false,
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
        }
    );
    const [filteredData, setFilteredData] = useState([]);
    const navigate = useNavigate();
    const handleRemoveNotification = async (id) => {
        try {
            const url =
                backendUrl + `/removeProcessNotification/${id}`;
            const res = await axios.post(url, null, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
        } catch (error) {
            console.error("error", error);
        }
    };
    const handleView = (id, workflow) => {
        handleRemoveNotification(id);
        navigate(
            `/processes/work/view?data=${encodeURIComponent(id)}&workflow=${encodeURIComponent(workflow)}`
        );

    };
    useEffect(() => {
        const filteredDataResult = data?.processes?.filter((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredData(filteredDataResult);
    }, [searchTerm])
    useEffect(() => {
        setFilteredData(data.processes);
    }, [data])

    // initiate process
    const [departments, setDepartments] = useState([]);
    const handlePlus = () => {
        navigate("/processes/initiate");
        // setShowButtons(true);
    };
    const handleChangePage1 = async (event, newPage) => {
        setPage1(newPage);
    };
    useEffect(() => {
        const url =
            backendUrl + "/getDepartmentForInititors";
        axios
            .post(url, null, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            })
            .then((response) => {
                if (response.status === 200) {
                    setDepartments(response.data.departments);
                }
            })
            .catch((error) => {
                // alert("something is wrong");
                console.error("error", error);
            });
    }, []);
    return (
        <DefaultLayout>
            {isFetching || isLoading ? <ComponentLoader /> : <>
                <TableContainer
                    component={Paper}
                    className={styles.tableContainer}
                >
                    <Table className={styles.table}>
                        <TableHead className={styles.tableHeader}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>Serial No</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Process Name</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Create Time</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredData
                                // ?.slice(
                                //     page1 * rowsPerPage,
                                //     page1 * rowsPerPage + rowsPerPage
                                // )
                                // .filter((row) => row.isPending === true)
                                .map((row, index) => (
                                    <TableRow key={index} className={styles.tableRow}>
                                        <TableCell className={styles.cell}>
                                            {index + 1}
                                        </TableCell>
                                        <TableCell className={styles.cell}>
                                            {row.name}
                                        </TableCell>
                                        <TableCell className={styles.cell}>
                                            {moment(row.createdAt).format(
                                                "DD-MMM-YYYY hh:mm A"
                                            )}
                                        </TableCell>
                                        <TableCell className={styles.cell}>
                                            <Button
                                                onClick={() => {
                                                    handleView(row._id, row.workFlowToBeFollowed);
                                                    setWork(row.work);
                                                }}
                                            >
                                                View
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}

                            {filteredData?.filter((row) => row.isPending === true)
                                ?.length === 0 && (
                                    <TableRow className={styles.tableRow}>
                                        <TableCell colSpan={4} className={styles.cell}>
                                            No Pending Processes
                                        </TableCell>
                                    </TableRow>
                                )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Stack justifyContent="flex-end" gap={1} flexDirection="row" alignItems="center">
                    <Button disabled={page1 === 0} onClick={() => setPage1(page1 - 1)}>Prev</Button>
                    <h3>{page1 + 1}</h3>
                    <Button disabled={!data.remaining} onClick={() => setPage1(page1 + 1)}>Next</Button>
                </Stack></>}
            {departments.length > 0 && (
                <Stack position="relative">
                    <Fab
                        color="primary"
                        onClick={handlePlus}
                        aria-label="add"
                        sx={{
                            position: "fixed",
                            bottom: "5px",
                            right: "5px",
                            height: "40px",
                            width: "40px",
                        }}
                    >
                        <AddIcon />
                    </Fab>
                </Stack>
            )}
        </DefaultLayout>
    );
}
