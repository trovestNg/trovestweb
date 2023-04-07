import React from 'react'
import { Spinner } from 'react-bootstrap'
import loaderstyles from './loader.module.css'



export default function Loader() {
    return (
        <div className={loaderstyles.modal}>
            <div className={loaderstyles['modal-content']}>
                <Spinner text-primary />
            </div>
        </div>
    )
}
