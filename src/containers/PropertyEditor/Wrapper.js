import styled from 'styled-components';

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: ${(props) => (props.isChild ? 450 : 0)}px;
  width: 600px;
  max-width: 600px;
  padding: 1em 1.5em;
  background-color: #f9f9f9;

  overflow-y: auto;
`;

export default Wrapper;
