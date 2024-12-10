'use client';

import { firestore } from '@/app/components/firebase/firebase-config';
import {
  doc,
  getDocs,
  query,
  where,
  collection,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore'; // Firestore addDoc
import { useEffect, useState } from 'react';
import bcrypt from 'bcryptjs';
import { checkIfLoggedIn } from '@/app/components/user/checkIfLoggedIn';
import { setUserOnlineStatus } from '@/app/components/chats/usersStatus';
import Link from 'next/link';

const storeUserInFirestore = async (
  username,
  email,
  password,
  firstName,
  lastName
) => {
  // Check if the username or email already exists
  const usernameQuery = query(
    collection(firestore, 'users'),
    where('username', '==', username)
  );
  const usernameSnapshot = await getDocs(usernameQuery);

  const emailQuery = query(
    collection(firestore, 'users'),
    where('email', '==', email)
  );
  const emailSnapshot = await getDocs(emailQuery);

  // Return null if either username or email exists
  if (!usernameSnapshot.empty) {
    return 'username unavailable';
  }

  if (!emailSnapshot.empty) {
    return 'Email already exists.';
  }

  // Hash the password
  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    // Add user to Firestore and return the user ID
    const docRef = await addDoc(collection(firestore, 'users'), {
      username: username,
      email: email,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
      addedAt: serverTimestamp(),
    });

    // Successfully created the user, now store user ID in localStorage
    localStorage.setItem('userId', docRef.id); // Store user ID in localStorage
    setUserOnlineStatus(docRef.id, true);

    window.location.pathname = '/chats';
    return 'done'; // Return the user ID
  } catch (error) {
    return 'Error creating user'; // Return null if an error occurs
  }
};

// Signup handler
const signup = async (username, email, password, firstName, lastName) => {
  const message = await storeUserInFirestore(
    username,
    email,
    password,
    firstName,
    lastName
  );
  return message;
};

export default function SignUp() {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [username, setUsername] = useState(null);
  const [signingUp, setSigningUp] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const submitHandler = () => {
    const signUpUser = async () => {
      const email = document.getElementById('emailField').value.trim();
      const password = document.getElementById('passwordField').value.trim();
      const username = document.getElementById('usernameField').value.trim();
      const firstName = document.getElementById('firstNameField').value.trim();
      const lastName = document.getElementById('lastNameField').value.trim();

      // Validate first name
      if (!firstName) {
        setErrorMessage('First name field is empty');
        return;
      }
      if (!isValidName(firstName)) {
        setErrorMessage('Invalid FirstName');
        return;
      }

      // Validate last name
      if (!lastName) {
        setErrorMessage('Last name field is empty');
        return;
      }
      if (!isValidName(lastName)) {
        setErrorMessage('Invalid LastName');
        return;
      }

      // Validate username
      if (!username) {
        setErrorMessage('Username field is empty');
        return;
      }

      // Validate email
      if (!email) {
        setErrorMessage('Email field is empty');
        return;
      }

      // Validate password
      if (!password) {
        setErrorMessage('Password field is empty');
        return;
      }

      // Validate password strength
      if (!isPasswordStrong(password)) {
        setErrorMessage('Put a stronger password');
        return;
      }

      // If all checks pass, proceed with signup
      setSigningUp(true);
      const error = await signup(
        username,
        email,
        password,
        firstName,
        lastName
      );
      setErrorMessage(error);
      setSigningUp(false);
    };

    // Helper function to check password strength
    const isPasswordStrong = (password) => {
      const strongPasswordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
      return strongPasswordRegex.test(password);
    };

    // Helper function to validate name
    const isValidName = (name) => {
      const nameRegex = /^[A-Za-z]{1,15}$/; // Only letters, 1-15 characters
      return nameRegex.test(name);
    };

    signUpUser();
  };

  useEffect(() => {
    document
      .getElementById('signUpForm')
      .addEventListener('submit', function (event) {
        event.preventDefault(); // Prevents the form from submitting
        submitHandler();
      });
    checkIfLoggedIn();
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden font-mono">
      {signingUp && (
        <div className="fixed bg-black/40 top-0 left-0 h-screen w-screen flex items-center z-30 justify-center">
          Please wait ....
        </div>
      )}
      <div className="relative h-full w-full overflow-y-auto overflow-x-hidden bg-gradient-to-r from-gray-50 to-white">
        <div className="relative h-screen w-screen">
          <div className="relative h-full w-full flex">
            <div
              className="relative h-full w-1/2 flex items-center px-16"
              style={{
                background: 'url(/assets/images/loginpageimg.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            ></div>
            <div className="relative h-full w-1/2 flex items-center overflow-y-auto">
              <form
                id="signUpForm"
                className="relative h-auto w-full px-32 py-16"
              >
                <div className="relative text-sm text-gray-600 w-full pt-8">
                  <div className="relative">
                    Step in, Chief—log in to unlock the chat vibes! 🚀✨
                  </div>
                </div>
                <div className="relative h-auto w-auto text-xs pt-16">
                  {errorMessage ? (
                    <div className="relative text-red-500 text-sm font-bold">
                      {errorMessage}
                    </div>
                  ) : (
                    'Fill your Info'
                  )}
                </div>
                <div className="relative h-auto w-full pt-8 flex gap-4">
                  <div className="relative w-1/2">
                    <div className="relative text-xs font-medium text-gray-600 pb-2">
                      First Name
                    </div>
                    <div className="relative h-10 w-full border rounded-md">
                      <input
                        type="text"
                        id="firstNameField"
                        className="outline-none h-full w-full bg-transparent border-none text-xs px-4 font-bold"
                        placeholder="First Name"
                      />
                    </div>
                  </div>
                  <div className="relative w-1/2">
                    <div className="relative text-xs font-medium text-gray-600 pb-2">
                      Last Name
                    </div>
                    <div className="relative h-10 w-full border rounded-md">
                      <input
                        type="text"
                        id="lastNameField"
                        className="outline-none h-full w-full bg-transparent border-none text-xs px-4 font-bold"
                        placeholder="Last Name"
                      />
                    </div>
                  </div>
                </div>
                <div className="relative h-auto w-full pt-6">
                  <div className="relative text-xs font-medium text-gray-600 pb-2">
                    Username
                  </div>
                  <div className="relative h-10 w-full border rounded-md">
                    <input
                      type="text"
                      id="usernameField"
                      className="outline-none h-full w-full bg-transparent border-none text-xs px-4 font-bold"
                      placeholder="boggyWoggie"
                    />
                  </div>
                </div>
                <div className="relative h-auto w-full pt-6">
                  <div className="relative text-xs font-medium text-gray-600 pb-2">
                    Email
                  </div>
                  <div className="relative h-10 w-full border rounded-md">
                    <input
                      type="Email"
                      id="emailField"
                      className="outline-none h-full w-full bg-transparent border-none text-xs px-4 font-bold"
                      placeholder="someone@gmail.com"
                    />
                  </div>
                </div>
                <div className="relative h-auto w-full pt-6">
                  <div className="relative text-xs font-medium text-gray-600 pb-2">
                    Password
                  </div>
                  <div className="relative h-10 w-full border flex rounded-md">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="passwordField"
                      className="outline-none h-full w-full bg-transparent border-none text-xs px-4 font-bold"
                      placeholder="*********"
                    />
                    <div
                      onClick={() => {
                        setShowPassword(!showPassword);
                      }}
                      className="relative h-full w-10 cursor-pointer flex items-center justify-center"
                    >
                      {showPassword ? (
                        <svg
                          width="17"
                          height="17"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      ) : (
                        <svg
                          width="17"
                          height="17"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
                <div className="relative h-auto w-auto pt-8">
                  <button
                    type="submit"
                    className={`relative h-10 w-40 text-xs cursor-pointer shadow-md shadow-gray-40 rounded-md ${
                      password != '' && email != '' && username != ''
                        ? 'bg-gray-800'
                        : 'bg-gray-600'
                    } text-white flex items-center justify-center select-none`}
                  >
                    Sign Up
                  </button>
                </div>

                <div className="relative flex pt-4">
                  <div className="relative h-auto w-auto text-xs cursor-pointer text-gray-600">
                    <div className="relative flex items-center pt-2 gap-3">
                      Already have an account?
                      <Link
                        href="/login"
                        className="relative hover:text-gray-800 text-gray-600 font-bold underline"
                      >
                        Login
                      </Link>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
