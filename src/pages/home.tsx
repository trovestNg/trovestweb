import React, { useState } from "react";
import { Container, Modal, Card, Button } from "react-bootstrap";
import { User } from "../interfaces/user";
import PrimaryInput from "../components/inputFields/primaryInput";


const Hompepage = ()=>{
     

    return (
        <div className="bg-info p-0 m-0 p-0 w-100 min-vh-100">
            <div className="w-50">Adeline</div>
            <div className="w-50 d-flex justify-content-center align-items-center">
                <form>
                    <PrimaryInput id={'username'} name='username' label={'Username'}/>
                </form>
            </div>
        </div>
    )

}

export default Hompepage;