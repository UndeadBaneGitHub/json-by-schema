import styled from 'styled-components';

const Button = styled.input`
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(props) => (props.disabled ? '0.3' : '0.75')};
  &:hover {
    opacity: ${(props) => (props.disabled ? '0.3' : '1')};
  }
`;

export default Button;
