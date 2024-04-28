
interface button{
    src?:string
}
import './button.scss'
export const button={

     icon:({src}:button)=>{
        return <div className="button">
            <img src={src}></img>
        </div>
    }
}