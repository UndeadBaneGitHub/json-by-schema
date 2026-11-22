import styled from 'styled-components';

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  background-color: #fff;
  width: ${(props) => (props.isJSONMode ? 600 : 450)}px;
  max-width: ${(props) => (props.isJSONMode ? 600 : 450)}px;
  left: ${(props) => (props.isChild ? '450px' : '0')};

  border-right: 1px solid #e1e1e1;

  padding: 0;
  overflow: visible;

  &:after {
    content: '';

    /* Expand element */
    position: absolute;
    left: 0px;
    top: 0px;
    right: 0px;
    bottom: 0px;

    -moz-box-shadow: 2px 0 8px rgba(100, 100, 100, 0.55);
    -webkit-box-shadow: 2px 0 8px rgba(100, 100, 100, 0.55);
    box-shadow: 2px 0 8px rgba(100, 100, 100, 0.55);

    /* Disable click events */
    pointer-events: none;
  }
`;

export default Wrapper;
