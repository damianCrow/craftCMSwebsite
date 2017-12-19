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
		}).then(function (spriteObj) {
			var IdleFrame = filterByValue(spriteObj.frames, 'idle');
			masterObj.football.animationArray = [].concat(_toConsumableArray(IdleFrame), _toConsumableArray(filterByValue(spriteObj.frames, 'football')));
			masterObj.tennis.animationArray = [].concat(_toConsumableArray(IdleFrame), _toConsumableArray(filterByValue(spriteObj.frames, 'tennis')));
			masterObj.baseball.animationArray = [].concat(_toConsumableArray(IdleFrame), _toConsumableArray(filterByValue(spriteObj.frames, 'baseball')));
			masterObj.basketball.animationArray = [].concat(_toConsumableArray(IdleFrame), _toConsumableArray(filterByValue(spriteObj.frames, 'basket')));
			masterObj.fan.animationArray = [].concat(_toConsumableArray(IdleFrame), _toConsumableArray(filterByValue(spriteObj.frames, 'fan')));

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZha2VfODMwMGZkOTEuanMiXSwibmFtZXMiOlsidGltZSIsInNlY3Rpb24zSWR4Iiwic2VjdGlvbjRJZHgiLCJ0ZW5uaXNBbmltYXRpb24iLCJmb290YmFsbEFuaW1hdGlvbiIsImJhc2tldGJhbGxBbmltYXRpb24iLCJiYXNlYmFsbEFuaW1hdGlvbiIsImZhbkFuaW1hdGlvbiIsIm1hc3Rlck9iaiIsInNlY3Rpb24yQ3VycmVudElkeCIsInNlY3Rpb24xQ3VycmVudElkeCIsImJhc2tldGJhbGwiLCJsb29wQW1vdW50IiwibG9vcElkIiwiZm9vdGJhbGwiLCJ0ZW5uaXMiLCJiYXNlYmFsbCIsImZhbiIsImhvbWVwYWdlTW9iSW1hZ2VzIiwiJCIsImRvY3VtZW50IiwicmVhZHkiLCJ3aW5kb3ciLCJpbm5lcldpZHRoIiwiZmV0Y2giLCJ0aGVuIiwicmVzcG9uc2UiLCJqc29uIiwic3ByaXRlT2JqIiwiSWRsZUZyYW1lIiwiZmlsdGVyQnlWYWx1ZSIsImZyYW1lcyIsImFuaW1hdGlvbkFycmF5IiwiYW5pbWF0b3JTZXR1cCIsImltYWdlQ29udHJvbGVyIiwic2V0SW50ZXJ2YWwiLCJhcnJheSIsInN0cmluZyIsImZpbHRlciIsIm8iLCJ0b0xvd2VyQ2FzZSIsImluY2x1ZGVzIiwibGFzdFRpbWUiLCJ2ZW5kb3JzIiwieCIsImxlbmd0aCIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwiY2FsbGJhY2siLCJlbGVtZW50IiwiY3VyclRpbWUiLCJEYXRlIiwiZ2V0VGltZSIsInRpbWVUb0NhbGwiLCJNYXRoIiwibWF4IiwiaWQiLCJzZXRUaW1lb3V0IiwiY2xlYXJUaW1lb3V0IiwiYW5pbWF0b3IiLCJhbmltYXRpb25PYmoiLCJkYW5jaW5nSWNvbiIsInNwcml0ZUltYWdlIiwiY2FudmFzIiwiZ2FtZUxvb3AiLCJhZGRDbGFzcyIsInVwZGF0ZSIsInJlbmRlciIsInNwcml0ZSIsIm9wdGlvbnMiLCJ0aGF0IiwiZnJhbWVJbmRleCIsInRpY2tDb3VudCIsImxvb3BDb3VudCIsInRpY2tzUGVyRnJhbWUiLCJudW1iZXJPZkZyYW1lcyIsImNvbnRleHQiLCJ3aWR0aCIsImhlaWdodCIsImltYWdlIiwibG9vcHMiLCJjbGVhclJlY3QiLCJkcmF3SW1hZ2UiLCJmcmFtZSIsInkiLCJnZXRFbGVtZW50QnlJZCIsIkltYWdlIiwiZ2V0Q29udGV4dCIsImFkZEV2ZW50TGlzdGVuZXIiLCJzcmMiLCJwYWdlTG9hZGVyIiwiaW5kZXgiLCJyZW1vdmVDbGFzcyIsImZpbmQiLCJnZXQiLCJjbGljayIsImluaXRpYWxpemVTZWN0aW9uIiwic2VjdGlvbk51bWJlciIsImlkeCIsInNpYmxpbmdzIiwibWFwIiwiaXgiLCJlbGUiLCJjc3MiLCJvcGFjaXR5IiwiaWR4T2JqIiwicmVsZXZhbnRBbmltYXRpb24iLCJoYW5kbGVQYW5pbmF0aW9uQnV0dG9uQ2xpY2siLCJlIiwicGFyc2VJbnQiLCJ0YXJnZXQiLCJhdHRyIiwic2VjdGlvbklkIiwiY2xvc2VzdCIsInJlbGV2YW50RGF0YUFycmF5Iiwib24iLCJlcyIsImxvY2F0aW9uIiwib25lcGFnZV9zY3JvbGwiLCJzZWN0aW9uQ29udGFpbmVyIiwiZWFzaW5nIiwiYW5pbWF0aW9uVGltZSIsInBhZ2luYXRpb24iLCJ1cGRhdGVVUkwiLCJiZWZvcmVNb3ZlIiwiYWZ0ZXJNb3ZlIiwibG9vcCIsImtleWJvYXJkIiwicmVzcG9uc2l2ZUZhbGxiYWNrIiwiZGlyZWN0aW9uIiwibW92ZVRvIiwiY3VycmVudFNlY3Rpb24iLCJoYXNDbGFzcyIsInNlY3Rpb24iLCJvZmZzZXQiLCJ0b3AiLCJtb3ZlRG93biIsImhpZGVMb2FkaW5nQW5pbWF0aW9uIiwicmVhZHlTdGF0ZSIsInNlY3Rpb24zQXV0b21hdGVkIiwiYXV0b21hdGVTZWN0aW9uMyIsInNlY3Rpb240QXV0b21hdGVkIiwiYXV0b21hdGVTZWN0aW9uNCIsImludGVydmFsTWFuYWdlciIsImZsYWciLCJzd2lwZUNvbnRyb2xsZXIiLCJjbGVhckludGVydmFsIiwicGxheSIsInRpbWVvdXQiLCJwYXVzZSIsImlubmVySGVpZ2h0IiwibWF0Y2hNZWRpYSIsIm1hdGNoZXMiLCJwYWdlSWR4IiwiYnVyZ2VyIiwiY2xhc3NMaXN0IiwiY29udGFpbnMiLCJuYXYiLCJyZW1vdmUiLCJib2R5Iiwic3R5bGUiLCJwb3NpdGlvbiIsInN0b3BQcm9wYWdhdGlvbiIsIm5hdkNvbnRyb2wiLCJhZGQiLCJkZXRlY3Rzd2lwZSIsImVsIiwiZnVuYyIsInN3aXBlX2RldCIsInNYIiwic1kiLCJlWCIsImVZIiwibWluX3giLCJtYXhfeCIsIm1pbl95IiwibWF4X3kiLCJkaXJlYyIsInQiLCJ0b3VjaGVzIiwic2NyZWVuWCIsInNjcmVlblkiLCJwcmV2ZW50RGVmYXVsdCIsImQiLCJzZWN0aW9uNFBhZ2luYXRpb25MZW5ndGgiLCJzZWN0aW9uM1BhZ2luYXRpb25MZW5ndGgiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxJQUFNQSxPQUFPLEdBQWI7QUFDQSxJQUFJQyxjQUFjLENBQWxCO0FBQ0EsSUFBSUMsY0FBYyxDQUFsQjs7QUFFQTtBQUNBLElBQUlDLHdCQUFKO0FBQUEsSUFBcUJDLDBCQUFyQjtBQUFBLElBQXdDQyw0QkFBeEM7QUFBQSxJQUE2REMsMEJBQTdEO0FBQUEsSUFBZ0ZDLHFCQUFoRjs7QUFFQSxJQUFNQyxZQUFZO0FBQ2pCQyxxQkFBb0IsQ0FESDtBQUVqQkMscUJBQW9CLENBRkg7QUFHakJDLGFBQVksRUFBQ0MsWUFBWSxDQUFiLEVBQWdCQyxRQUFRUixtQkFBeEIsRUFISztBQUlqQlMsV0FBVSxFQUFDRixZQUFZLENBQWIsRUFBZ0JDLFFBQVFULGlCQUF4QixFQUpPO0FBS2pCVyxTQUFRLEVBQUNILFlBQVksQ0FBYixFQUFnQkMsUUFBUVYsZUFBeEIsRUFMUztBQU1qQmEsV0FBVSxFQUFDSixZQUFZLENBQWIsRUFBZ0JDLFFBQVFQLGlCQUF4QixFQU5PO0FBT2pCVyxNQUFLLEVBQUNMLFlBQVksQ0FBYixFQUFnQkMsUUFBUU4sWUFBeEI7QUFQWSxDQUFs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OEJqQixXQUE5QixFQUEyQzZGLEtBQTNDO0FBQ0E7QUFDRDtBQUNELE1BQUd1RSxPQUFPLFVBQVYsRUFBc0I7O0FBRXJCLE9BQU1tQiwyQkFBMkJ0SyxFQUFFLDBCQUFGLEVBQThCMEIsTUFBL0Q7O0FBRUEsT0FBRzBJLE1BQU0sR0FBVCxFQUFjOztBQUViLFFBQUd0TCxjQUFjd0wsMkJBQTJCLENBQTVDLEVBQStDO0FBQzlDeEw7QUFDQSxLQUZELE1BRU87QUFDTkEsbUJBQWMsQ0FBZDtBQUNBOztBQUVEa0IsTUFBRSwwQkFBRixFQUE4QmxCLFdBQTlCLEVBQTJDOEYsS0FBM0M7QUFDQTtBQUNELE9BQUd3RixNQUFNLEdBQVQsRUFBYzs7QUFFYixRQUFHdEwsY0FBYyxDQUFqQixFQUFvQjtBQUNuQkE7QUFDQSxLQUZELE1BRU87QUFDTkEsbUJBQWN3TCwyQkFBMkIsQ0FBekM7QUFDQTs7QUFFRHRLLE1BQUUsMEJBQUYsRUFBOEJsQixXQUE5QixFQUEyQzhGLEtBQTNDO0FBQ0E7QUFDRDtBQUNELEVBcEREOztBQXNERDs7QUFFQyxLQUFHLENBQUM1RSxFQUFFa0csUUFBRixFQUFZTixJQUFaLENBQWlCLE1BQWpCLEVBQXlCdEUsUUFBekIsQ0FBa0MsV0FBbEMsQ0FBSixFQUFvRDtBQUNuRDRILGNBQVksVUFBWixFQUF3QnBCLGVBQXhCO0FBQ0FvQixjQUFZLFVBQVosRUFBd0JwQixlQUF4QjtBQUNBO0FBQ0QsQ0FqbkJEIiwiZmlsZSI6ImZha2VfODMwMGZkOTEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCB0aW1lID0gNzUwO1xubGV0IHNlY3Rpb24zSWR4ID0gMDtcbmxldCBzZWN0aW9uNElkeCA9IDA7XG5cbi8vIGxldCBGb290YmFsbEZyYW1lcywgVGVubmlzRnJhbWVzLCBCYXNlYmFsbEZyYW1lcywgQmFza2V0YmFsbEZyYW1lcywgRmFuRnJhbWVzLCBJZGxlRnJhbWU7XG5sZXQgdGVubmlzQW5pbWF0aW9uLCBmb290YmFsbEFuaW1hdGlvbiwgYmFza2V0YmFsbEFuaW1hdGlvbiwgYmFzZWJhbGxBbmltYXRpb24sIGZhbkFuaW1hdGlvbjtcblxuY29uc3QgbWFzdGVyT2JqID0ge1xuXHRzZWN0aW9uMkN1cnJlbnRJZHg6IDAsIFxuXHRzZWN0aW9uMUN1cnJlbnRJZHg6IDAsXG5cdGJhc2tldGJhbGw6IHtsb29wQW1vdW50OiAxLCBsb29wSWQ6IGJhc2tldGJhbGxBbmltYXRpb259LFxuXHRmb290YmFsbDoge2xvb3BBbW91bnQ6IDEsIGxvb3BJZDogZm9vdGJhbGxBbmltYXRpb259LFxuXHR0ZW5uaXM6IHtsb29wQW1vdW50OiAxLCBsb29wSWQ6IHRlbm5pc0FuaW1hdGlvbn0sXG5cdGJhc2ViYWxsOiB7bG9vcEFtb3VudDogMSwgbG9vcElkOiBiYXNlYmFsbEFuaW1hdGlvbn0sXG5cdGZhbjoge2xvb3BBbW91bnQ6IDEsIGxvb3BJZDogZmFuQW5pbWF0aW9ufVxufTtcbmNvbnN0IGhvbWVwYWdlTW9iSW1hZ2VzID0gW1xuXHQnYXNzZXRzL2ltYWdlcy9ob21lcGFnZU1vYi9iYXNrZXRiYWxsLmpwZycsXG5cdCdhc3NldHMvaW1hZ2VzL2hvbWVwYWdlTW9iL2Zvb3RiYWxsLmpwZycsXG5cdCdhc3NldHMvaW1hZ2VzL2hvbWVwYWdlTW9iL3Rlbm5pcy5qcGcnLCBcblx0J2Fzc2V0cy9pbWFnZXMvaG9tZXBhZ2VNb2IvYmFzZWJhbGwuanBnJywgXG5cdCdhc3NldHMvaW1hZ2VzL2hvbWVwYWdlTW9iL2Zhbi5qcGcnIFxuXVxuXG4kKGRvY3VtZW50KS5yZWFkeSgoKSA9PiB7XG4vLyBXQUlUIEZPUiBnZnlDYXRFbWJlZCBWSURFTyBUTyBTVEFSVCBQTEFZSU5HIE9OIE1PQklMRSwgVEhFTiBISURFIFRIRSBMT0FESU5HIEFOSU1BVElPTi4gXFxcXFxuXG5cdGlmKHdpbmRvdy5pbm5lcldpZHRoIDwgODAwKSB7XG5cdFx0XG5cdFx0ZmV0Y2goJ2Fzc2V0cy9qcy9GYW50YXN0ZWNfU3ByaXRlX1NoZWV0Lmpzb24nKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7IFxuXHRcdFx0cmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcblx0XHR9KS50aGVuKGZ1bmN0aW9uKHNwcml0ZU9iaikge1xuXHRcdFx0Y29uc3QgSWRsZUZyYW1lID0gZmlsdGVyQnlWYWx1ZShzcHJpdGVPYmouZnJhbWVzLCAnaWRsZScpO1xuXHRcdFx0bWFzdGVyT2JqLmZvb3RiYWxsLmFuaW1hdGlvbkFycmF5ID0gWy4uLklkbGVGcmFtZSwgLi4uZmlsdGVyQnlWYWx1ZShzcHJpdGVPYmouZnJhbWVzLCAnZm9vdGJhbGwnKV07XG5cdFx0XHRtYXN0ZXJPYmoudGVubmlzLmFuaW1hdGlvbkFycmF5ID0gWy4uLklkbGVGcmFtZSwgLi4uZmlsdGVyQnlWYWx1ZShzcHJpdGVPYmouZnJhbWVzLCAndGVubmlzJyldO1xuXHRcdFx0bWFzdGVyT2JqLmJhc2ViYWxsLmFuaW1hdGlvbkFycmF5ID0gWy4uLklkbGVGcmFtZSwgLi4uZmlsdGVyQnlWYWx1ZShzcHJpdGVPYmouZnJhbWVzLCAnYmFzZWJhbGwnKV07XG5cdFx0XHRtYXN0ZXJPYmouYmFza2V0YmFsbC5hbmltYXRpb25BcnJheSA9IFsuLi5JZGxlRnJhbWUsIC4uLmZpbHRlckJ5VmFsdWUoc3ByaXRlT2JqLmZyYW1lcywgJ2Jhc2tldCcpXTtcblx0XHRcdG1hc3Rlck9iai5mYW4uYW5pbWF0aW9uQXJyYXkgPSBbLi4uSWRsZUZyYW1lLCAuLi5maWx0ZXJCeVZhbHVlKHNwcml0ZU9iai5mcmFtZXMsICdmYW4nKV07XG5cdFx0XHRcblx0XHRcdGFuaW1hdG9yU2V0dXAoKTtcblx0XHRcdGltYWdlQ29udHJvbGVyKG1hc3Rlck9iaiwgMSk7XG5cblx0XHRcdHNldEludGVydmFsKCgpID0+IHtcblx0XHRcdFx0aW1hZ2VDb250cm9sZXIobWFzdGVyT2JqLCAxKTtcblx0XHRcdH0sIDUwMDApO1xuXHRcdH0pO1xuXHR9XG5cblx0Y29uc3QgZmlsdGVyQnlWYWx1ZSA9IChhcnJheSwgc3RyaW5nKSA9PiB7XG4gICAgcmV0dXJuIGFycmF5LmZpbHRlcihvID0+IHR5cGVvZiBvWydmaWxlbmFtZSddID09PSAnc3RyaW5nJyAmJiBvWydmaWxlbmFtZSddLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoc3RyaW5nLnRvTG93ZXJDYXNlKCkpKTtcblx0fVxuXG5cdGNvbnN0IGFuaW1hdG9yU2V0dXAgPSAoKSA9PiB7XG5cdFx0XHRcbiAgICB2YXIgbGFzdFRpbWUgPSAwO1xuICAgIHZhciB2ZW5kb3JzID0gWydtcycsICdtb3onLCAnd2Via2l0JywgJ28nXTtcbiAgICBmb3IodmFyIHggPSAwOyB4IDwgdmVuZG9ycy5sZW5ndGggJiYgIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWU7ICsreCkge1xuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gd2luZG93W3ZlbmRvcnNbeF0rJ1JlcXVlc3RBbmltYXRpb25GcmFtZSddO1xuICAgICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSB3aW5kb3dbdmVuZG9yc1t4XSsnQ2FuY2VsQW5pbWF0aW9uRnJhbWUnXSB8fCB3aW5kb3dbdmVuZG9yc1t4XSsnQ2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ107XG4gICAgfVxuIFxuICAgIGlmICghd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSlcbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uKGNhbGxiYWNrLCBlbGVtZW50KSB7XG4gICAgICAgICAgICB2YXIgY3VyclRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgICAgIHZhciB0aW1lVG9DYWxsID0gTWF0aC5tYXgoMCwgMTYgLSAoY3VyclRpbWUgLSBsYXN0VGltZSkpO1xuICAgICAgICAgICAgdmFyIGlkID0gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IGNhbGxiYWNrKGN1cnJUaW1lICsgdGltZVRvQ2FsbCk7IH0sIFxuICAgICAgICAgICAgICB0aW1lVG9DYWxsKTtcbiAgICAgICAgICAgIGxhc3RUaW1lID0gY3VyclRpbWUgKyB0aW1lVG9DYWxsO1xuICAgICAgICAgICAgcmV0dXJuIGlkO1xuICAgICAgICB9O1xuIFxuICAgIGlmICghd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKVxuICAgICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbihpZCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KGlkKTtcbiAgICAgICAgfTtcblx0fVxuXG5cdGNvbnN0IGFuaW1hdG9yID0gKGFuaW1hdGlvbk9iaikgPT4ge1xuXHRcdFx0XHRcdFx0XG5cdFx0dmFyIGRhbmNpbmdJY29uLFxuXHRcdFx0c3ByaXRlSW1hZ2UsXG5cdFx0XHRjYW52YXM7XHRcdFx0XHRcdFxuXG5cdFx0ZnVuY3Rpb24gZ2FtZUxvb3AgKCkge1xuXHRcdFx0JCgnI2xvYWRpbmcnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG5cdFx0ICBhbmltYXRpb25PYmoubG9vcElkID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShnYW1lTG9vcCk7XG5cdFx0ICBkYW5jaW5nSWNvbi51cGRhdGUoKTtcblx0XHQgIGRhbmNpbmdJY29uLnJlbmRlcigpO1xuXHRcdH1cblx0XHRcblx0XHRmdW5jdGlvbiBzcHJpdGUgKG9wdGlvbnMpIHtcblx0XHRcblx0XHRcdHZhciB0aGF0ID0ge30sXG5cdFx0XHRcdGZyYW1lSW5kZXggPSAwLFxuXHRcdFx0XHR0aWNrQ291bnQgPSAwLFxuXHRcdFx0XHRsb29wQ291bnQgPSAwLFxuXHRcdFx0XHR0aWNrc1BlckZyYW1lID0gb3B0aW9ucy50aWNrc1BlckZyYW1lIHx8IDAsXG5cdFx0XHRcdG51bWJlck9mRnJhbWVzID0gb3B0aW9ucy5udW1iZXJPZkZyYW1lcyB8fCAxO1xuXHRcdFx0XG5cdFx0XHR0aGF0LmNvbnRleHQgPSBvcHRpb25zLmNvbnRleHQ7XG5cdFx0XHR0aGF0LndpZHRoID0gb3B0aW9ucy53aWR0aDtcblx0XHRcdHRoYXQuaGVpZ2h0ID0gb3B0aW9ucy5oZWlnaHQ7XG5cdFx0XHR0aGF0LmltYWdlID0gb3B0aW9ucy5pbWFnZTtcblx0XHRcdHRoYXQubG9vcHMgPSBvcHRpb25zLmxvb3BzO1xuXHRcdFx0XG5cdFx0XHR0aGF0LnVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICB0aWNrQ291bnQgKz0gMTtcblxuICAgICAgICBpZiAodGlja0NvdW50ID4gdGlja3NQZXJGcmFtZSkge1xuXG5cdFx0XHRcdFx0dGlja0NvdW50ID0gMDtcbiAgICAgICAgICAvLyBJZiB0aGUgY3VycmVudCBmcmFtZSBpbmRleCBpcyBpbiByYW5nZVxuICAgICAgICAgIGlmIChmcmFtZUluZGV4IDwgbnVtYmVyT2ZGcmFtZXMgLSAxKSB7XHRcbiAgICAgICAgICAvLyBHbyB0byB0aGUgbmV4dCBmcmFtZVxuICAgICAgICAgICAgZnJhbWVJbmRleCArPSAxO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgIFx0XHRsb29wQ291bnQrK1xuICAgICAgICAgICAgZnJhbWVJbmRleCA9IDA7XG5cbiAgICAgICAgICAgIGlmKGxvb3BDb3VudCA9PT0gdGhhdC5sb29wcykge1xuICAgICAgICAgICAgXHR3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUoYW5pbWF0aW9uT2JqLmxvb3BJZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICB9XG5cdFx0XHRcblx0XHRcdHRoYXQucmVuZGVyID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XG5cdFx0XHQgIC8vIENsZWFyIHRoZSBjYW52YXNcblx0XHRcdCAgdGhhdC5jb250ZXh0LmNsZWFyUmVjdCgwLCAwLCB0aGF0LndpZHRoLCB0aGF0LmhlaWdodCk7XG5cdFx0XHQgIFxuXHRcdFx0ICB0aGF0LmNvbnRleHQuZHJhd0ltYWdlKFxuXHRcdFx0ICAgIHRoYXQuaW1hZ2UsXG5cdFx0XHQgICAgYW5pbWF0aW9uT2JqLmFuaW1hdGlvbkFycmF5W2ZyYW1lSW5kZXhdLmZyYW1lLngsXG5cdFx0XHQgICAgYW5pbWF0aW9uT2JqLmFuaW1hdGlvbkFycmF5W2ZyYW1lSW5kZXhdLmZyYW1lLnksXG5cdFx0XHQgICAgMjAwLFxuXHRcdFx0ICAgIDE3NSxcblx0XHRcdCAgICAwLFxuXHRcdFx0ICAgIDAsXG5cdFx0XHQgICAgd2luZG93LmlubmVyV2lkdGggLyAzLjg0Nixcblx0XHRcdCAgICB3aW5kb3cuaW5uZXJXaWR0aCAvIDQuMSlcblx0XHRcdH07XG5cdFx0XHRcblx0XHRcdHJldHVybiB0aGF0O1xuXHRcdH1cblx0XHRcblx0XHQvLyBHZXQgY2FudmFzXG5cdFx0Y2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhbnZhcycpO1xuXHRcdGNhbnZhcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gMy44NDY7XG5cdFx0Y2FudmFzLmhlaWdodCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gMi4yO1xuXHRcdFxuXHRcdC8vIENyZWF0ZSBzcHJpdGUgc2hlZXRcblx0XHRzcHJpdGVJbWFnZSA9IG5ldyBJbWFnZSgpO1x0XG5cdFx0XG5cdFx0Ly8gQ3JlYXRlIHNwcml0ZVxuXHRcdGRhbmNpbmdJY29uID0gc3ByaXRlKHtcblx0XHRcdGNvbnRleHQ6IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIiksXG5cdFx0XHR3aWR0aDogNDA0MCxcblx0XHRcdGhlaWdodDogMTc3MCxcblx0XHRcdGltYWdlOiBzcHJpdGVJbWFnZSxcblx0XHRcdG51bWJlck9mRnJhbWVzOiBhbmltYXRpb25PYmouYW5pbWF0aW9uQXJyYXkubGVuZ3RoLFxuXHRcdFx0dGlja3NQZXJGcmFtZTogNCxcblx0XHRcdGxvb3BzOiBhbmltYXRpb25PYmoubG9vcEFtb3VudFxuXHRcdH0pO1xuXHRcdFxuXHRcdC8vIExvYWQgc3ByaXRlIHNoZWV0XG5cdFx0c3ByaXRlSW1hZ2UuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgZ2FtZUxvb3ApO1xuXHRcdHNwcml0ZUltYWdlLnNyYyA9ICdhc3NldHMvaW1hZ2VzL0ZhbnRhc3RlY19TcHJpdGVfU2hlZXQucG5nJztcblx0fSBcblxuLy8gSU5JVElBTElTRSBBTkQgU0VUVVAgQ1VSUkVOVCBQQUdFLiBFWEVDVVRFIFRSQU5TSVRJT05TIEFORCBSRU1PVkUgVElOVCBJRiBSRUxFVkFOVCBcXFxcXG5cblx0Y29uc3RcdHBhZ2VMb2FkZXIgPSAoaW5kZXgpID0+IHtcblx0XHRpZihpbmRleCA9PT0gNSkge1xuXHRcdFx0JCgnLnRpbnQnKS5yZW1vdmVDbGFzcygncmVtb3ZlVGludCcpO1xuXHRcdFx0JCgnLmJhY2tncm91bmRXcmFwcGVyJykucmVtb3ZlQ2xhc3MoJ3NjYWxlQmFja2dyb3VuZCcpO1xuXHRcdFx0JCgnI3NlY3Rpb241JykuZmluZCgnLmhlYWRpbmcnKS5hZGRDbGFzcygnc2hvdyBmYWRlSW4nKTtcblx0XHRcdCQoJy5zdWJTZWN0aW9uJykuYWRkQ2xhc3MoJ3NjYWxlQmFja2dyb3VuZCcpO1xuXHRcdFx0JCgnLnN1YlNlY3Rpb24nKS5maW5kKCcudGludCcpLmFkZENsYXNzKCdyZW1vdmVUaW50Jyk7XG5cdFx0XHQkKCcjc2VjdGlvbjUnKS5maW5kKCcudGV4dFdyYXBwZXInKS5hZGRDbGFzcygnc2hvdycpO1xuXHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdCQoJy5zdWJTZWN0aW9uID4gLnRleHRXcmFwcGVyJykuZmluZCgnLmhlYWRpbmcnKS5hZGRDbGFzcygnZmFkZUluJyk7XG5cdFx0XHR9LCAxMDAwKTtcblx0XHR9IFxuXHRcdGVsc2Uge1xuXHRcdFx0JCgnLnRpbnQnKS5yZW1vdmVDbGFzcygncmVtb3ZlVGludCcpO1xuXHRcdFx0JCgnLnN1YlNlY3Rpb24nKS5yZW1vdmVDbGFzcygnc2NhbGVCYWNrZ3JvdW5kJyk7XG5cdFx0XHQkKGAuYmFja2dyb3VuZFdyYXBwZXI6bm90KCNzZWN0aW9uJHtpbmRleH1CYWNrZ3JvdW5kKWApLnJlbW92ZUNsYXNzKCdzY2FsZUJhY2tncm91bmQnKTtcblx0XHRcdCQoYC5zZWN0aW9uLmFjdGl2ZWApLmZpbmQoYC5iYWNrZ3JvdW5kV3JhcHBlcmApLmFkZENsYXNzKCdzY2FsZUJhY2tncm91bmQnKTtcblx0XHRcdCQoYHNlY3Rpb24uYWN0aXZlYCkuZmluZCgnLnRpbnQnKS5hZGRDbGFzcygncmVtb3ZlVGludCcpO1xuXG5cdFx0XHRpZigkKGAuc2VjdGlvbiR7aW5kZXh9UGFnaW5hdG9yQnV0dG9uYCkubGVuZ3RoICYmICQoYC5zZWN0aW9uJHtpbmRleH1QYWdpbmF0b3JCdXR0b24uYWN0aXZlYCkubGVuZ3RoIDwgMSkge1xuXHRcdFx0XHQkKGAuc2VjdGlvbiR7aW5kZXh9UGFnaW5hdG9yQnV0dG9uYCkuZ2V0KDApLmNsaWNrKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG4vLyBISURFIEFMTCBCRUNLR1JPVU5EUyBJTiBUSEUgU0VDVElPTiBFWENFUFQgVEhFIFNQRUNJRklFRCBJTkRFWCwgV0hJQ0ggSVMgU0NBTEVEIEFORCBTSE9XTi4gXFxcXFxuXG5cdGNvbnN0IGluaXRpYWxpemVTZWN0aW9uID0gKHNlY3Rpb25OdW1iZXIsIGlkeCkgPT4ge1xuXHRcdCQoYCNzZWN0aW9uJHtzZWN0aW9uTnVtYmVyfUJhY2tncm91bmQke2lkeH1gKS5zaWJsaW5ncygnLmJhY2tncm91bmRXcmFwcGVyJykubWFwKChpeCwgZWxlKSA9PiB7XG5cdFx0XHQkKGVsZSkuY3NzKHtvcGFjaXR5OiAwfSk7XG5cdFx0fSk7XG5cblx0XHQkKGAjc2VjdGlvbiR7c2VjdGlvbk51bWJlcn1CYWNrZ3JvdW5kJHtpZHh9YCkuY3NzKHtcblx0XHRcdCd0cmFuc2Zvcm0nOiAnc2NhbGUoMS4xKScsXG5cdFx0XHQnb3BhY2l0eSc6IDFcblx0XHR9KTtcblx0fTtcblxuLy8gSU5JVElBVEUgaW5pdGlhbGl6ZVNlY3Rpb24gT04gU0VDVElPTlMgMyBBTkQgNC4gXFxcXFxuXHRpbml0aWFsaXplU2VjdGlvbigxLCAwKTtcblx0aW5pdGlhbGl6ZVNlY3Rpb24oMywgMCk7XG5cdGluaXRpYWxpemVTZWN0aW9uKDQsIDApO1xuXG4vLyBTRUNUSU9OUyAyIChBQk9VVCBVUyBTRUNUSU9OKSBCQUNLR1JPVU5EIElNQUdFIFRSQU5TSVRJT04gSEFORExFUi4gXFxcXFxuXG5cdGNvbnN0IGltYWdlQ29udHJvbGVyID0gKGlkeE9iaiwgc2VjdGlvbk51bWJlcikgPT4ge1xuXHRcdGxldCByZWxldmFudEFuaW1hdGlvbjtcblxuXHRcdGlmKHNlY3Rpb25OdW1iZXIgPT09IDEpIHtcblx0XHRcdHN3aXRjaChpZHhPYmouc2VjdGlvbjFDdXJyZW50SWR4KSB7XG5cdFx0XHRcdGNhc2UgMDpcblx0XHRcdFx0XHRyZWxldmFudEFuaW1hdGlvbiA9IG1hc3Rlck9iai5iYXNrZXRiYWxsO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHRcdHJlbGV2YW50QW5pbWF0aW9uID0gbWFzdGVyT2JqLmZvb3RiYWxsO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRcdHJlbGV2YW50QW5pbWF0aW9uID0gbWFzdGVyT2JqLnRlbm5pcztcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgMzpcblx0XHRcdFx0XHRyZWxldmFudEFuaW1hdGlvbiA9IG1hc3Rlck9iai5iYXNlYmFsbDtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgNDpcblx0XHRcdFx0XHRyZWxldmFudEFuaW1hdGlvbiA9IG1hc3Rlck9iai5mYW47XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdCQoYCNzZWN0aW9uJHtzZWN0aW9uTnVtYmVyfWApLmZpbmQoJy50aW50JykucmVtb3ZlQ2xhc3MoJ3JlbW92ZVRpbnQnKTtcblx0XHQkKGAjc2VjdGlvbiR7c2VjdGlvbk51bWJlcn1CYWNrZ3JvdW5kJHtpZHhPYmpbYHNlY3Rpb24ke3NlY3Rpb25OdW1iZXJ9Q3VycmVudElkeGBdfWApLnJlbW92ZUNsYXNzKCdzY2FsZUJhY2tncm91bmQnKTtcblx0XHRpbml0aWFsaXplU2VjdGlvbihzZWN0aW9uTnVtYmVyLCBpZHhPYmpbYHNlY3Rpb24ke3NlY3Rpb25OdW1iZXJ9Q3VycmVudElkeGBdKTtcblx0XHRcblx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdGlmKHNlY3Rpb25OdW1iZXIgPT09IDEpIHtcblx0XHRcdFx0YW5pbWF0b3IocmVsZXZhbnRBbmltYXRpb24pO1xuXHRcdFx0fVxuXG5cdFx0XHQkKGAjc2VjdGlvbiR7c2VjdGlvbk51bWJlcn1gKS5maW5kKGAuYmFja2dyb3VuZFdyYXBwZXJgKS5hZGRDbGFzcygnc2NhbGVCYWNrZ3JvdW5kJyk7XG5cdFx0XHQkKGAjc2VjdGlvbiR7c2VjdGlvbk51bWJlcn1gKS5maW5kKCcudGludCcpLmFkZENsYXNzKCdyZW1vdmVUaW50Jyk7XG5cdFx0fSwgNTAwKTtcblxuXHRcdGlmKGlkeE9ialtgc2VjdGlvbiR7c2VjdGlvbk51bWJlcn1DdXJyZW50SWR4YF0gPT09ICQoYCNzZWN0aW9uJHtzZWN0aW9uTnVtYmVyfWApLmZpbmQoYC5iYWNrZ3JvdW5kV3JhcHBlcmApLmxlbmd0aCAtIDEpIHtcblx0XHRcdGlkeE9ialtgc2VjdGlvbiR7c2VjdGlvbk51bWJlcn1DdXJyZW50SWR4YF0gPSAwO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZHhPYmpbYHNlY3Rpb24ke3NlY3Rpb25OdW1iZXJ9Q3VycmVudElkeGBdICs9IDE7XG5cdFx0fVxuXHR9XG5cblx0aW1hZ2VDb250cm9sZXIobWFzdGVyT2JqLCAyKTtcblxuXHRzZXRJbnRlcnZhbCgoKSA9PiB7XG5cdFx0aW1hZ2VDb250cm9sZXIobWFzdGVyT2JqLCAyKTtcblx0fSwgMTUwMDApO1xuXG4vLyBQQUdJTkFUSU9OIEJVVFRPTlMgQ0xJQ0sgSEFORExFUiBGT1IgU0VDVElPTlMgMyBBTkQgNC4gXFxcXFxuXG5cdGNvbnN0IGhhbmRsZVBhbmluYXRpb25CdXR0b25DbGljayA9IChlKSA9PiB7XG5cblx0XHRjb25zdCBpZHggPSBwYXJzZUludCgkKGUudGFyZ2V0KS5hdHRyKCdkYXRhLWluZGV4JykpO1xuXHRcdGNvbnN0IHNlY3Rpb25JZCA9ICQoZS50YXJnZXQpLmNsb3Nlc3QoJ3NlY3Rpb24nKS5hdHRyKCdpZCcpO1xuXHRcdGxldCByZWxldmFudERhdGFBcnJheTtcblxuXHRcdGlmKHNlY3Rpb25JZCA9PT0gJ3NlY3Rpb24zJykge1xuXHRcdFx0c2VjdGlvbjNJZHggPSBpZHg7XG5cdFx0fVxuXG5cdFx0aWYoc2VjdGlvbklkID09PSAnc2VjdGlvbjQnKSB7XG5cdFx0XHRzZWN0aW9uNElkeCA9IGlkeDtcblx0XHR9XG5cblx0XHQkKGAjJHtzZWN0aW9uSWR9YCkuZmluZCgnLnRpbnQnKS5yZW1vdmVDbGFzcygncmVtb3ZlVGludCcpO1xuXHRcdCQoYCMke3NlY3Rpb25JZH1gKS5maW5kKCcudGV4dFdyYXBwZXInKS5yZW1vdmVDbGFzcygnc2hvdycpO1xuXHRcdCQoYCMke3NlY3Rpb25JZH1gKS5maW5kKGAjdGV4dFdyYXBwZXIke2lkeH1gKS5hZGRDbGFzcygnc2hvdycpO1xuXHRcdCQoYCMke3NlY3Rpb25JZH1CYWNrZ3JvdW5kJHtpZHh9YCkucmVtb3ZlQ2xhc3MoJ3NjYWxlQmFja2dyb3VuZCcpO1xuXHRcdCQoYC4ke3NlY3Rpb25JZH1QYWdpbmF0b3JCdXR0b25gKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cdFx0JChlLnRhcmdldCkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXG5cdFx0aW5pdGlhbGl6ZVNlY3Rpb24ocGFyc2VJbnQoJChgIyR7c2VjdGlvbklkfWApLmF0dHIoJ2RhdGEtaW5kZXgnKSksIGlkeCk7XG5cblx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdHBhZ2VMb2FkZXIocGFyc2VJbnQoJChgIyR7c2VjdGlvbklkfWApLmF0dHIoJ2RhdGEtaW5kZXgnKSkpO1xuXHRcdH0sIDUwMCk7XG5cblx0XHRpZihzZWN0aW9uSWQgIT09ICdzZWN0aW9uMicpe1xuXHRcdFx0JChgIyR7c2VjdGlvbklkfWApLmZpbmQoJy5oZWFkaW5nLCBwJykuYWRkQ2xhc3MoJ2ZhZGVJbicpO1xuXHRcdFx0JChgIyR7c2VjdGlvbklkfWApLm9uKCd0cmFuc2l0aW9uZW5kIHdlYmtpdFRyYW5zaXRpb25FbmQgb1RyYW5zaXRpb25FbmQnLCAoZXMpID0+IHtcblx0ICAgIFx0JChgIyR7c2VjdGlvbklkfWApLmZpbmQoJy5oZWFkaW5nLCBwJykucmVtb3ZlQ2xhc3MoJ2ZhZGVJbicpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9O1xuXG4vLyBDTElDSyBMSVNURU5FUiBGT1IgUEFHSU5BVElPTiBCVVRUT05TIE9OIFNFQ1RJT05TIDMgQU5EIDQuIFxcXFxcblxuXHQkKCcuc2VjdGlvbjNQYWdpbmF0b3JCdXR0b24sIC5zZWN0aW9uNFBhZ2luYXRvckJ1dHRvbicpLmNsaWNrKChlKSA9PiB7XG5cdFx0aGFuZGxlUGFuaW5hdGlvbkJ1dHRvbkNsaWNrKGUpO1xuXHR9KTtcblxuLy8gSU5JVElBTElaRSBPTkVQQUdFU0NST0xMIElGIE5PVCBJTiBDTVMgUFJFVklFVy4gXFxcXFxuXG5cdGlmKCEkKGxvY2F0aW9uKS5hdHRyKCdocmVmJykuaW5jbHVkZXMoJ2luZGV4LnBocCcpKSB7XG5cdFx0JCgnI3Njcm9sbGVyV3JhcHBlcicpLm9uZXBhZ2Vfc2Nyb2xsKHtcblx0XHRcdHNlY3Rpb25Db250YWluZXI6IFwic2VjdGlvblwiLCAgICBcblx0XHRcdGVhc2luZzogXCJlYXNlLW91dFwiLCAgICAgICAgICAgICAgICAgXG5cdFx0XHRhbmltYXRpb25UaW1lOiB0aW1lLCAgICAgICAgICAgIFxuXHRcdFx0cGFnaW5hdGlvbjogdHJ1ZSwgICAgICAgICAgICAgICBcblx0XHRcdHVwZGF0ZVVSTDogdHJ1ZSwgICAgICAgICAgICAgICBcblx0XHRcdGJlZm9yZU1vdmU6IChpbmRleCkgPT4ge30sIFxuXHRcdFx0YWZ0ZXJNb3ZlOiAoaW5kZXgpID0+IHtcbi8vIElOSVRJQUxJWkUgVEhFIENVUlJFTlQgUEFHRS4gXFxcXFxuXG5cdFx0XHRcdHBhZ2VMb2FkZXIoaW5kZXgpO1xuXHRcdFx0fSwgIFxuXHRcdFx0bG9vcDogZmFsc2UsICAgICAgICAgICAgICAgICAgICBcblx0XHRcdGtleWJvYXJkOiB0cnVlLCAgICAgICAgICAgICAgICAgXG5cdFx0XHRyZXNwb25zaXZlRmFsbGJhY2s6IGZhbHNlLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXHRcdFx0ZGlyZWN0aW9uOiBcInZlcnRpY2FsXCIgICAgICAgICAgXG5cdFx0fSk7XG5cblx0XHQkKCcjc2Nyb2xsZXJXcmFwcGVyJykubW92ZVRvKDEpO1xuXHR9XG5cbi8vIENPTlRST0wgQ0xJQ0tTIE9OIFdPUksgV0lUSCBVUyBTRUNUSU9OIChTRUNUSU9ONSkuIFxcXFxcblxuXHQkKCcuY2xpY2thYmxlJykuY2xpY2soKGUpID0+IHtcblx0XHRsZXQgY3VycmVudFNlY3Rpb24gPSAkKGUudGFyZ2V0KS5jbG9zZXN0KCQoJy5zdWJTZWN0aW9uJykpO1xuXG5cdFx0aWYoY3VycmVudFNlY3Rpb24uaGFzQ2xhc3MoJ29wZW4nKSkge1xuXHRcdFx0Y3VycmVudFNlY3Rpb24ucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcblx0XHRcdGN1cnJlbnRTZWN0aW9uLmZpbmQoJy5idXR0b24sIHAnKS5yZW1vdmVDbGFzcygnZmFkZUluJyk7XG5cdFx0XHRjdXJyZW50U2VjdGlvbi5zaWJsaW5ncygnLnN1YlNlY3Rpb24nKS5tYXAoKGlkeCwgc2VjdGlvbikgPT4ge1xuXHRcdFx0XHQkKHNlY3Rpb24pLnJlbW92ZUNsYXNzKCdjbG9zZWQnKTtcblx0XHRcdFx0JChzZWN0aW9uKS5maW5kKCcudGludCcpLnJlbW92ZUNsYXNzKCdhZGRUaW50JykuYWRkQ2xhc3MoJ3JlbW92ZVRpbnQnKTtcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjdXJyZW50U2VjdGlvbi5yZW1vdmVDbGFzcygnY2xvc2VkJykuYWRkQ2xhc3MoJ29wZW4nKTtcblx0XHRcdGN1cnJlbnRTZWN0aW9uLm9uKCd0cmFuc2l0aW9uZW5kIHdlYmtpdFRyYW5zaXRpb25FbmQgb1RyYW5zaXRpb25FbmQnLCAoZXMpID0+IHtcblx0ICAgIFx0JCgnLnN1YlNlY3Rpb24ub3BlbicpLmZpbmQoJy5idXR0b24sIHAnKS5hZGRDbGFzcygnZmFkZUluJyk7XG5cdFx0XHR9KTtcblx0XHRcdGN1cnJlbnRTZWN0aW9uLnNpYmxpbmdzKCcuc3ViU2VjdGlvbicpLm1hcCgoaWR4LCBzZWN0aW9uKSA9PiB7XG5cdFx0XHRcdCQoc2VjdGlvbikucmVtb3ZlQ2xhc3MoJ29wZW4nKS5hZGRDbGFzcygnY2xvc2VkJyk7XG5cdFx0XHRcdCQoc2VjdGlvbikuZmluZCgnLnRpbnQnKS5yZW1vdmVDbGFzcygncmVtb3ZlVGludCcpLmFkZENsYXNzKCdhZGRUaW50Jyk7XG5cdFx0XHRcdCQoc2VjdGlvbikuZmluZCgnLmJ1dHRvbiwgcCcpLnJlbW92ZUNsYXNzKCdmYWRlSW4nKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRjdXJyZW50U2VjdGlvbi5maW5kKCcudGludCcpLnJlbW92ZUNsYXNzKCdhZGRUaW50JykuYWRkQ2xhc3MoJ3JlbW92ZVRpbnQnKTtcblx0fSk7XG5cbi8vIENPTlRST0wgRk9PVEVSIEFSUk9XIENMSUNLUy4gXFxcXFxuXG5cdCQoJyNkb3duQXJyb3cnKS5jbGljaygoKSA9PiB7XG5cdFx0aWYoJCh3aW5kb3cpLmhlaWdodCgpICogKCQoJy5wYWdlJykubGVuZ3RoIC0gMSkgPT09IC0gJCgnI3Njcm9sbGVyV3JhcHBlcicpLm9mZnNldCgpLnRvcCkge1xuXHQgIFx0JCgnI3Njcm9sbGVyV3JhcHBlcicpLm1vdmVUbygxKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JCgnI3Njcm9sbGVyV3JhcHBlcicpLm1vdmVEb3duKCk7XG5cdFx0fVxuXHR9KTtcblxuLy8gSElERSBUSEUgTE9BRElORyBBTklNQVRJT1BOIFdIRU4gVklERU8gSVMgUkVBRFkgVE8gUExBWSBPTiBERVhLVE9QLiBcXFxcXG5cblx0Y29uc3QgaGlkZUxvYWRpbmdBbmltYXRpb24gPSAoKSA9PiB7XG5cdFx0aWYod2luZG93LmlubmVyV2lkdGggPiA4MDAgJiYgISQoJyNsb2FkaW5nJykuaGFzQ2xhc3MoJ2hpZGRlbicpKSB7XG5cblx0XHRcdGlmKCQoJyN2aWRlbycpLmdldCgwKS5yZWFkeVN0YXRlID09PSA0KSB7XG5cdFx0XHRcdCQoJyNsb2FkaW5nJykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGxldCBzZWN0aW9uM0F1dG9tYXRlZCwgYXV0b21hdGVTZWN0aW9uMywgc2VjdGlvbjRBdXRvbWF0ZWQsIGF1dG9tYXRlU2VjdGlvbjQ7XG4vLyBNQU5BR0VNRU5UIEZVTkNUSU9OIEZPUiBTRVRUSU5HIEFORCBDTEVBUklORyBUSEUgU0xJREUgQVVUT01BVElPTiBJTlRFUlZBTFMuIFxcXFxcblxuXHRjb25zdCBpbnRlcnZhbE1hbmFnZXIgPSAoZmxhZywgc2VjdGlvbklkLCB0aW1lKSA9PiB7XG4gICBcdGlmKGZsYWcpIHtcbiAgIFx0XHRpZihzZWN0aW9uSWQgPT09ICdzZWN0aW9uMycpIHtcbiAgIFx0XHRcdGF1dG9tYXRlU2VjdGlvbjMgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG5cdCAgICAgXHRcdHN3aXBlQ29udHJvbGxlcihzZWN0aW9uSWQsICdsJyk7XHRcblx0ICAgICBcdH0sIHRpbWUpO1xuICAgXHRcdH1cbiAgIFx0XHRpZihzZWN0aW9uSWQgPT09ICdzZWN0aW9uNCcpIHtcbiAgIFx0XHRcdGF1dG9tYXRlU2VjdGlvbjQgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG5cdCAgICAgXHRcdHN3aXBlQ29udHJvbGxlcihzZWN0aW9uSWQsICdsJyk7XHRcblx0ICAgICBcdH0sIHRpbWUpO1xuICAgXHRcdH1cbiAgICAgXHQgXG4gICBcdH0gZWxzZSB7XG4gICBcdFx0aWYoc2VjdGlvbklkID09PSAnc2VjdGlvbjMnKSB7XG4gICAgXHRcdGNsZWFySW50ZXJ2YWwoYXV0b21hdGVTZWN0aW9uMyk7XG4gICAgXHR9XG4gICAgXHRpZihzZWN0aW9uSWQgPT09ICdzZWN0aW9uNCcpIHtcbiAgICBcdFx0Y2xlYXJJbnRlcnZhbChhdXRvbWF0ZVNlY3Rpb240KTtcbiAgICBcdH1cbiAgIFx0fVxuXHR9O1xuXG4vLyBJRiBOT1QgSU4gQ01TIEFETUlOIFBSRVZJRVcsIFBFUlBFVFVBTExZIENIRUNLIElGIFdFIEFSRSBBVCBUSEUgVE9QIE9GIFRIRSBQQUdFIEFORCBJRiBTTywgRE9OVCBTSE9XIFRIRSBGT09URVIgT1IgR1JFRU4gU0hBUEUuIFxcXFxcblxuXHRpZighJChsb2NhdGlvbikuYXR0cignaHJlZicpLmluY2x1ZGVzKCdpbmRleC5waHAnKSkge1xuXHRcdHNldEludGVydmFsKCgpID0+IHtcblx0XHRcdGlmKCQoJyNzY3JvbGxlcldyYXBwZXInKS5vZmZzZXQoKS50b3AgPj0gMCkge1xuXHRcdFx0XHQkKCcjaGVhZGVyU2hhcGUsICNmb290ZXInKS5hZGRDbGFzcygnbW92ZU9mZlNjcmVlbicpO1xuXHRcdFx0XHQkKCcjdmlkZW8nKS5nZXQoMCkucGxheSgpO1xuXHRcdFx0XHQkKCcuYXJyb3cnKS5hZGRDbGFzcygncHVsc2F0ZScpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dmFyIHRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0XHQkKCcjaGVhZGVyU2hhcGUsICNmb290ZXInKS5yZW1vdmVDbGFzcygnbW92ZU9mZlNjcmVlbicpO1xuXHRcdFx0XHRcdCQoJyN2aWRlbycpLmdldCgwKS5wYXVzZSgpO1xuXHRcdFx0XHRcdCQoJy5hcnJvdycpLnJlbW92ZUNsYXNzKCdwdWxzYXRlJyk7XG5cdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuXHRcdFx0XHR9LCB0aW1lKTtcblx0XHRcdH1cblxuLy8gUk9UQVRFIFRIRSBBUlJPVyBJTiBUSEUgRk9PVEVSIFdIRU4gQVQgVEhFIEJPVFRPTSBPRiBUSEUgUEFHRSBcXFxcXG5cblx0XHRcdGlmKCQoJyNzY3JvbGxlcldyYXBwZXInKS5vZmZzZXQoKS50b3AgPCAtICh3aW5kb3cuaW5uZXJIZWlnaHQgKiA0KSkge1xuXHRcdFx0XHQkKCcjZG93bkFycm93JykuY3NzKHsndHJhbnNmb3JtJzogJ3JvdGF0ZSgxODBkZWcpIHRyYW5zbGF0ZVgoLTUwJSknfSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkKCcjZG93bkFycm93JykuY3NzKHsndHJhbnNmb3JtJzogJ3RyYW5zbGF0ZVgoLTUwJSkgcm90YXRlKDBkZWcpJ30pO1xuXHRcdFx0fVxuXG5cdFx0XHRoaWRlTG9hZGluZ0FuaW1hdGlvbigpO1xuXG4vLyBBREQgTEFORFNDQVBFIFNUWUxFUyBUTyBSRUxFVkFOVCBFTEVNRU5UUyBcXFxcXG5cblx0XHRcdGlmKHdpbmRvdy5tYXRjaE1lZGlhKFwiKG9yaWVudGF0aW9uOiBsYW5kc2NhcGUpXCIpLm1hdGNoZXMgJiYgd2luZG93LmlubmVyV2lkdGggPCA4MDApIHtcblx0XHRcdCAgJCgnLm5hdl9saW5rLCAjaGVhZGVyU2hhcGUsICNmb290ZXIsIC5jdXN0b20sIC5tYXJrZXIsICNzZWN0aW9uNSwgLnRleHRXcmFwcGVyJykuYWRkQ2xhc3MoJ2xhbmRzY2FwZScpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ICQoJy5uYXZfbGluaywgI2hlYWRlclNoYXBlLCAjZm9vdGVyLCAuY3VzdG9tLCAubWFya2VyLCAjc2VjdGlvbjUsIC50ZXh0V3JhcHBlcicpLnJlbW92ZUNsYXNzKCdsYW5kc2NhcGUnKTtcblx0XHRcdH1cblxuXHRcdFx0aWYoJCgnI3NlY3Rpb24zLmFjdGl2ZScpLmxlbmd0aCkgeyAvLyBBVVRPTUFURSBUSEUgU0xJREVTIE9OIFNFQ1RJT1BOIDMgRVZFUlkgNyBTRUNPTkRTIElGIFRIRSBTRUNUSU9OIElTIEFDVElWRS4gXFxcXFxuXHRcdFx0XHRpZihzZWN0aW9uM0F1dG9tYXRlZCAhPT0gdHJ1ZSkge1xuXHRcdFx0XHRcdHNlY3Rpb24zQXV0b21hdGVkID0gdHJ1ZTtcblx0XHRcdFx0XHRpbnRlcnZhbE1hbmFnZXIodHJ1ZSwgJ3NlY3Rpb24zJywgNzAwMCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7IC8vIFNUT1AgQVVUT01BVEVEIFNMSURFUyBPTiBTRUNUSU9QTiAzIElGIFRIRSBTRUNUSU9OIElTIE5PVCBBQ1RJVkUuIFxcXFxcblx0XHRcdFx0aWYoc2VjdGlvbjNBdXRvbWF0ZWQgPT09IHRydWUpIHtcblx0XHRcdFx0XHRpbnRlcnZhbE1hbmFnZXIoZmFsc2UsICdzZWN0aW9uMycpO1xuXHRcdFx0XHRcdHNlY3Rpb24zQXV0b21hdGVkID0gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYoJCgnI3NlY3Rpb240LmFjdGl2ZScpLmxlbmd0aCkgeyAvLyBBVVRPTUFURSBUSEUgU0xJREVTIE9OIFNFQ1RJT1BOIDQgRVZFUlkgNyBTRUNPTkRTIElGIFRIRSBTRUNUSU9OIElTIEFDVElWRS4gXFxcXFxuXHRcdFx0XHRpZihzZWN0aW9uNEF1dG9tYXRlZCAhPT0gdHJ1ZSkge1xuXHRcdFx0XHRcdHNlY3Rpb240QXV0b21hdGVkID0gdHJ1ZTtcblx0XHRcdFx0XHRpbnRlcnZhbE1hbmFnZXIodHJ1ZSwgJ3NlY3Rpb240JywgNzAwMCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7IC8vIFNUT1AgQVVUT01BVEVEIFNMSURFUyBPTiBTRUNUSU9QTiA0IElGIFRIRSBTRUNUSU9OIElTIE5PVCBBQ1RJVkUuIFxcXFxcblx0XHRcdFx0aWYoc2VjdGlvbjRBdXRvbWF0ZWQgPT09IHRydWUpIHtcblx0XHRcdFx0XHRpbnRlcnZhbE1hbmFnZXIoZmFsc2UsICdzZWN0aW9uNCcpO1xuXHRcdFx0XHRcdHNlY3Rpb240QXV0b21hdGVkID0gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LCA1MDApO1xuXHR9XG5cbi8vIENPTlRST0wgV0hBVCBIQVBQRU5TIFdIRU4gTElOS1MgSU4gVEhFIE5BVi9NRU5VIEFSRSBDTElDS0VEIFxcXFxcblxuXHQkKCcubmF2X2xpbmsnKS5jbGljaygoZSkgPT4ge1xuXHRcdGNvbnN0IHBhZ2VJZHggPSBwYXJzZUludCgkKGUudGFyZ2V0KS5hdHRyKCdkYXRhLWluZGV4JykpO1xuXHRcdCQoJyNzY3JvbGxlcldyYXBwZXInKS5tb3ZlVG8ocGFnZUlkeCk7XG5cdFx0JCgnI21lbnVCbG9ja091dCcpLmFkZENsYXNzKCdoaWRkZW4nKTtcblxuXHRcdGlmKGJ1cmdlci5jbGFzc0xpc3QuY29udGFpbnMoJ2J1cmdlci0tYWN0aXZlJykpIHtcbiAgICAgIG5hdi5jbGFzc0xpc3QucmVtb3ZlKCduYXZfb3BlbicpO1xuICAgICAgYnVyZ2VyLmNsYXNzTGlzdC5yZW1vdmUoJ2J1cmdlci0tYWN0aXZlJyk7XG4gICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcbiAgICB9IFxuXHR9KTtcblxuLy8gV0hFTiBUSEUgTkFWIElTIE9QRU4gUFJFVkVOVCBVU0VSIEZST00gQkVJTkcgQUJMRSBUTyBDTElDSyBBTllUSElORyBFTFNFIFxcXFxcblxuXHQkKCcjbWVudUJsb2NrT3V0JykuY2xpY2soKGUpID0+IHtcblx0ICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0fSk7XG5cblx0dmFyIGJ1cmdlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluLWJ1cmdlcicpLCBcbiAgbmF2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW5OYXYnKTtcblxuLy8gQ09OVFJPTCBGT1IgT1BFTiBBTkQgQ0xPU0lORyBUSEUgTUVOVS9OQVYgIFxcXFxcblxuICBmdW5jdGlvbiBuYXZDb250cm9sKCkge1xuXG4gICAgaWYoYnVyZ2VyLmNsYXNzTGlzdC5jb250YWlucygnYnVyZ2VyLS1hY3RpdmUnKSkge1xuICAgICAgbmF2LmNsYXNzTGlzdC5yZW1vdmUoJ25hdl9vcGVuJyk7XG4gICAgICBidXJnZXIuY2xhc3NMaXN0LnJlbW92ZSgnYnVyZ2VyLS1hY3RpdmUnKTtcbiAgICAgICQoJyNtZW51QmxvY2tPdXQnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG4gICAgfSBcbiAgICBlbHNlIHtcbiAgICAgIGJ1cmdlci5jbGFzc0xpc3QuYWRkKCdidXJnZXItLWFjdGl2ZScpO1xuICAgICAgbmF2LmNsYXNzTGlzdC5hZGQoJ25hdl9vcGVuJyk7XG4gICAgICAkKCcjbWVudUJsb2NrT3V0JykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuICAgIH1cbiAgfVxuICBcbi8vIE9OTFkgTElTVEVOIEZPUiBNRU5VIENMSUNLUyBXSEVOIE5PVCBJTiBDTVMgUFJFVklFVyBNT0RFIFxcXFxcblxuICBpZighJChsb2NhdGlvbikuYXR0cignaHJlZicpLmluY2x1ZGVzKCdpbmRleC5waHAnKSkge1xuICBcdGJ1cmdlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG5hdkNvbnRyb2wpO1xuICB9XG5cbi8vIENMT1NFIFRIRSBOQVYgSUYgVEhFIFdJTkRPVyBJUyBPVkVSIDEwMDBQWCBXSURFIFxcXFxcblxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZnVuY3Rpb24oKSB7XG4gICAgaWYod2luZG93LmlubmVyV2lkdGggPiAxMDAwICYmIG5hdi5jbGFzc0xpc3QuY29udGFpbnMoJ25hdl9vcGVuJykpIHtcbiAgICAgIG5hdkNvbnRyb2woKTtcbiAgICAgIG5hdi5jbGFzc0xpc3QucmVtb3ZlKCduYXZfb3BlbicpO1xuICAgICAgICQoJyNtZW51QmxvY2tPdXQnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG4gICAgfVxuICB9KTtcblxuLy8gVEhJUyBTRVQgT0YgSUYgU1RBVEVNRU5UUyBJTklUSUFMSVNFUyBUSEUgU1BFU0lGSUMgUEFHRVMgRk9SIFBSRVZJRVdJTkcgSU4gQ01TIEFETUlOLiBcXFxcXG5cbiAgaWYoJChsb2NhdGlvbikuYXR0cignaHJlZicpLmluY2x1ZGVzKCdpbmRleC5waHAnKSkge1xuXHRcdGlmKCQobG9jYXRpb24pLmF0dHIoJ2hyZWYnKS5pbmNsdWRlcygnaW1hZ2luZS1pZicpKSB7XG5cdFx0XHRwYWdlTG9hZGVyKDQpO1xuXHRcdH1cblx0XHRpZigkKGxvY2F0aW9uKS5hdHRyKCdocmVmJykuaW5jbHVkZXMoJ2hvdy13ZS1pbm5vdmF0ZScpKSB7XG5cdFx0XHRwYWdlTG9hZGVyKDMpO1xuXHRcdH1cblx0XHRpZigkKGxvY2F0aW9uKS5hdHRyKCdocmVmJykuaW5jbHVkZXMoJ3dvcmstd2l0aC11cycpKSB7XG5cdFx0XHRwYWdlTG9hZGVyKDUpO1xuXHRcdH1cblx0XHRpZigkKGxvY2F0aW9uKS5hdHRyKCdocmVmJykuaW5jbHVkZXMoJ2NvbnRhY3QtdXMnKSkge1xuXHRcdFx0cGFnZUxvYWRlcig2KTtcblx0XHR9XG5cdFx0aWYoJChsb2NhdGlvbikuYXR0cignaHJlZicpLmluY2x1ZGVzKCdob21lLXZpZGVvJykpIHtcblx0XHRcdHNldEludGVydmFsKCgpID0+IHtcblx0XHRcdFx0aGlkZUxvYWRpbmdBbmltYXRpb24oKTtcblx0XHRcdH0sIDUwMClcblx0XHR9XG5cdH1cblxuLy8gU1dJUEUgRVZFTlRTIERFVEVDVE9SIEZVTkNUSU9OIFxcXFxcblxuICBmdW5jdGlvbiBkZXRlY3Rzd2lwZShlbCwgZnVuYykge1xuXHQgIGxldCBzd2lwZV9kZXQgPSB7fTtcblx0ICBzd2lwZV9kZXQuc1ggPSAwOyBzd2lwZV9kZXQuc1kgPSAwOyBzd2lwZV9kZXQuZVggPSAwOyBzd2lwZV9kZXQuZVkgPSAwO1xuXHQgIHZhciBtaW5feCA9IDMwOyAgLy9taW4geCBzd2lwZSBmb3IgaG9yaXpvbnRhbCBzd2lwZVxuXHQgIHZhciBtYXhfeCA9IDMwOyAgLy9tYXggeCBkaWZmZXJlbmNlIGZvciB2ZXJ0aWNhbCBzd2lwZVxuXHQgIHZhciBtaW5feSA9IDUwOyAgLy9taW4geSBzd2lwZSBmb3IgdmVydGljYWwgc3dpcGVcblx0ICB2YXIgbWF4X3kgPSA2MDsgIC8vbWF4IHkgZGlmZmVyZW5jZSBmb3IgaG9yaXpvbnRhbCBzd2lwZVxuXHQgIHZhciBkaXJlYyA9IFwiXCI7XG5cdCAgbGV0IGVsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsKTtcblx0ICBlbGUuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsZnVuY3Rpb24oZSl7XG5cdCAgICB2YXIgdCA9IGUudG91Y2hlc1swXTtcblx0ICAgIHN3aXBlX2RldC5zWCA9IHQuc2NyZWVuWDsgXG5cdCAgICBzd2lwZV9kZXQuc1kgPSB0LnNjcmVlblk7XG5cdCAgfSxmYWxzZSk7XG5cdCAgZWxlLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsZnVuY3Rpb24oZSl7XG5cdCAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cdCAgICB2YXIgdCA9IGUudG91Y2hlc1swXTtcblx0ICAgIHN3aXBlX2RldC5lWCA9IHQuc2NyZWVuWDsgXG5cdCAgICBzd2lwZV9kZXQuZVkgPSB0LnNjcmVlblk7ICAgIFxuXHQgIH0sZmFsc2UpO1xuXHQgIGVsZS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsZnVuY3Rpb24oZSl7XG5cdCAgICAvL2hvcml6b250YWwgZGV0ZWN0aW9uXG5cdCAgICBpZiAoKCgoc3dpcGVfZGV0LmVYIC0gbWluX3ggPiBzd2lwZV9kZXQuc1gpIHx8IChzd2lwZV9kZXQuZVggKyBtaW5feCA8IHN3aXBlX2RldC5zWCkpICYmICgoc3dpcGVfZGV0LmVZIDwgc3dpcGVfZGV0LnNZICsgbWF4X3kpICYmIChzd2lwZV9kZXQuc1kgPiBzd2lwZV9kZXQuZVkgLSBtYXhfeSkgJiYgKHN3aXBlX2RldC5lWCA+IDApKSkpIHtcblx0ICAgICAgaWYoc3dpcGVfZGV0LmVYID4gc3dpcGVfZGV0LnNYKSBkaXJlYyA9IFwiclwiO1xuXHQgICAgICBlbHNlIGRpcmVjID0gXCJsXCI7XG5cdCAgICB9XG5cdCAgICAvL3ZlcnRpY2FsIGRldGVjdGlvblxuXHQgICAgZWxzZSBpZiAoKCgoc3dpcGVfZGV0LmVZIC0gbWluX3kgPiBzd2lwZV9kZXQuc1kpIHx8IChzd2lwZV9kZXQuZVkgKyBtaW5feSA8IHN3aXBlX2RldC5zWSkpICYmICgoc3dpcGVfZGV0LmVYIDwgc3dpcGVfZGV0LnNYICsgbWF4X3gpICYmIChzd2lwZV9kZXQuc1ggPiBzd2lwZV9kZXQuZVggLSBtYXhfeCkgJiYgKHN3aXBlX2RldC5lWSA+IDApKSkpIHtcblx0ICAgICAgaWYoc3dpcGVfZGV0LmVZID4gc3dpcGVfZGV0LnNZKSBkaXJlYyA9IFwiZFwiO1xuXHQgICAgICBlbHNlIGRpcmVjID0gXCJ1XCI7XG5cdCAgICB9XG5cblx0ICAgIGlmIChkaXJlYyAhPSBcIlwiKSB7XG5cdCAgICAgIGlmKHR5cGVvZiBmdW5jID09ICdmdW5jdGlvbicpIGZ1bmMoZWwsZGlyZWMpO1xuXHQgICAgfVxuXHQgICAgbGV0IGRpcmVjID0gXCJcIjtcblx0ICAgIHN3aXBlX2RldC5zWCA9IDA7IHN3aXBlX2RldC5zWSA9IDA7IHN3aXBlX2RldC5lWCA9IDA7IHN3aXBlX2RldC5lWSA9IDA7XG5cdCAgfSxmYWxzZSk7ICBcblx0fVxuXG4vLyBDSE9TRSBUSEUgTkVYVCBTTElERSBUTyBTSE9XIEFORCBDTElDSyBUSEUgUEFHSU5BVElPTiBCVVRUT04gVEhBVCBSRUxBVEVTIFRPIElULiBcXFxcXG5cblx0Y29uc3Qgc3dpcGVDb250cm9sbGVyID0gKGVsLCBkKSA9PiB7XG5cblx0XHRpZihlbCA9PT0gJ3NlY3Rpb240Jykge1xuXG5cdFx0XHRjb25zdCBzZWN0aW9uNFBhZ2luYXRpb25MZW5ndGggPSAkKCcuc2VjdGlvbjRQYWdpbmF0b3JCdXR0b24nKS5sZW5ndGg7XG5cblx0XHRcdGlmKGQgPT09ICdsJykge1xuXG5cdFx0XHRcdGlmKHNlY3Rpb240SWR4IDwgc2VjdGlvbjRQYWdpbmF0aW9uTGVuZ3RoIC0gMSkge1xuXHRcdFx0XHRcdHNlY3Rpb240SWR4Kys7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0c2VjdGlvbjRJZHggPSAwO1xuXHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0XHQkKCcuc2VjdGlvbjRQYWdpbmF0b3JCdXR0b24nKVtzZWN0aW9uNElkeF0uY2xpY2soKTtcblx0XHRcdH1cblx0XHRcdGlmKGQgPT09ICdyJykge1xuXG5cdFx0XHRcdGlmKHNlY3Rpb240SWR4ID4gMCkge1xuXHRcdFx0XHRcdHNlY3Rpb240SWR4LS07XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0c2VjdGlvbjRJZHggPSBzZWN0aW9uNFBhZ2luYXRpb25MZW5ndGggLSAxO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0JCgnLnNlY3Rpb240UGFnaW5hdG9yQnV0dG9uJylbc2VjdGlvbjRJZHhdLmNsaWNrKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKGVsID09PSAnc2VjdGlvbjMnKSB7XG5cblx0XHRcdGNvbnN0IHNlY3Rpb24zUGFnaW5hdGlvbkxlbmd0aCA9ICQoJy5zZWN0aW9uM1BhZ2luYXRvckJ1dHRvbicpLmxlbmd0aDtcblxuXHRcdFx0aWYoZCA9PT0gJ2wnKSB7XG5cblx0XHRcdFx0aWYoc2VjdGlvbjNJZHggPCBzZWN0aW9uM1BhZ2luYXRpb25MZW5ndGggLSAxKSB7XG5cdFx0XHRcdFx0c2VjdGlvbjNJZHgrKztcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRzZWN0aW9uM0lkeCA9IDA7XG5cdFx0XHRcdH1cblx0XHRcdFx0XG5cdFx0XHRcdCQoJy5zZWN0aW9uM1BhZ2luYXRvckJ1dHRvbicpW3NlY3Rpb24zSWR4XS5jbGljaygpO1xuXHRcdFx0fVxuXHRcdFx0aWYoZCA9PT0gJ3InKSB7XG5cblx0XHRcdFx0aWYoc2VjdGlvbjNJZHggPiAwKSB7XG5cdFx0XHRcdFx0c2VjdGlvbjNJZHgtLTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRzZWN0aW9uM0lkeCA9IHNlY3Rpb24zUGFnaW5hdGlvbkxlbmd0aCAtIDE7XG5cdFx0XHRcdH1cblx0XHRcdFx0XG5cdFx0XHRcdCQoJy5zZWN0aW9uM1BhZ2luYXRvckJ1dHRvbicpW3NlY3Rpb24zSWR4XS5jbGljaygpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG4vLyBJTklUSUFURSBGT1IgU1dJUEUgREVURUNUSU9OIE9OIFNFQ1RJT05TIDMgQU5EIDQgRVhDRVBUIElOIEFETUlOIFBSRVZJRVcuIFxcXFxcblxuXHRpZighJChsb2NhdGlvbikuYXR0cignaHJlZicpLmluY2x1ZGVzKCdpbmRleC5waHAnKSkge1xuXHRcdGRldGVjdHN3aXBlKCdzZWN0aW9uNCcsIHN3aXBlQ29udHJvbGxlcik7XG5cdFx0ZGV0ZWN0c3dpcGUoJ3NlY3Rpb24zJywgc3dpcGVDb250cm9sbGVyKTtcblx0fVxufSk7Il19
}).call(this,require("fsovz6"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/fake_8300fd91.js","/")
},{"buffer":2,"fsovz6":3}]},{},[5])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYW1pYW53aHl0ZS9Eb2N1bWVudHMvUHJvamVjdHMvY3JhZnRGYW50YXN0ZWMvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9kYW1pYW53aHl0ZS9Eb2N1bWVudHMvUHJvamVjdHMvY3JhZnRGYW50YXN0ZWMvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jhc2U2NC1qcy9saWIvYjY0LmpzIiwiL1VzZXJzL2RhbWlhbndoeXRlL0RvY3VtZW50cy9Qcm9qZWN0cy9jcmFmdEZhbnRhc3RlYy9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnVmZmVyL2luZGV4LmpzIiwiL1VzZXJzL2RhbWlhbndoeXRlL0RvY3VtZW50cy9Qcm9qZWN0cy9jcmFmdEZhbnRhc3RlYy9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwiL1VzZXJzL2RhbWlhbndoeXRlL0RvY3VtZW50cy9Qcm9qZWN0cy9jcmFmdEZhbnRhc3RlYy9ub2RlX21vZHVsZXMvaWVlZTc1NC9pbmRleC5qcyIsIi9Vc2Vycy9kYW1pYW53aHl0ZS9Eb2N1bWVudHMvUHJvamVjdHMvY3JhZnRGYW50YXN0ZWMvc291cmNlL2pzL2NvbWJpbmVkL2Zha2VfODMwMGZkOTEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2bENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbnZhciBsb29rdXAgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLyc7XG5cbjsoZnVuY3Rpb24gKGV4cG9ydHMpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG4gIHZhciBBcnIgPSAodHlwZW9mIFVpbnQ4QXJyYXkgIT09ICd1bmRlZmluZWQnKVxuICAgID8gVWludDhBcnJheVxuICAgIDogQXJyYXlcblxuXHR2YXIgUExVUyAgID0gJysnLmNoYXJDb2RlQXQoMClcblx0dmFyIFNMQVNIICA9ICcvJy5jaGFyQ29kZUF0KDApXG5cdHZhciBOVU1CRVIgPSAnMCcuY2hhckNvZGVBdCgwKVxuXHR2YXIgTE9XRVIgID0gJ2EnLmNoYXJDb2RlQXQoMClcblx0dmFyIFVQUEVSICA9ICdBJy5jaGFyQ29kZUF0KDApXG5cdHZhciBQTFVTX1VSTF9TQUZFID0gJy0nLmNoYXJDb2RlQXQoMClcblx0dmFyIFNMQVNIX1VSTF9TQUZFID0gJ18nLmNoYXJDb2RlQXQoMClcblxuXHRmdW5jdGlvbiBkZWNvZGUgKGVsdCkge1xuXHRcdHZhciBjb2RlID0gZWx0LmNoYXJDb2RlQXQoMClcblx0XHRpZiAoY29kZSA9PT0gUExVUyB8fFxuXHRcdCAgICBjb2RlID09PSBQTFVTX1VSTF9TQUZFKVxuXHRcdFx0cmV0dXJuIDYyIC8vICcrJ1xuXHRcdGlmIChjb2RlID09PSBTTEFTSCB8fFxuXHRcdCAgICBjb2RlID09PSBTTEFTSF9VUkxfU0FGRSlcblx0XHRcdHJldHVybiA2MyAvLyAnLydcblx0XHRpZiAoY29kZSA8IE5VTUJFUilcblx0XHRcdHJldHVybiAtMSAvL25vIG1hdGNoXG5cdFx0aWYgKGNvZGUgPCBOVU1CRVIgKyAxMClcblx0XHRcdHJldHVybiBjb2RlIC0gTlVNQkVSICsgMjYgKyAyNlxuXHRcdGlmIChjb2RlIDwgVVBQRVIgKyAyNilcblx0XHRcdHJldHVybiBjb2RlIC0gVVBQRVJcblx0XHRpZiAoY29kZSA8IExPV0VSICsgMjYpXG5cdFx0XHRyZXR1cm4gY29kZSAtIExPV0VSICsgMjZcblx0fVxuXG5cdGZ1bmN0aW9uIGI2NFRvQnl0ZUFycmF5IChiNjQpIHtcblx0XHR2YXIgaSwgaiwgbCwgdG1wLCBwbGFjZUhvbGRlcnMsIGFyclxuXG5cdFx0aWYgKGI2NC5sZW5ndGggJSA0ID4gMCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHN0cmluZy4gTGVuZ3RoIG11c3QgYmUgYSBtdWx0aXBsZSBvZiA0Jylcblx0XHR9XG5cblx0XHQvLyB0aGUgbnVtYmVyIG9mIGVxdWFsIHNpZ25zIChwbGFjZSBob2xkZXJzKVxuXHRcdC8vIGlmIHRoZXJlIGFyZSB0d28gcGxhY2Vob2xkZXJzLCB0aGFuIHRoZSB0d28gY2hhcmFjdGVycyBiZWZvcmUgaXRcblx0XHQvLyByZXByZXNlbnQgb25lIGJ5dGVcblx0XHQvLyBpZiB0aGVyZSBpcyBvbmx5IG9uZSwgdGhlbiB0aGUgdGhyZWUgY2hhcmFjdGVycyBiZWZvcmUgaXQgcmVwcmVzZW50IDIgYnl0ZXNcblx0XHQvLyB0aGlzIGlzIGp1c3QgYSBjaGVhcCBoYWNrIHRvIG5vdCBkbyBpbmRleE9mIHR3aWNlXG5cdFx0dmFyIGxlbiA9IGI2NC5sZW5ndGhcblx0XHRwbGFjZUhvbGRlcnMgPSAnPScgPT09IGI2NC5jaGFyQXQobGVuIC0gMikgPyAyIDogJz0nID09PSBiNjQuY2hhckF0KGxlbiAtIDEpID8gMSA6IDBcblxuXHRcdC8vIGJhc2U2NCBpcyA0LzMgKyB1cCB0byB0d28gY2hhcmFjdGVycyBvZiB0aGUgb3JpZ2luYWwgZGF0YVxuXHRcdGFyciA9IG5ldyBBcnIoYjY0Lmxlbmd0aCAqIDMgLyA0IC0gcGxhY2VIb2xkZXJzKVxuXG5cdFx0Ly8gaWYgdGhlcmUgYXJlIHBsYWNlaG9sZGVycywgb25seSBnZXQgdXAgdG8gdGhlIGxhc3QgY29tcGxldGUgNCBjaGFyc1xuXHRcdGwgPSBwbGFjZUhvbGRlcnMgPiAwID8gYjY0Lmxlbmd0aCAtIDQgOiBiNjQubGVuZ3RoXG5cblx0XHR2YXIgTCA9IDBcblxuXHRcdGZ1bmN0aW9uIHB1c2ggKHYpIHtcblx0XHRcdGFycltMKytdID0gdlxuXHRcdH1cblxuXHRcdGZvciAoaSA9IDAsIGogPSAwOyBpIDwgbDsgaSArPSA0LCBqICs9IDMpIHtcblx0XHRcdHRtcCA9IChkZWNvZGUoYjY0LmNoYXJBdChpKSkgPDwgMTgpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAxKSkgPDwgMTIpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAyKSkgPDwgNikgfCBkZWNvZGUoYjY0LmNoYXJBdChpICsgMykpXG5cdFx0XHRwdXNoKCh0bXAgJiAweEZGMDAwMCkgPj4gMTYpXG5cdFx0XHRwdXNoKCh0bXAgJiAweEZGMDApID4+IDgpXG5cdFx0XHRwdXNoKHRtcCAmIDB4RkYpXG5cdFx0fVxuXG5cdFx0aWYgKHBsYWNlSG9sZGVycyA9PT0gMikge1xuXHRcdFx0dG1wID0gKGRlY29kZShiNjQuY2hhckF0KGkpKSA8PCAyKSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMSkpID4+IDQpXG5cdFx0XHRwdXNoKHRtcCAmIDB4RkYpXG5cdFx0fSBlbHNlIGlmIChwbGFjZUhvbGRlcnMgPT09IDEpIHtcblx0XHRcdHRtcCA9IChkZWNvZGUoYjY0LmNoYXJBdChpKSkgPDwgMTApIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAxKSkgPDwgNCkgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDIpKSA+PiAyKVxuXHRcdFx0cHVzaCgodG1wID4+IDgpICYgMHhGRilcblx0XHRcdHB1c2godG1wICYgMHhGRilcblx0XHR9XG5cblx0XHRyZXR1cm4gYXJyXG5cdH1cblxuXHRmdW5jdGlvbiB1aW50OFRvQmFzZTY0ICh1aW50OCkge1xuXHRcdHZhciBpLFxuXHRcdFx0ZXh0cmFCeXRlcyA9IHVpbnQ4Lmxlbmd0aCAlIDMsIC8vIGlmIHdlIGhhdmUgMSBieXRlIGxlZnQsIHBhZCAyIGJ5dGVzXG5cdFx0XHRvdXRwdXQgPSBcIlwiLFxuXHRcdFx0dGVtcCwgbGVuZ3RoXG5cblx0XHRmdW5jdGlvbiBlbmNvZGUgKG51bSkge1xuXHRcdFx0cmV0dXJuIGxvb2t1cC5jaGFyQXQobnVtKVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHRyaXBsZXRUb0Jhc2U2NCAobnVtKSB7XG5cdFx0XHRyZXR1cm4gZW5jb2RlKG51bSA+PiAxOCAmIDB4M0YpICsgZW5jb2RlKG51bSA+PiAxMiAmIDB4M0YpICsgZW5jb2RlKG51bSA+PiA2ICYgMHgzRikgKyBlbmNvZGUobnVtICYgMHgzRilcblx0XHR9XG5cblx0XHQvLyBnbyB0aHJvdWdoIHRoZSBhcnJheSBldmVyeSB0aHJlZSBieXRlcywgd2UnbGwgZGVhbCB3aXRoIHRyYWlsaW5nIHN0dWZmIGxhdGVyXG5cdFx0Zm9yIChpID0gMCwgbGVuZ3RoID0gdWludDgubGVuZ3RoIC0gZXh0cmFCeXRlczsgaSA8IGxlbmd0aDsgaSArPSAzKSB7XG5cdFx0XHR0ZW1wID0gKHVpbnQ4W2ldIDw8IDE2KSArICh1aW50OFtpICsgMV0gPDwgOCkgKyAodWludDhbaSArIDJdKVxuXHRcdFx0b3V0cHV0ICs9IHRyaXBsZXRUb0Jhc2U2NCh0ZW1wKVxuXHRcdH1cblxuXHRcdC8vIHBhZCB0aGUgZW5kIHdpdGggemVyb3MsIGJ1dCBtYWtlIHN1cmUgdG8gbm90IGZvcmdldCB0aGUgZXh0cmEgYnl0ZXNcblx0XHRzd2l0Y2ggKGV4dHJhQnl0ZXMpIHtcblx0XHRcdGNhc2UgMTpcblx0XHRcdFx0dGVtcCA9IHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDFdXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUodGVtcCA+PiAyKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKCh0ZW1wIDw8IDQpICYgMHgzRilcblx0XHRcdFx0b3V0cHV0ICs9ICc9PSdcblx0XHRcdFx0YnJlYWtcblx0XHRcdGNhc2UgMjpcblx0XHRcdFx0dGVtcCA9ICh1aW50OFt1aW50OC5sZW5ndGggLSAyXSA8PCA4KSArICh1aW50OFt1aW50OC5sZW5ndGggLSAxXSlcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSh0ZW1wID4+IDEwKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKCh0ZW1wID4+IDQpICYgMHgzRilcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSgodGVtcCA8PCAyKSAmIDB4M0YpXG5cdFx0XHRcdG91dHB1dCArPSAnPSdcblx0XHRcdFx0YnJlYWtcblx0XHR9XG5cblx0XHRyZXR1cm4gb3V0cHV0XG5cdH1cblxuXHRleHBvcnRzLnRvQnl0ZUFycmF5ID0gYjY0VG9CeXRlQXJyYXlcblx0ZXhwb3J0cy5mcm9tQnl0ZUFycmF5ID0gdWludDhUb0Jhc2U2NFxufSh0eXBlb2YgZXhwb3J0cyA9PT0gJ3VuZGVmaW5lZCcgPyAodGhpcy5iYXNlNjRqcyA9IHt9KSA6IGV4cG9ydHMpKVxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcImZzb3Z6NlwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9iYXNlNjQtanMvbGliL2I2NC5qc1wiLFwiLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9iYXNlNjQtanMvbGliXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLyohXG4gKiBUaGUgYnVmZmVyIG1vZHVsZSBmcm9tIG5vZGUuanMsIGZvciB0aGUgYnJvd3Nlci5cbiAqXG4gKiBAYXV0aG9yICAgRmVyb3NzIEFib3VraGFkaWplaCA8ZmVyb3NzQGZlcm9zcy5vcmc+IDxodHRwOi8vZmVyb3NzLm9yZz5cbiAqIEBsaWNlbnNlICBNSVRcbiAqL1xuXG52YXIgYmFzZTY0ID0gcmVxdWlyZSgnYmFzZTY0LWpzJylcbnZhciBpZWVlNzU0ID0gcmVxdWlyZSgnaWVlZTc1NCcpXG5cbmV4cG9ydHMuQnVmZmVyID0gQnVmZmVyXG5leHBvcnRzLlNsb3dCdWZmZXIgPSBCdWZmZXJcbmV4cG9ydHMuSU5TUEVDVF9NQVhfQllURVMgPSA1MFxuQnVmZmVyLnBvb2xTaXplID0gODE5MlxuXG4vKipcbiAqIElmIGBCdWZmZXIuX3VzZVR5cGVkQXJyYXlzYDpcbiAqICAgPT09IHRydWUgICAgVXNlIFVpbnQ4QXJyYXkgaW1wbGVtZW50YXRpb24gKGZhc3Rlc3QpXG4gKiAgID09PSBmYWxzZSAgIFVzZSBPYmplY3QgaW1wbGVtZW50YXRpb24gKGNvbXBhdGlibGUgZG93biB0byBJRTYpXG4gKi9cbkJ1ZmZlci5fdXNlVHlwZWRBcnJheXMgPSAoZnVuY3Rpb24gKCkge1xuICAvLyBEZXRlY3QgaWYgYnJvd3NlciBzdXBwb3J0cyBUeXBlZCBBcnJheXMuIFN1cHBvcnRlZCBicm93c2VycyBhcmUgSUUgMTArLCBGaXJlZm94IDQrLFxuICAvLyBDaHJvbWUgNyssIFNhZmFyaSA1LjErLCBPcGVyYSAxMS42KywgaU9TIDQuMisuIElmIHRoZSBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgYWRkaW5nXG4gIC8vIHByb3BlcnRpZXMgdG8gYFVpbnQ4QXJyYXlgIGluc3RhbmNlcywgdGhlbiB0aGF0J3MgdGhlIHNhbWUgYXMgbm8gYFVpbnQ4QXJyYXlgIHN1cHBvcnRcbiAgLy8gYmVjYXVzZSB3ZSBuZWVkIHRvIGJlIGFibGUgdG8gYWRkIGFsbCB0aGUgbm9kZSBCdWZmZXIgQVBJIG1ldGhvZHMuIFRoaXMgaXMgYW4gaXNzdWVcbiAgLy8gaW4gRmlyZWZveCA0LTI5LiBOb3cgZml4ZWQ6IGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTY5NTQzOFxuICB0cnkge1xuICAgIHZhciBidWYgPSBuZXcgQXJyYXlCdWZmZXIoMClcbiAgICB2YXIgYXJyID0gbmV3IFVpbnQ4QXJyYXkoYnVmKVxuICAgIGFyci5mb28gPSBmdW5jdGlvbiAoKSB7IHJldHVybiA0MiB9XG4gICAgcmV0dXJuIDQyID09PSBhcnIuZm9vKCkgJiZcbiAgICAgICAgdHlwZW9mIGFyci5zdWJhcnJheSA9PT0gJ2Z1bmN0aW9uJyAvLyBDaHJvbWUgOS0xMCBsYWNrIGBzdWJhcnJheWBcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59KSgpXG5cbi8qKlxuICogQ2xhc3M6IEJ1ZmZlclxuICogPT09PT09PT09PT09PVxuICpcbiAqIFRoZSBCdWZmZXIgY29uc3RydWN0b3IgcmV0dXJucyBpbnN0YW5jZXMgb2YgYFVpbnQ4QXJyYXlgIHRoYXQgYXJlIGF1Z21lbnRlZFxuICogd2l0aCBmdW5jdGlvbiBwcm9wZXJ0aWVzIGZvciBhbGwgdGhlIG5vZGUgYEJ1ZmZlcmAgQVBJIGZ1bmN0aW9ucy4gV2UgdXNlXG4gKiBgVWludDhBcnJheWAgc28gdGhhdCBzcXVhcmUgYnJhY2tldCBub3RhdGlvbiB3b3JrcyBhcyBleHBlY3RlZCAtLSBpdCByZXR1cm5zXG4gKiBhIHNpbmdsZSBvY3RldC5cbiAqXG4gKiBCeSBhdWdtZW50aW5nIHRoZSBpbnN0YW5jZXMsIHdlIGNhbiBhdm9pZCBtb2RpZnlpbmcgdGhlIGBVaW50OEFycmF5YFxuICogcHJvdG90eXBlLlxuICovXG5mdW5jdGlvbiBCdWZmZXIgKHN1YmplY3QsIGVuY29kaW5nLCBub1plcm8pIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEJ1ZmZlcikpXG4gICAgcmV0dXJuIG5ldyBCdWZmZXIoc3ViamVjdCwgZW5jb2RpbmcsIG5vWmVybylcblxuICB2YXIgdHlwZSA9IHR5cGVvZiBzdWJqZWN0XG5cbiAgLy8gV29ya2Fyb3VuZDogbm9kZSdzIGJhc2U2NCBpbXBsZW1lbnRhdGlvbiBhbGxvd3MgZm9yIG5vbi1wYWRkZWQgc3RyaW5nc1xuICAvLyB3aGlsZSBiYXNlNjQtanMgZG9lcyBub3QuXG4gIGlmIChlbmNvZGluZyA9PT0gJ2Jhc2U2NCcgJiYgdHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICBzdWJqZWN0ID0gc3RyaW5ndHJpbShzdWJqZWN0KVxuICAgIHdoaWxlIChzdWJqZWN0Lmxlbmd0aCAlIDQgIT09IDApIHtcbiAgICAgIHN1YmplY3QgPSBzdWJqZWN0ICsgJz0nXG4gICAgfVxuICB9XG5cbiAgLy8gRmluZCB0aGUgbGVuZ3RoXG4gIHZhciBsZW5ndGhcbiAgaWYgKHR5cGUgPT09ICdudW1iZXInKVxuICAgIGxlbmd0aCA9IGNvZXJjZShzdWJqZWN0KVxuICBlbHNlIGlmICh0eXBlID09PSAnc3RyaW5nJylcbiAgICBsZW5ndGggPSBCdWZmZXIuYnl0ZUxlbmd0aChzdWJqZWN0LCBlbmNvZGluZylcbiAgZWxzZSBpZiAodHlwZSA9PT0gJ29iamVjdCcpXG4gICAgbGVuZ3RoID0gY29lcmNlKHN1YmplY3QubGVuZ3RoKSAvLyBhc3N1bWUgdGhhdCBvYmplY3QgaXMgYXJyYXktbGlrZVxuICBlbHNlXG4gICAgdGhyb3cgbmV3IEVycm9yKCdGaXJzdCBhcmd1bWVudCBuZWVkcyB0byBiZSBhIG51bWJlciwgYXJyYXkgb3Igc3RyaW5nLicpXG5cbiAgdmFyIGJ1ZlxuICBpZiAoQnVmZmVyLl91c2VUeXBlZEFycmF5cykge1xuICAgIC8vIFByZWZlcnJlZDogUmV0dXJuIGFuIGF1Z21lbnRlZCBgVWludDhBcnJheWAgaW5zdGFuY2UgZm9yIGJlc3QgcGVyZm9ybWFuY2VcbiAgICBidWYgPSBCdWZmZXIuX2F1Z21lbnQobmV3IFVpbnQ4QXJyYXkobGVuZ3RoKSlcbiAgfSBlbHNlIHtcbiAgICAvLyBGYWxsYmFjazogUmV0dXJuIFRISVMgaW5zdGFuY2Ugb2YgQnVmZmVyIChjcmVhdGVkIGJ5IGBuZXdgKVxuICAgIGJ1ZiA9IHRoaXNcbiAgICBidWYubGVuZ3RoID0gbGVuZ3RoXG4gICAgYnVmLl9pc0J1ZmZlciA9IHRydWVcbiAgfVxuXG4gIHZhciBpXG4gIGlmIChCdWZmZXIuX3VzZVR5cGVkQXJyYXlzICYmIHR5cGVvZiBzdWJqZWN0LmJ5dGVMZW5ndGggPT09ICdudW1iZXInKSB7XG4gICAgLy8gU3BlZWQgb3B0aW1pemF0aW9uIC0tIHVzZSBzZXQgaWYgd2UncmUgY29weWluZyBmcm9tIGEgdHlwZWQgYXJyYXlcbiAgICBidWYuX3NldChzdWJqZWN0KVxuICB9IGVsc2UgaWYgKGlzQXJyYXlpc2goc3ViamVjdCkpIHtcbiAgICAvLyBUcmVhdCBhcnJheS1pc2ggb2JqZWN0cyBhcyBhIGJ5dGUgYXJyYXlcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChCdWZmZXIuaXNCdWZmZXIoc3ViamVjdCkpXG4gICAgICAgIGJ1ZltpXSA9IHN1YmplY3QucmVhZFVJbnQ4KGkpXG4gICAgICBlbHNlXG4gICAgICAgIGJ1ZltpXSA9IHN1YmplY3RbaV1cbiAgICB9XG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICBidWYud3JpdGUoc3ViamVjdCwgMCwgZW5jb2RpbmcpXG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gJ251bWJlcicgJiYgIUJ1ZmZlci5fdXNlVHlwZWRBcnJheXMgJiYgIW5vWmVybykge1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgYnVmW2ldID0gMFxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBidWZcbn1cblxuLy8gU1RBVElDIE1FVEhPRFNcbi8vID09PT09PT09PT09PT09XG5cbkJ1ZmZlci5pc0VuY29kaW5nID0gZnVuY3Rpb24gKGVuY29kaW5nKSB7XG4gIHN3aXRjaCAoU3RyaW5nKGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgY2FzZSAnYXNjaWknOlxuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICBjYXNlICdyYXcnOlxuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5CdWZmZXIuaXNCdWZmZXIgPSBmdW5jdGlvbiAoYikge1xuICByZXR1cm4gISEoYiAhPT0gbnVsbCAmJiBiICE9PSB1bmRlZmluZWQgJiYgYi5faXNCdWZmZXIpXG59XG5cbkJ1ZmZlci5ieXRlTGVuZ3RoID0gZnVuY3Rpb24gKHN0ciwgZW5jb2RpbmcpIHtcbiAgdmFyIHJldFxuICBzdHIgPSBzdHIgKyAnJ1xuICBzd2l0Y2ggKGVuY29kaW5nIHx8ICd1dGY4Jykge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgICByZXQgPSBzdHIubGVuZ3RoIC8gMlxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgICByZXQgPSB1dGY4VG9CeXRlcyhzdHIpLmxlbmd0aFxuICAgICAgYnJlYWtcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICBjYXNlICdyYXcnOlxuICAgICAgcmV0ID0gc3RyLmxlbmd0aFxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgcmV0ID0gYmFzZTY0VG9CeXRlcyhzdHIpLmxlbmd0aFxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0ID0gc3RyLmxlbmd0aCAqIDJcbiAgICAgIGJyZWFrXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBlbmNvZGluZycpXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG5CdWZmZXIuY29uY2F0ID0gZnVuY3Rpb24gKGxpc3QsIHRvdGFsTGVuZ3RoKSB7XG4gIGFzc2VydChpc0FycmF5KGxpc3QpLCAnVXNhZ2U6IEJ1ZmZlci5jb25jYXQobGlzdCwgW3RvdGFsTGVuZ3RoXSlcXG4nICtcbiAgICAgICdsaXN0IHNob3VsZCBiZSBhbiBBcnJheS4nKVxuXG4gIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBuZXcgQnVmZmVyKDApXG4gIH0gZWxzZSBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gbGlzdFswXVxuICB9XG5cbiAgdmFyIGlcbiAgaWYgKHR5cGVvZiB0b3RhbExlbmd0aCAhPT0gJ251bWJlcicpIHtcbiAgICB0b3RhbExlbmd0aCA9IDBcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgdG90YWxMZW5ndGggKz0gbGlzdFtpXS5sZW5ndGhcbiAgICB9XG4gIH1cblxuICB2YXIgYnVmID0gbmV3IEJ1ZmZlcih0b3RhbExlbmd0aClcbiAgdmFyIHBvcyA9IDBcbiAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV1cbiAgICBpdGVtLmNvcHkoYnVmLCBwb3MpXG4gICAgcG9zICs9IGl0ZW0ubGVuZ3RoXG4gIH1cbiAgcmV0dXJuIGJ1ZlxufVxuXG4vLyBCVUZGRVIgSU5TVEFOQ0UgTUVUSE9EU1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT1cblxuZnVuY3Rpb24gX2hleFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgb2Zmc2V0ID0gTnVtYmVyKG9mZnNldCkgfHwgMFxuICB2YXIgcmVtYWluaW5nID0gYnVmLmxlbmd0aCAtIG9mZnNldFxuICBpZiAoIWxlbmd0aCkge1xuICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICB9IGVsc2Uge1xuICAgIGxlbmd0aCA9IE51bWJlcihsZW5ndGgpXG4gICAgaWYgKGxlbmd0aCA+IHJlbWFpbmluZykge1xuICAgICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gICAgfVxuICB9XG5cbiAgLy8gbXVzdCBiZSBhbiBldmVuIG51bWJlciBvZiBkaWdpdHNcbiAgdmFyIHN0ckxlbiA9IHN0cmluZy5sZW5ndGhcbiAgYXNzZXJ0KHN0ckxlbiAlIDIgPT09IDAsICdJbnZhbGlkIGhleCBzdHJpbmcnKVxuXG4gIGlmIChsZW5ndGggPiBzdHJMZW4gLyAyKSB7XG4gICAgbGVuZ3RoID0gc3RyTGVuIC8gMlxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgYnl0ZSA9IHBhcnNlSW50KHN0cmluZy5zdWJzdHIoaSAqIDIsIDIpLCAxNilcbiAgICBhc3NlcnQoIWlzTmFOKGJ5dGUpLCAnSW52YWxpZCBoZXggc3RyaW5nJylcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSBieXRlXG4gIH1cbiAgQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPSBpICogMlxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiBfdXRmOFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKHV0ZjhUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuZnVuY3Rpb24gX2FzY2lpV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgY2hhcnNXcml0dGVuID0gQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPVxuICAgIGJsaXRCdWZmZXIoYXNjaWlUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuZnVuY3Rpb24gX2JpbmFyeVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIF9hc2NpaVdyaXRlKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gX2Jhc2U2NFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKGJhc2U2NFRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbiAgcmV0dXJuIGNoYXJzV3JpdHRlblxufVxuXG5mdW5jdGlvbiBfdXRmMTZsZVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKHV0ZjE2bGVUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uIChzdHJpbmcsIG9mZnNldCwgbGVuZ3RoLCBlbmNvZGluZykge1xuICAvLyBTdXBwb3J0IGJvdGggKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgsIGVuY29kaW5nKVxuICAvLyBhbmQgdGhlIGxlZ2FjeSAoc3RyaW5nLCBlbmNvZGluZywgb2Zmc2V0LCBsZW5ndGgpXG4gIGlmIChpc0Zpbml0ZShvZmZzZXQpKSB7XG4gICAgaWYgKCFpc0Zpbml0ZShsZW5ndGgpKSB7XG4gICAgICBlbmNvZGluZyA9IGxlbmd0aFxuICAgICAgbGVuZ3RoID0gdW5kZWZpbmVkXG4gICAgfVxuICB9IGVsc2UgeyAgLy8gbGVnYWN5XG4gICAgdmFyIHN3YXAgPSBlbmNvZGluZ1xuICAgIGVuY29kaW5nID0gb2Zmc2V0XG4gICAgb2Zmc2V0ID0gbGVuZ3RoXG4gICAgbGVuZ3RoID0gc3dhcFxuICB9XG5cbiAgb2Zmc2V0ID0gTnVtYmVyKG9mZnNldCkgfHwgMFxuICB2YXIgcmVtYWluaW5nID0gdGhpcy5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgfSBlbHNlIHtcbiAgICBsZW5ndGggPSBOdW1iZXIobGVuZ3RoKVxuICAgIGlmIChsZW5ndGggPiByZW1haW5pbmcpIHtcbiAgICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICAgIH1cbiAgfVxuICBlbmNvZGluZyA9IFN0cmluZyhlbmNvZGluZyB8fCAndXRmOCcpLnRvTG93ZXJDYXNlKClcblxuICB2YXIgcmV0XG4gIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgICAgcmV0ID0gX2hleFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIHJldCA9IF91dGY4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYXNjaWknOlxuICAgICAgcmV0ID0gX2FzY2lpV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgIHJldCA9IF9iaW5hcnlXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgcmV0ID0gX2Jhc2U2NFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXQgPSBfdXRmMTZsZVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2RpbmcnKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIChlbmNvZGluZywgc3RhcnQsIGVuZCkge1xuICB2YXIgc2VsZiA9IHRoaXNcblxuICBlbmNvZGluZyA9IFN0cmluZyhlbmNvZGluZyB8fCAndXRmOCcpLnRvTG93ZXJDYXNlKClcbiAgc3RhcnQgPSBOdW1iZXIoc3RhcnQpIHx8IDBcbiAgZW5kID0gKGVuZCAhPT0gdW5kZWZpbmVkKVxuICAgID8gTnVtYmVyKGVuZClcbiAgICA6IGVuZCA9IHNlbGYubGVuZ3RoXG5cbiAgLy8gRmFzdHBhdGggZW1wdHkgc3RyaW5nc1xuICBpZiAoZW5kID09PSBzdGFydClcbiAgICByZXR1cm4gJydcblxuICB2YXIgcmV0XG4gIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgICAgcmV0ID0gX2hleFNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIHJldCA9IF91dGY4U2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYXNjaWknOlxuICAgICAgcmV0ID0gX2FzY2lpU2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgIHJldCA9IF9iaW5hcnlTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgcmV0ID0gX2Jhc2U2NFNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXQgPSBfdXRmMTZsZVNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2RpbmcnKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ0J1ZmZlcicsXG4gICAgZGF0YTogQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodGhpcy5fYXJyIHx8IHRoaXMsIDApXG4gIH1cbn1cblxuLy8gY29weSh0YXJnZXRCdWZmZXIsIHRhcmdldFN0YXJ0PTAsIHNvdXJjZVN0YXJ0PTAsIHNvdXJjZUVuZD1idWZmZXIubGVuZ3RoKVxuQnVmZmVyLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24gKHRhcmdldCwgdGFyZ2V0X3N0YXJ0LCBzdGFydCwgZW5kKSB7XG4gIHZhciBzb3VyY2UgPSB0aGlzXG5cbiAgaWYgKCFzdGFydCkgc3RhcnQgPSAwXG4gIGlmICghZW5kICYmIGVuZCAhPT0gMCkgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKCF0YXJnZXRfc3RhcnQpIHRhcmdldF9zdGFydCA9IDBcblxuICAvLyBDb3B5IDAgYnl0ZXM7IHdlJ3JlIGRvbmVcbiAgaWYgKGVuZCA9PT0gc3RhcnQpIHJldHVyblxuICBpZiAodGFyZ2V0Lmxlbmd0aCA9PT0gMCB8fCBzb3VyY2UubGVuZ3RoID09PSAwKSByZXR1cm5cblxuICAvLyBGYXRhbCBlcnJvciBjb25kaXRpb25zXG4gIGFzc2VydChlbmQgPj0gc3RhcnQsICdzb3VyY2VFbmQgPCBzb3VyY2VTdGFydCcpXG4gIGFzc2VydCh0YXJnZXRfc3RhcnQgPj0gMCAmJiB0YXJnZXRfc3RhcnQgPCB0YXJnZXQubGVuZ3RoLFxuICAgICAgJ3RhcmdldFN0YXJ0IG91dCBvZiBib3VuZHMnKVxuICBhc3NlcnQoc3RhcnQgPj0gMCAmJiBzdGFydCA8IHNvdXJjZS5sZW5ndGgsICdzb3VyY2VTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgYXNzZXJ0KGVuZCA+PSAwICYmIGVuZCA8PSBzb3VyY2UubGVuZ3RoLCAnc291cmNlRW5kIG91dCBvZiBib3VuZHMnKVxuXG4gIC8vIEFyZSB3ZSBvb2I/XG4gIGlmIChlbmQgPiB0aGlzLmxlbmd0aClcbiAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAodGFyZ2V0Lmxlbmd0aCAtIHRhcmdldF9zdGFydCA8IGVuZCAtIHN0YXJ0KVxuICAgIGVuZCA9IHRhcmdldC5sZW5ndGggLSB0YXJnZXRfc3RhcnQgKyBzdGFydFxuXG4gIHZhciBsZW4gPSBlbmQgLSBzdGFydFxuXG4gIGlmIChsZW4gPCAxMDAgfHwgIUJ1ZmZlci5fdXNlVHlwZWRBcnJheXMpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgdGFyZ2V0W2kgKyB0YXJnZXRfc3RhcnRdID0gdGhpc1tpICsgc3RhcnRdXG4gIH0gZWxzZSB7XG4gICAgdGFyZ2V0Ll9zZXQodGhpcy5zdWJhcnJheShzdGFydCwgc3RhcnQgKyBsZW4pLCB0YXJnZXRfc3RhcnQpXG4gIH1cbn1cblxuZnVuY3Rpb24gX2Jhc2U2NFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKHN0YXJ0ID09PSAwICYmIGVuZCA9PT0gYnVmLmxlbmd0aCkge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1Zi5zbGljZShzdGFydCwgZW5kKSlcbiAgfVxufVxuXG5mdW5jdGlvbiBfdXRmOFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJlcyA9ICcnXG4gIHZhciB0bXAgPSAnJ1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICBpZiAoYnVmW2ldIDw9IDB4N0YpIHtcbiAgICAgIHJlcyArPSBkZWNvZGVVdGY4Q2hhcih0bXApICsgU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0pXG4gICAgICB0bXAgPSAnJ1xuICAgIH0gZWxzZSB7XG4gICAgICB0bXAgKz0gJyUnICsgYnVmW2ldLnRvU3RyaW5nKDE2KVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXMgKyBkZWNvZGVVdGY4Q2hhcih0bXApXG59XG5cbmZ1bmN0aW9uIF9hc2NpaVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJldCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKylcbiAgICByZXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0pXG4gIHJldHVybiByZXRcbn1cblxuZnVuY3Rpb24gX2JpbmFyeVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgcmV0dXJuIF9hc2NpaVNsaWNlKGJ1Ziwgc3RhcnQsIGVuZClcbn1cblxuZnVuY3Rpb24gX2hleFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcblxuICBpZiAoIXN0YXJ0IHx8IHN0YXJ0IDwgMCkgc3RhcnQgPSAwXG4gIGlmICghZW5kIHx8IGVuZCA8IDAgfHwgZW5kID4gbGVuKSBlbmQgPSBsZW5cblxuICB2YXIgb3V0ID0gJydcbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICBvdXQgKz0gdG9IZXgoYnVmW2ldKVxuICB9XG4gIHJldHVybiBvdXRcbn1cblxuZnVuY3Rpb24gX3V0ZjE2bGVTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciBieXRlcyA9IGJ1Zi5zbGljZShzdGFydCwgZW5kKVxuICB2YXIgcmVzID0gJydcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkgKz0gMikge1xuICAgIHJlcyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ5dGVzW2ldICsgYnl0ZXNbaSsxXSAqIDI1NilcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc2xpY2UgPSBmdW5jdGlvbiAoc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgc3RhcnQgPSBjbGFtcChzdGFydCwgbGVuLCAwKVxuICBlbmQgPSBjbGFtcChlbmQsIGxlbiwgbGVuKVxuXG4gIGlmIChCdWZmZXIuX3VzZVR5cGVkQXJyYXlzKSB7XG4gICAgcmV0dXJuIEJ1ZmZlci5fYXVnbWVudCh0aGlzLnN1YmFycmF5KHN0YXJ0LCBlbmQpKVxuICB9IGVsc2Uge1xuICAgIHZhciBzbGljZUxlbiA9IGVuZCAtIHN0YXJ0XG4gICAgdmFyIG5ld0J1ZiA9IG5ldyBCdWZmZXIoc2xpY2VMZW4sIHVuZGVmaW5lZCwgdHJ1ZSlcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNsaWNlTGVuOyBpKyspIHtcbiAgICAgIG5ld0J1ZltpXSA9IHRoaXNbaSArIHN0YXJ0XVxuICAgIH1cbiAgICByZXR1cm4gbmV3QnVmXG4gIH1cbn1cblxuLy8gYGdldGAgd2lsbCBiZSByZW1vdmVkIGluIE5vZGUgMC4xMytcbkJ1ZmZlci5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKG9mZnNldCkge1xuICBjb25zb2xlLmxvZygnLmdldCgpIGlzIGRlcHJlY2F0ZWQuIEFjY2VzcyB1c2luZyBhcnJheSBpbmRleGVzIGluc3RlYWQuJylcbiAgcmV0dXJuIHRoaXMucmVhZFVJbnQ4KG9mZnNldClcbn1cblxuLy8gYHNldGAgd2lsbCBiZSByZW1vdmVkIGluIE5vZGUgMC4xMytcbkJ1ZmZlci5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKHYsIG9mZnNldCkge1xuICBjb25zb2xlLmxvZygnLnNldCgpIGlzIGRlcHJlY2F0ZWQuIEFjY2VzcyB1c2luZyBhcnJheSBpbmRleGVzIGluc3RlYWQuJylcbiAgcmV0dXJuIHRoaXMud3JpdGVVSW50OCh2LCBvZmZzZXQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQ4ID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IHRoaXMubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aClcbiAgICByZXR1cm5cblxuICByZXR1cm4gdGhpc1tvZmZzZXRdXG59XG5cbmZ1bmN0aW9uIF9yZWFkVUludDE2IChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDEgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgdmFyIHZhbFxuICBpZiAobGl0dGxlRW5kaWFuKSB7XG4gICAgdmFsID0gYnVmW29mZnNldF1cbiAgICBpZiAob2Zmc2V0ICsgMSA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgMV0gPDwgOFxuICB9IGVsc2Uge1xuICAgIHZhbCA9IGJ1ZltvZmZzZXRdIDw8IDhcbiAgICBpZiAob2Zmc2V0ICsgMSA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgMV1cbiAgfVxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDE2KHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDE2KHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfcmVhZFVJbnQzMiAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIHZhciB2YWxcbiAgaWYgKGxpdHRsZUVuZGlhbikge1xuICAgIGlmIChvZmZzZXQgKyAyIDwgbGVuKVxuICAgICAgdmFsID0gYnVmW29mZnNldCArIDJdIDw8IDE2XG4gICAgaWYgKG9mZnNldCArIDEgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDFdIDw8IDhcbiAgICB2YWwgfD0gYnVmW29mZnNldF1cbiAgICBpZiAob2Zmc2V0ICsgMyA8IGxlbilcbiAgICAgIHZhbCA9IHZhbCArIChidWZbb2Zmc2V0ICsgM10gPDwgMjQgPj4+IDApXG4gIH0gZWxzZSB7XG4gICAgaWYgKG9mZnNldCArIDEgPCBsZW4pXG4gICAgICB2YWwgPSBidWZbb2Zmc2V0ICsgMV0gPDwgMTZcbiAgICBpZiAob2Zmc2V0ICsgMiA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgMl0gPDwgOFxuICAgIGlmIChvZmZzZXQgKyAzIDwgbGVuKVxuICAgICAgdmFsIHw9IGJ1ZltvZmZzZXQgKyAzXVxuICAgIHZhbCA9IHZhbCArIChidWZbb2Zmc2V0XSA8PCAyNCA+Pj4gMClcbiAgfVxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDMyKHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDMyKHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQ4ID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsXG4gICAgICAgICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IHRoaXMubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aClcbiAgICByZXR1cm5cblxuICB2YXIgbmVnID0gdGhpc1tvZmZzZXRdICYgMHg4MFxuICBpZiAobmVnKVxuICAgIHJldHVybiAoMHhmZiAtIHRoaXNbb2Zmc2V0XSArIDEpICogLTFcbiAgZWxzZVxuICAgIHJldHVybiB0aGlzW29mZnNldF1cbn1cblxuZnVuY3Rpb24gX3JlYWRJbnQxNiAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAxIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIHZhciB2YWwgPSBfcmVhZFVJbnQxNihidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCB0cnVlKVxuICB2YXIgbmVnID0gdmFsICYgMHg4MDAwXG4gIGlmIChuZWcpXG4gICAgcmV0dXJuICgweGZmZmYgLSB2YWwgKyAxKSAqIC0xXG4gIGVsc2VcbiAgICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2TEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRJbnQxNih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MTYodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF9yZWFkSW50MzIgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICB2YXIgdmFsID0gX3JlYWRVSW50MzIoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgdHJ1ZSlcbiAgdmFyIG5lZyA9IHZhbCAmIDB4ODAwMDAwMDBcbiAgaWYgKG5lZylcbiAgICByZXR1cm4gKDB4ZmZmZmZmZmYgLSB2YWwgKyAxKSAqIC0xXG4gIGVsc2VcbiAgICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyTEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRJbnQzMih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MzIodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF9yZWFkRmxvYXQgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgcmV0dXJuIGllZWU3NTQucmVhZChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCAyMywgNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEZsb2F0KHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0QkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRGbG9hdCh0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3JlYWREb3VibGUgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCArIDcgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgcmV0dXJuIGllZWU3NTQucmVhZChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCA1MiwgOClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlTEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWREb3VibGUodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlQkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWREb3VibGUodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50OCA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgPCB0aGlzLmxlbmd0aCwgJ3RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZ1aW50KHZhbHVlLCAweGZmKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aCkgcmV0dXJuXG5cbiAgdGhpc1tvZmZzZXRdID0gdmFsdWVcbn1cblxuZnVuY3Rpb24gX3dyaXRlVUludDE2IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDEgPCBidWYubGVuZ3RoLCAndHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnVpbnQodmFsdWUsIDB4ZmZmZilcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGZvciAodmFyIGkgPSAwLCBqID0gTWF0aC5taW4obGVuIC0gb2Zmc2V0LCAyKTsgaSA8IGo7IGkrKykge1xuICAgIGJ1ZltvZmZzZXQgKyBpXSA9XG4gICAgICAgICh2YWx1ZSAmICgweGZmIDw8ICg4ICogKGxpdHRsZUVuZGlhbiA/IGkgOiAxIC0gaSkpKSkgPj4+XG4gICAgICAgICAgICAobGl0dGxlRW5kaWFuID8gaSA6IDEgLSBpKSAqIDhcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2TEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2QkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlVUludDMyIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAndHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnVpbnQodmFsdWUsIDB4ZmZmZmZmZmYpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBmb3IgKHZhciBpID0gMCwgaiA9IE1hdGgubWluKGxlbiAtIG9mZnNldCwgNCk7IGkgPCBqOyBpKyspIHtcbiAgICBidWZbb2Zmc2V0ICsgaV0gPVxuICAgICAgICAodmFsdWUgPj4+IChsaXR0bGVFbmRpYW4gPyBpIDogMyAtIGkpICogOCkgJiAweGZmXG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQ4ID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IHRoaXMubGVuZ3RoLCAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnNpbnQodmFsdWUsIDB4N2YsIC0weDgwKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aClcbiAgICByZXR1cm5cblxuICBpZiAodmFsdWUgPj0gMClcbiAgICB0aGlzLndyaXRlVUludDgodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpXG4gIGVsc2VcbiAgICB0aGlzLndyaXRlVUludDgoMHhmZiArIHZhbHVlICsgMSwgb2Zmc2V0LCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlSW50MTYgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMSA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmc2ludCh2YWx1ZSwgMHg3ZmZmLCAtMHg4MDAwKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgaWYgKHZhbHVlID49IDApXG4gICAgX3dyaXRlVUludDE2KGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydClcbiAgZWxzZVxuICAgIF93cml0ZVVJbnQxNihidWYsIDB4ZmZmZiArIHZhbHVlICsgMSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2QkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVJbnQzMiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZzaW50KHZhbHVlLCAweDdmZmZmZmZmLCAtMHg4MDAwMDAwMClcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGlmICh2YWx1ZSA+PSAwKVxuICAgIF93cml0ZVVJbnQzMihidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpXG4gIGVsc2VcbiAgICBfd3JpdGVVSW50MzIoYnVmLCAweGZmZmZmZmZmICsgdmFsdWUgKyAxLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZUZsb2F0IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZklFRUU3NTQodmFsdWUsIDMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgsIC0zLjQwMjgyMzQ2NjM4NTI4ODZlKzM4KVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdExFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZURvdWJsZSAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyA3IDwgYnVmLmxlbmd0aCxcbiAgICAgICAgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZJRUVFNzU0KHZhbHVlLCAxLjc5NzY5MzEzNDg2MjMxNTdFKzMwOCwgLTEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4KVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgNTIsIDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG4vLyBmaWxsKHZhbHVlLCBzdGFydD0wLCBlbmQ9YnVmZmVyLmxlbmd0aClcbkJ1ZmZlci5wcm90b3R5cGUuZmlsbCA9IGZ1bmN0aW9uICh2YWx1ZSwgc3RhcnQsIGVuZCkge1xuICBpZiAoIXZhbHVlKSB2YWx1ZSA9IDBcbiAgaWYgKCFzdGFydCkgc3RhcnQgPSAwXG4gIGlmICghZW5kKSBlbmQgPSB0aGlzLmxlbmd0aFxuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgdmFsdWUgPSB2YWx1ZS5jaGFyQ29kZUF0KDApXG4gIH1cblxuICBhc3NlcnQodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiAhaXNOYU4odmFsdWUpLCAndmFsdWUgaXMgbm90IGEgbnVtYmVyJylcbiAgYXNzZXJ0KGVuZCA+PSBzdGFydCwgJ2VuZCA8IHN0YXJ0JylcblxuICAvLyBGaWxsIDAgYnl0ZXM7IHdlJ3JlIGRvbmVcbiAgaWYgKGVuZCA9PT0gc3RhcnQpIHJldHVyblxuICBpZiAodGhpcy5sZW5ndGggPT09IDApIHJldHVyblxuXG4gIGFzc2VydChzdGFydCA+PSAwICYmIHN0YXJ0IDwgdGhpcy5sZW5ndGgsICdzdGFydCBvdXQgb2YgYm91bmRzJylcbiAgYXNzZXJ0KGVuZCA+PSAwICYmIGVuZCA8PSB0aGlzLmxlbmd0aCwgJ2VuZCBvdXQgb2YgYm91bmRzJylcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgIHRoaXNbaV0gPSB2YWx1ZVxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5zcGVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIG91dCA9IFtdXG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgb3V0W2ldID0gdG9IZXgodGhpc1tpXSlcbiAgICBpZiAoaSA9PT0gZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFUykge1xuICAgICAgb3V0W2kgKyAxXSA9ICcuLi4nXG4gICAgICBicmVha1xuICAgIH1cbiAgfVxuICByZXR1cm4gJzxCdWZmZXIgJyArIG91dC5qb2luKCcgJykgKyAnPidcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IGBBcnJheUJ1ZmZlcmAgd2l0aCB0aGUgKmNvcGllZCogbWVtb3J5IG9mIHRoZSBidWZmZXIgaW5zdGFuY2UuXG4gKiBBZGRlZCBpbiBOb2RlIDAuMTIuIE9ubHkgYXZhaWxhYmxlIGluIGJyb3dzZXJzIHRoYXQgc3VwcG9ydCBBcnJheUJ1ZmZlci5cbiAqL1xuQnVmZmVyLnByb3RvdHlwZS50b0FycmF5QnVmZmVyID0gZnVuY3Rpb24gKCkge1xuICBpZiAodHlwZW9mIFVpbnQ4QXJyYXkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgaWYgKEJ1ZmZlci5fdXNlVHlwZWRBcnJheXMpIHtcbiAgICAgIHJldHVybiAobmV3IEJ1ZmZlcih0aGlzKSkuYnVmZmVyXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBidWYgPSBuZXcgVWludDhBcnJheSh0aGlzLmxlbmd0aClcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBidWYubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEpXG4gICAgICAgIGJ1ZltpXSA9IHRoaXNbaV1cbiAgICAgIHJldHVybiBidWYuYnVmZmVyXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcignQnVmZmVyLnRvQXJyYXlCdWZmZXIgbm90IHN1cHBvcnRlZCBpbiB0aGlzIGJyb3dzZXInKVxuICB9XG59XG5cbi8vIEhFTFBFUiBGVU5DVElPTlNcbi8vID09PT09PT09PT09PT09PT1cblxuZnVuY3Rpb24gc3RyaW5ndHJpbSAoc3RyKSB7XG4gIGlmIChzdHIudHJpbSkgcmV0dXJuIHN0ci50cmltKClcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJylcbn1cblxudmFyIEJQID0gQnVmZmVyLnByb3RvdHlwZVxuXG4vKipcbiAqIEF1Z21lbnQgYSBVaW50OEFycmF5ICppbnN0YW5jZSogKG5vdCB0aGUgVWludDhBcnJheSBjbGFzcyEpIHdpdGggQnVmZmVyIG1ldGhvZHNcbiAqL1xuQnVmZmVyLl9hdWdtZW50ID0gZnVuY3Rpb24gKGFycikge1xuICBhcnIuX2lzQnVmZmVyID0gdHJ1ZVxuXG4gIC8vIHNhdmUgcmVmZXJlbmNlIHRvIG9yaWdpbmFsIFVpbnQ4QXJyYXkgZ2V0L3NldCBtZXRob2RzIGJlZm9yZSBvdmVyd3JpdGluZ1xuICBhcnIuX2dldCA9IGFyci5nZXRcbiAgYXJyLl9zZXQgPSBhcnIuc2V0XG5cbiAgLy8gZGVwcmVjYXRlZCwgd2lsbCBiZSByZW1vdmVkIGluIG5vZGUgMC4xMytcbiAgYXJyLmdldCA9IEJQLmdldFxuICBhcnIuc2V0ID0gQlAuc2V0XG5cbiAgYXJyLndyaXRlID0gQlAud3JpdGVcbiAgYXJyLnRvU3RyaW5nID0gQlAudG9TdHJpbmdcbiAgYXJyLnRvTG9jYWxlU3RyaW5nID0gQlAudG9TdHJpbmdcbiAgYXJyLnRvSlNPTiA9IEJQLnRvSlNPTlxuICBhcnIuY29weSA9IEJQLmNvcHlcbiAgYXJyLnNsaWNlID0gQlAuc2xpY2VcbiAgYXJyLnJlYWRVSW50OCA9IEJQLnJlYWRVSW50OFxuICBhcnIucmVhZFVJbnQxNkxFID0gQlAucmVhZFVJbnQxNkxFXG4gIGFyci5yZWFkVUludDE2QkUgPSBCUC5yZWFkVUludDE2QkVcbiAgYXJyLnJlYWRVSW50MzJMRSA9IEJQLnJlYWRVSW50MzJMRVxuICBhcnIucmVhZFVJbnQzMkJFID0gQlAucmVhZFVJbnQzMkJFXG4gIGFyci5yZWFkSW50OCA9IEJQLnJlYWRJbnQ4XG4gIGFyci5yZWFkSW50MTZMRSA9IEJQLnJlYWRJbnQxNkxFXG4gIGFyci5yZWFkSW50MTZCRSA9IEJQLnJlYWRJbnQxNkJFXG4gIGFyci5yZWFkSW50MzJMRSA9IEJQLnJlYWRJbnQzMkxFXG4gIGFyci5yZWFkSW50MzJCRSA9IEJQLnJlYWRJbnQzMkJFXG4gIGFyci5yZWFkRmxvYXRMRSA9IEJQLnJlYWRGbG9hdExFXG4gIGFyci5yZWFkRmxvYXRCRSA9IEJQLnJlYWRGbG9hdEJFXG4gIGFyci5yZWFkRG91YmxlTEUgPSBCUC5yZWFkRG91YmxlTEVcbiAgYXJyLnJlYWREb3VibGVCRSA9IEJQLnJlYWREb3VibGVCRVxuICBhcnIud3JpdGVVSW50OCA9IEJQLndyaXRlVUludDhcbiAgYXJyLndyaXRlVUludDE2TEUgPSBCUC53cml0ZVVJbnQxNkxFXG4gIGFyci53cml0ZVVJbnQxNkJFID0gQlAud3JpdGVVSW50MTZCRVxuICBhcnIud3JpdGVVSW50MzJMRSA9IEJQLndyaXRlVUludDMyTEVcbiAgYXJyLndyaXRlVUludDMyQkUgPSBCUC53cml0ZVVJbnQzMkJFXG4gIGFyci53cml0ZUludDggPSBCUC53cml0ZUludDhcbiAgYXJyLndyaXRlSW50MTZMRSA9IEJQLndyaXRlSW50MTZMRVxuICBhcnIud3JpdGVJbnQxNkJFID0gQlAud3JpdGVJbnQxNkJFXG4gIGFyci53cml0ZUludDMyTEUgPSBCUC53cml0ZUludDMyTEVcbiAgYXJyLndyaXRlSW50MzJCRSA9IEJQLndyaXRlSW50MzJCRVxuICBhcnIud3JpdGVGbG9hdExFID0gQlAud3JpdGVGbG9hdExFXG4gIGFyci53cml0ZUZsb2F0QkUgPSBCUC53cml0ZUZsb2F0QkVcbiAgYXJyLndyaXRlRG91YmxlTEUgPSBCUC53cml0ZURvdWJsZUxFXG4gIGFyci53cml0ZURvdWJsZUJFID0gQlAud3JpdGVEb3VibGVCRVxuICBhcnIuZmlsbCA9IEJQLmZpbGxcbiAgYXJyLmluc3BlY3QgPSBCUC5pbnNwZWN0XG4gIGFyci50b0FycmF5QnVmZmVyID0gQlAudG9BcnJheUJ1ZmZlclxuXG4gIHJldHVybiBhcnJcbn1cblxuLy8gc2xpY2Uoc3RhcnQsIGVuZClcbmZ1bmN0aW9uIGNsYW1wIChpbmRleCwgbGVuLCBkZWZhdWx0VmFsdWUpIHtcbiAgaWYgKHR5cGVvZiBpbmRleCAhPT0gJ251bWJlcicpIHJldHVybiBkZWZhdWx0VmFsdWVcbiAgaW5kZXggPSB+fmluZGV4OyAgLy8gQ29lcmNlIHRvIGludGVnZXIuXG4gIGlmIChpbmRleCA+PSBsZW4pIHJldHVybiBsZW5cbiAgaWYgKGluZGV4ID49IDApIHJldHVybiBpbmRleFxuICBpbmRleCArPSBsZW5cbiAgaWYgKGluZGV4ID49IDApIHJldHVybiBpbmRleFxuICByZXR1cm4gMFxufVxuXG5mdW5jdGlvbiBjb2VyY2UgKGxlbmd0aCkge1xuICAvLyBDb2VyY2UgbGVuZ3RoIHRvIGEgbnVtYmVyIChwb3NzaWJseSBOYU4pLCByb3VuZCB1cFxuICAvLyBpbiBjYXNlIGl0J3MgZnJhY3Rpb25hbCAoZS5nLiAxMjMuNDU2KSB0aGVuIGRvIGFcbiAgLy8gZG91YmxlIG5lZ2F0ZSB0byBjb2VyY2UgYSBOYU4gdG8gMC4gRWFzeSwgcmlnaHQ/XG4gIGxlbmd0aCA9IH5+TWF0aC5jZWlsKCtsZW5ndGgpXG4gIHJldHVybiBsZW5ndGggPCAwID8gMCA6IGxlbmd0aFxufVxuXG5mdW5jdGlvbiBpc0FycmF5IChzdWJqZWN0KSB7XG4gIHJldHVybiAoQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAoc3ViamVjdCkge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoc3ViamVjdCkgPT09ICdbb2JqZWN0IEFycmF5XSdcbiAgfSkoc3ViamVjdClcbn1cblxuZnVuY3Rpb24gaXNBcnJheWlzaCAoc3ViamVjdCkge1xuICByZXR1cm4gaXNBcnJheShzdWJqZWN0KSB8fCBCdWZmZXIuaXNCdWZmZXIoc3ViamVjdCkgfHxcbiAgICAgIHN1YmplY3QgJiYgdHlwZW9mIHN1YmplY3QgPT09ICdvYmplY3QnICYmXG4gICAgICB0eXBlb2Ygc3ViamVjdC5sZW5ndGggPT09ICdudW1iZXInXG59XG5cbmZ1bmN0aW9uIHRvSGV4IChuKSB7XG4gIGlmIChuIDwgMTYpIHJldHVybiAnMCcgKyBuLnRvU3RyaW5nKDE2KVxuICByZXR1cm4gbi50b1N0cmluZygxNilcbn1cblxuZnVuY3Rpb24gdXRmOFRvQnl0ZXMgKHN0cikge1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgYiA9IHN0ci5jaGFyQ29kZUF0KGkpXG4gICAgaWYgKGIgPD0gMHg3RilcbiAgICAgIGJ5dGVBcnJheS5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpKVxuICAgIGVsc2Uge1xuICAgICAgdmFyIHN0YXJ0ID0gaVxuICAgICAgaWYgKGIgPj0gMHhEODAwICYmIGIgPD0gMHhERkZGKSBpKytcbiAgICAgIHZhciBoID0gZW5jb2RlVVJJQ29tcG9uZW50KHN0ci5zbGljZShzdGFydCwgaSsxKSkuc3Vic3RyKDEpLnNwbGl0KCclJylcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgaC5sZW5ndGg7IGorKylcbiAgICAgICAgYnl0ZUFycmF5LnB1c2gocGFyc2VJbnQoaFtqXSwgMTYpKVxuICAgIH1cbiAgfVxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIGFzY2lpVG9CeXRlcyAoc3RyKSB7XG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgIC8vIE5vZGUncyBjb2RlIHNlZW1zIHRvIGJlIGRvaW5nIHRoaXMgYW5kIG5vdCAmIDB4N0YuLlxuICAgIGJ5dGVBcnJheS5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpICYgMHhGRilcbiAgfVxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIHV0ZjE2bGVUb0J5dGVzIChzdHIpIHtcbiAgdmFyIGMsIGhpLCBsb1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICBjID0gc3RyLmNoYXJDb2RlQXQoaSlcbiAgICBoaSA9IGMgPj4gOFxuICAgIGxvID0gYyAlIDI1NlxuICAgIGJ5dGVBcnJheS5wdXNoKGxvKVxuICAgIGJ5dGVBcnJheS5wdXNoKGhpKVxuICB9XG5cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiBiYXNlNjRUb0J5dGVzIChzdHIpIHtcbiAgcmV0dXJuIGJhc2U2NC50b0J5dGVBcnJheShzdHIpXG59XG5cbmZ1bmN0aW9uIGJsaXRCdWZmZXIgKHNyYywgZHN0LCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgcG9zXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoKGkgKyBvZmZzZXQgPj0gZHN0Lmxlbmd0aCkgfHwgKGkgPj0gc3JjLmxlbmd0aCkpXG4gICAgICBicmVha1xuICAgIGRzdFtpICsgb2Zmc2V0XSA9IHNyY1tpXVxuICB9XG4gIHJldHVybiBpXG59XG5cbmZ1bmN0aW9uIGRlY29kZVV0ZjhDaGFyIChzdHIpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHN0cilcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoMHhGRkZEKSAvLyBVVEYgOCBpbnZhbGlkIGNoYXJcbiAgfVxufVxuXG4vKlxuICogV2UgaGF2ZSB0byBtYWtlIHN1cmUgdGhhdCB0aGUgdmFsdWUgaXMgYSB2YWxpZCBpbnRlZ2VyLiBUaGlzIG1lYW5zIHRoYXQgaXRcbiAqIGlzIG5vbi1uZWdhdGl2ZS4gSXQgaGFzIG5vIGZyYWN0aW9uYWwgY29tcG9uZW50IGFuZCB0aGF0IGl0IGRvZXMgbm90XG4gKiBleGNlZWQgdGhlIG1heGltdW0gYWxsb3dlZCB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gdmVyaWZ1aW50ICh2YWx1ZSwgbWF4KSB7XG4gIGFzc2VydCh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInLCAnY2Fubm90IHdyaXRlIGEgbm9uLW51bWJlciBhcyBhIG51bWJlcicpXG4gIGFzc2VydCh2YWx1ZSA+PSAwLCAnc3BlY2lmaWVkIGEgbmVnYXRpdmUgdmFsdWUgZm9yIHdyaXRpbmcgYW4gdW5zaWduZWQgdmFsdWUnKVxuICBhc3NlcnQodmFsdWUgPD0gbWF4LCAndmFsdWUgaXMgbGFyZ2VyIHRoYW4gbWF4aW11bSB2YWx1ZSBmb3IgdHlwZScpXG4gIGFzc2VydChNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWUsICd2YWx1ZSBoYXMgYSBmcmFjdGlvbmFsIGNvbXBvbmVudCcpXG59XG5cbmZ1bmN0aW9uIHZlcmlmc2ludCAodmFsdWUsIG1heCwgbWluKSB7XG4gIGFzc2VydCh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInLCAnY2Fubm90IHdyaXRlIGEgbm9uLW51bWJlciBhcyBhIG51bWJlcicpXG4gIGFzc2VydCh2YWx1ZSA8PSBtYXgsICd2YWx1ZSBsYXJnZXIgdGhhbiBtYXhpbXVtIGFsbG93ZWQgdmFsdWUnKVxuICBhc3NlcnQodmFsdWUgPj0gbWluLCAndmFsdWUgc21hbGxlciB0aGFuIG1pbmltdW0gYWxsb3dlZCB2YWx1ZScpXG4gIGFzc2VydChNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWUsICd2YWx1ZSBoYXMgYSBmcmFjdGlvbmFsIGNvbXBvbmVudCcpXG59XG5cbmZ1bmN0aW9uIHZlcmlmSUVFRTc1NCAodmFsdWUsIG1heCwgbWluKSB7XG4gIGFzc2VydCh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInLCAnY2Fubm90IHdyaXRlIGEgbm9uLW51bWJlciBhcyBhIG51bWJlcicpXG4gIGFzc2VydCh2YWx1ZSA8PSBtYXgsICd2YWx1ZSBsYXJnZXIgdGhhbiBtYXhpbXVtIGFsbG93ZWQgdmFsdWUnKVxuICBhc3NlcnQodmFsdWUgPj0gbWluLCAndmFsdWUgc21hbGxlciB0aGFuIG1pbmltdW0gYWxsb3dlZCB2YWx1ZScpXG59XG5cbmZ1bmN0aW9uIGFzc2VydCAodGVzdCwgbWVzc2FnZSkge1xuICBpZiAoIXRlc3QpIHRocm93IG5ldyBFcnJvcihtZXNzYWdlIHx8ICdGYWlsZWQgYXNzZXJ0aW9uJylcbn1cblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJmc292ejZcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnVmZmVyL2luZGV4LmpzXCIsXCIvLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2J1ZmZlclwiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbnByb2Nlc3MubmV4dFRpY2sgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBjYW5TZXRJbW1lZGlhdGUgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5zZXRJbW1lZGlhdGU7XG4gICAgdmFyIGNhblBvc3QgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5wb3N0TWVzc2FnZSAmJiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lclxuICAgIDtcblxuICAgIGlmIChjYW5TZXRJbW1lZGlhdGUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7IHJldHVybiB3aW5kb3cuc2V0SW1tZWRpYXRlKGYpIH07XG4gICAgfVxuXG4gICAgaWYgKGNhblBvc3QpIHtcbiAgICAgICAgdmFyIHF1ZXVlID0gW107XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICB2YXIgc291cmNlID0gZXYuc291cmNlO1xuICAgICAgICAgICAgaWYgKChzb3VyY2UgPT09IHdpbmRvdyB8fCBzb3VyY2UgPT09IG51bGwpICYmIGV2LmRhdGEgPT09ICdwcm9jZXNzLXRpY2snKSB7XG4gICAgICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgaWYgKHF1ZXVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZuID0gcXVldWUuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICAgICAgZm4oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRydWUpO1xuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICAgICAgcXVldWUucHVzaChmbik7XG4gICAgICAgICAgICB3aW5kb3cucG9zdE1lc3NhZ2UoJ3Byb2Nlc3MtdGljaycsICcqJyk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZm4sIDApO1xuICAgIH07XG59KSgpO1xuXG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn1cblxuLy8gVE9ETyhzaHR5bG1hbilcbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcImZzb3Z6NlwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanNcIixcIi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzc1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbmV4cG9ydHMucmVhZCA9IGZ1bmN0aW9uIChidWZmZXIsIG9mZnNldCwgaXNMRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtXG4gIHZhciBlTGVuID0gbkJ5dGVzICogOCAtIG1MZW4gLSAxXG4gIHZhciBlTWF4ID0gKDEgPDwgZUxlbikgLSAxXG4gIHZhciBlQmlhcyA9IGVNYXggPj4gMVxuICB2YXIgbkJpdHMgPSAtN1xuICB2YXIgaSA9IGlzTEUgPyAobkJ5dGVzIC0gMSkgOiAwXG4gIHZhciBkID0gaXNMRSA/IC0xIDogMVxuICB2YXIgcyA9IGJ1ZmZlcltvZmZzZXQgKyBpXVxuXG4gIGkgKz0gZFxuXG4gIGUgPSBzICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpXG4gIHMgPj49ICgtbkJpdHMpXG4gIG5CaXRzICs9IGVMZW5cbiAgZm9yICg7IG5CaXRzID4gMDsgZSA9IGUgKiAyNTYgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCkge31cblxuICBtID0gZSAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBlID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBtTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IG0gPSBtICogMjU2ICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpIHt9XG5cbiAgaWYgKGUgPT09IDApIHtcbiAgICBlID0gMSAtIGVCaWFzXG4gIH0gZWxzZSBpZiAoZSA9PT0gZU1heCkge1xuICAgIHJldHVybiBtID8gTmFOIDogKChzID8gLTEgOiAxKSAqIEluZmluaXR5KVxuICB9IGVsc2Uge1xuICAgIG0gPSBtICsgTWF0aC5wb3coMiwgbUxlbilcbiAgICBlID0gZSAtIGVCaWFzXG4gIH1cbiAgcmV0dXJuIChzID8gLTEgOiAxKSAqIG0gKiBNYXRoLnBvdygyLCBlIC0gbUxlbilcbn1cblxuZXhwb3J0cy53cml0ZSA9IGZ1bmN0aW9uIChidWZmZXIsIHZhbHVlLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbSwgY1xuICB2YXIgZUxlbiA9IG5CeXRlcyAqIDggLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIHJ0ID0gKG1MZW4gPT09IDIzID8gTWF0aC5wb3coMiwgLTI0KSAtIE1hdGgucG93KDIsIC03NykgOiAwKVxuICB2YXIgaSA9IGlzTEUgPyAwIDogKG5CeXRlcyAtIDEpXG4gIHZhciBkID0gaXNMRSA/IDEgOiAtMVxuICB2YXIgcyA9IHZhbHVlIDwgMCB8fCAodmFsdWUgPT09IDAgJiYgMSAvIHZhbHVlIDwgMCkgPyAxIDogMFxuXG4gIHZhbHVlID0gTWF0aC5hYnModmFsdWUpXG5cbiAgaWYgKGlzTmFOKHZhbHVlKSB8fCB2YWx1ZSA9PT0gSW5maW5pdHkpIHtcbiAgICBtID0gaXNOYU4odmFsdWUpID8gMSA6IDBcbiAgICBlID0gZU1heFxuICB9IGVsc2Uge1xuICAgIGUgPSBNYXRoLmZsb29yKE1hdGgubG9nKHZhbHVlKSAvIE1hdGguTE4yKVxuICAgIGlmICh2YWx1ZSAqIChjID0gTWF0aC5wb3coMiwgLWUpKSA8IDEpIHtcbiAgICAgIGUtLVxuICAgICAgYyAqPSAyXG4gICAgfVxuICAgIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgdmFsdWUgKz0gcnQgLyBjXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlICs9IHJ0ICogTWF0aC5wb3coMiwgMSAtIGVCaWFzKVxuICAgIH1cbiAgICBpZiAodmFsdWUgKiBjID49IDIpIHtcbiAgICAgIGUrK1xuICAgICAgYyAvPSAyXG4gICAgfVxuXG4gICAgaWYgKGUgKyBlQmlhcyA+PSBlTWF4KSB7XG4gICAgICBtID0gMFxuICAgICAgZSA9IGVNYXhcbiAgICB9IGVsc2UgaWYgKGUgKyBlQmlhcyA+PSAxKSB7XG4gICAgICBtID0gKHZhbHVlICogYyAtIDEpICogTWF0aC5wb3coMiwgbUxlbilcbiAgICAgIGUgPSBlICsgZUJpYXNcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IHZhbHVlICogTWF0aC5wb3coMiwgZUJpYXMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pXG4gICAgICBlID0gMFxuICAgIH1cbiAgfVxuXG4gIGZvciAoOyBtTGVuID49IDg7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IG0gJiAweGZmLCBpICs9IGQsIG0gLz0gMjU2LCBtTGVuIC09IDgpIHt9XG5cbiAgZSA9IChlIDw8IG1MZW4pIHwgbVxuICBlTGVuICs9IG1MZW5cbiAgZm9yICg7IGVMZW4gPiAwOyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBlICYgMHhmZiwgaSArPSBkLCBlIC89IDI1NiwgZUxlbiAtPSA4KSB7fVxuXG4gIGJ1ZmZlcltvZmZzZXQgKyBpIC0gZF0gfD0gcyAqIDEyOFxufVxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcImZzb3Z6NlwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9pZWVlNzU0L2luZGV4LmpzXCIsXCIvLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2llZWU3NTRcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4ndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIF90b0NvbnN1bWFibGVBcnJheShhcnIpIHsgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgeyBmb3IgKHZhciBpID0gMCwgYXJyMiA9IEFycmF5KGFyci5sZW5ndGgpOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7IGFycjJbaV0gPSBhcnJbaV07IH0gcmV0dXJuIGFycjI7IH0gZWxzZSB7IHJldHVybiBBcnJheS5mcm9tKGFycik7IH0gfVxuXG52YXIgdGltZSA9IDc1MDtcbnZhciBzZWN0aW9uM0lkeCA9IDA7XG52YXIgc2VjdGlvbjRJZHggPSAwO1xuXG4vLyBsZXQgRm9vdGJhbGxGcmFtZXMsIFRlbm5pc0ZyYW1lcywgQmFzZWJhbGxGcmFtZXMsIEJhc2tldGJhbGxGcmFtZXMsIEZhbkZyYW1lcywgSWRsZUZyYW1lO1xudmFyIHRlbm5pc0FuaW1hdGlvbiA9IHZvaWQgMCxcbiAgICBmb290YmFsbEFuaW1hdGlvbiA9IHZvaWQgMCxcbiAgICBiYXNrZXRiYWxsQW5pbWF0aW9uID0gdm9pZCAwLFxuICAgIGJhc2ViYWxsQW5pbWF0aW9uID0gdm9pZCAwLFxuICAgIGZhbkFuaW1hdGlvbiA9IHZvaWQgMDtcblxudmFyIG1hc3Rlck9iaiA9IHtcblx0c2VjdGlvbjJDdXJyZW50SWR4OiAwLFxuXHRzZWN0aW9uMUN1cnJlbnRJZHg6IDAsXG5cdGJhc2tldGJhbGw6IHsgbG9vcEFtb3VudDogMSwgbG9vcElkOiBiYXNrZXRiYWxsQW5pbWF0aW9uIH0sXG5cdGZvb3RiYWxsOiB7IGxvb3BBbW91bnQ6IDEsIGxvb3BJZDogZm9vdGJhbGxBbmltYXRpb24gfSxcblx0dGVubmlzOiB7IGxvb3BBbW91bnQ6IDEsIGxvb3BJZDogdGVubmlzQW5pbWF0aW9uIH0sXG5cdGJhc2ViYWxsOiB7IGxvb3BBbW91bnQ6IDEsIGxvb3BJZDogYmFzZWJhbGxBbmltYXRpb24gfSxcblx0ZmFuOiB7IGxvb3BBbW91bnQ6IDEsIGxvb3BJZDogZmFuQW5pbWF0aW9uIH1cbn07XG52YXIgaG9tZXBhZ2VNb2JJbWFnZXMgPSBbJ2Fzc2V0cy9pbWFnZXMvaG9tZXBhZ2VNb2IvYmFza2V0YmFsbC5qcGcnLCAnYXNzZXRzL2ltYWdlcy9ob21lcGFnZU1vYi9mb290YmFsbC5qcGcnLCAnYXNzZXRzL2ltYWdlcy9ob21lcGFnZU1vYi90ZW5uaXMuanBnJywgJ2Fzc2V0cy9pbWFnZXMvaG9tZXBhZ2VNb2IvYmFzZWJhbGwuanBnJywgJ2Fzc2V0cy9pbWFnZXMvaG9tZXBhZ2VNb2IvZmFuLmpwZyddO1xuXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG5cdC8vIFdBSVQgRk9SIGdmeUNhdEVtYmVkIFZJREVPIFRPIFNUQVJUIFBMQVlJTkcgT04gTU9CSUxFLCBUSEVOIEhJREUgVEhFIExPQURJTkcgQU5JTUFUSU9OLiBcXFxcXG5cblx0aWYgKHdpbmRvdy5pbm5lcldpZHRoIDwgODAwKSB7XG5cblx0XHRmZXRjaCgnYXNzZXRzL2pzL0ZhbnRhc3RlY19TcHJpdGVfU2hlZXQuanNvbicpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG5cdFx0XHRyZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuXHRcdH0pLnRoZW4oZnVuY3Rpb24gKHNwcml0ZU9iaikge1xuXHRcdFx0dmFyIElkbGVGcmFtZSA9IGZpbHRlckJ5VmFsdWUoc3ByaXRlT2JqLmZyYW1lcywgJ2lkbGUnKTtcblx0XHRcdG1hc3Rlck9iai5mb290YmFsbC5hbmltYXRpb25BcnJheSA9IFtdLmNvbmNhdChfdG9Db25zdW1hYmxlQXJyYXkoSWRsZUZyYW1lKSwgX3RvQ29uc3VtYWJsZUFycmF5KGZpbHRlckJ5VmFsdWUoc3ByaXRlT2JqLmZyYW1lcywgJ2Zvb3RiYWxsJykpKTtcblx0XHRcdG1hc3Rlck9iai50ZW5uaXMuYW5pbWF0aW9uQXJyYXkgPSBbXS5jb25jYXQoX3RvQ29uc3VtYWJsZUFycmF5KElkbGVGcmFtZSksIF90b0NvbnN1bWFibGVBcnJheShmaWx0ZXJCeVZhbHVlKHNwcml0ZU9iai5mcmFtZXMsICd0ZW5uaXMnKSkpO1xuXHRcdFx0bWFzdGVyT2JqLmJhc2ViYWxsLmFuaW1hdGlvbkFycmF5ID0gW10uY29uY2F0KF90b0NvbnN1bWFibGVBcnJheShJZGxlRnJhbWUpLCBfdG9Db25zdW1hYmxlQXJyYXkoZmlsdGVyQnlWYWx1ZShzcHJpdGVPYmouZnJhbWVzLCAnYmFzZWJhbGwnKSkpO1xuXHRcdFx0bWFzdGVyT2JqLmJhc2tldGJhbGwuYW5pbWF0aW9uQXJyYXkgPSBbXS5jb25jYXQoX3RvQ29uc3VtYWJsZUFycmF5KElkbGVGcmFtZSksIF90b0NvbnN1bWFibGVBcnJheShmaWx0ZXJCeVZhbHVlKHNwcml0ZU9iai5mcmFtZXMsICdiYXNrZXQnKSkpO1xuXHRcdFx0bWFzdGVyT2JqLmZhbi5hbmltYXRpb25BcnJheSA9IFtdLmNvbmNhdChfdG9Db25zdW1hYmxlQXJyYXkoSWRsZUZyYW1lKSwgX3RvQ29uc3VtYWJsZUFycmF5KGZpbHRlckJ5VmFsdWUoc3ByaXRlT2JqLmZyYW1lcywgJ2ZhbicpKSk7XG5cblx0XHRcdGFuaW1hdG9yU2V0dXAoKTtcblx0XHRcdGltYWdlQ29udHJvbGVyKG1hc3Rlck9iaiwgMSk7XG5cblx0XHRcdHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0aW1hZ2VDb250cm9sZXIobWFzdGVyT2JqLCAxKTtcblx0XHRcdH0sIDUwMDApO1xuXHRcdH0pO1xuXHR9XG5cblx0dmFyIGZpbHRlckJ5VmFsdWUgPSBmdW5jdGlvbiBmaWx0ZXJCeVZhbHVlKGFycmF5LCBzdHJpbmcpIHtcblx0XHRyZXR1cm4gYXJyYXkuZmlsdGVyKGZ1bmN0aW9uIChvKSB7XG5cdFx0XHRyZXR1cm4gdHlwZW9mIG9bJ2ZpbGVuYW1lJ10gPT09ICdzdHJpbmcnICYmIG9bJ2ZpbGVuYW1lJ10udG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhzdHJpbmcudG9Mb3dlckNhc2UoKSk7XG5cdFx0fSk7XG5cdH07XG5cblx0dmFyIGFuaW1hdG9yU2V0dXAgPSBmdW5jdGlvbiBhbmltYXRvclNldHVwKCkge1xuXG5cdFx0dmFyIGxhc3RUaW1lID0gMDtcblx0XHR2YXIgdmVuZG9ycyA9IFsnbXMnLCAnbW96JywgJ3dlYmtpdCcsICdvJ107XG5cdFx0Zm9yICh2YXIgeCA9IDA7IHggPCB2ZW5kb3JzLmxlbmd0aCAmJiAhd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZTsgKyt4KSB7XG5cdFx0XHR3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gd2luZG93W3ZlbmRvcnNbeF0gKyAnUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ107XG5cdFx0XHR3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSB3aW5kb3dbdmVuZG9yc1t4XSArICdDYW5jZWxBbmltYXRpb25GcmFtZSddIHx8IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ0NhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZSddO1xuXHRcdH1cblxuXHRcdGlmICghd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSkgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uIChjYWxsYmFjaywgZWxlbWVudCkge1xuXHRcdFx0dmFyIGN1cnJUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cdFx0XHR2YXIgdGltZVRvQ2FsbCA9IE1hdGgubWF4KDAsIDE2IC0gKGN1cnJUaW1lIC0gbGFzdFRpbWUpKTtcblx0XHRcdHZhciBpZCA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0Y2FsbGJhY2soY3VyclRpbWUgKyB0aW1lVG9DYWxsKTtcblx0XHRcdH0sIHRpbWVUb0NhbGwpO1xuXHRcdFx0bGFzdFRpbWUgPSBjdXJyVGltZSArIHRpbWVUb0NhbGw7XG5cdFx0XHRyZXR1cm4gaWQ7XG5cdFx0fTtcblxuXHRcdGlmICghd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKSB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbiAoaWQpIHtcblx0XHRcdGNsZWFyVGltZW91dChpZCk7XG5cdFx0fTtcblx0fTtcblxuXHR2YXIgYW5pbWF0b3IgPSBmdW5jdGlvbiBhbmltYXRvcihhbmltYXRpb25PYmopIHtcblxuXHRcdHZhciBkYW5jaW5nSWNvbiwgc3ByaXRlSW1hZ2UsIGNhbnZhcztcblxuXHRcdGZ1bmN0aW9uIGdhbWVMb29wKCkge1xuXHRcdFx0JCgnI2xvYWRpbmcnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG5cdFx0XHRhbmltYXRpb25PYmoubG9vcElkID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShnYW1lTG9vcCk7XG5cdFx0XHRkYW5jaW5nSWNvbi51cGRhdGUoKTtcblx0XHRcdGRhbmNpbmdJY29uLnJlbmRlcigpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHNwcml0ZShvcHRpb25zKSB7XG5cblx0XHRcdHZhciB0aGF0ID0ge30sXG5cdFx0XHQgICAgZnJhbWVJbmRleCA9IDAsXG5cdFx0XHQgICAgdGlja0NvdW50ID0gMCxcblx0XHRcdCAgICBsb29wQ291bnQgPSAwLFxuXHRcdFx0ICAgIHRpY2tzUGVyRnJhbWUgPSBvcHRpb25zLnRpY2tzUGVyRnJhbWUgfHwgMCxcblx0XHRcdCAgICBudW1iZXJPZkZyYW1lcyA9IG9wdGlvbnMubnVtYmVyT2ZGcmFtZXMgfHwgMTtcblxuXHRcdFx0dGhhdC5jb250ZXh0ID0gb3B0aW9ucy5jb250ZXh0O1xuXHRcdFx0dGhhdC53aWR0aCA9IG9wdGlvbnMud2lkdGg7XG5cdFx0XHR0aGF0LmhlaWdodCA9IG9wdGlvbnMuaGVpZ2h0O1xuXHRcdFx0dGhhdC5pbWFnZSA9IG9wdGlvbnMuaW1hZ2U7XG5cdFx0XHR0aGF0Lmxvb3BzID0gb3B0aW9ucy5sb29wcztcblxuXHRcdFx0dGhhdC51cGRhdGUgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRcdFx0dGlja0NvdW50ICs9IDE7XG5cblx0XHRcdFx0aWYgKHRpY2tDb3VudCA+IHRpY2tzUGVyRnJhbWUpIHtcblxuXHRcdFx0XHRcdHRpY2tDb3VudCA9IDA7XG5cdFx0XHRcdFx0Ly8gSWYgdGhlIGN1cnJlbnQgZnJhbWUgaW5kZXggaXMgaW4gcmFuZ2Vcblx0XHRcdFx0XHRpZiAoZnJhbWVJbmRleCA8IG51bWJlck9mRnJhbWVzIC0gMSkge1xuXHRcdFx0XHRcdFx0Ly8gR28gdG8gdGhlIG5leHQgZnJhbWVcblx0XHRcdFx0XHRcdGZyYW1lSW5kZXggKz0gMTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0bG9vcENvdW50Kys7XG5cdFx0XHRcdFx0XHRmcmFtZUluZGV4ID0gMDtcblxuXHRcdFx0XHRcdFx0aWYgKGxvb3BDb3VudCA9PT0gdGhhdC5sb29wcykge1xuXHRcdFx0XHRcdFx0XHR3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUoYW5pbWF0aW9uT2JqLmxvb3BJZCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHR0aGF0LnJlbmRlciA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0XHQvLyBDbGVhciB0aGUgY2FudmFzXG5cdFx0XHRcdHRoYXQuY29udGV4dC5jbGVhclJlY3QoMCwgMCwgdGhhdC53aWR0aCwgdGhhdC5oZWlnaHQpO1xuXG5cdFx0XHRcdHRoYXQuY29udGV4dC5kcmF3SW1hZ2UodGhhdC5pbWFnZSwgYW5pbWF0aW9uT2JqLmFuaW1hdGlvbkFycmF5W2ZyYW1lSW5kZXhdLmZyYW1lLngsIGFuaW1hdGlvbk9iai5hbmltYXRpb25BcnJheVtmcmFtZUluZGV4XS5mcmFtZS55LCAyMDAsIDE3NSwgMCwgMCwgd2luZG93LmlubmVyV2lkdGggLyAzLjg0Niwgd2luZG93LmlubmVyV2lkdGggLyA0LjEpO1xuXHRcdFx0fTtcblxuXHRcdFx0cmV0dXJuIHRoYXQ7XG5cdFx0fVxuXG5cdFx0Ly8gR2V0IGNhbnZhc1xuXHRcdGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMnKTtcblx0XHRjYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aCAvIDMuODQ2O1xuXHRcdGNhbnZhcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJXaWR0aCAvIDIuMjtcblxuXHRcdC8vIENyZWF0ZSBzcHJpdGUgc2hlZXRcblx0XHRzcHJpdGVJbWFnZSA9IG5ldyBJbWFnZSgpO1xuXG5cdFx0Ly8gQ3JlYXRlIHNwcml0ZVxuXHRcdGRhbmNpbmdJY29uID0gc3ByaXRlKHtcblx0XHRcdGNvbnRleHQ6IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIiksXG5cdFx0XHR3aWR0aDogNDA0MCxcblx0XHRcdGhlaWdodDogMTc3MCxcblx0XHRcdGltYWdlOiBzcHJpdGVJbWFnZSxcblx0XHRcdG51bWJlck9mRnJhbWVzOiBhbmltYXRpb25PYmouYW5pbWF0aW9uQXJyYXkubGVuZ3RoLFxuXHRcdFx0dGlja3NQZXJGcmFtZTogNCxcblx0XHRcdGxvb3BzOiBhbmltYXRpb25PYmoubG9vcEFtb3VudFxuXHRcdH0pO1xuXG5cdFx0Ly8gTG9hZCBzcHJpdGUgc2hlZXRcblx0XHRzcHJpdGVJbWFnZS5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBnYW1lTG9vcCk7XG5cdFx0c3ByaXRlSW1hZ2Uuc3JjID0gJ2Fzc2V0cy9pbWFnZXMvRmFudGFzdGVjX1Nwcml0ZV9TaGVldC5wbmcnO1xuXHR9O1xuXG5cdC8vIElOSVRJQUxJU0UgQU5EIFNFVFVQIENVUlJFTlQgUEFHRS4gRVhFQ1VURSBUUkFOU0lUSU9OUyBBTkQgUkVNT1ZFIFRJTlQgSUYgUkVMRVZBTlQgXFxcXFxuXG5cdHZhciBwYWdlTG9hZGVyID0gZnVuY3Rpb24gcGFnZUxvYWRlcihpbmRleCkge1xuXHRcdGlmIChpbmRleCA9PT0gNSkge1xuXHRcdFx0JCgnLnRpbnQnKS5yZW1vdmVDbGFzcygncmVtb3ZlVGludCcpO1xuXHRcdFx0JCgnLmJhY2tncm91bmRXcmFwcGVyJykucmVtb3ZlQ2xhc3MoJ3NjYWxlQmFja2dyb3VuZCcpO1xuXHRcdFx0JCgnI3NlY3Rpb241JykuZmluZCgnLmhlYWRpbmcnKS5hZGRDbGFzcygnc2hvdyBmYWRlSW4nKTtcblx0XHRcdCQoJy5zdWJTZWN0aW9uJykuYWRkQ2xhc3MoJ3NjYWxlQmFja2dyb3VuZCcpO1xuXHRcdFx0JCgnLnN1YlNlY3Rpb24nKS5maW5kKCcudGludCcpLmFkZENsYXNzKCdyZW1vdmVUaW50Jyk7XG5cdFx0XHQkKCcjc2VjdGlvbjUnKS5maW5kKCcudGV4dFdyYXBwZXInKS5hZGRDbGFzcygnc2hvdycpO1xuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdCQoJy5zdWJTZWN0aW9uID4gLnRleHRXcmFwcGVyJykuZmluZCgnLmhlYWRpbmcnKS5hZGRDbGFzcygnZmFkZUluJyk7XG5cdFx0XHR9LCAxMDAwKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JCgnLnRpbnQnKS5yZW1vdmVDbGFzcygncmVtb3ZlVGludCcpO1xuXHRcdFx0JCgnLnN1YlNlY3Rpb24nKS5yZW1vdmVDbGFzcygnc2NhbGVCYWNrZ3JvdW5kJyk7XG5cdFx0XHQkKCcuYmFja2dyb3VuZFdyYXBwZXI6bm90KCNzZWN0aW9uJyArIGluZGV4ICsgJ0JhY2tncm91bmQpJykucmVtb3ZlQ2xhc3MoJ3NjYWxlQmFja2dyb3VuZCcpO1xuXHRcdFx0JCgnLnNlY3Rpb24uYWN0aXZlJykuZmluZCgnLmJhY2tncm91bmRXcmFwcGVyJykuYWRkQ2xhc3MoJ3NjYWxlQmFja2dyb3VuZCcpO1xuXHRcdFx0JCgnc2VjdGlvbi5hY3RpdmUnKS5maW5kKCcudGludCcpLmFkZENsYXNzKCdyZW1vdmVUaW50Jyk7XG5cblx0XHRcdGlmICgkKCcuc2VjdGlvbicgKyBpbmRleCArICdQYWdpbmF0b3JCdXR0b24nKS5sZW5ndGggJiYgJCgnLnNlY3Rpb24nICsgaW5kZXggKyAnUGFnaW5hdG9yQnV0dG9uLmFjdGl2ZScpLmxlbmd0aCA8IDEpIHtcblx0XHRcdFx0JCgnLnNlY3Rpb24nICsgaW5kZXggKyAnUGFnaW5hdG9yQnV0dG9uJykuZ2V0KDApLmNsaWNrKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdC8vIEhJREUgQUxMIEJFQ0tHUk9VTkRTIElOIFRIRSBTRUNUSU9OIEVYQ0VQVCBUSEUgU1BFQ0lGSUVEIElOREVYLCBXSElDSCBJUyBTQ0FMRUQgQU5EIFNIT1dOLiBcXFxcXG5cblx0dmFyIGluaXRpYWxpemVTZWN0aW9uID0gZnVuY3Rpb24gaW5pdGlhbGl6ZVNlY3Rpb24oc2VjdGlvbk51bWJlciwgaWR4KSB7XG5cdFx0JCgnI3NlY3Rpb24nICsgc2VjdGlvbk51bWJlciArICdCYWNrZ3JvdW5kJyArIGlkeCkuc2libGluZ3MoJy5iYWNrZ3JvdW5kV3JhcHBlcicpLm1hcChmdW5jdGlvbiAoaXgsIGVsZSkge1xuXHRcdFx0JChlbGUpLmNzcyh7IG9wYWNpdHk6IDAgfSk7XG5cdFx0fSk7XG5cblx0XHQkKCcjc2VjdGlvbicgKyBzZWN0aW9uTnVtYmVyICsgJ0JhY2tncm91bmQnICsgaWR4KS5jc3Moe1xuXHRcdFx0J3RyYW5zZm9ybSc6ICdzY2FsZSgxLjEpJyxcblx0XHRcdCdvcGFjaXR5JzogMVxuXHRcdH0pO1xuXHR9O1xuXG5cdC8vIElOSVRJQVRFIGluaXRpYWxpemVTZWN0aW9uIE9OIFNFQ1RJT05TIDMgQU5EIDQuIFxcXFxcblx0aW5pdGlhbGl6ZVNlY3Rpb24oMSwgMCk7XG5cdGluaXRpYWxpemVTZWN0aW9uKDMsIDApO1xuXHRpbml0aWFsaXplU2VjdGlvbig0LCAwKTtcblxuXHQvLyBTRUNUSU9OUyAyIChBQk9VVCBVUyBTRUNUSU9OKSBCQUNLR1JPVU5EIElNQUdFIFRSQU5TSVRJT04gSEFORExFUi4gXFxcXFxuXG5cdHZhciBpbWFnZUNvbnRyb2xlciA9IGZ1bmN0aW9uIGltYWdlQ29udHJvbGVyKGlkeE9iaiwgc2VjdGlvbk51bWJlcikge1xuXHRcdHZhciByZWxldmFudEFuaW1hdGlvbiA9IHZvaWQgMDtcblxuXHRcdGlmIChzZWN0aW9uTnVtYmVyID09PSAxKSB7XG5cdFx0XHRzd2l0Y2ggKGlkeE9iai5zZWN0aW9uMUN1cnJlbnRJZHgpIHtcblx0XHRcdFx0Y2FzZSAwOlxuXHRcdFx0XHRcdHJlbGV2YW50QW5pbWF0aW9uID0gbWFzdGVyT2JqLmJhc2tldGJhbGw7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgMTpcblx0XHRcdFx0XHRyZWxldmFudEFuaW1hdGlvbiA9IG1hc3Rlck9iai5mb290YmFsbDtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRcdHJlbGV2YW50QW5pbWF0aW9uID0gbWFzdGVyT2JqLnRlbm5pcztcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAzOlxuXHRcdFx0XHRcdHJlbGV2YW50QW5pbWF0aW9uID0gbWFzdGVyT2JqLmJhc2ViYWxsO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIDQ6XG5cdFx0XHRcdFx0cmVsZXZhbnRBbmltYXRpb24gPSBtYXN0ZXJPYmouZmFuO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdCQoJyNzZWN0aW9uJyArIHNlY3Rpb25OdW1iZXIpLmZpbmQoJy50aW50JykucmVtb3ZlQ2xhc3MoJ3JlbW92ZVRpbnQnKTtcblx0XHQkKCcjc2VjdGlvbicgKyBzZWN0aW9uTnVtYmVyICsgJ0JhY2tncm91bmQnICsgaWR4T2JqWydzZWN0aW9uJyArIHNlY3Rpb25OdW1iZXIgKyAnQ3VycmVudElkeCddKS5yZW1vdmVDbGFzcygnc2NhbGVCYWNrZ3JvdW5kJyk7XG5cdFx0aW5pdGlhbGl6ZVNlY3Rpb24oc2VjdGlvbk51bWJlciwgaWR4T2JqWydzZWN0aW9uJyArIHNlY3Rpb25OdW1iZXIgKyAnQ3VycmVudElkeCddKTtcblxuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0aWYgKHNlY3Rpb25OdW1iZXIgPT09IDEpIHtcblx0XHRcdFx0YW5pbWF0b3IocmVsZXZhbnRBbmltYXRpb24pO1xuXHRcdFx0fVxuXG5cdFx0XHQkKCcjc2VjdGlvbicgKyBzZWN0aW9uTnVtYmVyKS5maW5kKCcuYmFja2dyb3VuZFdyYXBwZXInKS5hZGRDbGFzcygnc2NhbGVCYWNrZ3JvdW5kJyk7XG5cdFx0XHQkKCcjc2VjdGlvbicgKyBzZWN0aW9uTnVtYmVyKS5maW5kKCcudGludCcpLmFkZENsYXNzKCdyZW1vdmVUaW50Jyk7XG5cdFx0fSwgNTAwKTtcblxuXHRcdGlmIChpZHhPYmpbJ3NlY3Rpb24nICsgc2VjdGlvbk51bWJlciArICdDdXJyZW50SWR4J10gPT09ICQoJyNzZWN0aW9uJyArIHNlY3Rpb25OdW1iZXIpLmZpbmQoJy5iYWNrZ3JvdW5kV3JhcHBlcicpLmxlbmd0aCAtIDEpIHtcblx0XHRcdGlkeE9ialsnc2VjdGlvbicgKyBzZWN0aW9uTnVtYmVyICsgJ0N1cnJlbnRJZHgnXSA9IDA7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlkeE9ialsnc2VjdGlvbicgKyBzZWN0aW9uTnVtYmVyICsgJ0N1cnJlbnRJZHgnXSArPSAxO1xuXHRcdH1cblx0fTtcblxuXHRpbWFnZUNvbnRyb2xlcihtYXN0ZXJPYmosIDIpO1xuXG5cdHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcblx0XHRpbWFnZUNvbnRyb2xlcihtYXN0ZXJPYmosIDIpO1xuXHR9LCAxNTAwMCk7XG5cblx0Ly8gUEFHSU5BVElPTiBCVVRUT05TIENMSUNLIEhBTkRMRVIgRk9SIFNFQ1RJT05TIDMgQU5EIDQuIFxcXFxcblxuXHR2YXIgaGFuZGxlUGFuaW5hdGlvbkJ1dHRvbkNsaWNrID0gZnVuY3Rpb24gaGFuZGxlUGFuaW5hdGlvbkJ1dHRvbkNsaWNrKGUpIHtcblxuXHRcdHZhciBpZHggPSBwYXJzZUludCgkKGUudGFyZ2V0KS5hdHRyKCdkYXRhLWluZGV4JykpO1xuXHRcdHZhciBzZWN0aW9uSWQgPSAkKGUudGFyZ2V0KS5jbG9zZXN0KCdzZWN0aW9uJykuYXR0cignaWQnKTtcblx0XHR2YXIgcmVsZXZhbnREYXRhQXJyYXkgPSB2b2lkIDA7XG5cblx0XHRpZiAoc2VjdGlvbklkID09PSAnc2VjdGlvbjMnKSB7XG5cdFx0XHRzZWN0aW9uM0lkeCA9IGlkeDtcblx0XHR9XG5cblx0XHRpZiAoc2VjdGlvbklkID09PSAnc2VjdGlvbjQnKSB7XG5cdFx0XHRzZWN0aW9uNElkeCA9IGlkeDtcblx0XHR9XG5cblx0XHQkKCcjJyArIHNlY3Rpb25JZCkuZmluZCgnLnRpbnQnKS5yZW1vdmVDbGFzcygncmVtb3ZlVGludCcpO1xuXHRcdCQoJyMnICsgc2VjdGlvbklkKS5maW5kKCcudGV4dFdyYXBwZXInKS5yZW1vdmVDbGFzcygnc2hvdycpO1xuXHRcdCQoJyMnICsgc2VjdGlvbklkKS5maW5kKCcjdGV4dFdyYXBwZXInICsgaWR4KS5hZGRDbGFzcygnc2hvdycpO1xuXHRcdCQoJyMnICsgc2VjdGlvbklkICsgJ0JhY2tncm91bmQnICsgaWR4KS5yZW1vdmVDbGFzcygnc2NhbGVCYWNrZ3JvdW5kJyk7XG5cdFx0JCgnLicgKyBzZWN0aW9uSWQgKyAnUGFnaW5hdG9yQnV0dG9uJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdCQoZS50YXJnZXQpLmFkZENsYXNzKCdhY3RpdmUnKTtcblxuXHRcdGluaXRpYWxpemVTZWN0aW9uKHBhcnNlSW50KCQoJyMnICsgc2VjdGlvbklkKS5hdHRyKCdkYXRhLWluZGV4JykpLCBpZHgpO1xuXG5cdFx0c2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRwYWdlTG9hZGVyKHBhcnNlSW50KCQoJyMnICsgc2VjdGlvbklkKS5hdHRyKCdkYXRhLWluZGV4JykpKTtcblx0XHR9LCA1MDApO1xuXG5cdFx0aWYgKHNlY3Rpb25JZCAhPT0gJ3NlY3Rpb24yJykge1xuXHRcdFx0JCgnIycgKyBzZWN0aW9uSWQpLmZpbmQoJy5oZWFkaW5nLCBwJykuYWRkQ2xhc3MoJ2ZhZGVJbicpO1xuXHRcdFx0JCgnIycgKyBzZWN0aW9uSWQpLm9uKCd0cmFuc2l0aW9uZW5kIHdlYmtpdFRyYW5zaXRpb25FbmQgb1RyYW5zaXRpb25FbmQnLCBmdW5jdGlvbiAoZXMpIHtcblx0XHRcdFx0JCgnIycgKyBzZWN0aW9uSWQpLmZpbmQoJy5oZWFkaW5nLCBwJykucmVtb3ZlQ2xhc3MoJ2ZhZGVJbicpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIENMSUNLIExJU1RFTkVSIEZPUiBQQUdJTkFUSU9OIEJVVFRPTlMgT04gU0VDVElPTlMgMyBBTkQgNC4gXFxcXFxuXG5cdCQoJy5zZWN0aW9uM1BhZ2luYXRvckJ1dHRvbiwgLnNlY3Rpb240UGFnaW5hdG9yQnV0dG9uJykuY2xpY2soZnVuY3Rpb24gKGUpIHtcblx0XHRoYW5kbGVQYW5pbmF0aW9uQnV0dG9uQ2xpY2soZSk7XG5cdH0pO1xuXG5cdC8vIElOSVRJQUxJWkUgT05FUEFHRVNDUk9MTCBJRiBOT1QgSU4gQ01TIFBSRVZJRVcuIFxcXFxcblxuXHRpZiAoISQobG9jYXRpb24pLmF0dHIoJ2hyZWYnKS5pbmNsdWRlcygnaW5kZXgucGhwJykpIHtcblx0XHQkKCcjc2Nyb2xsZXJXcmFwcGVyJykub25lcGFnZV9zY3JvbGwoe1xuXHRcdFx0c2VjdGlvbkNvbnRhaW5lcjogXCJzZWN0aW9uXCIsXG5cdFx0XHRlYXNpbmc6IFwiZWFzZS1vdXRcIixcblx0XHRcdGFuaW1hdGlvblRpbWU6IHRpbWUsXG5cdFx0XHRwYWdpbmF0aW9uOiB0cnVlLFxuXHRcdFx0dXBkYXRlVVJMOiB0cnVlLFxuXHRcdFx0YmVmb3JlTW92ZTogZnVuY3Rpb24gYmVmb3JlTW92ZShpbmRleCkge30sXG5cdFx0XHRhZnRlck1vdmU6IGZ1bmN0aW9uIGFmdGVyTW92ZShpbmRleCkge1xuXHRcdFx0XHQvLyBJTklUSUFMSVpFIFRIRSBDVVJSRU5UIFBBR0UuIFxcXFxcblxuXHRcdFx0XHRwYWdlTG9hZGVyKGluZGV4KTtcblx0XHRcdH0sXG5cdFx0XHRsb29wOiBmYWxzZSxcblx0XHRcdGtleWJvYXJkOiB0cnVlLFxuXHRcdFx0cmVzcG9uc2l2ZUZhbGxiYWNrOiBmYWxzZSxcblx0XHRcdGRpcmVjdGlvbjogXCJ2ZXJ0aWNhbFwiXG5cdFx0fSk7XG5cblx0XHQkKCcjc2Nyb2xsZXJXcmFwcGVyJykubW92ZVRvKDEpO1xuXHR9XG5cblx0Ly8gQ09OVFJPTCBDTElDS1MgT04gV09SSyBXSVRIIFVTIFNFQ1RJT04gKFNFQ1RJT041KS4gXFxcXFxuXG5cdCQoJy5jbGlja2FibGUnKS5jbGljayhmdW5jdGlvbiAoZSkge1xuXHRcdHZhciBjdXJyZW50U2VjdGlvbiA9ICQoZS50YXJnZXQpLmNsb3Nlc3QoJCgnLnN1YlNlY3Rpb24nKSk7XG5cblx0XHRpZiAoY3VycmVudFNlY3Rpb24uaGFzQ2xhc3MoJ29wZW4nKSkge1xuXHRcdFx0Y3VycmVudFNlY3Rpb24ucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcblx0XHRcdGN1cnJlbnRTZWN0aW9uLmZpbmQoJy5idXR0b24sIHAnKS5yZW1vdmVDbGFzcygnZmFkZUluJyk7XG5cdFx0XHRjdXJyZW50U2VjdGlvbi5zaWJsaW5ncygnLnN1YlNlY3Rpb24nKS5tYXAoZnVuY3Rpb24gKGlkeCwgc2VjdGlvbikge1xuXHRcdFx0XHQkKHNlY3Rpb24pLnJlbW92ZUNsYXNzKCdjbG9zZWQnKTtcblx0XHRcdFx0JChzZWN0aW9uKS5maW5kKCcudGludCcpLnJlbW92ZUNsYXNzKCdhZGRUaW50JykuYWRkQ2xhc3MoJ3JlbW92ZVRpbnQnKTtcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjdXJyZW50U2VjdGlvbi5yZW1vdmVDbGFzcygnY2xvc2VkJykuYWRkQ2xhc3MoJ29wZW4nKTtcblx0XHRcdGN1cnJlbnRTZWN0aW9uLm9uKCd0cmFuc2l0aW9uZW5kIHdlYmtpdFRyYW5zaXRpb25FbmQgb1RyYW5zaXRpb25FbmQnLCBmdW5jdGlvbiAoZXMpIHtcblx0XHRcdFx0JCgnLnN1YlNlY3Rpb24ub3BlbicpLmZpbmQoJy5idXR0b24sIHAnKS5hZGRDbGFzcygnZmFkZUluJyk7XG5cdFx0XHR9KTtcblx0XHRcdGN1cnJlbnRTZWN0aW9uLnNpYmxpbmdzKCcuc3ViU2VjdGlvbicpLm1hcChmdW5jdGlvbiAoaWR4LCBzZWN0aW9uKSB7XG5cdFx0XHRcdCQoc2VjdGlvbikucmVtb3ZlQ2xhc3MoJ29wZW4nKS5hZGRDbGFzcygnY2xvc2VkJyk7XG5cdFx0XHRcdCQoc2VjdGlvbikuZmluZCgnLnRpbnQnKS5yZW1vdmVDbGFzcygncmVtb3ZlVGludCcpLmFkZENsYXNzKCdhZGRUaW50Jyk7XG5cdFx0XHRcdCQoc2VjdGlvbikuZmluZCgnLmJ1dHRvbiwgcCcpLnJlbW92ZUNsYXNzKCdmYWRlSW4nKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRjdXJyZW50U2VjdGlvbi5maW5kKCcudGludCcpLnJlbW92ZUNsYXNzKCdhZGRUaW50JykuYWRkQ2xhc3MoJ3JlbW92ZVRpbnQnKTtcblx0fSk7XG5cblx0Ly8gQ09OVFJPTCBGT09URVIgQVJST1cgQ0xJQ0tTLiBcXFxcXG5cblx0JCgnI2Rvd25BcnJvdycpLmNsaWNrKGZ1bmN0aW9uICgpIHtcblx0XHRpZiAoJCh3aW5kb3cpLmhlaWdodCgpICogKCQoJy5wYWdlJykubGVuZ3RoIC0gMSkgPT09IC0kKCcjc2Nyb2xsZXJXcmFwcGVyJykub2Zmc2V0KCkudG9wKSB7XG5cdFx0XHQkKCcjc2Nyb2xsZXJXcmFwcGVyJykubW92ZVRvKDEpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkKCcjc2Nyb2xsZXJXcmFwcGVyJykubW92ZURvd24oKTtcblx0XHR9XG5cdH0pO1xuXG5cdC8vIEhJREUgVEhFIExPQURJTkcgQU5JTUFUSU9QTiBXSEVOIFZJREVPIElTIFJFQURZIFRPIFBMQVkgT04gREVYS1RPUC4gXFxcXFxuXG5cdHZhciBoaWRlTG9hZGluZ0FuaW1hdGlvbiA9IGZ1bmN0aW9uIGhpZGVMb2FkaW5nQW5pbWF0aW9uKCkge1xuXHRcdGlmICh3aW5kb3cuaW5uZXJXaWR0aCA+IDgwMCAmJiAhJCgnI2xvYWRpbmcnKS5oYXNDbGFzcygnaGlkZGVuJykpIHtcblxuXHRcdFx0aWYgKCQoJyN2aWRlbycpLmdldCgwKS5yZWFkeVN0YXRlID09PSA0KSB7XG5cdFx0XHRcdCQoJyNsb2FkaW5nJykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHR2YXIgc2VjdGlvbjNBdXRvbWF0ZWQgPSB2b2lkIDAsXG5cdCAgICBhdXRvbWF0ZVNlY3Rpb24zID0gdm9pZCAwLFxuXHQgICAgc2VjdGlvbjRBdXRvbWF0ZWQgPSB2b2lkIDAsXG5cdCAgICBhdXRvbWF0ZVNlY3Rpb240ID0gdm9pZCAwO1xuXHQvLyBNQU5BR0VNRU5UIEZVTkNUSU9OIEZPUiBTRVRUSU5HIEFORCBDTEVBUklORyBUSEUgU0xJREUgQVVUT01BVElPTiBJTlRFUlZBTFMuIFxcXFxcblxuXHR2YXIgaW50ZXJ2YWxNYW5hZ2VyID0gZnVuY3Rpb24gaW50ZXJ2YWxNYW5hZ2VyKGZsYWcsIHNlY3Rpb25JZCwgdGltZSkge1xuXHRcdGlmIChmbGFnKSB7XG5cdFx0XHRpZiAoc2VjdGlvbklkID09PSAnc2VjdGlvbjMnKSB7XG5cdFx0XHRcdGF1dG9tYXRlU2VjdGlvbjMgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0c3dpcGVDb250cm9sbGVyKHNlY3Rpb25JZCwgJ2wnKTtcblx0XHRcdFx0fSwgdGltZSk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoc2VjdGlvbklkID09PSAnc2VjdGlvbjQnKSB7XG5cdFx0XHRcdGF1dG9tYXRlU2VjdGlvbjQgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0c3dpcGVDb250cm9sbGVyKHNlY3Rpb25JZCwgJ2wnKTtcblx0XHRcdFx0fSwgdGltZSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmIChzZWN0aW9uSWQgPT09ICdzZWN0aW9uMycpIHtcblx0XHRcdFx0Y2xlYXJJbnRlcnZhbChhdXRvbWF0ZVNlY3Rpb24zKTtcblx0XHRcdH1cblx0XHRcdGlmIChzZWN0aW9uSWQgPT09ICdzZWN0aW9uNCcpIHtcblx0XHRcdFx0Y2xlYXJJbnRlcnZhbChhdXRvbWF0ZVNlY3Rpb240KTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0Ly8gSUYgTk9UIElOIENNUyBBRE1JTiBQUkVWSUVXLCBQRVJQRVRVQUxMWSBDSEVDSyBJRiBXRSBBUkUgQVQgVEhFIFRPUCBPRiBUSEUgUEFHRSBBTkQgSUYgU08sIERPTlQgU0hPVyBUSEUgRk9PVEVSIE9SIEdSRUVOIFNIQVBFLiBcXFxcXG5cblx0aWYgKCEkKGxvY2F0aW9uKS5hdHRyKCdocmVmJykuaW5jbHVkZXMoJ2luZGV4LnBocCcpKSB7XG5cdFx0c2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuXHRcdFx0aWYgKCQoJyNzY3JvbGxlcldyYXBwZXInKS5vZmZzZXQoKS50b3AgPj0gMCkge1xuXHRcdFx0XHQkKCcjaGVhZGVyU2hhcGUsICNmb290ZXInKS5hZGRDbGFzcygnbW92ZU9mZlNjcmVlbicpO1xuXHRcdFx0XHQkKCcjdmlkZW8nKS5nZXQoMCkucGxheSgpO1xuXHRcdFx0XHQkKCcuYXJyb3cnKS5hZGRDbGFzcygncHVsc2F0ZScpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dmFyIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHQkKCcjaGVhZGVyU2hhcGUsICNmb290ZXInKS5yZW1vdmVDbGFzcygnbW92ZU9mZlNjcmVlbicpO1xuXHRcdFx0XHRcdCQoJyN2aWRlbycpLmdldCgwKS5wYXVzZSgpO1xuXHRcdFx0XHRcdCQoJy5hcnJvdycpLnJlbW92ZUNsYXNzKCdwdWxzYXRlJyk7XG5cdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuXHRcdFx0XHR9LCB0aW1lKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gUk9UQVRFIFRIRSBBUlJPVyBJTiBUSEUgRk9PVEVSIFdIRU4gQVQgVEhFIEJPVFRPTSBPRiBUSEUgUEFHRSBcXFxcXG5cblx0XHRcdGlmICgkKCcjc2Nyb2xsZXJXcmFwcGVyJykub2Zmc2V0KCkudG9wIDwgLSh3aW5kb3cuaW5uZXJIZWlnaHQgKiA0KSkge1xuXHRcdFx0XHQkKCcjZG93bkFycm93JykuY3NzKHsgJ3RyYW5zZm9ybSc6ICdyb3RhdGUoMTgwZGVnKSB0cmFuc2xhdGVYKC01MCUpJyB9KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCQoJyNkb3duQXJyb3cnKS5jc3MoeyAndHJhbnNmb3JtJzogJ3RyYW5zbGF0ZVgoLTUwJSkgcm90YXRlKDBkZWcpJyB9KTtcblx0XHRcdH1cblxuXHRcdFx0aGlkZUxvYWRpbmdBbmltYXRpb24oKTtcblxuXHRcdFx0Ly8gQUREIExBTkRTQ0FQRSBTVFlMRVMgVE8gUkVMRVZBTlQgRUxFTUVOVFMgXFxcXFxuXG5cdFx0XHRpZiAod2luZG93Lm1hdGNoTWVkaWEoXCIob3JpZW50YXRpb246IGxhbmRzY2FwZSlcIikubWF0Y2hlcyAmJiB3aW5kb3cuaW5uZXJXaWR0aCA8IDgwMCkge1xuXHRcdFx0XHQkKCcubmF2X2xpbmssICNoZWFkZXJTaGFwZSwgI2Zvb3RlciwgLmN1c3RvbSwgLm1hcmtlciwgI3NlY3Rpb241LCAudGV4dFdyYXBwZXInKS5hZGRDbGFzcygnbGFuZHNjYXBlJyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkKCcubmF2X2xpbmssICNoZWFkZXJTaGFwZSwgI2Zvb3RlciwgLmN1c3RvbSwgLm1hcmtlciwgI3NlY3Rpb241LCAudGV4dFdyYXBwZXInKS5yZW1vdmVDbGFzcygnbGFuZHNjYXBlJyk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICgkKCcjc2VjdGlvbjMuYWN0aXZlJykubGVuZ3RoKSB7XG5cdFx0XHRcdC8vIEFVVE9NQVRFIFRIRSBTTElERVMgT04gU0VDVElPUE4gMyBFVkVSWSA3IFNFQ09ORFMgSUYgVEhFIFNFQ1RJT04gSVMgQUNUSVZFLiBcXFxcXG5cdFx0XHRcdGlmIChzZWN0aW9uM0F1dG9tYXRlZCAhPT0gdHJ1ZSkge1xuXHRcdFx0XHRcdHNlY3Rpb24zQXV0b21hdGVkID0gdHJ1ZTtcblx0XHRcdFx0XHRpbnRlcnZhbE1hbmFnZXIodHJ1ZSwgJ3NlY3Rpb24zJywgNzAwMCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIFNUT1AgQVVUT01BVEVEIFNMSURFUyBPTiBTRUNUSU9QTiAzIElGIFRIRSBTRUNUSU9OIElTIE5PVCBBQ1RJVkUuIFxcXFxcblx0XHRcdFx0aWYgKHNlY3Rpb24zQXV0b21hdGVkID09PSB0cnVlKSB7XG5cdFx0XHRcdFx0aW50ZXJ2YWxNYW5hZ2VyKGZhbHNlLCAnc2VjdGlvbjMnKTtcblx0XHRcdFx0XHRzZWN0aW9uM0F1dG9tYXRlZCA9IGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmICgkKCcjc2VjdGlvbjQuYWN0aXZlJykubGVuZ3RoKSB7XG5cdFx0XHRcdC8vIEFVVE9NQVRFIFRIRSBTTElERVMgT04gU0VDVElPUE4gNCBFVkVSWSA3IFNFQ09ORFMgSUYgVEhFIFNFQ1RJT04gSVMgQUNUSVZFLiBcXFxcXG5cdFx0XHRcdGlmIChzZWN0aW9uNEF1dG9tYXRlZCAhPT0gdHJ1ZSkge1xuXHRcdFx0XHRcdHNlY3Rpb240QXV0b21hdGVkID0gdHJ1ZTtcblx0XHRcdFx0XHRpbnRlcnZhbE1hbmFnZXIodHJ1ZSwgJ3NlY3Rpb240JywgNzAwMCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIFNUT1AgQVVUT01BVEVEIFNMSURFUyBPTiBTRUNUSU9QTiA0IElGIFRIRSBTRUNUSU9OIElTIE5PVCBBQ1RJVkUuIFxcXFxcblx0XHRcdFx0aWYgKHNlY3Rpb240QXV0b21hdGVkID09PSB0cnVlKSB7XG5cdFx0XHRcdFx0aW50ZXJ2YWxNYW5hZ2VyKGZhbHNlLCAnc2VjdGlvbjQnKTtcblx0XHRcdFx0XHRzZWN0aW9uNEF1dG9tYXRlZCA9IGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSwgNTAwKTtcblx0fVxuXG5cdC8vIENPTlRST0wgV0hBVCBIQVBQRU5TIFdIRU4gTElOS1MgSU4gVEhFIE5BVi9NRU5VIEFSRSBDTElDS0VEIFxcXFxcblxuXHQkKCcubmF2X2xpbmsnKS5jbGljayhmdW5jdGlvbiAoZSkge1xuXHRcdHZhciBwYWdlSWR4ID0gcGFyc2VJbnQoJChlLnRhcmdldCkuYXR0cignZGF0YS1pbmRleCcpKTtcblx0XHQkKCcjc2Nyb2xsZXJXcmFwcGVyJykubW92ZVRvKHBhZ2VJZHgpO1xuXHRcdCQoJyNtZW51QmxvY2tPdXQnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG5cblx0XHRpZiAoYnVyZ2VyLmNsYXNzTGlzdC5jb250YWlucygnYnVyZ2VyLS1hY3RpdmUnKSkge1xuXHRcdFx0bmF2LmNsYXNzTGlzdC5yZW1vdmUoJ25hdl9vcGVuJyk7XG5cdFx0XHRidXJnZXIuY2xhc3NMaXN0LnJlbW92ZSgnYnVyZ2VyLS1hY3RpdmUnKTtcblx0XHRcdGRvY3VtZW50LmJvZHkuc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnO1xuXHRcdH1cblx0fSk7XG5cblx0Ly8gV0hFTiBUSEUgTkFWIElTIE9QRU4gUFJFVkVOVCBVU0VSIEZST00gQkVJTkcgQUJMRSBUTyBDTElDSyBBTllUSElORyBFTFNFIFxcXFxcblxuXHQkKCcjbWVudUJsb2NrT3V0JykuY2xpY2soZnVuY3Rpb24gKGUpIHtcblx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHR9KTtcblxuXHR2YXIgYnVyZ2VyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW4tYnVyZ2VyJyksXG5cdCAgICBuYXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbk5hdicpO1xuXG5cdC8vIENPTlRST0wgRk9SIE9QRU4gQU5EIENMT1NJTkcgVEhFIE1FTlUvTkFWICBcXFxcXG5cblx0ZnVuY3Rpb24gbmF2Q29udHJvbCgpIHtcblxuXHRcdGlmIChidXJnZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdidXJnZXItLWFjdGl2ZScpKSB7XG5cdFx0XHRuYXYuY2xhc3NMaXN0LnJlbW92ZSgnbmF2X29wZW4nKTtcblx0XHRcdGJ1cmdlci5jbGFzc0xpc3QucmVtb3ZlKCdidXJnZXItLWFjdGl2ZScpO1xuXHRcdFx0JCgnI21lbnVCbG9ja091dCcpLmFkZENsYXNzKCdoaWRkZW4nKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0YnVyZ2VyLmNsYXNzTGlzdC5hZGQoJ2J1cmdlci0tYWN0aXZlJyk7XG5cdFx0XHRuYXYuY2xhc3NMaXN0LmFkZCgnbmF2X29wZW4nKTtcblx0XHRcdCQoJyNtZW51QmxvY2tPdXQnKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gT05MWSBMSVNURU4gRk9SIE1FTlUgQ0xJQ0tTIFdIRU4gTk9UIElOIENNUyBQUkVWSUVXIE1PREUgXFxcXFxuXG5cdGlmICghJChsb2NhdGlvbikuYXR0cignaHJlZicpLmluY2x1ZGVzKCdpbmRleC5waHAnKSkge1xuXHRcdGJ1cmdlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG5hdkNvbnRyb2wpO1xuXHR9XG5cblx0Ly8gQ0xPU0UgVEhFIE5BViBJRiBUSEUgV0lORE9XIElTIE9WRVIgMTAwMFBYIFdJREUgXFxcXFxuXG5cdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBmdW5jdGlvbiAoKSB7XG5cdFx0aWYgKHdpbmRvdy5pbm5lcldpZHRoID4gMTAwMCAmJiBuYXYuY2xhc3NMaXN0LmNvbnRhaW5zKCduYXZfb3BlbicpKSB7XG5cdFx0XHRuYXZDb250cm9sKCk7XG5cdFx0XHRuYXYuY2xhc3NMaXN0LnJlbW92ZSgnbmF2X29wZW4nKTtcblx0XHRcdCQoJyNtZW51QmxvY2tPdXQnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG5cdFx0fVxuXHR9KTtcblxuXHQvLyBUSElTIFNFVCBPRiBJRiBTVEFURU1FTlRTIElOSVRJQUxJU0VTIFRIRSBTUEVTSUZJQyBQQUdFUyBGT1IgUFJFVklFV0lORyBJTiBDTVMgQURNSU4uIFxcXFxcblxuXHRpZiAoJChsb2NhdGlvbikuYXR0cignaHJlZicpLmluY2x1ZGVzKCdpbmRleC5waHAnKSkge1xuXHRcdGlmICgkKGxvY2F0aW9uKS5hdHRyKCdocmVmJykuaW5jbHVkZXMoJ2ltYWdpbmUtaWYnKSkge1xuXHRcdFx0cGFnZUxvYWRlcig0KTtcblx0XHR9XG5cdFx0aWYgKCQobG9jYXRpb24pLmF0dHIoJ2hyZWYnKS5pbmNsdWRlcygnaG93LXdlLWlubm92YXRlJykpIHtcblx0XHRcdHBhZ2VMb2FkZXIoMyk7XG5cdFx0fVxuXHRcdGlmICgkKGxvY2F0aW9uKS5hdHRyKCdocmVmJykuaW5jbHVkZXMoJ3dvcmstd2l0aC11cycpKSB7XG5cdFx0XHRwYWdlTG9hZGVyKDUpO1xuXHRcdH1cblx0XHRpZiAoJChsb2NhdGlvbikuYXR0cignaHJlZicpLmluY2x1ZGVzKCdjb250YWN0LXVzJykpIHtcblx0XHRcdHBhZ2VMb2FkZXIoNik7XG5cdFx0fVxuXHRcdGlmICgkKGxvY2F0aW9uKS5hdHRyKCdocmVmJykuaW5jbHVkZXMoJ2hvbWUtdmlkZW8nKSkge1xuXHRcdFx0c2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRoaWRlTG9hZGluZ0FuaW1hdGlvbigpO1xuXHRcdFx0fSwgNTAwKTtcblx0XHR9XG5cdH1cblxuXHQvLyBTV0lQRSBFVkVOVFMgREVURUNUT1IgRlVOQ1RJT04gXFxcXFxuXG5cdGZ1bmN0aW9uIGRldGVjdHN3aXBlKGVsLCBmdW5jKSB7XG5cdFx0dmFyIHN3aXBlX2RldCA9IHt9O1xuXHRcdHN3aXBlX2RldC5zWCA9IDA7c3dpcGVfZGV0LnNZID0gMDtzd2lwZV9kZXQuZVggPSAwO3N3aXBlX2RldC5lWSA9IDA7XG5cdFx0dmFyIG1pbl94ID0gMzA7IC8vbWluIHggc3dpcGUgZm9yIGhvcml6b250YWwgc3dpcGVcblx0XHR2YXIgbWF4X3ggPSAzMDsgLy9tYXggeCBkaWZmZXJlbmNlIGZvciB2ZXJ0aWNhbCBzd2lwZVxuXHRcdHZhciBtaW5feSA9IDUwOyAvL21pbiB5IHN3aXBlIGZvciB2ZXJ0aWNhbCBzd2lwZVxuXHRcdHZhciBtYXhfeSA9IDYwOyAvL21heCB5IGRpZmZlcmVuY2UgZm9yIGhvcml6b250YWwgc3dpcGVcblx0XHR2YXIgZGlyZWMgPSBcIlwiO1xuXHRcdHZhciBlbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbCk7XG5cdFx0ZWxlLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0dmFyIHQgPSBlLnRvdWNoZXNbMF07XG5cdFx0XHRzd2lwZV9kZXQuc1ggPSB0LnNjcmVlblg7XG5cdFx0XHRzd2lwZV9kZXQuc1kgPSB0LnNjcmVlblk7XG5cdFx0fSwgZmFsc2UpO1xuXHRcdGVsZS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0dmFyIHQgPSBlLnRvdWNoZXNbMF07XG5cdFx0XHRzd2lwZV9kZXQuZVggPSB0LnNjcmVlblg7XG5cdFx0XHRzd2lwZV9kZXQuZVkgPSB0LnNjcmVlblk7XG5cdFx0fSwgZmFsc2UpO1xuXHRcdGVsZS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHQvL2hvcml6b250YWwgZGV0ZWN0aW9uXG5cdFx0XHRpZiAoKHN3aXBlX2RldC5lWCAtIG1pbl94ID4gc3dpcGVfZGV0LnNYIHx8IHN3aXBlX2RldC5lWCArIG1pbl94IDwgc3dpcGVfZGV0LnNYKSAmJiBzd2lwZV9kZXQuZVkgPCBzd2lwZV9kZXQuc1kgKyBtYXhfeSAmJiBzd2lwZV9kZXQuc1kgPiBzd2lwZV9kZXQuZVkgLSBtYXhfeSAmJiBzd2lwZV9kZXQuZVggPiAwKSB7XG5cdFx0XHRcdGlmIChzd2lwZV9kZXQuZVggPiBzd2lwZV9kZXQuc1gpIGRpcmVjID0gXCJyXCI7ZWxzZSBkaXJlYyA9IFwibFwiO1xuXHRcdFx0fVxuXHRcdFx0Ly92ZXJ0aWNhbCBkZXRlY3Rpb25cblx0XHRcdGVsc2UgaWYgKChzd2lwZV9kZXQuZVkgLSBtaW5feSA+IHN3aXBlX2RldC5zWSB8fCBzd2lwZV9kZXQuZVkgKyBtaW5feSA8IHN3aXBlX2RldC5zWSkgJiYgc3dpcGVfZGV0LmVYIDwgc3dpcGVfZGV0LnNYICsgbWF4X3ggJiYgc3dpcGVfZGV0LnNYID4gc3dpcGVfZGV0LmVYIC0gbWF4X3ggJiYgc3dpcGVfZGV0LmVZID4gMCkge1xuXHRcdFx0XHRcdGlmIChzd2lwZV9kZXQuZVkgPiBzd2lwZV9kZXQuc1kpIGRpcmVjID0gXCJkXCI7ZWxzZSBkaXJlYyA9IFwidVwiO1xuXHRcdFx0XHR9XG5cblx0XHRcdGlmIChkaXJlYyAhPSBcIlwiKSB7XG5cdFx0XHRcdGlmICh0eXBlb2YgZnVuYyA9PSAnZnVuY3Rpb24nKSBmdW5jKGVsLCBkaXJlYyk7XG5cdFx0XHR9XG5cdFx0XHR2YXIgZGlyZWMgPSBcIlwiO1xuXHRcdFx0c3dpcGVfZGV0LnNYID0gMDtzd2lwZV9kZXQuc1kgPSAwO3N3aXBlX2RldC5lWCA9IDA7c3dpcGVfZGV0LmVZID0gMDtcblx0XHR9LCBmYWxzZSk7XG5cdH1cblxuXHQvLyBDSE9TRSBUSEUgTkVYVCBTTElERSBUTyBTSE9XIEFORCBDTElDSyBUSEUgUEFHSU5BVElPTiBCVVRUT04gVEhBVCBSRUxBVEVTIFRPIElULiBcXFxcXG5cblx0dmFyIHN3aXBlQ29udHJvbGxlciA9IGZ1bmN0aW9uIHN3aXBlQ29udHJvbGxlcihlbCwgZCkge1xuXG5cdFx0aWYgKGVsID09PSAnc2VjdGlvbjQnKSB7XG5cblx0XHRcdHZhciBzZWN0aW9uNFBhZ2luYXRpb25MZW5ndGggPSAkKCcuc2VjdGlvbjRQYWdpbmF0b3JCdXR0b24nKS5sZW5ndGg7XG5cblx0XHRcdGlmIChkID09PSAnbCcpIHtcblxuXHRcdFx0XHRpZiAoc2VjdGlvbjRJZHggPCBzZWN0aW9uNFBhZ2luYXRpb25MZW5ndGggLSAxKSB7XG5cdFx0XHRcdFx0c2VjdGlvbjRJZHgrKztcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRzZWN0aW9uNElkeCA9IDA7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQkKCcuc2VjdGlvbjRQYWdpbmF0b3JCdXR0b24nKVtzZWN0aW9uNElkeF0uY2xpY2soKTtcblx0XHRcdH1cblx0XHRcdGlmIChkID09PSAncicpIHtcblxuXHRcdFx0XHRpZiAoc2VjdGlvbjRJZHggPiAwKSB7XG5cdFx0XHRcdFx0c2VjdGlvbjRJZHgtLTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRzZWN0aW9uNElkeCA9IHNlY3Rpb240UGFnaW5hdGlvbkxlbmd0aCAtIDE7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQkKCcuc2VjdGlvbjRQYWdpbmF0b3JCdXR0b24nKVtzZWN0aW9uNElkeF0uY2xpY2soKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKGVsID09PSAnc2VjdGlvbjMnKSB7XG5cblx0XHRcdHZhciBzZWN0aW9uM1BhZ2luYXRpb25MZW5ndGggPSAkKCcuc2VjdGlvbjNQYWdpbmF0b3JCdXR0b24nKS5sZW5ndGg7XG5cblx0XHRcdGlmIChkID09PSAnbCcpIHtcblxuXHRcdFx0XHRpZiAoc2VjdGlvbjNJZHggPCBzZWN0aW9uM1BhZ2luYXRpb25MZW5ndGggLSAxKSB7XG5cdFx0XHRcdFx0c2VjdGlvbjNJZHgrKztcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRzZWN0aW9uM0lkeCA9IDA7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQkKCcuc2VjdGlvbjNQYWdpbmF0b3JCdXR0b24nKVtzZWN0aW9uM0lkeF0uY2xpY2soKTtcblx0XHRcdH1cblx0XHRcdGlmIChkID09PSAncicpIHtcblxuXHRcdFx0XHRpZiAoc2VjdGlvbjNJZHggPiAwKSB7XG5cdFx0XHRcdFx0c2VjdGlvbjNJZHgtLTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRzZWN0aW9uM0lkeCA9IHNlY3Rpb24zUGFnaW5hdGlvbkxlbmd0aCAtIDE7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQkKCcuc2VjdGlvbjNQYWdpbmF0b3JCdXR0b24nKVtzZWN0aW9uM0lkeF0uY2xpY2soKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0Ly8gSU5JVElBVEUgRk9SIFNXSVBFIERFVEVDVElPTiBPTiBTRUNUSU9OUyAzIEFORCA0IEVYQ0VQVCBJTiBBRE1JTiBQUkVWSUVXLiBcXFxcXG5cblx0aWYgKCEkKGxvY2F0aW9uKS5hdHRyKCdocmVmJykuaW5jbHVkZXMoJ2luZGV4LnBocCcpKSB7XG5cdFx0ZGV0ZWN0c3dpcGUoJ3NlY3Rpb240Jywgc3dpcGVDb250cm9sbGVyKTtcblx0XHRkZXRlY3Rzd2lwZSgnc2VjdGlvbjMnLCBzd2lwZUNvbnRyb2xsZXIpO1xuXHR9XG59KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkltWmhhMlZmT0RNd01HWmtPVEV1YW5NaVhTd2libUZ0WlhNaU9sc2lkR2x0WlNJc0luTmxZM1JwYjI0elNXUjRJaXdpYzJWamRHbHZialJKWkhnaUxDSjBaVzV1YVhOQmJtbHRZWFJwYjI0aUxDSm1iMjkwWW1Gc2JFRnVhVzFoZEdsdmJpSXNJbUpoYzJ0bGRHSmhiR3hCYm1sdFlYUnBiMjRpTENKaVlYTmxZbUZzYkVGdWFXMWhkR2x2YmlJc0ltWmhia0Z1YVcxaGRHbHZiaUlzSW0xaGMzUmxjazlpYWlJc0luTmxZM1JwYjI0eVEzVnljbVZ1ZEVsa2VDSXNJbk5sWTNScGIyNHhRM1Z5Y21WdWRFbGtlQ0lzSW1KaGMydGxkR0poYkd3aUxDSnNiMjl3UVcxdmRXNTBJaXdpYkc5dmNFbGtJaXdpWm05dmRHSmhiR3dpTENKMFpXNXVhWE1pTENKaVlYTmxZbUZzYkNJc0ltWmhiaUlzSW1odmJXVndZV2RsVFc5aVNXMWhaMlZ6SWl3aUpDSXNJbVJ2WTNWdFpXNTBJaXdpY21WaFpIa2lMQ0ozYVc1a2IzY2lMQ0pwYm01bGNsZHBaSFJvSWl3aVptVjBZMmdpTENKMGFHVnVJaXdpY21WemNHOXVjMlVpTENKcWMyOXVJaXdpYzNCeWFYUmxUMkpxSWl3aVNXUnNaVVp5WVcxbElpd2labWxzZEdWeVFubFdZV3gxWlNJc0ltWnlZVzFsY3lJc0ltRnVhVzFoZEdsdmJrRnljbUY1SWl3aVlXNXBiV0YwYjNKVFpYUjFjQ0lzSW1sdFlXZGxRMjl1ZEhKdmJHVnlJaXdpYzJWMFNXNTBaWEoyWVd3aUxDSmhjbkpoZVNJc0luTjBjbWx1WnlJc0ltWnBiSFJsY2lJc0ltOGlMQ0owYjB4dmQyVnlRMkZ6WlNJc0ltbHVZMngxWkdWeklpd2liR0Z6ZEZScGJXVWlMQ0oyWlc1a2IzSnpJaXdpZUNJc0lteGxibWQwYUNJc0luSmxjWFZsYzNSQmJtbHRZWFJwYjI1R2NtRnRaU0lzSW1OaGJtTmxiRUZ1YVcxaGRHbHZia1p5WVcxbElpd2lZMkZzYkdKaFkyc2lMQ0psYkdWdFpXNTBJaXdpWTNWeWNsUnBiV1VpTENKRVlYUmxJaXdpWjJWMFZHbHRaU0lzSW5ScGJXVlViME5oYkd3aUxDSk5ZWFJvSWl3aWJXRjRJaXdpYVdRaUxDSnpaWFJVYVcxbGIzVjBJaXdpWTJ4bFlYSlVhVzFsYjNWMElpd2lZVzVwYldGMGIzSWlMQ0poYm1sdFlYUnBiMjVQWW1vaUxDSmtZVzVqYVc1blNXTnZiaUlzSW5Od2NtbDBaVWx0WVdkbElpd2lZMkZ1ZG1Geklpd2laMkZ0WlV4dmIzQWlMQ0poWkdSRGJHRnpjeUlzSW5Wd1pHRjBaU0lzSW5KbGJtUmxjaUlzSW5Od2NtbDBaU0lzSW05d2RHbHZibk1pTENKMGFHRjBJaXdpWm5KaGJXVkpibVJsZUNJc0luUnBZMnREYjNWdWRDSXNJbXh2YjNCRGIzVnVkQ0lzSW5ScFkydHpVR1Z5Um5KaGJXVWlMQ0p1ZFcxaVpYSlBaa1p5WVcxbGN5SXNJbU52Ym5SbGVIUWlMQ0ozYVdSMGFDSXNJbWhsYVdkb2RDSXNJbWx0WVdkbElpd2liRzl2Y0hNaUxDSmpiR1ZoY2xKbFkzUWlMQ0prY21GM1NXMWhaMlVpTENKbWNtRnRaU0lzSW5raUxDSm5aWFJGYkdWdFpXNTBRbmxKWkNJc0lrbHRZV2RsSWl3aVoyVjBRMjl1ZEdWNGRDSXNJbUZrWkVWMlpXNTBUR2x6ZEdWdVpYSWlMQ0p6Y21NaUxDSndZV2RsVEc5aFpHVnlJaXdpYVc1a1pYZ2lMQ0p5WlcxdmRtVkRiR0Z6Y3lJc0ltWnBibVFpTENKblpYUWlMQ0pqYkdsamF5SXNJbWx1YVhScFlXeHBlbVZUWldOMGFXOXVJaXdpYzJWamRHbHZiazUxYldKbGNpSXNJbWxrZUNJc0luTnBZbXhwYm1keklpd2liV0Z3SWl3aWFYZ2lMQ0psYkdVaUxDSmpjM01pTENKdmNHRmphWFI1SWl3aWFXUjRUMkpxSWl3aWNtVnNaWFpoYm5SQmJtbHRZWFJwYjI0aUxDSm9ZVzVrYkdWUVlXNXBibUYwYVc5dVFuVjBkRzl1UTJ4cFkyc2lMQ0psSWl3aWNHRnljMlZKYm5RaUxDSjBZWEpuWlhRaUxDSmhkSFJ5SWl3aWMyVmpkR2x2Ymtsa0lpd2lZMnh2YzJWemRDSXNJbkpsYkdWMllXNTBSR0YwWVVGeWNtRjVJaXdpYjI0aUxDSmxjeUlzSW14dlkyRjBhVzl1SWl3aWIyNWxjR0ZuWlY5elkzSnZiR3dpTENKelpXTjBhVzl1UTI5dWRHRnBibVZ5SWl3aVpXRnphVzVuSWl3aVlXNXBiV0YwYVc5dVZHbHRaU0lzSW5CaFoybHVZWFJwYjI0aUxDSjFjR1JoZEdWVlVrd2lMQ0ppWldadmNtVk5iM1psSWl3aVlXWjBaWEpOYjNabElpd2liRzl2Y0NJc0ltdGxlV0p2WVhKa0lpd2ljbVZ6Y0c5dWMybDJaVVpoYkd4aVlXTnJJaXdpWkdseVpXTjBhVzl1SWl3aWJXOTJaVlJ2SWl3aVkzVnljbVZ1ZEZObFkzUnBiMjRpTENKb1lYTkRiR0Z6Y3lJc0luTmxZM1JwYjI0aUxDSnZabVp6WlhRaUxDSjBiM0FpTENKdGIzWmxSRzkzYmlJc0ltaHBaR1ZNYjJGa2FXNW5RVzVwYldGMGFXOXVJaXdpY21WaFpIbFRkR0YwWlNJc0luTmxZM1JwYjI0elFYVjBiMjFoZEdWa0lpd2lZWFYwYjIxaGRHVlRaV04wYVc5dU15SXNJbk5sWTNScGIyNDBRWFYwYjIxaGRHVmtJaXdpWVhWMGIyMWhkR1ZUWldOMGFXOXVOQ0lzSW1sdWRHVnlkbUZzVFdGdVlXZGxjaUlzSW1ac1lXY2lMQ0p6ZDJsd1pVTnZiblJ5YjJ4c1pYSWlMQ0pqYkdWaGNrbHVkR1Z5ZG1Gc0lpd2ljR3hoZVNJc0luUnBiV1Z2ZFhRaUxDSndZWFZ6WlNJc0ltbHVibVZ5U0dWcFoyaDBJaXdpYldGMFkyaE5aV1JwWVNJc0ltMWhkR05vWlhNaUxDSndZV2RsU1dSNElpd2lZblZ5WjJWeUlpd2lZMnhoYzNOTWFYTjBJaXdpWTI5dWRHRnBibk1pTENKdVlYWWlMQ0p5WlcxdmRtVWlMQ0ppYjJSNUlpd2ljM1I1YkdVaUxDSndiM05wZEdsdmJpSXNJbk4wYjNCUWNtOXdZV2RoZEdsdmJpSXNJbTVoZGtOdmJuUnliMndpTENKaFpHUWlMQ0prWlhSbFkzUnpkMmx3WlNJc0ltVnNJaXdpWm5WdVl5SXNJbk4zYVhCbFgyUmxkQ0lzSW5OWUlpd2ljMWtpTENKbFdDSXNJbVZaSWl3aWJXbHVYM2dpTENKdFlYaGZlQ0lzSW0xcGJsOTVJaXdpYldGNFgza2lMQ0prYVhKbFl5SXNJblFpTENKMGIzVmphR1Z6SWl3aWMyTnlaV1Z1V0NJc0luTmpjbVZsYmxraUxDSndjbVYyWlc1MFJHVm1ZWFZzZENJc0ltUWlMQ0p6WldOMGFXOXVORkJoWjJsdVlYUnBiMjVNWlc1bmRHZ2lMQ0p6WldOMGFXOXVNMUJoWjJsdVlYUnBiMjVNWlc1bmRHZ2lYU3dpYldGd2NHbHVaM01pT2lJN096czdRVUZCUVN4SlFVRk5RU3hQUVVGUExFZEJRV0k3UVVGRFFTeEpRVUZKUXl4alFVRmpMRU5CUVd4Q08wRkJRMEVzU1VGQlNVTXNZMEZCWXl4RFFVRnNRanM3UVVGRlFUdEJRVU5CTEVsQlFVbERMSGRDUVVGS08wRkJRVUVzU1VGQmNVSkRMREJDUVVGeVFqdEJRVUZCTEVsQlFYZERReXcwUWtGQmVFTTdRVUZCUVN4SlFVRTJSRU1zTUVKQlFUZEVPMEZCUVVFc1NVRkJaMFpETEhGQ1FVRm9SanM3UVVGRlFTeEpRVUZOUXl4WlFVRlpPMEZCUTJwQ1F5eHhRa0ZCYjBJc1EwRkVTRHRCUVVWcVFrTXNjVUpCUVc5Q0xFTkJSa2c3UVVGSGFrSkRMR0ZCUVZrc1JVRkJRME1zV1VGQldTeERRVUZpTEVWQlFXZENReXhSUVVGUlVpeHRRa0ZCZUVJc1JVRklTenRCUVVscVFsTXNWMEZCVlN4RlFVRkRSaXhaUVVGWkxFTkJRV0lzUlVGQlowSkRMRkZCUVZGVUxHbENRVUY0UWl4RlFVcFBPMEZCUzJwQ1Z5eFRRVUZSTEVWQlFVTklMRmxCUVZrc1EwRkJZaXhGUVVGblFrTXNVVUZCVVZZc1pVRkJlRUlzUlVGTVV6dEJRVTFxUW1Fc1YwRkJWU3hGUVVGRFNpeFpRVUZaTEVOQlFXSXNSVUZCWjBKRExGRkJRVkZRTEdsQ1FVRjRRaXhGUVU1UE8wRkJUMnBDVnl4TlFVRkxMRVZCUVVOTUxGbEJRVmtzUTBGQllpeEZRVUZuUWtNc1VVRkJVVTRzV1VGQmVFSTdRVUZRV1N4RFFVRnNRanRCUVZOQkxFbEJRVTFYTEc5Q1FVRnZRaXhEUVVONlFpd3dRMEZFZVVJc1JVRkZla0lzZDBOQlJubENMRVZCUjNwQ0xITkRRVWg1UWl4RlFVbDZRaXgzUTBGS2VVSXNSVUZMZWtJc2JVTkJUSGxDTEVOQlFURkNPenRCUVZGQlF5eEZRVUZGUXl4UlFVRkdMRVZCUVZsRExFdEJRVm9zUTBGQmEwSXNXVUZCVFR0QlFVTjRRanM3UVVGRlF5eExRVUZIUXl4UFFVRlBReXhWUVVGUUxFZEJRVzlDTEVkQlFYWkNMRVZCUVRSQ096dEJRVVV6UWtNc1VVRkJUU3gxUTBGQlRpeEZRVUVyUTBNc1NVRkJMME1zUTBGQmIwUXNWVUZCVTBNc1VVRkJWQ3hGUVVGdFFqdEJRVU4wUlN4VlFVRlBRU3hUUVVGVFF5eEpRVUZVTEVWQlFWQTdRVUZEUVN4SFFVWkVMRVZCUlVkR0xFbEJSa2dzUTBGRlVTeFZRVUZUUnl4VFFVRlVMRVZCUVc5Q08wRkJRek5DTEU5QlFVMURMRmxCUVZsRExHTkJRV05HTEZWQlFWVkhMRTFCUVhoQ0xFVkJRV2RETEUxQlFXaERMRU5CUVd4Q08wRkJRMEYyUWl4aFFVRlZUU3hSUVVGV0xFTkJRVzFDYTBJc1kwRkJia0lzWjBOQlFYZERTQ3hUUVVGNFF5eHpRa0ZCYzBSRExHTkJRV05HTEZWQlFWVkhMRTFCUVhoQ0xFVkJRV2RETEZWQlFXaERMRU5CUVhSRU8wRkJRMEYyUWl4aFFVRlZUeXhOUVVGV0xFTkJRV2xDYVVJc1kwRkJha0lzWjBOQlFYTkRTQ3hUUVVGMFF5eHpRa0ZCYjBSRExHTkJRV05HTEZWQlFWVkhMRTFCUVhoQ0xFVkJRV2RETEZGQlFXaERMRU5CUVhCRU8wRkJRMEYyUWl4aFFVRlZVU3hSUVVGV0xFTkJRVzFDWjBJc1kwRkJia0lzWjBOQlFYZERTQ3hUUVVGNFF5eHpRa0ZCYzBSRExHTkJRV05HTEZWQlFWVkhMRTFCUVhoQ0xFVkJRV2RETEZWQlFXaERMRU5CUVhSRU8wRkJRMEYyUWl4aFFVRlZSeXhWUVVGV0xFTkJRWEZDY1VJc1kwRkJja0lzWjBOQlFUQkRTQ3hUUVVFeFF5eHpRa0ZCZDBSRExHTkJRV05HTEZWQlFWVkhMRTFCUVhoQ0xFVkJRV2RETEZGQlFXaERMRU5CUVhoRU8wRkJRMEYyUWl4aFFVRlZVeXhIUVVGV0xFTkJRV05sTEdOQlFXUXNaME5CUVcxRFNDeFRRVUZ1UXl4elFrRkJhVVJETEdOQlFXTkdMRlZCUVZWSExFMUJRWGhDTEVWQlFXZERMRXRCUVdoRExFTkJRV3BFT3p0QlFVVkJSVHRCUVVOQlF5eHJRa0ZCWlRGQ0xGTkJRV1lzUlVGQk1FSXNRMEZCTVVJN08wRkJSVUV5UWl4bFFVRlpMRmxCUVUwN1FVRkRha0pFTEcxQ1FVRmxNVUlzVTBGQlppeEZRVUV3UWl4RFFVRXhRanRCUVVOQkxFbEJSa1FzUlVGRlJ5eEpRVVpJTzBGQlIwRXNSMEZvUWtRN1FVRnBRa0U3TzBGQlJVUXNTMEZCVFhOQ0xHZENRVUZuUWl4VFFVRm9Ra0VzWVVGQlowSXNRMEZCUTAwc1MwRkJSQ3hGUVVGUlF5eE5RVUZTTEVWQlFXMUNPMEZCUTNSRExGTkJRVTlFTEUxQlFVMUZMRTFCUVU0c1EwRkJZVHRCUVVGQkxGVkJRVXNzVDBGQlQwTXNSVUZCUlN4VlFVRkdMRU5CUVZBc1MwRkJlVUlzVVVGQmVrSXNTVUZCY1VOQkxFVkJRVVVzVlVGQlJpeEZRVUZqUXl4WFFVRmtMRWRCUVRSQ1F5eFJRVUUxUWl4RFFVRnhRMG9zVDBGQlQwY3NWMEZCVUN4RlFVRnlReXhEUVVFeFF6dEJRVUZCTEVkQlFXSXNRMEZCVUR0QlFVTkdMRVZCUmtRN08wRkJTVUVzUzBGQlRWQXNaMEpCUVdkQ0xGTkJRV2hDUVN4aFFVRm5RaXhIUVVGTk96dEJRVVY2UWl4TlFVRkpVeXhYUVVGWExFTkJRV1k3UVVGRFFTeE5RVUZKUXl4VlFVRlZMRU5CUVVNc1NVRkJSQ3hGUVVGUExFdEJRVkFzUlVGQll5eFJRVUZrTEVWQlFYZENMRWRCUVhoQ0xFTkJRV1E3UVVGRFFTeFBRVUZKTEVsQlFVbERMRWxCUVVrc1EwRkJXaXhGUVVGbFFTeEpRVUZKUkN4UlFVRlJSU3hOUVVGYUxFbEJRWE5DTEVOQlFVTjJRaXhQUVVGUGQwSXNjVUpCUVRkRExFVkJRVzlGTEVWQlFVVkdMRU5CUVhSRkxFVkJRWGxGTzBGQlEzSkZkRUlzVlVGQlQzZENMSEZDUVVGUUxFZEJRU3RDZUVJc1QwRkJUM0ZDTEZGQlFWRkRMRU5CUVZJc1NVRkJWeXgxUWtGQmJFSXNRMEZCTDBJN1FVRkRRWFJDTEZWQlFVOTVRaXh2UWtGQlVDeEhRVUU0UW5wQ0xFOUJRVTl4UWl4UlFVRlJReXhEUVVGU0xFbEJRVmNzYzBKQlFXeENMRXRCUVRaRGRFSXNUMEZCVDNGQ0xGRkJRVkZETEVOQlFWSXNTVUZCVnl3MlFrRkJiRUlzUTBGQk0wVTdRVUZEU0RzN1FVRkZSQ3hOUVVGSkxFTkJRVU4wUWl4UFFVRlBkMElzY1VKQlFWb3NSVUZEU1hoQ0xFOUJRVTkzUWl4eFFrRkJVQ3hIUVVFclFpeFZRVUZUUlN4UlFVRlVMRVZCUVcxQ1F5eFBRVUZ1UWl4RlFVRTBRanRCUVVOMlJDeFBRVUZKUXl4WFFVRlhMRWxCUVVsRExFbEJRVW9zUjBGQlYwTXNUMEZCV0N4RlFVRm1PMEZCUTBFc1QwRkJTVU1zWVVGQllVTXNTMEZCUzBNc1IwRkJUQ3hEUVVGVExFTkJRVlFzUlVGQldTeE5RVUZOVEN4WFFVRlhVaXhSUVVGcVFpeERRVUZhTEVOQlFXcENPMEZCUTBFc1QwRkJTV01zUzBGQlMyeERMRTlCUVU5dFF5eFZRVUZRTEVOQlFXdENMRmxCUVZjN1FVRkJSVlFzWVVGQlUwVXNWMEZCVjBjc1ZVRkJjRUk3UVVGQmEwTXNTVUZCYWtVc1JVRkRVRUVzVlVGRVR5eERRVUZVTzBGQlJVRllMR05CUVZkUkxGZEJRVmRITEZWQlFYUkNPMEZCUTBFc1ZVRkJUMGNzUlVGQlVEdEJRVU5JTEVkQlVFUTdPMEZCVTBvc1RVRkJTU3hEUVVGRGJFTXNUMEZCVDNsQ0xHOUNRVUZhTEVWQlEwbDZRaXhQUVVGUGVVSXNiMEpCUVZBc1IwRkJPRUlzVlVGQlUxTXNSVUZCVkN4RlFVRmhPMEZCUTNaRFJTeG5Ra0ZCWVVZc1JVRkJZanRCUVVOSUxFZEJSa1E3UVVGSFRpeEZRWFpDUkRzN1FVRjVRa0VzUzBGQlRVY3NWMEZCVnl4VFFVRllRU3hSUVVGWExFTkJRVU5ETEZsQlFVUXNSVUZCYTBJN08wRkJSV3hETEUxQlFVbERMRmRCUVVvc1JVRkRRME1zVjBGRVJDeEZRVVZEUXl4TlFVWkVPenRCUVVsQkxGZEJRVk5ETEZGQlFWUXNSMEZCY1VJN1FVRkRjRUkzUXl4TFFVRkZMRlZCUVVZc1JVRkJZemhETEZGQlFXUXNRMEZCZFVJc1VVRkJka0k3UVVGRFEwd3NaMEpCUVdFdlF5eE5RVUZpTEVkQlFYTkNVeXhQUVVGUGQwSXNjVUpCUVZBc1EwRkJOa0pyUWl4UlFVRTNRaXhEUVVGMFFqdEJRVU5CU0N4bFFVRlpTeXhOUVVGYU8wRkJRMEZNTEdWQlFWbE5MRTFCUVZvN1FVRkRSRHM3UVVGRlJDeFhRVUZUUXl4TlFVRlVMRU5CUVdsQ1F5eFBRVUZxUWl4RlFVRXdRanM3UVVGRmVrSXNUMEZCU1VNc1QwRkJUeXhGUVVGWU8wRkJRVUVzVDBGRFEwTXNZVUZCWVN4RFFVUmtPMEZCUVVFc1QwRkZRME1zV1VGQldTeERRVVppTzBGQlFVRXNUMEZIUTBNc1dVRkJXU3hEUVVoaU8wRkJRVUVzVDBGSlEwTXNaMEpCUVdkQ1RDeFJRVUZSU3l4aFFVRlNMRWxCUVhsQ0xFTkJTakZETzBGQlFVRXNUMEZMUTBNc2FVSkJRV2xDVGl4UlFVRlJUU3hqUVVGU0xFbEJRVEJDTEVOQlREVkRPenRCUVU5QlRDeFJRVUZMVFN4UFFVRk1MRWRCUVdWUUxGRkJRVkZQTEU5QlFYWkNPMEZCUTBGT0xGRkJRVXRQTEV0QlFVd3NSMEZCWVZJc1VVRkJVVkVzUzBGQmNrSTdRVUZEUVZBc1VVRkJTMUVzVFVGQlRDeEhRVUZqVkN4UlFVRlJVeXhOUVVGMFFqdEJRVU5CVWl4UlFVRkxVeXhMUVVGTUxFZEJRV0ZXTEZGQlFWRlZMRXRCUVhKQ08wRkJRMEZVTEZGQlFVdFZMRXRCUVV3c1IwRkJZVmdzVVVGQlVWY3NTMEZCY2tJN08wRkJSVUZXTEZGQlFVdEtMRTFCUVV3c1IwRkJZeXhaUVVGWk96dEJRVVZ5UWswc2FVSkJRV0VzUTBGQllqczdRVUZGUVN4UlFVRkpRU3haUVVGWlJTeGhRVUZvUWl4RlFVRXJRanM3UVVGRmJFTkdMR2xDUVVGWkxFTkJRVm83UVVGRFN6dEJRVU5CTEZOQlFVbEVMR0ZCUVdGSkxHbENRVUZwUWl4RFFVRnNReXhGUVVGeFF6dEJRVU55UXp0QlFVTkZTaXh2UWtGQll5eERRVUZrTzBGQlEwUXNUVUZJUkN4TlFVZFBPMEZCUTFCRk8wRkJRMFZHTEcxQ1FVRmhMRU5CUVdJN08wRkJSVUVzVlVGQlIwVXNZMEZCWTBnc1MwRkJTMVVzUzBGQmRFSXNSVUZCTmtJN1FVRkROVUl4UkN4alFVRlBlVUlzYjBKQlFWQXNRMEZCTkVKaExHRkJRV0V2UXl4TlFVRjZRenRCUVVOQk8wRkJRMFk3UVVGRFNEdEJRVU5HTEVsQmNFSklPenRCUVhOQ1FYbEVMRkZCUVV0SUxFMUJRVXdzUjBGQll5eFpRVUZaT3p0QlFVVjRRanRCUVVOQlJ5eFRRVUZMVFN4UFFVRk1MRU5CUVdGTExGTkJRV0lzUTBGQmRVSXNRMEZCZGtJc1JVRkJNRUlzUTBGQk1VSXNSVUZCTmtKWUxFdEJRVXRQTEV0QlFXeERMRVZCUVhsRFVDeExRVUZMVVN4TlFVRTVRenM3UVVGRlFWSXNVMEZCUzAwc1QwRkJUQ3hEUVVGaFRTeFRRVUZpTEVOQlEwVmFMRXRCUVV0VExFdEJSRkFzUlVGRlJXNUNMR0ZCUVdFMVFpeGpRVUZpTEVOQlFUUkNkVU1zVlVGQk5VSXNSVUZCZDBOWkxFdEJRWGhETEVOQlFUaERka01zUTBGR2FFUXNSVUZIUldkQ0xHRkJRV0UxUWl4alFVRmlMRU5CUVRSQ2RVTXNWVUZCTlVJc1JVRkJkME5aTEV0QlFYaERMRU5CUVRoRFF5eERRVWhvUkN4RlFVbEZMRWRCU2tZc1JVRkxSU3hIUVV4R0xFVkJUVVVzUTBGT1JpeEZRVTlGTEVOQlVFWXNSVUZSUlRsRUxFOUJRVTlETEZWQlFWQXNSMEZCYjBJc1MwRlNkRUlzUlVGVFJVUXNUMEZCVDBNc1ZVRkJVQ3hIUVVGdlFpeEhRVlIwUWp0QlFWVkVMRWxCWmtRN08wRkJhVUpCTEZWQlFVOHJReXhKUVVGUU8wRkJRMEU3TzBGQlJVUTdRVUZEUVZBc1YwRkJVek5ETEZOQlFWTnBSU3hqUVVGVUxFTkJRWGRDTEZGQlFYaENMRU5CUVZRN1FVRkRRWFJDTEZOQlFVOWpMRXRCUVZBc1IwRkJaWFpFTEU5QlFVOURMRlZCUVZBc1IwRkJiMElzUzBGQmJrTTdRVUZEUVhkRExGTkJRVTlsTEUxQlFWQXNSMEZCWjBKNFJDeFBRVUZQUXl4VlFVRlFMRWRCUVc5Q0xFZEJRWEJET3p0QlFVVkJPMEZCUTBGMVF5eG5Ra0ZCWXl4SlFVRkpkMElzUzBGQlNpeEZRVUZrT3p0QlFVVkJPMEZCUTBGNlFpeG5Ra0ZCWTA4c1QwRkJUenRCUVVOd1FsRXNXVUZCVTJJc1QwRkJUM2RDTEZWQlFWQXNRMEZCYTBJc1NVRkJiRUlzUTBGRVZ6dEJRVVZ3UWxZc1ZVRkJUeXhKUVVaaE8wRkJSM0JDUXl4WFFVRlJMRWxCU0ZrN1FVRkpjRUpETEZWQlFVOXFRaXhYUVVwaE8wRkJTM0JDWVN4dFFrRkJaMEptTEdGQlFXRTFRaXhqUVVGaUxFTkJRVFJDWVN4TlFVeDRRanRCUVUxd1FqWkNMR3RDUVVGbExFTkJUa3M3UVVGUGNFSk5MRlZCUVU5d1FpeGhRVUZoYUVRN1FVRlFRU3hIUVVGUUxFTkJRV1E3TzBGQlZVRTdRVUZEUVd0RUxHTkJRVmt3UWl4blFrRkJXaXhEUVVFMlFpeE5RVUUzUWl4RlFVRnhRM2hDTEZGQlFYSkRPMEZCUTBGR0xHTkJRVmt5UWl4SFFVRmFMRWRCUVd0Q0xEQkRRVUZzUWp0QlFVTkJMRVZCTlVaRU96dEJRVGhHUkRzN1FVRkZReXhMUVVGTlF5eGhRVUZoTEZOQlFXSkJMRlZCUVdFc1EwRkJRME1zUzBGQlJDeEZRVUZYTzBGQlF6ZENMRTFCUVVkQkxGVkJRVlVzUTBGQllpeEZRVUZuUWp0QlFVTm1lRVVzUzBGQlJTeFBRVUZHTEVWQlFWZDVSU3hYUVVGWUxFTkJRWFZDTEZsQlFYWkNPMEZCUTBGNlJTeExRVUZGTEc5Q1FVRkdMRVZCUVhkQ2VVVXNWMEZCZUVJc1EwRkJiME1zYVVKQlFYQkRPMEZCUTBGNlJTeExRVUZGTEZkQlFVWXNSVUZCWlRCRkxFbEJRV1lzUTBGQmIwSXNWVUZCY0VJc1JVRkJaME0xUWl4UlFVRm9ReXhEUVVGNVF5eGhRVUY2UXp0QlFVTkJPVU1zUzBGQlJTeGhRVUZHTEVWQlFXbENPRU1zVVVGQmFrSXNRMEZCTUVJc2FVSkJRVEZDTzBGQlEwRTVReXhMUVVGRkxHRkJRVVlzUlVGQmFVSXdSU3hKUVVGcVFpeERRVUZ6UWl4UFFVRjBRaXhGUVVFclFqVkNMRkZCUVM5Q0xFTkJRWGRETEZsQlFYaERPMEZCUTBFNVF5eExRVUZGTEZkQlFVWXNSVUZCWlRCRkxFbEJRV1lzUTBGQmIwSXNZMEZCY0VJc1JVRkJiME0xUWl4UlFVRndReXhEUVVFMlF5eE5RVUUzUXp0QlFVTkJVaXhqUVVGWExGbEJRVTA3UVVGRGFFSjBReXhOUVVGRkxEUkNRVUZHTEVWQlFXZERNRVVzU1VGQmFFTXNRMEZCY1VNc1ZVRkJja01zUlVGQmFVUTFRaXhSUVVGcVJDeERRVUV3UkN4UlFVRXhSRHRCUVVOQkxFbEJSa1FzUlVGRlJ5eEpRVVpJTzBGQlIwRXNSMEZXUkN4TlFWZExPMEZCUTBvNVF5eExRVUZGTEU5QlFVWXNSVUZCVjNsRkxGZEJRVmdzUTBGQmRVSXNXVUZCZGtJN1FVRkRRWHBGTEV0QlFVVXNZVUZCUml4RlFVRnBRbmxGTEZkQlFXcENMRU5CUVRaQ0xHbENRVUUzUWp0QlFVTkJla1VzZVVOQlFXOURkMFVzUzBGQmNFTXNhMEpCUVhkRVF5eFhRVUY0UkN4RFFVRnZSU3hwUWtGQmNFVTdRVUZEUVhwRkxIZENRVUZ4UWpCRkxFbEJRWEpDTEhWQ1FVRm5SRFZDTEZGQlFXaEVMRU5CUVhsRUxHbENRVUY2UkR0QlFVTkJPVU1zZFVKQlFXOUNNRVVzU1VGQmNFSXNRMEZCZVVJc1QwRkJla0lzUlVGQmEwTTFRaXhSUVVGc1F5eERRVUV5UXl4WlFVRXpRenM3UVVGRlFTeFBRVUZIT1VNc1pVRkJZWGRGTEV0QlFXSXNjMEpCUVhGRE9VTXNUVUZCY2tNc1NVRkJLME14UWl4bFFVRmhkMFVzUzBGQllpdzJRa0ZCTkVNNVF5eE5RVUUxUXl4SFFVRnhSQ3hEUVVGMlJ5eEZRVUV3Unp0QlFVTjZSekZDTEcxQ1FVRmhkMFVzUzBGQllpeHpRa0ZCY1VOSExFZEJRWEpETEVOQlFYbERMRU5CUVhwRExFVkJRVFJEUXl4TFFVRTFRenRCUVVOQk8wRkJRMFE3UVVGRFJDeEZRWFpDUkRzN1FVRjVRa1E3TzBGQlJVTXNTMEZCVFVNc2IwSkJRVzlDTEZOQlFYQkNRU3hwUWtGQmIwSXNRMEZCUTBNc1lVRkJSQ3hGUVVGblFrTXNSMEZCYUVJc1JVRkJkMEk3UVVGRGFrUXZSU3hwUWtGQllUaEZMR0ZCUVdJc2EwSkJRWFZEUXl4SFFVRjJReXhGUVVFNFEwTXNVVUZCT1VNc1EwRkJkVVFzYjBKQlFYWkVMRVZCUVRaRlF5eEhRVUUzUlN4RFFVRnBSaXhWUVVGRFF5eEZRVUZFTEVWQlFVdERMRWRCUVV3c1JVRkJZVHRCUVVNM1JtNUdMRXRCUVVWdFJpeEhRVUZHTEVWQlFVOURMRWRCUVZBc1EwRkJWeXhGUVVGRFF5eFRRVUZUTEVOQlFWWXNSVUZCV0R0QlFVTkJMRWRCUmtRN08wRkJTVUZ5Uml4cFFrRkJZVGhGTEdGQlFXSXNhMEpCUVhWRFF5eEhRVUYyUXl4RlFVRTRRMHNzUjBGQk9VTXNRMEZCYTBRN1FVRkRha1FzWjBKQlFXRXNXVUZFYjBNN1FVRkZha1FzWTBGQlZ6dEJRVVp6UXl4SFFVRnNSRHRCUVVsQkxFVkJWRVE3TzBGQlYwUTdRVUZEUTFBc2JVSkJRV3RDTEVOQlFXeENMRVZCUVhGQ0xFTkJRWEpDTzBGQlEwRkJMRzFDUVVGclFpeERRVUZzUWl4RlFVRnhRaXhEUVVGeVFqdEJRVU5CUVN4dFFrRkJhMElzUTBGQmJFSXNSVUZCY1VJc1EwRkJja0k3TzBGQlJVUTdPMEZCUlVNc1MwRkJUVGxFTEdsQ1FVRnBRaXhUUVVGcVFrRXNZMEZCYVVJc1EwRkJRM1ZGTEUxQlFVUXNSVUZCVTFJc1lVRkJWQ3hGUVVFeVFqdEJRVU5xUkN4TlFVRkpVeXd3UWtGQlNqczdRVUZGUVN4TlFVRkhWQ3hyUWtGQmEwSXNRMEZCY2tJc1JVRkJkMEk3UVVGRGRrSXNWMEZCVDFFc1QwRkJUeTlHTEd0Q1FVRmtPMEZCUTBNc1UwRkJTeXhEUVVGTU8wRkJRME5uUnl4NVFrRkJiMEpzUnl4VlFVRlZSeXhWUVVFNVFqdEJRVU5FTzBGQlEwRXNVMEZCU3l4RFFVRk1PMEZCUTBNclJpeDVRa0ZCYjBKc1J5eFZRVUZWVFN4UlFVRTVRanRCUVVORU8wRkJRMEVzVTBGQlN5eERRVUZNTzBGQlEwTTBSaXg1UWtGQmIwSnNSeXhWUVVGVlR5eE5RVUU1UWp0QlFVTkVPMEZCUTBFc1UwRkJTeXhEUVVGTU8wRkJRME15Uml4NVFrRkJiMEpzUnl4VlFVRlZVU3hSUVVFNVFqdEJRVU5FTzBGQlEwRXNVMEZCU3l4RFFVRk1PMEZCUTBNd1JpeDVRa0ZCYjBKc1J5eFZRVUZWVXl4SFFVRTVRanRCUVVORU8wRkJaa1E3UVVGcFFrRTdPMEZCUlVSRkxHbENRVUZoT0VVc1lVRkJZaXhGUVVFNFFrb3NTVUZCT1VJc1EwRkJiVU1zVDBGQmJrTXNSVUZCTkVORUxGZEJRVFZETEVOQlFYZEVMRmxCUVhoRU8wRkJRMEY2UlN4cFFrRkJZVGhGTEdGQlFXSXNhMEpCUVhWRFVTeHRRa0ZCYVVKU0xHRkJRV3BDTEdkQ1FVRjJReXhGUVVGelJrd3NWMEZCZEVZc1EwRkJhMGNzYVVKQlFXeEhPMEZCUTBGSkxHOUNRVUZyUWtNc1lVRkJiRUlzUlVGQmFVTlJMRzFDUVVGcFFsSXNZVUZCYWtJc1owSkJRV3BET3p0QlFVVkJlRU1zWVVGQlZ5eFpRVUZOTzBGQlEyaENMRTlCUVVkM1F5eHJRa0ZCYTBJc1EwRkJja0lzUlVGQmQwSTdRVUZEZGtKMFF5eGhRVUZUSzBNc2FVSkJRVlE3UVVGRFFUczdRVUZGUkhaR0xHdENRVUZoT0VVc1lVRkJZaXhGUVVFNFFrb3NTVUZCT1VJc2RVSkJRWGxFTlVJc1VVRkJla1FzUTBGQmEwVXNhVUpCUVd4Rk8wRkJRMEU1UXl4clFrRkJZVGhGTEdGQlFXSXNSVUZCT0VKS0xFbEJRVGxDTEVOQlFXMURMRTlCUVc1RExFVkJRVFJETlVJc1VVRkJOVU1zUTBGQmNVUXNXVUZCY2tRN1FVRkRRU3hIUVZCRUxFVkJUMGNzUjBGUVNEczdRVUZUUVN4TlFVRkhkME1zYlVKQlFXbENVaXhoUVVGcVFpeHhRa0ZCWjBRNVJTeGxRVUZoT0VVc1lVRkJZaXhGUVVFNFFrb3NTVUZCT1VJc2RVSkJRWGxFYUVRc1RVRkJla1FzUjBGQmEwVXNRMEZCY2tnc1JVRkJkMGc3UVVGRGRrZzBSQ3h6UWtGQmFVSlNMR0ZCUVdwQ0xHMUNRVUU0UXl4RFFVRTVRenRCUVVOQkxFZEJSa1FzVFVGRlR6dEJRVU5PVVN4elFrRkJhVUpTTEdGQlFXcENMRzlDUVVFclF5eERRVUV2UXp0QlFVTkJPMEZCUTBRc1JVRjZRMFE3TzBGQk1rTkJMMFFzWjBKQlFXVXhRaXhUUVVGbUxFVkJRVEJDTEVOQlFURkNPenRCUVVWQk1rSXNZVUZCV1N4WlFVRk5PMEZCUTJwQ1JDeHBRa0ZCWlRGQ0xGTkJRV1lzUlVGQk1FSXNRMEZCTVVJN1FVRkRRU3hGUVVaRUxFVkJSVWNzUzBGR1NEczdRVUZKUkRzN1FVRkZReXhMUVVGTmJVY3NPRUpCUVRoQ0xGTkJRVGxDUVN3eVFrRkJPRUlzUTBGQlEwTXNRMEZCUkN4RlFVRlBPenRCUVVVeFF5eE5RVUZOVml4TlFVRk5WeXhUUVVGVE1VWXNSVUZCUlhsR0xFVkJRVVZGTEUxQlFVb3NSVUZCV1VNc1NVRkJXaXhEUVVGcFFpeFpRVUZxUWl4RFFVRlVMRU5CUVZvN1FVRkRRU3hOUVVGTlF5eFpRVUZaTjBZc1JVRkJSWGxHTEVWQlFVVkZMRTFCUVVvc1JVRkJXVWNzVDBGQldpeERRVUZ2UWl4VFFVRndRaXhGUVVFclFrWXNTVUZCTDBJc1EwRkJiME1zU1VGQmNFTXNRMEZCYkVJN1FVRkRRU3hOUVVGSlJ5d3dRa0ZCU2pzN1FVRkZRU3hOUVVGSFJpeGpRVUZqTEZWQlFXcENMRVZCUVRaQ08wRkJRelZDTDBjc2FVSkJRV05wUnl4SFFVRmtPMEZCUTBFN08wRkJSVVFzVFVGQlIyTXNZMEZCWXl4VlFVRnFRaXhGUVVFMlFqdEJRVU0xUWpsSExHbENRVUZqWjBjc1IwRkJaRHRCUVVOQk96dEJRVVZFTDBVc1ZVRkJUVFpHTEZOQlFVNHNSVUZCYlVKdVFpeEpRVUZ1UWl4RFFVRjNRaXhQUVVGNFFpeEZRVUZwUTBRc1YwRkJha01zUTBGQk5rTXNXVUZCTjBNN1FVRkRRWHBGTEZWQlFVMDJSaXhUUVVGT0xFVkJRVzFDYmtJc1NVRkJia0lzUTBGQmQwSXNZMEZCZUVJc1JVRkJkME5FTEZkQlFYaERMRU5CUVc5RUxFMUJRWEJFTzBGQlEwRjZSU3hWUVVGTk5rWXNVMEZCVGl4RlFVRnRRbTVDTEVsQlFXNUNMR3RDUVVGMVEwc3NSMEZCZGtNc1JVRkJPRU5xUXl4UlFVRTVReXhEUVVGMVJDeE5RVUYyUkR0QlFVTkJPVU1zVlVGQlRUWkdMRk5CUVU0c2EwSkJRVFJDWkN4SFFVRTFRaXhGUVVGdFEwNHNWMEZCYmtNc1EwRkJLME1zYVVKQlFTOURPMEZCUTBGNlJTeFZRVUZOTmtZc1UwRkJUaXh6UWtGQmEwTndRaXhYUVVGc1F5eERRVUU0UXl4UlFVRTVRenRCUVVOQmVrVXNTVUZCUlhsR0xFVkJRVVZGTEUxQlFVb3NSVUZCV1RkRExGRkJRVm9zUTBGQmNVSXNVVUZCY2tJN08wRkJSVUVyUWl4dlFrRkJhMEpoTEZOQlFWTXhSaXhSUVVGTk5rWXNVMEZCVGl4RlFVRnRRa1FzU1VGQmJrSXNRMEZCZDBJc1dVRkJlRUlzUTBGQlZDeERRVUZzUWl4RlFVRnRSV0lzUjBGQmJrVTdPMEZCUlVGNlF5eGhRVUZYTEZsQlFVMDdRVUZEYUVKcFF5eGpRVUZYYlVJc1UwRkJVekZHTEZGQlFVMDJSaXhUUVVGT0xFVkJRVzFDUkN4SlFVRnVRaXhEUVVGM1FpeFpRVUY0UWl4RFFVRlVMRU5CUVZnN1FVRkRRU3hIUVVaRUxFVkJSVWNzUjBGR1NEczdRVUZKUVN4TlFVRkhReXhqUVVGakxGVkJRV3BDTEVWQlFUUkNPMEZCUXpOQ04wWXNWMEZCVFRaR0xGTkJRVTRzUlVGQmJVSnVRaXhKUVVGdVFpeERRVUYzUWl4aFFVRjRRaXhGUVVGMVF6VkNMRkZCUVhaRExFTkJRV2RFTEZGQlFXaEVPMEZCUTBFNVF5eFhRVUZOTmtZc1UwRkJUaXhGUVVGdFFrY3NSVUZCYmtJc1EwRkJjMElzYTBSQlFYUkNMRVZCUVRCRkxGVkJRVU5ETEVWQlFVUXNSVUZCVVR0QlFVTXZSV3BITEZsQlFVMDJSaXhUUVVGT0xFVkJRVzFDYmtJc1NVRkJia0lzUTBGQmQwSXNZVUZCZUVJc1JVRkJkVU5FTEZkQlFYWkRMRU5CUVcxRUxGRkJRVzVFTzBGQlEwWXNTVUZHUkR0QlFVZEJPMEZCUTBRc1JVRnFRMFE3TzBGQmJVTkVPenRCUVVWRGVrVXNSMEZCUlN4dlJFRkJSaXhGUVVGM1JEUkZMRXRCUVhoRUxFTkJRVGhFTEZWQlFVTmhMRU5CUVVRc1JVRkJUenRCUVVOd1JVUXNPRUpCUVRSQ1F5eERRVUUxUWp0QlFVTkJMRVZCUmtRN08wRkJTVVE3TzBGQlJVTXNTMEZCUnl4RFFVRkRla1lzUlVGQlJXdEhMRkZCUVVZc1JVRkJXVTRzU1VGQldpeERRVUZwUWl4TlFVRnFRaXhGUVVGNVFuUkZMRkZCUVhwQ0xFTkJRV3RETEZkQlFXeERMRU5CUVVvc1JVRkJiMFE3UVVGRGJrUjBRaXhKUVVGRkxHdENRVUZHTEVWQlFYTkNiVWNzWTBGQmRFSXNRMEZCY1VNN1FVRkRjRU5ETEhGQ1FVRnJRaXhUUVVSclFqdEJRVVZ3UTBNc1YwRkJVU3hWUVVZMFFqdEJRVWR3UTBNc2EwSkJRV1Y2U0N4SlFVaHhRanRCUVVsd1F6QklMR1ZCUVZrc1NVRktkMEk3UVVGTGNFTkRMR05CUVZjc1NVRk1lVUk3UVVGTmNFTkRMR1ZCUVZrc2IwSkJRVU5xUXl4TFFVRkVMRVZCUVZjc1EwRkJSU3hEUVU1WE8wRkJUM0JEYTBNc1kwRkJWeXh0UWtGQlEyeERMRXRCUVVRc1JVRkJWenRCUVVONlFqczdRVUZGU1VRc1pVRkJWME1zUzBGQldEdEJRVU5CTEVsQldHMURPMEZCV1hCRGJVTXNVMEZCVFN4TFFWbzRRanRCUVdGd1EwTXNZVUZCVlN4SlFXSXdRanRCUVdOd1EwTXNkVUpCUVc5Q0xFdEJaR2RDTzBGQlpYQkRReXhqUVVGWE8wRkJabmxDTEVkQlFYSkRPenRCUVd0Q1FUbEhMRWxCUVVVc2EwSkJRVVlzUlVGQmMwSXJSeXhOUVVGMFFpeERRVUUyUWl4RFFVRTNRanRCUVVOQk96dEJRVVZHT3p0QlFVVkRMMGNzUjBGQlJTeFpRVUZHTEVWQlFXZENORVVzUzBGQmFFSXNRMEZCYzBJc1ZVRkJRMkVzUTBGQlJDeEZRVUZQTzBGQlF6VkNMRTFCUVVsMVFpeHBRa0ZCYVVKb1NDeEZRVUZGZVVZc1JVRkJSVVVzVFVGQlNpeEZRVUZaUnl4UFFVRmFMRU5CUVc5Q09VWXNSVUZCUlN4aFFVRkdMRU5CUVhCQ0xFTkJRWEpDT3p0QlFVVkJMRTFCUVVkblNDeGxRVUZsUXl4UlFVRm1MRU5CUVhkQ0xFMUJRWGhDTEVOQlFVZ3NSVUZCYjBNN1FVRkRia05FTEd0Q1FVRmxka01zVjBGQlppeERRVUV5UWl4TlFVRXpRanRCUVVOQmRVTXNhMEpCUVdWMFF5eEpRVUZtTEVOQlFXOUNMRmxCUVhCQ0xFVkJRV3REUkN4WFFVRnNReXhEUVVFNFF5eFJRVUU1UXp0QlFVTkJkVU1zYTBKQlFXVm9ReXhSUVVGbUxFTkJRWGRDTEdGQlFYaENMRVZCUVhWRFF5eEhRVUYyUXl4RFFVRXlReXhWUVVGRFJpeEhRVUZFTEVWQlFVMXRReXhQUVVGT0xFVkJRV3RDTzBGQlF6VkViRWdzVFVGQlJXdElMRTlCUVVZc1JVRkJWM3BETEZkQlFWZ3NRMEZCZFVJc1VVRkJka0k3UVVGRFFYcEZMRTFCUVVWclNDeFBRVUZHTEVWQlFWZDRReXhKUVVGWUxFTkJRV2RDTEU5QlFXaENMRVZCUVhsQ1JDeFhRVUY2UWl4RFFVRnhReXhUUVVGeVF5eEZRVUZuUkROQ0xGRkJRV2hFTEVOQlFYbEVMRmxCUVhwRU8wRkJRMEVzU1VGSVJEdEJRVWxCTEVkQlVFUXNUVUZQVHp0QlFVTk9hMFVzYTBKQlFXVjJReXhYUVVGbUxFTkJRVEpDTEZGQlFUTkNMRVZCUVhGRE0wSXNVVUZCY2tNc1EwRkJPRU1zVFVGQk9VTTdRVUZEUVd0RkxHdENRVUZsYUVJc1JVRkJaaXhEUVVGclFpeHJSRUZCYkVJc1JVRkJjMFVzVlVGQlEwTXNSVUZCUkN4RlFVRlJPMEZCUXpORmFrY3NUVUZCUlN4clFrRkJSaXhGUVVGelFqQkZMRWxCUVhSQ0xFTkJRVEpDTEZsQlFUTkNMRVZCUVhsRE5VSXNVVUZCZWtNc1EwRkJhMFFzVVVGQmJFUTdRVUZEUml4SlFVWkVPMEZCUjBGclJTeHJRa0ZCWldoRExGRkJRV1lzUTBGQmQwSXNZVUZCZUVJc1JVRkJkVU5ETEVkQlFYWkRMRU5CUVRKRExGVkJRVU5HTEVkQlFVUXNSVUZCVFcxRExFOUJRVTRzUlVGQmEwSTdRVUZETlVSc1NDeE5RVUZGYTBnc1QwRkJSaXhGUVVGWGVrTXNWMEZCV0N4RFFVRjFRaXhOUVVGMlFpeEZRVUVyUWpOQ0xGRkJRUzlDTEVOQlFYZERMRkZCUVhoRE8wRkJRMEU1UXl4TlFVRkZhMGdzVDBGQlJpeEZRVUZYZUVNc1NVRkJXQ3hEUVVGblFpeFBRVUZvUWl4RlFVRjVRa1FzVjBGQmVrSXNRMEZCY1VNc1dVRkJja01zUlVGQmJVUXpRaXhSUVVGdVJDeERRVUUwUkN4VFFVRTFSRHRCUVVOQk9VTXNUVUZCUld0SUxFOUJRVVlzUlVGQlYzaERMRWxCUVZnc1EwRkJaMElzV1VGQmFFSXNSVUZCT0VKRUxGZEJRVGxDTEVOQlFUQkRMRkZCUVRGRE8wRkJRMEVzU1VGS1JEdEJRVXRCTzBGQlEwUjFReXhwUWtGQlpYUkRMRWxCUVdZc1EwRkJiMElzVDBGQmNFSXNSVUZCTmtKRUxGZEJRVGRDTEVOQlFYbERMRk5CUVhwRExFVkJRVzlFTTBJc1VVRkJjRVFzUTBGQk5rUXNXVUZCTjBRN1FVRkRRU3hGUVhSQ1JEczdRVUYzUWtRN08wRkJSVU01UXl4SFFVRkZMRmxCUVVZc1JVRkJaMEkwUlN4TFFVRm9RaXhEUVVGelFpeFpRVUZOTzBGQlF6TkNMRTFCUVVjMVJTeEZRVUZGUnl4TlFVRkdMRVZCUVZWM1JDeE5RVUZXTEUxQlFYTkNNMFFzUlVGQlJTeFBRVUZHTEVWQlFWY3dRaXhOUVVGWUxFZEJRVzlDTEVOQlFURkRMRTFCUVdsRUxFTkJRVVV4UWl4RlFVRkZMR3RDUVVGR0xFVkJRWE5DYlVnc1RVRkJkRUlzUjBGQkswSkRMRWRCUVhKR0xFVkJRVEJHTzBGQlEzaEdjRWdzUzBGQlJTeHJRa0ZCUml4RlFVRnpRaXRITEUxQlFYUkNMRU5CUVRaQ0xFTkJRVGRDTzBGQlEwUXNSMEZHUkN4TlFVVlBPMEZCUTA0dlJ5eExRVUZGTEd0Q1FVRkdMRVZCUVhOQ2NVZ3NVVUZCZEVJN1FVRkRRVHRCUVVORUxFVkJUa1E3TzBGQlVVUTdPMEZCUlVNc1MwRkJUVU1zZFVKQlFYVkNMRk5CUVhaQ1FTeHZRa0ZCZFVJc1IwRkJUVHRCUVVOc1F5eE5RVUZIYmtnc1QwRkJUME1zVlVGQlVDeEhRVUZ2UWl4SFFVRndRaXhKUVVFeVFpeERRVUZEU2l4RlFVRkZMRlZCUVVZc1JVRkJZMmxJTEZGQlFXUXNRMEZCZFVJc1VVRkJka0lzUTBGQkwwSXNSVUZCYVVVN08wRkJSV2hGTEU5QlFVZHFTQ3hGUVVGRkxGRkJRVVlzUlVGQldUSkZMRWRCUVZvc1EwRkJaMElzUTBGQmFFSXNSVUZCYlVJMFF5eFZRVUZ1UWl4TFFVRnJReXhEUVVGeVF5eEZRVUYzUXp0QlFVTjJRM1pJTEUxQlFVVXNWVUZCUml4RlFVRmpPRU1zVVVGQlpDeERRVUYxUWl4UlFVRjJRanRCUVVOQk8wRkJRMFE3UVVGRFJDeEZRVkJFT3p0QlFWTkJMRXRCUVVrd1JTd3dRa0ZCU2p0QlFVRkJMRXRCUVhWQ1F5eDVRa0ZCZGtJN1FVRkJRU3hMUVVGNVEwTXNNRUpCUVhwRE8wRkJRVUVzUzBGQk5FUkRMSGxDUVVFMVJEdEJRVU5FT3p0QlFVVkRMRXRCUVUxRExHdENRVUZyUWl4VFFVRnNRa0VzWlVGQmEwSXNRMEZCUTBNc1NVRkJSQ3hGUVVGUGFFTXNVMEZCVUN4RlFVRnJRbWhJTEVsQlFXeENMRVZCUVRKQ08wRkJRMmhFTEUxQlFVZG5TaXhKUVVGSUxFVkJRVk03UVVGRFVpeFBRVUZIYUVNc1kwRkJZeXhWUVVGcVFpeEZRVUUyUWp0QlFVTTFRalJDTEhWQ1FVRnRRbnBITEZsQlFWa3NXVUZCVFR0QlFVTnVRemhITEhGQ1FVRm5RbXBETEZOQlFXaENMRVZCUVRKQ0xFZEJRVE5DTzBGQlEwRXNTMEZHYVVJc1JVRkZabWhJTEVsQlJtVXNRMEZCYmtJN1FVRkhRVHRCUVVORUxFOUJRVWRuU0N4alFVRmpMRlZCUVdwQ0xFVkJRVFpDTzBGQlF6VkNPRUlzZFVKQlFXMUNNMGNzV1VGQldTeFpRVUZOTzBGQlEyNURPRWNzY1VKQlFXZENha01zVTBGQmFFSXNSVUZCTWtJc1IwRkJNMEk3UVVGRFFTeExRVVpwUWl4RlFVVm1hRWdzU1VGR1pTeERRVUZ1UWp0QlFVZEJPMEZCUlVRc1IwRmFSQ3hOUVZsUE8wRkJRMDRzVDBGQlIyZElMR05CUVdNc1ZVRkJha0lzUlVGQk5rSTdRVUZETlVKclF5eHJRa0ZCWTA0c1owSkJRV1E3UVVGRFFUdEJRVU5FTEU5QlFVYzFRaXhqUVVGakxGVkJRV3BDTEVWQlFUWkNPMEZCUXpWQ2EwTXNhMEpCUVdOS0xHZENRVUZrTzBGQlEwRTdRVUZEUkR0QlFVTklMRVZCY2tKRU96dEJRWFZDUkRzN1FVRkZReXhMUVVGSExFTkJRVU16U0N4RlFVRkZhMGNzVVVGQlJpeEZRVUZaVGl4SlFVRmFMRU5CUVdsQ0xFMUJRV3BDTEVWQlFYbENkRVVzVVVGQmVrSXNRMEZCYTBNc1YwRkJiRU1zUTBGQlNpeEZRVUZ2UkR0QlFVTnVSRTRzWTBGQldTeFpRVUZOTzBGQlEycENMRTlCUVVkb1FpeEZRVUZGTEd0Q1FVRkdMRVZCUVhOQ2JVZ3NUVUZCZEVJc1IwRkJLMEpETEVkQlFTOUNMRWxCUVhORExFTkJRWHBETEVWQlFUUkRPMEZCUXpORGNFZ3NUVUZCUlN4MVFrRkJSaXhGUVVFeVFqaERMRkZCUVROQ0xFTkJRVzlETEdWQlFYQkRPMEZCUTBFNVF5eE5RVUZGTEZGQlFVWXNSVUZCV1RKRkxFZEJRVm9zUTBGQlowSXNRMEZCYUVJc1JVRkJiVUp4UkN4SlFVRnVRanRCUVVOQmFFa3NUVUZCUlN4UlFVRkdMRVZCUVZrNFF5eFJRVUZhTEVOQlFYRkNMRk5CUVhKQ08wRkJRMEVzU1VGS1JDeE5RVWxQTzBGQlEwNHNVVUZCU1cxR0xGVkJRVlV6Uml4WFFVRlhMRmxCUVUwN1FVRkRPVUowUXl4UFFVRkZMSFZDUVVGR0xFVkJRVEpDZVVVc1YwRkJNMElzUTBGQmRVTXNaVUZCZGtNN1FVRkRRWHBGTEU5QlFVVXNVVUZCUml4RlFVRlpNa1VzUjBGQldpeERRVUZuUWl4RFFVRm9RaXhGUVVGdFFuVkVMRXRCUVc1Q08wRkJRMEZzU1N4UFFVRkZMRkZCUVVZc1JVRkJXWGxGTEZkQlFWb3NRMEZCZDBJc1UwRkJlRUk3UVVGRFFXeERMR3RDUVVGaE1FWXNUMEZCWWp0QlFVTkJMRXRCVEdFc1JVRkxXSEJLTEVsQlRGY3NRMEZCWkR0QlFVMUJPenRCUVVWS096dEJRVVZITEU5QlFVZHRRaXhGUVVGRkxHdENRVUZHTEVWQlFYTkNiVWdzVFVGQmRFSXNSMEZCSzBKRExFZEJRUzlDTEVkQlFYRkRMRVZCUVVkcVNDeFBRVUZQWjBrc1YwRkJVQ3hIUVVGeFFpeERRVUY0UWl4RFFVRjRReXhGUVVGdlJUdEJRVU51Ulc1SkxFMUJRVVVzV1VGQlJpeEZRVUZuUW05R0xFZEJRV2hDTEVOQlFXOUNMRVZCUVVNc1lVRkJZU3hwUTBGQlpDeEZRVUZ3UWp0QlFVTkJMRWxCUmtRc1RVRkZUenRCUVVOT2NFWXNUVUZCUlN4WlFVRkdMRVZCUVdkQ2IwWXNSMEZCYUVJc1EwRkJiMElzUlVGQlF5eGhRVUZoTEN0Q1FVRmtMRVZCUVhCQ08wRkJRMEU3TzBGQlJVUnJRenM3UVVGRlNEczdRVUZGUnl4UFFVRkhia2dzVDBGQlQybEpMRlZCUVZBc1EwRkJhMElzTUVKQlFXeENMRVZCUVRoRFF5eFBRVUU1UXl4SlFVRjVSR3hKTEU5QlFVOURMRlZCUVZBc1IwRkJiMElzUjBGQmFFWXNSVUZCY1VZN1FVRkRia1pLTEUxQlFVVXNOa1ZCUVVZc1JVRkJhVVk0UXl4UlFVRnFSaXhEUVVFd1JpeFhRVUV4Ump0QlFVTkVMRWxCUmtRc1RVRkZUenRCUVVOTU9VTXNUVUZCUlN3MlJVRkJSaXhGUVVGcFJubEZMRmRCUVdwR0xFTkJRVFpHTEZkQlFUZEdPMEZCUTBRN08wRkJSVVFzVDBGQlIzcEZMRVZCUVVVc2EwSkJRVVlzUlVGQmMwSXdRaXhOUVVGNlFpeEZRVUZwUXp0QlFVRkZPMEZCUTJ4RExGRkJRVWM0Uml4elFrRkJjMElzU1VGQmVrSXNSVUZCSzBJN1FVRkRPVUpCTEhsQ1FVRnZRaXhKUVVGd1FqdEJRVU5CU1N4eFFrRkJaMElzU1VGQmFFSXNSVUZCYzBJc1ZVRkJkRUlzUlVGQmEwTXNTVUZCYkVNN1FVRkRRVHRCUVVORUxFbEJURVFzVFVGTFR6dEJRVUZGTzBGQlExSXNVVUZCUjBvc2MwSkJRWE5DTEVsQlFYcENMRVZCUVN0Q08wRkJRemxDU1N4eFFrRkJaMElzUzBGQmFFSXNSVUZCZFVJc1ZVRkJka0k3UVVGRFFVb3NlVUpCUVc5Q0xFdEJRWEJDTzBGQlEwRTdRVUZEUkRzN1FVRkZSQ3hQUVVGSGVFZ3NSVUZCUlN4clFrRkJSaXhGUVVGelFqQkNMRTFCUVhwQ0xFVkJRV2xETzBGQlFVVTdRVUZEYkVNc1VVRkJSMmRITEhOQ1FVRnpRaXhKUVVGNlFpeEZRVUVyUWp0QlFVTTVRa0VzZVVKQlFXOUNMRWxCUVhCQ08wRkJRMEZGTEhGQ1FVRm5RaXhKUVVGb1FpeEZRVUZ6UWl4VlFVRjBRaXhGUVVGclF5eEpRVUZzUXp0QlFVTkJPMEZCUTBRc1NVRk1SQ3hOUVV0UE8wRkJRVVU3UVVGRFVpeFJRVUZIUml4elFrRkJjMElzU1VGQmVrSXNSVUZCSzBJN1FVRkRPVUpGTEhGQ1FVRm5RaXhMUVVGb1FpeEZRVUYxUWl4VlFVRjJRanRCUVVOQlJpeDVRa0ZCYjBJc1MwRkJjRUk3UVVGRFFUdEJRVU5FTzBGQlEwUXNSMEYyUkVRc1JVRjFSRWNzUjBGMlJFZzdRVUYzUkVFN08wRkJSVVk3TzBGQlJVTXhTQ3hIUVVGRkxGZEJRVVlzUlVGQlpUUkZMRXRCUVdZc1EwRkJjVUlzVlVGQlEyRXNRMEZCUkN4RlFVRlBPMEZCUXpOQ0xFMUJRVTAyUXl4VlFVRlZOVU1zVTBGQlV6RkdMRVZCUVVWNVJpeEZRVUZGUlN4TlFVRktMRVZCUVZsRExFbEJRVm9zUTBGQmFVSXNXVUZCYWtJc1EwRkJWQ3hEUVVGb1FqdEJRVU5CTlVZc1NVRkJSU3hyUWtGQlJpeEZRVUZ6UWl0SExFMUJRWFJDTEVOQlFUWkNkVUlzVDBGQk4wSTdRVUZEUVhSSkxFbEJRVVVzWlVGQlJpeEZRVUZ0UWpoRExGRkJRVzVDTEVOQlFUUkNMRkZCUVRWQ096dEJRVVZCTEUxQlFVZDVSaXhQUVVGUFF5eFRRVUZRTEVOQlFXbENReXhSUVVGcVFpeERRVUV3UWl4blFrRkJNVUlzUTBGQlNDeEZRVUZuUkR0QlFVTTFRME1zVDBGQlNVWXNVMEZCU2l4RFFVRmpSeXhOUVVGa0xFTkJRWEZDTEZWQlFYSkNPMEZCUTBGS0xGVkJRVTlETEZOQlFWQXNRMEZCYVVKSExFMUJRV3BDTEVOQlFYZENMR2RDUVVGNFFqdEJRVU5CTVVrc1dVRkJVekpKTEVsQlFWUXNRMEZCWTBNc1MwRkJaQ3hEUVVGdlFrTXNVVUZCY0VJc1IwRkJLMElzVlVGQkwwSTdRVUZEUkR0QlFVTklMRVZCVmtRN08wRkJXVVE3TzBGQlJVTTVTU3hIUVVGRkxHVkJRVVlzUlVGQmJVSTBSU3hMUVVGdVFpeERRVUY1UWl4VlFVRkRZU3hEUVVGRUxFVkJRVTg3UVVGRE4wSkJMRWxCUVVWelJDeGxRVUZHTzBGQlEwWXNSVUZHUkRzN1FVRkpRU3hMUVVGSlVpeFRRVUZUZEVrc1UwRkJVMmxGTEdOQlFWUXNRMEZCZDBJc1lVRkJlRUlzUTBGQllqdEJRVUZCTEV0QlEwTjNSU3hOUVVGTmVra3NVMEZCVTJsRkxHTkJRVlFzUTBGQmQwSXNVMEZCZUVJc1EwRkVVRHM3UVVGSFJEczdRVUZGUlN4VlFVRlRPRVVzVlVGQlZDeEhRVUZ6UWpzN1FVRkZjRUlzVFVGQlIxUXNUMEZCVDBNc1UwRkJVQ3hEUVVGcFFrTXNVVUZCYWtJc1EwRkJNRUlzWjBKQlFURkNMRU5CUVVnc1JVRkJaMFE3UVVGRE9VTkRMRTlCUVVsR0xGTkJRVW9zUTBGQlkwY3NUVUZCWkN4RFFVRnhRaXhWUVVGeVFqdEJRVU5CU2l4VlFVRlBReXhUUVVGUUxFTkJRV2xDUnl4TlFVRnFRaXhEUVVGM1FpeG5Ra0ZCZUVJN1FVRkRRVE5KTEV0QlFVVXNaVUZCUml4RlFVRnRRamhETEZGQlFXNUNMRU5CUVRSQ0xGRkJRVFZDTzBGQlEwUXNSMEZLUkN4TlFVdExPMEZCUTBoNVJpeFZRVUZQUXl4VFFVRlFMRU5CUVdsQ1V5eEhRVUZxUWl4RFFVRnhRaXhuUWtGQmNrSTdRVUZEUVZBc1QwRkJTVVlzVTBGQlNpeERRVUZqVXl4SFFVRmtMRU5CUVd0Q0xGVkJRV3hDTzBGQlEwRnFTaXhMUVVGRkxHVkJRVVlzUlVGQmJVSjVSU3hYUVVGdVFpeERRVUVyUWl4UlFVRXZRanRCUVVORU8wRkJRMFk3TzBGQlJVZzdPMEZCUlVVc1MwRkJSeXhEUVVGRGVrVXNSVUZCUld0SExGRkJRVVlzUlVGQldVNHNTVUZCV2l4RFFVRnBRaXhOUVVGcVFpeEZRVUY1UW5SRkxGRkJRWHBDTEVOQlFXdERMRmRCUVd4RExFTkJRVW9zUlVGQmIwUTdRVUZEYmtScFNDeFRRVUZQYkVVc1owSkJRVkFzUTBGQmQwSXNUMEZCZUVJc1JVRkJhVU15UlN4VlFVRnFRenRCUVVOQk96dEJRVVZJT3p0QlFVVkZOMGtzVVVGQlQydEZMR2RDUVVGUUxFTkJRWGRDTEZGQlFYaENMRVZCUVd0RExGbEJRVmM3UVVGRE0wTXNUVUZCUjJ4RkxFOUJRVTlETEZWQlFWQXNSMEZCYjBJc1NVRkJjRUlzU1VGQk5FSnpTU3hKUVVGSlJpeFRRVUZLTEVOQlFXTkRMRkZCUVdRc1EwRkJkVUlzVlVGQmRrSXNRMEZCTDBJc1JVRkJiVVU3UVVGRGFrVlBPMEZCUTBGT0xFOUJRVWxHTEZOQlFVb3NRMEZCWTBjc1RVRkJaQ3hEUVVGeFFpeFZRVUZ5UWp0QlFVTkRNMGtzUzBGQlJTeGxRVUZHTEVWQlFXMUNPRU1zVVVGQmJrSXNRMEZCTkVJc1VVRkJOVUk3UVVGRFJqdEJRVU5HTEVWQlRrUTdPMEZCVVVZN08wRkJSVVVzUzBGQlJ6bERMRVZCUVVWclJ5eFJRVUZHTEVWQlFWbE9MRWxCUVZvc1EwRkJhVUlzVFVGQmFrSXNSVUZCZVVKMFJTeFJRVUY2UWl4RFFVRnJReXhYUVVGc1F5eERRVUZJTEVWQlFXMUVPMEZCUTI1RUxFMUJRVWQwUWl4RlFVRkZhMGNzVVVGQlJpeEZRVUZaVGl4SlFVRmFMRU5CUVdsQ0xFMUJRV3BDTEVWQlFYbENkRVVzVVVGQmVrSXNRMEZCYTBNc1dVRkJiRU1zUTBGQlNDeEZRVUZ2UkR0QlFVTnVSR2xFTEdOQlFWY3NRMEZCV0R0QlFVTkJPMEZCUTBRc1RVRkJSM1pGTEVWQlFVVnJSeXhSUVVGR0xFVkJRVmxPTEVsQlFWb3NRMEZCYVVJc1RVRkJha0lzUlVGQmVVSjBSU3hSUVVGNlFpeERRVUZyUXl4cFFrRkJiRU1zUTBGQlNDeEZRVUY1UkR0QlFVTjRSR2xFTEdOQlFWY3NRMEZCV0R0QlFVTkJPMEZCUTBRc1RVRkJSM1pGTEVWQlFVVnJSeXhSUVVGR0xFVkJRVmxPTEVsQlFWb3NRMEZCYVVJc1RVRkJha0lzUlVGQmVVSjBSU3hSUVVGNlFpeERRVUZyUXl4alFVRnNReXhEUVVGSUxFVkJRWE5FTzBGQlEzSkVhVVFzWTBGQlZ5eERRVUZZTzBGQlEwRTdRVUZEUkN4TlFVRkhka1VzUlVGQlJXdEhMRkZCUVVZc1JVRkJXVTRzU1VGQldpeERRVUZwUWl4TlFVRnFRaXhGUVVGNVFuUkZMRkZCUVhwQ0xFTkJRV3RETEZsQlFXeERMRU5CUVVnc1JVRkJiMFE3UVVGRGJrUnBSQ3hqUVVGWExFTkJRVmc3UVVGRFFUdEJRVU5FTEUxQlFVZDJSU3hGUVVGRmEwY3NVVUZCUml4RlFVRlpUaXhKUVVGYUxFTkJRV2xDTEUxQlFXcENMRVZCUVhsQ2RFVXNVVUZCZWtJc1EwRkJhME1zV1VGQmJFTXNRMEZCU0N4RlFVRnZSRHRCUVVOdVJFNHNaVUZCV1N4WlFVRk5PMEZCUTJwQ2MwYzdRVUZEUVN4SlFVWkVMRVZCUlVjc1IwRkdTRHRCUVVkQk8wRkJRMFE3TzBGQlJVWTdPMEZCUlVVc1ZVRkJVelJDTEZkQlFWUXNRMEZCY1VKRExFVkJRWEpDTEVWQlFYbENReXhKUVVGNlFpeEZRVUVyUWp0QlFVTTVRaXhOUVVGSlF5eFpRVUZaTEVWQlFXaENPMEZCUTBGQkxGbEJRVlZETEVWQlFWWXNSMEZCWlN4RFFVRm1MRU5CUVd0Q1JDeFZRVUZWUlN4RlFVRldMRWRCUVdVc1EwRkJaaXhEUVVGclFrWXNWVUZCVlVjc1JVRkJWaXhIUVVGbExFTkJRV1lzUTBGQmEwSklMRlZCUVZWSkxFVkJRVllzUjBGQlpTeERRVUZtTzBGQlEzUkVMRTFCUVVsRExGRkJRVkVzUlVGQldpeERRVWc0UWl4RFFVZGlPMEZCUTJwQ0xFMUJRVWxETEZGQlFWRXNSVUZCV2l4RFFVbzRRaXhEUVVsaU8wRkJRMnBDTEUxQlFVbERMRkZCUVZFc1JVRkJXaXhEUVV3NFFpeERRVXRpTzBGQlEycENMRTFCUVVsRExGRkJRVkVzUlVGQldpeERRVTQ0UWl4RFFVMWlPMEZCUTJwQ0xFMUJRVWxETEZGQlFWRXNSVUZCV2p0QlFVTkJMRTFCUVVrelJTeE5RVUZOYkVZc1UwRkJVMmxGTEdOQlFWUXNRMEZCZDBKcFJpeEZRVUY0UWl4RFFVRldPMEZCUTBGb1JTeE5RVUZKWkN4blFrRkJTaXhEUVVGeFFpeFpRVUZ5UWl4RlFVRnJReXhWUVVGVGIwSXNRMEZCVkN4RlFVRlhPMEZCUXpORExFOUJRVWx6UlN4SlFVRkpkRVVzUlVGQlJYVkZMRTlCUVVZc1EwRkJWU3hEUVVGV0xFTkJRVkk3UVVGRFFWZ3NZVUZCVlVNc1JVRkJWaXhIUVVGbFV5eEZRVUZGUlN4UFFVRnFRanRCUVVOQldpeGhRVUZWUlN4RlFVRldMRWRCUVdWUkxFVkJRVVZITEU5QlFXcENPMEZCUTBRc1IwRktSQ3hGUVVsRkxFdEJTa1k3UVVGTFFTOUZMRTFCUVVsa0xHZENRVUZLTEVOQlFYRkNMRmRCUVhKQ0xFVkJRV2xETEZWQlFWTnZRaXhEUVVGVUxFVkJRVmM3UVVGRE1VTkJMRXRCUVVVd1JTeGpRVUZHTzBGQlEwRXNUMEZCU1Vvc1NVRkJTWFJGTEVWQlFVVjFSU3hQUVVGR0xFTkJRVlVzUTBGQlZpeERRVUZTTzBGQlEwRllMR0ZCUVZWSExFVkJRVllzUjBGQlpVOHNSVUZCUlVVc1QwRkJha0k3UVVGRFFWb3NZVUZCVlVrc1JVRkJWaXhIUVVGbFRTeEZRVUZGUnl4UFFVRnFRanRCUVVORUxFZEJURVFzUlVGTFJTeExRVXhHTzBGQlRVRXZSU3hOUVVGSlpDeG5Ra0ZCU2l4RFFVRnhRaXhWUVVGeVFpeEZRVUZuUXl4VlFVRlRiMElzUTBGQlZDeEZRVUZYTzBGQlEzcERPMEZCUTBFc1QwRkJTeXhEUVVGRk5FUXNWVUZCVlVjc1JVRkJWaXhIUVVGbFJTeExRVUZtTEVkQlFYVkNUQ3hWUVVGVlF5eEZRVUZzUXl4SlFVRXdRMFFzVlVGQlZVY3NSVUZCVml4SFFVRmxSU3hMUVVGbUxFZEJRWFZDVEN4VlFVRlZReXhGUVVFMVJTeExRVUZ6UmtRc1ZVRkJWVWtzUlVGQlZpeEhRVUZsU2l4VlFVRlZSU3hGUVVGV0xFZEJRV1ZOTEV0QlFTOUNMRWxCUVRCRFVpeFZRVUZWUlN4RlFVRldMRWRCUVdWR0xGVkJRVlZKTEVWQlFWWXNSMEZCWlVrc1MwRkJlRVVzU1VGQmJVWlNMRlZCUVZWSExFVkJRVllzUjBGQlpTeERRVUUxVEN4RlFVRnJUVHRCUVVOb1RTeFJRVUZIU0N4VlFVRlZSeXhGUVVGV0xFZEJRV1ZJTEZWQlFWVkRMRVZCUVRWQ0xFVkJRV2REVVN4UlFVRlJMRWRCUVZJc1EwRkJhRU1zUzBGRFMwRXNVVUZCVVN4SFFVRlNPMEZCUTA0N1FVRkRSRHRCUVVwQkxGRkJTMHNzU1VGQlN5eERRVUZGVkN4VlFVRlZTU3hGUVVGV0xFZEJRV1ZITEV0QlFXWXNSMEZCZFVKUUxGVkJRVlZGTEVWQlFXeERMRWxCUVRCRFJpeFZRVUZWU1N4RlFVRldMRWRCUVdWSExFdEJRV1lzUjBGQmRVSlFMRlZCUVZWRkxFVkJRVFZGTEV0QlFYTkdSaXhWUVVGVlJ5eEZRVUZXTEVkQlFXVklMRlZCUVZWRExFVkJRVllzUjBGQlpVc3NTMEZCTDBJc1NVRkJNRU5PTEZWQlFWVkRMRVZCUVZZc1IwRkJaVVFzVlVGQlZVY3NSVUZCVml4SFFVRmxSeXhMUVVGNFJTeEpRVUZ0Ums0c1ZVRkJWVWtzUlVGQlZpeEhRVUZsTEVOQlFUVk1MRVZCUVd0Tk8wRkJRM0pOTEZOQlFVZEtMRlZCUVZWSkxFVkJRVllzUjBGQlpVb3NWVUZCVlVVc1JVRkJOVUlzUlVGQlowTlBMRkZCUVZFc1IwRkJVaXhEUVVGb1F5eExRVU5MUVN4UlFVRlJMRWRCUVZJN1FVRkRUanM3UVVGRlJDeFBRVUZKUVN4VFFVRlRMRVZCUVdJc1JVRkJhVUk3UVVGRFppeFJRVUZITEU5QlFVOVdMRWxCUVZBc1NVRkJaU3hWUVVGc1FpeEZRVUU0UWtFc1MwRkJTMFFzUlVGQlRDeEZRVUZSVnl4TFFVRlNPMEZCUXk5Q08wRkJRMFFzVDBGQlNVRXNVVUZCVVN4RlFVRmFPMEZCUTBGVUxHRkJRVlZETEVWQlFWWXNSMEZCWlN4RFFVRm1MRU5CUVd0Q1JDeFZRVUZWUlN4RlFVRldMRWRCUVdVc1EwRkJaaXhEUVVGclFrWXNWVUZCVlVjc1JVRkJWaXhIUVVGbExFTkJRV1lzUTBGQmEwSklMRlZCUVZWSkxFVkJRVllzUjBGQlpTeERRVUZtTzBGQlEzWkVMRWRCYWtKRUxFVkJhVUpGTEV0QmFrSkdPMEZCYTBKRU96dEJRVVZHT3p0QlFVVkRMRXRCUVUwelFpeHJRa0ZCYTBJc1UwRkJiRUpCTEdWQlFXdENMRU5CUVVOeFFpeEZRVUZFTEVWQlFVdHBRaXhEUVVGTUxFVkJRVmM3TzBGQlJXeERMRTFCUVVkcVFpeFBRVUZQTEZWQlFWWXNSVUZCYzBJN08wRkJSWEpDTEU5QlFVMXJRaXd5UWtGQk1rSnlTeXhGUVVGRkxEQkNRVUZHTEVWQlFUaENNRUlzVFVGQkwwUTdPMEZCUlVFc1QwRkJSekJKTEUxQlFVMHNSMEZCVkN4RlFVRmpPenRCUVVWaUxGRkJRVWR5VEN4alFVRmpjMHdzTWtKQlFUSkNMRU5CUVRWRExFVkJRU3RETzBGQlF6bERkRXc3UVVGRFFTeExRVVpFTEUxQlJVODdRVUZEVGtFc2JVSkJRV01zUTBGQlpEdEJRVU5CT3p0QlFVVkVhVUlzVFVGQlJTd3dRa0ZCUml4RlFVRTRRbXBDTEZkQlFUbENMRVZCUVRKRE5rWXNTMEZCTTBNN1FVRkRRVHRCUVVORUxFOUJRVWQzUml4TlFVRk5MRWRCUVZRc1JVRkJZenM3UVVGRllpeFJRVUZIY2t3c1kwRkJZeXhEUVVGcVFpeEZRVUZ2UWp0QlFVTnVRa0U3UVVGRFFTeExRVVpFTEUxQlJVODdRVUZEVGtFc2JVSkJRV056VEN3eVFrRkJNa0lzUTBGQmVrTTdRVUZEUVRzN1FVRkZSSEpMTEUxQlFVVXNNRUpCUVVZc1JVRkJPRUpxUWl4WFFVRTVRaXhGUVVFeVF6WkdMRXRCUVRORE8wRkJRMEU3UVVGRFJEdEJRVU5FTEUxQlFVZDFSU3hQUVVGUExGVkJRVllzUlVGQmMwSTdPMEZCUlhKQ0xFOUJRVTF0UWl3eVFrRkJNa0owU3l4RlFVRkZMREJDUVVGR0xFVkJRVGhDTUVJc1RVRkJMMFE3TzBGQlJVRXNUMEZCUnpCSkxFMUJRVTBzUjBGQlZDeEZRVUZqT3p0QlFVVmlMRkZCUVVkMFRDeGpRVUZqZDB3c01rSkJRVEpDTEVOQlFUVkRMRVZCUVN0RE8wRkJRemxEZUV3N1FVRkRRU3hMUVVaRUxFMUJSVTg3UVVGRFRrRXNiVUpCUVdNc1EwRkJaRHRCUVVOQk96dEJRVVZFYTBJc1RVRkJSU3d3UWtGQlJpeEZRVUU0UW14Q0xGZEJRVGxDTEVWQlFUSkRPRVlzUzBGQk0wTTdRVUZEUVR0QlFVTkVMRTlCUVVkM1JpeE5RVUZOTEVkQlFWUXNSVUZCWXpzN1FVRkZZaXhSUVVGSGRFd3NZMEZCWXl4RFFVRnFRaXhGUVVGdlFqdEJRVU51UWtFN1FVRkRRU3hMUVVaRUxFMUJSVTg3UVVGRFRrRXNiVUpCUVdOM1RDd3lRa0ZCTWtJc1EwRkJla003UVVGRFFUczdRVUZGUkhSTExFMUJRVVVzTUVKQlFVWXNSVUZCT0VKc1FpeFhRVUU1UWl4RlFVRXlRemhHTEV0QlFUTkRPMEZCUTBFN1FVRkRSRHRCUVVORUxFVkJjRVJFT3p0QlFYTkVSRHM3UVVGRlF5eExRVUZITEVOQlFVTTFSU3hGUVVGRmEwY3NVVUZCUml4RlFVRlpUaXhKUVVGYUxFTkJRV2xDTEUxQlFXcENMRVZCUVhsQ2RFVXNVVUZCZWtJc1EwRkJhME1zVjBGQmJFTXNRMEZCU2l4RlFVRnZSRHRCUVVOdVJEUklMR05CUVZrc1ZVRkJXaXhGUVVGM1FuQkNMR1ZCUVhoQ08wRkJRMEZ2UWl4alFVRlpMRlZCUVZvc1JVRkJkMEp3UWl4bFFVRjRRanRCUVVOQk8wRkJRMFFzUTBGcWJrSkVJaXdpWm1sc1pTSTZJbVpoYTJWZk9ETXdNR1prT1RFdWFuTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUpqYjI1emRDQjBhVzFsSUQwZ056VXdPMXh1YkdWMElITmxZM1JwYjI0elNXUjRJRDBnTUR0Y2JteGxkQ0J6WldOMGFXOXVORWxrZUNBOUlEQTdYRzVjYmk4dklHeGxkQ0JHYjI5MFltRnNiRVp5WVcxbGN5d2dWR1Z1Ym1selJuSmhiV1Z6TENCQ1lYTmxZbUZzYkVaeVlXMWxjeXdnUW1GemEyVjBZbUZzYkVaeVlXMWxjeXdnUm1GdVJuSmhiV1Z6TENCSlpHeGxSbkpoYldVN1hHNXNaWFFnZEdWdWJtbHpRVzVwYldGMGFXOXVMQ0JtYjI5MFltRnNiRUZ1YVcxaGRHbHZiaXdnWW1GemEyVjBZbUZzYkVGdWFXMWhkR2x2Yml3Z1ltRnpaV0poYkd4QmJtbHRZWFJwYjI0c0lHWmhia0Z1YVcxaGRHbHZianRjYmx4dVkyOXVjM1FnYldGemRHVnlUMkpxSUQwZ2UxeHVYSFJ6WldOMGFXOXVNa04xY25KbGJuUkpaSGc2SURBc0lGeHVYSFJ6WldOMGFXOXVNVU4xY25KbGJuUkpaSGc2SURBc1hHNWNkR0poYzJ0bGRHSmhiR3c2SUh0c2IyOXdRVzF2ZFc1ME9pQXhMQ0JzYjI5d1NXUTZJR0poYzJ0bGRHSmhiR3hCYm1sdFlYUnBiMjU5TEZ4dVhIUm1iMjkwWW1Gc2JEb2dlMnh2YjNCQmJXOTFiblE2SURFc0lHeHZiM0JKWkRvZ1ptOXZkR0poYkd4QmJtbHRZWFJwYjI1OUxGeHVYSFIwWlc1dWFYTTZJSHRzYjI5d1FXMXZkVzUwT2lBeExDQnNiMjl3U1dRNklIUmxibTVwYzBGdWFXMWhkR2x2Ym4wc1hHNWNkR0poYzJWaVlXeHNPaUI3Ykc5dmNFRnRiM1Z1ZERvZ01Td2diRzl2Y0Vsa09pQmlZWE5sWW1Gc2JFRnVhVzFoZEdsdmJuMHNYRzVjZEdaaGJqb2dlMnh2YjNCQmJXOTFiblE2SURFc0lHeHZiM0JKWkRvZ1ptRnVRVzVwYldGMGFXOXVmVnh1ZlR0Y2JtTnZibk4wSUdodmJXVndZV2RsVFc5aVNXMWhaMlZ6SUQwZ1cxeHVYSFFuWVhOelpYUnpMMmx0WVdkbGN5OW9iMjFsY0dGblpVMXZZaTlpWVhOclpYUmlZV3hzTG1wd1p5Y3NYRzVjZENkaGMzTmxkSE12YVcxaFoyVnpMMmh2YldWd1lXZGxUVzlpTDJadmIzUmlZV3hzTG1wd1p5Y3NYRzVjZENkaGMzTmxkSE12YVcxaFoyVnpMMmh2YldWd1lXZGxUVzlpTDNSbGJtNXBjeTVxY0djbkxDQmNibHgwSjJGemMyVjBjeTlwYldGblpYTXZhRzl0WlhCaFoyVk5iMkl2WW1GelpXSmhiR3d1YW5Cbkp5d2dYRzVjZENkaGMzTmxkSE12YVcxaFoyVnpMMmh2YldWd1lXZGxUVzlpTDJaaGJpNXFjR2NuSUZ4dVhWeHVYRzRrS0dSdlkzVnRaVzUwS1M1eVpXRmtlU2dvS1NBOVBpQjdYRzR2THlCWFFVbFVJRVpQVWlCblpubERZWFJGYldKbFpDQldTVVJGVHlCVVR5QlRWRUZTVkNCUVRFRlpTVTVISUU5T0lFMVBRa2xNUlN3Z1ZFaEZUaUJJU1VSRklGUklSU0JNVDBGRVNVNUhJRUZPU1UxQlZFbFBUaTRnWEZ4Y1hGeHVYRzVjZEdsbUtIZHBibVJ2ZHk1cGJtNWxjbGRwWkhSb0lEd2dPREF3S1NCN1hHNWNkRngwWEc1Y2RGeDBabVYwWTJnb0oyRnpjMlYwY3k5cWN5OUdZVzUwWVhOMFpXTmZVM0J5YVhSbFgxTm9aV1YwTG1wemIyNG5LUzUwYUdWdUtHWjFibU4wYVc5dUtISmxjM0J2Ym5ObEtTQjdJRnh1WEhSY2RGeDBjbVYwZFhKdUlISmxjM0J2Ym5ObExtcHpiMjRvS1R0Y2JseDBYSFI5S1M1MGFHVnVLR1oxYm1OMGFXOXVLSE53Y21sMFpVOWlhaWtnZTF4dVhIUmNkRngwWTI5dWMzUWdTV1JzWlVaeVlXMWxJRDBnWm1sc2RHVnlRbmxXWVd4MVpTaHpjSEpwZEdWUFltb3VabkpoYldWekxDQW5hV1JzWlNjcE8xeHVYSFJjZEZ4MGJXRnpkR1Z5VDJKcUxtWnZiM1JpWVd4c0xtRnVhVzFoZEdsdmJrRnljbUY1SUQwZ1d5NHVMa2xrYkdWR2NtRnRaU3dnTGk0dVptbHNkR1Z5UW5sV1lXeDFaU2h6Y0hKcGRHVlBZbW91Wm5KaGJXVnpMQ0FuWm05dmRHSmhiR3duS1YwN1hHNWNkRngwWEhSdFlYTjBaWEpQWW1vdWRHVnVibWx6TG1GdWFXMWhkR2x2YmtGeWNtRjVJRDBnV3k0dUxrbGtiR1ZHY21GdFpTd2dMaTR1Wm1sc2RHVnlRbmxXWVd4MVpTaHpjSEpwZEdWUFltb3VabkpoYldWekxDQW5kR1Z1Ym1sekp5bGRPMXh1WEhSY2RGeDBiV0Z6ZEdWeVQySnFMbUpoYzJWaVlXeHNMbUZ1YVcxaGRHbHZia0Z5Y21GNUlEMGdXeTR1TGtsa2JHVkdjbUZ0WlN3Z0xpNHVabWxzZEdWeVFubFdZV3gxWlNoemNISnBkR1ZQWW1vdVpuSmhiV1Z6TENBblltRnpaV0poYkd3bktWMDdYRzVjZEZ4MFhIUnRZWE4wWlhKUFltb3VZbUZ6YTJWMFltRnNiQzVoYm1sdFlYUnBiMjVCY25KaGVTQTlJRnN1TGk1SlpHeGxSbkpoYldVc0lDNHVMbVpwYkhSbGNrSjVWbUZzZFdVb2MzQnlhWFJsVDJKcUxtWnlZVzFsY3l3Z0oySmhjMnRsZENjcFhUdGNibHgwWEhSY2RHMWhjM1JsY2s5aWFpNW1ZVzR1WVc1cGJXRjBhVzl1UVhKeVlYa2dQU0JiTGk0dVNXUnNaVVp5WVcxbExDQXVMaTVtYVd4MFpYSkNlVlpoYkhWbEtITndjbWwwWlU5aWFpNW1jbUZ0WlhNc0lDZG1ZVzRuS1YwN1hHNWNkRngwWEhSY2JseDBYSFJjZEdGdWFXMWhkRzl5VTJWMGRYQW9LVHRjYmx4MFhIUmNkR2x0WVdkbFEyOXVkSEp2YkdWeUtHMWhjM1JsY2s5aWFpd2dNU2s3WEc1Y2JseDBYSFJjZEhObGRFbHVkR1Z5ZG1Gc0tDZ3BJRDArSUh0Y2JseDBYSFJjZEZ4MGFXMWhaMlZEYjI1MGNtOXNaWElvYldGemRHVnlUMkpxTENBeEtUdGNibHgwWEhSY2RIMHNJRFV3TURBcE8xeHVYSFJjZEgwcE8xeHVYSFI5WEc1Y2JseDBZMjl1YzNRZ1ptbHNkR1Z5UW5sV1lXeDFaU0E5SUNoaGNuSmhlU3dnYzNSeWFXNW5LU0E5UGlCN1hHNGdJQ0FnY21WMGRYSnVJR0Z5Y21GNUxtWnBiSFJsY2lodklEMCtJSFI1Y0dWdlppQnZXeWRtYVd4bGJtRnRaU2RkSUQwOVBTQW5jM1J5YVc1bkp5QW1KaUJ2V3lkbWFXeGxibUZ0WlNkZExuUnZURzkzWlhKRFlYTmxLQ2t1YVc1amJIVmtaWE1vYzNSeWFXNW5MblJ2VEc5M1pYSkRZWE5sS0NrcEtUdGNibHgwZlZ4dVhHNWNkR052Ym5OMElHRnVhVzFoZEc5eVUyVjBkWEFnUFNBb0tTQTlQaUI3WEc1Y2RGeDBYSFJjYmlBZ0lDQjJZWElnYkdGemRGUnBiV1VnUFNBd08xeHVJQ0FnSUhaaGNpQjJaVzVrYjNKeklEMGdXeWR0Y3ljc0lDZHRiM29uTENBbmQyVmlhMmwwSnl3Z0oyOG5YVHRjYmlBZ0lDQm1iM0lvZG1GeUlIZ2dQU0F3T3lCNElEd2dkbVZ1Wkc5eWN5NXNaVzVuZEdnZ0ppWWdJWGRwYm1SdmR5NXlaWEYxWlhOMFFXNXBiV0YwYVc5dVJuSmhiV1U3SUNzcmVDa2dlMXh1SUNBZ0lDQWdJQ0IzYVc1a2IzY3VjbVZ4ZFdWemRFRnVhVzFoZEdsdmJrWnlZVzFsSUQwZ2QybHVaRzkzVzNabGJtUnZjbk5iZUYwckoxSmxjWFZsYzNSQmJtbHRZWFJwYjI1R2NtRnRaU2RkTzF4dUlDQWdJQ0FnSUNCM2FXNWtiM2N1WTJGdVkyVnNRVzVwYldGMGFXOXVSbkpoYldVZ1BTQjNhVzVrYjNkYmRtVnVaRzl5YzF0NFhTc25RMkZ1WTJWc1FXNXBiV0YwYVc5dVJuSmhiV1VuWFNCOGZDQjNhVzVrYjNkYmRtVnVaRzl5YzF0NFhTc25RMkZ1WTJWc1VtVnhkV1Z6ZEVGdWFXMWhkR2x2YmtaeVlXMWxKMTA3WEc0Z0lDQWdmVnh1SUZ4dUlDQWdJR2xtSUNnaGQybHVaRzkzTG5KbGNYVmxjM1JCYm1sdFlYUnBiMjVHY21GdFpTbGNiaUFnSUNBZ0lDQWdkMmx1Wkc5M0xuSmxjWFZsYzNSQmJtbHRZWFJwYjI1R2NtRnRaU0E5SUdaMWJtTjBhVzl1S0dOaGJHeGlZV05yTENCbGJHVnRaVzUwS1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0IyWVhJZ1kzVnljbFJwYldVZ1BTQnVaWGNnUkdGMFpTZ3BMbWRsZEZScGJXVW9LVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIWmhjaUIwYVcxbFZHOURZV3hzSUQwZ1RXRjBhQzV0WVhnb01Dd2dNVFlnTFNBb1kzVnljbFJwYldVZ0xTQnNZWE4wVkdsdFpTa3BPMXh1SUNBZ0lDQWdJQ0FnSUNBZ2RtRnlJR2xrSUQwZ2QybHVaRzkzTG5ObGRGUnBiV1Z2ZFhRb1puVnVZM1JwYjI0b0tTQjdJR05oYkd4aVlXTnJLR04xY25KVWFXMWxJQ3NnZEdsdFpWUnZRMkZzYkNrN0lIMHNJRnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQjBhVzFsVkc5RFlXeHNLVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lHeGhjM1JVYVcxbElEMGdZM1Z5Y2xScGJXVWdLeUIwYVcxbFZHOURZV3hzTzF4dUlDQWdJQ0FnSUNBZ0lDQWdjbVYwZFhKdUlHbGtPMXh1SUNBZ0lDQWdJQ0I5TzF4dUlGeHVJQ0FnSUdsbUlDZ2hkMmx1Wkc5M0xtTmhibU5sYkVGdWFXMWhkR2x2YmtaeVlXMWxLVnh1SUNBZ0lDQWdJQ0IzYVc1a2IzY3VZMkZ1WTJWc1FXNXBiV0YwYVc5dVJuSmhiV1VnUFNCbWRXNWpkR2x2YmlocFpDa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ1kyeGxZWEpVYVcxbGIzVjBLR2xrS1R0Y2JpQWdJQ0FnSUNBZ2ZUdGNibHgwZlZ4dVhHNWNkR052Ym5OMElHRnVhVzFoZEc5eUlEMGdLR0Z1YVcxaGRHbHZiazlpYWlrZ1BUNGdlMXh1WEhSY2RGeDBYSFJjZEZ4MFhHNWNkRngwZG1GeUlHUmhibU5wYm1kSlkyOXVMRnh1WEhSY2RGeDBjM0J5YVhSbFNXMWhaMlVzWEc1Y2RGeDBYSFJqWVc1MllYTTdYSFJjZEZ4MFhIUmNkRnh1WEc1Y2RGeDBablZ1WTNScGIyNGdaMkZ0WlV4dmIzQWdLQ2tnZTF4dVhIUmNkRngwSkNnbkkyeHZZV1JwYm1jbktTNWhaR1JEYkdGemN5Z25hR2xrWkdWdUp5azdYRzVjZEZ4MElDQmhibWx0WVhScGIyNVBZbW91Ykc5dmNFbGtJRDBnZDJsdVpHOTNMbkpsY1hWbGMzUkJibWx0WVhScGIyNUdjbUZ0WlNobllXMWxURzl2Y0NrN1hHNWNkRngwSUNCa1lXNWphVzVuU1dOdmJpNTFjR1JoZEdVb0tUdGNibHgwWEhRZ0lHUmhibU5wYm1kSlkyOXVMbkpsYm1SbGNpZ3BPMXh1WEhSY2RIMWNibHgwWEhSY2JseDBYSFJtZFc1amRHbHZiaUJ6Y0hKcGRHVWdLRzl3ZEdsdmJuTXBJSHRjYmx4MFhIUmNibHgwWEhSY2RIWmhjaUIwYUdGMElEMGdlMzBzWEc1Y2RGeDBYSFJjZEdaeVlXMWxTVzVrWlhnZ1BTQXdMRnh1WEhSY2RGeDBYSFIwYVdOclEyOTFiblFnUFNBd0xGeHVYSFJjZEZ4MFhIUnNiMjl3UTI5MWJuUWdQU0F3TEZ4dVhIUmNkRngwWEhSMGFXTnJjMUJsY2taeVlXMWxJRDBnYjNCMGFXOXVjeTUwYVdOcmMxQmxja1p5WVcxbElIeDhJREFzWEc1Y2RGeDBYSFJjZEc1MWJXSmxjazltUm5KaGJXVnpJRDBnYjNCMGFXOXVjeTV1ZFcxaVpYSlBaa1p5WVcxbGN5QjhmQ0F4TzF4dVhIUmNkRngwWEc1Y2RGeDBYSFIwYUdGMExtTnZiblJsZUhRZ1BTQnZjSFJwYjI1ekxtTnZiblJsZUhRN1hHNWNkRngwWEhSMGFHRjBMbmRwWkhSb0lEMGdiM0IwYVc5dWN5NTNhV1IwYUR0Y2JseDBYSFJjZEhSb1lYUXVhR1ZwWjJoMElEMGdiM0IwYVc5dWN5NW9aV2xuYUhRN1hHNWNkRngwWEhSMGFHRjBMbWx0WVdkbElEMGdiM0IwYVc5dWN5NXBiV0ZuWlR0Y2JseDBYSFJjZEhSb1lYUXViRzl2Y0hNZ1BTQnZjSFJwYjI1ekxteHZiM0J6TzF4dVhIUmNkRngwWEc1Y2RGeDBYSFIwYUdGMExuVndaR0YwWlNBOUlHWjFibU4wYVc5dUlDZ3BJSHRjYmx4dUlDQWdJQ0FnSUNCMGFXTnJRMjkxYm5RZ0t6MGdNVHRjYmx4dUlDQWdJQ0FnSUNCcFppQW9kR2xqYTBOdmRXNTBJRDRnZEdsamEzTlFaWEpHY21GdFpTa2dlMXh1WEc1Y2RGeDBYSFJjZEZ4MGRHbGphME52ZFc1MElEMGdNRHRjYmlBZ0lDQWdJQ0FnSUNBdkx5QkpaaUIwYUdVZ1kzVnljbVZ1ZENCbWNtRnRaU0JwYm1SbGVDQnBjeUJwYmlCeVlXNW5aVnh1SUNBZ0lDQWdJQ0FnSUdsbUlDaG1jbUZ0WlVsdVpHVjRJRHdnYm5WdFltVnlUMlpHY21GdFpYTWdMU0F4S1NCN1hIUmNiaUFnSUNBZ0lDQWdJQ0F2THlCSGJ5QjBieUIwYUdVZ2JtVjRkQ0JtY21GdFpWeHVJQ0FnSUNBZ0lDQWdJQ0FnWm5KaGJXVkpibVJsZUNBclBTQXhPMXh1SUNBZ0lDQWdJQ0FnSUgwZ1pXeHpaU0I3WEc0Z0lDQWdJQ0FnSUZ4MFhIUnNiMjl3UTI5MWJuUXJLMXh1SUNBZ0lDQWdJQ0FnSUNBZ1puSmhiV1ZKYm1SbGVDQTlJREE3WEc1Y2JpQWdJQ0FnSUNBZ0lDQWdJR2xtS0d4dmIzQkRiM1Z1ZENBOVBUMGdkR2hoZEM1c2IyOXdjeWtnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdYSFIzYVc1a2IzY3VZMkZ1WTJWc1FXNXBiV0YwYVc5dVJuSmhiV1VvWVc1cGJXRjBhVzl1VDJKcUxteHZiM0JKWkNrN1hHNGdJQ0FnSUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0FnSUNBZ2ZWeHVYSFFnSUNBZ0lDQjlYRzVjZENBZ0lDQjlYRzVjZEZ4MFhIUmNibHgwWEhSY2RIUm9ZWFF1Y21WdVpHVnlJRDBnWm5WdVkzUnBiMjRnS0NrZ2UxeHVYSFJjZEZ4MFhHNWNkRngwWEhRZ0lDOHZJRU5zWldGeUlIUm9aU0JqWVc1MllYTmNibHgwWEhSY2RDQWdkR2hoZEM1amIyNTBaWGgwTG1Oc1pXRnlVbVZqZENnd0xDQXdMQ0IwYUdGMExuZHBaSFJvTENCMGFHRjBMbWhsYVdkb2RDazdYRzVjZEZ4MFhIUWdJRnh1WEhSY2RGeDBJQ0IwYUdGMExtTnZiblJsZUhRdVpISmhkMGx0WVdkbEtGeHVYSFJjZEZ4MElDQWdJSFJvWVhRdWFXMWhaMlVzWEc1Y2RGeDBYSFFnSUNBZ1lXNXBiV0YwYVc5dVQySnFMbUZ1YVcxaGRHbHZia0Z5Y21GNVcyWnlZVzFsU1c1a1pYaGRMbVp5WVcxbExuZ3NYRzVjZEZ4MFhIUWdJQ0FnWVc1cGJXRjBhVzl1VDJKcUxtRnVhVzFoZEdsdmJrRnljbUY1VzJaeVlXMWxTVzVrWlhoZExtWnlZVzFsTG5rc1hHNWNkRngwWEhRZ0lDQWdNakF3TEZ4dVhIUmNkRngwSUNBZ0lERTNOU3hjYmx4MFhIUmNkQ0FnSUNBd0xGeHVYSFJjZEZ4MElDQWdJREFzWEc1Y2RGeDBYSFFnSUNBZ2QybHVaRzkzTG1sdWJtVnlWMmxrZEdnZ0x5QXpMamcwTml4Y2JseDBYSFJjZENBZ0lDQjNhVzVrYjNjdWFXNXVaWEpYYVdSMGFDQXZJRFF1TVNsY2JseDBYSFJjZEgwN1hHNWNkRngwWEhSY2JseDBYSFJjZEhKbGRIVnliaUIwYUdGME8xeHVYSFJjZEgxY2JseDBYSFJjYmx4MFhIUXZMeUJIWlhRZ1kyRnVkbUZ6WEc1Y2RGeDBZMkZ1ZG1GeklEMGdaRzlqZFcxbGJuUXVaMlYwUld4bGJXVnVkRUo1U1dRb0oyTmhiblpoY3ljcE8xeHVYSFJjZEdOaGJuWmhjeTUzYVdSMGFDQTlJSGRwYm1SdmR5NXBibTVsY2xkcFpIUm9JQzhnTXk0NE5EWTdYRzVjZEZ4MFkyRnVkbUZ6TG1obGFXZG9kQ0E5SUhkcGJtUnZkeTVwYm01bGNsZHBaSFJvSUM4Z01pNHlPMXh1WEhSY2RGeHVYSFJjZEM4dklFTnlaV0YwWlNCemNISnBkR1VnYzJobFpYUmNibHgwWEhSemNISnBkR1ZKYldGblpTQTlJRzVsZHlCSmJXRm5aU2dwTzF4MFhHNWNkRngwWEc1Y2RGeDBMeThnUTNKbFlYUmxJSE53Y21sMFpWeHVYSFJjZEdSaGJtTnBibWRKWTI5dUlEMGdjM0J5YVhSbEtIdGNibHgwWEhSY2RHTnZiblJsZUhRNklHTmhiblpoY3k1blpYUkRiMjUwWlhoMEtGd2lNbVJjSWlrc1hHNWNkRngwWEhSM2FXUjBhRG9nTkRBME1DeGNibHgwWEhSY2RHaGxhV2RvZERvZ01UYzNNQ3hjYmx4MFhIUmNkR2x0WVdkbE9pQnpjSEpwZEdWSmJXRm5aU3hjYmx4MFhIUmNkRzUxYldKbGNrOW1SbkpoYldWek9pQmhibWx0WVhScGIyNVBZbW91WVc1cGJXRjBhVzl1UVhKeVlYa3ViR1Z1WjNSb0xGeHVYSFJjZEZ4MGRHbGphM05RWlhKR2NtRnRaVG9nTkN4Y2JseDBYSFJjZEd4dmIzQnpPaUJoYm1sdFlYUnBiMjVQWW1vdWJHOXZjRUZ0YjNWdWRGeHVYSFJjZEgwcE8xeHVYSFJjZEZ4dVhIUmNkQzh2SUV4dllXUWdjM0J5YVhSbElITm9aV1YwWEc1Y2RGeDBjM0J5YVhSbFNXMWhaMlV1WVdSa1JYWmxiblJNYVhOMFpXNWxjaWhjSW14dllXUmNJaXdnWjJGdFpVeHZiM0FwTzF4dVhIUmNkSE53Y21sMFpVbHRZV2RsTG5OeVl5QTlJQ2RoYzNObGRITXZhVzFoWjJWekwwWmhiblJoYzNSbFkxOVRjSEpwZEdWZlUyaGxaWFF1Y0c1bkp6dGNibHgwZlNCY2JseHVMeThnU1U1SlZFbEJURWxUUlNCQlRrUWdVMFZVVlZBZ1ExVlNVa1ZPVkNCUVFVZEZMaUJGV0VWRFZWUkZJRlJTUVU1VFNWUkpUMDVUSUVGT1JDQlNSVTFQVmtVZ1ZFbE9WQ0JKUmlCU1JVeEZWa0ZPVkNCY1hGeGNYRzVjYmx4MFkyOXVjM1JjZEhCaFoyVk1iMkZrWlhJZ1BTQW9hVzVrWlhncElEMCtJSHRjYmx4MFhIUnBaaWhwYm1SbGVDQTlQVDBnTlNrZ2UxeHVYSFJjZEZ4MEpDZ25MblJwYm5RbktTNXlaVzF2ZG1WRGJHRnpjeWduY21WdGIzWmxWR2x1ZENjcE8xeHVYSFJjZEZ4MEpDZ25MbUpoWTJ0bmNtOTFibVJYY21Gd2NHVnlKeWt1Y21WdGIzWmxRMnhoYzNNb0ozTmpZV3hsUW1GamEyZHliM1Z1WkNjcE8xeHVYSFJjZEZ4MEpDZ25JM05sWTNScGIyNDFKeWt1Wm1sdVpDZ25MbWhsWVdScGJtY25LUzVoWkdSRGJHRnpjeWduYzJodmR5Qm1ZV1JsU1c0bktUdGNibHgwWEhSY2RDUW9KeTV6ZFdKVFpXTjBhVzl1SnlrdVlXUmtRMnhoYzNNb0ozTmpZV3hsUW1GamEyZHliM1Z1WkNjcE8xeHVYSFJjZEZ4MEpDZ25Mbk4xWWxObFkzUnBiMjRuS1M1bWFXNWtLQ2N1ZEdsdWRDY3BMbUZrWkVOc1lYTnpLQ2R5WlcxdmRtVlVhVzUwSnlrN1hHNWNkRngwWEhRa0tDY2pjMlZqZEdsdmJqVW5LUzVtYVc1a0tDY3VkR1Y0ZEZkeVlYQndaWEluS1M1aFpHUkRiR0Z6Y3lnbmMyaHZkeWNwTzF4dVhIUmNkRngwYzJWMFZHbHRaVzkxZENnb0tTQTlQaUI3WEc1Y2RGeDBYSFJjZENRb0p5NXpkV0pUWldOMGFXOXVJRDRnTG5SbGVIUlhjbUZ3Y0dWeUp5a3VabWx1WkNnbkxtaGxZV1JwYm1jbktTNWhaR1JEYkdGemN5Z25abUZrWlVsdUp5azdYRzVjZEZ4MFhIUjlMQ0F4TURBd0tUdGNibHgwWEhSOUlGeHVYSFJjZEdWc2MyVWdlMXh1WEhSY2RGeDBKQ2duTG5ScGJuUW5LUzV5WlcxdmRtVkRiR0Z6Y3lnbmNtVnRiM1psVkdsdWRDY3BPMXh1WEhSY2RGeDBKQ2duTG5OMVlsTmxZM1JwYjI0bktTNXlaVzF2ZG1WRGJHRnpjeWduYzJOaGJHVkNZV05yWjNKdmRXNWtKeWs3WEc1Y2RGeDBYSFFrS0dBdVltRmphMmR5YjNWdVpGZHlZWEJ3WlhJNmJtOTBLQ056WldOMGFXOXVKSHRwYm1SbGVIMUNZV05yWjNKdmRXNWtLV0FwTG5KbGJXOTJaVU5zWVhOektDZHpZMkZzWlVKaFkydG5jbTkxYm1RbktUdGNibHgwWEhSY2RDUW9ZQzV6WldOMGFXOXVMbUZqZEdsMlpXQXBMbVpwYm1Rb1lDNWlZV05yWjNKdmRXNWtWM0poY0hCbGNtQXBMbUZrWkVOc1lYTnpLQ2R6WTJGc1pVSmhZMnRuY205MWJtUW5LVHRjYmx4MFhIUmNkQ1FvWUhObFkzUnBiMjR1WVdOMGFYWmxZQ2t1Wm1sdVpDZ25MblJwYm5RbktTNWhaR1JEYkdGemN5Z25jbVZ0YjNabFZHbHVkQ2NwTzF4dVhHNWNkRngwWEhScFppZ2tLR0F1YzJWamRHbHZiaVI3YVc1a1pYaDlVR0ZuYVc1aGRHOXlRblYwZEc5dVlDa3ViR1Z1WjNSb0lDWW1JQ1FvWUM1elpXTjBhVzl1Skh0cGJtUmxlSDFRWVdkcGJtRjBiM0pDZFhSMGIyNHVZV04wYVhabFlDa3ViR1Z1WjNSb0lEd2dNU2tnZTF4dVhIUmNkRngwWEhRa0tHQXVjMlZqZEdsdmJpUjdhVzVrWlhoOVVHRm5hVzVoZEc5eVFuVjBkRzl1WUNrdVoyVjBLREFwTG1Oc2FXTnJLQ2s3WEc1Y2RGeDBYSFI5WEc1Y2RGeDBmVnh1WEhSOU8xeHVYRzR2THlCSVNVUkZJRUZNVENCQ1JVTkxSMUpQVlU1RVV5QkpUaUJVU0VVZ1UwVkRWRWxQVGlCRldFTkZVRlFnVkVoRklGTlFSVU5KUmtsRlJDQkpUa1JGV0N3Z1YwaEpRMGdnU1ZNZ1UwTkJURVZFSUVGT1JDQlRTRTlYVGk0Z1hGeGNYRnh1WEc1Y2RHTnZibk4wSUdsdWFYUnBZV3hwZW1WVFpXTjBhVzl1SUQwZ0tITmxZM1JwYjI1T2RXMWlaWElzSUdsa2VDa2dQVDRnZTF4dVhIUmNkQ1FvWUNOelpXTjBhVzl1Skh0elpXTjBhVzl1VG5WdFltVnlmVUpoWTJ0bmNtOTFibVFrZTJsa2VIMWdLUzV6YVdKc2FXNW5jeWduTG1KaFkydG5jbTkxYm1SWGNtRndjR1Z5SnlrdWJXRndLQ2hwZUN3Z1pXeGxLU0E5UGlCN1hHNWNkRngwWEhRa0tHVnNaU2t1WTNOektIdHZjR0ZqYVhSNU9pQXdmU2s3WEc1Y2RGeDBmU2s3WEc1Y2JseDBYSFFrS0dBamMyVmpkR2x2YmlSN2MyVmpkR2x2Yms1MWJXSmxjbjFDWVdOclozSnZkVzVrSkh0cFpIaDlZQ2t1WTNOektIdGNibHgwWEhSY2RDZDBjbUZ1YzJadmNtMG5PaUFuYzJOaGJHVW9NUzR4S1Njc1hHNWNkRngwWEhRbmIzQmhZMmwwZVNjNklERmNibHgwWEhSOUtUdGNibHgwZlR0Y2JseHVMeThnU1U1SlZFbEJWRVVnYVc1cGRHbGhiR2w2WlZObFkzUnBiMjRnVDA0Z1UwVkRWRWxQVGxNZ015QkJUa1FnTkM0Z1hGeGNYRnh1WEhScGJtbDBhV0ZzYVhwbFUyVmpkR2x2YmlneExDQXdLVHRjYmx4MGFXNXBkR2xoYkdsNlpWTmxZM1JwYjI0b015d2dNQ2s3WEc1Y2RHbHVhWFJwWVd4cGVtVlRaV04wYVc5dUtEUXNJREFwTzF4dVhHNHZMeUJUUlVOVVNVOU9VeUF5SUNoQlFrOVZWQ0JWVXlCVFJVTlVTVTlPS1NCQ1FVTkxSMUpQVlU1RUlFbE5RVWRGSUZSU1FVNVRTVlJKVDA0Z1NFRk9SRXhGVWk0Z1hGeGNYRnh1WEc1Y2RHTnZibk4wSUdsdFlXZGxRMjl1ZEhKdmJHVnlJRDBnS0dsa2VFOWlhaXdnYzJWamRHbHZiazUxYldKbGNpa2dQVDRnZTF4dVhIUmNkR3hsZENCeVpXeGxkbUZ1ZEVGdWFXMWhkR2x2Ymp0Y2JseHVYSFJjZEdsbUtITmxZM1JwYjI1T2RXMWlaWElnUFQwOUlERXBJSHRjYmx4MFhIUmNkSE4zYVhSamFDaHBaSGhQWW1vdWMyVmpkR2x2YmpGRGRYSnlaVzUwU1dSNEtTQjdYRzVjZEZ4MFhIUmNkR05oYzJVZ01EcGNibHgwWEhSY2RGeDBYSFJ5Wld4bGRtRnVkRUZ1YVcxaGRHbHZiaUE5SUcxaGMzUmxjazlpYWk1aVlYTnJaWFJpWVd4c08xeHVYSFJjZEZ4MFhIUmljbVZoYXp0Y2JseDBYSFJjZEZ4MFkyRnpaU0F4T2x4dVhIUmNkRngwWEhSY2RISmxiR1YyWVc1MFFXNXBiV0YwYVc5dUlEMGdiV0Z6ZEdWeVQySnFMbVp2YjNSaVlXeHNPMXh1WEhSY2RGeDBYSFJpY21WaGF6dGNibHgwWEhSY2RGeDBZMkZ6WlNBeU9seHVYSFJjZEZ4MFhIUmNkSEpsYkdWMllXNTBRVzVwYldGMGFXOXVJRDBnYldGemRHVnlUMkpxTG5SbGJtNXBjenRjYmx4MFhIUmNkRngwWW5KbFlXczdYRzVjZEZ4MFhIUmNkR05oYzJVZ016cGNibHgwWEhSY2RGeDBYSFJ5Wld4bGRtRnVkRUZ1YVcxaGRHbHZiaUE5SUcxaGMzUmxjazlpYWk1aVlYTmxZbUZzYkR0Y2JseDBYSFJjZEZ4MFluSmxZV3M3WEc1Y2RGeDBYSFJjZEdOaGMyVWdORHBjYmx4MFhIUmNkRngwWEhSeVpXeGxkbUZ1ZEVGdWFXMWhkR2x2YmlBOUlHMWhjM1JsY2s5aWFpNW1ZVzQ3WEc1Y2RGeDBYSFJjZEdKeVpXRnJPMXh1WEhSY2RGeDBmVnh1WEhSY2RIMWNibHh1WEhSY2RDUW9ZQ056WldOMGFXOXVKSHR6WldOMGFXOXVUblZ0WW1WeWZXQXBMbVpwYm1Rb0p5NTBhVzUwSnlrdWNtVnRiM1psUTJ4aGMzTW9KM0psYlc5MlpWUnBiblFuS1R0Y2JseDBYSFFrS0dBamMyVmpkR2x2YmlSN2MyVmpkR2x2Yms1MWJXSmxjbjFDWVdOclozSnZkVzVrSkh0cFpIaFBZbXBiWUhObFkzUnBiMjRrZTNObFkzUnBiMjVPZFcxaVpYSjlRM1Z5Y21WdWRFbGtlR0JkZldBcExuSmxiVzkyWlVOc1lYTnpLQ2R6WTJGc1pVSmhZMnRuY205MWJtUW5LVHRjYmx4MFhIUnBibWwwYVdGc2FYcGxVMlZqZEdsdmJpaHpaV04wYVc5dVRuVnRZbVZ5TENCcFpIaFBZbXBiWUhObFkzUnBiMjRrZTNObFkzUnBiMjVPZFcxaVpYSjlRM1Z5Y21WdWRFbGtlR0JkS1R0Y2JseDBYSFJjYmx4MFhIUnpaWFJVYVcxbGIzVjBLQ2dwSUQwK0lIdGNibHgwWEhSY2RHbG1LSE5sWTNScGIyNU9kVzFpWlhJZ1BUMDlJREVwSUh0Y2JseDBYSFJjZEZ4MFlXNXBiV0YwYjNJb2NtVnNaWFpoYm5SQmJtbHRZWFJwYjI0cE8xeHVYSFJjZEZ4MGZWeHVYRzVjZEZ4MFhIUWtLR0FqYzJWamRHbHZiaVI3YzJWamRHbHZiazUxYldKbGNuMWdLUzVtYVc1a0tHQXVZbUZqYTJkeWIzVnVaRmR5WVhCd1pYSmdLUzVoWkdSRGJHRnpjeWduYzJOaGJHVkNZV05yWjNKdmRXNWtKeWs3WEc1Y2RGeDBYSFFrS0dBamMyVmpkR2x2YmlSN2MyVmpkR2x2Yms1MWJXSmxjbjFnS1M1bWFXNWtLQ2N1ZEdsdWRDY3BMbUZrWkVOc1lYTnpLQ2R5WlcxdmRtVlVhVzUwSnlrN1hHNWNkRngwZlN3Z05UQXdLVHRjYmx4dVhIUmNkR2xtS0dsa2VFOWlhbHRnYzJWamRHbHZiaVI3YzJWamRHbHZiazUxYldKbGNuMURkWEp5Wlc1MFNXUjRZRjBnUFQwOUlDUW9ZQ056WldOMGFXOXVKSHR6WldOMGFXOXVUblZ0WW1WeWZXQXBMbVpwYm1Rb1lDNWlZV05yWjNKdmRXNWtWM0poY0hCbGNtQXBMbXhsYm1kMGFDQXRJREVwSUh0Y2JseDBYSFJjZEdsa2VFOWlhbHRnYzJWamRHbHZiaVI3YzJWamRHbHZiazUxYldKbGNuMURkWEp5Wlc1MFNXUjRZRjBnUFNBd08xeHVYSFJjZEgwZ1pXeHpaU0I3WEc1Y2RGeDBYSFJwWkhoUFltcGJZSE5sWTNScGIyNGtlM05sWTNScGIyNU9kVzFpWlhKOVEzVnljbVZ1ZEVsa2VHQmRJQ3M5SURFN1hHNWNkRngwZlZ4dVhIUjlYRzVjYmx4MGFXMWhaMlZEYjI1MGNtOXNaWElvYldGemRHVnlUMkpxTENBeUtUdGNibHh1WEhSelpYUkpiblJsY25aaGJDZ29LU0E5UGlCN1hHNWNkRngwYVcxaFoyVkRiMjUwY205c1pYSW9iV0Z6ZEdWeVQySnFMQ0F5S1R0Y2JseDBmU3dnTVRVd01EQXBPMXh1WEc0dkx5QlFRVWRKVGtGVVNVOU9JRUpWVkZSUFRsTWdRMHhKUTBzZ1NFRk9SRXhGVWlCR1QxSWdVMFZEVkVsUFRsTWdNeUJCVGtRZ05DNGdYRnhjWEZ4dVhHNWNkR052Ym5OMElHaGhibVJzWlZCaGJtbHVZWFJwYjI1Q2RYUjBiMjVEYkdsamF5QTlJQ2hsS1NBOVBpQjdYRzVjYmx4MFhIUmpiMjV6ZENCcFpIZ2dQU0J3WVhKelpVbHVkQ2drS0dVdWRHRnlaMlYwS1M1aGRIUnlLQ2RrWVhSaExXbHVaR1Y0SnlrcE8xeHVYSFJjZEdOdmJuTjBJSE5sWTNScGIyNUpaQ0E5SUNRb1pTNTBZWEpuWlhRcExtTnNiM05sYzNRb0ozTmxZM1JwYjI0bktTNWhkSFJ5S0NkcFpDY3BPMXh1WEhSY2RHeGxkQ0J5Wld4bGRtRnVkRVJoZEdGQmNuSmhlVHRjYmx4dVhIUmNkR2xtS0hObFkzUnBiMjVKWkNBOVBUMGdKM05sWTNScGIyNHpKeWtnZTF4dVhIUmNkRngwYzJWamRHbHZiak5KWkhnZ1BTQnBaSGc3WEc1Y2RGeDBmVnh1WEc1Y2RGeDBhV1lvYzJWamRHbHZia2xrSUQwOVBTQW5jMlZqZEdsdmJqUW5LU0I3WEc1Y2RGeDBYSFJ6WldOMGFXOXVORWxrZUNBOUlHbGtlRHRjYmx4MFhIUjlYRzVjYmx4MFhIUWtLR0FqSkh0elpXTjBhVzl1U1dSOVlDa3VabWx1WkNnbkxuUnBiblFuS1M1eVpXMXZkbVZEYkdGemN5Z25jbVZ0YjNabFZHbHVkQ2NwTzF4dVhIUmNkQ1FvWUNNa2UzTmxZM1JwYjI1SlpIMWdLUzVtYVc1a0tDY3VkR1Y0ZEZkeVlYQndaWEluS1M1eVpXMXZkbVZEYkdGemN5Z25jMmh2ZHljcE8xeHVYSFJjZENRb1lDTWtlM05sWTNScGIyNUpaSDFnS1M1bWFXNWtLR0FqZEdWNGRGZHlZWEJ3WlhJa2UybGtlSDFnS1M1aFpHUkRiR0Z6Y3lnbmMyaHZkeWNwTzF4dVhIUmNkQ1FvWUNNa2UzTmxZM1JwYjI1SlpIMUNZV05yWjNKdmRXNWtKSHRwWkhoOVlDa3VjbVZ0YjNabFEyeGhjM01vSjNOallXeGxRbUZqYTJkeWIzVnVaQ2NwTzF4dVhIUmNkQ1FvWUM0a2UzTmxZM1JwYjI1SlpIMVFZV2RwYm1GMGIzSkNkWFIwYjI1Z0tTNXlaVzF2ZG1WRGJHRnpjeWduWVdOMGFYWmxKeWs3WEc1Y2RGeDBKQ2hsTG5SaGNtZGxkQ2t1WVdSa1EyeGhjM01vSjJGamRHbDJaU2NwTzF4dVhHNWNkRngwYVc1cGRHbGhiR2w2WlZObFkzUnBiMjRvY0dGeWMyVkpiblFvSkNoZ0l5UjdjMlZqZEdsdmJrbGtmV0FwTG1GMGRISW9KMlJoZEdFdGFXNWtaWGduS1Nrc0lHbGtlQ2s3WEc1Y2JseDBYSFJ6WlhSVWFXMWxiM1YwS0NncElEMCtJSHRjYmx4MFhIUmNkSEJoWjJWTWIyRmtaWElvY0dGeWMyVkpiblFvSkNoZ0l5UjdjMlZqZEdsdmJrbGtmV0FwTG1GMGRISW9KMlJoZEdFdGFXNWtaWGduS1NrcE8xeHVYSFJjZEgwc0lEVXdNQ2s3WEc1Y2JseDBYSFJwWmloelpXTjBhVzl1U1dRZ0lUMDlJQ2R6WldOMGFXOXVNaWNwZTF4dVhIUmNkRngwSkNoZ0l5UjdjMlZqZEdsdmJrbGtmV0FwTG1acGJtUW9KeTVvWldGa2FXNW5MQ0J3SnlrdVlXUmtRMnhoYzNNb0oyWmhaR1ZKYmljcE8xeHVYSFJjZEZ4MEpDaGdJeVI3YzJWamRHbHZia2xrZldBcExtOXVLQ2QwY21GdWMybDBhVzl1Wlc1a0lIZGxZbXRwZEZSeVlXNXphWFJwYjI1RmJtUWdiMVJ5WVc1emFYUnBiMjVGYm1RbkxDQW9aWE1wSUQwK0lIdGNibHgwSUNBZ0lGeDBKQ2hnSXlSN2MyVmpkR2x2Ymtsa2ZXQXBMbVpwYm1Rb0p5NW9aV0ZrYVc1bkxDQndKeWt1Y21WdGIzWmxRMnhoYzNNb0oyWmhaR1ZKYmljcE8xeHVYSFJjZEZ4MGZTazdYRzVjZEZ4MGZWeHVYSFI5TzF4dVhHNHZMeUJEVEVsRFN5Qk1TVk5VUlU1RlVpQkdUMUlnVUVGSFNVNUJWRWxQVGlCQ1ZWUlVUMDVUSUU5T0lGTkZRMVJKVDA1VElETWdRVTVFSURRdUlGeGNYRnhjYmx4dVhIUWtLQ2N1YzJWamRHbHZiak5RWVdkcGJtRjBiM0pDZFhSMGIyNHNJQzV6WldOMGFXOXVORkJoWjJsdVlYUnZja0oxZEhSdmJpY3BMbU5zYVdOcktDaGxLU0E5UGlCN1hHNWNkRngwYUdGdVpHeGxVR0Z1YVc1aGRHbHZia0oxZEhSdmJrTnNhV05yS0dVcE8xeHVYSFI5S1R0Y2JseHVMeThnU1U1SlZFbEJURWxhUlNCUFRrVlFRVWRGVTBOU1QweE1JRWxHSUU1UFZDQkpUaUJEVFZNZ1VGSkZWa2xGVnk0Z1hGeGNYRnh1WEc1Y2RHbG1LQ0VrS0d4dlkyRjBhVzl1S1M1aGRIUnlLQ2RvY21WbUp5a3VhVzVqYkhWa1pYTW9KMmx1WkdWNExuQm9jQ2NwS1NCN1hHNWNkRngwSkNnbkkzTmpjbTlzYkdWeVYzSmhjSEJsY2ljcExtOXVaWEJoWjJWZmMyTnliMnhzS0h0Y2JseDBYSFJjZEhObFkzUnBiMjVEYjI1MFlXbHVaWEk2SUZ3aWMyVmpkR2x2Ymx3aUxDQWdJQ0JjYmx4MFhIUmNkR1ZoYzJsdVp6b2dYQ0psWVhObExXOTFkRndpTENBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnWEc1Y2RGeDBYSFJoYm1sdFlYUnBiMjVVYVcxbE9pQjBhVzFsTENBZ0lDQWdJQ0FnSUNBZ0lGeHVYSFJjZEZ4MGNHRm5hVzVoZEdsdmJqb2dkSEoxWlN3Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0JjYmx4MFhIUmNkSFZ3WkdGMFpWVlNURG9nZEhKMVpTd2dJQ0FnSUNBZ0lDQWdJQ0FnSUNCY2JseDBYSFJjZEdKbFptOXlaVTF2ZG1VNklDaHBibVJsZUNrZ1BUNGdlMzBzSUZ4dVhIUmNkRngwWVdaMFpYSk5iM1psT2lBb2FXNWtaWGdwSUQwK0lIdGNiaTh2SUVsT1NWUkpRVXhKV2tVZ1ZFaEZJRU5WVWxKRlRsUWdVRUZIUlM0Z1hGeGNYRnh1WEc1Y2RGeDBYSFJjZEhCaFoyVk1iMkZrWlhJb2FXNWtaWGdwTzF4dVhIUmNkRngwZlN3Z0lGeHVYSFJjZEZ4MGJHOXZjRG9nWm1Gc2MyVXNJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JjYmx4MFhIUmNkR3RsZVdKdllYSmtPaUIwY25WbExDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1hHNWNkRngwWEhSeVpYTndiMjV6YVhabFJtRnNiR0poWTJzNklHWmhiSE5sTENBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUZ4dVhIUmNkRngwWkdseVpXTjBhVzl1T2lCY0luWmxjblJwWTJGc1hDSWdJQ0FnSUNBZ0lDQWdYRzVjZEZ4MGZTazdYRzVjYmx4MFhIUWtLQ2NqYzJOeWIyeHNaWEpYY21Gd2NHVnlKeWt1Ylc5MlpWUnZLREVwTzF4dVhIUjlYRzVjYmk4dklFTlBUbFJTVDB3Z1EweEpRMHRUSUU5T0lGZFBVa3NnVjBsVVNDQlZVeUJUUlVOVVNVOU9JQ2hUUlVOVVNVOU9OU2t1SUZ4Y1hGeGNibHh1WEhRa0tDY3VZMnhwWTJ0aFlteGxKeWt1WTJ4cFkyc29LR1VwSUQwK0lIdGNibHgwWEhSc1pYUWdZM1Z5Y21WdWRGTmxZM1JwYjI0Z1BTQWtLR1V1ZEdGeVoyVjBLUzVqYkc5elpYTjBLQ1FvSnk1emRXSlRaV04wYVc5dUp5a3BPMXh1WEc1Y2RGeDBhV1lvWTNWeWNtVnVkRk5sWTNScGIyNHVhR0Z6UTJ4aGMzTW9KMjl3Wlc0bktTa2dlMXh1WEhSY2RGeDBZM1Z5Y21WdWRGTmxZM1JwYjI0dWNtVnRiM1psUTJ4aGMzTW9KMjl3Wlc0bktUdGNibHgwWEhSY2RHTjFjbkpsYm5SVFpXTjBhVzl1TG1acGJtUW9KeTVpZFhSMGIyNHNJSEFuS1M1eVpXMXZkbVZEYkdGemN5Z25abUZrWlVsdUp5azdYRzVjZEZ4MFhIUmpkWEp5Wlc1MFUyVmpkR2x2Ymk1emFXSnNhVzVuY3lnbkxuTjFZbE5sWTNScGIyNG5LUzV0WVhBb0tHbGtlQ3dnYzJWamRHbHZiaWtnUFQ0Z2UxeHVYSFJjZEZ4MFhIUWtLSE5sWTNScGIyNHBMbkpsYlc5MlpVTnNZWE56S0NkamJHOXpaV1FuS1R0Y2JseDBYSFJjZEZ4MEpDaHpaV04wYVc5dUtTNW1hVzVrS0NjdWRHbHVkQ2NwTG5KbGJXOTJaVU5zWVhOektDZGhaR1JVYVc1MEp5a3VZV1JrUTJ4aGMzTW9KM0psYlc5MlpWUnBiblFuS1R0Y2JseDBYSFJjZEgwcE8xeHVYSFJjZEgwZ1pXeHpaU0I3WEc1Y2RGeDBYSFJqZFhKeVpXNTBVMlZqZEdsdmJpNXlaVzF2ZG1WRGJHRnpjeWduWTJ4dmMyVmtKeWt1WVdSa1EyeGhjM01vSjI5d1pXNG5LVHRjYmx4MFhIUmNkR04xY25KbGJuUlRaV04wYVc5dUxtOXVLQ2QwY21GdWMybDBhVzl1Wlc1a0lIZGxZbXRwZEZSeVlXNXphWFJwYjI1RmJtUWdiMVJ5WVc1emFYUnBiMjVGYm1RbkxDQW9aWE1wSUQwK0lIdGNibHgwSUNBZ0lGeDBKQ2duTG5OMVlsTmxZM1JwYjI0dWIzQmxiaWNwTG1acGJtUW9KeTVpZFhSMGIyNHNJSEFuS1M1aFpHUkRiR0Z6Y3lnblptRmtaVWx1SnlrN1hHNWNkRngwWEhSOUtUdGNibHgwWEhSY2RHTjFjbkpsYm5SVFpXTjBhVzl1TG5OcFlteHBibWR6S0NjdWMzVmlVMlZqZEdsdmJpY3BMbTFoY0Nnb2FXUjRMQ0J6WldOMGFXOXVLU0E5UGlCN1hHNWNkRngwWEhSY2RDUW9jMlZqZEdsdmJpa3VjbVZ0YjNabFEyeGhjM01vSjI5d1pXNG5LUzVoWkdSRGJHRnpjeWduWTJ4dmMyVmtKeWs3WEc1Y2RGeDBYSFJjZENRb2MyVmpkR2x2YmlrdVptbHVaQ2duTG5ScGJuUW5LUzV5WlcxdmRtVkRiR0Z6Y3lnbmNtVnRiM1psVkdsdWRDY3BMbUZrWkVOc1lYTnpLQ2RoWkdSVWFXNTBKeWs3WEc1Y2RGeDBYSFJjZENRb2MyVmpkR2x2YmlrdVptbHVaQ2duTG1KMWRIUnZiaXdnY0NjcExuSmxiVzkyWlVOc1lYTnpLQ2RtWVdSbFNXNG5LVHRjYmx4MFhIUmNkSDBwTzF4dVhIUmNkSDFjYmx4MFhIUmpkWEp5Wlc1MFUyVmpkR2x2Ymk1bWFXNWtLQ2N1ZEdsdWRDY3BMbkpsYlc5MlpVTnNZWE56S0NkaFpHUlVhVzUwSnlrdVlXUmtRMnhoYzNNb0ozSmxiVzkyWlZScGJuUW5LVHRjYmx4MGZTazdYRzVjYmk4dklFTlBUbFJTVDB3Z1JrOVBWRVZTSUVGU1VrOVhJRU5NU1VOTFV5NGdYRnhjWEZ4dVhHNWNkQ1FvSnlOa2IzZHVRWEp5YjNjbktTNWpiR2xqYXlnb0tTQTlQaUI3WEc1Y2RGeDBhV1lvSkNoM2FXNWtiM2NwTG1obGFXZG9kQ2dwSUNvZ0tDUW9KeTV3WVdkbEp5a3ViR1Z1WjNSb0lDMGdNU2tnUFQwOUlDMGdKQ2duSTNOamNtOXNiR1Z5VjNKaGNIQmxjaWNwTG05bVpuTmxkQ2dwTG5SdmNDa2dlMXh1WEhRZ0lGeDBKQ2duSTNOamNtOXNiR1Z5VjNKaGNIQmxjaWNwTG0xdmRtVlVieWd4S1R0Y2JseDBYSFI5SUdWc2MyVWdlMXh1WEhSY2RGeDBKQ2duSTNOamNtOXNiR1Z5VjNKaGNIQmxjaWNwTG0xdmRtVkViM2R1S0NrN1hHNWNkRngwZlZ4dVhIUjlLVHRjYmx4dUx5OGdTRWxFUlNCVVNFVWdURTlCUkVsT1J5QkJUa2xOUVZSSlQxQk9JRmRJUlU0Z1ZrbEVSVThnU1ZNZ1VrVkJSRmtnVkU4Z1VFeEJXU0JQVGlCRVJWaExWRTlRTGlCY1hGeGNYRzVjYmx4MFkyOXVjM1FnYUdsa1pVeHZZV1JwYm1kQmJtbHRZWFJwYjI0Z1BTQW9LU0E5UGlCN1hHNWNkRngwYVdZb2QybHVaRzkzTG1sdWJtVnlWMmxrZEdnZ1BpQTRNREFnSmlZZ0lTUW9KeU5zYjJGa2FXNW5KeWt1YUdGelEyeGhjM01vSjJocFpHUmxiaWNwS1NCN1hHNWNibHgwWEhSY2RHbG1LQ1FvSnlOMmFXUmxieWNwTG1kbGRDZ3dLUzV5WldGa2VWTjBZWFJsSUQwOVBTQTBLU0I3WEc1Y2RGeDBYSFJjZENRb0p5TnNiMkZrYVc1bkp5a3VZV1JrUTJ4aGMzTW9KMmhwWkdSbGJpY3BPMXh1WEhSY2RGeDBmVnh1WEhSY2RIMWNibHgwZlZ4dVhHNWNkR3hsZENCelpXTjBhVzl1TTBGMWRHOXRZWFJsWkN3Z1lYVjBiMjFoZEdWVFpXTjBhVzl1TXl3Z2MyVmpkR2x2YmpSQmRYUnZiV0YwWldRc0lHRjFkRzl0WVhSbFUyVmpkR2x2YmpRN1hHNHZMeUJOUVU1QlIwVk5SVTVVSUVaVlRrTlVTVTlPSUVaUFVpQlRSVlJVU1U1SElFRk9SQ0JEVEVWQlVrbE9SeUJVU0VVZ1UweEpSRVVnUVZWVVQwMUJWRWxQVGlCSlRsUkZVbFpCVEZNdUlGeGNYRnhjYmx4dVhIUmpiMjV6ZENCcGJuUmxjblpoYkUxaGJtRm5aWElnUFNBb1pteGhaeXdnYzJWamRHbHZia2xrTENCMGFXMWxLU0E5UGlCN1hHNGdJQ0JjZEdsbUtHWnNZV2NwSUh0Y2JpQWdJRngwWEhScFppaHpaV04wYVc5dVNXUWdQVDA5SUNkelpXTjBhVzl1TXljcElIdGNiaUFnSUZ4MFhIUmNkR0YxZEc5dFlYUmxVMlZqZEdsdmJqTWdQU0J6WlhSSmJuUmxjblpoYkNnb0tTQTlQaUI3WEc1Y2RDQWdJQ0FnWEhSY2RITjNhWEJsUTI5dWRISnZiR3hsY2loelpXTjBhVzl1U1dRc0lDZHNKeWs3WEhSY2JseDBJQ0FnSUNCY2RIMHNJSFJwYldVcE8xeHVJQ0FnWEhSY2RIMWNiaUFnSUZ4MFhIUnBaaWh6WldOMGFXOXVTV1FnUFQwOUlDZHpaV04wYVc5dU5DY3BJSHRjYmlBZ0lGeDBYSFJjZEdGMWRHOXRZWFJsVTJWamRHbHZialFnUFNCelpYUkpiblJsY25aaGJDZ29LU0E5UGlCN1hHNWNkQ0FnSUNBZ1hIUmNkSE4zYVhCbFEyOXVkSEp2Ykd4bGNpaHpaV04wYVc5dVNXUXNJQ2RzSnlrN1hIUmNibHgwSUNBZ0lDQmNkSDBzSUhScGJXVXBPMXh1SUNBZ1hIUmNkSDFjYmlBZ0lDQWdYSFFnWEc0Z0lDQmNkSDBnWld4elpTQjdYRzRnSUNCY2RGeDBhV1lvYzJWamRHbHZia2xrSUQwOVBTQW5jMlZqZEdsdmJqTW5LU0I3WEc0Z0lDQWdYSFJjZEdOc1pXRnlTVzUwWlhKMllXd29ZWFYwYjIxaGRHVlRaV04wYVc5dU15azdYRzRnSUNBZ1hIUjlYRzRnSUNBZ1hIUnBaaWh6WldOMGFXOXVTV1FnUFQwOUlDZHpaV04wYVc5dU5DY3BJSHRjYmlBZ0lDQmNkRngwWTJ4bFlYSkpiblJsY25aaGJDaGhkWFJ2YldGMFpWTmxZM1JwYjI0MEtUdGNiaUFnSUNCY2RIMWNiaUFnSUZ4MGZWeHVYSFI5TzF4dVhHNHZMeUJKUmlCT1QxUWdTVTRnUTAxVElFRkVUVWxPSUZCU1JWWkpSVmNzSUZCRlVsQkZWRlZCVEV4WklFTklSVU5MSUVsR0lGZEZJRUZTUlNCQlZDQlVTRVVnVkU5UUlFOUdJRlJJUlNCUVFVZEZJRUZPUkNCSlJpQlRUeXdnUkU5T1ZDQlRTRTlYSUZSSVJTQkdUMDlVUlZJZ1QxSWdSMUpGUlU0Z1UwaEJVRVV1SUZ4Y1hGeGNibHh1WEhScFppZ2hKQ2hzYjJOaGRHbHZiaWt1WVhSMGNpZ25hSEpsWmljcExtbHVZMngxWkdWektDZHBibVJsZUM1d2FIQW5LU2tnZTF4dVhIUmNkSE5sZEVsdWRHVnlkbUZzS0NncElEMCtJSHRjYmx4MFhIUmNkR2xtS0NRb0p5TnpZM0p2Ykd4bGNsZHlZWEJ3WlhJbktTNXZabVp6WlhRb0tTNTBiM0FnUGowZ01Da2dlMXh1WEhSY2RGeDBYSFFrS0NjamFHVmhaR1Z5VTJoaGNHVXNJQ05tYjI5MFpYSW5LUzVoWkdSRGJHRnpjeWduYlc5MlpVOW1abE5qY21WbGJpY3BPMXh1WEhSY2RGeDBYSFFrS0NjamRtbGtaVzhuS1M1blpYUW9NQ2t1Y0d4aGVTZ3BPMXh1WEhSY2RGeDBYSFFrS0NjdVlYSnliM2NuS1M1aFpHUkRiR0Z6Y3lnbmNIVnNjMkYwWlNjcE8xeHVYSFJjZEZ4MGZTQmxiSE5sSUh0Y2JseDBYSFJjZEZ4MGRtRnlJSFJwYldWdmRYUWdQU0J6WlhSVWFXMWxiM1YwS0NncElEMCtJSHRjYmx4MFhIUmNkRngwWEhRa0tDY2phR1ZoWkdWeVUyaGhjR1VzSUNObWIyOTBaWEluS1M1eVpXMXZkbVZEYkdGemN5Z25iVzkyWlU5bVpsTmpjbVZsYmljcE8xeHVYSFJjZEZ4MFhIUmNkQ1FvSnlOMmFXUmxieWNwTG1kbGRDZ3dLUzV3WVhWelpTZ3BPMXh1WEhSY2RGeDBYSFJjZENRb0p5NWhjbkp2ZHljcExuSmxiVzkyWlVOc1lYTnpLQ2R3ZFd4ellYUmxKeWs3WEc1Y2RGeDBYSFJjZEZ4MFkyeGxZWEpVYVcxbGIzVjBLSFJwYldWdmRYUXBPMXh1WEhSY2RGeDBYSFI5TENCMGFXMWxLVHRjYmx4MFhIUmNkSDFjYmx4dUx5OGdVazlVUVZSRklGUklSU0JCVWxKUFZ5QkpUaUJVU0VVZ1JrOVBWRVZTSUZkSVJVNGdRVlFnVkVoRklFSlBWRlJQVFNCUFJpQlVTRVVnVUVGSFJTQmNYRnhjWEc1Y2JseDBYSFJjZEdsbUtDUW9KeU56WTNKdmJHeGxjbGR5WVhCd1pYSW5LUzV2Wm1aelpYUW9LUzUwYjNBZ1BDQXRJQ2gzYVc1a2IzY3VhVzV1WlhKSVpXbG5hSFFnS2lBMEtTa2dlMXh1WEhSY2RGeDBYSFFrS0NjalpHOTNia0Z5Y205M0p5a3VZM056S0hzbmRISmhibk5tYjNKdEp6b2dKM0p2ZEdGMFpTZ3hPREJrWldjcElIUnlZVzV6YkdGMFpWZ29MVFV3SlNrbmZTazdYRzVjZEZ4MFhIUjlJR1ZzYzJVZ2UxeHVYSFJjZEZ4MFhIUWtLQ2NqWkc5M2JrRnljbTkzSnlrdVkzTnpLSHNuZEhKaGJuTm1iM0p0SnpvZ0ozUnlZVzV6YkdGMFpWZ29MVFV3SlNrZ2NtOTBZWFJsS0RCa1pXY3BKMzBwTzF4dVhIUmNkRngwZlZ4dVhHNWNkRngwWEhSb2FXUmxURzloWkdsdVowRnVhVzFoZEdsdmJpZ3BPMXh1WEc0dkx5QkJSRVFnVEVGT1JGTkRRVkJGSUZOVVdVeEZVeUJVVHlCU1JVeEZWa0ZPVkNCRlRFVk5SVTVVVXlCY1hGeGNYRzVjYmx4MFhIUmNkR2xtS0hkcGJtUnZkeTV0WVhSamFFMWxaR2xoS0Z3aUtHOXlhV1Z1ZEdGMGFXOXVPaUJzWVc1a2MyTmhjR1VwWENJcExtMWhkR05vWlhNZ0ppWWdkMmx1Wkc5M0xtbHVibVZ5VjJsa2RHZ2dQQ0E0TURBcElIdGNibHgwWEhSY2RDQWdKQ2duTG01aGRsOXNhVzVyTENBamFHVmhaR1Z5VTJoaGNHVXNJQ05tYjI5MFpYSXNJQzVqZFhOMGIyMHNJQzV0WVhKclpYSXNJQ056WldOMGFXOXVOU3dnTG5SbGVIUlhjbUZ3Y0dWeUp5a3VZV1JrUTJ4aGMzTW9KMnhoYm1SelkyRndaU2NwTzF4dVhIUmNkRngwZlNCbGJITmxJSHRjYmx4MFhIUmNkRngwSUNRb0p5NXVZWFpmYkdsdWF5d2dJMmhsWVdSbGNsTm9ZWEJsTENBalptOXZkR1Z5TENBdVkzVnpkRzl0TENBdWJXRnlhMlZ5TENBamMyVmpkR2x2YmpVc0lDNTBaWGgwVjNKaGNIQmxjaWNwTG5KbGJXOTJaVU5zWVhOektDZHNZVzVrYzJOaGNHVW5LVHRjYmx4MFhIUmNkSDFjYmx4dVhIUmNkRngwYVdZb0pDZ25JM05sWTNScGIyNHpMbUZqZEdsMlpTY3BMbXhsYm1kMGFDa2dleUF2THlCQlZWUlBUVUZVUlNCVVNFVWdVMHhKUkVWVElFOU9JRk5GUTFSSlQxQk9JRE1nUlZaRlVsa2dOeUJUUlVOUFRrUlRJRWxHSUZSSVJTQlRSVU5VU1U5T0lFbFRJRUZEVkVsV1JTNGdYRnhjWEZ4dVhIUmNkRngwWEhScFppaHpaV04wYVc5dU0wRjFkRzl0WVhSbFpDQWhQVDBnZEhKMVpTa2dlMXh1WEhSY2RGeDBYSFJjZEhObFkzUnBiMjR6UVhWMGIyMWhkR1ZrSUQwZ2RISjFaVHRjYmx4MFhIUmNkRngwWEhScGJuUmxjblpoYkUxaGJtRm5aWElvZEhKMVpTd2dKM05sWTNScGIyNHpKeXdnTnpBd01DazdYRzVjZEZ4MFhIUmNkSDFjYmx4MFhIUmNkSDBnWld4elpTQjdJQzh2SUZOVVQxQWdRVlZVVDAxQlZFVkVJRk5NU1VSRlV5QlBUaUJUUlVOVVNVOVFUaUF6SUVsR0lGUklSU0JUUlVOVVNVOU9JRWxUSUU1UFZDQkJRMVJKVmtVdUlGeGNYRnhjYmx4MFhIUmNkRngwYVdZb2MyVmpkR2x2YmpOQmRYUnZiV0YwWldRZ1BUMDlJSFJ5ZFdVcElIdGNibHgwWEhSY2RGeDBYSFJwYm5SbGNuWmhiRTFoYm1GblpYSW9abUZzYzJVc0lDZHpaV04wYVc5dU15Y3BPMXh1WEhSY2RGeDBYSFJjZEhObFkzUnBiMjR6UVhWMGIyMWhkR1ZrSUQwZ1ptRnNjMlU3WEc1Y2RGeDBYSFJjZEgxY2JseDBYSFJjZEgxY2JseHVYSFJjZEZ4MGFXWW9KQ2duSTNObFkzUnBiMjQwTG1GamRHbDJaU2NwTG14bGJtZDBhQ2tnZXlBdkx5QkJWVlJQVFVGVVJTQlVTRVVnVTB4SlJFVlRJRTlPSUZORlExUkpUMUJPSURRZ1JWWkZVbGtnTnlCVFJVTlBUa1JUSUVsR0lGUklSU0JUUlVOVVNVOU9JRWxUSUVGRFZFbFdSUzRnWEZ4Y1hGeHVYSFJjZEZ4MFhIUnBaaWh6WldOMGFXOXVORUYxZEc5dFlYUmxaQ0FoUFQwZ2RISjFaU2tnZTF4dVhIUmNkRngwWEhSY2RITmxZM1JwYjI0MFFYVjBiMjFoZEdWa0lEMGdkSEoxWlR0Y2JseDBYSFJjZEZ4MFhIUnBiblJsY25aaGJFMWhibUZuWlhJb2RISjFaU3dnSjNObFkzUnBiMjQwSnl3Z056QXdNQ2s3WEc1Y2RGeDBYSFJjZEgxY2JseDBYSFJjZEgwZ1pXeHpaU0I3SUM4dklGTlVUMUFnUVZWVVQwMUJWRVZFSUZOTVNVUkZVeUJQVGlCVFJVTlVTVTlRVGlBMElFbEdJRlJJUlNCVFJVTlVTVTlPSUVsVElFNVBWQ0JCUTFSSlZrVXVJRnhjWEZ4Y2JseDBYSFJjZEZ4MGFXWW9jMlZqZEdsdmJqUkJkWFJ2YldGMFpXUWdQVDA5SUhSeWRXVXBJSHRjYmx4MFhIUmNkRngwWEhScGJuUmxjblpoYkUxaGJtRm5aWElvWm1Gc2MyVXNJQ2R6WldOMGFXOXVOQ2NwTzF4dVhIUmNkRngwWEhSY2RITmxZM1JwYjI0MFFYVjBiMjFoZEdWa0lEMGdabUZzYzJVN1hHNWNkRngwWEhSY2RIMWNibHgwWEhSY2RIMWNibHgwWEhSOUxDQTFNREFwTzF4dVhIUjlYRzVjYmk4dklFTlBUbFJTVDB3Z1YwaEJWQ0JJUVZCUVJVNVRJRmRJUlU0Z1RFbE9TMU1nU1U0Z1ZFaEZJRTVCVmk5TlJVNVZJRUZTUlNCRFRFbERTMFZFSUZ4Y1hGeGNibHh1WEhRa0tDY3VibUYyWDJ4cGJtc25LUzVqYkdsamF5Z29aU2tnUFQ0Z2UxeHVYSFJjZEdOdmJuTjBJSEJoWjJWSlpIZ2dQU0J3WVhKelpVbHVkQ2drS0dVdWRHRnlaMlYwS1M1aGRIUnlLQ2RrWVhSaExXbHVaR1Y0SnlrcE8xeHVYSFJjZENRb0p5TnpZM0p2Ykd4bGNsZHlZWEJ3WlhJbktTNXRiM1psVkc4b2NHRm5aVWxrZUNrN1hHNWNkRngwSkNnbkkyMWxiblZDYkc5amEwOTFkQ2NwTG1Ga1pFTnNZWE56S0Nkb2FXUmtaVzRuS1R0Y2JseHVYSFJjZEdsbUtHSjFjbWRsY2k1amJHRnpjMHhwYzNRdVkyOXVkR0ZwYm5Nb0oySjFjbWRsY2kwdFlXTjBhWFpsSnlrcElIdGNiaUFnSUNBZ0lHNWhkaTVqYkdGemMweHBjM1F1Y21WdGIzWmxLQ2R1WVhaZmIzQmxiaWNwTzF4dUlDQWdJQ0FnWW5WeVoyVnlMbU5zWVhOelRHbHpkQzV5WlcxdmRtVW9KMkoxY21kbGNpMHRZV04wYVhabEp5azdYRzRnSUNBZ0lDQmtiMk4xYldWdWRDNWliMlI1TG5OMGVXeGxMbkJ2YzJsMGFXOXVJRDBnSjNKbGJHRjBhWFpsSnp0Y2JpQWdJQ0I5SUZ4dVhIUjlLVHRjYmx4dUx5OGdWMGhGVGlCVVNFVWdUa0ZXSUVsVElFOVFSVTRnVUZKRlZrVk9WQ0JWVTBWU0lFWlNUMDBnUWtWSlRrY2dRVUpNUlNCVVR5QkRURWxEU3lCQlRsbFVTRWxPUnlCRlRGTkZJRnhjWEZ4Y2JseHVYSFFrS0NjamJXVnVkVUpzYjJOclQzVjBKeWt1WTJ4cFkyc29LR1VwSUQwK0lIdGNibHgwSUNBZ1pTNXpkRzl3VUhKdmNHRm5ZWFJwYjI0b0tUdGNibHgwZlNrN1hHNWNibHgwZG1GeUlHSjFjbWRsY2lBOUlHUnZZM1Z0Wlc1MExtZGxkRVZzWlcxbGJuUkNlVWxrS0NkdFlXbHVMV0oxY21kbGNpY3BMQ0JjYmlBZ2JtRjJJRDBnWkc5amRXMWxiblF1WjJWMFJXeGxiV1Z1ZEVKNVNXUW9KMjFoYVc1T1lYWW5LVHRjYmx4dUx5OGdRMDlPVkZKUFRDQkdUMUlnVDFCRlRpQkJUa1FnUTB4UFUwbE9SeUJVU0VVZ1RVVk9WUzlPUVZZZ0lGeGNYRnhjYmx4dUlDQm1kVzVqZEdsdmJpQnVZWFpEYjI1MGNtOXNLQ2tnZTF4dVhHNGdJQ0FnYVdZb1luVnlaMlZ5TG1Oc1lYTnpUR2x6ZEM1amIyNTBZV2x1Y3lnblluVnlaMlZ5TFMxaFkzUnBkbVVuS1NrZ2UxeHVJQ0FnSUNBZ2JtRjJMbU5zWVhOelRHbHpkQzV5WlcxdmRtVW9KMjVoZGw5dmNHVnVKeWs3WEc0Z0lDQWdJQ0JpZFhKblpYSXVZMnhoYzNOTWFYTjBMbkpsYlc5MlpTZ25ZblZ5WjJWeUxTMWhZM1JwZG1VbktUdGNiaUFnSUNBZ0lDUW9KeU50Wlc1MVFteHZZMnRQZFhRbktTNWhaR1JEYkdGemN5Z25hR2xrWkdWdUp5azdYRzRnSUNBZ2ZTQmNiaUFnSUNCbGJITmxJSHRjYmlBZ0lDQWdJR0oxY21kbGNpNWpiR0Z6YzB4cGMzUXVZV1JrS0NkaWRYSm5aWEl0TFdGamRHbDJaU2NwTzF4dUlDQWdJQ0FnYm1GMkxtTnNZWE56VEdsemRDNWhaR1FvSjI1aGRsOXZjR1Z1SnlrN1hHNGdJQ0FnSUNBa0tDY2piV1Z1ZFVKc2IyTnJUM1YwSnlrdWNtVnRiM1psUTJ4aGMzTW9KMmhwWkdSbGJpY3BPMXh1SUNBZ0lIMWNiaUFnZlZ4dUlDQmNiaTh2SUU5T1RGa2dURWxUVkVWT0lFWlBVaUJOUlU1VklFTk1TVU5MVXlCWFNFVk9JRTVQVkNCSlRpQkRUVk1nVUZKRlZrbEZWeUJOVDBSRklGeGNYRnhjYmx4dUlDQnBaaWdoSkNoc2IyTmhkR2x2YmlrdVlYUjBjaWduYUhKbFppY3BMbWx1WTJ4MVpHVnpLQ2RwYm1SbGVDNXdhSEFuS1NrZ2UxeHVJQ0JjZEdKMWNtZGxjaTVoWkdSRmRtVnVkRXhwYzNSbGJtVnlLQ2RqYkdsamF5Y3NJRzVoZGtOdmJuUnliMndwTzF4dUlDQjlYRzVjYmk4dklFTk1UMU5GSUZSSVJTQk9RVllnU1VZZ1ZFaEZJRmRKVGtSUFZ5QkpVeUJQVmtWU0lERXdNREJRV0NCWFNVUkZJRnhjWEZ4Y2JseHVJQ0IzYVc1a2IzY3VZV1JrUlhabGJuUk1hWE4wWlc1bGNpZ25jbVZ6YVhwbEp5d2dablZ1WTNScGIyNG9LU0I3WEc0Z0lDQWdhV1lvZDJsdVpHOTNMbWx1Ym1WeVYybGtkR2dnUGlBeE1EQXdJQ1ltSUc1aGRpNWpiR0Z6YzB4cGMzUXVZMjl1ZEdGcGJuTW9KMjVoZGw5dmNHVnVKeWtwSUh0Y2JpQWdJQ0FnSUc1aGRrTnZiblJ5YjJ3b0tUdGNiaUFnSUNBZ0lHNWhkaTVqYkdGemMweHBjM1F1Y21WdGIzWmxLQ2R1WVhaZmIzQmxiaWNwTzF4dUlDQWdJQ0FnSUNRb0p5TnRaVzUxUW14dlkydFBkWFFuS1M1aFpHUkRiR0Z6Y3lnbmFHbGtaR1Z1SnlrN1hHNGdJQ0FnZlZ4dUlDQjlLVHRjYmx4dUx5OGdWRWhKVXlCVFJWUWdUMFlnU1VZZ1UxUkJWRVZOUlU1VVV5QkpUa2xVU1VGTVNWTkZVeUJVU0VVZ1UxQkZVMGxHU1VNZ1VFRkhSVk1nUms5U0lGQlNSVlpKUlZkSlRrY2dTVTRnUTAxVElFRkVUVWxPTGlCY1hGeGNYRzVjYmlBZ2FXWW9KQ2hzYjJOaGRHbHZiaWt1WVhSMGNpZ25hSEpsWmljcExtbHVZMngxWkdWektDZHBibVJsZUM1d2FIQW5LU2tnZTF4dVhIUmNkR2xtS0NRb2JHOWpZWFJwYjI0cExtRjBkSElvSjJoeVpXWW5LUzVwYm1Oc2RXUmxjeWduYVcxaFoybHVaUzFwWmljcEtTQjdYRzVjZEZ4MFhIUndZV2RsVEc5aFpHVnlLRFFwTzF4dVhIUmNkSDFjYmx4MFhIUnBaaWdrS0d4dlkyRjBhVzl1S1M1aGRIUnlLQ2RvY21WbUp5a3VhVzVqYkhWa1pYTW9KMmh2ZHkxM1pTMXBibTV2ZG1GMFpTY3BLU0I3WEc1Y2RGeDBYSFJ3WVdkbFRHOWhaR1Z5S0RNcE8xeHVYSFJjZEgxY2JseDBYSFJwWmlna0tHeHZZMkYwYVc5dUtTNWhkSFJ5S0Nkb2NtVm1KeWt1YVc1amJIVmtaWE1vSjNkdmNtc3RkMmwwYUMxMWN5Y3BLU0I3WEc1Y2RGeDBYSFJ3WVdkbFRHOWhaR1Z5S0RVcE8xeHVYSFJjZEgxY2JseDBYSFJwWmlna0tHeHZZMkYwYVc5dUtTNWhkSFJ5S0Nkb2NtVm1KeWt1YVc1amJIVmtaWE1vSjJOdmJuUmhZM1F0ZFhNbktTa2dlMXh1WEhSY2RGeDBjR0ZuWlV4dllXUmxjaWcyS1R0Y2JseDBYSFI5WEc1Y2RGeDBhV1lvSkNoc2IyTmhkR2x2YmlrdVlYUjBjaWduYUhKbFppY3BMbWx1WTJ4MVpHVnpLQ2RvYjIxbExYWnBaR1Z2SnlrcElIdGNibHgwWEhSY2RITmxkRWx1ZEdWeWRtRnNLQ2dwSUQwK0lIdGNibHgwWEhSY2RGeDBhR2xrWlV4dllXUnBibWRCYm1sdFlYUnBiMjRvS1R0Y2JseDBYSFJjZEgwc0lEVXdNQ2xjYmx4MFhIUjlYRzVjZEgxY2JseHVMeThnVTFkSlVFVWdSVlpGVGxSVElFUkZWRVZEVkU5U0lFWlZUa05VU1U5T0lGeGNYRnhjYmx4dUlDQm1kVzVqZEdsdmJpQmtaWFJsWTNSemQybHdaU2hsYkN3Z1puVnVZeWtnZTF4dVhIUWdJR3hsZENCemQybHdaVjlrWlhRZ1BTQjdmVHRjYmx4MElDQnpkMmx3WlY5a1pYUXVjMWdnUFNBd095QnpkMmx3WlY5a1pYUXVjMWtnUFNBd095QnpkMmx3WlY5a1pYUXVaVmdnUFNBd095QnpkMmx3WlY5a1pYUXVaVmtnUFNBd08xeHVYSFFnSUhaaGNpQnRhVzVmZUNBOUlETXdPeUFnTHk5dGFXNGdlQ0J6ZDJsd1pTQm1iM0lnYUc5eWFYcHZiblJoYkNCemQybHdaVnh1WEhRZ0lIWmhjaUJ0WVhoZmVDQTlJRE13T3lBZ0x5OXRZWGdnZUNCa2FXWm1aWEpsYm1ObElHWnZjaUIyWlhKMGFXTmhiQ0J6ZDJsd1pWeHVYSFFnSUhaaGNpQnRhVzVmZVNBOUlEVXdPeUFnTHk5dGFXNGdlU0J6ZDJsd1pTQm1iM0lnZG1WeWRHbGpZV3dnYzNkcGNHVmNibHgwSUNCMllYSWdiV0Y0WDNrZ1BTQTJNRHNnSUM4dmJXRjRJSGtnWkdsbVptVnlaVzVqWlNCbWIzSWdhRzl5YVhwdmJuUmhiQ0J6ZDJsd1pWeHVYSFFnSUhaaGNpQmthWEpsWXlBOUlGd2lYQ0k3WEc1Y2RDQWdiR1YwSUdWc1pTQTlJR1J2WTNWdFpXNTBMbWRsZEVWc1pXMWxiblJDZVVsa0tHVnNLVHRjYmx4MElDQmxiR1V1WVdSa1JYWmxiblJNYVhOMFpXNWxjaWduZEc5MVkyaHpkR0Z5ZENjc1puVnVZM1JwYjI0b1pTbDdYRzVjZENBZ0lDQjJZWElnZENBOUlHVXVkRzkxWTJobGMxc3dYVHRjYmx4MElDQWdJSE4zYVhCbFgyUmxkQzV6V0NBOUlIUXVjMk55WldWdVdEc2dYRzVjZENBZ0lDQnpkMmx3WlY5a1pYUXVjMWtnUFNCMExuTmpjbVZsYmxrN1hHNWNkQ0FnZlN4bVlXeHpaU2s3WEc1Y2RDQWdaV3hsTG1Ga1pFVjJaVzUwVEdsemRHVnVaWElvSjNSdmRXTm9iVzkyWlNjc1puVnVZM1JwYjI0b1pTbDdYRzVjZENBZ0lDQmxMbkJ5WlhabGJuUkVaV1poZFd4MEtDazdYRzVjZENBZ0lDQjJZWElnZENBOUlHVXVkRzkxWTJobGMxc3dYVHRjYmx4MElDQWdJSE4zYVhCbFgyUmxkQzVsV0NBOUlIUXVjMk55WldWdVdEc2dYRzVjZENBZ0lDQnpkMmx3WlY5a1pYUXVaVmtnUFNCMExuTmpjbVZsYmxrN0lDQWdJRnh1WEhRZ0lIMHNabUZzYzJVcE8xeHVYSFFnSUdWc1pTNWhaR1JGZG1WdWRFeHBjM1JsYm1WeUtDZDBiM1ZqYUdWdVpDY3NablZ1WTNScGIyNG9aU2w3WEc1Y2RDQWdJQ0F2TDJodmNtbDZiMjUwWVd3Z1pHVjBaV04wYVc5dVhHNWNkQ0FnSUNCcFppQW9LQ2dvYzNkcGNHVmZaR1YwTG1WWUlDMGdiV2x1WDNnZ1BpQnpkMmx3WlY5a1pYUXVjMWdwSUh4OElDaHpkMmx3WlY5a1pYUXVaVmdnS3lCdGFXNWZlQ0E4SUhOM2FYQmxYMlJsZEM1eldDa3BJQ1ltSUNnb2MzZHBjR1ZmWkdWMExtVlpJRHdnYzNkcGNHVmZaR1YwTG5OWklDc2diV0Y0WDNrcElDWW1JQ2h6ZDJsd1pWOWtaWFF1YzFrZ1BpQnpkMmx3WlY5a1pYUXVaVmtnTFNCdFlYaGZlU2tnSmlZZ0tITjNhWEJsWDJSbGRDNWxXQ0ErSURBcEtTa3BJSHRjYmx4MElDQWdJQ0FnYVdZb2MzZHBjR1ZmWkdWMExtVllJRDRnYzNkcGNHVmZaR1YwTG5OWUtTQmthWEpsWXlBOUlGd2ljbHdpTzF4dVhIUWdJQ0FnSUNCbGJITmxJR1JwY21WaklEMGdYQ0pzWENJN1hHNWNkQ0FnSUNCOVhHNWNkQ0FnSUNBdkwzWmxjblJwWTJGc0lHUmxkR1ZqZEdsdmJseHVYSFFnSUNBZ1pXeHpaU0JwWmlBb0tDZ29jM2RwY0dWZlpHVjBMbVZaSUMwZ2JXbHVYM2tnUGlCemQybHdaVjlrWlhRdWMxa3BJSHg4SUNoemQybHdaVjlrWlhRdVpWa2dLeUJ0YVc1ZmVTQThJSE4zYVhCbFgyUmxkQzV6V1NrcElDWW1JQ2dvYzNkcGNHVmZaR1YwTG1WWUlEd2djM2RwY0dWZlpHVjBMbk5ZSUNzZ2JXRjRYM2dwSUNZbUlDaHpkMmx3WlY5a1pYUXVjMWdnUGlCemQybHdaVjlrWlhRdVpWZ2dMU0J0WVhoZmVDa2dKaVlnS0hOM2FYQmxYMlJsZEM1bFdTQStJREFwS1NrcElIdGNibHgwSUNBZ0lDQWdhV1lvYzNkcGNHVmZaR1YwTG1WWklENGdjM2RwY0dWZlpHVjBMbk5aS1NCa2FYSmxZeUE5SUZ3aVpGd2lPMXh1WEhRZ0lDQWdJQ0JsYkhObElHUnBjbVZqSUQwZ1hDSjFYQ0k3WEc1Y2RDQWdJQ0I5WEc1Y2JseDBJQ0FnSUdsbUlDaGthWEpsWXlBaFBTQmNJbHdpS1NCN1hHNWNkQ0FnSUNBZ0lHbG1LSFI1Y0dWdlppQm1kVzVqSUQwOUlDZG1kVzVqZEdsdmJpY3BJR1oxYm1Nb1pXd3NaR2x5WldNcE8xeHVYSFFnSUNBZ2ZWeHVYSFFnSUNBZ2JHVjBJR1JwY21WaklEMGdYQ0pjSWp0Y2JseDBJQ0FnSUhOM2FYQmxYMlJsZEM1eldDQTlJREE3SUhOM2FYQmxYMlJsZEM1eldTQTlJREE3SUhOM2FYQmxYMlJsZEM1bFdDQTlJREE3SUhOM2FYQmxYMlJsZEM1bFdTQTlJREE3WEc1Y2RDQWdmU3htWVd4elpTazdJQ0JjYmx4MGZWeHVYRzR2THlCRFNFOVRSU0JVU0VVZ1RrVllWQ0JUVEVsRVJTQlVUeUJUU0U5WElFRk9SQ0JEVEVsRFN5QlVTRVVnVUVGSFNVNUJWRWxQVGlCQ1ZWUlVUMDRnVkVoQlZDQlNSVXhCVkVWVElGUlBJRWxVTGlCY1hGeGNYRzVjYmx4MFkyOXVjM1FnYzNkcGNHVkRiMjUwY205c2JHVnlJRDBnS0dWc0xDQmtLU0E5UGlCN1hHNWNibHgwWEhScFppaGxiQ0E5UFQwZ0ozTmxZM1JwYjI0MEp5a2dlMXh1WEc1Y2RGeDBYSFJqYjI1emRDQnpaV04wYVc5dU5GQmhaMmx1WVhScGIyNU1aVzVuZEdnZ1BTQWtLQ2N1YzJWamRHbHZialJRWVdkcGJtRjBiM0pDZFhSMGIyNG5LUzVzWlc1bmRHZzdYRzVjYmx4MFhIUmNkR2xtS0dRZ1BUMDlJQ2RzSnlrZ2UxeHVYRzVjZEZ4MFhIUmNkR2xtS0hObFkzUnBiMjQwU1dSNElEd2djMlZqZEdsdmJqUlFZV2RwYm1GMGFXOXVUR1Z1WjNSb0lDMGdNU2tnZTF4dVhIUmNkRngwWEhSY2RITmxZM1JwYjI0MFNXUjRLeXM3WEc1Y2RGeDBYSFJjZEgwZ1pXeHpaU0I3WEc1Y2RGeDBYSFJjZEZ4MGMyVmpkR2x2YmpSSlpIZ2dQU0F3TzF4dVhIUmNkRngwWEhSOVhHNWNkRngwWEhSY2RGeHVYSFJjZEZ4MFhIUWtLQ2N1YzJWamRHbHZialJRWVdkcGJtRjBiM0pDZFhSMGIyNG5LVnR6WldOMGFXOXVORWxrZUYwdVkyeHBZMnNvS1R0Y2JseDBYSFJjZEgxY2JseDBYSFJjZEdsbUtHUWdQVDA5SUNkeUp5a2dlMXh1WEc1Y2RGeDBYSFJjZEdsbUtITmxZM1JwYjI0MFNXUjRJRDRnTUNrZ2UxeHVYSFJjZEZ4MFhIUmNkSE5sWTNScGIyNDBTV1I0TFMwN1hHNWNkRngwWEhSY2RIMGdaV3h6WlNCN1hHNWNkRngwWEhSY2RGeDBjMlZqZEdsdmJqUkpaSGdnUFNCelpXTjBhVzl1TkZCaFoybHVZWFJwYjI1TVpXNW5kR2dnTFNBeE8xeHVYSFJjZEZ4MFhIUjlYRzVjYmx4MFhIUmNkRngwSkNnbkxuTmxZM1JwYjI0MFVHRm5hVzVoZEc5eVFuVjBkRzl1SnlsYmMyVmpkR2x2YmpSSlpIaGRMbU5zYVdOcktDazdYRzVjZEZ4MFhIUjlYRzVjZEZ4MGZWeHVYSFJjZEdsbUtHVnNJRDA5UFNBbmMyVmpkR2x2YmpNbktTQjdYRzVjYmx4MFhIUmNkR052Ym5OMElITmxZM1JwYjI0elVHRm5hVzVoZEdsdmJreGxibWQwYUNBOUlDUW9KeTV6WldOMGFXOXVNMUJoWjJsdVlYUnZja0oxZEhSdmJpY3BMbXhsYm1kMGFEdGNibHh1WEhSY2RGeDBhV1lvWkNBOVBUMGdKMnduS1NCN1hHNWNibHgwWEhSY2RGeDBhV1lvYzJWamRHbHZiak5KWkhnZ1BDQnpaV04wYVc5dU0xQmhaMmx1WVhScGIyNU1aVzVuZEdnZ0xTQXhLU0I3WEc1Y2RGeDBYSFJjZEZ4MGMyVmpkR2x2YmpOSlpIZ3JLenRjYmx4MFhIUmNkRngwZlNCbGJITmxJSHRjYmx4MFhIUmNkRngwWEhSelpXTjBhVzl1TTBsa2VDQTlJREE3WEc1Y2RGeDBYSFJjZEgxY2JseDBYSFJjZEZ4MFhHNWNkRngwWEhSY2RDUW9KeTV6WldOMGFXOXVNMUJoWjJsdVlYUnZja0oxZEhSdmJpY3BXM05sWTNScGIyNHpTV1I0WFM1amJHbGpheWdwTzF4dVhIUmNkRngwZlZ4dVhIUmNkRngwYVdZb1pDQTlQVDBnSjNJbktTQjdYRzVjYmx4MFhIUmNkRngwYVdZb2MyVmpkR2x2YmpOSlpIZ2dQaUF3S1NCN1hHNWNkRngwWEhSY2RGeDBjMlZqZEdsdmJqTkpaSGd0TFR0Y2JseDBYSFJjZEZ4MGZTQmxiSE5sSUh0Y2JseDBYSFJjZEZ4MFhIUnpaV04wYVc5dU0wbGtlQ0E5SUhObFkzUnBiMjR6VUdGbmFXNWhkR2x2Ymt4bGJtZDBhQ0F0SURFN1hHNWNkRngwWEhSY2RIMWNibHgwWEhSY2RGeDBYRzVjZEZ4MFhIUmNkQ1FvSnk1elpXTjBhVzl1TTFCaFoybHVZWFJ2Y2tKMWRIUnZiaWNwVzNObFkzUnBiMjR6U1dSNFhTNWpiR2xqYXlncE8xeHVYSFJjZEZ4MGZWeHVYSFJjZEgxY2JseDBmVnh1WEc0dkx5QkpUa2xVU1VGVVJTQkdUMUlnVTFkSlVFVWdSRVZVUlVOVVNVOU9JRTlPSUZORlExUkpUMDVUSURNZ1FVNUVJRFFnUlZoRFJWQlVJRWxPSUVGRVRVbE9JRkJTUlZaSlJWY3VJRnhjWEZ4Y2JseHVYSFJwWmlnaEpDaHNiMk5oZEdsdmJpa3VZWFIwY2lnbmFISmxaaWNwTG1sdVkyeDFaR1Z6S0NkcGJtUmxlQzV3YUhBbktTa2dlMXh1WEhSY2RHUmxkR1ZqZEhOM2FYQmxLQ2R6WldOMGFXOXVOQ2NzSUhOM2FYQmxRMjl1ZEhKdmJHeGxjaWs3WEc1Y2RGeDBaR1YwWldOMGMzZHBjR1VvSjNObFkzUnBiMjR6Snl3Z2MzZHBjR1ZEYjI1MGNtOXNiR1Z5S1R0Y2JseDBmVnh1ZlNrN0lsMTlcbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiZnNvdno2XCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvZmFrZV84MzAwZmQ5MS5qc1wiLFwiL1wiKSJdfQ==
