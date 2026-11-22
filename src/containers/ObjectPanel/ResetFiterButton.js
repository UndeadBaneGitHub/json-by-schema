import styled from 'styled-components';

const ResetFilterButton = styled.button.attrs({
  type: 'button',
})`
  padding: 0.5em 1em;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  cursor: pointer;
  &:hover {
    font-weight: bold;
  }
  color: #aaa;
`;

export default ResetFilterButton;
