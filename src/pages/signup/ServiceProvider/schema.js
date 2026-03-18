import * as Yup from 'yup'

export const SignUpSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string()
    .min(8, 'Must be 8 characters or more')
    .max(20, 'Must not exceed 20 characters')
    .required('Password is required'),
//   term: Yup.boolean().oneOf([true], 'This field is required'),
 phoneNumber: Yup.string().required('Please enter your phone number'),
  fullName: Yup.string()
    .required('Please enter your first name and last name')
    .test(
      'first-last-name',
      'Please enter your first name and last name',
      (value) => (value ? value.trim().split(/\s+/).length >= 2 : false),
    ),


});

export const PersonalInfoSchema = Yup.object().shape({
   gender: Yup.string().required('Please select your gender'),
   city: Yup.string().required('Please enter your city'),
   address: Yup.string().required('Please enter your address')
});
