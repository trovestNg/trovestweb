import React, { useEffect, useState } from "react";
import { Badge, Button, Form, FormControl, FormSelect, Spinner, Table } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { IUserPolicy } from "../../../interfaces/user";
import { IDept } from "../../../interfaces/dept";
import moment from "moment";
import { getPolicies } from "../../../controllers/policy";
import receiptImg from '../../../assets/images/receipt.png';
import { getAllDepartments } from "../../../controllers/department";
import { toast } from 'react-toastify';
import api from "../../../config/api";
import successElipse from '../../../assets/images/Ellipse-success.png';
import UserAttestedPolicyPagination from "../../paginations/user/user-attested-policy-pagiantion";
import ArtisansPagination from "../../paginations/atisans-paginations";
import ArtisansSavingsPagination from "../../paginations/atisans-savings-paginations";
import { IArtisanInfo } from "../../../pages/user/admin-view-artisan-info-page";
import { IThrift } from "../../../pages/user/admin-view-agent-info-page";
import AgentsPagination from "../../paginations/agents-paginations";


const SuperApprovedAgentsTab: React.FC<any> = ({agents}) => {

    const userToken = localStorage.getItem('token') || '';
    const token = JSON.parse(userToken);
    
    const [refreshData, setRefreshData] = useState(false);
    const navigate = useNavigate();
    const [policies, setPolicies] = useState<IUserPolicy[]>([]);
    const [depts, setDepts] = useState<IDept[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedDept, setSelectedDept] = useState('');
    const [userSearch, setUserSearch] = useState('');
    const {id} = useParams()

    const [sortByDept, setSortByDept] = useState(false);
    const [searchByName, setBySearch] = useState(false);
    const [query, setQuery] = useState<string>('');
    const [sortCriteria, setSortCriteria] = useState<string>('name');
    const [artisanInfo, setArtisanInfo] = useState<IArtisanInfo>();
    const [artisanSavingThrift, setArtisanSavingThrift] = useState<IThrift[]>([]);


    const fetch = async () => {
        
        try {
            setLoading(true)
            const res = await api.get(`admin/get-admin-agents?page=1&limit=100`, token);
            console.log({here:res})
            if (res?.data?.success) {
                
                setArtisanSavingThrift(res.data?.data?.thrifts)
                // setTotalCollections(res?.data?.data?.total_collections);
                // setTotalDeposits(res?.data?.data?.total_remmitance);
                // setTotalPayouts(res?.data?.data?.total_payout);
                setLoading(false);
                // toast.success('Got infor')
            }

        } catch (error) {
            setLoading(false);
        }

    }

    

    const handleSearch = () => {
        setBySearch(true);
        setRefreshData(!refreshData)
    }

    const handleClear = () => {
        setBySearch(false);
        setQuery('')
        setRefreshData(!refreshData)
    }



    const handleDeptSelection = (val: string) => {
        if (val == 'all') {
            setBySearch(false)
            setSortByDept(false)
            setRefreshData(!refreshData)
        } else {
            setSortCriteria(val);
            setBySearch(false);
            setSortByDept(true)
            setRefreshData(!refreshData)
        }

    }


    useEffect(() => {
        fetch();
        // handleGetAllDepts();
    }, [
            ])

    return (
        <div className="w-100">
            <div className="d-flex w-100 justify-content-between">
                <div className="d-flex gap-4">
                <div className="d-flex align-items-center gap-2" style={{ position: 'relative' }}>
                        <FormControl
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search with agent id..."
                            value={query}
                            className="py-2" style={{ minWidth: '350px' }} />
                        <i
                            className="bi bi-x-lg"
                            onClick={handleClear}
                            style={{ marginLeft: '310px', display: query == '' ? 'none' : 'flex', cursor: 'pointer', float: 'right', position: 'absolute' }}></i>

                        <Button
                            disabled={query == ''}
                            onClick={() => handleSearch()}
                            variant="secondary" style={{ minWidth: '100px', marginRight: '-5px', minHeight:'2.4em' }}>Search</Button>
                    </div>
                    {/* <Form.Select onChange={(e) => handleDeptSelection(e.currentTarget.value)} className="custom-select" style={{ maxWidth: '170px' }}>
                    <option value={'all'}>Select Department</option>
                        {
                            depts.map((dept) => <option key={dept.id} value={dept.name}>{dept.name}</option>)
                        }
                    </Form.Select> */}

                </div>
                {/* <div className="">
                    <Button variant="primary" style={{ minWidth: '100px' }}>Create New Policy</Button>
                </div> */}
            </div>

            <div className="mt-4" >
                
                        <AgentsPagination data={agents}/>
             
            </div>
        </div>
    )

}
export default SuperApprovedAgentsTab;