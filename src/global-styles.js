import { createGlobalStyle } from 'styled-components';

// Clearfix
//
// For modern browsers
// 1. The space content is one way to avoid an Opera bug when the
//    contenteditable attribute is included anywhere else in the document.
//    Otherwise it causes space to appear at the top and bottom of elements
//    that are clearfixed.
// 2. The use of `table` rather than `block` is only necessary if using
//    `:before` to contain the top-margins of child elements.
//
// Source: http://nicolasgallagher.com/micro-clearfix-hack/

/* eslint no-unused-expressions: 0 */
export const GlobalStyle = createGlobalStyle`
  .json-by-schema {
    height: 100%;
    width: 100%;
    
    font-family: 'Helvetica Neue', Helvetica, 'Open Sans', Arial, sans-serif;
    &.fontLoaded {
      font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    }
    
    p,
    label {
      font-family: Georgia, Times, 'Times New Roman', serif;
      line-height: 1.5em;
    }
    
    .clearfix {
      &:before,
      &:after {
        content: ' '; /* 1 */
        display: table; /* 2 */
      }
      &:after {
        clear: both;
      }
    }

    button,
    input,
    select,
    textarea {
      background-color: transparent;
      border-style: none;
      color: inherit;
      font-size: 1em;
      margin: 0;
    }
    
    .text-button {
      padding: 0.6em 0.8em;
      color: #2b7ccd;
      
      font-size: 1.15em;
      outline: none;
      font-family: Helvetica, 'Helvetica Neue', 'Open Sans', Arial, sans-serif;
    
      &:focus {
        text-decoration: underline;
      }
    }
    
    input, textarea, select {
      font-family: Helvetica, 'Helvetica Neue', 'Open Sans', Arial, sans-serif;
    }
    
    .scroll-style {
      &::-webkit-scrollbar {
        width: 10px;
      }
    
      &::-webkit-scrollbar-track {
        background: #eee;
      }
    
      &::-webkit-scrollbar-thumb {
        background: #aaa;
      }
    }
  
    .hyphenate {
      /* Careful, this breaks the word wherever it is without a hyphen */
      overflow-wrap: break-word;
      word-wrap: break-word;
    
      /* Adds a hyphen where the word breaks */
      -webkit-hyphens: auto;
      -ms-hyphens: auto;
      -moz-hyphens: auto;
      hyphens: auto;
    }
    
    .ellipses {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    
    .property-being-dragged {
      border: 2px solid #eee;
      z-index: 50;
    } 
  }
`;
