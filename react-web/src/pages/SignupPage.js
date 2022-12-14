import { Box, Button, ChakraProvider, Checkbox, Divider, FormControl, FormErrorMessage, FormLabel, Heading, Highlight, HStack, Image, Input, InputGroup, InputRightElement, Link, Spinner, Stack, Text, useToast } from "@chakra-ui/react";
import theme from "../theme";
import { Formik, Form, Field } from 'formik';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons'
import React from "react";
import axios from 'axios';
import Cookies from 'universal-cookie';
import { NavLink } from "react-router-dom";
import { Buffer } from 'buffer';

function SignupPage() {

    const cookies = new Cookies();

    const [usernameChecking, setUsernameChecking] = React.useState(false);
    const [usernameAvailable, setUsernameAvailable] = React.useState(false);
    const [password, setPassword] = React.useState("");
    const [session, setSession] = React.useState(cookies.get('mirky-anon-session'));
    const toast = useToast()

    React.useEffect(() => {
        if (session === undefined) {
            window.location.href = '/properties'
        }
    });

    const validateEmail = (values) => {
        let errors
        if (!values) {
            errors = "Email is required";
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values)) {
            errors = 'Invalid email address';
        }

        return errors
    }

    function validateFirstName(value) {
        let error
        if (!value) {
          error = 'First Name is required'
        }
        return error
    }

    function validateLastName(value) {
        let error
        if (!value) {
          error = 'Last Name is required'
        }
        return error
    }

    function validateUsername(value) {
        let error
        if (!value) {
          error = 'Username is required'
        } else if (value.length < 3) {
            error = 'Username must be at least 3 characters'
        } else if (value.length > 20) {
            error = 'Username must be less than 20 characters'
        }
        return error
    }

    function validatePassword(value) {
        let error
        if (!value) {
            error = 'Password is required'
        } else if (value.length < 8) {
            error = 'Password must be at least 8 characters'
        } else if (value.length > 50) {
            error = 'Password must be less than 50 characters'
        }
        setPassword(value)
        return error
    }

    function validateConfirmPassword(value) {
        let error
        if (!value) {
            error = 'Confirm Password is required'
        } else if (value !== password) {
            error = 'Passwords do not match'
        }
        return error
    }

  return (
    <ChakraProvider theme={theme}>
      <Box >
        <Box
            h={'100vh'}
            w={'100%'}
            p={10}
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            flexDir={'column'}
            bgColor={'rgba(0,0,0,0.5)'}
            bgGradient='linear(to-r, brandBlurple.900, brandPurple.900)'
        >
            <Heading>
                Create Your Account
            </Heading>

            <Box
                p={10}
                bgColor={'whiteAlpha.300'}
                borderRadius={'20'}
                justifyContent={'center'}
                alignContent={'center'}
                alignItems={'center'}
                display={'flex'}
                flexDir={'column'}
                mt={10}
            >

                <Stack spacing={5} w={'fit-content'}>

                    <FormControl isRequired>
                        <Formik
                            initialValues={{ email: null, firstName: null, lastName: null, username: null, password: null, confirmPassword: null, termsAccepted: false, joinMaillist: true }}
                            onSubmit={(values, actions) => {
                                setTimeout(() => {
                                    
                                    axios.post('https://api.mirky.app/v1/auth/signup', {
                                        email: values.email,
                                        firstName: values.firstName,
                                        lastName: values.lastName,
                                        username: values.username,
                                        password: values.password,
                                        termsAccepted: values.termsAccepted,
                                        joinMaillist: values.joinMaillist,
                                    }, {
                                        headers: {
                                            "Authorization": "Basic " + Buffer.from(session.id + ":" + session.password).toString('base64'),
                                        }
                                    }).then(res => {
                                        let data = res.data
                                        if (data.message === "User created, session replaced") {
                                            cookies.remove('mirky-anon-session')
                                            cookies.set('mirky-session', data.session, { path: '/' })

                                            toast({
                                                title: "Account Created",
                                                description: "Your account has been created successfully.",
                                                status: "success",
                                                duration: 5000,
                                                isClosable: true,
                                            })

                                            window.location.href = '/add-property'
                                        } else {
                                            toast({
                                                title: "Error",
                                                description: data.message,
                                                status: "error",
                                                duration: 5000,
                                                isClosable: true,
                                            })
                                        }
                                    }).catch(err => {
                                        console.log(err)
                                        toast({
                                            title: "Error",
                                            description: "An error occurred while creating your account.",
                                            status: "error",
                                            duration: 5000,
                                            isClosable: true,
                                        })
                                    })

                                    actions.setSubmitting(false)
                                }, 1000)
                            }}
                        >

                        {(props) => (
                            <Form>
                                <HStack>
                                    <Field name='firstName' validate={validateFirstName}>
                                        {({ field, form }) => (
                                        <FormControl isRequired isInvalid={form.errors.firstName && form.touched.firstName}>
                                            <FormLabel>First Name</FormLabel>
                                            <Input {...field} placeholder='Joe' />
                                            <FormErrorMessage>{form.errors.firstName}</FormErrorMessage>
                                            <Box h={5}></Box>
                                        </FormControl>
                                        )}
                                    </Field>
                                    <Field name='lastName' validate={validateLastName}>
                                        {({ field, form }) => (
                                        <FormControl isRequired isInvalid={form.errors.lastName && form.touched.lastName}>
                                            <FormLabel>Last Name</FormLabel>
                                            <Input {...field} placeholder='Shmoe' />
                                            <FormErrorMessage>{form.errors.lastName}</FormErrorMessage>
                                            <Box h={5}></Box>
                                        </FormControl>
                                        )}
                                    </Field>
                                </HStack>
                                <Field name='email' validate={validateEmail}>
                                    {({ field, form }) => (
                                    <FormControl isRequired isInvalid={form.errors.email && form.touched.email}>
                                        <FormLabel>Email</FormLabel>
                                        <Input {...field} placeholder='name@domain.com' type={'email'} />
                                        <FormErrorMessage mb={5}>{form.errors.email}</FormErrorMessage>
                                        <Box h={5}></Box>
                                    </FormControl>
                                    )}
                                </Field>
                                <Field name='username' validate={validateUsername}>
                                    {({ field, form }) => (
                                    <FormControl isRequired isInvalid={form.errors.username && form.touched.username}>
                                        <FormLabel>Username</FormLabel>
                                        <Input {...field} placeholder='joe.shmoe' />
                                        <FormErrorMessage mb={5}>{form.errors.username}</FormErrorMessage>
                                        <Box h={5}></Box>
                                    </FormControl>
                                    )}
                                </Field>
                                <Field name='password' validate={validatePassword}>
                                    {({ field, form }) => (
                                    <FormControl isRequired isInvalid={form.errors.password && form.touched.password}>
                                        <FormLabel>Password</FormLabel>
                                        <Input {...field} placeholder='greatPassword'type={'password'}  />
                                        <FormErrorMessage mb={5}>{form.errors.password}</FormErrorMessage>
                                        <Box h={5}></Box>
                                    </FormControl>
                                    )}
                                </Field>
                                <Field name='confirmPassword' validate={validateConfirmPassword}>
                                    {({ field, form }) => (
                                    <FormControl isRequired isInvalid={form.errors.confirmPassword && form.touched.confirmPassword}>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <Input {...field} placeholder='greatPassword' type={'password'} />
                                        <FormErrorMessage mb={5}>{form.errors.confirmPassword}</FormErrorMessage>
                                        <Box h={5}></Box>
                                    </FormControl>
                                    )}
                                </Field>
                                <Field type="checkbox" name="termsAccepted" >
                                    {({ field, form }) => (
                                    <FormControl isRequired isInvalid={form.errors.termsAccepted && form.touched.termsAccepted}>
                                        <Checkbox
                                            id="termsAccepted"
                                            name="termsAccepted"
                                            onChange={form.handleChange}
                                            isChecked={form.values.termsAccepted}
                                            colorScheme="brandBlurple"
                                        >
                                            I agree to the ToS and Privacy Policy
                                        </Checkbox>
                                        <Box h={2}></Box>
                                    </FormControl>
                                    )}
                                </Field>
                                <Field type="checkbox" name="joinMaillist" >
                                    {({ field, form }) => (
                                    <FormControl isInvalid={form.errors.joinMaillist && form.touched.joinMaillist}>
                                        <Checkbox
                                            id="joinMaillist"
                                            name="joinMaillist"
                                            onChange={form.handleChange}
                                            isChecked={form.values.joinMaillist}
                                            colorScheme="brandBlurple"
                                            defaultChecked={true}
                                        >
                                            I want to recieve news and updates
                                        </Checkbox>
                                        <Box h={2}></Box>
                                    </FormControl>
                                    )}
                                </Field>
                                
                                <Button
                                    mt={4}
                                    colorScheme='brandBlurple'
                                    isLoading={props.isSubmitting}
                                    type='submit'
                                >
                                    Submit
                                </Button>
                            </Form>
                        )}
                        </Formik>
                    </FormControl>
                    <NavLink to={'/login'}>
                        <Link _hover={{ color: 'brandBlurple.200', textDecoration: 'underline' }}>
                            Already have an account?
                        </Link>
                    </NavLink>
                </Stack>

            </Box>

        </Box>
      </Box>
    </ChakraProvider>
  );
}

export default SignupPage;
