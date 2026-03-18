import AccountSetupLayout from "./layout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../../../../components/InputField";
import { ErrorMessage, Formik } from 'formik';
import * as Yup from "yup";
import { IoIosArrowBack, IoIosAdd } from "react-icons/io";
import axios from "axios";


export default function AccountTypeForm({onNext, initialValues, onBack}) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (values) => {
    setLoading(true);
    setErrorMessage('');
    console.log("AccountType submit values:", values);
    
   const email = localStorage.getItem("email");
       const google_email =   localStorage.getItem("google-email")

const token = localStorage.getItem("token");

try {
  const accountType = values.accountType;
  const uploadEndpoint =`${import.meta.env.VITE_BASE_URL}/file/${email || google_email}/certificates`;
  let ninUrl = "";
  let cacUrl = "";

  // ✅ Upload NIN Slip (if provided)
  if (values.ninSlip) {
    const ninForm = new FormData();
    ninForm.append("file", values.ninSlip);

    const ninUpload = await axios.post(uploadEndpoint, ninForm, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    ninUrl = ninUpload.data.file?.url || "";
  }

  // ✅ Upload CAC Certificate (if provided)
  if (values.cacFile) {
    const cacForm = new FormData();
    cacForm.append("file", values.cacFile);

    const cacUpload = await axios.post(uploadEndpoint, cacForm, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`, // include token here too
      },
    });

    cacUrl = cacUpload.data.file?.url || "";
  }

  let response;

  if (accountType === "Individual") {
  const providerPayload = {
    ninSlip: ninUrl,
    accountType,
    address: initialValues.address,
    city: initialValues.city,
    gender: initialValues.gender,
    coverageRadius: {
       radius: initialValues.radius,
       allowAnywhere:initialValues.allowAnywhere
        }
  };

  response = await axios.post(
    `${import.meta.env.VITE_BASE_URL}/provider`,
    providerPayload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
};

  // ✅ Step 2: If Business, send business info
  if (accountType === "Business") {
    const businessPayload = {
      businessName: values.businessName,
      cacNumber: values.cacNumber,
      businessAddress: values.businessAddress,
      cacFile: cacUrl,
    };

    response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/provider/business`,
      businessPayload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

       if (response.status === 200 || response.status === 201) {
      
        setSuccessMessage("");
        onNext()
      } else {
          setErrorMessage(data.message || "Something went wrong");
        }
      
    } catch (error) {
      console.error("An error occurred:", error);
      if (error.response) {
        setErrorMessage(error.response.data?.message || "An error occurred");
      } else if (error.request) {
        setErrorMessage("No response from the server. Please try again later.");
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
    };


  const AccountTypeSchema = Yup.object().shape({
    accountType: Yup.string().required("Please select an account type"),
    ninSlip: Yup.mixed().nullable().when("accountType", {
      is: "Individual",
      then: (schema) => schema.required("NIN slip is required"),
      otherwise: (schema) =>
        schema.when("accountType", {
          is: "Business",
          then: (s) => s.required("NIN slip is required"),
          otherwise: (s) => s.nullable(),
        }),
    }),
    businessName: Yup.string().when("accountType", {
      is: "Business",
      then: (schema) => schema.required("Business name is required"),
    }),
    cacNumber: Yup.string().when("accountType", {
      is: "Business",
      then: (schema) => schema.required("CAC registration number is required"),
    }),
    businessAddress: Yup.string().when("accountType", {
      is: "Business",
      then: (schema) => schema.required("Business address is required"),
    }),
    cacFile: Yup.mixed().nullable().when("accountType", {
      is: "Business",
      then: (schema) => schema.required("CAC certificate is required"),
      otherwise: (schema) => schema.nullable(),
    }),
  });

  return (
    
    <AccountSetupLayout currentStep={1}>
      <div className="mt-4">
        <div
    onClick={onBack}
    className="flex items-center gap-2 w-fit mb-8 cursor-pointer"
  >
    <IoIosArrowBack size={24} />
    <h2 className="text-lg">Back</h2>
  </div>
        <h2 className="text-xl font-semibold mb-2">Account Type</h2>
        <p className="text-gray-500 mb-6">
We require this to make your profile setup easier        </p>
<Formik

initialValues={{
  accountType: "",
  ninSlip: null,
  businessName: "",
  cacNumber: "",
  businessAddress: "",
  cacFile: null,
}}
validationSchema={AccountTypeSchema}
onSubmit={(values, { setSubmitting }) => {
    handleSubmit(values)
    setSubmitting(false)
}}

>
            {({
              values,
              setFieldValue,
              setFieldTouched,
              handleSubmit,
              validateForm,
              errors,
              touched,
            }) => (

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          <InputField 
           asRadio
           name ="individual"
  placeholder="Individual"
  value={values.individual}

  isSelected={values.accountType === "Individual"}
  onClick={() => {
    setFieldValue("accountType", "Individual");
    setFieldTouched("accountType", true, true);
  }} />
          <InputField  
          asRadio
          name= "business"
  placeholder="Business"
  value={values.business}
  isSelected={values.accountType === "Business"}
  onClick={() => {
    setFieldValue("accountType", "Business");
    setFieldTouched("accountType", true, true);
  }} />
  <ErrorMessage
    name="accountType"
    component="span"
    className="text-red-500 text-sm"
  />

                    {values.accountType === "Individual" && (
                        <div className="flex flex-col gap-4 mt-4">
                            <p className="font-semibold text-gray-700">Upload required document</p>
                            
                            {/* <InputField
                                label="NIN"
                                placeholder="123456789"
                                italicPlaceholder
                            /> */}
                            
                            <div>
  <p className="font-medium text-gray-700 mb-2">NIN Slip</p>
  <p className="text-sm text-gray-500 mb-3">
    Kindly upload a picture of your CAC certificate (make sure all details are readable)
  </p>

  {/* Hidden file input */}
  <input
    id="ninSlip"
    type="file"
    accept="image/*"
    onChange={(e) => {
      setFieldValue("ninSlip", e.target.files[0]);
      setFieldTouched("ninSlip", true, true);
    }}
    className="hidden"
  />

  {/* Custom styled upload button */}
  <label
    htmlFor="ninSlip"
    className="flex items-center justify-center gap-1 rounded-3xl px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-colors font-semibold cursor-pointer"
  >
    <IoIosAdd size={30} />
    Upload File
  </label>
  {values.ninSlip && (
  <p className="text-sm font-bold text-gray-600 mt-2">{values.ninSlip.name}</p>
)}
  {touched.ninSlip && errors.ninSlip && (
    <p className="text-red-500 text-sm mt-1">{errors.ninSlip}</p>
  )}
</div>

                        </div>
                    )}

                    {values.accountType === "Business" && (
                        <div className="flex flex-col gap-4 mt-4">
                            <p className="font-semibold text-gray-700">Upload required document</p>
                            
                            <InputField
                                name="businessName"
                                label="Registered Business Name"
                                placeholder="Enter the exact name on your CAC certificate"
                                onChange={(e) =>
                      setFieldValue("businessName", e.target.value)
                    }
                            />
                            <ErrorMessage
                              name="businessName"
                              component="span"
                              className="text-red-500 text-sm"
                            />
                            
                            <InputField
                                name= "cacNumber"
                                label="CAC Registration Number"
                                placeholder="e.g BN1234567"
                                italicPlaceholder
                                onChange={(e) =>
                      setFieldValue("cacNumber", e.target.value)
                    }
                            />
                            <ErrorMessage
                              name="cacNumber"
                              component="span"
                              className="text-red-500 text-sm"
                            />
                            
                            <InputField
                                name= "businessAddress"
                                label="Business Address"
                                placeholder="Address"
                                onChange={(e) =>
                      setFieldValue("businessAddress", e.target.value)
                    }
                            />
                            <ErrorMessage
                              name="businessAddress"
                              component="span"
                              className="text-red-500 text-sm"
                            />
                            
                          <div>
  <p className="font-medium text-gray-700 mb-2">CAC Certificate</p>
  <p className="text-sm text-gray-500 mb-3">
    Kindly upload a picture of your CAC certificate (make sure all details are readable)
  </p>

  {/* Hidden file input */}
  <input
    id="cacFile"
    type="file"
    accept="image/*"
    onChange={(e) => {
      setFieldValue("cacFile", e.target.files[0]);
      setFieldTouched("cacFile", true, true);
    }}
    className="hidden"
  />

  {/* Custom styled upload button */}
  <label
    htmlFor="cacFile"
    className="flex items-center justify-center gap-1 rounded-3xl px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-colors font-semibold cursor-pointer"
  >
    <IoIosAdd size={30} />
    Upload File
  </label>
  {values.cacFile && (
  <p className="text-sm text-gray-600 mt-2">{values.cacFile.name}</p>
)}
  {touched.cacFile && errors.cacFile && (
    <p className="text-red-500 text-sm mt-1">{errors.cacFile}</p>
  )}
</div>

                            <div>
  <p className="font-medium text-gray-700 mb-2">NIN Slip</p>
  <p className="text-sm text-gray-500 mb-3">
    Kindly upload a picture of your NIN Slip (make sure all details are readable)
  </p>

  <input
    id="ninSlip"
    type="file"
    accept="image/*"
    onChange={(e) => {
      setFieldValue("ninSlip", e.target.files[0]);
      setFieldTouched("ninSlip", true, true);
    }}
    className="hidden"
  />

  <label
    htmlFor="ninSlip"
    className="flex items-center justify-center gap-1 rounded-3xl px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-colors font-semibold cursor-pointer"
  >
    <IoIosAdd size={30} />
    Upload File
  </label>
  {values.ninSlip && (
  <p className="text-sm text-gray-600 mt-2">{values.ninSlip.name}</p>
)}
  {touched.ninSlip && errors.ninSlip && (
    <p className="text-red-500 text-sm mt-1">{errors.ninSlip}</p>
  )}
</div>

                        </div>
                    )}
                    

        <div className="flex justify-end mt-4">
  <button
    type="submit"
    disabled={loading}
    onClick={async () => {
      const validationErrors = await validateForm();
      console.log("AccountType validation:", {
        values,
        validationErrors,
      });
    }}
    className="p-3 rounded-md text-white bg-[#005823] disabled:opacity-50 disabled:cursor-not-allowed"
  >
  {loading ? "Saving..." : "Save & Continue"}
  </button>
</div>


 {errorMessage && (
                <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
              )}
              {successMessage && (
                <p className="text-green-600 text-sm mt-2">{successMessage}</p>
              )}
            
        </form>
            )}
        </Formik>
      </div>
    </AccountSetupLayout>
  );
}
