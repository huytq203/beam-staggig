import Image from 'next/image';
import maintenance from '../public/img/error/maintenance.png';
import { useEffect, useState } from 'react';
const Maintenance = () => {
  const [title, setTitle] = useState('');
  const [message, setMassage] = useState('');
  useEffect(() => {
    setTitle(localStorage.getItem('maintenanceTitle') || '');
    setMassage(localStorage.getItem('maintenanceMessage') || '');
  }, []);

  return (
    <div className="flex justify-center flex-col items-center bg-[#E9EEF0] h-screen">
      <Image src={maintenance} alt="" />
      <div className="flex justify-center flex-col items-center text-center mt-10 w-[80%]">
        <h4 className="text-xl font-black">{title}</h4>
        <p className="text-base mt-5">{message}</p>
      </div>
    </div>
  );
};

export default Maintenance;
