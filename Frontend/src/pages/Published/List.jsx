import React, { useEffect, useState } from "react";
import styles from "./List.module.css";
import { useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DefaultLayout from "../../layout/DefaultLayout";

export default function Works(props) {
    const queryClient = new useQueryClient();

    const { setWork } = sessionData();
    const [searchTerm, setSearchTerm] = useState("");
    const [remainsProcesses, setRemainProcesses] = useState(false);
    const [page, setPage] = useState(0);

    // Fetching published processes
    const [enablePublishedFetch, setEnablePublishedFetch] = useState(true);

    const fetchPublishedProcesses = async () => {
        try {
            const url = process.env.REACT_APP_BACKEND_URL + "/getProcessesForUser";
            const res = await axios.post(
                url,
                {
                    startingIndex: page * 10,
                    pageSize: 10,
                    forPublishedProcesses: true,
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
                throw new Error("Unable to fetch published processes");
            }
        } catch (error) {
            throw new Error("Network error");
        }
    };

    const { data: publishedData, error: publishedError, isLoading: publishedLoading, refetch: refetchPublished, isFetching: publishedFetching } = useQuery(["publishedProcesses", "true", page], fetchPublishedProcesses, {
        onSuccess: (data) => {
            if (filteredMessages.length <= page * 10) {
                setFilteredMessages([...filteredMessages, ...data.processes]);
                setRemainMessages(data.remaining);
            } else if (filteredMessages.length === 0) {
                setFilteredMessages(data.processes);
                setRemainMessages(data.remaining);
            }
            if (data.remaining === false) {
                setEnablePublishedFetch(false);
            }
        },
        onError: (error) => {
            toast.error(error.message);
        },
        retry: 1,
        enabled: enablePublishedFetch,
        staleTime: 60000,
        cacheTime: 60000,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
    });

    const [filteredMessages, setFilteredMessages] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const filteredMessagesResult = publishedData?.processes?.filter((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredMessages(filteredMessagesResult);
        setRemainMessages(publishedData.remaining);
    }, [searchTerm]);

    const handleChangePage = async (event, newPage) => {
        setPage(newPage);
    };

    return (
        <DefaultLayout>
            <TableContainer
                component={Paper}
                className={styles.tableContainer}
            >
                <Table className={styles.table}>
                    <TableHead className={styles.tableHeader}>
                        <TableRow>
                            <TableCell>Serial No</TableCell>
                            <TableCell>Process Name</TableCell>
                            <TableCell>Create Time</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredMessages
                            .slice(
                                page2 * rowsPerPage2,
                                page2 * rowsPerPage2 + rowsPerPage2
                            )
                            .filter((row) => row.isPending === true)
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
                                                handleView(row._id);
                                            }}
                                        >
                                            View
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}

                        {filteredMessages.filter((row) => row.isPending === true)
                            .length === 0 && (
                                <TableRow className={styles.tableRow}>
                                    <TableCell colSpan={4} className={styles.cell}>
                                        No received published processes
                                    </TableCell>
                                </TableRow>
                            )}
                    </TableBody>
                </Table>
            </TableContainer>
        </DefaultLayout>
    );
}
