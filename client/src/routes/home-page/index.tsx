import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { StateContext } from '../../context/app.state';
import Header from '../../components/header'
import { VacationCard } from '../../components/vacation-card';
import { VacationModel } from '../../models/vacations.model';
import { removeSavedJwt } from '../../utils/helpers';
import { Button } from 'react-bootstrap';
import { CONTEXT_ACTIONS } from '../../context/actions';

class HomePage extends React.Component<{} & RouteComponentProps> {
    static contextType = StateContext;

    navigateToLogin = () => {
        const { history } = this.props;

        removeSavedJwt()
        history.push('/login')
    }

    componentDidMount = async () => {
        CONTEXT_ACTIONS.initialVacations(this.context, this.navigateToLogin)
    }
    
    render () {
        const { appState } = this.context;
        const { history } = this.props;
        return (
            <div>
                <Header title={'Home'} navigateBtnElem={<Button className={'mx-2'} onClick={() => history.push('/admin')} size={'sm'} variant={'success'}>Admin Panel</Button>}/>
                <div className={'d-flex flex-wrap'}>{
                    appState.vacations.sortedVacations.map((vacation: VacationModel) => <VacationCard key={vacation.id} controlledComponent={false} {...vacation}/>)
                }</div>
            </div>
        )
    }
}

export default withRouter(HomePage);
