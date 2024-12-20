export interface User {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    location?: string,
    favFood: string[],
    hobbies: (string | boolean)[],
}

export interface IUserDashboard {
    fullname: string,
    totalAttested: number,
    totalNotAttested: number,
    totalPolicy: number,
    userDept: string,
    userEmail: string,
    userSubsidiary: string,
    username: string,
    totalUploadedPolicyByInitiator: number,
    totalApprovedPolicy: number,
    totalPendingPolicy: number,
    totalRejectedPolicy: number,
    totalUploadedPolicy: number,
    totalPolicyForAuthorizer: number

}

export interface IUserPolicy {
    authorizedBy: string,
    authorizedTime: string,
    comment: string,
    deadlineDate: string, deleteAuthorizedBy: string,
    deleteAuthorizedTime: string,
    deleteRequestedBy: string,
    deleteRequestedTime: string,
    fileDescription: string,
    fileLocation: string,
    fileName: string, id: number,
    isAttested: boolean,
    isAuthorized: boolean,
    isDeleted: boolean,
    isRejected: boolean,
    lastReminderSent: string,
    markedForDeletion: boolean,
    policyDepartment: string,
    policyRejectedBy: string,
    rejectedTime: string,
    reminderFrequency: string,
    uploadTime: string,
    uploadedBy: string,
    url: string,
    department: string
    policyId: number
    policyName: string
    subsidiaryId: number
}

export interface IUser {
    attestationTime: string,
    deadlineTime: string,
    department: string,
    email: string,
    policyDepartment: string,
    policyId: number,
    policyName: string,
    subsidiary: string,
    url
    : string,
    userName
    : string,
    displayName: string,
    firstName: string,
    lastName: string

}

export interface IBMO {
    customerName: string,
    customerNumber: string,
    customerType: string,
    kycReferenceNumber: string,
    level: string,
    rating: number,
    rcNumber: string,
    riskLevel: string,
}