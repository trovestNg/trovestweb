import React, { useState } from "react"
import { IBMO, IOwner } from "../../../interfaces/bmo"
import { useNavigate } from "react-router-dom"
import { Card, ListGroup, ListGroupItem, Modal } from "react-bootstrap"
import { useDispatch } from "react-redux"
import { handleSetBmoOwner, updateNav } from "../../../store/slices/userSlice"
import MoreInfoModal from "../../modals/moreInfoModal"
const UnAuthBOOwnwerList: React.FC<any> = ({ data, lv,refPar }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [viewMoreInfotModal, setViewMoreInfoModal] = useState(false);
    const [bmoOwner, setBmoOwner] = useState<IOwner>();

    const handleNavigateToOwner = (owner: IOwner) => {
        let payload = {
            name: owner.BusinessName,
            id: owner.Id
        }
        let unAvOwner = {
            AuthorizeBy: owner.AuthorizeBy,
            AuthorizeDate: owner.AuthorizeDate,
            BVN: owner.BVN,
            BusinessName: owner.BusinessName,
            Category: owner.Category,
            CategoryDescription: owner.CategoryDescription,
            Comments: owner.Comments,
            CountryId: owner.CountryId,
            CountryName: owner.CountryName,
            CreatedBy: owner.CreatedBy,
            CreatedDate: owner.CreatedDate,
            CustomerNumber: owner.CustomerNumber,
            Id: owner.Id,
            IdNumber: owner.IdNumber,
            IdType: owner.IdType,
            IsAuthorized: owner.IsAuthorized,
            IsPEP: owner.IsPEP,
            IsRejected: owner.IsRejected,
            Level: owner.Level,
            NumberOfShares: owner.NumberOfShares,
            ParentId: owner.ParentId,
            PercentageHolding: owner.PercentageHolding,
            RcNumber: owner.RcNumber,
            RejectedBy: owner.RejectedBy,
            RejectedDate: owner.RejectedDate,
            RiskLevel: owner.RiskLevel,
            RiskScore: owner.RiskScore,
            Ticker:owner.Ticker
        }
        dispatch(updateNav(payload));
        dispatch(handleSetBmoOwner(unAvOwner))
        navigate(`/ubo-portal/owner-details/${+lv + 1}/${owner.Id}`)
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
                    onClick={bmoOwner.CategoryDescription == 'Corporate' ? () => handleNavigateToOwner(bmoOwner) : () => handleShowInfoModal(bmoOwner)}
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
                                </ListGroup>

                            </Card>

                        </div>

                    </td>


                </tr>
            </>
        ))
    )
}

export default UnAuthBOOwnwerList;