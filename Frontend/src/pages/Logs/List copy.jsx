import React, { useEffect, useState } from "react";
import styles from "./List.module.css";
import { useQuery, useQueryClient } from "react-query";

import {
    Box,
    CircularProgress,
    Paper,
    Stack,
    TablePagination,
    TextField,
} from "@mui/material";

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
import useStoreData from "../../Store";
import sessionData from "../../Store";
import { toast } from "react-toastify";
// icons
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DefaultLayout from "../../layout/DefaultLayout";
import ComponentLoader from "../../common/Loader/ComponentLoader";

export default function Works(props) {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const queryClient = new useQueryClient();

    const { setWork } = sessionData();
    // const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    // pagination
    const [page, setPage] = useState(0);


    // logs query
    const [enableLogs, setEnableLogs] = useState(true);
    const fetchLogs = async (index) => {
        try {
            const url = backendUrl + "/getUserLogs";
            const res = await axios.post(
                url,
                { startingIndex: page * 10, pageSize: 10 },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            if (res.status === 200) {
                return res.data;
            } else {
                throw new Error("Unable to fetch logs for user");
            }
        } catch (error) {
            console.error("network error");
        }
    };
    const {
        data,
        error,
        isLoading,
        isFetching,
    } = useQuery(["userLogs", page], fetchLogs, {
        onSuccess: (newLogsData) => {
            console.log('got logs')
        },
        onError: (error) => {
            toast.error(error.message);
        },
        // retry: false,
        staleTime: 60000,
        initialDataUpdatedAt: 0,
        initialData: { worksDone: [], remaining: false },
        cacheTime: 60000,
        refetchOnMount: false,
        retry: 1,
        keepPreviousData: true,
        refetchOnReconnect: false,
        enabled: enableLogs,
        refetchOnWindowFocus: false,
    });

    const [filteredLogs, setFilteredLogs] = useState([]);
    const navigate = useNavigate();
    const handleRemoveNotification = async (id) => {
        try {
            const url =
                process.env.REACT_APP_BACKEND_URL + `/removeProcessNotification/${id}`;
            const res = await axios.post(url, null, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
        } catch (error) {
            console.error("error", error);
        }
    };
    const handleLogView = (row) => {
        navigate(
            `/processes/logs/view?data=${encodeURIComponent(JSON.stringify(row._id))}`
        );
    };
    // paginations
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const handleChangePage = async (event, newPage) => {
        setPage(newPage);
    };
    useEffect(() => {
        const filteredLogsResult = data?.worksDone?.filter((item) =>
            item.processName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredLogs(filteredLogsResult);
    }, [searchTerm])
    useEffect(() => {
        setFilteredLogs(data?.worksDone);
    }, [data])
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
                                <TableCell sx={{ fontWeight: 700 }}>Time</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>your work</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredLogs
                                .map((row, index) => (
                                    <TableRow key={index} className={styles.tableRow}>
                                        <TableCell className={styles.cell}>
                                            {index + 1}
                                        </TableCell>
                                        <TableCell className={styles.cell}>
                                            {row.processName}
                                        </TableCell>
                                        <TableCell className={styles.cell}>
                                            {moment(row.time).format("DD-MMM-YYYY hh:mm A")}
                                        </TableCell>
                                        <TableCell className={styles.cell}>
                                            {row.currentStep.work}
                                        </TableCell>
                                        <TableCell className={styles.cell}>
                                            <Button
                                                onClick={() => {
                                                    handleLogView(row);
                                                }}
                                            >
                                                View Details
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            {filteredLogs?.length === 0 && (
                                <TableRow className={styles.tableRow}>
                                    <TableCell colSpan={4} className={styles.cell}>
                                        No logs
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Stack justifyContent="flex-end" gap={1} flexDirection="row" alignItems="center">
                    <Button disabled={page === 0} onClick={() => setPage(page - 1)}>Prev</Button>
                    <h3>{page + 1}</h3>
                    <Button disabled={!data?.remaining} onClick={() => setPage(page + 1)}>Next</Button>
                </Stack></>}
        </DefaultLayout>
    )
}