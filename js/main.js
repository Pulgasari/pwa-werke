window.onload = () => {
  'use strict';
  
  let urlParams = new URLSearchParams(document.location.search);
  let id = urlParams.get('id'); // is 

  // render html content
  renderText(id);
  renderTexte();

  // init font
  if( cookie('maintext-font') ){ // check if the related cookie exists and is not empty
    let name = cookie('maintext-font'); // get fontname from cookie
    loadFont(name); // add html/css to <head> to import font from Google Fonts
    setVariable( 'maintext-font', name ); // set fontname to our custom css variable
  }
  
  // initialize modes
  [ 'stylemode', 'viewmode' ]
  .forEach( id => { if( cookie(id) ){ setDataValue( id, cookie(id) ) } });

  // init styles
  [ 'accentcolor', 'brightness', 'fontcolor', 'fontsize', 'headlines-align', 'headlines-font', 'hyphens', 'lineheight', 'maintext-align', 'maintext-font', 'maintext-lineheight' ]
  .forEach( id => { if( cookie(id) ){ setVariable( id, cookie(id) )}});
  
  // register service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js');
  }
}

/*////////// Fundamental Methods //////////*/
//----- Get & Set Custom CSS Variables -----------------------------------
// If no [selector] is not provided it's simply applied to <html> Element.
const getVariable = ( property,        selector ) => {
  let el = selector ? document.querySelector(selector) : document.documentElement;
  var cs = getComputedStyle(el);
  return cs.getPropertyValue(property);
} 
const setVariable = ( property, value, selector ) => {
  console.log('setVariable() was triggered.');
  let el = selector ? document.querySelector(selector) : document.documentElement;
  el.style.setProperty( '--' + property, value );
}
//----- Get & Set Data Attributes (Dataset) ------------------------------
// If no [selector] is not provided it's simply applied to <html> Element.
const getDataValue = ( name,        selector ) => {
  let el = selector ? document.querySelector(selector) : document.documentElement;
  return el.getAttribute( 'data-' + name );
} 
const setDataValue = ( name, value, selector ) => {
  let el = selector ? document.querySelector(selector) : document.documentElement;
  el.setAttribute( 'data-' + name, value );
}
//----- Loading Local Files
const loadFile  = async ( filepath ) => {

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
const loadFile2 = async ( filepath ) => {
    try {
        const response = await fetch( filepath );
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
const loadJSON  = async ( filename ) => {
  let file = await loadFile2( 'json/' + filename + '.json' );
  let json = JSON.parse(file);
  return json;
} 

/*////////// Project Methods //////////*/
//----- UI Methods
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
const setFont  = ( name ) => {
  loadFont(name); // add to <head>
  setVariable( 'maintext-font', name ); // set variable
  cookie( 'maintext-font', name ); // set cookie
}
const setMode  = ( id, value ) => {
        cookie( id, value ); // set as cookie
  setDataValue( id, value ); // set in html
} 
const setStyle = ( id, value ) => {
       cookie( id, value ); // set as cookie
  setVariable( id, value ); // set in html
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
  document.querySelectorAll('.minitab').forEach( el => {
    if( el.id === id ){
      el.style.display = ( el.style.display === 'block' ) ? 'none' : 'block';
    } else {
      el.style.display = 'none';
    }
  });
}

const loadText = async (id) => { /* Delete */
  
  let texte = await loadJSON('fakedata');
  let text = texte.find( item => item.id === id );
  let md = await loadFile2( 'md/' + text.id + '.md' );
  
  let container = document.getElementById('text');
  container.innerHTML = markdown( md );
  
}

// Render HTML Methods
const renderText = async ( id ) => {
  if( !id ){ return; }
  let md = await loadFile2(`md/${id}.md`);
  const markdownit = window.markdownit();
  document.getElementById('text').innerHTML = markdownit.render(md);
  //document.getElementById('text').innerHTML = markdown(md);
}
const renderTexte = async () => {
  
  let html = '';
  let texte = await loadJSON('fakedata');
  
  texte.forEach( el => {
    html += `<div>
              <div class='title'>
                <a href='?id=${el.id}'>${el.title}</a>
              </div>
              <div class='date'>${el.date}</div>
            </div>`;
  });
  
  document.getElementById('texte-list').insertAdjacentHTML( 'beforeend', html );
  
}

// Reading Progress Bar
const setProgress = () => {
  
  let scrollPosition = window.scrollY;
  let textHeight = document.getElementById('text').offsetHeight;
  let viewportHeight = window.innerHeight;
  let progress = scrollPosition + viewportHeight;
  let progressInPercent = progress / textHeight * 100;
  
  document.querySelector('#progress > div').style.width = progressInPercent + '%';
  
}
document.addEventListener( 'scroll', event => { setProgress() });

/*////////// S E T T I N G S //////////*/

//----- VIA BUTTONS
// Alignment of Maintext
document.getElementById('hyphens-disabled' ).addEventListener( 'click', event => { setStyle( 'hyphens', 'none'  )});
document.getElementById('hyphens-enabled'  ).addEventListener( 'click', event => { setStyle( 'hyphens', 'auto'  )});
// Alignment of Maintext
document.getElementById('maintext-align-center' ).addEventListener( 'click', event => { setStyle( 'maintext-align', 'center'  )});
document.getElementById('maintext-align-justify').addEventListener( 'click', event => { setStyle( 'maintext-align', 'justify' )});
document.getElementById('maintext-align-left'   ).addEventListener( 'click', event => { setStyle( 'maintext-align', 'left'    )});
document.getElementById('maintext-align-right'  ).addEventListener( 'click', event => { setStyle( 'maintext-align', 'right'   )});

//----- VIA RANGE
/* Brightness */ document.getElementById('brightness').addEventListener( 'input', event => { setStyle( 'brightness', event.target.value + '%'  ); });
/* Fontsize   */ document.getElementById('fontsize'  ).addEventListener( 'input', event => { setStyle(   'fontsize', event.target.value + 'pt' ); });
/* Lineheight */ document.getElementById('lineheight').addEventListener( 'input', event => { setStyle( 'lineheight', event.target.value + 'em' ); });

//----- VIA SELECT
// Font
document.getElementById('maintext-font').addEventListener( 'change', event => {
  setFont( event.target.value );
});
// Stylemode (Theme)
document.getElementById('stylemode').addEventListener( 'change', event => {
  setMode( 'stylemode', event.target.value );
});
