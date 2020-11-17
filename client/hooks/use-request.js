import axios from "axios";
import { useState } from "react";

const requestHandler = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async () => {
    try {
      setErrors(null);
      const response = await axios[method](url, body);

      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (err) {
      setErrors(
        <div>
          {err.response.data.errors.map((err, index) => (
            <div key={index}> {err.message} </div>
          ))}
        </div>
      );
    }
  };

  return [doRequest, errors];
};

export default requestHandler;
