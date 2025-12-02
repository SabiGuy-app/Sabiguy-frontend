import { useMemo } from "react";
import { useParams } from "react-router-dom";
import ServicesPage from "../../../../components/dashboard/ServicesPage";
import { useProviderStore } from "../../../../stores/provider.store";
import { Home } from "lucide-react";

export default function DynamicServicePage() {
  const { serviceSlug } = useParams();
  const { providers } = useProviderStore();



  // Convert slug back to readable format
  const serviceName = useMemo(() => {
    if (!serviceSlug) return "";
    return serviceSlug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }, [serviceSlug]);

  // Filter providers for this specific service
const filteredProviders = useMemo(() => {
  console.log('Providers:', providers);
  console.log('Service Name:', serviceName);
  
  if (!providers || providers.length === 0 || !serviceName) {
    return [];
  }

  const filtered = providers.filter((provider) => {
    const firstJob = provider.job?.[0];
    const matches = firstJob?.service?.toLowerCase() === serviceName.toLowerCase();
    console.log('Provider:', provider.name, 'Job:', firstJob?.service, 'Matches:', matches);
    return matches;
  });
  
  console.log('Filtered Providers:', filtered);
  return filtered;
}, [providers, serviceName]);


  return (
    <ServicesPage
      title={serviceName}
      description={`Find professional ${serviceName.toLowerCase()} providers in your area.`}
      providers={filteredProviders}
      breadcrumbs={[
        { label: "", to: "/dashboard", icon: Home },
        { label: "Categories", to: "/dashboard/categories" },
        { label: serviceName },
      ]}
    />
  );
}