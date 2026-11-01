// Beauty retains its original service options and service-location section.
// Other individual categories import the same layout directly.
import ProviderServicesSection from "./ProviderServicesSection";
import { useServiceCategories } from "../../../../stores/serviceCategories.store";

export function BeautyAndPersonalCareSection(props) {
  const { categories } = useServiceCategories();
  const beauty = categories.find((category) => category.id === "beauty");
  const serviceNames = (beauty?.services || []).map((service) => service.name);
  return <ProviderServicesSection serviceNames={serviceNames} {...props} />;
}
