import React, { useEffect, useState } from "react";

import UserAllPoliciesTab from "../../components/tabs/userTabs/user-all-policies-tab";
import { IPolicy } from "../../interfaces/policy";
import { IDept } from "../../interfaces/dept";
import { getPolicies } from "../../controllers/policy";
import { getUserInfo, loginUser } from "../../controllers/auth";
import { toast } from "react-toastify";
import api from "../../config/api";
import { IUserPolicy } from "../../interfaces/user";
import { Button, Card, FormControl, ListGroup, ListGroupItem, Spinner } from "react-bootstrap";
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


const AuthApprovedBmoPage = () => {
    const [bmoList, setBmoList] = useState<IApprovedBMOOwner[]>([]);
    const [parentInfo, setParentInfo] = useState<IApprovedBMOOwner>();
    const { curstomerNumber, level } = useParams()
    const [loading, setLoading] = useState(false);
    const [sloading, setSLoading] = useState(false);
    const [refreshComponent, setRefreshComponent] = useState(false);

    const [bmoOwner, setBmoOwner] = useState<IApprovedBMOOwner>();
    const [editBenefOwnerCoperateModal, setEditBenefOwnerCoperateModal] = useState(false);
    const [editBenefOwnerIndividualModal, setEditBenefOwnerIndividualModal] = useState(false);
    const [deleteBmOwner, setDeleteBmOwner] = useState(false);
    const navigate = useNavigate();

    const [totalBmoCount, setTotalBmoCount] = useState(0);
    const [bySearch, setBySearch] = useState(false);
    const [searchedWord, setSearchedWord] = useState('');
    const [bmoId, setBmoId] = useState('');
    const [viewMoreInfotModal, setViewMoreInfoModal] = useState(false);

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

    const searchByBmoNameOrNumber = async () => {
        setSLoading(true);
        setLoading(true)// toast.error('Await')
        let userInfo = await getUserInfo();
        if (userInfo) {
            try {

                const res = await api.get(`authorized?requesterName=${userInfo.profile.given_name}&Name=${searchedWord}&pageSize=100`, userInfo?.access_token);
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
            name: owner?.BusinessName,
            customerNumber: owner?.CustomerNumber,
            ownerId: owner?.CustomerNumber
        }
        let unAvOwner = {
            AuthorizeBy: owner.AuthorizeBy,
            AuthorizeDate: owner.AuthorizeDate,
            BVN: owner.BVN,
            BusinessName: owner?.BusinessName,
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
        setParentInfo({ ...e})
        setEditBenefOwnerCoperateModal(true);

        // setAddNewBenefOwnerModal(false)
    }

    const handleDeleteBmoOwner = (bmoId: any) => {
        setDeleteBmOwner(true);
        setBmoId(bmoId);
    }

    const fetch = async () => {
        setLoading(true)// toast.error('Await')
        let userInfo = await getUserInfo();
        if (bySearch) {
            searchByBmoNameOrNumber()
        } else {
            if (userInfo) {
                try {

                    const res = await api.get(`authorized?requesterName=${userInfo.profile.given_name}&pageSize=10000`, userInfo?.access_token);
                    console.log({ heree: res })
                    if (res?.data) {
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
            <EditBMOOwnerCoperateModal
                parentInf={parentInfo}
                ownerInfo={bmoOwner}
                off={() => {
                    setEditBenefOwnerCoperateModal(false);
                    setRefreshComponent(!refreshComponent)

                }} show={editBenefOwnerCoperateModal} />
            <MoreInfoModal lev={bmoOwner?.Level} info={bmoOwner} off={() => setViewMoreInfoModal(false)} show={viewMoreInfotModal} />
            <SureToDeleteBmoModal show={deleteBmOwner} off={() => setDeleteBmOwner(false)} />
            <h5 className="font-weight-bold text-primary" style={{ fontFamily: 'title' }}>Approved Beneficial Owners {`(${totalBmoCount})`} </h5>
            <p>Here, you'll find approved Beneficial Owners.</p>

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
                                                <th scope="col" className="bg-primary text-light">Date Approved</th>
                                                {/* <th scope="col" className="bg-primary text-light">Action</th> */}
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
                                                        <td>{bmoOwner.CustomerNumber ? bmoOwner?.CustomerNumber : "N/A"}</td>
                                                        <td>{bmoOwner.Level ? bmoOwner.Level : 'N/A'}</td>
                                                        <td>{bmoOwner.BeneficiaryOwnerDetails[0]?.BusinessName}</td>
                                                        <td>{bmoOwner.AuthorizeBy}</td>
                                                        <td>{moment(bmoOwner.AuthorizeDate).format('MMM DD YYYY')}</td>
                                                        


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

export default AuthApprovedBmoPage;