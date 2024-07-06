import React, { useState } from "react";
import { Button, FormControl } from "react-bootstrap";

const PrimaryInput = ({ placeHolder, icon, icon2, error,blure, value, name,touched, change,maxWidth,type }) => {
    const [secure,setSecure] = useState(false);
    // const toggleInputType = ()=>{
    //     if(type == 'password'){
    //         setInputType('password')
    //     } else return
    // }

    if(type == 'password') {
        return (
            <>
                <div className={`container d-flex align-items-center gap-2 border border-primary border-1 outline py-2 rounded-1`} id="inputContainer"
                    style={{
                        minWidth: '18em',
                        maxWidth:maxWidth
    
                    }}>
                    {icon && <span className="icon" id="inputIcon">{<i className={icon}></i>}</span>}
                    <input
    
                        name={name}
                        id={name}
                        className="bg-transparent border-0" placeholder={placeHolder}
                        style={{ outline: 'none', width: '100%' }}
                        onChange={change}
                        onBlur={blure}
                        type={secure?'password':''}
                        value={value}
    
                    />
                    {icon2 && <span 
                    onClick={()=>setSecure(!secure)}
                    className="icon" id="inputIcon" style={{cursor:'pointer'}}>{<i className={icon2}></i>}</span>}
                </div>
                <p
                    className="text-danger mt-1"
                    style={{
                        width: "20em",
                        minWidth: "15em",
                        fontSize: "0.7em",
                        textAlign: "start",
                    }}
                >
                    {touched && error}
                </p>
    
            </>
        )
    }
    else {
        return (
            <>
                <div className={`container d-flex align-items-center gap-2 border border-primary border-1 outline py-2 rounded-1`} id="inputContainer"
                    style={{
                        minWidth: '18em',
                        maxWidth:maxWidth
    
                    }}>
                    {icon && <span className="icon" id="inputIcon">{<i className={icon}></i>}</span>}
                    <input
    
                        name={name}
                        id={name}
                        className="bg-transparent border-0" placeholder={placeHolder}
                        style={{ outline: 'none', width: '100%' }}
                        onChange={change}
                        onBlur={blure}
                        type={type}
                        value={value}
    
                    />
                    {icon2 && <span 
                    className="icon" id="inputIcon" style={{cursor:'pointer'}}>{<i className={icon2}></i>}</span>}
                </div>
                <p
                    className="text-danger mt-1"
                    style={{
                        width: "20em",
                        minWidth: "15em",
                        fontSize: "0.7em",
                        textAlign: "start",
                    }}
                >
                    {touched && error}
                </p>
    
            </>
        )

    }

    

}

export default PrimaryInput;