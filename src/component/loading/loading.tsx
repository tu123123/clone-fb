import { icon } from '../icon'
import './loading.scss'

export default function Loading(){

    return <div className='loading'>
        <img src={icon.loading.src}></img>
    </div>
}