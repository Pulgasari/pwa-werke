window.onload = () => {
  'use strict';

  let container = document.getElementById('main');
  let md = await loadFile( 'md/Das Wesen der Menschlichen Kopfarbeit.md' );
  container.innerHTML = markdown( md );
  
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('./sw.js');
  }
}


async function loadFile( filepath ){

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
