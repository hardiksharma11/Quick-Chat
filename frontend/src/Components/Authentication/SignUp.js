import React, { useState } from 'react'
import { TextField, Button, Box } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

const SignUp = () => {

    const [inputs, setInputs] = useState({
        name: "",
        email: "",
        password: "",
        confirmpassword: "",
    })

    const [pic, setPic] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    }

    const handleSubmit = async () => {
        const data = {
            name: inputs.name,
            email: inputs.email,
            password: inputs.password,
            pic: pic

        }
        const url = "http://localhost:5000/api/user/"
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify(data)
        });
        const json = await response.json();
        console.log(json);
    }

    const postDetails = (pic) => {
        setLoading(true);
        if (pic === undefined) {
            alert('Not Found');
            setLoading(false);
            return;
        }

        if (pic.type === "image/jpeg" || pic.type === "image/png" || pic.type === "image/jpg") {
            const data = new FormData();
            data.append("file", pic);
            data.append("upload_preset", "MERN-Chat-App");
            data.append("cloud_name", "dcmqewoxn")

            fetch('https://api.cloudinary.com/v1_1/dcmqewoxn/image/upload', {
                method: "POST",
                body: data
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log(data)
                    setPic(data.url.toString());
                    setLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    setLoading(false);
                })



        }

        else {
            alert("Please select an image");
            setLoading(false);
        }
    }
    return (
        <Box maxWidth='420px' >
            <form>
                <TextField
                    name="name"
                    value={inputs.name}
                    variant="outlined"
                    required
                    fullWidth
                    id="name"
                    label="Name"
                    autoFocus
                    sx={{ margin: '6px 0px' }}
                    onChange={handleChange} />
                <TextField
                    name="email"
                    value={inputs.email}
                    variant="outlined"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    sx={{ margin: '6px 0px' }}
                    onChange={handleChange}
                />

                <TextField
                    variant="outlined"
                    value={inputs.password}
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    sx={{ margin: '6px 0px' }}
                    onChange={handleChange}
                />
                <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="confirmpassword"
                    value={inputs.confirmpassword}
                    label="Confirm Password"
                    type="password"
                    id="cassword"
                    sx={{ margin: '6px 0px' }}
                    onChange={handleChange} />

                
                <input type="file" accept="image/*" style={{ margin: '6px 0px'}} name="pic" onChange={(e) => { postDetails(e.target.files[0]) }} />
                
                <div style={{ margin: '8px 0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <LoadingButton variant="contained" loading={loading} onClick={handleSubmit} className='myButton'>Submit</LoadingButton>
                </div>
            </form>
        </Box>
    )
}

export default SignUp