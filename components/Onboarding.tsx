import React, { useState } from 'react';
import type { User } from '../types';

interface OnboardingProps {
  onLogin: (userData: User) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [major, setMajor] = useState('');
  const [course, setCourse] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && email.trim() && major.trim() && course.trim()) {
      onLogin({ 
        username: username.trim(),
        email: email.trim(),
        major: major.trim(),
        course: course.trim()
      });
    }
  };

  const isFormComplete = username.trim() && email.trim() && major.trim() && course.trim();

  const inputClasses = "bg-gray-800 border-2 border-cyan-700 text-white text-center text-lg p-2 rounded-md w-full max-w-sm focus:outline-none focus:ring-4 focus:ring-cyan-500/50 transition duration-300";

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <div className="max-w-3xl bg-black bg-opacity-50 p-8 rounded-lg border border-cyan-500/50 shadow-2xl shadow-cyan-500/20">
        <h1 className="text-4xl md:text-6xl font-orbitron text-cyan-400 mb-4 tracking-wider">
          Bienvenido a Misión UR Steam
        </h1>
        <p className="text-md italic text-gray-400 mb-6 -mt-2">Created by Maker Jorge Guzman</p>
        <p className="text-lg text-gray-300 mb-6 leading-relaxed">
          Creemos en el poder de la tecnología para crear un mundo más inclusivo. A través de Misión UR Steam, aprenderás a diseñar e imprimir en 3D tecnologías de asistencia que pueden cambiar la vida de las personas.
        </p>
        <p className="text-xl text-white mb-8">
          La asistente virtual <span className="text-cyan-400 font-bold">ROSI</span> te guiará. ¿Estás listo para el desafío?
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
          <div className="w-full max-w-sm">
              <label htmlFor="username" className="text-md mb-1 font-semibold block text-left">Nombre de Estudiante:</label>
              <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} className={inputClasses} placeholder="Nombre Completo" />
          </div>
          <div className="w-full max-w-sm">
              <label htmlFor="email" className="text-md mb-1 font-semibold block text-left">Correo Electrónico:</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClasses} placeholder="correo@ejemplo.com" />
          </div>
           <div className="w-full max-w-sm">
              <label htmlFor="major" className="text-md mb-1 font-semibold block text-left">Carrera:</label>
              <input id="major" type="text" value={major} onChange={(e) => setMajor(e.target.value)} className={inputClasses} placeholder="Ej: Ingeniería Biomédica" />
          </div>
           <div className="w-full max-w-sm">
              <label htmlFor="course" className="text-md mb-1 font-semibold block text-left">Asignatura:</label>
              <input id="course" type="text" value={course} onChange={(e) => setCourse(e.target.value)} className={inputClasses} placeholder="Ej: Prototipado 3D" />
          </div>
          <button
            type="submit"
            disabled={!isFormComplete}
            className="mt-6 w-full max-w-sm bg-cyan-600 text-black font-bold text-xl py-3 px-6 rounded-md hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-cyan-500/40 transform hover:scale-105"
          >
            Comenzar Misión
          </button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;