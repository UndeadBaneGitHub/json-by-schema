import styled from 'styled-components';

const ListItemInnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0.7em 1.1em;
  background-color: ${(props) => {
    if (props.expanded) {
      return props.invalid ? '#d88282' : '#e2e2e2';
    }
    return props.invalid ? '#ff999a' : '#fff';
  }};
  opacity: ${(props) => {
    if (props.empty) {
      if (props.expanded) {
        return 0.6;
      }
      return 0.4;
    }
    return 1;
  }};
  border-left: ${(props) => {
    if (props.invalid) {
      return props.expanded ? '4px solid rgba(125,0,0,0.45)' : 'initial';
    }
    return props.expanded ? '4px solid rgba(0,0,0, 0.45)' : 'initial';
  }};
  font-size: inherit;
  font-family: 'Helvetica Neue', Helvetica, 'Open Sans', Arial, sans-serif;
  line-height: 1.5;
  text-align: left;
  cursor: inherit;

  ${(props) => {
    if (!props.changed) {
      return '';
    }
    if (props.expanded) {
      if (props.invalid) {
        return `
        background: repeating-linear-gradient(
          135deg,
          rgba(125, 20, 0, 0.5),
          rgba(125, 20, 0, 0.5) 30px,
          #d88282 30px,
          #d88282 60px
        );
        `;
      }
      return `
        background: repeating-linear-gradient(
          135deg,
          #eeeeee,
          #eeeeee 30px,
          #e2e2e2 30px,
          #e2e2e2 60px
        );
        `;
    } else if (props.invalid) {
      return `
        background: repeating-linear-gradient(
          135deg,
          #eeeeee,
          #eeeeee 30px,
          #ff999a 30px,
          #ff999a 60px
        );
        `;
    }
    return `
        background: repeating-linear-gradient(
          135deg,
          #eeeeee,
          #eeeeee 30px,
          #ffffff 30px,
          #ffffff 60px
        );
        `;
  }};
`;

export default ListItemInnerWrapper;
