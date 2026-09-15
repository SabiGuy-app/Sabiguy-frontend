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
  phoneNumber: Yup.string()
    .matches(/^\d+$/, "Phone number must contain digits only")
    .length(11, "Phone number must be 11 digits")
    .required("Please enter your phone number"),
  fullName: Yup.string()
    .required("Please enter your first name and last name")
    .test(
      "first-last-name",
      "Please enter your first name and last name",
      (value) => (value ? value.trim().split(/\s+/).length >= 2 : false),
    ),
});
