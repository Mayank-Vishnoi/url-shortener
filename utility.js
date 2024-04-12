// Converts an integer to a string of length 6 using base 62 encoding.
const base62_encode = num => {

   const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

   if (num === 0) return "000000";

   let encoded = '';

   while (num > 0) {  // loop until all remainders are zero
      const remainder = num % 62; // get the remainder from dividing by 62
      encoded = `${alphabet[remainder]}${encoded}`; // add remainder to beginning of result string 
      num = Math.floor(num / 62); // divide number by 62 and assign it back to itself (integer division)
   }
   
   return `${"0".repeat(6 - encoded.length)}${encoded}`;
};


// Converts a string of length 6 to an integer using base 62 encoding
const base62_decode = str => {
   
   const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

   let num = 0;

   for (let i = 0; i < str.length; i++) {  // loop through each character in the string
      const index = alphabet.indexOf(str[i]);  // get the index of that character from the alphabet string
      num += Math.pow(62, (str.length - 1 - i)) * index;  // add it to our result number according to its position in the input string (exponential)  			}
   }
   
   return num;
};

// Offset time by 5.5 hours (for IST from GMT)
const time_now = () => {
   let date = new Date();

   let offsetTime = date.getTime() + 19800000;

   return `${new Date(offsetTime).getDate()}/${new Date(offsetTime).getMonth() + 1}/${new Date(offsetTime).getFullYear()} ${new Date(offsetTime).getHours()}:${new Date(offsetTime).getMinutes()}:${new Date(offsetTime).getSeconds()}`;
};

module.exports = {
   base62_decode: base62_decode,
   base62_encode: base62_encode,
   time_now: time_now,
};