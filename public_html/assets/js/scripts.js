(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)
	var PLUS_URL_SAFE = '-'.charCodeAt(0)
	var SLASH_URL_SAFE = '_'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS ||
		    code === PLUS_URL_SAFE)
			return 62 // '+'
		if (code === SLASH ||
		    code === SLASH_URL_SAFE)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	exports.toByteArray = b64ToByteArray
	exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

}).call(this,require("fsovz6"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../node_modules/browserify/node_modules/base64-js/lib/b64.js","/../../../node_modules/browserify/node_modules/base64-js/lib")
},{"buffer":2,"fsovz6":3}],2:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = Buffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192

/**
 * If `Buffer._useTypedArrays`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (compatible down to IE6)
 */
Buffer._useTypedArrays = (function () {
  // Detect if browser supports Typed Arrays. Supported browsers are IE 10+, Firefox 4+,
  // Chrome 7+, Safari 5.1+, Opera 11.6+, iOS 4.2+. If the browser does not support adding
  // properties to `Uint8Array` instances, then that's the same as no `Uint8Array` support
  // because we need to be able to add all the node Buffer API methods. This is an issue
  // in Firefox 4-29. Now fixed: https://bugzilla.mozilla.org/show_bug.cgi?id=695438
  try {
    var buf = new ArrayBuffer(0)
    var arr = new Uint8Array(buf)
    arr.foo = function () { return 42 }
    return 42 === arr.foo() &&
        typeof arr.subarray === 'function' // Chrome 9-10 lack `subarray`
  } catch (e) {
    return false
  }
})()

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (subject, encoding, noZero) {
  if (!(this instanceof Buffer))
    return new Buffer(subject, encoding, noZero)

  var type = typeof subject

  // Workaround: node's base64 implementation allows for non-padded strings
  // while base64-js does not.
  if (encoding === 'base64' && type === 'string') {
    subject = stringtrim(subject)
    while (subject.length % 4 !== 0) {
      subject = subject + '='
    }
  }

  // Find the length
  var length
  if (type === 'number')
    length = coerce(subject)
  else if (type === 'string')
    length = Buffer.byteLength(subject, encoding)
  else if (type === 'object')
    length = coerce(subject.length) // assume that object is array-like
  else
    throw new Error('First argument needs to be a number, array or string.')

  var buf
  if (Buffer._useTypedArrays) {
    // Preferred: Return an augmented `Uint8Array` instance for best performance
    buf = Buffer._augment(new Uint8Array(length))
  } else {
    // Fallback: Return THIS instance of Buffer (created by `new`)
    buf = this
    buf.length = length
    buf._isBuffer = true
  }

  var i
  if (Buffer._useTypedArrays && typeof subject.byteLength === 'number') {
    // Speed optimization -- use set if we're copying from a typed array
    buf._set(subject)
  } else if (isArrayish(subject)) {
    // Treat array-ish objects as a byte array
    for (i = 0; i < length; i++) {
      if (Buffer.isBuffer(subject))
        buf[i] = subject.readUInt8(i)
      else
        buf[i] = subject[i]
    }
  } else if (type === 'string') {
    buf.write(subject, 0, encoding)
  } else if (type === 'number' && !Buffer._useTypedArrays && !noZero) {
    for (i = 0; i < length; i++) {
      buf[i] = 0
    }
  }

  return buf
}

// STATIC METHODS
// ==============

Buffer.isEncoding = function (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.isBuffer = function (b) {
  return !!(b !== null && b !== undefined && b._isBuffer)
}

Buffer.byteLength = function (str, encoding) {
  var ret
  str = str + ''
  switch (encoding || 'utf8') {
    case 'hex':
      ret = str.length / 2
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8ToBytes(str).length
      break
    case 'ascii':
    case 'binary':
    case 'raw':
      ret = str.length
      break
    case 'base64':
      ret = base64ToBytes(str).length
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = str.length * 2
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.concat = function (list, totalLength) {
  assert(isArray(list), 'Usage: Buffer.concat(list, [totalLength])\n' +
      'list should be an Array.')

  if (list.length === 0) {
    return new Buffer(0)
  } else if (list.length === 1) {
    return list[0]
  }

  var i
  if (typeof totalLength !== 'number') {
    totalLength = 0
    for (i = 0; i < list.length; i++) {
      totalLength += list[i].length
    }
  }

  var buf = new Buffer(totalLength)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

// BUFFER INSTANCE METHODS
// =======================

function _hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  assert(strLen % 2 === 0, 'Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16)
    assert(!isNaN(byte), 'Invalid hex string')
    buf[offset + i] = byte
  }
  Buffer._charsWritten = i * 2
  return i
}

function _utf8Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf8ToBytes(string), buf, offset, length)
  return charsWritten
}

function _asciiWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(asciiToBytes(string), buf, offset, length)
  return charsWritten
}

function _binaryWrite (buf, string, offset, length) {
  return _asciiWrite(buf, string, offset, length)
}

function _base64Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(base64ToBytes(string), buf, offset, length)
  return charsWritten
}

function _utf16leWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf16leToBytes(string), buf, offset, length)
  return charsWritten
}

Buffer.prototype.write = function (string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length
      length = undefined
    }
  } else {  // legacy
    var swap = encoding
    encoding = offset
    offset = length
    length = swap
  }

  offset = Number(offset) || 0
  var remaining = this.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase()

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexWrite(this, string, offset, length)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Write(this, string, offset, length)
      break
    case 'ascii':
      ret = _asciiWrite(this, string, offset, length)
      break
    case 'binary':
      ret = _binaryWrite(this, string, offset, length)
      break
    case 'base64':
      ret = _base64Write(this, string, offset, length)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leWrite(this, string, offset, length)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toString = function (encoding, start, end) {
  var self = this

  encoding = String(encoding || 'utf8').toLowerCase()
  start = Number(start) || 0
  end = (end !== undefined)
    ? Number(end)
    : end = self.length

  // Fastpath empty strings
  if (end === start)
    return ''

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexSlice(self, start, end)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Slice(self, start, end)
      break
    case 'ascii':
      ret = _asciiSlice(self, start, end)
      break
    case 'binary':
      ret = _binarySlice(self, start, end)
      break
    case 'base64':
      ret = _base64Slice(self, start, end)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leSlice(self, start, end)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toJSON = function () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function (target, target_start, start, end) {
  var source = this

  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (!target_start) target_start = 0

  // Copy 0 bytes; we're done
  if (end === start) return
  if (target.length === 0 || source.length === 0) return

  // Fatal error conditions
  assert(end >= start, 'sourceEnd < sourceStart')
  assert(target_start >= 0 && target_start < target.length,
      'targetStart out of bounds')
  assert(start >= 0 && start < source.length, 'sourceStart out of bounds')
  assert(end >= 0 && end <= source.length, 'sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length)
    end = this.length
  if (target.length - target_start < end - start)
    end = target.length - target_start + start

  var len = end - start

  if (len < 100 || !Buffer._useTypedArrays) {
    for (var i = 0; i < len; i++)
      target[i + target_start] = this[i + start]
  } else {
    target._set(this.subarray(start, start + len), target_start)
  }
}

function _base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function _utf8Slice (buf, start, end) {
  var res = ''
  var tmp = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    if (buf[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
      tmp = ''
    } else {
      tmp += '%' + buf[i].toString(16)
    }
  }

  return res + decodeUtf8Char(tmp)
}

function _asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++)
    ret += String.fromCharCode(buf[i])
  return ret
}

function _binarySlice (buf, start, end) {
  return _asciiSlice(buf, start, end)
}

function _hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function _utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i+1] * 256)
  }
  return res
}

Buffer.prototype.slice = function (start, end) {
  var len = this.length
  start = clamp(start, len, 0)
  end = clamp(end, len, len)

  if (Buffer._useTypedArrays) {
    return Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    var newBuf = new Buffer(sliceLen, undefined, true)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
    return newBuf
  }
}

// `get` will be removed in Node 0.13+
Buffer.prototype.get = function (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` will be removed in Node 0.13+
Buffer.prototype.set = function (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

Buffer.prototype.readUInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  return this[offset]
}

function _readUInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    val = buf[offset]
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
  } else {
    val = buf[offset] << 8
    if (offset + 1 < len)
      val |= buf[offset + 1]
  }
  return val
}

Buffer.prototype.readUInt16LE = function (offset, noAssert) {
  return _readUInt16(this, offset, true, noAssert)
}

Buffer.prototype.readUInt16BE = function (offset, noAssert) {
  return _readUInt16(this, offset, false, noAssert)
}

function _readUInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    if (offset + 2 < len)
      val = buf[offset + 2] << 16
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
    val |= buf[offset]
    if (offset + 3 < len)
      val = val + (buf[offset + 3] << 24 >>> 0)
  } else {
    if (offset + 1 < len)
      val = buf[offset + 1] << 16
    if (offset + 2 < len)
      val |= buf[offset + 2] << 8
    if (offset + 3 < len)
      val |= buf[offset + 3]
    val = val + (buf[offset] << 24 >>> 0)
  }
  return val
}

Buffer.prototype.readUInt32LE = function (offset, noAssert) {
  return _readUInt32(this, offset, true, noAssert)
}

Buffer.prototype.readUInt32BE = function (offset, noAssert) {
  return _readUInt32(this, offset, false, noAssert)
}

Buffer.prototype.readInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null,
        'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  var neg = this[offset] & 0x80
  if (neg)
    return (0xff - this[offset] + 1) * -1
  else
    return this[offset]
}

function _readInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt16(buf, offset, littleEndian, true)
  var neg = val & 0x8000
  if (neg)
    return (0xffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt16LE = function (offset, noAssert) {
  return _readInt16(this, offset, true, noAssert)
}

Buffer.prototype.readInt16BE = function (offset, noAssert) {
  return _readInt16(this, offset, false, noAssert)
}

function _readInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt32(buf, offset, littleEndian, true)
  var neg = val & 0x80000000
  if (neg)
    return (0xffffffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt32LE = function (offset, noAssert) {
  return _readInt32(this, offset, true, noAssert)
}

Buffer.prototype.readInt32BE = function (offset, noAssert) {
  return _readInt32(this, offset, false, noAssert)
}

function _readFloat (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 23, 4)
}

Buffer.prototype.readFloatLE = function (offset, noAssert) {
  return _readFloat(this, offset, true, noAssert)
}

Buffer.prototype.readFloatBE = function (offset, noAssert) {
  return _readFloat(this, offset, false, noAssert)
}

function _readDouble (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 7 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 52, 8)
}

Buffer.prototype.readDoubleLE = function (offset, noAssert) {
  return _readDouble(this, offset, true, noAssert)
}

Buffer.prototype.readDoubleBE = function (offset, noAssert) {
  return _readDouble(this, offset, false, noAssert)
}

Buffer.prototype.writeUInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'trying to write beyond buffer length')
    verifuint(value, 0xff)
  }

  if (offset >= this.length) return

  this[offset] = value
}

function _writeUInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 2); i < j; i++) {
    buf[offset + i] =
        (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
            (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt16BE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, false, noAssert)
}

function _writeUInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffffffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 4); i < j; i++) {
    buf[offset + i] =
        (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt32BE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, false, noAssert)
}

Buffer.prototype.writeInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7f, -0x80)
  }

  if (offset >= this.length)
    return

  if (value >= 0)
    this.writeUInt8(value, offset, noAssert)
  else
    this.writeUInt8(0xff + value + 1, offset, noAssert)
}

function _writeInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fff, -0x8000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt16(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt16(buf, 0xffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt16LE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt16BE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, false, noAssert)
}

function _writeInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fffffff, -0x80000000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt32(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt32(buf, 0xffffffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt32LE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt32BE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, false, noAssert)
}

function _writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 23, 4)
}

Buffer.prototype.writeFloatLE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, false, noAssert)
}

function _writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 7 < buf.length,
        'Trying to write beyond buffer length')
    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 52, 8)
}

Buffer.prototype.writeDoubleLE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, false, noAssert)
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (typeof value === 'string') {
    value = value.charCodeAt(0)
  }

  assert(typeof value === 'number' && !isNaN(value), 'value is not a number')
  assert(end >= start, 'end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  assert(start >= 0 && start < this.length, 'start out of bounds')
  assert(end >= 0 && end <= this.length, 'end out of bounds')

  for (var i = start; i < end; i++) {
    this[i] = value
  }
}

Buffer.prototype.inspect = function () {
  var out = []
  var len = this.length
  for (var i = 0; i < len; i++) {
    out[i] = toHex(this[i])
    if (i === exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...'
      break
    }
  }
  return '<Buffer ' + out.join(' ') + '>'
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer._useTypedArrays) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1)
        buf[i] = this[i]
      return buf.buffer
    }
  } else {
    throw new Error('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function (arr) {
  arr._isBuffer = true

  // save reference to original Uint8Array get/set methods before overwriting
  arr._get = arr.get
  arr._set = arr.set

  // deprecated, will be removed in node 0.13+
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

// slice(start, end)
function clamp (index, len, defaultValue) {
  if (typeof index !== 'number') return defaultValue
  index = ~~index;  // Coerce to integer.
  if (index >= len) return len
  if (index >= 0) return index
  index += len
  if (index >= 0) return index
  return 0
}

function coerce (length) {
  // Coerce length to a number (possibly NaN), round up
  // in case it's fractional (e.g. 123.456) then do a
  // double negate to coerce a NaN to 0. Easy, right?
  length = ~~Math.ceil(+length)
  return length < 0 ? 0 : length
}

function isArray (subject) {
  return (Array.isArray || function (subject) {
    return Object.prototype.toString.call(subject) === '[object Array]'
  })(subject)
}

function isArrayish (subject) {
  return isArray(subject) || Buffer.isBuffer(subject) ||
      subject && typeof subject === 'object' &&
      typeof subject.length === 'number'
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    var b = str.charCodeAt(i)
    if (b <= 0x7F)
      byteArray.push(str.charCodeAt(i))
    else {
      var start = i
      if (b >= 0xD800 && b <= 0xDFFF) i++
      var h = encodeURIComponent(str.slice(start, i+1)).substr(1).split('%')
      for (var j = 0; j < h.length; j++)
        byteArray.push(parseInt(h[j], 16))
    }
  }
  return byteArray
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(str)
}

function blitBuffer (src, dst, offset, length) {
  var pos
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length))
      break
    dst[i + offset] = src[i]
  }
  return i
}

function decodeUtf8Char (str) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
  }
}

/*
 * We have to make sure that the value is a valid integer. This means that it
 * is non-negative. It has no fractional component and that it does not
 * exceed the maximum allowed value.
 */
function verifuint (value, max) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value >= 0, 'specified a negative value for writing an unsigned value')
  assert(value <= max, 'value is larger than maximum value for type')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifsint (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifIEEE754 (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
}

function assert (test, message) {
  if (!test) throw new Error(message || 'Failed assertion')
}

}).call(this,require("fsovz6"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../node_modules/browserify/node_modules/buffer/index.js","/../../../node_modules/browserify/node_modules/buffer")
},{"base64-js":1,"buffer":2,"fsovz6":3,"ieee754":4}],3:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

}).call(this,require("fsovz6"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../node_modules/browserify/node_modules/process/browser.js","/../../../node_modules/browserify/node_modules/process")
},{"buffer":2,"fsovz6":3}],4:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

}).call(this,require("fsovz6"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../node_modules/ieee754/index.js","/../../../node_modules/ieee754")
},{"buffer":2,"fsovz6":3}],5:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var time = 750;
var section3Idx = 0;
var section4Idx = 0;

// let FootballFrames, TennisFrames, BaseballFrames, BasketballFrames, FanFrames, IdleFrame;
var tennisAnimation = void 0,
    footballAnimation = void 0,
    basketballAnimation = void 0,
    baseballAnimation = void 0,
    fanAnimation = void 0;

var masterObj = {
	section2CurrentIdx: 0,
	section1CurrentIdx: 0,
	basketball: { loopAmount: 1, loopId: basketballAnimation },
	football: { loopAmount: 1, loopId: footballAnimation },
	tennis: { loopAmount: 1, loopId: tennisAnimation },
	baseball: { loopAmount: 1, loopId: baseballAnimation },
	fan: { loopAmount: 1, loopId: fanAnimation }
};
var homepageMobImages = ['assets/images/homepageMob/basketball.jpg', 'assets/images/homepageMob/football.jpg', 'assets/images/homepageMob/tennis.jpg', 'assets/images/homepageMob/baseball.jpg', 'assets/images/homepageMob/fan.jpg'];

$(document).ready(function () {
	// WAIT FOR gfyCatEmbed VIDEO TO START PLAYING ON MOBILE, THEN HIDE THE LOADING ANIMATION. \\

	if (window.innerWidth < 800) {

		fetch('assets/js/Fantastec_Sprite_Sheet.json').then(function (response) {
			return response.json();
		}).then(function (spriteJson) {
			var IdleFrame = filterByValue(spriteJson.frames, 'idle');
			masterObj.football.animationArray = [].concat(_toConsumableArray(IdleFrame), _toConsumableArray(filterByValue(spriteJson.frames, 'football')));
			masterObj.tennis.animationArray = [].concat(_toConsumableArray(IdleFrame), _toConsumableArray(filterByValue(spriteJson.frames, 'tennis')));
			masterObj.baseball.animationArray = [].concat(_toConsumableArray(IdleFrame), _toConsumableArray(filterByValue(spriteJson.frames, 'baseball')));
			masterObj.basketball.animationArray = [].concat(_toConsumableArray(IdleFrame), _toConsumableArray(filterByValue(spriteJson.frames, 'basket')));
			masterObj.fan.animationArray = [].concat(_toConsumableArray(IdleFrame), _toConsumableArray(filterByValue(spriteJson.frames, 'fan')));

			animatorSetup();
			imageControler(masterObj, 1);

			setInterval(function () {
				imageControler(masterObj, 1);
			}, 5000);
		});
	}

	var filterByValue = function filterByValue(array, string) {
		return array.filter(function (o) {
			return typeof o['filename'] === 'string' && o['filename'].toLowerCase().includes(string.toLowerCase());
		});
	};

	var animatorSetup = function animatorSetup() {

		var lastTime = 0;
		var vendors = ['ms', 'moz', 'webkit', 'o'];
		for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
			window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
			window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
		}

		if (!window.requestAnimationFrame) window.requestAnimationFrame = function (callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function () {
				callback(currTime + timeToCall);
			}, timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};

		if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function (id) {
			clearTimeout(id);
		};
	};

	var animator = function animator(animationObj) {

		var dancingIcon, spriteImage, canvas;

		function gameLoop() {
			$('#loading').addClass('hidden');
			animationObj.loopId = window.requestAnimationFrame(gameLoop);
			dancingIcon.update();
			dancingIcon.render();
		}

		function sprite(options) {

			var that = {},
			    frameIndex = 0,
			    tickCount = 0,
			    loopCount = 0,
			    ticksPerFrame = options.ticksPerFrame || 0,
			    numberOfFrames = options.numberOfFrames || 1;

			that.context = options.context;
			that.width = options.width;
			that.height = options.height;
			that.image = options.image;
			that.loops = options.loops;

			that.update = function () {

				tickCount += 1;

				if (tickCount > ticksPerFrame) {

					tickCount = 0;
					// If the current frame index is in range
					if (frameIndex < numberOfFrames - 1) {
						// Go to the next frame
						frameIndex += 1;
					} else {
						loopCount++;
						frameIndex = 0;

						if (loopCount === that.loops) {
							window.cancelAnimationFrame(animationObj.loopId);
						}
					}
				}
			};

			that.render = function () {

				// Clear the canvas
				that.context.clearRect(0, 0, that.width, that.height);

				that.context.drawImage(that.image, animationObj.animationArray[frameIndex].frame.x, animationObj.animationArray[frameIndex].frame.y, 200, 175, 0, 0, window.innerWidth / 3.846, window.innerWidth / 4.1);
			};

			return that;
		}

		// Get canvas
		canvas = document.getElementById('canvas');
		canvas.width = window.innerWidth / 3.846;
		canvas.height = window.innerWidth / 2.2;

		// Create sprite sheet
		spriteImage = new Image();

		// Create sprite
		dancingIcon = sprite({
			context: canvas.getContext("2d"),
			width: 4040,
			height: 1770,
			image: spriteImage,
			numberOfFrames: animationObj.animationArray.length,
			ticksPerFrame: 4,
			loops: animationObj.loopAmount
		});

		// Load sprite sheet
		spriteImage.addEventListener("load", gameLoop);
		spriteImage.src = 'assets/images/Fantastec_Sprite_Sheet.png';
	};

	// INITIALISE AND SETUP CURRENT PAGE. EXECUTE TRANSITIONS AND REMOVE TINT IF RELEVANT \\

	var pageLoader = function pageLoader(index) {
		if (index === 5) {
			$('.tint').removeClass('removeTint');
			$('.backgroundWrapper').removeClass('scaleBackground');
			$('#section5').find('.heading').addClass('show fadeIn');
			$('.subSection').addClass('scaleBackground');
			$('.subSection').find('.tint').addClass('removeTint');
			$('#section5').find('.textWrapper').addClass('show');
			setTimeout(function () {
				$('.subSection > .textWrapper').find('.heading').addClass('fadeIn');
			}, 1000);
		} else {
			$('.tint').removeClass('removeTint');
			$('.subSection').removeClass('scaleBackground');
			$('.backgroundWrapper:not(#section' + index + 'Background)').removeClass('scaleBackground');
			$('.section.active').find('.backgroundWrapper').addClass('scaleBackground');
			$('section.active').find('.tint').addClass('removeTint');

			if ($('.section' + index + 'PaginatorButton').length && $('.section' + index + 'PaginatorButton.active').length < 1) {
				$('.section' + index + 'PaginatorButton').get(0).click();
			}
		}
	};

	// HIDE ALL BECKGROUNDS IN THE SECTION EXCEPT THE SPECIFIED INDEX, WHICH IS SCALED AND SHOWN. \\

	var initializeSection = function initializeSection(sectionNumber, idx) {
		$('#section' + sectionNumber + 'Background' + idx).siblings('.backgroundWrapper').map(function (ix, ele) {
			$(ele).css({ opacity: 0 });
		});

		$('#section' + sectionNumber + 'Background' + idx).css({
			'transform': 'scale(1.1)',
			'opacity': 1
		});
	};

	// INITIATE initializeSection ON SECTIONS 3 AND 4. \\
	initializeSection(1, 0);
	initializeSection(3, 0);
	initializeSection(4, 0);

	// SECTIONS 2 (ABOUT US SECTION) BACKGROUND IMAGE TRANSITION HANDLER. \\

	var imageControler = function imageControler(idxObj, sectionNumber) {
		var relevantAnimation = void 0;

		if (sectionNumber === 1) {
			switch (idxObj.section1CurrentIdx) {
				case 0:
					relevantAnimation = masterObj.basketball;
					break;
				case 1:
					relevantAnimation = masterObj.football;
					break;
				case 2:
					relevantAnimation = masterObj.tennis;
					break;
				case 3:
					relevantAnimation = masterObj.baseball;
					break;
				case 4:
					relevantAnimation = masterObj.fan;
					break;
			}
		}

		$('#section' + sectionNumber).find('.tint').removeClass('removeTint');
		$('#section' + sectionNumber + 'Background' + idxObj['section' + sectionNumber + 'CurrentIdx']).removeClass('scaleBackground');
		initializeSection(sectionNumber, idxObj['section' + sectionNumber + 'CurrentIdx']);

		setTimeout(function () {
			if (sectionNumber === 1) {
				animator(relevantAnimation);
			}

			$('#section' + sectionNumber).find('.backgroundWrapper').addClass('scaleBackground');
			$('#section' + sectionNumber).find('.tint').addClass('removeTint');
		}, 500);

		if (idxObj['section' + sectionNumber + 'CurrentIdx'] === $('#section' + sectionNumber).find('.backgroundWrapper').length - 1) {
			idxObj['section' + sectionNumber + 'CurrentIdx'] = 0;
		} else {
			idxObj['section' + sectionNumber + 'CurrentIdx'] += 1;
		}
	};

	imageControler(masterObj, 2);

	setInterval(function () {
		imageControler(masterObj, 2);
	}, 15000);

	// PAGINATION BUTTONS CLICK HANDLER FOR SECTIONS 3 AND 4. \\

	var handlePaninationButtonClick = function handlePaninationButtonClick(e) {

		var idx = parseInt($(e.target).attr('data-index'));
		var sectionId = $(e.target).closest('section').attr('id');
		var relevantDataArray = void 0;

		if (sectionId === 'section3') {
			section3Idx = idx;
		}

		if (sectionId === 'section4') {
			section4Idx = idx;
		}

		$('#' + sectionId).find('.tint').removeClass('removeTint');
		$('#' + sectionId).find('.textWrapper').removeClass('show');
		$('#' + sectionId).find('#textWrapper' + idx).addClass('show');
		$('#' + sectionId + 'Background' + idx).removeClass('scaleBackground');
		$('.' + sectionId + 'PaginatorButton').removeClass('active');
		$(e.target).addClass('active');

		initializeSection(parseInt($('#' + sectionId).attr('data-index')), idx);

		setTimeout(function () {
			pageLoader(parseInt($('#' + sectionId).attr('data-index')));
		}, 500);

		if (sectionId !== 'section2') {
			$('#' + sectionId).find('.heading, p').addClass('fadeIn');
			$('#' + sectionId).on('transitionend webkitTransitionEnd oTransitionEnd', function (es) {
				$('#' + sectionId).find('.heading, p').removeClass('fadeIn');
			});
		}
	};

	// CLICK LISTENER FOR PAGINATION BUTTONS ON SECTIONS 3 AND 4. \\

	$('.section3PaginatorButton, .section4PaginatorButton').click(function (e) {
		handlePaninationButtonClick(e);
	});

	// INITIALIZE ONEPAGESCROLL IF NOT IN CMS PREVIEW. \\

	if (!$(location).attr('href').includes('index.php')) {
		$('#scrollerWrapper').onepage_scroll({
			sectionContainer: "section",
			easing: "ease-out",
			animationTime: time,
			pagination: true,
			updateURL: true,
			beforeMove: function beforeMove(index) {},
			afterMove: function afterMove(index) {
				// INITIALIZE THE CURRENT PAGE. \\

				pageLoader(index);
			},
			loop: false,
			keyboard: true,
			responsiveFallback: false,
			direction: "vertical"
		});

		$('#scrollerWrapper').moveTo(1);
	}

	// CONTROL CLICKS ON WORK WITH US SECTION (SECTION5). \\

	$('.clickable').click(function (e) {
		var currentSection = $(e.target).closest($('.subSection'));

		if (currentSection.hasClass('open')) {
			currentSection.removeClass('open');
			currentSection.find('.button, p').removeClass('fadeIn');
			currentSection.siblings('.subSection').map(function (idx, section) {
				$(section).removeClass('closed');
				$(section).find('.tint').removeClass('addTint').addClass('removeTint');
			});
		} else {
			currentSection.removeClass('closed').addClass('open');
			currentSection.on('transitionend webkitTransitionEnd oTransitionEnd', function (es) {
				$('.subSection.open').find('.button, p').addClass('fadeIn');
			});
			currentSection.siblings('.subSection').map(function (idx, section) {
				$(section).removeClass('open').addClass('closed');
				$(section).find('.tint').removeClass('removeTint').addClass('addTint');
				$(section).find('.button, p').removeClass('fadeIn');
			});
		}
		currentSection.find('.tint').removeClass('addTint').addClass('removeTint');
	});

	// CONTROL FOOTER ARROW CLICKS. \\

	$('#downArrow').click(function () {
		if ($(window).height() * ($('.page').length - 1) === -$('#scrollerWrapper').offset().top) {
			$('#scrollerWrapper').moveTo(1);
		} else {
			$('#scrollerWrapper').moveDown();
		}
	});

	// HIDE THE LOADING ANIMATIOPN WHEN VIDEO IS READY TO PLAY ON DEXKTOP. \\

	var hideLoadingAnimation = function hideLoadingAnimation() {
		if (window.innerWidth > 800 && !$('#loading').hasClass('hidden')) {

			if ($('#video').get(0).readyState === 4) {
				$('#loading').addClass('hidden');
			}
		}
	};

	var section3Automated = void 0,
	    automateSection3 = void 0,
	    section4Automated = void 0,
	    automateSection4 = void 0;
	// MANAGEMENT FUNCTION FOR SETTING AND CLEARING THE SLIDE AUTOMATION INTERVALS. \\

	var intervalManager = function intervalManager(flag, sectionId, time) {
		if (flag) {
			if (sectionId === 'section3') {
				automateSection3 = setInterval(function () {
					swipeController(sectionId, 'l');
				}, time);
			}
			if (sectionId === 'section4') {
				automateSection4 = setInterval(function () {
					swipeController(sectionId, 'l');
				}, time);
			}
		} else {
			if (sectionId === 'section3') {
				clearInterval(automateSection3);
			}
			if (sectionId === 'section4') {
				clearInterval(automateSection4);
			}
		}
	};

	// IF NOT IN CMS ADMIN PREVIEW, PERPETUALLY CHECK IF WE ARE AT THE TOP OF THE PAGE AND IF SO, DONT SHOW THE FOOTER OR GREEN SHAPE. \\

	if (!$(location).attr('href').includes('index.php')) {
		setInterval(function () {
			if ($('#scrollerWrapper').offset().top >= 0) {
				$('#headerShape, #footer').addClass('moveOffScreen');
				$('#video').get(0).play();
				$('.arrow').addClass('pulsate');
			} else {
				var timeout = setTimeout(function () {
					$('#headerShape, #footer').removeClass('moveOffScreen');
					$('#video').get(0).pause();
					$('.arrow').removeClass('pulsate');
					clearTimeout(timeout);
				}, time);
			}

			// ROTATE THE ARROW IN THE FOOTER WHEN AT THE BOTTOM OF THE PAGE \\

			if ($('#scrollerWrapper').offset().top < -(window.innerHeight * 4)) {
				$('#downArrow').css({ 'transform': 'rotate(180deg) translateX(-50%)' });
			} else {
				$('#downArrow').css({ 'transform': 'translateX(-50%) rotate(0deg)' });
			}

			hideLoadingAnimation();

			// ADD LANDSCAPE STYLES TO RELEVANT ELEMENTS \\

			if (window.matchMedia("(orientation: landscape)").matches && window.innerWidth < 800) {
				$('.nav_link, #headerShape, #footer, .custom, .marker, #section5, .textWrapper').addClass('landscape');
			} else {
				$('.nav_link, #headerShape, #footer, .custom, .marker, #section5, .textWrapper').removeClass('landscape');
			}

			if ($('#section3.active').length) {
				// AUTOMATE THE SLIDES ON SECTIOPN 3 EVERY 7 SECONDS IF THE SECTION IS ACTIVE. \\
				if (section3Automated !== true) {
					section3Automated = true;
					intervalManager(true, 'section3', 7000);
				}
			} else {
				// STOP AUTOMATED SLIDES ON SECTIOPN 3 IF THE SECTION IS NOT ACTIVE. \\
				if (section3Automated === true) {
					intervalManager(false, 'section3');
					section3Automated = false;
				}
			}

			if ($('#section4.active').length) {
				// AUTOMATE THE SLIDES ON SECTIOPN 4 EVERY 7 SECONDS IF THE SECTION IS ACTIVE. \\
				if (section4Automated !== true) {
					section4Automated = true;
					intervalManager(true, 'section4', 7000);
				}
			} else {
				// STOP AUTOMATED SLIDES ON SECTIOPN 4 IF THE SECTION IS NOT ACTIVE. \\
				if (section4Automated === true) {
					intervalManager(false, 'section4');
					section4Automated = false;
				}
			}
		}, 500);
	}

	// CONTROL WHAT HAPPENS WHEN LINKS IN THE NAV/MENU ARE CLICKED \\

	$('.nav_link').click(function (e) {
		var pageIdx = parseInt($(e.target).attr('data-index'));
		$('#scrollerWrapper').moveTo(pageIdx);
		$('#menuBlockOut').addClass('hidden');

		if (burger.classList.contains('burger--active')) {
			nav.classList.remove('nav_open');
			burger.classList.remove('burger--active');
			document.body.style.position = 'relative';
		}
	});

	// WHEN THE NAV IS OPEN PREVENT USER FROM BEING ABLE TO CLICK ANYTHING ELSE \\

	$('#menuBlockOut').click(function (e) {
		e.stopPropagation();
	});

	var burger = document.getElementById('main-burger'),
	    nav = document.getElementById('mainNav');

	// CONTROL FOR OPEN AND CLOSING THE MENU/NAV  \\

	function navControl() {

		if (burger.classList.contains('burger--active')) {
			nav.classList.remove('nav_open');
			burger.classList.remove('burger--active');
			$('#menuBlockOut').addClass('hidden');
		} else {
			burger.classList.add('burger--active');
			nav.classList.add('nav_open');
			$('#menuBlockOut').removeClass('hidden');
		}
	}

	// ONLY LISTEN FOR MENU CLICKS WHEN NOT IN CMS PREVIEW MODE \\

	if (!$(location).attr('href').includes('index.php')) {
		burger.addEventListener('click', navControl);
	}

	// CLOSE THE NAV IF THE WINDOW IS OVER 1000PX WIDE \\

	window.addEventListener('resize', function () {
		if (window.innerWidth > 1000 && nav.classList.contains('nav_open')) {
			navControl();
			nav.classList.remove('nav_open');
			$('#menuBlockOut').addClass('hidden');
		}
	});

	// THIS SET OF IF STATEMENTS INITIALISES THE SPESIFIC PAGES FOR PREVIEWING IN CMS ADMIN. \\

	if ($(location).attr('href').includes('index.php')) {
		if ($(location).attr('href').includes('imagine-if')) {
			pageLoader(4);
		}
		if ($(location).attr('href').includes('how-we-innovate')) {
			pageLoader(3);
		}
		if ($(location).attr('href').includes('work-with-us')) {
			pageLoader(5);
		}
		if ($(location).attr('href').includes('contact-us')) {
			pageLoader(6);
		}
		if ($(location).attr('href').includes('home-video')) {
			setInterval(function () {
				hideLoadingAnimation();
			}, 500);
		}
	}

	// SWIPE EVENTS DETECTOR FUNCTION \\

	function detectswipe(el, func) {
		var swipe_det = {};
		swipe_det.sX = 0;swipe_det.sY = 0;swipe_det.eX = 0;swipe_det.eY = 0;
		var min_x = 30; //min x swipe for horizontal swipe
		var max_x = 30; //max x difference for vertical swipe
		var min_y = 50; //min y swipe for vertical swipe
		var max_y = 60; //max y difference for horizontal swipe
		var direc = "";
		var ele = document.getElementById(el);
		ele.addEventListener('touchstart', function (e) {
			var t = e.touches[0];
			swipe_det.sX = t.screenX;
			swipe_det.sY = t.screenY;
		}, false);
		ele.addEventListener('touchmove', function (e) {
			e.preventDefault();
			var t = e.touches[0];
			swipe_det.eX = t.screenX;
			swipe_det.eY = t.screenY;
		}, false);
		ele.addEventListener('touchend', function (e) {
			//horizontal detection
			if ((swipe_det.eX - min_x > swipe_det.sX || swipe_det.eX + min_x < swipe_det.sX) && swipe_det.eY < swipe_det.sY + max_y && swipe_det.sY > swipe_det.eY - max_y && swipe_det.eX > 0) {
				if (swipe_det.eX > swipe_det.sX) direc = "r";else direc = "l";
			}
			//vertical detection
			else if ((swipe_det.eY - min_y > swipe_det.sY || swipe_det.eY + min_y < swipe_det.sY) && swipe_det.eX < swipe_det.sX + max_x && swipe_det.sX > swipe_det.eX - max_x && swipe_det.eY > 0) {
					if (swipe_det.eY > swipe_det.sY) direc = "d";else direc = "u";
				}

			if (direc != "") {
				if (typeof func == 'function') func(el, direc);
			}
			var direc = "";
			swipe_det.sX = 0;swipe_det.sY = 0;swipe_det.eX = 0;swipe_det.eY = 0;
		}, false);
	}

	// CHOSE THE NEXT SLIDE TO SHOW AND CLICK THE PAGINATION BUTTON THAT RELATES TO IT. \\

	var swipeController = function swipeController(el, d) {

		if (el === 'section4') {

			var section4PaginationLength = $('.section4PaginatorButton').length;

			if (d === 'l') {

				if (section4Idx < section4PaginationLength - 1) {
					section4Idx++;
				} else {
					section4Idx = 0;
				}

				$('.section4PaginatorButton')[section4Idx].click();
			}
			if (d === 'r') {

				if (section4Idx > 0) {
					section4Idx--;
				} else {
					section4Idx = section4PaginationLength - 1;
				}

				$('.section4PaginatorButton')[section4Idx].click();
			}
		}
		if (el === 'section3') {

			var section3PaginationLength = $('.section3PaginatorButton').length;

			if (d === 'l') {

				if (section3Idx < section3PaginationLength - 1) {
					section3Idx++;
				} else {
					section3Idx = 0;
				}

				$('.section3PaginatorButton')[section3Idx].click();
			}
			if (d === 'r') {

				if (section3Idx > 0) {
					section3Idx--;
				} else {
					section3Idx = section3PaginationLength - 1;
				}

				$('.section3PaginatorButton')[section3Idx].click();
			}
		}
	};

	// INITIATE FOR SWIPE DETECTION ON SECTIONS 3 AND 4 EXCEPT IN ADMIN PREVIEW. \\

	if (!$(location).attr('href').includes('index.php')) {
		detectswipe('section4', swipeController);
		detectswipe('section3', swipeController);
	}
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZha2VfZjJjMTgzOTIuanMiXSwibmFtZXMiOlsidGltZSIsInNlY3Rpb24zSWR4Iiwic2VjdGlvbjRJZHgiLCJ0ZW5uaXNBbmltYXRpb24iLCJmb290YmFsbEFuaW1hdGlvbiIsImJhc2tldGJhbGxBbmltYXRpb24iLCJiYXNlYmFsbEFuaW1hdGlvbiIsImZhbkFuaW1hdGlvbiIsIm1hc3Rlck9iaiIsInNlY3Rpb24yQ3VycmVudElkeCIsInNlY3Rpb24xQ3VycmVudElkeCIsImJhc2tldGJhbGwiLCJsb29wQW1vdW50IiwibG9vcElkIiwiZm9vdGJhbGwiLCJ0ZW5uaXMiLCJiYXNlYmFsbCIsImZhbiIsImhvbWVwYWdlTW9iSW1hZ2VzIiwiJCIsImRvY3VtZW50IiwicmVhZHkiLCJ3aW5kb3ciLCJpbm5lcldpZHRoIiwiZmV0Y2giLCJ0aGVuIiwicmVzcG9uc2UiLCJqc29uIiwic3ByaXRlSnNvbiIsIklkbGVGcmFtZSIsImZpbHRlckJ5VmFsdWUiLCJmcmFtZXMiLCJhbmltYXRpb25BcnJheSIsImFuaW1hdG9yU2V0dXAiLCJpbWFnZUNvbnRyb2xlciIsInNldEludGVydmFsIiwiYXJyYXkiLCJzdHJpbmciLCJmaWx0ZXIiLCJvIiwidG9Mb3dlckNhc2UiLCJpbmNsdWRlcyIsImxhc3RUaW1lIiwidmVuZG9ycyIsIngiLCJsZW5ndGgiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJjYW5jZWxBbmltYXRpb25GcmFtZSIsImNhbGxiYWNrIiwiZWxlbWVudCIsImN1cnJUaW1lIiwiRGF0ZSIsImdldFRpbWUiLCJ0aW1lVG9DYWxsIiwiTWF0aCIsIm1heCIsImlkIiwic2V0VGltZW91dCIsImNsZWFyVGltZW91dCIsImFuaW1hdG9yIiwiYW5pbWF0aW9uT2JqIiwiZGFuY2luZ0ljb24iLCJzcHJpdGVJbWFnZSIsImNhbnZhcyIsImdhbWVMb29wIiwiYWRkQ2xhc3MiLCJ1cGRhdGUiLCJyZW5kZXIiLCJzcHJpdGUiLCJvcHRpb25zIiwidGhhdCIsImZyYW1lSW5kZXgiLCJ0aWNrQ291bnQiLCJsb29wQ291bnQiLCJ0aWNrc1BlckZyYW1lIiwibnVtYmVyT2ZGcmFtZXMiLCJjb250ZXh0Iiwid2lkdGgiLCJoZWlnaHQiLCJpbWFnZSIsImxvb3BzIiwiY2xlYXJSZWN0IiwiZHJhd0ltYWdlIiwiZnJhbWUiLCJ5IiwiZ2V0RWxlbWVudEJ5SWQiLCJJbWFnZSIsImdldENvbnRleHQiLCJhZGRFdmVudExpc3RlbmVyIiwic3JjIiwicGFnZUxvYWRlciIsImluZGV4IiwicmVtb3ZlQ2xhc3MiLCJmaW5kIiwiZ2V0IiwiY2xpY2siLCJpbml0aWFsaXplU2VjdGlvbiIsInNlY3Rpb25OdW1iZXIiLCJpZHgiLCJzaWJsaW5ncyIsIm1hcCIsIml4IiwiZWxlIiwiY3NzIiwib3BhY2l0eSIsImlkeE9iaiIsInJlbGV2YW50QW5pbWF0aW9uIiwiaGFuZGxlUGFuaW5hdGlvbkJ1dHRvbkNsaWNrIiwiZSIsInBhcnNlSW50IiwidGFyZ2V0IiwiYXR0ciIsInNlY3Rpb25JZCIsImNsb3Nlc3QiLCJyZWxldmFudERhdGFBcnJheSIsIm9uIiwiZXMiLCJsb2NhdGlvbiIsIm9uZXBhZ2Vfc2Nyb2xsIiwic2VjdGlvbkNvbnRhaW5lciIsImVhc2luZyIsImFuaW1hdGlvblRpbWUiLCJwYWdpbmF0aW9uIiwidXBkYXRlVVJMIiwiYmVmb3JlTW92ZSIsImFmdGVyTW92ZSIsImxvb3AiLCJrZXlib2FyZCIsInJlc3BvbnNpdmVGYWxsYmFjayIsImRpcmVjdGlvbiIsIm1vdmVUbyIsImN1cnJlbnRTZWN0aW9uIiwiaGFzQ2xhc3MiLCJzZWN0aW9uIiwib2Zmc2V0IiwidG9wIiwibW92ZURvd24iLCJoaWRlTG9hZGluZ0FuaW1hdGlvbiIsInJlYWR5U3RhdGUiLCJzZWN0aW9uM0F1dG9tYXRlZCIsImF1dG9tYXRlU2VjdGlvbjMiLCJzZWN0aW9uNEF1dG9tYXRlZCIsImF1dG9tYXRlU2VjdGlvbjQiLCJpbnRlcnZhbE1hbmFnZXIiLCJmbGFnIiwic3dpcGVDb250cm9sbGVyIiwiY2xlYXJJbnRlcnZhbCIsInBsYXkiLCJ0aW1lb3V0IiwicGF1c2UiLCJpbm5lckhlaWdodCIsIm1hdGNoTWVkaWEiLCJtYXRjaGVzIiwicGFnZUlkeCIsImJ1cmdlciIsImNsYXNzTGlzdCIsImNvbnRhaW5zIiwibmF2IiwicmVtb3ZlIiwiYm9keSIsInN0eWxlIiwicG9zaXRpb24iLCJzdG9wUHJvcGFnYXRpb24iLCJuYXZDb250cm9sIiwiYWRkIiwiZGV0ZWN0c3dpcGUiLCJlbCIsImZ1bmMiLCJzd2lwZV9kZXQiLCJzWCIsInNZIiwiZVgiLCJlWSIsIm1pbl94IiwibWF4X3giLCJtaW5feSIsIm1heF95IiwiZGlyZWMiLCJ0IiwidG91Y2hlcyIsInNjcmVlblgiLCJzY3JlZW5ZIiwicHJldmVudERlZmF1bHQiLCJkIiwic2VjdGlvbjRQYWdpbmF0aW9uTGVuZ3RoIiwic2VjdGlvbjNQYWdpbmF0aW9uTGVuZ3RoIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsSUFBTUEsT0FBTyxHQUFiO0FBQ0EsSUFBSUMsY0FBYyxDQUFsQjtBQUNBLElBQUlDLGNBQWMsQ0FBbEI7O0FBRUE7QUFDQSxJQUFJQyx3QkFBSjtBQUFBLElBQXFCQywwQkFBckI7QUFBQSxJQUF3Q0MsNEJBQXhDO0FBQUEsSUFBNkRDLDBCQUE3RDtBQUFBLElBQWdGQyxxQkFBaEY7O0FBRUEsSUFBTUMsWUFBWTtBQUNqQkMscUJBQW9CLENBREg7QUFFakJDLHFCQUFvQixDQUZIO0FBR2pCQyxhQUFZLEVBQUNDLFlBQVksQ0FBYixFQUFnQkMsUUFBUVIsbUJBQXhCLEVBSEs7QUFJakJTLFdBQVUsRUFBQ0YsWUFBWSxDQUFiLEVBQWdCQyxRQUFRVCxpQkFBeEIsRUFKTztBQUtqQlcsU0FBUSxFQUFDSCxZQUFZLENBQWIsRUFBZ0JDLFFBQVFWLGVBQXhCLEVBTFM7QUFNakJhLFdBQVUsRUFBQ0osWUFBWSxDQUFiLEVBQWdCQyxRQUFRUCxpQkFBeEIsRUFOTztBQU9qQlcsTUFBSyxFQUFDTCxZQUFZLENBQWIsRUFBZ0JDLFFBQVFOLFlBQXhCO0FBUFksQ0FBbEI7QUFTQSxJQUFNVyxvQkFBb0IsQ0FDekIsMENBRHlCLEVBRXpCLHdDQUZ5QixFQUd6QixzQ0FIeUIsRUFJekIsd0NBSnlCLEVBS3pCLG1DQUx5QixDQUExQjs7QUFRQUMsRUFBRUMsUUFBRixFQUFZQyxLQUFaLENBQWtCLFlBQU07QUFDeEI7O0FBRUMsS0FBR0MsT0FBT0MsVUFBUCxHQUFvQixHQUF2QixFQUE0Qjs7QUFFM0JDLFFBQU0sdUNBQU4sRUFBK0NDLElBQS9DLENBQW9ELFVBQVNDLFFBQVQsRUFBbUI7QUFDdEUsVUFBT0EsU0FBU0MsSUFBVCxFQUFQO0FBQ0EsR0FGRCxFQUVHRixJQUZILENBRVEsVUFBU0csVUFBVCxFQUFxQjtBQUM1QixPQUFNQyxZQUFZQyxjQUFjRixXQUFXRyxNQUF6QixFQUFpQyxNQUFqQyxDQUFsQjtBQUNBdkIsYUFBVU0sUUFBVixDQUFtQmtCLGNBQW5CLGdDQUF3Q0gsU0FBeEMsc0JBQXNEQyxjQUFjRixXQUFXRyxNQUF6QixFQUFpQyxVQUFqQyxDQUF0RDtBQUNBdkIsYUFBVU8sTUFBVixDQUFpQmlCLGNBQWpCLGdDQUFzQ0gsU0FBdEMsc0JBQW9EQyxjQUFjRixXQUFXRyxNQUF6QixFQUFpQyxRQUFqQyxDQUFwRDtBQUNBdkIsYUFBVVEsUUFBVixDQUFtQmdCLGNBQW5CLGdDQUF3Q0gsU0FBeEMsc0JBQXNEQyxjQUFjRixXQUFXRyxNQUF6QixFQUFpQyxVQUFqQyxDQUF0RDtBQUNBdkIsYUFBVUcsVUFBVixDQUFxQnFCLGNBQXJCLGdDQUEwQ0gsU0FBMUMsc0JBQXdEQyxjQUFjRixXQUFXRyxNQUF6QixFQUFpQyxRQUFqQyxDQUF4RDtBQUNBdkIsYUFBVVMsR0FBVixDQUFjZSxjQUFkLGdDQUFtQ0gsU0FBbkMsc0JBQWlEQyxjQUFjRixXQUFXRyxNQUF6QixFQUFpQyxLQUFqQyxDQUFqRDs7QUFFQUU7QUFDQUMsa0JBQWUxQixTQUFmLEVBQTBCLENBQTFCOztBQUVBMkIsZUFBWSxZQUFNO0FBQ2pCRCxtQkFBZTFCLFNBQWYsRUFBMEIsQ0FBMUI7QUFDQSxJQUZELEVBRUcsSUFGSDtBQUdBLEdBaEJEO0FBaUJBOztBQUVELEtBQU1zQixnQkFBZ0IsU0FBaEJBLGFBQWdCLENBQUNNLEtBQUQsRUFBUUMsTUFBUixFQUFtQjtBQUN0QyxTQUFPRCxNQUFNRSxNQUFOLENBQWE7QUFBQSxVQUFLLE9BQU9DLEVBQUUsVUFBRixDQUFQLEtBQXlCLFFBQXpCLElBQXFDQSxFQUFFLFVBQUYsRUFBY0MsV0FBZCxHQUE0QkMsUUFBNUIsQ0FBcUNKLE9BQU9HLFdBQVAsRUFBckMsQ0FBMUM7QUFBQSxHQUFiLENBQVA7QUFDRixFQUZEOztBQUlBLEtBQU1QLGdCQUFnQixTQUFoQkEsYUFBZ0IsR0FBTTs7QUFFekIsTUFBSVMsV0FBVyxDQUFmO0FBQ0EsTUFBSUMsVUFBVSxDQUFDLElBQUQsRUFBTyxLQUFQLEVBQWMsUUFBZCxFQUF3QixHQUF4QixDQUFkO0FBQ0EsT0FBSSxJQUFJQyxJQUFJLENBQVosRUFBZUEsSUFBSUQsUUFBUUUsTUFBWixJQUFzQixDQUFDdkIsT0FBT3dCLHFCQUE3QyxFQUFvRSxFQUFFRixDQUF0RSxFQUF5RTtBQUNyRXRCLFVBQU93QixxQkFBUCxHQUErQnhCLE9BQU9xQixRQUFRQyxDQUFSLElBQVcsdUJBQWxCLENBQS9CO0FBQ0F0QixVQUFPeUIsb0JBQVAsR0FBOEJ6QixPQUFPcUIsUUFBUUMsQ0FBUixJQUFXLHNCQUFsQixLQUE2Q3RCLE9BQU9xQixRQUFRQyxDQUFSLElBQVcsNkJBQWxCLENBQTNFO0FBQ0g7O0FBRUQsTUFBSSxDQUFDdEIsT0FBT3dCLHFCQUFaLEVBQ0l4QixPQUFPd0IscUJBQVAsR0FBK0IsVUFBU0UsUUFBVCxFQUFtQkMsT0FBbkIsRUFBNEI7QUFDdkQsT0FBSUMsV0FBVyxJQUFJQyxJQUFKLEdBQVdDLE9BQVgsRUFBZjtBQUNBLE9BQUlDLGFBQWFDLEtBQUtDLEdBQUwsQ0FBUyxDQUFULEVBQVksTUFBTUwsV0FBV1IsUUFBakIsQ0FBWixDQUFqQjtBQUNBLE9BQUljLEtBQUtsQyxPQUFPbUMsVUFBUCxDQUFrQixZQUFXO0FBQUVULGFBQVNFLFdBQVdHLFVBQXBCO0FBQWtDLElBQWpFLEVBQ1BBLFVBRE8sQ0FBVDtBQUVBWCxjQUFXUSxXQUFXRyxVQUF0QjtBQUNBLFVBQU9HLEVBQVA7QUFDSCxHQVBEOztBQVNKLE1BQUksQ0FBQ2xDLE9BQU95QixvQkFBWixFQUNJekIsT0FBT3lCLG9CQUFQLEdBQThCLFVBQVNTLEVBQVQsRUFBYTtBQUN2Q0UsZ0JBQWFGLEVBQWI7QUFDSCxHQUZEO0FBR04sRUF2QkQ7O0FBeUJBLEtBQU1HLFdBQVcsU0FBWEEsUUFBVyxDQUFDQyxZQUFELEVBQWtCOztBQUVsQyxNQUFJQyxXQUFKLEVBQ0NDLFdBREQsRUFFQ0MsTUFGRDs7QUFJQSxXQUFTQyxRQUFULEdBQXFCO0FBQ3BCN0MsS0FBRSxVQUFGLEVBQWM4QyxRQUFkLENBQXVCLFFBQXZCO0FBQ0NMLGdCQUFhL0MsTUFBYixHQUFzQlMsT0FBT3dCLHFCQUFQLENBQTZCa0IsUUFBN0IsQ0FBdEI7QUFDQUgsZUFBWUssTUFBWjtBQUNBTCxlQUFZTSxNQUFaO0FBQ0Q7O0FBRUQsV0FBU0MsTUFBVCxDQUFpQkMsT0FBakIsRUFBMEI7O0FBRXpCLE9BQUlDLE9BQU8sRUFBWDtBQUFBLE9BQ0NDLGFBQWEsQ0FEZDtBQUFBLE9BRUNDLFlBQVksQ0FGYjtBQUFBLE9BR0NDLFlBQVksQ0FIYjtBQUFBLE9BSUNDLGdCQUFnQkwsUUFBUUssYUFBUixJQUF5QixDQUoxQztBQUFBLE9BS0NDLGlCQUFpQk4sUUFBUU0sY0FBUixJQUEwQixDQUw1Qzs7QUFPQUwsUUFBS00sT0FBTCxHQUFlUCxRQUFRTyxPQUF2QjtBQUNBTixRQUFLTyxLQUFMLEdBQWFSLFFBQVFRLEtBQXJCO0FBQ0FQLFFBQUtRLE1BQUwsR0FBY1QsUUFBUVMsTUFBdEI7QUFDQVIsUUFBS1MsS0FBTCxHQUFhVixRQUFRVSxLQUFyQjtBQUNBVCxRQUFLVSxLQUFMLEdBQWFYLFFBQVFXLEtBQXJCOztBQUVBVixRQUFLSixNQUFMLEdBQWMsWUFBWTs7QUFFckJNLGlCQUFhLENBQWI7O0FBRUEsUUFBSUEsWUFBWUUsYUFBaEIsRUFBK0I7O0FBRWxDRixpQkFBWSxDQUFaO0FBQ0s7QUFDQSxTQUFJRCxhQUFhSSxpQkFBaUIsQ0FBbEMsRUFBcUM7QUFDckM7QUFDRUosb0JBQWMsQ0FBZDtBQUNELE1BSEQsTUFHTztBQUNQRTtBQUNFRixtQkFBYSxDQUFiOztBQUVBLFVBQUdFLGNBQWNILEtBQUtVLEtBQXRCLEVBQTZCO0FBQzVCMUQsY0FBT3lCLG9CQUFQLENBQTRCYSxhQUFhL0MsTUFBekM7QUFDQTtBQUNGO0FBQ0g7QUFDRixJQXBCSDs7QUFzQkF5RCxRQUFLSCxNQUFMLEdBQWMsWUFBWTs7QUFFeEI7QUFDQUcsU0FBS00sT0FBTCxDQUFhSyxTQUFiLENBQXVCLENBQXZCLEVBQTBCLENBQTFCLEVBQTZCWCxLQUFLTyxLQUFsQyxFQUF5Q1AsS0FBS1EsTUFBOUM7O0FBRUFSLFNBQUtNLE9BQUwsQ0FBYU0sU0FBYixDQUNFWixLQUFLUyxLQURQLEVBRUVuQixhQUFhNUIsY0FBYixDQUE0QnVDLFVBQTVCLEVBQXdDWSxLQUF4QyxDQUE4Q3ZDLENBRmhELEVBR0VnQixhQUFhNUIsY0FBYixDQUE0QnVDLFVBQTVCLEVBQXdDWSxLQUF4QyxDQUE4Q0MsQ0FIaEQsRUFJRSxHQUpGLEVBS0UsR0FMRixFQU1FLENBTkYsRUFPRSxDQVBGLEVBUUU5RCxPQUFPQyxVQUFQLEdBQW9CLEtBUnRCLEVBU0VELE9BQU9DLFVBQVAsR0FBb0IsR0FUdEI7QUFVRCxJQWZEOztBQWlCQSxVQUFPK0MsSUFBUDtBQUNBOztBQUVEO0FBQ0FQLFdBQVMzQyxTQUFTaUUsY0FBVCxDQUF3QixRQUF4QixDQUFUO0FBQ0F0QixTQUFPYyxLQUFQLEdBQWV2RCxPQUFPQyxVQUFQLEdBQW9CLEtBQW5DO0FBQ0F3QyxTQUFPZSxNQUFQLEdBQWdCeEQsT0FBT0MsVUFBUCxHQUFvQixHQUFwQzs7QUFFQTtBQUNBdUMsZ0JBQWMsSUFBSXdCLEtBQUosRUFBZDs7QUFFQTtBQUNBekIsZ0JBQWNPLE9BQU87QUFDcEJRLFlBQVNiLE9BQU93QixVQUFQLENBQWtCLElBQWxCLENBRFc7QUFFcEJWLFVBQU8sSUFGYTtBQUdwQkMsV0FBUSxJQUhZO0FBSXBCQyxVQUFPakIsV0FKYTtBQUtwQmEsbUJBQWdCZixhQUFhNUIsY0FBYixDQUE0QmEsTUFMeEI7QUFNcEI2QixrQkFBZSxDQU5LO0FBT3BCTSxVQUFPcEIsYUFBYWhEO0FBUEEsR0FBUCxDQUFkOztBQVVBO0FBQ0FrRCxjQUFZMEIsZ0JBQVosQ0FBNkIsTUFBN0IsRUFBcUN4QixRQUFyQztBQUNBRixjQUFZMkIsR0FBWixHQUFrQiwwQ0FBbEI7QUFDQSxFQTVGRDs7QUE4RkQ7O0FBRUMsS0FBTUMsYUFBYSxTQUFiQSxVQUFhLENBQUNDLEtBQUQsRUFBVztBQUM3QixNQUFHQSxVQUFVLENBQWIsRUFBZ0I7QUFDZnhFLEtBQUUsT0FBRixFQUFXeUUsV0FBWCxDQUF1QixZQUF2QjtBQUNBekUsS0FBRSxvQkFBRixFQUF3QnlFLFdBQXhCLENBQW9DLGlCQUFwQztBQUNBekUsS0FBRSxXQUFGLEVBQWUwRSxJQUFmLENBQW9CLFVBQXBCLEVBQWdDNUIsUUFBaEMsQ0FBeUMsYUFBekM7QUFDQTlDLEtBQUUsYUFBRixFQUFpQjhDLFFBQWpCLENBQTBCLGlCQUExQjtBQUNBOUMsS0FBRSxhQUFGLEVBQWlCMEUsSUFBakIsQ0FBc0IsT0FBdEIsRUFBK0I1QixRQUEvQixDQUF3QyxZQUF4QztBQUNBOUMsS0FBRSxXQUFGLEVBQWUwRSxJQUFmLENBQW9CLGNBQXBCLEVBQW9DNUIsUUFBcEMsQ0FBNkMsTUFBN0M7QUFDQVIsY0FBVyxZQUFNO0FBQ2hCdEMsTUFBRSw0QkFBRixFQUFnQzBFLElBQWhDLENBQXFDLFVBQXJDLEVBQWlENUIsUUFBakQsQ0FBMEQsUUFBMUQ7QUFDQSxJQUZELEVBRUcsSUFGSDtBQUdBLEdBVkQsTUFXSztBQUNKOUMsS0FBRSxPQUFGLEVBQVd5RSxXQUFYLENBQXVCLFlBQXZCO0FBQ0F6RSxLQUFFLGFBQUYsRUFBaUJ5RSxXQUFqQixDQUE2QixpQkFBN0I7QUFDQXpFLHlDQUFvQ3dFLEtBQXBDLGtCQUF3REMsV0FBeEQsQ0FBb0UsaUJBQXBFO0FBQ0F6RSx3QkFBcUIwRSxJQUFyQix1QkFBZ0Q1QixRQUFoRCxDQUF5RCxpQkFBekQ7QUFDQTlDLHVCQUFvQjBFLElBQXBCLENBQXlCLE9BQXpCLEVBQWtDNUIsUUFBbEMsQ0FBMkMsWUFBM0M7O0FBRUEsT0FBRzlDLGVBQWF3RSxLQUFiLHNCQUFxQzlDLE1BQXJDLElBQStDMUIsZUFBYXdFLEtBQWIsNkJBQTRDOUMsTUFBNUMsR0FBcUQsQ0FBdkcsRUFBMEc7QUFDekcxQixtQkFBYXdFLEtBQWIsc0JBQXFDRyxHQUFyQyxDQUF5QyxDQUF6QyxFQUE0Q0MsS0FBNUM7QUFDQTtBQUNEO0FBQ0QsRUF2QkQ7O0FBeUJEOztBQUVDLEtBQU1DLG9CQUFvQixTQUFwQkEsaUJBQW9CLENBQUNDLGFBQUQsRUFBZ0JDLEdBQWhCLEVBQXdCO0FBQ2pEL0UsaUJBQWE4RSxhQUFiLGtCQUF1Q0MsR0FBdkMsRUFBOENDLFFBQTlDLENBQXVELG9CQUF2RCxFQUE2RUMsR0FBN0UsQ0FBaUYsVUFBQ0MsRUFBRCxFQUFLQyxHQUFMLEVBQWE7QUFDN0ZuRixLQUFFbUYsR0FBRixFQUFPQyxHQUFQLENBQVcsRUFBQ0MsU0FBUyxDQUFWLEVBQVg7QUFDQSxHQUZEOztBQUlBckYsaUJBQWE4RSxhQUFiLGtCQUF1Q0MsR0FBdkMsRUFBOENLLEdBQTlDLENBQWtEO0FBQ2pELGdCQUFhLFlBRG9DO0FBRWpELGNBQVc7QUFGc0MsR0FBbEQ7QUFJQSxFQVREOztBQVdEO0FBQ0NQLG1CQUFrQixDQUFsQixFQUFxQixDQUFyQjtBQUNBQSxtQkFBa0IsQ0FBbEIsRUFBcUIsQ0FBckI7QUFDQUEsbUJBQWtCLENBQWxCLEVBQXFCLENBQXJCOztBQUVEOztBQUVDLEtBQU05RCxpQkFBaUIsU0FBakJBLGNBQWlCLENBQUN1RSxNQUFELEVBQVNSLGFBQVQsRUFBMkI7QUFDakQsTUFBSVMsMEJBQUo7O0FBRUEsTUFBR1Qsa0JBQWtCLENBQXJCLEVBQXdCO0FBQ3ZCLFdBQU9RLE9BQU8vRixrQkFBZDtBQUNDLFNBQUssQ0FBTDtBQUNDZ0cseUJBQW9CbEcsVUFBVUcsVUFBOUI7QUFDRDtBQUNBLFNBQUssQ0FBTDtBQUNDK0YseUJBQW9CbEcsVUFBVU0sUUFBOUI7QUFDRDtBQUNBLFNBQUssQ0FBTDtBQUNDNEYseUJBQW9CbEcsVUFBVU8sTUFBOUI7QUFDRDtBQUNBLFNBQUssQ0FBTDtBQUNDMkYseUJBQW9CbEcsVUFBVVEsUUFBOUI7QUFDRDtBQUNBLFNBQUssQ0FBTDtBQUNDMEYseUJBQW9CbEcsVUFBVVMsR0FBOUI7QUFDRDtBQWZEO0FBaUJBOztBQUVERSxpQkFBYThFLGFBQWIsRUFBOEJKLElBQTlCLENBQW1DLE9BQW5DLEVBQTRDRCxXQUE1QyxDQUF3RCxZQUF4RDtBQUNBekUsaUJBQWE4RSxhQUFiLGtCQUF1Q1EsbUJBQWlCUixhQUFqQixnQkFBdkMsRUFBc0ZMLFdBQXRGLENBQWtHLGlCQUFsRztBQUNBSSxvQkFBa0JDLGFBQWxCLEVBQWlDUSxtQkFBaUJSLGFBQWpCLGdCQUFqQzs7QUFFQXhDLGFBQVcsWUFBTTtBQUNoQixPQUFHd0Msa0JBQWtCLENBQXJCLEVBQXdCO0FBQ3ZCdEMsYUFBUytDLGlCQUFUO0FBQ0E7O0FBRUR2RixrQkFBYThFLGFBQWIsRUFBOEJKLElBQTlCLHVCQUF5RDVCLFFBQXpELENBQWtFLGlCQUFsRTtBQUNBOUMsa0JBQWE4RSxhQUFiLEVBQThCSixJQUE5QixDQUFtQyxPQUFuQyxFQUE0QzVCLFFBQTVDLENBQXFELFlBQXJEO0FBQ0EsR0FQRCxFQU9HLEdBUEg7O0FBU0EsTUFBR3dDLG1CQUFpQlIsYUFBakIscUJBQWdEOUUsZUFBYThFLGFBQWIsRUFBOEJKLElBQTlCLHVCQUF5RGhELE1BQXpELEdBQWtFLENBQXJILEVBQXdIO0FBQ3ZINEQsc0JBQWlCUixhQUFqQixtQkFBOEMsQ0FBOUM7QUFDQSxHQUZELE1BRU87QUFDTlEsc0JBQWlCUixhQUFqQixvQkFBK0MsQ0FBL0M7QUFDQTtBQUNELEVBekNEOztBQTJDQS9ELGdCQUFlMUIsU0FBZixFQUEwQixDQUExQjs7QUFFQTJCLGFBQVksWUFBTTtBQUNqQkQsaUJBQWUxQixTQUFmLEVBQTBCLENBQTFCO0FBQ0EsRUFGRCxFQUVHLEtBRkg7O0FBSUQ7O0FBRUMsS0FBTW1HLDhCQUE4QixTQUE5QkEsMkJBQThCLENBQUNDLENBQUQsRUFBTzs7QUFFMUMsTUFBTVYsTUFBTVcsU0FBUzFGLEVBQUV5RixFQUFFRSxNQUFKLEVBQVlDLElBQVosQ0FBaUIsWUFBakIsQ0FBVCxDQUFaO0FBQ0EsTUFBTUMsWUFBWTdGLEVBQUV5RixFQUFFRSxNQUFKLEVBQVlHLE9BQVosQ0FBb0IsU0FBcEIsRUFBK0JGLElBQS9CLENBQW9DLElBQXBDLENBQWxCO0FBQ0EsTUFBSUcsMEJBQUo7O0FBRUEsTUFBR0YsY0FBYyxVQUFqQixFQUE2QjtBQUM1Qi9HLGlCQUFjaUcsR0FBZDtBQUNBOztBQUVELE1BQUdjLGNBQWMsVUFBakIsRUFBNkI7QUFDNUI5RyxpQkFBY2dHLEdBQWQ7QUFDQTs7QUFFRC9FLFVBQU02RixTQUFOLEVBQW1CbkIsSUFBbkIsQ0FBd0IsT0FBeEIsRUFBaUNELFdBQWpDLENBQTZDLFlBQTdDO0FBQ0F6RSxVQUFNNkYsU0FBTixFQUFtQm5CLElBQW5CLENBQXdCLGNBQXhCLEVBQXdDRCxXQUF4QyxDQUFvRCxNQUFwRDtBQUNBekUsVUFBTTZGLFNBQU4sRUFBbUJuQixJQUFuQixrQkFBdUNLLEdBQXZDLEVBQThDakMsUUFBOUMsQ0FBdUQsTUFBdkQ7QUFDQTlDLFVBQU02RixTQUFOLGtCQUE0QmQsR0FBNUIsRUFBbUNOLFdBQW5DLENBQStDLGlCQUEvQztBQUNBekUsVUFBTTZGLFNBQU4sc0JBQWtDcEIsV0FBbEMsQ0FBOEMsUUFBOUM7QUFDQXpFLElBQUV5RixFQUFFRSxNQUFKLEVBQVk3QyxRQUFaLENBQXFCLFFBQXJCOztBQUVBK0Isb0JBQWtCYSxTQUFTMUYsUUFBTTZGLFNBQU4sRUFBbUJELElBQW5CLENBQXdCLFlBQXhCLENBQVQsQ0FBbEIsRUFBbUViLEdBQW5FOztBQUVBekMsYUFBVyxZQUFNO0FBQ2hCaUMsY0FBV21CLFNBQVMxRixRQUFNNkYsU0FBTixFQUFtQkQsSUFBbkIsQ0FBd0IsWUFBeEIsQ0FBVCxDQUFYO0FBQ0EsR0FGRCxFQUVHLEdBRkg7O0FBSUEsTUFBR0MsY0FBYyxVQUFqQixFQUE0QjtBQUMzQjdGLFdBQU02RixTQUFOLEVBQW1CbkIsSUFBbkIsQ0FBd0IsYUFBeEIsRUFBdUM1QixRQUF2QyxDQUFnRCxRQUFoRDtBQUNBOUMsV0FBTTZGLFNBQU4sRUFBbUJHLEVBQW5CLENBQXNCLGtEQUF0QixFQUEwRSxVQUFDQyxFQUFELEVBQVE7QUFDL0VqRyxZQUFNNkYsU0FBTixFQUFtQm5CLElBQW5CLENBQXdCLGFBQXhCLEVBQXVDRCxXQUF2QyxDQUFtRCxRQUFuRDtBQUNGLElBRkQ7QUFHQTtBQUNELEVBakNEOztBQW1DRDs7QUFFQ3pFLEdBQUUsb0RBQUYsRUFBd0Q0RSxLQUF4RCxDQUE4RCxVQUFDYSxDQUFELEVBQU87QUFDcEVELDhCQUE0QkMsQ0FBNUI7QUFDQSxFQUZEOztBQUlEOztBQUVDLEtBQUcsQ0FBQ3pGLEVBQUVrRyxRQUFGLEVBQVlOLElBQVosQ0FBaUIsTUFBakIsRUFBeUJ0RSxRQUF6QixDQUFrQyxXQUFsQyxDQUFKLEVBQW9EO0FBQ25EdEIsSUFBRSxrQkFBRixFQUFzQm1HLGNBQXRCLENBQXFDO0FBQ3BDQyxxQkFBa0IsU0FEa0I7QUFFcENDLFdBQVEsVUFGNEI7QUFHcENDLGtCQUFlekgsSUFIcUI7QUFJcEMwSCxlQUFZLElBSndCO0FBS3BDQyxjQUFXLElBTHlCO0FBTXBDQyxlQUFZLG9CQUFDakMsS0FBRCxFQUFXLENBQUUsQ0FOVztBQU9wQ2tDLGNBQVcsbUJBQUNsQyxLQUFELEVBQVc7QUFDekI7O0FBRUlELGVBQVdDLEtBQVg7QUFDQSxJQVhtQztBQVlwQ21DLFNBQU0sS0FaOEI7QUFhcENDLGFBQVUsSUFiMEI7QUFjcENDLHVCQUFvQixLQWRnQjtBQWVwQ0MsY0FBVztBQWZ5QixHQUFyQzs7QUFrQkE5RyxJQUFFLGtCQUFGLEVBQXNCK0csTUFBdEIsQ0FBNkIsQ0FBN0I7QUFDQTs7QUFFRjs7QUFFQy9HLEdBQUUsWUFBRixFQUFnQjRFLEtBQWhCLENBQXNCLFVBQUNhLENBQUQsRUFBTztBQUM1QixNQUFJdUIsaUJBQWlCaEgsRUFBRXlGLEVBQUVFLE1BQUosRUFBWUcsT0FBWixDQUFvQjlGLEVBQUUsYUFBRixDQUFwQixDQUFyQjs7QUFFQSxNQUFHZ0gsZUFBZUMsUUFBZixDQUF3QixNQUF4QixDQUFILEVBQW9DO0FBQ25DRCxrQkFBZXZDLFdBQWYsQ0FBMkIsTUFBM0I7QUFDQXVDLGtCQUFldEMsSUFBZixDQUFvQixZQUFwQixFQUFrQ0QsV0FBbEMsQ0FBOEMsUUFBOUM7QUFDQXVDLGtCQUFlaEMsUUFBZixDQUF3QixhQUF4QixFQUF1Q0MsR0FBdkMsQ0FBMkMsVUFBQ0YsR0FBRCxFQUFNbUMsT0FBTixFQUFrQjtBQUM1RGxILE1BQUVrSCxPQUFGLEVBQVd6QyxXQUFYLENBQXVCLFFBQXZCO0FBQ0F6RSxNQUFFa0gsT0FBRixFQUFXeEMsSUFBWCxDQUFnQixPQUFoQixFQUF5QkQsV0FBekIsQ0FBcUMsU0FBckMsRUFBZ0QzQixRQUFoRCxDQUF5RCxZQUF6RDtBQUNBLElBSEQ7QUFJQSxHQVBELE1BT087QUFDTmtFLGtCQUFldkMsV0FBZixDQUEyQixRQUEzQixFQUFxQzNCLFFBQXJDLENBQThDLE1BQTlDO0FBQ0FrRSxrQkFBZWhCLEVBQWYsQ0FBa0Isa0RBQWxCLEVBQXNFLFVBQUNDLEVBQUQsRUFBUTtBQUMzRWpHLE1BQUUsa0JBQUYsRUFBc0IwRSxJQUF0QixDQUEyQixZQUEzQixFQUF5QzVCLFFBQXpDLENBQWtELFFBQWxEO0FBQ0YsSUFGRDtBQUdBa0Usa0JBQWVoQyxRQUFmLENBQXdCLGFBQXhCLEVBQXVDQyxHQUF2QyxDQUEyQyxVQUFDRixHQUFELEVBQU1tQyxPQUFOLEVBQWtCO0FBQzVEbEgsTUFBRWtILE9BQUYsRUFBV3pDLFdBQVgsQ0FBdUIsTUFBdkIsRUFBK0IzQixRQUEvQixDQUF3QyxRQUF4QztBQUNBOUMsTUFBRWtILE9BQUYsRUFBV3hDLElBQVgsQ0FBZ0IsT0FBaEIsRUFBeUJELFdBQXpCLENBQXFDLFlBQXJDLEVBQW1EM0IsUUFBbkQsQ0FBNEQsU0FBNUQ7QUFDQTlDLE1BQUVrSCxPQUFGLEVBQVd4QyxJQUFYLENBQWdCLFlBQWhCLEVBQThCRCxXQUE5QixDQUEwQyxRQUExQztBQUNBLElBSkQ7QUFLQTtBQUNEdUMsaUJBQWV0QyxJQUFmLENBQW9CLE9BQXBCLEVBQTZCRCxXQUE3QixDQUF5QyxTQUF6QyxFQUFvRDNCLFFBQXBELENBQTZELFlBQTdEO0FBQ0EsRUF0QkQ7O0FBd0JEOztBQUVDOUMsR0FBRSxZQUFGLEVBQWdCNEUsS0FBaEIsQ0FBc0IsWUFBTTtBQUMzQixNQUFHNUUsRUFBRUcsTUFBRixFQUFVd0QsTUFBVixNQUFzQjNELEVBQUUsT0FBRixFQUFXMEIsTUFBWCxHQUFvQixDQUExQyxNQUFpRCxDQUFFMUIsRUFBRSxrQkFBRixFQUFzQm1ILE1BQXRCLEdBQStCQyxHQUFyRixFQUEwRjtBQUN4RnBILEtBQUUsa0JBQUYsRUFBc0IrRyxNQUF0QixDQUE2QixDQUE3QjtBQUNELEdBRkQsTUFFTztBQUNOL0csS0FBRSxrQkFBRixFQUFzQnFILFFBQXRCO0FBQ0E7QUFDRCxFQU5EOztBQVFEOztBQUVDLEtBQU1DLHVCQUF1QixTQUF2QkEsb0JBQXVCLEdBQU07QUFDbEMsTUFBR25ILE9BQU9DLFVBQVAsR0FBb0IsR0FBcEIsSUFBMkIsQ0FBQ0osRUFBRSxVQUFGLEVBQWNpSCxRQUFkLENBQXVCLFFBQXZCLENBQS9CLEVBQWlFOztBQUVoRSxPQUFHakgsRUFBRSxRQUFGLEVBQVkyRSxHQUFaLENBQWdCLENBQWhCLEVBQW1CNEMsVUFBbkIsS0FBa0MsQ0FBckMsRUFBd0M7QUFDdkN2SCxNQUFFLFVBQUYsRUFBYzhDLFFBQWQsQ0FBdUIsUUFBdkI7QUFDQTtBQUNEO0FBQ0QsRUFQRDs7QUFTQSxLQUFJMEUsMEJBQUo7QUFBQSxLQUF1QkMseUJBQXZCO0FBQUEsS0FBeUNDLDBCQUF6QztBQUFBLEtBQTREQyx5QkFBNUQ7QUFDRDs7QUFFQyxLQUFNQyxrQkFBa0IsU0FBbEJBLGVBQWtCLENBQUNDLElBQUQsRUFBT2hDLFNBQVAsRUFBa0JoSCxJQUFsQixFQUEyQjtBQUNoRCxNQUFHZ0osSUFBSCxFQUFTO0FBQ1IsT0FBR2hDLGNBQWMsVUFBakIsRUFBNkI7QUFDNUI0Qix1QkFBbUJ6RyxZQUFZLFlBQU07QUFDbkM4RyxxQkFBZ0JqQyxTQUFoQixFQUEyQixHQUEzQjtBQUNBLEtBRmlCLEVBRWZoSCxJQUZlLENBQW5CO0FBR0E7QUFDRCxPQUFHZ0gsY0FBYyxVQUFqQixFQUE2QjtBQUM1QjhCLHVCQUFtQjNHLFlBQVksWUFBTTtBQUNuQzhHLHFCQUFnQmpDLFNBQWhCLEVBQTJCLEdBQTNCO0FBQ0EsS0FGaUIsRUFFZmhILElBRmUsQ0FBbkI7QUFHQTtBQUVELEdBWkQsTUFZTztBQUNOLE9BQUdnSCxjQUFjLFVBQWpCLEVBQTZCO0FBQzVCa0Msa0JBQWNOLGdCQUFkO0FBQ0E7QUFDRCxPQUFHNUIsY0FBYyxVQUFqQixFQUE2QjtBQUM1QmtDLGtCQUFjSixnQkFBZDtBQUNBO0FBQ0Q7QUFDSCxFQXJCRDs7QUF1QkQ7O0FBRUMsS0FBRyxDQUFDM0gsRUFBRWtHLFFBQUYsRUFBWU4sSUFBWixDQUFpQixNQUFqQixFQUF5QnRFLFFBQXpCLENBQWtDLFdBQWxDLENBQUosRUFBb0Q7QUFDbkROLGNBQVksWUFBTTtBQUNqQixPQUFHaEIsRUFBRSxrQkFBRixFQUFzQm1ILE1BQXRCLEdBQStCQyxHQUEvQixJQUFzQyxDQUF6QyxFQUE0QztBQUMzQ3BILE1BQUUsdUJBQUYsRUFBMkI4QyxRQUEzQixDQUFvQyxlQUFwQztBQUNBOUMsTUFBRSxRQUFGLEVBQVkyRSxHQUFaLENBQWdCLENBQWhCLEVBQW1CcUQsSUFBbkI7QUFDQWhJLE1BQUUsUUFBRixFQUFZOEMsUUFBWixDQUFxQixTQUFyQjtBQUNBLElBSkQsTUFJTztBQUNOLFFBQUltRixVQUFVM0YsV0FBVyxZQUFNO0FBQzlCdEMsT0FBRSx1QkFBRixFQUEyQnlFLFdBQTNCLENBQXVDLGVBQXZDO0FBQ0F6RSxPQUFFLFFBQUYsRUFBWTJFLEdBQVosQ0FBZ0IsQ0FBaEIsRUFBbUJ1RCxLQUFuQjtBQUNBbEksT0FBRSxRQUFGLEVBQVl5RSxXQUFaLENBQXdCLFNBQXhCO0FBQ0FsQyxrQkFBYTBGLE9BQWI7QUFDQSxLQUxhLEVBS1hwSixJQUxXLENBQWQ7QUFNQTs7QUFFSjs7QUFFRyxPQUFHbUIsRUFBRSxrQkFBRixFQUFzQm1ILE1BQXRCLEdBQStCQyxHQUEvQixHQUFxQyxFQUFHakgsT0FBT2dJLFdBQVAsR0FBcUIsQ0FBeEIsQ0FBeEMsRUFBb0U7QUFDbkVuSSxNQUFFLFlBQUYsRUFBZ0JvRixHQUFoQixDQUFvQixFQUFDLGFBQWEsaUNBQWQsRUFBcEI7QUFDQSxJQUZELE1BRU87QUFDTnBGLE1BQUUsWUFBRixFQUFnQm9GLEdBQWhCLENBQW9CLEVBQUMsYUFBYSwrQkFBZCxFQUFwQjtBQUNBOztBQUVEa0M7O0FBRUg7O0FBRUcsT0FBR25ILE9BQU9pSSxVQUFQLENBQWtCLDBCQUFsQixFQUE4Q0MsT0FBOUMsSUFBeURsSSxPQUFPQyxVQUFQLEdBQW9CLEdBQWhGLEVBQXFGO0FBQ25GSixNQUFFLDZFQUFGLEVBQWlGOEMsUUFBakYsQ0FBMEYsV0FBMUY7QUFDRCxJQUZELE1BRU87QUFDTDlDLE1BQUUsNkVBQUYsRUFBaUZ5RSxXQUFqRixDQUE2RixXQUE3RjtBQUNEOztBQUVELE9BQUd6RSxFQUFFLGtCQUFGLEVBQXNCMEIsTUFBekIsRUFBaUM7QUFBRTtBQUNsQyxRQUFHOEYsc0JBQXNCLElBQXpCLEVBQStCO0FBQzlCQSx5QkFBb0IsSUFBcEI7QUFDQUkscUJBQWdCLElBQWhCLEVBQXNCLFVBQXRCLEVBQWtDLElBQWxDO0FBQ0E7QUFDRCxJQUxELE1BS087QUFBRTtBQUNSLFFBQUdKLHNCQUFzQixJQUF6QixFQUErQjtBQUM5QkkscUJBQWdCLEtBQWhCLEVBQXVCLFVBQXZCO0FBQ0FKLHlCQUFvQixLQUFwQjtBQUNBO0FBQ0Q7O0FBRUQsT0FBR3hILEVBQUUsa0JBQUYsRUFBc0IwQixNQUF6QixFQUFpQztBQUFFO0FBQ2xDLFFBQUdnRyxzQkFBc0IsSUFBekIsRUFBK0I7QUFDOUJBLHlCQUFvQixJQUFwQjtBQUNBRSxxQkFBZ0IsSUFBaEIsRUFBc0IsVUFBdEIsRUFBa0MsSUFBbEM7QUFDQTtBQUNELElBTEQsTUFLTztBQUFFO0FBQ1IsUUFBR0Ysc0JBQXNCLElBQXpCLEVBQStCO0FBQzlCRSxxQkFBZ0IsS0FBaEIsRUFBdUIsVUFBdkI7QUFDQUYseUJBQW9CLEtBQXBCO0FBQ0E7QUFDRDtBQUNELEdBdkRELEVBdURHLEdBdkRIO0FBd0RBOztBQUVGOztBQUVDMUgsR0FBRSxXQUFGLEVBQWU0RSxLQUFmLENBQXFCLFVBQUNhLENBQUQsRUFBTztBQUMzQixNQUFNNkMsVUFBVTVDLFNBQVMxRixFQUFFeUYsRUFBRUUsTUFBSixFQUFZQyxJQUFaLENBQWlCLFlBQWpCLENBQVQsQ0FBaEI7QUFDQTVGLElBQUUsa0JBQUYsRUFBc0IrRyxNQUF0QixDQUE2QnVCLE9BQTdCO0FBQ0F0SSxJQUFFLGVBQUYsRUFBbUI4QyxRQUFuQixDQUE0QixRQUE1Qjs7QUFFQSxNQUFHeUYsT0FBT0MsU0FBUCxDQUFpQkMsUUFBakIsQ0FBMEIsZ0JBQTFCLENBQUgsRUFBZ0Q7QUFDNUNDLE9BQUlGLFNBQUosQ0FBY0csTUFBZCxDQUFxQixVQUFyQjtBQUNBSixVQUFPQyxTQUFQLENBQWlCRyxNQUFqQixDQUF3QixnQkFBeEI7QUFDQTFJLFlBQVMySSxJQUFULENBQWNDLEtBQWQsQ0FBb0JDLFFBQXBCLEdBQStCLFVBQS9CO0FBQ0Q7QUFDSCxFQVZEOztBQVlEOztBQUVDOUksR0FBRSxlQUFGLEVBQW1CNEUsS0FBbkIsQ0FBeUIsVUFBQ2EsQ0FBRCxFQUFPO0FBQzdCQSxJQUFFc0QsZUFBRjtBQUNGLEVBRkQ7O0FBSUEsS0FBSVIsU0FBU3RJLFNBQVNpRSxjQUFULENBQXdCLGFBQXhCLENBQWI7QUFBQSxLQUNDd0UsTUFBTXpJLFNBQVNpRSxjQUFULENBQXdCLFNBQXhCLENBRFA7O0FBR0Q7O0FBRUUsVUFBUzhFLFVBQVQsR0FBc0I7O0FBRXBCLE1BQUdULE9BQU9DLFNBQVAsQ0FBaUJDLFFBQWpCLENBQTBCLGdCQUExQixDQUFILEVBQWdEO0FBQzlDQyxPQUFJRixTQUFKLENBQWNHLE1BQWQsQ0FBcUIsVUFBckI7QUFDQUosVUFBT0MsU0FBUCxDQUFpQkcsTUFBakIsQ0FBd0IsZ0JBQXhCO0FBQ0EzSSxLQUFFLGVBQUYsRUFBbUI4QyxRQUFuQixDQUE0QixRQUE1QjtBQUNELEdBSkQsTUFLSztBQUNIeUYsVUFBT0MsU0FBUCxDQUFpQlMsR0FBakIsQ0FBcUIsZ0JBQXJCO0FBQ0FQLE9BQUlGLFNBQUosQ0FBY1MsR0FBZCxDQUFrQixVQUFsQjtBQUNBakosS0FBRSxlQUFGLEVBQW1CeUUsV0FBbkIsQ0FBK0IsUUFBL0I7QUFDRDtBQUNGOztBQUVIOztBQUVFLEtBQUcsQ0FBQ3pFLEVBQUVrRyxRQUFGLEVBQVlOLElBQVosQ0FBaUIsTUFBakIsRUFBeUJ0RSxRQUF6QixDQUFrQyxXQUFsQyxDQUFKLEVBQW9EO0FBQ25EaUgsU0FBT2xFLGdCQUFQLENBQXdCLE9BQXhCLEVBQWlDMkUsVUFBakM7QUFDQTs7QUFFSDs7QUFFRTdJLFFBQU9rRSxnQkFBUCxDQUF3QixRQUF4QixFQUFrQyxZQUFXO0FBQzNDLE1BQUdsRSxPQUFPQyxVQUFQLEdBQW9CLElBQXBCLElBQTRCc0ksSUFBSUYsU0FBSixDQUFjQyxRQUFkLENBQXVCLFVBQXZCLENBQS9CLEVBQW1FO0FBQ2pFTztBQUNBTixPQUFJRixTQUFKLENBQWNHLE1BQWQsQ0FBcUIsVUFBckI7QUFDQzNJLEtBQUUsZUFBRixFQUFtQjhDLFFBQW5CLENBQTRCLFFBQTVCO0FBQ0Y7QUFDRixFQU5EOztBQVFGOztBQUVFLEtBQUc5QyxFQUFFa0csUUFBRixFQUFZTixJQUFaLENBQWlCLE1BQWpCLEVBQXlCdEUsUUFBekIsQ0FBa0MsV0FBbEMsQ0FBSCxFQUFtRDtBQUNuRCxNQUFHdEIsRUFBRWtHLFFBQUYsRUFBWU4sSUFBWixDQUFpQixNQUFqQixFQUF5QnRFLFFBQXpCLENBQWtDLFlBQWxDLENBQUgsRUFBb0Q7QUFDbkRpRCxjQUFXLENBQVg7QUFDQTtBQUNELE1BQUd2RSxFQUFFa0csUUFBRixFQUFZTixJQUFaLENBQWlCLE1BQWpCLEVBQXlCdEUsUUFBekIsQ0FBa0MsaUJBQWxDLENBQUgsRUFBeUQ7QUFDeERpRCxjQUFXLENBQVg7QUFDQTtBQUNELE1BQUd2RSxFQUFFa0csUUFBRixFQUFZTixJQUFaLENBQWlCLE1BQWpCLEVBQXlCdEUsUUFBekIsQ0FBa0MsY0FBbEMsQ0FBSCxFQUFzRDtBQUNyRGlELGNBQVcsQ0FBWDtBQUNBO0FBQ0QsTUFBR3ZFLEVBQUVrRyxRQUFGLEVBQVlOLElBQVosQ0FBaUIsTUFBakIsRUFBeUJ0RSxRQUF6QixDQUFrQyxZQUFsQyxDQUFILEVBQW9EO0FBQ25EaUQsY0FBVyxDQUFYO0FBQ0E7QUFDRCxNQUFHdkUsRUFBRWtHLFFBQUYsRUFBWU4sSUFBWixDQUFpQixNQUFqQixFQUF5QnRFLFFBQXpCLENBQWtDLFlBQWxDLENBQUgsRUFBb0Q7QUFDbkROLGVBQVksWUFBTTtBQUNqQnNHO0FBQ0EsSUFGRCxFQUVHLEdBRkg7QUFHQTtBQUNEOztBQUVGOztBQUVFLFVBQVM0QixXQUFULENBQXFCQyxFQUFyQixFQUF5QkMsSUFBekIsRUFBK0I7QUFDOUIsTUFBSUMsWUFBWSxFQUFoQjtBQUNBQSxZQUFVQyxFQUFWLEdBQWUsQ0FBZixDQUFrQkQsVUFBVUUsRUFBVixHQUFlLENBQWYsQ0FBa0JGLFVBQVVHLEVBQVYsR0FBZSxDQUFmLENBQWtCSCxVQUFVSSxFQUFWLEdBQWUsQ0FBZjtBQUN0RCxNQUFJQyxRQUFRLEVBQVosQ0FIOEIsQ0FHYjtBQUNqQixNQUFJQyxRQUFRLEVBQVosQ0FKOEIsQ0FJYjtBQUNqQixNQUFJQyxRQUFRLEVBQVosQ0FMOEIsQ0FLYjtBQUNqQixNQUFJQyxRQUFRLEVBQVosQ0FOOEIsQ0FNYjtBQUNqQixNQUFJQyxRQUFRLEVBQVo7QUFDQSxNQUFJM0UsTUFBTWxGLFNBQVNpRSxjQUFULENBQXdCaUYsRUFBeEIsQ0FBVjtBQUNBaEUsTUFBSWQsZ0JBQUosQ0FBcUIsWUFBckIsRUFBa0MsVUFBU29CLENBQVQsRUFBVztBQUMzQyxPQUFJc0UsSUFBSXRFLEVBQUV1RSxPQUFGLENBQVUsQ0FBVixDQUFSO0FBQ0FYLGFBQVVDLEVBQVYsR0FBZVMsRUFBRUUsT0FBakI7QUFDQVosYUFBVUUsRUFBVixHQUFlUSxFQUFFRyxPQUFqQjtBQUNELEdBSkQsRUFJRSxLQUpGO0FBS0EvRSxNQUFJZCxnQkFBSixDQUFxQixXQUFyQixFQUFpQyxVQUFTb0IsQ0FBVCxFQUFXO0FBQzFDQSxLQUFFMEUsY0FBRjtBQUNBLE9BQUlKLElBQUl0RSxFQUFFdUUsT0FBRixDQUFVLENBQVYsQ0FBUjtBQUNBWCxhQUFVRyxFQUFWLEdBQWVPLEVBQUVFLE9BQWpCO0FBQ0FaLGFBQVVJLEVBQVYsR0FBZU0sRUFBRUcsT0FBakI7QUFDRCxHQUxELEVBS0UsS0FMRjtBQU1BL0UsTUFBSWQsZ0JBQUosQ0FBcUIsVUFBckIsRUFBZ0MsVUFBU29CLENBQVQsRUFBVztBQUN6QztBQUNBLE9BQUssQ0FBRTRELFVBQVVHLEVBQVYsR0FBZUUsS0FBZixHQUF1QkwsVUFBVUMsRUFBbEMsSUFBMENELFVBQVVHLEVBQVYsR0FBZUUsS0FBZixHQUF1QkwsVUFBVUMsRUFBNUUsS0FBc0ZELFVBQVVJLEVBQVYsR0FBZUosVUFBVUUsRUFBVixHQUFlTSxLQUEvQixJQUEwQ1IsVUFBVUUsRUFBVixHQUFlRixVQUFVSSxFQUFWLEdBQWVJLEtBQXhFLElBQW1GUixVQUFVRyxFQUFWLEdBQWUsQ0FBNUwsRUFBa007QUFDaE0sUUFBR0gsVUFBVUcsRUFBVixHQUFlSCxVQUFVQyxFQUE1QixFQUFnQ1EsUUFBUSxHQUFSLENBQWhDLEtBQ0tBLFFBQVEsR0FBUjtBQUNOO0FBQ0Q7QUFKQSxRQUtLLElBQUssQ0FBRVQsVUFBVUksRUFBVixHQUFlRyxLQUFmLEdBQXVCUCxVQUFVRSxFQUFsQyxJQUEwQ0YsVUFBVUksRUFBVixHQUFlRyxLQUFmLEdBQXVCUCxVQUFVRSxFQUE1RSxLQUFzRkYsVUFBVUcsRUFBVixHQUFlSCxVQUFVQyxFQUFWLEdBQWVLLEtBQS9CLElBQTBDTixVQUFVQyxFQUFWLEdBQWVELFVBQVVHLEVBQVYsR0FBZUcsS0FBeEUsSUFBbUZOLFVBQVVJLEVBQVYsR0FBZSxDQUE1TCxFQUFrTTtBQUNyTSxTQUFHSixVQUFVSSxFQUFWLEdBQWVKLFVBQVVFLEVBQTVCLEVBQWdDTyxRQUFRLEdBQVIsQ0FBaEMsS0FDS0EsUUFBUSxHQUFSO0FBQ047O0FBRUQsT0FBSUEsU0FBUyxFQUFiLEVBQWlCO0FBQ2YsUUFBRyxPQUFPVixJQUFQLElBQWUsVUFBbEIsRUFBOEJBLEtBQUtELEVBQUwsRUFBUVcsS0FBUjtBQUMvQjtBQUNELE9BQUlBLFFBQVEsRUFBWjtBQUNBVCxhQUFVQyxFQUFWLEdBQWUsQ0FBZixDQUFrQkQsVUFBVUUsRUFBVixHQUFlLENBQWYsQ0FBa0JGLFVBQVVHLEVBQVYsR0FBZSxDQUFmLENBQWtCSCxVQUFVSSxFQUFWLEdBQWUsQ0FBZjtBQUN2RCxHQWpCRCxFQWlCRSxLQWpCRjtBQWtCRDs7QUFFRjs7QUFFQyxLQUFNM0Isa0JBQWtCLFNBQWxCQSxlQUFrQixDQUFDcUIsRUFBRCxFQUFLaUIsQ0FBTCxFQUFXOztBQUVsQyxNQUFHakIsT0FBTyxVQUFWLEVBQXNCOztBQUVyQixPQUFNa0IsMkJBQTJCckssRUFBRSwwQkFBRixFQUE4QjBCLE1BQS9EOztBQUVBLE9BQUcwSSxNQUFNLEdBQVQsRUFBYzs7QUFFYixRQUFHckwsY0FBY3NMLDJCQUEyQixDQUE1QyxFQUErQztBQUM5Q3RMO0FBQ0EsS0FGRCxNQUVPO0FBQ05BLG1CQUFjLENBQWQ7QUFDQTs7QUFFRGlCLE1BQUUsMEJBQUYsRUFBOEJqQixXQUE5QixFQUEyQzZGLEtBQTNDO0FBQ0E7QUFDRCxPQUFHd0YsTUFBTSxHQUFULEVBQWM7O0FBRWIsUUFBR3JMLGNBQWMsQ0FBakIsRUFBb0I7QUFDbkJBO0FBQ0EsS0FGRCxNQUVPO0FBQ05BLG1CQUFjc0wsMkJBQTJCLENBQXpDO0FBQ0E7O0FBRURySyxNQUFFLDBCQUFGLEVBQThCakIsV0FBOUIsRUFBMkM2RixLQUEzQztBQUNBO0FBQ0Q7QUFDRCxNQUFHdUUsT0FBTyxVQUFWLEVBQXNCOztBQUVyQixPQUFNbUIsMkJBQTJCdEssRUFBRSwwQkFBRixFQUE4QjBCLE1BQS9EOztBQUVBLE9BQUcwSSxNQUFNLEdBQVQsRUFBYzs7QUFFYixRQUFHdEwsY0FBY3dMLDJCQUEyQixDQUE1QyxFQUErQztBQUM5Q3hMO0FBQ0EsS0FGRCxNQUVPO0FBQ05BLG1CQUFjLENBQWQ7QUFDQTs7QUFFRGtCLE1BQUUsMEJBQUYsRUFBOEJsQixXQUE5QixFQUEyQzhGLEtBQTNDO0FBQ0E7QUFDRCxPQUFHd0YsTUFBTSxHQUFULEVBQWM7O0FBRWIsUUFBR3RMLGNBQWMsQ0FBakIsRUFBb0I7QUFDbkJBO0FBQ0EsS0FGRCxNQUVPO0FBQ05BLG1CQUFjd0wsMkJBQTJCLENBQXpDO0FBQ0E7O0FBRUR0SyxNQUFFLDBCQUFGLEVBQThCbEIsV0FBOUIsRUFBMkM4RixLQUEzQztBQUNBO0FBQ0Q7QUFDRCxFQXBERDs7QUFzREQ7O0FBRUMsS0FBRyxDQUFDNUUsRUFBRWtHLFFBQUYsRUFBWU4sSUFBWixDQUFpQixNQUFqQixFQUF5QnRFLFFBQXpCLENBQWtDLFdBQWxDLENBQUosRUFBb0Q7QUFDbkQ0SCxjQUFZLFVBQVosRUFBd0JwQixlQUF4QjtBQUNBb0IsY0FBWSxVQUFaLEVBQXdCcEIsZUFBeEI7QUFDQTtBQUNELENBam5CRCIsImZpbGUiOiJmYWtlX2YyYzE4MzkyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgdGltZSA9IDc1MDtcbmxldCBzZWN0aW9uM0lkeCA9IDA7XG5sZXQgc2VjdGlvbjRJZHggPSAwO1xuXG4vLyBsZXQgRm9vdGJhbGxGcmFtZXMsIFRlbm5pc0ZyYW1lcywgQmFzZWJhbGxGcmFtZXMsIEJhc2tldGJhbGxGcmFtZXMsIEZhbkZyYW1lcywgSWRsZUZyYW1lO1xubGV0IHRlbm5pc0FuaW1hdGlvbiwgZm9vdGJhbGxBbmltYXRpb24sIGJhc2tldGJhbGxBbmltYXRpb24sIGJhc2ViYWxsQW5pbWF0aW9uLCBmYW5BbmltYXRpb247XG5cbmNvbnN0IG1hc3Rlck9iaiA9IHtcblx0c2VjdGlvbjJDdXJyZW50SWR4OiAwLCBcblx0c2VjdGlvbjFDdXJyZW50SWR4OiAwLFxuXHRiYXNrZXRiYWxsOiB7bG9vcEFtb3VudDogMSwgbG9vcElkOiBiYXNrZXRiYWxsQW5pbWF0aW9ufSxcblx0Zm9vdGJhbGw6IHtsb29wQW1vdW50OiAxLCBsb29wSWQ6IGZvb3RiYWxsQW5pbWF0aW9ufSxcblx0dGVubmlzOiB7bG9vcEFtb3VudDogMSwgbG9vcElkOiB0ZW5uaXNBbmltYXRpb259LFxuXHRiYXNlYmFsbDoge2xvb3BBbW91bnQ6IDEsIGxvb3BJZDogYmFzZWJhbGxBbmltYXRpb259LFxuXHRmYW46IHtsb29wQW1vdW50OiAxLCBsb29wSWQ6IGZhbkFuaW1hdGlvbn1cbn07XG5jb25zdCBob21lcGFnZU1vYkltYWdlcyA9IFtcblx0J2Fzc2V0cy9pbWFnZXMvaG9tZXBhZ2VNb2IvYmFza2V0YmFsbC5qcGcnLFxuXHQnYXNzZXRzL2ltYWdlcy9ob21lcGFnZU1vYi9mb290YmFsbC5qcGcnLFxuXHQnYXNzZXRzL2ltYWdlcy9ob21lcGFnZU1vYi90ZW5uaXMuanBnJywgXG5cdCdhc3NldHMvaW1hZ2VzL2hvbWVwYWdlTW9iL2Jhc2ViYWxsLmpwZycsIFxuXHQnYXNzZXRzL2ltYWdlcy9ob21lcGFnZU1vYi9mYW4uanBnJyBcbl1cblxuJChkb2N1bWVudCkucmVhZHkoKCkgPT4ge1xuLy8gV0FJVCBGT1IgZ2Z5Q2F0RW1iZWQgVklERU8gVE8gU1RBUlQgUExBWUlORyBPTiBNT0JJTEUsIFRIRU4gSElERSBUSEUgTE9BRElORyBBTklNQVRJT04uIFxcXFxcblxuXHRpZih3aW5kb3cuaW5uZXJXaWR0aCA8IDgwMCkge1xuXHRcdFxuXHRcdGZldGNoKCdhc3NldHMvanMvRmFudGFzdGVjX1Nwcml0ZV9TaGVldC5qc29uJykudGhlbihmdW5jdGlvbihyZXNwb25zZSkgeyBcblx0XHRcdHJldHVybiByZXNwb25zZS5qc29uKCk7XG5cdFx0fSkudGhlbihmdW5jdGlvbihzcHJpdGVKc29uKSB7XG5cdFx0XHRjb25zdCBJZGxlRnJhbWUgPSBmaWx0ZXJCeVZhbHVlKHNwcml0ZUpzb24uZnJhbWVzLCAnaWRsZScpO1xuXHRcdFx0bWFzdGVyT2JqLmZvb3RiYWxsLmFuaW1hdGlvbkFycmF5ID0gWy4uLklkbGVGcmFtZSwgLi4uZmlsdGVyQnlWYWx1ZShzcHJpdGVKc29uLmZyYW1lcywgJ2Zvb3RiYWxsJyldO1xuXHRcdFx0bWFzdGVyT2JqLnRlbm5pcy5hbmltYXRpb25BcnJheSA9IFsuLi5JZGxlRnJhbWUsIC4uLmZpbHRlckJ5VmFsdWUoc3ByaXRlSnNvbi5mcmFtZXMsICd0ZW5uaXMnKV07XG5cdFx0XHRtYXN0ZXJPYmouYmFzZWJhbGwuYW5pbWF0aW9uQXJyYXkgPSBbLi4uSWRsZUZyYW1lLCAuLi5maWx0ZXJCeVZhbHVlKHNwcml0ZUpzb24uZnJhbWVzLCAnYmFzZWJhbGwnKV07XG5cdFx0XHRtYXN0ZXJPYmouYmFza2V0YmFsbC5hbmltYXRpb25BcnJheSA9IFsuLi5JZGxlRnJhbWUsIC4uLmZpbHRlckJ5VmFsdWUoc3ByaXRlSnNvbi5mcmFtZXMsICdiYXNrZXQnKV07XG5cdFx0XHRtYXN0ZXJPYmouZmFuLmFuaW1hdGlvbkFycmF5ID0gWy4uLklkbGVGcmFtZSwgLi4uZmlsdGVyQnlWYWx1ZShzcHJpdGVKc29uLmZyYW1lcywgJ2ZhbicpXTtcblx0XHRcdFxuXHRcdFx0YW5pbWF0b3JTZXR1cCgpO1xuXHRcdFx0aW1hZ2VDb250cm9sZXIobWFzdGVyT2JqLCAxKTtcblxuXHRcdFx0c2V0SW50ZXJ2YWwoKCkgPT4ge1xuXHRcdFx0XHRpbWFnZUNvbnRyb2xlcihtYXN0ZXJPYmosIDEpO1xuXHRcdFx0fSwgNTAwMCk7XG5cdFx0fSk7XG5cdH1cblxuXHRjb25zdCBmaWx0ZXJCeVZhbHVlID0gKGFycmF5LCBzdHJpbmcpID0+IHtcbiAgICByZXR1cm4gYXJyYXkuZmlsdGVyKG8gPT4gdHlwZW9mIG9bJ2ZpbGVuYW1lJ10gPT09ICdzdHJpbmcnICYmIG9bJ2ZpbGVuYW1lJ10udG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhzdHJpbmcudG9Mb3dlckNhc2UoKSkpO1xuXHR9XG5cblx0Y29uc3QgYW5pbWF0b3JTZXR1cCA9ICgpID0+IHtcblx0XHRcdFxuICAgIHZhciBsYXN0VGltZSA9IDA7XG4gICAgdmFyIHZlbmRvcnMgPSBbJ21zJywgJ21veicsICd3ZWJraXQnLCAnbyddO1xuICAgIGZvcih2YXIgeCA9IDA7IHggPCB2ZW5kb3JzLmxlbmd0aCAmJiAhd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZTsgKyt4KSB7XG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSB3aW5kb3dbdmVuZG9yc1t4XSsnUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ107XG4gICAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdKydDYW5jZWxBbmltYXRpb25GcmFtZSddIHx8IHdpbmRvd1t2ZW5kb3JzW3hdKydDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUnXTtcbiAgICB9XG4gXG4gICAgaWYgKCF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKVxuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24oY2FsbGJhY2ssIGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHZhciBjdXJyVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICAgICAgdmFyIHRpbWVUb0NhbGwgPSBNYXRoLm1heCgwLCAxNiAtIChjdXJyVGltZSAtIGxhc3RUaW1lKSk7XG4gICAgICAgICAgICB2YXIgaWQgPSB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHsgY2FsbGJhY2soY3VyclRpbWUgKyB0aW1lVG9DYWxsKTsgfSwgXG4gICAgICAgICAgICAgIHRpbWVUb0NhbGwpO1xuICAgICAgICAgICAgbGFzdFRpbWUgPSBjdXJyVGltZSArIHRpbWVUb0NhbGw7XG4gICAgICAgICAgICByZXR1cm4gaWQ7XG4gICAgICAgIH07XG4gXG4gICAgaWYgKCF3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUpXG4gICAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQoaWQpO1xuICAgICAgICB9O1xuXHR9XG5cblx0Y29uc3QgYW5pbWF0b3IgPSAoYW5pbWF0aW9uT2JqKSA9PiB7XG5cdFx0XHRcdFx0XHRcblx0XHR2YXIgZGFuY2luZ0ljb24sXG5cdFx0XHRzcHJpdGVJbWFnZSxcblx0XHRcdGNhbnZhcztcdFx0XHRcdFx0XG5cblx0XHRmdW5jdGlvbiBnYW1lTG9vcCAoKSB7XG5cdFx0XHQkKCcjbG9hZGluZycpLmFkZENsYXNzKCdoaWRkZW4nKTtcblx0XHQgIGFuaW1hdGlvbk9iai5sb29wSWQgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGdhbWVMb29wKTtcblx0XHQgIGRhbmNpbmdJY29uLnVwZGF0ZSgpO1xuXHRcdCAgZGFuY2luZ0ljb24ucmVuZGVyKCk7XG5cdFx0fVxuXHRcdFxuXHRcdGZ1bmN0aW9uIHNwcml0ZSAob3B0aW9ucykge1xuXHRcdFxuXHRcdFx0dmFyIHRoYXQgPSB7fSxcblx0XHRcdFx0ZnJhbWVJbmRleCA9IDAsXG5cdFx0XHRcdHRpY2tDb3VudCA9IDAsXG5cdFx0XHRcdGxvb3BDb3VudCA9IDAsXG5cdFx0XHRcdHRpY2tzUGVyRnJhbWUgPSBvcHRpb25zLnRpY2tzUGVyRnJhbWUgfHwgMCxcblx0XHRcdFx0bnVtYmVyT2ZGcmFtZXMgPSBvcHRpb25zLm51bWJlck9mRnJhbWVzIHx8IDE7XG5cdFx0XHRcblx0XHRcdHRoYXQuY29udGV4dCA9IG9wdGlvbnMuY29udGV4dDtcblx0XHRcdHRoYXQud2lkdGggPSBvcHRpb25zLndpZHRoO1xuXHRcdFx0dGhhdC5oZWlnaHQgPSBvcHRpb25zLmhlaWdodDtcblx0XHRcdHRoYXQuaW1hZ2UgPSBvcHRpb25zLmltYWdlO1xuXHRcdFx0dGhhdC5sb29wcyA9IG9wdGlvbnMubG9vcHM7XG5cdFx0XHRcblx0XHRcdHRoYXQudXBkYXRlID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHRpY2tDb3VudCArPSAxO1xuXG4gICAgICAgIGlmICh0aWNrQ291bnQgPiB0aWNrc1BlckZyYW1lKSB7XG5cblx0XHRcdFx0XHR0aWNrQ291bnQgPSAwO1xuICAgICAgICAgIC8vIElmIHRoZSBjdXJyZW50IGZyYW1lIGluZGV4IGlzIGluIHJhbmdlXG4gICAgICAgICAgaWYgKGZyYW1lSW5kZXggPCBudW1iZXJPZkZyYW1lcyAtIDEpIHtcdFxuICAgICAgICAgIC8vIEdvIHRvIHRoZSBuZXh0IGZyYW1lXG4gICAgICAgICAgICBmcmFtZUluZGV4ICs9IDE7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgXHRcdGxvb3BDb3VudCsrXG4gICAgICAgICAgICBmcmFtZUluZGV4ID0gMDtcblxuICAgICAgICAgICAgaWYobG9vcENvdW50ID09PSB0aGF0Lmxvb3BzKSB7XG4gICAgICAgICAgICBcdHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZShhbmltYXRpb25PYmoubG9vcElkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cdCAgICAgIH1cblx0ICAgIH1cblx0XHRcdFxuXHRcdFx0dGhhdC5yZW5kZXIgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcblx0XHRcdCAgLy8gQ2xlYXIgdGhlIGNhbnZhc1xuXHRcdFx0ICB0aGF0LmNvbnRleHQuY2xlYXJSZWN0KDAsIDAsIHRoYXQud2lkdGgsIHRoYXQuaGVpZ2h0KTtcblx0XHRcdCAgXG5cdFx0XHQgIHRoYXQuY29udGV4dC5kcmF3SW1hZ2UoXG5cdFx0XHQgICAgdGhhdC5pbWFnZSxcblx0XHRcdCAgICBhbmltYXRpb25PYmouYW5pbWF0aW9uQXJyYXlbZnJhbWVJbmRleF0uZnJhbWUueCxcblx0XHRcdCAgICBhbmltYXRpb25PYmouYW5pbWF0aW9uQXJyYXlbZnJhbWVJbmRleF0uZnJhbWUueSxcblx0XHRcdCAgICAyMDAsXG5cdFx0XHQgICAgMTc1LFxuXHRcdFx0ICAgIDAsXG5cdFx0XHQgICAgMCxcblx0XHRcdCAgICB3aW5kb3cuaW5uZXJXaWR0aCAvIDMuODQ2LFxuXHRcdFx0ICAgIHdpbmRvdy5pbm5lcldpZHRoIC8gNC4xKVxuXHRcdFx0fTtcblx0XHRcdFxuXHRcdFx0cmV0dXJuIHRoYXQ7XG5cdFx0fVxuXHRcdFxuXHRcdC8vIEdldCBjYW52YXNcblx0XHRjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJyk7XG5cdFx0Y2FudmFzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGggLyAzLjg0Njtcblx0XHRjYW52YXMuaGVpZ2h0ID0gd2luZG93LmlubmVyV2lkdGggLyAyLjI7XG5cdFx0XG5cdFx0Ly8gQ3JlYXRlIHNwcml0ZSBzaGVldFxuXHRcdHNwcml0ZUltYWdlID0gbmV3IEltYWdlKCk7XHRcblx0XHRcblx0XHQvLyBDcmVhdGUgc3ByaXRlXG5cdFx0ZGFuY2luZ0ljb24gPSBzcHJpdGUoe1xuXHRcdFx0Y29udGV4dDogY2FudmFzLmdldENvbnRleHQoXCIyZFwiKSxcblx0XHRcdHdpZHRoOiA0MDQwLFxuXHRcdFx0aGVpZ2h0OiAxNzcwLFxuXHRcdFx0aW1hZ2U6IHNwcml0ZUltYWdlLFxuXHRcdFx0bnVtYmVyT2ZGcmFtZXM6IGFuaW1hdGlvbk9iai5hbmltYXRpb25BcnJheS5sZW5ndGgsXG5cdFx0XHR0aWNrc1BlckZyYW1lOiA0LFxuXHRcdFx0bG9vcHM6IGFuaW1hdGlvbk9iai5sb29wQW1vdW50XG5cdFx0fSk7XG5cdFx0XG5cdFx0Ly8gTG9hZCBzcHJpdGUgc2hlZXRcblx0XHRzcHJpdGVJbWFnZS5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBnYW1lTG9vcCk7XG5cdFx0c3ByaXRlSW1hZ2Uuc3JjID0gJ2Fzc2V0cy9pbWFnZXMvRmFudGFzdGVjX1Nwcml0ZV9TaGVldC5wbmcnO1xuXHR9IFxuXG4vLyBJTklUSUFMSVNFIEFORCBTRVRVUCBDVVJSRU5UIFBBR0UuIEVYRUNVVEUgVFJBTlNJVElPTlMgQU5EIFJFTU9WRSBUSU5UIElGIFJFTEVWQU5UIFxcXFxcblxuXHRjb25zdFx0cGFnZUxvYWRlciA9IChpbmRleCkgPT4ge1xuXHRcdGlmKGluZGV4ID09PSA1KSB7XG5cdFx0XHQkKCcudGludCcpLnJlbW92ZUNsYXNzKCdyZW1vdmVUaW50Jyk7XG5cdFx0XHQkKCcuYmFja2dyb3VuZFdyYXBwZXInKS5yZW1vdmVDbGFzcygnc2NhbGVCYWNrZ3JvdW5kJyk7XG5cdFx0XHQkKCcjc2VjdGlvbjUnKS5maW5kKCcuaGVhZGluZycpLmFkZENsYXNzKCdzaG93IGZhZGVJbicpO1xuXHRcdFx0JCgnLnN1YlNlY3Rpb24nKS5hZGRDbGFzcygnc2NhbGVCYWNrZ3JvdW5kJyk7XG5cdFx0XHQkKCcuc3ViU2VjdGlvbicpLmZpbmQoJy50aW50JykuYWRkQ2xhc3MoJ3JlbW92ZVRpbnQnKTtcblx0XHRcdCQoJyNzZWN0aW9uNScpLmZpbmQoJy50ZXh0V3JhcHBlcicpLmFkZENsYXNzKCdzaG93Jyk7XG5cdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0JCgnLnN1YlNlY3Rpb24gPiAudGV4dFdyYXBwZXInKS5maW5kKCcuaGVhZGluZycpLmFkZENsYXNzKCdmYWRlSW4nKTtcblx0XHRcdH0sIDEwMDApO1xuXHRcdH0gXG5cdFx0ZWxzZSB7XG5cdFx0XHQkKCcudGludCcpLnJlbW92ZUNsYXNzKCdyZW1vdmVUaW50Jyk7XG5cdFx0XHQkKCcuc3ViU2VjdGlvbicpLnJlbW92ZUNsYXNzKCdzY2FsZUJhY2tncm91bmQnKTtcblx0XHRcdCQoYC5iYWNrZ3JvdW5kV3JhcHBlcjpub3QoI3NlY3Rpb24ke2luZGV4fUJhY2tncm91bmQpYCkucmVtb3ZlQ2xhc3MoJ3NjYWxlQmFja2dyb3VuZCcpO1xuXHRcdFx0JChgLnNlY3Rpb24uYWN0aXZlYCkuZmluZChgLmJhY2tncm91bmRXcmFwcGVyYCkuYWRkQ2xhc3MoJ3NjYWxlQmFja2dyb3VuZCcpO1xuXHRcdFx0JChgc2VjdGlvbi5hY3RpdmVgKS5maW5kKCcudGludCcpLmFkZENsYXNzKCdyZW1vdmVUaW50Jyk7XG5cblx0XHRcdGlmKCQoYC5zZWN0aW9uJHtpbmRleH1QYWdpbmF0b3JCdXR0b25gKS5sZW5ndGggJiYgJChgLnNlY3Rpb24ke2luZGV4fVBhZ2luYXRvckJ1dHRvbi5hY3RpdmVgKS5sZW5ndGggPCAxKSB7XG5cdFx0XHRcdCQoYC5zZWN0aW9uJHtpbmRleH1QYWdpbmF0b3JCdXR0b25gKS5nZXQoMCkuY2xpY2soKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cbi8vIEhJREUgQUxMIEJFQ0tHUk9VTkRTIElOIFRIRSBTRUNUSU9OIEVYQ0VQVCBUSEUgU1BFQ0lGSUVEIElOREVYLCBXSElDSCBJUyBTQ0FMRUQgQU5EIFNIT1dOLiBcXFxcXG5cblx0Y29uc3QgaW5pdGlhbGl6ZVNlY3Rpb24gPSAoc2VjdGlvbk51bWJlciwgaWR4KSA9PiB7XG5cdFx0JChgI3NlY3Rpb24ke3NlY3Rpb25OdW1iZXJ9QmFja2dyb3VuZCR7aWR4fWApLnNpYmxpbmdzKCcuYmFja2dyb3VuZFdyYXBwZXInKS5tYXAoKGl4LCBlbGUpID0+IHtcblx0XHRcdCQoZWxlKS5jc3Moe29wYWNpdHk6IDB9KTtcblx0XHR9KTtcblxuXHRcdCQoYCNzZWN0aW9uJHtzZWN0aW9uTnVtYmVyfUJhY2tncm91bmQke2lkeH1gKS5jc3Moe1xuXHRcdFx0J3RyYW5zZm9ybSc6ICdzY2FsZSgxLjEpJyxcblx0XHRcdCdvcGFjaXR5JzogMVxuXHRcdH0pO1xuXHR9O1xuXG4vLyBJTklUSUFURSBpbml0aWFsaXplU2VjdGlvbiBPTiBTRUNUSU9OUyAzIEFORCA0LiBcXFxcXG5cdGluaXRpYWxpemVTZWN0aW9uKDEsIDApO1xuXHRpbml0aWFsaXplU2VjdGlvbigzLCAwKTtcblx0aW5pdGlhbGl6ZVNlY3Rpb24oNCwgMCk7XG5cbi8vIFNFQ1RJT05TIDIgKEFCT1VUIFVTIFNFQ1RJT04pIEJBQ0tHUk9VTkQgSU1BR0UgVFJBTlNJVElPTiBIQU5ETEVSLiBcXFxcXG5cblx0Y29uc3QgaW1hZ2VDb250cm9sZXIgPSAoaWR4T2JqLCBzZWN0aW9uTnVtYmVyKSA9PiB7XG5cdFx0bGV0IHJlbGV2YW50QW5pbWF0aW9uO1xuXG5cdFx0aWYoc2VjdGlvbk51bWJlciA9PT0gMSkge1xuXHRcdFx0c3dpdGNoKGlkeE9iai5zZWN0aW9uMUN1cnJlbnRJZHgpIHtcblx0XHRcdFx0Y2FzZSAwOlxuXHRcdFx0XHRcdHJlbGV2YW50QW5pbWF0aW9uID0gbWFzdGVyT2JqLmJhc2tldGJhbGw7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIDE6XG5cdFx0XHRcdFx0cmVsZXZhbnRBbmltYXRpb24gPSBtYXN0ZXJPYmouZm9vdGJhbGw7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIDI6XG5cdFx0XHRcdFx0cmVsZXZhbnRBbmltYXRpb24gPSBtYXN0ZXJPYmoudGVubmlzO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAzOlxuXHRcdFx0XHRcdHJlbGV2YW50QW5pbWF0aW9uID0gbWFzdGVyT2JqLmJhc2ViYWxsO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSA0OlxuXHRcdFx0XHRcdHJlbGV2YW50QW5pbWF0aW9uID0gbWFzdGVyT2JqLmZhbjtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0JChgI3NlY3Rpb24ke3NlY3Rpb25OdW1iZXJ9YCkuZmluZCgnLnRpbnQnKS5yZW1vdmVDbGFzcygncmVtb3ZlVGludCcpO1xuXHRcdCQoYCNzZWN0aW9uJHtzZWN0aW9uTnVtYmVyfUJhY2tncm91bmQke2lkeE9ialtgc2VjdGlvbiR7c2VjdGlvbk51bWJlcn1DdXJyZW50SWR4YF19YCkucmVtb3ZlQ2xhc3MoJ3NjYWxlQmFja2dyb3VuZCcpO1xuXHRcdGluaXRpYWxpemVTZWN0aW9uKHNlY3Rpb25OdW1iZXIsIGlkeE9ialtgc2VjdGlvbiR7c2VjdGlvbk51bWJlcn1DdXJyZW50SWR4YF0pO1xuXHRcdFxuXHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0aWYoc2VjdGlvbk51bWJlciA9PT0gMSkge1xuXHRcdFx0XHRhbmltYXRvcihyZWxldmFudEFuaW1hdGlvbik7XG5cdFx0XHR9XG5cblx0XHRcdCQoYCNzZWN0aW9uJHtzZWN0aW9uTnVtYmVyfWApLmZpbmQoYC5iYWNrZ3JvdW5kV3JhcHBlcmApLmFkZENsYXNzKCdzY2FsZUJhY2tncm91bmQnKTtcblx0XHRcdCQoYCNzZWN0aW9uJHtzZWN0aW9uTnVtYmVyfWApLmZpbmQoJy50aW50JykuYWRkQ2xhc3MoJ3JlbW92ZVRpbnQnKTtcblx0XHR9LCA1MDApO1xuXG5cdFx0aWYoaWR4T2JqW2BzZWN0aW9uJHtzZWN0aW9uTnVtYmVyfUN1cnJlbnRJZHhgXSA9PT0gJChgI3NlY3Rpb24ke3NlY3Rpb25OdW1iZXJ9YCkuZmluZChgLmJhY2tncm91bmRXcmFwcGVyYCkubGVuZ3RoIC0gMSkge1xuXHRcdFx0aWR4T2JqW2BzZWN0aW9uJHtzZWN0aW9uTnVtYmVyfUN1cnJlbnRJZHhgXSA9IDA7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlkeE9ialtgc2VjdGlvbiR7c2VjdGlvbk51bWJlcn1DdXJyZW50SWR4YF0gKz0gMTtcblx0XHR9XG5cdH1cblxuXHRpbWFnZUNvbnRyb2xlcihtYXN0ZXJPYmosIDIpO1xuXG5cdHNldEludGVydmFsKCgpID0+IHtcblx0XHRpbWFnZUNvbnRyb2xlcihtYXN0ZXJPYmosIDIpO1xuXHR9LCAxNTAwMCk7XG5cbi8vIFBBR0lOQVRJT04gQlVUVE9OUyBDTElDSyBIQU5ETEVSIEZPUiBTRUNUSU9OUyAzIEFORCA0LiBcXFxcXG5cblx0Y29uc3QgaGFuZGxlUGFuaW5hdGlvbkJ1dHRvbkNsaWNrID0gKGUpID0+IHtcblxuXHRcdGNvbnN0IGlkeCA9IHBhcnNlSW50KCQoZS50YXJnZXQpLmF0dHIoJ2RhdGEtaW5kZXgnKSk7XG5cdFx0Y29uc3Qgc2VjdGlvbklkID0gJChlLnRhcmdldCkuY2xvc2VzdCgnc2VjdGlvbicpLmF0dHIoJ2lkJyk7XG5cdFx0bGV0IHJlbGV2YW50RGF0YUFycmF5O1xuXG5cdFx0aWYoc2VjdGlvbklkID09PSAnc2VjdGlvbjMnKSB7XG5cdFx0XHRzZWN0aW9uM0lkeCA9IGlkeDtcblx0XHR9XG5cblx0XHRpZihzZWN0aW9uSWQgPT09ICdzZWN0aW9uNCcpIHtcblx0XHRcdHNlY3Rpb240SWR4ID0gaWR4O1xuXHRcdH1cblxuXHRcdCQoYCMke3NlY3Rpb25JZH1gKS5maW5kKCcudGludCcpLnJlbW92ZUNsYXNzKCdyZW1vdmVUaW50Jyk7XG5cdFx0JChgIyR7c2VjdGlvbklkfWApLmZpbmQoJy50ZXh0V3JhcHBlcicpLnJlbW92ZUNsYXNzKCdzaG93Jyk7XG5cdFx0JChgIyR7c2VjdGlvbklkfWApLmZpbmQoYCN0ZXh0V3JhcHBlciR7aWR4fWApLmFkZENsYXNzKCdzaG93Jyk7XG5cdFx0JChgIyR7c2VjdGlvbklkfUJhY2tncm91bmQke2lkeH1gKS5yZW1vdmVDbGFzcygnc2NhbGVCYWNrZ3JvdW5kJyk7XG5cdFx0JChgLiR7c2VjdGlvbklkfVBhZ2luYXRvckJ1dHRvbmApLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblx0XHQkKGUudGFyZ2V0KS5hZGRDbGFzcygnYWN0aXZlJyk7XG5cblx0XHRpbml0aWFsaXplU2VjdGlvbihwYXJzZUludCgkKGAjJHtzZWN0aW9uSWR9YCkuYXR0cignZGF0YS1pbmRleCcpKSwgaWR4KTtcblxuXHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0cGFnZUxvYWRlcihwYXJzZUludCgkKGAjJHtzZWN0aW9uSWR9YCkuYXR0cignZGF0YS1pbmRleCcpKSk7XG5cdFx0fSwgNTAwKTtcblxuXHRcdGlmKHNlY3Rpb25JZCAhPT0gJ3NlY3Rpb24yJyl7XG5cdFx0XHQkKGAjJHtzZWN0aW9uSWR9YCkuZmluZCgnLmhlYWRpbmcsIHAnKS5hZGRDbGFzcygnZmFkZUluJyk7XG5cdFx0XHQkKGAjJHtzZWN0aW9uSWR9YCkub24oJ3RyYW5zaXRpb25lbmQgd2Via2l0VHJhbnNpdGlvbkVuZCBvVHJhbnNpdGlvbkVuZCcsIChlcykgPT4ge1xuXHQgICAgXHQkKGAjJHtzZWN0aW9uSWR9YCkuZmluZCgnLmhlYWRpbmcsIHAnKS5yZW1vdmVDbGFzcygnZmFkZUluJyk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH07XG5cbi8vIENMSUNLIExJU1RFTkVSIEZPUiBQQUdJTkFUSU9OIEJVVFRPTlMgT04gU0VDVElPTlMgMyBBTkQgNC4gXFxcXFxuXG5cdCQoJy5zZWN0aW9uM1BhZ2luYXRvckJ1dHRvbiwgLnNlY3Rpb240UGFnaW5hdG9yQnV0dG9uJykuY2xpY2soKGUpID0+IHtcblx0XHRoYW5kbGVQYW5pbmF0aW9uQnV0dG9uQ2xpY2soZSk7XG5cdH0pO1xuXG4vLyBJTklUSUFMSVpFIE9ORVBBR0VTQ1JPTEwgSUYgTk9UIElOIENNUyBQUkVWSUVXLiBcXFxcXG5cblx0aWYoISQobG9jYXRpb24pLmF0dHIoJ2hyZWYnKS5pbmNsdWRlcygnaW5kZXgucGhwJykpIHtcblx0XHQkKCcjc2Nyb2xsZXJXcmFwcGVyJykub25lcGFnZV9zY3JvbGwoe1xuXHRcdFx0c2VjdGlvbkNvbnRhaW5lcjogXCJzZWN0aW9uXCIsICAgIFxuXHRcdFx0ZWFzaW5nOiBcImVhc2Utb3V0XCIsICAgICAgICAgICAgICAgICBcblx0XHRcdGFuaW1hdGlvblRpbWU6IHRpbWUsICAgICAgICAgICAgXG5cdFx0XHRwYWdpbmF0aW9uOiB0cnVlLCAgICAgICAgICAgICAgIFxuXHRcdFx0dXBkYXRlVVJMOiB0cnVlLCAgICAgICAgICAgICAgIFxuXHRcdFx0YmVmb3JlTW92ZTogKGluZGV4KSA9PiB7fSwgXG5cdFx0XHRhZnRlck1vdmU6IChpbmRleCkgPT4ge1xuLy8gSU5JVElBTElaRSBUSEUgQ1VSUkVOVCBQQUdFLiBcXFxcXG5cblx0XHRcdFx0cGFnZUxvYWRlcihpbmRleCk7XG5cdFx0XHR9LCAgXG5cdFx0XHRsb29wOiBmYWxzZSwgICAgICAgICAgICAgICAgICAgIFxuXHRcdFx0a2V5Ym9hcmQ6IHRydWUsICAgICAgICAgICAgICAgICBcblx0XHRcdHJlc3BvbnNpdmVGYWxsYmFjazogZmFsc2UsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5cdFx0XHRkaXJlY3Rpb246IFwidmVydGljYWxcIiAgICAgICAgICBcblx0XHR9KTtcblxuXHRcdCQoJyNzY3JvbGxlcldyYXBwZXInKS5tb3ZlVG8oMSk7XG5cdH1cblxuLy8gQ09OVFJPTCBDTElDS1MgT04gV09SSyBXSVRIIFVTIFNFQ1RJT04gKFNFQ1RJT041KS4gXFxcXFxuXG5cdCQoJy5jbGlja2FibGUnKS5jbGljaygoZSkgPT4ge1xuXHRcdGxldCBjdXJyZW50U2VjdGlvbiA9ICQoZS50YXJnZXQpLmNsb3Nlc3QoJCgnLnN1YlNlY3Rpb24nKSk7XG5cblx0XHRpZihjdXJyZW50U2VjdGlvbi5oYXNDbGFzcygnb3BlbicpKSB7XG5cdFx0XHRjdXJyZW50U2VjdGlvbi5yZW1vdmVDbGFzcygnb3BlbicpO1xuXHRcdFx0Y3VycmVudFNlY3Rpb24uZmluZCgnLmJ1dHRvbiwgcCcpLnJlbW92ZUNsYXNzKCdmYWRlSW4nKTtcblx0XHRcdGN1cnJlbnRTZWN0aW9uLnNpYmxpbmdzKCcuc3ViU2VjdGlvbicpLm1hcCgoaWR4LCBzZWN0aW9uKSA9PiB7XG5cdFx0XHRcdCQoc2VjdGlvbikucmVtb3ZlQ2xhc3MoJ2Nsb3NlZCcpO1xuXHRcdFx0XHQkKHNlY3Rpb24pLmZpbmQoJy50aW50JykucmVtb3ZlQ2xhc3MoJ2FkZFRpbnQnKS5hZGRDbGFzcygncmVtb3ZlVGludCcpO1xuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGN1cnJlbnRTZWN0aW9uLnJlbW92ZUNsYXNzKCdjbG9zZWQnKS5hZGRDbGFzcygnb3BlbicpO1xuXHRcdFx0Y3VycmVudFNlY3Rpb24ub24oJ3RyYW5zaXRpb25lbmQgd2Via2l0VHJhbnNpdGlvbkVuZCBvVHJhbnNpdGlvbkVuZCcsIChlcykgPT4ge1xuXHQgICAgXHQkKCcuc3ViU2VjdGlvbi5vcGVuJykuZmluZCgnLmJ1dHRvbiwgcCcpLmFkZENsYXNzKCdmYWRlSW4nKTtcblx0XHRcdH0pO1xuXHRcdFx0Y3VycmVudFNlY3Rpb24uc2libGluZ3MoJy5zdWJTZWN0aW9uJykubWFwKChpZHgsIHNlY3Rpb24pID0+IHtcblx0XHRcdFx0JChzZWN0aW9uKS5yZW1vdmVDbGFzcygnb3BlbicpLmFkZENsYXNzKCdjbG9zZWQnKTtcblx0XHRcdFx0JChzZWN0aW9uKS5maW5kKCcudGludCcpLnJlbW92ZUNsYXNzKCdyZW1vdmVUaW50JykuYWRkQ2xhc3MoJ2FkZFRpbnQnKTtcblx0XHRcdFx0JChzZWN0aW9uKS5maW5kKCcuYnV0dG9uLCBwJykucmVtb3ZlQ2xhc3MoJ2ZhZGVJbicpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdGN1cnJlbnRTZWN0aW9uLmZpbmQoJy50aW50JykucmVtb3ZlQ2xhc3MoJ2FkZFRpbnQnKS5hZGRDbGFzcygncmVtb3ZlVGludCcpO1xuXHR9KTtcblxuLy8gQ09OVFJPTCBGT09URVIgQVJST1cgQ0xJQ0tTLiBcXFxcXG5cblx0JCgnI2Rvd25BcnJvdycpLmNsaWNrKCgpID0+IHtcblx0XHRpZigkKHdpbmRvdykuaGVpZ2h0KCkgKiAoJCgnLnBhZ2UnKS5sZW5ndGggLSAxKSA9PT0gLSAkKCcjc2Nyb2xsZXJXcmFwcGVyJykub2Zmc2V0KCkudG9wKSB7XG5cdCAgXHQkKCcjc2Nyb2xsZXJXcmFwcGVyJykubW92ZVRvKDEpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkKCcjc2Nyb2xsZXJXcmFwcGVyJykubW92ZURvd24oKTtcblx0XHR9XG5cdH0pO1xuXG4vLyBISURFIFRIRSBMT0FESU5HIEFOSU1BVElPUE4gV0hFTiBWSURFTyBJUyBSRUFEWSBUTyBQTEFZIE9OIERFWEtUT1AuIFxcXFxcblxuXHRjb25zdCBoaWRlTG9hZGluZ0FuaW1hdGlvbiA9ICgpID0+IHtcblx0XHRpZih3aW5kb3cuaW5uZXJXaWR0aCA+IDgwMCAmJiAhJCgnI2xvYWRpbmcnKS5oYXNDbGFzcygnaGlkZGVuJykpIHtcblxuXHRcdFx0aWYoJCgnI3ZpZGVvJykuZ2V0KDApLnJlYWR5U3RhdGUgPT09IDQpIHtcblx0XHRcdFx0JCgnI2xvYWRpbmcnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0bGV0IHNlY3Rpb24zQXV0b21hdGVkLCBhdXRvbWF0ZVNlY3Rpb24zLCBzZWN0aW9uNEF1dG9tYXRlZCwgYXV0b21hdGVTZWN0aW9uNDtcbi8vIE1BTkFHRU1FTlQgRlVOQ1RJT04gRk9SIFNFVFRJTkcgQU5EIENMRUFSSU5HIFRIRSBTTElERSBBVVRPTUFUSU9OIElOVEVSVkFMUy4gXFxcXFxuXG5cdGNvbnN0IGludGVydmFsTWFuYWdlciA9IChmbGFnLCBzZWN0aW9uSWQsIHRpbWUpID0+IHtcbiAgIFx0aWYoZmxhZykge1xuICAgXHRcdGlmKHNlY3Rpb25JZCA9PT0gJ3NlY3Rpb24zJykge1xuICAgXHRcdFx0YXV0b21hdGVTZWN0aW9uMyA9IHNldEludGVydmFsKCgpID0+IHtcblx0ICAgICBcdFx0c3dpcGVDb250cm9sbGVyKHNlY3Rpb25JZCwgJ2wnKTtcdFxuXHQgICAgIFx0fSwgdGltZSk7XG4gICBcdFx0fVxuICAgXHRcdGlmKHNlY3Rpb25JZCA9PT0gJ3NlY3Rpb240Jykge1xuICAgXHRcdFx0YXV0b21hdGVTZWN0aW9uNCA9IHNldEludGVydmFsKCgpID0+IHtcblx0ICAgICBcdFx0c3dpcGVDb250cm9sbGVyKHNlY3Rpb25JZCwgJ2wnKTtcdFxuXHQgICAgIFx0fSwgdGltZSk7XG4gICBcdFx0fVxuICAgICBcdCBcbiAgIFx0fSBlbHNlIHtcbiAgIFx0XHRpZihzZWN0aW9uSWQgPT09ICdzZWN0aW9uMycpIHtcbiAgICBcdFx0Y2xlYXJJbnRlcnZhbChhdXRvbWF0ZVNlY3Rpb24zKTtcbiAgICBcdH1cbiAgICBcdGlmKHNlY3Rpb25JZCA9PT0gJ3NlY3Rpb240Jykge1xuICAgIFx0XHRjbGVhckludGVydmFsKGF1dG9tYXRlU2VjdGlvbjQpO1xuICAgIFx0fVxuICAgXHR9XG5cdH07XG5cbi8vIElGIE5PVCBJTiBDTVMgQURNSU4gUFJFVklFVywgUEVSUEVUVUFMTFkgQ0hFQ0sgSUYgV0UgQVJFIEFUIFRIRSBUT1AgT0YgVEhFIFBBR0UgQU5EIElGIFNPLCBET05UIFNIT1cgVEhFIEZPT1RFUiBPUiBHUkVFTiBTSEFQRS4gXFxcXFxuXG5cdGlmKCEkKGxvY2F0aW9uKS5hdHRyKCdocmVmJykuaW5jbHVkZXMoJ2luZGV4LnBocCcpKSB7XG5cdFx0c2V0SW50ZXJ2YWwoKCkgPT4ge1xuXHRcdFx0aWYoJCgnI3Njcm9sbGVyV3JhcHBlcicpLm9mZnNldCgpLnRvcCA+PSAwKSB7XG5cdFx0XHRcdCQoJyNoZWFkZXJTaGFwZSwgI2Zvb3RlcicpLmFkZENsYXNzKCdtb3ZlT2ZmU2NyZWVuJyk7XG5cdFx0XHRcdCQoJyN2aWRlbycpLmdldCgwKS5wbGF5KCk7XG5cdFx0XHRcdCQoJy5hcnJvdycpLmFkZENsYXNzKCdwdWxzYXRlJyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR2YXIgdGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRcdCQoJyNoZWFkZXJTaGFwZSwgI2Zvb3RlcicpLnJlbW92ZUNsYXNzKCdtb3ZlT2ZmU2NyZWVuJyk7XG5cdFx0XHRcdFx0JCgnI3ZpZGVvJykuZ2V0KDApLnBhdXNlKCk7XG5cdFx0XHRcdFx0JCgnLmFycm93JykucmVtb3ZlQ2xhc3MoJ3B1bHNhdGUnKTtcblx0XHRcdFx0XHRjbGVhclRpbWVvdXQodGltZW91dCk7XG5cdFx0XHRcdH0sIHRpbWUpO1xuXHRcdFx0fVxuXG4vLyBST1RBVEUgVEhFIEFSUk9XIElOIFRIRSBGT09URVIgV0hFTiBBVCBUSEUgQk9UVE9NIE9GIFRIRSBQQUdFIFxcXFxcblxuXHRcdFx0aWYoJCgnI3Njcm9sbGVyV3JhcHBlcicpLm9mZnNldCgpLnRvcCA8IC0gKHdpbmRvdy5pbm5lckhlaWdodCAqIDQpKSB7XG5cdFx0XHRcdCQoJyNkb3duQXJyb3cnKS5jc3Moeyd0cmFuc2Zvcm0nOiAncm90YXRlKDE4MGRlZykgdHJhbnNsYXRlWCgtNTAlKSd9KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCQoJyNkb3duQXJyb3cnKS5jc3Moeyd0cmFuc2Zvcm0nOiAndHJhbnNsYXRlWCgtNTAlKSByb3RhdGUoMGRlZyknfSk7XG5cdFx0XHR9XG5cblx0XHRcdGhpZGVMb2FkaW5nQW5pbWF0aW9uKCk7XG5cbi8vIEFERCBMQU5EU0NBUEUgU1RZTEVTIFRPIFJFTEVWQU5UIEVMRU1FTlRTIFxcXFxcblxuXHRcdFx0aWYod2luZG93Lm1hdGNoTWVkaWEoXCIob3JpZW50YXRpb246IGxhbmRzY2FwZSlcIikubWF0Y2hlcyAmJiB3aW5kb3cuaW5uZXJXaWR0aCA8IDgwMCkge1xuXHRcdFx0ICAkKCcubmF2X2xpbmssICNoZWFkZXJTaGFwZSwgI2Zvb3RlciwgLmN1c3RvbSwgLm1hcmtlciwgI3NlY3Rpb241LCAudGV4dFdyYXBwZXInKS5hZGRDbGFzcygnbGFuZHNjYXBlJyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQgJCgnLm5hdl9saW5rLCAjaGVhZGVyU2hhcGUsICNmb290ZXIsIC5jdXN0b20sIC5tYXJrZXIsICNzZWN0aW9uNSwgLnRleHRXcmFwcGVyJykucmVtb3ZlQ2xhc3MoJ2xhbmRzY2FwZScpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZigkKCcjc2VjdGlvbjMuYWN0aXZlJykubGVuZ3RoKSB7IC8vIEFVVE9NQVRFIFRIRSBTTElERVMgT04gU0VDVElPUE4gMyBFVkVSWSA3IFNFQ09ORFMgSUYgVEhFIFNFQ1RJT04gSVMgQUNUSVZFLiBcXFxcXG5cdFx0XHRcdGlmKHNlY3Rpb24zQXV0b21hdGVkICE9PSB0cnVlKSB7XG5cdFx0XHRcdFx0c2VjdGlvbjNBdXRvbWF0ZWQgPSB0cnVlO1xuXHRcdFx0XHRcdGludGVydmFsTWFuYWdlcih0cnVlLCAnc2VjdGlvbjMnLCA3MDAwKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHsgLy8gU1RPUCBBVVRPTUFURUQgU0xJREVTIE9OIFNFQ1RJT1BOIDMgSUYgVEhFIFNFQ1RJT04gSVMgTk9UIEFDVElWRS4gXFxcXFxuXHRcdFx0XHRpZihzZWN0aW9uM0F1dG9tYXRlZCA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRcdGludGVydmFsTWFuYWdlcihmYWxzZSwgJ3NlY3Rpb24zJyk7XG5cdFx0XHRcdFx0c2VjdGlvbjNBdXRvbWF0ZWQgPSBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZigkKCcjc2VjdGlvbjQuYWN0aXZlJykubGVuZ3RoKSB7IC8vIEFVVE9NQVRFIFRIRSBTTElERVMgT04gU0VDVElPUE4gNCBFVkVSWSA3IFNFQ09ORFMgSUYgVEhFIFNFQ1RJT04gSVMgQUNUSVZFLiBcXFxcXG5cdFx0XHRcdGlmKHNlY3Rpb240QXV0b21hdGVkICE9PSB0cnVlKSB7XG5cdFx0XHRcdFx0c2VjdGlvbjRBdXRvbWF0ZWQgPSB0cnVlO1xuXHRcdFx0XHRcdGludGVydmFsTWFuYWdlcih0cnVlLCAnc2VjdGlvbjQnLCA3MDAwKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHsgLy8gU1RPUCBBVVRPTUFURUQgU0xJREVTIE9OIFNFQ1RJT1BOIDQgSUYgVEhFIFNFQ1RJT04gSVMgTk9UIEFDVElWRS4gXFxcXFxuXHRcdFx0XHRpZihzZWN0aW9uNEF1dG9tYXRlZCA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRcdGludGVydmFsTWFuYWdlcihmYWxzZSwgJ3NlY3Rpb240Jyk7XG5cdFx0XHRcdFx0c2VjdGlvbjRBdXRvbWF0ZWQgPSBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sIDUwMCk7XG5cdH1cblxuLy8gQ09OVFJPTCBXSEFUIEhBUFBFTlMgV0hFTiBMSU5LUyBJTiBUSEUgTkFWL01FTlUgQVJFIENMSUNLRUQgXFxcXFxuXG5cdCQoJy5uYXZfbGluaycpLmNsaWNrKChlKSA9PiB7XG5cdFx0Y29uc3QgcGFnZUlkeCA9IHBhcnNlSW50KCQoZS50YXJnZXQpLmF0dHIoJ2RhdGEtaW5kZXgnKSk7XG5cdFx0JCgnI3Njcm9sbGVyV3JhcHBlcicpLm1vdmVUbyhwYWdlSWR4KTtcblx0XHQkKCcjbWVudUJsb2NrT3V0JykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuXG5cdFx0aWYoYnVyZ2VyLmNsYXNzTGlzdC5jb250YWlucygnYnVyZ2VyLS1hY3RpdmUnKSkge1xuICAgICAgbmF2LmNsYXNzTGlzdC5yZW1vdmUoJ25hdl9vcGVuJyk7XG4gICAgICBidXJnZXIuY2xhc3NMaXN0LnJlbW92ZSgnYnVyZ2VyLS1hY3RpdmUnKTtcbiAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnO1xuICAgIH0gXG5cdH0pO1xuXG4vLyBXSEVOIFRIRSBOQVYgSVMgT1BFTiBQUkVWRU5UIFVTRVIgRlJPTSBCRUlORyBBQkxFIFRPIENMSUNLIEFOWVRISU5HIEVMU0UgXFxcXFxuXG5cdCQoJyNtZW51QmxvY2tPdXQnKS5jbGljaygoZSkgPT4ge1xuXHQgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHR9KTtcblxuXHR2YXIgYnVyZ2VyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW4tYnVyZ2VyJyksIFxuICBuYXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbk5hdicpO1xuXG4vLyBDT05UUk9MIEZPUiBPUEVOIEFORCBDTE9TSU5HIFRIRSBNRU5VL05BViAgXFxcXFxuXG4gIGZ1bmN0aW9uIG5hdkNvbnRyb2woKSB7XG5cbiAgICBpZihidXJnZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdidXJnZXItLWFjdGl2ZScpKSB7XG4gICAgICBuYXYuY2xhc3NMaXN0LnJlbW92ZSgnbmF2X29wZW4nKTtcbiAgICAgIGJ1cmdlci5jbGFzc0xpc3QucmVtb3ZlKCdidXJnZXItLWFjdGl2ZScpO1xuICAgICAgJCgnI21lbnVCbG9ja091dCcpLmFkZENsYXNzKCdoaWRkZW4nKTtcbiAgICB9IFxuICAgIGVsc2Uge1xuICAgICAgYnVyZ2VyLmNsYXNzTGlzdC5hZGQoJ2J1cmdlci0tYWN0aXZlJyk7XG4gICAgICBuYXYuY2xhc3NMaXN0LmFkZCgnbmF2X29wZW4nKTtcbiAgICAgICQoJyNtZW51QmxvY2tPdXQnKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG4gICAgfVxuICB9XG4gIFxuLy8gT05MWSBMSVNURU4gRk9SIE1FTlUgQ0xJQ0tTIFdIRU4gTk9UIElOIENNUyBQUkVWSUVXIE1PREUgXFxcXFxuXG4gIGlmKCEkKGxvY2F0aW9uKS5hdHRyKCdocmVmJykuaW5jbHVkZXMoJ2luZGV4LnBocCcpKSB7XG4gIFx0YnVyZ2VyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgbmF2Q29udHJvbCk7XG4gIH1cblxuLy8gQ0xPU0UgVEhFIE5BViBJRiBUSEUgV0lORE9XIElTIE9WRVIgMTAwMFBYIFdJREUgXFxcXFxuXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBmdW5jdGlvbigpIHtcbiAgICBpZih3aW5kb3cuaW5uZXJXaWR0aCA+IDEwMDAgJiYgbmF2LmNsYXNzTGlzdC5jb250YWlucygnbmF2X29wZW4nKSkge1xuICAgICAgbmF2Q29udHJvbCgpO1xuICAgICAgbmF2LmNsYXNzTGlzdC5yZW1vdmUoJ25hdl9vcGVuJyk7XG4gICAgICAgJCgnI21lbnVCbG9ja091dCcpLmFkZENsYXNzKCdoaWRkZW4nKTtcbiAgICB9XG4gIH0pO1xuXG4vLyBUSElTIFNFVCBPRiBJRiBTVEFURU1FTlRTIElOSVRJQUxJU0VTIFRIRSBTUEVTSUZJQyBQQUdFUyBGT1IgUFJFVklFV0lORyBJTiBDTVMgQURNSU4uIFxcXFxcblxuICBpZigkKGxvY2F0aW9uKS5hdHRyKCdocmVmJykuaW5jbHVkZXMoJ2luZGV4LnBocCcpKSB7XG5cdFx0aWYoJChsb2NhdGlvbikuYXR0cignaHJlZicpLmluY2x1ZGVzKCdpbWFnaW5lLWlmJykpIHtcblx0XHRcdHBhZ2VMb2FkZXIoNCk7XG5cdFx0fVxuXHRcdGlmKCQobG9jYXRpb24pLmF0dHIoJ2hyZWYnKS5pbmNsdWRlcygnaG93LXdlLWlubm92YXRlJykpIHtcblx0XHRcdHBhZ2VMb2FkZXIoMyk7XG5cdFx0fVxuXHRcdGlmKCQobG9jYXRpb24pLmF0dHIoJ2hyZWYnKS5pbmNsdWRlcygnd29yay13aXRoLXVzJykpIHtcblx0XHRcdHBhZ2VMb2FkZXIoNSk7XG5cdFx0fVxuXHRcdGlmKCQobG9jYXRpb24pLmF0dHIoJ2hyZWYnKS5pbmNsdWRlcygnY29udGFjdC11cycpKSB7XG5cdFx0XHRwYWdlTG9hZGVyKDYpO1xuXHRcdH1cblx0XHRpZigkKGxvY2F0aW9uKS5hdHRyKCdocmVmJykuaW5jbHVkZXMoJ2hvbWUtdmlkZW8nKSkge1xuXHRcdFx0c2V0SW50ZXJ2YWwoKCkgPT4ge1xuXHRcdFx0XHRoaWRlTG9hZGluZ0FuaW1hdGlvbigpO1xuXHRcdFx0fSwgNTAwKVxuXHRcdH1cblx0fVxuXG4vLyBTV0lQRSBFVkVOVFMgREVURUNUT1IgRlVOQ1RJT04gXFxcXFxuXG4gIGZ1bmN0aW9uIGRldGVjdHN3aXBlKGVsLCBmdW5jKSB7XG5cdCAgbGV0IHN3aXBlX2RldCA9IHt9O1xuXHQgIHN3aXBlX2RldC5zWCA9IDA7IHN3aXBlX2RldC5zWSA9IDA7IHN3aXBlX2RldC5lWCA9IDA7IHN3aXBlX2RldC5lWSA9IDA7XG5cdCAgdmFyIG1pbl94ID0gMzA7ICAvL21pbiB4IHN3aXBlIGZvciBob3Jpem9udGFsIHN3aXBlXG5cdCAgdmFyIG1heF94ID0gMzA7ICAvL21heCB4IGRpZmZlcmVuY2UgZm9yIHZlcnRpY2FsIHN3aXBlXG5cdCAgdmFyIG1pbl95ID0gNTA7ICAvL21pbiB5IHN3aXBlIGZvciB2ZXJ0aWNhbCBzd2lwZVxuXHQgIHZhciBtYXhfeSA9IDYwOyAgLy9tYXggeSBkaWZmZXJlbmNlIGZvciBob3Jpem9udGFsIHN3aXBlXG5cdCAgdmFyIGRpcmVjID0gXCJcIjtcblx0ICBsZXQgZWxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWwpO1xuXHQgIGVsZS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JyxmdW5jdGlvbihlKXtcblx0ICAgIHZhciB0ID0gZS50b3VjaGVzWzBdO1xuXHQgICAgc3dpcGVfZGV0LnNYID0gdC5zY3JlZW5YOyBcblx0ICAgIHN3aXBlX2RldC5zWSA9IHQuc2NyZWVuWTtcblx0ICB9LGZhbHNlKTtcblx0ICBlbGUuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJyxmdW5jdGlvbihlKXtcblx0ICAgIGUucHJldmVudERlZmF1bHQoKTtcblx0ICAgIHZhciB0ID0gZS50b3VjaGVzWzBdO1xuXHQgICAgc3dpcGVfZGV0LmVYID0gdC5zY3JlZW5YOyBcblx0ICAgIHN3aXBlX2RldC5lWSA9IHQuc2NyZWVuWTsgICAgXG5cdCAgfSxmYWxzZSk7XG5cdCAgZWxlLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJyxmdW5jdGlvbihlKXtcblx0ICAgIC8vaG9yaXpvbnRhbCBkZXRlY3Rpb25cblx0ICAgIGlmICgoKChzd2lwZV9kZXQuZVggLSBtaW5feCA+IHN3aXBlX2RldC5zWCkgfHwgKHN3aXBlX2RldC5lWCArIG1pbl94IDwgc3dpcGVfZGV0LnNYKSkgJiYgKChzd2lwZV9kZXQuZVkgPCBzd2lwZV9kZXQuc1kgKyBtYXhfeSkgJiYgKHN3aXBlX2RldC5zWSA+IHN3aXBlX2RldC5lWSAtIG1heF95KSAmJiAoc3dpcGVfZGV0LmVYID4gMCkpKSkge1xuXHQgICAgICBpZihzd2lwZV9kZXQuZVggPiBzd2lwZV9kZXQuc1gpIGRpcmVjID0gXCJyXCI7XG5cdCAgICAgIGVsc2UgZGlyZWMgPSBcImxcIjtcblx0ICAgIH1cblx0ICAgIC8vdmVydGljYWwgZGV0ZWN0aW9uXG5cdCAgICBlbHNlIGlmICgoKChzd2lwZV9kZXQuZVkgLSBtaW5feSA+IHN3aXBlX2RldC5zWSkgfHwgKHN3aXBlX2RldC5lWSArIG1pbl95IDwgc3dpcGVfZGV0LnNZKSkgJiYgKChzd2lwZV9kZXQuZVggPCBzd2lwZV9kZXQuc1ggKyBtYXhfeCkgJiYgKHN3aXBlX2RldC5zWCA+IHN3aXBlX2RldC5lWCAtIG1heF94KSAmJiAoc3dpcGVfZGV0LmVZID4gMCkpKSkge1xuXHQgICAgICBpZihzd2lwZV9kZXQuZVkgPiBzd2lwZV9kZXQuc1kpIGRpcmVjID0gXCJkXCI7XG5cdCAgICAgIGVsc2UgZGlyZWMgPSBcInVcIjtcblx0ICAgIH1cblxuXHQgICAgaWYgKGRpcmVjICE9IFwiXCIpIHtcblx0ICAgICAgaWYodHlwZW9mIGZ1bmMgPT0gJ2Z1bmN0aW9uJykgZnVuYyhlbCxkaXJlYyk7XG5cdCAgICB9XG5cdCAgICBsZXQgZGlyZWMgPSBcIlwiO1xuXHQgICAgc3dpcGVfZGV0LnNYID0gMDsgc3dpcGVfZGV0LnNZID0gMDsgc3dpcGVfZGV0LmVYID0gMDsgc3dpcGVfZGV0LmVZID0gMDtcblx0ICB9LGZhbHNlKTsgIFxuXHR9XG5cbi8vIENIT1NFIFRIRSBORVhUIFNMSURFIFRPIFNIT1cgQU5EIENMSUNLIFRIRSBQQUdJTkFUSU9OIEJVVFRPTiBUSEFUIFJFTEFURVMgVE8gSVQuIFxcXFxcblxuXHRjb25zdCBzd2lwZUNvbnRyb2xsZXIgPSAoZWwsIGQpID0+IHtcblxuXHRcdGlmKGVsID09PSAnc2VjdGlvbjQnKSB7XG5cblx0XHRcdGNvbnN0IHNlY3Rpb240UGFnaW5hdGlvbkxlbmd0aCA9ICQoJy5zZWN0aW9uNFBhZ2luYXRvckJ1dHRvbicpLmxlbmd0aDtcblxuXHRcdFx0aWYoZCA9PT0gJ2wnKSB7XG5cblx0XHRcdFx0aWYoc2VjdGlvbjRJZHggPCBzZWN0aW9uNFBhZ2luYXRpb25MZW5ndGggLSAxKSB7XG5cdFx0XHRcdFx0c2VjdGlvbjRJZHgrKztcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRzZWN0aW9uNElkeCA9IDA7XG5cdFx0XHRcdH1cblx0XHRcdFx0XG5cdFx0XHRcdCQoJy5zZWN0aW9uNFBhZ2luYXRvckJ1dHRvbicpW3NlY3Rpb240SWR4XS5jbGljaygpO1xuXHRcdFx0fVxuXHRcdFx0aWYoZCA9PT0gJ3InKSB7XG5cblx0XHRcdFx0aWYoc2VjdGlvbjRJZHggPiAwKSB7XG5cdFx0XHRcdFx0c2VjdGlvbjRJZHgtLTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRzZWN0aW9uNElkeCA9IHNlY3Rpb240UGFnaW5hdGlvbkxlbmd0aCAtIDE7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQkKCcuc2VjdGlvbjRQYWdpbmF0b3JCdXR0b24nKVtzZWN0aW9uNElkeF0uY2xpY2soKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYoZWwgPT09ICdzZWN0aW9uMycpIHtcblxuXHRcdFx0Y29uc3Qgc2VjdGlvbjNQYWdpbmF0aW9uTGVuZ3RoID0gJCgnLnNlY3Rpb24zUGFnaW5hdG9yQnV0dG9uJykubGVuZ3RoO1xuXG5cdFx0XHRpZihkID09PSAnbCcpIHtcblxuXHRcdFx0XHRpZihzZWN0aW9uM0lkeCA8IHNlY3Rpb24zUGFnaW5hdGlvbkxlbmd0aCAtIDEpIHtcblx0XHRcdFx0XHRzZWN0aW9uM0lkeCsrO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHNlY3Rpb24zSWR4ID0gMDtcblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdFx0JCgnLnNlY3Rpb24zUGFnaW5hdG9yQnV0dG9uJylbc2VjdGlvbjNJZHhdLmNsaWNrKCk7XG5cdFx0XHR9XG5cdFx0XHRpZihkID09PSAncicpIHtcblxuXHRcdFx0XHRpZihzZWN0aW9uM0lkeCA+IDApIHtcblx0XHRcdFx0XHRzZWN0aW9uM0lkeC0tO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHNlY3Rpb24zSWR4ID0gc2VjdGlvbjNQYWdpbmF0aW9uTGVuZ3RoIC0gMTtcblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdFx0JCgnLnNlY3Rpb24zUGFnaW5hdG9yQnV0dG9uJylbc2VjdGlvbjNJZHhdLmNsaWNrKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cbi8vIElOSVRJQVRFIEZPUiBTV0lQRSBERVRFQ1RJT04gT04gU0VDVElPTlMgMyBBTkQgNCBFWENFUFQgSU4gQURNSU4gUFJFVklFVy4gXFxcXFxuXG5cdGlmKCEkKGxvY2F0aW9uKS5hdHRyKCdocmVmJykuaW5jbHVkZXMoJ2luZGV4LnBocCcpKSB7XG5cdFx0ZGV0ZWN0c3dpcGUoJ3NlY3Rpb240Jywgc3dpcGVDb250cm9sbGVyKTtcblx0XHRkZXRlY3Rzd2lwZSgnc2VjdGlvbjMnLCBzd2lwZUNvbnRyb2xsZXIpO1xuXHR9XG59KTsiXX0=
}).call(this,require("fsovz6"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/fake_f2c18392.js","/")
},{"buffer":2,"fsovz6":3}]},{},[5])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYW1pYW53aHl0ZS9Eb2N1bWVudHMvUHJvamVjdHMvY3JhZnRGYW50YXN0ZWMvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9kYW1pYW53aHl0ZS9Eb2N1bWVudHMvUHJvamVjdHMvY3JhZnRGYW50YXN0ZWMvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jhc2U2NC1qcy9saWIvYjY0LmpzIiwiL1VzZXJzL2RhbWlhbndoeXRlL0RvY3VtZW50cy9Qcm9qZWN0cy9jcmFmdEZhbnRhc3RlYy9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnVmZmVyL2luZGV4LmpzIiwiL1VzZXJzL2RhbWlhbndoeXRlL0RvY3VtZW50cy9Qcm9qZWN0cy9jcmFmdEZhbnRhc3RlYy9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwiL1VzZXJzL2RhbWlhbndoeXRlL0RvY3VtZW50cy9Qcm9qZWN0cy9jcmFmdEZhbnRhc3RlYy9ub2RlX21vZHVsZXMvaWVlZTc1NC9pbmRleC5qcyIsIi9Vc2Vycy9kYW1pYW53aHl0ZS9Eb2N1bWVudHMvUHJvamVjdHMvY3JhZnRGYW50YXN0ZWMvc291cmNlL2pzL2NvbWJpbmVkL2Zha2VfZjJjMTgzOTIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2bENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbnZhciBsb29rdXAgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLyc7XG5cbjsoZnVuY3Rpb24gKGV4cG9ydHMpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG4gIHZhciBBcnIgPSAodHlwZW9mIFVpbnQ4QXJyYXkgIT09ICd1bmRlZmluZWQnKVxuICAgID8gVWludDhBcnJheVxuICAgIDogQXJyYXlcblxuXHR2YXIgUExVUyAgID0gJysnLmNoYXJDb2RlQXQoMClcblx0dmFyIFNMQVNIICA9ICcvJy5jaGFyQ29kZUF0KDApXG5cdHZhciBOVU1CRVIgPSAnMCcuY2hhckNvZGVBdCgwKVxuXHR2YXIgTE9XRVIgID0gJ2EnLmNoYXJDb2RlQXQoMClcblx0dmFyIFVQUEVSICA9ICdBJy5jaGFyQ29kZUF0KDApXG5cdHZhciBQTFVTX1VSTF9TQUZFID0gJy0nLmNoYXJDb2RlQXQoMClcblx0dmFyIFNMQVNIX1VSTF9TQUZFID0gJ18nLmNoYXJDb2RlQXQoMClcblxuXHRmdW5jdGlvbiBkZWNvZGUgKGVsdCkge1xuXHRcdHZhciBjb2RlID0gZWx0LmNoYXJDb2RlQXQoMClcblx0XHRpZiAoY29kZSA9PT0gUExVUyB8fFxuXHRcdCAgICBjb2RlID09PSBQTFVTX1VSTF9TQUZFKVxuXHRcdFx0cmV0dXJuIDYyIC8vICcrJ1xuXHRcdGlmIChjb2RlID09PSBTTEFTSCB8fFxuXHRcdCAgICBjb2RlID09PSBTTEFTSF9VUkxfU0FGRSlcblx0XHRcdHJldHVybiA2MyAvLyAnLydcblx0XHRpZiAoY29kZSA8IE5VTUJFUilcblx0XHRcdHJldHVybiAtMSAvL25vIG1hdGNoXG5cdFx0aWYgKGNvZGUgPCBOVU1CRVIgKyAxMClcblx0XHRcdHJldHVybiBjb2RlIC0gTlVNQkVSICsgMjYgKyAyNlxuXHRcdGlmIChjb2RlIDwgVVBQRVIgKyAyNilcblx0XHRcdHJldHVybiBjb2RlIC0gVVBQRVJcblx0XHRpZiAoY29kZSA8IExPV0VSICsgMjYpXG5cdFx0XHRyZXR1cm4gY29kZSAtIExPV0VSICsgMjZcblx0fVxuXG5cdGZ1bmN0aW9uIGI2NFRvQnl0ZUFycmF5IChiNjQpIHtcblx0XHR2YXIgaSwgaiwgbCwgdG1wLCBwbGFjZUhvbGRlcnMsIGFyclxuXG5cdFx0aWYgKGI2NC5sZW5ndGggJSA0ID4gMCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHN0cmluZy4gTGVuZ3RoIG11c3QgYmUgYSBtdWx0aXBsZSBvZiA0Jylcblx0XHR9XG5cblx0XHQvLyB0aGUgbnVtYmVyIG9mIGVxdWFsIHNpZ25zIChwbGFjZSBob2xkZXJzKVxuXHRcdC8vIGlmIHRoZXJlIGFyZSB0d28gcGxhY2Vob2xkZXJzLCB0aGFuIHRoZSB0d28gY2hhcmFjdGVycyBiZWZvcmUgaXRcblx0XHQvLyByZXByZXNlbnQgb25lIGJ5dGVcblx0XHQvLyBpZiB0aGVyZSBpcyBvbmx5IG9uZSwgdGhlbiB0aGUgdGhyZWUgY2hhcmFjdGVycyBiZWZvcmUgaXQgcmVwcmVzZW50IDIgYnl0ZXNcblx0XHQvLyB0aGlzIGlzIGp1c3QgYSBjaGVhcCBoYWNrIHRvIG5vdCBkbyBpbmRleE9mIHR3aWNlXG5cdFx0dmFyIGxlbiA9IGI2NC5sZW5ndGhcblx0XHRwbGFjZUhvbGRlcnMgPSAnPScgPT09IGI2NC5jaGFyQXQobGVuIC0gMikgPyAyIDogJz0nID09PSBiNjQuY2hhckF0KGxlbiAtIDEpID8gMSA6IDBcblxuXHRcdC8vIGJhc2U2NCBpcyA0LzMgKyB1cCB0byB0d28gY2hhcmFjdGVycyBvZiB0aGUgb3JpZ2luYWwgZGF0YVxuXHRcdGFyciA9IG5ldyBBcnIoYjY0Lmxlbmd0aCAqIDMgLyA0IC0gcGxhY2VIb2xkZXJzKVxuXG5cdFx0Ly8gaWYgdGhlcmUgYXJlIHBsYWNlaG9sZGVycywgb25seSBnZXQgdXAgdG8gdGhlIGxhc3QgY29tcGxldGUgNCBjaGFyc1xuXHRcdGwgPSBwbGFjZUhvbGRlcnMgPiAwID8gYjY0Lmxlbmd0aCAtIDQgOiBiNjQubGVuZ3RoXG5cblx0XHR2YXIgTCA9IDBcblxuXHRcdGZ1bmN0aW9uIHB1c2ggKHYpIHtcblx0XHRcdGFycltMKytdID0gdlxuXHRcdH1cblxuXHRcdGZvciAoaSA9IDAsIGogPSAwOyBpIDwgbDsgaSArPSA0LCBqICs9IDMpIHtcblx0XHRcdHRtcCA9IChkZWNvZGUoYjY0LmNoYXJBdChpKSkgPDwgMTgpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAxKSkgPDwgMTIpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAyKSkgPDwgNikgfCBkZWNvZGUoYjY0LmNoYXJBdChpICsgMykpXG5cdFx0XHRwdXNoKCh0bXAgJiAweEZGMDAwMCkgPj4gMTYpXG5cdFx0XHRwdXNoKCh0bXAgJiAweEZGMDApID4+IDgpXG5cdFx0XHRwdXNoKHRtcCAmIDB4RkYpXG5cdFx0fVxuXG5cdFx0aWYgKHBsYWNlSG9sZGVycyA9PT0gMikge1xuXHRcdFx0dG1wID0gKGRlY29kZShiNjQuY2hhckF0KGkpKSA8PCAyKSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMSkpID4+IDQpXG5cdFx0XHRwdXNoKHRtcCAmIDB4RkYpXG5cdFx0fSBlbHNlIGlmIChwbGFjZUhvbGRlcnMgPT09IDEpIHtcblx0XHRcdHRtcCA9IChkZWNvZGUoYjY0LmNoYXJBdChpKSkgPDwgMTApIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAxKSkgPDwgNCkgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDIpKSA+PiAyKVxuXHRcdFx0cHVzaCgodG1wID4+IDgpICYgMHhGRilcblx0XHRcdHB1c2godG1wICYgMHhGRilcblx0XHR9XG5cblx0XHRyZXR1cm4gYXJyXG5cdH1cblxuXHRmdW5jdGlvbiB1aW50OFRvQmFzZTY0ICh1aW50OCkge1xuXHRcdHZhciBpLFxuXHRcdFx0ZXh0cmFCeXRlcyA9IHVpbnQ4Lmxlbmd0aCAlIDMsIC8vIGlmIHdlIGhhdmUgMSBieXRlIGxlZnQsIHBhZCAyIGJ5dGVzXG5cdFx0XHRvdXRwdXQgPSBcIlwiLFxuXHRcdFx0dGVtcCwgbGVuZ3RoXG5cblx0XHRmdW5jdGlvbiBlbmNvZGUgKG51bSkge1xuXHRcdFx0cmV0dXJuIGxvb2t1cC5jaGFyQXQobnVtKVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHRyaXBsZXRUb0Jhc2U2NCAobnVtKSB7XG5cdFx0XHRyZXR1cm4gZW5jb2RlKG51bSA+PiAxOCAmIDB4M0YpICsgZW5jb2RlKG51bSA+PiAxMiAmIDB4M0YpICsgZW5jb2RlKG51bSA+PiA2ICYgMHgzRikgKyBlbmNvZGUobnVtICYgMHgzRilcblx0XHR9XG5cblx0XHQvLyBnbyB0aHJvdWdoIHRoZSBhcnJheSBldmVyeSB0aHJlZSBieXRlcywgd2UnbGwgZGVhbCB3aXRoIHRyYWlsaW5nIHN0dWZmIGxhdGVyXG5cdFx0Zm9yIChpID0gMCwgbGVuZ3RoID0gdWludDgubGVuZ3RoIC0gZXh0cmFCeXRlczsgaSA8IGxlbmd0aDsgaSArPSAzKSB7XG5cdFx0XHR0ZW1wID0gKHVpbnQ4W2ldIDw8IDE2KSArICh1aW50OFtpICsgMV0gPDwgOCkgKyAodWludDhbaSArIDJdKVxuXHRcdFx0b3V0cHV0ICs9IHRyaXBsZXRUb0Jhc2U2NCh0ZW1wKVxuXHRcdH1cblxuXHRcdC8vIHBhZCB0aGUgZW5kIHdpdGggemVyb3MsIGJ1dCBtYWtlIHN1cmUgdG8gbm90IGZvcmdldCB0aGUgZXh0cmEgYnl0ZXNcblx0XHRzd2l0Y2ggKGV4dHJhQnl0ZXMpIHtcblx0XHRcdGNhc2UgMTpcblx0XHRcdFx0dGVtcCA9IHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDFdXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUodGVtcCA+PiAyKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKCh0ZW1wIDw8IDQpICYgMHgzRilcblx0XHRcdFx0b3V0cHV0ICs9ICc9PSdcblx0XHRcdFx0YnJlYWtcblx0XHRcdGNhc2UgMjpcblx0XHRcdFx0dGVtcCA9ICh1aW50OFt1aW50OC5sZW5ndGggLSAyXSA8PCA4KSArICh1aW50OFt1aW50OC5sZW5ndGggLSAxXSlcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSh0ZW1wID4+IDEwKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKCh0ZW1wID4+IDQpICYgMHgzRilcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSgodGVtcCA8PCAyKSAmIDB4M0YpXG5cdFx0XHRcdG91dHB1dCArPSAnPSdcblx0XHRcdFx0YnJlYWtcblx0XHR9XG5cblx0XHRyZXR1cm4gb3V0cHV0XG5cdH1cblxuXHRleHBvcnRzLnRvQnl0ZUFycmF5ID0gYjY0VG9CeXRlQXJyYXlcblx0ZXhwb3J0cy5mcm9tQnl0ZUFycmF5ID0gdWludDhUb0Jhc2U2NFxufSh0eXBlb2YgZXhwb3J0cyA9PT0gJ3VuZGVmaW5lZCcgPyAodGhpcy5iYXNlNjRqcyA9IHt9KSA6IGV4cG9ydHMpKVxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcImZzb3Z6NlwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9iYXNlNjQtanMvbGliL2I2NC5qc1wiLFwiLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9iYXNlNjQtanMvbGliXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLyohXG4gKiBUaGUgYnVmZmVyIG1vZHVsZSBmcm9tIG5vZGUuanMsIGZvciB0aGUgYnJvd3Nlci5cbiAqXG4gKiBAYXV0aG9yICAgRmVyb3NzIEFib3VraGFkaWplaCA8ZmVyb3NzQGZlcm9zcy5vcmc+IDxodHRwOi8vZmVyb3NzLm9yZz5cbiAqIEBsaWNlbnNlICBNSVRcbiAqL1xuXG52YXIgYmFzZTY0ID0gcmVxdWlyZSgnYmFzZTY0LWpzJylcbnZhciBpZWVlNzU0ID0gcmVxdWlyZSgnaWVlZTc1NCcpXG5cbmV4cG9ydHMuQnVmZmVyID0gQnVmZmVyXG5leHBvcnRzLlNsb3dCdWZmZXIgPSBCdWZmZXJcbmV4cG9ydHMuSU5TUEVDVF9NQVhfQllURVMgPSA1MFxuQnVmZmVyLnBvb2xTaXplID0gODE5MlxuXG4vKipcbiAqIElmIGBCdWZmZXIuX3VzZVR5cGVkQXJyYXlzYDpcbiAqICAgPT09IHRydWUgICAgVXNlIFVpbnQ4QXJyYXkgaW1wbGVtZW50YXRpb24gKGZhc3Rlc3QpXG4gKiAgID09PSBmYWxzZSAgIFVzZSBPYmplY3QgaW1wbGVtZW50YXRpb24gKGNvbXBhdGlibGUgZG93biB0byBJRTYpXG4gKi9cbkJ1ZmZlci5fdXNlVHlwZWRBcnJheXMgPSAoZnVuY3Rpb24gKCkge1xuICAvLyBEZXRlY3QgaWYgYnJvd3NlciBzdXBwb3J0cyBUeXBlZCBBcnJheXMuIFN1cHBvcnRlZCBicm93c2VycyBhcmUgSUUgMTArLCBGaXJlZm94IDQrLFxuICAvLyBDaHJvbWUgNyssIFNhZmFyaSA1LjErLCBPcGVyYSAxMS42KywgaU9TIDQuMisuIElmIHRoZSBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgYWRkaW5nXG4gIC8vIHByb3BlcnRpZXMgdG8gYFVpbnQ4QXJyYXlgIGluc3RhbmNlcywgdGhlbiB0aGF0J3MgdGhlIHNhbWUgYXMgbm8gYFVpbnQ4QXJyYXlgIHN1cHBvcnRcbiAgLy8gYmVjYXVzZSB3ZSBuZWVkIHRvIGJlIGFibGUgdG8gYWRkIGFsbCB0aGUgbm9kZSBCdWZmZXIgQVBJIG1ldGhvZHMuIFRoaXMgaXMgYW4gaXNzdWVcbiAgLy8gaW4gRmlyZWZveCA0LTI5LiBOb3cgZml4ZWQ6IGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTY5NTQzOFxuICB0cnkge1xuICAgIHZhciBidWYgPSBuZXcgQXJyYXlCdWZmZXIoMClcbiAgICB2YXIgYXJyID0gbmV3IFVpbnQ4QXJyYXkoYnVmKVxuICAgIGFyci5mb28gPSBmdW5jdGlvbiAoKSB7IHJldHVybiA0MiB9XG4gICAgcmV0dXJuIDQyID09PSBhcnIuZm9vKCkgJiZcbiAgICAgICAgdHlwZW9mIGFyci5zdWJhcnJheSA9PT0gJ2Z1bmN0aW9uJyAvLyBDaHJvbWUgOS0xMCBsYWNrIGBzdWJhcnJheWBcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59KSgpXG5cbi8qKlxuICogQ2xhc3M6IEJ1ZmZlclxuICogPT09PT09PT09PT09PVxuICpcbiAqIFRoZSBCdWZmZXIgY29uc3RydWN0b3IgcmV0dXJucyBpbnN0YW5jZXMgb2YgYFVpbnQ4QXJyYXlgIHRoYXQgYXJlIGF1Z21lbnRlZFxuICogd2l0aCBmdW5jdGlvbiBwcm9wZXJ0aWVzIGZvciBhbGwgdGhlIG5vZGUgYEJ1ZmZlcmAgQVBJIGZ1bmN0aW9ucy4gV2UgdXNlXG4gKiBgVWludDhBcnJheWAgc28gdGhhdCBzcXVhcmUgYnJhY2tldCBub3RhdGlvbiB3b3JrcyBhcyBleHBlY3RlZCAtLSBpdCByZXR1cm5zXG4gKiBhIHNpbmdsZSBvY3RldC5cbiAqXG4gKiBCeSBhdWdtZW50aW5nIHRoZSBpbnN0YW5jZXMsIHdlIGNhbiBhdm9pZCBtb2RpZnlpbmcgdGhlIGBVaW50OEFycmF5YFxuICogcHJvdG90eXBlLlxuICovXG5mdW5jdGlvbiBCdWZmZXIgKHN1YmplY3QsIGVuY29kaW5nLCBub1plcm8pIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEJ1ZmZlcikpXG4gICAgcmV0dXJuIG5ldyBCdWZmZXIoc3ViamVjdCwgZW5jb2RpbmcsIG5vWmVybylcblxuICB2YXIgdHlwZSA9IHR5cGVvZiBzdWJqZWN0XG5cbiAgLy8gV29ya2Fyb3VuZDogbm9kZSdzIGJhc2U2NCBpbXBsZW1lbnRhdGlvbiBhbGxvd3MgZm9yIG5vbi1wYWRkZWQgc3RyaW5nc1xuICAvLyB3aGlsZSBiYXNlNjQtanMgZG9lcyBub3QuXG4gIGlmIChlbmNvZGluZyA9PT0gJ2Jhc2U2NCcgJiYgdHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICBzdWJqZWN0ID0gc3RyaW5ndHJpbShzdWJqZWN0KVxuICAgIHdoaWxlIChzdWJqZWN0Lmxlbmd0aCAlIDQgIT09IDApIHtcbiAgICAgIHN1YmplY3QgPSBzdWJqZWN0ICsgJz0nXG4gICAgfVxuICB9XG5cbiAgLy8gRmluZCB0aGUgbGVuZ3RoXG4gIHZhciBsZW5ndGhcbiAgaWYgKHR5cGUgPT09ICdudW1iZXInKVxuICAgIGxlbmd0aCA9IGNvZXJjZShzdWJqZWN0KVxuICBlbHNlIGlmICh0eXBlID09PSAnc3RyaW5nJylcbiAgICBsZW5ndGggPSBCdWZmZXIuYnl0ZUxlbmd0aChzdWJqZWN0LCBlbmNvZGluZylcbiAgZWxzZSBpZiAodHlwZSA9PT0gJ29iamVjdCcpXG4gICAgbGVuZ3RoID0gY29lcmNlKHN1YmplY3QubGVuZ3RoKSAvLyBhc3N1bWUgdGhhdCBvYmplY3QgaXMgYXJyYXktbGlrZVxuICBlbHNlXG4gICAgdGhyb3cgbmV3IEVycm9yKCdGaXJzdCBhcmd1bWVudCBuZWVkcyB0byBiZSBhIG51bWJlciwgYXJyYXkgb3Igc3RyaW5nLicpXG5cbiAgdmFyIGJ1ZlxuICBpZiAoQnVmZmVyLl91c2VUeXBlZEFycmF5cykge1xuICAgIC8vIFByZWZlcnJlZDogUmV0dXJuIGFuIGF1Z21lbnRlZCBgVWludDhBcnJheWAgaW5zdGFuY2UgZm9yIGJlc3QgcGVyZm9ybWFuY2VcbiAgICBidWYgPSBCdWZmZXIuX2F1Z21lbnQobmV3IFVpbnQ4QXJyYXkobGVuZ3RoKSlcbiAgfSBlbHNlIHtcbiAgICAvLyBGYWxsYmFjazogUmV0dXJuIFRISVMgaW5zdGFuY2Ugb2YgQnVmZmVyIChjcmVhdGVkIGJ5IGBuZXdgKVxuICAgIGJ1ZiA9IHRoaXNcbiAgICBidWYubGVuZ3RoID0gbGVuZ3RoXG4gICAgYnVmLl9pc0J1ZmZlciA9IHRydWVcbiAgfVxuXG4gIHZhciBpXG4gIGlmIChCdWZmZXIuX3VzZVR5cGVkQXJyYXlzICYmIHR5cGVvZiBzdWJqZWN0LmJ5dGVMZW5ndGggPT09ICdudW1iZXInKSB7XG4gICAgLy8gU3BlZWQgb3B0aW1pemF0aW9uIC0tIHVzZSBzZXQgaWYgd2UncmUgY29weWluZyBmcm9tIGEgdHlwZWQgYXJyYXlcbiAgICBidWYuX3NldChzdWJqZWN0KVxuICB9IGVsc2UgaWYgKGlzQXJyYXlpc2goc3ViamVjdCkpIHtcbiAgICAvLyBUcmVhdCBhcnJheS1pc2ggb2JqZWN0cyBhcyBhIGJ5dGUgYXJyYXlcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChCdWZmZXIuaXNCdWZmZXIoc3ViamVjdCkpXG4gICAgICAgIGJ1ZltpXSA9IHN1YmplY3QucmVhZFVJbnQ4KGkpXG4gICAgICBlbHNlXG4gICAgICAgIGJ1ZltpXSA9IHN1YmplY3RbaV1cbiAgICB9XG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICBidWYud3JpdGUoc3ViamVjdCwgMCwgZW5jb2RpbmcpXG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gJ251bWJlcicgJiYgIUJ1ZmZlci5fdXNlVHlwZWRBcnJheXMgJiYgIW5vWmVybykge1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgYnVmW2ldID0gMFxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBidWZcbn1cblxuLy8gU1RBVElDIE1FVEhPRFNcbi8vID09PT09PT09PT09PT09XG5cbkJ1ZmZlci5pc0VuY29kaW5nID0gZnVuY3Rpb24gKGVuY29kaW5nKSB7XG4gIHN3aXRjaCAoU3RyaW5nKGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgY2FzZSAnYXNjaWknOlxuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICBjYXNlICdyYXcnOlxuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5CdWZmZXIuaXNCdWZmZXIgPSBmdW5jdGlvbiAoYikge1xuICByZXR1cm4gISEoYiAhPT0gbnVsbCAmJiBiICE9PSB1bmRlZmluZWQgJiYgYi5faXNCdWZmZXIpXG59XG5cbkJ1ZmZlci5ieXRlTGVuZ3RoID0gZnVuY3Rpb24gKHN0ciwgZW5jb2RpbmcpIHtcbiAgdmFyIHJldFxuICBzdHIgPSBzdHIgKyAnJ1xuICBzd2l0Y2ggKGVuY29kaW5nIHx8ICd1dGY4Jykge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgICByZXQgPSBzdHIubGVuZ3RoIC8gMlxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgICByZXQgPSB1dGY4VG9CeXRlcyhzdHIpLmxlbmd0aFxuICAgICAgYnJlYWtcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICBjYXNlICdyYXcnOlxuICAgICAgcmV0ID0gc3RyLmxlbmd0aFxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgcmV0ID0gYmFzZTY0VG9CeXRlcyhzdHIpLmxlbmd0aFxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0ID0gc3RyLmxlbmd0aCAqIDJcbiAgICAgIGJyZWFrXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBlbmNvZGluZycpXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG5CdWZmZXIuY29uY2F0ID0gZnVuY3Rpb24gKGxpc3QsIHRvdGFsTGVuZ3RoKSB7XG4gIGFzc2VydChpc0FycmF5KGxpc3QpLCAnVXNhZ2U6IEJ1ZmZlci5jb25jYXQobGlzdCwgW3RvdGFsTGVuZ3RoXSlcXG4nICtcbiAgICAgICdsaXN0IHNob3VsZCBiZSBhbiBBcnJheS4nKVxuXG4gIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBuZXcgQnVmZmVyKDApXG4gIH0gZWxzZSBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gbGlzdFswXVxuICB9XG5cbiAgdmFyIGlcbiAgaWYgKHR5cGVvZiB0b3RhbExlbmd0aCAhPT0gJ251bWJlcicpIHtcbiAgICB0b3RhbExlbmd0aCA9IDBcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgdG90YWxMZW5ndGggKz0gbGlzdFtpXS5sZW5ndGhcbiAgICB9XG4gIH1cblxuICB2YXIgYnVmID0gbmV3IEJ1ZmZlcih0b3RhbExlbmd0aClcbiAgdmFyIHBvcyA9IDBcbiAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV1cbiAgICBpdGVtLmNvcHkoYnVmLCBwb3MpXG4gICAgcG9zICs9IGl0ZW0ubGVuZ3RoXG4gIH1cbiAgcmV0dXJuIGJ1ZlxufVxuXG4vLyBCVUZGRVIgSU5TVEFOQ0UgTUVUSE9EU1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT1cblxuZnVuY3Rpb24gX2hleFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgb2Zmc2V0ID0gTnVtYmVyKG9mZnNldCkgfHwgMFxuICB2YXIgcmVtYWluaW5nID0gYnVmLmxlbmd0aCAtIG9mZnNldFxuICBpZiAoIWxlbmd0aCkge1xuICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICB9IGVsc2Uge1xuICAgIGxlbmd0aCA9IE51bWJlcihsZW5ndGgpXG4gICAgaWYgKGxlbmd0aCA+IHJlbWFpbmluZykge1xuICAgICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gICAgfVxuICB9XG5cbiAgLy8gbXVzdCBiZSBhbiBldmVuIG51bWJlciBvZiBkaWdpdHNcbiAgdmFyIHN0ckxlbiA9IHN0cmluZy5sZW5ndGhcbiAgYXNzZXJ0KHN0ckxlbiAlIDIgPT09IDAsICdJbnZhbGlkIGhleCBzdHJpbmcnKVxuXG4gIGlmIChsZW5ndGggPiBzdHJMZW4gLyAyKSB7XG4gICAgbGVuZ3RoID0gc3RyTGVuIC8gMlxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgYnl0ZSA9IHBhcnNlSW50KHN0cmluZy5zdWJzdHIoaSAqIDIsIDIpLCAxNilcbiAgICBhc3NlcnQoIWlzTmFOKGJ5dGUpLCAnSW52YWxpZCBoZXggc3RyaW5nJylcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSBieXRlXG4gIH1cbiAgQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPSBpICogMlxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiBfdXRmOFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKHV0ZjhUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuZnVuY3Rpb24gX2FzY2lpV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgY2hhcnNXcml0dGVuID0gQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPVxuICAgIGJsaXRCdWZmZXIoYXNjaWlUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuZnVuY3Rpb24gX2JpbmFyeVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIF9hc2NpaVdyaXRlKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gX2Jhc2U2NFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKGJhc2U2NFRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbiAgcmV0dXJuIGNoYXJzV3JpdHRlblxufVxuXG5mdW5jdGlvbiBfdXRmMTZsZVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKHV0ZjE2bGVUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uIChzdHJpbmcsIG9mZnNldCwgbGVuZ3RoLCBlbmNvZGluZykge1xuICAvLyBTdXBwb3J0IGJvdGggKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgsIGVuY29kaW5nKVxuICAvLyBhbmQgdGhlIGxlZ2FjeSAoc3RyaW5nLCBlbmNvZGluZywgb2Zmc2V0LCBsZW5ndGgpXG4gIGlmIChpc0Zpbml0ZShvZmZzZXQpKSB7XG4gICAgaWYgKCFpc0Zpbml0ZShsZW5ndGgpKSB7XG4gICAgICBlbmNvZGluZyA9IGxlbmd0aFxuICAgICAgbGVuZ3RoID0gdW5kZWZpbmVkXG4gICAgfVxuICB9IGVsc2UgeyAgLy8gbGVnYWN5XG4gICAgdmFyIHN3YXAgPSBlbmNvZGluZ1xuICAgIGVuY29kaW5nID0gb2Zmc2V0XG4gICAgb2Zmc2V0ID0gbGVuZ3RoXG4gICAgbGVuZ3RoID0gc3dhcFxuICB9XG5cbiAgb2Zmc2V0ID0gTnVtYmVyKG9mZnNldCkgfHwgMFxuICB2YXIgcmVtYWluaW5nID0gdGhpcy5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgfSBlbHNlIHtcbiAgICBsZW5ndGggPSBOdW1iZXIobGVuZ3RoKVxuICAgIGlmIChsZW5ndGggPiByZW1haW5pbmcpIHtcbiAgICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICAgIH1cbiAgfVxuICBlbmNvZGluZyA9IFN0cmluZyhlbmNvZGluZyB8fCAndXRmOCcpLnRvTG93ZXJDYXNlKClcblxuICB2YXIgcmV0XG4gIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgICAgcmV0ID0gX2hleFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIHJldCA9IF91dGY4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYXNjaWknOlxuICAgICAgcmV0ID0gX2FzY2lpV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgIHJldCA9IF9iaW5hcnlXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgcmV0ID0gX2Jhc2U2NFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXQgPSBfdXRmMTZsZVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2RpbmcnKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIChlbmNvZGluZywgc3RhcnQsIGVuZCkge1xuICB2YXIgc2VsZiA9IHRoaXNcblxuICBlbmNvZGluZyA9IFN0cmluZyhlbmNvZGluZyB8fCAndXRmOCcpLnRvTG93ZXJDYXNlKClcbiAgc3RhcnQgPSBOdW1iZXIoc3RhcnQpIHx8IDBcbiAgZW5kID0gKGVuZCAhPT0gdW5kZWZpbmVkKVxuICAgID8gTnVtYmVyKGVuZClcbiAgICA6IGVuZCA9IHNlbGYubGVuZ3RoXG5cbiAgLy8gRmFzdHBhdGggZW1wdHkgc3RyaW5nc1xuICBpZiAoZW5kID09PSBzdGFydClcbiAgICByZXR1cm4gJydcblxuICB2YXIgcmV0XG4gIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgICAgcmV0ID0gX2hleFNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIHJldCA9IF91dGY4U2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYXNjaWknOlxuICAgICAgcmV0ID0gX2FzY2lpU2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgIHJldCA9IF9iaW5hcnlTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgcmV0ID0gX2Jhc2U2NFNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXQgPSBfdXRmMTZsZVNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2RpbmcnKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ0J1ZmZlcicsXG4gICAgZGF0YTogQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodGhpcy5fYXJyIHx8IHRoaXMsIDApXG4gIH1cbn1cblxuLy8gY29weSh0YXJnZXRCdWZmZXIsIHRhcmdldFN0YXJ0PTAsIHNvdXJjZVN0YXJ0PTAsIHNvdXJjZUVuZD1idWZmZXIubGVuZ3RoKVxuQnVmZmVyLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24gKHRhcmdldCwgdGFyZ2V0X3N0YXJ0LCBzdGFydCwgZW5kKSB7XG4gIHZhciBzb3VyY2UgPSB0aGlzXG5cbiAgaWYgKCFzdGFydCkgc3RhcnQgPSAwXG4gIGlmICghZW5kICYmIGVuZCAhPT0gMCkgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKCF0YXJnZXRfc3RhcnQpIHRhcmdldF9zdGFydCA9IDBcblxuICAvLyBDb3B5IDAgYnl0ZXM7IHdlJ3JlIGRvbmVcbiAgaWYgKGVuZCA9PT0gc3RhcnQpIHJldHVyblxuICBpZiAodGFyZ2V0Lmxlbmd0aCA9PT0gMCB8fCBzb3VyY2UubGVuZ3RoID09PSAwKSByZXR1cm5cblxuICAvLyBGYXRhbCBlcnJvciBjb25kaXRpb25zXG4gIGFzc2VydChlbmQgPj0gc3RhcnQsICdzb3VyY2VFbmQgPCBzb3VyY2VTdGFydCcpXG4gIGFzc2VydCh0YXJnZXRfc3RhcnQgPj0gMCAmJiB0YXJnZXRfc3RhcnQgPCB0YXJnZXQubGVuZ3RoLFxuICAgICAgJ3RhcmdldFN0YXJ0IG91dCBvZiBib3VuZHMnKVxuICBhc3NlcnQoc3RhcnQgPj0gMCAmJiBzdGFydCA8IHNvdXJjZS5sZW5ndGgsICdzb3VyY2VTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgYXNzZXJ0KGVuZCA+PSAwICYmIGVuZCA8PSBzb3VyY2UubGVuZ3RoLCAnc291cmNlRW5kIG91dCBvZiBib3VuZHMnKVxuXG4gIC8vIEFyZSB3ZSBvb2I/XG4gIGlmIChlbmQgPiB0aGlzLmxlbmd0aClcbiAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAodGFyZ2V0Lmxlbmd0aCAtIHRhcmdldF9zdGFydCA8IGVuZCAtIHN0YXJ0KVxuICAgIGVuZCA9IHRhcmdldC5sZW5ndGggLSB0YXJnZXRfc3RhcnQgKyBzdGFydFxuXG4gIHZhciBsZW4gPSBlbmQgLSBzdGFydFxuXG4gIGlmIChsZW4gPCAxMDAgfHwgIUJ1ZmZlci5fdXNlVHlwZWRBcnJheXMpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgdGFyZ2V0W2kgKyB0YXJnZXRfc3RhcnRdID0gdGhpc1tpICsgc3RhcnRdXG4gIH0gZWxzZSB7XG4gICAgdGFyZ2V0Ll9zZXQodGhpcy5zdWJhcnJheShzdGFydCwgc3RhcnQgKyBsZW4pLCB0YXJnZXRfc3RhcnQpXG4gIH1cbn1cblxuZnVuY3Rpb24gX2Jhc2U2NFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKHN0YXJ0ID09PSAwICYmIGVuZCA9PT0gYnVmLmxlbmd0aCkge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1Zi5zbGljZShzdGFydCwgZW5kKSlcbiAgfVxufVxuXG5mdW5jdGlvbiBfdXRmOFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJlcyA9ICcnXG4gIHZhciB0bXAgPSAnJ1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICBpZiAoYnVmW2ldIDw9IDB4N0YpIHtcbiAgICAgIHJlcyArPSBkZWNvZGVVdGY4Q2hhcih0bXApICsgU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0pXG4gICAgICB0bXAgPSAnJ1xuICAgIH0gZWxzZSB7XG4gICAgICB0bXAgKz0gJyUnICsgYnVmW2ldLnRvU3RyaW5nKDE2KVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXMgKyBkZWNvZGVVdGY4Q2hhcih0bXApXG59XG5cbmZ1bmN0aW9uIF9hc2NpaVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJldCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKylcbiAgICByZXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0pXG4gIHJldHVybiByZXRcbn1cblxuZnVuY3Rpb24gX2JpbmFyeVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgcmV0dXJuIF9hc2NpaVNsaWNlKGJ1Ziwgc3RhcnQsIGVuZClcbn1cblxuZnVuY3Rpb24gX2hleFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcblxuICBpZiAoIXN0YXJ0IHx8IHN0YXJ0IDwgMCkgc3RhcnQgPSAwXG4gIGlmICghZW5kIHx8IGVuZCA8IDAgfHwgZW5kID4gbGVuKSBlbmQgPSBsZW5cblxuICB2YXIgb3V0ID0gJydcbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICBvdXQgKz0gdG9IZXgoYnVmW2ldKVxuICB9XG4gIHJldHVybiBvdXRcbn1cblxuZnVuY3Rpb24gX3V0ZjE2bGVTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciBieXRlcyA9IGJ1Zi5zbGljZShzdGFydCwgZW5kKVxuICB2YXIgcmVzID0gJydcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkgKz0gMikge1xuICAgIHJlcyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ5dGVzW2ldICsgYnl0ZXNbaSsxXSAqIDI1NilcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc2xpY2UgPSBmdW5jdGlvbiAoc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgc3RhcnQgPSBjbGFtcChzdGFydCwgbGVuLCAwKVxuICBlbmQgPSBjbGFtcChlbmQsIGxlbiwgbGVuKVxuXG4gIGlmIChCdWZmZXIuX3VzZVR5cGVkQXJyYXlzKSB7XG4gICAgcmV0dXJuIEJ1ZmZlci5fYXVnbWVudCh0aGlzLnN1YmFycmF5KHN0YXJ0LCBlbmQpKVxuICB9IGVsc2Uge1xuICAgIHZhciBzbGljZUxlbiA9IGVuZCAtIHN0YXJ0XG4gICAgdmFyIG5ld0J1ZiA9IG5ldyBCdWZmZXIoc2xpY2VMZW4sIHVuZGVmaW5lZCwgdHJ1ZSlcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNsaWNlTGVuOyBpKyspIHtcbiAgICAgIG5ld0J1ZltpXSA9IHRoaXNbaSArIHN0YXJ0XVxuICAgIH1cbiAgICByZXR1cm4gbmV3QnVmXG4gIH1cbn1cblxuLy8gYGdldGAgd2lsbCBiZSByZW1vdmVkIGluIE5vZGUgMC4xMytcbkJ1ZmZlci5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKG9mZnNldCkge1xuICBjb25zb2xlLmxvZygnLmdldCgpIGlzIGRlcHJlY2F0ZWQuIEFjY2VzcyB1c2luZyBhcnJheSBpbmRleGVzIGluc3RlYWQuJylcbiAgcmV0dXJuIHRoaXMucmVhZFVJbnQ4KG9mZnNldClcbn1cblxuLy8gYHNldGAgd2lsbCBiZSByZW1vdmVkIGluIE5vZGUgMC4xMytcbkJ1ZmZlci5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKHYsIG9mZnNldCkge1xuICBjb25zb2xlLmxvZygnLnNldCgpIGlzIGRlcHJlY2F0ZWQuIEFjY2VzcyB1c2luZyBhcnJheSBpbmRleGVzIGluc3RlYWQuJylcbiAgcmV0dXJuIHRoaXMud3JpdGVVSW50OCh2LCBvZmZzZXQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQ4ID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IHRoaXMubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aClcbiAgICByZXR1cm5cblxuICByZXR1cm4gdGhpc1tvZmZzZXRdXG59XG5cbmZ1bmN0aW9uIF9yZWFkVUludDE2IChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDEgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgdmFyIHZhbFxuICBpZiAobGl0dGxlRW5kaWFuKSB7XG4gICAgdmFsID0gYnVmW29mZnNldF1cbiAgICBpZiAob2Zmc2V0ICsgMSA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgMV0gPDwgOFxuICB9IGVsc2Uge1xuICAgIHZhbCA9IGJ1ZltvZmZzZXRdIDw8IDhcbiAgICBpZiAob2Zmc2V0ICsgMSA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgMV1cbiAgfVxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDE2KHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDE2KHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfcmVhZFVJbnQzMiAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIHZhciB2YWxcbiAgaWYgKGxpdHRsZUVuZGlhbikge1xuICAgIGlmIChvZmZzZXQgKyAyIDwgbGVuKVxuICAgICAgdmFsID0gYnVmW29mZnNldCArIDJdIDw8IDE2XG4gICAgaWYgKG9mZnNldCArIDEgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDFdIDw8IDhcbiAgICB2YWwgfD0gYnVmW29mZnNldF1cbiAgICBpZiAob2Zmc2V0ICsgMyA8IGxlbilcbiAgICAgIHZhbCA9IHZhbCArIChidWZbb2Zmc2V0ICsgM10gPDwgMjQgPj4+IDApXG4gIH0gZWxzZSB7XG4gICAgaWYgKG9mZnNldCArIDEgPCBsZW4pXG4gICAgICB2YWwgPSBidWZbb2Zmc2V0ICsgMV0gPDwgMTZcbiAgICBpZiAob2Zmc2V0ICsgMiA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgMl0gPDwgOFxuICAgIGlmIChvZmZzZXQgKyAzIDwgbGVuKVxuICAgICAgdmFsIHw9IGJ1ZltvZmZzZXQgKyAzXVxuICAgIHZhbCA9IHZhbCArIChidWZbb2Zmc2V0XSA8PCAyNCA+Pj4gMClcbiAgfVxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDMyKHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDMyKHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQ4ID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsXG4gICAgICAgICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IHRoaXMubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aClcbiAgICByZXR1cm5cblxuICB2YXIgbmVnID0gdGhpc1tvZmZzZXRdICYgMHg4MFxuICBpZiAobmVnKVxuICAgIHJldHVybiAoMHhmZiAtIHRoaXNbb2Zmc2V0XSArIDEpICogLTFcbiAgZWxzZVxuICAgIHJldHVybiB0aGlzW29mZnNldF1cbn1cblxuZnVuY3Rpb24gX3JlYWRJbnQxNiAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAxIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIHZhciB2YWwgPSBfcmVhZFVJbnQxNihidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCB0cnVlKVxuICB2YXIgbmVnID0gdmFsICYgMHg4MDAwXG4gIGlmIChuZWcpXG4gICAgcmV0dXJuICgweGZmZmYgLSB2YWwgKyAxKSAqIC0xXG4gIGVsc2VcbiAgICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2TEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRJbnQxNih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MTYodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF9yZWFkSW50MzIgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICB2YXIgdmFsID0gX3JlYWRVSW50MzIoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgdHJ1ZSlcbiAgdmFyIG5lZyA9IHZhbCAmIDB4ODAwMDAwMDBcbiAgaWYgKG5lZylcbiAgICByZXR1cm4gKDB4ZmZmZmZmZmYgLSB2YWwgKyAxKSAqIC0xXG4gIGVsc2VcbiAgICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyTEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRJbnQzMih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MzIodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF9yZWFkRmxvYXQgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgcmV0dXJuIGllZWU3NTQucmVhZChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCAyMywgNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEZsb2F0KHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0QkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRGbG9hdCh0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3JlYWREb3VibGUgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCArIDcgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgcmV0dXJuIGllZWU3NTQucmVhZChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCA1MiwgOClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlTEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWREb3VibGUodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlQkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWREb3VibGUodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50OCA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgPCB0aGlzLmxlbmd0aCwgJ3RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZ1aW50KHZhbHVlLCAweGZmKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aCkgcmV0dXJuXG5cbiAgdGhpc1tvZmZzZXRdID0gdmFsdWVcbn1cblxuZnVuY3Rpb24gX3dyaXRlVUludDE2IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDEgPCBidWYubGVuZ3RoLCAndHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnVpbnQodmFsdWUsIDB4ZmZmZilcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGZvciAodmFyIGkgPSAwLCBqID0gTWF0aC5taW4obGVuIC0gb2Zmc2V0LCAyKTsgaSA8IGo7IGkrKykge1xuICAgIGJ1ZltvZmZzZXQgKyBpXSA9XG4gICAgICAgICh2YWx1ZSAmICgweGZmIDw8ICg4ICogKGxpdHRsZUVuZGlhbiA/IGkgOiAxIC0gaSkpKSkgPj4+XG4gICAgICAgICAgICAobGl0dGxlRW5kaWFuID8gaSA6IDEgLSBpKSAqIDhcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2TEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2QkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlVUludDMyIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAndHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnVpbnQodmFsdWUsIDB4ZmZmZmZmZmYpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBmb3IgKHZhciBpID0gMCwgaiA9IE1hdGgubWluKGxlbiAtIG9mZnNldCwgNCk7IGkgPCBqOyBpKyspIHtcbiAgICBidWZbb2Zmc2V0ICsgaV0gPVxuICAgICAgICAodmFsdWUgPj4+IChsaXR0bGVFbmRpYW4gPyBpIDogMyAtIGkpICogOCkgJiAweGZmXG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQ4ID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IHRoaXMubGVuZ3RoLCAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnNpbnQodmFsdWUsIDB4N2YsIC0weDgwKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aClcbiAgICByZXR1cm5cblxuICBpZiAodmFsdWUgPj0gMClcbiAgICB0aGlzLndyaXRlVUludDgodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpXG4gIGVsc2VcbiAgICB0aGlzLndyaXRlVUludDgoMHhmZiArIHZhbHVlICsgMSwgb2Zmc2V0LCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlSW50MTYgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMSA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmc2ludCh2YWx1ZSwgMHg3ZmZmLCAtMHg4MDAwKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgaWYgKHZhbHVlID49IDApXG4gICAgX3dyaXRlVUludDE2KGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydClcbiAgZWxzZVxuICAgIF93cml0ZVVJbnQxNihidWYsIDB4ZmZmZiArIHZhbHVlICsgMSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2QkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVJbnQzMiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZzaW50KHZhbHVlLCAweDdmZmZmZmZmLCAtMHg4MDAwMDAwMClcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGlmICh2YWx1ZSA+PSAwKVxuICAgIF93cml0ZVVJbnQzMihidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpXG4gIGVsc2VcbiAgICBfd3JpdGVVSW50MzIoYnVmLCAweGZmZmZmZmZmICsgdmFsdWUgKyAxLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZUZsb2F0IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZklFRUU3NTQodmFsdWUsIDMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgsIC0zLjQwMjgyMzQ2NjM4NTI4ODZlKzM4KVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdExFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZURvdWJsZSAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyA3IDwgYnVmLmxlbmd0aCxcbiAgICAgICAgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZJRUVFNzU0KHZhbHVlLCAxLjc5NzY5MzEzNDg2MjMxNTdFKzMwOCwgLTEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4KVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgNTIsIDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG4vLyBmaWxsKHZhbHVlLCBzdGFydD0wLCBlbmQ9YnVmZmVyLmxlbmd0aClcbkJ1ZmZlci5wcm90b3R5cGUuZmlsbCA9IGZ1bmN0aW9uICh2YWx1ZSwgc3RhcnQsIGVuZCkge1xuICBpZiAoIXZhbHVlKSB2YWx1ZSA9IDBcbiAgaWYgKCFzdGFydCkgc3RhcnQgPSAwXG4gIGlmICghZW5kKSBlbmQgPSB0aGlzLmxlbmd0aFxuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgdmFsdWUgPSB2YWx1ZS5jaGFyQ29kZUF0KDApXG4gIH1cblxuICBhc3NlcnQodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiAhaXNOYU4odmFsdWUpLCAndmFsdWUgaXMgbm90IGEgbnVtYmVyJylcbiAgYXNzZXJ0KGVuZCA+PSBzdGFydCwgJ2VuZCA8IHN0YXJ0JylcblxuICAvLyBGaWxsIDAgYnl0ZXM7IHdlJ3JlIGRvbmVcbiAgaWYgKGVuZCA9PT0gc3RhcnQpIHJldHVyblxuICBpZiAodGhpcy5sZW5ndGggPT09IDApIHJldHVyblxuXG4gIGFzc2VydChzdGFydCA+PSAwICYmIHN0YXJ0IDwgdGhpcy5sZW5ndGgsICdzdGFydCBvdXQgb2YgYm91bmRzJylcbiAgYXNzZXJ0KGVuZCA+PSAwICYmIGVuZCA8PSB0aGlzLmxlbmd0aCwgJ2VuZCBvdXQgb2YgYm91bmRzJylcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgIHRoaXNbaV0gPSB2YWx1ZVxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5zcGVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIG91dCA9IFtdXG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgb3V0W2ldID0gdG9IZXgodGhpc1tpXSlcbiAgICBpZiAoaSA9PT0gZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFUykge1xuICAgICAgb3V0W2kgKyAxXSA9ICcuLi4nXG4gICAgICBicmVha1xuICAgIH1cbiAgfVxuICByZXR1cm4gJzxCdWZmZXIgJyArIG91dC5qb2luKCcgJykgKyAnPidcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IGBBcnJheUJ1ZmZlcmAgd2l0aCB0aGUgKmNvcGllZCogbWVtb3J5IG9mIHRoZSBidWZmZXIgaW5zdGFuY2UuXG4gKiBBZGRlZCBpbiBOb2RlIDAuMTIuIE9ubHkgYXZhaWxhYmxlIGluIGJyb3dzZXJzIHRoYXQgc3VwcG9ydCBBcnJheUJ1ZmZlci5cbiAqL1xuQnVmZmVyLnByb3RvdHlwZS50b0FycmF5QnVmZmVyID0gZnVuY3Rpb24gKCkge1xuICBpZiAodHlwZW9mIFVpbnQ4QXJyYXkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgaWYgKEJ1ZmZlci5fdXNlVHlwZWRBcnJheXMpIHtcbiAgICAgIHJldHVybiAobmV3IEJ1ZmZlcih0aGlzKSkuYnVmZmVyXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBidWYgPSBuZXcgVWludDhBcnJheSh0aGlzLmxlbmd0aClcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBidWYubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEpXG4gICAgICAgIGJ1ZltpXSA9IHRoaXNbaV1cbiAgICAgIHJldHVybiBidWYuYnVmZmVyXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcignQnVmZmVyLnRvQXJyYXlCdWZmZXIgbm90IHN1cHBvcnRlZCBpbiB0aGlzIGJyb3dzZXInKVxuICB9XG59XG5cbi8vIEhFTFBFUiBGVU5DVElPTlNcbi8vID09PT09PT09PT09PT09PT1cblxuZnVuY3Rpb24gc3RyaW5ndHJpbSAoc3RyKSB7XG4gIGlmIChzdHIudHJpbSkgcmV0dXJuIHN0ci50cmltKClcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJylcbn1cblxudmFyIEJQID0gQnVmZmVyLnByb3RvdHlwZVxuXG4vKipcbiAqIEF1Z21lbnQgYSBVaW50OEFycmF5ICppbnN0YW5jZSogKG5vdCB0aGUgVWludDhBcnJheSBjbGFzcyEpIHdpdGggQnVmZmVyIG1ldGhvZHNcbiAqL1xuQnVmZmVyLl9hdWdtZW50ID0gZnVuY3Rpb24gKGFycikge1xuICBhcnIuX2lzQnVmZmVyID0gdHJ1ZVxuXG4gIC8vIHNhdmUgcmVmZXJlbmNlIHRvIG9yaWdpbmFsIFVpbnQ4QXJyYXkgZ2V0L3NldCBtZXRob2RzIGJlZm9yZSBvdmVyd3JpdGluZ1xuICBhcnIuX2dldCA9IGFyci5nZXRcbiAgYXJyLl9zZXQgPSBhcnIuc2V0XG5cbiAgLy8gZGVwcmVjYXRlZCwgd2lsbCBiZSByZW1vdmVkIGluIG5vZGUgMC4xMytcbiAgYXJyLmdldCA9IEJQLmdldFxuICBhcnIuc2V0ID0gQlAuc2V0XG5cbiAgYXJyLndyaXRlID0gQlAud3JpdGVcbiAgYXJyLnRvU3RyaW5nID0gQlAudG9TdHJpbmdcbiAgYXJyLnRvTG9jYWxlU3RyaW5nID0gQlAudG9TdHJpbmdcbiAgYXJyLnRvSlNPTiA9IEJQLnRvSlNPTlxuICBhcnIuY29weSA9IEJQLmNvcHlcbiAgYXJyLnNsaWNlID0gQlAuc2xpY2VcbiAgYXJyLnJlYWRVSW50OCA9IEJQLnJlYWRVSW50OFxuICBhcnIucmVhZFVJbnQxNkxFID0gQlAucmVhZFVJbnQxNkxFXG4gIGFyci5yZWFkVUludDE2QkUgPSBCUC5yZWFkVUludDE2QkVcbiAgYXJyLnJlYWRVSW50MzJMRSA9IEJQLnJlYWRVSW50MzJMRVxuICBhcnIucmVhZFVJbnQzMkJFID0gQlAucmVhZFVJbnQzMkJFXG4gIGFyci5yZWFkSW50OCA9IEJQLnJlYWRJbnQ4XG4gIGFyci5yZWFkSW50MTZMRSA9IEJQLnJlYWRJbnQxNkxFXG4gIGFyci5yZWFkSW50MTZCRSA9IEJQLnJlYWRJbnQxNkJFXG4gIGFyci5yZWFkSW50MzJMRSA9IEJQLnJlYWRJbnQzMkxFXG4gIGFyci5yZWFkSW50MzJCRSA9IEJQLnJlYWRJbnQzMkJFXG4gIGFyci5yZWFkRmxvYXRMRSA9IEJQLnJlYWRGbG9hdExFXG4gIGFyci5yZWFkRmxvYXRCRSA9IEJQLnJlYWRGbG9hdEJFXG4gIGFyci5yZWFkRG91YmxlTEUgPSBCUC5yZWFkRG91YmxlTEVcbiAgYXJyLnJlYWREb3VibGVCRSA9IEJQLnJlYWREb3VibGVCRVxuICBhcnIud3JpdGVVSW50OCA9IEJQLndyaXRlVUludDhcbiAgYXJyLndyaXRlVUludDE2TEUgPSBCUC53cml0ZVVJbnQxNkxFXG4gIGFyci53cml0ZVVJbnQxNkJFID0gQlAud3JpdGVVSW50MTZCRVxuICBhcnIud3JpdGVVSW50MzJMRSA9IEJQLndyaXRlVUludDMyTEVcbiAgYXJyLndyaXRlVUludDMyQkUgPSBCUC53cml0ZVVJbnQzMkJFXG4gIGFyci53cml0ZUludDggPSBCUC53cml0ZUludDhcbiAgYXJyLndyaXRlSW50MTZMRSA9IEJQLndyaXRlSW50MTZMRVxuICBhcnIud3JpdGVJbnQxNkJFID0gQlAud3JpdGVJbnQxNkJFXG4gIGFyci53cml0ZUludDMyTEUgPSBCUC53cml0ZUludDMyTEVcbiAgYXJyLndyaXRlSW50MzJCRSA9IEJQLndyaXRlSW50MzJCRVxuICBhcnIud3JpdGVGbG9hdExFID0gQlAud3JpdGVGbG9hdExFXG4gIGFyci53cml0ZUZsb2F0QkUgPSBCUC53cml0ZUZsb2F0QkVcbiAgYXJyLndyaXRlRG91YmxlTEUgPSBCUC53cml0ZURvdWJsZUxFXG4gIGFyci53cml0ZURvdWJsZUJFID0gQlAud3JpdGVEb3VibGVCRVxuICBhcnIuZmlsbCA9IEJQLmZpbGxcbiAgYXJyLmluc3BlY3QgPSBCUC5pbnNwZWN0XG4gIGFyci50b0FycmF5QnVmZmVyID0gQlAudG9BcnJheUJ1ZmZlclxuXG4gIHJldHVybiBhcnJcbn1cblxuLy8gc2xpY2Uoc3RhcnQsIGVuZClcbmZ1bmN0aW9uIGNsYW1wIChpbmRleCwgbGVuLCBkZWZhdWx0VmFsdWUpIHtcbiAgaWYgKHR5cGVvZiBpbmRleCAhPT0gJ251bWJlcicpIHJldHVybiBkZWZhdWx0VmFsdWVcbiAgaW5kZXggPSB+fmluZGV4OyAgLy8gQ29lcmNlIHRvIGludGVnZXIuXG4gIGlmIChpbmRleCA+PSBsZW4pIHJldHVybiBsZW5cbiAgaWYgKGluZGV4ID49IDApIHJldHVybiBpbmRleFxuICBpbmRleCArPSBsZW5cbiAgaWYgKGluZGV4ID49IDApIHJldHVybiBpbmRleFxuICByZXR1cm4gMFxufVxuXG5mdW5jdGlvbiBjb2VyY2UgKGxlbmd0aCkge1xuICAvLyBDb2VyY2UgbGVuZ3RoIHRvIGEgbnVtYmVyIChwb3NzaWJseSBOYU4pLCByb3VuZCB1cFxuICAvLyBpbiBjYXNlIGl0J3MgZnJhY3Rpb25hbCAoZS5nLiAxMjMuNDU2KSB0aGVuIGRvIGFcbiAgLy8gZG91YmxlIG5lZ2F0ZSB0byBjb2VyY2UgYSBOYU4gdG8gMC4gRWFzeSwgcmlnaHQ/XG4gIGxlbmd0aCA9IH5+TWF0aC5jZWlsKCtsZW5ndGgpXG4gIHJldHVybiBsZW5ndGggPCAwID8gMCA6IGxlbmd0aFxufVxuXG5mdW5jdGlvbiBpc0FycmF5IChzdWJqZWN0KSB7XG4gIHJldHVybiAoQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAoc3ViamVjdCkge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoc3ViamVjdCkgPT09ICdbb2JqZWN0IEFycmF5XSdcbiAgfSkoc3ViamVjdClcbn1cblxuZnVuY3Rpb24gaXNBcnJheWlzaCAoc3ViamVjdCkge1xuICByZXR1cm4gaXNBcnJheShzdWJqZWN0KSB8fCBCdWZmZXIuaXNCdWZmZXIoc3ViamVjdCkgfHxcbiAgICAgIHN1YmplY3QgJiYgdHlwZW9mIHN1YmplY3QgPT09ICdvYmplY3QnICYmXG4gICAgICB0eXBlb2Ygc3ViamVjdC5sZW5ndGggPT09ICdudW1iZXInXG59XG5cbmZ1bmN0aW9uIHRvSGV4IChuKSB7XG4gIGlmIChuIDwgMTYpIHJldHVybiAnMCcgKyBuLnRvU3RyaW5nKDE2KVxuICByZXR1cm4gbi50b1N0cmluZygxNilcbn1cblxuZnVuY3Rpb24gdXRmOFRvQnl0ZXMgKHN0cikge1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgYiA9IHN0ci5jaGFyQ29kZUF0KGkpXG4gICAgaWYgKGIgPD0gMHg3RilcbiAgICAgIGJ5dGVBcnJheS5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpKVxuICAgIGVsc2Uge1xuICAgICAgdmFyIHN0YXJ0ID0gaVxuICAgICAgaWYgKGIgPj0gMHhEODAwICYmIGIgPD0gMHhERkZGKSBpKytcbiAgICAgIHZhciBoID0gZW5jb2RlVVJJQ29tcG9uZW50KHN0ci5zbGljZShzdGFydCwgaSsxKSkuc3Vic3RyKDEpLnNwbGl0KCclJylcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgaC5sZW5ndGg7IGorKylcbiAgICAgICAgYnl0ZUFycmF5LnB1c2gocGFyc2VJbnQoaFtqXSwgMTYpKVxuICAgIH1cbiAgfVxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIGFzY2lpVG9CeXRlcyAoc3RyKSB7XG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgIC8vIE5vZGUncyBjb2RlIHNlZW1zIHRvIGJlIGRvaW5nIHRoaXMgYW5kIG5vdCAmIDB4N0YuLlxuICAgIGJ5dGVBcnJheS5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpICYgMHhGRilcbiAgfVxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIHV0ZjE2bGVUb0J5dGVzIChzdHIpIHtcbiAgdmFyIGMsIGhpLCBsb1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICBjID0gc3RyLmNoYXJDb2RlQXQoaSlcbiAgICBoaSA9IGMgPj4gOFxuICAgIGxvID0gYyAlIDI1NlxuICAgIGJ5dGVBcnJheS5wdXNoKGxvKVxuICAgIGJ5dGVBcnJheS5wdXNoKGhpKVxuICB9XG5cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiBiYXNlNjRUb0J5dGVzIChzdHIpIHtcbiAgcmV0dXJuIGJhc2U2NC50b0J5dGVBcnJheShzdHIpXG59XG5cbmZ1bmN0aW9uIGJsaXRCdWZmZXIgKHNyYywgZHN0LCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgcG9zXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoKGkgKyBvZmZzZXQgPj0gZHN0Lmxlbmd0aCkgfHwgKGkgPj0gc3JjLmxlbmd0aCkpXG4gICAgICBicmVha1xuICAgIGRzdFtpICsgb2Zmc2V0XSA9IHNyY1tpXVxuICB9XG4gIHJldHVybiBpXG59XG5cbmZ1bmN0aW9uIGRlY29kZVV0ZjhDaGFyIChzdHIpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHN0cilcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoMHhGRkZEKSAvLyBVVEYgOCBpbnZhbGlkIGNoYXJcbiAgfVxufVxuXG4vKlxuICogV2UgaGF2ZSB0byBtYWtlIHN1cmUgdGhhdCB0aGUgdmFsdWUgaXMgYSB2YWxpZCBpbnRlZ2VyLiBUaGlzIG1lYW5zIHRoYXQgaXRcbiAqIGlzIG5vbi1uZWdhdGl2ZS4gSXQgaGFzIG5vIGZyYWN0aW9uYWwgY29tcG9uZW50IGFuZCB0aGF0IGl0IGRvZXMgbm90XG4gKiBleGNlZWQgdGhlIG1heGltdW0gYWxsb3dlZCB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gdmVyaWZ1aW50ICh2YWx1ZSwgbWF4KSB7XG4gIGFzc2VydCh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInLCAnY2Fubm90IHdyaXRlIGEgbm9uLW51bWJlciBhcyBhIG51bWJlcicpXG4gIGFzc2VydCh2YWx1ZSA+PSAwLCAnc3BlY2lmaWVkIGEgbmVnYXRpdmUgdmFsdWUgZm9yIHdyaXRpbmcgYW4gdW5zaWduZWQgdmFsdWUnKVxuICBhc3NlcnQodmFsdWUgPD0gbWF4LCAndmFsdWUgaXMgbGFyZ2VyIHRoYW4gbWF4aW11bSB2YWx1ZSBmb3IgdHlwZScpXG4gIGFzc2VydChNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWUsICd2YWx1ZSBoYXMgYSBmcmFjdGlvbmFsIGNvbXBvbmVudCcpXG59XG5cbmZ1bmN0aW9uIHZlcmlmc2ludCAodmFsdWUsIG1heCwgbWluKSB7XG4gIGFzc2VydCh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInLCAnY2Fubm90IHdyaXRlIGEgbm9uLW51bWJlciBhcyBhIG51bWJlcicpXG4gIGFzc2VydCh2YWx1ZSA8PSBtYXgsICd2YWx1ZSBsYXJnZXIgdGhhbiBtYXhpbXVtIGFsbG93ZWQgdmFsdWUnKVxuICBhc3NlcnQodmFsdWUgPj0gbWluLCAndmFsdWUgc21hbGxlciB0aGFuIG1pbmltdW0gYWxsb3dlZCB2YWx1ZScpXG4gIGFzc2VydChNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWUsICd2YWx1ZSBoYXMgYSBmcmFjdGlvbmFsIGNvbXBvbmVudCcpXG59XG5cbmZ1bmN0aW9uIHZlcmlmSUVFRTc1NCAodmFsdWUsIG1heCwgbWluKSB7XG4gIGFzc2VydCh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInLCAnY2Fubm90IHdyaXRlIGEgbm9uLW51bWJlciBhcyBhIG51bWJlcicpXG4gIGFzc2VydCh2YWx1ZSA8PSBtYXgsICd2YWx1ZSBsYXJnZXIgdGhhbiBtYXhpbXVtIGFsbG93ZWQgdmFsdWUnKVxuICBhc3NlcnQodmFsdWUgPj0gbWluLCAndmFsdWUgc21hbGxlciB0aGFuIG1pbmltdW0gYWxsb3dlZCB2YWx1ZScpXG59XG5cbmZ1bmN0aW9uIGFzc2VydCAodGVzdCwgbWVzc2FnZSkge1xuICBpZiAoIXRlc3QpIHRocm93IG5ldyBFcnJvcihtZXNzYWdlIHx8ICdGYWlsZWQgYXNzZXJ0aW9uJylcbn1cblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJmc292ejZcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnVmZmVyL2luZGV4LmpzXCIsXCIvLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2J1ZmZlclwiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbnByb2Nlc3MubmV4dFRpY2sgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBjYW5TZXRJbW1lZGlhdGUgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5zZXRJbW1lZGlhdGU7XG4gICAgdmFyIGNhblBvc3QgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5wb3N0TWVzc2FnZSAmJiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lclxuICAgIDtcblxuICAgIGlmIChjYW5TZXRJbW1lZGlhdGUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7IHJldHVybiB3aW5kb3cuc2V0SW1tZWRpYXRlKGYpIH07XG4gICAgfVxuXG4gICAgaWYgKGNhblBvc3QpIHtcbiAgICAgICAgdmFyIHF1ZXVlID0gW107XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICB2YXIgc291cmNlID0gZXYuc291cmNlO1xuICAgICAgICAgICAgaWYgKChzb3VyY2UgPT09IHdpbmRvdyB8fCBzb3VyY2UgPT09IG51bGwpICYmIGV2LmRhdGEgPT09ICdwcm9jZXNzLXRpY2snKSB7XG4gICAgICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgaWYgKHF1ZXVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZuID0gcXVldWUuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICAgICAgZm4oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRydWUpO1xuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICAgICAgcXVldWUucHVzaChmbik7XG4gICAgICAgICAgICB3aW5kb3cucG9zdE1lc3NhZ2UoJ3Byb2Nlc3MtdGljaycsICcqJyk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZm4sIDApO1xuICAgIH07XG59KSgpO1xuXG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn1cblxuLy8gVE9ETyhzaHR5bG1hbilcbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcImZzb3Z6NlwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanNcIixcIi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzc1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbmV4cG9ydHMucmVhZCA9IGZ1bmN0aW9uIChidWZmZXIsIG9mZnNldCwgaXNMRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtXG4gIHZhciBlTGVuID0gbkJ5dGVzICogOCAtIG1MZW4gLSAxXG4gIHZhciBlTWF4ID0gKDEgPDwgZUxlbikgLSAxXG4gIHZhciBlQmlhcyA9IGVNYXggPj4gMVxuICB2YXIgbkJpdHMgPSAtN1xuICB2YXIgaSA9IGlzTEUgPyAobkJ5dGVzIC0gMSkgOiAwXG4gIHZhciBkID0gaXNMRSA/IC0xIDogMVxuICB2YXIgcyA9IGJ1ZmZlcltvZmZzZXQgKyBpXVxuXG4gIGkgKz0gZFxuXG4gIGUgPSBzICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpXG4gIHMgPj49ICgtbkJpdHMpXG4gIG5CaXRzICs9IGVMZW5cbiAgZm9yICg7IG5CaXRzID4gMDsgZSA9IGUgKiAyNTYgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCkge31cblxuICBtID0gZSAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBlID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBtTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IG0gPSBtICogMjU2ICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpIHt9XG5cbiAgaWYgKGUgPT09IDApIHtcbiAgICBlID0gMSAtIGVCaWFzXG4gIH0gZWxzZSBpZiAoZSA9PT0gZU1heCkge1xuICAgIHJldHVybiBtID8gTmFOIDogKChzID8gLTEgOiAxKSAqIEluZmluaXR5KVxuICB9IGVsc2Uge1xuICAgIG0gPSBtICsgTWF0aC5wb3coMiwgbUxlbilcbiAgICBlID0gZSAtIGVCaWFzXG4gIH1cbiAgcmV0dXJuIChzID8gLTEgOiAxKSAqIG0gKiBNYXRoLnBvdygyLCBlIC0gbUxlbilcbn1cblxuZXhwb3J0cy53cml0ZSA9IGZ1bmN0aW9uIChidWZmZXIsIHZhbHVlLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbSwgY1xuICB2YXIgZUxlbiA9IG5CeXRlcyAqIDggLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIHJ0ID0gKG1MZW4gPT09IDIzID8gTWF0aC5wb3coMiwgLTI0KSAtIE1hdGgucG93KDIsIC03NykgOiAwKVxuICB2YXIgaSA9IGlzTEUgPyAwIDogKG5CeXRlcyAtIDEpXG4gIHZhciBkID0gaXNMRSA/IDEgOiAtMVxuICB2YXIgcyA9IHZhbHVlIDwgMCB8fCAodmFsdWUgPT09IDAgJiYgMSAvIHZhbHVlIDwgMCkgPyAxIDogMFxuXG4gIHZhbHVlID0gTWF0aC5hYnModmFsdWUpXG5cbiAgaWYgKGlzTmFOKHZhbHVlKSB8fCB2YWx1ZSA9PT0gSW5maW5pdHkpIHtcbiAgICBtID0gaXNOYU4odmFsdWUpID8gMSA6IDBcbiAgICBlID0gZU1heFxuICB9IGVsc2Uge1xuICAgIGUgPSBNYXRoLmZsb29yKE1hdGgubG9nKHZhbHVlKSAvIE1hdGguTE4yKVxuICAgIGlmICh2YWx1ZSAqIChjID0gTWF0aC5wb3coMiwgLWUpKSA8IDEpIHtcbiAgICAgIGUtLVxuICAgICAgYyAqPSAyXG4gICAgfVxuICAgIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgdmFsdWUgKz0gcnQgLyBjXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlICs9IHJ0ICogTWF0aC5wb3coMiwgMSAtIGVCaWFzKVxuICAgIH1cbiAgICBpZiAodmFsdWUgKiBjID49IDIpIHtcbiAgICAgIGUrK1xuICAgICAgYyAvPSAyXG4gICAgfVxuXG4gICAgaWYgKGUgKyBlQmlhcyA+PSBlTWF4KSB7XG4gICAgICBtID0gMFxuICAgICAgZSA9IGVNYXhcbiAgICB9IGVsc2UgaWYgKGUgKyBlQmlhcyA+PSAxKSB7XG4gICAgICBtID0gKHZhbHVlICogYyAtIDEpICogTWF0aC5wb3coMiwgbUxlbilcbiAgICAgIGUgPSBlICsgZUJpYXNcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IHZhbHVlICogTWF0aC5wb3coMiwgZUJpYXMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pXG4gICAgICBlID0gMFxuICAgIH1cbiAgfVxuXG4gIGZvciAoOyBtTGVuID49IDg7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IG0gJiAweGZmLCBpICs9IGQsIG0gLz0gMjU2LCBtTGVuIC09IDgpIHt9XG5cbiAgZSA9IChlIDw8IG1MZW4pIHwgbVxuICBlTGVuICs9IG1MZW5cbiAgZm9yICg7IGVMZW4gPiAwOyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBlICYgMHhmZiwgaSArPSBkLCBlIC89IDI1NiwgZUxlbiAtPSA4KSB7fVxuXG4gIGJ1ZmZlcltvZmZzZXQgKyBpIC0gZF0gfD0gcyAqIDEyOFxufVxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcImZzb3Z6NlwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9pZWVlNzU0L2luZGV4LmpzXCIsXCIvLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2llZWU3NTRcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4ndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIF90b0NvbnN1bWFibGVBcnJheShhcnIpIHsgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgeyBmb3IgKHZhciBpID0gMCwgYXJyMiA9IEFycmF5KGFyci5sZW5ndGgpOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7IGFycjJbaV0gPSBhcnJbaV07IH0gcmV0dXJuIGFycjI7IH0gZWxzZSB7IHJldHVybiBBcnJheS5mcm9tKGFycik7IH0gfVxuXG52YXIgdGltZSA9IDc1MDtcbnZhciBzZWN0aW9uM0lkeCA9IDA7XG52YXIgc2VjdGlvbjRJZHggPSAwO1xuXG4vLyBsZXQgRm9vdGJhbGxGcmFtZXMsIFRlbm5pc0ZyYW1lcywgQmFzZWJhbGxGcmFtZXMsIEJhc2tldGJhbGxGcmFtZXMsIEZhbkZyYW1lcywgSWRsZUZyYW1lO1xudmFyIHRlbm5pc0FuaW1hdGlvbiA9IHZvaWQgMCxcbiAgICBmb290YmFsbEFuaW1hdGlvbiA9IHZvaWQgMCxcbiAgICBiYXNrZXRiYWxsQW5pbWF0aW9uID0gdm9pZCAwLFxuICAgIGJhc2ViYWxsQW5pbWF0aW9uID0gdm9pZCAwLFxuICAgIGZhbkFuaW1hdGlvbiA9IHZvaWQgMDtcblxudmFyIG1hc3Rlck9iaiA9IHtcblx0c2VjdGlvbjJDdXJyZW50SWR4OiAwLFxuXHRzZWN0aW9uMUN1cnJlbnRJZHg6IDAsXG5cdGJhc2tldGJhbGw6IHsgbG9vcEFtb3VudDogMSwgbG9vcElkOiBiYXNrZXRiYWxsQW5pbWF0aW9uIH0sXG5cdGZvb3RiYWxsOiB7IGxvb3BBbW91bnQ6IDEsIGxvb3BJZDogZm9vdGJhbGxBbmltYXRpb24gfSxcblx0dGVubmlzOiB7IGxvb3BBbW91bnQ6IDEsIGxvb3BJZDogdGVubmlzQW5pbWF0aW9uIH0sXG5cdGJhc2ViYWxsOiB7IGxvb3BBbW91bnQ6IDEsIGxvb3BJZDogYmFzZWJhbGxBbmltYXRpb24gfSxcblx0ZmFuOiB7IGxvb3BBbW91bnQ6IDEsIGxvb3BJZDogZmFuQW5pbWF0aW9uIH1cbn07XG52YXIgaG9tZXBhZ2VNb2JJbWFnZXMgPSBbJ2Fzc2V0cy9pbWFnZXMvaG9tZXBhZ2VNb2IvYmFza2V0YmFsbC5qcGcnLCAnYXNzZXRzL2ltYWdlcy9ob21lcGFnZU1vYi9mb290YmFsbC5qcGcnLCAnYXNzZXRzL2ltYWdlcy9ob21lcGFnZU1vYi90ZW5uaXMuanBnJywgJ2Fzc2V0cy9pbWFnZXMvaG9tZXBhZ2VNb2IvYmFzZWJhbGwuanBnJywgJ2Fzc2V0cy9pbWFnZXMvaG9tZXBhZ2VNb2IvZmFuLmpwZyddO1xuXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG5cdC8vIFdBSVQgRk9SIGdmeUNhdEVtYmVkIFZJREVPIFRPIFNUQVJUIFBMQVlJTkcgT04gTU9CSUxFLCBUSEVOIEhJREUgVEhFIExPQURJTkcgQU5JTUFUSU9OLiBcXFxcXG5cblx0aWYgKHdpbmRvdy5pbm5lcldpZHRoIDwgODAwKSB7XG5cblx0XHRmZXRjaCgnYXNzZXRzL2pzL0ZhbnRhc3RlY19TcHJpdGVfU2hlZXQuanNvbicpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG5cdFx0XHRyZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuXHRcdH0pLnRoZW4oZnVuY3Rpb24gKHNwcml0ZUpzb24pIHtcblx0XHRcdHZhciBJZGxlRnJhbWUgPSBmaWx0ZXJCeVZhbHVlKHNwcml0ZUpzb24uZnJhbWVzLCAnaWRsZScpO1xuXHRcdFx0bWFzdGVyT2JqLmZvb3RiYWxsLmFuaW1hdGlvbkFycmF5ID0gW10uY29uY2F0KF90b0NvbnN1bWFibGVBcnJheShJZGxlRnJhbWUpLCBfdG9Db25zdW1hYmxlQXJyYXkoZmlsdGVyQnlWYWx1ZShzcHJpdGVKc29uLmZyYW1lcywgJ2Zvb3RiYWxsJykpKTtcblx0XHRcdG1hc3Rlck9iai50ZW5uaXMuYW5pbWF0aW9uQXJyYXkgPSBbXS5jb25jYXQoX3RvQ29uc3VtYWJsZUFycmF5KElkbGVGcmFtZSksIF90b0NvbnN1bWFibGVBcnJheShmaWx0ZXJCeVZhbHVlKHNwcml0ZUpzb24uZnJhbWVzLCAndGVubmlzJykpKTtcblx0XHRcdG1hc3Rlck9iai5iYXNlYmFsbC5hbmltYXRpb25BcnJheSA9IFtdLmNvbmNhdChfdG9Db25zdW1hYmxlQXJyYXkoSWRsZUZyYW1lKSwgX3RvQ29uc3VtYWJsZUFycmF5KGZpbHRlckJ5VmFsdWUoc3ByaXRlSnNvbi5mcmFtZXMsICdiYXNlYmFsbCcpKSk7XG5cdFx0XHRtYXN0ZXJPYmouYmFza2V0YmFsbC5hbmltYXRpb25BcnJheSA9IFtdLmNvbmNhdChfdG9Db25zdW1hYmxlQXJyYXkoSWRsZUZyYW1lKSwgX3RvQ29uc3VtYWJsZUFycmF5KGZpbHRlckJ5VmFsdWUoc3ByaXRlSnNvbi5mcmFtZXMsICdiYXNrZXQnKSkpO1xuXHRcdFx0bWFzdGVyT2JqLmZhbi5hbmltYXRpb25BcnJheSA9IFtdLmNvbmNhdChfdG9Db25zdW1hYmxlQXJyYXkoSWRsZUZyYW1lKSwgX3RvQ29uc3VtYWJsZUFycmF5KGZpbHRlckJ5VmFsdWUoc3ByaXRlSnNvbi5mcmFtZXMsICdmYW4nKSkpO1xuXG5cdFx0XHRhbmltYXRvclNldHVwKCk7XG5cdFx0XHRpbWFnZUNvbnRyb2xlcihtYXN0ZXJPYmosIDEpO1xuXG5cdFx0XHRzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGltYWdlQ29udHJvbGVyKG1hc3Rlck9iaiwgMSk7XG5cdFx0XHR9LCA1MDAwKTtcblx0XHR9KTtcblx0fVxuXG5cdHZhciBmaWx0ZXJCeVZhbHVlID0gZnVuY3Rpb24gZmlsdGVyQnlWYWx1ZShhcnJheSwgc3RyaW5nKSB7XG5cdFx0cmV0dXJuIGFycmF5LmZpbHRlcihmdW5jdGlvbiAobykge1xuXHRcdFx0cmV0dXJuIHR5cGVvZiBvWydmaWxlbmFtZSddID09PSAnc3RyaW5nJyAmJiBvWydmaWxlbmFtZSddLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoc3RyaW5nLnRvTG93ZXJDYXNlKCkpO1xuXHRcdH0pO1xuXHR9O1xuXG5cdHZhciBhbmltYXRvclNldHVwID0gZnVuY3Rpb24gYW5pbWF0b3JTZXR1cCgpIHtcblxuXHRcdHZhciBsYXN0VGltZSA9IDA7XG5cdFx0dmFyIHZlbmRvcnMgPSBbJ21zJywgJ21veicsICd3ZWJraXQnLCAnbyddO1xuXHRcdGZvciAodmFyIHggPSAwOyB4IDwgdmVuZG9ycy5sZW5ndGggJiYgIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWU7ICsreCkge1xuXHRcdFx0d2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ1JlcXVlc3RBbmltYXRpb25GcmFtZSddO1xuXHRcdFx0d2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gd2luZG93W3ZlbmRvcnNbeF0gKyAnQ2FuY2VsQW5pbWF0aW9uRnJhbWUnXSB8fCB3aW5kb3dbdmVuZG9yc1t4XSArICdDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUnXTtcblx0XHR9XG5cblx0XHRpZiAoIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbiAoY2FsbGJhY2ssIGVsZW1lbnQpIHtcblx0XHRcdHZhciBjdXJyVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuXHRcdFx0dmFyIHRpbWVUb0NhbGwgPSBNYXRoLm1heCgwLCAxNiAtIChjdXJyVGltZSAtIGxhc3RUaW1lKSk7XG5cdFx0XHR2YXIgaWQgPSB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGNhbGxiYWNrKGN1cnJUaW1lICsgdGltZVRvQ2FsbCk7XG5cdFx0XHR9LCB0aW1lVG9DYWxsKTtcblx0XHRcdGxhc3RUaW1lID0gY3VyclRpbWUgKyB0aW1lVG9DYWxsO1xuXHRcdFx0cmV0dXJuIGlkO1xuXHRcdH07XG5cblx0XHRpZiAoIXdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSkgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24gKGlkKSB7XG5cdFx0XHRjbGVhclRpbWVvdXQoaWQpO1xuXHRcdH07XG5cdH07XG5cblx0dmFyIGFuaW1hdG9yID0gZnVuY3Rpb24gYW5pbWF0b3IoYW5pbWF0aW9uT2JqKSB7XG5cblx0XHR2YXIgZGFuY2luZ0ljb24sIHNwcml0ZUltYWdlLCBjYW52YXM7XG5cblx0XHRmdW5jdGlvbiBnYW1lTG9vcCgpIHtcblx0XHRcdCQoJyNsb2FkaW5nJykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuXHRcdFx0YW5pbWF0aW9uT2JqLmxvb3BJZCA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZ2FtZUxvb3ApO1xuXHRcdFx0ZGFuY2luZ0ljb24udXBkYXRlKCk7XG5cdFx0XHRkYW5jaW5nSWNvbi5yZW5kZXIoKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzcHJpdGUob3B0aW9ucykge1xuXG5cdFx0XHR2YXIgdGhhdCA9IHt9LFxuXHRcdFx0ICAgIGZyYW1lSW5kZXggPSAwLFxuXHRcdFx0ICAgIHRpY2tDb3VudCA9IDAsXG5cdFx0XHQgICAgbG9vcENvdW50ID0gMCxcblx0XHRcdCAgICB0aWNrc1BlckZyYW1lID0gb3B0aW9ucy50aWNrc1BlckZyYW1lIHx8IDAsXG5cdFx0XHQgICAgbnVtYmVyT2ZGcmFtZXMgPSBvcHRpb25zLm51bWJlck9mRnJhbWVzIHx8IDE7XG5cblx0XHRcdHRoYXQuY29udGV4dCA9IG9wdGlvbnMuY29udGV4dDtcblx0XHRcdHRoYXQud2lkdGggPSBvcHRpb25zLndpZHRoO1xuXHRcdFx0dGhhdC5oZWlnaHQgPSBvcHRpb25zLmhlaWdodDtcblx0XHRcdHRoYXQuaW1hZ2UgPSBvcHRpb25zLmltYWdlO1xuXHRcdFx0dGhhdC5sb29wcyA9IG9wdGlvbnMubG9vcHM7XG5cblx0XHRcdHRoYXQudXBkYXRlID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRcdHRpY2tDb3VudCArPSAxO1xuXG5cdFx0XHRcdGlmICh0aWNrQ291bnQgPiB0aWNrc1BlckZyYW1lKSB7XG5cblx0XHRcdFx0XHR0aWNrQ291bnQgPSAwO1xuXHRcdFx0XHRcdC8vIElmIHRoZSBjdXJyZW50IGZyYW1lIGluZGV4IGlzIGluIHJhbmdlXG5cdFx0XHRcdFx0aWYgKGZyYW1lSW5kZXggPCBudW1iZXJPZkZyYW1lcyAtIDEpIHtcblx0XHRcdFx0XHRcdC8vIEdvIHRvIHRoZSBuZXh0IGZyYW1lXG5cdFx0XHRcdFx0XHRmcmFtZUluZGV4ICs9IDE7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGxvb3BDb3VudCsrO1xuXHRcdFx0XHRcdFx0ZnJhbWVJbmRleCA9IDA7XG5cblx0XHRcdFx0XHRcdGlmIChsb29wQ291bnQgPT09IHRoYXQubG9vcHMpIHtcblx0XHRcdFx0XHRcdFx0d2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKGFuaW1hdGlvbk9iai5sb29wSWQpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0dGhhdC5yZW5kZXIgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRcdFx0Ly8gQ2xlYXIgdGhlIGNhbnZhc1xuXHRcdFx0XHR0aGF0LmNvbnRleHQuY2xlYXJSZWN0KDAsIDAsIHRoYXQud2lkdGgsIHRoYXQuaGVpZ2h0KTtcblxuXHRcdFx0XHR0aGF0LmNvbnRleHQuZHJhd0ltYWdlKHRoYXQuaW1hZ2UsIGFuaW1hdGlvbk9iai5hbmltYXRpb25BcnJheVtmcmFtZUluZGV4XS5mcmFtZS54LCBhbmltYXRpb25PYmouYW5pbWF0aW9uQXJyYXlbZnJhbWVJbmRleF0uZnJhbWUueSwgMjAwLCAxNzUsIDAsIDAsIHdpbmRvdy5pbm5lcldpZHRoIC8gMy44NDYsIHdpbmRvdy5pbm5lcldpZHRoIC8gNC4xKTtcblx0XHRcdH07XG5cblx0XHRcdHJldHVybiB0aGF0O1xuXHRcdH1cblxuXHRcdC8vIEdldCBjYW52YXNcblx0XHRjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJyk7XG5cdFx0Y2FudmFzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGggLyAzLjg0Njtcblx0XHRjYW52YXMuaGVpZ2h0ID0gd2luZG93LmlubmVyV2lkdGggLyAyLjI7XG5cblx0XHQvLyBDcmVhdGUgc3ByaXRlIHNoZWV0XG5cdFx0c3ByaXRlSW1hZ2UgPSBuZXcgSW1hZ2UoKTtcblxuXHRcdC8vIENyZWF0ZSBzcHJpdGVcblx0XHRkYW5jaW5nSWNvbiA9IHNwcml0ZSh7XG5cdFx0XHRjb250ZXh0OiBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpLFxuXHRcdFx0d2lkdGg6IDQwNDAsXG5cdFx0XHRoZWlnaHQ6IDE3NzAsXG5cdFx0XHRpbWFnZTogc3ByaXRlSW1hZ2UsXG5cdFx0XHRudW1iZXJPZkZyYW1lczogYW5pbWF0aW9uT2JqLmFuaW1hdGlvbkFycmF5Lmxlbmd0aCxcblx0XHRcdHRpY2tzUGVyRnJhbWU6IDQsXG5cdFx0XHRsb29wczogYW5pbWF0aW9uT2JqLmxvb3BBbW91bnRcblx0XHR9KTtcblxuXHRcdC8vIExvYWQgc3ByaXRlIHNoZWV0XG5cdFx0c3ByaXRlSW1hZ2UuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgZ2FtZUxvb3ApO1xuXHRcdHNwcml0ZUltYWdlLnNyYyA9ICdhc3NldHMvaW1hZ2VzL0ZhbnRhc3RlY19TcHJpdGVfU2hlZXQucG5nJztcblx0fTtcblxuXHQvLyBJTklUSUFMSVNFIEFORCBTRVRVUCBDVVJSRU5UIFBBR0UuIEVYRUNVVEUgVFJBTlNJVElPTlMgQU5EIFJFTU9WRSBUSU5UIElGIFJFTEVWQU5UIFxcXFxcblxuXHR2YXIgcGFnZUxvYWRlciA9IGZ1bmN0aW9uIHBhZ2VMb2FkZXIoaW5kZXgpIHtcblx0XHRpZiAoaW5kZXggPT09IDUpIHtcblx0XHRcdCQoJy50aW50JykucmVtb3ZlQ2xhc3MoJ3JlbW92ZVRpbnQnKTtcblx0XHRcdCQoJy5iYWNrZ3JvdW5kV3JhcHBlcicpLnJlbW92ZUNsYXNzKCdzY2FsZUJhY2tncm91bmQnKTtcblx0XHRcdCQoJyNzZWN0aW9uNScpLmZpbmQoJy5oZWFkaW5nJykuYWRkQ2xhc3MoJ3Nob3cgZmFkZUluJyk7XG5cdFx0XHQkKCcuc3ViU2VjdGlvbicpLmFkZENsYXNzKCdzY2FsZUJhY2tncm91bmQnKTtcblx0XHRcdCQoJy5zdWJTZWN0aW9uJykuZmluZCgnLnRpbnQnKS5hZGRDbGFzcygncmVtb3ZlVGludCcpO1xuXHRcdFx0JCgnI3NlY3Rpb241JykuZmluZCgnLnRleHRXcmFwcGVyJykuYWRkQ2xhc3MoJ3Nob3cnKTtcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHQkKCcuc3ViU2VjdGlvbiA+IC50ZXh0V3JhcHBlcicpLmZpbmQoJy5oZWFkaW5nJykuYWRkQ2xhc3MoJ2ZhZGVJbicpO1xuXHRcdFx0fSwgMTAwMCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCQoJy50aW50JykucmVtb3ZlQ2xhc3MoJ3JlbW92ZVRpbnQnKTtcblx0XHRcdCQoJy5zdWJTZWN0aW9uJykucmVtb3ZlQ2xhc3MoJ3NjYWxlQmFja2dyb3VuZCcpO1xuXHRcdFx0JCgnLmJhY2tncm91bmRXcmFwcGVyOm5vdCgjc2VjdGlvbicgKyBpbmRleCArICdCYWNrZ3JvdW5kKScpLnJlbW92ZUNsYXNzKCdzY2FsZUJhY2tncm91bmQnKTtcblx0XHRcdCQoJy5zZWN0aW9uLmFjdGl2ZScpLmZpbmQoJy5iYWNrZ3JvdW5kV3JhcHBlcicpLmFkZENsYXNzKCdzY2FsZUJhY2tncm91bmQnKTtcblx0XHRcdCQoJ3NlY3Rpb24uYWN0aXZlJykuZmluZCgnLnRpbnQnKS5hZGRDbGFzcygncmVtb3ZlVGludCcpO1xuXG5cdFx0XHRpZiAoJCgnLnNlY3Rpb24nICsgaW5kZXggKyAnUGFnaW5hdG9yQnV0dG9uJykubGVuZ3RoICYmICQoJy5zZWN0aW9uJyArIGluZGV4ICsgJ1BhZ2luYXRvckJ1dHRvbi5hY3RpdmUnKS5sZW5ndGggPCAxKSB7XG5cdFx0XHRcdCQoJy5zZWN0aW9uJyArIGluZGV4ICsgJ1BhZ2luYXRvckJ1dHRvbicpLmdldCgwKS5jbGljaygpO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHQvLyBISURFIEFMTCBCRUNLR1JPVU5EUyBJTiBUSEUgU0VDVElPTiBFWENFUFQgVEhFIFNQRUNJRklFRCBJTkRFWCwgV0hJQ0ggSVMgU0NBTEVEIEFORCBTSE9XTi4gXFxcXFxuXG5cdHZhciBpbml0aWFsaXplU2VjdGlvbiA9IGZ1bmN0aW9uIGluaXRpYWxpemVTZWN0aW9uKHNlY3Rpb25OdW1iZXIsIGlkeCkge1xuXHRcdCQoJyNzZWN0aW9uJyArIHNlY3Rpb25OdW1iZXIgKyAnQmFja2dyb3VuZCcgKyBpZHgpLnNpYmxpbmdzKCcuYmFja2dyb3VuZFdyYXBwZXInKS5tYXAoZnVuY3Rpb24gKGl4LCBlbGUpIHtcblx0XHRcdCQoZWxlKS5jc3MoeyBvcGFjaXR5OiAwIH0pO1xuXHRcdH0pO1xuXG5cdFx0JCgnI3NlY3Rpb24nICsgc2VjdGlvbk51bWJlciArICdCYWNrZ3JvdW5kJyArIGlkeCkuY3NzKHtcblx0XHRcdCd0cmFuc2Zvcm0nOiAnc2NhbGUoMS4xKScsXG5cdFx0XHQnb3BhY2l0eSc6IDFcblx0XHR9KTtcblx0fTtcblxuXHQvLyBJTklUSUFURSBpbml0aWFsaXplU2VjdGlvbiBPTiBTRUNUSU9OUyAzIEFORCA0LiBcXFxcXG5cdGluaXRpYWxpemVTZWN0aW9uKDEsIDApO1xuXHRpbml0aWFsaXplU2VjdGlvbigzLCAwKTtcblx0aW5pdGlhbGl6ZVNlY3Rpb24oNCwgMCk7XG5cblx0Ly8gU0VDVElPTlMgMiAoQUJPVVQgVVMgU0VDVElPTikgQkFDS0dST1VORCBJTUFHRSBUUkFOU0lUSU9OIEhBTkRMRVIuIFxcXFxcblxuXHR2YXIgaW1hZ2VDb250cm9sZXIgPSBmdW5jdGlvbiBpbWFnZUNvbnRyb2xlcihpZHhPYmosIHNlY3Rpb25OdW1iZXIpIHtcblx0XHR2YXIgcmVsZXZhbnRBbmltYXRpb24gPSB2b2lkIDA7XG5cblx0XHRpZiAoc2VjdGlvbk51bWJlciA9PT0gMSkge1xuXHRcdFx0c3dpdGNoIChpZHhPYmouc2VjdGlvbjFDdXJyZW50SWR4KSB7XG5cdFx0XHRcdGNhc2UgMDpcblx0XHRcdFx0XHRyZWxldmFudEFuaW1hdGlvbiA9IG1hc3Rlck9iai5iYXNrZXRiYWxsO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIDE6XG5cdFx0XHRcdFx0cmVsZXZhbnRBbmltYXRpb24gPSBtYXN0ZXJPYmouZm9vdGJhbGw7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgMjpcblx0XHRcdFx0XHRyZWxldmFudEFuaW1hdGlvbiA9IG1hc3Rlck9iai50ZW5uaXM7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgMzpcblx0XHRcdFx0XHRyZWxldmFudEFuaW1hdGlvbiA9IG1hc3Rlck9iai5iYXNlYmFsbDtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSA0OlxuXHRcdFx0XHRcdHJlbGV2YW50QW5pbWF0aW9uID0gbWFzdGVyT2JqLmZhbjtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cblx0XHQkKCcjc2VjdGlvbicgKyBzZWN0aW9uTnVtYmVyKS5maW5kKCcudGludCcpLnJlbW92ZUNsYXNzKCdyZW1vdmVUaW50Jyk7XG5cdFx0JCgnI3NlY3Rpb24nICsgc2VjdGlvbk51bWJlciArICdCYWNrZ3JvdW5kJyArIGlkeE9ialsnc2VjdGlvbicgKyBzZWN0aW9uTnVtYmVyICsgJ0N1cnJlbnRJZHgnXSkucmVtb3ZlQ2xhc3MoJ3NjYWxlQmFja2dyb3VuZCcpO1xuXHRcdGluaXRpYWxpemVTZWN0aW9uKHNlY3Rpb25OdW1iZXIsIGlkeE9ialsnc2VjdGlvbicgKyBzZWN0aW9uTnVtYmVyICsgJ0N1cnJlbnRJZHgnXSk7XG5cblx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdGlmIChzZWN0aW9uTnVtYmVyID09PSAxKSB7XG5cdFx0XHRcdGFuaW1hdG9yKHJlbGV2YW50QW5pbWF0aW9uKTtcblx0XHRcdH1cblxuXHRcdFx0JCgnI3NlY3Rpb24nICsgc2VjdGlvbk51bWJlcikuZmluZCgnLmJhY2tncm91bmRXcmFwcGVyJykuYWRkQ2xhc3MoJ3NjYWxlQmFja2dyb3VuZCcpO1xuXHRcdFx0JCgnI3NlY3Rpb24nICsgc2VjdGlvbk51bWJlcikuZmluZCgnLnRpbnQnKS5hZGRDbGFzcygncmVtb3ZlVGludCcpO1xuXHRcdH0sIDUwMCk7XG5cblx0XHRpZiAoaWR4T2JqWydzZWN0aW9uJyArIHNlY3Rpb25OdW1iZXIgKyAnQ3VycmVudElkeCddID09PSAkKCcjc2VjdGlvbicgKyBzZWN0aW9uTnVtYmVyKS5maW5kKCcuYmFja2dyb3VuZFdyYXBwZXInKS5sZW5ndGggLSAxKSB7XG5cdFx0XHRpZHhPYmpbJ3NlY3Rpb24nICsgc2VjdGlvbk51bWJlciArICdDdXJyZW50SWR4J10gPSAwO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZHhPYmpbJ3NlY3Rpb24nICsgc2VjdGlvbk51bWJlciArICdDdXJyZW50SWR4J10gKz0gMTtcblx0XHR9XG5cdH07XG5cblx0aW1hZ2VDb250cm9sZXIobWFzdGVyT2JqLCAyKTtcblxuXHRzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG5cdFx0aW1hZ2VDb250cm9sZXIobWFzdGVyT2JqLCAyKTtcblx0fSwgMTUwMDApO1xuXG5cdC8vIFBBR0lOQVRJT04gQlVUVE9OUyBDTElDSyBIQU5ETEVSIEZPUiBTRUNUSU9OUyAzIEFORCA0LiBcXFxcXG5cblx0dmFyIGhhbmRsZVBhbmluYXRpb25CdXR0b25DbGljayA9IGZ1bmN0aW9uIGhhbmRsZVBhbmluYXRpb25CdXR0b25DbGljayhlKSB7XG5cblx0XHR2YXIgaWR4ID0gcGFyc2VJbnQoJChlLnRhcmdldCkuYXR0cignZGF0YS1pbmRleCcpKTtcblx0XHR2YXIgc2VjdGlvbklkID0gJChlLnRhcmdldCkuY2xvc2VzdCgnc2VjdGlvbicpLmF0dHIoJ2lkJyk7XG5cdFx0dmFyIHJlbGV2YW50RGF0YUFycmF5ID0gdm9pZCAwO1xuXG5cdFx0aWYgKHNlY3Rpb25JZCA9PT0gJ3NlY3Rpb24zJykge1xuXHRcdFx0c2VjdGlvbjNJZHggPSBpZHg7XG5cdFx0fVxuXG5cdFx0aWYgKHNlY3Rpb25JZCA9PT0gJ3NlY3Rpb240Jykge1xuXHRcdFx0c2VjdGlvbjRJZHggPSBpZHg7XG5cdFx0fVxuXG5cdFx0JCgnIycgKyBzZWN0aW9uSWQpLmZpbmQoJy50aW50JykucmVtb3ZlQ2xhc3MoJ3JlbW92ZVRpbnQnKTtcblx0XHQkKCcjJyArIHNlY3Rpb25JZCkuZmluZCgnLnRleHRXcmFwcGVyJykucmVtb3ZlQ2xhc3MoJ3Nob3cnKTtcblx0XHQkKCcjJyArIHNlY3Rpb25JZCkuZmluZCgnI3RleHRXcmFwcGVyJyArIGlkeCkuYWRkQ2xhc3MoJ3Nob3cnKTtcblx0XHQkKCcjJyArIHNlY3Rpb25JZCArICdCYWNrZ3JvdW5kJyArIGlkeCkucmVtb3ZlQ2xhc3MoJ3NjYWxlQmFja2dyb3VuZCcpO1xuXHRcdCQoJy4nICsgc2VjdGlvbklkICsgJ1BhZ2luYXRvckJ1dHRvbicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblx0XHQkKGUudGFyZ2V0KS5hZGRDbGFzcygnYWN0aXZlJyk7XG5cblx0XHRpbml0aWFsaXplU2VjdGlvbihwYXJzZUludCgkKCcjJyArIHNlY3Rpb25JZCkuYXR0cignZGF0YS1pbmRleCcpKSwgaWR4KTtcblxuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0cGFnZUxvYWRlcihwYXJzZUludCgkKCcjJyArIHNlY3Rpb25JZCkuYXR0cignZGF0YS1pbmRleCcpKSk7XG5cdFx0fSwgNTAwKTtcblxuXHRcdGlmIChzZWN0aW9uSWQgIT09ICdzZWN0aW9uMicpIHtcblx0XHRcdCQoJyMnICsgc2VjdGlvbklkKS5maW5kKCcuaGVhZGluZywgcCcpLmFkZENsYXNzKCdmYWRlSW4nKTtcblx0XHRcdCQoJyMnICsgc2VjdGlvbklkKS5vbigndHJhbnNpdGlvbmVuZCB3ZWJraXRUcmFuc2l0aW9uRW5kIG9UcmFuc2l0aW9uRW5kJywgZnVuY3Rpb24gKGVzKSB7XG5cdFx0XHRcdCQoJyMnICsgc2VjdGlvbklkKS5maW5kKCcuaGVhZGluZywgcCcpLnJlbW92ZUNsYXNzKCdmYWRlSW4nKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fTtcblxuXHQvLyBDTElDSyBMSVNURU5FUiBGT1IgUEFHSU5BVElPTiBCVVRUT05TIE9OIFNFQ1RJT05TIDMgQU5EIDQuIFxcXFxcblxuXHQkKCcuc2VjdGlvbjNQYWdpbmF0b3JCdXR0b24sIC5zZWN0aW9uNFBhZ2luYXRvckJ1dHRvbicpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XG5cdFx0aGFuZGxlUGFuaW5hdGlvbkJ1dHRvbkNsaWNrKGUpO1xuXHR9KTtcblxuXHQvLyBJTklUSUFMSVpFIE9ORVBBR0VTQ1JPTEwgSUYgTk9UIElOIENNUyBQUkVWSUVXLiBcXFxcXG5cblx0aWYgKCEkKGxvY2F0aW9uKS5hdHRyKCdocmVmJykuaW5jbHVkZXMoJ2luZGV4LnBocCcpKSB7XG5cdFx0JCgnI3Njcm9sbGVyV3JhcHBlcicpLm9uZXBhZ2Vfc2Nyb2xsKHtcblx0XHRcdHNlY3Rpb25Db250YWluZXI6IFwic2VjdGlvblwiLFxuXHRcdFx0ZWFzaW5nOiBcImVhc2Utb3V0XCIsXG5cdFx0XHRhbmltYXRpb25UaW1lOiB0aW1lLFxuXHRcdFx0cGFnaW5hdGlvbjogdHJ1ZSxcblx0XHRcdHVwZGF0ZVVSTDogdHJ1ZSxcblx0XHRcdGJlZm9yZU1vdmU6IGZ1bmN0aW9uIGJlZm9yZU1vdmUoaW5kZXgpIHt9LFxuXHRcdFx0YWZ0ZXJNb3ZlOiBmdW5jdGlvbiBhZnRlck1vdmUoaW5kZXgpIHtcblx0XHRcdFx0Ly8gSU5JVElBTElaRSBUSEUgQ1VSUkVOVCBQQUdFLiBcXFxcXG5cblx0XHRcdFx0cGFnZUxvYWRlcihpbmRleCk7XG5cdFx0XHR9LFxuXHRcdFx0bG9vcDogZmFsc2UsXG5cdFx0XHRrZXlib2FyZDogdHJ1ZSxcblx0XHRcdHJlc3BvbnNpdmVGYWxsYmFjazogZmFsc2UsXG5cdFx0XHRkaXJlY3Rpb246IFwidmVydGljYWxcIlxuXHRcdH0pO1xuXG5cdFx0JCgnI3Njcm9sbGVyV3JhcHBlcicpLm1vdmVUbygxKTtcblx0fVxuXG5cdC8vIENPTlRST0wgQ0xJQ0tTIE9OIFdPUksgV0lUSCBVUyBTRUNUSU9OIChTRUNUSU9ONSkuIFxcXFxcblxuXHQkKCcuY2xpY2thYmxlJykuY2xpY2soZnVuY3Rpb24gKGUpIHtcblx0XHR2YXIgY3VycmVudFNlY3Rpb24gPSAkKGUudGFyZ2V0KS5jbG9zZXN0KCQoJy5zdWJTZWN0aW9uJykpO1xuXG5cdFx0aWYgKGN1cnJlbnRTZWN0aW9uLmhhc0NsYXNzKCdvcGVuJykpIHtcblx0XHRcdGN1cnJlbnRTZWN0aW9uLnJlbW92ZUNsYXNzKCdvcGVuJyk7XG5cdFx0XHRjdXJyZW50U2VjdGlvbi5maW5kKCcuYnV0dG9uLCBwJykucmVtb3ZlQ2xhc3MoJ2ZhZGVJbicpO1xuXHRcdFx0Y3VycmVudFNlY3Rpb24uc2libGluZ3MoJy5zdWJTZWN0aW9uJykubWFwKGZ1bmN0aW9uIChpZHgsIHNlY3Rpb24pIHtcblx0XHRcdFx0JChzZWN0aW9uKS5yZW1vdmVDbGFzcygnY2xvc2VkJyk7XG5cdFx0XHRcdCQoc2VjdGlvbikuZmluZCgnLnRpbnQnKS5yZW1vdmVDbGFzcygnYWRkVGludCcpLmFkZENsYXNzKCdyZW1vdmVUaW50Jyk7XG5cdFx0XHR9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y3VycmVudFNlY3Rpb24ucmVtb3ZlQ2xhc3MoJ2Nsb3NlZCcpLmFkZENsYXNzKCdvcGVuJyk7XG5cdFx0XHRjdXJyZW50U2VjdGlvbi5vbigndHJhbnNpdGlvbmVuZCB3ZWJraXRUcmFuc2l0aW9uRW5kIG9UcmFuc2l0aW9uRW5kJywgZnVuY3Rpb24gKGVzKSB7XG5cdFx0XHRcdCQoJy5zdWJTZWN0aW9uLm9wZW4nKS5maW5kKCcuYnV0dG9uLCBwJykuYWRkQ2xhc3MoJ2ZhZGVJbicpO1xuXHRcdFx0fSk7XG5cdFx0XHRjdXJyZW50U2VjdGlvbi5zaWJsaW5ncygnLnN1YlNlY3Rpb24nKS5tYXAoZnVuY3Rpb24gKGlkeCwgc2VjdGlvbikge1xuXHRcdFx0XHQkKHNlY3Rpb24pLnJlbW92ZUNsYXNzKCdvcGVuJykuYWRkQ2xhc3MoJ2Nsb3NlZCcpO1xuXHRcdFx0XHQkKHNlY3Rpb24pLmZpbmQoJy50aW50JykucmVtb3ZlQ2xhc3MoJ3JlbW92ZVRpbnQnKS5hZGRDbGFzcygnYWRkVGludCcpO1xuXHRcdFx0XHQkKHNlY3Rpb24pLmZpbmQoJy5idXR0b24sIHAnKS5yZW1vdmVDbGFzcygnZmFkZUluJyk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0Y3VycmVudFNlY3Rpb24uZmluZCgnLnRpbnQnKS5yZW1vdmVDbGFzcygnYWRkVGludCcpLmFkZENsYXNzKCdyZW1vdmVUaW50Jyk7XG5cdH0pO1xuXG5cdC8vIENPTlRST0wgRk9PVEVSIEFSUk9XIENMSUNLUy4gXFxcXFxuXG5cdCQoJyNkb3duQXJyb3cnKS5jbGljayhmdW5jdGlvbiAoKSB7XG5cdFx0aWYgKCQod2luZG93KS5oZWlnaHQoKSAqICgkKCcucGFnZScpLmxlbmd0aCAtIDEpID09PSAtJCgnI3Njcm9sbGVyV3JhcHBlcicpLm9mZnNldCgpLnRvcCkge1xuXHRcdFx0JCgnI3Njcm9sbGVyV3JhcHBlcicpLm1vdmVUbygxKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JCgnI3Njcm9sbGVyV3JhcHBlcicpLm1vdmVEb3duKCk7XG5cdFx0fVxuXHR9KTtcblxuXHQvLyBISURFIFRIRSBMT0FESU5HIEFOSU1BVElPUE4gV0hFTiBWSURFTyBJUyBSRUFEWSBUTyBQTEFZIE9OIERFWEtUT1AuIFxcXFxcblxuXHR2YXIgaGlkZUxvYWRpbmdBbmltYXRpb24gPSBmdW5jdGlvbiBoaWRlTG9hZGluZ0FuaW1hdGlvbigpIHtcblx0XHRpZiAod2luZG93LmlubmVyV2lkdGggPiA4MDAgJiYgISQoJyNsb2FkaW5nJykuaGFzQ2xhc3MoJ2hpZGRlbicpKSB7XG5cblx0XHRcdGlmICgkKCcjdmlkZW8nKS5nZXQoMCkucmVhZHlTdGF0ZSA9PT0gNCkge1xuXHRcdFx0XHQkKCcjbG9hZGluZycpLmFkZENsYXNzKCdoaWRkZW4nKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0dmFyIHNlY3Rpb24zQXV0b21hdGVkID0gdm9pZCAwLFxuXHQgICAgYXV0b21hdGVTZWN0aW9uMyA9IHZvaWQgMCxcblx0ICAgIHNlY3Rpb240QXV0b21hdGVkID0gdm9pZCAwLFxuXHQgICAgYXV0b21hdGVTZWN0aW9uNCA9IHZvaWQgMDtcblx0Ly8gTUFOQUdFTUVOVCBGVU5DVElPTiBGT1IgU0VUVElORyBBTkQgQ0xFQVJJTkcgVEhFIFNMSURFIEFVVE9NQVRJT04gSU5URVJWQUxTLiBcXFxcXG5cblx0dmFyIGludGVydmFsTWFuYWdlciA9IGZ1bmN0aW9uIGludGVydmFsTWFuYWdlcihmbGFnLCBzZWN0aW9uSWQsIHRpbWUpIHtcblx0XHRpZiAoZmxhZykge1xuXHRcdFx0aWYgKHNlY3Rpb25JZCA9PT0gJ3NlY3Rpb24zJykge1xuXHRcdFx0XHRhdXRvbWF0ZVNlY3Rpb24zID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdHN3aXBlQ29udHJvbGxlcihzZWN0aW9uSWQsICdsJyk7XG5cdFx0XHRcdH0sIHRpbWUpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHNlY3Rpb25JZCA9PT0gJ3NlY3Rpb240Jykge1xuXHRcdFx0XHRhdXRvbWF0ZVNlY3Rpb240ID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdHN3aXBlQ29udHJvbGxlcihzZWN0aW9uSWQsICdsJyk7XG5cdFx0XHRcdH0sIHRpbWUpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAoc2VjdGlvbklkID09PSAnc2VjdGlvbjMnKSB7XG5cdFx0XHRcdGNsZWFySW50ZXJ2YWwoYXV0b21hdGVTZWN0aW9uMyk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoc2VjdGlvbklkID09PSAnc2VjdGlvbjQnKSB7XG5cdFx0XHRcdGNsZWFySW50ZXJ2YWwoYXV0b21hdGVTZWN0aW9uNCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdC8vIElGIE5PVCBJTiBDTVMgQURNSU4gUFJFVklFVywgUEVSUEVUVUFMTFkgQ0hFQ0sgSUYgV0UgQVJFIEFUIFRIRSBUT1AgT0YgVEhFIFBBR0UgQU5EIElGIFNPLCBET05UIFNIT1cgVEhFIEZPT1RFUiBPUiBHUkVFTiBTSEFQRS4gXFxcXFxuXG5cdGlmICghJChsb2NhdGlvbikuYXR0cignaHJlZicpLmluY2x1ZGVzKCdpbmRleC5waHAnKSkge1xuXHRcdHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcblx0XHRcdGlmICgkKCcjc2Nyb2xsZXJXcmFwcGVyJykub2Zmc2V0KCkudG9wID49IDApIHtcblx0XHRcdFx0JCgnI2hlYWRlclNoYXBlLCAjZm9vdGVyJykuYWRkQ2xhc3MoJ21vdmVPZmZTY3JlZW4nKTtcblx0XHRcdFx0JCgnI3ZpZGVvJykuZ2V0KDApLnBsYXkoKTtcblx0XHRcdFx0JCgnLmFycm93JykuYWRkQ2xhc3MoJ3B1bHNhdGUnKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHZhciB0aW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0JCgnI2hlYWRlclNoYXBlLCAjZm9vdGVyJykucmVtb3ZlQ2xhc3MoJ21vdmVPZmZTY3JlZW4nKTtcblx0XHRcdFx0XHQkKCcjdmlkZW8nKS5nZXQoMCkucGF1c2UoKTtcblx0XHRcdFx0XHQkKCcuYXJyb3cnKS5yZW1vdmVDbGFzcygncHVsc2F0ZScpO1xuXHRcdFx0XHRcdGNsZWFyVGltZW91dCh0aW1lb3V0KTtcblx0XHRcdFx0fSwgdGltZSk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFJPVEFURSBUSEUgQVJST1cgSU4gVEhFIEZPT1RFUiBXSEVOIEFUIFRIRSBCT1RUT00gT0YgVEhFIFBBR0UgXFxcXFxuXG5cdFx0XHRpZiAoJCgnI3Njcm9sbGVyV3JhcHBlcicpLm9mZnNldCgpLnRvcCA8IC0od2luZG93LmlubmVySGVpZ2h0ICogNCkpIHtcblx0XHRcdFx0JCgnI2Rvd25BcnJvdycpLmNzcyh7ICd0cmFuc2Zvcm0nOiAncm90YXRlKDE4MGRlZykgdHJhbnNsYXRlWCgtNTAlKScgfSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkKCcjZG93bkFycm93JykuY3NzKHsgJ3RyYW5zZm9ybSc6ICd0cmFuc2xhdGVYKC01MCUpIHJvdGF0ZSgwZGVnKScgfSk7XG5cdFx0XHR9XG5cblx0XHRcdGhpZGVMb2FkaW5nQW5pbWF0aW9uKCk7XG5cblx0XHRcdC8vIEFERCBMQU5EU0NBUEUgU1RZTEVTIFRPIFJFTEVWQU5UIEVMRU1FTlRTIFxcXFxcblxuXHRcdFx0aWYgKHdpbmRvdy5tYXRjaE1lZGlhKFwiKG9yaWVudGF0aW9uOiBsYW5kc2NhcGUpXCIpLm1hdGNoZXMgJiYgd2luZG93LmlubmVyV2lkdGggPCA4MDApIHtcblx0XHRcdFx0JCgnLm5hdl9saW5rLCAjaGVhZGVyU2hhcGUsICNmb290ZXIsIC5jdXN0b20sIC5tYXJrZXIsICNzZWN0aW9uNSwgLnRleHRXcmFwcGVyJykuYWRkQ2xhc3MoJ2xhbmRzY2FwZScpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JCgnLm5hdl9saW5rLCAjaGVhZGVyU2hhcGUsICNmb290ZXIsIC5jdXN0b20sIC5tYXJrZXIsICNzZWN0aW9uNSwgLnRleHRXcmFwcGVyJykucmVtb3ZlQ2xhc3MoJ2xhbmRzY2FwZScpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoJCgnI3NlY3Rpb24zLmFjdGl2ZScpLmxlbmd0aCkge1xuXHRcdFx0XHQvLyBBVVRPTUFURSBUSEUgU0xJREVTIE9OIFNFQ1RJT1BOIDMgRVZFUlkgNyBTRUNPTkRTIElGIFRIRSBTRUNUSU9OIElTIEFDVElWRS4gXFxcXFxuXHRcdFx0XHRpZiAoc2VjdGlvbjNBdXRvbWF0ZWQgIT09IHRydWUpIHtcblx0XHRcdFx0XHRzZWN0aW9uM0F1dG9tYXRlZCA9IHRydWU7XG5cdFx0XHRcdFx0aW50ZXJ2YWxNYW5hZ2VyKHRydWUsICdzZWN0aW9uMycsIDcwMDApO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBTVE9QIEFVVE9NQVRFRCBTTElERVMgT04gU0VDVElPUE4gMyBJRiBUSEUgU0VDVElPTiBJUyBOT1QgQUNUSVZFLiBcXFxcXG5cdFx0XHRcdGlmIChzZWN0aW9uM0F1dG9tYXRlZCA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRcdGludGVydmFsTWFuYWdlcihmYWxzZSwgJ3NlY3Rpb24zJyk7XG5cdFx0XHRcdFx0c2VjdGlvbjNBdXRvbWF0ZWQgPSBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoJCgnI3NlY3Rpb240LmFjdGl2ZScpLmxlbmd0aCkge1xuXHRcdFx0XHQvLyBBVVRPTUFURSBUSEUgU0xJREVTIE9OIFNFQ1RJT1BOIDQgRVZFUlkgNyBTRUNPTkRTIElGIFRIRSBTRUNUSU9OIElTIEFDVElWRS4gXFxcXFxuXHRcdFx0XHRpZiAoc2VjdGlvbjRBdXRvbWF0ZWQgIT09IHRydWUpIHtcblx0XHRcdFx0XHRzZWN0aW9uNEF1dG9tYXRlZCA9IHRydWU7XG5cdFx0XHRcdFx0aW50ZXJ2YWxNYW5hZ2VyKHRydWUsICdzZWN0aW9uNCcsIDcwMDApO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBTVE9QIEFVVE9NQVRFRCBTTElERVMgT04gU0VDVElPUE4gNCBJRiBUSEUgU0VDVElPTiBJUyBOT1QgQUNUSVZFLiBcXFxcXG5cdFx0XHRcdGlmIChzZWN0aW9uNEF1dG9tYXRlZCA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRcdGludGVydmFsTWFuYWdlcihmYWxzZSwgJ3NlY3Rpb240Jyk7XG5cdFx0XHRcdFx0c2VjdGlvbjRBdXRvbWF0ZWQgPSBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sIDUwMCk7XG5cdH1cblxuXHQvLyBDT05UUk9MIFdIQVQgSEFQUEVOUyBXSEVOIExJTktTIElOIFRIRSBOQVYvTUVOVSBBUkUgQ0xJQ0tFRCBcXFxcXG5cblx0JCgnLm5hdl9saW5rJykuY2xpY2soZnVuY3Rpb24gKGUpIHtcblx0XHR2YXIgcGFnZUlkeCA9IHBhcnNlSW50KCQoZS50YXJnZXQpLmF0dHIoJ2RhdGEtaW5kZXgnKSk7XG5cdFx0JCgnI3Njcm9sbGVyV3JhcHBlcicpLm1vdmVUbyhwYWdlSWR4KTtcblx0XHQkKCcjbWVudUJsb2NrT3V0JykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuXG5cdFx0aWYgKGJ1cmdlci5jbGFzc0xpc3QuY29udGFpbnMoJ2J1cmdlci0tYWN0aXZlJykpIHtcblx0XHRcdG5hdi5jbGFzc0xpc3QucmVtb3ZlKCduYXZfb3BlbicpO1xuXHRcdFx0YnVyZ2VyLmNsYXNzTGlzdC5yZW1vdmUoJ2J1cmdlci0tYWN0aXZlJyk7XG5cdFx0XHRkb2N1bWVudC5ib2R5LnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcblx0XHR9XG5cdH0pO1xuXG5cdC8vIFdIRU4gVEhFIE5BViBJUyBPUEVOIFBSRVZFTlQgVVNFUiBGUk9NIEJFSU5HIEFCTEUgVE8gQ0xJQ0sgQU5ZVEhJTkcgRUxTRSBcXFxcXG5cblx0JCgnI21lbnVCbG9ja091dCcpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XG5cdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0fSk7XG5cblx0dmFyIGJ1cmdlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluLWJ1cmdlcicpLFxuXHQgICAgbmF2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW5OYXYnKTtcblxuXHQvLyBDT05UUk9MIEZPUiBPUEVOIEFORCBDTE9TSU5HIFRIRSBNRU5VL05BViAgXFxcXFxuXG5cdGZ1bmN0aW9uIG5hdkNvbnRyb2woKSB7XG5cblx0XHRpZiAoYnVyZ2VyLmNsYXNzTGlzdC5jb250YWlucygnYnVyZ2VyLS1hY3RpdmUnKSkge1xuXHRcdFx0bmF2LmNsYXNzTGlzdC5yZW1vdmUoJ25hdl9vcGVuJyk7XG5cdFx0XHRidXJnZXIuY2xhc3NMaXN0LnJlbW92ZSgnYnVyZ2VyLS1hY3RpdmUnKTtcblx0XHRcdCQoJyNtZW51QmxvY2tPdXQnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGJ1cmdlci5jbGFzc0xpc3QuYWRkKCdidXJnZXItLWFjdGl2ZScpO1xuXHRcdFx0bmF2LmNsYXNzTGlzdC5hZGQoJ25hdl9vcGVuJyk7XG5cdFx0XHQkKCcjbWVudUJsb2NrT3V0JykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuXHRcdH1cblx0fVxuXG5cdC8vIE9OTFkgTElTVEVOIEZPUiBNRU5VIENMSUNLUyBXSEVOIE5PVCBJTiBDTVMgUFJFVklFVyBNT0RFIFxcXFxcblxuXHRpZiAoISQobG9jYXRpb24pLmF0dHIoJ2hyZWYnKS5pbmNsdWRlcygnaW5kZXgucGhwJykpIHtcblx0XHRidXJnZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBuYXZDb250cm9sKTtcblx0fVxuXG5cdC8vIENMT1NFIFRIRSBOQVYgSUYgVEhFIFdJTkRPVyBJUyBPVkVSIDEwMDBQWCBXSURFIFxcXFxcblxuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZnVuY3Rpb24gKCkge1xuXHRcdGlmICh3aW5kb3cuaW5uZXJXaWR0aCA+IDEwMDAgJiYgbmF2LmNsYXNzTGlzdC5jb250YWlucygnbmF2X29wZW4nKSkge1xuXHRcdFx0bmF2Q29udHJvbCgpO1xuXHRcdFx0bmF2LmNsYXNzTGlzdC5yZW1vdmUoJ25hdl9vcGVuJyk7XG5cdFx0XHQkKCcjbWVudUJsb2NrT3V0JykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuXHRcdH1cblx0fSk7XG5cblx0Ly8gVEhJUyBTRVQgT0YgSUYgU1RBVEVNRU5UUyBJTklUSUFMSVNFUyBUSEUgU1BFU0lGSUMgUEFHRVMgRk9SIFBSRVZJRVdJTkcgSU4gQ01TIEFETUlOLiBcXFxcXG5cblx0aWYgKCQobG9jYXRpb24pLmF0dHIoJ2hyZWYnKS5pbmNsdWRlcygnaW5kZXgucGhwJykpIHtcblx0XHRpZiAoJChsb2NhdGlvbikuYXR0cignaHJlZicpLmluY2x1ZGVzKCdpbWFnaW5lLWlmJykpIHtcblx0XHRcdHBhZ2VMb2FkZXIoNCk7XG5cdFx0fVxuXHRcdGlmICgkKGxvY2F0aW9uKS5hdHRyKCdocmVmJykuaW5jbHVkZXMoJ2hvdy13ZS1pbm5vdmF0ZScpKSB7XG5cdFx0XHRwYWdlTG9hZGVyKDMpO1xuXHRcdH1cblx0XHRpZiAoJChsb2NhdGlvbikuYXR0cignaHJlZicpLmluY2x1ZGVzKCd3b3JrLXdpdGgtdXMnKSkge1xuXHRcdFx0cGFnZUxvYWRlcig1KTtcblx0XHR9XG5cdFx0aWYgKCQobG9jYXRpb24pLmF0dHIoJ2hyZWYnKS5pbmNsdWRlcygnY29udGFjdC11cycpKSB7XG5cdFx0XHRwYWdlTG9hZGVyKDYpO1xuXHRcdH1cblx0XHRpZiAoJChsb2NhdGlvbikuYXR0cignaHJlZicpLmluY2x1ZGVzKCdob21lLXZpZGVvJykpIHtcblx0XHRcdHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0aGlkZUxvYWRpbmdBbmltYXRpb24oKTtcblx0XHRcdH0sIDUwMCk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gU1dJUEUgRVZFTlRTIERFVEVDVE9SIEZVTkNUSU9OIFxcXFxcblxuXHRmdW5jdGlvbiBkZXRlY3Rzd2lwZShlbCwgZnVuYykge1xuXHRcdHZhciBzd2lwZV9kZXQgPSB7fTtcblx0XHRzd2lwZV9kZXQuc1ggPSAwO3N3aXBlX2RldC5zWSA9IDA7c3dpcGVfZGV0LmVYID0gMDtzd2lwZV9kZXQuZVkgPSAwO1xuXHRcdHZhciBtaW5feCA9IDMwOyAvL21pbiB4IHN3aXBlIGZvciBob3Jpem9udGFsIHN3aXBlXG5cdFx0dmFyIG1heF94ID0gMzA7IC8vbWF4IHggZGlmZmVyZW5jZSBmb3IgdmVydGljYWwgc3dpcGVcblx0XHR2YXIgbWluX3kgPSA1MDsgLy9taW4geSBzd2lwZSBmb3IgdmVydGljYWwgc3dpcGVcblx0XHR2YXIgbWF4X3kgPSA2MDsgLy9tYXggeSBkaWZmZXJlbmNlIGZvciBob3Jpem9udGFsIHN3aXBlXG5cdFx0dmFyIGRpcmVjID0gXCJcIjtcblx0XHR2YXIgZWxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWwpO1xuXHRcdGVsZS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgZnVuY3Rpb24gKGUpIHtcblx0XHRcdHZhciB0ID0gZS50b3VjaGVzWzBdO1xuXHRcdFx0c3dpcGVfZGV0LnNYID0gdC5zY3JlZW5YO1xuXHRcdFx0c3dpcGVfZGV0LnNZID0gdC5zY3JlZW5ZO1xuXHRcdH0sIGZhbHNlKTtcblx0XHRlbGUuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgZnVuY3Rpb24gKGUpIHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdHZhciB0ID0gZS50b3VjaGVzWzBdO1xuXHRcdFx0c3dpcGVfZGV0LmVYID0gdC5zY3JlZW5YO1xuXHRcdFx0c3dpcGVfZGV0LmVZID0gdC5zY3JlZW5ZO1xuXHRcdH0sIGZhbHNlKTtcblx0XHRlbGUuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0Ly9ob3Jpem9udGFsIGRldGVjdGlvblxuXHRcdFx0aWYgKChzd2lwZV9kZXQuZVggLSBtaW5feCA+IHN3aXBlX2RldC5zWCB8fCBzd2lwZV9kZXQuZVggKyBtaW5feCA8IHN3aXBlX2RldC5zWCkgJiYgc3dpcGVfZGV0LmVZIDwgc3dpcGVfZGV0LnNZICsgbWF4X3kgJiYgc3dpcGVfZGV0LnNZID4gc3dpcGVfZGV0LmVZIC0gbWF4X3kgJiYgc3dpcGVfZGV0LmVYID4gMCkge1xuXHRcdFx0XHRpZiAoc3dpcGVfZGV0LmVYID4gc3dpcGVfZGV0LnNYKSBkaXJlYyA9IFwiclwiO2Vsc2UgZGlyZWMgPSBcImxcIjtcblx0XHRcdH1cblx0XHRcdC8vdmVydGljYWwgZGV0ZWN0aW9uXG5cdFx0XHRlbHNlIGlmICgoc3dpcGVfZGV0LmVZIC0gbWluX3kgPiBzd2lwZV9kZXQuc1kgfHwgc3dpcGVfZGV0LmVZICsgbWluX3kgPCBzd2lwZV9kZXQuc1kpICYmIHN3aXBlX2RldC5lWCA8IHN3aXBlX2RldC5zWCArIG1heF94ICYmIHN3aXBlX2RldC5zWCA+IHN3aXBlX2RldC5lWCAtIG1heF94ICYmIHN3aXBlX2RldC5lWSA+IDApIHtcblx0XHRcdFx0XHRpZiAoc3dpcGVfZGV0LmVZID4gc3dpcGVfZGV0LnNZKSBkaXJlYyA9IFwiZFwiO2Vsc2UgZGlyZWMgPSBcInVcIjtcblx0XHRcdFx0fVxuXG5cdFx0XHRpZiAoZGlyZWMgIT0gXCJcIikge1xuXHRcdFx0XHRpZiAodHlwZW9mIGZ1bmMgPT0gJ2Z1bmN0aW9uJykgZnVuYyhlbCwgZGlyZWMpO1xuXHRcdFx0fVxuXHRcdFx0dmFyIGRpcmVjID0gXCJcIjtcblx0XHRcdHN3aXBlX2RldC5zWCA9IDA7c3dpcGVfZGV0LnNZID0gMDtzd2lwZV9kZXQuZVggPSAwO3N3aXBlX2RldC5lWSA9IDA7XG5cdFx0fSwgZmFsc2UpO1xuXHR9XG5cblx0Ly8gQ0hPU0UgVEhFIE5FWFQgU0xJREUgVE8gU0hPVyBBTkQgQ0xJQ0sgVEhFIFBBR0lOQVRJT04gQlVUVE9OIFRIQVQgUkVMQVRFUyBUTyBJVC4gXFxcXFxuXG5cdHZhciBzd2lwZUNvbnRyb2xsZXIgPSBmdW5jdGlvbiBzd2lwZUNvbnRyb2xsZXIoZWwsIGQpIHtcblxuXHRcdGlmIChlbCA9PT0gJ3NlY3Rpb240Jykge1xuXG5cdFx0XHR2YXIgc2VjdGlvbjRQYWdpbmF0aW9uTGVuZ3RoID0gJCgnLnNlY3Rpb240UGFnaW5hdG9yQnV0dG9uJykubGVuZ3RoO1xuXG5cdFx0XHRpZiAoZCA9PT0gJ2wnKSB7XG5cblx0XHRcdFx0aWYgKHNlY3Rpb240SWR4IDwgc2VjdGlvbjRQYWdpbmF0aW9uTGVuZ3RoIC0gMSkge1xuXHRcdFx0XHRcdHNlY3Rpb240SWR4Kys7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0c2VjdGlvbjRJZHggPSAwO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0JCgnLnNlY3Rpb240UGFnaW5hdG9yQnV0dG9uJylbc2VjdGlvbjRJZHhdLmNsaWNrKCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoZCA9PT0gJ3InKSB7XG5cblx0XHRcdFx0aWYgKHNlY3Rpb240SWR4ID4gMCkge1xuXHRcdFx0XHRcdHNlY3Rpb240SWR4LS07XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0c2VjdGlvbjRJZHggPSBzZWN0aW9uNFBhZ2luYXRpb25MZW5ndGggLSAxO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0JCgnLnNlY3Rpb240UGFnaW5hdG9yQnV0dG9uJylbc2VjdGlvbjRJZHhdLmNsaWNrKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmIChlbCA9PT0gJ3NlY3Rpb24zJykge1xuXG5cdFx0XHR2YXIgc2VjdGlvbjNQYWdpbmF0aW9uTGVuZ3RoID0gJCgnLnNlY3Rpb24zUGFnaW5hdG9yQnV0dG9uJykubGVuZ3RoO1xuXG5cdFx0XHRpZiAoZCA9PT0gJ2wnKSB7XG5cblx0XHRcdFx0aWYgKHNlY3Rpb24zSWR4IDwgc2VjdGlvbjNQYWdpbmF0aW9uTGVuZ3RoIC0gMSkge1xuXHRcdFx0XHRcdHNlY3Rpb24zSWR4Kys7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0c2VjdGlvbjNJZHggPSAwO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0JCgnLnNlY3Rpb24zUGFnaW5hdG9yQnV0dG9uJylbc2VjdGlvbjNJZHhdLmNsaWNrKCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoZCA9PT0gJ3InKSB7XG5cblx0XHRcdFx0aWYgKHNlY3Rpb24zSWR4ID4gMCkge1xuXHRcdFx0XHRcdHNlY3Rpb24zSWR4LS07XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0c2VjdGlvbjNJZHggPSBzZWN0aW9uM1BhZ2luYXRpb25MZW5ndGggLSAxO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0JCgnLnNlY3Rpb24zUGFnaW5hdG9yQnV0dG9uJylbc2VjdGlvbjNJZHhdLmNsaWNrKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdC8vIElOSVRJQVRFIEZPUiBTV0lQRSBERVRFQ1RJT04gT04gU0VDVElPTlMgMyBBTkQgNCBFWENFUFQgSU4gQURNSU4gUFJFVklFVy4gXFxcXFxuXG5cdGlmICghJChsb2NhdGlvbikuYXR0cignaHJlZicpLmluY2x1ZGVzKCdpbmRleC5waHAnKSkge1xuXHRcdGRldGVjdHN3aXBlKCdzZWN0aW9uNCcsIHN3aXBlQ29udHJvbGxlcik7XG5cdFx0ZGV0ZWN0c3dpcGUoJ3NlY3Rpb24zJywgc3dpcGVDb250cm9sbGVyKTtcblx0fVxufSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbVpoYTJWZlpqSmpNVGd6T1RJdWFuTWlYU3dpYm1GdFpYTWlPbHNpZEdsdFpTSXNJbk5sWTNScGIyNHpTV1I0SWl3aWMyVmpkR2x2YmpSSlpIZ2lMQ0owWlc1dWFYTkJibWx0WVhScGIyNGlMQ0ptYjI5MFltRnNiRUZ1YVcxaGRHbHZiaUlzSW1KaGMydGxkR0poYkd4QmJtbHRZWFJwYjI0aUxDSmlZWE5sWW1Gc2JFRnVhVzFoZEdsdmJpSXNJbVpoYmtGdWFXMWhkR2x2YmlJc0ltMWhjM1JsY2s5aWFpSXNJbk5sWTNScGIyNHlRM1Z5Y21WdWRFbGtlQ0lzSW5ObFkzUnBiMjR4UTNWeWNtVnVkRWxrZUNJc0ltSmhjMnRsZEdKaGJHd2lMQ0pzYjI5d1FXMXZkVzUwSWl3aWJHOXZjRWxrSWl3aVptOXZkR0poYkd3aUxDSjBaVzV1YVhNaUxDSmlZWE5sWW1Gc2JDSXNJbVpoYmlJc0ltaHZiV1Z3WVdkbFRXOWlTVzFoWjJWeklpd2lKQ0lzSW1SdlkzVnRaVzUwSWl3aWNtVmhaSGtpTENKM2FXNWtiM2NpTENKcGJtNWxjbGRwWkhSb0lpd2labVYwWTJnaUxDSjBhR1Z1SWl3aWNtVnpjRzl1YzJVaUxDSnFjMjl1SWl3aWMzQnlhWFJsU25OdmJpSXNJa2xrYkdWR2NtRnRaU0lzSW1acGJIUmxja0o1Vm1Gc2RXVWlMQ0ptY21GdFpYTWlMQ0poYm1sdFlYUnBiMjVCY25KaGVTSXNJbUZ1YVcxaGRHOXlVMlYwZFhBaUxDSnBiV0ZuWlVOdmJuUnliMnhsY2lJc0luTmxkRWx1ZEdWeWRtRnNJaXdpWVhKeVlYa2lMQ0p6ZEhKcGJtY2lMQ0ptYVd4MFpYSWlMQ0p2SWl3aWRHOU1iM2RsY2tOaGMyVWlMQ0pwYm1Oc2RXUmxjeUlzSW14aGMzUlVhVzFsSWl3aWRtVnVaRzl5Y3lJc0luZ2lMQ0pzWlc1bmRHZ2lMQ0p5WlhGMVpYTjBRVzVwYldGMGFXOXVSbkpoYldVaUxDSmpZVzVqWld4QmJtbHRZWFJwYjI1R2NtRnRaU0lzSW1OaGJHeGlZV05ySWl3aVpXeGxiV1Z1ZENJc0ltTjFjbkpVYVcxbElpd2lSR0YwWlNJc0ltZGxkRlJwYldVaUxDSjBhVzFsVkc5RFlXeHNJaXdpVFdGMGFDSXNJbTFoZUNJc0ltbGtJaXdpYzJWMFZHbHRaVzkxZENJc0ltTnNaV0Z5VkdsdFpXOTFkQ0lzSW1GdWFXMWhkRzl5SWl3aVlXNXBiV0YwYVc5dVQySnFJaXdpWkdGdVkybHVaMGxqYjI0aUxDSnpjSEpwZEdWSmJXRm5aU0lzSW1OaGJuWmhjeUlzSW1kaGJXVk1iMjl3SWl3aVlXUmtRMnhoYzNNaUxDSjFjR1JoZEdVaUxDSnlaVzVrWlhJaUxDSnpjSEpwZEdVaUxDSnZjSFJwYjI1eklpd2lkR2hoZENJc0ltWnlZVzFsU1c1a1pYZ2lMQ0owYVdOclEyOTFiblFpTENKc2IyOXdRMjkxYm5RaUxDSjBhV05yYzFCbGNrWnlZVzFsSWl3aWJuVnRZbVZ5VDJaR2NtRnRaWE1pTENKamIyNTBaWGgwSWl3aWQybGtkR2dpTENKb1pXbG5hSFFpTENKcGJXRm5aU0lzSW14dmIzQnpJaXdpWTJ4bFlYSlNaV04wSWl3aVpISmhkMGx0WVdkbElpd2labkpoYldVaUxDSjVJaXdpWjJWMFJXeGxiV1Z1ZEVKNVNXUWlMQ0pKYldGblpTSXNJbWRsZEVOdmJuUmxlSFFpTENKaFpHUkZkbVZ1ZEV4cGMzUmxibVZ5SWl3aWMzSmpJaXdpY0dGblpVeHZZV1JsY2lJc0ltbHVaR1Y0SWl3aWNtVnRiM1psUTJ4aGMzTWlMQ0ptYVc1a0lpd2laMlYwSWl3aVkyeHBZMnNpTENKcGJtbDBhV0ZzYVhwbFUyVmpkR2x2YmlJc0luTmxZM1JwYjI1T2RXMWlaWElpTENKcFpIZ2lMQ0p6YVdKc2FXNW5jeUlzSW0xaGNDSXNJbWw0SWl3aVpXeGxJaXdpWTNOeklpd2liM0JoWTJsMGVTSXNJbWxrZUU5aWFpSXNJbkpsYkdWMllXNTBRVzVwYldGMGFXOXVJaXdpYUdGdVpHeGxVR0Z1YVc1aGRHbHZia0oxZEhSdmJrTnNhV05ySWl3aVpTSXNJbkJoY25ObFNXNTBJaXdpZEdGeVoyVjBJaXdpWVhSMGNpSXNJbk5sWTNScGIyNUpaQ0lzSW1Oc2IzTmxjM1FpTENKeVpXeGxkbUZ1ZEVSaGRHRkJjbkpoZVNJc0ltOXVJaXdpWlhNaUxDSnNiMk5oZEdsdmJpSXNJbTl1WlhCaFoyVmZjMk55YjJ4c0lpd2ljMlZqZEdsdmJrTnZiblJoYVc1bGNpSXNJbVZoYzJsdVp5SXNJbUZ1YVcxaGRHbHZibFJwYldVaUxDSndZV2RwYm1GMGFXOXVJaXdpZFhCa1lYUmxWVkpNSWl3aVltVm1iM0psVFc5MlpTSXNJbUZtZEdWeVRXOTJaU0lzSW14dmIzQWlMQ0pyWlhsaWIyRnlaQ0lzSW5KbGMzQnZibk5wZG1WR1lXeHNZbUZqYXlJc0ltUnBjbVZqZEdsdmJpSXNJbTF2ZG1WVWJ5SXNJbU4xY25KbGJuUlRaV04wYVc5dUlpd2lhR0Z6UTJ4aGMzTWlMQ0p6WldOMGFXOXVJaXdpYjJabWMyVjBJaXdpZEc5d0lpd2liVzkyWlVSdmQyNGlMQ0pvYVdSbFRHOWhaR2x1WjBGdWFXMWhkR2x2YmlJc0luSmxZV1I1VTNSaGRHVWlMQ0p6WldOMGFXOXVNMEYxZEc5dFlYUmxaQ0lzSW1GMWRHOXRZWFJsVTJWamRHbHZiak1pTENKelpXTjBhVzl1TkVGMWRHOXRZWFJsWkNJc0ltRjFkRzl0WVhSbFUyVmpkR2x2YmpRaUxDSnBiblJsY25aaGJFMWhibUZuWlhJaUxDSm1iR0ZuSWl3aWMzZHBjR1ZEYjI1MGNtOXNiR1Z5SWl3aVkyeGxZWEpKYm5SbGNuWmhiQ0lzSW5Cc1lYa2lMQ0owYVcxbGIzVjBJaXdpY0dGMWMyVWlMQ0pwYm01bGNraGxhV2RvZENJc0ltMWhkR05vVFdWa2FXRWlMQ0p0WVhSamFHVnpJaXdpY0dGblpVbGtlQ0lzSW1KMWNtZGxjaUlzSW1Oc1lYTnpUR2x6ZENJc0ltTnZiblJoYVc1eklpd2libUYySWl3aWNtVnRiM1psSWl3aVltOWtlU0lzSW5OMGVXeGxJaXdpY0c5emFYUnBiMjRpTENKemRHOXdVSEp2Y0dGbllYUnBiMjRpTENKdVlYWkRiMjUwY205c0lpd2lZV1JrSWl3aVpHVjBaV04wYzNkcGNHVWlMQ0psYkNJc0ltWjFibU1pTENKemQybHdaVjlrWlhRaUxDSnpXQ0lzSW5OWklpd2laVmdpTENKbFdTSXNJbTFwYmw5NElpd2liV0Y0WDNnaUxDSnRhVzVmZVNJc0ltMWhlRjk1SWl3aVpHbHlaV01pTENKMElpd2lkRzkxWTJobGN5SXNJbk5qY21WbGJsZ2lMQ0p6WTNKbFpXNVpJaXdpY0hKbGRtVnVkRVJsWm1GMWJIUWlMQ0prSWl3aWMyVmpkR2x2YmpSUVlXZHBibUYwYVc5dVRHVnVaM1JvSWl3aWMyVmpkR2x2YmpOUVlXZHBibUYwYVc5dVRHVnVaM1JvSWwwc0ltMWhjSEJwYm1keklqb2lPenM3TzBGQlFVRXNTVUZCVFVFc1QwRkJUeXhIUVVGaU8wRkJRMEVzU1VGQlNVTXNZMEZCWXl4RFFVRnNRanRCUVVOQkxFbEJRVWxETEdOQlFXTXNRMEZCYkVJN08wRkJSVUU3UVVGRFFTeEpRVUZKUXl4M1FrRkJTanRCUVVGQkxFbEJRWEZDUXl3d1FrRkJja0k3UVVGQlFTeEpRVUYzUTBNc05FSkJRWGhETzBGQlFVRXNTVUZCTmtSRExEQkNRVUUzUkR0QlFVRkJMRWxCUVdkR1F5eHhRa0ZCYUVZN08wRkJSVUVzU1VGQlRVTXNXVUZCV1R0QlFVTnFRa01zY1VKQlFXOUNMRU5CUkVnN1FVRkZha0pETEhGQ1FVRnZRaXhEUVVaSU8wRkJSMnBDUXl4aFFVRlpMRVZCUVVORExGbEJRVmtzUTBGQllpeEZRVUZuUWtNc1VVRkJVVklzYlVKQlFYaENMRVZCU0VzN1FVRkpha0pUTEZkQlFWVXNSVUZCUTBZc1dVRkJXU3hEUVVGaUxFVkJRV2RDUXl4UlFVRlJWQ3hwUWtGQmVFSXNSVUZLVHp0QlFVdHFRbGNzVTBGQlVTeEZRVUZEU0N4WlFVRlpMRU5CUVdJc1JVRkJaMEpETEZGQlFWRldMR1ZCUVhoQ0xFVkJURk03UVVGTmFrSmhMRmRCUVZVc1JVRkJRMG9zV1VGQldTeERRVUZpTEVWQlFXZENReXhSUVVGUlVDeHBRa0ZCZUVJc1JVRk9UenRCUVU5cVFsY3NUVUZCU3l4RlFVRkRUQ3haUVVGWkxFTkJRV0lzUlVGQlowSkRMRkZCUVZGT0xGbEJRWGhDTzBGQlVGa3NRMEZCYkVJN1FVRlRRU3hKUVVGTlZ5eHZRa0ZCYjBJc1EwRkRla0lzTUVOQlJIbENMRVZCUlhwQ0xIZERRVVo1UWl4RlFVZDZRaXh6UTBGSWVVSXNSVUZKZWtJc2QwTkJTbmxDTEVWQlMzcENMRzFEUVV4NVFpeERRVUV4UWpzN1FVRlJRVU1zUlVGQlJVTXNVVUZCUml4RlFVRlpReXhMUVVGYUxFTkJRV3RDTEZsQlFVMDdRVUZEZUVJN08wRkJSVU1zUzBGQlIwTXNUMEZCVDBNc1ZVRkJVQ3hIUVVGdlFpeEhRVUYyUWl4RlFVRTBRanM3UVVGRk0wSkRMRkZCUVUwc2RVTkJRVTRzUlVGQkswTkRMRWxCUVM5RExFTkJRVzlFTEZWQlFWTkRMRkZCUVZRc1JVRkJiVUk3UVVGRGRFVXNWVUZCVDBFc1UwRkJVME1zU1VGQlZDeEZRVUZRTzBGQlEwRXNSMEZHUkN4RlFVVkhSaXhKUVVaSUxFTkJSVkVzVlVGQlUwY3NWVUZCVkN4RlFVRnhRanRCUVVNMVFpeFBRVUZOUXl4WlFVRlpReXhqUVVGalJpeFhRVUZYUnl4TlFVRjZRaXhGUVVGcFF5eE5RVUZxUXl4RFFVRnNRanRCUVVOQmRrSXNZVUZCVlUwc1VVRkJWaXhEUVVGdFFtdENMR05CUVc1Q0xHZERRVUYzUTBnc1UwRkJlRU1zYzBKQlFYTkVReXhqUVVGalJpeFhRVUZYUnl4TlFVRjZRaXhGUVVGcFF5eFZRVUZxUXl4RFFVRjBSRHRCUVVOQmRrSXNZVUZCVlU4c1RVRkJWaXhEUVVGcFFtbENMR05CUVdwQ0xHZERRVUZ6UTBnc1UwRkJkRU1zYzBKQlFXOUVReXhqUVVGalJpeFhRVUZYUnl4TlFVRjZRaXhGUVVGcFF5eFJRVUZxUXl4RFFVRndSRHRCUVVOQmRrSXNZVUZCVlZFc1VVRkJWaXhEUVVGdFFtZENMR05CUVc1Q0xHZERRVUYzUTBnc1UwRkJlRU1zYzBKQlFYTkVReXhqUVVGalJpeFhRVUZYUnl4TlFVRjZRaXhGUVVGcFF5eFZRVUZxUXl4RFFVRjBSRHRCUVVOQmRrSXNZVUZCVlVjc1ZVRkJWaXhEUVVGeFFuRkNMR05CUVhKQ0xHZERRVUV3UTBnc1UwRkJNVU1zYzBKQlFYZEVReXhqUVVGalJpeFhRVUZYUnl4TlFVRjZRaXhGUVVGcFF5eFJRVUZxUXl4RFFVRjRSRHRCUVVOQmRrSXNZVUZCVlZNc1IwRkJWaXhEUVVGalpTeGpRVUZrTEdkRFFVRnRRMGdzVTBGQmJrTXNjMEpCUVdsRVF5eGpRVUZqUml4WFFVRlhSeXhOUVVGNlFpeEZRVUZwUXl4TFFVRnFReXhEUVVGcVJEczdRVUZGUVVVN1FVRkRRVU1zYTBKQlFXVXhRaXhUUVVGbUxFVkJRVEJDTEVOQlFURkNPenRCUVVWQk1rSXNaVUZCV1N4WlFVRk5PMEZCUTJwQ1JDeHRRa0ZCWlRGQ0xGTkJRV1lzUlVGQk1FSXNRMEZCTVVJN1FVRkRRU3hKUVVaRUxFVkJSVWNzU1VGR1NEdEJRVWRCTEVkQmFFSkVPMEZCYVVKQk96dEJRVVZFTEV0QlFVMXpRaXhuUWtGQlowSXNVMEZCYUVKQkxHRkJRV2RDTEVOQlFVTk5MRXRCUVVRc1JVRkJVVU1zVFVGQlVpeEZRVUZ0UWp0QlFVTjBReXhUUVVGUFJDeE5RVUZOUlN4TlFVRk9MRU5CUVdFN1FVRkJRU3hWUVVGTExFOUJRVTlETEVWQlFVVXNWVUZCUml4RFFVRlFMRXRCUVhsQ0xGRkJRWHBDTEVsQlFYRkRRU3hGUVVGRkxGVkJRVVlzUlVGQlkwTXNWMEZCWkN4SFFVRTBRa01zVVVGQk5VSXNRMEZCY1VOS0xFOUJRVTlITEZkQlFWQXNSVUZCY2tNc1EwRkJNVU03UVVGQlFTeEhRVUZpTEVOQlFWQTdRVUZEUml4RlFVWkVPenRCUVVsQkxFdEJRVTFRTEdkQ1FVRm5RaXhUUVVGb1FrRXNZVUZCWjBJc1IwRkJUVHM3UVVGRmVrSXNUVUZCU1ZNc1YwRkJWeXhEUVVGbU8wRkJRMEVzVFVGQlNVTXNWVUZCVlN4RFFVRkRMRWxCUVVRc1JVRkJUeXhMUVVGUUxFVkJRV01zVVVGQlpDeEZRVUYzUWl4SFFVRjRRaXhEUVVGa08wRkJRMEVzVDBGQlNTeEpRVUZKUXl4SlFVRkpMRU5CUVZvc1JVRkJaVUVzU1VGQlNVUXNVVUZCVVVVc1RVRkJXaXhKUVVGelFpeERRVUZEZGtJc1QwRkJUM2RDTEhGQ1FVRTNReXhGUVVGdlJTeEZRVUZGUml4RFFVRjBSU3hGUVVGNVJUdEJRVU55UlhSQ0xGVkJRVTkzUWl4eFFrRkJVQ3hIUVVFclFuaENMRTlCUVU5eFFpeFJRVUZSUXl4RFFVRlNMRWxCUVZjc2RVSkJRV3hDTEVOQlFTOUNPMEZCUTBGMFFpeFZRVUZQZVVJc2IwSkJRVkFzUjBGQk9FSjZRaXhQUVVGUGNVSXNVVUZCVVVNc1EwRkJVaXhKUVVGWExITkNRVUZzUWl4TFFVRTJRM1JDTEU5QlFVOXhRaXhSUVVGUlF5eERRVUZTTEVsQlFWY3NOa0pCUVd4Q0xFTkJRVE5GTzBGQlEwZzdPMEZCUlVRc1RVRkJTU3hEUVVGRGRFSXNUMEZCVDNkQ0xIRkNRVUZhTEVWQlEwbDRRaXhQUVVGUGQwSXNjVUpCUVZBc1IwRkJLMElzVlVGQlUwVXNVVUZCVkN4RlFVRnRRa01zVDBGQmJrSXNSVUZCTkVJN1FVRkRka1FzVDBGQlNVTXNWMEZCVnl4SlFVRkpReXhKUVVGS0xFZEJRVmRETEU5QlFWZ3NSVUZCWmp0QlFVTkJMRTlCUVVsRExHRkJRV0ZETEV0QlFVdERMRWRCUVV3c1EwRkJVeXhEUVVGVUxFVkJRVmtzVFVGQlRVd3NWMEZCVjFJc1VVRkJha0lzUTBGQldpeERRVUZxUWp0QlFVTkJMRTlCUVVsakxFdEJRVXRzUXl4UFFVRlBiVU1zVlVGQlVDeERRVUZyUWl4WlFVRlhPMEZCUVVWVUxHRkJRVk5GTEZkQlFWZEhMRlZCUVhCQ08wRkJRV3RETEVsQlFXcEZMRVZCUTFCQkxGVkJSRThzUTBGQlZEdEJRVVZCV0N4alFVRlhVU3hYUVVGWFJ5eFZRVUYwUWp0QlFVTkJMRlZCUVU5SExFVkJRVkE3UVVGRFNDeEhRVkJFT3p0QlFWTktMRTFCUVVrc1EwRkJRMnhETEU5QlFVOTVRaXh2UWtGQldpeEZRVU5KZWtJc1QwRkJUM2xDTEc5Q1FVRlFMRWRCUVRoQ0xGVkJRVk5UTEVWQlFWUXNSVUZCWVR0QlFVTjJRMFVzWjBKQlFXRkdMRVZCUVdJN1FVRkRTQ3hIUVVaRU8wRkJSMDRzUlVGMlFrUTdPMEZCZVVKQkxFdEJRVTFITEZkQlFWY3NVMEZCV0VFc1VVRkJWeXhEUVVGRFF5eFpRVUZFTEVWQlFXdENPenRCUVVWc1F5eE5RVUZKUXl4WFFVRktMRVZCUTBORExGZEJSRVFzUlVGRlEwTXNUVUZHUkRzN1FVRkpRU3hYUVVGVFF5eFJRVUZVTEVkQlFYRkNPMEZCUTNCQ04wTXNTMEZCUlN4VlFVRkdMRVZCUVdNNFF5eFJRVUZrTEVOQlFYVkNMRkZCUVhaQ08wRkJRME5NTEdkQ1FVRmhMME1zVFVGQllpeEhRVUZ6UWxNc1QwRkJUM2RDTEhGQ1FVRlFMRU5CUVRaQ2EwSXNVVUZCTjBJc1EwRkJkRUk3UVVGRFFVZ3NaVUZCV1Vzc1RVRkJXanRCUVVOQlRDeGxRVUZaVFN4TlFVRmFPMEZCUTBRN08wRkJSVVFzVjBGQlUwTXNUVUZCVkN4RFFVRnBRa01zVDBGQmFrSXNSVUZCTUVJN08wRkJSWHBDTEU5QlFVbERMRTlCUVU4c1JVRkJXRHRCUVVGQkxFOUJRME5ETEdGQlFXRXNRMEZFWkR0QlFVRkJMRTlCUlVORExGbEJRVmtzUTBGR1lqdEJRVUZCTEU5QlIwTkRMRmxCUVZrc1EwRklZanRCUVVGQkxFOUJTVU5ETEdkQ1FVRm5Ra3dzVVVGQlVVc3NZVUZCVWl4SlFVRjVRaXhEUVVveFF6dEJRVUZCTEU5QlMwTkRMR2xDUVVGcFFrNHNVVUZCVVUwc1kwRkJVaXhKUVVFd1FpeERRVXcxUXpzN1FVRlBRVXdzVVVGQlMwMHNUMEZCVEN4SFFVRmxVQ3hSUVVGUlR5eFBRVUYyUWp0QlFVTkJUaXhSUVVGTFR5eExRVUZNTEVkQlFXRlNMRkZCUVZGUkxFdEJRWEpDTzBGQlEwRlFMRkZCUVV0UkxFMUJRVXdzUjBGQlkxUXNVVUZCVVZNc1RVRkJkRUk3UVVGRFFWSXNVVUZCUzFNc1MwRkJUQ3hIUVVGaFZpeFJRVUZSVlN4TFFVRnlRanRCUVVOQlZDeFJRVUZMVlN4TFFVRk1MRWRCUVdGWUxGRkJRVkZYTEV0QlFYSkNPenRCUVVWQlZpeFJRVUZMU2l4TlFVRk1MRWRCUVdNc1dVRkJXVHM3UVVGRmNrSk5MR2xDUVVGaExFTkJRV0k3TzBGQlJVRXNVVUZCU1VFc1dVRkJXVVVzWVVGQmFFSXNSVUZCSzBJN08wRkJSV3hEUml4cFFrRkJXU3hEUVVGYU8wRkJRMHM3UVVGRFFTeFRRVUZKUkN4aFFVRmhTU3hwUWtGQmFVSXNRMEZCYkVNc1JVRkJjVU03UVVGRGNrTTdRVUZEUlVvc2IwSkJRV01zUTBGQlpEdEJRVU5FTEUxQlNFUXNUVUZIVHp0QlFVTlFSVHRCUVVORlJpeHRRa0ZCWVN4RFFVRmlPenRCUVVWQkxGVkJRVWRGTEdOQlFXTklMRXRCUVV0VkxFdEJRWFJDTEVWQlFUWkNPMEZCUXpWQ01VUXNZMEZCVDNsQ0xHOUNRVUZRTEVOQlFUUkNZU3hoUVVGaEwwTXNUVUZCZWtNN1FVRkRRVHRCUVVOR08wRkJRMGc3UVVGRFJpeEpRWEJDU0RzN1FVRnpRa0Y1UkN4UlFVRkxTQ3hOUVVGTUxFZEJRV01zV1VGQldUczdRVUZGZUVJN1FVRkRRVWNzVTBGQlMwMHNUMEZCVEN4RFFVRmhTeXhUUVVGaUxFTkJRWFZDTEVOQlFYWkNMRVZCUVRCQ0xFTkJRVEZDTEVWQlFUWkNXQ3hMUVVGTFR5eExRVUZzUXl4RlFVRjVRMUFzUzBGQlMxRXNUVUZCT1VNN08wRkJSVUZTTEZOQlFVdE5MRTlCUVV3c1EwRkJZVTBzVTBGQllpeERRVU5GV2l4TFFVRkxVeXhMUVVSUUxFVkJSVVZ1UWl4aFFVRmhOVUlzWTBGQllpeERRVUUwUW5WRExGVkJRVFZDTEVWQlFYZERXU3hMUVVGNFF5eERRVUU0UTNaRExFTkJSbWhFTEVWQlIwVm5RaXhoUVVGaE5VSXNZMEZCWWl4RFFVRTBRblZETEZWQlFUVkNMRVZCUVhkRFdTeExRVUY0UXl4RFFVRTRRME1zUTBGSWFFUXNSVUZKUlN4SFFVcEdMRVZCUzBVc1IwRk1SaXhGUVUxRkxFTkJUa1lzUlVGUFJTeERRVkJHTEVWQlVVVTVSQ3hQUVVGUFF5eFZRVUZRTEVkQlFXOUNMRXRCVW5SQ0xFVkJVMFZFTEU5QlFVOURMRlZCUVZBc1IwRkJiMElzUjBGVWRFSTdRVUZWUkN4SlFXWkVPenRCUVdsQ1FTeFZRVUZQSzBNc1NVRkJVRHRCUVVOQk96dEJRVVZFTzBGQlEwRlFMRmRCUVZNelF5eFRRVUZUYVVVc1kwRkJWQ3hEUVVGM1FpeFJRVUY0UWl4RFFVRlVPMEZCUTBGMFFpeFRRVUZQWXl4TFFVRlFMRWRCUVdWMlJDeFBRVUZQUXl4VlFVRlFMRWRCUVc5Q0xFdEJRVzVETzBGQlEwRjNReXhUUVVGUFpTeE5RVUZRTEVkQlFXZENlRVFzVDBGQlQwTXNWVUZCVUN4SFFVRnZRaXhIUVVGd1F6czdRVUZGUVR0QlFVTkJkVU1zWjBKQlFXTXNTVUZCU1hkQ0xFdEJRVW9zUlVGQlpEczdRVUZGUVR0QlFVTkJla0lzWjBKQlFXTlBMRTlCUVU4N1FVRkRjRUpSTEZsQlFWTmlMRTlCUVU5M1FpeFZRVUZRTEVOQlFXdENMRWxCUVd4Q0xFTkJSRmM3UVVGRmNFSldMRlZCUVU4c1NVRkdZVHRCUVVkd1FrTXNWMEZCVVN4SlFVaFpPMEZCU1hCQ1F5eFZRVUZQYWtJc1YwRktZVHRCUVV0d1FtRXNiVUpCUVdkQ1ppeGhRVUZoTlVJc1kwRkJZaXhEUVVFMFFtRXNUVUZNZUVJN1FVRk5jRUkyUWl4clFrRkJaU3hEUVU1TE8wRkJUM0JDVFN4VlFVRlBjRUlzWVVGQllXaEVPMEZCVUVFc1IwRkJVQ3hEUVVGa096dEJRVlZCTzBGQlEwRnJSQ3hqUVVGWk1FSXNaMEpCUVZvc1EwRkJOa0lzVFVGQk4wSXNSVUZCY1VONFFpeFJRVUZ5UXp0QlFVTkJSaXhqUVVGWk1rSXNSMEZCV2l4SFFVRnJRaXd3UTBGQmJFSTdRVUZEUVN4RlFUVkdSRHM3UVVFNFJrUTdPMEZCUlVNc1MwRkJUVU1zWVVGQllTeFRRVUZpUVN4VlFVRmhMRU5CUVVORExFdEJRVVFzUlVGQlZ6dEJRVU0zUWl4TlFVRkhRU3hWUVVGVkxFTkJRV0lzUlVGQlowSTdRVUZEWm5oRkxFdEJRVVVzVDBGQlJpeEZRVUZYZVVVc1YwRkJXQ3hEUVVGMVFpeFpRVUYyUWp0QlFVTkJla1VzUzBGQlJTeHZRa0ZCUml4RlFVRjNRbmxGTEZkQlFYaENMRU5CUVc5RExHbENRVUZ3UXp0QlFVTkJla1VzUzBGQlJTeFhRVUZHTEVWQlFXVXdSU3hKUVVGbUxFTkJRVzlDTEZWQlFYQkNMRVZCUVdkRE5VSXNVVUZCYUVNc1EwRkJlVU1zWVVGQmVrTTdRVUZEUVRsRExFdEJRVVVzWVVGQlJpeEZRVUZwUWpoRExGRkJRV3BDTEVOQlFUQkNMR2xDUVVFeFFqdEJRVU5CT1VNc1MwRkJSU3hoUVVGR0xFVkJRV2xDTUVVc1NVRkJha0lzUTBGQmMwSXNUMEZCZEVJc1JVRkJLMEkxUWl4UlFVRXZRaXhEUVVGM1F5eFpRVUY0UXp0QlFVTkJPVU1zUzBGQlJTeFhRVUZHTEVWQlFXVXdSU3hKUVVGbUxFTkJRVzlDTEdOQlFYQkNMRVZCUVc5RE5VSXNVVUZCY0VNc1EwRkJOa01zVFVGQk4wTTdRVUZEUVZJc1kwRkJWeXhaUVVGTk8wRkJRMmhDZEVNc1RVRkJSU3cwUWtGQlJpeEZRVUZuUXpCRkxFbEJRV2hETEVOQlFYRkRMRlZCUVhKRExFVkJRV2xFTlVJc1VVRkJha1FzUTBGQk1FUXNVVUZCTVVRN1FVRkRRU3hKUVVaRUxFVkJSVWNzU1VGR1NEdEJRVWRCTEVkQlZrUXNUVUZYU3p0QlFVTktPVU1zUzBGQlJTeFBRVUZHTEVWQlFWZDVSU3hYUVVGWUxFTkJRWFZDTEZsQlFYWkNPMEZCUTBGNlJTeExRVUZGTEdGQlFVWXNSVUZCYVVKNVJTeFhRVUZxUWl4RFFVRTJRaXhwUWtGQk4wSTdRVUZEUVhwRkxIbERRVUZ2UTNkRkxFdEJRWEJETEd0Q1FVRjNSRU1zVjBGQmVFUXNRMEZCYjBVc2FVSkJRWEJGTzBGQlEwRjZSU3gzUWtGQmNVSXdSU3hKUVVGeVFpeDFRa0ZCWjBRMVFpeFJRVUZvUkN4RFFVRjVSQ3hwUWtGQmVrUTdRVUZEUVRsRExIVkNRVUZ2UWpCRkxFbEJRWEJDTEVOQlFYbENMRTlCUVhwQ0xFVkJRV3RETlVJc1VVRkJiRU1zUTBGQk1rTXNXVUZCTTBNN08wRkJSVUVzVDBGQlJ6bERMR1ZCUVdGM1JTeExRVUZpTEhOQ1FVRnhRemxETEUxQlFYSkRMRWxCUVN0RE1VSXNaVUZCWVhkRkxFdEJRV0lzTmtKQlFUUkRPVU1zVFVGQk5VTXNSMEZCY1VRc1EwRkJka2NzUlVGQk1FYzdRVUZEZWtjeFFpeHRRa0ZCWVhkRkxFdEJRV0lzYzBKQlFYRkRSeXhIUVVGeVF5eERRVUY1UXl4RFFVRjZReXhGUVVFMFEwTXNTMEZCTlVNN1FVRkRRVHRCUVVORU8wRkJRMFFzUlVGMlFrUTdPMEZCZVVKRU96dEJRVVZETEV0QlFVMURMRzlDUVVGdlFpeFRRVUZ3UWtFc2FVSkJRVzlDTEVOQlFVTkRMR0ZCUVVRc1JVRkJaMEpETEVkQlFXaENMRVZCUVhkQ08wRkJRMnBFTDBVc2FVSkJRV0U0UlN4aFFVRmlMR3RDUVVGMVEwTXNSMEZCZGtNc1JVRkJPRU5ETEZGQlFUbERMRU5CUVhWRUxHOUNRVUYyUkN4RlFVRTJSVU1zUjBGQk4wVXNRMEZCYVVZc1ZVRkJRME1zUlVGQlJDeEZRVUZMUXl4SFFVRk1MRVZCUVdFN1FVRkROMFp1Uml4TFFVRkZiVVlzUjBGQlJpeEZRVUZQUXl4SFFVRlFMRU5CUVZjc1JVRkJRME1zVTBGQlV5eERRVUZXTEVWQlFWZzdRVUZEUVN4SFFVWkVPenRCUVVsQmNrWXNhVUpCUVdFNFJTeGhRVUZpTEd0Q1FVRjFRME1zUjBGQmRrTXNSVUZCT0VOTExFZEJRVGxETEVOQlFXdEVPMEZCUTJwRUxHZENRVUZoTEZsQlJHOURPMEZCUldwRUxHTkJRVmM3UVVGR2MwTXNSMEZCYkVRN1FVRkpRU3hGUVZSRU96dEJRVmRFTzBGQlEwTlFMRzFDUVVGclFpeERRVUZzUWl4RlFVRnhRaXhEUVVGeVFqdEJRVU5CUVN4dFFrRkJhMElzUTBGQmJFSXNSVUZCY1VJc1EwRkJja0k3UVVGRFFVRXNiVUpCUVd0Q0xFTkJRV3hDTEVWQlFYRkNMRU5CUVhKQ096dEJRVVZFT3p0QlFVVkRMRXRCUVUwNVJDeHBRa0ZCYVVJc1UwRkJha0pCTEdOQlFXbENMRU5CUVVOMVJTeE5RVUZFTEVWQlFWTlNMR0ZCUVZRc1JVRkJNa0k3UVVGRGFrUXNUVUZCU1ZNc01FSkJRVW83TzBGQlJVRXNUVUZCUjFRc2EwSkJRV3RDTEVOQlFYSkNMRVZCUVhkQ08wRkJRM1pDTEZkQlFVOVJMRTlCUVU4dlJpeHJRa0ZCWkR0QlFVTkRMRk5CUVVzc1EwRkJURHRCUVVORFowY3NlVUpCUVc5Q2JFY3NWVUZCVlVjc1ZVRkJPVUk3UVVGRFJEdEJRVU5CTEZOQlFVc3NRMEZCVER0QlFVTkRLMFlzZVVKQlFXOUNiRWNzVlVGQlZVMHNVVUZCT1VJN1FVRkRSRHRCUVVOQkxGTkJRVXNzUTBGQlREdEJRVU5ETkVZc2VVSkJRVzlDYkVjc1ZVRkJWVThzVFVGQk9VSTdRVUZEUkR0QlFVTkJMRk5CUVVzc1EwRkJURHRCUVVORE1rWXNlVUpCUVc5Q2JFY3NWVUZCVlZFc1VVRkJPVUk3UVVGRFJEdEJRVU5CTEZOQlFVc3NRMEZCVER0QlFVTkRNRVlzZVVKQlFXOUNiRWNzVlVGQlZWTXNSMEZCT1VJN1FVRkRSRHRCUVdaRU8wRkJhVUpCT3p0QlFVVkVSU3hwUWtGQllUaEZMR0ZCUVdJc1JVRkJPRUpLTEVsQlFUbENMRU5CUVcxRExFOUJRVzVETEVWQlFUUkRSQ3hYUVVFMVF5eERRVUYzUkN4WlFVRjRSRHRCUVVOQmVrVXNhVUpCUVdFNFJTeGhRVUZpTEd0Q1FVRjFRMUVzYlVKQlFXbENVaXhoUVVGcVFpeG5Ra0ZCZGtNc1JVRkJjMFpNTEZkQlFYUkdMRU5CUVd0SExHbENRVUZzUnp0QlFVTkJTU3h2UWtGQmEwSkRMR0ZCUVd4Q0xFVkJRV2xEVVN4dFFrRkJhVUpTTEdGQlFXcENMR2RDUVVGcVF6czdRVUZGUVhoRExHRkJRVmNzV1VGQlRUdEJRVU5vUWl4UFFVRkhkME1zYTBKQlFXdENMRU5CUVhKQ0xFVkJRWGRDTzBGQlEzWkNkRU1zWVVGQlV5dERMR2xDUVVGVU8wRkJRMEU3TzBGQlJVUjJSaXhyUWtGQllUaEZMR0ZCUVdJc1JVRkJPRUpLTEVsQlFUbENMSFZDUVVGNVJEVkNMRkZCUVhwRUxFTkJRV3RGTEdsQ1FVRnNSVHRCUVVOQk9VTXNhMEpCUVdFNFJTeGhRVUZpTEVWQlFUaENTaXhKUVVFNVFpeERRVUZ0UXl4UFFVRnVReXhGUVVFMFF6VkNMRkZCUVRWRExFTkJRWEZFTEZsQlFYSkVPMEZCUTBFc1IwRlFSQ3hGUVU5SExFZEJVRWc3TzBGQlUwRXNUVUZCUjNkRExHMUNRVUZwUWxJc1lVRkJha0lzY1VKQlFXZEVPVVVzWlVGQllUaEZMR0ZCUVdJc1JVRkJPRUpLTEVsQlFUbENMSFZDUVVGNVJHaEVMRTFCUVhwRUxFZEJRV3RGTEVOQlFYSklMRVZCUVhkSU8wRkJRM1pJTkVRc2MwSkJRV2xDVWl4aFFVRnFRaXh0UWtGQk9FTXNRMEZCT1VNN1FVRkRRU3hIUVVaRUxFMUJSVTg3UVVGRFRsRXNjMEpCUVdsQ1VpeGhRVUZxUWl4dlFrRkJLME1zUTBGQkwwTTdRVUZEUVR0QlFVTkVMRVZCZWtORU96dEJRVEpEUVM5RUxHZENRVUZsTVVJc1UwRkJaaXhGUVVFd1FpeERRVUV4UWpzN1FVRkZRVEpDTEdGQlFWa3NXVUZCVFR0QlFVTnFRa1FzYVVKQlFXVXhRaXhUUVVGbUxFVkJRVEJDTEVOQlFURkNPMEZCUTBFc1JVRkdSQ3hGUVVWSExFdEJSa2c3TzBGQlNVUTdPMEZCUlVNc1MwRkJUVzFITERoQ1FVRTRRaXhUUVVFNVFrRXNNa0pCUVRoQ0xFTkJRVU5ETEVOQlFVUXNSVUZCVHpzN1FVRkZNVU1zVFVGQlRWWXNUVUZCVFZjc1UwRkJVekZHTEVWQlFVVjVSaXhGUVVGRlJTeE5RVUZLTEVWQlFWbERMRWxCUVZvc1EwRkJhVUlzV1VGQmFrSXNRMEZCVkN4RFFVRmFPMEZCUTBFc1RVRkJUVU1zV1VGQldUZEdMRVZCUVVWNVJpeEZRVUZGUlN4TlFVRktMRVZCUVZsSExFOUJRVm9zUTBGQmIwSXNVMEZCY0VJc1JVRkJLMEpHTEVsQlFTOUNMRU5CUVc5RExFbEJRWEJETEVOQlFXeENPMEZCUTBFc1RVRkJTVWNzTUVKQlFVbzdPMEZCUlVFc1RVRkJSMFlzWTBGQll5eFZRVUZxUWl4RlFVRTJRanRCUVVNMVFpOUhMR2xDUVVGamFVY3NSMEZCWkR0QlFVTkJPenRCUVVWRUxFMUJRVWRqTEdOQlFXTXNWVUZCYWtJc1JVRkJOa0k3UVVGRE5VSTVSeXhwUWtGQlkyZEhMRWRCUVdRN1FVRkRRVHM3UVVGRlJDOUZMRlZCUVUwMlJpeFRRVUZPTEVWQlFXMUNia0lzU1VGQmJrSXNRMEZCZDBJc1QwRkJlRUlzUlVGQmFVTkVMRmRCUVdwRExFTkJRVFpETEZsQlFUZERPMEZCUTBGNlJTeFZRVUZOTmtZc1UwRkJUaXhGUVVGdFFtNUNMRWxCUVc1Q0xFTkJRWGRDTEdOQlFYaENMRVZCUVhkRFJDeFhRVUY0UXl4RFFVRnZSQ3hOUVVGd1JEdEJRVU5CZWtVc1ZVRkJUVFpHTEZOQlFVNHNSVUZCYlVKdVFpeEpRVUZ1UWl4clFrRkJkVU5MTEVkQlFYWkRMRVZCUVRoRGFrTXNVVUZCT1VNc1EwRkJkVVFzVFVGQmRrUTdRVUZEUVRsRExGVkJRVTAyUml4VFFVRk9MR3RDUVVFMFFtUXNSMEZCTlVJc1JVRkJiVU5PTEZkQlFXNURMRU5CUVN0RExHbENRVUV2UXp0QlFVTkJla1VzVlVGQlRUWkdMRk5CUVU0c2MwSkJRV3REY0VJc1YwRkJiRU1zUTBGQk9FTXNVVUZCT1VNN1FVRkRRWHBGTEVsQlFVVjVSaXhGUVVGRlJTeE5RVUZLTEVWQlFWazNReXhSUVVGYUxFTkJRWEZDTEZGQlFYSkNPenRCUVVWQkswSXNiMEpCUVd0Q1lTeFRRVUZUTVVZc1VVRkJUVFpHTEZOQlFVNHNSVUZCYlVKRUxFbEJRVzVDTEVOQlFYZENMRmxCUVhoQ0xFTkJRVlFzUTBGQmJFSXNSVUZCYlVWaUxFZEJRVzVGT3p0QlFVVkJla01zWVVGQlZ5eFpRVUZOTzBGQlEyaENhVU1zWTBGQlYyMUNMRk5CUVZNeFJpeFJRVUZOTmtZc1UwRkJUaXhGUVVGdFFrUXNTVUZCYmtJc1EwRkJkMElzV1VGQmVFSXNRMEZCVkN4RFFVRllPMEZCUTBFc1IwRkdSQ3hGUVVWSExFZEJSa2c3TzBGQlNVRXNUVUZCUjBNc1kwRkJZeXhWUVVGcVFpeEZRVUUwUWp0QlFVTXpRamRHTEZkQlFVMDJSaXhUUVVGT0xFVkJRVzFDYmtJc1NVRkJia0lzUTBGQmQwSXNZVUZCZUVJc1JVRkJkVU0xUWl4UlFVRjJReXhEUVVGblJDeFJRVUZvUkR0QlFVTkJPVU1zVjBGQlRUWkdMRk5CUVU0c1JVRkJiVUpITEVWQlFXNUNMRU5CUVhOQ0xHdEVRVUYwUWl4RlFVRXdSU3hWUVVGRFF5eEZRVUZFTEVWQlFWRTdRVUZETDBWcVJ5eFpRVUZOTmtZc1UwRkJUaXhGUVVGdFFtNUNMRWxCUVc1Q0xFTkJRWGRDTEdGQlFYaENMRVZCUVhWRFJDeFhRVUYyUXl4RFFVRnRSQ3hSUVVGdVJEdEJRVU5HTEVsQlJrUTdRVUZIUVR0QlFVTkVMRVZCYWtORU96dEJRVzFEUkRzN1FVRkZRM3BGTEVkQlFVVXNiMFJCUVVZc1JVRkJkMFEwUlN4TFFVRjRSQ3hEUVVFNFJDeFZRVUZEWVN4RFFVRkVMRVZCUVU4N1FVRkRjRVZFTERoQ1FVRTBRa01zUTBGQk5VSTdRVUZEUVN4RlFVWkVPenRCUVVsRU96dEJRVVZETEV0QlFVY3NRMEZCUTNwR0xFVkJRVVZyUnl4UlFVRkdMRVZCUVZsT0xFbEJRVm9zUTBGQmFVSXNUVUZCYWtJc1JVRkJlVUowUlN4UlFVRjZRaXhEUVVGclF5eFhRVUZzUXl4RFFVRktMRVZCUVc5RU8wRkJRMjVFZEVJc1NVRkJSU3hyUWtGQlJpeEZRVUZ6UW0xSExHTkJRWFJDTEVOQlFYRkRPMEZCUTNCRFF5eHhRa0ZCYTBJc1UwRkVhMEk3UVVGRmNFTkRMRmRCUVZFc1ZVRkdORUk3UVVGSGNFTkRMR3RDUVVGbGVrZ3NTVUZJY1VJN1FVRkpjRU13U0N4bFFVRlpMRWxCU25kQ08wRkJTM0JEUXl4alFVRlhMRWxCVEhsQ08wRkJUWEJEUXl4bFFVRlpMRzlDUVVGRGFrTXNTMEZCUkN4RlFVRlhMRU5CUVVVc1EwRk9WenRCUVU5d1EydERMR05CUVZjc2JVSkJRVU5zUXl4TFFVRkVMRVZCUVZjN1FVRkRla0k3TzBGQlJVbEVMR1ZCUVZkRExFdEJRVmc3UVVGRFFTeEpRVmh0UXp0QlFWbHdRMjFETEZOQlFVMHNTMEZhT0VJN1FVRmhjRU5ETEdGQlFWVXNTVUZpTUVJN1FVRmpjRU5ETEhWQ1FVRnZRaXhMUVdSblFqdEJRV1Z3UTBNc1kwRkJWenRCUVdaNVFpeEhRVUZ5UXpzN1FVRnJRa0U1Unl4SlFVRkZMR3RDUVVGR0xFVkJRWE5DSzBjc1RVRkJkRUlzUTBGQk5rSXNRMEZCTjBJN1FVRkRRVHM3UVVGRlJqczdRVUZGUXk5SExFZEJRVVVzV1VGQlJpeEZRVUZuUWpSRkxFdEJRV2hDTEVOQlFYTkNMRlZCUVVOaExFTkJRVVFzUlVGQlR6dEJRVU0xUWl4TlFVRkpkVUlzYVVKQlFXbENhRWdzUlVGQlJYbEdMRVZCUVVWRkxFMUJRVW9zUlVGQldVY3NUMEZCV2l4RFFVRnZRamxHTEVWQlFVVXNZVUZCUml4RFFVRndRaXhEUVVGeVFqczdRVUZGUVN4TlFVRkhaMGdzWlVGQlpVTXNVVUZCWml4RFFVRjNRaXhOUVVGNFFpeERRVUZJTEVWQlFXOURPMEZCUTI1RFJDeHJRa0ZCWlhaRExGZEJRV1lzUTBGQk1rSXNUVUZCTTBJN1FVRkRRWFZETEd0Q1FVRmxkRU1zU1VGQlppeERRVUZ2UWl4WlFVRndRaXhGUVVGclEwUXNWMEZCYkVNc1EwRkJPRU1zVVVGQk9VTTdRVUZEUVhWRExHdENRVUZsYUVNc1VVRkJaaXhEUVVGM1FpeGhRVUY0UWl4RlFVRjFRME1zUjBGQmRrTXNRMEZCTWtNc1ZVRkJRMFlzUjBGQlJDeEZRVUZOYlVNc1QwRkJUaXhGUVVGclFqdEJRVU0xUkd4SUxFMUJRVVZyU0N4UFFVRkdMRVZCUVZkNlF5eFhRVUZZTEVOQlFYVkNMRkZCUVhaQ08wRkJRMEY2UlN4TlFVRkZhMGdzVDBGQlJpeEZRVUZYZUVNc1NVRkJXQ3hEUVVGblFpeFBRVUZvUWl4RlFVRjVRa1FzVjBGQmVrSXNRMEZCY1VNc1UwRkJja01zUlVGQlowUXpRaXhSUVVGb1JDeERRVUY1UkN4WlFVRjZSRHRCUVVOQkxFbEJTRVE3UVVGSlFTeEhRVkJFTEUxQlQwODdRVUZEVG10RkxHdENRVUZsZGtNc1YwRkJaaXhEUVVFeVFpeFJRVUV6UWl4RlFVRnhRek5DTEZGQlFYSkRMRU5CUVRoRExFMUJRVGxETzBGQlEwRnJSU3hyUWtGQlpXaENMRVZCUVdZc1EwRkJhMElzYTBSQlFXeENMRVZCUVhORkxGVkJRVU5ETEVWQlFVUXNSVUZCVVR0QlFVTXpSV3BITEUxQlFVVXNhMEpCUVVZc1JVRkJjMEl3UlN4SlFVRjBRaXhEUVVFeVFpeFpRVUV6UWl4RlFVRjVRelZDTEZGQlFYcERMRU5CUVd0RUxGRkJRV3hFTzBGQlEwWXNTVUZHUkR0QlFVZEJhMFVzYTBKQlFXVm9ReXhSUVVGbUxFTkJRWGRDTEdGQlFYaENMRVZCUVhWRFF5eEhRVUYyUXl4RFFVRXlReXhWUVVGRFJpeEhRVUZFTEVWQlFVMXRReXhQUVVGT0xFVkJRV3RDTzBGQlF6VkViRWdzVFVGQlJXdElMRTlCUVVZc1JVRkJWM3BETEZkQlFWZ3NRMEZCZFVJc1RVRkJka0lzUlVGQkswSXpRaXhSUVVFdlFpeERRVUYzUXl4UlFVRjRRenRCUVVOQk9VTXNUVUZCUld0SUxFOUJRVVlzUlVGQlYzaERMRWxCUVZnc1EwRkJaMElzVDBGQmFFSXNSVUZCZVVKRUxGZEJRWHBDTEVOQlFYRkRMRmxCUVhKRExFVkJRVzFFTTBJc1VVRkJia1FzUTBGQk5FUXNVMEZCTlVRN1FVRkRRVGxETEUxQlFVVnJTQ3hQUVVGR0xFVkJRVmQ0UXl4SlFVRllMRU5CUVdkQ0xGbEJRV2hDTEVWQlFUaENSQ3hYUVVFNVFpeERRVUV3UXl4UlFVRXhRenRCUVVOQkxFbEJTa1E3UVVGTFFUdEJRVU5FZFVNc2FVSkJRV1YwUXl4SlFVRm1MRU5CUVc5Q0xFOUJRWEJDTEVWQlFUWkNSQ3hYUVVFM1FpeERRVUY1UXl4VFFVRjZReXhGUVVGdlJETkNMRkZCUVhCRUxFTkJRVFpFTEZsQlFUZEVPMEZCUTBFc1JVRjBRa1E3TzBGQmQwSkVPenRCUVVWRE9VTXNSMEZCUlN4WlFVRkdMRVZCUVdkQ05FVXNTMEZCYUVJc1EwRkJjMElzV1VGQlRUdEJRVU16UWl4TlFVRkhOVVVzUlVGQlJVY3NUVUZCUml4RlFVRlZkMFFzVFVGQlZpeE5RVUZ6UWpORUxFVkJRVVVzVDBGQlJpeEZRVUZYTUVJc1RVRkJXQ3hIUVVGdlFpeERRVUV4UXl4TlFVRnBSQ3hEUVVGRk1VSXNSVUZCUlN4clFrRkJSaXhGUVVGelFtMUlMRTFCUVhSQ0xFZEJRU3RDUXl4SFFVRnlSaXhGUVVFd1JqdEJRVU40Um5CSUxFdEJRVVVzYTBKQlFVWXNSVUZCYzBJclJ5eE5RVUYwUWl4RFFVRTJRaXhEUVVFM1FqdEJRVU5FTEVkQlJrUXNUVUZGVHp0QlFVTk9MMGNzUzBGQlJTeHJRa0ZCUml4RlFVRnpRbkZJTEZGQlFYUkNPMEZCUTBFN1FVRkRSQ3hGUVU1RU96dEJRVkZFT3p0QlFVVkRMRXRCUVUxRExIVkNRVUYxUWl4VFFVRjJRa0VzYjBKQlFYVkNMRWRCUVUwN1FVRkRiRU1zVFVGQlIyNUlMRTlCUVU5RExGVkJRVkFzUjBGQmIwSXNSMEZCY0VJc1NVRkJNa0lzUTBGQlEwb3NSVUZCUlN4VlFVRkdMRVZCUVdOcFNDeFJRVUZrTEVOQlFYVkNMRkZCUVhaQ0xFTkJRUzlDTEVWQlFXbEZPenRCUVVWb1JTeFBRVUZIYWtnc1JVRkJSU3hSUVVGR0xFVkJRVmt5UlN4SFFVRmFMRU5CUVdkQ0xFTkJRV2hDTEVWQlFXMUNORU1zVlVGQmJrSXNTMEZCYTBNc1EwRkJja01zUlVGQmQwTTdRVUZEZGtOMlNDeE5RVUZGTEZWQlFVWXNSVUZCWXpoRExGRkJRV1FzUTBGQmRVSXNVVUZCZGtJN1FVRkRRVHRCUVVORU8wRkJRMFFzUlVGUVJEczdRVUZUUVN4TFFVRkpNRVVzTUVKQlFVbzdRVUZCUVN4TFFVRjFRa01zZVVKQlFYWkNPMEZCUVVFc1MwRkJlVU5ETERCQ1FVRjZRenRCUVVGQkxFdEJRVFJFUXl4NVFrRkJOVVE3UVVGRFJEczdRVUZGUXl4TFFVRk5ReXhyUWtGQmEwSXNVMEZCYkVKQkxHVkJRV3RDTEVOQlFVTkRMRWxCUVVRc1JVRkJUMmhETEZOQlFWQXNSVUZCYTBKb1NDeEpRVUZzUWl4RlFVRXlRanRCUVVOb1JDeE5RVUZIWjBvc1NVRkJTQ3hGUVVGVE8wRkJRMUlzVDBGQlIyaERMR05CUVdNc1ZVRkJha0lzUlVGQk5rSTdRVUZETlVJMFFpeDFRa0ZCYlVKNlJ5eFpRVUZaTEZsQlFVMDdRVUZEYmtNNFJ5eHhRa0ZCWjBKcVF5eFRRVUZvUWl4RlFVRXlRaXhIUVVFelFqdEJRVU5CTEV0QlJtbENMRVZCUldab1NDeEpRVVpsTEVOQlFXNUNPMEZCUjBFN1FVRkRSQ3hQUVVGSFowZ3NZMEZCWXl4VlFVRnFRaXhGUVVFMlFqdEJRVU0xUWpoQ0xIVkNRVUZ0UWpOSExGbEJRVmtzV1VGQlRUdEJRVU51UXpoSExIRkNRVUZuUW1wRExGTkJRV2hDTEVWQlFUSkNMRWRCUVROQ08wRkJRMEVzUzBGR2FVSXNSVUZGWm1oSUxFbEJSbVVzUTBGQmJrSTdRVUZIUVR0QlFVVkVMRWRCV2tRc1RVRlpUenRCUVVOT0xFOUJRVWRuU0N4alFVRmpMRlZCUVdwQ0xFVkJRVFpDTzBGQlF6VkNhME1zYTBKQlFXTk9MR2RDUVVGa08wRkJRMEU3UVVGRFJDeFBRVUZITlVJc1kwRkJZeXhWUVVGcVFpeEZRVUUyUWp0QlFVTTFRbXRETEd0Q1FVRmpTaXhuUWtGQlpEdEJRVU5CTzBGQlEwUTdRVUZEU0N4RlFYSkNSRHM3UVVGMVFrUTdPMEZCUlVNc1MwRkJSeXhEUVVGRE0wZ3NSVUZCUld0SExGRkJRVVlzUlVGQldVNHNTVUZCV2l4RFFVRnBRaXhOUVVGcVFpeEZRVUY1UW5SRkxGRkJRWHBDTEVOQlFXdERMRmRCUVd4RExFTkJRVW9zUlVGQmIwUTdRVUZEYmtST0xHTkJRVmtzV1VGQlRUdEJRVU5xUWl4UFFVRkhhRUlzUlVGQlJTeHJRa0ZCUml4RlFVRnpRbTFJTEUxQlFYUkNMRWRCUVN0Q1F5eEhRVUV2UWl4SlFVRnpReXhEUVVGNlF5eEZRVUUwUXp0QlFVTXpRM0JJTEUxQlFVVXNkVUpCUVVZc1JVRkJNa0k0UXl4UlFVRXpRaXhEUVVGdlF5eGxRVUZ3UXp0QlFVTkJPVU1zVFVGQlJTeFJRVUZHTEVWQlFWa3lSU3hIUVVGYUxFTkJRV2RDTEVOQlFXaENMRVZCUVcxQ2NVUXNTVUZCYmtJN1FVRkRRV2hKTEUxQlFVVXNVVUZCUml4RlFVRlpPRU1zVVVGQldpeERRVUZ4UWl4VFFVRnlRanRCUVVOQkxFbEJTa1FzVFVGSlR6dEJRVU5PTEZGQlFVbHRSaXhWUVVGVk0wWXNWMEZCVnl4WlFVRk5PMEZCUXpsQ2RFTXNUMEZCUlN4MVFrRkJSaXhGUVVFeVFubEZMRmRCUVROQ0xFTkJRWFZETEdWQlFYWkRPMEZCUTBGNlJTeFBRVUZGTEZGQlFVWXNSVUZCV1RKRkxFZEJRVm9zUTBGQlowSXNRMEZCYUVJc1JVRkJiVUoxUkN4TFFVRnVRanRCUVVOQmJFa3NUMEZCUlN4UlFVRkdMRVZCUVZsNVJTeFhRVUZhTEVOQlFYZENMRk5CUVhoQ08wRkJRMEZzUXl4clFrRkJZVEJHTEU5QlFXSTdRVUZEUVN4TFFVeGhMRVZCUzFod1NpeEpRVXhYTEVOQlFXUTdRVUZOUVRzN1FVRkZTanM3UVVGRlJ5eFBRVUZIYlVJc1JVRkJSU3hyUWtGQlJpeEZRVUZ6UW0xSUxFMUJRWFJDTEVkQlFTdENReXhIUVVFdlFpeEhRVUZ4UXl4RlFVRkhha2dzVDBGQlQyZEpMRmRCUVZBc1IwRkJjVUlzUTBGQmVFSXNRMEZCZUVNc1JVRkJiMFU3UVVGRGJrVnVTU3hOUVVGRkxGbEJRVVlzUlVGQlowSnZSaXhIUVVGb1FpeERRVUZ2UWl4RlFVRkRMR0ZCUVdFc2FVTkJRV1FzUlVGQmNFSTdRVUZEUVN4SlFVWkVMRTFCUlU4N1FVRkRUbkJHTEUxQlFVVXNXVUZCUml4RlFVRm5RbTlHTEVkQlFXaENMRU5CUVc5Q0xFVkJRVU1zWVVGQllTd3JRa0ZCWkN4RlFVRndRanRCUVVOQk96dEJRVVZFYTBNN08wRkJSVWc3TzBGQlJVY3NUMEZCUjI1SUxFOUJRVTlwU1N4VlFVRlFMRU5CUVd0Q0xEQkNRVUZzUWl4RlFVRTRRME1zVDBGQk9VTXNTVUZCZVVSc1NTeFBRVUZQUXl4VlFVRlFMRWRCUVc5Q0xFZEJRV2hHTEVWQlFYRkdPMEZCUTI1R1NpeE5RVUZGTERaRlFVRkdMRVZCUVdsR09FTXNVVUZCYWtZc1EwRkJNRVlzVjBGQk1VWTdRVUZEUkN4SlFVWkVMRTFCUlU4N1FVRkRURGxETEUxQlFVVXNOa1ZCUVVZc1JVRkJhVVo1UlN4WFFVRnFSaXhEUVVFMlJpeFhRVUUzUmp0QlFVTkVPenRCUVVWRUxFOUJRVWQ2UlN4RlFVRkZMR3RDUVVGR0xFVkJRWE5DTUVJc1RVRkJla0lzUlVGQmFVTTdRVUZCUlR0QlFVTnNReXhSUVVGSE9FWXNjMEpCUVhOQ0xFbEJRWHBDTEVWQlFTdENPMEZCUXpsQ1FTeDVRa0ZCYjBJc1NVRkJjRUk3UVVGRFFVa3NjVUpCUVdkQ0xFbEJRV2hDTEVWQlFYTkNMRlZCUVhSQ0xFVkJRV3RETEVsQlFXeERPMEZCUTBFN1FVRkRSQ3hKUVV4RUxFMUJTMDg3UVVGQlJUdEJRVU5TTEZGQlFVZEtMSE5DUVVGelFpeEpRVUY2UWl4RlFVRXJRanRCUVVNNVFra3NjVUpCUVdkQ0xFdEJRV2hDTEVWQlFYVkNMRlZCUVhaQ08wRkJRMEZLTEhsQ1FVRnZRaXhMUVVGd1FqdEJRVU5CTzBGQlEwUTdPMEZCUlVRc1QwRkJSM2hJTEVWQlFVVXNhMEpCUVVZc1JVRkJjMEl3UWl4TlFVRjZRaXhGUVVGcFF6dEJRVUZGTzBGQlEyeERMRkZCUVVkblJ5eHpRa0ZCYzBJc1NVRkJla0lzUlVGQkswSTdRVUZET1VKQkxIbENRVUZ2UWl4SlFVRndRanRCUVVOQlJTeHhRa0ZCWjBJc1NVRkJhRUlzUlVGQmMwSXNWVUZCZEVJc1JVRkJhME1zU1VGQmJFTTdRVUZEUVR0QlFVTkVMRWxCVEVRc1RVRkxUenRCUVVGRk8wRkJRMUlzVVVGQlIwWXNjMEpCUVhOQ0xFbEJRWHBDTEVWQlFTdENPMEZCUXpsQ1JTeHhRa0ZCWjBJc1MwRkJhRUlzUlVGQmRVSXNWVUZCZGtJN1FVRkRRVVlzZVVKQlFXOUNMRXRCUVhCQ08wRkJRMEU3UVVGRFJEdEJRVU5FTEVkQmRrUkVMRVZCZFVSSExFZEJka1JJTzBGQmQwUkJPenRCUVVWR096dEJRVVZETVVnc1IwRkJSU3hYUVVGR0xFVkJRV1UwUlN4TFFVRm1MRU5CUVhGQ0xGVkJRVU5oTEVOQlFVUXNSVUZCVHp0QlFVTXpRaXhOUVVGTk5rTXNWVUZCVlRWRExGTkJRVk14Uml4RlFVRkZlVVlzUlVGQlJVVXNUVUZCU2l4RlFVRlpReXhKUVVGYUxFTkJRV2xDTEZsQlFXcENMRU5CUVZRc1EwRkJhRUk3UVVGRFFUVkdMRWxCUVVVc2EwSkJRVVlzUlVGQmMwSXJSeXhOUVVGMFFpeERRVUUyUW5WQ0xFOUJRVGRDTzBGQlEwRjBTU3hKUVVGRkxHVkJRVVlzUlVGQmJVSTRReXhSUVVGdVFpeERRVUUwUWl4UlFVRTFRanM3UVVGRlFTeE5RVUZIZVVZc1QwRkJUME1zVTBGQlVDeERRVUZwUWtNc1VVRkJha0lzUTBGQk1FSXNaMEpCUVRGQ0xFTkJRVWdzUlVGQlowUTdRVUZETlVORExFOUJRVWxHTEZOQlFVb3NRMEZCWTBjc1RVRkJaQ3hEUVVGeFFpeFZRVUZ5UWp0QlFVTkJTaXhWUVVGUFF5eFRRVUZRTEVOQlFXbENSeXhOUVVGcVFpeERRVUYzUWl4blFrRkJlRUk3UVVGRFFURkpMRmxCUVZNeVNTeEpRVUZVTEVOQlFXTkRMRXRCUVdRc1EwRkJiMEpETEZGQlFYQkNMRWRCUVN0Q0xGVkJRUzlDTzBGQlEwUTdRVUZEU0N4RlFWWkVPenRCUVZsRU96dEJRVVZET1Vrc1IwRkJSU3hsUVVGR0xFVkJRVzFDTkVVc1MwRkJia0lzUTBGQmVVSXNWVUZCUTJFc1EwRkJSQ3hGUVVGUE8wRkJRemRDUVN4SlFVRkZjMFFzWlVGQlJqdEJRVU5HTEVWQlJrUTdPMEZCU1VFc1MwRkJTVklzVTBGQlUzUkpMRk5CUVZOcFJTeGpRVUZVTEVOQlFYZENMR0ZCUVhoQ0xFTkJRV0k3UVVGQlFTeExRVU5EZDBVc1RVRkJUWHBKTEZOQlFWTnBSU3hqUVVGVUxFTkJRWGRDTEZOQlFYaENMRU5CUkZBN08wRkJSMFE3TzBGQlJVVXNWVUZCVXpoRkxGVkJRVlFzUjBGQmMwSTdPMEZCUlhCQ0xFMUJRVWRVTEU5QlFVOURMRk5CUVZBc1EwRkJhVUpETEZGQlFXcENMRU5CUVRCQ0xHZENRVUV4UWl4RFFVRklMRVZCUVdkRU8wRkJRemxEUXl4UFFVRkpSaXhUUVVGS0xFTkJRV05ITEUxQlFXUXNRMEZCY1VJc1ZVRkJja0k3UVVGRFFVb3NWVUZCVDBNc1UwRkJVQ3hEUVVGcFFrY3NUVUZCYWtJc1EwRkJkMElzWjBKQlFYaENPMEZCUTBFelNTeExRVUZGTEdWQlFVWXNSVUZCYlVJNFF5eFJRVUZ1UWl4RFFVRTBRaXhSUVVFMVFqdEJRVU5FTEVkQlNrUXNUVUZMU3p0QlFVTkllVVlzVlVGQlQwTXNVMEZCVUN4RFFVRnBRbE1zUjBGQmFrSXNRMEZCY1VJc1owSkJRWEpDTzBGQlEwRlFMRTlCUVVsR0xGTkJRVW9zUTBGQlkxTXNSMEZCWkN4RFFVRnJRaXhWUVVGc1FqdEJRVU5CYWtvc1MwRkJSU3hsUVVGR0xFVkJRVzFDZVVVc1YwRkJia0lzUTBGQkswSXNVVUZCTDBJN1FVRkRSRHRCUVVOR096dEJRVVZJT3p0QlFVVkZMRXRCUVVjc1EwRkJRM3BGTEVWQlFVVnJSeXhSUVVGR0xFVkJRVmxPTEVsQlFWb3NRMEZCYVVJc1RVRkJha0lzUlVGQmVVSjBSU3hSUVVGNlFpeERRVUZyUXl4WFFVRnNReXhEUVVGS0xFVkJRVzlFTzBGQlEyNUVhVWdzVTBGQlQyeEZMR2RDUVVGUUxFTkJRWGRDTEU5QlFYaENMRVZCUVdsRE1rVXNWVUZCYWtNN1FVRkRRVHM3UVVGRlNEczdRVUZGUlRkSkxGRkJRVTlyUlN4blFrRkJVQ3hEUVVGM1FpeFJRVUY0UWl4RlFVRnJReXhaUVVGWE8wRkJRek5ETEUxQlFVZHNSU3hQUVVGUFF5eFZRVUZRTEVkQlFXOUNMRWxCUVhCQ0xFbEJRVFJDYzBrc1NVRkJTVVlzVTBGQlNpeERRVUZqUXl4UlFVRmtMRU5CUVhWQ0xGVkJRWFpDTEVOQlFTOUNMRVZCUVcxRk8wRkJRMnBGVHp0QlFVTkJUaXhQUVVGSlJpeFRRVUZLTEVOQlFXTkhMRTFCUVdRc1EwRkJjVUlzVlVGQmNrSTdRVUZEUXpOSkxFdEJRVVVzWlVGQlJpeEZRVUZ0UWpoRExGRkJRVzVDTEVOQlFUUkNMRkZCUVRWQ08wRkJRMFk3UVVGRFJpeEZRVTVFT3p0QlFWRkdPenRCUVVWRkxFdEJRVWM1UXl4RlFVRkZhMGNzVVVGQlJpeEZRVUZaVGl4SlFVRmFMRU5CUVdsQ0xFMUJRV3BDTEVWQlFYbENkRVVzVVVGQmVrSXNRMEZCYTBNc1YwRkJiRU1zUTBGQlNDeEZRVUZ0UkR0QlFVTnVSQ3hOUVVGSGRFSXNSVUZCUld0SExGRkJRVVlzUlVGQldVNHNTVUZCV2l4RFFVRnBRaXhOUVVGcVFpeEZRVUY1UW5SRkxGRkJRWHBDTEVOQlFXdERMRmxCUVd4RExFTkJRVWdzUlVGQmIwUTdRVUZEYmtScFJDeGpRVUZYTEVOQlFWZzdRVUZEUVR0QlFVTkVMRTFCUVVkMlJTeEZRVUZGYTBjc1VVRkJSaXhGUVVGWlRpeEpRVUZhTEVOQlFXbENMRTFCUVdwQ0xFVkJRWGxDZEVVc1VVRkJla0lzUTBGQmEwTXNhVUpCUVd4RExFTkJRVWdzUlVGQmVVUTdRVUZEZUVScFJDeGpRVUZYTEVOQlFWZzdRVUZEUVR0QlFVTkVMRTFCUVVkMlJTeEZRVUZGYTBjc1VVRkJSaXhGUVVGWlRpeEpRVUZhTEVOQlFXbENMRTFCUVdwQ0xFVkJRWGxDZEVVc1VVRkJla0lzUTBGQmEwTXNZMEZCYkVNc1EwRkJTQ3hGUVVGelJEdEJRVU55UkdsRUxHTkJRVmNzUTBGQldEdEJRVU5CTzBGQlEwUXNUVUZCUjNaRkxFVkJRVVZyUnl4UlFVRkdMRVZCUVZsT0xFbEJRVm9zUTBGQmFVSXNUVUZCYWtJc1JVRkJlVUowUlN4UlFVRjZRaXhEUVVGclF5eFpRVUZzUXl4RFFVRklMRVZCUVc5RU8wRkJRMjVFYVVRc1kwRkJWeXhEUVVGWU8wRkJRMEU3UVVGRFJDeE5RVUZIZGtVc1JVRkJSV3RITEZGQlFVWXNSVUZCV1U0c1NVRkJXaXhEUVVGcFFpeE5RVUZxUWl4RlFVRjVRblJGTEZGQlFYcENMRU5CUVd0RExGbEJRV3hETEVOQlFVZ3NSVUZCYjBRN1FVRkRia1JPTEdWQlFWa3NXVUZCVFR0QlFVTnFRbk5ITzBGQlEwRXNTVUZHUkN4RlFVVkhMRWRCUmtnN1FVRkhRVHRCUVVORU96dEJRVVZHT3p0QlFVVkZMRlZCUVZNMFFpeFhRVUZVTEVOQlFYRkNReXhGUVVGeVFpeEZRVUY1UWtNc1NVRkJla0lzUlVGQkswSTdRVUZET1VJc1RVRkJTVU1zV1VGQldTeEZRVUZvUWp0QlFVTkJRU3haUVVGVlF5eEZRVUZXTEVkQlFXVXNRMEZCWml4RFFVRnJRa1FzVlVGQlZVVXNSVUZCVml4SFFVRmxMRU5CUVdZc1EwRkJhMEpHTEZWQlFWVkhMRVZCUVZZc1IwRkJaU3hEUVVGbUxFTkJRV3RDU0N4VlFVRlZTU3hGUVVGV0xFZEJRV1VzUTBGQlpqdEJRVU4wUkN4TlFVRkpReXhSUVVGUkxFVkJRVm9zUTBGSU9FSXNRMEZIWWp0QlFVTnFRaXhOUVVGSlF5eFJRVUZSTEVWQlFWb3NRMEZLT0VJc1EwRkpZanRCUVVOcVFpeE5RVUZKUXl4UlFVRlJMRVZCUVZvc1EwRk1PRUlzUTBGTFlqdEJRVU5xUWl4TlFVRkpReXhSUVVGUkxFVkJRVm9zUTBGT09FSXNRMEZOWWp0QlFVTnFRaXhOUVVGSlF5eFJRVUZSTEVWQlFWbzdRVUZEUVN4TlFVRkpNMFVzVFVGQlRXeEdMRk5CUVZOcFJTeGpRVUZVTEVOQlFYZENhVVlzUlVGQmVFSXNRMEZCVmp0QlFVTkJhRVVzVFVGQlNXUXNaMEpCUVVvc1EwRkJjVUlzV1VGQmNrSXNSVUZCYTBNc1ZVRkJVMjlDTEVOQlFWUXNSVUZCVnp0QlFVTXpReXhQUVVGSmMwVXNTVUZCU1hSRkxFVkJRVVYxUlN4UFFVRkdMRU5CUVZVc1EwRkJWaXhEUVVGU08wRkJRMEZZTEdGQlFWVkRMRVZCUVZZc1IwRkJaVk1zUlVGQlJVVXNUMEZCYWtJN1FVRkRRVm9zWVVGQlZVVXNSVUZCVml4SFFVRmxVU3hGUVVGRlJ5eFBRVUZxUWp0QlFVTkVMRWRCU2tRc1JVRkpSU3hMUVVwR08wRkJTMEV2UlN4TlFVRkpaQ3huUWtGQlNpeERRVUZ4UWl4WFFVRnlRaXhGUVVGcFF5eFZRVUZUYjBJc1EwRkJWQ3hGUVVGWE8wRkJRekZEUVN4TFFVRkZNRVVzWTBGQlJqdEJRVU5CTEU5QlFVbEtMRWxCUVVsMFJTeEZRVUZGZFVVc1QwRkJSaXhEUVVGVkxFTkJRVllzUTBGQlVqdEJRVU5CV0N4aFFVRlZSeXhGUVVGV0xFZEJRV1ZQTEVWQlFVVkZMRTlCUVdwQ08wRkJRMEZhTEdGQlFWVkpMRVZCUVZZc1IwRkJaVTBzUlVGQlJVY3NUMEZCYWtJN1FVRkRSQ3hIUVV4RUxFVkJTMFVzUzBGTVJqdEJRVTFCTDBVc1RVRkJTV1FzWjBKQlFVb3NRMEZCY1VJc1ZVRkJja0lzUlVGQlowTXNWVUZCVTI5Q0xFTkJRVlFzUlVGQlZ6dEJRVU42UXp0QlFVTkJMRTlCUVVzc1EwRkJSVFJFTEZWQlFWVkhMRVZCUVZZc1IwRkJaVVVzUzBGQlppeEhRVUYxUWt3c1ZVRkJWVU1zUlVGQmJFTXNTVUZCTUVORUxGVkJRVlZITEVWQlFWWXNSMEZCWlVVc1MwRkJaaXhIUVVGMVFrd3NWVUZCVlVNc1JVRkJOVVVzUzBGQmMwWkVMRlZCUVZWSkxFVkJRVllzUjBGQlpVb3NWVUZCVlVVc1JVRkJWaXhIUVVGbFRTeExRVUV2UWl4SlFVRXdRMUlzVlVGQlZVVXNSVUZCVml4SFFVRmxSaXhWUVVGVlNTeEZRVUZXTEVkQlFXVkpMRXRCUVhoRkxFbEJRVzFHVWl4VlFVRlZSeXhGUVVGV0xFZEJRV1VzUTBGQk5Vd3NSVUZCYTAwN1FVRkRhRTBzVVVGQlIwZ3NWVUZCVlVjc1JVRkJWaXhIUVVGbFNDeFZRVUZWUXl4RlFVRTFRaXhGUVVGblExRXNVVUZCVVN4SFFVRlNMRU5CUVdoRExFdEJRMHRCTEZGQlFWRXNSMEZCVWp0QlFVTk9PMEZCUTBRN1FVRktRU3hSUVV0TExFbEJRVXNzUTBGQlJWUXNWVUZCVlVrc1JVRkJWaXhIUVVGbFJ5eExRVUZtTEVkQlFYVkNVQ3hWUVVGVlJTeEZRVUZzUXl4SlFVRXdRMFlzVlVGQlZVa3NSVUZCVml4SFFVRmxSeXhMUVVGbUxFZEJRWFZDVUN4VlFVRlZSU3hGUVVFMVJTeExRVUZ6UmtZc1ZVRkJWVWNzUlVGQlZpeEhRVUZsU0N4VlFVRlZReXhGUVVGV0xFZEJRV1ZMTEV0QlFTOUNMRWxCUVRCRFRpeFZRVUZWUXl4RlFVRldMRWRCUVdWRUxGVkJRVlZITEVWQlFWWXNSMEZCWlVjc1MwRkJlRVVzU1VGQmJVWk9MRlZCUVZWSkxFVkJRVllzUjBGQlpTeERRVUUxVEN4RlFVRnJUVHRCUVVOeVRTeFRRVUZIU2l4VlFVRlZTU3hGUVVGV0xFZEJRV1ZLTEZWQlFWVkZMRVZCUVRWQ0xFVkJRV2REVHl4UlFVRlJMRWRCUVZJc1EwRkJhRU1zUzBGRFMwRXNVVUZCVVN4SFFVRlNPMEZCUTA0N08wRkJSVVFzVDBGQlNVRXNVMEZCVXl4RlFVRmlMRVZCUVdsQ08wRkJRMllzVVVGQlJ5eFBRVUZQVml4SlFVRlFMRWxCUVdVc1ZVRkJiRUlzUlVGQk9FSkJMRXRCUVV0RUxFVkJRVXdzUlVGQlVWY3NTMEZCVWp0QlFVTXZRanRCUVVORUxFOUJRVWxCTEZGQlFWRXNSVUZCV2p0QlFVTkJWQ3hoUVVGVlF5eEZRVUZXTEVkQlFXVXNRMEZCWml4RFFVRnJRa1FzVlVGQlZVVXNSVUZCVml4SFFVRmxMRU5CUVdZc1EwRkJhMEpHTEZWQlFWVkhMRVZCUVZZc1IwRkJaU3hEUVVGbUxFTkJRV3RDU0N4VlFVRlZTU3hGUVVGV0xFZEJRV1VzUTBGQlpqdEJRVU4yUkN4SFFXcENSQ3hGUVdsQ1JTeExRV3BDUmp0QlFXdENSRHM3UVVGRlJqczdRVUZGUXl4TFFVRk5NMElzYTBKQlFXdENMRk5CUVd4Q1FTeGxRVUZyUWl4RFFVRkRjVUlzUlVGQlJDeEZRVUZMYVVJc1EwRkJUQ3hGUVVGWE96dEJRVVZzUXl4TlFVRkhha0lzVDBGQlR5eFZRVUZXTEVWQlFYTkNPenRCUVVWeVFpeFBRVUZOYTBJc01rSkJRVEpDY2tzc1JVRkJSU3d3UWtGQlJpeEZRVUU0UWpCQ0xFMUJRUzlFT3p0QlFVVkJMRTlCUVVjd1NTeE5RVUZOTEVkQlFWUXNSVUZCWXpzN1FVRkZZaXhSUVVGSGNrd3NZMEZCWTNOTUxESkNRVUV5UWl4RFFVRTFReXhGUVVFclF6dEJRVU01UTNSTU8wRkJRMEVzUzBGR1JDeE5RVVZQTzBGQlEwNUJMRzFDUVVGakxFTkJRV1E3UVVGRFFUczdRVUZGUkdsQ0xFMUJRVVVzTUVKQlFVWXNSVUZCT0VKcVFpeFhRVUU1UWl4RlFVRXlRelpHTEV0QlFUTkRPMEZCUTBFN1FVRkRSQ3hQUVVGSGQwWXNUVUZCVFN4SFFVRlVMRVZCUVdNN08wRkJSV0lzVVVGQlIzSk1MR05CUVdNc1EwRkJha0lzUlVGQmIwSTdRVUZEYmtKQk8wRkJRMEVzUzBGR1JDeE5RVVZQTzBGQlEwNUJMRzFDUVVGamMwd3NNa0pCUVRKQ0xFTkJRWHBETzBGQlEwRTdPMEZCUlVSeVN5eE5RVUZGTERCQ1FVRkdMRVZCUVRoQ2FrSXNWMEZCT1VJc1JVRkJNa00yUml4TFFVRXpRenRCUVVOQk8wRkJRMFE3UVVGRFJDeE5RVUZIZFVVc1QwRkJUeXhWUVVGV0xFVkJRWE5DT3p0QlFVVnlRaXhQUVVGTmJVSXNNa0pCUVRKQ2RFc3NSVUZCUlN3d1FrRkJSaXhGUVVFNFFqQkNMRTFCUVM5RU96dEJRVVZCTEU5QlFVY3dTU3hOUVVGTkxFZEJRVlFzUlVGQll6czdRVUZGWWl4UlFVRkhkRXdzWTBGQlkzZE1MREpDUVVFeVFpeERRVUUxUXl4RlFVRXJRenRCUVVNNVEzaE1PMEZCUTBFc1MwRkdSQ3hOUVVWUE8wRkJRMDVCTEcxQ1FVRmpMRU5CUVdRN1FVRkRRVHM3UVVGRlJHdENMRTFCUVVVc01FSkJRVVlzUlVGQk9FSnNRaXhYUVVFNVFpeEZRVUV5UXpoR0xFdEJRVE5ETzBGQlEwRTdRVUZEUkN4UFFVRkhkMFlzVFVGQlRTeEhRVUZVTEVWQlFXTTdPMEZCUldJc1VVRkJSM1JNTEdOQlFXTXNRMEZCYWtJc1JVRkJiMEk3UVVGRGJrSkJPMEZCUTBFc1MwRkdSQ3hOUVVWUE8wRkJRMDVCTEcxQ1FVRmpkMHdzTWtKQlFUSkNMRU5CUVhwRE8wRkJRMEU3TzBGQlJVUjBTeXhOUVVGRkxEQkNRVUZHTEVWQlFUaENiRUlzVjBGQk9VSXNSVUZCTWtNNFJpeExRVUV6UXp0QlFVTkJPMEZCUTBRN1FVRkRSQ3hGUVhCRVJEczdRVUZ6UkVRN08wRkJSVU1zUzBGQlJ5eERRVUZETlVVc1JVRkJSV3RITEZGQlFVWXNSVUZCV1U0c1NVRkJXaXhEUVVGcFFpeE5RVUZxUWl4RlFVRjVRblJGTEZGQlFYcENMRU5CUVd0RExGZEJRV3hETEVOQlFVb3NSVUZCYjBRN1FVRkRia1EwU0N4alFVRlpMRlZCUVZvc1JVRkJkMEp3UWl4bFFVRjRRanRCUVVOQmIwSXNZMEZCV1N4VlFVRmFMRVZCUVhkQ2NFSXNaVUZCZUVJN1FVRkRRVHRCUVVORUxFTkJhbTVDUkNJc0ltWnBiR1VpT2lKbVlXdGxYMll5WXpFNE16a3lMbXB6SWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaVkyOXVjM1FnZEdsdFpTQTlJRGMxTUR0Y2JteGxkQ0J6WldOMGFXOXVNMGxrZUNBOUlEQTdYRzVzWlhRZ2MyVmpkR2x2YmpSSlpIZ2dQU0F3TzF4dVhHNHZMeUJzWlhRZ1JtOXZkR0poYkd4R2NtRnRaWE1zSUZSbGJtNXBjMFp5WVcxbGN5d2dRbUZ6WldKaGJHeEdjbUZ0WlhNc0lFSmhjMnRsZEdKaGJHeEdjbUZ0WlhNc0lFWmhia1p5WVcxbGN5d2dTV1JzWlVaeVlXMWxPMXh1YkdWMElIUmxibTVwYzBGdWFXMWhkR2x2Yml3Z1ptOXZkR0poYkd4QmJtbHRZWFJwYjI0c0lHSmhjMnRsZEdKaGJHeEJibWx0WVhScGIyNHNJR0poYzJWaVlXeHNRVzVwYldGMGFXOXVMQ0JtWVc1QmJtbHRZWFJwYjI0N1hHNWNibU52Ym5OMElHMWhjM1JsY2s5aWFpQTlJSHRjYmx4MGMyVmpkR2x2YmpKRGRYSnlaVzUwU1dSNE9pQXdMQ0JjYmx4MGMyVmpkR2x2YmpGRGRYSnlaVzUwU1dSNE9pQXdMRnh1WEhSaVlYTnJaWFJpWVd4c09pQjdiRzl2Y0VGdGIzVnVkRG9nTVN3Z2JHOXZjRWxrT2lCaVlYTnJaWFJpWVd4c1FXNXBiV0YwYVc5dWZTeGNibHgwWm05dmRHSmhiR3c2SUh0c2IyOXdRVzF2ZFc1ME9pQXhMQ0JzYjI5d1NXUTZJR1p2YjNSaVlXeHNRVzVwYldGMGFXOXVmU3hjYmx4MGRHVnVibWx6T2lCN2JHOXZjRUZ0YjNWdWREb2dNU3dnYkc5dmNFbGtPaUIwWlc1dWFYTkJibWx0WVhScGIyNTlMRnh1WEhSaVlYTmxZbUZzYkRvZ2UyeHZiM0JCYlc5MWJuUTZJREVzSUd4dmIzQkpaRG9nWW1GelpXSmhiR3hCYm1sdFlYUnBiMjU5TEZ4dVhIUm1ZVzQ2SUh0c2IyOXdRVzF2ZFc1ME9pQXhMQ0JzYjI5d1NXUTZJR1poYmtGdWFXMWhkR2x2Ym4xY2JuMDdYRzVqYjI1emRDQm9iMjFsY0dGblpVMXZZa2x0WVdkbGN5QTlJRnRjYmx4MEoyRnpjMlYwY3k5cGJXRm5aWE12YUc5dFpYQmhaMlZOYjJJdlltRnphMlYwWW1Gc2JDNXFjR2NuTEZ4dVhIUW5ZWE56WlhSekwybHRZV2RsY3k5b2IyMWxjR0ZuWlUxdllpOW1iMjkwWW1Gc2JDNXFjR2NuTEZ4dVhIUW5ZWE56WlhSekwybHRZV2RsY3k5b2IyMWxjR0ZuWlUxdllpOTBaVzV1YVhNdWFuQm5KeXdnWEc1Y2RDZGhjM05sZEhNdmFXMWhaMlZ6TDJodmJXVndZV2RsVFc5aUwySmhjMlZpWVd4c0xtcHdaeWNzSUZ4dVhIUW5ZWE56WlhSekwybHRZV2RsY3k5b2IyMWxjR0ZuWlUxdllpOW1ZVzR1YW5Cbkp5QmNibDFjYmx4dUpDaGtiMk4xYldWdWRDa3VjbVZoWkhrb0tDa2dQVDRnZTF4dUx5OGdWMEZKVkNCR1QxSWdaMlo1UTJGMFJXMWlaV1FnVmtsRVJVOGdWRThnVTFSQlVsUWdVRXhCV1VsT1J5QlBUaUJOVDBKSlRFVXNJRlJJUlU0Z1NFbEVSU0JVU0VVZ1RFOUJSRWxPUnlCQlRrbE5RVlJKVDA0dUlGeGNYRnhjYmx4dVhIUnBaaWgzYVc1a2IzY3VhVzV1WlhKWGFXUjBhQ0E4SURnd01Da2dlMXh1WEhSY2RGeHVYSFJjZEdabGRHTm9LQ2RoYzNObGRITXZhbk12Um1GdWRHRnpkR1ZqWDFOd2NtbDBaVjlUYUdWbGRDNXFjMjl1SnlrdWRHaGxiaWhtZFc1amRHbHZiaWh5WlhOd2IyNXpaU2tnZXlCY2JseDBYSFJjZEhKbGRIVnliaUJ5WlhOd2IyNXpaUzVxYzI5dUtDazdYRzVjZEZ4MGZTa3VkR2hsYmlobWRXNWpkR2x2YmloemNISnBkR1ZLYzI5dUtTQjdYRzVjZEZ4MFhIUmpiMjV6ZENCSlpHeGxSbkpoYldVZ1BTQm1hV3gwWlhKQ2VWWmhiSFZsS0hOd2NtbDBaVXB6YjI0dVpuSmhiV1Z6TENBbmFXUnNaU2NwTzF4dVhIUmNkRngwYldGemRHVnlUMkpxTG1admIzUmlZV3hzTG1GdWFXMWhkR2x2YmtGeWNtRjVJRDBnV3k0dUxrbGtiR1ZHY21GdFpTd2dMaTR1Wm1sc2RHVnlRbmxXWVd4MVpTaHpjSEpwZEdWS2MyOXVMbVp5WVcxbGN5d2dKMlp2YjNSaVlXeHNKeWxkTzF4dVhIUmNkRngwYldGemRHVnlUMkpxTG5SbGJtNXBjeTVoYm1sdFlYUnBiMjVCY25KaGVTQTlJRnN1TGk1SlpHeGxSbkpoYldVc0lDNHVMbVpwYkhSbGNrSjVWbUZzZFdVb2MzQnlhWFJsU25OdmJpNW1jbUZ0WlhNc0lDZDBaVzV1YVhNbktWMDdYRzVjZEZ4MFhIUnRZWE4wWlhKUFltb3VZbUZ6WldKaGJHd3VZVzVwYldGMGFXOXVRWEp5WVhrZ1BTQmJMaTR1U1dSc1pVWnlZVzFsTENBdUxpNW1hV3gwWlhKQ2VWWmhiSFZsS0hOd2NtbDBaVXB6YjI0dVpuSmhiV1Z6TENBblltRnpaV0poYkd3bktWMDdYRzVjZEZ4MFhIUnRZWE4wWlhKUFltb3VZbUZ6YTJWMFltRnNiQzVoYm1sdFlYUnBiMjVCY25KaGVTQTlJRnN1TGk1SlpHeGxSbkpoYldVc0lDNHVMbVpwYkhSbGNrSjVWbUZzZFdVb2MzQnlhWFJsU25OdmJpNW1jbUZ0WlhNc0lDZGlZWE5yWlhRbktWMDdYRzVjZEZ4MFhIUnRZWE4wWlhKUFltb3VabUZ1TG1GdWFXMWhkR2x2YmtGeWNtRjVJRDBnV3k0dUxrbGtiR1ZHY21GdFpTd2dMaTR1Wm1sc2RHVnlRbmxXWVd4MVpTaHpjSEpwZEdWS2MyOXVMbVp5WVcxbGN5d2dKMlpoYmljcFhUdGNibHgwWEhSY2RGeHVYSFJjZEZ4MFlXNXBiV0YwYjNKVFpYUjFjQ2dwTzF4dVhIUmNkRngwYVcxaFoyVkRiMjUwY205c1pYSW9iV0Z6ZEdWeVQySnFMQ0F4S1R0Y2JseHVYSFJjZEZ4MGMyVjBTVzUwWlhKMllXd29LQ2tnUFQ0Z2UxeHVYSFJjZEZ4MFhIUnBiV0ZuWlVOdmJuUnliMnhsY2lodFlYTjBaWEpQWW1vc0lERXBPMXh1WEhSY2RGeDBmU3dnTlRBd01DazdYRzVjZEZ4MGZTazdYRzVjZEgxY2JseHVYSFJqYjI1emRDQm1hV3gwWlhKQ2VWWmhiSFZsSUQwZ0tHRnljbUY1TENCemRISnBibWNwSUQwK0lIdGNiaUFnSUNCeVpYUjFjbTRnWVhKeVlYa3VabWxzZEdWeUtHOGdQVDRnZEhsd1pXOW1JRzliSjJacGJHVnVZVzFsSjEwZ1BUMDlJQ2R6ZEhKcGJtY25JQ1ltSUc5YkoyWnBiR1Z1WVcxbEoxMHVkRzlNYjNkbGNrTmhjMlVvS1M1cGJtTnNkV1JsY3loemRISnBibWN1ZEc5TWIzZGxja05oYzJVb0tTa3BPMXh1WEhSOVhHNWNibHgwWTI5dWMzUWdZVzVwYldGMGIzSlRaWFIxY0NBOUlDZ3BJRDArSUh0Y2JseDBYSFJjZEZ4dUlDQWdJSFpoY2lCc1lYTjBWR2x0WlNBOUlEQTdYRzRnSUNBZ2RtRnlJSFpsYm1SdmNuTWdQU0JiSjIxekp5d2dKMjF2ZWljc0lDZDNaV0pyYVhRbkxDQW5ieWRkTzF4dUlDQWdJR1p2Y2loMllYSWdlQ0E5SURBN0lIZ2dQQ0IyWlc1a2IzSnpMbXhsYm1kMGFDQW1KaUFoZDJsdVpHOTNMbkpsY1hWbGMzUkJibWx0WVhScGIyNUdjbUZ0WlRzZ0t5dDRLU0I3WEc0Z0lDQWdJQ0FnSUhkcGJtUnZkeTV5WlhGMVpYTjBRVzVwYldGMGFXOXVSbkpoYldVZ1BTQjNhVzVrYjNkYmRtVnVaRzl5YzF0NFhTc25VbVZ4ZFdWemRFRnVhVzFoZEdsdmJrWnlZVzFsSjEwN1hHNGdJQ0FnSUNBZ0lIZHBibVJ2ZHk1allXNWpaV3hCYm1sdFlYUnBiMjVHY21GdFpTQTlJSGRwYm1SdmQxdDJaVzVrYjNKelczaGRLeWREWVc1alpXeEJibWx0WVhScGIyNUdjbUZ0WlNkZElIeDhJSGRwYm1SdmQxdDJaVzVrYjNKelczaGRLeWREWVc1alpXeFNaWEYxWlhOMFFXNXBiV0YwYVc5dVJuSmhiV1VuWFR0Y2JpQWdJQ0I5WEc0Z1hHNGdJQ0FnYVdZZ0tDRjNhVzVrYjNjdWNtVnhkV1Z6ZEVGdWFXMWhkR2x2YmtaeVlXMWxLVnh1SUNBZ0lDQWdJQ0IzYVc1a2IzY3VjbVZ4ZFdWemRFRnVhVzFoZEdsdmJrWnlZVzFsSUQwZ1puVnVZM1JwYjI0b1kyRnNiR0poWTJzc0lHVnNaVzFsYm5RcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUhaaGNpQmpkWEp5VkdsdFpTQTlJRzVsZHlCRVlYUmxLQ2t1WjJWMFZHbHRaU2dwTzF4dUlDQWdJQ0FnSUNBZ0lDQWdkbUZ5SUhScGJXVlViME5oYkd3Z1BTQk5ZWFJvTG0xaGVDZ3dMQ0F4TmlBdElDaGpkWEp5VkdsdFpTQXRJR3hoYzNSVWFXMWxLU2s3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjJZWElnYVdRZ1BTQjNhVzVrYjNjdWMyVjBWR2x0Wlc5MWRDaG1kVzVqZEdsdmJpZ3BJSHNnWTJGc2JHSmhZMnNvWTNWeWNsUnBiV1VnS3lCMGFXMWxWRzlEWVd4c0tUc2dmU3dnWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJSFJwYldWVWIwTmhiR3dwTzF4dUlDQWdJQ0FnSUNBZ0lDQWdiR0Z6ZEZScGJXVWdQU0JqZFhKeVZHbHRaU0FySUhScGJXVlViME5oYkd3N1hHNGdJQ0FnSUNBZ0lDQWdJQ0J5WlhSMWNtNGdhV1E3WEc0Z0lDQWdJQ0FnSUgwN1hHNGdYRzRnSUNBZ2FXWWdLQ0YzYVc1a2IzY3VZMkZ1WTJWc1FXNXBiV0YwYVc5dVJuSmhiV1VwWEc0Z0lDQWdJQ0FnSUhkcGJtUnZkeTVqWVc1alpXeEJibWx0WVhScGIyNUdjbUZ0WlNBOUlHWjFibU4wYVc5dUtHbGtLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQmpiR1ZoY2xScGJXVnZkWFFvYVdRcE8xeHVJQ0FnSUNBZ0lDQjlPMXh1WEhSOVhHNWNibHgwWTI5dWMzUWdZVzVwYldGMGIzSWdQU0FvWVc1cGJXRjBhVzl1VDJKcUtTQTlQaUI3WEc1Y2RGeDBYSFJjZEZ4MFhIUmNibHgwWEhSMllYSWdaR0Z1WTJsdVowbGpiMjRzWEc1Y2RGeDBYSFJ6Y0hKcGRHVkpiV0ZuWlN4Y2JseDBYSFJjZEdOaGJuWmhjenRjZEZ4MFhIUmNkRngwWEc1Y2JseDBYSFJtZFc1amRHbHZiaUJuWVcxbFRHOXZjQ0FvS1NCN1hHNWNkRngwWEhRa0tDY2piRzloWkdsdVp5Y3BMbUZrWkVOc1lYTnpLQ2RvYVdSa1pXNG5LVHRjYmx4MFhIUWdJR0Z1YVcxaGRHbHZiazlpYWk1c2IyOXdTV1FnUFNCM2FXNWtiM2N1Y21WeGRXVnpkRUZ1YVcxaGRHbHZia1p5WVcxbEtHZGhiV1ZNYjI5d0tUdGNibHgwWEhRZ0lHUmhibU5wYm1kSlkyOXVMblZ3WkdGMFpTZ3BPMXh1WEhSY2RDQWdaR0Z1WTJsdVowbGpiMjR1Y21WdVpHVnlLQ2s3WEc1Y2RGeDBmVnh1WEhSY2RGeHVYSFJjZEdaMWJtTjBhVzl1SUhOd2NtbDBaU0FvYjNCMGFXOXVjeWtnZTF4dVhIUmNkRnh1WEhSY2RGeDBkbUZ5SUhSb1lYUWdQU0I3ZlN4Y2JseDBYSFJjZEZ4MFpuSmhiV1ZKYm1SbGVDQTlJREFzWEc1Y2RGeDBYSFJjZEhScFkydERiM1Z1ZENBOUlEQXNYRzVjZEZ4MFhIUmNkR3h2YjNCRGIzVnVkQ0E5SURBc1hHNWNkRngwWEhSY2RIUnBZMnR6VUdWeVJuSmhiV1VnUFNCdmNIUnBiMjV6TG5ScFkydHpVR1Z5Um5KaGJXVWdmSHdnTUN4Y2JseDBYSFJjZEZ4MGJuVnRZbVZ5VDJaR2NtRnRaWE1nUFNCdmNIUnBiMjV6TG01MWJXSmxjazltUm5KaGJXVnpJSHg4SURFN1hHNWNkRngwWEhSY2JseDBYSFJjZEhSb1lYUXVZMjl1ZEdWNGRDQTlJRzl3ZEdsdmJuTXVZMjl1ZEdWNGREdGNibHgwWEhSY2RIUm9ZWFF1ZDJsa2RHZ2dQU0J2Y0hScGIyNXpMbmRwWkhSb08xeHVYSFJjZEZ4MGRHaGhkQzVvWldsbmFIUWdQU0J2Y0hScGIyNXpMbWhsYVdkb2REdGNibHgwWEhSY2RIUm9ZWFF1YVcxaFoyVWdQU0J2Y0hScGIyNXpMbWx0WVdkbE8xeHVYSFJjZEZ4MGRHaGhkQzVzYjI5d2N5QTlJRzl3ZEdsdmJuTXViRzl2Y0hNN1hHNWNkRngwWEhSY2JseDBYSFJjZEhSb1lYUXVkWEJrWVhSbElEMGdablZ1WTNScGIyNGdLQ2tnZTF4dVhHNGdJQ0FnSUNBZ0lIUnBZMnREYjNWdWRDQXJQU0F4TzF4dVhHNGdJQ0FnSUNBZ0lHbG1JQ2gwYVdOclEyOTFiblFnUGlCMGFXTnJjMUJsY2taeVlXMWxLU0I3WEc1Y2JseDBYSFJjZEZ4MFhIUjBhV05yUTI5MWJuUWdQU0F3TzF4dUlDQWdJQ0FnSUNBZ0lDOHZJRWxtSUhSb1pTQmpkWEp5Wlc1MElHWnlZVzFsSUdsdVpHVjRJR2x6SUdsdUlISmhibWRsWEc0Z0lDQWdJQ0FnSUNBZ2FXWWdLR1p5WVcxbFNXNWtaWGdnUENCdWRXMWlaWEpQWmtaeVlXMWxjeUF0SURFcElIdGNkRnh1SUNBZ0lDQWdJQ0FnSUM4dklFZHZJSFJ2SUhSb1pTQnVaWGgwSUdaeVlXMWxYRzRnSUNBZ0lDQWdJQ0FnSUNCbWNtRnRaVWx1WkdWNElDczlJREU3WEc0Z0lDQWdJQ0FnSUNBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0FnSUNBZ1hIUmNkR3h2YjNCRGIzVnVkQ3NyWEc0Z0lDQWdJQ0FnSUNBZ0lDQm1jbUZ0WlVsdVpHVjRJRDBnTUR0Y2JseHVJQ0FnSUNBZ0lDQWdJQ0FnYVdZb2JHOXZjRU52ZFc1MElEMDlQU0IwYUdGMExteHZiM0J6S1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0JjZEhkcGJtUnZkeTVqWVc1alpXeEJibWx0WVhScGIyNUdjbUZ0WlNoaGJtbHRZWFJwYjI1UFltb3ViRzl2Y0Vsa0tUdGNiaUFnSUNBZ0lDQWdJQ0FnSUgxY2JpQWdJQ0FnSUNBZ0lDQjlYRzVjZENBZ0lDQWdJSDFjYmx4MElDQWdJSDFjYmx4MFhIUmNkRnh1WEhSY2RGeDBkR2hoZEM1eVpXNWtaWElnUFNCbWRXNWpkR2x2YmlBb0tTQjdYRzVjZEZ4MFhIUmNibHgwWEhSY2RDQWdMeThnUTJ4bFlYSWdkR2hsSUdOaGJuWmhjMXh1WEhSY2RGeDBJQ0IwYUdGMExtTnZiblJsZUhRdVkyeGxZWEpTWldOMEtEQXNJREFzSUhSb1lYUXVkMmxrZEdnc0lIUm9ZWFF1YUdWcFoyaDBLVHRjYmx4MFhIUmNkQ0FnWEc1Y2RGeDBYSFFnSUhSb1lYUXVZMjl1ZEdWNGRDNWtjbUYzU1cxaFoyVW9YRzVjZEZ4MFhIUWdJQ0FnZEdoaGRDNXBiV0ZuWlN4Y2JseDBYSFJjZENBZ0lDQmhibWx0WVhScGIyNVBZbW91WVc1cGJXRjBhVzl1UVhKeVlYbGJabkpoYldWSmJtUmxlRjB1Wm5KaGJXVXVlQ3hjYmx4MFhIUmNkQ0FnSUNCaGJtbHRZWFJwYjI1UFltb3VZVzVwYldGMGFXOXVRWEp5WVhsYlpuSmhiV1ZKYm1SbGVGMHVabkpoYldVdWVTeGNibHgwWEhSY2RDQWdJQ0F5TURBc1hHNWNkRngwWEhRZ0lDQWdNVGMxTEZ4dVhIUmNkRngwSUNBZ0lEQXNYRzVjZEZ4MFhIUWdJQ0FnTUN4Y2JseDBYSFJjZENBZ0lDQjNhVzVrYjNjdWFXNXVaWEpYYVdSMGFDQXZJRE11T0RRMkxGeHVYSFJjZEZ4MElDQWdJSGRwYm1SdmR5NXBibTVsY2xkcFpIUm9JQzhnTkM0eEtWeHVYSFJjZEZ4MGZUdGNibHgwWEhSY2RGeHVYSFJjZEZ4MGNtVjBkWEp1SUhSb1lYUTdYRzVjZEZ4MGZWeHVYSFJjZEZ4dVhIUmNkQzh2SUVkbGRDQmpZVzUyWVhOY2JseDBYSFJqWVc1MllYTWdQU0JrYjJOMWJXVnVkQzVuWlhSRmJHVnRaVzUwUW5sSlpDZ25ZMkZ1ZG1Gekp5azdYRzVjZEZ4MFkyRnVkbUZ6TG5kcFpIUm9JRDBnZDJsdVpHOTNMbWx1Ym1WeVYybGtkR2dnTHlBekxqZzBOanRjYmx4MFhIUmpZVzUyWVhNdWFHVnBaMmgwSUQwZ2QybHVaRzkzTG1sdWJtVnlWMmxrZEdnZ0x5QXlMakk3WEc1Y2RGeDBYRzVjZEZ4MEx5OGdRM0psWVhSbElITndjbWwwWlNCemFHVmxkRnh1WEhSY2RITndjbWwwWlVsdFlXZGxJRDBnYm1WM0lFbHRZV2RsS0NrN1hIUmNibHgwWEhSY2JseDBYSFF2THlCRGNtVmhkR1VnYzNCeWFYUmxYRzVjZEZ4MFpHRnVZMmx1WjBsamIyNGdQU0J6Y0hKcGRHVW9lMXh1WEhSY2RGeDBZMjl1ZEdWNGREb2dZMkZ1ZG1GekxtZGxkRU52Ym5SbGVIUW9YQ0l5WkZ3aUtTeGNibHgwWEhSY2RIZHBaSFJvT2lBME1EUXdMRnh1WEhSY2RGeDBhR1ZwWjJoME9pQXhOemN3TEZ4dVhIUmNkRngwYVcxaFoyVTZJSE53Y21sMFpVbHRZV2RsTEZ4dVhIUmNkRngwYm5WdFltVnlUMlpHY21GdFpYTTZJR0Z1YVcxaGRHbHZiazlpYWk1aGJtbHRZWFJwYjI1QmNuSmhlUzVzWlc1bmRHZ3NYRzVjZEZ4MFhIUjBhV05yYzFCbGNrWnlZVzFsT2lBMExGeHVYSFJjZEZ4MGJHOXZjSE02SUdGdWFXMWhkR2x2Yms5aWFpNXNiMjl3UVcxdmRXNTBYRzVjZEZ4MGZTazdYRzVjZEZ4MFhHNWNkRngwTHk4Z1RHOWhaQ0J6Y0hKcGRHVWdjMmhsWlhSY2JseDBYSFJ6Y0hKcGRHVkpiV0ZuWlM1aFpHUkZkbVZ1ZEV4cGMzUmxibVZ5S0Z3aWJHOWhaRndpTENCbllXMWxURzl2Y0NrN1hHNWNkRngwYzNCeWFYUmxTVzFoWjJVdWMzSmpJRDBnSjJGemMyVjBjeTlwYldGblpYTXZSbUZ1ZEdGemRHVmpYMU53Y21sMFpWOVRhR1ZsZEM1d2JtY25PMXh1WEhSOUlGeHVYRzR2THlCSlRrbFVTVUZNU1ZORklFRk9SQ0JUUlZSVlVDQkRWVkpTUlU1VUlGQkJSMFV1SUVWWVJVTlZWRVVnVkZKQlRsTkpWRWxQVGxNZ1FVNUVJRkpGVFU5V1JTQlVTVTVVSUVsR0lGSkZURVZXUVU1VUlGeGNYRnhjYmx4dVhIUmpiMjV6ZEZ4MGNHRm5aVXh2WVdSbGNpQTlJQ2hwYm1SbGVDa2dQVDRnZTF4dVhIUmNkR2xtS0dsdVpHVjRJRDA5UFNBMUtTQjdYRzVjZEZ4MFhIUWtLQ2N1ZEdsdWRDY3BMbkpsYlc5MlpVTnNZWE56S0NkeVpXMXZkbVZVYVc1MEp5azdYRzVjZEZ4MFhIUWtLQ2N1WW1GamEyZHliM1Z1WkZkeVlYQndaWEluS1M1eVpXMXZkbVZEYkdGemN5Z25jMk5oYkdWQ1lXTnJaM0p2ZFc1a0p5azdYRzVjZEZ4MFhIUWtLQ2NqYzJWamRHbHZialVuS1M1bWFXNWtLQ2N1YUdWaFpHbHVaeWNwTG1Ga1pFTnNZWE56S0NkemFHOTNJR1poWkdWSmJpY3BPMXh1WEhSY2RGeDBKQ2duTG5OMVlsTmxZM1JwYjI0bktTNWhaR1JEYkdGemN5Z25jMk5oYkdWQ1lXTnJaM0p2ZFc1a0p5azdYRzVjZEZ4MFhIUWtLQ2N1YzNWaVUyVmpkR2x2YmljcExtWnBibVFvSnk1MGFXNTBKeWt1WVdSa1EyeGhjM01vSjNKbGJXOTJaVlJwYm5RbktUdGNibHgwWEhSY2RDUW9KeU56WldOMGFXOXVOU2NwTG1acGJtUW9KeTUwWlhoMFYzSmhjSEJsY2ljcExtRmtaRU5zWVhOektDZHphRzkzSnlrN1hHNWNkRngwWEhSelpYUlVhVzFsYjNWMEtDZ3BJRDArSUh0Y2JseDBYSFJjZEZ4MEpDZ25Mbk4xWWxObFkzUnBiMjRnUGlBdWRHVjRkRmR5WVhCd1pYSW5LUzVtYVc1a0tDY3VhR1ZoWkdsdVp5Y3BMbUZrWkVOc1lYTnpLQ2RtWVdSbFNXNG5LVHRjYmx4MFhIUmNkSDBzSURFd01EQXBPMXh1WEhSY2RIMGdYRzVjZEZ4MFpXeHpaU0I3WEc1Y2RGeDBYSFFrS0NjdWRHbHVkQ2NwTG5KbGJXOTJaVU5zWVhOektDZHlaVzF2ZG1WVWFXNTBKeWs3WEc1Y2RGeDBYSFFrS0NjdWMzVmlVMlZqZEdsdmJpY3BMbkpsYlc5MlpVTnNZWE56S0NkelkyRnNaVUpoWTJ0bmNtOTFibVFuS1R0Y2JseDBYSFJjZENRb1lDNWlZV05yWjNKdmRXNWtWM0poY0hCbGNqcHViM1FvSTNObFkzUnBiMjRrZTJsdVpHVjRmVUpoWTJ0bmNtOTFibVFwWUNrdWNtVnRiM1psUTJ4aGMzTW9KM05qWVd4bFFtRmphMmR5YjNWdVpDY3BPMXh1WEhSY2RGeDBKQ2hnTG5ObFkzUnBiMjR1WVdOMGFYWmxZQ2t1Wm1sdVpDaGdMbUpoWTJ0bmNtOTFibVJYY21Gd2NHVnlZQ2t1WVdSa1EyeGhjM01vSjNOallXeGxRbUZqYTJkeWIzVnVaQ2NwTzF4dVhIUmNkRngwSkNoZ2MyVmpkR2x2Ymk1aFkzUnBkbVZnS1M1bWFXNWtLQ2N1ZEdsdWRDY3BMbUZrWkVOc1lYTnpLQ2R5WlcxdmRtVlVhVzUwSnlrN1hHNWNibHgwWEhSY2RHbG1LQ1FvWUM1elpXTjBhVzl1Skh0cGJtUmxlSDFRWVdkcGJtRjBiM0pDZFhSMGIyNWdLUzVzWlc1bmRHZ2dKaVlnSkNoZ0xuTmxZM1JwYjI0a2UybHVaR1Y0ZlZCaFoybHVZWFJ2Y2tKMWRIUnZiaTVoWTNScGRtVmdLUzVzWlc1bmRHZ2dQQ0F4S1NCN1hHNWNkRngwWEhSY2RDUW9ZQzV6WldOMGFXOXVKSHRwYm1SbGVIMVFZV2RwYm1GMGIzSkNkWFIwYjI1Z0tTNW5aWFFvTUNrdVkyeHBZMnNvS1R0Y2JseDBYSFJjZEgxY2JseDBYSFI5WEc1Y2RIMDdYRzVjYmk4dklFaEpSRVVnUVV4TUlFSkZRMHRIVWs5VlRrUlRJRWxPSUZSSVJTQlRSVU5VU1U5T0lFVllRMFZRVkNCVVNFVWdVMUJGUTBsR1NVVkVJRWxPUkVWWUxDQlhTRWxEU0NCSlV5QlRRMEZNUlVRZ1FVNUVJRk5JVDFkT0xpQmNYRnhjWEc1Y2JseDBZMjl1YzNRZ2FXNXBkR2xoYkdsNlpWTmxZM1JwYjI0Z1BTQW9jMlZqZEdsdmJrNTFiV0psY2l3Z2FXUjRLU0E5UGlCN1hHNWNkRngwSkNoZ0kzTmxZM1JwYjI0a2UzTmxZM1JwYjI1T2RXMWlaWEo5UW1GamEyZHliM1Z1WkNSN2FXUjRmV0FwTG5OcFlteHBibWR6S0NjdVltRmphMmR5YjNWdVpGZHlZWEJ3WlhJbktTNXRZWEFvS0dsNExDQmxiR1VwSUQwK0lIdGNibHgwWEhSY2RDUW9aV3hsS1M1amMzTW9lMjl3WVdOcGRIazZJREI5S1R0Y2JseDBYSFI5S1R0Y2JseHVYSFJjZENRb1lDTnpaV04wYVc5dUpIdHpaV04wYVc5dVRuVnRZbVZ5ZlVKaFkydG5jbTkxYm1Ra2UybGtlSDFnS1M1amMzTW9lMXh1WEhSY2RGeDBKM1J5WVc1elptOXliU2M2SUNkelkyRnNaU2d4TGpFcEp5eGNibHgwWEhSY2RDZHZjR0ZqYVhSNUp6b2dNVnh1WEhSY2RIMHBPMXh1WEhSOU8xeHVYRzR2THlCSlRrbFVTVUZVUlNCcGJtbDBhV0ZzYVhwbFUyVmpkR2x2YmlCUFRpQlRSVU5VU1U5T1V5QXpJRUZPUkNBMExpQmNYRnhjWEc1Y2RHbHVhWFJwWVd4cGVtVlRaV04wYVc5dUtERXNJREFwTzF4dVhIUnBibWwwYVdGc2FYcGxVMlZqZEdsdmJpZ3pMQ0F3S1R0Y2JseDBhVzVwZEdsaGJHbDZaVk5sWTNScGIyNG9OQ3dnTUNrN1hHNWNiaTh2SUZORlExUkpUMDVUSURJZ0tFRkNUMVZVSUZWVElGTkZRMVJKVDA0cElFSkJRMHRIVWs5VlRrUWdTVTFCUjBVZ1ZGSkJUbE5KVkVsUFRpQklRVTVFVEVWU0xpQmNYRnhjWEc1Y2JseDBZMjl1YzNRZ2FXMWhaMlZEYjI1MGNtOXNaWElnUFNBb2FXUjRUMkpxTENCelpXTjBhVzl1VG5WdFltVnlLU0E5UGlCN1hHNWNkRngwYkdWMElISmxiR1YyWVc1MFFXNXBiV0YwYVc5dU8xeHVYRzVjZEZ4MGFXWW9jMlZqZEdsdmJrNTFiV0psY2lBOVBUMGdNU2tnZTF4dVhIUmNkRngwYzNkcGRHTm9LR2xrZUU5aWFpNXpaV04wYVc5dU1VTjFjbkpsYm5SSlpIZ3BJSHRjYmx4MFhIUmNkRngwWTJGelpTQXdPbHh1WEhSY2RGeDBYSFJjZEhKbGJHVjJZVzUwUVc1cGJXRjBhVzl1SUQwZ2JXRnpkR1Z5VDJKcUxtSmhjMnRsZEdKaGJHdzdYRzVjZEZ4MFhIUmNkR0p5WldGck8xeHVYSFJjZEZ4MFhIUmpZWE5sSURFNlhHNWNkRngwWEhSY2RGeDBjbVZzWlhaaGJuUkJibWx0WVhScGIyNGdQU0J0WVhOMFpYSlBZbW91Wm05dmRHSmhiR3c3WEc1Y2RGeDBYSFJjZEdKeVpXRnJPMXh1WEhSY2RGeDBYSFJqWVhObElESTZYRzVjZEZ4MFhIUmNkRngwY21Wc1pYWmhiblJCYm1sdFlYUnBiMjRnUFNCdFlYTjBaWEpQWW1vdWRHVnVibWx6TzF4dVhIUmNkRngwWEhSaWNtVmhhenRjYmx4MFhIUmNkRngwWTJGelpTQXpPbHh1WEhSY2RGeDBYSFJjZEhKbGJHVjJZVzUwUVc1cGJXRjBhVzl1SUQwZ2JXRnpkR1Z5VDJKcUxtSmhjMlZpWVd4c08xeHVYSFJjZEZ4MFhIUmljbVZoYXp0Y2JseDBYSFJjZEZ4MFkyRnpaU0EwT2x4dVhIUmNkRngwWEhSY2RISmxiR1YyWVc1MFFXNXBiV0YwYVc5dUlEMGdiV0Z6ZEdWeVQySnFMbVpoYmp0Y2JseDBYSFJjZEZ4MFluSmxZV3M3WEc1Y2RGeDBYSFI5WEc1Y2RGeDBmVnh1WEc1Y2RGeDBKQ2hnSTNObFkzUnBiMjRrZTNObFkzUnBiMjVPZFcxaVpYSjlZQ2t1Wm1sdVpDZ25MblJwYm5RbktTNXlaVzF2ZG1WRGJHRnpjeWduY21WdGIzWmxWR2x1ZENjcE8xeHVYSFJjZENRb1lDTnpaV04wYVc5dUpIdHpaV04wYVc5dVRuVnRZbVZ5ZlVKaFkydG5jbTkxYm1Ra2UybGtlRTlpYWx0Z2MyVmpkR2x2YmlSN2MyVmpkR2x2Yms1MWJXSmxjbjFEZFhKeVpXNTBTV1I0WUYxOVlDa3VjbVZ0YjNabFEyeGhjM01vSjNOallXeGxRbUZqYTJkeWIzVnVaQ2NwTzF4dVhIUmNkR2x1YVhScFlXeHBlbVZUWldOMGFXOXVLSE5sWTNScGIyNU9kVzFpWlhJc0lHbGtlRTlpYWx0Z2MyVmpkR2x2YmlSN2MyVmpkR2x2Yms1MWJXSmxjbjFEZFhKeVpXNTBTV1I0WUYwcE8xeHVYSFJjZEZ4dVhIUmNkSE5sZEZScGJXVnZkWFFvS0NrZ1BUNGdlMXh1WEhSY2RGeDBhV1lvYzJWamRHbHZiazUxYldKbGNpQTlQVDBnTVNrZ2UxeHVYSFJjZEZ4MFhIUmhibWx0WVhSdmNpaHlaV3hsZG1GdWRFRnVhVzFoZEdsdmJpazdYRzVjZEZ4MFhIUjlYRzVjYmx4MFhIUmNkQ1FvWUNOelpXTjBhVzl1Skh0elpXTjBhVzl1VG5WdFltVnlmV0FwTG1acGJtUW9ZQzVpWVdOclozSnZkVzVrVjNKaGNIQmxjbUFwTG1Ga1pFTnNZWE56S0NkelkyRnNaVUpoWTJ0bmNtOTFibVFuS1R0Y2JseDBYSFJjZENRb1lDTnpaV04wYVc5dUpIdHpaV04wYVc5dVRuVnRZbVZ5ZldBcExtWnBibVFvSnk1MGFXNTBKeWt1WVdSa1EyeGhjM01vSjNKbGJXOTJaVlJwYm5RbktUdGNibHgwWEhSOUxDQTFNREFwTzF4dVhHNWNkRngwYVdZb2FXUjRUMkpxVzJCelpXTjBhVzl1Skh0elpXTjBhVzl1VG5WdFltVnlmVU4xY25KbGJuUkpaSGhnWFNBOVBUMGdKQ2hnSTNObFkzUnBiMjRrZTNObFkzUnBiMjVPZFcxaVpYSjlZQ2t1Wm1sdVpDaGdMbUpoWTJ0bmNtOTFibVJYY21Gd2NHVnlZQ2t1YkdWdVozUm9JQzBnTVNrZ2UxeHVYSFJjZEZ4MGFXUjRUMkpxVzJCelpXTjBhVzl1Skh0elpXTjBhVzl1VG5WdFltVnlmVU4xY25KbGJuUkpaSGhnWFNBOUlEQTdYRzVjZEZ4MGZTQmxiSE5sSUh0Y2JseDBYSFJjZEdsa2VFOWlhbHRnYzJWamRHbHZiaVI3YzJWamRHbHZiazUxYldKbGNuMURkWEp5Wlc1MFNXUjRZRjBnS3owZ01UdGNibHgwWEhSOVhHNWNkSDFjYmx4dVhIUnBiV0ZuWlVOdmJuUnliMnhsY2lodFlYTjBaWEpQWW1vc0lESXBPMXh1WEc1Y2RITmxkRWx1ZEdWeWRtRnNLQ2dwSUQwK0lIdGNibHgwWEhScGJXRm5aVU52Ym5SeWIyeGxjaWh0WVhOMFpYSlBZbW9zSURJcE8xeHVYSFI5TENBeE5UQXdNQ2s3WEc1Y2JpOHZJRkJCUjBsT1FWUkpUMDRnUWxWVVZFOU9VeUJEVEVsRFN5QklRVTVFVEVWU0lFWlBVaUJUUlVOVVNVOU9VeUF6SUVGT1JDQTBMaUJjWEZ4Y1hHNWNibHgwWTI5dWMzUWdhR0Z1Wkd4bFVHRnVhVzVoZEdsdmJrSjFkSFJ2YmtOc2FXTnJJRDBnS0dVcElEMCtJSHRjYmx4dVhIUmNkR052Ym5OMElHbGtlQ0E5SUhCaGNuTmxTVzUwS0NRb1pTNTBZWEpuWlhRcExtRjBkSElvSjJSaGRHRXRhVzVrWlhnbktTazdYRzVjZEZ4MFkyOXVjM1FnYzJWamRHbHZia2xrSUQwZ0pDaGxMblJoY21kbGRDa3VZMnh2YzJWemRDZ25jMlZqZEdsdmJpY3BMbUYwZEhJb0oybGtKeWs3WEc1Y2RGeDBiR1YwSUhKbGJHVjJZVzUwUkdGMFlVRnljbUY1TzF4dVhHNWNkRngwYVdZb2MyVmpkR2x2Ymtsa0lEMDlQU0FuYzJWamRHbHZiak1uS1NCN1hHNWNkRngwWEhSelpXTjBhVzl1TTBsa2VDQTlJR2xrZUR0Y2JseDBYSFI5WEc1Y2JseDBYSFJwWmloelpXTjBhVzl1U1dRZ1BUMDlJQ2R6WldOMGFXOXVOQ2NwSUh0Y2JseDBYSFJjZEhObFkzUnBiMjQwU1dSNElEMGdhV1I0TzF4dVhIUmNkSDFjYmx4dVhIUmNkQ1FvWUNNa2UzTmxZM1JwYjI1SlpIMWdLUzVtYVc1a0tDY3VkR2x1ZENjcExuSmxiVzkyWlVOc1lYTnpLQ2R5WlcxdmRtVlVhVzUwSnlrN1hHNWNkRngwSkNoZ0l5UjdjMlZqZEdsdmJrbGtmV0FwTG1acGJtUW9KeTUwWlhoMFYzSmhjSEJsY2ljcExuSmxiVzkyWlVOc1lYTnpLQ2R6YUc5M0p5azdYRzVjZEZ4MEpDaGdJeVI3YzJWamRHbHZia2xrZldBcExtWnBibVFvWUNOMFpYaDBWM0poY0hCbGNpUjdhV1I0ZldBcExtRmtaRU5zWVhOektDZHphRzkzSnlrN1hHNWNkRngwSkNoZ0l5UjdjMlZqZEdsdmJrbGtmVUpoWTJ0bmNtOTFibVFrZTJsa2VIMWdLUzV5WlcxdmRtVkRiR0Z6Y3lnbmMyTmhiR1ZDWVdOclozSnZkVzVrSnlrN1hHNWNkRngwSkNoZ0xpUjdjMlZqZEdsdmJrbGtmVkJoWjJsdVlYUnZja0oxZEhSdmJtQXBMbkpsYlc5MlpVTnNZWE56S0NkaFkzUnBkbVVuS1R0Y2JseDBYSFFrS0dVdWRHRnlaMlYwS1M1aFpHUkRiR0Z6Y3lnbllXTjBhWFpsSnlrN1hHNWNibHgwWEhScGJtbDBhV0ZzYVhwbFUyVmpkR2x2Ymlod1lYSnpaVWx1ZENna0tHQWpKSHR6WldOMGFXOXVTV1I5WUNrdVlYUjBjaWduWkdGMFlTMXBibVJsZUNjcEtTd2dhV1I0S1R0Y2JseHVYSFJjZEhObGRGUnBiV1Z2ZFhRb0tDa2dQVDRnZTF4dVhIUmNkRngwY0dGblpVeHZZV1JsY2lod1lYSnpaVWx1ZENna0tHQWpKSHR6WldOMGFXOXVTV1I5WUNrdVlYUjBjaWduWkdGMFlTMXBibVJsZUNjcEtTazdYRzVjZEZ4MGZTd2dOVEF3S1R0Y2JseHVYSFJjZEdsbUtITmxZM1JwYjI1SlpDQWhQVDBnSjNObFkzUnBiMjR5SnlsN1hHNWNkRngwWEhRa0tHQWpKSHR6WldOMGFXOXVTV1I5WUNrdVptbHVaQ2duTG1obFlXUnBibWNzSUhBbktTNWhaR1JEYkdGemN5Z25abUZrWlVsdUp5azdYRzVjZEZ4MFhIUWtLR0FqSkh0elpXTjBhVzl1U1dSOVlDa3ViMjRvSjNSeVlXNXphWFJwYjI1bGJtUWdkMlZpYTJsMFZISmhibk5wZEdsdmJrVnVaQ0J2VkhKaGJuTnBkR2x2YmtWdVpDY3NJQ2hsY3lrZ1BUNGdlMXh1WEhRZ0lDQWdYSFFrS0dBakpIdHpaV04wYVc5dVNXUjlZQ2t1Wm1sdVpDZ25MbWhsWVdScGJtY3NJSEFuS1M1eVpXMXZkbVZEYkdGemN5Z25abUZrWlVsdUp5azdYRzVjZEZ4MFhIUjlLVHRjYmx4MFhIUjlYRzVjZEgwN1hHNWNiaTh2SUVOTVNVTkxJRXhKVTFSRlRrVlNJRVpQVWlCUVFVZEpUa0ZVU1U5T0lFSlZWRlJQVGxNZ1QwNGdVMFZEVkVsUFRsTWdNeUJCVGtRZ05DNGdYRnhjWEZ4dVhHNWNkQ1FvSnk1elpXTjBhVzl1TTFCaFoybHVZWFJ2Y2tKMWRIUnZiaXdnTG5ObFkzUnBiMjQwVUdGbmFXNWhkRzl5UW5WMGRHOXVKeWt1WTJ4cFkyc29LR1VwSUQwK0lIdGNibHgwWEhSb1lXNWtiR1ZRWVc1cGJtRjBhVzl1UW5WMGRHOXVRMnhwWTJzb1pTazdYRzVjZEgwcE8xeHVYRzR2THlCSlRrbFVTVUZNU1ZwRklFOU9SVkJCUjBWVFExSlBURXdnU1VZZ1RrOVVJRWxPSUVOTlV5QlFVa1ZXU1VWWExpQmNYRnhjWEc1Y2JseDBhV1lvSVNRb2JHOWpZWFJwYjI0cExtRjBkSElvSjJoeVpXWW5LUzVwYm1Oc2RXUmxjeWduYVc1a1pYZ3VjR2h3SnlrcElIdGNibHgwWEhRa0tDY2pjMk55YjJ4c1pYSlhjbUZ3Y0dWeUp5a3ViMjVsY0dGblpWOXpZM0p2Ykd3b2UxeHVYSFJjZEZ4MGMyVmpkR2x2YmtOdmJuUmhhVzVsY2pvZ1hDSnpaV04wYVc5dVhDSXNJQ0FnSUZ4dVhIUmNkRngwWldGemFXNW5PaUJjSW1WaGMyVXRiM1YwWENJc0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCY2JseDBYSFJjZEdGdWFXMWhkR2x2YmxScGJXVTZJSFJwYldVc0lDQWdJQ0FnSUNBZ0lDQWdYRzVjZEZ4MFhIUndZV2RwYm1GMGFXOXVPaUIwY25WbExDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUZ4dVhIUmNkRngwZFhCa1lYUmxWVkpNT2lCMGNuVmxMQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lGeHVYSFJjZEZ4MFltVm1iM0psVFc5MlpUb2dLR2x1WkdWNEtTQTlQaUI3ZlN3Z1hHNWNkRngwWEhSaFpuUmxjazF2ZG1VNklDaHBibVJsZUNrZ1BUNGdlMXh1THk4Z1NVNUpWRWxCVEVsYVJTQlVTRVVnUTFWU1VrVk9WQ0JRUVVkRkxpQmNYRnhjWEc1Y2JseDBYSFJjZEZ4MGNHRm5aVXh2WVdSbGNpaHBibVJsZUNrN1hHNWNkRngwWEhSOUxDQWdYRzVjZEZ4MFhIUnNiMjl3T2lCbVlXeHpaU3dnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUZ4dVhIUmNkRngwYTJWNVltOWhjbVE2SUhSeWRXVXNJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQmNibHgwWEhSY2RISmxjM0J2Ym5OcGRtVkdZV3hzWW1GamF6b2dabUZzYzJVc0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1hHNWNkRngwWEhSa2FYSmxZM1JwYjI0NklGd2lkbVZ5ZEdsallXeGNJaUFnSUNBZ0lDQWdJQ0JjYmx4MFhIUjlLVHRjYmx4dVhIUmNkQ1FvSnlOelkzSnZiR3hsY2xkeVlYQndaWEluS1M1dGIzWmxWRzhvTVNrN1hHNWNkSDFjYmx4dUx5OGdRMDlPVkZKUFRDQkRURWxEUzFNZ1QwNGdWMDlTU3lCWFNWUklJRlZUSUZORlExUkpUMDRnS0ZORlExUkpUMDQxS1M0Z1hGeGNYRnh1WEc1Y2RDUW9KeTVqYkdsamEyRmliR1VuS1M1amJHbGpheWdvWlNrZ1BUNGdlMXh1WEhSY2RHeGxkQ0JqZFhKeVpXNTBVMlZqZEdsdmJpQTlJQ1FvWlM1MFlYSm5aWFFwTG1Oc2IzTmxjM1FvSkNnbkxuTjFZbE5sWTNScGIyNG5LU2s3WEc1Y2JseDBYSFJwWmloamRYSnlaVzUwVTJWamRHbHZiaTVvWVhORGJHRnpjeWduYjNCbGJpY3BLU0I3WEc1Y2RGeDBYSFJqZFhKeVpXNTBVMlZqZEdsdmJpNXlaVzF2ZG1WRGJHRnpjeWduYjNCbGJpY3BPMXh1WEhSY2RGeDBZM1Z5Y21WdWRGTmxZM1JwYjI0dVptbHVaQ2duTG1KMWRIUnZiaXdnY0NjcExuSmxiVzkyWlVOc1lYTnpLQ2RtWVdSbFNXNG5LVHRjYmx4MFhIUmNkR04xY25KbGJuUlRaV04wYVc5dUxuTnBZbXhwYm1kektDY3VjM1ZpVTJWamRHbHZiaWNwTG0xaGNDZ29hV1I0TENCelpXTjBhVzl1S1NBOVBpQjdYRzVjZEZ4MFhIUmNkQ1FvYzJWamRHbHZiaWt1Y21WdGIzWmxRMnhoYzNNb0oyTnNiM05sWkNjcE8xeHVYSFJjZEZ4MFhIUWtLSE5sWTNScGIyNHBMbVpwYm1Rb0p5NTBhVzUwSnlrdWNtVnRiM1psUTJ4aGMzTW9KMkZrWkZScGJuUW5LUzVoWkdSRGJHRnpjeWduY21WdGIzWmxWR2x1ZENjcE8xeHVYSFJjZEZ4MGZTazdYRzVjZEZ4MGZTQmxiSE5sSUh0Y2JseDBYSFJjZEdOMWNuSmxiblJUWldOMGFXOXVMbkpsYlc5MlpVTnNZWE56S0NkamJHOXpaV1FuS1M1aFpHUkRiR0Z6Y3lnbmIzQmxiaWNwTzF4dVhIUmNkRngwWTNWeWNtVnVkRk5sWTNScGIyNHViMjRvSjNSeVlXNXphWFJwYjI1bGJtUWdkMlZpYTJsMFZISmhibk5wZEdsdmJrVnVaQ0J2VkhKaGJuTnBkR2x2YmtWdVpDY3NJQ2hsY3lrZ1BUNGdlMXh1WEhRZ0lDQWdYSFFrS0NjdWMzVmlVMlZqZEdsdmJpNXZjR1Z1SnlrdVptbHVaQ2duTG1KMWRIUnZiaXdnY0NjcExtRmtaRU5zWVhOektDZG1ZV1JsU1c0bktUdGNibHgwWEhSY2RIMHBPMXh1WEhSY2RGeDBZM1Z5Y21WdWRGTmxZM1JwYjI0dWMybGliR2x1WjNNb0p5NXpkV0pUWldOMGFXOXVKeWt1YldGd0tDaHBaSGdzSUhObFkzUnBiMjRwSUQwK0lIdGNibHgwWEhSY2RGeDBKQ2h6WldOMGFXOXVLUzV5WlcxdmRtVkRiR0Z6Y3lnbmIzQmxiaWNwTG1Ga1pFTnNZWE56S0NkamJHOXpaV1FuS1R0Y2JseDBYSFJjZEZ4MEpDaHpaV04wYVc5dUtTNW1hVzVrS0NjdWRHbHVkQ2NwTG5KbGJXOTJaVU5zWVhOektDZHlaVzF2ZG1WVWFXNTBKeWt1WVdSa1EyeGhjM01vSjJGa1pGUnBiblFuS1R0Y2JseDBYSFJjZEZ4MEpDaHpaV04wYVc5dUtTNW1hVzVrS0NjdVluVjBkRzl1TENCd0p5a3VjbVZ0YjNabFEyeGhjM01vSjJaaFpHVkpiaWNwTzF4dVhIUmNkRngwZlNrN1hHNWNkRngwZlZ4dVhIUmNkR04xY25KbGJuUlRaV04wYVc5dUxtWnBibVFvSnk1MGFXNTBKeWt1Y21WdGIzWmxRMnhoYzNNb0oyRmtaRlJwYm5RbktTNWhaR1JEYkdGemN5Z25jbVZ0YjNabFZHbHVkQ2NwTzF4dVhIUjlLVHRjYmx4dUx5OGdRMDlPVkZKUFRDQkdUMDlVUlZJZ1FWSlNUMWNnUTB4SlEwdFRMaUJjWEZ4Y1hHNWNibHgwSkNnbkkyUnZkMjVCY25KdmR5Y3BMbU5zYVdOcktDZ3BJRDArSUh0Y2JseDBYSFJwWmlna0tIZHBibVJ2ZHlrdWFHVnBaMmgwS0NrZ0tpQW9KQ2duTG5CaFoyVW5LUzVzWlc1bmRHZ2dMU0F4S1NBOVBUMGdMU0FrS0NjamMyTnliMnhzWlhKWGNtRndjR1Z5SnlrdWIyWm1jMlYwS0NrdWRHOXdLU0I3WEc1Y2RDQWdYSFFrS0NjamMyTnliMnhzWlhKWGNtRndjR1Z5SnlrdWJXOTJaVlJ2S0RFcE8xeHVYSFJjZEgwZ1pXeHpaU0I3WEc1Y2RGeDBYSFFrS0NjamMyTnliMnhzWlhKWGNtRndjR1Z5SnlrdWJXOTJaVVJ2ZDI0b0tUdGNibHgwWEhSOVhHNWNkSDBwTzF4dVhHNHZMeUJJU1VSRklGUklSU0JNVDBGRVNVNUhJRUZPU1UxQlZFbFBVRTRnVjBoRlRpQldTVVJGVHlCSlV5QlNSVUZFV1NCVVR5QlFURUZaSUU5T0lFUkZXRXRVVDFBdUlGeGNYRnhjYmx4dVhIUmpiMjV6ZENCb2FXUmxURzloWkdsdVowRnVhVzFoZEdsdmJpQTlJQ2dwSUQwK0lIdGNibHgwWEhScFppaDNhVzVrYjNjdWFXNXVaWEpYYVdSMGFDQStJRGd3TUNBbUppQWhKQ2duSTJ4dllXUnBibWNuS1M1b1lYTkRiR0Z6Y3lnbmFHbGtaR1Z1SnlrcElIdGNibHh1WEhSY2RGeDBhV1lvSkNnbkkzWnBaR1Z2SnlrdVoyVjBLREFwTG5KbFlXUjVVM1JoZEdVZ1BUMDlJRFFwSUh0Y2JseDBYSFJjZEZ4MEpDZ25JMnh2WVdScGJtY25LUzVoWkdSRGJHRnpjeWduYUdsa1pHVnVKeWs3WEc1Y2RGeDBYSFI5WEc1Y2RGeDBmVnh1WEhSOVhHNWNibHgwYkdWMElITmxZM1JwYjI0elFYVjBiMjFoZEdWa0xDQmhkWFJ2YldGMFpWTmxZM1JwYjI0ekxDQnpaV04wYVc5dU5FRjFkRzl0WVhSbFpDd2dZWFYwYjIxaGRHVlRaV04wYVc5dU5EdGNiaTh2SUUxQlRrRkhSVTFGVGxRZ1JsVk9RMVJKVDA0Z1JrOVNJRk5GVkZSSlRrY2dRVTVFSUVOTVJVRlNTVTVISUZSSVJTQlRURWxFUlNCQlZWUlBUVUZVU1U5T0lFbE9WRVZTVmtGTVV5NGdYRnhjWEZ4dVhHNWNkR052Ym5OMElHbHVkR1Z5ZG1Gc1RXRnVZV2RsY2lBOUlDaG1iR0ZuTENCelpXTjBhVzl1U1dRc0lIUnBiV1VwSUQwK0lIdGNiaUFnSUZ4MGFXWW9abXhoWnlrZ2UxeHVJQ0FnWEhSY2RHbG1LSE5sWTNScGIyNUpaQ0E5UFQwZ0ozTmxZM1JwYjI0ekp5a2dlMXh1SUNBZ1hIUmNkRngwWVhWMGIyMWhkR1ZUWldOMGFXOXVNeUE5SUhObGRFbHVkR1Z5ZG1Gc0tDZ3BJRDArSUh0Y2JseDBJQ0FnSUNCY2RGeDBjM2RwY0dWRGIyNTBjbTlzYkdWeUtITmxZM1JwYjI1SlpDd2dKMnduS1R0Y2RGeHVYSFFnSUNBZ0lGeDBmU3dnZEdsdFpTazdYRzRnSUNCY2RGeDBmVnh1SUNBZ1hIUmNkR2xtS0hObFkzUnBiMjVKWkNBOVBUMGdKM05sWTNScGIyNDBKeWtnZTF4dUlDQWdYSFJjZEZ4MFlYVjBiMjFoZEdWVFpXTjBhVzl1TkNBOUlITmxkRWx1ZEdWeWRtRnNLQ2dwSUQwK0lIdGNibHgwSUNBZ0lDQmNkRngwYzNkcGNHVkRiMjUwY205c2JHVnlLSE5sWTNScGIyNUpaQ3dnSjJ3bktUdGNkRnh1WEhRZ0lDQWdJRngwZlN3Z2RHbHRaU2s3WEc0Z0lDQmNkRngwZlZ4dUlDQWdJQ0JjZENCY2JpQWdJRngwZlNCbGJITmxJSHRjYmlBZ0lGeDBYSFJwWmloelpXTjBhVzl1U1dRZ1BUMDlJQ2R6WldOMGFXOXVNeWNwSUh0Y2JpQWdJQ0JjZEZ4MFkyeGxZWEpKYm5SbGNuWmhiQ2hoZFhSdmJXRjBaVk5sWTNScGIyNHpLVHRjYmlBZ0lDQmNkSDFjYmlBZ0lDQmNkR2xtS0hObFkzUnBiMjVKWkNBOVBUMGdKM05sWTNScGIyNDBKeWtnZTF4dUlDQWdJRngwWEhSamJHVmhja2x1ZEdWeWRtRnNLR0YxZEc5dFlYUmxVMlZqZEdsdmJqUXBPMXh1SUNBZ0lGeDBmVnh1SUNBZ1hIUjlYRzVjZEgwN1hHNWNiaTh2SUVsR0lFNVBWQ0JKVGlCRFRWTWdRVVJOU1U0Z1VGSkZWa2xGVnl3Z1VFVlNVRVZVVlVGTVRGa2dRMGhGUTBzZ1NVWWdWMFVnUVZKRklFRlVJRlJJUlNCVVQxQWdUMFlnVkVoRklGQkJSMFVnUVU1RUlFbEdJRk5QTENCRVQwNVVJRk5JVDFjZ1ZFaEZJRVpQVDFSRlVpQlBVaUJIVWtWRlRpQlRTRUZRUlM0Z1hGeGNYRnh1WEc1Y2RHbG1LQ0VrS0d4dlkyRjBhVzl1S1M1aGRIUnlLQ2RvY21WbUp5a3VhVzVqYkhWa1pYTW9KMmx1WkdWNExuQm9jQ2NwS1NCN1hHNWNkRngwYzJWMFNXNTBaWEoyWVd3b0tDa2dQVDRnZTF4dVhIUmNkRngwYVdZb0pDZ25JM05qY205c2JHVnlWM0poY0hCbGNpY3BMbTltWm5ObGRDZ3BMblJ2Y0NBK1BTQXdLU0I3WEc1Y2RGeDBYSFJjZENRb0p5Tm9aV0ZrWlhKVGFHRndaU3dnSTJadmIzUmxjaWNwTG1Ga1pFTnNZWE56S0NkdGIzWmxUMlptVTJOeVpXVnVKeWs3WEc1Y2RGeDBYSFJjZENRb0p5TjJhV1JsYnljcExtZGxkQ2d3S1M1d2JHRjVLQ2s3WEc1Y2RGeDBYSFJjZENRb0p5NWhjbkp2ZHljcExtRmtaRU5zWVhOektDZHdkV3h6WVhSbEp5azdYRzVjZEZ4MFhIUjlJR1ZzYzJVZ2UxeHVYSFJjZEZ4MFhIUjJZWElnZEdsdFpXOTFkQ0E5SUhObGRGUnBiV1Z2ZFhRb0tDa2dQVDRnZTF4dVhIUmNkRngwWEhSY2RDUW9KeU5vWldGa1pYSlRhR0Z3WlN3Z0kyWnZiM1JsY2ljcExuSmxiVzkyWlVOc1lYTnpLQ2R0YjNabFQyWm1VMk55WldWdUp5azdYRzVjZEZ4MFhIUmNkRngwSkNnbkkzWnBaR1Z2SnlrdVoyVjBLREFwTG5CaGRYTmxLQ2s3WEc1Y2RGeDBYSFJjZEZ4MEpDZ25MbUZ5Y205M0p5a3VjbVZ0YjNabFEyeGhjM01vSjNCMWJITmhkR1VuS1R0Y2JseDBYSFJjZEZ4MFhIUmpiR1ZoY2xScGJXVnZkWFFvZEdsdFpXOTFkQ2s3WEc1Y2RGeDBYSFJjZEgwc0lIUnBiV1VwTzF4dVhIUmNkRngwZlZ4dVhHNHZMeUJTVDFSQlZFVWdWRWhGSUVGU1VrOVhJRWxPSUZSSVJTQkdUMDlVUlZJZ1YwaEZUaUJCVkNCVVNFVWdRazlVVkU5TklFOUdJRlJJUlNCUVFVZEZJRnhjWEZ4Y2JseHVYSFJjZEZ4MGFXWW9KQ2duSTNOamNtOXNiR1Z5VjNKaGNIQmxjaWNwTG05bVpuTmxkQ2dwTG5SdmNDQThJQzBnS0hkcGJtUnZkeTVwYm01bGNraGxhV2RvZENBcUlEUXBLU0I3WEc1Y2RGeDBYSFJjZENRb0p5TmtiM2R1UVhKeWIzY25LUzVqYzNNb2V5ZDBjbUZ1YzJadmNtMG5PaUFuY205MFlYUmxLREU0TUdSbFp5a2dkSEpoYm5Oc1lYUmxXQ2d0TlRBbEtTZDlLVHRjYmx4MFhIUmNkSDBnWld4elpTQjdYRzVjZEZ4MFhIUmNkQ1FvSnlOa2IzZHVRWEp5YjNjbktTNWpjM01vZXlkMGNtRnVjMlp2Y20wbk9pQW5kSEpoYm5Oc1lYUmxXQ2d0TlRBbEtTQnliM1JoZEdVb01HUmxaeWtuZlNrN1hHNWNkRngwWEhSOVhHNWNibHgwWEhSY2RHaHBaR1ZNYjJGa2FXNW5RVzVwYldGMGFXOXVLQ2s3WEc1Y2JpOHZJRUZFUkNCTVFVNUVVME5CVUVVZ1UxUlpURVZUSUZSUElGSkZURVZXUVU1VUlFVk1SVTFGVGxSVElGeGNYRnhjYmx4dVhIUmNkRngwYVdZb2QybHVaRzkzTG0xaGRHTm9UV1ZrYVdFb1hDSW9iM0pwWlc1MFlYUnBiMjQ2SUd4aGJtUnpZMkZ3WlNsY0lpa3ViV0YwWTJobGN5QW1KaUIzYVc1a2IzY3VhVzV1WlhKWGFXUjBhQ0E4SURnd01Da2dlMXh1WEhSY2RGeDBJQ0FrS0NjdWJtRjJYMnhwYm1zc0lDTm9aV0ZrWlhKVGFHRndaU3dnSTJadmIzUmxjaXdnTG1OMWMzUnZiU3dnTG0xaGNtdGxjaXdnSTNObFkzUnBiMjQxTENBdWRHVjRkRmR5WVhCd1pYSW5LUzVoWkdSRGJHRnpjeWduYkdGdVpITmpZWEJsSnlrN1hHNWNkRngwWEhSOUlHVnNjMlVnZTF4dVhIUmNkRngwWEhRZ0pDZ25MbTVoZGw5c2FXNXJMQ0FqYUdWaFpHVnlVMmhoY0dVc0lDTm1iMjkwWlhJc0lDNWpkWE4wYjIwc0lDNXRZWEpyWlhJc0lDTnpaV04wYVc5dU5Td2dMblJsZUhSWGNtRndjR1Z5SnlrdWNtVnRiM1psUTJ4aGMzTW9KMnhoYm1SelkyRndaU2NwTzF4dVhIUmNkRngwZlZ4dVhHNWNkRngwWEhScFppZ2tLQ2NqYzJWamRHbHZiak11WVdOMGFYWmxKeWt1YkdWdVozUm9LU0I3SUM4dklFRlZWRTlOUVZSRklGUklSU0JUVEVsRVJWTWdUMDRnVTBWRFZFbFBVRTRnTXlCRlZrVlNXU0EzSUZORlEwOU9SRk1nU1VZZ1ZFaEZJRk5GUTFSSlQwNGdTVk1nUVVOVVNWWkZMaUJjWEZ4Y1hHNWNkRngwWEhSY2RHbG1LSE5sWTNScGIyNHpRWFYwYjIxaGRHVmtJQ0U5UFNCMGNuVmxLU0I3WEc1Y2RGeDBYSFJjZEZ4MGMyVmpkR2x2YmpOQmRYUnZiV0YwWldRZ1BTQjBjblZsTzF4dVhIUmNkRngwWEhSY2RHbHVkR1Z5ZG1Gc1RXRnVZV2RsY2loMGNuVmxMQ0FuYzJWamRHbHZiak1uTENBM01EQXdLVHRjYmx4MFhIUmNkRngwZlZ4dVhIUmNkRngwZlNCbGJITmxJSHNnTHk4Z1UxUlBVQ0JCVlZSUFRVRlVSVVFnVTB4SlJFVlRJRTlPSUZORlExUkpUMUJPSURNZ1NVWWdWRWhGSUZORlExUkpUMDRnU1ZNZ1RrOVVJRUZEVkVsV1JTNGdYRnhjWEZ4dVhIUmNkRngwWEhScFppaHpaV04wYVc5dU0wRjFkRzl0WVhSbFpDQTlQVDBnZEhKMVpTa2dlMXh1WEhSY2RGeDBYSFJjZEdsdWRHVnlkbUZzVFdGdVlXZGxjaWhtWVd4elpTd2dKM05sWTNScGIyNHpKeWs3WEc1Y2RGeDBYSFJjZEZ4MGMyVmpkR2x2YmpOQmRYUnZiV0YwWldRZ1BTQm1ZV3h6WlR0Y2JseDBYSFJjZEZ4MGZWeHVYSFJjZEZ4MGZWeHVYRzVjZEZ4MFhIUnBaaWdrS0NjamMyVmpkR2x2YmpRdVlXTjBhWFpsSnlrdWJHVnVaM1JvS1NCN0lDOHZJRUZWVkU5TlFWUkZJRlJJUlNCVFRFbEVSVk1nVDA0Z1UwVkRWRWxQVUU0Z05DQkZWa1ZTV1NBM0lGTkZRMDlPUkZNZ1NVWWdWRWhGSUZORlExUkpUMDRnU1ZNZ1FVTlVTVlpGTGlCY1hGeGNYRzVjZEZ4MFhIUmNkR2xtS0hObFkzUnBiMjQwUVhWMGIyMWhkR1ZrSUNFOVBTQjBjblZsS1NCN1hHNWNkRngwWEhSY2RGeDBjMlZqZEdsdmJqUkJkWFJ2YldGMFpXUWdQU0IwY25WbE8xeHVYSFJjZEZ4MFhIUmNkR2x1ZEdWeWRtRnNUV0Z1WVdkbGNpaDBjblZsTENBbmMyVmpkR2x2YmpRbkxDQTNNREF3S1R0Y2JseDBYSFJjZEZ4MGZWeHVYSFJjZEZ4MGZTQmxiSE5sSUhzZ0x5OGdVMVJQVUNCQlZWUlBUVUZVUlVRZ1UweEpSRVZUSUU5T0lGTkZRMVJKVDFCT0lEUWdTVVlnVkVoRklGTkZRMVJKVDA0Z1NWTWdUazlVSUVGRFZFbFdSUzRnWEZ4Y1hGeHVYSFJjZEZ4MFhIUnBaaWh6WldOMGFXOXVORUYxZEc5dFlYUmxaQ0E5UFQwZ2RISjFaU2tnZTF4dVhIUmNkRngwWEhSY2RHbHVkR1Z5ZG1Gc1RXRnVZV2RsY2lobVlXeHpaU3dnSjNObFkzUnBiMjQwSnlrN1hHNWNkRngwWEhSY2RGeDBjMlZqZEdsdmJqUkJkWFJ2YldGMFpXUWdQU0JtWVd4elpUdGNibHgwWEhSY2RGeDBmVnh1WEhSY2RGeDBmVnh1WEhSY2RIMHNJRFV3TUNrN1hHNWNkSDFjYmx4dUx5OGdRMDlPVkZKUFRDQlhTRUZVSUVoQlVGQkZUbE1nVjBoRlRpQk1TVTVMVXlCSlRpQlVTRVVnVGtGV0wwMUZUbFVnUVZKRklFTk1TVU5MUlVRZ1hGeGNYRnh1WEc1Y2RDUW9KeTV1WVhaZmJHbHVheWNwTG1Oc2FXTnJLQ2hsS1NBOVBpQjdYRzVjZEZ4MFkyOXVjM1FnY0dGblpVbGtlQ0E5SUhCaGNuTmxTVzUwS0NRb1pTNTBZWEpuWlhRcExtRjBkSElvSjJSaGRHRXRhVzVrWlhnbktTazdYRzVjZEZ4MEpDZ25JM05qY205c2JHVnlWM0poY0hCbGNpY3BMbTF2ZG1WVWJ5aHdZV2RsU1dSNEtUdGNibHgwWEhRa0tDY2piV1Z1ZFVKc2IyTnJUM1YwSnlrdVlXUmtRMnhoYzNNb0oyaHBaR1JsYmljcE8xeHVYRzVjZEZ4MGFXWW9ZblZ5WjJWeUxtTnNZWE56VEdsemRDNWpiMjUwWVdsdWN5Z25ZblZ5WjJWeUxTMWhZM1JwZG1VbktTa2dlMXh1SUNBZ0lDQWdibUYyTG1Oc1lYTnpUR2x6ZEM1eVpXMXZkbVVvSjI1aGRsOXZjR1Z1SnlrN1hHNGdJQ0FnSUNCaWRYSm5aWEl1WTJ4aGMzTk1hWE4wTG5KbGJXOTJaU2duWW5WeVoyVnlMUzFoWTNScGRtVW5LVHRjYmlBZ0lDQWdJR1J2WTNWdFpXNTBMbUp2WkhrdWMzUjViR1V1Y0c5emFYUnBiMjRnUFNBbmNtVnNZWFJwZG1Vbk8xeHVJQ0FnSUgwZ1hHNWNkSDBwTzF4dVhHNHZMeUJYU0VWT0lGUklSU0JPUVZZZ1NWTWdUMUJGVGlCUVVrVldSVTVVSUZWVFJWSWdSbEpQVFNCQ1JVbE9SeUJCUWt4RklGUlBJRU5NU1VOTElFRk9XVlJJU1U1SElFVk1VMFVnWEZ4Y1hGeHVYRzVjZENRb0p5TnRaVzUxUW14dlkydFBkWFFuS1M1amJHbGpheWdvWlNrZ1BUNGdlMXh1WEhRZ0lDQmxMbk4wYjNCUWNtOXdZV2RoZEdsdmJpZ3BPMXh1WEhSOUtUdGNibHh1WEhSMllYSWdZblZ5WjJWeUlEMGdaRzlqZFcxbGJuUXVaMlYwUld4bGJXVnVkRUo1U1dRb0oyMWhhVzR0WW5WeVoyVnlKeWtzSUZ4dUlDQnVZWFlnUFNCa2IyTjFiV1Z1ZEM1blpYUkZiR1Z0Wlc1MFFubEpaQ2duYldGcGJrNWhkaWNwTzF4dVhHNHZMeUJEVDA1VVVrOU1JRVpQVWlCUFVFVk9JRUZPUkNCRFRFOVRTVTVISUZSSVJTQk5SVTVWTDA1QlZpQWdYRnhjWEZ4dVhHNGdJR1oxYm1OMGFXOXVJRzVoZGtOdmJuUnliMndvS1NCN1hHNWNiaUFnSUNCcFppaGlkWEpuWlhJdVkyeGhjM05NYVhOMExtTnZiblJoYVc1ektDZGlkWEpuWlhJdExXRmpkR2wyWlNjcEtTQjdYRzRnSUNBZ0lDQnVZWFl1WTJ4aGMzTk1hWE4wTG5KbGJXOTJaU2duYm1GMlgyOXdaVzRuS1R0Y2JpQWdJQ0FnSUdKMWNtZGxjaTVqYkdGemMweHBjM1F1Y21WdGIzWmxLQ2RpZFhKblpYSXRMV0ZqZEdsMlpTY3BPMXh1SUNBZ0lDQWdKQ2duSTIxbGJuVkNiRzlqYTA5MWRDY3BMbUZrWkVOc1lYTnpLQ2RvYVdSa1pXNG5LVHRjYmlBZ0lDQjlJRnh1SUNBZ0lHVnNjMlVnZTF4dUlDQWdJQ0FnWW5WeVoyVnlMbU5zWVhOelRHbHpkQzVoWkdRb0oySjFjbWRsY2kwdFlXTjBhWFpsSnlrN1hHNGdJQ0FnSUNCdVlYWXVZMnhoYzNOTWFYTjBMbUZrWkNnbmJtRjJYMjl3Wlc0bktUdGNiaUFnSUNBZ0lDUW9KeU50Wlc1MVFteHZZMnRQZFhRbktTNXlaVzF2ZG1WRGJHRnpjeWduYUdsa1pHVnVKeWs3WEc0Z0lDQWdmVnh1SUNCOVhHNGdJRnh1THk4Z1QwNU1XU0JNU1ZOVVJVNGdSazlTSUUxRlRsVWdRMHhKUTB0VElGZElSVTRnVGs5VUlFbE9JRU5OVXlCUVVrVldTVVZYSUUxUFJFVWdYRnhjWEZ4dVhHNGdJR2xtS0NFa0tHeHZZMkYwYVc5dUtTNWhkSFJ5S0Nkb2NtVm1KeWt1YVc1amJIVmtaWE1vSjJsdVpHVjRMbkJvY0NjcEtTQjdYRzRnSUZ4MFluVnlaMlZ5TG1Ga1pFVjJaVzUwVEdsemRHVnVaWElvSjJOc2FXTnJKeXdnYm1GMlEyOXVkSEp2YkNrN1hHNGdJSDFjYmx4dUx5OGdRMHhQVTBVZ1ZFaEZJRTVCVmlCSlJpQlVTRVVnVjBsT1JFOVhJRWxUSUU5V1JWSWdNVEF3TUZCWUlGZEpSRVVnWEZ4Y1hGeHVYRzRnSUhkcGJtUnZkeTVoWkdSRmRtVnVkRXhwYzNSbGJtVnlLQ2R5WlhOcGVtVW5MQ0JtZFc1amRHbHZiaWdwSUh0Y2JpQWdJQ0JwWmloM2FXNWtiM2N1YVc1dVpYSlhhV1IwYUNBK0lERXdNREFnSmlZZ2JtRjJMbU5zWVhOelRHbHpkQzVqYjI1MFlXbHVjeWduYm1GMlgyOXdaVzRuS1NrZ2UxeHVJQ0FnSUNBZ2JtRjJRMjl1ZEhKdmJDZ3BPMXh1SUNBZ0lDQWdibUYyTG1Oc1lYTnpUR2x6ZEM1eVpXMXZkbVVvSjI1aGRsOXZjR1Z1SnlrN1hHNGdJQ0FnSUNBZ0pDZ25JMjFsYm5WQ2JHOWphMDkxZENjcExtRmtaRU5zWVhOektDZG9hV1JrWlc0bktUdGNiaUFnSUNCOVhHNGdJSDBwTzF4dVhHNHZMeUJVU0VsVElGTkZWQ0JQUmlCSlJpQlRWRUZVUlUxRlRsUlRJRWxPU1ZSSlFVeEpVMFZUSUZSSVJTQlRVRVZUU1VaSlF5QlFRVWRGVXlCR1QxSWdVRkpGVmtsRlYwbE9SeUJKVGlCRFRWTWdRVVJOU1U0dUlGeGNYRnhjYmx4dUlDQnBaaWdrS0d4dlkyRjBhVzl1S1M1aGRIUnlLQ2RvY21WbUp5a3VhVzVqYkhWa1pYTW9KMmx1WkdWNExuQm9jQ2NwS1NCN1hHNWNkRngwYVdZb0pDaHNiMk5oZEdsdmJpa3VZWFIwY2lnbmFISmxaaWNwTG1sdVkyeDFaR1Z6S0NkcGJXRm5hVzVsTFdsbUp5a3BJSHRjYmx4MFhIUmNkSEJoWjJWTWIyRmtaWElvTkNrN1hHNWNkRngwZlZ4dVhIUmNkR2xtS0NRb2JHOWpZWFJwYjI0cExtRjBkSElvSjJoeVpXWW5LUzVwYm1Oc2RXUmxjeWduYUc5M0xYZGxMV2x1Ym05MllYUmxKeWtwSUh0Y2JseDBYSFJjZEhCaFoyVk1iMkZrWlhJb015azdYRzVjZEZ4MGZWeHVYSFJjZEdsbUtDUW9iRzlqWVhScGIyNHBMbUYwZEhJb0oyaHlaV1luS1M1cGJtTnNkV1JsY3lnbmQyOXlheTEzYVhSb0xYVnpKeWtwSUh0Y2JseDBYSFJjZEhCaFoyVk1iMkZrWlhJb05TazdYRzVjZEZ4MGZWeHVYSFJjZEdsbUtDUW9iRzlqWVhScGIyNHBMbUYwZEhJb0oyaHlaV1luS1M1cGJtTnNkV1JsY3lnblkyOXVkR0ZqZEMxMWN5Y3BLU0I3WEc1Y2RGeDBYSFJ3WVdkbFRHOWhaR1Z5S0RZcE8xeHVYSFJjZEgxY2JseDBYSFJwWmlna0tHeHZZMkYwYVc5dUtTNWhkSFJ5S0Nkb2NtVm1KeWt1YVc1amJIVmtaWE1vSjJodmJXVXRkbWxrWlc4bktTa2dlMXh1WEhSY2RGeDBjMlYwU1c1MFpYSjJZV3dvS0NrZ1BUNGdlMXh1WEhSY2RGeDBYSFJvYVdSbFRHOWhaR2x1WjBGdWFXMWhkR2x2YmlncE8xeHVYSFJjZEZ4MGZTd2dOVEF3S1Z4dVhIUmNkSDFjYmx4MGZWeHVYRzR2THlCVFYwbFFSU0JGVmtWT1ZGTWdSRVZVUlVOVVQxSWdSbFZPUTFSSlQwNGdYRnhjWEZ4dVhHNGdJR1oxYm1OMGFXOXVJR1JsZEdWamRITjNhWEJsS0dWc0xDQm1kVzVqS1NCN1hHNWNkQ0FnYkdWMElITjNhWEJsWDJSbGRDQTlJSHQ5TzF4dVhIUWdJSE4zYVhCbFgyUmxkQzV6V0NBOUlEQTdJSE4zYVhCbFgyUmxkQzV6V1NBOUlEQTdJSE4zYVhCbFgyUmxkQzVsV0NBOUlEQTdJSE4zYVhCbFgyUmxkQzVsV1NBOUlEQTdYRzVjZENBZ2RtRnlJRzFwYmw5NElEMGdNekE3SUNBdkwyMXBiaUI0SUhOM2FYQmxJR1p2Y2lCb2IzSnBlbTl1ZEdGc0lITjNhWEJsWEc1Y2RDQWdkbUZ5SUcxaGVGOTRJRDBnTXpBN0lDQXZMMjFoZUNCNElHUnBabVpsY21WdVkyVWdabTl5SUhabGNuUnBZMkZzSUhOM2FYQmxYRzVjZENBZ2RtRnlJRzFwYmw5NUlEMGdOVEE3SUNBdkwyMXBiaUI1SUhOM2FYQmxJR1p2Y2lCMlpYSjBhV05oYkNCemQybHdaVnh1WEhRZ0lIWmhjaUJ0WVhoZmVTQTlJRFl3T3lBZ0x5OXRZWGdnZVNCa2FXWm1aWEpsYm1ObElHWnZjaUJvYjNKcGVtOXVkR0ZzSUhOM2FYQmxYRzVjZENBZ2RtRnlJR1JwY21WaklEMGdYQ0pjSWp0Y2JseDBJQ0JzWlhRZ1pXeGxJRDBnWkc5amRXMWxiblF1WjJWMFJXeGxiV1Z1ZEVKNVNXUW9aV3dwTzF4dVhIUWdJR1ZzWlM1aFpHUkZkbVZ1ZEV4cGMzUmxibVZ5S0NkMGIzVmphSE4wWVhKMEp5eG1kVzVqZEdsdmJpaGxLWHRjYmx4MElDQWdJSFpoY2lCMElEMGdaUzUwYjNWamFHVnpXekJkTzF4dVhIUWdJQ0FnYzNkcGNHVmZaR1YwTG5OWUlEMGdkQzV6WTNKbFpXNVlPeUJjYmx4MElDQWdJSE4zYVhCbFgyUmxkQzV6V1NBOUlIUXVjMk55WldWdVdUdGNibHgwSUNCOUxHWmhiSE5sS1R0Y2JseDBJQ0JsYkdVdVlXUmtSWFpsYm5STWFYTjBaVzVsY2lnbmRHOTFZMmh0YjNabEp5eG1kVzVqZEdsdmJpaGxLWHRjYmx4MElDQWdJR1V1Y0hKbGRtVnVkRVJsWm1GMWJIUW9LVHRjYmx4MElDQWdJSFpoY2lCMElEMGdaUzUwYjNWamFHVnpXekJkTzF4dVhIUWdJQ0FnYzNkcGNHVmZaR1YwTG1WWUlEMGdkQzV6WTNKbFpXNVlPeUJjYmx4MElDQWdJSE4zYVhCbFgyUmxkQzVsV1NBOUlIUXVjMk55WldWdVdUc2dJQ0FnWEc1Y2RDQWdmU3htWVd4elpTazdYRzVjZENBZ1pXeGxMbUZrWkVWMlpXNTBUR2x6ZEdWdVpYSW9KM1J2ZFdOb1pXNWtKeXhtZFc1amRHbHZiaWhsS1h0Y2JseDBJQ0FnSUM4dmFHOXlhWHB2Ym5SaGJDQmtaWFJsWTNScGIyNWNibHgwSUNBZ0lHbG1JQ2dvS0NoemQybHdaVjlrWlhRdVpWZ2dMU0J0YVc1ZmVDQStJSE4zYVhCbFgyUmxkQzV6V0NrZ2ZId2dLSE4zYVhCbFgyUmxkQzVsV0NBcklHMXBibDk0SUR3Z2MzZHBjR1ZmWkdWMExuTllLU2tnSmlZZ0tDaHpkMmx3WlY5a1pYUXVaVmtnUENCemQybHdaVjlrWlhRdWMxa2dLeUJ0WVhoZmVTa2dKaVlnS0hOM2FYQmxYMlJsZEM1eldTQStJSE4zYVhCbFgyUmxkQzVsV1NBdElHMWhlRjk1S1NBbUppQW9jM2RwY0dWZlpHVjBMbVZZSUQ0Z01Da3BLU2tnZTF4dVhIUWdJQ0FnSUNCcFppaHpkMmx3WlY5a1pYUXVaVmdnUGlCemQybHdaVjlrWlhRdWMxZ3BJR1JwY21WaklEMGdYQ0p5WENJN1hHNWNkQ0FnSUNBZ0lHVnNjMlVnWkdseVpXTWdQU0JjSW14Y0lqdGNibHgwSUNBZ0lIMWNibHgwSUNBZ0lDOHZkbVZ5ZEdsallXd2daR1YwWldOMGFXOXVYRzVjZENBZ0lDQmxiSE5sSUdsbUlDZ29LQ2h6ZDJsd1pWOWtaWFF1WlZrZ0xTQnRhVzVmZVNBK0lITjNhWEJsWDJSbGRDNXpXU2tnZkh3Z0tITjNhWEJsWDJSbGRDNWxXU0FySUcxcGJsOTVJRHdnYzNkcGNHVmZaR1YwTG5OWktTa2dKaVlnS0NoemQybHdaVjlrWlhRdVpWZ2dQQ0J6ZDJsd1pWOWtaWFF1YzFnZ0t5QnRZWGhmZUNrZ0ppWWdLSE4zYVhCbFgyUmxkQzV6V0NBK0lITjNhWEJsWDJSbGRDNWxXQ0F0SUcxaGVGOTRLU0FtSmlBb2MzZHBjR1ZmWkdWMExtVlpJRDRnTUNrcEtTa2dlMXh1WEhRZ0lDQWdJQ0JwWmloemQybHdaVjlrWlhRdVpWa2dQaUJ6ZDJsd1pWOWtaWFF1YzFrcElHUnBjbVZqSUQwZ1hDSmtYQ0k3WEc1Y2RDQWdJQ0FnSUdWc2MyVWdaR2x5WldNZ1BTQmNJblZjSWp0Y2JseDBJQ0FnSUgxY2JseHVYSFFnSUNBZ2FXWWdLR1JwY21WaklDRTlJRndpWENJcElIdGNibHgwSUNBZ0lDQWdhV1lvZEhsd1pXOW1JR1oxYm1NZ1BUMGdKMloxYm1OMGFXOXVKeWtnWm5WdVl5aGxiQ3hrYVhKbFl5azdYRzVjZENBZ0lDQjlYRzVjZENBZ0lDQnNaWFFnWkdseVpXTWdQU0JjSWx3aU8xeHVYSFFnSUNBZ2MzZHBjR1ZmWkdWMExuTllJRDBnTURzZ2MzZHBjR1ZmWkdWMExuTlpJRDBnTURzZ2MzZHBjR1ZmWkdWMExtVllJRDBnTURzZ2MzZHBjR1ZmWkdWMExtVlpJRDBnTUR0Y2JseDBJQ0I5TEdaaGJITmxLVHNnSUZ4dVhIUjlYRzVjYmk4dklFTklUMU5GSUZSSVJTQk9SVmhVSUZOTVNVUkZJRlJQSUZOSVQxY2dRVTVFSUVOTVNVTkxJRlJJUlNCUVFVZEpUa0ZVU1U5T0lFSlZWRlJQVGlCVVNFRlVJRkpGVEVGVVJWTWdWRThnU1ZRdUlGeGNYRnhjYmx4dVhIUmpiMjV6ZENCemQybHdaVU52Ym5SeWIyeHNaWElnUFNBb1pXd3NJR1FwSUQwK0lIdGNibHh1WEhSY2RHbG1LR1ZzSUQwOVBTQW5jMlZqZEdsdmJqUW5LU0I3WEc1Y2JseDBYSFJjZEdOdmJuTjBJSE5sWTNScGIyNDBVR0ZuYVc1aGRHbHZia3hsYm1kMGFDQTlJQ1FvSnk1elpXTjBhVzl1TkZCaFoybHVZWFJ2Y2tKMWRIUnZiaWNwTG14bGJtZDBhRHRjYmx4dVhIUmNkRngwYVdZb1pDQTlQVDBnSjJ3bktTQjdYRzVjYmx4MFhIUmNkRngwYVdZb2MyVmpkR2x2YmpSSlpIZ2dQQ0J6WldOMGFXOXVORkJoWjJsdVlYUnBiMjVNWlc1bmRHZ2dMU0F4S1NCN1hHNWNkRngwWEhSY2RGeDBjMlZqZEdsdmJqUkpaSGdyS3p0Y2JseDBYSFJjZEZ4MGZTQmxiSE5sSUh0Y2JseDBYSFJjZEZ4MFhIUnpaV04wYVc5dU5FbGtlQ0E5SURBN1hHNWNkRngwWEhSY2RIMWNibHgwWEhSY2RGeDBYRzVjZEZ4MFhIUmNkQ1FvSnk1elpXTjBhVzl1TkZCaFoybHVZWFJ2Y2tKMWRIUnZiaWNwVzNObFkzUnBiMjQwU1dSNFhTNWpiR2xqYXlncE8xeHVYSFJjZEZ4MGZWeHVYSFJjZEZ4MGFXWW9aQ0E5UFQwZ0ozSW5LU0I3WEc1Y2JseDBYSFJjZEZ4MGFXWW9jMlZqZEdsdmJqUkpaSGdnUGlBd0tTQjdYRzVjZEZ4MFhIUmNkRngwYzJWamRHbHZialJKWkhndExUdGNibHgwWEhSY2RGeDBmU0JsYkhObElIdGNibHgwWEhSY2RGeDBYSFJ6WldOMGFXOXVORWxrZUNBOUlITmxZM1JwYjI0MFVHRm5hVzVoZEdsdmJreGxibWQwYUNBdElERTdYRzVjZEZ4MFhIUmNkSDFjYmx4dVhIUmNkRngwWEhRa0tDY3VjMlZqZEdsdmJqUlFZV2RwYm1GMGIzSkNkWFIwYjI0bktWdHpaV04wYVc5dU5FbGtlRjB1WTJ4cFkyc29LVHRjYmx4MFhIUmNkSDFjYmx4MFhIUjlYRzVjZEZ4MGFXWW9aV3dnUFQwOUlDZHpaV04wYVc5dU15Y3BJSHRjYmx4dVhIUmNkRngwWTI5dWMzUWdjMlZqZEdsdmJqTlFZV2RwYm1GMGFXOXVUR1Z1WjNSb0lEMGdKQ2duTG5ObFkzUnBiMjR6VUdGbmFXNWhkRzl5UW5WMGRHOXVKeWt1YkdWdVozUm9PMXh1WEc1Y2RGeDBYSFJwWmloa0lEMDlQU0FuYkNjcElIdGNibHh1WEhSY2RGeDBYSFJwWmloelpXTjBhVzl1TTBsa2VDQThJSE5sWTNScGIyNHpVR0ZuYVc1aGRHbHZia3hsYm1kMGFDQXRJREVwSUh0Y2JseDBYSFJjZEZ4MFhIUnpaV04wYVc5dU0wbGtlQ3NyTzF4dVhIUmNkRngwWEhSOUlHVnNjMlVnZTF4dVhIUmNkRngwWEhSY2RITmxZM1JwYjI0elNXUjRJRDBnTUR0Y2JseDBYSFJjZEZ4MGZWeHVYSFJjZEZ4MFhIUmNibHgwWEhSY2RGeDBKQ2duTG5ObFkzUnBiMjR6VUdGbmFXNWhkRzl5UW5WMGRHOXVKeWxiYzJWamRHbHZiak5KWkhoZExtTnNhV05yS0NrN1hHNWNkRngwWEhSOVhHNWNkRngwWEhScFppaGtJRDA5UFNBbmNpY3BJSHRjYmx4dVhIUmNkRngwWEhScFppaHpaV04wYVc5dU0wbGtlQ0ErSURBcElIdGNibHgwWEhSY2RGeDBYSFJ6WldOMGFXOXVNMGxrZUMwdE8xeHVYSFJjZEZ4MFhIUjlJR1ZzYzJVZ2UxeHVYSFJjZEZ4MFhIUmNkSE5sWTNScGIyNHpTV1I0SUQwZ2MyVmpkR2x2YmpOUVlXZHBibUYwYVc5dVRHVnVaM1JvSUMwZ01UdGNibHgwWEhSY2RGeDBmVnh1WEhSY2RGeDBYSFJjYmx4MFhIUmNkRngwSkNnbkxuTmxZM1JwYjI0elVHRm5hVzVoZEc5eVFuVjBkRzl1SnlsYmMyVmpkR2x2YmpOSlpIaGRMbU5zYVdOcktDazdYRzVjZEZ4MFhIUjlYRzVjZEZ4MGZWeHVYSFI5WEc1Y2JpOHZJRWxPU1ZSSlFWUkZJRVpQVWlCVFYwbFFSU0JFUlZSRlExUkpUMDRnVDA0Z1UwVkRWRWxQVGxNZ015QkJUa1FnTkNCRldFTkZVRlFnU1U0Z1FVUk5TVTRnVUZKRlZrbEZWeTRnWEZ4Y1hGeHVYRzVjZEdsbUtDRWtLR3h2WTJGMGFXOXVLUzVoZEhSeUtDZG9jbVZtSnlrdWFXNWpiSFZrWlhNb0oybHVaR1Y0TG5Cb2NDY3BLU0I3WEc1Y2RGeDBaR1YwWldOMGMzZHBjR1VvSjNObFkzUnBiMjQwSnl3Z2MzZHBjR1ZEYjI1MGNtOXNiR1Z5S1R0Y2JseDBYSFJrWlhSbFkzUnpkMmx3WlNnbmMyVmpkR2x2YmpNbkxDQnpkMmx3WlVOdmJuUnliMnhzWlhJcE8xeHVYSFI5WEc1OUtUc2lYWDA9XG59KS5jYWxsKHRoaXMscmVxdWlyZShcImZzb3Z6NlwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL2Zha2VfZjJjMTgzOTIuanNcIixcIi9cIikiXX0=
