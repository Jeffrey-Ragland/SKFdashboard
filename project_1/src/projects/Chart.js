
import ReactApexChart from 'react-apexcharts';
import './Chart.css';

const Chart = () =>
{
    const chartData = [{
        name: 'Car Price',
        data: [1000000,1500000,500000,2500000,5000000]
    }];

    const chartOptions = {
        chart: {
            id: 'basic-bar'
        },

        xaxis: {
            categories: ['Swift','Thar','Alto','XUV700','Fortuner'],
            title: {
                    text: 'Car Model'
            }
        },

        yaxis: {
            title: {
                text:'Price'
            }

        },

        dataLabels: {
            enabled: false
        }
    };

    return(
        <div>
            <div className='chart1'>
            <h3 style={{textAlign: 'center'}}>Car Price Bar Chart</h3>
            <ReactApexChart options={chartOptions} series={chartData} type='bar' height={200}/>
            </div>
            <div className='chart2'>
            <h3 style={{textAlign: 'center'}}>Car Price Line Chart</h3>
            <ReactApexChart options={chartOptions} series={chartData} type='line' height={200}/>
            </div>
        </div>
    );
};



export default Chart;