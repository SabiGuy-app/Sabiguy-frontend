import * as Yup from 'yup'

export const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string()
    .min(8, 'Must be 8 characters or more')
    .max(20, 'Must not exceed 20 characters')
    .required('Password is required'),
//   term: Yup.boolean().oneOf([true], 'This field is required'),
});