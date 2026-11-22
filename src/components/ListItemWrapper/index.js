import styled from 'styled-components';

const ListItemWrapper = styled.div`
  width: 100%;
  display: block;
  -webkit-box-sizing: border-box;
  margin: 0;
  padding: 0;
  cursor: ${(props) => (props.noSchema ? 'not-allowed' : 'pointer')};
  position: relative;

  border-bottom: 1px solid #e1e1e1;

  z-index: ${(props) => (props.expanded ? 25 : 'initial')};
`;

export default ListItemWrapper;
