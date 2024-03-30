import React, { useEffect, useState } from "react";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import Typography from "@mui/material/Typography";
import styles from "./index.module.css";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Step,
  StepLabel,
  Stepper,
} from "@mui/material";
import axios from "axios";
import moment from "moment";
import { useLocation } from "react-router-dom";
import {
  IconAlertTriangleFilled,
  IconArrowRight,
  IconDiscountCheckFilled,
} from "@tabler/icons-react";
import { Button } from "@mui/material";
import { download } from "../../../components/drop-file-input/FileUploadDownload";
import View from "../../view/View";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import DefaultLayout from "../../../layout/DefaultLayout";
import ComponentLoader from "../../../common/Loader/ComponentLoader";
const accessToken = localStorage.getItem("accessToken");

const index = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const d = params.get("data");
  const processName = decodeURIComponent(d);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [fileView, setFileView] = useState();

  const handleViewClose = () => {
    setFileView(null);
  };
  const handleView = async (path, name) => {
    setLoading(true);
    try {
      const fileData = await download(name, path, true);
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
  };
  useEffect(() => {
    const getProcessData = async () => {
      const url = backendUrl + "/getProcessHistory";
      try {
        const res = await axios.post(
          url,
          { processName: processName },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        setData(res.data);
      } catch (error) {
        console.error("error", error);
        setData({});
      }
      setLoading(false);
    };
    getProcessData();
  }, []);
  return (
    <DefaultLayout>
      {loading ? <ComponentLoader /> : <Stack flexDirection="row" sx={{ background: "white", p: 1 }}>
        <div
          style={{
            width: "100%",
            maxHeight: "fit-content",
            position: "relative",
          }}
        >
          {!loading && (
            <>
              <Box sx={{ width: "100%", my: 2 }}>
                <Stepper activeStep={data?.lastStepDone} alternativeLabel>
                  {data?.workFlow?.map((label) => (
                    <Step
                      key={label.work}
                      sx={{
                        "& span span .Mui-completed": {
                          color: "green !important",
                        },
                        "& span span .Mui-active": {
                          color: "gray !important",
                        },
                      }}
                    >
                      <StepLabel>{label.work}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>
              {/* <Timeline
              position="alternate"
              sx={{
                padding: "10px",
                m: 2,
              }}
            >
              {data.historyDetails.map((item, index) => (
                <TimelineItem key={index}>
                  <TimelineOppositeContent
                    sx={{ m: "auto 0" }}
                    variant="body2"
                    color="text.secondary"
                  >
                    {moment(item.Date).format("DD-MM-YYYY hh:mm")}
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineConnector />
                    {item.isReverted ? (
                      <IconAlertTriangleFilled
                        style={{ color: "red", margin: "5px 0" }}
                      />
                    ) : (
                      <IconDiscountCheckFilled
                        style={{ color: "green", margin: "5px 0px" }}
                      />
                    )}
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent sx={{ py: "12px", px: 2 }}>
                    <Card
                      sx={{
                        boxShadow: 2,
                        borderBottom: "3px solid #2196f3",
                        borderRadius: 1,
                      }}
                    >
                      <CardContent>
                        <Typography
                          variant="h6"
                          // component="span"
                          textAlign="left"
                          color={item.isReverted ? "coral" : "dodgerblue"}
                        >
                          {item.description}
                        </Typography>
                        <ol className={styles.DocList}>
                          {item.documentsInvolved.map((doc, docIndex) => (
                            <div className={styles.listItem}>
                              <li
                                key={docIndex}
                                style={{ marginTop: "10px", display: "flex" }}
                              >
                                <IconArrowRight />
                                <Stack>
                                  <Stack alignItems="flex-start">
                                    <Box>
                                      <b>Document Name: </b>
                                      {doc.documentName}
                                    </Box>
                                  </Stack>
                                  <Stack
                                    flexDirection="row"
                                    columnGap={2}
                                    flexWrap="wrap"
                                  >
                                    <Box>
                                      <b>Cabinet No:</b> {doc.cabinetNo}
                                    </Box>
                                    <Box>
                                      <b>Work Name: </b>
                                      {doc.workName}
                                    </Box>
                                    <Box>
                                      <b>Action:</b>{" "}
                                      {doc.change ? doc.change : "No-action"}
                                    </Box>
                                  </Stack>
                                </Stack>
                              </li>
                              <Button
                                onClick={() =>
                                  handleView(
                                    data?.documentsPath,
                                    doc.documentName
                                  )
                                }
                              >
                                view
                              </Button>
                            </div>
                          ))}
                        </ol>
                        {item.publishedTo.length > 0 && (
                          <>
                            <h4
                              style={{
                                marginTop: "10px",
                                display: "inline-block",
                                color: "green",
                              }}
                            >
                              Published To -
                            </h4>{" "}
                            <p style={{ display: "inline-block" }}>
                              {item.publishedTo.join(", ")}
                            </p>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline> */}
              <VerticalTimeline
                lineColor="lightgray"
              // style={{ maxWidth: "100%", padding: "10px" }}
              >
                {data?.historyDetails?.map((item, index) => (
                  <VerticalTimelineElement
                    key={index}
                    date={moment(item.Date).format("DD-MM-YYYY hh:mm")}
                    contentStyle={{
                      padding: "8px",
                      borderBottom: "3px solid #2196f3",
                      boxShadow:
                        "rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px",
                    }}
                    contentArrowStyle={{
                      borderRight: "8px solid  #757575",
                      height: "12px",
                    }}
                    iconStyle={{
                      background: item.isReverted ? "red" : "green",
                      color: "#fff",
                    }}
                    style={{ boxShadow: "none", padding: "0px" }}
                    icon={
                      item.isReverted ? (
                        <IconAlertTriangleFilled />
                      ) : (
                        <IconDiscountCheckFilled />
                      )
                    }
                  >
                    <Typography
                      variant="h6"
                      textAlign="left"
                      color={item.isReverted ? "coral" : "dodgerblue"}
                    >
                      {item.description}
                    </Typography>
                    <ol className={styles.DocList}>
                      {item.documentsInvolved.map((doc, docIndex) => (
                        <div className={styles.listDiv} key={docIndex}>
                          <li className={styles.listItem}>
                            <Stack>
                              <Stack alignItems="flex-start">
                                <Box>
                                  <b>Document Name: </b>
                                  {doc.documentName}
                                </Box>
                              </Stack>
                              <Stack
                                flexDirection="row"
                                columnGap={2}
                                flexWrap="wrap"
                              >
                                <Box>
                                  <b>Cabinet No:</b> {doc.cabinetNo}
                                </Box>
                                <Box>
                                  <b>Work Name: </b>
                                  {doc.workName}
                                </Box>
                                <Box>
                                  <b>Action:</b>{" "}
                                  {doc.change ? doc.change : "No-action"}
                                </Box>
                              </Stack>
                            </Stack>
                            <Button
                              onClick={() =>
                                handleView(data?.documentsPath, doc.documentName)
                              }
                            >
                              view
                            </Button>
                          </li>
                        </div>
                      ))}
                    </ol>
                    {item.publishedTo.length > 0 && (
                      <>
                        <h4
                          style={{
                            marginTop: "10px",
                            display: "inline-block",
                            color: "green",
                          }}
                        >
                          Published To -
                        </h4>{" "}
                        <p style={{ display: "inline-block" }}>
                          {item.publishedTo.join(", ")}
                        </p>
                      </>
                    )}
                  </VerticalTimelineElement>
                ))}
              </VerticalTimeline>
            </>
          )}
        </div>
        {fileView && (
          <View
            docu={fileView}
            setFileView={setFileView}
            handleViewClose={handleViewClose}
          />
        )}
      </Stack>}
    </DefaultLayout>
  );
};

export default index;
