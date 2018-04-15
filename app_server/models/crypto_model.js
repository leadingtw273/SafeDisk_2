const crypto = require('crypto');

// var key = crypto.randomBytes(10).toString('hex');
// var syn = '';

// var isEncrypt;
// var isDecrypt;

 //make Sync number
 function getRandomArbitrary(min, max) {
     return Math.random() * (max - min) + min;
 }

// //加密
// function encrypt(str, secret) {
//     var cipher = crypto.createCipher('aes192', secret);
//     var enc = cipher.update(str, 'utf8', 'hex');
//     enc += cipher.final('hex');
//     return enc;
// }
// //解密
// function decrypt(str, secret) {
//     var decipher = crypto.createDecipher('aes192', secret);
//     var dec = decipher.update(str, 'hex', 'utf8');
//     dec += decipher.final('utf8');
//     return dec;
// }

// var arr = [0, 0, 0, 0];

// for (var num in arr) {
//     arr[num] = getRandomArbitrary(0, 10).toFixed(3);
// }

// syn = arr.join('/');



// // console.log("arr    => " + arr);

// // console.log("Syn    => " + syn);

// // console.log("key    => " + key);

// isEncrypt = encrypt(syn, key);
// // console.log("encrypt=> " + isEncrypt);

// isDecrypt = decrypt(isEncrypt, key);
// // console.log("decrypt=> " + isDecrypt);

module.exports = {
    getRandomArbitrary: function (min , max) {
        return Math.random() * (max - min) + min;
    },
    encrypt: function (str, secret) { // aes192 加密
        var cipher = crypto.createCipher('aes-128-ecb', secret);
        var enc = cipher.update(str, 'utf8', 'hex');
        enc += cipher.final('hex');
        return enc;
    },
    decrypt: function (str, secret) { // aes192 解密
        var decipher = crypto.createDecipher('aes-128-ecb', secret);
        var dec = decipher.update(str, 'hex', 'utf8');
        dec += decipher.final('utf8');
        return dec;
    },
    getSyn: function (min, max, fix) {
        var arr = [0, 0, 0];

        for (var num in arr) {
            arr[num] = getRandomArbitrary(min, max).toFixed(fix);
        }

        syn = arr.join('/');

        return syn;
    },
    getKey: function (byteMax) {
        return crypto.randomBytes(byteMax).toString('hex');
    }
}