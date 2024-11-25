import React, { useState } from "react";
import moment from "moment";
import { shortenString } from "../../../util";
import { useNavigate } from "react-router-dom";
import successElipse from '../../../assets/images/Ellipse-success.png';
import warningElipse from '../../../assets/images/Ellipse-warning.png';
import { Pagination } from "react-bootstrap";

const UserNotAttestedPolicyPagination: React.FC<any> = ({ data }) => {
    const navigate = useNavigate();
    const totalPages = Math.ceil(data.length / 10);
    const [currentPage, setCurrentPage] = useState(1);

    const indexOfLastItem = currentPage * 10;
  const indexOfFirstItem = indexOfLastItem - 10;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    const renderPaginationItems = () => {
        const items = [];
        for (let i = 1; i <= totalPages; i++) {
          items.push(
            <Pagination.Item
              key={i}
              active={i === currentPage}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </Pagination.Item>
          );
        }
        return items;
      };

      const handlePageChange = (page:number) => {
        setCurrentPage(page);
      };
    return (
        <div>
            <table className="table table-striped border border-1 w-100">
                <thead className="thead-dark">
                    <tr >
                        <th scope="col" className="bg-primary text-light">#</th>
                        <th scope="col" className="bg-primary text-light">Policy Title</th>
                        <th scope="col" className="bg-primary text-light">Department</th>
                        <th scope="col" className="bg-primary text-light">Deadline to Attest</th>
                        <th scope="col" className="bg-primary text-light">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.length <= 0 ? <tr><td className="text-center" colSpan={5}>No Data Available</td></tr> :
                        currentItems.map((policy: any, index: number) => (
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
                </tbody>
            </table>

            {
                data.length <= 0 ? '' :
                    <div className="d-flex justify-content-between align-items-center">
                        <p className="p-0 m-0">{`Showing Page ${currentPage} of ${totalPages} pages`}</p>
                        {
                            data.length <= 0 ? '' :
                                <Pagination>
                                    <Pagination.First 
                                    onClick={() => handlePageChange(1)} 
                                    disabled={currentPage === 1} />
                                    <Pagination.Prev 
                                    onClick={() => handlePageChange(currentPage - 1)} 
                                    disabled={currentPage === 1} />
                                    {renderPaginationItems()}
                                    <Pagination.Next 
                                    onClick={() => handlePageChange(currentPage + 1)} 
                                    disabled={currentPage === totalPages} />
                                    <Pagination.Last 
                                    onClick={() => handlePageChange(totalPages)} 
                                    disabled={currentPage === totalPages} />
                                </Pagination>
                        }
                    </div>}
        </div>
    )
}

export default UserNotAttestedPolicyPagination;