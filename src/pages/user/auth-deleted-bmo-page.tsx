import React, { useEffect, useState } from "react";

import UserAllPoliciesTab from "../../components/tabs/userTabs/user-all-policies-tab";
import { IPolicy } from "../../interfaces/policy";
import { IDept } from "../../interfaces/dept";
import { getPolicies } from "../../controllers/policy";
import { getUserInfo, loginUser } from "../../controllers/auth";
import { toast } from "react-toastify";
import api from "../../config/api";
import { IUserPolicy } from "../../interfaces/user";
import { Button, Card, FormControl, ListGroup, ListGroupItem, Modal, ModalBody, Spinner } from "react-bootstrap";
import apiUnAuth from "../../config/apiUnAuth";
import { useDispatch, useSelector } from "react-redux";
import { handleUserSearch, handleUserSearchResult } from "../../store/slices/userSlice";
import { IApprovedBMOOwner, IBMOwnersPublic, IUnAuthUserNavLink } from "../../interfaces/bmOwner";
import moment from "moment";
import EditBMOOwnerCoperateModal from "../../components/modals/editBMOOwnerCoperateModal";
import SureToDeleteBmoModal from "../../components/modals/sureToDeleteBmoModal";
import { pushTounAuthUserNavArray, setUnAuthUserBMOOwnerProfile } from "../../store/slices/unAuthserSlice";
import { setAuthUserBMOOwnerProfile } from "../../store/slices/authUserSlice";
import { useNavigate, useParams } from "react-router-dom";
import MoreInfoModal from "../../components/modals/moreInfoModal";
import SureToApproveDeleteBmoModal from "../../components/modals/sureToApproveDeleteBmoModal";


const AuthDeletedBmoPage = () => {
    const [bmoList, setBmoList] = useState<IApprovedBMOOwner[]>([]);

    const [bmoChildrenList, setBmoChildrenList] = useState<IApprovedBMOOwner[]>([]);
    const [parentInfo, setParentInfo] = useState<IApprovedBMOOwner>();
    const { curstomerNumber, level } = useParams()
    const [loading, setLoading] = useState(false);
    const [sloading, setSLoading] = useState(false);
    const [refreshComponent, setRefreshComponent] = useState(false);
    const [showChildrenModal, setShowChildrenModal] = useState(false)

    const [bmoOwner, setBmoOwner] = useState<IApprovedBMOOwner>();
    const [editBenefOwnerCoperateModal, setEditBenefOwnerCoperateModal] = useState(false);
    const [showDeleteApprovalModal, setShowDeleteApprovalModal] = useState(false);
    const [deleteBmOwner, setDeleteBmOwner] = useState(false);
    const navigate = useNavigate();

    const [totalBmoCount, setTotalBmoCount] = useState(0);
    const [bySearch, setBySearch] = useState(false);
    const [searchedWord, setSearchedWord] = useState('');
    const [bmoId, setBmoId] = useState<number>(6789);
    const [viewMoreInfotModal, setViewMoreInfoModal] = useState(false);

    const userClass = useSelector((state: any) => state.authUserSlice.authUserProfile.UserClass);

    const dispatch = useDispatch()
    // const userSearch = useSelector((state:any)=>state.userSlice.userBMOSearch.searchWords);

    const handleSearchByName = (e: any) => {
        e.preventDefault();
        setBySearch(true);
        setRefreshComponent(!refreshComponent)
    }
    const handleClear = () => {
        setSearchedWord('');
        setBySearch(false);
        setSLoading(false)
        setRefreshComponent(!refreshComponent)

    }

    const handleDeletionApproval=()=>{
        setShowDeleteApprovalModal(true)
    }

    const searchByBmoNameOrNumber = async () => {
        setSLoading(true);
        setLoading(true)// toast.error('Await')
        let userInfo = await getUserInfo();
        if (userInfo) {
            try {

                const res = await api.get(`delete/pending?requesterName=${`${userInfo?.profile.given_name} ${userInfo?.profile.family_name}`}&Name=${searchedWord}&pageSize=100`, userInfo?.access_token);
                console.log({ heree: res })
                if (res?.data) {
                    setBmoList(res?.data?.Data.reverse());
                    setTotalBmoCount(res?.data?.Data.length)
                    // calculatePercent(res?.data?.Owners)
                    setParentInfo({ ...res?.data.Data, Id: res?.data?.Data?.BeneficiaryOwnerDetailMapId })
                    setLoading(false)
                    setSLoading(false)
                }
                else if (res?.status == 400) {
                    // setParentInfo(unAvOwner);
                    setBmoList([]);
                    setSLoading(false)
                }
                else {
                    // setParentInfo(unAvOwner);
                    setBmoList([]);
                    setLoading(false);
                    setSLoading(false)
                }
            } catch (error) {
                // setParentInfo(unAvOwner);
                setBmoList([]);
                // setBmoList([])
                setLoading(false)
                setSLoading(false)
            }

        }
    }

    const handleShowInfoModal = (owner: IApprovedBMOOwner) => {
        setBmoOwner(owner);
        setViewMoreInfoModal(!viewMoreInfotModal);
    }

    const handleNavigateToOwner = (owner: IApprovedBMOOwner) => {
        let payload: any = {
            name: owner.BusinessName,
            customerNumber: owner?.CustomerNumber,
            ownerId: owner?.CustomerNumber
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
            Ticker: owner.Ticker
        }
        dispatch(pushTounAuthUserNavArray(payload));
        dispatch(setAuthUserBMOOwnerProfile(unAvOwner))

        // window.history.pushState({}, '', `/owner-details/${level && +level + 1}/${owner.Id}`);
        // navigate(`/owner-details/${level && +level + 1}/${owner.Id}`);

    }

    const handleUpdateBenefOwner = (e: IApprovedBMOOwner) => {
        console.log({ editingThisGuy: e })
        setBmoOwner({ ...e, Id: e.BeneficiaryOwnerMasterId });
        setParentInfo({ ...e })
        setEditBenefOwnerCoperateModal(true);

        // setAddNewBenefOwnerModal(false)
    }

    const handleDeleteBmoOwner = (bmoId: any) => {
        setDeleteBmOwner(true);
        setBmoId(bmoId);
        setShowChildrenModal(false)
    }

    const handleNudgeAuthorizer = (bmoId: any) => {
        // setDeleteBmOwner(true);
        setBmoId(bmoId);
        setShowChildrenModal(false);
        toast.success('Authorizer nudged for deletion')
    }

    const handleOff = () => {
        setDeleteBmOwner(false);
        setRefreshComponent(!refreshComponent)
        setShowChildrenModal(false)
    }

    const fetch = async () => {
        setLoading(true)// toast.error('Await')
        let userInfo = await getUserInfo();
        if (bySearch) {
            searchByBmoNameOrNumber()
        } else {
            if (userInfo) {
                try {

                    const res = await api.get(`delete/pending?requesterName=${`${userInfo?.profile.given_name} ${userInfo?.profile.family_name}`}&pageSize=100`, userInfo?.access_token);
                 
                    if (res?.status==200) {
                        setBmoList(res?.data?.Data.reverse());
                        setTotalBmoCount(res?.data?.Data.length)
                        // calculatePercent(res?.data?.Owners)
                        setParentInfo(res?.data?.Parent)
                        setLoading(false)
                    }
                    else if (res?.status == 400) {
                        // setParentInfo(unAvOwner);
                        setBmoList([]);
                        setLoading(false)
                    }
                    else {
                        // setParentInfo(unAvOwner);
                        setBmoList([]);
                        setLoading(false)
                    }
                } catch (error) {
                    // setParentInfo(unAvOwner);
                    setBmoList([]);
                    // setBmoList([])
                    setLoading(false)
                }

            }

        }


    }


    useEffect(() => {
        fetch()
    }, [refreshComponent])

    return (
        <div className="w-100">
            <Modal size="lg" centered data={bmoChildrenList} show={showChildrenModal} >
                <Modal.Header className="">
                    <i className="bi bi-x-circle text-end w-100"
                        onClick={() => setShowChildrenModal(false)}
                        style={{ cursor: 'pointer' }}
                    ></i>
                </Modal.Header>
                <Modal.Body>
                    <div>
                       <div className="d-flex w-100 justify-content-between">
                       <h5>
                            Attached Children List
                        </h5>
                        {
                            userClass=="Approver"&&
                            <Button onClick={()=>handleDeleteBmoOwner(bmoId)} variant="outline border border-success text-success">Approve Deletion</Button>
                            }

{
                            userClass=="Initiator"&&
                            <Button onClick={()=>handleNudgeAuthorizer(bmoId)} variant="outline border border-success text-success">Nudge Authorizer</Button>
                            }
                       </div>
                        {
                            <>
                                <table className="table table-striped mt-3" >
                                    <thead className="thead-dark">
                                        <tr >
                                            <th scope="col" className="bg-primary text-light">#</th>
                                            <th scope="col" className="bg-primary text-light">Beneficial Owner</th>
                                            <th scope="col" className="bg-primary text-light">Account Type</th>
                                            <th scope="col" className="bg-primary text-light">Nationality </th>
                                            <th scope="col" className="bg-primary text-light">% Holding </th>
                                            <th scope="col" className="bg-primary text-light">No of Shares  </th>
                                            <th scope="col" className="bg-primary text-light">PEP</th>
                                            <th scope="col" className="bg-primary text-light">Ticker</th>
                                            <th scope="col" className="bg-primary text-light">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            bmoChildrenList.length > 0 ? bmoChildrenList.map((bmoOwner: IBMOwnersPublic, index: number) => (
                                                <tr key={index}
                                                    role="button"
                                                >
                                                    <th scope="row">{index + 1}</th>
                                                    <td className="">{bmoOwner.BusinessName}</td>
                                                    <td>{bmoOwner.CategoryDescription}</td>
                                                    <td>{bmoOwner.CountryName}</td>
                                                    <td>{bmoOwner.PercentageHolding}%</td>
                                                    <td>{bmoOwner.NumberOfShares}</td>
                                                    <td>{bmoOwner.IsPEP ? 'Yes' : 'No'}</td>
                                                    <td>{bmoOwner.Ticker ? bmoOwner.Ticker : 'N/A'}</td>
                                                    <td className={`text-${bmoOwner.IsMarkedForDelete ? 'danger' : 'success'}`}>{bmoOwner.IsMarkedForDelete ? 'Marked' : 'UnAuthorised'}</td>
                                                   


                                                </tr>
                                            )) : <tr className="text-center">
                                                <td colSpan={10}>
                                                    No Data Available
                                                </td>
                                            </tr>
                                        }
                                    </tbody>
                                </table>
                            </>
                        }
                    </div>
                </Modal.Body>
            </Modal>
            <EditBMOOwnerCoperateModal
                parentInf={parentInfo}
                ownerInfo={bmoOwner}
                off={() => {
                    setEditBenefOwnerCoperateModal(false);
                    setRefreshComponent(!refreshComponent)

                }} show={editBenefOwnerCoperateModal} />
            <MoreInfoModal lev={bmoOwner?.Level} info={bmoOwner} off={() => setViewMoreInfoModal(false)} show={viewMoreInfotModal} />
            <SureToApproveDeleteBmoModal show={deleteBmOwner} Id={bmoId} off={handleOff} />

            <h5 className="font-weight-bold text-primary" style={{ fontFamily: 'title' }}>Beneficial Owners Pending Deletion {`(${totalBmoCount})`} </h5>
            <p>Here, you'll find beneficial owners pending deletion.</p>

            <div className="w-100 d-flex align-items-center">
                <form
                    onSubmit={(e) => handleSearchByName(e)}
                    className="d-flex w-100 mt-3 gap-3 align-items-center"
                    style={{ position: 'relative' }}
                >

                    <FormControl
                        onChange={(e) => setSearchedWord(e.target.value)}
                        placeholder="Search by Name, Company, Assets...."
                        value={searchedWord}
                        className="py-2 w-50" />
                    <i
                        className="bi bi-x-lg"
                        onClick={handleClear}
                        style={{
                            marginLeft: '550px',
                            display: searchedWord == '' ? 'none' : 'flex',
                            cursor: 'pointer', float: 'right', position: 'absolute'
                        }}></i>

                    <Button
                        disabled={searchedWord == '' || sloading}
                        type="submit"
                        variant="primary" style={{ minWidth: '6em', marginRight: '-5px', minHeight: '2.4em' }}>{sloading ? <Spinner size="sm" /> : 'Search'}</Button>


                </form>

            </div>
            <div className="w-100 mt-5">

                <div className="d-flex flex-column w-100 justify-content-center mt-4">

                    <div style={{ height: '70vh', overflowY: 'scroll' }}>
                        <table className="table table-striped mt-3" >
                            {
                                loading ?
                                    <>
                                        <thead className="thead-dark">
                                            <tr >
                                                <th scope="col" className="bg-primary text-light">#</th>
                                                <th scope="col" className="bg-primary text-light">Beneficial Owner</th>
                                                <th scope="col" className="bg-primary text-light">Account Type</th>
                                                <th scope="col" className="bg-primary text-light">Nationality </th>
                                                <th scope="col" className="bg-primary text-light">% Holding </th>
                                                <th scope="col" className="bg-primary text-light">No of Shares  </th>
                                                <th scope="col" className="bg-primary text-light">PEP</th>
                                                <th scope="col" className="bg-primary text-light">Ticker</th>
                                                {/* <th scope="col" className="bg-primary text-light">Action</th> */}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                <tr className="fw-bold"><td className="text-center" colSpan={9}><Spinner /></td></tr>
                                            }
                                        </tbody>
                                    </> :
                                    <>
                                        <thead className="thead-dark">
                                            <tr >
                                                <th scope="col" className="bg-primary text-light">#</th>
                                                <th scope="col" className="bg-primary text-light">Corporate Account</th>
                                                <th scope="col" className="bg-primary text-light">Customer Number</th>
                                                <th scope="col" className="bg-primary text-light">BO Level </th>
                                                <th scope="col" className="bg-primary text-light">Beneficial Owner</th>
                                                <th scope="col" className="bg-primary text-light">Authorizer</th>
                                                <th scope="col" className="bg-primary text-light">Date Initiated</th>
                                                <th scope="col" className="bg-primary text-light"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                bmoList && bmoList.length > 0 ? bmoList && bmoList.map((bmoOwner: IApprovedBMOOwner, index: number) => (
                                                    <tr key={index}
                                                        role="button"
                                                        onClick={(e) => handleShowInfoModal(bmoOwner)}
                                                    >
                                                        <th scope="row">{index + 1}</th>
                                                        <td className="">{bmoOwner?.BusinessName}</td>
                                                        <td>{bmoOwner?.CustomerNumber ? bmoOwner?.CustomerNumber : "N/A"}</td>
                                                        <td>{bmoOwner.Level ? bmoOwner.Level : 'N/A'}</td>
                                                        <td>{bmoOwner.BeneficiaryOwnerDetails[0]?.BusinessName}</td>
                                                        <td>{bmoOwner.AuthorizeBy}</td>
                                                        <td>{moment(bmoOwner.CreatedDate).format('MMM DD YYYY')}</td>
                                                        <td><i className="bi bi-info-circle text-warning"
                                                            onClick={(e: any) => {
                                                                e.stopPropagation();
                                                                setBmoChildrenList(bmoOwner.BeneficiaryOwnerDetails)
                                                                setBmoId(bmoOwner.BeneficiaryOwnerMasterId)
                                                                setShowChildrenModal(true)
                                                            }}
                                                        ></i></td>



                                                    </tr>
                                                )) : <tr className="text-center">
                                                    <td colSpan={9}>
                                                        No Data Available
                                                    </td>
                                                </tr>
                                            }
                                        </tbody>

                                    </>
                            }
                        </table>

                    </div>



                </div>

            </div>
        </div>
    )

}

export default AuthDeletedBmoPage;