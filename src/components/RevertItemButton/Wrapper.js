import styled from 'styled-components';

const Wrapper = styled.button.attrs({
  type: 'button',
})`
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(props) => (props.disabled ? '0.3' : '0.75')};

  padding: 0.5em 0;
  background-color: transparent;
  &:hover {
    opacity: ${(props) => (props.disabled ? '0.3' : '1')};
  }
`;

export default Wrapper;
