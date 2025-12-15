import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/logo.png';  
import Modal from './Modal'

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalRegisterOpen, setIsModalRegisterOpen] = useState(false);
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          {/* Reemplaza el emoji con tu imagen */}
          <img src={logo} alt="SkinScan AI Logo" className="brand-logo-img" />
          <span className="brand-name">ECLIPSE</span>
        </div>
        
        <ul className="navbar-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">Inicio</Link>
          </li>
          <li className="nav-item">
            <Link to="/scanner" className="nav-link active">Escáner</Link>
          </li>
          <li className="nav-item">
            <Link to="/history" className="nav-link">Historial</Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-link">Acerca de</Link>
          </li>
        </ul>
        
        <div className="navbar-actions">
          <button className="btn login-btn" onClick={() => setIsModalOpen(true)}>Iniciar Sesion</button>
          <a onClick={() => setIsModalRegisterOpen(true)}>Register</a>
           <Modal 
           isOpen={isModalOpen}
           setIsOpen={setIsModalOpen}
           isLogin={true}
           title="Iniciar Sesion"
           inputs={[
            { id: "email", label: "Correo electrónico", type: "email", placeholder: "Email" },
            { id: "password", label: "Contraseña", type: "password", placeholder: "Password" }
           ]}/>
           <Modal 
           isOpen={isModalRegisterOpen}
           setIsOpen={setIsModalRegisterOpen}
           title="Registrate"
           inputs={[
            { id: "username", label: "Nombre de Usuario", type: "text", placeholder: "Nombre Usuario" },
            { id: "email", label: "Correo electrónico", type: "email", placeholder: "Correo Electronico" },
            { id: "password", label: "Contraseña", type: "password", placeholder: "Contraseña" }
           ]}/>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;