export interface IBMCustomersPublic {
    customerName: string,
    customerNumber: string,
    ownerId:string,
    customerType: string
    kycReferenceNumber: string
    level: string
    rating: number
    rcNumber: string
    riskLevel: string
    Id?:number
    
}

export interface IBMOwnersPublic {
    AuthorizeBy?: string
    AuthorizeDate?: string
    BVN?: string
    BusinessName: string
    Category?: string
    CategoryDescription?: string
    Comments?: string
    CountryId?: string
    CountryName?: string
    CreatedBy?: string
    CreatedDate?: string
    CustomerNumber: string
    Id?: number
    IdNumber?: string
    IdType: string
    IsAuthorized?: boolean
    IsPEP?: boolean
    IsRejected?: boolean
    Level?: any
    NumberOfShares?: number
    ParentId?: number
    PercentageHolding?: number
    RcNumber?: string
    RejectedBy?: string
    RejectedDate?: string
    RiskLevel?: string
    RiskScore?: number
    Ticker?: string
}

export interface IApprovedBMOOwner {
    AuthorizeBy?: string
    AuthorizeDate?: string
    BeneficiaryOwnerDetailMapId:number
    BeneficiaryOwnerDetails:[
        IBMOwnersPublic
    ]
    BVN?: string
    BusinessName: string
    Category?: string
    CategoryDescription?: string
    Comments?: string
    CountryId?: string
    CountryName?: string
    CreatedBy?: string
    CreatedDate?: string
    CustomerNumber: string
    Id?: number
    IdNumber?: string
    IdType: string
    IsAuthorized?: boolean
    IsPEP?: boolean
    IsRejected?: boolean
    Level?: any
    NumberOfShares?: number
    ParentId?: number
    PercentageHolding?: number
    RcNumber?: string
    RejectedBy?: string
    RejectedDate?: string
    RiskLevel?: string
    RiskScore?: number
    Ticker?: string
}

export interface IUnAuthUserNavLink {
    ownerId?: any
    customerNumber:any
    name: string
}