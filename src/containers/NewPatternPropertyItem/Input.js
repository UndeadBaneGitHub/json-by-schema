import styled from 'styled-components';

const Input = styled.input.attrs({
  type: 'text',
  autoFocus: true,
})`
  margin: 0.25em 0 0.5em 0;
  outline: none;
  width: 100%;
  background-color: #dddce1;
  padding: 0.5em 1em;
  border-radius: 0.5em;
  color: black;
`;

export default Input;
