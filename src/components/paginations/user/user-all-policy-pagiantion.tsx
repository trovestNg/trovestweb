import React from "react";
import moment from "moment";
import { shortenString } from "../../../util";
import { useNavigate } from "react-router-dom";
import successElipse from '../../../assets/images/Ellipse-success.png';
import warningElipse from '../../../assets/images/Ellipse-warning.png';

const UserAllPolicyPagination: React.FC<any> = ({ data }) => {
    const navigate = useNavigate()
    return (
        <tbody>
            {data.length <= 0 ? <tr><td className="text-center" colSpan={5}>No Data Available</td></tr> :
                data.map((policy:any, index:number) => (
                    <tr key={index} style={{ cursor: 'pointer' }}
                        onClick={() => navigate(`/policy-portal/policy/${policy.isAttested}/${policy.id}`)}
                    >
                        <th scope="row">{index + 1}</th>
                        <td className="text-primary"><i className="bi bi-file-earmark-pdf text-danger"></i> {shortenString(policy.fileName, 40)}</td>
                        <td>{policy.policyDepartment}</td>
                        <td>{moment(policy.deadlineDate).format('MMM DD YYYY')}</td>
                        <td className={`text-${policy.isAttested ? 'success' : 'warning'}`}>
                            <img src={policy.isAttested ? successElipse : warningElipse} height={'10px'} />
                            {'  '}
                            <span >{policy.isAttested ? 'Attested' : 'Not attested'}</span>
                        </td>
                    </tr>
                ))
            }

{
                data.length <= 0 ? '' :
                    <div className="d-flex justify-content-between align-items-center">
                        <p className="p-0 m-0">Showing 1 to 10 of 100 entries</p>
                        <nav aria-label="...">
                            <ul className="pagination">
                                <li className="page-item disabled">
                                    <a className="page-link" href="#" aria-disabled="true">Previous</a>
                                </li>
                                <li className="page-item"><a className="page-link" href="#">1</a></li>
                                <li className="page-item active" aria-current="page">
                                    <a className="page-link" href="#">2</a>
                                </li>
                                <li className="page-item"><a className="page-link" href="#">3</a></li>
                                <li className="page-item">
                                    <a className="page-link" href="#">Next</a>
                                </li>
                            </ul>
                        </nav>
                    </div>}
        </tbody>
    )
}