import React from 'react';
import { Stack } from '@mui/material';
import { Event } from '@/types';
interface ApplicationSubmitProps {
  handleClose: () => void;
  event: Event;
  setIsApplicationSubmitStep: React.Dispatch<React.SetStateAction<boolean>>;
  setIsApplicationStep: React.Dispatch<React.SetStateAction<boolean>>;
}

interface FormData {
  name: string;
  email: string;
  reason: string;
}

export const ApplicationSubmit: React.FC<ApplicationSubmitProps> = ({
  handleClose,
  event,
  setIsApplicationSubmitStep,
  setIsApplicationStep,
}) => {
  const [formData, setFormData] = React.useState<FormData>({
    name: '',
    email: '',
    reason: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsApplicationSubmitStep(false);
    handleClose();
  };

  return <Stack padding={2.5} spacing={2.5}></Stack>;
};
