import React, { useEffect, useState } from "react";
import { useInfiniteQuery, useQueryClient } from "react-query";
import {
    Box,
    CircularProgress,
    Paper,
    Stack,
    TextField,
} from "@mui/material";
import styles from './List.module.css';
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
import { toast } from "react-toastify";
import DefaultLayout from "../../layout/DefaultLayout";
import ComponentLoader from "../../common/Loader/ComponentLoader";

export default function List() {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(0);

    const fetchLogs = async ({ pageParam = 0 }) => {
        const url = backendUrl + "/getUserLogs";
        const res = await axios.post(
            url,
            { startingIndex: pageParam * 10, pageSize: 10 },
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
    };

    const {
        data,
        error,
        isLoading,
        isFetching,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteQuery(
        "userLogs",
        fetchLogs,
        {
            getNextPageParam: (lastPage, allPages) => {
                return lastPage.remaining ? allPages.length : undefined;
            },
            onError: (error) => {
                toast.error(error.message);
            },
            cacheTime: 12000,
            staleTime: 12000,
        }
    );

    const filteredLogs = data ? data.pages.flatMap(page => page.worksDone).filter(item => item.processName.toLowerCase().includes(searchTerm.toLowerCase())) : [];

    const handleLogView = (row) => {
        navigate(`/processes/logs/view?data=${encodeURIComponent(JSON.stringify(row._id))}`);
    };

    const handleChangePage = (newPage) => {
        setPage(newPage);
        fetchNextPage();
    };

    useEffect(() => {
        setPage(0);
    }, [searchTerm]);


    return (
        <DefaultLayout>
            {isFetching || isLoading ? <ComponentLoader /> : (
                <>
                    <TextField
                        label="Search"
                        variant="outlined"
                        value={searchTerm}
                        size="small"
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ backgroundColor: "white", mb: "2px" }}
                        className={styles.searchInput}
                    />
                    <TableContainer component={Paper} className={styles.tableContainer}>
                        <Table className={styles.table}>
                            <TableHead className={styles.tableHeader}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 700 }}>Serial No</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Process Name</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Time</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Your Work</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredLogs.length ? filteredLogs.map((row, index) => (
                                    <TableRow key={index} className={styles.tableRow}>
                                        <TableCell className={styles.cell}>{index + 1}</TableCell>
                                        <TableCell className={styles.cell}>{row.processName}</TableCell>
                                        <TableCell className={styles.cell}>{moment(row.time).format("DD-MMM-YYYY hh:mm A")}</TableCell>
                                        <TableCell className={styles.cell}>{row.currentStep.work}</TableCell>
                                        <TableCell className={styles.cell}>
                                            <Button onClick={() => handleLogView(row)}>View Details</Button>
                                        </TableCell>
                                    </TableRow>
                                )) : <TableRow><TableCell colSpan={5}>No Data</TableCell></TableRow>}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Stack justifyContent="flex-end" gap={1} flexDirection="row" alignItems="center">
                        <Button disabled={page === 0} onClick={() => handleChangePage(page - 1)}>Prev</Button>
                        <h3>{page + 1}</h3>
                        <Button disabled={!data?.pages[page]?.remaining} onClick={() => handleChangePage(page + 1)}>Next</Button>
                    </Stack>
                </>
            )}
        </DefaultLayout>
    );
}
