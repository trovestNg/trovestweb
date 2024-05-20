import React, { useState } from "react";
import { Container, Modal, Card, Button } from "react-bootstrap";
import { User } from "../interfaces/user";
import PrimaryInput from "../components/inputFields/primaryInput";
import DashboardCard from "../components/cards/dashboard-card";
import openBook from '../assets/images/open-book.png';
import checked from '../assets/images/check.png';
import timer from '../assets/images/deadline.png';
import error from '../assets/images/error.png';
import { Tabs, Tab } from "react-bootstrap";
import UploadedPoliciesTab from "../components/tabs/admintabs/uploaded-policies-tab";



const DashboardPage = () => {
    const [regUsers, setRegUsers] = useState<User[]>([]);

   



    const dashCardInfo = [
        {
            title: 'Uploaded Policies',
            img: openBook,
            count: '',
            icon: '',

        },
        {
            title: 'Approved Policies',
            img: checked,
            count: '',
            icon: '',

        },
        {
            title: 'Pending Policies',
            img: timer,
            count: '',
            icon: '',

        },
        {
            title: 'Rejected Policies',
            img: error,
            count: '',
            icon: '',

        },
    ]

    return (
        <div className="w-100">
            <h5 className="font-weight-bold text-primary" style={{ fontFamily: 'title' }}>Dashboard</h5>
            <div className="d-flex gap-5">
                {
                    dashCardInfo.map((info, index) => (<DashboardCard key={index} imgSrc={info.img} title={info.title} />))
                }
            </div>

            <div className="w-100 mt-5">
                <Tabs
                    defaultActiveKey="uploaded"
                    id="uncontrolled-tab-example"
                    variant="underline"
                    className="mb-3"
                >
                    <Tab eventKey="uploaded" title="Uploaded Policies"
                    tabClassName="px-3"
                    >
                        <UploadedPoliciesTab />
                    </Tab>
                    <Tab eventKey="approved" title="Approved Policies">
                        Tab content for Profile
                    </Tab>
                    <Tab eventKey="pending" title="Policies Pending Approval">
                        Tab content for Contact
                    </Tab>

                    <Tab eventKey="rejected" title="Rejected Policies">
                        Tab content for Contact
                    </Tab>
                </Tabs>
                
            </div>
        </div>
    )

}

export default DashboardPage;