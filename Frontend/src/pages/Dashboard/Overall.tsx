import { useEffect, useState } from 'react';
// import CardDataStats from '../../components/CardDataStats';
import ChartOne from '../../components/Charts/ChartOne';
import ChartThree from '../../components/Charts/ChartThree';
import ChartTwo from '../../components/Charts/ChartTwo';
import DefaultLayout from '../../layout/DefaultLayout';
import moment from 'moment';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Button, Dialog, DialogTitle, Grid, Stack } from '@mui/material';

const Overall = () => {
  // ------------------states-----------------------------

  // charts option
  const [mainChartOption, setMainChartOption] = useState({
    series: [
      {
        name: 'Pending',
        data: [0, 0, 0, 0, 0, 0, 0],
      },
      {
        name: 'Completed',
        data: [0, 0, 0, 0, 0, 0, 0],
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
      categories: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
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
  // const [stepWiseChartOptions, setStepWiseChartOptions] = useState({});
  const [rejectedProcessChart, setRejectedProocessChart] = useState({
    series: [
      {
        data: [0, 0, 0, 0, 0, 0, 0],
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
      categories: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
    },
  });
  const [documentsDetailsChart, setDocumentDetailsChart] = useState({
    series: [{}],
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
      categories: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
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
  const [rejectedDocCatWise, setRejectedDocCatWise] = useState({
    series: [{}],
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
      categories: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
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
  // inputs
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedMainChartType, setSelectedMainChartType] = useState('weekly');
  const [mainChartLoading, setMainChartLoading] = useState(true);
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
  const closeFilterDialog = () => {
    setIsFilterOpen(false);
  };
  const handleMainChartDateChange = (e) => {
    const { name, value } = e.target;
    const timestamp = new Date(value).getTime();
    setMainChartDateRange((prev) => ({ ...prev, [name]: timestamp }));
  };

  // get dashboard data
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
      const dateUrl: string =
        import.meta.env.VITE_BACKEND_URL + '/getProcessNumber';
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
            categories: res.data.processNumberWithDuration?.map((item: any) => {
              const isDate = moment(item.time, moment.ISO_8601, true).isValid();
              return isDate && selectedMainChartType !== 'yearly'
                ? moment(item.time).format('DD-MM-YYYY')
                : item.time;
            }),
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
                .flatMap((item: any) =>
                  item.documentDetails.map((doc: any) => doc.workName),
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
    } catch (error: any) {
      toast.error('something is wrong');
    }
    // setSelectedMainChartType("");
    setMainChartLoading(false);
    // setRejectedProcessesLoading(false);
  };
  useEffect(() => {
    getMainChartData();
  }, []);
  return (
    <DefaultLayout>
      <Stack alignItems="flex-end" my={1}>
        <Button
          variant="contained"
          size="small"
          onClick={() => setIsFilterOpen(true)}
        >
          filter
        </Button>
      </Stack>
      <Grid container spacing={2}>
        <Grid item xs={12} lg={12}>
          <ChartOne data={mainChartOption} loading={mainChartLoading} />
        </Grid>
        <Grid item xs={12} lg={6}>
          <ChartTwo data={rejectedProcessChart} loading={mainChartLoading} />
        </Grid>
        <Grid item xs={12} lg={6}>
          <ChartThree data={documentsDetailsChart} loading={mainChartLoading} />
        </Grid>
        <Grid item xs={12}>
          <ChartThree data={rejectedDocCatWise} loading={mainChartLoading} />
        </Grid>

        {/* <MapOne /> */}
        {/* <div className="col-span-12 xl:col-span-8">
          <TableOne />
        </div>
        <ChatCard /> */}
      </Grid>
      <Dialog onClose={closeFilterDialog} open={isFilterOpen}>
        <DialogTitle sx={{ textAlign: 'center' }}>Filters</DialogTitle>
        <Stack
          mx={2}
          p={1}
          justifyContent="center"
          alignItems="center"
          gap={1}
          sx={{ minWidth: '200px' }}
        >
          {/* <Typography variant="h6" sx={{ textAlign: 'center' }}>
            Apply filters
          </Typography> */}
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
            Apply
          </Button>
        </Stack>
      </Dialog>
    </DefaultLayout>
  );
};

export default Overall;
