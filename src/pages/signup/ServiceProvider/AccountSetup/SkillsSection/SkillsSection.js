import { 
    DriverInfoSection,
    DomesticInfoSection,
    EmergencyInfoSection,
    HomeRepairInfoSection,
    ProfessionalInfoSection,
    FreelanceInfoSection
 } from "./InfoSection";

export const jobSections = {
  transport: DriverInfoSection, 
  domestic: DomesticInfoSection,
  home_repair: HomeRepairInfoSection,
  emergency: EmergencyInfoSection,
  professional: ProfessionalInfoSection,
  freelance: FreelanceInfoSection

  // etc.
};