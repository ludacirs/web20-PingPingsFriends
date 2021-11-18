import React, { useState } from 'react';
import styled from 'styled-components';
import { Palette } from '@lib/styles/Palette';

const InputContainer = styled.div`
  position: relative;
  width: 250px;
  height: 45px;
`;

const StyledInput = styled.input<{ error: string }>`
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 16px 18px 0;
  font-size: 18px;
  border: 1px solid ${(props) => (props.error ? Palette.RED : '')};
  border-radius: 8px;
  &:focus + div {
    transform: translate(19px, 2px) scale(0.8);
    color: ${Palette.ACTIVE};
  }
  &:not(:focus):valid + div {
    transform: translate(19px, 2px) scale(0.8);
  }
`;

const StyledPlaceHolderDiv = styled.div`
  position: absolute;
  color: ${Palette.GRAY};
  transform: translate(18px, 15px);
  transition: 0.2s ease all;
`;

const ErrorMessageDiv = styled.div`
  position: absolute;
  font-size: 12px;
  transform: translate(10px, 50px);
  color: ${Palette.RED};
`;

interface InputProps {
  placeholder: string;
  value?: string;
  name: string;
  handleChange?: React.ChangeEventHandler<HTMLInputElement>;
  type?: 'text' | 'password';
  errorMessage?: string;
}

const Input = ({ type = 'text', placeholder, value, handleChange, name, errorMessage }: InputProps) => {
  const [error, setError] = useState('');
  const handleBlur = () => {
    setError(errorMessage!);
  };
  return (
    <InputContainer>
      <StyledInput error={error} name={name} type={type} required value={value} onChange={handleChange} onBlur={handleBlur} />
      <StyledPlaceHolderDiv>{placeholder}</StyledPlaceHolderDiv>
      <ErrorMessageDiv>{error}</ErrorMessageDiv>
    </InputContainer>
  );
};

export default Input;