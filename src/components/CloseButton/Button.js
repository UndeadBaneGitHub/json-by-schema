import styled from 'styled-components';

const Button = styled.button.attrs({
  type: 'button',
})`
  top: 0;
  right: 0;
  position: absolute;
  padding: 0.4em 0.5em;
  font-size: 1.1em;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
`;

export default Button;
