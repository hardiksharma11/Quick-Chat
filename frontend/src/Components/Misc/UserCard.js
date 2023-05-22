import { Avatar, Card, CardHeader } from '@mui/material'
import React,{useState} from 'react'

const UserCard = (props) => {

    const {accessChat,id}=props

    const [color, setColor] = useState('#ebeaea');

    const changeColor = () => {
        setColor('#df3670f5');
    }

    const changeColorBack = () => {
        setColor('#ebeaea');
    }
    return (
        <div style={{cursor:'pointer',margin:'3px'}} onMouseOver={changeColor} onMouseOut={changeColorBack} >
            <Card sx={{ maxWidth: 345,backgroundColor:`${color}` }} onClick={()=>{accessChat(id)}}>
                <CardHeader
                    avatar={
                        <Avatar  aria-label="recipe" src={`${props.pic}`} />
                       
                    }
                    
                    title={`${props.name}`}
                    subheader={`${props.email}`}
                />

            </Card>
        </div>
    )
}

export default UserCard
