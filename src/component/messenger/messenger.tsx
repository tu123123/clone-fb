import './messenger.scss'



const MessItem=()=>{

    return <div className='MessItem'>
        <div className='MessItem-avatar'>fw</div>
        <div className='MessItem-content'>
            <p>ssssssssssssss</p>
            <div className='MessItem-content-time'></div>
        </div>
    </div>
}
export default function Messenger(){

    return <div className='Messenger'>
        <div className='Messenger-header'></div>
        <div className='Messenger-content'>
            <MessItem></MessItem>
        </div>
        <div className='Messenger-footer'></div>
    </div>
}