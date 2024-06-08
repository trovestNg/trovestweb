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
subsidiaryName:string
policyDepartment:string
}