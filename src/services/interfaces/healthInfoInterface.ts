export interface HealthInfoInterface {
  id?: number;
  company_uen: string;
  company_name: string;
  full_name: string;
  company_position: string;
  email: string;
  mobile_no: string;
}

export interface HealthImagesInterface {
  id?: number;
  smeHealthCheckId?: number;
  file: string;
}
