import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { RouteComponentProps, withRouter } from 'react-router';
import { StateContext } from '../../context/app.state';
import { VacationModel } from '../../models/vacations.model';
import { getDecodedJwt, getSavedJwt, removeSavedJwt } from '../../utils/helpers';
import Header from '../../components/header'
import { VacationCard } from '../../components/vacation-card';
import { API_ACTIONS } from '../../api/api.actions';
import { UserModel } from '../../models/user.model';
import { VacationForm } from '../../components/vacation-form';
import moment from 'moment';
import { CONTEXT_ACTIONS } from '../../context/actions';
import { socketMiddleware } from '../../api/io.actions';

interface IState {
    modalVisibility: boolean;
}
class AdminPage extends React.Component<{} & RouteComponentProps, IState> {
    static contextType = StateContext;

    state: IState = {
        modalVisibility: false
    }
    navigateToLogin = () => {
        const { history } = this.props;

        removeSavedJwt()
        history.push('/login')
    }
    handleFormSubmit = async (data: VacationModel, formMsgSetter: Function) => {
        const { description, destination, imgUrl, fromDate, toDate, price } = data;

        if (moment(fromDate).isSameOrBefore(moment())) return formMsgSetter('Start Date must be after today !');
        if (moment(moment(toDate)).isSameOrBefore(moment(fromDate))) return formMsgSetter('End Date must be after Start Date !');

        const newVacation = {
            description: description,
            destination: destination,
            imgUrl: imgUrl,
            fromDate: fromDate,
            toDate: toDate,
            price: price,
            followersQuantity: 0
        }
        try {
            const { data } = await API_ACTIONS.addVacation(newVacation);
            const newVacationWithId = { ...newVacation, id: data._id}
            
            CONTEXT_ACTIONS.addVacation(this.context, newVacationWithId);
            socketMiddleware({
                type: 'ADD_VACATION',
                payload: newVacationWithId
            })  
        } catch (err: any) {
            alert(err.response.data.error)
        } finally {
            this.setState({
                modalVisibility: false
            })
        }
    }
    hideModal = () => {
        this.setState({ modalVisibility: false })
    }
    componentDidMount = async () => {
        const { history } = this.props;

        const token = getSavedJwt();
        const user: Partial<UserModel> = getDecodedJwt(token)
        if (!user.isAdmin) history.push('/')

        CONTEXT_ACTIONS.initialVacations(this.context, this.navigateToLogin)
    }

    render () {
        const { appState } = this.context;
        const { history } = this.props;
        const { modalVisibility } = this.state;
        return (
            <div>
                <Modal show={modalVisibility} onHide={this.hideModal} centered>
                    <VacationForm onSubmit={this.handleFormSubmit} abortForm={this.hideModal} title={'Add Vacation'}/>
                </Modal>
                <Header title={'Admin Panel'} navigateBtnElem={<Button className={'mx-2'} onClick={() => history.push('/')} size={'sm'} variant={'success'}>Back to Home</Button>} />
                <div className={'d-flex justify-content-center p-2'}>
                    <Button onClick={() => this.setState({ modalVisibility: true })}>Add Vacation</Button>
                    <Button className={'mx-2'} variant={'warning'} onClick={() => history.push('admin-reports')}>Reports Page</Button>
                </div>
                <div className={'d-flex flex-wrap align-items-start'}>{
                    appState.vacations.sortedVacations.map((vacation: VacationModel) => <VacationCard key={vacation.id} controlledComponent={true} {...vacation}/>)
                }</div>
            </div>
        )
    }
}

export default withRouter(AdminPage);