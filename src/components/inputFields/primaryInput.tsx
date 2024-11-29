import React, { useState } from "react";
import { FormControl } from "react-bootstrap";

const PrimaryInput: React.FC<any> = ({ id, name, label, placeHolder }) => {
    const [focused,setFocused] = useState(false)
    return (
        <div className="">

            <label
             className="" 
             htmlFor={name}
             
             >{label}</label>
             <div 
             className="d-flex border border-primary outline outline-info outline-3 rounded rounded-1 p-2 py-1 align-items-center"
             style={{outline:focused?'solid 3px green':''}}
             >
             <input
            
             className="rounded bg-transparent rounded-1 border border-0 outline outline-0" 
             name={name} 
             id={name}
             style={{outline:'none'}}
             />
             <i className="bi bi-eye-slash-fill"></i>
             </div>
            
        </div>
    )
}
export default PrimaryInput;