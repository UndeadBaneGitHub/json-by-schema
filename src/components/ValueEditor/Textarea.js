import styled from 'styled-components';

const Textarea = styled.textarea.attrs({ autoFocus: true })`
  outline: none;
  width: 100%;
  background-color: #dddce1;
  padding: 0.7em;
  border-radius: 0.5em;
  color: black;
`;

export default Textarea;
