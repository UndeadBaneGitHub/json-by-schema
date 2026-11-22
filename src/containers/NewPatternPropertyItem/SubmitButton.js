import styled from 'styled-components';

const SubmitButton = styled.input.attrs({
  type: 'submit',
})`
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(props) => (props.disabled ? '0.3' : '0.75')};
  width: 100%;
  text-align: center;

  &:hover {
    opacity: ${(props) => (props.disabled ? '0.3' : '1')};
  }
`;

export default SubmitButton;
