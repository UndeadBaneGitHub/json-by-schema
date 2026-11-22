import styled from 'styled-components';

const Wrapper = styled.div`
  margin: 0;
  padding: 0.5em 1em;

  border-bottom: 2px solid;
  &:first-child {
    border-top: 2px solid;
  }

  border-color: ${(props) => {
    switch (props.level) {
      case 0: // debug
        return '#eee';
      case 1: // info
        return 'lightblue';
      case 2: // warning
        return 'lightyellow';
      case 3: // error
        return 'rgba(235, 0, 0, 0.8)';
      default:
        return 'none';
    }
  }};
  color: ${(props) => {
    switch (props.level) {
      case 0: // debug
        return '#eee';
      case 1: // info
        return 'lightblue';
      case 2: // warning
        return 'lightyellow';
      case 3: // error
        return 'rgba(235, 0, 0, 0.8)';
      default:
        return 'none';
    }
  }};
  font-weight: bold;
  text-align: center;
  background-color: #ccc;

  width: 100%;

  cursor: pointer;
`;

export default Wrapper;
