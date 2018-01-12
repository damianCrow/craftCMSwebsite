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

$(document).ready(function () {
	// FIXES ISSUE WITH HIEGHT ON IPHONE X. onepage_scroll PLUGIN DOES NOT WORK WITH 'height: 100%;' \\
	$('#scrollerWrapper').css({ 'height': $('body').height() + 'px' });

	if (window.innerWidth < 800) {
		// DELETE VIDEO ON MOBILE \\
		$('#video').remove();
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
			$('section.active').find('.tint').addClass('removeTint');

			$('.section.active').find('.backgroundWrapper').addClass('scaleBackground').on('animationend webkitAnimationEnd', function (es) {
				$('section.active').find('.tint').removeClass('removeTint');
			});

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
			intervalManager(true, $(e.currentTarget).closest('section').attr('id'), 10000);
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
				$('.subSection.open').find('p.fadeIn').on('transitionend webkitTransitionEnd oTransitionEnd', function (es) {
					$('.subSection.open').find('.tint').addClass('addTint').removeClass('removeTint');
				});
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

			if ($('#video').length && $('#video').get(0).readyState === 4) {
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

				if ($('#video').length && $('#video').css('display') !== 'none') {
					$('#video').get(0).play();
				}

				$('.arrow').addClass('pulsate');
			} else {
				$('#headerShape, #footer').removeClass('moveOffScreen');
				$('.arrow').removeClass('pulsate');

				if ($('#video').length) {
					$('#video').get(0).pause();
				}
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
					intervalManager(true, 'section3', 10000);
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
					intervalManager(true, 'section4', 10000);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZha2VfNzZiNmY5ZDIuanMiXSwibmFtZXMiOlsidGltZSIsInNlY3Rpb24zSWR4Iiwic2VjdGlvbjRJZHgiLCJtYXN0ZXJPYmoiLCJzZWN0aW9uMkN1cnJlbnRJZHgiLCJzZWN0aW9uMUN1cnJlbnRJZHgiLCJzZWN0aW9uMyIsImF1dG9tYXRlIiwiaXNBdXRvbWF0ZWQiLCJzZWN0aW9uNCIsImJhc2tldGJhbGwiLCJsb29wQW1vdW50IiwiZm9vdGJhbGwiLCJ0ZW5uaXMiLCJiYXNlYmFsbCIsImZhbiIsIiQiLCJkb2N1bWVudCIsInJlYWR5IiwiY3NzIiwiaGVpZ2h0Iiwid2luZG93IiwiaW5uZXJXaWR0aCIsInJlbW92ZSIsImZldGNoIiwidGhlbiIsInJlc3BvbnNlIiwianNvbiIsInNwcml0ZU9iaiIsIklkbGVGcmFtZSIsImZpbHRlckJ5VmFsdWUiLCJmcmFtZXMiLCJhbmltYXRpb25BcnJheSIsImFuaW1hdG9yU2V0dXAiLCJpbWFnZUNvbnRyb2xlciIsInNldEludGVydmFsIiwiYXJyYXkiLCJzdHJpbmciLCJmaWx0ZXIiLCJvIiwidG9Mb3dlckNhc2UiLCJpbmNsdWRlcyIsImxhc3RUaW1lIiwidmVuZG9ycyIsIngiLCJsZW5ndGgiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJjYW5jZWxBbmltYXRpb25GcmFtZSIsImNhbGxiYWNrIiwiZWxlbWVudCIsImN1cnJUaW1lIiwiRGF0ZSIsImdldFRpbWUiLCJ0aW1lVG9DYWxsIiwiTWF0aCIsIm1heCIsImlkIiwic2V0VGltZW91dCIsImNsZWFyVGltZW91dCIsImFuaW1hdG9yIiwiYW5pbWF0aW9uT2JqIiwiZGFuY2luZ0ljb24iLCJzcHJpdGVJbWFnZSIsImNhbnZhcyIsImdhbWVMb29wIiwiYWRkQ2xhc3MiLCJsb29wSWQiLCJ1cGRhdGUiLCJyZW5kZXIiLCJzcHJpdGUiLCJvcHRpb25zIiwidGhhdCIsImZyYW1lSW5kZXgiLCJ0aWNrQ291bnQiLCJsb29wQ291bnQiLCJ0aWNrc1BlckZyYW1lIiwibnVtYmVyT2ZGcmFtZXMiLCJjb250ZXh0Iiwid2lkdGgiLCJpbWFnZSIsImxvb3BzIiwiY2xlYXJSZWN0IiwiZHJhd0ltYWdlIiwiZnJhbWUiLCJ5IiwiZ2V0RWxlbWVudEJ5SWQiLCJJbWFnZSIsImdldENvbnRleHQiLCJhZGRFdmVudExpc3RlbmVyIiwic3JjIiwicGFnZUxvYWRlciIsImluZGV4IiwicmVtb3ZlQ2xhc3MiLCJmaW5kIiwib24iLCJlcyIsImdldCIsImNsaWNrIiwiaW5pdGlhbGl6ZVNlY3Rpb24iLCJzZWN0aW9uTnVtYmVyIiwiaWR4Iiwic2libGluZ3MiLCJtYXAiLCJpeCIsImVsZSIsIm9wYWNpdHkiLCJpZHhPYmoiLCJyZWxldmFudEFuaW1hdGlvbiIsImhhbmRsZVBhbmluYXRpb25CdXR0b25DbGljayIsImUiLCJwYXJzZUludCIsInRhcmdldCIsImF0dHIiLCJzZWN0aW9uSWQiLCJjbG9zZXN0IiwicmVsZXZhbnREYXRhQXJyYXkiLCJjdXJyZW50VGFyZ2V0IiwiaW50ZXJ2YWxNYW5hZ2VyIiwiaGFzQ2xhc3MiLCJsb2NhdGlvbiIsIm9uZXBhZ2Vfc2Nyb2xsIiwic2VjdGlvbkNvbnRhaW5lciIsImVhc2luZyIsImFuaW1hdGlvblRpbWUiLCJwYWdpbmF0aW9uIiwidXBkYXRlVVJMIiwiYmVmb3JlTW92ZSIsImFmdGVyTW92ZSIsImxvb3AiLCJrZXlib2FyZCIsInJlc3BvbnNpdmVGYWxsYmFjayIsImRpcmVjdGlvbiIsIm1vdmVUbyIsImN1cnJlbnRTZWN0aW9uIiwic2VjdGlvbiIsIm9mZnNldCIsInRvcCIsIm1vdmVEb3duIiwiaGlkZUxvYWRpbmdBbmltYXRpb24iLCJyZWFkeVN0YXRlIiwiZmxhZyIsInN3aXBlQ29udHJvbGxlciIsImNsZWFySW50ZXJ2YWwiLCJpbm5lckhlaWdodCIsInBsYXkiLCJwYXVzZSIsIm1hdGNoTWVkaWEiLCJtYXRjaGVzIiwicGFnZUlkeCIsImJ1cmdlciIsImNsYXNzTGlzdCIsImNvbnRhaW5zIiwibmF2IiwiYm9keSIsInN0eWxlIiwicG9zaXRpb24iLCJzdG9wUHJvcGFnYXRpb24iLCJuYXZDb250cm9sIiwiYWRkIiwiZGV0ZWN0c3dpcGUiLCJlbCIsImZ1bmMiLCJzd2lwZV9kZXQiLCJzWCIsInNZIiwiZVgiLCJlWSIsIm1pbl94IiwibWF4X3giLCJtaW5feSIsIm1heF95IiwiZGlyZWMiLCJ0IiwidG91Y2hlcyIsInNjcmVlblgiLCJzY3JlZW5ZIiwicHJldmVudERlZmF1bHQiLCJkIiwic2VjdGlvbjRQYWdpbmF0aW9uTGVuZ3RoIiwic2VjdGlvbjNQYWdpbmF0aW9uTGVuZ3RoIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsSUFBTUEsT0FBTyxHQUFiO0FBQ0EsSUFBSUMsY0FBYyxDQUFsQjtBQUNBLElBQUlDLGNBQWMsQ0FBbEI7O0FBRUEsSUFBTUMsWUFBWTtBQUNqQkMscUJBQW9CLENBREg7QUFFakJDLHFCQUFvQixDQUZIO0FBR2pCQyxXQUFVO0FBQ1RDLFlBQVUsRUFERDtBQUVUQyxlQUFhO0FBRkosRUFITztBQU9qQkMsV0FBVTtBQUNURixZQUFVLEVBREQ7QUFFVEMsZUFBYTtBQUZKLEVBUE87QUFXakJFLGFBQVksRUFBQ0MsWUFBWSxDQUFiLEVBWEs7QUFZakJDLFdBQVUsRUFBQ0QsWUFBWSxDQUFiLEVBWk87QUFhakJFLFNBQVEsRUFBQ0YsWUFBWSxDQUFiLEVBYlM7QUFjakJHLFdBQVUsRUFBQ0gsWUFBWSxDQUFiLEVBZE87QUFlakJJLE1BQUssRUFBQ0osWUFBWSxDQUFiO0FBZlksQ0FBbEI7O0FBa0JBSyxFQUFFQyxRQUFGLEVBQVlDLEtBQVosQ0FBa0IsWUFBTTtBQUN4QjtBQUNDRixHQUFFLGtCQUFGLEVBQXNCRyxHQUF0QixDQUEwQixFQUFDLFVBQWFILEVBQUUsTUFBRixFQUFVSSxNQUFWLEVBQWIsT0FBRCxFQUExQjs7QUFFQSxLQUFHQyxPQUFPQyxVQUFQLEdBQW9CLEdBQXZCLEVBQTRCO0FBQzdCO0FBQ0VOLElBQUUsUUFBRixFQUFZTyxNQUFaO0FBQ0Y7QUFDRUMsUUFBTSx1Q0FBTixFQUErQ0MsSUFB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QUNELE9BQUdnRixNQUFNLEdBQVQsRUFBYzs7QUFFYixRQUFHaEwsY0FBYyxDQUFqQixFQUFvQjtBQUNuQkE7QUFDQSxLQUZELE1BRU87QUFDTkEsbUJBQWNrTCwyQkFBMkIsQ0FBekM7QUFDQTs7QUFFRG5LLE1BQUUsMEJBQUYsRUFBOEJmLFdBQTlCLEVBQTJDZ0csS0FBM0M7QUFDQTtBQUNEO0FBQ0QsRUFwREQ7O0FBc0REOztBQUVDLEtBQUcsQ0FBQ2pGLEVBQUV1RyxRQUFGLEVBQVlQLElBQVosQ0FBaUIsTUFBakIsRUFBeUJ2RSxRQUF6QixDQUFrQyxXQUFsQyxDQUFKLEVBQW9EO0FBQ25Ec0gsY0FBWSxVQUFaLEVBQXdCbEIsZUFBeEI7QUFDQWtCLGNBQVksVUFBWixFQUF3QmxCLGVBQXhCO0FBQ0E7QUFDRCxDQTVuQkQiLCJmaWxlIjoiZmFrZV83NmI2ZjlkMi5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHRpbWUgPSA3NTA7XG5sZXQgc2VjdGlvbjNJZHggPSAwO1xubGV0IHNlY3Rpb240SWR4ID0gMDtcblxuY29uc3QgbWFzdGVyT2JqID0ge1xuXHRzZWN0aW9uMkN1cnJlbnRJZHg6IDAsIFxuXHRzZWN0aW9uMUN1cnJlbnRJZHg6IDAsXG5cdHNlY3Rpb24zOiB7XG5cdFx0YXV0b21hdGU6ICcnLFxuXHRcdGlzQXV0b21hdGVkOiBmYWxzZVxuXHR9LFxuXHRzZWN0aW9uNDoge1xuXHRcdGF1dG9tYXRlOiAnJyxcblx0XHRpc0F1dG9tYXRlZDogZmFsc2Vcblx0fSxcblx0YmFza2V0YmFsbDoge2xvb3BBbW91bnQ6IDF9LFxuXHRmb290YmFsbDoge2xvb3BBbW91bnQ6IDF9LFxuXHR0ZW5uaXM6IHtsb29wQW1vdW50OiAxfSxcblx0YmFzZWJhbGw6IHtsb29wQW1vdW50OiAxfSxcblx0ZmFuOiB7bG9vcEFtb3VudDogMX1cbn07XG5cbiQoZG9jdW1lbnQpLnJlYWR5KCgpID0+IHtcbi8vIEZJWEVTIElTU1VFIFdJVEggSElFR0hUIE9OIElQSE9ORSBYLiBvbmVwYWdlX3Njcm9sbCBQTFVHSU4gRE9FUyBOT1QgV09SSyBXSVRIICdoZWlnaHQ6IDEwMCU7JyBcXFxcXG5cdCQoJyNzY3JvbGxlcldyYXBwZXInKS5jc3MoeydoZWlnaHQnOiBgJHskKCdib2R5JykuaGVpZ2h0KCl9cHhgfSk7XG5cblx0aWYod2luZG93LmlubmVyV2lkdGggPCA4MDApIHtcbi8vIERFTEVURSBWSURFTyBPTiBNT0JJTEUgXFxcXFxuXHRcdCQoJyN2aWRlbycpLnJlbW92ZSgpO1xuLy8gSUYgVEhFIFdJTkRPVyBJUyBTTUFMTEVSIFRIQVQgODAwUFggRkVUQ0ggVEhFIEpTT04gRk9SIFRIRSBJQ09OIEFOSU1BVElPTiBBTkQgQVRBQ0ggVEhFIEFOSU1BVElPTlMgU0VQRVJBVEVMWSBUTyBtYXN0ZXJPYmogXFxcXFxuXHRcdGZldGNoKCdhc3NldHMvanMvRmFudGFzdGVjX1Nwcml0ZV9TaGVldC5qc29uJykudGhlbihmdW5jdGlvbihyZXNwb25zZSkgeyBcblx0XHRcdHJldHVybiByZXNwb25zZS5qc29uKCk7XG5cdFx0fSkudGhlbihmdW5jdGlvbihzcHJpdGVPYmopIHtcblx0XHRcdGNvbnN0IElkbGVGcmFtZSA9IGZpbHRlckJ5VmFsdWUoc3ByaXRlT2JqLmZyYW1lcywgJ2lkbGUnKTtcblx0XHRcdG1hc3Rlck9iai5mb290YmFsbC5hbmltYXRpb25BcnJheSA9IFsuLi5JZGxlRnJhbWUsIC4uLmZpbHRlckJ5VmFsdWUoc3ByaXRlT2JqLmZyYW1lcywgJ2Zvb3RiYWxsJyldO1xuXHRcdFx0bWFzdGVyT2JqLnRlbm5pcy5hbmltYXRpb25BcnJheSA9IFsuLi5JZGxlRnJhbWUsIC4uLmZpbHRlckJ5VmFsdWUoc3ByaXRlT2JqLmZyYW1lcywgJ3Rlbm5pcycpXTtcblx0XHRcdG1hc3Rlck9iai5iYXNlYmFsbC5hbmltYXRpb25BcnJheSA9IFsuLi5JZGxlRnJhbWUsIC4uLmZpbHRlckJ5VmFsdWUoc3ByaXRlT2JqLmZyYW1lcywgJ2Jhc2ViYWxsJyldO1xuXHRcdFx0bWFzdGVyT2JqLmJhc2tldGJhbGwuYW5pbWF0aW9uQXJyYXkgPSBbLi4uSWRsZUZyYW1lLCAuLi5maWx0ZXJCeVZhbHVlKHNwcml0ZU9iai5mcmFtZXMsICdiYXNrZXQnKV07XG5cdFx0XHRtYXN0ZXJPYmouZmFuLmFuaW1hdGlvbkFycmF5ID0gWy4uLklkbGVGcmFtZSwgLi4uZmlsdGVyQnlWYWx1ZShzcHJpdGVPYmouZnJhbWVzLCAnZmFuJyldO1xuLy8gQ0FMTCBBTklNQVRPUiBTRVRVUCBGVU5DVElPTiBBTkQgU1RBUlQgVEhFIElNQUdFIFNMSURFU0hPVyBGT1IgU0VDVElPTiAxIChIT01FUEFHRSkgXFxcXFx0XHRcdFxuXHRcdFx0YW5pbWF0b3JTZXR1cCgpO1xuXHRcdFx0aW1hZ2VDb250cm9sZXIobWFzdGVyT2JqLCAxKTtcbi8vIENBTEwgVEhFIGltYWdlQ29udHJvbGVyIEZVTkNUSU9OIEVWRVJZIDUgU0VDT05EUyBUTyBDSEFOR0UgVEhFIElNQUdFIEZPUiBTRUNUSU9OIDEgKEhPTUVQQUdFKSBcXFxcXG5cdFx0XHRzZXRJbnRlcnZhbCgoKSA9PiB7XG5cdFx0XHRcdGltYWdlQ29udHJvbGVyKG1hc3Rlck9iaiwgMSk7XG5cdFx0XHR9LCA1MDAwKTtcblx0XHR9KTtcblx0fVxuLy8gRlVOQ1RJT04gVE8gU0VQRVJBVEUgVEhFIEFOSU1BVElPTiBGUkFNRVMgQlkgTkFNRSBcXFxcXG5cdGNvbnN0IGZpbHRlckJ5VmFsdWUgPSAoYXJyYXksIHN0cmluZykgPT4ge1xuICAgIHJldHVybiBhcnJheS5maWx0ZXIobyA9PiB0eXBlb2Ygb1snZmlsZW5hbWUnXSA9PT0gJ3N0cmluZycgJiYgb1snZmlsZW5hbWUnXS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHN0cmluZy50b0xvd2VyQ2FzZSgpKSk7XG5cdH1cbi8vIEdFTkVSSUMgU0VUVVAgRlVOQ1RJT04gRk9SIEFERElORyBWRU5ET1IgUFJFRklYRVMgVE8gcmVxdWVzdEFuaW1hdGlvbkZyYW1lIFxcXFxcblx0Y29uc3QgYW5pbWF0b3JTZXR1cCA9ICgpID0+IHtcblx0XHRcdFxuICAgIHZhciBsYXN0VGltZSA9IDA7XG4gICAgdmFyIHZlbmRvcnMgPSBbJ21zJywgJ21veicsICd3ZWJraXQnLCAnbyddO1xuICAgIGZvcih2YXIgeCA9IDA7IHggPCB2ZW5kb3JzLmxlbmd0aCAmJiAhd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZTsgKyt4KSB7XG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gd2luZG93W3ZlbmRvcnNbeF0rJ1JlcXVlc3RBbmltYXRpb25GcmFtZSddO1xuICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gd2luZG93W3ZlbmRvcnNbeF0rJ0NhbmNlbEFuaW1hdGlvbkZyYW1lJ10gfHwgd2luZG93W3ZlbmRvcnNbeF0rJ0NhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZSddO1xuICAgIH1cbiBcbiAgICBpZiAoIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpXG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24oY2FsbGJhY2ssIGVsZW1lbnQpIHtcbiAgICAgICAgdmFyIGN1cnJUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgIHZhciB0aW1lVG9DYWxsID0gTWF0aC5tYXgoMCwgMTYgLSAoY3VyclRpbWUgLSBsYXN0VGltZSkpO1xuICAgICAgICB2YXIgaWQgPSB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHsgY2FsbGJhY2soY3VyclRpbWUgKyB0aW1lVG9DYWxsKTsgfSwgXG4gICAgICAgICAgdGltZVRvQ2FsbCk7XG4gICAgICAgIGxhc3RUaW1lID0gY3VyclRpbWUgKyB0aW1lVG9DYWxsO1xuICAgICAgICByZXR1cm4gaWQ7XG4gICAgICB9O1xuIFxuICAgIGlmICghd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKVxuICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uKGlkKSB7XG4gICAgICBjbGVhclRpbWVvdXQoaWQpO1xuICAgIH07XG5cdH1cblxuXHRjb25zdCBhbmltYXRvciA9IChhbmltYXRpb25PYmopID0+IHtcblx0XHRcdFx0XHRcdFxuXHRcdHZhciBkYW5jaW5nSWNvbixcblx0XHRcdHNwcml0ZUltYWdlLFxuXHRcdFx0Y2FudmFzO1x0XHRcdFx0XHRcbi8vIEZVTkNUSU9OIFRPIFBBU1MgVE8gcmVxdWVzdEFuaW1hdGlvbkZyYW1lIFxcXFxcblx0XHRmdW5jdGlvbiBnYW1lTG9vcCAoKSB7XG5cdFx0ICAkKCcjbG9hZGluZycpLmFkZENsYXNzKCdoaWRkZW4nKTtcblx0XHQgIGFuaW1hdGlvbk9iai5sb29wSWQgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGdhbWVMb29wKTtcblx0XHQgIGRhbmNpbmdJY29uLnVwZGF0ZSgpO1xuXHRcdCAgZGFuY2luZ0ljb24ucmVuZGVyKCk7XG5cdFx0fVxuXHRcdFxuXHRcdGZ1bmN0aW9uIHNwcml0ZSAob3B0aW9ucykge1xuXHRcdFxuXHRcdFx0dmFyIHRoYXQgPSB7fSxcblx0XHRcdFx0ZnJhbWVJbmRleCA9IDAsXG5cdFx0XHRcdHRpY2tDb3VudCA9IDAsXG5cdFx0XHRcdGxvb3BDb3VudCA9IDAsXG5cdFx0XHRcdHRpY2tzUGVyRnJhbWUgPSBvcHRpb25zLnRpY2tzUGVyRnJhbWUgfHwgMCxcblx0XHRcdFx0bnVtYmVyT2ZGcmFtZXMgPSBvcHRpb25zLm51bWJlck9mRnJhbWVzIHx8IDE7XG5cdFx0XHRcblx0XHRcdHRoYXQuY29udGV4dCA9IG9wdGlvbnMuY29udGV4dDtcblx0XHRcdHRoYXQud2lkdGggPSBvcHRpb25zLndpZHRoO1xuXHRcdFx0dGhhdC5oZWlnaHQgPSBvcHRpb25zLmhlaWdodDtcblx0XHRcdHRoYXQuaW1hZ2UgPSBvcHRpb25zLmltYWdlO1xuXHRcdFx0dGhhdC5sb29wcyA9IG9wdGlvbnMubG9vcHM7XG5cdFx0XHRcblx0XHRcdHRoYXQudXBkYXRlID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHRpY2tDb3VudCArPSAxO1xuXG4gICAgICAgIGlmICh0aWNrQ291bnQgPiB0aWNrc1BlckZyYW1lKSB7XG5cblx0XHRcdFx0XHR0aWNrQ291bnQgPSAwO1xuICAgICAgICAgIC8vIElmIHRoZSBjdXJyZW50IGZyYW1lIGluZGV4IGlzIGluIHJhbmdlXG4gICAgICAgICAgaWYgKGZyYW1lSW5kZXggPCBudW1iZXJPZkZyYW1lcyAtIDEpIHtcdFxuICAgICAgICAgIC8vIEdvIHRvIHRoZSBuZXh0IGZyYW1lXG4gICAgICAgICAgICBmcmFtZUluZGV4ICs9IDE7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgXHRcdGxvb3BDb3VudCsrXG4gICAgICAgICAgICBmcmFtZUluZGV4ID0gMDtcblxuICAgICAgICAgICAgaWYobG9vcENvdW50ID09PSB0aGF0Lmxvb3BzKSB7XG4gICAgICAgICAgICBcdHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZShhbmltYXRpb25PYmoubG9vcElkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cdCAgICAgIH1cblx0ICAgIH1cblx0XHRcdFxuXHRcdFx0dGhhdC5yZW5kZXIgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcblx0XHRcdCAgLy8gQ2xlYXIgdGhlIGNhbnZhc1xuXHRcdFx0ICB0aGF0LmNvbnRleHQuY2xlYXJSZWN0KDAsIDAsIHRoYXQud2lkdGgsIHRoYXQuaGVpZ2h0KTtcblx0XHRcdCAgXG5cdFx0XHQgIHRoYXQuY29udGV4dC5kcmF3SW1hZ2UoXG5cdFx0XHQgICAgdGhhdC5pbWFnZSxcblx0XHRcdCAgICBhbmltYXRpb25PYmouYW5pbWF0aW9uQXJyYXlbZnJhbWVJbmRleF0uZnJhbWUueCxcblx0XHRcdCAgICBhbmltYXRpb25PYmouYW5pbWF0aW9uQXJyYXlbZnJhbWVJbmRleF0uZnJhbWUueSxcblx0XHRcdCAgICAyMDAsXG5cdFx0XHQgICAgMTc1LFxuXHRcdFx0ICAgIDAsXG5cdFx0XHQgICAgMCxcblx0XHRcdCAgICB3aW5kb3cuaW5uZXJXaWR0aCAvIDMuODQ2LFxuXHRcdFx0ICAgIHdpbmRvdy5pbm5lcldpZHRoIC8gNC4xKVxuXHRcdFx0fTtcblx0XHRcdFxuXHRcdFx0cmV0dXJuIHRoYXQ7XG5cdFx0fVxuXHRcdFxuXHRcdC8vIEdldCBjYW52YXNcblx0XHRjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJyk7XG5cdFx0Y2FudmFzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGggLyAzLjg0Njtcblx0XHRjYW52YXMuaGVpZ2h0ID0gd2luZG93LmlubmVyV2lkdGggLyAyLjI7XG5cdFx0XG5cdFx0Ly8gQ3JlYXRlIHNwcml0ZSBzaGVldFxuXHRcdHNwcml0ZUltYWdlID0gbmV3IEltYWdlKCk7XHRcblx0XHRcblx0XHQvLyBDcmVhdGUgc3ByaXRlXG5cdFx0ZGFuY2luZ0ljb24gPSBzcHJpdGUoe1xuXHRcdFx0Y29udGV4dDogY2FudmFzLmdldENvbnRleHQoXCIyZFwiKSxcblx0XHRcdHdpZHRoOiA0MDQwLFxuXHRcdFx0aGVpZ2h0OiAxNzcwLFxuXHRcdFx0aW1hZ2U6IHNwcml0ZUltYWdlLFxuXHRcdFx0bnVtYmVyT2ZGcmFtZXM6IGFuaW1hdGlvbk9iai5hbmltYXRpb25BcnJheS5sZW5ndGgsXG5cdFx0XHR0aWNrc1BlckZyYW1lOiA0LFxuXHRcdFx0bG9vcHM6IGFuaW1hdGlvbk9iai5sb29wQW1vdW50XG5cdFx0fSk7XG5cdFx0XG5cdFx0Ly8gTG9hZCBzcHJpdGUgc2hlZXRcblx0XHRzcHJpdGVJbWFnZS5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBnYW1lTG9vcCk7XG5cdFx0c3ByaXRlSW1hZ2Uuc3JjID0gJ2Fzc2V0cy9pbWFnZXMvRmFudGFzdGVjX1Nwcml0ZV9TaGVldC5wbmcnO1xuXHR9IFxuXG4vLyBJTklUSUFMSVNFIEFORCBTRVRVUCBDVVJSRU5UIFBBR0UuIEVYRUNVVEUgVFJBTlNJVElPTlMgQU5EIFJFTU9WRSBUSU5UIElGIFJFTEVWQU5UIFxcXFxcblxuXHRjb25zdFx0cGFnZUxvYWRlciA9IChpbmRleCkgPT4ge1xuXHRcdGlmKGluZGV4ID09PSA1KSB7XG5cdFx0XHQkKCcudGludCcpLnJlbW92ZUNsYXNzKCdyZW1vdmVUaW50Jyk7XG5cdFx0XHQkKCcuYmFja2dyb3VuZFdyYXBwZXInKS5yZW1vdmVDbGFzcygnc2NhbGVCYWNrZ3JvdW5kJyk7XG5cdFx0XHQkKCcjc2VjdGlvbjUnKS5maW5kKCcuaGVhZGluZycpLmFkZENsYXNzKCdzaG93IGZhZGVJbicpO1xuXHRcdFx0JCgnLnN1YlNlY3Rpb24nKS5hZGRDbGFzcygnc2NhbGVCYWNrZ3JvdW5kJyk7XG5cdFx0XHQkKCcuc3ViU2VjdGlvbicpLmZpbmQoJy50aW50JykuYWRkQ2xhc3MoJ3JlbW92ZVRpbnQnKTtcblx0XHRcdCQoJyNzZWN0aW9uNScpLmZpbmQoJy50ZXh0V3JhcHBlcicpLmFkZENsYXNzKCdzaG93Jyk7XG5cdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0JCgnLnN1YlNlY3Rpb24gPiAudGV4dFdyYXBwZXInKS5maW5kKCcuaGVhZGluZycpLmFkZENsYXNzKCdmYWRlSW4nKTtcblx0XHRcdH0sIDEwMDApO1xuXHRcdH0gXG5cdFx0ZWxzZSB7XG5cdFx0XHQkKCcudGludCcpLnJlbW92ZUNsYXNzKCdyZW1vdmVUaW50Jyk7XG5cdFx0XHQkKCcuc3ViU2VjdGlvbicpLnJlbW92ZUNsYXNzKCdzY2FsZUJhY2tncm91bmQnKTtcblx0XHRcdCQoYC5iYWNrZ3JvdW5kV3JhcHBlcjpub3QoI3NlY3Rpb24ke2luZGV4fUJhY2tncm91bmQpYCkucmVtb3ZlQ2xhc3MoJ3NjYWxlQmFja2dyb3VuZCcpO1xuXHRcdFx0JChgc2VjdGlvbi5hY3RpdmVgKS5maW5kKCcudGludCcpLmFkZENsYXNzKCdyZW1vdmVUaW50Jyk7XG5cblx0XHRcdCQoYC5zZWN0aW9uLmFjdGl2ZWApLmZpbmQoYC5iYWNrZ3JvdW5kV3JhcHBlcmApLmFkZENsYXNzKCdzY2FsZUJhY2tncm91bmQnKS5vbignYW5pbWF0aW9uZW5kIHdlYmtpdEFuaW1hdGlvbkVuZCcsIChlcykgPT4ge1xuXHRcdFx0ICAkKGBzZWN0aW9uLmFjdGl2ZWApLmZpbmQoJy50aW50JykucmVtb3ZlQ2xhc3MoJ3JlbW92ZVRpbnQnKTtcblx0XHRcdH0pO1xuXG5cdFx0XHRpZigkKGAuc2VjdGlvbiR7aW5kZXh9UGFnaW5hdG9yQnV0dG9uYCkubGVuZ3RoICYmICQoYC5zZWN0aW9uJHtpbmRleH1QYWdpbmF0b3JCdXR0b24uYWN0aXZlYCkubGVuZ3RoIDwgMSkge1xuXHRcdFx0XHQkKGAuc2VjdGlvbiR7aW5kZXh9UGFnaW5hdG9yQnV0dG9uYCkuZ2V0KDApLmNsaWNrKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG4vLyBISURFIEFMTCBCRUNLR1JPVU5EUyBJTiBUSEUgU0VDVElPTiBFWENFUFQgVEhFIFNQRUNJRklFRCBJTkRFWCwgV0hJQ0ggSVMgU0NBTEVEIEFORCBTSE9XTi4gXFxcXFxuXG5cdGNvbnN0IGluaXRpYWxpemVTZWN0aW9uID0gKHNlY3Rpb25OdW1iZXIsIGlkeCkgPT4ge1xuXHRcdCQoYCNzZWN0aW9uJHtzZWN0aW9uTnVtYmVyfUJhY2tncm91bmQke2lkeH1gKS5zaWJsaW5ncygnLmJhY2tncm91bmRXcmFwcGVyJykubWFwKChpeCwgZWxlKSA9PiB7XG5cdFx0XHQkKGVsZSkuY3NzKHtvcGFjaXR5OiAwfSk7XG5cdFx0fSk7XG5cblx0XHQkKGAjc2VjdGlvbiR7c2VjdGlvbk51bWJlcn1CYWNrZ3JvdW5kJHtpZHh9YCkuY3NzKHtcblx0XHRcdCd0cmFuc2Zvcm0nOiAnc2NhbGUoMS4xKScsXG5cdFx0XHQnb3BhY2l0eSc6IDFcblx0XHR9KTtcblx0fTtcblxuLy8gQ0FMTCBpbml0aWFsaXplU2VjdGlvbiBPTiBTRUNUSU9OUyAxLCAzIEFORCA0LiBcXFxcXG5cdGluaXRpYWxpemVTZWN0aW9uKDEsIDApO1xuXHRpbml0aWFsaXplU2VjdGlvbigzLCAwKTtcblx0aW5pdGlhbGl6ZVNlY3Rpb24oNCwgMCk7XG5cbi8vIEJBQ0tHUk9VTkQgSU1BR0UgVFJBTlNJVElPTiBIQU5ETEVSLiBcXFxcXG5cblx0Y29uc3QgaW1hZ2VDb250cm9sZXIgPSAoaWR4T2JqLCBzZWN0aW9uTnVtYmVyKSA9PiB7XG5cdFx0bGV0IHJlbGV2YW50QW5pbWF0aW9uO1xuXG5cdFx0aWYoc2VjdGlvbk51bWJlciA9PT0gMSkge1xuXHRcdFx0c3dpdGNoKGlkeE9iai5zZWN0aW9uMUN1cnJlbnRJZHgpIHtcblx0XHRcdFx0Y2FzZSAwOlxuXHRcdFx0XHRcdHJlbGV2YW50QW5pbWF0aW9uID0gbWFzdGVyT2JqLmJhc2tldGJhbGw7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIDE6XG5cdFx0XHRcdFx0cmVsZXZhbnRBbmltYXRpb24gPSBtYXN0ZXJPYmouZm9vdGJhbGw7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIDI6XG5cdFx0XHRcdFx0cmVsZXZhbnRBbmltYXRpb24gPSBtYXN0ZXJPYmoudGVubmlzO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAzOlxuXHRcdFx0XHRcdHJlbGV2YW50QW5pbWF0aW9uID0gbWFzdGVyT2JqLmJhc2ViYWxsO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSA0OlxuXHRcdFx0XHRcdHJlbGV2YW50QW5pbWF0aW9uID0gbWFzdGVyT2JqLmZhbjtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0JChgI3NlY3Rpb24ke3NlY3Rpb25OdW1iZXJ9YCkuZmluZCgnLnRpbnQnKS5yZW1vdmVDbGFzcygncmVtb3ZlVGludCcpO1xuXHRcdCQoYCNzZWN0aW9uJHtzZWN0aW9uTnVtYmVyfUJhY2tncm91bmQke2lkeE9ialtgc2VjdGlvbiR7c2VjdGlvbk51bWJlcn1DdXJyZW50SWR4YF19YCkucmVtb3ZlQ2xhc3MoJ3NjYWxlQmFja2dyb3VuZCcpO1xuXHRcdGluaXRpYWxpemVTZWN0aW9uKHNlY3Rpb25OdW1iZXIsIGlkeE9ialtgc2VjdGlvbiR7c2VjdGlvbk51bWJlcn1DdXJyZW50SWR4YF0pO1xuXHRcdFxuXHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0aWYoc2VjdGlvbk51bWJlciA9PT0gMSkge1xuXHRcdFx0XHRhbmltYXRvcihyZWxldmFudEFuaW1hdGlvbik7XG5cdFx0XHR9XG5cblx0XHRcdCQoYCNzZWN0aW9uJHtzZWN0aW9uTnVtYmVyfWApLmZpbmQoYC5iYWNrZ3JvdW5kV3JhcHBlcmApLmFkZENsYXNzKCdzY2FsZUJhY2tncm91bmQnKTtcblx0XHRcdCQoYCNzZWN0aW9uJHtzZWN0aW9uTnVtYmVyfWApLmZpbmQoJy50aW50JykuYWRkQ2xhc3MoJ3JlbW92ZVRpbnQnKTtcblx0XHR9LCA1MDApO1xuXG5cdFx0aWYoaWR4T2JqW2BzZWN0aW9uJHtzZWN0aW9uTnVtYmVyfUN1cnJlbnRJZHhgXSA9PT0gJChgI3NlY3Rpb24ke3NlY3Rpb25OdW1iZXJ9YCkuZmluZChgLmJhY2tncm91bmRXcmFwcGVyYCkubGVuZ3RoIC0gMSkge1xuXHRcdFx0aWR4T2JqW2BzZWN0aW9uJHtzZWN0aW9uTnVtYmVyfUN1cnJlbnRJZHhgXSA9IDA7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlkeE9ialtgc2VjdGlvbiR7c2VjdGlvbk51bWJlcn1DdXJyZW50SWR4YF0gKz0gMTtcblx0XHR9XG5cdH1cbi8vIFNUQVJUIFNMSURFU0hPVyBPTiBTRUNUSU9OIDIgXFxcXFxuXHRpbWFnZUNvbnRyb2xlcihtYXN0ZXJPYmosIDIpO1xuXG4vLyBDSEFOR0UgU0VDVElPTiAyIEJBQ0tHUk9VTkQgSU1BR0UgRVZFUlkgMTUgU0VDT05EUyBcXFxcXG5cdHNldEludGVydmFsKCgpID0+IHtcblx0XHRpbWFnZUNvbnRyb2xlcihtYXN0ZXJPYmosIDIpO1xuXHR9LCAxNTAwMCk7XG5cbi8vIFBBR0lOQVRJT04gQlVUVE9OUyBDTElDSyBIQU5ETEVSIEZPUiBTRUNUSU9OUyAzIEFORCA0LiBcXFxcXG5cblx0Y29uc3QgaGFuZGxlUGFuaW5hdGlvbkJ1dHRvbkNsaWNrID0gKGUpID0+IHtcblxuXHRcdGNvbnN0IGlkeCA9IHBhcnNlSW50KCQoZS50YXJnZXQpLmF0dHIoJ2RhdGEtaW5kZXgnKSk7XG5cdFx0Y29uc3Qgc2VjdGlvbklkID0gJChlLnRhcmdldCkuY2xvc2VzdCgnc2VjdGlvbicpLmF0dHIoJ2lkJyk7XG5cdFx0bGV0IHJlbGV2YW50RGF0YUFycmF5O1xuXG5cdFx0aWYoc2VjdGlvbklkID09PSAnc2VjdGlvbjMnKSB7XG5cdFx0XHRzZWN0aW9uM0lkeCA9IGlkeDtcblx0XHR9XG5cblx0XHRpZihzZWN0aW9uSWQgPT09ICdzZWN0aW9uNCcpIHtcblx0XHRcdHNlY3Rpb240SWR4ID0gaWR4O1xuXHRcdH1cblxuXHRcdCQoYCMke3NlY3Rpb25JZH1gKS5maW5kKCcudGludCcpLnJlbW92ZUNsYXNzKCdyZW1vdmVUaW50Jyk7XG5cdFx0JChgIyR7c2VjdGlvbklkfWApLmZpbmQoJy50ZXh0V3JhcHBlcicpLnJlbW92ZUNsYXNzKCdzaG93Jyk7XG5cdFx0JChgIyR7c2VjdGlvbklkfWApLmZpbmQoYCN0ZXh0V3JhcHBlciR7aWR4fWApLmFkZENsYXNzKCdzaG93Jyk7XG5cdFx0JChgIyR7c2VjdGlvbklkfUJhY2tncm91bmQke2lkeH1gKS5yZW1vdmVDbGFzcygnc2NhbGVCYWNrZ3JvdW5kJyk7XG5cdFx0JChgLiR7c2VjdGlvbklkfVBhZ2luYXRvckJ1dHRvbmApLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblx0XHQkKGUudGFyZ2V0KS5hZGRDbGFzcygnYWN0aXZlJyk7XG5cblx0XHRpbml0aWFsaXplU2VjdGlvbihwYXJzZUludCgkKGAjJHtzZWN0aW9uSWR9YCkuYXR0cignZGF0YS1pbmRleCcpKSwgaWR4KTtcblxuXHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0cGFnZUxvYWRlcihwYXJzZUludCgkKGAjJHtzZWN0aW9uSWR9YCkuYXR0cignZGF0YS1pbmRleCcpKSk7XG5cdFx0fSwgNTAwKTtcblxuXHRcdGlmKHNlY3Rpb25JZCAhPT0gJ3NlY3Rpb24yJyl7XG5cdFx0XHQkKGAjJHtzZWN0aW9uSWR9YCkuZmluZCgnLmhlYWRpbmcsIHAnKS5hZGRDbGFzcygnZmFkZUluJyk7XG5cdFx0XHQkKGAjJHtzZWN0aW9uSWR9YCkub24oJ3RyYW5zaXRpb25lbmQgd2Via2l0VHJhbnNpdGlvbkVuZCBvVHJhbnNpdGlvbkVuZCcsIChlcykgPT4ge1xuXHQgICAgXHQkKGAjJHtzZWN0aW9uSWR9YCkuZmluZCgnLmhlYWRpbmcsIHAnKS5yZW1vdmVDbGFzcygnZmFkZUluJyk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH07XG5cbi8vIENMSUNLIExJU1RFTkVSIEZPUiBQQUdJTkFUSU9OIEJVVFRPTlMgT04gU0VDVElPTlMgMyBBTkQgNC4gXFxcXFxuXG5cdCQoJy5zZWN0aW9uM1BhZ2luYXRvckJ1dHRvbiwgLnNlY3Rpb240UGFnaW5hdG9yQnV0dG9uJykuY2xpY2soKGUpID0+IHtcblx0XHRcblx0XHRpZihtYXN0ZXJPYmpbJChlLmN1cnJlbnRUYXJnZXQpLmNsb3Nlc3QoJ3NlY3Rpb24nKS5hdHRyKCdpZCcpXS5pc0F1dG9tYXRlZCkge1xuLy8gSUYgVEhFUkUgSVMgQSBSSU5OSU5HIElOVEVSVkFMIE9OIFRIRSBSRUxFVkFOVCBTRUNUSU9OIENMRUFSIElUIFxcXFxcblx0XHRcdGludGVydmFsTWFuYWdlcihmYWxzZSwgJChlLmN1cnJlbnRUYXJnZXQpLmNsb3Nlc3QoJ3NlY3Rpb24nKS5hdHRyKCdpZCcpKTtcbi8vIFNFVCBBIE5FVyBJTlRFUlZBTCBPRiA3IFNFQ09ORFMgT04gVEhFIFNFQ1RJT04gXFxcXFxuXHRcdFx0aW50ZXJ2YWxNYW5hZ2VyKHRydWUsICQoZS5jdXJyZW50VGFyZ2V0KS5jbG9zZXN0KCdzZWN0aW9uJykuYXR0cignaWQnKSwgMTAwMDApO1xuXHRcdH1cbi8vIENBTEwgVEhFIENMSUNLIEhBTkRMRVIgRlVOQ1RJT04gQU5EIFBBU1MgSVQgVEhFIEVWRU5UIElGIFRBUkdFVCBJUyBOT1QgQUxSRUFEWSBBQ1RJVkUgXFxcXFxuXHRcdGlmKCEkKGUuY3VycmVudFRhcmdldCkuaGFzQ2xhc3MoJ2FjdGl2ZScpKSB7XG5cdFx0XHRoYW5kbGVQYW5pbmF0aW9uQnV0dG9uQ2xpY2soZSk7XG5cdFx0fVxuXHR9KTtcblxuLy8gSU5JVElBTElaRSBPTkVQQUdFU0NST0xMIElGIE5PVCBJTiBDTVMgUFJFVklFVy4gXFxcXFxuXG5cdGlmKCEkKGxvY2F0aW9uKS5hdHRyKCdocmVmJykuaW5jbHVkZXMoJ2luZGV4LnBocCcpKSB7XG5cdFx0JCgnI3Njcm9sbGVyV3JhcHBlcicpLm9uZXBhZ2Vfc2Nyb2xsKHtcblx0XHRcdHNlY3Rpb25Db250YWluZXI6IFwic2VjdGlvblwiLCAgICBcblx0XHRcdGVhc2luZzogXCJlYXNlLW91dFwiLCAgICAgICAgICAgICAgICAgXG5cdFx0XHRhbmltYXRpb25UaW1lOiB0aW1lLCAgICAgICAgICAgIFxuXHRcdFx0cGFnaW5hdGlvbjogdHJ1ZSwgICAgICAgICAgICAgICBcblx0XHRcdHVwZGF0ZVVSTDogdHJ1ZSwgICAgICAgICAgICAgICBcblx0XHRcdGJlZm9yZU1vdmU6IChpbmRleCkgPT4ge30sIFxuXHRcdFx0YWZ0ZXJNb3ZlOiAoaW5kZXgpID0+IHtcbi8vIElOSVRJQUxJWkUgVEhFIENVUlJFTlQgUEFHRS4gXFxcXFxuXG5cdFx0XHRcdHBhZ2VMb2FkZXIoaW5kZXgpO1xuXHRcdFx0fSwgIFxuXHRcdFx0bG9vcDogZmFsc2UsICAgICAgICAgICAgICAgICAgICBcblx0XHRcdGtleWJvYXJkOiB0cnVlLCAgICAgICAgICAgICAgICAgXG5cdFx0XHRyZXNwb25zaXZlRmFsbGJhY2s6IGZhbHNlLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXHRcdFx0ZGlyZWN0aW9uOiBcInZlcnRpY2FsXCIgICAgICAgICAgXG5cdFx0fSk7XG5cblx0XHQkKCcjc2Nyb2xsZXJXcmFwcGVyJykubW92ZVRvKDEpO1xuXHR9XG5cbi8vIENPTlRST0wgQ0xJQ0tTIE9OIFdPUksgV0lUSCBVUyBTRUNUSU9OIChTRUNUSU9ONSkuIFxcXFxcblxuXHQkKCcuY2xpY2thYmxlJykuY2xpY2soKGUpID0+IHtcblx0XHRsZXQgY3VycmVudFNlY3Rpb24gPSAkKGUudGFyZ2V0KS5jbG9zZXN0KCQoJy5zdWJTZWN0aW9uJykpO1xuXG5cdFx0aWYoY3VycmVudFNlY3Rpb24uaGFzQ2xhc3MoJ29wZW4nKSkge1xuXHRcdFx0Y3VycmVudFNlY3Rpb24ucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcblx0XHRcdGN1cnJlbnRTZWN0aW9uLmZpbmQoJy5idXR0b24sIHAnKS5yZW1vdmVDbGFzcygnZmFkZUluJyk7XG5cdFx0XHRjdXJyZW50U2VjdGlvbi5zaWJsaW5ncygnLnN1YlNlY3Rpb24nKS5tYXAoKGlkeCwgc2VjdGlvbikgPT4ge1xuXHRcdFx0XHQkKHNlY3Rpb24pLnJlbW92ZUNsYXNzKCdjbG9zZWQnKTtcblx0XHRcdFx0JChzZWN0aW9uKS5maW5kKCcudGludCcpLnJlbW92ZUNsYXNzKCdhZGRUaW50JykuYWRkQ2xhc3MoJ3JlbW92ZVRpbnQnKTtcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjdXJyZW50U2VjdGlvbi5yZW1vdmVDbGFzcygnY2xvc2VkJykuYWRkQ2xhc3MoJ29wZW4nKTtcblx0XHRcdGN1cnJlbnRTZWN0aW9uLm9uKCd0cmFuc2l0aW9uZW5kIHdlYmtpdFRyYW5zaXRpb25FbmQgb1RyYW5zaXRpb25FbmQnLCAoZXMpID0+IHtcblx0ICAgIFx0JCgnLnN1YlNlY3Rpb24ub3BlbicpLmZpbmQoJy5idXR0b24sIHAnKS5hZGRDbGFzcygnZmFkZUluJyk7XG5cdCAgICBcdCQoJy5zdWJTZWN0aW9uLm9wZW4nKS5maW5kKCdwLmZhZGVJbicpLm9uKCd0cmFuc2l0aW9uZW5kIHdlYmtpdFRyYW5zaXRpb25FbmQgb1RyYW5zaXRpb25FbmQnLCAoZXMpID0+IHtcblx0XHRcdFx0ICAkKCcuc3ViU2VjdGlvbi5vcGVuJykuZmluZCgnLnRpbnQnKS5hZGRDbGFzcygnYWRkVGludCcpLnJlbW92ZUNsYXNzKCdyZW1vdmVUaW50Jyk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0XHRjdXJyZW50U2VjdGlvbi5zaWJsaW5ncygnLnN1YlNlY3Rpb24nKS5tYXAoKGlkeCwgc2VjdGlvbikgPT4ge1xuXHRcdFx0XHQkKHNlY3Rpb24pLnJlbW92ZUNsYXNzKCdvcGVuJykuYWRkQ2xhc3MoJ2Nsb3NlZCcpO1xuXHRcdFx0XHQkKHNlY3Rpb24pLmZpbmQoJy50aW50JykucmVtb3ZlQ2xhc3MoJ3JlbW92ZVRpbnQnKS5hZGRDbGFzcygnYWRkVGludCcpO1xuXHRcdFx0XHQkKHNlY3Rpb24pLmZpbmQoJy5idXR0b24sIHAnKS5yZW1vdmVDbGFzcygnZmFkZUluJyk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0Y3VycmVudFNlY3Rpb24uZmluZCgnLnRpbnQnKS5yZW1vdmVDbGFzcygnYWRkVGludCcpLmFkZENsYXNzKCdyZW1vdmVUaW50Jyk7XG5cdH0pO1xuXG4vLyBDT05UUk9MIEZPT1RFUiBBUlJPVyBDTElDS1MuIFxcXFxcblxuXHQkKCcjZG93bkFycm93JykuY2xpY2soKCkgPT4ge1xuXHRcdGlmKCQod2luZG93KS5oZWlnaHQoKSAqICgkKCcucGFnZScpLmxlbmd0aCAtIDEpID09PSAtICQoJyNzY3JvbGxlcldyYXBwZXInKS5vZmZzZXQoKS50b3ApIHtcbi8vIE1PVkUgVE8gVE9QIE9GIFBBR0UgSUYgQ1VSUkVOVExZIEFUIEJPVFRPTSBcXFxcXG5cdCAgXHQkKCcjc2Nyb2xsZXJXcmFwcGVyJykubW92ZVRvKDEpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkKCcjc2Nyb2xsZXJXcmFwcGVyJykubW92ZURvd24oKTtcblx0XHR9XG5cdH0pO1xuXG4vLyBISURFIFRIRSBMT0FESU5HIEFOSU1BVElPUE4gV0hFTiBWSURFTyBJUyBSRUFEWSBUTyBQTEFZIE9OIERFU1hLVE9QLiBcXFxcXG5cblx0Y29uc3QgaGlkZUxvYWRpbmdBbmltYXRpb24gPSAoKSA9PiB7XG5cdFx0aWYod2luZG93LmlubmVyV2lkdGggPiA4MDAgJiYgISQoJyNsb2FkaW5nJykuaGFzQ2xhc3MoJ2hpZGRlbicpKSB7XG5cblx0XHRcdGlmKCQoJyN2aWRlbycpLmxlbmd0aCAmJiAkKCcjdmlkZW8nKS5nZXQoMCkucmVhZHlTdGF0ZSA9PT0gNCkge1xuXHRcdFx0XHQkKCcjbG9hZGluZycpLmFkZENsYXNzKCdoaWRkZW4nKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuLy8gTUFOQUdFTUVOVCBGVU5DVElPTiBGT1IgU0VUVElORyBBTkQgQ0xFQVJJTkcgVEhFIFNMSURFIEFVVE9NQVRJT04gSU5URVJWQUxTLiBcXFxcXG5cblx0Y29uc3QgaW50ZXJ2YWxNYW5hZ2VyID0gKGZsYWcsIHNlY3Rpb25JZCwgdGltZSkgPT4ge1xuICAgXHRpZihmbGFnKSB7XG4gXHRcdFx0bWFzdGVyT2JqW3NlY3Rpb25JZF0uYXV0b21hdGUgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgIFx0XHRzd2lwZUNvbnRyb2xsZXIoc2VjdGlvbklkLCAnbCcpO1x0XG4gICAgIFx0fSwgdGltZSk7IFxuICAgXHR9IGVsc2Uge1x0XHRcbiAgICBcdGNsZWFySW50ZXJ2YWwobWFzdGVyT2JqW3NlY3Rpb25JZF0uYXV0b21hdGUpO1xuICAgXHR9XG5cdH07XG5cbi8vIElGIE5PVCBJTiBDTVMgQURNSU4gUFJFVklFVywgUEVSUEVUVUFMTFkgQ0hFQ0sgSUYgV0UgQVJFIEFUIFRIRSBUT1AgT0YgVEhFIFBBR0UgQU5EIElGIFNPLCBET05UIFNIT1cgVEhFIEZPT1RFUiBPUiBHUkVFTiBTSEFQRS4gXFxcXFxuXG5cdGlmKCEkKGxvY2F0aW9uKS5hdHRyKCdocmVmJykuaW5jbHVkZXMoJ2luZGV4LnBocCcpKSB7XG5cdFx0c2V0SW50ZXJ2YWwoKCkgPT4ge1xuXHRcdFx0aWYoJCgnI3Njcm9sbGVyV3JhcHBlcicpLm9mZnNldCgpLnRvcCA+PSAtICh3aW5kb3cuaW5uZXJIZWlnaHQgLyAxLjkpKSB7XG5cdFx0XHRcdCQoJyNoZWFkZXJTaGFwZSwgI2Zvb3RlcicpLmFkZENsYXNzKCdtb3ZlT2ZmU2NyZWVuJyk7XG5cblx0XHRcdFx0aWYoJCgnI3ZpZGVvJykubGVuZ3RoICYmICQoJyN2aWRlbycpLmNzcygnZGlzcGxheScpICE9PSAnbm9uZScpIHtcblx0XHRcdFx0XHQkKCcjdmlkZW8nKS5nZXQoMCkucGxheSgpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0JCgnLmFycm93JykuYWRkQ2xhc3MoJ3B1bHNhdGUnKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCQoJyNoZWFkZXJTaGFwZSwgI2Zvb3RlcicpLnJlbW92ZUNsYXNzKCdtb3ZlT2ZmU2NyZWVuJyk7XG5cdFx0XHRcdCQoJy5hcnJvdycpLnJlbW92ZUNsYXNzKCdwdWxzYXRlJyk7XG5cblx0XHRcdFx0aWYoJCgnI3ZpZGVvJykubGVuZ3RoKSB7XG5cdFx0XHRcdFx0JCgnI3ZpZGVvJykuZ2V0KDApLnBhdXNlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuLy8gUk9UQVRFIFRIRSBBUlJPVyBJTiBUSEUgRk9PVEVSIFdIRU4gQVQgVEhFIEJPVFRPTSBPRiBUSEUgUEFHRSBcXFxcXG5cblx0XHRcdGlmKCQoJyNzY3JvbGxlcldyYXBwZXInKS5vZmZzZXQoKS50b3AgPCAtICh3aW5kb3cuaW5uZXJIZWlnaHQgKiA0KSkge1xuXHRcdFx0XHQkKCcjZG93bkFycm93JykuY3NzKHsndHJhbnNmb3JtJzogJ3JvdGF0ZSgxODBkZWcpIHRyYW5zbGF0ZVgoLTUwJSknfSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkKCcjZG93bkFycm93JykuY3NzKHsndHJhbnNmb3JtJzogJ3RyYW5zbGF0ZVgoLTUwJSkgcm90YXRlKDBkZWcpJ30pO1xuXHRcdFx0fVxuXG5cdFx0XHRoaWRlTG9hZGluZ0FuaW1hdGlvbigpO1xuXG4vLyBBREQgTEFORFNDQVBFIFNUWUxFUyBUTyBSRUxFVkFOVCBFTEVNRU5UUyBcXFxcXG5cblx0XHRcdGlmKHdpbmRvdy5tYXRjaE1lZGlhKFwiKG9yaWVudGF0aW9uOiBsYW5kc2NhcGUpXCIpLm1hdGNoZXMgJiYgd2luZG93LmlubmVyV2lkdGggPCA4MDApIHtcblx0XHRcdCAgJCgnLm5hdl9saW5rLCAjaGVhZGVyU2hhcGUsICNmb290ZXIsIC5jdXN0b20sIC5tYXJrZXIsICNzZWN0aW9uNSwgLnRleHRXcmFwcGVyJykuYWRkQ2xhc3MoJ2xhbmRzY2FwZScpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ICQoJy5uYXZfbGluaywgI2hlYWRlclNoYXBlLCAjZm9vdGVyLCAuY3VzdG9tLCAubWFya2VyLCAjc2VjdGlvbjUsIC50ZXh0V3JhcHBlcicpLnJlbW92ZUNsYXNzKCdsYW5kc2NhcGUnKTtcblx0XHRcdH1cblxuXHRcdFx0aWYoJCgnI3NlY3Rpb24zLmFjdGl2ZScpLmxlbmd0aCkgeyAvLyBBVVRPTUFURSBUSEUgU0xJREVTIE9OIFNFQ1RJT1BOIDMgRVZFUlkgNyBTRUNPTkRTIElGIFRIRSBTRUNUSU9OIElTIEFDVElWRS4gXFxcXFxuXHRcdFx0XHRpZihtYXN0ZXJPYmouc2VjdGlvbjMuaXNBdXRvbWF0ZWQgIT09IHRydWUpIHtcblx0XHRcdFx0XHRtYXN0ZXJPYmouc2VjdGlvbjMuaXNBdXRvbWF0ZWQgPSB0cnVlO1xuXHRcdFx0XHRcdGludGVydmFsTWFuYWdlcih0cnVlLCAnc2VjdGlvbjMnLCAxMDAwMCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7IC8vIFNUT1AgQVVUT01BVEVEIFNMSURFUyBPTiBTRUNUSU9QTiAzIElGIFRIRSBTRUNUSU9OIElTIE5PVCBBQ1RJVkUuIFxcXFxcblx0XHRcdFx0aWYobWFzdGVyT2JqLnNlY3Rpb24zLmlzQXV0b21hdGVkID09PSB0cnVlKSB7XG5cdFx0XHRcdFx0aW50ZXJ2YWxNYW5hZ2VyKGZhbHNlLCAnc2VjdGlvbjMnKTtcblx0XHRcdFx0XHRtYXN0ZXJPYmouc2VjdGlvbjMuaXNBdXRvbWF0ZWQgPSBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZigkKCcjc2VjdGlvbjQuYWN0aXZlJykubGVuZ3RoKSB7IC8vIEFVVE9NQVRFIFRIRSBTTElERVMgT04gU0VDVElPUE4gNCBFVkVSWSA3IFNFQ09ORFMgSUYgVEhFIFNFQ1RJT04gSVMgQUNUSVZFLiBcXFxcXG5cdFx0XHRcdGlmKG1hc3Rlck9iai5zZWN0aW9uNC5pc0F1dG9tYXRlZCAhPT0gdHJ1ZSkge1xuXHRcdFx0XHRcdG1hc3Rlck9iai5zZWN0aW9uNC5pc0F1dG9tYXRlZCA9IHRydWU7XG5cdFx0XHRcdFx0aW50ZXJ2YWxNYW5hZ2VyKHRydWUsICdzZWN0aW9uNCcsIDEwMDAwKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHsgLy8gU1RPUCBBVVRPTUFURUQgU0xJREVTIE9OIFNFQ1RJT1BOIDQgSUYgVEhFIFNFQ1RJT04gSVMgTk9UIEFDVElWRS4gXFxcXFxuXHRcdFx0XHRpZihtYXN0ZXJPYmouc2VjdGlvbjQuaXNBdXRvbWF0ZWQgPT09IHRydWUpIHtcblx0XHRcdFx0XHRpbnRlcnZhbE1hbmFnZXIoZmFsc2UsICdzZWN0aW9uNCcpO1xuXHRcdFx0XHRcdG1hc3Rlck9iai5zZWN0aW9uNC5pc0F1dG9tYXRlZCA9IGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSwgNTAwKTtcblx0fVxuXG4vLyBDT05UUk9MIFdIQVQgSEFQUEVOUyBXSEVOIExJTktTIElOIFRIRSBOQVYvTUVOVSBBUkUgQ0xJQ0tFRCBcXFxcXG5cblx0JCgnLm5hdl9saW5rJykuY2xpY2soKGUpID0+IHtcblx0XHRjb25zdCBwYWdlSWR4ID0gcGFyc2VJbnQoJChlLnRhcmdldCkuYXR0cignZGF0YS1pbmRleCcpKTtcblx0XHQkKCcjc2Nyb2xsZXJXcmFwcGVyJykubW92ZVRvKHBhZ2VJZHgpO1xuXHRcdCQoJyNtZW51QmxvY2tPdXQnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG5cblx0XHRpZihidXJnZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdidXJnZXItLWFjdGl2ZScpKSB7XG4gICAgICBuYXYuY2xhc3NMaXN0LnJlbW92ZSgnbmF2X29wZW4nKTtcbiAgICAgIGJ1cmdlci5jbGFzc0xpc3QucmVtb3ZlKCdidXJnZXItLWFjdGl2ZScpO1xuICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XG4gICAgfSBcblx0fSk7XG5cbi8vIFdIRU4gVEhFIE5BViBJUyBPUEVOIFBSRVZFTlQgVVNFUiBGUk9NIEJFSU5HIEFCTEUgVE8gQ0xJQ0sgQU5ZVEhJTkcgRUxTRSBcXFxcXG5cblx0JCgnI21lbnVCbG9ja091dCcpLmNsaWNrKChlKSA9PiB7XG5cdCAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdH0pO1xuXG5cdHZhciBidXJnZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbi1idXJnZXInKSwgXG4gIG5hdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluTmF2Jyk7XG5cbi8vIENPTlRST0wgRk9SIE9QRU4gQU5EIENMT1NJTkcgVEhFIE1FTlUvTkFWICBcXFxcXG5cbiAgZnVuY3Rpb24gbmF2Q29udHJvbCgpIHtcblxuICAgIGlmKGJ1cmdlci5jbGFzc0xpc3QuY29udGFpbnMoJ2J1cmdlci0tYWN0aXZlJykpIHtcbiAgICAgIG5hdi5jbGFzc0xpc3QucmVtb3ZlKCduYXZfb3BlbicpO1xuICAgICAgYnVyZ2VyLmNsYXNzTGlzdC5yZW1vdmUoJ2J1cmdlci0tYWN0aXZlJyk7XG4gICAgICAkKCcjbWVudUJsb2NrT3V0JykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuICAgIH0gXG4gICAgZWxzZSB7XG4gICAgICBidXJnZXIuY2xhc3NMaXN0LmFkZCgnYnVyZ2VyLS1hY3RpdmUnKTtcbiAgICAgIG5hdi5jbGFzc0xpc3QuYWRkKCduYXZfb3BlbicpO1xuICAgICAgJCgnI21lbnVCbG9ja091dCcpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcbiAgICB9XG4gIH1cbiAgXG4vLyBPTkxZIExJU1RFTiBGT1IgTUVOVSBDTElDS1MgV0hFTiBOT1QgSU4gQ01TIFBSRVZJRVcgTU9ERSBcXFxcXG5cbiAgaWYoISQobG9jYXRpb24pLmF0dHIoJ2hyZWYnKS5pbmNsdWRlcygnaW5kZXgucGhwJykpIHtcbiAgXHRidXJnZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBuYXZDb250cm9sKTtcbiAgfVxuXG4vLyBDTE9TRSBUSEUgTkFWIElGIFRIRSBXSU5ET1cgSVMgT1ZFUiAxMDAwUFggV0lERSBcXFxcXG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGZ1bmN0aW9uKCkge1xuICAgIGlmKHdpbmRvdy5pbm5lcldpZHRoID4gMTAwMCAmJiBuYXYuY2xhc3NMaXN0LmNvbnRhaW5zKCduYXZfb3BlbicpKSB7XG4gICAgICBuYXZDb250cm9sKCk7XG4gICAgICBuYXYuY2xhc3NMaXN0LnJlbW92ZSgnbmF2X29wZW4nKTtcbiAgICAgICAkKCcjbWVudUJsb2NrT3V0JykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuICAgIH1cbiAgfSk7XG5cbi8vIFRISVMgU0VUIE9GIElGIFNUQVRFTUVOVFMgSU5JVElBTElTRVMgVEhFIFNQRVNJRklDIFBBR0VTIEZPUiBQUkVWSUVXSU5HIElOIENNUyBBRE1JTi4gXFxcXFxuXG4gIGlmKCQobG9jYXRpb24pLmF0dHIoJ2hyZWYnKS5pbmNsdWRlcygnaW5kZXgucGhwJykpIHtcblx0XHRpZigkKGxvY2F0aW9uKS5hdHRyKCdocmVmJykuaW5jbHVkZXMoJ2ltYWdpbmUtaWYnKSkge1xuXHRcdFx0cGFnZUxvYWRlcig0KTtcblx0XHR9XG5cdFx0aWYoJChsb2NhdGlvbikuYXR0cignaHJlZicpLmluY2x1ZGVzKCdob3ctd2UtaW5ub3ZhdGUnKSkge1xuXHRcdFx0cGFnZUxvYWRlcigzKTtcblx0XHR9XG5cdFx0aWYoJChsb2NhdGlvbikuYXR0cignaHJlZicpLmluY2x1ZGVzKCd3b3JrLXdpdGgtdXMnKSkge1xuXHRcdFx0cGFnZUxvYWRlcig1KTtcblx0XHR9XG5cdFx0aWYoJChsb2NhdGlvbikuYXR0cignaHJlZicpLmluY2x1ZGVzKCdjb250YWN0LXVzJykpIHtcblx0XHRcdHBhZ2VMb2FkZXIoNik7XG5cdFx0fVxuXHRcdGlmKCQobG9jYXRpb24pLmF0dHIoJ2hyZWYnKS5pbmNsdWRlcygnaG9tZS12aWRlbycpKSB7XG5cdFx0XHRzZXRJbnRlcnZhbCgoKSA9PiB7XG5cdFx0XHRcdGhpZGVMb2FkaW5nQW5pbWF0aW9uKCk7XG5cdFx0XHR9LCA1MDApXG5cdFx0fVxuXHR9XG5cbi8vIFNXSVBFIEVWRU5UUyBERVRFQ1RPUiBGVU5DVElPTiBcXFxcXG5cbiAgZnVuY3Rpb24gZGV0ZWN0c3dpcGUoZWwsIGZ1bmMpIHtcblx0ICBsZXQgc3dpcGVfZGV0ID0ge307XG5cdCAgc3dpcGVfZGV0LnNYID0gMDsgc3dpcGVfZGV0LnNZID0gMDsgc3dpcGVfZGV0LmVYID0gMDsgc3dpcGVfZGV0LmVZID0gMDtcblx0ICB2YXIgbWluX3ggPSAzMDsgIC8vbWluIHggc3dpcGUgZm9yIGhvcml6b250YWwgc3dpcGVcblx0ICB2YXIgbWF4X3ggPSAzMDsgIC8vbWF4IHggZGlmZmVyZW5jZSBmb3IgdmVydGljYWwgc3dpcGVcblx0ICB2YXIgbWluX3kgPSA1MDsgIC8vbWluIHkgc3dpcGUgZm9yIHZlcnRpY2FsIHN3aXBlXG5cdCAgdmFyIG1heF95ID0gNjA7ICAvL21heCB5IGRpZmZlcmVuY2UgZm9yIGhvcml6b250YWwgc3dpcGVcblx0ICB2YXIgZGlyZWMgPSBcIlwiO1xuXHQgIGxldCBlbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbCk7XG5cdCAgZWxlLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLGZ1bmN0aW9uKGUpe1xuXHQgICAgdmFyIHQgPSBlLnRvdWNoZXNbMF07XG5cdCAgICBzd2lwZV9kZXQuc1ggPSB0LnNjcmVlblg7IFxuXHQgICAgc3dpcGVfZGV0LnNZID0gdC5zY3JlZW5ZO1xuXHQgIH0sZmFsc2UpO1xuXHQgIGVsZS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLGZ1bmN0aW9uKGUpe1xuXHQgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHQgICAgdmFyIHQgPSBlLnRvdWNoZXNbMF07XG5cdCAgICBzd2lwZV9kZXQuZVggPSB0LnNjcmVlblg7IFxuXHQgICAgc3dpcGVfZGV0LmVZID0gdC5zY3JlZW5ZOyAgICBcblx0ICB9LGZhbHNlKTtcblx0ICBlbGUuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLGZ1bmN0aW9uKGUpe1xuXHQgICAgLy9ob3Jpem9udGFsIGRldGVjdGlvblxuXHQgICAgaWYgKCgoKHN3aXBlX2RldC5lWCAtIG1pbl94ID4gc3dpcGVfZGV0LnNYKSB8fCAoc3dpcGVfZGV0LmVYICsgbWluX3ggPCBzd2lwZV9kZXQuc1gpKSAmJiAoKHN3aXBlX2RldC5lWSA8IHN3aXBlX2RldC5zWSArIG1heF95KSAmJiAoc3dpcGVfZGV0LnNZID4gc3dpcGVfZGV0LmVZIC0gbWF4X3kpICYmIChzd2lwZV9kZXQuZVggPiAwKSkpKSB7XG5cdCAgICAgIGlmKHN3aXBlX2RldC5lWCA+IHN3aXBlX2RldC5zWCkgZGlyZWMgPSBcInJcIjtcblx0ICAgICAgZWxzZSBkaXJlYyA9IFwibFwiO1xuXHQgICAgfVxuXHQgICAgLy92ZXJ0aWNhbCBkZXRlY3Rpb25cblx0ICAgIGVsc2UgaWYgKCgoKHN3aXBlX2RldC5lWSAtIG1pbl95ID4gc3dpcGVfZGV0LnNZKSB8fCAoc3dpcGVfZGV0LmVZICsgbWluX3kgPCBzd2lwZV9kZXQuc1kpKSAmJiAoKHN3aXBlX2RldC5lWCA8IHN3aXBlX2RldC5zWCArIG1heF94KSAmJiAoc3dpcGVfZGV0LnNYID4gc3dpcGVfZGV0LmVYIC0gbWF4X3gpICYmIChzd2lwZV9kZXQuZVkgPiAwKSkpKSB7XG5cdCAgICAgIGlmKHN3aXBlX2RldC5lWSA+IHN3aXBlX2RldC5zWSkgZGlyZWMgPSBcImRcIjtcblx0ICAgICAgZWxzZSBkaXJlYyA9IFwidVwiO1xuXHQgICAgfVxuXG5cdCAgICBpZiAoZGlyZWMgIT0gXCJcIikge1xuXHQgICAgICBpZih0eXBlb2YgZnVuYyA9PSAnZnVuY3Rpb24nKSBmdW5jKGVsLGRpcmVjKTtcblx0ICAgIH1cblx0ICAgIGxldCBkaXJlYyA9IFwiXCI7XG5cdCAgICBzd2lwZV9kZXQuc1ggPSAwOyBzd2lwZV9kZXQuc1kgPSAwOyBzd2lwZV9kZXQuZVggPSAwOyBzd2lwZV9kZXQuZVkgPSAwO1xuXHQgIH0sZmFsc2UpOyAgXG5cdH1cblxuLy8gQ0hPU0UgVEhFIE5FWFQgU0xJREUgVE8gU0hPVyBBTkQgQ0xJQ0sgVEhFIFBBR0lOQVRJT04gQlVUVE9OIFRIQVQgUkVMQVRFUyBUTyBJVC4gXFxcXFxuXG5cdGNvbnN0IHN3aXBlQ29udHJvbGxlciA9IChlbCwgZCkgPT4ge1xuXG5cdFx0aWYoZWwgPT09ICdzZWN0aW9uNCcpIHtcblxuXHRcdFx0Y29uc3Qgc2VjdGlvbjRQYWdpbmF0aW9uTGVuZ3RoID0gJCgnLnNlY3Rpb240UGFnaW5hdG9yQnV0dG9uJykubGVuZ3RoO1xuXG5cdFx0XHRpZihkID09PSAnbCcpIHtcblxuXHRcdFx0XHRpZihzZWN0aW9uNElkeCA8IHNlY3Rpb240UGFnaW5hdGlvbkxlbmd0aCAtIDEpIHtcblx0XHRcdFx0XHRzZWN0aW9uNElkeCsrO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHNlY3Rpb240SWR4ID0gMDtcblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdFx0JCgnLnNlY3Rpb240UGFnaW5hdG9yQnV0dG9uJylbc2VjdGlvbjRJZHhdLmNsaWNrKCk7XG5cdFx0XHR9XG5cdFx0XHRpZihkID09PSAncicpIHtcblxuXHRcdFx0XHRpZihzZWN0aW9uNElkeCA+IDApIHtcblx0XHRcdFx0XHRzZWN0aW9uNElkeC0tO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHNlY3Rpb240SWR4ID0gc2VjdGlvbjRQYWdpbmF0aW9uTGVuZ3RoIC0gMTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdCQoJy5zZWN0aW9uNFBhZ2luYXRvckJ1dHRvbicpW3NlY3Rpb240SWR4XS5jbGljaygpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihlbCA9PT0gJ3NlY3Rpb24zJykge1xuXG5cdFx0XHRjb25zdCBzZWN0aW9uM1BhZ2luYXRpb25MZW5ndGggPSAkKCcuc2VjdGlvbjNQYWdpbmF0b3JCdXR0b24nKS5sZW5ndGg7XG5cblx0XHRcdGlmKGQgPT09ICdsJykge1xuXG5cdFx0XHRcdGlmKHNlY3Rpb24zSWR4IDwgc2VjdGlvbjNQYWdpbmF0aW9uTGVuZ3RoIC0gMSkge1xuXHRcdFx0XHRcdHNlY3Rpb24zSWR4Kys7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0c2VjdGlvbjNJZHggPSAwO1xuXHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0XHQkKCcuc2VjdGlvbjNQYWdpbmF0b3JCdXR0b24nKVtzZWN0aW9uM0lkeF0uY2xpY2soKTtcblx0XHRcdH1cblx0XHRcdGlmKGQgPT09ICdyJykge1xuXG5cdFx0XHRcdGlmKHNlY3Rpb24zSWR4ID4gMCkge1xuXHRcdFx0XHRcdHNlY3Rpb24zSWR4LS07XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0c2VjdGlvbjNJZHggPSBzZWN0aW9uM1BhZ2luYXRpb25MZW5ndGggLSAxO1xuXHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0XHQkKCcuc2VjdGlvbjNQYWdpbmF0b3JCdXR0b24nKVtzZWN0aW9uM0lkeF0uY2xpY2soKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuLy8gSU5JVElBVEUgRk9SIFNXSVBFIERFVEVDVElPTiBPTiBTRUNUSU9OUyAzIEFORCA0IEVYQ0VQVCBJTiBBRE1JTiBQUkVWSUVXLiBcXFxcXG5cblx0aWYoISQobG9jYXRpb24pLmF0dHIoJ2hyZWYnKS5pbmNsdWRlcygnaW5kZXgucGhwJykpIHtcblx0XHRkZXRlY3Rzd2lwZSgnc2VjdGlvbjQnLCBzd2lwZUNvbnRyb2xsZXIpO1xuXHRcdGRldGVjdHN3aXBlKCdzZWN0aW9uMycsIHN3aXBlQ29udHJvbGxlcik7XG5cdH1cbn0pOyJdfQ==
}).call(this,require("FT5ORs"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/fake_76b6f9d2.js","/")
},{"FT5ORs":4,"buffer":2}]},{},[5])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYW1pYW53aHl0ZS9Eb2N1bWVudHMvUHJvamVjdHMvY3JhZnRfZmFudGFzdGVjL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvZGFtaWFud2h5dGUvRG9jdW1lbnRzL1Byb2plY3RzL2NyYWZ0X2ZhbnRhc3RlYy9ub2RlX21vZHVsZXMvYmFzZTY0LWpzL2xpYi9iNjQuanMiLCIvVXNlcnMvZGFtaWFud2h5dGUvRG9jdW1lbnRzL1Byb2plY3RzL2NyYWZ0X2ZhbnRhc3RlYy9ub2RlX21vZHVsZXMvYnVmZmVyL2luZGV4LmpzIiwiL1VzZXJzL2RhbWlhbndoeXRlL0RvY3VtZW50cy9Qcm9qZWN0cy9jcmFmdF9mYW50YXN0ZWMvbm9kZV9tb2R1bGVzL2llZWU3NTQvaW5kZXguanMiLCIvVXNlcnMvZGFtaWFud2h5dGUvRG9jdW1lbnRzL1Byb2plY3RzL2NyYWZ0X2ZhbnRhc3RlYy9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwiL1VzZXJzL2RhbWlhbndoeXRlL0RvY3VtZW50cy9Qcm9qZWN0cy9jcmFmdF9mYW50YXN0ZWMvc291cmNlL2pzL2NvbWJpbmVkL2Zha2VfNzZiNmY5ZDIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2bENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbnZhciBsb29rdXAgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLyc7XG5cbjsoZnVuY3Rpb24gKGV4cG9ydHMpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG4gIHZhciBBcnIgPSAodHlwZW9mIFVpbnQ4QXJyYXkgIT09ICd1bmRlZmluZWQnKVxuICAgID8gVWludDhBcnJheVxuICAgIDogQXJyYXlcblxuXHR2YXIgUExVUyAgID0gJysnLmNoYXJDb2RlQXQoMClcblx0dmFyIFNMQVNIICA9ICcvJy5jaGFyQ29kZUF0KDApXG5cdHZhciBOVU1CRVIgPSAnMCcuY2hhckNvZGVBdCgwKVxuXHR2YXIgTE9XRVIgID0gJ2EnLmNoYXJDb2RlQXQoMClcblx0dmFyIFVQUEVSICA9ICdBJy5jaGFyQ29kZUF0KDApXG5cdHZhciBQTFVTX1VSTF9TQUZFID0gJy0nLmNoYXJDb2RlQXQoMClcblx0dmFyIFNMQVNIX1VSTF9TQUZFID0gJ18nLmNoYXJDb2RlQXQoMClcblxuXHRmdW5jdGlvbiBkZWNvZGUgKGVsdCkge1xuXHRcdHZhciBjb2RlID0gZWx0LmNoYXJDb2RlQXQoMClcblx0XHRpZiAoY29kZSA9PT0gUExVUyB8fFxuXHRcdCAgICBjb2RlID09PSBQTFVTX1VSTF9TQUZFKVxuXHRcdFx0cmV0dXJuIDYyIC8vICcrJ1xuXHRcdGlmIChjb2RlID09PSBTTEFTSCB8fFxuXHRcdCAgICBjb2RlID09PSBTTEFTSF9VUkxfU0FGRSlcblx0XHRcdHJldHVybiA2MyAvLyAnLydcblx0XHRpZiAoY29kZSA8IE5VTUJFUilcblx0XHRcdHJldHVybiAtMSAvL25vIG1hdGNoXG5cdFx0aWYgKGNvZGUgPCBOVU1CRVIgKyAxMClcblx0XHRcdHJldHVybiBjb2RlIC0gTlVNQkVSICsgMjYgKyAyNlxuXHRcdGlmIChjb2RlIDwgVVBQRVIgKyAyNilcblx0XHRcdHJldHVybiBjb2RlIC0gVVBQRVJcblx0XHRpZiAoY29kZSA8IExPV0VSICsgMjYpXG5cdFx0XHRyZXR1cm4gY29kZSAtIExPV0VSICsgMjZcblx0fVxuXG5cdGZ1bmN0aW9uIGI2NFRvQnl0ZUFycmF5IChiNjQpIHtcblx0XHR2YXIgaSwgaiwgbCwgdG1wLCBwbGFjZUhvbGRlcnMsIGFyclxuXG5cdFx0aWYgKGI2NC5sZW5ndGggJSA0ID4gMCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHN0cmluZy4gTGVuZ3RoIG11c3QgYmUgYSBtdWx0aXBsZSBvZiA0Jylcblx0XHR9XG5cblx0XHQvLyB0aGUgbnVtYmVyIG9mIGVxdWFsIHNpZ25zIChwbGFjZSBob2xkZXJzKVxuXHRcdC8vIGlmIHRoZXJlIGFyZSB0d28gcGxhY2Vob2xkZXJzLCB0aGFuIHRoZSB0d28gY2hhcmFjdGVycyBiZWZvcmUgaXRcblx0XHQvLyByZXByZXNlbnQgb25lIGJ5dGVcblx0XHQvLyBpZiB0aGVyZSBpcyBvbmx5IG9uZSwgdGhlbiB0aGUgdGhyZWUgY2hhcmFjdGVycyBiZWZvcmUgaXQgcmVwcmVzZW50IDIgYnl0ZXNcblx0XHQvLyB0aGlzIGlzIGp1c3QgYSBjaGVhcCBoYWNrIHRvIG5vdCBkbyBpbmRleE9mIHR3aWNlXG5cdFx0dmFyIGxlbiA9IGI2NC5sZW5ndGhcblx0XHRwbGFjZUhvbGRlcnMgPSAnPScgPT09IGI2NC5jaGFyQXQobGVuIC0gMikgPyAyIDogJz0nID09PSBiNjQuY2hhckF0KGxlbiAtIDEpID8gMSA6IDBcblxuXHRcdC8vIGJhc2U2NCBpcyA0LzMgKyB1cCB0byB0d28gY2hhcmFjdGVycyBvZiB0aGUgb3JpZ2luYWwgZGF0YVxuXHRcdGFyciA9IG5ldyBBcnIoYjY0Lmxlbmd0aCAqIDMgLyA0IC0gcGxhY2VIb2xkZXJzKVxuXG5cdFx0Ly8gaWYgdGhlcmUgYXJlIHBsYWNlaG9sZGVycywgb25seSBnZXQgdXAgdG8gdGhlIGxhc3QgY29tcGxldGUgNCBjaGFyc1xuXHRcdGwgPSBwbGFjZUhvbGRlcnMgPiAwID8gYjY0Lmxlbmd0aCAtIDQgOiBiNjQubGVuZ3RoXG5cblx0XHR2YXIgTCA9IDBcblxuXHRcdGZ1bmN0aW9uIHB1c2ggKHYpIHtcblx0XHRcdGFycltMKytdID0gdlxuXHRcdH1cblxuXHRcdGZvciAoaSA9IDAsIGogPSAwOyBpIDwgbDsgaSArPSA0LCBqICs9IDMpIHtcblx0XHRcdHRtcCA9IChkZWNvZGUoYjY0LmNoYXJBdChpKSkgPDwgMTgpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAxKSkgPDwgMTIpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAyKSkgPDwgNikgfCBkZWNvZGUoYjY0LmNoYXJBdChpICsgMykpXG5cdFx0XHRwdXNoKCh0bXAgJiAweEZGMDAwMCkgPj4gMTYpXG5cdFx0XHRwdXNoKCh0bXAgJiAweEZGMDApID4+IDgpXG5cdFx0XHRwdXNoKHRtcCAmIDB4RkYpXG5cdFx0fVxuXG5cdFx0aWYgKHBsYWNlSG9sZGVycyA9PT0gMikge1xuXHRcdFx0dG1wID0gKGRlY29kZShiNjQuY2hhckF0KGkpKSA8PCAyKSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMSkpID4+IDQpXG5cdFx0XHRwdXNoKHRtcCAmIDB4RkYpXG5cdFx0fSBlbHNlIGlmIChwbGFjZUhvbGRlcnMgPT09IDEpIHtcblx0XHRcdHRtcCA9IChkZWNvZGUoYjY0LmNoYXJBdChpKSkgPDwgMTApIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAxKSkgPDwgNCkgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDIpKSA+PiAyKVxuXHRcdFx0cHVzaCgodG1wID4+IDgpICYgMHhGRilcblx0XHRcdHB1c2godG1wICYgMHhGRilcblx0XHR9XG5cblx0XHRyZXR1cm4gYXJyXG5cdH1cblxuXHRmdW5jdGlvbiB1aW50OFRvQmFzZTY0ICh1aW50OCkge1xuXHRcdHZhciBpLFxuXHRcdFx0ZXh0cmFCeXRlcyA9IHVpbnQ4Lmxlbmd0aCAlIDMsIC8vIGlmIHdlIGhhdmUgMSBieXRlIGxlZnQsIHBhZCAyIGJ5dGVzXG5cdFx0XHRvdXRwdXQgPSBcIlwiLFxuXHRcdFx0dGVtcCwgbGVuZ3RoXG5cblx0XHRmdW5jdGlvbiBlbmNvZGUgKG51bSkge1xuXHRcdFx0cmV0dXJuIGxvb2t1cC5jaGFyQXQobnVtKVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHRyaXBsZXRUb0Jhc2U2NCAobnVtKSB7XG5cdFx0XHRyZXR1cm4gZW5jb2RlKG51bSA+PiAxOCAmIDB4M0YpICsgZW5jb2RlKG51bSA+PiAxMiAmIDB4M0YpICsgZW5jb2RlKG51bSA+PiA2ICYgMHgzRikgKyBlbmNvZGUobnVtICYgMHgzRilcblx0XHR9XG5cblx0XHQvLyBnbyB0aHJvdWdoIHRoZSBhcnJheSBldmVyeSB0aHJlZSBieXRlcywgd2UnbGwgZGVhbCB3aXRoIHRyYWlsaW5nIHN0dWZmIGxhdGVyXG5cdFx0Zm9yIChpID0gMCwgbGVuZ3RoID0gdWludDgubGVuZ3RoIC0gZXh0cmFCeXRlczsgaSA8IGxlbmd0aDsgaSArPSAzKSB7XG5cdFx0XHR0ZW1wID0gKHVpbnQ4W2ldIDw8IDE2KSArICh1aW50OFtpICsgMV0gPDwgOCkgKyAodWludDhbaSArIDJdKVxuXHRcdFx0b3V0cHV0ICs9IHRyaXBsZXRUb0Jhc2U2NCh0ZW1wKVxuXHRcdH1cblxuXHRcdC8vIHBhZCB0aGUgZW5kIHdpdGggemVyb3MsIGJ1dCBtYWtlIHN1cmUgdG8gbm90IGZvcmdldCB0aGUgZXh0cmEgYnl0ZXNcblx0XHRzd2l0Y2ggKGV4dHJhQnl0ZXMpIHtcblx0XHRcdGNhc2UgMTpcblx0XHRcdFx0dGVtcCA9IHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDFdXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUodGVtcCA+PiAyKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKCh0ZW1wIDw8IDQpICYgMHgzRilcblx0XHRcdFx0b3V0cHV0ICs9ICc9PSdcblx0XHRcdFx0YnJlYWtcblx0XHRcdGNhc2UgMjpcblx0XHRcdFx0dGVtcCA9ICh1aW50OFt1aW50OC5sZW5ndGggLSAyXSA8PCA4KSArICh1aW50OFt1aW50OC5sZW5ndGggLSAxXSlcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSh0ZW1wID4+IDEwKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKCh0ZW1wID4+IDQpICYgMHgzRilcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSgodGVtcCA8PCAyKSAmIDB4M0YpXG5cdFx0XHRcdG91dHB1dCArPSAnPSdcblx0XHRcdFx0YnJlYWtcblx0XHR9XG5cblx0XHRyZXR1cm4gb3V0cHV0XG5cdH1cblxuXHRleHBvcnRzLnRvQnl0ZUFycmF5ID0gYjY0VG9CeXRlQXJyYXlcblx0ZXhwb3J0cy5mcm9tQnl0ZUFycmF5ID0gdWludDhUb0Jhc2U2NFxufSh0eXBlb2YgZXhwb3J0cyA9PT0gJ3VuZGVmaW5lZCcgPyAodGhpcy5iYXNlNjRqcyA9IHt9KSA6IGV4cG9ydHMpKVxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIkZUNU9Sc1wiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9iYXNlNjQtanMvbGliL2I2NC5qc1wiLFwiLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9iYXNlNjQtanMvbGliXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLyohXG4gKiBUaGUgYnVmZmVyIG1vZHVsZSBmcm9tIG5vZGUuanMsIGZvciB0aGUgYnJvd3Nlci5cbiAqXG4gKiBAYXV0aG9yICAgRmVyb3NzIEFib3VraGFkaWplaCA8ZmVyb3NzQGZlcm9zcy5vcmc+IDxodHRwOi8vZmVyb3NzLm9yZz5cbiAqIEBsaWNlbnNlICBNSVRcbiAqL1xuXG52YXIgYmFzZTY0ID0gcmVxdWlyZSgnYmFzZTY0LWpzJylcbnZhciBpZWVlNzU0ID0gcmVxdWlyZSgnaWVlZTc1NCcpXG5cbmV4cG9ydHMuQnVmZmVyID0gQnVmZmVyXG5leHBvcnRzLlNsb3dCdWZmZXIgPSBCdWZmZXJcbmV4cG9ydHMuSU5TUEVDVF9NQVhfQllURVMgPSA1MFxuQnVmZmVyLnBvb2xTaXplID0gODE5MlxuXG4vKipcbiAqIElmIGBCdWZmZXIuX3VzZVR5cGVkQXJyYXlzYDpcbiAqICAgPT09IHRydWUgICAgVXNlIFVpbnQ4QXJyYXkgaW1wbGVtZW50YXRpb24gKGZhc3Rlc3QpXG4gKiAgID09PSBmYWxzZSAgIFVzZSBPYmplY3QgaW1wbGVtZW50YXRpb24gKGNvbXBhdGlibGUgZG93biB0byBJRTYpXG4gKi9cbkJ1ZmZlci5fdXNlVHlwZWRBcnJheXMgPSAoZnVuY3Rpb24gKCkge1xuICAvLyBEZXRlY3QgaWYgYnJvd3NlciBzdXBwb3J0cyBUeXBlZCBBcnJheXMuIFN1cHBvcnRlZCBicm93c2VycyBhcmUgSUUgMTArLCBGaXJlZm94IDQrLFxuICAvLyBDaHJvbWUgNyssIFNhZmFyaSA1LjErLCBPcGVyYSAxMS42KywgaU9TIDQuMisuIElmIHRoZSBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgYWRkaW5nXG4gIC8vIHByb3BlcnRpZXMgdG8gYFVpbnQ4QXJyYXlgIGluc3RhbmNlcywgdGhlbiB0aGF0J3MgdGhlIHNhbWUgYXMgbm8gYFVpbnQ4QXJyYXlgIHN1cHBvcnRcbiAgLy8gYmVjYXVzZSB3ZSBuZWVkIHRvIGJlIGFibGUgdG8gYWRkIGFsbCB0aGUgbm9kZSBCdWZmZXIgQVBJIG1ldGhvZHMuIFRoaXMgaXMgYW4gaXNzdWVcbiAgLy8gaW4gRmlyZWZveCA0LTI5LiBOb3cgZml4ZWQ6IGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTY5NTQzOFxuICB0cnkge1xuICAgIHZhciBidWYgPSBuZXcgQXJyYXlCdWZmZXIoMClcbiAgICB2YXIgYXJyID0gbmV3IFVpbnQ4QXJyYXkoYnVmKVxuICAgIGFyci5mb28gPSBmdW5jdGlvbiAoKSB7IHJldHVybiA0MiB9XG4gICAgcmV0dXJuIDQyID09PSBhcnIuZm9vKCkgJiZcbiAgICAgICAgdHlwZW9mIGFyci5zdWJhcnJheSA9PT0gJ2Z1bmN0aW9uJyAvLyBDaHJvbWUgOS0xMCBsYWNrIGBzdWJhcnJheWBcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59KSgpXG5cbi8qKlxuICogQ2xhc3M6IEJ1ZmZlclxuICogPT09PT09PT09PT09PVxuICpcbiAqIFRoZSBCdWZmZXIgY29uc3RydWN0b3IgcmV0dXJucyBpbnN0YW5jZXMgb2YgYFVpbnQ4QXJyYXlgIHRoYXQgYXJlIGF1Z21lbnRlZFxuICogd2l0aCBmdW5jdGlvbiBwcm9wZXJ0aWVzIGZvciBhbGwgdGhlIG5vZGUgYEJ1ZmZlcmAgQVBJIGZ1bmN0aW9ucy4gV2UgdXNlXG4gKiBgVWludDhBcnJheWAgc28gdGhhdCBzcXVhcmUgYnJhY2tldCBub3RhdGlvbiB3b3JrcyBhcyBleHBlY3RlZCAtLSBpdCByZXR1cm5zXG4gKiBhIHNpbmdsZSBvY3RldC5cbiAqXG4gKiBCeSBhdWdtZW50aW5nIHRoZSBpbnN0YW5jZXMsIHdlIGNhbiBhdm9pZCBtb2RpZnlpbmcgdGhlIGBVaW50OEFycmF5YFxuICogcHJvdG90eXBlLlxuICovXG5mdW5jdGlvbiBCdWZmZXIgKHN1YmplY3QsIGVuY29kaW5nLCBub1plcm8pIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEJ1ZmZlcikpXG4gICAgcmV0dXJuIG5ldyBCdWZmZXIoc3ViamVjdCwgZW5jb2RpbmcsIG5vWmVybylcblxuICB2YXIgdHlwZSA9IHR5cGVvZiBzdWJqZWN0XG5cbiAgLy8gV29ya2Fyb3VuZDogbm9kZSdzIGJhc2U2NCBpbXBsZW1lbnRhdGlvbiBhbGxvd3MgZm9yIG5vbi1wYWRkZWQgc3RyaW5nc1xuICAvLyB3aGlsZSBiYXNlNjQtanMgZG9lcyBub3QuXG4gIGlmIChlbmNvZGluZyA9PT0gJ2Jhc2U2NCcgJiYgdHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICBzdWJqZWN0ID0gc3RyaW5ndHJpbShzdWJqZWN0KVxuICAgIHdoaWxlIChzdWJqZWN0Lmxlbmd0aCAlIDQgIT09IDApIHtcbiAgICAgIHN1YmplY3QgPSBzdWJqZWN0ICsgJz0nXG4gICAgfVxuICB9XG5cbiAgLy8gRmluZCB0aGUgbGVuZ3RoXG4gIHZhciBsZW5ndGhcbiAgaWYgKHR5cGUgPT09ICdudW1iZXInKVxuICAgIGxlbmd0aCA9IGNvZXJjZShzdWJqZWN0KVxuICBlbHNlIGlmICh0eXBlID09PSAnc3RyaW5nJylcbiAgICBsZW5ndGggPSBCdWZmZXIuYnl0ZUxlbmd0aChzdWJqZWN0LCBlbmNvZGluZylcbiAgZWxzZSBpZiAodHlwZSA9PT0gJ29iamVjdCcpXG4gICAgbGVuZ3RoID0gY29lcmNlKHN1YmplY3QubGVuZ3RoKSAvLyBhc3N1bWUgdGhhdCBvYmplY3QgaXMgYXJyYXktbGlrZVxuICBlbHNlXG4gICAgdGhyb3cgbmV3IEVycm9yKCdGaXJzdCBhcmd1bWVudCBuZWVkcyB0byBiZSBhIG51bWJlciwgYXJyYXkgb3Igc3RyaW5nLicpXG5cbiAgdmFyIGJ1ZlxuICBpZiAoQnVmZmVyLl91c2VUeXBlZEFycmF5cykge1xuICAgIC8vIFByZWZlcnJlZDogUmV0dXJuIGFuIGF1Z21lbnRlZCBgVWludDhBcnJheWAgaW5zdGFuY2UgZm9yIGJlc3QgcGVyZm9ybWFuY2VcbiAgICBidWYgPSBCdWZmZXIuX2F1Z21lbnQobmV3IFVpbnQ4QXJyYXkobGVuZ3RoKSlcbiAgfSBlbHNlIHtcbiAgICAvLyBGYWxsYmFjazogUmV0dXJuIFRISVMgaW5zdGFuY2Ugb2YgQnVmZmVyIChjcmVhdGVkIGJ5IGBuZXdgKVxuICAgIGJ1ZiA9IHRoaXNcbiAgICBidWYubGVuZ3RoID0gbGVuZ3RoXG4gICAgYnVmLl9pc0J1ZmZlciA9IHRydWVcbiAgfVxuXG4gIHZhciBpXG4gIGlmIChCdWZmZXIuX3VzZVR5cGVkQXJyYXlzICYmIHR5cGVvZiBzdWJqZWN0LmJ5dGVMZW5ndGggPT09ICdudW1iZXInKSB7XG4gICAgLy8gU3BlZWQgb3B0aW1pemF0aW9uIC0tIHVzZSBzZXQgaWYgd2UncmUgY29weWluZyBmcm9tIGEgdHlwZWQgYXJyYXlcbiAgICBidWYuX3NldChzdWJqZWN0KVxuICB9IGVsc2UgaWYgKGlzQXJyYXlpc2goc3ViamVjdCkpIHtcbiAgICAvLyBUcmVhdCBhcnJheS1pc2ggb2JqZWN0cyBhcyBhIGJ5dGUgYXJyYXlcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChCdWZmZXIuaXNCdWZmZXIoc3ViamVjdCkpXG4gICAgICAgIGJ1ZltpXSA9IHN1YmplY3QucmVhZFVJbnQ4KGkpXG4gICAgICBlbHNlXG4gICAgICAgIGJ1ZltpXSA9IHN1YmplY3RbaV1cbiAgICB9XG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICBidWYud3JpdGUoc3ViamVjdCwgMCwgZW5jb2RpbmcpXG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gJ251bWJlcicgJiYgIUJ1ZmZlci5fdXNlVHlwZWRBcnJheXMgJiYgIW5vWmVybykge1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgYnVmW2ldID0gMFxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBidWZcbn1cblxuLy8gU1RBVElDIE1FVEhPRFNcbi8vID09PT09PT09PT09PT09XG5cbkJ1ZmZlci5pc0VuY29kaW5nID0gZnVuY3Rpb24gKGVuY29kaW5nKSB7XG4gIHN3aXRjaCAoU3RyaW5nKGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgY2FzZSAnYXNjaWknOlxuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICBjYXNlICdyYXcnOlxuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5CdWZmZXIuaXNCdWZmZXIgPSBmdW5jdGlvbiAoYikge1xuICByZXR1cm4gISEoYiAhPT0gbnVsbCAmJiBiICE9PSB1bmRlZmluZWQgJiYgYi5faXNCdWZmZXIpXG59XG5cbkJ1ZmZlci5ieXRlTGVuZ3RoID0gZnVuY3Rpb24gKHN0ciwgZW5jb2RpbmcpIHtcbiAgdmFyIHJldFxuICBzdHIgPSBzdHIgKyAnJ1xuICBzd2l0Y2ggKGVuY29kaW5nIHx8ICd1dGY4Jykge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgICByZXQgPSBzdHIubGVuZ3RoIC8gMlxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgICByZXQgPSB1dGY4VG9CeXRlcyhzdHIpLmxlbmd0aFxuICAgICAgYnJlYWtcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICBjYXNlICdyYXcnOlxuICAgICAgcmV0ID0gc3RyLmxlbmd0aFxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgcmV0ID0gYmFzZTY0VG9CeXRlcyhzdHIpLmxlbmd0aFxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0ID0gc3RyLmxlbmd0aCAqIDJcbiAgICAgIGJyZWFrXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBlbmNvZGluZycpXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG5CdWZmZXIuY29uY2F0ID0gZnVuY3Rpb24gKGxpc3QsIHRvdGFsTGVuZ3RoKSB7XG4gIGFzc2VydChpc0FycmF5KGxpc3QpLCAnVXNhZ2U6IEJ1ZmZlci5jb25jYXQobGlzdCwgW3RvdGFsTGVuZ3RoXSlcXG4nICtcbiAgICAgICdsaXN0IHNob3VsZCBiZSBhbiBBcnJheS4nKVxuXG4gIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBuZXcgQnVmZmVyKDApXG4gIH0gZWxzZSBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gbGlzdFswXVxuICB9XG5cbiAgdmFyIGlcbiAgaWYgKHR5cGVvZiB0b3RhbExlbmd0aCAhPT0gJ251bWJlcicpIHtcbiAgICB0b3RhbExlbmd0aCA9IDBcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgdG90YWxMZW5ndGggKz0gbGlzdFtpXS5sZW5ndGhcbiAgICB9XG4gIH1cblxuICB2YXIgYnVmID0gbmV3IEJ1ZmZlcih0b3RhbExlbmd0aClcbiAgdmFyIHBvcyA9IDBcbiAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV1cbiAgICBpdGVtLmNvcHkoYnVmLCBwb3MpXG4gICAgcG9zICs9IGl0ZW0ubGVuZ3RoXG4gIH1cbiAgcmV0dXJuIGJ1ZlxufVxuXG4vLyBCVUZGRVIgSU5TVEFOQ0UgTUVUSE9EU1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT1cblxuZnVuY3Rpb24gX2hleFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgb2Zmc2V0ID0gTnVtYmVyKG9mZnNldCkgfHwgMFxuICB2YXIgcmVtYWluaW5nID0gYnVmLmxlbmd0aCAtIG9mZnNldFxuICBpZiAoIWxlbmd0aCkge1xuICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICB9IGVsc2Uge1xuICAgIGxlbmd0aCA9IE51bWJlcihsZW5ndGgpXG4gICAgaWYgKGxlbmd0aCA+IHJlbWFpbmluZykge1xuICAgICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gICAgfVxuICB9XG5cbiAgLy8gbXVzdCBiZSBhbiBldmVuIG51bWJlciBvZiBkaWdpdHNcbiAgdmFyIHN0ckxlbiA9IHN0cmluZy5sZW5ndGhcbiAgYXNzZXJ0KHN0ckxlbiAlIDIgPT09IDAsICdJbnZhbGlkIGhleCBzdHJpbmcnKVxuXG4gIGlmIChsZW5ndGggPiBzdHJMZW4gLyAyKSB7XG4gICAgbGVuZ3RoID0gc3RyTGVuIC8gMlxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgYnl0ZSA9IHBhcnNlSW50KHN0cmluZy5zdWJzdHIoaSAqIDIsIDIpLCAxNilcbiAgICBhc3NlcnQoIWlzTmFOKGJ5dGUpLCAnSW52YWxpZCBoZXggc3RyaW5nJylcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSBieXRlXG4gIH1cbiAgQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPSBpICogMlxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiBfdXRmOFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKHV0ZjhUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuZnVuY3Rpb24gX2FzY2lpV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgY2hhcnNXcml0dGVuID0gQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPVxuICAgIGJsaXRCdWZmZXIoYXNjaWlUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuZnVuY3Rpb24gX2JpbmFyeVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIF9hc2NpaVdyaXRlKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gX2Jhc2U2NFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKGJhc2U2NFRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbiAgcmV0dXJuIGNoYXJzV3JpdHRlblxufVxuXG5mdW5jdGlvbiBfdXRmMTZsZVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKHV0ZjE2bGVUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uIChzdHJpbmcsIG9mZnNldCwgbGVuZ3RoLCBlbmNvZGluZykge1xuICAvLyBTdXBwb3J0IGJvdGggKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgsIGVuY29kaW5nKVxuICAvLyBhbmQgdGhlIGxlZ2FjeSAoc3RyaW5nLCBlbmNvZGluZywgb2Zmc2V0LCBsZW5ndGgpXG4gIGlmIChpc0Zpbml0ZShvZmZzZXQpKSB7XG4gICAgaWYgKCFpc0Zpbml0ZShsZW5ndGgpKSB7XG4gICAgICBlbmNvZGluZyA9IGxlbmd0aFxuICAgICAgbGVuZ3RoID0gdW5kZWZpbmVkXG4gICAgfVxuICB9IGVsc2UgeyAgLy8gbGVnYWN5XG4gICAgdmFyIHN3YXAgPSBlbmNvZGluZ1xuICAgIGVuY29kaW5nID0gb2Zmc2V0XG4gICAgb2Zmc2V0ID0gbGVuZ3RoXG4gICAgbGVuZ3RoID0gc3dhcFxuICB9XG5cbiAgb2Zmc2V0ID0gTnVtYmVyKG9mZnNldCkgfHwgMFxuICB2YXIgcmVtYWluaW5nID0gdGhpcy5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgfSBlbHNlIHtcbiAgICBsZW5ndGggPSBOdW1iZXIobGVuZ3RoKVxuICAgIGlmIChsZW5ndGggPiByZW1haW5pbmcpIHtcbiAgICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICAgIH1cbiAgfVxuICBlbmNvZGluZyA9IFN0cmluZyhlbmNvZGluZyB8fCAndXRmOCcpLnRvTG93ZXJDYXNlKClcblxuICB2YXIgcmV0XG4gIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgICAgcmV0ID0gX2hleFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIHJldCA9IF91dGY4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYXNjaWknOlxuICAgICAgcmV0ID0gX2FzY2lpV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgIHJldCA9IF9iaW5hcnlXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgcmV0ID0gX2Jhc2U2NFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXQgPSBfdXRmMTZsZVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2RpbmcnKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIChlbmNvZGluZywgc3RhcnQsIGVuZCkge1xuICB2YXIgc2VsZiA9IHRoaXNcblxuICBlbmNvZGluZyA9IFN0cmluZyhlbmNvZGluZyB8fCAndXRmOCcpLnRvTG93ZXJDYXNlKClcbiAgc3RhcnQgPSBOdW1iZXIoc3RhcnQpIHx8IDBcbiAgZW5kID0gKGVuZCAhPT0gdW5kZWZpbmVkKVxuICAgID8gTnVtYmVyKGVuZClcbiAgICA6IGVuZCA9IHNlbGYubGVuZ3RoXG5cbiAgLy8gRmFzdHBhdGggZW1wdHkgc3RyaW5nc1xuICBpZiAoZW5kID09PSBzdGFydClcbiAgICByZXR1cm4gJydcblxuICB2YXIgcmV0XG4gIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgICAgcmV0ID0gX2hleFNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIHJldCA9IF91dGY4U2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYXNjaWknOlxuICAgICAgcmV0ID0gX2FzY2lpU2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgIHJldCA9IF9iaW5hcnlTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgcmV0ID0gX2Jhc2U2NFNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXQgPSBfdXRmMTZsZVNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2RpbmcnKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ0J1ZmZlcicsXG4gICAgZGF0YTogQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodGhpcy5fYXJyIHx8IHRoaXMsIDApXG4gIH1cbn1cblxuLy8gY29weSh0YXJnZXRCdWZmZXIsIHRhcmdldFN0YXJ0PTAsIHNvdXJjZVN0YXJ0PTAsIHNvdXJjZUVuZD1idWZmZXIubGVuZ3RoKVxuQnVmZmVyLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24gKHRhcmdldCwgdGFyZ2V0X3N0YXJ0LCBzdGFydCwgZW5kKSB7XG4gIHZhciBzb3VyY2UgPSB0aGlzXG5cbiAgaWYgKCFzdGFydCkgc3RhcnQgPSAwXG4gIGlmICghZW5kICYmIGVuZCAhPT0gMCkgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKCF0YXJnZXRfc3RhcnQpIHRhcmdldF9zdGFydCA9IDBcblxuICAvLyBDb3B5IDAgYnl0ZXM7IHdlJ3JlIGRvbmVcbiAgaWYgKGVuZCA9PT0gc3RhcnQpIHJldHVyblxuICBpZiAodGFyZ2V0Lmxlbmd0aCA9PT0gMCB8fCBzb3VyY2UubGVuZ3RoID09PSAwKSByZXR1cm5cblxuICAvLyBGYXRhbCBlcnJvciBjb25kaXRpb25zXG4gIGFzc2VydChlbmQgPj0gc3RhcnQsICdzb3VyY2VFbmQgPCBzb3VyY2VTdGFydCcpXG4gIGFzc2VydCh0YXJnZXRfc3RhcnQgPj0gMCAmJiB0YXJnZXRfc3RhcnQgPCB0YXJnZXQubGVuZ3RoLFxuICAgICAgJ3RhcmdldFN0YXJ0IG91dCBvZiBib3VuZHMnKVxuICBhc3NlcnQoc3RhcnQgPj0gMCAmJiBzdGFydCA8IHNvdXJjZS5sZW5ndGgsICdzb3VyY2VTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgYXNzZXJ0KGVuZCA+PSAwICYmIGVuZCA8PSBzb3VyY2UubGVuZ3RoLCAnc291cmNlRW5kIG91dCBvZiBib3VuZHMnKVxuXG4gIC8vIEFyZSB3ZSBvb2I/XG4gIGlmIChlbmQgPiB0aGlzLmxlbmd0aClcbiAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAodGFyZ2V0Lmxlbmd0aCAtIHRhcmdldF9zdGFydCA8IGVuZCAtIHN0YXJ0KVxuICAgIGVuZCA9IHRhcmdldC5sZW5ndGggLSB0YXJnZXRfc3RhcnQgKyBzdGFydFxuXG4gIHZhciBsZW4gPSBlbmQgLSBzdGFydFxuXG4gIGlmIChsZW4gPCAxMDAgfHwgIUJ1ZmZlci5fdXNlVHlwZWRBcnJheXMpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgdGFyZ2V0W2kgKyB0YXJnZXRfc3RhcnRdID0gdGhpc1tpICsgc3RhcnRdXG4gIH0gZWxzZSB7XG4gICAgdGFyZ2V0Ll9zZXQodGhpcy5zdWJhcnJheShzdGFydCwgc3RhcnQgKyBsZW4pLCB0YXJnZXRfc3RhcnQpXG4gIH1cbn1cblxuZnVuY3Rpb24gX2Jhc2U2NFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKHN0YXJ0ID09PSAwICYmIGVuZCA9PT0gYnVmLmxlbmd0aCkge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1Zi5zbGljZShzdGFydCwgZW5kKSlcbiAgfVxufVxuXG5mdW5jdGlvbiBfdXRmOFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJlcyA9ICcnXG4gIHZhciB0bXAgPSAnJ1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICBpZiAoYnVmW2ldIDw9IDB4N0YpIHtcbiAgICAgIHJlcyArPSBkZWNvZGVVdGY4Q2hhcih0bXApICsgU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0pXG4gICAgICB0bXAgPSAnJ1xuICAgIH0gZWxzZSB7XG4gICAgICB0bXAgKz0gJyUnICsgYnVmW2ldLnRvU3RyaW5nKDE2KVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXMgKyBkZWNvZGVVdGY4Q2hhcih0bXApXG59XG5cbmZ1bmN0aW9uIF9hc2NpaVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJldCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKylcbiAgICByZXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0pXG4gIHJldHVybiByZXRcbn1cblxuZnVuY3Rpb24gX2JpbmFyeVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgcmV0dXJuIF9hc2NpaVNsaWNlKGJ1Ziwgc3RhcnQsIGVuZClcbn1cblxuZnVuY3Rpb24gX2hleFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcblxuICBpZiAoIXN0YXJ0IHx8IHN0YXJ0IDwgMCkgc3RhcnQgPSAwXG4gIGlmICghZW5kIHx8IGVuZCA8IDAgfHwgZW5kID4gbGVuKSBlbmQgPSBsZW5cblxuICB2YXIgb3V0ID0gJydcbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICBvdXQgKz0gdG9IZXgoYnVmW2ldKVxuICB9XG4gIHJldHVybiBvdXRcbn1cblxuZnVuY3Rpb24gX3V0ZjE2bGVTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciBieXRlcyA9IGJ1Zi5zbGljZShzdGFydCwgZW5kKVxuICB2YXIgcmVzID0gJydcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkgKz0gMikge1xuICAgIHJlcyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ5dGVzW2ldICsgYnl0ZXNbaSsxXSAqIDI1NilcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc2xpY2UgPSBmdW5jdGlvbiAoc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgc3RhcnQgPSBjbGFtcChzdGFydCwgbGVuLCAwKVxuICBlbmQgPSBjbGFtcChlbmQsIGxlbiwgbGVuKVxuXG4gIGlmIChCdWZmZXIuX3VzZVR5cGVkQXJyYXlzKSB7XG4gICAgcmV0dXJuIEJ1ZmZlci5fYXVnbWVudCh0aGlzLnN1YmFycmF5KHN0YXJ0LCBlbmQpKVxuICB9IGVsc2Uge1xuICAgIHZhciBzbGljZUxlbiA9IGVuZCAtIHN0YXJ0XG4gICAgdmFyIG5ld0J1ZiA9IG5ldyBCdWZmZXIoc2xpY2VMZW4sIHVuZGVmaW5lZCwgdHJ1ZSlcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNsaWNlTGVuOyBpKyspIHtcbiAgICAgIG5ld0J1ZltpXSA9IHRoaXNbaSArIHN0YXJ0XVxuICAgIH1cbiAgICByZXR1cm4gbmV3QnVmXG4gIH1cbn1cblxuLy8gYGdldGAgd2lsbCBiZSByZW1vdmVkIGluIE5vZGUgMC4xMytcbkJ1ZmZlci5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKG9mZnNldCkge1xuICBjb25zb2xlLmxvZygnLmdldCgpIGlzIGRlcHJlY2F0ZWQuIEFjY2VzcyB1c2luZyBhcnJheSBpbmRleGVzIGluc3RlYWQuJylcbiAgcmV0dXJuIHRoaXMucmVhZFVJbnQ4KG9mZnNldClcbn1cblxuLy8gYHNldGAgd2lsbCBiZSByZW1vdmVkIGluIE5vZGUgMC4xMytcbkJ1ZmZlci5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKHYsIG9mZnNldCkge1xuICBjb25zb2xlLmxvZygnLnNldCgpIGlzIGRlcHJlY2F0ZWQuIEFjY2VzcyB1c2luZyBhcnJheSBpbmRleGVzIGluc3RlYWQuJylcbiAgcmV0dXJuIHRoaXMud3JpdGVVSW50OCh2LCBvZmZzZXQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQ4ID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IHRoaXMubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aClcbiAgICByZXR1cm5cblxuICByZXR1cm4gdGhpc1tvZmZzZXRdXG59XG5cbmZ1bmN0aW9uIF9yZWFkVUludDE2IChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDEgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgdmFyIHZhbFxuICBpZiAobGl0dGxlRW5kaWFuKSB7XG4gICAgdmFsID0gYnVmW29mZnNldF1cbiAgICBpZiAob2Zmc2V0ICsgMSA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgMV0gPDwgOFxuICB9IGVsc2Uge1xuICAgIHZhbCA9IGJ1ZltvZmZzZXRdIDw8IDhcbiAgICBpZiAob2Zmc2V0ICsgMSA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgMV1cbiAgfVxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDE2KHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDE2KHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfcmVhZFVJbnQzMiAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIHZhciB2YWxcbiAgaWYgKGxpdHRsZUVuZGlhbikge1xuICAgIGlmIChvZmZzZXQgKyAyIDwgbGVuKVxuICAgICAgdmFsID0gYnVmW29mZnNldCArIDJdIDw8IDE2XG4gICAgaWYgKG9mZnNldCArIDEgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDFdIDw8IDhcbiAgICB2YWwgfD0gYnVmW29mZnNldF1cbiAgICBpZiAob2Zmc2V0ICsgMyA8IGxlbilcbiAgICAgIHZhbCA9IHZhbCArIChidWZbb2Zmc2V0ICsgM10gPDwgMjQgPj4+IDApXG4gIH0gZWxzZSB7XG4gICAgaWYgKG9mZnNldCArIDEgPCBsZW4pXG4gICAgICB2YWwgPSBidWZbb2Zmc2V0ICsgMV0gPDwgMTZcbiAgICBpZiAob2Zmc2V0ICsgMiA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgMl0gPDwgOFxuICAgIGlmIChvZmZzZXQgKyAzIDwgbGVuKVxuICAgICAgdmFsIHw9IGJ1ZltvZmZzZXQgKyAzXVxuICAgIHZhbCA9IHZhbCArIChidWZbb2Zmc2V0XSA8PCAyNCA+Pj4gMClcbiAgfVxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDMyKHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDMyKHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQ4ID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsXG4gICAgICAgICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IHRoaXMubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aClcbiAgICByZXR1cm5cblxuICB2YXIgbmVnID0gdGhpc1tvZmZzZXRdICYgMHg4MFxuICBpZiAobmVnKVxuICAgIHJldHVybiAoMHhmZiAtIHRoaXNbb2Zmc2V0XSArIDEpICogLTFcbiAgZWxzZVxuICAgIHJldHVybiB0aGlzW29mZnNldF1cbn1cblxuZnVuY3Rpb24gX3JlYWRJbnQxNiAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAxIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIHZhciB2YWwgPSBfcmVhZFVJbnQxNihidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCB0cnVlKVxuICB2YXIgbmVnID0gdmFsICYgMHg4MDAwXG4gIGlmIChuZWcpXG4gICAgcmV0dXJuICgweGZmZmYgLSB2YWwgKyAxKSAqIC0xXG4gIGVsc2VcbiAgICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2TEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRJbnQxNih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MTYodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF9yZWFkSW50MzIgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICB2YXIgdmFsID0gX3JlYWRVSW50MzIoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgdHJ1ZSlcbiAgdmFyIG5lZyA9IHZhbCAmIDB4ODAwMDAwMDBcbiAgaWYgKG5lZylcbiAgICByZXR1cm4gKDB4ZmZmZmZmZmYgLSB2YWwgKyAxKSAqIC0xXG4gIGVsc2VcbiAgICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyTEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRJbnQzMih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MzIodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF9yZWFkRmxvYXQgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgcmV0dXJuIGllZWU3NTQucmVhZChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCAyMywgNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEZsb2F0KHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0QkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRGbG9hdCh0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3JlYWREb3VibGUgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCArIDcgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgcmV0dXJuIGllZWU3NTQucmVhZChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCA1MiwgOClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlTEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWREb3VibGUodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlQkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWREb3VibGUodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50OCA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgPCB0aGlzLmxlbmd0aCwgJ3RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZ1aW50KHZhbHVlLCAweGZmKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aCkgcmV0dXJuXG5cbiAgdGhpc1tvZmZzZXRdID0gdmFsdWVcbn1cblxuZnVuY3Rpb24gX3dyaXRlVUludDE2IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDEgPCBidWYubGVuZ3RoLCAndHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnVpbnQodmFsdWUsIDB4ZmZmZilcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGZvciAodmFyIGkgPSAwLCBqID0gTWF0aC5taW4obGVuIC0gb2Zmc2V0LCAyKTsgaSA8IGo7IGkrKykge1xuICAgIGJ1ZltvZmZzZXQgKyBpXSA9XG4gICAgICAgICh2YWx1ZSAmICgweGZmIDw8ICg4ICogKGxpdHRsZUVuZGlhbiA/IGkgOiAxIC0gaSkpKSkgPj4+XG4gICAgICAgICAgICAobGl0dGxlRW5kaWFuID8gaSA6IDEgLSBpKSAqIDhcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2TEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2QkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlVUludDMyIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAndHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnVpbnQodmFsdWUsIDB4ZmZmZmZmZmYpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBmb3IgKHZhciBpID0gMCwgaiA9IE1hdGgubWluKGxlbiAtIG9mZnNldCwgNCk7IGkgPCBqOyBpKyspIHtcbiAgICBidWZbb2Zmc2V0ICsgaV0gPVxuICAgICAgICAodmFsdWUgPj4+IChsaXR0bGVFbmRpYW4gPyBpIDogMyAtIGkpICogOCkgJiAweGZmXG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQ4ID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IHRoaXMubGVuZ3RoLCAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnNpbnQodmFsdWUsIDB4N2YsIC0weDgwKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aClcbiAgICByZXR1cm5cblxuICBpZiAodmFsdWUgPj0gMClcbiAgICB0aGlzLndyaXRlVUludDgodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpXG4gIGVsc2VcbiAgICB0aGlzLndyaXRlVUludDgoMHhmZiArIHZhbHVlICsgMSwgb2Zmc2V0LCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlSW50MTYgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMSA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmc2ludCh2YWx1ZSwgMHg3ZmZmLCAtMHg4MDAwKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgaWYgKHZhbHVlID49IDApXG4gICAgX3dyaXRlVUludDE2KGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydClcbiAgZWxzZVxuICAgIF93cml0ZVVJbnQxNihidWYsIDB4ZmZmZiArIHZhbHVlICsgMSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2QkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVJbnQzMiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZzaW50KHZhbHVlLCAweDdmZmZmZmZmLCAtMHg4MDAwMDAwMClcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGlmICh2YWx1ZSA+PSAwKVxuICAgIF93cml0ZVVJbnQzMihidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpXG4gIGVsc2VcbiAgICBfd3JpdGVVSW50MzIoYnVmLCAweGZmZmZmZmZmICsgdmFsdWUgKyAxLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZUZsb2F0IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZklFRUU3NTQodmFsdWUsIDMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgsIC0zLjQwMjgyMzQ2NjM4NTI4ODZlKzM4KVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdExFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZURvdWJsZSAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyA3IDwgYnVmLmxlbmd0aCxcbiAgICAgICAgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZJRUVFNzU0KHZhbHVlLCAxLjc5NzY5MzEzNDg2MjMxNTdFKzMwOCwgLTEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4KVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgNTIsIDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG4vLyBmaWxsKHZhbHVlLCBzdGFydD0wLCBlbmQ9YnVmZmVyLmxlbmd0aClcbkJ1ZmZlci5wcm90b3R5cGUuZmlsbCA9IGZ1bmN0aW9uICh2YWx1ZSwgc3RhcnQsIGVuZCkge1xuICBpZiAoIXZhbHVlKSB2YWx1ZSA9IDBcbiAgaWYgKCFzdGFydCkgc3RhcnQgPSAwXG4gIGlmICghZW5kKSBlbmQgPSB0aGlzLmxlbmd0aFxuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgdmFsdWUgPSB2YWx1ZS5jaGFyQ29kZUF0KDApXG4gIH1cblxuICBhc3NlcnQodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiAhaXNOYU4odmFsdWUpLCAndmFsdWUgaXMgbm90IGEgbnVtYmVyJylcbiAgYXNzZXJ0KGVuZCA+PSBzdGFydCwgJ2VuZCA8IHN0YXJ0JylcblxuICAvLyBGaWxsIDAgYnl0ZXM7IHdlJ3JlIGRvbmVcbiAgaWYgKGVuZCA9PT0gc3RhcnQpIHJldHVyblxuICBpZiAodGhpcy5sZW5ndGggPT09IDApIHJldHVyblxuXG4gIGFzc2VydChzdGFydCA+PSAwICYmIHN0YXJ0IDwgdGhpcy5sZW5ndGgsICdzdGFydCBvdXQgb2YgYm91bmRzJylcbiAgYXNzZXJ0KGVuZCA+PSAwICYmIGVuZCA8PSB0aGlzLmxlbmd0aCwgJ2VuZCBvdXQgb2YgYm91bmRzJylcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgIHRoaXNbaV0gPSB2YWx1ZVxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5zcGVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIG91dCA9IFtdXG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgb3V0W2ldID0gdG9IZXgodGhpc1tpXSlcbiAgICBpZiAoaSA9PT0gZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFUykge1xuICAgICAgb3V0W2kgKyAxXSA9ICcuLi4nXG4gICAgICBicmVha1xuICAgIH1cbiAgfVxuICByZXR1cm4gJzxCdWZmZXIgJyArIG91dC5qb2luKCcgJykgKyAnPidcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IGBBcnJheUJ1ZmZlcmAgd2l0aCB0aGUgKmNvcGllZCogbWVtb3J5IG9mIHRoZSBidWZmZXIgaW5zdGFuY2UuXG4gKiBBZGRlZCBpbiBOb2RlIDAuMTIuIE9ubHkgYXZhaWxhYmxlIGluIGJyb3dzZXJzIHRoYXQgc3VwcG9ydCBBcnJheUJ1ZmZlci5cbiAqL1xuQnVmZmVyLnByb3RvdHlwZS50b0FycmF5QnVmZmVyID0gZnVuY3Rpb24gKCkge1xuICBpZiAodHlwZW9mIFVpbnQ4QXJyYXkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgaWYgKEJ1ZmZlci5fdXNlVHlwZWRBcnJheXMpIHtcbiAgICAgIHJldHVybiAobmV3IEJ1ZmZlcih0aGlzKSkuYnVmZmVyXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBidWYgPSBuZXcgVWludDhBcnJheSh0aGlzLmxlbmd0aClcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBidWYubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEpXG4gICAgICAgIGJ1ZltpXSA9IHRoaXNbaV1cbiAgICAgIHJldHVybiBidWYuYnVmZmVyXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcignQnVmZmVyLnRvQXJyYXlCdWZmZXIgbm90IHN1cHBvcnRlZCBpbiB0aGlzIGJyb3dzZXInKVxuICB9XG59XG5cbi8vIEhFTFBFUiBGVU5DVElPTlNcbi8vID09PT09PT09PT09PT09PT1cblxuZnVuY3Rpb24gc3RyaW5ndHJpbSAoc3RyKSB7XG4gIGlmIChzdHIudHJpbSkgcmV0dXJuIHN0ci50cmltKClcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJylcbn1cblxudmFyIEJQID0gQnVmZmVyLnByb3RvdHlwZVxuXG4vKipcbiAqIEF1Z21lbnQgYSBVaW50OEFycmF5ICppbnN0YW5jZSogKG5vdCB0aGUgVWludDhBcnJheSBjbGFzcyEpIHdpdGggQnVmZmVyIG1ldGhvZHNcbiAqL1xuQnVmZmVyLl9hdWdtZW50ID0gZnVuY3Rpb24gKGFycikge1xuICBhcnIuX2lzQnVmZmVyID0gdHJ1ZVxuXG4gIC8vIHNhdmUgcmVmZXJlbmNlIHRvIG9yaWdpbmFsIFVpbnQ4QXJyYXkgZ2V0L3NldCBtZXRob2RzIGJlZm9yZSBvdmVyd3JpdGluZ1xuICBhcnIuX2dldCA9IGFyci5nZXRcbiAgYXJyLl9zZXQgPSBhcnIuc2V0XG5cbiAgLy8gZGVwcmVjYXRlZCwgd2lsbCBiZSByZW1vdmVkIGluIG5vZGUgMC4xMytcbiAgYXJyLmdldCA9IEJQLmdldFxuICBhcnIuc2V0ID0gQlAuc2V0XG5cbiAgYXJyLndyaXRlID0gQlAud3JpdGVcbiAgYXJyLnRvU3RyaW5nID0gQlAudG9TdHJpbmdcbiAgYXJyLnRvTG9jYWxlU3RyaW5nID0gQlAudG9TdHJpbmdcbiAgYXJyLnRvSlNPTiA9IEJQLnRvSlNPTlxuICBhcnIuY29weSA9IEJQLmNvcHlcbiAgYXJyLnNsaWNlID0gQlAuc2xpY2VcbiAgYXJyLnJlYWRVSW50OCA9IEJQLnJlYWRVSW50OFxuICBhcnIucmVhZFVJbnQxNkxFID0gQlAucmVhZFVJbnQxNkxFXG4gIGFyci5yZWFkVUludDE2QkUgPSBCUC5yZWFkVUludDE2QkVcbiAgYXJyLnJlYWRVSW50MzJMRSA9IEJQLnJlYWRVSW50MzJMRVxuICBhcnIucmVhZFVJbnQzMkJFID0gQlAucmVhZFVJbnQzMkJFXG4gIGFyci5yZWFkSW50OCA9IEJQLnJlYWRJbnQ4XG4gIGFyci5yZWFkSW50MTZMRSA9IEJQLnJlYWRJbnQxNkxFXG4gIGFyci5yZWFkSW50MTZCRSA9IEJQLnJlYWRJbnQxNkJFXG4gIGFyci5yZWFkSW50MzJMRSA9IEJQLnJlYWRJbnQzMkxFXG4gIGFyci5yZWFkSW50MzJCRSA9IEJQLnJlYWRJbnQzMkJFXG4gIGFyci5yZWFkRmxvYXRMRSA9IEJQLnJlYWRGbG9hdExFXG4gIGFyci5yZWFkRmxvYXRCRSA9IEJQLnJlYWRGbG9hdEJFXG4gIGFyci5yZWFkRG91YmxlTEUgPSBCUC5yZWFkRG91YmxlTEVcbiAgYXJyLnJlYWREb3VibGVCRSA9IEJQLnJlYWREb3VibGVCRVxuICBhcnIud3JpdGVVSW50OCA9IEJQLndyaXRlVUludDhcbiAgYXJyLndyaXRlVUludDE2TEUgPSBCUC53cml0ZVVJbnQxNkxFXG4gIGFyci53cml0ZVVJbnQxNkJFID0gQlAud3JpdGVVSW50MTZCRVxuICBhcnIud3JpdGVVSW50MzJMRSA9IEJQLndyaXRlVUludDMyTEVcbiAgYXJyLndyaXRlVUludDMyQkUgPSBCUC53cml0ZVVJbnQzMkJFXG4gIGFyci53cml0ZUludDggPSBCUC53cml0ZUludDhcbiAgYXJyLndyaXRlSW50MTZMRSA9IEJQLndyaXRlSW50MTZMRVxuICBhcnIud3JpdGVJbnQxNkJFID0gQlAud3JpdGVJbnQxNkJFXG4gIGFyci53cml0ZUludDMyTEUgPSBCUC53cml0ZUludDMyTEVcbiAgYXJyLndyaXRlSW50MzJCRSA9IEJQLndyaXRlSW50MzJCRVxuICBhcnIud3JpdGVGbG9hdExFID0gQlAud3JpdGVGbG9hdExFXG4gIGFyci53cml0ZUZsb2F0QkUgPSBCUC53cml0ZUZsb2F0QkVcbiAgYXJyLndyaXRlRG91YmxlTEUgPSBCUC53cml0ZURvdWJsZUxFXG4gIGFyci53cml0ZURvdWJsZUJFID0gQlAud3JpdGVEb3VibGVCRVxuICBhcnIuZmlsbCA9IEJQLmZpbGxcbiAgYXJyLmluc3BlY3QgPSBCUC5pbnNwZWN0XG4gIGFyci50b0FycmF5QnVmZmVyID0gQlAudG9BcnJheUJ1ZmZlclxuXG4gIHJldHVybiBhcnJcbn1cblxuLy8gc2xpY2Uoc3RhcnQsIGVuZClcbmZ1bmN0aW9uIGNsYW1wIChpbmRleCwgbGVuLCBkZWZhdWx0VmFsdWUpIHtcbiAgaWYgKHR5cGVvZiBpbmRleCAhPT0gJ251bWJlcicpIHJldHVybiBkZWZhdWx0VmFsdWVcbiAgaW5kZXggPSB+fmluZGV4OyAgLy8gQ29lcmNlIHRvIGludGVnZXIuXG4gIGlmIChpbmRleCA+PSBsZW4pIHJldHVybiBsZW5cbiAgaWYgKGluZGV4ID49IDApIHJldHVybiBpbmRleFxuICBpbmRleCArPSBsZW5cbiAgaWYgKGluZGV4ID49IDApIHJldHVybiBpbmRleFxuICByZXR1cm4gMFxufVxuXG5mdW5jdGlvbiBjb2VyY2UgKGxlbmd0aCkge1xuICAvLyBDb2VyY2UgbGVuZ3RoIHRvIGEgbnVtYmVyIChwb3NzaWJseSBOYU4pLCByb3VuZCB1cFxuICAvLyBpbiBjYXNlIGl0J3MgZnJhY3Rpb25hbCAoZS5nLiAxMjMuNDU2KSB0aGVuIGRvIGFcbiAgLy8gZG91YmxlIG5lZ2F0ZSB0byBjb2VyY2UgYSBOYU4gdG8gMC4gRWFzeSwgcmlnaHQ/XG4gIGxlbmd0aCA9IH5+TWF0aC5jZWlsKCtsZW5ndGgpXG4gIHJldHVybiBsZW5ndGggPCAwID8gMCA6IGxlbmd0aFxufVxuXG5mdW5jdGlvbiBpc0FycmF5IChzdWJqZWN0KSB7XG4gIHJldHVybiAoQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAoc3ViamVjdCkge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoc3ViamVjdCkgPT09ICdbb2JqZWN0IEFycmF5XSdcbiAgfSkoc3ViamVjdClcbn1cblxuZnVuY3Rpb24gaXNBcnJheWlzaCAoc3ViamVjdCkge1xuICByZXR1cm4gaXNBcnJheShzdWJqZWN0KSB8fCBCdWZmZXIuaXNCdWZmZXIoc3ViamVjdCkgfHxcbiAgICAgIHN1YmplY3QgJiYgdHlwZW9mIHN1YmplY3QgPT09ICdvYmplY3QnICYmXG4gICAgICB0eXBlb2Ygc3ViamVjdC5sZW5ndGggPT09ICdudW1iZXInXG59XG5cbmZ1bmN0aW9uIHRvSGV4IChuKSB7XG4gIGlmIChuIDwgMTYpIHJldHVybiAnMCcgKyBuLnRvU3RyaW5nKDE2KVxuICByZXR1cm4gbi50b1N0cmluZygxNilcbn1cblxuZnVuY3Rpb24gdXRmOFRvQnl0ZXMgKHN0cikge1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgYiA9IHN0ci5jaGFyQ29kZUF0KGkpXG4gICAgaWYgKGIgPD0gMHg3RilcbiAgICAgIGJ5dGVBcnJheS5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpKVxuICAgIGVsc2Uge1xuICAgICAgdmFyIHN0YXJ0ID0gaVxuICAgICAgaWYgKGIgPj0gMHhEODAwICYmIGIgPD0gMHhERkZGKSBpKytcbiAgICAgIHZhciBoID0gZW5jb2RlVVJJQ29tcG9uZW50KHN0ci5zbGljZShzdGFydCwgaSsxKSkuc3Vic3RyKDEpLnNwbGl0KCclJylcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgaC5sZW5ndGg7IGorKylcbiAgICAgICAgYnl0ZUFycmF5LnB1c2gocGFyc2VJbnQoaFtqXSwgMTYpKVxuICAgIH1cbiAgfVxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIGFzY2lpVG9CeXRlcyAoc3RyKSB7XG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgIC8vIE5vZGUncyBjb2RlIHNlZW1zIHRvIGJlIGRvaW5nIHRoaXMgYW5kIG5vdCAmIDB4N0YuLlxuICAgIGJ5dGVBcnJheS5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpICYgMHhGRilcbiAgfVxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIHV0ZjE2bGVUb0J5dGVzIChzdHIpIHtcbiAgdmFyIGMsIGhpLCBsb1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICBjID0gc3RyLmNoYXJDb2RlQXQoaSlcbiAgICBoaSA9IGMgPj4gOFxuICAgIGxvID0gYyAlIDI1NlxuICAgIGJ5dGVBcnJheS5wdXNoKGxvKVxuICAgIGJ5dGVBcnJheS5wdXNoKGhpKVxuICB9XG5cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiBiYXNlNjRUb0J5dGVzIChzdHIpIHtcbiAgcmV0dXJuIGJhc2U2NC50b0J5dGVBcnJheShzdHIpXG59XG5cbmZ1bmN0aW9uIGJsaXRCdWZmZXIgKHNyYywgZHN0LCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgcG9zXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoKGkgKyBvZmZzZXQgPj0gZHN0Lmxlbmd0aCkgfHwgKGkgPj0gc3JjLmxlbmd0aCkpXG4gICAgICBicmVha1xuICAgIGRzdFtpICsgb2Zmc2V0XSA9IHNyY1tpXVxuICB9XG4gIHJldHVybiBpXG59XG5cbmZ1bmN0aW9uIGRlY29kZVV0ZjhDaGFyIChzdHIpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHN0cilcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoMHhGRkZEKSAvLyBVVEYgOCBpbnZhbGlkIGNoYXJcbiAgfVxufVxuXG4vKlxuICogV2UgaGF2ZSB0byBtYWtlIHN1cmUgdGhhdCB0aGUgdmFsdWUgaXMgYSB2YWxpZCBpbnRlZ2VyLiBUaGlzIG1lYW5zIHRoYXQgaXRcbiAqIGlzIG5vbi1uZWdhdGl2ZS4gSXQgaGFzIG5vIGZyYWN0aW9uYWwgY29tcG9uZW50IGFuZCB0aGF0IGl0IGRvZXMgbm90XG4gKiBleGNlZWQgdGhlIG1heGltdW0gYWxsb3dlZCB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gdmVyaWZ1aW50ICh2YWx1ZSwgbWF4KSB7XG4gIGFzc2VydCh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInLCAnY2Fubm90IHdyaXRlIGEgbm9uLW51bWJlciBhcyBhIG51bWJlcicpXG4gIGFzc2VydCh2YWx1ZSA+PSAwLCAnc3BlY2lmaWVkIGEgbmVnYXRpdmUgdmFsdWUgZm9yIHdyaXRpbmcgYW4gdW5zaWduZWQgdmFsdWUnKVxuICBhc3NlcnQodmFsdWUgPD0gbWF4LCAndmFsdWUgaXMgbGFyZ2VyIHRoYW4gbWF4aW11bSB2YWx1ZSBmb3IgdHlwZScpXG4gIGFzc2VydChNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWUsICd2YWx1ZSBoYXMgYSBmcmFjdGlvbmFsIGNvbXBvbmVudCcpXG59XG5cbmZ1bmN0aW9uIHZlcmlmc2ludCAodmFsdWUsIG1heCwgbWluKSB7XG4gIGFzc2VydCh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInLCAnY2Fubm90IHdyaXRlIGEgbm9uLW51bWJlciBhcyBhIG51bWJlcicpXG4gIGFzc2VydCh2YWx1ZSA8PSBtYXgsICd2YWx1ZSBsYXJnZXIgdGhhbiBtYXhpbXVtIGFsbG93ZWQgdmFsdWUnKVxuICBhc3NlcnQodmFsdWUgPj0gbWluLCAndmFsdWUgc21hbGxlciB0aGFuIG1pbmltdW0gYWxsb3dlZCB2YWx1ZScpXG4gIGFzc2VydChNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWUsICd2YWx1ZSBoYXMgYSBmcmFjdGlvbmFsIGNvbXBvbmVudCcpXG59XG5cbmZ1bmN0aW9uIHZlcmlmSUVFRTc1NCAodmFsdWUsIG1heCwgbWluKSB7XG4gIGFzc2VydCh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInLCAnY2Fubm90IHdyaXRlIGEgbm9uLW51bWJlciBhcyBhIG51bWJlcicpXG4gIGFzc2VydCh2YWx1ZSA8PSBtYXgsICd2YWx1ZSBsYXJnZXIgdGhhbiBtYXhpbXVtIGFsbG93ZWQgdmFsdWUnKVxuICBhc3NlcnQodmFsdWUgPj0gbWluLCAndmFsdWUgc21hbGxlciB0aGFuIG1pbmltdW0gYWxsb3dlZCB2YWx1ZScpXG59XG5cbmZ1bmN0aW9uIGFzc2VydCAodGVzdCwgbWVzc2FnZSkge1xuICBpZiAoIXRlc3QpIHRocm93IG5ldyBFcnJvcihtZXNzYWdlIHx8ICdGYWlsZWQgYXNzZXJ0aW9uJylcbn1cblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJGVDVPUnNcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvYnVmZmVyL2luZGV4LmpzXCIsXCIvLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2J1ZmZlclwiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbmV4cG9ydHMucmVhZCA9IGZ1bmN0aW9uIChidWZmZXIsIG9mZnNldCwgaXNMRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtXG4gIHZhciBlTGVuID0gbkJ5dGVzICogOCAtIG1MZW4gLSAxXG4gIHZhciBlTWF4ID0gKDEgPDwgZUxlbikgLSAxXG4gIHZhciBlQmlhcyA9IGVNYXggPj4gMVxuICB2YXIgbkJpdHMgPSAtN1xuICB2YXIgaSA9IGlzTEUgPyAobkJ5dGVzIC0gMSkgOiAwXG4gIHZhciBkID0gaXNMRSA/IC0xIDogMVxuICB2YXIgcyA9IGJ1ZmZlcltvZmZzZXQgKyBpXVxuXG4gIGkgKz0gZFxuXG4gIGUgPSBzICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpXG4gIHMgPj49ICgtbkJpdHMpXG4gIG5CaXRzICs9IGVMZW5cbiAgZm9yICg7IG5CaXRzID4gMDsgZSA9IGUgKiAyNTYgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCkge31cblxuICBtID0gZSAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBlID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBtTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IG0gPSBtICogMjU2ICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpIHt9XG5cbiAgaWYgKGUgPT09IDApIHtcbiAgICBlID0gMSAtIGVCaWFzXG4gIH0gZWxzZSBpZiAoZSA9PT0gZU1heCkge1xuICAgIHJldHVybiBtID8gTmFOIDogKChzID8gLTEgOiAxKSAqIEluZmluaXR5KVxuICB9IGVsc2Uge1xuICAgIG0gPSBtICsgTWF0aC5wb3coMiwgbUxlbilcbiAgICBlID0gZSAtIGVCaWFzXG4gIH1cbiAgcmV0dXJuIChzID8gLTEgOiAxKSAqIG0gKiBNYXRoLnBvdygyLCBlIC0gbUxlbilcbn1cblxuZXhwb3J0cy53cml0ZSA9IGZ1bmN0aW9uIChidWZmZXIsIHZhbHVlLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbSwgY1xuICB2YXIgZUxlbiA9IG5CeXRlcyAqIDggLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIHJ0ID0gKG1MZW4gPT09IDIzID8gTWF0aC5wb3coMiwgLTI0KSAtIE1hdGgucG93KDIsIC03NykgOiAwKVxuICB2YXIgaSA9IGlzTEUgPyAwIDogKG5CeXRlcyAtIDEpXG4gIHZhciBkID0gaXNMRSA/IDEgOiAtMVxuICB2YXIgcyA9IHZhbHVlIDwgMCB8fCAodmFsdWUgPT09IDAgJiYgMSAvIHZhbHVlIDwgMCkgPyAxIDogMFxuXG4gIHZhbHVlID0gTWF0aC5hYnModmFsdWUpXG5cbiAgaWYgKGlzTmFOKHZhbHVlKSB8fCB2YWx1ZSA9PT0gSW5maW5pdHkpIHtcbiAgICBtID0gaXNOYU4odmFsdWUpID8gMSA6IDBcbiAgICBlID0gZU1heFxuICB9IGVsc2Uge1xuICAgIGUgPSBNYXRoLmZsb29yKE1hdGgubG9nKHZhbHVlKSAvIE1hdGguTE4yKVxuICAgIGlmICh2YWx1ZSAqIChjID0gTWF0aC5wb3coMiwgLWUpKSA8IDEpIHtcbiAgICAgIGUtLVxuICAgICAgYyAqPSAyXG4gICAgfVxuICAgIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgdmFsdWUgKz0gcnQgLyBjXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlICs9IHJ0ICogTWF0aC5wb3coMiwgMSAtIGVCaWFzKVxuICAgIH1cbiAgICBpZiAodmFsdWUgKiBjID49IDIpIHtcbiAgICAgIGUrK1xuICAgICAgYyAvPSAyXG4gICAgfVxuXG4gICAgaWYgKGUgKyBlQmlhcyA+PSBlTWF4KSB7XG4gICAgICBtID0gMFxuICAgICAgZSA9IGVNYXhcbiAgICB9IGVsc2UgaWYgKGUgKyBlQmlhcyA+PSAxKSB7XG4gICAgICBtID0gKHZhbHVlICogYyAtIDEpICogTWF0aC5wb3coMiwgbUxlbilcbiAgICAgIGUgPSBlICsgZUJpYXNcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IHZhbHVlICogTWF0aC5wb3coMiwgZUJpYXMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pXG4gICAgICBlID0gMFxuICAgIH1cbiAgfVxuXG4gIGZvciAoOyBtTGVuID49IDg7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IG0gJiAweGZmLCBpICs9IGQsIG0gLz0gMjU2LCBtTGVuIC09IDgpIHt9XG5cbiAgZSA9IChlIDw8IG1MZW4pIHwgbVxuICBlTGVuICs9IG1MZW5cbiAgZm9yICg7IGVMZW4gPiAwOyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBlICYgMHhmZiwgaSArPSBkLCBlIC89IDI1NiwgZUxlbiAtPSA4KSB7fVxuXG4gIGJ1ZmZlcltvZmZzZXQgKyBpIC0gZF0gfD0gcyAqIDEyOFxufVxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIkZUNU9Sc1wiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9pZWVlNzU0L2luZGV4LmpzXCIsXCIvLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2llZWU3NTRcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4vLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5wcm9jZXNzLm5leHRUaWNrID0gKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2FuU2V0SW1tZWRpYXRlID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cuc2V0SW1tZWRpYXRlO1xuICAgIHZhciBjYW5Qb3N0ID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cucG9zdE1lc3NhZ2UgJiYgd2luZG93LmFkZEV2ZW50TGlzdGVuZXJcbiAgICA7XG5cbiAgICBpZiAoY2FuU2V0SW1tZWRpYXRlKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoZikgeyByZXR1cm4gd2luZG93LnNldEltbWVkaWF0ZShmKSB9O1xuICAgIH1cblxuICAgIGlmIChjYW5Qb3N0KSB7XG4gICAgICAgIHZhciBxdWV1ZSA9IFtdO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgdmFyIHNvdXJjZSA9IGV2LnNvdXJjZTtcbiAgICAgICAgICAgIGlmICgoc291cmNlID09PSB3aW5kb3cgfHwgc291cmNlID09PSBudWxsKSAmJiBldi5kYXRhID09PSAncHJvY2Vzcy10aWNrJykge1xuICAgICAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIGlmIChxdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmbiA9IHF1ZXVlLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgICAgIGZuKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0cnVlKTtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgICAgIHF1ZXVlLnB1c2goZm4pO1xuICAgICAgICAgICAgd2luZG93LnBvc3RNZXNzYWdlKCdwcm9jZXNzLXRpY2snLCAnKicpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICBzZXRUaW1lb3V0KGZuLCAwKTtcbiAgICB9O1xufSkoKTtcblxucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59XG5cbi8vIFRPRE8oc2h0eWxtYW4pXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJGVDVPUnNcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzXCIsXCIvLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Byb2Nlc3NcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4ndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIF90b0NvbnN1bWFibGVBcnJheShhcnIpIHsgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgeyBmb3IgKHZhciBpID0gMCwgYXJyMiA9IEFycmF5KGFyci5sZW5ndGgpOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7IGFycjJbaV0gPSBhcnJbaV07IH0gcmV0dXJuIGFycjI7IH0gZWxzZSB7IHJldHVybiBBcnJheS5mcm9tKGFycik7IH0gfVxuXG52YXIgdGltZSA9IDc1MDtcbnZhciBzZWN0aW9uM0lkeCA9IDA7XG52YXIgc2VjdGlvbjRJZHggPSAwO1xuXG52YXIgbWFzdGVyT2JqID0ge1xuXHRzZWN0aW9uMkN1cnJlbnRJZHg6IDAsXG5cdHNlY3Rpb24xQ3VycmVudElkeDogMCxcblx0c2VjdGlvbjM6IHtcblx0XHRhdXRvbWF0ZTogJycsXG5cdFx0aXNBdXRvbWF0ZWQ6IGZhbHNlXG5cdH0sXG5cdHNlY3Rpb240OiB7XG5cdFx0YXV0b21hdGU6ICcnLFxuXHRcdGlzQXV0b21hdGVkOiBmYWxzZVxuXHR9LFxuXHRiYXNrZXRiYWxsOiB7IGxvb3BBbW91bnQ6IDEgfSxcblx0Zm9vdGJhbGw6IHsgbG9vcEFtb3VudDogMSB9LFxuXHR0ZW5uaXM6IHsgbG9vcEFtb3VudDogMSB9LFxuXHRiYXNlYmFsbDogeyBsb29wQW1vdW50OiAxIH0sXG5cdGZhbjogeyBsb29wQW1vdW50OiAxIH1cbn07XG5cbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcblx0Ly8gRklYRVMgSVNTVUUgV0lUSCBISUVHSFQgT04gSVBIT05FIFguIG9uZXBhZ2Vfc2Nyb2xsIFBMVUdJTiBET0VTIE5PVCBXT1JLIFdJVEggJ2hlaWdodDogMTAwJTsnIFxcXFxcblx0JCgnI3Njcm9sbGVyV3JhcHBlcicpLmNzcyh7ICdoZWlnaHQnOiAkKCdib2R5JykuaGVpZ2h0KCkgKyAncHgnIH0pO1xuXG5cdGlmICh3aW5kb3cuaW5uZXJXaWR0aCA8IDgwMCkge1xuXHRcdC8vIERFTEVURSBWSURFTyBPTiBNT0JJTEUgXFxcXFxuXHRcdCQoJyN2aWRlbycpLnJlbW92ZSgpO1xuXHRcdC8vIElGIFRIRSBXSU5ET1cgSVMgU01BTExFUiBUSEFUIDgwMFBYIEZFVENIIFRIRSBKU09OIEZPUiBUSEUgSUNPTiBBTklNQVRJT04gQU5EIEFUQUNIIFRIRSBBTklNQVRJT05TIFNFUEVSQVRFTFkgVE8gbWFzdGVyT2JqIFxcXFxcblx0XHRmZXRjaCgnYXNzZXRzL2pzL0ZhbnRhc3RlY19TcHJpdGVfU2hlZXQuanNvbicpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG5cdFx0XHRyZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuXHRcdH0pLnRoZW4oZnVuY3Rpb24gKHNwcml0ZU9iaikge1xuXHRcdFx0dmFyIElkbGVGcmFtZSA9IGZpbHRlckJ5VmFsdWUoc3ByaXRlT2JqLmZyYW1lcywgJ2lkbGUnKTtcblx0XHRcdG1hc3Rlck9iai5mb290YmFsbC5hbmltYXRpb25BcnJheSA9IFtdLmNvbmNhdChfdG9Db25zdW1hYmxlQXJyYXkoSWRsZUZyYW1lKSwgX3RvQ29uc3VtYWJsZUFycmF5KGZpbHRlckJ5VmFsdWUoc3ByaXRlT2JqLmZyYW1lcywgJ2Zvb3RiYWxsJykpKTtcblx0XHRcdG1hc3Rlck9iai50ZW5uaXMuYW5pbWF0aW9uQXJyYXkgPSBbXS5jb25jYXQoX3RvQ29uc3VtYWJsZUFycmF5KElkbGVGcmFtZSksIF90b0NvbnN1bWFibGVBcnJheShmaWx0ZXJCeVZhbHVlKHNwcml0ZU9iai5mcmFtZXMsICd0ZW5uaXMnKSkpO1xuXHRcdFx0bWFzdGVyT2JqLmJhc2ViYWxsLmFuaW1hdGlvbkFycmF5ID0gW10uY29uY2F0KF90b0NvbnN1bWFibGVBcnJheShJZGxlRnJhbWUpLCBfdG9Db25zdW1hYmxlQXJyYXkoZmlsdGVyQnlWYWx1ZShzcHJpdGVPYmouZnJhbWVzLCAnYmFzZWJhbGwnKSkpO1xuXHRcdFx0bWFzdGVyT2JqLmJhc2tldGJhbGwuYW5pbWF0aW9uQXJyYXkgPSBbXS5jb25jYXQoX3RvQ29uc3VtYWJsZUFycmF5KElkbGVGcmFtZSksIF90b0NvbnN1bWFibGVBcnJheShmaWx0ZXJCeVZhbHVlKHNwcml0ZU9iai5mcmFtZXMsICdiYXNrZXQnKSkpO1xuXHRcdFx0bWFzdGVyT2JqLmZhbi5hbmltYXRpb25BcnJheSA9IFtdLmNvbmNhdChfdG9Db25zdW1hYmxlQXJyYXkoSWRsZUZyYW1lKSwgX3RvQ29uc3VtYWJsZUFycmF5KGZpbHRlckJ5VmFsdWUoc3ByaXRlT2JqLmZyYW1lcywgJ2ZhbicpKSk7XG5cdFx0XHQvLyBDQUxMIEFOSU1BVE9SIFNFVFVQIEZVTkNUSU9OIEFORCBTVEFSVCBUSEUgSU1BR0UgU0xJREVTSE9XIEZPUiBTRUNUSU9OIDEgKEhPTUVQQUdFKSBcXFxcXHRcdFx0XG5cdFx0XHRhbmltYXRvclNldHVwKCk7XG5cdFx0XHRpbWFnZUNvbnRyb2xlcihtYXN0ZXJPYmosIDEpO1xuXHRcdFx0Ly8gQ0FMTCBUSEUgaW1hZ2VDb250cm9sZXIgRlVOQ1RJT04gRVZFUlkgNSBTRUNPTkRTIFRPIENIQU5HRSBUSEUgSU1BR0UgRk9SIFNFQ1RJT04gMSAoSE9NRVBBR0UpIFxcXFxcblx0XHRcdHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0aW1hZ2VDb250cm9sZXIobWFzdGVyT2JqLCAxKTtcblx0XHRcdH0sIDUwMDApO1xuXHRcdH0pO1xuXHR9XG5cdC8vIEZVTkNUSU9OIFRPIFNFUEVSQVRFIFRIRSBBTklNQVRJT04gRlJBTUVTIEJZIE5BTUUgXFxcXFxuXHR2YXIgZmlsdGVyQnlWYWx1ZSA9IGZ1bmN0aW9uIGZpbHRlckJ5VmFsdWUoYXJyYXksIHN0cmluZykge1xuXHRcdHJldHVybiBhcnJheS5maWx0ZXIoZnVuY3Rpb24gKG8pIHtcblx0XHRcdHJldHVybiB0eXBlb2Ygb1snZmlsZW5hbWUnXSA9PT0gJ3N0cmluZycgJiYgb1snZmlsZW5hbWUnXS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHN0cmluZy50b0xvd2VyQ2FzZSgpKTtcblx0XHR9KTtcblx0fTtcblx0Ly8gR0VORVJJQyBTRVRVUCBGVU5DVElPTiBGT1IgQURESU5HIFZFTkRPUiBQUkVGSVhFUyBUTyByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgXFxcXFxuXHR2YXIgYW5pbWF0b3JTZXR1cCA9IGZ1bmN0aW9uIGFuaW1hdG9yU2V0dXAoKSB7XG5cblx0XHR2YXIgbGFzdFRpbWUgPSAwO1xuXHRcdHZhciB2ZW5kb3JzID0gWydtcycsICdtb3onLCAnd2Via2l0JywgJ28nXTtcblx0XHRmb3IgKHZhciB4ID0gMDsgeCA8IHZlbmRvcnMubGVuZ3RoICYmICF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lOyArK3gpIHtcblx0XHRcdHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSB3aW5kb3dbdmVuZG9yc1t4XSArICdSZXF1ZXN0QW5pbWF0aW9uRnJhbWUnXTtcblx0XHRcdHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ0NhbmNlbEFuaW1hdGlvbkZyYW1lJ10gfHwgd2luZG93W3ZlbmRvcnNbeF0gKyAnQ2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ107XG5cdFx0fVxuXG5cdFx0aWYgKCF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24gKGNhbGxiYWNrLCBlbGVtZW50KSB7XG5cdFx0XHR2YXIgY3VyclRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblx0XHRcdHZhciB0aW1lVG9DYWxsID0gTWF0aC5tYXgoMCwgMTYgLSAoY3VyclRpbWUgLSBsYXN0VGltZSkpO1xuXHRcdFx0dmFyIGlkID0gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRjYWxsYmFjayhjdXJyVGltZSArIHRpbWVUb0NhbGwpO1xuXHRcdFx0fSwgdGltZVRvQ2FsbCk7XG5cdFx0XHRsYXN0VGltZSA9IGN1cnJUaW1lICsgdGltZVRvQ2FsbDtcblx0XHRcdHJldHVybiBpZDtcblx0XHR9O1xuXG5cdFx0aWYgKCF3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUpIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uIChpZCkge1xuXHRcdFx0Y2xlYXJUaW1lb3V0KGlkKTtcblx0XHR9O1xuXHR9O1xuXG5cdHZhciBhbmltYXRvciA9IGZ1bmN0aW9uIGFuaW1hdG9yKGFuaW1hdGlvbk9iaikge1xuXG5cdFx0dmFyIGRhbmNpbmdJY29uLCBzcHJpdGVJbWFnZSwgY2FudmFzO1xuXHRcdC8vIEZVTkNUSU9OIFRPIFBBU1MgVE8gcmVxdWVzdEFuaW1hdGlvbkZyYW1lIFxcXFxcblx0XHRmdW5jdGlvbiBnYW1lTG9vcCgpIHtcblx0XHRcdCQoJyNsb2FkaW5nJykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuXHRcdFx0YW5pbWF0aW9uT2JqLmxvb3BJZCA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZ2FtZUxvb3ApO1xuXHRcdFx0ZGFuY2luZ0ljb24udXBkYXRlKCk7XG5cdFx0XHRkYW5jaW5nSWNvbi5yZW5kZXIoKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzcHJpdGUob3B0aW9ucykge1xuXG5cdFx0XHR2YXIgdGhhdCA9IHt9LFxuXHRcdFx0ICAgIGZyYW1lSW5kZXggPSAwLFxuXHRcdFx0ICAgIHRpY2tDb3VudCA9IDAsXG5cdFx0XHQgICAgbG9vcENvdW50ID0gMCxcblx0XHRcdCAgICB0aWNrc1BlckZyYW1lID0gb3B0aW9ucy50aWNrc1BlckZyYW1lIHx8IDAsXG5cdFx0XHQgICAgbnVtYmVyT2ZGcmFtZXMgPSBvcHRpb25zLm51bWJlck9mRnJhbWVzIHx8IDE7XG5cblx0XHRcdHRoYXQuY29udGV4dCA9IG9wdGlvbnMuY29udGV4dDtcblx0XHRcdHRoYXQud2lkdGggPSBvcHRpb25zLndpZHRoO1xuXHRcdFx0dGhhdC5oZWlnaHQgPSBvcHRpb25zLmhlaWdodDtcblx0XHRcdHRoYXQuaW1hZ2UgPSBvcHRpb25zLmltYWdlO1xuXHRcdFx0dGhhdC5sb29wcyA9IG9wdGlvbnMubG9vcHM7XG5cblx0XHRcdHRoYXQudXBkYXRlID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRcdHRpY2tDb3VudCArPSAxO1xuXG5cdFx0XHRcdGlmICh0aWNrQ291bnQgPiB0aWNrc1BlckZyYW1lKSB7XG5cblx0XHRcdFx0XHR0aWNrQ291bnQgPSAwO1xuXHRcdFx0XHRcdC8vIElmIHRoZSBjdXJyZW50IGZyYW1lIGluZGV4IGlzIGluIHJhbmdlXG5cdFx0XHRcdFx0aWYgKGZyYW1lSW5kZXggPCBudW1iZXJPZkZyYW1lcyAtIDEpIHtcblx0XHRcdFx0XHRcdC8vIEdvIHRvIHRoZSBuZXh0IGZyYW1lXG5cdFx0XHRcdFx0XHRmcmFtZUluZGV4ICs9IDE7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGxvb3BDb3VudCsrO1xuXHRcdFx0XHRcdFx0ZnJhbWVJbmRleCA9IDA7XG5cblx0XHRcdFx0XHRcdGlmIChsb29wQ291bnQgPT09IHRoYXQubG9vcHMpIHtcblx0XHRcdFx0XHRcdFx0d2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKGFuaW1hdGlvbk9iai5sb29wSWQpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0dGhhdC5yZW5kZXIgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRcdFx0Ly8gQ2xlYXIgdGhlIGNhbnZhc1xuXHRcdFx0XHR0aGF0LmNvbnRleHQuY2xlYXJSZWN0KDAsIDAsIHRoYXQud2lkdGgsIHRoYXQuaGVpZ2h0KTtcblxuXHRcdFx0XHR0aGF0LmNvbnRleHQuZHJhd0ltYWdlKHRoYXQuaW1hZ2UsIGFuaW1hdGlvbk9iai5hbmltYXRpb25BcnJheVtmcmFtZUluZGV4XS5mcmFtZS54LCBhbmltYXRpb25PYmouYW5pbWF0aW9uQXJyYXlbZnJhbWVJbmRleF0uZnJhbWUueSwgMjAwLCAxNzUsIDAsIDAsIHdpbmRvdy5pbm5lcldpZHRoIC8gMy44NDYsIHdpbmRvdy5pbm5lcldpZHRoIC8gNC4xKTtcblx0XHRcdH07XG5cblx0XHRcdHJldHVybiB0aGF0O1xuXHRcdH1cblxuXHRcdC8vIEdldCBjYW52YXNcblx0XHRjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJyk7XG5cdFx0Y2FudmFzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGggLyAzLjg0Njtcblx0XHRjYW52YXMuaGVpZ2h0ID0gd2luZG93LmlubmVyV2lkdGggLyAyLjI7XG5cblx0XHQvLyBDcmVhdGUgc3ByaXRlIHNoZWV0XG5cdFx0c3ByaXRlSW1hZ2UgPSBuZXcgSW1hZ2UoKTtcblxuXHRcdC8vIENyZWF0ZSBzcHJpdGVcblx0XHRkYW5jaW5nSWNvbiA9IHNwcml0ZSh7XG5cdFx0XHRjb250ZXh0OiBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpLFxuXHRcdFx0d2lkdGg6IDQwNDAsXG5cdFx0XHRoZWlnaHQ6IDE3NzAsXG5cdFx0XHRpbWFnZTogc3ByaXRlSW1hZ2UsXG5cdFx0XHRudW1iZXJPZkZyYW1lczogYW5pbWF0aW9uT2JqLmFuaW1hdGlvbkFycmF5Lmxlbmd0aCxcblx0XHRcdHRpY2tzUGVyRnJhbWU6IDQsXG5cdFx0XHRsb29wczogYW5pbWF0aW9uT2JqLmxvb3BBbW91bnRcblx0XHR9KTtcblxuXHRcdC8vIExvYWQgc3ByaXRlIHNoZWV0XG5cdFx0c3ByaXRlSW1hZ2UuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgZ2FtZUxvb3ApO1xuXHRcdHNwcml0ZUltYWdlLnNyYyA9ICdhc3NldHMvaW1hZ2VzL0ZhbnRhc3RlY19TcHJpdGVfU2hlZXQucG5nJztcblx0fTtcblxuXHQvLyBJTklUSUFMSVNFIEFORCBTRVRVUCBDVVJSRU5UIFBBR0UuIEVYRUNVVEUgVFJBTlNJVElPTlMgQU5EIFJFTU9WRSBUSU5UIElGIFJFTEVWQU5UIFxcXFxcblxuXHR2YXIgcGFnZUxvYWRlciA9IGZ1bmN0aW9uIHBhZ2VMb2FkZXIoaW5kZXgpIHtcblx0XHRpZiAoaW5kZXggPT09IDUpIHtcblx0XHRcdCQoJy50aW50JykucmVtb3ZlQ2xhc3MoJ3JlbW92ZVRpbnQnKTtcblx0XHRcdCQoJy5iYWNrZ3JvdW5kV3JhcHBlcicpLnJlbW92ZUNsYXNzKCdzY2FsZUJhY2tncm91bmQnKTtcblx0XHRcdCQoJyNzZWN0aW9uNScpLmZpbmQoJy5oZWFkaW5nJykuYWRkQ2xhc3MoJ3Nob3cgZmFkZUluJyk7XG5cdFx0XHQkKCcuc3ViU2VjdGlvbicpLmFkZENsYXNzKCdzY2FsZUJhY2tncm91bmQnKTtcblx0XHRcdCQoJy5zdWJTZWN0aW9uJykuZmluZCgnLnRpbnQnKS5hZGRDbGFzcygncmVtb3ZlVGludCcpO1xuXHRcdFx0JCgnI3NlY3Rpb241JykuZmluZCgnLnRleHRXcmFwcGVyJykuYWRkQ2xhc3MoJ3Nob3cnKTtcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHQkKCcuc3ViU2VjdGlvbiA+IC50ZXh0V3JhcHBlcicpLmZpbmQoJy5oZWFkaW5nJykuYWRkQ2xhc3MoJ2ZhZGVJbicpO1xuXHRcdFx0fSwgMTAwMCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCQoJy50aW50JykucmVtb3ZlQ2xhc3MoJ3JlbW92ZVRpbnQnKTtcblx0XHRcdCQoJy5zdWJTZWN0aW9uJykucmVtb3ZlQ2xhc3MoJ3NjYWxlQmFja2dyb3VuZCcpO1xuXHRcdFx0JCgnLmJhY2tncm91bmRXcmFwcGVyOm5vdCgjc2VjdGlvbicgKyBpbmRleCArICdCYWNrZ3JvdW5kKScpLnJlbW92ZUNsYXNzKCdzY2FsZUJhY2tncm91bmQnKTtcblx0XHRcdCQoJ3NlY3Rpb24uYWN0aXZlJykuZmluZCgnLnRpbnQnKS5hZGRDbGFzcygncmVtb3ZlVGludCcpO1xuXG5cdFx0XHQkKCcuc2VjdGlvbi5hY3RpdmUnKS5maW5kKCcuYmFja2dyb3VuZFdyYXBwZXInKS5hZGRDbGFzcygnc2NhbGVCYWNrZ3JvdW5kJykub24oJ2FuaW1hdGlvbmVuZCB3ZWJraXRBbmltYXRpb25FbmQnLCBmdW5jdGlvbiAoZXMpIHtcblx0XHRcdFx0JCgnc2VjdGlvbi5hY3RpdmUnKS5maW5kKCcudGludCcpLnJlbW92ZUNsYXNzKCdyZW1vdmVUaW50Jyk7XG5cdFx0XHR9KTtcblxuXHRcdFx0aWYgKCQoJy5zZWN0aW9uJyArIGluZGV4ICsgJ1BhZ2luYXRvckJ1dHRvbicpLmxlbmd0aCAmJiAkKCcuc2VjdGlvbicgKyBpbmRleCArICdQYWdpbmF0b3JCdXR0b24uYWN0aXZlJykubGVuZ3RoIDwgMSkge1xuXHRcdFx0XHQkKCcuc2VjdGlvbicgKyBpbmRleCArICdQYWdpbmF0b3JCdXR0b24nKS5nZXQoMCkuY2xpY2soKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0Ly8gSElERSBBTEwgQkVDS0dST1VORFMgSU4gVEhFIFNFQ1RJT04gRVhDRVBUIFRIRSBTUEVDSUZJRUQgSU5ERVgsIFdISUNIIElTIFNDQUxFRCBBTkQgU0hPV04uIFxcXFxcblxuXHR2YXIgaW5pdGlhbGl6ZVNlY3Rpb24gPSBmdW5jdGlvbiBpbml0aWFsaXplU2VjdGlvbihzZWN0aW9uTnVtYmVyLCBpZHgpIHtcblx0XHQkKCcjc2VjdGlvbicgKyBzZWN0aW9uTnVtYmVyICsgJ0JhY2tncm91bmQnICsgaWR4KS5zaWJsaW5ncygnLmJhY2tncm91bmRXcmFwcGVyJykubWFwKGZ1bmN0aW9uIChpeCwgZWxlKSB7XG5cdFx0XHQkKGVsZSkuY3NzKHsgb3BhY2l0eTogMCB9KTtcblx0XHR9KTtcblxuXHRcdCQoJyNzZWN0aW9uJyArIHNlY3Rpb25OdW1iZXIgKyAnQmFja2dyb3VuZCcgKyBpZHgpLmNzcyh7XG5cdFx0XHQndHJhbnNmb3JtJzogJ3NjYWxlKDEuMSknLFxuXHRcdFx0J29wYWNpdHknOiAxXG5cdFx0fSk7XG5cdH07XG5cblx0Ly8gQ0FMTCBpbml0aWFsaXplU2VjdGlvbiBPTiBTRUNUSU9OUyAxLCAzIEFORCA0LiBcXFxcXG5cdGluaXRpYWxpemVTZWN0aW9uKDEsIDApO1xuXHRpbml0aWFsaXplU2VjdGlvbigzLCAwKTtcblx0aW5pdGlhbGl6ZVNlY3Rpb24oNCwgMCk7XG5cblx0Ly8gQkFDS0dST1VORCBJTUFHRSBUUkFOU0lUSU9OIEhBTkRMRVIuIFxcXFxcblxuXHR2YXIgaW1hZ2VDb250cm9sZXIgPSBmdW5jdGlvbiBpbWFnZUNvbnRyb2xlcihpZHhPYmosIHNlY3Rpb25OdW1iZXIpIHtcblx0XHR2YXIgcmVsZXZhbnRBbmltYXRpb24gPSB2b2lkIDA7XG5cblx0XHRpZiAoc2VjdGlvbk51bWJlciA9PT0gMSkge1xuXHRcdFx0c3dpdGNoIChpZHhPYmouc2VjdGlvbjFDdXJyZW50SWR4KSB7XG5cdFx0XHRcdGNhc2UgMDpcblx0XHRcdFx0XHRyZWxldmFudEFuaW1hdGlvbiA9IG1hc3Rlck9iai5iYXNrZXRiYWxsO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIDE6XG5cdFx0XHRcdFx0cmVsZXZhbnRBbmltYXRpb24gPSBtYXN0ZXJPYmouZm9vdGJhbGw7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgMjpcblx0XHRcdFx0XHRyZWxldmFudEFuaW1hdGlvbiA9IG1hc3Rlck9iai50ZW5uaXM7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgMzpcblx0XHRcdFx0XHRyZWxldmFudEFuaW1hdGlvbiA9IG1hc3Rlck9iai5iYXNlYmFsbDtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSA0OlxuXHRcdFx0XHRcdHJlbGV2YW50QW5pbWF0aW9uID0gbWFzdGVyT2JqLmZhbjtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cblx0XHQkKCcjc2VjdGlvbicgKyBzZWN0aW9uTnVtYmVyKS5maW5kKCcudGludCcpLnJlbW92ZUNsYXNzKCdyZW1vdmVUaW50Jyk7XG5cdFx0JCgnI3NlY3Rpb24nICsgc2VjdGlvbk51bWJlciArICdCYWNrZ3JvdW5kJyArIGlkeE9ialsnc2VjdGlvbicgKyBzZWN0aW9uTnVtYmVyICsgJ0N1cnJlbnRJZHgnXSkucmVtb3ZlQ2xhc3MoJ3NjYWxlQmFja2dyb3VuZCcpO1xuXHRcdGluaXRpYWxpemVTZWN0aW9uKHNlY3Rpb25OdW1iZXIsIGlkeE9ialsnc2VjdGlvbicgKyBzZWN0aW9uTnVtYmVyICsgJ0N1cnJlbnRJZHgnXSk7XG5cblx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdGlmIChzZWN0aW9uTnVtYmVyID09PSAxKSB7XG5cdFx0XHRcdGFuaW1hdG9yKHJlbGV2YW50QW5pbWF0aW9uKTtcblx0XHRcdH1cblxuXHRcdFx0JCgnI3NlY3Rpb24nICsgc2VjdGlvbk51bWJlcikuZmluZCgnLmJhY2tncm91bmRXcmFwcGVyJykuYWRkQ2xhc3MoJ3NjYWxlQmFja2dyb3VuZCcpO1xuXHRcdFx0JCgnI3NlY3Rpb24nICsgc2VjdGlvbk51bWJlcikuZmluZCgnLnRpbnQnKS5hZGRDbGFzcygncmVtb3ZlVGludCcpO1xuXHRcdH0sIDUwMCk7XG5cblx0XHRpZiAoaWR4T2JqWydzZWN0aW9uJyArIHNlY3Rpb25OdW1iZXIgKyAnQ3VycmVudElkeCddID09PSAkKCcjc2VjdGlvbicgKyBzZWN0aW9uTnVtYmVyKS5maW5kKCcuYmFja2dyb3VuZFdyYXBwZXInKS5sZW5ndGggLSAxKSB7XG5cdFx0XHRpZHhPYmpbJ3NlY3Rpb24nICsgc2VjdGlvbk51bWJlciArICdDdXJyZW50SWR4J10gPSAwO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZHhPYmpbJ3NlY3Rpb24nICsgc2VjdGlvbk51bWJlciArICdDdXJyZW50SWR4J10gKz0gMTtcblx0XHR9XG5cdH07XG5cdC8vIFNUQVJUIFNMSURFU0hPVyBPTiBTRUNUSU9OIDIgXFxcXFxuXHRpbWFnZUNvbnRyb2xlcihtYXN0ZXJPYmosIDIpO1xuXG5cdC8vIENIQU5HRSBTRUNUSU9OIDIgQkFDS0dST1VORCBJTUFHRSBFVkVSWSAxNSBTRUNPTkRTIFxcXFxcblx0c2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuXHRcdGltYWdlQ29udHJvbGVyKG1hc3Rlck9iaiwgMik7XG5cdH0sIDE1MDAwKTtcblxuXHQvLyBQQUdJTkFUSU9OIEJVVFRPTlMgQ0xJQ0sgSEFORExFUiBGT1IgU0VDVElPTlMgMyBBTkQgNC4gXFxcXFxuXG5cdHZhciBoYW5kbGVQYW5pbmF0aW9uQnV0dG9uQ2xpY2sgPSBmdW5jdGlvbiBoYW5kbGVQYW5pbmF0aW9uQnV0dG9uQ2xpY2soZSkge1xuXG5cdFx0dmFyIGlkeCA9IHBhcnNlSW50KCQoZS50YXJnZXQpLmF0dHIoJ2RhdGEtaW5kZXgnKSk7XG5cdFx0dmFyIHNlY3Rpb25JZCA9ICQoZS50YXJnZXQpLmNsb3Nlc3QoJ3NlY3Rpb24nKS5hdHRyKCdpZCcpO1xuXHRcdHZhciByZWxldmFudERhdGFBcnJheSA9IHZvaWQgMDtcblxuXHRcdGlmIChzZWN0aW9uSWQgPT09ICdzZWN0aW9uMycpIHtcblx0XHRcdHNlY3Rpb24zSWR4ID0gaWR4O1xuXHRcdH1cblxuXHRcdGlmIChzZWN0aW9uSWQgPT09ICdzZWN0aW9uNCcpIHtcblx0XHRcdHNlY3Rpb240SWR4ID0gaWR4O1xuXHRcdH1cblxuXHRcdCQoJyMnICsgc2VjdGlvbklkKS5maW5kKCcudGludCcpLnJlbW92ZUNsYXNzKCdyZW1vdmVUaW50Jyk7XG5cdFx0JCgnIycgKyBzZWN0aW9uSWQpLmZpbmQoJy50ZXh0V3JhcHBlcicpLnJlbW92ZUNsYXNzKCdzaG93Jyk7XG5cdFx0JCgnIycgKyBzZWN0aW9uSWQpLmZpbmQoJyN0ZXh0V3JhcHBlcicgKyBpZHgpLmFkZENsYXNzKCdzaG93Jyk7XG5cdFx0JCgnIycgKyBzZWN0aW9uSWQgKyAnQmFja2dyb3VuZCcgKyBpZHgpLnJlbW92ZUNsYXNzKCdzY2FsZUJhY2tncm91bmQnKTtcblx0XHQkKCcuJyArIHNlY3Rpb25JZCArICdQYWdpbmF0b3JCdXR0b24nKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cdFx0JChlLnRhcmdldCkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXG5cdFx0aW5pdGlhbGl6ZVNlY3Rpb24ocGFyc2VJbnQoJCgnIycgKyBzZWN0aW9uSWQpLmF0dHIoJ2RhdGEtaW5kZXgnKSksIGlkeCk7XG5cblx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdHBhZ2VMb2FkZXIocGFyc2VJbnQoJCgnIycgKyBzZWN0aW9uSWQpLmF0dHIoJ2RhdGEtaW5kZXgnKSkpO1xuXHRcdH0sIDUwMCk7XG5cblx0XHRpZiAoc2VjdGlvbklkICE9PSAnc2VjdGlvbjInKSB7XG5cdFx0XHQkKCcjJyArIHNlY3Rpb25JZCkuZmluZCgnLmhlYWRpbmcsIHAnKS5hZGRDbGFzcygnZmFkZUluJyk7XG5cdFx0XHQkKCcjJyArIHNlY3Rpb25JZCkub24oJ3RyYW5zaXRpb25lbmQgd2Via2l0VHJhbnNpdGlvbkVuZCBvVHJhbnNpdGlvbkVuZCcsIGZ1bmN0aW9uIChlcykge1xuXHRcdFx0XHQkKCcjJyArIHNlY3Rpb25JZCkuZmluZCgnLmhlYWRpbmcsIHAnKS5yZW1vdmVDbGFzcygnZmFkZUluJyk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH07XG5cblx0Ly8gQ0xJQ0sgTElTVEVORVIgRk9SIFBBR0lOQVRJT04gQlVUVE9OUyBPTiBTRUNUSU9OUyAzIEFORCA0LiBcXFxcXG5cblx0JCgnLnNlY3Rpb24zUGFnaW5hdG9yQnV0dG9uLCAuc2VjdGlvbjRQYWdpbmF0b3JCdXR0b24nKS5jbGljayhmdW5jdGlvbiAoZSkge1xuXG5cdFx0aWYgKG1hc3Rlck9ialskKGUuY3VycmVudFRhcmdldCkuY2xvc2VzdCgnc2VjdGlvbicpLmF0dHIoJ2lkJyldLmlzQXV0b21hdGVkKSB7XG5cdFx0XHQvLyBJRiBUSEVSRSBJUyBBIFJJTk5JTkcgSU5URVJWQUwgT04gVEhFIFJFTEVWQU5UIFNFQ1RJT04gQ0xFQVIgSVQgXFxcXFxuXHRcdFx0aW50ZXJ2YWxNYW5hZ2VyKGZhbHNlLCAkKGUuY3VycmVudFRhcmdldCkuY2xvc2VzdCgnc2VjdGlvbicpLmF0dHIoJ2lkJykpO1xuXHRcdFx0Ly8gU0VUIEEgTkVXIElOVEVSVkFMIE9GIDcgU0VDT05EUyBPTiBUSEUgU0VDVElPTiBcXFxcXG5cdFx0XHRpbnRlcnZhbE1hbmFnZXIodHJ1ZSwgJChlLmN1cnJlbnRUYXJnZXQpLmNsb3Nlc3QoJ3NlY3Rpb24nKS5hdHRyKCdpZCcpLCAxMDAwMCk7XG5cdFx0fVxuXHRcdC8vIENBTEwgVEhFIENMSUNLIEhBTkRMRVIgRlVOQ1RJT04gQU5EIFBBU1MgSVQgVEhFIEVWRU5UIElGIFRBUkdFVCBJUyBOT1QgQUxSRUFEWSBBQ1RJVkUgXFxcXFxuXHRcdGlmICghJChlLmN1cnJlbnRUYXJnZXQpLmhhc0NsYXNzKCdhY3RpdmUnKSkge1xuXHRcdFx0aGFuZGxlUGFuaW5hdGlvbkJ1dHRvbkNsaWNrKGUpO1xuXHRcdH1cblx0fSk7XG5cblx0Ly8gSU5JVElBTElaRSBPTkVQQUdFU0NST0xMIElGIE5PVCBJTiBDTVMgUFJFVklFVy4gXFxcXFxuXG5cdGlmICghJChsb2NhdGlvbikuYXR0cignaHJlZicpLmluY2x1ZGVzKCdpbmRleC5waHAnKSkge1xuXHRcdCQoJyNzY3JvbGxlcldyYXBwZXInKS5vbmVwYWdlX3Njcm9sbCh7XG5cdFx0XHRzZWN0aW9uQ29udGFpbmVyOiBcInNlY3Rpb25cIixcblx0XHRcdGVhc2luZzogXCJlYXNlLW91dFwiLFxuXHRcdFx0YW5pbWF0aW9uVGltZTogdGltZSxcblx0XHRcdHBhZ2luYXRpb246IHRydWUsXG5cdFx0XHR1cGRhdGVVUkw6IHRydWUsXG5cdFx0XHRiZWZvcmVNb3ZlOiBmdW5jdGlvbiBiZWZvcmVNb3ZlKGluZGV4KSB7fSxcblx0XHRcdGFmdGVyTW92ZTogZnVuY3Rpb24gYWZ0ZXJNb3ZlKGluZGV4KSB7XG5cdFx0XHRcdC8vIElOSVRJQUxJWkUgVEhFIENVUlJFTlQgUEFHRS4gXFxcXFxuXG5cdFx0XHRcdHBhZ2VMb2FkZXIoaW5kZXgpO1xuXHRcdFx0fSxcblx0XHRcdGxvb3A6IGZhbHNlLFxuXHRcdFx0a2V5Ym9hcmQ6IHRydWUsXG5cdFx0XHRyZXNwb25zaXZlRmFsbGJhY2s6IGZhbHNlLFxuXHRcdFx0ZGlyZWN0aW9uOiBcInZlcnRpY2FsXCJcblx0XHR9KTtcblxuXHRcdCQoJyNzY3JvbGxlcldyYXBwZXInKS5tb3ZlVG8oMSk7XG5cdH1cblxuXHQvLyBDT05UUk9MIENMSUNLUyBPTiBXT1JLIFdJVEggVVMgU0VDVElPTiAoU0VDVElPTjUpLiBcXFxcXG5cblx0JCgnLmNsaWNrYWJsZScpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XG5cdFx0dmFyIGN1cnJlbnRTZWN0aW9uID0gJChlLnRhcmdldCkuY2xvc2VzdCgkKCcuc3ViU2VjdGlvbicpKTtcblxuXHRcdGlmIChjdXJyZW50U2VjdGlvbi5oYXNDbGFzcygnb3BlbicpKSB7XG5cdFx0XHRjdXJyZW50U2VjdGlvbi5yZW1vdmVDbGFzcygnb3BlbicpO1xuXHRcdFx0Y3VycmVudFNlY3Rpb24uZmluZCgnLmJ1dHRvbiwgcCcpLnJlbW92ZUNsYXNzKCdmYWRlSW4nKTtcblx0XHRcdGN1cnJlbnRTZWN0aW9uLnNpYmxpbmdzKCcuc3ViU2VjdGlvbicpLm1hcChmdW5jdGlvbiAoaWR4LCBzZWN0aW9uKSB7XG5cdFx0XHRcdCQoc2VjdGlvbikucmVtb3ZlQ2xhc3MoJ2Nsb3NlZCcpO1xuXHRcdFx0XHQkKHNlY3Rpb24pLmZpbmQoJy50aW50JykucmVtb3ZlQ2xhc3MoJ2FkZFRpbnQnKS5hZGRDbGFzcygncmVtb3ZlVGludCcpO1xuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGN1cnJlbnRTZWN0aW9uLnJlbW92ZUNsYXNzKCdjbG9zZWQnKS5hZGRDbGFzcygnb3BlbicpO1xuXHRcdFx0Y3VycmVudFNlY3Rpb24ub24oJ3RyYW5zaXRpb25lbmQgd2Via2l0VHJhbnNpdGlvbkVuZCBvVHJhbnNpdGlvbkVuZCcsIGZ1bmN0aW9uIChlcykge1xuXHRcdFx0XHQkKCcuc3ViU2VjdGlvbi5vcGVuJykuZmluZCgnLmJ1dHRvbiwgcCcpLmFkZENsYXNzKCdmYWRlSW4nKTtcblx0XHRcdFx0JCgnLnN1YlNlY3Rpb24ub3BlbicpLmZpbmQoJ3AuZmFkZUluJykub24oJ3RyYW5zaXRpb25lbmQgd2Via2l0VHJhbnNpdGlvbkVuZCBvVHJhbnNpdGlvbkVuZCcsIGZ1bmN0aW9uIChlcykge1xuXHRcdFx0XHRcdCQoJy5zdWJTZWN0aW9uLm9wZW4nKS5maW5kKCcudGludCcpLmFkZENsYXNzKCdhZGRUaW50JykucmVtb3ZlQ2xhc3MoJ3JlbW92ZVRpbnQnKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHRcdGN1cnJlbnRTZWN0aW9uLnNpYmxpbmdzKCcuc3ViU2VjdGlvbicpLm1hcChmdW5jdGlvbiAoaWR4LCBzZWN0aW9uKSB7XG5cdFx0XHRcdCQoc2VjdGlvbikucmVtb3ZlQ2xhc3MoJ29wZW4nKS5hZGRDbGFzcygnY2xvc2VkJyk7XG5cdFx0XHRcdCQoc2VjdGlvbikuZmluZCgnLnRpbnQnKS5yZW1vdmVDbGFzcygncmVtb3ZlVGludCcpLmFkZENsYXNzKCdhZGRUaW50Jyk7XG5cdFx0XHRcdCQoc2VjdGlvbikuZmluZCgnLmJ1dHRvbiwgcCcpLnJlbW92ZUNsYXNzKCdmYWRlSW4nKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRjdXJyZW50U2VjdGlvbi5maW5kKCcudGludCcpLnJlbW92ZUNsYXNzKCdhZGRUaW50JykuYWRkQ2xhc3MoJ3JlbW92ZVRpbnQnKTtcblx0fSk7XG5cblx0Ly8gQ09OVFJPTCBGT09URVIgQVJST1cgQ0xJQ0tTLiBcXFxcXG5cblx0JCgnI2Rvd25BcnJvdycpLmNsaWNrKGZ1bmN0aW9uICgpIHtcblx0XHRpZiAoJCh3aW5kb3cpLmhlaWdodCgpICogKCQoJy5wYWdlJykubGVuZ3RoIC0gMSkgPT09IC0kKCcjc2Nyb2xsZXJXcmFwcGVyJykub2Zmc2V0KCkudG9wKSB7XG5cdFx0XHQvLyBNT1ZFIFRPIFRPUCBPRiBQQUdFIElGIENVUlJFTlRMWSBBVCBCT1RUT00gXFxcXFxuXHRcdFx0JCgnI3Njcm9sbGVyV3JhcHBlcicpLm1vdmVUbygxKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JCgnI3Njcm9sbGVyV3JhcHBlcicpLm1vdmVEb3duKCk7XG5cdFx0fVxuXHR9KTtcblxuXHQvLyBISURFIFRIRSBMT0FESU5HIEFOSU1BVElPUE4gV0hFTiBWSURFTyBJUyBSRUFEWSBUTyBQTEFZIE9OIERFU1hLVE9QLiBcXFxcXG5cblx0dmFyIGhpZGVMb2FkaW5nQW5pbWF0aW9uID0gZnVuY3Rpb24gaGlkZUxvYWRpbmdBbmltYXRpb24oKSB7XG5cdFx0aWYgKHdpbmRvdy5pbm5lcldpZHRoID4gODAwICYmICEkKCcjbG9hZGluZycpLmhhc0NsYXNzKCdoaWRkZW4nKSkge1xuXG5cdFx0XHRpZiAoJCgnI3ZpZGVvJykubGVuZ3RoICYmICQoJyN2aWRlbycpLmdldCgwKS5yZWFkeVN0YXRlID09PSA0KSB7XG5cdFx0XHRcdCQoJyNsb2FkaW5nJykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHQvLyBNQU5BR0VNRU5UIEZVTkNUSU9OIEZPUiBTRVRUSU5HIEFORCBDTEVBUklORyBUSEUgU0xJREUgQVVUT01BVElPTiBJTlRFUlZBTFMuIFxcXFxcblxuXHR2YXIgaW50ZXJ2YWxNYW5hZ2VyID0gZnVuY3Rpb24gaW50ZXJ2YWxNYW5hZ2VyKGZsYWcsIHNlY3Rpb25JZCwgdGltZSkge1xuXHRcdGlmIChmbGFnKSB7XG5cdFx0XHRtYXN0ZXJPYmpbc2VjdGlvbklkXS5hdXRvbWF0ZSA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0c3dpcGVDb250cm9sbGVyKHNlY3Rpb25JZCwgJ2wnKTtcblx0XHRcdH0sIHRpbWUpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjbGVhckludGVydmFsKG1hc3Rlck9ialtzZWN0aW9uSWRdLmF1dG9tYXRlKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gSUYgTk9UIElOIENNUyBBRE1JTiBQUkVWSUVXLCBQRVJQRVRVQUxMWSBDSEVDSyBJRiBXRSBBUkUgQVQgVEhFIFRPUCBPRiBUSEUgUEFHRSBBTkQgSUYgU08sIERPTlQgU0hPVyBUSEUgRk9PVEVSIE9SIEdSRUVOIFNIQVBFLiBcXFxcXG5cblx0aWYgKCEkKGxvY2F0aW9uKS5hdHRyKCdocmVmJykuaW5jbHVkZXMoJ2luZGV4LnBocCcpKSB7XG5cdFx0c2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuXHRcdFx0aWYgKCQoJyNzY3JvbGxlcldyYXBwZXInKS5vZmZzZXQoKS50b3AgPj0gLSh3aW5kb3cuaW5uZXJIZWlnaHQgLyAxLjkpKSB7XG5cdFx0XHRcdCQoJyNoZWFkZXJTaGFwZSwgI2Zvb3RlcicpLmFkZENsYXNzKCdtb3ZlT2ZmU2NyZWVuJyk7XG5cblx0XHRcdFx0aWYgKCQoJyN2aWRlbycpLmxlbmd0aCAmJiAkKCcjdmlkZW8nKS5jc3MoJ2Rpc3BsYXknKSAhPT0gJ25vbmUnKSB7XG5cdFx0XHRcdFx0JCgnI3ZpZGVvJykuZ2V0KDApLnBsYXkoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdCQoJy5hcnJvdycpLmFkZENsYXNzKCdwdWxzYXRlJyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkKCcjaGVhZGVyU2hhcGUsICNmb290ZXInKS5yZW1vdmVDbGFzcygnbW92ZU9mZlNjcmVlbicpO1xuXHRcdFx0XHQkKCcuYXJyb3cnKS5yZW1vdmVDbGFzcygncHVsc2F0ZScpO1xuXG5cdFx0XHRcdGlmICgkKCcjdmlkZW8nKS5sZW5ndGgpIHtcblx0XHRcdFx0XHQkKCcjdmlkZW8nKS5nZXQoMCkucGF1c2UoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBST1RBVEUgVEhFIEFSUk9XIElOIFRIRSBGT09URVIgV0hFTiBBVCBUSEUgQk9UVE9NIE9GIFRIRSBQQUdFIFxcXFxcblxuXHRcdFx0aWYgKCQoJyNzY3JvbGxlcldyYXBwZXInKS5vZmZzZXQoKS50b3AgPCAtKHdpbmRvdy5pbm5lckhlaWdodCAqIDQpKSB7XG5cdFx0XHRcdCQoJyNkb3duQXJyb3cnKS5jc3MoeyAndHJhbnNmb3JtJzogJ3JvdGF0ZSgxODBkZWcpIHRyYW5zbGF0ZVgoLTUwJSknIH0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JCgnI2Rvd25BcnJvdycpLmNzcyh7ICd0cmFuc2Zvcm0nOiAndHJhbnNsYXRlWCgtNTAlKSByb3RhdGUoMGRlZyknIH0pO1xuXHRcdFx0fVxuXG5cdFx0XHRoaWRlTG9hZGluZ0FuaW1hdGlvbigpO1xuXG5cdFx0XHQvLyBBREQgTEFORFNDQVBFIFNUWUxFUyBUTyBSRUxFVkFOVCBFTEVNRU5UUyBcXFxcXG5cblx0XHRcdGlmICh3aW5kb3cubWF0Y2hNZWRpYShcIihvcmllbnRhdGlvbjogbGFuZHNjYXBlKVwiKS5tYXRjaGVzICYmIHdpbmRvdy5pbm5lcldpZHRoIDwgODAwKSB7XG5cdFx0XHRcdCQoJy5uYXZfbGluaywgI2hlYWRlclNoYXBlLCAjZm9vdGVyLCAuY3VzdG9tLCAubWFya2VyLCAjc2VjdGlvbjUsIC50ZXh0V3JhcHBlcicpLmFkZENsYXNzKCdsYW5kc2NhcGUnKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCQoJy5uYXZfbGluaywgI2hlYWRlclNoYXBlLCAjZm9vdGVyLCAuY3VzdG9tLCAubWFya2VyLCAjc2VjdGlvbjUsIC50ZXh0V3JhcHBlcicpLnJlbW92ZUNsYXNzKCdsYW5kc2NhcGUnKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCQoJyNzZWN0aW9uMy5hY3RpdmUnKS5sZW5ndGgpIHtcblx0XHRcdFx0Ly8gQVVUT01BVEUgVEhFIFNMSURFUyBPTiBTRUNUSU9QTiAzIEVWRVJZIDcgU0VDT05EUyBJRiBUSEUgU0VDVElPTiBJUyBBQ1RJVkUuIFxcXFxcblx0XHRcdFx0aWYgKG1hc3Rlck9iai5zZWN0aW9uMy5pc0F1dG9tYXRlZCAhPT0gdHJ1ZSkge1xuXHRcdFx0XHRcdG1hc3Rlck9iai5zZWN0aW9uMy5pc0F1dG9tYXRlZCA9IHRydWU7XG5cdFx0XHRcdFx0aW50ZXJ2YWxNYW5hZ2VyKHRydWUsICdzZWN0aW9uMycsIDEwMDAwKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gU1RPUCBBVVRPTUFURUQgU0xJREVTIE9OIFNFQ1RJT1BOIDMgSUYgVEhFIFNFQ1RJT04gSVMgTk9UIEFDVElWRS4gXFxcXFxuXHRcdFx0XHRpZiAobWFzdGVyT2JqLnNlY3Rpb24zLmlzQXV0b21hdGVkID09PSB0cnVlKSB7XG5cdFx0XHRcdFx0aW50ZXJ2YWxNYW5hZ2VyKGZhbHNlLCAnc2VjdGlvbjMnKTtcblx0XHRcdFx0XHRtYXN0ZXJPYmouc2VjdGlvbjMuaXNBdXRvbWF0ZWQgPSBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoJCgnI3NlY3Rpb240LmFjdGl2ZScpLmxlbmd0aCkge1xuXHRcdFx0XHQvLyBBVVRPTUFURSBUSEUgU0xJREVTIE9OIFNFQ1RJT1BOIDQgRVZFUlkgNyBTRUNPTkRTIElGIFRIRSBTRUNUSU9OIElTIEFDVElWRS4gXFxcXFxuXHRcdFx0XHRpZiAobWFzdGVyT2JqLnNlY3Rpb240LmlzQXV0b21hdGVkICE9PSB0cnVlKSB7XG5cdFx0XHRcdFx0bWFzdGVyT2JqLnNlY3Rpb240LmlzQXV0b21hdGVkID0gdHJ1ZTtcblx0XHRcdFx0XHRpbnRlcnZhbE1hbmFnZXIodHJ1ZSwgJ3NlY3Rpb240JywgMTAwMDApO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBTVE9QIEFVVE9NQVRFRCBTTElERVMgT04gU0VDVElPUE4gNCBJRiBUSEUgU0VDVElPTiBJUyBOT1QgQUNUSVZFLiBcXFxcXG5cdFx0XHRcdGlmIChtYXN0ZXJPYmouc2VjdGlvbjQuaXNBdXRvbWF0ZWQgPT09IHRydWUpIHtcblx0XHRcdFx0XHRpbnRlcnZhbE1hbmFnZXIoZmFsc2UsICdzZWN0aW9uNCcpO1xuXHRcdFx0XHRcdG1hc3Rlck9iai5zZWN0aW9uNC5pc0F1dG9tYXRlZCA9IGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSwgNTAwKTtcblx0fVxuXG5cdC8vIENPTlRST0wgV0hBVCBIQVBQRU5TIFdIRU4gTElOS1MgSU4gVEhFIE5BVi9NRU5VIEFSRSBDTElDS0VEIFxcXFxcblxuXHQkKCcubmF2X2xpbmsnKS5jbGljayhmdW5jdGlvbiAoZSkge1xuXHRcdHZhciBwYWdlSWR4ID0gcGFyc2VJbnQoJChlLnRhcmdldCkuYXR0cignZGF0YS1pbmRleCcpKTtcblx0XHQkKCcjc2Nyb2xsZXJXcmFwcGVyJykubW92ZVRvKHBhZ2VJZHgpO1xuXHRcdCQoJyNtZW51QmxvY2tPdXQnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG5cblx0XHRpZiAoYnVyZ2VyLmNsYXNzTGlzdC5jb250YWlucygnYnVyZ2VyLS1hY3RpdmUnKSkge1xuXHRcdFx0bmF2LmNsYXNzTGlzdC5yZW1vdmUoJ25hdl9vcGVuJyk7XG5cdFx0XHRidXJnZXIuY2xhc3NMaXN0LnJlbW92ZSgnYnVyZ2VyLS1hY3RpdmUnKTtcblx0XHRcdGRvY3VtZW50LmJvZHkuc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnO1xuXHRcdH1cblx0fSk7XG5cblx0Ly8gV0hFTiBUSEUgTkFWIElTIE9QRU4gUFJFVkVOVCBVU0VSIEZST00gQkVJTkcgQUJMRSBUTyBDTElDSyBBTllUSElORyBFTFNFIFxcXFxcblxuXHQkKCcjbWVudUJsb2NrT3V0JykuY2xpY2soZnVuY3Rpb24gKGUpIHtcblx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHR9KTtcblxuXHR2YXIgYnVyZ2VyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW4tYnVyZ2VyJyksXG5cdCAgICBuYXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbk5hdicpO1xuXG5cdC8vIENPTlRST0wgRk9SIE9QRU4gQU5EIENMT1NJTkcgVEhFIE1FTlUvTkFWICBcXFxcXG5cblx0ZnVuY3Rpb24gbmF2Q29udHJvbCgpIHtcblxuXHRcdGlmIChidXJnZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdidXJnZXItLWFjdGl2ZScpKSB7XG5cdFx0XHRuYXYuY2xhc3NMaXN0LnJlbW92ZSgnbmF2X29wZW4nKTtcblx0XHRcdGJ1cmdlci5jbGFzc0xpc3QucmVtb3ZlKCdidXJnZXItLWFjdGl2ZScpO1xuXHRcdFx0JCgnI21lbnVCbG9ja091dCcpLmFkZENsYXNzKCdoaWRkZW4nKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0YnVyZ2VyLmNsYXNzTGlzdC5hZGQoJ2J1cmdlci0tYWN0aXZlJyk7XG5cdFx0XHRuYXYuY2xhc3NMaXN0LmFkZCgnbmF2X29wZW4nKTtcblx0XHRcdCQoJyNtZW51QmxvY2tPdXQnKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gT05MWSBMSVNURU4gRk9SIE1FTlUgQ0xJQ0tTIFdIRU4gTk9UIElOIENNUyBQUkVWSUVXIE1PREUgXFxcXFxuXG5cdGlmICghJChsb2NhdGlvbikuYXR0cignaHJlZicpLmluY2x1ZGVzKCdpbmRleC5waHAnKSkge1xuXHRcdGJ1cmdlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG5hdkNvbnRyb2wpO1xuXHR9XG5cblx0Ly8gQ0xPU0UgVEhFIE5BViBJRiBUSEUgV0lORE9XIElTIE9WRVIgMTAwMFBYIFdJREUgXFxcXFxuXG5cdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBmdW5jdGlvbiAoKSB7XG5cdFx0aWYgKHdpbmRvdy5pbm5lcldpZHRoID4gMTAwMCAmJiBuYXYuY2xhc3NMaXN0LmNvbnRhaW5zKCduYXZfb3BlbicpKSB7XG5cdFx0XHRuYXZDb250cm9sKCk7XG5cdFx0XHRuYXYuY2xhc3NMaXN0LnJlbW92ZSgnbmF2X29wZW4nKTtcblx0XHRcdCQoJyNtZW51QmxvY2tPdXQnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG5cdFx0fVxuXHR9KTtcblxuXHQvLyBUSElTIFNFVCBPRiBJRiBTVEFURU1FTlRTIElOSVRJQUxJU0VTIFRIRSBTUEVTSUZJQyBQQUdFUyBGT1IgUFJFVklFV0lORyBJTiBDTVMgQURNSU4uIFxcXFxcblxuXHRpZiAoJChsb2NhdGlvbikuYXR0cignaHJlZicpLmluY2x1ZGVzKCdpbmRleC5waHAnKSkge1xuXHRcdGlmICgkKGxvY2F0aW9uKS5hdHRyKCdocmVmJykuaW5jbHVkZXMoJ2ltYWdpbmUtaWYnKSkge1xuXHRcdFx0cGFnZUxvYWRlcig0KTtcblx0XHR9XG5cdFx0aWYgKCQobG9jYXRpb24pLmF0dHIoJ2hyZWYnKS5pbmNsdWRlcygnaG93LXdlLWlubm92YXRlJykpIHtcblx0XHRcdHBhZ2VMb2FkZXIoMyk7XG5cdFx0fVxuXHRcdGlmICgkKGxvY2F0aW9uKS5hdHRyKCdocmVmJykuaW5jbHVkZXMoJ3dvcmstd2l0aC11cycpKSB7XG5cdFx0XHRwYWdlTG9hZGVyKDUpO1xuXHRcdH1cblx0XHRpZiAoJChsb2NhdGlvbikuYXR0cignaHJlZicpLmluY2x1ZGVzKCdjb250YWN0LXVzJykpIHtcblx0XHRcdHBhZ2VMb2FkZXIoNik7XG5cdFx0fVxuXHRcdGlmICgkKGxvY2F0aW9uKS5hdHRyKCdocmVmJykuaW5jbHVkZXMoJ2hvbWUtdmlkZW8nKSkge1xuXHRcdFx0c2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRoaWRlTG9hZGluZ0FuaW1hdGlvbigpO1xuXHRcdFx0fSwgNTAwKTtcblx0XHR9XG5cdH1cblxuXHQvLyBTV0lQRSBFVkVOVFMgREVURUNUT1IgRlVOQ1RJT04gXFxcXFxuXG5cdGZ1bmN0aW9uIGRldGVjdHN3aXBlKGVsLCBmdW5jKSB7XG5cdFx0dmFyIHN3aXBlX2RldCA9IHt9O1xuXHRcdHN3aXBlX2RldC5zWCA9IDA7c3dpcGVfZGV0LnNZID0gMDtzd2lwZV9kZXQuZVggPSAwO3N3aXBlX2RldC5lWSA9IDA7XG5cdFx0dmFyIG1pbl94ID0gMzA7IC8vbWluIHggc3dpcGUgZm9yIGhvcml6b250YWwgc3dpcGVcblx0XHR2YXIgbWF4X3ggPSAzMDsgLy9tYXggeCBkaWZmZXJlbmNlIGZvciB2ZXJ0aWNhbCBzd2lwZVxuXHRcdHZhciBtaW5feSA9IDUwOyAvL21pbiB5IHN3aXBlIGZvciB2ZXJ0aWNhbCBzd2lwZVxuXHRcdHZhciBtYXhfeSA9IDYwOyAvL21heCB5IGRpZmZlcmVuY2UgZm9yIGhvcml6b250YWwgc3dpcGVcblx0XHR2YXIgZGlyZWMgPSBcIlwiO1xuXHRcdHZhciBlbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbCk7XG5cdFx0ZWxlLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0dmFyIHQgPSBlLnRvdWNoZXNbMF07XG5cdFx0XHRzd2lwZV9kZXQuc1ggPSB0LnNjcmVlblg7XG5cdFx0XHRzd2lwZV9kZXQuc1kgPSB0LnNjcmVlblk7XG5cdFx0fSwgZmFsc2UpO1xuXHRcdGVsZS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0dmFyIHQgPSBlLnRvdWNoZXNbMF07XG5cdFx0XHRzd2lwZV9kZXQuZVggPSB0LnNjcmVlblg7XG5cdFx0XHRzd2lwZV9kZXQuZVkgPSB0LnNjcmVlblk7XG5cdFx0fSwgZmFsc2UpO1xuXHRcdGVsZS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHQvL2hvcml6b250YWwgZGV0ZWN0aW9uXG5cdFx0XHRpZiAoKHN3aXBlX2RldC5lWCAtIG1pbl94ID4gc3dpcGVfZGV0LnNYIHx8IHN3aXBlX2RldC5lWCArIG1pbl94IDwgc3dpcGVfZGV0LnNYKSAmJiBzd2lwZV9kZXQuZVkgPCBzd2lwZV9kZXQuc1kgKyBtYXhfeSAmJiBzd2lwZV9kZXQuc1kgPiBzd2lwZV9kZXQuZVkgLSBtYXhfeSAmJiBzd2lwZV9kZXQuZVggPiAwKSB7XG5cdFx0XHRcdGlmIChzd2lwZV9kZXQuZVggPiBzd2lwZV9kZXQuc1gpIGRpcmVjID0gXCJyXCI7ZWxzZSBkaXJlYyA9IFwibFwiO1xuXHRcdFx0fVxuXHRcdFx0Ly92ZXJ0aWNhbCBkZXRlY3Rpb25cblx0XHRcdGVsc2UgaWYgKChzd2lwZV9kZXQuZVkgLSBtaW5feSA+IHN3aXBlX2RldC5zWSB8fCBzd2lwZV9kZXQuZVkgKyBtaW5feSA8IHN3aXBlX2RldC5zWSkgJiYgc3dpcGVfZGV0LmVYIDwgc3dpcGVfZGV0LnNYICsgbWF4X3ggJiYgc3dpcGVfZGV0LnNYID4gc3dpcGVfZGV0LmVYIC0gbWF4X3ggJiYgc3dpcGVfZGV0LmVZID4gMCkge1xuXHRcdFx0XHRcdGlmIChzd2lwZV9kZXQuZVkgPiBzd2lwZV9kZXQuc1kpIGRpcmVjID0gXCJkXCI7ZWxzZSBkaXJlYyA9IFwidVwiO1xuXHRcdFx0XHR9XG5cblx0XHRcdGlmIChkaXJlYyAhPSBcIlwiKSB7XG5cdFx0XHRcdGlmICh0eXBlb2YgZnVuYyA9PSAnZnVuY3Rpb24nKSBmdW5jKGVsLCBkaXJlYyk7XG5cdFx0XHR9XG5cdFx0XHR2YXIgZGlyZWMgPSBcIlwiO1xuXHRcdFx0c3dpcGVfZGV0LnNYID0gMDtzd2lwZV9kZXQuc1kgPSAwO3N3aXBlX2RldC5lWCA9IDA7c3dpcGVfZGV0LmVZID0gMDtcblx0XHR9LCBmYWxzZSk7XG5cdH1cblxuXHQvLyBDSE9TRSBUSEUgTkVYVCBTTElERSBUTyBTSE9XIEFORCBDTElDSyBUSEUgUEFHSU5BVElPTiBCVVRUT04gVEhBVCBSRUxBVEVTIFRPIElULiBcXFxcXG5cblx0dmFyIHN3aXBlQ29udHJvbGxlciA9IGZ1bmN0aW9uIHN3aXBlQ29udHJvbGxlcihlbCwgZCkge1xuXG5cdFx0aWYgKGVsID09PSAnc2VjdGlvbjQnKSB7XG5cblx0XHRcdHZhciBzZWN0aW9uNFBhZ2luYXRpb25MZW5ndGggPSAkKCcuc2VjdGlvbjRQYWdpbmF0b3JCdXR0b24nKS5sZW5ndGg7XG5cblx0XHRcdGlmIChkID09PSAnbCcpIHtcblxuXHRcdFx0XHRpZiAoc2VjdGlvbjRJZHggPCBzZWN0aW9uNFBhZ2luYXRpb25MZW5ndGggLSAxKSB7XG5cdFx0XHRcdFx0c2VjdGlvbjRJZHgrKztcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRzZWN0aW9uNElkeCA9IDA7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQkKCcuc2VjdGlvbjRQYWdpbmF0b3JCdXR0b24nKVtzZWN0aW9uNElkeF0uY2xpY2soKTtcblx0XHRcdH1cblx0XHRcdGlmIChkID09PSAncicpIHtcblxuXHRcdFx0XHRpZiAoc2VjdGlvbjRJZHggPiAwKSB7XG5cdFx0XHRcdFx0c2VjdGlvbjRJZHgtLTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRzZWN0aW9uNElkeCA9IHNlY3Rpb240UGFnaW5hdGlvbkxlbmd0aCAtIDE7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQkKCcuc2VjdGlvbjRQYWdpbmF0b3JCdXR0b24nKVtzZWN0aW9uNElkeF0uY2xpY2soKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKGVsID09PSAnc2VjdGlvbjMnKSB7XG5cblx0XHRcdHZhciBzZWN0aW9uM1BhZ2luYXRpb25MZW5ndGggPSAkKCcuc2VjdGlvbjNQYWdpbmF0b3JCdXR0b24nKS5sZW5ndGg7XG5cblx0XHRcdGlmIChkID09PSAnbCcpIHtcblxuXHRcdFx0XHRpZiAoc2VjdGlvbjNJZHggPCBzZWN0aW9uM1BhZ2luYXRpb25MZW5ndGggLSAxKSB7XG5cdFx0XHRcdFx0c2VjdGlvbjNJZHgrKztcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRzZWN0aW9uM0lkeCA9IDA7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQkKCcuc2VjdGlvbjNQYWdpbmF0b3JCdXR0b24nKVtzZWN0aW9uM0lkeF0uY2xpY2soKTtcblx0XHRcdH1cblx0XHRcdGlmIChkID09PSAncicpIHtcblxuXHRcdFx0XHRpZiAoc2VjdGlvbjNJZHggPiAwKSB7XG5cdFx0XHRcdFx0c2VjdGlvbjNJZHgtLTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRzZWN0aW9uM0lkeCA9IHNlY3Rpb24zUGFnaW5hdGlvbkxlbmd0aCAtIDE7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQkKCcuc2VjdGlvbjNQYWdpbmF0b3JCdXR0b24nKVtzZWN0aW9uM0lkeF0uY2xpY2soKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0Ly8gSU5JVElBVEUgRk9SIFNXSVBFIERFVEVDVElPTiBPTiBTRUNUSU9OUyAzIEFORCA0IEVYQ0VQVCBJTiBBRE1JTiBQUkVWSUVXLiBcXFxcXG5cblx0aWYgKCEkKGxvY2F0aW9uKS5hdHRyKCdocmVmJykuaW5jbHVkZXMoJ2luZGV4LnBocCcpKSB7XG5cdFx0ZGV0ZWN0c3dpcGUoJ3NlY3Rpb240Jywgc3dpcGVDb250cm9sbGVyKTtcblx0XHRkZXRlY3Rzd2lwZSgnc2VjdGlvbjMnLCBzd2lwZUNvbnRyb2xsZXIpO1xuXHR9XG59KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkltWmhhMlZmTnpaaU5tWTVaREl1YW5NaVhTd2libUZ0WlhNaU9sc2lkR2x0WlNJc0luTmxZM1JwYjI0elNXUjRJaXdpYzJWamRHbHZialJKWkhnaUxDSnRZWE4wWlhKUFltb2lMQ0p6WldOMGFXOXVNa04xY25KbGJuUkpaSGdpTENKelpXTjBhVzl1TVVOMWNuSmxiblJKWkhnaUxDSnpaV04wYVc5dU15SXNJbUYxZEc5dFlYUmxJaXdpYVhOQmRYUnZiV0YwWldRaUxDSnpaV04wYVc5dU5DSXNJbUpoYzJ0bGRHSmhiR3dpTENKc2IyOXdRVzF2ZFc1MElpd2labTl2ZEdKaGJHd2lMQ0owWlc1dWFYTWlMQ0ppWVhObFltRnNiQ0lzSW1aaGJpSXNJaVFpTENKa2IyTjFiV1Z1ZENJc0luSmxZV1I1SWl3aVkzTnpJaXdpYUdWcFoyaDBJaXdpZDJsdVpHOTNJaXdpYVc1dVpYSlhhV1IwYUNJc0luSmxiVzkyWlNJc0ltWmxkR05vSWl3aWRHaGxiaUlzSW5KbGMzQnZibk5sSWl3aWFuTnZiaUlzSW5Od2NtbDBaVTlpYWlJc0lrbGtiR1ZHY21GdFpTSXNJbVpwYkhSbGNrSjVWbUZzZFdVaUxDSm1jbUZ0WlhNaUxDSmhibWx0WVhScGIyNUJjbkpoZVNJc0ltRnVhVzFoZEc5eVUyVjBkWEFpTENKcGJXRm5aVU52Ym5SeWIyeGxjaUlzSW5ObGRFbHVkR1Z5ZG1Gc0lpd2lZWEp5WVhraUxDSnpkSEpwYm1jaUxDSm1hV3gwWlhJaUxDSnZJaXdpZEc5TWIzZGxja05oYzJVaUxDSnBibU5zZFdSbGN5SXNJbXhoYzNSVWFXMWxJaXdpZG1WdVpHOXljeUlzSW5naUxDSnNaVzVuZEdnaUxDSnlaWEYxWlhOMFFXNXBiV0YwYVc5dVJuSmhiV1VpTENKallXNWpaV3hCYm1sdFlYUnBiMjVHY21GdFpTSXNJbU5oYkd4aVlXTnJJaXdpWld4bGJXVnVkQ0lzSW1OMWNuSlVhVzFsSWl3aVJHRjBaU0lzSW1kbGRGUnBiV1VpTENKMGFXMWxWRzlEWVd4c0lpd2lUV0YwYUNJc0ltMWhlQ0lzSW1sa0lpd2ljMlYwVkdsdFpXOTFkQ0lzSW1Oc1pXRnlWR2x0Wlc5MWRDSXNJbUZ1YVcxaGRHOXlJaXdpWVc1cGJXRjBhVzl1VDJKcUlpd2laR0Z1WTJsdVowbGpiMjRpTENKemNISnBkR1ZKYldGblpTSXNJbU5oYm5aaGN5SXNJbWRoYldWTWIyOXdJaXdpWVdSa1EyeGhjM01pTENKc2IyOXdTV1FpTENKMWNHUmhkR1VpTENKeVpXNWtaWElpTENKemNISnBkR1VpTENKdmNIUnBiMjV6SWl3aWRHaGhkQ0lzSW1aeVlXMWxTVzVrWlhnaUxDSjBhV05yUTI5MWJuUWlMQ0pzYjI5d1EyOTFiblFpTENKMGFXTnJjMUJsY2taeVlXMWxJaXdpYm5WdFltVnlUMlpHY21GdFpYTWlMQ0pqYjI1MFpYaDBJaXdpZDJsa2RHZ2lMQ0pwYldGblpTSXNJbXh2YjNCeklpd2lZMnhsWVhKU1pXTjBJaXdpWkhKaGQwbHRZV2RsSWl3aVpuSmhiV1VpTENKNUlpd2laMlYwUld4bGJXVnVkRUo1U1dRaUxDSkpiV0ZuWlNJc0ltZGxkRU52Ym5SbGVIUWlMQ0poWkdSRmRtVnVkRXhwYzNSbGJtVnlJaXdpYzNKaklpd2ljR0ZuWlV4dllXUmxjaUlzSW1sdVpHVjRJaXdpY21WdGIzWmxRMnhoYzNNaUxDSm1hVzVrSWl3aWIyNGlMQ0psY3lJc0ltZGxkQ0lzSW1Oc2FXTnJJaXdpYVc1cGRHbGhiR2w2WlZObFkzUnBiMjRpTENKelpXTjBhVzl1VG5WdFltVnlJaXdpYVdSNElpd2ljMmxpYkdsdVozTWlMQ0p0WVhBaUxDSnBlQ0lzSW1Wc1pTSXNJbTl3WVdOcGRIa2lMQ0pwWkhoUFltb2lMQ0p5Wld4bGRtRnVkRUZ1YVcxaGRHbHZiaUlzSW1oaGJtUnNaVkJoYm1sdVlYUnBiMjVDZFhSMGIyNURiR2xqYXlJc0ltVWlMQ0p3WVhKelpVbHVkQ0lzSW5SaGNtZGxkQ0lzSW1GMGRISWlMQ0p6WldOMGFXOXVTV1FpTENKamJHOXpaWE4wSWl3aWNtVnNaWFpoYm5SRVlYUmhRWEp5WVhraUxDSmpkWEp5Wlc1MFZHRnlaMlYwSWl3aWFXNTBaWEoyWVd4TllXNWhaMlZ5SWl3aWFHRnpRMnhoYzNNaUxDSnNiMk5oZEdsdmJpSXNJbTl1WlhCaFoyVmZjMk55YjJ4c0lpd2ljMlZqZEdsdmJrTnZiblJoYVc1bGNpSXNJbVZoYzJsdVp5SXNJbUZ1YVcxaGRHbHZibFJwYldVaUxDSndZV2RwYm1GMGFXOXVJaXdpZFhCa1lYUmxWVkpNSWl3aVltVm1iM0psVFc5MlpTSXNJbUZtZEdWeVRXOTJaU0lzSW14dmIzQWlMQ0pyWlhsaWIyRnlaQ0lzSW5KbGMzQnZibk5wZG1WR1lXeHNZbUZqYXlJc0ltUnBjbVZqZEdsdmJpSXNJbTF2ZG1WVWJ5SXNJbU4xY25KbGJuUlRaV04wYVc5dUlpd2ljMlZqZEdsdmJpSXNJbTltWm5ObGRDSXNJblJ2Y0NJc0ltMXZkbVZFYjNkdUlpd2lhR2xrWlV4dllXUnBibWRCYm1sdFlYUnBiMjRpTENKeVpXRmtlVk4wWVhSbElpd2labXhoWnlJc0luTjNhWEJsUTI5dWRISnZiR3hsY2lJc0ltTnNaV0Z5U1c1MFpYSjJZV3dpTENKcGJtNWxja2hsYVdkb2RDSXNJbkJzWVhraUxDSndZWFZ6WlNJc0ltMWhkR05vVFdWa2FXRWlMQ0p0WVhSamFHVnpJaXdpY0dGblpVbGtlQ0lzSW1KMWNtZGxjaUlzSW1Oc1lYTnpUR2x6ZENJc0ltTnZiblJoYVc1eklpd2libUYySWl3aVltOWtlU0lzSW5OMGVXeGxJaXdpY0c5emFYUnBiMjRpTENKemRHOXdVSEp2Y0dGbllYUnBiMjRpTENKdVlYWkRiMjUwY205c0lpd2lZV1JrSWl3aVpHVjBaV04wYzNkcGNHVWlMQ0psYkNJc0ltWjFibU1pTENKemQybHdaVjlrWlhRaUxDSnpXQ0lzSW5OWklpd2laVmdpTENKbFdTSXNJbTFwYmw5NElpd2liV0Y0WDNnaUxDSnRhVzVmZVNJc0ltMWhlRjk1SWl3aVpHbHlaV01pTENKMElpd2lkRzkxWTJobGN5SXNJbk5qY21WbGJsZ2lMQ0p6WTNKbFpXNVpJaXdpY0hKbGRtVnVkRVJsWm1GMWJIUWlMQ0prSWl3aWMyVmpkR2x2YmpSUVlXZHBibUYwYVc5dVRHVnVaM1JvSWl3aWMyVmpkR2x2YmpOUVlXZHBibUYwYVc5dVRHVnVaM1JvSWwwc0ltMWhjSEJwYm1keklqb2lPenM3TzBGQlFVRXNTVUZCVFVFc1QwRkJUeXhIUVVGaU8wRkJRMEVzU1VGQlNVTXNZMEZCWXl4RFFVRnNRanRCUVVOQkxFbEJRVWxETEdOQlFXTXNRMEZCYkVJN08wRkJSVUVzU1VGQlRVTXNXVUZCV1R0QlFVTnFRa01zY1VKQlFXOUNMRU5CUkVnN1FVRkZha0pETEhGQ1FVRnZRaXhEUVVaSU8wRkJSMnBDUXl4WFFVRlZPMEZCUTFSRExGbEJRVlVzUlVGRVJEdEJRVVZVUXl4bFFVRmhPMEZCUmtvc1JVRklUenRCUVU5cVFrTXNWMEZCVlR0QlFVTlVSaXhaUVVGVkxFVkJSRVE3UVVGRlZFTXNaVUZCWVR0QlFVWktMRVZCVUU4N1FVRlhha0pGTEdGQlFWa3NSVUZCUTBNc1dVRkJXU3hEUVVGaUxFVkJXRXM3UVVGWmFrSkRMRmRCUVZVc1JVRkJRMFFzV1VGQldTeERRVUZpTEVWQldrODdRVUZoYWtKRkxGTkJRVkVzUlVGQlEwWXNXVUZCV1N4RFFVRmlMRVZCWWxNN1FVRmpha0pITEZkQlFWVXNSVUZCUTBnc1dVRkJXU3hEUVVGaUxFVkJaRTg3UVVGbGFrSkpMRTFCUVVzc1JVRkJRMG9zV1VGQldTeERRVUZpTzBGQlpsa3NRMEZCYkVJN08wRkJhMEpCU3l4RlFVRkZReXhSUVVGR0xFVkJRVmxETEV0QlFWb3NRMEZCYTBJc1dVRkJUVHRCUVVONFFqdEJRVU5EUml4SFFVRkZMR3RDUVVGR0xFVkJRWE5DUnl4SFFVRjBRaXhEUVVFd1FpeEZRVUZETEZWQlFXRklMRVZCUVVVc1RVRkJSaXhGUVVGVlNTeE5RVUZXTEVWQlFXSXNUMEZCUkN4RlFVRXhRanM3UVVGRlFTeExRVUZIUXl4UFFVRlBReXhWUVVGUUxFZEJRVzlDTEVkQlFYWkNMRVZCUVRSQ08wRkJRemRDTzBGQlEwVk9MRWxCUVVVc1VVRkJSaXhGUVVGWlR5eE5RVUZhTzBGQlEwWTdRVUZEUlVNc1VVRkJUU3gxUTBGQlRpeEZRVUVyUTBNc1NVRkJMME1zUTBGQmIwUXNWVUZCVTBNc1VVRkJWQ3hGUVVGdFFqdEJRVU4wUlN4VlFVRlBRU3hUUVVGVFF5eEpRVUZVTEVWQlFWQTdRVUZEUVN4SFFVWkVMRVZCUlVkR0xFbEJSa2dzUTBGRlVTeFZRVUZUUnl4VFFVRlVMRVZCUVc5Q08wRkJRek5DTEU5QlFVMURMRmxCUVZsRExHTkJRV05HTEZWQlFWVkhMRTFCUVhoQ0xFVkJRV2RETEUxQlFXaERMRU5CUVd4Q08wRkJRMEUxUWl4aFFVRlZVeXhSUVVGV0xFTkJRVzFDYjBJc1kwRkJia0lzWjBOQlFYZERTQ3hUUVVGNFF5eHpRa0ZCYzBSRExHTkJRV05HTEZWQlFWVkhMRTFCUVhoQ0xFVkJRV2RETEZWQlFXaERMRU5CUVhSRU8wRkJRMEUxUWl4aFFVRlZWU3hOUVVGV0xFTkJRV2xDYlVJc1kwRkJha0lzWjBOQlFYTkRTQ3hUUVVGMFF5eHpRa0ZCYjBSRExHTkJRV05HTEZWQlFWVkhMRTFCUVhoQ0xFVkJRV2RETEZGQlFXaERMRU5CUVhCRU8wRkJRMEUxUWl4aFFVRlZWeXhSUVVGV0xFTkJRVzFDYTBJc1kwRkJia0lzWjBOQlFYZERTQ3hUUVVGNFF5eHpRa0ZCYzBSRExHTkJRV05HTEZWQlFWVkhMRTFCUVhoQ0xFVkJRV2RETEZWQlFXaERMRU5CUVhSRU8wRkJRMEUxUWl4aFFVRlZUeXhWUVVGV0xFTkJRWEZDYzBJc1kwRkJja0lzWjBOQlFUQkRTQ3hUUVVFeFF5eHpRa0ZCZDBSRExHTkJRV05HTEZWQlFWVkhMRTFCUVhoQ0xFVkJRV2RETEZGQlFXaERMRU5CUVhoRU8wRkJRMEUxUWl4aFFVRlZXU3hIUVVGV0xFTkJRV05wUWl4alFVRmtMR2REUVVGdFEwZ3NVMEZCYmtNc2MwSkJRV2xFUXl4alFVRmpSaXhWUVVGVlJ5eE5RVUY0UWl4RlFVRm5ReXhMUVVGb1F5eERRVUZxUkR0QlFVTklPMEZCUTBkRk8wRkJRMEZETEd0Q1FVRmxMMElzVTBGQlppeEZRVUV3UWl4RFFVRXhRanRCUVVOSU8wRkJRMGRuUXl4bFFVRlpMRmxCUVUwN1FVRkRha0pFTEcxQ1FVRmxMMElzVTBGQlppeEZRVUV3UWl4RFFVRXhRanRCUVVOQkxFbEJSa1FzUlVGRlJ5eEpRVVpJTzBGQlIwRXNSMEZvUWtRN1FVRnBRa0U3UVVGRFJqdEJRVU5ETEV0QlFVMHlRaXhuUWtGQlowSXNVMEZCYUVKQkxHRkJRV2RDTEVOQlFVTk5MRXRCUVVRc1JVRkJVVU1zVFVGQlVpeEZRVUZ0UWp0QlFVTjBReXhUUVVGUFJDeE5RVUZOUlN4TlFVRk9MRU5CUVdFN1FVRkJRU3hWUVVGTExFOUJRVTlETEVWQlFVVXNWVUZCUml4RFFVRlFMRXRCUVhsQ0xGRkJRWHBDTEVsQlFYRkRRU3hGUVVGRkxGVkJRVVlzUlVGQlkwTXNWMEZCWkN4SFFVRTBRa01zVVVGQk5VSXNRMEZCY1VOS0xFOUJRVTlITEZkQlFWQXNSVUZCY2tNc1EwRkJNVU03UVVGQlFTeEhRVUZpTEVOQlFWQTdRVUZEUml4RlFVWkVPMEZCUjBRN1FVRkRReXhMUVVGTlVDeG5Ra0ZCWjBJc1UwRkJhRUpCTEdGQlFXZENMRWRCUVUwN08wRkJSWHBDTEUxQlFVbFRMRmRCUVZjc1EwRkJaanRCUVVOQkxFMUJRVWxETEZWQlFWVXNRMEZCUXl4SlFVRkVMRVZCUVU4c1MwRkJVQ3hGUVVGakxGRkJRV1FzUlVGQmQwSXNSMEZCZUVJc1EwRkJaRHRCUVVOQkxFOUJRVWtzU1VGQlNVTXNTVUZCU1N4RFFVRmFMRVZCUVdWQkxFbEJRVWxFTEZGQlFWRkZMRTFCUVZvc1NVRkJjMElzUTBGQlEzaENMRTlCUVU5NVFpeHhRa0ZCTjBNc1JVRkJiMFVzUlVGQlJVWXNRMEZCZEVVc1JVRkJlVVU3UVVGRGRrVjJRaXhWUVVGUGVVSXNjVUpCUVZBc1IwRkJLMEo2UWl4UFFVRlBjMElzVVVGQlVVTXNRMEZCVWl4SlFVRlhMSFZDUVVGc1FpeERRVUV2UWp0QlFVTkJka0lzVlVGQlR6QkNMRzlDUVVGUUxFZEJRVGhDTVVJc1QwRkJUM05DTEZGQlFWRkRMRU5CUVZJc1NVRkJWeXh6UWtGQmJFSXNTMEZCTmtOMlFpeFBRVUZQYzBJc1VVRkJVVU1zUTBGQlVpeEpRVUZYTERaQ1FVRnNRaXhEUVVFelJUdEJRVU5FT3p0QlFVVkVMRTFCUVVrc1EwRkJRM1pDTEU5QlFVOTVRaXh4UWtGQldpeEZRVU5GZWtJc1QwRkJUM2xDTEhGQ1FVRlFMRWRCUVN0Q0xGVkJRVk5GTEZGQlFWUXNSVUZCYlVKRExFOUJRVzVDTEVWQlFUUkNPMEZCUTNwRUxFOUJRVWxETEZkQlFWY3NTVUZCU1VNc1NVRkJTaXhIUVVGWFF5eFBRVUZZTEVWQlFXWTdRVUZEUVN4UFFVRkpReXhoUVVGaFF5eExRVUZMUXl4SFFVRk1MRU5CUVZNc1EwRkJWQ3hGUVVGWkxFMUJRVTFNTEZkQlFWZFNMRkZCUVdwQ0xFTkJRVm9zUTBGQmFrSTdRVUZEUVN4UFFVRkpZeXhMUVVGTGJrTXNUMEZCVDI5RExGVkJRVkFzUTBGQmEwSXNXVUZCVnp0QlFVRkZWQ3hoUVVGVFJTeFhRVUZYUnl4VlFVRndRanRCUVVGclF5eEpRVUZxUlN4RlFVTlFRU3hWUVVSUExFTkJRVlE3UVVGRlFWZ3NZMEZCVjFFc1YwRkJWMGNzVlVGQmRFSTdRVUZEUVN4VlFVRlBSeXhGUVVGUU8wRkJRMFFzUjBGUVJEczdRVUZUUml4TlFVRkpMRU5CUVVOdVF5eFBRVUZQTUVJc2IwSkJRVm9zUlVGRFFURkNMRTlCUVU4d1FpeHZRa0ZCVUN4SFFVRTRRaXhWUVVGVFV5eEZRVUZVTEVWQlFXRTdRVUZEZWtORkxHZENRVUZoUml4RlFVRmlPMEZCUTBRc1IwRkdSRHRCUVVkR0xFVkJka0pFT3p0QlFYbENRU3hMUVVGTlJ5eFhRVUZYTEZOQlFWaEJMRkZCUVZjc1EwRkJRME1zV1VGQlJDeEZRVUZyUWpzN1FVRkZiRU1zVFVGQlNVTXNWMEZCU2l4RlFVTkRReXhYUVVSRUxFVkJSVU5ETEUxQlJrUTdRVUZIUmp0QlFVTkZMRmRCUVZORExGRkJRVlFzUjBGQmNVSTdRVUZEYmtKb1JDeExRVUZGTEZWQlFVWXNSVUZCWTJsRUxGRkJRV1FzUTBGQmRVSXNVVUZCZGtJN1FVRkRRVXdzWjBKQlFXRk5MRTFCUVdJc1IwRkJjMEkzUXl4UFFVRlBlVUlzY1VKQlFWQXNRMEZCTmtKclFpeFJRVUUzUWl4RFFVRjBRanRCUVVOQlNDeGxRVUZaVFN4TlFVRmFPMEZCUTBGT0xHVkJRVmxQTEUxQlFWbzdRVUZEUkRzN1FVRkZSQ3hYUVVGVFF5eE5RVUZVTEVOQlFXbENReXhQUVVGcVFpeEZRVUV3UWpzN1FVRkZla0lzVDBGQlNVTXNUMEZCVHl4RlFVRllPMEZCUVVFc1QwRkRRME1zWVVGQllTeERRVVJrTzBGQlFVRXNUMEZGUTBNc1dVRkJXU3hEUVVaaU8wRkJRVUVzVDBGSFEwTXNXVUZCV1N4RFFVaGlPMEZCUVVFc1QwRkpRME1zWjBKQlFXZENUQ3hSUVVGUlN5eGhRVUZTTEVsQlFYbENMRU5CU2pGRE8wRkJRVUVzVDBGTFEwTXNhVUpCUVdsQ1RpeFJRVUZSVFN4alFVRlNMRWxCUVRCQ0xFTkJURFZET3p0QlFVOUJUQ3hSUVVGTFRTeFBRVUZNTEVkQlFXVlFMRkZCUVZGUExFOUJRWFpDTzBGQlEwRk9MRkZCUVV0UExFdEJRVXdzUjBGQllWSXNVVUZCVVZFc1MwRkJja0k3UVVGRFFWQXNVVUZCUzI1RUxFMUJRVXdzUjBGQlkydEVMRkZCUVZGc1JDeE5RVUYwUWp0QlFVTkJiVVFzVVVGQlMxRXNTMEZCVEN4SFFVRmhWQ3hSUVVGUlV5eExRVUZ5UWp0QlFVTkJVaXhSUVVGTFV5eExRVUZNTEVkQlFXRldMRkZCUVZGVkxFdEJRWEpDT3p0QlFVVkJWQ3hSUVVGTFNpeE5RVUZNTEVkQlFXTXNXVUZCV1RzN1FVRkZja0pOTEdsQ1FVRmhMRU5CUVdJN08wRkJSVUVzVVVGQlNVRXNXVUZCV1VVc1lVRkJhRUlzUlVGQkswSTdPMEZCUld4RFJpeHBRa0ZCV1N4RFFVRmFPMEZCUTBzN1FVRkRRU3hUUVVGSlJDeGhRVUZoU1N4cFFrRkJhVUlzUTBGQmJFTXNSVUZCY1VNN1FVRkRja003UVVGRFJVb3NiMEpCUVdNc1EwRkJaRHRCUVVORUxFMUJTRVFzVFVGSFR6dEJRVU5RUlR0QlFVTkZSaXh0UWtGQllTeERRVUZpT3p0QlFVVkJMRlZCUVVkRkxHTkJRV05JTEV0QlFVdFRMRXRCUVhSQ0xFVkJRVFpDTzBGQlF6VkNNMFFzWTBGQlR6QkNMRzlDUVVGUUxFTkJRVFJDWVN4aFFVRmhUU3hOUVVGNlF6dEJRVU5CTzBGQlEwWTdRVUZEU0R0QlFVTkdMRWxCY0VKSU96dEJRWE5DUVVzc1VVRkJTMGdzVFVGQlRDeEhRVUZqTEZsQlFWazdPMEZCUlhoQ08wRkJRMEZITEZOQlFVdE5MRTlCUVV3c1EwRkJZVWtzVTBGQllpeERRVUYxUWl4RFFVRjJRaXhGUVVFd1FpeERRVUV4UWl4RlFVRTJRbFlzUzBGQlMwOHNTMEZCYkVNc1JVRkJlVU5RTEV0QlFVdHVSQ3hOUVVFNVF6czdRVUZGUVcxRUxGTkJRVXROTEU5QlFVd3NRMEZCWVVzc1UwRkJZaXhEUVVORldDeExRVUZMVVN4TFFVUlFMRVZCUlVWdVFpeGhRVUZoTlVJc1kwRkJZaXhEUVVFMFFuZERMRlZCUVRWQ0xFVkJRWGREVnl4TFFVRjRReXhEUVVFNFEzWkRMRU5CUm1oRUxFVkJSMFZuUWl4aFFVRmhOVUlzWTBGQllpeERRVUUwUW5kRExGVkJRVFZDTEVWQlFYZERWeXhMUVVGNFF5eERRVUU0UTBNc1EwRklhRVFzUlVGSlJTeEhRVXBHTEVWQlMwVXNSMEZNUml4RlFVMUZMRU5CVGtZc1JVRlBSU3hEUVZCR0xFVkJVVVV2UkN4UFFVRlBReXhWUVVGUUxFZEJRVzlDTEV0QlVuUkNMRVZCVTBWRUxFOUJRVTlETEZWQlFWQXNSMEZCYjBJc1IwRlVkRUk3UVVGVlJDeEpRV1pFT3p0QlFXbENRU3hWUVVGUGFVUXNTVUZCVUR0QlFVTkJPenRCUVVWRU8wRkJRMEZTTEZkQlFWTTVReXhUUVVGVGIwVXNZMEZCVkN4RFFVRjNRaXhSUVVGNFFpeERRVUZVTzBGQlEwRjBRaXhUUVVGUFpTeExRVUZRTEVkQlFXVjZSQ3hQUVVGUFF5eFZRVUZRTEVkQlFXOUNMRXRCUVc1RE8wRkJRMEY1UXl4VFFVRlBNME1zVFVGQlVDeEhRVUZuUWtNc1QwRkJUME1zVlVGQlVDeEhRVUZ2UWl4SFFVRndRenM3UVVGRlFUdEJRVU5CZDBNc1owSkJRV01zU1VGQlNYZENMRXRCUVVvc1JVRkJaRHM3UVVGRlFUdEJRVU5CZWtJc1owSkJRV05STEU5QlFVODdRVUZEY0VKUkxGbEJRVk5rTEU5QlFVOTNRaXhWUVVGUUxFTkJRV3RDTEVsQlFXeENMRU5CUkZjN1FVRkZjRUpVTEZWQlFVOHNTVUZHWVR0QlFVZHdRakZFTEZkQlFWRXNTVUZJV1R0QlFVbHdRakpFTEZWQlFVOXFRaXhYUVVwaE8wRkJTM0JDWXl4dFFrRkJaMEpvUWl4aFFVRmhOVUlzWTBGQllpeERRVUUwUW1Fc1RVRk1lRUk3UVVGTmNFSTRRaXhyUWtGQlpTeERRVTVMTzBGQlQzQkNTeXhWUVVGUGNFSXNZVUZCWVdwRU8wRkJVRUVzUjBGQlVDeERRVUZrT3p0QlFWVkJPMEZCUTBGdFJDeGpRVUZaTUVJc1owSkJRVm9zUTBGQk5rSXNUVUZCTjBJc1JVRkJjVU40UWl4UlFVRnlRenRCUVVOQlJpeGpRVUZaTWtJc1IwRkJXaXhIUVVGclFpd3dRMEZCYkVJN1FVRkRRU3hGUVRWR1JEczdRVUU0UmtRN08wRkJSVU1zUzBGQlRVTXNZVUZCWVN4VFFVRmlRU3hWUVVGaExFTkJRVU5ETEV0QlFVUXNSVUZCVnp0QlFVTTNRaXhOUVVGSFFTeFZRVUZWTEVOQlFXSXNSVUZCWjBJN1FVRkRaak5GTEV0QlFVVXNUMEZCUml4RlFVRlhORVVzVjBGQldDeERRVUYxUWl4WlFVRjJRanRCUVVOQk5VVXNTMEZCUlN4dlFrRkJSaXhGUVVGM1FqUkZMRmRCUVhoQ0xFTkJRVzlETEdsQ1FVRndRenRCUVVOQk5VVXNTMEZCUlN4WFFVRkdMRVZCUVdVMlJTeEpRVUZtTEVOQlFXOUNMRlZCUVhCQ0xFVkJRV2RETlVJc1VVRkJhRU1zUTBGQmVVTXNZVUZCZWtNN1FVRkRRV3BFTEV0QlFVVXNZVUZCUml4RlFVRnBRbWxFTEZGQlFXcENMRU5CUVRCQ0xHbENRVUV4UWp0QlFVTkJha1FzUzBGQlJTeGhRVUZHTEVWQlFXbENOa1VzU1VGQmFrSXNRMEZCYzBJc1QwRkJkRUlzUlVGQkswSTFRaXhSUVVFdlFpeERRVUYzUXl4WlFVRjRRenRCUVVOQmFrUXNTMEZCUlN4WFFVRkdMRVZCUVdVMlJTeEpRVUZtTEVOQlFXOUNMR05CUVhCQ0xFVkJRVzlETlVJc1VVRkJjRU1zUTBGQk5rTXNUVUZCTjBNN1FVRkRRVklzWTBGQlZ5eFpRVUZOTzBGQlEyaENla01zVFVGQlJTdzBRa0ZCUml4RlFVRm5RelpGTEVsQlFXaERMRU5CUVhGRExGVkJRWEpETEVWQlFXbEVOVUlzVVVGQmFrUXNRMEZCTUVRc1VVRkJNVVE3UVVGRFFTeEpRVVpFTEVWQlJVY3NTVUZHU0R0QlFVZEJMRWRCVmtRc1RVRlhTenRCUVVOS2FrUXNTMEZCUlN4UFFVRkdMRVZCUVZjMFJTeFhRVUZZTEVOQlFYVkNMRmxCUVhaQ08wRkJRMEUxUlN4TFFVRkZMR0ZCUVVZc1JVRkJhVUkwUlN4WFFVRnFRaXhEUVVFMlFpeHBRa0ZCTjBJN1FVRkRRVFZGTEhsRFFVRnZRekpGTEV0QlFYQkRMR3RDUVVGM1JFTXNWMEZCZUVRc1EwRkJiMFVzYVVKQlFYQkZPMEZCUTBFMVJTeDFRa0ZCYjBJMlJTeEpRVUZ3UWl4RFFVRjVRaXhQUVVGNlFpeEZRVUZyUXpWQ0xGRkJRV3hETEVOQlFUSkRMRmxCUVRORE96dEJRVVZCYWtRc2QwSkJRWEZDTmtVc1NVRkJja0lzZFVKQlFXZEVOVUlzVVVGQmFFUXNRMEZCZVVRc2FVSkJRWHBFTEVWQlFUUkZOa0lzUlVGQk5VVXNRMEZCSzBVc2FVTkJRUzlGTEVWQlFXdElMRlZCUVVORExFVkJRVVFzUlVGQlVUdEJRVU40U0M5RkxIZENRVUZ2UWpaRkxFbEJRWEJDTEVOQlFYbENMRTlCUVhwQ0xFVkJRV3REUkN4WFFVRnNReXhEUVVFNFF5eFpRVUU1UXp0QlFVTkVMRWxCUmtRN08wRkJTVUVzVDBGQlJ6VkZMR1ZCUVdFeVJTeExRVUZpTEhOQ1FVRnhRemxETEUxQlFYSkRMRWxCUVN0RE4wSXNaVUZCWVRKRkxFdEJRV0lzTmtKQlFUUkRPVU1zVFVGQk5VTXNSMEZCY1VRc1EwRkJka2NzUlVGQk1FYzdRVUZEZWtjM1FpeHRRa0ZCWVRKRkxFdEJRV0lzYzBKQlFYRkRTeXhIUVVGeVF5eERRVUY1UXl4RFFVRjZReXhGUVVFMFEwTXNTMEZCTlVNN1FVRkRRVHRCUVVORU8wRkJRMFFzUlVFeFFrUTdPMEZCTkVKRU96dEJRVVZETEV0QlFVMURMRzlDUVVGdlFpeFRRVUZ3UWtFc2FVSkJRVzlDTEVOQlFVTkRMR0ZCUVVRc1JVRkJaMEpETEVkQlFXaENMRVZCUVhkQ08wRkJRMnBFY0VZc2FVSkJRV0Z0Uml4aFFVRmlMR3RDUVVGMVEwTXNSMEZCZGtNc1JVRkJPRU5ETEZGQlFUbERMRU5CUVhWRUxHOUNRVUYyUkN4RlFVRTJSVU1zUjBGQk4wVXNRMEZCYVVZc1ZVRkJRME1zUlVGQlJDeEZRVUZMUXl4SFFVRk1MRVZCUVdFN1FVRkROMFo0Uml4TFFVRkZkMFlzUjBGQlJpeEZRVUZQY2tZc1IwRkJVQ3hEUVVGWExFVkJRVU56Uml4VFFVRlRMRU5CUVZZc1JVRkJXRHRCUVVOQkxFZEJSa1E3TzBGQlNVRjZSaXhwUWtGQllXMUdMR0ZCUVdJc2EwSkJRWFZEUXl4SFFVRjJReXhGUVVFNFEycEdMRWRCUVRsRExFTkJRV3RFTzBGQlEycEVMR2RDUVVGaExGbEJSRzlETzBGQlJXcEVMR05CUVZjN1FVRkdjME1zUjBGQmJFUTdRVUZKUVN4RlFWUkVPenRCUVZkRU8wRkJRME1yUlN4dFFrRkJhMElzUTBGQmJFSXNSVUZCY1VJc1EwRkJja0k3UVVGRFFVRXNiVUpCUVd0Q0xFTkJRV3hDTEVWQlFYRkNMRU5CUVhKQ08wRkJRMEZCTEcxQ1FVRnJRaXhEUVVGc1FpeEZRVUZ4UWl4RFFVRnlRanM3UVVGRlJEczdRVUZGUXl4TFFVRk5hRVVzYVVKQlFXbENMRk5CUVdwQ1FTeGpRVUZwUWl4RFFVRkRkMFVzVFVGQlJDeEZRVUZUVUN4aFFVRlVMRVZCUVRKQ08wRkJRMnBFTEUxQlFVbFJMREJDUVVGS096dEJRVVZCTEUxQlFVZFNMR3RDUVVGclFpeERRVUZ5UWl4RlFVRjNRanRCUVVOMlFpeFhRVUZQVHl4UFFVRlBja2NzYTBKQlFXUTdRVUZEUXl4VFFVRkxMRU5CUVV3N1FVRkRRM05ITEhsQ1FVRnZRbmhITEZWQlFWVlBMRlZCUVRsQ08wRkJRMFE3UVVGRFFTeFRRVUZMTEVOQlFVdzdRVUZEUTJsSExIbENRVUZ2UW5oSExGVkJRVlZUTEZGQlFUbENPMEZCUTBRN1FVRkRRU3hUUVVGTExFTkJRVXc3UVVGRFF5dEdMSGxDUVVGdlFuaEhMRlZCUVZWVkxFMUJRVGxDTzBGQlEwUTdRVUZEUVN4VFFVRkxMRU5CUVV3N1FVRkRRemhHTEhsQ1FVRnZRbmhITEZWQlFWVlhMRkZCUVRsQ08wRkJRMFE3UVVGRFFTeFRRVUZMTEVOQlFVdzdRVUZEUXpaR0xIbENRVUZ2UW5oSExGVkJRVlZaTEVkQlFUbENPMEZCUTBRN1FVRm1SRHRCUVdsQ1FUczdRVUZGUkVNc2FVSkJRV0Z0Uml4aFFVRmlMRVZCUVRoQ1RpeEpRVUU1UWl4RFFVRnRReXhQUVVGdVF5eEZRVUUwUTBRc1YwRkJOVU1zUTBGQmQwUXNXVUZCZUVRN1FVRkRRVFZGTEdsQ1FVRmhiVVlzWVVGQllpeHJRa0ZCZFVOUExHMUNRVUZwUWxBc1lVRkJha0lzWjBKQlFYWkRMRVZCUVhOR1VDeFhRVUYwUml4RFFVRnJSeXhwUWtGQmJFYzdRVUZEUVUwc2IwSkJRV3RDUXl4aFFVRnNRaXhGUVVGcFEwOHNiVUpCUVdsQ1VDeGhRVUZxUWl4blFrRkJha003TzBGQlJVRXhReXhoUVVGWExGbEJRVTA3UVVGRGFFSXNUMEZCUnpCRExHdENRVUZyUWl4RFFVRnlRaXhGUVVGM1FqdEJRVU4yUW5oRExHRkJRVk5uUkN4cFFrRkJWRHRCUVVOQk96dEJRVVZFTTBZc2EwSkJRV0Z0Uml4aFFVRmlMRVZCUVRoQ1RpeEpRVUU1UWl4MVFrRkJlVVExUWl4UlFVRjZSQ3hEUVVGclJTeHBRa0ZCYkVVN1FVRkRRV3BFTEd0Q1FVRmhiVVlzWVVGQllpeEZRVUU0UWs0c1NVRkJPVUlzUTBGQmJVTXNUMEZCYmtNc1JVRkJORU0xUWl4UlFVRTFReXhEUVVGeFJDeFpRVUZ5UkR0QlFVTkJMRWRCVUVRc1JVRlBSeXhIUVZCSU96dEJRVk5CTEUxQlFVZDVReXh0UWtGQmFVSlFMR0ZCUVdwQ0xIRkNRVUZuUkc1R0xHVkJRV0Z0Uml4aFFVRmlMRVZCUVRoQ1RpeEpRVUU1UWl4MVFrRkJlVVJvUkN4TlFVRjZSQ3hIUVVGclJTeERRVUZ5U0N4RlFVRjNTRHRCUVVOMlNEWkVMSE5DUVVGcFFsQXNZVUZCYWtJc2JVSkJRVGhETEVOQlFUbERPMEZCUTBFc1IwRkdSQ3hOUVVWUE8wRkJRMDVQTEhOQ1FVRnBRbEFzWVVGQmFrSXNiMEpCUVN0RExFTkJRUzlETzBGQlEwRTdRVUZEUkN4RlFYcERSRHRCUVRCRFJEdEJRVU5EYWtVc1owSkJRV1V2UWl4VFFVRm1MRVZCUVRCQ0xFTkJRVEZDT3p0QlFVVkVPMEZCUTBOblF5eGhRVUZaTEZsQlFVMDdRVUZEYWtKRUxHbENRVUZsTDBJc1UwRkJaaXhGUVVFd1FpeERRVUV4UWp0QlFVTkJMRVZCUmtRc1JVRkZSeXhMUVVaSU96dEJRVWxFT3p0QlFVVkRMRXRCUVUxNVJ5dzRRa0ZCT0VJc1UwRkJPVUpCTERKQ1FVRTRRaXhEUVVGRFF5eERRVUZFTEVWQlFVODdPMEZCUlRGRExFMUJRVTFVTEUxQlFVMVZMRk5CUVZNNVJpeEZRVUZGTmtZc1JVRkJSVVVzVFVGQlNpeEZRVUZaUXl4SlFVRmFMRU5CUVdsQ0xGbEJRV3BDTEVOQlFWUXNRMEZCV2p0QlFVTkJMRTFCUVUxRExGbEJRVmxxUnl4RlFVRkZOa1lzUlVGQlJVVXNUVUZCU2l4RlFVRlpSeXhQUVVGYUxFTkJRVzlDTEZOQlFYQkNMRVZCUVN0Q1JpeEpRVUV2UWl4RFFVRnZReXhKUVVGd1F5eERRVUZzUWp0QlFVTkJMRTFCUVVsSExEQkNRVUZLT3p0QlFVVkJMRTFCUVVkR0xHTkJRV01zVlVGQmFrSXNSVUZCTmtJN1FVRkROVUpvU0N4cFFrRkJZMjFITEVkQlFXUTdRVUZEUVRzN1FVRkZSQ3hOUVVGSFlTeGpRVUZqTEZWQlFXcENMRVZCUVRaQ08wRkJRelZDTDBjc2FVSkJRV05yUnl4SFFVRmtPMEZCUTBFN08wRkJSVVJ3Uml4VlFVRk5hVWNzVTBGQlRpeEZRVUZ0UW5CQ0xFbEJRVzVDTEVOQlFYZENMRTlCUVhoQ0xFVkJRV2xEUkN4WFFVRnFReXhEUVVFMlF5eFpRVUUzUXp0QlFVTkJOVVVzVlVGQlRXbEhMRk5CUVU0c1JVRkJiVUp3UWl4SlFVRnVRaXhEUVVGM1FpeGpRVUY0UWl4RlFVRjNRMFFzVjBGQmVFTXNRMEZCYjBRc1RVRkJjRVE3UVVGRFFUVkZMRlZCUVUxcFJ5eFRRVUZPTEVWQlFXMUNjRUlzU1VGQmJrSXNhMEpCUVhWRFR5eEhRVUYyUXl4RlFVRTRRMjVETEZGQlFUbERMRU5CUVhWRUxFMUJRWFpFTzBGQlEwRnFSQ3hWUVVGTmFVY3NVMEZCVGl4clFrRkJORUppTEVkQlFUVkNMRVZCUVcxRFVpeFhRVUZ1UXl4RFFVRXJReXhwUWtGQkwwTTdRVUZEUVRWRkxGVkJRVTFwUnl4VFFVRk9MSE5DUVVGclEzSkNMRmRCUVd4RExFTkJRVGhETEZGQlFUbERPMEZCUTBFMVJTeEpRVUZGTmtZc1JVRkJSVVVzVFVGQlNpeEZRVUZaT1VNc1VVRkJXaXhEUVVGeFFpeFJRVUZ5UWpzN1FVRkZRV2xETEc5Q1FVRnJRbGtzVTBGQlV6bEdMRkZCUVUxcFJ5eFRRVUZPTEVWQlFXMUNSQ3hKUVVGdVFpeERRVUYzUWl4WlFVRjRRaXhEUVVGVUxFTkJRV3hDTEVWQlFXMUZXaXhIUVVGdVJUczdRVUZGUVRORExHRkJRVmNzV1VGQlRUdEJRVU5vUW1sRExHTkJRVmR2UWl4VFFVRlRPVVlzVVVGQlRXbEhMRk5CUVU0c1JVRkJiVUpFTEVsQlFXNUNMRU5CUVhkQ0xGbEJRWGhDTEVOQlFWUXNRMEZCV0R0QlFVTkJMRWRCUmtRc1JVRkZSeXhIUVVaSU96dEJRVWxCTEUxQlFVZERMR05CUVdNc1ZVRkJha0lzUlVGQk5FSTdRVUZETTBKcVJ5eFhRVUZOYVVjc1UwRkJUaXhGUVVGdFFuQkNMRWxCUVc1Q0xFTkJRWGRDTEdGQlFYaENMRVZCUVhWRE5VSXNVVUZCZGtNc1EwRkJaMFFzVVVGQmFFUTdRVUZEUVdwRUxGZEJRVTFwUnl4VFFVRk9MRVZCUVcxQ2JrSXNSVUZCYmtJc1EwRkJjMElzYTBSQlFYUkNMRVZCUVRCRkxGVkJRVU5ETEVWQlFVUXNSVUZCVVR0QlFVTXZSUzlGTEZsQlFVMXBSeXhUUVVGT0xFVkJRVzFDY0VJc1NVRkJia0lzUTBGQmQwSXNZVUZCZUVJc1JVRkJkVU5FTEZkQlFYWkRMRU5CUVcxRUxGRkJRVzVFTzBGQlEwWXNTVUZHUkR0QlFVZEJPMEZCUTBRc1JVRnFRMFE3TzBGQmJVTkVPenRCUVVWRE5VVXNSMEZCUlN4dlJFRkJSaXhGUVVGM1JHbEdMRXRCUVhoRUxFTkJRVGhFTEZWQlFVTlpMRU5CUVVRc1JVRkJUenM3UVVGRmNFVXNUVUZCUnpGSExGVkJRVlZoTEVWQlFVVTJSaXhGUVVGRlR5eGhRVUZLTEVWQlFXMUNSaXhQUVVGdVFpeERRVUV5UWl4VFFVRXpRaXhGUVVGelEwWXNTVUZCZEVNc1EwRkJNa01zU1VGQk0wTXNRMEZCVml4RlFVRTBSSGhITEZkQlFTOUVMRVZCUVRSRk8wRkJRemxGTzBGQlEwYzJSeXh0UWtGQlowSXNTMEZCYUVJc1JVRkJkVUp5Unl4RlFVRkZOa1lzUlVGQlJVOHNZVUZCU2l4RlFVRnRRa1lzVDBGQmJrSXNRMEZCTWtJc1UwRkJNMElzUlVGQmMwTkdMRWxCUVhSRExFTkJRVEpETEVsQlFUTkRMRU5CUVhaQ08wRkJRMGc3UVVGRFIwc3NiVUpCUVdkQ0xFbEJRV2hDTEVWQlFYTkNja2NzUlVGQlJUWkdMRVZCUVVWUExHRkJRVW9zUlVGQmJVSkdMRTlCUVc1Q0xFTkJRVEpDTEZOQlFUTkNMRVZCUVhORFJpeEpRVUYwUXl4RFFVRXlReXhKUVVFelF5eERRVUYwUWl4RlFVRjNSU3hMUVVGNFJUdEJRVU5CTzBGQlEwZzdRVUZEUlN4TlFVRkhMRU5CUVVOb1J5eEZRVUZGTmtZc1JVRkJSVThzWVVGQlNpeEZRVUZ0UWtVc1VVRkJia0lzUTBGQk5FSXNVVUZCTlVJc1EwRkJTaXhGUVVFeVF6dEJRVU14UTFZc0swSkJRVFJDUXl4RFFVRTFRanRCUVVOQk8wRkJRMFFzUlVGYVJEczdRVUZqUkRzN1FVRkZReXhMUVVGSExFTkJRVU0zUml4RlFVRkZkVWNzVVVGQlJpeEZRVUZaVUN4SlFVRmFMRU5CUVdsQ0xFMUJRV3BDTEVWQlFYbENka1VzVVVGQmVrSXNRMEZCYTBNc1YwRkJiRU1zUTBGQlNpeEZRVUZ2UkR0QlFVTnVSSHBDTEVsQlFVVXNhMEpCUVVZc1JVRkJjMEozUnl4alFVRjBRaXhEUVVGeFF6dEJRVU53UTBNc2NVSkJRV3RDTEZOQlJHdENPMEZCUlhCRFF5eFhRVUZSTEZWQlJqUkNPMEZCUjNCRFF5eHJRa0ZCWlROSUxFbEJTSEZDTzBGQlNYQkRORWdzWlVGQldTeEpRVXAzUWp0QlFVdHdRME1zWTBGQlZ5eEpRVXg1UWp0QlFVMXdRME1zWlVGQldTeHZRa0ZCUTI1RExFdEJRVVFzUlVGQlZ5eERRVUZGTEVOQlRsYzdRVUZQY0VOdlF5eGpRVUZYTEcxQ1FVRkRjRU1zUzBGQlJDeEZRVUZYTzBGQlEzcENPenRCUVVWSlJDeGxRVUZYUXl4TFFVRllPMEZCUTBFc1NVRlliVU03UVVGWmNFTnhReXhUUVVGTkxFdEJXamhDTzBGQllYQkRReXhoUVVGVkxFbEJZakJDTzBGQlkzQkRReXgxUWtGQmIwSXNTMEZrWjBJN1FVRmxjRU5ETEdOQlFWYzdRVUZtZVVJc1IwRkJja003TzBGQmEwSkJia2dzU1VGQlJTeHJRa0ZCUml4RlFVRnpRbTlJTEUxQlFYUkNMRU5CUVRaQ0xFTkJRVGRDTzBGQlEwRTdPMEZCUlVZN08wRkJSVU53U0N4SFFVRkZMRmxCUVVZc1JVRkJaMEpwUml4TFFVRm9RaXhEUVVGelFpeFZRVUZEV1N4RFFVRkVMRVZCUVU4N1FVRkROVUlzVFVGQlNYZENMR2xDUVVGcFFuSklMRVZCUVVVMlJpeEZRVUZGUlN4TlFVRktMRVZCUVZsSExFOUJRVm9zUTBGQmIwSnNSeXhGUVVGRkxHRkJRVVlzUTBGQmNFSXNRMEZCY2tJN08wRkJSVUVzVFVGQlIzRklMR1ZCUVdWbUxGRkJRV1lzUTBGQmQwSXNUVUZCZUVJc1EwRkJTQ3hGUVVGdlF6dEJRVU51UTJVc2EwSkJRV1Y2UXl4WFFVRm1MRU5CUVRKQ0xFMUJRVE5DTzBGQlEwRjVReXhyUWtGQlpYaERMRWxCUVdZc1EwRkJiMElzV1VGQmNFSXNSVUZCYTBORUxGZEJRV3hETEVOQlFUaERMRkZCUVRsRE8wRkJRMEY1UXl4clFrRkJaV2hETEZGQlFXWXNRMEZCZDBJc1lVRkJlRUlzUlVGQmRVTkRMRWRCUVhaRExFTkJRVEpETEZWQlFVTkdMRWRCUVVRc1JVRkJUV3RETEU5QlFVNHNSVUZCYTBJN1FVRkROVVIwU0N4TlFVRkZjMGdzVDBGQlJpeEZRVUZYTVVNc1YwRkJXQ3hEUVVGMVFpeFJRVUYyUWp0QlFVTkJOVVVzVFVGQlJYTklMRTlCUVVZc1JVRkJWM3BETEVsQlFWZ3NRMEZCWjBJc1QwRkJhRUlzUlVGQmVVSkVMRmRCUVhwQ0xFTkJRWEZETEZOQlFYSkRMRVZCUVdkRU0wSXNVVUZCYUVRc1EwRkJlVVFzV1VGQmVrUTdRVUZEUVN4SlFVaEVPMEZCU1VFc1IwRlFSQ3hOUVU5UE8wRkJRMDV2UlN4clFrRkJaWHBETEZkQlFXWXNRMEZCTWtJc1VVRkJNMElzUlVGQmNVTXpRaXhSUVVGeVF5eERRVUU0UXl4TlFVRTVRenRCUVVOQmIwVXNhMEpCUVdWMlF5eEZRVUZtTEVOQlFXdENMR3RFUVVGc1FpeEZRVUZ6UlN4VlFVRkRReXhGUVVGRUxFVkJRVkU3UVVGRE0wVXZSU3hOUVVGRkxHdENRVUZHTEVWQlFYTkNOa1VzU1VGQmRFSXNRMEZCTWtJc1dVRkJNMElzUlVGQmVVTTFRaXhSUVVGNlF5eERRVUZyUkN4UlFVRnNSRHRCUVVOQmFrUXNUVUZCUlN4clFrRkJSaXhGUVVGelFqWkZMRWxCUVhSQ0xFTkJRVEpDTEZWQlFUTkNMRVZCUVhWRFF5eEZRVUYyUXl4RFFVRXdReXhyUkVGQk1VTXNSVUZCT0VZc1ZVRkJRME1zUlVGQlJDeEZRVUZSTzBGQlEzUkhMMFVzVDBGQlJTeHJRa0ZCUml4RlFVRnpRalpGTEVsQlFYUkNMRU5CUVRKQ0xFOUJRVE5DTEVWQlFXOUROVUlzVVVGQmNFTXNRMEZCTmtNc1UwRkJOME1zUlVGQmQwUXlRaXhYUVVGNFJDeERRVUZ2UlN4WlFVRndSVHRCUVVORUxFdEJSa003UVVGSFJpeEpRVXhFTzBGQlRVRjVReXhyUWtGQlpXaERMRkZCUVdZc1EwRkJkMElzWVVGQmVFSXNSVUZCZFVORExFZEJRWFpETEVOQlFUSkRMRlZCUVVOR0xFZEJRVVFzUlVGQlRXdERMRTlCUVU0c1JVRkJhMEk3UVVGRE5VUjBTQ3hOUVVGRmMwZ3NUMEZCUml4RlFVRlhNVU1zVjBGQldDeERRVUYxUWl4TlFVRjJRaXhGUVVFclFqTkNMRkZCUVM5Q0xFTkJRWGRETEZGQlFYaERPMEZCUTBGcVJDeE5RVUZGYzBnc1QwRkJSaXhGUVVGWGVrTXNTVUZCV0N4RFFVRm5RaXhQUVVGb1FpeEZRVUY1UWtRc1YwRkJla0lzUTBGQmNVTXNXVUZCY2tNc1JVRkJiVVF6UWl4UlFVRnVSQ3hEUVVFMFJDeFRRVUUxUkR0QlFVTkJha1FzVFVGQlJYTklMRTlCUVVZc1JVRkJWM3BETEVsQlFWZ3NRMEZCWjBJc1dVRkJhRUlzUlVGQk9FSkVMRmRCUVRsQ0xFTkJRVEJETEZGQlFURkRPMEZCUTBFc1NVRktSRHRCUVV0Qk8wRkJRMFI1UXl4cFFrRkJaWGhETEVsQlFXWXNRMEZCYjBJc1QwRkJjRUlzUlVGQk5rSkVMRmRCUVRkQ0xFTkJRWGxETEZOQlFYcERMRVZCUVc5RU0wSXNVVUZCY0VRc1EwRkJOa1FzV1VGQk4wUTdRVUZEUVN4RlFYcENSRHM3UVVFeVFrUTdPMEZCUlVOcVJDeEhRVUZGTEZsQlFVWXNSVUZCWjBKcFJpeExRVUZvUWl4RFFVRnpRaXhaUVVGTk8wRkJRek5DTEUxQlFVZHFSaXhGUVVGRlN5eE5RVUZHTEVWQlFWVkVMRTFCUVZZc1RVRkJjMEpLTEVWQlFVVXNUMEZCUml4RlFVRlhOa0lzVFVGQldDeEhRVUZ2UWl4RFFVRXhReXhOUVVGcFJDeERRVUZGTjBJc1JVRkJSU3hyUWtGQlJpeEZRVUZ6UW5WSUxFMUJRWFJDTEVkQlFTdENReXhIUVVGeVJpeEZRVUV3Ump0QlFVTTFSanRCUVVOSmVFZ3NTMEZCUlN4clFrRkJSaXhGUVVGelFtOUlMRTFCUVhSQ0xFTkJRVFpDTEVOQlFUZENPMEZCUTBRc1IwRklSQ3hOUVVkUE8wRkJRMDV3U0N4TFFVRkZMR3RDUVVGR0xFVkJRWE5DZVVnc1VVRkJkRUk3UVVGRFFUdEJRVU5FTEVWQlVFUTdPMEZCVTBRN08wRkJSVU1zUzBGQlRVTXNkVUpCUVhWQ0xGTkJRWFpDUVN4dlFrRkJkVUlzUjBGQlRUdEJRVU5zUXl4TlFVRkhja2dzVDBGQlQwTXNWVUZCVUN4SFFVRnZRaXhIUVVGd1FpeEpRVUV5UWl4RFFVRkRUaXhGUVVGRkxGVkJRVVlzUlVGQlkzTkhMRkZCUVdRc1EwRkJkVUlzVVVGQmRrSXNRMEZCTDBJc1JVRkJhVVU3TzBGQlJXaEZMRTlCUVVkMFJ5eEZRVUZGTEZGQlFVWXNSVUZCV1RaQ0xFMUJRVm9zU1VGQmMwSTNRaXhGUVVGRkxGRkJRVVlzUlVGQldXZEdMRWRCUVZvc1EwRkJaMElzUTBGQmFFSXNSVUZCYlVJeVF5eFZRVUZ1UWl4TFFVRnJReXhEUVVFelJDeEZRVUU0UkR0QlFVTTNSRE5JTEUxQlFVVXNWVUZCUml4RlFVRmphVVFzVVVGQlpDeERRVUYxUWl4UlFVRjJRanRCUVVOQk8wRkJRMFE3UVVGRFJDeEZRVkJFT3p0QlFWTkVPenRCUVVWRExFdEJRVTF2UkN4clFrRkJhMElzVTBGQmJFSkJMR1ZCUVd0Q0xFTkJRVU4xUWl4SlFVRkVMRVZCUVU4elFpeFRRVUZRTEVWQlFXdENha2dzU1VGQmJFSXNSVUZCTWtJN1FVRkRhRVFzVFVGQlJ6UkpMRWxCUVVnc1JVRkJVenRCUVVOVWVra3NZVUZCVlRoSExGTkJRVllzUlVGQmNVSXhSeXhSUVVGeVFpeEhRVUZuUXpSQ0xGbEJRVmtzV1VGQlRUdEJRVU12UXpCSExHOUNRVUZuUWpWQ0xGTkJRV2hDTEVWQlFUSkNMRWRCUVROQ08wRkJRMEVzU1VGR05rSXNSVUZGTTBKcVNDeEpRVVl5UWl4RFFVRm9RenRCUVVkRExFZEJTa1FzVFVGSlR6dEJRVU5PT0Vrc2FVSkJRV016U1N4VlFVRlZPRWNzVTBGQlZpeEZRVUZ4UWpGSExGRkJRVzVETzBGQlEwRTdRVUZEU0N4RlFWSkVPenRCUVZWRU96dEJRVVZETEV0QlFVY3NRMEZCUTFNc1JVRkJSWFZITEZGQlFVWXNSVUZCV1ZBc1NVRkJXaXhEUVVGcFFpeE5RVUZxUWl4RlFVRjVRblpGTEZGQlFYcENMRU5CUVd0RExGZEJRV3hETEVOQlFVb3NSVUZCYjBRN1FVRkRia1JPTEdOQlFWa3NXVUZCVFR0QlFVTnFRaXhQUVVGSGJrSXNSVUZCUlN4clFrRkJSaXhGUVVGelFuVklMRTFCUVhSQ0xFZEJRU3RDUXl4SFFVRXZRaXhKUVVGelF5eEZRVUZIYmtnc1QwRkJUekJJTEZkQlFWQXNSMEZCY1VJc1IwRkJlRUlzUTBGQmVrTXNSVUZCZFVVN1FVRkRkRVV2U0N4TlFVRkZMSFZDUVVGR0xFVkJRVEpDYVVRc1VVRkJNMElzUTBGQmIwTXNaVUZCY0VNN08wRkJSVUVzVVVGQlIycEVMRVZCUVVVc1VVRkJSaXhGUVVGWk5rSXNUVUZCV2l4SlFVRnpRamRDTEVWQlFVVXNVVUZCUml4RlFVRlpSeXhIUVVGYUxFTkJRV2RDTEZOQlFXaENMRTFCUVN0Q0xFMUJRWGhFTEVWQlFXZEZPMEZCUXk5RVNDeFBRVUZGTEZGQlFVWXNSVUZCV1dkR0xFZEJRVm9zUTBGQlowSXNRMEZCYUVJc1JVRkJiVUpuUkN4SlFVRnVRanRCUVVOQk96dEJRVVZFYUVrc1RVRkJSU3hSUVVGR0xFVkJRVmxwUkN4UlFVRmFMRU5CUVhGQ0xGTkJRWEpDTzBGQlEwRXNTVUZTUkN4TlFWRlBPMEZCUTA1cVJDeE5RVUZGTEhWQ1FVRkdMRVZCUVRKQ05FVXNWMEZCTTBJc1EwRkJkVU1zWlVGQmRrTTdRVUZEUVRWRkxFMUJRVVVzVVVGQlJpeEZRVUZaTkVVc1YwRkJXaXhEUVVGM1FpeFRRVUY0UWpzN1FVRkZRU3hSUVVGSE5VVXNSVUZCUlN4UlFVRkdMRVZCUVZrMlFpeE5RVUZtTEVWQlFYVkNPMEZCUTNSQ04wSXNUMEZCUlN4UlFVRkdMRVZCUVZsblJpeEhRVUZhTEVOQlFXZENMRU5CUVdoQ0xFVkJRVzFDYVVRc1MwRkJia0k3UVVGRFFUdEJRVU5FT3p0QlFVVktPenRCUVVWSExFOUJRVWRxU1N4RlFVRkZMR3RDUVVGR0xFVkJRWE5DZFVnc1RVRkJkRUlzUjBGQkswSkRMRWRCUVM5Q0xFZEJRWEZETEVWQlFVZHVTQ3hQUVVGUE1FZ3NWMEZCVUN4SFFVRnhRaXhEUVVGNFFpeERRVUY0UXl4RlFVRnZSVHRCUVVOdVJTOUlMRTFCUVVVc1dVRkJSaXhGUVVGblFrY3NSMEZCYUVJc1EwRkJiMElzUlVGQlF5eGhRVUZoTEdsRFFVRmtMRVZCUVhCQ08wRkJRMEVzU1VGR1JDeE5RVVZQTzBGQlEwNUlMRTFCUVVVc1dVRkJSaXhGUVVGblFrY3NSMEZCYUVJc1EwRkJiMElzUlVGQlF5eGhRVUZoTEN0Q1FVRmtMRVZCUVhCQ08wRkJRMEU3TzBGQlJVUjFTRHM3UVVGRlNEczdRVUZGUnl4UFFVRkhja2dzVDBGQlR6WklMRlZCUVZBc1EwRkJhMElzTUVKQlFXeENMRVZCUVRoRFF5eFBRVUU1UXl4SlFVRjVSRGxJTEU5QlFVOURMRlZCUVZBc1IwRkJiMElzUjBGQmFFWXNSVUZCY1VZN1FVRkRia1pPTEUxQlFVVXNOa1ZCUVVZc1JVRkJhVVpwUkN4UlFVRnFSaXhEUVVFd1JpeFhRVUV4Ump0QlFVTkVMRWxCUmtRc1RVRkZUenRCUVVOTWFrUXNUVUZCUlN3MlJVRkJSaXhGUVVGcFJqUkZMRmRCUVdwR0xFTkJRVFpHTEZkQlFUZEdPMEZCUTBRN08wRkJSVVFzVDBGQlJ6VkZMRVZCUVVVc2EwSkJRVVlzUlVGQmMwSTJRaXhOUVVGNlFpeEZRVUZwUXp0QlFVRkZPMEZCUTJ4RExGRkJRVWN4UXl4VlFVRlZSeXhSUVVGV0xFTkJRVzFDUlN4WFFVRnVRaXhMUVVGdFF5eEpRVUYwUXl4RlFVRTBRenRCUVVNelEwd3NaVUZCVlVjc1VVRkJWaXhEUVVGdFFrVXNWMEZCYmtJc1IwRkJhVU1zU1VGQmFrTTdRVUZEUVRaSExIRkNRVUZuUWl4SlFVRm9RaXhGUVVGelFpeFZRVUYwUWl4RlFVRnJReXhMUVVGc1F6dEJRVU5CTzBGQlEwUXNTVUZNUkN4TlFVdFBPMEZCUVVVN1FVRkRVaXhSUVVGSGJFZ3NWVUZCVlVjc1VVRkJWaXhEUVVGdFFrVXNWMEZCYmtJc1MwRkJiVU1zU1VGQmRFTXNSVUZCTkVNN1FVRkRNME0yUnl4eFFrRkJaMElzUzBGQmFFSXNSVUZCZFVJc1ZVRkJka0k3UVVGRFFXeElMR1ZCUVZWSExGRkJRVllzUTBGQmJVSkZMRmRCUVc1Q0xFZEJRV2xETEV0QlFXcERPMEZCUTBFN1FVRkRSRHM3UVVGRlJDeFBRVUZIVVN4RlFVRkZMR3RDUVVGR0xFVkJRWE5DTmtJc1RVRkJla0lzUlVGQmFVTTdRVUZCUlR0QlFVTnNReXhSUVVGSE1VTXNWVUZCVlUwc1VVRkJWaXhEUVVGdFFrUXNWMEZCYmtJc1MwRkJiVU1zU1VGQmRFTXNSVUZCTkVNN1FVRkRNME5NTEdWQlFWVk5MRkZCUVZZc1EwRkJiVUpFTEZkQlFXNUNMRWRCUVdsRExFbEJRV3BETzBGQlEwRTJSeXh4UWtGQlowSXNTVUZCYUVJc1JVRkJjMElzVlVGQmRFSXNSVUZCYTBNc1MwRkJiRU03UVVGRFFUdEJRVU5FTEVsQlRFUXNUVUZMVHp0QlFVRkZPMEZCUTFJc1VVRkJSMnhJTEZWQlFWVk5MRkZCUVZZc1EwRkJiVUpFTEZkQlFXNUNMRXRCUVcxRExFbEJRWFJETEVWQlFUUkRPMEZCUXpORE5rY3NjVUpCUVdkQ0xFdEJRV2hDTEVWQlFYVkNMRlZCUVhaQ08wRkJRMEZzU0N4bFFVRlZUU3hSUVVGV0xFTkJRVzFDUkN4WFFVRnVRaXhIUVVGcFF5eExRVUZxUXp0QlFVTkJPMEZCUTBRN1FVRkRSQ3hIUVRORVJDeEZRVEpFUnl4SFFUTkVTRHRCUVRSRVFUczdRVUZGUmpzN1FVRkZRMUVzUjBGQlJTeFhRVUZHTEVWQlFXVnBSaXhMUVVGbUxFTkJRWEZDTEZWQlFVTlpMRU5CUVVRc1JVRkJUenRCUVVNelFpeE5RVUZOZFVNc1ZVRkJWWFJETEZOQlFWTTVSaXhGUVVGRk5rWXNSVUZCUlVVc1RVRkJTaXhGUVVGWlF5eEpRVUZhTEVOQlFXbENMRmxCUVdwQ0xFTkJRVlFzUTBGQmFFSTdRVUZEUVdoSExFbEJRVVVzYTBKQlFVWXNSVUZCYzBKdlNDeE5RVUYwUWl4RFFVRTJRbWRDTEU5QlFUZENPMEZCUTBGd1NTeEpRVUZGTEdWQlFVWXNSVUZCYlVKcFJDeFJRVUZ1UWl4RFFVRTBRaXhSUVVFMVFqczdRVUZGUVN4TlFVRkhiMFlzVDBGQlQwTXNVMEZCVUN4RFFVRnBRa01zVVVGQmFrSXNRMEZCTUVJc1owSkJRVEZDTEVOQlFVZ3NSVUZCWjBRN1FVRkROVU5ETEU5QlFVbEdMRk5CUVVvc1EwRkJZeTlJTEUxQlFXUXNRMEZCY1VJc1ZVRkJja0k3UVVGRFFUaElMRlZCUVU5RExGTkJRVkFzUTBGQmFVSXZTQ3hOUVVGcVFpeERRVUYzUWl4blFrRkJlRUk3UVVGRFFVNHNXVUZCVTNkSkxFbEJRVlFzUTBGQlkwTXNTMEZCWkN4RFFVRnZRa01zVVVGQmNFSXNSMEZCSzBJc1ZVRkJMMEk3UVVGRFJEdEJRVU5JTEVWQlZrUTdPMEZCV1VRN08wRkJSVU16U1N4SFFVRkZMR1ZCUVVZc1JVRkJiVUpwUml4TFFVRnVRaXhEUVVGNVFpeFZRVUZEV1N4RFFVRkVMRVZCUVU4N1FVRkROMEpCTEVsQlFVVXJReXhsUVVGR08wRkJRMFlzUlVGR1JEczdRVUZKUVN4TFFVRkpVQ3hUUVVGVGNFa3NVMEZCVTI5RkxHTkJRVlFzUTBGQmQwSXNZVUZCZUVJc1EwRkJZanRCUVVGQkxFdEJRME50UlN4TlFVRk5ka2tzVTBGQlUyOUZMR05CUVZRc1EwRkJkMElzVTBGQmVFSXNRMEZFVURzN1FVRkhSRHM3UVVGRlJTeFZRVUZUZDBVc1ZVRkJWQ3hIUVVGelFqczdRVUZGY0VJc1RVRkJSMUlzVDBGQlQwTXNVMEZCVUN4RFFVRnBRa01zVVVGQmFrSXNRMEZCTUVJc1owSkJRVEZDTEVOQlFVZ3NSVUZCWjBRN1FVRkRPVU5ETEU5QlFVbEdMRk5CUVVvc1EwRkJZeTlJTEUxQlFXUXNRMEZCY1VJc1ZVRkJja0k3UVVGRFFUaElMRlZCUVU5RExGTkJRVkFzUTBGQmFVSXZTQ3hOUVVGcVFpeERRVUYzUWl4blFrRkJlRUk3UVVGRFFWQXNTMEZCUlN4bFFVRkdMRVZCUVcxQ2FVUXNVVUZCYmtJc1EwRkJORUlzVVVGQk5VSTdRVUZEUkN4SFFVcEVMRTFCUzBzN1FVRkRTRzlHTEZWQlFVOURMRk5CUVZBc1EwRkJhVUpSTEVkQlFXcENMRU5CUVhGQ0xHZENRVUZ5UWp0QlFVTkJUaXhQUVVGSlJpeFRRVUZLTEVOQlFXTlJMRWRCUVdRc1EwRkJhMElzVlVGQmJFSTdRVUZEUVRsSkxFdEJRVVVzWlVGQlJpeEZRVUZ0UWpSRkxGZEJRVzVDTEVOQlFTdENMRkZCUVM5Q08wRkJRMFE3UVVGRFJqczdRVUZGU0RzN1FVRkZSU3hMUVVGSExFTkJRVU0xUlN4RlFVRkZkVWNzVVVGQlJpeEZRVUZaVUN4SlFVRmFMRU5CUVdsQ0xFMUJRV3BDTEVWQlFYbENka1VzVVVGQmVrSXNRMEZCYTBNc1YwRkJiRU1zUTBGQlNpeEZRVUZ2UkR0QlFVTnVSRFJITEZOQlFVODNSQ3huUWtGQlVDeERRVUYzUWl4UFFVRjRRaXhGUVVGcFEzRkZMRlZCUVdwRE8wRkJRMEU3TzBGQlJVZzdPMEZCUlVWNFNTeFJRVUZQYlVVc1owSkJRVkFzUTBGQmQwSXNVVUZCZUVJc1JVRkJhME1zV1VGQlZ6dEJRVU16UXl4TlFVRkhia1VzVDBGQlQwTXNWVUZCVUN4SFFVRnZRaXhKUVVGd1FpeEpRVUUwUW10SkxFbEJRVWxHTEZOQlFVb3NRMEZCWTBNc1VVRkJaQ3hEUVVGMVFpeFZRVUYyUWl4RFFVRXZRaXhGUVVGdFJUdEJRVU5xUlUwN1FVRkRRVXdzVDBGQlNVWXNVMEZCU2l4RFFVRmpMMGdzVFVGQlpDeERRVUZ4UWl4VlFVRnlRanRCUVVORFVDeExRVUZGTEdWQlFVWXNSVUZCYlVKcFJDeFJRVUZ1UWl4RFFVRTBRaXhSUVVFMVFqdEJRVU5HTzBGQlEwWXNSVUZPUkRzN1FVRlJSanM3UVVGRlJTeExRVUZIYWtRc1JVRkJSWFZITEZGQlFVWXNSVUZCV1ZBc1NVRkJXaXhEUVVGcFFpeE5RVUZxUWl4RlFVRjVRblpGTEZGQlFYcENMRU5CUVd0RExGZEJRV3hETEVOQlFVZ3NSVUZCYlVRN1FVRkRia1FzVFVGQlIzcENMRVZCUVVWMVJ5eFJRVUZHTEVWQlFWbFFMRWxCUVZvc1EwRkJhVUlzVFVGQmFrSXNSVUZCZVVKMlJTeFJRVUY2UWl4RFFVRnJReXhaUVVGc1F5eERRVUZJTEVWQlFXOUVPMEZCUTI1RWFVUXNZMEZCVnl4RFFVRllPMEZCUTBFN1FVRkRSQ3hOUVVGSE1VVXNSVUZCUlhWSExGRkJRVVlzUlVGQldWQXNTVUZCV2l4RFFVRnBRaXhOUVVGcVFpeEZRVUY1UW5aRkxGRkJRWHBDTEVOQlFXdERMR2xDUVVGc1F5eERRVUZJTEVWQlFYbEVPMEZCUTNoRWFVUXNZMEZCVnl4RFFVRllPMEZCUTBFN1FVRkRSQ3hOUVVGSE1VVXNSVUZCUlhWSExGRkJRVVlzUlVGQldWQXNTVUZCV2l4RFFVRnBRaXhOUVVGcVFpeEZRVUY1UW5aRkxGRkJRWHBDTEVOQlFXdERMR05CUVd4RExFTkJRVWdzUlVGQmMwUTdRVUZEY2tScFJDeGpRVUZYTEVOQlFWZzdRVUZEUVR0QlFVTkVMRTFCUVVjeFJTeEZRVUZGZFVjc1VVRkJSaXhGUVVGWlVDeEpRVUZhTEVOQlFXbENMRTFCUVdwQ0xFVkJRWGxDZGtVc1VVRkJla0lzUTBGQmEwTXNXVUZCYkVNc1EwRkJTQ3hGUVVGdlJEdEJRVU51UkdsRUxHTkJRVmNzUTBGQldEdEJRVU5CTzBGQlEwUXNUVUZCUnpGRkxFVkJRVVYxUnl4UlFVRkdMRVZCUVZsUUxFbEJRVm9zUTBGQmFVSXNUVUZCYWtJc1JVRkJlVUoyUlN4UlFVRjZRaXhEUVVGclF5eFpRVUZzUXl4RFFVRklMRVZCUVc5RU8wRkJRMjVFVGl4bFFVRlpMRmxCUVUwN1FVRkRha0oxUnp0QlFVTkJMRWxCUmtRc1JVRkZSeXhIUVVaSU8wRkJSMEU3UVVGRFJEczdRVUZGUmpzN1FVRkZSU3hWUVVGVGNVSXNWMEZCVkN4RFFVRnhRa01zUlVGQmNrSXNSVUZCZVVKRExFbEJRWHBDTEVWQlFTdENPMEZCUXpsQ0xFMUJRVWxETEZsQlFWa3NSVUZCYUVJN1FVRkRRVUVzV1VGQlZVTXNSVUZCVml4SFFVRmxMRU5CUVdZc1EwRkJhMEpFTEZWQlFWVkZMRVZCUVZZc1IwRkJaU3hEUVVGbUxFTkJRV3RDUml4VlFVRlZSeXhGUVVGV0xFZEJRV1VzUTBGQlppeERRVUZyUWtnc1ZVRkJWVWtzUlVGQlZpeEhRVUZsTEVOQlFXWTdRVUZEZEVRc1RVRkJTVU1zVVVGQlVTeEZRVUZhTEVOQlNEaENMRU5CUjJJN1FVRkRha0lzVFVGQlNVTXNVVUZCVVN4RlFVRmFMRU5CU2poQ0xFTkJTV0k3UVVGRGFrSXNUVUZCU1VNc1VVRkJVU3hGUVVGYUxFTkJURGhDTEVOQlMySTdRVUZEYWtJc1RVRkJTVU1zVVVGQlVTeEZRVUZhTEVOQlRqaENMRU5CVFdJN1FVRkRha0lzVFVGQlNVTXNVVUZCVVN4RlFVRmFPMEZCUTBFc1RVRkJTVzVGTEUxQlFVMTJSaXhUUVVGVGIwVXNZMEZCVkN4RFFVRjNRakpGTEVWQlFYaENMRU5CUVZZN1FVRkRRWGhFTEUxQlFVbG9RaXhuUWtGQlNpeERRVUZ4UWl4WlFVRnlRaXhGUVVGclF5eFZRVUZUY1VJc1EwRkJWQ3hGUVVGWE8wRkJRek5ETEU5QlFVa3JSQ3hKUVVGSkwwUXNSVUZCUldkRkxFOUJRVVlzUTBGQlZTeERRVUZXTEVOQlFWSTdRVUZEUVZnc1lVRkJWVU1zUlVGQlZpeEhRVUZsVXl4RlFVRkZSU3hQUVVGcVFqdEJRVU5CV2l4aFFVRlZSU3hGUVVGV0xFZEJRV1ZSTEVWQlFVVkhMRTlCUVdwQ08wRkJRMFFzUjBGS1JDeEZRVWxGTEV0QlNrWTdRVUZMUVhaRkxFMUJRVWxvUWl4blFrRkJTaXhEUVVGeFFpeFhRVUZ5UWl4RlFVRnBReXhWUVVGVGNVSXNRMEZCVkN4RlFVRlhPMEZCUXpGRFFTeExRVUZGYlVVc1kwRkJSanRCUVVOQkxFOUJRVWxLTEVsQlFVa3ZSQ3hGUVVGRlowVXNUMEZCUml4RFFVRlZMRU5CUVZZc1EwRkJVanRCUVVOQldDeGhRVUZWUnl4RlFVRldMRWRCUVdWUExFVkJRVVZGTEU5QlFXcENPMEZCUTBGYUxHRkJRVlZKTEVWQlFWWXNSMEZCWlUwc1JVRkJSVWNzVDBGQmFrSTdRVUZEUkN4SFFVeEVMRVZCUzBVc1MwRk1SanRCUVUxQmRrVXNUVUZCU1doQ0xHZENRVUZLTEVOQlFYRkNMRlZCUVhKQ0xFVkJRV2RETEZWQlFWTnhRaXhEUVVGVUxFVkJRVmM3UVVGRGVrTTdRVUZEUVN4UFFVRkxMRU5CUVVWeFJDeFZRVUZWUnl4RlFVRldMRWRCUVdWRkxFdEJRV1lzUjBGQmRVSk1MRlZCUVZWRExFVkJRV3hETEVsQlFUQkRSQ3hWUVVGVlJ5eEZRVUZXTEVkQlFXVkZMRXRCUVdZc1IwRkJkVUpNTEZWQlFWVkRMRVZCUVRWRkxFdEJRWE5HUkN4VlFVRlZTU3hGUVVGV0xFZEJRV1ZLTEZWQlFWVkZMRVZCUVZZc1IwRkJaVTBzUzBGQkwwSXNTVUZCTUVOU0xGVkJRVlZGTEVWQlFWWXNSMEZCWlVZc1ZVRkJWVWtzUlVGQlZpeEhRVUZsU1N4TFFVRjRSU3hKUVVGdFJsSXNWVUZCVlVjc1JVRkJWaXhIUVVGbExFTkJRVFZNTEVWQlFXdE5PMEZCUTJoTkxGRkJRVWRJTEZWQlFWVkhMRVZCUVZZc1IwRkJaVWdzVlVGQlZVTXNSVUZCTlVJc1JVRkJaME5STEZGQlFWRXNSMEZCVWl4RFFVRm9ReXhMUVVOTFFTeFJRVUZSTEVkQlFWSTdRVUZEVGp0QlFVTkVPMEZCU2tFc1VVRkxTeXhKUVVGTExFTkJRVVZVTEZWQlFWVkpMRVZCUVZZc1IwRkJaVWNzUzBGQlppeEhRVUYxUWxBc1ZVRkJWVVVzUlVGQmJFTXNTVUZCTUVOR0xGVkJRVlZKTEVWQlFWWXNSMEZCWlVjc1MwRkJaaXhIUVVGMVFsQXNWVUZCVlVVc1JVRkJOVVVzUzBGQmMwWkdMRlZCUVZWSExFVkJRVllzUjBGQlpVZ3NWVUZCVlVNc1JVRkJWaXhIUVVGbFN5eExRVUV2UWl4SlFVRXdRMDRzVlVGQlZVTXNSVUZCVml4SFFVRmxSQ3hWUVVGVlJ5eEZRVUZXTEVkQlFXVkhMRXRCUVhoRkxFbEJRVzFHVGl4VlFVRlZTU3hGUVVGV0xFZEJRV1VzUTBGQk5Vd3NSVUZCYTAwN1FVRkRjazBzVTBGQlIwb3NWVUZCVlVrc1JVRkJWaXhIUVVGbFNpeFZRVUZWUlN4RlFVRTFRaXhGUVVGblEwOHNVVUZCVVN4SFFVRlNMRU5CUVdoRExFdEJRMHRCTEZGQlFWRXNSMEZCVWp0QlFVTk9PenRCUVVWRUxFOUJRVWxCTEZOQlFWTXNSVUZCWWl4RlFVRnBRanRCUVVObUxGRkJRVWNzVDBGQlQxWXNTVUZCVUN4SlFVRmxMRlZCUVd4Q0xFVkJRVGhDUVN4TFFVRkxSQ3hGUVVGTUxFVkJRVkZYTEV0QlFWSTdRVUZETDBJN1FVRkRSQ3hQUVVGSlFTeFJRVUZSTEVWQlFWbzdRVUZEUVZRc1lVRkJWVU1zUlVGQlZpeEhRVUZsTEVOQlFXWXNRMEZCYTBKRUxGVkJRVlZGTEVWQlFWWXNSMEZCWlN4RFFVRm1MRU5CUVd0Q1JpeFZRVUZWUnl4RlFVRldMRWRCUVdVc1EwRkJaaXhEUVVGclFrZ3NWVUZCVlVrc1JVRkJWaXhIUVVGbExFTkJRV1k3UVVGRGRrUXNSMEZxUWtRc1JVRnBRa1VzUzBGcVFrWTdRVUZyUWtRN08wRkJSVVk3TzBGQlJVTXNTMEZCVFhwQ0xHdENRVUZyUWl4VFFVRnNRa0VzWlVGQmEwSXNRMEZCUTIxQ0xFVkJRVVFzUlVGQlMybENMRU5CUVV3c1JVRkJWenM3UVVGRmJFTXNUVUZCUjJwQ0xFOUJRVThzVlVGQlZpeEZRVUZ6UWpzN1FVRkZja0lzVDBGQlRXdENMREpDUVVFeVFteExMRVZCUVVVc01FSkJRVVlzUlVGQk9FSTJRaXhOUVVFdlJEczdRVUZGUVN4UFFVRkhiMGtzVFVGQlRTeEhRVUZVTEVWQlFXTTdPMEZCUldJc1VVRkJSeTlMTEdOQlFXTm5UQ3d5UWtGQk1rSXNRMEZCTlVNc1JVRkJLME03UVVGRE9VTm9URHRCUVVOQkxFdEJSa1FzVFVGRlR6dEJRVU5PUVN4dFFrRkJZeXhEUVVGa08wRkJRMEU3TzBGQlJVUmpMRTFCUVVVc01FSkJRVVlzUlVGQk9FSmtMRmRCUVRsQ0xFVkJRVEpESzBZc1MwRkJNME03UVVGRFFUdEJRVU5FTEU5QlFVZG5SaXhOUVVGTkxFZEJRVlFzUlVGQll6czdRVUZGWWl4UlFVRkhMMHNzWTBGQll5eERRVUZxUWl4RlFVRnZRanRCUVVOdVFrRTdRVUZEUVN4TFFVWkVMRTFCUlU4N1FVRkRUa0VzYlVKQlFXTm5UQ3d5UWtGQk1rSXNRMEZCZWtNN1FVRkRRVHM3UVVGRlJHeExMRTFCUVVVc01FSkJRVVlzUlVGQk9FSmtMRmRCUVRsQ0xFVkJRVEpESzBZc1MwRkJNME03UVVGRFFUdEJRVU5FTzBGQlEwUXNUVUZCUnl0RUxFOUJRVThzVlVGQlZpeEZRVUZ6UWpzN1FVRkZja0lzVDBGQlRXMUNMREpDUVVFeVFtNUxMRVZCUVVVc01FSkJRVVlzUlVGQk9FSTJRaXhOUVVFdlJEczdRVUZGUVN4UFFVRkhiMGtzVFVGQlRTeEhRVUZVTEVWQlFXTTdPMEZCUldJc1VVRkJSMmhNTEdOQlFXTnJUQ3d5UWtGQk1rSXNRMEZCTlVNc1JVRkJLME03UVVGRE9VTnNURHRCUVVOQkxFdEJSa1FzVFVGRlR6dEJRVU5PUVN4dFFrRkJZeXhEUVVGa08wRkJRMEU3TzBGQlJVUmxMRTFCUVVVc01FSkJRVVlzUlVGQk9FSm1MRmRCUVRsQ0xFVkJRVEpEWjBjc1MwRkJNME03UVVGRFFUdEJRVU5FTEU5QlFVZG5SaXhOUVVGTkxFZEJRVlFzUlVGQll6czdRVUZGWWl4UlFVRkhhRXdzWTBGQll5eERRVUZxUWl4RlFVRnZRanRCUVVOdVFrRTdRVUZEUVN4TFFVWkVMRTFCUlU4N1FVRkRUa0VzYlVKQlFXTnJUQ3d5UWtGQk1rSXNRMEZCZWtNN1FVRkRRVHM3UVVGRlJHNUxMRTFCUVVVc01FSkJRVVlzUlVGQk9FSm1MRmRCUVRsQ0xFVkJRVEpEWjBjc1MwRkJNME03UVVGRFFUdEJRVU5FTzBGQlEwUXNSVUZ3UkVRN08wRkJjMFJFT3p0QlFVVkRMRXRCUVVjc1EwRkJRMnBHTEVWQlFVVjFSeXhSUVVGR0xFVkJRVmxRTEVsQlFWb3NRMEZCYVVJc1RVRkJha0lzUlVGQmVVSjJSU3hSUVVGNlFpeERRVUZyUXl4WFFVRnNReXhEUVVGS0xFVkJRVzlFTzBGQlEyNUVjMGdzWTBGQldTeFZRVUZhTEVWQlFYZENiRUlzWlVGQmVFSTdRVUZEUVd0Q0xHTkJRVmtzVlVGQldpeEZRVUYzUW14Q0xHVkJRWGhDTzBGQlEwRTdRVUZEUkN4RFFUVnVRa1FpTENKbWFXeGxJam9pWm1GclpWODNObUkyWmpsa01pNXFjeUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSW1OdmJuTjBJSFJwYldVZ1BTQTNOVEE3WEc1c1pYUWdjMlZqZEdsdmJqTkpaSGdnUFNBd08xeHViR1YwSUhObFkzUnBiMjQwU1dSNElEMGdNRHRjYmx4dVkyOXVjM1FnYldGemRHVnlUMkpxSUQwZ2UxeHVYSFJ6WldOMGFXOXVNa04xY25KbGJuUkpaSGc2SURBc0lGeHVYSFJ6WldOMGFXOXVNVU4xY25KbGJuUkpaSGc2SURBc1hHNWNkSE5sWTNScGIyNHpPaUI3WEc1Y2RGeDBZWFYwYjIxaGRHVTZJQ2NuTEZ4dVhIUmNkR2x6UVhWMGIyMWhkR1ZrT2lCbVlXeHpaVnh1WEhSOUxGeHVYSFJ6WldOMGFXOXVORG9nZTF4dVhIUmNkR0YxZEc5dFlYUmxPaUFuSnl4Y2JseDBYSFJwYzBGMWRHOXRZWFJsWkRvZ1ptRnNjMlZjYmx4MGZTeGNibHgwWW1GemEyVjBZbUZzYkRvZ2UyeHZiM0JCYlc5MWJuUTZJREY5TEZ4dVhIUm1iMjkwWW1Gc2JEb2dlMnh2YjNCQmJXOTFiblE2SURGOUxGeHVYSFIwWlc1dWFYTTZJSHRzYjI5d1FXMXZkVzUwT2lBeGZTeGNibHgwWW1GelpXSmhiR3c2SUh0c2IyOXdRVzF2ZFc1ME9pQXhmU3hjYmx4MFptRnVPaUI3Ykc5dmNFRnRiM1Z1ZERvZ01YMWNibjA3WEc1Y2JpUW9aRzlqZFcxbGJuUXBMbkpsWVdSNUtDZ3BJRDArSUh0Y2JpOHZJRVpKV0VWVElFbFRVMVZGSUZkSlZFZ2dTRWxGUjBoVUlFOU9JRWxRU0U5T1JTQllMaUJ2Ym1Wd1lXZGxYM05qY205c2JDQlFURlZIU1U0Z1JFOUZVeUJPVDFRZ1YwOVNTeUJYU1ZSSUlDZG9aV2xuYUhRNklERXdNQ1U3SnlCY1hGeGNYRzVjZENRb0p5TnpZM0p2Ykd4bGNsZHlZWEJ3WlhJbktTNWpjM01vZXlkb1pXbG5hSFFuT2lCZ0pIc2tLQ2RpYjJSNUp5a3VhR1ZwWjJoMEtDbDljSGhnZlNrN1hHNWNibHgwYVdZb2QybHVaRzkzTG1sdWJtVnlWMmxrZEdnZ1BDQTRNREFwSUh0Y2JpOHZJRVJGVEVWVVJTQldTVVJGVHlCUFRpQk5UMEpKVEVVZ1hGeGNYRnh1WEhSY2RDUW9KeU4yYVdSbGJ5Y3BMbkpsYlc5MlpTZ3BPMXh1THk4Z1NVWWdWRWhGSUZkSlRrUlBWeUJKVXlCVFRVRk1URVZTSUZSSVFWUWdPREF3VUZnZ1JrVlVRMGdnVkVoRklFcFRUMDRnUms5U0lGUklSU0JKUTA5T0lFRk9TVTFCVkVsUFRpQkJUa1FnUVZSQlEwZ2dWRWhGSUVGT1NVMUJWRWxQVGxNZ1UwVlFSVkpCVkVWTVdTQlVUeUJ0WVhOMFpYSlBZbW9nWEZ4Y1hGeHVYSFJjZEdabGRHTm9LQ2RoYzNObGRITXZhbk12Um1GdWRHRnpkR1ZqWDFOd2NtbDBaVjlUYUdWbGRDNXFjMjl1SnlrdWRHaGxiaWhtZFc1amRHbHZiaWh5WlhOd2IyNXpaU2tnZXlCY2JseDBYSFJjZEhKbGRIVnliaUJ5WlhOd2IyNXpaUzVxYzI5dUtDazdYRzVjZEZ4MGZTa3VkR2hsYmlobWRXNWpkR2x2YmloemNISnBkR1ZQWW1vcElIdGNibHgwWEhSY2RHTnZibk4wSUVsa2JHVkdjbUZ0WlNBOUlHWnBiSFJsY2tKNVZtRnNkV1VvYzNCeWFYUmxUMkpxTG1aeVlXMWxjeXdnSjJsa2JHVW5LVHRjYmx4MFhIUmNkRzFoYzNSbGNrOWlhaTVtYjI5MFltRnNiQzVoYm1sdFlYUnBiMjVCY25KaGVTQTlJRnN1TGk1SlpHeGxSbkpoYldVc0lDNHVMbVpwYkhSbGNrSjVWbUZzZFdVb2MzQnlhWFJsVDJKcUxtWnlZVzFsY3l3Z0oyWnZiM1JpWVd4c0p5bGRPMXh1WEhSY2RGeDBiV0Z6ZEdWeVQySnFMblJsYm01cGN5NWhibWx0WVhScGIyNUJjbkpoZVNBOUlGc3VMaTVKWkd4bFJuSmhiV1VzSUM0dUxtWnBiSFJsY2tKNVZtRnNkV1VvYzNCeWFYUmxUMkpxTG1aeVlXMWxjeXdnSjNSbGJtNXBjeWNwWFR0Y2JseDBYSFJjZEcxaGMzUmxjazlpYWk1aVlYTmxZbUZzYkM1aGJtbHRZWFJwYjI1QmNuSmhlU0E5SUZzdUxpNUpaR3hsUm5KaGJXVXNJQzR1TG1acGJIUmxja0o1Vm1Gc2RXVW9jM0J5YVhSbFQySnFMbVp5WVcxbGN5d2dKMkpoYzJWaVlXeHNKeWxkTzF4dVhIUmNkRngwYldGemRHVnlUMkpxTG1KaGMydGxkR0poYkd3dVlXNXBiV0YwYVc5dVFYSnlZWGtnUFNCYkxpNHVTV1JzWlVaeVlXMWxMQ0F1TGk1bWFXeDBaWEpDZVZaaGJIVmxLSE53Y21sMFpVOWlhaTVtY21GdFpYTXNJQ2RpWVhOclpYUW5LVjA3WEc1Y2RGeDBYSFJ0WVhOMFpYSlBZbW91Wm1GdUxtRnVhVzFoZEdsdmJrRnljbUY1SUQwZ1d5NHVMa2xrYkdWR2NtRnRaU3dnTGk0dVptbHNkR1Z5UW5sV1lXeDFaU2h6Y0hKcGRHVlBZbW91Wm5KaGJXVnpMQ0FuWm1GdUp5bGRPMXh1THk4Z1EwRk1UQ0JCVGtsTlFWUlBVaUJUUlZSVlVDQkdWVTVEVkVsUFRpQkJUa1FnVTFSQlVsUWdWRWhGSUVsTlFVZEZJRk5NU1VSRlUwaFBWeUJHVDFJZ1UwVkRWRWxQVGlBeElDaElUMDFGVUVGSFJTa2dYRnhjWEZ4MFhIUmNkRnh1WEhSY2RGeDBZVzVwYldGMGIzSlRaWFIxY0NncE8xeHVYSFJjZEZ4MGFXMWhaMlZEYjI1MGNtOXNaWElvYldGemRHVnlUMkpxTENBeEtUdGNiaTh2SUVOQlRFd2dWRWhGSUdsdFlXZGxRMjl1ZEhKdmJHVnlJRVpWVGtOVVNVOU9JRVZXUlZKWklEVWdVMFZEVDA1RVV5QlVUeUJEU0VGT1IwVWdWRWhGSUVsTlFVZEZJRVpQVWlCVFJVTlVTVTlPSURFZ0tFaFBUVVZRUVVkRktTQmNYRnhjWEc1Y2RGeDBYSFJ6WlhSSmJuUmxjblpoYkNnb0tTQTlQaUI3WEc1Y2RGeDBYSFJjZEdsdFlXZGxRMjl1ZEhKdmJHVnlLRzFoYzNSbGNrOWlhaXdnTVNrN1hHNWNkRngwWEhSOUxDQTFNREF3S1R0Y2JseDBYSFI5S1R0Y2JseDBmVnh1THk4Z1JsVk9RMVJKVDA0Z1ZFOGdVMFZRUlZKQlZFVWdWRWhGSUVGT1NVMUJWRWxQVGlCR1VrRk5SVk1nUWxrZ1RrRk5SU0JjWEZ4Y1hHNWNkR052Ym5OMElHWnBiSFJsY2tKNVZtRnNkV1VnUFNBb1lYSnlZWGtzSUhOMGNtbHVaeWtnUFQ0Z2UxeHVJQ0FnSUhKbGRIVnliaUJoY25KaGVTNW1hV3gwWlhJb2J5QTlQaUIwZVhCbGIyWWdiMXNuWm1sc1pXNWhiV1VuWFNBOVBUMGdKM04wY21sdVp5Y2dKaVlnYjFzblptbHNaVzVoYldVblhTNTBiMHh2ZDJWeVEyRnpaU2dwTG1sdVkyeDFaR1Z6S0hOMGNtbHVaeTUwYjB4dmQyVnlRMkZ6WlNncEtTazdYRzVjZEgxY2JpOHZJRWRGVGtWU1NVTWdVMFZVVlZBZ1JsVk9RMVJKVDA0Z1JrOVNJRUZFUkVsT1J5QldSVTVFVDFJZ1VGSkZSa2xZUlZNZ1ZFOGdjbVZ4ZFdWemRFRnVhVzFoZEdsdmJrWnlZVzFsSUZ4Y1hGeGNibHgwWTI5dWMzUWdZVzVwYldGMGIzSlRaWFIxY0NBOUlDZ3BJRDArSUh0Y2JseDBYSFJjZEZ4dUlDQWdJSFpoY2lCc1lYTjBWR2x0WlNBOUlEQTdYRzRnSUNBZ2RtRnlJSFpsYm1SdmNuTWdQU0JiSjIxekp5d2dKMjF2ZWljc0lDZDNaV0pyYVhRbkxDQW5ieWRkTzF4dUlDQWdJR1p2Y2loMllYSWdlQ0E5SURBN0lIZ2dQQ0IyWlc1a2IzSnpMbXhsYm1kMGFDQW1KaUFoZDJsdVpHOTNMbkpsY1hWbGMzUkJibWx0WVhScGIyNUdjbUZ0WlRzZ0t5dDRLU0I3WEc0Z0lDQWdJQ0IzYVc1a2IzY3VjbVZ4ZFdWemRFRnVhVzFoZEdsdmJrWnlZVzFsSUQwZ2QybHVaRzkzVzNabGJtUnZjbk5iZUYwckoxSmxjWFZsYzNSQmJtbHRZWFJwYjI1R2NtRnRaU2RkTzF4dUlDQWdJQ0FnZDJsdVpHOTNMbU5oYm1ObGJFRnVhVzFoZEdsdmJrWnlZVzFsSUQwZ2QybHVaRzkzVzNabGJtUnZjbk5iZUYwckowTmhibU5sYkVGdWFXMWhkR2x2YmtaeVlXMWxKMTBnZkh3Z2QybHVaRzkzVzNabGJtUnZjbk5iZUYwckowTmhibU5sYkZKbGNYVmxjM1JCYm1sdFlYUnBiMjVHY21GdFpTZGRPMXh1SUNBZ0lIMWNiaUJjYmlBZ0lDQnBaaUFvSVhkcGJtUnZkeTV5WlhGMVpYTjBRVzVwYldGMGFXOXVSbkpoYldVcFhHNGdJQ0FnSUNCM2FXNWtiM2N1Y21WeGRXVnpkRUZ1YVcxaGRHbHZia1p5WVcxbElEMGdablZ1WTNScGIyNG9ZMkZzYkdKaFkyc3NJR1ZzWlcxbGJuUXBJSHRjYmlBZ0lDQWdJQ0FnZG1GeUlHTjFjbkpVYVcxbElEMGdibVYzSUVSaGRHVW9LUzVuWlhSVWFXMWxLQ2s3WEc0Z0lDQWdJQ0FnSUhaaGNpQjBhVzFsVkc5RFlXeHNJRDBnVFdGMGFDNXRZWGdvTUN3Z01UWWdMU0FvWTNWeWNsUnBiV1VnTFNCc1lYTjBWR2x0WlNrcE8xeHVJQ0FnSUNBZ0lDQjJZWElnYVdRZ1BTQjNhVzVrYjNjdWMyVjBWR2x0Wlc5MWRDaG1kVzVqZEdsdmJpZ3BJSHNnWTJGc2JHSmhZMnNvWTNWeWNsUnBiV1VnS3lCMGFXMWxWRzlEWVd4c0tUc2dmU3dnWEc0Z0lDQWdJQ0FnSUNBZ2RHbHRaVlJ2UTJGc2JDazdYRzRnSUNBZ0lDQWdJR3hoYzNSVWFXMWxJRDBnWTNWeWNsUnBiV1VnS3lCMGFXMWxWRzlEWVd4c08xeHVJQ0FnSUNBZ0lDQnlaWFIxY200Z2FXUTdYRzRnSUNBZ0lDQjlPMXh1SUZ4dUlDQWdJR2xtSUNnaGQybHVaRzkzTG1OaGJtTmxiRUZ1YVcxaGRHbHZia1p5WVcxbEtWeHVJQ0FnSUhkcGJtUnZkeTVqWVc1alpXeEJibWx0WVhScGIyNUdjbUZ0WlNBOUlHWjFibU4wYVc5dUtHbGtLU0I3WEc0Z0lDQWdJQ0JqYkdWaGNsUnBiV1Z2ZFhRb2FXUXBPMXh1SUNBZ0lIMDdYRzVjZEgxY2JseHVYSFJqYjI1emRDQmhibWx0WVhSdmNpQTlJQ2hoYm1sdFlYUnBiMjVQWW1vcElEMCtJSHRjYmx4MFhIUmNkRngwWEhSY2RGeHVYSFJjZEhaaGNpQmtZVzVqYVc1blNXTnZiaXhjYmx4MFhIUmNkSE53Y21sMFpVbHRZV2RsTEZ4dVhIUmNkRngwWTJGdWRtRnpPMXgwWEhSY2RGeDBYSFJjYmk4dklFWlZUa05VU1U5T0lGUlBJRkJCVTFNZ1ZFOGdjbVZ4ZFdWemRFRnVhVzFoZEdsdmJrWnlZVzFsSUZ4Y1hGeGNibHgwWEhSbWRXNWpkR2x2YmlCbllXMWxURzl2Y0NBb0tTQjdYRzVjZEZ4MElDQWtLQ2NqYkc5aFpHbHVaeWNwTG1Ga1pFTnNZWE56S0Nkb2FXUmtaVzRuS1R0Y2JseDBYSFFnSUdGdWFXMWhkR2x2Yms5aWFpNXNiMjl3U1dRZ1BTQjNhVzVrYjNjdWNtVnhkV1Z6ZEVGdWFXMWhkR2x2YmtaeVlXMWxLR2RoYldWTWIyOXdLVHRjYmx4MFhIUWdJR1JoYm1OcGJtZEpZMjl1TG5Wd1pHRjBaU2dwTzF4dVhIUmNkQ0FnWkdGdVkybHVaMGxqYjI0dWNtVnVaR1Z5S0NrN1hHNWNkRngwZlZ4dVhIUmNkRnh1WEhSY2RHWjFibU4wYVc5dUlITndjbWwwWlNBb2IzQjBhVzl1Y3lrZ2UxeHVYSFJjZEZ4dVhIUmNkRngwZG1GeUlIUm9ZWFFnUFNCN2ZTeGNibHgwWEhSY2RGeDBabkpoYldWSmJtUmxlQ0E5SURBc1hHNWNkRngwWEhSY2RIUnBZMnREYjNWdWRDQTlJREFzWEc1Y2RGeDBYSFJjZEd4dmIzQkRiM1Z1ZENBOUlEQXNYRzVjZEZ4MFhIUmNkSFJwWTJ0elVHVnlSbkpoYldVZ1BTQnZjSFJwYjI1ekxuUnBZMnR6VUdWeVJuSmhiV1VnZkh3Z01DeGNibHgwWEhSY2RGeDBiblZ0WW1WeVQyWkdjbUZ0WlhNZ1BTQnZjSFJwYjI1ekxtNTFiV0psY2s5bVJuSmhiV1Z6SUh4OElERTdYRzVjZEZ4MFhIUmNibHgwWEhSY2RIUm9ZWFF1WTI5dWRHVjRkQ0E5SUc5d2RHbHZibk11WTI5dWRHVjRkRHRjYmx4MFhIUmNkSFJvWVhRdWQybGtkR2dnUFNCdmNIUnBiMjV6TG5kcFpIUm9PMXh1WEhSY2RGeDBkR2hoZEM1b1pXbG5hSFFnUFNCdmNIUnBiMjV6TG1obGFXZG9kRHRjYmx4MFhIUmNkSFJvWVhRdWFXMWhaMlVnUFNCdmNIUnBiMjV6TG1sdFlXZGxPMXh1WEhSY2RGeDBkR2hoZEM1c2IyOXdjeUE5SUc5d2RHbHZibk11Ykc5dmNITTdYRzVjZEZ4MFhIUmNibHgwWEhSY2RIUm9ZWFF1ZFhCa1lYUmxJRDBnWm5WdVkzUnBiMjRnS0NrZ2UxeHVYRzRnSUNBZ0lDQWdJSFJwWTJ0RGIzVnVkQ0FyUFNBeE8xeHVYRzRnSUNBZ0lDQWdJR2xtSUNoMGFXTnJRMjkxYm5RZ1BpQjBhV05yYzFCbGNrWnlZVzFsS1NCN1hHNWNibHgwWEhSY2RGeDBYSFIwYVdOclEyOTFiblFnUFNBd08xeHVJQ0FnSUNBZ0lDQWdJQzh2SUVsbUlIUm9aU0JqZFhKeVpXNTBJR1p5WVcxbElHbHVaR1Y0SUdseklHbHVJSEpoYm1kbFhHNGdJQ0FnSUNBZ0lDQWdhV1lnS0daeVlXMWxTVzVrWlhnZ1BDQnVkVzFpWlhKUFprWnlZVzFsY3lBdElERXBJSHRjZEZ4dUlDQWdJQ0FnSUNBZ0lDOHZJRWR2SUhSdklIUm9aU0J1WlhoMElHWnlZVzFsWEc0Z0lDQWdJQ0FnSUNBZ0lDQm1jbUZ0WlVsdVpHVjRJQ3M5SURFN1hHNGdJQ0FnSUNBZ0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lDQWdYSFJjZEd4dmIzQkRiM1Z1ZENzclhHNGdJQ0FnSUNBZ0lDQWdJQ0JtY21GdFpVbHVaR1Y0SUQwZ01EdGNibHh1SUNBZ0lDQWdJQ0FnSUNBZ2FXWW9iRzl2Y0VOdmRXNTBJRDA5UFNCMGFHRjBMbXh2YjNCektTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCY2RIZHBibVJ2ZHk1allXNWpaV3hCYm1sdFlYUnBiMjVHY21GdFpTaGhibWx0WVhScGIyNVBZbW91Ykc5dmNFbGtLVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIMWNiaUFnSUNBZ0lDQWdJQ0I5WEc1Y2RDQWdJQ0FnSUgxY2JseDBJQ0FnSUgxY2JseDBYSFJjZEZ4dVhIUmNkRngwZEdoaGRDNXlaVzVrWlhJZ1BTQm1kVzVqZEdsdmJpQW9LU0I3WEc1Y2RGeDBYSFJjYmx4MFhIUmNkQ0FnTHk4Z1EyeGxZWElnZEdobElHTmhiblpoYzF4dVhIUmNkRngwSUNCMGFHRjBMbU52Ym5SbGVIUXVZMnhsWVhKU1pXTjBLREFzSURBc0lIUm9ZWFF1ZDJsa2RHZ3NJSFJvWVhRdWFHVnBaMmgwS1R0Y2JseDBYSFJjZENBZ1hHNWNkRngwWEhRZ0lIUm9ZWFF1WTI5dWRHVjRkQzVrY21GM1NXMWhaMlVvWEc1Y2RGeDBYSFFnSUNBZ2RHaGhkQzVwYldGblpTeGNibHgwWEhSY2RDQWdJQ0JoYm1sdFlYUnBiMjVQWW1vdVlXNXBiV0YwYVc5dVFYSnlZWGxiWm5KaGJXVkpibVJsZUYwdVpuSmhiV1V1ZUN4Y2JseDBYSFJjZENBZ0lDQmhibWx0WVhScGIyNVBZbW91WVc1cGJXRjBhVzl1UVhKeVlYbGJabkpoYldWSmJtUmxlRjB1Wm5KaGJXVXVlU3hjYmx4MFhIUmNkQ0FnSUNBeU1EQXNYRzVjZEZ4MFhIUWdJQ0FnTVRjMUxGeHVYSFJjZEZ4MElDQWdJREFzWEc1Y2RGeDBYSFFnSUNBZ01DeGNibHgwWEhSY2RDQWdJQ0IzYVc1a2IzY3VhVzV1WlhKWGFXUjBhQ0F2SURNdU9EUTJMRnh1WEhSY2RGeDBJQ0FnSUhkcGJtUnZkeTVwYm01bGNsZHBaSFJvSUM4Z05DNHhLVnh1WEhSY2RGeDBmVHRjYmx4MFhIUmNkRnh1WEhSY2RGeDBjbVYwZFhKdUlIUm9ZWFE3WEc1Y2RGeDBmVnh1WEhSY2RGeHVYSFJjZEM4dklFZGxkQ0JqWVc1MllYTmNibHgwWEhSallXNTJZWE1nUFNCa2IyTjFiV1Z1ZEM1blpYUkZiR1Z0Wlc1MFFubEpaQ2duWTJGdWRtRnpKeWs3WEc1Y2RGeDBZMkZ1ZG1GekxuZHBaSFJvSUQwZ2QybHVaRzkzTG1sdWJtVnlWMmxrZEdnZ0x5QXpMamcwTmp0Y2JseDBYSFJqWVc1MllYTXVhR1ZwWjJoMElEMGdkMmx1Wkc5M0xtbHVibVZ5VjJsa2RHZ2dMeUF5TGpJN1hHNWNkRngwWEc1Y2RGeDBMeThnUTNKbFlYUmxJSE53Y21sMFpTQnphR1ZsZEZ4dVhIUmNkSE53Y21sMFpVbHRZV2RsSUQwZ2JtVjNJRWx0WVdkbEtDazdYSFJjYmx4MFhIUmNibHgwWEhRdkx5QkRjbVZoZEdVZ2MzQnlhWFJsWEc1Y2RGeDBaR0Z1WTJsdVowbGpiMjRnUFNCemNISnBkR1VvZTF4dVhIUmNkRngwWTI5dWRHVjRkRG9nWTJGdWRtRnpMbWRsZEVOdmJuUmxlSFFvWENJeVpGd2lLU3hjYmx4MFhIUmNkSGRwWkhSb09pQTBNRFF3TEZ4dVhIUmNkRngwYUdWcFoyaDBPaUF4Tnpjd0xGeHVYSFJjZEZ4MGFXMWhaMlU2SUhOd2NtbDBaVWx0WVdkbExGeHVYSFJjZEZ4MGJuVnRZbVZ5VDJaR2NtRnRaWE02SUdGdWFXMWhkR2x2Yms5aWFpNWhibWx0WVhScGIyNUJjbkpoZVM1c1pXNW5kR2dzWEc1Y2RGeDBYSFIwYVdOcmMxQmxja1p5WVcxbE9pQTBMRnh1WEhSY2RGeDBiRzl2Y0hNNklHRnVhVzFoZEdsdmJrOWlhaTVzYjI5d1FXMXZkVzUwWEc1Y2RGeDBmU2s3WEc1Y2RGeDBYRzVjZEZ4MEx5OGdURzloWkNCemNISnBkR1VnYzJobFpYUmNibHgwWEhSemNISnBkR1ZKYldGblpTNWhaR1JGZG1WdWRFeHBjM1JsYm1WeUtGd2liRzloWkZ3aUxDQm5ZVzFsVEc5dmNDazdYRzVjZEZ4MGMzQnlhWFJsU1cxaFoyVXVjM0pqSUQwZ0oyRnpjMlYwY3k5cGJXRm5aWE12Um1GdWRHRnpkR1ZqWDFOd2NtbDBaVjlUYUdWbGRDNXdibWNuTzF4dVhIUjlJRnh1WEc0dkx5QkpUa2xVU1VGTVNWTkZJRUZPUkNCVFJWUlZVQ0JEVlZKU1JVNVVJRkJCUjBVdUlFVllSVU5WVkVVZ1ZGSkJUbE5KVkVsUFRsTWdRVTVFSUZKRlRVOVdSU0JVU1U1VUlFbEdJRkpGVEVWV1FVNVVJRnhjWEZ4Y2JseHVYSFJqYjI1emRGeDBjR0ZuWlV4dllXUmxjaUE5SUNocGJtUmxlQ2tnUFQ0Z2UxeHVYSFJjZEdsbUtHbHVaR1Y0SUQwOVBTQTFLU0I3WEc1Y2RGeDBYSFFrS0NjdWRHbHVkQ2NwTG5KbGJXOTJaVU5zWVhOektDZHlaVzF2ZG1WVWFXNTBKeWs3WEc1Y2RGeDBYSFFrS0NjdVltRmphMmR5YjNWdVpGZHlZWEJ3WlhJbktTNXlaVzF2ZG1WRGJHRnpjeWduYzJOaGJHVkNZV05yWjNKdmRXNWtKeWs3WEc1Y2RGeDBYSFFrS0NjamMyVmpkR2x2YmpVbktTNW1hVzVrS0NjdWFHVmhaR2x1WnljcExtRmtaRU5zWVhOektDZHphRzkzSUdaaFpHVkpiaWNwTzF4dVhIUmNkRngwSkNnbkxuTjFZbE5sWTNScGIyNG5LUzVoWkdSRGJHRnpjeWduYzJOaGJHVkNZV05yWjNKdmRXNWtKeWs3WEc1Y2RGeDBYSFFrS0NjdWMzVmlVMlZqZEdsdmJpY3BMbVpwYm1Rb0p5NTBhVzUwSnlrdVlXUmtRMnhoYzNNb0ozSmxiVzkyWlZScGJuUW5LVHRjYmx4MFhIUmNkQ1FvSnlOelpXTjBhVzl1TlNjcExtWnBibVFvSnk1MFpYaDBWM0poY0hCbGNpY3BMbUZrWkVOc1lYTnpLQ2R6YUc5M0p5azdYRzVjZEZ4MFhIUnpaWFJVYVcxbGIzVjBLQ2dwSUQwK0lIdGNibHgwWEhSY2RGeDBKQ2duTG5OMVlsTmxZM1JwYjI0Z1BpQXVkR1Y0ZEZkeVlYQndaWEluS1M1bWFXNWtLQ2N1YUdWaFpHbHVaeWNwTG1Ga1pFTnNZWE56S0NkbVlXUmxTVzRuS1R0Y2JseDBYSFJjZEgwc0lERXdNREFwTzF4dVhIUmNkSDBnWEc1Y2RGeDBaV3h6WlNCN1hHNWNkRngwWEhRa0tDY3VkR2x1ZENjcExuSmxiVzkyWlVOc1lYTnpLQ2R5WlcxdmRtVlVhVzUwSnlrN1hHNWNkRngwWEhRa0tDY3VjM1ZpVTJWamRHbHZiaWNwTG5KbGJXOTJaVU5zWVhOektDZHpZMkZzWlVKaFkydG5jbTkxYm1RbktUdGNibHgwWEhSY2RDUW9ZQzVpWVdOclozSnZkVzVrVjNKaGNIQmxjanB1YjNRb0kzTmxZM1JwYjI0a2UybHVaR1Y0ZlVKaFkydG5jbTkxYm1RcFlDa3VjbVZ0YjNabFEyeGhjM01vSjNOallXeGxRbUZqYTJkeWIzVnVaQ2NwTzF4dVhIUmNkRngwSkNoZ2MyVmpkR2x2Ymk1aFkzUnBkbVZnS1M1bWFXNWtLQ2N1ZEdsdWRDY3BMbUZrWkVOc1lYTnpLQ2R5WlcxdmRtVlVhVzUwSnlrN1hHNWNibHgwWEhSY2RDUW9ZQzV6WldOMGFXOXVMbUZqZEdsMlpXQXBMbVpwYm1Rb1lDNWlZV05yWjNKdmRXNWtWM0poY0hCbGNtQXBMbUZrWkVOc1lYTnpLQ2R6WTJGc1pVSmhZMnRuY205MWJtUW5LUzV2YmlnbllXNXBiV0YwYVc5dVpXNWtJSGRsWW10cGRFRnVhVzFoZEdsdmJrVnVaQ2NzSUNobGN5a2dQVDRnZTF4dVhIUmNkRngwSUNBa0tHQnpaV04wYVc5dUxtRmpkR2wyWldBcExtWnBibVFvSnk1MGFXNTBKeWt1Y21WdGIzWmxRMnhoYzNNb0ozSmxiVzkyWlZScGJuUW5LVHRjYmx4MFhIUmNkSDBwTzF4dVhHNWNkRngwWEhScFppZ2tLR0F1YzJWamRHbHZiaVI3YVc1a1pYaDlVR0ZuYVc1aGRHOXlRblYwZEc5dVlDa3ViR1Z1WjNSb0lDWW1JQ1FvWUM1elpXTjBhVzl1Skh0cGJtUmxlSDFRWVdkcGJtRjBiM0pDZFhSMGIyNHVZV04wYVhabFlDa3ViR1Z1WjNSb0lEd2dNU2tnZTF4dVhIUmNkRngwWEhRa0tHQXVjMlZqZEdsdmJpUjdhVzVrWlhoOVVHRm5hVzVoZEc5eVFuVjBkRzl1WUNrdVoyVjBLREFwTG1Oc2FXTnJLQ2s3WEc1Y2RGeDBYSFI5WEc1Y2RGeDBmVnh1WEhSOU8xeHVYRzR2THlCSVNVUkZJRUZNVENCQ1JVTkxSMUpQVlU1RVV5QkpUaUJVU0VVZ1UwVkRWRWxQVGlCRldFTkZVRlFnVkVoRklGTlFSVU5KUmtsRlJDQkpUa1JGV0N3Z1YwaEpRMGdnU1ZNZ1UwTkJURVZFSUVGT1JDQlRTRTlYVGk0Z1hGeGNYRnh1WEc1Y2RHTnZibk4wSUdsdWFYUnBZV3hwZW1WVFpXTjBhVzl1SUQwZ0tITmxZM1JwYjI1T2RXMWlaWElzSUdsa2VDa2dQVDRnZTF4dVhIUmNkQ1FvWUNOelpXTjBhVzl1Skh0elpXTjBhVzl1VG5WdFltVnlmVUpoWTJ0bmNtOTFibVFrZTJsa2VIMWdLUzV6YVdKc2FXNW5jeWduTG1KaFkydG5jbTkxYm1SWGNtRndjR1Z5SnlrdWJXRndLQ2hwZUN3Z1pXeGxLU0E5UGlCN1hHNWNkRngwWEhRa0tHVnNaU2t1WTNOektIdHZjR0ZqYVhSNU9pQXdmU2s3WEc1Y2RGeDBmU2s3WEc1Y2JseDBYSFFrS0dBamMyVmpkR2x2YmlSN2MyVmpkR2x2Yms1MWJXSmxjbjFDWVdOclozSnZkVzVrSkh0cFpIaDlZQ2t1WTNOektIdGNibHgwWEhSY2RDZDBjbUZ1YzJadmNtMG5PaUFuYzJOaGJHVW9NUzR4S1Njc1hHNWNkRngwWEhRbmIzQmhZMmwwZVNjNklERmNibHgwWEhSOUtUdGNibHgwZlR0Y2JseHVMeThnUTBGTVRDQnBibWwwYVdGc2FYcGxVMlZqZEdsdmJpQlBUaUJUUlVOVVNVOU9VeUF4TENBeklFRk9SQ0EwTGlCY1hGeGNYRzVjZEdsdWFYUnBZV3hwZW1WVFpXTjBhVzl1S0RFc0lEQXBPMXh1WEhScGJtbDBhV0ZzYVhwbFUyVmpkR2x2YmlnekxDQXdLVHRjYmx4MGFXNXBkR2xoYkdsNlpWTmxZM1JwYjI0b05Dd2dNQ2s3WEc1Y2JpOHZJRUpCUTB0SFVrOVZUa1FnU1UxQlIwVWdWRkpCVGxOSlZFbFBUaUJJUVU1RVRFVlNMaUJjWEZ4Y1hHNWNibHgwWTI5dWMzUWdhVzFoWjJWRGIyNTBjbTlzWlhJZ1BTQW9hV1I0VDJKcUxDQnpaV04wYVc5dVRuVnRZbVZ5S1NBOVBpQjdYRzVjZEZ4MGJHVjBJSEpsYkdWMllXNTBRVzVwYldGMGFXOXVPMXh1WEc1Y2RGeDBhV1lvYzJWamRHbHZiazUxYldKbGNpQTlQVDBnTVNrZ2UxeHVYSFJjZEZ4MGMzZHBkR05vS0dsa2VFOWlhaTV6WldOMGFXOXVNVU4xY25KbGJuUkpaSGdwSUh0Y2JseDBYSFJjZEZ4MFkyRnpaU0F3T2x4dVhIUmNkRngwWEhSY2RISmxiR1YyWVc1MFFXNXBiV0YwYVc5dUlEMGdiV0Z6ZEdWeVQySnFMbUpoYzJ0bGRHSmhiR3c3WEc1Y2RGeDBYSFJjZEdKeVpXRnJPMXh1WEhSY2RGeDBYSFJqWVhObElERTZYRzVjZEZ4MFhIUmNkRngwY21Wc1pYWmhiblJCYm1sdFlYUnBiMjRnUFNCdFlYTjBaWEpQWW1vdVptOXZkR0poYkd3N1hHNWNkRngwWEhSY2RHSnlaV0ZyTzF4dVhIUmNkRngwWEhSallYTmxJREk2WEc1Y2RGeDBYSFJjZEZ4MGNtVnNaWFpoYm5SQmJtbHRZWFJwYjI0Z1BTQnRZWE4wWlhKUFltb3VkR1Z1Ym1sek8xeHVYSFJjZEZ4MFhIUmljbVZoYXp0Y2JseDBYSFJjZEZ4MFkyRnpaU0F6T2x4dVhIUmNkRngwWEhSY2RISmxiR1YyWVc1MFFXNXBiV0YwYVc5dUlEMGdiV0Z6ZEdWeVQySnFMbUpoYzJWaVlXeHNPMXh1WEhSY2RGeDBYSFJpY21WaGF6dGNibHgwWEhSY2RGeDBZMkZ6WlNBME9seHVYSFJjZEZ4MFhIUmNkSEpsYkdWMllXNTBRVzVwYldGMGFXOXVJRDBnYldGemRHVnlUMkpxTG1aaGJqdGNibHgwWEhSY2RGeDBZbkpsWVdzN1hHNWNkRngwWEhSOVhHNWNkRngwZlZ4dVhHNWNkRngwSkNoZ0kzTmxZM1JwYjI0a2UzTmxZM1JwYjI1T2RXMWlaWEo5WUNrdVptbHVaQ2duTG5ScGJuUW5LUzV5WlcxdmRtVkRiR0Z6Y3lnbmNtVnRiM1psVkdsdWRDY3BPMXh1WEhSY2RDUW9ZQ056WldOMGFXOXVKSHR6WldOMGFXOXVUblZ0WW1WeWZVSmhZMnRuY205MWJtUWtlMmxrZUU5aWFsdGdjMlZqZEdsdmJpUjdjMlZqZEdsdmJrNTFiV0psY24xRGRYSnlaVzUwU1dSNFlGMTlZQ2t1Y21WdGIzWmxRMnhoYzNNb0ozTmpZV3hsUW1GamEyZHliM1Z1WkNjcE8xeHVYSFJjZEdsdWFYUnBZV3hwZW1WVFpXTjBhVzl1S0hObFkzUnBiMjVPZFcxaVpYSXNJR2xrZUU5aWFsdGdjMlZqZEdsdmJpUjdjMlZqZEdsdmJrNTFiV0psY24xRGRYSnlaVzUwU1dSNFlGMHBPMXh1WEhSY2RGeHVYSFJjZEhObGRGUnBiV1Z2ZFhRb0tDa2dQVDRnZTF4dVhIUmNkRngwYVdZb2MyVmpkR2x2Yms1MWJXSmxjaUE5UFQwZ01Ta2dlMXh1WEhSY2RGeDBYSFJoYm1sdFlYUnZjaWh5Wld4bGRtRnVkRUZ1YVcxaGRHbHZiaWs3WEc1Y2RGeDBYSFI5WEc1Y2JseDBYSFJjZENRb1lDTnpaV04wYVc5dUpIdHpaV04wYVc5dVRuVnRZbVZ5ZldBcExtWnBibVFvWUM1aVlXTnJaM0p2ZFc1a1YzSmhjSEJsY21BcExtRmtaRU5zWVhOektDZHpZMkZzWlVKaFkydG5jbTkxYm1RbktUdGNibHgwWEhSY2RDUW9ZQ056WldOMGFXOXVKSHR6WldOMGFXOXVUblZ0WW1WeWZXQXBMbVpwYm1Rb0p5NTBhVzUwSnlrdVlXUmtRMnhoYzNNb0ozSmxiVzkyWlZScGJuUW5LVHRjYmx4MFhIUjlMQ0ExTURBcE8xeHVYRzVjZEZ4MGFXWW9hV1I0VDJKcVcyQnpaV04wYVc5dUpIdHpaV04wYVc5dVRuVnRZbVZ5ZlVOMWNuSmxiblJKWkhoZ1hTQTlQVDBnSkNoZ0kzTmxZM1JwYjI0a2UzTmxZM1JwYjI1T2RXMWlaWEo5WUNrdVptbHVaQ2hnTG1KaFkydG5jbTkxYm1SWGNtRndjR1Z5WUNrdWJHVnVaM1JvSUMwZ01Ta2dlMXh1WEhSY2RGeDBhV1I0VDJKcVcyQnpaV04wYVc5dUpIdHpaV04wYVc5dVRuVnRZbVZ5ZlVOMWNuSmxiblJKWkhoZ1hTQTlJREE3WEc1Y2RGeDBmU0JsYkhObElIdGNibHgwWEhSY2RHbGtlRTlpYWx0Z2MyVmpkR2x2YmlSN2MyVmpkR2x2Yms1MWJXSmxjbjFEZFhKeVpXNTBTV1I0WUYwZ0t6MGdNVHRjYmx4MFhIUjlYRzVjZEgxY2JpOHZJRk5VUVZKVUlGTk1TVVJGVTBoUFZ5QlBUaUJUUlVOVVNVOU9JRElnWEZ4Y1hGeHVYSFJwYldGblpVTnZiblJ5YjJ4bGNpaHRZWE4wWlhKUFltb3NJRElwTzF4dVhHNHZMeUJEU0VGT1IwVWdVMFZEVkVsUFRpQXlJRUpCUTB0SFVrOVZUa1FnU1UxQlIwVWdSVlpGVWxrZ01UVWdVMFZEVDA1RVV5QmNYRnhjWEc1Y2RITmxkRWx1ZEdWeWRtRnNLQ2dwSUQwK0lIdGNibHgwWEhScGJXRm5aVU52Ym5SeWIyeGxjaWh0WVhOMFpYSlBZbW9zSURJcE8xeHVYSFI5TENBeE5UQXdNQ2s3WEc1Y2JpOHZJRkJCUjBsT1FWUkpUMDRnUWxWVVZFOU9VeUJEVEVsRFN5QklRVTVFVEVWU0lFWlBVaUJUUlVOVVNVOU9VeUF6SUVGT1JDQTBMaUJjWEZ4Y1hHNWNibHgwWTI5dWMzUWdhR0Z1Wkd4bFVHRnVhVzVoZEdsdmJrSjFkSFJ2YmtOc2FXTnJJRDBnS0dVcElEMCtJSHRjYmx4dVhIUmNkR052Ym5OMElHbGtlQ0E5SUhCaGNuTmxTVzUwS0NRb1pTNTBZWEpuWlhRcExtRjBkSElvSjJSaGRHRXRhVzVrWlhnbktTazdYRzVjZEZ4MFkyOXVjM1FnYzJWamRHbHZia2xrSUQwZ0pDaGxMblJoY21kbGRDa3VZMnh2YzJWemRDZ25jMlZqZEdsdmJpY3BMbUYwZEhJb0oybGtKeWs3WEc1Y2RGeDBiR1YwSUhKbGJHVjJZVzUwUkdGMFlVRnljbUY1TzF4dVhHNWNkRngwYVdZb2MyVmpkR2x2Ymtsa0lEMDlQU0FuYzJWamRHbHZiak1uS1NCN1hHNWNkRngwWEhSelpXTjBhVzl1TTBsa2VDQTlJR2xrZUR0Y2JseDBYSFI5WEc1Y2JseDBYSFJwWmloelpXTjBhVzl1U1dRZ1BUMDlJQ2R6WldOMGFXOXVOQ2NwSUh0Y2JseDBYSFJjZEhObFkzUnBiMjQwU1dSNElEMGdhV1I0TzF4dVhIUmNkSDFjYmx4dVhIUmNkQ1FvWUNNa2UzTmxZM1JwYjI1SlpIMWdLUzVtYVc1a0tDY3VkR2x1ZENjcExuSmxiVzkyWlVOc1lYTnpLQ2R5WlcxdmRtVlVhVzUwSnlrN1hHNWNkRngwSkNoZ0l5UjdjMlZqZEdsdmJrbGtmV0FwTG1acGJtUW9KeTUwWlhoMFYzSmhjSEJsY2ljcExuSmxiVzkyWlVOc1lYTnpLQ2R6YUc5M0p5azdYRzVjZEZ4MEpDaGdJeVI3YzJWamRHbHZia2xrZldBcExtWnBibVFvWUNOMFpYaDBWM0poY0hCbGNpUjdhV1I0ZldBcExtRmtaRU5zWVhOektDZHphRzkzSnlrN1hHNWNkRngwSkNoZ0l5UjdjMlZqZEdsdmJrbGtmVUpoWTJ0bmNtOTFibVFrZTJsa2VIMWdLUzV5WlcxdmRtVkRiR0Z6Y3lnbmMyTmhiR1ZDWVdOclozSnZkVzVrSnlrN1hHNWNkRngwSkNoZ0xpUjdjMlZqZEdsdmJrbGtmVkJoWjJsdVlYUnZja0oxZEhSdmJtQXBMbkpsYlc5MlpVTnNZWE56S0NkaFkzUnBkbVVuS1R0Y2JseDBYSFFrS0dVdWRHRnlaMlYwS1M1aFpHUkRiR0Z6Y3lnbllXTjBhWFpsSnlrN1hHNWNibHgwWEhScGJtbDBhV0ZzYVhwbFUyVmpkR2x2Ymlod1lYSnpaVWx1ZENna0tHQWpKSHR6WldOMGFXOXVTV1I5WUNrdVlYUjBjaWduWkdGMFlTMXBibVJsZUNjcEtTd2dhV1I0S1R0Y2JseHVYSFJjZEhObGRGUnBiV1Z2ZFhRb0tDa2dQVDRnZTF4dVhIUmNkRngwY0dGblpVeHZZV1JsY2lod1lYSnpaVWx1ZENna0tHQWpKSHR6WldOMGFXOXVTV1I5WUNrdVlYUjBjaWduWkdGMFlTMXBibVJsZUNjcEtTazdYRzVjZEZ4MGZTd2dOVEF3S1R0Y2JseHVYSFJjZEdsbUtITmxZM1JwYjI1SlpDQWhQVDBnSjNObFkzUnBiMjR5SnlsN1hHNWNkRngwWEhRa0tHQWpKSHR6WldOMGFXOXVTV1I5WUNrdVptbHVaQ2duTG1obFlXUnBibWNzSUhBbktTNWhaR1JEYkdGemN5Z25abUZrWlVsdUp5azdYRzVjZEZ4MFhIUWtLR0FqSkh0elpXTjBhVzl1U1dSOVlDa3ViMjRvSjNSeVlXNXphWFJwYjI1bGJtUWdkMlZpYTJsMFZISmhibk5wZEdsdmJrVnVaQ0J2VkhKaGJuTnBkR2x2YmtWdVpDY3NJQ2hsY3lrZ1BUNGdlMXh1WEhRZ0lDQWdYSFFrS0dBakpIdHpaV04wYVc5dVNXUjlZQ2t1Wm1sdVpDZ25MbWhsWVdScGJtY3NJSEFuS1M1eVpXMXZkbVZEYkdGemN5Z25abUZrWlVsdUp5azdYRzVjZEZ4MFhIUjlLVHRjYmx4MFhIUjlYRzVjZEgwN1hHNWNiaTh2SUVOTVNVTkxJRXhKVTFSRlRrVlNJRVpQVWlCUVFVZEpUa0ZVU1U5T0lFSlZWRlJQVGxNZ1QwNGdVMFZEVkVsUFRsTWdNeUJCVGtRZ05DNGdYRnhjWEZ4dVhHNWNkQ1FvSnk1elpXTjBhVzl1TTFCaFoybHVZWFJ2Y2tKMWRIUnZiaXdnTG5ObFkzUnBiMjQwVUdGbmFXNWhkRzl5UW5WMGRHOXVKeWt1WTJ4cFkyc29LR1VwSUQwK0lIdGNibHgwWEhSY2JseDBYSFJwWmlodFlYTjBaWEpQWW1wYkpDaGxMbU4xY25KbGJuUlVZWEpuWlhRcExtTnNiM05sYzNRb0ozTmxZM1JwYjI0bktTNWhkSFJ5S0NkcFpDY3BYUzVwYzBGMWRHOXRZWFJsWkNrZ2UxeHVMeThnU1VZZ1ZFaEZVa1VnU1ZNZ1FTQlNTVTVPU1U1SElFbE9WRVZTVmtGTUlFOU9JRlJJUlNCU1JVeEZWa0ZPVkNCVFJVTlVTVTlPSUVOTVJVRlNJRWxVSUZ4Y1hGeGNibHgwWEhSY2RHbHVkR1Z5ZG1Gc1RXRnVZV2RsY2lobVlXeHpaU3dnSkNobExtTjFjbkpsYm5SVVlYSm5aWFFwTG1Oc2IzTmxjM1FvSjNObFkzUnBiMjRuS1M1aGRIUnlLQ2RwWkNjcEtUdGNiaTh2SUZORlZDQkJJRTVGVnlCSlRsUkZVbFpCVENCUFJpQTNJRk5GUTA5T1JGTWdUMDRnVkVoRklGTkZRMVJKVDA0Z1hGeGNYRnh1WEhSY2RGeDBhVzUwWlhKMllXeE5ZVzVoWjJWeUtIUnlkV1VzSUNRb1pTNWpkWEp5Wlc1MFZHRnlaMlYwS1M1amJHOXpaWE4wS0NkelpXTjBhVzl1SnlrdVlYUjBjaWduYVdRbktTd2dNVEF3TURBcE8xeHVYSFJjZEgxY2JpOHZJRU5CVEV3Z1ZFaEZJRU5NU1VOTElFaEJUa1JNUlZJZ1JsVk9RMVJKVDA0Z1FVNUVJRkJCVTFNZ1NWUWdWRWhGSUVWV1JVNVVJRWxHSUZSQlVrZEZWQ0JKVXlCT1QxUWdRVXhTUlVGRVdTQkJRMVJKVmtVZ1hGeGNYRnh1WEhSY2RHbG1LQ0VrS0dVdVkzVnljbVZ1ZEZSaGNtZGxkQ2t1YUdGelEyeGhjM01vSjJGamRHbDJaU2NwS1NCN1hHNWNkRngwWEhSb1lXNWtiR1ZRWVc1cGJtRjBhVzl1UW5WMGRHOXVRMnhwWTJzb1pTazdYRzVjZEZ4MGZWeHVYSFI5S1R0Y2JseHVMeThnU1U1SlZFbEJURWxhUlNCUFRrVlFRVWRGVTBOU1QweE1JRWxHSUU1UFZDQkpUaUJEVFZNZ1VGSkZWa2xGVnk0Z1hGeGNYRnh1WEc1Y2RHbG1LQ0VrS0d4dlkyRjBhVzl1S1M1aGRIUnlLQ2RvY21WbUp5a3VhVzVqYkhWa1pYTW9KMmx1WkdWNExuQm9jQ2NwS1NCN1hHNWNkRngwSkNnbkkzTmpjbTlzYkdWeVYzSmhjSEJsY2ljcExtOXVaWEJoWjJWZmMyTnliMnhzS0h0Y2JseDBYSFJjZEhObFkzUnBiMjVEYjI1MFlXbHVaWEk2SUZ3aWMyVmpkR2x2Ymx3aUxDQWdJQ0JjYmx4MFhIUmNkR1ZoYzJsdVp6b2dYQ0psWVhObExXOTFkRndpTENBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnWEc1Y2RGeDBYSFJoYm1sdFlYUnBiMjVVYVcxbE9pQjBhVzFsTENBZ0lDQWdJQ0FnSUNBZ0lGeHVYSFJjZEZ4MGNHRm5hVzVoZEdsdmJqb2dkSEoxWlN3Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0JjYmx4MFhIUmNkSFZ3WkdGMFpWVlNURG9nZEhKMVpTd2dJQ0FnSUNBZ0lDQWdJQ0FnSUNCY2JseDBYSFJjZEdKbFptOXlaVTF2ZG1VNklDaHBibVJsZUNrZ1BUNGdlMzBzSUZ4dVhIUmNkRngwWVdaMFpYSk5iM1psT2lBb2FXNWtaWGdwSUQwK0lIdGNiaTh2SUVsT1NWUkpRVXhKV2tVZ1ZFaEZJRU5WVWxKRlRsUWdVRUZIUlM0Z1hGeGNYRnh1WEc1Y2RGeDBYSFJjZEhCaFoyVk1iMkZrWlhJb2FXNWtaWGdwTzF4dVhIUmNkRngwZlN3Z0lGeHVYSFJjZEZ4MGJHOXZjRG9nWm1Gc2MyVXNJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JjYmx4MFhIUmNkR3RsZVdKdllYSmtPaUIwY25WbExDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1hHNWNkRngwWEhSeVpYTndiMjV6YVhabFJtRnNiR0poWTJzNklHWmhiSE5sTENBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUZ4dVhIUmNkRngwWkdseVpXTjBhVzl1T2lCY0luWmxjblJwWTJGc1hDSWdJQ0FnSUNBZ0lDQWdYRzVjZEZ4MGZTazdYRzVjYmx4MFhIUWtLQ2NqYzJOeWIyeHNaWEpYY21Gd2NHVnlKeWt1Ylc5MlpWUnZLREVwTzF4dVhIUjlYRzVjYmk4dklFTlBUbFJTVDB3Z1EweEpRMHRUSUU5T0lGZFBVa3NnVjBsVVNDQlZVeUJUUlVOVVNVOU9JQ2hUUlVOVVNVOU9OU2t1SUZ4Y1hGeGNibHh1WEhRa0tDY3VZMnhwWTJ0aFlteGxKeWt1WTJ4cFkyc29LR1VwSUQwK0lIdGNibHgwWEhSc1pYUWdZM1Z5Y21WdWRGTmxZM1JwYjI0Z1BTQWtLR1V1ZEdGeVoyVjBLUzVqYkc5elpYTjBLQ1FvSnk1emRXSlRaV04wYVc5dUp5a3BPMXh1WEc1Y2RGeDBhV1lvWTNWeWNtVnVkRk5sWTNScGIyNHVhR0Z6UTJ4aGMzTW9KMjl3Wlc0bktTa2dlMXh1WEhSY2RGeDBZM1Z5Y21WdWRGTmxZM1JwYjI0dWNtVnRiM1psUTJ4aGMzTW9KMjl3Wlc0bktUdGNibHgwWEhSY2RHTjFjbkpsYm5SVFpXTjBhVzl1TG1acGJtUW9KeTVpZFhSMGIyNHNJSEFuS1M1eVpXMXZkbVZEYkdGemN5Z25abUZrWlVsdUp5azdYRzVjZEZ4MFhIUmpkWEp5Wlc1MFUyVmpkR2x2Ymk1emFXSnNhVzVuY3lnbkxuTjFZbE5sWTNScGIyNG5LUzV0WVhBb0tHbGtlQ3dnYzJWamRHbHZiaWtnUFQ0Z2UxeHVYSFJjZEZ4MFhIUWtLSE5sWTNScGIyNHBMbkpsYlc5MlpVTnNZWE56S0NkamJHOXpaV1FuS1R0Y2JseDBYSFJjZEZ4MEpDaHpaV04wYVc5dUtTNW1hVzVrS0NjdWRHbHVkQ2NwTG5KbGJXOTJaVU5zWVhOektDZGhaR1JVYVc1MEp5a3VZV1JrUTJ4aGMzTW9KM0psYlc5MlpWUnBiblFuS1R0Y2JseDBYSFJjZEgwcE8xeHVYSFJjZEgwZ1pXeHpaU0I3WEc1Y2RGeDBYSFJqZFhKeVpXNTBVMlZqZEdsdmJpNXlaVzF2ZG1WRGJHRnpjeWduWTJ4dmMyVmtKeWt1WVdSa1EyeGhjM01vSjI5d1pXNG5LVHRjYmx4MFhIUmNkR04xY25KbGJuUlRaV04wYVc5dUxtOXVLQ2QwY21GdWMybDBhVzl1Wlc1a0lIZGxZbXRwZEZSeVlXNXphWFJwYjI1RmJtUWdiMVJ5WVc1emFYUnBiMjVGYm1RbkxDQW9aWE1wSUQwK0lIdGNibHgwSUNBZ0lGeDBKQ2duTG5OMVlsTmxZM1JwYjI0dWIzQmxiaWNwTG1acGJtUW9KeTVpZFhSMGIyNHNJSEFuS1M1aFpHUkRiR0Z6Y3lnblptRmtaVWx1SnlrN1hHNWNkQ0FnSUNCY2RDUW9KeTV6ZFdKVFpXTjBhVzl1TG05d1pXNG5LUzVtYVc1a0tDZHdMbVpoWkdWSmJpY3BMbTl1S0NkMGNtRnVjMmwwYVc5dVpXNWtJSGRsWW10cGRGUnlZVzV6YVhScGIyNUZibVFnYjFSeVlXNXphWFJwYjI1RmJtUW5MQ0FvWlhNcElEMCtJSHRjYmx4MFhIUmNkRngwSUNBa0tDY3VjM1ZpVTJWamRHbHZiaTV2Y0dWdUp5a3VabWx1WkNnbkxuUnBiblFuS1M1aFpHUkRiR0Z6Y3lnbllXUmtWR2x1ZENjcExuSmxiVzkyWlVOc1lYTnpLQ2R5WlcxdmRtVlVhVzUwSnlrN1hHNWNkRngwWEhSY2RIMHBPMXh1WEhSY2RGeDBmU2s3WEc1Y2RGeDBYSFJqZFhKeVpXNTBVMlZqZEdsdmJpNXphV0pzYVc1bmN5Z25Mbk4xWWxObFkzUnBiMjRuS1M1dFlYQW9LR2xrZUN3Z2MyVmpkR2x2YmlrZ1BUNGdlMXh1WEhSY2RGeDBYSFFrS0hObFkzUnBiMjRwTG5KbGJXOTJaVU5zWVhOektDZHZjR1Z1SnlrdVlXUmtRMnhoYzNNb0oyTnNiM05sWkNjcE8xeHVYSFJjZEZ4MFhIUWtLSE5sWTNScGIyNHBMbVpwYm1Rb0p5NTBhVzUwSnlrdWNtVnRiM1psUTJ4aGMzTW9KM0psYlc5MlpWUnBiblFuS1M1aFpHUkRiR0Z6Y3lnbllXUmtWR2x1ZENjcE8xeHVYSFJjZEZ4MFhIUWtLSE5sWTNScGIyNHBMbVpwYm1Rb0p5NWlkWFIwYjI0c0lIQW5LUzV5WlcxdmRtVkRiR0Z6Y3lnblptRmtaVWx1SnlrN1hHNWNkRngwWEhSOUtUdGNibHgwWEhSOVhHNWNkRngwWTNWeWNtVnVkRk5sWTNScGIyNHVabWx1WkNnbkxuUnBiblFuS1M1eVpXMXZkbVZEYkdGemN5Z25ZV1JrVkdsdWRDY3BMbUZrWkVOc1lYTnpLQ2R5WlcxdmRtVlVhVzUwSnlrN1hHNWNkSDBwTzF4dVhHNHZMeUJEVDA1VVVrOU1JRVpQVDFSRlVpQkJVbEpQVnlCRFRFbERTMU11SUZ4Y1hGeGNibHh1WEhRa0tDY2paRzkzYmtGeWNtOTNKeWt1WTJ4cFkyc29LQ2tnUFQ0Z2UxeHVYSFJjZEdsbUtDUW9kMmx1Wkc5M0tTNW9aV2xuYUhRb0tTQXFJQ2drS0NjdWNHRm5aU2NwTG14bGJtZDBhQ0F0SURFcElEMDlQU0F0SUNRb0p5TnpZM0p2Ykd4bGNsZHlZWEJ3WlhJbktTNXZabVp6WlhRb0tTNTBiM0FwSUh0Y2JpOHZJRTFQVmtVZ1ZFOGdWRTlRSUU5R0lGQkJSMFVnU1VZZ1ExVlNVa1ZPVkV4WklFRlVJRUpQVkZSUFRTQmNYRnhjWEc1Y2RDQWdYSFFrS0NjamMyTnliMnhzWlhKWGNtRndjR1Z5SnlrdWJXOTJaVlJ2S0RFcE8xeHVYSFJjZEgwZ1pXeHpaU0I3WEc1Y2RGeDBYSFFrS0NjamMyTnliMnhzWlhKWGNtRndjR1Z5SnlrdWJXOTJaVVJ2ZDI0b0tUdGNibHgwWEhSOVhHNWNkSDBwTzF4dVhHNHZMeUJJU1VSRklGUklSU0JNVDBGRVNVNUhJRUZPU1UxQlZFbFBVRTRnVjBoRlRpQldTVVJGVHlCSlV5QlNSVUZFV1NCVVR5QlFURUZaSUU5T0lFUkZVMWhMVkU5UUxpQmNYRnhjWEc1Y2JseDBZMjl1YzNRZ2FHbGtaVXh2WVdScGJtZEJibWx0WVhScGIyNGdQU0FvS1NBOVBpQjdYRzVjZEZ4MGFXWW9kMmx1Wkc5M0xtbHVibVZ5VjJsa2RHZ2dQaUE0TURBZ0ppWWdJU1FvSnlOc2IyRmthVzVuSnlrdWFHRnpRMnhoYzNNb0oyaHBaR1JsYmljcEtTQjdYRzVjYmx4MFhIUmNkR2xtS0NRb0p5TjJhV1JsYnljcExteGxibWQwYUNBbUppQWtLQ2NqZG1sa1pXOG5LUzVuWlhRb01Da3VjbVZoWkhsVGRHRjBaU0E5UFQwZ05Da2dlMXh1WEhSY2RGeDBYSFFrS0NjamJHOWhaR2x1WnljcExtRmtaRU5zWVhOektDZG9hV1JrWlc0bktUdGNibHgwWEhSY2RIMWNibHgwWEhSOVhHNWNkSDFjYmx4dUx5OGdUVUZPUVVkRlRVVk9WQ0JHVlU1RFZFbFBUaUJHVDFJZ1UwVlVWRWxPUnlCQlRrUWdRMHhGUVZKSlRrY2dWRWhGSUZOTVNVUkZJRUZWVkU5TlFWUkpUMDRnU1U1VVJWSldRVXhUTGlCY1hGeGNYRzVjYmx4MFkyOXVjM1FnYVc1MFpYSjJZV3hOWVc1aFoyVnlJRDBnS0dac1lXY3NJSE5sWTNScGIyNUpaQ3dnZEdsdFpTa2dQVDRnZTF4dUlDQWdYSFJwWmlobWJHRm5LU0I3WEc0Z1hIUmNkRngwYldGemRHVnlUMkpxVzNObFkzUnBiMjVKWkYwdVlYVjBiMjFoZEdVZ1BTQnpaWFJKYm5SbGNuWmhiQ2dvS1NBOVBpQjdYRzRnSUNBZ0lGeDBYSFJ6ZDJsd1pVTnZiblJ5YjJ4c1pYSW9jMlZqZEdsdmJrbGtMQ0FuYkNjcE8xeDBYRzRnSUNBZ0lGeDBmU3dnZEdsdFpTazdJRnh1SUNBZ1hIUjlJR1ZzYzJVZ2UxeDBYSFJjYmlBZ0lDQmNkR05zWldGeVNXNTBaWEoyWVd3b2JXRnpkR1Z5VDJKcVczTmxZM1JwYjI1SlpGMHVZWFYwYjIxaGRHVXBPMXh1SUNBZ1hIUjlYRzVjZEgwN1hHNWNiaTh2SUVsR0lFNVBWQ0JKVGlCRFRWTWdRVVJOU1U0Z1VGSkZWa2xGVnl3Z1VFVlNVRVZVVlVGTVRGa2dRMGhGUTBzZ1NVWWdWMFVnUVZKRklFRlVJRlJJUlNCVVQxQWdUMFlnVkVoRklGQkJSMFVnUVU1RUlFbEdJRk5QTENCRVQwNVVJRk5JVDFjZ1ZFaEZJRVpQVDFSRlVpQlBVaUJIVWtWRlRpQlRTRUZRUlM0Z1hGeGNYRnh1WEc1Y2RHbG1LQ0VrS0d4dlkyRjBhVzl1S1M1aGRIUnlLQ2RvY21WbUp5a3VhVzVqYkhWa1pYTW9KMmx1WkdWNExuQm9jQ2NwS1NCN1hHNWNkRngwYzJWMFNXNTBaWEoyWVd3b0tDa2dQVDRnZTF4dVhIUmNkRngwYVdZb0pDZ25JM05qY205c2JHVnlWM0poY0hCbGNpY3BMbTltWm5ObGRDZ3BMblJ2Y0NBK1BTQXRJQ2gzYVc1a2IzY3VhVzV1WlhKSVpXbG5hSFFnTHlBeExqa3BLU0I3WEc1Y2RGeDBYSFJjZENRb0p5Tm9aV0ZrWlhKVGFHRndaU3dnSTJadmIzUmxjaWNwTG1Ga1pFTnNZWE56S0NkdGIzWmxUMlptVTJOeVpXVnVKeWs3WEc1Y2JseDBYSFJjZEZ4MGFXWW9KQ2duSTNacFpHVnZKeWt1YkdWdVozUm9JQ1ltSUNRb0p5TjJhV1JsYnljcExtTnpjeWduWkdsemNHeGhlU2NwSUNFOVBTQW5ibTl1WlNjcElIdGNibHgwWEhSY2RGeDBYSFFrS0NjamRtbGtaVzhuS1M1blpYUW9NQ2t1Y0d4aGVTZ3BPMXh1WEhSY2RGeDBYSFI5WEc1Y2JseDBYSFJjZEZ4MEpDZ25MbUZ5Y205M0p5a3VZV1JrUTJ4aGMzTW9KM0IxYkhOaGRHVW5LVHRjYmx4MFhIUmNkSDBnWld4elpTQjdYRzVjZEZ4MFhIUmNkQ1FvSnlOb1pXRmtaWEpUYUdGd1pTd2dJMlp2YjNSbGNpY3BMbkpsYlc5MlpVTnNZWE56S0NkdGIzWmxUMlptVTJOeVpXVnVKeWs3WEc1Y2RGeDBYSFJjZENRb0p5NWhjbkp2ZHljcExuSmxiVzkyWlVOc1lYTnpLQ2R3ZFd4ellYUmxKeWs3WEc1Y2JseDBYSFJjZEZ4MGFXWW9KQ2duSTNacFpHVnZKeWt1YkdWdVozUm9LU0I3WEc1Y2RGeDBYSFJjZEZ4MEpDZ25JM1pwWkdWdkp5a3VaMlYwS0RBcExuQmhkWE5sS0NrN1hHNWNkRngwWEhSY2RIMWNibHgwWEhSY2RIMWNibHh1THk4Z1VrOVVRVlJGSUZSSVJTQkJVbEpQVnlCSlRpQlVTRVVnUms5UFZFVlNJRmRJUlU0Z1FWUWdWRWhGSUVKUFZGUlBUU0JQUmlCVVNFVWdVRUZIUlNCY1hGeGNYRzVjYmx4MFhIUmNkR2xtS0NRb0p5TnpZM0p2Ykd4bGNsZHlZWEJ3WlhJbktTNXZabVp6WlhRb0tTNTBiM0FnUENBdElDaDNhVzVrYjNjdWFXNXVaWEpJWldsbmFIUWdLaUEwS1NrZ2UxeHVYSFJjZEZ4MFhIUWtLQ2NqWkc5M2JrRnljbTkzSnlrdVkzTnpLSHNuZEhKaGJuTm1iM0p0SnpvZ0ozSnZkR0YwWlNneE9EQmtaV2NwSUhSeVlXNXpiR0YwWlZnb0xUVXdKU2tuZlNrN1hHNWNkRngwWEhSOUlHVnNjMlVnZTF4dVhIUmNkRngwWEhRa0tDY2paRzkzYmtGeWNtOTNKeWt1WTNOektIc25kSEpoYm5ObWIzSnRKem9nSjNSeVlXNXpiR0YwWlZnb0xUVXdKU2tnY205MFlYUmxLREJrWldjcEozMHBPMXh1WEhSY2RGeDBmVnh1WEc1Y2RGeDBYSFJvYVdSbFRHOWhaR2x1WjBGdWFXMWhkR2x2YmlncE8xeHVYRzR2THlCQlJFUWdURUZPUkZORFFWQkZJRk5VV1V4RlV5QlVUeUJTUlV4RlZrRk9WQ0JGVEVWTlJVNVVVeUJjWEZ4Y1hHNWNibHgwWEhSY2RHbG1LSGRwYm1SdmR5NXRZWFJqYUUxbFpHbGhLRndpS0c5eWFXVnVkR0YwYVc5dU9pQnNZVzVrYzJOaGNHVXBYQ0lwTG0xaGRHTm9aWE1nSmlZZ2QybHVaRzkzTG1sdWJtVnlWMmxrZEdnZ1BDQTRNREFwSUh0Y2JseDBYSFJjZENBZ0pDZ25MbTVoZGw5c2FXNXJMQ0FqYUdWaFpHVnlVMmhoY0dVc0lDTm1iMjkwWlhJc0lDNWpkWE4wYjIwc0lDNXRZWEpyWlhJc0lDTnpaV04wYVc5dU5Td2dMblJsZUhSWGNtRndjR1Z5SnlrdVlXUmtRMnhoYzNNb0oyeGhibVJ6WTJGd1pTY3BPMXh1WEhSY2RGeDBmU0JsYkhObElIdGNibHgwWEhSY2RGeDBJQ1FvSnk1dVlYWmZiR2x1YXl3Z0kyaGxZV1JsY2xOb1lYQmxMQ0FqWm05dmRHVnlMQ0F1WTNWemRHOXRMQ0F1YldGeWEyVnlMQ0FqYzJWamRHbHZialVzSUM1MFpYaDBWM0poY0hCbGNpY3BMbkpsYlc5MlpVTnNZWE56S0Nkc1lXNWtjMk5oY0dVbktUdGNibHgwWEhSY2RIMWNibHh1WEhSY2RGeDBhV1lvSkNnbkkzTmxZM1JwYjI0ekxtRmpkR2wyWlNjcExteGxibWQwYUNrZ2V5QXZMeUJCVlZSUFRVRlVSU0JVU0VVZ1UweEpSRVZUSUU5T0lGTkZRMVJKVDFCT0lETWdSVlpGVWxrZ055QlRSVU5QVGtSVElFbEdJRlJJUlNCVFJVTlVTVTlPSUVsVElFRkRWRWxXUlM0Z1hGeGNYRnh1WEhSY2RGeDBYSFJwWmlodFlYTjBaWEpQWW1vdWMyVmpkR2x2YmpNdWFYTkJkWFJ2YldGMFpXUWdJVDA5SUhSeWRXVXBJSHRjYmx4MFhIUmNkRngwWEhSdFlYTjBaWEpQWW1vdWMyVmpkR2x2YmpNdWFYTkJkWFJ2YldGMFpXUWdQU0IwY25WbE8xeHVYSFJjZEZ4MFhIUmNkR2x1ZEdWeWRtRnNUV0Z1WVdkbGNpaDBjblZsTENBbmMyVmpkR2x2YmpNbkxDQXhNREF3TUNrN1hHNWNkRngwWEhSY2RIMWNibHgwWEhSY2RIMGdaV3h6WlNCN0lDOHZJRk5VVDFBZ1FWVlVUMDFCVkVWRUlGTk1TVVJGVXlCUFRpQlRSVU5VU1U5UVRpQXpJRWxHSUZSSVJTQlRSVU5VU1U5T0lFbFRJRTVQVkNCQlExUkpWa1V1SUZ4Y1hGeGNibHgwWEhSY2RGeDBhV1lvYldGemRHVnlUMkpxTG5ObFkzUnBiMjR6TG1selFYVjBiMjFoZEdWa0lEMDlQU0IwY25WbEtTQjdYRzVjZEZ4MFhIUmNkRngwYVc1MFpYSjJZV3hOWVc1aFoyVnlLR1poYkhObExDQW5jMlZqZEdsdmJqTW5LVHRjYmx4MFhIUmNkRngwWEhSdFlYTjBaWEpQWW1vdWMyVmpkR2x2YmpNdWFYTkJkWFJ2YldGMFpXUWdQU0JtWVd4elpUdGNibHgwWEhSY2RGeDBmVnh1WEhSY2RGeDBmVnh1WEc1Y2RGeDBYSFJwWmlna0tDY2pjMlZqZEdsdmJqUXVZV04wYVhabEp5a3ViR1Z1WjNSb0tTQjdJQzh2SUVGVlZFOU5RVlJGSUZSSVJTQlRURWxFUlZNZ1QwNGdVMFZEVkVsUFVFNGdOQ0JGVmtWU1dTQTNJRk5GUTA5T1JGTWdTVVlnVkVoRklGTkZRMVJKVDA0Z1NWTWdRVU5VU1ZaRkxpQmNYRnhjWEc1Y2RGeDBYSFJjZEdsbUtHMWhjM1JsY2s5aWFpNXpaV04wYVc5dU5DNXBjMEYxZEc5dFlYUmxaQ0FoUFQwZ2RISjFaU2tnZTF4dVhIUmNkRngwWEhSY2RHMWhjM1JsY2s5aWFpNXpaV04wYVc5dU5DNXBjMEYxZEc5dFlYUmxaQ0E5SUhSeWRXVTdYRzVjZEZ4MFhIUmNkRngwYVc1MFpYSjJZV3hOWVc1aFoyVnlLSFJ5ZFdVc0lDZHpaV04wYVc5dU5DY3NJREV3TURBd0tUdGNibHgwWEhSY2RGeDBmVnh1WEhSY2RGeDBmU0JsYkhObElIc2dMeThnVTFSUFVDQkJWVlJQVFVGVVJVUWdVMHhKUkVWVElFOU9JRk5GUTFSSlQxQk9JRFFnU1VZZ1ZFaEZJRk5GUTFSSlQwNGdTVk1nVGs5VUlFRkRWRWxXUlM0Z1hGeGNYRnh1WEhSY2RGeDBYSFJwWmlodFlYTjBaWEpQWW1vdWMyVmpkR2x2YmpRdWFYTkJkWFJ2YldGMFpXUWdQVDA5SUhSeWRXVXBJSHRjYmx4MFhIUmNkRngwWEhScGJuUmxjblpoYkUxaGJtRm5aWElvWm1Gc2MyVXNJQ2R6WldOMGFXOXVOQ2NwTzF4dVhIUmNkRngwWEhSY2RHMWhjM1JsY2s5aWFpNXpaV04wYVc5dU5DNXBjMEYxZEc5dFlYUmxaQ0E5SUdaaGJITmxPMXh1WEhSY2RGeDBYSFI5WEc1Y2RGeDBYSFI5WEc1Y2RGeDBmU3dnTlRBd0tUdGNibHgwZlZ4dVhHNHZMeUJEVDA1VVVrOU1JRmRJUVZRZ1NFRlFVRVZPVXlCWFNFVk9JRXhKVGt0VElFbE9JRlJJUlNCT1FWWXZUVVZPVlNCQlVrVWdRMHhKUTB0RlJDQmNYRnhjWEc1Y2JseDBKQ2duTG01aGRsOXNhVzVySnlrdVkyeHBZMnNvS0dVcElEMCtJSHRjYmx4MFhIUmpiMjV6ZENCd1lXZGxTV1I0SUQwZ2NHRnljMlZKYm5Rb0pDaGxMblJoY21kbGRDa3VZWFIwY2lnblpHRjBZUzFwYm1SbGVDY3BLVHRjYmx4MFhIUWtLQ2NqYzJOeWIyeHNaWEpYY21Gd2NHVnlKeWt1Ylc5MlpWUnZLSEJoWjJWSlpIZ3BPMXh1WEhSY2RDUW9KeU50Wlc1MVFteHZZMnRQZFhRbktTNWhaR1JEYkdGemN5Z25hR2xrWkdWdUp5azdYRzVjYmx4MFhIUnBaaWhpZFhKblpYSXVZMnhoYzNOTWFYTjBMbU52Ym5SaGFXNXpLQ2RpZFhKblpYSXRMV0ZqZEdsMlpTY3BLU0I3WEc0Z0lDQWdJQ0J1WVhZdVkyeGhjM05NYVhOMExuSmxiVzkyWlNnbmJtRjJYMjl3Wlc0bktUdGNiaUFnSUNBZ0lHSjFjbWRsY2k1amJHRnpjMHhwYzNRdWNtVnRiM1psS0NkaWRYSm5aWEl0TFdGamRHbDJaU2NwTzF4dUlDQWdJQ0FnWkc5amRXMWxiblF1WW05a2VTNXpkSGxzWlM1d2IzTnBkR2x2YmlBOUlDZHlaV3hoZEdsMlpTYzdYRzRnSUNBZ2ZTQmNibHgwZlNrN1hHNWNiaTh2SUZkSVJVNGdWRWhGSUU1QlZpQkpVeUJQVUVWT0lGQlNSVlpGVGxRZ1ZWTkZVaUJHVWs5TklFSkZTVTVISUVGQ1RFVWdWRThnUTB4SlEwc2dRVTVaVkVoSlRrY2dSVXhUUlNCY1hGeGNYRzVjYmx4MEpDZ25JMjFsYm5WQ2JHOWphMDkxZENjcExtTnNhV05yS0NobEtTQTlQaUI3WEc1Y2RDQWdJR1V1YzNSdmNGQnliM0JoWjJGMGFXOXVLQ2s3WEc1Y2RIMHBPMXh1WEc1Y2RIWmhjaUJpZFhKblpYSWdQU0JrYjJOMWJXVnVkQzVuWlhSRmJHVnRaVzUwUW5sSlpDZ25iV0ZwYmkxaWRYSm5aWEluS1N3Z1hHNGdJRzVoZGlBOUlHUnZZM1Z0Wlc1MExtZGxkRVZzWlcxbGJuUkNlVWxrS0NkdFlXbHVUbUYySnlrN1hHNWNiaTh2SUVOUFRsUlNUMHdnUms5U0lFOVFSVTRnUVU1RUlFTk1UMU5KVGtjZ1ZFaEZJRTFGVGxVdlRrRldJQ0JjWEZ4Y1hHNWNiaUFnWm5WdVkzUnBiMjRnYm1GMlEyOXVkSEp2YkNncElIdGNibHh1SUNBZ0lHbG1LR0oxY21kbGNpNWpiR0Z6YzB4cGMzUXVZMjl1ZEdGcGJuTW9KMkoxY21kbGNpMHRZV04wYVhabEp5a3BJSHRjYmlBZ0lDQWdJRzVoZGk1amJHRnpjMHhwYzNRdWNtVnRiM1psS0NkdVlYWmZiM0JsYmljcE8xeHVJQ0FnSUNBZ1luVnlaMlZ5TG1Oc1lYTnpUR2x6ZEM1eVpXMXZkbVVvSjJKMWNtZGxjaTB0WVdOMGFYWmxKeWs3WEc0Z0lDQWdJQ0FrS0NjamJXVnVkVUpzYjJOclQzVjBKeWt1WVdSa1EyeGhjM01vSjJocFpHUmxiaWNwTzF4dUlDQWdJSDBnWEc0Z0lDQWdaV3h6WlNCN1hHNGdJQ0FnSUNCaWRYSm5aWEl1WTJ4aGMzTk1hWE4wTG1Ga1pDZ25ZblZ5WjJWeUxTMWhZM1JwZG1VbktUdGNiaUFnSUNBZ0lHNWhkaTVqYkdGemMweHBjM1F1WVdSa0tDZHVZWFpmYjNCbGJpY3BPMXh1SUNBZ0lDQWdKQ2duSTIxbGJuVkNiRzlqYTA5MWRDY3BMbkpsYlc5MlpVTnNZWE56S0Nkb2FXUmtaVzRuS1R0Y2JpQWdJQ0I5WEc0Z0lIMWNiaUFnWEc0dkx5QlBUa3haSUV4SlUxUkZUaUJHVDFJZ1RVVk9WU0JEVEVsRFMxTWdWMGhGVGlCT1QxUWdTVTRnUTAxVElGQlNSVlpKUlZjZ1RVOUVSU0JjWEZ4Y1hHNWNiaUFnYVdZb0lTUW9iRzlqWVhScGIyNHBMbUYwZEhJb0oyaHlaV1luS1M1cGJtTnNkV1JsY3lnbmFXNWtaWGd1Y0dod0p5a3BJSHRjYmlBZ1hIUmlkWEpuWlhJdVlXUmtSWFpsYm5STWFYTjBaVzVsY2lnblkyeHBZMnNuTENCdVlYWkRiMjUwY205c0tUdGNiaUFnZlZ4dVhHNHZMeUJEVEU5VFJTQlVTRVVnVGtGV0lFbEdJRlJJUlNCWFNVNUVUMWNnU1ZNZ1QxWkZVaUF4TURBd1VGZ2dWMGxFUlNCY1hGeGNYRzVjYmlBZ2QybHVaRzkzTG1Ga1pFVjJaVzUwVEdsemRHVnVaWElvSjNKbGMybDZaU2NzSUdaMWJtTjBhVzl1S0NrZ2UxeHVJQ0FnSUdsbUtIZHBibVJ2ZHk1cGJtNWxjbGRwWkhSb0lENGdNVEF3TUNBbUppQnVZWFl1WTJ4aGMzTk1hWE4wTG1OdmJuUmhhVzV6S0NkdVlYWmZiM0JsYmljcEtTQjdYRzRnSUNBZ0lDQnVZWFpEYjI1MGNtOXNLQ2s3WEc0Z0lDQWdJQ0J1WVhZdVkyeGhjM05NYVhOMExuSmxiVzkyWlNnbmJtRjJYMjl3Wlc0bktUdGNiaUFnSUNBZ0lDQWtLQ2NqYldWdWRVSnNiMk5yVDNWMEp5a3VZV1JrUTJ4aGMzTW9KMmhwWkdSbGJpY3BPMXh1SUNBZ0lIMWNiaUFnZlNrN1hHNWNiaTh2SUZSSVNWTWdVMFZVSUU5R0lFbEdJRk5VUVZSRlRVVk9WRk1nU1U1SlZFbEJURWxUUlZNZ1ZFaEZJRk5RUlZOSlJrbERJRkJCUjBWVElFWlBVaUJRVWtWV1NVVlhTVTVISUVsT0lFTk5VeUJCUkUxSlRpNGdYRnhjWEZ4dVhHNGdJR2xtS0NRb2JHOWpZWFJwYjI0cExtRjBkSElvSjJoeVpXWW5LUzVwYm1Oc2RXUmxjeWduYVc1a1pYZ3VjR2h3SnlrcElIdGNibHgwWEhScFppZ2tLR3h2WTJGMGFXOXVLUzVoZEhSeUtDZG9jbVZtSnlrdWFXNWpiSFZrWlhNb0oybHRZV2RwYm1VdGFXWW5LU2tnZTF4dVhIUmNkRngwY0dGblpVeHZZV1JsY2lnMEtUdGNibHgwWEhSOVhHNWNkRngwYVdZb0pDaHNiMk5oZEdsdmJpa3VZWFIwY2lnbmFISmxaaWNwTG1sdVkyeDFaR1Z6S0Nkb2IzY3RkMlV0YVc1dWIzWmhkR1VuS1NrZ2UxeHVYSFJjZEZ4MGNHRm5aVXh2WVdSbGNpZ3pLVHRjYmx4MFhIUjlYRzVjZEZ4MGFXWW9KQ2hzYjJOaGRHbHZiaWt1WVhSMGNpZ25hSEpsWmljcExtbHVZMngxWkdWektDZDNiM0pyTFhkcGRHZ3RkWE1uS1NrZ2UxeHVYSFJjZEZ4MGNHRm5aVXh2WVdSbGNpZzFLVHRjYmx4MFhIUjlYRzVjZEZ4MGFXWW9KQ2hzYjJOaGRHbHZiaWt1WVhSMGNpZ25hSEpsWmljcExtbHVZMngxWkdWektDZGpiMjUwWVdOMExYVnpKeWtwSUh0Y2JseDBYSFJjZEhCaFoyVk1iMkZrWlhJb05pazdYRzVjZEZ4MGZWeHVYSFJjZEdsbUtDUW9iRzlqWVhScGIyNHBMbUYwZEhJb0oyaHlaV1luS1M1cGJtTnNkV1JsY3lnbmFHOXRaUzEyYVdSbGJ5Y3BLU0I3WEc1Y2RGeDBYSFJ6WlhSSmJuUmxjblpoYkNnb0tTQTlQaUI3WEc1Y2RGeDBYSFJjZEdocFpHVk1iMkZrYVc1blFXNXBiV0YwYVc5dUtDazdYRzVjZEZ4MFhIUjlMQ0ExTURBcFhHNWNkRngwZlZ4dVhIUjlYRzVjYmk4dklGTlhTVkJGSUVWV1JVNVVVeUJFUlZSRlExUlBVaUJHVlU1RFZFbFBUaUJjWEZ4Y1hHNWNiaUFnWm5WdVkzUnBiMjRnWkdWMFpXTjBjM2RwY0dVb1pXd3NJR1oxYm1NcElIdGNibHgwSUNCc1pYUWdjM2RwY0dWZlpHVjBJRDBnZTMwN1hHNWNkQ0FnYzNkcGNHVmZaR1YwTG5OWUlEMGdNRHNnYzNkcGNHVmZaR1YwTG5OWklEMGdNRHNnYzNkcGNHVmZaR1YwTG1WWUlEMGdNRHNnYzNkcGNHVmZaR1YwTG1WWklEMGdNRHRjYmx4MElDQjJZWElnYldsdVgzZ2dQU0F6TURzZ0lDOHZiV2x1SUhnZ2MzZHBjR1VnWm05eUlHaHZjbWw2YjI1MFlXd2djM2RwY0dWY2JseDBJQ0IyWVhJZ2JXRjRYM2dnUFNBek1Ec2dJQzh2YldGNElIZ2daR2xtWm1WeVpXNWpaU0JtYjNJZ2RtVnlkR2xqWVd3Z2MzZHBjR1ZjYmx4MElDQjJZWElnYldsdVgza2dQU0ExTURzZ0lDOHZiV2x1SUhrZ2MzZHBjR1VnWm05eUlIWmxjblJwWTJGc0lITjNhWEJsWEc1Y2RDQWdkbUZ5SUcxaGVGOTVJRDBnTmpBN0lDQXZMMjFoZUNCNUlHUnBabVpsY21WdVkyVWdabTl5SUdodmNtbDZiMjUwWVd3Z2MzZHBjR1ZjYmx4MElDQjJZWElnWkdseVpXTWdQU0JjSWx3aU8xeHVYSFFnSUd4bGRDQmxiR1VnUFNCa2IyTjFiV1Z1ZEM1blpYUkZiR1Z0Wlc1MFFubEpaQ2hsYkNrN1hHNWNkQ0FnWld4bExtRmtaRVYyWlc1MFRHbHpkR1Z1WlhJb0ozUnZkV05vYzNSaGNuUW5MR1oxYm1OMGFXOXVLR1VwZTF4dVhIUWdJQ0FnZG1GeUlIUWdQU0JsTG5SdmRXTm9aWE5iTUYwN1hHNWNkQ0FnSUNCemQybHdaVjlrWlhRdWMxZ2dQU0IwTG5OamNtVmxibGc3SUZ4dVhIUWdJQ0FnYzNkcGNHVmZaR1YwTG5OWklEMGdkQzV6WTNKbFpXNVpPMXh1WEhRZ0lIMHNabUZzYzJVcE8xeHVYSFFnSUdWc1pTNWhaR1JGZG1WdWRFeHBjM1JsYm1WeUtDZDBiM1ZqYUcxdmRtVW5MR1oxYm1OMGFXOXVLR1VwZTF4dVhIUWdJQ0FnWlM1d2NtVjJaVzUwUkdWbVlYVnNkQ2dwTzF4dVhIUWdJQ0FnZG1GeUlIUWdQU0JsTG5SdmRXTm9aWE5iTUYwN1hHNWNkQ0FnSUNCemQybHdaVjlrWlhRdVpWZ2dQU0IwTG5OamNtVmxibGc3SUZ4dVhIUWdJQ0FnYzNkcGNHVmZaR1YwTG1WWklEMGdkQzV6WTNKbFpXNVpPeUFnSUNCY2JseDBJQ0I5TEdaaGJITmxLVHRjYmx4MElDQmxiR1V1WVdSa1JYWmxiblJNYVhOMFpXNWxjaWduZEc5MVkyaGxibVFuTEdaMWJtTjBhVzl1S0dVcGUxeHVYSFFnSUNBZ0x5OW9iM0pwZW05dWRHRnNJR1JsZEdWamRHbHZibHh1WEhRZ0lDQWdhV1lnS0Nnb0tITjNhWEJsWDJSbGRDNWxXQ0F0SUcxcGJsOTRJRDRnYzNkcGNHVmZaR1YwTG5OWUtTQjhmQ0FvYzNkcGNHVmZaR1YwTG1WWUlDc2diV2x1WDNnZ1BDQnpkMmx3WlY5a1pYUXVjMWdwS1NBbUppQW9LSE4zYVhCbFgyUmxkQzVsV1NBOElITjNhWEJsWDJSbGRDNXpXU0FySUcxaGVGOTVLU0FtSmlBb2MzZHBjR1ZmWkdWMExuTlpJRDRnYzNkcGNHVmZaR1YwTG1WWklDMGdiV0Y0WDNrcElDWW1JQ2h6ZDJsd1pWOWtaWFF1WlZnZ1BpQXdLU2twS1NCN1hHNWNkQ0FnSUNBZ0lHbG1LSE4zYVhCbFgyUmxkQzVsV0NBK0lITjNhWEJsWDJSbGRDNXpXQ2tnWkdseVpXTWdQU0JjSW5KY0lqdGNibHgwSUNBZ0lDQWdaV3h6WlNCa2FYSmxZeUE5SUZ3aWJGd2lPMXh1WEhRZ0lDQWdmVnh1WEhRZ0lDQWdMeTkyWlhKMGFXTmhiQ0JrWlhSbFkzUnBiMjVjYmx4MElDQWdJR1ZzYzJVZ2FXWWdLQ2dvS0hOM2FYQmxYMlJsZEM1bFdTQXRJRzFwYmw5NUlENGdjM2RwY0dWZlpHVjBMbk5aS1NCOGZDQW9jM2RwY0dWZlpHVjBMbVZaSUNzZ2JXbHVYM2tnUENCemQybHdaVjlrWlhRdWMxa3BLU0FtSmlBb0tITjNhWEJsWDJSbGRDNWxXQ0E4SUhOM2FYQmxYMlJsZEM1eldDQXJJRzFoZUY5NEtTQW1KaUFvYzNkcGNHVmZaR1YwTG5OWUlENGdjM2RwY0dWZlpHVjBMbVZZSUMwZ2JXRjRYM2dwSUNZbUlDaHpkMmx3WlY5a1pYUXVaVmtnUGlBd0tTa3BLU0I3WEc1Y2RDQWdJQ0FnSUdsbUtITjNhWEJsWDJSbGRDNWxXU0ErSUhOM2FYQmxYMlJsZEM1eldTa2daR2x5WldNZ1BTQmNJbVJjSWp0Y2JseDBJQ0FnSUNBZ1pXeHpaU0JrYVhKbFl5QTlJRndpZFZ3aU8xeHVYSFFnSUNBZ2ZWeHVYRzVjZENBZ0lDQnBaaUFvWkdseVpXTWdJVDBnWENKY0lpa2dlMXh1WEhRZ0lDQWdJQ0JwWmloMGVYQmxiMllnWm5WdVl5QTlQU0FuWm5WdVkzUnBiMjRuS1NCbWRXNWpLR1ZzTEdScGNtVmpLVHRjYmx4MElDQWdJSDFjYmx4MElDQWdJR3hsZENCa2FYSmxZeUE5SUZ3aVhDSTdYRzVjZENBZ0lDQnpkMmx3WlY5a1pYUXVjMWdnUFNBd095QnpkMmx3WlY5a1pYUXVjMWtnUFNBd095QnpkMmx3WlY5a1pYUXVaVmdnUFNBd095QnpkMmx3WlY5a1pYUXVaVmtnUFNBd08xeHVYSFFnSUgwc1ptRnNjMlVwT3lBZ1hHNWNkSDFjYmx4dUx5OGdRMGhQVTBVZ1ZFaEZJRTVGV0ZRZ1UweEpSRVVnVkU4Z1UwaFBWeUJCVGtRZ1EweEpRMHNnVkVoRklGQkJSMGxPUVZSSlQwNGdRbFZVVkU5T0lGUklRVlFnVWtWTVFWUkZVeUJVVHlCSlZDNGdYRnhjWEZ4dVhHNWNkR052Ym5OMElITjNhWEJsUTI5dWRISnZiR3hsY2lBOUlDaGxiQ3dnWkNrZ1BUNGdlMXh1WEc1Y2RGeDBhV1lvWld3Z1BUMDlJQ2R6WldOMGFXOXVOQ2NwSUh0Y2JseHVYSFJjZEZ4MFkyOXVjM1FnYzJWamRHbHZialJRWVdkcGJtRjBhVzl1VEdWdVozUm9JRDBnSkNnbkxuTmxZM1JwYjI0MFVHRm5hVzVoZEc5eVFuVjBkRzl1SnlrdWJHVnVaM1JvTzF4dVhHNWNkRngwWEhScFppaGtJRDA5UFNBbmJDY3BJSHRjYmx4dVhIUmNkRngwWEhScFppaHpaV04wYVc5dU5FbGtlQ0E4SUhObFkzUnBiMjQwVUdGbmFXNWhkR2x2Ymt4bGJtZDBhQ0F0SURFcElIdGNibHgwWEhSY2RGeDBYSFJ6WldOMGFXOXVORWxrZUNzck8xeHVYSFJjZEZ4MFhIUjlJR1ZzYzJVZ2UxeHVYSFJjZEZ4MFhIUmNkSE5sWTNScGIyNDBTV1I0SUQwZ01EdGNibHgwWEhSY2RGeDBmVnh1WEhSY2RGeDBYSFJjYmx4MFhIUmNkRngwSkNnbkxuTmxZM1JwYjI0MFVHRm5hVzVoZEc5eVFuVjBkRzl1SnlsYmMyVmpkR2x2YmpSSlpIaGRMbU5zYVdOcktDazdYRzVjZEZ4MFhIUjlYRzVjZEZ4MFhIUnBaaWhrSUQwOVBTQW5jaWNwSUh0Y2JseHVYSFJjZEZ4MFhIUnBaaWh6WldOMGFXOXVORWxrZUNBK0lEQXBJSHRjYmx4MFhIUmNkRngwWEhSelpXTjBhVzl1TkVsa2VDMHRPMXh1WEhSY2RGeDBYSFI5SUdWc2MyVWdlMXh1WEhSY2RGeDBYSFJjZEhObFkzUnBiMjQwU1dSNElEMGdjMlZqZEdsdmJqUlFZV2RwYm1GMGFXOXVUR1Z1WjNSb0lDMGdNVHRjYmx4MFhIUmNkRngwZlZ4dVhHNWNkRngwWEhSY2RDUW9KeTV6WldOMGFXOXVORkJoWjJsdVlYUnZja0oxZEhSdmJpY3BXM05sWTNScGIyNDBTV1I0WFM1amJHbGpheWdwTzF4dVhIUmNkRngwZlZ4dVhIUmNkSDFjYmx4MFhIUnBaaWhsYkNBOVBUMGdKM05sWTNScGIyNHpKeWtnZTF4dVhHNWNkRngwWEhSamIyNXpkQ0J6WldOMGFXOXVNMUJoWjJsdVlYUnBiMjVNWlc1bmRHZ2dQU0FrS0NjdWMyVmpkR2x2YmpOUVlXZHBibUYwYjNKQ2RYUjBiMjRuS1M1c1pXNW5kR2c3WEc1Y2JseDBYSFJjZEdsbUtHUWdQVDA5SUNkc0p5a2dlMXh1WEc1Y2RGeDBYSFJjZEdsbUtITmxZM1JwYjI0elNXUjRJRHdnYzJWamRHbHZiak5RWVdkcGJtRjBhVzl1VEdWdVozUm9JQzBnTVNrZ2UxeHVYSFJjZEZ4MFhIUmNkSE5sWTNScGIyNHpTV1I0S3lzN1hHNWNkRngwWEhSY2RIMGdaV3h6WlNCN1hHNWNkRngwWEhSY2RGeDBjMlZqZEdsdmJqTkpaSGdnUFNBd08xeHVYSFJjZEZ4MFhIUjlYRzVjZEZ4MFhIUmNkRnh1WEhSY2RGeDBYSFFrS0NjdWMyVmpkR2x2YmpOUVlXZHBibUYwYjNKQ2RYUjBiMjRuS1Z0elpXTjBhVzl1TTBsa2VGMHVZMnhwWTJzb0tUdGNibHgwWEhSY2RIMWNibHgwWEhSY2RHbG1LR1FnUFQwOUlDZHlKeWtnZTF4dVhHNWNkRngwWEhSY2RHbG1LSE5sWTNScGIyNHpTV1I0SUQ0Z01Da2dlMXh1WEhSY2RGeDBYSFJjZEhObFkzUnBiMjR6U1dSNExTMDdYRzVjZEZ4MFhIUmNkSDBnWld4elpTQjdYRzVjZEZ4MFhIUmNkRngwYzJWamRHbHZiak5KWkhnZ1BTQnpaV04wYVc5dU0xQmhaMmx1WVhScGIyNU1aVzVuZEdnZ0xTQXhPMXh1WEhSY2RGeDBYSFI5WEc1Y2RGeDBYSFJjZEZ4dVhIUmNkRngwWEhRa0tDY3VjMlZqZEdsdmJqTlFZV2RwYm1GMGIzSkNkWFIwYjI0bktWdHpaV04wYVc5dU0wbGtlRjB1WTJ4cFkyc29LVHRjYmx4MFhIUmNkSDFjYmx4MFhIUjlYRzVjZEgxY2JseHVMeThnU1U1SlZFbEJWRVVnUms5U0lGTlhTVkJGSUVSRlZFVkRWRWxQVGlCUFRpQlRSVU5VU1U5T1V5QXpJRUZPUkNBMElFVllRMFZRVkNCSlRpQkJSRTFKVGlCUVVrVldTVVZYTGlCY1hGeGNYRzVjYmx4MGFXWW9JU1FvYkc5allYUnBiMjRwTG1GMGRISW9KMmh5WldZbktTNXBibU5zZFdSbGN5Z25hVzVrWlhndWNHaHdKeWtwSUh0Y2JseDBYSFJrWlhSbFkzUnpkMmx3WlNnbmMyVmpkR2x2YmpRbkxDQnpkMmx3WlVOdmJuUnliMnhzWlhJcE8xeHVYSFJjZEdSbGRHVmpkSE4zYVhCbEtDZHpaV04wYVc5dU15Y3NJSE4zYVhCbFEyOXVkSEp2Ykd4bGNpazdYRzVjZEgxY2JuMHBPeUpkZlE9PVxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJGVDVPUnNcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9mYWtlXzc2YjZmOWQyLmpzXCIsXCIvXCIpIl19
