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

}).call(this,require("FT5ORs"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../node_modules/base64-js/lib/b64.js","/../../../node_modules/base64-js/lib")
},{"FT5ORs":4,"buffer":2}],2:[function(require,module,exports){
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

}).call(this,require("FT5ORs"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../node_modules/buffer/index.js","/../../../node_modules/buffer")
},{"FT5ORs":4,"base64-js":1,"buffer":2,"ieee754":3}],3:[function(require,module,exports){
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

}).call(this,require("FT5ORs"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../node_modules/ieee754/index.js","/../../../node_modules/ieee754")
},{"FT5ORs":4,"buffer":2}],4:[function(require,module,exports){
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

}).call(this,require("FT5ORs"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../node_modules/process/browser.js","/../../../node_modules/process")
},{"FT5ORs":4,"buffer":2}],5:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var time = 750;
var section3Idx = 0;
var section4Idx = 0;

var masterObj = {
	section2CurrentIdx: 0,
	section1CurrentIdx: 0,
	section3: {
		automate: '',
		isAutomated: false
	},
	section4: {
		automate: '',
		isAutomated: false
	},
	basketball: { loopAmount: 1 },
	football: { loopAmount: 1 },
	tennis: { loopAmount: 1 },
	baseball: { loopAmount: 1 },
	fan: { loopAmount: 1 }
};

var homepageMobImages = ['assets/images/homepageMob/basketball.jpg', 'assets/images/homepageMob/football.jpg', 'assets/images/homepageMob/tennis.jpg', 'assets/images/homepageMob/baseball.jpg', 'assets/images/homepageMob/fan.jpg'];

$(document).ready(function () {
	if (window.innerWidth < 800) {
		// IF THE WINDOW IS SMALLER THAT 800PX FETCH THE JSON FOR THE ICON ANIMATION AND ATACH THE ANIMATIONS SEPERATELY TO masterObj \\
		fetch('assets/js/Fantastec_Sprite_Sheet.json').then(function (response) {
			return response.json();
		}).then(function (spriteObj) {
			var IdleFrame = filterByValue(spriteObj.frames, 'idle');
			masterObj.football.animationArray = [].concat(_toConsumableArray(IdleFrame), _toConsumableArray(filterByValue(spriteObj.frames, 'football')));
			masterObj.tennis.animationArray = [].concat(_toConsumableArray(IdleFrame), _toConsumableArray(filterByValue(spriteObj.frames, 'tennis')));
			masterObj.baseball.animationArray = [].concat(_toConsumableArray(IdleFrame), _toConsumableArray(filterByValue(spriteObj.frames, 'baseball')));
			masterObj.basketball.animationArray = [].concat(_toConsumableArray(IdleFrame), _toConsumableArray(filterByValue(spriteObj.frames, 'basket')));
			masterObj.fan.animationArray = [].concat(_toConsumableArray(IdleFrame), _toConsumableArray(filterByValue(spriteObj.frames, 'fan')));
			// CALL ANIMATOR SETUP FUNCTION AND START THE IMAGE SLIDESHOW FOR SECTION 1 (HOMEPAGE) \\			
			animatorSetup();
			imageControler(masterObj, 1);
			// CALL THE imageControler FUNCTION EVERY 5 SECONDS TO CHANGE THE IMAGE FOR SECTION 1 (HOMEPAGE) \\
			setInterval(function () {
				imageControler(masterObj, 1);
			}, 5000);
		});
	}
	// FUNCTION TO SEPERATE THE ANIMATION FRAMES BY NAME \\
	var filterByValue = function filterByValue(array, string) {
		return array.filter(function (o) {
			return typeof o['filename'] === 'string' && o['filename'].toLowerCase().includes(string.toLowerCase());
		});
	};
	// GENERIC SETUP FUNCTION FOR ADDING VENDOR PREFIXES TO requestAnimationFrame \\
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
		// FUNCTION TO PASS TO requestAnimationFrame \\
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

	// CALL initializeSection ON SECTIONS 1, 3 AND 4. \\
	initializeSection(1, 0);
	initializeSection(3, 0);
	initializeSection(4, 0);

	// BACKGROUND IMAGE TRANSITION HANDLER. \\

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
	// START SLIDESHOW ON SECTION 2 \\
	imageControler(masterObj, 2);

	// CHANGE SECTION 2 BACKGROUND IMAGE EVERY 15 SECONDS \\
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

		if (masterObj[$(e.currentTarget).closest('section').attr('id')].isAutomated) {
			// IF THERE IS A RINNING INTERVAL ON THE RELEVANT SECTION CLEAR IT \\
			intervalManager(false, $(e.currentTarget).closest('section').attr('id'));
			// SET A NEW INTERVAL OF 7 SECONDS ON THE SECTION \\
			intervalManager(true, $(e.currentTarget).closest('section').attr('id'), 7000);
		}
		// CALL THE CLICK HANDLER FUNCTION AND PASS IT THE EVENT IF TARGET IS NOT ALREADY ACTIVE \\
		if (!$(e.currentTarget).hasClass('active')) {
			handlePaninationButtonClick(e);
		}
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
			// MOVE TO TOP OF PAGE IF CURRENTLY AT BOTTOM \\
			$('#scrollerWrapper').moveTo(1);
		} else {
			$('#scrollerWrapper').moveDown();
		}
	});

	// HIDE THE LOADING ANIMATIOPN WHEN VIDEO IS READY TO PLAY ON DESXKTOP. \\

	var hideLoadingAnimation = function hideLoadingAnimation() {
		if (window.innerWidth > 800 && !$('#loading').hasClass('hidden')) {

			if ($('#video').get(0).readyState === 4) {
				$('#loading').addClass('hidden');
			}
		}
	};

	// MANAGEMENT FUNCTION FOR SETTING AND CLEARING THE SLIDE AUTOMATION INTERVALS. \\

	var intervalManager = function intervalManager(flag, sectionId, time) {
		if (flag) {
			masterObj[sectionId].automate = setInterval(function () {
				swipeController(sectionId, 'l');
			}, time);
		} else {
			clearInterval(masterObj[sectionId].automate);
		}
	};

	// IF NOT IN CMS ADMIN PREVIEW, PERPETUALLY CHECK IF WE ARE AT THE TOP OF THE PAGE AND IF SO, DONT SHOW THE FOOTER OR GREEN SHAPE. \\

	if (!$(location).attr('href').includes('index.php')) {
		setInterval(function () {
			if ($('#scrollerWrapper').offset().top >= -(window.innerHeight / 1.9)) {
				$('#headerShape, #footer').addClass('moveOffScreen');
				$('#video').get(0).play();
				$('.arrow').addClass('pulsate');
			} else {
				$('#headerShape, #footer').removeClass('moveOffScreen');
				$('#video').get(0).pause();
				$('.arrow').removeClass('pulsate');
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
				if (masterObj.section3.isAutomated !== true) {
					masterObj.section3.isAutomated = true;
					intervalManager(true, 'section3', 7000);
				}
			} else {
				// STOP AUTOMATED SLIDES ON SECTIOPN 3 IF THE SECTION IS NOT ACTIVE. \\
				if (masterObj.section3.isAutomated === true) {
					intervalManager(false, 'section3');
					masterObj.section3.isAutomated = false;
				}
			}

			if ($('#section4.active').length) {
				// AUTOMATE THE SLIDES ON SECTIOPN 4 EVERY 7 SECONDS IF THE SECTION IS ACTIVE. \\
				if (masterObj.section4.isAutomated !== true) {
					masterObj.section4.isAutomated = true;
					intervalManager(true, 'section4', 7000);
				}
			} else {
				// STOP AUTOMATED SLIDES ON SECTIOPN 4 IF THE SECTION IS NOT ACTIVE. \\
				if (masterObj.section4.isAutomated === true) {
					intervalManager(false, 'section4');
					masterObj.section4.isAutomated = false;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZha2VfNGIxN2NmYTYuanMiXSwibmFtZXMiOlsidGltZSIsInNlY3Rpb24zSWR4Iiwic2VjdGlvbjRJZHgiLCJtYXN0ZXJPYmoiLCJzZWN0aW9uMkN1cnJlbnRJZHgiLCJzZWN0aW9uMUN1cnJlbnRJZHgiLCJzZWN0aW9uMyIsImF1dG9tYXRlIiwiaXNBdXRvbWF0ZWQiLCJzZWN0aW9uNCIsImJhc2tldGJhbGwiLCJsb29wQW1vdW50IiwiZm9vdGJhbGwiLCJ0ZW5uaXMiLCJiYXNlYmFsbCIsImZhbiIsImhvbWVwYWdlTW9iSW1hZ2VzIiwiJCIsImRvY3VtZW50IiwicmVhZHkiLCJ3aW5kb3ciLCJpbm5lcldpZHRoIiwiZmV0Y2giLCJ0aGVuIiwicmVzcG9uc2UiLCJqc29uIiwic3ByaXRlT2JqIiwiSWRsZUZyYW1lIiwiZmlsdGVyQnlWYWx1ZSIsImZyYW1lcyIsImFuaW1hdGlvbkFycmF5IiwiYW5pbWF0b3JTZXR1cCIsImltYWdlQ29udHJvbGVyIiwic2V0SW50ZXJ2YWwiLCJhcnJheSIsInN0cmluZyIsImZpbHRlciIsIm8iLCJ0b0xvd2VyQ2FzZSIsImluY2x1ZGVzIiwibGFzdFRpbWUiLCJ2ZW5kb3JzIiwieCIsImxlbmd0aCIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwiY2FsbGJhY2siLCJlbGVtZW50IiwiY3VyclRpbWUiLCJEYXRlIiwiZ2V0VGltZSIsInRpbWVUb0NhbGwiLCJNYXRoIiwibWF4IiwiaWQiLCJzZXRUaW1lb3V0IiwiY2xlYXJUaW1lb3V0IiwiYW5pbWF0b3IiLCJhbmltYXRpb25PYmoiLCJkYW5jaW5nSWNvbiIsInNwcml0ZUltYWdlIiwiY2FudmFzIiwiZ2FtZUxvb3AiLCJhZGRDbGFzcyIsImxvb3BJZCIsInVwZGF0ZSIsInJlbmRlciIsInNwcml0ZSIsIm9wdGlvbnMiLCJ0aGF0IiwiZnJhbWVJbmRleCIsInRpY2tDb3VudCIsImxvb3BDb3VudCIsInRpY2tzUGVyRnJhbWUiLCJudW1iZXJPZkZyYW1lcyIsImNvbnRleHQiLCJ3aWR0aCIsImhlaWdodCIsImltYWdlIiwibG9vcHMiLCJjbGVhclJlY3QiLCJkcmF3SW1hZ2UiLCJmcmFtZSIsInkiLCJnZXRFbGVtZW50QnlJZCIsIkltYWdlIiwiZ2V0Q29udGV4dCIsImFkZEV2ZW50TGlzdGVuZXIiLCJzcmMiLCJwYWdlTG9hZGVyIiwiaW5kZXgiLCJyZW1vdmVDbGFzcyIsImZpbmQiLCJnZXQiLCJjbGljayIsImluaXRpYWxpemVTZWN0aW9uIiwic2VjdGlvbk51bWJlciIsImlkeCIsInNpYmxpbmdzIiwibWFwIiwiaXgiLCJlbGUiLCJjc3MiLCJvcGFjaXR5IiwiaWR4T2JqIiwicmVsZXZhbnRBbmltYXRpb24iLCJoYW5kbGVQYW5pbmF0aW9uQnV0dG9uQ2xpY2siLCJlIiwicGFyc2VJbnQiLCJ0YXJnZXQiLCJhdHRyIiwic2VjdGlvbklkIiwiY2xvc2VzdCIsInJlbGV2YW50RGF0YUFycmF5Iiwib24iLCJlcyIsImN1cnJlbnRUYXJnZXQiLCJpbnRlcnZhbE1hbmFnZXIiLCJoYXNDbGFzcyIsImxvY2F0aW9uIiwib25lcGFnZV9zY3JvbGwiLCJzZWN0aW9uQ29udGFpbmVyIiwiZWFzaW5nIiwiYW5pbWF0aW9uVGltZSIsInBhZ2luYXRpb24iLCJ1cGRhdGVVUkwiLCJiZWZvcmVNb3ZlIiwiYWZ0ZXJNb3ZlIiwibG9vcCIsImtleWJvYXJkIiwicmVzcG9uc2l2ZUZhbGxiYWNrIiwiZGlyZWN0aW9uIiwibW92ZVRvIiwiY3VycmVudFNlY3Rpb24iLCJzZWN0aW9uIiwib2Zmc2V0IiwidG9wIiwibW92ZURvd24iLCJoaWRlTG9hZGluZ0FuaW1hdGlvbiIsInJlYWR5U3RhdGUiLCJmbGFnIiwic3dpcGVDb250cm9sbGVyIiwiY2xlYXJJbnRlcnZhbCIsImlubmVySGVpZ2h0IiwicGxheSIsInBhdXNlIiwibWF0Y2hNZWRpYSIsIm1hdGNoZXMiLCJwYWdlSWR4IiwiYnVyZ2VyIiwiY2xhc3NMaXN0IiwiY29udGFpbnMiLCJuYXYiLCJyZW1vdmUiLCJib2R5Iiwic3R5bGUiLCJwb3NpdGlvbiIsInN0b3BQcm9wYWdhdGlvbiIsIm5hdkNvbnRyb2wiLCJhZGQiLCJkZXRlY3Rzd2lwZSIsImVsIiwiZnVuYyIsInN3aXBlX2RldCIsInNYIiwic1kiLCJlWCIsImVZIiwibWluX3giLCJtYXhfeCIsIm1pbl95IiwibWF4X3kiLCJkaXJlYyIsInQiLCJ0b3VjaGVzIiwic2NyZWVuWCIsInNjcmVlblkiLCJwcmV2ZW50RGVmYXVsdCIsImQiLCJzZWN0aW9uNFBhZ2luYXRpb25MZW5ndGgiLCJzZWN0aW9uM1BhZ2luYXRpb25MZW5ndGgiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxJQUFNQSxPQUFPLEdBQWI7QUFDQSxJQUFJQyxjQUFjLENBQWxCO0FBQ0EsSUFBSUMsY0FBYyxDQUFsQjs7QUFFQSxJQUFNQyxZQUFZO0FBQ2pCQyxxQkFBb0IsQ0FESDtBQUVqQkMscUJBQW9CLENBRkg7QUFHakJDLFdBQVU7QUFDVEMsWUFBVSxFQUREO0FBRVRDLGVBQWE7QUFGSixFQUhPO0FBT2pCQyxXQUFVO0FBQ1RGLFlBQVUsRUFERDtBQUVUQyxlQUFhO0FBRkosRUFQTztBQVdqQkUsYUFBWSxFQUFDQyxZQUFZLENBQWIsRUFYSztBQVlqQkMsV0FBVSxFQUFDRCxZQUFZLENBQWIsRUFaTztBQWFqQkUsU0FBUSxFQUFDRixZQUFZLENBQWIsRUFiUztBQWNqQkcsV0FBVSxFQUFDSCxZQUFZLENBQWIsRUFkTztBQWVqQkksTUFBSyxFQUFDSixZQUFZLENBQWI7QUFmWSxDQUFsQjs7QUFrQkEsSUFBTUssb0JBQW9CLENBQ3pCLDBDQUR5QixFQUV6Qix3Q0FGeUIsRUFHekIsc0NBSHlCLEVBSXpCLHdDQUp5QixFQUt6QixtQ0FMeUIsQ0FBMUI7O0FBUUFDLEVBQUVDLFFBQUYsRUFBWUMsS0FBWixDQUFrQixZQUFNO0FBQ3ZCLEtBQUdDLE9BQU9DLFVBQVAsR0FBb0IsR0FBdkIsRUFBNEI7QUFDN0I7QUFDRUMsUUFBTSx1Q0FBTixFQUErQ0MsSUFBL0MsQ0FBb0QsVUFB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QUViLFFBQUdoTCxjQUFjLENBQWpCLEVBQW9CO0FBQ25CQTtBQUNBLEtBRkQsTUFFTztBQUNOQSxtQkFBY2lMLDJCQUEyQixDQUF6QztBQUNBOztBQUVEbEssTUFBRSwwQkFBRixFQUE4QmYsV0FBOUIsRUFBMkM0RixLQUEzQztBQUNBO0FBQ0Q7QUFDRCxNQUFHbUUsT0FBTyxVQUFWLEVBQXNCOztBQUVyQixPQUFNbUIsMkJBQTJCbkssRUFBRSwwQkFBRixFQUE4QjBCLE1BQS9EOztBQUVBLE9BQUd1SSxNQUFNLEdBQVQsRUFBYzs7QUFFYixRQUFHakwsY0FBY21MLDJCQUEyQixDQUE1QyxFQUErQztBQUM5Q25MO0FBQ0EsS0FGRCxNQUVPO0FBQ05BLG1CQUFjLENBQWQ7QUFDQTs7QUFFRGdCLE1BQUUsMEJBQUYsRUFBOEJoQixXQUE5QixFQUEyQzZGLEtBQTNDO0FBQ0E7QUFDRCxPQUFHb0YsTUFBTSxHQUFULEVBQWM7O0FBRWIsUUFBR2pMLGNBQWMsQ0FBakIsRUFBb0I7QUFDbkJBO0FBQ0EsS0FGRCxNQUVPO0FBQ05BLG1CQUFjbUwsMkJBQTJCLENBQXpDO0FBQ0E7O0FBRURuSyxNQUFFLDBCQUFGLEVBQThCaEIsV0FBOUIsRUFBMkM2RixLQUEzQztBQUNBO0FBQ0Q7QUFDRCxFQXBERDs7QUFzREQ7O0FBRUMsS0FBRyxDQUFDN0UsRUFBRXNHLFFBQUYsRUFBWVQsSUFBWixDQUFpQixNQUFqQixFQUF5QnZFLFFBQXpCLENBQWtDLFdBQWxDLENBQUosRUFBb0Q7QUFDbkR5SCxjQUFZLFVBQVosRUFBd0JuQixlQUF4QjtBQUNBbUIsY0FBWSxVQUFaLEVBQXdCbkIsZUFBeEI7QUFDQTtBQUNELENBM21CRCIsImZpbGUiOiJmYWtlXzRiMTdjZmE2LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgdGltZSA9IDc1MDtcbmxldCBzZWN0aW9uM0lkeCA9IDA7XG5sZXQgc2VjdGlvbjRJZHggPSAwO1xuXG5jb25zdCBtYXN0ZXJPYmogPSB7XG5cdHNlY3Rpb24yQ3VycmVudElkeDogMCwgXG5cdHNlY3Rpb24xQ3VycmVudElkeDogMCxcblx0c2VjdGlvbjM6IHtcblx0XHRhdXRvbWF0ZTogJycsXG5cdFx0aXNBdXRvbWF0ZWQ6IGZhbHNlXG5cdH0sXG5cdHNlY3Rpb240OiB7XG5cdFx0YXV0b21hdGU6ICcnLFxuXHRcdGlzQXV0b21hdGVkOiBmYWxzZVxuXHR9LFxuXHRiYXNrZXRiYWxsOiB7bG9vcEFtb3VudDogMX0sXG5cdGZvb3RiYWxsOiB7bG9vcEFtb3VudDogMX0sXG5cdHRlbm5pczoge2xvb3BBbW91bnQ6IDF9LFxuXHRiYXNlYmFsbDoge2xvb3BBbW91bnQ6IDF9LFxuXHRmYW46IHtsb29wQW1vdW50OiAxfVxufTtcblxuY29uc3QgaG9tZXBhZ2VNb2JJbWFnZXMgPSBbXG5cdCdhc3NldHMvaW1hZ2VzL2hvbWVwYWdlTW9iL2Jhc2tldGJhbGwuanBnJyxcblx0J2Fzc2V0cy9pbWFnZXMvaG9tZXBhZ2VNb2IvZm9vdGJhbGwuanBnJyxcblx0J2Fzc2V0cy9pbWFnZXMvaG9tZXBhZ2VNb2IvdGVubmlzLmpwZycsIFxuXHQnYXNzZXRzL2ltYWdlcy9ob21lcGFnZU1vYi9iYXNlYmFsbC5qcGcnLCBcblx0J2Fzc2V0cy9pbWFnZXMvaG9tZXBhZ2VNb2IvZmFuLmpwZycgXG5dXG5cbiQoZG9jdW1lbnQpLnJlYWR5KCgpID0+IHtcblx0aWYod2luZG93LmlubmVyV2lkdGggPCA4MDApIHtcbi8vIElGIFRIRSBXSU5ET1cgSVMgU01BTExFUiBUSEFUIDgwMFBYIEZFVENIIFRIRSBKU09OIEZPUiBUSEUgSUNPTiBBTklNQVRJT04gQU5EIEFUQUNIIFRIRSBBTklNQVRJT05TIFNFUEVSQVRFTFkgVE8gbWFzdGVyT2JqIFxcXFxcblx0XHRmZXRjaCgnYXNzZXRzL2pzL0ZhbnRhc3RlY19TcHJpdGVfU2hlZXQuanNvbicpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHsgXG5cdFx0XHRyZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuXHRcdH0pLnRoZW4oZnVuY3Rpb24oc3ByaXRlT2JqKSB7XG5cdFx0XHRjb25zdCBJZGxlRnJhbWUgPSBmaWx0ZXJCeVZhbHVlKHNwcml0ZU9iai5mcmFtZXMsICdpZGxlJyk7XG5cdFx0XHRtYXN0ZXJPYmouZm9vdGJhbGwuYW5pbWF0aW9uQXJyYXkgPSBbLi4uSWRsZUZyYW1lLCAuLi5maWx0ZXJCeVZhbHVlKHNwcml0ZU9iai5mcmFtZXMsICdmb290YmFsbCcpXTtcblx0XHRcdG1hc3Rlck9iai50ZW5uaXMuYW5pbWF0aW9uQXJyYXkgPSBbLi4uSWRsZUZyYW1lLCAuLi5maWx0ZXJCeVZhbHVlKHNwcml0ZU9iai5mcmFtZXMsICd0ZW5uaXMnKV07XG5cdFx0XHRtYXN0ZXJPYmouYmFzZWJhbGwuYW5pbWF0aW9uQXJyYXkgPSBbLi4uSWRsZUZyYW1lLCAuLi5maWx0ZXJCeVZhbHVlKHNwcml0ZU9iai5mcmFtZXMsICdiYXNlYmFsbCcpXTtcblx0XHRcdG1hc3Rlck9iai5iYXNrZXRiYWxsLmFuaW1hdGlvbkFycmF5ID0gWy4uLklkbGVGcmFtZSwgLi4uZmlsdGVyQnlWYWx1ZShzcHJpdGVPYmouZnJhbWVzLCAnYmFza2V0JyldO1xuXHRcdFx0bWFzdGVyT2JqLmZhbi5hbmltYXRpb25BcnJheSA9IFsuLi5JZGxlRnJhbWUsIC4uLmZpbHRlckJ5VmFsdWUoc3ByaXRlT2JqLmZyYW1lcywgJ2ZhbicpXTtcbi8vIENBTEwgQU5JTUFUT1IgU0VUVVAgRlVOQ1RJT04gQU5EIFNUQVJUIFRIRSBJTUFHRSBTTElERVNIT1cgRk9SIFNFQ1RJT04gMSAoSE9NRVBBR0UpIFxcXFxcdFx0XHRcblx0XHRcdGFuaW1hdG9yU2V0dXAoKTtcblx0XHRcdGltYWdlQ29udHJvbGVyKG1hc3Rlck9iaiwgMSk7XG4vLyBDQUxMIFRIRSBpbWFnZUNvbnRyb2xlciBGVU5DVElPTiBFVkVSWSA1IFNFQ09ORFMgVE8gQ0hBTkdFIFRIRSBJTUFHRSBGT1IgU0VDVElPTiAxIChIT01FUEFHRSkgXFxcXFxuXHRcdFx0c2V0SW50ZXJ2YWwoKCkgPT4ge1xuXHRcdFx0XHRpbWFnZUNvbnRyb2xlcihtYXN0ZXJPYmosIDEpO1xuXHRcdFx0fSwgNTAwMCk7XG5cdFx0fSk7XG5cdH1cbi8vIEZVTkNUSU9OIFRPIFNFUEVSQVRFIFRIRSBBTklNQVRJT04gRlJBTUVTIEJZIE5BTUUgXFxcXFxuXHRjb25zdCBmaWx0ZXJCeVZhbHVlID0gKGFycmF5LCBzdHJpbmcpID0+IHtcbiAgICByZXR1cm4gYXJyYXkuZmlsdGVyKG8gPT4gdHlwZW9mIG9bJ2ZpbGVuYW1lJ10gPT09ICdzdHJpbmcnICYmIG9bJ2ZpbGVuYW1lJ10udG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhzdHJpbmcudG9Mb3dlckNhc2UoKSkpO1xuXHR9XG4vLyBHRU5FUklDIFNFVFVQIEZVTkNUSU9OIEZPUiBBRERJTkcgVkVORE9SIFBSRUZJWEVTIFRPIHJlcXVlc3RBbmltYXRpb25GcmFtZSBcXFxcXG5cdGNvbnN0IGFuaW1hdG9yU2V0dXAgPSAoKSA9PiB7XG5cdFx0XHRcbiAgICB2YXIgbGFzdFRpbWUgPSAwO1xuICAgIHZhciB2ZW5kb3JzID0gWydtcycsICdtb3onLCAnd2Via2l0JywgJ28nXTtcbiAgICBmb3IodmFyIHggPSAwOyB4IDwgdmVuZG9ycy5sZW5ndGggJiYgIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWU7ICsreCkge1xuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdKydSZXF1ZXN0QW5pbWF0aW9uRnJhbWUnXTtcbiAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdKydDYW5jZWxBbmltYXRpb25GcmFtZSddIHx8IHdpbmRvd1t2ZW5kb3JzW3hdKydDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUnXTtcbiAgICB9XG4gXG4gICAgaWYgKCF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKVxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uKGNhbGxiYWNrLCBlbGVtZW50KSB7XG4gICAgICAgIHZhciBjdXJyVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICB2YXIgdGltZVRvQ2FsbCA9IE1hdGgubWF4KDAsIDE2IC0gKGN1cnJUaW1lIC0gbGFzdFRpbWUpKTtcbiAgICAgICAgdmFyIGlkID0gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IGNhbGxiYWNrKGN1cnJUaW1lICsgdGltZVRvQ2FsbCk7IH0sIFxuICAgICAgICAgIHRpbWVUb0NhbGwpO1xuICAgICAgICBsYXN0VGltZSA9IGN1cnJUaW1lICsgdGltZVRvQ2FsbDtcbiAgICAgICAgcmV0dXJuIGlkO1xuICAgICAgfTtcbiBcbiAgICBpZiAoIXdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSlcbiAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbihpZCkge1xuICAgICAgY2xlYXJUaW1lb3V0KGlkKTtcbiAgICB9O1xuXHR9XG5cblxuXHRjb25zdCBhbmltYXRvciA9IChhbmltYXRpb25PYmopID0+IHtcblx0XHRcdFx0XHRcdFxuXHRcdHZhciBkYW5jaW5nSWNvbixcblx0XHRcdHNwcml0ZUltYWdlLFxuXHRcdFx0Y2FudmFzO1x0XHRcdFx0XHRcbi8vIEZVTkNUSU9OIFRPIFBBU1MgVE8gcmVxdWVzdEFuaW1hdGlvbkZyYW1lIFxcXFxcblx0XHRmdW5jdGlvbiBnYW1lTG9vcCAoKSB7XG5cdFx0ICAkKCcjbG9hZGluZycpLmFkZENsYXNzKCdoaWRkZW4nKTtcblx0XHQgIGFuaW1hdGlvbk9iai5sb29wSWQgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGdhbWVMb29wKTtcblx0XHQgIGRhbmNpbmdJY29uLnVwZGF0ZSgpO1xuXHRcdCAgZGFuY2luZ0ljb24ucmVuZGVyKCk7XG5cdFx0fVxuXHRcdFxuXHRcdGZ1bmN0aW9uIHNwcml0ZSAob3B0aW9ucykge1xuXHRcdFxuXHRcdFx0dmFyIHRoYXQgPSB7fSxcblx0XHRcdFx0ZnJhbWVJbmRleCA9IDAsXG5cdFx0XHRcdHRpY2tDb3VudCA9IDAsXG5cdFx0XHRcdGxvb3BDb3VudCA9IDAsXG5cdFx0XHRcdHRpY2tzUGVyRnJhbWUgPSBvcHRpb25zLnRpY2tzUGVyRnJhbWUgfHwgMCxcblx0XHRcdFx0bnVtYmVyT2ZGcmFtZXMgPSBvcHRpb25zLm51bWJlck9mRnJhbWVzIHx8IDE7XG5cdFx0XHRcblx0XHRcdHRoYXQuY29udGV4dCA9IG9wdGlvbnMuY29udGV4dDtcblx0XHRcdHRoYXQud2lkdGggPSBvcHRpb25zLndpZHRoO1xuXHRcdFx0dGhhdC5oZWlnaHQgPSBvcHRpb25zLmhlaWdodDtcblx0XHRcdHRoYXQuaW1hZ2UgPSBvcHRpb25zLmltYWdlO1xuXHRcdFx0dGhhdC5sb29wcyA9IG9wdGlvbnMubG9vcHM7XG5cdFx0XHRcblx0XHRcdHRoYXQudXBkYXRlID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHRpY2tDb3VudCArPSAxO1xuXG4gICAgICAgIGlmICh0aWNrQ291bnQgPiB0aWNrc1BlckZyYW1lKSB7XG5cblx0XHRcdFx0XHR0aWNrQ291bnQgPSAwO1xuICAgICAgICAgIC8vIElmIHRoZSBjdXJyZW50IGZyYW1lIGluZGV4IGlzIGluIHJhbmdlXG4gICAgICAgICAgaWYgKGZyYW1lSW5kZXggPCBudW1iZXJPZkZyYW1lcyAtIDEpIHtcdFxuICAgICAgICAgIC8vIEdvIHRvIHRoZSBuZXh0IGZyYW1lXG4gICAgICAgICAgICBmcmFtZUluZGV4ICs9IDE7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgXHRcdGxvb3BDb3VudCsrXG4gICAgICAgICAgICBmcmFtZUluZGV4ID0gMDtcblxuICAgICAgICAgICAgaWYobG9vcENvdW50ID09PSB0aGF0Lmxvb3BzKSB7XG4gICAgICAgICAgICBcdHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZShhbmltYXRpb25PYmoubG9vcElkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cdCAgICAgIH1cblx0ICAgIH1cblx0XHRcdFxuXHRcdFx0dGhhdC5yZW5kZXIgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcblx0XHRcdCAgLy8gQ2xlYXIgdGhlIGNhbnZhc1xuXHRcdFx0ICB0aGF0LmNvbnRleHQuY2xlYXJSZWN0KDAsIDAsIHRoYXQud2lkdGgsIHRoYXQuaGVpZ2h0KTtcblx0XHRcdCAgXG5cdFx0XHQgIHRoYXQuY29udGV4dC5kcmF3SW1hZ2UoXG5cdFx0XHQgICAgdGhhdC5pbWFnZSxcblx0XHRcdCAgICBhbmltYXRpb25PYmouYW5pbWF0aW9uQXJyYXlbZnJhbWVJbmRleF0uZnJhbWUueCxcblx0XHRcdCAgICBhbmltYXRpb25PYmouYW5pbWF0aW9uQXJyYXlbZnJhbWVJbmRleF0uZnJhbWUueSxcblx0XHRcdCAgICAyMDAsXG5cdFx0XHQgICAgMTc1LFxuXHRcdFx0ICAgIDAsXG5cdFx0XHQgICAgMCxcblx0XHRcdCAgICB3aW5kb3cuaW5uZXJXaWR0aCAvIDMuODQ2LFxuXHRcdFx0ICAgIHdpbmRvdy5pbm5lcldpZHRoIC8gNC4xKVxuXHRcdFx0fTtcblx0XHRcdFxuXHRcdFx0cmV0dXJuIHRoYXQ7XG5cdFx0fVxuXHRcdFxuXHRcdC8vIEdldCBjYW52YXNcblx0XHRjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJyk7XG5cdFx0Y2FudmFzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGggLyAzLjg0Njtcblx0XHRjYW52YXMuaGVpZ2h0ID0gd2luZG93LmlubmVyV2lkdGggLyAyLjI7XG5cdFx0XG5cdFx0Ly8gQ3JlYXRlIHNwcml0ZSBzaGVldFxuXHRcdHNwcml0ZUltYWdlID0gbmV3IEltYWdlKCk7XHRcblx0XHRcblx0XHQvLyBDcmVhdGUgc3ByaXRlXG5cdFx0ZGFuY2luZ0ljb24gPSBzcHJpdGUoe1xuXHRcdFx0Y29udGV4dDogY2FudmFzLmdldENvbnRleHQoXCIyZFwiKSxcblx0XHRcdHdpZHRoOiA0MDQwLFxuXHRcdFx0aGVpZ2h0OiAxNzcwLFxuXHRcdFx0aW1hZ2U6IHNwcml0ZUltYWdlLFxuXHRcdFx0bnVtYmVyT2ZGcmFtZXM6IGFuaW1hdGlvbk9iai5hbmltYXRpb25BcnJheS5sZW5ndGgsXG5cdFx0XHR0aWNrc1BlckZyYW1lOiA0LFxuXHRcdFx0bG9vcHM6IGFuaW1hdGlvbk9iai5sb29wQW1vdW50XG5cdFx0fSk7XG5cdFx0XG5cdFx0Ly8gTG9hZCBzcHJpdGUgc2hlZXRcblx0XHRzcHJpdGVJbWFnZS5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBnYW1lTG9vcCk7XG5cdFx0c3ByaXRlSW1hZ2Uuc3JjID0gJ2Fzc2V0cy9pbWFnZXMvRmFudGFzdGVjX1Nwcml0ZV9TaGVldC5wbmcnO1xuXHR9IFxuXG4vLyBJTklUSUFMSVNFIEFORCBTRVRVUCBDVVJSRU5UIFBBR0UuIEVYRUNVVEUgVFJBTlNJVElPTlMgQU5EIFJFTU9WRSBUSU5UIElGIFJFTEVWQU5UIFxcXFxcblxuXHRjb25zdFx0cGFnZUxvYWRlciA9IChpbmRleCkgPT4ge1xuXHRcdGlmKGluZGV4ID09PSA1KSB7XG5cdFx0XHQkKCcudGludCcpLnJlbW92ZUNsYXNzKCdyZW1vdmVUaW50Jyk7XG5cdFx0XHQkKCcuYmFja2dyb3VuZFdyYXBwZXInKS5yZW1vdmVDbGFzcygnc2NhbGVCYWNrZ3JvdW5kJyk7XG5cdFx0XHQkKCcjc2VjdGlvbjUnKS5maW5kKCcuaGVhZGluZycpLmFkZENsYXNzKCdzaG93IGZhZGVJbicpO1xuXHRcdFx0JCgnLnN1YlNlY3Rpb24nKS5hZGRDbGFzcygnc2NhbGVCYWNrZ3JvdW5kJyk7XG5cdFx0XHQkKCcuc3ViU2VjdGlvbicpLmZpbmQoJy50aW50JykuYWRkQ2xhc3MoJ3JlbW92ZVRpbnQnKTtcblx0XHRcdCQoJyNzZWN0aW9uNScpLmZpbmQoJy50ZXh0V3JhcHBlcicpLmFkZENsYXNzKCdzaG93Jyk7XG5cdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0JCgnLnN1YlNlY3Rpb24gPiAudGV4dFdyYXBwZXInKS5maW5kKCcuaGVhZGluZycpLmFkZENsYXNzKCdmYWRlSW4nKTtcblx0XHRcdH0sIDEwMDApO1xuXHRcdH0gXG5cdFx0ZWxzZSB7XG5cdFx0XHQkKCcudGludCcpLnJlbW92ZUNsYXNzKCdyZW1vdmVUaW50Jyk7XG5cdFx0XHQkKCcuc3ViU2VjdGlvbicpLnJlbW92ZUNsYXNzKCdzY2FsZUJhY2tncm91bmQnKTtcblx0XHRcdCQoYC5iYWNrZ3JvdW5kV3JhcHBlcjpub3QoI3NlY3Rpb24ke2luZGV4fUJhY2tncm91bmQpYCkucmVtb3ZlQ2xhc3MoJ3NjYWxlQmFja2dyb3VuZCcpO1xuXHRcdFx0JChgLnNlY3Rpb24uYWN0aXZlYCkuZmluZChgLmJhY2tncm91bmRXcmFwcGVyYCkuYWRkQ2xhc3MoJ3NjYWxlQmFja2dyb3VuZCcpO1xuXHRcdFx0JChgc2VjdGlvbi5hY3RpdmVgKS5maW5kKCcudGludCcpLmFkZENsYXNzKCdyZW1vdmVUaW50Jyk7XG5cblx0XHRcdGlmKCQoYC5zZWN0aW9uJHtpbmRleH1QYWdpbmF0b3JCdXR0b25gKS5sZW5ndGggJiYgJChgLnNlY3Rpb24ke2luZGV4fVBhZ2luYXRvckJ1dHRvbi5hY3RpdmVgKS5sZW5ndGggPCAxKSB7XG5cdFx0XHRcdCQoYC5zZWN0aW9uJHtpbmRleH1QYWdpbmF0b3JCdXR0b25gKS5nZXQoMCkuY2xpY2soKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cbi8vIEhJREUgQUxMIEJFQ0tHUk9VTkRTIElOIFRIRSBTRUNUSU9OIEVYQ0VQVCBUSEUgU1BFQ0lGSUVEIElOREVYLCBXSElDSCBJUyBTQ0FMRUQgQU5EIFNIT1dOLiBcXFxcXG5cblx0Y29uc3QgaW5pdGlhbGl6ZVNlY3Rpb24gPSAoc2VjdGlvbk51bWJlciwgaWR4KSA9PiB7XG5cdFx0JChgI3NlY3Rpb24ke3NlY3Rpb25OdW1iZXJ9QmFja2dyb3VuZCR7aWR4fWApLnNpYmxpbmdzKCcuYmFja2dyb3VuZFdyYXBwZXInKS5tYXAoKGl4LCBlbGUpID0+IHtcblx0XHRcdCQoZWxlKS5jc3Moe29wYWNpdHk6IDB9KTtcblx0XHR9KTtcblxuXHRcdCQoYCNzZWN0aW9uJHtzZWN0aW9uTnVtYmVyfUJhY2tncm91bmQke2lkeH1gKS5jc3Moe1xuXHRcdFx0J3RyYW5zZm9ybSc6ICdzY2FsZSgxLjEpJyxcblx0XHRcdCdvcGFjaXR5JzogMVxuXHRcdH0pO1xuXHR9O1xuXG4vLyBDQUxMIGluaXRpYWxpemVTZWN0aW9uIE9OIFNFQ1RJT05TIDEsIDMgQU5EIDQuIFxcXFxcblx0aW5pdGlhbGl6ZVNlY3Rpb24oMSwgMCk7XG5cdGluaXRpYWxpemVTZWN0aW9uKDMsIDApO1xuXHRpbml0aWFsaXplU2VjdGlvbig0LCAwKTtcblxuLy8gQkFDS0dST1VORCBJTUFHRSBUUkFOU0lUSU9OIEhBTkRMRVIuIFxcXFxcblxuXHRjb25zdCBpbWFnZUNvbnRyb2xlciA9IChpZHhPYmosIHNlY3Rpb25OdW1iZXIpID0+IHtcblx0XHRsZXQgcmVsZXZhbnRBbmltYXRpb247XG5cblx0XHRpZihzZWN0aW9uTnVtYmVyID09PSAxKSB7XG5cdFx0XHRzd2l0Y2goaWR4T2JqLnNlY3Rpb24xQ3VycmVudElkeCkge1xuXHRcdFx0XHRjYXNlIDA6XG5cdFx0XHRcdFx0cmVsZXZhbnRBbmltYXRpb24gPSBtYXN0ZXJPYmouYmFza2V0YmFsbDtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgMTpcblx0XHRcdFx0XHRyZWxldmFudEFuaW1hdGlvbiA9IG1hc3Rlck9iai5mb290YmFsbDtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgMjpcblx0XHRcdFx0XHRyZWxldmFudEFuaW1hdGlvbiA9IG1hc3Rlck9iai50ZW5uaXM7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIDM6XG5cdFx0XHRcdFx0cmVsZXZhbnRBbmltYXRpb24gPSBtYXN0ZXJPYmouYmFzZWJhbGw7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIDQ6XG5cdFx0XHRcdFx0cmVsZXZhbnRBbmltYXRpb24gPSBtYXN0ZXJPYmouZmFuO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cblx0XHQkKGAjc2VjdGlvbiR7c2VjdGlvbk51bWJlcn1gKS5maW5kKCcudGludCcpLnJlbW92ZUNsYXNzKCdyZW1vdmVUaW50Jyk7XG5cdFx0JChgI3NlY3Rpb24ke3NlY3Rpb25OdW1iZXJ9QmFja2dyb3VuZCR7aWR4T2JqW2BzZWN0aW9uJHtzZWN0aW9uTnVtYmVyfUN1cnJlbnRJZHhgXX1gKS5yZW1vdmVDbGFzcygnc2NhbGVCYWNrZ3JvdW5kJyk7XG5cdFx0aW5pdGlhbGl6ZVNlY3Rpb24oc2VjdGlvbk51bWJlciwgaWR4T2JqW2BzZWN0aW9uJHtzZWN0aW9uTnVtYmVyfUN1cnJlbnRJZHhgXSk7XG5cdFx0XG5cdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRpZihzZWN0aW9uTnVtYmVyID09PSAxKSB7XG5cdFx0XHRcdGFuaW1hdG9yKHJlbGV2YW50QW5pbWF0aW9uKTtcblx0XHRcdH1cblxuXHRcdFx0JChgI3NlY3Rpb24ke3NlY3Rpb25OdW1iZXJ9YCkuZmluZChgLmJhY2tncm91bmRXcmFwcGVyYCkuYWRkQ2xhc3MoJ3NjYWxlQmFja2dyb3VuZCcpO1xuXHRcdFx0JChgI3NlY3Rpb24ke3NlY3Rpb25OdW1iZXJ9YCkuZmluZCgnLnRpbnQnKS5hZGRDbGFzcygncmVtb3ZlVGludCcpO1xuXHRcdH0sIDUwMCk7XG5cblx0XHRpZihpZHhPYmpbYHNlY3Rpb24ke3NlY3Rpb25OdW1iZXJ9Q3VycmVudElkeGBdID09PSAkKGAjc2VjdGlvbiR7c2VjdGlvbk51bWJlcn1gKS5maW5kKGAuYmFja2dyb3VuZFdyYXBwZXJgKS5sZW5ndGggLSAxKSB7XG5cdFx0XHRpZHhPYmpbYHNlY3Rpb24ke3NlY3Rpb25OdW1iZXJ9Q3VycmVudElkeGBdID0gMDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0aWR4T2JqW2BzZWN0aW9uJHtzZWN0aW9uTnVtYmVyfUN1cnJlbnRJZHhgXSArPSAxO1xuXHRcdH1cblx0fVxuLy8gU1RBUlQgU0xJREVTSE9XIE9OIFNFQ1RJT04gMiBcXFxcXG5cdGltYWdlQ29udHJvbGVyKG1hc3Rlck9iaiwgMik7XG5cbi8vIENIQU5HRSBTRUNUSU9OIDIgQkFDS0dST1VORCBJTUFHRSBFVkVSWSAxNSBTRUNPTkRTIFxcXFxcblx0c2V0SW50ZXJ2YWwoKCkgPT4ge1xuXHRcdGltYWdlQ29udHJvbGVyKG1hc3Rlck9iaiwgMik7XG5cdH0sIDE1MDAwKTtcblxuLy8gUEFHSU5BVElPTiBCVVRUT05TIENMSUNLIEhBTkRMRVIgRk9SIFNFQ1RJT05TIDMgQU5EIDQuIFxcXFxcblxuXHRjb25zdCBoYW5kbGVQYW5pbmF0aW9uQnV0dG9uQ2xpY2sgPSAoZSkgPT4ge1xuXG5cdFx0Y29uc3QgaWR4ID0gcGFyc2VJbnQoJChlLnRhcmdldCkuYXR0cignZGF0YS1pbmRleCcpKTtcblx0XHRjb25zdCBzZWN0aW9uSWQgPSAkKGUudGFyZ2V0KS5jbG9zZXN0KCdzZWN0aW9uJykuYXR0cignaWQnKTtcblx0XHRsZXQgcmVsZXZhbnREYXRhQXJyYXk7XG5cblx0XHRpZihzZWN0aW9uSWQgPT09ICdzZWN0aW9uMycpIHtcblx0XHRcdHNlY3Rpb24zSWR4ID0gaWR4O1xuXHRcdH1cblxuXHRcdGlmKHNlY3Rpb25JZCA9PT0gJ3NlY3Rpb240Jykge1xuXHRcdFx0c2VjdGlvbjRJZHggPSBpZHg7XG5cdFx0fVxuXG5cdFx0JChgIyR7c2VjdGlvbklkfWApLmZpbmQoJy50aW50JykucmVtb3ZlQ2xhc3MoJ3JlbW92ZVRpbnQnKTtcblx0XHQkKGAjJHtzZWN0aW9uSWR9YCkuZmluZCgnLnRleHRXcmFwcGVyJykucmVtb3ZlQ2xhc3MoJ3Nob3cnKTtcblx0XHQkKGAjJHtzZWN0aW9uSWR9YCkuZmluZChgI3RleHRXcmFwcGVyJHtpZHh9YCkuYWRkQ2xhc3MoJ3Nob3cnKTtcblx0XHQkKGAjJHtzZWN0aW9uSWR9QmFja2dyb3VuZCR7aWR4fWApLnJlbW92ZUNsYXNzKCdzY2FsZUJhY2tncm91bmQnKTtcblx0XHQkKGAuJHtzZWN0aW9uSWR9UGFnaW5hdG9yQnV0dG9uYCkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdCQoZS50YXJnZXQpLmFkZENsYXNzKCdhY3RpdmUnKTtcblxuXHRcdGluaXRpYWxpemVTZWN0aW9uKHBhcnNlSW50KCQoYCMke3NlY3Rpb25JZH1gKS5hdHRyKCdkYXRhLWluZGV4JykpLCBpZHgpO1xuXG5cdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRwYWdlTG9hZGVyKHBhcnNlSW50KCQoYCMke3NlY3Rpb25JZH1gKS5hdHRyKCdkYXRhLWluZGV4JykpKTtcblx0XHR9LCA1MDApO1xuXG5cdFx0aWYoc2VjdGlvbklkICE9PSAnc2VjdGlvbjInKXtcblx0XHRcdCQoYCMke3NlY3Rpb25JZH1gKS5maW5kKCcuaGVhZGluZywgcCcpLmFkZENsYXNzKCdmYWRlSW4nKTtcblx0XHRcdCQoYCMke3NlY3Rpb25JZH1gKS5vbigndHJhbnNpdGlvbmVuZCB3ZWJraXRUcmFuc2l0aW9uRW5kIG9UcmFuc2l0aW9uRW5kJywgKGVzKSA9PiB7XG5cdCAgICBcdCQoYCMke3NlY3Rpb25JZH1gKS5maW5kKCcuaGVhZGluZywgcCcpLnJlbW92ZUNsYXNzKCdmYWRlSW4nKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fTtcblxuLy8gQ0xJQ0sgTElTVEVORVIgRk9SIFBBR0lOQVRJT04gQlVUVE9OUyBPTiBTRUNUSU9OUyAzIEFORCA0LiBcXFxcXG5cblx0JCgnLnNlY3Rpb24zUGFnaW5hdG9yQnV0dG9uLCAuc2VjdGlvbjRQYWdpbmF0b3JCdXR0b24nKS5jbGljaygoZSkgPT4ge1xuXHRcdFxuXHRcdGlmKG1hc3Rlck9ialskKGUuY3VycmVudFRhcmdldCkuY2xvc2VzdCgnc2VjdGlvbicpLmF0dHIoJ2lkJyldLmlzQXV0b21hdGVkKSB7XG4vLyBJRiBUSEVSRSBJUyBBIFJJTk5JTkcgSU5URVJWQUwgT04gVEhFIFJFTEVWQU5UIFNFQ1RJT04gQ0xFQVIgSVQgXFxcXFxuXHRcdFx0aW50ZXJ2YWxNYW5hZ2VyKGZhbHNlLCAkKGUuY3VycmVudFRhcmdldCkuY2xvc2VzdCgnc2VjdGlvbicpLmF0dHIoJ2lkJykpO1xuLy8gU0VUIEEgTkVXIElOVEVSVkFMIE9GIDcgU0VDT05EUyBPTiBUSEUgU0VDVElPTiBcXFxcXG5cdFx0XHRpbnRlcnZhbE1hbmFnZXIodHJ1ZSwgJChlLmN1cnJlbnRUYXJnZXQpLmNsb3Nlc3QoJ3NlY3Rpb24nKS5hdHRyKCdpZCcpLCA3MDAwKTtcblx0XHR9XG4vLyBDQUxMIFRIRSBDTElDSyBIQU5ETEVSIEZVTkNUSU9OIEFORCBQQVNTIElUIFRIRSBFVkVOVCBJRiBUQVJHRVQgSVMgTk9UIEFMUkVBRFkgQUNUSVZFIFxcXFxcblx0XHRpZighJChlLmN1cnJlbnRUYXJnZXQpLmhhc0NsYXNzKCdhY3RpdmUnKSkge1xuXHRcdFx0aGFuZGxlUGFuaW5hdGlvbkJ1dHRvbkNsaWNrKGUpO1xuXHRcdH1cblx0fSk7XG5cbi8vIElOSVRJQUxJWkUgT05FUEFHRVNDUk9MTCBJRiBOT1QgSU4gQ01TIFBSRVZJRVcuIFxcXFxcblxuXHRpZighJChsb2NhdGlvbikuYXR0cignaHJlZicpLmluY2x1ZGVzKCdpbmRleC5waHAnKSkge1xuXHRcdCQoJyNzY3JvbGxlcldyYXBwZXInKS5vbmVwYWdlX3Njcm9sbCh7XG5cdFx0XHRzZWN0aW9uQ29udGFpbmVyOiBcInNlY3Rpb25cIiwgICAgXG5cdFx0XHRlYXNpbmc6IFwiZWFzZS1vdXRcIiwgICAgICAgICAgICAgICAgIFxuXHRcdFx0YW5pbWF0aW9uVGltZTogdGltZSwgICAgICAgICAgICBcblx0XHRcdHBhZ2luYXRpb246IHRydWUsICAgICAgICAgICAgICAgXG5cdFx0XHR1cGRhdGVVUkw6IHRydWUsICAgICAgICAgICAgICAgXG5cdFx0XHRiZWZvcmVNb3ZlOiAoaW5kZXgpID0+IHt9LCBcblx0XHRcdGFmdGVyTW92ZTogKGluZGV4KSA9PiB7XG4vLyBJTklUSUFMSVpFIFRIRSBDVVJSRU5UIFBBR0UuIFxcXFxcblxuXHRcdFx0XHRwYWdlTG9hZGVyKGluZGV4KTtcblx0XHRcdH0sICBcblx0XHRcdGxvb3A6IGZhbHNlLCAgICAgICAgICAgICAgICAgICAgXG5cdFx0XHRrZXlib2FyZDogdHJ1ZSwgICAgICAgICAgICAgICAgIFxuXHRcdFx0cmVzcG9uc2l2ZUZhbGxiYWNrOiBmYWxzZSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcblx0XHRcdGRpcmVjdGlvbjogXCJ2ZXJ0aWNhbFwiICAgICAgICAgIFxuXHRcdH0pO1xuXG5cdFx0JCgnI3Njcm9sbGVyV3JhcHBlcicpLm1vdmVUbygxKTtcblx0fVxuXG4vLyBDT05UUk9MIENMSUNLUyBPTiBXT1JLIFdJVEggVVMgU0VDVElPTiAoU0VDVElPTjUpLiBcXFxcXG5cblx0JCgnLmNsaWNrYWJsZScpLmNsaWNrKChlKSA9PiB7XG5cdFx0bGV0IGN1cnJlbnRTZWN0aW9uID0gJChlLnRhcmdldCkuY2xvc2VzdCgkKCcuc3ViU2VjdGlvbicpKTtcblxuXHRcdGlmKGN1cnJlbnRTZWN0aW9uLmhhc0NsYXNzKCdvcGVuJykpIHtcblx0XHRcdGN1cnJlbnRTZWN0aW9uLnJlbW92ZUNsYXNzKCdvcGVuJyk7XG5cdFx0XHRjdXJyZW50U2VjdGlvbi5maW5kKCcuYnV0dG9uLCBwJykucmVtb3ZlQ2xhc3MoJ2ZhZGVJbicpO1xuXHRcdFx0Y3VycmVudFNlY3Rpb24uc2libGluZ3MoJy5zdWJTZWN0aW9uJykubWFwKChpZHgsIHNlY3Rpb24pID0+IHtcblx0XHRcdFx0JChzZWN0aW9uKS5yZW1vdmVDbGFzcygnY2xvc2VkJyk7XG5cdFx0XHRcdCQoc2VjdGlvbikuZmluZCgnLnRpbnQnKS5yZW1vdmVDbGFzcygnYWRkVGludCcpLmFkZENsYXNzKCdyZW1vdmVUaW50Jyk7XG5cdFx0XHR9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y3VycmVudFNlY3Rpb24ucmVtb3ZlQ2xhc3MoJ2Nsb3NlZCcpLmFkZENsYXNzKCdvcGVuJyk7XG5cdFx0XHRjdXJyZW50U2VjdGlvbi5vbigndHJhbnNpdGlvbmVuZCB3ZWJraXRUcmFuc2l0aW9uRW5kIG9UcmFuc2l0aW9uRW5kJywgKGVzKSA9PiB7XG5cdCAgICBcdCQoJy5zdWJTZWN0aW9uLm9wZW4nKS5maW5kKCcuYnV0dG9uLCBwJykuYWRkQ2xhc3MoJ2ZhZGVJbicpO1xuXHRcdFx0fSk7XG5cdFx0XHRjdXJyZW50U2VjdGlvbi5zaWJsaW5ncygnLnN1YlNlY3Rpb24nKS5tYXAoKGlkeCwgc2VjdGlvbikgPT4ge1xuXHRcdFx0XHQkKHNlY3Rpb24pLnJlbW92ZUNsYXNzKCdvcGVuJykuYWRkQ2xhc3MoJ2Nsb3NlZCcpO1xuXHRcdFx0XHQkKHNlY3Rpb24pLmZpbmQoJy50aW50JykucmVtb3ZlQ2xhc3MoJ3JlbW92ZVRpbnQnKS5hZGRDbGFzcygnYWRkVGludCcpO1xuXHRcdFx0XHQkKHNlY3Rpb24pLmZpbmQoJy5idXR0b24sIHAnKS5yZW1vdmVDbGFzcygnZmFkZUluJyk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0Y3VycmVudFNlY3Rpb24uZmluZCgnLnRpbnQnKS5yZW1vdmVDbGFzcygnYWRkVGludCcpLmFkZENsYXNzKCdyZW1vdmVUaW50Jyk7XG5cdH0pO1xuXG4vLyBDT05UUk9MIEZPT1RFUiBBUlJPVyBDTElDS1MuIFxcXFxcblxuXHQkKCcjZG93bkFycm93JykuY2xpY2soKCkgPT4ge1xuXHRcdGlmKCQod2luZG93KS5oZWlnaHQoKSAqICgkKCcucGFnZScpLmxlbmd0aCAtIDEpID09PSAtICQoJyNzY3JvbGxlcldyYXBwZXInKS5vZmZzZXQoKS50b3ApIHtcbi8vIE1PVkUgVE8gVE9QIE9GIFBBR0UgSUYgQ1VSUkVOVExZIEFUIEJPVFRPTSBcXFxcXG5cdCAgXHQkKCcjc2Nyb2xsZXJXcmFwcGVyJykubW92ZVRvKDEpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkKCcjc2Nyb2xsZXJXcmFwcGVyJykubW92ZURvd24oKTtcblx0XHR9XG5cdH0pO1xuXG4vLyBISURFIFRIRSBMT0FESU5HIEFOSU1BVElPUE4gV0hFTiBWSURFTyBJUyBSRUFEWSBUTyBQTEFZIE9OIERFU1hLVE9QLiBcXFxcXG5cblx0Y29uc3QgaGlkZUxvYWRpbmdBbmltYXRpb24gPSAoKSA9PiB7XG5cdFx0aWYod2luZG93LmlubmVyV2lkdGggPiA4MDAgJiYgISQoJyNsb2FkaW5nJykuaGFzQ2xhc3MoJ2hpZGRlbicpKSB7XG5cblx0XHRcdGlmKCQoJyN2aWRlbycpLmdldCgwKS5yZWFkeVN0YXRlID09PSA0KSB7XG5cdFx0XHRcdCQoJyNsb2FkaW5nJykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG4vLyBNQU5BR0VNRU5UIEZVTkNUSU9OIEZPUiBTRVRUSU5HIEFORCBDTEVBUklORyBUSEUgU0xJREUgQVVUT01BVElPTiBJTlRFUlZBTFMuIFxcXFxcblxuXHRjb25zdCBpbnRlcnZhbE1hbmFnZXIgPSAoZmxhZywgc2VjdGlvbklkLCB0aW1lKSA9PiB7XG4gICBcdGlmKGZsYWcpIHtcbiBcdFx0XHRtYXN0ZXJPYmpbc2VjdGlvbklkXS5hdXRvbWF0ZSA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgXHRcdHN3aXBlQ29udHJvbGxlcihzZWN0aW9uSWQsICdsJyk7XHRcbiAgICAgXHR9LCB0aW1lKTsgXG4gICBcdH0gZWxzZSB7XHRcdFxuICAgIFx0Y2xlYXJJbnRlcnZhbChtYXN0ZXJPYmpbc2VjdGlvbklkXS5hdXRvbWF0ZSk7XG4gICBcdH1cblx0fTtcblxuLy8gSUYgTk9UIElOIENNUyBBRE1JTiBQUkVWSUVXLCBQRVJQRVRVQUxMWSBDSEVDSyBJRiBXRSBBUkUgQVQgVEhFIFRPUCBPRiBUSEUgUEFHRSBBTkQgSUYgU08sIERPTlQgU0hPVyBUSEUgRk9PVEVSIE9SIEdSRUVOIFNIQVBFLiBcXFxcXG5cblx0aWYoISQobG9jYXRpb24pLmF0dHIoJ2hyZWYnKS5pbmNsdWRlcygnaW5kZXgucGhwJykpIHtcblx0XHRzZXRJbnRlcnZhbCgoKSA9PiB7XG5cdFx0XHRpZigkKCcjc2Nyb2xsZXJXcmFwcGVyJykub2Zmc2V0KCkudG9wID49IC0gKHdpbmRvdy5pbm5lckhlaWdodCAvIDEuOSkpIHtcblx0XHRcdFx0JCgnI2hlYWRlclNoYXBlLCAjZm9vdGVyJykuYWRkQ2xhc3MoJ21vdmVPZmZTY3JlZW4nKTtcblx0XHRcdFx0JCgnI3ZpZGVvJykuZ2V0KDApLnBsYXkoKTtcblx0XHRcdFx0JCgnLmFycm93JykuYWRkQ2xhc3MoJ3B1bHNhdGUnKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCQoJyNoZWFkZXJTaGFwZSwgI2Zvb3RlcicpLnJlbW92ZUNsYXNzKCdtb3ZlT2ZmU2NyZWVuJyk7XG5cdFx0XHRcdCQoJyN2aWRlbycpLmdldCgwKS5wYXVzZSgpO1xuXHRcdFx0XHQkKCcuYXJyb3cnKS5yZW1vdmVDbGFzcygncHVsc2F0ZScpO1xuXHRcdFx0fVxuXG4vLyBST1RBVEUgVEhFIEFSUk9XIElOIFRIRSBGT09URVIgV0hFTiBBVCBUSEUgQk9UVE9NIE9GIFRIRSBQQUdFIFxcXFxcblxuXHRcdFx0aWYoJCgnI3Njcm9sbGVyV3JhcHBlcicpLm9mZnNldCgpLnRvcCA8IC0gKHdpbmRvdy5pbm5lckhlaWdodCAqIDQpKSB7XG5cdFx0XHRcdCQoJyNkb3duQXJyb3cnKS5jc3Moeyd0cmFuc2Zvcm0nOiAncm90YXRlKDE4MGRlZykgdHJhbnNsYXRlWCgtNTAlKSd9KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCQoJyNkb3duQXJyb3cnKS5jc3Moeyd0cmFuc2Zvcm0nOiAndHJhbnNsYXRlWCgtNTAlKSByb3RhdGUoMGRlZyknfSk7XG5cdFx0XHR9XG5cblx0XHRcdGhpZGVMb2FkaW5nQW5pbWF0aW9uKCk7XG5cbi8vIEFERCBMQU5EU0NBUEUgU1RZTEVTIFRPIFJFTEVWQU5UIEVMRU1FTlRTIFxcXFxcblxuXHRcdFx0aWYod2luZG93Lm1hdGNoTWVkaWEoXCIob3JpZW50YXRpb246IGxhbmRzY2FwZSlcIikubWF0Y2hlcyAmJiB3aW5kb3cuaW5uZXJXaWR0aCA8IDgwMCkge1xuXHRcdFx0ICAkKCcubmF2X2xpbmssICNoZWFkZXJTaGFwZSwgI2Zvb3RlciwgLmN1c3RvbSwgLm1hcmtlciwgI3NlY3Rpb241LCAudGV4dFdyYXBwZXInKS5hZGRDbGFzcygnbGFuZHNjYXBlJyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQgJCgnLm5hdl9saW5rLCAjaGVhZGVyU2hhcGUsICNmb290ZXIsIC5jdXN0b20sIC5tYXJrZXIsICNzZWN0aW9uNSwgLnRleHRXcmFwcGVyJykucmVtb3ZlQ2xhc3MoJ2xhbmRzY2FwZScpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZigkKCcjc2VjdGlvbjMuYWN0aXZlJykubGVuZ3RoKSB7IC8vIEFVVE9NQVRFIFRIRSBTTElERVMgT04gU0VDVElPUE4gMyBFVkVSWSA3IFNFQ09ORFMgSUYgVEhFIFNFQ1RJT04gSVMgQUNUSVZFLiBcXFxcXG5cdFx0XHRcdGlmKG1hc3Rlck9iai5zZWN0aW9uMy5pc0F1dG9tYXRlZCAhPT0gdHJ1ZSkge1xuXHRcdFx0XHRcdG1hc3Rlck9iai5zZWN0aW9uMy5pc0F1dG9tYXRlZCA9IHRydWU7XG5cdFx0XHRcdFx0aW50ZXJ2YWxNYW5hZ2VyKHRydWUsICdzZWN0aW9uMycsIDcwMDApO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgeyAvLyBTVE9QIEFVVE9NQVRFRCBTTElERVMgT04gU0VDVElPUE4gMyBJRiBUSEUgU0VDVElPTiBJUyBOT1QgQUNUSVZFLiBcXFxcXG5cdFx0XHRcdGlmKG1hc3Rlck9iai5zZWN0aW9uMy5pc0F1dG9tYXRlZCA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRcdGludGVydmFsTWFuYWdlcihmYWxzZSwgJ3NlY3Rpb24zJyk7XG5cdFx0XHRcdFx0bWFzdGVyT2JqLnNlY3Rpb24zLmlzQXV0b21hdGVkID0gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYoJCgnI3NlY3Rpb240LmFjdGl2ZScpLmxlbmd0aCkgeyAvLyBBVVRPTUFURSBUSEUgU0xJREVTIE9OIFNFQ1RJT1BOIDQgRVZFUlkgNyBTRUNPTkRTIElGIFRIRSBTRUNUSU9OIElTIEFDVElWRS4gXFxcXFxuXHRcdFx0XHRpZihtYXN0ZXJPYmouc2VjdGlvbjQuaXNBdXRvbWF0ZWQgIT09IHRydWUpIHtcblx0XHRcdFx0XHRtYXN0ZXJPYmouc2VjdGlvbjQuaXNBdXRvbWF0ZWQgPSB0cnVlO1xuXHRcdFx0XHRcdGludGVydmFsTWFuYWdlcih0cnVlLCAnc2VjdGlvbjQnLCA3MDAwKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHsgLy8gU1RPUCBBVVRPTUFURUQgU0xJREVTIE9OIFNFQ1RJT1BOIDQgSUYgVEhFIFNFQ1RJT04gSVMgTk9UIEFDVElWRS4gXFxcXFxuXHRcdFx0XHRpZihtYXN0ZXJPYmouc2VjdGlvbjQuaXNBdXRvbWF0ZWQgPT09IHRydWUpIHtcblx0XHRcdFx0XHRpbnRlcnZhbE1hbmFnZXIoZmFsc2UsICdzZWN0aW9uNCcpO1xuXHRcdFx0XHRcdG1hc3Rlck9iai5zZWN0aW9uNC5pc0F1dG9tYXRlZCA9IGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSwgNTAwKTtcblx0fVxuXG4vLyBDT05UUk9MIFdIQVQgSEFQUEVOUyBXSEVOIExJTktTIElOIFRIRSBOQVYvTUVOVSBBUkUgQ0xJQ0tFRCBcXFxcXG5cblx0JCgnLm5hdl9saW5rJykuY2xpY2soKGUpID0+IHtcblx0XHRjb25zdCBwYWdlSWR4ID0gcGFyc2VJbnQoJChlLnRhcmdldCkuYXR0cignZGF0YS1pbmRleCcpKTtcblx0XHQkKCcjc2Nyb2xsZXJXcmFwcGVyJykubW92ZVRvKHBhZ2VJZHgpO1xuXHRcdCQoJyNtZW51QmxvY2tPdXQnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG5cblx0XHRpZihidXJnZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdidXJnZXItLWFjdGl2ZScpKSB7XG4gICAgICBuYXYuY2xhc3NMaXN0LnJlbW92ZSgnbmF2X29wZW4nKTtcbiAgICAgIGJ1cmdlci5jbGFzc0xpc3QucmVtb3ZlKCdidXJnZXItLWFjdGl2ZScpO1xuICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XG4gICAgfSBcblx0fSk7XG5cbi8vIFdIRU4gVEhFIE5BViBJUyBPUEVOIFBSRVZFTlQgVVNFUiBGUk9NIEJFSU5HIEFCTEUgVE8gQ0xJQ0sgQU5ZVEhJTkcgRUxTRSBcXFxcXG5cblx0JCgnI21lbnVCbG9ja091dCcpLmNsaWNrKChlKSA9PiB7XG5cdCAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdH0pO1xuXG5cdHZhciBidXJnZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbi1idXJnZXInKSwgXG4gIG5hdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluTmF2Jyk7XG5cbi8vIENPTlRST0wgRk9SIE9QRU4gQU5EIENMT1NJTkcgVEhFIE1FTlUvTkFWICBcXFxcXG5cbiAgZnVuY3Rpb24gbmF2Q29udHJvbCgpIHtcblxuICAgIGlmKGJ1cmdlci5jbGFzc0xpc3QuY29udGFpbnMoJ2J1cmdlci0tYWN0aXZlJykpIHtcbiAgICAgIG5hdi5jbGFzc0xpc3QucmVtb3ZlKCduYXZfb3BlbicpO1xuICAgICAgYnVyZ2VyLmNsYXNzTGlzdC5yZW1vdmUoJ2J1cmdlci0tYWN0aXZlJyk7XG4gICAgICAkKCcjbWVudUJsb2NrT3V0JykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuICAgIH0gXG4gICAgZWxzZSB7XG4gICAgICBidXJnZXIuY2xhc3NMaXN0LmFkZCgnYnVyZ2VyLS1hY3RpdmUnKTtcbiAgICAgIG5hdi5jbGFzc0xpc3QuYWRkKCduYXZfb3BlbicpO1xuICAgICAgJCgnI21lbnVCbG9ja091dCcpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcbiAgICB9XG4gIH1cbiAgXG4vLyBPTkxZIExJU1RFTiBGT1IgTUVOVSBDTElDS1MgV0hFTiBOT1QgSU4gQ01TIFBSRVZJRVcgTU9ERSBcXFxcXG5cbiAgaWYoISQobG9jYXRpb24pLmF0dHIoJ2hyZWYnKS5pbmNsdWRlcygnaW5kZXgucGhwJykpIHtcbiAgXHRidXJnZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBuYXZDb250cm9sKTtcbiAgfVxuXG4vLyBDTE9TRSBUSEUgTkFWIElGIFRIRSBXSU5ET1cgSVMgT1ZFUiAxMDAwUFggV0lERSBcXFxcXG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGZ1bmN0aW9uKCkge1xuICAgIGlmKHdpbmRvdy5pbm5lcldpZHRoID4gMTAwMCAmJiBuYXYuY2xhc3NMaXN0LmNvbnRhaW5zKCduYXZfb3BlbicpKSB7XG4gICAgICBuYXZDb250cm9sKCk7XG4gICAgICBuYXYuY2xhc3NMaXN0LnJlbW92ZSgnbmF2X29wZW4nKTtcbiAgICAgICAkKCcjbWVudUJsb2NrT3V0JykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuICAgIH1cbiAgfSk7XG5cbi8vIFRISVMgU0VUIE9GIElGIFNUQVRFTUVOVFMgSU5JVElBTElTRVMgVEhFIFNQRVNJRklDIFBBR0VTIEZPUiBQUkVWSUVXSU5HIElOIENNUyBBRE1JTi4gXFxcXFxuXG4gIGlmKCQobG9jYXRpb24pLmF0dHIoJ2hyZWYnKS5pbmNsdWRlcygnaW5kZXgucGhwJykpIHtcblx0XHRpZigkKGxvY2F0aW9uKS5hdHRyKCdocmVmJykuaW5jbHVkZXMoJ2ltYWdpbmUtaWYnKSkge1xuXHRcdFx0cGFnZUxvYWRlcig0KTtcblx0XHR9XG5cdFx0aWYoJChsb2NhdGlvbikuYXR0cignaHJlZicpLmluY2x1ZGVzKCdob3ctd2UtaW5ub3ZhdGUnKSkge1xuXHRcdFx0cGFnZUxvYWRlcigzKTtcblx0XHR9XG5cdFx0aWYoJChsb2NhdGlvbikuYXR0cignaHJlZicpLmluY2x1ZGVzKCd3b3JrLXdpdGgtdXMnKSkge1xuXHRcdFx0cGFnZUxvYWRlcig1KTtcblx0XHR9XG5cdFx0aWYoJChsb2NhdGlvbikuYXR0cignaHJlZicpLmluY2x1ZGVzKCdjb250YWN0LXVzJykpIHtcblx0XHRcdHBhZ2VMb2FkZXIoNik7XG5cdFx0fVxuXHRcdGlmKCQobG9jYXRpb24pLmF0dHIoJ2hyZWYnKS5pbmNsdWRlcygnaG9tZS12aWRlbycpKSB7XG5cdFx0XHRzZXRJbnRlcnZhbCgoKSA9PiB7XG5cdFx0XHRcdGhpZGVMb2FkaW5nQW5pbWF0aW9uKCk7XG5cdFx0XHR9LCA1MDApXG5cdFx0fVxuXHR9XG5cbi8vIFNXSVBFIEVWRU5UUyBERVRFQ1RPUiBGVU5DVElPTiBcXFxcXG5cbiAgZnVuY3Rpb24gZGV0ZWN0c3dpcGUoZWwsIGZ1bmMpIHtcblx0ICBsZXQgc3dpcGVfZGV0ID0ge307XG5cdCAgc3dpcGVfZGV0LnNYID0gMDsgc3dpcGVfZGV0LnNZID0gMDsgc3dpcGVfZGV0LmVYID0gMDsgc3dpcGVfZGV0LmVZID0gMDtcblx0ICB2YXIgbWluX3ggPSAzMDsgIC8vbWluIHggc3dpcGUgZm9yIGhvcml6b250YWwgc3dpcGVcblx0ICB2YXIgbWF4X3ggPSAzMDsgIC8vbWF4IHggZGlmZmVyZW5jZSBmb3IgdmVydGljYWwgc3dpcGVcblx0ICB2YXIgbWluX3kgPSA1MDsgIC8vbWluIHkgc3dpcGUgZm9yIHZlcnRpY2FsIHN3aXBlXG5cdCAgdmFyIG1heF95ID0gNjA7ICAvL21heCB5IGRpZmZlcmVuY2UgZm9yIGhvcml6b250YWwgc3dpcGVcblx0ICB2YXIgZGlyZWMgPSBcIlwiO1xuXHQgIGxldCBlbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbCk7XG5cdCAgZWxlLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLGZ1bmN0aW9uKGUpe1xuXHQgICAgdmFyIHQgPSBlLnRvdWNoZXNbMF07XG5cdCAgICBzd2lwZV9kZXQuc1ggPSB0LnNjcmVlblg7IFxuXHQgICAgc3dpcGVfZGV0LnNZID0gdC5zY3JlZW5ZO1xuXHQgIH0sZmFsc2UpO1xuXHQgIGVsZS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLGZ1bmN0aW9uKGUpe1xuXHQgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHQgICAgdmFyIHQgPSBlLnRvdWNoZXNbMF07XG5cdCAgICBzd2lwZV9kZXQuZVggPSB0LnNjcmVlblg7IFxuXHQgICAgc3dpcGVfZGV0LmVZID0gdC5zY3JlZW5ZOyAgICBcblx0ICB9LGZhbHNlKTtcblx0ICBlbGUuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLGZ1bmN0aW9uKGUpe1xuXHQgICAgLy9ob3Jpem9udGFsIGRldGVjdGlvblxuXHQgICAgaWYgKCgoKHN3aXBlX2RldC5lWCAtIG1pbl94ID4gc3dpcGVfZGV0LnNYKSB8fCAoc3dpcGVfZGV0LmVYICsgbWluX3ggPCBzd2lwZV9kZXQuc1gpKSAmJiAoKHN3aXBlX2RldC5lWSA8IHN3aXBlX2RldC5zWSArIG1heF95KSAmJiAoc3dpcGVfZGV0LnNZID4gc3dpcGVfZGV0LmVZIC0gbWF4X3kpICYmIChzd2lwZV9kZXQuZVggPiAwKSkpKSB7XG5cdCAgICAgIGlmKHN3aXBlX2RldC5lWCA+IHN3aXBlX2RldC5zWCkgZGlyZWMgPSBcInJcIjtcblx0ICAgICAgZWxzZSBkaXJlYyA9IFwibFwiO1xuXHQgICAgfVxuXHQgICAgLy92ZXJ0aWNhbCBkZXRlY3Rpb25cblx0ICAgIGVsc2UgaWYgKCgoKHN3aXBlX2RldC5lWSAtIG1pbl95ID4gc3dpcGVfZGV0LnNZKSB8fCAoc3dpcGVfZGV0LmVZICsgbWluX3kgPCBzd2lwZV9kZXQuc1kpKSAmJiAoKHN3aXBlX2RldC5lWCA8IHN3aXBlX2RldC5zWCArIG1heF94KSAmJiAoc3dpcGVfZGV0LnNYID4gc3dpcGVfZGV0LmVYIC0gbWF4X3gpICYmIChzd2lwZV9kZXQuZVkgPiAwKSkpKSB7XG5cdCAgICAgIGlmKHN3aXBlX2RldC5lWSA+IHN3aXBlX2RldC5zWSkgZGlyZWMgPSBcImRcIjtcblx0ICAgICAgZWxzZSBkaXJlYyA9IFwidVwiO1xuXHQgICAgfVxuXG5cdCAgICBpZiAoZGlyZWMgIT0gXCJcIikge1xuXHQgICAgICBpZih0eXBlb2YgZnVuYyA9PSAnZnVuY3Rpb24nKSBmdW5jKGVsLGRpcmVjKTtcblx0ICAgIH1cblx0ICAgIGxldCBkaXJlYyA9IFwiXCI7XG5cdCAgICBzd2lwZV9kZXQuc1ggPSAwOyBzd2lwZV9kZXQuc1kgPSAwOyBzd2lwZV9kZXQuZVggPSAwOyBzd2lwZV9kZXQuZVkgPSAwO1xuXHQgIH0sZmFsc2UpOyAgXG5cdH1cblxuLy8gQ0hPU0UgVEhFIE5FWFQgU0xJREUgVE8gU0hPVyBBTkQgQ0xJQ0sgVEhFIFBBR0lOQVRJT04gQlVUVE9OIFRIQVQgUkVMQVRFUyBUTyBJVC4gXFxcXFxuXG5cdGNvbnN0IHN3aXBlQ29udHJvbGxlciA9IChlbCwgZCkgPT4ge1xuXG5cdFx0aWYoZWwgPT09ICdzZWN0aW9uNCcpIHtcblxuXHRcdFx0Y29uc3Qgc2VjdGlvbjRQYWdpbmF0aW9uTGVuZ3RoID0gJCgnLnNlY3Rpb240UGFnaW5hdG9yQnV0dG9uJykubGVuZ3RoO1xuXG5cdFx0XHRpZihkID09PSAnbCcpIHtcblxuXHRcdFx0XHRpZihzZWN0aW9uNElkeCA8IHNlY3Rpb240UGFnaW5hdGlvbkxlbmd0aCAtIDEpIHtcblx0XHRcdFx0XHRzZWN0aW9uNElkeCsrO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHNlY3Rpb240SWR4ID0gMDtcblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdFx0JCgnLnNlY3Rpb240UGFnaW5hdG9yQnV0dG9uJylbc2VjdGlvbjRJZHhdLmNsaWNrKCk7XG5cdFx0XHR9XG5cdFx0XHRpZihkID09PSAncicpIHtcblxuXHRcdFx0XHRpZihzZWN0aW9uNElkeCA+IDApIHtcblx0XHRcdFx0XHRzZWN0aW9uNElkeC0tO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHNlY3Rpb240SWR4ID0gc2VjdGlvbjRQYWdpbmF0aW9uTGVuZ3RoIC0gMTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdCQoJy5zZWN0aW9uNFBhZ2luYXRvckJ1dHRvbicpW3NlY3Rpb240SWR4XS5jbGljaygpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihlbCA9PT0gJ3NlY3Rpb24zJykge1xuXG5cdFx0XHRjb25zdCBzZWN0aW9uM1BhZ2luYXRpb25MZW5ndGggPSAkKCcuc2VjdGlvbjNQYWdpbmF0b3JCdXR0b24nKS5sZW5ndGg7XG5cblx0XHRcdGlmKGQgPT09ICdsJykge1xuXG5cdFx0XHRcdGlmKHNlY3Rpb24zSWR4IDwgc2VjdGlvbjNQYWdpbmF0aW9uTGVuZ3RoIC0gMSkge1xuXHRcdFx0XHRcdHNlY3Rpb24zSWR4Kys7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0c2VjdGlvbjNJZHggPSAwO1xuXHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0XHQkKCcuc2VjdGlvbjNQYWdpbmF0b3JCdXR0b24nKVtzZWN0aW9uM0lkeF0uY2xpY2soKTtcblx0XHRcdH1cblx0XHRcdGlmKGQgPT09ICdyJykge1xuXG5cdFx0XHRcdGlmKHNlY3Rpb24zSWR4ID4gMCkge1xuXHRcdFx0XHRcdHNlY3Rpb24zSWR4LS07XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0c2VjdGlvbjNJZHggPSBzZWN0aW9uM1BhZ2luYXRpb25MZW5ndGggLSAxO1xuXHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0XHQkKCcuc2VjdGlvbjNQYWdpbmF0b3JCdXR0b24nKVtzZWN0aW9uM0lkeF0uY2xpY2soKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuLy8gSU5JVElBVEUgRk9SIFNXSVBFIERFVEVDVElPTiBPTiBTRUNUSU9OUyAzIEFORCA0IEVYQ0VQVCBJTiBBRE1JTiBQUkVWSUVXLiBcXFxcXG5cblx0aWYoISQobG9jYXRpb24pLmF0dHIoJ2hyZWYnKS5pbmNsdWRlcygnaW5kZXgucGhwJykpIHtcblx0XHRkZXRlY3Rzd2lwZSgnc2VjdGlvbjQnLCBzd2lwZUNvbnRyb2xsZXIpO1xuXHRcdGRldGVjdHN3aXBlKCdzZWN0aW9uMycsIHN3aXBlQ29udHJvbGxlcik7XG5cdH1cbn0pOyJdfQ==
}).call(this,require("FT5ORs"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/fake_4b17cfa6.js","/")
},{"FT5ORs":4,"buffer":2}]},{},[5])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYW1pYW53aHl0ZS9Eb2N1bWVudHMvUHJvamVjdHMvY3JhZnRfZmFudGFzdGVjL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvZGFtaWFud2h5dGUvRG9jdW1lbnRzL1Byb2plY3RzL2NyYWZ0X2ZhbnRhc3RlYy9ub2RlX21vZHVsZXMvYmFzZTY0LWpzL2xpYi9iNjQuanMiLCIvVXNlcnMvZGFtaWFud2h5dGUvRG9jdW1lbnRzL1Byb2plY3RzL2NyYWZ0X2ZhbnRhc3RlYy9ub2RlX21vZHVsZXMvYnVmZmVyL2luZGV4LmpzIiwiL1VzZXJzL2RhbWlhbndoeXRlL0RvY3VtZW50cy9Qcm9qZWN0cy9jcmFmdF9mYW50YXN0ZWMvbm9kZV9tb2R1bGVzL2llZWU3NTQvaW5kZXguanMiLCIvVXNlcnMvZGFtaWFud2h5dGUvRG9jdW1lbnRzL1Byb2plY3RzL2NyYWZ0X2ZhbnRhc3RlYy9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwiL1VzZXJzL2RhbWlhbndoeXRlL0RvY3VtZW50cy9Qcm9qZWN0cy9jcmFmdF9mYW50YXN0ZWMvc291cmNlL2pzL2NvbWJpbmVkL2Zha2VfNGIxN2NmYTYuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2bENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG52YXIgbG9va3VwID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky8nO1xuXG47KGZ1bmN0aW9uIChleHBvcnRzKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuICB2YXIgQXJyID0gKHR5cGVvZiBVaW50OEFycmF5ICE9PSAndW5kZWZpbmVkJylcbiAgICA/IFVpbnQ4QXJyYXlcbiAgICA6IEFycmF5XG5cblx0dmFyIFBMVVMgICA9ICcrJy5jaGFyQ29kZUF0KDApXG5cdHZhciBTTEFTSCAgPSAnLycuY2hhckNvZGVBdCgwKVxuXHR2YXIgTlVNQkVSID0gJzAnLmNoYXJDb2RlQXQoMClcblx0dmFyIExPV0VSICA9ICdhJy5jaGFyQ29kZUF0KDApXG5cdHZhciBVUFBFUiAgPSAnQScuY2hhckNvZGVBdCgwKVxuXHR2YXIgUExVU19VUkxfU0FGRSA9ICctJy5jaGFyQ29kZUF0KDApXG5cdHZhciBTTEFTSF9VUkxfU0FGRSA9ICdfJy5jaGFyQ29kZUF0KDApXG5cblx0ZnVuY3Rpb24gZGVjb2RlIChlbHQpIHtcblx0XHR2YXIgY29kZSA9IGVsdC5jaGFyQ29kZUF0KDApXG5cdFx0aWYgKGNvZGUgPT09IFBMVVMgfHxcblx0XHQgICAgY29kZSA9PT0gUExVU19VUkxfU0FGRSlcblx0XHRcdHJldHVybiA2MiAvLyAnKydcblx0XHRpZiAoY29kZSA9PT0gU0xBU0ggfHxcblx0XHQgICAgY29kZSA9PT0gU0xBU0hfVVJMX1NBRkUpXG5cdFx0XHRyZXR1cm4gNjMgLy8gJy8nXG5cdFx0aWYgKGNvZGUgPCBOVU1CRVIpXG5cdFx0XHRyZXR1cm4gLTEgLy9ubyBtYXRjaFxuXHRcdGlmIChjb2RlIDwgTlVNQkVSICsgMTApXG5cdFx0XHRyZXR1cm4gY29kZSAtIE5VTUJFUiArIDI2ICsgMjZcblx0XHRpZiAoY29kZSA8IFVQUEVSICsgMjYpXG5cdFx0XHRyZXR1cm4gY29kZSAtIFVQUEVSXG5cdFx0aWYgKGNvZGUgPCBMT1dFUiArIDI2KVxuXHRcdFx0cmV0dXJuIGNvZGUgLSBMT1dFUiArIDI2XG5cdH1cblxuXHRmdW5jdGlvbiBiNjRUb0J5dGVBcnJheSAoYjY0KSB7XG5cdFx0dmFyIGksIGosIGwsIHRtcCwgcGxhY2VIb2xkZXJzLCBhcnJcblxuXHRcdGlmIChiNjQubGVuZ3RoICUgNCA+IDApIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignSW52YWxpZCBzdHJpbmcuIExlbmd0aCBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgNCcpXG5cdFx0fVxuXG5cdFx0Ly8gdGhlIG51bWJlciBvZiBlcXVhbCBzaWducyAocGxhY2UgaG9sZGVycylcblx0XHQvLyBpZiB0aGVyZSBhcmUgdHdvIHBsYWNlaG9sZGVycywgdGhhbiB0aGUgdHdvIGNoYXJhY3RlcnMgYmVmb3JlIGl0XG5cdFx0Ly8gcmVwcmVzZW50IG9uZSBieXRlXG5cdFx0Ly8gaWYgdGhlcmUgaXMgb25seSBvbmUsIHRoZW4gdGhlIHRocmVlIGNoYXJhY3RlcnMgYmVmb3JlIGl0IHJlcHJlc2VudCAyIGJ5dGVzXG5cdFx0Ly8gdGhpcyBpcyBqdXN0IGEgY2hlYXAgaGFjayB0byBub3QgZG8gaW5kZXhPZiB0d2ljZVxuXHRcdHZhciBsZW4gPSBiNjQubGVuZ3RoXG5cdFx0cGxhY2VIb2xkZXJzID0gJz0nID09PSBiNjQuY2hhckF0KGxlbiAtIDIpID8gMiA6ICc9JyA9PT0gYjY0LmNoYXJBdChsZW4gLSAxKSA/IDEgOiAwXG5cblx0XHQvLyBiYXNlNjQgaXMgNC8zICsgdXAgdG8gdHdvIGNoYXJhY3RlcnMgb2YgdGhlIG9yaWdpbmFsIGRhdGFcblx0XHRhcnIgPSBuZXcgQXJyKGI2NC5sZW5ndGggKiAzIC8gNCAtIHBsYWNlSG9sZGVycylcblxuXHRcdC8vIGlmIHRoZXJlIGFyZSBwbGFjZWhvbGRlcnMsIG9ubHkgZ2V0IHVwIHRvIHRoZSBsYXN0IGNvbXBsZXRlIDQgY2hhcnNcblx0XHRsID0gcGxhY2VIb2xkZXJzID4gMCA/IGI2NC5sZW5ndGggLSA0IDogYjY0Lmxlbmd0aFxuXG5cdFx0dmFyIEwgPSAwXG5cblx0XHRmdW5jdGlvbiBwdXNoICh2KSB7XG5cdFx0XHRhcnJbTCsrXSA9IHZcblx0XHR9XG5cblx0XHRmb3IgKGkgPSAwLCBqID0gMDsgaSA8IGw7IGkgKz0gNCwgaiArPSAzKSB7XG5cdFx0XHR0bXAgPSAoZGVjb2RlKGI2NC5jaGFyQXQoaSkpIDw8IDE4KSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMSkpIDw8IDEyKSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMikpIDw8IDYpIHwgZGVjb2RlKGI2NC5jaGFyQXQoaSArIDMpKVxuXHRcdFx0cHVzaCgodG1wICYgMHhGRjAwMDApID4+IDE2KVxuXHRcdFx0cHVzaCgodG1wICYgMHhGRjAwKSA+PiA4KVxuXHRcdFx0cHVzaCh0bXAgJiAweEZGKVxuXHRcdH1cblxuXHRcdGlmIChwbGFjZUhvbGRlcnMgPT09IDIpIHtcblx0XHRcdHRtcCA9IChkZWNvZGUoYjY0LmNoYXJBdChpKSkgPDwgMikgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDEpKSA+PiA0KVxuXHRcdFx0cHVzaCh0bXAgJiAweEZGKVxuXHRcdH0gZWxzZSBpZiAocGxhY2VIb2xkZXJzID09PSAxKSB7XG5cdFx0XHR0bXAgPSAoZGVjb2RlKGI2NC5jaGFyQXQoaSkpIDw8IDEwKSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMSkpIDw8IDQpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAyKSkgPj4gMilcblx0XHRcdHB1c2goKHRtcCA+PiA4KSAmIDB4RkYpXG5cdFx0XHRwdXNoKHRtcCAmIDB4RkYpXG5cdFx0fVxuXG5cdFx0cmV0dXJuIGFyclxuXHR9XG5cblx0ZnVuY3Rpb24gdWludDhUb0Jhc2U2NCAodWludDgpIHtcblx0XHR2YXIgaSxcblx0XHRcdGV4dHJhQnl0ZXMgPSB1aW50OC5sZW5ndGggJSAzLCAvLyBpZiB3ZSBoYXZlIDEgYnl0ZSBsZWZ0LCBwYWQgMiBieXRlc1xuXHRcdFx0b3V0cHV0ID0gXCJcIixcblx0XHRcdHRlbXAsIGxlbmd0aFxuXG5cdFx0ZnVuY3Rpb24gZW5jb2RlIChudW0pIHtcblx0XHRcdHJldHVybiBsb29rdXAuY2hhckF0KG51bSlcblx0XHR9XG5cblx0XHRmdW5jdGlvbiB0cmlwbGV0VG9CYXNlNjQgKG51bSkge1xuXHRcdFx0cmV0dXJuIGVuY29kZShudW0gPj4gMTggJiAweDNGKSArIGVuY29kZShudW0gPj4gMTIgJiAweDNGKSArIGVuY29kZShudW0gPj4gNiAmIDB4M0YpICsgZW5jb2RlKG51bSAmIDB4M0YpXG5cdFx0fVxuXG5cdFx0Ly8gZ28gdGhyb3VnaCB0aGUgYXJyYXkgZXZlcnkgdGhyZWUgYnl0ZXMsIHdlJ2xsIGRlYWwgd2l0aCB0cmFpbGluZyBzdHVmZiBsYXRlclxuXHRcdGZvciAoaSA9IDAsIGxlbmd0aCA9IHVpbnQ4Lmxlbmd0aCAtIGV4dHJhQnl0ZXM7IGkgPCBsZW5ndGg7IGkgKz0gMykge1xuXHRcdFx0dGVtcCA9ICh1aW50OFtpXSA8PCAxNikgKyAodWludDhbaSArIDFdIDw8IDgpICsgKHVpbnQ4W2kgKyAyXSlcblx0XHRcdG91dHB1dCArPSB0cmlwbGV0VG9CYXNlNjQodGVtcClcblx0XHR9XG5cblx0XHQvLyBwYWQgdGhlIGVuZCB3aXRoIHplcm9zLCBidXQgbWFrZSBzdXJlIHRvIG5vdCBmb3JnZXQgdGhlIGV4dHJhIGJ5dGVzXG5cdFx0c3dpdGNoIChleHRyYUJ5dGVzKSB7XG5cdFx0XHRjYXNlIDE6XG5cdFx0XHRcdHRlbXAgPSB1aW50OFt1aW50OC5sZW5ndGggLSAxXVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKHRlbXAgPj4gMilcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSgodGVtcCA8PCA0KSAmIDB4M0YpXG5cdFx0XHRcdG91dHB1dCArPSAnPT0nXG5cdFx0XHRcdGJyZWFrXG5cdFx0XHRjYXNlIDI6XG5cdFx0XHRcdHRlbXAgPSAodWludDhbdWludDgubGVuZ3RoIC0gMl0gPDwgOCkgKyAodWludDhbdWludDgubGVuZ3RoIC0gMV0pXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUodGVtcCA+PiAxMClcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSgodGVtcCA+PiA0KSAmIDB4M0YpXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUoKHRlbXAgPDwgMikgJiAweDNGKVxuXHRcdFx0XHRvdXRwdXQgKz0gJz0nXG5cdFx0XHRcdGJyZWFrXG5cdFx0fVxuXG5cdFx0cmV0dXJuIG91dHB1dFxuXHR9XG5cblx0ZXhwb3J0cy50b0J5dGVBcnJheSA9IGI2NFRvQnl0ZUFycmF5XG5cdGV4cG9ydHMuZnJvbUJ5dGVBcnJheSA9IHVpbnQ4VG9CYXNlNjRcbn0odHlwZW9mIGV4cG9ydHMgPT09ICd1bmRlZmluZWQnID8gKHRoaXMuYmFzZTY0anMgPSB7fSkgOiBleHBvcnRzKSlcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJGVDVPUnNcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvYmFzZTY0LWpzL2xpYi9iNjQuanNcIixcIi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvYmFzZTY0LWpzL2xpYlwiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8qIVxuICogVGhlIGJ1ZmZlciBtb2R1bGUgZnJvbSBub2RlLmpzLCBmb3IgdGhlIGJyb3dzZXIuXG4gKlxuICogQGF1dGhvciAgIEZlcm9zcyBBYm91a2hhZGlqZWggPGZlcm9zc0BmZXJvc3Mub3JnPiA8aHR0cDovL2Zlcm9zcy5vcmc+XG4gKiBAbGljZW5zZSAgTUlUXG4gKi9cblxudmFyIGJhc2U2NCA9IHJlcXVpcmUoJ2Jhc2U2NC1qcycpXG52YXIgaWVlZTc1NCA9IHJlcXVpcmUoJ2llZWU3NTQnKVxuXG5leHBvcnRzLkJ1ZmZlciA9IEJ1ZmZlclxuZXhwb3J0cy5TbG93QnVmZmVyID0gQnVmZmVyXG5leHBvcnRzLklOU1BFQ1RfTUFYX0JZVEVTID0gNTBcbkJ1ZmZlci5wb29sU2l6ZSA9IDgxOTJcblxuLyoqXG4gKiBJZiBgQnVmZmVyLl91c2VUeXBlZEFycmF5c2A6XG4gKiAgID09PSB0cnVlICAgIFVzZSBVaW50OEFycmF5IGltcGxlbWVudGF0aW9uIChmYXN0ZXN0KVxuICogICA9PT0gZmFsc2UgICBVc2UgT2JqZWN0IGltcGxlbWVudGF0aW9uIChjb21wYXRpYmxlIGRvd24gdG8gSUU2KVxuICovXG5CdWZmZXIuX3VzZVR5cGVkQXJyYXlzID0gKGZ1bmN0aW9uICgpIHtcbiAgLy8gRGV0ZWN0IGlmIGJyb3dzZXIgc3VwcG9ydHMgVHlwZWQgQXJyYXlzLiBTdXBwb3J0ZWQgYnJvd3NlcnMgYXJlIElFIDEwKywgRmlyZWZveCA0KyxcbiAgLy8gQ2hyb21lIDcrLCBTYWZhcmkgNS4xKywgT3BlcmEgMTEuNissIGlPUyA0LjIrLiBJZiB0aGUgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IGFkZGluZ1xuICAvLyBwcm9wZXJ0aWVzIHRvIGBVaW50OEFycmF5YCBpbnN0YW5jZXMsIHRoZW4gdGhhdCdzIHRoZSBzYW1lIGFzIG5vIGBVaW50OEFycmF5YCBzdXBwb3J0XG4gIC8vIGJlY2F1c2Ugd2UgbmVlZCB0byBiZSBhYmxlIHRvIGFkZCBhbGwgdGhlIG5vZGUgQnVmZmVyIEFQSSBtZXRob2RzLiBUaGlzIGlzIGFuIGlzc3VlXG4gIC8vIGluIEZpcmVmb3ggNC0yOS4gTm93IGZpeGVkOiBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD02OTU0MzhcbiAgdHJ5IHtcbiAgICB2YXIgYnVmID0gbmV3IEFycmF5QnVmZmVyKDApXG4gICAgdmFyIGFyciA9IG5ldyBVaW50OEFycmF5KGJ1ZilcbiAgICBhcnIuZm9vID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gNDIgfVxuICAgIHJldHVybiA0MiA9PT0gYXJyLmZvbygpICYmXG4gICAgICAgIHR5cGVvZiBhcnIuc3ViYXJyYXkgPT09ICdmdW5jdGlvbicgLy8gQ2hyb21lIDktMTAgbGFjayBgc3ViYXJyYXlgXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufSkoKVxuXG4vKipcbiAqIENsYXNzOiBCdWZmZXJcbiAqID09PT09PT09PT09PT1cbiAqXG4gKiBUaGUgQnVmZmVyIGNvbnN0cnVjdG9yIHJldHVybnMgaW5zdGFuY2VzIG9mIGBVaW50OEFycmF5YCB0aGF0IGFyZSBhdWdtZW50ZWRcbiAqIHdpdGggZnVuY3Rpb24gcHJvcGVydGllcyBmb3IgYWxsIHRoZSBub2RlIGBCdWZmZXJgIEFQSSBmdW5jdGlvbnMuIFdlIHVzZVxuICogYFVpbnQ4QXJyYXlgIHNvIHRoYXQgc3F1YXJlIGJyYWNrZXQgbm90YXRpb24gd29ya3MgYXMgZXhwZWN0ZWQgLS0gaXQgcmV0dXJuc1xuICogYSBzaW5nbGUgb2N0ZXQuXG4gKlxuICogQnkgYXVnbWVudGluZyB0aGUgaW5zdGFuY2VzLCB3ZSBjYW4gYXZvaWQgbW9kaWZ5aW5nIHRoZSBgVWludDhBcnJheWBcbiAqIHByb3RvdHlwZS5cbiAqL1xuZnVuY3Rpb24gQnVmZmVyIChzdWJqZWN0LCBlbmNvZGluZywgbm9aZXJvKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBCdWZmZXIpKVxuICAgIHJldHVybiBuZXcgQnVmZmVyKHN1YmplY3QsIGVuY29kaW5nLCBub1plcm8pXG5cbiAgdmFyIHR5cGUgPSB0eXBlb2Ygc3ViamVjdFxuXG4gIC8vIFdvcmthcm91bmQ6IG5vZGUncyBiYXNlNjQgaW1wbGVtZW50YXRpb24gYWxsb3dzIGZvciBub24tcGFkZGVkIHN0cmluZ3NcbiAgLy8gd2hpbGUgYmFzZTY0LWpzIGRvZXMgbm90LlxuICBpZiAoZW5jb2RpbmcgPT09ICdiYXNlNjQnICYmIHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgc3ViamVjdCA9IHN0cmluZ3RyaW0oc3ViamVjdClcbiAgICB3aGlsZSAoc3ViamVjdC5sZW5ndGggJSA0ICE9PSAwKSB7XG4gICAgICBzdWJqZWN0ID0gc3ViamVjdCArICc9J1xuICAgIH1cbiAgfVxuXG4gIC8vIEZpbmQgdGhlIGxlbmd0aFxuICB2YXIgbGVuZ3RoXG4gIGlmICh0eXBlID09PSAnbnVtYmVyJylcbiAgICBsZW5ndGggPSBjb2VyY2Uoc3ViamVjdClcbiAgZWxzZSBpZiAodHlwZSA9PT0gJ3N0cmluZycpXG4gICAgbGVuZ3RoID0gQnVmZmVyLmJ5dGVMZW5ndGgoc3ViamVjdCwgZW5jb2RpbmcpXG4gIGVsc2UgaWYgKHR5cGUgPT09ICdvYmplY3QnKVxuICAgIGxlbmd0aCA9IGNvZXJjZShzdWJqZWN0Lmxlbmd0aCkgLy8gYXNzdW1lIHRoYXQgb2JqZWN0IGlzIGFycmF5LWxpa2VcbiAgZWxzZVxuICAgIHRocm93IG5ldyBFcnJvcignRmlyc3QgYXJndW1lbnQgbmVlZHMgdG8gYmUgYSBudW1iZXIsIGFycmF5IG9yIHN0cmluZy4nKVxuXG4gIHZhciBidWZcbiAgaWYgKEJ1ZmZlci5fdXNlVHlwZWRBcnJheXMpIHtcbiAgICAvLyBQcmVmZXJyZWQ6IFJldHVybiBhbiBhdWdtZW50ZWQgYFVpbnQ4QXJyYXlgIGluc3RhbmNlIGZvciBiZXN0IHBlcmZvcm1hbmNlXG4gICAgYnVmID0gQnVmZmVyLl9hdWdtZW50KG5ldyBVaW50OEFycmF5KGxlbmd0aCkpXG4gIH0gZWxzZSB7XG4gICAgLy8gRmFsbGJhY2s6IFJldHVybiBUSElTIGluc3RhbmNlIG9mIEJ1ZmZlciAoY3JlYXRlZCBieSBgbmV3YClcbiAgICBidWYgPSB0aGlzXG4gICAgYnVmLmxlbmd0aCA9IGxlbmd0aFxuICAgIGJ1Zi5faXNCdWZmZXIgPSB0cnVlXG4gIH1cblxuICB2YXIgaVxuICBpZiAoQnVmZmVyLl91c2VUeXBlZEFycmF5cyAmJiB0eXBlb2Ygc3ViamVjdC5ieXRlTGVuZ3RoID09PSAnbnVtYmVyJykge1xuICAgIC8vIFNwZWVkIG9wdGltaXphdGlvbiAtLSB1c2Ugc2V0IGlmIHdlJ3JlIGNvcHlpbmcgZnJvbSBhIHR5cGVkIGFycmF5XG4gICAgYnVmLl9zZXQoc3ViamVjdClcbiAgfSBlbHNlIGlmIChpc0FycmF5aXNoKHN1YmplY3QpKSB7XG4gICAgLy8gVHJlYXQgYXJyYXktaXNoIG9iamVjdHMgYXMgYSBieXRlIGFycmF5XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoQnVmZmVyLmlzQnVmZmVyKHN1YmplY3QpKVxuICAgICAgICBidWZbaV0gPSBzdWJqZWN0LnJlYWRVSW50OChpKVxuICAgICAgZWxzZVxuICAgICAgICBidWZbaV0gPSBzdWJqZWN0W2ldXG4gICAgfVxuICB9IGVsc2UgaWYgKHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgYnVmLndyaXRlKHN1YmplY3QsIDAsIGVuY29kaW5nKVxuICB9IGVsc2UgaWYgKHR5cGUgPT09ICdudW1iZXInICYmICFCdWZmZXIuX3VzZVR5cGVkQXJyYXlzICYmICFub1plcm8pIHtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGJ1ZltpXSA9IDBcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYnVmXG59XG5cbi8vIFNUQVRJQyBNRVRIT0RTXG4vLyA9PT09PT09PT09PT09PVxuXG5CdWZmZXIuaXNFbmNvZGluZyA9IGZ1bmN0aW9uIChlbmNvZGluZykge1xuICBzd2l0Y2ggKFN0cmluZyhlbmNvZGluZykudG9Mb3dlckNhc2UoKSkge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICBjYXNlICdiaW5hcnknOlxuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgY2FzZSAncmF3JzpcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0dXJuIHRydWVcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuQnVmZmVyLmlzQnVmZmVyID0gZnVuY3Rpb24gKGIpIHtcbiAgcmV0dXJuICEhKGIgIT09IG51bGwgJiYgYiAhPT0gdW5kZWZpbmVkICYmIGIuX2lzQnVmZmVyKVxufVxuXG5CdWZmZXIuYnl0ZUxlbmd0aCA9IGZ1bmN0aW9uIChzdHIsIGVuY29kaW5nKSB7XG4gIHZhciByZXRcbiAgc3RyID0gc3RyICsgJydcbiAgc3dpdGNoIChlbmNvZGluZyB8fCAndXRmOCcpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgICAgcmV0ID0gc3RyLmxlbmd0aCAvIDJcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgICAgcmV0ID0gdXRmOFRvQnl0ZXMoc3RyKS5sZW5ndGhcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYXNjaWknOlxuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgY2FzZSAncmF3JzpcbiAgICAgIHJldCA9IHN0ci5sZW5ndGhcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgIHJldCA9IGJhc2U2NFRvQnl0ZXMoc3RyKS5sZW5ndGhcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldCA9IHN0ci5sZW5ndGggKiAyXG4gICAgICBicmVha1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2RpbmcnKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuQnVmZmVyLmNvbmNhdCA9IGZ1bmN0aW9uIChsaXN0LCB0b3RhbExlbmd0aCkge1xuICBhc3NlcnQoaXNBcnJheShsaXN0KSwgJ1VzYWdlOiBCdWZmZXIuY29uY2F0KGxpc3QsIFt0b3RhbExlbmd0aF0pXFxuJyArXG4gICAgICAnbGlzdCBzaG91bGQgYmUgYW4gQXJyYXkuJylcblxuICBpZiAobGlzdC5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gbmV3IEJ1ZmZlcigwKVxuICB9IGVsc2UgaWYgKGxpc3QubGVuZ3RoID09PSAxKSB7XG4gICAgcmV0dXJuIGxpc3RbMF1cbiAgfVxuXG4gIHZhciBpXG4gIGlmICh0eXBlb2YgdG90YWxMZW5ndGggIT09ICdudW1iZXInKSB7XG4gICAgdG90YWxMZW5ndGggPSAwXG4gICAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRvdGFsTGVuZ3RoICs9IGxpc3RbaV0ubGVuZ3RoXG4gICAgfVxuICB9XG5cbiAgdmFyIGJ1ZiA9IG5ldyBCdWZmZXIodG90YWxMZW5ndGgpXG4gIHZhciBwb3MgPSAwXG4gIGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldXG4gICAgaXRlbS5jb3B5KGJ1ZiwgcG9zKVxuICAgIHBvcyArPSBpdGVtLmxlbmd0aFxuICB9XG4gIHJldHVybiBidWZcbn1cblxuLy8gQlVGRkVSIElOU1RBTkNFIE1FVEhPRFNcbi8vID09PT09PT09PT09PT09PT09PT09PT09XG5cbmZ1bmN0aW9uIF9oZXhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIG9mZnNldCA9IE51bWJlcihvZmZzZXQpIHx8IDBcbiAgdmFyIHJlbWFpbmluZyA9IGJ1Zi5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgfSBlbHNlIHtcbiAgICBsZW5ndGggPSBOdW1iZXIobGVuZ3RoKVxuICAgIGlmIChsZW5ndGggPiByZW1haW5pbmcpIHtcbiAgICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICAgIH1cbiAgfVxuXG4gIC8vIG11c3QgYmUgYW4gZXZlbiBudW1iZXIgb2YgZGlnaXRzXG4gIHZhciBzdHJMZW4gPSBzdHJpbmcubGVuZ3RoXG4gIGFzc2VydChzdHJMZW4gJSAyID09PSAwLCAnSW52YWxpZCBoZXggc3RyaW5nJylcblxuICBpZiAobGVuZ3RoID4gc3RyTGVuIC8gMikge1xuICAgIGxlbmd0aCA9IHN0ckxlbiAvIDJcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGJ5dGUgPSBwYXJzZUludChzdHJpbmcuc3Vic3RyKGkgKiAyLCAyKSwgMTYpXG4gICAgYXNzZXJ0KCFpc05hTihieXRlKSwgJ0ludmFsaWQgaGV4IHN0cmluZycpXG4gICAgYnVmW29mZnNldCArIGldID0gYnl0ZVxuICB9XG4gIEJ1ZmZlci5fY2hhcnNXcml0dGVuID0gaSAqIDJcbiAgcmV0dXJuIGlcbn1cblxuZnVuY3Rpb24gX3V0ZjhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBjaGFyc1dyaXR0ZW4gPSBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9XG4gICAgYmxpdEJ1ZmZlcih1dGY4VG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxuICByZXR1cm4gY2hhcnNXcml0dGVuXG59XG5cbmZ1bmN0aW9uIF9hc2NpaVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKGFzY2lpVG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxuICByZXR1cm4gY2hhcnNXcml0dGVuXG59XG5cbmZ1bmN0aW9uIF9iaW5hcnlXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBfYXNjaWlXcml0ZShidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIF9iYXNlNjRXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBjaGFyc1dyaXR0ZW4gPSBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9XG4gICAgYmxpdEJ1ZmZlcihiYXNlNjRUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuZnVuY3Rpb24gX3V0ZjE2bGVXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBjaGFyc1dyaXR0ZW4gPSBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9XG4gICAgYmxpdEJ1ZmZlcih1dGYxNmxlVG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxuICByZXR1cm4gY2hhcnNXcml0dGVuXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbiAoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCwgZW5jb2RpbmcpIHtcbiAgLy8gU3VwcG9ydCBib3RoIChzdHJpbmcsIG9mZnNldCwgbGVuZ3RoLCBlbmNvZGluZylcbiAgLy8gYW5kIHRoZSBsZWdhY3kgKHN0cmluZywgZW5jb2RpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICBpZiAoaXNGaW5pdGUob2Zmc2V0KSkge1xuICAgIGlmICghaXNGaW5pdGUobGVuZ3RoKSkge1xuICAgICAgZW5jb2RpbmcgPSBsZW5ndGhcbiAgICAgIGxlbmd0aCA9IHVuZGVmaW5lZFxuICAgIH1cbiAgfSBlbHNlIHsgIC8vIGxlZ2FjeVxuICAgIHZhciBzd2FwID0gZW5jb2RpbmdcbiAgICBlbmNvZGluZyA9IG9mZnNldFxuICAgIG9mZnNldCA9IGxlbmd0aFxuICAgIGxlbmd0aCA9IHN3YXBcbiAgfVxuXG4gIG9mZnNldCA9IE51bWJlcihvZmZzZXQpIHx8IDBcbiAgdmFyIHJlbWFpbmluZyA9IHRoaXMubGVuZ3RoIC0gb2Zmc2V0XG4gIGlmICghbGVuZ3RoKSB7XG4gICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gIH0gZWxzZSB7XG4gICAgbGVuZ3RoID0gTnVtYmVyKGxlbmd0aClcbiAgICBpZiAobGVuZ3RoID4gcmVtYWluaW5nKSB7XG4gICAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgICB9XG4gIH1cbiAgZW5jb2RpbmcgPSBTdHJpbmcoZW5jb2RpbmcgfHwgJ3V0ZjgnKS50b0xvd2VyQ2FzZSgpXG5cbiAgdmFyIHJldFxuICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICAgIHJldCA9IF9oZXhXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgICByZXQgPSBfdXRmOFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgIHJldCA9IF9hc2NpaVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICByZXQgPSBfYmluYXJ5V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgIHJldCA9IF9iYXNlNjRXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0ID0gX3V0ZjE2bGVXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGVuY29kaW5nJylcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoZW5jb2RpbmcsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHNlbGYgPSB0aGlzXG5cbiAgZW5jb2RpbmcgPSBTdHJpbmcoZW5jb2RpbmcgfHwgJ3V0ZjgnKS50b0xvd2VyQ2FzZSgpXG4gIHN0YXJ0ID0gTnVtYmVyKHN0YXJ0KSB8fCAwXG4gIGVuZCA9IChlbmQgIT09IHVuZGVmaW5lZClcbiAgICA/IE51bWJlcihlbmQpXG4gICAgOiBlbmQgPSBzZWxmLmxlbmd0aFxuXG4gIC8vIEZhc3RwYXRoIGVtcHR5IHN0cmluZ3NcbiAgaWYgKGVuZCA9PT0gc3RhcnQpXG4gICAgcmV0dXJuICcnXG5cbiAgdmFyIHJldFxuICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICAgIHJldCA9IF9oZXhTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgICByZXQgPSBfdXRmOFNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgIHJldCA9IF9hc2NpaVNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICByZXQgPSBfYmluYXJ5U2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgIHJldCA9IF9iYXNlNjRTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0ID0gX3V0ZjE2bGVTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGVuY29kaW5nJylcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdCdWZmZXInLFxuICAgIGRhdGE6IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHRoaXMuX2FyciB8fCB0aGlzLCAwKVxuICB9XG59XG5cbi8vIGNvcHkodGFyZ2V0QnVmZmVyLCB0YXJnZXRTdGFydD0wLCBzb3VyY2VTdGFydD0wLCBzb3VyY2VFbmQ9YnVmZmVyLmxlbmd0aClcbkJ1ZmZlci5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uICh0YXJnZXQsIHRhcmdldF9zdGFydCwgc3RhcnQsIGVuZCkge1xuICB2YXIgc291cmNlID0gdGhpc1xuXG4gIGlmICghc3RhcnQpIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCAmJiBlbmQgIT09IDApIGVuZCA9IHRoaXMubGVuZ3RoXG4gIGlmICghdGFyZ2V0X3N0YXJ0KSB0YXJnZXRfc3RhcnQgPSAwXG5cbiAgLy8gQ29weSAwIGJ5dGVzOyB3ZSdyZSBkb25lXG4gIGlmIChlbmQgPT09IHN0YXJ0KSByZXR1cm5cbiAgaWYgKHRhcmdldC5sZW5ndGggPT09IDAgfHwgc291cmNlLmxlbmd0aCA9PT0gMCkgcmV0dXJuXG5cbiAgLy8gRmF0YWwgZXJyb3IgY29uZGl0aW9uc1xuICBhc3NlcnQoZW5kID49IHN0YXJ0LCAnc291cmNlRW5kIDwgc291cmNlU3RhcnQnKVxuICBhc3NlcnQodGFyZ2V0X3N0YXJ0ID49IDAgJiYgdGFyZ2V0X3N0YXJ0IDwgdGFyZ2V0Lmxlbmd0aCxcbiAgICAgICd0YXJnZXRTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgYXNzZXJ0KHN0YXJ0ID49IDAgJiYgc3RhcnQgPCBzb3VyY2UubGVuZ3RoLCAnc291cmNlU3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIGFzc2VydChlbmQgPj0gMCAmJiBlbmQgPD0gc291cmNlLmxlbmd0aCwgJ3NvdXJjZUVuZCBvdXQgb2YgYm91bmRzJylcblxuICAvLyBBcmUgd2Ugb29iP1xuICBpZiAoZW5kID4gdGhpcy5sZW5ndGgpXG4gICAgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKHRhcmdldC5sZW5ndGggLSB0YXJnZXRfc3RhcnQgPCBlbmQgLSBzdGFydClcbiAgICBlbmQgPSB0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0X3N0YXJ0ICsgc3RhcnRcblxuICB2YXIgbGVuID0gZW5kIC0gc3RhcnRcblxuICBpZiAobGVuIDwgMTAwIHx8ICFCdWZmZXIuX3VzZVR5cGVkQXJyYXlzKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIHRhcmdldFtpICsgdGFyZ2V0X3N0YXJ0XSA9IHRoaXNbaSArIHN0YXJ0XVxuICB9IGVsc2Uge1xuICAgIHRhcmdldC5fc2V0KHRoaXMuc3ViYXJyYXkoc3RhcnQsIHN0YXJ0ICsgbGVuKSwgdGFyZ2V0X3N0YXJ0KVxuICB9XG59XG5cbmZ1bmN0aW9uIF9iYXNlNjRTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIGlmIChzdGFydCA9PT0gMCAmJiBlbmQgPT09IGJ1Zi5sZW5ndGgpIHtcbiAgICByZXR1cm4gYmFzZTY0LmZyb21CeXRlQXJyYXkoYnVmKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYuc2xpY2Uoc3RhcnQsIGVuZCkpXG4gIH1cbn1cblxuZnVuY3Rpb24gX3V0ZjhTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciByZXMgPSAnJ1xuICB2YXIgdG1wID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgaWYgKGJ1ZltpXSA8PSAweDdGKSB7XG4gICAgICByZXMgKz0gZGVjb2RlVXRmOENoYXIodG1wKSArIFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldKVxuICAgICAgdG1wID0gJydcbiAgICB9IGVsc2Uge1xuICAgICAgdG1wICs9ICclJyArIGJ1ZltpXS50b1N0cmluZygxNilcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzICsgZGVjb2RlVXRmOENoYXIodG1wKVxufVxuXG5mdW5jdGlvbiBfYXNjaWlTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciByZXQgPSAnJ1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspXG4gICAgcmV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldKVxuICByZXR1cm4gcmV0XG59XG5cbmZ1bmN0aW9uIF9iaW5hcnlTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHJldHVybiBfYXNjaWlTbGljZShidWYsIHN0YXJ0LCBlbmQpXG59XG5cbmZ1bmN0aW9uIF9oZXhTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG5cbiAgaWYgKCFzdGFydCB8fCBzdGFydCA8IDApIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCB8fCBlbmQgPCAwIHx8IGVuZCA+IGxlbikgZW5kID0gbGVuXG5cbiAgdmFyIG91dCA9ICcnXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgb3V0ICs9IHRvSGV4KGJ1ZltpXSlcbiAgfVxuICByZXR1cm4gb3V0XG59XG5cbmZ1bmN0aW9uIF91dGYxNmxlU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgYnl0ZXMgPSBidWYuc2xpY2Uoc3RhcnQsIGVuZClcbiAgdmFyIHJlcyA9ICcnXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYnl0ZXMubGVuZ3RoOyBpICs9IDIpIHtcbiAgICByZXMgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShieXRlc1tpXSArIGJ5dGVzW2krMV0gKiAyNTYpXG4gIH1cbiAgcmV0dXJuIHJlc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnNsaWNlID0gZnVuY3Rpb24gKHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIHN0YXJ0ID0gY2xhbXAoc3RhcnQsIGxlbiwgMClcbiAgZW5kID0gY2xhbXAoZW5kLCBsZW4sIGxlbilcblxuICBpZiAoQnVmZmVyLl91c2VUeXBlZEFycmF5cykge1xuICAgIHJldHVybiBCdWZmZXIuX2F1Z21lbnQodGhpcy5zdWJhcnJheShzdGFydCwgZW5kKSlcbiAgfSBlbHNlIHtcbiAgICB2YXIgc2xpY2VMZW4gPSBlbmQgLSBzdGFydFxuICAgIHZhciBuZXdCdWYgPSBuZXcgQnVmZmVyKHNsaWNlTGVuLCB1bmRlZmluZWQsIHRydWUpXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzbGljZUxlbjsgaSsrKSB7XG4gICAgICBuZXdCdWZbaV0gPSB0aGlzW2kgKyBzdGFydF1cbiAgICB9XG4gICAgcmV0dXJuIG5ld0J1ZlxuICB9XG59XG5cbi8vIGBnZXRgIHdpbGwgYmUgcmVtb3ZlZCBpbiBOb2RlIDAuMTMrXG5CdWZmZXIucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChvZmZzZXQpIHtcbiAgY29uc29sZS5sb2coJy5nZXQoKSBpcyBkZXByZWNhdGVkLiBBY2Nlc3MgdXNpbmcgYXJyYXkgaW5kZXhlcyBpbnN0ZWFkLicpXG4gIHJldHVybiB0aGlzLnJlYWRVSW50OChvZmZzZXQpXG59XG5cbi8vIGBzZXRgIHdpbGwgYmUgcmVtb3ZlZCBpbiBOb2RlIDAuMTMrXG5CdWZmZXIucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uICh2LCBvZmZzZXQpIHtcbiAgY29uc29sZS5sb2coJy5zZXQoKSBpcyBkZXByZWNhdGVkLiBBY2Nlc3MgdXNpbmcgYXJyYXkgaW5kZXhlcyBpbnN0ZWFkLicpXG4gIHJldHVybiB0aGlzLndyaXRlVUludDgodiwgb2Zmc2V0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50OCA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgPCB0aGlzLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gdGhpcy5sZW5ndGgpXG4gICAgcmV0dXJuXG5cbiAgcmV0dXJuIHRoaXNbb2Zmc2V0XVxufVxuXG5mdW5jdGlvbiBfcmVhZFVJbnQxNiAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAxIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIHZhciB2YWxcbiAgaWYgKGxpdHRsZUVuZGlhbikge1xuICAgIHZhbCA9IGJ1ZltvZmZzZXRdXG4gICAgaWYgKG9mZnNldCArIDEgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDFdIDw8IDhcbiAgfSBlbHNlIHtcbiAgICB2YWwgPSBidWZbb2Zmc2V0XSA8PCA4XG4gICAgaWYgKG9mZnNldCArIDEgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDFdXG4gIH1cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZFVJbnQxNih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZFVJbnQxNih0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3JlYWRVSW50MzIgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICB2YXIgdmFsXG4gIGlmIChsaXR0bGVFbmRpYW4pIHtcbiAgICBpZiAob2Zmc2V0ICsgMiA8IGxlbilcbiAgICAgIHZhbCA9IGJ1ZltvZmZzZXQgKyAyXSA8PCAxNlxuICAgIGlmIChvZmZzZXQgKyAxIDwgbGVuKVxuICAgICAgdmFsIHw9IGJ1ZltvZmZzZXQgKyAxXSA8PCA4XG4gICAgdmFsIHw9IGJ1ZltvZmZzZXRdXG4gICAgaWYgKG9mZnNldCArIDMgPCBsZW4pXG4gICAgICB2YWwgPSB2YWwgKyAoYnVmW29mZnNldCArIDNdIDw8IDI0ID4+PiAwKVxuICB9IGVsc2Uge1xuICAgIGlmIChvZmZzZXQgKyAxIDwgbGVuKVxuICAgICAgdmFsID0gYnVmW29mZnNldCArIDFdIDw8IDE2XG4gICAgaWYgKG9mZnNldCArIDIgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDJdIDw8IDhcbiAgICBpZiAob2Zmc2V0ICsgMyA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgM11cbiAgICB2YWwgPSB2YWwgKyAoYnVmW29mZnNldF0gPDwgMjQgPj4+IDApXG4gIH1cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZFVJbnQzMih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZFVJbnQzMih0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50OCA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLFxuICAgICAgICAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgPCB0aGlzLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gdGhpcy5sZW5ndGgpXG4gICAgcmV0dXJuXG5cbiAgdmFyIG5lZyA9IHRoaXNbb2Zmc2V0XSAmIDB4ODBcbiAgaWYgKG5lZylcbiAgICByZXR1cm4gKDB4ZmYgLSB0aGlzW29mZnNldF0gKyAxKSAqIC0xXG4gIGVsc2VcbiAgICByZXR1cm4gdGhpc1tvZmZzZXRdXG59XG5cbmZ1bmN0aW9uIF9yZWFkSW50MTYgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMSA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICB2YXIgdmFsID0gX3JlYWRVSW50MTYoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgdHJ1ZSlcbiAgdmFyIG5lZyA9IHZhbCAmIDB4ODAwMFxuICBpZiAobmVnKVxuICAgIHJldHVybiAoMHhmZmZmIC0gdmFsICsgMSkgKiAtMVxuICBlbHNlXG4gICAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MTYodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEludDE2KHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfcmVhZEludDMyIChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgdmFyIHZhbCA9IF9yZWFkVUludDMyKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIHRydWUpXG4gIHZhciBuZWcgPSB2YWwgJiAweDgwMDAwMDAwXG4gIGlmIChuZWcpXG4gICAgcmV0dXJuICgweGZmZmZmZmZmIC0gdmFsICsgMSkgKiAtMVxuICBlbHNlXG4gICAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MzIodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEludDMyKHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfcmVhZEZsb2F0IChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHJldHVybiBpZWVlNzU0LnJlYWQoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0TEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRGbG9hdCh0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdEJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkRmxvYXQodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF9yZWFkRG91YmxlIChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgKyA3IDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHJldHVybiBpZWVlNzU0LnJlYWQoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgNTIsIDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkRG91YmxlKHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkRG91YmxlKHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDggPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0IDwgdGhpcy5sZW5ndGgsICd0cnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmdWludCh2YWx1ZSwgMHhmZilcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gdGhpcy5sZW5ndGgpIHJldHVyblxuXG4gIHRoaXNbb2Zmc2V0XSA9IHZhbHVlXG59XG5cbmZ1bmN0aW9uIF93cml0ZVVJbnQxNiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAxIDwgYnVmLmxlbmd0aCwgJ3RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZ1aW50KHZhbHVlLCAweGZmZmYpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBmb3IgKHZhciBpID0gMCwgaiA9IE1hdGgubWluKGxlbiAtIG9mZnNldCwgMik7IGkgPCBqOyBpKyspIHtcbiAgICBidWZbb2Zmc2V0ICsgaV0gPVxuICAgICAgICAodmFsdWUgJiAoMHhmZiA8PCAoOCAqIChsaXR0bGVFbmRpYW4gPyBpIDogMSAtIGkpKSkpID4+PlxuICAgICAgICAgICAgKGxpdHRsZUVuZGlhbiA/IGkgOiAxIC0gaSkgKiA4XG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZVVJbnQzMiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ3RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZ1aW50KHZhbHVlLCAweGZmZmZmZmZmKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgZm9yICh2YXIgaSA9IDAsIGogPSBNYXRoLm1pbihsZW4gLSBvZmZzZXQsIDQpOyBpIDwgajsgaSsrKSB7XG4gICAgYnVmW29mZnNldCArIGldID1cbiAgICAgICAgKHZhbHVlID4+PiAobGl0dGxlRW5kaWFuID8gaSA6IDMgLSBpKSAqIDgpICYgMHhmZlxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50OCA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgPCB0aGlzLmxlbmd0aCwgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZzaW50KHZhbHVlLCAweDdmLCAtMHg4MClcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gdGhpcy5sZW5ndGgpXG4gICAgcmV0dXJuXG5cbiAgaWYgKHZhbHVlID49IDApXG4gICAgdGhpcy53cml0ZVVJbnQ4KHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KVxuICBlbHNlXG4gICAgdGhpcy53cml0ZVVJbnQ4KDB4ZmYgKyB2YWx1ZSArIDEsIG9mZnNldCwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZUludDE2IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDEgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnNpbnQodmFsdWUsIDB4N2ZmZiwgLTB4ODAwMClcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGlmICh2YWx1ZSA+PSAwKVxuICAgIF93cml0ZVVJbnQxNihidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpXG4gIGVsc2VcbiAgICBfd3JpdGVVSW50MTYoYnVmLCAweGZmZmYgKyB2YWx1ZSArIDEsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2TEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlSW50MzIgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmc2ludCh2YWx1ZSwgMHg3ZmZmZmZmZiwgLTB4ODAwMDAwMDApXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBpZiAodmFsdWUgPj0gMClcbiAgICBfd3JpdGVVSW50MzIoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KVxuICBlbHNlXG4gICAgX3dyaXRlVUludDMyKGJ1ZiwgMHhmZmZmZmZmZiArIHZhbHVlICsgMSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyQkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVGbG9hdCAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZJRUVFNzU0KHZhbHVlLCAzLjQwMjgyMzQ2NjM4NTI4ODZlKzM4LCAtMy40MDI4MjM0NjYzODUyODg2ZSszOClcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDIzLCA0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0QkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlRmxvYXQodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVEb3VibGUgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgNyA8IGJ1Zi5sZW5ndGgsXG4gICAgICAgICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmSUVFRTc1NCh2YWx1ZSwgMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgsIC0xLjc5NzY5MzEzNDg2MjMxNTdFKzMwOClcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDUyLCA4KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlTEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlQkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuLy8gZmlsbCh2YWx1ZSwgc3RhcnQ9MCwgZW5kPWJ1ZmZlci5sZW5ndGgpXG5CdWZmZXIucHJvdG90eXBlLmZpbGwgPSBmdW5jdGlvbiAodmFsdWUsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKCF2YWx1ZSkgdmFsdWUgPSAwXG4gIGlmICghc3RhcnQpIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCkgZW5kID0gdGhpcy5sZW5ndGhcblxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgIHZhbHVlID0gdmFsdWUuY2hhckNvZGVBdCgwKVxuICB9XG5cbiAgYXNzZXJ0KHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgIWlzTmFOKHZhbHVlKSwgJ3ZhbHVlIGlzIG5vdCBhIG51bWJlcicpXG4gIGFzc2VydChlbmQgPj0gc3RhcnQsICdlbmQgPCBzdGFydCcpXG5cbiAgLy8gRmlsbCAwIGJ5dGVzOyB3ZSdyZSBkb25lXG4gIGlmIChlbmQgPT09IHN0YXJ0KSByZXR1cm5cbiAgaWYgKHRoaXMubGVuZ3RoID09PSAwKSByZXR1cm5cblxuICBhc3NlcnQoc3RhcnQgPj0gMCAmJiBzdGFydCA8IHRoaXMubGVuZ3RoLCAnc3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIGFzc2VydChlbmQgPj0gMCAmJiBlbmQgPD0gdGhpcy5sZW5ndGgsICdlbmQgb3V0IG9mIGJvdW5kcycpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICB0aGlzW2ldID0gdmFsdWVcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmluc3BlY3QgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBvdXQgPSBbXVxuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgIG91dFtpXSA9IHRvSGV4KHRoaXNbaV0pXG4gICAgaWYgKGkgPT09IGV4cG9ydHMuSU5TUEVDVF9NQVhfQllURVMpIHtcbiAgICAgIG91dFtpICsgMV0gPSAnLi4uJ1xuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cbiAgcmV0dXJuICc8QnVmZmVyICcgKyBvdXQuam9pbignICcpICsgJz4nXG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBgQXJyYXlCdWZmZXJgIHdpdGggdGhlICpjb3BpZWQqIG1lbW9yeSBvZiB0aGUgYnVmZmVyIGluc3RhbmNlLlxuICogQWRkZWQgaW4gTm9kZSAwLjEyLiBPbmx5IGF2YWlsYWJsZSBpbiBicm93c2VycyB0aGF0IHN1cHBvcnQgQXJyYXlCdWZmZXIuXG4gKi9cbkJ1ZmZlci5wcm90b3R5cGUudG9BcnJheUJ1ZmZlciA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHR5cGVvZiBVaW50OEFycmF5ICE9PSAndW5kZWZpbmVkJykge1xuICAgIGlmIChCdWZmZXIuX3VzZVR5cGVkQXJyYXlzKSB7XG4gICAgICByZXR1cm4gKG5ldyBCdWZmZXIodGhpcykpLmJ1ZmZlclxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgYnVmID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5sZW5ndGgpXG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gYnVmLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAxKVxuICAgICAgICBidWZbaV0gPSB0aGlzW2ldXG4gICAgICByZXR1cm4gYnVmLmJ1ZmZlclxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0J1ZmZlci50b0FycmF5QnVmZmVyIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBicm93c2VyJylcbiAgfVxufVxuXG4vLyBIRUxQRVIgRlVOQ1RJT05TXG4vLyA9PT09PT09PT09PT09PT09XG5cbmZ1bmN0aW9uIHN0cmluZ3RyaW0gKHN0cikge1xuICBpZiAoc3RyLnRyaW0pIHJldHVybiBzdHIudHJpbSgpXG4gIHJldHVybiBzdHIucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpXG59XG5cbnZhciBCUCA9IEJ1ZmZlci5wcm90b3R5cGVcblxuLyoqXG4gKiBBdWdtZW50IGEgVWludDhBcnJheSAqaW5zdGFuY2UqIChub3QgdGhlIFVpbnQ4QXJyYXkgY2xhc3MhKSB3aXRoIEJ1ZmZlciBtZXRob2RzXG4gKi9cbkJ1ZmZlci5fYXVnbWVudCA9IGZ1bmN0aW9uIChhcnIpIHtcbiAgYXJyLl9pc0J1ZmZlciA9IHRydWVcblxuICAvLyBzYXZlIHJlZmVyZW5jZSB0byBvcmlnaW5hbCBVaW50OEFycmF5IGdldC9zZXQgbWV0aG9kcyBiZWZvcmUgb3ZlcndyaXRpbmdcbiAgYXJyLl9nZXQgPSBhcnIuZ2V0XG4gIGFyci5fc2V0ID0gYXJyLnNldFxuXG4gIC8vIGRlcHJlY2F0ZWQsIHdpbGwgYmUgcmVtb3ZlZCBpbiBub2RlIDAuMTMrXG4gIGFyci5nZXQgPSBCUC5nZXRcbiAgYXJyLnNldCA9IEJQLnNldFxuXG4gIGFyci53cml0ZSA9IEJQLndyaXRlXG4gIGFyci50b1N0cmluZyA9IEJQLnRvU3RyaW5nXG4gIGFyci50b0xvY2FsZVN0cmluZyA9IEJQLnRvU3RyaW5nXG4gIGFyci50b0pTT04gPSBCUC50b0pTT05cbiAgYXJyLmNvcHkgPSBCUC5jb3B5XG4gIGFyci5zbGljZSA9IEJQLnNsaWNlXG4gIGFyci5yZWFkVUludDggPSBCUC5yZWFkVUludDhcbiAgYXJyLnJlYWRVSW50MTZMRSA9IEJQLnJlYWRVSW50MTZMRVxuICBhcnIucmVhZFVJbnQxNkJFID0gQlAucmVhZFVJbnQxNkJFXG4gIGFyci5yZWFkVUludDMyTEUgPSBCUC5yZWFkVUludDMyTEVcbiAgYXJyLnJlYWRVSW50MzJCRSA9IEJQLnJlYWRVSW50MzJCRVxuICBhcnIucmVhZEludDggPSBCUC5yZWFkSW50OFxuICBhcnIucmVhZEludDE2TEUgPSBCUC5yZWFkSW50MTZMRVxuICBhcnIucmVhZEludDE2QkUgPSBCUC5yZWFkSW50MTZCRVxuICBhcnIucmVhZEludDMyTEUgPSBCUC5yZWFkSW50MzJMRVxuICBhcnIucmVhZEludDMyQkUgPSBCUC5yZWFkSW50MzJCRVxuICBhcnIucmVhZEZsb2F0TEUgPSBCUC5yZWFkRmxvYXRMRVxuICBhcnIucmVhZEZsb2F0QkUgPSBCUC5yZWFkRmxvYXRCRVxuICBhcnIucmVhZERvdWJsZUxFID0gQlAucmVhZERvdWJsZUxFXG4gIGFyci5yZWFkRG91YmxlQkUgPSBCUC5yZWFkRG91YmxlQkVcbiAgYXJyLndyaXRlVUludDggPSBCUC53cml0ZVVJbnQ4XG4gIGFyci53cml0ZVVJbnQxNkxFID0gQlAud3JpdGVVSW50MTZMRVxuICBhcnIud3JpdGVVSW50MTZCRSA9IEJQLndyaXRlVUludDE2QkVcbiAgYXJyLndyaXRlVUludDMyTEUgPSBCUC53cml0ZVVJbnQzMkxFXG4gIGFyci53cml0ZVVJbnQzMkJFID0gQlAud3JpdGVVSW50MzJCRVxuICBhcnIud3JpdGVJbnQ4ID0gQlAud3JpdGVJbnQ4XG4gIGFyci53cml0ZUludDE2TEUgPSBCUC53cml0ZUludDE2TEVcbiAgYXJyLndyaXRlSW50MTZCRSA9IEJQLndyaXRlSW50MTZCRVxuICBhcnIud3JpdGVJbnQzMkxFID0gQlAud3JpdGVJbnQzMkxFXG4gIGFyci53cml0ZUludDMyQkUgPSBCUC53cml0ZUludDMyQkVcbiAgYXJyLndyaXRlRmxvYXRMRSA9IEJQLndyaXRlRmxvYXRMRVxuICBhcnIud3JpdGVGbG9hdEJFID0gQlAud3JpdGVGbG9hdEJFXG4gIGFyci53cml0ZURvdWJsZUxFID0gQlAud3JpdGVEb3VibGVMRVxuICBhcnIud3JpdGVEb3VibGVCRSA9IEJQLndyaXRlRG91YmxlQkVcbiAgYXJyLmZpbGwgPSBCUC5maWxsXG4gIGFyci5pbnNwZWN0ID0gQlAuaW5zcGVjdFxuICBhcnIudG9BcnJheUJ1ZmZlciA9IEJQLnRvQXJyYXlCdWZmZXJcblxuICByZXR1cm4gYXJyXG59XG5cbi8vIHNsaWNlKHN0YXJ0LCBlbmQpXG5mdW5jdGlvbiBjbGFtcCAoaW5kZXgsIGxlbiwgZGVmYXVsdFZhbHVlKSB7XG4gIGlmICh0eXBlb2YgaW5kZXggIT09ICdudW1iZXInKSByZXR1cm4gZGVmYXVsdFZhbHVlXG4gIGluZGV4ID0gfn5pbmRleDsgIC8vIENvZXJjZSB0byBpbnRlZ2VyLlxuICBpZiAoaW5kZXggPj0gbGVuKSByZXR1cm4gbGVuXG4gIGlmIChpbmRleCA+PSAwKSByZXR1cm4gaW5kZXhcbiAgaW5kZXggKz0gbGVuXG4gIGlmIChpbmRleCA+PSAwKSByZXR1cm4gaW5kZXhcbiAgcmV0dXJuIDBcbn1cblxuZnVuY3Rpb24gY29lcmNlIChsZW5ndGgpIHtcbiAgLy8gQ29lcmNlIGxlbmd0aCB0byBhIG51bWJlciAocG9zc2libHkgTmFOKSwgcm91bmQgdXBcbiAgLy8gaW4gY2FzZSBpdCdzIGZyYWN0aW9uYWwgKGUuZy4gMTIzLjQ1NikgdGhlbiBkbyBhXG4gIC8vIGRvdWJsZSBuZWdhdGUgdG8gY29lcmNlIGEgTmFOIHRvIDAuIEVhc3ksIHJpZ2h0P1xuICBsZW5ndGggPSB+fk1hdGguY2VpbCgrbGVuZ3RoKVxuICByZXR1cm4gbGVuZ3RoIDwgMCA/IDAgOiBsZW5ndGhcbn1cblxuZnVuY3Rpb24gaXNBcnJheSAoc3ViamVjdCkge1xuICByZXR1cm4gKEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gKHN1YmplY3QpIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHN1YmplY3QpID09PSAnW29iamVjdCBBcnJheV0nXG4gIH0pKHN1YmplY3QpXG59XG5cbmZ1bmN0aW9uIGlzQXJyYXlpc2ggKHN1YmplY3QpIHtcbiAgcmV0dXJuIGlzQXJyYXkoc3ViamVjdCkgfHwgQnVmZmVyLmlzQnVmZmVyKHN1YmplY3QpIHx8XG4gICAgICBzdWJqZWN0ICYmIHR5cGVvZiBzdWJqZWN0ID09PSAnb2JqZWN0JyAmJlxuICAgICAgdHlwZW9mIHN1YmplY3QubGVuZ3RoID09PSAnbnVtYmVyJ1xufVxuXG5mdW5jdGlvbiB0b0hleCAobikge1xuICBpZiAobiA8IDE2KSByZXR1cm4gJzAnICsgbi50b1N0cmluZygxNilcbiAgcmV0dXJuIG4udG9TdHJpbmcoMTYpXG59XG5cbmZ1bmN0aW9uIHV0ZjhUb0J5dGVzIChzdHIpIHtcbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGIgPSBzdHIuY2hhckNvZGVBdChpKVxuICAgIGlmIChiIDw9IDB4N0YpXG4gICAgICBieXRlQXJyYXkucHVzaChzdHIuY2hhckNvZGVBdChpKSlcbiAgICBlbHNlIHtcbiAgICAgIHZhciBzdGFydCA9IGlcbiAgICAgIGlmIChiID49IDB4RDgwMCAmJiBiIDw9IDB4REZGRikgaSsrXG4gICAgICB2YXIgaCA9IGVuY29kZVVSSUNvbXBvbmVudChzdHIuc2xpY2Uoc3RhcnQsIGkrMSkpLnN1YnN0cigxKS5zcGxpdCgnJScpXG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGgubGVuZ3RoOyBqKyspXG4gICAgICAgIGJ5dGVBcnJheS5wdXNoKHBhcnNlSW50KGhbal0sIDE2KSlcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiBhc2NpaVRvQnl0ZXMgKHN0cikge1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICAvLyBOb2RlJ3MgY29kZSBzZWVtcyB0byBiZSBkb2luZyB0aGlzIGFuZCBub3QgJiAweDdGLi5cbiAgICBieXRlQXJyYXkucHVzaChzdHIuY2hhckNvZGVBdChpKSAmIDB4RkYpXG4gIH1cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiB1dGYxNmxlVG9CeXRlcyAoc3RyKSB7XG4gIHZhciBjLCBoaSwgbG9cbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgYyA9IHN0ci5jaGFyQ29kZUF0KGkpXG4gICAgaGkgPSBjID4+IDhcbiAgICBsbyA9IGMgJSAyNTZcbiAgICBieXRlQXJyYXkucHVzaChsbylcbiAgICBieXRlQXJyYXkucHVzaChoaSlcbiAgfVxuXG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuZnVuY3Rpb24gYmFzZTY0VG9CeXRlcyAoc3RyKSB7XG4gIHJldHVybiBiYXNlNjQudG9CeXRlQXJyYXkoc3RyKVxufVxuXG5mdW5jdGlvbiBibGl0QnVmZmVyIChzcmMsIGRzdCwgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIHBvc1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKChpICsgb2Zmc2V0ID49IGRzdC5sZW5ndGgpIHx8IChpID49IHNyYy5sZW5ndGgpKVxuICAgICAgYnJlYWtcbiAgICBkc3RbaSArIG9mZnNldF0gPSBzcmNbaV1cbiAgfVxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiBkZWNvZGVVdGY4Q2hhciAoc3RyKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChzdHIpXG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKDB4RkZGRCkgLy8gVVRGIDggaW52YWxpZCBjaGFyXG4gIH1cbn1cblxuLypcbiAqIFdlIGhhdmUgdG8gbWFrZSBzdXJlIHRoYXQgdGhlIHZhbHVlIGlzIGEgdmFsaWQgaW50ZWdlci4gVGhpcyBtZWFucyB0aGF0IGl0XG4gKiBpcyBub24tbmVnYXRpdmUuIEl0IGhhcyBubyBmcmFjdGlvbmFsIGNvbXBvbmVudCBhbmQgdGhhdCBpdCBkb2VzIG5vdFxuICogZXhjZWVkIHRoZSBtYXhpbXVtIGFsbG93ZWQgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIHZlcmlmdWludCAodmFsdWUsIG1heCkge1xuICBhc3NlcnQodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJywgJ2Nhbm5vdCB3cml0ZSBhIG5vbi1udW1iZXIgYXMgYSBudW1iZXInKVxuICBhc3NlcnQodmFsdWUgPj0gMCwgJ3NwZWNpZmllZCBhIG5lZ2F0aXZlIHZhbHVlIGZvciB3cml0aW5nIGFuIHVuc2lnbmVkIHZhbHVlJylcbiAgYXNzZXJ0KHZhbHVlIDw9IG1heCwgJ3ZhbHVlIGlzIGxhcmdlciB0aGFuIG1heGltdW0gdmFsdWUgZm9yIHR5cGUnKVxuICBhc3NlcnQoTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlLCAndmFsdWUgaGFzIGEgZnJhY3Rpb25hbCBjb21wb25lbnQnKVxufVxuXG5mdW5jdGlvbiB2ZXJpZnNpbnQgKHZhbHVlLCBtYXgsIG1pbikge1xuICBhc3NlcnQodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJywgJ2Nhbm5vdCB3cml0ZSBhIG5vbi1udW1iZXIgYXMgYSBudW1iZXInKVxuICBhc3NlcnQodmFsdWUgPD0gbWF4LCAndmFsdWUgbGFyZ2VyIHRoYW4gbWF4aW11bSBhbGxvd2VkIHZhbHVlJylcbiAgYXNzZXJ0KHZhbHVlID49IG1pbiwgJ3ZhbHVlIHNtYWxsZXIgdGhhbiBtaW5pbXVtIGFsbG93ZWQgdmFsdWUnKVxuICBhc3NlcnQoTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlLCAndmFsdWUgaGFzIGEgZnJhY3Rpb25hbCBjb21wb25lbnQnKVxufVxuXG5mdW5jdGlvbiB2ZXJpZklFRUU3NTQgKHZhbHVlLCBtYXgsIG1pbikge1xuICBhc3NlcnQodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJywgJ2Nhbm5vdCB3cml0ZSBhIG5vbi1udW1iZXIgYXMgYSBudW1iZXInKVxuICBhc3NlcnQodmFsdWUgPD0gbWF4LCAndmFsdWUgbGFyZ2VyIHRoYW4gbWF4aW11bSBhbGxvd2VkIHZhbHVlJylcbiAgYXNzZXJ0KHZhbHVlID49IG1pbiwgJ3ZhbHVlIHNtYWxsZXIgdGhhbiBtaW5pbXVtIGFsbG93ZWQgdmFsdWUnKVxufVxuXG5mdW5jdGlvbiBhc3NlcnQgKHRlc3QsIG1lc3NhZ2UpIHtcbiAgaWYgKCF0ZXN0KSB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSB8fCAnRmFpbGVkIGFzc2VydGlvbicpXG59XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiRlQ1T1JzXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2J1ZmZlci9pbmRleC5qc1wiLFwiLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9idWZmZXJcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG5leHBvcnRzLnJlYWQgPSBmdW5jdGlvbiAoYnVmZmVyLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbVxuICB2YXIgZUxlbiA9IG5CeXRlcyAqIDggLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIG5CaXRzID0gLTdcbiAgdmFyIGkgPSBpc0xFID8gKG5CeXRlcyAtIDEpIDogMFxuICB2YXIgZCA9IGlzTEUgPyAtMSA6IDFcbiAgdmFyIHMgPSBidWZmZXJbb2Zmc2V0ICsgaV1cblxuICBpICs9IGRcblxuICBlID0gcyAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBzID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBlTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IGUgPSBlICogMjU2ICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpIHt9XG5cbiAgbSA9IGUgJiAoKDEgPDwgKC1uQml0cykpIC0gMSlcbiAgZSA+Pj0gKC1uQml0cylcbiAgbkJpdHMgKz0gbUxlblxuICBmb3IgKDsgbkJpdHMgPiAwOyBtID0gbSAqIDI1NiArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KSB7fVxuXG4gIGlmIChlID09PSAwKSB7XG4gICAgZSA9IDEgLSBlQmlhc1xuICB9IGVsc2UgaWYgKGUgPT09IGVNYXgpIHtcbiAgICByZXR1cm4gbSA/IE5hTiA6ICgocyA/IC0xIDogMSkgKiBJbmZpbml0eSlcbiAgfSBlbHNlIHtcbiAgICBtID0gbSArIE1hdGgucG93KDIsIG1MZW4pXG4gICAgZSA9IGUgLSBlQmlhc1xuICB9XG4gIHJldHVybiAocyA/IC0xIDogMSkgKiBtICogTWF0aC5wb3coMiwgZSAtIG1MZW4pXG59XG5cbmV4cG9ydHMud3JpdGUgPSBmdW5jdGlvbiAoYnVmZmVyLCB2YWx1ZSwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG0sIGNcbiAgdmFyIGVMZW4gPSBuQnl0ZXMgKiA4IC0gbUxlbiAtIDFcbiAgdmFyIGVNYXggPSAoMSA8PCBlTGVuKSAtIDFcbiAgdmFyIGVCaWFzID0gZU1heCA+PiAxXG4gIHZhciBydCA9IChtTGVuID09PSAyMyA/IE1hdGgucG93KDIsIC0yNCkgLSBNYXRoLnBvdygyLCAtNzcpIDogMClcbiAgdmFyIGkgPSBpc0xFID8gMCA6IChuQnl0ZXMgLSAxKVxuICB2YXIgZCA9IGlzTEUgPyAxIDogLTFcbiAgdmFyIHMgPSB2YWx1ZSA8IDAgfHwgKHZhbHVlID09PSAwICYmIDEgLyB2YWx1ZSA8IDApID8gMSA6IDBcblxuICB2YWx1ZSA9IE1hdGguYWJzKHZhbHVlKVxuXG4gIGlmIChpc05hTih2YWx1ZSkgfHwgdmFsdWUgPT09IEluZmluaXR5KSB7XG4gICAgbSA9IGlzTmFOKHZhbHVlKSA/IDEgOiAwXG4gICAgZSA9IGVNYXhcbiAgfSBlbHNlIHtcbiAgICBlID0gTWF0aC5mbG9vcihNYXRoLmxvZyh2YWx1ZSkgLyBNYXRoLkxOMilcbiAgICBpZiAodmFsdWUgKiAoYyA9IE1hdGgucG93KDIsIC1lKSkgPCAxKSB7XG4gICAgICBlLS1cbiAgICAgIGMgKj0gMlxuICAgIH1cbiAgICBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIHZhbHVlICs9IHJ0IC8gY1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSArPSBydCAqIE1hdGgucG93KDIsIDEgLSBlQmlhcylcbiAgICB9XG4gICAgaWYgKHZhbHVlICogYyA+PSAyKSB7XG4gICAgICBlKytcbiAgICAgIGMgLz0gMlxuICAgIH1cblxuICAgIGlmIChlICsgZUJpYXMgPj0gZU1heCkge1xuICAgICAgbSA9IDBcbiAgICAgIGUgPSBlTWF4XG4gICAgfSBlbHNlIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgbSA9ICh2YWx1ZSAqIGMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pXG4gICAgICBlID0gZSArIGVCaWFzXG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSB2YWx1ZSAqIE1hdGgucG93KDIsIGVCaWFzIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKVxuICAgICAgZSA9IDBcbiAgICB9XG4gIH1cblxuICBmb3IgKDsgbUxlbiA+PSA4OyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBtICYgMHhmZiwgaSArPSBkLCBtIC89IDI1NiwgbUxlbiAtPSA4KSB7fVxuXG4gIGUgPSAoZSA8PCBtTGVuKSB8IG1cbiAgZUxlbiArPSBtTGVuXG4gIGZvciAoOyBlTGVuID4gMDsgYnVmZmVyW29mZnNldCArIGldID0gZSAmIDB4ZmYsIGkgKz0gZCwgZSAvPSAyNTYsIGVMZW4gLT0gOCkge31cblxuICBidWZmZXJbb2Zmc2V0ICsgaSAtIGRdIHw9IHMgKiAxMjhcbn1cblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJGVDVPUnNcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvaWVlZTc1NC9pbmRleC5qc1wiLFwiLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9pZWVlNzU0XCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxucHJvY2Vzcy5uZXh0VGljayA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNhblNldEltbWVkaWF0ZSA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnNldEltbWVkaWF0ZTtcbiAgICB2YXIgY2FuUG9zdCA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnBvc3RNZXNzYWdlICYmIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyXG4gICAgO1xuXG4gICAgaWYgKGNhblNldEltbWVkaWF0ZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIHdpbmRvdy5zZXRJbW1lZGlhdGUoZikgfTtcbiAgICB9XG5cbiAgICBpZiAoY2FuUG9zdCkge1xuICAgICAgICB2YXIgcXVldWUgPSBbXTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgICAgIHZhciBzb3VyY2UgPSBldi5zb3VyY2U7XG4gICAgICAgICAgICBpZiAoKHNvdXJjZSA9PT0gd2luZG93IHx8IHNvdXJjZSA9PT0gbnVsbCkgJiYgZXYuZGF0YSA9PT0gJ3Byb2Nlc3MtdGljaycpIHtcbiAgICAgICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICBpZiAocXVldWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZm4gPSBxdWV1ZS5zaGlmdCgpO1xuICAgICAgICAgICAgICAgICAgICBmbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdHJ1ZSk7XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgICAgICBxdWV1ZS5wdXNoKGZuKTtcbiAgICAgICAgICAgIHdpbmRvdy5wb3N0TWVzc2FnZSgncHJvY2Vzcy10aWNrJywgJyonKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgc2V0VGltZW91dChmbiwgMCk7XG4gICAgfTtcbn0pKCk7XG5cbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufVxuXG4vLyBUT0RPKHNodHlsbWFuKVxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiRlQ1T1JzXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qc1wiLFwiLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9wcm9jZXNzXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBfdG9Db25zdW1hYmxlQXJyYXkoYXJyKSB7IGlmIChBcnJheS5pc0FycmF5KGFycikpIHsgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBBcnJheShhcnIubGVuZ3RoKTsgaSA8IGFyci5sZW5ndGg7IGkrKykgeyBhcnIyW2ldID0gYXJyW2ldOyB9IHJldHVybiBhcnIyOyB9IGVsc2UgeyByZXR1cm4gQXJyYXkuZnJvbShhcnIpOyB9IH1cblxudmFyIHRpbWUgPSA3NTA7XG52YXIgc2VjdGlvbjNJZHggPSAwO1xudmFyIHNlY3Rpb240SWR4ID0gMDtcblxudmFyIG1hc3Rlck9iaiA9IHtcblx0c2VjdGlvbjJDdXJyZW50SWR4OiAwLFxuXHRzZWN0aW9uMUN1cnJlbnRJZHg6IDAsXG5cdHNlY3Rpb24zOiB7XG5cdFx0YXV0b21hdGU6ICcnLFxuXHRcdGlzQXV0b21hdGVkOiBmYWxzZVxuXHR9LFxuXHRzZWN0aW9uNDoge1xuXHRcdGF1dG9tYXRlOiAnJyxcblx0XHRpc0F1dG9tYXRlZDogZmFsc2Vcblx0fSxcblx0YmFza2V0YmFsbDogeyBsb29wQW1vdW50OiAxIH0sXG5cdGZvb3RiYWxsOiB7IGxvb3BBbW91bnQ6IDEgfSxcblx0dGVubmlzOiB7IGxvb3BBbW91bnQ6IDEgfSxcblx0YmFzZWJhbGw6IHsgbG9vcEFtb3VudDogMSB9LFxuXHRmYW46IHsgbG9vcEFtb3VudDogMSB9XG59O1xuXG52YXIgaG9tZXBhZ2VNb2JJbWFnZXMgPSBbJ2Fzc2V0cy9pbWFnZXMvaG9tZXBhZ2VNb2IvYmFza2V0YmFsbC5qcGcnLCAnYXNzZXRzL2ltYWdlcy9ob21lcGFnZU1vYi9mb290YmFsbC5qcGcnLCAnYXNzZXRzL2ltYWdlcy9ob21lcGFnZU1vYi90ZW5uaXMuanBnJywgJ2Fzc2V0cy9pbWFnZXMvaG9tZXBhZ2VNb2IvYmFzZWJhbGwuanBnJywgJ2Fzc2V0cy9pbWFnZXMvaG9tZXBhZ2VNb2IvZmFuLmpwZyddO1xuXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG5cdGlmICh3aW5kb3cuaW5uZXJXaWR0aCA8IDgwMCkge1xuXHRcdC8vIElGIFRIRSBXSU5ET1cgSVMgU01BTExFUiBUSEFUIDgwMFBYIEZFVENIIFRIRSBKU09OIEZPUiBUSEUgSUNPTiBBTklNQVRJT04gQU5EIEFUQUNIIFRIRSBBTklNQVRJT05TIFNFUEVSQVRFTFkgVE8gbWFzdGVyT2JqIFxcXFxcblx0XHRmZXRjaCgnYXNzZXRzL2pzL0ZhbnRhc3RlY19TcHJpdGVfU2hlZXQuanNvbicpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG5cdFx0XHRyZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuXHRcdH0pLnRoZW4oZnVuY3Rpb24gKHNwcml0ZU9iaikge1xuXHRcdFx0dmFyIElkbGVGcmFtZSA9IGZpbHRlckJ5VmFsdWUoc3ByaXRlT2JqLmZyYW1lcywgJ2lkbGUnKTtcblx0XHRcdG1hc3Rlck9iai5mb290YmFsbC5hbmltYXRpb25BcnJheSA9IFtdLmNvbmNhdChfdG9Db25zdW1hYmxlQXJyYXkoSWRsZUZyYW1lKSwgX3RvQ29uc3VtYWJsZUFycmF5KGZpbHRlckJ5VmFsdWUoc3ByaXRlT2JqLmZyYW1lcywgJ2Zvb3RiYWxsJykpKTtcblx0XHRcdG1hc3Rlck9iai50ZW5uaXMuYW5pbWF0aW9uQXJyYXkgPSBbXS5jb25jYXQoX3RvQ29uc3VtYWJsZUFycmF5KElkbGVGcmFtZSksIF90b0NvbnN1bWFibGVBcnJheShmaWx0ZXJCeVZhbHVlKHNwcml0ZU9iai5mcmFtZXMsICd0ZW5uaXMnKSkpO1xuXHRcdFx0bWFzdGVyT2JqLmJhc2ViYWxsLmFuaW1hdGlvbkFycmF5ID0gW10uY29uY2F0KF90b0NvbnN1bWFibGVBcnJheShJZGxlRnJhbWUpLCBfdG9Db25zdW1hYmxlQXJyYXkoZmlsdGVyQnlWYWx1ZShzcHJpdGVPYmouZnJhbWVzLCAnYmFzZWJhbGwnKSkpO1xuXHRcdFx0bWFzdGVyT2JqLmJhc2tldGJhbGwuYW5pbWF0aW9uQXJyYXkgPSBbXS5jb25jYXQoX3RvQ29uc3VtYWJsZUFycmF5KElkbGVGcmFtZSksIF90b0NvbnN1bWFibGVBcnJheShmaWx0ZXJCeVZhbHVlKHNwcml0ZU9iai5mcmFtZXMsICdiYXNrZXQnKSkpO1xuXHRcdFx0bWFzdGVyT2JqLmZhbi5hbmltYXRpb25BcnJheSA9IFtdLmNvbmNhdChfdG9Db25zdW1hYmxlQXJyYXkoSWRsZUZyYW1lKSwgX3RvQ29uc3VtYWJsZUFycmF5KGZpbHRlckJ5VmFsdWUoc3ByaXRlT2JqLmZyYW1lcywgJ2ZhbicpKSk7XG5cdFx0XHQvLyBDQUxMIEFOSU1BVE9SIFNFVFVQIEZVTkNUSU9OIEFORCBTVEFSVCBUSEUgSU1BR0UgU0xJREVTSE9XIEZPUiBTRUNUSU9OIDEgKEhPTUVQQUdFKSBcXFxcXHRcdFx0XG5cdFx0XHRhbmltYXRvclNldHVwKCk7XG5cdFx0XHRpbWFnZUNvbnRyb2xlcihtYXN0ZXJPYmosIDEpO1xuXHRcdFx0Ly8gQ0FMTCBUSEUgaW1hZ2VDb250cm9sZXIgRlVOQ1RJT04gRVZFUlkgNSBTRUNPTkRTIFRPIENIQU5HRSBUSEUgSU1BR0UgRk9SIFNFQ1RJT04gMSAoSE9NRVBBR0UpIFxcXFxcblx0XHRcdHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0aW1hZ2VDb250cm9sZXIobWFzdGVyT2JqLCAxKTtcblx0XHRcdH0sIDUwMDApO1xuXHRcdH0pO1xuXHR9XG5cdC8vIEZVTkNUSU9OIFRPIFNFUEVSQVRFIFRIRSBBTklNQVRJT04gRlJBTUVTIEJZIE5BTUUgXFxcXFxuXHR2YXIgZmlsdGVyQnlWYWx1ZSA9IGZ1bmN0aW9uIGZpbHRlckJ5VmFsdWUoYXJyYXksIHN0cmluZykge1xuXHRcdHJldHVybiBhcnJheS5maWx0ZXIoZnVuY3Rpb24gKG8pIHtcblx0XHRcdHJldHVybiB0eXBlb2Ygb1snZmlsZW5hbWUnXSA9PT0gJ3N0cmluZycgJiYgb1snZmlsZW5hbWUnXS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHN0cmluZy50b0xvd2VyQ2FzZSgpKTtcblx0XHR9KTtcblx0fTtcblx0Ly8gR0VORVJJQyBTRVRVUCBGVU5DVElPTiBGT1IgQURESU5HIFZFTkRPUiBQUkVGSVhFUyBUTyByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgXFxcXFxuXHR2YXIgYW5pbWF0b3JTZXR1cCA9IGZ1bmN0aW9uIGFuaW1hdG9yU2V0dXAoKSB7XG5cblx0XHR2YXIgbGFzdFRpbWUgPSAwO1xuXHRcdHZhciB2ZW5kb3JzID0gWydtcycsICdtb3onLCAnd2Via2l0JywgJ28nXTtcblx0XHRmb3IgKHZhciB4ID0gMDsgeCA8IHZlbmRvcnMubGVuZ3RoICYmICF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lOyArK3gpIHtcblx0XHRcdHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSB3aW5kb3dbdmVuZG9yc1t4XSArICdSZXF1ZXN0QW5pbWF0aW9uRnJhbWUnXTtcblx0XHRcdHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ0NhbmNlbEFuaW1hdGlvbkZyYW1lJ10gfHwgd2luZG93W3ZlbmRvcnNbeF0gKyAnQ2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ107XG5cdFx0fVxuXG5cdFx0aWYgKCF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24gKGNhbGxiYWNrLCBlbGVtZW50KSB7XG5cdFx0XHR2YXIgY3VyclRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblx0XHRcdHZhciB0aW1lVG9DYWxsID0gTWF0aC5tYXgoMCwgMTYgLSAoY3VyclRpbWUgLSBsYXN0VGltZSkpO1xuXHRcdFx0dmFyIGlkID0gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRjYWxsYmFjayhjdXJyVGltZSArIHRpbWVUb0NhbGwpO1xuXHRcdFx0fSwgdGltZVRvQ2FsbCk7XG5cdFx0XHRsYXN0VGltZSA9IGN1cnJUaW1lICsgdGltZVRvQ2FsbDtcblx0XHRcdHJldHVybiBpZDtcblx0XHR9O1xuXG5cdFx0aWYgKCF3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUpIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uIChpZCkge1xuXHRcdFx0Y2xlYXJUaW1lb3V0KGlkKTtcblx0XHR9O1xuXHR9O1xuXG5cdHZhciBhbmltYXRvciA9IGZ1bmN0aW9uIGFuaW1hdG9yKGFuaW1hdGlvbk9iaikge1xuXG5cdFx0dmFyIGRhbmNpbmdJY29uLCBzcHJpdGVJbWFnZSwgY2FudmFzO1xuXHRcdC8vIEZVTkNUSU9OIFRPIFBBU1MgVE8gcmVxdWVzdEFuaW1hdGlvbkZyYW1lIFxcXFxcblx0XHRmdW5jdGlvbiBnYW1lTG9vcCgpIHtcblx0XHRcdCQoJyNsb2FkaW5nJykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuXHRcdFx0YW5pbWF0aW9uT2JqLmxvb3BJZCA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZ2FtZUxvb3ApO1xuXHRcdFx0ZGFuY2luZ0ljb24udXBkYXRlKCk7XG5cdFx0XHRkYW5jaW5nSWNvbi5yZW5kZXIoKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzcHJpdGUob3B0aW9ucykge1xuXG5cdFx0XHR2YXIgdGhhdCA9IHt9LFxuXHRcdFx0ICAgIGZyYW1lSW5kZXggPSAwLFxuXHRcdFx0ICAgIHRpY2tDb3VudCA9IDAsXG5cdFx0XHQgICAgbG9vcENvdW50ID0gMCxcblx0XHRcdCAgICB0aWNrc1BlckZyYW1lID0gb3B0aW9ucy50aWNrc1BlckZyYW1lIHx8IDAsXG5cdFx0XHQgICAgbnVtYmVyT2ZGcmFtZXMgPSBvcHRpb25zLm51bWJlck9mRnJhbWVzIHx8IDE7XG5cblx0XHRcdHRoYXQuY29udGV4dCA9IG9wdGlvbnMuY29udGV4dDtcblx0XHRcdHRoYXQud2lkdGggPSBvcHRpb25zLndpZHRoO1xuXHRcdFx0dGhhdC5oZWlnaHQgPSBvcHRpb25zLmhlaWdodDtcblx0XHRcdHRoYXQuaW1hZ2UgPSBvcHRpb25zLmltYWdlO1xuXHRcdFx0dGhhdC5sb29wcyA9IG9wdGlvbnMubG9vcHM7XG5cblx0XHRcdHRoYXQudXBkYXRlID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRcdHRpY2tDb3VudCArPSAxO1xuXG5cdFx0XHRcdGlmICh0aWNrQ291bnQgPiB0aWNrc1BlckZyYW1lKSB7XG5cblx0XHRcdFx0XHR0aWNrQ291bnQgPSAwO1xuXHRcdFx0XHRcdC8vIElmIHRoZSBjdXJyZW50IGZyYW1lIGluZGV4IGlzIGluIHJhbmdlXG5cdFx0XHRcdFx0aWYgKGZyYW1lSW5kZXggPCBudW1iZXJPZkZyYW1lcyAtIDEpIHtcblx0XHRcdFx0XHRcdC8vIEdvIHRvIHRoZSBuZXh0IGZyYW1lXG5cdFx0XHRcdFx0XHRmcmFtZUluZGV4ICs9IDE7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGxvb3BDb3VudCsrO1xuXHRcdFx0XHRcdFx0ZnJhbWVJbmRleCA9IDA7XG5cblx0XHRcdFx0XHRcdGlmIChsb29wQ291bnQgPT09IHRoYXQubG9vcHMpIHtcblx0XHRcdFx0XHRcdFx0d2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKGFuaW1hdGlvbk9iai5sb29wSWQpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0dGhhdC5yZW5kZXIgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRcdFx0Ly8gQ2xlYXIgdGhlIGNhbnZhc1xuXHRcdFx0XHR0aGF0LmNvbnRleHQuY2xlYXJSZWN0KDAsIDAsIHRoYXQud2lkdGgsIHRoYXQuaGVpZ2h0KTtcblxuXHRcdFx0XHR0aGF0LmNvbnRleHQuZHJhd0ltYWdlKHRoYXQuaW1hZ2UsIGFuaW1hdGlvbk9iai5hbmltYXRpb25BcnJheVtmcmFtZUluZGV4XS5mcmFtZS54LCBhbmltYXRpb25PYmouYW5pbWF0aW9uQXJyYXlbZnJhbWVJbmRleF0uZnJhbWUueSwgMjAwLCAxNzUsIDAsIDAsIHdpbmRvdy5pbm5lcldpZHRoIC8gMy44NDYsIHdpbmRvdy5pbm5lcldpZHRoIC8gNC4xKTtcblx0XHRcdH07XG5cblx0XHRcdHJldHVybiB0aGF0O1xuXHRcdH1cblxuXHRcdC8vIEdldCBjYW52YXNcblx0XHRjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJyk7XG5cdFx0Y2FudmFzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGggLyAzLjg0Njtcblx0XHRjYW52YXMuaGVpZ2h0ID0gd2luZG93LmlubmVyV2lkdGggLyAyLjI7XG5cblx0XHQvLyBDcmVhdGUgc3ByaXRlIHNoZWV0XG5cdFx0c3ByaXRlSW1hZ2UgPSBuZXcgSW1hZ2UoKTtcblxuXHRcdC8vIENyZWF0ZSBzcHJpdGVcblx0XHRkYW5jaW5nSWNvbiA9IHNwcml0ZSh7XG5cdFx0XHRjb250ZXh0OiBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpLFxuXHRcdFx0d2lkdGg6IDQwNDAsXG5cdFx0XHRoZWlnaHQ6IDE3NzAsXG5cdFx0XHRpbWFnZTogc3ByaXRlSW1hZ2UsXG5cdFx0XHRudW1iZXJPZkZyYW1lczogYW5pbWF0aW9uT2JqLmFuaW1hdGlvbkFycmF5Lmxlbmd0aCxcblx0XHRcdHRpY2tzUGVyRnJhbWU6IDQsXG5cdFx0XHRsb29wczogYW5pbWF0aW9uT2JqLmxvb3BBbW91bnRcblx0XHR9KTtcblxuXHRcdC8vIExvYWQgc3ByaXRlIHNoZWV0XG5cdFx0c3ByaXRlSW1hZ2UuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgZ2FtZUxvb3ApO1xuXHRcdHNwcml0ZUltYWdlLnNyYyA9ICdhc3NldHMvaW1hZ2VzL0ZhbnRhc3RlY19TcHJpdGVfU2hlZXQucG5nJztcblx0fTtcblxuXHQvLyBJTklUSUFMSVNFIEFORCBTRVRVUCBDVVJSRU5UIFBBR0UuIEVYRUNVVEUgVFJBTlNJVElPTlMgQU5EIFJFTU9WRSBUSU5UIElGIFJFTEVWQU5UIFxcXFxcblxuXHR2YXIgcGFnZUxvYWRlciA9IGZ1bmN0aW9uIHBhZ2VMb2FkZXIoaW5kZXgpIHtcblx0XHRpZiAoaW5kZXggPT09IDUpIHtcblx0XHRcdCQoJy50aW50JykucmVtb3ZlQ2xhc3MoJ3JlbW92ZVRpbnQnKTtcblx0XHRcdCQoJy5iYWNrZ3JvdW5kV3JhcHBlcicpLnJlbW92ZUNsYXNzKCdzY2FsZUJhY2tncm91bmQnKTtcblx0XHRcdCQoJyNzZWN0aW9uNScpLmZpbmQoJy5oZWFkaW5nJykuYWRkQ2xhc3MoJ3Nob3cgZmFkZUluJyk7XG5cdFx0XHQkKCcuc3ViU2VjdGlvbicpLmFkZENsYXNzKCdzY2FsZUJhY2tncm91bmQnKTtcblx0XHRcdCQoJy5zdWJTZWN0aW9uJykuZmluZCgnLnRpbnQnKS5hZGRDbGFzcygncmVtb3ZlVGludCcpO1xuXHRcdFx0JCgnI3NlY3Rpb241JykuZmluZCgnLnRleHRXcmFwcGVyJykuYWRkQ2xhc3MoJ3Nob3cnKTtcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHQkKCcuc3ViU2VjdGlvbiA+IC50ZXh0V3JhcHBlcicpLmZpbmQoJy5oZWFkaW5nJykuYWRkQ2xhc3MoJ2ZhZGVJbicpO1xuXHRcdFx0fSwgMTAwMCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCQoJy50aW50JykucmVtb3ZlQ2xhc3MoJ3JlbW92ZVRpbnQnKTtcblx0XHRcdCQoJy5zdWJTZWN0aW9uJykucmVtb3ZlQ2xhc3MoJ3NjYWxlQmFja2dyb3VuZCcpO1xuXHRcdFx0JCgnLmJhY2tncm91bmRXcmFwcGVyOm5vdCgjc2VjdGlvbicgKyBpbmRleCArICdCYWNrZ3JvdW5kKScpLnJlbW92ZUNsYXNzKCdzY2FsZUJhY2tncm91bmQnKTtcblx0XHRcdCQoJy5zZWN0aW9uLmFjdGl2ZScpLmZpbmQoJy5iYWNrZ3JvdW5kV3JhcHBlcicpLmFkZENsYXNzKCdzY2FsZUJhY2tncm91bmQnKTtcblx0XHRcdCQoJ3NlY3Rpb24uYWN0aXZlJykuZmluZCgnLnRpbnQnKS5hZGRDbGFzcygncmVtb3ZlVGludCcpO1xuXG5cdFx0XHRpZiAoJCgnLnNlY3Rpb24nICsgaW5kZXggKyAnUGFnaW5hdG9yQnV0dG9uJykubGVuZ3RoICYmICQoJy5zZWN0aW9uJyArIGluZGV4ICsgJ1BhZ2luYXRvckJ1dHRvbi5hY3RpdmUnKS5sZW5ndGggPCAxKSB7XG5cdFx0XHRcdCQoJy5zZWN0aW9uJyArIGluZGV4ICsgJ1BhZ2luYXRvckJ1dHRvbicpLmdldCgwKS5jbGljaygpO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHQvLyBISURFIEFMTCBCRUNLR1JPVU5EUyBJTiBUSEUgU0VDVElPTiBFWENFUFQgVEhFIFNQRUNJRklFRCBJTkRFWCwgV0hJQ0ggSVMgU0NBTEVEIEFORCBTSE9XTi4gXFxcXFxuXG5cdHZhciBpbml0aWFsaXplU2VjdGlvbiA9IGZ1bmN0aW9uIGluaXRpYWxpemVTZWN0aW9uKHNlY3Rpb25OdW1iZXIsIGlkeCkge1xuXHRcdCQoJyNzZWN0aW9uJyArIHNlY3Rpb25OdW1iZXIgKyAnQmFja2dyb3VuZCcgKyBpZHgpLnNpYmxpbmdzKCcuYmFja2dyb3VuZFdyYXBwZXInKS5tYXAoZnVuY3Rpb24gKGl4LCBlbGUpIHtcblx0XHRcdCQoZWxlKS5jc3MoeyBvcGFjaXR5OiAwIH0pO1xuXHRcdH0pO1xuXG5cdFx0JCgnI3NlY3Rpb24nICsgc2VjdGlvbk51bWJlciArICdCYWNrZ3JvdW5kJyArIGlkeCkuY3NzKHtcblx0XHRcdCd0cmFuc2Zvcm0nOiAnc2NhbGUoMS4xKScsXG5cdFx0XHQnb3BhY2l0eSc6IDFcblx0XHR9KTtcblx0fTtcblxuXHQvLyBDQUxMIGluaXRpYWxpemVTZWN0aW9uIE9OIFNFQ1RJT05TIDEsIDMgQU5EIDQuIFxcXFxcblx0aW5pdGlhbGl6ZVNlY3Rpb24oMSwgMCk7XG5cdGluaXRpYWxpemVTZWN0aW9uKDMsIDApO1xuXHRpbml0aWFsaXplU2VjdGlvbig0LCAwKTtcblxuXHQvLyBCQUNLR1JPVU5EIElNQUdFIFRSQU5TSVRJT04gSEFORExFUi4gXFxcXFxuXG5cdHZhciBpbWFnZUNvbnRyb2xlciA9IGZ1bmN0aW9uIGltYWdlQ29udHJvbGVyKGlkeE9iaiwgc2VjdGlvbk51bWJlcikge1xuXHRcdHZhciByZWxldmFudEFuaW1hdGlvbiA9IHZvaWQgMDtcblxuXHRcdGlmIChzZWN0aW9uTnVtYmVyID09PSAxKSB7XG5cdFx0XHRzd2l0Y2ggKGlkeE9iai5zZWN0aW9uMUN1cnJlbnRJZHgpIHtcblx0XHRcdFx0Y2FzZSAwOlxuXHRcdFx0XHRcdHJlbGV2YW50QW5pbWF0aW9uID0gbWFzdGVyT2JqLmJhc2tldGJhbGw7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgMTpcblx0XHRcdFx0XHRyZWxldmFudEFuaW1hdGlvbiA9IG1hc3Rlck9iai5mb290YmFsbDtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRcdHJlbGV2YW50QW5pbWF0aW9uID0gbWFzdGVyT2JqLnRlbm5pcztcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAzOlxuXHRcdFx0XHRcdHJlbGV2YW50QW5pbWF0aW9uID0gbWFzdGVyT2JqLmJhc2ViYWxsO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIDQ6XG5cdFx0XHRcdFx0cmVsZXZhbnRBbmltYXRpb24gPSBtYXN0ZXJPYmouZmFuO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdCQoJyNzZWN0aW9uJyArIHNlY3Rpb25OdW1iZXIpLmZpbmQoJy50aW50JykucmVtb3ZlQ2xhc3MoJ3JlbW92ZVRpbnQnKTtcblx0XHQkKCcjc2VjdGlvbicgKyBzZWN0aW9uTnVtYmVyICsgJ0JhY2tncm91bmQnICsgaWR4T2JqWydzZWN0aW9uJyArIHNlY3Rpb25OdW1iZXIgKyAnQ3VycmVudElkeCddKS5yZW1vdmVDbGFzcygnc2NhbGVCYWNrZ3JvdW5kJyk7XG5cdFx0aW5pdGlhbGl6ZVNlY3Rpb24oc2VjdGlvbk51bWJlciwgaWR4T2JqWydzZWN0aW9uJyArIHNlY3Rpb25OdW1iZXIgKyAnQ3VycmVudElkeCddKTtcblxuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0aWYgKHNlY3Rpb25OdW1iZXIgPT09IDEpIHtcblx0XHRcdFx0YW5pbWF0b3IocmVsZXZhbnRBbmltYXRpb24pO1xuXHRcdFx0fVxuXG5cdFx0XHQkKCcjc2VjdGlvbicgKyBzZWN0aW9uTnVtYmVyKS5maW5kKCcuYmFja2dyb3VuZFdyYXBwZXInKS5hZGRDbGFzcygnc2NhbGVCYWNrZ3JvdW5kJyk7XG5cdFx0XHQkKCcjc2VjdGlvbicgKyBzZWN0aW9uTnVtYmVyKS5maW5kKCcudGludCcpLmFkZENsYXNzKCdyZW1vdmVUaW50Jyk7XG5cdFx0fSwgNTAwKTtcblxuXHRcdGlmIChpZHhPYmpbJ3NlY3Rpb24nICsgc2VjdGlvbk51bWJlciArICdDdXJyZW50SWR4J10gPT09ICQoJyNzZWN0aW9uJyArIHNlY3Rpb25OdW1iZXIpLmZpbmQoJy5iYWNrZ3JvdW5kV3JhcHBlcicpLmxlbmd0aCAtIDEpIHtcblx0XHRcdGlkeE9ialsnc2VjdGlvbicgKyBzZWN0aW9uTnVtYmVyICsgJ0N1cnJlbnRJZHgnXSA9IDA7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlkeE9ialsnc2VjdGlvbicgKyBzZWN0aW9uTnVtYmVyICsgJ0N1cnJlbnRJZHgnXSArPSAxO1xuXHRcdH1cblx0fTtcblx0Ly8gU1RBUlQgU0xJREVTSE9XIE9OIFNFQ1RJT04gMiBcXFxcXG5cdGltYWdlQ29udHJvbGVyKG1hc3Rlck9iaiwgMik7XG5cblx0Ly8gQ0hBTkdFIFNFQ1RJT04gMiBCQUNLR1JPVU5EIElNQUdFIEVWRVJZIDE1IFNFQ09ORFMgXFxcXFxuXHRzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG5cdFx0aW1hZ2VDb250cm9sZXIobWFzdGVyT2JqLCAyKTtcblx0fSwgMTUwMDApO1xuXG5cdC8vIFBBR0lOQVRJT04gQlVUVE9OUyBDTElDSyBIQU5ETEVSIEZPUiBTRUNUSU9OUyAzIEFORCA0LiBcXFxcXG5cblx0dmFyIGhhbmRsZVBhbmluYXRpb25CdXR0b25DbGljayA9IGZ1bmN0aW9uIGhhbmRsZVBhbmluYXRpb25CdXR0b25DbGljayhlKSB7XG5cblx0XHR2YXIgaWR4ID0gcGFyc2VJbnQoJChlLnRhcmdldCkuYXR0cignZGF0YS1pbmRleCcpKTtcblx0XHR2YXIgc2VjdGlvbklkID0gJChlLnRhcmdldCkuY2xvc2VzdCgnc2VjdGlvbicpLmF0dHIoJ2lkJyk7XG5cdFx0dmFyIHJlbGV2YW50RGF0YUFycmF5ID0gdm9pZCAwO1xuXG5cdFx0aWYgKHNlY3Rpb25JZCA9PT0gJ3NlY3Rpb24zJykge1xuXHRcdFx0c2VjdGlvbjNJZHggPSBpZHg7XG5cdFx0fVxuXG5cdFx0aWYgKHNlY3Rpb25JZCA9PT0gJ3NlY3Rpb240Jykge1xuXHRcdFx0c2VjdGlvbjRJZHggPSBpZHg7XG5cdFx0fVxuXG5cdFx0JCgnIycgKyBzZWN0aW9uSWQpLmZpbmQoJy50aW50JykucmVtb3ZlQ2xhc3MoJ3JlbW92ZVRpbnQnKTtcblx0XHQkKCcjJyArIHNlY3Rpb25JZCkuZmluZCgnLnRleHRXcmFwcGVyJykucmVtb3ZlQ2xhc3MoJ3Nob3cnKTtcblx0XHQkKCcjJyArIHNlY3Rpb25JZCkuZmluZCgnI3RleHRXcmFwcGVyJyArIGlkeCkuYWRkQ2xhc3MoJ3Nob3cnKTtcblx0XHQkKCcjJyArIHNlY3Rpb25JZCArICdCYWNrZ3JvdW5kJyArIGlkeCkucmVtb3ZlQ2xhc3MoJ3NjYWxlQmFja2dyb3VuZCcpO1xuXHRcdCQoJy4nICsgc2VjdGlvbklkICsgJ1BhZ2luYXRvckJ1dHRvbicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblx0XHQkKGUudGFyZ2V0KS5hZGRDbGFzcygnYWN0aXZlJyk7XG5cblx0XHRpbml0aWFsaXplU2VjdGlvbihwYXJzZUludCgkKCcjJyArIHNlY3Rpb25JZCkuYXR0cignZGF0YS1pbmRleCcpKSwgaWR4KTtcblxuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0cGFnZUxvYWRlcihwYXJzZUludCgkKCcjJyArIHNlY3Rpb25JZCkuYXR0cignZGF0YS1pbmRleCcpKSk7XG5cdFx0fSwgNTAwKTtcblxuXHRcdGlmIChzZWN0aW9uSWQgIT09ICdzZWN0aW9uMicpIHtcblx0XHRcdCQoJyMnICsgc2VjdGlvbklkKS5maW5kKCcuaGVhZGluZywgcCcpLmFkZENsYXNzKCdmYWRlSW4nKTtcblx0XHRcdCQoJyMnICsgc2VjdGlvbklkKS5vbigndHJhbnNpdGlvbmVuZCB3ZWJraXRUcmFuc2l0aW9uRW5kIG9UcmFuc2l0aW9uRW5kJywgZnVuY3Rpb24gKGVzKSB7XG5cdFx0XHRcdCQoJyMnICsgc2VjdGlvbklkKS5maW5kKCcuaGVhZGluZywgcCcpLnJlbW92ZUNsYXNzKCdmYWRlSW4nKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fTtcblxuXHQvLyBDTElDSyBMSVNURU5FUiBGT1IgUEFHSU5BVElPTiBCVVRUT05TIE9OIFNFQ1RJT05TIDMgQU5EIDQuIFxcXFxcblxuXHQkKCcuc2VjdGlvbjNQYWdpbmF0b3JCdXR0b24sIC5zZWN0aW9uNFBhZ2luYXRvckJ1dHRvbicpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XG5cblx0XHRpZiAobWFzdGVyT2JqWyQoZS5jdXJyZW50VGFyZ2V0KS5jbG9zZXN0KCdzZWN0aW9uJykuYXR0cignaWQnKV0uaXNBdXRvbWF0ZWQpIHtcblx0XHRcdC8vIElGIFRIRVJFIElTIEEgUklOTklORyBJTlRFUlZBTCBPTiBUSEUgUkVMRVZBTlQgU0VDVElPTiBDTEVBUiBJVCBcXFxcXG5cdFx0XHRpbnRlcnZhbE1hbmFnZXIoZmFsc2UsICQoZS5jdXJyZW50VGFyZ2V0KS5jbG9zZXN0KCdzZWN0aW9uJykuYXR0cignaWQnKSk7XG5cdFx0XHQvLyBTRVQgQSBORVcgSU5URVJWQUwgT0YgNyBTRUNPTkRTIE9OIFRIRSBTRUNUSU9OIFxcXFxcblx0XHRcdGludGVydmFsTWFuYWdlcih0cnVlLCAkKGUuY3VycmVudFRhcmdldCkuY2xvc2VzdCgnc2VjdGlvbicpLmF0dHIoJ2lkJyksIDcwMDApO1xuXHRcdH1cblx0XHQvLyBDQUxMIFRIRSBDTElDSyBIQU5ETEVSIEZVTkNUSU9OIEFORCBQQVNTIElUIFRIRSBFVkVOVCBJRiBUQVJHRVQgSVMgTk9UIEFMUkVBRFkgQUNUSVZFIFxcXFxcblx0XHRpZiAoISQoZS5jdXJyZW50VGFyZ2V0KS5oYXNDbGFzcygnYWN0aXZlJykpIHtcblx0XHRcdGhhbmRsZVBhbmluYXRpb25CdXR0b25DbGljayhlKTtcblx0XHR9XG5cdH0pO1xuXG5cdC8vIElOSVRJQUxJWkUgT05FUEFHRVNDUk9MTCBJRiBOT1QgSU4gQ01TIFBSRVZJRVcuIFxcXFxcblxuXHRpZiAoISQobG9jYXRpb24pLmF0dHIoJ2hyZWYnKS5pbmNsdWRlcygnaW5kZXgucGhwJykpIHtcblx0XHQkKCcjc2Nyb2xsZXJXcmFwcGVyJykub25lcGFnZV9zY3JvbGwoe1xuXHRcdFx0c2VjdGlvbkNvbnRhaW5lcjogXCJzZWN0aW9uXCIsXG5cdFx0XHRlYXNpbmc6IFwiZWFzZS1vdXRcIixcblx0XHRcdGFuaW1hdGlvblRpbWU6IHRpbWUsXG5cdFx0XHRwYWdpbmF0aW9uOiB0cnVlLFxuXHRcdFx0dXBkYXRlVVJMOiB0cnVlLFxuXHRcdFx0YmVmb3JlTW92ZTogZnVuY3Rpb24gYmVmb3JlTW92ZShpbmRleCkge30sXG5cdFx0XHRhZnRlck1vdmU6IGZ1bmN0aW9uIGFmdGVyTW92ZShpbmRleCkge1xuXHRcdFx0XHQvLyBJTklUSUFMSVpFIFRIRSBDVVJSRU5UIFBBR0UuIFxcXFxcblxuXHRcdFx0XHRwYWdlTG9hZGVyKGluZGV4KTtcblx0XHRcdH0sXG5cdFx0XHRsb29wOiBmYWxzZSxcblx0XHRcdGtleWJvYXJkOiB0cnVlLFxuXHRcdFx0cmVzcG9uc2l2ZUZhbGxiYWNrOiBmYWxzZSxcblx0XHRcdGRpcmVjdGlvbjogXCJ2ZXJ0aWNhbFwiXG5cdFx0fSk7XG5cblx0XHQkKCcjc2Nyb2xsZXJXcmFwcGVyJykubW92ZVRvKDEpO1xuXHR9XG5cblx0Ly8gQ09OVFJPTCBDTElDS1MgT04gV09SSyBXSVRIIFVTIFNFQ1RJT04gKFNFQ1RJT041KS4gXFxcXFxuXG5cdCQoJy5jbGlja2FibGUnKS5jbGljayhmdW5jdGlvbiAoZSkge1xuXHRcdHZhciBjdXJyZW50U2VjdGlvbiA9ICQoZS50YXJnZXQpLmNsb3Nlc3QoJCgnLnN1YlNlY3Rpb24nKSk7XG5cblx0XHRpZiAoY3VycmVudFNlY3Rpb24uaGFzQ2xhc3MoJ29wZW4nKSkge1xuXHRcdFx0Y3VycmVudFNlY3Rpb24ucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcblx0XHRcdGN1cnJlbnRTZWN0aW9uLmZpbmQoJy5idXR0b24sIHAnKS5yZW1vdmVDbGFzcygnZmFkZUluJyk7XG5cdFx0XHRjdXJyZW50U2VjdGlvbi5zaWJsaW5ncygnLnN1YlNlY3Rpb24nKS5tYXAoZnVuY3Rpb24gKGlkeCwgc2VjdGlvbikge1xuXHRcdFx0XHQkKHNlY3Rpb24pLnJlbW92ZUNsYXNzKCdjbG9zZWQnKTtcblx0XHRcdFx0JChzZWN0aW9uKS5maW5kKCcudGludCcpLnJlbW92ZUNsYXNzKCdhZGRUaW50JykuYWRkQ2xhc3MoJ3JlbW92ZVRpbnQnKTtcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjdXJyZW50U2VjdGlvbi5yZW1vdmVDbGFzcygnY2xvc2VkJykuYWRkQ2xhc3MoJ29wZW4nKTtcblx0XHRcdGN1cnJlbnRTZWN0aW9uLm9uKCd0cmFuc2l0aW9uZW5kIHdlYmtpdFRyYW5zaXRpb25FbmQgb1RyYW5zaXRpb25FbmQnLCBmdW5jdGlvbiAoZXMpIHtcblx0XHRcdFx0JCgnLnN1YlNlY3Rpb24ub3BlbicpLmZpbmQoJy5idXR0b24sIHAnKS5hZGRDbGFzcygnZmFkZUluJyk7XG5cdFx0XHR9KTtcblx0XHRcdGN1cnJlbnRTZWN0aW9uLnNpYmxpbmdzKCcuc3ViU2VjdGlvbicpLm1hcChmdW5jdGlvbiAoaWR4LCBzZWN0aW9uKSB7XG5cdFx0XHRcdCQoc2VjdGlvbikucmVtb3ZlQ2xhc3MoJ29wZW4nKS5hZGRDbGFzcygnY2xvc2VkJyk7XG5cdFx0XHRcdCQoc2VjdGlvbikuZmluZCgnLnRpbnQnKS5yZW1vdmVDbGFzcygncmVtb3ZlVGludCcpLmFkZENsYXNzKCdhZGRUaW50Jyk7XG5cdFx0XHRcdCQoc2VjdGlvbikuZmluZCgnLmJ1dHRvbiwgcCcpLnJlbW92ZUNsYXNzKCdmYWRlSW4nKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRjdXJyZW50U2VjdGlvbi5maW5kKCcudGludCcpLnJlbW92ZUNsYXNzKCdhZGRUaW50JykuYWRkQ2xhc3MoJ3JlbW92ZVRpbnQnKTtcblx0fSk7XG5cblx0Ly8gQ09OVFJPTCBGT09URVIgQVJST1cgQ0xJQ0tTLiBcXFxcXG5cblx0JCgnI2Rvd25BcnJvdycpLmNsaWNrKGZ1bmN0aW9uICgpIHtcblx0XHRpZiAoJCh3aW5kb3cpLmhlaWdodCgpICogKCQoJy5wYWdlJykubGVuZ3RoIC0gMSkgPT09IC0kKCcjc2Nyb2xsZXJXcmFwcGVyJykub2Zmc2V0KCkudG9wKSB7XG5cdFx0XHQvLyBNT1ZFIFRPIFRPUCBPRiBQQUdFIElGIENVUlJFTlRMWSBBVCBCT1RUT00gXFxcXFxuXHRcdFx0JCgnI3Njcm9sbGVyV3JhcHBlcicpLm1vdmVUbygxKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JCgnI3Njcm9sbGVyV3JhcHBlcicpLm1vdmVEb3duKCk7XG5cdFx0fVxuXHR9KTtcblxuXHQvLyBISURFIFRIRSBMT0FESU5HIEFOSU1BVElPUE4gV0hFTiBWSURFTyBJUyBSRUFEWSBUTyBQTEFZIE9OIERFU1hLVE9QLiBcXFxcXG5cblx0dmFyIGhpZGVMb2FkaW5nQW5pbWF0aW9uID0gZnVuY3Rpb24gaGlkZUxvYWRpbmdBbmltYXRpb24oKSB7XG5cdFx0aWYgKHdpbmRvdy5pbm5lcldpZHRoID4gODAwICYmICEkKCcjbG9hZGluZycpLmhhc0NsYXNzKCdoaWRkZW4nKSkge1xuXG5cdFx0XHRpZiAoJCgnI3ZpZGVvJykuZ2V0KDApLnJlYWR5U3RhdGUgPT09IDQpIHtcblx0XHRcdFx0JCgnI2xvYWRpbmcnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdC8vIE1BTkFHRU1FTlQgRlVOQ1RJT04gRk9SIFNFVFRJTkcgQU5EIENMRUFSSU5HIFRIRSBTTElERSBBVVRPTUFUSU9OIElOVEVSVkFMUy4gXFxcXFxuXG5cdHZhciBpbnRlcnZhbE1hbmFnZXIgPSBmdW5jdGlvbiBpbnRlcnZhbE1hbmFnZXIoZmxhZywgc2VjdGlvbklkLCB0aW1lKSB7XG5cdFx0aWYgKGZsYWcpIHtcblx0XHRcdG1hc3Rlck9ialtzZWN0aW9uSWRdLmF1dG9tYXRlID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRzd2lwZUNvbnRyb2xsZXIoc2VjdGlvbklkLCAnbCcpO1xuXHRcdFx0fSwgdGltZSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNsZWFySW50ZXJ2YWwobWFzdGVyT2JqW3NlY3Rpb25JZF0uYXV0b21hdGUpO1xuXHRcdH1cblx0fTtcblxuXHQvLyBJRiBOT1QgSU4gQ01TIEFETUlOIFBSRVZJRVcsIFBFUlBFVFVBTExZIENIRUNLIElGIFdFIEFSRSBBVCBUSEUgVE9QIE9GIFRIRSBQQUdFIEFORCBJRiBTTywgRE9OVCBTSE9XIFRIRSBGT09URVIgT1IgR1JFRU4gU0hBUEUuIFxcXFxcblxuXHRpZiAoISQobG9jYXRpb24pLmF0dHIoJ2hyZWYnKS5pbmNsdWRlcygnaW5kZXgucGhwJykpIHtcblx0XHRzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG5cdFx0XHRpZiAoJCgnI3Njcm9sbGVyV3JhcHBlcicpLm9mZnNldCgpLnRvcCA+PSAtKHdpbmRvdy5pbm5lckhlaWdodCAvIDEuOSkpIHtcblx0XHRcdFx0JCgnI2hlYWRlclNoYXBlLCAjZm9vdGVyJykuYWRkQ2xhc3MoJ21vdmVPZmZTY3JlZW4nKTtcblx0XHRcdFx0JCgnI3ZpZGVvJykuZ2V0KDApLnBsYXkoKTtcblx0XHRcdFx0JCgnLmFycm93JykuYWRkQ2xhc3MoJ3B1bHNhdGUnKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCQoJyNoZWFkZXJTaGFwZSwgI2Zvb3RlcicpLnJlbW92ZUNsYXNzKCdtb3ZlT2ZmU2NyZWVuJyk7XG5cdFx0XHRcdCQoJyN2aWRlbycpLmdldCgwKS5wYXVzZSgpO1xuXHRcdFx0XHQkKCcuYXJyb3cnKS5yZW1vdmVDbGFzcygncHVsc2F0ZScpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBST1RBVEUgVEhFIEFSUk9XIElOIFRIRSBGT09URVIgV0hFTiBBVCBUSEUgQk9UVE9NIE9GIFRIRSBQQUdFIFxcXFxcblxuXHRcdFx0aWYgKCQoJyNzY3JvbGxlcldyYXBwZXInKS5vZmZzZXQoKS50b3AgPCAtKHdpbmRvdy5pbm5lckhlaWdodCAqIDQpKSB7XG5cdFx0XHRcdCQoJyNkb3duQXJyb3cnKS5jc3MoeyAndHJhbnNmb3JtJzogJ3JvdGF0ZSgxODBkZWcpIHRyYW5zbGF0ZVgoLTUwJSknIH0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JCgnI2Rvd25BcnJvdycpLmNzcyh7ICd0cmFuc2Zvcm0nOiAndHJhbnNsYXRlWCgtNTAlKSByb3RhdGUoMGRlZyknIH0pO1xuXHRcdFx0fVxuXG5cdFx0XHRoaWRlTG9hZGluZ0FuaW1hdGlvbigpO1xuXG5cdFx0XHQvLyBBREQgTEFORFNDQVBFIFNUWUxFUyBUTyBSRUxFVkFOVCBFTEVNRU5UUyBcXFxcXG5cblx0XHRcdGlmICh3aW5kb3cubWF0Y2hNZWRpYShcIihvcmllbnRhdGlvbjogbGFuZHNjYXBlKVwiKS5tYXRjaGVzICYmIHdpbmRvdy5pbm5lcldpZHRoIDwgODAwKSB7XG5cdFx0XHRcdCQoJy5uYXZfbGluaywgI2hlYWRlclNoYXBlLCAjZm9vdGVyLCAuY3VzdG9tLCAubWFya2VyLCAjc2VjdGlvbjUsIC50ZXh0V3JhcHBlcicpLmFkZENsYXNzKCdsYW5kc2NhcGUnKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCQoJy5uYXZfbGluaywgI2hlYWRlclNoYXBlLCAjZm9vdGVyLCAuY3VzdG9tLCAubWFya2VyLCAjc2VjdGlvbjUsIC50ZXh0V3JhcHBlcicpLnJlbW92ZUNsYXNzKCdsYW5kc2NhcGUnKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCQoJyNzZWN0aW9uMy5hY3RpdmUnKS5sZW5ndGgpIHtcblx0XHRcdFx0Ly8gQVVUT01BVEUgVEhFIFNMSURFUyBPTiBTRUNUSU9QTiAzIEVWRVJZIDcgU0VDT05EUyBJRiBUSEUgU0VDVElPTiBJUyBBQ1RJVkUuIFxcXFxcblx0XHRcdFx0aWYgKG1hc3Rlck9iai5zZWN0aW9uMy5pc0F1dG9tYXRlZCAhPT0gdHJ1ZSkge1xuXHRcdFx0XHRcdG1hc3Rlck9iai5zZWN0aW9uMy5pc0F1dG9tYXRlZCA9IHRydWU7XG5cdFx0XHRcdFx0aW50ZXJ2YWxNYW5hZ2VyKHRydWUsICdzZWN0aW9uMycsIDcwMDApO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBTVE9QIEFVVE9NQVRFRCBTTElERVMgT04gU0VDVElPUE4gMyBJRiBUSEUgU0VDVElPTiBJUyBOT1QgQUNUSVZFLiBcXFxcXG5cdFx0XHRcdGlmIChtYXN0ZXJPYmouc2VjdGlvbjMuaXNBdXRvbWF0ZWQgPT09IHRydWUpIHtcblx0XHRcdFx0XHRpbnRlcnZhbE1hbmFnZXIoZmFsc2UsICdzZWN0aW9uMycpO1xuXHRcdFx0XHRcdG1hc3Rlck9iai5zZWN0aW9uMy5pc0F1dG9tYXRlZCA9IGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmICgkKCcjc2VjdGlvbjQuYWN0aXZlJykubGVuZ3RoKSB7XG5cdFx0XHRcdC8vIEFVVE9NQVRFIFRIRSBTTElERVMgT04gU0VDVElPUE4gNCBFVkVSWSA3IFNFQ09ORFMgSUYgVEhFIFNFQ1RJT04gSVMgQUNUSVZFLiBcXFxcXG5cdFx0XHRcdGlmIChtYXN0ZXJPYmouc2VjdGlvbjQuaXNBdXRvbWF0ZWQgIT09IHRydWUpIHtcblx0XHRcdFx0XHRtYXN0ZXJPYmouc2VjdGlvbjQuaXNBdXRvbWF0ZWQgPSB0cnVlO1xuXHRcdFx0XHRcdGludGVydmFsTWFuYWdlcih0cnVlLCAnc2VjdGlvbjQnLCA3MDAwKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gU1RPUCBBVVRPTUFURUQgU0xJREVTIE9OIFNFQ1RJT1BOIDQgSUYgVEhFIFNFQ1RJT04gSVMgTk9UIEFDVElWRS4gXFxcXFxuXHRcdFx0XHRpZiAobWFzdGVyT2JqLnNlY3Rpb240LmlzQXV0b21hdGVkID09PSB0cnVlKSB7XG5cdFx0XHRcdFx0aW50ZXJ2YWxNYW5hZ2VyKGZhbHNlLCAnc2VjdGlvbjQnKTtcblx0XHRcdFx0XHRtYXN0ZXJPYmouc2VjdGlvbjQuaXNBdXRvbWF0ZWQgPSBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sIDUwMCk7XG5cdH1cblxuXHQvLyBDT05UUk9MIFdIQVQgSEFQUEVOUyBXSEVOIExJTktTIElOIFRIRSBOQVYvTUVOVSBBUkUgQ0xJQ0tFRCBcXFxcXG5cblx0JCgnLm5hdl9saW5rJykuY2xpY2soZnVuY3Rpb24gKGUpIHtcblx0XHR2YXIgcGFnZUlkeCA9IHBhcnNlSW50KCQoZS50YXJnZXQpLmF0dHIoJ2RhdGEtaW5kZXgnKSk7XG5cdFx0JCgnI3Njcm9sbGVyV3JhcHBlcicpLm1vdmVUbyhwYWdlSWR4KTtcblx0XHQkKCcjbWVudUJsb2NrT3V0JykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuXG5cdFx0aWYgKGJ1cmdlci5jbGFzc0xpc3QuY29udGFpbnMoJ2J1cmdlci0tYWN0aXZlJykpIHtcblx0XHRcdG5hdi5jbGFzc0xpc3QucmVtb3ZlKCduYXZfb3BlbicpO1xuXHRcdFx0YnVyZ2VyLmNsYXNzTGlzdC5yZW1vdmUoJ2J1cmdlci0tYWN0aXZlJyk7XG5cdFx0XHRkb2N1bWVudC5ib2R5LnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcblx0XHR9XG5cdH0pO1xuXG5cdC8vIFdIRU4gVEhFIE5BViBJUyBPUEVOIFBSRVZFTlQgVVNFUiBGUk9NIEJFSU5HIEFCTEUgVE8gQ0xJQ0sgQU5ZVEhJTkcgRUxTRSBcXFxcXG5cblx0JCgnI21lbnVCbG9ja091dCcpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XG5cdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0fSk7XG5cblx0dmFyIGJ1cmdlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluLWJ1cmdlcicpLFxuXHQgICAgbmF2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW5OYXYnKTtcblxuXHQvLyBDT05UUk9MIEZPUiBPUEVOIEFORCBDTE9TSU5HIFRIRSBNRU5VL05BViAgXFxcXFxuXG5cdGZ1bmN0aW9uIG5hdkNvbnRyb2woKSB7XG5cblx0XHRpZiAoYnVyZ2VyLmNsYXNzTGlzdC5jb250YWlucygnYnVyZ2VyLS1hY3RpdmUnKSkge1xuXHRcdFx0bmF2LmNsYXNzTGlzdC5yZW1vdmUoJ25hdl9vcGVuJyk7XG5cdFx0XHRidXJnZXIuY2xhc3NMaXN0LnJlbW92ZSgnYnVyZ2VyLS1hY3RpdmUnKTtcblx0XHRcdCQoJyNtZW51QmxvY2tPdXQnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGJ1cmdlci5jbGFzc0xpc3QuYWRkKCdidXJnZXItLWFjdGl2ZScpO1xuXHRcdFx0bmF2LmNsYXNzTGlzdC5hZGQoJ25hdl9vcGVuJyk7XG5cdFx0XHQkKCcjbWVudUJsb2NrT3V0JykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuXHRcdH1cblx0fVxuXG5cdC8vIE9OTFkgTElTVEVOIEZPUiBNRU5VIENMSUNLUyBXSEVOIE5PVCBJTiBDTVMgUFJFVklFVyBNT0RFIFxcXFxcblxuXHRpZiAoISQobG9jYXRpb24pLmF0dHIoJ2hyZWYnKS5pbmNsdWRlcygnaW5kZXgucGhwJykpIHtcblx0XHRidXJnZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBuYXZDb250cm9sKTtcblx0fVxuXG5cdC8vIENMT1NFIFRIRSBOQVYgSUYgVEhFIFdJTkRPVyBJUyBPVkVSIDEwMDBQWCBXSURFIFxcXFxcblxuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZnVuY3Rpb24gKCkge1xuXHRcdGlmICh3aW5kb3cuaW5uZXJXaWR0aCA+IDEwMDAgJiYgbmF2LmNsYXNzTGlzdC5jb250YWlucygnbmF2X29wZW4nKSkge1xuXHRcdFx0bmF2Q29udHJvbCgpO1xuXHRcdFx0bmF2LmNsYXNzTGlzdC5yZW1vdmUoJ25hdl9vcGVuJyk7XG5cdFx0XHQkKCcjbWVudUJsb2NrT3V0JykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuXHRcdH1cblx0fSk7XG5cblx0Ly8gVEhJUyBTRVQgT0YgSUYgU1RBVEVNRU5UUyBJTklUSUFMSVNFUyBUSEUgU1BFU0lGSUMgUEFHRVMgRk9SIFBSRVZJRVdJTkcgSU4gQ01TIEFETUlOLiBcXFxcXG5cblx0aWYgKCQobG9jYXRpb24pLmF0dHIoJ2hyZWYnKS5pbmNsdWRlcygnaW5kZXgucGhwJykpIHtcblx0XHRpZiAoJChsb2NhdGlvbikuYXR0cignaHJlZicpLmluY2x1ZGVzKCdpbWFnaW5lLWlmJykpIHtcblx0XHRcdHBhZ2VMb2FkZXIoNCk7XG5cdFx0fVxuXHRcdGlmICgkKGxvY2F0aW9uKS5hdHRyKCdocmVmJykuaW5jbHVkZXMoJ2hvdy13ZS1pbm5vdmF0ZScpKSB7XG5cdFx0XHRwYWdlTG9hZGVyKDMpO1xuXHRcdH1cblx0XHRpZiAoJChsb2NhdGlvbikuYXR0cignaHJlZicpLmluY2x1ZGVzKCd3b3JrLXdpdGgtdXMnKSkge1xuXHRcdFx0cGFnZUxvYWRlcig1KTtcblx0XHR9XG5cdFx0aWYgKCQobG9jYXRpb24pLmF0dHIoJ2hyZWYnKS5pbmNsdWRlcygnY29udGFjdC11cycpKSB7XG5cdFx0XHRwYWdlTG9hZGVyKDYpO1xuXHRcdH1cblx0XHRpZiAoJChsb2NhdGlvbikuYXR0cignaHJlZicpLmluY2x1ZGVzKCdob21lLXZpZGVvJykpIHtcblx0XHRcdHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0aGlkZUxvYWRpbmdBbmltYXRpb24oKTtcblx0XHRcdH0sIDUwMCk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gU1dJUEUgRVZFTlRTIERFVEVDVE9SIEZVTkNUSU9OIFxcXFxcblxuXHRmdW5jdGlvbiBkZXRlY3Rzd2lwZShlbCwgZnVuYykge1xuXHRcdHZhciBzd2lwZV9kZXQgPSB7fTtcblx0XHRzd2lwZV9kZXQuc1ggPSAwO3N3aXBlX2RldC5zWSA9IDA7c3dpcGVfZGV0LmVYID0gMDtzd2lwZV9kZXQuZVkgPSAwO1xuXHRcdHZhciBtaW5feCA9IDMwOyAvL21pbiB4IHN3aXBlIGZvciBob3Jpem9udGFsIHN3aXBlXG5cdFx0dmFyIG1heF94ID0gMzA7IC8vbWF4IHggZGlmZmVyZW5jZSBmb3IgdmVydGljYWwgc3dpcGVcblx0XHR2YXIgbWluX3kgPSA1MDsgLy9taW4geSBzd2lwZSBmb3IgdmVydGljYWwgc3dpcGVcblx0XHR2YXIgbWF4X3kgPSA2MDsgLy9tYXggeSBkaWZmZXJlbmNlIGZvciBob3Jpem9udGFsIHN3aXBlXG5cdFx0dmFyIGRpcmVjID0gXCJcIjtcblx0XHR2YXIgZWxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWwpO1xuXHRcdGVsZS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgZnVuY3Rpb24gKGUpIHtcblx0XHRcdHZhciB0ID0gZS50b3VjaGVzWzBdO1xuXHRcdFx0c3dpcGVfZGV0LnNYID0gdC5zY3JlZW5YO1xuXHRcdFx0c3dpcGVfZGV0LnNZID0gdC5zY3JlZW5ZO1xuXHRcdH0sIGZhbHNlKTtcblx0XHRlbGUuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgZnVuY3Rpb24gKGUpIHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdHZhciB0ID0gZS50b3VjaGVzWzBdO1xuXHRcdFx0c3dpcGVfZGV0LmVYID0gdC5zY3JlZW5YO1xuXHRcdFx0c3dpcGVfZGV0LmVZID0gdC5zY3JlZW5ZO1xuXHRcdH0sIGZhbHNlKTtcblx0XHRlbGUuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0Ly9ob3Jpem9udGFsIGRldGVjdGlvblxuXHRcdFx0aWYgKChzd2lwZV9kZXQuZVggLSBtaW5feCA+IHN3aXBlX2RldC5zWCB8fCBzd2lwZV9kZXQuZVggKyBtaW5feCA8IHN3aXBlX2RldC5zWCkgJiYgc3dpcGVfZGV0LmVZIDwgc3dpcGVfZGV0LnNZICsgbWF4X3kgJiYgc3dpcGVfZGV0LnNZID4gc3dpcGVfZGV0LmVZIC0gbWF4X3kgJiYgc3dpcGVfZGV0LmVYID4gMCkge1xuXHRcdFx0XHRpZiAoc3dpcGVfZGV0LmVYID4gc3dpcGVfZGV0LnNYKSBkaXJlYyA9IFwiclwiO2Vsc2UgZGlyZWMgPSBcImxcIjtcblx0XHRcdH1cblx0XHRcdC8vdmVydGljYWwgZGV0ZWN0aW9uXG5cdFx0XHRlbHNlIGlmICgoc3dpcGVfZGV0LmVZIC0gbWluX3kgPiBzd2lwZV9kZXQuc1kgfHwgc3dpcGVfZGV0LmVZICsgbWluX3kgPCBzd2lwZV9kZXQuc1kpICYmIHN3aXBlX2RldC5lWCA8IHN3aXBlX2RldC5zWCArIG1heF94ICYmIHN3aXBlX2RldC5zWCA+IHN3aXBlX2RldC5lWCAtIG1heF94ICYmIHN3aXBlX2RldC5lWSA+IDApIHtcblx0XHRcdFx0XHRpZiAoc3dpcGVfZGV0LmVZID4gc3dpcGVfZGV0LnNZKSBkaXJlYyA9IFwiZFwiO2Vsc2UgZGlyZWMgPSBcInVcIjtcblx0XHRcdFx0fVxuXG5cdFx0XHRpZiAoZGlyZWMgIT0gXCJcIikge1xuXHRcdFx0XHRpZiAodHlwZW9mIGZ1bmMgPT0gJ2Z1bmN0aW9uJykgZnVuYyhlbCwgZGlyZWMpO1xuXHRcdFx0fVxuXHRcdFx0dmFyIGRpcmVjID0gXCJcIjtcblx0XHRcdHN3aXBlX2RldC5zWCA9IDA7c3dpcGVfZGV0LnNZID0gMDtzd2lwZV9kZXQuZVggPSAwO3N3aXBlX2RldC5lWSA9IDA7XG5cdFx0fSwgZmFsc2UpO1xuXHR9XG5cblx0Ly8gQ0hPU0UgVEhFIE5FWFQgU0xJREUgVE8gU0hPVyBBTkQgQ0xJQ0sgVEhFIFBBR0lOQVRJT04gQlVUVE9OIFRIQVQgUkVMQVRFUyBUTyBJVC4gXFxcXFxuXG5cdHZhciBzd2lwZUNvbnRyb2xsZXIgPSBmdW5jdGlvbiBzd2lwZUNvbnRyb2xsZXIoZWwsIGQpIHtcblxuXHRcdGlmIChlbCA9PT0gJ3NlY3Rpb240Jykge1xuXG5cdFx0XHR2YXIgc2VjdGlvbjRQYWdpbmF0aW9uTGVuZ3RoID0gJCgnLnNlY3Rpb240UGFnaW5hdG9yQnV0dG9uJykubGVuZ3RoO1xuXG5cdFx0XHRpZiAoZCA9PT0gJ2wnKSB7XG5cblx0XHRcdFx0aWYgKHNlY3Rpb240SWR4IDwgc2VjdGlvbjRQYWdpbmF0aW9uTGVuZ3RoIC0gMSkge1xuXHRcdFx0XHRcdHNlY3Rpb240SWR4Kys7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0c2VjdGlvbjRJZHggPSAwO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0JCgnLnNlY3Rpb240UGFnaW5hdG9yQnV0dG9uJylbc2VjdGlvbjRJZHhdLmNsaWNrKCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoZCA9PT0gJ3InKSB7XG5cblx0XHRcdFx0aWYgKHNlY3Rpb240SWR4ID4gMCkge1xuXHRcdFx0XHRcdHNlY3Rpb240SWR4LS07XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0c2VjdGlvbjRJZHggPSBzZWN0aW9uNFBhZ2luYXRpb25MZW5ndGggLSAxO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0JCgnLnNlY3Rpb240UGFnaW5hdG9yQnV0dG9uJylbc2VjdGlvbjRJZHhdLmNsaWNrKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmIChlbCA9PT0gJ3NlY3Rpb24zJykge1xuXG5cdFx0XHR2YXIgc2VjdGlvbjNQYWdpbmF0aW9uTGVuZ3RoID0gJCgnLnNlY3Rpb24zUGFnaW5hdG9yQnV0dG9uJykubGVuZ3RoO1xuXG5cdFx0XHRpZiAoZCA9PT0gJ2wnKSB7XG5cblx0XHRcdFx0aWYgKHNlY3Rpb24zSWR4IDwgc2VjdGlvbjNQYWdpbmF0aW9uTGVuZ3RoIC0gMSkge1xuXHRcdFx0XHRcdHNlY3Rpb24zSWR4Kys7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0c2VjdGlvbjNJZHggPSAwO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0JCgnLnNlY3Rpb24zUGFnaW5hdG9yQnV0dG9uJylbc2VjdGlvbjNJZHhdLmNsaWNrKCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoZCA9PT0gJ3InKSB7XG5cblx0XHRcdFx0aWYgKHNlY3Rpb24zSWR4ID4gMCkge1xuXHRcdFx0XHRcdHNlY3Rpb24zSWR4LS07XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0c2VjdGlvbjNJZHggPSBzZWN0aW9uM1BhZ2luYXRpb25MZW5ndGggLSAxO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0JCgnLnNlY3Rpb24zUGFnaW5hdG9yQnV0dG9uJylbc2VjdGlvbjNJZHhdLmNsaWNrKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdC8vIElOSVRJQVRFIEZPUiBTV0lQRSBERVRFQ1RJT04gT04gU0VDVElPTlMgMyBBTkQgNCBFWENFUFQgSU4gQURNSU4gUFJFVklFVy4gXFxcXFxuXG5cdGlmICghJChsb2NhdGlvbikuYXR0cignaHJlZicpLmluY2x1ZGVzKCdpbmRleC5waHAnKSkge1xuXHRcdGRldGVjdHN3aXBlKCdzZWN0aW9uNCcsIHN3aXBlQ29udHJvbGxlcik7XG5cdFx0ZGV0ZWN0c3dpcGUoJ3NlY3Rpb24zJywgc3dpcGVDb250cm9sbGVyKTtcblx0fVxufSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbVpoYTJWZk5HSXhOMk5tWVRZdWFuTWlYU3dpYm1GdFpYTWlPbHNpZEdsdFpTSXNJbk5sWTNScGIyNHpTV1I0SWl3aWMyVmpkR2x2YmpSSlpIZ2lMQ0p0WVhOMFpYSlBZbW9pTENKelpXTjBhVzl1TWtOMWNuSmxiblJKWkhnaUxDSnpaV04wYVc5dU1VTjFjbkpsYm5SSlpIZ2lMQ0p6WldOMGFXOXVNeUlzSW1GMWRHOXRZWFJsSWl3aWFYTkJkWFJ2YldGMFpXUWlMQ0p6WldOMGFXOXVOQ0lzSW1KaGMydGxkR0poYkd3aUxDSnNiMjl3UVcxdmRXNTBJaXdpWm05dmRHSmhiR3dpTENKMFpXNXVhWE1pTENKaVlYTmxZbUZzYkNJc0ltWmhiaUlzSW1odmJXVndZV2RsVFc5aVNXMWhaMlZ6SWl3aUpDSXNJbVJ2WTNWdFpXNTBJaXdpY21WaFpIa2lMQ0ozYVc1a2IzY2lMQ0pwYm01bGNsZHBaSFJvSWl3aVptVjBZMmdpTENKMGFHVnVJaXdpY21WemNHOXVjMlVpTENKcWMyOXVJaXdpYzNCeWFYUmxUMkpxSWl3aVNXUnNaVVp5WVcxbElpd2labWxzZEdWeVFubFdZV3gxWlNJc0ltWnlZVzFsY3lJc0ltRnVhVzFoZEdsdmJrRnljbUY1SWl3aVlXNXBiV0YwYjNKVFpYUjFjQ0lzSW1sdFlXZGxRMjl1ZEhKdmJHVnlJaXdpYzJWMFNXNTBaWEoyWVd3aUxDSmhjbkpoZVNJc0luTjBjbWx1WnlJc0ltWnBiSFJsY2lJc0ltOGlMQ0owYjB4dmQyVnlRMkZ6WlNJc0ltbHVZMngxWkdWeklpd2liR0Z6ZEZScGJXVWlMQ0oyWlc1a2IzSnpJaXdpZUNJc0lteGxibWQwYUNJc0luSmxjWFZsYzNSQmJtbHRZWFJwYjI1R2NtRnRaU0lzSW1OaGJtTmxiRUZ1YVcxaGRHbHZia1p5WVcxbElpd2lZMkZzYkdKaFkyc2lMQ0psYkdWdFpXNTBJaXdpWTNWeWNsUnBiV1VpTENKRVlYUmxJaXdpWjJWMFZHbHRaU0lzSW5ScGJXVlViME5oYkd3aUxDSk5ZWFJvSWl3aWJXRjRJaXdpYVdRaUxDSnpaWFJVYVcxbGIzVjBJaXdpWTJ4bFlYSlVhVzFsYjNWMElpd2lZVzVwYldGMGIzSWlMQ0poYm1sdFlYUnBiMjVQWW1vaUxDSmtZVzVqYVc1blNXTnZiaUlzSW5Od2NtbDBaVWx0WVdkbElpd2lZMkZ1ZG1Geklpd2laMkZ0WlV4dmIzQWlMQ0poWkdSRGJHRnpjeUlzSW14dmIzQkpaQ0lzSW5Wd1pHRjBaU0lzSW5KbGJtUmxjaUlzSW5Od2NtbDBaU0lzSW05d2RHbHZibk1pTENKMGFHRjBJaXdpWm5KaGJXVkpibVJsZUNJc0luUnBZMnREYjNWdWRDSXNJbXh2YjNCRGIzVnVkQ0lzSW5ScFkydHpVR1Z5Um5KaGJXVWlMQ0p1ZFcxaVpYSlBaa1p5WVcxbGN5SXNJbU52Ym5SbGVIUWlMQ0ozYVdSMGFDSXNJbWhsYVdkb2RDSXNJbWx0WVdkbElpd2liRzl2Y0hNaUxDSmpiR1ZoY2xKbFkzUWlMQ0prY21GM1NXMWhaMlVpTENKbWNtRnRaU0lzSW5raUxDSm5aWFJGYkdWdFpXNTBRbmxKWkNJc0lrbHRZV2RsSWl3aVoyVjBRMjl1ZEdWNGRDSXNJbUZrWkVWMlpXNTBUR2x6ZEdWdVpYSWlMQ0p6Y21NaUxDSndZV2RsVEc5aFpHVnlJaXdpYVc1a1pYZ2lMQ0p5WlcxdmRtVkRiR0Z6Y3lJc0ltWnBibVFpTENKblpYUWlMQ0pqYkdsamF5SXNJbWx1YVhScFlXeHBlbVZUWldOMGFXOXVJaXdpYzJWamRHbHZiazUxYldKbGNpSXNJbWxrZUNJc0luTnBZbXhwYm1keklpd2liV0Z3SWl3aWFYZ2lMQ0psYkdVaUxDSmpjM01pTENKdmNHRmphWFI1SWl3aWFXUjRUMkpxSWl3aWNtVnNaWFpoYm5SQmJtbHRZWFJwYjI0aUxDSm9ZVzVrYkdWUVlXNXBibUYwYVc5dVFuVjBkRzl1UTJ4cFkyc2lMQ0psSWl3aWNHRnljMlZKYm5RaUxDSjBZWEpuWlhRaUxDSmhkSFJ5SWl3aWMyVmpkR2x2Ymtsa0lpd2lZMnh2YzJWemRDSXNJbkpsYkdWMllXNTBSR0YwWVVGeWNtRjVJaXdpYjI0aUxDSmxjeUlzSW1OMWNuSmxiblJVWVhKblpYUWlMQ0pwYm5SbGNuWmhiRTFoYm1GblpYSWlMQ0pvWVhORGJHRnpjeUlzSW14dlkyRjBhVzl1SWl3aWIyNWxjR0ZuWlY5elkzSnZiR3dpTENKelpXTjBhVzl1UTI5dWRHRnBibVZ5SWl3aVpXRnphVzVuSWl3aVlXNXBiV0YwYVc5dVZHbHRaU0lzSW5CaFoybHVZWFJwYjI0aUxDSjFjR1JoZEdWVlVrd2lMQ0ppWldadmNtVk5iM1psSWl3aVlXWjBaWEpOYjNabElpd2liRzl2Y0NJc0ltdGxlV0p2WVhKa0lpd2ljbVZ6Y0c5dWMybDJaVVpoYkd4aVlXTnJJaXdpWkdseVpXTjBhVzl1SWl3aWJXOTJaVlJ2SWl3aVkzVnljbVZ1ZEZObFkzUnBiMjRpTENKelpXTjBhVzl1SWl3aWIyWm1jMlYwSWl3aWRHOXdJaXdpYlc5MlpVUnZkMjRpTENKb2FXUmxURzloWkdsdVowRnVhVzFoZEdsdmJpSXNJbkpsWVdSNVUzUmhkR1VpTENKbWJHRm5JaXdpYzNkcGNHVkRiMjUwY205c2JHVnlJaXdpWTJ4bFlYSkpiblJsY25aaGJDSXNJbWx1Ym1WeVNHVnBaMmgwSWl3aWNHeGhlU0lzSW5CaGRYTmxJaXdpYldGMFkyaE5aV1JwWVNJc0ltMWhkR05vWlhNaUxDSndZV2RsU1dSNElpd2lZblZ5WjJWeUlpd2lZMnhoYzNOTWFYTjBJaXdpWTI5dWRHRnBibk1pTENKdVlYWWlMQ0p5WlcxdmRtVWlMQ0ppYjJSNUlpd2ljM1I1YkdVaUxDSndiM05wZEdsdmJpSXNJbk4wYjNCUWNtOXdZV2RoZEdsdmJpSXNJbTVoZGtOdmJuUnliMndpTENKaFpHUWlMQ0prWlhSbFkzUnpkMmx3WlNJc0ltVnNJaXdpWm5WdVl5SXNJbk4zYVhCbFgyUmxkQ0lzSW5OWUlpd2ljMWtpTENKbFdDSXNJbVZaSWl3aWJXbHVYM2dpTENKdFlYaGZlQ0lzSW0xcGJsOTVJaXdpYldGNFgza2lMQ0prYVhKbFl5SXNJblFpTENKMGIzVmphR1Z6SWl3aWMyTnlaV1Z1V0NJc0luTmpjbVZsYmxraUxDSndjbVYyWlc1MFJHVm1ZWFZzZENJc0ltUWlMQ0p6WldOMGFXOXVORkJoWjJsdVlYUnBiMjVNWlc1bmRHZ2lMQ0p6WldOMGFXOXVNMUJoWjJsdVlYUnBiMjVNWlc1bmRHZ2lYU3dpYldGd2NHbHVaM01pT2lJN096czdRVUZCUVN4SlFVRk5RU3hQUVVGUExFZEJRV0k3UVVGRFFTeEpRVUZKUXl4alFVRmpMRU5CUVd4Q08wRkJRMEVzU1VGQlNVTXNZMEZCWXl4RFFVRnNRanM3UVVGRlFTeEpRVUZOUXl4WlFVRlpPMEZCUTJwQ1F5eHhRa0ZCYjBJc1EwRkVTRHRCUVVWcVFrTXNjVUpCUVc5Q0xFTkJSa2c3UVVGSGFrSkRMRmRCUVZVN1FVRkRWRU1zV1VGQlZTeEZRVVJFTzBGQlJWUkRMR1ZCUVdFN1FVRkdTaXhGUVVoUE8wRkJUMnBDUXl4WFFVRlZPMEZCUTFSR0xGbEJRVlVzUlVGRVJEdEJRVVZVUXl4bFFVRmhPMEZCUmtvc1JVRlFUenRCUVZkcVFrVXNZVUZCV1N4RlFVRkRReXhaUVVGWkxFTkJRV0lzUlVGWVN6dEJRVmxxUWtNc1YwRkJWU3hGUVVGRFJDeFpRVUZaTEVOQlFXSXNSVUZhVHp0QlFXRnFRa1VzVTBGQlVTeEZRVUZEUml4WlFVRlpMRU5CUVdJc1JVRmlVenRCUVdOcVFrY3NWMEZCVlN4RlFVRkRTQ3haUVVGWkxFTkJRV0lzUlVGa1R6dEJRV1ZxUWtrc1RVRkJTeXhGUVVGRFNpeFpRVUZaTEVOQlFXSTdRVUZtV1N4RFFVRnNRanM3UVVGclFrRXNTVUZCVFVzc2IwSkJRVzlDTEVOQlEzcENMREJEUVVSNVFpeEZRVVY2UWl4M1EwRkdlVUlzUlVGSGVrSXNjME5CU0hsQ0xFVkJTWHBDTEhkRFFVcDVRaXhGUVV0NlFpeHRRMEZNZVVJc1EwRkJNVUk3TzBGQlVVRkRMRVZCUVVWRExGRkJRVVlzUlVGQldVTXNTMEZCV2l4RFFVRnJRaXhaUVVGTk8wRkJRM1pDTEV0QlFVZERMRTlCUVU5RExGVkJRVkFzUjBGQmIwSXNSMEZCZGtJc1JVRkJORUk3UVVGRE4wSTdRVUZEUlVNc1VVRkJUU3gxUTBGQlRpeEZRVUVyUTBNc1NVRkJMME1zUTBGQmIwUXNWVUZCVTBNc1VVRkJWQ3hGUVVGdFFqdEJRVU4wUlN4VlFVRlBRU3hUUVVGVFF5eEpRVUZVTEVWQlFWQTdRVUZEUVN4SFFVWkVMRVZCUlVkR0xFbEJSa2dzUTBGRlVTeFZRVUZUUnl4VFFVRlVMRVZCUVc5Q08wRkJRek5DTEU5QlFVMURMRmxCUVZsRExHTkJRV05HTEZWQlFWVkhMRTFCUVhoQ0xFVkJRV2RETEUxQlFXaERMRU5CUVd4Q08wRkJRMEV4UWl4aFFVRlZVeXhSUVVGV0xFTkJRVzFDYTBJc1kwRkJia0lzWjBOQlFYZERTQ3hUUVVGNFF5eHpRa0ZCYzBSRExHTkJRV05HTEZWQlFWVkhMRTFCUVhoQ0xFVkJRV2RETEZWQlFXaERMRU5CUVhSRU8wRkJRMEV4UWl4aFFVRlZWU3hOUVVGV0xFTkJRV2xDYVVJc1kwRkJha0lzWjBOQlFYTkRTQ3hUUVVGMFF5eHpRa0ZCYjBSRExHTkJRV05HTEZWQlFWVkhMRTFCUVhoQ0xFVkJRV2RETEZGQlFXaERMRU5CUVhCRU8wRkJRMEV4UWl4aFFVRlZWeXhSUVVGV0xFTkJRVzFDWjBJc1kwRkJia0lzWjBOQlFYZERTQ3hUUVVGNFF5eHpRa0ZCYzBSRExHTkJRV05HTEZWQlFWVkhMRTFCUVhoQ0xFVkJRV2RETEZWQlFXaERMRU5CUVhSRU8wRkJRMEV4UWl4aFFVRlZUeXhWUVVGV0xFTkJRWEZDYjBJc1kwRkJja0lzWjBOQlFUQkRTQ3hUUVVFeFF5eHpRa0ZCZDBSRExHTkJRV05HTEZWQlFWVkhMRTFCUVhoQ0xFVkJRV2RETEZGQlFXaERMRU5CUVhoRU8wRkJRMEV4UWl4aFFVRlZXU3hIUVVGV0xFTkJRV05sTEdOQlFXUXNaME5CUVcxRFNDeFRRVUZ1UXl4elFrRkJhVVJETEdOQlFXTkdMRlZCUVZWSExFMUJRWGhDTEVWQlFXZERMRXRCUVdoRExFTkJRV3BFTzBGQlEwZzdRVUZEUjBVN1FVRkRRVU1zYTBKQlFXVTNRaXhUUVVGbUxFVkJRVEJDTEVOQlFURkNPMEZCUTBnN1FVRkRSemhDTEdWQlFWa3NXVUZCVFR0QlFVTnFRa1FzYlVKQlFXVTNRaXhUUVVGbUxFVkJRVEJDTEVOQlFURkNPMEZCUTBFc1NVRkdSQ3hGUVVWSExFbEJSa2c3UVVGSFFTeEhRV2hDUkR0QlFXbENRVHRCUVVOR08wRkJRME1zUzBGQlRYbENMR2RDUVVGblFpeFRRVUZvUWtFc1lVRkJaMElzUTBGQlEwMHNTMEZCUkN4RlFVRlJReXhOUVVGU0xFVkJRVzFDTzBGQlEzUkRMRk5CUVU5RUxFMUJRVTFGTEUxQlFVNHNRMEZCWVR0QlFVRkJMRlZCUVVzc1QwRkJUME1zUlVGQlJTeFZRVUZHTEVOQlFWQXNTMEZCZVVJc1VVRkJla0lzU1VGQmNVTkJMRVZCUVVVc1ZVRkJSaXhGUVVGalF5eFhRVUZrTEVkQlFUUkNReXhSUVVFMVFpeERRVUZ4UTBvc1QwRkJUMGNzVjBGQlVDeEZRVUZ5UXl4RFFVRXhRenRCUVVGQkxFZEJRV0lzUTBGQlVEdEJRVU5HTEVWQlJrUTdRVUZIUkR0QlFVTkRMRXRCUVUxUUxHZENRVUZuUWl4VFFVRm9Ra0VzWVVGQlowSXNSMEZCVFRzN1FVRkZla0lzVFVGQlNWTXNWMEZCVnl4RFFVRm1PMEZCUTBFc1RVRkJTVU1zVlVGQlZTeERRVUZETEVsQlFVUXNSVUZCVHl4TFFVRlFMRVZCUVdNc1VVRkJaQ3hGUVVGM1FpeEhRVUY0UWl4RFFVRmtPMEZCUTBFc1QwRkJTU3hKUVVGSlF5eEpRVUZKTEVOQlFWb3NSVUZCWlVFc1NVRkJTVVFzVVVGQlVVVXNUVUZCV2l4SlFVRnpRaXhEUVVGRGRrSXNUMEZCVDNkQ0xIRkNRVUUzUXl4RlFVRnZSU3hGUVVGRlJpeERRVUYwUlN4RlFVRjVSVHRCUVVOMlJYUkNMRlZCUVU5M1FpeHhRa0ZCVUN4SFFVRXJRbmhDTEU5QlFVOXhRaXhSUVVGUlF5eERRVUZTTEVsQlFWY3NkVUpCUVd4Q0xFTkJRUzlDTzBGQlEwRjBRaXhWUVVGUGVVSXNiMEpCUVZBc1IwRkJPRUo2UWl4UFFVRlBjVUlzVVVGQlVVTXNRMEZCVWl4SlFVRlhMSE5DUVVGc1FpeExRVUUyUTNSQ0xFOUJRVTl4UWl4UlFVRlJReXhEUVVGU0xFbEJRVmNzTmtKQlFXeENMRU5CUVRORk8wRkJRMFE3TzBGQlJVUXNUVUZCU1N4RFFVRkRkRUlzVDBGQlQzZENMSEZDUVVGYUxFVkJRMFY0UWl4UFFVRlBkMElzY1VKQlFWQXNSMEZCSzBJc1ZVRkJVMFVzVVVGQlZDeEZRVUZ0UWtNc1QwRkJia0lzUlVGQk5FSTdRVUZEZWtRc1QwRkJTVU1zVjBGQlZ5eEpRVUZKUXl4SlFVRktMRWRCUVZkRExFOUJRVmdzUlVGQlpqdEJRVU5CTEU5QlFVbERMR0ZCUVdGRExFdEJRVXRETEVkQlFVd3NRMEZCVXl4RFFVRlVMRVZCUVZrc1RVRkJUVXdzVjBGQlYxSXNVVUZCYWtJc1EwRkJXaXhEUVVGcVFqdEJRVU5CTEU5QlFVbGpMRXRCUVV0c1F5eFBRVUZQYlVNc1ZVRkJVQ3hEUVVGclFpeFpRVUZYTzBGQlFVVlVMR0ZCUVZORkxGZEJRVmRITEZWQlFYQkNPMEZCUVd0RExFbEJRV3BGTEVWQlExQkJMRlZCUkU4c1EwRkJWRHRCUVVWQldDeGpRVUZYVVN4WFFVRlhSeXhWUVVGMFFqdEJRVU5CTEZWQlFVOUhMRVZCUVZBN1FVRkRSQ3hIUVZCRU96dEJRVk5HTEUxQlFVa3NRMEZCUTJ4RExFOUJRVTk1UWl4dlFrRkJXaXhGUVVOQmVrSXNUMEZCVDNsQ0xHOUNRVUZRTEVkQlFUaENMRlZCUVZOVExFVkJRVlFzUlVGQllUdEJRVU42UTBVc1owSkJRV0ZHTEVWQlFXSTdRVUZEUkN4SFFVWkVPMEZCUjBZc1JVRjJRa1E3TzBGQk1FSkJMRXRCUVUxSExGZEJRVmNzVTBGQldFRXNVVUZCVnl4RFFVRkRReXhaUVVGRUxFVkJRV3RDT3p0QlFVVnNReXhOUVVGSlF5eFhRVUZLTEVWQlEwTkRMRmRCUkVRc1JVRkZRME1zVFVGR1JEdEJRVWRHTzBGQlEwVXNWMEZCVTBNc1VVRkJWQ3hIUVVGeFFqdEJRVU51UWpkRExFdEJRVVVzVlVGQlJpeEZRVUZqT0VNc1VVRkJaQ3hEUVVGMVFpeFJRVUYyUWp0QlFVTkJUQ3huUWtGQllVMHNUVUZCWWl4SFFVRnpRalZETEU5QlFVOTNRaXh4UWtGQlVDeERRVUUyUW10Q0xGRkJRVGRDTEVOQlFYUkNPMEZCUTBGSUxHVkJRVmxOTEUxQlFWbzdRVUZEUVU0c1pVRkJXVThzVFVGQldqdEJRVU5FT3p0QlFVVkVMRmRCUVZORExFMUJRVlFzUTBGQmFVSkRMRTlCUVdwQ0xFVkJRVEJDT3p0QlFVVjZRaXhQUVVGSlF5eFBRVUZQTEVWQlFWZzdRVUZCUVN4UFFVTkRReXhoUVVGaExFTkJSR1E3UVVGQlFTeFBRVVZEUXl4WlFVRlpMRU5CUm1JN1FVRkJRU3hQUVVkRFF5eFpRVUZaTEVOQlNHSTdRVUZCUVN4UFFVbERReXhuUWtGQlowSk1MRkZCUVZGTExHRkJRVklzU1VGQmVVSXNRMEZLTVVNN1FVRkJRU3hQUVV0RFF5eHBRa0ZCYVVKT0xGRkJRVkZOTEdOQlFWSXNTVUZCTUVJc1EwRk1OVU03TzBGQlQwRk1MRkZCUVV0TkxFOUJRVXdzUjBGQlpWQXNVVUZCVVU4c1QwRkJka0k3UVVGRFFVNHNVVUZCUzA4c1MwRkJUQ3hIUVVGaFVpeFJRVUZSVVN4TFFVRnlRanRCUVVOQlVDeFJRVUZMVVN4TlFVRk1MRWRCUVdOVUxGRkJRVkZUTEUxQlFYUkNPMEZCUTBGU0xGRkJRVXRUTEV0QlFVd3NSMEZCWVZZc1VVRkJVVlVzUzBGQmNrSTdRVUZEUVZRc1VVRkJTMVVzUzBGQlRDeEhRVUZoV0N4UlFVRlJWeXhMUVVGeVFqczdRVUZGUVZZc1VVRkJTMG9zVFVGQlRDeEhRVUZqTEZsQlFWazdPMEZCUlhKQ1RTeHBRa0ZCWVN4RFFVRmlPenRCUVVWQkxGRkJRVWxCTEZsQlFWbEZMR0ZCUVdoQ0xFVkJRU3RDT3p0QlFVVnNRMFlzYVVKQlFWa3NRMEZCV2p0QlFVTkxPMEZCUTBFc1UwRkJTVVFzWVVGQllVa3NhVUpCUVdsQ0xFTkJRV3hETEVWQlFYRkRPMEZCUTNKRE8wRkJRMFZLTEc5Q1FVRmpMRU5CUVdRN1FVRkRSQ3hOUVVoRUxFMUJSMDg3UVVGRFVFVTdRVUZEUlVZc2JVSkJRV0VzUTBGQllqczdRVUZGUVN4VlFVRkhSU3hqUVVGalNDeExRVUZMVlN4TFFVRjBRaXhGUVVFMlFqdEJRVU0xUWpORUxHTkJRVTk1UWl4dlFrRkJVQ3hEUVVFMFFtRXNZVUZCWVUwc1RVRkJla003UVVGRFFUdEJRVU5HTzBGQlEwZzdRVUZEUml4SlFYQkNTRHM3UVVGelFrRkxMRkZCUVV0SUxFMUJRVXdzUjBGQll5eFpRVUZaT3p0QlFVVjRRanRCUVVOQlJ5eFRRVUZMVFN4UFFVRk1MRU5CUVdGTExGTkJRV0lzUTBGQmRVSXNRMEZCZGtJc1JVRkJNRUlzUTBGQk1VSXNSVUZCTmtKWUxFdEJRVXRQTEV0QlFXeERMRVZCUVhsRFVDeExRVUZMVVN4TlFVRTVRenM3UVVGRlFWSXNVMEZCUzAwc1QwRkJUQ3hEUVVGaFRTeFRRVUZpTEVOQlEwVmFMRXRCUVV0VExFdEJSRkFzUlVGRlJYQkNMR0ZCUVdFMVFpeGpRVUZpTEVOQlFUUkNkME1zVlVGQk5VSXNSVUZCZDBOWkxFdEJRWGhETEVOQlFUaERlRU1zUTBGR2FFUXNSVUZIUldkQ0xHRkJRV0UxUWl4alFVRmlMRU5CUVRSQ2QwTXNWVUZCTlVJc1JVRkJkME5aTEV0QlFYaERMRU5CUVRoRFF5eERRVWhvUkN4RlFVbEZMRWRCU2tZc1JVRkxSU3hIUVV4R0xFVkJUVVVzUTBGT1JpeEZRVTlGTEVOQlVFWXNSVUZSUlM5RUxFOUJRVTlETEZWQlFWQXNSMEZCYjBJc1MwRlNkRUlzUlVGVFJVUXNUMEZCVDBNc1ZVRkJVQ3hIUVVGdlFpeEhRVlIwUWp0QlFWVkVMRWxCWmtRN08wRkJhVUpCTEZWQlFVOW5SQ3hKUVVGUU8wRkJRMEU3TzBGQlJVUTdRVUZEUVZJc1YwRkJVek5ETEZOQlFWTnJSU3hqUVVGVUxFTkJRWGRDTEZGQlFYaENMRU5CUVZRN1FVRkRRWFpDTEZOQlFVOWxMRXRCUVZBc1IwRkJaWGhFTEU5QlFVOURMRlZCUVZBc1IwRkJiMElzUzBGQmJrTTdRVUZEUVhkRExGTkJRVTluUWl4TlFVRlFMRWRCUVdkQ2VrUXNUMEZCVDBNc1ZVRkJVQ3hIUVVGdlFpeEhRVUZ3UXpzN1FVRkZRVHRCUVVOQmRVTXNaMEpCUVdNc1NVRkJTWGxDTEV0QlFVb3NSVUZCWkRzN1FVRkZRVHRCUVVOQk1VSXNaMEpCUVdOUkxFOUJRVTg3UVVGRGNFSlJMRmxCUVZOa0xFOUJRVTk1UWl4VlFVRlFMRU5CUVd0Q0xFbEJRV3hDTEVOQlJGYzdRVUZGY0VKV0xGVkJRVThzU1VGR1lUdEJRVWR3UWtNc1YwRkJVU3hKUVVoWk8wRkJTWEJDUXl4VlFVRlBiRUlzVjBGS1lUdEJRVXR3UW1Nc2JVSkJRV2RDYUVJc1lVRkJZVFZDTEdOQlFXSXNRMEZCTkVKaExFMUJUSGhDTzBGQlRYQkNPRUlzYTBKQlFXVXNRMEZPU3p0QlFVOXdRazBzVlVGQlQzSkNMR0ZCUVdFdlF6dEJRVkJCTEVkQlFWQXNRMEZCWkRzN1FVRlZRVHRCUVVOQmFVUXNZMEZCV1RKQ0xHZENRVUZhTEVOQlFUWkNMRTFCUVRkQ0xFVkJRWEZEZWtJc1VVRkJja003UVVGRFFVWXNZMEZCV1RSQ0xFZEJRVm9zUjBGQmEwSXNNRU5CUVd4Q08wRkJRMEVzUlVFMVJrUTdPMEZCT0VaRU96dEJRVVZETEV0QlFVMURMR0ZCUVdFc1UwRkJZa0VzVlVGQllTeERRVUZEUXl4TFFVRkVMRVZCUVZjN1FVRkROMElzVFVGQlIwRXNWVUZCVlN4RFFVRmlMRVZCUVdkQ08wRkJRMlo2UlN4TFFVRkZMRTlCUVVZc1JVRkJWekJGTEZkQlFWZ3NRMEZCZFVJc1dVRkJka0k3UVVGRFFURkZMRXRCUVVVc2IwSkJRVVlzUlVGQmQwSXdSU3hYUVVGNFFpeERRVUZ2UXl4cFFrRkJjRU03UVVGRFFURkZMRXRCUVVVc1YwRkJSaXhGUVVGbE1rVXNTVUZCWml4RFFVRnZRaXhWUVVGd1FpeEZRVUZuUXpkQ0xGRkJRV2hETEVOQlFYbERMR0ZCUVhwRE8wRkJRMEU1UXl4TFFVRkZMR0ZCUVVZc1JVRkJhVUk0UXl4UlFVRnFRaXhEUVVFd1FpeHBRa0ZCTVVJN1FVRkRRVGxETEV0QlFVVXNZVUZCUml4RlFVRnBRakpGTEVsQlFXcENMRU5CUVhOQ0xFOUJRWFJDTEVWQlFTdENOMElzVVVGQkwwSXNRMEZCZDBNc1dVRkJlRU03UVVGRFFUbERMRXRCUVVVc1YwRkJSaXhGUVVGbE1rVXNTVUZCWml4RFFVRnZRaXhqUVVGd1FpeEZRVUZ2UXpkQ0xGRkJRWEJETEVOQlFUWkRMRTFCUVRkRE8wRkJRMEZTTEdOQlFWY3NXVUZCVFR0QlFVTm9RblJETEUxQlFVVXNORUpCUVVZc1JVRkJaME15UlN4SlFVRm9ReXhEUVVGeFF5eFZRVUZ5UXl4RlFVRnBSRGRDTEZGQlFXcEVMRU5CUVRCRUxGRkJRVEZFTzBGQlEwRXNTVUZHUkN4RlFVVkhMRWxCUmtnN1FVRkhRU3hIUVZaRUxFMUJWMHM3UVVGRFNqbERMRXRCUVVVc1QwRkJSaXhGUVVGWE1FVXNWMEZCV0N4RFFVRjFRaXhaUVVGMlFqdEJRVU5CTVVVc1MwRkJSU3hoUVVGR0xFVkJRV2xDTUVVc1YwRkJha0lzUTBGQk5rSXNhVUpCUVRkQ08wRkJRMEV4UlN4NVEwRkJiME41UlN4TFFVRndReXhyUWtGQmQwUkRMRmRCUVhoRUxFTkJRVzlGTEdsQ1FVRndSVHRCUVVOQk1VVXNkMEpCUVhGQ01rVXNTVUZCY2tJc2RVSkJRV2RFTjBJc1VVRkJhRVFzUTBGQmVVUXNhVUpCUVhwRU8wRkJRMEU1UXl4MVFrRkJiMEl5UlN4SlFVRndRaXhEUVVGNVFpeFBRVUY2UWl4RlFVRnJRemRDTEZGQlFXeERMRU5CUVRKRExGbEJRVE5ET3p0QlFVVkJMRTlCUVVjNVF5eGxRVUZoZVVVc1MwRkJZaXh6UWtGQmNVTXZReXhOUVVGeVF5eEpRVUVyUXpGQ0xHVkJRV0Y1UlN4TFFVRmlMRFpDUVVFMFF5OURMRTFCUVRWRExFZEJRWEZFTEVOQlFYWkhMRVZCUVRCSE8wRkJRM3BITVVJc2JVSkJRV0Y1UlN4TFFVRmlMSE5DUVVGeFEwY3NSMEZCY2tNc1EwRkJlVU1zUTBGQmVrTXNSVUZCTkVORExFdEJRVFZETzBGQlEwRTdRVUZEUkR0QlFVTkVMRVZCZGtKRU96dEJRWGxDUkRzN1FVRkZReXhMUVVGTlF5eHZRa0ZCYjBJc1UwRkJjRUpCTEdsQ1FVRnZRaXhEUVVGRFF5eGhRVUZFTEVWQlFXZENReXhIUVVGb1FpeEZRVUYzUWp0QlFVTnFSR2hHTEdsQ1FVRmhLMFVzWVVGQllpeHJRa0ZCZFVORExFZEJRWFpETEVWQlFUaERReXhSUVVFNVF5eERRVUYxUkN4dlFrRkJka1FzUlVGQk5rVkRMRWRCUVRkRkxFTkJRV2xHTEZWQlFVTkRMRVZCUVVRc1JVRkJTME1zUjBGQlRDeEZRVUZoTzBGQlF6ZEdjRVlzUzBGQlJXOUdMRWRCUVVZc1JVRkJUME1zUjBGQlVDeERRVUZYTEVWQlFVTkRMRk5CUVZNc1EwRkJWaXhGUVVGWU8wRkJRMEVzUjBGR1JEczdRVUZKUVhSR0xHbENRVUZoSzBVc1lVRkJZaXhyUWtGQmRVTkRMRWRCUVhaRExFVkJRVGhEU3l4SFFVRTVReXhEUVVGclJEdEJRVU5xUkN4blFrRkJZU3haUVVSdlF6dEJRVVZxUkN4alFVRlhPMEZCUm5ORExFZEJRV3hFTzBGQlNVRXNSVUZVUkRzN1FVRlhSRHRCUVVORFVDeHRRa0ZCYTBJc1EwRkJiRUlzUlVGQmNVSXNRMEZCY2tJN1FVRkRRVUVzYlVKQlFXdENMRU5CUVd4Q0xFVkJRWEZDTEVOQlFYSkNPMEZCUTBGQkxHMUNRVUZyUWl4RFFVRnNRaXhGUVVGeFFpeERRVUZ5UWpzN1FVRkZSRHM3UVVGRlF5eExRVUZOTDBRc2FVSkJRV2xDTEZOQlFXcENRU3hqUVVGcFFpeERRVUZEZDBVc1RVRkJSQ3hGUVVGVFVpeGhRVUZVTEVWQlFUSkNPMEZCUTJwRUxFMUJRVWxUTERCQ1FVRktPenRCUVVWQkxFMUJRVWRVTEd0Q1FVRnJRaXhEUVVGeVFpeEZRVUYzUWp0QlFVTjJRaXhYUVVGUFVTeFBRVUZQYmtjc2EwSkJRV1E3UVVGRFF5eFRRVUZMTEVOQlFVdzdRVUZEUTI5SExIbENRVUZ2UW5SSExGVkJRVlZQTEZWQlFUbENPMEZCUTBRN1FVRkRRU3hUUVVGTExFTkJRVXc3UVVGRFF5dEdMSGxDUVVGdlFuUkhMRlZCUVZWVExGRkJRVGxDTzBGQlEwUTdRVUZEUVN4VFFVRkxMRU5CUVV3N1FVRkRRelpHTEhsQ1FVRnZRblJITEZWQlFWVlZMRTFCUVRsQ08wRkJRMFE3UVVGRFFTeFRRVUZMTEVOQlFVdzdRVUZEUXpSR0xIbENRVUZ2UW5SSExGVkJRVlZYTEZGQlFUbENPMEZCUTBRN1FVRkRRU3hUUVVGTExFTkJRVXc3UVVGRFF6SkdMSGxDUVVGdlFuUkhMRlZCUVZWWkxFZEJRVGxDTzBGQlEwUTdRVUZtUkR0QlFXbENRVHM3UVVGRlJFVXNhVUpCUVdFclJTeGhRVUZpTEVWQlFUaENTaXhKUVVFNVFpeERRVUZ0UXl4UFFVRnVReXhGUVVFMFEwUXNWMEZCTlVNc1EwRkJkMFFzV1VGQmVFUTdRVUZEUVRGRkxHbENRVUZoSzBVc1lVRkJZaXhyUWtGQmRVTlJMRzFDUVVGcFFsSXNZVUZCYWtJc1owSkJRWFpETEVWQlFYTkdUQ3hYUVVGMFJpeERRVUZyUnl4cFFrRkJiRWM3UVVGRFFVa3NiMEpCUVd0Q1F5eGhRVUZzUWl4RlFVRnBRMUVzYlVKQlFXbENVaXhoUVVGcVFpeG5Ra0ZCYWtNN08wRkJSVUY2UXl4aFFVRlhMRmxCUVUwN1FVRkRhRUlzVDBGQlIzbERMR3RDUVVGclFpeERRVUZ5UWl4RlFVRjNRanRCUVVOMlFuWkRMR0ZCUVZOblJDeHBRa0ZCVkR0QlFVTkJPenRCUVVWRWVFWXNhMEpCUVdFclJTeGhRVUZpTEVWQlFUaENTaXhKUVVFNVFpeDFRa0ZCZVVRM1FpeFJRVUY2UkN4RFFVRnJSU3hwUWtGQmJFVTdRVUZEUVRsRExHdENRVUZoSzBVc1lVRkJZaXhGUVVFNFFrb3NTVUZCT1VJc1EwRkJiVU1zVDBGQmJrTXNSVUZCTkVNM1FpeFJRVUUxUXl4RFFVRnhSQ3haUVVGeVJEdEJRVU5CTEVkQlVFUXNSVUZQUnl4SFFWQklPenRCUVZOQkxFMUJRVWQ1UXl4dFFrRkJhVUpTTEdGQlFXcENMSEZDUVVGblJDOUZMR1ZCUVdFclJTeGhRVUZpTEVWQlFUaENTaXhKUVVFNVFpeDFRa0ZCZVVScVJDeE5RVUY2UkN4SFFVRnJSU3hEUVVGeVNDeEZRVUYzU0R0QlFVTjJTRFpFTEhOQ1FVRnBRbElzWVVGQmFrSXNiVUpCUVRoRExFTkJRVGxETzBGQlEwRXNSMEZHUkN4TlFVVlBPMEZCUTA1UkxITkNRVUZwUWxJc1lVRkJha0lzYjBKQlFTdERMRU5CUVM5RE8wRkJRMEU3UVVGRFJDeEZRWHBEUkR0QlFUQkRSRHRCUVVORGFFVXNaMEpCUVdVM1FpeFRRVUZtTEVWQlFUQkNMRU5CUVRGQ096dEJRVVZFTzBGQlEwTTRRaXhoUVVGWkxGbEJRVTA3UVVGRGFrSkVMR2xDUVVGbE4wSXNVMEZCWml4RlFVRXdRaXhEUVVFeFFqdEJRVU5CTEVWQlJrUXNSVUZGUnl4TFFVWklPenRCUVVsRU96dEJRVVZETEV0QlFVMTFSeXc0UWtGQk9FSXNVMEZCT1VKQkxESkNRVUU0UWl4RFFVRkRReXhEUVVGRUxFVkJRVTg3TzBGQlJURkRMRTFCUVUxV0xFMUJRVTFYTEZOQlFWTXpSaXhGUVVGRk1FWXNSVUZCUlVVc1RVRkJTaXhGUVVGWlF5eEpRVUZhTEVOQlFXbENMRmxCUVdwQ0xFTkJRVlFzUTBGQldqdEJRVU5CTEUxQlFVMURMRmxCUVZrNVJpeEZRVUZGTUVZc1JVRkJSVVVzVFVGQlNpeEZRVUZaUnl4UFFVRmFMRU5CUVc5Q0xGTkJRWEJDTEVWQlFTdENSaXhKUVVFdlFpeERRVUZ2UXl4SlFVRndReXhEUVVGc1FqdEJRVU5CTEUxQlFVbEhMREJDUVVGS096dEJRVVZCTEUxQlFVZEdMR05CUVdNc1ZVRkJha0lzUlVGQk5rSTdRVUZETlVJNVJ5eHBRa0ZCWTJkSExFZEJRV1E3UVVGRFFUczdRVUZGUkN4TlFVRkhZeXhqUVVGakxGVkJRV3BDTEVWQlFUWkNPMEZCUXpWQ04wY3NhVUpCUVdNclJpeEhRVUZrTzBGQlEwRTdPMEZCUlVSb1JpeFZRVUZOT0VZc1UwRkJUaXhGUVVGdFFtNUNMRWxCUVc1Q0xFTkJRWGRDTEU5QlFYaENMRVZCUVdsRFJDeFhRVUZxUXl4RFFVRTJReXhaUVVFM1F6dEJRVU5CTVVVc1ZVRkJUVGhHTEZOQlFVNHNSVUZCYlVKdVFpeEpRVUZ1UWl4RFFVRjNRaXhqUVVGNFFpeEZRVUYzUTBRc1YwRkJlRU1zUTBGQmIwUXNUVUZCY0VRN1FVRkRRVEZGTEZWQlFVMDRSaXhUUVVGT0xFVkJRVzFDYmtJc1NVRkJia0lzYTBKQlFYVkRTeXhIUVVGMlF5eEZRVUU0UTJ4RExGRkJRVGxETEVOQlFYVkVMRTFCUVhaRU8wRkJRMEU1UXl4VlFVRk5PRVlzVTBGQlRpeHJRa0ZCTkVKa0xFZEJRVFZDTEVWQlFXMURUaXhYUVVGdVF5eERRVUVyUXl4cFFrRkJMME03UVVGRFFURkZMRlZCUVUwNFJpeFRRVUZPTEhOQ1FVRnJRM0JDTEZkQlFXeERMRU5CUVRoRExGRkJRVGxETzBGQlEwRXhSU3hKUVVGRk1FWXNSVUZCUlVVc1RVRkJTaXhGUVVGWk9VTXNVVUZCV2l4RFFVRnhRaXhSUVVGeVFqczdRVUZGUVdkRExHOUNRVUZyUW1Fc1UwRkJVek5HTEZGQlFVMDRSaXhUUVVGT0xFVkJRVzFDUkN4SlFVRnVRaXhEUVVGM1FpeFpRVUY0UWl4RFFVRlVMRU5CUVd4Q0xFVkJRVzFGWWl4SFFVRnVSVHM3UVVGRlFURkRMR0ZCUVZjc1dVRkJUVHRCUVVOb1FtdERMR05CUVZkdFFpeFRRVUZUTTBZc1VVRkJUVGhHTEZOQlFVNHNSVUZCYlVKRUxFbEJRVzVDTEVOQlFYZENMRmxCUVhoQ0xFTkJRVlFzUTBGQldEdEJRVU5CTEVkQlJrUXNSVUZGUnl4SFFVWklPenRCUVVsQkxFMUJRVWRETEdOQlFXTXNWVUZCYWtJc1JVRkJORUk3UVVGRE0wSTVSaXhYUVVGTk9FWXNVMEZCVGl4RlFVRnRRbTVDTEVsQlFXNUNMRU5CUVhkQ0xHRkJRWGhDTEVWQlFYVkROMElzVVVGQmRrTXNRMEZCWjBRc1VVRkJhRVE3UVVGRFFUbERMRmRCUVUwNFJpeFRRVUZPTEVWQlFXMUNSeXhGUVVGdVFpeERRVUZ6UWl4clJFRkJkRUlzUlVGQk1FVXNWVUZCUTBNc1JVRkJSQ3hGUVVGUk8wRkJReTlGYkVjc1dVRkJUVGhHTEZOQlFVNHNSVUZCYlVKdVFpeEpRVUZ1UWl4RFFVRjNRaXhoUVVGNFFpeEZRVUYxUTBRc1YwRkJka01zUTBGQmJVUXNVVUZCYmtRN1FVRkRSaXhKUVVaRU8wRkJSMEU3UVVGRFJDeEZRV3BEUkRzN1FVRnRRMFE3TzBGQlJVTXhSU3hIUVVGRkxHOUVRVUZHTEVWQlFYZEVOa1VzUzBGQmVFUXNRMEZCT0VRc1ZVRkJRMkVzUTBGQlJDeEZRVUZQT3p0QlFVVndSU3hOUVVGSGVFY3NWVUZCVldNc1JVRkJSVEJHTEVWQlFVVlRMR0ZCUVVvc1JVRkJiVUpLTEU5QlFXNUNMRU5CUVRKQ0xGTkJRVE5DTEVWQlFYTkRSaXhKUVVGMFF5eERRVUV5UXl4SlFVRXpReXhEUVVGV0xFVkJRVFJFZEVjc1YwRkJMMFFzUlVGQk5FVTdRVUZET1VVN1FVRkRSelpITEcxQ1FVRm5RaXhMUVVGb1FpeEZRVUYxUW5CSExFVkJRVVV3Uml4RlFVRkZVeXhoUVVGS0xFVkJRVzFDU2l4UFFVRnVRaXhEUVVFeVFpeFRRVUV6UWl4RlFVRnpRMFlzU1VGQmRFTXNRMEZCTWtNc1NVRkJNME1zUTBGQmRrSTdRVUZEU0R0QlFVTkhUeXh0UWtGQlowSXNTVUZCYUVJc1JVRkJjMEp3Unl4RlFVRkZNRVlzUlVGQlJWTXNZVUZCU2l4RlFVRnRRa29zVDBGQmJrSXNRMEZCTWtJc1UwRkJNMElzUlVGQmMwTkdMRWxCUVhSRExFTkJRVEpETEVsQlFUTkRMRU5CUVhSQ0xFVkJRWGRGTEVsQlFYaEZPMEZCUTBFN1FVRkRTRHRCUVVORkxFMUJRVWNzUTBGQlF6ZEdMRVZCUVVVd1JpeEZRVUZGVXl4aFFVRktMRVZCUVcxQ1JTeFJRVUZ1UWl4RFFVRTBRaXhSUVVFMVFpeERRVUZLTEVWQlFUSkRPMEZCUXpGRFdpd3JRa0ZCTkVKRExFTkJRVFZDTzBGQlEwRTdRVUZEUkN4RlFWcEVPenRCUVdORU96dEJRVVZETEV0QlFVY3NRMEZCUXpGR0xFVkJRVVZ6Unl4UlFVRkdMRVZCUVZsVUxFbEJRVm9zUTBGQmFVSXNUVUZCYWtJc1JVRkJlVUoyUlN4UlFVRjZRaXhEUVVGclF5eFhRVUZzUXl4RFFVRktMRVZCUVc5RU8wRkJRMjVFZEVJc1NVRkJSU3hyUWtGQlJpeEZRVUZ6UW5WSExHTkJRWFJDTEVOQlFYRkRPMEZCUTNCRFF5eHhRa0ZCYTBJc1UwRkVhMEk3UVVGRmNFTkRMRmRCUVZFc1ZVRkdORUk3UVVGSGNFTkRMR3RDUVVGbE0wZ3NTVUZJY1VJN1FVRkpjRU0wU0N4bFFVRlpMRWxCU25kQ08wRkJTM0JEUXl4alFVRlhMRWxCVEhsQ08wRkJUWEJEUXl4bFFVRlpMRzlDUVVGRGNFTXNTMEZCUkN4RlFVRlhMRU5CUVVVc1EwRk9WenRCUVU5d1EzRkRMR05CUVZjc2JVSkJRVU55UXl4TFFVRkVMRVZCUVZjN1FVRkRla0k3TzBGQlJVbEVMR1ZCUVZkRExFdEJRVmc3UVVGRFFTeEpRVmh0UXp0QlFWbHdRM05ETEZOQlFVMHNTMEZhT0VJN1FVRmhjRU5ETEdGQlFWVXNTVUZpTUVJN1FVRmpjRU5ETEhWQ1FVRnZRaXhMUVdSblFqdEJRV1Z3UTBNc1kwRkJWenRCUVdaNVFpeEhRVUZ5UXpzN1FVRnJRa0ZzU0N4SlFVRkZMR3RDUVVGR0xFVkJRWE5DYlVnc1RVRkJkRUlzUTBGQk5rSXNRMEZCTjBJN1FVRkRRVHM3UVVGRlJqczdRVUZGUTI1SUxFZEJRVVVzV1VGQlJpeEZRVUZuUWpaRkxFdEJRV2hDTEVOQlFYTkNMRlZCUVVOaExFTkJRVVFzUlVGQlR6dEJRVU0xUWl4TlFVRkpNRUlzYVVKQlFXbENjRWdzUlVGQlJUQkdMRVZCUVVWRkxFMUJRVW9zUlVGQldVY3NUMEZCV2l4RFFVRnZRaTlHTEVWQlFVVXNZVUZCUml4RFFVRndRaXhEUVVGeVFqczdRVUZGUVN4TlFVRkhiMGdzWlVGQlpXWXNVVUZCWml4RFFVRjNRaXhOUVVGNFFpeERRVUZJTEVWQlFXOURPMEZCUTI1RFpTeHJRa0ZCWlRGRExGZEJRV1lzUTBGQk1rSXNUVUZCTTBJN1FVRkRRVEJETEd0Q1FVRmxla01zU1VGQlppeERRVUZ2UWl4WlFVRndRaXhGUVVGclEwUXNWMEZCYkVNc1EwRkJPRU1zVVVGQk9VTTdRVUZEUVRCRExHdENRVUZsYmtNc1VVRkJaaXhEUVVGM1FpeGhRVUY0UWl4RlFVRjFRME1zUjBGQmRrTXNRMEZCTWtNc1ZVRkJRMFlzUjBGQlJDeEZRVUZOY1VNc1QwRkJUaXhGUVVGclFqdEJRVU0xUkhKSUxFMUJRVVZ4U0N4UFFVRkdMRVZCUVZjelF5eFhRVUZZTEVOQlFYVkNMRkZCUVhaQ08wRkJRMEV4UlN4TlFVRkZjVWdzVDBGQlJpeEZRVUZYTVVNc1NVRkJXQ3hEUVVGblFpeFBRVUZvUWl4RlFVRjVRa1FzVjBGQmVrSXNRMEZCY1VNc1UwRkJja01zUlVGQlowUTFRaXhSUVVGb1JDeERRVUY1UkN4WlFVRjZSRHRCUVVOQkxFbEJTRVE3UVVGSlFTeEhRVkJFTEUxQlQwODdRVUZEVG5ORkxHdENRVUZsTVVNc1YwRkJaaXhEUVVFeVFpeFJRVUV6UWl4RlFVRnhRelZDTEZGQlFYSkRMRU5CUVRoRExFMUJRVGxETzBGQlEwRnpSU3hyUWtGQlpXNUNMRVZCUVdZc1EwRkJhMElzYTBSQlFXeENMRVZCUVhORkxGVkJRVU5ETEVWQlFVUXNSVUZCVVR0QlFVTXpSV3hITEUxQlFVVXNhMEpCUVVZc1JVRkJjMEl5UlN4SlFVRjBRaXhEUVVFeVFpeFpRVUV6UWl4RlFVRjVRemRDTEZGQlFYcERMRU5CUVd0RUxGRkJRV3hFTzBGQlEwWXNTVUZHUkR0QlFVZEJjMFVzYTBKQlFXVnVReXhSUVVGbUxFTkJRWGRDTEdGQlFYaENMRVZCUVhWRFF5eEhRVUYyUXl4RFFVRXlReXhWUVVGRFJpeEhRVUZFTEVWQlFVMXhReXhQUVVGT0xFVkJRV3RDTzBGQlF6VkVja2dzVFVGQlJYRklMRTlCUVVZc1JVRkJWek5ETEZkQlFWZ3NRMEZCZFVJc1RVRkJka0lzUlVGQkswSTFRaXhSUVVFdlFpeERRVUYzUXl4UlFVRjRRenRCUVVOQk9VTXNUVUZCUlhGSUxFOUJRVVlzUlVGQlZ6RkRMRWxCUVZnc1EwRkJaMElzVDBGQmFFSXNSVUZCZVVKRUxGZEJRWHBDTEVOQlFYRkRMRmxCUVhKRExFVkJRVzFFTlVJc1VVRkJia1FzUTBGQk5FUXNVMEZCTlVRN1FVRkRRVGxETEUxQlFVVnhTQ3hQUVVGR0xFVkJRVmN4UXl4SlFVRllMRU5CUVdkQ0xGbEJRV2hDTEVWQlFUaENSQ3hYUVVFNVFpeERRVUV3UXl4UlFVRXhRenRCUVVOQkxFbEJTa1E3UVVGTFFUdEJRVU5FTUVNc2FVSkJRV1Y2UXl4SlFVRm1MRU5CUVc5Q0xFOUJRWEJDTEVWQlFUWkNSQ3hYUVVFM1FpeERRVUY1UXl4VFFVRjZReXhGUVVGdlJEVkNMRkZCUVhCRUxFTkJRVFpFTEZsQlFUZEVPMEZCUTBFc1JVRjBRa1E3TzBGQmQwSkVPenRCUVVWRE9VTXNSMEZCUlN4WlFVRkdMRVZCUVdkQ05rVXNTMEZCYUVJc1EwRkJjMElzV1VGQlRUdEJRVU16UWl4TlFVRkhOMFVzUlVGQlJVY3NUVUZCUml4RlFVRlZlVVFzVFVGQlZpeE5RVUZ6UWpWRUxFVkJRVVVzVDBGQlJpeEZRVUZYTUVJc1RVRkJXQ3hIUVVGdlFpeERRVUV4UXl4TlFVRnBSQ3hEUVVGRk1VSXNSVUZCUlN4clFrRkJSaXhGUVVGelFuTklMRTFCUVhSQ0xFZEJRU3RDUXl4SFFVRnlSaXhGUVVFd1JqdEJRVU0xUmp0QlFVTkpka2dzUzBGQlJTeHJRa0ZCUml4RlFVRnpRbTFJTEUxQlFYUkNMRU5CUVRaQ0xFTkJRVGRDTzBGQlEwUXNSMEZJUkN4TlFVZFBPMEZCUTA1dVNDeExRVUZGTEd0Q1FVRkdMRVZCUVhOQ2QwZ3NVVUZCZEVJN1FVRkRRVHRCUVVORUxFVkJVRVE3TzBGQlUwUTdPMEZCUlVNc1MwRkJUVU1zZFVKQlFYVkNMRk5CUVhaQ1FTeHZRa0ZCZFVJc1IwRkJUVHRCUVVOc1F5eE5RVUZIZEVnc1QwRkJUME1zVlVGQlVDeEhRVUZ2UWl4SFFVRndRaXhKUVVFeVFpeERRVUZEU2l4RlFVRkZMRlZCUVVZc1JVRkJZM0ZITEZGQlFXUXNRMEZCZFVJc1VVRkJka0lzUTBGQkwwSXNSVUZCYVVVN08wRkJSV2hGTEU5QlFVZHlSeXhGUVVGRkxGRkJRVVlzUlVGQldUUkZMRWRCUVZvc1EwRkJaMElzUTBGQmFFSXNSVUZCYlVJNFF5eFZRVUZ1UWl4TFFVRnJReXhEUVVGeVF5eEZRVUYzUXp0QlFVTjJRekZJTEUxQlFVVXNWVUZCUml4RlFVRmpPRU1zVVVGQlpDeERRVUYxUWl4UlFVRjJRanRCUVVOQk8wRkJRMFE3UVVGRFJDeEZRVkJFT3p0QlFWTkVPenRCUVVWRExFdEJRVTF6UkN4clFrRkJhMElzVTBGQmJFSkJMR1ZCUVd0Q0xFTkJRVU4xUWl4SlFVRkVMRVZCUVU4M1FpeFRRVUZRTEVWQlFXdENMMGNzU1VGQmJFSXNSVUZCTWtJN1FVRkRhRVFzVFVGQlJ6UkpMRWxCUVVnc1JVRkJVenRCUVVOVWVra3NZVUZCVlRSSExGTkJRVllzUlVGQmNVSjRSeXhSUVVGeVFpeEhRVUZuUXpCQ0xGbEJRVmtzV1VGQlRUdEJRVU12UXpSSExHOUNRVUZuUWpsQ0xGTkJRV2hDTEVWQlFUSkNMRWRCUVROQ08wRkJRMEVzU1VGR05rSXNSVUZGTTBJdlJ5eEpRVVl5UWl4RFFVRm9RenRCUVVkRExFZEJTa1FzVFVGSlR6dEJRVU5PT0Vrc2FVSkJRV016U1N4VlFVRlZORWNzVTBGQlZpeEZRVUZ4UW5oSExGRkJRVzVETzBGQlEwRTdRVUZEU0N4RlFWSkVPenRCUVZWRU96dEJRVVZETEV0QlFVY3NRMEZCUTFVc1JVRkJSWE5ITEZGQlFVWXNSVUZCV1ZRc1NVRkJXaXhEUVVGcFFpeE5RVUZxUWl4RlFVRjVRblpGTEZGQlFYcENMRU5CUVd0RExGZEJRV3hETEVOQlFVb3NSVUZCYjBRN1FVRkRia1JPTEdOQlFWa3NXVUZCVFR0QlFVTnFRaXhQUVVGSGFFSXNSVUZCUlN4clFrRkJSaXhGUVVGelFuTklMRTFCUVhSQ0xFZEJRU3RDUXl4SFFVRXZRaXhKUVVGelF5eEZRVUZIY0Vnc1QwRkJUekpJTEZkQlFWQXNSMEZCY1VJc1IwRkJlRUlzUTBGQmVrTXNSVUZCZFVVN1FVRkRkRVU1U0N4TlFVRkZMSFZDUVVGR0xFVkJRVEpDT0VNc1VVRkJNMElzUTBGQmIwTXNaVUZCY0VNN1FVRkRRVGxETEUxQlFVVXNVVUZCUml4RlFVRlpORVVzUjBGQldpeERRVUZuUWl4RFFVRm9RaXhGUVVGdFFtMUVMRWxCUVc1Q08wRkJRMEV2U0N4TlFVRkZMRkZCUVVZc1JVRkJXVGhETEZGQlFWb3NRMEZCY1VJc1UwRkJja0k3UVVGRFFTeEpRVXBFTEUxQlNVODdRVUZEVGpsRExFMUJRVVVzZFVKQlFVWXNSVUZCTWtJd1JTeFhRVUV6UWl4RFFVRjFReXhsUVVGMlF6dEJRVU5CTVVVc1RVRkJSU3hSUVVGR0xFVkJRVmswUlN4SFFVRmFMRU5CUVdkQ0xFTkJRV2hDTEVWQlFXMUNiMFFzUzBGQmJrSTdRVUZEUVdoSkxFMUJRVVVzVVVGQlJpeEZRVUZaTUVVc1YwRkJXaXhEUVVGM1FpeFRRVUY0UWp0QlFVTkJPenRCUVVWS096dEJRVVZITEU5QlFVY3hSU3hGUVVGRkxHdENRVUZHTEVWQlFYTkNjMGdzVFVGQmRFSXNSMEZCSzBKRExFZEJRUzlDTEVkQlFYRkRMRVZCUVVkd1NDeFBRVUZQTWtnc1YwRkJVQ3hIUVVGeFFpeERRVUY0UWl4RFFVRjRReXhGUVVGdlJUdEJRVU51UlRsSUxFMUJRVVVzV1VGQlJpeEZRVUZuUW5GR0xFZEJRV2hDTEVOQlFXOUNMRVZCUVVNc1lVRkJZU3hwUTBGQlpDeEZRVUZ3UWp0QlFVTkJMRWxCUmtRc1RVRkZUenRCUVVOT2NrWXNUVUZCUlN4WlFVRkdMRVZCUVdkQ2NVWXNSMEZCYUVJc1EwRkJiMElzUlVGQlF5eGhRVUZoTEN0Q1FVRmtMRVZCUVhCQ08wRkJRMEU3TzBGQlJVUnZRenM3UVVGRlNEczdRVUZGUnl4UFFVRkhkRWdzVDBGQlR6aElMRlZCUVZBc1EwRkJhMElzTUVKQlFXeENMRVZCUVRoRFF5eFBRVUU1UXl4SlFVRjVSQzlJTEU5QlFVOURMRlZCUVZBc1IwRkJiMElzUjBGQmFFWXNSVUZCY1VZN1FVRkRia1pLTEUxQlFVVXNOa1ZCUVVZc1JVRkJhVVk0UXl4UlFVRnFSaXhEUVVFd1JpeFhRVUV4Ump0QlFVTkVMRWxCUmtRc1RVRkZUenRCUVVOTU9VTXNUVUZCUlN3MlJVRkJSaXhGUVVGcFJqQkZMRmRCUVdwR0xFTkJRVFpHTEZkQlFUZEdPMEZCUTBRN08wRkJSVVFzVDBGQlJ6RkZMRVZCUVVVc2EwSkJRVVlzUlVGQmMwSXdRaXhOUVVGNlFpeEZRVUZwUXp0QlFVRkZPMEZCUTJ4RExGRkJRVWQ0UXl4VlFVRlZSeXhSUVVGV0xFTkJRVzFDUlN4WFFVRnVRaXhMUVVGdFF5eEpRVUYwUXl4RlFVRTBRenRCUVVNelEwd3NaVUZCVlVjc1VVRkJWaXhEUVVGdFFrVXNWMEZCYmtJc1IwRkJhVU1zU1VGQmFrTTdRVUZEUVRaSExIRkNRVUZuUWl4SlFVRm9RaXhGUVVGelFpeFZRVUYwUWl4RlFVRnJReXhKUVVGc1F6dEJRVU5CTzBGQlEwUXNTVUZNUkN4TlFVdFBPMEZCUVVVN1FVRkRVaXhSUVVGSGJFZ3NWVUZCVlVjc1VVRkJWaXhEUVVGdFFrVXNWMEZCYmtJc1MwRkJiVU1zU1VGQmRFTXNSVUZCTkVNN1FVRkRNME0yUnl4eFFrRkJaMElzUzBGQmFFSXNSVUZCZFVJc1ZVRkJka0k3UVVGRFFXeElMR1ZCUVZWSExGRkJRVllzUTBGQmJVSkZMRmRCUVc1Q0xFZEJRV2xETEV0QlFXcERPMEZCUTBFN1FVRkRSRHM3UVVGRlJDeFBRVUZIVXl4RlFVRkZMR3RDUVVGR0xFVkJRWE5DTUVJc1RVRkJla0lzUlVGQmFVTTdRVUZCUlR0QlFVTnNReXhSUVVGSGVFTXNWVUZCVlUwc1VVRkJWaXhEUVVGdFFrUXNWMEZCYmtJc1MwRkJiVU1zU1VGQmRFTXNSVUZCTkVNN1FVRkRNME5NTEdWQlFWVk5MRkZCUVZZc1EwRkJiVUpFTEZkQlFXNUNMRWRCUVdsRExFbEJRV3BETzBGQlEwRTJSeXh4UWtGQlowSXNTVUZCYUVJc1JVRkJjMElzVlVGQmRFSXNSVUZCYTBNc1NVRkJiRU03UVVGRFFUdEJRVU5FTEVsQlRFUXNUVUZMVHp0QlFVRkZPMEZCUTFJc1VVRkJSMnhJTEZWQlFWVk5MRkZCUVZZc1EwRkJiVUpFTEZkQlFXNUNMRXRCUVcxRExFbEJRWFJETEVWQlFUUkRPMEZCUXpORE5rY3NjVUpCUVdkQ0xFdEJRV2hDTEVWQlFYVkNMRlZCUVhaQ08wRkJRMEZzU0N4bFFVRlZUU3hSUVVGV0xFTkJRVzFDUkN4WFFVRnVRaXhIUVVGcFF5eExRVUZxUXp0QlFVTkJPMEZCUTBRN1FVRkRSQ3hIUVhCRVJDeEZRVzlFUnl4SFFYQkVTRHRCUVhGRVFUczdRVUZGUmpzN1FVRkZRMU1zUjBGQlJTeFhRVUZHTEVWQlFXVTJSU3hMUVVGbUxFTkJRWEZDTEZWQlFVTmhMRU5CUVVRc1JVRkJUenRCUVVNelFpeE5RVUZOZVVNc1ZVRkJWWGhETEZOQlFWTXpSaXhGUVVGRk1FWXNSVUZCUlVVc1RVRkJTaXhGUVVGWlF5eEpRVUZhTEVOQlFXbENMRmxCUVdwQ0xFTkJRVlFzUTBGQmFFSTdRVUZEUVRkR0xFbEJRVVVzYTBKQlFVWXNSVUZCYzBKdFNDeE5RVUYwUWl4RFFVRTJRbWRDTEU5QlFUZENPMEZCUTBGdVNTeEpRVUZGTEdWQlFVWXNSVUZCYlVJNFF5eFJRVUZ1UWl4RFFVRTBRaXhSUVVFMVFqczdRVUZGUVN4TlFVRkhjMFlzVDBGQlQwTXNVMEZCVUN4RFFVRnBRa01zVVVGQmFrSXNRMEZCTUVJc1owSkJRVEZDTEVOQlFVZ3NSVUZCWjBRN1FVRkROVU5ETEU5QlFVbEdMRk5CUVVvc1EwRkJZMGNzVFVGQlpDeERRVUZ4UWl4VlFVRnlRanRCUVVOQlNpeFZRVUZQUXl4VFFVRlFMRU5CUVdsQ1J5eE5RVUZxUWl4RFFVRjNRaXhuUWtGQmVFSTdRVUZEUVhaSkxGbEJRVk4zU1N4SlFVRlVMRU5CUVdORExFdEJRV1FzUTBGQmIwSkRMRkZCUVhCQ0xFZEJRU3RDTEZWQlFTOUNPMEZCUTBRN1FVRkRTQ3hGUVZaRU96dEJRVmxFT3p0QlFVVkRNMGtzUjBGQlJTeGxRVUZHTEVWQlFXMUNOa1VzUzBGQmJrSXNRMEZCZVVJc1ZVRkJRMkVzUTBGQlJDeEZRVUZQTzBGQlF6ZENRU3hKUVVGRmEwUXNaVUZCUmp0QlFVTkdMRVZCUmtRN08wRkJTVUVzUzBGQlNWSXNVMEZCVTI1SkxGTkJRVk5yUlN4alFVRlVMRU5CUVhkQ0xHRkJRWGhDTEVOQlFXSTdRVUZCUVN4TFFVTkRiMFVzVFVGQlRYUkpMRk5CUVZOclJTeGpRVUZVTEVOQlFYZENMRk5CUVhoQ0xFTkJSRkE3TzBGQlIwUTdPMEZCUlVVc1ZVRkJVekJGTEZWQlFWUXNSMEZCYzBJN08wRkJSWEJDTEUxQlFVZFVMRTlCUVU5RExGTkJRVkFzUTBGQmFVSkRMRkZCUVdwQ0xFTkJRVEJDTEdkQ1FVRXhRaXhEUVVGSUxFVkJRV2RFTzBGQlF6bERReXhQUVVGSlJpeFRRVUZLTEVOQlFXTkhMRTFCUVdRc1EwRkJjVUlzVlVGQmNrSTdRVUZEUVVvc1ZVRkJUME1zVTBGQlVDeERRVUZwUWtjc1RVRkJha0lzUTBGQmQwSXNaMEpCUVhoQ08wRkJRMEY0U1N4TFFVRkZMR1ZCUVVZc1JVRkJiVUk0UXl4UlFVRnVRaXhEUVVFMFFpeFJRVUUxUWp0QlFVTkVMRWRCU2tRc1RVRkxTenRCUVVOSWMwWXNWVUZCVDBNc1UwRkJVQ3hEUVVGcFFsTXNSMEZCYWtJc1EwRkJjVUlzWjBKQlFYSkNPMEZCUTBGUUxFOUJRVWxHTEZOQlFVb3NRMEZCWTFNc1IwRkJaQ3hEUVVGclFpeFZRVUZzUWp0QlFVTkJPVWtzUzBGQlJTeGxRVUZHTEVWQlFXMUNNRVVzVjBGQmJrSXNRMEZCSzBJc1VVRkJMMEk3UVVGRFJEdEJRVU5HT3p0QlFVVklPenRCUVVWRkxFdEJRVWNzUTBGQlF6RkZMRVZCUVVWelJ5eFJRVUZHTEVWQlFWbFVMRWxCUVZvc1EwRkJhVUlzVFVGQmFrSXNSVUZCZVVKMlJTeFJRVUY2UWl4RFFVRnJReXhYUVVGc1F5eERRVUZLTEVWQlFXOUVPMEZCUTI1RU9FY3NVMEZCVHpsRUxHZENRVUZRTEVOQlFYZENMRTlCUVhoQ0xFVkJRV2xEZFVVc1ZVRkJha003UVVGRFFUczdRVUZGU0RzN1FVRkZSVEZKTEZGQlFVOXRSU3huUWtGQlVDeERRVUYzUWl4UlFVRjRRaXhGUVVGclF5eFpRVUZYTzBGQlF6TkRMRTFCUVVkdVJTeFBRVUZQUXl4VlFVRlFMRWRCUVc5Q0xFbEJRWEJDTEVsQlFUUkNiVWtzU1VGQlNVWXNVMEZCU2l4RFFVRmpReXhSUVVGa0xFTkJRWFZDTEZWQlFYWkNMRU5CUVM5Q0xFVkJRVzFGTzBGQlEycEZUenRCUVVOQlRpeFBRVUZKUml4VFFVRktMRU5CUVdOSExFMUJRV1FzUTBGQmNVSXNWVUZCY2tJN1FVRkRRM2hKTEV0QlFVVXNaVUZCUml4RlFVRnRRamhETEZGQlFXNUNMRU5CUVRSQ0xGRkJRVFZDTzBGQlEwWTdRVUZEUml4RlFVNUVPenRCUVZGR096dEJRVVZGTEV0QlFVYzVReXhGUVVGRmMwY3NVVUZCUml4RlFVRlpWQ3hKUVVGYUxFTkJRV2xDTEUxQlFXcENMRVZCUVhsQ2RrVXNVVUZCZWtJc1EwRkJhME1zVjBGQmJFTXNRMEZCU0N4RlFVRnRSRHRCUVVOdVJDeE5RVUZIZEVJc1JVRkJSWE5ITEZGQlFVWXNSVUZCV1ZRc1NVRkJXaXhEUVVGcFFpeE5RVUZxUWl4RlFVRjVRblpGTEZGQlFYcENMRU5CUVd0RExGbEJRV3hETEVOQlFVZ3NSVUZCYjBRN1FVRkRia1JyUkN4alFVRlhMRU5CUVZnN1FVRkRRVHRCUVVORUxFMUJRVWQ0UlN4RlFVRkZjMGNzVVVGQlJpeEZRVUZaVkN4SlFVRmFMRU5CUVdsQ0xFMUJRV3BDTEVWQlFYbENka1VzVVVGQmVrSXNRMEZCYTBNc2FVSkJRV3hETEVOQlFVZ3NSVUZCZVVRN1FVRkRlRVJyUkN4alFVRlhMRU5CUVZnN1FVRkRRVHRCUVVORUxFMUJRVWQ0UlN4RlFVRkZjMGNzVVVGQlJpeEZRVUZaVkN4SlFVRmFMRU5CUVdsQ0xFMUJRV3BDTEVWQlFYbENka1VzVVVGQmVrSXNRMEZCYTBNc1kwRkJiRU1zUTBGQlNDeEZRVUZ6UkR0QlFVTnlSR3RFTEdOQlFWY3NRMEZCV0R0QlFVTkJPMEZCUTBRc1RVRkJSM2hGTEVWQlFVVnpSeXhSUVVGR0xFVkJRVmxVTEVsQlFWb3NRMEZCYVVJc1RVRkJha0lzUlVGQmVVSjJSU3hSUVVGNlFpeERRVUZyUXl4WlFVRnNReXhEUVVGSUxFVkJRVzlFTzBGQlEyNUVhMFFzWTBGQlZ5eERRVUZZTzBGQlEwRTdRVUZEUkN4TlFVRkhlRVVzUlVGQlJYTkhMRkZCUVVZc1JVRkJXVlFzU1VGQldpeERRVUZwUWl4TlFVRnFRaXhGUVVGNVFuWkZMRkZCUVhwQ0xFTkJRV3RETEZsQlFXeERMRU5CUVVnc1JVRkJiMFE3UVVGRGJrUk9MR1ZCUVZrc1dVRkJUVHRCUVVOcVFubEhPMEZCUTBFc1NVRkdSQ3hGUVVWSExFZEJSa2c3UVVGSFFUdEJRVU5FT3p0QlFVVkdPenRCUVVWRkxGVkJRVk56UWl4WFFVRlVMRU5CUVhGQ1F5eEZRVUZ5UWl4RlFVRjVRa01zU1VGQmVrSXNSVUZCSzBJN1FVRkRPVUlzVFVGQlNVTXNXVUZCV1N4RlFVRm9RanRCUVVOQlFTeFpRVUZWUXl4RlFVRldMRWRCUVdVc1EwRkJaaXhEUVVGclFrUXNWVUZCVlVVc1JVRkJWaXhIUVVGbExFTkJRV1lzUTBGQmEwSkdMRlZCUVZWSExFVkJRVllzUjBGQlpTeERRVUZtTEVOQlFXdENTQ3hWUVVGVlNTeEZRVUZXTEVkQlFXVXNRMEZCWmp0QlFVTjBSQ3hOUVVGSlF5eFJRVUZSTEVWQlFWb3NRMEZJT0VJc1EwRkhZanRCUVVOcVFpeE5RVUZKUXl4UlFVRlJMRVZCUVZvc1EwRktPRUlzUTBGSllqdEJRVU5xUWl4TlFVRkpReXhSUVVGUkxFVkJRVm9zUTBGTU9FSXNRMEZMWWp0QlFVTnFRaXhOUVVGSlF5eFJRVUZSTEVWQlFWb3NRMEZPT0VJc1EwRk5ZanRCUVVOcVFpeE5RVUZKUXl4UlFVRlJMRVZCUVZvN1FVRkRRU3hOUVVGSmRrVXNUVUZCVFc1R0xGTkJRVk5yUlN4alFVRlVMRU5CUVhkQ05rVXNSVUZCZUVJc1EwRkJWanRCUVVOQk5VUXNUVUZCU1dRc1owSkJRVW9zUTBGQmNVSXNXVUZCY2tJc1JVRkJhME1zVlVGQlUyOUNMRU5CUVZRc1JVRkJWenRCUVVNelF5eFBRVUZKYTBVc1NVRkJTV3hGTEVWQlFVVnRSU3hQUVVGR0xFTkJRVlVzUTBGQlZpeERRVUZTTzBGQlEwRllMR0ZCUVZWRExFVkJRVllzUjBGQlpWTXNSVUZCUlVVc1QwRkJha0k3UVVGRFFWb3NZVUZCVlVVc1JVRkJWaXhIUVVGbFVTeEZRVUZGUnl4UFFVRnFRanRCUVVORUxFZEJTa1FzUlVGSlJTeExRVXBHTzBGQlMwRXpSU3hOUVVGSlpDeG5Ra0ZCU2l4RFFVRnhRaXhYUVVGeVFpeEZRVUZwUXl4VlFVRlRiMElzUTBGQlZDeEZRVUZYTzBGQlF6RkRRU3hMUVVGRmMwVXNZMEZCUmp0QlFVTkJMRTlCUVVsS0xFbEJRVWxzUlN4RlFVRkZiVVVzVDBGQlJpeERRVUZWTEVOQlFWWXNRMEZCVWp0QlFVTkJXQ3hoUVVGVlJ5eEZRVUZXTEVkQlFXVlBMRVZCUVVWRkxFOUJRV3BDTzBGQlEwRmFMR0ZCUVZWSkxFVkJRVllzUjBGQlpVMHNSVUZCUlVjc1QwRkJha0k3UVVGRFJDeEhRVXhFTEVWQlMwVXNTMEZNUmp0QlFVMUJNMFVzVFVGQlNXUXNaMEpCUVVvc1EwRkJjVUlzVlVGQmNrSXNSVUZCWjBNc1ZVRkJVMjlDTEVOQlFWUXNSVUZCVnp0QlFVTjZRenRCUVVOQkxFOUJRVXNzUTBGQlJYZEVMRlZCUVZWSExFVkJRVllzUjBGQlpVVXNTMEZCWml4SFFVRjFRa3dzVlVGQlZVTXNSVUZCYkVNc1NVRkJNRU5FTEZWQlFWVkhMRVZCUVZZc1IwRkJaVVVzUzBGQlppeEhRVUYxUWt3c1ZVRkJWVU1zUlVGQk5VVXNTMEZCYzBaRUxGVkJRVlZKTEVWQlFWWXNSMEZCWlVvc1ZVRkJWVVVzUlVGQlZpeEhRVUZsVFN4TFFVRXZRaXhKUVVFd1ExSXNWVUZCVlVVc1JVRkJWaXhIUVVGbFJpeFZRVUZWU1N4RlFVRldMRWRCUVdWSkxFdEJRWGhGTEVsQlFXMUdVaXhWUVVGVlJ5eEZRVUZXTEVkQlFXVXNRMEZCTlV3c1JVRkJhMDA3UVVGRGFFMHNVVUZCUjBnc1ZVRkJWVWNzUlVGQlZpeEhRVUZsU0N4VlFVRlZReXhGUVVFMVFpeEZRVUZuUTFFc1VVRkJVU3hIUVVGU0xFTkJRV2hETEV0QlEwdEJMRkZCUVZFc1IwRkJVanRCUVVOT08wRkJRMFE3UVVGS1FTeFJRVXRMTEVsQlFVc3NRMEZCUlZRc1ZVRkJWVWtzUlVGQlZpeEhRVUZsUnl4TFFVRm1MRWRCUVhWQ1VDeFZRVUZWUlN4RlFVRnNReXhKUVVFd1EwWXNWVUZCVlVrc1JVRkJWaXhIUVVGbFJ5eExRVUZtTEVkQlFYVkNVQ3hWUVVGVlJTeEZRVUUxUlN4TFFVRnpSa1lzVlVGQlZVY3NSVUZCVml4SFFVRmxTQ3hWUVVGVlF5eEZRVUZXTEVkQlFXVkxMRXRCUVM5Q0xFbEJRVEJEVGl4VlFVRlZReXhGUVVGV0xFZEJRV1ZFTEZWQlFWVkhMRVZCUVZZc1IwRkJaVWNzUzBGQmVFVXNTVUZCYlVaT0xGVkJRVlZKTEVWQlFWWXNSMEZCWlN4RFFVRTFUQ3hGUVVGclRUdEJRVU55VFN4VFFVRkhTaXhWUVVGVlNTeEZRVUZXTEVkQlFXVktMRlZCUVZWRkxFVkJRVFZDTEVWQlFXZERUeXhSUVVGUkxFZEJRVklzUTBGQmFFTXNTMEZEUzBFc1VVRkJVU3hIUVVGU08wRkJRMDQ3TzBGQlJVUXNUMEZCU1VFc1UwRkJVeXhGUVVGaUxFVkJRV2xDTzBGQlEyWXNVVUZCUnl4UFFVRlBWaXhKUVVGUUxFbEJRV1VzVlVGQmJFSXNSVUZCT0VKQkxFdEJRVXRFTEVWQlFVd3NSVUZCVVZjc1MwRkJVanRCUVVNdlFqdEJRVU5FTEU5QlFVbEJMRkZCUVZFc1JVRkJXanRCUVVOQlZDeGhRVUZWUXl4RlFVRldMRWRCUVdVc1EwRkJaaXhEUVVGclFrUXNWVUZCVlVVc1JVRkJWaXhIUVVGbExFTkJRV1lzUTBGQmEwSkdMRlZCUVZWSExFVkJRVllzUjBGQlpTeERRVUZtTEVOQlFXdENTQ3hWUVVGVlNTeEZRVUZXTEVkQlFXVXNRMEZCWmp0QlFVTjJSQ3hIUVdwQ1JDeEZRV2xDUlN4TFFXcENSanRCUVd0Q1JEczdRVUZGUmpzN1FVRkZReXhMUVVGTk1VSXNhMEpCUVd0Q0xGTkJRV3hDUVN4bFFVRnJRaXhEUVVGRGIwSXNSVUZCUkN4RlFVRkxhVUlzUTBGQlRDeEZRVUZYT3p0QlFVVnNReXhOUVVGSGFrSXNUMEZCVHl4VlFVRldMRVZCUVhOQ096dEJRVVZ5UWl4UFFVRk5hMElzTWtKQlFUSkNiRXNzUlVGQlJTd3dRa0ZCUml4RlFVRTRRakJDTEUxQlFTOUVPenRCUVVWQkxFOUJRVWQxU1N4TlFVRk5MRWRCUVZRc1JVRkJZenM3UVVGRllpeFJRVUZIYUV3c1kwRkJZMmxNTERKQ1FVRXlRaXhEUVVFMVF5eEZRVUVyUXp0QlFVTTVRMnBNTzBGQlEwRXNTMEZHUkN4TlFVVlBPMEZCUTA1QkxHMUNRVUZqTEVOQlFXUTdRVUZEUVRzN1FVRkZSR1VzVFVGQlJTd3dRa0ZCUml4RlFVRTRRbVlzVjBGQk9VSXNSVUZCTWtNMFJpeExRVUV6UXp0QlFVTkJPMEZCUTBRc1QwRkJSMjlHTEUxQlFVMHNSMEZCVkN4RlFVRmpPenRCUVVWaUxGRkJRVWRvVEN4alFVRmpMRU5CUVdwQ0xFVkJRVzlDTzBGQlEyNUNRVHRCUVVOQkxFdEJSa1FzVFVGRlR6dEJRVU5PUVN4dFFrRkJZMmxNTERKQ1FVRXlRaXhEUVVGNlF6dEJRVU5CT3p0QlFVVkViRXNzVFVGQlJTd3dRa0ZCUml4RlFVRTRRbVlzVjBGQk9VSXNSVUZCTWtNMFJpeExRVUV6UXp0QlFVTkJPMEZCUTBRN1FVRkRSQ3hOUVVGSGJVVXNUMEZCVHl4VlFVRldMRVZCUVhOQ096dEJRVVZ5UWl4UFFVRk5iVUlzTWtKQlFUSkNia3NzUlVGQlJTd3dRa0ZCUml4RlFVRTRRakJDTEUxQlFTOUVPenRCUVVWQkxFOUJRVWQxU1N4TlFVRk5MRWRCUVZRc1JVRkJZenM3UVVGRllpeFJRVUZIYWt3c1kwRkJZMjFNTERKQ1FVRXlRaXhEUVVFMVF5eEZRVUVyUXp0QlFVTTVRMjVNTzBGQlEwRXNTMEZHUkN4TlFVVlBPMEZCUTA1QkxHMUNRVUZqTEVOQlFXUTdRVUZEUVRzN1FVRkZSR2RDTEUxQlFVVXNNRUpCUVVZc1JVRkJPRUpvUWl4WFFVRTVRaXhGUVVFeVF6WkdMRXRCUVRORE8wRkJRMEU3UVVGRFJDeFBRVUZIYjBZc1RVRkJUU3hIUVVGVUxFVkJRV003TzBGQlJXSXNVVUZCUjJwTUxHTkJRV01zUTBGQmFrSXNSVUZCYjBJN1FVRkRia0pCTzBGQlEwRXNTMEZHUkN4TlFVVlBPMEZCUTA1QkxHMUNRVUZqYlV3c01rSkJRVEpDTEVOQlFYcERPMEZCUTBFN08wRkJSVVJ1U3l4TlFVRkZMREJDUVVGR0xFVkJRVGhDYUVJc1YwRkJPVUlzUlVGQk1rTTJSaXhMUVVFelF6dEJRVU5CTzBGQlEwUTdRVUZEUkN4RlFYQkVSRHM3UVVGelJFUTdPMEZCUlVNc1MwRkJSeXhEUVVGRE4wVXNSVUZCUlhOSExGRkJRVVlzUlVGQldWUXNTVUZCV2l4RFFVRnBRaXhOUVVGcVFpeEZRVUY1UW5aRkxGRkJRWHBDTEVOQlFXdERMRmRCUVd4RExFTkJRVW9zUlVGQmIwUTdRVUZEYmtSNVNDeGpRVUZaTEZWQlFWb3NSVUZCZDBKdVFpeGxRVUY0UWp0QlFVTkJiVUlzWTBGQldTeFZRVUZhTEVWQlFYZENia0lzWlVGQmVFSTdRVUZEUVR0QlFVTkVMRU5CTTIxQ1JDSXNJbVpwYkdVaU9pSm1ZV3RsWHpSaU1UZGpabUUyTG1weklpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lZMjl1YzNRZ2RHbHRaU0E5SURjMU1EdGNibXhsZENCelpXTjBhVzl1TTBsa2VDQTlJREE3WEc1c1pYUWdjMlZqZEdsdmJqUkpaSGdnUFNBd08xeHVYRzVqYjI1emRDQnRZWE4wWlhKUFltb2dQU0I3WEc1Y2RITmxZM1JwYjI0eVEzVnljbVZ1ZEVsa2VEb2dNQ3dnWEc1Y2RITmxZM1JwYjI0eFEzVnljbVZ1ZEVsa2VEb2dNQ3hjYmx4MGMyVmpkR2x2YmpNNklIdGNibHgwWEhSaGRYUnZiV0YwWlRvZ0p5Y3NYRzVjZEZ4MGFYTkJkWFJ2YldGMFpXUTZJR1poYkhObFhHNWNkSDBzWEc1Y2RITmxZM1JwYjI0ME9pQjdYRzVjZEZ4MFlYVjBiMjFoZEdVNklDY25MRnh1WEhSY2RHbHpRWFYwYjIxaGRHVmtPaUJtWVd4elpWeHVYSFI5TEZ4dVhIUmlZWE5yWlhSaVlXeHNPaUI3Ykc5dmNFRnRiM1Z1ZERvZ01YMHNYRzVjZEdadmIzUmlZV3hzT2lCN2JHOXZjRUZ0YjNWdWREb2dNWDBzWEc1Y2RIUmxibTVwY3pvZ2UyeHZiM0JCYlc5MWJuUTZJREY5TEZ4dVhIUmlZWE5sWW1Gc2JEb2dlMnh2YjNCQmJXOTFiblE2SURGOUxGeHVYSFJtWVc0NklIdHNiMjl3UVcxdmRXNTBPaUF4ZlZ4dWZUdGNibHh1WTI5dWMzUWdhRzl0WlhCaFoyVk5iMkpKYldGblpYTWdQU0JiWEc1Y2RDZGhjM05sZEhNdmFXMWhaMlZ6TDJodmJXVndZV2RsVFc5aUwySmhjMnRsZEdKaGJHd3VhbkJuSnl4Y2JseDBKMkZ6YzJWMGN5OXBiV0ZuWlhNdmFHOXRaWEJoWjJWTmIySXZabTl2ZEdKaGJHd3VhbkJuSnl4Y2JseDBKMkZ6YzJWMGN5OXBiV0ZuWlhNdmFHOXRaWEJoWjJWTmIySXZkR1Z1Ym1sekxtcHdaeWNzSUZ4dVhIUW5ZWE56WlhSekwybHRZV2RsY3k5b2IyMWxjR0ZuWlUxdllpOWlZWE5sWW1Gc2JDNXFjR2NuTENCY2JseDBKMkZ6YzJWMGN5OXBiV0ZuWlhNdmFHOXRaWEJoWjJWTmIySXZabUZ1TG1wd1p5Y2dYRzVkWEc1Y2JpUW9aRzlqZFcxbGJuUXBMbkpsWVdSNUtDZ3BJRDArSUh0Y2JseDBhV1lvZDJsdVpHOTNMbWx1Ym1WeVYybGtkR2dnUENBNE1EQXBJSHRjYmk4dklFbEdJRlJJUlNCWFNVNUVUMWNnU1ZNZ1UwMUJURXhGVWlCVVNFRlVJRGd3TUZCWUlFWkZWRU5JSUZSSVJTQktVMDlPSUVaUFVpQlVTRVVnU1VOUFRpQkJUa2xOUVZSSlQwNGdRVTVFSUVGVVFVTklJRlJJUlNCQlRrbE5RVlJKVDA1VElGTkZVRVZTUVZSRlRGa2dWRThnYldGemRHVnlUMkpxSUZ4Y1hGeGNibHgwWEhSbVpYUmphQ2duWVhOelpYUnpMMnB6TDBaaGJuUmhjM1JsWTE5VGNISnBkR1ZmVTJobFpYUXVhbk52YmljcExuUm9aVzRvWm5WdVkzUnBiMjRvY21WemNHOXVjMlVwSUhzZ1hHNWNkRngwWEhSeVpYUjFjbTRnY21WemNHOXVjMlV1YW5OdmJpZ3BPMXh1WEhSY2RIMHBMblJvWlc0b1puVnVZM1JwYjI0b2MzQnlhWFJsVDJKcUtTQjdYRzVjZEZ4MFhIUmpiMjV6ZENCSlpHeGxSbkpoYldVZ1BTQm1hV3gwWlhKQ2VWWmhiSFZsS0hOd2NtbDBaVTlpYWk1bWNtRnRaWE1zSUNkcFpHeGxKeWs3WEc1Y2RGeDBYSFJ0WVhOMFpYSlBZbW91Wm05dmRHSmhiR3d1WVc1cGJXRjBhVzl1UVhKeVlYa2dQU0JiTGk0dVNXUnNaVVp5WVcxbExDQXVMaTVtYVd4MFpYSkNlVlpoYkhWbEtITndjbWwwWlU5aWFpNW1jbUZ0WlhNc0lDZG1iMjkwWW1Gc2JDY3BYVHRjYmx4MFhIUmNkRzFoYzNSbGNrOWlhaTUwWlc1dWFYTXVZVzVwYldGMGFXOXVRWEp5WVhrZ1BTQmJMaTR1U1dSc1pVWnlZVzFsTENBdUxpNW1hV3gwWlhKQ2VWWmhiSFZsS0hOd2NtbDBaVTlpYWk1bWNtRnRaWE1zSUNkMFpXNXVhWE1uS1YwN1hHNWNkRngwWEhSdFlYTjBaWEpQWW1vdVltRnpaV0poYkd3dVlXNXBiV0YwYVc5dVFYSnlZWGtnUFNCYkxpNHVTV1JzWlVaeVlXMWxMQ0F1TGk1bWFXeDBaWEpDZVZaaGJIVmxLSE53Y21sMFpVOWlhaTVtY21GdFpYTXNJQ2RpWVhObFltRnNiQ2NwWFR0Y2JseDBYSFJjZEcxaGMzUmxjazlpYWk1aVlYTnJaWFJpWVd4c0xtRnVhVzFoZEdsdmJrRnljbUY1SUQwZ1d5NHVMa2xrYkdWR2NtRnRaU3dnTGk0dVptbHNkR1Z5UW5sV1lXeDFaU2h6Y0hKcGRHVlBZbW91Wm5KaGJXVnpMQ0FuWW1GemEyVjBKeWxkTzF4dVhIUmNkRngwYldGemRHVnlUMkpxTG1aaGJpNWhibWx0WVhScGIyNUJjbkpoZVNBOUlGc3VMaTVKWkd4bFJuSmhiV1VzSUM0dUxtWnBiSFJsY2tKNVZtRnNkV1VvYzNCeWFYUmxUMkpxTG1aeVlXMWxjeXdnSjJaaGJpY3BYVHRjYmk4dklFTkJURXdnUVU1SlRVRlVUMUlnVTBWVVZWQWdSbFZPUTFSSlQwNGdRVTVFSUZOVVFWSlVJRlJJUlNCSlRVRkhSU0JUVEVsRVJWTklUMWNnUms5U0lGTkZRMVJKVDA0Z01TQW9TRTlOUlZCQlIwVXBJRnhjWEZ4Y2RGeDBYSFJjYmx4MFhIUmNkR0Z1YVcxaGRHOXlVMlYwZFhBb0tUdGNibHgwWEhSY2RHbHRZV2RsUTI5dWRISnZiR1Z5S0cxaGMzUmxjazlpYWl3Z01TazdYRzR2THlCRFFVeE1JRlJJUlNCcGJXRm5aVU52Ym5SeWIyeGxjaUJHVlU1RFZFbFBUaUJGVmtWU1dTQTFJRk5GUTA5T1JGTWdWRThnUTBoQlRrZEZJRlJJUlNCSlRVRkhSU0JHVDFJZ1UwVkRWRWxQVGlBeElDaElUMDFGVUVGSFJTa2dYRnhjWEZ4dVhIUmNkRngwYzJWMFNXNTBaWEoyWVd3b0tDa2dQVDRnZTF4dVhIUmNkRngwWEhScGJXRm5aVU52Ym5SeWIyeGxjaWh0WVhOMFpYSlBZbW9zSURFcE8xeHVYSFJjZEZ4MGZTd2dOVEF3TUNrN1hHNWNkRngwZlNrN1hHNWNkSDFjYmk4dklFWlZUa05VU1U5T0lGUlBJRk5GVUVWU1FWUkZJRlJJUlNCQlRrbE5RVlJKVDA0Z1JsSkJUVVZUSUVKWklFNUJUVVVnWEZ4Y1hGeHVYSFJqYjI1emRDQm1hV3gwWlhKQ2VWWmhiSFZsSUQwZ0tHRnljbUY1TENCemRISnBibWNwSUQwK0lIdGNiaUFnSUNCeVpYUjFjbTRnWVhKeVlYa3VabWxzZEdWeUtHOGdQVDRnZEhsd1pXOW1JRzliSjJacGJHVnVZVzFsSjEwZ1BUMDlJQ2R6ZEhKcGJtY25JQ1ltSUc5YkoyWnBiR1Z1WVcxbEoxMHVkRzlNYjNkbGNrTmhjMlVvS1M1cGJtTnNkV1JsY3loemRISnBibWN1ZEc5TWIzZGxja05oYzJVb0tTa3BPMXh1WEhSOVhHNHZMeUJIUlU1RlVrbERJRk5GVkZWUUlFWlZUa05VU1U5T0lFWlBVaUJCUkVSSlRrY2dWa1ZPUkU5U0lGQlNSVVpKV0VWVElGUlBJSEpsY1hWbGMzUkJibWx0WVhScGIyNUdjbUZ0WlNCY1hGeGNYRzVjZEdOdmJuTjBJR0Z1YVcxaGRHOXlVMlYwZFhBZ1BTQW9LU0E5UGlCN1hHNWNkRngwWEhSY2JpQWdJQ0IyWVhJZ2JHRnpkRlJwYldVZ1BTQXdPMXh1SUNBZ0lIWmhjaUIyWlc1a2IzSnpJRDBnV3lkdGN5Y3NJQ2R0YjNvbkxDQW5kMlZpYTJsMEp5d2dKMjhuWFR0Y2JpQWdJQ0JtYjNJb2RtRnlJSGdnUFNBd095QjRJRHdnZG1WdVpHOXljeTVzWlc1bmRHZ2dKaVlnSVhkcGJtUnZkeTV5WlhGMVpYTjBRVzVwYldGMGFXOXVSbkpoYldVN0lDc3JlQ2tnZTF4dUlDQWdJQ0FnZDJsdVpHOTNMbkpsY1hWbGMzUkJibWx0WVhScGIyNUdjbUZ0WlNBOUlIZHBibVJ2ZDF0MlpXNWtiM0p6VzNoZEt5ZFNaWEYxWlhOMFFXNXBiV0YwYVc5dVJuSmhiV1VuWFR0Y2JpQWdJQ0FnSUhkcGJtUnZkeTVqWVc1alpXeEJibWx0WVhScGIyNUdjbUZ0WlNBOUlIZHBibVJ2ZDF0MlpXNWtiM0p6VzNoZEt5ZERZVzVqWld4QmJtbHRZWFJwYjI1R2NtRnRaU2RkSUh4OElIZHBibVJ2ZDF0MlpXNWtiM0p6VzNoZEt5ZERZVzVqWld4U1pYRjFaWE4wUVc1cGJXRjBhVzl1Um5KaGJXVW5YVHRjYmlBZ0lDQjlYRzRnWEc0Z0lDQWdhV1lnS0NGM2FXNWtiM2N1Y21WeGRXVnpkRUZ1YVcxaGRHbHZia1p5WVcxbEtWeHVJQ0FnSUNBZ2QybHVaRzkzTG5KbGNYVmxjM1JCYm1sdFlYUnBiMjVHY21GdFpTQTlJR1oxYm1OMGFXOXVLR05oYkd4aVlXTnJMQ0JsYkdWdFpXNTBLU0I3WEc0Z0lDQWdJQ0FnSUhaaGNpQmpkWEp5VkdsdFpTQTlJRzVsZHlCRVlYUmxLQ2t1WjJWMFZHbHRaU2dwTzF4dUlDQWdJQ0FnSUNCMllYSWdkR2x0WlZSdlEyRnNiQ0E5SUUxaGRHZ3ViV0Y0S0RBc0lERTJJQzBnS0dOMWNuSlVhVzFsSUMwZ2JHRnpkRlJwYldVcEtUdGNiaUFnSUNBZ0lDQWdkbUZ5SUdsa0lEMGdkMmx1Wkc5M0xuTmxkRlJwYldWdmRYUW9ablZ1WTNScGIyNG9LU0I3SUdOaGJHeGlZV05yS0dOMWNuSlVhVzFsSUNzZ2RHbHRaVlJ2UTJGc2JDazdJSDBzSUZ4dUlDQWdJQ0FnSUNBZ0lIUnBiV1ZVYjBOaGJHd3BPMXh1SUNBZ0lDQWdJQ0JzWVhOMFZHbHRaU0E5SUdOMWNuSlVhVzFsSUNzZ2RHbHRaVlJ2UTJGc2JEdGNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlHbGtPMXh1SUNBZ0lDQWdmVHRjYmlCY2JpQWdJQ0JwWmlBb0lYZHBibVJ2ZHk1allXNWpaV3hCYm1sdFlYUnBiMjVHY21GdFpTbGNiaUFnSUNCM2FXNWtiM2N1WTJGdVkyVnNRVzVwYldGMGFXOXVSbkpoYldVZ1BTQm1kVzVqZEdsdmJpaHBaQ2tnZTF4dUlDQWdJQ0FnWTJ4bFlYSlVhVzFsYjNWMEtHbGtLVHRjYmlBZ0lDQjlPMXh1WEhSOVhHNWNibHh1WEhSamIyNXpkQ0JoYm1sdFlYUnZjaUE5SUNoaGJtbHRZWFJwYjI1UFltb3BJRDArSUh0Y2JseDBYSFJjZEZ4MFhIUmNkRnh1WEhSY2RIWmhjaUJrWVc1amFXNW5TV052Yml4Y2JseDBYSFJjZEhOd2NtbDBaVWx0WVdkbExGeHVYSFJjZEZ4MFkyRnVkbUZ6TzF4MFhIUmNkRngwWEhSY2JpOHZJRVpWVGtOVVNVOU9JRlJQSUZCQlUxTWdWRThnY21WeGRXVnpkRUZ1YVcxaGRHbHZia1p5WVcxbElGeGNYRnhjYmx4MFhIUm1kVzVqZEdsdmJpQm5ZVzFsVEc5dmNDQW9LU0I3WEc1Y2RGeDBJQ0FrS0NjamJHOWhaR2x1WnljcExtRmtaRU5zWVhOektDZG9hV1JrWlc0bktUdGNibHgwWEhRZ0lHRnVhVzFoZEdsdmJrOWlhaTVzYjI5d1NXUWdQU0IzYVc1a2IzY3VjbVZ4ZFdWemRFRnVhVzFoZEdsdmJrWnlZVzFsS0dkaGJXVk1iMjl3S1R0Y2JseDBYSFFnSUdSaGJtTnBibWRKWTI5dUxuVndaR0YwWlNncE8xeHVYSFJjZENBZ1pHRnVZMmx1WjBsamIyNHVjbVZ1WkdWeUtDazdYRzVjZEZ4MGZWeHVYSFJjZEZ4dVhIUmNkR1oxYm1OMGFXOXVJSE53Y21sMFpTQW9iM0IwYVc5dWN5a2dlMXh1WEhSY2RGeHVYSFJjZEZ4MGRtRnlJSFJvWVhRZ1BTQjdmU3hjYmx4MFhIUmNkRngwWm5KaGJXVkpibVJsZUNBOUlEQXNYRzVjZEZ4MFhIUmNkSFJwWTJ0RGIzVnVkQ0E5SURBc1hHNWNkRngwWEhSY2RHeHZiM0JEYjNWdWRDQTlJREFzWEc1Y2RGeDBYSFJjZEhScFkydHpVR1Z5Um5KaGJXVWdQU0J2Y0hScGIyNXpMblJwWTJ0elVHVnlSbkpoYldVZ2ZId2dNQ3hjYmx4MFhIUmNkRngwYm5WdFltVnlUMlpHY21GdFpYTWdQU0J2Y0hScGIyNXpMbTUxYldKbGNrOW1SbkpoYldWeklIeDhJREU3WEc1Y2RGeDBYSFJjYmx4MFhIUmNkSFJvWVhRdVkyOXVkR1Y0ZENBOUlHOXdkR2x2Ym5NdVkyOXVkR1Y0ZER0Y2JseDBYSFJjZEhSb1lYUXVkMmxrZEdnZ1BTQnZjSFJwYjI1ekxuZHBaSFJvTzF4dVhIUmNkRngwZEdoaGRDNW9aV2xuYUhRZ1BTQnZjSFJwYjI1ekxtaGxhV2RvZER0Y2JseDBYSFJjZEhSb1lYUXVhVzFoWjJVZ1BTQnZjSFJwYjI1ekxtbHRZV2RsTzF4dVhIUmNkRngwZEdoaGRDNXNiMjl3Y3lBOUlHOXdkR2x2Ym5NdWJHOXZjSE03WEc1Y2RGeDBYSFJjYmx4MFhIUmNkSFJvWVhRdWRYQmtZWFJsSUQwZ1puVnVZM1JwYjI0Z0tDa2dlMXh1WEc0Z0lDQWdJQ0FnSUhScFkydERiM1Z1ZENBclBTQXhPMXh1WEc0Z0lDQWdJQ0FnSUdsbUlDaDBhV05yUTI5MWJuUWdQaUIwYVdOcmMxQmxja1p5WVcxbEtTQjdYRzVjYmx4MFhIUmNkRngwWEhSMGFXTnJRMjkxYm5RZ1BTQXdPMXh1SUNBZ0lDQWdJQ0FnSUM4dklFbG1JSFJvWlNCamRYSnlaVzUwSUdaeVlXMWxJR2x1WkdWNElHbHpJR2x1SUhKaGJtZGxYRzRnSUNBZ0lDQWdJQ0FnYVdZZ0tHWnlZVzFsU1c1a1pYZ2dQQ0J1ZFcxaVpYSlBaa1p5WVcxbGN5QXRJREVwSUh0Y2RGeHVJQ0FnSUNBZ0lDQWdJQzh2SUVkdklIUnZJSFJvWlNCdVpYaDBJR1p5WVcxbFhHNGdJQ0FnSUNBZ0lDQWdJQ0JtY21GdFpVbHVaR1Y0SUNzOUlERTdYRzRnSUNBZ0lDQWdJQ0FnZlNCbGJITmxJSHRjYmlBZ0lDQWdJQ0FnWEhSY2RHeHZiM0JEYjNWdWRDc3JYRzRnSUNBZ0lDQWdJQ0FnSUNCbWNtRnRaVWx1WkdWNElEMGdNRHRjYmx4dUlDQWdJQ0FnSUNBZ0lDQWdhV1lvYkc5dmNFTnZkVzUwSUQwOVBTQjBhR0YwTG14dmIzQnpLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQmNkSGRwYm1SdmR5NWpZVzVqWld4QmJtbHRZWFJwYjI1R2NtRnRaU2hoYm1sdFlYUnBiMjVQWW1vdWJHOXZjRWxrS1R0Y2JpQWdJQ0FnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJQ0FnSUNCOVhHNWNkQ0FnSUNBZ0lIMWNibHgwSUNBZ0lIMWNibHgwWEhSY2RGeHVYSFJjZEZ4MGRHaGhkQzV5Wlc1a1pYSWdQU0JtZFc1amRHbHZiaUFvS1NCN1hHNWNkRngwWEhSY2JseDBYSFJjZENBZ0x5OGdRMnhsWVhJZ2RHaGxJR05oYm5aaGMxeHVYSFJjZEZ4MElDQjBhR0YwTG1OdmJuUmxlSFF1WTJ4bFlYSlNaV04wS0RBc0lEQXNJSFJvWVhRdWQybGtkR2dzSUhSb1lYUXVhR1ZwWjJoMEtUdGNibHgwWEhSY2RDQWdYRzVjZEZ4MFhIUWdJSFJvWVhRdVkyOXVkR1Y0ZEM1a2NtRjNTVzFoWjJVb1hHNWNkRngwWEhRZ0lDQWdkR2hoZEM1cGJXRm5aU3hjYmx4MFhIUmNkQ0FnSUNCaGJtbHRZWFJwYjI1UFltb3VZVzVwYldGMGFXOXVRWEp5WVhsYlpuSmhiV1ZKYm1SbGVGMHVabkpoYldVdWVDeGNibHgwWEhSY2RDQWdJQ0JoYm1sdFlYUnBiMjVQWW1vdVlXNXBiV0YwYVc5dVFYSnlZWGxiWm5KaGJXVkpibVJsZUYwdVpuSmhiV1V1ZVN4Y2JseDBYSFJjZENBZ0lDQXlNREFzWEc1Y2RGeDBYSFFnSUNBZ01UYzFMRnh1WEhSY2RGeDBJQ0FnSURBc1hHNWNkRngwWEhRZ0lDQWdNQ3hjYmx4MFhIUmNkQ0FnSUNCM2FXNWtiM2N1YVc1dVpYSlhhV1IwYUNBdklETXVPRFEyTEZ4dVhIUmNkRngwSUNBZ0lIZHBibVJ2ZHk1cGJtNWxjbGRwWkhSb0lDOGdOQzR4S1Z4dVhIUmNkRngwZlR0Y2JseDBYSFJjZEZ4dVhIUmNkRngwY21WMGRYSnVJSFJvWVhRN1hHNWNkRngwZlZ4dVhIUmNkRnh1WEhSY2RDOHZJRWRsZENCallXNTJZWE5jYmx4MFhIUmpZVzUyWVhNZ1BTQmtiMk4xYldWdWRDNW5aWFJGYkdWdFpXNTBRbmxKWkNnblkyRnVkbUZ6SnlrN1hHNWNkRngwWTJGdWRtRnpMbmRwWkhSb0lEMGdkMmx1Wkc5M0xtbHVibVZ5VjJsa2RHZ2dMeUF6TGpnME5qdGNibHgwWEhSallXNTJZWE11YUdWcFoyaDBJRDBnZDJsdVpHOTNMbWx1Ym1WeVYybGtkR2dnTHlBeUxqSTdYRzVjZEZ4MFhHNWNkRngwTHk4Z1EzSmxZWFJsSUhOd2NtbDBaU0J6YUdWbGRGeHVYSFJjZEhOd2NtbDBaVWx0WVdkbElEMGdibVYzSUVsdFlXZGxLQ2s3WEhSY2JseDBYSFJjYmx4MFhIUXZMeUJEY21WaGRHVWdjM0J5YVhSbFhHNWNkRngwWkdGdVkybHVaMGxqYjI0Z1BTQnpjSEpwZEdVb2UxeHVYSFJjZEZ4MFkyOXVkR1Y0ZERvZ1kyRnVkbUZ6TG1kbGRFTnZiblJsZUhRb1hDSXlaRndpS1N4Y2JseDBYSFJjZEhkcFpIUm9PaUEwTURRd0xGeHVYSFJjZEZ4MGFHVnBaMmgwT2lBeE56Y3dMRnh1WEhSY2RGeDBhVzFoWjJVNklITndjbWwwWlVsdFlXZGxMRnh1WEhSY2RGeDBiblZ0WW1WeVQyWkdjbUZ0WlhNNklHRnVhVzFoZEdsdmJrOWlhaTVoYm1sdFlYUnBiMjVCY25KaGVTNXNaVzVuZEdnc1hHNWNkRngwWEhSMGFXTnJjMUJsY2taeVlXMWxPaUEwTEZ4dVhIUmNkRngwYkc5dmNITTZJR0Z1YVcxaGRHbHZiazlpYWk1c2IyOXdRVzF2ZFc1MFhHNWNkRngwZlNrN1hHNWNkRngwWEc1Y2RGeDBMeThnVEc5aFpDQnpjSEpwZEdVZ2MyaGxaWFJjYmx4MFhIUnpjSEpwZEdWSmJXRm5aUzVoWkdSRmRtVnVkRXhwYzNSbGJtVnlLRndpYkc5aFpGd2lMQ0JuWVcxbFRHOXZjQ2s3WEc1Y2RGeDBjM0J5YVhSbFNXMWhaMlV1YzNKaklEMGdKMkZ6YzJWMGN5OXBiV0ZuWlhNdlJtRnVkR0Z6ZEdWalgxTndjbWwwWlY5VGFHVmxkQzV3Ym1jbk8xeHVYSFI5SUZ4dVhHNHZMeUJKVGtsVVNVRk1TVk5GSUVGT1JDQlRSVlJWVUNCRFZWSlNSVTVVSUZCQlIwVXVJRVZZUlVOVlZFVWdWRkpCVGxOSlZFbFBUbE1nUVU1RUlGSkZUVTlXUlNCVVNVNVVJRWxHSUZKRlRFVldRVTVVSUZ4Y1hGeGNibHh1WEhSamIyNXpkRngwY0dGblpVeHZZV1JsY2lBOUlDaHBibVJsZUNrZ1BUNGdlMXh1WEhSY2RHbG1LR2x1WkdWNElEMDlQU0ExS1NCN1hHNWNkRngwWEhRa0tDY3VkR2x1ZENjcExuSmxiVzkyWlVOc1lYTnpLQ2R5WlcxdmRtVlVhVzUwSnlrN1hHNWNkRngwWEhRa0tDY3VZbUZqYTJkeWIzVnVaRmR5WVhCd1pYSW5LUzV5WlcxdmRtVkRiR0Z6Y3lnbmMyTmhiR1ZDWVdOclozSnZkVzVrSnlrN1hHNWNkRngwWEhRa0tDY2pjMlZqZEdsdmJqVW5LUzVtYVc1a0tDY3VhR1ZoWkdsdVp5Y3BMbUZrWkVOc1lYTnpLQ2R6YUc5M0lHWmhaR1ZKYmljcE8xeHVYSFJjZEZ4MEpDZ25Mbk4xWWxObFkzUnBiMjRuS1M1aFpHUkRiR0Z6Y3lnbmMyTmhiR1ZDWVdOclozSnZkVzVrSnlrN1hHNWNkRngwWEhRa0tDY3VjM1ZpVTJWamRHbHZiaWNwTG1acGJtUW9KeTUwYVc1MEp5a3VZV1JrUTJ4aGMzTW9KM0psYlc5MlpWUnBiblFuS1R0Y2JseDBYSFJjZENRb0p5TnpaV04wYVc5dU5TY3BMbVpwYm1Rb0p5NTBaWGgwVjNKaGNIQmxjaWNwTG1Ga1pFTnNZWE56S0NkemFHOTNKeWs3WEc1Y2RGeDBYSFJ6WlhSVWFXMWxiM1YwS0NncElEMCtJSHRjYmx4MFhIUmNkRngwSkNnbkxuTjFZbE5sWTNScGIyNGdQaUF1ZEdWNGRGZHlZWEJ3WlhJbktTNW1hVzVrS0NjdWFHVmhaR2x1WnljcExtRmtaRU5zWVhOektDZG1ZV1JsU1c0bktUdGNibHgwWEhSY2RIMHNJREV3TURBcE8xeHVYSFJjZEgwZ1hHNWNkRngwWld4elpTQjdYRzVjZEZ4MFhIUWtLQ2N1ZEdsdWRDY3BMbkpsYlc5MlpVTnNZWE56S0NkeVpXMXZkbVZVYVc1MEp5azdYRzVjZEZ4MFhIUWtLQ2N1YzNWaVUyVmpkR2x2YmljcExuSmxiVzkyWlVOc1lYTnpLQ2R6WTJGc1pVSmhZMnRuY205MWJtUW5LVHRjYmx4MFhIUmNkQ1FvWUM1aVlXTnJaM0p2ZFc1a1YzSmhjSEJsY2pwdWIzUW9JM05sWTNScGIyNGtlMmx1WkdWNGZVSmhZMnRuY205MWJtUXBZQ2t1Y21WdGIzWmxRMnhoYzNNb0ozTmpZV3hsUW1GamEyZHliM1Z1WkNjcE8xeHVYSFJjZEZ4MEpDaGdMbk5sWTNScGIyNHVZV04wYVhabFlDa3VabWx1WkNoZ0xtSmhZMnRuY205MWJtUlhjbUZ3Y0dWeVlDa3VZV1JrUTJ4aGMzTW9KM05qWVd4bFFtRmphMmR5YjNWdVpDY3BPMXh1WEhSY2RGeDBKQ2hnYzJWamRHbHZiaTVoWTNScGRtVmdLUzVtYVc1a0tDY3VkR2x1ZENjcExtRmtaRU5zWVhOektDZHlaVzF2ZG1WVWFXNTBKeWs3WEc1Y2JseDBYSFJjZEdsbUtDUW9ZQzV6WldOMGFXOXVKSHRwYm1SbGVIMVFZV2RwYm1GMGIzSkNkWFIwYjI1Z0tTNXNaVzVuZEdnZ0ppWWdKQ2hnTG5ObFkzUnBiMjRrZTJsdVpHVjRmVkJoWjJsdVlYUnZja0oxZEhSdmJpNWhZM1JwZG1WZ0tTNXNaVzVuZEdnZ1BDQXhLU0I3WEc1Y2RGeDBYSFJjZENRb1lDNXpaV04wYVc5dUpIdHBibVJsZUgxUVlXZHBibUYwYjNKQ2RYUjBiMjVnS1M1blpYUW9NQ2t1WTJ4cFkyc29LVHRjYmx4MFhIUmNkSDFjYmx4MFhIUjlYRzVjZEgwN1hHNWNiaTh2SUVoSlJFVWdRVXhNSUVKRlEwdEhVazlWVGtSVElFbE9JRlJJUlNCVFJVTlVTVTlPSUVWWVEwVlFWQ0JVU0VVZ1UxQkZRMGxHU1VWRUlFbE9SRVZZTENCWFNFbERTQ0JKVXlCVFEwRk1SVVFnUVU1RUlGTklUMWRPTGlCY1hGeGNYRzVjYmx4MFkyOXVjM1FnYVc1cGRHbGhiR2w2WlZObFkzUnBiMjRnUFNBb2MyVmpkR2x2Yms1MWJXSmxjaXdnYVdSNEtTQTlQaUI3WEc1Y2RGeDBKQ2hnSTNObFkzUnBiMjRrZTNObFkzUnBiMjVPZFcxaVpYSjlRbUZqYTJkeWIzVnVaQ1I3YVdSNGZXQXBMbk5wWW14cGJtZHpLQ2N1WW1GamEyZHliM1Z1WkZkeVlYQndaWEluS1M1dFlYQW9LR2w0TENCbGJHVXBJRDArSUh0Y2JseDBYSFJjZENRb1pXeGxLUzVqYzNNb2UyOXdZV05wZEhrNklEQjlLVHRjYmx4MFhIUjlLVHRjYmx4dVhIUmNkQ1FvWUNOelpXTjBhVzl1Skh0elpXTjBhVzl1VG5WdFltVnlmVUpoWTJ0bmNtOTFibVFrZTJsa2VIMWdLUzVqYzNNb2UxeHVYSFJjZEZ4MEozUnlZVzV6Wm05eWJTYzZJQ2R6WTJGc1pTZ3hMakVwSnl4Y2JseDBYSFJjZENkdmNHRmphWFI1SnpvZ01WeHVYSFJjZEgwcE8xeHVYSFI5TzF4dVhHNHZMeUJEUVV4TUlHbHVhWFJwWVd4cGVtVlRaV04wYVc5dUlFOU9JRk5GUTFSSlQwNVRJREVzSURNZ1FVNUVJRFF1SUZ4Y1hGeGNibHgwYVc1cGRHbGhiR2w2WlZObFkzUnBiMjRvTVN3Z01DazdYRzVjZEdsdWFYUnBZV3hwZW1WVFpXTjBhVzl1S0RNc0lEQXBPMXh1WEhScGJtbDBhV0ZzYVhwbFUyVmpkR2x2YmlnMExDQXdLVHRjYmx4dUx5OGdRa0ZEUzBkU1QxVk9SQ0JKVFVGSFJTQlVVa0ZPVTBsVVNVOU9JRWhCVGtSTVJWSXVJRnhjWEZ4Y2JseHVYSFJqYjI1emRDQnBiV0ZuWlVOdmJuUnliMnhsY2lBOUlDaHBaSGhQWW1vc0lITmxZM1JwYjI1T2RXMWlaWElwSUQwK0lIdGNibHgwWEhSc1pYUWdjbVZzWlhaaGJuUkJibWx0WVhScGIyNDdYRzVjYmx4MFhIUnBaaWh6WldOMGFXOXVUblZ0WW1WeUlEMDlQU0F4S1NCN1hHNWNkRngwWEhSemQybDBZMmdvYVdSNFQySnFMbk5sWTNScGIyNHhRM1Z5Y21WdWRFbGtlQ2tnZTF4dVhIUmNkRngwWEhSallYTmxJREE2WEc1Y2RGeDBYSFJjZEZ4MGNtVnNaWFpoYm5SQmJtbHRZWFJwYjI0Z1BTQnRZWE4wWlhKUFltb3VZbUZ6YTJWMFltRnNiRHRjYmx4MFhIUmNkRngwWW5KbFlXczdYRzVjZEZ4MFhIUmNkR05oYzJVZ01UcGNibHgwWEhSY2RGeDBYSFJ5Wld4bGRtRnVkRUZ1YVcxaGRHbHZiaUE5SUcxaGMzUmxjazlpYWk1bWIyOTBZbUZzYkR0Y2JseDBYSFJjZEZ4MFluSmxZV3M3WEc1Y2RGeDBYSFJjZEdOaGMyVWdNanBjYmx4MFhIUmNkRngwWEhSeVpXeGxkbUZ1ZEVGdWFXMWhkR2x2YmlBOUlHMWhjM1JsY2s5aWFpNTBaVzV1YVhNN1hHNWNkRngwWEhSY2RHSnlaV0ZyTzF4dVhIUmNkRngwWEhSallYTmxJRE02WEc1Y2RGeDBYSFJjZEZ4MGNtVnNaWFpoYm5SQmJtbHRZWFJwYjI0Z1BTQnRZWE4wWlhKUFltb3VZbUZ6WldKaGJHdzdYRzVjZEZ4MFhIUmNkR0p5WldGck8xeHVYSFJjZEZ4MFhIUmpZWE5sSURRNlhHNWNkRngwWEhSY2RGeDBjbVZzWlhaaGJuUkJibWx0WVhScGIyNGdQU0J0WVhOMFpYSlBZbW91Wm1GdU8xeHVYSFJjZEZ4MFhIUmljbVZoYXp0Y2JseDBYSFJjZEgxY2JseDBYSFI5WEc1Y2JseDBYSFFrS0dBamMyVmpkR2x2YmlSN2MyVmpkR2x2Yms1MWJXSmxjbjFnS1M1bWFXNWtLQ2N1ZEdsdWRDY3BMbkpsYlc5MlpVTnNZWE56S0NkeVpXMXZkbVZVYVc1MEp5azdYRzVjZEZ4MEpDaGdJM05sWTNScGIyNGtlM05sWTNScGIyNU9kVzFpWlhKOVFtRmphMmR5YjNWdVpDUjdhV1I0VDJKcVcyQnpaV04wYVc5dUpIdHpaV04wYVc5dVRuVnRZbVZ5ZlVOMWNuSmxiblJKWkhoZ1hYMWdLUzV5WlcxdmRtVkRiR0Z6Y3lnbmMyTmhiR1ZDWVdOclozSnZkVzVrSnlrN1hHNWNkRngwYVc1cGRHbGhiR2w2WlZObFkzUnBiMjRvYzJWamRHbHZiazUxYldKbGNpd2dhV1I0VDJKcVcyQnpaV04wYVc5dUpIdHpaV04wYVc5dVRuVnRZbVZ5ZlVOMWNuSmxiblJKWkhoZ1hTazdYRzVjZEZ4MFhHNWNkRngwYzJWMFZHbHRaVzkxZENnb0tTQTlQaUI3WEc1Y2RGeDBYSFJwWmloelpXTjBhVzl1VG5WdFltVnlJRDA5UFNBeEtTQjdYRzVjZEZ4MFhIUmNkR0Z1YVcxaGRHOXlLSEpsYkdWMllXNTBRVzVwYldGMGFXOXVLVHRjYmx4MFhIUmNkSDFjYmx4dVhIUmNkRngwSkNoZ0kzTmxZM1JwYjI0a2UzTmxZM1JwYjI1T2RXMWlaWEo5WUNrdVptbHVaQ2hnTG1KaFkydG5jbTkxYm1SWGNtRndjR1Z5WUNrdVlXUmtRMnhoYzNNb0ozTmpZV3hsUW1GamEyZHliM1Z1WkNjcE8xeHVYSFJjZEZ4MEpDaGdJM05sWTNScGIyNGtlM05sWTNScGIyNU9kVzFpWlhKOVlDa3VabWx1WkNnbkxuUnBiblFuS1M1aFpHUkRiR0Z6Y3lnbmNtVnRiM1psVkdsdWRDY3BPMXh1WEhSY2RIMHNJRFV3TUNrN1hHNWNibHgwWEhScFppaHBaSGhQWW1wYllITmxZM1JwYjI0a2UzTmxZM1JwYjI1T2RXMWlaWEo5UTNWeWNtVnVkRWxrZUdCZElEMDlQU0FrS0dBamMyVmpkR2x2YmlSN2MyVmpkR2x2Yms1MWJXSmxjbjFnS1M1bWFXNWtLR0F1WW1GamEyZHliM1Z1WkZkeVlYQndaWEpnS1M1c1pXNW5kR2dnTFNBeEtTQjdYRzVjZEZ4MFhIUnBaSGhQWW1wYllITmxZM1JwYjI0a2UzTmxZM1JwYjI1T2RXMWlaWEo5UTNWeWNtVnVkRWxrZUdCZElEMGdNRHRjYmx4MFhIUjlJR1ZzYzJVZ2UxeHVYSFJjZEZ4MGFXUjRUMkpxVzJCelpXTjBhVzl1Skh0elpXTjBhVzl1VG5WdFltVnlmVU4xY25KbGJuUkpaSGhnWFNBclBTQXhPMXh1WEhSY2RIMWNibHgwZlZ4dUx5OGdVMVJCVWxRZ1UweEpSRVZUU0U5WElFOU9JRk5GUTFSSlQwNGdNaUJjWEZ4Y1hHNWNkR2x0WVdkbFEyOXVkSEp2YkdWeUtHMWhjM1JsY2s5aWFpd2dNaWs3WEc1Y2JpOHZJRU5JUVU1SFJTQlRSVU5VU1U5T0lESWdRa0ZEUzBkU1QxVk9SQ0JKVFVGSFJTQkZWa1ZTV1NBeE5TQlRSVU5QVGtSVElGeGNYRnhjYmx4MGMyVjBTVzUwWlhKMllXd29LQ2tnUFQ0Z2UxeHVYSFJjZEdsdFlXZGxRMjl1ZEhKdmJHVnlLRzFoYzNSbGNrOWlhaXdnTWlrN1hHNWNkSDBzSURFMU1EQXdLVHRjYmx4dUx5OGdVRUZIU1U1QlZFbFBUaUJDVlZSVVQwNVRJRU5NU1VOTElFaEJUa1JNUlZJZ1JrOVNJRk5GUTFSSlQwNVRJRE1nUVU1RUlEUXVJRnhjWEZ4Y2JseHVYSFJqYjI1emRDQm9ZVzVrYkdWUVlXNXBibUYwYVc5dVFuVjBkRzl1UTJ4cFkyc2dQU0FvWlNrZ1BUNGdlMXh1WEc1Y2RGeDBZMjl1YzNRZ2FXUjRJRDBnY0dGeWMyVkpiblFvSkNobExuUmhjbWRsZENrdVlYUjBjaWduWkdGMFlTMXBibVJsZUNjcEtUdGNibHgwWEhSamIyNXpkQ0J6WldOMGFXOXVTV1FnUFNBa0tHVXVkR0Z5WjJWMEtTNWpiRzl6WlhOMEtDZHpaV04wYVc5dUp5a3VZWFIwY2lnbmFXUW5LVHRjYmx4MFhIUnNaWFFnY21Wc1pYWmhiblJFWVhSaFFYSnlZWGs3WEc1Y2JseDBYSFJwWmloelpXTjBhVzl1U1dRZ1BUMDlJQ2R6WldOMGFXOXVNeWNwSUh0Y2JseDBYSFJjZEhObFkzUnBiMjR6U1dSNElEMGdhV1I0TzF4dVhIUmNkSDFjYmx4dVhIUmNkR2xtS0hObFkzUnBiMjVKWkNBOVBUMGdKM05sWTNScGIyNDBKeWtnZTF4dVhIUmNkRngwYzJWamRHbHZialJKWkhnZ1BTQnBaSGc3WEc1Y2RGeDBmVnh1WEc1Y2RGeDBKQ2hnSXlSN2MyVmpkR2x2Ymtsa2ZXQXBMbVpwYm1Rb0p5NTBhVzUwSnlrdWNtVnRiM1psUTJ4aGMzTW9KM0psYlc5MlpWUnBiblFuS1R0Y2JseDBYSFFrS0dBakpIdHpaV04wYVc5dVNXUjlZQ2t1Wm1sdVpDZ25MblJsZUhSWGNtRndjR1Z5SnlrdWNtVnRiM1psUTJ4aGMzTW9KM05vYjNjbktUdGNibHgwWEhRa0tHQWpKSHR6WldOMGFXOXVTV1I5WUNrdVptbHVaQ2hnSTNSbGVIUlhjbUZ3Y0dWeUpIdHBaSGg5WUNrdVlXUmtRMnhoYzNNb0ozTm9iM2NuS1R0Y2JseDBYSFFrS0dBakpIdHpaV04wYVc5dVNXUjlRbUZqYTJkeWIzVnVaQ1I3YVdSNGZXQXBMbkpsYlc5MlpVTnNZWE56S0NkelkyRnNaVUpoWTJ0bmNtOTFibVFuS1R0Y2JseDBYSFFrS0dBdUpIdHpaV04wYVc5dVNXUjlVR0ZuYVc1aGRHOXlRblYwZEc5dVlDa3VjbVZ0YjNabFEyeGhjM01vSjJGamRHbDJaU2NwTzF4dVhIUmNkQ1FvWlM1MFlYSm5aWFFwTG1Ga1pFTnNZWE56S0NkaFkzUnBkbVVuS1R0Y2JseHVYSFJjZEdsdWFYUnBZV3hwZW1WVFpXTjBhVzl1S0hCaGNuTmxTVzUwS0NRb1lDTWtlM05sWTNScGIyNUpaSDFnS1M1aGRIUnlLQ2RrWVhSaExXbHVaR1Y0SnlrcExDQnBaSGdwTzF4dVhHNWNkRngwYzJWMFZHbHRaVzkxZENnb0tTQTlQaUI3WEc1Y2RGeDBYSFJ3WVdkbFRHOWhaR1Z5S0hCaGNuTmxTVzUwS0NRb1lDTWtlM05sWTNScGIyNUpaSDFnS1M1aGRIUnlLQ2RrWVhSaExXbHVaR1Y0SnlrcEtUdGNibHgwWEhSOUxDQTFNREFwTzF4dVhHNWNkRngwYVdZb2MyVmpkR2x2Ymtsa0lDRTlQU0FuYzJWamRHbHZiakluS1h0Y2JseDBYSFJjZENRb1lDTWtlM05sWTNScGIyNUpaSDFnS1M1bWFXNWtLQ2N1YUdWaFpHbHVaeXdnY0NjcExtRmtaRU5zWVhOektDZG1ZV1JsU1c0bktUdGNibHgwWEhSY2RDUW9ZQ01rZTNObFkzUnBiMjVKWkgxZ0tTNXZiaWduZEhKaGJuTnBkR2x2Ym1WdVpDQjNaV0pyYVhSVWNtRnVjMmwwYVc5dVJXNWtJRzlVY21GdWMybDBhVzl1Ulc1a0p5d2dLR1Z6S1NBOVBpQjdYRzVjZENBZ0lDQmNkQ1FvWUNNa2UzTmxZM1JwYjI1SlpIMWdLUzVtYVc1a0tDY3VhR1ZoWkdsdVp5d2djQ2NwTG5KbGJXOTJaVU5zWVhOektDZG1ZV1JsU1c0bktUdGNibHgwWEhSY2RIMHBPMXh1WEhSY2RIMWNibHgwZlR0Y2JseHVMeThnUTB4SlEwc2dURWxUVkVWT1JWSWdSazlTSUZCQlIwbE9RVlJKVDA0Z1FsVlVWRTlPVXlCUFRpQlRSVU5VU1U5T1V5QXpJRUZPUkNBMExpQmNYRnhjWEc1Y2JseDBKQ2duTG5ObFkzUnBiMjR6VUdGbmFXNWhkRzl5UW5WMGRHOXVMQ0F1YzJWamRHbHZialJRWVdkcGJtRjBiM0pDZFhSMGIyNG5LUzVqYkdsamF5Z29aU2tnUFQ0Z2UxeHVYSFJjZEZ4dVhIUmNkR2xtS0cxaGMzUmxjazlpYWxza0tHVXVZM1Z5Y21WdWRGUmhjbWRsZENrdVkyeHZjMlZ6ZENnbmMyVmpkR2x2YmljcExtRjBkSElvSjJsa0p5bGRMbWx6UVhWMGIyMWhkR1ZrS1NCN1hHNHZMeUJKUmlCVVNFVlNSU0JKVXlCQklGSkpUazVKVGtjZ1NVNVVSVkpXUVV3Z1QwNGdWRWhGSUZKRlRFVldRVTVVSUZORlExUkpUMDRnUTB4RlFWSWdTVlFnWEZ4Y1hGeHVYSFJjZEZ4MGFXNTBaWEoyWVd4TllXNWhaMlZ5S0daaGJITmxMQ0FrS0dVdVkzVnljbVZ1ZEZSaGNtZGxkQ2t1WTJ4dmMyVnpkQ2duYzJWamRHbHZiaWNwTG1GMGRISW9KMmxrSnlrcE8xeHVMeThnVTBWVUlFRWdUa1ZYSUVsT1ZFVlNWa0ZNSUU5R0lEY2dVMFZEVDA1RVV5QlBUaUJVU0VVZ1UwVkRWRWxQVGlCY1hGeGNYRzVjZEZ4MFhIUnBiblJsY25aaGJFMWhibUZuWlhJb2RISjFaU3dnSkNobExtTjFjbkpsYm5SVVlYSm5aWFFwTG1Oc2IzTmxjM1FvSjNObFkzUnBiMjRuS1M1aGRIUnlLQ2RwWkNjcExDQTNNREF3S1R0Y2JseDBYSFI5WEc0dkx5QkRRVXhNSUZSSVJTQkRURWxEU3lCSVFVNUVURVZTSUVaVlRrTlVTVTlPSUVGT1JDQlFRVk5USUVsVUlGUklSU0JGVmtWT1ZDQkpSaUJVUVZKSFJWUWdTVk1nVGs5VUlFRk1Va1ZCUkZrZ1FVTlVTVlpGSUZ4Y1hGeGNibHgwWEhScFppZ2hKQ2hsTG1OMWNuSmxiblJVWVhKblpYUXBMbWhoYzBOc1lYTnpLQ2RoWTNScGRtVW5LU2tnZTF4dVhIUmNkRngwYUdGdVpHeGxVR0Z1YVc1aGRHbHZia0oxZEhSdmJrTnNhV05yS0dVcE8xeHVYSFJjZEgxY2JseDBmU2s3WEc1Y2JpOHZJRWxPU1ZSSlFVeEpXa1VnVDA1RlVFRkhSVk5EVWs5TVRDQkpSaUJPVDFRZ1NVNGdRMDFUSUZCU1JWWkpSVmN1SUZ4Y1hGeGNibHh1WEhScFppZ2hKQ2hzYjJOaGRHbHZiaWt1WVhSMGNpZ25hSEpsWmljcExtbHVZMngxWkdWektDZHBibVJsZUM1d2FIQW5LU2tnZTF4dVhIUmNkQ1FvSnlOelkzSnZiR3hsY2xkeVlYQndaWEluS1M1dmJtVndZV2RsWDNOamNtOXNiQ2g3WEc1Y2RGeDBYSFJ6WldOMGFXOXVRMjl1ZEdGcGJtVnlPaUJjSW5ObFkzUnBiMjVjSWl3Z0lDQWdYRzVjZEZ4MFhIUmxZWE5wYm1jNklGd2laV0Z6WlMxdmRYUmNJaXdnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRnh1WEhSY2RGeDBZVzVwYldGMGFXOXVWR2x0WlRvZ2RHbHRaU3dnSUNBZ0lDQWdJQ0FnSUNCY2JseDBYSFJjZEhCaFoybHVZWFJwYjI0NklIUnlkV1VzSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdYRzVjZEZ4MFhIUjFjR1JoZEdWVlVrdzZJSFJ5ZFdVc0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnWEc1Y2RGeDBYSFJpWldadmNtVk5iM1psT2lBb2FXNWtaWGdwSUQwK0lIdDlMQ0JjYmx4MFhIUmNkR0ZtZEdWeVRXOTJaVG9nS0dsdVpHVjRLU0E5UGlCN1hHNHZMeUJKVGtsVVNVRk1TVnBGSUZSSVJTQkRWVkpTUlU1VUlGQkJSMFV1SUZ4Y1hGeGNibHh1WEhSY2RGeDBYSFJ3WVdkbFRHOWhaR1Z5S0dsdVpHVjRLVHRjYmx4MFhIUmNkSDBzSUNCY2JseDBYSFJjZEd4dmIzQTZJR1poYkhObExDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdYRzVjZEZ4MFhIUnJaWGxpYjJGeVpEb2dkSEoxWlN3Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUZ4dVhIUmNkRngwY21WemNHOXVjMmwyWlVaaGJHeGlZV05yT2lCbVlXeHpaU3dnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JjYmx4MFhIUmNkR1JwY21WamRHbHZiam9nWENKMlpYSjBhV05oYkZ3aUlDQWdJQ0FnSUNBZ0lGeHVYSFJjZEgwcE8xeHVYRzVjZEZ4MEpDZ25JM05qY205c2JHVnlWM0poY0hCbGNpY3BMbTF2ZG1WVWJ5Z3hLVHRjYmx4MGZWeHVYRzR2THlCRFQwNVVVazlNSUVOTVNVTkxVeUJQVGlCWFQxSkxJRmRKVkVnZ1ZWTWdVMFZEVkVsUFRpQW9VMFZEVkVsUFRqVXBMaUJjWEZ4Y1hHNWNibHgwSkNnbkxtTnNhV05yWVdKc1pTY3BMbU5zYVdOcktDaGxLU0E5UGlCN1hHNWNkRngwYkdWMElHTjFjbkpsYm5SVFpXTjBhVzl1SUQwZ0pDaGxMblJoY21kbGRDa3VZMnh2YzJWemRDZ2tLQ2N1YzNWaVUyVmpkR2x2YmljcEtUdGNibHh1WEhSY2RHbG1LR04xY25KbGJuUlRaV04wYVc5dUxtaGhjME5zWVhOektDZHZjR1Z1SnlrcElIdGNibHgwWEhSY2RHTjFjbkpsYm5SVFpXTjBhVzl1TG5KbGJXOTJaVU5zWVhOektDZHZjR1Z1SnlrN1hHNWNkRngwWEhSamRYSnlaVzUwVTJWamRHbHZiaTVtYVc1a0tDY3VZblYwZEc5dUxDQndKeWt1Y21WdGIzWmxRMnhoYzNNb0oyWmhaR1ZKYmljcE8xeHVYSFJjZEZ4MFkzVnljbVZ1ZEZObFkzUnBiMjR1YzJsaWJHbHVaM01vSnk1emRXSlRaV04wYVc5dUp5a3ViV0Z3S0NocFpIZ3NJSE5sWTNScGIyNHBJRDArSUh0Y2JseDBYSFJjZEZ4MEpDaHpaV04wYVc5dUtTNXlaVzF2ZG1WRGJHRnpjeWduWTJ4dmMyVmtKeWs3WEc1Y2RGeDBYSFJjZENRb2MyVmpkR2x2YmlrdVptbHVaQ2duTG5ScGJuUW5LUzV5WlcxdmRtVkRiR0Z6Y3lnbllXUmtWR2x1ZENjcExtRmtaRU5zWVhOektDZHlaVzF2ZG1WVWFXNTBKeWs3WEc1Y2RGeDBYSFI5S1R0Y2JseDBYSFI5SUdWc2MyVWdlMXh1WEhSY2RGeDBZM1Z5Y21WdWRGTmxZM1JwYjI0dWNtVnRiM1psUTJ4aGMzTW9KMk5zYjNObFpDY3BMbUZrWkVOc1lYTnpLQ2R2Y0dWdUp5azdYRzVjZEZ4MFhIUmpkWEp5Wlc1MFUyVmpkR2x2Ymk1dmJpZ25kSEpoYm5OcGRHbHZibVZ1WkNCM1pXSnJhWFJVY21GdWMybDBhVzl1Ulc1a0lHOVVjbUZ1YzJsMGFXOXVSVzVrSnl3Z0tHVnpLU0E5UGlCN1hHNWNkQ0FnSUNCY2RDUW9KeTV6ZFdKVFpXTjBhVzl1TG05d1pXNG5LUzVtYVc1a0tDY3VZblYwZEc5dUxDQndKeWt1WVdSa1EyeGhjM01vSjJaaFpHVkpiaWNwTzF4dVhIUmNkRngwZlNrN1hHNWNkRngwWEhSamRYSnlaVzUwVTJWamRHbHZiaTV6YVdKc2FXNW5jeWduTG5OMVlsTmxZM1JwYjI0bktTNXRZWEFvS0dsa2VDd2djMlZqZEdsdmJpa2dQVDRnZTF4dVhIUmNkRngwWEhRa0tITmxZM1JwYjI0cExuSmxiVzkyWlVOc1lYTnpLQ2R2Y0dWdUp5a3VZV1JrUTJ4aGMzTW9KMk5zYjNObFpDY3BPMXh1WEhSY2RGeDBYSFFrS0hObFkzUnBiMjRwTG1acGJtUW9KeTUwYVc1MEp5a3VjbVZ0YjNabFEyeGhjM01vSjNKbGJXOTJaVlJwYm5RbktTNWhaR1JEYkdGemN5Z25ZV1JrVkdsdWRDY3BPMXh1WEhSY2RGeDBYSFFrS0hObFkzUnBiMjRwTG1acGJtUW9KeTVpZFhSMGIyNHNJSEFuS1M1eVpXMXZkbVZEYkdGemN5Z25abUZrWlVsdUp5azdYRzVjZEZ4MFhIUjlLVHRjYmx4MFhIUjlYRzVjZEZ4MFkzVnljbVZ1ZEZObFkzUnBiMjR1Wm1sdVpDZ25MblJwYm5RbktTNXlaVzF2ZG1WRGJHRnpjeWduWVdSa1ZHbHVkQ2NwTG1Ga1pFTnNZWE56S0NkeVpXMXZkbVZVYVc1MEp5azdYRzVjZEgwcE8xeHVYRzR2THlCRFQwNVVVazlNSUVaUFQxUkZVaUJCVWxKUFZ5QkRURWxEUzFNdUlGeGNYRnhjYmx4dVhIUWtLQ2NqWkc5M2JrRnljbTkzSnlrdVkyeHBZMnNvS0NrZ1BUNGdlMXh1WEhSY2RHbG1LQ1FvZDJsdVpHOTNLUzVvWldsbmFIUW9LU0FxSUNna0tDY3VjR0ZuWlNjcExteGxibWQwYUNBdElERXBJRDA5UFNBdElDUW9KeU56WTNKdmJHeGxjbGR5WVhCd1pYSW5LUzV2Wm1aelpYUW9LUzUwYjNBcElIdGNiaTh2SUUxUFZrVWdWRThnVkU5UUlFOUdJRkJCUjBVZ1NVWWdRMVZTVWtWT1ZFeFpJRUZVSUVKUFZGUlBUU0JjWEZ4Y1hHNWNkQ0FnWEhRa0tDY2pjMk55YjJ4c1pYSlhjbUZ3Y0dWeUp5a3ViVzkyWlZSdktERXBPMXh1WEhSY2RIMGdaV3h6WlNCN1hHNWNkRngwWEhRa0tDY2pjMk55YjJ4c1pYSlhjbUZ3Y0dWeUp5a3ViVzkyWlVSdmQyNG9LVHRjYmx4MFhIUjlYRzVjZEgwcE8xeHVYRzR2THlCSVNVUkZJRlJJUlNCTVQwRkVTVTVISUVGT1NVMUJWRWxQVUU0Z1YwaEZUaUJXU1VSRlR5QkpVeUJTUlVGRVdTQlVUeUJRVEVGWklFOU9JRVJGVTFoTFZFOVFMaUJjWEZ4Y1hHNWNibHgwWTI5dWMzUWdhR2xrWlV4dllXUnBibWRCYm1sdFlYUnBiMjRnUFNBb0tTQTlQaUI3WEc1Y2RGeDBhV1lvZDJsdVpHOTNMbWx1Ym1WeVYybGtkR2dnUGlBNE1EQWdKaVlnSVNRb0p5TnNiMkZrYVc1bkp5a3VhR0Z6UTJ4aGMzTW9KMmhwWkdSbGJpY3BLU0I3WEc1Y2JseDBYSFJjZEdsbUtDUW9KeU4yYVdSbGJ5Y3BMbWRsZENnd0tTNXlaV0ZrZVZOMFlYUmxJRDA5UFNBMEtTQjdYRzVjZEZ4MFhIUmNkQ1FvSnlOc2IyRmthVzVuSnlrdVlXUmtRMnhoYzNNb0oyaHBaR1JsYmljcE8xeHVYSFJjZEZ4MGZWeHVYSFJjZEgxY2JseDBmVnh1WEc0dkx5Qk5RVTVCUjBWTlJVNVVJRVpWVGtOVVNVOU9JRVpQVWlCVFJWUlVTVTVISUVGT1JDQkRURVZCVWtsT1J5QlVTRVVnVTB4SlJFVWdRVlZVVDAxQlZFbFBUaUJKVGxSRlVsWkJURk11SUZ4Y1hGeGNibHh1WEhSamIyNXpkQ0JwYm5SbGNuWmhiRTFoYm1GblpYSWdQU0FvWm14aFp5d2djMlZqZEdsdmJrbGtMQ0IwYVcxbEtTQTlQaUI3WEc0Z0lDQmNkR2xtS0dac1lXY3BJSHRjYmlCY2RGeDBYSFJ0WVhOMFpYSlBZbXBiYzJWamRHbHZia2xrWFM1aGRYUnZiV0YwWlNBOUlITmxkRWx1ZEdWeWRtRnNLQ2dwSUQwK0lIdGNiaUFnSUNBZ1hIUmNkSE4zYVhCbFEyOXVkSEp2Ykd4bGNpaHpaV04wYVc5dVNXUXNJQ2RzSnlrN1hIUmNiaUFnSUNBZ1hIUjlMQ0IwYVcxbEtUc2dYRzRnSUNCY2RIMGdaV3h6WlNCN1hIUmNkRnh1SUNBZ0lGeDBZMnhsWVhKSmJuUmxjblpoYkNodFlYTjBaWEpQWW1wYmMyVmpkR2x2Ymtsa1hTNWhkWFJ2YldGMFpTazdYRzRnSUNCY2RIMWNibHgwZlR0Y2JseHVMeThnU1VZZ1RrOVVJRWxPSUVOTlV5QkJSRTFKVGlCUVVrVldTVVZYTENCUVJWSlFSVlJWUVV4TVdTQkRTRVZEU3lCSlJpQlhSU0JCVWtVZ1FWUWdWRWhGSUZSUFVDQlBSaUJVU0VVZ1VFRkhSU0JCVGtRZ1NVWWdVMDhzSUVSUFRsUWdVMGhQVnlCVVNFVWdSazlQVkVWU0lFOVNJRWRTUlVWT0lGTklRVkJGTGlCY1hGeGNYRzVjYmx4MGFXWW9JU1FvYkc5allYUnBiMjRwTG1GMGRISW9KMmh5WldZbktTNXBibU5zZFdSbGN5Z25hVzVrWlhndWNHaHdKeWtwSUh0Y2JseDBYSFJ6WlhSSmJuUmxjblpoYkNnb0tTQTlQaUI3WEc1Y2RGeDBYSFJwWmlna0tDY2pjMk55YjJ4c1pYSlhjbUZ3Y0dWeUp5a3ViMlptYzJWMEtDa3VkRzl3SUQ0OUlDMGdLSGRwYm1SdmR5NXBibTVsY2tobGFXZG9kQ0F2SURFdU9Ta3BJSHRjYmx4MFhIUmNkRngwSkNnbkkyaGxZV1JsY2xOb1lYQmxMQ0FqWm05dmRHVnlKeWt1WVdSa1EyeGhjM01vSjIxdmRtVlBabVpUWTNKbFpXNG5LVHRjYmx4MFhIUmNkRngwSkNnbkkzWnBaR1Z2SnlrdVoyVjBLREFwTG5Cc1lYa29LVHRjYmx4MFhIUmNkRngwSkNnbkxtRnljbTkzSnlrdVlXUmtRMnhoYzNNb0ozQjFiSE5oZEdVbktUdGNibHgwWEhSY2RIMGdaV3h6WlNCN1hHNWNkRngwWEhSY2RDUW9KeU5vWldGa1pYSlRhR0Z3WlN3Z0kyWnZiM1JsY2ljcExuSmxiVzkyWlVOc1lYTnpLQ2R0YjNabFQyWm1VMk55WldWdUp5azdYRzVjZEZ4MFhIUmNkQ1FvSnlOMmFXUmxieWNwTG1kbGRDZ3dLUzV3WVhWelpTZ3BPMXh1WEhSY2RGeDBYSFFrS0NjdVlYSnliM2NuS1M1eVpXMXZkbVZEYkdGemN5Z25jSFZzYzJGMFpTY3BPMXh1WEhSY2RGeDBmVnh1WEc0dkx5QlNUMVJCVkVVZ1ZFaEZJRUZTVWs5WElFbE9JRlJJUlNCR1QwOVVSVklnVjBoRlRpQkJWQ0JVU0VVZ1FrOVVWRTlOSUU5R0lGUklSU0JRUVVkRklGeGNYRnhjYmx4dVhIUmNkRngwYVdZb0pDZ25JM05qY205c2JHVnlWM0poY0hCbGNpY3BMbTltWm5ObGRDZ3BMblJ2Y0NBOElDMGdLSGRwYm1SdmR5NXBibTVsY2tobGFXZG9kQ0FxSURRcEtTQjdYRzVjZEZ4MFhIUmNkQ1FvSnlOa2IzZHVRWEp5YjNjbktTNWpjM01vZXlkMGNtRnVjMlp2Y20wbk9pQW5jbTkwWVhSbEtERTRNR1JsWnlrZ2RISmhibk5zWVhSbFdDZ3ROVEFsS1NkOUtUdGNibHgwWEhSY2RIMGdaV3h6WlNCN1hHNWNkRngwWEhSY2RDUW9KeU5rYjNkdVFYSnliM2NuS1M1amMzTW9leWQwY21GdWMyWnZjbTBuT2lBbmRISmhibk5zWVhSbFdDZ3ROVEFsS1NCeWIzUmhkR1VvTUdSbFp5a25mU2s3WEc1Y2RGeDBYSFI5WEc1Y2JseDBYSFJjZEdocFpHVk1iMkZrYVc1blFXNXBiV0YwYVc5dUtDazdYRzVjYmk4dklFRkVSQ0JNUVU1RVUwTkJVRVVnVTFSWlRFVlRJRlJQSUZKRlRFVldRVTVVSUVWTVJVMUZUbFJUSUZ4Y1hGeGNibHh1WEhSY2RGeDBhV1lvZDJsdVpHOTNMbTFoZEdOb1RXVmthV0VvWENJb2IzSnBaVzUwWVhScGIyNDZJR3hoYm1SelkyRndaU2xjSWlrdWJXRjBZMmhsY3lBbUppQjNhVzVrYjNjdWFXNXVaWEpYYVdSMGFDQThJRGd3TUNrZ2UxeHVYSFJjZEZ4MElDQWtLQ2N1Ym1GMlgyeHBibXNzSUNOb1pXRmtaWEpUYUdGd1pTd2dJMlp2YjNSbGNpd2dMbU4xYzNSdmJTd2dMbTFoY210bGNpd2dJM05sWTNScGIyNDFMQ0F1ZEdWNGRGZHlZWEJ3WlhJbktTNWhaR1JEYkdGemN5Z25iR0Z1WkhOallYQmxKeWs3WEc1Y2RGeDBYSFI5SUdWc2MyVWdlMXh1WEhSY2RGeDBYSFFnSkNnbkxtNWhkbDlzYVc1ckxDQWphR1ZoWkdWeVUyaGhjR1VzSUNObWIyOTBaWElzSUM1amRYTjBiMjBzSUM1dFlYSnJaWElzSUNOelpXTjBhVzl1TlN3Z0xuUmxlSFJYY21Gd2NHVnlKeWt1Y21WdGIzWmxRMnhoYzNNb0oyeGhibVJ6WTJGd1pTY3BPMXh1WEhSY2RGeDBmVnh1WEc1Y2RGeDBYSFJwWmlna0tDY2pjMlZqZEdsdmJqTXVZV04wYVhabEp5a3ViR1Z1WjNSb0tTQjdJQzh2SUVGVlZFOU5RVlJGSUZSSVJTQlRURWxFUlZNZ1QwNGdVMFZEVkVsUFVFNGdNeUJGVmtWU1dTQTNJRk5GUTA5T1JGTWdTVVlnVkVoRklGTkZRMVJKVDA0Z1NWTWdRVU5VU1ZaRkxpQmNYRnhjWEc1Y2RGeDBYSFJjZEdsbUtHMWhjM1JsY2s5aWFpNXpaV04wYVc5dU15NXBjMEYxZEc5dFlYUmxaQ0FoUFQwZ2RISjFaU2tnZTF4dVhIUmNkRngwWEhSY2RHMWhjM1JsY2s5aWFpNXpaV04wYVc5dU15NXBjMEYxZEc5dFlYUmxaQ0E5SUhSeWRXVTdYRzVjZEZ4MFhIUmNkRngwYVc1MFpYSjJZV3hOWVc1aFoyVnlLSFJ5ZFdVc0lDZHpaV04wYVc5dU15Y3NJRGN3TURBcE8xeHVYSFJjZEZ4MFhIUjlYRzVjZEZ4MFhIUjlJR1ZzYzJVZ2V5QXZMeUJUVkU5UUlFRlZWRTlOUVZSRlJDQlRURWxFUlZNZ1QwNGdVMFZEVkVsUFVFNGdNeUJKUmlCVVNFVWdVMFZEVkVsUFRpQkpVeUJPVDFRZ1FVTlVTVlpGTGlCY1hGeGNYRzVjZEZ4MFhIUmNkR2xtS0cxaGMzUmxjazlpYWk1elpXTjBhVzl1TXk1cGMwRjFkRzl0WVhSbFpDQTlQVDBnZEhKMVpTa2dlMXh1WEhSY2RGeDBYSFJjZEdsdWRHVnlkbUZzVFdGdVlXZGxjaWhtWVd4elpTd2dKM05sWTNScGIyNHpKeWs3WEc1Y2RGeDBYSFJjZEZ4MGJXRnpkR1Z5VDJKcUxuTmxZM1JwYjI0ekxtbHpRWFYwYjIxaGRHVmtJRDBnWm1Gc2MyVTdYRzVjZEZ4MFhIUmNkSDFjYmx4MFhIUmNkSDFjYmx4dVhIUmNkRngwYVdZb0pDZ25JM05sWTNScGIyNDBMbUZqZEdsMlpTY3BMbXhsYm1kMGFDa2dleUF2THlCQlZWUlBUVUZVUlNCVVNFVWdVMHhKUkVWVElFOU9JRk5GUTFSSlQxQk9JRFFnUlZaRlVsa2dOeUJUUlVOUFRrUlRJRWxHSUZSSVJTQlRSVU5VU1U5T0lFbFRJRUZEVkVsV1JTNGdYRnhjWEZ4dVhIUmNkRngwWEhScFppaHRZWE4wWlhKUFltb3VjMlZqZEdsdmJqUXVhWE5CZFhSdmJXRjBaV1FnSVQwOUlIUnlkV1VwSUh0Y2JseDBYSFJjZEZ4MFhIUnRZWE4wWlhKUFltb3VjMlZqZEdsdmJqUXVhWE5CZFhSdmJXRjBaV1FnUFNCMGNuVmxPMXh1WEhSY2RGeDBYSFJjZEdsdWRHVnlkbUZzVFdGdVlXZGxjaWgwY25WbExDQW5jMlZqZEdsdmJqUW5MQ0EzTURBd0tUdGNibHgwWEhSY2RGeDBmVnh1WEhSY2RGeDBmU0JsYkhObElIc2dMeThnVTFSUFVDQkJWVlJQVFVGVVJVUWdVMHhKUkVWVElFOU9JRk5GUTFSSlQxQk9JRFFnU1VZZ1ZFaEZJRk5GUTFSSlQwNGdTVk1nVGs5VUlFRkRWRWxXUlM0Z1hGeGNYRnh1WEhSY2RGeDBYSFJwWmlodFlYTjBaWEpQWW1vdWMyVmpkR2x2YmpRdWFYTkJkWFJ2YldGMFpXUWdQVDA5SUhSeWRXVXBJSHRjYmx4MFhIUmNkRngwWEhScGJuUmxjblpoYkUxaGJtRm5aWElvWm1Gc2MyVXNJQ2R6WldOMGFXOXVOQ2NwTzF4dVhIUmNkRngwWEhSY2RHMWhjM1JsY2s5aWFpNXpaV04wYVc5dU5DNXBjMEYxZEc5dFlYUmxaQ0E5SUdaaGJITmxPMXh1WEhSY2RGeDBYSFI5WEc1Y2RGeDBYSFI5WEc1Y2RGeDBmU3dnTlRBd0tUdGNibHgwZlZ4dVhHNHZMeUJEVDA1VVVrOU1JRmRJUVZRZ1NFRlFVRVZPVXlCWFNFVk9JRXhKVGt0VElFbE9JRlJJUlNCT1FWWXZUVVZPVlNCQlVrVWdRMHhKUTB0RlJDQmNYRnhjWEc1Y2JseDBKQ2duTG01aGRsOXNhVzVySnlrdVkyeHBZMnNvS0dVcElEMCtJSHRjYmx4MFhIUmpiMjV6ZENCd1lXZGxTV1I0SUQwZ2NHRnljMlZKYm5Rb0pDaGxMblJoY21kbGRDa3VZWFIwY2lnblpHRjBZUzFwYm1SbGVDY3BLVHRjYmx4MFhIUWtLQ2NqYzJOeWIyeHNaWEpYY21Gd2NHVnlKeWt1Ylc5MlpWUnZLSEJoWjJWSlpIZ3BPMXh1WEhSY2RDUW9KeU50Wlc1MVFteHZZMnRQZFhRbktTNWhaR1JEYkdGemN5Z25hR2xrWkdWdUp5azdYRzVjYmx4MFhIUnBaaWhpZFhKblpYSXVZMnhoYzNOTWFYTjBMbU52Ym5SaGFXNXpLQ2RpZFhKblpYSXRMV0ZqZEdsMlpTY3BLU0I3WEc0Z0lDQWdJQ0J1WVhZdVkyeGhjM05NYVhOMExuSmxiVzkyWlNnbmJtRjJYMjl3Wlc0bktUdGNiaUFnSUNBZ0lHSjFjbWRsY2k1amJHRnpjMHhwYzNRdWNtVnRiM1psS0NkaWRYSm5aWEl0TFdGamRHbDJaU2NwTzF4dUlDQWdJQ0FnWkc5amRXMWxiblF1WW05a2VTNXpkSGxzWlM1d2IzTnBkR2x2YmlBOUlDZHlaV3hoZEdsMlpTYzdYRzRnSUNBZ2ZTQmNibHgwZlNrN1hHNWNiaTh2SUZkSVJVNGdWRWhGSUU1QlZpQkpVeUJQVUVWT0lGQlNSVlpGVGxRZ1ZWTkZVaUJHVWs5TklFSkZTVTVISUVGQ1RFVWdWRThnUTB4SlEwc2dRVTVaVkVoSlRrY2dSVXhUUlNCY1hGeGNYRzVjYmx4MEpDZ25JMjFsYm5WQ2JHOWphMDkxZENjcExtTnNhV05yS0NobEtTQTlQaUI3WEc1Y2RDQWdJR1V1YzNSdmNGQnliM0JoWjJGMGFXOXVLQ2s3WEc1Y2RIMHBPMXh1WEc1Y2RIWmhjaUJpZFhKblpYSWdQU0JrYjJOMWJXVnVkQzVuWlhSRmJHVnRaVzUwUW5sSlpDZ25iV0ZwYmkxaWRYSm5aWEluS1N3Z1hHNGdJRzVoZGlBOUlHUnZZM1Z0Wlc1MExtZGxkRVZzWlcxbGJuUkNlVWxrS0NkdFlXbHVUbUYySnlrN1hHNWNiaTh2SUVOUFRsUlNUMHdnUms5U0lFOVFSVTRnUVU1RUlFTk1UMU5KVGtjZ1ZFaEZJRTFGVGxVdlRrRldJQ0JjWEZ4Y1hHNWNiaUFnWm5WdVkzUnBiMjRnYm1GMlEyOXVkSEp2YkNncElIdGNibHh1SUNBZ0lHbG1LR0oxY21kbGNpNWpiR0Z6YzB4cGMzUXVZMjl1ZEdGcGJuTW9KMkoxY21kbGNpMHRZV04wYVhabEp5a3BJSHRjYmlBZ0lDQWdJRzVoZGk1amJHRnpjMHhwYzNRdWNtVnRiM1psS0NkdVlYWmZiM0JsYmljcE8xeHVJQ0FnSUNBZ1luVnlaMlZ5TG1Oc1lYTnpUR2x6ZEM1eVpXMXZkbVVvSjJKMWNtZGxjaTB0WVdOMGFYWmxKeWs3WEc0Z0lDQWdJQ0FrS0NjamJXVnVkVUpzYjJOclQzVjBKeWt1WVdSa1EyeGhjM01vSjJocFpHUmxiaWNwTzF4dUlDQWdJSDBnWEc0Z0lDQWdaV3h6WlNCN1hHNGdJQ0FnSUNCaWRYSm5aWEl1WTJ4aGMzTk1hWE4wTG1Ga1pDZ25ZblZ5WjJWeUxTMWhZM1JwZG1VbktUdGNiaUFnSUNBZ0lHNWhkaTVqYkdGemMweHBjM1F1WVdSa0tDZHVZWFpmYjNCbGJpY3BPMXh1SUNBZ0lDQWdKQ2duSTIxbGJuVkNiRzlqYTA5MWRDY3BMbkpsYlc5MlpVTnNZWE56S0Nkb2FXUmtaVzRuS1R0Y2JpQWdJQ0I5WEc0Z0lIMWNiaUFnWEc0dkx5QlBUa3haSUV4SlUxUkZUaUJHVDFJZ1RVVk9WU0JEVEVsRFMxTWdWMGhGVGlCT1QxUWdTVTRnUTAxVElGQlNSVlpKUlZjZ1RVOUVSU0JjWEZ4Y1hHNWNiaUFnYVdZb0lTUW9iRzlqWVhScGIyNHBMbUYwZEhJb0oyaHlaV1luS1M1cGJtTnNkV1JsY3lnbmFXNWtaWGd1Y0dod0p5a3BJSHRjYmlBZ1hIUmlkWEpuWlhJdVlXUmtSWFpsYm5STWFYTjBaVzVsY2lnblkyeHBZMnNuTENCdVlYWkRiMjUwY205c0tUdGNiaUFnZlZ4dVhHNHZMeUJEVEU5VFJTQlVTRVVnVGtGV0lFbEdJRlJJUlNCWFNVNUVUMWNnU1ZNZ1QxWkZVaUF4TURBd1VGZ2dWMGxFUlNCY1hGeGNYRzVjYmlBZ2QybHVaRzkzTG1Ga1pFVjJaVzUwVEdsemRHVnVaWElvSjNKbGMybDZaU2NzSUdaMWJtTjBhVzl1S0NrZ2UxeHVJQ0FnSUdsbUtIZHBibVJ2ZHk1cGJtNWxjbGRwWkhSb0lENGdNVEF3TUNBbUppQnVZWFl1WTJ4aGMzTk1hWE4wTG1OdmJuUmhhVzV6S0NkdVlYWmZiM0JsYmljcEtTQjdYRzRnSUNBZ0lDQnVZWFpEYjI1MGNtOXNLQ2s3WEc0Z0lDQWdJQ0J1WVhZdVkyeGhjM05NYVhOMExuSmxiVzkyWlNnbmJtRjJYMjl3Wlc0bktUdGNiaUFnSUNBZ0lDQWtLQ2NqYldWdWRVSnNiMk5yVDNWMEp5a3VZV1JrUTJ4aGMzTW9KMmhwWkdSbGJpY3BPMXh1SUNBZ0lIMWNiaUFnZlNrN1hHNWNiaTh2SUZSSVNWTWdVMFZVSUU5R0lFbEdJRk5VUVZSRlRVVk9WRk1nU1U1SlZFbEJURWxUUlZNZ1ZFaEZJRk5RUlZOSlJrbERJRkJCUjBWVElFWlBVaUJRVWtWV1NVVlhTVTVISUVsT0lFTk5VeUJCUkUxSlRpNGdYRnhjWEZ4dVhHNGdJR2xtS0NRb2JHOWpZWFJwYjI0cExtRjBkSElvSjJoeVpXWW5LUzVwYm1Oc2RXUmxjeWduYVc1a1pYZ3VjR2h3SnlrcElIdGNibHgwWEhScFppZ2tLR3h2WTJGMGFXOXVLUzVoZEhSeUtDZG9jbVZtSnlrdWFXNWpiSFZrWlhNb0oybHRZV2RwYm1VdGFXWW5LU2tnZTF4dVhIUmNkRngwY0dGblpVeHZZV1JsY2lnMEtUdGNibHgwWEhSOVhHNWNkRngwYVdZb0pDaHNiMk5oZEdsdmJpa3VZWFIwY2lnbmFISmxaaWNwTG1sdVkyeDFaR1Z6S0Nkb2IzY3RkMlV0YVc1dWIzWmhkR1VuS1NrZ2UxeHVYSFJjZEZ4MGNHRm5aVXh2WVdSbGNpZ3pLVHRjYmx4MFhIUjlYRzVjZEZ4MGFXWW9KQ2hzYjJOaGRHbHZiaWt1WVhSMGNpZ25hSEpsWmljcExtbHVZMngxWkdWektDZDNiM0pyTFhkcGRHZ3RkWE1uS1NrZ2UxeHVYSFJjZEZ4MGNHRm5aVXh2WVdSbGNpZzFLVHRjYmx4MFhIUjlYRzVjZEZ4MGFXWW9KQ2hzYjJOaGRHbHZiaWt1WVhSMGNpZ25hSEpsWmljcExtbHVZMngxWkdWektDZGpiMjUwWVdOMExYVnpKeWtwSUh0Y2JseDBYSFJjZEhCaFoyVk1iMkZrWlhJb05pazdYRzVjZEZ4MGZWeHVYSFJjZEdsbUtDUW9iRzlqWVhScGIyNHBMbUYwZEhJb0oyaHlaV1luS1M1cGJtTnNkV1JsY3lnbmFHOXRaUzEyYVdSbGJ5Y3BLU0I3WEc1Y2RGeDBYSFJ6WlhSSmJuUmxjblpoYkNnb0tTQTlQaUI3WEc1Y2RGeDBYSFJjZEdocFpHVk1iMkZrYVc1blFXNXBiV0YwYVc5dUtDazdYRzVjZEZ4MFhIUjlMQ0ExTURBcFhHNWNkRngwZlZ4dVhIUjlYRzVjYmk4dklGTlhTVkJGSUVWV1JVNVVVeUJFUlZSRlExUlBVaUJHVlU1RFZFbFBUaUJjWEZ4Y1hHNWNiaUFnWm5WdVkzUnBiMjRnWkdWMFpXTjBjM2RwY0dVb1pXd3NJR1oxYm1NcElIdGNibHgwSUNCc1pYUWdjM2RwY0dWZlpHVjBJRDBnZTMwN1hHNWNkQ0FnYzNkcGNHVmZaR1YwTG5OWUlEMGdNRHNnYzNkcGNHVmZaR1YwTG5OWklEMGdNRHNnYzNkcGNHVmZaR1YwTG1WWUlEMGdNRHNnYzNkcGNHVmZaR1YwTG1WWklEMGdNRHRjYmx4MElDQjJZWElnYldsdVgzZ2dQU0F6TURzZ0lDOHZiV2x1SUhnZ2MzZHBjR1VnWm05eUlHaHZjbWw2YjI1MFlXd2djM2RwY0dWY2JseDBJQ0IyWVhJZ2JXRjRYM2dnUFNBek1Ec2dJQzh2YldGNElIZ2daR2xtWm1WeVpXNWpaU0JtYjNJZ2RtVnlkR2xqWVd3Z2MzZHBjR1ZjYmx4MElDQjJZWElnYldsdVgza2dQU0ExTURzZ0lDOHZiV2x1SUhrZ2MzZHBjR1VnWm05eUlIWmxjblJwWTJGc0lITjNhWEJsWEc1Y2RDQWdkbUZ5SUcxaGVGOTVJRDBnTmpBN0lDQXZMMjFoZUNCNUlHUnBabVpsY21WdVkyVWdabTl5SUdodmNtbDZiMjUwWVd3Z2MzZHBjR1ZjYmx4MElDQjJZWElnWkdseVpXTWdQU0JjSWx3aU8xeHVYSFFnSUd4bGRDQmxiR1VnUFNCa2IyTjFiV1Z1ZEM1blpYUkZiR1Z0Wlc1MFFubEpaQ2hsYkNrN1hHNWNkQ0FnWld4bExtRmtaRVYyWlc1MFRHbHpkR1Z1WlhJb0ozUnZkV05vYzNSaGNuUW5MR1oxYm1OMGFXOXVLR1VwZTF4dVhIUWdJQ0FnZG1GeUlIUWdQU0JsTG5SdmRXTm9aWE5iTUYwN1hHNWNkQ0FnSUNCemQybHdaVjlrWlhRdWMxZ2dQU0IwTG5OamNtVmxibGc3SUZ4dVhIUWdJQ0FnYzNkcGNHVmZaR1YwTG5OWklEMGdkQzV6WTNKbFpXNVpPMXh1WEhRZ0lIMHNabUZzYzJVcE8xeHVYSFFnSUdWc1pTNWhaR1JGZG1WdWRFeHBjM1JsYm1WeUtDZDBiM1ZqYUcxdmRtVW5MR1oxYm1OMGFXOXVLR1VwZTF4dVhIUWdJQ0FnWlM1d2NtVjJaVzUwUkdWbVlYVnNkQ2dwTzF4dVhIUWdJQ0FnZG1GeUlIUWdQU0JsTG5SdmRXTm9aWE5iTUYwN1hHNWNkQ0FnSUNCemQybHdaVjlrWlhRdVpWZ2dQU0IwTG5OamNtVmxibGc3SUZ4dVhIUWdJQ0FnYzNkcGNHVmZaR1YwTG1WWklEMGdkQzV6WTNKbFpXNVpPeUFnSUNCY2JseDBJQ0I5TEdaaGJITmxLVHRjYmx4MElDQmxiR1V1WVdSa1JYWmxiblJNYVhOMFpXNWxjaWduZEc5MVkyaGxibVFuTEdaMWJtTjBhVzl1S0dVcGUxeHVYSFFnSUNBZ0x5OW9iM0pwZW05dWRHRnNJR1JsZEdWamRHbHZibHh1WEhRZ0lDQWdhV1lnS0Nnb0tITjNhWEJsWDJSbGRDNWxXQ0F0SUcxcGJsOTRJRDRnYzNkcGNHVmZaR1YwTG5OWUtTQjhmQ0FvYzNkcGNHVmZaR1YwTG1WWUlDc2diV2x1WDNnZ1BDQnpkMmx3WlY5a1pYUXVjMWdwS1NBbUppQW9LSE4zYVhCbFgyUmxkQzVsV1NBOElITjNhWEJsWDJSbGRDNXpXU0FySUcxaGVGOTVLU0FtSmlBb2MzZHBjR1ZmWkdWMExuTlpJRDRnYzNkcGNHVmZaR1YwTG1WWklDMGdiV0Y0WDNrcElDWW1JQ2h6ZDJsd1pWOWtaWFF1WlZnZ1BpQXdLU2twS1NCN1hHNWNkQ0FnSUNBZ0lHbG1LSE4zYVhCbFgyUmxkQzVsV0NBK0lITjNhWEJsWDJSbGRDNXpXQ2tnWkdseVpXTWdQU0JjSW5KY0lqdGNibHgwSUNBZ0lDQWdaV3h6WlNCa2FYSmxZeUE5SUZ3aWJGd2lPMXh1WEhRZ0lDQWdmVnh1WEhRZ0lDQWdMeTkyWlhKMGFXTmhiQ0JrWlhSbFkzUnBiMjVjYmx4MElDQWdJR1ZzYzJVZ2FXWWdLQ2dvS0hOM2FYQmxYMlJsZEM1bFdTQXRJRzFwYmw5NUlENGdjM2RwY0dWZlpHVjBMbk5aS1NCOGZDQW9jM2RwY0dWZlpHVjBMbVZaSUNzZ2JXbHVYM2tnUENCemQybHdaVjlrWlhRdWMxa3BLU0FtSmlBb0tITjNhWEJsWDJSbGRDNWxXQ0E4SUhOM2FYQmxYMlJsZEM1eldDQXJJRzFoZUY5NEtTQW1KaUFvYzNkcGNHVmZaR1YwTG5OWUlENGdjM2RwY0dWZlpHVjBMbVZZSUMwZ2JXRjRYM2dwSUNZbUlDaHpkMmx3WlY5a1pYUXVaVmtnUGlBd0tTa3BLU0I3WEc1Y2RDQWdJQ0FnSUdsbUtITjNhWEJsWDJSbGRDNWxXU0ErSUhOM2FYQmxYMlJsZEM1eldTa2daR2x5WldNZ1BTQmNJbVJjSWp0Y2JseDBJQ0FnSUNBZ1pXeHpaU0JrYVhKbFl5QTlJRndpZFZ3aU8xeHVYSFFnSUNBZ2ZWeHVYRzVjZENBZ0lDQnBaaUFvWkdseVpXTWdJVDBnWENKY0lpa2dlMXh1WEhRZ0lDQWdJQ0JwWmloMGVYQmxiMllnWm5WdVl5QTlQU0FuWm5WdVkzUnBiMjRuS1NCbWRXNWpLR1ZzTEdScGNtVmpLVHRjYmx4MElDQWdJSDFjYmx4MElDQWdJR3hsZENCa2FYSmxZeUE5SUZ3aVhDSTdYRzVjZENBZ0lDQnpkMmx3WlY5a1pYUXVjMWdnUFNBd095QnpkMmx3WlY5a1pYUXVjMWtnUFNBd095QnpkMmx3WlY5a1pYUXVaVmdnUFNBd095QnpkMmx3WlY5a1pYUXVaVmtnUFNBd08xeHVYSFFnSUgwc1ptRnNjMlVwT3lBZ1hHNWNkSDFjYmx4dUx5OGdRMGhQVTBVZ1ZFaEZJRTVGV0ZRZ1UweEpSRVVnVkU4Z1UwaFBWeUJCVGtRZ1EweEpRMHNnVkVoRklGQkJSMGxPUVZSSlQwNGdRbFZVVkU5T0lGUklRVlFnVWtWTVFWUkZVeUJVVHlCSlZDNGdYRnhjWEZ4dVhHNWNkR052Ym5OMElITjNhWEJsUTI5dWRISnZiR3hsY2lBOUlDaGxiQ3dnWkNrZ1BUNGdlMXh1WEc1Y2RGeDBhV1lvWld3Z1BUMDlJQ2R6WldOMGFXOXVOQ2NwSUh0Y2JseHVYSFJjZEZ4MFkyOXVjM1FnYzJWamRHbHZialJRWVdkcGJtRjBhVzl1VEdWdVozUm9JRDBnSkNnbkxuTmxZM1JwYjI0MFVHRm5hVzVoZEc5eVFuVjBkRzl1SnlrdWJHVnVaM1JvTzF4dVhHNWNkRngwWEhScFppaGtJRDA5UFNBbmJDY3BJSHRjYmx4dVhIUmNkRngwWEhScFppaHpaV04wYVc5dU5FbGtlQ0E4SUhObFkzUnBiMjQwVUdGbmFXNWhkR2x2Ymt4bGJtZDBhQ0F0SURFcElIdGNibHgwWEhSY2RGeDBYSFJ6WldOMGFXOXVORWxrZUNzck8xeHVYSFJjZEZ4MFhIUjlJR1ZzYzJVZ2UxeHVYSFJjZEZ4MFhIUmNkSE5sWTNScGIyNDBTV1I0SUQwZ01EdGNibHgwWEhSY2RGeDBmVnh1WEhSY2RGeDBYSFJjYmx4MFhIUmNkRngwSkNnbkxuTmxZM1JwYjI0MFVHRm5hVzVoZEc5eVFuVjBkRzl1SnlsYmMyVmpkR2x2YmpSSlpIaGRMbU5zYVdOcktDazdYRzVjZEZ4MFhIUjlYRzVjZEZ4MFhIUnBaaWhrSUQwOVBTQW5jaWNwSUh0Y2JseHVYSFJjZEZ4MFhIUnBaaWh6WldOMGFXOXVORWxrZUNBK0lEQXBJSHRjYmx4MFhIUmNkRngwWEhSelpXTjBhVzl1TkVsa2VDMHRPMXh1WEhSY2RGeDBYSFI5SUdWc2MyVWdlMXh1WEhSY2RGeDBYSFJjZEhObFkzUnBiMjQwU1dSNElEMGdjMlZqZEdsdmJqUlFZV2RwYm1GMGFXOXVUR1Z1WjNSb0lDMGdNVHRjYmx4MFhIUmNkRngwZlZ4dVhHNWNkRngwWEhSY2RDUW9KeTV6WldOMGFXOXVORkJoWjJsdVlYUnZja0oxZEhSdmJpY3BXM05sWTNScGIyNDBTV1I0WFM1amJHbGpheWdwTzF4dVhIUmNkRngwZlZ4dVhIUmNkSDFjYmx4MFhIUnBaaWhsYkNBOVBUMGdKM05sWTNScGIyNHpKeWtnZTF4dVhHNWNkRngwWEhSamIyNXpkQ0J6WldOMGFXOXVNMUJoWjJsdVlYUnBiMjVNWlc1bmRHZ2dQU0FrS0NjdWMyVmpkR2x2YmpOUVlXZHBibUYwYjNKQ2RYUjBiMjRuS1M1c1pXNW5kR2c3WEc1Y2JseDBYSFJjZEdsbUtHUWdQVDA5SUNkc0p5a2dlMXh1WEc1Y2RGeDBYSFJjZEdsbUtITmxZM1JwYjI0elNXUjRJRHdnYzJWamRHbHZiak5RWVdkcGJtRjBhVzl1VEdWdVozUm9JQzBnTVNrZ2UxeHVYSFJjZEZ4MFhIUmNkSE5sWTNScGIyNHpTV1I0S3lzN1hHNWNkRngwWEhSY2RIMGdaV3h6WlNCN1hHNWNkRngwWEhSY2RGeDBjMlZqZEdsdmJqTkpaSGdnUFNBd08xeHVYSFJjZEZ4MFhIUjlYRzVjZEZ4MFhIUmNkRnh1WEhSY2RGeDBYSFFrS0NjdWMyVmpkR2x2YmpOUVlXZHBibUYwYjNKQ2RYUjBiMjRuS1Z0elpXTjBhVzl1TTBsa2VGMHVZMnhwWTJzb0tUdGNibHgwWEhSY2RIMWNibHgwWEhSY2RHbG1LR1FnUFQwOUlDZHlKeWtnZTF4dVhHNWNkRngwWEhSY2RHbG1LSE5sWTNScGIyNHpTV1I0SUQ0Z01Da2dlMXh1WEhSY2RGeDBYSFJjZEhObFkzUnBiMjR6U1dSNExTMDdYRzVjZEZ4MFhIUmNkSDBnWld4elpTQjdYRzVjZEZ4MFhIUmNkRngwYzJWamRHbHZiak5KWkhnZ1BTQnpaV04wYVc5dU0xQmhaMmx1WVhScGIyNU1aVzVuZEdnZ0xTQXhPMXh1WEhSY2RGeDBYSFI5WEc1Y2RGeDBYSFJjZEZ4dVhIUmNkRngwWEhRa0tDY3VjMlZqZEdsdmJqTlFZV2RwYm1GMGIzSkNkWFIwYjI0bktWdHpaV04wYVc5dU0wbGtlRjB1WTJ4cFkyc29LVHRjYmx4MFhIUmNkSDFjYmx4MFhIUjlYRzVjZEgxY2JseHVMeThnU1U1SlZFbEJWRVVnUms5U0lGTlhTVkJGSUVSRlZFVkRWRWxQVGlCUFRpQlRSVU5VU1U5T1V5QXpJRUZPUkNBMElFVllRMFZRVkNCSlRpQkJSRTFKVGlCUVVrVldTVVZYTGlCY1hGeGNYRzVjYmx4MGFXWW9JU1FvYkc5allYUnBiMjRwTG1GMGRISW9KMmh5WldZbktTNXBibU5zZFdSbGN5Z25hVzVrWlhndWNHaHdKeWtwSUh0Y2JseDBYSFJrWlhSbFkzUnpkMmx3WlNnbmMyVmpkR2x2YmpRbkxDQnpkMmx3WlVOdmJuUnliMnhzWlhJcE8xeHVYSFJjZEdSbGRHVmpkSE4zYVhCbEtDZHpaV04wYVc5dU15Y3NJSE4zYVhCbFEyOXVkSEp2Ykd4bGNpazdYRzVjZEgxY2JuMHBPeUpkZlE9PVxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJGVDVPUnNcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9mYWtlXzRiMTdjZmE2LmpzXCIsXCIvXCIpIl19
