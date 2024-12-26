window.onload = () => {
  'use strict';

  useFetchedData( 'md/Das Wesen der Menschlichen Kopfarbeit.md');
  
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('./sw.js');
  }
}

async function loadFile2( url ) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.text(); // Assuming the response is a text string
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        return 'Error fetching data';
    }
}
// Function to use the fetched string
async function useFetchedData(url) {
  //  const result = await loadFile2(url);

  let container = document.getElementById('main');
  let md = await loadFile2( url );
  container.innerHTML = markdown( md );
  
    console.log(result); // Do something with the result
}




const loadFile = async ( filepath ) => {

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
     return 'Error';
  })

} 


const loadFont = ( name ) => {
  // get data from fonts.json
  // apply font to <head>
} 
const getVariable = ( property, selector ) => {
  let el = selector ? document.querySelector(selector) : document.documentElement; // document.querySelector('html');
  var cs = getComputedStyle(el);
  return cs.getPropertyValue(property);
} 
const setVariable = ( property, value, selector ) => {
  let el = selector ? document.querySelector(selector) : document.documentElement; // document.querySelector('html');
  el.style.setProperty( property, value );
}
const getDataValue = ( name, selector ) => {
  let el = selector ? document.querySelector(selector) : document.documentElement; // document.querySelector('html');
  return el.getAttribute( 'data-' + name );
} 
const setDataValue = ( name, value, selector ) => {
  let el = selector ? document.querySelector(selector) : document.documentElement; // document.querySelector('html');
  el.setAttribute( 'data-' + name, value );
} 




