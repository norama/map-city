import React from 'react';
import { toast } from 'react-toastify';

export const showError = (message) => {
    toast.error(<Error message={message} />, {
        position: toast.POSITION.BOTTOM_CENTER
    });
};

const SEE_CONSOLE = "See console for details.";

const Error = ({ message }) => (
    <div>
        <div>{message}</div>
        <div>{SEE_CONSOLE}</div>
    </div>
);