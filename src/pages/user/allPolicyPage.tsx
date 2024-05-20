import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Document,Page,pdf} from '@react-pdf/renderer';
import { useState } from "react";

const AllPolicyViewPage = () => {
    const navigate = useNavigate();
    // pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;


    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState(1);

    const onDocumentLoadSuccess = () => {
        setNumPages(numPages);
    };

    const goToPreviousPage = () => {
        // setPageNumber(prevPage => prevPage - 1);
    };

    const goToLastPage = () => {
        setPageNumber(numPages);
    };

    return (
        <div>
            <div><Button variant="outline border border-2" onClick={() => navigate(-1)}>Go Back</Button></div>
            <div className="d-flex">
                <div>
                   
                    {/* <p>Page {pageNumber} of {numPages}</p>
                    <button onClick={goToPreviousPage}>Previous Page</button>
                    <button onClick={goToLastPage}>Last Page</button> */}
                </div>
                <div></div>
            </div>

        </div>
    )
}
export default AllPolicyViewPage;