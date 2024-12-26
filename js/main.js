window.onload = () => {
  'use strict';

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('./sw.js');
  }
}


function loadFile( filepath ){

  console.log('function called: loadFile()');
  console.log( filepath );
  
fetch( filepath )
  .then(response => {
    // When the page is loaded convert it to text
    return response.text()
  })
  .then(html => {
    console.log('Content of File successfully loaded.');
    return html;
  })
  .catch(error => {
     console.error('Failed to fetch page: ', error)
  })

} 
