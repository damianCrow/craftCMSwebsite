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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZha2VfOGI2Zjg5MTguanMiXSwibmFtZXMiOlsidGltZSIsInNlY3Rpb24zSWR4Iiwic2VjdGlvbjRJZHgiLCJtYXN0ZXJPYmoiLCJzZWN0aW9uMkN1cnJlbnRJZHgiLCJzZWN0aW9uMUN1cnJlbnRJZHgiLCJzZWN0aW9uMyIsImF1dG9tYXRlIiwiaXNBdXRvbWF0ZWQiLCJzZWN0aW9uNCIsImJhc2tldGJhbGwiLCJsb29wQW1vdW50IiwiZm9vdGJhbGwiLCJ0ZW5uaXMiLCJiYXNlYmFsbCIsImZhbiIsImhvbWVwYWdlTW9iSW1hZ2VzIiwiJCIsImRvY3VtZW50IiwicmVhZHkiLCJ3aW5kb3ciLCJpbm5lcldpZHRoIiwiZmV0Y2giLCJ0aGVuIiwicmVzcG9uc2UiLCJqc29uIiwic3ByaXRlT2JqIiwiSWRsZUZyYW1lIiwiZmlsdGVyQnlWYWx1ZSIsImZyYW1lcyIsImFuaW1hdGlvbkFycmF5IiwiYW5pbWF0b3JTZXR1cCIsImltYWdlQ29udHJvbGVyIiwic2V0SW50ZXJ2YWwiLCJhcnJheSIsInN0cmluZyIsImZpbHRlciIsIm8iLCJ0b0xvd2VyQ2FzZSIsImluY2x1ZGVzIiwibGFzdFRpbWUiLCJ2ZW5kb3JzIiwieCIsImxlbmd0aCIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwiY2FsbGJhY2siLCJlbGVtZW50IiwiY3VyclRpbWUiLCJEYXRlIiwiZ2V0VGltZSIsInRpbWVUb0NhbGwiLCJNYXRoIiwibWF4IiwiaWQiLCJzZXRUaW1lb3V0IiwiY2xlYXJUaW1lb3V0IiwiYW5pbWF0b3IiLCJhbmltYXRpb25PYmoiLCJkYW5jaW5nSWNvbiIsInNwcml0ZUltYWdlIiwiY2FudmFzIiwiZ2FtZUxvb3AiLCJhZGRDbGFzcyIsImxvb3BJZCIsInVwZGF0ZSIsInJlbmRlciIsInNwcml0ZSIsIm9wdGlvbnMiLCJ0aGF0IiwiZnJhbWVJbmRleCIsInRpY2tDb3VudCIsImxvb3BDb3VudCIsInRpY2tzUGVyRnJhbWUiLCJudW1iZXJPZkZyYW1lcyIsImNvbnRleHQiLCJ3aWR0aCIsImhlaWdodCIsImltYWdlIiwibG9vcHMiLCJjbGVhclJlY3QiLCJkcmF3SW1hZ2UiLCJmcmFtZSIsInkiLCJnZXRFbGVtZW50QnlJZCIsIkltYWdlIiwiZ2V0Q29udGV4dCIsImFkZEV2ZW50TGlzdGVuZXIiLCJzcmMiLCJwYWdlTG9hZGVyIiwiaW5kZXgiLCJyZW1vdmVDbGFzcyIsImZpbmQiLCJnZXQiLCJjbGljayIsImluaXRpYWxpemVTZWN0aW9uIiwic2VjdGlvbk51bWJlciIsImlkeCIsInNpYmxpbmdzIiwibWFwIiwiaXgiLCJlbGUiLCJjc3MiLCJvcGFjaXR5IiwiaWR4T2JqIiwicmVsZXZhbnRBbmltYXRpb24iLCJoYW5kbGVQYW5pbmF0aW9uQnV0dG9uQ2xpY2siLCJlIiwicGFyc2VJbnQiLCJ0YXJnZXQiLCJhdHRyIiwic2VjdGlvbklkIiwiY2xvc2VzdCIsInJlbGV2YW50RGF0YUFycmF5Iiwib24iLCJlcyIsImN1cnJlbnRUYXJnZXQiLCJpbnRlcnZhbE1hbmFnZXIiLCJoYXNDbGFzcyIsImxvY2F0aW9uIiwib25lcGFnZV9zY3JvbGwiLCJzZWN0aW9uQ29udGFpbmVyIiwiZWFzaW5nIiwiYW5pbWF0aW9uVGltZSIsInBhZ2luYXRpb24iLCJ1cGRhdGVVUkwiLCJiZWZvcmVNb3ZlIiwiYWZ0ZXJNb3ZlIiwibG9vcCIsImtleWJvYXJkIiwicmVzcG9uc2l2ZUZhbGxiYWNrIiwiZGlyZWN0aW9uIiwibW92ZVRvIiwiY3VycmVudFNlY3Rpb24iLCJzZWN0aW9uIiwib2Zmc2V0IiwidG9wIiwibW92ZURvd24iLCJoaWRlTG9hZGluZ0FuaW1hdGlvbiIsInJlYWR5U3RhdGUiLCJmbGFnIiwic3dpcGVDb250cm9sbGVyIiwiY2xlYXJJbnRlcnZhbCIsInBsYXkiLCJ0aW1lb3V0IiwicGF1c2UiLCJpbm5lckhlaWdodCIsIm1hdGNoTWVkaWEiLCJtYXRjaGVzIiwicGFnZUlkeCIsImJ1cmdlciIsImNsYXNzTGlzdCIsImNvbnRhaW5zIiwibmF2IiwicmVtb3ZlIiwiYm9keSIsInN0eWxlIiwicG9zaXRpb24iLCJzdG9wUHJvcGFnYXRpb24iLCJuYXZDb250cm9sIiwiYWRkIiwiZGV0ZWN0c3dpcGUiLCJlbCIsImZ1bmMiLCJzd2lwZV9kZXQiLCJzWCIsInNZIiwiZVgiLCJlWSIsIm1pbl94IiwibWF4X3giLCJtaW5feSIsIm1heF95IiwiZGlyZWMiLCJ0IiwidG91Y2hlcyIsInNjcmVlblgiLCJzY3JlZW5ZIiwicHJldmVudERlZmF1bHQiLCJkIiwic2VjdGlvbjRQYWdpbmF0aW9uTGVuZ3RoIiwic2VjdGlvbjNQYWdpbmF0aW9uTGVuZ3RoIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsSUFBTUEsT0FBTyxHQUFiO0FBQ0EsSUFBSUMsY0FBYyxDQUFsQjtBQUNBLElBQUlDLGNBQWMsQ0FBbEI7O0FBRUEsSUFBTUMsWUFBWTtBQUNqQkMscUJBQW9CLENBREg7QUFFakJDLHFCQUFvQixDQUZIO0FBR2pCQyxXQUFVO0FBQ1RDLFlBQVUsRUFERDtBQUVUQyxlQUFhO0FBRkosRUFITztBQU9qQkMsV0FBVTtBQUNURixZQUFVLEVBREQ7QUFFVEMsZUFBYTtBQUZKLEVBUE87QUFXakJFLGFBQVksRUFBQ0MsWUFBWSxDQUFiLEVBWEs7QUFZakJDLFdBQVUsRUFBQ0QsWUFBWSxDQUFiLEVBWk87QUFhakJFLFNBQVEsRUFBQ0YsWUFBWSxDQUFiLEVBYlM7QUFjakJHLFdBQVUsRUFBQ0gsWUFBWSxDQUFiLEVBZE87QUFlakJJLE1BQUssRUFBQ0osWUFBWSxDQUFiO0FBZlksQ0FBbEI7O0FBa0JBLElBQU1LLG9CQUFvQixDQUN6QiwwQ0FEeUIsRUFFekIsd0NBRnlCLEVBR3pCLHNDQUh5QixFQUl6Qix3Q0FKeUIsRUFLekIsbUNBTHlCLENBQTFCOztBQVFBQyxFQUFFQyxRQUFGLEVBQVlDLEtBQVosQ0FBa0IsWUFBTTtBQUN2QixLQUFHQyxPQUFPQyxVQUFQLEdBQW9CLEdBQXZCLEVBQTRCO0FBQzdCO0FBQ0VDLFFBQU0sdUNBQU4sRUFBK0NDLElBQS9D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ZixXQUE5QixFQUEyQzRGLEtBQTNDO0FBQ0E7QUFDRCxPQUFHcUYsTUFBTSxHQUFULEVBQWM7O0FBRWIsUUFBR2pMLGNBQWMsQ0FBakIsRUFBb0I7QUFDbkJBO0FBQ0EsS0FGRCxNQUVPO0FBQ05BLG1CQUFja0wsMkJBQTJCLENBQXpDO0FBQ0E7O0FBRURuSyxNQUFFLDBCQUFGLEVBQThCZixXQUE5QixFQUEyQzRGLEtBQTNDO0FBQ0E7QUFDRDtBQUNELE1BQUdvRSxPQUFPLFVBQVYsRUFBc0I7O0FBRXJCLE9BQU1tQiwyQkFBMkJwSyxFQUFFLDBCQUFGLEVBQThCMEIsTUFBL0Q7O0FBRUEsT0FBR3dJLE1BQU0sR0FBVCxFQUFjOztBQUViLFFBQUdsTCxjQUFjb0wsMkJBQTJCLENBQTVDLEVBQStDO0FBQzlDcEw7QUFDQSxLQUZELE1BRU87QUFDTkEsbUJBQWMsQ0FBZDtBQUNBOztBQUVEZ0IsTUFBRSwwQkFBRixFQUE4QmhCLFdBQTlCLEVBQTJDNkYsS0FBM0M7QUFDQTtBQUNELE9BQUdxRixNQUFNLEdBQVQsRUFBYzs7QUFFYixRQUFHbEwsY0FBYyxDQUFqQixFQUFvQjtBQUNuQkE7QUFDQSxLQUZELE1BRU87QUFDTkEsbUJBQWNvTCwyQkFBMkIsQ0FBekM7QUFDQTs7QUFFRHBLLE1BQUUsMEJBQUYsRUFBOEJoQixXQUE5QixFQUEyQzZGLEtBQTNDO0FBQ0E7QUFDRDtBQUNELEVBcEREOztBQXNERDs7QUFFQyxLQUFHLENBQUM3RSxFQUFFc0csUUFBRixFQUFZVCxJQUFaLENBQWlCLE1BQWpCLEVBQXlCdkUsUUFBekIsQ0FBa0MsV0FBbEMsQ0FBSixFQUFvRDtBQUNuRDBILGNBQVksVUFBWixFQUF3QnBCLGVBQXhCO0FBQ0FvQixjQUFZLFVBQVosRUFBd0JwQixlQUF4QjtBQUNBO0FBQ0QsQ0E5bUJEIiwiZmlsZSI6ImZha2VfOGI2Zjg5MTguanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCB0aW1lID0gNzUwO1xubGV0IHNlY3Rpb24zSWR4ID0gMDtcbmxldCBzZWN0aW9uNElkeCA9IDA7XG5cbmNvbnN0IG1hc3Rlck9iaiA9IHtcblx0c2VjdGlvbjJDdXJyZW50SWR4OiAwLCBcblx0c2VjdGlvbjFDdXJyZW50SWR4OiAwLFxuXHRzZWN0aW9uMzoge1xuXHRcdGF1dG9tYXRlOiAnJyxcblx0XHRpc0F1dG9tYXRlZDogZmFsc2Vcblx0fSxcblx0c2VjdGlvbjQ6IHtcblx0XHRhdXRvbWF0ZTogJycsXG5cdFx0aXNBdXRvbWF0ZWQ6IGZhbHNlXG5cdH0sXG5cdGJhc2tldGJhbGw6IHtsb29wQW1vdW50OiAxfSxcblx0Zm9vdGJhbGw6IHtsb29wQW1vdW50OiAxfSxcblx0dGVubmlzOiB7bG9vcEFtb3VudDogMX0sXG5cdGJhc2ViYWxsOiB7bG9vcEFtb3VudDogMX0sXG5cdGZhbjoge2xvb3BBbW91bnQ6IDF9XG59O1xuXG5jb25zdCBob21lcGFnZU1vYkltYWdlcyA9IFtcblx0J2Fzc2V0cy9pbWFnZXMvaG9tZXBhZ2VNb2IvYmFza2V0YmFsbC5qcGcnLFxuXHQnYXNzZXRzL2ltYWdlcy9ob21lcGFnZU1vYi9mb290YmFsbC5qcGcnLFxuXHQnYXNzZXRzL2ltYWdlcy9ob21lcGFnZU1vYi90ZW5uaXMuanBnJywgXG5cdCdhc3NldHMvaW1hZ2VzL2hvbWVwYWdlTW9iL2Jhc2ViYWxsLmpwZycsIFxuXHQnYXNzZXRzL2ltYWdlcy9ob21lcGFnZU1vYi9mYW4uanBnJyBcbl1cblxuJChkb2N1bWVudCkucmVhZHkoKCkgPT4ge1xuXHRpZih3aW5kb3cuaW5uZXJXaWR0aCA8IDgwMCkge1xuLy8gSUYgVEhFIFdJTkRPVyBJUyBTTUFMTEVSIFRIQVQgODAwUFggRkVUQ0ggVEhFIEpTT04gRk9SIFRIRSBJQ09OIEFOSU1BVElPTiBBTkQgQVRBQ0ggVEhFIEFOSU1BVElPTlMgU0VQRVJBVEVMWSBUTyBtYXN0ZXJPYmogXFxcXFxuXHRcdGZldGNoKCdhc3NldHMvanMvRmFudGFzdGVjX1Nwcml0ZV9TaGVldC5qc29uJykudGhlbihmdW5jdGlvbihyZXNwb25zZSkgeyBcblx0XHRcdHJldHVybiByZXNwb25zZS5qc29uKCk7XG5cdFx0fSkudGhlbihmdW5jdGlvbihzcHJpdGVPYmopIHtcblx0XHRcdGNvbnN0IElkbGVGcmFtZSA9IGZpbHRlckJ5VmFsdWUoc3ByaXRlT2JqLmZyYW1lcywgJ2lkbGUnKTtcblx0XHRcdG1hc3Rlck9iai5mb290YmFsbC5hbmltYXRpb25BcnJheSA9IFsuLi5JZGxlRnJhbWUsIC4uLmZpbHRlckJ5VmFsdWUoc3ByaXRlT2JqLmZyYW1lcywgJ2Zvb3RiYWxsJyldO1xuXHRcdFx0bWFzdGVyT2JqLnRlbm5pcy5hbmltYXRpb25BcnJheSA9IFsuLi5JZGxlRnJhbWUsIC4uLmZpbHRlckJ5VmFsdWUoc3ByaXRlT2JqLmZyYW1lcywgJ3Rlbm5pcycpXTtcblx0XHRcdG1hc3Rlck9iai5iYXNlYmFsbC5hbmltYXRpb25BcnJheSA9IFsuLi5JZGxlRnJhbWUsIC4uLmZpbHRlckJ5VmFsdWUoc3ByaXRlT2JqLmZyYW1lcywgJ2Jhc2ViYWxsJyldO1xuXHRcdFx0bWFzdGVyT2JqLmJhc2tldGJhbGwuYW5pbWF0aW9uQXJyYXkgPSBbLi4uSWRsZUZyYW1lLCAuLi5maWx0ZXJCeVZhbHVlKHNwcml0ZU9iai5mcmFtZXMsICdiYXNrZXQnKV07XG5cdFx0XHRtYXN0ZXJPYmouZmFuLmFuaW1hdGlvbkFycmF5ID0gWy4uLklkbGVGcmFtZSwgLi4uZmlsdGVyQnlWYWx1ZShzcHJpdGVPYmouZnJhbWVzLCAnZmFuJyldO1xuLy8gQ0FMTCBBTklNQVRPUiBTRVRVUCBGVU5DVElPTiBBTkQgU1RBUlQgVEhFIElNQUdFIFNMSURFU0hPVyBGT1IgU0VDVElPTiAxIChIT01FUEFHRSkgXFxcXFx0XHRcdFxuXHRcdFx0YW5pbWF0b3JTZXR1cCgpO1xuXHRcdFx0aW1hZ2VDb250cm9sZXIobWFzdGVyT2JqLCAxKTtcbi8vIENBTEwgVEhFIGltYWdlQ29udHJvbGVyIEZVTkNUSU9OIEVWRVJZIDUgU0VDT05EUyBUTyBDSEFOR0UgVEhFIElNQUdFIEZPUiBTRUNUSU9OIDEgKEhPTUVQQUdFKSBcXFxcXG5cdFx0XHRzZXRJbnRlcnZhbCgoKSA9PiB7XG5cdFx0XHRcdGltYWdlQ29udHJvbGVyKG1hc3Rlck9iaiwgMSk7XG5cdFx0XHR9LCA1MDAwKTtcblx0XHR9KTtcblx0fVxuLy8gRlVOQ1RJT04gVE8gU0VQRVJBVEUgVEhFIEFOSU1BVElPTiBGUkFNRVMgQlkgTkFNRSBcXFxcXG5cdGNvbnN0IGZpbHRlckJ5VmFsdWUgPSAoYXJyYXksIHN0cmluZykgPT4ge1xuICAgIHJldHVybiBhcnJheS5maWx0ZXIobyA9PiB0eXBlb2Ygb1snZmlsZW5hbWUnXSA9PT0gJ3N0cmluZycgJiYgb1snZmlsZW5hbWUnXS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHN0cmluZy50b0xvd2VyQ2FzZSgpKSk7XG5cdH1cbi8vIEdFTkVSSUMgU0VUVVAgRlVOQ1RJT04gRk9SIEFERElORyBWRU5ET1IgUFJFRklYRVMgVE8gcmVxdWVzdEFuaW1hdGlvbkZyYW1lIFxcXFxcblx0Y29uc3QgYW5pbWF0b3JTZXR1cCA9ICgpID0+IHtcblx0XHRcdFxuICAgIHZhciBsYXN0VGltZSA9IDA7XG4gICAgdmFyIHZlbmRvcnMgPSBbJ21zJywgJ21veicsICd3ZWJraXQnLCAnbyddO1xuICAgIGZvcih2YXIgeCA9IDA7IHggPCB2ZW5kb3JzLmxlbmd0aCAmJiAhd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZTsgKyt4KSB7XG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gd2luZG93W3ZlbmRvcnNbeF0rJ1JlcXVlc3RBbmltYXRpb25GcmFtZSddO1xuICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gd2luZG93W3ZlbmRvcnNbeF0rJ0NhbmNlbEFuaW1hdGlvbkZyYW1lJ10gfHwgd2luZG93W3ZlbmRvcnNbeF0rJ0NhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZSddO1xuICAgIH1cbiBcbiAgICBpZiAoIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpXG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24oY2FsbGJhY2ssIGVsZW1lbnQpIHtcbiAgICAgICAgdmFyIGN1cnJUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgIHZhciB0aW1lVG9DYWxsID0gTWF0aC5tYXgoMCwgMTYgLSAoY3VyclRpbWUgLSBsYXN0VGltZSkpO1xuICAgICAgICB2YXIgaWQgPSB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHsgY2FsbGJhY2soY3VyclRpbWUgKyB0aW1lVG9DYWxsKTsgfSwgXG4gICAgICAgICAgdGltZVRvQ2FsbCk7XG4gICAgICAgIGxhc3RUaW1lID0gY3VyclRpbWUgKyB0aW1lVG9DYWxsO1xuICAgICAgICByZXR1cm4gaWQ7XG4gICAgICB9O1xuIFxuICAgIGlmICghd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKVxuICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uKGlkKSB7XG4gICAgICBjbGVhclRpbWVvdXQoaWQpO1xuICAgIH07XG5cdH1cblxuXG5cdGNvbnN0IGFuaW1hdG9yID0gKGFuaW1hdGlvbk9iaikgPT4ge1xuXHRcdFx0XHRcdFx0XG5cdFx0dmFyIGRhbmNpbmdJY29uLFxuXHRcdFx0c3ByaXRlSW1hZ2UsXG5cdFx0XHRjYW52YXM7XHRcdFx0XHRcdFxuLy8gRlVOQ1RJT04gVE8gUEFTUyBUTyByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgXFxcXFxuXHRcdGZ1bmN0aW9uIGdhbWVMb29wICgpIHtcblx0XHQgICQoJyNsb2FkaW5nJykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuXHRcdCAgYW5pbWF0aW9uT2JqLmxvb3BJZCA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZ2FtZUxvb3ApO1xuXHRcdCAgZGFuY2luZ0ljb24udXBkYXRlKCk7XG5cdFx0ICBkYW5jaW5nSWNvbi5yZW5kZXIoKTtcblx0XHR9XG5cdFx0XG5cdFx0ZnVuY3Rpb24gc3ByaXRlIChvcHRpb25zKSB7XG5cdFx0XG5cdFx0XHR2YXIgdGhhdCA9IHt9LFxuXHRcdFx0XHRmcmFtZUluZGV4ID0gMCxcblx0XHRcdFx0dGlja0NvdW50ID0gMCxcblx0XHRcdFx0bG9vcENvdW50ID0gMCxcblx0XHRcdFx0dGlja3NQZXJGcmFtZSA9IG9wdGlvbnMudGlja3NQZXJGcmFtZSB8fCAwLFxuXHRcdFx0XHRudW1iZXJPZkZyYW1lcyA9IG9wdGlvbnMubnVtYmVyT2ZGcmFtZXMgfHwgMTtcblx0XHRcdFxuXHRcdFx0dGhhdC5jb250ZXh0ID0gb3B0aW9ucy5jb250ZXh0O1xuXHRcdFx0dGhhdC53aWR0aCA9IG9wdGlvbnMud2lkdGg7XG5cdFx0XHR0aGF0LmhlaWdodCA9IG9wdGlvbnMuaGVpZ2h0O1xuXHRcdFx0dGhhdC5pbWFnZSA9IG9wdGlvbnMuaW1hZ2U7XG5cdFx0XHR0aGF0Lmxvb3BzID0gb3B0aW9ucy5sb29wcztcblx0XHRcdFxuXHRcdFx0dGhhdC51cGRhdGUgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgdGlja0NvdW50ICs9IDE7XG5cbiAgICAgICAgaWYgKHRpY2tDb3VudCA+IHRpY2tzUGVyRnJhbWUpIHtcblxuXHRcdFx0XHRcdHRpY2tDb3VudCA9IDA7XG4gICAgICAgICAgLy8gSWYgdGhlIGN1cnJlbnQgZnJhbWUgaW5kZXggaXMgaW4gcmFuZ2VcbiAgICAgICAgICBpZiAoZnJhbWVJbmRleCA8IG51bWJlck9mRnJhbWVzIC0gMSkge1x0XG4gICAgICAgICAgLy8gR28gdG8gdGhlIG5leHQgZnJhbWVcbiAgICAgICAgICAgIGZyYW1lSW5kZXggKz0gMTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICBcdFx0bG9vcENvdW50KytcbiAgICAgICAgICAgIGZyYW1lSW5kZXggPSAwO1xuXG4gICAgICAgICAgICBpZihsb29wQ291bnQgPT09IHRoYXQubG9vcHMpIHtcbiAgICAgICAgICAgIFx0d2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKGFuaW1hdGlvbk9iai5sb29wSWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblx0ICAgICAgfVxuXHQgICAgfVxuXHRcdFx0XG5cdFx0XHR0aGF0LnJlbmRlciA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFxuXHRcdFx0ICAvLyBDbGVhciB0aGUgY2FudmFzXG5cdFx0XHQgIHRoYXQuY29udGV4dC5jbGVhclJlY3QoMCwgMCwgdGhhdC53aWR0aCwgdGhhdC5oZWlnaHQpO1xuXHRcdFx0ICBcblx0XHRcdCAgdGhhdC5jb250ZXh0LmRyYXdJbWFnZShcblx0XHRcdCAgICB0aGF0LmltYWdlLFxuXHRcdFx0ICAgIGFuaW1hdGlvbk9iai5hbmltYXRpb25BcnJheVtmcmFtZUluZGV4XS5mcmFtZS54LFxuXHRcdFx0ICAgIGFuaW1hdGlvbk9iai5hbmltYXRpb25BcnJheVtmcmFtZUluZGV4XS5mcmFtZS55LFxuXHRcdFx0ICAgIDIwMCxcblx0XHRcdCAgICAxNzUsXG5cdFx0XHQgICAgMCxcblx0XHRcdCAgICAwLFxuXHRcdFx0ICAgIHdpbmRvdy5pbm5lcldpZHRoIC8gMy44NDYsXG5cdFx0XHQgICAgd2luZG93LmlubmVyV2lkdGggLyA0LjEpXG5cdFx0XHR9O1xuXHRcdFx0XG5cdFx0XHRyZXR1cm4gdGhhdDtcblx0XHR9XG5cdFx0XG5cdFx0Ly8gR2V0IGNhbnZhc1xuXHRcdGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMnKTtcblx0XHRjYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aCAvIDMuODQ2O1xuXHRcdGNhbnZhcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJXaWR0aCAvIDIuMjtcblx0XHRcblx0XHQvLyBDcmVhdGUgc3ByaXRlIHNoZWV0XG5cdFx0c3ByaXRlSW1hZ2UgPSBuZXcgSW1hZ2UoKTtcdFxuXHRcdFxuXHRcdC8vIENyZWF0ZSBzcHJpdGVcblx0XHRkYW5jaW5nSWNvbiA9IHNwcml0ZSh7XG5cdFx0XHRjb250ZXh0OiBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpLFxuXHRcdFx0d2lkdGg6IDQwNDAsXG5cdFx0XHRoZWlnaHQ6IDE3NzAsXG5cdFx0XHRpbWFnZTogc3ByaXRlSW1hZ2UsXG5cdFx0XHRudW1iZXJPZkZyYW1lczogYW5pbWF0aW9uT2JqLmFuaW1hdGlvbkFycmF5Lmxlbmd0aCxcblx0XHRcdHRpY2tzUGVyRnJhbWU6IDQsXG5cdFx0XHRsb29wczogYW5pbWF0aW9uT2JqLmxvb3BBbW91bnRcblx0XHR9KTtcblx0XHRcblx0XHQvLyBMb2FkIHNwcml0ZSBzaGVldFxuXHRcdHNwcml0ZUltYWdlLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGdhbWVMb29wKTtcblx0XHRzcHJpdGVJbWFnZS5zcmMgPSAnYXNzZXRzL2ltYWdlcy9GYW50YXN0ZWNfU3ByaXRlX1NoZWV0LnBuZyc7XG5cdH0gXG5cbi8vIElOSVRJQUxJU0UgQU5EIFNFVFVQIENVUlJFTlQgUEFHRS4gRVhFQ1VURSBUUkFOU0lUSU9OUyBBTkQgUkVNT1ZFIFRJTlQgSUYgUkVMRVZBTlQgXFxcXFxuXG5cdGNvbnN0XHRwYWdlTG9hZGVyID0gKGluZGV4KSA9PiB7XG5cdFx0aWYoaW5kZXggPT09IDUpIHtcblx0XHRcdCQoJy50aW50JykucmVtb3ZlQ2xhc3MoJ3JlbW92ZVRpbnQnKTtcblx0XHRcdCQoJy5iYWNrZ3JvdW5kV3JhcHBlcicpLnJlbW92ZUNsYXNzKCdzY2FsZUJhY2tncm91bmQnKTtcblx0XHRcdCQoJyNzZWN0aW9uNScpLmZpbmQoJy5oZWFkaW5nJykuYWRkQ2xhc3MoJ3Nob3cgZmFkZUluJyk7XG5cdFx0XHQkKCcuc3ViU2VjdGlvbicpLmFkZENsYXNzKCdzY2FsZUJhY2tncm91bmQnKTtcblx0XHRcdCQoJy5zdWJTZWN0aW9uJykuZmluZCgnLnRpbnQnKS5hZGRDbGFzcygncmVtb3ZlVGludCcpO1xuXHRcdFx0JCgnI3NlY3Rpb241JykuZmluZCgnLnRleHRXcmFwcGVyJykuYWRkQ2xhc3MoJ3Nob3cnKTtcblx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHQkKCcuc3ViU2VjdGlvbiA+IC50ZXh0V3JhcHBlcicpLmZpbmQoJy5oZWFkaW5nJykuYWRkQ2xhc3MoJ2ZhZGVJbicpO1xuXHRcdFx0fSwgMTAwMCk7XG5cdFx0fSBcblx0XHRlbHNlIHtcblx0XHRcdCQoJy50aW50JykucmVtb3ZlQ2xhc3MoJ3JlbW92ZVRpbnQnKTtcblx0XHRcdCQoJy5zdWJTZWN0aW9uJykucmVtb3ZlQ2xhc3MoJ3NjYWxlQmFja2dyb3VuZCcpO1xuXHRcdFx0JChgLmJhY2tncm91bmRXcmFwcGVyOm5vdCgjc2VjdGlvbiR7aW5kZXh9QmFja2dyb3VuZClgKS5yZW1vdmVDbGFzcygnc2NhbGVCYWNrZ3JvdW5kJyk7XG5cdFx0XHQkKGAuc2VjdGlvbi5hY3RpdmVgKS5maW5kKGAuYmFja2dyb3VuZFdyYXBwZXJgKS5hZGRDbGFzcygnc2NhbGVCYWNrZ3JvdW5kJyk7XG5cdFx0XHQkKGBzZWN0aW9uLmFjdGl2ZWApLmZpbmQoJy50aW50JykuYWRkQ2xhc3MoJ3JlbW92ZVRpbnQnKTtcblxuXHRcdFx0aWYoJChgLnNlY3Rpb24ke2luZGV4fVBhZ2luYXRvckJ1dHRvbmApLmxlbmd0aCAmJiAkKGAuc2VjdGlvbiR7aW5kZXh9UGFnaW5hdG9yQnV0dG9uLmFjdGl2ZWApLmxlbmd0aCA8IDEpIHtcblx0XHRcdFx0JChgLnNlY3Rpb24ke2luZGV4fVBhZ2luYXRvckJ1dHRvbmApLmdldCgwKS5jbGljaygpO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuLy8gSElERSBBTEwgQkVDS0dST1VORFMgSU4gVEhFIFNFQ1RJT04gRVhDRVBUIFRIRSBTUEVDSUZJRUQgSU5ERVgsIFdISUNIIElTIFNDQUxFRCBBTkQgU0hPV04uIFxcXFxcblxuXHRjb25zdCBpbml0aWFsaXplU2VjdGlvbiA9IChzZWN0aW9uTnVtYmVyLCBpZHgpID0+IHtcblx0XHQkKGAjc2VjdGlvbiR7c2VjdGlvbk51bWJlcn1CYWNrZ3JvdW5kJHtpZHh9YCkuc2libGluZ3MoJy5iYWNrZ3JvdW5kV3JhcHBlcicpLm1hcCgoaXgsIGVsZSkgPT4ge1xuXHRcdFx0JChlbGUpLmNzcyh7b3BhY2l0eTogMH0pO1xuXHRcdH0pO1xuXG5cdFx0JChgI3NlY3Rpb24ke3NlY3Rpb25OdW1iZXJ9QmFja2dyb3VuZCR7aWR4fWApLmNzcyh7XG5cdFx0XHQndHJhbnNmb3JtJzogJ3NjYWxlKDEuMSknLFxuXHRcdFx0J29wYWNpdHknOiAxXG5cdFx0fSk7XG5cdH07XG5cbi8vIENBTEwgaW5pdGlhbGl6ZVNlY3Rpb24gT04gU0VDVElPTlMgMSwgMyBBTkQgNC4gXFxcXFxuXHRpbml0aWFsaXplU2VjdGlvbigxLCAwKTtcblx0aW5pdGlhbGl6ZVNlY3Rpb24oMywgMCk7XG5cdGluaXRpYWxpemVTZWN0aW9uKDQsIDApO1xuXG4vLyBCQUNLR1JPVU5EIElNQUdFIFRSQU5TSVRJT04gSEFORExFUi4gXFxcXFxuXG5cdGNvbnN0IGltYWdlQ29udHJvbGVyID0gKGlkeE9iaiwgc2VjdGlvbk51bWJlcikgPT4ge1xuXHRcdGxldCByZWxldmFudEFuaW1hdGlvbjtcblxuXHRcdGlmKHNlY3Rpb25OdW1iZXIgPT09IDEpIHtcblx0XHRcdHN3aXRjaChpZHhPYmouc2VjdGlvbjFDdXJyZW50SWR4KSB7XG5cdFx0XHRcdGNhc2UgMDpcblx0XHRcdFx0XHRyZWxldmFudEFuaW1hdGlvbiA9IG1hc3Rlck9iai5iYXNrZXRiYWxsO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHRcdHJlbGV2YW50QW5pbWF0aW9uID0gbWFzdGVyT2JqLmZvb3RiYWxsO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRcdHJlbGV2YW50QW5pbWF0aW9uID0gbWFzdGVyT2JqLnRlbm5pcztcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgMzpcblx0XHRcdFx0XHRyZWxldmFudEFuaW1hdGlvbiA9IG1hc3Rlck9iai5iYXNlYmFsbDtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgNDpcblx0XHRcdFx0XHRyZWxldmFudEFuaW1hdGlvbiA9IG1hc3Rlck9iai5mYW47XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdCQoYCNzZWN0aW9uJHtzZWN0aW9uTnVtYmVyfWApLmZpbmQoJy50aW50JykucmVtb3ZlQ2xhc3MoJ3JlbW92ZVRpbnQnKTtcblx0XHQkKGAjc2VjdGlvbiR7c2VjdGlvbk51bWJlcn1CYWNrZ3JvdW5kJHtpZHhPYmpbYHNlY3Rpb24ke3NlY3Rpb25OdW1iZXJ9Q3VycmVudElkeGBdfWApLnJlbW92ZUNsYXNzKCdzY2FsZUJhY2tncm91bmQnKTtcblx0XHRpbml0aWFsaXplU2VjdGlvbihzZWN0aW9uTnVtYmVyLCBpZHhPYmpbYHNlY3Rpb24ke3NlY3Rpb25OdW1iZXJ9Q3VycmVudElkeGBdKTtcblx0XHRcblx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdGlmKHNlY3Rpb25OdW1iZXIgPT09IDEpIHtcblx0XHRcdFx0YW5pbWF0b3IocmVsZXZhbnRBbmltYXRpb24pO1xuXHRcdFx0fVxuXG5cdFx0XHQkKGAjc2VjdGlvbiR7c2VjdGlvbk51bWJlcn1gKS5maW5kKGAuYmFja2dyb3VuZFdyYXBwZXJgKS5hZGRDbGFzcygnc2NhbGVCYWNrZ3JvdW5kJyk7XG5cdFx0XHQkKGAjc2VjdGlvbiR7c2VjdGlvbk51bWJlcn1gKS5maW5kKCcudGludCcpLmFkZENsYXNzKCdyZW1vdmVUaW50Jyk7XG5cdFx0fSwgNTAwKTtcblxuXHRcdGlmKGlkeE9ialtgc2VjdGlvbiR7c2VjdGlvbk51bWJlcn1DdXJyZW50SWR4YF0gPT09ICQoYCNzZWN0aW9uJHtzZWN0aW9uTnVtYmVyfWApLmZpbmQoYC5iYWNrZ3JvdW5kV3JhcHBlcmApLmxlbmd0aCAtIDEpIHtcblx0XHRcdGlkeE9ialtgc2VjdGlvbiR7c2VjdGlvbk51bWJlcn1DdXJyZW50SWR4YF0gPSAwO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZHhPYmpbYHNlY3Rpb24ke3NlY3Rpb25OdW1iZXJ9Q3VycmVudElkeGBdICs9IDE7XG5cdFx0fVxuXHR9XG4vLyBTVEFSVCBTTElERVNIT1cgT04gU0VDVElPTiAyIFxcXFxcblx0aW1hZ2VDb250cm9sZXIobWFzdGVyT2JqLCAyKTtcblxuLy8gQ0hBTkdFIFNFQ1RJT04gMiBCQUNLR1JPVU5EIElNQUdFIEVWRVJZIDE1IFNFQ09ORFMgXFxcXFxuXHRzZXRJbnRlcnZhbCgoKSA9PiB7XG5cdFx0aW1hZ2VDb250cm9sZXIobWFzdGVyT2JqLCAyKTtcblx0fSwgMTUwMDApO1xuXG4vLyBQQUdJTkFUSU9OIEJVVFRPTlMgQ0xJQ0sgSEFORExFUiBGT1IgU0VDVElPTlMgMyBBTkQgNC4gXFxcXFxuXG5cdGNvbnN0IGhhbmRsZVBhbmluYXRpb25CdXR0b25DbGljayA9IChlKSA9PiB7XG5cblx0XHRjb25zdCBpZHggPSBwYXJzZUludCgkKGUudGFyZ2V0KS5hdHRyKCdkYXRhLWluZGV4JykpO1xuXHRcdGNvbnN0IHNlY3Rpb25JZCA9ICQoZS50YXJnZXQpLmNsb3Nlc3QoJ3NlY3Rpb24nKS5hdHRyKCdpZCcpO1xuXHRcdGxldCByZWxldmFudERhdGFBcnJheTtcblxuXHRcdGlmKHNlY3Rpb25JZCA9PT0gJ3NlY3Rpb24zJykge1xuXHRcdFx0c2VjdGlvbjNJZHggPSBpZHg7XG5cdFx0fVxuXG5cdFx0aWYoc2VjdGlvbklkID09PSAnc2VjdGlvbjQnKSB7XG5cdFx0XHRzZWN0aW9uNElkeCA9IGlkeDtcblx0XHR9XG5cblx0XHQkKGAjJHtzZWN0aW9uSWR9YCkuZmluZCgnLnRpbnQnKS5yZW1vdmVDbGFzcygncmVtb3ZlVGludCcpO1xuXHRcdCQoYCMke3NlY3Rpb25JZH1gKS5maW5kKCcudGV4dFdyYXBwZXInKS5yZW1vdmVDbGFzcygnc2hvdycpO1xuXHRcdCQoYCMke3NlY3Rpb25JZH1gKS5maW5kKGAjdGV4dFdyYXBwZXIke2lkeH1gKS5hZGRDbGFzcygnc2hvdycpO1xuXHRcdCQoYCMke3NlY3Rpb25JZH1CYWNrZ3JvdW5kJHtpZHh9YCkucmVtb3ZlQ2xhc3MoJ3NjYWxlQmFja2dyb3VuZCcpO1xuXHRcdCQoYC4ke3NlY3Rpb25JZH1QYWdpbmF0b3JCdXR0b25gKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cdFx0JChlLnRhcmdldCkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXG5cdFx0aW5pdGlhbGl6ZVNlY3Rpb24ocGFyc2VJbnQoJChgIyR7c2VjdGlvbklkfWApLmF0dHIoJ2RhdGEtaW5kZXgnKSksIGlkeCk7XG5cblx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdHBhZ2VMb2FkZXIocGFyc2VJbnQoJChgIyR7c2VjdGlvbklkfWApLmF0dHIoJ2RhdGEtaW5kZXgnKSkpO1xuXHRcdH0sIDUwMCk7XG5cblx0XHRpZihzZWN0aW9uSWQgIT09ICdzZWN0aW9uMicpe1xuXHRcdFx0JChgIyR7c2VjdGlvbklkfWApLmZpbmQoJy5oZWFkaW5nLCBwJykuYWRkQ2xhc3MoJ2ZhZGVJbicpO1xuXHRcdFx0JChgIyR7c2VjdGlvbklkfWApLm9uKCd0cmFuc2l0aW9uZW5kIHdlYmtpdFRyYW5zaXRpb25FbmQgb1RyYW5zaXRpb25FbmQnLCAoZXMpID0+IHtcblx0ICAgIFx0JChgIyR7c2VjdGlvbklkfWApLmZpbmQoJy5oZWFkaW5nLCBwJykucmVtb3ZlQ2xhc3MoJ2ZhZGVJbicpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9O1xuXG4vLyBDTElDSyBMSVNURU5FUiBGT1IgUEFHSU5BVElPTiBCVVRUT05TIE9OIFNFQ1RJT05TIDMgQU5EIDQuIFxcXFxcblxuXHQkKCcuc2VjdGlvbjNQYWdpbmF0b3JCdXR0b24sIC5zZWN0aW9uNFBhZ2luYXRvckJ1dHRvbicpLmNsaWNrKChlKSA9PiB7XG5cdFx0XG5cdFx0aWYobWFzdGVyT2JqWyQoZS5jdXJyZW50VGFyZ2V0KS5jbG9zZXN0KCdzZWN0aW9uJykuYXR0cignaWQnKV0uaXNBdXRvbWF0ZWQpIHtcbi8vIElGIFRIRVJFIElTIEEgUklOTklORyBJTlRFUlZBTCBPTiBUSEUgUkVMRVZBTlQgU0VDVElPTiBDTEVBUiBJVCBcXFxcXG5cdFx0XHRpbnRlcnZhbE1hbmFnZXIoZmFsc2UsICQoZS5jdXJyZW50VGFyZ2V0KS5jbG9zZXN0KCdzZWN0aW9uJykuYXR0cignaWQnKSk7XG4vLyBTRVQgQSBORVcgSU5URVJWQUwgT0YgNyBTRUNPTkRTIE9OIFRIRSBTRUNUSU9OIFxcXFxcblx0XHRcdGludGVydmFsTWFuYWdlcih0cnVlLCAkKGUuY3VycmVudFRhcmdldCkuY2xvc2VzdCgnc2VjdGlvbicpLmF0dHIoJ2lkJyksIDcwMDApO1xuXHRcdH1cbi8vIENBTEwgVEhFIENMSUNLIEhBTkRMRVIgRlVOQ1RJT04gQU5EIFBBU1MgSVQgVEhFIEVWRU5UIElGIFRBUkdFVCBJUyBOT1QgQUxSRUFEWSBBQ1RJVkUgXFxcXFxuXHRcdGlmKCEkKGUuY3VycmVudFRhcmdldCkuaGFzQ2xhc3MoJ2FjdGl2ZScpKSB7XG5cdFx0XHRoYW5kbGVQYW5pbmF0aW9uQnV0dG9uQ2xpY2soZSk7XG5cdFx0fVxuXHR9KTtcblxuLy8gSU5JVElBTElaRSBPTkVQQUdFU0NST0xMIElGIE5PVCBJTiBDTVMgUFJFVklFVy4gXFxcXFxuXG5cdGlmKCEkKGxvY2F0aW9uKS5hdHRyKCdocmVmJykuaW5jbHVkZXMoJ2luZGV4LnBocCcpKSB7XG5cdFx0JCgnI3Njcm9sbGVyV3JhcHBlcicpLm9uZXBhZ2Vfc2Nyb2xsKHtcblx0XHRcdHNlY3Rpb25Db250YWluZXI6IFwic2VjdGlvblwiLCAgICBcblx0XHRcdGVhc2luZzogXCJlYXNlLW91dFwiLCAgICAgICAgICAgICAgICAgXG5cdFx0XHRhbmltYXRpb25UaW1lOiB0aW1lLCAgICAgICAgICAgIFxuXHRcdFx0cGFnaW5hdGlvbjogdHJ1ZSwgICAgICAgICAgICAgICBcblx0XHRcdHVwZGF0ZVVSTDogdHJ1ZSwgICAgICAgICAgICAgICBcblx0XHRcdGJlZm9yZU1vdmU6IChpbmRleCkgPT4ge30sIFxuXHRcdFx0YWZ0ZXJNb3ZlOiAoaW5kZXgpID0+IHtcbi8vIElOSVRJQUxJWkUgVEhFIENVUlJFTlQgUEFHRS4gXFxcXFxuXG5cdFx0XHRcdHBhZ2VMb2FkZXIoaW5kZXgpO1xuXHRcdFx0fSwgIFxuXHRcdFx0bG9vcDogZmFsc2UsICAgICAgICAgICAgICAgICAgICBcblx0XHRcdGtleWJvYXJkOiB0cnVlLCAgICAgICAgICAgICAgICAgXG5cdFx0XHRyZXNwb25zaXZlRmFsbGJhY2s6IGZhbHNlLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXHRcdFx0ZGlyZWN0aW9uOiBcInZlcnRpY2FsXCIgICAgICAgICAgXG5cdFx0fSk7XG5cblx0XHQkKCcjc2Nyb2xsZXJXcmFwcGVyJykubW92ZVRvKDEpO1xuXHR9XG5cbi8vIENPTlRST0wgQ0xJQ0tTIE9OIFdPUksgV0lUSCBVUyBTRUNUSU9OIChTRUNUSU9ONSkuIFxcXFxcblxuXHQkKCcuY2xpY2thYmxlJykuY2xpY2soKGUpID0+IHtcblx0XHRsZXQgY3VycmVudFNlY3Rpb24gPSAkKGUudGFyZ2V0KS5jbG9zZXN0KCQoJy5zdWJTZWN0aW9uJykpO1xuXG5cdFx0aWYoY3VycmVudFNlY3Rpb24uaGFzQ2xhc3MoJ29wZW4nKSkge1xuXHRcdFx0Y3VycmVudFNlY3Rpb24ucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcblx0XHRcdGN1cnJlbnRTZWN0aW9uLmZpbmQoJy5idXR0b24sIHAnKS5yZW1vdmVDbGFzcygnZmFkZUluJyk7XG5cdFx0XHRjdXJyZW50U2VjdGlvbi5zaWJsaW5ncygnLnN1YlNlY3Rpb24nKS5tYXAoKGlkeCwgc2VjdGlvbikgPT4ge1xuXHRcdFx0XHQkKHNlY3Rpb24pLnJlbW92ZUNsYXNzKCdjbG9zZWQnKTtcblx0XHRcdFx0JChzZWN0aW9uKS5maW5kKCcudGludCcpLnJlbW92ZUNsYXNzKCdhZGRUaW50JykuYWRkQ2xhc3MoJ3JlbW92ZVRpbnQnKTtcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjdXJyZW50U2VjdGlvbi5yZW1vdmVDbGFzcygnY2xvc2VkJykuYWRkQ2xhc3MoJ29wZW4nKTtcblx0XHRcdGN1cnJlbnRTZWN0aW9uLm9uKCd0cmFuc2l0aW9uZW5kIHdlYmtpdFRyYW5zaXRpb25FbmQgb1RyYW5zaXRpb25FbmQnLCAoZXMpID0+IHtcblx0ICAgIFx0JCgnLnN1YlNlY3Rpb24ub3BlbicpLmZpbmQoJy5idXR0b24sIHAnKS5hZGRDbGFzcygnZmFkZUluJyk7XG5cdFx0XHR9KTtcblx0XHRcdGN1cnJlbnRTZWN0aW9uLnNpYmxpbmdzKCcuc3ViU2VjdGlvbicpLm1hcCgoaWR4LCBzZWN0aW9uKSA9PiB7XG5cdFx0XHRcdCQoc2VjdGlvbikucmVtb3ZlQ2xhc3MoJ29wZW4nKS5hZGRDbGFzcygnY2xvc2VkJyk7XG5cdFx0XHRcdCQoc2VjdGlvbikuZmluZCgnLnRpbnQnKS5yZW1vdmVDbGFzcygncmVtb3ZlVGludCcpLmFkZENsYXNzKCdhZGRUaW50Jyk7XG5cdFx0XHRcdCQoc2VjdGlvbikuZmluZCgnLmJ1dHRvbiwgcCcpLnJlbW92ZUNsYXNzKCdmYWRlSW4nKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRjdXJyZW50U2VjdGlvbi5maW5kKCcudGludCcpLnJlbW92ZUNsYXNzKCdhZGRUaW50JykuYWRkQ2xhc3MoJ3JlbW92ZVRpbnQnKTtcblx0fSk7XG5cbi8vIENPTlRST0wgRk9PVEVSIEFSUk9XIENMSUNLUy4gXFxcXFxuXG5cdCQoJyNkb3duQXJyb3cnKS5jbGljaygoKSA9PiB7XG5cdFx0aWYoJCh3aW5kb3cpLmhlaWdodCgpICogKCQoJy5wYWdlJykubGVuZ3RoIC0gMSkgPT09IC0gJCgnI3Njcm9sbGVyV3JhcHBlcicpLm9mZnNldCgpLnRvcCkge1xuLy8gTU9WRSBUTyBUT1AgT0YgUEFHRSBJRiBDVVJSRU5UTFkgQVQgQk9UVE9NIFxcXFxcblx0ICBcdCQoJyNzY3JvbGxlcldyYXBwZXInKS5tb3ZlVG8oMSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCQoJyNzY3JvbGxlcldyYXBwZXInKS5tb3ZlRG93bigpO1xuXHRcdH1cblx0fSk7XG5cbi8vIEhJREUgVEhFIExPQURJTkcgQU5JTUFUSU9QTiBXSEVOIFZJREVPIElTIFJFQURZIFRPIFBMQVkgT04gREVTWEtUT1AuIFxcXFxcblxuXHRjb25zdCBoaWRlTG9hZGluZ0FuaW1hdGlvbiA9ICgpID0+IHtcblx0XHRpZih3aW5kb3cuaW5uZXJXaWR0aCA+IDgwMCAmJiAhJCgnI2xvYWRpbmcnKS5oYXNDbGFzcygnaGlkZGVuJykpIHtcblxuXHRcdFx0aWYoJCgnI3ZpZGVvJykuZ2V0KDApLnJlYWR5U3RhdGUgPT09IDQpIHtcblx0XHRcdFx0JCgnI2xvYWRpbmcnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cbi8vIE1BTkFHRU1FTlQgRlVOQ1RJT04gRk9SIFNFVFRJTkcgQU5EIENMRUFSSU5HIFRIRSBTTElERSBBVVRPTUFUSU9OIElOVEVSVkFMUy4gXFxcXFxuXG5cdGNvbnN0IGludGVydmFsTWFuYWdlciA9IChmbGFnLCBzZWN0aW9uSWQsIHRpbWUpID0+IHtcbiAgIFx0aWYoZmxhZykge1xuIFx0XHRcdG1hc3Rlck9ialtzZWN0aW9uSWRdLmF1dG9tYXRlID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICBcdFx0c3dpcGVDb250cm9sbGVyKHNlY3Rpb25JZCwgJ2wnKTtcdFxuICAgICBcdH0sIHRpbWUpOyBcbiAgIFx0fSBlbHNlIHtcdFx0XG4gICAgXHRjbGVhckludGVydmFsKG1hc3Rlck9ialtzZWN0aW9uSWRdLmF1dG9tYXRlKTtcbiAgIFx0fVxuXHR9O1xuXG4vLyBJRiBOT1QgSU4gQ01TIEFETUlOIFBSRVZJRVcsIFBFUlBFVFVBTExZIENIRUNLIElGIFdFIEFSRSBBVCBUSEUgVE9QIE9GIFRIRSBQQUdFIEFORCBJRiBTTywgRE9OVCBTSE9XIFRIRSBGT09URVIgT1IgR1JFRU4gU0hBUEUuIFxcXFxcblxuXHRpZighJChsb2NhdGlvbikuYXR0cignaHJlZicpLmluY2x1ZGVzKCdpbmRleC5waHAnKSkge1xuXHRcdHNldEludGVydmFsKCgpID0+IHtcblx0XHRcdGlmKCQoJyNzY3JvbGxlcldyYXBwZXInKS5vZmZzZXQoKS50b3AgPj0gMCkge1xuXHRcdFx0XHQkKCcjaGVhZGVyU2hhcGUsICNmb290ZXInKS5hZGRDbGFzcygnbW92ZU9mZlNjcmVlbicpO1xuXHRcdFx0XHQkKCcjdmlkZW8nKS5nZXQoMCkucGxheSgpO1xuXHRcdFx0XHQkKCcuYXJyb3cnKS5hZGRDbGFzcygncHVsc2F0ZScpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dmFyIHRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0XHQkKCcjaGVhZGVyU2hhcGUsICNmb290ZXInKS5yZW1vdmVDbGFzcygnbW92ZU9mZlNjcmVlbicpO1xuXHRcdFx0XHRcdCQoJyN2aWRlbycpLmdldCgwKS5wYXVzZSgpO1xuXHRcdFx0XHRcdCQoJy5hcnJvdycpLnJlbW92ZUNsYXNzKCdwdWxzYXRlJyk7XG5cdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuXHRcdFx0XHR9LCB0aW1lKTtcblx0XHRcdH1cblxuLy8gUk9UQVRFIFRIRSBBUlJPVyBJTiBUSEUgRk9PVEVSIFdIRU4gQVQgVEhFIEJPVFRPTSBPRiBUSEUgUEFHRSBcXFxcXG5cblx0XHRcdGlmKCQoJyNzY3JvbGxlcldyYXBwZXInKS5vZmZzZXQoKS50b3AgPCAtICh3aW5kb3cuaW5uZXJIZWlnaHQgKiA0KSkge1xuXHRcdFx0XHQkKCcjZG93bkFycm93JykuY3NzKHsndHJhbnNmb3JtJzogJ3JvdGF0ZSgxODBkZWcpIHRyYW5zbGF0ZVgoLTUwJSknfSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkKCcjZG93bkFycm93JykuY3NzKHsndHJhbnNmb3JtJzogJ3RyYW5zbGF0ZVgoLTUwJSkgcm90YXRlKDBkZWcpJ30pO1xuXHRcdFx0fVxuXG5cdFx0XHRoaWRlTG9hZGluZ0FuaW1hdGlvbigpO1xuXG4vLyBBREQgTEFORFNDQVBFIFNUWUxFUyBUTyBSRUxFVkFOVCBFTEVNRU5UUyBcXFxcXG5cblx0XHRcdGlmKHdpbmRvdy5tYXRjaE1lZGlhKFwiKG9yaWVudGF0aW9uOiBsYW5kc2NhcGUpXCIpLm1hdGNoZXMgJiYgd2luZG93LmlubmVyV2lkdGggPCA4MDApIHtcblx0XHRcdCAgJCgnLm5hdl9saW5rLCAjaGVhZGVyU2hhcGUsICNmb290ZXIsIC5jdXN0b20sIC5tYXJrZXIsICNzZWN0aW9uNSwgLnRleHRXcmFwcGVyJykuYWRkQ2xhc3MoJ2xhbmRzY2FwZScpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ICQoJy5uYXZfbGluaywgI2hlYWRlclNoYXBlLCAjZm9vdGVyLCAuY3VzdG9tLCAubWFya2VyLCAjc2VjdGlvbjUsIC50ZXh0V3JhcHBlcicpLnJlbW92ZUNsYXNzKCdsYW5kc2NhcGUnKTtcblx0XHRcdH1cblxuXHRcdFx0aWYoJCgnI3NlY3Rpb24zLmFjdGl2ZScpLmxlbmd0aCkgeyAvLyBBVVRPTUFURSBUSEUgU0xJREVTIE9OIFNFQ1RJT1BOIDMgRVZFUlkgNyBTRUNPTkRTIElGIFRIRSBTRUNUSU9OIElTIEFDVElWRS4gXFxcXFxuXHRcdFx0XHRpZihtYXN0ZXJPYmouc2VjdGlvbjMuaXNBdXRvbWF0ZWQgIT09IHRydWUpIHtcblx0XHRcdFx0XHRtYXN0ZXJPYmouc2VjdGlvbjMuaXNBdXRvbWF0ZWQgPSB0cnVlO1xuXHRcdFx0XHRcdGludGVydmFsTWFuYWdlcih0cnVlLCAnc2VjdGlvbjMnLCA3MDAwKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHsgLy8gU1RPUCBBVVRPTUFURUQgU0xJREVTIE9OIFNFQ1RJT1BOIDMgSUYgVEhFIFNFQ1RJT04gSVMgTk9UIEFDVElWRS4gXFxcXFxuXHRcdFx0XHRpZihtYXN0ZXJPYmouc2VjdGlvbjMuaXNBdXRvbWF0ZWQgPT09IHRydWUpIHtcblx0XHRcdFx0XHRpbnRlcnZhbE1hbmFnZXIoZmFsc2UsICdzZWN0aW9uMycpO1xuXHRcdFx0XHRcdG1hc3Rlck9iai5zZWN0aW9uMy5pc0F1dG9tYXRlZCA9IGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmKCQoJyNzZWN0aW9uNC5hY3RpdmUnKS5sZW5ndGgpIHsgLy8gQVVUT01BVEUgVEhFIFNMSURFUyBPTiBTRUNUSU9QTiA0IEVWRVJZIDcgU0VDT05EUyBJRiBUSEUgU0VDVElPTiBJUyBBQ1RJVkUuIFxcXFxcblx0XHRcdFx0aWYobWFzdGVyT2JqLnNlY3Rpb240LmlzQXV0b21hdGVkICE9PSB0cnVlKSB7XG5cdFx0XHRcdFx0bWFzdGVyT2JqLnNlY3Rpb240LmlzQXV0b21hdGVkID0gdHJ1ZTtcblx0XHRcdFx0XHRpbnRlcnZhbE1hbmFnZXIodHJ1ZSwgJ3NlY3Rpb240JywgNzAwMCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7IC8vIFNUT1AgQVVUT01BVEVEIFNMSURFUyBPTiBTRUNUSU9QTiA0IElGIFRIRSBTRUNUSU9OIElTIE5PVCBBQ1RJVkUuIFxcXFxcblx0XHRcdFx0aWYobWFzdGVyT2JqLnNlY3Rpb240LmlzQXV0b21hdGVkID09PSB0cnVlKSB7XG5cdFx0XHRcdFx0aW50ZXJ2YWxNYW5hZ2VyKGZhbHNlLCAnc2VjdGlvbjQnKTtcblx0XHRcdFx0XHRtYXN0ZXJPYmouc2VjdGlvbjQuaXNBdXRvbWF0ZWQgPSBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sIDUwMCk7XG5cdH1cblxuLy8gQ09OVFJPTCBXSEFUIEhBUFBFTlMgV0hFTiBMSU5LUyBJTiBUSEUgTkFWL01FTlUgQVJFIENMSUNLRUQgXFxcXFxuXG5cdCQoJy5uYXZfbGluaycpLmNsaWNrKChlKSA9PiB7XG5cdFx0Y29uc3QgcGFnZUlkeCA9IHBhcnNlSW50KCQoZS50YXJnZXQpLmF0dHIoJ2RhdGEtaW5kZXgnKSk7XG5cdFx0JCgnI3Njcm9sbGVyV3JhcHBlcicpLm1vdmVUbyhwYWdlSWR4KTtcblx0XHQkKCcjbWVudUJsb2NrT3V0JykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuXG5cdFx0aWYoYnVyZ2VyLmNsYXNzTGlzdC5jb250YWlucygnYnVyZ2VyLS1hY3RpdmUnKSkge1xuICAgICAgbmF2LmNsYXNzTGlzdC5yZW1vdmUoJ25hdl9vcGVuJyk7XG4gICAgICBidXJnZXIuY2xhc3NMaXN0LnJlbW92ZSgnYnVyZ2VyLS1hY3RpdmUnKTtcbiAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnO1xuICAgIH0gXG5cdH0pO1xuXG4vLyBXSEVOIFRIRSBOQVYgSVMgT1BFTiBQUkVWRU5UIFVTRVIgRlJPTSBCRUlORyBBQkxFIFRPIENMSUNLIEFOWVRISU5HIEVMU0UgXFxcXFxuXG5cdCQoJyNtZW51QmxvY2tPdXQnKS5jbGljaygoZSkgPT4ge1xuXHQgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHR9KTtcblxuXHR2YXIgYnVyZ2VyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW4tYnVyZ2VyJyksIFxuICBuYXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbk5hdicpO1xuXG4vLyBDT05UUk9MIEZPUiBPUEVOIEFORCBDTE9TSU5HIFRIRSBNRU5VL05BViAgXFxcXFxuXG4gIGZ1bmN0aW9uIG5hdkNvbnRyb2woKSB7XG5cbiAgICBpZihidXJnZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdidXJnZXItLWFjdGl2ZScpKSB7XG4gICAgICBuYXYuY2xhc3NMaXN0LnJlbW92ZSgnbmF2X29wZW4nKTtcbiAgICAgIGJ1cmdlci5jbGFzc0xpc3QucmVtb3ZlKCdidXJnZXItLWFjdGl2ZScpO1xuICAgICAgJCgnI21lbnVCbG9ja091dCcpLmFkZENsYXNzKCdoaWRkZW4nKTtcbiAgICB9IFxuICAgIGVsc2Uge1xuICAgICAgYnVyZ2VyLmNsYXNzTGlzdC5hZGQoJ2J1cmdlci0tYWN0aXZlJyk7XG4gICAgICBuYXYuY2xhc3NMaXN0LmFkZCgnbmF2X29wZW4nKTtcbiAgICAgICQoJyNtZW51QmxvY2tPdXQnKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG4gICAgfVxuICB9XG4gIFxuLy8gT05MWSBMSVNURU4gRk9SIE1FTlUgQ0xJQ0tTIFdIRU4gTk9UIElOIENNUyBQUkVWSUVXIE1PREUgXFxcXFxuXG4gIGlmKCEkKGxvY2F0aW9uKS5hdHRyKCdocmVmJykuaW5jbHVkZXMoJ2luZGV4LnBocCcpKSB7XG4gIFx0YnVyZ2VyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgbmF2Q29udHJvbCk7XG4gIH1cblxuLy8gQ0xPU0UgVEhFIE5BViBJRiBUSEUgV0lORE9XIElTIE9WRVIgMTAwMFBYIFdJREUgXFxcXFxuXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBmdW5jdGlvbigpIHtcbiAgICBpZih3aW5kb3cuaW5uZXJXaWR0aCA+IDEwMDAgJiYgbmF2LmNsYXNzTGlzdC5jb250YWlucygnbmF2X29wZW4nKSkge1xuICAgICAgbmF2Q29udHJvbCgpO1xuICAgICAgbmF2LmNsYXNzTGlzdC5yZW1vdmUoJ25hdl9vcGVuJyk7XG4gICAgICAgJCgnI21lbnVCbG9ja091dCcpLmFkZENsYXNzKCdoaWRkZW4nKTtcbiAgICB9XG4gIH0pO1xuXG4vLyBUSElTIFNFVCBPRiBJRiBTVEFURU1FTlRTIElOSVRJQUxJU0VTIFRIRSBTUEVTSUZJQyBQQUdFUyBGT1IgUFJFVklFV0lORyBJTiBDTVMgQURNSU4uIFxcXFxcblxuICBpZigkKGxvY2F0aW9uKS5hdHRyKCdocmVmJykuaW5jbHVkZXMoJ2luZGV4LnBocCcpKSB7XG5cdFx0aWYoJChsb2NhdGlvbikuYXR0cignaHJlZicpLmluY2x1ZGVzKCdpbWFnaW5lLWlmJykpIHtcblx0XHRcdHBhZ2VMb2FkZXIoNCk7XG5cdFx0fVxuXHRcdGlmKCQobG9jYXRpb24pLmF0dHIoJ2hyZWYnKS5pbmNsdWRlcygnaG93LXdlLWlubm92YXRlJykpIHtcblx0XHRcdHBhZ2VMb2FkZXIoMyk7XG5cdFx0fVxuXHRcdGlmKCQobG9jYXRpb24pLmF0dHIoJ2hyZWYnKS5pbmNsdWRlcygnd29yay13aXRoLXVzJykpIHtcblx0XHRcdHBhZ2VMb2FkZXIoNSk7XG5cdFx0fVxuXHRcdGlmKCQobG9jYXRpb24pLmF0dHIoJ2hyZWYnKS5pbmNsdWRlcygnY29udGFjdC11cycpKSB7XG5cdFx0XHRwYWdlTG9hZGVyKDYpO1xuXHRcdH1cblx0XHRpZigkKGxvY2F0aW9uKS5hdHRyKCdocmVmJykuaW5jbHVkZXMoJ2hvbWUtdmlkZW8nKSkge1xuXHRcdFx0c2V0SW50ZXJ2YWwoKCkgPT4ge1xuXHRcdFx0XHRoaWRlTG9hZGluZ0FuaW1hdGlvbigpO1xuXHRcdFx0fSwgNTAwKVxuXHRcdH1cblx0fVxuXG4vLyBTV0lQRSBFVkVOVFMgREVURUNUT1IgRlVOQ1RJT04gXFxcXFxuXG4gIGZ1bmN0aW9uIGRldGVjdHN3aXBlKGVsLCBmdW5jKSB7XG5cdCAgbGV0IHN3aXBlX2RldCA9IHt9O1xuXHQgIHN3aXBlX2RldC5zWCA9IDA7IHN3aXBlX2RldC5zWSA9IDA7IHN3aXBlX2RldC5lWCA9IDA7IHN3aXBlX2RldC5lWSA9IDA7XG5cdCAgdmFyIG1pbl94ID0gMzA7ICAvL21pbiB4IHN3aXBlIGZvciBob3Jpem9udGFsIHN3aXBlXG5cdCAgdmFyIG1heF94ID0gMzA7ICAvL21heCB4IGRpZmZlcmVuY2UgZm9yIHZlcnRpY2FsIHN3aXBlXG5cdCAgdmFyIG1pbl95ID0gNTA7ICAvL21pbiB5IHN3aXBlIGZvciB2ZXJ0aWNhbCBzd2lwZVxuXHQgIHZhciBtYXhfeSA9IDYwOyAgLy9tYXggeSBkaWZmZXJlbmNlIGZvciBob3Jpem9udGFsIHN3aXBlXG5cdCAgdmFyIGRpcmVjID0gXCJcIjtcblx0ICBsZXQgZWxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWwpO1xuXHQgIGVsZS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JyxmdW5jdGlvbihlKXtcblx0ICAgIHZhciB0ID0gZS50b3VjaGVzWzBdO1xuXHQgICAgc3dpcGVfZGV0LnNYID0gdC5zY3JlZW5YOyBcblx0ICAgIHN3aXBlX2RldC5zWSA9IHQuc2NyZWVuWTtcblx0ICB9LGZhbHNlKTtcblx0ICBlbGUuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJyxmdW5jdGlvbihlKXtcblx0ICAgIGUucHJldmVudERlZmF1bHQoKTtcblx0ICAgIHZhciB0ID0gZS50b3VjaGVzWzBdO1xuXHQgICAgc3dpcGVfZGV0LmVYID0gdC5zY3JlZW5YOyBcblx0ICAgIHN3aXBlX2RldC5lWSA9IHQuc2NyZWVuWTsgICAgXG5cdCAgfSxmYWxzZSk7XG5cdCAgZWxlLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJyxmdW5jdGlvbihlKXtcblx0ICAgIC8vaG9yaXpvbnRhbCBkZXRlY3Rpb25cblx0ICAgIGlmICgoKChzd2lwZV9kZXQuZVggLSBtaW5feCA+IHN3aXBlX2RldC5zWCkgfHwgKHN3aXBlX2RldC5lWCArIG1pbl94IDwgc3dpcGVfZGV0LnNYKSkgJiYgKChzd2lwZV9kZXQuZVkgPCBzd2lwZV9kZXQuc1kgKyBtYXhfeSkgJiYgKHN3aXBlX2RldC5zWSA+IHN3aXBlX2RldC5lWSAtIG1heF95KSAmJiAoc3dpcGVfZGV0LmVYID4gMCkpKSkge1xuXHQgICAgICBpZihzd2lwZV9kZXQuZVggPiBzd2lwZV9kZXQuc1gpIGRpcmVjID0gXCJyXCI7XG5cdCAgICAgIGVsc2UgZGlyZWMgPSBcImxcIjtcblx0ICAgIH1cblx0ICAgIC8vdmVydGljYWwgZGV0ZWN0aW9uXG5cdCAgICBlbHNlIGlmICgoKChzd2lwZV9kZXQuZVkgLSBtaW5feSA+IHN3aXBlX2RldC5zWSkgfHwgKHN3aXBlX2RldC5lWSArIG1pbl95IDwgc3dpcGVfZGV0LnNZKSkgJiYgKChzd2lwZV9kZXQuZVggPCBzd2lwZV9kZXQuc1ggKyBtYXhfeCkgJiYgKHN3aXBlX2RldC5zWCA+IHN3aXBlX2RldC5lWCAtIG1heF94KSAmJiAoc3dpcGVfZGV0LmVZID4gMCkpKSkge1xuXHQgICAgICBpZihzd2lwZV9kZXQuZVkgPiBzd2lwZV9kZXQuc1kpIGRpcmVjID0gXCJkXCI7XG5cdCAgICAgIGVsc2UgZGlyZWMgPSBcInVcIjtcblx0ICAgIH1cblxuXHQgICAgaWYgKGRpcmVjICE9IFwiXCIpIHtcblx0ICAgICAgaWYodHlwZW9mIGZ1bmMgPT0gJ2Z1bmN0aW9uJykgZnVuYyhlbCxkaXJlYyk7XG5cdCAgICB9XG5cdCAgICBsZXQgZGlyZWMgPSBcIlwiO1xuXHQgICAgc3dpcGVfZGV0LnNYID0gMDsgc3dpcGVfZGV0LnNZID0gMDsgc3dpcGVfZGV0LmVYID0gMDsgc3dpcGVfZGV0LmVZID0gMDtcblx0ICB9LGZhbHNlKTsgIFxuXHR9XG5cbi8vIENIT1NFIFRIRSBORVhUIFNMSURFIFRPIFNIT1cgQU5EIENMSUNLIFRIRSBQQUdJTkFUSU9OIEJVVFRPTiBUSEFUIFJFTEFURVMgVE8gSVQuIFxcXFxcblxuXHRjb25zdCBzd2lwZUNvbnRyb2xsZXIgPSAoZWwsIGQpID0+IHtcblxuXHRcdGlmKGVsID09PSAnc2VjdGlvbjQnKSB7XG5cblx0XHRcdGNvbnN0IHNlY3Rpb240UGFnaW5hdGlvbkxlbmd0aCA9ICQoJy5zZWN0aW9uNFBhZ2luYXRvckJ1dHRvbicpLmxlbmd0aDtcblxuXHRcdFx0aWYoZCA9PT0gJ2wnKSB7XG5cblx0XHRcdFx0aWYoc2VjdGlvbjRJZHggPCBzZWN0aW9uNFBhZ2luYXRpb25MZW5ndGggLSAxKSB7XG5cdFx0XHRcdFx0c2VjdGlvbjRJZHgrKztcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRzZWN0aW9uNElkeCA9IDA7XG5cdFx0XHRcdH1cblx0XHRcdFx0XG5cdFx0XHRcdCQoJy5zZWN0aW9uNFBhZ2luYXRvckJ1dHRvbicpW3NlY3Rpb240SWR4XS5jbGljaygpO1xuXHRcdFx0fVxuXHRcdFx0aWYoZCA9PT0gJ3InKSB7XG5cblx0XHRcdFx0aWYoc2VjdGlvbjRJZHggPiAwKSB7XG5cdFx0XHRcdFx0c2VjdGlvbjRJZHgtLTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRzZWN0aW9uNElkeCA9IHNlY3Rpb240UGFnaW5hdGlvbkxlbmd0aCAtIDE7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQkKCcuc2VjdGlvbjRQYWdpbmF0b3JCdXR0b24nKVtzZWN0aW9uNElkeF0uY2xpY2soKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYoZWwgPT09ICdzZWN0aW9uMycpIHtcblxuXHRcdFx0Y29uc3Qgc2VjdGlvbjNQYWdpbmF0aW9uTGVuZ3RoID0gJCgnLnNlY3Rpb24zUGFnaW5hdG9yQnV0dG9uJykubGVuZ3RoO1xuXG5cdFx0XHRpZihkID09PSAnbCcpIHtcblxuXHRcdFx0XHRpZihzZWN0aW9uM0lkeCA8IHNlY3Rpb24zUGFnaW5hdGlvbkxlbmd0aCAtIDEpIHtcblx0XHRcdFx0XHRzZWN0aW9uM0lkeCsrO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHNlY3Rpb24zSWR4ID0gMDtcblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdFx0JCgnLnNlY3Rpb24zUGFnaW5hdG9yQnV0dG9uJylbc2VjdGlvbjNJZHhdLmNsaWNrKCk7XG5cdFx0XHR9XG5cdFx0XHRpZihkID09PSAncicpIHtcblxuXHRcdFx0XHRpZihzZWN0aW9uM0lkeCA+IDApIHtcblx0XHRcdFx0XHRzZWN0aW9uM0lkeC0tO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHNlY3Rpb24zSWR4ID0gc2VjdGlvbjNQYWdpbmF0aW9uTGVuZ3RoIC0gMTtcblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdFx0JCgnLnNlY3Rpb24zUGFnaW5hdG9yQnV0dG9uJylbc2VjdGlvbjNJZHhdLmNsaWNrKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cbi8vIElOSVRJQVRFIEZPUiBTV0lQRSBERVRFQ1RJT04gT04gU0VDVElPTlMgMyBBTkQgNCBFWENFUFQgSU4gQURNSU4gUFJFVklFVy4gXFxcXFxuXG5cdGlmKCEkKGxvY2F0aW9uKS5hdHRyKCdocmVmJykuaW5jbHVkZXMoJ2luZGV4LnBocCcpKSB7XG5cdFx0ZGV0ZWN0c3dpcGUoJ3NlY3Rpb240Jywgc3dpcGVDb250cm9sbGVyKTtcblx0XHRkZXRlY3Rzd2lwZSgnc2VjdGlvbjMnLCBzd2lwZUNvbnRyb2xsZXIpO1xuXHR9XG59KTsiXX0=
}).call(this,require("FT5ORs"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/fake_8b6f8918.js","/")
},{"FT5ORs":4,"buffer":2}]},{},[5])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYW1pYW53aHl0ZS9Eb2N1bWVudHMvUHJvamVjdHMvY3JhZnRfZmFudGFzdGVjL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvZGFtaWFud2h5dGUvRG9jdW1lbnRzL1Byb2plY3RzL2NyYWZ0X2ZhbnRhc3RlYy9ub2RlX21vZHVsZXMvYmFzZTY0LWpzL2xpYi9iNjQuanMiLCIvVXNlcnMvZGFtaWFud2h5dGUvRG9jdW1lbnRzL1Byb2plY3RzL2NyYWZ0X2ZhbnRhc3RlYy9ub2RlX21vZHVsZXMvYnVmZmVyL2luZGV4LmpzIiwiL1VzZXJzL2RhbWlhbndoeXRlL0RvY3VtZW50cy9Qcm9qZWN0cy9jcmFmdF9mYW50YXN0ZWMvbm9kZV9tb2R1bGVzL2llZWU3NTQvaW5kZXguanMiLCIvVXNlcnMvZGFtaWFud2h5dGUvRG9jdW1lbnRzL1Byb2plY3RzL2NyYWZ0X2ZhbnRhc3RlYy9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwiL1VzZXJzL2RhbWlhbndoeXRlL0RvY3VtZW50cy9Qcm9qZWN0cy9jcmFmdF9mYW50YXN0ZWMvc291cmNlL2pzL2NvbWJpbmVkL2Zha2VfOGI2Zjg5MTguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2bENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG52YXIgbG9va3VwID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky8nO1xuXG47KGZ1bmN0aW9uIChleHBvcnRzKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuICB2YXIgQXJyID0gKHR5cGVvZiBVaW50OEFycmF5ICE9PSAndW5kZWZpbmVkJylcbiAgICA/IFVpbnQ4QXJyYXlcbiAgICA6IEFycmF5XG5cblx0dmFyIFBMVVMgICA9ICcrJy5jaGFyQ29kZUF0KDApXG5cdHZhciBTTEFTSCAgPSAnLycuY2hhckNvZGVBdCgwKVxuXHR2YXIgTlVNQkVSID0gJzAnLmNoYXJDb2RlQXQoMClcblx0dmFyIExPV0VSICA9ICdhJy5jaGFyQ29kZUF0KDApXG5cdHZhciBVUFBFUiAgPSAnQScuY2hhckNvZGVBdCgwKVxuXHR2YXIgUExVU19VUkxfU0FGRSA9ICctJy5jaGFyQ29kZUF0KDApXG5cdHZhciBTTEFTSF9VUkxfU0FGRSA9ICdfJy5jaGFyQ29kZUF0KDApXG5cblx0ZnVuY3Rpb24gZGVjb2RlIChlbHQpIHtcblx0XHR2YXIgY29kZSA9IGVsdC5jaGFyQ29kZUF0KDApXG5cdFx0aWYgKGNvZGUgPT09IFBMVVMgfHxcblx0XHQgICAgY29kZSA9PT0gUExVU19VUkxfU0FGRSlcblx0XHRcdHJldHVybiA2MiAvLyAnKydcblx0XHRpZiAoY29kZSA9PT0gU0xBU0ggfHxcblx0XHQgICAgY29kZSA9PT0gU0xBU0hfVVJMX1NBRkUpXG5cdFx0XHRyZXR1cm4gNjMgLy8gJy8nXG5cdFx0aWYgKGNvZGUgPCBOVU1CRVIpXG5cdFx0XHRyZXR1cm4gLTEgLy9ubyBtYXRjaFxuXHRcdGlmIChjb2RlIDwgTlVNQkVSICsgMTApXG5cdFx0XHRyZXR1cm4gY29kZSAtIE5VTUJFUiArIDI2ICsgMjZcblx0XHRpZiAoY29kZSA8IFVQUEVSICsgMjYpXG5cdFx0XHRyZXR1cm4gY29kZSAtIFVQUEVSXG5cdFx0aWYgKGNvZGUgPCBMT1dFUiArIDI2KVxuXHRcdFx0cmV0dXJuIGNvZGUgLSBMT1dFUiArIDI2XG5cdH1cblxuXHRmdW5jdGlvbiBiNjRUb0J5dGVBcnJheSAoYjY0KSB7XG5cdFx0dmFyIGksIGosIGwsIHRtcCwgcGxhY2VIb2xkZXJzLCBhcnJcblxuXHRcdGlmIChiNjQubGVuZ3RoICUgNCA+IDApIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignSW52YWxpZCBzdHJpbmcuIExlbmd0aCBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgNCcpXG5cdFx0fVxuXG5cdFx0Ly8gdGhlIG51bWJlciBvZiBlcXVhbCBzaWducyAocGxhY2UgaG9sZGVycylcblx0XHQvLyBpZiB0aGVyZSBhcmUgdHdvIHBsYWNlaG9sZGVycywgdGhhbiB0aGUgdHdvIGNoYXJhY3RlcnMgYmVmb3JlIGl0XG5cdFx0Ly8gcmVwcmVzZW50IG9uZSBieXRlXG5cdFx0Ly8gaWYgdGhlcmUgaXMgb25seSBvbmUsIHRoZW4gdGhlIHRocmVlIGNoYXJhY3RlcnMgYmVmb3JlIGl0IHJlcHJlc2VudCAyIGJ5dGVzXG5cdFx0Ly8gdGhpcyBpcyBqdXN0IGEgY2hlYXAgaGFjayB0byBub3QgZG8gaW5kZXhPZiB0d2ljZVxuXHRcdHZhciBsZW4gPSBiNjQubGVuZ3RoXG5cdFx0cGxhY2VIb2xkZXJzID0gJz0nID09PSBiNjQuY2hhckF0KGxlbiAtIDIpID8gMiA6ICc9JyA9PT0gYjY0LmNoYXJBdChsZW4gLSAxKSA/IDEgOiAwXG5cblx0XHQvLyBiYXNlNjQgaXMgNC8zICsgdXAgdG8gdHdvIGNoYXJhY3RlcnMgb2YgdGhlIG9yaWdpbmFsIGRhdGFcblx0XHRhcnIgPSBuZXcgQXJyKGI2NC5sZW5ndGggKiAzIC8gNCAtIHBsYWNlSG9sZGVycylcblxuXHRcdC8vIGlmIHRoZXJlIGFyZSBwbGFjZWhvbGRlcnMsIG9ubHkgZ2V0IHVwIHRvIHRoZSBsYXN0IGNvbXBsZXRlIDQgY2hhcnNcblx0XHRsID0gcGxhY2VIb2xkZXJzID4gMCA/IGI2NC5sZW5ndGggLSA0IDogYjY0Lmxlbmd0aFxuXG5cdFx0dmFyIEwgPSAwXG5cblx0XHRmdW5jdGlvbiBwdXNoICh2KSB7XG5cdFx0XHRhcnJbTCsrXSA9IHZcblx0XHR9XG5cblx0XHRmb3IgKGkgPSAwLCBqID0gMDsgaSA8IGw7IGkgKz0gNCwgaiArPSAzKSB7XG5cdFx0XHR0bXAgPSAoZGVjb2RlKGI2NC5jaGFyQXQoaSkpIDw8IDE4KSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMSkpIDw8IDEyKSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMikpIDw8IDYpIHwgZGVjb2RlKGI2NC5jaGFyQXQoaSArIDMpKVxuXHRcdFx0cHVzaCgodG1wICYgMHhGRjAwMDApID4+IDE2KVxuXHRcdFx0cHVzaCgodG1wICYgMHhGRjAwKSA+PiA4KVxuXHRcdFx0cHVzaCh0bXAgJiAweEZGKVxuXHRcdH1cblxuXHRcdGlmIChwbGFjZUhvbGRlcnMgPT09IDIpIHtcblx0XHRcdHRtcCA9IChkZWNvZGUoYjY0LmNoYXJBdChpKSkgPDwgMikgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDEpKSA+PiA0KVxuXHRcdFx0cHVzaCh0bXAgJiAweEZGKVxuXHRcdH0gZWxzZSBpZiAocGxhY2VIb2xkZXJzID09PSAxKSB7XG5cdFx0XHR0bXAgPSAoZGVjb2RlKGI2NC5jaGFyQXQoaSkpIDw8IDEwKSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMSkpIDw8IDQpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAyKSkgPj4gMilcblx0XHRcdHB1c2goKHRtcCA+PiA4KSAmIDB4RkYpXG5cdFx0XHRwdXNoKHRtcCAmIDB4RkYpXG5cdFx0fVxuXG5cdFx0cmV0dXJuIGFyclxuXHR9XG5cblx0ZnVuY3Rpb24gdWludDhUb0Jhc2U2NCAodWludDgpIHtcblx0XHR2YXIgaSxcblx0XHRcdGV4dHJhQnl0ZXMgPSB1aW50OC5sZW5ndGggJSAzLCAvLyBpZiB3ZSBoYXZlIDEgYnl0ZSBsZWZ0LCBwYWQgMiBieXRlc1xuXHRcdFx0b3V0cHV0ID0gXCJcIixcblx0XHRcdHRlbXAsIGxlbmd0aFxuXG5cdFx0ZnVuY3Rpb24gZW5jb2RlIChudW0pIHtcblx0XHRcdHJldHVybiBsb29rdXAuY2hhckF0KG51bSlcblx0XHR9XG5cblx0XHRmdW5jdGlvbiB0cmlwbGV0VG9CYXNlNjQgKG51bSkge1xuXHRcdFx0cmV0dXJuIGVuY29kZShudW0gPj4gMTggJiAweDNGKSArIGVuY29kZShudW0gPj4gMTIgJiAweDNGKSArIGVuY29kZShudW0gPj4gNiAmIDB4M0YpICsgZW5jb2RlKG51bSAmIDB4M0YpXG5cdFx0fVxuXG5cdFx0Ly8gZ28gdGhyb3VnaCB0aGUgYXJyYXkgZXZlcnkgdGhyZWUgYnl0ZXMsIHdlJ2xsIGRlYWwgd2l0aCB0cmFpbGluZyBzdHVmZiBsYXRlclxuXHRcdGZvciAoaSA9IDAsIGxlbmd0aCA9IHVpbnQ4Lmxlbmd0aCAtIGV4dHJhQnl0ZXM7IGkgPCBsZW5ndGg7IGkgKz0gMykge1xuXHRcdFx0dGVtcCA9ICh1aW50OFtpXSA8PCAxNikgKyAodWludDhbaSArIDFdIDw8IDgpICsgKHVpbnQ4W2kgKyAyXSlcblx0XHRcdG91dHB1dCArPSB0cmlwbGV0VG9CYXNlNjQodGVtcClcblx0XHR9XG5cblx0XHQvLyBwYWQgdGhlIGVuZCB3aXRoIHplcm9zLCBidXQgbWFrZSBzdXJlIHRvIG5vdCBmb3JnZXQgdGhlIGV4dHJhIGJ5dGVzXG5cdFx0c3dpdGNoIChleHRyYUJ5dGVzKSB7XG5cdFx0XHRjYXNlIDE6XG5cdFx0XHRcdHRlbXAgPSB1aW50OFt1aW50OC5sZW5ndGggLSAxXVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKHRlbXAgPj4gMilcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSgodGVtcCA8PCA0KSAmIDB4M0YpXG5cdFx0XHRcdG91dHB1dCArPSAnPT0nXG5cdFx0XHRcdGJyZWFrXG5cdFx0XHRjYXNlIDI6XG5cdFx0XHRcdHRlbXAgPSAodWludDhbdWludDgubGVuZ3RoIC0gMl0gPDwgOCkgKyAodWludDhbdWludDgubGVuZ3RoIC0gMV0pXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUodGVtcCA+PiAxMClcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSgodGVtcCA+PiA0KSAmIDB4M0YpXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUoKHRlbXAgPDwgMikgJiAweDNGKVxuXHRcdFx0XHRvdXRwdXQgKz0gJz0nXG5cdFx0XHRcdGJyZWFrXG5cdFx0fVxuXG5cdFx0cmV0dXJuIG91dHB1dFxuXHR9XG5cblx0ZXhwb3J0cy50b0J5dGVBcnJheSA9IGI2NFRvQnl0ZUFycmF5XG5cdGV4cG9ydHMuZnJvbUJ5dGVBcnJheSA9IHVpbnQ4VG9CYXNlNjRcbn0odHlwZW9mIGV4cG9ydHMgPT09ICd1bmRlZmluZWQnID8gKHRoaXMuYmFzZTY0anMgPSB7fSkgOiBleHBvcnRzKSlcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJGVDVPUnNcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvYmFzZTY0LWpzL2xpYi9iNjQuanNcIixcIi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvYmFzZTY0LWpzL2xpYlwiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8qIVxuICogVGhlIGJ1ZmZlciBtb2R1bGUgZnJvbSBub2RlLmpzLCBmb3IgdGhlIGJyb3dzZXIuXG4gKlxuICogQGF1dGhvciAgIEZlcm9zcyBBYm91a2hhZGlqZWggPGZlcm9zc0BmZXJvc3Mub3JnPiA8aHR0cDovL2Zlcm9zcy5vcmc+XG4gKiBAbGljZW5zZSAgTUlUXG4gKi9cblxudmFyIGJhc2U2NCA9IHJlcXVpcmUoJ2Jhc2U2NC1qcycpXG52YXIgaWVlZTc1NCA9IHJlcXVpcmUoJ2llZWU3NTQnKVxuXG5leHBvcnRzLkJ1ZmZlciA9IEJ1ZmZlclxuZXhwb3J0cy5TbG93QnVmZmVyID0gQnVmZmVyXG5leHBvcnRzLklOU1BFQ1RfTUFYX0JZVEVTID0gNTBcbkJ1ZmZlci5wb29sU2l6ZSA9IDgxOTJcblxuLyoqXG4gKiBJZiBgQnVmZmVyLl91c2VUeXBlZEFycmF5c2A6XG4gKiAgID09PSB0cnVlICAgIFVzZSBVaW50OEFycmF5IGltcGxlbWVudGF0aW9uIChmYXN0ZXN0KVxuICogICA9PT0gZmFsc2UgICBVc2UgT2JqZWN0IGltcGxlbWVudGF0aW9uIChjb21wYXRpYmxlIGRvd24gdG8gSUU2KVxuICovXG5CdWZmZXIuX3VzZVR5cGVkQXJyYXlzID0gKGZ1bmN0aW9uICgpIHtcbiAgLy8gRGV0ZWN0IGlmIGJyb3dzZXIgc3VwcG9ydHMgVHlwZWQgQXJyYXlzLiBTdXBwb3J0ZWQgYnJvd3NlcnMgYXJlIElFIDEwKywgRmlyZWZveCA0KyxcbiAgLy8gQ2hyb21lIDcrLCBTYWZhcmkgNS4xKywgT3BlcmEgMTEuNissIGlPUyA0LjIrLiBJZiB0aGUgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IGFkZGluZ1xuICAvLyBwcm9wZXJ0aWVzIHRvIGBVaW50OEFycmF5YCBpbnN0YW5jZXMsIHRoZW4gdGhhdCdzIHRoZSBzYW1lIGFzIG5vIGBVaW50OEFycmF5YCBzdXBwb3J0XG4gIC8vIGJlY2F1c2Ugd2UgbmVlZCB0byBiZSBhYmxlIHRvIGFkZCBhbGwgdGhlIG5vZGUgQnVmZmVyIEFQSSBtZXRob2RzLiBUaGlzIGlzIGFuIGlzc3VlXG4gIC8vIGluIEZpcmVmb3ggNC0yOS4gTm93IGZpeGVkOiBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD02OTU0MzhcbiAgdHJ5IHtcbiAgICB2YXIgYnVmID0gbmV3IEFycmF5QnVmZmVyKDApXG4gICAgdmFyIGFyciA9IG5ldyBVaW50OEFycmF5KGJ1ZilcbiAgICBhcnIuZm9vID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gNDIgfVxuICAgIHJldHVybiA0MiA9PT0gYXJyLmZvbygpICYmXG4gICAgICAgIHR5cGVvZiBhcnIuc3ViYXJyYXkgPT09ICdmdW5jdGlvbicgLy8gQ2hyb21lIDktMTAgbGFjayBgc3ViYXJyYXlgXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufSkoKVxuXG4vKipcbiAqIENsYXNzOiBCdWZmZXJcbiAqID09PT09PT09PT09PT1cbiAqXG4gKiBUaGUgQnVmZmVyIGNvbnN0cnVjdG9yIHJldHVybnMgaW5zdGFuY2VzIG9mIGBVaW50OEFycmF5YCB0aGF0IGFyZSBhdWdtZW50ZWRcbiAqIHdpdGggZnVuY3Rpb24gcHJvcGVydGllcyBmb3IgYWxsIHRoZSBub2RlIGBCdWZmZXJgIEFQSSBmdW5jdGlvbnMuIFdlIHVzZVxuICogYFVpbnQ4QXJyYXlgIHNvIHRoYXQgc3F1YXJlIGJyYWNrZXQgbm90YXRpb24gd29ya3MgYXMgZXhwZWN0ZWQgLS0gaXQgcmV0dXJuc1xuICogYSBzaW5nbGUgb2N0ZXQuXG4gKlxuICogQnkgYXVnbWVudGluZyB0aGUgaW5zdGFuY2VzLCB3ZSBjYW4gYXZvaWQgbW9kaWZ5aW5nIHRoZSBgVWludDhBcnJheWBcbiAqIHByb3RvdHlwZS5cbiAqL1xuZnVuY3Rpb24gQnVmZmVyIChzdWJqZWN0LCBlbmNvZGluZywgbm9aZXJvKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBCdWZmZXIpKVxuICAgIHJldHVybiBuZXcgQnVmZmVyKHN1YmplY3QsIGVuY29kaW5nLCBub1plcm8pXG5cbiAgdmFyIHR5cGUgPSB0eXBlb2Ygc3ViamVjdFxuXG4gIC8vIFdvcmthcm91bmQ6IG5vZGUncyBiYXNlNjQgaW1wbGVtZW50YXRpb24gYWxsb3dzIGZvciBub24tcGFkZGVkIHN0cmluZ3NcbiAgLy8gd2hpbGUgYmFzZTY0LWpzIGRvZXMgbm90LlxuICBpZiAoZW5jb2RpbmcgPT09ICdiYXNlNjQnICYmIHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgc3ViamVjdCA9IHN0cmluZ3RyaW0oc3ViamVjdClcbiAgICB3aGlsZSAoc3ViamVjdC5sZW5ndGggJSA0ICE9PSAwKSB7XG4gICAgICBzdWJqZWN0ID0gc3ViamVjdCArICc9J1xuICAgIH1cbiAgfVxuXG4gIC8vIEZpbmQgdGhlIGxlbmd0aFxuICB2YXIgbGVuZ3RoXG4gIGlmICh0eXBlID09PSAnbnVtYmVyJylcbiAgICBsZW5ndGggPSBjb2VyY2Uoc3ViamVjdClcbiAgZWxzZSBpZiAodHlwZSA9PT0gJ3N0cmluZycpXG4gICAgbGVuZ3RoID0gQnVmZmVyLmJ5dGVMZW5ndGgoc3ViamVjdCwgZW5jb2RpbmcpXG4gIGVsc2UgaWYgKHR5cGUgPT09ICdvYmplY3QnKVxuICAgIGxlbmd0aCA9IGNvZXJjZShzdWJqZWN0Lmxlbmd0aCkgLy8gYXNzdW1lIHRoYXQgb2JqZWN0IGlzIGFycmF5LWxpa2VcbiAgZWxzZVxuICAgIHRocm93IG5ldyBFcnJvcignRmlyc3QgYXJndW1lbnQgbmVlZHMgdG8gYmUgYSBudW1iZXIsIGFycmF5IG9yIHN0cmluZy4nKVxuXG4gIHZhciBidWZcbiAgaWYgKEJ1ZmZlci5fdXNlVHlwZWRBcnJheXMpIHtcbiAgICAvLyBQcmVmZXJyZWQ6IFJldHVybiBhbiBhdWdtZW50ZWQgYFVpbnQ4QXJyYXlgIGluc3RhbmNlIGZvciBiZXN0IHBlcmZvcm1hbmNlXG4gICAgYnVmID0gQnVmZmVyLl9hdWdtZW50KG5ldyBVaW50OEFycmF5KGxlbmd0aCkpXG4gIH0gZWxzZSB7XG4gICAgLy8gRmFsbGJhY2s6IFJldHVybiBUSElTIGluc3RhbmNlIG9mIEJ1ZmZlciAoY3JlYXRlZCBieSBgbmV3YClcbiAgICBidWYgPSB0aGlzXG4gICAgYnVmLmxlbmd0aCA9IGxlbmd0aFxuICAgIGJ1Zi5faXNCdWZmZXIgPSB0cnVlXG4gIH1cblxuICB2YXIgaVxuICBpZiAoQnVmZmVyLl91c2VUeXBlZEFycmF5cyAmJiB0eXBlb2Ygc3ViamVjdC5ieXRlTGVuZ3RoID09PSAnbnVtYmVyJykge1xuICAgIC8vIFNwZWVkIG9wdGltaXphdGlvbiAtLSB1c2Ugc2V0IGlmIHdlJ3JlIGNvcHlpbmcgZnJvbSBhIHR5cGVkIGFycmF5XG4gICAgYnVmLl9zZXQoc3ViamVjdClcbiAgfSBlbHNlIGlmIChpc0FycmF5aXNoKHN1YmplY3QpKSB7XG4gICAgLy8gVHJlYXQgYXJyYXktaXNoIG9iamVjdHMgYXMgYSBieXRlIGFycmF5XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoQnVmZmVyLmlzQnVmZmVyKHN1YmplY3QpKVxuICAgICAgICBidWZbaV0gPSBzdWJqZWN0LnJlYWRVSW50OChpKVxuICAgICAgZWxzZVxuICAgICAgICBidWZbaV0gPSBzdWJqZWN0W2ldXG4gICAgfVxuICB9IGVsc2UgaWYgKHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgYnVmLndyaXRlKHN1YmplY3QsIDAsIGVuY29kaW5nKVxuICB9IGVsc2UgaWYgKHR5cGUgPT09ICdudW1iZXInICYmICFCdWZmZXIuX3VzZVR5cGVkQXJyYXlzICYmICFub1plcm8pIHtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGJ1ZltpXSA9IDBcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYnVmXG59XG5cbi8vIFNUQVRJQyBNRVRIT0RTXG4vLyA9PT09PT09PT09PT09PVxuXG5CdWZmZXIuaXNFbmNvZGluZyA9IGZ1bmN0aW9uIChlbmNvZGluZykge1xuICBzd2l0Y2ggKFN0cmluZyhlbmNvZGluZykudG9Mb3dlckNhc2UoKSkge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICBjYXNlICdiaW5hcnknOlxuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgY2FzZSAncmF3JzpcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0dXJuIHRydWVcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuQnVmZmVyLmlzQnVmZmVyID0gZnVuY3Rpb24gKGIpIHtcbiAgcmV0dXJuICEhKGIgIT09IG51bGwgJiYgYiAhPT0gdW5kZWZpbmVkICYmIGIuX2lzQnVmZmVyKVxufVxuXG5CdWZmZXIuYnl0ZUxlbmd0aCA9IGZ1bmN0aW9uIChzdHIsIGVuY29kaW5nKSB7XG4gIHZhciByZXRcbiAgc3RyID0gc3RyICsgJydcbiAgc3dpdGNoIChlbmNvZGluZyB8fCAndXRmOCcpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgICAgcmV0ID0gc3RyLmxlbmd0aCAvIDJcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgICAgcmV0ID0gdXRmOFRvQnl0ZXMoc3RyKS5sZW5ndGhcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYXNjaWknOlxuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgY2FzZSAncmF3JzpcbiAgICAgIHJldCA9IHN0ci5sZW5ndGhcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgIHJldCA9IGJhc2U2NFRvQnl0ZXMoc3RyKS5sZW5ndGhcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldCA9IHN0ci5sZW5ndGggKiAyXG4gICAgICBicmVha1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2RpbmcnKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuQnVmZmVyLmNvbmNhdCA9IGZ1bmN0aW9uIChsaXN0LCB0b3RhbExlbmd0aCkge1xuICBhc3NlcnQoaXNBcnJheShsaXN0KSwgJ1VzYWdlOiBCdWZmZXIuY29uY2F0KGxpc3QsIFt0b3RhbExlbmd0aF0pXFxuJyArXG4gICAgICAnbGlzdCBzaG91bGQgYmUgYW4gQXJyYXkuJylcblxuICBpZiAobGlzdC5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gbmV3IEJ1ZmZlcigwKVxuICB9IGVsc2UgaWYgKGxpc3QubGVuZ3RoID09PSAxKSB7XG4gICAgcmV0dXJuIGxpc3RbMF1cbiAgfVxuXG4gIHZhciBpXG4gIGlmICh0eXBlb2YgdG90YWxMZW5ndGggIT09ICdudW1iZXInKSB7XG4gICAgdG90YWxMZW5ndGggPSAwXG4gICAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRvdGFsTGVuZ3RoICs9IGxpc3RbaV0ubGVuZ3RoXG4gICAgfVxuICB9XG5cbiAgdmFyIGJ1ZiA9IG5ldyBCdWZmZXIodG90YWxMZW5ndGgpXG4gIHZhciBwb3MgPSAwXG4gIGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldXG4gICAgaXRlbS5jb3B5KGJ1ZiwgcG9zKVxuICAgIHBvcyArPSBpdGVtLmxlbmd0aFxuICB9XG4gIHJldHVybiBidWZcbn1cblxuLy8gQlVGRkVSIElOU1RBTkNFIE1FVEhPRFNcbi8vID09PT09PT09PT09PT09PT09PT09PT09XG5cbmZ1bmN0aW9uIF9oZXhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIG9mZnNldCA9IE51bWJlcihvZmZzZXQpIHx8IDBcbiAgdmFyIHJlbWFpbmluZyA9IGJ1Zi5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgfSBlbHNlIHtcbiAgICBsZW5ndGggPSBOdW1iZXIobGVuZ3RoKVxuICAgIGlmIChsZW5ndGggPiByZW1haW5pbmcpIHtcbiAgICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICAgIH1cbiAgfVxuXG4gIC8vIG11c3QgYmUgYW4gZXZlbiBudW1iZXIgb2YgZGlnaXRzXG4gIHZhciBzdHJMZW4gPSBzdHJpbmcubGVuZ3RoXG4gIGFzc2VydChzdHJMZW4gJSAyID09PSAwLCAnSW52YWxpZCBoZXggc3RyaW5nJylcblxuICBpZiAobGVuZ3RoID4gc3RyTGVuIC8gMikge1xuICAgIGxlbmd0aCA9IHN0ckxlbiAvIDJcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGJ5dGUgPSBwYXJzZUludChzdHJpbmcuc3Vic3RyKGkgKiAyLCAyKSwgMTYpXG4gICAgYXNzZXJ0KCFpc05hTihieXRlKSwgJ0ludmFsaWQgaGV4IHN0cmluZycpXG4gICAgYnVmW29mZnNldCArIGldID0gYnl0ZVxuICB9XG4gIEJ1ZmZlci5fY2hhcnNXcml0dGVuID0gaSAqIDJcbiAgcmV0dXJuIGlcbn1cblxuZnVuY3Rpb24gX3V0ZjhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBjaGFyc1dyaXR0ZW4gPSBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9XG4gICAgYmxpdEJ1ZmZlcih1dGY4VG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxuICByZXR1cm4gY2hhcnNXcml0dGVuXG59XG5cbmZ1bmN0aW9uIF9hc2NpaVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKGFzY2lpVG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxuICByZXR1cm4gY2hhcnNXcml0dGVuXG59XG5cbmZ1bmN0aW9uIF9iaW5hcnlXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBfYXNjaWlXcml0ZShidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIF9iYXNlNjRXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBjaGFyc1dyaXR0ZW4gPSBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9XG4gICAgYmxpdEJ1ZmZlcihiYXNlNjRUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuZnVuY3Rpb24gX3V0ZjE2bGVXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBjaGFyc1dyaXR0ZW4gPSBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9XG4gICAgYmxpdEJ1ZmZlcih1dGYxNmxlVG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxuICByZXR1cm4gY2hhcnNXcml0dGVuXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbiAoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCwgZW5jb2RpbmcpIHtcbiAgLy8gU3VwcG9ydCBib3RoIChzdHJpbmcsIG9mZnNldCwgbGVuZ3RoLCBlbmNvZGluZylcbiAgLy8gYW5kIHRoZSBsZWdhY3kgKHN0cmluZywgZW5jb2RpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICBpZiAoaXNGaW5pdGUob2Zmc2V0KSkge1xuICAgIGlmICghaXNGaW5pdGUobGVuZ3RoKSkge1xuICAgICAgZW5jb2RpbmcgPSBsZW5ndGhcbiAgICAgIGxlbmd0aCA9IHVuZGVmaW5lZFxuICAgIH1cbiAgfSBlbHNlIHsgIC8vIGxlZ2FjeVxuICAgIHZhciBzd2FwID0gZW5jb2RpbmdcbiAgICBlbmNvZGluZyA9IG9mZnNldFxuICAgIG9mZnNldCA9IGxlbmd0aFxuICAgIGxlbmd0aCA9IHN3YXBcbiAgfVxuXG4gIG9mZnNldCA9IE51bWJlcihvZmZzZXQpIHx8IDBcbiAgdmFyIHJlbWFpbmluZyA9IHRoaXMubGVuZ3RoIC0gb2Zmc2V0XG4gIGlmICghbGVuZ3RoKSB7XG4gICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gIH0gZWxzZSB7XG4gICAgbGVuZ3RoID0gTnVtYmVyKGxlbmd0aClcbiAgICBpZiAobGVuZ3RoID4gcmVtYWluaW5nKSB7XG4gICAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgICB9XG4gIH1cbiAgZW5jb2RpbmcgPSBTdHJpbmcoZW5jb2RpbmcgfHwgJ3V0ZjgnKS50b0xvd2VyQ2FzZSgpXG5cbiAgdmFyIHJldFxuICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICAgIHJldCA9IF9oZXhXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgICByZXQgPSBfdXRmOFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgIHJldCA9IF9hc2NpaVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICByZXQgPSBfYmluYXJ5V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgIHJldCA9IF9iYXNlNjRXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0ID0gX3V0ZjE2bGVXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGVuY29kaW5nJylcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoZW5jb2RpbmcsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHNlbGYgPSB0aGlzXG5cbiAgZW5jb2RpbmcgPSBTdHJpbmcoZW5jb2RpbmcgfHwgJ3V0ZjgnKS50b0xvd2VyQ2FzZSgpXG4gIHN0YXJ0ID0gTnVtYmVyKHN0YXJ0KSB8fCAwXG4gIGVuZCA9IChlbmQgIT09IHVuZGVmaW5lZClcbiAgICA/IE51bWJlcihlbmQpXG4gICAgOiBlbmQgPSBzZWxmLmxlbmd0aFxuXG4gIC8vIEZhc3RwYXRoIGVtcHR5IHN0cmluZ3NcbiAgaWYgKGVuZCA9PT0gc3RhcnQpXG4gICAgcmV0dXJuICcnXG5cbiAgdmFyIHJldFxuICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICAgIHJldCA9IF9oZXhTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgICByZXQgPSBfdXRmOFNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgIHJldCA9IF9hc2NpaVNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICByZXQgPSBfYmluYXJ5U2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgIHJldCA9IF9iYXNlNjRTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0ID0gX3V0ZjE2bGVTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGVuY29kaW5nJylcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdCdWZmZXInLFxuICAgIGRhdGE6IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHRoaXMuX2FyciB8fCB0aGlzLCAwKVxuICB9XG59XG5cbi8vIGNvcHkodGFyZ2V0QnVmZmVyLCB0YXJnZXRTdGFydD0wLCBzb3VyY2VTdGFydD0wLCBzb3VyY2VFbmQ9YnVmZmVyLmxlbmd0aClcbkJ1ZmZlci5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uICh0YXJnZXQsIHRhcmdldF9zdGFydCwgc3RhcnQsIGVuZCkge1xuICB2YXIgc291cmNlID0gdGhpc1xuXG4gIGlmICghc3RhcnQpIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCAmJiBlbmQgIT09IDApIGVuZCA9IHRoaXMubGVuZ3RoXG4gIGlmICghdGFyZ2V0X3N0YXJ0KSB0YXJnZXRfc3RhcnQgPSAwXG5cbiAgLy8gQ29weSAwIGJ5dGVzOyB3ZSdyZSBkb25lXG4gIGlmIChlbmQgPT09IHN0YXJ0KSByZXR1cm5cbiAgaWYgKHRhcmdldC5sZW5ndGggPT09IDAgfHwgc291cmNlLmxlbmd0aCA9PT0gMCkgcmV0dXJuXG5cbiAgLy8gRmF0YWwgZXJyb3IgY29uZGl0aW9uc1xuICBhc3NlcnQoZW5kID49IHN0YXJ0LCAnc291cmNlRW5kIDwgc291cmNlU3RhcnQnKVxuICBhc3NlcnQodGFyZ2V0X3N0YXJ0ID49IDAgJiYgdGFyZ2V0X3N0YXJ0IDwgdGFyZ2V0Lmxlbmd0aCxcbiAgICAgICd0YXJnZXRTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgYXNzZXJ0KHN0YXJ0ID49IDAgJiYgc3RhcnQgPCBzb3VyY2UubGVuZ3RoLCAnc291cmNlU3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIGFzc2VydChlbmQgPj0gMCAmJiBlbmQgPD0gc291cmNlLmxlbmd0aCwgJ3NvdXJjZUVuZCBvdXQgb2YgYm91bmRzJylcblxuICAvLyBBcmUgd2Ugb29iP1xuICBpZiAoZW5kID4gdGhpcy5sZW5ndGgpXG4gICAgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKHRhcmdldC5sZW5ndGggLSB0YXJnZXRfc3RhcnQgPCBlbmQgLSBzdGFydClcbiAgICBlbmQgPSB0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0X3N0YXJ0ICsgc3RhcnRcblxuICB2YXIgbGVuID0gZW5kIC0gc3RhcnRcblxuICBpZiAobGVuIDwgMTAwIHx8ICFCdWZmZXIuX3VzZVR5cGVkQXJyYXlzKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIHRhcmdldFtpICsgdGFyZ2V0X3N0YXJ0XSA9IHRoaXNbaSArIHN0YXJ0XVxuICB9IGVsc2Uge1xuICAgIHRhcmdldC5fc2V0KHRoaXMuc3ViYXJyYXkoc3RhcnQsIHN0YXJ0ICsgbGVuKSwgdGFyZ2V0X3N0YXJ0KVxuICB9XG59XG5cbmZ1bmN0aW9uIF9iYXNlNjRTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIGlmIChzdGFydCA9PT0gMCAmJiBlbmQgPT09IGJ1Zi5sZW5ndGgpIHtcbiAgICByZXR1cm4gYmFzZTY0LmZyb21CeXRlQXJyYXkoYnVmKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYuc2xpY2Uoc3RhcnQsIGVuZCkpXG4gIH1cbn1cblxuZnVuY3Rpb24gX3V0ZjhTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciByZXMgPSAnJ1xuICB2YXIgdG1wID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgaWYgKGJ1ZltpXSA8PSAweDdGKSB7XG4gICAgICByZXMgKz0gZGVjb2RlVXRmOENoYXIodG1wKSArIFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldKVxuICAgICAgdG1wID0gJydcbiAgICB9IGVsc2Uge1xuICAgICAgdG1wICs9ICclJyArIGJ1ZltpXS50b1N0cmluZygxNilcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzICsgZGVjb2RlVXRmOENoYXIodG1wKVxufVxuXG5mdW5jdGlvbiBfYXNjaWlTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciByZXQgPSAnJ1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspXG4gICAgcmV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldKVxuICByZXR1cm4gcmV0XG59XG5cbmZ1bmN0aW9uIF9iaW5hcnlTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHJldHVybiBfYXNjaWlTbGljZShidWYsIHN0YXJ0LCBlbmQpXG59XG5cbmZ1bmN0aW9uIF9oZXhTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG5cbiAgaWYgKCFzdGFydCB8fCBzdGFydCA8IDApIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCB8fCBlbmQgPCAwIHx8IGVuZCA+IGxlbikgZW5kID0gbGVuXG5cbiAgdmFyIG91dCA9ICcnXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgb3V0ICs9IHRvSGV4KGJ1ZltpXSlcbiAgfVxuICByZXR1cm4gb3V0XG59XG5cbmZ1bmN0aW9uIF91dGYxNmxlU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgYnl0ZXMgPSBidWYuc2xpY2Uoc3RhcnQsIGVuZClcbiAgdmFyIHJlcyA9ICcnXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYnl0ZXMubGVuZ3RoOyBpICs9IDIpIHtcbiAgICByZXMgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShieXRlc1tpXSArIGJ5dGVzW2krMV0gKiAyNTYpXG4gIH1cbiAgcmV0dXJuIHJlc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnNsaWNlID0gZnVuY3Rpb24gKHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIHN0YXJ0ID0gY2xhbXAoc3RhcnQsIGxlbiwgMClcbiAgZW5kID0gY2xhbXAoZW5kLCBsZW4sIGxlbilcblxuICBpZiAoQnVmZmVyLl91c2VUeXBlZEFycmF5cykge1xuICAgIHJldHVybiBCdWZmZXIuX2F1Z21lbnQodGhpcy5zdWJhcnJheShzdGFydCwgZW5kKSlcbiAgfSBlbHNlIHtcbiAgICB2YXIgc2xpY2VMZW4gPSBlbmQgLSBzdGFydFxuICAgIHZhciBuZXdCdWYgPSBuZXcgQnVmZmVyKHNsaWNlTGVuLCB1bmRlZmluZWQsIHRydWUpXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzbGljZUxlbjsgaSsrKSB7XG4gICAgICBuZXdCdWZbaV0gPSB0aGlzW2kgKyBzdGFydF1cbiAgICB9XG4gICAgcmV0dXJuIG5ld0J1ZlxuICB9XG59XG5cbi8vIGBnZXRgIHdpbGwgYmUgcmVtb3ZlZCBpbiBOb2RlIDAuMTMrXG5CdWZmZXIucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChvZmZzZXQpIHtcbiAgY29uc29sZS5sb2coJy5nZXQoKSBpcyBkZXByZWNhdGVkLiBBY2Nlc3MgdXNpbmcgYXJyYXkgaW5kZXhlcyBpbnN0ZWFkLicpXG4gIHJldHVybiB0aGlzLnJlYWRVSW50OChvZmZzZXQpXG59XG5cbi8vIGBzZXRgIHdpbGwgYmUgcmVtb3ZlZCBpbiBOb2RlIDAuMTMrXG5CdWZmZXIucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uICh2LCBvZmZzZXQpIHtcbiAgY29uc29sZS5sb2coJy5zZXQoKSBpcyBkZXByZWNhdGVkLiBBY2Nlc3MgdXNpbmcgYXJyYXkgaW5kZXhlcyBpbnN0ZWFkLicpXG4gIHJldHVybiB0aGlzLndyaXRlVUludDgodiwgb2Zmc2V0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50OCA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgPCB0aGlzLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gdGhpcy5sZW5ndGgpXG4gICAgcmV0dXJuXG5cbiAgcmV0dXJuIHRoaXNbb2Zmc2V0XVxufVxuXG5mdW5jdGlvbiBfcmVhZFVJbnQxNiAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAxIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIHZhciB2YWxcbiAgaWYgKGxpdHRsZUVuZGlhbikge1xuICAgIHZhbCA9IGJ1ZltvZmZzZXRdXG4gICAgaWYgKG9mZnNldCArIDEgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDFdIDw8IDhcbiAgfSBlbHNlIHtcbiAgICB2YWwgPSBidWZbb2Zmc2V0XSA8PCA4XG4gICAgaWYgKG9mZnNldCArIDEgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDFdXG4gIH1cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZFVJbnQxNih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZFVJbnQxNih0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3JlYWRVSW50MzIgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICB2YXIgdmFsXG4gIGlmIChsaXR0bGVFbmRpYW4pIHtcbiAgICBpZiAob2Zmc2V0ICsgMiA8IGxlbilcbiAgICAgIHZhbCA9IGJ1ZltvZmZzZXQgKyAyXSA8PCAxNlxuICAgIGlmIChvZmZzZXQgKyAxIDwgbGVuKVxuICAgICAgdmFsIHw9IGJ1ZltvZmZzZXQgKyAxXSA8PCA4XG4gICAgdmFsIHw9IGJ1ZltvZmZzZXRdXG4gICAgaWYgKG9mZnNldCArIDMgPCBsZW4pXG4gICAgICB2YWwgPSB2YWwgKyAoYnVmW29mZnNldCArIDNdIDw8IDI0ID4+PiAwKVxuICB9IGVsc2Uge1xuICAgIGlmIChvZmZzZXQgKyAxIDwgbGVuKVxuICAgICAgdmFsID0gYnVmW29mZnNldCArIDFdIDw8IDE2XG4gICAgaWYgKG9mZnNldCArIDIgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDJdIDw8IDhcbiAgICBpZiAob2Zmc2V0ICsgMyA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgM11cbiAgICB2YWwgPSB2YWwgKyAoYnVmW29mZnNldF0gPDwgMjQgPj4+IDApXG4gIH1cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZFVJbnQzMih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZFVJbnQzMih0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50OCA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLFxuICAgICAgICAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgPCB0aGlzLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gdGhpcy5sZW5ndGgpXG4gICAgcmV0dXJuXG5cbiAgdmFyIG5lZyA9IHRoaXNbb2Zmc2V0XSAmIDB4ODBcbiAgaWYgKG5lZylcbiAgICByZXR1cm4gKDB4ZmYgLSB0aGlzW29mZnNldF0gKyAxKSAqIC0xXG4gIGVsc2VcbiAgICByZXR1cm4gdGhpc1tvZmZzZXRdXG59XG5cbmZ1bmN0aW9uIF9yZWFkSW50MTYgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMSA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICB2YXIgdmFsID0gX3JlYWRVSW50MTYoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgdHJ1ZSlcbiAgdmFyIG5lZyA9IHZhbCAmIDB4ODAwMFxuICBpZiAobmVnKVxuICAgIHJldHVybiAoMHhmZmZmIC0gdmFsICsgMSkgKiAtMVxuICBlbHNlXG4gICAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MTYodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEludDE2KHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfcmVhZEludDMyIChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgdmFyIHZhbCA9IF9yZWFkVUludDMyKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIHRydWUpXG4gIHZhciBuZWcgPSB2YWwgJiAweDgwMDAwMDAwXG4gIGlmIChuZWcpXG4gICAgcmV0dXJuICgweGZmZmZmZmZmIC0gdmFsICsgMSkgKiAtMVxuICBlbHNlXG4gICAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MzIodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEludDMyKHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfcmVhZEZsb2F0IChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHJldHVybiBpZWVlNzU0LnJlYWQoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0TEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRGbG9hdCh0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdEJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkRmxvYXQodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF9yZWFkRG91YmxlIChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgKyA3IDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHJldHVybiBpZWVlNzU0LnJlYWQoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgNTIsIDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkRG91YmxlKHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkRG91YmxlKHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDggPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0IDwgdGhpcy5sZW5ndGgsICd0cnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmdWludCh2YWx1ZSwgMHhmZilcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gdGhpcy5sZW5ndGgpIHJldHVyblxuXG4gIHRoaXNbb2Zmc2V0XSA9IHZhbHVlXG59XG5cbmZ1bmN0aW9uIF93cml0ZVVJbnQxNiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAxIDwgYnVmLmxlbmd0aCwgJ3RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZ1aW50KHZhbHVlLCAweGZmZmYpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBmb3IgKHZhciBpID0gMCwgaiA9IE1hdGgubWluKGxlbiAtIG9mZnNldCwgMik7IGkgPCBqOyBpKyspIHtcbiAgICBidWZbb2Zmc2V0ICsgaV0gPVxuICAgICAgICAodmFsdWUgJiAoMHhmZiA8PCAoOCAqIChsaXR0bGVFbmRpYW4gPyBpIDogMSAtIGkpKSkpID4+PlxuICAgICAgICAgICAgKGxpdHRsZUVuZGlhbiA/IGkgOiAxIC0gaSkgKiA4XG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZVVJbnQzMiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ3RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZ1aW50KHZhbHVlLCAweGZmZmZmZmZmKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgZm9yICh2YXIgaSA9IDAsIGogPSBNYXRoLm1pbihsZW4gLSBvZmZzZXQsIDQpOyBpIDwgajsgaSsrKSB7XG4gICAgYnVmW29mZnNldCArIGldID1cbiAgICAgICAgKHZhbHVlID4+PiAobGl0dGxlRW5kaWFuID8gaSA6IDMgLSBpKSAqIDgpICYgMHhmZlxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50OCA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgPCB0aGlzLmxlbmd0aCwgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZzaW50KHZhbHVlLCAweDdmLCAtMHg4MClcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gdGhpcy5sZW5ndGgpXG4gICAgcmV0dXJuXG5cbiAgaWYgKHZhbHVlID49IDApXG4gICAgdGhpcy53cml0ZVVJbnQ4KHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KVxuICBlbHNlXG4gICAgdGhpcy53cml0ZVVJbnQ4KDB4ZmYgKyB2YWx1ZSArIDEsIG9mZnNldCwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZUludDE2IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDEgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnNpbnQodmFsdWUsIDB4N2ZmZiwgLTB4ODAwMClcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGlmICh2YWx1ZSA+PSAwKVxuICAgIF93cml0ZVVJbnQxNihidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpXG4gIGVsc2VcbiAgICBfd3JpdGVVSW50MTYoYnVmLCAweGZmZmYgKyB2YWx1ZSArIDEsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2TEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlSW50MzIgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmc2ludCh2YWx1ZSwgMHg3ZmZmZmZmZiwgLTB4ODAwMDAwMDApXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBpZiAodmFsdWUgPj0gMClcbiAgICBfd3JpdGVVSW50MzIoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KVxuICBlbHNlXG4gICAgX3dyaXRlVUludDMyKGJ1ZiwgMHhmZmZmZmZmZiArIHZhbHVlICsgMSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyQkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVGbG9hdCAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZJRUVFNzU0KHZhbHVlLCAzLjQwMjgyMzQ2NjM4NTI4ODZlKzM4LCAtMy40MDI4MjM0NjYzODUyODg2ZSszOClcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDIzLCA0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0QkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlRmxvYXQodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVEb3VibGUgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgNyA8IGJ1Zi5sZW5ndGgsXG4gICAgICAgICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmSUVFRTc1NCh2YWx1ZSwgMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgsIC0xLjc5NzY5MzEzNDg2MjMxNTdFKzMwOClcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDUyLCA4KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlTEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlQkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuLy8gZmlsbCh2YWx1ZSwgc3RhcnQ9MCwgZW5kPWJ1ZmZlci5sZW5ndGgpXG5CdWZmZXIucHJvdG90eXBlLmZpbGwgPSBmdW5jdGlvbiAodmFsdWUsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKCF2YWx1ZSkgdmFsdWUgPSAwXG4gIGlmICghc3RhcnQpIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCkgZW5kID0gdGhpcy5sZW5ndGhcblxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgIHZhbHVlID0gdmFsdWUuY2hhckNvZGVBdCgwKVxuICB9XG5cbiAgYXNzZXJ0KHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgIWlzTmFOKHZhbHVlKSwgJ3ZhbHVlIGlzIG5vdCBhIG51bWJlcicpXG4gIGFzc2VydChlbmQgPj0gc3RhcnQsICdlbmQgPCBzdGFydCcpXG5cbiAgLy8gRmlsbCAwIGJ5dGVzOyB3ZSdyZSBkb25lXG4gIGlmIChlbmQgPT09IHN0YXJ0KSByZXR1cm5cbiAgaWYgKHRoaXMubGVuZ3RoID09PSAwKSByZXR1cm5cblxuICBhc3NlcnQoc3RhcnQgPj0gMCAmJiBzdGFydCA8IHRoaXMubGVuZ3RoLCAnc3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIGFzc2VydChlbmQgPj0gMCAmJiBlbmQgPD0gdGhpcy5sZW5ndGgsICdlbmQgb3V0IG9mIGJvdW5kcycpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICB0aGlzW2ldID0gdmFsdWVcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmluc3BlY3QgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBvdXQgPSBbXVxuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgIG91dFtpXSA9IHRvSGV4KHRoaXNbaV0pXG4gICAgaWYgKGkgPT09IGV4cG9ydHMuSU5TUEVDVF9NQVhfQllURVMpIHtcbiAgICAgIG91dFtpICsgMV0gPSAnLi4uJ1xuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cbiAgcmV0dXJuICc8QnVmZmVyICcgKyBvdXQuam9pbignICcpICsgJz4nXG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBgQXJyYXlCdWZmZXJgIHdpdGggdGhlICpjb3BpZWQqIG1lbW9yeSBvZiB0aGUgYnVmZmVyIGluc3RhbmNlLlxuICogQWRkZWQgaW4gTm9kZSAwLjEyLiBPbmx5IGF2YWlsYWJsZSBpbiBicm93c2VycyB0aGF0IHN1cHBvcnQgQXJyYXlCdWZmZXIuXG4gKi9cbkJ1ZmZlci5wcm90b3R5cGUudG9BcnJheUJ1ZmZlciA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHR5cGVvZiBVaW50OEFycmF5ICE9PSAndW5kZWZpbmVkJykge1xuICAgIGlmIChCdWZmZXIuX3VzZVR5cGVkQXJyYXlzKSB7XG4gICAgICByZXR1cm4gKG5ldyBCdWZmZXIodGhpcykpLmJ1ZmZlclxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgYnVmID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5sZW5ndGgpXG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gYnVmLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAxKVxuICAgICAgICBidWZbaV0gPSB0aGlzW2ldXG4gICAgICByZXR1cm4gYnVmLmJ1ZmZlclxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0J1ZmZlci50b0FycmF5QnVmZmVyIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBicm93c2VyJylcbiAgfVxufVxuXG4vLyBIRUxQRVIgRlVOQ1RJT05TXG4vLyA9PT09PT09PT09PT09PT09XG5cbmZ1bmN0aW9uIHN0cmluZ3RyaW0gKHN0cikge1xuICBpZiAoc3RyLnRyaW0pIHJldHVybiBzdHIudHJpbSgpXG4gIHJldHVybiBzdHIucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpXG59XG5cbnZhciBCUCA9IEJ1ZmZlci5wcm90b3R5cGVcblxuLyoqXG4gKiBBdWdtZW50IGEgVWludDhBcnJheSAqaW5zdGFuY2UqIChub3QgdGhlIFVpbnQ4QXJyYXkgY2xhc3MhKSB3aXRoIEJ1ZmZlciBtZXRob2RzXG4gKi9cbkJ1ZmZlci5fYXVnbWVudCA9IGZ1bmN0aW9uIChhcnIpIHtcbiAgYXJyLl9pc0J1ZmZlciA9IHRydWVcblxuICAvLyBzYXZlIHJlZmVyZW5jZSB0byBvcmlnaW5hbCBVaW50OEFycmF5IGdldC9zZXQgbWV0aG9kcyBiZWZvcmUgb3ZlcndyaXRpbmdcbiAgYXJyLl9nZXQgPSBhcnIuZ2V0XG4gIGFyci5fc2V0ID0gYXJyLnNldFxuXG4gIC8vIGRlcHJlY2F0ZWQsIHdpbGwgYmUgcmVtb3ZlZCBpbiBub2RlIDAuMTMrXG4gIGFyci5nZXQgPSBCUC5nZXRcbiAgYXJyLnNldCA9IEJQLnNldFxuXG4gIGFyci53cml0ZSA9IEJQLndyaXRlXG4gIGFyci50b1N0cmluZyA9IEJQLnRvU3RyaW5nXG4gIGFyci50b0xvY2FsZVN0cmluZyA9IEJQLnRvU3RyaW5nXG4gIGFyci50b0pTT04gPSBCUC50b0pTT05cbiAgYXJyLmNvcHkgPSBCUC5jb3B5XG4gIGFyci5zbGljZSA9IEJQLnNsaWNlXG4gIGFyci5yZWFkVUludDggPSBCUC5yZWFkVUludDhcbiAgYXJyLnJlYWRVSW50MTZMRSA9IEJQLnJlYWRVSW50MTZMRVxuICBhcnIucmVhZFVJbnQxNkJFID0gQlAucmVhZFVJbnQxNkJFXG4gIGFyci5yZWFkVUludDMyTEUgPSBCUC5yZWFkVUludDMyTEVcbiAgYXJyLnJlYWRVSW50MzJCRSA9IEJQLnJlYWRVSW50MzJCRVxuICBhcnIucmVhZEludDggPSBCUC5yZWFkSW50OFxuICBhcnIucmVhZEludDE2TEUgPSBCUC5yZWFkSW50MTZMRVxuICBhcnIucmVhZEludDE2QkUgPSBCUC5yZWFkSW50MTZCRVxuICBhcnIucmVhZEludDMyTEUgPSBCUC5yZWFkSW50MzJMRVxuICBhcnIucmVhZEludDMyQkUgPSBCUC5yZWFkSW50MzJCRVxuICBhcnIucmVhZEZsb2F0TEUgPSBCUC5yZWFkRmxvYXRMRVxuICBhcnIucmVhZEZsb2F0QkUgPSBCUC5yZWFkRmxvYXRCRVxuICBhcnIucmVhZERvdWJsZUxFID0gQlAucmVhZERvdWJsZUxFXG4gIGFyci5yZWFkRG91YmxlQkUgPSBCUC5yZWFkRG91YmxlQkVcbiAgYXJyLndyaXRlVUludDggPSBCUC53cml0ZVVJbnQ4XG4gIGFyci53cml0ZVVJbnQxNkxFID0gQlAud3JpdGVVSW50MTZMRVxuICBhcnIud3JpdGVVSW50MTZCRSA9IEJQLndyaXRlVUludDE2QkVcbiAgYXJyLndyaXRlVUludDMyTEUgPSBCUC53cml0ZVVJbnQzMkxFXG4gIGFyci53cml0ZVVJbnQzMkJFID0gQlAud3JpdGVVSW50MzJCRVxuICBhcnIud3JpdGVJbnQ4ID0gQlAud3JpdGVJbnQ4XG4gIGFyci53cml0ZUludDE2TEUgPSBCUC53cml0ZUludDE2TEVcbiAgYXJyLndyaXRlSW50MTZCRSA9IEJQLndyaXRlSW50MTZCRVxuICBhcnIud3JpdGVJbnQzMkxFID0gQlAud3JpdGVJbnQzMkxFXG4gIGFyci53cml0ZUludDMyQkUgPSBCUC53cml0ZUludDMyQkVcbiAgYXJyLndyaXRlRmxvYXRMRSA9IEJQLndyaXRlRmxvYXRMRVxuICBhcnIud3JpdGVGbG9hdEJFID0gQlAud3JpdGVGbG9hdEJFXG4gIGFyci53cml0ZURvdWJsZUxFID0gQlAud3JpdGVEb3VibGVMRVxuICBhcnIud3JpdGVEb3VibGVCRSA9IEJQLndyaXRlRG91YmxlQkVcbiAgYXJyLmZpbGwgPSBCUC5maWxsXG4gIGFyci5pbnNwZWN0ID0gQlAuaW5zcGVjdFxuICBhcnIudG9BcnJheUJ1ZmZlciA9IEJQLnRvQXJyYXlCdWZmZXJcblxuICByZXR1cm4gYXJyXG59XG5cbi8vIHNsaWNlKHN0YXJ0LCBlbmQpXG5mdW5jdGlvbiBjbGFtcCAoaW5kZXgsIGxlbiwgZGVmYXVsdFZhbHVlKSB7XG4gIGlmICh0eXBlb2YgaW5kZXggIT09ICdudW1iZXInKSByZXR1cm4gZGVmYXVsdFZhbHVlXG4gIGluZGV4ID0gfn5pbmRleDsgIC8vIENvZXJjZSB0byBpbnRlZ2VyLlxuICBpZiAoaW5kZXggPj0gbGVuKSByZXR1cm4gbGVuXG4gIGlmIChpbmRleCA+PSAwKSByZXR1cm4gaW5kZXhcbiAgaW5kZXggKz0gbGVuXG4gIGlmIChpbmRleCA+PSAwKSByZXR1cm4gaW5kZXhcbiAgcmV0dXJuIDBcbn1cblxuZnVuY3Rpb24gY29lcmNlIChsZW5ndGgpIHtcbiAgLy8gQ29lcmNlIGxlbmd0aCB0byBhIG51bWJlciAocG9zc2libHkgTmFOKSwgcm91bmQgdXBcbiAgLy8gaW4gY2FzZSBpdCdzIGZyYWN0aW9uYWwgKGUuZy4gMTIzLjQ1NikgdGhlbiBkbyBhXG4gIC8vIGRvdWJsZSBuZWdhdGUgdG8gY29lcmNlIGEgTmFOIHRvIDAuIEVhc3ksIHJpZ2h0P1xuICBsZW5ndGggPSB+fk1hdGguY2VpbCgrbGVuZ3RoKVxuICByZXR1cm4gbGVuZ3RoIDwgMCA/IDAgOiBsZW5ndGhcbn1cblxuZnVuY3Rpb24gaXNBcnJheSAoc3ViamVjdCkge1xuICByZXR1cm4gKEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gKHN1YmplY3QpIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHN1YmplY3QpID09PSAnW29iamVjdCBBcnJheV0nXG4gIH0pKHN1YmplY3QpXG59XG5cbmZ1bmN0aW9uIGlzQXJyYXlpc2ggKHN1YmplY3QpIHtcbiAgcmV0dXJuIGlzQXJyYXkoc3ViamVjdCkgfHwgQnVmZmVyLmlzQnVmZmVyKHN1YmplY3QpIHx8XG4gICAgICBzdWJqZWN0ICYmIHR5cGVvZiBzdWJqZWN0ID09PSAnb2JqZWN0JyAmJlxuICAgICAgdHlwZW9mIHN1YmplY3QubGVuZ3RoID09PSAnbnVtYmVyJ1xufVxuXG5mdW5jdGlvbiB0b0hleCAobikge1xuICBpZiAobiA8IDE2KSByZXR1cm4gJzAnICsgbi50b1N0cmluZygxNilcbiAgcmV0dXJuIG4udG9TdHJpbmcoMTYpXG59XG5cbmZ1bmN0aW9uIHV0ZjhUb0J5dGVzIChzdHIpIHtcbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGIgPSBzdHIuY2hhckNvZGVBdChpKVxuICAgIGlmIChiIDw9IDB4N0YpXG4gICAgICBieXRlQXJyYXkucHVzaChzdHIuY2hhckNvZGVBdChpKSlcbiAgICBlbHNlIHtcbiAgICAgIHZhciBzdGFydCA9IGlcbiAgICAgIGlmIChiID49IDB4RDgwMCAmJiBiIDw9IDB4REZGRikgaSsrXG4gICAgICB2YXIgaCA9IGVuY29kZVVSSUNvbXBvbmVudChzdHIuc2xpY2Uoc3RhcnQsIGkrMSkpLnN1YnN0cigxKS5zcGxpdCgnJScpXG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGgubGVuZ3RoOyBqKyspXG4gICAgICAgIGJ5dGVBcnJheS5wdXNoKHBhcnNlSW50KGhbal0sIDE2KSlcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiBhc2NpaVRvQnl0ZXMgKHN0cikge1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICAvLyBOb2RlJ3MgY29kZSBzZWVtcyB0byBiZSBkb2luZyB0aGlzIGFuZCBub3QgJiAweDdGLi5cbiAgICBieXRlQXJyYXkucHVzaChzdHIuY2hhckNvZGVBdChpKSAmIDB4RkYpXG4gIH1cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiB1dGYxNmxlVG9CeXRlcyAoc3RyKSB7XG4gIHZhciBjLCBoaSwgbG9cbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgYyA9IHN0ci5jaGFyQ29kZUF0KGkpXG4gICAgaGkgPSBjID4+IDhcbiAgICBsbyA9IGMgJSAyNTZcbiAgICBieXRlQXJyYXkucHVzaChsbylcbiAgICBieXRlQXJyYXkucHVzaChoaSlcbiAgfVxuXG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuZnVuY3Rpb24gYmFzZTY0VG9CeXRlcyAoc3RyKSB7XG4gIHJldHVybiBiYXNlNjQudG9CeXRlQXJyYXkoc3RyKVxufVxuXG5mdW5jdGlvbiBibGl0QnVmZmVyIChzcmMsIGRzdCwgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIHBvc1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKChpICsgb2Zmc2V0ID49IGRzdC5sZW5ndGgpIHx8IChpID49IHNyYy5sZW5ndGgpKVxuICAgICAgYnJlYWtcbiAgICBkc3RbaSArIG9mZnNldF0gPSBzcmNbaV1cbiAgfVxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiBkZWNvZGVVdGY4Q2hhciAoc3RyKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChzdHIpXG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKDB4RkZGRCkgLy8gVVRGIDggaW52YWxpZCBjaGFyXG4gIH1cbn1cblxuLypcbiAqIFdlIGhhdmUgdG8gbWFrZSBzdXJlIHRoYXQgdGhlIHZhbHVlIGlzIGEgdmFsaWQgaW50ZWdlci4gVGhpcyBtZWFucyB0aGF0IGl0XG4gKiBpcyBub24tbmVnYXRpdmUuIEl0IGhhcyBubyBmcmFjdGlvbmFsIGNvbXBvbmVudCBhbmQgdGhhdCBpdCBkb2VzIG5vdFxuICogZXhjZWVkIHRoZSBtYXhpbXVtIGFsbG93ZWQgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIHZlcmlmdWludCAodmFsdWUsIG1heCkge1xuICBhc3NlcnQodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJywgJ2Nhbm5vdCB3cml0ZSBhIG5vbi1udW1iZXIgYXMgYSBudW1iZXInKVxuICBhc3NlcnQodmFsdWUgPj0gMCwgJ3NwZWNpZmllZCBhIG5lZ2F0aXZlIHZhbHVlIGZvciB3cml0aW5nIGFuIHVuc2lnbmVkIHZhbHVlJylcbiAgYXNzZXJ0KHZhbHVlIDw9IG1heCwgJ3ZhbHVlIGlzIGxhcmdlciB0aGFuIG1heGltdW0gdmFsdWUgZm9yIHR5cGUnKVxuICBhc3NlcnQoTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlLCAndmFsdWUgaGFzIGEgZnJhY3Rpb25hbCBjb21wb25lbnQnKVxufVxuXG5mdW5jdGlvbiB2ZXJpZnNpbnQgKHZhbHVlLCBtYXgsIG1pbikge1xuICBhc3NlcnQodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJywgJ2Nhbm5vdCB3cml0ZSBhIG5vbi1udW1iZXIgYXMgYSBudW1iZXInKVxuICBhc3NlcnQodmFsdWUgPD0gbWF4LCAndmFsdWUgbGFyZ2VyIHRoYW4gbWF4aW11bSBhbGxvd2VkIHZhbHVlJylcbiAgYXNzZXJ0KHZhbHVlID49IG1pbiwgJ3ZhbHVlIHNtYWxsZXIgdGhhbiBtaW5pbXVtIGFsbG93ZWQgdmFsdWUnKVxuICBhc3NlcnQoTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlLCAndmFsdWUgaGFzIGEgZnJhY3Rpb25hbCBjb21wb25lbnQnKVxufVxuXG5mdW5jdGlvbiB2ZXJpZklFRUU3NTQgKHZhbHVlLCBtYXgsIG1pbikge1xuICBhc3NlcnQodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJywgJ2Nhbm5vdCB3cml0ZSBhIG5vbi1udW1iZXIgYXMgYSBudW1iZXInKVxuICBhc3NlcnQodmFsdWUgPD0gbWF4LCAndmFsdWUgbGFyZ2VyIHRoYW4gbWF4aW11bSBhbGxvd2VkIHZhbHVlJylcbiAgYXNzZXJ0KHZhbHVlID49IG1pbiwgJ3ZhbHVlIHNtYWxsZXIgdGhhbiBtaW5pbXVtIGFsbG93ZWQgdmFsdWUnKVxufVxuXG5mdW5jdGlvbiBhc3NlcnQgKHRlc3QsIG1lc3NhZ2UpIHtcbiAgaWYgKCF0ZXN0KSB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSB8fCAnRmFpbGVkIGFzc2VydGlvbicpXG59XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiRlQ1T1JzXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2J1ZmZlci9pbmRleC5qc1wiLFwiLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9idWZmZXJcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG5leHBvcnRzLnJlYWQgPSBmdW5jdGlvbiAoYnVmZmVyLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbVxuICB2YXIgZUxlbiA9IG5CeXRlcyAqIDggLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIG5CaXRzID0gLTdcbiAgdmFyIGkgPSBpc0xFID8gKG5CeXRlcyAtIDEpIDogMFxuICB2YXIgZCA9IGlzTEUgPyAtMSA6IDFcbiAgdmFyIHMgPSBidWZmZXJbb2Zmc2V0ICsgaV1cblxuICBpICs9IGRcblxuICBlID0gcyAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBzID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBlTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IGUgPSBlICogMjU2ICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpIHt9XG5cbiAgbSA9IGUgJiAoKDEgPDwgKC1uQml0cykpIC0gMSlcbiAgZSA+Pj0gKC1uQml0cylcbiAgbkJpdHMgKz0gbUxlblxuICBmb3IgKDsgbkJpdHMgPiAwOyBtID0gbSAqIDI1NiArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KSB7fVxuXG4gIGlmIChlID09PSAwKSB7XG4gICAgZSA9IDEgLSBlQmlhc1xuICB9IGVsc2UgaWYgKGUgPT09IGVNYXgpIHtcbiAgICByZXR1cm4gbSA/IE5hTiA6ICgocyA/IC0xIDogMSkgKiBJbmZpbml0eSlcbiAgfSBlbHNlIHtcbiAgICBtID0gbSArIE1hdGgucG93KDIsIG1MZW4pXG4gICAgZSA9IGUgLSBlQmlhc1xuICB9XG4gIHJldHVybiAocyA/IC0xIDogMSkgKiBtICogTWF0aC5wb3coMiwgZSAtIG1MZW4pXG59XG5cbmV4cG9ydHMud3JpdGUgPSBmdW5jdGlvbiAoYnVmZmVyLCB2YWx1ZSwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG0sIGNcbiAgdmFyIGVMZW4gPSBuQnl0ZXMgKiA4IC0gbUxlbiAtIDFcbiAgdmFyIGVNYXggPSAoMSA8PCBlTGVuKSAtIDFcbiAgdmFyIGVCaWFzID0gZU1heCA+PiAxXG4gIHZhciBydCA9IChtTGVuID09PSAyMyA/IE1hdGgucG93KDIsIC0yNCkgLSBNYXRoLnBvdygyLCAtNzcpIDogMClcbiAgdmFyIGkgPSBpc0xFID8gMCA6IChuQnl0ZXMgLSAxKVxuICB2YXIgZCA9IGlzTEUgPyAxIDogLTFcbiAgdmFyIHMgPSB2YWx1ZSA8IDAgfHwgKHZhbHVlID09PSAwICYmIDEgLyB2YWx1ZSA8IDApID8gMSA6IDBcblxuICB2YWx1ZSA9IE1hdGguYWJzKHZhbHVlKVxuXG4gIGlmIChpc05hTih2YWx1ZSkgfHwgdmFsdWUgPT09IEluZmluaXR5KSB7XG4gICAgbSA9IGlzTmFOKHZhbHVlKSA/IDEgOiAwXG4gICAgZSA9IGVNYXhcbiAgfSBlbHNlIHtcbiAgICBlID0gTWF0aC5mbG9vcihNYXRoLmxvZyh2YWx1ZSkgLyBNYXRoLkxOMilcbiAgICBpZiAodmFsdWUgKiAoYyA9IE1hdGgucG93KDIsIC1lKSkgPCAxKSB7XG4gICAgICBlLS1cbiAgICAgIGMgKj0gMlxuICAgIH1cbiAgICBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIHZhbHVlICs9IHJ0IC8gY1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSArPSBydCAqIE1hdGgucG93KDIsIDEgLSBlQmlhcylcbiAgICB9XG4gICAgaWYgKHZhbHVlICogYyA+PSAyKSB7XG4gICAgICBlKytcbiAgICAgIGMgLz0gMlxuICAgIH1cblxuICAgIGlmIChlICsgZUJpYXMgPj0gZU1heCkge1xuICAgICAgbSA9IDBcbiAgICAgIGUgPSBlTWF4XG4gICAgfSBlbHNlIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgbSA9ICh2YWx1ZSAqIGMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pXG4gICAgICBlID0gZSArIGVCaWFzXG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSB2YWx1ZSAqIE1hdGgucG93KDIsIGVCaWFzIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKVxuICAgICAgZSA9IDBcbiAgICB9XG4gIH1cblxuICBmb3IgKDsgbUxlbiA+PSA4OyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBtICYgMHhmZiwgaSArPSBkLCBtIC89IDI1NiwgbUxlbiAtPSA4KSB7fVxuXG4gIGUgPSAoZSA8PCBtTGVuKSB8IG1cbiAgZUxlbiArPSBtTGVuXG4gIGZvciAoOyBlTGVuID4gMDsgYnVmZmVyW29mZnNldCArIGldID0gZSAmIDB4ZmYsIGkgKz0gZCwgZSAvPSAyNTYsIGVMZW4gLT0gOCkge31cblxuICBidWZmZXJbb2Zmc2V0ICsgaSAtIGRdIHw9IHMgKiAxMjhcbn1cblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJGVDVPUnNcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvaWVlZTc1NC9pbmRleC5qc1wiLFwiLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9pZWVlNzU0XCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxucHJvY2Vzcy5uZXh0VGljayA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNhblNldEltbWVkaWF0ZSA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnNldEltbWVkaWF0ZTtcbiAgICB2YXIgY2FuUG9zdCA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnBvc3RNZXNzYWdlICYmIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyXG4gICAgO1xuXG4gICAgaWYgKGNhblNldEltbWVkaWF0ZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIHdpbmRvdy5zZXRJbW1lZGlhdGUoZikgfTtcbiAgICB9XG5cbiAgICBpZiAoY2FuUG9zdCkge1xuICAgICAgICB2YXIgcXVldWUgPSBbXTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgICAgIHZhciBzb3VyY2UgPSBldi5zb3VyY2U7XG4gICAgICAgICAgICBpZiAoKHNvdXJjZSA9PT0gd2luZG93IHx8IHNvdXJjZSA9PT0gbnVsbCkgJiYgZXYuZGF0YSA9PT0gJ3Byb2Nlc3MtdGljaycpIHtcbiAgICAgICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICBpZiAocXVldWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZm4gPSBxdWV1ZS5zaGlmdCgpO1xuICAgICAgICAgICAgICAgICAgICBmbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdHJ1ZSk7XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgICAgICBxdWV1ZS5wdXNoKGZuKTtcbiAgICAgICAgICAgIHdpbmRvdy5wb3N0TWVzc2FnZSgncHJvY2Vzcy10aWNrJywgJyonKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgc2V0VGltZW91dChmbiwgMCk7XG4gICAgfTtcbn0pKCk7XG5cbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufVxuXG4vLyBUT0RPKHNodHlsbWFuKVxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiRlQ1T1JzXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qc1wiLFwiLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9wcm9jZXNzXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBfdG9Db25zdW1hYmxlQXJyYXkoYXJyKSB7IGlmIChBcnJheS5pc0FycmF5KGFycikpIHsgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBBcnJheShhcnIubGVuZ3RoKTsgaSA8IGFyci5sZW5ndGg7IGkrKykgeyBhcnIyW2ldID0gYXJyW2ldOyB9IHJldHVybiBhcnIyOyB9IGVsc2UgeyByZXR1cm4gQXJyYXkuZnJvbShhcnIpOyB9IH1cblxudmFyIHRpbWUgPSA3NTA7XG52YXIgc2VjdGlvbjNJZHggPSAwO1xudmFyIHNlY3Rpb240SWR4ID0gMDtcblxudmFyIG1hc3Rlck9iaiA9IHtcblx0c2VjdGlvbjJDdXJyZW50SWR4OiAwLFxuXHRzZWN0aW9uMUN1cnJlbnRJZHg6IDAsXG5cdHNlY3Rpb24zOiB7XG5cdFx0YXV0b21hdGU6ICcnLFxuXHRcdGlzQXV0b21hdGVkOiBmYWxzZVxuXHR9LFxuXHRzZWN0aW9uNDoge1xuXHRcdGF1dG9tYXRlOiAnJyxcblx0XHRpc0F1dG9tYXRlZDogZmFsc2Vcblx0fSxcblx0YmFza2V0YmFsbDogeyBsb29wQW1vdW50OiAxIH0sXG5cdGZvb3RiYWxsOiB7IGxvb3BBbW91bnQ6IDEgfSxcblx0dGVubmlzOiB7IGxvb3BBbW91bnQ6IDEgfSxcblx0YmFzZWJhbGw6IHsgbG9vcEFtb3VudDogMSB9LFxuXHRmYW46IHsgbG9vcEFtb3VudDogMSB9XG59O1xuXG52YXIgaG9tZXBhZ2VNb2JJbWFnZXMgPSBbJ2Fzc2V0cy9pbWFnZXMvaG9tZXBhZ2VNb2IvYmFza2V0YmFsbC5qcGcnLCAnYXNzZXRzL2ltYWdlcy9ob21lcGFnZU1vYi9mb290YmFsbC5qcGcnLCAnYXNzZXRzL2ltYWdlcy9ob21lcGFnZU1vYi90ZW5uaXMuanBnJywgJ2Fzc2V0cy9pbWFnZXMvaG9tZXBhZ2VNb2IvYmFzZWJhbGwuanBnJywgJ2Fzc2V0cy9pbWFnZXMvaG9tZXBhZ2VNb2IvZmFuLmpwZyddO1xuXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG5cdGlmICh3aW5kb3cuaW5uZXJXaWR0aCA8IDgwMCkge1xuXHRcdC8vIElGIFRIRSBXSU5ET1cgSVMgU01BTExFUiBUSEFUIDgwMFBYIEZFVENIIFRIRSBKU09OIEZPUiBUSEUgSUNPTiBBTklNQVRJT04gQU5EIEFUQUNIIFRIRSBBTklNQVRJT05TIFNFUEVSQVRFTFkgVE8gbWFzdGVyT2JqIFxcXFxcblx0XHRmZXRjaCgnYXNzZXRzL2pzL0ZhbnRhc3RlY19TcHJpdGVfU2hlZXQuanNvbicpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG5cdFx0XHRyZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuXHRcdH0pLnRoZW4oZnVuY3Rpb24gKHNwcml0ZU9iaikge1xuXHRcdFx0dmFyIElkbGVGcmFtZSA9IGZpbHRlckJ5VmFsdWUoc3ByaXRlT2JqLmZyYW1lcywgJ2lkbGUnKTtcblx0XHRcdG1hc3Rlck9iai5mb290YmFsbC5hbmltYXRpb25BcnJheSA9IFtdLmNvbmNhdChfdG9Db25zdW1hYmxlQXJyYXkoSWRsZUZyYW1lKSwgX3RvQ29uc3VtYWJsZUFycmF5KGZpbHRlckJ5VmFsdWUoc3ByaXRlT2JqLmZyYW1lcywgJ2Zvb3RiYWxsJykpKTtcblx0XHRcdG1hc3Rlck9iai50ZW5uaXMuYW5pbWF0aW9uQXJyYXkgPSBbXS5jb25jYXQoX3RvQ29uc3VtYWJsZUFycmF5KElkbGVGcmFtZSksIF90b0NvbnN1bWFibGVBcnJheShmaWx0ZXJCeVZhbHVlKHNwcml0ZU9iai5mcmFtZXMsICd0ZW5uaXMnKSkpO1xuXHRcdFx0bWFzdGVyT2JqLmJhc2ViYWxsLmFuaW1hdGlvbkFycmF5ID0gW10uY29uY2F0KF90b0NvbnN1bWFibGVBcnJheShJZGxlRnJhbWUpLCBfdG9Db25zdW1hYmxlQXJyYXkoZmlsdGVyQnlWYWx1ZShzcHJpdGVPYmouZnJhbWVzLCAnYmFzZWJhbGwnKSkpO1xuXHRcdFx0bWFzdGVyT2JqLmJhc2tldGJhbGwuYW5pbWF0aW9uQXJyYXkgPSBbXS5jb25jYXQoX3RvQ29uc3VtYWJsZUFycmF5KElkbGVGcmFtZSksIF90b0NvbnN1bWFibGVBcnJheShmaWx0ZXJCeVZhbHVlKHNwcml0ZU9iai5mcmFtZXMsICdiYXNrZXQnKSkpO1xuXHRcdFx0bWFzdGVyT2JqLmZhbi5hbmltYXRpb25BcnJheSA9IFtdLmNvbmNhdChfdG9Db25zdW1hYmxlQXJyYXkoSWRsZUZyYW1lKSwgX3RvQ29uc3VtYWJsZUFycmF5KGZpbHRlckJ5VmFsdWUoc3ByaXRlT2JqLmZyYW1lcywgJ2ZhbicpKSk7XG5cdFx0XHQvLyBDQUxMIEFOSU1BVE9SIFNFVFVQIEZVTkNUSU9OIEFORCBTVEFSVCBUSEUgSU1BR0UgU0xJREVTSE9XIEZPUiBTRUNUSU9OIDEgKEhPTUVQQUdFKSBcXFxcXHRcdFx0XG5cdFx0XHRhbmltYXRvclNldHVwKCk7XG5cdFx0XHRpbWFnZUNvbnRyb2xlcihtYXN0ZXJPYmosIDEpO1xuXHRcdFx0Ly8gQ0FMTCBUSEUgaW1hZ2VDb250cm9sZXIgRlVOQ1RJT04gRVZFUlkgNSBTRUNPTkRTIFRPIENIQU5HRSBUSEUgSU1BR0UgRk9SIFNFQ1RJT04gMSAoSE9NRVBBR0UpIFxcXFxcblx0XHRcdHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0aW1hZ2VDb250cm9sZXIobWFzdGVyT2JqLCAxKTtcblx0XHRcdH0sIDUwMDApO1xuXHRcdH0pO1xuXHR9XG5cdC8vIEZVTkNUSU9OIFRPIFNFUEVSQVRFIFRIRSBBTklNQVRJT04gRlJBTUVTIEJZIE5BTUUgXFxcXFxuXHR2YXIgZmlsdGVyQnlWYWx1ZSA9IGZ1bmN0aW9uIGZpbHRlckJ5VmFsdWUoYXJyYXksIHN0cmluZykge1xuXHRcdHJldHVybiBhcnJheS5maWx0ZXIoZnVuY3Rpb24gKG8pIHtcblx0XHRcdHJldHVybiB0eXBlb2Ygb1snZmlsZW5hbWUnXSA9PT0gJ3N0cmluZycgJiYgb1snZmlsZW5hbWUnXS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHN0cmluZy50b0xvd2VyQ2FzZSgpKTtcblx0XHR9KTtcblx0fTtcblx0Ly8gR0VORVJJQyBTRVRVUCBGVU5DVElPTiBGT1IgQURESU5HIFZFTkRPUiBQUkVGSVhFUyBUTyByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgXFxcXFxuXHR2YXIgYW5pbWF0b3JTZXR1cCA9IGZ1bmN0aW9uIGFuaW1hdG9yU2V0dXAoKSB7XG5cblx0XHR2YXIgbGFzdFRpbWUgPSAwO1xuXHRcdHZhciB2ZW5kb3JzID0gWydtcycsICdtb3onLCAnd2Via2l0JywgJ28nXTtcblx0XHRmb3IgKHZhciB4ID0gMDsgeCA8IHZlbmRvcnMubGVuZ3RoICYmICF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lOyArK3gpIHtcblx0XHRcdHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSB3aW5kb3dbdmVuZG9yc1t4XSArICdSZXF1ZXN0QW5pbWF0aW9uRnJhbWUnXTtcblx0XHRcdHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ0NhbmNlbEFuaW1hdGlvbkZyYW1lJ10gfHwgd2luZG93W3ZlbmRvcnNbeF0gKyAnQ2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ107XG5cdFx0fVxuXG5cdFx0aWYgKCF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24gKGNhbGxiYWNrLCBlbGVtZW50KSB7XG5cdFx0XHR2YXIgY3VyclRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblx0XHRcdHZhciB0aW1lVG9DYWxsID0gTWF0aC5tYXgoMCwgMTYgLSAoY3VyclRpbWUgLSBsYXN0VGltZSkpO1xuXHRcdFx0dmFyIGlkID0gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRjYWxsYmFjayhjdXJyVGltZSArIHRpbWVUb0NhbGwpO1xuXHRcdFx0fSwgdGltZVRvQ2FsbCk7XG5cdFx0XHRsYXN0VGltZSA9IGN1cnJUaW1lICsgdGltZVRvQ2FsbDtcblx0XHRcdHJldHVybiBpZDtcblx0XHR9O1xuXG5cdFx0aWYgKCF3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUpIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uIChpZCkge1xuXHRcdFx0Y2xlYXJUaW1lb3V0KGlkKTtcblx0XHR9O1xuXHR9O1xuXG5cdHZhciBhbmltYXRvciA9IGZ1bmN0aW9uIGFuaW1hdG9yKGFuaW1hdGlvbk9iaikge1xuXG5cdFx0dmFyIGRhbmNpbmdJY29uLCBzcHJpdGVJbWFnZSwgY2FudmFzO1xuXHRcdC8vIEZVTkNUSU9OIFRPIFBBU1MgVE8gcmVxdWVzdEFuaW1hdGlvbkZyYW1lIFxcXFxcblx0XHRmdW5jdGlvbiBnYW1lTG9vcCgpIHtcblx0XHRcdCQoJyNsb2FkaW5nJykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuXHRcdFx0YW5pbWF0aW9uT2JqLmxvb3BJZCA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZ2FtZUxvb3ApO1xuXHRcdFx0ZGFuY2luZ0ljb24udXBkYXRlKCk7XG5cdFx0XHRkYW5jaW5nSWNvbi5yZW5kZXIoKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzcHJpdGUob3B0aW9ucykge1xuXG5cdFx0XHR2YXIgdGhhdCA9IHt9LFxuXHRcdFx0ICAgIGZyYW1lSW5kZXggPSAwLFxuXHRcdFx0ICAgIHRpY2tDb3VudCA9IDAsXG5cdFx0XHQgICAgbG9vcENvdW50ID0gMCxcblx0XHRcdCAgICB0aWNrc1BlckZyYW1lID0gb3B0aW9ucy50aWNrc1BlckZyYW1lIHx8IDAsXG5cdFx0XHQgICAgbnVtYmVyT2ZGcmFtZXMgPSBvcHRpb25zLm51bWJlck9mRnJhbWVzIHx8IDE7XG5cblx0XHRcdHRoYXQuY29udGV4dCA9IG9wdGlvbnMuY29udGV4dDtcblx0XHRcdHRoYXQud2lkdGggPSBvcHRpb25zLndpZHRoO1xuXHRcdFx0dGhhdC5oZWlnaHQgPSBvcHRpb25zLmhlaWdodDtcblx0XHRcdHRoYXQuaW1hZ2UgPSBvcHRpb25zLmltYWdlO1xuXHRcdFx0dGhhdC5sb29wcyA9IG9wdGlvbnMubG9vcHM7XG5cblx0XHRcdHRoYXQudXBkYXRlID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRcdHRpY2tDb3VudCArPSAxO1xuXG5cdFx0XHRcdGlmICh0aWNrQ291bnQgPiB0aWNrc1BlckZyYW1lKSB7XG5cblx0XHRcdFx0XHR0aWNrQ291bnQgPSAwO1xuXHRcdFx0XHRcdC8vIElmIHRoZSBjdXJyZW50IGZyYW1lIGluZGV4IGlzIGluIHJhbmdlXG5cdFx0XHRcdFx0aWYgKGZyYW1lSW5kZXggPCBudW1iZXJPZkZyYW1lcyAtIDEpIHtcblx0XHRcdFx0XHRcdC8vIEdvIHRvIHRoZSBuZXh0IGZyYW1lXG5cdFx0XHRcdFx0XHRmcmFtZUluZGV4ICs9IDE7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGxvb3BDb3VudCsrO1xuXHRcdFx0XHRcdFx0ZnJhbWVJbmRleCA9IDA7XG5cblx0XHRcdFx0XHRcdGlmIChsb29wQ291bnQgPT09IHRoYXQubG9vcHMpIHtcblx0XHRcdFx0XHRcdFx0d2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKGFuaW1hdGlvbk9iai5sb29wSWQpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0dGhhdC5yZW5kZXIgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRcdFx0Ly8gQ2xlYXIgdGhlIGNhbnZhc1xuXHRcdFx0XHR0aGF0LmNvbnRleHQuY2xlYXJSZWN0KDAsIDAsIHRoYXQud2lkdGgsIHRoYXQuaGVpZ2h0KTtcblxuXHRcdFx0XHR0aGF0LmNvbnRleHQuZHJhd0ltYWdlKHRoYXQuaW1hZ2UsIGFuaW1hdGlvbk9iai5hbmltYXRpb25BcnJheVtmcmFtZUluZGV4XS5mcmFtZS54LCBhbmltYXRpb25PYmouYW5pbWF0aW9uQXJyYXlbZnJhbWVJbmRleF0uZnJhbWUueSwgMjAwLCAxNzUsIDAsIDAsIHdpbmRvdy5pbm5lcldpZHRoIC8gMy44NDYsIHdpbmRvdy5pbm5lcldpZHRoIC8gNC4xKTtcblx0XHRcdH07XG5cblx0XHRcdHJldHVybiB0aGF0O1xuXHRcdH1cblxuXHRcdC8vIEdldCBjYW52YXNcblx0XHRjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJyk7XG5cdFx0Y2FudmFzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGggLyAzLjg0Njtcblx0XHRjYW52YXMuaGVpZ2h0ID0gd2luZG93LmlubmVyV2lkdGggLyAyLjI7XG5cblx0XHQvLyBDcmVhdGUgc3ByaXRlIHNoZWV0XG5cdFx0c3ByaXRlSW1hZ2UgPSBuZXcgSW1hZ2UoKTtcblxuXHRcdC8vIENyZWF0ZSBzcHJpdGVcblx0XHRkYW5jaW5nSWNvbiA9IHNwcml0ZSh7XG5cdFx0XHRjb250ZXh0OiBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpLFxuXHRcdFx0d2lkdGg6IDQwNDAsXG5cdFx0XHRoZWlnaHQ6IDE3NzAsXG5cdFx0XHRpbWFnZTogc3ByaXRlSW1hZ2UsXG5cdFx0XHRudW1iZXJPZkZyYW1lczogYW5pbWF0aW9uT2JqLmFuaW1hdGlvbkFycmF5Lmxlbmd0aCxcblx0XHRcdHRpY2tzUGVyRnJhbWU6IDQsXG5cdFx0XHRsb29wczogYW5pbWF0aW9uT2JqLmxvb3BBbW91bnRcblx0XHR9KTtcblxuXHRcdC8vIExvYWQgc3ByaXRlIHNoZWV0XG5cdFx0c3ByaXRlSW1hZ2UuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgZ2FtZUxvb3ApO1xuXHRcdHNwcml0ZUltYWdlLnNyYyA9ICdhc3NldHMvaW1hZ2VzL0ZhbnRhc3RlY19TcHJpdGVfU2hlZXQucG5nJztcblx0fTtcblxuXHQvLyBJTklUSUFMSVNFIEFORCBTRVRVUCBDVVJSRU5UIFBBR0UuIEVYRUNVVEUgVFJBTlNJVElPTlMgQU5EIFJFTU9WRSBUSU5UIElGIFJFTEVWQU5UIFxcXFxcblxuXHR2YXIgcGFnZUxvYWRlciA9IGZ1bmN0aW9uIHBhZ2VMb2FkZXIoaW5kZXgpIHtcblx0XHRpZiAoaW5kZXggPT09IDUpIHtcblx0XHRcdCQoJy50aW50JykucmVtb3ZlQ2xhc3MoJ3JlbW92ZVRpbnQnKTtcblx0XHRcdCQoJy5iYWNrZ3JvdW5kV3JhcHBlcicpLnJlbW92ZUNsYXNzKCdzY2FsZUJhY2tncm91bmQnKTtcblx0XHRcdCQoJyNzZWN0aW9uNScpLmZpbmQoJy5oZWFkaW5nJykuYWRkQ2xhc3MoJ3Nob3cgZmFkZUluJyk7XG5cdFx0XHQkKCcuc3ViU2VjdGlvbicpLmFkZENsYXNzKCdzY2FsZUJhY2tncm91bmQnKTtcblx0XHRcdCQoJy5zdWJTZWN0aW9uJykuZmluZCgnLnRpbnQnKS5hZGRDbGFzcygncmVtb3ZlVGludCcpO1xuXHRcdFx0JCgnI3NlY3Rpb241JykuZmluZCgnLnRleHRXcmFwcGVyJykuYWRkQ2xhc3MoJ3Nob3cnKTtcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHQkKCcuc3ViU2VjdGlvbiA+IC50ZXh0V3JhcHBlcicpLmZpbmQoJy5oZWFkaW5nJykuYWRkQ2xhc3MoJ2ZhZGVJbicpO1xuXHRcdFx0fSwgMTAwMCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCQoJy50aW50JykucmVtb3ZlQ2xhc3MoJ3JlbW92ZVRpbnQnKTtcblx0XHRcdCQoJy5zdWJTZWN0aW9uJykucmVtb3ZlQ2xhc3MoJ3NjYWxlQmFja2dyb3VuZCcpO1xuXHRcdFx0JCgnLmJhY2tncm91bmRXcmFwcGVyOm5vdCgjc2VjdGlvbicgKyBpbmRleCArICdCYWNrZ3JvdW5kKScpLnJlbW92ZUNsYXNzKCdzY2FsZUJhY2tncm91bmQnKTtcblx0XHRcdCQoJy5zZWN0aW9uLmFjdGl2ZScpLmZpbmQoJy5iYWNrZ3JvdW5kV3JhcHBlcicpLmFkZENsYXNzKCdzY2FsZUJhY2tncm91bmQnKTtcblx0XHRcdCQoJ3NlY3Rpb24uYWN0aXZlJykuZmluZCgnLnRpbnQnKS5hZGRDbGFzcygncmVtb3ZlVGludCcpO1xuXG5cdFx0XHRpZiAoJCgnLnNlY3Rpb24nICsgaW5kZXggKyAnUGFnaW5hdG9yQnV0dG9uJykubGVuZ3RoICYmICQoJy5zZWN0aW9uJyArIGluZGV4ICsgJ1BhZ2luYXRvckJ1dHRvbi5hY3RpdmUnKS5sZW5ndGggPCAxKSB7XG5cdFx0XHRcdCQoJy5zZWN0aW9uJyArIGluZGV4ICsgJ1BhZ2luYXRvckJ1dHRvbicpLmdldCgwKS5jbGljaygpO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHQvLyBISURFIEFMTCBCRUNLR1JPVU5EUyBJTiBUSEUgU0VDVElPTiBFWENFUFQgVEhFIFNQRUNJRklFRCBJTkRFWCwgV0hJQ0ggSVMgU0NBTEVEIEFORCBTSE9XTi4gXFxcXFxuXG5cdHZhciBpbml0aWFsaXplU2VjdGlvbiA9IGZ1bmN0aW9uIGluaXRpYWxpemVTZWN0aW9uKHNlY3Rpb25OdW1iZXIsIGlkeCkge1xuXHRcdCQoJyNzZWN0aW9uJyArIHNlY3Rpb25OdW1iZXIgKyAnQmFja2dyb3VuZCcgKyBpZHgpLnNpYmxpbmdzKCcuYmFja2dyb3VuZFdyYXBwZXInKS5tYXAoZnVuY3Rpb24gKGl4LCBlbGUpIHtcblx0XHRcdCQoZWxlKS5jc3MoeyBvcGFjaXR5OiAwIH0pO1xuXHRcdH0pO1xuXG5cdFx0JCgnI3NlY3Rpb24nICsgc2VjdGlvbk51bWJlciArICdCYWNrZ3JvdW5kJyArIGlkeCkuY3NzKHtcblx0XHRcdCd0cmFuc2Zvcm0nOiAnc2NhbGUoMS4xKScsXG5cdFx0XHQnb3BhY2l0eSc6IDFcblx0XHR9KTtcblx0fTtcblxuXHQvLyBDQUxMIGluaXRpYWxpemVTZWN0aW9uIE9OIFNFQ1RJT05TIDEsIDMgQU5EIDQuIFxcXFxcblx0aW5pdGlhbGl6ZVNlY3Rpb24oMSwgMCk7XG5cdGluaXRpYWxpemVTZWN0aW9uKDMsIDApO1xuXHRpbml0aWFsaXplU2VjdGlvbig0LCAwKTtcblxuXHQvLyBCQUNLR1JPVU5EIElNQUdFIFRSQU5TSVRJT04gSEFORExFUi4gXFxcXFxuXG5cdHZhciBpbWFnZUNvbnRyb2xlciA9IGZ1bmN0aW9uIGltYWdlQ29udHJvbGVyKGlkeE9iaiwgc2VjdGlvbk51bWJlcikge1xuXHRcdHZhciByZWxldmFudEFuaW1hdGlvbiA9IHZvaWQgMDtcblxuXHRcdGlmIChzZWN0aW9uTnVtYmVyID09PSAxKSB7XG5cdFx0XHRzd2l0Y2ggKGlkeE9iai5zZWN0aW9uMUN1cnJlbnRJZHgpIHtcblx0XHRcdFx0Y2FzZSAwOlxuXHRcdFx0XHRcdHJlbGV2YW50QW5pbWF0aW9uID0gbWFzdGVyT2JqLmJhc2tldGJhbGw7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgMTpcblx0XHRcdFx0XHRyZWxldmFudEFuaW1hdGlvbiA9IG1hc3Rlck9iai5mb290YmFsbDtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRcdHJlbGV2YW50QW5pbWF0aW9uID0gbWFzdGVyT2JqLnRlbm5pcztcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAzOlxuXHRcdFx0XHRcdHJlbGV2YW50QW5pbWF0aW9uID0gbWFzdGVyT2JqLmJhc2ViYWxsO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIDQ6XG5cdFx0XHRcdFx0cmVsZXZhbnRBbmltYXRpb24gPSBtYXN0ZXJPYmouZmFuO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdCQoJyNzZWN0aW9uJyArIHNlY3Rpb25OdW1iZXIpLmZpbmQoJy50aW50JykucmVtb3ZlQ2xhc3MoJ3JlbW92ZVRpbnQnKTtcblx0XHQkKCcjc2VjdGlvbicgKyBzZWN0aW9uTnVtYmVyICsgJ0JhY2tncm91bmQnICsgaWR4T2JqWydzZWN0aW9uJyArIHNlY3Rpb25OdW1iZXIgKyAnQ3VycmVudElkeCddKS5yZW1vdmVDbGFzcygnc2NhbGVCYWNrZ3JvdW5kJyk7XG5cdFx0aW5pdGlhbGl6ZVNlY3Rpb24oc2VjdGlvbk51bWJlciwgaWR4T2JqWydzZWN0aW9uJyArIHNlY3Rpb25OdW1iZXIgKyAnQ3VycmVudElkeCddKTtcblxuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0aWYgKHNlY3Rpb25OdW1iZXIgPT09IDEpIHtcblx0XHRcdFx0YW5pbWF0b3IocmVsZXZhbnRBbmltYXRpb24pO1xuXHRcdFx0fVxuXG5cdFx0XHQkKCcjc2VjdGlvbicgKyBzZWN0aW9uTnVtYmVyKS5maW5kKCcuYmFja2dyb3VuZFdyYXBwZXInKS5hZGRDbGFzcygnc2NhbGVCYWNrZ3JvdW5kJyk7XG5cdFx0XHQkKCcjc2VjdGlvbicgKyBzZWN0aW9uTnVtYmVyKS5maW5kKCcudGludCcpLmFkZENsYXNzKCdyZW1vdmVUaW50Jyk7XG5cdFx0fSwgNTAwKTtcblxuXHRcdGlmIChpZHhPYmpbJ3NlY3Rpb24nICsgc2VjdGlvbk51bWJlciArICdDdXJyZW50SWR4J10gPT09ICQoJyNzZWN0aW9uJyArIHNlY3Rpb25OdW1iZXIpLmZpbmQoJy5iYWNrZ3JvdW5kV3JhcHBlcicpLmxlbmd0aCAtIDEpIHtcblx0XHRcdGlkeE9ialsnc2VjdGlvbicgKyBzZWN0aW9uTnVtYmVyICsgJ0N1cnJlbnRJZHgnXSA9IDA7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlkeE9ialsnc2VjdGlvbicgKyBzZWN0aW9uTnVtYmVyICsgJ0N1cnJlbnRJZHgnXSArPSAxO1xuXHRcdH1cblx0fTtcblx0Ly8gU1RBUlQgU0xJREVTSE9XIE9OIFNFQ1RJT04gMiBcXFxcXG5cdGltYWdlQ29udHJvbGVyKG1hc3Rlck9iaiwgMik7XG5cblx0Ly8gQ0hBTkdFIFNFQ1RJT04gMiBCQUNLR1JPVU5EIElNQUdFIEVWRVJZIDE1IFNFQ09ORFMgXFxcXFxuXHRzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG5cdFx0aW1hZ2VDb250cm9sZXIobWFzdGVyT2JqLCAyKTtcblx0fSwgMTUwMDApO1xuXG5cdC8vIFBBR0lOQVRJT04gQlVUVE9OUyBDTElDSyBIQU5ETEVSIEZPUiBTRUNUSU9OUyAzIEFORCA0LiBcXFxcXG5cblx0dmFyIGhhbmRsZVBhbmluYXRpb25CdXR0b25DbGljayA9IGZ1bmN0aW9uIGhhbmRsZVBhbmluYXRpb25CdXR0b25DbGljayhlKSB7XG5cblx0XHR2YXIgaWR4ID0gcGFyc2VJbnQoJChlLnRhcmdldCkuYXR0cignZGF0YS1pbmRleCcpKTtcblx0XHR2YXIgc2VjdGlvbklkID0gJChlLnRhcmdldCkuY2xvc2VzdCgnc2VjdGlvbicpLmF0dHIoJ2lkJyk7XG5cdFx0dmFyIHJlbGV2YW50RGF0YUFycmF5ID0gdm9pZCAwO1xuXG5cdFx0aWYgKHNlY3Rpb25JZCA9PT0gJ3NlY3Rpb24zJykge1xuXHRcdFx0c2VjdGlvbjNJZHggPSBpZHg7XG5cdFx0fVxuXG5cdFx0aWYgKHNlY3Rpb25JZCA9PT0gJ3NlY3Rpb240Jykge1xuXHRcdFx0c2VjdGlvbjRJZHggPSBpZHg7XG5cdFx0fVxuXG5cdFx0JCgnIycgKyBzZWN0aW9uSWQpLmZpbmQoJy50aW50JykucmVtb3ZlQ2xhc3MoJ3JlbW92ZVRpbnQnKTtcblx0XHQkKCcjJyArIHNlY3Rpb25JZCkuZmluZCgnLnRleHRXcmFwcGVyJykucmVtb3ZlQ2xhc3MoJ3Nob3cnKTtcblx0XHQkKCcjJyArIHNlY3Rpb25JZCkuZmluZCgnI3RleHRXcmFwcGVyJyArIGlkeCkuYWRkQ2xhc3MoJ3Nob3cnKTtcblx0XHQkKCcjJyArIHNlY3Rpb25JZCArICdCYWNrZ3JvdW5kJyArIGlkeCkucmVtb3ZlQ2xhc3MoJ3NjYWxlQmFja2dyb3VuZCcpO1xuXHRcdCQoJy4nICsgc2VjdGlvbklkICsgJ1BhZ2luYXRvckJ1dHRvbicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblx0XHQkKGUudGFyZ2V0KS5hZGRDbGFzcygnYWN0aXZlJyk7XG5cblx0XHRpbml0aWFsaXplU2VjdGlvbihwYXJzZUludCgkKCcjJyArIHNlY3Rpb25JZCkuYXR0cignZGF0YS1pbmRleCcpKSwgaWR4KTtcblxuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0cGFnZUxvYWRlcihwYXJzZUludCgkKCcjJyArIHNlY3Rpb25JZCkuYXR0cignZGF0YS1pbmRleCcpKSk7XG5cdFx0fSwgNTAwKTtcblxuXHRcdGlmIChzZWN0aW9uSWQgIT09ICdzZWN0aW9uMicpIHtcblx0XHRcdCQoJyMnICsgc2VjdGlvbklkKS5maW5kKCcuaGVhZGluZywgcCcpLmFkZENsYXNzKCdmYWRlSW4nKTtcblx0XHRcdCQoJyMnICsgc2VjdGlvbklkKS5vbigndHJhbnNpdGlvbmVuZCB3ZWJraXRUcmFuc2l0aW9uRW5kIG9UcmFuc2l0aW9uRW5kJywgZnVuY3Rpb24gKGVzKSB7XG5cdFx0XHRcdCQoJyMnICsgc2VjdGlvbklkKS5maW5kKCcuaGVhZGluZywgcCcpLnJlbW92ZUNsYXNzKCdmYWRlSW4nKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fTtcblxuXHQvLyBDTElDSyBMSVNURU5FUiBGT1IgUEFHSU5BVElPTiBCVVRUT05TIE9OIFNFQ1RJT05TIDMgQU5EIDQuIFxcXFxcblxuXHQkKCcuc2VjdGlvbjNQYWdpbmF0b3JCdXR0b24sIC5zZWN0aW9uNFBhZ2luYXRvckJ1dHRvbicpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XG5cblx0XHRpZiAobWFzdGVyT2JqWyQoZS5jdXJyZW50VGFyZ2V0KS5jbG9zZXN0KCdzZWN0aW9uJykuYXR0cignaWQnKV0uaXNBdXRvbWF0ZWQpIHtcblx0XHRcdC8vIElGIFRIRVJFIElTIEEgUklOTklORyBJTlRFUlZBTCBPTiBUSEUgUkVMRVZBTlQgU0VDVElPTiBDTEVBUiBJVCBcXFxcXG5cdFx0XHRpbnRlcnZhbE1hbmFnZXIoZmFsc2UsICQoZS5jdXJyZW50VGFyZ2V0KS5jbG9zZXN0KCdzZWN0aW9uJykuYXR0cignaWQnKSk7XG5cdFx0XHQvLyBTRVQgQSBORVcgSU5URVJWQUwgT0YgNyBTRUNPTkRTIE9OIFRIRSBTRUNUSU9OIFxcXFxcblx0XHRcdGludGVydmFsTWFuYWdlcih0cnVlLCAkKGUuY3VycmVudFRhcmdldCkuY2xvc2VzdCgnc2VjdGlvbicpLmF0dHIoJ2lkJyksIDcwMDApO1xuXHRcdH1cblx0XHQvLyBDQUxMIFRIRSBDTElDSyBIQU5ETEVSIEZVTkNUSU9OIEFORCBQQVNTIElUIFRIRSBFVkVOVCBJRiBUQVJHRVQgSVMgTk9UIEFMUkVBRFkgQUNUSVZFIFxcXFxcblx0XHRpZiAoISQoZS5jdXJyZW50VGFyZ2V0KS5oYXNDbGFzcygnYWN0aXZlJykpIHtcblx0XHRcdGhhbmRsZVBhbmluYXRpb25CdXR0b25DbGljayhlKTtcblx0XHR9XG5cdH0pO1xuXG5cdC8vIElOSVRJQUxJWkUgT05FUEFHRVNDUk9MTCBJRiBOT1QgSU4gQ01TIFBSRVZJRVcuIFxcXFxcblxuXHRpZiAoISQobG9jYXRpb24pLmF0dHIoJ2hyZWYnKS5pbmNsdWRlcygnaW5kZXgucGhwJykpIHtcblx0XHQkKCcjc2Nyb2xsZXJXcmFwcGVyJykub25lcGFnZV9zY3JvbGwoe1xuXHRcdFx0c2VjdGlvbkNvbnRhaW5lcjogXCJzZWN0aW9uXCIsXG5cdFx0XHRlYXNpbmc6IFwiZWFzZS1vdXRcIixcblx0XHRcdGFuaW1hdGlvblRpbWU6IHRpbWUsXG5cdFx0XHRwYWdpbmF0aW9uOiB0cnVlLFxuXHRcdFx0dXBkYXRlVVJMOiB0cnVlLFxuXHRcdFx0YmVmb3JlTW92ZTogZnVuY3Rpb24gYmVmb3JlTW92ZShpbmRleCkge30sXG5cdFx0XHRhZnRlck1vdmU6IGZ1bmN0aW9uIGFmdGVyTW92ZShpbmRleCkge1xuXHRcdFx0XHQvLyBJTklUSUFMSVpFIFRIRSBDVVJSRU5UIFBBR0UuIFxcXFxcblxuXHRcdFx0XHRwYWdlTG9hZGVyKGluZGV4KTtcblx0XHRcdH0sXG5cdFx0XHRsb29wOiBmYWxzZSxcblx0XHRcdGtleWJvYXJkOiB0cnVlLFxuXHRcdFx0cmVzcG9uc2l2ZUZhbGxiYWNrOiBmYWxzZSxcblx0XHRcdGRpcmVjdGlvbjogXCJ2ZXJ0aWNhbFwiXG5cdFx0fSk7XG5cblx0XHQkKCcjc2Nyb2xsZXJXcmFwcGVyJykubW92ZVRvKDEpO1xuXHR9XG5cblx0Ly8gQ09OVFJPTCBDTElDS1MgT04gV09SSyBXSVRIIFVTIFNFQ1RJT04gKFNFQ1RJT041KS4gXFxcXFxuXG5cdCQoJy5jbGlja2FibGUnKS5jbGljayhmdW5jdGlvbiAoZSkge1xuXHRcdHZhciBjdXJyZW50U2VjdGlvbiA9ICQoZS50YXJnZXQpLmNsb3Nlc3QoJCgnLnN1YlNlY3Rpb24nKSk7XG5cblx0XHRpZiAoY3VycmVudFNlY3Rpb24uaGFzQ2xhc3MoJ29wZW4nKSkge1xuXHRcdFx0Y3VycmVudFNlY3Rpb24ucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcblx0XHRcdGN1cnJlbnRTZWN0aW9uLmZpbmQoJy5idXR0b24sIHAnKS5yZW1vdmVDbGFzcygnZmFkZUluJyk7XG5cdFx0XHRjdXJyZW50U2VjdGlvbi5zaWJsaW5ncygnLnN1YlNlY3Rpb24nKS5tYXAoZnVuY3Rpb24gKGlkeCwgc2VjdGlvbikge1xuXHRcdFx0XHQkKHNlY3Rpb24pLnJlbW92ZUNsYXNzKCdjbG9zZWQnKTtcblx0XHRcdFx0JChzZWN0aW9uKS5maW5kKCcudGludCcpLnJlbW92ZUNsYXNzKCdhZGRUaW50JykuYWRkQ2xhc3MoJ3JlbW92ZVRpbnQnKTtcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjdXJyZW50U2VjdGlvbi5yZW1vdmVDbGFzcygnY2xvc2VkJykuYWRkQ2xhc3MoJ29wZW4nKTtcblx0XHRcdGN1cnJlbnRTZWN0aW9uLm9uKCd0cmFuc2l0aW9uZW5kIHdlYmtpdFRyYW5zaXRpb25FbmQgb1RyYW5zaXRpb25FbmQnLCBmdW5jdGlvbiAoZXMpIHtcblx0XHRcdFx0JCgnLnN1YlNlY3Rpb24ub3BlbicpLmZpbmQoJy5idXR0b24sIHAnKS5hZGRDbGFzcygnZmFkZUluJyk7XG5cdFx0XHR9KTtcblx0XHRcdGN1cnJlbnRTZWN0aW9uLnNpYmxpbmdzKCcuc3ViU2VjdGlvbicpLm1hcChmdW5jdGlvbiAoaWR4LCBzZWN0aW9uKSB7XG5cdFx0XHRcdCQoc2VjdGlvbikucmVtb3ZlQ2xhc3MoJ29wZW4nKS5hZGRDbGFzcygnY2xvc2VkJyk7XG5cdFx0XHRcdCQoc2VjdGlvbikuZmluZCgnLnRpbnQnKS5yZW1vdmVDbGFzcygncmVtb3ZlVGludCcpLmFkZENsYXNzKCdhZGRUaW50Jyk7XG5cdFx0XHRcdCQoc2VjdGlvbikuZmluZCgnLmJ1dHRvbiwgcCcpLnJlbW92ZUNsYXNzKCdmYWRlSW4nKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRjdXJyZW50U2VjdGlvbi5maW5kKCcudGludCcpLnJlbW92ZUNsYXNzKCdhZGRUaW50JykuYWRkQ2xhc3MoJ3JlbW92ZVRpbnQnKTtcblx0fSk7XG5cblx0Ly8gQ09OVFJPTCBGT09URVIgQVJST1cgQ0xJQ0tTLiBcXFxcXG5cblx0JCgnI2Rvd25BcnJvdycpLmNsaWNrKGZ1bmN0aW9uICgpIHtcblx0XHRpZiAoJCh3aW5kb3cpLmhlaWdodCgpICogKCQoJy5wYWdlJykubGVuZ3RoIC0gMSkgPT09IC0kKCcjc2Nyb2xsZXJXcmFwcGVyJykub2Zmc2V0KCkudG9wKSB7XG5cdFx0XHQvLyBNT1ZFIFRPIFRPUCBPRiBQQUdFIElGIENVUlJFTlRMWSBBVCBCT1RUT00gXFxcXFxuXHRcdFx0JCgnI3Njcm9sbGVyV3JhcHBlcicpLm1vdmVUbygxKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JCgnI3Njcm9sbGVyV3JhcHBlcicpLm1vdmVEb3duKCk7XG5cdFx0fVxuXHR9KTtcblxuXHQvLyBISURFIFRIRSBMT0FESU5HIEFOSU1BVElPUE4gV0hFTiBWSURFTyBJUyBSRUFEWSBUTyBQTEFZIE9OIERFU1hLVE9QLiBcXFxcXG5cblx0dmFyIGhpZGVMb2FkaW5nQW5pbWF0aW9uID0gZnVuY3Rpb24gaGlkZUxvYWRpbmdBbmltYXRpb24oKSB7XG5cdFx0aWYgKHdpbmRvdy5pbm5lcldpZHRoID4gODAwICYmICEkKCcjbG9hZGluZycpLmhhc0NsYXNzKCdoaWRkZW4nKSkge1xuXG5cdFx0XHRpZiAoJCgnI3ZpZGVvJykuZ2V0KDApLnJlYWR5U3RhdGUgPT09IDQpIHtcblx0XHRcdFx0JCgnI2xvYWRpbmcnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdC8vIE1BTkFHRU1FTlQgRlVOQ1RJT04gRk9SIFNFVFRJTkcgQU5EIENMRUFSSU5HIFRIRSBTTElERSBBVVRPTUFUSU9OIElOVEVSVkFMUy4gXFxcXFxuXG5cdHZhciBpbnRlcnZhbE1hbmFnZXIgPSBmdW5jdGlvbiBpbnRlcnZhbE1hbmFnZXIoZmxhZywgc2VjdGlvbklkLCB0aW1lKSB7XG5cdFx0aWYgKGZsYWcpIHtcblx0XHRcdG1hc3Rlck9ialtzZWN0aW9uSWRdLmF1dG9tYXRlID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRzd2lwZUNvbnRyb2xsZXIoc2VjdGlvbklkLCAnbCcpO1xuXHRcdFx0fSwgdGltZSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNsZWFySW50ZXJ2YWwobWFzdGVyT2JqW3NlY3Rpb25JZF0uYXV0b21hdGUpO1xuXHRcdH1cblx0fTtcblxuXHQvLyBJRiBOT1QgSU4gQ01TIEFETUlOIFBSRVZJRVcsIFBFUlBFVFVBTExZIENIRUNLIElGIFdFIEFSRSBBVCBUSEUgVE9QIE9GIFRIRSBQQUdFIEFORCBJRiBTTywgRE9OVCBTSE9XIFRIRSBGT09URVIgT1IgR1JFRU4gU0hBUEUuIFxcXFxcblxuXHRpZiAoISQobG9jYXRpb24pLmF0dHIoJ2hyZWYnKS5pbmNsdWRlcygnaW5kZXgucGhwJykpIHtcblx0XHRzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG5cdFx0XHRpZiAoJCgnI3Njcm9sbGVyV3JhcHBlcicpLm9mZnNldCgpLnRvcCA+PSAwKSB7XG5cdFx0XHRcdCQoJyNoZWFkZXJTaGFwZSwgI2Zvb3RlcicpLmFkZENsYXNzKCdtb3ZlT2ZmU2NyZWVuJyk7XG5cdFx0XHRcdCQoJyN2aWRlbycpLmdldCgwKS5wbGF5KCk7XG5cdFx0XHRcdCQoJy5hcnJvdycpLmFkZENsYXNzKCdwdWxzYXRlJyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR2YXIgdGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdCQoJyNoZWFkZXJTaGFwZSwgI2Zvb3RlcicpLnJlbW92ZUNsYXNzKCdtb3ZlT2ZmU2NyZWVuJyk7XG5cdFx0XHRcdFx0JCgnI3ZpZGVvJykuZ2V0KDApLnBhdXNlKCk7XG5cdFx0XHRcdFx0JCgnLmFycm93JykucmVtb3ZlQ2xhc3MoJ3B1bHNhdGUnKTtcblx0XHRcdFx0XHRjbGVhclRpbWVvdXQodGltZW91dCk7XG5cdFx0XHRcdH0sIHRpbWUpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBST1RBVEUgVEhFIEFSUk9XIElOIFRIRSBGT09URVIgV0hFTiBBVCBUSEUgQk9UVE9NIE9GIFRIRSBQQUdFIFxcXFxcblxuXHRcdFx0aWYgKCQoJyNzY3JvbGxlcldyYXBwZXInKS5vZmZzZXQoKS50b3AgPCAtKHdpbmRvdy5pbm5lckhlaWdodCAqIDQpKSB7XG5cdFx0XHRcdCQoJyNkb3duQXJyb3cnKS5jc3MoeyAndHJhbnNmb3JtJzogJ3JvdGF0ZSgxODBkZWcpIHRyYW5zbGF0ZVgoLTUwJSknIH0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JCgnI2Rvd25BcnJvdycpLmNzcyh7ICd0cmFuc2Zvcm0nOiAndHJhbnNsYXRlWCgtNTAlKSByb3RhdGUoMGRlZyknIH0pO1xuXHRcdFx0fVxuXG5cdFx0XHRoaWRlTG9hZGluZ0FuaW1hdGlvbigpO1xuXG5cdFx0XHQvLyBBREQgTEFORFNDQVBFIFNUWUxFUyBUTyBSRUxFVkFOVCBFTEVNRU5UUyBcXFxcXG5cblx0XHRcdGlmICh3aW5kb3cubWF0Y2hNZWRpYShcIihvcmllbnRhdGlvbjogbGFuZHNjYXBlKVwiKS5tYXRjaGVzICYmIHdpbmRvdy5pbm5lcldpZHRoIDwgODAwKSB7XG5cdFx0XHRcdCQoJy5uYXZfbGluaywgI2hlYWRlclNoYXBlLCAjZm9vdGVyLCAuY3VzdG9tLCAubWFya2VyLCAjc2VjdGlvbjUsIC50ZXh0V3JhcHBlcicpLmFkZENsYXNzKCdsYW5kc2NhcGUnKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCQoJy5uYXZfbGluaywgI2hlYWRlclNoYXBlLCAjZm9vdGVyLCAuY3VzdG9tLCAubWFya2VyLCAjc2VjdGlvbjUsIC50ZXh0V3JhcHBlcicpLnJlbW92ZUNsYXNzKCdsYW5kc2NhcGUnKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCQoJyNzZWN0aW9uMy5hY3RpdmUnKS5sZW5ndGgpIHtcblx0XHRcdFx0Ly8gQVVUT01BVEUgVEhFIFNMSURFUyBPTiBTRUNUSU9QTiAzIEVWRVJZIDcgU0VDT05EUyBJRiBUSEUgU0VDVElPTiBJUyBBQ1RJVkUuIFxcXFxcblx0XHRcdFx0aWYgKG1hc3Rlck9iai5zZWN0aW9uMy5pc0F1dG9tYXRlZCAhPT0gdHJ1ZSkge1xuXHRcdFx0XHRcdG1hc3Rlck9iai5zZWN0aW9uMy5pc0F1dG9tYXRlZCA9IHRydWU7XG5cdFx0XHRcdFx0aW50ZXJ2YWxNYW5hZ2VyKHRydWUsICdzZWN0aW9uMycsIDcwMDApO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBTVE9QIEFVVE9NQVRFRCBTTElERVMgT04gU0VDVElPUE4gMyBJRiBUSEUgU0VDVElPTiBJUyBOT1QgQUNUSVZFLiBcXFxcXG5cdFx0XHRcdGlmIChtYXN0ZXJPYmouc2VjdGlvbjMuaXNBdXRvbWF0ZWQgPT09IHRydWUpIHtcblx0XHRcdFx0XHRpbnRlcnZhbE1hbmFnZXIoZmFsc2UsICdzZWN0aW9uMycpO1xuXHRcdFx0XHRcdG1hc3Rlck9iai5zZWN0aW9uMy5pc0F1dG9tYXRlZCA9IGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmICgkKCcjc2VjdGlvbjQuYWN0aXZlJykubGVuZ3RoKSB7XG5cdFx0XHRcdC8vIEFVVE9NQVRFIFRIRSBTTElERVMgT04gU0VDVElPUE4gNCBFVkVSWSA3IFNFQ09ORFMgSUYgVEhFIFNFQ1RJT04gSVMgQUNUSVZFLiBcXFxcXG5cdFx0XHRcdGlmIChtYXN0ZXJPYmouc2VjdGlvbjQuaXNBdXRvbWF0ZWQgIT09IHRydWUpIHtcblx0XHRcdFx0XHRtYXN0ZXJPYmouc2VjdGlvbjQuaXNBdXRvbWF0ZWQgPSB0cnVlO1xuXHRcdFx0XHRcdGludGVydmFsTWFuYWdlcih0cnVlLCAnc2VjdGlvbjQnLCA3MDAwKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gU1RPUCBBVVRPTUFURUQgU0xJREVTIE9OIFNFQ1RJT1BOIDQgSUYgVEhFIFNFQ1RJT04gSVMgTk9UIEFDVElWRS4gXFxcXFxuXHRcdFx0XHRpZiAobWFzdGVyT2JqLnNlY3Rpb240LmlzQXV0b21hdGVkID09PSB0cnVlKSB7XG5cdFx0XHRcdFx0aW50ZXJ2YWxNYW5hZ2VyKGZhbHNlLCAnc2VjdGlvbjQnKTtcblx0XHRcdFx0XHRtYXN0ZXJPYmouc2VjdGlvbjQuaXNBdXRvbWF0ZWQgPSBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sIDUwMCk7XG5cdH1cblxuXHQvLyBDT05UUk9MIFdIQVQgSEFQUEVOUyBXSEVOIExJTktTIElOIFRIRSBOQVYvTUVOVSBBUkUgQ0xJQ0tFRCBcXFxcXG5cblx0JCgnLm5hdl9saW5rJykuY2xpY2soZnVuY3Rpb24gKGUpIHtcblx0XHR2YXIgcGFnZUlkeCA9IHBhcnNlSW50KCQoZS50YXJnZXQpLmF0dHIoJ2RhdGEtaW5kZXgnKSk7XG5cdFx0JCgnI3Njcm9sbGVyV3JhcHBlcicpLm1vdmVUbyhwYWdlSWR4KTtcblx0XHQkKCcjbWVudUJsb2NrT3V0JykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuXG5cdFx0aWYgKGJ1cmdlci5jbGFzc0xpc3QuY29udGFpbnMoJ2J1cmdlci0tYWN0aXZlJykpIHtcblx0XHRcdG5hdi5jbGFzc0xpc3QucmVtb3ZlKCduYXZfb3BlbicpO1xuXHRcdFx0YnVyZ2VyLmNsYXNzTGlzdC5yZW1vdmUoJ2J1cmdlci0tYWN0aXZlJyk7XG5cdFx0XHRkb2N1bWVudC5ib2R5LnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcblx0XHR9XG5cdH0pO1xuXG5cdC8vIFdIRU4gVEhFIE5BViBJUyBPUEVOIFBSRVZFTlQgVVNFUiBGUk9NIEJFSU5HIEFCTEUgVE8gQ0xJQ0sgQU5ZVEhJTkcgRUxTRSBcXFxcXG5cblx0JCgnI21lbnVCbG9ja091dCcpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XG5cdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0fSk7XG5cblx0dmFyIGJ1cmdlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluLWJ1cmdlcicpLFxuXHQgICAgbmF2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW5OYXYnKTtcblxuXHQvLyBDT05UUk9MIEZPUiBPUEVOIEFORCBDTE9TSU5HIFRIRSBNRU5VL05BViAgXFxcXFxuXG5cdGZ1bmN0aW9uIG5hdkNvbnRyb2woKSB7XG5cblx0XHRpZiAoYnVyZ2VyLmNsYXNzTGlzdC5jb250YWlucygnYnVyZ2VyLS1hY3RpdmUnKSkge1xuXHRcdFx0bmF2LmNsYXNzTGlzdC5yZW1vdmUoJ25hdl9vcGVuJyk7XG5cdFx0XHRidXJnZXIuY2xhc3NMaXN0LnJlbW92ZSgnYnVyZ2VyLS1hY3RpdmUnKTtcblx0XHRcdCQoJyNtZW51QmxvY2tPdXQnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGJ1cmdlci5jbGFzc0xpc3QuYWRkKCdidXJnZXItLWFjdGl2ZScpO1xuXHRcdFx0bmF2LmNsYXNzTGlzdC5hZGQoJ25hdl9vcGVuJyk7XG5cdFx0XHQkKCcjbWVudUJsb2NrT3V0JykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuXHRcdH1cblx0fVxuXG5cdC8vIE9OTFkgTElTVEVOIEZPUiBNRU5VIENMSUNLUyBXSEVOIE5PVCBJTiBDTVMgUFJFVklFVyBNT0RFIFxcXFxcblxuXHRpZiAoISQobG9jYXRpb24pLmF0dHIoJ2hyZWYnKS5pbmNsdWRlcygnaW5kZXgucGhwJykpIHtcblx0XHRidXJnZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBuYXZDb250cm9sKTtcblx0fVxuXG5cdC8vIENMT1NFIFRIRSBOQVYgSUYgVEhFIFdJTkRPVyBJUyBPVkVSIDEwMDBQWCBXSURFIFxcXFxcblxuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZnVuY3Rpb24gKCkge1xuXHRcdGlmICh3aW5kb3cuaW5uZXJXaWR0aCA+IDEwMDAgJiYgbmF2LmNsYXNzTGlzdC5jb250YWlucygnbmF2X29wZW4nKSkge1xuXHRcdFx0bmF2Q29udHJvbCgpO1xuXHRcdFx0bmF2LmNsYXNzTGlzdC5yZW1vdmUoJ25hdl9vcGVuJyk7XG5cdFx0XHQkKCcjbWVudUJsb2NrT3V0JykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuXHRcdH1cblx0fSk7XG5cblx0Ly8gVEhJUyBTRVQgT0YgSUYgU1RBVEVNRU5UUyBJTklUSUFMSVNFUyBUSEUgU1BFU0lGSUMgUEFHRVMgRk9SIFBSRVZJRVdJTkcgSU4gQ01TIEFETUlOLiBcXFxcXG5cblx0aWYgKCQobG9jYXRpb24pLmF0dHIoJ2hyZWYnKS5pbmNsdWRlcygnaW5kZXgucGhwJykpIHtcblx0XHRpZiAoJChsb2NhdGlvbikuYXR0cignaHJlZicpLmluY2x1ZGVzKCdpbWFnaW5lLWlmJykpIHtcblx0XHRcdHBhZ2VMb2FkZXIoNCk7XG5cdFx0fVxuXHRcdGlmICgkKGxvY2F0aW9uKS5hdHRyKCdocmVmJykuaW5jbHVkZXMoJ2hvdy13ZS1pbm5vdmF0ZScpKSB7XG5cdFx0XHRwYWdlTG9hZGVyKDMpO1xuXHRcdH1cblx0XHRpZiAoJChsb2NhdGlvbikuYXR0cignaHJlZicpLmluY2x1ZGVzKCd3b3JrLXdpdGgtdXMnKSkge1xuXHRcdFx0cGFnZUxvYWRlcig1KTtcblx0XHR9XG5cdFx0aWYgKCQobG9jYXRpb24pLmF0dHIoJ2hyZWYnKS5pbmNsdWRlcygnY29udGFjdC11cycpKSB7XG5cdFx0XHRwYWdlTG9hZGVyKDYpO1xuXHRcdH1cblx0XHRpZiAoJChsb2NhdGlvbikuYXR0cignaHJlZicpLmluY2x1ZGVzKCdob21lLXZpZGVvJykpIHtcblx0XHRcdHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0aGlkZUxvYWRpbmdBbmltYXRpb24oKTtcblx0XHRcdH0sIDUwMCk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gU1dJUEUgRVZFTlRTIERFVEVDVE9SIEZVTkNUSU9OIFxcXFxcblxuXHRmdW5jdGlvbiBkZXRlY3Rzd2lwZShlbCwgZnVuYykge1xuXHRcdHZhciBzd2lwZV9kZXQgPSB7fTtcblx0XHRzd2lwZV9kZXQuc1ggPSAwO3N3aXBlX2RldC5zWSA9IDA7c3dpcGVfZGV0LmVYID0gMDtzd2lwZV9kZXQuZVkgPSAwO1xuXHRcdHZhciBtaW5feCA9IDMwOyAvL21pbiB4IHN3aXBlIGZvciBob3Jpem9udGFsIHN3aXBlXG5cdFx0dmFyIG1heF94ID0gMzA7IC8vbWF4IHggZGlmZmVyZW5jZSBmb3IgdmVydGljYWwgc3dpcGVcblx0XHR2YXIgbWluX3kgPSA1MDsgLy9taW4geSBzd2lwZSBmb3IgdmVydGljYWwgc3dpcGVcblx0XHR2YXIgbWF4X3kgPSA2MDsgLy9tYXggeSBkaWZmZXJlbmNlIGZvciBob3Jpem9udGFsIHN3aXBlXG5cdFx0dmFyIGRpcmVjID0gXCJcIjtcblx0XHR2YXIgZWxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWwpO1xuXHRcdGVsZS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgZnVuY3Rpb24gKGUpIHtcblx0XHRcdHZhciB0ID0gZS50b3VjaGVzWzBdO1xuXHRcdFx0c3dpcGVfZGV0LnNYID0gdC5zY3JlZW5YO1xuXHRcdFx0c3dpcGVfZGV0LnNZID0gdC5zY3JlZW5ZO1xuXHRcdH0sIGZhbHNlKTtcblx0XHRlbGUuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgZnVuY3Rpb24gKGUpIHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdHZhciB0ID0gZS50b3VjaGVzWzBdO1xuXHRcdFx0c3dpcGVfZGV0LmVYID0gdC5zY3JlZW5YO1xuXHRcdFx0c3dpcGVfZGV0LmVZID0gdC5zY3JlZW5ZO1xuXHRcdH0sIGZhbHNlKTtcblx0XHRlbGUuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0Ly9ob3Jpem9udGFsIGRldGVjdGlvblxuXHRcdFx0aWYgKChzd2lwZV9kZXQuZVggLSBtaW5feCA+IHN3aXBlX2RldC5zWCB8fCBzd2lwZV9kZXQuZVggKyBtaW5feCA8IHN3aXBlX2RldC5zWCkgJiYgc3dpcGVfZGV0LmVZIDwgc3dpcGVfZGV0LnNZICsgbWF4X3kgJiYgc3dpcGVfZGV0LnNZID4gc3dpcGVfZGV0LmVZIC0gbWF4X3kgJiYgc3dpcGVfZGV0LmVYID4gMCkge1xuXHRcdFx0XHRpZiAoc3dpcGVfZGV0LmVYID4gc3dpcGVfZGV0LnNYKSBkaXJlYyA9IFwiclwiO2Vsc2UgZGlyZWMgPSBcImxcIjtcblx0XHRcdH1cblx0XHRcdC8vdmVydGljYWwgZGV0ZWN0aW9uXG5cdFx0XHRlbHNlIGlmICgoc3dpcGVfZGV0LmVZIC0gbWluX3kgPiBzd2lwZV9kZXQuc1kgfHwgc3dpcGVfZGV0LmVZICsgbWluX3kgPCBzd2lwZV9kZXQuc1kpICYmIHN3aXBlX2RldC5lWCA8IHN3aXBlX2RldC5zWCArIG1heF94ICYmIHN3aXBlX2RldC5zWCA+IHN3aXBlX2RldC5lWCAtIG1heF94ICYmIHN3aXBlX2RldC5lWSA+IDApIHtcblx0XHRcdFx0XHRpZiAoc3dpcGVfZGV0LmVZID4gc3dpcGVfZGV0LnNZKSBkaXJlYyA9IFwiZFwiO2Vsc2UgZGlyZWMgPSBcInVcIjtcblx0XHRcdFx0fVxuXG5cdFx0XHRpZiAoZGlyZWMgIT0gXCJcIikge1xuXHRcdFx0XHRpZiAodHlwZW9mIGZ1bmMgPT0gJ2Z1bmN0aW9uJykgZnVuYyhlbCwgZGlyZWMpO1xuXHRcdFx0fVxuXHRcdFx0dmFyIGRpcmVjID0gXCJcIjtcblx0XHRcdHN3aXBlX2RldC5zWCA9IDA7c3dpcGVfZGV0LnNZID0gMDtzd2lwZV9kZXQuZVggPSAwO3N3aXBlX2RldC5lWSA9IDA7XG5cdFx0fSwgZmFsc2UpO1xuXHR9XG5cblx0Ly8gQ0hPU0UgVEhFIE5FWFQgU0xJREUgVE8gU0hPVyBBTkQgQ0xJQ0sgVEhFIFBBR0lOQVRJT04gQlVUVE9OIFRIQVQgUkVMQVRFUyBUTyBJVC4gXFxcXFxuXG5cdHZhciBzd2lwZUNvbnRyb2xsZXIgPSBmdW5jdGlvbiBzd2lwZUNvbnRyb2xsZXIoZWwsIGQpIHtcblxuXHRcdGlmIChlbCA9PT0gJ3NlY3Rpb240Jykge1xuXG5cdFx0XHR2YXIgc2VjdGlvbjRQYWdpbmF0aW9uTGVuZ3RoID0gJCgnLnNlY3Rpb240UGFnaW5hdG9yQnV0dG9uJykubGVuZ3RoO1xuXG5cdFx0XHRpZiAoZCA9PT0gJ2wnKSB7XG5cblx0XHRcdFx0aWYgKHNlY3Rpb240SWR4IDwgc2VjdGlvbjRQYWdpbmF0aW9uTGVuZ3RoIC0gMSkge1xuXHRcdFx0XHRcdHNlY3Rpb240SWR4Kys7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0c2VjdGlvbjRJZHggPSAwO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0JCgnLnNlY3Rpb240UGFnaW5hdG9yQnV0dG9uJylbc2VjdGlvbjRJZHhdLmNsaWNrKCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoZCA9PT0gJ3InKSB7XG5cblx0XHRcdFx0aWYgKHNlY3Rpb240SWR4ID4gMCkge1xuXHRcdFx0XHRcdHNlY3Rpb240SWR4LS07XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0c2VjdGlvbjRJZHggPSBzZWN0aW9uNFBhZ2luYXRpb25MZW5ndGggLSAxO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0JCgnLnNlY3Rpb240UGFnaW5hdG9yQnV0dG9uJylbc2VjdGlvbjRJZHhdLmNsaWNrKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmIChlbCA9PT0gJ3NlY3Rpb24zJykge1xuXG5cdFx0XHR2YXIgc2VjdGlvbjNQYWdpbmF0aW9uTGVuZ3RoID0gJCgnLnNlY3Rpb24zUGFnaW5hdG9yQnV0dG9uJykubGVuZ3RoO1xuXG5cdFx0XHRpZiAoZCA9PT0gJ2wnKSB7XG5cblx0XHRcdFx0aWYgKHNlY3Rpb24zSWR4IDwgc2VjdGlvbjNQYWdpbmF0aW9uTGVuZ3RoIC0gMSkge1xuXHRcdFx0XHRcdHNlY3Rpb24zSWR4Kys7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0c2VjdGlvbjNJZHggPSAwO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0JCgnLnNlY3Rpb24zUGFnaW5hdG9yQnV0dG9uJylbc2VjdGlvbjNJZHhdLmNsaWNrKCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoZCA9PT0gJ3InKSB7XG5cblx0XHRcdFx0aWYgKHNlY3Rpb24zSWR4ID4gMCkge1xuXHRcdFx0XHRcdHNlY3Rpb24zSWR4LS07XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0c2VjdGlvbjNJZHggPSBzZWN0aW9uM1BhZ2luYXRpb25MZW5ndGggLSAxO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0JCgnLnNlY3Rpb24zUGFnaW5hdG9yQnV0dG9uJylbc2VjdGlvbjNJZHhdLmNsaWNrKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdC8vIElOSVRJQVRFIEZPUiBTV0lQRSBERVRFQ1RJT04gT04gU0VDVElPTlMgMyBBTkQgNCBFWENFUFQgSU4gQURNSU4gUFJFVklFVy4gXFxcXFxuXG5cdGlmICghJChsb2NhdGlvbikuYXR0cignaHJlZicpLmluY2x1ZGVzKCdpbmRleC5waHAnKSkge1xuXHRcdGRldGVjdHN3aXBlKCdzZWN0aW9uNCcsIHN3aXBlQ29udHJvbGxlcik7XG5cdFx0ZGV0ZWN0c3dpcGUoJ3NlY3Rpb24zJywgc3dpcGVDb250cm9sbGVyKTtcblx0fVxufSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbVpoYTJWZk9HSTJaamc1TVRndWFuTWlYU3dpYm1GdFpYTWlPbHNpZEdsdFpTSXNJbk5sWTNScGIyNHpTV1I0SWl3aWMyVmpkR2x2YmpSSlpIZ2lMQ0p0WVhOMFpYSlBZbW9pTENKelpXTjBhVzl1TWtOMWNuSmxiblJKWkhnaUxDSnpaV04wYVc5dU1VTjFjbkpsYm5SSlpIZ2lMQ0p6WldOMGFXOXVNeUlzSW1GMWRHOXRZWFJsSWl3aWFYTkJkWFJ2YldGMFpXUWlMQ0p6WldOMGFXOXVOQ0lzSW1KaGMydGxkR0poYkd3aUxDSnNiMjl3UVcxdmRXNTBJaXdpWm05dmRHSmhiR3dpTENKMFpXNXVhWE1pTENKaVlYTmxZbUZzYkNJc0ltWmhiaUlzSW1odmJXVndZV2RsVFc5aVNXMWhaMlZ6SWl3aUpDSXNJbVJ2WTNWdFpXNTBJaXdpY21WaFpIa2lMQ0ozYVc1a2IzY2lMQ0pwYm01bGNsZHBaSFJvSWl3aVptVjBZMmdpTENKMGFHVnVJaXdpY21WemNHOXVjMlVpTENKcWMyOXVJaXdpYzNCeWFYUmxUMkpxSWl3aVNXUnNaVVp5WVcxbElpd2labWxzZEdWeVFubFdZV3gxWlNJc0ltWnlZVzFsY3lJc0ltRnVhVzFoZEdsdmJrRnljbUY1SWl3aVlXNXBiV0YwYjNKVFpYUjFjQ0lzSW1sdFlXZGxRMjl1ZEhKdmJHVnlJaXdpYzJWMFNXNTBaWEoyWVd3aUxDSmhjbkpoZVNJc0luTjBjbWx1WnlJc0ltWnBiSFJsY2lJc0ltOGlMQ0owYjB4dmQyVnlRMkZ6WlNJc0ltbHVZMngxWkdWeklpd2liR0Z6ZEZScGJXVWlMQ0oyWlc1a2IzSnpJaXdpZUNJc0lteGxibWQwYUNJc0luSmxjWFZsYzNSQmJtbHRZWFJwYjI1R2NtRnRaU0lzSW1OaGJtTmxiRUZ1YVcxaGRHbHZia1p5WVcxbElpd2lZMkZzYkdKaFkyc2lMQ0psYkdWdFpXNTBJaXdpWTNWeWNsUnBiV1VpTENKRVlYUmxJaXdpWjJWMFZHbHRaU0lzSW5ScGJXVlViME5oYkd3aUxDSk5ZWFJvSWl3aWJXRjRJaXdpYVdRaUxDSnpaWFJVYVcxbGIzVjBJaXdpWTJ4bFlYSlVhVzFsYjNWMElpd2lZVzVwYldGMGIzSWlMQ0poYm1sdFlYUnBiMjVQWW1vaUxDSmtZVzVqYVc1blNXTnZiaUlzSW5Od2NtbDBaVWx0WVdkbElpd2lZMkZ1ZG1Geklpd2laMkZ0WlV4dmIzQWlMQ0poWkdSRGJHRnpjeUlzSW14dmIzQkpaQ0lzSW5Wd1pHRjBaU0lzSW5KbGJtUmxjaUlzSW5Od2NtbDBaU0lzSW05d2RHbHZibk1pTENKMGFHRjBJaXdpWm5KaGJXVkpibVJsZUNJc0luUnBZMnREYjNWdWRDSXNJbXh2YjNCRGIzVnVkQ0lzSW5ScFkydHpVR1Z5Um5KaGJXVWlMQ0p1ZFcxaVpYSlBaa1p5WVcxbGN5SXNJbU52Ym5SbGVIUWlMQ0ozYVdSMGFDSXNJbWhsYVdkb2RDSXNJbWx0WVdkbElpd2liRzl2Y0hNaUxDSmpiR1ZoY2xKbFkzUWlMQ0prY21GM1NXMWhaMlVpTENKbWNtRnRaU0lzSW5raUxDSm5aWFJGYkdWdFpXNTBRbmxKWkNJc0lrbHRZV2RsSWl3aVoyVjBRMjl1ZEdWNGRDSXNJbUZrWkVWMlpXNTBUR2x6ZEdWdVpYSWlMQ0p6Y21NaUxDSndZV2RsVEc5aFpHVnlJaXdpYVc1a1pYZ2lMQ0p5WlcxdmRtVkRiR0Z6Y3lJc0ltWnBibVFpTENKblpYUWlMQ0pqYkdsamF5SXNJbWx1YVhScFlXeHBlbVZUWldOMGFXOXVJaXdpYzJWamRHbHZiazUxYldKbGNpSXNJbWxrZUNJc0luTnBZbXhwYm1keklpd2liV0Z3SWl3aWFYZ2lMQ0psYkdVaUxDSmpjM01pTENKdmNHRmphWFI1SWl3aWFXUjRUMkpxSWl3aWNtVnNaWFpoYm5SQmJtbHRZWFJwYjI0aUxDSm9ZVzVrYkdWUVlXNXBibUYwYVc5dVFuVjBkRzl1UTJ4cFkyc2lMQ0psSWl3aWNHRnljMlZKYm5RaUxDSjBZWEpuWlhRaUxDSmhkSFJ5SWl3aWMyVmpkR2x2Ymtsa0lpd2lZMnh2YzJWemRDSXNJbkpsYkdWMllXNTBSR0YwWVVGeWNtRjVJaXdpYjI0aUxDSmxjeUlzSW1OMWNuSmxiblJVWVhKblpYUWlMQ0pwYm5SbGNuWmhiRTFoYm1GblpYSWlMQ0pvWVhORGJHRnpjeUlzSW14dlkyRjBhVzl1SWl3aWIyNWxjR0ZuWlY5elkzSnZiR3dpTENKelpXTjBhVzl1UTI5dWRHRnBibVZ5SWl3aVpXRnphVzVuSWl3aVlXNXBiV0YwYVc5dVZHbHRaU0lzSW5CaFoybHVZWFJwYjI0aUxDSjFjR1JoZEdWVlVrd2lMQ0ppWldadmNtVk5iM1psSWl3aVlXWjBaWEpOYjNabElpd2liRzl2Y0NJc0ltdGxlV0p2WVhKa0lpd2ljbVZ6Y0c5dWMybDJaVVpoYkd4aVlXTnJJaXdpWkdseVpXTjBhVzl1SWl3aWJXOTJaVlJ2SWl3aVkzVnljbVZ1ZEZObFkzUnBiMjRpTENKelpXTjBhVzl1SWl3aWIyWm1jMlYwSWl3aWRHOXdJaXdpYlc5MlpVUnZkMjRpTENKb2FXUmxURzloWkdsdVowRnVhVzFoZEdsdmJpSXNJbkpsWVdSNVUzUmhkR1VpTENKbWJHRm5JaXdpYzNkcGNHVkRiMjUwY205c2JHVnlJaXdpWTJ4bFlYSkpiblJsY25aaGJDSXNJbkJzWVhraUxDSjBhVzFsYjNWMElpd2ljR0YxYzJVaUxDSnBibTVsY2tobGFXZG9kQ0lzSW0xaGRHTm9UV1ZrYVdFaUxDSnRZWFJqYUdWeklpd2ljR0ZuWlVsa2VDSXNJbUoxY21kbGNpSXNJbU5zWVhOelRHbHpkQ0lzSW1OdmJuUmhhVzV6SWl3aWJtRjJJaXdpY21WdGIzWmxJaXdpWW05a2VTSXNJbk4wZVd4bElpd2ljRzl6YVhScGIyNGlMQ0p6ZEc5d1VISnZjR0ZuWVhScGIyNGlMQ0p1WVhaRGIyNTBjbTlzSWl3aVlXUmtJaXdpWkdWMFpXTjBjM2RwY0dVaUxDSmxiQ0lzSW1aMWJtTWlMQ0p6ZDJsd1pWOWtaWFFpTENKeldDSXNJbk5aSWl3aVpWZ2lMQ0psV1NJc0ltMXBibDk0SWl3aWJXRjRYM2dpTENKdGFXNWZlU0lzSW0xaGVGOTVJaXdpWkdseVpXTWlMQ0owSWl3aWRHOTFZMmhsY3lJc0luTmpjbVZsYmxnaUxDSnpZM0psWlc1Wklpd2ljSEpsZG1WdWRFUmxabUYxYkhRaUxDSmtJaXdpYzJWamRHbHZialJRWVdkcGJtRjBhVzl1VEdWdVozUm9JaXdpYzJWamRHbHZiak5RWVdkcGJtRjBhVzl1VEdWdVozUm9JbDBzSW0xaGNIQnBibWR6SWpvaU96czdPMEZCUVVFc1NVRkJUVUVzVDBGQlR5eEhRVUZpTzBGQlEwRXNTVUZCU1VNc1kwRkJZeXhEUVVGc1FqdEJRVU5CTEVsQlFVbERMR05CUVdNc1EwRkJiRUk3TzBGQlJVRXNTVUZCVFVNc1dVRkJXVHRCUVVOcVFrTXNjVUpCUVc5Q0xFTkJSRWc3UVVGRmFrSkRMSEZDUVVGdlFpeERRVVpJTzBGQlIycENReXhYUVVGVk8wRkJRMVJETEZsQlFWVXNSVUZFUkR0QlFVVlVReXhsUVVGaE8wRkJSa29zUlVGSVR6dEJRVTlxUWtNc1YwRkJWVHRCUVVOVVJpeFpRVUZWTEVWQlJFUTdRVUZGVkVNc1pVRkJZVHRCUVVaS0xFVkJVRTg3UVVGWGFrSkZMR0ZCUVZrc1JVRkJRME1zV1VGQldTeERRVUZpTEVWQldFczdRVUZaYWtKRExGZEJRVlVzUlVGQlEwUXNXVUZCV1N4RFFVRmlMRVZCV2s4N1FVRmhha0pGTEZOQlFWRXNSVUZCUTBZc1dVRkJXU3hEUVVGaUxFVkJZbE03UVVGamFrSkhMRmRCUVZVc1JVRkJRMGdzV1VGQldTeERRVUZpTEVWQlpFODdRVUZsYWtKSkxFMUJRVXNzUlVGQlEwb3NXVUZCV1N4RFFVRmlPMEZCWmxrc1EwRkJiRUk3TzBGQmEwSkJMRWxCUVUxTExHOUNRVUZ2UWl4RFFVTjZRaXd3UTBGRWVVSXNSVUZGZWtJc2QwTkJSbmxDTEVWQlIzcENMSE5EUVVoNVFpeEZRVWw2UWl4M1EwRktlVUlzUlVGTGVrSXNiVU5CVEhsQ0xFTkJRVEZDT3p0QlFWRkJReXhGUVVGRlF5eFJRVUZHTEVWQlFWbERMRXRCUVZvc1EwRkJhMElzV1VGQlRUdEJRVU4yUWl4TFFVRkhReXhQUVVGUFF5eFZRVUZRTEVkQlFXOUNMRWRCUVhaQ0xFVkJRVFJDTzBGQlF6ZENPMEZCUTBWRExGRkJRVTBzZFVOQlFVNHNSVUZCSzBORExFbEJRUzlETEVOQlFXOUVMRlZCUVZORExGRkJRVlFzUlVGQmJVSTdRVUZEZEVVc1ZVRkJUMEVzVTBGQlUwTXNTVUZCVkN4RlFVRlFPMEZCUTBFc1IwRkdSQ3hGUVVWSFJpeEpRVVpJTEVOQlJWRXNWVUZCVTBjc1UwRkJWQ3hGUVVGdlFqdEJRVU16UWl4UFFVRk5ReXhaUVVGWlF5eGpRVUZqUml4VlFVRlZSeXhOUVVGNFFpeEZRVUZuUXl4TlFVRm9ReXhEUVVGc1FqdEJRVU5CTVVJc1lVRkJWVk1zVVVGQlZpeERRVUZ0UW10Q0xHTkJRVzVDTEdkRFFVRjNRMGdzVTBGQmVFTXNjMEpCUVhORVF5eGpRVUZqUml4VlFVRlZSeXhOUVVGNFFpeEZRVUZuUXl4VlFVRm9ReXhEUVVGMFJEdEJRVU5CTVVJc1lVRkJWVlVzVFVGQlZpeERRVUZwUW1sQ0xHTkJRV3BDTEdkRFFVRnpRMGdzVTBGQmRFTXNjMEpCUVc5RVF5eGpRVUZqUml4VlFVRlZSeXhOUVVGNFFpeEZRVUZuUXl4UlFVRm9ReXhEUVVGd1JEdEJRVU5CTVVJc1lVRkJWVmNzVVVGQlZpeERRVUZ0UW1kQ0xHTkJRVzVDTEdkRFFVRjNRMGdzVTBGQmVFTXNjMEpCUVhORVF5eGpRVUZqUml4VlFVRlZSeXhOUVVGNFFpeEZRVUZuUXl4VlFVRm9ReXhEUVVGMFJEdEJRVU5CTVVJc1lVRkJWVThzVlVGQlZpeERRVUZ4UW05Q0xHTkJRWEpDTEdkRFFVRXdRMGdzVTBGQk1VTXNjMEpCUVhkRVF5eGpRVUZqUml4VlFVRlZSeXhOUVVGNFFpeEZRVUZuUXl4UlFVRm9ReXhEUVVGNFJEdEJRVU5CTVVJc1lVRkJWVmtzUjBGQlZpeERRVUZqWlN4alFVRmtMR2REUVVGdFEwZ3NVMEZCYmtNc2MwSkJRV2xFUXl4alFVRmpSaXhWUVVGVlJ5eE5RVUY0UWl4RlFVRm5ReXhMUVVGb1F5eERRVUZxUkR0QlFVTklPMEZCUTBkRk8wRkJRMEZETEd0Q1FVRmxOMElzVTBGQlppeEZRVUV3UWl4RFFVRXhRanRCUVVOSU8wRkJRMGM0UWl4bFFVRlpMRmxCUVUwN1FVRkRha0pFTEcxQ1FVRmxOMElzVTBGQlppeEZRVUV3UWl4RFFVRXhRanRCUVVOQkxFbEJSa1FzUlVGRlJ5eEpRVVpJTzBGQlIwRXNSMEZvUWtRN1FVRnBRa0U3UVVGRFJqdEJRVU5ETEV0QlFVMTVRaXhuUWtGQlowSXNVMEZCYUVKQkxHRkJRV2RDTEVOQlFVTk5MRXRCUVVRc1JVRkJVVU1zVFVGQlVpeEZRVUZ0UWp0QlFVTjBReXhUUVVGUFJDeE5RVUZOUlN4TlFVRk9MRU5CUVdFN1FVRkJRU3hWUVVGTExFOUJRVTlETEVWQlFVVXNWVUZCUml4RFFVRlFMRXRCUVhsQ0xGRkJRWHBDTEVsQlFYRkRRU3hGUVVGRkxGVkJRVVlzUlVGQlkwTXNWMEZCWkN4SFFVRTBRa01zVVVGQk5VSXNRMEZCY1VOS0xFOUJRVTlITEZkQlFWQXNSVUZCY2tNc1EwRkJNVU03UVVGQlFTeEhRVUZpTEVOQlFWQTdRVUZEUml4RlFVWkVPMEZCUjBRN1FVRkRReXhMUVVGTlVDeG5Ra0ZCWjBJc1UwRkJhRUpCTEdGQlFXZENMRWRCUVUwN08wRkJSWHBDTEUxQlFVbFRMRmRCUVZjc1EwRkJaanRCUVVOQkxFMUJRVWxETEZWQlFWVXNRMEZCUXl4SlFVRkVMRVZCUVU4c1MwRkJVQ3hGUVVGakxGRkJRV1FzUlVGQmQwSXNSMEZCZUVJc1EwRkJaRHRCUVVOQkxFOUJRVWtzU1VGQlNVTXNTVUZCU1N4RFFVRmFMRVZCUVdWQkxFbEJRVWxFTEZGQlFWRkZMRTFCUVZvc1NVRkJjMElzUTBGQlEzWkNMRTlCUVU5M1FpeHhRa0ZCTjBNc1JVRkJiMFVzUlVGQlJVWXNRMEZCZEVVc1JVRkJlVVU3UVVGRGRrVjBRaXhWUVVGUGQwSXNjVUpCUVZBc1IwRkJLMEo0UWl4UFFVRlBjVUlzVVVGQlVVTXNRMEZCVWl4SlFVRlhMSFZDUVVGc1FpeERRVUV2UWp0QlFVTkJkRUlzVlVGQlQzbENMRzlDUVVGUUxFZEJRVGhDZWtJc1QwRkJUM0ZDTEZGQlFWRkRMRU5CUVZJc1NVRkJWeXh6UWtGQmJFSXNTMEZCTmtOMFFpeFBRVUZQY1VJc1VVRkJVVU1zUTBGQlVpeEpRVUZYTERaQ1FVRnNRaXhEUVVFelJUdEJRVU5FT3p0QlFVVkVMRTFCUVVrc1EwRkJRM1JDTEU5QlFVOTNRaXh4UWtGQldpeEZRVU5GZUVJc1QwRkJUM2RDTEhGQ1FVRlFMRWRCUVN0Q0xGVkJRVk5GTEZGQlFWUXNSVUZCYlVKRExFOUJRVzVDTEVWQlFUUkNPMEZCUTNwRUxFOUJRVWxETEZkQlFWY3NTVUZCU1VNc1NVRkJTaXhIUVVGWFF5eFBRVUZZTEVWQlFXWTdRVUZEUVN4UFFVRkpReXhoUVVGaFF5eExRVUZMUXl4SFFVRk1MRU5CUVZNc1EwRkJWQ3hGUVVGWkxFMUJRVTFNTEZkQlFWZFNMRkZCUVdwQ0xFTkJRVm9zUTBGQmFrSTdRVUZEUVN4UFFVRkpZeXhMUVVGTGJFTXNUMEZCVDIxRExGVkJRVkFzUTBGQmEwSXNXVUZCVnp0QlFVRkZWQ3hoUVVGVFJTeFhRVUZYUnl4VlFVRndRanRCUVVGclF5eEpRVUZxUlN4RlFVTlFRU3hWUVVSUExFTkJRVlE3UVVGRlFWZ3NZMEZCVjFFc1YwRkJWMGNzVlVGQmRFSTdRVUZEUVN4VlFVRlBSeXhGUVVGUU8wRkJRMFFzUjBGUVJEczdRVUZUUml4TlFVRkpMRU5CUVVOc1F5eFBRVUZQZVVJc2IwSkJRVm9zUlVGRFFYcENMRTlCUVU5NVFpeHZRa0ZCVUN4SFFVRTRRaXhWUVVGVFV5eEZRVUZVTEVWQlFXRTdRVUZEZWtORkxHZENRVUZoUml4RlFVRmlPMEZCUTBRc1IwRkdSRHRCUVVkR0xFVkJka0pFT3p0QlFUQkNRU3hMUVVGTlJ5eFhRVUZYTEZOQlFWaEJMRkZCUVZjc1EwRkJRME1zV1VGQlJDeEZRVUZyUWpzN1FVRkZiRU1zVFVGQlNVTXNWMEZCU2l4RlFVTkRReXhYUVVSRUxFVkJSVU5ETEUxQlJrUTdRVUZIUmp0QlFVTkZMRmRCUVZORExGRkJRVlFzUjBGQmNVSTdRVUZEYmtJM1F5eExRVUZGTEZWQlFVWXNSVUZCWXpoRExGRkJRV1FzUTBGQmRVSXNVVUZCZGtJN1FVRkRRVXdzWjBKQlFXRk5MRTFCUVdJc1IwRkJjMEkxUXl4UFFVRlBkMElzY1VKQlFWQXNRMEZCTmtKclFpeFJRVUUzUWl4RFFVRjBRanRCUVVOQlNDeGxRVUZaVFN4TlFVRmFPMEZCUTBGT0xHVkJRVmxQTEUxQlFWbzdRVUZEUkRzN1FVRkZSQ3hYUVVGVFF5eE5RVUZVTEVOQlFXbENReXhQUVVGcVFpeEZRVUV3UWpzN1FVRkZla0lzVDBGQlNVTXNUMEZCVHl4RlFVRllPMEZCUVVFc1QwRkRRME1zWVVGQllTeERRVVJrTzBGQlFVRXNUMEZGUTBNc1dVRkJXU3hEUVVaaU8wRkJRVUVzVDBGSFEwTXNXVUZCV1N4RFFVaGlPMEZCUVVFc1QwRkpRME1zWjBKQlFXZENUQ3hSUVVGUlN5eGhRVUZTTEVsQlFYbENMRU5CU2pGRE8wRkJRVUVzVDBGTFEwTXNhVUpCUVdsQ1RpeFJRVUZSVFN4alFVRlNMRWxCUVRCQ0xFTkJURFZET3p0QlFVOUJUQ3hSUVVGTFRTeFBRVUZNTEVkQlFXVlFMRkZCUVZGUExFOUJRWFpDTzBGQlEwRk9MRkZCUVV0UExFdEJRVXdzUjBGQllWSXNVVUZCVVZFc1MwRkJja0k3UVVGRFFWQXNVVUZCUzFFc1RVRkJUQ3hIUVVGalZDeFJRVUZSVXl4TlFVRjBRanRCUVVOQlVpeFJRVUZMVXl4TFFVRk1MRWRCUVdGV0xGRkJRVkZWTEV0QlFYSkNPMEZCUTBGVUxGRkJRVXRWTEV0QlFVd3NSMEZCWVZnc1VVRkJVVmNzUzBGQmNrSTdPMEZCUlVGV0xGRkJRVXRLTEUxQlFVd3NSMEZCWXl4WlFVRlpPenRCUVVWeVFrMHNhVUpCUVdFc1EwRkJZanM3UVVGRlFTeFJRVUZKUVN4WlFVRlpSU3hoUVVGb1FpeEZRVUVyUWpzN1FVRkZiRU5HTEdsQ1FVRlpMRU5CUVZvN1FVRkRTenRCUVVOQkxGTkJRVWxFTEdGQlFXRkpMR2xDUVVGcFFpeERRVUZzUXl4RlFVRnhRenRCUVVOeVF6dEJRVU5GU2l4dlFrRkJZeXhEUVVGa08wRkJRMFFzVFVGSVJDeE5RVWRQTzBGQlExQkZPMEZCUTBWR0xHMUNRVUZoTEVOQlFXSTdPMEZCUlVFc1ZVRkJSMFVzWTBGQlkwZ3NTMEZCUzFVc1MwRkJkRUlzUlVGQk5rSTdRVUZETlVJelJDeGpRVUZQZVVJc2IwSkJRVkFzUTBGQk5FSmhMR0ZCUVdGTkxFMUJRWHBETzBGQlEwRTdRVUZEUmp0QlFVTklPMEZCUTBZc1NVRndRa2c3TzBGQmMwSkJTeXhSUVVGTFNDeE5RVUZNTEVkQlFXTXNXVUZCV1RzN1FVRkZlRUk3UVVGRFFVY3NVMEZCUzAwc1QwRkJUQ3hEUVVGaFN5eFRRVUZpTEVOQlFYVkNMRU5CUVhaQ0xFVkJRVEJDTEVOQlFURkNMRVZCUVRaQ1dDeExRVUZMVHl4TFFVRnNReXhGUVVGNVExQXNTMEZCUzFFc1RVRkJPVU03TzBGQlJVRlNMRk5CUVV0TkxFOUJRVXdzUTBGQllVMHNVMEZCWWl4RFFVTkZXaXhMUVVGTFV5eExRVVJRTEVWQlJVVndRaXhoUVVGaE5VSXNZMEZCWWl4RFFVRTBRbmRETEZWQlFUVkNMRVZCUVhkRFdTeExRVUY0UXl4RFFVRTRRM2hETEVOQlJtaEVMRVZCUjBWblFpeGhRVUZoTlVJc1kwRkJZaXhEUVVFMFFuZERMRlZCUVRWQ0xFVkJRWGREV1N4TFFVRjRReXhEUVVFNFEwTXNRMEZJYUVRc1JVRkpSU3hIUVVwR0xFVkJTMFVzUjBGTVJpeEZRVTFGTEVOQlRrWXNSVUZQUlN4RFFWQkdMRVZCVVVVdlJDeFBRVUZQUXl4VlFVRlFMRWRCUVc5Q0xFdEJVblJDTEVWQlUwVkVMRTlCUVU5RExGVkJRVkFzUjBGQmIwSXNSMEZVZEVJN1FVRlZSQ3hKUVdaRU96dEJRV2xDUVN4VlFVRlBaMFFzU1VGQlVEdEJRVU5CT3p0QlFVVkVPMEZCUTBGU0xGZEJRVk16UXl4VFFVRlRhMFVzWTBGQlZDeERRVUYzUWl4UlFVRjRRaXhEUVVGVU8wRkJRMEYyUWl4VFFVRlBaU3hMUVVGUUxFZEJRV1Y0UkN4UFFVRlBReXhWUVVGUUxFZEJRVzlDTEV0QlFXNURPMEZCUTBGM1F5eFRRVUZQWjBJc1RVRkJVQ3hIUVVGblFucEVMRTlCUVU5RExGVkJRVkFzUjBGQmIwSXNSMEZCY0VNN08wRkJSVUU3UVVGRFFYVkRMR2RDUVVGakxFbEJRVWw1UWl4TFFVRktMRVZCUVdRN08wRkJSVUU3UVVGRFFURkNMR2RDUVVGalVTeFBRVUZQTzBGQlEzQkNVU3haUVVGVFpDeFBRVUZQZVVJc1ZVRkJVQ3hEUVVGclFpeEpRVUZzUWl4RFFVUlhPMEZCUlhCQ1ZpeFZRVUZQTEVsQlJtRTdRVUZIY0VKRExGZEJRVkVzU1VGSVdUdEJRVWx3UWtNc1ZVRkJUMnhDTEZkQlNtRTdRVUZMY0VKakxHMUNRVUZuUW1oQ0xHRkJRV0UxUWl4alFVRmlMRU5CUVRSQ1lTeE5RVXg0UWp0QlFVMXdRamhDTEd0Q1FVRmxMRU5CVGtzN1FVRlBjRUpOTEZWQlFVOXlRaXhoUVVGaEwwTTdRVUZRUVN4SFFVRlFMRU5CUVdRN08wRkJWVUU3UVVGRFFXbEVMR05CUVZreVFpeG5Ra0ZCV2l4RFFVRTJRaXhOUVVFM1FpeEZRVUZ4UTNwQ0xGRkJRWEpETzBGQlEwRkdMR05CUVZrMFFpeEhRVUZhTEVkQlFXdENMREJEUVVGc1FqdEJRVU5CTEVWQk5VWkVPenRCUVRoR1JEczdRVUZGUXl4TFFVRk5ReXhoUVVGaExGTkJRV0pCTEZWQlFXRXNRMEZCUTBNc1MwRkJSQ3hGUVVGWE8wRkJRemRDTEUxQlFVZEJMRlZCUVZVc1EwRkJZaXhGUVVGblFqdEJRVU5tZWtVc1MwRkJSU3hQUVVGR0xFVkJRVmN3UlN4WFFVRllMRU5CUVhWQ0xGbEJRWFpDTzBGQlEwRXhSU3hMUVVGRkxHOUNRVUZHTEVWQlFYZENNRVVzVjBGQmVFSXNRMEZCYjBNc2FVSkJRWEJETzBGQlEwRXhSU3hMUVVGRkxGZEJRVVlzUlVGQlpUSkZMRWxCUVdZc1EwRkJiMElzVlVGQmNFSXNSVUZCWjBNM1FpeFJRVUZvUXl4RFFVRjVReXhoUVVGNlF6dEJRVU5CT1VNc1MwRkJSU3hoUVVGR0xFVkJRV2xDT0VNc1VVRkJha0lzUTBGQk1FSXNhVUpCUVRGQ08wRkJRMEU1UXl4TFFVRkZMR0ZCUVVZc1JVRkJhVUl5UlN4SlFVRnFRaXhEUVVGelFpeFBRVUYwUWl4RlFVRXJRamRDTEZGQlFTOUNMRU5CUVhkRExGbEJRWGhETzBGQlEwRTVReXhMUVVGRkxGZEJRVVlzUlVGQlpUSkZMRWxCUVdZc1EwRkJiMElzWTBGQmNFSXNSVUZCYjBNM1FpeFJRVUZ3UXl4RFFVRTJReXhOUVVFM1F6dEJRVU5CVWl4alFVRlhMRmxCUVUwN1FVRkRhRUowUXl4TlFVRkZMRFJDUVVGR0xFVkJRV2RETWtVc1NVRkJhRU1zUTBGQmNVTXNWVUZCY2tNc1JVRkJhVVEzUWl4UlFVRnFSQ3hEUVVFd1JDeFJRVUV4UkR0QlFVTkJMRWxCUmtRc1JVRkZSeXhKUVVaSU8wRkJSMEVzUjBGV1JDeE5RVmRMTzBGQlEwbzVReXhMUVVGRkxFOUJRVVlzUlVGQlZ6QkZMRmRCUVZnc1EwRkJkVUlzV1VGQmRrSTdRVUZEUVRGRkxFdEJRVVVzWVVGQlJpeEZRVUZwUWpCRkxGZEJRV3BDTEVOQlFUWkNMR2xDUVVFM1FqdEJRVU5CTVVVc2VVTkJRVzlEZVVVc1MwRkJjRU1zYTBKQlFYZEVReXhYUVVGNFJDeERRVUZ2UlN4cFFrRkJjRVU3UVVGRFFURkZMSGRDUVVGeFFqSkZMRWxCUVhKQ0xIVkNRVUZuUkRkQ0xGRkJRV2hFTEVOQlFYbEVMR2xDUVVGNlJEdEJRVU5CT1VNc2RVSkJRVzlDTWtVc1NVRkJjRUlzUTBGQmVVSXNUMEZCZWtJc1JVRkJhME0zUWl4UlFVRnNReXhEUVVFeVF5eFpRVUV6UXpzN1FVRkZRU3hQUVVGSE9VTXNaVUZCWVhsRkxFdEJRV0lzYzBKQlFYRkRMME1zVFVGQmNrTXNTVUZCSzBNeFFpeGxRVUZoZVVVc1MwRkJZaXcyUWtGQk5FTXZReXhOUVVFMVF5eEhRVUZ4UkN4RFFVRjJSeXhGUVVFd1J6dEJRVU42UnpGQ0xHMUNRVUZoZVVVc1MwRkJZaXh6UWtGQmNVTkhMRWRCUVhKRExFTkJRWGxETEVOQlFYcERMRVZCUVRSRFF5eExRVUUxUXp0QlFVTkJPMEZCUTBRN1FVRkRSQ3hGUVhaQ1JEczdRVUY1UWtRN08wRkJSVU1zUzBGQlRVTXNiMEpCUVc5Q0xGTkJRWEJDUVN4cFFrRkJiMElzUTBGQlEwTXNZVUZCUkN4RlFVRm5Ra01zUjBGQmFFSXNSVUZCZDBJN1FVRkRha1JvUml4cFFrRkJZU3RGTEdGQlFXSXNhMEpCUVhWRFF5eEhRVUYyUXl4RlFVRTRRME1zVVVGQk9VTXNRMEZCZFVRc2IwSkJRWFpFTEVWQlFUWkZReXhIUVVFM1JTeERRVUZwUml4VlFVRkRReXhGUVVGRUxFVkJRVXRETEVkQlFVd3NSVUZCWVR0QlFVTTNSbkJHTEV0QlFVVnZSaXhIUVVGR0xFVkJRVTlETEVkQlFWQXNRMEZCVnl4RlFVRkRReXhUUVVGVExFTkJRVllzUlVGQldEdEJRVU5CTEVkQlJrUTdPMEZCU1VGMFJpeHBRa0ZCWVN0RkxHRkJRV0lzYTBKQlFYVkRReXhIUVVGMlF5eEZRVUU0UTBzc1IwRkJPVU1zUTBGQmEwUTdRVUZEYWtRc1owSkJRV0VzV1VGRWIwTTdRVUZGYWtRc1kwRkJWenRCUVVaelF5eEhRVUZzUkR0QlFVbEJMRVZCVkVRN08wRkJWMFE3UVVGRFExQXNiVUpCUVd0Q0xFTkJRV3hDTEVWQlFYRkNMRU5CUVhKQ08wRkJRMEZCTEcxQ1FVRnJRaXhEUVVGc1FpeEZRVUZ4UWl4RFFVRnlRanRCUVVOQlFTeHRRa0ZCYTBJc1EwRkJiRUlzUlVGQmNVSXNRMEZCY2tJN08wRkJSVVE3TzBGQlJVTXNTMEZCVFM5RUxHbENRVUZwUWl4VFFVRnFRa0VzWTBGQmFVSXNRMEZCUTNkRkxFMUJRVVFzUlVGQlUxSXNZVUZCVkN4RlFVRXlRanRCUVVOcVJDeE5RVUZKVXl3d1FrRkJTanM3UVVGRlFTeE5RVUZIVkN4clFrRkJhMElzUTBGQmNrSXNSVUZCZDBJN1FVRkRka0lzVjBGQlQxRXNUMEZCVDI1SExHdENRVUZrTzBGQlEwTXNVMEZCU3l4RFFVRk1PMEZCUTBOdlJ5eDVRa0ZCYjBKMFJ5eFZRVUZWVHl4VlFVRTVRanRCUVVORU8wRkJRMEVzVTBGQlN5eERRVUZNTzBGQlEwTXJSaXg1UWtGQmIwSjBSeXhWUVVGVlV5eFJRVUU1UWp0QlFVTkVPMEZCUTBFc1UwRkJTeXhEUVVGTU8wRkJRME0yUml4NVFrRkJiMEowUnl4VlFVRlZWU3hOUVVFNVFqdEJRVU5FTzBGQlEwRXNVMEZCU3l4RFFVRk1PMEZCUTBNMFJpeDVRa0ZCYjBKMFJ5eFZRVUZWVnl4UlFVRTVRanRCUVVORU8wRkJRMEVzVTBGQlN5eERRVUZNTzBGQlEwTXlSaXg1UWtGQmIwSjBSeXhWUVVGVldTeEhRVUU1UWp0QlFVTkVPMEZCWmtRN1FVRnBRa0U3TzBGQlJVUkZMR2xDUVVGaEswVXNZVUZCWWl4RlFVRTRRa29zU1VGQk9VSXNRMEZCYlVNc1QwRkJia01zUlVGQk5FTkVMRmRCUVRWRExFTkJRWGRFTEZsQlFYaEVPMEZCUTBFeFJTeHBRa0ZCWVN0RkxHRkJRV0lzYTBKQlFYVkRVU3h0UWtGQmFVSlNMR0ZCUVdwQ0xHZENRVUYyUXl4RlFVRnpSa3dzVjBGQmRFWXNRMEZCYTBjc2FVSkJRV3hITzBGQlEwRkpMRzlDUVVGclFrTXNZVUZCYkVJc1JVRkJhVU5STEcxQ1FVRnBRbElzWVVGQmFrSXNaMEpCUVdwRE96dEJRVVZCZWtNc1lVRkJWeXhaUVVGTk8wRkJRMmhDTEU5QlFVZDVReXhyUWtGQmEwSXNRMEZCY2tJc1JVRkJkMEk3UVVGRGRrSjJReXhoUVVGVFowUXNhVUpCUVZRN1FVRkRRVHM3UVVGRlJIaEdMR3RDUVVGaEswVXNZVUZCWWl4RlFVRTRRa29zU1VGQk9VSXNkVUpCUVhsRU4wSXNVVUZCZWtRc1EwRkJhMFVzYVVKQlFXeEZPMEZCUTBFNVF5eHJRa0ZCWVN0RkxHRkJRV0lzUlVGQk9FSktMRWxCUVRsQ0xFTkJRVzFETEU5QlFXNURMRVZCUVRSRE4wSXNVVUZCTlVNc1EwRkJjVVFzV1VGQmNrUTdRVUZEUVN4SFFWQkVMRVZCVDBjc1IwRlFTRHM3UVVGVFFTeE5RVUZIZVVNc2JVSkJRV2xDVWl4aFFVRnFRaXh4UWtGQlowUXZSU3hsUVVGaEswVXNZVUZCWWl4RlFVRTRRa29zU1VGQk9VSXNkVUpCUVhsRWFrUXNUVUZCZWtRc1IwRkJhMFVzUTBGQmNrZ3NSVUZCZDBnN1FVRkRka2cyUkN4elFrRkJhVUpTTEdGQlFXcENMRzFDUVVFNFF5eERRVUU1UXp0QlFVTkJMRWRCUmtRc1RVRkZUenRCUVVOT1VTeHpRa0ZCYVVKU0xHRkJRV3BDTEc5Q1FVRXJReXhEUVVFdlF6dEJRVU5CTzBGQlEwUXNSVUY2UTBRN1FVRXdRMFE3UVVGRFEyaEZMR2RDUVVGbE4wSXNVMEZCWml4RlFVRXdRaXhEUVVFeFFqczdRVUZGUkR0QlFVTkRPRUlzWVVGQldTeFpRVUZOTzBGQlEycENSQ3hwUWtGQlpUZENMRk5CUVdZc1JVRkJNRUlzUTBGQk1VSTdRVUZEUVN4RlFVWkVMRVZCUlVjc1MwRkdTRHM3UVVGSlJEczdRVUZGUXl4TFFVRk5kVWNzT0VKQlFUaENMRk5CUVRsQ1FTd3lRa0ZCT0VJc1EwRkJRME1zUTBGQlJDeEZRVUZQT3p0QlFVVXhReXhOUVVGTlZpeE5RVUZOVnl4VFFVRlRNMFlzUlVGQlJUQkdMRVZCUVVWRkxFMUJRVW9zUlVGQldVTXNTVUZCV2l4RFFVRnBRaXhaUVVGcVFpeERRVUZVTEVOQlFWbzdRVUZEUVN4TlFVRk5ReXhaUVVGWk9VWXNSVUZCUlRCR0xFVkJRVVZGTEUxQlFVb3NSVUZCV1Vjc1QwRkJXaXhEUVVGdlFpeFRRVUZ3UWl4RlFVRXJRa1lzU1VGQkwwSXNRMEZCYjBNc1NVRkJjRU1zUTBGQmJFSTdRVUZEUVN4TlFVRkpSeXd3UWtGQlNqczdRVUZGUVN4TlFVRkhSaXhqUVVGakxGVkJRV3BDTEVWQlFUWkNPMEZCUXpWQ09VY3NhVUpCUVdOblJ5eEhRVUZrTzBGQlEwRTdPMEZCUlVRc1RVRkJSMk1zWTBGQll5eFZRVUZxUWl4RlFVRTJRanRCUVVNMVFqZEhMR2xDUVVGakswWXNSMEZCWkR0QlFVTkJPenRCUVVWRWFFWXNWVUZCVFRoR0xGTkJRVTRzUlVGQmJVSnVRaXhKUVVGdVFpeERRVUYzUWl4UFFVRjRRaXhGUVVGcFEwUXNWMEZCYWtNc1EwRkJOa01zV1VGQk4wTTdRVUZEUVRGRkxGVkJRVTA0Uml4VFFVRk9MRVZCUVcxQ2JrSXNTVUZCYmtJc1EwRkJkMElzWTBGQmVFSXNSVUZCZDBORUxGZEJRWGhETEVOQlFXOUVMRTFCUVhCRU8wRkJRMEV4UlN4VlFVRk5PRVlzVTBGQlRpeEZRVUZ0UW01Q0xFbEJRVzVDTEd0Q1FVRjFRMHNzUjBGQmRrTXNSVUZCT0VOc1F5eFJRVUU1UXl4RFFVRjFSQ3hOUVVGMlJEdEJRVU5CT1VNc1ZVRkJUVGhHTEZOQlFVNHNhMEpCUVRSQ1pDeEhRVUUxUWl4RlFVRnRRMDRzVjBGQmJrTXNRMEZCSzBNc2FVSkJRUzlETzBGQlEwRXhSU3hWUVVGTk9FWXNVMEZCVGl4elFrRkJhME53UWl4WFFVRnNReXhEUVVFNFF5eFJRVUU1UXp0QlFVTkJNVVVzU1VGQlJUQkdMRVZCUVVWRkxFMUJRVW9zUlVGQldUbERMRkZCUVZvc1EwRkJjVUlzVVVGQmNrSTdPMEZCUlVGblF5eHZRa0ZCYTBKaExGTkJRVk16Uml4UlFVRk5PRVlzVTBGQlRpeEZRVUZ0UWtRc1NVRkJia0lzUTBGQmQwSXNXVUZCZUVJc1EwRkJWQ3hEUVVGc1FpeEZRVUZ0UldJc1IwRkJia1U3TzBGQlJVRXhReXhoUVVGWExGbEJRVTA3UVVGRGFFSnJReXhqUVVGWGJVSXNVMEZCVXpOR0xGRkJRVTA0Uml4VFFVRk9MRVZCUVcxQ1JDeEpRVUZ1UWl4RFFVRjNRaXhaUVVGNFFpeERRVUZVTEVOQlFWZzdRVUZEUVN4SFFVWkVMRVZCUlVjc1IwRkdTRHM3UVVGSlFTeE5RVUZIUXl4alFVRmpMRlZCUVdwQ0xFVkJRVFJDTzBGQlF6TkNPVVlzVjBGQlRUaEdMRk5CUVU0c1JVRkJiVUp1UWl4SlFVRnVRaXhEUVVGM1FpeGhRVUY0UWl4RlFVRjFRemRDTEZGQlFYWkRMRU5CUVdkRUxGRkJRV2hFTzBGQlEwRTVReXhYUVVGTk9FWXNVMEZCVGl4RlFVRnRRa2NzUlVGQmJrSXNRMEZCYzBJc2EwUkJRWFJDTEVWQlFUQkZMRlZCUVVORExFVkJRVVFzUlVGQlVUdEJRVU12Uld4SExGbEJRVTA0Uml4VFFVRk9MRVZCUVcxQ2JrSXNTVUZCYmtJc1EwRkJkMElzWVVGQmVFSXNSVUZCZFVORUxGZEJRWFpETEVOQlFXMUVMRkZCUVc1RU8wRkJRMFlzU1VGR1JEdEJRVWRCTzBGQlEwUXNSVUZxUTBRN08wRkJiVU5FT3p0QlFVVkRNVVVzUjBGQlJTeHZSRUZCUml4RlFVRjNSRFpGTEV0QlFYaEVMRU5CUVRoRUxGVkJRVU5oTEVOQlFVUXNSVUZCVHpzN1FVRkZjRVVzVFVGQlIzaEhMRlZCUVZWakxFVkJRVVV3Uml4RlFVRkZVeXhoUVVGS0xFVkJRVzFDU2l4UFFVRnVRaXhEUVVFeVFpeFRRVUV6UWl4RlFVRnpRMFlzU1VGQmRFTXNRMEZCTWtNc1NVRkJNME1zUTBGQlZpeEZRVUUwUkhSSExGZEJRUzlFTEVWQlFUUkZPMEZCUXpsRk8wRkJRMGMyUnl4dFFrRkJaMElzUzBGQmFFSXNSVUZCZFVKd1J5eEZRVUZGTUVZc1JVRkJSVk1zWVVGQlNpeEZRVUZ0UWtvc1QwRkJia0lzUTBGQk1rSXNVMEZCTTBJc1JVRkJjME5HTEVsQlFYUkRMRU5CUVRKRExFbEJRVE5ETEVOQlFYWkNPMEZCUTBnN1FVRkRSMDhzYlVKQlFXZENMRWxCUVdoQ0xFVkJRWE5DY0Vjc1JVRkJSVEJHTEVWQlFVVlRMR0ZCUVVvc1JVRkJiVUpLTEU5QlFXNUNMRU5CUVRKQ0xGTkJRVE5DTEVWQlFYTkRSaXhKUVVGMFF5eERRVUV5UXl4SlFVRXpReXhEUVVGMFFpeEZRVUYzUlN4SlFVRjRSVHRCUVVOQk8wRkJRMGc3UVVGRFJTeE5RVUZITEVOQlFVTTNSaXhGUVVGRk1FWXNSVUZCUlZNc1lVRkJTaXhGUVVGdFFrVXNVVUZCYmtJc1EwRkJORUlzVVVGQk5VSXNRMEZCU2l4RlFVRXlRenRCUVVNeFExb3NLMEpCUVRSQ1F5eERRVUUxUWp0QlFVTkJPMEZCUTBRc1JVRmFSRHM3UVVGalJEczdRVUZGUXl4TFFVRkhMRU5CUVVNeFJpeEZRVUZGYzBjc1VVRkJSaXhGUVVGWlZDeEpRVUZhTEVOQlFXbENMRTFCUVdwQ0xFVkJRWGxDZGtVc1VVRkJla0lzUTBGQmEwTXNWMEZCYkVNc1EwRkJTaXhGUVVGdlJEdEJRVU51UkhSQ0xFbEJRVVVzYTBKQlFVWXNSVUZCYzBKMVJ5eGpRVUYwUWl4RFFVRnhRenRCUVVOd1EwTXNjVUpCUVd0Q0xGTkJSR3RDTzBGQlJYQkRReXhYUVVGUkxGVkJSalJDTzBGQlIzQkRReXhyUWtGQlpUTklMRWxCU0hGQ08wRkJTWEJETkVnc1pVRkJXU3hKUVVwM1FqdEJRVXR3UTBNc1kwRkJWeXhKUVV4NVFqdEJRVTF3UTBNc1pVRkJXU3h2UWtGQlEzQkRMRXRCUVVRc1JVRkJWeXhEUVVGRkxFTkJUbGM3UVVGUGNFTnhReXhqUVVGWExHMUNRVUZEY2tNc1MwRkJSQ3hGUVVGWE8wRkJRM3BDT3p0QlFVVkpSQ3hsUVVGWFF5eExRVUZZTzBGQlEwRXNTVUZZYlVNN1FVRlpjRU56UXl4VFFVRk5MRXRCV2poQ08wRkJZWEJEUXl4aFFVRlZMRWxCWWpCQ08wRkJZM0JEUXl4MVFrRkJiMElzUzBGa1owSTdRVUZsY0VORExHTkJRVmM3UVVGbWVVSXNSMEZCY2tNN08wRkJhMEpCYkVnc1NVRkJSU3hyUWtGQlJpeEZRVUZ6UW0xSUxFMUJRWFJDTEVOQlFUWkNMRU5CUVRkQ08wRkJRMEU3TzBGQlJVWTdPMEZCUlVOdVNDeEhRVUZGTEZsQlFVWXNSVUZCWjBJMlJTeExRVUZvUWl4RFFVRnpRaXhWUVVGRFlTeERRVUZFTEVWQlFVODdRVUZETlVJc1RVRkJTVEJDTEdsQ1FVRnBRbkJJTEVWQlFVVXdSaXhGUVVGRlJTeE5RVUZLTEVWQlFWbEhMRTlCUVZvc1EwRkJiMEl2Uml4RlFVRkZMR0ZCUVVZc1EwRkJjRUlzUTBGQmNrSTdPMEZCUlVFc1RVRkJSMjlJTEdWQlFXVm1MRkZCUVdZc1EwRkJkMElzVFVGQmVFSXNRMEZCU0N4RlFVRnZRenRCUVVOdVEyVXNhMEpCUVdVeFF5eFhRVUZtTEVOQlFUSkNMRTFCUVROQ08wRkJRMEV3UXl4clFrRkJaWHBETEVsQlFXWXNRMEZCYjBJc1dVRkJjRUlzUlVGQmEwTkVMRmRCUVd4RExFTkJRVGhETEZGQlFUbERPMEZCUTBFd1F5eHJRa0ZCWlc1RExGRkJRV1lzUTBGQmQwSXNZVUZCZUVJc1JVRkJkVU5ETEVkQlFYWkRMRU5CUVRKRExGVkJRVU5HTEVkQlFVUXNSVUZCVFhGRExFOUJRVTRzUlVGQmEwSTdRVUZETlVSeVNDeE5RVUZGY1Vnc1QwRkJSaXhGUVVGWE0wTXNWMEZCV0N4RFFVRjFRaXhSUVVGMlFqdEJRVU5CTVVVc1RVRkJSWEZJTEU5QlFVWXNSVUZCVnpGRExFbEJRVmdzUTBGQlowSXNUMEZCYUVJc1JVRkJlVUpFTEZkQlFYcENMRU5CUVhGRExGTkJRWEpETEVWQlFXZEVOVUlzVVVGQmFFUXNRMEZCZVVRc1dVRkJla1E3UVVGRFFTeEpRVWhFTzBGQlNVRXNSMEZRUkN4TlFVOVBPMEZCUTA1elJTeHJRa0ZCWlRGRExGZEJRV1lzUTBGQk1rSXNVVUZCTTBJc1JVRkJjVU0xUWl4UlFVRnlReXhEUVVFNFF5eE5RVUU1UXp0QlFVTkJjMFVzYTBKQlFXVnVRaXhGUVVGbUxFTkJRV3RDTEd0RVFVRnNRaXhGUVVGelJTeFZRVUZEUXl4RlFVRkVMRVZCUVZFN1FVRkRNMFZzUnl4TlFVRkZMR3RDUVVGR0xFVkJRWE5DTWtVc1NVRkJkRUlzUTBGQk1rSXNXVUZCTTBJc1JVRkJlVU0zUWl4UlFVRjZReXhEUVVGclJDeFJRVUZzUkR0QlFVTkdMRWxCUmtRN1FVRkhRWE5GTEd0Q1FVRmxia01zVVVGQlppeERRVUYzUWl4aFFVRjRRaXhGUVVGMVEwTXNSMEZCZGtNc1EwRkJNa01zVlVGQlEwWXNSMEZCUkN4RlFVRk5jVU1zVDBGQlRpeEZRVUZyUWp0QlFVTTFSSEpJTEUxQlFVVnhTQ3hQUVVGR0xFVkJRVmN6UXl4WFFVRllMRU5CUVhWQ0xFMUJRWFpDTEVWQlFTdENOVUlzVVVGQkwwSXNRMEZCZDBNc1VVRkJlRU03UVVGRFFUbERMRTFCUVVWeFNDeFBRVUZHTEVWQlFWY3hReXhKUVVGWUxFTkJRV2RDTEU5QlFXaENMRVZCUVhsQ1JDeFhRVUY2UWl4RFFVRnhReXhaUVVGeVF5eEZRVUZ0UkRWQ0xGRkJRVzVFTEVOQlFUUkVMRk5CUVRWRU8wRkJRMEU1UXl4TlFVRkZjVWdzVDBGQlJpeEZRVUZYTVVNc1NVRkJXQ3hEUVVGblFpeFpRVUZvUWl4RlFVRTRRa1FzVjBGQk9VSXNRMEZCTUVNc1VVRkJNVU03UVVGRFFTeEpRVXBFTzBGQlMwRTdRVUZEUkRCRExHbENRVUZsZWtNc1NVRkJaaXhEUVVGdlFpeFBRVUZ3UWl4RlFVRTJRa1FzVjBGQk4wSXNRMEZCZVVNc1UwRkJla01zUlVGQmIwUTFRaXhSUVVGd1JDeERRVUUyUkN4WlFVRTNSRHRCUVVOQkxFVkJkRUpFT3p0QlFYZENSRHM3UVVGRlF6bERMRWRCUVVVc1dVRkJSaXhGUVVGblFqWkZMRXRCUVdoQ0xFTkJRWE5DTEZsQlFVMDdRVUZETTBJc1RVRkJSemRGTEVWQlFVVkhMRTFCUVVZc1JVRkJWWGxFTEUxQlFWWXNUVUZCYzBJMVJDeEZRVUZGTEU5QlFVWXNSVUZCVnpCQ0xFMUJRVmdzUjBGQmIwSXNRMEZCTVVNc1RVRkJhVVFzUTBGQlJURkNMRVZCUVVVc2EwSkJRVVlzUlVGQmMwSnpTQ3hOUVVGMFFpeEhRVUVyUWtNc1IwRkJja1lzUlVGQk1FWTdRVUZETlVZN1FVRkRTWFpJTEV0QlFVVXNhMEpCUVVZc1JVRkJjMEp0U0N4TlFVRjBRaXhEUVVFMlFpeERRVUUzUWp0QlFVTkVMRWRCU0VRc1RVRkhUenRCUVVOT2JrZ3NTMEZCUlN4clFrRkJSaXhGUVVGelFuZElMRkZCUVhSQ08wRkJRMEU3UVVGRFJDeEZRVkJFT3p0QlFWTkVPenRCUVVWRExFdEJRVTFETEhWQ1FVRjFRaXhUUVVGMlFrRXNiMEpCUVhWQ0xFZEJRVTA3UVVGRGJFTXNUVUZCUjNSSUxFOUJRVTlETEZWQlFWQXNSMEZCYjBJc1IwRkJjRUlzU1VGQk1rSXNRMEZCUTBvc1JVRkJSU3hWUVVGR0xFVkJRV054Unl4UlFVRmtMRU5CUVhWQ0xGRkJRWFpDTEVOQlFTOUNMRVZCUVdsRk96dEJRVVZvUlN4UFFVRkhja2NzUlVGQlJTeFJRVUZHTEVWQlFWazBSU3hIUVVGYUxFTkJRV2RDTEVOQlFXaENMRVZCUVcxQ09FTXNWVUZCYmtJc1MwRkJhME1zUTBGQmNrTXNSVUZCZDBNN1FVRkRka014U0N4TlFVRkZMRlZCUVVZc1JVRkJZemhETEZGQlFXUXNRMEZCZFVJc1VVRkJka0k3UVVGRFFUdEJRVU5FTzBGQlEwUXNSVUZRUkRzN1FVRlRSRHM3UVVGRlF5eExRVUZOYzBRc2EwSkJRV3RDTEZOQlFXeENRU3hsUVVGclFpeERRVUZEZFVJc1NVRkJSQ3hGUVVGUE4wSXNVMEZCVUN4RlFVRnJRaTlITEVsQlFXeENMRVZCUVRKQ08wRkJRMmhFTEUxQlFVYzBTU3hKUVVGSUxFVkJRVk03UVVGRFZIcEpMR0ZCUVZVMFJ5eFRRVUZXTEVWQlFYRkNlRWNzVVVGQmNrSXNSMEZCWjBNd1FpeFpRVUZaTEZsQlFVMDdRVUZETDBNMFJ5eHZRa0ZCWjBJNVFpeFRRVUZvUWl4RlFVRXlRaXhIUVVFelFqdEJRVU5CTEVsQlJqWkNMRVZCUlROQ0wwY3NTVUZHTWtJc1EwRkJhRU03UVVGSFF5eEhRVXBFTEUxQlNVODdRVUZEVGpoSkxHbENRVUZqTTBrc1ZVRkJWVFJITEZOQlFWWXNSVUZCY1VKNFJ5eFJRVUZ1UXp0QlFVTkJPMEZCUTBnc1JVRlNSRHM3UVVGVlJEczdRVUZGUXl4TFFVRkhMRU5CUVVOVkxFVkJRVVZ6Unl4UlFVRkdMRVZCUVZsVUxFbEJRVm9zUTBGQmFVSXNUVUZCYWtJc1JVRkJlVUoyUlN4UlFVRjZRaXhEUVVGclF5eFhRVUZzUXl4RFFVRktMRVZCUVc5RU8wRkJRMjVFVGl4alFVRlpMRmxCUVUwN1FVRkRha0lzVDBGQlIyaENMRVZCUVVVc2EwSkJRVVlzUlVGQmMwSnpTQ3hOUVVGMFFpeEhRVUVyUWtNc1IwRkJMMElzU1VGQmMwTXNRMEZCZWtNc1JVRkJORU03UVVGRE0wTjJTQ3hOUVVGRkxIVkNRVUZHTEVWQlFUSkNPRU1zVVVGQk0wSXNRMEZCYjBNc1pVRkJjRU03UVVGRFFUbERMRTFCUVVVc1VVRkJSaXhGUVVGWk5FVXNSMEZCV2l4RFFVRm5RaXhEUVVGb1FpeEZRVUZ0UW10RUxFbEJRVzVDTzBGQlEwRTVTQ3hOUVVGRkxGRkJRVVlzUlVGQldUaERMRkZCUVZvc1EwRkJjVUlzVTBGQmNrSTdRVUZEUVN4SlFVcEVMRTFCU1U4N1FVRkRUaXhSUVVGSmFVWXNWVUZCVlhwR0xGZEJRVmNzV1VGQlRUdEJRVU01UW5SRExFOUJRVVVzZFVKQlFVWXNSVUZCTWtJd1JTeFhRVUV6UWl4RFFVRjFReXhsUVVGMlF6dEJRVU5CTVVVc1QwRkJSU3hSUVVGR0xFVkJRVmswUlN4SFFVRmFMRU5CUVdkQ0xFTkJRV2hDTEVWQlFXMUNiMFFzUzBGQmJrSTdRVUZEUVdoSkxFOUJRVVVzVVVGQlJpeEZRVUZaTUVVc1YwRkJXaXhEUVVGM1FpeFRRVUY0UWp0QlFVTkJia01zYTBKQlFXRjNSaXhQUVVGaU8wRkJRMEVzUzBGTVlTeEZRVXRZYUVvc1NVRk1WeXhEUVVGa08wRkJUVUU3TzBGQlJVbzdPMEZCUlVjc1QwRkJSMmxDTEVWQlFVVXNhMEpCUVVZc1JVRkJjMEp6U0N4TlFVRjBRaXhIUVVFclFrTXNSMEZCTDBJc1IwRkJjVU1zUlVGQlIzQklMRTlCUVU4NFNDeFhRVUZRTEVkQlFYRkNMRU5CUVhoQ0xFTkJRWGhETEVWQlFXOUZPMEZCUTI1RmFra3NUVUZCUlN4WlFVRkdMRVZCUVdkQ2NVWXNSMEZCYUVJc1EwRkJiMElzUlVGQlF5eGhRVUZoTEdsRFFVRmtMRVZCUVhCQ08wRkJRMEVzU1VGR1JDeE5RVVZQTzBGQlEwNXlSaXhOUVVGRkxGbEJRVVlzUlVGQlowSnhSaXhIUVVGb1FpeERRVUZ2UWl4RlFVRkRMR0ZCUVdFc0swSkJRV1FzUlVGQmNFSTdRVUZEUVRzN1FVRkZSRzlET3p0QlFVVklPenRCUVVWSExFOUJRVWQwU0N4UFFVRlBLMGdzVlVGQlVDeERRVUZyUWl3d1FrRkJiRUlzUlVGQk9FTkRMRTlCUVRsRExFbEJRWGxFYUVrc1QwRkJUME1zVlVGQlVDeEhRVUZ2UWl4SFFVRm9SaXhGUVVGeFJqdEJRVU51Umtvc1RVRkJSU3cyUlVGQlJpeEZRVUZwUmpoRExGRkJRV3BHTEVOQlFUQkdMRmRCUVRGR08wRkJRMFFzU1VGR1JDeE5RVVZQTzBGQlEwdzVReXhOUVVGRkxEWkZRVUZHTEVWQlFXbEdNRVVzVjBGQmFrWXNRMEZCTmtZc1YwRkJOMFk3UVVGRFJEczdRVUZGUkN4UFFVRkhNVVVzUlVGQlJTeHJRa0ZCUml4RlFVRnpRakJDTEUxQlFYcENMRVZCUVdsRE8wRkJRVVU3UVVGRGJFTXNVVUZCUjNoRExGVkJRVlZITEZGQlFWWXNRMEZCYlVKRkxGZEJRVzVDTEV0QlFXMURMRWxCUVhSRExFVkJRVFJETzBGQlF6TkRUQ3hsUVVGVlJ5eFJRVUZXTEVOQlFXMUNSU3hYUVVGdVFpeEhRVUZwUXl4SlFVRnFRenRCUVVOQk5rY3NjVUpCUVdkQ0xFbEJRV2hDTEVWQlFYTkNMRlZCUVhSQ0xFVkJRV3RETEVsQlFXeERPMEZCUTBFN1FVRkRSQ3hKUVV4RUxFMUJTMDg3UVVGQlJUdEJRVU5TTEZGQlFVZHNTQ3hWUVVGVlJ5eFJRVUZXTEVOQlFXMUNSU3hYUVVGdVFpeExRVUZ0UXl4SlFVRjBReXhGUVVFMFF6dEJRVU16UXpaSExIRkNRVUZuUWl4TFFVRm9RaXhGUVVGMVFpeFZRVUYyUWp0QlFVTkJiRWdzWlVGQlZVY3NVVUZCVml4RFFVRnRRa1VzVjBGQmJrSXNSMEZCYVVNc1MwRkJha003UVVGRFFUdEJRVU5FT3p0QlFVVkVMRTlCUVVkVExFVkJRVVVzYTBKQlFVWXNSVUZCYzBJd1FpeE5RVUY2UWl4RlFVRnBRenRCUVVGRk8wRkJRMnhETEZGQlFVZDRReXhWUVVGVlRTeFJRVUZXTEVOQlFXMUNSQ3hYUVVGdVFpeExRVUZ0UXl4SlFVRjBReXhGUVVFMFF6dEJRVU16UTB3c1pVRkJWVTBzVVVGQlZpeERRVUZ0UWtRc1YwRkJia0lzUjBGQmFVTXNTVUZCYWtNN1FVRkRRVFpITEhGQ1FVRm5RaXhKUVVGb1FpeEZRVUZ6UWl4VlFVRjBRaXhGUVVGclF5eEpRVUZzUXp0QlFVTkJPMEZCUTBRc1NVRk1SQ3hOUVV0UE8wRkJRVVU3UVVGRFVpeFJRVUZIYkVnc1ZVRkJWVTBzVVVGQlZpeERRVUZ0UWtRc1YwRkJia0lzUzBGQmJVTXNTVUZCZEVNc1JVRkJORU03UVVGRE0wTTJSeXh4UWtGQlowSXNTMEZCYUVJc1JVRkJkVUlzVlVGQmRrSTdRVUZEUVd4SUxHVkJRVlZOTEZGQlFWWXNRMEZCYlVKRUxGZEJRVzVDTEVkQlFXbERMRXRCUVdwRE8wRkJRMEU3UVVGRFJEdEJRVU5FTEVkQmRrUkVMRVZCZFVSSExFZEJka1JJTzBGQmQwUkJPenRCUVVWR096dEJRVVZEVXl4SFFVRkZMRmRCUVVZc1JVRkJaVFpGTEV0QlFXWXNRMEZCY1VJc1ZVRkJRMkVzUTBGQlJDeEZRVUZQTzBGQlF6TkNMRTFCUVUwd1F5eFZRVUZWZWtNc1UwRkJVek5HTEVWQlFVVXdSaXhGUVVGRlJTeE5RVUZLTEVWQlFWbERMRWxCUVZvc1EwRkJhVUlzV1VGQmFrSXNRMEZCVkN4RFFVRm9RanRCUVVOQk4wWXNTVUZCUlN4clFrRkJSaXhGUVVGelFtMUlMRTFCUVhSQ0xFTkJRVFpDYVVJc1QwRkJOMEk3UVVGRFFYQkpMRWxCUVVVc1pVRkJSaXhGUVVGdFFqaERMRkZCUVc1Q0xFTkJRVFJDTEZGQlFUVkNPenRCUVVWQkxFMUJRVWQxUml4UFFVRlBReXhUUVVGUUxFTkJRV2xDUXl4UlFVRnFRaXhEUVVFd1FpeG5Ra0ZCTVVJc1EwRkJTQ3hGUVVGblJEdEJRVU0xUTBNc1QwRkJTVVlzVTBGQlNpeERRVUZqUnl4TlFVRmtMRU5CUVhGQ0xGVkJRWEpDTzBGQlEwRktMRlZCUVU5RExGTkJRVkFzUTBGQmFVSkhMRTFCUVdwQ0xFTkJRWGRDTEdkQ1FVRjRRanRCUVVOQmVFa3NXVUZCVTNsSkxFbEJRVlFzUTBGQlkwTXNTMEZCWkN4RFFVRnZRa01zVVVGQmNFSXNSMEZCSzBJc1ZVRkJMMEk3UVVGRFJEdEJRVU5JTEVWQlZrUTdPMEZCV1VRN08wRkJSVU0xU1N4SFFVRkZMR1ZCUVVZc1JVRkJiVUkyUlN4TFFVRnVRaXhEUVVGNVFpeFZRVUZEWVN4RFFVRkVMRVZCUVU4N1FVRkROMEpCTEVsQlFVVnRSQ3hsUVVGR08wRkJRMFlzUlVGR1JEczdRVUZKUVN4TFFVRkpVaXhUUVVGVGNFa3NVMEZCVTJ0RkxHTkJRVlFzUTBGQmQwSXNZVUZCZUVJc1EwRkJZanRCUVVGQkxFdEJRME54UlN4TlFVRk5ka2tzVTBGQlUydEZMR05CUVZRc1EwRkJkMElzVTBGQmVFSXNRMEZFVURzN1FVRkhSRHM3UVVGRlJTeFZRVUZUTWtVc1ZVRkJWQ3hIUVVGelFqczdRVUZGY0VJc1RVRkJSMVFzVDBGQlQwTXNVMEZCVUN4RFFVRnBRa01zVVVGQmFrSXNRMEZCTUVJc1owSkJRVEZDTEVOQlFVZ3NSVUZCWjBRN1FVRkRPVU5ETEU5QlFVbEdMRk5CUVVvc1EwRkJZMGNzVFVGQlpDeERRVUZ4UWl4VlFVRnlRanRCUVVOQlNpeFZRVUZQUXl4VFFVRlFMRU5CUVdsQ1J5eE5RVUZxUWl4RFFVRjNRaXhuUWtGQmVFSTdRVUZEUVhwSkxFdEJRVVVzWlVGQlJpeEZRVUZ0UWpoRExGRkJRVzVDTEVOQlFUUkNMRkZCUVRWQ08wRkJRMFFzUjBGS1JDeE5RVXRMTzBGQlEwaDFSaXhWUVVGUFF5eFRRVUZRTEVOQlFXbENVeXhIUVVGcVFpeERRVUZ4UWl4blFrRkJja0k3UVVGRFFWQXNUMEZCU1VZc1UwRkJTaXhEUVVGalV5eEhRVUZrTEVOQlFXdENMRlZCUVd4Q08wRkJRMEV2U1N4TFFVRkZMR1ZCUVVZc1JVRkJiVUl3UlN4WFFVRnVRaXhEUVVFclFpeFJRVUV2UWp0QlFVTkVPMEZCUTBZN08wRkJSVWc3TzBGQlJVVXNTMEZCUnl4RFFVRkRNVVVzUlVGQlJYTkhMRkZCUVVZc1JVRkJXVlFzU1VGQldpeERRVUZwUWl4TlFVRnFRaXhGUVVGNVFuWkZMRkZCUVhwQ0xFTkJRV3RETEZkQlFXeERMRU5CUVVvc1JVRkJiMFE3UVVGRGJrUXJSeXhUUVVGUEwwUXNaMEpCUVZBc1EwRkJkMElzVDBGQmVFSXNSVUZCYVVOM1JTeFZRVUZxUXp0QlFVTkJPenRCUVVWSU96dEJRVVZGTTBrc1VVRkJUMjFGTEdkQ1FVRlFMRU5CUVhkQ0xGRkJRWGhDTEVWQlFXdERMRmxCUVZjN1FVRkRNME1zVFVGQlIyNUZMRTlCUVU5RExGVkJRVkFzUjBGQmIwSXNTVUZCY0VJc1NVRkJORUp2U1N4SlFVRkpSaXhUUVVGS0xFTkJRV05ETEZGQlFXUXNRMEZCZFVJc1ZVRkJka0lzUTBGQkwwSXNSVUZCYlVVN1FVRkRha1ZQTzBGQlEwRk9MRTlCUVVsR0xGTkJRVW9zUTBGQlkwY3NUVUZCWkN4RFFVRnhRaXhWUVVGeVFqdEJRVU5EZWtrc1MwRkJSU3hsUVVGR0xFVkJRVzFDT0VNc1VVRkJia0lzUTBGQk5FSXNVVUZCTlVJN1FVRkRSanRCUVVOR0xFVkJUa1E3TzBGQlVVWTdPMEZCUlVVc1MwRkJSemxETEVWQlFVVnpSeXhSUVVGR0xFVkJRVmxVTEVsQlFWb3NRMEZCYVVJc1RVRkJha0lzUlVGQmVVSjJSU3hSUVVGNlFpeERRVUZyUXl4WFFVRnNReXhEUVVGSUxFVkJRVzFFTzBGQlEyNUVMRTFCUVVkMFFpeEZRVUZGYzBjc1VVRkJSaXhGUVVGWlZDeEpRVUZhTEVOQlFXbENMRTFCUVdwQ0xFVkJRWGxDZGtVc1VVRkJla0lzUTBGQmEwTXNXVUZCYkVNc1EwRkJTQ3hGUVVGdlJEdEJRVU51Ukd0RUxHTkJRVmNzUTBGQldEdEJRVU5CTzBGQlEwUXNUVUZCUjNoRkxFVkJRVVZ6Unl4UlFVRkdMRVZCUVZsVUxFbEJRVm9zUTBGQmFVSXNUVUZCYWtJc1JVRkJlVUoyUlN4UlFVRjZRaXhEUVVGclF5eHBRa0ZCYkVNc1EwRkJTQ3hGUVVGNVJEdEJRVU40Ukd0RUxHTkJRVmNzUTBGQldEdEJRVU5CTzBGQlEwUXNUVUZCUjNoRkxFVkJRVVZ6Unl4UlFVRkdMRVZCUVZsVUxFbEJRVm9zUTBGQmFVSXNUVUZCYWtJc1JVRkJlVUoyUlN4UlFVRjZRaXhEUVVGclF5eGpRVUZzUXl4RFFVRklMRVZCUVhORU8wRkJRM0pFYTBRc1kwRkJWeXhEUVVGWU8wRkJRMEU3UVVGRFJDeE5RVUZIZUVVc1JVRkJSWE5ITEZGQlFVWXNSVUZCV1ZRc1NVRkJXaXhEUVVGcFFpeE5RVUZxUWl4RlFVRjVRblpGTEZGQlFYcENMRU5CUVd0RExGbEJRV3hETEVOQlFVZ3NSVUZCYjBRN1FVRkRia1JyUkN4alFVRlhMRU5CUVZnN1FVRkRRVHRCUVVORUxFMUJRVWQ0UlN4RlFVRkZjMGNzVVVGQlJpeEZRVUZaVkN4SlFVRmFMRU5CUVdsQ0xFMUJRV3BDTEVWQlFYbENka1VzVVVGQmVrSXNRMEZCYTBNc1dVRkJiRU1zUTBGQlNDeEZRVUZ2UkR0QlFVTnVSRTRzWlVGQldTeFpRVUZOTzBGQlEycENlVWM3UVVGRFFTeEpRVVpFTEVWQlJVY3NSMEZHU0R0QlFVZEJPMEZCUTBRN08wRkJSVVk3TzBGQlJVVXNWVUZCVTNWQ0xGZEJRVlFzUTBGQmNVSkRMRVZCUVhKQ0xFVkJRWGxDUXl4SlFVRjZRaXhGUVVFclFqdEJRVU01UWl4TlFVRkpReXhaUVVGWkxFVkJRV2hDTzBGQlEwRkJMRmxCUVZWRExFVkJRVllzUjBGQlpTeERRVUZtTEVOQlFXdENSQ3hWUVVGVlJTeEZRVUZXTEVkQlFXVXNRMEZCWml4RFFVRnJRa1lzVlVGQlZVY3NSVUZCVml4SFFVRmxMRU5CUVdZc1EwRkJhMEpJTEZWQlFWVkpMRVZCUVZZc1IwRkJaU3hEUVVGbU8wRkJRM1JFTEUxQlFVbERMRkZCUVZFc1JVRkJXaXhEUVVnNFFpeERRVWRpTzBGQlEycENMRTFCUVVsRExGRkJRVkVzUlVGQldpeERRVW80UWl4RFFVbGlPMEZCUTJwQ0xFMUJRVWxETEZGQlFWRXNSVUZCV2l4RFFVdzRRaXhEUVV0aU8wRkJRMnBDTEUxQlFVbERMRkZCUVZFc1JVRkJXaXhEUVU0NFFpeERRVTFpTzBGQlEycENMRTFCUVVsRExGRkJRVkVzUlVGQldqdEJRVU5CTEUxQlFVbDRSU3hOUVVGTmJrWXNVMEZCVTJ0RkxHTkJRVlFzUTBGQmQwSTRSU3hGUVVGNFFpeERRVUZXTzBGQlEwRTNSQ3hOUVVGSlpDeG5Ra0ZCU2l4RFFVRnhRaXhaUVVGeVFpeEZRVUZyUXl4VlFVRlRiMElzUTBGQlZDeEZRVUZYTzBGQlF6TkRMRTlCUVVsdFJTeEpRVUZKYmtVc1JVRkJSVzlGTEU5QlFVWXNRMEZCVlN4RFFVRldMRU5CUVZJN1FVRkRRVmdzWVVGQlZVTXNSVUZCVml4SFFVRmxVeXhGUVVGRlJTeFBRVUZxUWp0QlFVTkJXaXhoUVVGVlJTeEZRVUZXTEVkQlFXVlJMRVZCUVVWSExFOUJRV3BDTzBGQlEwUXNSMEZLUkN4RlFVbEZMRXRCU2tZN1FVRkxRVFZGTEUxQlFVbGtMR2RDUVVGS0xFTkJRWEZDTEZkQlFYSkNMRVZCUVdsRExGVkJRVk52UWl4RFFVRlVMRVZCUVZjN1FVRkRNVU5CTEV0QlFVVjFSU3hqUVVGR08wRkJRMEVzVDBGQlNVb3NTVUZCU1c1RkxFVkJRVVZ2UlN4UFFVRkdMRU5CUVZVc1EwRkJWaXhEUVVGU08wRkJRMEZZTEdGQlFWVkhMRVZCUVZZc1IwRkJaVThzUlVGQlJVVXNUMEZCYWtJN1FVRkRRVm9zWVVGQlZVa3NSVUZCVml4SFFVRmxUU3hGUVVGRlJ5eFBRVUZxUWp0QlFVTkVMRWRCVEVRc1JVRkxSU3hMUVV4R08wRkJUVUUxUlN4TlFVRkpaQ3huUWtGQlNpeERRVUZ4UWl4VlFVRnlRaXhGUVVGblF5eFZRVUZUYjBJc1EwRkJWQ3hGUVVGWE8wRkJRM3BETzBGQlEwRXNUMEZCU3l4RFFVRkZlVVFzVlVGQlZVY3NSVUZCVml4SFFVRmxSU3hMUVVGbUxFZEJRWFZDVEN4VlFVRlZReXhGUVVGc1F5eEpRVUV3UTBRc1ZVRkJWVWNzUlVGQlZpeEhRVUZsUlN4TFFVRm1MRWRCUVhWQ1RDeFZRVUZWUXl4RlFVRTFSU3hMUVVGelJrUXNWVUZCVlVrc1JVRkJWaXhIUVVGbFNpeFZRVUZWUlN4RlFVRldMRWRCUVdWTkxFdEJRUzlDTEVsQlFUQkRVaXhWUVVGVlJTeEZRVUZXTEVkQlFXVkdMRlZCUVZWSkxFVkJRVllzUjBGQlpVa3NTMEZCZUVVc1NVRkJiVVpTTEZWQlFWVkhMRVZCUVZZc1IwRkJaU3hEUVVFMVRDeEZRVUZyVFR0QlFVTm9UU3hSUVVGSFNDeFZRVUZWUnl4RlFVRldMRWRCUVdWSUxGVkJRVlZETEVWQlFUVkNMRVZCUVdkRFVTeFJRVUZSTEVkQlFWSXNRMEZCYUVNc1MwRkRTMEVzVVVGQlVTeEhRVUZTTzBGQlEwNDdRVUZEUkR0QlFVcEJMRkZCUzBzc1NVRkJTeXhEUVVGRlZDeFZRVUZWU1N4RlFVRldMRWRCUVdWSExFdEJRV1lzUjBGQmRVSlFMRlZCUVZWRkxFVkJRV3hETEVsQlFUQkRSaXhWUVVGVlNTeEZRVUZXTEVkQlFXVkhMRXRCUVdZc1IwRkJkVUpRTEZWQlFWVkZMRVZCUVRWRkxFdEJRWE5HUml4VlFVRlZSeXhGUVVGV0xFZEJRV1ZJTEZWQlFWVkRMRVZCUVZZc1IwRkJaVXNzUzBGQkwwSXNTVUZCTUVOT0xGVkJRVlZETEVWQlFWWXNSMEZCWlVRc1ZVRkJWVWNzUlVGQlZpeEhRVUZsUnl4TFFVRjRSU3hKUVVGdFJrNHNWVUZCVlVrc1JVRkJWaXhIUVVGbExFTkJRVFZNTEVWQlFXdE5PMEZCUTNKTkxGTkJRVWRLTEZWQlFWVkpMRVZCUVZZc1IwRkJaVW9zVlVGQlZVVXNSVUZCTlVJc1JVRkJaME5QTEZGQlFWRXNSMEZCVWl4RFFVRm9ReXhMUVVOTFFTeFJRVUZSTEVkQlFWSTdRVUZEVGpzN1FVRkZSQ3hQUVVGSlFTeFRRVUZUTEVWQlFXSXNSVUZCYVVJN1FVRkRaaXhSUVVGSExFOUJRVTlXTEVsQlFWQXNTVUZCWlN4VlFVRnNRaXhGUVVFNFFrRXNTMEZCUzBRc1JVRkJUQ3hGUVVGUlZ5eExRVUZTTzBGQlF5OUNPMEZCUTBRc1QwRkJTVUVzVVVGQlVTeEZRVUZhTzBGQlEwRlVMR0ZCUVZWRExFVkJRVllzUjBGQlpTeERRVUZtTEVOQlFXdENSQ3hWUVVGVlJTeEZRVUZXTEVkQlFXVXNRMEZCWml4RFFVRnJRa1lzVlVGQlZVY3NSVUZCVml4SFFVRmxMRU5CUVdZc1EwRkJhMEpJTEZWQlFWVkpMRVZCUVZZc1IwRkJaU3hEUVVGbU8wRkJRM1pFTEVkQmFrSkVMRVZCYVVKRkxFdEJha0pHTzBGQmEwSkVPenRCUVVWR096dEJRVVZETEV0QlFVMHpRaXhyUWtGQmEwSXNVMEZCYkVKQkxHVkJRV3RDTEVOQlFVTnhRaXhGUVVGRUxFVkJRVXRwUWl4RFFVRk1MRVZCUVZjN08wRkJSV3hETEUxQlFVZHFRaXhQUVVGUExGVkJRVllzUlVGQmMwSTdPMEZCUlhKQ0xFOUJRVTFyUWl3eVFrRkJNa0p1U3l4RlFVRkZMREJDUVVGR0xFVkJRVGhDTUVJc1RVRkJMMFE3TzBGQlJVRXNUMEZCUjNkSkxFMUJRVTBzUjBGQlZDeEZRVUZqT3p0QlFVVmlMRkZCUVVkcVRDeGpRVUZqYTB3c01rSkJRVEpDTEVOQlFUVkRMRVZCUVN0RE8wRkJRemxEYkV3N1FVRkRRU3hMUVVaRUxFMUJSVTg3UVVGRFRrRXNiVUpCUVdNc1EwRkJaRHRCUVVOQk96dEJRVVZFWlN4TlFVRkZMREJDUVVGR0xFVkJRVGhDWml4WFFVRTVRaXhGUVVFeVF6UkdMRXRCUVRORE8wRkJRMEU3UVVGRFJDeFBRVUZIY1VZc1RVRkJUU3hIUVVGVUxFVkJRV003TzBGQlJXSXNVVUZCUjJwTUxHTkJRV01zUTBGQmFrSXNSVUZCYjBJN1FVRkRia0pCTzBGQlEwRXNTMEZHUkN4TlFVVlBPMEZCUTA1QkxHMUNRVUZqYTB3c01rSkJRVEpDTEVOQlFYcERPMEZCUTBFN08wRkJSVVJ1U3l4TlFVRkZMREJDUVVGR0xFVkJRVGhDWml4WFFVRTVRaXhGUVVFeVF6UkdMRXRCUVRORE8wRkJRMEU3UVVGRFJEdEJRVU5FTEUxQlFVZHZSU3hQUVVGUExGVkJRVllzUlVGQmMwSTdPMEZCUlhKQ0xFOUJRVTF0UWl3eVFrRkJNa0p3U3l4RlFVRkZMREJDUVVGR0xFVkJRVGhDTUVJc1RVRkJMMFE3TzBGQlJVRXNUMEZCUjNkSkxFMUJRVTBzUjBGQlZDeEZRVUZqT3p0QlFVVmlMRkZCUVVkc1RDeGpRVUZqYjB3c01rSkJRVEpDTEVOQlFUVkRMRVZCUVN0RE8wRkJRemxEY0V3N1FVRkRRU3hMUVVaRUxFMUJSVTg3UVVGRFRrRXNiVUpCUVdNc1EwRkJaRHRCUVVOQk96dEJRVVZFWjBJc1RVRkJSU3d3UWtGQlJpeEZRVUU0UW1oQ0xGZEJRVGxDTEVWQlFUSkROa1lzUzBGQk0wTTdRVUZEUVR0QlFVTkVMRTlCUVVkeFJpeE5RVUZOTEVkQlFWUXNSVUZCWXpzN1FVRkZZaXhSUVVGSGJFd3NZMEZCWXl4RFFVRnFRaXhGUVVGdlFqdEJRVU51UWtFN1FVRkRRU3hMUVVaRUxFMUJSVTg3UVVGRFRrRXNiVUpCUVdOdlRDd3lRa0ZCTWtJc1EwRkJla003UVVGRFFUczdRVUZGUkhCTExFMUJRVVVzTUVKQlFVWXNSVUZCT0VKb1FpeFhRVUU1UWl4RlFVRXlRelpHTEV0QlFUTkRPMEZCUTBFN1FVRkRSRHRCUVVORUxFVkJjRVJFT3p0QlFYTkVSRHM3UVVGRlF5eExRVUZITEVOQlFVTTNSU3hGUVVGRmMwY3NVVUZCUml4RlFVRlpWQ3hKUVVGYUxFTkJRV2xDTEUxQlFXcENMRVZCUVhsQ2RrVXNVVUZCZWtJc1EwRkJhME1zVjBGQmJFTXNRMEZCU2l4RlFVRnZSRHRCUVVOdVJEQklMR05CUVZrc1ZVRkJXaXhGUVVGM1FuQkNMR1ZCUVhoQ08wRkJRMEZ2UWl4alFVRlpMRlZCUVZvc1JVRkJkMEp3UWl4bFFVRjRRanRCUVVOQk8wRkJRMFFzUTBFNWJVSkVJaXdpWm1sc1pTSTZJbVpoYTJWZk9HSTJaamc1TVRndWFuTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUpqYjI1emRDQjBhVzFsSUQwZ056VXdPMXh1YkdWMElITmxZM1JwYjI0elNXUjRJRDBnTUR0Y2JteGxkQ0J6WldOMGFXOXVORWxrZUNBOUlEQTdYRzVjYm1OdmJuTjBJRzFoYzNSbGNrOWlhaUE5SUh0Y2JseDBjMlZqZEdsdmJqSkRkWEp5Wlc1MFNXUjRPaUF3TENCY2JseDBjMlZqZEdsdmJqRkRkWEp5Wlc1MFNXUjRPaUF3TEZ4dVhIUnpaV04wYVc5dU16b2dlMXh1WEhSY2RHRjFkRzl0WVhSbE9pQW5KeXhjYmx4MFhIUnBjMEYxZEc5dFlYUmxaRG9nWm1Gc2MyVmNibHgwZlN4Y2JseDBjMlZqZEdsdmJqUTZJSHRjYmx4MFhIUmhkWFJ2YldGMFpUb2dKeWNzWEc1Y2RGeDBhWE5CZFhSdmJXRjBaV1E2SUdaaGJITmxYRzVjZEgwc1hHNWNkR0poYzJ0bGRHSmhiR3c2SUh0c2IyOXdRVzF2ZFc1ME9pQXhmU3hjYmx4MFptOXZkR0poYkd3NklIdHNiMjl3UVcxdmRXNTBPaUF4ZlN4Y2JseDBkR1Z1Ym1sek9pQjdiRzl2Y0VGdGIzVnVkRG9nTVgwc1hHNWNkR0poYzJWaVlXeHNPaUI3Ykc5dmNFRnRiM1Z1ZERvZ01YMHNYRzVjZEdaaGJqb2dlMnh2YjNCQmJXOTFiblE2SURGOVhHNTlPMXh1WEc1amIyNXpkQ0JvYjIxbGNHRm5aVTF2WWtsdFlXZGxjeUE5SUZ0Y2JseDBKMkZ6YzJWMGN5OXBiV0ZuWlhNdmFHOXRaWEJoWjJWTmIySXZZbUZ6YTJWMFltRnNiQzVxY0djbkxGeHVYSFFuWVhOelpYUnpMMmx0WVdkbGN5OW9iMjFsY0dGblpVMXZZaTltYjI5MFltRnNiQzVxY0djbkxGeHVYSFFuWVhOelpYUnpMMmx0WVdkbGN5OW9iMjFsY0dGblpVMXZZaTkwWlc1dWFYTXVhbkJuSnl3Z1hHNWNkQ2RoYzNObGRITXZhVzFoWjJWekwyaHZiV1Z3WVdkbFRXOWlMMkpoYzJWaVlXeHNMbXB3Wnljc0lGeHVYSFFuWVhOelpYUnpMMmx0WVdkbGN5OW9iMjFsY0dGblpVMXZZaTltWVc0dWFuQm5KeUJjYmwxY2JseHVKQ2hrYjJOMWJXVnVkQ2t1Y21WaFpIa29LQ2tnUFQ0Z2UxeHVYSFJwWmloM2FXNWtiM2N1YVc1dVpYSlhhV1IwYUNBOElEZ3dNQ2tnZTF4dUx5OGdTVVlnVkVoRklGZEpUa1JQVnlCSlV5QlRUVUZNVEVWU0lGUklRVlFnT0RBd1VGZ2dSa1ZVUTBnZ1ZFaEZJRXBUVDA0Z1JrOVNJRlJJUlNCSlEwOU9JRUZPU1UxQlZFbFBUaUJCVGtRZ1FWUkJRMGdnVkVoRklFRk9TVTFCVkVsUFRsTWdVMFZRUlZKQlZFVk1XU0JVVHlCdFlYTjBaWEpQWW1vZ1hGeGNYRnh1WEhSY2RHWmxkR05vS0NkaGMzTmxkSE12YW5NdlJtRnVkR0Z6ZEdWalgxTndjbWwwWlY5VGFHVmxkQzVxYzI5dUp5a3VkR2hsYmlobWRXNWpkR2x2YmloeVpYTndiMjV6WlNrZ2V5QmNibHgwWEhSY2RISmxkSFZ5YmlCeVpYTndiMjV6WlM1cWMyOXVLQ2s3WEc1Y2RGeDBmU2t1ZEdobGJpaG1kVzVqZEdsdmJpaHpjSEpwZEdWUFltb3BJSHRjYmx4MFhIUmNkR052Ym5OMElFbGtiR1ZHY21GdFpTQTlJR1pwYkhSbGNrSjVWbUZzZFdVb2MzQnlhWFJsVDJKcUxtWnlZVzFsY3l3Z0oybGtiR1VuS1R0Y2JseDBYSFJjZEcxaGMzUmxjazlpYWk1bWIyOTBZbUZzYkM1aGJtbHRZWFJwYjI1QmNuSmhlU0E5SUZzdUxpNUpaR3hsUm5KaGJXVXNJQzR1TG1acGJIUmxja0o1Vm1Gc2RXVW9jM0J5YVhSbFQySnFMbVp5WVcxbGN5d2dKMlp2YjNSaVlXeHNKeWxkTzF4dVhIUmNkRngwYldGemRHVnlUMkpxTG5SbGJtNXBjeTVoYm1sdFlYUnBiMjVCY25KaGVTQTlJRnN1TGk1SlpHeGxSbkpoYldVc0lDNHVMbVpwYkhSbGNrSjVWbUZzZFdVb2MzQnlhWFJsVDJKcUxtWnlZVzFsY3l3Z0ozUmxibTVwY3ljcFhUdGNibHgwWEhSY2RHMWhjM1JsY2s5aWFpNWlZWE5sWW1Gc2JDNWhibWx0WVhScGIyNUJjbkpoZVNBOUlGc3VMaTVKWkd4bFJuSmhiV1VzSUM0dUxtWnBiSFJsY2tKNVZtRnNkV1VvYzNCeWFYUmxUMkpxTG1aeVlXMWxjeXdnSjJKaGMyVmlZV3hzSnlsZE8xeHVYSFJjZEZ4MGJXRnpkR1Z5VDJKcUxtSmhjMnRsZEdKaGJHd3VZVzVwYldGMGFXOXVRWEp5WVhrZ1BTQmJMaTR1U1dSc1pVWnlZVzFsTENBdUxpNW1hV3gwWlhKQ2VWWmhiSFZsS0hOd2NtbDBaVTlpYWk1bWNtRnRaWE1zSUNkaVlYTnJaWFFuS1YwN1hHNWNkRngwWEhSdFlYTjBaWEpQWW1vdVptRnVMbUZ1YVcxaGRHbHZia0Z5Y21GNUlEMGdXeTR1TGtsa2JHVkdjbUZ0WlN3Z0xpNHVabWxzZEdWeVFubFdZV3gxWlNoemNISnBkR1ZQWW1vdVpuSmhiV1Z6TENBblptRnVKeWxkTzF4dUx5OGdRMEZNVENCQlRrbE5RVlJQVWlCVFJWUlZVQ0JHVlU1RFZFbFBUaUJCVGtRZ1UxUkJVbFFnVkVoRklFbE5RVWRGSUZOTVNVUkZVMGhQVnlCR1QxSWdVMFZEVkVsUFRpQXhJQ2hJVDAxRlVFRkhSU2tnWEZ4Y1hGeDBYSFJjZEZ4dVhIUmNkRngwWVc1cGJXRjBiM0pUWlhSMWNDZ3BPMXh1WEhSY2RGeDBhVzFoWjJWRGIyNTBjbTlzWlhJb2JXRnpkR1Z5VDJKcUxDQXhLVHRjYmk4dklFTkJURXdnVkVoRklHbHRZV2RsUTI5dWRISnZiR1Z5SUVaVlRrTlVTVTlPSUVWV1JWSlpJRFVnVTBWRFQwNUVVeUJVVHlCRFNFRk9SMFVnVkVoRklFbE5RVWRGSUVaUFVpQlRSVU5VU1U5T0lERWdLRWhQVFVWUVFVZEZLU0JjWEZ4Y1hHNWNkRngwWEhSelpYUkpiblJsY25aaGJDZ29LU0E5UGlCN1hHNWNkRngwWEhSY2RHbHRZV2RsUTI5dWRISnZiR1Z5S0cxaGMzUmxjazlpYWl3Z01TazdYRzVjZEZ4MFhIUjlMQ0ExTURBd0tUdGNibHgwWEhSOUtUdGNibHgwZlZ4dUx5OGdSbFZPUTFSSlQwNGdWRThnVTBWUVJWSkJWRVVnVkVoRklFRk9TVTFCVkVsUFRpQkdVa0ZOUlZNZ1Fsa2dUa0ZOUlNCY1hGeGNYRzVjZEdOdmJuTjBJR1pwYkhSbGNrSjVWbUZzZFdVZ1BTQW9ZWEp5WVhrc0lITjBjbWx1WnlrZ1BUNGdlMXh1SUNBZ0lISmxkSFZ5YmlCaGNuSmhlUzVtYVd4MFpYSW9ieUE5UGlCMGVYQmxiMllnYjFzblptbHNaVzVoYldVblhTQTlQVDBnSjNOMGNtbHVaeWNnSmlZZ2Ixc25abWxzWlc1aGJXVW5YUzUwYjB4dmQyVnlRMkZ6WlNncExtbHVZMngxWkdWektITjBjbWx1Wnk1MGIweHZkMlZ5UTJGelpTZ3BLU2s3WEc1Y2RIMWNiaTh2SUVkRlRrVlNTVU1nVTBWVVZWQWdSbFZPUTFSSlQwNGdSazlTSUVGRVJFbE9SeUJXUlU1RVQxSWdVRkpGUmtsWVJWTWdWRThnY21WeGRXVnpkRUZ1YVcxaGRHbHZia1p5WVcxbElGeGNYRnhjYmx4MFkyOXVjM1FnWVc1cGJXRjBiM0pUWlhSMWNDQTlJQ2dwSUQwK0lIdGNibHgwWEhSY2RGeHVJQ0FnSUhaaGNpQnNZWE4wVkdsdFpTQTlJREE3WEc0Z0lDQWdkbUZ5SUhabGJtUnZjbk1nUFNCYkoyMXpKeXdnSjIxdmVpY3NJQ2QzWldKcmFYUW5MQ0FuYnlkZE8xeHVJQ0FnSUdadmNpaDJZWElnZUNBOUlEQTdJSGdnUENCMlpXNWtiM0p6TG14bGJtZDBhQ0FtSmlBaGQybHVaRzkzTG5KbGNYVmxjM1JCYm1sdFlYUnBiMjVHY21GdFpUc2dLeXQ0S1NCN1hHNGdJQ0FnSUNCM2FXNWtiM2N1Y21WeGRXVnpkRUZ1YVcxaGRHbHZia1p5WVcxbElEMGdkMmx1Wkc5M1czWmxibVJ2Y25OYmVGMHJKMUpsY1hWbGMzUkJibWx0WVhScGIyNUdjbUZ0WlNkZE8xeHVJQ0FnSUNBZ2QybHVaRzkzTG1OaGJtTmxiRUZ1YVcxaGRHbHZia1p5WVcxbElEMGdkMmx1Wkc5M1czWmxibVJ2Y25OYmVGMHJKME5oYm1ObGJFRnVhVzFoZEdsdmJrWnlZVzFsSjEwZ2ZId2dkMmx1Wkc5M1czWmxibVJ2Y25OYmVGMHJKME5oYm1ObGJGSmxjWFZsYzNSQmJtbHRZWFJwYjI1R2NtRnRaU2RkTzF4dUlDQWdJSDFjYmlCY2JpQWdJQ0JwWmlBb0lYZHBibVJ2ZHk1eVpYRjFaWE4wUVc1cGJXRjBhVzl1Um5KaGJXVXBYRzRnSUNBZ0lDQjNhVzVrYjNjdWNtVnhkV1Z6ZEVGdWFXMWhkR2x2YmtaeVlXMWxJRDBnWm5WdVkzUnBiMjRvWTJGc2JHSmhZMnNzSUdWc1pXMWxiblFwSUh0Y2JpQWdJQ0FnSUNBZ2RtRnlJR04xY25KVWFXMWxJRDBnYm1WM0lFUmhkR1VvS1M1blpYUlVhVzFsS0NrN1hHNGdJQ0FnSUNBZ0lIWmhjaUIwYVcxbFZHOURZV3hzSUQwZ1RXRjBhQzV0WVhnb01Dd2dNVFlnTFNBb1kzVnljbFJwYldVZ0xTQnNZWE4wVkdsdFpTa3BPMXh1SUNBZ0lDQWdJQ0IyWVhJZ2FXUWdQU0IzYVc1a2IzY3VjMlYwVkdsdFpXOTFkQ2htZFc1amRHbHZiaWdwSUhzZ1kyRnNiR0poWTJzb1kzVnljbFJwYldVZ0t5QjBhVzFsVkc5RFlXeHNLVHNnZlN3Z1hHNGdJQ0FnSUNBZ0lDQWdkR2x0WlZSdlEyRnNiQ2s3WEc0Z0lDQWdJQ0FnSUd4aGMzUlVhVzFsSUQwZ1kzVnljbFJwYldVZ0t5QjBhVzFsVkc5RFlXeHNPMXh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdhV1E3WEc0Z0lDQWdJQ0I5TzF4dUlGeHVJQ0FnSUdsbUlDZ2hkMmx1Wkc5M0xtTmhibU5sYkVGdWFXMWhkR2x2YmtaeVlXMWxLVnh1SUNBZ0lIZHBibVJ2ZHk1allXNWpaV3hCYm1sdFlYUnBiMjVHY21GdFpTQTlJR1oxYm1OMGFXOXVLR2xrS1NCN1hHNGdJQ0FnSUNCamJHVmhjbFJwYldWdmRYUW9hV1FwTzF4dUlDQWdJSDA3WEc1Y2RIMWNibHh1WEc1Y2RHTnZibk4wSUdGdWFXMWhkRzl5SUQwZ0tHRnVhVzFoZEdsdmJrOWlhaWtnUFQ0Z2UxeHVYSFJjZEZ4MFhIUmNkRngwWEc1Y2RGeDBkbUZ5SUdSaGJtTnBibWRKWTI5dUxGeHVYSFJjZEZ4MGMzQnlhWFJsU1cxaFoyVXNYRzVjZEZ4MFhIUmpZVzUyWVhNN1hIUmNkRngwWEhSY2RGeHVMeThnUmxWT1ExUkpUMDRnVkU4Z1VFRlRVeUJVVHlCeVpYRjFaWE4wUVc1cGJXRjBhVzl1Um5KaGJXVWdYRnhjWEZ4dVhIUmNkR1oxYm1OMGFXOXVJR2RoYldWTWIyOXdJQ2dwSUh0Y2JseDBYSFFnSUNRb0p5TnNiMkZrYVc1bkp5a3VZV1JrUTJ4aGMzTW9KMmhwWkdSbGJpY3BPMXh1WEhSY2RDQWdZVzVwYldGMGFXOXVUMkpxTG14dmIzQkpaQ0E5SUhkcGJtUnZkeTV5WlhGMVpYTjBRVzVwYldGMGFXOXVSbkpoYldVb1oyRnRaVXh2YjNBcE8xeHVYSFJjZENBZ1pHRnVZMmx1WjBsamIyNHVkWEJrWVhSbEtDazdYRzVjZEZ4MElDQmtZVzVqYVc1blNXTnZiaTV5Wlc1a1pYSW9LVHRjYmx4MFhIUjlYRzVjZEZ4MFhHNWNkRngwWm5WdVkzUnBiMjRnYzNCeWFYUmxJQ2h2Y0hScGIyNXpLU0I3WEc1Y2RGeDBYRzVjZEZ4MFhIUjJZWElnZEdoaGRDQTlJSHQ5TEZ4dVhIUmNkRngwWEhSbWNtRnRaVWx1WkdWNElEMGdNQ3hjYmx4MFhIUmNkRngwZEdsamEwTnZkVzUwSUQwZ01DeGNibHgwWEhSY2RGeDBiRzl2Y0VOdmRXNTBJRDBnTUN4Y2JseDBYSFJjZEZ4MGRHbGphM05RWlhKR2NtRnRaU0E5SUc5d2RHbHZibk11ZEdsamEzTlFaWEpHY21GdFpTQjhmQ0F3TEZ4dVhIUmNkRngwWEhSdWRXMWlaWEpQWmtaeVlXMWxjeUE5SUc5d2RHbHZibk11Ym5WdFltVnlUMlpHY21GdFpYTWdmSHdnTVR0Y2JseDBYSFJjZEZ4dVhIUmNkRngwZEdoaGRDNWpiMjUwWlhoMElEMGdiM0IwYVc5dWN5NWpiMjUwWlhoME8xeHVYSFJjZEZ4MGRHaGhkQzUzYVdSMGFDQTlJRzl3ZEdsdmJuTXVkMmxrZEdnN1hHNWNkRngwWEhSMGFHRjBMbWhsYVdkb2RDQTlJRzl3ZEdsdmJuTXVhR1ZwWjJoME8xeHVYSFJjZEZ4MGRHaGhkQzVwYldGblpTQTlJRzl3ZEdsdmJuTXVhVzFoWjJVN1hHNWNkRngwWEhSMGFHRjBMbXh2YjNCeklEMGdiM0IwYVc5dWN5NXNiMjl3Y3p0Y2JseDBYSFJjZEZ4dVhIUmNkRngwZEdoaGRDNTFjR1JoZEdVZ1BTQm1kVzVqZEdsdmJpQW9LU0I3WEc1Y2JpQWdJQ0FnSUNBZ2RHbGphME52ZFc1MElDczlJREU3WEc1Y2JpQWdJQ0FnSUNBZ2FXWWdLSFJwWTJ0RGIzVnVkQ0ErSUhScFkydHpVR1Z5Um5KaGJXVXBJSHRjYmx4dVhIUmNkRngwWEhSY2RIUnBZMnREYjNWdWRDQTlJREE3WEc0Z0lDQWdJQ0FnSUNBZ0x5OGdTV1lnZEdobElHTjFjbkpsYm5RZ1puSmhiV1VnYVc1a1pYZ2dhWE1nYVc0Z2NtRnVaMlZjYmlBZ0lDQWdJQ0FnSUNCcFppQW9abkpoYldWSmJtUmxlQ0E4SUc1MWJXSmxjazltUm5KaGJXVnpJQzBnTVNrZ2UxeDBYRzRnSUNBZ0lDQWdJQ0FnTHk4Z1IyOGdkRzhnZEdobElHNWxlSFFnWm5KaGJXVmNiaUFnSUNBZ0lDQWdJQ0FnSUdaeVlXMWxTVzVrWlhnZ0t6MGdNVHRjYmlBZ0lDQWdJQ0FnSUNCOUlHVnNjMlVnZTF4dUlDQWdJQ0FnSUNCY2RGeDBiRzl2Y0VOdmRXNTBLeXRjYmlBZ0lDQWdJQ0FnSUNBZ0lHWnlZVzFsU1c1a1pYZ2dQU0F3TzF4dVhHNGdJQ0FnSUNBZ0lDQWdJQ0JwWmloc2IyOXdRMjkxYm5RZ1BUMDlJSFJvWVhRdWJHOXZjSE1wSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJRngwZDJsdVpHOTNMbU5oYm1ObGJFRnVhVzFoZEdsdmJrWnlZVzFsS0dGdWFXMWhkR2x2Yms5aWFpNXNiMjl3U1dRcE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnSUNBZ0lIMWNibHgwSUNBZ0lDQWdmVnh1WEhRZ0lDQWdmVnh1WEhSY2RGeDBYRzVjZEZ4MFhIUjBhR0YwTG5KbGJtUmxjaUE5SUdaMWJtTjBhVzl1SUNncElIdGNibHgwWEhSY2RGeHVYSFJjZEZ4MElDQXZMeUJEYkdWaGNpQjBhR1VnWTJGdWRtRnpYRzVjZEZ4MFhIUWdJSFJvWVhRdVkyOXVkR1Y0ZEM1amJHVmhjbEpsWTNRb01Dd2dNQ3dnZEdoaGRDNTNhV1IwYUN3Z2RHaGhkQzVvWldsbmFIUXBPMXh1WEhSY2RGeDBJQ0JjYmx4MFhIUmNkQ0FnZEdoaGRDNWpiMjUwWlhoMExtUnlZWGRKYldGblpTaGNibHgwWEhSY2RDQWdJQ0IwYUdGMExtbHRZV2RsTEZ4dVhIUmNkRngwSUNBZ0lHRnVhVzFoZEdsdmJrOWlhaTVoYm1sdFlYUnBiMjVCY25KaGVWdG1jbUZ0WlVsdVpHVjRYUzVtY21GdFpTNTRMRnh1WEhSY2RGeDBJQ0FnSUdGdWFXMWhkR2x2Yms5aWFpNWhibWx0WVhScGIyNUJjbkpoZVZ0bWNtRnRaVWx1WkdWNFhTNW1jbUZ0WlM1NUxGeHVYSFJjZEZ4MElDQWdJREl3TUN4Y2JseDBYSFJjZENBZ0lDQXhOelVzWEc1Y2RGeDBYSFFnSUNBZ01DeGNibHgwWEhSY2RDQWdJQ0F3TEZ4dVhIUmNkRngwSUNBZ0lIZHBibVJ2ZHk1cGJtNWxjbGRwWkhSb0lDOGdNeTQ0TkRZc1hHNWNkRngwWEhRZ0lDQWdkMmx1Wkc5M0xtbHVibVZ5VjJsa2RHZ2dMeUEwTGpFcFhHNWNkRngwWEhSOU8xeHVYSFJjZEZ4MFhHNWNkRngwWEhSeVpYUjFjbTRnZEdoaGREdGNibHgwWEhSOVhHNWNkRngwWEc1Y2RGeDBMeThnUjJWMElHTmhiblpoYzF4dVhIUmNkR05oYm5aaGN5QTlJR1J2WTNWdFpXNTBMbWRsZEVWc1pXMWxiblJDZVVsa0tDZGpZVzUyWVhNbktUdGNibHgwWEhSallXNTJZWE11ZDJsa2RHZ2dQU0IzYVc1a2IzY3VhVzV1WlhKWGFXUjBhQ0F2SURNdU9EUTJPMXh1WEhSY2RHTmhiblpoY3k1b1pXbG5hSFFnUFNCM2FXNWtiM2N1YVc1dVpYSlhhV1IwYUNBdklESXVNanRjYmx4MFhIUmNibHgwWEhRdkx5QkRjbVZoZEdVZ2MzQnlhWFJsSUhOb1pXVjBYRzVjZEZ4MGMzQnlhWFJsU1cxaFoyVWdQU0J1WlhjZ1NXMWhaMlVvS1R0Y2RGeHVYSFJjZEZ4dVhIUmNkQzh2SUVOeVpXRjBaU0J6Y0hKcGRHVmNibHgwWEhSa1lXNWphVzVuU1dOdmJpQTlJSE53Y21sMFpTaDdYRzVjZEZ4MFhIUmpiMjUwWlhoME9pQmpZVzUyWVhNdVoyVjBRMjl1ZEdWNGRDaGNJakprWENJcExGeHVYSFJjZEZ4MGQybGtkR2c2SURRd05EQXNYRzVjZEZ4MFhIUm9aV2xuYUhRNklERTNOekFzWEc1Y2RGeDBYSFJwYldGblpUb2djM0J5YVhSbFNXMWhaMlVzWEc1Y2RGeDBYSFJ1ZFcxaVpYSlBaa1p5WVcxbGN6b2dZVzVwYldGMGFXOXVUMkpxTG1GdWFXMWhkR2x2YmtGeWNtRjVMbXhsYm1kMGFDeGNibHgwWEhSY2RIUnBZMnR6VUdWeVJuSmhiV1U2SURRc1hHNWNkRngwWEhSc2IyOXdjem9nWVc1cGJXRjBhVzl1VDJKcUxteHZiM0JCYlc5MWJuUmNibHgwWEhSOUtUdGNibHgwWEhSY2JseDBYSFF2THlCTWIyRmtJSE53Y21sMFpTQnphR1ZsZEZ4dVhIUmNkSE53Y21sMFpVbHRZV2RsTG1Ga1pFVjJaVzUwVEdsemRHVnVaWElvWENKc2IyRmtYQ0lzSUdkaGJXVk1iMjl3S1R0Y2JseDBYSFJ6Y0hKcGRHVkpiV0ZuWlM1emNtTWdQU0FuWVhOelpYUnpMMmx0WVdkbGN5OUdZVzUwWVhOMFpXTmZVM0J5YVhSbFgxTm9aV1YwTG5CdVp5YzdYRzVjZEgwZ1hHNWNiaTh2SUVsT1NWUkpRVXhKVTBVZ1FVNUVJRk5GVkZWUUlFTlZVbEpGVGxRZ1VFRkhSUzRnUlZoRlExVlVSU0JVVWtGT1UwbFVTVTlPVXlCQlRrUWdVa1ZOVDFaRklGUkpUbFFnU1VZZ1VrVk1SVlpCVGxRZ1hGeGNYRnh1WEc1Y2RHTnZibk4wWEhSd1lXZGxURzloWkdWeUlEMGdLR2x1WkdWNEtTQTlQaUI3WEc1Y2RGeDBhV1lvYVc1a1pYZ2dQVDA5SURVcElIdGNibHgwWEhSY2RDUW9KeTUwYVc1MEp5a3VjbVZ0YjNabFEyeGhjM01vSjNKbGJXOTJaVlJwYm5RbktUdGNibHgwWEhSY2RDUW9KeTVpWVdOclozSnZkVzVrVjNKaGNIQmxjaWNwTG5KbGJXOTJaVU5zWVhOektDZHpZMkZzWlVKaFkydG5jbTkxYm1RbktUdGNibHgwWEhSY2RDUW9KeU56WldOMGFXOXVOU2NwTG1acGJtUW9KeTVvWldGa2FXNW5KeWt1WVdSa1EyeGhjM01vSjNOb2IzY2dabUZrWlVsdUp5azdYRzVjZEZ4MFhIUWtLQ2N1YzNWaVUyVmpkR2x2YmljcExtRmtaRU5zWVhOektDZHpZMkZzWlVKaFkydG5jbTkxYm1RbktUdGNibHgwWEhSY2RDUW9KeTV6ZFdKVFpXTjBhVzl1SnlrdVptbHVaQ2duTG5ScGJuUW5LUzVoWkdSRGJHRnpjeWduY21WdGIzWmxWR2x1ZENjcE8xeHVYSFJjZEZ4MEpDZ25JM05sWTNScGIyNDFKeWt1Wm1sdVpDZ25MblJsZUhSWGNtRndjR1Z5SnlrdVlXUmtRMnhoYzNNb0ozTm9iM2NuS1R0Y2JseDBYSFJjZEhObGRGUnBiV1Z2ZFhRb0tDa2dQVDRnZTF4dVhIUmNkRngwWEhRa0tDY3VjM1ZpVTJWamRHbHZiaUErSUM1MFpYaDBWM0poY0hCbGNpY3BMbVpwYm1Rb0p5NW9aV0ZrYVc1bkp5a3VZV1JrUTJ4aGMzTW9KMlpoWkdWSmJpY3BPMXh1WEhSY2RGeDBmU3dnTVRBd01DazdYRzVjZEZ4MGZTQmNibHgwWEhSbGJITmxJSHRjYmx4MFhIUmNkQ1FvSnk1MGFXNTBKeWt1Y21WdGIzWmxRMnhoYzNNb0ozSmxiVzkyWlZScGJuUW5LVHRjYmx4MFhIUmNkQ1FvSnk1emRXSlRaV04wYVc5dUp5a3VjbVZ0YjNabFEyeGhjM01vSjNOallXeGxRbUZqYTJkeWIzVnVaQ2NwTzF4dVhIUmNkRngwSkNoZ0xtSmhZMnRuY205MWJtUlhjbUZ3Y0dWeU9tNXZkQ2dqYzJWamRHbHZiaVI3YVc1a1pYaDlRbUZqYTJkeWIzVnVaQ2xnS1M1eVpXMXZkbVZEYkdGemN5Z25jMk5oYkdWQ1lXTnJaM0p2ZFc1a0p5azdYRzVjZEZ4MFhIUWtLR0F1YzJWamRHbHZiaTVoWTNScGRtVmdLUzVtYVc1a0tHQXVZbUZqYTJkeWIzVnVaRmR5WVhCd1pYSmdLUzVoWkdSRGJHRnpjeWduYzJOaGJHVkNZV05yWjNKdmRXNWtKeWs3WEc1Y2RGeDBYSFFrS0dCelpXTjBhVzl1TG1GamRHbDJaV0FwTG1acGJtUW9KeTUwYVc1MEp5a3VZV1JrUTJ4aGMzTW9KM0psYlc5MlpWUnBiblFuS1R0Y2JseHVYSFJjZEZ4MGFXWW9KQ2hnTG5ObFkzUnBiMjRrZTJsdVpHVjRmVkJoWjJsdVlYUnZja0oxZEhSdmJtQXBMbXhsYm1kMGFDQW1KaUFrS0dBdWMyVmpkR2x2YmlSN2FXNWtaWGg5VUdGbmFXNWhkRzl5UW5WMGRHOXVMbUZqZEdsMlpXQXBMbXhsYm1kMGFDQThJREVwSUh0Y2JseDBYSFJjZEZ4MEpDaGdMbk5sWTNScGIyNGtlMmx1WkdWNGZWQmhaMmx1WVhSdmNrSjFkSFJ2Ym1BcExtZGxkQ2d3S1M1amJHbGpheWdwTzF4dVhIUmNkRngwZlZ4dVhIUmNkSDFjYmx4MGZUdGNibHh1THk4Z1NFbEVSU0JCVEV3Z1FrVkRTMGRTVDFWT1JGTWdTVTRnVkVoRklGTkZRMVJKVDA0Z1JWaERSVkJVSUZSSVJTQlRVRVZEU1VaSlJVUWdTVTVFUlZnc0lGZElTVU5JSUVsVElGTkRRVXhGUkNCQlRrUWdVMGhQVjA0dUlGeGNYRnhjYmx4dVhIUmpiMjV6ZENCcGJtbDBhV0ZzYVhwbFUyVmpkR2x2YmlBOUlDaHpaV04wYVc5dVRuVnRZbVZ5TENCcFpIZ3BJRDArSUh0Y2JseDBYSFFrS0dBamMyVmpkR2x2YmlSN2MyVmpkR2x2Yms1MWJXSmxjbjFDWVdOclozSnZkVzVrSkh0cFpIaDlZQ2t1YzJsaWJHbHVaM01vSnk1aVlXTnJaM0p2ZFc1a1YzSmhjSEJsY2ljcExtMWhjQ2dvYVhnc0lHVnNaU2tnUFQ0Z2UxeHVYSFJjZEZ4MEpDaGxiR1VwTG1OemN5aDdiM0JoWTJsMGVUb2dNSDBwTzF4dVhIUmNkSDBwTzF4dVhHNWNkRngwSkNoZ0kzTmxZM1JwYjI0a2UzTmxZM1JwYjI1T2RXMWlaWEo5UW1GamEyZHliM1Z1WkNSN2FXUjRmV0FwTG1OemN5aDdYRzVjZEZ4MFhIUW5kSEpoYm5ObWIzSnRKem9nSjNOallXeGxLREV1TVNrbkxGeHVYSFJjZEZ4MEoyOXdZV05wZEhrbk9pQXhYRzVjZEZ4MGZTazdYRzVjZEgwN1hHNWNiaTh2SUVOQlRFd2dhVzVwZEdsaGJHbDZaVk5sWTNScGIyNGdUMDRnVTBWRFZFbFBUbE1nTVN3Z015QkJUa1FnTkM0Z1hGeGNYRnh1WEhScGJtbDBhV0ZzYVhwbFUyVmpkR2x2YmlneExDQXdLVHRjYmx4MGFXNXBkR2xoYkdsNlpWTmxZM1JwYjI0b015d2dNQ2s3WEc1Y2RHbHVhWFJwWVd4cGVtVlRaV04wYVc5dUtEUXNJREFwTzF4dVhHNHZMeUJDUVVOTFIxSlBWVTVFSUVsTlFVZEZJRlJTUVU1VFNWUkpUMDRnU0VGT1JFeEZVaTRnWEZ4Y1hGeHVYRzVjZEdOdmJuTjBJR2x0WVdkbFEyOXVkSEp2YkdWeUlEMGdLR2xrZUU5aWFpd2djMlZqZEdsdmJrNTFiV0psY2lrZ1BUNGdlMXh1WEhSY2RHeGxkQ0J5Wld4bGRtRnVkRUZ1YVcxaGRHbHZianRjYmx4dVhIUmNkR2xtS0hObFkzUnBiMjVPZFcxaVpYSWdQVDA5SURFcElIdGNibHgwWEhSY2RITjNhWFJqYUNocFpIaFBZbW91YzJWamRHbHZiakZEZFhKeVpXNTBTV1I0S1NCN1hHNWNkRngwWEhSY2RHTmhjMlVnTURwY2JseDBYSFJjZEZ4MFhIUnlaV3hsZG1GdWRFRnVhVzFoZEdsdmJpQTlJRzFoYzNSbGNrOWlhaTVpWVhOclpYUmlZV3hzTzF4dVhIUmNkRngwWEhSaWNtVmhhenRjYmx4MFhIUmNkRngwWTJGelpTQXhPbHh1WEhSY2RGeDBYSFJjZEhKbGJHVjJZVzUwUVc1cGJXRjBhVzl1SUQwZ2JXRnpkR1Z5VDJKcUxtWnZiM1JpWVd4c08xeHVYSFJjZEZ4MFhIUmljbVZoYXp0Y2JseDBYSFJjZEZ4MFkyRnpaU0F5T2x4dVhIUmNkRngwWEhSY2RISmxiR1YyWVc1MFFXNXBiV0YwYVc5dUlEMGdiV0Z6ZEdWeVQySnFMblJsYm01cGN6dGNibHgwWEhSY2RGeDBZbkpsWVdzN1hHNWNkRngwWEhSY2RHTmhjMlVnTXpwY2JseDBYSFJjZEZ4MFhIUnlaV3hsZG1GdWRFRnVhVzFoZEdsdmJpQTlJRzFoYzNSbGNrOWlhaTVpWVhObFltRnNiRHRjYmx4MFhIUmNkRngwWW5KbFlXczdYRzVjZEZ4MFhIUmNkR05oYzJVZ05EcGNibHgwWEhSY2RGeDBYSFJ5Wld4bGRtRnVkRUZ1YVcxaGRHbHZiaUE5SUcxaGMzUmxjazlpYWk1bVlXNDdYRzVjZEZ4MFhIUmNkR0p5WldGck8xeHVYSFJjZEZ4MGZWeHVYSFJjZEgxY2JseHVYSFJjZENRb1lDTnpaV04wYVc5dUpIdHpaV04wYVc5dVRuVnRZbVZ5ZldBcExtWnBibVFvSnk1MGFXNTBKeWt1Y21WdGIzWmxRMnhoYzNNb0ozSmxiVzkyWlZScGJuUW5LVHRjYmx4MFhIUWtLR0FqYzJWamRHbHZiaVI3YzJWamRHbHZiazUxYldKbGNuMUNZV05yWjNKdmRXNWtKSHRwWkhoUFltcGJZSE5sWTNScGIyNGtlM05sWTNScGIyNU9kVzFpWlhKOVEzVnljbVZ1ZEVsa2VHQmRmV0FwTG5KbGJXOTJaVU5zWVhOektDZHpZMkZzWlVKaFkydG5jbTkxYm1RbktUdGNibHgwWEhScGJtbDBhV0ZzYVhwbFUyVmpkR2x2YmloelpXTjBhVzl1VG5WdFltVnlMQ0JwWkhoUFltcGJZSE5sWTNScGIyNGtlM05sWTNScGIyNU9kVzFpWlhKOVEzVnljbVZ1ZEVsa2VHQmRLVHRjYmx4MFhIUmNibHgwWEhSelpYUlVhVzFsYjNWMEtDZ3BJRDArSUh0Y2JseDBYSFJjZEdsbUtITmxZM1JwYjI1T2RXMWlaWElnUFQwOUlERXBJSHRjYmx4MFhIUmNkRngwWVc1cGJXRjBiM0lvY21Wc1pYWmhiblJCYm1sdFlYUnBiMjRwTzF4dVhIUmNkRngwZlZ4dVhHNWNkRngwWEhRa0tHQWpjMlZqZEdsdmJpUjdjMlZqZEdsdmJrNTFiV0psY24xZ0tTNW1hVzVrS0dBdVltRmphMmR5YjNWdVpGZHlZWEJ3WlhKZ0tTNWhaR1JEYkdGemN5Z25jMk5oYkdWQ1lXTnJaM0p2ZFc1a0p5azdYRzVjZEZ4MFhIUWtLR0FqYzJWamRHbHZiaVI3YzJWamRHbHZiazUxYldKbGNuMWdLUzVtYVc1a0tDY3VkR2x1ZENjcExtRmtaRU5zWVhOektDZHlaVzF2ZG1WVWFXNTBKeWs3WEc1Y2RGeDBmU3dnTlRBd0tUdGNibHh1WEhSY2RHbG1LR2xrZUU5aWFsdGdjMlZqZEdsdmJpUjdjMlZqZEdsdmJrNTFiV0psY24xRGRYSnlaVzUwU1dSNFlGMGdQVDA5SUNRb1lDTnpaV04wYVc5dUpIdHpaV04wYVc5dVRuVnRZbVZ5ZldBcExtWnBibVFvWUM1aVlXTnJaM0p2ZFc1a1YzSmhjSEJsY21BcExteGxibWQwYUNBdElERXBJSHRjYmx4MFhIUmNkR2xrZUU5aWFsdGdjMlZqZEdsdmJpUjdjMlZqZEdsdmJrNTFiV0psY24xRGRYSnlaVzUwU1dSNFlGMGdQU0F3TzF4dVhIUmNkSDBnWld4elpTQjdYRzVjZEZ4MFhIUnBaSGhQWW1wYllITmxZM1JwYjI0a2UzTmxZM1JwYjI1T2RXMWlaWEo5UTNWeWNtVnVkRWxrZUdCZElDczlJREU3WEc1Y2RGeDBmVnh1WEhSOVhHNHZMeUJUVkVGU1ZDQlRURWxFUlZOSVQxY2dUMDRnVTBWRFZFbFBUaUF5SUZ4Y1hGeGNibHgwYVcxaFoyVkRiMjUwY205c1pYSW9iV0Z6ZEdWeVQySnFMQ0F5S1R0Y2JseHVMeThnUTBoQlRrZEZJRk5GUTFSSlQwNGdNaUJDUVVOTFIxSlBWVTVFSUVsTlFVZEZJRVZXUlZKWklERTFJRk5GUTA5T1JGTWdYRnhjWEZ4dVhIUnpaWFJKYm5SbGNuWmhiQ2dvS1NBOVBpQjdYRzVjZEZ4MGFXMWhaMlZEYjI1MGNtOXNaWElvYldGemRHVnlUMkpxTENBeUtUdGNibHgwZlN3Z01UVXdNREFwTzF4dVhHNHZMeUJRUVVkSlRrRlVTVTlPSUVKVlZGUlBUbE1nUTB4SlEwc2dTRUZPUkV4RlVpQkdUMUlnVTBWRFZFbFBUbE1nTXlCQlRrUWdOQzRnWEZ4Y1hGeHVYRzVjZEdOdmJuTjBJR2hoYm1Sc1pWQmhibWx1WVhScGIyNUNkWFIwYjI1RGJHbGpheUE5SUNobEtTQTlQaUI3WEc1Y2JseDBYSFJqYjI1emRDQnBaSGdnUFNCd1lYSnpaVWx1ZENna0tHVXVkR0Z5WjJWMEtTNWhkSFJ5S0Nka1lYUmhMV2x1WkdWNEp5a3BPMXh1WEhSY2RHTnZibk4wSUhObFkzUnBiMjVKWkNBOUlDUW9aUzUwWVhKblpYUXBMbU5zYjNObGMzUW9KM05sWTNScGIyNG5LUzVoZEhSeUtDZHBaQ2NwTzF4dVhIUmNkR3hsZENCeVpXeGxkbUZ1ZEVSaGRHRkJjbkpoZVR0Y2JseHVYSFJjZEdsbUtITmxZM1JwYjI1SlpDQTlQVDBnSjNObFkzUnBiMjR6SnlrZ2UxeHVYSFJjZEZ4MGMyVmpkR2x2YmpOSlpIZ2dQU0JwWkhnN1hHNWNkRngwZlZ4dVhHNWNkRngwYVdZb2MyVmpkR2x2Ymtsa0lEMDlQU0FuYzJWamRHbHZialFuS1NCN1hHNWNkRngwWEhSelpXTjBhVzl1TkVsa2VDQTlJR2xrZUR0Y2JseDBYSFI5WEc1Y2JseDBYSFFrS0dBakpIdHpaV04wYVc5dVNXUjlZQ2t1Wm1sdVpDZ25MblJwYm5RbktTNXlaVzF2ZG1WRGJHRnpjeWduY21WdGIzWmxWR2x1ZENjcE8xeHVYSFJjZENRb1lDTWtlM05sWTNScGIyNUpaSDFnS1M1bWFXNWtLQ2N1ZEdWNGRGZHlZWEJ3WlhJbktTNXlaVzF2ZG1WRGJHRnpjeWduYzJodmR5Y3BPMXh1WEhSY2RDUW9ZQ01rZTNObFkzUnBiMjVKWkgxZ0tTNW1hVzVrS0dBamRHVjRkRmR5WVhCd1pYSWtlMmxrZUgxZ0tTNWhaR1JEYkdGemN5Z25jMmh2ZHljcE8xeHVYSFJjZENRb1lDTWtlM05sWTNScGIyNUpaSDFDWVdOclozSnZkVzVrSkh0cFpIaDlZQ2t1Y21WdGIzWmxRMnhoYzNNb0ozTmpZV3hsUW1GamEyZHliM1Z1WkNjcE8xeHVYSFJjZENRb1lDNGtlM05sWTNScGIyNUpaSDFRWVdkcGJtRjBiM0pDZFhSMGIyNWdLUzV5WlcxdmRtVkRiR0Z6Y3lnbllXTjBhWFpsSnlrN1hHNWNkRngwSkNobExuUmhjbWRsZENrdVlXUmtRMnhoYzNNb0oyRmpkR2wyWlNjcE8xeHVYRzVjZEZ4MGFXNXBkR2xoYkdsNlpWTmxZM1JwYjI0b2NHRnljMlZKYm5Rb0pDaGdJeVI3YzJWamRHbHZia2xrZldBcExtRjBkSElvSjJSaGRHRXRhVzVrWlhnbktTa3NJR2xrZUNrN1hHNWNibHgwWEhSelpYUlVhVzFsYjNWMEtDZ3BJRDArSUh0Y2JseDBYSFJjZEhCaFoyVk1iMkZrWlhJb2NHRnljMlZKYm5Rb0pDaGdJeVI3YzJWamRHbHZia2xrZldBcExtRjBkSElvSjJSaGRHRXRhVzVrWlhnbktTa3BPMXh1WEhSY2RIMHNJRFV3TUNrN1hHNWNibHgwWEhScFppaHpaV04wYVc5dVNXUWdJVDA5SUNkelpXTjBhVzl1TWljcGUxeHVYSFJjZEZ4MEpDaGdJeVI3YzJWamRHbHZia2xrZldBcExtWnBibVFvSnk1b1pXRmthVzVuTENCd0p5a3VZV1JrUTJ4aGMzTW9KMlpoWkdWSmJpY3BPMXh1WEhSY2RGeDBKQ2hnSXlSN2MyVmpkR2x2Ymtsa2ZXQXBMbTl1S0NkMGNtRnVjMmwwYVc5dVpXNWtJSGRsWW10cGRGUnlZVzV6YVhScGIyNUZibVFnYjFSeVlXNXphWFJwYjI1RmJtUW5MQ0FvWlhNcElEMCtJSHRjYmx4MElDQWdJRngwSkNoZ0l5UjdjMlZqZEdsdmJrbGtmV0FwTG1acGJtUW9KeTVvWldGa2FXNW5MQ0J3SnlrdWNtVnRiM1psUTJ4aGMzTW9KMlpoWkdWSmJpY3BPMXh1WEhSY2RGeDBmU2s3WEc1Y2RGeDBmVnh1WEhSOU8xeHVYRzR2THlCRFRFbERTeUJNU1ZOVVJVNUZVaUJHVDFJZ1VFRkhTVTVCVkVsUFRpQkNWVlJVVDA1VElFOU9JRk5GUTFSSlQwNVRJRE1nUVU1RUlEUXVJRnhjWEZ4Y2JseHVYSFFrS0NjdWMyVmpkR2x2YmpOUVlXZHBibUYwYjNKQ2RYUjBiMjRzSUM1elpXTjBhVzl1TkZCaFoybHVZWFJ2Y2tKMWRIUnZiaWNwTG1Oc2FXTnJLQ2hsS1NBOVBpQjdYRzVjZEZ4MFhHNWNkRngwYVdZb2JXRnpkR1Z5VDJKcVd5UW9aUzVqZFhKeVpXNTBWR0Z5WjJWMEtTNWpiRzl6WlhOMEtDZHpaV04wYVc5dUp5a3VZWFIwY2lnbmFXUW5LVjB1YVhOQmRYUnZiV0YwWldRcElIdGNiaTh2SUVsR0lGUklSVkpGSUVsVElFRWdVa2xPVGtsT1J5QkpUbFJGVWxaQlRDQlBUaUJVU0VVZ1VrVk1SVlpCVGxRZ1UwVkRWRWxQVGlCRFRFVkJVaUJKVkNCY1hGeGNYRzVjZEZ4MFhIUnBiblJsY25aaGJFMWhibUZuWlhJb1ptRnNjMlVzSUNRb1pTNWpkWEp5Wlc1MFZHRnlaMlYwS1M1amJHOXpaWE4wS0NkelpXTjBhVzl1SnlrdVlYUjBjaWduYVdRbktTazdYRzR2THlCVFJWUWdRU0JPUlZjZ1NVNVVSVkpXUVV3Z1QwWWdOeUJUUlVOUFRrUlRJRTlPSUZSSVJTQlRSVU5VU1U5T0lGeGNYRnhjYmx4MFhIUmNkR2x1ZEdWeWRtRnNUV0Z1WVdkbGNpaDBjblZsTENBa0tHVXVZM1Z5Y21WdWRGUmhjbWRsZENrdVkyeHZjMlZ6ZENnbmMyVmpkR2x2YmljcExtRjBkSElvSjJsa0p5a3NJRGN3TURBcE8xeHVYSFJjZEgxY2JpOHZJRU5CVEV3Z1ZFaEZJRU5NU1VOTElFaEJUa1JNUlZJZ1JsVk9RMVJKVDA0Z1FVNUVJRkJCVTFNZ1NWUWdWRWhGSUVWV1JVNVVJRWxHSUZSQlVrZEZWQ0JKVXlCT1QxUWdRVXhTUlVGRVdTQkJRMVJKVmtVZ1hGeGNYRnh1WEhSY2RHbG1LQ0VrS0dVdVkzVnljbVZ1ZEZSaGNtZGxkQ2t1YUdGelEyeGhjM01vSjJGamRHbDJaU2NwS1NCN1hHNWNkRngwWEhSb1lXNWtiR1ZRWVc1cGJtRjBhVzl1UW5WMGRHOXVRMnhwWTJzb1pTazdYRzVjZEZ4MGZWeHVYSFI5S1R0Y2JseHVMeThnU1U1SlZFbEJURWxhUlNCUFRrVlFRVWRGVTBOU1QweE1JRWxHSUU1UFZDQkpUaUJEVFZNZ1VGSkZWa2xGVnk0Z1hGeGNYRnh1WEc1Y2RHbG1LQ0VrS0d4dlkyRjBhVzl1S1M1aGRIUnlLQ2RvY21WbUp5a3VhVzVqYkhWa1pYTW9KMmx1WkdWNExuQm9jQ2NwS1NCN1hHNWNkRngwSkNnbkkzTmpjbTlzYkdWeVYzSmhjSEJsY2ljcExtOXVaWEJoWjJWZmMyTnliMnhzS0h0Y2JseDBYSFJjZEhObFkzUnBiMjVEYjI1MFlXbHVaWEk2SUZ3aWMyVmpkR2x2Ymx3aUxDQWdJQ0JjYmx4MFhIUmNkR1ZoYzJsdVp6b2dYQ0psWVhObExXOTFkRndpTENBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnWEc1Y2RGeDBYSFJoYm1sdFlYUnBiMjVVYVcxbE9pQjBhVzFsTENBZ0lDQWdJQ0FnSUNBZ0lGeHVYSFJjZEZ4MGNHRm5hVzVoZEdsdmJqb2dkSEoxWlN3Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0JjYmx4MFhIUmNkSFZ3WkdGMFpWVlNURG9nZEhKMVpTd2dJQ0FnSUNBZ0lDQWdJQ0FnSUNCY2JseDBYSFJjZEdKbFptOXlaVTF2ZG1VNklDaHBibVJsZUNrZ1BUNGdlMzBzSUZ4dVhIUmNkRngwWVdaMFpYSk5iM1psT2lBb2FXNWtaWGdwSUQwK0lIdGNiaTh2SUVsT1NWUkpRVXhKV2tVZ1ZFaEZJRU5WVWxKRlRsUWdVRUZIUlM0Z1hGeGNYRnh1WEc1Y2RGeDBYSFJjZEhCaFoyVk1iMkZrWlhJb2FXNWtaWGdwTzF4dVhIUmNkRngwZlN3Z0lGeHVYSFJjZEZ4MGJHOXZjRG9nWm1Gc2MyVXNJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JjYmx4MFhIUmNkR3RsZVdKdllYSmtPaUIwY25WbExDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1hHNWNkRngwWEhSeVpYTndiMjV6YVhabFJtRnNiR0poWTJzNklHWmhiSE5sTENBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUZ4dVhIUmNkRngwWkdseVpXTjBhVzl1T2lCY0luWmxjblJwWTJGc1hDSWdJQ0FnSUNBZ0lDQWdYRzVjZEZ4MGZTazdYRzVjYmx4MFhIUWtLQ2NqYzJOeWIyeHNaWEpYY21Gd2NHVnlKeWt1Ylc5MlpWUnZLREVwTzF4dVhIUjlYRzVjYmk4dklFTlBUbFJTVDB3Z1EweEpRMHRUSUU5T0lGZFBVa3NnVjBsVVNDQlZVeUJUUlVOVVNVOU9JQ2hUUlVOVVNVOU9OU2t1SUZ4Y1hGeGNibHh1WEhRa0tDY3VZMnhwWTJ0aFlteGxKeWt1WTJ4cFkyc29LR1VwSUQwK0lIdGNibHgwWEhSc1pYUWdZM1Z5Y21WdWRGTmxZM1JwYjI0Z1BTQWtLR1V1ZEdGeVoyVjBLUzVqYkc5elpYTjBLQ1FvSnk1emRXSlRaV04wYVc5dUp5a3BPMXh1WEc1Y2RGeDBhV1lvWTNWeWNtVnVkRk5sWTNScGIyNHVhR0Z6UTJ4aGMzTW9KMjl3Wlc0bktTa2dlMXh1WEhSY2RGeDBZM1Z5Y21WdWRGTmxZM1JwYjI0dWNtVnRiM1psUTJ4aGMzTW9KMjl3Wlc0bktUdGNibHgwWEhSY2RHTjFjbkpsYm5SVFpXTjBhVzl1TG1acGJtUW9KeTVpZFhSMGIyNHNJSEFuS1M1eVpXMXZkbVZEYkdGemN5Z25abUZrWlVsdUp5azdYRzVjZEZ4MFhIUmpkWEp5Wlc1MFUyVmpkR2x2Ymk1emFXSnNhVzVuY3lnbkxuTjFZbE5sWTNScGIyNG5LUzV0WVhBb0tHbGtlQ3dnYzJWamRHbHZiaWtnUFQ0Z2UxeHVYSFJjZEZ4MFhIUWtLSE5sWTNScGIyNHBMbkpsYlc5MlpVTnNZWE56S0NkamJHOXpaV1FuS1R0Y2JseDBYSFJjZEZ4MEpDaHpaV04wYVc5dUtTNW1hVzVrS0NjdWRHbHVkQ2NwTG5KbGJXOTJaVU5zWVhOektDZGhaR1JVYVc1MEp5a3VZV1JrUTJ4aGMzTW9KM0psYlc5MlpWUnBiblFuS1R0Y2JseDBYSFJjZEgwcE8xeHVYSFJjZEgwZ1pXeHpaU0I3WEc1Y2RGeDBYSFJqZFhKeVpXNTBVMlZqZEdsdmJpNXlaVzF2ZG1WRGJHRnpjeWduWTJ4dmMyVmtKeWt1WVdSa1EyeGhjM01vSjI5d1pXNG5LVHRjYmx4MFhIUmNkR04xY25KbGJuUlRaV04wYVc5dUxtOXVLQ2QwY21GdWMybDBhVzl1Wlc1a0lIZGxZbXRwZEZSeVlXNXphWFJwYjI1RmJtUWdiMVJ5WVc1emFYUnBiMjVGYm1RbkxDQW9aWE1wSUQwK0lIdGNibHgwSUNBZ0lGeDBKQ2duTG5OMVlsTmxZM1JwYjI0dWIzQmxiaWNwTG1acGJtUW9KeTVpZFhSMGIyNHNJSEFuS1M1aFpHUkRiR0Z6Y3lnblptRmtaVWx1SnlrN1hHNWNkRngwWEhSOUtUdGNibHgwWEhSY2RHTjFjbkpsYm5SVFpXTjBhVzl1TG5OcFlteHBibWR6S0NjdWMzVmlVMlZqZEdsdmJpY3BMbTFoY0Nnb2FXUjRMQ0J6WldOMGFXOXVLU0E5UGlCN1hHNWNkRngwWEhSY2RDUW9jMlZqZEdsdmJpa3VjbVZ0YjNabFEyeGhjM01vSjI5d1pXNG5LUzVoWkdSRGJHRnpjeWduWTJ4dmMyVmtKeWs3WEc1Y2RGeDBYSFJjZENRb2MyVmpkR2x2YmlrdVptbHVaQ2duTG5ScGJuUW5LUzV5WlcxdmRtVkRiR0Z6Y3lnbmNtVnRiM1psVkdsdWRDY3BMbUZrWkVOc1lYTnpLQ2RoWkdSVWFXNTBKeWs3WEc1Y2RGeDBYSFJjZENRb2MyVmpkR2x2YmlrdVptbHVaQ2duTG1KMWRIUnZiaXdnY0NjcExuSmxiVzkyWlVOc1lYTnpLQ2RtWVdSbFNXNG5LVHRjYmx4MFhIUmNkSDBwTzF4dVhIUmNkSDFjYmx4MFhIUmpkWEp5Wlc1MFUyVmpkR2x2Ymk1bWFXNWtLQ2N1ZEdsdWRDY3BMbkpsYlc5MlpVTnNZWE56S0NkaFpHUlVhVzUwSnlrdVlXUmtRMnhoYzNNb0ozSmxiVzkyWlZScGJuUW5LVHRjYmx4MGZTazdYRzVjYmk4dklFTlBUbFJTVDB3Z1JrOVBWRVZTSUVGU1VrOVhJRU5NU1VOTFV5NGdYRnhjWEZ4dVhHNWNkQ1FvSnlOa2IzZHVRWEp5YjNjbktTNWpiR2xqYXlnb0tTQTlQaUI3WEc1Y2RGeDBhV1lvSkNoM2FXNWtiM2NwTG1obGFXZG9kQ2dwSUNvZ0tDUW9KeTV3WVdkbEp5a3ViR1Z1WjNSb0lDMGdNU2tnUFQwOUlDMGdKQ2duSTNOamNtOXNiR1Z5VjNKaGNIQmxjaWNwTG05bVpuTmxkQ2dwTG5SdmNDa2dlMXh1THk4Z1RVOVdSU0JVVHlCVVQxQWdUMFlnVUVGSFJTQkpSaUJEVlZKU1JVNVVURmtnUVZRZ1FrOVVWRTlOSUZ4Y1hGeGNibHgwSUNCY2RDUW9KeU56WTNKdmJHeGxjbGR5WVhCd1pYSW5LUzV0YjNabFZHOG9NU2s3WEc1Y2RGeDBmU0JsYkhObElIdGNibHgwWEhSY2RDUW9KeU56WTNKdmJHeGxjbGR5WVhCd1pYSW5LUzV0YjNabFJHOTNiaWdwTzF4dVhIUmNkSDFjYmx4MGZTazdYRzVjYmk4dklFaEpSRVVnVkVoRklFeFBRVVJKVGtjZ1FVNUpUVUZVU1U5UVRpQlhTRVZPSUZaSlJFVlBJRWxUSUZKRlFVUlpJRlJQSUZCTVFWa2dUMDRnUkVWVFdFdFVUMUF1SUZ4Y1hGeGNibHh1WEhSamIyNXpkQ0JvYVdSbFRHOWhaR2x1WjBGdWFXMWhkR2x2YmlBOUlDZ3BJRDArSUh0Y2JseDBYSFJwWmloM2FXNWtiM2N1YVc1dVpYSlhhV1IwYUNBK0lEZ3dNQ0FtSmlBaEpDZ25JMnh2WVdScGJtY25LUzVvWVhORGJHRnpjeWduYUdsa1pHVnVKeWtwSUh0Y2JseHVYSFJjZEZ4MGFXWW9KQ2duSTNacFpHVnZKeWt1WjJWMEtEQXBMbkpsWVdSNVUzUmhkR1VnUFQwOUlEUXBJSHRjYmx4MFhIUmNkRngwSkNnbkkyeHZZV1JwYm1jbktTNWhaR1JEYkdGemN5Z25hR2xrWkdWdUp5azdYRzVjZEZ4MFhIUjlYRzVjZEZ4MGZWeHVYSFI5WEc1Y2JpOHZJRTFCVGtGSFJVMUZUbFFnUmxWT1ExUkpUMDRnUms5U0lGTkZWRlJKVGtjZ1FVNUVJRU5NUlVGU1NVNUhJRlJJUlNCVFRFbEVSU0JCVlZSUFRVRlVTVTlPSUVsT1ZFVlNWa0ZNVXk0Z1hGeGNYRnh1WEc1Y2RHTnZibk4wSUdsdWRHVnlkbUZzVFdGdVlXZGxjaUE5SUNobWJHRm5MQ0J6WldOMGFXOXVTV1FzSUhScGJXVXBJRDArSUh0Y2JpQWdJRngwYVdZb1pteGhaeWtnZTF4dUlGeDBYSFJjZEcxaGMzUmxjazlpYWx0elpXTjBhVzl1U1dSZExtRjFkRzl0WVhSbElEMGdjMlYwU1c1MFpYSjJZV3dvS0NrZ1BUNGdlMXh1SUNBZ0lDQmNkRngwYzNkcGNHVkRiMjUwY205c2JHVnlLSE5sWTNScGIyNUpaQ3dnSjJ3bktUdGNkRnh1SUNBZ0lDQmNkSDBzSUhScGJXVXBPeUJjYmlBZ0lGeDBmU0JsYkhObElIdGNkRngwWEc0Z0lDQWdYSFJqYkdWaGNrbHVkR1Z5ZG1Gc0tHMWhjM1JsY2s5aWFsdHpaV04wYVc5dVNXUmRMbUYxZEc5dFlYUmxLVHRjYmlBZ0lGeDBmVnh1WEhSOU8xeHVYRzR2THlCSlJpQk9UMVFnU1U0Z1EwMVRJRUZFVFVsT0lGQlNSVlpKUlZjc0lGQkZVbEJGVkZWQlRFeFpJRU5JUlVOTElFbEdJRmRGSUVGU1JTQkJWQ0JVU0VVZ1ZFOVFJRTlHSUZSSVJTQlFRVWRGSUVGT1JDQkpSaUJUVHl3Z1JFOU9WQ0JUU0U5WElGUklSU0JHVDA5VVJWSWdUMUlnUjFKRlJVNGdVMGhCVUVVdUlGeGNYRnhjYmx4dVhIUnBaaWdoSkNoc2IyTmhkR2x2YmlrdVlYUjBjaWduYUhKbFppY3BMbWx1WTJ4MVpHVnpLQ2RwYm1SbGVDNXdhSEFuS1NrZ2UxeHVYSFJjZEhObGRFbHVkR1Z5ZG1Gc0tDZ3BJRDArSUh0Y2JseDBYSFJjZEdsbUtDUW9KeU56WTNKdmJHeGxjbGR5WVhCd1pYSW5LUzV2Wm1aelpYUW9LUzUwYjNBZ1BqMGdNQ2tnZTF4dVhIUmNkRngwWEhRa0tDY2phR1ZoWkdWeVUyaGhjR1VzSUNObWIyOTBaWEluS1M1aFpHUkRiR0Z6Y3lnbmJXOTJaVTltWmxOamNtVmxiaWNwTzF4dVhIUmNkRngwWEhRa0tDY2pkbWxrWlc4bktTNW5aWFFvTUNrdWNHeGhlU2dwTzF4dVhIUmNkRngwWEhRa0tDY3VZWEp5YjNjbktTNWhaR1JEYkdGemN5Z25jSFZzYzJGMFpTY3BPMXh1WEhSY2RGeDBmU0JsYkhObElIdGNibHgwWEhSY2RGeDBkbUZ5SUhScGJXVnZkWFFnUFNCelpYUlVhVzFsYjNWMEtDZ3BJRDArSUh0Y2JseDBYSFJjZEZ4MFhIUWtLQ2NqYUdWaFpHVnlVMmhoY0dVc0lDTm1iMjkwWlhJbktTNXlaVzF2ZG1WRGJHRnpjeWduYlc5MlpVOW1abE5qY21WbGJpY3BPMXh1WEhSY2RGeDBYSFJjZENRb0p5TjJhV1JsYnljcExtZGxkQ2d3S1M1d1lYVnpaU2dwTzF4dVhIUmNkRngwWEhSY2RDUW9KeTVoY25KdmR5Y3BMbkpsYlc5MlpVTnNZWE56S0Nkd2RXeHpZWFJsSnlrN1hHNWNkRngwWEhSY2RGeDBZMnhsWVhKVWFXMWxiM1YwS0hScGJXVnZkWFFwTzF4dVhIUmNkRngwWEhSOUxDQjBhVzFsS1R0Y2JseDBYSFJjZEgxY2JseHVMeThnVWs5VVFWUkZJRlJJUlNCQlVsSlBWeUJKVGlCVVNFVWdSazlQVkVWU0lGZElSVTRnUVZRZ1ZFaEZJRUpQVkZSUFRTQlBSaUJVU0VVZ1VFRkhSU0JjWEZ4Y1hHNWNibHgwWEhSY2RHbG1LQ1FvSnlOelkzSnZiR3hsY2xkeVlYQndaWEluS1M1dlptWnpaWFFvS1M1MGIzQWdQQ0F0SUNoM2FXNWtiM2N1YVc1dVpYSklaV2xuYUhRZ0tpQTBLU2tnZTF4dVhIUmNkRngwWEhRa0tDY2paRzkzYmtGeWNtOTNKeWt1WTNOektIc25kSEpoYm5ObWIzSnRKem9nSjNKdmRHRjBaU2d4T0RCa1pXY3BJSFJ5WVc1emJHRjBaVmdvTFRVd0pTa25mU2s3WEc1Y2RGeDBYSFI5SUdWc2MyVWdlMXh1WEhSY2RGeDBYSFFrS0NjalpHOTNia0Z5Y205M0p5a3VZM056S0hzbmRISmhibk5tYjNKdEp6b2dKM1J5WVc1emJHRjBaVmdvTFRVd0pTa2djbTkwWVhSbEtEQmtaV2NwSjMwcE8xeHVYSFJjZEZ4MGZWeHVYRzVjZEZ4MFhIUm9hV1JsVEc5aFpHbHVaMEZ1YVcxaGRHbHZiaWdwTzF4dVhHNHZMeUJCUkVRZ1RFRk9SRk5EUVZCRklGTlVXVXhGVXlCVVR5QlNSVXhGVmtGT1ZDQkZURVZOUlU1VVV5QmNYRnhjWEc1Y2JseDBYSFJjZEdsbUtIZHBibVJ2ZHk1dFlYUmphRTFsWkdsaEtGd2lLRzl5YVdWdWRHRjBhVzl1T2lCc1lXNWtjMk5oY0dVcFhDSXBMbTFoZEdOb1pYTWdKaVlnZDJsdVpHOTNMbWx1Ym1WeVYybGtkR2dnUENBNE1EQXBJSHRjYmx4MFhIUmNkQ0FnSkNnbkxtNWhkbDlzYVc1ckxDQWphR1ZoWkdWeVUyaGhjR1VzSUNObWIyOTBaWElzSUM1amRYTjBiMjBzSUM1dFlYSnJaWElzSUNOelpXTjBhVzl1TlN3Z0xuUmxlSFJYY21Gd2NHVnlKeWt1WVdSa1EyeGhjM01vSjJ4aGJtUnpZMkZ3WlNjcE8xeHVYSFJjZEZ4MGZTQmxiSE5sSUh0Y2JseDBYSFJjZEZ4MElDUW9KeTV1WVhaZmJHbHVheXdnSTJobFlXUmxjbE5vWVhCbExDQWpabTl2ZEdWeUxDQXVZM1Z6ZEc5dExDQXViV0Z5YTJWeUxDQWpjMlZqZEdsdmJqVXNJQzUwWlhoMFYzSmhjSEJsY2ljcExuSmxiVzkyWlVOc1lYTnpLQ2RzWVc1a2MyTmhjR1VuS1R0Y2JseDBYSFJjZEgxY2JseHVYSFJjZEZ4MGFXWW9KQ2duSTNObFkzUnBiMjR6TG1GamRHbDJaU2NwTG14bGJtZDBhQ2tnZXlBdkx5QkJWVlJQVFVGVVJTQlVTRVVnVTB4SlJFVlRJRTlPSUZORlExUkpUMUJPSURNZ1JWWkZVbGtnTnlCVFJVTlBUa1JUSUVsR0lGUklSU0JUUlVOVVNVOU9JRWxUSUVGRFZFbFdSUzRnWEZ4Y1hGeHVYSFJjZEZ4MFhIUnBaaWh0WVhOMFpYSlBZbW91YzJWamRHbHZiak11YVhOQmRYUnZiV0YwWldRZ0lUMDlJSFJ5ZFdVcElIdGNibHgwWEhSY2RGeDBYSFJ0WVhOMFpYSlBZbW91YzJWamRHbHZiak11YVhOQmRYUnZiV0YwWldRZ1BTQjBjblZsTzF4dVhIUmNkRngwWEhSY2RHbHVkR1Z5ZG1Gc1RXRnVZV2RsY2loMGNuVmxMQ0FuYzJWamRHbHZiak1uTENBM01EQXdLVHRjYmx4MFhIUmNkRngwZlZ4dVhIUmNkRngwZlNCbGJITmxJSHNnTHk4Z1UxUlBVQ0JCVlZSUFRVRlVSVVFnVTB4SlJFVlRJRTlPSUZORlExUkpUMUJPSURNZ1NVWWdWRWhGSUZORlExUkpUMDRnU1ZNZ1RrOVVJRUZEVkVsV1JTNGdYRnhjWEZ4dVhIUmNkRngwWEhScFppaHRZWE4wWlhKUFltb3VjMlZqZEdsdmJqTXVhWE5CZFhSdmJXRjBaV1FnUFQwOUlIUnlkV1VwSUh0Y2JseDBYSFJjZEZ4MFhIUnBiblJsY25aaGJFMWhibUZuWlhJb1ptRnNjMlVzSUNkelpXTjBhVzl1TXljcE8xeHVYSFJjZEZ4MFhIUmNkRzFoYzNSbGNrOWlhaTV6WldOMGFXOXVNeTVwYzBGMWRHOXRZWFJsWkNBOUlHWmhiSE5sTzF4dVhIUmNkRngwWEhSOVhHNWNkRngwWEhSOVhHNWNibHgwWEhSY2RHbG1LQ1FvSnlOelpXTjBhVzl1TkM1aFkzUnBkbVVuS1M1c1pXNW5kR2dwSUhzZ0x5OGdRVlZVVDAxQlZFVWdWRWhGSUZOTVNVUkZVeUJQVGlCVFJVTlVTVTlRVGlBMElFVldSVkpaSURjZ1UwVkRUMDVFVXlCSlJpQlVTRVVnVTBWRFZFbFBUaUJKVXlCQlExUkpWa1V1SUZ4Y1hGeGNibHgwWEhSY2RGeDBhV1lvYldGemRHVnlUMkpxTG5ObFkzUnBiMjQwTG1selFYVjBiMjFoZEdWa0lDRTlQU0IwY25WbEtTQjdYRzVjZEZ4MFhIUmNkRngwYldGemRHVnlUMkpxTG5ObFkzUnBiMjQwTG1selFYVjBiMjFoZEdWa0lEMGdkSEoxWlR0Y2JseDBYSFJjZEZ4MFhIUnBiblJsY25aaGJFMWhibUZuWlhJb2RISjFaU3dnSjNObFkzUnBiMjQwSnl3Z056QXdNQ2s3WEc1Y2RGeDBYSFJjZEgxY2JseDBYSFJjZEgwZ1pXeHpaU0I3SUM4dklGTlVUMUFnUVZWVVQwMUJWRVZFSUZOTVNVUkZVeUJQVGlCVFJVTlVTVTlRVGlBMElFbEdJRlJJUlNCVFJVTlVTVTlPSUVsVElFNVBWQ0JCUTFSSlZrVXVJRnhjWEZ4Y2JseDBYSFJjZEZ4MGFXWW9iV0Z6ZEdWeVQySnFMbk5sWTNScGIyNDBMbWx6UVhWMGIyMWhkR1ZrSUQwOVBTQjBjblZsS1NCN1hHNWNkRngwWEhSY2RGeDBhVzUwWlhKMllXeE5ZVzVoWjJWeUtHWmhiSE5sTENBbmMyVmpkR2x2YmpRbktUdGNibHgwWEhSY2RGeDBYSFJ0WVhOMFpYSlBZbW91YzJWamRHbHZialF1YVhOQmRYUnZiV0YwWldRZ1BTQm1ZV3h6WlR0Y2JseDBYSFJjZEZ4MGZWeHVYSFJjZEZ4MGZWeHVYSFJjZEgwc0lEVXdNQ2s3WEc1Y2RIMWNibHh1THk4Z1EwOU9WRkpQVENCWFNFRlVJRWhCVUZCRlRsTWdWMGhGVGlCTVNVNUxVeUJKVGlCVVNFVWdUa0ZXTDAxRlRsVWdRVkpGSUVOTVNVTkxSVVFnWEZ4Y1hGeHVYRzVjZENRb0p5NXVZWFpmYkdsdWF5Y3BMbU5zYVdOcktDaGxLU0E5UGlCN1hHNWNkRngwWTI5dWMzUWdjR0ZuWlVsa2VDQTlJSEJoY25ObFNXNTBLQ1FvWlM1MFlYSm5aWFFwTG1GMGRISW9KMlJoZEdFdGFXNWtaWGduS1NrN1hHNWNkRngwSkNnbkkzTmpjbTlzYkdWeVYzSmhjSEJsY2ljcExtMXZkbVZVYnlod1lXZGxTV1I0S1R0Y2JseDBYSFFrS0NjamJXVnVkVUpzYjJOclQzVjBKeWt1WVdSa1EyeGhjM01vSjJocFpHUmxiaWNwTzF4dVhHNWNkRngwYVdZb1luVnlaMlZ5TG1Oc1lYTnpUR2x6ZEM1amIyNTBZV2x1Y3lnblluVnlaMlZ5TFMxaFkzUnBkbVVuS1NrZ2UxeHVJQ0FnSUNBZ2JtRjJMbU5zWVhOelRHbHpkQzV5WlcxdmRtVW9KMjVoZGw5dmNHVnVKeWs3WEc0Z0lDQWdJQ0JpZFhKblpYSXVZMnhoYzNOTWFYTjBMbkpsYlc5MlpTZ25ZblZ5WjJWeUxTMWhZM1JwZG1VbktUdGNiaUFnSUNBZ0lHUnZZM1Z0Wlc1MExtSnZaSGt1YzNSNWJHVXVjRzl6YVhScGIyNGdQU0FuY21Wc1lYUnBkbVVuTzF4dUlDQWdJSDBnWEc1Y2RIMHBPMXh1WEc0dkx5QlhTRVZPSUZSSVJTQk9RVllnU1ZNZ1QxQkZUaUJRVWtWV1JVNVVJRlZUUlZJZ1JsSlBUU0JDUlVsT1J5QkJRa3hGSUZSUElFTk1TVU5MSUVGT1dWUklTVTVISUVWTVUwVWdYRnhjWEZ4dVhHNWNkQ1FvSnlOdFpXNTFRbXh2WTJ0UGRYUW5LUzVqYkdsamF5Z29aU2tnUFQ0Z2UxeHVYSFFnSUNCbExuTjBiM0JRY205d1lXZGhkR2x2YmlncE8xeHVYSFI5S1R0Y2JseHVYSFIyWVhJZ1luVnlaMlZ5SUQwZ1pHOWpkVzFsYm5RdVoyVjBSV3hsYldWdWRFSjVTV1FvSjIxaGFXNHRZblZ5WjJWeUp5a3NJRnh1SUNCdVlYWWdQU0JrYjJOMWJXVnVkQzVuWlhSRmJHVnRaVzUwUW5sSlpDZ25iV0ZwYms1aGRpY3BPMXh1WEc0dkx5QkRUMDVVVWs5TUlFWlBVaUJQVUVWT0lFRk9SQ0JEVEU5VFNVNUhJRlJJUlNCTlJVNVZMMDVCVmlBZ1hGeGNYRnh1WEc0Z0lHWjFibU4wYVc5dUlHNWhka052Ym5SeWIyd29LU0I3WEc1Y2JpQWdJQ0JwWmloaWRYSm5aWEl1WTJ4aGMzTk1hWE4wTG1OdmJuUmhhVzV6S0NkaWRYSm5aWEl0TFdGamRHbDJaU2NwS1NCN1hHNGdJQ0FnSUNCdVlYWXVZMnhoYzNOTWFYTjBMbkpsYlc5MlpTZ25ibUYyWDI5d1pXNG5LVHRjYmlBZ0lDQWdJR0oxY21kbGNpNWpiR0Z6YzB4cGMzUXVjbVZ0YjNabEtDZGlkWEpuWlhJdExXRmpkR2wyWlNjcE8xeHVJQ0FnSUNBZ0pDZ25JMjFsYm5WQ2JHOWphMDkxZENjcExtRmtaRU5zWVhOektDZG9hV1JrWlc0bktUdGNiaUFnSUNCOUlGeHVJQ0FnSUdWc2MyVWdlMXh1SUNBZ0lDQWdZblZ5WjJWeUxtTnNZWE56VEdsemRDNWhaR1FvSjJKMWNtZGxjaTB0WVdOMGFYWmxKeWs3WEc0Z0lDQWdJQ0J1WVhZdVkyeGhjM05NYVhOMExtRmtaQ2duYm1GMlgyOXdaVzRuS1R0Y2JpQWdJQ0FnSUNRb0p5TnRaVzUxUW14dlkydFBkWFFuS1M1eVpXMXZkbVZEYkdGemN5Z25hR2xrWkdWdUp5azdYRzRnSUNBZ2ZWeHVJQ0I5WEc0Z0lGeHVMeThnVDA1TVdTQk1TVk5VUlU0Z1JrOVNJRTFGVGxVZ1EweEpRMHRUSUZkSVJVNGdUazlVSUVsT0lFTk5VeUJRVWtWV1NVVlhJRTFQUkVVZ1hGeGNYRnh1WEc0Z0lHbG1LQ0VrS0d4dlkyRjBhVzl1S1M1aGRIUnlLQ2RvY21WbUp5a3VhVzVqYkhWa1pYTW9KMmx1WkdWNExuQm9jQ2NwS1NCN1hHNGdJRngwWW5WeVoyVnlMbUZrWkVWMlpXNTBUR2x6ZEdWdVpYSW9KMk5zYVdOckp5d2dibUYyUTI5dWRISnZiQ2s3WEc0Z0lIMWNibHh1THk4Z1EweFBVMFVnVkVoRklFNUJWaUJKUmlCVVNFVWdWMGxPUkU5WElFbFRJRTlXUlZJZ01UQXdNRkJZSUZkSlJFVWdYRnhjWEZ4dVhHNGdJSGRwYm1SdmR5NWhaR1JGZG1WdWRFeHBjM1JsYm1WeUtDZHlaWE5wZW1VbkxDQm1kVzVqZEdsdmJpZ3BJSHRjYmlBZ0lDQnBaaWgzYVc1a2IzY3VhVzV1WlhKWGFXUjBhQ0ErSURFd01EQWdKaVlnYm1GMkxtTnNZWE56VEdsemRDNWpiMjUwWVdsdWN5Z25ibUYyWDI5d1pXNG5LU2tnZTF4dUlDQWdJQ0FnYm1GMlEyOXVkSEp2YkNncE8xeHVJQ0FnSUNBZ2JtRjJMbU5zWVhOelRHbHpkQzV5WlcxdmRtVW9KMjVoZGw5dmNHVnVKeWs3WEc0Z0lDQWdJQ0FnSkNnbkkyMWxiblZDYkc5amEwOTFkQ2NwTG1Ga1pFTnNZWE56S0Nkb2FXUmtaVzRuS1R0Y2JpQWdJQ0I5WEc0Z0lIMHBPMXh1WEc0dkx5QlVTRWxUSUZORlZDQlBSaUJKUmlCVFZFRlVSVTFGVGxSVElFbE9TVlJKUVV4SlUwVlRJRlJJUlNCVFVFVlRTVVpKUXlCUVFVZEZVeUJHVDFJZ1VGSkZWa2xGVjBsT1J5QkpUaUJEVFZNZ1FVUk5TVTR1SUZ4Y1hGeGNibHh1SUNCcFppZ2tLR3h2WTJGMGFXOXVLUzVoZEhSeUtDZG9jbVZtSnlrdWFXNWpiSFZrWlhNb0oybHVaR1Y0TG5Cb2NDY3BLU0I3WEc1Y2RGeDBhV1lvSkNoc2IyTmhkR2x2YmlrdVlYUjBjaWduYUhKbFppY3BMbWx1WTJ4MVpHVnpLQ2RwYldGbmFXNWxMV2xtSnlrcElIdGNibHgwWEhSY2RIQmhaMlZNYjJGa1pYSW9OQ2s3WEc1Y2RGeDBmVnh1WEhSY2RHbG1LQ1FvYkc5allYUnBiMjRwTG1GMGRISW9KMmh5WldZbktTNXBibU5zZFdSbGN5Z25hRzkzTFhkbExXbHVibTkyWVhSbEp5a3BJSHRjYmx4MFhIUmNkSEJoWjJWTWIyRmtaWElvTXlrN1hHNWNkRngwZlZ4dVhIUmNkR2xtS0NRb2JHOWpZWFJwYjI0cExtRjBkSElvSjJoeVpXWW5LUzVwYm1Oc2RXUmxjeWduZDI5eWF5MTNhWFJvTFhWekp5a3BJSHRjYmx4MFhIUmNkSEJoWjJWTWIyRmtaWElvTlNrN1hHNWNkRngwZlZ4dVhIUmNkR2xtS0NRb2JHOWpZWFJwYjI0cExtRjBkSElvSjJoeVpXWW5LUzVwYm1Oc2RXUmxjeWduWTI5dWRHRmpkQzExY3ljcEtTQjdYRzVjZEZ4MFhIUndZV2RsVEc5aFpHVnlLRFlwTzF4dVhIUmNkSDFjYmx4MFhIUnBaaWdrS0d4dlkyRjBhVzl1S1M1aGRIUnlLQ2RvY21WbUp5a3VhVzVqYkhWa1pYTW9KMmh2YldVdGRtbGtaVzhuS1NrZ2UxeHVYSFJjZEZ4MGMyVjBTVzUwWlhKMllXd29LQ2tnUFQ0Z2UxeHVYSFJjZEZ4MFhIUm9hV1JsVEc5aFpHbHVaMEZ1YVcxaGRHbHZiaWdwTzF4dVhIUmNkRngwZlN3Z05UQXdLVnh1WEhSY2RIMWNibHgwZlZ4dVhHNHZMeUJUVjBsUVJTQkZWa1ZPVkZNZ1JFVlVSVU5VVDFJZ1JsVk9RMVJKVDA0Z1hGeGNYRnh1WEc0Z0lHWjFibU4wYVc5dUlHUmxkR1ZqZEhOM2FYQmxLR1ZzTENCbWRXNWpLU0I3WEc1Y2RDQWdiR1YwSUhOM2FYQmxYMlJsZENBOUlIdDlPMXh1WEhRZ0lITjNhWEJsWDJSbGRDNXpXQ0E5SURBN0lITjNhWEJsWDJSbGRDNXpXU0E5SURBN0lITjNhWEJsWDJSbGRDNWxXQ0E5SURBN0lITjNhWEJsWDJSbGRDNWxXU0E5SURBN1hHNWNkQ0FnZG1GeUlHMXBibDk0SUQwZ016QTdJQ0F2TDIxcGJpQjRJSE4zYVhCbElHWnZjaUJvYjNKcGVtOXVkR0ZzSUhOM2FYQmxYRzVjZENBZ2RtRnlJRzFoZUY5NElEMGdNekE3SUNBdkwyMWhlQ0I0SUdScFptWmxjbVZ1WTJVZ1ptOXlJSFpsY25ScFkyRnNJSE4zYVhCbFhHNWNkQ0FnZG1GeUlHMXBibDk1SUQwZ05UQTdJQ0F2TDIxcGJpQjVJSE4zYVhCbElHWnZjaUIyWlhKMGFXTmhiQ0J6ZDJsd1pWeHVYSFFnSUhaaGNpQnRZWGhmZVNBOUlEWXdPeUFnTHk5dFlYZ2dlU0JrYVdabVpYSmxibU5sSUdadmNpQm9iM0pwZW05dWRHRnNJSE4zYVhCbFhHNWNkQ0FnZG1GeUlHUnBjbVZqSUQwZ1hDSmNJanRjYmx4MElDQnNaWFFnWld4bElEMGdaRzlqZFcxbGJuUXVaMlYwUld4bGJXVnVkRUo1U1dRb1pXd3BPMXh1WEhRZ0lHVnNaUzVoWkdSRmRtVnVkRXhwYzNSbGJtVnlLQ2QwYjNWamFITjBZWEowSnl4bWRXNWpkR2x2YmlobEtYdGNibHgwSUNBZ0lIWmhjaUIwSUQwZ1pTNTBiM1ZqYUdWeld6QmRPMXh1WEhRZ0lDQWdjM2RwY0dWZlpHVjBMbk5ZSUQwZ2RDNXpZM0psWlc1WU95QmNibHgwSUNBZ0lITjNhWEJsWDJSbGRDNXpXU0E5SUhRdWMyTnlaV1Z1V1R0Y2JseDBJQ0I5TEdaaGJITmxLVHRjYmx4MElDQmxiR1V1WVdSa1JYWmxiblJNYVhOMFpXNWxjaWduZEc5MVkyaHRiM1psSnl4bWRXNWpkR2x2YmlobEtYdGNibHgwSUNBZ0lHVXVjSEpsZG1WdWRFUmxabUYxYkhRb0tUdGNibHgwSUNBZ0lIWmhjaUIwSUQwZ1pTNTBiM1ZqYUdWeld6QmRPMXh1WEhRZ0lDQWdjM2RwY0dWZlpHVjBMbVZZSUQwZ2RDNXpZM0psWlc1WU95QmNibHgwSUNBZ0lITjNhWEJsWDJSbGRDNWxXU0E5SUhRdWMyTnlaV1Z1V1RzZ0lDQWdYRzVjZENBZ2ZTeG1ZV3h6WlNrN1hHNWNkQ0FnWld4bExtRmtaRVYyWlc1MFRHbHpkR1Z1WlhJb0ozUnZkV05vWlc1a0p5eG1kVzVqZEdsdmJpaGxLWHRjYmx4MElDQWdJQzh2YUc5eWFYcHZiblJoYkNCa1pYUmxZM1JwYjI1Y2JseDBJQ0FnSUdsbUlDZ29LQ2h6ZDJsd1pWOWtaWFF1WlZnZ0xTQnRhVzVmZUNBK0lITjNhWEJsWDJSbGRDNXpXQ2tnZkh3Z0tITjNhWEJsWDJSbGRDNWxXQ0FySUcxcGJsOTRJRHdnYzNkcGNHVmZaR1YwTG5OWUtTa2dKaVlnS0NoemQybHdaVjlrWlhRdVpWa2dQQ0J6ZDJsd1pWOWtaWFF1YzFrZ0t5QnRZWGhmZVNrZ0ppWWdLSE4zYVhCbFgyUmxkQzV6V1NBK0lITjNhWEJsWDJSbGRDNWxXU0F0SUcxaGVGOTVLU0FtSmlBb2MzZHBjR1ZmWkdWMExtVllJRDRnTUNrcEtTa2dlMXh1WEhRZ0lDQWdJQ0JwWmloemQybHdaVjlrWlhRdVpWZ2dQaUJ6ZDJsd1pWOWtaWFF1YzFncElHUnBjbVZqSUQwZ1hDSnlYQ0k3WEc1Y2RDQWdJQ0FnSUdWc2MyVWdaR2x5WldNZ1BTQmNJbXhjSWp0Y2JseDBJQ0FnSUgxY2JseDBJQ0FnSUM4dmRtVnlkR2xqWVd3Z1pHVjBaV04wYVc5dVhHNWNkQ0FnSUNCbGJITmxJR2xtSUNnb0tDaHpkMmx3WlY5a1pYUXVaVmtnTFNCdGFXNWZlU0ErSUhOM2FYQmxYMlJsZEM1eldTa2dmSHdnS0hOM2FYQmxYMlJsZEM1bFdTQXJJRzFwYmw5NUlEd2djM2RwY0dWZlpHVjBMbk5aS1NrZ0ppWWdLQ2h6ZDJsd1pWOWtaWFF1WlZnZ1BDQnpkMmx3WlY5a1pYUXVjMWdnS3lCdFlYaGZlQ2tnSmlZZ0tITjNhWEJsWDJSbGRDNXpXQ0ErSUhOM2FYQmxYMlJsZEM1bFdDQXRJRzFoZUY5NEtTQW1KaUFvYzNkcGNHVmZaR1YwTG1WWklENGdNQ2twS1NrZ2UxeHVYSFFnSUNBZ0lDQnBaaWh6ZDJsd1pWOWtaWFF1WlZrZ1BpQnpkMmx3WlY5a1pYUXVjMWtwSUdScGNtVmpJRDBnWENKa1hDSTdYRzVjZENBZ0lDQWdJR1ZzYzJVZ1pHbHlaV01nUFNCY0luVmNJanRjYmx4MElDQWdJSDFjYmx4dVhIUWdJQ0FnYVdZZ0tHUnBjbVZqSUNFOUlGd2lYQ0lwSUh0Y2JseDBJQ0FnSUNBZ2FXWW9kSGx3Wlc5bUlHWjFibU1nUFQwZ0oyWjFibU4wYVc5dUp5a2dablZ1WXlobGJDeGthWEpsWXlrN1hHNWNkQ0FnSUNCOVhHNWNkQ0FnSUNCc1pYUWdaR2x5WldNZ1BTQmNJbHdpTzF4dVhIUWdJQ0FnYzNkcGNHVmZaR1YwTG5OWUlEMGdNRHNnYzNkcGNHVmZaR1YwTG5OWklEMGdNRHNnYzNkcGNHVmZaR1YwTG1WWUlEMGdNRHNnYzNkcGNHVmZaR1YwTG1WWklEMGdNRHRjYmx4MElDQjlMR1poYkhObEtUc2dJRnh1WEhSOVhHNWNiaTh2SUVOSVQxTkZJRlJJUlNCT1JWaFVJRk5NU1VSRklGUlBJRk5JVDFjZ1FVNUVJRU5NU1VOTElGUklSU0JRUVVkSlRrRlVTVTlPSUVKVlZGUlBUaUJVU0VGVUlGSkZURUZVUlZNZ1ZFOGdTVlF1SUZ4Y1hGeGNibHh1WEhSamIyNXpkQ0J6ZDJsd1pVTnZiblJ5YjJ4c1pYSWdQU0FvWld3c0lHUXBJRDArSUh0Y2JseHVYSFJjZEdsbUtHVnNJRDA5UFNBbmMyVmpkR2x2YmpRbktTQjdYRzVjYmx4MFhIUmNkR052Ym5OMElITmxZM1JwYjI0MFVHRm5hVzVoZEdsdmJreGxibWQwYUNBOUlDUW9KeTV6WldOMGFXOXVORkJoWjJsdVlYUnZja0oxZEhSdmJpY3BMbXhsYm1kMGFEdGNibHh1WEhSY2RGeDBhV1lvWkNBOVBUMGdKMnduS1NCN1hHNWNibHgwWEhSY2RGeDBhV1lvYzJWamRHbHZialJKWkhnZ1BDQnpaV04wYVc5dU5GQmhaMmx1WVhScGIyNU1aVzVuZEdnZ0xTQXhLU0I3WEc1Y2RGeDBYSFJjZEZ4MGMyVmpkR2x2YmpSSlpIZ3JLenRjYmx4MFhIUmNkRngwZlNCbGJITmxJSHRjYmx4MFhIUmNkRngwWEhSelpXTjBhVzl1TkVsa2VDQTlJREE3WEc1Y2RGeDBYSFJjZEgxY2JseDBYSFJjZEZ4MFhHNWNkRngwWEhSY2RDUW9KeTV6WldOMGFXOXVORkJoWjJsdVlYUnZja0oxZEhSdmJpY3BXM05sWTNScGIyNDBTV1I0WFM1amJHbGpheWdwTzF4dVhIUmNkRngwZlZ4dVhIUmNkRngwYVdZb1pDQTlQVDBnSjNJbktTQjdYRzVjYmx4MFhIUmNkRngwYVdZb2MyVmpkR2x2YmpSSlpIZ2dQaUF3S1NCN1hHNWNkRngwWEhSY2RGeDBjMlZqZEdsdmJqUkpaSGd0TFR0Y2JseDBYSFJjZEZ4MGZTQmxiSE5sSUh0Y2JseDBYSFJjZEZ4MFhIUnpaV04wYVc5dU5FbGtlQ0E5SUhObFkzUnBiMjQwVUdGbmFXNWhkR2x2Ymt4bGJtZDBhQ0F0SURFN1hHNWNkRngwWEhSY2RIMWNibHh1WEhSY2RGeDBYSFFrS0NjdWMyVmpkR2x2YmpSUVlXZHBibUYwYjNKQ2RYUjBiMjRuS1Z0elpXTjBhVzl1TkVsa2VGMHVZMnhwWTJzb0tUdGNibHgwWEhSY2RIMWNibHgwWEhSOVhHNWNkRngwYVdZb1pXd2dQVDA5SUNkelpXTjBhVzl1TXljcElIdGNibHh1WEhSY2RGeDBZMjl1YzNRZ2MyVmpkR2x2YmpOUVlXZHBibUYwYVc5dVRHVnVaM1JvSUQwZ0pDZ25Mbk5sWTNScGIyNHpVR0ZuYVc1aGRHOXlRblYwZEc5dUp5a3ViR1Z1WjNSb08xeHVYRzVjZEZ4MFhIUnBaaWhrSUQwOVBTQW5iQ2NwSUh0Y2JseHVYSFJjZEZ4MFhIUnBaaWh6WldOMGFXOXVNMGxrZUNBOElITmxZM1JwYjI0elVHRm5hVzVoZEdsdmJreGxibWQwYUNBdElERXBJSHRjYmx4MFhIUmNkRngwWEhSelpXTjBhVzl1TTBsa2VDc3JPMXh1WEhSY2RGeDBYSFI5SUdWc2MyVWdlMXh1WEhSY2RGeDBYSFJjZEhObFkzUnBiMjR6U1dSNElEMGdNRHRjYmx4MFhIUmNkRngwZlZ4dVhIUmNkRngwWEhSY2JseDBYSFJjZEZ4MEpDZ25Mbk5sWTNScGIyNHpVR0ZuYVc1aGRHOXlRblYwZEc5dUp5bGJjMlZqZEdsdmJqTkpaSGhkTG1Oc2FXTnJLQ2s3WEc1Y2RGeDBYSFI5WEc1Y2RGeDBYSFJwWmloa0lEMDlQU0FuY2ljcElIdGNibHh1WEhSY2RGeDBYSFJwWmloelpXTjBhVzl1TTBsa2VDQStJREFwSUh0Y2JseDBYSFJjZEZ4MFhIUnpaV04wYVc5dU0wbGtlQzB0TzF4dVhIUmNkRngwWEhSOUlHVnNjMlVnZTF4dVhIUmNkRngwWEhSY2RITmxZM1JwYjI0elNXUjRJRDBnYzJWamRHbHZiak5RWVdkcGJtRjBhVzl1VEdWdVozUm9JQzBnTVR0Y2JseDBYSFJjZEZ4MGZWeHVYSFJjZEZ4MFhIUmNibHgwWEhSY2RGeDBKQ2duTG5ObFkzUnBiMjR6VUdGbmFXNWhkRzl5UW5WMGRHOXVKeWxiYzJWamRHbHZiak5KWkhoZExtTnNhV05yS0NrN1hHNWNkRngwWEhSOVhHNWNkRngwZlZ4dVhIUjlYRzVjYmk4dklFbE9TVlJKUVZSRklFWlBVaUJUVjBsUVJTQkVSVlJGUTFSSlQwNGdUMDRnVTBWRFZFbFBUbE1nTXlCQlRrUWdOQ0JGV0VORlVGUWdTVTRnUVVSTlNVNGdVRkpGVmtsRlZ5NGdYRnhjWEZ4dVhHNWNkR2xtS0NFa0tHeHZZMkYwYVc5dUtTNWhkSFJ5S0Nkb2NtVm1KeWt1YVc1amJIVmtaWE1vSjJsdVpHVjRMbkJvY0NjcEtTQjdYRzVjZEZ4MFpHVjBaV04wYzNkcGNHVW9KM05sWTNScGIyNDBKeXdnYzNkcGNHVkRiMjUwY205c2JHVnlLVHRjYmx4MFhIUmtaWFJsWTNSemQybHdaU2duYzJWamRHbHZiak1uTENCemQybHdaVU52Ym5SeWIyeHNaWElwTzF4dVhIUjlYRzU5S1RzaVhYMD1cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiRlQ1T1JzXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvZmFrZV84YjZmODkxOC5qc1wiLFwiL1wiKSJdfQ==
