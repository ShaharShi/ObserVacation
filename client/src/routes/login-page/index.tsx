import axios from 'axios';
import React, { FormEvent } from 'react';
import { Form, FormControl, InputGroup, Button } from 'react-bootstrap';
import { RouteComponentProps, withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { setNewJwt } from '../../utils/helpers';

interface IState {
    errMsg: string
}
class LoginPage extends React.Component<{} & RouteComponentProps, IState> {
    
    state: IState = {
        errMsg: ''
    }

    onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const { history } = this.props;
        const elem = e.target as HTMLFormElement;

        try {
            const results = await axios.get<{ jwt: string}>('http://localhost:4000/api/auth/login', {
                params: {
                    userName: elem.userName.value,
                    password: elem.password.value
                }
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
                <h1>Login page</h1>
                <div>
                    <Form onSubmit={this.onSubmit}>
                        <InputGroup>
                            <InputGroup.Text>User Name</InputGroup.Text>
                            <FormControl type={'text'} name={'userName'} required/>
                        </InputGroup>
                        <InputGroup>
                            <InputGroup.Text>Password</InputGroup.Text>
                            <FormControl type={'password'} name={'password'} required/>
                        </InputGroup>
                        <p>Not a user ? <Link to={'/signup'}>Sign up !</Link></p>
                        <Button type={'submit'}>login</Button>
                        <p>{ errMsg }</p>
                    </Form>
                </div>
            </div>
        )
    }
}

export default withRouter(LoginPage);