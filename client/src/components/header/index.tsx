import React from 'react';
import { Button } from 'react-bootstrap';
import { RouteComponentProps, withRouter } from 'react-router';
import { UserModel } from '../../models/user.model';
import { getDecodedJwt, getSavedJwt, removeSavedJwt } from '../../utils/helpers';

interface IState {
    showAdminNavigateBtn: boolean;
    userName: string;
}
interface IProps {
    title: string;
    navigateBtnElem: JSX.Element;
}

class Header extends React.Component<IProps & RouteComponentProps, IState> {
    state: IState = {
        showAdminNavigateBtn: false,
        userName: ''
    }

    logout = () => {
        const { history } = this.props;
        removeSavedJwt()
        history.push('/login')
    }
    componentDidMount = () => {
        const token = getSavedJwt();
        const user: Partial<UserModel> = getDecodedJwt(token)

        this.setState({
            showAdminNavigateBtn: user?.isAdmin as boolean,
            userName: user?.userName as string
        })
    }
    render () {
        const { showAdminNavigateBtn, userName } = this.state;
        const { title, navigateBtnElem } = this.props;

        return (
            <div className={'d-flex justify-content-between align-items-center p-3 bg-dark text-light'}>
                <div className={'d-flex align-items-center'}>
                    <h1>ObserVacation | </h1>
                    <h2 className={'text-muted m-0 ms-3'}> {title} </h2>
                </div>
                <div className={'d-flex align-items-center'}>
                    <span className={'me-2'}>Hello {userName}</span>
                    { showAdminNavigateBtn && navigateBtnElem}
                    <Button onClick={this.logout} size={'sm'} variant={'danger'}>Logout</Button>
                </div>
            </div>
        )
    }
}

export default withRouter(Header);