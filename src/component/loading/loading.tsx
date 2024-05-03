import { icon } from '../icon'
import './loading.scss'

export default function Loading(){

    return <div className='loading'>
        <img src={icon.loading.src}></img>
    </div>
}
export  function Loading2(){

    return <div className='loading Loading2'>
        <img src={icon.loading.src}></img>
    </div>
}