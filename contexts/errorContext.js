import React, { createContext, useContext, useEffect, useState } from "react";
import { Message } from "semantic-ui-react";

export const ErrorContext = createContext();

const ErrorProvider = ({ children }) => {
  const [errors, setErrors] = useState([]);
  const [successMessages, setSuccessMessages] = useState([]);

  const handleFetchError = (error) => {
    setErrors((prevErrors) => [...prevErrors, error]);
  };

  const handleFetchSuccess = (message) => {
    setSuccessMessages((prevMessages) => [...prevMessages, message]);
  };

  const clearError = (index) => {
    setErrors((prevErrors) => prevErrors.filter((_, i) => i !== index));
  };

  const clearSuccessMessage = (index) => {
    setSuccessMessages((prevMessages) =>
      prevMessages.filter((_, i) => i !== index)
    );
  };

  useEffect(() => {
    successMessages.forEach((_, index) => {
      const timeout = setTimeout(() => {
        clearSuccessMessage(index);
      }, 5000); // Adjust the duration (in milliseconds) as needed
      return () => clearTimeout(timeout);
    });
  }, [successMessages]);

  return (
    <ErrorContext.Provider
      value={{
        errors,
        successMessages,
        handleFetchError,
        handleFetchSuccess,
        clearError,
        clearSuccessMessage,
      }}
    >
      {children}
      <div
        style={{
          position: "fixed",
          top: "1rem",
          right: "1rem",
          zIndex: 9999,
          width: "fit-content",
          maxWidth: "600px",
          minWidth: "300px",
        }}
      >
        {errors.map((error, index) => (
          <Message key={index} negative onDismiss={() => clearError(index)}>
            {error.message}
          </Message>
        ))}
        {successMessages.map((message, index) => (
          <Message
            key={index}
            positive
            onDismiss={() => clearSuccessMessage(index)}
          >
            {message}
          </Message>
        ))}
      </div>
    </ErrorContext.Provider>
  );
};

export const useError = () => useContext(ErrorContext);

export default ErrorProvider;
