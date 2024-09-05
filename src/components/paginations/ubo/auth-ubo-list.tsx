import React, { useState } from "react"
import { IBMO, IOwner } from "../../../interfaces/bmo"
import { useNavigate } from "react-router-dom"
import { Card, ListGroup, ListGroupItem, Modal } from "react-bootstrap"
import { useDispatch } from "react-redux"
import { updateNav } from "../../../store/slices/userSlice"
import MoreInfoModal from "../../modals/moreInfoModal"
const AuthBOList: React.FC<any> = ({ data, lv, handleEditUBOOwner,handDel }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [viewMoreInfotModal, setViewMoreInfoModal] = useState(false);
    const [bmoOwner, setBmoOwner] = useState<IOwner>();

    const handleNavigateToLevel = (owner: IOwner, id: number) => {
        let payload = {
            name: owner.BusinessName,
            id: owner.Id
        }
        dispatch(updateNav(payload))
        navigate(`/ubo-portal/custormer-details/${+lv + 1}/${id}`)

    }

    const handleUpdateOwner = (owner: IOwner) => {
        handleEditUBOOwner(owner)

    }

    const handleDelOwner = (ownerId: string) => {
        handDel(ownerId)

    }

    const handleShowInfoModal = (owner: IOwner) => {
        setBmoOwner(owner);
        setViewMoreInfoModal(!viewMoreInfotModal);
    }
    return (
        data.map((bmoOwner: IOwner, index: number) => (
            <>

                <MoreInfoModal info={bmoOwner} off={() => setViewMoreInfoModal(false)} show={viewMoreInfotModal} />
                <tr key={index}
                    role="button"
                    onClick={bmoOwner.CategoryDescription == 'Corporate' ? () => handleNavigateToLevel(bmoOwner, bmoOwner.Id) : () => handleShowInfoModal(bmoOwner)}
                >
                    <th scope="row">{index + 1}</th>
                    <td className="">{bmoOwner.BusinessName}</td>
                    <td>{bmoOwner.CategoryDescription}</td>
                    <td>{bmoOwner.CountryName}</td>
                    <td>{bmoOwner.PercentageHolding}%</td>
                    <td>{bmoOwner.NumberOfShares}</td>
                    <td>{bmoOwner.IsPEP ? 'Yes' : 'No'}</td>
                    <td>{bmoOwner.Ticker ? bmoOwner.Ticker : 'N/A'}</td>
                    <td className="table-icon" >
                        <i className=" bi bi-three-dots" onClick={(e) => e.stopPropagation()}></i>
                        <div className="content ml-5" style={{ position: 'relative', zIndex: 1500 }}>
                            <Card className="p-2  shadow-sm rounded border-0"
                                style={{ minWidth: '15em', marginLeft: '-10em', position: 'absolute' }}>

                                <ListGroup>
                                    <ListGroupItem className="multi-layer"
                                    // onClick={(e) => handleGetAttestersList(e, policy)}
                                    >
                                        <span className="w-100 d-flex justify-content-between">
                                            <div className="d-flex gap-2">
                                                <i className="bi bi-eye"></i>
                                                View More
                                            </div>

                                            {/* <i className="bi bi-chevron-right"></i> */}
                                        </span>

                                    </ListGroupItem>
                                    {
                                        <div onClick={(e) => e.stopPropagation()}>
                                            <ListGroupItem
                                            onClick={(e) => handleUpdateOwner(bmoOwner)}
                                            >
                                                <span className="w-100 d-flex justify-content-between">
                                                    <div className="d-flex gap-2">
                                                        <i className="bi bi-calendar-event"></i>
                                                        Edit
                                                    </div>
                                                </span>
                                            </ListGroupItem>
                                            <ListGroupItem
                                                className="text-danger"
                                            // disabled={policy?.markedForDeletion}
                                            onClick={(e) => handleDelOwner(bmoOwner.IdNumber)}
                                            >
                                                <span className="w-100 d-flex justify-content-between">
                                                    <div className="d-flex gap-2">
                                                        <i className="bi bi-trash"></i>
                                                        Delete
                                                    </div>
                                                </span>
                                            </ListGroupItem>
                                        </div>
                                    }
                                </ListGroup>

                            </Card>

                        </div>

                    </td>


                </tr>
            </>
        ))
    )
}

export default AuthBOList;