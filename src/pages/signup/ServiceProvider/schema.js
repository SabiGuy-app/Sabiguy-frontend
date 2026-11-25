import * as Yup from "yup";

export const SignUpSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Must be 8 characters or more")
    .max(20, "Must not exceed 20 characters")
    .matches(/[A-Z]/, "Must include at least one uppercase letter")
    .matches(/[a-z]/, "Must include at least one lowercase letter")
    .matches(/\d/, "Must include at least one number")
    .matches(/[^A-Za-z0-9]/, "Must include at least one special character")
    .required("Password is required"),
  //   term: Yup.boolean().oneOf([true], 'This field is required'),
  phoneNumber: Yup.string()
    .matches(/^\d+$/, "Phone number must contain digits only")
    .length(11, "Phone number must be 11 digits")
    .required("Please enter your phone number"),
  firstName: Yup.string().trim().required("Please enter your first name"),
  lastName: Yup.string().trim().required("Please enter your last name"),
});

export const PersonalInfoSchema = Yup.object().shape({
  gender: Yup.string().required("Please select your gender"),
  city: Yup.string().required("Please enter your city"),
  address: Yup.string().required("Please enter your address"),
  nin: Yup.string()
    .matches(/^\d{11}$/, "NIN must be exactly 11 digits")
    .required("Please enter your NIN"),
});
