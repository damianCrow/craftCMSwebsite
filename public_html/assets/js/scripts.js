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
		// CALL THE CLICK HANDLER FUNCTION AND PASS IT THE EVENT \\
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZha2VfZTRkOTkwNzUuanMiXSwibmFtZXMiOlsidGltZSIsInNlY3Rpb24zSWR4Iiwic2VjdGlvbjRJZHgiLCJtYXN0ZXJPYmoiLCJzZWN0aW9uMkN1cnJlbnRJZHgiLCJzZWN0aW9uMUN1cnJlbnRJZHgiLCJzZWN0aW9uMyIsImF1dG9tYXRlIiwiaXNBdXRvbWF0ZWQiLCJzZWN0aW9uNCIsImJhc2tldGJhbGwiLCJsb29wQW1vdW50IiwiZm9vdGJhbGwiLCJ0ZW5uaXMiLCJiYXNlYmFsbCIsImZhbiIsImhvbWVwYWdlTW9iSW1hZ2VzIiwiJCIsImRvY3VtZW50IiwicmVhZHkiLCJ3aW5kb3ciLCJpbm5lcldpZHRoIiwiZmV0Y2giLCJ0aGVuIiwicmVzcG9uc2UiLCJqc29uIiwic3ByaXRlT2JqIiwiSWRsZUZyYW1lIiwiZmlsdGVyQnlWYWx1ZSIsImZyYW1lcyIsImFuaW1hdGlvbkFycmF5IiwiYW5pbWF0b3JTZXR1cCIsImltYWdlQ29udHJvbGVyIiwic2V0SW50ZXJ2YWwiLCJhcnJheSIsInN0cmluZyIsImZpbHRlciIsIm8iLCJ0b0xvd2VyQ2FzZSIsImluY2x1ZGVzIiwibGFzdFRpbWUiLCJ2ZW5kb3JzIiwieCIsImxlbmd0aCIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwiY2FsbGJhY2siLCJlbGVtZW50IiwiY3VyclRpbWUiLCJEYXRlIiwiZ2V0VGltZSIsInRpbWVUb0NhbGwiLCJNYXRoIiwibWF4IiwiaWQiLCJzZXRUaW1lb3V0IiwiY2xlYXJUaW1lb3V0IiwiYW5pbWF0b3IiLCJhbmltYXRpb25PYmoiLCJkYW5jaW5nSWNvbiIsInNwcml0ZUltYWdlIiwiY2FudmFzIiwiZ2FtZUxvb3AiLCJhZGRDbGFzcyIsImxvb3BJZCIsInVwZGF0ZSIsInJlbmRlciIsInNwcml0ZSIsIm9wdGlvbnMiLCJ0aGF0IiwiZnJhbWVJbmRleCIsInRpY2tDb3VudCIsImxvb3BDb3VudCIsInRpY2tzUGVyRnJhbWUiLCJudW1iZXJPZkZyYW1lcyIsImNvbnRleHQiLCJ3aWR0aCIsImhlaWdodCIsImltYWdlIiwibG9vcHMiLCJjbGVhclJlY3QiLCJkcmF3SW1hZ2UiLCJmcmFtZSIsInkiLCJnZXRFbGVtZW50QnlJZCIsIkltYWdlIiwiZ2V0Q29udGV4dCIsImFkZEV2ZW50TGlzdGVuZXIiLCJzcmMiLCJwYWdlTG9hZGVyIiwiaW5kZXgiLCJyZW1vdmVDbGFzcyIsImZpbmQiLCJnZXQiLCJjbGljayIsImluaXRpYWxpemVTZWN0aW9uIiwic2VjdGlvbk51bWJlciIsImlkeCIsInNpYmxpbmdzIiwibWFwIiwiaXgiLCJlbGUiLCJjc3MiLCJvcGFjaXR5IiwiaWR4T2JqIiwicmVsZXZhbnRBbmltYXRpb24iLCJoYW5kbGVQYW5pbmF0aW9uQnV0dG9uQ2xpY2siLCJlIiwicGFyc2VJbnQiLCJ0YXJnZXQiLCJhdHRyIiwic2VjdGlvbklkIiwiY2xvc2VzdCIsInJlbGV2YW50RGF0YUFycmF5Iiwib24iLCJlcyIsImN1cnJlbnRUYXJnZXQiLCJpbnRlcnZhbE1hbmFnZXIiLCJsb2NhdGlvbiIsIm9uZXBhZ2Vfc2Nyb2xsIiwic2VjdGlvbkNvbnRhaW5lciIsImVhc2luZyIsImFuaW1hdGlvblRpbWUiLCJwYWdpbmF0aW9uIiwidXBkYXRlVVJMIiwiYmVmb3JlTW92ZSIsImFmdGVyTW92ZSIsImxvb3AiLCJrZXlib2FyZCIsInJlc3BvbnNpdmVGYWxsYmFjayIsImRpcmVjdGlvbiIsIm1vdmVUbyIsImN1cnJlbnRTZWN0aW9uIiwiaGFzQ2xhc3MiLCJzZWN0aW9uIiwib2Zmc2V0IiwidG9wIiwibW92ZURvd24iLCJoaWRlTG9hZGluZ0FuaW1hdGlvbiIsInJlYWR5U3RhdGUiLCJmbGFnIiwic3dpcGVDb250cm9sbGVyIiwiY2xlYXJJbnRlcnZhbCIsInBsYXkiLCJ0aW1lb3V0IiwicGF1c2UiLCJpbm5lckhlaWdodCIsIm1hdGNoTWVkaWEiLCJtYXRjaGVzIiwicGFnZUlkeCIsImJ1cmdlciIsImNsYXNzTGlzdCIsImNvbnRhaW5zIiwibmF2IiwicmVtb3ZlIiwiYm9keSIsInN0eWxlIiwicG9zaXRpb24iLCJzdG9wUHJvcGFnYXRpb24iLCJuYXZDb250cm9sIiwiYWRkIiwiZGV0ZWN0c3dpcGUiLCJlbCIsImZ1bmMiLCJzd2lwZV9kZXQiLCJzWCIsInNZIiwiZVgiLCJlWSIsIm1pbl94IiwibWF4X3giLCJtaW5feSIsIm1heF95IiwiZGlyZWMiLCJ0IiwidG91Y2hlcyIsInNjcmVlblgiLCJzY3JlZW5ZIiwicHJldmVudERlZmF1bHQiLCJkIiwic2VjdGlvbjRQYWdpbmF0aW9uTGVuZ3RoIiwic2VjdGlvbjNQYWdpbmF0aW9uTGVuZ3RoIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsSUFBTUEsT0FBTyxHQUFiO0FBQ0EsSUFBSUMsY0FBYyxDQUFsQjtBQUNBLElBQUlDLGNBQWMsQ0FBbEI7O0FBRUEsSUFBTUMsWUFBWTtBQUNqQkMscUJBQW9CLENBREg7QUFFakJDLHFCQUFvQixDQUZIO0FBR2pCQyxXQUFVO0FBQ1RDLFlBQVUsRUFERDtBQUVUQyxlQUFhO0FBRkosRUFITztBQU9qQkMsV0FBVTtBQUNURixZQUFVLEVBREQ7QUFFVEMsZUFBYTtBQUZKLEVBUE87QUFXakJFLGFBQVksRUFBQ0MsWUFBWSxDQUFiLEVBWEs7QUFZakJDLFdBQVUsRUFBQ0QsWUFBWSxDQUFiLEVBWk87QUFhakJFLFNBQVEsRUFBQ0YsWUFBWSxDQUFiLEVBYlM7QUFjakJHLFdBQVUsRUFBQ0gsWUFBWSxDQUFiLEVBZE87QUFlakJJLE1BQUssRUFBQ0osWUFBWSxDQUFiO0FBZlksQ0FBbEI7O0FBa0JBLElBQU1LLG9CQUFvQixDQUN6QiwwQ0FEeUIsRUFFekIsd0NBRnlCLEVBR3pCLHNDQUh5QixFQUl6Qix3Q0FKeUIsRUFLekIsbUNBTHlCLENBQTFCOztBQVFBQyxFQUFFQyxRQUFGLEVBQVlDLEtBQVosQ0FBa0IsWUFBTTtBQUN2QixLQUFHQyxPQUFPQyxVQUFQLEdBQW9CLEdBQXZCLEVBQTRCO0FBQzdCO0FBQ0VDLFFBQU0sdUNBQU4sRUFBK0NDLElBQS9DLENBQW9ELFVBQVNDLFFBQVQsRUFBbUI7QUFDdEUsVUFBT0EsU0FBU0MsSUFBVCxFQUFQO0FBQ0EsR0FGRCxFQUVHRixJQUZILENBRVEsVUFBU0csU0FBVCxFQUFvQjtBQUMzQixPQUFNQyxZQUFZQyxjQUFjRixVQUFVRyxNQUF4QixFQUFnQyxNQUFoQyxDQUFsQjtBQUNBMUIsYUFBVVMsUUFBVixDQUFtQmtCLGNBQW5CLGdDQUF3Q0gsU0FBeEMsc0JBQXNEQyxjQUFjRixVQUFVRyxNQUF4QixFQUFnQyxVQUFoQyxDQUF0RDtBQUNBMUIsYUFBVVUsTUFBVixDQUFpQmlCLGNBQWpCLGdDQUFzQ0gsU0FBdEMsc0JBQW9EQyxjQUFjRixVQUFVRyxNQUF4QixFQUFnQyxRQUFoQyxDQUFwRDtBQUNBMUIsYUFBVVcsUUFBVixDQUFtQmdCLGNBQW5CLGdDQUF3Q0gsU0FBeEMsc0JBQXNEQyxjQUFjRixVQUFVRyxNQUF4QixFQUFnQyxVQUFoQyxDQUF0RDtBQUNBMUIsYUFBVU8sVUFBVixDQUFxQm9CLGNBQXJCLGdDQUEwQ0gsU0FBMUMsc0JBQXdEQyxjQUFjRixVQUFVRyxNQUF4QixFQUFnQyxRQUFoQyxDQUF4RDtBQUNBMUIsYUFBVVksR0FBVixDQUFjZSxjQUFkLGdDQUFtQ0gsU0FBbkMsc0JBQWlEQyxjQUFjRixVQUFVRyxNQUF4QixFQUFnQyxLQUFoQyxDQUFqRDtBQUNIO0FBQ0dFO0FBQ0FDLGtCQUFlN0IsU0FBZixFQUEwQixDQUExQjtBQUNIO0FBQ0c4QixlQUFZLFlBQU07QUFDakJELG1CQUFlN0IsU0FBZixFQUEwQixDQUExQjtBQUNBLElBRkQsRUFFRyxJQUZIO0FBR0EsR0FoQkQ7QUFpQkE7QUFDRjtBQUNDLEtBQU15QixnQkFBZ0IsU0FBaEJBLGFBQWdCLENBQUNNLEtBQUQsRUFBUUMsTUFBUixFQUFtQjtBQUN0QyxTQUFPRCxNQUFNRSxNQUFOLENBQWE7QUFBQSxVQUFLLE9BQU9DLEVBQUUsVUFBRixDQUFQLEtBQXlCLFFBQXpCLElBQXFDQSxFQUFFLFVBQUYsRUFBY0MsV0FBZCxHQUE0QkMsUUFBNUIsQ0FBcUNKLE9BQU9HLFdBQVAsRUFBckMsQ0FBMUM7QUFBQSxHQUFiLENBQVA7QUFDRixFQUZEO0FBR0Q7QUFDQyxLQUFNUCxnQkFBZ0IsU0FBaEJBLGFBQWdCLEdBQU07O0FBRXpCLE1BQUlTLFdBQVcsQ0FBZjtBQUNBLE1BQUlDLFVBQVUsQ0FBQyxJQUFELEVBQU8sS0FBUCxFQUFjLFFBQWQsRUFBd0IsR0FBeEIsQ0FBZDtBQUNBLE9BQUksSUFBSUMsSUFBSSxDQUFaLEVBQWVBLElBQUlELFFBQVFFLE1BQVosSUFBc0IsQ0FBQ3ZCLE9BQU93QixxQkFBN0MsRUFBb0UsRUFBRUYsQ0FBdEUsRUFBeUU7QUFDdkV0QixVQUFPd0IscUJBQVAsR0FBK0J4QixPQUFPcUIsUUFBUUMsQ0FBUixJQUFXLHVCQUFsQixDQUEvQjtBQUNBdEIsVUFBT3lCLG9CQUFQLEdBQThCekIsT0FBT3FCLFFBQVFDLENBQVIsSUFBVyxzQkFBbEIsS0FBNkN0QixPQUFPcUIsUUFBUUMsQ0FBUixJQUFXLDZCQUFsQixDQUEzRTtBQUNEOztBQUVELE1BQUksQ0FBQ3RCLE9BQU93QixxQkFBWixFQUNFeEIsT0FBT3dCLHFCQUFQLEdBQStCLFVBQVNFLFFBQVQsRUFBbUJDLE9BQW5CLEVBQTRCO0FBQ3pELE9BQUlDLFdBQVcsSUFBSUMsSUFBSixHQUFXQyxPQUFYLEVBQWY7QUFDQSxPQUFJQyxhQUFhQyxLQUFLQyxHQUFMLENBQVMsQ0FBVCxFQUFZLE1BQU1MLFdBQVdSLFFBQWpCLENBQVosQ0FBakI7QUFDQSxPQUFJYyxLQUFLbEMsT0FBT21DLFVBQVAsQ0FBa0IsWUFBVztBQUFFVCxhQUFTRSxXQUFXRyxVQUFwQjtBQUFrQyxJQUFqRSxFQUNQQSxVQURPLENBQVQ7QUFFQVgsY0FBV1EsV0FBV0csVUFBdEI7QUFDQSxVQUFPRyxFQUFQO0FBQ0QsR0FQRDs7QUFTRixNQUFJLENBQUNsQyxPQUFPeUIsb0JBQVosRUFDQXpCLE9BQU95QixvQkFBUCxHQUE4QixVQUFTUyxFQUFULEVBQWE7QUFDekNFLGdCQUFhRixFQUFiO0FBQ0QsR0FGRDtBQUdGLEVBdkJEOztBQTBCQSxLQUFNRyxXQUFXLFNBQVhBLFFBQVcsQ0FBQ0MsWUFBRCxFQUFrQjs7QUFFbEMsTUFBSUMsV0FBSixFQUNDQyxXQURELEVBRUNDLE1BRkQ7QUFHRjtBQUNFLFdBQVNDLFFBQVQsR0FBcUI7QUFDbkI3QyxLQUFFLFVBQUYsRUFBYzhDLFFBQWQsQ0FBdUIsUUFBdkI7QUFDQUwsZ0JBQWFNLE1BQWIsR0FBc0I1QyxPQUFPd0IscUJBQVAsQ0FBNkJrQixRQUE3QixDQUF0QjtBQUNBSCxlQUFZTSxNQUFaO0FBQ0FOLGVBQVlPLE1BQVo7QUFDRDs7QUFFRCxXQUFTQyxNQUFULENBQWlCQyxPQUFqQixFQUEwQjs7QUFFekIsT0FBSUMsT0FBTyxFQUFYO0FBQUEsT0FDQ0MsYUFBYSxDQURkO0FBQUEsT0FFQ0MsWUFBWSxDQUZiO0FBQUEsT0FHQ0MsWUFBWSxDQUhiO0FBQUEsT0FJQ0MsZ0JBQWdCTCxRQUFRSyxhQUFSLElBQXlCLENBSjFDO0FBQUEsT0FLQ0MsaUJBQWlCTixRQUFRTSxjQUFSLElBQTBCLENBTDVDOztBQU9BTCxRQUFLTSxPQUFMLEdBQWVQLFFBQVFPLE9BQXZCO0FBQ0FOLFFBQUtPLEtBQUwsR0FBYVIsUUFBUVEsS0FBckI7QUFDQVAsUUFBS1EsTUFBTCxHQUFjVCxRQUFRUyxNQUF0QjtBQUNBUixRQUFLUyxLQUFMLEdBQWFWLFFBQVFVLEtBQXJCO0FBQ0FULFFBQUtVLEtBQUwsR0FBYVgsUUFBUVcsS0FBckI7O0FBRUFWLFFBQUtKLE1BQUwsR0FBYyxZQUFZOztBQUVyQk0saUJBQWEsQ0FBYjs7QUFFQSxRQUFJQSxZQUFZRSxhQUFoQixFQUErQjs7QUFFbENGLGlCQUFZLENBQVo7QUFDSztBQUNBLFNBQUlELGFBQWFJLGlCQUFpQixDQUFsQyxFQUFxQztBQUNyQztBQUNFSixvQkFBYyxDQUFkO0FBQ0QsTUFIRCxNQUdPO0FBQ1BFO0FBQ0VGLG1CQUFhLENBQWI7O0FBRUEsVUFBR0UsY0FBY0gsS0FBS1UsS0FBdEIsRUFBNkI7QUFDNUIzRCxjQUFPeUIsb0JBQVAsQ0FBNEJhLGFBQWFNLE1BQXpDO0FBQ0E7QUFDRjtBQUNIO0FBQ0YsSUFwQkg7O0FBc0JBSyxRQUFLSCxNQUFMLEdBQWMsWUFBWTs7QUFFeEI7QUFDQUcsU0FBS00sT0FBTCxDQUFhSyxTQUFiLENBQXVCLENBQXZCLEVBQTBCLENBQTFCLEVBQTZCWCxLQUFLTyxLQUFsQyxFQUF5Q1AsS0FBS1EsTUFBOUM7O0FBRUFSLFNBQUtNLE9BQUwsQ0FBYU0sU0FBYixDQUNFWixLQUFLUyxLQURQLEVBRUVwQixhQUFhNUIsY0FBYixDQUE0QndDLFVBQTVCLEVBQXdDWSxLQUF4QyxDQUE4Q3hDLENBRmhELEVBR0VnQixhQUFhNUIsY0FBYixDQUE0QndDLFVBQTVCLEVBQXdDWSxLQUF4QyxDQUE4Q0MsQ0FIaEQsRUFJRSxHQUpGLEVBS0UsR0FMRixFQU1FLENBTkYsRUFPRSxDQVBGLEVBUUUvRCxPQUFPQyxVQUFQLEdBQW9CLEtBUnRCLEVBU0VELE9BQU9DLFVBQVAsR0FBb0IsR0FUdEI7QUFVRCxJQWZEOztBQWlCQSxVQUFPZ0QsSUFBUDtBQUNBOztBQUVEO0FBQ0FSLFdBQVMzQyxTQUFTa0UsY0FBVCxDQUF3QixRQUF4QixDQUFUO0FBQ0F2QixTQUFPZSxLQUFQLEdBQWV4RCxPQUFPQyxVQUFQLEdBQW9CLEtBQW5DO0FBQ0F3QyxTQUFPZ0IsTUFBUCxHQUFnQnpELE9BQU9DLFVBQVAsR0FBb0IsR0FBcEM7O0FBRUE7QUFDQXVDLGdCQUFjLElBQUl5QixLQUFKLEVBQWQ7O0FBRUE7QUFDQTFCLGdCQUFjUSxPQUFPO0FBQ3BCUSxZQUFTZCxPQUFPeUIsVUFBUCxDQUFrQixJQUFsQixDQURXO0FBRXBCVixVQUFPLElBRmE7QUFHcEJDLFdBQVEsSUFIWTtBQUlwQkMsVUFBT2xCLFdBSmE7QUFLcEJjLG1CQUFnQmhCLGFBQWE1QixjQUFiLENBQTRCYSxNQUx4QjtBQU1wQjhCLGtCQUFlLENBTks7QUFPcEJNLFVBQU9yQixhQUFhL0M7QUFQQSxHQUFQLENBQWQ7O0FBVUE7QUFDQWlELGNBQVkyQixnQkFBWixDQUE2QixNQUE3QixFQUFxQ3pCLFFBQXJDO0FBQ0FGLGNBQVk0QixHQUFaLEdBQWtCLDBDQUFsQjtBQUNBLEVBNUZEOztBQThGRDs7QUFFQyxLQUFNQyxhQUFhLFNBQWJBLFVBQWEsQ0FBQ0MsS0FBRCxFQUFXO0FBQzdCLE1BQUdBLFVBQVUsQ0FBYixFQUFnQjtBQUNmekUsS0FBRSxPQUFGLEVBQVcwRSxXQUFYLENBQXVCLFlBQXZCO0FBQ0ExRSxLQUFFLG9CQUFGLEVBQXdCMEUsV0FBeEIsQ0FBb0MsaUJBQXBDO0FBQ0ExRSxLQUFFLFdBQUYsRUFBZTJFLElBQWYsQ0FBb0IsVUFBcEIsRUFBZ0M3QixRQUFoQyxDQUF5QyxhQUF6QztBQUNBOUMsS0FBRSxhQUFGLEVBQWlCOEMsUUFBakIsQ0FBMEIsaUJBQTFCO0FBQ0E5QyxLQUFFLGFBQUYsRUFBaUIyRSxJQUFqQixDQUFzQixPQUF0QixFQUErQjdCLFFBQS9CLENBQXdDLFlBQXhDO0FBQ0E5QyxLQUFFLFdBQUYsRUFBZTJFLElBQWYsQ0FBb0IsY0FBcEIsRUFBb0M3QixRQUFwQyxDQUE2QyxNQUE3QztBQUNBUixjQUFXLFlBQU07QUFDaEJ0QyxNQUFFLDRCQUFGLEVBQWdDMkUsSUFBaEMsQ0FBcUMsVUFBckMsRUFBaUQ3QixRQUFqRCxDQUEwRCxRQUExRDtBQUNBLElBRkQsRUFFRyxJQUZIO0FBR0EsR0FWRCxNQVdLO0FBQ0o5QyxLQUFFLE9BQUYsRUFBVzBFLFdBQVgsQ0FBdUIsWUFBdkI7QUFDQTFFLEtBQUUsYUFBRixFQUFpQjBFLFdBQWpCLENBQTZCLGlCQUE3QjtBQUNBMUUseUNBQW9DeUUsS0FBcEMsa0JBQXdEQyxXQUF4RCxDQUFvRSxpQkFBcEU7QUFDQTFFLHdCQUFxQjJFLElBQXJCLHVCQUFnRDdCLFFBQWhELENBQXlELGlCQUF6RDtBQUNBOUMsdUJBQW9CMkUsSUFBcEIsQ0FBeUIsT0FBekIsRUFBa0M3QixRQUFsQyxDQUEyQyxZQUEzQzs7QUFFQSxPQUFHOUMsZUFBYXlFLEtBQWIsc0JBQXFDL0MsTUFBckMsSUFBK0MxQixlQUFheUUsS0FBYiw2QkFBNEMvQyxNQUE1QyxHQUFxRCxDQUF2RyxFQUEwRztBQUN6RzFCLG1CQUFheUUsS0FBYixzQkFBcUNHLEdBQXJDLENBQXlDLENBQXpDLEVBQTRDQyxLQUE1QztBQUNBO0FBQ0Q7QUFDRCxFQXZCRDs7QUF5QkQ7O0FBRUMsS0FBTUMsb0JBQW9CLFNBQXBCQSxpQkFBb0IsQ0FBQ0MsYUFBRCxFQUFnQkMsR0FBaEIsRUFBd0I7QUFDakRoRixpQkFBYStFLGFBQWIsa0JBQXVDQyxHQUF2QyxFQUE4Q0MsUUFBOUMsQ0FBdUQsb0JBQXZELEVBQTZFQyxHQUE3RSxDQUFpRixVQUFDQyxFQUFELEVBQUtDLEdBQUwsRUFBYTtBQUM3RnBGLEtBQUVvRixHQUFGLEVBQU9DLEdBQVAsQ0FBVyxFQUFDQyxTQUFTLENBQVYsRUFBWDtBQUNBLEdBRkQ7O0FBSUF0RixpQkFBYStFLGFBQWIsa0JBQXVDQyxHQUF2QyxFQUE4Q0ssR0FBOUMsQ0FBa0Q7QUFDakQsZ0JBQWEsWUFEb0M7QUFFakQsY0FBVztBQUZzQyxHQUFsRDtBQUlBLEVBVEQ7O0FBV0Q7QUFDQ1AsbUJBQWtCLENBQWxCLEVBQXFCLENBQXJCO0FBQ0FBLG1CQUFrQixDQUFsQixFQUFxQixDQUFyQjtBQUNBQSxtQkFBa0IsQ0FBbEIsRUFBcUIsQ0FBckI7O0FBRUQ7O0FBRUMsS0FBTS9ELGlCQUFpQixTQUFqQkEsY0FBaUIsQ0FBQ3dFLE1BQUQsRUFBU1IsYUFBVCxFQUEyQjtBQUNqRCxNQUFJUywwQkFBSjs7QUFFQSxNQUFHVCxrQkFBa0IsQ0FBckIsRUFBd0I7QUFDdkIsV0FBT1EsT0FBT25HLGtCQUFkO0FBQ0MsU0FBSyxDQUFMO0FBQ0NvRyx5QkFBb0J0RyxVQUFVTyxVQUE5QjtBQUNEO0FBQ0EsU0FBSyxDQUFMO0FBQ0MrRix5QkFBb0J0RyxVQUFVUyxRQUE5QjtBQUNEO0FBQ0EsU0FBSyxDQUFMO0FBQ0M2Rix5QkFBb0J0RyxVQUFVVSxNQUE5QjtBQUNEO0FBQ0EsU0FBSyxDQUFMO0FBQ0M0Rix5QkFBb0J0RyxVQUFVVyxRQUE5QjtBQUNEO0FBQ0EsU0FBSyxDQUFMO0FBQ0MyRix5QkFBb0J0RyxVQUFVWSxHQUE5QjtBQUNEO0FBZkQ7QUFpQkE7O0FBRURFLGlCQUFhK0UsYUFBYixFQUE4QkosSUFBOUIsQ0FBbUMsT0FBbkMsRUFBNENELFdBQTVDLENBQXdELFlBQXhEO0FBQ0ExRSxpQkFBYStFLGFBQWIsa0JBQXVDUSxtQkFBaUJSLGFBQWpCLGdCQUF2QyxFQUFzRkwsV0FBdEYsQ0FBa0csaUJBQWxHO0FBQ0FJLG9CQUFrQkMsYUFBbEIsRUFBaUNRLG1CQUFpQlIsYUFBakIsZ0JBQWpDOztBQUVBekMsYUFBVyxZQUFNO0FBQ2hCLE9BQUd5QyxrQkFBa0IsQ0FBckIsRUFBd0I7QUFDdkJ2QyxhQUFTZ0QsaUJBQVQ7QUFDQTs7QUFFRHhGLGtCQUFhK0UsYUFBYixFQUE4QkosSUFBOUIsdUJBQXlEN0IsUUFBekQsQ0FBa0UsaUJBQWxFO0FBQ0E5QyxrQkFBYStFLGFBQWIsRUFBOEJKLElBQTlCLENBQW1DLE9BQW5DLEVBQTRDN0IsUUFBNUMsQ0FBcUQsWUFBckQ7QUFDQSxHQVBELEVBT0csR0FQSDs7QUFTQSxNQUFHeUMsbUJBQWlCUixhQUFqQixxQkFBZ0QvRSxlQUFhK0UsYUFBYixFQUE4QkosSUFBOUIsdUJBQXlEakQsTUFBekQsR0FBa0UsQ0FBckgsRUFBd0g7QUFDdkg2RCxzQkFBaUJSLGFBQWpCLG1CQUE4QyxDQUE5QztBQUNBLEdBRkQsTUFFTztBQUNOUSxzQkFBaUJSLGFBQWpCLG9CQUErQyxDQUEvQztBQUNBO0FBQ0QsRUF6Q0Q7QUEwQ0Q7QUFDQ2hFLGdCQUFlN0IsU0FBZixFQUEwQixDQUExQjs7QUFFRDtBQUNDOEIsYUFBWSxZQUFNO0FBQ2pCRCxpQkFBZTdCLFNBQWYsRUFBMEIsQ0FBMUI7QUFDQSxFQUZELEVBRUcsS0FGSDs7QUFJRDs7QUFFQyxLQUFNdUcsOEJBQThCLFNBQTlCQSwyQkFBOEIsQ0FBQ0MsQ0FBRCxFQUFPOztBQUUxQyxNQUFNVixNQUFNVyxTQUFTM0YsRUFBRTBGLEVBQUVFLE1BQUosRUFBWUMsSUFBWixDQUFpQixZQUFqQixDQUFULENBQVo7QUFDQSxNQUFNQyxZQUFZOUYsRUFBRTBGLEVBQUVFLE1BQUosRUFBWUcsT0FBWixDQUFvQixTQUFwQixFQUErQkYsSUFBL0IsQ0FBb0MsSUFBcEMsQ0FBbEI7QUFDQSxNQUFJRywwQkFBSjs7QUFFQSxNQUFHRixjQUFjLFVBQWpCLEVBQTZCO0FBQzVCOUcsaUJBQWNnRyxHQUFkO0FBQ0E7O0FBRUQsTUFBR2MsY0FBYyxVQUFqQixFQUE2QjtBQUM1QjdHLGlCQUFjK0YsR0FBZDtBQUNBOztBQUVEaEYsVUFBTThGLFNBQU4sRUFBbUJuQixJQUFuQixDQUF3QixPQUF4QixFQUFpQ0QsV0FBakMsQ0FBNkMsWUFBN0M7QUFDQTFFLFVBQU04RixTQUFOLEVBQW1CbkIsSUFBbkIsQ0FBd0IsY0FBeEIsRUFBd0NELFdBQXhDLENBQW9ELE1BQXBEO0FBQ0ExRSxVQUFNOEYsU0FBTixFQUFtQm5CLElBQW5CLGtCQUF1Q0ssR0FBdkMsRUFBOENsQyxRQUE5QyxDQUF1RCxNQUF2RDtBQUNBOUMsVUFBTThGLFNBQU4sa0JBQTRCZCxHQUE1QixFQUFtQ04sV0FBbkMsQ0FBK0MsaUJBQS9DO0FBQ0ExRSxVQUFNOEYsU0FBTixzQkFBa0NwQixXQUFsQyxDQUE4QyxRQUE5QztBQUNBMUUsSUFBRTBGLEVBQUVFLE1BQUosRUFBWTlDLFFBQVosQ0FBcUIsUUFBckI7O0FBRUFnQyxvQkFBa0JhLFNBQVMzRixRQUFNOEYsU0FBTixFQUFtQkQsSUFBbkIsQ0FBd0IsWUFBeEIsQ0FBVCxDQUFsQixFQUFtRWIsR0FBbkU7O0FBRUExQyxhQUFXLFlBQU07QUFDaEJrQyxjQUFXbUIsU0FBUzNGLFFBQU04RixTQUFOLEVBQW1CRCxJQUFuQixDQUF3QixZQUF4QixDQUFULENBQVg7QUFDQSxHQUZELEVBRUcsR0FGSDs7QUFJQSxNQUFHQyxjQUFjLFVBQWpCLEVBQTRCO0FBQzNCOUYsV0FBTThGLFNBQU4sRUFBbUJuQixJQUFuQixDQUF3QixhQUF4QixFQUF1QzdCLFFBQXZDLENBQWdELFFBQWhEO0FBQ0E5QyxXQUFNOEYsU0FBTixFQUFtQkcsRUFBbkIsQ0FBc0Isa0RBQXRCLEVBQTBFLFVBQUNDLEVBQUQsRUFBUTtBQUMvRWxHLFlBQU04RixTQUFOLEVBQW1CbkIsSUFBbkIsQ0FBd0IsYUFBeEIsRUFBdUNELFdBQXZDLENBQW1ELFFBQW5EO0FBQ0YsSUFGRDtBQUdBO0FBQ0QsRUFqQ0Q7O0FBbUNEOztBQUVDMUUsR0FBRSxvREFBRixFQUF3RDZFLEtBQXhELENBQThELFVBQUNhLENBQUQsRUFBTzs7QUFFcEUsTUFBR3hHLFVBQVVjLEVBQUUwRixFQUFFUyxhQUFKLEVBQW1CSixPQUFuQixDQUEyQixTQUEzQixFQUFzQ0YsSUFBdEMsQ0FBMkMsSUFBM0MsQ0FBVixFQUE0RHRHLFdBQS9ELEVBQTRFO0FBQzlFO0FBQ0c2RyxtQkFBZ0IsS0FBaEIsRUFBdUJwRyxFQUFFMEYsRUFBRVMsYUFBSixFQUFtQkosT0FBbkIsQ0FBMkIsU0FBM0IsRUFBc0NGLElBQXRDLENBQTJDLElBQTNDLENBQXZCO0FBQ0g7QUFDR08sbUJBQWdCLElBQWhCLEVBQXNCcEcsRUFBRTBGLEVBQUVTLGFBQUosRUFBbUJKLE9BQW5CLENBQTJCLFNBQTNCLEVBQXNDRixJQUF0QyxDQUEyQyxJQUEzQyxDQUF0QixFQUF3RSxJQUF4RTtBQUNBO0FBQ0g7QUFDRUosOEJBQTRCQyxDQUE1QjtBQUNBLEVBVkQ7O0FBWUQ7O0FBRUMsS0FBRyxDQUFDMUYsRUFBRXFHLFFBQUYsRUFBWVIsSUFBWixDQUFpQixNQUFqQixFQUF5QnZFLFFBQXpCLENBQWtDLFdBQWxDLENBQUosRUFBb0Q7QUFDbkR0QixJQUFFLGtCQUFGLEVBQXNCc0csY0FBdEIsQ0FBcUM7QUFDcENDLHFCQUFrQixTQURrQjtBQUVwQ0MsV0FBUSxVQUY0QjtBQUdwQ0Msa0JBQWUxSCxJQUhxQjtBQUlwQzJILGVBQVksSUFKd0I7QUFLcENDLGNBQVcsSUFMeUI7QUFNcENDLGVBQVksb0JBQUNuQyxLQUFELEVBQVcsQ0FBRSxDQU5XO0FBT3BDb0MsY0FBVyxtQkFBQ3BDLEtBQUQsRUFBVztBQUN6Qjs7QUFFSUQsZUFBV0MsS0FBWDtBQUNBLElBWG1DO0FBWXBDcUMsU0FBTSxLQVo4QjtBQWFwQ0MsYUFBVSxJQWIwQjtBQWNwQ0MsdUJBQW9CLEtBZGdCO0FBZXBDQyxjQUFXO0FBZnlCLEdBQXJDOztBQWtCQWpILElBQUUsa0JBQUYsRUFBc0JrSCxNQUF0QixDQUE2QixDQUE3QjtBQUNBOztBQUVGOztBQUVDbEgsR0FBRSxZQUFGLEVBQWdCNkUsS0FBaEIsQ0FBc0IsVUFBQ2EsQ0FBRCxFQUFPO0FBQzVCLE1BQUl5QixpQkFBaUJuSCxFQUFFMEYsRUFBRUUsTUFBSixFQUFZRyxPQUFaLENBQW9CL0YsRUFBRSxhQUFGLENBQXBCLENBQXJCOztBQUVBLE1BQUdtSCxlQUFlQyxRQUFmLENBQXdCLE1BQXhCLENBQUgsRUFBb0M7QUFDbkNELGtCQUFlekMsV0FBZixDQUEyQixNQUEzQjtBQUNBeUMsa0JBQWV4QyxJQUFmLENBQW9CLFlBQXBCLEVBQWtDRCxXQUFsQyxDQUE4QyxRQUE5QztBQUNBeUMsa0JBQWVsQyxRQUFmLENBQXdCLGFBQXhCLEVBQXVDQyxHQUF2QyxDQUEyQyxVQUFDRixHQUFELEVBQU1xQyxPQUFOLEVBQWtCO0FBQzVEckgsTUFBRXFILE9BQUYsRUFBVzNDLFdBQVgsQ0FBdUIsUUFBdkI7QUFDQTFFLE1BQUVxSCxPQUFGLEVBQVcxQyxJQUFYLENBQWdCLE9BQWhCLEVBQXlCRCxXQUF6QixDQUFxQyxTQUFyQyxFQUFnRDVCLFFBQWhELENBQXlELFlBQXpEO0FBQ0EsSUFIRDtBQUlBLEdBUEQsTUFPTztBQUNOcUUsa0JBQWV6QyxXQUFmLENBQTJCLFFBQTNCLEVBQXFDNUIsUUFBckMsQ0FBOEMsTUFBOUM7QUFDQXFFLGtCQUFlbEIsRUFBZixDQUFrQixrREFBbEIsRUFBc0UsVUFBQ0MsRUFBRCxFQUFRO0FBQzNFbEcsTUFBRSxrQkFBRixFQUFzQjJFLElBQXRCLENBQTJCLFlBQTNCLEVBQXlDN0IsUUFBekMsQ0FBa0QsUUFBbEQ7QUFDRixJQUZEO0FBR0FxRSxrQkFBZWxDLFFBQWYsQ0FBd0IsYUFBeEIsRUFBdUNDLEdBQXZDLENBQTJDLFVBQUNGLEdBQUQsRUFBTXFDLE9BQU4sRUFBa0I7QUFDNURySCxNQUFFcUgsT0FBRixFQUFXM0MsV0FBWCxDQUF1QixNQUF2QixFQUErQjVCLFFBQS9CLENBQXdDLFFBQXhDO0FBQ0E5QyxNQUFFcUgsT0FBRixFQUFXMUMsSUFBWCxDQUFnQixPQUFoQixFQUF5QkQsV0FBekIsQ0FBcUMsWUFBckMsRUFBbUQ1QixRQUFuRCxDQUE0RCxTQUE1RDtBQUNBOUMsTUFBRXFILE9BQUYsRUFBVzFDLElBQVgsQ0FBZ0IsWUFBaEIsRUFBOEJELFdBQTlCLENBQTBDLFFBQTFDO0FBQ0EsSUFKRDtBQUtBO0FBQ0R5QyxpQkFBZXhDLElBQWYsQ0FBb0IsT0FBcEIsRUFBNkJELFdBQTdCLENBQXlDLFNBQXpDLEVBQW9ENUIsUUFBcEQsQ0FBNkQsWUFBN0Q7QUFDQSxFQXRCRDs7QUF3QkQ7O0FBRUM5QyxHQUFFLFlBQUYsRUFBZ0I2RSxLQUFoQixDQUFzQixZQUFNO0FBQzNCLE1BQUc3RSxFQUFFRyxNQUFGLEVBQVV5RCxNQUFWLE1BQXNCNUQsRUFBRSxPQUFGLEVBQVcwQixNQUFYLEdBQW9CLENBQTFDLE1BQWlELENBQUUxQixFQUFFLGtCQUFGLEVBQXNCc0gsTUFBdEIsR0FBK0JDLEdBQXJGLEVBQTBGO0FBQzVGO0FBQ0l2SCxLQUFFLGtCQUFGLEVBQXNCa0gsTUFBdEIsQ0FBNkIsQ0FBN0I7QUFDRCxHQUhELE1BR087QUFDTmxILEtBQUUsa0JBQUYsRUFBc0J3SCxRQUF0QjtBQUNBO0FBQ0QsRUFQRDs7QUFTRDs7QUFFQyxLQUFNQyx1QkFBdUIsU0FBdkJBLG9CQUF1QixHQUFNO0FBQ2xDLE1BQUd0SCxPQUFPQyxVQUFQLEdBQW9CLEdBQXBCLElBQTJCLENBQUNKLEVBQUUsVUFBRixFQUFjb0gsUUFBZCxDQUF1QixRQUF2QixDQUEvQixFQUFpRTs7QUFFaEUsT0FBR3BILEVBQUUsUUFBRixFQUFZNEUsR0FBWixDQUFnQixDQUFoQixFQUFtQjhDLFVBQW5CLEtBQWtDLENBQXJDLEVBQXdDO0FBQ3ZDMUgsTUFBRSxVQUFGLEVBQWM4QyxRQUFkLENBQXVCLFFBQXZCO0FBQ0E7QUFDRDtBQUNELEVBUEQ7O0FBU0Q7O0FBRUMsS0FBTXNELGtCQUFrQixTQUFsQkEsZUFBa0IsQ0FBQ3VCLElBQUQsRUFBTzdCLFNBQVAsRUFBa0IvRyxJQUFsQixFQUEyQjtBQUNoRCxNQUFHNEksSUFBSCxFQUFTO0FBQ1R6SSxhQUFVNEcsU0FBVixFQUFxQnhHLFFBQXJCLEdBQWdDMEIsWUFBWSxZQUFNO0FBQy9DNEcsb0JBQWdCOUIsU0FBaEIsRUFBMkIsR0FBM0I7QUFDQSxJQUY2QixFQUUzQi9HLElBRjJCLENBQWhDO0FBR0MsR0FKRCxNQUlPO0FBQ044SSxpQkFBYzNJLFVBQVU0RyxTQUFWLEVBQXFCeEcsUUFBbkM7QUFDQTtBQUNILEVBUkQ7O0FBVUQ7O0FBRUMsS0FBRyxDQUFDVSxFQUFFcUcsUUFBRixFQUFZUixJQUFaLENBQWlCLE1BQWpCLEVBQXlCdkUsUUFBekIsQ0FBa0MsV0FBbEMsQ0FBSixFQUFvRDtBQUNuRE4sY0FBWSxZQUFNO0FBQ2pCLE9BQUdoQixFQUFFLGtCQUFGLEVBQXNCc0gsTUFBdEIsR0FBK0JDLEdBQS9CLElBQXNDLENBQXpDLEVBQTRDO0FBQzNDdkgsTUFBRSx1QkFBRixFQUEyQjhDLFFBQTNCLENBQW9DLGVBQXBDO0FBQ0E5QyxNQUFFLFFBQUYsRUFBWTRFLEdBQVosQ0FBZ0IsQ0FBaEIsRUFBbUJrRCxJQUFuQjtBQUNBOUgsTUFBRSxRQUFGLEVBQVk4QyxRQUFaLENBQXFCLFNBQXJCO0FBQ0EsSUFKRCxNQUlPO0FBQ04sUUFBSWlGLFVBQVV6RixXQUFXLFlBQU07QUFDOUJ0QyxPQUFFLHVCQUFGLEVBQTJCMEUsV0FBM0IsQ0FBdUMsZUFBdkM7QUFDQTFFLE9BQUUsUUFBRixFQUFZNEUsR0FBWixDQUFnQixDQUFoQixFQUFtQm9ELEtBQW5CO0FBQ0FoSSxPQUFFLFFBQUYsRUFBWTBFLFdBQVosQ0FBd0IsU0FBeEI7QUFDQW5DLGtCQUFhd0YsT0FBYjtBQUNBLEtBTGEsRUFLWGhKLElBTFcsQ0FBZDtBQU1BOztBQUVKOztBQUVHLE9BQUdpQixFQUFFLGtCQUFGLEVBQXNCc0gsTUFBdEIsR0FBK0JDLEdBQS9CLEdBQXFDLEVBQUdwSCxPQUFPOEgsV0FBUCxHQUFxQixDQUF4QixDQUF4QyxFQUFvRTtBQUNuRWpJLE1BQUUsWUFBRixFQUFnQnFGLEdBQWhCLENBQW9CLEVBQUMsYUFBYSxpQ0FBZCxFQUFwQjtBQUNBLElBRkQsTUFFTztBQUNOckYsTUFBRSxZQUFGLEVBQWdCcUYsR0FBaEIsQ0FBb0IsRUFBQyxhQUFhLCtCQUFkLEVBQXBCO0FBQ0E7O0FBRURvQzs7QUFFSDs7QUFFRyxPQUFHdEgsT0FBTytILFVBQVAsQ0FBa0IsMEJBQWxCLEVBQThDQyxPQUE5QyxJQUF5RGhJLE9BQU9DLFVBQVAsR0FBb0IsR0FBaEYsRUFBcUY7QUFDbkZKLE1BQUUsNkVBQUYsRUFBaUY4QyxRQUFqRixDQUEwRixXQUExRjtBQUNELElBRkQsTUFFTztBQUNMOUMsTUFBRSw2RUFBRixFQUFpRjBFLFdBQWpGLENBQTZGLFdBQTdGO0FBQ0Q7O0FBRUQsT0FBRzFFLEVBQUUsa0JBQUYsRUFBc0IwQixNQUF6QixFQUFpQztBQUFFO0FBQ2xDLFFBQUd4QyxVQUFVRyxRQUFWLENBQW1CRSxXQUFuQixLQUFtQyxJQUF0QyxFQUE0QztBQUMzQ0wsZUFBVUcsUUFBVixDQUFtQkUsV0FBbkIsR0FBaUMsSUFBakM7QUFDQTZHLHFCQUFnQixJQUFoQixFQUFzQixVQUF0QixFQUFrQyxJQUFsQztBQUNBO0FBQ0QsSUFMRCxNQUtPO0FBQUU7QUFDUixRQUFHbEgsVUFBVUcsUUFBVixDQUFtQkUsV0FBbkIsS0FBbUMsSUFBdEMsRUFBNEM7QUFDM0M2RyxxQkFBZ0IsS0FBaEIsRUFBdUIsVUFBdkI7QUFDQWxILGVBQVVHLFFBQVYsQ0FBbUJFLFdBQW5CLEdBQWlDLEtBQWpDO0FBQ0E7QUFDRDs7QUFFRCxPQUFHUyxFQUFFLGtCQUFGLEVBQXNCMEIsTUFBekIsRUFBaUM7QUFBRTtBQUNsQyxRQUFHeEMsVUFBVU0sUUFBVixDQUFtQkQsV0FBbkIsS0FBbUMsSUFBdEMsRUFBNEM7QUFDM0NMLGVBQVVNLFFBQVYsQ0FBbUJELFdBQW5CLEdBQWlDLElBQWpDO0FBQ0E2RyxxQkFBZ0IsSUFBaEIsRUFBc0IsVUFBdEIsRUFBa0MsSUFBbEM7QUFDQTtBQUNELElBTEQsTUFLTztBQUFFO0FBQ1IsUUFBR2xILFVBQVVNLFFBQVYsQ0FBbUJELFdBQW5CLEtBQW1DLElBQXRDLEVBQTRDO0FBQzNDNkcscUJBQWdCLEtBQWhCLEVBQXVCLFVBQXZCO0FBQ0FsSCxlQUFVTSxRQUFWLENBQW1CRCxXQUFuQixHQUFpQyxLQUFqQztBQUNBO0FBQ0Q7QUFDRCxHQXZERCxFQXVERyxHQXZESDtBQXdEQTs7QUFFRjs7QUFFQ1MsR0FBRSxXQUFGLEVBQWU2RSxLQUFmLENBQXFCLFVBQUNhLENBQUQsRUFBTztBQUMzQixNQUFNMEMsVUFBVXpDLFNBQVMzRixFQUFFMEYsRUFBRUUsTUFBSixFQUFZQyxJQUFaLENBQWlCLFlBQWpCLENBQVQsQ0FBaEI7QUFDQTdGLElBQUUsa0JBQUYsRUFBc0JrSCxNQUF0QixDQUE2QmtCLE9BQTdCO0FBQ0FwSSxJQUFFLGVBQUYsRUFBbUI4QyxRQUFuQixDQUE0QixRQUE1Qjs7QUFFQSxNQUFHdUYsT0FBT0MsU0FBUCxDQUFpQkMsUUFBakIsQ0FBMEIsZ0JBQTFCLENBQUgsRUFBZ0Q7QUFDNUNDLE9BQUlGLFNBQUosQ0FBY0csTUFBZCxDQUFxQixVQUFyQjtBQUNBSixVQUFPQyxTQUFQLENBQWlCRyxNQUFqQixDQUF3QixnQkFBeEI7QUFDQXhJLFlBQVN5SSxJQUFULENBQWNDLEtBQWQsQ0FBb0JDLFFBQXBCLEdBQStCLFVBQS9CO0FBQ0Q7QUFDSCxFQVZEOztBQVlEOztBQUVDNUksR0FBRSxlQUFGLEVBQW1CNkUsS0FBbkIsQ0FBeUIsVUFBQ2EsQ0FBRCxFQUFPO0FBQzdCQSxJQUFFbUQsZUFBRjtBQUNGLEVBRkQ7O0FBSUEsS0FBSVIsU0FBU3BJLFNBQVNrRSxjQUFULENBQXdCLGFBQXhCLENBQWI7QUFBQSxLQUNDcUUsTUFBTXZJLFNBQVNrRSxjQUFULENBQXdCLFNBQXhCLENBRFA7O0FBR0Q7O0FBRUUsVUFBUzJFLFVBQVQsR0FBc0I7O0FBRXBCLE1BQUdULE9BQU9DLFNBQVAsQ0FBaUJDLFFBQWpCLENBQTBCLGdCQUExQixDQUFILEVBQWdEO0FBQzlDQyxPQUFJRixTQUFKLENBQWNHLE1BQWQsQ0FBcUIsVUFBckI7QUFDQUosVUFBT0MsU0FBUCxDQUFpQkcsTUFBakIsQ0FBd0IsZ0JBQXhCO0FBQ0F6SSxLQUFFLGVBQUYsRUFBbUI4QyxRQUFuQixDQUE0QixRQUE1QjtBQUNELEdBSkQsTUFLSztBQUNIdUYsVUFBT0MsU0FBUCxDQUFpQlMsR0FBakIsQ0FBcUIsZ0JBQXJCO0FBQ0FQLE9BQUlGLFNBQUosQ0FBY1MsR0FBZCxDQUFrQixVQUFsQjtBQUNBL0ksS0FBRSxlQUFGLEVBQW1CMEUsV0FBbkIsQ0FBK0IsUUFBL0I7QUFDRDtBQUNGOztBQUVIOztBQUVFLEtBQUcsQ0FBQzFFLEVBQUVxRyxRQUFGLEVBQVlSLElBQVosQ0FBaUIsTUFBakIsRUFBeUJ2RSxRQUF6QixDQUFrQyxXQUFsQyxDQUFKLEVBQW9EO0FBQ25EK0csU0FBTy9ELGdCQUFQLENBQXdCLE9BQXhCLEVBQWlDd0UsVUFBakM7QUFDQTs7QUFFSDs7QUFFRTNJLFFBQU9tRSxnQkFBUCxDQUF3QixRQUF4QixFQUFrQyxZQUFXO0FBQzNDLE1BQUduRSxPQUFPQyxVQUFQLEdBQW9CLElBQXBCLElBQTRCb0ksSUFBSUYsU0FBSixDQUFjQyxRQUFkLENBQXVCLFVBQXZCLENBQS9CLEVBQW1FO0FBQ2pFTztBQUNBTixPQUFJRixTQUFKLENBQWNHLE1BQWQsQ0FBcUIsVUFBckI7QUFDQ3pJLEtBQUUsZUFBRixFQUFtQjhDLFFBQW5CLENBQTRCLFFBQTVCO0FBQ0Y7QUFDRixFQU5EOztBQVFGOztBQUVFLEtBQUc5QyxFQUFFcUcsUUFBRixFQUFZUixJQUFaLENBQWlCLE1BQWpCLEVBQXlCdkUsUUFBekIsQ0FBa0MsV0FBbEMsQ0FBSCxFQUFtRDtBQUNuRCxNQUFHdEIsRUFBRXFHLFFBQUYsRUFBWVIsSUFBWixDQUFpQixNQUFqQixFQUF5QnZFLFFBQXpCLENBQWtDLFlBQWxDLENBQUgsRUFBb0Q7QUFDbkRrRCxjQUFXLENBQVg7QUFDQTtBQUNELE1BQUd4RSxFQUFFcUcsUUFBRixFQUFZUixJQUFaLENBQWlCLE1BQWpCLEVBQXlCdkUsUUFBekIsQ0FBa0MsaUJBQWxDLENBQUgsRUFBeUQ7QUFDeERrRCxjQUFXLENBQVg7QUFDQTtBQUNELE1BQUd4RSxFQUFFcUcsUUFBRixFQUFZUixJQUFaLENBQWlCLE1BQWpCLEVBQXlCdkUsUUFBekIsQ0FBa0MsY0FBbEMsQ0FBSCxFQUFzRDtBQUNyRGtELGNBQVcsQ0FBWDtBQUNBO0FBQ0QsTUFBR3hFLEVBQUVxRyxRQUFGLEVBQVlSLElBQVosQ0FBaUIsTUFBakIsRUFBeUJ2RSxRQUF6QixDQUFrQyxZQUFsQyxDQUFILEVBQW9EO0FBQ25Ea0QsY0FBVyxDQUFYO0FBQ0E7QUFDRCxNQUFHeEUsRUFBRXFHLFFBQUYsRUFBWVIsSUFBWixDQUFpQixNQUFqQixFQUF5QnZFLFFBQXpCLENBQWtDLFlBQWxDLENBQUgsRUFBb0Q7QUFDbkROLGVBQVksWUFBTTtBQUNqQnlHO0FBQ0EsSUFGRCxFQUVHLEdBRkg7QUFHQTtBQUNEOztBQUVGOztBQUVFLFVBQVN1QixXQUFULENBQXFCQyxFQUFyQixFQUF5QkMsSUFBekIsRUFBK0I7QUFDOUIsTUFBSUMsWUFBWSxFQUFoQjtBQUNBQSxZQUFVQyxFQUFWLEdBQWUsQ0FBZixDQUFrQkQsVUFBVUUsRUFBVixHQUFlLENBQWYsQ0FBa0JGLFVBQVVHLEVBQVYsR0FBZSxDQUFmLENBQWtCSCxVQUFVSSxFQUFWLEdBQWUsQ0FBZjtBQUN0RCxNQUFJQyxRQUFRLEVBQVosQ0FIOEIsQ0FHYjtBQUNqQixNQUFJQyxRQUFRLEVBQVosQ0FKOEIsQ0FJYjtBQUNqQixNQUFJQyxRQUFRLEVBQVosQ0FMOEIsQ0FLYjtBQUNqQixNQUFJQyxRQUFRLEVBQVosQ0FOOEIsQ0FNYjtBQUNqQixNQUFJQyxRQUFRLEVBQVo7QUFDQSxNQUFJeEUsTUFBTW5GLFNBQVNrRSxjQUFULENBQXdCOEUsRUFBeEIsQ0FBVjtBQUNBN0QsTUFBSWQsZ0JBQUosQ0FBcUIsWUFBckIsRUFBa0MsVUFBU29CLENBQVQsRUFBVztBQUMzQyxPQUFJbUUsSUFBSW5FLEVBQUVvRSxPQUFGLENBQVUsQ0FBVixDQUFSO0FBQ0FYLGFBQVVDLEVBQVYsR0FBZVMsRUFBRUUsT0FBakI7QUFDQVosYUFBVUUsRUFBVixHQUFlUSxFQUFFRyxPQUFqQjtBQUNELEdBSkQsRUFJRSxLQUpGO0FBS0E1RSxNQUFJZCxnQkFBSixDQUFxQixXQUFyQixFQUFpQyxVQUFTb0IsQ0FBVCxFQUFXO0FBQzFDQSxLQUFFdUUsY0FBRjtBQUNBLE9BQUlKLElBQUluRSxFQUFFb0UsT0FBRixDQUFVLENBQVYsQ0FBUjtBQUNBWCxhQUFVRyxFQUFWLEdBQWVPLEVBQUVFLE9BQWpCO0FBQ0FaLGFBQVVJLEVBQVYsR0FBZU0sRUFBRUcsT0FBakI7QUFDRCxHQUxELEVBS0UsS0FMRjtBQU1BNUUsTUFBSWQsZ0JBQUosQ0FBcUIsVUFBckIsRUFBZ0MsVUFBU29CLENBQVQsRUFBVztBQUN6QztBQUNBLE9BQUssQ0FBRXlELFVBQVVHLEVBQVYsR0FBZUUsS0FBZixHQUF1QkwsVUFBVUMsRUFBbEMsSUFBMENELFVBQVVHLEVBQVYsR0FBZUUsS0FBZixHQUF1QkwsVUFBVUMsRUFBNUUsS0FBc0ZELFVBQVVJLEVBQVYsR0FBZUosVUFBVUUsRUFBVixHQUFlTSxLQUEvQixJQUEwQ1IsVUFBVUUsRUFBVixHQUFlRixVQUFVSSxFQUFWLEdBQWVJLEtBQXhFLElBQW1GUixVQUFVRyxFQUFWLEdBQWUsQ0FBNUwsRUFBa007QUFDaE0sUUFBR0gsVUFBVUcsRUFBVixHQUFlSCxVQUFVQyxFQUE1QixFQUFnQ1EsUUFBUSxHQUFSLENBQWhDLEtBQ0tBLFFBQVEsR0FBUjtBQUNOO0FBQ0Q7QUFKQSxRQUtLLElBQUssQ0FBRVQsVUFBVUksRUFBVixHQUFlRyxLQUFmLEdBQXVCUCxVQUFVRSxFQUFsQyxJQUEwQ0YsVUFBVUksRUFBVixHQUFlRyxLQUFmLEdBQXVCUCxVQUFVRSxFQUE1RSxLQUFzRkYsVUFBVUcsRUFBVixHQUFlSCxVQUFVQyxFQUFWLEdBQWVLLEtBQS9CLElBQTBDTixVQUFVQyxFQUFWLEdBQWVELFVBQVVHLEVBQVYsR0FBZUcsS0FBeEUsSUFBbUZOLFVBQVVJLEVBQVYsR0FBZSxDQUE1TCxFQUFrTTtBQUNyTSxTQUFHSixVQUFVSSxFQUFWLEdBQWVKLFVBQVVFLEVBQTVCLEVBQWdDTyxRQUFRLEdBQVIsQ0FBaEMsS0FDS0EsUUFBUSxHQUFSO0FBQ047O0FBRUQsT0FBSUEsU0FBUyxFQUFiLEVBQWlCO0FBQ2YsUUFBRyxPQUFPVixJQUFQLElBQWUsVUFBbEIsRUFBOEJBLEtBQUtELEVBQUwsRUFBUVcsS0FBUjtBQUMvQjtBQUNELE9BQUlBLFFBQVEsRUFBWjtBQUNBVCxhQUFVQyxFQUFWLEdBQWUsQ0FBZixDQUFrQkQsVUFBVUUsRUFBVixHQUFlLENBQWYsQ0FBa0JGLFVBQVVHLEVBQVYsR0FBZSxDQUFmLENBQWtCSCxVQUFVSSxFQUFWLEdBQWUsQ0FBZjtBQUN2RCxHQWpCRCxFQWlCRSxLQWpCRjtBQWtCRDs7QUFFRjs7QUFFQyxLQUFNM0Isa0JBQWtCLFNBQWxCQSxlQUFrQixDQUFDcUIsRUFBRCxFQUFLaUIsQ0FBTCxFQUFXOztBQUVsQyxNQUFHakIsT0FBTyxVQUFWLEVBQXNCOztBQUVyQixPQUFNa0IsMkJBQTJCbkssRUFBRSwwQkFBRixFQUE4QjBCLE1BQS9EOztBQUVBLE9BQUd3SSxNQUFNLEdBQVQsRUFBYzs7QUFFYixRQUFHakwsY0FBY2tMLDJCQUEyQixDQUE1QyxFQUErQztBQUM5Q2xMO0FBQ0EsS0FGRCxNQUVPO0FBQ05BLG1CQUFjLENBQWQ7QUFDQTs7QUFFRGUsTUFBRSwwQkFBRixFQUE4QmYsV0FBOUIsRUFBMkM0RixLQUEzQztBQUNBO0FBQ0QsT0FBR3FGLE1BQU0sR0FBVCxFQUFjOztBQUViLFFBQUdqTCxjQUFjLENBQWpCLEVBQW9CO0FBQ25CQTtBQUNBLEtBRkQsTUFFTztBQUNOQSxtQkFBY2tMLDJCQUEyQixDQUF6QztBQUNBOztBQUVEbkssTUFBRSwwQkFBRixFQUE4QmYsV0FBOUIsRUFBMkM0RixLQUEzQztBQUNBO0FBQ0Q7QUFDRCxNQUFHb0UsT0FBTyxVQUFWLEVBQXNCOztBQUVyQixPQUFNbUIsMkJBQTJCcEssRUFBRSwwQkFBRixFQUE4QjBCLE1BQS9EOztBQUVBLE9BQUd3SSxNQUFNLEdBQVQsRUFBYzs7QUFFYixRQUFHbEwsY0FBY29MLDJCQUEyQixDQUE1QyxFQUErQztBQUM5Q3BMO0FBQ0EsS0FGRCxNQUVPO0FBQ05BLG1CQUFjLENBQWQ7QUFDQTs7QUFFRGdCLE1BQUUsMEJBQUYsRUFBOEJoQixXQUE5QixFQUEyQzZGLEtBQTNDO0FBQ0E7QUFDRCxPQUFHcUYsTUFBTSxHQUFULEVBQWM7O0FBRWIsUUFBR2xMLGNBQWMsQ0FBakIsRUFBb0I7QUFDbkJBO0FBQ0EsS0FGRCxNQUVPO0FBQ05BLG1CQUFjb0wsMkJBQTJCLENBQXpDO0FBQ0E7O0FBRURwSyxNQUFFLDBCQUFGLEVBQThCaEIsV0FBOUIsRUFBMkM2RixLQUEzQztBQUNBO0FBQ0Q7QUFDRCxFQXBERDs7QUFzREQ7O0FBRUMsS0FBRyxDQUFDN0UsRUFBRXFHLFFBQUYsRUFBWVIsSUFBWixDQUFpQixNQUFqQixFQUF5QnZFLFFBQXpCLENBQWtDLFdBQWxDLENBQUosRUFBb0Q7QUFDbkQwSCxjQUFZLFVBQVosRUFBd0JwQixlQUF4QjtBQUNBb0IsY0FBWSxVQUFaLEVBQXdCcEIsZUFBeEI7QUFDQTtBQUNELENBNW1CRCIsImZpbGUiOiJmYWtlX2U0ZDk5MDc1LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgdGltZSA9IDc1MDtcbmxldCBzZWN0aW9uM0lkeCA9IDA7XG5sZXQgc2VjdGlvbjRJZHggPSAwO1xuXG5jb25zdCBtYXN0ZXJPYmogPSB7XG5cdHNlY3Rpb24yQ3VycmVudElkeDogMCwgXG5cdHNlY3Rpb24xQ3VycmVudElkeDogMCxcblx0c2VjdGlvbjM6IHtcblx0XHRhdXRvbWF0ZTogJycsXG5cdFx0aXNBdXRvbWF0ZWQ6IGZhbHNlXG5cdH0sXG5cdHNlY3Rpb240OiB7XG5cdFx0YXV0b21hdGU6ICcnLFxuXHRcdGlzQXV0b21hdGVkOiBmYWxzZVxuXHR9LFxuXHRiYXNrZXRiYWxsOiB7bG9vcEFtb3VudDogMX0sXG5cdGZvb3RiYWxsOiB7bG9vcEFtb3VudDogMX0sXG5cdHRlbm5pczoge2xvb3BBbW91bnQ6IDF9LFxuXHRiYXNlYmFsbDoge2xvb3BBbW91bnQ6IDF9LFxuXHRmYW46IHtsb29wQW1vdW50OiAxfVxufTtcblxuY29uc3QgaG9tZXBhZ2VNb2JJbWFnZXMgPSBbXG5cdCdhc3NldHMvaW1hZ2VzL2hvbWVwYWdlTW9iL2Jhc2tldGJhbGwuanBnJyxcblx0J2Fzc2V0cy9pbWFnZXMvaG9tZXBhZ2VNb2IvZm9vdGJhbGwuanBnJyxcblx0J2Fzc2V0cy9pbWFnZXMvaG9tZXBhZ2VNb2IvdGVubmlzLmpwZycsIFxuXHQnYXNzZXRzL2ltYWdlcy9ob21lcGFnZU1vYi9iYXNlYmFsbC5qcGcnLCBcblx0J2Fzc2V0cy9pbWFnZXMvaG9tZXBhZ2VNb2IvZmFuLmpwZycgXG5dXG5cbiQoZG9jdW1lbnQpLnJlYWR5KCgpID0+IHtcblx0aWYod2luZG93LmlubmVyV2lkdGggPCA4MDApIHtcbi8vIElGIFRIRSBXSU5ET1cgSVMgU01BTExFUiBUSEFUIDgwMFBYIEZFVENIIFRIRSBKU09OIEZPUiBUSEUgSUNPTiBBTklNQVRJT04gQU5EIEFUQUNIIFRIRSBBTklNQVRJT05TIFNFUEVSQVRFTFkgVE8gbWFzdGVyT2JqIFxcXFxcblx0XHRmZXRjaCgnYXNzZXRzL2pzL0ZhbnRhc3RlY19TcHJpdGVfU2hlZXQuanNvbicpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHsgXG5cdFx0XHRyZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuXHRcdH0pLnRoZW4oZnVuY3Rpb24oc3ByaXRlT2JqKSB7XG5cdFx0XHRjb25zdCBJZGxlRnJhbWUgPSBmaWx0ZXJCeVZhbHVlKHNwcml0ZU9iai5mcmFtZXMsICdpZGxlJyk7XG5cdFx0XHRtYXN0ZXJPYmouZm9vdGJhbGwuYW5pbWF0aW9uQXJyYXkgPSBbLi4uSWRsZUZyYW1lLCAuLi5maWx0ZXJCeVZhbHVlKHNwcml0ZU9iai5mcmFtZXMsICdmb290YmFsbCcpXTtcblx0XHRcdG1hc3Rlck9iai50ZW5uaXMuYW5pbWF0aW9uQXJyYXkgPSBbLi4uSWRsZUZyYW1lLCAuLi5maWx0ZXJCeVZhbHVlKHNwcml0ZU9iai5mcmFtZXMsICd0ZW5uaXMnKV07XG5cdFx0XHRtYXN0ZXJPYmouYmFzZWJhbGwuYW5pbWF0aW9uQXJyYXkgPSBbLi4uSWRsZUZyYW1lLCAuLi5maWx0ZXJCeVZhbHVlKHNwcml0ZU9iai5mcmFtZXMsICdiYXNlYmFsbCcpXTtcblx0XHRcdG1hc3Rlck9iai5iYXNrZXRiYWxsLmFuaW1hdGlvbkFycmF5ID0gWy4uLklkbGVGcmFtZSwgLi4uZmlsdGVyQnlWYWx1ZShzcHJpdGVPYmouZnJhbWVzLCAnYmFza2V0JyldO1xuXHRcdFx0bWFzdGVyT2JqLmZhbi5hbmltYXRpb25BcnJheSA9IFsuLi5JZGxlRnJhbWUsIC4uLmZpbHRlckJ5VmFsdWUoc3ByaXRlT2JqLmZyYW1lcywgJ2ZhbicpXTtcbi8vIENBTEwgQU5JTUFUT1IgU0VUVVAgRlVOQ1RJT04gQU5EIFNUQVJUIFRIRSBJTUFHRSBTTElERVNIT1cgRk9SIFNFQ1RJT04gMSAoSE9NRVBBR0UpIFxcXFxcdFx0XHRcblx0XHRcdGFuaW1hdG9yU2V0dXAoKTtcblx0XHRcdGltYWdlQ29udHJvbGVyKG1hc3Rlck9iaiwgMSk7XG4vLyBDQUxMIFRIRSBpbWFnZUNvbnRyb2xlciBGVU5DVElPTiBFVkVSWSA1IFNFQ09ORFMgVE8gQ0hBTkdFIFRIRSBJTUFHRSBGT1IgU0VDVElPTiAxIChIT01FUEFHRSkgXFxcXFxuXHRcdFx0c2V0SW50ZXJ2YWwoKCkgPT4ge1xuXHRcdFx0XHRpbWFnZUNvbnRyb2xlcihtYXN0ZXJPYmosIDEpO1xuXHRcdFx0fSwgNTAwMCk7XG5cdFx0fSk7XG5cdH1cbi8vIEZVTkNUSU9OIFRPIFNFUEVSQVRFIFRIRSBBTklNQVRJT04gRlJBTUVTIEJZIE5BTUUgXFxcXFxuXHRjb25zdCBmaWx0ZXJCeVZhbHVlID0gKGFycmF5LCBzdHJpbmcpID0+IHtcbiAgICByZXR1cm4gYXJyYXkuZmlsdGVyKG8gPT4gdHlwZW9mIG9bJ2ZpbGVuYW1lJ10gPT09ICdzdHJpbmcnICYmIG9bJ2ZpbGVuYW1lJ10udG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhzdHJpbmcudG9Mb3dlckNhc2UoKSkpO1xuXHR9XG4vLyBHRU5FUklDIFNFVFVQIEZVTkNUSU9OIEZPUiBBRERJTkcgVkVORE9SIFBSRUZJWEVTIFRPIHJlcXVlc3RBbmltYXRpb25GcmFtZSBcXFxcXG5cdGNvbnN0IGFuaW1hdG9yU2V0dXAgPSAoKSA9PiB7XG5cdFx0XHRcbiAgICB2YXIgbGFzdFRpbWUgPSAwO1xuICAgIHZhciB2ZW5kb3JzID0gWydtcycsICdtb3onLCAnd2Via2l0JywgJ28nXTtcbiAgICBmb3IodmFyIHggPSAwOyB4IDwgdmVuZG9ycy5sZW5ndGggJiYgIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWU7ICsreCkge1xuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdKydSZXF1ZXN0QW5pbWF0aW9uRnJhbWUnXTtcbiAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdKydDYW5jZWxBbmltYXRpb25GcmFtZSddIHx8IHdpbmRvd1t2ZW5kb3JzW3hdKydDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUnXTtcbiAgICB9XG4gXG4gICAgaWYgKCF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKVxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uKGNhbGxiYWNrLCBlbGVtZW50KSB7XG4gICAgICAgIHZhciBjdXJyVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICB2YXIgdGltZVRvQ2FsbCA9IE1hdGgubWF4KDAsIDE2IC0gKGN1cnJUaW1lIC0gbGFzdFRpbWUpKTtcbiAgICAgICAgdmFyIGlkID0gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IGNhbGxiYWNrKGN1cnJUaW1lICsgdGltZVRvQ2FsbCk7IH0sIFxuICAgICAgICAgIHRpbWVUb0NhbGwpO1xuICAgICAgICBsYXN0VGltZSA9IGN1cnJUaW1lICsgdGltZVRvQ2FsbDtcbiAgICAgICAgcmV0dXJuIGlkO1xuICAgICAgfTtcbiBcbiAgICBpZiAoIXdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSlcbiAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbihpZCkge1xuICAgICAgY2xlYXJUaW1lb3V0KGlkKTtcbiAgICB9O1xuXHR9XG5cblxuXHRjb25zdCBhbmltYXRvciA9IChhbmltYXRpb25PYmopID0+IHtcblx0XHRcdFx0XHRcdFxuXHRcdHZhciBkYW5jaW5nSWNvbixcblx0XHRcdHNwcml0ZUltYWdlLFxuXHRcdFx0Y2FudmFzO1x0XHRcdFx0XHRcbi8vIEZVTkNUSU9OIFRPIFBBU1MgVE8gcmVxdWVzdEFuaW1hdGlvbkZyYW1lIFxcXFxcblx0XHRmdW5jdGlvbiBnYW1lTG9vcCAoKSB7XG5cdFx0ICAkKCcjbG9hZGluZycpLmFkZENsYXNzKCdoaWRkZW4nKTtcblx0XHQgIGFuaW1hdGlvbk9iai5sb29wSWQgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGdhbWVMb29wKTtcblx0XHQgIGRhbmNpbmdJY29uLnVwZGF0ZSgpO1xuXHRcdCAgZGFuY2luZ0ljb24ucmVuZGVyKCk7XG5cdFx0fVxuXHRcdFxuXHRcdGZ1bmN0aW9uIHNwcml0ZSAob3B0aW9ucykge1xuXHRcdFxuXHRcdFx0dmFyIHRoYXQgPSB7fSxcblx0XHRcdFx0ZnJhbWVJbmRleCA9IDAsXG5cdFx0XHRcdHRpY2tDb3VudCA9IDAsXG5cdFx0XHRcdGxvb3BDb3VudCA9IDAsXG5cdFx0XHRcdHRpY2tzUGVyRnJhbWUgPSBvcHRpb25zLnRpY2tzUGVyRnJhbWUgfHwgMCxcblx0XHRcdFx0bnVtYmVyT2ZGcmFtZXMgPSBvcHRpb25zLm51bWJlck9mRnJhbWVzIHx8IDE7XG5cdFx0XHRcblx0XHRcdHRoYXQuY29udGV4dCA9IG9wdGlvbnMuY29udGV4dDtcblx0XHRcdHRoYXQud2lkdGggPSBvcHRpb25zLndpZHRoO1xuXHRcdFx0dGhhdC5oZWlnaHQgPSBvcHRpb25zLmhlaWdodDtcblx0XHRcdHRoYXQuaW1hZ2UgPSBvcHRpb25zLmltYWdlO1xuXHRcdFx0dGhhdC5sb29wcyA9IG9wdGlvbnMubG9vcHM7XG5cdFx0XHRcblx0XHRcdHRoYXQudXBkYXRlID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHRpY2tDb3VudCArPSAxO1xuXG4gICAgICAgIGlmICh0aWNrQ291bnQgPiB0aWNrc1BlckZyYW1lKSB7XG5cblx0XHRcdFx0XHR0aWNrQ291bnQgPSAwO1xuICAgICAgICAgIC8vIElmIHRoZSBjdXJyZW50IGZyYW1lIGluZGV4IGlzIGluIHJhbmdlXG4gICAgICAgICAgaWYgKGZyYW1lSW5kZXggPCBudW1iZXJPZkZyYW1lcyAtIDEpIHtcdFxuICAgICAgICAgIC8vIEdvIHRvIHRoZSBuZXh0IGZyYW1lXG4gICAgICAgICAgICBmcmFtZUluZGV4ICs9IDE7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgXHRcdGxvb3BDb3VudCsrXG4gICAgICAgICAgICBmcmFtZUluZGV4ID0gMDtcblxuICAgICAgICAgICAgaWYobG9vcENvdW50ID09PSB0aGF0Lmxvb3BzKSB7XG4gICAgICAgICAgICBcdHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZShhbmltYXRpb25PYmoubG9vcElkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cdCAgICAgIH1cblx0ICAgIH1cblx0XHRcdFxuXHRcdFx0dGhhdC5yZW5kZXIgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcblx0XHRcdCAgLy8gQ2xlYXIgdGhlIGNhbnZhc1xuXHRcdFx0ICB0aGF0LmNvbnRleHQuY2xlYXJSZWN0KDAsIDAsIHRoYXQud2lkdGgsIHRoYXQuaGVpZ2h0KTtcblx0XHRcdCAgXG5cdFx0XHQgIHRoYXQuY29udGV4dC5kcmF3SW1hZ2UoXG5cdFx0XHQgICAgdGhhdC5pbWFnZSxcblx0XHRcdCAgICBhbmltYXRpb25PYmouYW5pbWF0aW9uQXJyYXlbZnJhbWVJbmRleF0uZnJhbWUueCxcblx0XHRcdCAgICBhbmltYXRpb25PYmouYW5pbWF0aW9uQXJyYXlbZnJhbWVJbmRleF0uZnJhbWUueSxcblx0XHRcdCAgICAyMDAsXG5cdFx0XHQgICAgMTc1LFxuXHRcdFx0ICAgIDAsXG5cdFx0XHQgICAgMCxcblx0XHRcdCAgICB3aW5kb3cuaW5uZXJXaWR0aCAvIDMuODQ2LFxuXHRcdFx0ICAgIHdpbmRvdy5pbm5lcldpZHRoIC8gNC4xKVxuXHRcdFx0fTtcblx0XHRcdFxuXHRcdFx0cmV0dXJuIHRoYXQ7XG5cdFx0fVxuXHRcdFxuXHRcdC8vIEdldCBjYW52YXNcblx0XHRjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJyk7XG5cdFx0Y2FudmFzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGggLyAzLjg0Njtcblx0XHRjYW52YXMuaGVpZ2h0ID0gd2luZG93LmlubmVyV2lkdGggLyAyLjI7XG5cdFx0XG5cdFx0Ly8gQ3JlYXRlIHNwcml0ZSBzaGVldFxuXHRcdHNwcml0ZUltYWdlID0gbmV3IEltYWdlKCk7XHRcblx0XHRcblx0XHQvLyBDcmVhdGUgc3ByaXRlXG5cdFx0ZGFuY2luZ0ljb24gPSBzcHJpdGUoe1xuXHRcdFx0Y29udGV4dDogY2FudmFzLmdldENvbnRleHQoXCIyZFwiKSxcblx0XHRcdHdpZHRoOiA0MDQwLFxuXHRcdFx0aGVpZ2h0OiAxNzcwLFxuXHRcdFx0aW1hZ2U6IHNwcml0ZUltYWdlLFxuXHRcdFx0bnVtYmVyT2ZGcmFtZXM6IGFuaW1hdGlvbk9iai5hbmltYXRpb25BcnJheS5sZW5ndGgsXG5cdFx0XHR0aWNrc1BlckZyYW1lOiA0LFxuXHRcdFx0bG9vcHM6IGFuaW1hdGlvbk9iai5sb29wQW1vdW50XG5cdFx0fSk7XG5cdFx0XG5cdFx0Ly8gTG9hZCBzcHJpdGUgc2hlZXRcblx0XHRzcHJpdGVJbWFnZS5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBnYW1lTG9vcCk7XG5cdFx0c3ByaXRlSW1hZ2Uuc3JjID0gJ2Fzc2V0cy9pbWFnZXMvRmFudGFzdGVjX1Nwcml0ZV9TaGVldC5wbmcnO1xuXHR9IFxuXG4vLyBJTklUSUFMSVNFIEFORCBTRVRVUCBDVVJSRU5UIFBBR0UuIEVYRUNVVEUgVFJBTlNJVElPTlMgQU5EIFJFTU9WRSBUSU5UIElGIFJFTEVWQU5UIFxcXFxcblxuXHRjb25zdFx0cGFnZUxvYWRlciA9IChpbmRleCkgPT4ge1xuXHRcdGlmKGluZGV4ID09PSA1KSB7XG5cdFx0XHQkKCcudGludCcpLnJlbW92ZUNsYXNzKCdyZW1vdmVUaW50Jyk7XG5cdFx0XHQkKCcuYmFja2dyb3VuZFdyYXBwZXInKS5yZW1vdmVDbGFzcygnc2NhbGVCYWNrZ3JvdW5kJyk7XG5cdFx0XHQkKCcjc2VjdGlvbjUnKS5maW5kKCcuaGVhZGluZycpLmFkZENsYXNzKCdzaG93IGZhZGVJbicpO1xuXHRcdFx0JCgnLnN1YlNlY3Rpb24nKS5hZGRDbGFzcygnc2NhbGVCYWNrZ3JvdW5kJyk7XG5cdFx0XHQkKCcuc3ViU2VjdGlvbicpLmZpbmQoJy50aW50JykuYWRkQ2xhc3MoJ3JlbW92ZVRpbnQnKTtcblx0XHRcdCQoJyNzZWN0aW9uNScpLmZpbmQoJy50ZXh0V3JhcHBlcicpLmFkZENsYXNzKCdzaG93Jyk7XG5cdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0JCgnLnN1YlNlY3Rpb24gPiAudGV4dFdyYXBwZXInKS5maW5kKCcuaGVhZGluZycpLmFkZENsYXNzKCdmYWRlSW4nKTtcblx0XHRcdH0sIDEwMDApO1xuXHRcdH0gXG5cdFx0ZWxzZSB7XG5cdFx0XHQkKCcudGludCcpLnJlbW92ZUNsYXNzKCdyZW1vdmVUaW50Jyk7XG5cdFx0XHQkKCcuc3ViU2VjdGlvbicpLnJlbW92ZUNsYXNzKCdzY2FsZUJhY2tncm91bmQnKTtcblx0XHRcdCQoYC5iYWNrZ3JvdW5kV3JhcHBlcjpub3QoI3NlY3Rpb24ke2luZGV4fUJhY2tncm91bmQpYCkucmVtb3ZlQ2xhc3MoJ3NjYWxlQmFja2dyb3VuZCcpO1xuXHRcdFx0JChgLnNlY3Rpb24uYWN0aXZlYCkuZmluZChgLmJhY2tncm91bmRXcmFwcGVyYCkuYWRkQ2xhc3MoJ3NjYWxlQmFja2dyb3VuZCcpO1xuXHRcdFx0JChgc2VjdGlvbi5hY3RpdmVgKS5maW5kKCcudGludCcpLmFkZENsYXNzKCdyZW1vdmVUaW50Jyk7XG5cblx0XHRcdGlmKCQoYC5zZWN0aW9uJHtpbmRleH1QYWdpbmF0b3JCdXR0b25gKS5sZW5ndGggJiYgJChgLnNlY3Rpb24ke2luZGV4fVBhZ2luYXRvckJ1dHRvbi5hY3RpdmVgKS5sZW5ndGggPCAxKSB7XG5cdFx0XHRcdCQoYC5zZWN0aW9uJHtpbmRleH1QYWdpbmF0b3JCdXR0b25gKS5nZXQoMCkuY2xpY2soKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cbi8vIEhJREUgQUxMIEJFQ0tHUk9VTkRTIElOIFRIRSBTRUNUSU9OIEVYQ0VQVCBUSEUgU1BFQ0lGSUVEIElOREVYLCBXSElDSCBJUyBTQ0FMRUQgQU5EIFNIT1dOLiBcXFxcXG5cblx0Y29uc3QgaW5pdGlhbGl6ZVNlY3Rpb24gPSAoc2VjdGlvbk51bWJlciwgaWR4KSA9PiB7XG5cdFx0JChgI3NlY3Rpb24ke3NlY3Rpb25OdW1iZXJ9QmFja2dyb3VuZCR7aWR4fWApLnNpYmxpbmdzKCcuYmFja2dyb3VuZFdyYXBwZXInKS5tYXAoKGl4LCBlbGUpID0+IHtcblx0XHRcdCQoZWxlKS5jc3Moe29wYWNpdHk6IDB9KTtcblx0XHR9KTtcblxuXHRcdCQoYCNzZWN0aW9uJHtzZWN0aW9uTnVtYmVyfUJhY2tncm91bmQke2lkeH1gKS5jc3Moe1xuXHRcdFx0J3RyYW5zZm9ybSc6ICdzY2FsZSgxLjEpJyxcblx0XHRcdCdvcGFjaXR5JzogMVxuXHRcdH0pO1xuXHR9O1xuXG4vLyBDQUxMIGluaXRpYWxpemVTZWN0aW9uIE9OIFNFQ1RJT05TIDEsIDMgQU5EIDQuIFxcXFxcblx0aW5pdGlhbGl6ZVNlY3Rpb24oMSwgMCk7XG5cdGluaXRpYWxpemVTZWN0aW9uKDMsIDApO1xuXHRpbml0aWFsaXplU2VjdGlvbig0LCAwKTtcblxuLy8gQkFDS0dST1VORCBJTUFHRSBUUkFOU0lUSU9OIEhBTkRMRVIuIFxcXFxcblxuXHRjb25zdCBpbWFnZUNvbnRyb2xlciA9IChpZHhPYmosIHNlY3Rpb25OdW1iZXIpID0+IHtcblx0XHRsZXQgcmVsZXZhbnRBbmltYXRpb247XG5cblx0XHRpZihzZWN0aW9uTnVtYmVyID09PSAxKSB7XG5cdFx0XHRzd2l0Y2goaWR4T2JqLnNlY3Rpb24xQ3VycmVudElkeCkge1xuXHRcdFx0XHRjYXNlIDA6XG5cdFx0XHRcdFx0cmVsZXZhbnRBbmltYXRpb24gPSBtYXN0ZXJPYmouYmFza2V0YmFsbDtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgMTpcblx0XHRcdFx0XHRyZWxldmFudEFuaW1hdGlvbiA9IG1hc3Rlck9iai5mb290YmFsbDtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgMjpcblx0XHRcdFx0XHRyZWxldmFudEFuaW1hdGlvbiA9IG1hc3Rlck9iai50ZW5uaXM7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIDM6XG5cdFx0XHRcdFx0cmVsZXZhbnRBbmltYXRpb24gPSBtYXN0ZXJPYmouYmFzZWJhbGw7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIDQ6XG5cdFx0XHRcdFx0cmVsZXZhbnRBbmltYXRpb24gPSBtYXN0ZXJPYmouZmFuO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cblx0XHQkKGAjc2VjdGlvbiR7c2VjdGlvbk51bWJlcn1gKS5maW5kKCcudGludCcpLnJlbW92ZUNsYXNzKCdyZW1vdmVUaW50Jyk7XG5cdFx0JChgI3NlY3Rpb24ke3NlY3Rpb25OdW1iZXJ9QmFja2dyb3VuZCR7aWR4T2JqW2BzZWN0aW9uJHtzZWN0aW9uTnVtYmVyfUN1cnJlbnRJZHhgXX1gKS5yZW1vdmVDbGFzcygnc2NhbGVCYWNrZ3JvdW5kJyk7XG5cdFx0aW5pdGlhbGl6ZVNlY3Rpb24oc2VjdGlvbk51bWJlciwgaWR4T2JqW2BzZWN0aW9uJHtzZWN0aW9uTnVtYmVyfUN1cnJlbnRJZHhgXSk7XG5cdFx0XG5cdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRpZihzZWN0aW9uTnVtYmVyID09PSAxKSB7XG5cdFx0XHRcdGFuaW1hdG9yKHJlbGV2YW50QW5pbWF0aW9uKTtcblx0XHRcdH1cblxuXHRcdFx0JChgI3NlY3Rpb24ke3NlY3Rpb25OdW1iZXJ9YCkuZmluZChgLmJhY2tncm91bmRXcmFwcGVyYCkuYWRkQ2xhc3MoJ3NjYWxlQmFja2dyb3VuZCcpO1xuXHRcdFx0JChgI3NlY3Rpb24ke3NlY3Rpb25OdW1iZXJ9YCkuZmluZCgnLnRpbnQnKS5hZGRDbGFzcygncmVtb3ZlVGludCcpO1xuXHRcdH0sIDUwMCk7XG5cblx0XHRpZihpZHhPYmpbYHNlY3Rpb24ke3NlY3Rpb25OdW1iZXJ9Q3VycmVudElkeGBdID09PSAkKGAjc2VjdGlvbiR7c2VjdGlvbk51bWJlcn1gKS5maW5kKGAuYmFja2dyb3VuZFdyYXBwZXJgKS5sZW5ndGggLSAxKSB7XG5cdFx0XHRpZHhPYmpbYHNlY3Rpb24ke3NlY3Rpb25OdW1iZXJ9Q3VycmVudElkeGBdID0gMDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0aWR4T2JqW2BzZWN0aW9uJHtzZWN0aW9uTnVtYmVyfUN1cnJlbnRJZHhgXSArPSAxO1xuXHRcdH1cblx0fVxuLy8gU1RBUlQgU0xJREVTSE9XIE9OIFNFQ1RJT04gMiBcXFxcXG5cdGltYWdlQ29udHJvbGVyKG1hc3Rlck9iaiwgMik7XG5cbi8vIENIQU5HRSBTRUNUSU9OIDIgQkFDS0dST1VORCBJTUFHRSBFVkVSWSAxNSBTRUNPTkRTIFxcXFxcblx0c2V0SW50ZXJ2YWwoKCkgPT4ge1xuXHRcdGltYWdlQ29udHJvbGVyKG1hc3Rlck9iaiwgMik7XG5cdH0sIDE1MDAwKTtcblxuLy8gUEFHSU5BVElPTiBCVVRUT05TIENMSUNLIEhBTkRMRVIgRk9SIFNFQ1RJT05TIDMgQU5EIDQuIFxcXFxcblxuXHRjb25zdCBoYW5kbGVQYW5pbmF0aW9uQnV0dG9uQ2xpY2sgPSAoZSkgPT4ge1xuXG5cdFx0Y29uc3QgaWR4ID0gcGFyc2VJbnQoJChlLnRhcmdldCkuYXR0cignZGF0YS1pbmRleCcpKTtcblx0XHRjb25zdCBzZWN0aW9uSWQgPSAkKGUudGFyZ2V0KS5jbG9zZXN0KCdzZWN0aW9uJykuYXR0cignaWQnKTtcblx0XHRsZXQgcmVsZXZhbnREYXRhQXJyYXk7XG5cblx0XHRpZihzZWN0aW9uSWQgPT09ICdzZWN0aW9uMycpIHtcblx0XHRcdHNlY3Rpb24zSWR4ID0gaWR4O1xuXHRcdH1cblxuXHRcdGlmKHNlY3Rpb25JZCA9PT0gJ3NlY3Rpb240Jykge1xuXHRcdFx0c2VjdGlvbjRJZHggPSBpZHg7XG5cdFx0fVxuXG5cdFx0JChgIyR7c2VjdGlvbklkfWApLmZpbmQoJy50aW50JykucmVtb3ZlQ2xhc3MoJ3JlbW92ZVRpbnQnKTtcblx0XHQkKGAjJHtzZWN0aW9uSWR9YCkuZmluZCgnLnRleHRXcmFwcGVyJykucmVtb3ZlQ2xhc3MoJ3Nob3cnKTtcblx0XHQkKGAjJHtzZWN0aW9uSWR9YCkuZmluZChgI3RleHRXcmFwcGVyJHtpZHh9YCkuYWRkQ2xhc3MoJ3Nob3cnKTtcblx0XHQkKGAjJHtzZWN0aW9uSWR9QmFja2dyb3VuZCR7aWR4fWApLnJlbW92ZUNsYXNzKCdzY2FsZUJhY2tncm91bmQnKTtcblx0XHQkKGAuJHtzZWN0aW9uSWR9UGFnaW5hdG9yQnV0dG9uYCkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdCQoZS50YXJnZXQpLmFkZENsYXNzKCdhY3RpdmUnKTtcblxuXHRcdGluaXRpYWxpemVTZWN0aW9uKHBhcnNlSW50KCQoYCMke3NlY3Rpb25JZH1gKS5hdHRyKCdkYXRhLWluZGV4JykpLCBpZHgpO1xuXG5cdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRwYWdlTG9hZGVyKHBhcnNlSW50KCQoYCMke3NlY3Rpb25JZH1gKS5hdHRyKCdkYXRhLWluZGV4JykpKTtcblx0XHR9LCA1MDApO1xuXG5cdFx0aWYoc2VjdGlvbklkICE9PSAnc2VjdGlvbjInKXtcblx0XHRcdCQoYCMke3NlY3Rpb25JZH1gKS5maW5kKCcuaGVhZGluZywgcCcpLmFkZENsYXNzKCdmYWRlSW4nKTtcblx0XHRcdCQoYCMke3NlY3Rpb25JZH1gKS5vbigndHJhbnNpdGlvbmVuZCB3ZWJraXRUcmFuc2l0aW9uRW5kIG9UcmFuc2l0aW9uRW5kJywgKGVzKSA9PiB7XG5cdCAgICBcdCQoYCMke3NlY3Rpb25JZH1gKS5maW5kKCcuaGVhZGluZywgcCcpLnJlbW92ZUNsYXNzKCdmYWRlSW4nKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fTtcblxuLy8gQ0xJQ0sgTElTVEVORVIgRk9SIFBBR0lOQVRJT04gQlVUVE9OUyBPTiBTRUNUSU9OUyAzIEFORCA0LiBcXFxcXG5cblx0JCgnLnNlY3Rpb24zUGFnaW5hdG9yQnV0dG9uLCAuc2VjdGlvbjRQYWdpbmF0b3JCdXR0b24nKS5jbGljaygoZSkgPT4ge1xuXHRcdFxuXHRcdGlmKG1hc3Rlck9ialskKGUuY3VycmVudFRhcmdldCkuY2xvc2VzdCgnc2VjdGlvbicpLmF0dHIoJ2lkJyldLmlzQXV0b21hdGVkKSB7XG4vLyBJRiBUSEVSRSBJUyBBIFJJTk5JTkcgSU5URVJWQUwgT04gVEhFIFJFTEVWQU5UIFNFQ1RJT04gQ0xFQVIgSVQgXFxcXFxuXHRcdFx0aW50ZXJ2YWxNYW5hZ2VyKGZhbHNlLCAkKGUuY3VycmVudFRhcmdldCkuY2xvc2VzdCgnc2VjdGlvbicpLmF0dHIoJ2lkJykpO1xuLy8gU0VUIEEgTkVXIElOVEVSVkFMIE9GIDcgU0VDT05EUyBPTiBUSEUgU0VDVElPTiBcXFxcXG5cdFx0XHRpbnRlcnZhbE1hbmFnZXIodHJ1ZSwgJChlLmN1cnJlbnRUYXJnZXQpLmNsb3Nlc3QoJ3NlY3Rpb24nKS5hdHRyKCdpZCcpLCA3MDAwKTtcblx0XHR9XG4vLyBDQUxMIFRIRSBDTElDSyBIQU5ETEVSIEZVTkNUSU9OIEFORCBQQVNTIElUIFRIRSBFVkVOVCBcXFxcXG5cdFx0aGFuZGxlUGFuaW5hdGlvbkJ1dHRvbkNsaWNrKGUpO1xuXHR9KTtcblxuLy8gSU5JVElBTElaRSBPTkVQQUdFU0NST0xMIElGIE5PVCBJTiBDTVMgUFJFVklFVy4gXFxcXFxuXG5cdGlmKCEkKGxvY2F0aW9uKS5hdHRyKCdocmVmJykuaW5jbHVkZXMoJ2luZGV4LnBocCcpKSB7XG5cdFx0JCgnI3Njcm9sbGVyV3JhcHBlcicpLm9uZXBhZ2Vfc2Nyb2xsKHtcblx0XHRcdHNlY3Rpb25Db250YWluZXI6IFwic2VjdGlvblwiLCAgICBcblx0XHRcdGVhc2luZzogXCJlYXNlLW91dFwiLCAgICAgICAgICAgICAgICAgXG5cdFx0XHRhbmltYXRpb25UaW1lOiB0aW1lLCAgICAgICAgICAgIFxuXHRcdFx0cGFnaW5hdGlvbjogdHJ1ZSwgICAgICAgICAgICAgICBcblx0XHRcdHVwZGF0ZVVSTDogdHJ1ZSwgICAgICAgICAgICAgICBcblx0XHRcdGJlZm9yZU1vdmU6IChpbmRleCkgPT4ge30sIFxuXHRcdFx0YWZ0ZXJNb3ZlOiAoaW5kZXgpID0+IHtcbi8vIElOSVRJQUxJWkUgVEhFIENVUlJFTlQgUEFHRS4gXFxcXFxuXG5cdFx0XHRcdHBhZ2VMb2FkZXIoaW5kZXgpO1xuXHRcdFx0fSwgIFxuXHRcdFx0bG9vcDogZmFsc2UsICAgICAgICAgICAgICAgICAgICBcblx0XHRcdGtleWJvYXJkOiB0cnVlLCAgICAgICAgICAgICAgICAgXG5cdFx0XHRyZXNwb25zaXZlRmFsbGJhY2s6IGZhbHNlLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXHRcdFx0ZGlyZWN0aW9uOiBcInZlcnRpY2FsXCIgICAgICAgICAgXG5cdFx0fSk7XG5cblx0XHQkKCcjc2Nyb2xsZXJXcmFwcGVyJykubW92ZVRvKDEpO1xuXHR9XG5cbi8vIENPTlRST0wgQ0xJQ0tTIE9OIFdPUksgV0lUSCBVUyBTRUNUSU9OIChTRUNUSU9ONSkuIFxcXFxcblxuXHQkKCcuY2xpY2thYmxlJykuY2xpY2soKGUpID0+IHtcblx0XHRsZXQgY3VycmVudFNlY3Rpb24gPSAkKGUudGFyZ2V0KS5jbG9zZXN0KCQoJy5zdWJTZWN0aW9uJykpO1xuXG5cdFx0aWYoY3VycmVudFNlY3Rpb24uaGFzQ2xhc3MoJ29wZW4nKSkge1xuXHRcdFx0Y3VycmVudFNlY3Rpb24ucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcblx0XHRcdGN1cnJlbnRTZWN0aW9uLmZpbmQoJy5idXR0b24sIHAnKS5yZW1vdmVDbGFzcygnZmFkZUluJyk7XG5cdFx0XHRjdXJyZW50U2VjdGlvbi5zaWJsaW5ncygnLnN1YlNlY3Rpb24nKS5tYXAoKGlkeCwgc2VjdGlvbikgPT4ge1xuXHRcdFx0XHQkKHNlY3Rpb24pLnJlbW92ZUNsYXNzKCdjbG9zZWQnKTtcblx0XHRcdFx0JChzZWN0aW9uKS5maW5kKCcudGludCcpLnJlbW92ZUNsYXNzKCdhZGRUaW50JykuYWRkQ2xhc3MoJ3JlbW92ZVRpbnQnKTtcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjdXJyZW50U2VjdGlvbi5yZW1vdmVDbGFzcygnY2xvc2VkJykuYWRkQ2xhc3MoJ29wZW4nKTtcblx0XHRcdGN1cnJlbnRTZWN0aW9uLm9uKCd0cmFuc2l0aW9uZW5kIHdlYmtpdFRyYW5zaXRpb25FbmQgb1RyYW5zaXRpb25FbmQnLCAoZXMpID0+IHtcblx0ICAgIFx0JCgnLnN1YlNlY3Rpb24ub3BlbicpLmZpbmQoJy5idXR0b24sIHAnKS5hZGRDbGFzcygnZmFkZUluJyk7XG5cdFx0XHR9KTtcblx0XHRcdGN1cnJlbnRTZWN0aW9uLnNpYmxpbmdzKCcuc3ViU2VjdGlvbicpLm1hcCgoaWR4LCBzZWN0aW9uKSA9PiB7XG5cdFx0XHRcdCQoc2VjdGlvbikucmVtb3ZlQ2xhc3MoJ29wZW4nKS5hZGRDbGFzcygnY2xvc2VkJyk7XG5cdFx0XHRcdCQoc2VjdGlvbikuZmluZCgnLnRpbnQnKS5yZW1vdmVDbGFzcygncmVtb3ZlVGludCcpLmFkZENsYXNzKCdhZGRUaW50Jyk7XG5cdFx0XHRcdCQoc2VjdGlvbikuZmluZCgnLmJ1dHRvbiwgcCcpLnJlbW92ZUNsYXNzKCdmYWRlSW4nKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRjdXJyZW50U2VjdGlvbi5maW5kKCcudGludCcpLnJlbW92ZUNsYXNzKCdhZGRUaW50JykuYWRkQ2xhc3MoJ3JlbW92ZVRpbnQnKTtcblx0fSk7XG5cbi8vIENPTlRST0wgRk9PVEVSIEFSUk9XIENMSUNLUy4gXFxcXFxuXG5cdCQoJyNkb3duQXJyb3cnKS5jbGljaygoKSA9PiB7XG5cdFx0aWYoJCh3aW5kb3cpLmhlaWdodCgpICogKCQoJy5wYWdlJykubGVuZ3RoIC0gMSkgPT09IC0gJCgnI3Njcm9sbGVyV3JhcHBlcicpLm9mZnNldCgpLnRvcCkge1xuLy8gTU9WRSBUTyBUT1AgT0YgUEFHRSBJRiBDVVJSRU5UTFkgQVQgQk9UVE9NIFxcXFxcblx0ICBcdCQoJyNzY3JvbGxlcldyYXBwZXInKS5tb3ZlVG8oMSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCQoJyNzY3JvbGxlcldyYXBwZXInKS5tb3ZlRG93bigpO1xuXHRcdH1cblx0fSk7XG5cbi8vIEhJREUgVEhFIExPQURJTkcgQU5JTUFUSU9QTiBXSEVOIFZJREVPIElTIFJFQURZIFRPIFBMQVkgT04gREVTWEtUT1AuIFxcXFxcblxuXHRjb25zdCBoaWRlTG9hZGluZ0FuaW1hdGlvbiA9ICgpID0+IHtcblx0XHRpZih3aW5kb3cuaW5uZXJXaWR0aCA+IDgwMCAmJiAhJCgnI2xvYWRpbmcnKS5oYXNDbGFzcygnaGlkZGVuJykpIHtcblxuXHRcdFx0aWYoJCgnI3ZpZGVvJykuZ2V0KDApLnJlYWR5U3RhdGUgPT09IDQpIHtcblx0XHRcdFx0JCgnI2xvYWRpbmcnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cbi8vIE1BTkFHRU1FTlQgRlVOQ1RJT04gRk9SIFNFVFRJTkcgQU5EIENMRUFSSU5HIFRIRSBTTElERSBBVVRPTUFUSU9OIElOVEVSVkFMUy4gXFxcXFxuXG5cdGNvbnN0IGludGVydmFsTWFuYWdlciA9IChmbGFnLCBzZWN0aW9uSWQsIHRpbWUpID0+IHtcbiAgIFx0aWYoZmxhZykge1xuIFx0XHRcdG1hc3Rlck9ialtzZWN0aW9uSWRdLmF1dG9tYXRlID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICBcdFx0c3dpcGVDb250cm9sbGVyKHNlY3Rpb25JZCwgJ2wnKTtcdFxuICAgICBcdH0sIHRpbWUpOyBcbiAgIFx0fSBlbHNlIHtcdFx0XG4gICAgXHRjbGVhckludGVydmFsKG1hc3Rlck9ialtzZWN0aW9uSWRdLmF1dG9tYXRlKTtcbiAgIFx0fVxuXHR9O1xuXG4vLyBJRiBOT1QgSU4gQ01TIEFETUlOIFBSRVZJRVcsIFBFUlBFVFVBTExZIENIRUNLIElGIFdFIEFSRSBBVCBUSEUgVE9QIE9GIFRIRSBQQUdFIEFORCBJRiBTTywgRE9OVCBTSE9XIFRIRSBGT09URVIgT1IgR1JFRU4gU0hBUEUuIFxcXFxcblxuXHRpZighJChsb2NhdGlvbikuYXR0cignaHJlZicpLmluY2x1ZGVzKCdpbmRleC5waHAnKSkge1xuXHRcdHNldEludGVydmFsKCgpID0+IHtcblx0XHRcdGlmKCQoJyNzY3JvbGxlcldyYXBwZXInKS5vZmZzZXQoKS50b3AgPj0gMCkge1xuXHRcdFx0XHQkKCcjaGVhZGVyU2hhcGUsICNmb290ZXInKS5hZGRDbGFzcygnbW92ZU9mZlNjcmVlbicpO1xuXHRcdFx0XHQkKCcjdmlkZW8nKS5nZXQoMCkucGxheSgpO1xuXHRcdFx0XHQkKCcuYXJyb3cnKS5hZGRDbGFzcygncHVsc2F0ZScpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dmFyIHRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0XHQkKCcjaGVhZGVyU2hhcGUsICNmb290ZXInKS5yZW1vdmVDbGFzcygnbW92ZU9mZlNjcmVlbicpO1xuXHRcdFx0XHRcdCQoJyN2aWRlbycpLmdldCgwKS5wYXVzZSgpO1xuXHRcdFx0XHRcdCQoJy5hcnJvdycpLnJlbW92ZUNsYXNzKCdwdWxzYXRlJyk7XG5cdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuXHRcdFx0XHR9LCB0aW1lKTtcblx0XHRcdH1cblxuLy8gUk9UQVRFIFRIRSBBUlJPVyBJTiBUSEUgRk9PVEVSIFdIRU4gQVQgVEhFIEJPVFRPTSBPRiBUSEUgUEFHRSBcXFxcXG5cblx0XHRcdGlmKCQoJyNzY3JvbGxlcldyYXBwZXInKS5vZmZzZXQoKS50b3AgPCAtICh3aW5kb3cuaW5uZXJIZWlnaHQgKiA0KSkge1xuXHRcdFx0XHQkKCcjZG93bkFycm93JykuY3NzKHsndHJhbnNmb3JtJzogJ3JvdGF0ZSgxODBkZWcpIHRyYW5zbGF0ZVgoLTUwJSknfSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkKCcjZG93bkFycm93JykuY3NzKHsndHJhbnNmb3JtJzogJ3RyYW5zbGF0ZVgoLTUwJSkgcm90YXRlKDBkZWcpJ30pO1xuXHRcdFx0fVxuXG5cdFx0XHRoaWRlTG9hZGluZ0FuaW1hdGlvbigpO1xuXG4vLyBBREQgTEFORFNDQVBFIFNUWUxFUyBUTyBSRUxFVkFOVCBFTEVNRU5UUyBcXFxcXG5cblx0XHRcdGlmKHdpbmRvdy5tYXRjaE1lZGlhKFwiKG9yaWVudGF0aW9uOiBsYW5kc2NhcGUpXCIpLm1hdGNoZXMgJiYgd2luZG93LmlubmVyV2lkdGggPCA4MDApIHtcblx0XHRcdCAgJCgnLm5hdl9saW5rLCAjaGVhZGVyU2hhcGUsICNmb290ZXIsIC5jdXN0b20sIC5tYXJrZXIsICNzZWN0aW9uNSwgLnRleHRXcmFwcGVyJykuYWRkQ2xhc3MoJ2xhbmRzY2FwZScpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ICQoJy5uYXZfbGluaywgI2hlYWRlclNoYXBlLCAjZm9vdGVyLCAuY3VzdG9tLCAubWFya2VyLCAjc2VjdGlvbjUsIC50ZXh0V3JhcHBlcicpLnJlbW92ZUNsYXNzKCdsYW5kc2NhcGUnKTtcblx0XHRcdH1cblxuXHRcdFx0aWYoJCgnI3NlY3Rpb24zLmFjdGl2ZScpLmxlbmd0aCkgeyAvLyBBVVRPTUFURSBUSEUgU0xJREVTIE9OIFNFQ1RJT1BOIDMgRVZFUlkgNyBTRUNPTkRTIElGIFRIRSBTRUNUSU9OIElTIEFDVElWRS4gXFxcXFxuXHRcdFx0XHRpZihtYXN0ZXJPYmouc2VjdGlvbjMuaXNBdXRvbWF0ZWQgIT09IHRydWUpIHtcblx0XHRcdFx0XHRtYXN0ZXJPYmouc2VjdGlvbjMuaXNBdXRvbWF0ZWQgPSB0cnVlO1xuXHRcdFx0XHRcdGludGVydmFsTWFuYWdlcih0cnVlLCAnc2VjdGlvbjMnLCA3MDAwKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHsgLy8gU1RPUCBBVVRPTUFURUQgU0xJREVTIE9OIFNFQ1RJT1BOIDMgSUYgVEhFIFNFQ1RJT04gSVMgTk9UIEFDVElWRS4gXFxcXFxuXHRcdFx0XHRpZihtYXN0ZXJPYmouc2VjdGlvbjMuaXNBdXRvbWF0ZWQgPT09IHRydWUpIHtcblx0XHRcdFx0XHRpbnRlcnZhbE1hbmFnZXIoZmFsc2UsICdzZWN0aW9uMycpO1xuXHRcdFx0XHRcdG1hc3Rlck9iai5zZWN0aW9uMy5pc0F1dG9tYXRlZCA9IGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmKCQoJyNzZWN0aW9uNC5hY3RpdmUnKS5sZW5ndGgpIHsgLy8gQVVUT01BVEUgVEhFIFNMSURFUyBPTiBTRUNUSU9QTiA0IEVWRVJZIDcgU0VDT05EUyBJRiBUSEUgU0VDVElPTiBJUyBBQ1RJVkUuIFxcXFxcblx0XHRcdFx0aWYobWFzdGVyT2JqLnNlY3Rpb240LmlzQXV0b21hdGVkICE9PSB0cnVlKSB7XG5cdFx0XHRcdFx0bWFzdGVyT2JqLnNlY3Rpb240LmlzQXV0b21hdGVkID0gdHJ1ZTtcblx0XHRcdFx0XHRpbnRlcnZhbE1hbmFnZXIodHJ1ZSwgJ3NlY3Rpb240JywgNzAwMCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7IC8vIFNUT1AgQVVUT01BVEVEIFNMSURFUyBPTiBTRUNUSU9QTiA0IElGIFRIRSBTRUNUSU9OIElTIE5PVCBBQ1RJVkUuIFxcXFxcblx0XHRcdFx0aWYobWFzdGVyT2JqLnNlY3Rpb240LmlzQXV0b21hdGVkID09PSB0cnVlKSB7XG5cdFx0XHRcdFx0aW50ZXJ2YWxNYW5hZ2VyKGZhbHNlLCAnc2VjdGlvbjQnKTtcblx0XHRcdFx0XHRtYXN0ZXJPYmouc2VjdGlvbjQuaXNBdXRvbWF0ZWQgPSBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sIDUwMCk7XG5cdH1cblxuLy8gQ09OVFJPTCBXSEFUIEhBUFBFTlMgV0hFTiBMSU5LUyBJTiBUSEUgTkFWL01FTlUgQVJFIENMSUNLRUQgXFxcXFxuXG5cdCQoJy5uYXZfbGluaycpLmNsaWNrKChlKSA9PiB7XG5cdFx0Y29uc3QgcGFnZUlkeCA9IHBhcnNlSW50KCQoZS50YXJnZXQpLmF0dHIoJ2RhdGEtaW5kZXgnKSk7XG5cdFx0JCgnI3Njcm9sbGVyV3JhcHBlcicpLm1vdmVUbyhwYWdlSWR4KTtcblx0XHQkKCcjbWVudUJsb2NrT3V0JykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuXG5cdFx0aWYoYnVyZ2VyLmNsYXNzTGlzdC5jb250YWlucygnYnVyZ2VyLS1hY3RpdmUnKSkge1xuICAgICAgbmF2LmNsYXNzTGlzdC5yZW1vdmUoJ25hdl9vcGVuJyk7XG4gICAgICBidXJnZXIuY2xhc3NMaXN0LnJlbW92ZSgnYnVyZ2VyLS1hY3RpdmUnKTtcbiAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnO1xuICAgIH0gXG5cdH0pO1xuXG4vLyBXSEVOIFRIRSBOQVYgSVMgT1BFTiBQUkVWRU5UIFVTRVIgRlJPTSBCRUlORyBBQkxFIFRPIENMSUNLIEFOWVRISU5HIEVMU0UgXFxcXFxuXG5cdCQoJyNtZW51QmxvY2tPdXQnKS5jbGljaygoZSkgPT4ge1xuXHQgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHR9KTtcblxuXHR2YXIgYnVyZ2VyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW4tYnVyZ2VyJyksIFxuICBuYXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbk5hdicpO1xuXG4vLyBDT05UUk9MIEZPUiBPUEVOIEFORCBDTE9TSU5HIFRIRSBNRU5VL05BViAgXFxcXFxuXG4gIGZ1bmN0aW9uIG5hdkNvbnRyb2woKSB7XG5cbiAgICBpZihidXJnZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdidXJnZXItLWFjdGl2ZScpKSB7XG4gICAgICBuYXYuY2xhc3NMaXN0LnJlbW92ZSgnbmF2X29wZW4nKTtcbiAgICAgIGJ1cmdlci5jbGFzc0xpc3QucmVtb3ZlKCdidXJnZXItLWFjdGl2ZScpO1xuICAgICAgJCgnI21lbnVCbG9ja091dCcpLmFkZENsYXNzKCdoaWRkZW4nKTtcbiAgICB9IFxuICAgIGVsc2Uge1xuICAgICAgYnVyZ2VyLmNsYXNzTGlzdC5hZGQoJ2J1cmdlci0tYWN0aXZlJyk7XG4gICAgICBuYXYuY2xhc3NMaXN0LmFkZCgnbmF2X29wZW4nKTtcbiAgICAgICQoJyNtZW51QmxvY2tPdXQnKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG4gICAgfVxuICB9XG4gIFxuLy8gT05MWSBMSVNURU4gRk9SIE1FTlUgQ0xJQ0tTIFdIRU4gTk9UIElOIENNUyBQUkVWSUVXIE1PREUgXFxcXFxuXG4gIGlmKCEkKGxvY2F0aW9uKS5hdHRyKCdocmVmJykuaW5jbHVkZXMoJ2luZGV4LnBocCcpKSB7XG4gIFx0YnVyZ2VyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgbmF2Q29udHJvbCk7XG4gIH1cblxuLy8gQ0xPU0UgVEhFIE5BViBJRiBUSEUgV0lORE9XIElTIE9WRVIgMTAwMFBYIFdJREUgXFxcXFxuXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBmdW5jdGlvbigpIHtcbiAgICBpZih3aW5kb3cuaW5uZXJXaWR0aCA+IDEwMDAgJiYgbmF2LmNsYXNzTGlzdC5jb250YWlucygnbmF2X29wZW4nKSkge1xuICAgICAgbmF2Q29udHJvbCgpO1xuICAgICAgbmF2LmNsYXNzTGlzdC5yZW1vdmUoJ25hdl9vcGVuJyk7XG4gICAgICAgJCgnI21lbnVCbG9ja091dCcpLmFkZENsYXNzKCdoaWRkZW4nKTtcbiAgICB9XG4gIH0pO1xuXG4vLyBUSElTIFNFVCBPRiBJRiBTVEFURU1FTlRTIElOSVRJQUxJU0VTIFRIRSBTUEVTSUZJQyBQQUdFUyBGT1IgUFJFVklFV0lORyBJTiBDTVMgQURNSU4uIFxcXFxcblxuICBpZigkKGxvY2F0aW9uKS5hdHRyKCdocmVmJykuaW5jbHVkZXMoJ2luZGV4LnBocCcpKSB7XG5cdFx0aWYoJChsb2NhdGlvbikuYXR0cignaHJlZicpLmluY2x1ZGVzKCdpbWFnaW5lLWlmJykpIHtcblx0XHRcdHBhZ2VMb2FkZXIoNCk7XG5cdFx0fVxuXHRcdGlmKCQobG9jYXRpb24pLmF0dHIoJ2hyZWYnKS5pbmNsdWRlcygnaG93LXdlLWlubm92YXRlJykpIHtcblx0XHRcdHBhZ2VMb2FkZXIoMyk7XG5cdFx0fVxuXHRcdGlmKCQobG9jYXRpb24pLmF0dHIoJ2hyZWYnKS5pbmNsdWRlcygnd29yay13aXRoLXVzJykpIHtcblx0XHRcdHBhZ2VMb2FkZXIoNSk7XG5cdFx0fVxuXHRcdGlmKCQobG9jYXRpb24pLmF0dHIoJ2hyZWYnKS5pbmNsdWRlcygnY29udGFjdC11cycpKSB7XG5cdFx0XHRwYWdlTG9hZGVyKDYpO1xuXHRcdH1cblx0XHRpZigkKGxvY2F0aW9uKS5hdHRyKCdocmVmJykuaW5jbHVkZXMoJ2hvbWUtdmlkZW8nKSkge1xuXHRcdFx0c2V0SW50ZXJ2YWwoKCkgPT4ge1xuXHRcdFx0XHRoaWRlTG9hZGluZ0FuaW1hdGlvbigpO1xuXHRcdFx0fSwgNTAwKVxuXHRcdH1cblx0fVxuXG4vLyBTV0lQRSBFVkVOVFMgREVURUNUT1IgRlVOQ1RJT04gXFxcXFxuXG4gIGZ1bmN0aW9uIGRldGVjdHN3aXBlKGVsLCBmdW5jKSB7XG5cdCAgbGV0IHN3aXBlX2RldCA9IHt9O1xuXHQgIHN3aXBlX2RldC5zWCA9IDA7IHN3aXBlX2RldC5zWSA9IDA7IHN3aXBlX2RldC5lWCA9IDA7IHN3aXBlX2RldC5lWSA9IDA7XG5cdCAgdmFyIG1pbl94ID0gMzA7ICAvL21pbiB4IHN3aXBlIGZvciBob3Jpem9udGFsIHN3aXBlXG5cdCAgdmFyIG1heF94ID0gMzA7ICAvL21heCB4IGRpZmZlcmVuY2UgZm9yIHZlcnRpY2FsIHN3aXBlXG5cdCAgdmFyIG1pbl95ID0gNTA7ICAvL21pbiB5IHN3aXBlIGZvciB2ZXJ0aWNhbCBzd2lwZVxuXHQgIHZhciBtYXhfeSA9IDYwOyAgLy9tYXggeSBkaWZmZXJlbmNlIGZvciBob3Jpem9udGFsIHN3aXBlXG5cdCAgdmFyIGRpcmVjID0gXCJcIjtcblx0ICBsZXQgZWxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWwpO1xuXHQgIGVsZS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JyxmdW5jdGlvbihlKXtcblx0ICAgIHZhciB0ID0gZS50b3VjaGVzWzBdO1xuXHQgICAgc3dpcGVfZGV0LnNYID0gdC5zY3JlZW5YOyBcblx0ICAgIHN3aXBlX2RldC5zWSA9IHQuc2NyZWVuWTtcblx0ICB9LGZhbHNlKTtcblx0ICBlbGUuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJyxmdW5jdGlvbihlKXtcblx0ICAgIGUucHJldmVudERlZmF1bHQoKTtcblx0ICAgIHZhciB0ID0gZS50b3VjaGVzWzBdO1xuXHQgICAgc3dpcGVfZGV0LmVYID0gdC5zY3JlZW5YOyBcblx0ICAgIHN3aXBlX2RldC5lWSA9IHQuc2NyZWVuWTsgICAgXG5cdCAgfSxmYWxzZSk7XG5cdCAgZWxlLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJyxmdW5jdGlvbihlKXtcblx0ICAgIC8vaG9yaXpvbnRhbCBkZXRlY3Rpb25cblx0ICAgIGlmICgoKChzd2lwZV9kZXQuZVggLSBtaW5feCA+IHN3aXBlX2RldC5zWCkgfHwgKHN3aXBlX2RldC5lWCArIG1pbl94IDwgc3dpcGVfZGV0LnNYKSkgJiYgKChzd2lwZV9kZXQuZVkgPCBzd2lwZV9kZXQuc1kgKyBtYXhfeSkgJiYgKHN3aXBlX2RldC5zWSA+IHN3aXBlX2RldC5lWSAtIG1heF95KSAmJiAoc3dpcGVfZGV0LmVYID4gMCkpKSkge1xuXHQgICAgICBpZihzd2lwZV9kZXQuZVggPiBzd2lwZV9kZXQuc1gpIGRpcmVjID0gXCJyXCI7XG5cdCAgICAgIGVsc2UgZGlyZWMgPSBcImxcIjtcblx0ICAgIH1cblx0ICAgIC8vdmVydGljYWwgZGV0ZWN0aW9uXG5cdCAgICBlbHNlIGlmICgoKChzd2lwZV9kZXQuZVkgLSBtaW5feSA+IHN3aXBlX2RldC5zWSkgfHwgKHN3aXBlX2RldC5lWSArIG1pbl95IDwgc3dpcGVfZGV0LnNZKSkgJiYgKChzd2lwZV9kZXQuZVggPCBzd2lwZV9kZXQuc1ggKyBtYXhfeCkgJiYgKHN3aXBlX2RldC5zWCA+IHN3aXBlX2RldC5lWCAtIG1heF94KSAmJiAoc3dpcGVfZGV0LmVZID4gMCkpKSkge1xuXHQgICAgICBpZihzd2lwZV9kZXQuZVkgPiBzd2lwZV9kZXQuc1kpIGRpcmVjID0gXCJkXCI7XG5cdCAgICAgIGVsc2UgZGlyZWMgPSBcInVcIjtcblx0ICAgIH1cblxuXHQgICAgaWYgKGRpcmVjICE9IFwiXCIpIHtcblx0ICAgICAgaWYodHlwZW9mIGZ1bmMgPT0gJ2Z1bmN0aW9uJykgZnVuYyhlbCxkaXJlYyk7XG5cdCAgICB9XG5cdCAgICBsZXQgZGlyZWMgPSBcIlwiO1xuXHQgICAgc3dpcGVfZGV0LnNYID0gMDsgc3dpcGVfZGV0LnNZID0gMDsgc3dpcGVfZGV0LmVYID0gMDsgc3dpcGVfZGV0LmVZID0gMDtcblx0ICB9LGZhbHNlKTsgIFxuXHR9XG5cbi8vIENIT1NFIFRIRSBORVhUIFNMSURFIFRPIFNIT1cgQU5EIENMSUNLIFRIRSBQQUdJTkFUSU9OIEJVVFRPTiBUSEFUIFJFTEFURVMgVE8gSVQuIFxcXFxcblxuXHRjb25zdCBzd2lwZUNvbnRyb2xsZXIgPSAoZWwsIGQpID0+IHtcblxuXHRcdGlmKGVsID09PSAnc2VjdGlvbjQnKSB7XG5cblx0XHRcdGNvbnN0IHNlY3Rpb240UGFnaW5hdGlvbkxlbmd0aCA9ICQoJy5zZWN0aW9uNFBhZ2luYXRvckJ1dHRvbicpLmxlbmd0aDtcblxuXHRcdFx0aWYoZCA9PT0gJ2wnKSB7XG5cblx0XHRcdFx0aWYoc2VjdGlvbjRJZHggPCBzZWN0aW9uNFBhZ2luYXRpb25MZW5ndGggLSAxKSB7XG5cdFx0XHRcdFx0c2VjdGlvbjRJZHgrKztcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRzZWN0aW9uNElkeCA9IDA7XG5cdFx0XHRcdH1cblx0XHRcdFx0XG5cdFx0XHRcdCQoJy5zZWN0aW9uNFBhZ2luYXRvckJ1dHRvbicpW3NlY3Rpb240SWR4XS5jbGljaygpO1xuXHRcdFx0fVxuXHRcdFx0aWYoZCA9PT0gJ3InKSB7XG5cblx0XHRcdFx0aWYoc2VjdGlvbjRJZHggPiAwKSB7XG5cdFx0XHRcdFx0c2VjdGlvbjRJZHgtLTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRzZWN0aW9uNElkeCA9IHNlY3Rpb240UGFnaW5hdGlvbkxlbmd0aCAtIDE7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQkKCcuc2VjdGlvbjRQYWdpbmF0b3JCdXR0b24nKVtzZWN0aW9uNElkeF0uY2xpY2soKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYoZWwgPT09ICdzZWN0aW9uMycpIHtcblxuXHRcdFx0Y29uc3Qgc2VjdGlvbjNQYWdpbmF0aW9uTGVuZ3RoID0gJCgnLnNlY3Rpb24zUGFnaW5hdG9yQnV0dG9uJykubGVuZ3RoO1xuXG5cdFx0XHRpZihkID09PSAnbCcpIHtcblxuXHRcdFx0XHRpZihzZWN0aW9uM0lkeCA8IHNlY3Rpb24zUGFnaW5hdGlvbkxlbmd0aCAtIDEpIHtcblx0XHRcdFx0XHRzZWN0aW9uM0lkeCsrO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHNlY3Rpb24zSWR4ID0gMDtcblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdFx0JCgnLnNlY3Rpb24zUGFnaW5hdG9yQnV0dG9uJylbc2VjdGlvbjNJZHhdLmNsaWNrKCk7XG5cdFx0XHR9XG5cdFx0XHRpZihkID09PSAncicpIHtcblxuXHRcdFx0XHRpZihzZWN0aW9uM0lkeCA+IDApIHtcblx0XHRcdFx0XHRzZWN0aW9uM0lkeC0tO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHNlY3Rpb24zSWR4ID0gc2VjdGlvbjNQYWdpbmF0aW9uTGVuZ3RoIC0gMTtcblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdFx0JCgnLnNlY3Rpb24zUGFnaW5hdG9yQnV0dG9uJylbc2VjdGlvbjNJZHhdLmNsaWNrKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cbi8vIElOSVRJQVRFIEZPUiBTV0lQRSBERVRFQ1RJT04gT04gU0VDVElPTlMgMyBBTkQgNCBFWENFUFQgSU4gQURNSU4gUFJFVklFVy4gXFxcXFxuXG5cdGlmKCEkKGxvY2F0aW9uKS5hdHRyKCdocmVmJykuaW5jbHVkZXMoJ2luZGV4LnBocCcpKSB7XG5cdFx0ZGV0ZWN0c3dpcGUoJ3NlY3Rpb240Jywgc3dpcGVDb250cm9sbGVyKTtcblx0XHRkZXRlY3Rzd2lwZSgnc2VjdGlvbjMnLCBzd2lwZUNvbnRyb2xsZXIpO1xuXHR9XG59KTsiXX0=
}).call(this,require("FT5ORs"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/fake_e4d99075.js","/")
},{"FT5ORs":4,"buffer":2}]},{},[5])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYW1pYW53aHl0ZS9Eb2N1bWVudHMvUHJvamVjdHMvY3JhZnRfZmFudGFzdGVjL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvZGFtaWFud2h5dGUvRG9jdW1lbnRzL1Byb2plY3RzL2NyYWZ0X2ZhbnRhc3RlYy9ub2RlX21vZHVsZXMvYmFzZTY0LWpzL2xpYi9iNjQuanMiLCIvVXNlcnMvZGFtaWFud2h5dGUvRG9jdW1lbnRzL1Byb2plY3RzL2NyYWZ0X2ZhbnRhc3RlYy9ub2RlX21vZHVsZXMvYnVmZmVyL2luZGV4LmpzIiwiL1VzZXJzL2RhbWlhbndoeXRlL0RvY3VtZW50cy9Qcm9qZWN0cy9jcmFmdF9mYW50YXN0ZWMvbm9kZV9tb2R1bGVzL2llZWU3NTQvaW5kZXguanMiLCIvVXNlcnMvZGFtaWFud2h5dGUvRG9jdW1lbnRzL1Byb2plY3RzL2NyYWZ0X2ZhbnRhc3RlYy9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwiL1VzZXJzL2RhbWlhbndoeXRlL0RvY3VtZW50cy9Qcm9qZWN0cy9jcmFmdF9mYW50YXN0ZWMvc291cmNlL2pzL2NvbWJpbmVkL2Zha2VfZTRkOTkwNzUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2bENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbnZhciBsb29rdXAgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLyc7XG5cbjsoZnVuY3Rpb24gKGV4cG9ydHMpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG4gIHZhciBBcnIgPSAodHlwZW9mIFVpbnQ4QXJyYXkgIT09ICd1bmRlZmluZWQnKVxuICAgID8gVWludDhBcnJheVxuICAgIDogQXJyYXlcblxuXHR2YXIgUExVUyAgID0gJysnLmNoYXJDb2RlQXQoMClcblx0dmFyIFNMQVNIICA9ICcvJy5jaGFyQ29kZUF0KDApXG5cdHZhciBOVU1CRVIgPSAnMCcuY2hhckNvZGVBdCgwKVxuXHR2YXIgTE9XRVIgID0gJ2EnLmNoYXJDb2RlQXQoMClcblx0dmFyIFVQUEVSICA9ICdBJy5jaGFyQ29kZUF0KDApXG5cdHZhciBQTFVTX1VSTF9TQUZFID0gJy0nLmNoYXJDb2RlQXQoMClcblx0dmFyIFNMQVNIX1VSTF9TQUZFID0gJ18nLmNoYXJDb2RlQXQoMClcblxuXHRmdW5jdGlvbiBkZWNvZGUgKGVsdCkge1xuXHRcdHZhciBjb2RlID0gZWx0LmNoYXJDb2RlQXQoMClcblx0XHRpZiAoY29kZSA9PT0gUExVUyB8fFxuXHRcdCAgICBjb2RlID09PSBQTFVTX1VSTF9TQUZFKVxuXHRcdFx0cmV0dXJuIDYyIC8vICcrJ1xuXHRcdGlmIChjb2RlID09PSBTTEFTSCB8fFxuXHRcdCAgICBjb2RlID09PSBTTEFTSF9VUkxfU0FGRSlcblx0XHRcdHJldHVybiA2MyAvLyAnLydcblx0XHRpZiAoY29kZSA8IE5VTUJFUilcblx0XHRcdHJldHVybiAtMSAvL25vIG1hdGNoXG5cdFx0aWYgKGNvZGUgPCBOVU1CRVIgKyAxMClcblx0XHRcdHJldHVybiBjb2RlIC0gTlVNQkVSICsgMjYgKyAyNlxuXHRcdGlmIChjb2RlIDwgVVBQRVIgKyAyNilcblx0XHRcdHJldHVybiBjb2RlIC0gVVBQRVJcblx0XHRpZiAoY29kZSA8IExPV0VSICsgMjYpXG5cdFx0XHRyZXR1cm4gY29kZSAtIExPV0VSICsgMjZcblx0fVxuXG5cdGZ1bmN0aW9uIGI2NFRvQnl0ZUFycmF5IChiNjQpIHtcblx0XHR2YXIgaSwgaiwgbCwgdG1wLCBwbGFjZUhvbGRlcnMsIGFyclxuXG5cdFx0aWYgKGI2NC5sZW5ndGggJSA0ID4gMCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHN0cmluZy4gTGVuZ3RoIG11c3QgYmUgYSBtdWx0aXBsZSBvZiA0Jylcblx0XHR9XG5cblx0XHQvLyB0aGUgbnVtYmVyIG9mIGVxdWFsIHNpZ25zIChwbGFjZSBob2xkZXJzKVxuXHRcdC8vIGlmIHRoZXJlIGFyZSB0d28gcGxhY2Vob2xkZXJzLCB0aGFuIHRoZSB0d28gY2hhcmFjdGVycyBiZWZvcmUgaXRcblx0XHQvLyByZXByZXNlbnQgb25lIGJ5dGVcblx0XHQvLyBpZiB0aGVyZSBpcyBvbmx5IG9uZSwgdGhlbiB0aGUgdGhyZWUgY2hhcmFjdGVycyBiZWZvcmUgaXQgcmVwcmVzZW50IDIgYnl0ZXNcblx0XHQvLyB0aGlzIGlzIGp1c3QgYSBjaGVhcCBoYWNrIHRvIG5vdCBkbyBpbmRleE9mIHR3aWNlXG5cdFx0dmFyIGxlbiA9IGI2NC5sZW5ndGhcblx0XHRwbGFjZUhvbGRlcnMgPSAnPScgPT09IGI2NC5jaGFyQXQobGVuIC0gMikgPyAyIDogJz0nID09PSBiNjQuY2hhckF0KGxlbiAtIDEpID8gMSA6IDBcblxuXHRcdC8vIGJhc2U2NCBpcyA0LzMgKyB1cCB0byB0d28gY2hhcmFjdGVycyBvZiB0aGUgb3JpZ2luYWwgZGF0YVxuXHRcdGFyciA9IG5ldyBBcnIoYjY0Lmxlbmd0aCAqIDMgLyA0IC0gcGxhY2VIb2xkZXJzKVxuXG5cdFx0Ly8gaWYgdGhlcmUgYXJlIHBsYWNlaG9sZGVycywgb25seSBnZXQgdXAgdG8gdGhlIGxhc3QgY29tcGxldGUgNCBjaGFyc1xuXHRcdGwgPSBwbGFjZUhvbGRlcnMgPiAwID8gYjY0Lmxlbmd0aCAtIDQgOiBiNjQubGVuZ3RoXG5cblx0XHR2YXIgTCA9IDBcblxuXHRcdGZ1bmN0aW9uIHB1c2ggKHYpIHtcblx0XHRcdGFycltMKytdID0gdlxuXHRcdH1cblxuXHRcdGZvciAoaSA9IDAsIGogPSAwOyBpIDwgbDsgaSArPSA0LCBqICs9IDMpIHtcblx0XHRcdHRtcCA9IChkZWNvZGUoYjY0LmNoYXJBdChpKSkgPDwgMTgpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAxKSkgPDwgMTIpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAyKSkgPDwgNikgfCBkZWNvZGUoYjY0LmNoYXJBdChpICsgMykpXG5cdFx0XHRwdXNoKCh0bXAgJiAweEZGMDAwMCkgPj4gMTYpXG5cdFx0XHRwdXNoKCh0bXAgJiAweEZGMDApID4+IDgpXG5cdFx0XHRwdXNoKHRtcCAmIDB4RkYpXG5cdFx0fVxuXG5cdFx0aWYgKHBsYWNlSG9sZGVycyA9PT0gMikge1xuXHRcdFx0dG1wID0gKGRlY29kZShiNjQuY2hhckF0KGkpKSA8PCAyKSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMSkpID4+IDQpXG5cdFx0XHRwdXNoKHRtcCAmIDB4RkYpXG5cdFx0fSBlbHNlIGlmIChwbGFjZUhvbGRlcnMgPT09IDEpIHtcblx0XHRcdHRtcCA9IChkZWNvZGUoYjY0LmNoYXJBdChpKSkgPDwgMTApIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAxKSkgPDwgNCkgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDIpKSA+PiAyKVxuXHRcdFx0cHVzaCgodG1wID4+IDgpICYgMHhGRilcblx0XHRcdHB1c2godG1wICYgMHhGRilcblx0XHR9XG5cblx0XHRyZXR1cm4gYXJyXG5cdH1cblxuXHRmdW5jdGlvbiB1aW50OFRvQmFzZTY0ICh1aW50OCkge1xuXHRcdHZhciBpLFxuXHRcdFx0ZXh0cmFCeXRlcyA9IHVpbnQ4Lmxlbmd0aCAlIDMsIC8vIGlmIHdlIGhhdmUgMSBieXRlIGxlZnQsIHBhZCAyIGJ5dGVzXG5cdFx0XHRvdXRwdXQgPSBcIlwiLFxuXHRcdFx0dGVtcCwgbGVuZ3RoXG5cblx0XHRmdW5jdGlvbiBlbmNvZGUgKG51bSkge1xuXHRcdFx0cmV0dXJuIGxvb2t1cC5jaGFyQXQobnVtKVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHRyaXBsZXRUb0Jhc2U2NCAobnVtKSB7XG5cdFx0XHRyZXR1cm4gZW5jb2RlKG51bSA+PiAxOCAmIDB4M0YpICsgZW5jb2RlKG51bSA+PiAxMiAmIDB4M0YpICsgZW5jb2RlKG51bSA+PiA2ICYgMHgzRikgKyBlbmNvZGUobnVtICYgMHgzRilcblx0XHR9XG5cblx0XHQvLyBnbyB0aHJvdWdoIHRoZSBhcnJheSBldmVyeSB0aHJlZSBieXRlcywgd2UnbGwgZGVhbCB3aXRoIHRyYWlsaW5nIHN0dWZmIGxhdGVyXG5cdFx0Zm9yIChpID0gMCwgbGVuZ3RoID0gdWludDgubGVuZ3RoIC0gZXh0cmFCeXRlczsgaSA8IGxlbmd0aDsgaSArPSAzKSB7XG5cdFx0XHR0ZW1wID0gKHVpbnQ4W2ldIDw8IDE2KSArICh1aW50OFtpICsgMV0gPDwgOCkgKyAodWludDhbaSArIDJdKVxuXHRcdFx0b3V0cHV0ICs9IHRyaXBsZXRUb0Jhc2U2NCh0ZW1wKVxuXHRcdH1cblxuXHRcdC8vIHBhZCB0aGUgZW5kIHdpdGggemVyb3MsIGJ1dCBtYWtlIHN1cmUgdG8gbm90IGZvcmdldCB0aGUgZXh0cmEgYnl0ZXNcblx0XHRzd2l0Y2ggKGV4dHJhQnl0ZXMpIHtcblx0XHRcdGNhc2UgMTpcblx0XHRcdFx0dGVtcCA9IHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDFdXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUodGVtcCA+PiAyKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKCh0ZW1wIDw8IDQpICYgMHgzRilcblx0XHRcdFx0b3V0cHV0ICs9ICc9PSdcblx0XHRcdFx0YnJlYWtcblx0XHRcdGNhc2UgMjpcblx0XHRcdFx0dGVtcCA9ICh1aW50OFt1aW50OC5sZW5ndGggLSAyXSA8PCA4KSArICh1aW50OFt1aW50OC5sZW5ndGggLSAxXSlcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSh0ZW1wID4+IDEwKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKCh0ZW1wID4+IDQpICYgMHgzRilcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSgodGVtcCA8PCAyKSAmIDB4M0YpXG5cdFx0XHRcdG91dHB1dCArPSAnPSdcblx0XHRcdFx0YnJlYWtcblx0XHR9XG5cblx0XHRyZXR1cm4gb3V0cHV0XG5cdH1cblxuXHRleHBvcnRzLnRvQnl0ZUFycmF5ID0gYjY0VG9CeXRlQXJyYXlcblx0ZXhwb3J0cy5mcm9tQnl0ZUFycmF5ID0gdWludDhUb0Jhc2U2NFxufSh0eXBlb2YgZXhwb3J0cyA9PT0gJ3VuZGVmaW5lZCcgPyAodGhpcy5iYXNlNjRqcyA9IHt9KSA6IGV4cG9ydHMpKVxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIkZUNU9Sc1wiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9iYXNlNjQtanMvbGliL2I2NC5qc1wiLFwiLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9iYXNlNjQtanMvbGliXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLyohXG4gKiBUaGUgYnVmZmVyIG1vZHVsZSBmcm9tIG5vZGUuanMsIGZvciB0aGUgYnJvd3Nlci5cbiAqXG4gKiBAYXV0aG9yICAgRmVyb3NzIEFib3VraGFkaWplaCA8ZmVyb3NzQGZlcm9zcy5vcmc+IDxodHRwOi8vZmVyb3NzLm9yZz5cbiAqIEBsaWNlbnNlICBNSVRcbiAqL1xuXG52YXIgYmFzZTY0ID0gcmVxdWlyZSgnYmFzZTY0LWpzJylcbnZhciBpZWVlNzU0ID0gcmVxdWlyZSgnaWVlZTc1NCcpXG5cbmV4cG9ydHMuQnVmZmVyID0gQnVmZmVyXG5leHBvcnRzLlNsb3dCdWZmZXIgPSBCdWZmZXJcbmV4cG9ydHMuSU5TUEVDVF9NQVhfQllURVMgPSA1MFxuQnVmZmVyLnBvb2xTaXplID0gODE5MlxuXG4vKipcbiAqIElmIGBCdWZmZXIuX3VzZVR5cGVkQXJyYXlzYDpcbiAqICAgPT09IHRydWUgICAgVXNlIFVpbnQ4QXJyYXkgaW1wbGVtZW50YXRpb24gKGZhc3Rlc3QpXG4gKiAgID09PSBmYWxzZSAgIFVzZSBPYmplY3QgaW1wbGVtZW50YXRpb24gKGNvbXBhdGlibGUgZG93biB0byBJRTYpXG4gKi9cbkJ1ZmZlci5fdXNlVHlwZWRBcnJheXMgPSAoZnVuY3Rpb24gKCkge1xuICAvLyBEZXRlY3QgaWYgYnJvd3NlciBzdXBwb3J0cyBUeXBlZCBBcnJheXMuIFN1cHBvcnRlZCBicm93c2VycyBhcmUgSUUgMTArLCBGaXJlZm94IDQrLFxuICAvLyBDaHJvbWUgNyssIFNhZmFyaSA1LjErLCBPcGVyYSAxMS42KywgaU9TIDQuMisuIElmIHRoZSBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgYWRkaW5nXG4gIC8vIHByb3BlcnRpZXMgdG8gYFVpbnQ4QXJyYXlgIGluc3RhbmNlcywgdGhlbiB0aGF0J3MgdGhlIHNhbWUgYXMgbm8gYFVpbnQ4QXJyYXlgIHN1cHBvcnRcbiAgLy8gYmVjYXVzZSB3ZSBuZWVkIHRvIGJlIGFibGUgdG8gYWRkIGFsbCB0aGUgbm9kZSBCdWZmZXIgQVBJIG1ldGhvZHMuIFRoaXMgaXMgYW4gaXNzdWVcbiAgLy8gaW4gRmlyZWZveCA0LTI5LiBOb3cgZml4ZWQ6IGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTY5NTQzOFxuICB0cnkge1xuICAgIHZhciBidWYgPSBuZXcgQXJyYXlCdWZmZXIoMClcbiAgICB2YXIgYXJyID0gbmV3IFVpbnQ4QXJyYXkoYnVmKVxuICAgIGFyci5mb28gPSBmdW5jdGlvbiAoKSB7IHJldHVybiA0MiB9XG4gICAgcmV0dXJuIDQyID09PSBhcnIuZm9vKCkgJiZcbiAgICAgICAgdHlwZW9mIGFyci5zdWJhcnJheSA9PT0gJ2Z1bmN0aW9uJyAvLyBDaHJvbWUgOS0xMCBsYWNrIGBzdWJhcnJheWBcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59KSgpXG5cbi8qKlxuICogQ2xhc3M6IEJ1ZmZlclxuICogPT09PT09PT09PT09PVxuICpcbiAqIFRoZSBCdWZmZXIgY29uc3RydWN0b3IgcmV0dXJucyBpbnN0YW5jZXMgb2YgYFVpbnQ4QXJyYXlgIHRoYXQgYXJlIGF1Z21lbnRlZFxuICogd2l0aCBmdW5jdGlvbiBwcm9wZXJ0aWVzIGZvciBhbGwgdGhlIG5vZGUgYEJ1ZmZlcmAgQVBJIGZ1bmN0aW9ucy4gV2UgdXNlXG4gKiBgVWludDhBcnJheWAgc28gdGhhdCBzcXVhcmUgYnJhY2tldCBub3RhdGlvbiB3b3JrcyBhcyBleHBlY3RlZCAtLSBpdCByZXR1cm5zXG4gKiBhIHNpbmdsZSBvY3RldC5cbiAqXG4gKiBCeSBhdWdtZW50aW5nIHRoZSBpbnN0YW5jZXMsIHdlIGNhbiBhdm9pZCBtb2RpZnlpbmcgdGhlIGBVaW50OEFycmF5YFxuICogcHJvdG90eXBlLlxuICovXG5mdW5jdGlvbiBCdWZmZXIgKHN1YmplY3QsIGVuY29kaW5nLCBub1plcm8pIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEJ1ZmZlcikpXG4gICAgcmV0dXJuIG5ldyBCdWZmZXIoc3ViamVjdCwgZW5jb2RpbmcsIG5vWmVybylcblxuICB2YXIgdHlwZSA9IHR5cGVvZiBzdWJqZWN0XG5cbiAgLy8gV29ya2Fyb3VuZDogbm9kZSdzIGJhc2U2NCBpbXBsZW1lbnRhdGlvbiBhbGxvd3MgZm9yIG5vbi1wYWRkZWQgc3RyaW5nc1xuICAvLyB3aGlsZSBiYXNlNjQtanMgZG9lcyBub3QuXG4gIGlmIChlbmNvZGluZyA9PT0gJ2Jhc2U2NCcgJiYgdHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICBzdWJqZWN0ID0gc3RyaW5ndHJpbShzdWJqZWN0KVxuICAgIHdoaWxlIChzdWJqZWN0Lmxlbmd0aCAlIDQgIT09IDApIHtcbiAgICAgIHN1YmplY3QgPSBzdWJqZWN0ICsgJz0nXG4gICAgfVxuICB9XG5cbiAgLy8gRmluZCB0aGUgbGVuZ3RoXG4gIHZhciBsZW5ndGhcbiAgaWYgKHR5cGUgPT09ICdudW1iZXInKVxuICAgIGxlbmd0aCA9IGNvZXJjZShzdWJqZWN0KVxuICBlbHNlIGlmICh0eXBlID09PSAnc3RyaW5nJylcbiAgICBsZW5ndGggPSBCdWZmZXIuYnl0ZUxlbmd0aChzdWJqZWN0LCBlbmNvZGluZylcbiAgZWxzZSBpZiAodHlwZSA9PT0gJ29iamVjdCcpXG4gICAgbGVuZ3RoID0gY29lcmNlKHN1YmplY3QubGVuZ3RoKSAvLyBhc3N1bWUgdGhhdCBvYmplY3QgaXMgYXJyYXktbGlrZVxuICBlbHNlXG4gICAgdGhyb3cgbmV3IEVycm9yKCdGaXJzdCBhcmd1bWVudCBuZWVkcyB0byBiZSBhIG51bWJlciwgYXJyYXkgb3Igc3RyaW5nLicpXG5cbiAgdmFyIGJ1ZlxuICBpZiAoQnVmZmVyLl91c2VUeXBlZEFycmF5cykge1xuICAgIC8vIFByZWZlcnJlZDogUmV0dXJuIGFuIGF1Z21lbnRlZCBgVWludDhBcnJheWAgaW5zdGFuY2UgZm9yIGJlc3QgcGVyZm9ybWFuY2VcbiAgICBidWYgPSBCdWZmZXIuX2F1Z21lbnQobmV3IFVpbnQ4QXJyYXkobGVuZ3RoKSlcbiAgfSBlbHNlIHtcbiAgICAvLyBGYWxsYmFjazogUmV0dXJuIFRISVMgaW5zdGFuY2Ugb2YgQnVmZmVyIChjcmVhdGVkIGJ5IGBuZXdgKVxuICAgIGJ1ZiA9IHRoaXNcbiAgICBidWYubGVuZ3RoID0gbGVuZ3RoXG4gICAgYnVmLl9pc0J1ZmZlciA9IHRydWVcbiAgfVxuXG4gIHZhciBpXG4gIGlmIChCdWZmZXIuX3VzZVR5cGVkQXJyYXlzICYmIHR5cGVvZiBzdWJqZWN0LmJ5dGVMZW5ndGggPT09ICdudW1iZXInKSB7XG4gICAgLy8gU3BlZWQgb3B0aW1pemF0aW9uIC0tIHVzZSBzZXQgaWYgd2UncmUgY29weWluZyBmcm9tIGEgdHlwZWQgYXJyYXlcbiAgICBidWYuX3NldChzdWJqZWN0KVxuICB9IGVsc2UgaWYgKGlzQXJyYXlpc2goc3ViamVjdCkpIHtcbiAgICAvLyBUcmVhdCBhcnJheS1pc2ggb2JqZWN0cyBhcyBhIGJ5dGUgYXJyYXlcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChCdWZmZXIuaXNCdWZmZXIoc3ViamVjdCkpXG4gICAgICAgIGJ1ZltpXSA9IHN1YmplY3QucmVhZFVJbnQ4KGkpXG4gICAgICBlbHNlXG4gICAgICAgIGJ1ZltpXSA9IHN1YmplY3RbaV1cbiAgICB9XG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICBidWYud3JpdGUoc3ViamVjdCwgMCwgZW5jb2RpbmcpXG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gJ251bWJlcicgJiYgIUJ1ZmZlci5fdXNlVHlwZWRBcnJheXMgJiYgIW5vWmVybykge1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgYnVmW2ldID0gMFxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBidWZcbn1cblxuLy8gU1RBVElDIE1FVEhPRFNcbi8vID09PT09PT09PT09PT09XG5cbkJ1ZmZlci5pc0VuY29kaW5nID0gZnVuY3Rpb24gKGVuY29kaW5nKSB7XG4gIHN3aXRjaCAoU3RyaW5nKGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgY2FzZSAnYXNjaWknOlxuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICBjYXNlICdyYXcnOlxuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5CdWZmZXIuaXNCdWZmZXIgPSBmdW5jdGlvbiAoYikge1xuICByZXR1cm4gISEoYiAhPT0gbnVsbCAmJiBiICE9PSB1bmRlZmluZWQgJiYgYi5faXNCdWZmZXIpXG59XG5cbkJ1ZmZlci5ieXRlTGVuZ3RoID0gZnVuY3Rpb24gKHN0ciwgZW5jb2RpbmcpIHtcbiAgdmFyIHJldFxuICBzdHIgPSBzdHIgKyAnJ1xuICBzd2l0Y2ggKGVuY29kaW5nIHx8ICd1dGY4Jykge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgICByZXQgPSBzdHIubGVuZ3RoIC8gMlxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgICByZXQgPSB1dGY4VG9CeXRlcyhzdHIpLmxlbmd0aFxuICAgICAgYnJlYWtcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICBjYXNlICdyYXcnOlxuICAgICAgcmV0ID0gc3RyLmxlbmd0aFxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgcmV0ID0gYmFzZTY0VG9CeXRlcyhzdHIpLmxlbmd0aFxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0ID0gc3RyLmxlbmd0aCAqIDJcbiAgICAgIGJyZWFrXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBlbmNvZGluZycpXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG5CdWZmZXIuY29uY2F0ID0gZnVuY3Rpb24gKGxpc3QsIHRvdGFsTGVuZ3RoKSB7XG4gIGFzc2VydChpc0FycmF5KGxpc3QpLCAnVXNhZ2U6IEJ1ZmZlci5jb25jYXQobGlzdCwgW3RvdGFsTGVuZ3RoXSlcXG4nICtcbiAgICAgICdsaXN0IHNob3VsZCBiZSBhbiBBcnJheS4nKVxuXG4gIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBuZXcgQnVmZmVyKDApXG4gIH0gZWxzZSBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gbGlzdFswXVxuICB9XG5cbiAgdmFyIGlcbiAgaWYgKHR5cGVvZiB0b3RhbExlbmd0aCAhPT0gJ251bWJlcicpIHtcbiAgICB0b3RhbExlbmd0aCA9IDBcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgdG90YWxMZW5ndGggKz0gbGlzdFtpXS5sZW5ndGhcbiAgICB9XG4gIH1cblxuICB2YXIgYnVmID0gbmV3IEJ1ZmZlcih0b3RhbExlbmd0aClcbiAgdmFyIHBvcyA9IDBcbiAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV1cbiAgICBpdGVtLmNvcHkoYnVmLCBwb3MpXG4gICAgcG9zICs9IGl0ZW0ubGVuZ3RoXG4gIH1cbiAgcmV0dXJuIGJ1ZlxufVxuXG4vLyBCVUZGRVIgSU5TVEFOQ0UgTUVUSE9EU1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT1cblxuZnVuY3Rpb24gX2hleFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgb2Zmc2V0ID0gTnVtYmVyKG9mZnNldCkgfHwgMFxuICB2YXIgcmVtYWluaW5nID0gYnVmLmxlbmd0aCAtIG9mZnNldFxuICBpZiAoIWxlbmd0aCkge1xuICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICB9IGVsc2Uge1xuICAgIGxlbmd0aCA9IE51bWJlcihsZW5ndGgpXG4gICAgaWYgKGxlbmd0aCA+IHJlbWFpbmluZykge1xuICAgICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gICAgfVxuICB9XG5cbiAgLy8gbXVzdCBiZSBhbiBldmVuIG51bWJlciBvZiBkaWdpdHNcbiAgdmFyIHN0ckxlbiA9IHN0cmluZy5sZW5ndGhcbiAgYXNzZXJ0KHN0ckxlbiAlIDIgPT09IDAsICdJbnZhbGlkIGhleCBzdHJpbmcnKVxuXG4gIGlmIChsZW5ndGggPiBzdHJMZW4gLyAyKSB7XG4gICAgbGVuZ3RoID0gc3RyTGVuIC8gMlxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgYnl0ZSA9IHBhcnNlSW50KHN0cmluZy5zdWJzdHIoaSAqIDIsIDIpLCAxNilcbiAgICBhc3NlcnQoIWlzTmFOKGJ5dGUpLCAnSW52YWxpZCBoZXggc3RyaW5nJylcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSBieXRlXG4gIH1cbiAgQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPSBpICogMlxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiBfdXRmOFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKHV0ZjhUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuZnVuY3Rpb24gX2FzY2lpV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgY2hhcnNXcml0dGVuID0gQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPVxuICAgIGJsaXRCdWZmZXIoYXNjaWlUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuZnVuY3Rpb24gX2JpbmFyeVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIF9hc2NpaVdyaXRlKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gX2Jhc2U2NFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKGJhc2U2NFRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbiAgcmV0dXJuIGNoYXJzV3JpdHRlblxufVxuXG5mdW5jdGlvbiBfdXRmMTZsZVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKHV0ZjE2bGVUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uIChzdHJpbmcsIG9mZnNldCwgbGVuZ3RoLCBlbmNvZGluZykge1xuICAvLyBTdXBwb3J0IGJvdGggKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgsIGVuY29kaW5nKVxuICAvLyBhbmQgdGhlIGxlZ2FjeSAoc3RyaW5nLCBlbmNvZGluZywgb2Zmc2V0LCBsZW5ndGgpXG4gIGlmIChpc0Zpbml0ZShvZmZzZXQpKSB7XG4gICAgaWYgKCFpc0Zpbml0ZShsZW5ndGgpKSB7XG4gICAgICBlbmNvZGluZyA9IGxlbmd0aFxuICAgICAgbGVuZ3RoID0gdW5kZWZpbmVkXG4gICAgfVxuICB9IGVsc2UgeyAgLy8gbGVnYWN5XG4gICAgdmFyIHN3YXAgPSBlbmNvZGluZ1xuICAgIGVuY29kaW5nID0gb2Zmc2V0XG4gICAgb2Zmc2V0ID0gbGVuZ3RoXG4gICAgbGVuZ3RoID0gc3dhcFxuICB9XG5cbiAgb2Zmc2V0ID0gTnVtYmVyKG9mZnNldCkgfHwgMFxuICB2YXIgcmVtYWluaW5nID0gdGhpcy5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgfSBlbHNlIHtcbiAgICBsZW5ndGggPSBOdW1iZXIobGVuZ3RoKVxuICAgIGlmIChsZW5ndGggPiByZW1haW5pbmcpIHtcbiAgICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICAgIH1cbiAgfVxuICBlbmNvZGluZyA9IFN0cmluZyhlbmNvZGluZyB8fCAndXRmOCcpLnRvTG93ZXJDYXNlKClcblxuICB2YXIgcmV0XG4gIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgICAgcmV0ID0gX2hleFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIHJldCA9IF91dGY4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYXNjaWknOlxuICAgICAgcmV0ID0gX2FzY2lpV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgIHJldCA9IF9iaW5hcnlXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgcmV0ID0gX2Jhc2U2NFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXQgPSBfdXRmMTZsZVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2RpbmcnKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIChlbmNvZGluZywgc3RhcnQsIGVuZCkge1xuICB2YXIgc2VsZiA9IHRoaXNcblxuICBlbmNvZGluZyA9IFN0cmluZyhlbmNvZGluZyB8fCAndXRmOCcpLnRvTG93ZXJDYXNlKClcbiAgc3RhcnQgPSBOdW1iZXIoc3RhcnQpIHx8IDBcbiAgZW5kID0gKGVuZCAhPT0gdW5kZWZpbmVkKVxuICAgID8gTnVtYmVyKGVuZClcbiAgICA6IGVuZCA9IHNlbGYubGVuZ3RoXG5cbiAgLy8gRmFzdHBhdGggZW1wdHkgc3RyaW5nc1xuICBpZiAoZW5kID09PSBzdGFydClcbiAgICByZXR1cm4gJydcblxuICB2YXIgcmV0XG4gIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgICAgcmV0ID0gX2hleFNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIHJldCA9IF91dGY4U2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYXNjaWknOlxuICAgICAgcmV0ID0gX2FzY2lpU2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgIHJldCA9IF9iaW5hcnlTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgcmV0ID0gX2Jhc2U2NFNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXQgPSBfdXRmMTZsZVNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2RpbmcnKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ0J1ZmZlcicsXG4gICAgZGF0YTogQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodGhpcy5fYXJyIHx8IHRoaXMsIDApXG4gIH1cbn1cblxuLy8gY29weSh0YXJnZXRCdWZmZXIsIHRhcmdldFN0YXJ0PTAsIHNvdXJjZVN0YXJ0PTAsIHNvdXJjZUVuZD1idWZmZXIubGVuZ3RoKVxuQnVmZmVyLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24gKHRhcmdldCwgdGFyZ2V0X3N0YXJ0LCBzdGFydCwgZW5kKSB7XG4gIHZhciBzb3VyY2UgPSB0aGlzXG5cbiAgaWYgKCFzdGFydCkgc3RhcnQgPSAwXG4gIGlmICghZW5kICYmIGVuZCAhPT0gMCkgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKCF0YXJnZXRfc3RhcnQpIHRhcmdldF9zdGFydCA9IDBcblxuICAvLyBDb3B5IDAgYnl0ZXM7IHdlJ3JlIGRvbmVcbiAgaWYgKGVuZCA9PT0gc3RhcnQpIHJldHVyblxuICBpZiAodGFyZ2V0Lmxlbmd0aCA9PT0gMCB8fCBzb3VyY2UubGVuZ3RoID09PSAwKSByZXR1cm5cblxuICAvLyBGYXRhbCBlcnJvciBjb25kaXRpb25zXG4gIGFzc2VydChlbmQgPj0gc3RhcnQsICdzb3VyY2VFbmQgPCBzb3VyY2VTdGFydCcpXG4gIGFzc2VydCh0YXJnZXRfc3RhcnQgPj0gMCAmJiB0YXJnZXRfc3RhcnQgPCB0YXJnZXQubGVuZ3RoLFxuICAgICAgJ3RhcmdldFN0YXJ0IG91dCBvZiBib3VuZHMnKVxuICBhc3NlcnQoc3RhcnQgPj0gMCAmJiBzdGFydCA8IHNvdXJjZS5sZW5ndGgsICdzb3VyY2VTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgYXNzZXJ0KGVuZCA+PSAwICYmIGVuZCA8PSBzb3VyY2UubGVuZ3RoLCAnc291cmNlRW5kIG91dCBvZiBib3VuZHMnKVxuXG4gIC8vIEFyZSB3ZSBvb2I/XG4gIGlmIChlbmQgPiB0aGlzLmxlbmd0aClcbiAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAodGFyZ2V0Lmxlbmd0aCAtIHRhcmdldF9zdGFydCA8IGVuZCAtIHN0YXJ0KVxuICAgIGVuZCA9IHRhcmdldC5sZW5ndGggLSB0YXJnZXRfc3RhcnQgKyBzdGFydFxuXG4gIHZhciBsZW4gPSBlbmQgLSBzdGFydFxuXG4gIGlmIChsZW4gPCAxMDAgfHwgIUJ1ZmZlci5fdXNlVHlwZWRBcnJheXMpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgdGFyZ2V0W2kgKyB0YXJnZXRfc3RhcnRdID0gdGhpc1tpICsgc3RhcnRdXG4gIH0gZWxzZSB7XG4gICAgdGFyZ2V0Ll9zZXQodGhpcy5zdWJhcnJheShzdGFydCwgc3RhcnQgKyBsZW4pLCB0YXJnZXRfc3RhcnQpXG4gIH1cbn1cblxuZnVuY3Rpb24gX2Jhc2U2NFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKHN0YXJ0ID09PSAwICYmIGVuZCA9PT0gYnVmLmxlbmd0aCkge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1Zi5zbGljZShzdGFydCwgZW5kKSlcbiAgfVxufVxuXG5mdW5jdGlvbiBfdXRmOFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJlcyA9ICcnXG4gIHZhciB0bXAgPSAnJ1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICBpZiAoYnVmW2ldIDw9IDB4N0YpIHtcbiAgICAgIHJlcyArPSBkZWNvZGVVdGY4Q2hhcih0bXApICsgU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0pXG4gICAgICB0bXAgPSAnJ1xuICAgIH0gZWxzZSB7XG4gICAgICB0bXAgKz0gJyUnICsgYnVmW2ldLnRvU3RyaW5nKDE2KVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXMgKyBkZWNvZGVVdGY4Q2hhcih0bXApXG59XG5cbmZ1bmN0aW9uIF9hc2NpaVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJldCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKylcbiAgICByZXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0pXG4gIHJldHVybiByZXRcbn1cblxuZnVuY3Rpb24gX2JpbmFyeVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgcmV0dXJuIF9hc2NpaVNsaWNlKGJ1Ziwgc3RhcnQsIGVuZClcbn1cblxuZnVuY3Rpb24gX2hleFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcblxuICBpZiAoIXN0YXJ0IHx8IHN0YXJ0IDwgMCkgc3RhcnQgPSAwXG4gIGlmICghZW5kIHx8IGVuZCA8IDAgfHwgZW5kID4gbGVuKSBlbmQgPSBsZW5cblxuICB2YXIgb3V0ID0gJydcbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICBvdXQgKz0gdG9IZXgoYnVmW2ldKVxuICB9XG4gIHJldHVybiBvdXRcbn1cblxuZnVuY3Rpb24gX3V0ZjE2bGVTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciBieXRlcyA9IGJ1Zi5zbGljZShzdGFydCwgZW5kKVxuICB2YXIgcmVzID0gJydcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkgKz0gMikge1xuICAgIHJlcyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ5dGVzW2ldICsgYnl0ZXNbaSsxXSAqIDI1NilcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc2xpY2UgPSBmdW5jdGlvbiAoc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgc3RhcnQgPSBjbGFtcChzdGFydCwgbGVuLCAwKVxuICBlbmQgPSBjbGFtcChlbmQsIGxlbiwgbGVuKVxuXG4gIGlmIChCdWZmZXIuX3VzZVR5cGVkQXJyYXlzKSB7XG4gICAgcmV0dXJuIEJ1ZmZlci5fYXVnbWVudCh0aGlzLnN1YmFycmF5KHN0YXJ0LCBlbmQpKVxuICB9IGVsc2Uge1xuICAgIHZhciBzbGljZUxlbiA9IGVuZCAtIHN0YXJ0XG4gICAgdmFyIG5ld0J1ZiA9IG5ldyBCdWZmZXIoc2xpY2VMZW4sIHVuZGVmaW5lZCwgdHJ1ZSlcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNsaWNlTGVuOyBpKyspIHtcbiAgICAgIG5ld0J1ZltpXSA9IHRoaXNbaSArIHN0YXJ0XVxuICAgIH1cbiAgICByZXR1cm4gbmV3QnVmXG4gIH1cbn1cblxuLy8gYGdldGAgd2lsbCBiZSByZW1vdmVkIGluIE5vZGUgMC4xMytcbkJ1ZmZlci5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKG9mZnNldCkge1xuICBjb25zb2xlLmxvZygnLmdldCgpIGlzIGRlcHJlY2F0ZWQuIEFjY2VzcyB1c2luZyBhcnJheSBpbmRleGVzIGluc3RlYWQuJylcbiAgcmV0dXJuIHRoaXMucmVhZFVJbnQ4KG9mZnNldClcbn1cblxuLy8gYHNldGAgd2lsbCBiZSByZW1vdmVkIGluIE5vZGUgMC4xMytcbkJ1ZmZlci5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKHYsIG9mZnNldCkge1xuICBjb25zb2xlLmxvZygnLnNldCgpIGlzIGRlcHJlY2F0ZWQuIEFjY2VzcyB1c2luZyBhcnJheSBpbmRleGVzIGluc3RlYWQuJylcbiAgcmV0dXJuIHRoaXMud3JpdGVVSW50OCh2LCBvZmZzZXQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQ4ID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IHRoaXMubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aClcbiAgICByZXR1cm5cblxuICByZXR1cm4gdGhpc1tvZmZzZXRdXG59XG5cbmZ1bmN0aW9uIF9yZWFkVUludDE2IChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDEgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgdmFyIHZhbFxuICBpZiAobGl0dGxlRW5kaWFuKSB7XG4gICAgdmFsID0gYnVmW29mZnNldF1cbiAgICBpZiAob2Zmc2V0ICsgMSA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgMV0gPDwgOFxuICB9IGVsc2Uge1xuICAgIHZhbCA9IGJ1ZltvZmZzZXRdIDw8IDhcbiAgICBpZiAob2Zmc2V0ICsgMSA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgMV1cbiAgfVxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDE2KHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDE2KHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfcmVhZFVJbnQzMiAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIHZhciB2YWxcbiAgaWYgKGxpdHRsZUVuZGlhbikge1xuICAgIGlmIChvZmZzZXQgKyAyIDwgbGVuKVxuICAgICAgdmFsID0gYnVmW29mZnNldCArIDJdIDw8IDE2XG4gICAgaWYgKG9mZnNldCArIDEgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDFdIDw8IDhcbiAgICB2YWwgfD0gYnVmW29mZnNldF1cbiAgICBpZiAob2Zmc2V0ICsgMyA8IGxlbilcbiAgICAgIHZhbCA9IHZhbCArIChidWZbb2Zmc2V0ICsgM10gPDwgMjQgPj4+IDApXG4gIH0gZWxzZSB7XG4gICAgaWYgKG9mZnNldCArIDEgPCBsZW4pXG4gICAgICB2YWwgPSBidWZbb2Zmc2V0ICsgMV0gPDwgMTZcbiAgICBpZiAob2Zmc2V0ICsgMiA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgMl0gPDwgOFxuICAgIGlmIChvZmZzZXQgKyAzIDwgbGVuKVxuICAgICAgdmFsIHw9IGJ1ZltvZmZzZXQgKyAzXVxuICAgIHZhbCA9IHZhbCArIChidWZbb2Zmc2V0XSA8PCAyNCA+Pj4gMClcbiAgfVxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDMyKHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDMyKHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQ4ID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsXG4gICAgICAgICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IHRoaXMubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aClcbiAgICByZXR1cm5cblxuICB2YXIgbmVnID0gdGhpc1tvZmZzZXRdICYgMHg4MFxuICBpZiAobmVnKVxuICAgIHJldHVybiAoMHhmZiAtIHRoaXNbb2Zmc2V0XSArIDEpICogLTFcbiAgZWxzZVxuICAgIHJldHVybiB0aGlzW29mZnNldF1cbn1cblxuZnVuY3Rpb24gX3JlYWRJbnQxNiAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAxIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIHZhciB2YWwgPSBfcmVhZFVJbnQxNihidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCB0cnVlKVxuICB2YXIgbmVnID0gdmFsICYgMHg4MDAwXG4gIGlmIChuZWcpXG4gICAgcmV0dXJuICgweGZmZmYgLSB2YWwgKyAxKSAqIC0xXG4gIGVsc2VcbiAgICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2TEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRJbnQxNih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MTYodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF9yZWFkSW50MzIgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICB2YXIgdmFsID0gX3JlYWRVSW50MzIoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgdHJ1ZSlcbiAgdmFyIG5lZyA9IHZhbCAmIDB4ODAwMDAwMDBcbiAgaWYgKG5lZylcbiAgICByZXR1cm4gKDB4ZmZmZmZmZmYgLSB2YWwgKyAxKSAqIC0xXG4gIGVsc2VcbiAgICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyTEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRJbnQzMih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MzIodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF9yZWFkRmxvYXQgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgcmV0dXJuIGllZWU3NTQucmVhZChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCAyMywgNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEZsb2F0KHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0QkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRGbG9hdCh0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3JlYWREb3VibGUgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCArIDcgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgcmV0dXJuIGllZWU3NTQucmVhZChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCA1MiwgOClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlTEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWREb3VibGUodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlQkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWREb3VibGUodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50OCA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgPCB0aGlzLmxlbmd0aCwgJ3RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZ1aW50KHZhbHVlLCAweGZmKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aCkgcmV0dXJuXG5cbiAgdGhpc1tvZmZzZXRdID0gdmFsdWVcbn1cblxuZnVuY3Rpb24gX3dyaXRlVUludDE2IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDEgPCBidWYubGVuZ3RoLCAndHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnVpbnQodmFsdWUsIDB4ZmZmZilcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGZvciAodmFyIGkgPSAwLCBqID0gTWF0aC5taW4obGVuIC0gb2Zmc2V0LCAyKTsgaSA8IGo7IGkrKykge1xuICAgIGJ1ZltvZmZzZXQgKyBpXSA9XG4gICAgICAgICh2YWx1ZSAmICgweGZmIDw8ICg4ICogKGxpdHRsZUVuZGlhbiA/IGkgOiAxIC0gaSkpKSkgPj4+XG4gICAgICAgICAgICAobGl0dGxlRW5kaWFuID8gaSA6IDEgLSBpKSAqIDhcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2TEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2QkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlVUludDMyIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAndHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnVpbnQodmFsdWUsIDB4ZmZmZmZmZmYpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBmb3IgKHZhciBpID0gMCwgaiA9IE1hdGgubWluKGxlbiAtIG9mZnNldCwgNCk7IGkgPCBqOyBpKyspIHtcbiAgICBidWZbb2Zmc2V0ICsgaV0gPVxuICAgICAgICAodmFsdWUgPj4+IChsaXR0bGVFbmRpYW4gPyBpIDogMyAtIGkpICogOCkgJiAweGZmXG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQ4ID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IHRoaXMubGVuZ3RoLCAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnNpbnQodmFsdWUsIDB4N2YsIC0weDgwKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aClcbiAgICByZXR1cm5cblxuICBpZiAodmFsdWUgPj0gMClcbiAgICB0aGlzLndyaXRlVUludDgodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpXG4gIGVsc2VcbiAgICB0aGlzLndyaXRlVUludDgoMHhmZiArIHZhbHVlICsgMSwgb2Zmc2V0LCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlSW50MTYgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMSA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmc2ludCh2YWx1ZSwgMHg3ZmZmLCAtMHg4MDAwKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgaWYgKHZhbHVlID49IDApXG4gICAgX3dyaXRlVUludDE2KGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydClcbiAgZWxzZVxuICAgIF93cml0ZVVJbnQxNihidWYsIDB4ZmZmZiArIHZhbHVlICsgMSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2QkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVJbnQzMiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZzaW50KHZhbHVlLCAweDdmZmZmZmZmLCAtMHg4MDAwMDAwMClcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGlmICh2YWx1ZSA+PSAwKVxuICAgIF93cml0ZVVJbnQzMihidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpXG4gIGVsc2VcbiAgICBfd3JpdGVVSW50MzIoYnVmLCAweGZmZmZmZmZmICsgdmFsdWUgKyAxLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZUZsb2F0IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZklFRUU3NTQodmFsdWUsIDMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgsIC0zLjQwMjgyMzQ2NjM4NTI4ODZlKzM4KVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdExFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZURvdWJsZSAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyA3IDwgYnVmLmxlbmd0aCxcbiAgICAgICAgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZJRUVFNzU0KHZhbHVlLCAxLjc5NzY5MzEzNDg2MjMxNTdFKzMwOCwgLTEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4KVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgNTIsIDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG4vLyBmaWxsKHZhbHVlLCBzdGFydD0wLCBlbmQ9YnVmZmVyLmxlbmd0aClcbkJ1ZmZlci5wcm90b3R5cGUuZmlsbCA9IGZ1bmN0aW9uICh2YWx1ZSwgc3RhcnQsIGVuZCkge1xuICBpZiAoIXZhbHVlKSB2YWx1ZSA9IDBcbiAgaWYgKCFzdGFydCkgc3RhcnQgPSAwXG4gIGlmICghZW5kKSBlbmQgPSB0aGlzLmxlbmd0aFxuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgdmFsdWUgPSB2YWx1ZS5jaGFyQ29kZUF0KDApXG4gIH1cblxuICBhc3NlcnQodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiAhaXNOYU4odmFsdWUpLCAndmFsdWUgaXMgbm90IGEgbnVtYmVyJylcbiAgYXNzZXJ0KGVuZCA+PSBzdGFydCwgJ2VuZCA8IHN0YXJ0JylcblxuICAvLyBGaWxsIDAgYnl0ZXM7IHdlJ3JlIGRvbmVcbiAgaWYgKGVuZCA9PT0gc3RhcnQpIHJldHVyblxuICBpZiAodGhpcy5sZW5ndGggPT09IDApIHJldHVyblxuXG4gIGFzc2VydChzdGFydCA+PSAwICYmIHN0YXJ0IDwgdGhpcy5sZW5ndGgsICdzdGFydCBvdXQgb2YgYm91bmRzJylcbiAgYXNzZXJ0KGVuZCA+PSAwICYmIGVuZCA8PSB0aGlzLmxlbmd0aCwgJ2VuZCBvdXQgb2YgYm91bmRzJylcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgIHRoaXNbaV0gPSB2YWx1ZVxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5zcGVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIG91dCA9IFtdXG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgb3V0W2ldID0gdG9IZXgodGhpc1tpXSlcbiAgICBpZiAoaSA9PT0gZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFUykge1xuICAgICAgb3V0W2kgKyAxXSA9ICcuLi4nXG4gICAgICBicmVha1xuICAgIH1cbiAgfVxuICByZXR1cm4gJzxCdWZmZXIgJyArIG91dC5qb2luKCcgJykgKyAnPidcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IGBBcnJheUJ1ZmZlcmAgd2l0aCB0aGUgKmNvcGllZCogbWVtb3J5IG9mIHRoZSBidWZmZXIgaW5zdGFuY2UuXG4gKiBBZGRlZCBpbiBOb2RlIDAuMTIuIE9ubHkgYXZhaWxhYmxlIGluIGJyb3dzZXJzIHRoYXQgc3VwcG9ydCBBcnJheUJ1ZmZlci5cbiAqL1xuQnVmZmVyLnByb3RvdHlwZS50b0FycmF5QnVmZmVyID0gZnVuY3Rpb24gKCkge1xuICBpZiAodHlwZW9mIFVpbnQ4QXJyYXkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgaWYgKEJ1ZmZlci5fdXNlVHlwZWRBcnJheXMpIHtcbiAgICAgIHJldHVybiAobmV3IEJ1ZmZlcih0aGlzKSkuYnVmZmVyXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBidWYgPSBuZXcgVWludDhBcnJheSh0aGlzLmxlbmd0aClcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBidWYubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEpXG4gICAgICAgIGJ1ZltpXSA9IHRoaXNbaV1cbiAgICAgIHJldHVybiBidWYuYnVmZmVyXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcignQnVmZmVyLnRvQXJyYXlCdWZmZXIgbm90IHN1cHBvcnRlZCBpbiB0aGlzIGJyb3dzZXInKVxuICB9XG59XG5cbi8vIEhFTFBFUiBGVU5DVElPTlNcbi8vID09PT09PT09PT09PT09PT1cblxuZnVuY3Rpb24gc3RyaW5ndHJpbSAoc3RyKSB7XG4gIGlmIChzdHIudHJpbSkgcmV0dXJuIHN0ci50cmltKClcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJylcbn1cblxudmFyIEJQID0gQnVmZmVyLnByb3RvdHlwZVxuXG4vKipcbiAqIEF1Z21lbnQgYSBVaW50OEFycmF5ICppbnN0YW5jZSogKG5vdCB0aGUgVWludDhBcnJheSBjbGFzcyEpIHdpdGggQnVmZmVyIG1ldGhvZHNcbiAqL1xuQnVmZmVyLl9hdWdtZW50ID0gZnVuY3Rpb24gKGFycikge1xuICBhcnIuX2lzQnVmZmVyID0gdHJ1ZVxuXG4gIC8vIHNhdmUgcmVmZXJlbmNlIHRvIG9yaWdpbmFsIFVpbnQ4QXJyYXkgZ2V0L3NldCBtZXRob2RzIGJlZm9yZSBvdmVyd3JpdGluZ1xuICBhcnIuX2dldCA9IGFyci5nZXRcbiAgYXJyLl9zZXQgPSBhcnIuc2V0XG5cbiAgLy8gZGVwcmVjYXRlZCwgd2lsbCBiZSByZW1vdmVkIGluIG5vZGUgMC4xMytcbiAgYXJyLmdldCA9IEJQLmdldFxuICBhcnIuc2V0ID0gQlAuc2V0XG5cbiAgYXJyLndyaXRlID0gQlAud3JpdGVcbiAgYXJyLnRvU3RyaW5nID0gQlAudG9TdHJpbmdcbiAgYXJyLnRvTG9jYWxlU3RyaW5nID0gQlAudG9TdHJpbmdcbiAgYXJyLnRvSlNPTiA9IEJQLnRvSlNPTlxuICBhcnIuY29weSA9IEJQLmNvcHlcbiAgYXJyLnNsaWNlID0gQlAuc2xpY2VcbiAgYXJyLnJlYWRVSW50OCA9IEJQLnJlYWRVSW50OFxuICBhcnIucmVhZFVJbnQxNkxFID0gQlAucmVhZFVJbnQxNkxFXG4gIGFyci5yZWFkVUludDE2QkUgPSBCUC5yZWFkVUludDE2QkVcbiAgYXJyLnJlYWRVSW50MzJMRSA9IEJQLnJlYWRVSW50MzJMRVxuICBhcnIucmVhZFVJbnQzMkJFID0gQlAucmVhZFVJbnQzMkJFXG4gIGFyci5yZWFkSW50OCA9IEJQLnJlYWRJbnQ4XG4gIGFyci5yZWFkSW50MTZMRSA9IEJQLnJlYWRJbnQxNkxFXG4gIGFyci5yZWFkSW50MTZCRSA9IEJQLnJlYWRJbnQxNkJFXG4gIGFyci5yZWFkSW50MzJMRSA9IEJQLnJlYWRJbnQzMkxFXG4gIGFyci5yZWFkSW50MzJCRSA9IEJQLnJlYWRJbnQzMkJFXG4gIGFyci5yZWFkRmxvYXRMRSA9IEJQLnJlYWRGbG9hdExFXG4gIGFyci5yZWFkRmxvYXRCRSA9IEJQLnJlYWRGbG9hdEJFXG4gIGFyci5yZWFkRG91YmxlTEUgPSBCUC5yZWFkRG91YmxlTEVcbiAgYXJyLnJlYWREb3VibGVCRSA9IEJQLnJlYWREb3VibGVCRVxuICBhcnIud3JpdGVVSW50OCA9IEJQLndyaXRlVUludDhcbiAgYXJyLndyaXRlVUludDE2TEUgPSBCUC53cml0ZVVJbnQxNkxFXG4gIGFyci53cml0ZVVJbnQxNkJFID0gQlAud3JpdGVVSW50MTZCRVxuICBhcnIud3JpdGVVSW50MzJMRSA9IEJQLndyaXRlVUludDMyTEVcbiAgYXJyLndyaXRlVUludDMyQkUgPSBCUC53cml0ZVVJbnQzMkJFXG4gIGFyci53cml0ZUludDggPSBCUC53cml0ZUludDhcbiAgYXJyLndyaXRlSW50MTZMRSA9IEJQLndyaXRlSW50MTZMRVxuICBhcnIud3JpdGVJbnQxNkJFID0gQlAud3JpdGVJbnQxNkJFXG4gIGFyci53cml0ZUludDMyTEUgPSBCUC53cml0ZUludDMyTEVcbiAgYXJyLndyaXRlSW50MzJCRSA9IEJQLndyaXRlSW50MzJCRVxuICBhcnIud3JpdGVGbG9hdExFID0gQlAud3JpdGVGbG9hdExFXG4gIGFyci53cml0ZUZsb2F0QkUgPSBCUC53cml0ZUZsb2F0QkVcbiAgYXJyLndyaXRlRG91YmxlTEUgPSBCUC53cml0ZURvdWJsZUxFXG4gIGFyci53cml0ZURvdWJsZUJFID0gQlAud3JpdGVEb3VibGVCRVxuICBhcnIuZmlsbCA9IEJQLmZpbGxcbiAgYXJyLmluc3BlY3QgPSBCUC5pbnNwZWN0XG4gIGFyci50b0FycmF5QnVmZmVyID0gQlAudG9BcnJheUJ1ZmZlclxuXG4gIHJldHVybiBhcnJcbn1cblxuLy8gc2xpY2Uoc3RhcnQsIGVuZClcbmZ1bmN0aW9uIGNsYW1wIChpbmRleCwgbGVuLCBkZWZhdWx0VmFsdWUpIHtcbiAgaWYgKHR5cGVvZiBpbmRleCAhPT0gJ251bWJlcicpIHJldHVybiBkZWZhdWx0VmFsdWVcbiAgaW5kZXggPSB+fmluZGV4OyAgLy8gQ29lcmNlIHRvIGludGVnZXIuXG4gIGlmIChpbmRleCA+PSBsZW4pIHJldHVybiBsZW5cbiAgaWYgKGluZGV4ID49IDApIHJldHVybiBpbmRleFxuICBpbmRleCArPSBsZW5cbiAgaWYgKGluZGV4ID49IDApIHJldHVybiBpbmRleFxuICByZXR1cm4gMFxufVxuXG5mdW5jdGlvbiBjb2VyY2UgKGxlbmd0aCkge1xuICAvLyBDb2VyY2UgbGVuZ3RoIHRvIGEgbnVtYmVyIChwb3NzaWJseSBOYU4pLCByb3VuZCB1cFxuICAvLyBpbiBjYXNlIGl0J3MgZnJhY3Rpb25hbCAoZS5nLiAxMjMuNDU2KSB0aGVuIGRvIGFcbiAgLy8gZG91YmxlIG5lZ2F0ZSB0byBjb2VyY2UgYSBOYU4gdG8gMC4gRWFzeSwgcmlnaHQ/XG4gIGxlbmd0aCA9IH5+TWF0aC5jZWlsKCtsZW5ndGgpXG4gIHJldHVybiBsZW5ndGggPCAwID8gMCA6IGxlbmd0aFxufVxuXG5mdW5jdGlvbiBpc0FycmF5IChzdWJqZWN0KSB7XG4gIHJldHVybiAoQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAoc3ViamVjdCkge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoc3ViamVjdCkgPT09ICdbb2JqZWN0IEFycmF5XSdcbiAgfSkoc3ViamVjdClcbn1cblxuZnVuY3Rpb24gaXNBcnJheWlzaCAoc3ViamVjdCkge1xuICByZXR1cm4gaXNBcnJheShzdWJqZWN0KSB8fCBCdWZmZXIuaXNCdWZmZXIoc3ViamVjdCkgfHxcbiAgICAgIHN1YmplY3QgJiYgdHlwZW9mIHN1YmplY3QgPT09ICdvYmplY3QnICYmXG4gICAgICB0eXBlb2Ygc3ViamVjdC5sZW5ndGggPT09ICdudW1iZXInXG59XG5cbmZ1bmN0aW9uIHRvSGV4IChuKSB7XG4gIGlmIChuIDwgMTYpIHJldHVybiAnMCcgKyBuLnRvU3RyaW5nKDE2KVxuICByZXR1cm4gbi50b1N0cmluZygxNilcbn1cblxuZnVuY3Rpb24gdXRmOFRvQnl0ZXMgKHN0cikge1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgYiA9IHN0ci5jaGFyQ29kZUF0KGkpXG4gICAgaWYgKGIgPD0gMHg3RilcbiAgICAgIGJ5dGVBcnJheS5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpKVxuICAgIGVsc2Uge1xuICAgICAgdmFyIHN0YXJ0ID0gaVxuICAgICAgaWYgKGIgPj0gMHhEODAwICYmIGIgPD0gMHhERkZGKSBpKytcbiAgICAgIHZhciBoID0gZW5jb2RlVVJJQ29tcG9uZW50KHN0ci5zbGljZShzdGFydCwgaSsxKSkuc3Vic3RyKDEpLnNwbGl0KCclJylcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgaC5sZW5ndGg7IGorKylcbiAgICAgICAgYnl0ZUFycmF5LnB1c2gocGFyc2VJbnQoaFtqXSwgMTYpKVxuICAgIH1cbiAgfVxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIGFzY2lpVG9CeXRlcyAoc3RyKSB7XG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgIC8vIE5vZGUncyBjb2RlIHNlZW1zIHRvIGJlIGRvaW5nIHRoaXMgYW5kIG5vdCAmIDB4N0YuLlxuICAgIGJ5dGVBcnJheS5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpICYgMHhGRilcbiAgfVxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIHV0ZjE2bGVUb0J5dGVzIChzdHIpIHtcbiAgdmFyIGMsIGhpLCBsb1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICBjID0gc3RyLmNoYXJDb2RlQXQoaSlcbiAgICBoaSA9IGMgPj4gOFxuICAgIGxvID0gYyAlIDI1NlxuICAgIGJ5dGVBcnJheS5wdXNoKGxvKVxuICAgIGJ5dGVBcnJheS5wdXNoKGhpKVxuICB9XG5cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiBiYXNlNjRUb0J5dGVzIChzdHIpIHtcbiAgcmV0dXJuIGJhc2U2NC50b0J5dGVBcnJheShzdHIpXG59XG5cbmZ1bmN0aW9uIGJsaXRCdWZmZXIgKHNyYywgZHN0LCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgcG9zXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoKGkgKyBvZmZzZXQgPj0gZHN0Lmxlbmd0aCkgfHwgKGkgPj0gc3JjLmxlbmd0aCkpXG4gICAgICBicmVha1xuICAgIGRzdFtpICsgb2Zmc2V0XSA9IHNyY1tpXVxuICB9XG4gIHJldHVybiBpXG59XG5cbmZ1bmN0aW9uIGRlY29kZVV0ZjhDaGFyIChzdHIpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHN0cilcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoMHhGRkZEKSAvLyBVVEYgOCBpbnZhbGlkIGNoYXJcbiAgfVxufVxuXG4vKlxuICogV2UgaGF2ZSB0byBtYWtlIHN1cmUgdGhhdCB0aGUgdmFsdWUgaXMgYSB2YWxpZCBpbnRlZ2VyLiBUaGlzIG1lYW5zIHRoYXQgaXRcbiAqIGlzIG5vbi1uZWdhdGl2ZS4gSXQgaGFzIG5vIGZyYWN0aW9uYWwgY29tcG9uZW50IGFuZCB0aGF0IGl0IGRvZXMgbm90XG4gKiBleGNlZWQgdGhlIG1heGltdW0gYWxsb3dlZCB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gdmVyaWZ1aW50ICh2YWx1ZSwgbWF4KSB7XG4gIGFzc2VydCh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInLCAnY2Fubm90IHdyaXRlIGEgbm9uLW51bWJlciBhcyBhIG51bWJlcicpXG4gIGFzc2VydCh2YWx1ZSA+PSAwLCAnc3BlY2lmaWVkIGEgbmVnYXRpdmUgdmFsdWUgZm9yIHdyaXRpbmcgYW4gdW5zaWduZWQgdmFsdWUnKVxuICBhc3NlcnQodmFsdWUgPD0gbWF4LCAndmFsdWUgaXMgbGFyZ2VyIHRoYW4gbWF4aW11bSB2YWx1ZSBmb3IgdHlwZScpXG4gIGFzc2VydChNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWUsICd2YWx1ZSBoYXMgYSBmcmFjdGlvbmFsIGNvbXBvbmVudCcpXG59XG5cbmZ1bmN0aW9uIHZlcmlmc2ludCAodmFsdWUsIG1heCwgbWluKSB7XG4gIGFzc2VydCh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInLCAnY2Fubm90IHdyaXRlIGEgbm9uLW51bWJlciBhcyBhIG51bWJlcicpXG4gIGFzc2VydCh2YWx1ZSA8PSBtYXgsICd2YWx1ZSBsYXJnZXIgdGhhbiBtYXhpbXVtIGFsbG93ZWQgdmFsdWUnKVxuICBhc3NlcnQodmFsdWUgPj0gbWluLCAndmFsdWUgc21hbGxlciB0aGFuIG1pbmltdW0gYWxsb3dlZCB2YWx1ZScpXG4gIGFzc2VydChNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWUsICd2YWx1ZSBoYXMgYSBmcmFjdGlvbmFsIGNvbXBvbmVudCcpXG59XG5cbmZ1bmN0aW9uIHZlcmlmSUVFRTc1NCAodmFsdWUsIG1heCwgbWluKSB7XG4gIGFzc2VydCh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInLCAnY2Fubm90IHdyaXRlIGEgbm9uLW51bWJlciBhcyBhIG51bWJlcicpXG4gIGFzc2VydCh2YWx1ZSA8PSBtYXgsICd2YWx1ZSBsYXJnZXIgdGhhbiBtYXhpbXVtIGFsbG93ZWQgdmFsdWUnKVxuICBhc3NlcnQodmFsdWUgPj0gbWluLCAndmFsdWUgc21hbGxlciB0aGFuIG1pbmltdW0gYWxsb3dlZCB2YWx1ZScpXG59XG5cbmZ1bmN0aW9uIGFzc2VydCAodGVzdCwgbWVzc2FnZSkge1xuICBpZiAoIXRlc3QpIHRocm93IG5ldyBFcnJvcihtZXNzYWdlIHx8ICdGYWlsZWQgYXNzZXJ0aW9uJylcbn1cblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJGVDVPUnNcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvYnVmZmVyL2luZGV4LmpzXCIsXCIvLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2J1ZmZlclwiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbmV4cG9ydHMucmVhZCA9IGZ1bmN0aW9uIChidWZmZXIsIG9mZnNldCwgaXNMRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtXG4gIHZhciBlTGVuID0gbkJ5dGVzICogOCAtIG1MZW4gLSAxXG4gIHZhciBlTWF4ID0gKDEgPDwgZUxlbikgLSAxXG4gIHZhciBlQmlhcyA9IGVNYXggPj4gMVxuICB2YXIgbkJpdHMgPSAtN1xuICB2YXIgaSA9IGlzTEUgPyAobkJ5dGVzIC0gMSkgOiAwXG4gIHZhciBkID0gaXNMRSA/IC0xIDogMVxuICB2YXIgcyA9IGJ1ZmZlcltvZmZzZXQgKyBpXVxuXG4gIGkgKz0gZFxuXG4gIGUgPSBzICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpXG4gIHMgPj49ICgtbkJpdHMpXG4gIG5CaXRzICs9IGVMZW5cbiAgZm9yICg7IG5CaXRzID4gMDsgZSA9IGUgKiAyNTYgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCkge31cblxuICBtID0gZSAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBlID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBtTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IG0gPSBtICogMjU2ICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpIHt9XG5cbiAgaWYgKGUgPT09IDApIHtcbiAgICBlID0gMSAtIGVCaWFzXG4gIH0gZWxzZSBpZiAoZSA9PT0gZU1heCkge1xuICAgIHJldHVybiBtID8gTmFOIDogKChzID8gLTEgOiAxKSAqIEluZmluaXR5KVxuICB9IGVsc2Uge1xuICAgIG0gPSBtICsgTWF0aC5wb3coMiwgbUxlbilcbiAgICBlID0gZSAtIGVCaWFzXG4gIH1cbiAgcmV0dXJuIChzID8gLTEgOiAxKSAqIG0gKiBNYXRoLnBvdygyLCBlIC0gbUxlbilcbn1cblxuZXhwb3J0cy53cml0ZSA9IGZ1bmN0aW9uIChidWZmZXIsIHZhbHVlLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbSwgY1xuICB2YXIgZUxlbiA9IG5CeXRlcyAqIDggLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIHJ0ID0gKG1MZW4gPT09IDIzID8gTWF0aC5wb3coMiwgLTI0KSAtIE1hdGgucG93KDIsIC03NykgOiAwKVxuICB2YXIgaSA9IGlzTEUgPyAwIDogKG5CeXRlcyAtIDEpXG4gIHZhciBkID0gaXNMRSA/IDEgOiAtMVxuICB2YXIgcyA9IHZhbHVlIDwgMCB8fCAodmFsdWUgPT09IDAgJiYgMSAvIHZhbHVlIDwgMCkgPyAxIDogMFxuXG4gIHZhbHVlID0gTWF0aC5hYnModmFsdWUpXG5cbiAgaWYgKGlzTmFOKHZhbHVlKSB8fCB2YWx1ZSA9PT0gSW5maW5pdHkpIHtcbiAgICBtID0gaXNOYU4odmFsdWUpID8gMSA6IDBcbiAgICBlID0gZU1heFxuICB9IGVsc2Uge1xuICAgIGUgPSBNYXRoLmZsb29yKE1hdGgubG9nKHZhbHVlKSAvIE1hdGguTE4yKVxuICAgIGlmICh2YWx1ZSAqIChjID0gTWF0aC5wb3coMiwgLWUpKSA8IDEpIHtcbiAgICAgIGUtLVxuICAgICAgYyAqPSAyXG4gICAgfVxuICAgIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgdmFsdWUgKz0gcnQgLyBjXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlICs9IHJ0ICogTWF0aC5wb3coMiwgMSAtIGVCaWFzKVxuICAgIH1cbiAgICBpZiAodmFsdWUgKiBjID49IDIpIHtcbiAgICAgIGUrK1xuICAgICAgYyAvPSAyXG4gICAgfVxuXG4gICAgaWYgKGUgKyBlQmlhcyA+PSBlTWF4KSB7XG4gICAgICBtID0gMFxuICAgICAgZSA9IGVNYXhcbiAgICB9IGVsc2UgaWYgKGUgKyBlQmlhcyA+PSAxKSB7XG4gICAgICBtID0gKHZhbHVlICogYyAtIDEpICogTWF0aC5wb3coMiwgbUxlbilcbiAgICAgIGUgPSBlICsgZUJpYXNcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IHZhbHVlICogTWF0aC5wb3coMiwgZUJpYXMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pXG4gICAgICBlID0gMFxuICAgIH1cbiAgfVxuXG4gIGZvciAoOyBtTGVuID49IDg7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IG0gJiAweGZmLCBpICs9IGQsIG0gLz0gMjU2LCBtTGVuIC09IDgpIHt9XG5cbiAgZSA9IChlIDw8IG1MZW4pIHwgbVxuICBlTGVuICs9IG1MZW5cbiAgZm9yICg7IGVMZW4gPiAwOyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBlICYgMHhmZiwgaSArPSBkLCBlIC89IDI1NiwgZUxlbiAtPSA4KSB7fVxuXG4gIGJ1ZmZlcltvZmZzZXQgKyBpIC0gZF0gfD0gcyAqIDEyOFxufVxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIkZUNU9Sc1wiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9pZWVlNzU0L2luZGV4LmpzXCIsXCIvLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2llZWU3NTRcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4vLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5wcm9jZXNzLm5leHRUaWNrID0gKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2FuU2V0SW1tZWRpYXRlID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cuc2V0SW1tZWRpYXRlO1xuICAgIHZhciBjYW5Qb3N0ID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cucG9zdE1lc3NhZ2UgJiYgd2luZG93LmFkZEV2ZW50TGlzdGVuZXJcbiAgICA7XG5cbiAgICBpZiAoY2FuU2V0SW1tZWRpYXRlKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoZikgeyByZXR1cm4gd2luZG93LnNldEltbWVkaWF0ZShmKSB9O1xuICAgIH1cblxuICAgIGlmIChjYW5Qb3N0KSB7XG4gICAgICAgIHZhciBxdWV1ZSA9IFtdO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgdmFyIHNvdXJjZSA9IGV2LnNvdXJjZTtcbiAgICAgICAgICAgIGlmICgoc291cmNlID09PSB3aW5kb3cgfHwgc291cmNlID09PSBudWxsKSAmJiBldi5kYXRhID09PSAncHJvY2Vzcy10aWNrJykge1xuICAgICAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIGlmIChxdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmbiA9IHF1ZXVlLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgICAgIGZuKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0cnVlKTtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgICAgIHF1ZXVlLnB1c2goZm4pO1xuICAgICAgICAgICAgd2luZG93LnBvc3RNZXNzYWdlKCdwcm9jZXNzLXRpY2snLCAnKicpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICBzZXRUaW1lb3V0KGZuLCAwKTtcbiAgICB9O1xufSkoKTtcblxucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59XG5cbi8vIFRPRE8oc2h0eWxtYW4pXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJGVDVPUnNcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzXCIsXCIvLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Byb2Nlc3NcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4ndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIF90b0NvbnN1bWFibGVBcnJheShhcnIpIHsgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgeyBmb3IgKHZhciBpID0gMCwgYXJyMiA9IEFycmF5KGFyci5sZW5ndGgpOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7IGFycjJbaV0gPSBhcnJbaV07IH0gcmV0dXJuIGFycjI7IH0gZWxzZSB7IHJldHVybiBBcnJheS5mcm9tKGFycik7IH0gfVxuXG52YXIgdGltZSA9IDc1MDtcbnZhciBzZWN0aW9uM0lkeCA9IDA7XG52YXIgc2VjdGlvbjRJZHggPSAwO1xuXG52YXIgbWFzdGVyT2JqID0ge1xuXHRzZWN0aW9uMkN1cnJlbnRJZHg6IDAsXG5cdHNlY3Rpb24xQ3VycmVudElkeDogMCxcblx0c2VjdGlvbjM6IHtcblx0XHRhdXRvbWF0ZTogJycsXG5cdFx0aXNBdXRvbWF0ZWQ6IGZhbHNlXG5cdH0sXG5cdHNlY3Rpb240OiB7XG5cdFx0YXV0b21hdGU6ICcnLFxuXHRcdGlzQXV0b21hdGVkOiBmYWxzZVxuXHR9LFxuXHRiYXNrZXRiYWxsOiB7IGxvb3BBbW91bnQ6IDEgfSxcblx0Zm9vdGJhbGw6IHsgbG9vcEFtb3VudDogMSB9LFxuXHR0ZW5uaXM6IHsgbG9vcEFtb3VudDogMSB9LFxuXHRiYXNlYmFsbDogeyBsb29wQW1vdW50OiAxIH0sXG5cdGZhbjogeyBsb29wQW1vdW50OiAxIH1cbn07XG5cbnZhciBob21lcGFnZU1vYkltYWdlcyA9IFsnYXNzZXRzL2ltYWdlcy9ob21lcGFnZU1vYi9iYXNrZXRiYWxsLmpwZycsICdhc3NldHMvaW1hZ2VzL2hvbWVwYWdlTW9iL2Zvb3RiYWxsLmpwZycsICdhc3NldHMvaW1hZ2VzL2hvbWVwYWdlTW9iL3Rlbm5pcy5qcGcnLCAnYXNzZXRzL2ltYWdlcy9ob21lcGFnZU1vYi9iYXNlYmFsbC5qcGcnLCAnYXNzZXRzL2ltYWdlcy9ob21lcGFnZU1vYi9mYW4uanBnJ107XG5cbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcblx0aWYgKHdpbmRvdy5pbm5lcldpZHRoIDwgODAwKSB7XG5cdFx0Ly8gSUYgVEhFIFdJTkRPVyBJUyBTTUFMTEVSIFRIQVQgODAwUFggRkVUQ0ggVEhFIEpTT04gRk9SIFRIRSBJQ09OIEFOSU1BVElPTiBBTkQgQVRBQ0ggVEhFIEFOSU1BVElPTlMgU0VQRVJBVEVMWSBUTyBtYXN0ZXJPYmogXFxcXFxuXHRcdGZldGNoKCdhc3NldHMvanMvRmFudGFzdGVjX1Nwcml0ZV9TaGVldC5qc29uJykudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcblx0XHRcdHJldHVybiByZXNwb25zZS5qc29uKCk7XG5cdFx0fSkudGhlbihmdW5jdGlvbiAoc3ByaXRlT2JqKSB7XG5cdFx0XHR2YXIgSWRsZUZyYW1lID0gZmlsdGVyQnlWYWx1ZShzcHJpdGVPYmouZnJhbWVzLCAnaWRsZScpO1xuXHRcdFx0bWFzdGVyT2JqLmZvb3RiYWxsLmFuaW1hdGlvbkFycmF5ID0gW10uY29uY2F0KF90b0NvbnN1bWFibGVBcnJheShJZGxlRnJhbWUpLCBfdG9Db25zdW1hYmxlQXJyYXkoZmlsdGVyQnlWYWx1ZShzcHJpdGVPYmouZnJhbWVzLCAnZm9vdGJhbGwnKSkpO1xuXHRcdFx0bWFzdGVyT2JqLnRlbm5pcy5hbmltYXRpb25BcnJheSA9IFtdLmNvbmNhdChfdG9Db25zdW1hYmxlQXJyYXkoSWRsZUZyYW1lKSwgX3RvQ29uc3VtYWJsZUFycmF5KGZpbHRlckJ5VmFsdWUoc3ByaXRlT2JqLmZyYW1lcywgJ3Rlbm5pcycpKSk7XG5cdFx0XHRtYXN0ZXJPYmouYmFzZWJhbGwuYW5pbWF0aW9uQXJyYXkgPSBbXS5jb25jYXQoX3RvQ29uc3VtYWJsZUFycmF5KElkbGVGcmFtZSksIF90b0NvbnN1bWFibGVBcnJheShmaWx0ZXJCeVZhbHVlKHNwcml0ZU9iai5mcmFtZXMsICdiYXNlYmFsbCcpKSk7XG5cdFx0XHRtYXN0ZXJPYmouYmFza2V0YmFsbC5hbmltYXRpb25BcnJheSA9IFtdLmNvbmNhdChfdG9Db25zdW1hYmxlQXJyYXkoSWRsZUZyYW1lKSwgX3RvQ29uc3VtYWJsZUFycmF5KGZpbHRlckJ5VmFsdWUoc3ByaXRlT2JqLmZyYW1lcywgJ2Jhc2tldCcpKSk7XG5cdFx0XHRtYXN0ZXJPYmouZmFuLmFuaW1hdGlvbkFycmF5ID0gW10uY29uY2F0KF90b0NvbnN1bWFibGVBcnJheShJZGxlRnJhbWUpLCBfdG9Db25zdW1hYmxlQXJyYXkoZmlsdGVyQnlWYWx1ZShzcHJpdGVPYmouZnJhbWVzLCAnZmFuJykpKTtcblx0XHRcdC8vIENBTEwgQU5JTUFUT1IgU0VUVVAgRlVOQ1RJT04gQU5EIFNUQVJUIFRIRSBJTUFHRSBTTElERVNIT1cgRk9SIFNFQ1RJT04gMSAoSE9NRVBBR0UpIFxcXFxcdFx0XHRcblx0XHRcdGFuaW1hdG9yU2V0dXAoKTtcblx0XHRcdGltYWdlQ29udHJvbGVyKG1hc3Rlck9iaiwgMSk7XG5cdFx0XHQvLyBDQUxMIFRIRSBpbWFnZUNvbnRyb2xlciBGVU5DVElPTiBFVkVSWSA1IFNFQ09ORFMgVE8gQ0hBTkdFIFRIRSBJTUFHRSBGT1IgU0VDVElPTiAxIChIT01FUEFHRSkgXFxcXFxuXHRcdFx0c2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRpbWFnZUNvbnRyb2xlcihtYXN0ZXJPYmosIDEpO1xuXHRcdFx0fSwgNTAwMCk7XG5cdFx0fSk7XG5cdH1cblx0Ly8gRlVOQ1RJT04gVE8gU0VQRVJBVEUgVEhFIEFOSU1BVElPTiBGUkFNRVMgQlkgTkFNRSBcXFxcXG5cdHZhciBmaWx0ZXJCeVZhbHVlID0gZnVuY3Rpb24gZmlsdGVyQnlWYWx1ZShhcnJheSwgc3RyaW5nKSB7XG5cdFx0cmV0dXJuIGFycmF5LmZpbHRlcihmdW5jdGlvbiAobykge1xuXHRcdFx0cmV0dXJuIHR5cGVvZiBvWydmaWxlbmFtZSddID09PSAnc3RyaW5nJyAmJiBvWydmaWxlbmFtZSddLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoc3RyaW5nLnRvTG93ZXJDYXNlKCkpO1xuXHRcdH0pO1xuXHR9O1xuXHQvLyBHRU5FUklDIFNFVFVQIEZVTkNUSU9OIEZPUiBBRERJTkcgVkVORE9SIFBSRUZJWEVTIFRPIHJlcXVlc3RBbmltYXRpb25GcmFtZSBcXFxcXG5cdHZhciBhbmltYXRvclNldHVwID0gZnVuY3Rpb24gYW5pbWF0b3JTZXR1cCgpIHtcblxuXHRcdHZhciBsYXN0VGltZSA9IDA7XG5cdFx0dmFyIHZlbmRvcnMgPSBbJ21zJywgJ21veicsICd3ZWJraXQnLCAnbyddO1xuXHRcdGZvciAodmFyIHggPSAwOyB4IDwgdmVuZG9ycy5sZW5ndGggJiYgIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWU7ICsreCkge1xuXHRcdFx0d2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ1JlcXVlc3RBbmltYXRpb25GcmFtZSddO1xuXHRcdFx0d2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gd2luZG93W3ZlbmRvcnNbeF0gKyAnQ2FuY2VsQW5pbWF0aW9uRnJhbWUnXSB8fCB3aW5kb3dbdmVuZG9yc1t4XSArICdDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUnXTtcblx0XHR9XG5cblx0XHRpZiAoIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbiAoY2FsbGJhY2ssIGVsZW1lbnQpIHtcblx0XHRcdHZhciBjdXJyVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuXHRcdFx0dmFyIHRpbWVUb0NhbGwgPSBNYXRoLm1heCgwLCAxNiAtIChjdXJyVGltZSAtIGxhc3RUaW1lKSk7XG5cdFx0XHR2YXIgaWQgPSB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGNhbGxiYWNrKGN1cnJUaW1lICsgdGltZVRvQ2FsbCk7XG5cdFx0XHR9LCB0aW1lVG9DYWxsKTtcblx0XHRcdGxhc3RUaW1lID0gY3VyclRpbWUgKyB0aW1lVG9DYWxsO1xuXHRcdFx0cmV0dXJuIGlkO1xuXHRcdH07XG5cblx0XHRpZiAoIXdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSkgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24gKGlkKSB7XG5cdFx0XHRjbGVhclRpbWVvdXQoaWQpO1xuXHRcdH07XG5cdH07XG5cblx0dmFyIGFuaW1hdG9yID0gZnVuY3Rpb24gYW5pbWF0b3IoYW5pbWF0aW9uT2JqKSB7XG5cblx0XHR2YXIgZGFuY2luZ0ljb24sIHNwcml0ZUltYWdlLCBjYW52YXM7XG5cdFx0Ly8gRlVOQ1RJT04gVE8gUEFTUyBUTyByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgXFxcXFxuXHRcdGZ1bmN0aW9uIGdhbWVMb29wKCkge1xuXHRcdFx0JCgnI2xvYWRpbmcnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG5cdFx0XHRhbmltYXRpb25PYmoubG9vcElkID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShnYW1lTG9vcCk7XG5cdFx0XHRkYW5jaW5nSWNvbi51cGRhdGUoKTtcblx0XHRcdGRhbmNpbmdJY29uLnJlbmRlcigpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHNwcml0ZShvcHRpb25zKSB7XG5cblx0XHRcdHZhciB0aGF0ID0ge30sXG5cdFx0XHQgICAgZnJhbWVJbmRleCA9IDAsXG5cdFx0XHQgICAgdGlja0NvdW50ID0gMCxcblx0XHRcdCAgICBsb29wQ291bnQgPSAwLFxuXHRcdFx0ICAgIHRpY2tzUGVyRnJhbWUgPSBvcHRpb25zLnRpY2tzUGVyRnJhbWUgfHwgMCxcblx0XHRcdCAgICBudW1iZXJPZkZyYW1lcyA9IG9wdGlvbnMubnVtYmVyT2ZGcmFtZXMgfHwgMTtcblxuXHRcdFx0dGhhdC5jb250ZXh0ID0gb3B0aW9ucy5jb250ZXh0O1xuXHRcdFx0dGhhdC53aWR0aCA9IG9wdGlvbnMud2lkdGg7XG5cdFx0XHR0aGF0LmhlaWdodCA9IG9wdGlvbnMuaGVpZ2h0O1xuXHRcdFx0dGhhdC5pbWFnZSA9IG9wdGlvbnMuaW1hZ2U7XG5cdFx0XHR0aGF0Lmxvb3BzID0gb3B0aW9ucy5sb29wcztcblxuXHRcdFx0dGhhdC51cGRhdGUgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRcdFx0dGlja0NvdW50ICs9IDE7XG5cblx0XHRcdFx0aWYgKHRpY2tDb3VudCA+IHRpY2tzUGVyRnJhbWUpIHtcblxuXHRcdFx0XHRcdHRpY2tDb3VudCA9IDA7XG5cdFx0XHRcdFx0Ly8gSWYgdGhlIGN1cnJlbnQgZnJhbWUgaW5kZXggaXMgaW4gcmFuZ2Vcblx0XHRcdFx0XHRpZiAoZnJhbWVJbmRleCA8IG51bWJlck9mRnJhbWVzIC0gMSkge1xuXHRcdFx0XHRcdFx0Ly8gR28gdG8gdGhlIG5leHQgZnJhbWVcblx0XHRcdFx0XHRcdGZyYW1lSW5kZXggKz0gMTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0bG9vcENvdW50Kys7XG5cdFx0XHRcdFx0XHRmcmFtZUluZGV4ID0gMDtcblxuXHRcdFx0XHRcdFx0aWYgKGxvb3BDb3VudCA9PT0gdGhhdC5sb29wcykge1xuXHRcdFx0XHRcdFx0XHR3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUoYW5pbWF0aW9uT2JqLmxvb3BJZCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHR0aGF0LnJlbmRlciA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0XHQvLyBDbGVhciB0aGUgY2FudmFzXG5cdFx0XHRcdHRoYXQuY29udGV4dC5jbGVhclJlY3QoMCwgMCwgdGhhdC53aWR0aCwgdGhhdC5oZWlnaHQpO1xuXG5cdFx0XHRcdHRoYXQuY29udGV4dC5kcmF3SW1hZ2UodGhhdC5pbWFnZSwgYW5pbWF0aW9uT2JqLmFuaW1hdGlvbkFycmF5W2ZyYW1lSW5kZXhdLmZyYW1lLngsIGFuaW1hdGlvbk9iai5hbmltYXRpb25BcnJheVtmcmFtZUluZGV4XS5mcmFtZS55LCAyMDAsIDE3NSwgMCwgMCwgd2luZG93LmlubmVyV2lkdGggLyAzLjg0Niwgd2luZG93LmlubmVyV2lkdGggLyA0LjEpO1xuXHRcdFx0fTtcblxuXHRcdFx0cmV0dXJuIHRoYXQ7XG5cdFx0fVxuXG5cdFx0Ly8gR2V0IGNhbnZhc1xuXHRcdGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMnKTtcblx0XHRjYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aCAvIDMuODQ2O1xuXHRcdGNhbnZhcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJXaWR0aCAvIDIuMjtcblxuXHRcdC8vIENyZWF0ZSBzcHJpdGUgc2hlZXRcblx0XHRzcHJpdGVJbWFnZSA9IG5ldyBJbWFnZSgpO1xuXG5cdFx0Ly8gQ3JlYXRlIHNwcml0ZVxuXHRcdGRhbmNpbmdJY29uID0gc3ByaXRlKHtcblx0XHRcdGNvbnRleHQ6IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIiksXG5cdFx0XHR3aWR0aDogNDA0MCxcblx0XHRcdGhlaWdodDogMTc3MCxcblx0XHRcdGltYWdlOiBzcHJpdGVJbWFnZSxcblx0XHRcdG51bWJlck9mRnJhbWVzOiBhbmltYXRpb25PYmouYW5pbWF0aW9uQXJyYXkubGVuZ3RoLFxuXHRcdFx0dGlja3NQZXJGcmFtZTogNCxcblx0XHRcdGxvb3BzOiBhbmltYXRpb25PYmoubG9vcEFtb3VudFxuXHRcdH0pO1xuXG5cdFx0Ly8gTG9hZCBzcHJpdGUgc2hlZXRcblx0XHRzcHJpdGVJbWFnZS5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBnYW1lTG9vcCk7XG5cdFx0c3ByaXRlSW1hZ2Uuc3JjID0gJ2Fzc2V0cy9pbWFnZXMvRmFudGFzdGVjX1Nwcml0ZV9TaGVldC5wbmcnO1xuXHR9O1xuXG5cdC8vIElOSVRJQUxJU0UgQU5EIFNFVFVQIENVUlJFTlQgUEFHRS4gRVhFQ1VURSBUUkFOU0lUSU9OUyBBTkQgUkVNT1ZFIFRJTlQgSUYgUkVMRVZBTlQgXFxcXFxuXG5cdHZhciBwYWdlTG9hZGVyID0gZnVuY3Rpb24gcGFnZUxvYWRlcihpbmRleCkge1xuXHRcdGlmIChpbmRleCA9PT0gNSkge1xuXHRcdFx0JCgnLnRpbnQnKS5yZW1vdmVDbGFzcygncmVtb3ZlVGludCcpO1xuXHRcdFx0JCgnLmJhY2tncm91bmRXcmFwcGVyJykucmVtb3ZlQ2xhc3MoJ3NjYWxlQmFja2dyb3VuZCcpO1xuXHRcdFx0JCgnI3NlY3Rpb241JykuZmluZCgnLmhlYWRpbmcnKS5hZGRDbGFzcygnc2hvdyBmYWRlSW4nKTtcblx0XHRcdCQoJy5zdWJTZWN0aW9uJykuYWRkQ2xhc3MoJ3NjYWxlQmFja2dyb3VuZCcpO1xuXHRcdFx0JCgnLnN1YlNlY3Rpb24nKS5maW5kKCcudGludCcpLmFkZENsYXNzKCdyZW1vdmVUaW50Jyk7XG5cdFx0XHQkKCcjc2VjdGlvbjUnKS5maW5kKCcudGV4dFdyYXBwZXInKS5hZGRDbGFzcygnc2hvdycpO1xuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdCQoJy5zdWJTZWN0aW9uID4gLnRleHRXcmFwcGVyJykuZmluZCgnLmhlYWRpbmcnKS5hZGRDbGFzcygnZmFkZUluJyk7XG5cdFx0XHR9LCAxMDAwKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JCgnLnRpbnQnKS5yZW1vdmVDbGFzcygncmVtb3ZlVGludCcpO1xuXHRcdFx0JCgnLnN1YlNlY3Rpb24nKS5yZW1vdmVDbGFzcygnc2NhbGVCYWNrZ3JvdW5kJyk7XG5cdFx0XHQkKCcuYmFja2dyb3VuZFdyYXBwZXI6bm90KCNzZWN0aW9uJyArIGluZGV4ICsgJ0JhY2tncm91bmQpJykucmVtb3ZlQ2xhc3MoJ3NjYWxlQmFja2dyb3VuZCcpO1xuXHRcdFx0JCgnLnNlY3Rpb24uYWN0aXZlJykuZmluZCgnLmJhY2tncm91bmRXcmFwcGVyJykuYWRkQ2xhc3MoJ3NjYWxlQmFja2dyb3VuZCcpO1xuXHRcdFx0JCgnc2VjdGlvbi5hY3RpdmUnKS5maW5kKCcudGludCcpLmFkZENsYXNzKCdyZW1vdmVUaW50Jyk7XG5cblx0XHRcdGlmICgkKCcuc2VjdGlvbicgKyBpbmRleCArICdQYWdpbmF0b3JCdXR0b24nKS5sZW5ndGggJiYgJCgnLnNlY3Rpb24nICsgaW5kZXggKyAnUGFnaW5hdG9yQnV0dG9uLmFjdGl2ZScpLmxlbmd0aCA8IDEpIHtcblx0XHRcdFx0JCgnLnNlY3Rpb24nICsgaW5kZXggKyAnUGFnaW5hdG9yQnV0dG9uJykuZ2V0KDApLmNsaWNrKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdC8vIEhJREUgQUxMIEJFQ0tHUk9VTkRTIElOIFRIRSBTRUNUSU9OIEVYQ0VQVCBUSEUgU1BFQ0lGSUVEIElOREVYLCBXSElDSCBJUyBTQ0FMRUQgQU5EIFNIT1dOLiBcXFxcXG5cblx0dmFyIGluaXRpYWxpemVTZWN0aW9uID0gZnVuY3Rpb24gaW5pdGlhbGl6ZVNlY3Rpb24oc2VjdGlvbk51bWJlciwgaWR4KSB7XG5cdFx0JCgnI3NlY3Rpb24nICsgc2VjdGlvbk51bWJlciArICdCYWNrZ3JvdW5kJyArIGlkeCkuc2libGluZ3MoJy5iYWNrZ3JvdW5kV3JhcHBlcicpLm1hcChmdW5jdGlvbiAoaXgsIGVsZSkge1xuXHRcdFx0JChlbGUpLmNzcyh7IG9wYWNpdHk6IDAgfSk7XG5cdFx0fSk7XG5cblx0XHQkKCcjc2VjdGlvbicgKyBzZWN0aW9uTnVtYmVyICsgJ0JhY2tncm91bmQnICsgaWR4KS5jc3Moe1xuXHRcdFx0J3RyYW5zZm9ybSc6ICdzY2FsZSgxLjEpJyxcblx0XHRcdCdvcGFjaXR5JzogMVxuXHRcdH0pO1xuXHR9O1xuXG5cdC8vIENBTEwgaW5pdGlhbGl6ZVNlY3Rpb24gT04gU0VDVElPTlMgMSwgMyBBTkQgNC4gXFxcXFxuXHRpbml0aWFsaXplU2VjdGlvbigxLCAwKTtcblx0aW5pdGlhbGl6ZVNlY3Rpb24oMywgMCk7XG5cdGluaXRpYWxpemVTZWN0aW9uKDQsIDApO1xuXG5cdC8vIEJBQ0tHUk9VTkQgSU1BR0UgVFJBTlNJVElPTiBIQU5ETEVSLiBcXFxcXG5cblx0dmFyIGltYWdlQ29udHJvbGVyID0gZnVuY3Rpb24gaW1hZ2VDb250cm9sZXIoaWR4T2JqLCBzZWN0aW9uTnVtYmVyKSB7XG5cdFx0dmFyIHJlbGV2YW50QW5pbWF0aW9uID0gdm9pZCAwO1xuXG5cdFx0aWYgKHNlY3Rpb25OdW1iZXIgPT09IDEpIHtcblx0XHRcdHN3aXRjaCAoaWR4T2JqLnNlY3Rpb24xQ3VycmVudElkeCkge1xuXHRcdFx0XHRjYXNlIDA6XG5cdFx0XHRcdFx0cmVsZXZhbnRBbmltYXRpb24gPSBtYXN0ZXJPYmouYmFza2V0YmFsbDtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHRcdHJlbGV2YW50QW5pbWF0aW9uID0gbWFzdGVyT2JqLmZvb3RiYWxsO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIDI6XG5cdFx0XHRcdFx0cmVsZXZhbnRBbmltYXRpb24gPSBtYXN0ZXJPYmoudGVubmlzO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIDM6XG5cdFx0XHRcdFx0cmVsZXZhbnRBbmltYXRpb24gPSBtYXN0ZXJPYmouYmFzZWJhbGw7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgNDpcblx0XHRcdFx0XHRyZWxldmFudEFuaW1hdGlvbiA9IG1hc3Rlck9iai5mYW47XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0JCgnI3NlY3Rpb24nICsgc2VjdGlvbk51bWJlcikuZmluZCgnLnRpbnQnKS5yZW1vdmVDbGFzcygncmVtb3ZlVGludCcpO1xuXHRcdCQoJyNzZWN0aW9uJyArIHNlY3Rpb25OdW1iZXIgKyAnQmFja2dyb3VuZCcgKyBpZHhPYmpbJ3NlY3Rpb24nICsgc2VjdGlvbk51bWJlciArICdDdXJyZW50SWR4J10pLnJlbW92ZUNsYXNzKCdzY2FsZUJhY2tncm91bmQnKTtcblx0XHRpbml0aWFsaXplU2VjdGlvbihzZWN0aW9uTnVtYmVyLCBpZHhPYmpbJ3NlY3Rpb24nICsgc2VjdGlvbk51bWJlciArICdDdXJyZW50SWR4J10pO1xuXG5cdFx0c2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRpZiAoc2VjdGlvbk51bWJlciA9PT0gMSkge1xuXHRcdFx0XHRhbmltYXRvcihyZWxldmFudEFuaW1hdGlvbik7XG5cdFx0XHR9XG5cblx0XHRcdCQoJyNzZWN0aW9uJyArIHNlY3Rpb25OdW1iZXIpLmZpbmQoJy5iYWNrZ3JvdW5kV3JhcHBlcicpLmFkZENsYXNzKCdzY2FsZUJhY2tncm91bmQnKTtcblx0XHRcdCQoJyNzZWN0aW9uJyArIHNlY3Rpb25OdW1iZXIpLmZpbmQoJy50aW50JykuYWRkQ2xhc3MoJ3JlbW92ZVRpbnQnKTtcblx0XHR9LCA1MDApO1xuXG5cdFx0aWYgKGlkeE9ialsnc2VjdGlvbicgKyBzZWN0aW9uTnVtYmVyICsgJ0N1cnJlbnRJZHgnXSA9PT0gJCgnI3NlY3Rpb24nICsgc2VjdGlvbk51bWJlcikuZmluZCgnLmJhY2tncm91bmRXcmFwcGVyJykubGVuZ3RoIC0gMSkge1xuXHRcdFx0aWR4T2JqWydzZWN0aW9uJyArIHNlY3Rpb25OdW1iZXIgKyAnQ3VycmVudElkeCddID0gMDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0aWR4T2JqWydzZWN0aW9uJyArIHNlY3Rpb25OdW1iZXIgKyAnQ3VycmVudElkeCddICs9IDE7XG5cdFx0fVxuXHR9O1xuXHQvLyBTVEFSVCBTTElERVNIT1cgT04gU0VDVElPTiAyIFxcXFxcblx0aW1hZ2VDb250cm9sZXIobWFzdGVyT2JqLCAyKTtcblxuXHQvLyBDSEFOR0UgU0VDVElPTiAyIEJBQ0tHUk9VTkQgSU1BR0UgRVZFUlkgMTUgU0VDT05EUyBcXFxcXG5cdHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcblx0XHRpbWFnZUNvbnRyb2xlcihtYXN0ZXJPYmosIDIpO1xuXHR9LCAxNTAwMCk7XG5cblx0Ly8gUEFHSU5BVElPTiBCVVRUT05TIENMSUNLIEhBTkRMRVIgRk9SIFNFQ1RJT05TIDMgQU5EIDQuIFxcXFxcblxuXHR2YXIgaGFuZGxlUGFuaW5hdGlvbkJ1dHRvbkNsaWNrID0gZnVuY3Rpb24gaGFuZGxlUGFuaW5hdGlvbkJ1dHRvbkNsaWNrKGUpIHtcblxuXHRcdHZhciBpZHggPSBwYXJzZUludCgkKGUudGFyZ2V0KS5hdHRyKCdkYXRhLWluZGV4JykpO1xuXHRcdHZhciBzZWN0aW9uSWQgPSAkKGUudGFyZ2V0KS5jbG9zZXN0KCdzZWN0aW9uJykuYXR0cignaWQnKTtcblx0XHR2YXIgcmVsZXZhbnREYXRhQXJyYXkgPSB2b2lkIDA7XG5cblx0XHRpZiAoc2VjdGlvbklkID09PSAnc2VjdGlvbjMnKSB7XG5cdFx0XHRzZWN0aW9uM0lkeCA9IGlkeDtcblx0XHR9XG5cblx0XHRpZiAoc2VjdGlvbklkID09PSAnc2VjdGlvbjQnKSB7XG5cdFx0XHRzZWN0aW9uNElkeCA9IGlkeDtcblx0XHR9XG5cblx0XHQkKCcjJyArIHNlY3Rpb25JZCkuZmluZCgnLnRpbnQnKS5yZW1vdmVDbGFzcygncmVtb3ZlVGludCcpO1xuXHRcdCQoJyMnICsgc2VjdGlvbklkKS5maW5kKCcudGV4dFdyYXBwZXInKS5yZW1vdmVDbGFzcygnc2hvdycpO1xuXHRcdCQoJyMnICsgc2VjdGlvbklkKS5maW5kKCcjdGV4dFdyYXBwZXInICsgaWR4KS5hZGRDbGFzcygnc2hvdycpO1xuXHRcdCQoJyMnICsgc2VjdGlvbklkICsgJ0JhY2tncm91bmQnICsgaWR4KS5yZW1vdmVDbGFzcygnc2NhbGVCYWNrZ3JvdW5kJyk7XG5cdFx0JCgnLicgKyBzZWN0aW9uSWQgKyAnUGFnaW5hdG9yQnV0dG9uJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdCQoZS50YXJnZXQpLmFkZENsYXNzKCdhY3RpdmUnKTtcblxuXHRcdGluaXRpYWxpemVTZWN0aW9uKHBhcnNlSW50KCQoJyMnICsgc2VjdGlvbklkKS5hdHRyKCdkYXRhLWluZGV4JykpLCBpZHgpO1xuXG5cdFx0c2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRwYWdlTG9hZGVyKHBhcnNlSW50KCQoJyMnICsgc2VjdGlvbklkKS5hdHRyKCdkYXRhLWluZGV4JykpKTtcblx0XHR9LCA1MDApO1xuXG5cdFx0aWYgKHNlY3Rpb25JZCAhPT0gJ3NlY3Rpb24yJykge1xuXHRcdFx0JCgnIycgKyBzZWN0aW9uSWQpLmZpbmQoJy5oZWFkaW5nLCBwJykuYWRkQ2xhc3MoJ2ZhZGVJbicpO1xuXHRcdFx0JCgnIycgKyBzZWN0aW9uSWQpLm9uKCd0cmFuc2l0aW9uZW5kIHdlYmtpdFRyYW5zaXRpb25FbmQgb1RyYW5zaXRpb25FbmQnLCBmdW5jdGlvbiAoZXMpIHtcblx0XHRcdFx0JCgnIycgKyBzZWN0aW9uSWQpLmZpbmQoJy5oZWFkaW5nLCBwJykucmVtb3ZlQ2xhc3MoJ2ZhZGVJbicpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIENMSUNLIExJU1RFTkVSIEZPUiBQQUdJTkFUSU9OIEJVVFRPTlMgT04gU0VDVElPTlMgMyBBTkQgNC4gXFxcXFxuXG5cdCQoJy5zZWN0aW9uM1BhZ2luYXRvckJ1dHRvbiwgLnNlY3Rpb240UGFnaW5hdG9yQnV0dG9uJykuY2xpY2soZnVuY3Rpb24gKGUpIHtcblxuXHRcdGlmIChtYXN0ZXJPYmpbJChlLmN1cnJlbnRUYXJnZXQpLmNsb3Nlc3QoJ3NlY3Rpb24nKS5hdHRyKCdpZCcpXS5pc0F1dG9tYXRlZCkge1xuXHRcdFx0Ly8gSUYgVEhFUkUgSVMgQSBSSU5OSU5HIElOVEVSVkFMIE9OIFRIRSBSRUxFVkFOVCBTRUNUSU9OIENMRUFSIElUIFxcXFxcblx0XHRcdGludGVydmFsTWFuYWdlcihmYWxzZSwgJChlLmN1cnJlbnRUYXJnZXQpLmNsb3Nlc3QoJ3NlY3Rpb24nKS5hdHRyKCdpZCcpKTtcblx0XHRcdC8vIFNFVCBBIE5FVyBJTlRFUlZBTCBPRiA3IFNFQ09ORFMgT04gVEhFIFNFQ1RJT04gXFxcXFxuXHRcdFx0aW50ZXJ2YWxNYW5hZ2VyKHRydWUsICQoZS5jdXJyZW50VGFyZ2V0KS5jbG9zZXN0KCdzZWN0aW9uJykuYXR0cignaWQnKSwgNzAwMCk7XG5cdFx0fVxuXHRcdC8vIENBTEwgVEhFIENMSUNLIEhBTkRMRVIgRlVOQ1RJT04gQU5EIFBBU1MgSVQgVEhFIEVWRU5UIFxcXFxcblx0XHRoYW5kbGVQYW5pbmF0aW9uQnV0dG9uQ2xpY2soZSk7XG5cdH0pO1xuXG5cdC8vIElOSVRJQUxJWkUgT05FUEFHRVNDUk9MTCBJRiBOT1QgSU4gQ01TIFBSRVZJRVcuIFxcXFxcblxuXHRpZiAoISQobG9jYXRpb24pLmF0dHIoJ2hyZWYnKS5pbmNsdWRlcygnaW5kZXgucGhwJykpIHtcblx0XHQkKCcjc2Nyb2xsZXJXcmFwcGVyJykub25lcGFnZV9zY3JvbGwoe1xuXHRcdFx0c2VjdGlvbkNvbnRhaW5lcjogXCJzZWN0aW9uXCIsXG5cdFx0XHRlYXNpbmc6IFwiZWFzZS1vdXRcIixcblx0XHRcdGFuaW1hdGlvblRpbWU6IHRpbWUsXG5cdFx0XHRwYWdpbmF0aW9uOiB0cnVlLFxuXHRcdFx0dXBkYXRlVVJMOiB0cnVlLFxuXHRcdFx0YmVmb3JlTW92ZTogZnVuY3Rpb24gYmVmb3JlTW92ZShpbmRleCkge30sXG5cdFx0XHRhZnRlck1vdmU6IGZ1bmN0aW9uIGFmdGVyTW92ZShpbmRleCkge1xuXHRcdFx0XHQvLyBJTklUSUFMSVpFIFRIRSBDVVJSRU5UIFBBR0UuIFxcXFxcblxuXHRcdFx0XHRwYWdlTG9hZGVyKGluZGV4KTtcblx0XHRcdH0sXG5cdFx0XHRsb29wOiBmYWxzZSxcblx0XHRcdGtleWJvYXJkOiB0cnVlLFxuXHRcdFx0cmVzcG9uc2l2ZUZhbGxiYWNrOiBmYWxzZSxcblx0XHRcdGRpcmVjdGlvbjogXCJ2ZXJ0aWNhbFwiXG5cdFx0fSk7XG5cblx0XHQkKCcjc2Nyb2xsZXJXcmFwcGVyJykubW92ZVRvKDEpO1xuXHR9XG5cblx0Ly8gQ09OVFJPTCBDTElDS1MgT04gV09SSyBXSVRIIFVTIFNFQ1RJT04gKFNFQ1RJT041KS4gXFxcXFxuXG5cdCQoJy5jbGlja2FibGUnKS5jbGljayhmdW5jdGlvbiAoZSkge1xuXHRcdHZhciBjdXJyZW50U2VjdGlvbiA9ICQoZS50YXJnZXQpLmNsb3Nlc3QoJCgnLnN1YlNlY3Rpb24nKSk7XG5cblx0XHRpZiAoY3VycmVudFNlY3Rpb24uaGFzQ2xhc3MoJ29wZW4nKSkge1xuXHRcdFx0Y3VycmVudFNlY3Rpb24ucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcblx0XHRcdGN1cnJlbnRTZWN0aW9uLmZpbmQoJy5idXR0b24sIHAnKS5yZW1vdmVDbGFzcygnZmFkZUluJyk7XG5cdFx0XHRjdXJyZW50U2VjdGlvbi5zaWJsaW5ncygnLnN1YlNlY3Rpb24nKS5tYXAoZnVuY3Rpb24gKGlkeCwgc2VjdGlvbikge1xuXHRcdFx0XHQkKHNlY3Rpb24pLnJlbW92ZUNsYXNzKCdjbG9zZWQnKTtcblx0XHRcdFx0JChzZWN0aW9uKS5maW5kKCcudGludCcpLnJlbW92ZUNsYXNzKCdhZGRUaW50JykuYWRkQ2xhc3MoJ3JlbW92ZVRpbnQnKTtcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjdXJyZW50U2VjdGlvbi5yZW1vdmVDbGFzcygnY2xvc2VkJykuYWRkQ2xhc3MoJ29wZW4nKTtcblx0XHRcdGN1cnJlbnRTZWN0aW9uLm9uKCd0cmFuc2l0aW9uZW5kIHdlYmtpdFRyYW5zaXRpb25FbmQgb1RyYW5zaXRpb25FbmQnLCBmdW5jdGlvbiAoZXMpIHtcblx0XHRcdFx0JCgnLnN1YlNlY3Rpb24ub3BlbicpLmZpbmQoJy5idXR0b24sIHAnKS5hZGRDbGFzcygnZmFkZUluJyk7XG5cdFx0XHR9KTtcblx0XHRcdGN1cnJlbnRTZWN0aW9uLnNpYmxpbmdzKCcuc3ViU2VjdGlvbicpLm1hcChmdW5jdGlvbiAoaWR4LCBzZWN0aW9uKSB7XG5cdFx0XHRcdCQoc2VjdGlvbikucmVtb3ZlQ2xhc3MoJ29wZW4nKS5hZGRDbGFzcygnY2xvc2VkJyk7XG5cdFx0XHRcdCQoc2VjdGlvbikuZmluZCgnLnRpbnQnKS5yZW1vdmVDbGFzcygncmVtb3ZlVGludCcpLmFkZENsYXNzKCdhZGRUaW50Jyk7XG5cdFx0XHRcdCQoc2VjdGlvbikuZmluZCgnLmJ1dHRvbiwgcCcpLnJlbW92ZUNsYXNzKCdmYWRlSW4nKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRjdXJyZW50U2VjdGlvbi5maW5kKCcudGludCcpLnJlbW92ZUNsYXNzKCdhZGRUaW50JykuYWRkQ2xhc3MoJ3JlbW92ZVRpbnQnKTtcblx0fSk7XG5cblx0Ly8gQ09OVFJPTCBGT09URVIgQVJST1cgQ0xJQ0tTLiBcXFxcXG5cblx0JCgnI2Rvd25BcnJvdycpLmNsaWNrKGZ1bmN0aW9uICgpIHtcblx0XHRpZiAoJCh3aW5kb3cpLmhlaWdodCgpICogKCQoJy5wYWdlJykubGVuZ3RoIC0gMSkgPT09IC0kKCcjc2Nyb2xsZXJXcmFwcGVyJykub2Zmc2V0KCkudG9wKSB7XG5cdFx0XHQvLyBNT1ZFIFRPIFRPUCBPRiBQQUdFIElGIENVUlJFTlRMWSBBVCBCT1RUT00gXFxcXFxuXHRcdFx0JCgnI3Njcm9sbGVyV3JhcHBlcicpLm1vdmVUbygxKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JCgnI3Njcm9sbGVyV3JhcHBlcicpLm1vdmVEb3duKCk7XG5cdFx0fVxuXHR9KTtcblxuXHQvLyBISURFIFRIRSBMT0FESU5HIEFOSU1BVElPUE4gV0hFTiBWSURFTyBJUyBSRUFEWSBUTyBQTEFZIE9OIERFU1hLVE9QLiBcXFxcXG5cblx0dmFyIGhpZGVMb2FkaW5nQW5pbWF0aW9uID0gZnVuY3Rpb24gaGlkZUxvYWRpbmdBbmltYXRpb24oKSB7XG5cdFx0aWYgKHdpbmRvdy5pbm5lcldpZHRoID4gODAwICYmICEkKCcjbG9hZGluZycpLmhhc0NsYXNzKCdoaWRkZW4nKSkge1xuXG5cdFx0XHRpZiAoJCgnI3ZpZGVvJykuZ2V0KDApLnJlYWR5U3RhdGUgPT09IDQpIHtcblx0XHRcdFx0JCgnI2xvYWRpbmcnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdC8vIE1BTkFHRU1FTlQgRlVOQ1RJT04gRk9SIFNFVFRJTkcgQU5EIENMRUFSSU5HIFRIRSBTTElERSBBVVRPTUFUSU9OIElOVEVSVkFMUy4gXFxcXFxuXG5cdHZhciBpbnRlcnZhbE1hbmFnZXIgPSBmdW5jdGlvbiBpbnRlcnZhbE1hbmFnZXIoZmxhZywgc2VjdGlvbklkLCB0aW1lKSB7XG5cdFx0aWYgKGZsYWcpIHtcblx0XHRcdG1hc3Rlck9ialtzZWN0aW9uSWRdLmF1dG9tYXRlID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRzd2lwZUNvbnRyb2xsZXIoc2VjdGlvbklkLCAnbCcpO1xuXHRcdFx0fSwgdGltZSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNsZWFySW50ZXJ2YWwobWFzdGVyT2JqW3NlY3Rpb25JZF0uYXV0b21hdGUpO1xuXHRcdH1cblx0fTtcblxuXHQvLyBJRiBOT1QgSU4gQ01TIEFETUlOIFBSRVZJRVcsIFBFUlBFVFVBTExZIENIRUNLIElGIFdFIEFSRSBBVCBUSEUgVE9QIE9GIFRIRSBQQUdFIEFORCBJRiBTTywgRE9OVCBTSE9XIFRIRSBGT09URVIgT1IgR1JFRU4gU0hBUEUuIFxcXFxcblxuXHRpZiAoISQobG9jYXRpb24pLmF0dHIoJ2hyZWYnKS5pbmNsdWRlcygnaW5kZXgucGhwJykpIHtcblx0XHRzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG5cdFx0XHRpZiAoJCgnI3Njcm9sbGVyV3JhcHBlcicpLm9mZnNldCgpLnRvcCA+PSAwKSB7XG5cdFx0XHRcdCQoJyNoZWFkZXJTaGFwZSwgI2Zvb3RlcicpLmFkZENsYXNzKCdtb3ZlT2ZmU2NyZWVuJyk7XG5cdFx0XHRcdCQoJyN2aWRlbycpLmdldCgwKS5wbGF5KCk7XG5cdFx0XHRcdCQoJy5hcnJvdycpLmFkZENsYXNzKCdwdWxzYXRlJyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR2YXIgdGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdCQoJyNoZWFkZXJTaGFwZSwgI2Zvb3RlcicpLnJlbW92ZUNsYXNzKCdtb3ZlT2ZmU2NyZWVuJyk7XG5cdFx0XHRcdFx0JCgnI3ZpZGVvJykuZ2V0KDApLnBhdXNlKCk7XG5cdFx0XHRcdFx0JCgnLmFycm93JykucmVtb3ZlQ2xhc3MoJ3B1bHNhdGUnKTtcblx0XHRcdFx0XHRjbGVhclRpbWVvdXQodGltZW91dCk7XG5cdFx0XHRcdH0sIHRpbWUpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBST1RBVEUgVEhFIEFSUk9XIElOIFRIRSBGT09URVIgV0hFTiBBVCBUSEUgQk9UVE9NIE9GIFRIRSBQQUdFIFxcXFxcblxuXHRcdFx0aWYgKCQoJyNzY3JvbGxlcldyYXBwZXInKS5vZmZzZXQoKS50b3AgPCAtKHdpbmRvdy5pbm5lckhlaWdodCAqIDQpKSB7XG5cdFx0XHRcdCQoJyNkb3duQXJyb3cnKS5jc3MoeyAndHJhbnNmb3JtJzogJ3JvdGF0ZSgxODBkZWcpIHRyYW5zbGF0ZVgoLTUwJSknIH0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JCgnI2Rvd25BcnJvdycpLmNzcyh7ICd0cmFuc2Zvcm0nOiAndHJhbnNsYXRlWCgtNTAlKSByb3RhdGUoMGRlZyknIH0pO1xuXHRcdFx0fVxuXG5cdFx0XHRoaWRlTG9hZGluZ0FuaW1hdGlvbigpO1xuXG5cdFx0XHQvLyBBREQgTEFORFNDQVBFIFNUWUxFUyBUTyBSRUxFVkFOVCBFTEVNRU5UUyBcXFxcXG5cblx0XHRcdGlmICh3aW5kb3cubWF0Y2hNZWRpYShcIihvcmllbnRhdGlvbjogbGFuZHNjYXBlKVwiKS5tYXRjaGVzICYmIHdpbmRvdy5pbm5lcldpZHRoIDwgODAwKSB7XG5cdFx0XHRcdCQoJy5uYXZfbGluaywgI2hlYWRlclNoYXBlLCAjZm9vdGVyLCAuY3VzdG9tLCAubWFya2VyLCAjc2VjdGlvbjUsIC50ZXh0V3JhcHBlcicpLmFkZENsYXNzKCdsYW5kc2NhcGUnKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCQoJy5uYXZfbGluaywgI2hlYWRlclNoYXBlLCAjZm9vdGVyLCAuY3VzdG9tLCAubWFya2VyLCAjc2VjdGlvbjUsIC50ZXh0V3JhcHBlcicpLnJlbW92ZUNsYXNzKCdsYW5kc2NhcGUnKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCQoJyNzZWN0aW9uMy5hY3RpdmUnKS5sZW5ndGgpIHtcblx0XHRcdFx0Ly8gQVVUT01BVEUgVEhFIFNMSURFUyBPTiBTRUNUSU9QTiAzIEVWRVJZIDcgU0VDT05EUyBJRiBUSEUgU0VDVElPTiBJUyBBQ1RJVkUuIFxcXFxcblx0XHRcdFx0aWYgKG1hc3Rlck9iai5zZWN0aW9uMy5pc0F1dG9tYXRlZCAhPT0gdHJ1ZSkge1xuXHRcdFx0XHRcdG1hc3Rlck9iai5zZWN0aW9uMy5pc0F1dG9tYXRlZCA9IHRydWU7XG5cdFx0XHRcdFx0aW50ZXJ2YWxNYW5hZ2VyKHRydWUsICdzZWN0aW9uMycsIDcwMDApO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBTVE9QIEFVVE9NQVRFRCBTTElERVMgT04gU0VDVElPUE4gMyBJRiBUSEUgU0VDVElPTiBJUyBOT1QgQUNUSVZFLiBcXFxcXG5cdFx0XHRcdGlmIChtYXN0ZXJPYmouc2VjdGlvbjMuaXNBdXRvbWF0ZWQgPT09IHRydWUpIHtcblx0XHRcdFx0XHRpbnRlcnZhbE1hbmFnZXIoZmFsc2UsICdzZWN0aW9uMycpO1xuXHRcdFx0XHRcdG1hc3Rlck9iai5zZWN0aW9uMy5pc0F1dG9tYXRlZCA9IGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmICgkKCcjc2VjdGlvbjQuYWN0aXZlJykubGVuZ3RoKSB7XG5cdFx0XHRcdC8vIEFVVE9NQVRFIFRIRSBTTElERVMgT04gU0VDVElPUE4gNCBFVkVSWSA3IFNFQ09ORFMgSUYgVEhFIFNFQ1RJT04gSVMgQUNUSVZFLiBcXFxcXG5cdFx0XHRcdGlmIChtYXN0ZXJPYmouc2VjdGlvbjQuaXNBdXRvbWF0ZWQgIT09IHRydWUpIHtcblx0XHRcdFx0XHRtYXN0ZXJPYmouc2VjdGlvbjQuaXNBdXRvbWF0ZWQgPSB0cnVlO1xuXHRcdFx0XHRcdGludGVydmFsTWFuYWdlcih0cnVlLCAnc2VjdGlvbjQnLCA3MDAwKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gU1RPUCBBVVRPTUFURUQgU0xJREVTIE9OIFNFQ1RJT1BOIDQgSUYgVEhFIFNFQ1RJT04gSVMgTk9UIEFDVElWRS4gXFxcXFxuXHRcdFx0XHRpZiAobWFzdGVyT2JqLnNlY3Rpb240LmlzQXV0b21hdGVkID09PSB0cnVlKSB7XG5cdFx0XHRcdFx0aW50ZXJ2YWxNYW5hZ2VyKGZhbHNlLCAnc2VjdGlvbjQnKTtcblx0XHRcdFx0XHRtYXN0ZXJPYmouc2VjdGlvbjQuaXNBdXRvbWF0ZWQgPSBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sIDUwMCk7XG5cdH1cblxuXHQvLyBDT05UUk9MIFdIQVQgSEFQUEVOUyBXSEVOIExJTktTIElOIFRIRSBOQVYvTUVOVSBBUkUgQ0xJQ0tFRCBcXFxcXG5cblx0JCgnLm5hdl9saW5rJykuY2xpY2soZnVuY3Rpb24gKGUpIHtcblx0XHR2YXIgcGFnZUlkeCA9IHBhcnNlSW50KCQoZS50YXJnZXQpLmF0dHIoJ2RhdGEtaW5kZXgnKSk7XG5cdFx0JCgnI3Njcm9sbGVyV3JhcHBlcicpLm1vdmVUbyhwYWdlSWR4KTtcblx0XHQkKCcjbWVudUJsb2NrT3V0JykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuXG5cdFx0aWYgKGJ1cmdlci5jbGFzc0xpc3QuY29udGFpbnMoJ2J1cmdlci0tYWN0aXZlJykpIHtcblx0XHRcdG5hdi5jbGFzc0xpc3QucmVtb3ZlKCduYXZfb3BlbicpO1xuXHRcdFx0YnVyZ2VyLmNsYXNzTGlzdC5yZW1vdmUoJ2J1cmdlci0tYWN0aXZlJyk7XG5cdFx0XHRkb2N1bWVudC5ib2R5LnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcblx0XHR9XG5cdH0pO1xuXG5cdC8vIFdIRU4gVEhFIE5BViBJUyBPUEVOIFBSRVZFTlQgVVNFUiBGUk9NIEJFSU5HIEFCTEUgVE8gQ0xJQ0sgQU5ZVEhJTkcgRUxTRSBcXFxcXG5cblx0JCgnI21lbnVCbG9ja091dCcpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XG5cdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0fSk7XG5cblx0dmFyIGJ1cmdlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluLWJ1cmdlcicpLFxuXHQgICAgbmF2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW5OYXYnKTtcblxuXHQvLyBDT05UUk9MIEZPUiBPUEVOIEFORCBDTE9TSU5HIFRIRSBNRU5VL05BViAgXFxcXFxuXG5cdGZ1bmN0aW9uIG5hdkNvbnRyb2woKSB7XG5cblx0XHRpZiAoYnVyZ2VyLmNsYXNzTGlzdC5jb250YWlucygnYnVyZ2VyLS1hY3RpdmUnKSkge1xuXHRcdFx0bmF2LmNsYXNzTGlzdC5yZW1vdmUoJ25hdl9vcGVuJyk7XG5cdFx0XHRidXJnZXIuY2xhc3NMaXN0LnJlbW92ZSgnYnVyZ2VyLS1hY3RpdmUnKTtcblx0XHRcdCQoJyNtZW51QmxvY2tPdXQnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGJ1cmdlci5jbGFzc0xpc3QuYWRkKCdidXJnZXItLWFjdGl2ZScpO1xuXHRcdFx0bmF2LmNsYXNzTGlzdC5hZGQoJ25hdl9vcGVuJyk7XG5cdFx0XHQkKCcjbWVudUJsb2NrT3V0JykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuXHRcdH1cblx0fVxuXG5cdC8vIE9OTFkgTElTVEVOIEZPUiBNRU5VIENMSUNLUyBXSEVOIE5PVCBJTiBDTVMgUFJFVklFVyBNT0RFIFxcXFxcblxuXHRpZiAoISQobG9jYXRpb24pLmF0dHIoJ2hyZWYnKS5pbmNsdWRlcygnaW5kZXgucGhwJykpIHtcblx0XHRidXJnZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBuYXZDb250cm9sKTtcblx0fVxuXG5cdC8vIENMT1NFIFRIRSBOQVYgSUYgVEhFIFdJTkRPVyBJUyBPVkVSIDEwMDBQWCBXSURFIFxcXFxcblxuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZnVuY3Rpb24gKCkge1xuXHRcdGlmICh3aW5kb3cuaW5uZXJXaWR0aCA+IDEwMDAgJiYgbmF2LmNsYXNzTGlzdC5jb250YWlucygnbmF2X29wZW4nKSkge1xuXHRcdFx0bmF2Q29udHJvbCgpO1xuXHRcdFx0bmF2LmNsYXNzTGlzdC5yZW1vdmUoJ25hdl9vcGVuJyk7XG5cdFx0XHQkKCcjbWVudUJsb2NrT3V0JykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuXHRcdH1cblx0fSk7XG5cblx0Ly8gVEhJUyBTRVQgT0YgSUYgU1RBVEVNRU5UUyBJTklUSUFMSVNFUyBUSEUgU1BFU0lGSUMgUEFHRVMgRk9SIFBSRVZJRVdJTkcgSU4gQ01TIEFETUlOLiBcXFxcXG5cblx0aWYgKCQobG9jYXRpb24pLmF0dHIoJ2hyZWYnKS5pbmNsdWRlcygnaW5kZXgucGhwJykpIHtcblx0XHRpZiAoJChsb2NhdGlvbikuYXR0cignaHJlZicpLmluY2x1ZGVzKCdpbWFnaW5lLWlmJykpIHtcblx0XHRcdHBhZ2VMb2FkZXIoNCk7XG5cdFx0fVxuXHRcdGlmICgkKGxvY2F0aW9uKS5hdHRyKCdocmVmJykuaW5jbHVkZXMoJ2hvdy13ZS1pbm5vdmF0ZScpKSB7XG5cdFx0XHRwYWdlTG9hZGVyKDMpO1xuXHRcdH1cblx0XHRpZiAoJChsb2NhdGlvbikuYXR0cignaHJlZicpLmluY2x1ZGVzKCd3b3JrLXdpdGgtdXMnKSkge1xuXHRcdFx0cGFnZUxvYWRlcig1KTtcblx0XHR9XG5cdFx0aWYgKCQobG9jYXRpb24pLmF0dHIoJ2hyZWYnKS5pbmNsdWRlcygnY29udGFjdC11cycpKSB7XG5cdFx0XHRwYWdlTG9hZGVyKDYpO1xuXHRcdH1cblx0XHRpZiAoJChsb2NhdGlvbikuYXR0cignaHJlZicpLmluY2x1ZGVzKCdob21lLXZpZGVvJykpIHtcblx0XHRcdHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0aGlkZUxvYWRpbmdBbmltYXRpb24oKTtcblx0XHRcdH0sIDUwMCk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gU1dJUEUgRVZFTlRTIERFVEVDVE9SIEZVTkNUSU9OIFxcXFxcblxuXHRmdW5jdGlvbiBkZXRlY3Rzd2lwZShlbCwgZnVuYykge1xuXHRcdHZhciBzd2lwZV9kZXQgPSB7fTtcblx0XHRzd2lwZV9kZXQuc1ggPSAwO3N3aXBlX2RldC5zWSA9IDA7c3dpcGVfZGV0LmVYID0gMDtzd2lwZV9kZXQuZVkgPSAwO1xuXHRcdHZhciBtaW5feCA9IDMwOyAvL21pbiB4IHN3aXBlIGZvciBob3Jpem9udGFsIHN3aXBlXG5cdFx0dmFyIG1heF94ID0gMzA7IC8vbWF4IHggZGlmZmVyZW5jZSBmb3IgdmVydGljYWwgc3dpcGVcblx0XHR2YXIgbWluX3kgPSA1MDsgLy9taW4geSBzd2lwZSBmb3IgdmVydGljYWwgc3dpcGVcblx0XHR2YXIgbWF4X3kgPSA2MDsgLy9tYXggeSBkaWZmZXJlbmNlIGZvciBob3Jpem9udGFsIHN3aXBlXG5cdFx0dmFyIGRpcmVjID0gXCJcIjtcblx0XHR2YXIgZWxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWwpO1xuXHRcdGVsZS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgZnVuY3Rpb24gKGUpIHtcblx0XHRcdHZhciB0ID0gZS50b3VjaGVzWzBdO1xuXHRcdFx0c3dpcGVfZGV0LnNYID0gdC5zY3JlZW5YO1xuXHRcdFx0c3dpcGVfZGV0LnNZID0gdC5zY3JlZW5ZO1xuXHRcdH0sIGZhbHNlKTtcblx0XHRlbGUuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgZnVuY3Rpb24gKGUpIHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdHZhciB0ID0gZS50b3VjaGVzWzBdO1xuXHRcdFx0c3dpcGVfZGV0LmVYID0gdC5zY3JlZW5YO1xuXHRcdFx0c3dpcGVfZGV0LmVZID0gdC5zY3JlZW5ZO1xuXHRcdH0sIGZhbHNlKTtcblx0XHRlbGUuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0Ly9ob3Jpem9udGFsIGRldGVjdGlvblxuXHRcdFx0aWYgKChzd2lwZV9kZXQuZVggLSBtaW5feCA+IHN3aXBlX2RldC5zWCB8fCBzd2lwZV9kZXQuZVggKyBtaW5feCA8IHN3aXBlX2RldC5zWCkgJiYgc3dpcGVfZGV0LmVZIDwgc3dpcGVfZGV0LnNZICsgbWF4X3kgJiYgc3dpcGVfZGV0LnNZID4gc3dpcGVfZGV0LmVZIC0gbWF4X3kgJiYgc3dpcGVfZGV0LmVYID4gMCkge1xuXHRcdFx0XHRpZiAoc3dpcGVfZGV0LmVYID4gc3dpcGVfZGV0LnNYKSBkaXJlYyA9IFwiclwiO2Vsc2UgZGlyZWMgPSBcImxcIjtcblx0XHRcdH1cblx0XHRcdC8vdmVydGljYWwgZGV0ZWN0aW9uXG5cdFx0XHRlbHNlIGlmICgoc3dpcGVfZGV0LmVZIC0gbWluX3kgPiBzd2lwZV9kZXQuc1kgfHwgc3dpcGVfZGV0LmVZICsgbWluX3kgPCBzd2lwZV9kZXQuc1kpICYmIHN3aXBlX2RldC5lWCA8IHN3aXBlX2RldC5zWCArIG1heF94ICYmIHN3aXBlX2RldC5zWCA+IHN3aXBlX2RldC5lWCAtIG1heF94ICYmIHN3aXBlX2RldC5lWSA+IDApIHtcblx0XHRcdFx0XHRpZiAoc3dpcGVfZGV0LmVZID4gc3dpcGVfZGV0LnNZKSBkaXJlYyA9IFwiZFwiO2Vsc2UgZGlyZWMgPSBcInVcIjtcblx0XHRcdFx0fVxuXG5cdFx0XHRpZiAoZGlyZWMgIT0gXCJcIikge1xuXHRcdFx0XHRpZiAodHlwZW9mIGZ1bmMgPT0gJ2Z1bmN0aW9uJykgZnVuYyhlbCwgZGlyZWMpO1xuXHRcdFx0fVxuXHRcdFx0dmFyIGRpcmVjID0gXCJcIjtcblx0XHRcdHN3aXBlX2RldC5zWCA9IDA7c3dpcGVfZGV0LnNZID0gMDtzd2lwZV9kZXQuZVggPSAwO3N3aXBlX2RldC5lWSA9IDA7XG5cdFx0fSwgZmFsc2UpO1xuXHR9XG5cblx0Ly8gQ0hPU0UgVEhFIE5FWFQgU0xJREUgVE8gU0hPVyBBTkQgQ0xJQ0sgVEhFIFBBR0lOQVRJT04gQlVUVE9OIFRIQVQgUkVMQVRFUyBUTyBJVC4gXFxcXFxuXG5cdHZhciBzd2lwZUNvbnRyb2xsZXIgPSBmdW5jdGlvbiBzd2lwZUNvbnRyb2xsZXIoZWwsIGQpIHtcblxuXHRcdGlmIChlbCA9PT0gJ3NlY3Rpb240Jykge1xuXG5cdFx0XHR2YXIgc2VjdGlvbjRQYWdpbmF0aW9uTGVuZ3RoID0gJCgnLnNlY3Rpb240UGFnaW5hdG9yQnV0dG9uJykubGVuZ3RoO1xuXG5cdFx0XHRpZiAoZCA9PT0gJ2wnKSB7XG5cblx0XHRcdFx0aWYgKHNlY3Rpb240SWR4IDwgc2VjdGlvbjRQYWdpbmF0aW9uTGVuZ3RoIC0gMSkge1xuXHRcdFx0XHRcdHNlY3Rpb240SWR4Kys7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0c2VjdGlvbjRJZHggPSAwO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0JCgnLnNlY3Rpb240UGFnaW5hdG9yQnV0dG9uJylbc2VjdGlvbjRJZHhdLmNsaWNrKCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoZCA9PT0gJ3InKSB7XG5cblx0XHRcdFx0aWYgKHNlY3Rpb240SWR4ID4gMCkge1xuXHRcdFx0XHRcdHNlY3Rpb240SWR4LS07XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0c2VjdGlvbjRJZHggPSBzZWN0aW9uNFBhZ2luYXRpb25MZW5ndGggLSAxO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0JCgnLnNlY3Rpb240UGFnaW5hdG9yQnV0dG9uJylbc2VjdGlvbjRJZHhdLmNsaWNrKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmIChlbCA9PT0gJ3NlY3Rpb24zJykge1xuXG5cdFx0XHR2YXIgc2VjdGlvbjNQYWdpbmF0aW9uTGVuZ3RoID0gJCgnLnNlY3Rpb24zUGFnaW5hdG9yQnV0dG9uJykubGVuZ3RoO1xuXG5cdFx0XHRpZiAoZCA9PT0gJ2wnKSB7XG5cblx0XHRcdFx0aWYgKHNlY3Rpb24zSWR4IDwgc2VjdGlvbjNQYWdpbmF0aW9uTGVuZ3RoIC0gMSkge1xuXHRcdFx0XHRcdHNlY3Rpb24zSWR4Kys7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0c2VjdGlvbjNJZHggPSAwO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0JCgnLnNlY3Rpb24zUGFnaW5hdG9yQnV0dG9uJylbc2VjdGlvbjNJZHhdLmNsaWNrKCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoZCA9PT0gJ3InKSB7XG5cblx0XHRcdFx0aWYgKHNlY3Rpb24zSWR4ID4gMCkge1xuXHRcdFx0XHRcdHNlY3Rpb24zSWR4LS07XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0c2VjdGlvbjNJZHggPSBzZWN0aW9uM1BhZ2luYXRpb25MZW5ndGggLSAxO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0JCgnLnNlY3Rpb24zUGFnaW5hdG9yQnV0dG9uJylbc2VjdGlvbjNJZHhdLmNsaWNrKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdC8vIElOSVRJQVRFIEZPUiBTV0lQRSBERVRFQ1RJT04gT04gU0VDVElPTlMgMyBBTkQgNCBFWENFUFQgSU4gQURNSU4gUFJFVklFVy4gXFxcXFxuXG5cdGlmICghJChsb2NhdGlvbikuYXR0cignaHJlZicpLmluY2x1ZGVzKCdpbmRleC5waHAnKSkge1xuXHRcdGRldGVjdHN3aXBlKCdzZWN0aW9uNCcsIHN3aXBlQ29udHJvbGxlcik7XG5cdFx0ZGV0ZWN0c3dpcGUoJ3NlY3Rpb24zJywgc3dpcGVDb250cm9sbGVyKTtcblx0fVxufSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbVpoYTJWZlpUUmtPVGt3TnpVdWFuTWlYU3dpYm1GdFpYTWlPbHNpZEdsdFpTSXNJbk5sWTNScGIyNHpTV1I0SWl3aWMyVmpkR2x2YmpSSlpIZ2lMQ0p0WVhOMFpYSlBZbW9pTENKelpXTjBhVzl1TWtOMWNuSmxiblJKWkhnaUxDSnpaV04wYVc5dU1VTjFjbkpsYm5SSlpIZ2lMQ0p6WldOMGFXOXVNeUlzSW1GMWRHOXRZWFJsSWl3aWFYTkJkWFJ2YldGMFpXUWlMQ0p6WldOMGFXOXVOQ0lzSW1KaGMydGxkR0poYkd3aUxDSnNiMjl3UVcxdmRXNTBJaXdpWm05dmRHSmhiR3dpTENKMFpXNXVhWE1pTENKaVlYTmxZbUZzYkNJc0ltWmhiaUlzSW1odmJXVndZV2RsVFc5aVNXMWhaMlZ6SWl3aUpDSXNJbVJ2WTNWdFpXNTBJaXdpY21WaFpIa2lMQ0ozYVc1a2IzY2lMQ0pwYm01bGNsZHBaSFJvSWl3aVptVjBZMmdpTENKMGFHVnVJaXdpY21WemNHOXVjMlVpTENKcWMyOXVJaXdpYzNCeWFYUmxUMkpxSWl3aVNXUnNaVVp5WVcxbElpd2labWxzZEdWeVFubFdZV3gxWlNJc0ltWnlZVzFsY3lJc0ltRnVhVzFoZEdsdmJrRnljbUY1SWl3aVlXNXBiV0YwYjNKVFpYUjFjQ0lzSW1sdFlXZGxRMjl1ZEhKdmJHVnlJaXdpYzJWMFNXNTBaWEoyWVd3aUxDSmhjbkpoZVNJc0luTjBjbWx1WnlJc0ltWnBiSFJsY2lJc0ltOGlMQ0owYjB4dmQyVnlRMkZ6WlNJc0ltbHVZMngxWkdWeklpd2liR0Z6ZEZScGJXVWlMQ0oyWlc1a2IzSnpJaXdpZUNJc0lteGxibWQwYUNJc0luSmxjWFZsYzNSQmJtbHRZWFJwYjI1R2NtRnRaU0lzSW1OaGJtTmxiRUZ1YVcxaGRHbHZia1p5WVcxbElpd2lZMkZzYkdKaFkyc2lMQ0psYkdWdFpXNTBJaXdpWTNWeWNsUnBiV1VpTENKRVlYUmxJaXdpWjJWMFZHbHRaU0lzSW5ScGJXVlViME5oYkd3aUxDSk5ZWFJvSWl3aWJXRjRJaXdpYVdRaUxDSnpaWFJVYVcxbGIzVjBJaXdpWTJ4bFlYSlVhVzFsYjNWMElpd2lZVzVwYldGMGIzSWlMQ0poYm1sdFlYUnBiMjVQWW1vaUxDSmtZVzVqYVc1blNXTnZiaUlzSW5Od2NtbDBaVWx0WVdkbElpd2lZMkZ1ZG1Geklpd2laMkZ0WlV4dmIzQWlMQ0poWkdSRGJHRnpjeUlzSW14dmIzQkpaQ0lzSW5Wd1pHRjBaU0lzSW5KbGJtUmxjaUlzSW5Od2NtbDBaU0lzSW05d2RHbHZibk1pTENKMGFHRjBJaXdpWm5KaGJXVkpibVJsZUNJc0luUnBZMnREYjNWdWRDSXNJbXh2YjNCRGIzVnVkQ0lzSW5ScFkydHpVR1Z5Um5KaGJXVWlMQ0p1ZFcxaVpYSlBaa1p5WVcxbGN5SXNJbU52Ym5SbGVIUWlMQ0ozYVdSMGFDSXNJbWhsYVdkb2RDSXNJbWx0WVdkbElpd2liRzl2Y0hNaUxDSmpiR1ZoY2xKbFkzUWlMQ0prY21GM1NXMWhaMlVpTENKbWNtRnRaU0lzSW5raUxDSm5aWFJGYkdWdFpXNTBRbmxKWkNJc0lrbHRZV2RsSWl3aVoyVjBRMjl1ZEdWNGRDSXNJbUZrWkVWMlpXNTBUR2x6ZEdWdVpYSWlMQ0p6Y21NaUxDSndZV2RsVEc5aFpHVnlJaXdpYVc1a1pYZ2lMQ0p5WlcxdmRtVkRiR0Z6Y3lJc0ltWnBibVFpTENKblpYUWlMQ0pqYkdsamF5SXNJbWx1YVhScFlXeHBlbVZUWldOMGFXOXVJaXdpYzJWamRHbHZiazUxYldKbGNpSXNJbWxrZUNJc0luTnBZbXhwYm1keklpd2liV0Z3SWl3aWFYZ2lMQ0psYkdVaUxDSmpjM01pTENKdmNHRmphWFI1SWl3aWFXUjRUMkpxSWl3aWNtVnNaWFpoYm5SQmJtbHRZWFJwYjI0aUxDSm9ZVzVrYkdWUVlXNXBibUYwYVc5dVFuVjBkRzl1UTJ4cFkyc2lMQ0psSWl3aWNHRnljMlZKYm5RaUxDSjBZWEpuWlhRaUxDSmhkSFJ5SWl3aWMyVmpkR2x2Ymtsa0lpd2lZMnh2YzJWemRDSXNJbkpsYkdWMllXNTBSR0YwWVVGeWNtRjVJaXdpYjI0aUxDSmxjeUlzSW1OMWNuSmxiblJVWVhKblpYUWlMQ0pwYm5SbGNuWmhiRTFoYm1GblpYSWlMQ0pzYjJOaGRHbHZiaUlzSW05dVpYQmhaMlZmYzJOeWIyeHNJaXdpYzJWamRHbHZia052Ym5SaGFXNWxjaUlzSW1WaGMybHVaeUlzSW1GdWFXMWhkR2x2YmxScGJXVWlMQ0p3WVdkcGJtRjBhVzl1SWl3aWRYQmtZWFJsVlZKTUlpd2lZbVZtYjNKbFRXOTJaU0lzSW1GbWRHVnlUVzkyWlNJc0lteHZiM0FpTENKclpYbGliMkZ5WkNJc0luSmxjM0J2Ym5OcGRtVkdZV3hzWW1GamF5SXNJbVJwY21WamRHbHZiaUlzSW0xdmRtVlVieUlzSW1OMWNuSmxiblJUWldOMGFXOXVJaXdpYUdGelEyeGhjM01pTENKelpXTjBhVzl1SWl3aWIyWm1jMlYwSWl3aWRHOXdJaXdpYlc5MlpVUnZkMjRpTENKb2FXUmxURzloWkdsdVowRnVhVzFoZEdsdmJpSXNJbkpsWVdSNVUzUmhkR1VpTENKbWJHRm5JaXdpYzNkcGNHVkRiMjUwY205c2JHVnlJaXdpWTJ4bFlYSkpiblJsY25aaGJDSXNJbkJzWVhraUxDSjBhVzFsYjNWMElpd2ljR0YxYzJVaUxDSnBibTVsY2tobGFXZG9kQ0lzSW0xaGRHTm9UV1ZrYVdFaUxDSnRZWFJqYUdWeklpd2ljR0ZuWlVsa2VDSXNJbUoxY21kbGNpSXNJbU5zWVhOelRHbHpkQ0lzSW1OdmJuUmhhVzV6SWl3aWJtRjJJaXdpY21WdGIzWmxJaXdpWW05a2VTSXNJbk4wZVd4bElpd2ljRzl6YVhScGIyNGlMQ0p6ZEc5d1VISnZjR0ZuWVhScGIyNGlMQ0p1WVhaRGIyNTBjbTlzSWl3aVlXUmtJaXdpWkdWMFpXTjBjM2RwY0dVaUxDSmxiQ0lzSW1aMWJtTWlMQ0p6ZDJsd1pWOWtaWFFpTENKeldDSXNJbk5aSWl3aVpWZ2lMQ0psV1NJc0ltMXBibDk0SWl3aWJXRjRYM2dpTENKdGFXNWZlU0lzSW0xaGVGOTVJaXdpWkdseVpXTWlMQ0owSWl3aWRHOTFZMmhsY3lJc0luTmpjbVZsYmxnaUxDSnpZM0psWlc1Wklpd2ljSEpsZG1WdWRFUmxabUYxYkhRaUxDSmtJaXdpYzJWamRHbHZialJRWVdkcGJtRjBhVzl1VEdWdVozUm9JaXdpYzJWamRHbHZiak5RWVdkcGJtRjBhVzl1VEdWdVozUm9JbDBzSW0xaGNIQnBibWR6SWpvaU96czdPMEZCUVVFc1NVRkJUVUVzVDBGQlR5eEhRVUZpTzBGQlEwRXNTVUZCU1VNc1kwRkJZeXhEUVVGc1FqdEJRVU5CTEVsQlFVbERMR05CUVdNc1EwRkJiRUk3TzBGQlJVRXNTVUZCVFVNc1dVRkJXVHRCUVVOcVFrTXNjVUpCUVc5Q0xFTkJSRWc3UVVGRmFrSkRMSEZDUVVGdlFpeERRVVpJTzBGQlIycENReXhYUVVGVk8wRkJRMVJETEZsQlFWVXNSVUZFUkR0QlFVVlVReXhsUVVGaE8wRkJSa29zUlVGSVR6dEJRVTlxUWtNc1YwRkJWVHRCUVVOVVJpeFpRVUZWTEVWQlJFUTdRVUZGVkVNc1pVRkJZVHRCUVVaS0xFVkJVRTg3UVVGWGFrSkZMR0ZCUVZrc1JVRkJRME1zV1VGQldTeERRVUZpTEVWQldFczdRVUZaYWtKRExGZEJRVlVzUlVGQlEwUXNXVUZCV1N4RFFVRmlMRVZCV2s4N1FVRmhha0pGTEZOQlFWRXNSVUZCUTBZc1dVRkJXU3hEUVVGaUxFVkJZbE03UVVGamFrSkhMRmRCUVZVc1JVRkJRMGdzV1VGQldTeERRVUZpTEVWQlpFODdRVUZsYWtKSkxFMUJRVXNzUlVGQlEwb3NXVUZCV1N4RFFVRmlPMEZCWmxrc1EwRkJiRUk3TzBGQmEwSkJMRWxCUVUxTExHOUNRVUZ2UWl4RFFVTjZRaXd3UTBGRWVVSXNSVUZGZWtJc2QwTkJSbmxDTEVWQlIzcENMSE5EUVVoNVFpeEZRVWw2UWl4M1EwRktlVUlzUlVGTGVrSXNiVU5CVEhsQ0xFTkJRVEZDT3p0QlFWRkJReXhGUVVGRlF5eFJRVUZHTEVWQlFWbERMRXRCUVZvc1EwRkJhMElzV1VGQlRUdEJRVU4yUWl4TFFVRkhReXhQUVVGUFF5eFZRVUZRTEVkQlFXOUNMRWRCUVhaQ0xFVkJRVFJDTzBGQlF6ZENPMEZCUTBWRExGRkJRVTBzZFVOQlFVNHNSVUZCSzBORExFbEJRUzlETEVOQlFXOUVMRlZCUVZORExGRkJRVlFzUlVGQmJVSTdRVUZEZEVVc1ZVRkJUMEVzVTBGQlUwTXNTVUZCVkN4RlFVRlFPMEZCUTBFc1IwRkdSQ3hGUVVWSFJpeEpRVVpJTEVOQlJWRXNWVUZCVTBjc1UwRkJWQ3hGUVVGdlFqdEJRVU16UWl4UFFVRk5ReXhaUVVGWlF5eGpRVUZqUml4VlFVRlZSeXhOUVVGNFFpeEZRVUZuUXl4TlFVRm9ReXhEUVVGc1FqdEJRVU5CTVVJc1lVRkJWVk1zVVVGQlZpeERRVUZ0UW10Q0xHTkJRVzVDTEdkRFFVRjNRMGdzVTBGQmVFTXNjMEpCUVhORVF5eGpRVUZqUml4VlFVRlZSeXhOUVVGNFFpeEZRVUZuUXl4VlFVRm9ReXhEUVVGMFJEdEJRVU5CTVVJc1lVRkJWVlVzVFVGQlZpeERRVUZwUW1sQ0xHTkJRV3BDTEdkRFFVRnpRMGdzVTBGQmRFTXNjMEpCUVc5RVF5eGpRVUZqUml4VlFVRlZSeXhOUVVGNFFpeEZRVUZuUXl4UlFVRm9ReXhEUVVGd1JEdEJRVU5CTVVJc1lVRkJWVmNzVVVGQlZpeERRVUZ0UW1kQ0xHTkJRVzVDTEdkRFFVRjNRMGdzVTBGQmVFTXNjMEpCUVhORVF5eGpRVUZqUml4VlFVRlZSeXhOUVVGNFFpeEZRVUZuUXl4VlFVRm9ReXhEUVVGMFJEdEJRVU5CTVVJc1lVRkJWVThzVlVGQlZpeERRVUZ4UW05Q0xHTkJRWEpDTEdkRFFVRXdRMGdzVTBGQk1VTXNjMEpCUVhkRVF5eGpRVUZqUml4VlFVRlZSeXhOUVVGNFFpeEZRVUZuUXl4UlFVRm9ReXhEUVVGNFJEdEJRVU5CTVVJc1lVRkJWVmtzUjBGQlZpeERRVUZqWlN4alFVRmtMR2REUVVGdFEwZ3NVMEZCYmtNc2MwSkJRV2xFUXl4alFVRmpSaXhWUVVGVlJ5eE5RVUY0UWl4RlFVRm5ReXhMUVVGb1F5eERRVUZxUkR0QlFVTklPMEZCUTBkRk8wRkJRMEZETEd0Q1FVRmxOMElzVTBGQlppeEZRVUV3UWl4RFFVRXhRanRCUVVOSU8wRkJRMGM0UWl4bFFVRlpMRmxCUVUwN1FVRkRha0pFTEcxQ1FVRmxOMElzVTBGQlppeEZRVUV3UWl4RFFVRXhRanRCUVVOQkxFbEJSa1FzUlVGRlJ5eEpRVVpJTzBGQlIwRXNSMEZvUWtRN1FVRnBRa0U3UVVGRFJqdEJRVU5ETEV0QlFVMTVRaXhuUWtGQlowSXNVMEZCYUVKQkxHRkJRV2RDTEVOQlFVTk5MRXRCUVVRc1JVRkJVVU1zVFVGQlVpeEZRVUZ0UWp0QlFVTjBReXhUUVVGUFJDeE5RVUZOUlN4TlFVRk9MRU5CUVdFN1FVRkJRU3hWUVVGTExFOUJRVTlETEVWQlFVVXNWVUZCUml4RFFVRlFMRXRCUVhsQ0xGRkJRWHBDTEVsQlFYRkRRU3hGUVVGRkxGVkJRVVlzUlVGQlkwTXNWMEZCWkN4SFFVRTBRa01zVVVGQk5VSXNRMEZCY1VOS0xFOUJRVTlITEZkQlFWQXNSVUZCY2tNc1EwRkJNVU03UVVGQlFTeEhRVUZpTEVOQlFWQTdRVUZEUml4RlFVWkVPMEZCUjBRN1FVRkRReXhMUVVGTlVDeG5Ra0ZCWjBJc1UwRkJhRUpCTEdGQlFXZENMRWRCUVUwN08wRkJSWHBDTEUxQlFVbFRMRmRCUVZjc1EwRkJaanRCUVVOQkxFMUJRVWxETEZWQlFWVXNRMEZCUXl4SlFVRkVMRVZCUVU4c1MwRkJVQ3hGUVVGakxGRkJRV1FzUlVGQmQwSXNSMEZCZUVJc1EwRkJaRHRCUVVOQkxFOUJRVWtzU1VGQlNVTXNTVUZCU1N4RFFVRmFMRVZCUVdWQkxFbEJRVWxFTEZGQlFWRkZMRTFCUVZvc1NVRkJjMElzUTBGQlEzWkNMRTlCUVU5M1FpeHhRa0ZCTjBNc1JVRkJiMFVzUlVGQlJVWXNRMEZCZEVVc1JVRkJlVVU3UVVGRGRrVjBRaXhWUVVGUGQwSXNjVUpCUVZBc1IwRkJLMEo0UWl4UFFVRlBjVUlzVVVGQlVVTXNRMEZCVWl4SlFVRlhMSFZDUVVGc1FpeERRVUV2UWp0QlFVTkJkRUlzVlVGQlQzbENMRzlDUVVGUUxFZEJRVGhDZWtJc1QwRkJUM0ZDTEZGQlFWRkRMRU5CUVZJc1NVRkJWeXh6UWtGQmJFSXNTMEZCTmtOMFFpeFBRVUZQY1VJc1VVRkJVVU1zUTBGQlVpeEpRVUZYTERaQ1FVRnNRaXhEUVVFelJUdEJRVU5FT3p0QlFVVkVMRTFCUVVrc1EwRkJRM1JDTEU5QlFVOTNRaXh4UWtGQldpeEZRVU5GZUVJc1QwRkJUM2RDTEhGQ1FVRlFMRWRCUVN0Q0xGVkJRVk5GTEZGQlFWUXNSVUZCYlVKRExFOUJRVzVDTEVWQlFUUkNPMEZCUTNwRUxFOUJRVWxETEZkQlFWY3NTVUZCU1VNc1NVRkJTaXhIUVVGWFF5eFBRVUZZTEVWQlFXWTdRVUZEUVN4UFFVRkpReXhoUVVGaFF5eExRVUZMUXl4SFFVRk1MRU5CUVZNc1EwRkJWQ3hGUVVGWkxFMUJRVTFNTEZkQlFWZFNMRkZCUVdwQ0xFTkJRVm9zUTBGQmFrSTdRVUZEUVN4UFFVRkpZeXhMUVVGTGJFTXNUMEZCVDIxRExGVkJRVkFzUTBGQmEwSXNXVUZCVnp0QlFVRkZWQ3hoUVVGVFJTeFhRVUZYUnl4VlFVRndRanRCUVVGclF5eEpRVUZxUlN4RlFVTlFRU3hWUVVSUExFTkJRVlE3UVVGRlFWZ3NZMEZCVjFFc1YwRkJWMGNzVlVGQmRFSTdRVUZEUVN4VlFVRlBSeXhGUVVGUU8wRkJRMFFzUjBGUVJEczdRVUZUUml4TlFVRkpMRU5CUVVOc1F5eFBRVUZQZVVJc2IwSkJRVm9zUlVGRFFYcENMRTlCUVU5NVFpeHZRa0ZCVUN4SFFVRTRRaXhWUVVGVFV5eEZRVUZVTEVWQlFXRTdRVUZEZWtORkxHZENRVUZoUml4RlFVRmlPMEZCUTBRc1IwRkdSRHRCUVVkR0xFVkJka0pFT3p0QlFUQkNRU3hMUVVGTlJ5eFhRVUZYTEZOQlFWaEJMRkZCUVZjc1EwRkJRME1zV1VGQlJDeEZRVUZyUWpzN1FVRkZiRU1zVFVGQlNVTXNWMEZCU2l4RlFVTkRReXhYUVVSRUxFVkJSVU5ETEUxQlJrUTdRVUZIUmp0QlFVTkZMRmRCUVZORExGRkJRVlFzUjBGQmNVSTdRVUZEYmtJM1F5eExRVUZGTEZWQlFVWXNSVUZCWXpoRExGRkJRV1FzUTBGQmRVSXNVVUZCZGtJN1FVRkRRVXdzWjBKQlFXRk5MRTFCUVdJc1IwRkJjMEkxUXl4UFFVRlBkMElzY1VKQlFWQXNRMEZCTmtKclFpeFJRVUUzUWl4RFFVRjBRanRCUVVOQlNDeGxRVUZaVFN4TlFVRmFPMEZCUTBGT0xHVkJRVmxQTEUxQlFWbzdRVUZEUkRzN1FVRkZSQ3hYUVVGVFF5eE5RVUZVTEVOQlFXbENReXhQUVVGcVFpeEZRVUV3UWpzN1FVRkZla0lzVDBGQlNVTXNUMEZCVHl4RlFVRllPMEZCUVVFc1QwRkRRME1zWVVGQllTeERRVVJrTzBGQlFVRXNUMEZGUTBNc1dVRkJXU3hEUVVaaU8wRkJRVUVzVDBGSFEwTXNXVUZCV1N4RFFVaGlPMEZCUVVFc1QwRkpRME1zWjBKQlFXZENUQ3hSUVVGUlN5eGhRVUZTTEVsQlFYbENMRU5CU2pGRE8wRkJRVUVzVDBGTFEwTXNhVUpCUVdsQ1RpeFJRVUZSVFN4alFVRlNMRWxCUVRCQ0xFTkJURFZET3p0QlFVOUJUQ3hSUVVGTFRTeFBRVUZNTEVkQlFXVlFMRkZCUVZGUExFOUJRWFpDTzBGQlEwRk9MRkZCUVV0UExFdEJRVXdzUjBGQllWSXNVVUZCVVZFc1MwRkJja0k3UVVGRFFWQXNVVUZCUzFFc1RVRkJUQ3hIUVVGalZDeFJRVUZSVXl4TlFVRjBRanRCUVVOQlVpeFJRVUZMVXl4TFFVRk1MRWRCUVdGV0xGRkJRVkZWTEV0QlFYSkNPMEZCUTBGVUxGRkJRVXRWTEV0QlFVd3NSMEZCWVZnc1VVRkJVVmNzUzBGQmNrSTdPMEZCUlVGV0xGRkJRVXRLTEUxQlFVd3NSMEZCWXl4WlFVRlpPenRCUVVWeVFrMHNhVUpCUVdFc1EwRkJZanM3UVVGRlFTeFJRVUZKUVN4WlFVRlpSU3hoUVVGb1FpeEZRVUVyUWpzN1FVRkZiRU5HTEdsQ1FVRlpMRU5CUVZvN1FVRkRTenRCUVVOQkxGTkJRVWxFTEdGQlFXRkpMR2xDUVVGcFFpeERRVUZzUXl4RlFVRnhRenRCUVVOeVF6dEJRVU5GU2l4dlFrRkJZeXhEUVVGa08wRkJRMFFzVFVGSVJDeE5RVWRQTzBGQlExQkZPMEZCUTBWR0xHMUNRVUZoTEVOQlFXSTdPMEZCUlVFc1ZVRkJSMFVzWTBGQlkwZ3NTMEZCUzFVc1MwRkJkRUlzUlVGQk5rSTdRVUZETlVJelJDeGpRVUZQZVVJc2IwSkJRVkFzUTBGQk5FSmhMR0ZCUVdGTkxFMUJRWHBETzBGQlEwRTdRVUZEUmp0QlFVTklPMEZCUTBZc1NVRndRa2c3TzBGQmMwSkJTeXhSUVVGTFNDeE5RVUZNTEVkQlFXTXNXVUZCV1RzN1FVRkZlRUk3UVVGRFFVY3NVMEZCUzAwc1QwRkJUQ3hEUVVGaFN5eFRRVUZpTEVOQlFYVkNMRU5CUVhaQ0xFVkJRVEJDTEVOQlFURkNMRVZCUVRaQ1dDeExRVUZMVHl4TFFVRnNReXhGUVVGNVExQXNTMEZCUzFFc1RVRkJPVU03TzBGQlJVRlNMRk5CUVV0TkxFOUJRVXdzUTBGQllVMHNVMEZCWWl4RFFVTkZXaXhMUVVGTFV5eExRVVJRTEVWQlJVVndRaXhoUVVGaE5VSXNZMEZCWWl4RFFVRTBRbmRETEZWQlFUVkNMRVZCUVhkRFdTeExRVUY0UXl4RFFVRTRRM2hETEVOQlJtaEVMRVZCUjBWblFpeGhRVUZoTlVJc1kwRkJZaXhEUVVFMFFuZERMRlZCUVRWQ0xFVkJRWGREV1N4TFFVRjRReXhEUVVFNFEwTXNRMEZJYUVRc1JVRkpSU3hIUVVwR0xFVkJTMFVzUjBGTVJpeEZRVTFGTEVOQlRrWXNSVUZQUlN4RFFWQkdMRVZCVVVVdlJDeFBRVUZQUXl4VlFVRlFMRWRCUVc5Q0xFdEJVblJDTEVWQlUwVkVMRTlCUVU5RExGVkJRVkFzUjBGQmIwSXNSMEZVZEVJN1FVRlZSQ3hKUVdaRU96dEJRV2xDUVN4VlFVRlBaMFFzU1VGQlVEdEJRVU5CT3p0QlFVVkVPMEZCUTBGU0xGZEJRVk16UXl4VFFVRlRhMFVzWTBGQlZDeERRVUYzUWl4UlFVRjRRaXhEUVVGVU8wRkJRMEYyUWl4VFFVRlBaU3hMUVVGUUxFZEJRV1Y0UkN4UFFVRlBReXhWUVVGUUxFZEJRVzlDTEV0QlFXNURPMEZCUTBGM1F5eFRRVUZQWjBJc1RVRkJVQ3hIUVVGblFucEVMRTlCUVU5RExGVkJRVkFzUjBGQmIwSXNSMEZCY0VNN08wRkJSVUU3UVVGRFFYVkRMR2RDUVVGakxFbEJRVWw1UWl4TFFVRktMRVZCUVdRN08wRkJSVUU3UVVGRFFURkNMR2RDUVVGalVTeFBRVUZQTzBGQlEzQkNVU3haUVVGVFpDeFBRVUZQZVVJc1ZVRkJVQ3hEUVVGclFpeEpRVUZzUWl4RFFVUlhPMEZCUlhCQ1ZpeFZRVUZQTEVsQlJtRTdRVUZIY0VKRExGZEJRVkVzU1VGSVdUdEJRVWx3UWtNc1ZVRkJUMnhDTEZkQlNtRTdRVUZMY0VKakxHMUNRVUZuUW1oQ0xHRkJRV0UxUWl4alFVRmlMRU5CUVRSQ1lTeE5RVXg0UWp0QlFVMXdRamhDTEd0Q1FVRmxMRU5CVGtzN1FVRlBjRUpOTEZWQlFVOXlRaXhoUVVGaEwwTTdRVUZRUVN4SFFVRlFMRU5CUVdRN08wRkJWVUU3UVVGRFFXbEVMR05CUVZreVFpeG5Ra0ZCV2l4RFFVRTJRaXhOUVVFM1FpeEZRVUZ4UTNwQ0xGRkJRWEpETzBGQlEwRkdMR05CUVZrMFFpeEhRVUZhTEVkQlFXdENMREJEUVVGc1FqdEJRVU5CTEVWQk5VWkVPenRCUVRoR1JEczdRVUZGUXl4TFFVRk5ReXhoUVVGaExGTkJRV0pCTEZWQlFXRXNRMEZCUTBNc1MwRkJSQ3hGUVVGWE8wRkJRemRDTEUxQlFVZEJMRlZCUVZVc1EwRkJZaXhGUVVGblFqdEJRVU5tZWtVc1MwRkJSU3hQUVVGR0xFVkJRVmN3UlN4WFFVRllMRU5CUVhWQ0xGbEJRWFpDTzBGQlEwRXhSU3hMUVVGRkxHOUNRVUZHTEVWQlFYZENNRVVzVjBGQmVFSXNRMEZCYjBNc2FVSkJRWEJETzBGQlEwRXhSU3hMUVVGRkxGZEJRVVlzUlVGQlpUSkZMRWxCUVdZc1EwRkJiMElzVlVGQmNFSXNSVUZCWjBNM1FpeFJRVUZvUXl4RFFVRjVReXhoUVVGNlF6dEJRVU5CT1VNc1MwRkJSU3hoUVVGR0xFVkJRV2xDT0VNc1VVRkJha0lzUTBGQk1FSXNhVUpCUVRGQ08wRkJRMEU1UXl4TFFVRkZMR0ZCUVVZc1JVRkJhVUl5UlN4SlFVRnFRaXhEUVVGelFpeFBRVUYwUWl4RlFVRXJRamRDTEZGQlFTOUNMRU5CUVhkRExGbEJRWGhETzBGQlEwRTVReXhMUVVGRkxGZEJRVVlzUlVGQlpUSkZMRWxCUVdZc1EwRkJiMElzWTBGQmNFSXNSVUZCYjBNM1FpeFJRVUZ3UXl4RFFVRTJReXhOUVVFM1F6dEJRVU5CVWl4alFVRlhMRmxCUVUwN1FVRkRhRUowUXl4TlFVRkZMRFJDUVVGR0xFVkJRV2RETWtVc1NVRkJhRU1zUTBGQmNVTXNWVUZCY2tNc1JVRkJhVVEzUWl4UlFVRnFSQ3hEUVVFd1JDeFJRVUV4UkR0QlFVTkJMRWxCUmtRc1JVRkZSeXhKUVVaSU8wRkJSMEVzUjBGV1JDeE5RVmRMTzBGQlEwbzVReXhMUVVGRkxFOUJRVVlzUlVGQlZ6QkZMRmRCUVZnc1EwRkJkVUlzV1VGQmRrSTdRVUZEUVRGRkxFdEJRVVVzWVVGQlJpeEZRVUZwUWpCRkxGZEJRV3BDTEVOQlFUWkNMR2xDUVVFM1FqdEJRVU5CTVVVc2VVTkJRVzlEZVVVc1MwRkJjRU1zYTBKQlFYZEVReXhYUVVGNFJDeERRVUZ2UlN4cFFrRkJjRVU3UVVGRFFURkZMSGRDUVVGeFFqSkZMRWxCUVhKQ0xIVkNRVUZuUkRkQ0xGRkJRV2hFTEVOQlFYbEVMR2xDUVVGNlJEdEJRVU5CT1VNc2RVSkJRVzlDTWtVc1NVRkJjRUlzUTBGQmVVSXNUMEZCZWtJc1JVRkJhME0zUWl4UlFVRnNReXhEUVVFeVF5eFpRVUV6UXpzN1FVRkZRU3hQUVVGSE9VTXNaVUZCWVhsRkxFdEJRV0lzYzBKQlFYRkRMME1zVFVGQmNrTXNTVUZCSzBNeFFpeGxRVUZoZVVVc1MwRkJZaXcyUWtGQk5FTXZReXhOUVVFMVF5eEhRVUZ4UkN4RFFVRjJSeXhGUVVFd1J6dEJRVU42UnpGQ0xHMUNRVUZoZVVVc1MwRkJZaXh6UWtGQmNVTkhMRWRCUVhKRExFTkJRWGxETEVOQlFYcERMRVZCUVRSRFF5eExRVUUxUXp0QlFVTkJPMEZCUTBRN1FVRkRSQ3hGUVhaQ1JEczdRVUY1UWtRN08wRkJSVU1zUzBGQlRVTXNiMEpCUVc5Q0xGTkJRWEJDUVN4cFFrRkJiMElzUTBGQlEwTXNZVUZCUkN4RlFVRm5Ra01zUjBGQmFFSXNSVUZCZDBJN1FVRkRha1JvUml4cFFrRkJZU3RGTEdGQlFXSXNhMEpCUVhWRFF5eEhRVUYyUXl4RlFVRTRRME1zVVVGQk9VTXNRMEZCZFVRc2IwSkJRWFpFTEVWQlFUWkZReXhIUVVFM1JTeERRVUZwUml4VlFVRkRReXhGUVVGRUxFVkJRVXRETEVkQlFVd3NSVUZCWVR0QlFVTTNSbkJHTEV0QlFVVnZSaXhIUVVGR0xFVkJRVTlETEVkQlFWQXNRMEZCVnl4RlFVRkRReXhUUVVGVExFTkJRVllzUlVGQldEdEJRVU5CTEVkQlJrUTdPMEZCU1VGMFJpeHBRa0ZCWVN0RkxHRkJRV0lzYTBKQlFYVkRReXhIUVVGMlF5eEZRVUU0UTBzc1IwRkJPVU1zUTBGQmEwUTdRVUZEYWtRc1owSkJRV0VzV1VGRWIwTTdRVUZGYWtRc1kwRkJWenRCUVVaelF5eEhRVUZzUkR0QlFVbEJMRVZCVkVRN08wRkJWMFE3UVVGRFExQXNiVUpCUVd0Q0xFTkJRV3hDTEVWQlFYRkNMRU5CUVhKQ08wRkJRMEZCTEcxQ1FVRnJRaXhEUVVGc1FpeEZRVUZ4UWl4RFFVRnlRanRCUVVOQlFTeHRRa0ZCYTBJc1EwRkJiRUlzUlVGQmNVSXNRMEZCY2tJN08wRkJSVVE3TzBGQlJVTXNTMEZCVFM5RUxHbENRVUZwUWl4VFFVRnFRa0VzWTBGQmFVSXNRMEZCUTNkRkxFMUJRVVFzUlVGQlUxSXNZVUZCVkN4RlFVRXlRanRCUVVOcVJDeE5RVUZKVXl3d1FrRkJTanM3UVVGRlFTeE5RVUZIVkN4clFrRkJhMElzUTBGQmNrSXNSVUZCZDBJN1FVRkRka0lzVjBGQlQxRXNUMEZCVDI1SExHdENRVUZrTzBGQlEwTXNVMEZCU3l4RFFVRk1PMEZCUTBOdlJ5eDVRa0ZCYjBKMFJ5eFZRVUZWVHl4VlFVRTVRanRCUVVORU8wRkJRMEVzVTBGQlN5eERRVUZNTzBGQlEwTXJSaXg1UWtGQmIwSjBSeXhWUVVGVlV5eFJRVUU1UWp0QlFVTkVPMEZCUTBFc1UwRkJTeXhEUVVGTU8wRkJRME0yUml4NVFrRkJiMEowUnl4VlFVRlZWU3hOUVVFNVFqdEJRVU5FTzBGQlEwRXNVMEZCU3l4RFFVRk1PMEZCUTBNMFJpeDVRa0ZCYjBKMFJ5eFZRVUZWVnl4UlFVRTVRanRCUVVORU8wRkJRMEVzVTBGQlN5eERRVUZNTzBGQlEwTXlSaXg1UWtGQmIwSjBSeXhWUVVGVldTeEhRVUU1UWp0QlFVTkVPMEZCWmtRN1FVRnBRa0U3TzBGQlJVUkZMR2xDUVVGaEswVXNZVUZCWWl4RlFVRTRRa29zU1VGQk9VSXNRMEZCYlVNc1QwRkJia01zUlVGQk5FTkVMRmRCUVRWRExFTkJRWGRFTEZsQlFYaEVPMEZCUTBFeFJTeHBRa0ZCWVN0RkxHRkJRV0lzYTBKQlFYVkRVU3h0UWtGQmFVSlNMR0ZCUVdwQ0xHZENRVUYyUXl4RlFVRnpSa3dzVjBGQmRFWXNRMEZCYTBjc2FVSkJRV3hITzBGQlEwRkpMRzlDUVVGclFrTXNZVUZCYkVJc1JVRkJhVU5STEcxQ1FVRnBRbElzWVVGQmFrSXNaMEpCUVdwRE96dEJRVVZCZWtNc1lVRkJWeXhaUVVGTk8wRkJRMmhDTEU5QlFVZDVReXhyUWtGQmEwSXNRMEZCY2tJc1JVRkJkMEk3UVVGRGRrSjJReXhoUVVGVFowUXNhVUpCUVZRN1FVRkRRVHM3UVVGRlJIaEdMR3RDUVVGaEswVXNZVUZCWWl4RlFVRTRRa29zU1VGQk9VSXNkVUpCUVhsRU4wSXNVVUZCZWtRc1EwRkJhMFVzYVVKQlFXeEZPMEZCUTBFNVF5eHJRa0ZCWVN0RkxHRkJRV0lzUlVGQk9FSktMRWxCUVRsQ0xFTkJRVzFETEU5QlFXNURMRVZCUVRSRE4wSXNVVUZCTlVNc1EwRkJjVVFzV1VGQmNrUTdRVUZEUVN4SFFWQkVMRVZCVDBjc1IwRlFTRHM3UVVGVFFTeE5RVUZIZVVNc2JVSkJRV2xDVWl4aFFVRnFRaXh4UWtGQlowUXZSU3hsUVVGaEswVXNZVUZCWWl4RlFVRTRRa29zU1VGQk9VSXNkVUpCUVhsRWFrUXNUVUZCZWtRc1IwRkJhMFVzUTBGQmNrZ3NSVUZCZDBnN1FVRkRka2cyUkN4elFrRkJhVUpTTEdGQlFXcENMRzFDUVVFNFF5eERRVUU1UXp0QlFVTkJMRWRCUmtRc1RVRkZUenRCUVVOT1VTeHpRa0ZCYVVKU0xHRkJRV3BDTEc5Q1FVRXJReXhEUVVFdlF6dEJRVU5CTzBGQlEwUXNSVUY2UTBRN1FVRXdRMFE3UVVGRFEyaEZMR2RDUVVGbE4wSXNVMEZCWml4RlFVRXdRaXhEUVVFeFFqczdRVUZGUkR0QlFVTkRPRUlzWVVGQldTeFpRVUZOTzBGQlEycENSQ3hwUWtGQlpUZENMRk5CUVdZc1JVRkJNRUlzUTBGQk1VSTdRVUZEUVN4RlFVWkVMRVZCUlVjc1MwRkdTRHM3UVVGSlJEczdRVUZGUXl4TFFVRk5kVWNzT0VKQlFUaENMRk5CUVRsQ1FTd3lRa0ZCT0VJc1EwRkJRME1zUTBGQlJDeEZRVUZQT3p0QlFVVXhReXhOUVVGTlZpeE5RVUZOVnl4VFFVRlRNMFlzUlVGQlJUQkdMRVZCUVVWRkxFMUJRVW9zUlVGQldVTXNTVUZCV2l4RFFVRnBRaXhaUVVGcVFpeERRVUZVTEVOQlFWbzdRVUZEUVN4TlFVRk5ReXhaUVVGWk9VWXNSVUZCUlRCR0xFVkJRVVZGTEUxQlFVb3NSVUZCV1Vjc1QwRkJXaXhEUVVGdlFpeFRRVUZ3UWl4RlFVRXJRa1lzU1VGQkwwSXNRMEZCYjBNc1NVRkJjRU1zUTBGQmJFSTdRVUZEUVN4TlFVRkpSeXd3UWtGQlNqczdRVUZGUVN4TlFVRkhSaXhqUVVGakxGVkJRV3BDTEVWQlFUWkNPMEZCUXpWQ09VY3NhVUpCUVdOblJ5eEhRVUZrTzBGQlEwRTdPMEZCUlVRc1RVRkJSMk1zWTBGQll5eFZRVUZxUWl4RlFVRTJRanRCUVVNMVFqZEhMR2xDUVVGakswWXNSMEZCWkR0QlFVTkJPenRCUVVWRWFFWXNWVUZCVFRoR0xGTkJRVTRzUlVGQmJVSnVRaXhKUVVGdVFpeERRVUYzUWl4UFFVRjRRaXhGUVVGcFEwUXNWMEZCYWtNc1EwRkJOa01zV1VGQk4wTTdRVUZEUVRGRkxGVkJRVTA0Uml4VFFVRk9MRVZCUVcxQ2JrSXNTVUZCYmtJc1EwRkJkMElzWTBGQmVFSXNSVUZCZDBORUxGZEJRWGhETEVOQlFXOUVMRTFCUVhCRU8wRkJRMEV4UlN4VlFVRk5PRVlzVTBGQlRpeEZRVUZ0UW01Q0xFbEJRVzVDTEd0Q1FVRjFRMHNzUjBGQmRrTXNSVUZCT0VOc1F5eFJRVUU1UXl4RFFVRjFSQ3hOUVVGMlJEdEJRVU5CT1VNc1ZVRkJUVGhHTEZOQlFVNHNhMEpCUVRSQ1pDeEhRVUUxUWl4RlFVRnRRMDRzVjBGQmJrTXNRMEZCSzBNc2FVSkJRUzlETzBGQlEwRXhSU3hWUVVGTk9FWXNVMEZCVGl4elFrRkJhME53UWl4WFFVRnNReXhEUVVFNFF5eFJRVUU1UXp0QlFVTkJNVVVzU1VGQlJUQkdMRVZCUVVWRkxFMUJRVW9zUlVGQldUbERMRkZCUVZvc1EwRkJjVUlzVVVGQmNrSTdPMEZCUlVGblF5eHZRa0ZCYTBKaExGTkJRVk16Uml4UlFVRk5PRVlzVTBGQlRpeEZRVUZ0UWtRc1NVRkJia0lzUTBGQmQwSXNXVUZCZUVJc1EwRkJWQ3hEUVVGc1FpeEZRVUZ0UldJc1IwRkJia1U3TzBGQlJVRXhReXhoUVVGWExGbEJRVTA3UVVGRGFFSnJReXhqUVVGWGJVSXNVMEZCVXpOR0xGRkJRVTA0Uml4VFFVRk9MRVZCUVcxQ1JDeEpRVUZ1UWl4RFFVRjNRaXhaUVVGNFFpeERRVUZVTEVOQlFWZzdRVUZEUVN4SFFVWkVMRVZCUlVjc1IwRkdTRHM3UVVGSlFTeE5RVUZIUXl4alFVRmpMRlZCUVdwQ0xFVkJRVFJDTzBGQlF6TkNPVVlzVjBGQlRUaEdMRk5CUVU0c1JVRkJiVUp1UWl4SlFVRnVRaXhEUVVGM1FpeGhRVUY0UWl4RlFVRjFRemRDTEZGQlFYWkRMRU5CUVdkRUxGRkJRV2hFTzBGQlEwRTVReXhYUVVGTk9FWXNVMEZCVGl4RlFVRnRRa2NzUlVGQmJrSXNRMEZCYzBJc2EwUkJRWFJDTEVWQlFUQkZMRlZCUVVORExFVkJRVVFzUlVGQlVUdEJRVU12Uld4SExGbEJRVTA0Uml4VFFVRk9MRVZCUVcxQ2JrSXNTVUZCYmtJc1EwRkJkMElzWVVGQmVFSXNSVUZCZFVORUxGZEJRWFpETEVOQlFXMUVMRkZCUVc1RU8wRkJRMFlzU1VGR1JEdEJRVWRCTzBGQlEwUXNSVUZxUTBRN08wRkJiVU5FT3p0QlFVVkRNVVVzUjBGQlJTeHZSRUZCUml4RlFVRjNSRFpGTEV0QlFYaEVMRU5CUVRoRUxGVkJRVU5oTEVOQlFVUXNSVUZCVHpzN1FVRkZjRVVzVFVGQlIzaEhMRlZCUVZWakxFVkJRVVV3Uml4RlFVRkZVeXhoUVVGS0xFVkJRVzFDU2l4UFFVRnVRaXhEUVVFeVFpeFRRVUV6UWl4RlFVRnpRMFlzU1VGQmRFTXNRMEZCTWtNc1NVRkJNME1zUTBGQlZpeEZRVUUwUkhSSExGZEJRUzlFTEVWQlFUUkZPMEZCUXpsRk8wRkJRMGMyUnl4dFFrRkJaMElzUzBGQmFFSXNSVUZCZFVKd1J5eEZRVUZGTUVZc1JVRkJSVk1zWVVGQlNpeEZRVUZ0UWtvc1QwRkJia0lzUTBGQk1rSXNVMEZCTTBJc1JVRkJjME5HTEVsQlFYUkRMRU5CUVRKRExFbEJRVE5ETEVOQlFYWkNPMEZCUTBnN1FVRkRSMDhzYlVKQlFXZENMRWxCUVdoQ0xFVkJRWE5DY0Vjc1JVRkJSVEJHTEVWQlFVVlRMR0ZCUVVvc1JVRkJiVUpLTEU5QlFXNUNMRU5CUVRKQ0xGTkJRVE5DTEVWQlFYTkRSaXhKUVVGMFF5eERRVUV5UXl4SlFVRXpReXhEUVVGMFFpeEZRVUYzUlN4SlFVRjRSVHRCUVVOQk8wRkJRMGc3UVVGRFJVb3NPRUpCUVRSQ1F5eERRVUUxUWp0QlFVTkJMRVZCVmtRN08wRkJXVVE3TzBGQlJVTXNTMEZCUnl4RFFVRkRNVVlzUlVGQlJYRkhMRkZCUVVZc1JVRkJXVklzU1VGQldpeERRVUZwUWl4TlFVRnFRaXhGUVVGNVFuWkZMRkZCUVhwQ0xFTkJRV3RETEZkQlFXeERMRU5CUVVvc1JVRkJiMFE3UVVGRGJrUjBRaXhKUVVGRkxHdENRVUZHTEVWQlFYTkNjMGNzWTBGQmRFSXNRMEZCY1VNN1FVRkRjRU5ETEhGQ1FVRnJRaXhUUVVSclFqdEJRVVZ3UTBNc1YwRkJVU3hWUVVZMFFqdEJRVWR3UTBNc2EwSkJRV1V4U0N4SlFVaHhRanRCUVVsd1F6SklMR1ZCUVZrc1NVRktkMEk3UVVGTGNFTkRMR05CUVZjc1NVRk1lVUk3UVVGTmNFTkRMR1ZCUVZrc2IwSkJRVU51UXl4TFFVRkVMRVZCUVZjc1EwRkJSU3hEUVU1WE8wRkJUM0JEYjBNc1kwRkJWeXh0UWtGQlEzQkRMRXRCUVVRc1JVRkJWenRCUVVONlFqczdRVUZGU1VRc1pVRkJWME1zUzBGQldEdEJRVU5CTEVsQldHMURPMEZCV1hCRGNVTXNVMEZCVFN4TFFWbzRRanRCUVdGd1EwTXNZVUZCVlN4SlFXSXdRanRCUVdOd1EwTXNkVUpCUVc5Q0xFdEJaR2RDTzBGQlpYQkRReXhqUVVGWE8wRkJabmxDTEVkQlFYSkRPenRCUVd0Q1FXcElMRWxCUVVVc2EwSkJRVVlzUlVGQmMwSnJTQ3hOUVVGMFFpeERRVUUyUWl4RFFVRTNRanRCUVVOQk96dEJRVVZHT3p0QlFVVkRiRWdzUjBGQlJTeFpRVUZHTEVWQlFXZENOa1VzUzBGQmFFSXNRMEZCYzBJc1ZVRkJRMkVzUTBGQlJDeEZRVUZQTzBGQlF6VkNMRTFCUVVsNVFpeHBRa0ZCYVVKdVNDeEZRVUZGTUVZc1JVRkJSVVVzVFVGQlNpeEZRVUZaUnl4UFFVRmFMRU5CUVc5Q0wwWXNSVUZCUlN4aFFVRkdMRU5CUVhCQ0xFTkJRWEpDT3p0QlFVVkJMRTFCUVVkdFNDeGxRVUZsUXl4UlFVRm1MRU5CUVhkQ0xFMUJRWGhDTEVOQlFVZ3NSVUZCYjBNN1FVRkRia05FTEd0Q1FVRmxla01zVjBGQlppeERRVUV5UWl4TlFVRXpRanRCUVVOQmVVTXNhMEpCUVdWNFF5eEpRVUZtTEVOQlFXOUNMRmxCUVhCQ0xFVkJRV3REUkN4WFFVRnNReXhEUVVFNFF5eFJRVUU1UXp0QlFVTkJlVU1zYTBKQlFXVnNReXhSUVVGbUxFTkJRWGRDTEdGQlFYaENMRVZCUVhWRFF5eEhRVUYyUXl4RFFVRXlReXhWUVVGRFJpeEhRVUZFTEVWQlFVMXhReXhQUVVGT0xFVkJRV3RDTzBGQlF6VkVja2dzVFVGQlJYRklMRTlCUVVZc1JVRkJWek5ETEZkQlFWZ3NRMEZCZFVJc1VVRkJka0k3UVVGRFFURkZMRTFCUVVWeFNDeFBRVUZHTEVWQlFWY3hReXhKUVVGWUxFTkJRV2RDTEU5QlFXaENMRVZCUVhsQ1JDeFhRVUY2UWl4RFFVRnhReXhUUVVGeVF5eEZRVUZuUkRWQ0xGRkJRV2hFTEVOQlFYbEVMRmxCUVhwRU8wRkJRMEVzU1VGSVJEdEJRVWxCTEVkQlVFUXNUVUZQVHp0QlFVTk9jVVVzYTBKQlFXVjZReXhYUVVGbUxFTkJRVEpDTEZGQlFUTkNMRVZCUVhGRE5VSXNVVUZCY2tNc1EwRkJPRU1zVFVGQk9VTTdRVUZEUVhGRkxHdENRVUZsYkVJc1JVRkJaaXhEUVVGclFpeHJSRUZCYkVJc1JVRkJjMFVzVlVGQlEwTXNSVUZCUkN4RlFVRlJPMEZCUXpORmJFY3NUVUZCUlN4clFrRkJSaXhGUVVGelFqSkZMRWxCUVhSQ0xFTkJRVEpDTEZsQlFUTkNMRVZCUVhsRE4wSXNVVUZCZWtNc1EwRkJhMFFzVVVGQmJFUTdRVUZEUml4SlFVWkVPMEZCUjBGeFJTeHJRa0ZCWld4RExGRkJRV1lzUTBGQmQwSXNZVUZCZUVJc1JVRkJkVU5ETEVkQlFYWkRMRU5CUVRKRExGVkJRVU5HTEVkQlFVUXNSVUZCVFhGRExFOUJRVTRzUlVGQmEwSTdRVUZETlVSeVNDeE5RVUZGY1Vnc1QwRkJSaXhGUVVGWE0wTXNWMEZCV0N4RFFVRjFRaXhOUVVGMlFpeEZRVUVyUWpWQ0xGRkJRUzlDTEVOQlFYZERMRkZCUVhoRE8wRkJRMEU1UXl4TlFVRkZjVWdzVDBGQlJpeEZRVUZYTVVNc1NVRkJXQ3hEUVVGblFpeFBRVUZvUWl4RlFVRjVRa1FzVjBGQmVrSXNRMEZCY1VNc1dVRkJja01zUlVGQmJVUTFRaXhSUVVGdVJDeERRVUUwUkN4VFFVRTFSRHRCUVVOQk9VTXNUVUZCUlhGSUxFOUJRVVlzUlVGQlZ6RkRMRWxCUVZnc1EwRkJaMElzV1VGQmFFSXNSVUZCT0VKRUxGZEJRVGxDTEVOQlFUQkRMRkZCUVRGRE8wRkJRMEVzU1VGS1JEdEJRVXRCTzBGQlEwUjVReXhwUWtGQlpYaERMRWxCUVdZc1EwRkJiMElzVDBGQmNFSXNSVUZCTmtKRUxGZEJRVGRDTEVOQlFYbERMRk5CUVhwRExFVkJRVzlFTlVJc1VVRkJjRVFzUTBGQk5rUXNXVUZCTjBRN1FVRkRRU3hGUVhSQ1JEczdRVUYzUWtRN08wRkJSVU01UXl4SFFVRkZMRmxCUVVZc1JVRkJaMEkyUlN4TFFVRm9RaXhEUVVGelFpeFpRVUZOTzBGQlF6TkNMRTFCUVVjM1JTeEZRVUZGUnl4TlFVRkdMRVZCUVZWNVJDeE5RVUZXTEUxQlFYTkNOVVFzUlVGQlJTeFBRVUZHTEVWQlFWY3dRaXhOUVVGWUxFZEJRVzlDTEVOQlFURkRMRTFCUVdsRUxFTkJRVVV4UWl4RlFVRkZMR3RDUVVGR0xFVkJRWE5DYzBnc1RVRkJkRUlzUjBGQkswSkRMRWRCUVhKR0xFVkJRVEJHTzBGQlF6VkdPMEZCUTBsMlNDeExRVUZGTEd0Q1FVRkdMRVZCUVhOQ2EwZ3NUVUZCZEVJc1EwRkJOa0lzUTBGQk4wSTdRVUZEUkN4SFFVaEVMRTFCUjA4N1FVRkRUbXhJTEV0QlFVVXNhMEpCUVVZc1JVRkJjMEozU0N4UlFVRjBRanRCUVVOQk8wRkJRMFFzUlVGUVJEczdRVUZUUkRzN1FVRkZReXhMUVVGTlF5eDFRa0ZCZFVJc1UwRkJka0pCTEc5Q1FVRjFRaXhIUVVGTk8wRkJRMnhETEUxQlFVZDBTQ3hQUVVGUFF5eFZRVUZRTEVkQlFXOUNMRWRCUVhCQ0xFbEJRVEpDTEVOQlFVTktMRVZCUVVVc1ZVRkJSaXhGUVVGamIwZ3NVVUZCWkN4RFFVRjFRaXhSUVVGMlFpeERRVUV2UWl4RlFVRnBSVHM3UVVGRmFFVXNUMEZCUjNCSUxFVkJRVVVzVVVGQlJpeEZRVUZaTkVVc1IwRkJXaXhEUVVGblFpeERRVUZvUWl4RlFVRnRRamhETEZWQlFXNUNMRXRCUVd0RExFTkJRWEpETEVWQlFYZERPMEZCUTNaRE1VZ3NUVUZCUlN4VlFVRkdMRVZCUVdNNFF5eFJRVUZrTEVOQlFYVkNMRkZCUVhaQ08wRkJRMEU3UVVGRFJEdEJRVU5FTEVWQlVFUTdPMEZCVTBRN08wRkJSVU1zUzBGQlRYTkVMR3RDUVVGclFpeFRRVUZzUWtFc1pVRkJhMElzUTBGQlEzVkNMRWxCUVVRc1JVRkJUemRDTEZOQlFWQXNSVUZCYTBJdlJ5eEpRVUZzUWl4RlFVRXlRanRCUVVOb1JDeE5RVUZITkVrc1NVRkJTQ3hGUVVGVE8wRkJRMVI2U1N4aFFVRlZORWNzVTBGQlZpeEZRVUZ4UW5oSExGRkJRWEpDTEVkQlFXZERNRUlzV1VGQldTeFpRVUZOTzBGQlF5OURORWNzYjBKQlFXZENPVUlzVTBGQmFFSXNSVUZCTWtJc1IwRkJNMEk3UVVGRFFTeEpRVVkyUWl4RlFVVXpRaTlITEVsQlJqSkNMRU5CUVdoRE8wRkJSME1zUjBGS1JDeE5RVWxQTzBGQlEwNDRTU3hwUWtGQll6TkpMRlZCUVZVMFJ5eFRRVUZXTEVWQlFYRkNlRWNzVVVGQmJrTTdRVUZEUVR0QlFVTklMRVZCVWtRN08wRkJWVVE3TzBGQlJVTXNTMEZCUnl4RFFVRkRWU3hGUVVGRmNVY3NVVUZCUml4RlFVRlpVaXhKUVVGYUxFTkJRV2xDTEUxQlFXcENMRVZCUVhsQ2RrVXNVVUZCZWtJc1EwRkJhME1zVjBGQmJFTXNRMEZCU2l4RlFVRnZSRHRCUVVOdVJFNHNZMEZCV1N4WlFVRk5PMEZCUTJwQ0xFOUJRVWRvUWl4RlFVRkZMR3RDUVVGR0xFVkJRWE5DYzBnc1RVRkJkRUlzUjBGQkswSkRMRWRCUVM5Q0xFbEJRWE5ETEVOQlFYcERMRVZCUVRSRE8wRkJRek5EZGtnc1RVRkJSU3gxUWtGQlJpeEZRVUV5UWpoRExGRkJRVE5DTEVOQlFXOURMR1ZCUVhCRE8wRkJRMEU1UXl4TlFVRkZMRkZCUVVZc1JVRkJXVFJGTEVkQlFWb3NRMEZCWjBJc1EwRkJhRUlzUlVGQmJVSnJSQ3hKUVVGdVFqdEJRVU5CT1Vnc1RVRkJSU3hSUVVGR0xFVkJRVms0UXl4UlFVRmFMRU5CUVhGQ0xGTkJRWEpDTzBGQlEwRXNTVUZLUkN4TlFVbFBPMEZCUTA0c1VVRkJTV2xHTEZWQlFWVjZSaXhYUVVGWExGbEJRVTA3UVVGRE9VSjBReXhQUVVGRkxIVkNRVUZHTEVWQlFUSkNNRVVzVjBGQk0wSXNRMEZCZFVNc1pVRkJka003UVVGRFFURkZMRTlCUVVVc1VVRkJSaXhGUVVGWk5FVXNSMEZCV2l4RFFVRm5RaXhEUVVGb1FpeEZRVUZ0UW05RUxFdEJRVzVDTzBGQlEwRm9TU3hQUVVGRkxGRkJRVVlzUlVGQldUQkZMRmRCUVZvc1EwRkJkMElzVTBGQmVFSTdRVUZEUVc1RExHdENRVUZoZDBZc1QwRkJZanRCUVVOQkxFdEJUR0VzUlVGTFdHaEtMRWxCVEZjc1EwRkJaRHRCUVUxQk96dEJRVVZLT3p0QlFVVkhMRTlCUVVkcFFpeEZRVUZGTEd0Q1FVRkdMRVZCUVhOQ2MwZ3NUVUZCZEVJc1IwRkJLMEpETEVkQlFTOUNMRWRCUVhGRExFVkJRVWR3U0N4UFFVRlBPRWdzVjBGQlVDeEhRVUZ4UWl4RFFVRjRRaXhEUVVGNFF5eEZRVUZ2UlR0QlFVTnVSV3BKTEUxQlFVVXNXVUZCUml4RlFVRm5RbkZHTEVkQlFXaENMRU5CUVc5Q0xFVkJRVU1zWVVGQllTeHBRMEZCWkN4RlFVRndRanRCUVVOQkxFbEJSa1FzVFVGRlR6dEJRVU5PY2tZc1RVRkJSU3haUVVGR0xFVkJRV2RDY1VZc1IwRkJhRUlzUTBGQmIwSXNSVUZCUXl4aFFVRmhMQ3RDUVVGa0xFVkJRWEJDTzBGQlEwRTdPMEZCUlVSdlF6czdRVUZGU0RzN1FVRkZSeXhQUVVGSGRFZ3NUMEZCVHl0SUxGVkJRVkFzUTBGQmEwSXNNRUpCUVd4Q0xFVkJRVGhEUXl4UFFVRTVReXhKUVVGNVJHaEpMRTlCUVU5RExGVkJRVkFzUjBGQmIwSXNSMEZCYUVZc1JVRkJjVVk3UVVGRGJrWktMRTFCUVVVc05rVkJRVVlzUlVGQmFVWTRReXhSUVVGcVJpeERRVUV3Uml4WFFVRXhSanRCUVVORUxFbEJSa1FzVFVGRlR6dEJRVU5NT1VNc1RVRkJSU3cyUlVGQlJpeEZRVUZwUmpCRkxGZEJRV3BHTEVOQlFUWkdMRmRCUVRkR08wRkJRMFE3TzBGQlJVUXNUMEZCUnpGRkxFVkJRVVVzYTBKQlFVWXNSVUZCYzBJd1FpeE5RVUY2UWl4RlFVRnBRenRCUVVGRk8wRkJRMnhETEZGQlFVZDRReXhWUVVGVlJ5eFJRVUZXTEVOQlFXMUNSU3hYUVVGdVFpeExRVUZ0UXl4SlFVRjBReXhGUVVFMFF6dEJRVU16UTB3c1pVRkJWVWNzVVVGQlZpeERRVUZ0UWtVc1YwRkJia0lzUjBGQmFVTXNTVUZCYWtNN1FVRkRRVFpITEhGQ1FVRm5RaXhKUVVGb1FpeEZRVUZ6UWl4VlFVRjBRaXhGUVVGclF5eEpRVUZzUXp0QlFVTkJPMEZCUTBRc1NVRk1SQ3hOUVV0UE8wRkJRVVU3UVVGRFVpeFJRVUZIYkVnc1ZVRkJWVWNzVVVGQlZpeERRVUZ0UWtVc1YwRkJia0lzUzBGQmJVTXNTVUZCZEVNc1JVRkJORU03UVVGRE0wTTJSeXh4UWtGQlowSXNTMEZCYUVJc1JVRkJkVUlzVlVGQmRrSTdRVUZEUVd4SUxHVkJRVlZITEZGQlFWWXNRMEZCYlVKRkxGZEJRVzVDTEVkQlFXbERMRXRCUVdwRE8wRkJRMEU3UVVGRFJEczdRVUZGUkN4UFFVRkhVeXhGUVVGRkxHdENRVUZHTEVWQlFYTkNNRUlzVFVGQmVrSXNSVUZCYVVNN1FVRkJSVHRCUVVOc1F5eFJRVUZIZUVNc1ZVRkJWVTBzVVVGQlZpeERRVUZ0UWtRc1YwRkJia0lzUzBGQmJVTXNTVUZCZEVNc1JVRkJORU03UVVGRE0wTk1MR1ZCUVZWTkxGRkJRVllzUTBGQmJVSkVMRmRCUVc1Q0xFZEJRV2xETEVsQlFXcERPMEZCUTBFMlJ5eHhRa0ZCWjBJc1NVRkJhRUlzUlVGQmMwSXNWVUZCZEVJc1JVRkJhME1zU1VGQmJFTTdRVUZEUVR0QlFVTkVMRWxCVEVRc1RVRkxUenRCUVVGRk8wRkJRMUlzVVVGQlIyeElMRlZCUVZWTkxGRkJRVllzUTBGQmJVSkVMRmRCUVc1Q0xFdEJRVzFETEVsQlFYUkRMRVZCUVRSRE8wRkJRek5ETmtjc2NVSkJRV2RDTEV0QlFXaENMRVZCUVhWQ0xGVkJRWFpDTzBGQlEwRnNTQ3hsUVVGVlRTeFJRVUZXTEVOQlFXMUNSQ3hYUVVGdVFpeEhRVUZwUXl4TFFVRnFRenRCUVVOQk8wRkJRMFE3UVVGRFJDeEhRWFpFUkN4RlFYVkVSeXhIUVhaRVNEdEJRWGRFUVRzN1FVRkZSanM3UVVGRlExTXNSMEZCUlN4WFFVRkdMRVZCUVdVMlJTeExRVUZtTEVOQlFYRkNMRlZCUVVOaExFTkJRVVFzUlVGQlR6dEJRVU16UWl4TlFVRk5NRU1zVlVGQlZYcERMRk5CUVZNelJpeEZRVUZGTUVZc1JVRkJSVVVzVFVGQlNpeEZRVUZaUXl4SlFVRmFMRU5CUVdsQ0xGbEJRV3BDTEVOQlFWUXNRMEZCYUVJN1FVRkRRVGRHTEVsQlFVVXNhMEpCUVVZc1JVRkJjMEpyU0N4TlFVRjBRaXhEUVVFMlFtdENMRTlCUVRkQ08wRkJRMEZ3U1N4SlFVRkZMR1ZCUVVZc1JVRkJiVUk0UXl4UlFVRnVRaXhEUVVFMFFpeFJRVUUxUWpzN1FVRkZRU3hOUVVGSGRVWXNUMEZCVDBNc1UwRkJVQ3hEUVVGcFFrTXNVVUZCYWtJc1EwRkJNRUlzWjBKQlFURkNMRU5CUVVnc1JVRkJaMFE3UVVGRE5VTkRMRTlCUVVsR0xGTkJRVW9zUTBGQlkwY3NUVUZCWkN4RFFVRnhRaXhWUVVGeVFqdEJRVU5CU2l4VlFVRlBReXhUUVVGUUxFTkJRV2xDUnl4TlFVRnFRaXhEUVVGM1FpeG5Ra0ZCZUVJN1FVRkRRWGhKTEZsQlFWTjVTU3hKUVVGVUxFTkJRV05ETEV0QlFXUXNRMEZCYjBKRExGRkJRWEJDTEVkQlFTdENMRlZCUVM5Q08wRkJRMFE3UVVGRFNDeEZRVlpFT3p0QlFWbEVPenRCUVVWRE5Va3NSMEZCUlN4bFFVRkdMRVZCUVcxQ05rVXNTMEZCYmtJc1EwRkJlVUlzVlVGQlEyRXNRMEZCUkN4RlFVRlBPMEZCUXpkQ1FTeEpRVUZGYlVRc1pVRkJSanRCUVVOR0xFVkJSa1E3TzBGQlNVRXNTMEZCU1ZJc1UwRkJVM0JKTEZOQlFWTnJSU3hqUVVGVUxFTkJRWGRDTEdGQlFYaENMRU5CUVdJN1FVRkJRU3hMUVVORGNVVXNUVUZCVFhaSkxGTkJRVk5yUlN4alFVRlVMRU5CUVhkQ0xGTkJRWGhDTEVOQlJGQTdPMEZCUjBRN08wRkJSVVVzVlVGQlV6SkZMRlZCUVZRc1IwRkJjMEk3TzBGQlJYQkNMRTFCUVVkVUxFOUJRVTlETEZOQlFWQXNRMEZCYVVKRExGRkJRV3BDTEVOQlFUQkNMR2RDUVVFeFFpeERRVUZJTEVWQlFXZEVPMEZCUXpsRFF5eFBRVUZKUml4VFFVRktMRU5CUVdOSExFMUJRV1FzUTBGQmNVSXNWVUZCY2tJN1FVRkRRVW9zVlVGQlQwTXNVMEZCVUN4RFFVRnBRa2NzVFVGQmFrSXNRMEZCZDBJc1owSkJRWGhDTzBGQlEwRjZTU3hMUVVGRkxHVkJRVVlzUlVGQmJVSTRReXhSUVVGdVFpeERRVUUwUWl4UlFVRTFRanRCUVVORUxFZEJTa1FzVFVGTFN6dEJRVU5JZFVZc1ZVRkJUME1zVTBGQlVDeERRVUZwUWxNc1IwRkJha0lzUTBGQmNVSXNaMEpCUVhKQ08wRkJRMEZRTEU5QlFVbEdMRk5CUVVvc1EwRkJZMU1zUjBGQlpDeERRVUZyUWl4VlFVRnNRanRCUVVOQkwwa3NTMEZCUlN4bFFVRkdMRVZCUVcxQ01FVXNWMEZCYmtJc1EwRkJLMElzVVVGQkwwSTdRVUZEUkR0QlFVTkdPenRCUVVWSU96dEJRVVZGTEV0QlFVY3NRMEZCUXpGRkxFVkJRVVZ4Unl4UlFVRkdMRVZCUVZsU0xFbEJRVm9zUTBGQmFVSXNUVUZCYWtJc1JVRkJlVUoyUlN4UlFVRjZRaXhEUVVGclF5eFhRVUZzUXl4RFFVRktMRVZCUVc5RU8wRkJRMjVFSzBjc1UwRkJUeTlFTEdkQ1FVRlFMRU5CUVhkQ0xFOUJRWGhDTEVWQlFXbERkMFVzVlVGQmFrTTdRVUZEUVRzN1FVRkZTRHM3UVVGRlJUTkpMRkZCUVU5dFJTeG5Ra0ZCVUN4RFFVRjNRaXhSUVVGNFFpeEZRVUZyUXl4WlFVRlhPMEZCUXpORExFMUJRVWR1UlN4UFFVRlBReXhWUVVGUUxFZEJRVzlDTEVsQlFYQkNMRWxCUVRSQ2Iwa3NTVUZCU1VZc1UwRkJTaXhEUVVGalF5eFJRVUZrTEVOQlFYVkNMRlZCUVhaQ0xFTkJRUzlDTEVWQlFXMUZPMEZCUTJwRlR6dEJRVU5CVGl4UFFVRkpSaXhUUVVGS0xFTkJRV05ITEUxQlFXUXNRMEZCY1VJc1ZVRkJja0k3UVVGRFEzcEpMRXRCUVVVc1pVRkJSaXhGUVVGdFFqaERMRkZCUVc1Q0xFTkJRVFJDTEZGQlFUVkNPMEZCUTBZN1FVRkRSaXhGUVU1RU96dEJRVkZHT3p0QlFVVkZMRXRCUVVjNVF5eEZRVUZGY1Vjc1VVRkJSaXhGUVVGWlVpeEpRVUZhTEVOQlFXbENMRTFCUVdwQ0xFVkJRWGxDZGtVc1VVRkJla0lzUTBGQmEwTXNWMEZCYkVNc1EwRkJTQ3hGUVVGdFJEdEJRVU51UkN4TlFVRkhkRUlzUlVGQlJYRkhMRkZCUVVZc1JVRkJXVklzU1VGQldpeERRVUZwUWl4TlFVRnFRaXhGUVVGNVFuWkZMRkZCUVhwQ0xFTkJRV3RETEZsQlFXeERMRU5CUVVnc1JVRkJiMFE3UVVGRGJrUnJSQ3hqUVVGWExFTkJRVmc3UVVGRFFUdEJRVU5FTEUxQlFVZDRSU3hGUVVGRmNVY3NVVUZCUml4RlFVRlpVaXhKUVVGYUxFTkJRV2xDTEUxQlFXcENMRVZCUVhsQ2RrVXNVVUZCZWtJc1EwRkJhME1zYVVKQlFXeERMRU5CUVVnc1JVRkJlVVE3UVVGRGVFUnJSQ3hqUVVGWExFTkJRVmc3UVVGRFFUdEJRVU5FTEUxQlFVZDRSU3hGUVVGRmNVY3NVVUZCUml4RlFVRlpVaXhKUVVGYUxFTkJRV2xDTEUxQlFXcENMRVZCUVhsQ2RrVXNVVUZCZWtJc1EwRkJhME1zWTBGQmJFTXNRMEZCU0N4RlFVRnpSRHRCUVVOeVJHdEVMR05CUVZjc1EwRkJXRHRCUVVOQk8wRkJRMFFzVFVGQlIzaEZMRVZCUVVWeFJ5eFJRVUZHTEVWQlFWbFNMRWxCUVZvc1EwRkJhVUlzVFVGQmFrSXNSVUZCZVVKMlJTeFJRVUY2UWl4RFFVRnJReXhaUVVGc1F5eERRVUZJTEVWQlFXOUVPMEZCUTI1RWEwUXNZMEZCVnl4RFFVRllPMEZCUTBFN1FVRkRSQ3hOUVVGSGVFVXNSVUZCUlhGSExGRkJRVVlzUlVGQldWSXNTVUZCV2l4RFFVRnBRaXhOUVVGcVFpeEZRVUY1UW5aRkxGRkJRWHBDTEVOQlFXdERMRmxCUVd4RExFTkJRVWdzUlVGQmIwUTdRVUZEYmtST0xHVkJRVmtzV1VGQlRUdEJRVU5xUW5sSE8wRkJRMEVzU1VGR1JDeEZRVVZITEVkQlJrZzdRVUZIUVR0QlFVTkVPenRCUVVWR096dEJRVVZGTEZWQlFWTjFRaXhYUVVGVUxFTkJRWEZDUXl4RlFVRnlRaXhGUVVGNVFrTXNTVUZCZWtJc1JVRkJLMEk3UVVGRE9VSXNUVUZCU1VNc1dVRkJXU3hGUVVGb1FqdEJRVU5CUVN4WlFVRlZReXhGUVVGV0xFZEJRV1VzUTBGQlppeERRVUZyUWtRc1ZVRkJWVVVzUlVGQlZpeEhRVUZsTEVOQlFXWXNRMEZCYTBKR0xGVkJRVlZITEVWQlFWWXNSMEZCWlN4RFFVRm1MRU5CUVd0Q1NDeFZRVUZWU1N4RlFVRldMRWRCUVdVc1EwRkJaanRCUVVOMFJDeE5RVUZKUXl4UlFVRlJMRVZCUVZvc1EwRklPRUlzUTBGSFlqdEJRVU5xUWl4TlFVRkpReXhSUVVGUkxFVkJRVm9zUTBGS09FSXNRMEZKWWp0QlFVTnFRaXhOUVVGSlF5eFJRVUZSTEVWQlFWb3NRMEZNT0VJc1EwRkxZanRCUVVOcVFpeE5RVUZKUXl4UlFVRlJMRVZCUVZvc1EwRk9PRUlzUTBGTllqdEJRVU5xUWl4TlFVRkpReXhSUVVGUkxFVkJRVm83UVVGRFFTeE5RVUZKZUVVc1RVRkJUVzVHTEZOQlFWTnJSU3hqUVVGVUxFTkJRWGRDT0VVc1JVRkJlRUlzUTBGQlZqdEJRVU5CTjBRc1RVRkJTV1FzWjBKQlFVb3NRMEZCY1VJc1dVRkJja0lzUlVGQmEwTXNWVUZCVTI5Q0xFTkJRVlFzUlVGQlZ6dEJRVU16UXl4UFFVRkpiVVVzU1VGQlNXNUZMRVZCUVVWdlJTeFBRVUZHTEVOQlFWVXNRMEZCVml4RFFVRlNPMEZCUTBGWUxHRkJRVlZETEVWQlFWWXNSMEZCWlZNc1JVRkJSVVVzVDBGQmFrSTdRVUZEUVZvc1lVRkJWVVVzUlVGQlZpeEhRVUZsVVN4RlFVRkZSeXhQUVVGcVFqdEJRVU5FTEVkQlNrUXNSVUZKUlN4TFFVcEdPMEZCUzBFMVJTeE5RVUZKWkN4blFrRkJTaXhEUVVGeFFpeFhRVUZ5UWl4RlFVRnBReXhWUVVGVGIwSXNRMEZCVkN4RlFVRlhPMEZCUXpGRFFTeExRVUZGZFVVc1kwRkJSanRCUVVOQkxFOUJRVWxLTEVsQlFVbHVSU3hGUVVGRmIwVXNUMEZCUml4RFFVRlZMRU5CUVZZc1EwRkJVanRCUVVOQldDeGhRVUZWUnl4RlFVRldMRWRCUVdWUExFVkJRVVZGTEU5QlFXcENPMEZCUTBGYUxHRkJRVlZKTEVWQlFWWXNSMEZCWlUwc1JVRkJSVWNzVDBGQmFrSTdRVUZEUkN4SFFVeEVMRVZCUzBVc1MwRk1SanRCUVUxQk5VVXNUVUZCU1dRc1owSkJRVW9zUTBGQmNVSXNWVUZCY2tJc1JVRkJaME1zVlVGQlUyOUNMRU5CUVZRc1JVRkJWenRCUVVONlF6dEJRVU5CTEU5QlFVc3NRMEZCUlhsRUxGVkJRVlZITEVWQlFWWXNSMEZCWlVVc1MwRkJaaXhIUVVGMVFrd3NWVUZCVlVNc1JVRkJiRU1zU1VGQk1FTkVMRlZCUVZWSExFVkJRVllzUjBGQlpVVXNTMEZCWml4SFFVRjFRa3dzVlVGQlZVTXNSVUZCTlVVc1MwRkJjMFpFTEZWQlFWVkpMRVZCUVZZc1IwRkJaVW9zVlVGQlZVVXNSVUZCVml4SFFVRmxUU3hMUVVFdlFpeEpRVUV3UTFJc1ZVRkJWVVVzUlVGQlZpeEhRVUZsUml4VlFVRlZTU3hGUVVGV0xFZEJRV1ZKTEV0QlFYaEZMRWxCUVcxR1VpeFZRVUZWUnl4RlFVRldMRWRCUVdVc1EwRkJOVXdzUlVGQmEwMDdRVUZEYUUwc1VVRkJSMGdzVlVGQlZVY3NSVUZCVml4SFFVRmxTQ3hWUVVGVlF5eEZRVUUxUWl4RlFVRm5RMUVzVVVGQlVTeEhRVUZTTEVOQlFXaERMRXRCUTB0QkxGRkJRVkVzUjBGQlVqdEJRVU5PTzBGQlEwUTdRVUZLUVN4UlFVdExMRWxCUVVzc1EwRkJSVlFzVlVGQlZVa3NSVUZCVml4SFFVRmxSeXhMUVVGbUxFZEJRWFZDVUN4VlFVRlZSU3hGUVVGc1F5eEpRVUV3UTBZc1ZVRkJWVWtzUlVGQlZpeEhRVUZsUnl4TFFVRm1MRWRCUVhWQ1VDeFZRVUZWUlN4RlFVRTFSU3hMUVVGelJrWXNWVUZCVlVjc1JVRkJWaXhIUVVGbFNDeFZRVUZWUXl4RlFVRldMRWRCUVdWTExFdEJRUzlDTEVsQlFUQkRUaXhWUVVGVlF5eEZRVUZXTEVkQlFXVkVMRlZCUVZWSExFVkJRVllzUjBGQlpVY3NTMEZCZUVVc1NVRkJiVVpPTEZWQlFWVkpMRVZCUVZZc1IwRkJaU3hEUVVFMVRDeEZRVUZyVFR0QlFVTnlUU3hUUVVGSFNpeFZRVUZWU1N4RlFVRldMRWRCUVdWS0xGVkJRVlZGTEVWQlFUVkNMRVZCUVdkRFR5eFJRVUZSTEVkQlFWSXNRMEZCYUVNc1MwRkRTMEVzVVVGQlVTeEhRVUZTTzBGQlEwNDdPMEZCUlVRc1QwRkJTVUVzVTBGQlV5eEZRVUZpTEVWQlFXbENPMEZCUTJZc1VVRkJSeXhQUVVGUFZpeEpRVUZRTEVsQlFXVXNWVUZCYkVJc1JVRkJPRUpCTEV0QlFVdEVMRVZCUVV3c1JVRkJVVmNzUzBGQlVqdEJRVU12UWp0QlFVTkVMRTlCUVVsQkxGRkJRVkVzUlVGQldqdEJRVU5CVkN4aFFVRlZReXhGUVVGV0xFZEJRV1VzUTBGQlppeERRVUZyUWtRc1ZVRkJWVVVzUlVGQlZpeEhRVUZsTEVOQlFXWXNRMEZCYTBKR0xGVkJRVlZITEVWQlFWWXNSMEZCWlN4RFFVRm1MRU5CUVd0Q1NDeFZRVUZWU1N4RlFVRldMRWRCUVdVc1EwRkJaanRCUVVOMlJDeEhRV3BDUkN4RlFXbENSU3hMUVdwQ1JqdEJRV3RDUkRzN1FVRkZSanM3UVVGRlF5eExRVUZOTTBJc2EwSkJRV3RDTEZOQlFXeENRU3hsUVVGclFpeERRVUZEY1VJc1JVRkJSQ3hGUVVGTGFVSXNRMEZCVEN4RlFVRlhPenRCUVVWc1F5eE5RVUZIYWtJc1QwRkJUeXhWUVVGV0xFVkJRWE5DT3p0QlFVVnlRaXhQUVVGTmEwSXNNa0pCUVRKQ2Jrc3NSVUZCUlN3d1FrRkJSaXhGUVVFNFFqQkNMRTFCUVM5RU96dEJRVVZCTEU5QlFVZDNTU3hOUVVGTkxFZEJRVlFzUlVGQll6czdRVUZGWWl4UlFVRkhha3dzWTBGQlkydE1MREpDUVVFeVFpeERRVUUxUXl4RlFVRXJRenRCUVVNNVEyeE1PMEZCUTBFc1MwRkdSQ3hOUVVWUE8wRkJRMDVCTEcxQ1FVRmpMRU5CUVdRN1FVRkRRVHM3UVVGRlJHVXNUVUZCUlN3d1FrRkJSaXhGUVVFNFFtWXNWMEZCT1VJc1JVRkJNa00wUml4TFFVRXpRenRCUVVOQk8wRkJRMFFzVDBGQlIzRkdMRTFCUVUwc1IwRkJWQ3hGUVVGak96dEJRVVZpTEZGQlFVZHFUQ3hqUVVGakxFTkJRV3BDTEVWQlFXOUNPMEZCUTI1Q1FUdEJRVU5CTEV0QlJrUXNUVUZGVHp0QlFVTk9RU3h0UWtGQlkydE1MREpDUVVFeVFpeERRVUY2UXp0QlFVTkJPenRCUVVWRWJrc3NUVUZCUlN3d1FrRkJSaXhGUVVFNFFtWXNWMEZCT1VJc1JVRkJNa00wUml4TFFVRXpRenRCUVVOQk8wRkJRMFE3UVVGRFJDeE5RVUZIYjBVc1QwRkJUeXhWUVVGV0xFVkJRWE5DT3p0QlFVVnlRaXhQUVVGTmJVSXNNa0pCUVRKQ2NFc3NSVUZCUlN3d1FrRkJSaXhGUVVFNFFqQkNMRTFCUVM5RU96dEJRVVZCTEU5QlFVZDNTU3hOUVVGTkxFZEJRVlFzUlVGQll6czdRVUZGWWl4UlFVRkhiRXdzWTBGQlkyOU1MREpDUVVFeVFpeERRVUUxUXl4RlFVRXJRenRCUVVNNVEzQk1PMEZCUTBFc1MwRkdSQ3hOUVVWUE8wRkJRMDVCTEcxQ1FVRmpMRU5CUVdRN1FVRkRRVHM3UVVGRlJHZENMRTFCUVVVc01FSkJRVVlzUlVGQk9FSm9RaXhYUVVFNVFpeEZRVUV5UXpaR0xFdEJRVE5ETzBGQlEwRTdRVUZEUkN4UFFVRkhjVVlzVFVGQlRTeEhRVUZVTEVWQlFXTTdPMEZCUldJc1VVRkJSMnhNTEdOQlFXTXNRMEZCYWtJc1JVRkJiMEk3UVVGRGJrSkJPMEZCUTBFc1MwRkdSQ3hOUVVWUE8wRkJRMDVCTEcxQ1FVRmpiMHdzTWtKQlFUSkNMRU5CUVhwRE8wRkJRMEU3TzBGQlJVUndTeXhOUVVGRkxEQkNRVUZHTEVWQlFUaENhRUlzVjBGQk9VSXNSVUZCTWtNMlJpeExRVUV6UXp0QlFVTkJPMEZCUTBRN1FVRkRSQ3hGUVhCRVJEczdRVUZ6UkVRN08wRkJSVU1zUzBGQlJ5eERRVUZETjBVc1JVRkJSWEZITEZGQlFVWXNSVUZCV1ZJc1NVRkJXaXhEUVVGcFFpeE5RVUZxUWl4RlFVRjVRblpGTEZGQlFYcENMRU5CUVd0RExGZEJRV3hETEVOQlFVb3NSVUZCYjBRN1FVRkRia1F3U0N4alFVRlpMRlZCUVZvc1JVRkJkMEp3UWl4bFFVRjRRanRCUVVOQmIwSXNZMEZCV1N4VlFVRmFMRVZCUVhkQ2NFSXNaVUZCZUVJN1FVRkRRVHRCUVVORUxFTkJOVzFDUkNJc0ltWnBiR1VpT2lKbVlXdGxYMlUwWkRrNU1EYzFMbXB6SWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaVkyOXVjM1FnZEdsdFpTQTlJRGMxTUR0Y2JteGxkQ0J6WldOMGFXOXVNMGxrZUNBOUlEQTdYRzVzWlhRZ2MyVmpkR2x2YmpSSlpIZ2dQU0F3TzF4dVhHNWpiMjV6ZENCdFlYTjBaWEpQWW1vZ1BTQjdYRzVjZEhObFkzUnBiMjR5UTNWeWNtVnVkRWxrZURvZ01Dd2dYRzVjZEhObFkzUnBiMjR4UTNWeWNtVnVkRWxrZURvZ01DeGNibHgwYzJWamRHbHZiak02SUh0Y2JseDBYSFJoZFhSdmJXRjBaVG9nSnljc1hHNWNkRngwYVhOQmRYUnZiV0YwWldRNklHWmhiSE5sWEc1Y2RIMHNYRzVjZEhObFkzUnBiMjQwT2lCN1hHNWNkRngwWVhWMGIyMWhkR1U2SUNjbkxGeHVYSFJjZEdselFYVjBiMjFoZEdWa09pQm1ZV3h6WlZ4dVhIUjlMRnh1WEhSaVlYTnJaWFJpWVd4c09pQjdiRzl2Y0VGdGIzVnVkRG9nTVgwc1hHNWNkR1p2YjNSaVlXeHNPaUI3Ykc5dmNFRnRiM1Z1ZERvZ01YMHNYRzVjZEhSbGJtNXBjem9nZTJ4dmIzQkJiVzkxYm5RNklERjlMRnh1WEhSaVlYTmxZbUZzYkRvZ2UyeHZiM0JCYlc5MWJuUTZJREY5TEZ4dVhIUm1ZVzQ2SUh0c2IyOXdRVzF2ZFc1ME9pQXhmVnh1ZlR0Y2JseHVZMjl1YzNRZ2FHOXRaWEJoWjJWTmIySkpiV0ZuWlhNZ1BTQmJYRzVjZENkaGMzTmxkSE12YVcxaFoyVnpMMmh2YldWd1lXZGxUVzlpTDJKaGMydGxkR0poYkd3dWFuQm5KeXhjYmx4MEoyRnpjMlYwY3k5cGJXRm5aWE12YUc5dFpYQmhaMlZOYjJJdlptOXZkR0poYkd3dWFuQm5KeXhjYmx4MEoyRnpjMlYwY3k5cGJXRm5aWE12YUc5dFpYQmhaMlZOYjJJdmRHVnVibWx6TG1wd1p5Y3NJRnh1WEhRbllYTnpaWFJ6TDJsdFlXZGxjeTlvYjIxbGNHRm5aVTF2WWk5aVlYTmxZbUZzYkM1cWNHY25MQ0JjYmx4MEoyRnpjMlYwY3k5cGJXRm5aWE12YUc5dFpYQmhaMlZOYjJJdlptRnVMbXB3WnljZ1hHNWRYRzVjYmlRb1pHOWpkVzFsYm5RcExuSmxZV1I1S0NncElEMCtJSHRjYmx4MGFXWW9kMmx1Wkc5M0xtbHVibVZ5VjJsa2RHZ2dQQ0E0TURBcElIdGNiaTh2SUVsR0lGUklSU0JYU1U1RVQxY2dTVk1nVTAxQlRFeEZVaUJVU0VGVUlEZ3dNRkJZSUVaRlZFTklJRlJJUlNCS1UwOU9JRVpQVWlCVVNFVWdTVU5QVGlCQlRrbE5RVlJKVDA0Z1FVNUVJRUZVUVVOSUlGUklSU0JCVGtsTlFWUkpUMDVUSUZORlVFVlNRVlJGVEZrZ1ZFOGdiV0Z6ZEdWeVQySnFJRnhjWEZ4Y2JseDBYSFJtWlhSamFDZ25ZWE56WlhSekwycHpMMFpoYm5SaGMzUmxZMTlUY0hKcGRHVmZVMmhsWlhRdWFuTnZiaWNwTG5Sb1pXNG9ablZ1WTNScGIyNG9jbVZ6Y0c5dWMyVXBJSHNnWEc1Y2RGeDBYSFJ5WlhSMWNtNGdjbVZ6Y0c5dWMyVXVhbk52YmlncE8xeHVYSFJjZEgwcExuUm9aVzRvWm5WdVkzUnBiMjRvYzNCeWFYUmxUMkpxS1NCN1hHNWNkRngwWEhSamIyNXpkQ0JKWkd4bFJuSmhiV1VnUFNCbWFXeDBaWEpDZVZaaGJIVmxLSE53Y21sMFpVOWlhaTVtY21GdFpYTXNJQ2RwWkd4bEp5azdYRzVjZEZ4MFhIUnRZWE4wWlhKUFltb3VabTl2ZEdKaGJHd3VZVzVwYldGMGFXOXVRWEp5WVhrZ1BTQmJMaTR1U1dSc1pVWnlZVzFsTENBdUxpNW1hV3gwWlhKQ2VWWmhiSFZsS0hOd2NtbDBaVTlpYWk1bWNtRnRaWE1zSUNkbWIyOTBZbUZzYkNjcFhUdGNibHgwWEhSY2RHMWhjM1JsY2s5aWFpNTBaVzV1YVhNdVlXNXBiV0YwYVc5dVFYSnlZWGtnUFNCYkxpNHVTV1JzWlVaeVlXMWxMQ0F1TGk1bWFXeDBaWEpDZVZaaGJIVmxLSE53Y21sMFpVOWlhaTVtY21GdFpYTXNJQ2QwWlc1dWFYTW5LVjA3WEc1Y2RGeDBYSFJ0WVhOMFpYSlBZbW91WW1GelpXSmhiR3d1WVc1cGJXRjBhVzl1UVhKeVlYa2dQU0JiTGk0dVNXUnNaVVp5WVcxbExDQXVMaTVtYVd4MFpYSkNlVlpoYkhWbEtITndjbWwwWlU5aWFpNW1jbUZ0WlhNc0lDZGlZWE5sWW1Gc2JDY3BYVHRjYmx4MFhIUmNkRzFoYzNSbGNrOWlhaTVpWVhOclpYUmlZV3hzTG1GdWFXMWhkR2x2YmtGeWNtRjVJRDBnV3k0dUxrbGtiR1ZHY21GdFpTd2dMaTR1Wm1sc2RHVnlRbmxXWVd4MVpTaHpjSEpwZEdWUFltb3VabkpoYldWekxDQW5ZbUZ6YTJWMEp5bGRPMXh1WEhSY2RGeDBiV0Z6ZEdWeVQySnFMbVpoYmk1aGJtbHRZWFJwYjI1QmNuSmhlU0E5SUZzdUxpNUpaR3hsUm5KaGJXVXNJQzR1TG1acGJIUmxja0o1Vm1Gc2RXVW9jM0J5YVhSbFQySnFMbVp5WVcxbGN5d2dKMlpoYmljcFhUdGNiaTh2SUVOQlRFd2dRVTVKVFVGVVQxSWdVMFZVVlZBZ1JsVk9RMVJKVDA0Z1FVNUVJRk5VUVZKVUlGUklSU0JKVFVGSFJTQlRURWxFUlZOSVQxY2dSazlTSUZORlExUkpUMDRnTVNBb1NFOU5SVkJCUjBVcElGeGNYRnhjZEZ4MFhIUmNibHgwWEhSY2RHRnVhVzFoZEc5eVUyVjBkWEFvS1R0Y2JseDBYSFJjZEdsdFlXZGxRMjl1ZEhKdmJHVnlLRzFoYzNSbGNrOWlhaXdnTVNrN1hHNHZMeUJEUVV4TUlGUklSU0JwYldGblpVTnZiblJ5YjJ4bGNpQkdWVTVEVkVsUFRpQkZWa1ZTV1NBMUlGTkZRMDlPUkZNZ1ZFOGdRMGhCVGtkRklGUklSU0JKVFVGSFJTQkdUMUlnVTBWRFZFbFBUaUF4SUNoSVQwMUZVRUZIUlNrZ1hGeGNYRnh1WEhSY2RGeDBjMlYwU1c1MFpYSjJZV3dvS0NrZ1BUNGdlMXh1WEhSY2RGeDBYSFJwYldGblpVTnZiblJ5YjJ4bGNpaHRZWE4wWlhKUFltb3NJREVwTzF4dVhIUmNkRngwZlN3Z05UQXdNQ2s3WEc1Y2RGeDBmU2s3WEc1Y2RIMWNiaTh2SUVaVlRrTlVTVTlPSUZSUElGTkZVRVZTUVZSRklGUklSU0JCVGtsTlFWUkpUMDRnUmxKQlRVVlRJRUpaSUU1QlRVVWdYRnhjWEZ4dVhIUmpiMjV6ZENCbWFXeDBaWEpDZVZaaGJIVmxJRDBnS0dGeWNtRjVMQ0J6ZEhKcGJtY3BJRDArSUh0Y2JpQWdJQ0J5WlhSMWNtNGdZWEp5WVhrdVptbHNkR1Z5S0c4Z1BUNGdkSGx3Wlc5bUlHOWJKMlpwYkdWdVlXMWxKMTBnUFQwOUlDZHpkSEpwYm1jbklDWW1JRzliSjJacGJHVnVZVzFsSjEwdWRHOU1iM2RsY2tOaGMyVW9LUzVwYm1Oc2RXUmxjeWh6ZEhKcGJtY3VkRzlNYjNkbGNrTmhjMlVvS1NrcE8xeHVYSFI5WEc0dkx5QkhSVTVGVWtsRElGTkZWRlZRSUVaVlRrTlVTVTlPSUVaUFVpQkJSRVJKVGtjZ1ZrVk9SRTlTSUZCU1JVWkpXRVZUSUZSUElISmxjWFZsYzNSQmJtbHRZWFJwYjI1R2NtRnRaU0JjWEZ4Y1hHNWNkR052Ym5OMElHRnVhVzFoZEc5eVUyVjBkWEFnUFNBb0tTQTlQaUI3WEc1Y2RGeDBYSFJjYmlBZ0lDQjJZWElnYkdGemRGUnBiV1VnUFNBd08xeHVJQ0FnSUhaaGNpQjJaVzVrYjNKeklEMGdXeWR0Y3ljc0lDZHRiM29uTENBbmQyVmlhMmwwSnl3Z0oyOG5YVHRjYmlBZ0lDQm1iM0lvZG1GeUlIZ2dQU0F3T3lCNElEd2dkbVZ1Wkc5eWN5NXNaVzVuZEdnZ0ppWWdJWGRwYm1SdmR5NXlaWEYxWlhOMFFXNXBiV0YwYVc5dVJuSmhiV1U3SUNzcmVDa2dlMXh1SUNBZ0lDQWdkMmx1Wkc5M0xuSmxjWFZsYzNSQmJtbHRZWFJwYjI1R2NtRnRaU0E5SUhkcGJtUnZkMXQyWlc1a2IzSnpXM2hkS3lkU1pYRjFaWE4wUVc1cGJXRjBhVzl1Um5KaGJXVW5YVHRjYmlBZ0lDQWdJSGRwYm1SdmR5NWpZVzVqWld4QmJtbHRZWFJwYjI1R2NtRnRaU0E5SUhkcGJtUnZkMXQyWlc1a2IzSnpXM2hkS3lkRFlXNWpaV3hCYm1sdFlYUnBiMjVHY21GdFpTZGRJSHg4SUhkcGJtUnZkMXQyWlc1a2IzSnpXM2hkS3lkRFlXNWpaV3hTWlhGMVpYTjBRVzVwYldGMGFXOXVSbkpoYldVblhUdGNiaUFnSUNCOVhHNGdYRzRnSUNBZ2FXWWdLQ0YzYVc1a2IzY3VjbVZ4ZFdWemRFRnVhVzFoZEdsdmJrWnlZVzFsS1Z4dUlDQWdJQ0FnZDJsdVpHOTNMbkpsY1hWbGMzUkJibWx0WVhScGIyNUdjbUZ0WlNBOUlHWjFibU4wYVc5dUtHTmhiR3hpWVdOckxDQmxiR1Z0Wlc1MEtTQjdYRzRnSUNBZ0lDQWdJSFpoY2lCamRYSnlWR2x0WlNBOUlHNWxkeUJFWVhSbEtDa3VaMlYwVkdsdFpTZ3BPMXh1SUNBZ0lDQWdJQ0IyWVhJZ2RHbHRaVlJ2UTJGc2JDQTlJRTFoZEdndWJXRjRLREFzSURFMklDMGdLR04xY25KVWFXMWxJQzBnYkdGemRGUnBiV1VwS1R0Y2JpQWdJQ0FnSUNBZ2RtRnlJR2xrSUQwZ2QybHVaRzkzTG5ObGRGUnBiV1Z2ZFhRb1puVnVZM1JwYjI0b0tTQjdJR05oYkd4aVlXTnJLR04xY25KVWFXMWxJQ3NnZEdsdFpWUnZRMkZzYkNrN0lIMHNJRnh1SUNBZ0lDQWdJQ0FnSUhScGJXVlViME5oYkd3cE8xeHVJQ0FnSUNBZ0lDQnNZWE4wVkdsdFpTQTlJR04xY25KVWFXMWxJQ3NnZEdsdFpWUnZRMkZzYkR0Y2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUdsa08xeHVJQ0FnSUNBZ2ZUdGNiaUJjYmlBZ0lDQnBaaUFvSVhkcGJtUnZkeTVqWVc1alpXeEJibWx0WVhScGIyNUdjbUZ0WlNsY2JpQWdJQ0IzYVc1a2IzY3VZMkZ1WTJWc1FXNXBiV0YwYVc5dVJuSmhiV1VnUFNCbWRXNWpkR2x2YmlocFpDa2dlMXh1SUNBZ0lDQWdZMnhsWVhKVWFXMWxiM1YwS0dsa0tUdGNiaUFnSUNCOU8xeHVYSFI5WEc1Y2JseHVYSFJqYjI1emRDQmhibWx0WVhSdmNpQTlJQ2hoYm1sdFlYUnBiMjVQWW1vcElEMCtJSHRjYmx4MFhIUmNkRngwWEhSY2RGeHVYSFJjZEhaaGNpQmtZVzVqYVc1blNXTnZiaXhjYmx4MFhIUmNkSE53Y21sMFpVbHRZV2RsTEZ4dVhIUmNkRngwWTJGdWRtRnpPMXgwWEhSY2RGeDBYSFJjYmk4dklFWlZUa05VU1U5T0lGUlBJRkJCVTFNZ1ZFOGdjbVZ4ZFdWemRFRnVhVzFoZEdsdmJrWnlZVzFsSUZ4Y1hGeGNibHgwWEhSbWRXNWpkR2x2YmlCbllXMWxURzl2Y0NBb0tTQjdYRzVjZEZ4MElDQWtLQ2NqYkc5aFpHbHVaeWNwTG1Ga1pFTnNZWE56S0Nkb2FXUmtaVzRuS1R0Y2JseDBYSFFnSUdGdWFXMWhkR2x2Yms5aWFpNXNiMjl3U1dRZ1BTQjNhVzVrYjNjdWNtVnhkV1Z6ZEVGdWFXMWhkR2x2YmtaeVlXMWxLR2RoYldWTWIyOXdLVHRjYmx4MFhIUWdJR1JoYm1OcGJtZEpZMjl1TG5Wd1pHRjBaU2dwTzF4dVhIUmNkQ0FnWkdGdVkybHVaMGxqYjI0dWNtVnVaR1Z5S0NrN1hHNWNkRngwZlZ4dVhIUmNkRnh1WEhSY2RHWjFibU4wYVc5dUlITndjbWwwWlNBb2IzQjBhVzl1Y3lrZ2UxeHVYSFJjZEZ4dVhIUmNkRngwZG1GeUlIUm9ZWFFnUFNCN2ZTeGNibHgwWEhSY2RGeDBabkpoYldWSmJtUmxlQ0E5SURBc1hHNWNkRngwWEhSY2RIUnBZMnREYjNWdWRDQTlJREFzWEc1Y2RGeDBYSFJjZEd4dmIzQkRiM1Z1ZENBOUlEQXNYRzVjZEZ4MFhIUmNkSFJwWTJ0elVHVnlSbkpoYldVZ1BTQnZjSFJwYjI1ekxuUnBZMnR6VUdWeVJuSmhiV1VnZkh3Z01DeGNibHgwWEhSY2RGeDBiblZ0WW1WeVQyWkdjbUZ0WlhNZ1BTQnZjSFJwYjI1ekxtNTFiV0psY2s5bVJuSmhiV1Z6SUh4OElERTdYRzVjZEZ4MFhIUmNibHgwWEhSY2RIUm9ZWFF1WTI5dWRHVjRkQ0E5SUc5d2RHbHZibk11WTI5dWRHVjRkRHRjYmx4MFhIUmNkSFJvWVhRdWQybGtkR2dnUFNCdmNIUnBiMjV6TG5kcFpIUm9PMXh1WEhSY2RGeDBkR2hoZEM1b1pXbG5hSFFnUFNCdmNIUnBiMjV6TG1obGFXZG9kRHRjYmx4MFhIUmNkSFJvWVhRdWFXMWhaMlVnUFNCdmNIUnBiMjV6TG1sdFlXZGxPMXh1WEhSY2RGeDBkR2hoZEM1c2IyOXdjeUE5SUc5d2RHbHZibk11Ykc5dmNITTdYRzVjZEZ4MFhIUmNibHgwWEhSY2RIUm9ZWFF1ZFhCa1lYUmxJRDBnWm5WdVkzUnBiMjRnS0NrZ2UxeHVYRzRnSUNBZ0lDQWdJSFJwWTJ0RGIzVnVkQ0FyUFNBeE8xeHVYRzRnSUNBZ0lDQWdJR2xtSUNoMGFXTnJRMjkxYm5RZ1BpQjBhV05yYzFCbGNrWnlZVzFsS1NCN1hHNWNibHgwWEhSY2RGeDBYSFIwYVdOclEyOTFiblFnUFNBd08xeHVJQ0FnSUNBZ0lDQWdJQzh2SUVsbUlIUm9aU0JqZFhKeVpXNTBJR1p5WVcxbElHbHVaR1Y0SUdseklHbHVJSEpoYm1kbFhHNGdJQ0FnSUNBZ0lDQWdhV1lnS0daeVlXMWxTVzVrWlhnZ1BDQnVkVzFpWlhKUFprWnlZVzFsY3lBdElERXBJSHRjZEZ4dUlDQWdJQ0FnSUNBZ0lDOHZJRWR2SUhSdklIUm9aU0J1WlhoMElHWnlZVzFsWEc0Z0lDQWdJQ0FnSUNBZ0lDQm1jbUZ0WlVsdVpHVjRJQ3M5SURFN1hHNGdJQ0FnSUNBZ0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lDQWdYSFJjZEd4dmIzQkRiM1Z1ZENzclhHNGdJQ0FnSUNBZ0lDQWdJQ0JtY21GdFpVbHVaR1Y0SUQwZ01EdGNibHh1SUNBZ0lDQWdJQ0FnSUNBZ2FXWW9iRzl2Y0VOdmRXNTBJRDA5UFNCMGFHRjBMbXh2YjNCektTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCY2RIZHBibVJ2ZHk1allXNWpaV3hCYm1sdFlYUnBiMjVHY21GdFpTaGhibWx0WVhScGIyNVBZbW91Ykc5dmNFbGtLVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIMWNiaUFnSUNBZ0lDQWdJQ0I5WEc1Y2RDQWdJQ0FnSUgxY2JseDBJQ0FnSUgxY2JseDBYSFJjZEZ4dVhIUmNkRngwZEdoaGRDNXlaVzVrWlhJZ1BTQm1kVzVqZEdsdmJpQW9LU0I3WEc1Y2RGeDBYSFJjYmx4MFhIUmNkQ0FnTHk4Z1EyeGxZWElnZEdobElHTmhiblpoYzF4dVhIUmNkRngwSUNCMGFHRjBMbU52Ym5SbGVIUXVZMnhsWVhKU1pXTjBLREFzSURBc0lIUm9ZWFF1ZDJsa2RHZ3NJSFJvWVhRdWFHVnBaMmgwS1R0Y2JseDBYSFJjZENBZ1hHNWNkRngwWEhRZ0lIUm9ZWFF1WTI5dWRHVjRkQzVrY21GM1NXMWhaMlVvWEc1Y2RGeDBYSFFnSUNBZ2RHaGhkQzVwYldGblpTeGNibHgwWEhSY2RDQWdJQ0JoYm1sdFlYUnBiMjVQWW1vdVlXNXBiV0YwYVc5dVFYSnlZWGxiWm5KaGJXVkpibVJsZUYwdVpuSmhiV1V1ZUN4Y2JseDBYSFJjZENBZ0lDQmhibWx0WVhScGIyNVBZbW91WVc1cGJXRjBhVzl1UVhKeVlYbGJabkpoYldWSmJtUmxlRjB1Wm5KaGJXVXVlU3hjYmx4MFhIUmNkQ0FnSUNBeU1EQXNYRzVjZEZ4MFhIUWdJQ0FnTVRjMUxGeHVYSFJjZEZ4MElDQWdJREFzWEc1Y2RGeDBYSFFnSUNBZ01DeGNibHgwWEhSY2RDQWdJQ0IzYVc1a2IzY3VhVzV1WlhKWGFXUjBhQ0F2SURNdU9EUTJMRnh1WEhSY2RGeDBJQ0FnSUhkcGJtUnZkeTVwYm01bGNsZHBaSFJvSUM4Z05DNHhLVnh1WEhSY2RGeDBmVHRjYmx4MFhIUmNkRnh1WEhSY2RGeDBjbVYwZFhKdUlIUm9ZWFE3WEc1Y2RGeDBmVnh1WEhSY2RGeHVYSFJjZEM4dklFZGxkQ0JqWVc1MllYTmNibHgwWEhSallXNTJZWE1nUFNCa2IyTjFiV1Z1ZEM1blpYUkZiR1Z0Wlc1MFFubEpaQ2duWTJGdWRtRnpKeWs3WEc1Y2RGeDBZMkZ1ZG1GekxuZHBaSFJvSUQwZ2QybHVaRzkzTG1sdWJtVnlWMmxrZEdnZ0x5QXpMamcwTmp0Y2JseDBYSFJqWVc1MllYTXVhR1ZwWjJoMElEMGdkMmx1Wkc5M0xtbHVibVZ5VjJsa2RHZ2dMeUF5TGpJN1hHNWNkRngwWEc1Y2RGeDBMeThnUTNKbFlYUmxJSE53Y21sMFpTQnphR1ZsZEZ4dVhIUmNkSE53Y21sMFpVbHRZV2RsSUQwZ2JtVjNJRWx0WVdkbEtDazdYSFJjYmx4MFhIUmNibHgwWEhRdkx5QkRjbVZoZEdVZ2MzQnlhWFJsWEc1Y2RGeDBaR0Z1WTJsdVowbGpiMjRnUFNCemNISnBkR1VvZTF4dVhIUmNkRngwWTI5dWRHVjRkRG9nWTJGdWRtRnpMbWRsZEVOdmJuUmxlSFFvWENJeVpGd2lLU3hjYmx4MFhIUmNkSGRwWkhSb09pQTBNRFF3TEZ4dVhIUmNkRngwYUdWcFoyaDBPaUF4Tnpjd0xGeHVYSFJjZEZ4MGFXMWhaMlU2SUhOd2NtbDBaVWx0WVdkbExGeHVYSFJjZEZ4MGJuVnRZbVZ5VDJaR2NtRnRaWE02SUdGdWFXMWhkR2x2Yms5aWFpNWhibWx0WVhScGIyNUJjbkpoZVM1c1pXNW5kR2dzWEc1Y2RGeDBYSFIwYVdOcmMxQmxja1p5WVcxbE9pQTBMRnh1WEhSY2RGeDBiRzl2Y0hNNklHRnVhVzFoZEdsdmJrOWlhaTVzYjI5d1FXMXZkVzUwWEc1Y2RGeDBmU2s3WEc1Y2RGeDBYRzVjZEZ4MEx5OGdURzloWkNCemNISnBkR1VnYzJobFpYUmNibHgwWEhSemNISnBkR1ZKYldGblpTNWhaR1JGZG1WdWRFeHBjM1JsYm1WeUtGd2liRzloWkZ3aUxDQm5ZVzFsVEc5dmNDazdYRzVjZEZ4MGMzQnlhWFJsU1cxaFoyVXVjM0pqSUQwZ0oyRnpjMlYwY3k5cGJXRm5aWE12Um1GdWRHRnpkR1ZqWDFOd2NtbDBaVjlUYUdWbGRDNXdibWNuTzF4dVhIUjlJRnh1WEc0dkx5QkpUa2xVU1VGTVNWTkZJRUZPUkNCVFJWUlZVQ0JEVlZKU1JVNVVJRkJCUjBVdUlFVllSVU5WVkVVZ1ZGSkJUbE5KVkVsUFRsTWdRVTVFSUZKRlRVOVdSU0JVU1U1VUlFbEdJRkpGVEVWV1FVNVVJRnhjWEZ4Y2JseHVYSFJqYjI1emRGeDBjR0ZuWlV4dllXUmxjaUE5SUNocGJtUmxlQ2tnUFQ0Z2UxeHVYSFJjZEdsbUtHbHVaR1Y0SUQwOVBTQTFLU0I3WEc1Y2RGeDBYSFFrS0NjdWRHbHVkQ2NwTG5KbGJXOTJaVU5zWVhOektDZHlaVzF2ZG1WVWFXNTBKeWs3WEc1Y2RGeDBYSFFrS0NjdVltRmphMmR5YjNWdVpGZHlZWEJ3WlhJbktTNXlaVzF2ZG1WRGJHRnpjeWduYzJOaGJHVkNZV05yWjNKdmRXNWtKeWs3WEc1Y2RGeDBYSFFrS0NjamMyVmpkR2x2YmpVbktTNW1hVzVrS0NjdWFHVmhaR2x1WnljcExtRmtaRU5zWVhOektDZHphRzkzSUdaaFpHVkpiaWNwTzF4dVhIUmNkRngwSkNnbkxuTjFZbE5sWTNScGIyNG5LUzVoWkdSRGJHRnpjeWduYzJOaGJHVkNZV05yWjNKdmRXNWtKeWs3WEc1Y2RGeDBYSFFrS0NjdWMzVmlVMlZqZEdsdmJpY3BMbVpwYm1Rb0p5NTBhVzUwSnlrdVlXUmtRMnhoYzNNb0ozSmxiVzkyWlZScGJuUW5LVHRjYmx4MFhIUmNkQ1FvSnlOelpXTjBhVzl1TlNjcExtWnBibVFvSnk1MFpYaDBWM0poY0hCbGNpY3BMbUZrWkVOc1lYTnpLQ2R6YUc5M0p5azdYRzVjZEZ4MFhIUnpaWFJVYVcxbGIzVjBLQ2dwSUQwK0lIdGNibHgwWEhSY2RGeDBKQ2duTG5OMVlsTmxZM1JwYjI0Z1BpQXVkR1Y0ZEZkeVlYQndaWEluS1M1bWFXNWtLQ2N1YUdWaFpHbHVaeWNwTG1Ga1pFTnNZWE56S0NkbVlXUmxTVzRuS1R0Y2JseDBYSFJjZEgwc0lERXdNREFwTzF4dVhIUmNkSDBnWEc1Y2RGeDBaV3h6WlNCN1hHNWNkRngwWEhRa0tDY3VkR2x1ZENjcExuSmxiVzkyWlVOc1lYTnpLQ2R5WlcxdmRtVlVhVzUwSnlrN1hHNWNkRngwWEhRa0tDY3VjM1ZpVTJWamRHbHZiaWNwTG5KbGJXOTJaVU5zWVhOektDZHpZMkZzWlVKaFkydG5jbTkxYm1RbktUdGNibHgwWEhSY2RDUW9ZQzVpWVdOclozSnZkVzVrVjNKaGNIQmxjanB1YjNRb0kzTmxZM1JwYjI0a2UybHVaR1Y0ZlVKaFkydG5jbTkxYm1RcFlDa3VjbVZ0YjNabFEyeGhjM01vSjNOallXeGxRbUZqYTJkeWIzVnVaQ2NwTzF4dVhIUmNkRngwSkNoZ0xuTmxZM1JwYjI0dVlXTjBhWFpsWUNrdVptbHVaQ2hnTG1KaFkydG5jbTkxYm1SWGNtRndjR1Z5WUNrdVlXUmtRMnhoYzNNb0ozTmpZV3hsUW1GamEyZHliM1Z1WkNjcE8xeHVYSFJjZEZ4MEpDaGdjMlZqZEdsdmJpNWhZM1JwZG1WZ0tTNW1hVzVrS0NjdWRHbHVkQ2NwTG1Ga1pFTnNZWE56S0NkeVpXMXZkbVZVYVc1MEp5azdYRzVjYmx4MFhIUmNkR2xtS0NRb1lDNXpaV04wYVc5dUpIdHBibVJsZUgxUVlXZHBibUYwYjNKQ2RYUjBiMjVnS1M1c1pXNW5kR2dnSmlZZ0pDaGdMbk5sWTNScGIyNGtlMmx1WkdWNGZWQmhaMmx1WVhSdmNrSjFkSFJ2Ymk1aFkzUnBkbVZnS1M1c1pXNW5kR2dnUENBeEtTQjdYRzVjZEZ4MFhIUmNkQ1FvWUM1elpXTjBhVzl1Skh0cGJtUmxlSDFRWVdkcGJtRjBiM0pDZFhSMGIyNWdLUzVuWlhRb01Da3VZMnhwWTJzb0tUdGNibHgwWEhSY2RIMWNibHgwWEhSOVhHNWNkSDA3WEc1Y2JpOHZJRWhKUkVVZ1FVeE1JRUpGUTB0SFVrOVZUa1JUSUVsT0lGUklSU0JUUlVOVVNVOU9JRVZZUTBWUVZDQlVTRVVnVTFCRlEwbEdTVVZFSUVsT1JFVllMQ0JYU0VsRFNDQkpVeUJUUTBGTVJVUWdRVTVFSUZOSVQxZE9MaUJjWEZ4Y1hHNWNibHgwWTI5dWMzUWdhVzVwZEdsaGJHbDZaVk5sWTNScGIyNGdQU0FvYzJWamRHbHZiazUxYldKbGNpd2dhV1I0S1NBOVBpQjdYRzVjZEZ4MEpDaGdJM05sWTNScGIyNGtlM05sWTNScGIyNU9kVzFpWlhKOVFtRmphMmR5YjNWdVpDUjdhV1I0ZldBcExuTnBZbXhwYm1kektDY3VZbUZqYTJkeWIzVnVaRmR5WVhCd1pYSW5LUzV0WVhBb0tHbDRMQ0JsYkdVcElEMCtJSHRjYmx4MFhIUmNkQ1FvWld4bEtTNWpjM01vZTI5d1lXTnBkSGs2SURCOUtUdGNibHgwWEhSOUtUdGNibHh1WEhSY2RDUW9ZQ056WldOMGFXOXVKSHR6WldOMGFXOXVUblZ0WW1WeWZVSmhZMnRuY205MWJtUWtlMmxrZUgxZ0tTNWpjM01vZTF4dVhIUmNkRngwSjNSeVlXNXpabTl5YlNjNklDZHpZMkZzWlNneExqRXBKeXhjYmx4MFhIUmNkQ2R2Y0dGamFYUjVKem9nTVZ4dVhIUmNkSDBwTzF4dVhIUjlPMXh1WEc0dkx5QkRRVXhNSUdsdWFYUnBZV3hwZW1WVFpXTjBhVzl1SUU5T0lGTkZRMVJKVDA1VElERXNJRE1nUVU1RUlEUXVJRnhjWEZ4Y2JseDBhVzVwZEdsaGJHbDZaVk5sWTNScGIyNG9NU3dnTUNrN1hHNWNkR2x1YVhScFlXeHBlbVZUWldOMGFXOXVLRE1zSURBcE8xeHVYSFJwYm1sMGFXRnNhWHBsVTJWamRHbHZiaWcwTENBd0tUdGNibHh1THk4Z1FrRkRTMGRTVDFWT1JDQkpUVUZIUlNCVVVrRk9VMGxVU1U5T0lFaEJUa1JNUlZJdUlGeGNYRnhjYmx4dVhIUmpiMjV6ZENCcGJXRm5aVU52Ym5SeWIyeGxjaUE5SUNocFpIaFBZbW9zSUhObFkzUnBiMjVPZFcxaVpYSXBJRDArSUh0Y2JseDBYSFJzWlhRZ2NtVnNaWFpoYm5SQmJtbHRZWFJwYjI0N1hHNWNibHgwWEhScFppaHpaV04wYVc5dVRuVnRZbVZ5SUQwOVBTQXhLU0I3WEc1Y2RGeDBYSFJ6ZDJsMFkyZ29hV1I0VDJKcUxuTmxZM1JwYjI0eFEzVnljbVZ1ZEVsa2VDa2dlMXh1WEhSY2RGeDBYSFJqWVhObElEQTZYRzVjZEZ4MFhIUmNkRngwY21Wc1pYWmhiblJCYm1sdFlYUnBiMjRnUFNCdFlYTjBaWEpQWW1vdVltRnphMlYwWW1Gc2JEdGNibHgwWEhSY2RGeDBZbkpsWVdzN1hHNWNkRngwWEhSY2RHTmhjMlVnTVRwY2JseDBYSFJjZEZ4MFhIUnlaV3hsZG1GdWRFRnVhVzFoZEdsdmJpQTlJRzFoYzNSbGNrOWlhaTVtYjI5MFltRnNiRHRjYmx4MFhIUmNkRngwWW5KbFlXczdYRzVjZEZ4MFhIUmNkR05oYzJVZ01qcGNibHgwWEhSY2RGeDBYSFJ5Wld4bGRtRnVkRUZ1YVcxaGRHbHZiaUE5SUcxaGMzUmxjazlpYWk1MFpXNXVhWE03WEc1Y2RGeDBYSFJjZEdKeVpXRnJPMXh1WEhSY2RGeDBYSFJqWVhObElETTZYRzVjZEZ4MFhIUmNkRngwY21Wc1pYWmhiblJCYm1sdFlYUnBiMjRnUFNCdFlYTjBaWEpQWW1vdVltRnpaV0poYkd3N1hHNWNkRngwWEhSY2RHSnlaV0ZyTzF4dVhIUmNkRngwWEhSallYTmxJRFE2WEc1Y2RGeDBYSFJjZEZ4MGNtVnNaWFpoYm5SQmJtbHRZWFJwYjI0Z1BTQnRZWE4wWlhKUFltb3VabUZ1TzF4dVhIUmNkRngwWEhSaWNtVmhhenRjYmx4MFhIUmNkSDFjYmx4MFhIUjlYRzVjYmx4MFhIUWtLR0FqYzJWamRHbHZiaVI3YzJWamRHbHZiazUxYldKbGNuMWdLUzVtYVc1a0tDY3VkR2x1ZENjcExuSmxiVzkyWlVOc1lYTnpLQ2R5WlcxdmRtVlVhVzUwSnlrN1hHNWNkRngwSkNoZ0kzTmxZM1JwYjI0a2UzTmxZM1JwYjI1T2RXMWlaWEo5UW1GamEyZHliM1Z1WkNSN2FXUjRUMkpxVzJCelpXTjBhVzl1Skh0elpXTjBhVzl1VG5WdFltVnlmVU4xY25KbGJuUkpaSGhnWFgxZ0tTNXlaVzF2ZG1WRGJHRnpjeWduYzJOaGJHVkNZV05yWjNKdmRXNWtKeWs3WEc1Y2RGeDBhVzVwZEdsaGJHbDZaVk5sWTNScGIyNG9jMlZqZEdsdmJrNTFiV0psY2l3Z2FXUjRUMkpxVzJCelpXTjBhVzl1Skh0elpXTjBhVzl1VG5WdFltVnlmVU4xY25KbGJuUkpaSGhnWFNrN1hHNWNkRngwWEc1Y2RGeDBjMlYwVkdsdFpXOTFkQ2dvS1NBOVBpQjdYRzVjZEZ4MFhIUnBaaWh6WldOMGFXOXVUblZ0WW1WeUlEMDlQU0F4S1NCN1hHNWNkRngwWEhSY2RHRnVhVzFoZEc5eUtISmxiR1YyWVc1MFFXNXBiV0YwYVc5dUtUdGNibHgwWEhSY2RIMWNibHh1WEhSY2RGeDBKQ2hnSTNObFkzUnBiMjRrZTNObFkzUnBiMjVPZFcxaVpYSjlZQ2t1Wm1sdVpDaGdMbUpoWTJ0bmNtOTFibVJYY21Gd2NHVnlZQ2t1WVdSa1EyeGhjM01vSjNOallXeGxRbUZqYTJkeWIzVnVaQ2NwTzF4dVhIUmNkRngwSkNoZ0kzTmxZM1JwYjI0a2UzTmxZM1JwYjI1T2RXMWlaWEo5WUNrdVptbHVaQ2duTG5ScGJuUW5LUzVoWkdSRGJHRnpjeWduY21WdGIzWmxWR2x1ZENjcE8xeHVYSFJjZEgwc0lEVXdNQ2s3WEc1Y2JseDBYSFJwWmlocFpIaFBZbXBiWUhObFkzUnBiMjRrZTNObFkzUnBiMjVPZFcxaVpYSjlRM1Z5Y21WdWRFbGtlR0JkSUQwOVBTQWtLR0FqYzJWamRHbHZiaVI3YzJWamRHbHZiazUxYldKbGNuMWdLUzVtYVc1a0tHQXVZbUZqYTJkeWIzVnVaRmR5WVhCd1pYSmdLUzVzWlc1bmRHZ2dMU0F4S1NCN1hHNWNkRngwWEhScFpIaFBZbXBiWUhObFkzUnBiMjRrZTNObFkzUnBiMjVPZFcxaVpYSjlRM1Z5Y21WdWRFbGtlR0JkSUQwZ01EdGNibHgwWEhSOUlHVnNjMlVnZTF4dVhIUmNkRngwYVdSNFQySnFXMkJ6WldOMGFXOXVKSHR6WldOMGFXOXVUblZ0WW1WeWZVTjFjbkpsYm5SSlpIaGdYU0FyUFNBeE8xeHVYSFJjZEgxY2JseDBmVnh1THk4Z1UxUkJVbFFnVTB4SlJFVlRTRTlYSUU5T0lGTkZRMVJKVDA0Z01pQmNYRnhjWEc1Y2RHbHRZV2RsUTI5dWRISnZiR1Z5S0cxaGMzUmxjazlpYWl3Z01pazdYRzVjYmk4dklFTklRVTVIUlNCVFJVTlVTVTlPSURJZ1FrRkRTMGRTVDFWT1JDQkpUVUZIUlNCRlZrVlNXU0F4TlNCVFJVTlBUa1JUSUZ4Y1hGeGNibHgwYzJWMFNXNTBaWEoyWVd3b0tDa2dQVDRnZTF4dVhIUmNkR2x0WVdkbFEyOXVkSEp2YkdWeUtHMWhjM1JsY2s5aWFpd2dNaWs3WEc1Y2RIMHNJREUxTURBd0tUdGNibHh1THk4Z1VFRkhTVTVCVkVsUFRpQkNWVlJVVDA1VElFTk1TVU5MSUVoQlRrUk1SVklnUms5U0lGTkZRMVJKVDA1VElETWdRVTVFSURRdUlGeGNYRnhjYmx4dVhIUmpiMjV6ZENCb1lXNWtiR1ZRWVc1cGJtRjBhVzl1UW5WMGRHOXVRMnhwWTJzZ1BTQW9aU2tnUFQ0Z2UxeHVYRzVjZEZ4MFkyOXVjM1FnYVdSNElEMGdjR0Z5YzJWSmJuUW9KQ2hsTG5SaGNtZGxkQ2t1WVhSMGNpZ25aR0YwWVMxcGJtUmxlQ2NwS1R0Y2JseDBYSFJqYjI1emRDQnpaV04wYVc5dVNXUWdQU0FrS0dVdWRHRnlaMlYwS1M1amJHOXpaWE4wS0NkelpXTjBhVzl1SnlrdVlYUjBjaWduYVdRbktUdGNibHgwWEhSc1pYUWdjbVZzWlhaaGJuUkVZWFJoUVhKeVlYazdYRzVjYmx4MFhIUnBaaWh6WldOMGFXOXVTV1FnUFQwOUlDZHpaV04wYVc5dU15Y3BJSHRjYmx4MFhIUmNkSE5sWTNScGIyNHpTV1I0SUQwZ2FXUjRPMXh1WEhSY2RIMWNibHh1WEhSY2RHbG1LSE5sWTNScGIyNUpaQ0E5UFQwZ0ozTmxZM1JwYjI0MEp5a2dlMXh1WEhSY2RGeDBjMlZqZEdsdmJqUkpaSGdnUFNCcFpIZzdYRzVjZEZ4MGZWeHVYRzVjZEZ4MEpDaGdJeVI3YzJWamRHbHZia2xrZldBcExtWnBibVFvSnk1MGFXNTBKeWt1Y21WdGIzWmxRMnhoYzNNb0ozSmxiVzkyWlZScGJuUW5LVHRjYmx4MFhIUWtLR0FqSkh0elpXTjBhVzl1U1dSOVlDa3VabWx1WkNnbkxuUmxlSFJYY21Gd2NHVnlKeWt1Y21WdGIzWmxRMnhoYzNNb0ozTm9iM2NuS1R0Y2JseDBYSFFrS0dBakpIdHpaV04wYVc5dVNXUjlZQ2t1Wm1sdVpDaGdJM1JsZUhSWGNtRndjR1Z5Skh0cFpIaDlZQ2t1WVdSa1EyeGhjM01vSjNOb2IzY25LVHRjYmx4MFhIUWtLR0FqSkh0elpXTjBhVzl1U1dSOVFtRmphMmR5YjNWdVpDUjdhV1I0ZldBcExuSmxiVzkyWlVOc1lYTnpLQ2R6WTJGc1pVSmhZMnRuY205MWJtUW5LVHRjYmx4MFhIUWtLR0F1Skh0elpXTjBhVzl1U1dSOVVHRm5hVzVoZEc5eVFuVjBkRzl1WUNrdWNtVnRiM1psUTJ4aGMzTW9KMkZqZEdsMlpTY3BPMXh1WEhSY2RDUW9aUzUwWVhKblpYUXBMbUZrWkVOc1lYTnpLQ2RoWTNScGRtVW5LVHRjYmx4dVhIUmNkR2x1YVhScFlXeHBlbVZUWldOMGFXOXVLSEJoY25ObFNXNTBLQ1FvWUNNa2UzTmxZM1JwYjI1SlpIMWdLUzVoZEhSeUtDZGtZWFJoTFdsdVpHVjRKeWtwTENCcFpIZ3BPMXh1WEc1Y2RGeDBjMlYwVkdsdFpXOTFkQ2dvS1NBOVBpQjdYRzVjZEZ4MFhIUndZV2RsVEc5aFpHVnlLSEJoY25ObFNXNTBLQ1FvWUNNa2UzTmxZM1JwYjI1SlpIMWdLUzVoZEhSeUtDZGtZWFJoTFdsdVpHVjRKeWtwS1R0Y2JseDBYSFI5TENBMU1EQXBPMXh1WEc1Y2RGeDBhV1lvYzJWamRHbHZia2xrSUNFOVBTQW5jMlZqZEdsdmJqSW5LWHRjYmx4MFhIUmNkQ1FvWUNNa2UzTmxZM1JwYjI1SlpIMWdLUzVtYVc1a0tDY3VhR1ZoWkdsdVp5d2djQ2NwTG1Ga1pFTnNZWE56S0NkbVlXUmxTVzRuS1R0Y2JseDBYSFJjZENRb1lDTWtlM05sWTNScGIyNUpaSDFnS1M1dmJpZ25kSEpoYm5OcGRHbHZibVZ1WkNCM1pXSnJhWFJVY21GdWMybDBhVzl1Ulc1a0lHOVVjbUZ1YzJsMGFXOXVSVzVrSnl3Z0tHVnpLU0E5UGlCN1hHNWNkQ0FnSUNCY2RDUW9ZQ01rZTNObFkzUnBiMjVKWkgxZ0tTNW1hVzVrS0NjdWFHVmhaR2x1Wnl3Z2NDY3BMbkpsYlc5MlpVTnNZWE56S0NkbVlXUmxTVzRuS1R0Y2JseDBYSFJjZEgwcE8xeHVYSFJjZEgxY2JseDBmVHRjYmx4dUx5OGdRMHhKUTBzZ1RFbFRWRVZPUlZJZ1JrOVNJRkJCUjBsT1FWUkpUMDRnUWxWVVZFOU9VeUJQVGlCVFJVTlVTVTlPVXlBeklFRk9SQ0EwTGlCY1hGeGNYRzVjYmx4MEpDZ25Mbk5sWTNScGIyNHpVR0ZuYVc1aGRHOXlRblYwZEc5dUxDQXVjMlZqZEdsdmJqUlFZV2RwYm1GMGIzSkNkWFIwYjI0bktTNWpiR2xqYXlnb1pTa2dQVDRnZTF4dVhIUmNkRnh1WEhSY2RHbG1LRzFoYzNSbGNrOWlhbHNrS0dVdVkzVnljbVZ1ZEZSaGNtZGxkQ2t1WTJ4dmMyVnpkQ2duYzJWamRHbHZiaWNwTG1GMGRISW9KMmxrSnlsZExtbHpRWFYwYjIxaGRHVmtLU0I3WEc0dkx5QkpSaUJVU0VWU1JTQkpVeUJCSUZKSlRrNUpUa2NnU1U1VVJWSldRVXdnVDA0Z1ZFaEZJRkpGVEVWV1FVNVVJRk5GUTFSSlQwNGdRMHhGUVZJZ1NWUWdYRnhjWEZ4dVhIUmNkRngwYVc1MFpYSjJZV3hOWVc1aFoyVnlLR1poYkhObExDQWtLR1V1WTNWeWNtVnVkRlJoY21kbGRDa3VZMnh2YzJWemRDZ25jMlZqZEdsdmJpY3BMbUYwZEhJb0oybGtKeWtwTzF4dUx5OGdVMFZVSUVFZ1RrVlhJRWxPVkVWU1ZrRk1JRTlHSURjZ1UwVkRUMDVFVXlCUFRpQlVTRVVnVTBWRFZFbFBUaUJjWEZ4Y1hHNWNkRngwWEhScGJuUmxjblpoYkUxaGJtRm5aWElvZEhKMVpTd2dKQ2hsTG1OMWNuSmxiblJVWVhKblpYUXBMbU5zYjNObGMzUW9KM05sWTNScGIyNG5LUzVoZEhSeUtDZHBaQ2NwTENBM01EQXdLVHRjYmx4MFhIUjlYRzR2THlCRFFVeE1JRlJJUlNCRFRFbERTeUJJUVU1RVRFVlNJRVpWVGtOVVNVOU9JRUZPUkNCUVFWTlRJRWxVSUZSSVJTQkZWa1ZPVkNCY1hGeGNYRzVjZEZ4MGFHRnVaR3hsVUdGdWFXNWhkR2x2YmtKMWRIUnZia05zYVdOcktHVXBPMXh1WEhSOUtUdGNibHh1THk4Z1NVNUpWRWxCVEVsYVJTQlBUa1ZRUVVkRlUwTlNUMHhNSUVsR0lFNVBWQ0JKVGlCRFRWTWdVRkpGVmtsRlZ5NGdYRnhjWEZ4dVhHNWNkR2xtS0NFa0tHeHZZMkYwYVc5dUtTNWhkSFJ5S0Nkb2NtVm1KeWt1YVc1amJIVmtaWE1vSjJsdVpHVjRMbkJvY0NjcEtTQjdYRzVjZEZ4MEpDZ25JM05qY205c2JHVnlWM0poY0hCbGNpY3BMbTl1WlhCaFoyVmZjMk55YjJ4c0tIdGNibHgwWEhSY2RITmxZM1JwYjI1RGIyNTBZV2x1WlhJNklGd2ljMlZqZEdsdmJsd2lMQ0FnSUNCY2JseDBYSFJjZEdWaGMybHVaem9nWENKbFlYTmxMVzkxZEZ3aUxDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1hHNWNkRngwWEhSaGJtbHRZWFJwYjI1VWFXMWxPaUIwYVcxbExDQWdJQ0FnSUNBZ0lDQWdJRnh1WEhSY2RGeDBjR0ZuYVc1aGRHbHZiam9nZEhKMVpTd2dJQ0FnSUNBZ0lDQWdJQ0FnSUNCY2JseDBYSFJjZEhWd1pHRjBaVlZTVERvZ2RISjFaU3dnSUNBZ0lDQWdJQ0FnSUNBZ0lDQmNibHgwWEhSY2RHSmxabTl5WlUxdmRtVTZJQ2hwYm1SbGVDa2dQVDRnZTMwc0lGeHVYSFJjZEZ4MFlXWjBaWEpOYjNabE9pQW9hVzVrWlhncElEMCtJSHRjYmk4dklFbE9TVlJKUVV4SldrVWdWRWhGSUVOVlVsSkZUbFFnVUVGSFJTNGdYRnhjWEZ4dVhHNWNkRngwWEhSY2RIQmhaMlZNYjJGa1pYSW9hVzVrWlhncE8xeHVYSFJjZEZ4MGZTd2dJRnh1WEhSY2RGeDBiRzl2Y0RvZ1ptRnNjMlVzSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCY2JseDBYSFJjZEd0bGVXSnZZWEprT2lCMGNuVmxMQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdYRzVjZEZ4MFhIUnlaWE53YjI1emFYWmxSbUZzYkdKaFkyczZJR1poYkhObExDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lGeHVYSFJjZEZ4MFpHbHlaV04wYVc5dU9pQmNJblpsY25ScFkyRnNYQ0lnSUNBZ0lDQWdJQ0FnWEc1Y2RGeDBmU2s3WEc1Y2JseDBYSFFrS0NjamMyTnliMnhzWlhKWGNtRndjR1Z5SnlrdWJXOTJaVlJ2S0RFcE8xeHVYSFI5WEc1Y2JpOHZJRU5QVGxSU1Qwd2dRMHhKUTB0VElFOU9JRmRQVWtzZ1YwbFVTQ0JWVXlCVFJVTlVTVTlPSUNoVFJVTlVTVTlPTlNrdUlGeGNYRnhjYmx4dVhIUWtLQ2N1WTJ4cFkydGhZbXhsSnlrdVkyeHBZMnNvS0dVcElEMCtJSHRjYmx4MFhIUnNaWFFnWTNWeWNtVnVkRk5sWTNScGIyNGdQU0FrS0dVdWRHRnlaMlYwS1M1amJHOXpaWE4wS0NRb0p5NXpkV0pUWldOMGFXOXVKeWtwTzF4dVhHNWNkRngwYVdZb1kzVnljbVZ1ZEZObFkzUnBiMjR1YUdGelEyeGhjM01vSjI5d1pXNG5LU2tnZTF4dVhIUmNkRngwWTNWeWNtVnVkRk5sWTNScGIyNHVjbVZ0YjNabFEyeGhjM01vSjI5d1pXNG5LVHRjYmx4MFhIUmNkR04xY25KbGJuUlRaV04wYVc5dUxtWnBibVFvSnk1aWRYUjBiMjRzSUhBbktTNXlaVzF2ZG1WRGJHRnpjeWduWm1Ga1pVbHVKeWs3WEc1Y2RGeDBYSFJqZFhKeVpXNTBVMlZqZEdsdmJpNXphV0pzYVc1bmN5Z25Mbk4xWWxObFkzUnBiMjRuS1M1dFlYQW9LR2xrZUN3Z2MyVmpkR2x2YmlrZ1BUNGdlMXh1WEhSY2RGeDBYSFFrS0hObFkzUnBiMjRwTG5KbGJXOTJaVU5zWVhOektDZGpiRzl6WldRbktUdGNibHgwWEhSY2RGeDBKQ2h6WldOMGFXOXVLUzVtYVc1a0tDY3VkR2x1ZENjcExuSmxiVzkyWlVOc1lYTnpLQ2RoWkdSVWFXNTBKeWt1WVdSa1EyeGhjM01vSjNKbGJXOTJaVlJwYm5RbktUdGNibHgwWEhSY2RIMHBPMXh1WEhSY2RIMGdaV3h6WlNCN1hHNWNkRngwWEhSamRYSnlaVzUwVTJWamRHbHZiaTV5WlcxdmRtVkRiR0Z6Y3lnblkyeHZjMlZrSnlrdVlXUmtRMnhoYzNNb0oyOXdaVzRuS1R0Y2JseDBYSFJjZEdOMWNuSmxiblJUWldOMGFXOXVMbTl1S0NkMGNtRnVjMmwwYVc5dVpXNWtJSGRsWW10cGRGUnlZVzV6YVhScGIyNUZibVFnYjFSeVlXNXphWFJwYjI1RmJtUW5MQ0FvWlhNcElEMCtJSHRjYmx4MElDQWdJRngwSkNnbkxuTjFZbE5sWTNScGIyNHViM0JsYmljcExtWnBibVFvSnk1aWRYUjBiMjRzSUhBbktTNWhaR1JEYkdGemN5Z25abUZrWlVsdUp5azdYRzVjZEZ4MFhIUjlLVHRjYmx4MFhIUmNkR04xY25KbGJuUlRaV04wYVc5dUxuTnBZbXhwYm1kektDY3VjM1ZpVTJWamRHbHZiaWNwTG0xaGNDZ29hV1I0TENCelpXTjBhVzl1S1NBOVBpQjdYRzVjZEZ4MFhIUmNkQ1FvYzJWamRHbHZiaWt1Y21WdGIzWmxRMnhoYzNNb0oyOXdaVzRuS1M1aFpHUkRiR0Z6Y3lnblkyeHZjMlZrSnlrN1hHNWNkRngwWEhSY2RDUW9jMlZqZEdsdmJpa3VabWx1WkNnbkxuUnBiblFuS1M1eVpXMXZkbVZEYkdGemN5Z25jbVZ0YjNabFZHbHVkQ2NwTG1Ga1pFTnNZWE56S0NkaFpHUlVhVzUwSnlrN1hHNWNkRngwWEhSY2RDUW9jMlZqZEdsdmJpa3VabWx1WkNnbkxtSjFkSFJ2Yml3Z2NDY3BMbkpsYlc5MlpVTnNZWE56S0NkbVlXUmxTVzRuS1R0Y2JseDBYSFJjZEgwcE8xeHVYSFJjZEgxY2JseDBYSFJqZFhKeVpXNTBVMlZqZEdsdmJpNW1hVzVrS0NjdWRHbHVkQ2NwTG5KbGJXOTJaVU5zWVhOektDZGhaR1JVYVc1MEp5a3VZV1JrUTJ4aGMzTW9KM0psYlc5MlpWUnBiblFuS1R0Y2JseDBmU2s3WEc1Y2JpOHZJRU5QVGxSU1Qwd2dSazlQVkVWU0lFRlNVazlYSUVOTVNVTkxVeTRnWEZ4Y1hGeHVYRzVjZENRb0p5TmtiM2R1UVhKeWIzY25LUzVqYkdsamF5Z29LU0E5UGlCN1hHNWNkRngwYVdZb0pDaDNhVzVrYjNjcExtaGxhV2RvZENncElDb2dLQ1FvSnk1d1lXZGxKeWt1YkdWdVozUm9JQzBnTVNrZ1BUMDlJQzBnSkNnbkkzTmpjbTlzYkdWeVYzSmhjSEJsY2ljcExtOW1abk5sZENncExuUnZjQ2tnZTF4dUx5OGdUVTlXUlNCVVR5QlVUMUFnVDBZZ1VFRkhSU0JKUmlCRFZWSlNSVTVVVEZrZ1FWUWdRazlVVkU5TklGeGNYRnhjYmx4MElDQmNkQ1FvSnlOelkzSnZiR3hsY2xkeVlYQndaWEluS1M1dGIzWmxWRzhvTVNrN1hHNWNkRngwZlNCbGJITmxJSHRjYmx4MFhIUmNkQ1FvSnlOelkzSnZiR3hsY2xkeVlYQndaWEluS1M1dGIzWmxSRzkzYmlncE8xeHVYSFJjZEgxY2JseDBmU2s3WEc1Y2JpOHZJRWhKUkVVZ1ZFaEZJRXhQUVVSSlRrY2dRVTVKVFVGVVNVOVFUaUJYU0VWT0lGWkpSRVZQSUVsVElGSkZRVVJaSUZSUElGQk1RVmtnVDA0Z1JFVlRXRXRVVDFBdUlGeGNYRnhjYmx4dVhIUmpiMjV6ZENCb2FXUmxURzloWkdsdVowRnVhVzFoZEdsdmJpQTlJQ2dwSUQwK0lIdGNibHgwWEhScFppaDNhVzVrYjNjdWFXNXVaWEpYYVdSMGFDQStJRGd3TUNBbUppQWhKQ2duSTJ4dllXUnBibWNuS1M1b1lYTkRiR0Z6Y3lnbmFHbGtaR1Z1SnlrcElIdGNibHh1WEhSY2RGeDBhV1lvSkNnbkkzWnBaR1Z2SnlrdVoyVjBLREFwTG5KbFlXUjVVM1JoZEdVZ1BUMDlJRFFwSUh0Y2JseDBYSFJjZEZ4MEpDZ25JMnh2WVdScGJtY25LUzVoWkdSRGJHRnpjeWduYUdsa1pHVnVKeWs3WEc1Y2RGeDBYSFI5WEc1Y2RGeDBmVnh1WEhSOVhHNWNiaTh2SUUxQlRrRkhSVTFGVGxRZ1JsVk9RMVJKVDA0Z1JrOVNJRk5GVkZSSlRrY2dRVTVFSUVOTVJVRlNTVTVISUZSSVJTQlRURWxFUlNCQlZWUlBUVUZVU1U5T0lFbE9WRVZTVmtGTVV5NGdYRnhjWEZ4dVhHNWNkR052Ym5OMElHbHVkR1Z5ZG1Gc1RXRnVZV2RsY2lBOUlDaG1iR0ZuTENCelpXTjBhVzl1U1dRc0lIUnBiV1VwSUQwK0lIdGNiaUFnSUZ4MGFXWW9abXhoWnlrZ2UxeHVJRngwWEhSY2RHMWhjM1JsY2s5aWFsdHpaV04wYVc5dVNXUmRMbUYxZEc5dFlYUmxJRDBnYzJWMFNXNTBaWEoyWVd3b0tDa2dQVDRnZTF4dUlDQWdJQ0JjZEZ4MGMzZHBjR1ZEYjI1MGNtOXNiR1Z5S0hObFkzUnBiMjVKWkN3Z0oyd25LVHRjZEZ4dUlDQWdJQ0JjZEgwc0lIUnBiV1VwT3lCY2JpQWdJRngwZlNCbGJITmxJSHRjZEZ4MFhHNGdJQ0FnWEhSamJHVmhja2x1ZEdWeWRtRnNLRzFoYzNSbGNrOWlhbHR6WldOMGFXOXVTV1JkTG1GMWRHOXRZWFJsS1R0Y2JpQWdJRngwZlZ4dVhIUjlPMXh1WEc0dkx5QkpSaUJPVDFRZ1NVNGdRMDFUSUVGRVRVbE9JRkJTUlZaSlJWY3NJRkJGVWxCRlZGVkJURXhaSUVOSVJVTkxJRWxHSUZkRklFRlNSU0JCVkNCVVNFVWdWRTlRSUU5R0lGUklSU0JRUVVkRklFRk9SQ0JKUmlCVFR5d2dSRTlPVkNCVFNFOVhJRlJJUlNCR1QwOVVSVklnVDFJZ1IxSkZSVTRnVTBoQlVFVXVJRnhjWEZ4Y2JseHVYSFJwWmlnaEpDaHNiMk5oZEdsdmJpa3VZWFIwY2lnbmFISmxaaWNwTG1sdVkyeDFaR1Z6S0NkcGJtUmxlQzV3YUhBbktTa2dlMXh1WEhSY2RITmxkRWx1ZEdWeWRtRnNLQ2dwSUQwK0lIdGNibHgwWEhSY2RHbG1LQ1FvSnlOelkzSnZiR3hsY2xkeVlYQndaWEluS1M1dlptWnpaWFFvS1M1MGIzQWdQajBnTUNrZ2UxeHVYSFJjZEZ4MFhIUWtLQ2NqYUdWaFpHVnlVMmhoY0dVc0lDTm1iMjkwWlhJbktTNWhaR1JEYkdGemN5Z25iVzkyWlU5bVpsTmpjbVZsYmljcE8xeHVYSFJjZEZ4MFhIUWtLQ2NqZG1sa1pXOG5LUzVuWlhRb01Da3VjR3hoZVNncE8xeHVYSFJjZEZ4MFhIUWtLQ2N1WVhKeWIzY25LUzVoWkdSRGJHRnpjeWduY0hWc2MyRjBaU2NwTzF4dVhIUmNkRngwZlNCbGJITmxJSHRjYmx4MFhIUmNkRngwZG1GeUlIUnBiV1Z2ZFhRZ1BTQnpaWFJVYVcxbGIzVjBLQ2dwSUQwK0lIdGNibHgwWEhSY2RGeDBYSFFrS0NjamFHVmhaR1Z5VTJoaGNHVXNJQ05tYjI5MFpYSW5LUzV5WlcxdmRtVkRiR0Z6Y3lnbmJXOTJaVTltWmxOamNtVmxiaWNwTzF4dVhIUmNkRngwWEhSY2RDUW9KeU4yYVdSbGJ5Y3BMbWRsZENnd0tTNXdZWFZ6WlNncE8xeHVYSFJjZEZ4MFhIUmNkQ1FvSnk1aGNuSnZkeWNwTG5KbGJXOTJaVU5zWVhOektDZHdkV3h6WVhSbEp5azdYRzVjZEZ4MFhIUmNkRngwWTJ4bFlYSlVhVzFsYjNWMEtIUnBiV1Z2ZFhRcE8xeHVYSFJjZEZ4MFhIUjlMQ0IwYVcxbEtUdGNibHgwWEhSY2RIMWNibHh1THk4Z1VrOVVRVlJGSUZSSVJTQkJVbEpQVnlCSlRpQlVTRVVnUms5UFZFVlNJRmRJUlU0Z1FWUWdWRWhGSUVKUFZGUlBUU0JQUmlCVVNFVWdVRUZIUlNCY1hGeGNYRzVjYmx4MFhIUmNkR2xtS0NRb0p5TnpZM0p2Ykd4bGNsZHlZWEJ3WlhJbktTNXZabVp6WlhRb0tTNTBiM0FnUENBdElDaDNhVzVrYjNjdWFXNXVaWEpJWldsbmFIUWdLaUEwS1NrZ2UxeHVYSFJjZEZ4MFhIUWtLQ2NqWkc5M2JrRnljbTkzSnlrdVkzTnpLSHNuZEhKaGJuTm1iM0p0SnpvZ0ozSnZkR0YwWlNneE9EQmtaV2NwSUhSeVlXNXpiR0YwWlZnb0xUVXdKU2tuZlNrN1hHNWNkRngwWEhSOUlHVnNjMlVnZTF4dVhIUmNkRngwWEhRa0tDY2paRzkzYmtGeWNtOTNKeWt1WTNOektIc25kSEpoYm5ObWIzSnRKem9nSjNSeVlXNXpiR0YwWlZnb0xUVXdKU2tnY205MFlYUmxLREJrWldjcEozMHBPMXh1WEhSY2RGeDBmVnh1WEc1Y2RGeDBYSFJvYVdSbFRHOWhaR2x1WjBGdWFXMWhkR2x2YmlncE8xeHVYRzR2THlCQlJFUWdURUZPUkZORFFWQkZJRk5VV1V4RlV5QlVUeUJTUlV4RlZrRk9WQ0JGVEVWTlJVNVVVeUJjWEZ4Y1hHNWNibHgwWEhSY2RHbG1LSGRwYm1SdmR5NXRZWFJqYUUxbFpHbGhLRndpS0c5eWFXVnVkR0YwYVc5dU9pQnNZVzVrYzJOaGNHVXBYQ0lwTG0xaGRHTm9aWE1nSmlZZ2QybHVaRzkzTG1sdWJtVnlWMmxrZEdnZ1BDQTRNREFwSUh0Y2JseDBYSFJjZENBZ0pDZ25MbTVoZGw5c2FXNXJMQ0FqYUdWaFpHVnlVMmhoY0dVc0lDTm1iMjkwWlhJc0lDNWpkWE4wYjIwc0lDNXRZWEpyWlhJc0lDTnpaV04wYVc5dU5Td2dMblJsZUhSWGNtRndjR1Z5SnlrdVlXUmtRMnhoYzNNb0oyeGhibVJ6WTJGd1pTY3BPMXh1WEhSY2RGeDBmU0JsYkhObElIdGNibHgwWEhSY2RGeDBJQ1FvSnk1dVlYWmZiR2x1YXl3Z0kyaGxZV1JsY2xOb1lYQmxMQ0FqWm05dmRHVnlMQ0F1WTNWemRHOXRMQ0F1YldGeWEyVnlMQ0FqYzJWamRHbHZialVzSUM1MFpYaDBWM0poY0hCbGNpY3BMbkpsYlc5MlpVTnNZWE56S0Nkc1lXNWtjMk5oY0dVbktUdGNibHgwWEhSY2RIMWNibHh1WEhSY2RGeDBhV1lvSkNnbkkzTmxZM1JwYjI0ekxtRmpkR2wyWlNjcExteGxibWQwYUNrZ2V5QXZMeUJCVlZSUFRVRlVSU0JVU0VVZ1UweEpSRVZUSUU5T0lGTkZRMVJKVDFCT0lETWdSVlpGVWxrZ055QlRSVU5QVGtSVElFbEdJRlJJUlNCVFJVTlVTVTlPSUVsVElFRkRWRWxXUlM0Z1hGeGNYRnh1WEhSY2RGeDBYSFJwWmlodFlYTjBaWEpQWW1vdWMyVmpkR2x2YmpNdWFYTkJkWFJ2YldGMFpXUWdJVDA5SUhSeWRXVXBJSHRjYmx4MFhIUmNkRngwWEhSdFlYTjBaWEpQWW1vdWMyVmpkR2x2YmpNdWFYTkJkWFJ2YldGMFpXUWdQU0IwY25WbE8xeHVYSFJjZEZ4MFhIUmNkR2x1ZEdWeWRtRnNUV0Z1WVdkbGNpaDBjblZsTENBbmMyVmpkR2x2YmpNbkxDQTNNREF3S1R0Y2JseDBYSFJjZEZ4MGZWeHVYSFJjZEZ4MGZTQmxiSE5sSUhzZ0x5OGdVMVJQVUNCQlZWUlBUVUZVUlVRZ1UweEpSRVZUSUU5T0lGTkZRMVJKVDFCT0lETWdTVVlnVkVoRklGTkZRMVJKVDA0Z1NWTWdUazlVSUVGRFZFbFdSUzRnWEZ4Y1hGeHVYSFJjZEZ4MFhIUnBaaWh0WVhOMFpYSlBZbW91YzJWamRHbHZiak11YVhOQmRYUnZiV0YwWldRZ1BUMDlJSFJ5ZFdVcElIdGNibHgwWEhSY2RGeDBYSFJwYm5SbGNuWmhiRTFoYm1GblpYSW9abUZzYzJVc0lDZHpaV04wYVc5dU15Y3BPMXh1WEhSY2RGeDBYSFJjZEcxaGMzUmxjazlpYWk1elpXTjBhVzl1TXk1cGMwRjFkRzl0WVhSbFpDQTlJR1poYkhObE8xeHVYSFJjZEZ4MFhIUjlYRzVjZEZ4MFhIUjlYRzVjYmx4MFhIUmNkR2xtS0NRb0p5TnpaV04wYVc5dU5DNWhZM1JwZG1VbktTNXNaVzVuZEdncElIc2dMeThnUVZWVVQwMUJWRVVnVkVoRklGTk1TVVJGVXlCUFRpQlRSVU5VU1U5UVRpQTBJRVZXUlZKWklEY2dVMFZEVDA1RVV5QkpSaUJVU0VVZ1UwVkRWRWxQVGlCSlV5QkJRMVJKVmtVdUlGeGNYRnhjYmx4MFhIUmNkRngwYVdZb2JXRnpkR1Z5VDJKcUxuTmxZM1JwYjI0MExtbHpRWFYwYjIxaGRHVmtJQ0U5UFNCMGNuVmxLU0I3WEc1Y2RGeDBYSFJjZEZ4MGJXRnpkR1Z5VDJKcUxuTmxZM1JwYjI0MExtbHpRWFYwYjIxaGRHVmtJRDBnZEhKMVpUdGNibHgwWEhSY2RGeDBYSFJwYm5SbGNuWmhiRTFoYm1GblpYSW9kSEoxWlN3Z0ozTmxZM1JwYjI0MEp5d2dOekF3TUNrN1hHNWNkRngwWEhSY2RIMWNibHgwWEhSY2RIMGdaV3h6WlNCN0lDOHZJRk5VVDFBZ1FWVlVUMDFCVkVWRUlGTk1TVVJGVXlCUFRpQlRSVU5VU1U5UVRpQTBJRWxHSUZSSVJTQlRSVU5VU1U5T0lFbFRJRTVQVkNCQlExUkpWa1V1SUZ4Y1hGeGNibHgwWEhSY2RGeDBhV1lvYldGemRHVnlUMkpxTG5ObFkzUnBiMjQwTG1selFYVjBiMjFoZEdWa0lEMDlQU0IwY25WbEtTQjdYRzVjZEZ4MFhIUmNkRngwYVc1MFpYSjJZV3hOWVc1aFoyVnlLR1poYkhObExDQW5jMlZqZEdsdmJqUW5LVHRjYmx4MFhIUmNkRngwWEhSdFlYTjBaWEpQWW1vdWMyVmpkR2x2YmpRdWFYTkJkWFJ2YldGMFpXUWdQU0JtWVd4elpUdGNibHgwWEhSY2RGeDBmVnh1WEhSY2RGeDBmVnh1WEhSY2RIMHNJRFV3TUNrN1hHNWNkSDFjYmx4dUx5OGdRMDlPVkZKUFRDQlhTRUZVSUVoQlVGQkZUbE1nVjBoRlRpQk1TVTVMVXlCSlRpQlVTRVVnVGtGV0wwMUZUbFVnUVZKRklFTk1TVU5MUlVRZ1hGeGNYRnh1WEc1Y2RDUW9KeTV1WVhaZmJHbHVheWNwTG1Oc2FXTnJLQ2hsS1NBOVBpQjdYRzVjZEZ4MFkyOXVjM1FnY0dGblpVbGtlQ0E5SUhCaGNuTmxTVzUwS0NRb1pTNTBZWEpuWlhRcExtRjBkSElvSjJSaGRHRXRhVzVrWlhnbktTazdYRzVjZEZ4MEpDZ25JM05qY205c2JHVnlWM0poY0hCbGNpY3BMbTF2ZG1WVWJ5aHdZV2RsU1dSNEtUdGNibHgwWEhRa0tDY2piV1Z1ZFVKc2IyTnJUM1YwSnlrdVlXUmtRMnhoYzNNb0oyaHBaR1JsYmljcE8xeHVYRzVjZEZ4MGFXWW9ZblZ5WjJWeUxtTnNZWE56VEdsemRDNWpiMjUwWVdsdWN5Z25ZblZ5WjJWeUxTMWhZM1JwZG1VbktTa2dlMXh1SUNBZ0lDQWdibUYyTG1Oc1lYTnpUR2x6ZEM1eVpXMXZkbVVvSjI1aGRsOXZjR1Z1SnlrN1hHNGdJQ0FnSUNCaWRYSm5aWEl1WTJ4aGMzTk1hWE4wTG5KbGJXOTJaU2duWW5WeVoyVnlMUzFoWTNScGRtVW5LVHRjYmlBZ0lDQWdJR1J2WTNWdFpXNTBMbUp2WkhrdWMzUjViR1V1Y0c5emFYUnBiMjRnUFNBbmNtVnNZWFJwZG1Vbk8xeHVJQ0FnSUgwZ1hHNWNkSDBwTzF4dVhHNHZMeUJYU0VWT0lGUklSU0JPUVZZZ1NWTWdUMUJGVGlCUVVrVldSVTVVSUZWVFJWSWdSbEpQVFNCQ1JVbE9SeUJCUWt4RklGUlBJRU5NU1VOTElFRk9XVlJJU1U1SElFVk1VMFVnWEZ4Y1hGeHVYRzVjZENRb0p5TnRaVzUxUW14dlkydFBkWFFuS1M1amJHbGpheWdvWlNrZ1BUNGdlMXh1WEhRZ0lDQmxMbk4wYjNCUWNtOXdZV2RoZEdsdmJpZ3BPMXh1WEhSOUtUdGNibHh1WEhSMllYSWdZblZ5WjJWeUlEMGdaRzlqZFcxbGJuUXVaMlYwUld4bGJXVnVkRUo1U1dRb0oyMWhhVzR0WW5WeVoyVnlKeWtzSUZ4dUlDQnVZWFlnUFNCa2IyTjFiV1Z1ZEM1blpYUkZiR1Z0Wlc1MFFubEpaQ2duYldGcGJrNWhkaWNwTzF4dVhHNHZMeUJEVDA1VVVrOU1JRVpQVWlCUFVFVk9JRUZPUkNCRFRFOVRTVTVISUZSSVJTQk5SVTVWTDA1QlZpQWdYRnhjWEZ4dVhHNGdJR1oxYm1OMGFXOXVJRzVoZGtOdmJuUnliMndvS1NCN1hHNWNiaUFnSUNCcFppaGlkWEpuWlhJdVkyeGhjM05NYVhOMExtTnZiblJoYVc1ektDZGlkWEpuWlhJdExXRmpkR2wyWlNjcEtTQjdYRzRnSUNBZ0lDQnVZWFl1WTJ4aGMzTk1hWE4wTG5KbGJXOTJaU2duYm1GMlgyOXdaVzRuS1R0Y2JpQWdJQ0FnSUdKMWNtZGxjaTVqYkdGemMweHBjM1F1Y21WdGIzWmxLQ2RpZFhKblpYSXRMV0ZqZEdsMlpTY3BPMXh1SUNBZ0lDQWdKQ2duSTIxbGJuVkNiRzlqYTA5MWRDY3BMbUZrWkVOc1lYTnpLQ2RvYVdSa1pXNG5LVHRjYmlBZ0lDQjlJRnh1SUNBZ0lHVnNjMlVnZTF4dUlDQWdJQ0FnWW5WeVoyVnlMbU5zWVhOelRHbHpkQzVoWkdRb0oySjFjbWRsY2kwdFlXTjBhWFpsSnlrN1hHNGdJQ0FnSUNCdVlYWXVZMnhoYzNOTWFYTjBMbUZrWkNnbmJtRjJYMjl3Wlc0bktUdGNiaUFnSUNBZ0lDUW9KeU50Wlc1MVFteHZZMnRQZFhRbktTNXlaVzF2ZG1WRGJHRnpjeWduYUdsa1pHVnVKeWs3WEc0Z0lDQWdmVnh1SUNCOVhHNGdJRnh1THk4Z1QwNU1XU0JNU1ZOVVJVNGdSazlTSUUxRlRsVWdRMHhKUTB0VElGZElSVTRnVGs5VUlFbE9JRU5OVXlCUVVrVldTVVZYSUUxUFJFVWdYRnhjWEZ4dVhHNGdJR2xtS0NFa0tHeHZZMkYwYVc5dUtTNWhkSFJ5S0Nkb2NtVm1KeWt1YVc1amJIVmtaWE1vSjJsdVpHVjRMbkJvY0NjcEtTQjdYRzRnSUZ4MFluVnlaMlZ5TG1Ga1pFVjJaVzUwVEdsemRHVnVaWElvSjJOc2FXTnJKeXdnYm1GMlEyOXVkSEp2YkNrN1hHNGdJSDFjYmx4dUx5OGdRMHhQVTBVZ1ZFaEZJRTVCVmlCSlJpQlVTRVVnVjBsT1JFOVhJRWxUSUU5V1JWSWdNVEF3TUZCWUlGZEpSRVVnWEZ4Y1hGeHVYRzRnSUhkcGJtUnZkeTVoWkdSRmRtVnVkRXhwYzNSbGJtVnlLQ2R5WlhOcGVtVW5MQ0JtZFc1amRHbHZiaWdwSUh0Y2JpQWdJQ0JwWmloM2FXNWtiM2N1YVc1dVpYSlhhV1IwYUNBK0lERXdNREFnSmlZZ2JtRjJMbU5zWVhOelRHbHpkQzVqYjI1MFlXbHVjeWduYm1GMlgyOXdaVzRuS1NrZ2UxeHVJQ0FnSUNBZ2JtRjJRMjl1ZEhKdmJDZ3BPMXh1SUNBZ0lDQWdibUYyTG1Oc1lYTnpUR2x6ZEM1eVpXMXZkbVVvSjI1aGRsOXZjR1Z1SnlrN1hHNGdJQ0FnSUNBZ0pDZ25JMjFsYm5WQ2JHOWphMDkxZENjcExtRmtaRU5zWVhOektDZG9hV1JrWlc0bktUdGNiaUFnSUNCOVhHNGdJSDBwTzF4dVhHNHZMeUJVU0VsVElGTkZWQ0JQUmlCSlJpQlRWRUZVUlUxRlRsUlRJRWxPU1ZSSlFVeEpVMFZUSUZSSVJTQlRVRVZUU1VaSlF5QlFRVWRGVXlCR1QxSWdVRkpGVmtsRlYwbE9SeUJKVGlCRFRWTWdRVVJOU1U0dUlGeGNYRnhjYmx4dUlDQnBaaWdrS0d4dlkyRjBhVzl1S1M1aGRIUnlLQ2RvY21WbUp5a3VhVzVqYkhWa1pYTW9KMmx1WkdWNExuQm9jQ2NwS1NCN1hHNWNkRngwYVdZb0pDaHNiMk5oZEdsdmJpa3VZWFIwY2lnbmFISmxaaWNwTG1sdVkyeDFaR1Z6S0NkcGJXRm5hVzVsTFdsbUp5a3BJSHRjYmx4MFhIUmNkSEJoWjJWTWIyRmtaWElvTkNrN1hHNWNkRngwZlZ4dVhIUmNkR2xtS0NRb2JHOWpZWFJwYjI0cExtRjBkSElvSjJoeVpXWW5LUzVwYm1Oc2RXUmxjeWduYUc5M0xYZGxMV2x1Ym05MllYUmxKeWtwSUh0Y2JseDBYSFJjZEhCaFoyVk1iMkZrWlhJb015azdYRzVjZEZ4MGZWeHVYSFJjZEdsbUtDUW9iRzlqWVhScGIyNHBMbUYwZEhJb0oyaHlaV1luS1M1cGJtTnNkV1JsY3lnbmQyOXlheTEzYVhSb0xYVnpKeWtwSUh0Y2JseDBYSFJjZEhCaFoyVk1iMkZrWlhJb05TazdYRzVjZEZ4MGZWeHVYSFJjZEdsbUtDUW9iRzlqWVhScGIyNHBMbUYwZEhJb0oyaHlaV1luS1M1cGJtTnNkV1JsY3lnblkyOXVkR0ZqZEMxMWN5Y3BLU0I3WEc1Y2RGeDBYSFJ3WVdkbFRHOWhaR1Z5S0RZcE8xeHVYSFJjZEgxY2JseDBYSFJwWmlna0tHeHZZMkYwYVc5dUtTNWhkSFJ5S0Nkb2NtVm1KeWt1YVc1amJIVmtaWE1vSjJodmJXVXRkbWxrWlc4bktTa2dlMXh1WEhSY2RGeDBjMlYwU1c1MFpYSjJZV3dvS0NrZ1BUNGdlMXh1WEhSY2RGeDBYSFJvYVdSbFRHOWhaR2x1WjBGdWFXMWhkR2x2YmlncE8xeHVYSFJjZEZ4MGZTd2dOVEF3S1Z4dVhIUmNkSDFjYmx4MGZWeHVYRzR2THlCVFYwbFFSU0JGVmtWT1ZGTWdSRVZVUlVOVVQxSWdSbFZPUTFSSlQwNGdYRnhjWEZ4dVhHNGdJR1oxYm1OMGFXOXVJR1JsZEdWamRITjNhWEJsS0dWc0xDQm1kVzVqS1NCN1hHNWNkQ0FnYkdWMElITjNhWEJsWDJSbGRDQTlJSHQ5TzF4dVhIUWdJSE4zYVhCbFgyUmxkQzV6V0NBOUlEQTdJSE4zYVhCbFgyUmxkQzV6V1NBOUlEQTdJSE4zYVhCbFgyUmxkQzVsV0NBOUlEQTdJSE4zYVhCbFgyUmxkQzVsV1NBOUlEQTdYRzVjZENBZ2RtRnlJRzFwYmw5NElEMGdNekE3SUNBdkwyMXBiaUI0SUhOM2FYQmxJR1p2Y2lCb2IzSnBlbTl1ZEdGc0lITjNhWEJsWEc1Y2RDQWdkbUZ5SUcxaGVGOTRJRDBnTXpBN0lDQXZMMjFoZUNCNElHUnBabVpsY21WdVkyVWdabTl5SUhabGNuUnBZMkZzSUhOM2FYQmxYRzVjZENBZ2RtRnlJRzFwYmw5NUlEMGdOVEE3SUNBdkwyMXBiaUI1SUhOM2FYQmxJR1p2Y2lCMlpYSjBhV05oYkNCemQybHdaVnh1WEhRZ0lIWmhjaUJ0WVhoZmVTQTlJRFl3T3lBZ0x5OXRZWGdnZVNCa2FXWm1aWEpsYm1ObElHWnZjaUJvYjNKcGVtOXVkR0ZzSUhOM2FYQmxYRzVjZENBZ2RtRnlJR1JwY21WaklEMGdYQ0pjSWp0Y2JseDBJQ0JzWlhRZ1pXeGxJRDBnWkc5amRXMWxiblF1WjJWMFJXeGxiV1Z1ZEVKNVNXUW9aV3dwTzF4dVhIUWdJR1ZzWlM1aFpHUkZkbVZ1ZEV4cGMzUmxibVZ5S0NkMGIzVmphSE4wWVhKMEp5eG1kVzVqZEdsdmJpaGxLWHRjYmx4MElDQWdJSFpoY2lCMElEMGdaUzUwYjNWamFHVnpXekJkTzF4dVhIUWdJQ0FnYzNkcGNHVmZaR1YwTG5OWUlEMGdkQzV6WTNKbFpXNVlPeUJjYmx4MElDQWdJSE4zYVhCbFgyUmxkQzV6V1NBOUlIUXVjMk55WldWdVdUdGNibHgwSUNCOUxHWmhiSE5sS1R0Y2JseDBJQ0JsYkdVdVlXUmtSWFpsYm5STWFYTjBaVzVsY2lnbmRHOTFZMmh0YjNabEp5eG1kVzVqZEdsdmJpaGxLWHRjYmx4MElDQWdJR1V1Y0hKbGRtVnVkRVJsWm1GMWJIUW9LVHRjYmx4MElDQWdJSFpoY2lCMElEMGdaUzUwYjNWamFHVnpXekJkTzF4dVhIUWdJQ0FnYzNkcGNHVmZaR1YwTG1WWUlEMGdkQzV6WTNKbFpXNVlPeUJjYmx4MElDQWdJSE4zYVhCbFgyUmxkQzVsV1NBOUlIUXVjMk55WldWdVdUc2dJQ0FnWEc1Y2RDQWdmU3htWVd4elpTazdYRzVjZENBZ1pXeGxMbUZrWkVWMlpXNTBUR2x6ZEdWdVpYSW9KM1J2ZFdOb1pXNWtKeXhtZFc1amRHbHZiaWhsS1h0Y2JseDBJQ0FnSUM4dmFHOXlhWHB2Ym5SaGJDQmtaWFJsWTNScGIyNWNibHgwSUNBZ0lHbG1JQ2dvS0NoemQybHdaVjlrWlhRdVpWZ2dMU0J0YVc1ZmVDQStJSE4zYVhCbFgyUmxkQzV6V0NrZ2ZId2dLSE4zYVhCbFgyUmxkQzVsV0NBcklHMXBibDk0SUR3Z2MzZHBjR1ZmWkdWMExuTllLU2tnSmlZZ0tDaHpkMmx3WlY5a1pYUXVaVmtnUENCemQybHdaVjlrWlhRdWMxa2dLeUJ0WVhoZmVTa2dKaVlnS0hOM2FYQmxYMlJsZEM1eldTQStJSE4zYVhCbFgyUmxkQzVsV1NBdElHMWhlRjk1S1NBbUppQW9jM2RwY0dWZlpHVjBMbVZZSUQ0Z01Da3BLU2tnZTF4dVhIUWdJQ0FnSUNCcFppaHpkMmx3WlY5a1pYUXVaVmdnUGlCemQybHdaVjlrWlhRdWMxZ3BJR1JwY21WaklEMGdYQ0p5WENJN1hHNWNkQ0FnSUNBZ0lHVnNjMlVnWkdseVpXTWdQU0JjSW14Y0lqdGNibHgwSUNBZ0lIMWNibHgwSUNBZ0lDOHZkbVZ5ZEdsallXd2daR1YwWldOMGFXOXVYRzVjZENBZ0lDQmxiSE5sSUdsbUlDZ29LQ2h6ZDJsd1pWOWtaWFF1WlZrZ0xTQnRhVzVmZVNBK0lITjNhWEJsWDJSbGRDNXpXU2tnZkh3Z0tITjNhWEJsWDJSbGRDNWxXU0FySUcxcGJsOTVJRHdnYzNkcGNHVmZaR1YwTG5OWktTa2dKaVlnS0NoemQybHdaVjlrWlhRdVpWZ2dQQ0J6ZDJsd1pWOWtaWFF1YzFnZ0t5QnRZWGhmZUNrZ0ppWWdLSE4zYVhCbFgyUmxkQzV6V0NBK0lITjNhWEJsWDJSbGRDNWxXQ0F0SUcxaGVGOTRLU0FtSmlBb2MzZHBjR1ZmWkdWMExtVlpJRDRnTUNrcEtTa2dlMXh1WEhRZ0lDQWdJQ0JwWmloemQybHdaVjlrWlhRdVpWa2dQaUJ6ZDJsd1pWOWtaWFF1YzFrcElHUnBjbVZqSUQwZ1hDSmtYQ0k3WEc1Y2RDQWdJQ0FnSUdWc2MyVWdaR2x5WldNZ1BTQmNJblZjSWp0Y2JseDBJQ0FnSUgxY2JseHVYSFFnSUNBZ2FXWWdLR1JwY21WaklDRTlJRndpWENJcElIdGNibHgwSUNBZ0lDQWdhV1lvZEhsd1pXOW1JR1oxYm1NZ1BUMGdKMloxYm1OMGFXOXVKeWtnWm5WdVl5aGxiQ3hrYVhKbFl5azdYRzVjZENBZ0lDQjlYRzVjZENBZ0lDQnNaWFFnWkdseVpXTWdQU0JjSWx3aU8xeHVYSFFnSUNBZ2MzZHBjR1ZmWkdWMExuTllJRDBnTURzZ2MzZHBjR1ZmWkdWMExuTlpJRDBnTURzZ2MzZHBjR1ZmWkdWMExtVllJRDBnTURzZ2MzZHBjR1ZmWkdWMExtVlpJRDBnTUR0Y2JseDBJQ0I5TEdaaGJITmxLVHNnSUZ4dVhIUjlYRzVjYmk4dklFTklUMU5GSUZSSVJTQk9SVmhVSUZOTVNVUkZJRlJQSUZOSVQxY2dRVTVFSUVOTVNVTkxJRlJJUlNCUVFVZEpUa0ZVU1U5T0lFSlZWRlJQVGlCVVNFRlVJRkpGVEVGVVJWTWdWRThnU1ZRdUlGeGNYRnhjYmx4dVhIUmpiMjV6ZENCemQybHdaVU52Ym5SeWIyeHNaWElnUFNBb1pXd3NJR1FwSUQwK0lIdGNibHh1WEhSY2RHbG1LR1ZzSUQwOVBTQW5jMlZqZEdsdmJqUW5LU0I3WEc1Y2JseDBYSFJjZEdOdmJuTjBJSE5sWTNScGIyNDBVR0ZuYVc1aGRHbHZia3hsYm1kMGFDQTlJQ1FvSnk1elpXTjBhVzl1TkZCaFoybHVZWFJ2Y2tKMWRIUnZiaWNwTG14bGJtZDBhRHRjYmx4dVhIUmNkRngwYVdZb1pDQTlQVDBnSjJ3bktTQjdYRzVjYmx4MFhIUmNkRngwYVdZb2MyVmpkR2x2YmpSSlpIZ2dQQ0J6WldOMGFXOXVORkJoWjJsdVlYUnBiMjVNWlc1bmRHZ2dMU0F4S1NCN1hHNWNkRngwWEhSY2RGeDBjMlZqZEdsdmJqUkpaSGdyS3p0Y2JseDBYSFJjZEZ4MGZTQmxiSE5sSUh0Y2JseDBYSFJjZEZ4MFhIUnpaV04wYVc5dU5FbGtlQ0E5SURBN1hHNWNkRngwWEhSY2RIMWNibHgwWEhSY2RGeDBYRzVjZEZ4MFhIUmNkQ1FvSnk1elpXTjBhVzl1TkZCaFoybHVZWFJ2Y2tKMWRIUnZiaWNwVzNObFkzUnBiMjQwU1dSNFhTNWpiR2xqYXlncE8xeHVYSFJjZEZ4MGZWeHVYSFJjZEZ4MGFXWW9aQ0E5UFQwZ0ozSW5LU0I3WEc1Y2JseDBYSFJjZEZ4MGFXWW9jMlZqZEdsdmJqUkpaSGdnUGlBd0tTQjdYRzVjZEZ4MFhIUmNkRngwYzJWamRHbHZialJKWkhndExUdGNibHgwWEhSY2RGeDBmU0JsYkhObElIdGNibHgwWEhSY2RGeDBYSFJ6WldOMGFXOXVORWxrZUNBOUlITmxZM1JwYjI0MFVHRm5hVzVoZEdsdmJreGxibWQwYUNBdElERTdYRzVjZEZ4MFhIUmNkSDFjYmx4dVhIUmNkRngwWEhRa0tDY3VjMlZqZEdsdmJqUlFZV2RwYm1GMGIzSkNkWFIwYjI0bktWdHpaV04wYVc5dU5FbGtlRjB1WTJ4cFkyc29LVHRjYmx4MFhIUmNkSDFjYmx4MFhIUjlYRzVjZEZ4MGFXWW9aV3dnUFQwOUlDZHpaV04wYVc5dU15Y3BJSHRjYmx4dVhIUmNkRngwWTI5dWMzUWdjMlZqZEdsdmJqTlFZV2RwYm1GMGFXOXVUR1Z1WjNSb0lEMGdKQ2duTG5ObFkzUnBiMjR6VUdGbmFXNWhkRzl5UW5WMGRHOXVKeWt1YkdWdVozUm9PMXh1WEc1Y2RGeDBYSFJwWmloa0lEMDlQU0FuYkNjcElIdGNibHh1WEhSY2RGeDBYSFJwWmloelpXTjBhVzl1TTBsa2VDQThJSE5sWTNScGIyNHpVR0ZuYVc1aGRHbHZia3hsYm1kMGFDQXRJREVwSUh0Y2JseDBYSFJjZEZ4MFhIUnpaV04wYVc5dU0wbGtlQ3NyTzF4dVhIUmNkRngwWEhSOUlHVnNjMlVnZTF4dVhIUmNkRngwWEhSY2RITmxZM1JwYjI0elNXUjRJRDBnTUR0Y2JseDBYSFJjZEZ4MGZWeHVYSFJjZEZ4MFhIUmNibHgwWEhSY2RGeDBKQ2duTG5ObFkzUnBiMjR6VUdGbmFXNWhkRzl5UW5WMGRHOXVKeWxiYzJWamRHbHZiak5KWkhoZExtTnNhV05yS0NrN1hHNWNkRngwWEhSOVhHNWNkRngwWEhScFppaGtJRDA5UFNBbmNpY3BJSHRjYmx4dVhIUmNkRngwWEhScFppaHpaV04wYVc5dU0wbGtlQ0ErSURBcElIdGNibHgwWEhSY2RGeDBYSFJ6WldOMGFXOXVNMGxrZUMwdE8xeHVYSFJjZEZ4MFhIUjlJR1ZzYzJVZ2UxeHVYSFJjZEZ4MFhIUmNkSE5sWTNScGIyNHpTV1I0SUQwZ2MyVmpkR2x2YmpOUVlXZHBibUYwYVc5dVRHVnVaM1JvSUMwZ01UdGNibHgwWEhSY2RGeDBmVnh1WEhSY2RGeDBYSFJjYmx4MFhIUmNkRngwSkNnbkxuTmxZM1JwYjI0elVHRm5hVzVoZEc5eVFuVjBkRzl1SnlsYmMyVmpkR2x2YmpOSlpIaGRMbU5zYVdOcktDazdYRzVjZEZ4MFhIUjlYRzVjZEZ4MGZWeHVYSFI5WEc1Y2JpOHZJRWxPU1ZSSlFWUkZJRVpQVWlCVFYwbFFSU0JFUlZSRlExUkpUMDRnVDA0Z1UwVkRWRWxQVGxNZ015QkJUa1FnTkNCRldFTkZVRlFnU1U0Z1FVUk5TVTRnVUZKRlZrbEZWeTRnWEZ4Y1hGeHVYRzVjZEdsbUtDRWtLR3h2WTJGMGFXOXVLUzVoZEhSeUtDZG9jbVZtSnlrdWFXNWpiSFZrWlhNb0oybHVaR1Y0TG5Cb2NDY3BLU0I3WEc1Y2RGeDBaR1YwWldOMGMzZHBjR1VvSjNObFkzUnBiMjQwSnl3Z2MzZHBjR1ZEYjI1MGNtOXNiR1Z5S1R0Y2JseDBYSFJrWlhSbFkzUnpkMmx3WlNnbmMyVmpkR2x2YmpNbkxDQnpkMmx3WlVOdmJuUnliMnhzWlhJcE8xeHVYSFI5WEc1OUtUc2lYWDA9XG59KS5jYWxsKHRoaXMscmVxdWlyZShcIkZUNU9Sc1wiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL2Zha2VfZTRkOTkwNzUuanNcIixcIi9cIikiXX0=
