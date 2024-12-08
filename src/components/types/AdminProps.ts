export interface AdminData{
    id: number
    fullname: string
    email: string
    role : "GUEST" | "USER" | "ADMIN"
    password? :string
    telephone_number: string
    date_of_birth : string
    gender : "MALE" | "FEMALE"
}