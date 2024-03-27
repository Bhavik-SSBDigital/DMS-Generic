import { Card } from "@mui/material";
import ReactEcharts from "echarts-for-react";


const ChartFive = ({ data, loading }) => {
    return (
        <Card sx={{ height: '450px', p: 2 }}>
            {!loading ? (
                <ReactEcharts
                    showLoading={loading}
                    option={data}
                    notMerge={true}
                    lazyUpdate={true}
                    style={{ height: "100%", width: "100%" }}
                />
            ) : (
                <div
                    style={{
                        display: 'flex',
                        height: '100%',
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <h3>loading....</h3>
                </div>
            )}
        </Card>
    )
}
export default ChartFive;
