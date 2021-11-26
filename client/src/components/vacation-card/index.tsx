import moment from 'moment';
import React from 'react';
import { Card } from 'react-bootstrap';
import { VacationModel } from '../../models/vacations.model';
import { FaPlaneArrival, FaPlaneDeparture } from 'react-icons/fa';
import { MdDeleteOutline } from 'react-icons/md';
import { AiFillLike } from 'react-icons/ai';
import { FiEdit } from 'react-icons/fi';
import styles from './styles.module.css';
import { StateContext } from '../../context/app.state';
import { API_ACTIONS } from '../../api/api.actions';
import { CONTEXT_ACTIONS } from '../../context/actions';
import { checkUrl, getDecodedJwt, getSavedJwt } from '../../utils/helpers';
import { UserModel } from '../../models/user.model';
import { VacationForm } from '../vacation-form';
import { socketMiddleware } from '../../api/io.actions';
import no_img from '../../assets/no_img.jpeg'

interface IProps {
    controlledComponent: boolean;
}
interface IState {
    editMode: boolean;
    validUrl: string;
}
export class VacationCard extends React.Component<IProps & VacationModel, IState> {
    static contextType = StateContext;
    
    state: IState = {
        editMode: false,
        validUrl: ''
    }

    removeVacation = async () => {
        if (!window.confirm('Are you sure you want to remove this vacation ?')) return;
        const { id } = this.props;
        
        try {
            await API_ACTIONS.removeVacation(id)
            CONTEXT_ACTIONS.removeVacation(this.context, id)
            socketMiddleware({
                type: 'REMOVE_VACATION',
                payload: id
            })  
        } catch (err: any) {
            alert(err.response.data.error)
            console.error(err.response.data.error)
        }
    }
    handleFormSubmit = async (data: VacationModel, formMsgSetter: Function) => {
        const { id, description, destination, imgUrl, fromDate, toDate, price, followersQuantity } = this.props;
        const { description: newDescription, destination: newDestination, imgUrl: newImgUrl, fromDate: newFromDate, toDate: newToDate, price: newPrice } = data;

        if (description === newDescription && destination === newDestination && imgUrl === newImgUrl && 
            moment(fromDate).isSame(newFromDate) && moment(toDate).isSame(newToDate) && price === newPrice ) return formMsgSetter('Change some values to update vacation ...');

        if (moment(newFromDate).isSameOrBefore(moment())) return formMsgSetter('Start Date must be after today !');
        if (moment(moment(newToDate)).isSameOrBefore(moment(newFromDate))) return formMsgSetter('End Date must be after Start Date !');
        const vacation = {
            id: id,
            description: newDescription,
            destination: newDestination,
            imgUrl: newImgUrl,
            fromDate: newFromDate,
            toDate: newToDate,
            price: newPrice,
            followersQuantity: followersQuantity
        }
    
        formMsgSetter('Applies changes ...')
        try {
            await API_ACTIONS.updateVacation(vacation);
            CONTEXT_ACTIONS.updateVacation(this.context, vacation);
            socketMiddleware({
                type: 'UPDATE_VACATION',
                payload: vacation
            })     
        } catch (err: any) {
            alert(err.response.data.error)
            console.error(err.response.data.error)
        }

        this.setState({
            editMode: false
        })
    }

    handleFollow = async (following: boolean) => {
        const { id } = this.props;
        try {
            if (following) {
                await API_ACTIONS.vacationFollowing(id, 'unfollow');
                CONTEXT_ACTIONS.unFollowVacation(this.context, id, true);
                socketMiddleware({
                    type: 'UNFOLLOW_VACATION',
                    payload: id
                })
            } else {
                await API_ACTIONS.vacationFollowing(id, 'follow');
                CONTEXT_ACTIONS.followVacation(this.context, id, true);
                socketMiddleware({
                    type: 'FOLLOW_VACATION',
                    payload: id
                })
            }
        } catch (error: any) {
            alert(error.response.data.error)
            console.error(error.response.data.error);
        }
    }

    componentDidMount = async () => {
        const { imgUrl } = this.props;
        const isUrlValid = await checkUrl(imgUrl);
        this.setState({
            validUrl: isUrlValid ? imgUrl : no_img
        })
    }

    render () {
        const { id, description, destination, imgUrl, fromDate, toDate, price, followersQuantity, controlledComponent } = this.props;
        const { appState } = this.context;
        const { editMode, validUrl } = this.state;
        const currentVacation = { id, description, destination, imgUrl, fromDate, toDate, price, followersQuantity };
        const following: boolean = appState.vacations.follows.some((f: number) => f === id);
        const token: string = getSavedJwt()
        const { isAdmin }: Partial<UserModel> = getDecodedJwt(token)
        
        return (<div className={`${styles.container} position-relative m-2`} style={{width: '380px'}}> {
            editMode ? 
                <VacationForm onSubmit={this.handleFormSubmit} abortForm={() => this.setState({ editMode: false })} data={currentVacation} title={'Edit Vacation'}/>
            : (
                <Card className={'position-absulte'}>
                    <div className={'position-relative'}>
                        <div className={'d-flex align-items-center position-absolute top-0 bg-dark text-light p-1 rounded fw-bold'}>
                            <span className={`${styles.likeBtn} ${following ? styles.like : styles.unlike} ${isAdmin && styles.likeOff} pointer`} onClick={() => !isAdmin ? this.handleFollow(following) : null }><AiFillLike size={22}/> </span>
                            <span className={'ms-1'}>{followersQuantity}</span>
                        </div>
                        <div className={'position-absolute top-0 end-0 bg-dark text-light p-1 rounded fw-bold'}>
                            {price} $
                        </div>
                        <Card.Img src={validUrl} alt={destination} width={'auto'} height={'220px'} className={'rounded-0 rounded-top'}/>
                    </div>
                    <Card.Body className={'bg-dark text-light rounded-bottom'}>
                        <Card.Title>{destination}</Card.Title>
                        <Card.Text>{description}</Card.Text>
                        <Card.Body className={'text-center'}>
                            <Card.Text><FaPlaneDeparture /> <br/>{moment(fromDate).format('MMMM DD, YYYY HH:mm')}</Card.Text>
                            <Card.Text><FaPlaneArrival /> <br/>{moment(toDate).format('MMMM DD, YYYY HH:mm')}</Card.Text>
                        </Card.Body>
                        { controlledComponent && <div className={'d-flex'}>
                            <span className={'pointer'} title={'Edit this Vacation'} onClick={() => this.setState({ editMode: true })}><FiEdit size={22}/></span>
                            <span className={'pointer px-2'} title={'Remove this Vacation'} onClick={this.removeVacation}><MdDeleteOutline size={22}/></span> 
                        </div>}
                    </Card.Body>
                </Card>
        )} </div>
        )
    }
}