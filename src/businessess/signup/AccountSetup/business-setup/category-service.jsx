// Shared services UI: src/components/onboarding/CategoryServiceForm.jsx.
// This wrapper keeps business-only endpoints out of individual onboarding.
import CategoryServiceForm from "../../../../components/onboarding/CategoryServiceForm";
import { saveBusinessServiceDetails, uploadBusinessWorkVisual } from "../../../../api/business";
import BusinessSetupLayout from "../../ServiceProvider/BusinessSetupLayout";

export default function CategoryService(props) {
  return (
    <BusinessSetupLayout currentStep={2} matchIndividual>
      <CategoryServiceForm {...props} onSave={saveBusinessServiceDetails} onUpload={uploadBusinessWorkVisual} />
    </BusinessSetupLayout>
  );
}
