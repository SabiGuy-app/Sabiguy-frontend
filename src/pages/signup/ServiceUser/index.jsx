import Form from "./form";

export default function SignupPage() {
  const data = {}; // any data you need to pass globally

  return (
    <div className="">
      {/* Sidebar could go here */}
      <Form data={data} />
    </div>
  );
}