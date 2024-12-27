(function(){ "use strict";

  this.cookie = ( name, value, days, domain ) => {

    console.log('cookie() called');
  
    if( !name.startsWith('!') && !value && !days ){
  
      // get cookie
      let result = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
      return result ? result[2] : null;
  
    } else {
  
      // set values for removing cookie
      name.startsWith('!') ? ( value = '', days = '-1' ) : '' ;
  
      // set cookie
      let date = new Date;
      date.setTime( date.getTime() + 24 * 60 * 60 * 1000 * ( days || 1000) );
      let theDomain = domain ? ';domain=' + domain : '';
      document.cookie = name + '=' + value + ';path=/;expires=' + date.toGMTString() + theDomain;
  
    }
  
  }

}).call(this);
