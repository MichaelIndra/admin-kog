export interface ServiceTypeData{
    id: number;
    service_type: string;
    service_type_content : { [key: string]: string };
    service_type_url : string;
    pastor_id : number;
    service_type_image: string;
    service_type_thumbnail: string;
}