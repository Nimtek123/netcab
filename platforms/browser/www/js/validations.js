////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                         validation & prevention functions                                          //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// *****
// NOTES
//   * jQuery 1.11 REQUIRED
//   * Valid years = 1945 - 2044 : validDateDMY(), validDateYMD(), validIDnum()
// *****

if (typeof HasChanged === 'undefined') HasChanged = false;


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// when you add class has-error, use this function to add an error message to an input / tzxtarea / etc
// when you remove class has-error, call the function without a message and any existing error message will be removed
/* required css:
   .errmsg
   {
      display: none;
   }

   .has-error:hover + .errmsg
   {
      background: #e60000;
      color: white;
      border: 3px solid white;
      border-radius: 7px;
      box-shadow: 0 0 7px 3px #980000;
      display: block;
      font-weight: bold;
      margin: 2px;
      padding: 5px 8px;
      position: absolute;
      z-index: 300;
   }

   // if the error message is lost underneath the border of the parent element, set a permanent class of err-go-up on the input
   .err-go-up.has-error:hover + .errmsg
   {
      top: -35px;
   }
*/

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// prevention - limit chars that can be used
// Use: onkeypress="return TextOnly(event)"
function TextOnly(e)
{
   var unicode = e.charCode? e.charCode : e.keyCode
   // allow backspace 8, tab 9, space 32, end 35, home 36, left arrow 37, ampersand 38, single quote 39, right arrow 39,
   //       ( 40, ) 41, comma 44, dash 45, full stop 46, del 46, / 47, colon 58, semicolon 59, question mark 63, underscore 95
   var charOK = [8,9,32,35,36,37,38,39,40,41,44,45,46,47,58,59,63,95];
   var aok = $.inArray(unicode, charOK);
   // not an approved char & also not numbers, capital & small letters
   if (aok<0)  // only test further if not an approved char
      if (unicode<48 || (unicode>57 && unicode<65) || (unicode>90 && unicode<97) || unicode>122)
         return false;  // disable key press
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// prevention - limit chars that can be used in a text area
// Use: onkeypress="return TextAreaOnly(event)"
function TextAreaOnly(e)
{
   var unicode = e.charCode? e.charCode : e.keyCode
   // allow backspace 8, tab 9, enter, space 32, ! 33, end 35, home 36, left arrow 37, ampersand 38, single quote 39, right arrow 39,
   //       ( 40, ) 41, comma 44, dash 45, full stop 46, del 46, / 47, colon 58, semicolon 59, question mark 63, underscore 95
   var charOK = [8,9,13,32,33,35,36,37,38,39,40,41,44,45,46,47,58,59,63,95];
   var aok = $.inArray(unicode, charOK);
   // not an approved char & also not numbers, capital & small letters
   if (aok<0)  // only test further if not an approved char
      if (unicode<48 || (unicode>57 && unicode<65) || (unicode>90 && unicode<97) || unicode>122)
         return false;  // disable key press
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// validate a text input - min length and check for unlawful chars
function validText(fieldID, minlen)
{
   if (typeof minlen === 'undefined') minlen = 2;
   var alphaExp = /^[-_&:;,.?'/() 0-9a-zA-Z]+$/;
   var field = $.trim($("#"+fieldID).val());
   var fieldLow = field.toLowerCase();

   if (minlen == 0 && field.length == 0 || field.length >= minlen && field.match(alphaExp) && fieldLow.indexOf("http") < 0 && fieldLow.indexOf("www") < 0 && fieldLow.indexOf("ftp") < 0)
   {
      $("#"+fieldID).removeClass("has-error");
      HasChanged = true;
      return true;
   }
   else
   {
      $("#"+fieldID).addClass("has-error");
      return false;
   }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// validate a text area input - as above but also allows newline, carriage return and tab
function validTextArea(fieldID, minlen, maxlines)
{
   if (typeof minlen === 'undefined') minlen = 2;
   if (typeof maxlines === 'undefined') maxlines = -1;
   var alphaExp = /^[-_&:;,.?'!/() 0-9a-zA-Z\s]+$/;  // the final \s allows space, newline, carriage return and tab
   var field = $.trim($("#"+fieldID).val());
   if (field.length >= minlen && field.match(alphaExp) && (maxlines < 0 || field.split("\n").length <= maxlines))
   {
      $("#"+fieldID).removeClass("has-error");
      HasChanged = true;
      return true;
   }
   else
   {
      $("#"+fieldID).addClass("has-error");
      return false;
   }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// validate an email address input
function validEmail(fieldID)
{
   var email_pattern = /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,4}$/i;  
   var field = $.trim($("#"+fieldID).val());
   var atpos = field.indexOf("@");
   var dot1pos = field.indexOf(".", atpos);
   var dot2pos = field.lastIndexOf(".");
   if (!field.match(email_pattern) || atpos < 1 || dot1pos - atpos < 3 || field.length - dot2pos < 3)
   {
      $("#"+fieldID).addClass("has-error");
      return false;
   }
   else
   {
      $("#"+fieldID).removeClass("has-error");
      HasChanged = true;
      return true;
   }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// validate a url input
// regex from  https://gist.github.com/dperini/729294, Author: Diego Perini
function validUrl(fieldID, require)
{
   if (typeof require !== 'boolean') require = true;
   var field = $.trim($("#"+fieldID).val());
   if (field.length > 3)
   {
      var url3 = field.substr(0,3);
      if (url3 == "www" || url3 != "htt")
         field = "http://"+field;
   }
   // first decode to get rid of existing codes, then encode - otherwise it encodes the encoding!
   field = decodeURI(field);
   field = encodeURI(field);
   $("#"+fieldID).val(field);
   var pattern = /^(?:(?:https?:)?\/\/)?(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+\.)+(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+(?::\d{2,5})?(?:\/\S*)?$/i;

   if ((!require && field.length == 0) || pattern.test(field))
   {
      $("#"+fieldID).removeClass("has-error");
      HasChanged = true;
      return true;
   }
   else
   {
      $("#"+fieldID).addClass("has-error");
      return false;
   }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// validate dates of type d monthname yyyy
function validDateDMY(fieldID, require)
{
   if (typeof require !== 'boolean') require = true;
   var isOK = true;
   var m31 = ["Jan","January","Mar","March","May","Jul","July","Aug","August","Oct","October","Dec","December"];
   var m30 = ["Apr","April","Jun","June","Sep","September","Nov","November"];
   var m29 = ["Feb","February"];
   var minYear = 1945;
   var maxYear = 2044;
   var v = $.trim($("#"+fieldID).val());

   if (!require && v.length == 0)
      isOK = true;
   else if (typeof v === "string" && v.length > 9 && v.match(/^\d{1,2} [a-zA-Z]{3,9} \d{4}$/) )
   {
      var ymd = v.split(' ');
      if (ymd[2] < minYear || ymd[2] > maxYear || ymd[0] < 1) isOK = false;
      else if (m31.indexOf(ymd[1]) > -1)
      {
         if (ymd[0] > 31) isOK = false;
      }
      else if (m30.indexOf(ymd[1]) > -1)
      {
         if (ymd[0] > 30) isOK = false;
      }
      else if (m29.indexOf(ymd[1]) > -1)
      {
         // leap years: not all centuries! only those divisable by 400; all non-centuries divisable by 4
         if (ymd[2] % 400 == 0 || ymd[2] % 4 == 0 && ymd[2] % 100 != 0)
         {
            if (ymd[0] > 29) isOK = false;
         }
         else if (ymd[0] > 28) isOK = false;
      }
      else isOK = false;
   }
   else isOK = false;

   if (isOK)
   {
      $("#"+fieldID).removeClass("has-error");
      addErrMsg(fieldID);
   }
   else
   {
      $("#"+fieldID).addClass("has-error");
      addErrMsg(fieldID, "This date must have the format: day month year<br>where the month is the full month name or the first 3 letters of it, and the year must be the full 4 digits");
   }
   return isOK;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// validate dates of type yyyy-mm-dd
function validDateYMD(fieldID, require)
{
   if (typeof require === 'string' && require == "valu")
   {
      require = true;
      var v = $.trim(fieldID);
      fieldID = "";
   }
   else
   {
      var v = $.trim($("#"+fieldID).val());
      if (typeof require !== 'boolean') require = true;
   }
   var isOK = true;
   var minYear = 1945;
   var maxYear = 2044;
   var m31 = [1,3,5,7,8,10,12];
   var m30 = [4,6,9,11];

   if (!require && v.length == 0)
      isOK = true;
   else if (typeof v === "string" && v.length == 10 && v.match(/^\d{4}-\d{2}-\d{2}$/) )
   {
      var ymd = v.split('-');
      ymd[0] = parseInt(ymd[0], 10);
      ymd[1] = parseInt(ymd[1], 10);
      ymd[2] = parseInt(ymd[2], 10);
      if(ymd[0] < minYear || ymd[0] > maxYear || ymd[1] < 1 || ymd[1] > 12 || ymd[2] < 1)
         isOK = false;
      else if (m31.indexOf(ymd[1]) > -1)
      {
         if (ymd[2] > 31) isOK = false;
      }
      else if (m30.indexOf(ymd[1]) > -1)
      {
         if (ymd[2] > 30) isOK = false;
      }
      else if (ymd[1] == 2)
      {
         // leap years: not all centuries! only those divisable by 400; all non-centuries divisable by 4
         if (ymd[0] % 400 == 0 || (ymd[0] % 4 == 0 && ymd[0] % 100 != 0))
         {
            if (ymd[2] > 29) isOK = false;
         }
         else if (ymd[2] > 28) isOK = false;
      }
   }
   else isOK = false;

   if (fieldID.length > 0)
   {
      if (isOK)
      {
         $("#"+fieldID).removeClass("has-error");
         addErrMsg(fieldID);
      }
      else
      {
         $("#"+fieldID).addClass("has-error");
         addErrMsg(fieldID, "This date must have the format: yyyy-mm-dd<br>where yyyy is a 4-digit year number, mm is a 2-digit month number, and dd is a 2-digit day number. The hyphens inbetween are required");
      }
   }
   return isOK;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// prevention - only allow numeric input
// Use: onkeypress="return NumbersOnly(event)"
// Use for tel nos: onkeypress="return NumbersOnly(event,true)"
function NumbersOnly(e,tel)
{
   if (typeof tel === 'undefined') tel = false;    // not a telephone number
   var unicode=e.charCode? e.charCode : e.keyCode
   // allow backspace 8, tab 9, end 35, home 36, left arrow 37, right arrow 39, full stop 46, del 46; 0 - 9 = 48 - 57
   var charOK = [8,9,35,36,37,39,46,48,49,50,51,52,53,54,55,56,57];
   var aok = $.inArray(unicode, charOK);
   if (aok<0)  // only test further if not an approved char
      // if a tel no - allow + for international numbers, ( ) and space
      if (!tel || unicode!=43 && unicode!=32 && unicode!=40 && unicode!=41)
         return false                           // disable key press
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// replacement for parseInt - returns the integer portion
function toInteger(x)
{
   x = x.toString().trim().replace(/[^0-9](.*)$/, "");
   if (x.length == 0) x = "0";
   else if (x.length > 15) x = x.substr(0,15);  // php has a limit of 15 digits
   return x;
}
// validate an INTEGER number input
// you can specify any one or none of minval, maxval, or exactlen
// you can also specify minval & maxval (exactlen will not be checked) or minval & exactlen
function validIntNum(fieldID, minval, maxval, exactlen)
{
   if (typeof minval !== 'number') minval = -1;
   if (typeof maxval !== 'number') maxval = -1;
   if (typeof exactlen !== 'number') exactlen = -1;
   var allOK = false;
   var field = $("#"+fieldID).val();
   field = toInteger(field);

   if (minval > -1 && maxval > -1)
   {
      // min and max values
      if (field < minval)
         field = minval;
      else if (field > maxval)
         field = maxval;
      allOK = true;
   }
   else if (minval > -1 && exactlen > -1)
   {
      // min value and exactlen
      if (field < minval) 
         field = minval;
      if (field.length == exactlen)
         allOK = true;
   }
   else if (minval > -1)
   {
      // min value, no max
      if (field < minval)
         field = minval;
      allOK = true;
   }
   else if (maxval > -1)
   {
      // max value, no min
      if (field > maxval)
         field = maxval;
      allOK = true;
   }
   else if (exactlen > -1)
   {
      // exact length
      if (field.length == exactlen)
         allOK = true;
   }
   else
      allOK = true;
   $("#"+fieldID).val(field);

   if (allOK)
   {
      $("#"+fieldID).removeClass("has-error");
      addErrMsg(fieldID);
      HasChanged = true;
      return true;
   }
   else
   {
      $("#"+fieldID).addClass("has-error");
      var msg = "This must be an integer";
      if (minval > -1 && maxval > -1) msg += " between "+minval+" and "+maxval;
      else if (minval > -1) msg += " with a minimum value of "+minval;
      else if (maxval > -1) msg += " with a maximum value of "+maxval;
      if (exactlen > -1) msg += ", and it must be exactly "+exactlen+" digit(s) in length";
      addErrMsg(fieldID, msg);
      return false;
   }
}
// legacy function name ...
function validNum(fieldID, minval, maxval, exactlen)
{
   return validIntNum(fieldID, minval, maxval, exactlen);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// validate decimal number
function validDecNum(fieldID, dp, allowZero)
{
   if (typeof dp !== 'number') dp = -1;
   if (typeof allowZero !== 'boolean') allowZero = false;

   var field = $("#"+fieldID).val();
   if (isNaN(field)) field = 0;
   if (dp > -1)
      field = Number(field).toFixed(dp);     // force fixed number of dp - also puts in leading 0
   else
      field = Number(field);
   $("#"+fieldID).val(field);
   if (!allowZero && field == 0)
   {
      $("#"+fieldID).addClass("has-error");
      var msg = "This must be a decimal number";
      if (dp > -1) msg += " with "+dp+" decimal place(s)";
      if (allowZero) msg += ", or it can be zero";
      else msg += "; zero is not allowed";
      addErrMsg(fieldID, msg);
      return false;
   }
   else
   {
      $("#"+fieldID).removeClass("has-error");
      addErrMsg(fieldID);
      HasChanged = true;
      return true;
   }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// validate a telephone number input
// eg. 033 330 7333, (033) 330 7333, +27 (0)33 330 7333, ...
function validTelno(fieldID)
{
   var tel_pattern = /^[0-9() ]+$/;
   var field = $.trim($("#"+fieldID).val());
   var prefix = field.substr(0,1);
   if (prefix === "(")
   {
      prefix = field.substr(0,2);
      field = field.substr(2);
   }
   else
      field = field.substr(1);
   if (!field.match(tel_pattern) || (prefix != "+" && prefix != "0" && prefix != "(0") || field.length<9)
   {
      $("#"+fieldID).addClass("has-error");
      return false;
   }
   else
   {
      $("#"+fieldID).removeClass("has-error");
      HasChanged = true;
      return true;
   }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// validate an SA ID number input
function validIDnum(fieldID)
{
   var allOK = true;
   var field = $.trim($("#"+fieldID).val());
   var pattern = /^\d+$/;
   if (field == null || field.length != 13 || !field.match(pattern))
      allOK = false;
   if (allOK)
   {
      var yy = parseInt(field.substr(0,2),10);
      // 1945 - 2044
      if (yy < 45) yy = "20"+yy;
      else yy = "19"+yy;
      allOK = validDateYMD(yy+"-"+field.substr(2,2)+"-"+field.substr(4,2), "valu");
   }

   if (!allOK)
   {
      $("#"+fieldID).addClass("has-error");
      return false;
   }
   else
   {
      $("#"+fieldID).removeClass("has-error");
      HasChanged = true;
      return true;
   }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// validate a set of checkboxes - at least 1 checked
// pass the name of the "set" of checkboxes OR pass the jQuery identifier and jQueryid = true
function validCheckbox(fieldname, jQueryid)
{
   if (typeof jQueryid !== 'boolean') jQueryid = false;
   if (jQueryid)
      var checkb = $(fieldname);
   else
      var checkb = $("input[name^='"+fieldname+"']");

   if (checkb.filter(':checked').length == 0)
   {
      checkb.wrap("<span style='background-color:#e60000' />");
      return false;
   }
   else
   {
      checkb.wrap("<span style='background-color:white' />");
      HasChanged = true;
      return true;
   }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// check that one radio button within a group (rName) has been checked
function validRadio(fieldname)
{
   var radiob = $("input[name='"+fieldname+"']");
   if (radiob.filter(':checked').length == 0)
   {
      radiob.wrap("<span style='background-color:#e60000' />");
      return "";
   }
   else
   {
      radiob.wrap("<span style='background-color:white' />");
      HasChanged = true;
      return radiob.filter(':checked').val();
   }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// check that a dropdown / select value has been selected
function validSelect(fieldID, allowZero)
{
   if (typeof allowZero !== "boolean") allowZero = false;
   var dd = $("#"+fieldID).prop("selectedIndex");
   if (dd < 0 || !allowZero && dd < 1)
   {
      $("#"+fieldID).addClass("has-error");
      addErrMsg(fieldID, "Please select an option from the drop-down list");
      return false;
   }
   else
   {
      $("#"+fieldID).removeClass("has-error");
      addErrMsg(fieldID);
      HasChanged = true;
      return true;
   }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////