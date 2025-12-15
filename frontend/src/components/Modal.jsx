import React, { useCallback, useEffect, useState } from "react";
import "./Modal.css";
import { useFetch } from "../services/useFetch";

function Modal({ isOpen, setIsOpen, title, inputs, isLogin=false }) {
  const handleClose = () => {
    setIsOpen(false);
  };
  const FormData = useFetch();
  const [formData, setFormData] = useState({})

  const onSubmit = useCallback(async (e) => {
    e.preventDefault()
    console.log(formData);
    
    FormData(isLogin ? "login/" : "register/", "POST", formData).then(data => {
      console.log(data);
      
    }).catch(err => {
      console.error(err)
    });
    
    
  },[formData, isLogin,  FormData]);
  
  useEffect(() => {
    if (!inputs || inputs.length === 0) return;
    
    const initialData = {};
    inputs.forEach(i => {
      initialData[i.id] = "";
    });
    
    setFormData(initialData);
  }, [inputs]);
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{title}</h2>

       <form onSubmit={onSubmit}>
  {inputs.map((input, index) => (
    <div className="form-group" key={index}>
      <label htmlFor={input.id}>{input.label}</label>
      <input
        type={input.type}
        id={input.id}
        placeholder={input.placeholder}
        value={formData[input.id] || ""}
        onChange={(e) =>
          setFormData(prev => ({
            ...prev,
            [input.id]: e.target.value
          }))
        }
      />
    </div>
  ))}

  <button type="submit" className="btn">Entrar</button>
</form>

        <button className="close-btn" onClick={handleClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
}

export default Modal;
