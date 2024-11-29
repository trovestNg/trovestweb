import React, { useState } from "react";
import moment from "moment";
import { shortenString } from "../../util";
import { useNavigate } from "react-router-dom";
import successElipse from '../../assets/images/Ellipse-success.png';
import warningElipse from '../../assets/images/Ellipse-warning.png';
import { Pagination } from "react-bootstrap";
import { IAgent } from "../../pages/user/admin-dashboardpage";

const SuperAgentsPagination: React.FC<any> = ({ data }) => {
    const navigate = useNavigate();
    const totalPages = Math.ceil(data.length / 5);
    const [currentPage, setCurrentPage] = useState(1);

    const indexOfLastItem = currentPage * 5;
  const indexOfFirstItem = indexOfLastItem - 5;
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
        <div className="mt-2 p-0">
            <table className="table table-striped border border-1 w-100">
                <thead className="thead-dark">
                    <tr >
                        <th scope="col" className="bg-primary text-light">#</th>
                        <th scope="col" className="bg-primary text-light">Name</th>
                        <th scope="col" className="bg-primary text-light">Phone Number</th>
                        <th scope="col" className="bg-primary text-light">Email</th>
                        <th scope="col" className="bg-primary text-light">No of Customers</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.length <= 0 ? <tr><td className="text-center" colSpan={5}>No Data Available</td></tr> :
                        currentItems.map((agent: IAgent, index: number) => (
                            <tr key={index} style={{ cursor: 'pointer' }}
                                onClick={() => navigate(`/admin/agent/${agent._id}`)}
                            >
                                <th scope="row">{index + 1}</th>
                                <td className="text-primary"> {`${agent.first_name} ${agent.last_name}`}</td>
                                <td>{agent.mobile}</td>
                                <td>{agent.email}</td>
                                <td>{agent.artisans.length}</td>
                                {/* <td>{moment(agent.deadlineDate).format('MMM DD YYYY')}</td> */}
                                {/* <td className={`text-${agent.isAttested ? 'success' : 'warning'}`}>
                                    <img src={agent.isAttested ? successElipse : warningElipse} height={'10px'} />
                                    {'  '}
                                    <span >{agent.isAttested ? 'Attested' : 'Not attested'}</span>
                                </td> */}
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

export default SuperAgentsPagination;