import styled from 'styled-components';

const Wrapper = styled.div`
  margin: 0 auto;
  width: ${(props) => props.size || '40px'};
  height: ${(props) => props.size || '40px'};
  position: relative;
`;

export default Wrapper;
