import styled from 'styled-components';

const ItemNameWrapper = styled.h3`
  margin: 0;
  text-decoration: ${(props) => (props.changed ? 'underline' : 'initial')};
`;

export default ItemNameWrapper;
