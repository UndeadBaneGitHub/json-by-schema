import styled from 'styled-components';

const PatternItemWrapper = styled.div`
  background-color: ${(props) => (props.matching ? '#bffc99' : '#fc7b7f')};
  border-radius: 0.6em;
  padding: 0.3em 1.5em;
  display: table;
`;

export default PatternItemWrapper;
