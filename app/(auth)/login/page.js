'use client';

import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '@/app/components/firebase/firebase-config';
import bcrypt from 'bcryptjs'; // Import bcryptjs
import { checkIfLoggedIn } from '@/app/components/user/checkIfLoggedIn';
import Link from 'next/link';

const checkUserAndPassword = async (username, password) => {
  // Query Firestore for the user with the given username
  const userQuery = query(
    collection(firestore, 'users'),
    where('username', '==', username)
  );

  try {
    const querySnapshot = await getDocs(userQuery);

    // Check if the username exists
    if (!querySnapshot.empty) {
      // User found, get the first document (assuming username is unique)
      const userDoc = querySnapshot.docs[0];
      const storedHashedPassword = userDoc.data().password;

      // Compare the entered password with the stored hashed password
      const isPasswordValid = bcrypt.compareSync(
        password,
        storedHashedPassword
      );

      if (isPasswordValid) {
        console.log('User authenticated successfully.');
        return userDoc.id; // Return the Firestore document ID (user ID)
      } else {
        console.log('Invalid password.');
        return null; // Return null if the password doesn't match
      }
    } else {
      console.log('User not found.');
      return null; // Return null if the username doesn't exist
    }
  } catch (error) {
    console.error('Error checking user:', error);
    return null; // Return null in case of an error
  }
};

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [forgetPassword, setForgetPassword] = useState(false);
  const [tryingToLogin, setTryingToLogin] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const submitHandler = () => {
    // Login function (stores user ID in localStorage)
    const loginUser = async (username, password) => {
      if (username && password) {
        setTryingToLogin(true);
        const userId = await checkUserAndPassword(username, password);
        if (userId) {
          localStorage.setItem('userId', userId);
          window.location.pathname = '/chats';
        } else {
          setErrorMessage('Login failed. Check your username and password.');
        }
        setTryingToLogin(false);
      } else {
        if (!username) {
          if (!username && !password) {
            setErrorMessage('Both username and password are necessary');
          } else {
            setErrorMessage('Username field empty');
          }
        } else {
          setErrorMessage('Fill password');
        }
      }
    };

    // Check if the user is logged in (retrieve user ID from localStorage)

    loginUser(username, password);
  };

  useEffect(() => {
    checkIfLoggedIn();
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden font-mono">
      {tryingToLogin && (
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
            <div className="relative h-full w-1/2 flex items-center px-32">
              {forgetPassword ? (
                <div className="relative h-auto w-full">
                  <div className="relative flex h-auto w-auto">
                    <div
                      onClick={() => {
                        setForgetPassword(false);
                      }}
                      className="relative h-8 flex items-center gap-2 w-auto text-gray-600 hover:text-gray-800 cursor-pointer"
                    >
                      <div className="relative h-8 flex items-center justify-center">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          {' '}
                          <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                      </div>
                      <div className="relative text-sm flex items-center">
                        go back?
                      </div>
                    </div>
                  </div>
                  <div className="relative text-xs text-gray-600 w-full pt-8">
                    <div className="relative">
                      Forgot it? No worries, Chief! Let’s reset and get you back
                      in the game! 🔥🔑
                    </div>
                  </div>
                  <div className="relative h-auto w-auto text-xs pt-16">
                    What was your email used?
                  </div>
                  <div className="relative h-auto w-full pt-8">
                    <div className="relative h-10 w-full border rounded-md">
                      <input
                        onChange={(e) => {
                          setUsername(e.target.value);
                        }}
                        type="email"
                        className="outline-none h-full w-full bg-transparent border-none text-xs px-4"
                        placeholder="email"
                      />
                    </div>
                  </div>
                  <div className="relative h-auto w-auto pt-8 flex">
                    <div
                      className={`relative h-10 w-auto px-8 text-xs cursor-pointer shadow-md shadow-gray-40 ${
                        password != '' && username != ''
                          ? 'bg-gray-800'
                          : 'bg-gray-600'
                      } text-white flex items-center justify-center select-none rounded-md`}
                    >
                      Verification code?
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative h-auto w-full">
                  <div className="relative text-xs text-gray-600 w-full">
                    <div className="relative">
                      Step in, Chief—log in to unlock the chat vibes! 🚀✨
                    </div>
                  </div>
                  <div className="relative h-auto w-auto text-xs pt-16">
                    {errorMessage ? (
                      <div className="relative text-red-600">
                        {errorMessage}
                      </div>
                    ) : (
                      'Fill your Info'
                    )}
                  </div>
                  <div className="relative h-auto w-full pt-8">
                    <div className="relative text-xs font-medium text-gray-600 pb-2">
                      Username
                    </div>
                    <div className="relative h-10 w-full border rounded-md">
                      <input
                        onChange={(e) => {
                          setUsername(e.target.value);
                        }}
                        type="text"
                        className="outline-none h-full w-full bg-transparent border-none text-xs px-4"
                        placeholder="username"
                      />
                    </div>
                  </div>
                  <div className="relative h-auto w-full pt-6">
                    <div className="relative text-xs font-medium text-gray-600 pb-2">
                      Password
                    </div>
                    <div className="relative h-10 w-full border flex rounded-md">
                      <input
                        onChange={(e) => {
                          setPassword(e.target.value);
                        }}
                        type={showPassword ? 'text' : 'password'}
                        className="outline-none h-full w-full bg-transparent border-none text-xs px-4"
                        placeholder="password"
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
                    <div className="relative flex pt-4">
                      <div
                        onClick={() => {
                          setForgetPassword(true);
                        }}
                        className="relative h-auto w-auto text-xs cursor-pointer text-gray-600 hover:underline"
                      >
                        Forget password?
                      </div>
                    </div>
                  </div>
                  <div className="relative h-auto w-auto pt-8">
                    <div
                      onClick={() => {
                        submitHandler();
                      }}
                      className={`relative h-10 w-40 text-xs cursor-pointer shadow-md shadow-gray-40 ${
                        password != '' && username != ''
                          ? 'bg-gray-800'
                          : 'bg-gray-600'
                      } text-white flex items-center justify-center select-none rounded-md`}
                    >
                      Login
                    </div>
                  </div>
                  <div className="relative flex pt-4">
                    <div className="relative h-auto w-auto text-xs cursor-pointer text-gray-600">
                      Don't have an account?
                      <div className="relative flex items-center pt-2 gap-3">
                        <Link
                          href="/signup"
                          className="relative hover:text-gray-800 text-gray-600 font-bold underline"
                        >
                          Sign up{' '}
                        </Link>
                        now to get started!
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
