import Navbar from "../../../components/dashboard/Navbar";
import Card from "../../../components/dashboard/CategoriesPageCard";

export default function Categories ()  {

     const categories = [
  {
    image: "/provider.jpg",
    title: "John Doe",
 tasks: [
    "Fix leaking pipes",
    "Install bathroom fittings",
    "Water heater repair"
  ]    
  },
  {
    image: "/provider.jpg",
    title: "Mary Okafor",
tasks: [
    "Fix leaking pipes",
    "Install bathroom fittings",
    "Water heater repair"
  ]      
  },
  {
    image: "/provider.jpg",
    title: "James Musa",
tasks: [
    "Fix leaking pipes",
    "Install bathroom fittings",
    "Water heater repair",
     "Fix leaking pipes",
    "Install bathroom fittings",
    "Water heater repair"
  ]     
  },
];

   return (
  <>
    <Navbar />

    <div className="px-9 py-8">

        <h1 className="font-semibold text-3xl mb-7">Explore Categories</h1>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 mt-5">
      {categories.map((pro, idx) => (
        <Card key={idx} {...pro} />
      ))}
    </div>
    </div>
  </>
);

};