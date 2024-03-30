import { useEffect, useState } from 'react';
// import CardDataStats from '../../components/CardDataStats';
import ChartOne from '../../components/Charts/ChartOne';
import ChartThree from '../../components/Charts/ChartThree';
import ChartTwo from '../../components/Charts/ChartTwo';
import DefaultLayout from '../../layout/DefaultLayout';
import moment from 'moment';
import { toast } from 'react-toastify';
import axios from 'axios';
import {
  Button,
  CircularProgress,
  Dialog,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import ChartFive from '../../components/Charts/ChartFive';
import { useNavigate } from 'react-router-dom';

const PerticularBranch = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const accessToken = localStorage.getItem('accessToken');
  // ------------------states-----------------------------
  const [branches, setBranches] = useState([]);
  const [selectedProcess, setSelectedProcess] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  // const [mainChartLoading, setMainChartLoading] = useState(false);
  const [processNameList, setProcessNameList] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  // charts option
  const [mainChartOption, setMainChartOption] = useState({});
  const [stepWiseChartOptions, setStepWiseChartOptions] = useState({});
  const [rejectedProcessChart, setRejectedProocessChart] = useState({});
  const [documentsDetailsChart, setDocumentDetailsChart] = useState({});
  const [rejectedDocCatWise, setRejectedDocCatWise] = useState({});
  // inputs
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedMainChartType, setSelectedMainChartType] = useState('weekly');
  const [mainChartLoading, setMainChartLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState('');

  const [mainChartDateRange, setMainChartDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const yearList = Array.from(
    { length: new Date().getFullYear() - new Date().getFullYear() + 7 },
    (_, index) => new Date().getFullYear() - index,
  );

  // handlers
  const handleMainChartType = (e) => {
    setSelectedMainChartType(e.target.value);
  };
  const handleSelectProcess = (event) => {
    setSelectedProcess(event.target.value);
  };
  const closeFilterDialog = () => {
    setIsFilterOpen(false);
  };
  const handleMainChartDateChange = (e) => {
    const { name, value } = e.target;
    const timestamp = new Date(value).getTime();
    setMainChartDateRange((prev) => ({ ...prev, [name]: timestamp }));
  };
  // show timeline
  const navigate = useNavigate();
  const showPerticularProcessData = (process) => {
    if (selectedProcess === null || selectedProcess === '') {
      toast.info('please select process');
      return;
    } else {
      navigate(`/dashboard/timeLine?data=${encodeURIComponent(process)}`);
    }
  };
  // get dashboard data
  const fetchBranches = async () => {
    const url = backendUrl + '/getBranchesWithDepartments';
    try {
      const accessToken = localStorage.getItem('accessToken');
      const { data } = await axios.post(url, null, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setBranches(data.branches);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const getStepWisePendingProcesses = async () => {
    if (
      !selectedBranch ||
      (selectedBranch.toLowerCase() === 'headoffice' && !selectedDepartment)
    ) {
      return;
    } else {
      let id;
      if (selectedBranch.toLowerCase() === 'headoffice') {
        const branch = branches.find(
          (item) => item.name.toLowerCase() === selectedBranch.toLowerCase(),
        );
        const department = branch.departments.find(
          (item) => item.name === selectedDepartment,
        );
        id = department._id;
      } else {
        const branch = branches.find(
          (item) => item.name.toLowerCase() === selectedBranch.toLowerCase(),
        );
        id = branch.departments[0]._id;
      }
      // setStepWiseLoading(true);
      try {
        const url = backendUrl + '/getPendingProcessCountPerStepInDepartment';
        const res = await axios.post(
          url,
          {
            department: id,
          },
          { headers: { Authorization: `Bearer ${accessToken}` } },
        );
        if (res.status === 200) {
          setStepWiseChartOptions({
            title: {
              text: 'Step wise pending processes',
              left: 'center',
            },
            toolbox: {
              feature: {
                saveAsImage: {},
              },
            },
            tooltip: {
              trigger: 'item',
              formatter: function (params) {
                const dataIndex = params.dataIndex;
                const detail = res.data.processesPerStep[dataIndex];
                return `${params.seriesName} <br/>
                    <b>Work:</b> ${detail.step.work} <br/>
                    <b>User:</b> ${detail.step.user} <br/>
                    <b>Role:</b> ${detail.step.role} <br/>
                    <b>${params.name}:</b> ${params.value} (${params.percent}%)`;
              },
            },
            legend: {
              orient: 'horizontal', // Set the orientation to horizontal
              bottom: 10, // Adjust the bottom position
            },
            series: [
              {
                name: 'Pending processes deatils',
                type: 'pie',
                radius: '50%',
                center: ['50%', '50%'],
                data: res.data.processesPerStep.map((item) => ({
                  value: item.noOfPendingProcesses,
                  name: `${item.step.work} - ${item.step.user}`,
                })),
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                  },
                },
                label: {
                  show: true,
                  position: 'outside',
                  formatter: '{b}: {c}', // Display name and value in the label
                  minShowLabelAngle: 5,
                  forceToShow: true,
                },
              },
            ],
          });
          setProcessNameList(res.data.pendingProcessNames);
        }
      } catch (error) {
        console.error(error, 'error');
      }
      // setStepWiseLoading(false);
    }
  };
  const getPerticularBranchData = async () => {
    if (!selectedBranch) {
      toast.info('Please select a branch.');
      return;
    }

    if (selectedBranch === 'headOffice' && !selectedDepartment) {
      toast.info('Please select a department.');
      return;
    }
    setMainChartLoading(true);
    let id;
    let sendData;
    if (
      selectedMainChartType === 'weekly' ||
      selectedMainChartType === 'yearly'
    ) {
      sendData = {
        duration: selectedMainChartType,
      };
    } else if (mainChartDateRange.startDate && mainChartDateRange.endDate) {
      sendData = {
        duration: selectedMainChartType,
        customDuration: {
          startDate: mainChartDateRange.startDate,
          endDate: mainChartDateRange.endDate,
        },
      };
    } else if (selectedMainChartType === 'monthly') {
      if (!selectedYear) {
        toast.info('Please select a year');
        return;
      }
      sendData = {
        duration: selectedMainChartType,
        year: selectedYear,
      };
    } else {
      toast.error('Invalid selection');
      return;
    }
    if (selectedBranch?.toLowerCase() === 'headoffice') {
      const branch = branches.find(
        (item) => item.name.toLowerCase() === selectedBranch?.toLowerCase(),
      );
      const department = branch.departments.find(
        (item) => item.name === selectedDepartment,
      );
      id = department._id;
    } else {
      const branch = branches.find(
        (item) => item.name.toLowerCase() === selectedBranch?.toLowerCase(),
      );
      id = branch.departments[0]._id;
    }
    try {
      const url = backendUrl + `/getProcessNumber`;
      const res = await axios.post(
        url,
        {
          department: id,
          ...sendData,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        },
      );
      if (res.status === 200) {
        setMainChartOption({
          series: [
            {
              name: 'Pending',
              data: res.data?.processNumberWithDuration?.map(
                (item: any) => item.pendingProcessNumber,
              ),
            },
            {
              name: 'Completed',
              data: res.data?.processNumberWithDuration?.map(
                (item: any) => item.completedProcessNumber,
              ),
            },
          ],
          chart: {
            type: 'bar',
            height: 350,
          },
          plotOptions: {
            bar: {
              horizontal: true,
              columnWidth: '55%',
              endingShape: 'rounded',
            },
          },
          dataLabels: {
            enabled: false,
          },
          stroke: {
            show: true,
            width: 2,
          },
          xaxis: {
            categories:
              res.data.processNumberWithDuration?.map((item: any) => {
                const isDate = moment(
                  item.time,
                  moment.ISO_8601,
                  true,
                ).isValid();
                return isDate && selectedMainChartType !== 'yearly'
                  ? moment(item.time).format('DD-MM-YYYY')
                  : item.time;
              }) || [],
          },
          fill: {
            opacity: 1,
          },
          tooltip: {
            y: {
              formatter: function (val) {
                return val;
              },
            },
          },
        });
        setRejectedProocessChart({
          series: [
            {
              data:
                res.data?.processNumberWithDuration?.map(
                  (item: any) => item.revertedProcessNumber || 0,
                ) || [],
            },
          ],
          chart: {
            type: 'bar',
            height: 350,
          },
          plotOptions: {
            bar: {
              borderRadius: 4,
              horizontal: false,
            },
          },
          dataLabels: {
            enabled: false,
          },
          xaxis: {
            categories:
              res.data.processNumberWithDuration?.map((item: any) => {
                const isDate = moment(
                  item.time,
                  moment.ISO_8601,
                  true,
                ).isValid();
                return isDate && selectedMainChartType !== 'yearly'
                  ? moment(item.time).format('DD-MM-YYYY')
                  : item.time;
              }) || [],
          },
        });
        setDocumentDetailsChart({
          series: Array.from(
            new Set(
              res.data.processNumberWithDuration
                .flatMap((item) =>
                  item.documentDetails.map((doc) => doc.workName),
                )
                .filter(Boolean), // Remove any falsy values
            ),
          ).map((docName) => ({
            name: docName,
            data: res.data.processNumberWithDuration.map((item: any) => {
              return (
                item.documentDetails.find(
                  (doc: any) => doc.workName === docName,
                )?.documentCount || 0
              );
            }),
          })),

          chart: {
            type: 'bar',
            height: 350,
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: '55%',
              endingShape: 'rounded',
            },
          },
          dataLabels: {
            enabled: false,
          },
          stroke: {
            show: true,
            width: 2,
            colors: ['transparent'],
          },
          xaxis: {
            categories:
              res.data.processNumberWithDuration?.map((item: any) => {
                const isDate = moment(
                  item.time,
                  moment.ISO_8601,
                  true,
                ).isValid();
                return isDate && selectedMainChartType !== 'yearly'
                  ? moment(item.time).format('DD-MM-YYYY')
                  : item.time;
              }) || [],
          },
          fill: {
            opacity: 1,
          },
          tooltip: {
            y: {
              formatter: function (val: any) {
                return val;
              },
            },
          },
        });
        setRejectedDocCatWise({
          series: Array.from(
            new Set(
              res.data.processNumberWithDuration
                .flatMap((item) =>
                  item.documentDetails.map((doc) => doc.workName),
                )
                .filter(Boolean), // Remove any falsy values
            ),
          ).map((docName) => ({
            name: docName,
            type: 'line',
            data: res.data.processNumberWithDuration.map((item) => {
              return (
                item.documentDetails.find((doc) => doc.workName === docName)
                  ?.noOfRejectedDocuments || 0
              );
            }),
          })),

          chart: {
            type: 'bar',
            height: 350,
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: '55%',
              endingShape: 'rounded',
            },
          },
          dataLabels: {
            enabled: false,
          },
          stroke: {
            show: true,
            width: 2,
            colors: ['transparent'],
          },
          xaxis: {
            categories:
              res.data.processNumberWithDuration?.map((item: any) => {
                const isDate = moment(
                  item.time,
                  moment.ISO_8601,
                  true,
                ).isValid();
                return isDate && selectedMainChartType !== 'yearly'
                  ? moment(item.time).format('DD-MM-YYYY')
                  : item.time;
              }) || [],
          },
          fill: {
            opacity: 1,
          },
          tooltip: {
            y: {
              formatter: function (val: any) {
                return val;
              },
            },
          },
        });
      }
    } catch (error) {
      toast.error('unable to fetch perticular branch data!!!');
    }
    // getStepWisePendingProcesses(id);
    setMainChartLoading(false);
  };
  const getMainChartData = async () => {
    setMainChartLoading(true);
    // setRejectedProcessesLoading(true);
    try {
      let sendData: any = {};
      if (
        selectedMainChartType === 'weekly' ||
        selectedMainChartType === 'yearly'
      ) {
        sendData = {
          duration: selectedMainChartType,
        };
      } else if (mainChartDateRange.startDate && mainChartDateRange.endDate) {
        sendData = {
          duration: selectedMainChartType,
          customDuration: {
            startDate: mainChartDateRange.startDate,
            endDate: mainChartDateRange.endDate,
          },
        };
      } else if (selectedMainChartType === 'monthly') {
        if (!selectedYear) {
          toast.info('Please select a year');
          setMainChartLoading(false);
          // setRejectedProcessesLoading(false);
          return;
        }
        sendData = {
          duration: selectedMainChartType,
          year: selectedYear,
        };
      } else {
        toast.error('Invalid selection');
        setMainChartLoading(false);
        // setRejectedProcessesLoading(false);
        return;
      }
      const dateUrl: string = backendUrl + '/getProcessNumber';
      const res = await axios.post(
        dateUrl,
        { ...sendData },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        },
      );
      if (res.status === 200) {
      }
    } catch (error: any) {
      toast.error('something is wrong');
    }
    // setSelectedMainChartType("");
    setMainChartLoading(false);
    // setRejectedProcessesLoading(false);
  };
  useEffect(() => {
    // getMainChartData();
    fetchBranches();
  }, []);
  return (
    <DefaultLayout>
      <Stack
        m={2}
        p={1}
        justifyContent="center"
        alignItems="center"
        gap={1}
        sx={{ minWidth: '200px', minHeight: '200px' }}
      >
        <label htmlFor="selectBranch">
          <b>Select any branch to show perticular data :</b>
        </label>
        <select
          id="selectBranch"
          style={{
            width: '100%',
            height: '50px',
            borderRadius: '8px',
            padding: '5px',
          }}
          onChange={(e) => setSelectedBranch(e.target.value)}
        >
          <option value="" disabled selected>
            Select Branch
          </option>
          {branches
            .filter((item) => item.departments.length > 0)
            .map((item) => {
              return <option value={item.name}>{item.name}</option>;
            })}
        </select>
        {selectedBranch?.toLowerCase() === 'headoffice' && (
          <select
            id="selectDepartments"
            style={{
              width: '100%',
              height: '50px',
              borderRadius: '8px',
              padding: '5px',
            }}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="" disabled selected>
              Select Department
            </option>
            {branches
              .find((item) => item.name === selectedBranch)
              ?.departments.map((item) => {
                return <option value={item.name}>{item.name}</option>;
              })}
          </select>
        )}
        <Button
          variant="contained"
          sx={{ mt: 1 }}
          disabled={mainChartLoading}
          onClick={() => {
            getPerticularBranchData();
            getStepWisePendingProcesses();
          }}
        >
          {mainChartLoading ? <CircularProgress size={30} /> : 'Get'}
        </Button>
      </Stack>
      <>
        {Object.keys(mainChartOption).length > 0 ? (
          <Stack alignItems="flex-end">
            <Button
              variant="contained"
              size="small"
              sx={{ mb: 1 }}
              onClick={() => setIsFilterOpen(true)}
            >
              filter
            </Button>
          </Stack>
        ) : null}
        {Object.keys(mainChartOption).length > 0 ? (
          <Grid container spacing={2}>
            <Grid item xs={12} lg={12}>
              <ChartOne data={mainChartOption} loading={mainChartLoading} />
            </Grid>
            <Grid item xs={12} lg={6}>
              <ChartTwo
                data={rejectedProcessChart}
                loading={mainChartLoading}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <ChartThree
                data={documentsDetailsChart}
                loading={mainChartLoading}
              />
            </Grid>
            <Grid item xs={12}>
              <ChartThree
                data={rejectedDocCatWise}
                loading={mainChartLoading}
              />
            </Grid>
            <Grid item xs={12}>
              <ChartFive
                data={stepWiseChartOptions}
                loading={mainChartLoading}
              />
            </Grid>

            {/* <MapOne /> */}
            {/* <div className="col-span-12 xl:col-span-8">
          <TableOne />
        </div>
        <ChatCard /> */}
          </Grid>
        ) : null}
        <Dialog onClose={closeFilterDialog} open={isFilterOpen}>
          <Stack
            mx={2}
            p={1}
            justifyContent="center"
            alignItems="center"
            gap={1}
            sx={{ minWidth: '200px', minHeight: '200px' }}
          >
            <Typography variant="h6" sx={{ textAlign: 'center' }}>
              Apply filters
            </Typography>
            <select
              id="mainChartOptions"
              style={{ width: '100%', height: '40px', borderRadius: '8px' }}
              value={selectedMainChartType}
              onChange={handleMainChartType}
            >
              <option value="">select</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="custom">Custom</option>
            </select>
            {selectedMainChartType === 'monthly' && (
              <select
                id="yearOptions"
                style={{ width: '100%', height: '40px', borderRadius: '8px' }}
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <option value="" disabled>
                  select
                </option>
                {yearList.map((year) => (
                  <option value={year} key={year}>
                    {year}
                  </option>
                ))}
              </select>
            )}
            {selectedMainChartType === 'custom' && (
              <Stack spacing={2} alignItems="center">
                <Stack
                  direction="row"
                  spacing={1}
                  justifyContent="space-between"
                  width={300}
                  alignItems="center"
                >
                  <h4>Select Start Date:</h4>
                  <input
                    type="date"
                    name="startDate"
                    // className={styles.dateInputs}
                    onChange={handleMainChartDateChange}
                  />
                </Stack>
                <Stack
                  direction="row"
                  spacing={1}
                  justifyContent="space-between"
                  width={300}
                  alignItems="center"
                >
                  <h4>Select End Date:</h4>
                  <input
                    type="date"
                    name="endDate"
                    // className={styles.dateInputs}
                    onChange={handleMainChartDateChange}
                  />
                </Stack>
              </Stack>
            )}
            <Button
              size="small"
              variant="contained"
              sx={{ mt: 2 }}
              onClick={() => {
                getMainChartData();
                setIsFilterOpen(false);
              }}
            >
              Get
            </Button>
          </Stack>
        </Dialog>
      </>
      {processNameList.length ? (
        <Stack justifyContent="center" flexDirection="row" gap={1} mt={1}>
          <select
            id="selectBranch"
            style={{
              width: '100%',
              height: '50px',
              borderRadius: '8px',
              padding: '5px',
            }}
            value={selectedProcess}
            onChange={handleSelectProcess}
          >
            <option value="" selected disabled>
              Select an option
            </option>
            {processNameList.map((item) => {
              return <option value={item}>{item}</option>;
            })}
          </select>
          <Button
            variant="contained"
            size="small"
            sx={{ borderRadius: '10px', height: '50px' }}
            onClick={() => showPerticularProcessData(selectedProcess)}
          >
            Show Timeline
          </Button>
        </Stack>
      ) : null}
    </DefaultLayout>
  );
};

export default PerticularBranch;
