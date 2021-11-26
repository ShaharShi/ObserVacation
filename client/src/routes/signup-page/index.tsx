import axios from 'axios';
import React, { FormEvent } from 'react';
import { Form, FormControl, InputGroup, Button } from 'react-bootstrap';
import { RouteComponentProps, withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { setNewJwt } from '../../utils/helpers';

interface IState {
    errMsg: string
}

class SignupPage extends React.Component<{} & RouteComponentProps, IState> {

    state: IState = {
        errMsg: ''
    }

    onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const { history } = this.props;
        const elem = e.target as HTMLFormElement;

        try {
            const results = await axios.post<{jwt: string}>('http://localhost:4000/api/auth/signup', {
                firstName: elem.firstName.value,
                lastName: elem.lastName.value,
                userName: elem.userName.value,
                password: elem.password.value
            })
            const { jwt } = results.data;
            setNewJwt(jwt)
            history.push('/')
            
        } catch (err: any) {
            this.setState({
                ...this.state,
                errMsg: err.response.data.error
            })
        }
    }
    render () {
        const { errMsg } = this.state;

        return (
            <div>
                <h1>Signup Page</h1>
                <div>
                    <Form onSubmit={this.onSubmit}>
                        <InputGroup>
                            <InputGroup.Text>First Name</InputGroup.Text>
                            <FormControl type={'text'} name={'firstName'}/>
                        </InputGroup>
                        <InputGroup>
                            <InputGroup.Text>Last Name</InputGroup.Text>
                            <FormControl type={'text'} name={'lastName'}/>
                        </InputGroup>
                        <InputGroup>
                            <InputGroup.Text>User Name</InputGroup.Text>
                            <FormControl type={'text'} name={'userName'}/>
                        </InputGroup>
                        <InputGroup>
                            <InputGroup.Text>Password</InputGroup.Text>
                            <FormControl type={'password'} name={'password'}/>
                        </InputGroup>
                        <p>I have a user, <Link to={'/login'}>Login !</Link></p>
                        <Button type={'reset'} variant={'secondary'}>Reset</Button>
                        <Button type={'submit'} variant={'success'}>Signup</Button>
                        <p>{ errMsg }</p>
                    </Form>
                </div>
            </div>
        )
    }
}

export default withRouter(SignupPage);