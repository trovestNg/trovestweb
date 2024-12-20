export interface IPolicy{
authorizedBy: string,
authorizedTime: string,
comment:string,
deadlineDate: string,
deleteAuthorizedBy: string,
deleteAuthorizedTime: string,
deleteRequestedBy: string,
deleteRequestedTime: string,
departmentId: number,
fileDescription: string,
fileLocation: string,
fileName: string,
id: number|string,
isAuthorized: boolean,
isDeleted:boolean,
isRejected: boolean,
lastReminderSent: string,
markedForDeletion: boolean,
policyRejectedBy: string,
rejectedTime: string,
reminderFrequency: string,
subsidiaryId: number
uploadTime: string,
uploadedBy: string
url: string,
isAttested:boolean,
subsidiaryName:string
policyDepartment:string
subsidiaries:[{}]
}

export interface IPolicyEdit {
authorizedBy:string,
authorizedTime:string,
comment:string,
deadlineDate:string,
deleteAuthorizedBy:string,
deleteAuthorizedTime:string,
deleteRequestedBy:string,
deleteRequestedTime:string,
fileDescription:string,
fileLocation:string,
fileName:string,
id:number,
isAuthorized:boolean,
isDeleted:boolean,
isRejected:boolean,
lastReminderSent:string
markedForDeletion:boolean,
policyDepartment:string,
policyRejectedBy:string
rejectedTime:string
reminderFrequency:string,
subsidiaryId:string,
uploadTime:string,
uploadedBy:string,
url:string,
policyDocument: null,
Subsidiary: string
}