import {
  DriverInfoSection,
  DomesticInfoSection,
  EmergencyInfoSection,
  HomeRepairInfoSection,
  ProfessionalInfoSection,
  FreelanceInfoSection,
} from "./InfoSection";
import { BeautyAndPersonalCareSection } from "../BeautyAndPersonalCare";

export const jobSections = {
  transport: DriverInfoSection,
  beauty_personal_care: BeautyAndPersonalCareSection,
  domestic: DomesticInfoSection,
  home_repair: HomeRepairInfoSection,
  emergency: EmergencyInfoSection,
  professional: ProfessionalInfoSection,
  freelance: FreelanceInfoSection,

  // etc.
};
