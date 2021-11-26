import moment from 'moment';
import React, { FormEvent } from 'react';
import { Form, FormControl, InputGroup, Button } from 'react-bootstrap';
import { VacationModel } from '../../models/vacations.model';
import { FaPlaneArrival, FaPlaneDeparture } from 'react-icons/fa';
import styles from './styles.module.css';

interface IProps {
    title: string;
    data?: VacationModel;
    onSubmit: Function;
    abortForm: Function;
}
interface IState {
    formMsg: string;
}
export class VacationForm extends React.Component<IProps, IState> {

    state: IState = {
        formMsg: ''
    }
    
    handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const { onSubmit } = this.props;
        const elem = e.target as HTMLFormElement;
        const desc = elem.description.value, dest = elem.destination.value, img = elem.imgUrl.value, f_date = elem.fromDate.value, t_date = elem.toDate.value, price = elem.price.value;

        if(!desc.length || !dest.length || !img.length || !f_date.length || !t_date.length || !price.length) return this.setFormMessage('All fields are required to proceed !');
        const vacation = {
            description: desc,
            destination: dest,
            imgUrl: img,
            fromDate: f_date,
            toDate: t_date,
            price: price
        }

        onSubmit(vacation, this.setFormMessage)
    }
    handleFormChange = () => {
        this.setFormMessage('')
    }
    setFormMessage = (mess: string) => {
        this.setState({
            formMsg: mess
        })
    }

    render () {
        const { formMsg } = this.state;
        const { abortForm, data, title } = this.props;
        
        return (
            <Form className={`h-100 bg-dark text-light p-3 rounded`} onSubmit={this.handleSubmit} onChange={this.handleFormChange}>
                <div className={'d-flex flex-column h-100'}>
                    <div className={'flex-grow-1 d-flex flex-column'}>
                        <h3 className={'text-center'}>{ title }</h3>
                        <InputGroup className={'my-2'}>
                            <InputGroup.Text>Destination</InputGroup.Text>
                            <FormControl type={'text'} name={'destination'} defaultValue={data && data.destination} maxLength={45} required/>
                        </InputGroup>
                        <InputGroup className={'my-2'}>
                            <InputGroup.Text>Description</InputGroup.Text>
                            <FormControl type={'text'} name={'description'} defaultValue={data && data.description} maxLength={208} required/>
                        </InputGroup>
                        <InputGroup className={'my-2'}>
                            <InputGroup.Text>Image</InputGroup.Text>
                            <FormControl type={'text'} name={'imgUrl'} defaultValue={data && data.imgUrl} maxLength={208} required/>
                        </InputGroup>
                        <InputGroup className={'my-2'}>
                            <InputGroup.Text>Price</InputGroup.Text>
                            <FormControl type={'number'} defaultValue={data && data.price} name={'price'} max={999999999999} required/>
                            <InputGroup.Text>$</InputGroup.Text>
                        </InputGroup>
                        <InputGroup className={'my-2'}>
                            <InputGroup.Text><small>Start Date</small></InputGroup.Text>
                            <FormControl type={'datetime-local'} name={'fromDate'} defaultValue={data && moment(data.fromDate).format('yyyy-MM-DDTHH:mm')} required/>
                            <InputGroup.Text><FaPlaneDeparture/></InputGroup.Text>
                        </InputGroup>
                        <InputGroup className={'my-2'}>
                            <InputGroup.Text><small>End Date</small></InputGroup.Text>
                            <FormControl type={'datetime-local'} name={'toDate'} defaultValue={data && moment(data.toDate).format('yyyy-MM-DDTHH:mm')} required/>
                            <InputGroup.Text><FaPlaneArrival/></InputGroup.Text>
                        </InputGroup>
                        <div className={styles.formMsgContainer}>{formMsg}</div>
                    </div>
                    <div className={'d-flex align-items-end'}>
                        <Button variant={'secondary'} onClick={() => abortForm()}>Cancel</Button>
                        <Button className={'flex-grow-1 ms-2'} type={'submit'} variant={'primary'}>Confirm</Button>
                    </div>
                </div>
            </Form>
        )
    }
}