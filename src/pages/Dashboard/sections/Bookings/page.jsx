import Bookings from "./Bookings";
import SearchingLoader from "../../../../components/dashboard/Searching";

export default function BookingsFlow () {
    const [step, setStep] = useState(0);

    const handleNext = (data) => {
    setFormData(prev => ({ ...prev, ...data }));
    setStep(prev => prev + 1);
  };    const handleBack = () => setStep ((prev) => Math.max (prev -1, 0));

  const forms = [
    <Bookings onNext={handleNext}/>,
    <SearchingLoader onNext={handleNext}/>
  ]
}