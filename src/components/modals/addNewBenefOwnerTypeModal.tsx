import React from "react";
import { Button, Modal } from "react-bootstrap";
import alertIcon from "../../assets/icons/switch-icon.png";
import { useNavigate } from "react-router-dom";

const AddNewBenefOwnerTypeModal : React.FC<any> = ({show, off, action})=>{
    const navigate = useNavigate();
    const ownerTypes = [
        {
            icon:'bi bi-person-fill',
            title:'Individual Beneficial Owner',
            description:`A person who owns shares in a company and therefore gets part of the company's profits.`
        },
        {
            icon:'bi bi-bank2',
            title:'Corporate Beneficial Owner',
            description:`A corporate shareholder is a business entity that owns shares in another limited company.`
        },
        {
            icon:'bi bi-bank2',
            title:'Funds Manager Beneficial Owner',
            description:`Fund managers are responsible for making sure that accurate accounting records are kept for investment funds.`
        },
        {
            icon:'bi bi-folder-symlink-fill',
            title:'Import Beneficial Owners',
            description:`Effortlessly upload large datasets of beneficial owners with our Importing Module.`
        },
    ]
return (
    <div>
        <Modal show={show} centered>
                <Modal.Header className="">
                    <i className="bi bi-x-circle text-end w-100" 
                    onClick={()=>off()}
                    style={{ cursor: 'pointer' }} 
                   ></i>
                </Modal.Header>
                <Modal.Body>
                    <div className="py-2 d-flex px-2 gap-2 justify-content-center align-items-center flex-column">
                        <h5 className="text-primary">Select the Category of Beneficial Owner</h5>
                        {
                            ownerTypes.map((type,index)=>(
                                <div onClick={()=>action(index +1)} role="button" className="d-flex align-items-center border rounded border p-3 gap-2">
                                    <div className="text-primary">
                                    <i className={`${type.icon}`}></i>
                                    </div>
                                    <div className="">
                                        <p className="fw-bold p-0 m-0 text-primary px-2">{type.title}</p>
                                        <p className="px-2">{type.description}</p>
                                    </div>
                                </div>
                            ))
                        }
                        {/* <img src={alertIcon} height={'114px'} />
                        <p className="text-primary mt-2" style={{ fontFamily: 'title' }}>Switch to Admin’s View</p>
                        <p className="text-center px-3">You're about to switch to the admin's view. Click the button below to proceed.</p>
                        <p className="text-primary" onClick={() => action()} style={{textDecoration:'underline', cursor:'pointer'}}>Proceed to switch to admin's view </p> */}
                    </div>
                </Modal.Body>
            </Modal>
    </div>
)
} 
export default AddNewBenefOwnerTypeModal