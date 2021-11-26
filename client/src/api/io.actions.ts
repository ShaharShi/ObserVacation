import socketIOClient, { Socket } from "socket.io-client";

const setUpNewConnection = () => socketIOClient('http://localhost:4000', {transports: ['websocket']});
let socket: Socket = setUpNewConnection()

interface IProps {
    type: string;
    payload?: any;
}

export function socketMiddleware(action: IProps) {
    switch(action.type) {
        case 'GET_CONNECTION': {
            if(!socket) return setUpNewConnection()
            return socket;
        }
        case 'UNFOLLOW_VACATION': socket.emit('unfollow_vacation', action.payload); break;
        case 'FOLLOW_VACATION': socket.emit('follow_vacation', action.payload); break;
        case 'UPDATE_VACATION': socket.emit('update_vacation', action.payload); break;
        case 'ADD_VACATION': socket.emit('add_vacation', action.payload); break;
        case 'REMOVE_VACATION': socket.emit('remove_vacation', action.payload); break;
        default: return socket;
    }
}
