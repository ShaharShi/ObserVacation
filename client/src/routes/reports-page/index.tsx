import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { StateContext } from '../../context/app.state';
import Header from '../../components/header'
import { Button, Container } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { VacationModel } from '../../models/vacations.model';
import { removeSavedJwt } from '../../utils/helpers';
import { CONTEXT_ACTIONS } from '../../context/actions';

ChartJS.register(CategoryScale, LinearScale,  BarElement);

interface IState {
    chartData: any;
}
class ReportsPage extends React.Component<{} & RouteComponentProps, IState> {
    static contextType = StateContext;
    state: IState = {
        chartData: null
    }

    navigateToLogin = () => {
        const { history } = this.props;

        removeSavedJwt()
        history.push('/login')
    }

    initialChartData = (sortedVacations: VacationModel[]) => {
        const dataset: { labels: string[], datasets: any } = { 
            labels: [],
            datasets: [{
                label: '',
                data: [],
                backgroundColor: '#212529'
            }]
        };
        sortedVacations.forEach((vacation: VacationModel) => {
            if (vacation.followersQuantity < 1) return;
            
            dataset.labels.push(`Vacation ${vacation.id} - ${vacation.destination}`)
            dataset.datasets[0].data.push(vacation.followersQuantity)
        })
        this.setState({
            chartData: dataset
        })
    }
    componentDidMount = async () => {
        const data = await CONTEXT_ACTIONS.initialVacations(this.context, this.navigateToLogin);
        if(!data) return;

        this.initialChartData(data.sortedVacations);
    }

    render () {
        const { history } = this.props;
        const { chartData } = this.state;
        const chartOptions = { 
            responsive: true,
            scales: {
                 y: { ticks: { stepSize: 1 } }
                }
            }
        return (
            <div>
                <Header title={'Admin Reports Panel'} navigateBtnElem={<Button className={'mx-2'} onClick={() => history.push('/')} size={'sm'} variant={'success'}>Back to Home</Button>} />
                <div className={'d-flex flex justify-content-center my-3'}> <Button onClick={() => history.push('admin')}>Admin Page</Button></div>
                <Container className={'mb-3'}>
                    { chartData && <Bar
                        options={chartOptions}
                        data={chartData}
                    />}
                </Container>
            </div>
        )
    }
}

export default withRouter(ReportsPage);