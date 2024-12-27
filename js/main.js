window.onload = () => {
  'use strict';

  let texts = loadJSON('fakedata');
  console.log(texts);

  useFetchedData( 'md/Das Wesen der Menschlichen Kopfarbeit.md');

  // initialization
  init(); initFont();

  // register service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js');
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
  //  const result = await loadFile2(url)
  let container = document.getElementById('reader');
  let md = await loadFile2( url );
  container.innerHTML = markdown( md );
}
async function loadJSON( filename ){
  let file = await loadFile2( 'json/' + filename + '.json' );
  let json = JSON.parse(file);
  return json;
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

// Fonts
const loadFont = async ( name ) => {
  console.log('loadFont() was triggered.');
  // get data from fonts.json
  let fonts = await loadJSON('fonts');
  console.log( 'fonts', fonts ); 
  let font = fonts[name];
  // apply font to <head>
  let url = font.url;
  let head = document.querySelector('head');
  head.insertAdjacentHTML( 'beforeend', "<style>@import url('" + url + "');</style>" );
}
const initFont = () => {
  console.log('initFont() was triggered.');

  if( cookie('maintext-font') ){
    let name = cookie('maintext-font');
    // add to <head>
    loadFont(name);
    // set variable
    setVariable( 'maintext-font', name );
  }
}
// CSS Variables
const getVariable = ( property,        selector ) => {
  let el = selector ? document.querySelector(selector) : document.documentElement; // document.querySelector('html');
  var cs = getComputedStyle(el);
  return cs.getPropertyValue(property);
} 
const setVariable = ( property, value, selector ) => {
  console.log('setVariable() was triggered.');
  let el = selector ? document.querySelector(selector) : document.documentElement; // document.querySelector('html');
  el.style.setProperty( '--' + property, value );
}
// Data Attributes (Dataset)
const getDataValue = ( name,        selector ) => {
  let el = selector ? document.querySelector(selector) : document.documentElement; // document.querySelector('html');
  return el.getAttribute( 'data-' + name );
} 
const setDataValue = ( name, value, selector ) => {
  let el = selector ? document.querySelector(selector) : document.documentElement; // document.querySelector('html');
  el.setAttribute( 'data-' + name, value );
}
// The Practice
const setFont  = ( name ) => {
  console.log('setFont() was triggered.');
  // add to <head>
  loadFont(name);
  // set variable
  setVariable( 'maintext-font', name );
  // set cookie
  cookie( 'maintext-font', name );
  // log
  console.log('Font was successfully set. (' + name + ')')
}
const setMode  = ( id, value ) => {
        cookie( id, value ); // set as cookie
  setDataValue( id, value );  // set in html
} 
const setStyle = ( id, value ) => {
       cookie( id, value ); // set as cookie
  setVariable( id, value ); // set in html
  console.log( `setStyle( ${id}, ${value} ) triggered.` );
}

// Handling of Tabs
const openTab = id => {
  // hide all tabs
  document.querySelectorAll('.tab').forEach( el => {
    el.style.display = 'none';
  });
  // unhide tab
  document.getElementById(id).style.display = 'block';
}
// Handling of Minitabs
const toggleMinitab = id => {
  console.log( 'toggleMinitab(' + id + ') triggered.' );
  document.querySelectorAll('.minitab').forEach( el => {
    console.log( 'Processing Minitab: ' + el.id + ' ...' );
    console.log( el.id + ' === ' + id );
    if( el.id === id ){
      console.log( 'minitab to toggle has same id!' );
      el.style.display = ( el.style.display === 'block' ) ? 'none' : 'block';
    } else {
      el.style.display = 'none';
    }
  });
}


function init() {

  // initialize modes
  [ 'stylemode', 'viewmode' ]
  .forEach( id => { if( cookie(id) ){ setDataValue( id, cookie(id) ) } });

  // init styles
  [ 'accentcolor', 'brightness', 'fontcolor', 'fontsize', 'headlines-align', 'headlines-font', 'hyphens', 'lineheight', 'maintext-align', 'maintext-font', 'maintext-lineheight' ]
  .forEach( id => {
    console.log( 'init: ' + id );
    if( cookie(id) ){
      console.log( 'cookie found! its value is: ' + cookie(id) );
      setVariable( id, cookie(id) ) 
    } 
  });
  
} 
const initTexte = async () => {
  
  let html = '';
  let container = document.getElementById('text');
  let texte = await loadJSON('fakedata');
  
  texte.forEach( el => {
    html.concat(
      `<div>
        <div class='title'>Test</div>
        <div class='date'>00.00.0000</div>
      </div>`
    );
  });
  
  container.addAdjacentHTML( 'beforeend', html );
  
}


/*////////// S E T T I N G S //////////*/

//----- VIA BUTTONS
// Alignment of Maintext
document.getElementById('maintext-align-center' ).addEventListener( 'click', event => { setStyle( 'maintext-align', 'center'  )});
document.getElementById('maintext-align-justify').addEventListener( 'click', event => { setStyle( 'maintext-align', 'justify' )});
document.getElementById('maintext-align-left'   ).addEventListener( 'click', event => { setStyle( 'maintext-align', 'left'    )});
document.getElementById('maintext-align-right'  ).addEventListener( 'click', event => { setStyle( 'maintext-align', 'right'   )});

//----- VIA RANGE
// Brightness
document.getElementById('brightness').addEventListener( 'input', event => {
  setStyle( 'brightness', event.target.value + '%' );
});
// Fontsize
document.getElementById('fontsize').addEventListener( 'input', event => {
  setStyle( 'fontsize', event.target.value + 'pt' );
});
// Lineheight
document.getElementById('lineheight').addEventListener( 'input', event => {
  setStyle( 'lineheight', event.target.value + 'em' );
});

//----- VIA SELECT
// Font
document.getElementById('maintext-font').addEventListener( 'change', event => {
  setFont( event.target.value );
});
// Stylemode (Theme)
document.getElementById('stylemode').addEventListener( 'change', event => {
  setMode( 'stylemode', event.target.value );
});
