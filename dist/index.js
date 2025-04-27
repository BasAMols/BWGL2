var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/@picode/binary-reader/lib/index.js
var require_lib = __commonJS({
  "node_modules/@picode/binary-reader/lib/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BinaryReader = void 0;
    var BinaryReader = class {
      constructor(binary) {
        this.offset = 0;
        this.binary = binary;
      }
      readUint8() {
        return this.binary[this.offset++].valueOf();
      }
      readUint8AsString() {
        return String.fromCharCode(this.binary[this.offset++].valueOf());
      }
      readUint8AsBool() {
        return this.binary[this.offset++].valueOf() !== 0;
      }
      readUint16() {
        const v = new DataView(this.binary.buffer, this.binary.byteOffset + this.offset, 2).getUint16(0, true);
        this.offset += 2;
        return v;
      }
      readUint32() {
        const v = new DataView(this.binary.buffer, this.binary.byteOffset + this.offset, 4).getUint32(0, true);
        this.offset += 4;
        return v;
      }
      readUint64() {
        const v = new DataView(this.binary.buffer, this.binary.byteOffset + this.offset, 8).getBigUint64(0, true);
        this.offset += 8;
        return v;
      }
      readInt8() {
        const v = new DataView(this.binary.buffer, this.binary.byteOffset + this.offset, 1).getInt8(0);
        this.offset += 1;
        return v;
      }
      readInt16() {
        const v = new DataView(this.binary.buffer, this.binary.byteOffset + this.offset, 2).getInt16(0, true);
        this.offset += 2;
        return v;
      }
      readInt32() {
        const v = new DataView(this.binary.buffer, this.binary.byteOffset + this.offset, 4).getInt32(0, true);
        this.offset += 4;
        return v;
      }
      readInt64() {
        const v = new DataView(this.binary.buffer, this.binary.byteOffset + this.offset, 8).getBigInt64(0, true);
        this.offset += 8;
        return v;
      }
      readFloat32() {
        const v = new DataView(this.binary.buffer, this.binary.byteOffset + this.offset, 4).getFloat32(0, true);
        this.offset += 4;
        return v;
      }
      readFloat64() {
        const v = new DataView(this.binary.buffer, this.binary.byteOffset + this.offset, 8).getFloat64(0, true);
        this.offset += 8;
        return v;
      }
      readUint8Array(length2) {
        return this.binary.subarray(this.offset, this.offset += length2);
      }
      readArrayAsString(length2) {
        return String.fromCharCode.apply(null, this.binary.subarray(this.offset, this.offset += length2));
      }
    };
    exports.BinaryReader = BinaryReader;
  }
});

// node_modules/pako/lib/zlib/trees.js
var require_trees = __commonJS({
  "node_modules/pako/lib/zlib/trees.js"(exports, module) {
    "use strict";
    var Z_FIXED = 4;
    var Z_BINARY = 0;
    var Z_TEXT = 1;
    var Z_UNKNOWN = 2;
    function zero2(buf) {
      let len2 = buf.length;
      while (--len2 >= 0) {
        buf[len2] = 0;
      }
    }
    var STORED_BLOCK = 0;
    var STATIC_TREES = 1;
    var DYN_TREES = 2;
    var MIN_MATCH = 3;
    var MAX_MATCH = 258;
    var LENGTH_CODES = 29;
    var LITERALS = 256;
    var L_CODES = LITERALS + 1 + LENGTH_CODES;
    var D_CODES = 30;
    var BL_CODES = 19;
    var HEAP_SIZE = 2 * L_CODES + 1;
    var MAX_BITS = 15;
    var Buf_size = 16;
    var MAX_BL_BITS = 7;
    var END_BLOCK = 256;
    var REP_3_6 = 16;
    var REPZ_3_10 = 17;
    var REPZ_11_138 = 18;
    var extra_lbits = (
      /* extra bits for each length code */
      new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0])
    );
    var extra_dbits = (
      /* extra bits for each distance code */
      new Uint8Array([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13])
    );
    var extra_blbits = (
      /* extra bits for each bit length code */
      new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7])
    );
    var bl_order = new Uint8Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
    var DIST_CODE_LEN = 512;
    var static_ltree = new Array((L_CODES + 2) * 2);
    zero2(static_ltree);
    var static_dtree = new Array(D_CODES * 2);
    zero2(static_dtree);
    var _dist_code = new Array(DIST_CODE_LEN);
    zero2(_dist_code);
    var _length_code = new Array(MAX_MATCH - MIN_MATCH + 1);
    zero2(_length_code);
    var base_length = new Array(LENGTH_CODES);
    zero2(base_length);
    var base_dist = new Array(D_CODES);
    zero2(base_dist);
    function StaticTreeDesc(static_tree, extra_bits, extra_base, elems, max_length) {
      this.static_tree = static_tree;
      this.extra_bits = extra_bits;
      this.extra_base = extra_base;
      this.elems = elems;
      this.max_length = max_length;
      this.has_stree = static_tree && static_tree.length;
    }
    var static_l_desc;
    var static_d_desc;
    var static_bl_desc;
    function TreeDesc(dyn_tree, stat_desc) {
      this.dyn_tree = dyn_tree;
      this.max_code = 0;
      this.stat_desc = stat_desc;
    }
    var d_code = (dist2) => {
      return dist2 < 256 ? _dist_code[dist2] : _dist_code[256 + (dist2 >>> 7)];
    };
    var put_short = (s, w) => {
      s.pending_buf[s.pending++] = w & 255;
      s.pending_buf[s.pending++] = w >>> 8 & 255;
    };
    var send_bits = (s, value, length2) => {
      if (s.bi_valid > Buf_size - length2) {
        s.bi_buf |= value << s.bi_valid & 65535;
        put_short(s, s.bi_buf);
        s.bi_buf = value >> Buf_size - s.bi_valid;
        s.bi_valid += length2 - Buf_size;
      } else {
        s.bi_buf |= value << s.bi_valid & 65535;
        s.bi_valid += length2;
      }
    };
    var send_code = (s, c, tree) => {
      send_bits(
        s,
        tree[c * 2],
        tree[c * 2 + 1]
        /*.Len*/
      );
    };
    var bi_reverse = (code, len2) => {
      let res = 0;
      do {
        res |= code & 1;
        code >>>= 1;
        res <<= 1;
      } while (--len2 > 0);
      return res >>> 1;
    };
    var bi_flush = (s) => {
      if (s.bi_valid === 16) {
        put_short(s, s.bi_buf);
        s.bi_buf = 0;
        s.bi_valid = 0;
      } else if (s.bi_valid >= 8) {
        s.pending_buf[s.pending++] = s.bi_buf & 255;
        s.bi_buf >>= 8;
        s.bi_valid -= 8;
      }
    };
    var gen_bitlen = (s, desc) => {
      const tree = desc.dyn_tree;
      const max_code = desc.max_code;
      const stree = desc.stat_desc.static_tree;
      const has_stree = desc.stat_desc.has_stree;
      const extra = desc.stat_desc.extra_bits;
      const base = desc.stat_desc.extra_base;
      const max_length = desc.stat_desc.max_length;
      let h;
      let n, m;
      let bits;
      let xbits;
      let f;
      let overflow = 0;
      for (bits = 0; bits <= MAX_BITS; bits++) {
        s.bl_count[bits] = 0;
      }
      tree[s.heap[s.heap_max] * 2 + 1] = 0;
      for (h = s.heap_max + 1; h < HEAP_SIZE; h++) {
        n = s.heap[h];
        bits = tree[tree[n * 2 + 1] * 2 + 1] + 1;
        if (bits > max_length) {
          bits = max_length;
          overflow++;
        }
        tree[n * 2 + 1] = bits;
        if (n > max_code) {
          continue;
        }
        s.bl_count[bits]++;
        xbits = 0;
        if (n >= base) {
          xbits = extra[n - base];
        }
        f = tree[n * 2];
        s.opt_len += f * (bits + xbits);
        if (has_stree) {
          s.static_len += f * (stree[n * 2 + 1] + xbits);
        }
      }
      if (overflow === 0) {
        return;
      }
      do {
        bits = max_length - 1;
        while (s.bl_count[bits] === 0) {
          bits--;
        }
        s.bl_count[bits]--;
        s.bl_count[bits + 1] += 2;
        s.bl_count[max_length]--;
        overflow -= 2;
      } while (overflow > 0);
      for (bits = max_length; bits !== 0; bits--) {
        n = s.bl_count[bits];
        while (n !== 0) {
          m = s.heap[--h];
          if (m > max_code) {
            continue;
          }
          if (tree[m * 2 + 1] !== bits) {
            s.opt_len += (bits - tree[m * 2 + 1]) * tree[m * 2];
            tree[m * 2 + 1] = bits;
          }
          n--;
        }
      }
    };
    var gen_codes = (tree, max_code, bl_count) => {
      const next_code = new Array(MAX_BITS + 1);
      let code = 0;
      let bits;
      let n;
      for (bits = 1; bits <= MAX_BITS; bits++) {
        code = code + bl_count[bits - 1] << 1;
        next_code[bits] = code;
      }
      for (n = 0; n <= max_code; n++) {
        let len2 = tree[n * 2 + 1];
        if (len2 === 0) {
          continue;
        }
        tree[n * 2] = bi_reverse(next_code[len2]++, len2);
      }
    };
    var tr_static_init = () => {
      let n;
      let bits;
      let length2;
      let code;
      let dist2;
      const bl_count = new Array(MAX_BITS + 1);
      length2 = 0;
      for (code = 0; code < LENGTH_CODES - 1; code++) {
        base_length[code] = length2;
        for (n = 0; n < 1 << extra_lbits[code]; n++) {
          _length_code[length2++] = code;
        }
      }
      _length_code[length2 - 1] = code;
      dist2 = 0;
      for (code = 0; code < 16; code++) {
        base_dist[code] = dist2;
        for (n = 0; n < 1 << extra_dbits[code]; n++) {
          _dist_code[dist2++] = code;
        }
      }
      dist2 >>= 7;
      for (; code < D_CODES; code++) {
        base_dist[code] = dist2 << 7;
        for (n = 0; n < 1 << extra_dbits[code] - 7; n++) {
          _dist_code[256 + dist2++] = code;
        }
      }
      for (bits = 0; bits <= MAX_BITS; bits++) {
        bl_count[bits] = 0;
      }
      n = 0;
      while (n <= 143) {
        static_ltree[n * 2 + 1] = 8;
        n++;
        bl_count[8]++;
      }
      while (n <= 255) {
        static_ltree[n * 2 + 1] = 9;
        n++;
        bl_count[9]++;
      }
      while (n <= 279) {
        static_ltree[n * 2 + 1] = 7;
        n++;
        bl_count[7]++;
      }
      while (n <= 287) {
        static_ltree[n * 2 + 1] = 8;
        n++;
        bl_count[8]++;
      }
      gen_codes(static_ltree, L_CODES + 1, bl_count);
      for (n = 0; n < D_CODES; n++) {
        static_dtree[n * 2 + 1] = 5;
        static_dtree[n * 2] = bi_reverse(n, 5);
      }
      static_l_desc = new StaticTreeDesc(static_ltree, extra_lbits, LITERALS + 1, L_CODES, MAX_BITS);
      static_d_desc = new StaticTreeDesc(static_dtree, extra_dbits, 0, D_CODES, MAX_BITS);
      static_bl_desc = new StaticTreeDesc(new Array(0), extra_blbits, 0, BL_CODES, MAX_BL_BITS);
    };
    var init_block = (s) => {
      let n;
      for (n = 0; n < L_CODES; n++) {
        s.dyn_ltree[n * 2] = 0;
      }
      for (n = 0; n < D_CODES; n++) {
        s.dyn_dtree[n * 2] = 0;
      }
      for (n = 0; n < BL_CODES; n++) {
        s.bl_tree[n * 2] = 0;
      }
      s.dyn_ltree[END_BLOCK * 2] = 1;
      s.opt_len = s.static_len = 0;
      s.sym_next = s.matches = 0;
    };
    var bi_windup = (s) => {
      if (s.bi_valid > 8) {
        put_short(s, s.bi_buf);
      } else if (s.bi_valid > 0) {
        s.pending_buf[s.pending++] = s.bi_buf;
      }
      s.bi_buf = 0;
      s.bi_valid = 0;
    };
    var smaller = (tree, n, m, depth) => {
      const _n2 = n * 2;
      const _m2 = m * 2;
      return tree[_n2] < tree[_m2] || tree[_n2] === tree[_m2] && depth[n] <= depth[m];
    };
    var pqdownheap = (s, tree, k) => {
      const v = s.heap[k];
      let j = k << 1;
      while (j <= s.heap_len) {
        if (j < s.heap_len && smaller(tree, s.heap[j + 1], s.heap[j], s.depth)) {
          j++;
        }
        if (smaller(tree, v, s.heap[j], s.depth)) {
          break;
        }
        s.heap[k] = s.heap[j];
        k = j;
        j <<= 1;
      }
      s.heap[k] = v;
    };
    var compress_block = (s, ltree, dtree) => {
      let dist2;
      let lc;
      let sx = 0;
      let code;
      let extra;
      if (s.sym_next !== 0) {
        do {
          dist2 = s.pending_buf[s.sym_buf + sx++] & 255;
          dist2 += (s.pending_buf[s.sym_buf + sx++] & 255) << 8;
          lc = s.pending_buf[s.sym_buf + sx++];
          if (dist2 === 0) {
            send_code(s, lc, ltree);
          } else {
            code = _length_code[lc];
            send_code(s, code + LITERALS + 1, ltree);
            extra = extra_lbits[code];
            if (extra !== 0) {
              lc -= base_length[code];
              send_bits(s, lc, extra);
            }
            dist2--;
            code = d_code(dist2);
            send_code(s, code, dtree);
            extra = extra_dbits[code];
            if (extra !== 0) {
              dist2 -= base_dist[code];
              send_bits(s, dist2, extra);
            }
          }
        } while (sx < s.sym_next);
      }
      send_code(s, END_BLOCK, ltree);
    };
    var build_tree = (s, desc) => {
      const tree = desc.dyn_tree;
      const stree = desc.stat_desc.static_tree;
      const has_stree = desc.stat_desc.has_stree;
      const elems = desc.stat_desc.elems;
      let n, m;
      let max_code = -1;
      let node;
      s.heap_len = 0;
      s.heap_max = HEAP_SIZE;
      for (n = 0; n < elems; n++) {
        if (tree[n * 2] !== 0) {
          s.heap[++s.heap_len] = max_code = n;
          s.depth[n] = 0;
        } else {
          tree[n * 2 + 1] = 0;
        }
      }
      while (s.heap_len < 2) {
        node = s.heap[++s.heap_len] = max_code < 2 ? ++max_code : 0;
        tree[node * 2] = 1;
        s.depth[node] = 0;
        s.opt_len--;
        if (has_stree) {
          s.static_len -= stree[node * 2 + 1];
        }
      }
      desc.max_code = max_code;
      for (n = s.heap_len >> 1; n >= 1; n--) {
        pqdownheap(s, tree, n);
      }
      node = elems;
      do {
        n = s.heap[
          1
          /*SMALLEST*/
        ];
        s.heap[
          1
          /*SMALLEST*/
        ] = s.heap[s.heap_len--];
        pqdownheap(
          s,
          tree,
          1
          /*SMALLEST*/
        );
        m = s.heap[
          1
          /*SMALLEST*/
        ];
        s.heap[--s.heap_max] = n;
        s.heap[--s.heap_max] = m;
        tree[node * 2] = tree[n * 2] + tree[m * 2];
        s.depth[node] = (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1;
        tree[n * 2 + 1] = tree[m * 2 + 1] = node;
        s.heap[
          1
          /*SMALLEST*/
        ] = node++;
        pqdownheap(
          s,
          tree,
          1
          /*SMALLEST*/
        );
      } while (s.heap_len >= 2);
      s.heap[--s.heap_max] = s.heap[
        1
        /*SMALLEST*/
      ];
      gen_bitlen(s, desc);
      gen_codes(tree, max_code, s.bl_count);
    };
    var scan_tree = (s, tree, max_code) => {
      let n;
      let prevlen = -1;
      let curlen;
      let nextlen = tree[0 * 2 + 1];
      let count = 0;
      let max_count = 7;
      let min_count = 4;
      if (nextlen === 0) {
        max_count = 138;
        min_count = 3;
      }
      tree[(max_code + 1) * 2 + 1] = 65535;
      for (n = 0; n <= max_code; n++) {
        curlen = nextlen;
        nextlen = tree[(n + 1) * 2 + 1];
        if (++count < max_count && curlen === nextlen) {
          continue;
        } else if (count < min_count) {
          s.bl_tree[curlen * 2] += count;
        } else if (curlen !== 0) {
          if (curlen !== prevlen) {
            s.bl_tree[curlen * 2]++;
          }
          s.bl_tree[REP_3_6 * 2]++;
        } else if (count <= 10) {
          s.bl_tree[REPZ_3_10 * 2]++;
        } else {
          s.bl_tree[REPZ_11_138 * 2]++;
        }
        count = 0;
        prevlen = curlen;
        if (nextlen === 0) {
          max_count = 138;
          min_count = 3;
        } else if (curlen === nextlen) {
          max_count = 6;
          min_count = 3;
        } else {
          max_count = 7;
          min_count = 4;
        }
      }
    };
    var send_tree = (s, tree, max_code) => {
      let n;
      let prevlen = -1;
      let curlen;
      let nextlen = tree[0 * 2 + 1];
      let count = 0;
      let max_count = 7;
      let min_count = 4;
      if (nextlen === 0) {
        max_count = 138;
        min_count = 3;
      }
      for (n = 0; n <= max_code; n++) {
        curlen = nextlen;
        nextlen = tree[(n + 1) * 2 + 1];
        if (++count < max_count && curlen === nextlen) {
          continue;
        } else if (count < min_count) {
          do {
            send_code(s, curlen, s.bl_tree);
          } while (--count !== 0);
        } else if (curlen !== 0) {
          if (curlen !== prevlen) {
            send_code(s, curlen, s.bl_tree);
            count--;
          }
          send_code(s, REP_3_6, s.bl_tree);
          send_bits(s, count - 3, 2);
        } else if (count <= 10) {
          send_code(s, REPZ_3_10, s.bl_tree);
          send_bits(s, count - 3, 3);
        } else {
          send_code(s, REPZ_11_138, s.bl_tree);
          send_bits(s, count - 11, 7);
        }
        count = 0;
        prevlen = curlen;
        if (nextlen === 0) {
          max_count = 138;
          min_count = 3;
        } else if (curlen === nextlen) {
          max_count = 6;
          min_count = 3;
        } else {
          max_count = 7;
          min_count = 4;
        }
      }
    };
    var build_bl_tree = (s) => {
      let max_blindex;
      scan_tree(s, s.dyn_ltree, s.l_desc.max_code);
      scan_tree(s, s.dyn_dtree, s.d_desc.max_code);
      build_tree(s, s.bl_desc);
      for (max_blindex = BL_CODES - 1; max_blindex >= 3; max_blindex--) {
        if (s.bl_tree[bl_order[max_blindex] * 2 + 1] !== 0) {
          break;
        }
      }
      s.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4;
      return max_blindex;
    };
    var send_all_trees = (s, lcodes, dcodes, blcodes) => {
      let rank;
      send_bits(s, lcodes - 257, 5);
      send_bits(s, dcodes - 1, 5);
      send_bits(s, blcodes - 4, 4);
      for (rank = 0; rank < blcodes; rank++) {
        send_bits(s, s.bl_tree[bl_order[rank] * 2 + 1], 3);
      }
      send_tree(s, s.dyn_ltree, lcodes - 1);
      send_tree(s, s.dyn_dtree, dcodes - 1);
    };
    var detect_data_type = (s) => {
      let block_mask = 4093624447;
      let n;
      for (n = 0; n <= 31; n++, block_mask >>>= 1) {
        if (block_mask & 1 && s.dyn_ltree[n * 2] !== 0) {
          return Z_BINARY;
        }
      }
      if (s.dyn_ltree[9 * 2] !== 0 || s.dyn_ltree[10 * 2] !== 0 || s.dyn_ltree[13 * 2] !== 0) {
        return Z_TEXT;
      }
      for (n = 32; n < LITERALS; n++) {
        if (s.dyn_ltree[n * 2] !== 0) {
          return Z_TEXT;
        }
      }
      return Z_BINARY;
    };
    var static_init_done = false;
    var _tr_init = (s) => {
      if (!static_init_done) {
        tr_static_init();
        static_init_done = true;
      }
      s.l_desc = new TreeDesc(s.dyn_ltree, static_l_desc);
      s.d_desc = new TreeDesc(s.dyn_dtree, static_d_desc);
      s.bl_desc = new TreeDesc(s.bl_tree, static_bl_desc);
      s.bi_buf = 0;
      s.bi_valid = 0;
      init_block(s);
    };
    var _tr_stored_block = (s, buf, stored_len, last) => {
      send_bits(s, (STORED_BLOCK << 1) + (last ? 1 : 0), 3);
      bi_windup(s);
      put_short(s, stored_len);
      put_short(s, ~stored_len);
      if (stored_len) {
        s.pending_buf.set(s.window.subarray(buf, buf + stored_len), s.pending);
      }
      s.pending += stored_len;
    };
    var _tr_align = (s) => {
      send_bits(s, STATIC_TREES << 1, 3);
      send_code(s, END_BLOCK, static_ltree);
      bi_flush(s);
    };
    var _tr_flush_block = (s, buf, stored_len, last) => {
      let opt_lenb, static_lenb;
      let max_blindex = 0;
      if (s.level > 0) {
        if (s.strm.data_type === Z_UNKNOWN) {
          s.strm.data_type = detect_data_type(s);
        }
        build_tree(s, s.l_desc);
        build_tree(s, s.d_desc);
        max_blindex = build_bl_tree(s);
        opt_lenb = s.opt_len + 3 + 7 >>> 3;
        static_lenb = s.static_len + 3 + 7 >>> 3;
        if (static_lenb <= opt_lenb) {
          opt_lenb = static_lenb;
        }
      } else {
        opt_lenb = static_lenb = stored_len + 5;
      }
      if (stored_len + 4 <= opt_lenb && buf !== -1) {
        _tr_stored_block(s, buf, stored_len, last);
      } else if (s.strategy === Z_FIXED || static_lenb === opt_lenb) {
        send_bits(s, (STATIC_TREES << 1) + (last ? 1 : 0), 3);
        compress_block(s, static_ltree, static_dtree);
      } else {
        send_bits(s, (DYN_TREES << 1) + (last ? 1 : 0), 3);
        send_all_trees(s, s.l_desc.max_code + 1, s.d_desc.max_code + 1, max_blindex + 1);
        compress_block(s, s.dyn_ltree, s.dyn_dtree);
      }
      init_block(s);
      if (last) {
        bi_windup(s);
      }
    };
    var _tr_tally = (s, dist2, lc) => {
      s.pending_buf[s.sym_buf + s.sym_next++] = dist2;
      s.pending_buf[s.sym_buf + s.sym_next++] = dist2 >> 8;
      s.pending_buf[s.sym_buf + s.sym_next++] = lc;
      if (dist2 === 0) {
        s.dyn_ltree[lc * 2]++;
      } else {
        s.matches++;
        dist2--;
        s.dyn_ltree[(_length_code[lc] + LITERALS + 1) * 2]++;
        s.dyn_dtree[d_code(dist2) * 2]++;
      }
      return s.sym_next === s.sym_end;
    };
    module.exports._tr_init = _tr_init;
    module.exports._tr_stored_block = _tr_stored_block;
    module.exports._tr_flush_block = _tr_flush_block;
    module.exports._tr_tally = _tr_tally;
    module.exports._tr_align = _tr_align;
  }
});

// node_modules/pako/lib/zlib/adler32.js
var require_adler32 = __commonJS({
  "node_modules/pako/lib/zlib/adler32.js"(exports, module) {
    "use strict";
    var adler32 = (adler, buf, len2, pos) => {
      let s1 = adler & 65535 | 0, s2 = adler >>> 16 & 65535 | 0, n = 0;
      while (len2 !== 0) {
        n = len2 > 2e3 ? 2e3 : len2;
        len2 -= n;
        do {
          s1 = s1 + buf[pos++] | 0;
          s2 = s2 + s1 | 0;
        } while (--n);
        s1 %= 65521;
        s2 %= 65521;
      }
      return s1 | s2 << 16 | 0;
    };
    module.exports = adler32;
  }
});

// node_modules/pako/lib/zlib/crc32.js
var require_crc32 = __commonJS({
  "node_modules/pako/lib/zlib/crc32.js"(exports, module) {
    "use strict";
    var makeTable = () => {
      let c, table = [];
      for (var n = 0; n < 256; n++) {
        c = n;
        for (var k = 0; k < 8; k++) {
          c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1;
        }
        table[n] = c;
      }
      return table;
    };
    var crcTable = new Uint32Array(makeTable());
    var crc32 = (crc, buf, len2, pos) => {
      const t = crcTable;
      const end = pos + len2;
      crc ^= -1;
      for (let i = pos; i < end; i++) {
        crc = crc >>> 8 ^ t[(crc ^ buf[i]) & 255];
      }
      return crc ^ -1;
    };
    module.exports = crc32;
  }
});

// node_modules/pako/lib/zlib/messages.js
var require_messages = __commonJS({
  "node_modules/pako/lib/zlib/messages.js"(exports, module) {
    "use strict";
    module.exports = {
      2: "need dictionary",
      /* Z_NEED_DICT       2  */
      1: "stream end",
      /* Z_STREAM_END      1  */
      0: "",
      /* Z_OK              0  */
      "-1": "file error",
      /* Z_ERRNO         (-1) */
      "-2": "stream error",
      /* Z_STREAM_ERROR  (-2) */
      "-3": "data error",
      /* Z_DATA_ERROR    (-3) */
      "-4": "insufficient memory",
      /* Z_MEM_ERROR     (-4) */
      "-5": "buffer error",
      /* Z_BUF_ERROR     (-5) */
      "-6": "incompatible version"
      /* Z_VERSION_ERROR (-6) */
    };
  }
});

// node_modules/pako/lib/zlib/constants.js
var require_constants = __commonJS({
  "node_modules/pako/lib/zlib/constants.js"(exports, module) {
    "use strict";
    module.exports = {
      /* Allowed flush values; see deflate() and inflate() below for details */
      Z_NO_FLUSH: 0,
      Z_PARTIAL_FLUSH: 1,
      Z_SYNC_FLUSH: 2,
      Z_FULL_FLUSH: 3,
      Z_FINISH: 4,
      Z_BLOCK: 5,
      Z_TREES: 6,
      /* Return codes for the compression/decompression functions. Negative values
      * are errors, positive values are used for special but normal events.
      */
      Z_OK: 0,
      Z_STREAM_END: 1,
      Z_NEED_DICT: 2,
      Z_ERRNO: -1,
      Z_STREAM_ERROR: -2,
      Z_DATA_ERROR: -3,
      Z_MEM_ERROR: -4,
      Z_BUF_ERROR: -5,
      //Z_VERSION_ERROR: -6,
      /* compression levels */
      Z_NO_COMPRESSION: 0,
      Z_BEST_SPEED: 1,
      Z_BEST_COMPRESSION: 9,
      Z_DEFAULT_COMPRESSION: -1,
      Z_FILTERED: 1,
      Z_HUFFMAN_ONLY: 2,
      Z_RLE: 3,
      Z_FIXED: 4,
      Z_DEFAULT_STRATEGY: 0,
      /* Possible values of the data_type field (though see inflate()) */
      Z_BINARY: 0,
      Z_TEXT: 1,
      //Z_ASCII:                1, // = Z_TEXT (deprecated)
      Z_UNKNOWN: 2,
      /* The deflate compression method */
      Z_DEFLATED: 8
      //Z_NULL:                 null // Use -1 or null inline, depending on var type
    };
  }
});

// node_modules/pako/lib/zlib/deflate.js
var require_deflate = __commonJS({
  "node_modules/pako/lib/zlib/deflate.js"(exports, module) {
    "use strict";
    var { _tr_init, _tr_stored_block, _tr_flush_block, _tr_tally, _tr_align } = require_trees();
    var adler32 = require_adler32();
    var crc32 = require_crc32();
    var msg = require_messages();
    var {
      Z_NO_FLUSH,
      Z_PARTIAL_FLUSH,
      Z_FULL_FLUSH,
      Z_FINISH,
      Z_BLOCK,
      Z_OK,
      Z_STREAM_END,
      Z_STREAM_ERROR,
      Z_DATA_ERROR,
      Z_BUF_ERROR,
      Z_DEFAULT_COMPRESSION,
      Z_FILTERED,
      Z_HUFFMAN_ONLY,
      Z_RLE,
      Z_FIXED,
      Z_DEFAULT_STRATEGY,
      Z_UNKNOWN,
      Z_DEFLATED
    } = require_constants();
    var MAX_MEM_LEVEL = 9;
    var MAX_WBITS = 15;
    var DEF_MEM_LEVEL = 8;
    var LENGTH_CODES = 29;
    var LITERALS = 256;
    var L_CODES = LITERALS + 1 + LENGTH_CODES;
    var D_CODES = 30;
    var BL_CODES = 19;
    var HEAP_SIZE = 2 * L_CODES + 1;
    var MAX_BITS = 15;
    var MIN_MATCH = 3;
    var MAX_MATCH = 258;
    var MIN_LOOKAHEAD = MAX_MATCH + MIN_MATCH + 1;
    var PRESET_DICT = 32;
    var INIT_STATE = 42;
    var GZIP_STATE = 57;
    var EXTRA_STATE = 69;
    var NAME_STATE = 73;
    var COMMENT_STATE = 91;
    var HCRC_STATE = 103;
    var BUSY_STATE = 113;
    var FINISH_STATE = 666;
    var BS_NEED_MORE = 1;
    var BS_BLOCK_DONE = 2;
    var BS_FINISH_STARTED = 3;
    var BS_FINISH_DONE = 4;
    var OS_CODE = 3;
    var err = (strm, errorCode) => {
      strm.msg = msg[errorCode];
      return errorCode;
    };
    var rank = (f) => {
      return f * 2 - (f > 4 ? 9 : 0);
    };
    var zero2 = (buf) => {
      let len2 = buf.length;
      while (--len2 >= 0) {
        buf[len2] = 0;
      }
    };
    var slide_hash = (s) => {
      let n, m;
      let p;
      let wsize = s.w_size;
      n = s.hash_size;
      p = n;
      do {
        m = s.head[--p];
        s.head[p] = m >= wsize ? m - wsize : 0;
      } while (--n);
      n = wsize;
      p = n;
      do {
        m = s.prev[--p];
        s.prev[p] = m >= wsize ? m - wsize : 0;
      } while (--n);
    };
    var HASH_ZLIB = (s, prev, data) => (prev << s.hash_shift ^ data) & s.hash_mask;
    var HASH = HASH_ZLIB;
    var flush_pending = (strm) => {
      const s = strm.state;
      let len2 = s.pending;
      if (len2 > strm.avail_out) {
        len2 = strm.avail_out;
      }
      if (len2 === 0) {
        return;
      }
      strm.output.set(s.pending_buf.subarray(s.pending_out, s.pending_out + len2), strm.next_out);
      strm.next_out += len2;
      s.pending_out += len2;
      strm.total_out += len2;
      strm.avail_out -= len2;
      s.pending -= len2;
      if (s.pending === 0) {
        s.pending_out = 0;
      }
    };
    var flush_block_only = (s, last) => {
      _tr_flush_block(s, s.block_start >= 0 ? s.block_start : -1, s.strstart - s.block_start, last);
      s.block_start = s.strstart;
      flush_pending(s.strm);
    };
    var put_byte = (s, b) => {
      s.pending_buf[s.pending++] = b;
    };
    var putShortMSB = (s, b) => {
      s.pending_buf[s.pending++] = b >>> 8 & 255;
      s.pending_buf[s.pending++] = b & 255;
    };
    var read_buf = (strm, buf, start, size) => {
      let len2 = strm.avail_in;
      if (len2 > size) {
        len2 = size;
      }
      if (len2 === 0) {
        return 0;
      }
      strm.avail_in -= len2;
      buf.set(strm.input.subarray(strm.next_in, strm.next_in + len2), start);
      if (strm.state.wrap === 1) {
        strm.adler = adler32(strm.adler, buf, len2, start);
      } else if (strm.state.wrap === 2) {
        strm.adler = crc32(strm.adler, buf, len2, start);
      }
      strm.next_in += len2;
      strm.total_in += len2;
      return len2;
    };
    var longest_match = (s, cur_match) => {
      let chain_length = s.max_chain_length;
      let scan = s.strstart;
      let match;
      let len2;
      let best_len = s.prev_length;
      let nice_match = s.nice_match;
      const limit = s.strstart > s.w_size - MIN_LOOKAHEAD ? s.strstart - (s.w_size - MIN_LOOKAHEAD) : 0;
      const _win = s.window;
      const wmask = s.w_mask;
      const prev = s.prev;
      const strend = s.strstart + MAX_MATCH;
      let scan_end1 = _win[scan + best_len - 1];
      let scan_end = _win[scan + best_len];
      if (s.prev_length >= s.good_match) {
        chain_length >>= 2;
      }
      if (nice_match > s.lookahead) {
        nice_match = s.lookahead;
      }
      do {
        match = cur_match;
        if (_win[match + best_len] !== scan_end || _win[match + best_len - 1] !== scan_end1 || _win[match] !== _win[scan] || _win[++match] !== _win[scan + 1]) {
          continue;
        }
        scan += 2;
        match++;
        do {
        } while (_win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && scan < strend);
        len2 = MAX_MATCH - (strend - scan);
        scan = strend - MAX_MATCH;
        if (len2 > best_len) {
          s.match_start = cur_match;
          best_len = len2;
          if (len2 >= nice_match) {
            break;
          }
          scan_end1 = _win[scan + best_len - 1];
          scan_end = _win[scan + best_len];
        }
      } while ((cur_match = prev[cur_match & wmask]) > limit && --chain_length !== 0);
      if (best_len <= s.lookahead) {
        return best_len;
      }
      return s.lookahead;
    };
    var fill_window = (s) => {
      const _w_size = s.w_size;
      let n, more, str3;
      do {
        more = s.window_size - s.lookahead - s.strstart;
        if (s.strstart >= _w_size + (_w_size - MIN_LOOKAHEAD)) {
          s.window.set(s.window.subarray(_w_size, _w_size + _w_size - more), 0);
          s.match_start -= _w_size;
          s.strstart -= _w_size;
          s.block_start -= _w_size;
          if (s.insert > s.strstart) {
            s.insert = s.strstart;
          }
          slide_hash(s);
          more += _w_size;
        }
        if (s.strm.avail_in === 0) {
          break;
        }
        n = read_buf(s.strm, s.window, s.strstart + s.lookahead, more);
        s.lookahead += n;
        if (s.lookahead + s.insert >= MIN_MATCH) {
          str3 = s.strstart - s.insert;
          s.ins_h = s.window[str3];
          s.ins_h = HASH(s, s.ins_h, s.window[str3 + 1]);
          while (s.insert) {
            s.ins_h = HASH(s, s.ins_h, s.window[str3 + MIN_MATCH - 1]);
            s.prev[str3 & s.w_mask] = s.head[s.ins_h];
            s.head[s.ins_h] = str3;
            str3++;
            s.insert--;
            if (s.lookahead + s.insert < MIN_MATCH) {
              break;
            }
          }
        }
      } while (s.lookahead < MIN_LOOKAHEAD && s.strm.avail_in !== 0);
    };
    var deflate_stored = (s, flush) => {
      let min_block = s.pending_buf_size - 5 > s.w_size ? s.w_size : s.pending_buf_size - 5;
      let len2, left, have, last = 0;
      let used = s.strm.avail_in;
      do {
        len2 = 65535;
        have = s.bi_valid + 42 >> 3;
        if (s.strm.avail_out < have) {
          break;
        }
        have = s.strm.avail_out - have;
        left = s.strstart - s.block_start;
        if (len2 > left + s.strm.avail_in) {
          len2 = left + s.strm.avail_in;
        }
        if (len2 > have) {
          len2 = have;
        }
        if (len2 < min_block && (len2 === 0 && flush !== Z_FINISH || flush === Z_NO_FLUSH || len2 !== left + s.strm.avail_in)) {
          break;
        }
        last = flush === Z_FINISH && len2 === left + s.strm.avail_in ? 1 : 0;
        _tr_stored_block(s, 0, 0, last);
        s.pending_buf[s.pending - 4] = len2;
        s.pending_buf[s.pending - 3] = len2 >> 8;
        s.pending_buf[s.pending - 2] = ~len2;
        s.pending_buf[s.pending - 1] = ~len2 >> 8;
        flush_pending(s.strm);
        if (left) {
          if (left > len2) {
            left = len2;
          }
          s.strm.output.set(s.window.subarray(s.block_start, s.block_start + left), s.strm.next_out);
          s.strm.next_out += left;
          s.strm.avail_out -= left;
          s.strm.total_out += left;
          s.block_start += left;
          len2 -= left;
        }
        if (len2) {
          read_buf(s.strm, s.strm.output, s.strm.next_out, len2);
          s.strm.next_out += len2;
          s.strm.avail_out -= len2;
          s.strm.total_out += len2;
        }
      } while (last === 0);
      used -= s.strm.avail_in;
      if (used) {
        if (used >= s.w_size) {
          s.matches = 2;
          s.window.set(s.strm.input.subarray(s.strm.next_in - s.w_size, s.strm.next_in), 0);
          s.strstart = s.w_size;
          s.insert = s.strstart;
        } else {
          if (s.window_size - s.strstart <= used) {
            s.strstart -= s.w_size;
            s.window.set(s.window.subarray(s.w_size, s.w_size + s.strstart), 0);
            if (s.matches < 2) {
              s.matches++;
            }
            if (s.insert > s.strstart) {
              s.insert = s.strstart;
            }
          }
          s.window.set(s.strm.input.subarray(s.strm.next_in - used, s.strm.next_in), s.strstart);
          s.strstart += used;
          s.insert += used > s.w_size - s.insert ? s.w_size - s.insert : used;
        }
        s.block_start = s.strstart;
      }
      if (s.high_water < s.strstart) {
        s.high_water = s.strstart;
      }
      if (last) {
        return BS_FINISH_DONE;
      }
      if (flush !== Z_NO_FLUSH && flush !== Z_FINISH && s.strm.avail_in === 0 && s.strstart === s.block_start) {
        return BS_BLOCK_DONE;
      }
      have = s.window_size - s.strstart;
      if (s.strm.avail_in > have && s.block_start >= s.w_size) {
        s.block_start -= s.w_size;
        s.strstart -= s.w_size;
        s.window.set(s.window.subarray(s.w_size, s.w_size + s.strstart), 0);
        if (s.matches < 2) {
          s.matches++;
        }
        have += s.w_size;
        if (s.insert > s.strstart) {
          s.insert = s.strstart;
        }
      }
      if (have > s.strm.avail_in) {
        have = s.strm.avail_in;
      }
      if (have) {
        read_buf(s.strm, s.window, s.strstart, have);
        s.strstart += have;
        s.insert += have > s.w_size - s.insert ? s.w_size - s.insert : have;
      }
      if (s.high_water < s.strstart) {
        s.high_water = s.strstart;
      }
      have = s.bi_valid + 42 >> 3;
      have = s.pending_buf_size - have > 65535 ? 65535 : s.pending_buf_size - have;
      min_block = have > s.w_size ? s.w_size : have;
      left = s.strstart - s.block_start;
      if (left >= min_block || (left || flush === Z_FINISH) && flush !== Z_NO_FLUSH && s.strm.avail_in === 0 && left <= have) {
        len2 = left > have ? have : left;
        last = flush === Z_FINISH && s.strm.avail_in === 0 && len2 === left ? 1 : 0;
        _tr_stored_block(s, s.block_start, len2, last);
        s.block_start += len2;
        flush_pending(s.strm);
      }
      return last ? BS_FINISH_STARTED : BS_NEED_MORE;
    };
    var deflate_fast = (s, flush) => {
      let hash_head;
      let bflush;
      for (; ; ) {
        if (s.lookahead < MIN_LOOKAHEAD) {
          fill_window(s);
          if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) {
            return BS_NEED_MORE;
          }
          if (s.lookahead === 0) {
            break;
          }
        }
        hash_head = 0;
        if (s.lookahead >= MIN_MATCH) {
          s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH - 1]);
          hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = s.strstart;
        }
        if (hash_head !== 0 && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD) {
          s.match_length = longest_match(s, hash_head);
        }
        if (s.match_length >= MIN_MATCH) {
          bflush = _tr_tally(s, s.strstart - s.match_start, s.match_length - MIN_MATCH);
          s.lookahead -= s.match_length;
          if (s.match_length <= s.max_lazy_match && s.lookahead >= MIN_MATCH) {
            s.match_length--;
            do {
              s.strstart++;
              s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH - 1]);
              hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
              s.head[s.ins_h] = s.strstart;
            } while (--s.match_length !== 0);
            s.strstart++;
          } else {
            s.strstart += s.match_length;
            s.match_length = 0;
            s.ins_h = s.window[s.strstart];
            s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + 1]);
          }
        } else {
          bflush = _tr_tally(s, 0, s.window[s.strstart]);
          s.lookahead--;
          s.strstart++;
        }
        if (bflush) {
          flush_block_only(s, false);
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE;
          }
        }
      }
      s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
      if (flush === Z_FINISH) {
        flush_block_only(s, true);
        if (s.strm.avail_out === 0) {
          return BS_FINISH_STARTED;
        }
        return BS_FINISH_DONE;
      }
      if (s.sym_next) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
      return BS_BLOCK_DONE;
    };
    var deflate_slow = (s, flush) => {
      let hash_head;
      let bflush;
      let max_insert;
      for (; ; ) {
        if (s.lookahead < MIN_LOOKAHEAD) {
          fill_window(s);
          if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) {
            return BS_NEED_MORE;
          }
          if (s.lookahead === 0) {
            break;
          }
        }
        hash_head = 0;
        if (s.lookahead >= MIN_MATCH) {
          s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH - 1]);
          hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = s.strstart;
        }
        s.prev_length = s.match_length;
        s.prev_match = s.match_start;
        s.match_length = MIN_MATCH - 1;
        if (hash_head !== 0 && s.prev_length < s.max_lazy_match && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD) {
          s.match_length = longest_match(s, hash_head);
          if (s.match_length <= 5 && (s.strategy === Z_FILTERED || s.match_length === MIN_MATCH && s.strstart - s.match_start > 4096)) {
            s.match_length = MIN_MATCH - 1;
          }
        }
        if (s.prev_length >= MIN_MATCH && s.match_length <= s.prev_length) {
          max_insert = s.strstart + s.lookahead - MIN_MATCH;
          bflush = _tr_tally(s, s.strstart - 1 - s.prev_match, s.prev_length - MIN_MATCH);
          s.lookahead -= s.prev_length - 1;
          s.prev_length -= 2;
          do {
            if (++s.strstart <= max_insert) {
              s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH - 1]);
              hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
              s.head[s.ins_h] = s.strstart;
            }
          } while (--s.prev_length !== 0);
          s.match_available = 0;
          s.match_length = MIN_MATCH - 1;
          s.strstart++;
          if (bflush) {
            flush_block_only(s, false);
            if (s.strm.avail_out === 0) {
              return BS_NEED_MORE;
            }
          }
        } else if (s.match_available) {
          bflush = _tr_tally(s, 0, s.window[s.strstart - 1]);
          if (bflush) {
            flush_block_only(s, false);
          }
          s.strstart++;
          s.lookahead--;
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE;
          }
        } else {
          s.match_available = 1;
          s.strstart++;
          s.lookahead--;
        }
      }
      if (s.match_available) {
        bflush = _tr_tally(s, 0, s.window[s.strstart - 1]);
        s.match_available = 0;
      }
      s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
      if (flush === Z_FINISH) {
        flush_block_only(s, true);
        if (s.strm.avail_out === 0) {
          return BS_FINISH_STARTED;
        }
        return BS_FINISH_DONE;
      }
      if (s.sym_next) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
      return BS_BLOCK_DONE;
    };
    var deflate_rle = (s, flush) => {
      let bflush;
      let prev;
      let scan, strend;
      const _win = s.window;
      for (; ; ) {
        if (s.lookahead <= MAX_MATCH) {
          fill_window(s);
          if (s.lookahead <= MAX_MATCH && flush === Z_NO_FLUSH) {
            return BS_NEED_MORE;
          }
          if (s.lookahead === 0) {
            break;
          }
        }
        s.match_length = 0;
        if (s.lookahead >= MIN_MATCH && s.strstart > 0) {
          scan = s.strstart - 1;
          prev = _win[scan];
          if (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan]) {
            strend = s.strstart + MAX_MATCH;
            do {
            } while (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && scan < strend);
            s.match_length = MAX_MATCH - (strend - scan);
            if (s.match_length > s.lookahead) {
              s.match_length = s.lookahead;
            }
          }
        }
        if (s.match_length >= MIN_MATCH) {
          bflush = _tr_tally(s, 1, s.match_length - MIN_MATCH);
          s.lookahead -= s.match_length;
          s.strstart += s.match_length;
          s.match_length = 0;
        } else {
          bflush = _tr_tally(s, 0, s.window[s.strstart]);
          s.lookahead--;
          s.strstart++;
        }
        if (bflush) {
          flush_block_only(s, false);
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE;
          }
        }
      }
      s.insert = 0;
      if (flush === Z_FINISH) {
        flush_block_only(s, true);
        if (s.strm.avail_out === 0) {
          return BS_FINISH_STARTED;
        }
        return BS_FINISH_DONE;
      }
      if (s.sym_next) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
      return BS_BLOCK_DONE;
    };
    var deflate_huff = (s, flush) => {
      let bflush;
      for (; ; ) {
        if (s.lookahead === 0) {
          fill_window(s);
          if (s.lookahead === 0) {
            if (flush === Z_NO_FLUSH) {
              return BS_NEED_MORE;
            }
            break;
          }
        }
        s.match_length = 0;
        bflush = _tr_tally(s, 0, s.window[s.strstart]);
        s.lookahead--;
        s.strstart++;
        if (bflush) {
          flush_block_only(s, false);
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE;
          }
        }
      }
      s.insert = 0;
      if (flush === Z_FINISH) {
        flush_block_only(s, true);
        if (s.strm.avail_out === 0) {
          return BS_FINISH_STARTED;
        }
        return BS_FINISH_DONE;
      }
      if (s.sym_next) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
      return BS_BLOCK_DONE;
    };
    function Config(good_length, max_lazy, nice_length, max_chain, func) {
      this.good_length = good_length;
      this.max_lazy = max_lazy;
      this.nice_length = nice_length;
      this.max_chain = max_chain;
      this.func = func;
    }
    var configuration_table = [
      /*      good lazy nice chain */
      new Config(0, 0, 0, 0, deflate_stored),
      /* 0 store only */
      new Config(4, 4, 8, 4, deflate_fast),
      /* 1 max speed, no lazy matches */
      new Config(4, 5, 16, 8, deflate_fast),
      /* 2 */
      new Config(4, 6, 32, 32, deflate_fast),
      /* 3 */
      new Config(4, 4, 16, 16, deflate_slow),
      /* 4 lazy matches */
      new Config(8, 16, 32, 32, deflate_slow),
      /* 5 */
      new Config(8, 16, 128, 128, deflate_slow),
      /* 6 */
      new Config(8, 32, 128, 256, deflate_slow),
      /* 7 */
      new Config(32, 128, 258, 1024, deflate_slow),
      /* 8 */
      new Config(32, 258, 258, 4096, deflate_slow)
      /* 9 max compression */
    ];
    var lm_init = (s) => {
      s.window_size = 2 * s.w_size;
      zero2(s.head);
      s.max_lazy_match = configuration_table[s.level].max_lazy;
      s.good_match = configuration_table[s.level].good_length;
      s.nice_match = configuration_table[s.level].nice_length;
      s.max_chain_length = configuration_table[s.level].max_chain;
      s.strstart = 0;
      s.block_start = 0;
      s.lookahead = 0;
      s.insert = 0;
      s.match_length = s.prev_length = MIN_MATCH - 1;
      s.match_available = 0;
      s.ins_h = 0;
    };
    function DeflateState() {
      this.strm = null;
      this.status = 0;
      this.pending_buf = null;
      this.pending_buf_size = 0;
      this.pending_out = 0;
      this.pending = 0;
      this.wrap = 0;
      this.gzhead = null;
      this.gzindex = 0;
      this.method = Z_DEFLATED;
      this.last_flush = -1;
      this.w_size = 0;
      this.w_bits = 0;
      this.w_mask = 0;
      this.window = null;
      this.window_size = 0;
      this.prev = null;
      this.head = null;
      this.ins_h = 0;
      this.hash_size = 0;
      this.hash_bits = 0;
      this.hash_mask = 0;
      this.hash_shift = 0;
      this.block_start = 0;
      this.match_length = 0;
      this.prev_match = 0;
      this.match_available = 0;
      this.strstart = 0;
      this.match_start = 0;
      this.lookahead = 0;
      this.prev_length = 0;
      this.max_chain_length = 0;
      this.max_lazy_match = 0;
      this.level = 0;
      this.strategy = 0;
      this.good_match = 0;
      this.nice_match = 0;
      this.dyn_ltree = new Uint16Array(HEAP_SIZE * 2);
      this.dyn_dtree = new Uint16Array((2 * D_CODES + 1) * 2);
      this.bl_tree = new Uint16Array((2 * BL_CODES + 1) * 2);
      zero2(this.dyn_ltree);
      zero2(this.dyn_dtree);
      zero2(this.bl_tree);
      this.l_desc = null;
      this.d_desc = null;
      this.bl_desc = null;
      this.bl_count = new Uint16Array(MAX_BITS + 1);
      this.heap = new Uint16Array(2 * L_CODES + 1);
      zero2(this.heap);
      this.heap_len = 0;
      this.heap_max = 0;
      this.depth = new Uint16Array(2 * L_CODES + 1);
      zero2(this.depth);
      this.sym_buf = 0;
      this.lit_bufsize = 0;
      this.sym_next = 0;
      this.sym_end = 0;
      this.opt_len = 0;
      this.static_len = 0;
      this.matches = 0;
      this.insert = 0;
      this.bi_buf = 0;
      this.bi_valid = 0;
    }
    var deflateStateCheck = (strm) => {
      if (!strm) {
        return 1;
      }
      const s = strm.state;
      if (!s || s.strm !== strm || s.status !== INIT_STATE && //#ifdef GZIP
      s.status !== GZIP_STATE && //#endif
      s.status !== EXTRA_STATE && s.status !== NAME_STATE && s.status !== COMMENT_STATE && s.status !== HCRC_STATE && s.status !== BUSY_STATE && s.status !== FINISH_STATE) {
        return 1;
      }
      return 0;
    };
    var deflateResetKeep = (strm) => {
      if (deflateStateCheck(strm)) {
        return err(strm, Z_STREAM_ERROR);
      }
      strm.total_in = strm.total_out = 0;
      strm.data_type = Z_UNKNOWN;
      const s = strm.state;
      s.pending = 0;
      s.pending_out = 0;
      if (s.wrap < 0) {
        s.wrap = -s.wrap;
      }
      s.status = //#ifdef GZIP
      s.wrap === 2 ? GZIP_STATE : (
        //#endif
        s.wrap ? INIT_STATE : BUSY_STATE
      );
      strm.adler = s.wrap === 2 ? 0 : 1;
      s.last_flush = -2;
      _tr_init(s);
      return Z_OK;
    };
    var deflateReset = (strm) => {
      const ret = deflateResetKeep(strm);
      if (ret === Z_OK) {
        lm_init(strm.state);
      }
      return ret;
    };
    var deflateSetHeader = (strm, head) => {
      if (deflateStateCheck(strm) || strm.state.wrap !== 2) {
        return Z_STREAM_ERROR;
      }
      strm.state.gzhead = head;
      return Z_OK;
    };
    var deflateInit2 = (strm, level, method, windowBits, memLevel, strategy) => {
      if (!strm) {
        return Z_STREAM_ERROR;
      }
      let wrap = 1;
      if (level === Z_DEFAULT_COMPRESSION) {
        level = 6;
      }
      if (windowBits < 0) {
        wrap = 0;
        windowBits = -windowBits;
      } else if (windowBits > 15) {
        wrap = 2;
        windowBits -= 16;
      }
      if (memLevel < 1 || memLevel > MAX_MEM_LEVEL || method !== Z_DEFLATED || windowBits < 8 || windowBits > 15 || level < 0 || level > 9 || strategy < 0 || strategy > Z_FIXED || windowBits === 8 && wrap !== 1) {
        return err(strm, Z_STREAM_ERROR);
      }
      if (windowBits === 8) {
        windowBits = 9;
      }
      const s = new DeflateState();
      strm.state = s;
      s.strm = strm;
      s.status = INIT_STATE;
      s.wrap = wrap;
      s.gzhead = null;
      s.w_bits = windowBits;
      s.w_size = 1 << s.w_bits;
      s.w_mask = s.w_size - 1;
      s.hash_bits = memLevel + 7;
      s.hash_size = 1 << s.hash_bits;
      s.hash_mask = s.hash_size - 1;
      s.hash_shift = ~~((s.hash_bits + MIN_MATCH - 1) / MIN_MATCH);
      s.window = new Uint8Array(s.w_size * 2);
      s.head = new Uint16Array(s.hash_size);
      s.prev = new Uint16Array(s.w_size);
      s.lit_bufsize = 1 << memLevel + 6;
      s.pending_buf_size = s.lit_bufsize * 4;
      s.pending_buf = new Uint8Array(s.pending_buf_size);
      s.sym_buf = s.lit_bufsize;
      s.sym_end = (s.lit_bufsize - 1) * 3;
      s.level = level;
      s.strategy = strategy;
      s.method = method;
      return deflateReset(strm);
    };
    var deflateInit = (strm, level) => {
      return deflateInit2(strm, level, Z_DEFLATED, MAX_WBITS, DEF_MEM_LEVEL, Z_DEFAULT_STRATEGY);
    };
    var deflate = (strm, flush) => {
      if (deflateStateCheck(strm) || flush > Z_BLOCK || flush < 0) {
        return strm ? err(strm, Z_STREAM_ERROR) : Z_STREAM_ERROR;
      }
      const s = strm.state;
      if (!strm.output || strm.avail_in !== 0 && !strm.input || s.status === FINISH_STATE && flush !== Z_FINISH) {
        return err(strm, strm.avail_out === 0 ? Z_BUF_ERROR : Z_STREAM_ERROR);
      }
      const old_flush = s.last_flush;
      s.last_flush = flush;
      if (s.pending !== 0) {
        flush_pending(strm);
        if (strm.avail_out === 0) {
          s.last_flush = -1;
          return Z_OK;
        }
      } else if (strm.avail_in === 0 && rank(flush) <= rank(old_flush) && flush !== Z_FINISH) {
        return err(strm, Z_BUF_ERROR);
      }
      if (s.status === FINISH_STATE && strm.avail_in !== 0) {
        return err(strm, Z_BUF_ERROR);
      }
      if (s.status === INIT_STATE && s.wrap === 0) {
        s.status = BUSY_STATE;
      }
      if (s.status === INIT_STATE) {
        let header = Z_DEFLATED + (s.w_bits - 8 << 4) << 8;
        let level_flags = -1;
        if (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2) {
          level_flags = 0;
        } else if (s.level < 6) {
          level_flags = 1;
        } else if (s.level === 6) {
          level_flags = 2;
        } else {
          level_flags = 3;
        }
        header |= level_flags << 6;
        if (s.strstart !== 0) {
          header |= PRESET_DICT;
        }
        header += 31 - header % 31;
        putShortMSB(s, header);
        if (s.strstart !== 0) {
          putShortMSB(s, strm.adler >>> 16);
          putShortMSB(s, strm.adler & 65535);
        }
        strm.adler = 1;
        s.status = BUSY_STATE;
        flush_pending(strm);
        if (s.pending !== 0) {
          s.last_flush = -1;
          return Z_OK;
        }
      }
      if (s.status === GZIP_STATE) {
        strm.adler = 0;
        put_byte(s, 31);
        put_byte(s, 139);
        put_byte(s, 8);
        if (!s.gzhead) {
          put_byte(s, 0);
          put_byte(s, 0);
          put_byte(s, 0);
          put_byte(s, 0);
          put_byte(s, 0);
          put_byte(s, s.level === 9 ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0);
          put_byte(s, OS_CODE);
          s.status = BUSY_STATE;
          flush_pending(strm);
          if (s.pending !== 0) {
            s.last_flush = -1;
            return Z_OK;
          }
        } else {
          put_byte(
            s,
            (s.gzhead.text ? 1 : 0) + (s.gzhead.hcrc ? 2 : 0) + (!s.gzhead.extra ? 0 : 4) + (!s.gzhead.name ? 0 : 8) + (!s.gzhead.comment ? 0 : 16)
          );
          put_byte(s, s.gzhead.time & 255);
          put_byte(s, s.gzhead.time >> 8 & 255);
          put_byte(s, s.gzhead.time >> 16 & 255);
          put_byte(s, s.gzhead.time >> 24 & 255);
          put_byte(s, s.level === 9 ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0);
          put_byte(s, s.gzhead.os & 255);
          if (s.gzhead.extra && s.gzhead.extra.length) {
            put_byte(s, s.gzhead.extra.length & 255);
            put_byte(s, s.gzhead.extra.length >> 8 & 255);
          }
          if (s.gzhead.hcrc) {
            strm.adler = crc32(strm.adler, s.pending_buf, s.pending, 0);
          }
          s.gzindex = 0;
          s.status = EXTRA_STATE;
        }
      }
      if (s.status === EXTRA_STATE) {
        if (s.gzhead.extra) {
          let beg = s.pending;
          let left = (s.gzhead.extra.length & 65535) - s.gzindex;
          while (s.pending + left > s.pending_buf_size) {
            let copy3 = s.pending_buf_size - s.pending;
            s.pending_buf.set(s.gzhead.extra.subarray(s.gzindex, s.gzindex + copy3), s.pending);
            s.pending = s.pending_buf_size;
            if (s.gzhead.hcrc && s.pending > beg) {
              strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
            }
            s.gzindex += copy3;
            flush_pending(strm);
            if (s.pending !== 0) {
              s.last_flush = -1;
              return Z_OK;
            }
            beg = 0;
            left -= copy3;
          }
          let gzhead_extra = new Uint8Array(s.gzhead.extra);
          s.pending_buf.set(gzhead_extra.subarray(s.gzindex, s.gzindex + left), s.pending);
          s.pending += left;
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          s.gzindex = 0;
        }
        s.status = NAME_STATE;
      }
      if (s.status === NAME_STATE) {
        if (s.gzhead.name) {
          let beg = s.pending;
          let val;
          do {
            if (s.pending === s.pending_buf_size) {
              if (s.gzhead.hcrc && s.pending > beg) {
                strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
              }
              flush_pending(strm);
              if (s.pending !== 0) {
                s.last_flush = -1;
                return Z_OK;
              }
              beg = 0;
            }
            if (s.gzindex < s.gzhead.name.length) {
              val = s.gzhead.name.charCodeAt(s.gzindex++) & 255;
            } else {
              val = 0;
            }
            put_byte(s, val);
          } while (val !== 0);
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          s.gzindex = 0;
        }
        s.status = COMMENT_STATE;
      }
      if (s.status === COMMENT_STATE) {
        if (s.gzhead.comment) {
          let beg = s.pending;
          let val;
          do {
            if (s.pending === s.pending_buf_size) {
              if (s.gzhead.hcrc && s.pending > beg) {
                strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
              }
              flush_pending(strm);
              if (s.pending !== 0) {
                s.last_flush = -1;
                return Z_OK;
              }
              beg = 0;
            }
            if (s.gzindex < s.gzhead.comment.length) {
              val = s.gzhead.comment.charCodeAt(s.gzindex++) & 255;
            } else {
              val = 0;
            }
            put_byte(s, val);
          } while (val !== 0);
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
        }
        s.status = HCRC_STATE;
      }
      if (s.status === HCRC_STATE) {
        if (s.gzhead.hcrc) {
          if (s.pending + 2 > s.pending_buf_size) {
            flush_pending(strm);
            if (s.pending !== 0) {
              s.last_flush = -1;
              return Z_OK;
            }
          }
          put_byte(s, strm.adler & 255);
          put_byte(s, strm.adler >> 8 & 255);
          strm.adler = 0;
        }
        s.status = BUSY_STATE;
        flush_pending(strm);
        if (s.pending !== 0) {
          s.last_flush = -1;
          return Z_OK;
        }
      }
      if (strm.avail_in !== 0 || s.lookahead !== 0 || flush !== Z_NO_FLUSH && s.status !== FINISH_STATE) {
        let bstate = s.level === 0 ? deflate_stored(s, flush) : s.strategy === Z_HUFFMAN_ONLY ? deflate_huff(s, flush) : s.strategy === Z_RLE ? deflate_rle(s, flush) : configuration_table[s.level].func(s, flush);
        if (bstate === BS_FINISH_STARTED || bstate === BS_FINISH_DONE) {
          s.status = FINISH_STATE;
        }
        if (bstate === BS_NEED_MORE || bstate === BS_FINISH_STARTED) {
          if (strm.avail_out === 0) {
            s.last_flush = -1;
          }
          return Z_OK;
        }
        if (bstate === BS_BLOCK_DONE) {
          if (flush === Z_PARTIAL_FLUSH) {
            _tr_align(s);
          } else if (flush !== Z_BLOCK) {
            _tr_stored_block(s, 0, 0, false);
            if (flush === Z_FULL_FLUSH) {
              zero2(s.head);
              if (s.lookahead === 0) {
                s.strstart = 0;
                s.block_start = 0;
                s.insert = 0;
              }
            }
          }
          flush_pending(strm);
          if (strm.avail_out === 0) {
            s.last_flush = -1;
            return Z_OK;
          }
        }
      }
      if (flush !== Z_FINISH) {
        return Z_OK;
      }
      if (s.wrap <= 0) {
        return Z_STREAM_END;
      }
      if (s.wrap === 2) {
        put_byte(s, strm.adler & 255);
        put_byte(s, strm.adler >> 8 & 255);
        put_byte(s, strm.adler >> 16 & 255);
        put_byte(s, strm.adler >> 24 & 255);
        put_byte(s, strm.total_in & 255);
        put_byte(s, strm.total_in >> 8 & 255);
        put_byte(s, strm.total_in >> 16 & 255);
        put_byte(s, strm.total_in >> 24 & 255);
      } else {
        putShortMSB(s, strm.adler >>> 16);
        putShortMSB(s, strm.adler & 65535);
      }
      flush_pending(strm);
      if (s.wrap > 0) {
        s.wrap = -s.wrap;
      }
      return s.pending !== 0 ? Z_OK : Z_STREAM_END;
    };
    var deflateEnd = (strm) => {
      if (deflateStateCheck(strm)) {
        return Z_STREAM_ERROR;
      }
      const status = strm.state.status;
      strm.state = null;
      return status === BUSY_STATE ? err(strm, Z_DATA_ERROR) : Z_OK;
    };
    var deflateSetDictionary = (strm, dictionary) => {
      let dictLength = dictionary.length;
      if (deflateStateCheck(strm)) {
        return Z_STREAM_ERROR;
      }
      const s = strm.state;
      const wrap = s.wrap;
      if (wrap === 2 || wrap === 1 && s.status !== INIT_STATE || s.lookahead) {
        return Z_STREAM_ERROR;
      }
      if (wrap === 1) {
        strm.adler = adler32(strm.adler, dictionary, dictLength, 0);
      }
      s.wrap = 0;
      if (dictLength >= s.w_size) {
        if (wrap === 0) {
          zero2(s.head);
          s.strstart = 0;
          s.block_start = 0;
          s.insert = 0;
        }
        let tmpDict = new Uint8Array(s.w_size);
        tmpDict.set(dictionary.subarray(dictLength - s.w_size, dictLength), 0);
        dictionary = tmpDict;
        dictLength = s.w_size;
      }
      const avail = strm.avail_in;
      const next = strm.next_in;
      const input = strm.input;
      strm.avail_in = dictLength;
      strm.next_in = 0;
      strm.input = dictionary;
      fill_window(s);
      while (s.lookahead >= MIN_MATCH) {
        let str3 = s.strstart;
        let n = s.lookahead - (MIN_MATCH - 1);
        do {
          s.ins_h = HASH(s, s.ins_h, s.window[str3 + MIN_MATCH - 1]);
          s.prev[str3 & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = str3;
          str3++;
        } while (--n);
        s.strstart = str3;
        s.lookahead = MIN_MATCH - 1;
        fill_window(s);
      }
      s.strstart += s.lookahead;
      s.block_start = s.strstart;
      s.insert = s.lookahead;
      s.lookahead = 0;
      s.match_length = s.prev_length = MIN_MATCH - 1;
      s.match_available = 0;
      strm.next_in = next;
      strm.input = input;
      strm.avail_in = avail;
      s.wrap = wrap;
      return Z_OK;
    };
    module.exports.deflateInit = deflateInit;
    module.exports.deflateInit2 = deflateInit2;
    module.exports.deflateReset = deflateReset;
    module.exports.deflateResetKeep = deflateResetKeep;
    module.exports.deflateSetHeader = deflateSetHeader;
    module.exports.deflate = deflate;
    module.exports.deflateEnd = deflateEnd;
    module.exports.deflateSetDictionary = deflateSetDictionary;
    module.exports.deflateInfo = "pako deflate (from Nodeca project)";
  }
});

// node_modules/pako/lib/utils/common.js
var require_common = __commonJS({
  "node_modules/pako/lib/utils/common.js"(exports, module) {
    "use strict";
    var _has = (obj, key) => {
      return Object.prototype.hasOwnProperty.call(obj, key);
    };
    module.exports.assign = function(obj) {
      const sources = Array.prototype.slice.call(arguments, 1);
      while (sources.length) {
        const source = sources.shift();
        if (!source) {
          continue;
        }
        if (typeof source !== "object") {
          throw new TypeError(source + "must be non-object");
        }
        for (const p in source) {
          if (_has(source, p)) {
            obj[p] = source[p];
          }
        }
      }
      return obj;
    };
    module.exports.flattenChunks = (chunks) => {
      let len2 = 0;
      for (let i = 0, l = chunks.length; i < l; i++) {
        len2 += chunks[i].length;
      }
      const result = new Uint8Array(len2);
      for (let i = 0, pos = 0, l = chunks.length; i < l; i++) {
        let chunk = chunks[i];
        result.set(chunk, pos);
        pos += chunk.length;
      }
      return result;
    };
  }
});

// node_modules/pako/lib/utils/strings.js
var require_strings = __commonJS({
  "node_modules/pako/lib/utils/strings.js"(exports, module) {
    "use strict";
    var STR_APPLY_UIA_OK = true;
    try {
      String.fromCharCode.apply(null, new Uint8Array(1));
    } catch (__) {
      STR_APPLY_UIA_OK = false;
    }
    var _utf8len = new Uint8Array(256);
    for (let q = 0; q < 256; q++) {
      _utf8len[q] = q >= 252 ? 6 : q >= 248 ? 5 : q >= 240 ? 4 : q >= 224 ? 3 : q >= 192 ? 2 : 1;
    }
    _utf8len[254] = _utf8len[254] = 1;
    module.exports.string2buf = (str3) => {
      if (typeof TextEncoder === "function" && TextEncoder.prototype.encode) {
        return new TextEncoder().encode(str3);
      }
      let buf, c, c2, m_pos, i, str_len = str3.length, buf_len = 0;
      for (m_pos = 0; m_pos < str_len; m_pos++) {
        c = str3.charCodeAt(m_pos);
        if ((c & 64512) === 55296 && m_pos + 1 < str_len) {
          c2 = str3.charCodeAt(m_pos + 1);
          if ((c2 & 64512) === 56320) {
            c = 65536 + (c - 55296 << 10) + (c2 - 56320);
            m_pos++;
          }
        }
        buf_len += c < 128 ? 1 : c < 2048 ? 2 : c < 65536 ? 3 : 4;
      }
      buf = new Uint8Array(buf_len);
      for (i = 0, m_pos = 0; i < buf_len; m_pos++) {
        c = str3.charCodeAt(m_pos);
        if ((c & 64512) === 55296 && m_pos + 1 < str_len) {
          c2 = str3.charCodeAt(m_pos + 1);
          if ((c2 & 64512) === 56320) {
            c = 65536 + (c - 55296 << 10) + (c2 - 56320);
            m_pos++;
          }
        }
        if (c < 128) {
          buf[i++] = c;
        } else if (c < 2048) {
          buf[i++] = 192 | c >>> 6;
          buf[i++] = 128 | c & 63;
        } else if (c < 65536) {
          buf[i++] = 224 | c >>> 12;
          buf[i++] = 128 | c >>> 6 & 63;
          buf[i++] = 128 | c & 63;
        } else {
          buf[i++] = 240 | c >>> 18;
          buf[i++] = 128 | c >>> 12 & 63;
          buf[i++] = 128 | c >>> 6 & 63;
          buf[i++] = 128 | c & 63;
        }
      }
      return buf;
    };
    var buf2binstring = (buf, len2) => {
      if (len2 < 65534) {
        if (buf.subarray && STR_APPLY_UIA_OK) {
          return String.fromCharCode.apply(null, buf.length === len2 ? buf : buf.subarray(0, len2));
        }
      }
      let result = "";
      for (let i = 0; i < len2; i++) {
        result += String.fromCharCode(buf[i]);
      }
      return result;
    };
    module.exports.buf2string = (buf, max2) => {
      const len2 = max2 || buf.length;
      if (typeof TextDecoder === "function" && TextDecoder.prototype.decode) {
        return new TextDecoder().decode(buf.subarray(0, max2));
      }
      let i, out;
      const utf16buf = new Array(len2 * 2);
      for (out = 0, i = 0; i < len2; ) {
        let c = buf[i++];
        if (c < 128) {
          utf16buf[out++] = c;
          continue;
        }
        let c_len = _utf8len[c];
        if (c_len > 4) {
          utf16buf[out++] = 65533;
          i += c_len - 1;
          continue;
        }
        c &= c_len === 2 ? 31 : c_len === 3 ? 15 : 7;
        while (c_len > 1 && i < len2) {
          c = c << 6 | buf[i++] & 63;
          c_len--;
        }
        if (c_len > 1) {
          utf16buf[out++] = 65533;
          continue;
        }
        if (c < 65536) {
          utf16buf[out++] = c;
        } else {
          c -= 65536;
          utf16buf[out++] = 55296 | c >> 10 & 1023;
          utf16buf[out++] = 56320 | c & 1023;
        }
      }
      return buf2binstring(utf16buf, out);
    };
    module.exports.utf8border = (buf, max2) => {
      max2 = max2 || buf.length;
      if (max2 > buf.length) {
        max2 = buf.length;
      }
      let pos = max2 - 1;
      while (pos >= 0 && (buf[pos] & 192) === 128) {
        pos--;
      }
      if (pos < 0) {
        return max2;
      }
      if (pos === 0) {
        return max2;
      }
      return pos + _utf8len[buf[pos]] > max2 ? pos : max2;
    };
  }
});

// node_modules/pako/lib/zlib/zstream.js
var require_zstream = __commonJS({
  "node_modules/pako/lib/zlib/zstream.js"(exports, module) {
    "use strict";
    function ZStream() {
      this.input = null;
      this.next_in = 0;
      this.avail_in = 0;
      this.total_in = 0;
      this.output = null;
      this.next_out = 0;
      this.avail_out = 0;
      this.total_out = 0;
      this.msg = "";
      this.state = null;
      this.data_type = 2;
      this.adler = 0;
    }
    module.exports = ZStream;
  }
});

// node_modules/pako/lib/deflate.js
var require_deflate2 = __commonJS({
  "node_modules/pako/lib/deflate.js"(exports, module) {
    "use strict";
    var zlib_deflate = require_deflate();
    var utils = require_common();
    var strings = require_strings();
    var msg = require_messages();
    var ZStream = require_zstream();
    var toString = Object.prototype.toString;
    var {
      Z_NO_FLUSH,
      Z_SYNC_FLUSH,
      Z_FULL_FLUSH,
      Z_FINISH,
      Z_OK,
      Z_STREAM_END,
      Z_DEFAULT_COMPRESSION,
      Z_DEFAULT_STRATEGY,
      Z_DEFLATED
    } = require_constants();
    function Deflate(options) {
      this.options = utils.assign({
        level: Z_DEFAULT_COMPRESSION,
        method: Z_DEFLATED,
        chunkSize: 16384,
        windowBits: 15,
        memLevel: 8,
        strategy: Z_DEFAULT_STRATEGY
      }, options || {});
      let opt = this.options;
      if (opt.raw && opt.windowBits > 0) {
        opt.windowBits = -opt.windowBits;
      } else if (opt.gzip && opt.windowBits > 0 && opt.windowBits < 16) {
        opt.windowBits += 16;
      }
      this.err = 0;
      this.msg = "";
      this.ended = false;
      this.chunks = [];
      this.strm = new ZStream();
      this.strm.avail_out = 0;
      let status = zlib_deflate.deflateInit2(
        this.strm,
        opt.level,
        opt.method,
        opt.windowBits,
        opt.memLevel,
        opt.strategy
      );
      if (status !== Z_OK) {
        throw new Error(msg[status]);
      }
      if (opt.header) {
        zlib_deflate.deflateSetHeader(this.strm, opt.header);
      }
      if (opt.dictionary) {
        let dict;
        if (typeof opt.dictionary === "string") {
          dict = strings.string2buf(opt.dictionary);
        } else if (toString.call(opt.dictionary) === "[object ArrayBuffer]") {
          dict = new Uint8Array(opt.dictionary);
        } else {
          dict = opt.dictionary;
        }
        status = zlib_deflate.deflateSetDictionary(this.strm, dict);
        if (status !== Z_OK) {
          throw new Error(msg[status]);
        }
        this._dict_set = true;
      }
    }
    Deflate.prototype.push = function(data, flush_mode) {
      const strm = this.strm;
      const chunkSize = this.options.chunkSize;
      let status, _flush_mode;
      if (this.ended) {
        return false;
      }
      if (flush_mode === ~~flush_mode)
        _flush_mode = flush_mode;
      else
        _flush_mode = flush_mode === true ? Z_FINISH : Z_NO_FLUSH;
      if (typeof data === "string") {
        strm.input = strings.string2buf(data);
      } else if (toString.call(data) === "[object ArrayBuffer]") {
        strm.input = new Uint8Array(data);
      } else {
        strm.input = data;
      }
      strm.next_in = 0;
      strm.avail_in = strm.input.length;
      for (; ; ) {
        if (strm.avail_out === 0) {
          strm.output = new Uint8Array(chunkSize);
          strm.next_out = 0;
          strm.avail_out = chunkSize;
        }
        if ((_flush_mode === Z_SYNC_FLUSH || _flush_mode === Z_FULL_FLUSH) && strm.avail_out <= 6) {
          this.onData(strm.output.subarray(0, strm.next_out));
          strm.avail_out = 0;
          continue;
        }
        status = zlib_deflate.deflate(strm, _flush_mode);
        if (status === Z_STREAM_END) {
          if (strm.next_out > 0) {
            this.onData(strm.output.subarray(0, strm.next_out));
          }
          status = zlib_deflate.deflateEnd(this.strm);
          this.onEnd(status);
          this.ended = true;
          return status === Z_OK;
        }
        if (strm.avail_out === 0) {
          this.onData(strm.output);
          continue;
        }
        if (_flush_mode > 0 && strm.next_out > 0) {
          this.onData(strm.output.subarray(0, strm.next_out));
          strm.avail_out = 0;
          continue;
        }
        if (strm.avail_in === 0)
          break;
      }
      return true;
    };
    Deflate.prototype.onData = function(chunk) {
      this.chunks.push(chunk);
    };
    Deflate.prototype.onEnd = function(status) {
      if (status === Z_OK) {
        this.result = utils.flattenChunks(this.chunks);
      }
      this.chunks = [];
      this.err = status;
      this.msg = this.strm.msg;
    };
    function deflate(input, options) {
      const deflator = new Deflate(options);
      deflator.push(input, true);
      if (deflator.err) {
        throw deflator.msg || msg[deflator.err];
      }
      return deflator.result;
    }
    function deflateRaw(input, options) {
      options = options || {};
      options.raw = true;
      return deflate(input, options);
    }
    function gzip(input, options) {
      options = options || {};
      options.gzip = true;
      return deflate(input, options);
    }
    module.exports.Deflate = Deflate;
    module.exports.deflate = deflate;
    module.exports.deflateRaw = deflateRaw;
    module.exports.gzip = gzip;
    module.exports.constants = require_constants();
  }
});

// node_modules/pako/lib/zlib/inffast.js
var require_inffast = __commonJS({
  "node_modules/pako/lib/zlib/inffast.js"(exports, module) {
    "use strict";
    var BAD = 16209;
    var TYPE = 16191;
    module.exports = function inflate_fast(strm, start) {
      let _in;
      let last;
      let _out;
      let beg;
      let end;
      let dmax;
      let wsize;
      let whave;
      let wnext;
      let s_window;
      let hold;
      let bits;
      let lcode;
      let dcode;
      let lmask;
      let dmask;
      let here;
      let op;
      let len2;
      let dist2;
      let from;
      let from_source;
      let input, output;
      const state = strm.state;
      _in = strm.next_in;
      input = strm.input;
      last = _in + (strm.avail_in - 5);
      _out = strm.next_out;
      output = strm.output;
      beg = _out - (start - strm.avail_out);
      end = _out + (strm.avail_out - 257);
      dmax = state.dmax;
      wsize = state.wsize;
      whave = state.whave;
      wnext = state.wnext;
      s_window = state.window;
      hold = state.hold;
      bits = state.bits;
      lcode = state.lencode;
      dcode = state.distcode;
      lmask = (1 << state.lenbits) - 1;
      dmask = (1 << state.distbits) - 1;
      top:
        do {
          if (bits < 15) {
            hold += input[_in++] << bits;
            bits += 8;
            hold += input[_in++] << bits;
            bits += 8;
          }
          here = lcode[hold & lmask];
          dolen:
            for (; ; ) {
              op = here >>> 24;
              hold >>>= op;
              bits -= op;
              op = here >>> 16 & 255;
              if (op === 0) {
                output[_out++] = here & 65535;
              } else if (op & 16) {
                len2 = here & 65535;
                op &= 15;
                if (op) {
                  if (bits < op) {
                    hold += input[_in++] << bits;
                    bits += 8;
                  }
                  len2 += hold & (1 << op) - 1;
                  hold >>>= op;
                  bits -= op;
                }
                if (bits < 15) {
                  hold += input[_in++] << bits;
                  bits += 8;
                  hold += input[_in++] << bits;
                  bits += 8;
                }
                here = dcode[hold & dmask];
                dodist:
                  for (; ; ) {
                    op = here >>> 24;
                    hold >>>= op;
                    bits -= op;
                    op = here >>> 16 & 255;
                    if (op & 16) {
                      dist2 = here & 65535;
                      op &= 15;
                      if (bits < op) {
                        hold += input[_in++] << bits;
                        bits += 8;
                        if (bits < op) {
                          hold += input[_in++] << bits;
                          bits += 8;
                        }
                      }
                      dist2 += hold & (1 << op) - 1;
                      if (dist2 > dmax) {
                        strm.msg = "invalid distance too far back";
                        state.mode = BAD;
                        break top;
                      }
                      hold >>>= op;
                      bits -= op;
                      op = _out - beg;
                      if (dist2 > op) {
                        op = dist2 - op;
                        if (op > whave) {
                          if (state.sane) {
                            strm.msg = "invalid distance too far back";
                            state.mode = BAD;
                            break top;
                          }
                        }
                        from = 0;
                        from_source = s_window;
                        if (wnext === 0) {
                          from += wsize - op;
                          if (op < len2) {
                            len2 -= op;
                            do {
                              output[_out++] = s_window[from++];
                            } while (--op);
                            from = _out - dist2;
                            from_source = output;
                          }
                        } else if (wnext < op) {
                          from += wsize + wnext - op;
                          op -= wnext;
                          if (op < len2) {
                            len2 -= op;
                            do {
                              output[_out++] = s_window[from++];
                            } while (--op);
                            from = 0;
                            if (wnext < len2) {
                              op = wnext;
                              len2 -= op;
                              do {
                                output[_out++] = s_window[from++];
                              } while (--op);
                              from = _out - dist2;
                              from_source = output;
                            }
                          }
                        } else {
                          from += wnext - op;
                          if (op < len2) {
                            len2 -= op;
                            do {
                              output[_out++] = s_window[from++];
                            } while (--op);
                            from = _out - dist2;
                            from_source = output;
                          }
                        }
                        while (len2 > 2) {
                          output[_out++] = from_source[from++];
                          output[_out++] = from_source[from++];
                          output[_out++] = from_source[from++];
                          len2 -= 3;
                        }
                        if (len2) {
                          output[_out++] = from_source[from++];
                          if (len2 > 1) {
                            output[_out++] = from_source[from++];
                          }
                        }
                      } else {
                        from = _out - dist2;
                        do {
                          output[_out++] = output[from++];
                          output[_out++] = output[from++];
                          output[_out++] = output[from++];
                          len2 -= 3;
                        } while (len2 > 2);
                        if (len2) {
                          output[_out++] = output[from++];
                          if (len2 > 1) {
                            output[_out++] = output[from++];
                          }
                        }
                      }
                    } else if ((op & 64) === 0) {
                      here = dcode[(here & 65535) + (hold & (1 << op) - 1)];
                      continue dodist;
                    } else {
                      strm.msg = "invalid distance code";
                      state.mode = BAD;
                      break top;
                    }
                    break;
                  }
              } else if ((op & 64) === 0) {
                here = lcode[(here & 65535) + (hold & (1 << op) - 1)];
                continue dolen;
              } else if (op & 32) {
                state.mode = TYPE;
                break top;
              } else {
                strm.msg = "invalid literal/length code";
                state.mode = BAD;
                break top;
              }
              break;
            }
        } while (_in < last && _out < end);
      len2 = bits >> 3;
      _in -= len2;
      bits -= len2 << 3;
      hold &= (1 << bits) - 1;
      strm.next_in = _in;
      strm.next_out = _out;
      strm.avail_in = _in < last ? 5 + (last - _in) : 5 - (_in - last);
      strm.avail_out = _out < end ? 257 + (end - _out) : 257 - (_out - end);
      state.hold = hold;
      state.bits = bits;
      return;
    };
  }
});

// node_modules/pako/lib/zlib/inftrees.js
var require_inftrees = __commonJS({
  "node_modules/pako/lib/zlib/inftrees.js"(exports, module) {
    "use strict";
    var MAXBITS = 15;
    var ENOUGH_LENS = 852;
    var ENOUGH_DISTS = 592;
    var CODES = 0;
    var LENS = 1;
    var DISTS = 2;
    var lbase = new Uint16Array([
      /* Length codes 257..285 base */
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      13,
      15,
      17,
      19,
      23,
      27,
      31,
      35,
      43,
      51,
      59,
      67,
      83,
      99,
      115,
      131,
      163,
      195,
      227,
      258,
      0,
      0
    ]);
    var lext = new Uint8Array([
      /* Length codes 257..285 extra */
      16,
      16,
      16,
      16,
      16,
      16,
      16,
      16,
      17,
      17,
      17,
      17,
      18,
      18,
      18,
      18,
      19,
      19,
      19,
      19,
      20,
      20,
      20,
      20,
      21,
      21,
      21,
      21,
      16,
      72,
      78
    ]);
    var dbase = new Uint16Array([
      /* Distance codes 0..29 base */
      1,
      2,
      3,
      4,
      5,
      7,
      9,
      13,
      17,
      25,
      33,
      49,
      65,
      97,
      129,
      193,
      257,
      385,
      513,
      769,
      1025,
      1537,
      2049,
      3073,
      4097,
      6145,
      8193,
      12289,
      16385,
      24577,
      0,
      0
    ]);
    var dext = new Uint8Array([
      /* Distance codes 0..29 extra */
      16,
      16,
      16,
      16,
      17,
      17,
      18,
      18,
      19,
      19,
      20,
      20,
      21,
      21,
      22,
      22,
      23,
      23,
      24,
      24,
      25,
      25,
      26,
      26,
      27,
      27,
      28,
      28,
      29,
      29,
      64,
      64
    ]);
    var inflate_table = (type, lens, lens_index, codes, table, table_index, work, opts) => {
      const bits = opts.bits;
      let len2 = 0;
      let sym = 0;
      let min2 = 0, max2 = 0;
      let root = 0;
      let curr = 0;
      let drop = 0;
      let left = 0;
      let used = 0;
      let huff = 0;
      let incr;
      let fill;
      let low;
      let mask;
      let next;
      let base = null;
      let match;
      const count = new Uint16Array(MAXBITS + 1);
      const offs = new Uint16Array(MAXBITS + 1);
      let extra = null;
      let here_bits, here_op, here_val;
      for (len2 = 0; len2 <= MAXBITS; len2++) {
        count[len2] = 0;
      }
      for (sym = 0; sym < codes; sym++) {
        count[lens[lens_index + sym]]++;
      }
      root = bits;
      for (max2 = MAXBITS; max2 >= 1; max2--) {
        if (count[max2] !== 0) {
          break;
        }
      }
      if (root > max2) {
        root = max2;
      }
      if (max2 === 0) {
        table[table_index++] = 1 << 24 | 64 << 16 | 0;
        table[table_index++] = 1 << 24 | 64 << 16 | 0;
        opts.bits = 1;
        return 0;
      }
      for (min2 = 1; min2 < max2; min2++) {
        if (count[min2] !== 0) {
          break;
        }
      }
      if (root < min2) {
        root = min2;
      }
      left = 1;
      for (len2 = 1; len2 <= MAXBITS; len2++) {
        left <<= 1;
        left -= count[len2];
        if (left < 0) {
          return -1;
        }
      }
      if (left > 0 && (type === CODES || max2 !== 1)) {
        return -1;
      }
      offs[1] = 0;
      for (len2 = 1; len2 < MAXBITS; len2++) {
        offs[len2 + 1] = offs[len2] + count[len2];
      }
      for (sym = 0; sym < codes; sym++) {
        if (lens[lens_index + sym] !== 0) {
          work[offs[lens[lens_index + sym]]++] = sym;
        }
      }
      if (type === CODES) {
        base = extra = work;
        match = 20;
      } else if (type === LENS) {
        base = lbase;
        extra = lext;
        match = 257;
      } else {
        base = dbase;
        extra = dext;
        match = 0;
      }
      huff = 0;
      sym = 0;
      len2 = min2;
      next = table_index;
      curr = root;
      drop = 0;
      low = -1;
      used = 1 << root;
      mask = used - 1;
      if (type === LENS && used > ENOUGH_LENS || type === DISTS && used > ENOUGH_DISTS) {
        return 1;
      }
      for (; ; ) {
        here_bits = len2 - drop;
        if (work[sym] + 1 < match) {
          here_op = 0;
          here_val = work[sym];
        } else if (work[sym] >= match) {
          here_op = extra[work[sym] - match];
          here_val = base[work[sym] - match];
        } else {
          here_op = 32 + 64;
          here_val = 0;
        }
        incr = 1 << len2 - drop;
        fill = 1 << curr;
        min2 = fill;
        do {
          fill -= incr;
          table[next + (huff >> drop) + fill] = here_bits << 24 | here_op << 16 | here_val | 0;
        } while (fill !== 0);
        incr = 1 << len2 - 1;
        while (huff & incr) {
          incr >>= 1;
        }
        if (incr !== 0) {
          huff &= incr - 1;
          huff += incr;
        } else {
          huff = 0;
        }
        sym++;
        if (--count[len2] === 0) {
          if (len2 === max2) {
            break;
          }
          len2 = lens[lens_index + work[sym]];
        }
        if (len2 > root && (huff & mask) !== low) {
          if (drop === 0) {
            drop = root;
          }
          next += min2;
          curr = len2 - drop;
          left = 1 << curr;
          while (curr + drop < max2) {
            left -= count[curr + drop];
            if (left <= 0) {
              break;
            }
            curr++;
            left <<= 1;
          }
          used += 1 << curr;
          if (type === LENS && used > ENOUGH_LENS || type === DISTS && used > ENOUGH_DISTS) {
            return 1;
          }
          low = huff & mask;
          table[low] = root << 24 | curr << 16 | next - table_index | 0;
        }
      }
      if (huff !== 0) {
        table[next + huff] = len2 - drop << 24 | 64 << 16 | 0;
      }
      opts.bits = root;
      return 0;
    };
    module.exports = inflate_table;
  }
});

// node_modules/pako/lib/zlib/inflate.js
var require_inflate = __commonJS({
  "node_modules/pako/lib/zlib/inflate.js"(exports, module) {
    "use strict";
    var adler32 = require_adler32();
    var crc32 = require_crc32();
    var inflate_fast = require_inffast();
    var inflate_table = require_inftrees();
    var CODES = 0;
    var LENS = 1;
    var DISTS = 2;
    var {
      Z_FINISH,
      Z_BLOCK,
      Z_TREES,
      Z_OK,
      Z_STREAM_END,
      Z_NEED_DICT,
      Z_STREAM_ERROR,
      Z_DATA_ERROR,
      Z_MEM_ERROR,
      Z_BUF_ERROR,
      Z_DEFLATED
    } = require_constants();
    var HEAD = 16180;
    var FLAGS = 16181;
    var TIME = 16182;
    var OS = 16183;
    var EXLEN = 16184;
    var EXTRA = 16185;
    var NAME = 16186;
    var COMMENT = 16187;
    var HCRC = 16188;
    var DICTID = 16189;
    var DICT = 16190;
    var TYPE = 16191;
    var TYPEDO = 16192;
    var STORED = 16193;
    var COPY_ = 16194;
    var COPY = 16195;
    var TABLE = 16196;
    var LENLENS = 16197;
    var CODELENS = 16198;
    var LEN_ = 16199;
    var LEN = 16200;
    var LENEXT = 16201;
    var DIST = 16202;
    var DISTEXT = 16203;
    var MATCH = 16204;
    var LIT = 16205;
    var CHECK = 16206;
    var LENGTH = 16207;
    var DONE = 16208;
    var BAD = 16209;
    var MEM = 16210;
    var SYNC = 16211;
    var ENOUGH_LENS = 852;
    var ENOUGH_DISTS = 592;
    var MAX_WBITS = 15;
    var DEF_WBITS = MAX_WBITS;
    var zswap32 = (q) => {
      return (q >>> 24 & 255) + (q >>> 8 & 65280) + ((q & 65280) << 8) + ((q & 255) << 24);
    };
    function InflateState() {
      this.strm = null;
      this.mode = 0;
      this.last = false;
      this.wrap = 0;
      this.havedict = false;
      this.flags = 0;
      this.dmax = 0;
      this.check = 0;
      this.total = 0;
      this.head = null;
      this.wbits = 0;
      this.wsize = 0;
      this.whave = 0;
      this.wnext = 0;
      this.window = null;
      this.hold = 0;
      this.bits = 0;
      this.length = 0;
      this.offset = 0;
      this.extra = 0;
      this.lencode = null;
      this.distcode = null;
      this.lenbits = 0;
      this.distbits = 0;
      this.ncode = 0;
      this.nlen = 0;
      this.ndist = 0;
      this.have = 0;
      this.next = null;
      this.lens = new Uint16Array(320);
      this.work = new Uint16Array(288);
      this.lendyn = null;
      this.distdyn = null;
      this.sane = 0;
      this.back = 0;
      this.was = 0;
    }
    var inflateStateCheck = (strm) => {
      if (!strm) {
        return 1;
      }
      const state = strm.state;
      if (!state || state.strm !== strm || state.mode < HEAD || state.mode > SYNC) {
        return 1;
      }
      return 0;
    };
    var inflateResetKeep = (strm) => {
      if (inflateStateCheck(strm)) {
        return Z_STREAM_ERROR;
      }
      const state = strm.state;
      strm.total_in = strm.total_out = state.total = 0;
      strm.msg = "";
      if (state.wrap) {
        strm.adler = state.wrap & 1;
      }
      state.mode = HEAD;
      state.last = 0;
      state.havedict = 0;
      state.flags = -1;
      state.dmax = 32768;
      state.head = null;
      state.hold = 0;
      state.bits = 0;
      state.lencode = state.lendyn = new Int32Array(ENOUGH_LENS);
      state.distcode = state.distdyn = new Int32Array(ENOUGH_DISTS);
      state.sane = 1;
      state.back = -1;
      return Z_OK;
    };
    var inflateReset = (strm) => {
      if (inflateStateCheck(strm)) {
        return Z_STREAM_ERROR;
      }
      const state = strm.state;
      state.wsize = 0;
      state.whave = 0;
      state.wnext = 0;
      return inflateResetKeep(strm);
    };
    var inflateReset2 = (strm, windowBits) => {
      let wrap;
      if (inflateStateCheck(strm)) {
        return Z_STREAM_ERROR;
      }
      const state = strm.state;
      if (windowBits < 0) {
        wrap = 0;
        windowBits = -windowBits;
      } else {
        wrap = (windowBits >> 4) + 5;
        if (windowBits < 48) {
          windowBits &= 15;
        }
      }
      if (windowBits && (windowBits < 8 || windowBits > 15)) {
        return Z_STREAM_ERROR;
      }
      if (state.window !== null && state.wbits !== windowBits) {
        state.window = null;
      }
      state.wrap = wrap;
      state.wbits = windowBits;
      return inflateReset(strm);
    };
    var inflateInit2 = (strm, windowBits) => {
      if (!strm) {
        return Z_STREAM_ERROR;
      }
      const state = new InflateState();
      strm.state = state;
      state.strm = strm;
      state.window = null;
      state.mode = HEAD;
      const ret = inflateReset2(strm, windowBits);
      if (ret !== Z_OK) {
        strm.state = null;
      }
      return ret;
    };
    var inflateInit = (strm) => {
      return inflateInit2(strm, DEF_WBITS);
    };
    var virgin = true;
    var lenfix;
    var distfix;
    var fixedtables = (state) => {
      if (virgin) {
        lenfix = new Int32Array(512);
        distfix = new Int32Array(32);
        let sym = 0;
        while (sym < 144) {
          state.lens[sym++] = 8;
        }
        while (sym < 256) {
          state.lens[sym++] = 9;
        }
        while (sym < 280) {
          state.lens[sym++] = 7;
        }
        while (sym < 288) {
          state.lens[sym++] = 8;
        }
        inflate_table(LENS, state.lens, 0, 288, lenfix, 0, state.work, { bits: 9 });
        sym = 0;
        while (sym < 32) {
          state.lens[sym++] = 5;
        }
        inflate_table(DISTS, state.lens, 0, 32, distfix, 0, state.work, { bits: 5 });
        virgin = false;
      }
      state.lencode = lenfix;
      state.lenbits = 9;
      state.distcode = distfix;
      state.distbits = 5;
    };
    var updatewindow = (strm, src, end, copy3) => {
      let dist2;
      const state = strm.state;
      if (state.window === null) {
        state.wsize = 1 << state.wbits;
        state.wnext = 0;
        state.whave = 0;
        state.window = new Uint8Array(state.wsize);
      }
      if (copy3 >= state.wsize) {
        state.window.set(src.subarray(end - state.wsize, end), 0);
        state.wnext = 0;
        state.whave = state.wsize;
      } else {
        dist2 = state.wsize - state.wnext;
        if (dist2 > copy3) {
          dist2 = copy3;
        }
        state.window.set(src.subarray(end - copy3, end - copy3 + dist2), state.wnext);
        copy3 -= dist2;
        if (copy3) {
          state.window.set(src.subarray(end - copy3, end), 0);
          state.wnext = copy3;
          state.whave = state.wsize;
        } else {
          state.wnext += dist2;
          if (state.wnext === state.wsize) {
            state.wnext = 0;
          }
          if (state.whave < state.wsize) {
            state.whave += dist2;
          }
        }
      }
      return 0;
    };
    var inflate = (strm, flush) => {
      let state;
      let input, output;
      let next;
      let put;
      let have, left;
      let hold;
      let bits;
      let _in, _out;
      let copy3;
      let from;
      let from_source;
      let here = 0;
      let here_bits, here_op, here_val;
      let last_bits, last_op, last_val;
      let len2;
      let ret;
      const hbuf = new Uint8Array(4);
      let opts;
      let n;
      const order = (
        /* permutation of code lengths */
        new Uint8Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15])
      );
      if (inflateStateCheck(strm) || !strm.output || !strm.input && strm.avail_in !== 0) {
        return Z_STREAM_ERROR;
      }
      state = strm.state;
      if (state.mode === TYPE) {
        state.mode = TYPEDO;
      }
      put = strm.next_out;
      output = strm.output;
      left = strm.avail_out;
      next = strm.next_in;
      input = strm.input;
      have = strm.avail_in;
      hold = state.hold;
      bits = state.bits;
      _in = have;
      _out = left;
      ret = Z_OK;
      inf_leave:
        for (; ; ) {
          switch (state.mode) {
            case HEAD:
              if (state.wrap === 0) {
                state.mode = TYPEDO;
                break;
              }
              while (bits < 16) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if (state.wrap & 2 && hold === 35615) {
                if (state.wbits === 0) {
                  state.wbits = 15;
                }
                state.check = 0;
                hbuf[0] = hold & 255;
                hbuf[1] = hold >>> 8 & 255;
                state.check = crc32(state.check, hbuf, 2, 0);
                hold = 0;
                bits = 0;
                state.mode = FLAGS;
                break;
              }
              if (state.head) {
                state.head.done = false;
              }
              if (!(state.wrap & 1) || /* check if zlib header allowed */
              (((hold & 255) << 8) + (hold >> 8)) % 31) {
                strm.msg = "incorrect header check";
                state.mode = BAD;
                break;
              }
              if ((hold & 15) !== Z_DEFLATED) {
                strm.msg = "unknown compression method";
                state.mode = BAD;
                break;
              }
              hold >>>= 4;
              bits -= 4;
              len2 = (hold & 15) + 8;
              if (state.wbits === 0) {
                state.wbits = len2;
              }
              if (len2 > 15 || len2 > state.wbits) {
                strm.msg = "invalid window size";
                state.mode = BAD;
                break;
              }
              state.dmax = 1 << state.wbits;
              state.flags = 0;
              strm.adler = state.check = 1;
              state.mode = hold & 512 ? DICTID : TYPE;
              hold = 0;
              bits = 0;
              break;
            case FLAGS:
              while (bits < 16) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              state.flags = hold;
              if ((state.flags & 255) !== Z_DEFLATED) {
                strm.msg = "unknown compression method";
                state.mode = BAD;
                break;
              }
              if (state.flags & 57344) {
                strm.msg = "unknown header flags set";
                state.mode = BAD;
                break;
              }
              if (state.head) {
                state.head.text = hold >> 8 & 1;
              }
              if (state.flags & 512 && state.wrap & 4) {
                hbuf[0] = hold & 255;
                hbuf[1] = hold >>> 8 & 255;
                state.check = crc32(state.check, hbuf, 2, 0);
              }
              hold = 0;
              bits = 0;
              state.mode = TIME;
            case TIME:
              while (bits < 32) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if (state.head) {
                state.head.time = hold;
              }
              if (state.flags & 512 && state.wrap & 4) {
                hbuf[0] = hold & 255;
                hbuf[1] = hold >>> 8 & 255;
                hbuf[2] = hold >>> 16 & 255;
                hbuf[3] = hold >>> 24 & 255;
                state.check = crc32(state.check, hbuf, 4, 0);
              }
              hold = 0;
              bits = 0;
              state.mode = OS;
            case OS:
              while (bits < 16) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if (state.head) {
                state.head.xflags = hold & 255;
                state.head.os = hold >> 8;
              }
              if (state.flags & 512 && state.wrap & 4) {
                hbuf[0] = hold & 255;
                hbuf[1] = hold >>> 8 & 255;
                state.check = crc32(state.check, hbuf, 2, 0);
              }
              hold = 0;
              bits = 0;
              state.mode = EXLEN;
            case EXLEN:
              if (state.flags & 1024) {
                while (bits < 16) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                state.length = hold;
                if (state.head) {
                  state.head.extra_len = hold;
                }
                if (state.flags & 512 && state.wrap & 4) {
                  hbuf[0] = hold & 255;
                  hbuf[1] = hold >>> 8 & 255;
                  state.check = crc32(state.check, hbuf, 2, 0);
                }
                hold = 0;
                bits = 0;
              } else if (state.head) {
                state.head.extra = null;
              }
              state.mode = EXTRA;
            case EXTRA:
              if (state.flags & 1024) {
                copy3 = state.length;
                if (copy3 > have) {
                  copy3 = have;
                }
                if (copy3) {
                  if (state.head) {
                    len2 = state.head.extra_len - state.length;
                    if (!state.head.extra) {
                      state.head.extra = new Uint8Array(state.head.extra_len);
                    }
                    state.head.extra.set(
                      input.subarray(
                        next,
                        // extra field is limited to 65536 bytes
                        // - no need for additional size check
                        next + copy3
                      ),
                      /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
                      len2
                    );
                  }
                  if (state.flags & 512 && state.wrap & 4) {
                    state.check = crc32(state.check, input, copy3, next);
                  }
                  have -= copy3;
                  next += copy3;
                  state.length -= copy3;
                }
                if (state.length) {
                  break inf_leave;
                }
              }
              state.length = 0;
              state.mode = NAME;
            case NAME:
              if (state.flags & 2048) {
                if (have === 0) {
                  break inf_leave;
                }
                copy3 = 0;
                do {
                  len2 = input[next + copy3++];
                  if (state.head && len2 && state.length < 65536) {
                    state.head.name += String.fromCharCode(len2);
                  }
                } while (len2 && copy3 < have);
                if (state.flags & 512 && state.wrap & 4) {
                  state.check = crc32(state.check, input, copy3, next);
                }
                have -= copy3;
                next += copy3;
                if (len2) {
                  break inf_leave;
                }
              } else if (state.head) {
                state.head.name = null;
              }
              state.length = 0;
              state.mode = COMMENT;
            case COMMENT:
              if (state.flags & 4096) {
                if (have === 0) {
                  break inf_leave;
                }
                copy3 = 0;
                do {
                  len2 = input[next + copy3++];
                  if (state.head && len2 && state.length < 65536) {
                    state.head.comment += String.fromCharCode(len2);
                  }
                } while (len2 && copy3 < have);
                if (state.flags & 512 && state.wrap & 4) {
                  state.check = crc32(state.check, input, copy3, next);
                }
                have -= copy3;
                next += copy3;
                if (len2) {
                  break inf_leave;
                }
              } else if (state.head) {
                state.head.comment = null;
              }
              state.mode = HCRC;
            case HCRC:
              if (state.flags & 512) {
                while (bits < 16) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                if (state.wrap & 4 && hold !== (state.check & 65535)) {
                  strm.msg = "header crc mismatch";
                  state.mode = BAD;
                  break;
                }
                hold = 0;
                bits = 0;
              }
              if (state.head) {
                state.head.hcrc = state.flags >> 9 & 1;
                state.head.done = true;
              }
              strm.adler = state.check = 0;
              state.mode = TYPE;
              break;
            case DICTID:
              while (bits < 32) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              strm.adler = state.check = zswap32(hold);
              hold = 0;
              bits = 0;
              state.mode = DICT;
            case DICT:
              if (state.havedict === 0) {
                strm.next_out = put;
                strm.avail_out = left;
                strm.next_in = next;
                strm.avail_in = have;
                state.hold = hold;
                state.bits = bits;
                return Z_NEED_DICT;
              }
              strm.adler = state.check = 1;
              state.mode = TYPE;
            case TYPE:
              if (flush === Z_BLOCK || flush === Z_TREES) {
                break inf_leave;
              }
            case TYPEDO:
              if (state.last) {
                hold >>>= bits & 7;
                bits -= bits & 7;
                state.mode = CHECK;
                break;
              }
              while (bits < 3) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              state.last = hold & 1;
              hold >>>= 1;
              bits -= 1;
              switch (hold & 3) {
                case 0:
                  state.mode = STORED;
                  break;
                case 1:
                  fixedtables(state);
                  state.mode = LEN_;
                  if (flush === Z_TREES) {
                    hold >>>= 2;
                    bits -= 2;
                    break inf_leave;
                  }
                  break;
                case 2:
                  state.mode = TABLE;
                  break;
                case 3:
                  strm.msg = "invalid block type";
                  state.mode = BAD;
              }
              hold >>>= 2;
              bits -= 2;
              break;
            case STORED:
              hold >>>= bits & 7;
              bits -= bits & 7;
              while (bits < 32) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if ((hold & 65535) !== (hold >>> 16 ^ 65535)) {
                strm.msg = "invalid stored block lengths";
                state.mode = BAD;
                break;
              }
              state.length = hold & 65535;
              hold = 0;
              bits = 0;
              state.mode = COPY_;
              if (flush === Z_TREES) {
                break inf_leave;
              }
            case COPY_:
              state.mode = COPY;
            case COPY:
              copy3 = state.length;
              if (copy3) {
                if (copy3 > have) {
                  copy3 = have;
                }
                if (copy3 > left) {
                  copy3 = left;
                }
                if (copy3 === 0) {
                  break inf_leave;
                }
                output.set(input.subarray(next, next + copy3), put);
                have -= copy3;
                next += copy3;
                left -= copy3;
                put += copy3;
                state.length -= copy3;
                break;
              }
              state.mode = TYPE;
              break;
            case TABLE:
              while (bits < 14) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              state.nlen = (hold & 31) + 257;
              hold >>>= 5;
              bits -= 5;
              state.ndist = (hold & 31) + 1;
              hold >>>= 5;
              bits -= 5;
              state.ncode = (hold & 15) + 4;
              hold >>>= 4;
              bits -= 4;
              if (state.nlen > 286 || state.ndist > 30) {
                strm.msg = "too many length or distance symbols";
                state.mode = BAD;
                break;
              }
              state.have = 0;
              state.mode = LENLENS;
            case LENLENS:
              while (state.have < state.ncode) {
                while (bits < 3) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                state.lens[order[state.have++]] = hold & 7;
                hold >>>= 3;
                bits -= 3;
              }
              while (state.have < 19) {
                state.lens[order[state.have++]] = 0;
              }
              state.lencode = state.lendyn;
              state.lenbits = 7;
              opts = { bits: state.lenbits };
              ret = inflate_table(CODES, state.lens, 0, 19, state.lencode, 0, state.work, opts);
              state.lenbits = opts.bits;
              if (ret) {
                strm.msg = "invalid code lengths set";
                state.mode = BAD;
                break;
              }
              state.have = 0;
              state.mode = CODELENS;
            case CODELENS:
              while (state.have < state.nlen + state.ndist) {
                for (; ; ) {
                  here = state.lencode[hold & (1 << state.lenbits) - 1];
                  here_bits = here >>> 24;
                  here_op = here >>> 16 & 255;
                  here_val = here & 65535;
                  if (here_bits <= bits) {
                    break;
                  }
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                if (here_val < 16) {
                  hold >>>= here_bits;
                  bits -= here_bits;
                  state.lens[state.have++] = here_val;
                } else {
                  if (here_val === 16) {
                    n = here_bits + 2;
                    while (bits < n) {
                      if (have === 0) {
                        break inf_leave;
                      }
                      have--;
                      hold += input[next++] << bits;
                      bits += 8;
                    }
                    hold >>>= here_bits;
                    bits -= here_bits;
                    if (state.have === 0) {
                      strm.msg = "invalid bit length repeat";
                      state.mode = BAD;
                      break;
                    }
                    len2 = state.lens[state.have - 1];
                    copy3 = 3 + (hold & 3);
                    hold >>>= 2;
                    bits -= 2;
                  } else if (here_val === 17) {
                    n = here_bits + 3;
                    while (bits < n) {
                      if (have === 0) {
                        break inf_leave;
                      }
                      have--;
                      hold += input[next++] << bits;
                      bits += 8;
                    }
                    hold >>>= here_bits;
                    bits -= here_bits;
                    len2 = 0;
                    copy3 = 3 + (hold & 7);
                    hold >>>= 3;
                    bits -= 3;
                  } else {
                    n = here_bits + 7;
                    while (bits < n) {
                      if (have === 0) {
                        break inf_leave;
                      }
                      have--;
                      hold += input[next++] << bits;
                      bits += 8;
                    }
                    hold >>>= here_bits;
                    bits -= here_bits;
                    len2 = 0;
                    copy3 = 11 + (hold & 127);
                    hold >>>= 7;
                    bits -= 7;
                  }
                  if (state.have + copy3 > state.nlen + state.ndist) {
                    strm.msg = "invalid bit length repeat";
                    state.mode = BAD;
                    break;
                  }
                  while (copy3--) {
                    state.lens[state.have++] = len2;
                  }
                }
              }
              if (state.mode === BAD) {
                break;
              }
              if (state.lens[256] === 0) {
                strm.msg = "invalid code -- missing end-of-block";
                state.mode = BAD;
                break;
              }
              state.lenbits = 9;
              opts = { bits: state.lenbits };
              ret = inflate_table(LENS, state.lens, 0, state.nlen, state.lencode, 0, state.work, opts);
              state.lenbits = opts.bits;
              if (ret) {
                strm.msg = "invalid literal/lengths set";
                state.mode = BAD;
                break;
              }
              state.distbits = 6;
              state.distcode = state.distdyn;
              opts = { bits: state.distbits };
              ret = inflate_table(DISTS, state.lens, state.nlen, state.ndist, state.distcode, 0, state.work, opts);
              state.distbits = opts.bits;
              if (ret) {
                strm.msg = "invalid distances set";
                state.mode = BAD;
                break;
              }
              state.mode = LEN_;
              if (flush === Z_TREES) {
                break inf_leave;
              }
            case LEN_:
              state.mode = LEN;
            case LEN:
              if (have >= 6 && left >= 258) {
                strm.next_out = put;
                strm.avail_out = left;
                strm.next_in = next;
                strm.avail_in = have;
                state.hold = hold;
                state.bits = bits;
                inflate_fast(strm, _out);
                put = strm.next_out;
                output = strm.output;
                left = strm.avail_out;
                next = strm.next_in;
                input = strm.input;
                have = strm.avail_in;
                hold = state.hold;
                bits = state.bits;
                if (state.mode === TYPE) {
                  state.back = -1;
                }
                break;
              }
              state.back = 0;
              for (; ; ) {
                here = state.lencode[hold & (1 << state.lenbits) - 1];
                here_bits = here >>> 24;
                here_op = here >>> 16 & 255;
                here_val = here & 65535;
                if (here_bits <= bits) {
                  break;
                }
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if (here_op && (here_op & 240) === 0) {
                last_bits = here_bits;
                last_op = here_op;
                last_val = here_val;
                for (; ; ) {
                  here = state.lencode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];
                  here_bits = here >>> 24;
                  here_op = here >>> 16 & 255;
                  here_val = here & 65535;
                  if (last_bits + here_bits <= bits) {
                    break;
                  }
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                hold >>>= last_bits;
                bits -= last_bits;
                state.back += last_bits;
              }
              hold >>>= here_bits;
              bits -= here_bits;
              state.back += here_bits;
              state.length = here_val;
              if (here_op === 0) {
                state.mode = LIT;
                break;
              }
              if (here_op & 32) {
                state.back = -1;
                state.mode = TYPE;
                break;
              }
              if (here_op & 64) {
                strm.msg = "invalid literal/length code";
                state.mode = BAD;
                break;
              }
              state.extra = here_op & 15;
              state.mode = LENEXT;
            case LENEXT:
              if (state.extra) {
                n = state.extra;
                while (bits < n) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                state.length += hold & (1 << state.extra) - 1;
                hold >>>= state.extra;
                bits -= state.extra;
                state.back += state.extra;
              }
              state.was = state.length;
              state.mode = DIST;
            case DIST:
              for (; ; ) {
                here = state.distcode[hold & (1 << state.distbits) - 1];
                here_bits = here >>> 24;
                here_op = here >>> 16 & 255;
                here_val = here & 65535;
                if (here_bits <= bits) {
                  break;
                }
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if ((here_op & 240) === 0) {
                last_bits = here_bits;
                last_op = here_op;
                last_val = here_val;
                for (; ; ) {
                  here = state.distcode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];
                  here_bits = here >>> 24;
                  here_op = here >>> 16 & 255;
                  here_val = here & 65535;
                  if (last_bits + here_bits <= bits) {
                    break;
                  }
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                hold >>>= last_bits;
                bits -= last_bits;
                state.back += last_bits;
              }
              hold >>>= here_bits;
              bits -= here_bits;
              state.back += here_bits;
              if (here_op & 64) {
                strm.msg = "invalid distance code";
                state.mode = BAD;
                break;
              }
              state.offset = here_val;
              state.extra = here_op & 15;
              state.mode = DISTEXT;
            case DISTEXT:
              if (state.extra) {
                n = state.extra;
                while (bits < n) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                state.offset += hold & (1 << state.extra) - 1;
                hold >>>= state.extra;
                bits -= state.extra;
                state.back += state.extra;
              }
              if (state.offset > state.dmax) {
                strm.msg = "invalid distance too far back";
                state.mode = BAD;
                break;
              }
              state.mode = MATCH;
            case MATCH:
              if (left === 0) {
                break inf_leave;
              }
              copy3 = _out - left;
              if (state.offset > copy3) {
                copy3 = state.offset - copy3;
                if (copy3 > state.whave) {
                  if (state.sane) {
                    strm.msg = "invalid distance too far back";
                    state.mode = BAD;
                    break;
                  }
                }
                if (copy3 > state.wnext) {
                  copy3 -= state.wnext;
                  from = state.wsize - copy3;
                } else {
                  from = state.wnext - copy3;
                }
                if (copy3 > state.length) {
                  copy3 = state.length;
                }
                from_source = state.window;
              } else {
                from_source = output;
                from = put - state.offset;
                copy3 = state.length;
              }
              if (copy3 > left) {
                copy3 = left;
              }
              left -= copy3;
              state.length -= copy3;
              do {
                output[put++] = from_source[from++];
              } while (--copy3);
              if (state.length === 0) {
                state.mode = LEN;
              }
              break;
            case LIT:
              if (left === 0) {
                break inf_leave;
              }
              output[put++] = state.length;
              left--;
              state.mode = LEN;
              break;
            case CHECK:
              if (state.wrap) {
                while (bits < 32) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold |= input[next++] << bits;
                  bits += 8;
                }
                _out -= left;
                strm.total_out += _out;
                state.total += _out;
                if (state.wrap & 4 && _out) {
                  strm.adler = state.check = /*UPDATE_CHECK(state.check, put - _out, _out);*/
                  state.flags ? crc32(state.check, output, _out, put - _out) : adler32(state.check, output, _out, put - _out);
                }
                _out = left;
                if (state.wrap & 4 && (state.flags ? hold : zswap32(hold)) !== state.check) {
                  strm.msg = "incorrect data check";
                  state.mode = BAD;
                  break;
                }
                hold = 0;
                bits = 0;
              }
              state.mode = LENGTH;
            case LENGTH:
              if (state.wrap && state.flags) {
                while (bits < 32) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                if (state.wrap & 4 && hold !== (state.total & 4294967295)) {
                  strm.msg = "incorrect length check";
                  state.mode = BAD;
                  break;
                }
                hold = 0;
                bits = 0;
              }
              state.mode = DONE;
            case DONE:
              ret = Z_STREAM_END;
              break inf_leave;
            case BAD:
              ret = Z_DATA_ERROR;
              break inf_leave;
            case MEM:
              return Z_MEM_ERROR;
            case SYNC:
            default:
              return Z_STREAM_ERROR;
          }
        }
      strm.next_out = put;
      strm.avail_out = left;
      strm.next_in = next;
      strm.avail_in = have;
      state.hold = hold;
      state.bits = bits;
      if (state.wsize || _out !== strm.avail_out && state.mode < BAD && (state.mode < CHECK || flush !== Z_FINISH)) {
        if (updatewindow(strm, strm.output, strm.next_out, _out - strm.avail_out)) {
          state.mode = MEM;
          return Z_MEM_ERROR;
        }
      }
      _in -= strm.avail_in;
      _out -= strm.avail_out;
      strm.total_in += _in;
      strm.total_out += _out;
      state.total += _out;
      if (state.wrap & 4 && _out) {
        strm.adler = state.check = /*UPDATE_CHECK(state.check, strm.next_out - _out, _out);*/
        state.flags ? crc32(state.check, output, _out, strm.next_out - _out) : adler32(state.check, output, _out, strm.next_out - _out);
      }
      strm.data_type = state.bits + (state.last ? 64 : 0) + (state.mode === TYPE ? 128 : 0) + (state.mode === LEN_ || state.mode === COPY_ ? 256 : 0);
      if ((_in === 0 && _out === 0 || flush === Z_FINISH) && ret === Z_OK) {
        ret = Z_BUF_ERROR;
      }
      return ret;
    };
    var inflateEnd = (strm) => {
      if (inflateStateCheck(strm)) {
        return Z_STREAM_ERROR;
      }
      let state = strm.state;
      if (state.window) {
        state.window = null;
      }
      strm.state = null;
      return Z_OK;
    };
    var inflateGetHeader = (strm, head) => {
      if (inflateStateCheck(strm)) {
        return Z_STREAM_ERROR;
      }
      const state = strm.state;
      if ((state.wrap & 2) === 0) {
        return Z_STREAM_ERROR;
      }
      state.head = head;
      head.done = false;
      return Z_OK;
    };
    var inflateSetDictionary = (strm, dictionary) => {
      const dictLength = dictionary.length;
      let state;
      let dictid;
      let ret;
      if (inflateStateCheck(strm)) {
        return Z_STREAM_ERROR;
      }
      state = strm.state;
      if (state.wrap !== 0 && state.mode !== DICT) {
        return Z_STREAM_ERROR;
      }
      if (state.mode === DICT) {
        dictid = 1;
        dictid = adler32(dictid, dictionary, dictLength, 0);
        if (dictid !== state.check) {
          return Z_DATA_ERROR;
        }
      }
      ret = updatewindow(strm, dictionary, dictLength, dictLength);
      if (ret) {
        state.mode = MEM;
        return Z_MEM_ERROR;
      }
      state.havedict = 1;
      return Z_OK;
    };
    module.exports.inflateReset = inflateReset;
    module.exports.inflateReset2 = inflateReset2;
    module.exports.inflateResetKeep = inflateResetKeep;
    module.exports.inflateInit = inflateInit;
    module.exports.inflateInit2 = inflateInit2;
    module.exports.inflate = inflate;
    module.exports.inflateEnd = inflateEnd;
    module.exports.inflateGetHeader = inflateGetHeader;
    module.exports.inflateSetDictionary = inflateSetDictionary;
    module.exports.inflateInfo = "pako inflate (from Nodeca project)";
  }
});

// node_modules/pako/lib/zlib/gzheader.js
var require_gzheader = __commonJS({
  "node_modules/pako/lib/zlib/gzheader.js"(exports, module) {
    "use strict";
    function GZheader() {
      this.text = 0;
      this.time = 0;
      this.xflags = 0;
      this.os = 0;
      this.extra = null;
      this.extra_len = 0;
      this.name = "";
      this.comment = "";
      this.hcrc = 0;
      this.done = false;
    }
    module.exports = GZheader;
  }
});

// node_modules/pako/lib/inflate.js
var require_inflate2 = __commonJS({
  "node_modules/pako/lib/inflate.js"(exports, module) {
    "use strict";
    var zlib_inflate = require_inflate();
    var utils = require_common();
    var strings = require_strings();
    var msg = require_messages();
    var ZStream = require_zstream();
    var GZheader = require_gzheader();
    var toString = Object.prototype.toString;
    var {
      Z_NO_FLUSH,
      Z_FINISH,
      Z_OK,
      Z_STREAM_END,
      Z_NEED_DICT,
      Z_STREAM_ERROR,
      Z_DATA_ERROR,
      Z_MEM_ERROR
    } = require_constants();
    function Inflate(options) {
      this.options = utils.assign({
        chunkSize: 1024 * 64,
        windowBits: 15,
        to: ""
      }, options || {});
      const opt = this.options;
      if (opt.raw && opt.windowBits >= 0 && opt.windowBits < 16) {
        opt.windowBits = -opt.windowBits;
        if (opt.windowBits === 0) {
          opt.windowBits = -15;
        }
      }
      if (opt.windowBits >= 0 && opt.windowBits < 16 && !(options && options.windowBits)) {
        opt.windowBits += 32;
      }
      if (opt.windowBits > 15 && opt.windowBits < 48) {
        if ((opt.windowBits & 15) === 0) {
          opt.windowBits |= 15;
        }
      }
      this.err = 0;
      this.msg = "";
      this.ended = false;
      this.chunks = [];
      this.strm = new ZStream();
      this.strm.avail_out = 0;
      let status = zlib_inflate.inflateInit2(
        this.strm,
        opt.windowBits
      );
      if (status !== Z_OK) {
        throw new Error(msg[status]);
      }
      this.header = new GZheader();
      zlib_inflate.inflateGetHeader(this.strm, this.header);
      if (opt.dictionary) {
        if (typeof opt.dictionary === "string") {
          opt.dictionary = strings.string2buf(opt.dictionary);
        } else if (toString.call(opt.dictionary) === "[object ArrayBuffer]") {
          opt.dictionary = new Uint8Array(opt.dictionary);
        }
        if (opt.raw) {
          status = zlib_inflate.inflateSetDictionary(this.strm, opt.dictionary);
          if (status !== Z_OK) {
            throw new Error(msg[status]);
          }
        }
      }
    }
    Inflate.prototype.push = function(data, flush_mode) {
      const strm = this.strm;
      const chunkSize = this.options.chunkSize;
      const dictionary = this.options.dictionary;
      let status, _flush_mode, last_avail_out;
      if (this.ended)
        return false;
      if (flush_mode === ~~flush_mode)
        _flush_mode = flush_mode;
      else
        _flush_mode = flush_mode === true ? Z_FINISH : Z_NO_FLUSH;
      if (toString.call(data) === "[object ArrayBuffer]") {
        strm.input = new Uint8Array(data);
      } else {
        strm.input = data;
      }
      strm.next_in = 0;
      strm.avail_in = strm.input.length;
      for (; ; ) {
        if (strm.avail_out === 0) {
          strm.output = new Uint8Array(chunkSize);
          strm.next_out = 0;
          strm.avail_out = chunkSize;
        }
        status = zlib_inflate.inflate(strm, _flush_mode);
        if (status === Z_NEED_DICT && dictionary) {
          status = zlib_inflate.inflateSetDictionary(strm, dictionary);
          if (status === Z_OK) {
            status = zlib_inflate.inflate(strm, _flush_mode);
          } else if (status === Z_DATA_ERROR) {
            status = Z_NEED_DICT;
          }
        }
        while (strm.avail_in > 0 && status === Z_STREAM_END && strm.state.wrap > 0 && data[strm.next_in] !== 0) {
          zlib_inflate.inflateReset(strm);
          status = zlib_inflate.inflate(strm, _flush_mode);
        }
        switch (status) {
          case Z_STREAM_ERROR:
          case Z_DATA_ERROR:
          case Z_NEED_DICT:
          case Z_MEM_ERROR:
            this.onEnd(status);
            this.ended = true;
            return false;
        }
        last_avail_out = strm.avail_out;
        if (strm.next_out) {
          if (strm.avail_out === 0 || status === Z_STREAM_END) {
            if (this.options.to === "string") {
              let next_out_utf8 = strings.utf8border(strm.output, strm.next_out);
              let tail = strm.next_out - next_out_utf8;
              let utf8str = strings.buf2string(strm.output, next_out_utf8);
              strm.next_out = tail;
              strm.avail_out = chunkSize - tail;
              if (tail)
                strm.output.set(strm.output.subarray(next_out_utf8, next_out_utf8 + tail), 0);
              this.onData(utf8str);
            } else {
              this.onData(strm.output.length === strm.next_out ? strm.output : strm.output.subarray(0, strm.next_out));
            }
          }
        }
        if (status === Z_OK && last_avail_out === 0)
          continue;
        if (status === Z_STREAM_END) {
          status = zlib_inflate.inflateEnd(this.strm);
          this.onEnd(status);
          this.ended = true;
          return true;
        }
        if (strm.avail_in === 0)
          break;
      }
      return true;
    };
    Inflate.prototype.onData = function(chunk) {
      this.chunks.push(chunk);
    };
    Inflate.prototype.onEnd = function(status) {
      if (status === Z_OK) {
        if (this.options.to === "string") {
          this.result = this.chunks.join("");
        } else {
          this.result = utils.flattenChunks(this.chunks);
        }
      }
      this.chunks = [];
      this.err = status;
      this.msg = this.strm.msg;
    };
    function inflate(input, options) {
      const inflator = new Inflate(options);
      inflator.push(input);
      if (inflator.err)
        throw inflator.msg || msg[inflator.err];
      return inflator.result;
    }
    function inflateRaw(input, options) {
      options = options || {};
      options.raw = true;
      return inflate(input, options);
    }
    module.exports.Inflate = Inflate;
    module.exports.inflate = inflate;
    module.exports.inflateRaw = inflateRaw;
    module.exports.ungzip = inflate;
    module.exports.constants = require_constants();
  }
});

// node_modules/pako/index.js
var require_pako = __commonJS({
  "node_modules/pako/index.js"(exports, module) {
    "use strict";
    var { Deflate, deflate, deflateRaw, gzip } = require_deflate2();
    var { Inflate, inflate, inflateRaw, ungzip } = require_inflate2();
    var constants = require_constants();
    module.exports.Deflate = Deflate;
    module.exports.deflate = deflate;
    module.exports.deflateRaw = deflateRaw;
    module.exports.gzip = gzip;
    module.exports.Inflate = Inflate;
    module.exports.inflate = inflate;
    module.exports.inflateRaw = inflateRaw;
    module.exports.ungzip = ungzip;
    module.exports.constants = constants;
  }
});

// node_modules/fbx-parser/lib/binary.js
var require_binary = __commonJS({
  "node_modules/fbx-parser/lib/binary.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseBinary = void 0;
    var binary_reader_1 = require_lib();
    var pako_1 = require_pako();
    var MAGIC = Uint8Array.from("Kaydara FBX Binary  \0\0".split(""), function(v) {
      return v.charCodeAt(0);
    });
    function parseBinary2(binary) {
      if (binary.length < MAGIC.length)
        throw "Not a binary FBX file";
      var data = new binary_reader_1.BinaryReader(binary);
      var magic = data.readUint8Array(MAGIC.length).every(function(v, i) {
        return v === MAGIC[i];
      });
      if (!magic)
        throw "Not a binary FBX file";
      var fbxVersion = data.readUint32();
      var header64 = fbxVersion >= 7500;
      var fbx = [];
      while (true) {
        var subnode = readNode(data, header64);
        if (subnode === null)
          break;
        fbx.push(subnode);
      }
      return fbx;
    }
    exports.parseBinary = parseBinary2;
    function readNode(data, header64) {
      var endOffset = header64 ? Number(data.readUint64()) : data.readUint32();
      if (endOffset === 0)
        return null;
      var numProperties = header64 ? Number(data.readUint64()) : data.readUint32();
      var propertyListLen = header64 ? Number(data.readUint64()) : data.readUint32();
      var nameLen = data.readUint8();
      var name = data.readArrayAsString(nameLen);
      var node = {
        name,
        props: [],
        nodes: []
      };
      for (var i = 0; i < numProperties; ++i) {
        node.props.push(readProperty(data));
      }
      while (endOffset - data.offset > 13) {
        var subnode = readNode(data, header64);
        if (subnode !== null)
          node.nodes.push(subnode);
      }
      data.offset = endOffset;
      return node;
    }
    function readProperty(data) {
      var typeCode = data.readUint8AsString();
      var read = {
        Y: function() {
          return data.readInt16();
        },
        C: function() {
          return data.readUint8AsBool();
        },
        I: function() {
          return data.readInt32();
        },
        F: function() {
          return data.readFloat32();
        },
        D: function() {
          return data.readFloat64();
        },
        L: function() {
          return data.readInt64();
        },
        f: function() {
          return readPropertyArray(data, function(r) {
            return r.readFloat32();
          });
        },
        d: function() {
          return readPropertyArray(data, function(r) {
            return r.readFloat64();
          });
        },
        l: function() {
          return readPropertyArray(data, function(r) {
            return r.readInt64();
          });
        },
        i: function() {
          return readPropertyArray(data, function(r) {
            return r.readInt32();
          });
        },
        b: function() {
          return readPropertyArray(data, function(r) {
            return r.readUint8AsBool();
          });
        },
        S: function() {
          return data.readArrayAsString(data.readUint32());
        },
        R: function() {
          return Array.from(data.readUint8Array(data.readUint32()));
        }
      };
      if (typeof read[typeCode] === "undefined")
        throw "Unknown Property Type " + typeCode.charCodeAt(0);
      var value = read[typeCode]();
      var convertBigInt = function(v) {
        if (value < Number.MIN_SAFE_INTEGER || v > Number.MAX_SAFE_INTEGER)
          return v;
        return Number(v);
      };
      if (typeCode === "L") {
        value = convertBigInt(value);
      } else if (typeCode === "l") {
        for (var i = 0; i < value.length; ++i) {
          value[i] = convertBigInt(value[i]);
        }
      }
      if (typeCode === "S" && value.indexOf("\0") != -1) {
        value = value.split("\0").reverse().join("::");
      }
      return value;
    }
    function readPropertyArray(data, reader) {
      var arrayLength = data.readUint32();
      var encoding = data.readUint32();
      var compressedLength = data.readUint32();
      var arrayData = new binary_reader_1.BinaryReader(data.readUint8Array(compressedLength));
      if (encoding == 1) {
        arrayData = new binary_reader_1.BinaryReader(pako_1.inflate(arrayData.binary));
      }
      var value = [];
      for (var i = 0; i < arrayLength; ++i) {
        value.push(reader(arrayData));
      }
      return value;
    }
  }
});

// node_modules/fbx-parser/lib/ascii.js
var require_ascii = __commonJS({
  "node_modules/fbx-parser/lib/ascii.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseText = void 0;
    function parseText(ascii) {
      var lines = ascii.split("\n");
      var rootNode = {
        name: "",
        props: [],
        nodes: []
      };
      var currentNode = rootNode;
      var path = [currentNode];
      var state = 0;
      for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
        var line = lines_1[_i];
        line = line.trim();
        if (line.length === 0)
          continue;
        if (line[0] === ";")
          continue;
        if (state === 0) {
          if (line[0] === "}") {
            if (path.length === 1)
              throw "FBX syntax error";
            path.pop();
            currentNode = path[path.length - 1];
          } else {
            var firstCol = line.indexOf(":");
            var nodeName = line.substring(0, firstCol);
            nodeName = nodeName.trim();
            var expectingSubnodes = line[line.length - 1] === "{";
            var propertyString = line.substring(firstCol + 1, line.length - (expectingSubnodes ? 1 : 0));
            var propertyStringList = propertyString.split(",");
            var properties = [];
            for (var _a = 0, propertyStringList_1 = propertyStringList; _a < propertyStringList_1.length; _a++) {
              var propertyString_1 = propertyStringList_1[_a];
              var trimmed = propertyString_1.trim();
              if (trimmed === "")
                continue;
              var value = convertProperty(trimmed);
              if (typeof value === "undefined")
                continue;
              properties.push(value);
            }
            if (propertyStringList[propertyStringList.length - 1] === "")
              state = 1;
            var newNode = {
              name: nodeName,
              props: properties,
              nodes: []
            };
            currentNode.nodes.push(newNode);
            if (expectingSubnodes || state === 1) {
              path.push(newNode);
              currentNode = newNode;
            }
          }
        } else if (state === 1) {
          var expectingSubnodes = line[line.length - 1] === "{";
          var propertyString = line.substring(0, line.length - (expectingSubnodes ? 1 : 0));
          var propertyStringList = propertyString.split(",");
          var properties = [];
          for (var _b = 0, propertyStringList_2 = propertyStringList; _b < propertyStringList_2.length; _b++) {
            var propertyString_2 = propertyStringList_2[_b];
            var trimmed = propertyString_2.trim();
            if (trimmed === "" || trimmed === "}")
              continue;
            var value = convertProperty(trimmed);
            if (typeof value === "undefined")
              continue;
            properties.push(value);
          }
          currentNode.props = currentNode.props.concat(properties);
          if (propertyStringList[propertyStringList.length - 1] !== "")
            state = 0;
          if (!expectingSubnodes && state === 0) {
            path.pop();
            currentNode = path[path.length - 1];
          }
        }
      }
      function correctArrays(node) {
        if (node.nodes.length === 1 && node.props.length === 0 && node.nodes[0].name === "a") {
          node.props = [node.nodes[0].props];
          node.nodes = [];
        } else {
          for (var _i2 = 0, _a2 = node.nodes; _i2 < _a2.length; _i2++) {
            var childNode = _a2[_i2];
            correctArrays(childNode);
          }
        }
      }
      correctArrays(rootNode);
      return rootNode.nodes;
    }
    exports.parseText = parseText;
    function convertProperty(prop) {
      if (prop[0] == "*")
        return void 0;
      if (prop[0] == '"')
        return prop.substr(1, prop.length - 2);
      if (prop == "T")
        return true;
      if (prop == "F")
        return false;
      if (prop == "Y")
        return true;
      if (prop == "N")
        return false;
      if (prop.indexOf(".") != -1)
        return parseFloat(prop);
      var n = BigInt(prop);
      if (n < Number.MIN_SAFE_INTEGER || n > Number.MAX_SAFE_INTEGER)
        return n;
      return Number(n);
    }
  }
});

// node_modules/fbx-parser/lib/FBXReader.js
var require_FBXReader = __commonJS({
  "node_modules/fbx-parser/lib/FBXReader.js"(exports) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FBXReader = exports.FBXReaderNode = void 0;
    var FBXReaderNode = (
      /** @class */
      function() {
        function FBXReaderNode2(fbxNode) {
          this.fbxNode = fbxNode;
        }
        FBXReaderNode2.prototype.nodeFilter = function(a, b) {
          var name = void 0;
          var propFilter = void 0;
          if (typeof a === "string") {
            name = a;
            if (typeof b !== "undefined")
              propFilter = b;
          } else
            propFilter = a;
          var filter;
          if (typeof propFilter !== "undefined") {
            var propFilterFunc_1 = function(node) {
              for (var prop in propFilter) {
                var index = parseInt(prop);
                if (node.props[index] !== propFilter[index])
                  return false;
              }
              return true;
            };
            if (typeof name !== "undefined") {
              filter = function(node) {
                return node.name === name && propFilterFunc_1(node);
              };
            } else {
              filter = propFilterFunc_1;
            }
          } else {
            filter = function(node) {
              return node.name === name;
            };
          }
          return filter;
        };
        FBXReaderNode2.prototype.node = function(a, b) {
          var node = this.fbxNode.nodes.find(this.nodeFilter(a, b));
          if (typeof node === "undefined")
            return;
          return new FBXReaderNode2(node);
        };
        FBXReaderNode2.prototype.nodes = function(a, b) {
          var nodes = this.fbxNode.nodes.filter(this.nodeFilter(a, b)).map(function(node) {
            return new FBXReaderNode2(node);
          });
          return nodes;
        };
        FBXReaderNode2.prototype.prop = function(index, type) {
          var prop = this.fbxNode.props[index];
          if (typeof type === "undefined")
            return prop;
          if (type === "boolean")
            return typeof prop === "boolean" ? prop : void 0;
          if (type === "number")
            return typeof prop === "number" ? prop : void 0;
          if (type === "bigint")
            return typeof prop === "bigint" ? prop : void 0;
          if (type === "string")
            return typeof prop === "string" ? prop : void 0;
          if (!Array.isArray(prop))
            return void 0;
          if (prop.length == 0)
            return prop;
          if (type === "boolean[]")
            return typeof prop[0] === "boolean" ? prop : void 0;
          if (type === "number[]")
            return typeof prop[0] === "number" ? prop : void 0;
          if (type === "bigint[]")
            return typeof prop[0] === "bigint" ? prop : void 0;
        };
        return FBXReaderNode2;
      }()
    );
    exports.FBXReaderNode = FBXReaderNode;
    var FBXReader = (
      /** @class */
      function(_super) {
        __extends(FBXReader2, _super);
        function FBXReader2(fbx) {
          var _this = this;
          var rootNode = {
            name: "",
            props: [],
            nodes: fbx
          };
          _this = _super.call(this, rootNode) || this;
          _this.fbx = fbx;
          return _this;
        }
        return FBXReader2;
      }(FBXReaderNode)
    );
    exports.FBXReader = FBXReader;
  }
});

// node_modules/fbx-parser/lib/index.js
var require_lib2 = __commonJS({
  "node_modules/fbx-parser/lib/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FBXReaderNode = exports.FBXReader = exports.parseText = exports.parseBinary = void 0;
    var binary_1 = require_binary();
    Object.defineProperty(exports, "parseBinary", { enumerable: true, get: function() {
      return binary_1.parseBinary;
    } });
    var ascii_1 = require_ascii();
    Object.defineProperty(exports, "parseText", { enumerable: true, get: function() {
      return ascii_1.parseText;
    } });
    var FBXReader_1 = require_FBXReader();
    Object.defineProperty(exports, "FBXReader", { enumerable: true, get: function() {
      return FBXReader_1.FBXReader;
    } });
    Object.defineProperty(exports, "FBXReaderNode", { enumerable: true, get: function() {
      return FBXReader_1.FBXReaderNode;
    } });
  }
});

// ts/classes/util/math/vector2.ts
function v2(n, y) {
  if (typeof n === "number") {
    return Vector2.f(n, y);
  } else if (typeof n === "undefined") {
    return Vector2.f(0);
  } else {
    return Vector2.f(...n);
  }
}
var Vector2 = class _Vector2 {
  constructor(x, y) {
    this.x = x === void 0 ? 0 : x;
    this.y = y === void 0 ? 0 : y;
  }
  static f(x = 0, y = x) {
    return new _Vector2(x, y);
  }
  isZero() {
    return this.x === 0 && this.y === 0;
  }
  clone() {
    return new _Vector2(this.x, this.y);
  }
  add(vector) {
    return new _Vector2(this.x + vector.x, this.y + vector.y);
  }
  multiply(vector) {
    return new _Vector2(this.x * vector.x, this.y * vector.y);
  }
  subtract(vector) {
    return new _Vector2(this.x - vector.x, this.y - vector.y);
  }
  scale(scalar) {
    return new _Vector2(this.x * scalar, this.y * scalar);
  }
  dot(vector) {
    return this.x * vector.x + this.y + vector.y;
  }
  moveTowards(vector, t) {
    t = Math.min(t, 1);
    var diff = vector.subtract(this);
    return this.add(diff.scale(t));
  }
  magnitude() {
    return Math.sqrt(this.magnitudeSqr());
  }
  magnitudeSqr() {
    return this.x * this.x + this.y * this.y;
  }
  clampMagnitude(max2 = 1) {
    if (this.magnitude() === 0)
      return v2(0);
    return this.scale(1 / this.magnitude() || 1).scale(Math.min(max2, this.magnitude()));
  }
  distance(vector) {
    return Math.sqrt(this.distanceSqr(vector));
  }
  distanceSqr(vector) {
    var deltaX = this.x - vector.x;
    var deltaY = this.y - vector.y;
    return deltaX * deltaX + deltaY * deltaY;
  }
  normalize() {
    var mag = this.magnitude();
    var vector = this.clone();
    if (Math.abs(mag) < 1e-9) {
      vector.x = 0;
      vector.y = 0;
    } else {
      vector.x /= mag;
      vector.y /= mag;
    }
    return vector;
  }
  angleDegrees() {
    return this.angle() * (180 / Math.PI);
  }
  angle() {
    return Math.atan2(this.y, this.x);
  }
  rotate(rad) {
    var cos = Math.cos(rad);
    var sin = Math.sin(rad);
    return new _Vector2(
      this.x * cos - this.y * sin,
      this.x * sin + this.y * cos
    );
  }
  toPrecision(precision) {
    var vector = this.clone();
    vector.x = +vector.x.toFixed(precision);
    vector.y = +vector.y.toFixed(precision);
    return vector;
  }
  toString() {
    var vector = this.toPrecision(1);
    return "[" + vector.x + "; " + vector.y + "]";
  }
  clamp(min2, max2) {
    return _Vector2.clamp(this, min2, max2);
  }
  static min(a, b) {
    return new _Vector2(
      Math.min(a.x, b.x),
      Math.min(a.y, b.y)
    );
  }
  static max(a, b) {
    return new _Vector2(
      Math.max(a.x, b.x),
      Math.max(a.y, b.y)
    );
  }
  static clamp(value, min2, max2) {
    return _Vector2.max(_Vector2.min(value, min2), max2);
  }
  clampMagnitute(mag) {
    return _Vector2.clampMagnitute(this, mag);
  }
  get array() {
    return [this.x, this.y];
  }
  set array(a) {
    [this.x, this.y] = a;
  }
  get surfaceArea() {
    return this.x * this.y;
  }
  static clampMagnitute(value, mag) {
    var ratio = value.magnitude() / mag;
    return new _Vector2(value.x / ratio, value.y / ratio);
  }
  static get zero() {
    return new _Vector2(0, 0);
  }
  static get down() {
    return new _Vector2(0, -1);
  }
  static get up() {
    return new _Vector2(0, 1);
  }
  static get right() {
    return new _Vector2(1, 0);
  }
  static get left() {
    return new _Vector2(-1, 0);
  }
  static get fromDegree() {
    return new _Vector2(0, 0);
  }
};

// ts/classes/elements/element.ts
var Element = class {
  constructor() {
    this.events = [];
  }
  get t() {
    return glob.game.t;
  }
  build() {
  }
  addEvent(e) {
    this.events.push(e);
  }
  getEvent(id) {
    return this.events.find((e) => id === e.id);
  }
};

// ts/classes/elements/domElement.ts
var DomElement = class extends Element {
  constructor(type, attr = {}) {
    super();
    this.children = [];
    this.rendererType = "dom";
    this._position = v2(0);
    this.size = v2(0);
    this.dom = document.createElement(type);
    this.dom.style.position = "absolute";
    this.dom.style.transformOrigin = "bottom left";
    this.dom.style.pointerEvents = "none";
    this.dom.style.bottom = "0px";
    this.id = attr.id || "";
    this.background = attr.background || "";
    this.size = attr.size || Vector2.zero;
    this.position = attr.position || Vector2.zero;
  }
  get position() {
    return this._position;
  }
  set position(value) {
    this._position = value;
    this.x = value.x;
    this.y = value.y;
  }
  get id() {
    return this.dom.id;
  }
  set id(value) {
    if (value) {
      this.dom.id = value;
    }
  }
  get x() {
    return Math.round(Number(this.dom.style.left.replace(/\D/g, "")));
  }
  set x(n) {
    if (this.dom) {
      this.dom.style.left = "".concat(n, "px");
    }
  }
  get y() {
    return Math.round(Number(this.dom.style.bottom.replace(/\D/g, "")));
  }
  set y(n) {
    if (this.dom) {
      this.dom.style.bottom = "".concat(n, "px");
    }
  }
  set visible(value) {
    this.dom ? this.dom.style.display = value ? "block" : "none" : null;
  }
  set background(v) {
    this.dom.style.background = v;
  }
  get width() {
    return Math.round(Number(this.dom.style.width.replace(/\D/g, "")));
  }
  set width(value) {
    if (this.dom) {
      this.dom.style.width = "".concat(value, "px");
      this.dom.setAttribute("width", String(value));
    }
  }
  get height() {
    return Math.round(Number(this.dom.style.height.replace(/\D/g, "")));
  }
  set height(value) {
    if (this.dom) {
      this.dom.style.height = "".concat(value, "px");
      this.dom.setAttribute("height", String(value));
    }
  }
  ready() {
    this.build();
  }
  tick(obj) {
    this.children.forEach((c) => {
      c.tick(obj);
    });
  }
  appendChild(e) {
    this.dom.appendChild(e.dom);
  }
  addChild(child) {
    this.children.push(child);
    this.dom.appendChild(child.dom);
  }
  addEventListener(type, listener, options) {
    this.dom.addEventListener(type, listener, options);
  }
  removeEventListener(type, listener, options) {
    this.dom.removeEventListener(type, listener, options);
  }
};

// ts/classes/util/event.ts
var Events = class {
  constructor(id) {
    this.subscribers = {};
    this.id = id;
  }
  subscribe(key, func) {
    this.subscribers[key] = func;
  }
  alert(v) {
    Object.values(this.subscribers).forEach((s) => {
      s(v);
    });
  }
};

// ts/classes/webgl2/buffer.ts
var Buffer2 = class {
  constructor(gl, type = gl.ARRAY_BUFFER, usage = gl.STATIC_DRAW) {
    this.gl = gl;
    this.type = type;
    this.usage = usage;
    const buffer = gl.createBuffer();
    if (!buffer) {
      throw new Error("Failed to create buffer");
    }
    this.buffer = buffer;
  }
  bind() {
    this.gl.bindBuffer(this.type, this.buffer);
  }
  unbind() {
    this.gl.bindBuffer(this.type, null);
  }
  setData(data) {
    this.bind();
    this.gl.bufferData(this.type, data, this.usage);
  }
  updateData(data, offset = 0) {
    this.bind();
    this.gl.bufferSubData(this.type, offset, data);
  }
  dispose() {
    this.gl.deleteBuffer(this.buffer);
  }
};
var VertexArray = class {
  constructor(gl) {
    this.gl = gl;
    const vao = gl.createVertexArray();
    if (!vao) {
      throw new Error("Failed to create vertex array object");
    }
    this.vao = vao;
  }
  bind() {
    this.gl.bindVertexArray(this.vao);
  }
  unbind() {
    this.gl.bindVertexArray(null);
  }
  setAttributePointer(location2, size, type, normalized = false, stride = 0, offset = 0) {
    this.gl.vertexAttribPointer(location2, size, type, normalized, stride, offset);
    this.gl.enableVertexAttribArray(location2);
  }
  dispose() {
    this.gl.deleteVertexArray(this.vao);
  }
};
var VertexBuffer = class extends Buffer2 {
  constructor(gl, usage = gl.STATIC_DRAW) {
    super(gl, gl.ARRAY_BUFFER, usage);
  }
};
var IndexBuffer = class extends Buffer2 {
  constructor(gl, usage = gl.STATIC_DRAW) {
    super(gl, gl.ELEMENT_ARRAY_BUFFER, usage);
    this.count = 0;
  }
  setData(data) {
    super.setData(data);
    this.count = data.byteLength / 2;
  }
  getCount() {
    return this.count;
  }
};

// ts/classes/webgl2/shaderManager.ts
var ShaderManager = class {
  constructor(gl) {
    this.currentProgram = null;
    this.gl = gl;
    this.shaderPrograms = /* @__PURE__ */ new Map();
    this.uniforms = /* @__PURE__ */ new Map();
    this.attributes = /* @__PURE__ */ new Map();
  }
  loadShaderProgram(name, vertexSource, fragmentSource) {
    try {
      const vertexShader = this.compileShader(vertexSource, this.gl.VERTEX_SHADER);
      const fragmentShader = this.compileShader(fragmentSource, this.gl.FRAGMENT_SHADER);
      const program = this.createProgram(vertexShader, fragmentShader);
      this.shaderPrograms.set(name, program);
      this.uniforms.set(name, /* @__PURE__ */ new Map());
      this.attributes.set(name, /* @__PURE__ */ new Map());
      this.gl.deleteShader(vertexShader);
      this.gl.deleteShader(fragmentShader);
      this.introspectShaderProgram(name);
    } catch (error) {
      console.error("Failed to load shader program '".concat(name, "':"), error);
      throw error;
    }
  }
  compileShader(source, type) {
    const shader = this.gl.createShader(type);
    if (!shader) {
      throw new Error("Failed to create shader");
    }
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      const info = this.gl.getShaderInfoLog(shader);
      this.gl.deleteShader(shader);
      throw new Error("Shader compilation error: ".concat(info));
    }
    return shader;
  }
  createProgram(vertexShader, fragmentShader) {
    const program = this.gl.createProgram();
    if (!program) {
      throw new Error("Failed to create shader program");
    }
    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);
    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      const info = this.gl.getProgramInfoLog(program);
      this.gl.deleteProgram(program);
      throw new Error("Shader program linking error: ".concat(info));
    }
    return program;
  }
  introspectShaderProgram(name) {
    const program = this.shaderPrograms.get(name);
    if (!program) {
      throw new Error("Shader program '".concat(name, "' not found"));
    }
    const numUniforms = this.gl.getProgramParameter(program, this.gl.ACTIVE_UNIFORMS);
    const uniformMap = this.uniforms.get(name);
    for (let i = 0; i < numUniforms; i++) {
      const info = this.gl.getActiveUniform(program, i);
      if (!info)
        continue;
      const location2 = this.gl.getUniformLocation(program, info.name);
      if (!location2) {
        console.warn("Could not get location for uniform '".concat(info.name, "' in shader '").concat(name, "'"));
        continue;
      }
      const baseName = info.name.replace(/\[\d+\].*$/, "");
      const typeName = this.getUniformTypeName(info.type);
      uniformMap.set(baseName, {
        type: typeName,
        value: this.getDefaultValueForType(info.type),
        location: location2,
        isArray: info.size > 1,
        arraySize: info.size
      });
    }
    const numAttributes = this.gl.getProgramParameter(program, this.gl.ACTIVE_ATTRIBUTES);
    const attributeMap = this.attributes.get(name);
    for (let i = 0; i < numAttributes; i++) {
      const info = this.gl.getActiveAttrib(program, i);
      if (!info)
        continue;
      const location2 = this.gl.getAttribLocation(program, info.name);
      if (location2 === -1)
        continue;
      attributeMap.set(info.name, {
        type: this.getAttributeTypeName(info.type),
        size: this.getAttributeSize(info.type),
        location: location2
      });
    }
  }
  useProgram(name) {
    const program = this.shaderPrograms.get(name);
    if (!program) {
      throw new Error("Shader program '".concat(name, "' not found"));
    }
    this.gl.useProgram(program);
    this.currentProgram = name;
  }
  setUniform(name, value) {
    if (!this.currentProgram) {
      console.error("No shader program is currently in use");
      return;
    }
    const uniformMap = this.uniforms.get(this.currentProgram);
    if (!uniformMap) {
      console.error("Uniform map not found for program '".concat(this.currentProgram, "'"));
      return;
    }
    const uniform = uniformMap.get(name);
    if (!uniform || !uniform.location) {
      console.error(
        "Uniform '".concat(name, "' not found in program '").concat(this.currentProgram, "'. Available uniforms:"),
        Array.from(uniformMap.keys()).join(", ")
      );
      return;
    }
    try {
      this.setUniformValue(uniform.type, uniform.location, value);
      uniform.value = value;
    } catch (error) {
      console.error("Error setting uniform '".concat(name, "' in program '").concat(this.currentProgram, "':"), error);
    }
  }
  setUniformValue(type, location2, value) {
    switch (type) {
      case "float":
        if (Array.isArray(value) || value instanceof Float32Array) {
          this.gl.uniform1fv(location2, value);
        } else {
          this.gl.uniform1f(location2, value);
        }
        break;
      case "vec2":
        this.gl.uniform2fv(location2, value);
        break;
      case "vec3":
        this.gl.uniform3fv(location2, value);
        break;
      case "vec4":
        this.gl.uniform4fv(location2, value);
        break;
      case "mat4":
        this.gl.uniformMatrix4fv(location2, false, value);
        break;
      case "mat4[]":
        this.gl.uniformMatrix4fv(location2, false, value);
        break;
      case "mat3":
        this.gl.uniformMatrix3fv(location2, false, value);
        break;
      case "int":
        if (Array.isArray(value) || value instanceof Int32Array) {
          this.gl.uniform1iv(location2, value);
        } else {
          this.gl.uniform1i(location2, value);
        }
        break;
      case "bool":
        if (Array.isArray(value)) {
          const intArray = new Int32Array(value.map((v) => v ? 1 : 0));
          this.gl.uniform1iv(location2, intArray);
        } else if (value instanceof Int32Array) {
          this.gl.uniform1iv(location2, value);
        } else {
          this.gl.uniform1i(location2, value ? 1 : 0);
        }
        break;
      case "sampler2D":
      case "sampler2D[]":
      case "samplerCube":
        if (Array.isArray(value) || value instanceof Int32Array) {
          this.gl.uniform1iv(location2, value);
        } else {
          this.gl.uniform1i(location2, value);
        }
        break;
      case "Light":
        const data = value;
        this.gl.uniform1fv(location2, data);
        break;
      default:
        console.warn("Unsupported uniform type: ".concat(type));
        break;
    }
  }
  getAttributeLocation(name) {
    if (!this.currentProgram) {
      throw new Error("No shader program is currently in use");
    }
    const attributeMap = this.attributes.get(this.currentProgram);
    if (!attributeMap) {
      throw new Error("Attribute map not found for program '".concat(this.currentProgram, "'"));
    }
    const attribute = attributeMap.get(name);
    if (!attribute) {
      throw new Error("Attribute '".concat(name, "' not found in program '").concat(this.currentProgram, "'. Make sure to use the a_camelCase naming convention."));
    }
    return attribute.location;
  }
  getUniformTypeName(type) {
    switch (type) {
      case this.gl.FLOAT:
        return "float";
      case this.gl.FLOAT_VEC2:
        return "vec2";
      case this.gl.FLOAT_VEC3:
        return "vec3";
      case this.gl.FLOAT_VEC4:
        return "vec4";
      case this.gl.FLOAT_MAT4:
        return "mat4";
      case this.gl.FLOAT_MAT4 | 32:
        return "mat4[]";
      case this.gl.FLOAT_MAT3:
        return "mat3";
      case this.gl.INT:
        return "int";
      case this.gl.BOOL:
        return "bool";
      case this.gl.SAMPLER_2D:
        return "sampler2D";
      case this.gl.SAMPLER_2D | 32:
        return "sampler2D[]";
      case this.gl.SAMPLER_CUBE:
        return "samplerCube";
      case 35666:
        return "Light";
      default:
        console.warn("Unknown uniform type: ".concat(type));
        return "unknown";
    }
  }
  getAttributeTypeName(type) {
    switch (type) {
      case this.gl.FLOAT:
        return "float";
      case this.gl.FLOAT_VEC2:
        return "vec2";
      case this.gl.FLOAT_VEC3:
        return "vec3";
      case this.gl.FLOAT_VEC4:
        return "vec4";
      default:
        return "unknown";
    }
  }
  getAttributeSize(type) {
    switch (type) {
      case this.gl.FLOAT:
        return 1;
      case this.gl.FLOAT_VEC2:
        return 2;
      case this.gl.FLOAT_VEC3:
        return 3;
      case this.gl.FLOAT_VEC4:
        return 4;
      default:
        return 0;
    }
  }
  getDefaultValueForType(type) {
    switch (type) {
      case this.gl.FLOAT:
      case this.gl.INT:
      case this.gl.BOOL:
      case this.gl.SAMPLER_2D:
        return 0;
      case this.gl.FLOAT_VEC2:
        return new Float32Array(2);
      case this.gl.FLOAT_VEC3:
        return new Float32Array(3);
      case this.gl.FLOAT_VEC4:
        return new Float32Array(4);
      case this.gl.FLOAT_MAT4:
        return new Float32Array(16);
      default:
        return 0;
    }
  }
  hasUniform(name) {
    if (!this.currentProgram) {
      return false;
    }
    const uniformMap = this.uniforms.get(this.currentProgram);
    if (!uniformMap) {
      return false;
    }
    return uniformMap.has(name);
  }
  dispose() {
    for (const [name, program] of this.shaderPrograms) {
      this.gl.deleteProgram(program);
    }
    this.shaderPrograms.clear();
    this.uniforms.clear();
    this.attributes.clear();
    this.currentProgram = null;
  }
};

// ts/classes/webgl2/shaders/fragmentShaderSource.ts
var fragmentShaderSource = "#version 300 es\nprecision highp float;\n\n// Maximum number of lights\n#define MAX_LIGHTS 10\n\n// Light types\n#define LIGHT_TYPE_INACTIVE -1\n#define LIGHT_TYPE_AMBIENT 0\n#define LIGHT_TYPE_DIRECTIONAL 1\n#define LIGHT_TYPE_POINT 2\n#define LIGHT_TYPE_SPOT 3\n\n// Input from vertex shader\nin vec3 v_normal;\nin vec2 v_texCoord;\nin vec3 v_fragPos;\nin vec3 v_color;\nin vec4 v_fragPosLightSpace;\n\n// Material structure\nstruct Material {\n    vec3 ambient;\n    vec3 diffuse;\n    vec3 specular;\n    float shininess;\n    sampler2D diffuseMap;\n};\n\n// Light uniforms\nuniform int u_lightTypes[MAX_LIGHTS];\nuniform vec3 u_lightPositions[MAX_LIGHTS];\nuniform vec3 u_lightDirections[MAX_LIGHTS];\nuniform vec3 u_lightColors[MAX_LIGHTS];\nuniform float u_lightIntensities[MAX_LIGHTS];\nuniform float u_lightConstants[MAX_LIGHTS];\nuniform float u_lightLinears[MAX_LIGHTS];\nuniform float u_lightQuadratics[MAX_LIGHTS];\nuniform float u_lightCutOffs[MAX_LIGHTS];\nuniform float u_lightOuterCutOffs[MAX_LIGHTS];\nuniform int u_numLights;\n\n// Material uniforms\nuniform Material u_material;\nuniform bool u_useTexture;\n\n// Shadow mapping uniforms\nuniform sampler2D u_shadowMap0;\nuniform sampler2D u_shadowMap1;\nuniform sampler2D u_shadowMap2;\nuniform sampler2D u_shadowMap3;\nuniform sampler2D u_shadowMap4;\nuniform sampler2D u_shadowMap5;\nuniform sampler2D u_shadowMap6;\nuniform sampler2D u_shadowMap7;\nuniform sampler2D u_shadowMap8;\nuniform sampler2D u_shadowMap9;\nuniform mat4 u_lightSpaceMatrices[MAX_LIGHTS];\nuniform bool u_castsShadow[MAX_LIGHTS];\n\n// Other uniforms\nuniform vec3 u_viewPos;\n\n// Output\nout vec4 fragColor;\n\nfloat getShadowMap(int index, vec2 coords) {\n    // We have to use a switch statement because WebGL2 requires constant array indices for samplers\n    switch(index) {\n        case 0: return texture(u_shadowMap0, coords).r;\n        case 1: return texture(u_shadowMap1, coords).r;\n        case 2: return texture(u_shadowMap2, coords).r;\n        case 3: return texture(u_shadowMap3, coords).r;\n        case 4: return texture(u_shadowMap4, coords).r;\n        case 5: return texture(u_shadowMap5, coords).r;\n        case 6: return texture(u_shadowMap6, coords).r;\n        case 7: return texture(u_shadowMap7, coords).r;\n        case 8: return texture(u_shadowMap8, coords).r;\n        case 9: return texture(u_shadowMap9, coords).r;\n        default: return 1.0; // No shadow if invalid index\n    }\n}\n\nfloat ShadowCalculation(vec4 fragPosLightSpace, vec3 normal, vec3 lightDir, int shadowMapIndex) {\n    // Perform perspective divide\n    vec3 projCoords = fragPosLightSpace.xyz / fragPosLightSpace.w;\n    \n    // Transform to [0,1] range\n    projCoords = projCoords * 0.5 + 0.5;\n    \n    // Get closest depth value from light's perspective using the helper function\n    float closestDepth = getShadowMap(shadowMapIndex, projCoords.xy);\n    \n    // Get current depth\n    float currentDepth = projCoords.z;\n    \n    // Calculate bias based on surface angle\n    float cosTheta = dot(normal, lightDir);\n    float bias = 0.01; // Moderate base bias\n    \n    // Add angle-dependent component\n    bias += 0.02 * (1.0 - max(cosTheta, 0.0));\n    \n    // PCF (Percentage Closer Filtering)\n    float shadow = 0.0;\n    vec2 texelSize = 1.0 / vec2(textureSize(u_shadowMap0, 0)); // All shadow maps are same size\n    for(int x = -1; x <= 1; ++x) {\n        for(int y = -1; y <= 1; ++y) {\n            float pcfDepth = getShadowMap(shadowMapIndex, projCoords.xy + vec2(x, y) * texelSize);\n            shadow += (currentDepth - bias) > pcfDepth ? 1.0 : 0.0;\n        }\n    }\n    shadow /= 9.0;\n    \n    // Keep shadow at 0.0 when outside the far plane region of the light's frustum\n    if(projCoords.z > 1.0)\n        shadow = 0.0;\n        \n    return shadow;\n}\n\n// Function to calculate directional light\nvec3 calcDirectionalLight(int index, vec3 normal, vec3 viewDir, vec3 baseColor) {\n    vec3 lightDir = normalize(-u_lightDirections[index]);\n    \n    // Diffuse\n    float diff = max(dot(normal, lightDir), 0.0);\n    \n    // Specular\n    vec3 reflectDir = reflect(-lightDir, normal);\n    float spec = pow(max(dot(viewDir, reflectDir), 0.0), u_material.shininess);\n    \n    vec3 ambient = u_lightColors[index] * u_material.ambient;\n    vec3 diffuse = u_lightColors[index] * diff * baseColor;\n    vec3 specular = u_lightColors[index] * spec * u_material.specular;\n    \n    return (ambient + diffuse + specular) * u_lightIntensities[index];\n}\n\n// Function to calculate point light\nvec3 calcPointLight(int index, vec3 normal, vec3 fragPos, vec3 viewDir, vec3 baseColor) {\n    vec3 lightDir = normalize(u_lightPositions[index] - fragPos);\n    \n    // Diffuse\n    float diff = max(dot(normal, lightDir), 0.0);\n    \n    // Specular\n    vec3 reflectDir = reflect(-lightDir, normal);\n    float spec = pow(max(dot(viewDir, reflectDir), 0.0), u_material.shininess);\n    \n    // Attenuation\n    float distance = length(u_lightPositions[index] - fragPos);\n    float attenuation = 1.0 / (u_lightConstants[index] + u_lightLinears[index] * distance + u_lightQuadratics[index] * distance * distance);\n    \n    vec3 ambient = u_lightColors[index] * u_material.ambient;\n    vec3 diffuse = u_lightColors[index] * diff * baseColor * u_material.diffuse;\n    vec3 specular = u_lightColors[index] * spec * u_material.specular;\n    \n    return (ambient + diffuse + specular) * attenuation * u_lightIntensities[index];\n}\n\n// Function to calculate spot light\nvec3 calcSpotLight(int index, vec3 normal, vec3 fragPos, vec3 viewDir, vec3 baseColor) {\n    vec3 lightDir = normalize(u_lightPositions[index] - fragPos);\n    \n    // Spot light intensity\n    float theta = dot(lightDir, normalize(-u_lightDirections[index]));\n    float epsilon = u_lightCutOffs[index] - u_lightOuterCutOffs[index];\n    float intensity = clamp((theta - u_lightOuterCutOffs[index]) / epsilon, 0.0, 1.0);\n    \n    // Use point light calculation and multiply by spot intensity\n    return calcPointLight(index, normal, fragPos, viewDir, baseColor) * intensity;\n}\n\nvoid main() {\n    vec3 normal = normalize(v_normal);\n    vec3 viewDir = normalize(u_viewPos - v_fragPos);\n    \n    // Get base color from texture or vertex color\n    vec3 baseColor;\n    if (u_useTexture) {\n        baseColor = texture(u_material.diffuseMap, v_texCoord).rgb;\n    } else {\n        baseColor = v_color;\n    }\n    \n    vec3 result = vec3(0.0);\n    \n    // Calculate contribution from each light\n    for(int i = 0; i < u_numLights; i++) {\n        if(i >= MAX_LIGHTS) break;\n        \n        // Skip inactive lights\n        if(u_lightTypes[i] == LIGHT_TYPE_INACTIVE) continue;\n        \n        float shadow = 0.0;\n        if(u_castsShadow[i]) {\n            vec4 fragPosLightSpace = u_lightSpaceMatrices[i] * vec4(v_fragPos, 1.0);\n            shadow = ShadowCalculation(fragPosLightSpace, normal, normalize(u_lightPositions[i] - v_fragPos), i);\n        }\n        \n        if(u_lightTypes[i] == LIGHT_TYPE_AMBIENT) {\n            result += u_lightColors[i] * u_lightIntensities[i] * baseColor;\n        }\n        else if(u_lightTypes[i] == LIGHT_TYPE_DIRECTIONAL) {\n            vec3 lighting = calcDirectionalLight(i, normal, viewDir, baseColor);\n            result += lighting * (1.0 - shadow);\n        }\n        else if(u_lightTypes[i] == LIGHT_TYPE_POINT) {\n            vec3 lighting = calcPointLight(i, normal, v_fragPos, viewDir, baseColor);\n            result += lighting * (1.0 - shadow);\n        }\n        else if(u_lightTypes[i] == LIGHT_TYPE_SPOT) {\n            vec3 lighting = calcSpotLight(i, normal, v_fragPos, viewDir, baseColor);\n            result += lighting * (1.0 - shadow);\n        }\n    }\n    \n    fragColor = vec4(result, 1.0);\n}";

// ts/classes/webgl2/shaders/vertexShaderSource.ts
var vertexShaderSource = "#version 300 es\nprecision highp float;\n\n// Attributes\nin vec3 a_position;\nin vec3 a_normal;\nin vec2 a_texCoord;\nin vec3 a_color;\n\n// Uniforms\nuniform mat4 u_modelMatrix;\nuniform mat4 u_viewMatrix;\nuniform mat4 u_projectionMatrix;\nuniform mat3 u_normalMatrix; // Added for correct normal transformation\n\n// Material uniforms\nstruct Material {\n    vec3 ambient;\n    vec3 diffuse;\n    vec3 specular;\n    float shininess;\n    sampler2D diffuseMap;\n};\nuniform Material u_material;\nuniform bool u_useTexture;\n\n// Varyings (output to fragment shader)\nout vec3 v_normal;\nout vec2 v_texCoord;\nout vec3 v_fragPos;\nout vec3 v_color;\n\nvoid main() {\n    v_fragPos = vec3(u_modelMatrix * vec4(a_position, 1.0));\n    v_normal = u_normalMatrix * a_normal;\n    v_texCoord = a_texCoord;\n    v_color = a_color;\n    \n    gl_Position = u_projectionMatrix * u_viewMatrix * vec4(v_fragPos, 1.0);\n}";

// ts/classes/webgl2/shaders/shadowVertexShader.ts
var shadowVertexShaderSource = "#version 300 es\nprecision highp float;\n\nin vec3 a_position;\nuniform mat4 u_lightSpaceMatrix;\nuniform mat4 u_modelMatrix;\n\nvoid main() {\n    gl_Position = u_lightSpaceMatrix * u_modelMatrix * vec4(a_position, 1.0);\n}\n";

// ts/classes/webgl2/shaders/pbrVertexShader.ts
var pbrVertexShader = "#version 300 es\nprecision highp float;\n\n// Attributes\nin vec3 a_position;\nin vec3 a_normal;\nin vec2 a_texCoord;\nin vec3 a_tangent;\nin vec3 a_bitangent;\nin vec3 a_color;\n\n// Uniforms\nuniform mat4 u_modelMatrix;\nuniform mat4 u_viewMatrix;\nuniform mat4 u_projectionMatrix;\nuniform mat3 u_normalMatrix;\n\n// Varyings (output to fragment shader)\nout vec3 v_position;\nout vec3 v_normal;\nout vec2 v_texCoord;\nout vec3 v_worldPos;\nout mat3 v_tbn; // Tangent-Bitangent-Normal matrix for normal mapping\nout vec3 v_color;\n\nvoid main() {\n    // Calculate world position\n    v_worldPos = vec3(u_modelMatrix * vec4(a_position, 1.0));\n    \n    // Transform normals using normal matrix\n    v_normal = normalize(u_normalMatrix * a_normal);\n    \n    // Pass texture coordinates\n    v_texCoord = a_texCoord;\n    \n    // Pass color\n    v_color = a_color;\n    \n    // Calculate TBN matrix for normal mapping when tangents are available\n    if (length(a_tangent) > 0.0) {\n        vec3 T = normalize(u_normalMatrix * a_tangent);\n        vec3 B = normalize(u_normalMatrix * a_bitangent);\n        vec3 N = v_normal;\n        v_tbn = mat3(T, B, N);\n    } else {\n        // Identity TBN when no tangents provided\n        v_tbn = mat3(1.0);\n    }\n    \n    // Calculate clip-space position\n    gl_Position = u_projectionMatrix * u_viewMatrix * vec4(v_worldPos, 1.0);\n}";

// ts/classes/webgl2/shaders/pbrFragmentShader.ts
var pbrFragmentShader = "#version 300 es\nprecision highp float;\n\n// Constants\n#define PI 3.14159265359\n#define MAX_LIGHTS 10\n#define MAX_REFLECTION_LOD 4.0\n\n// Light types\n#define LIGHT_TYPE_INACTIVE -1\n#define LIGHT_TYPE_AMBIENT 0\n#define LIGHT_TYPE_DIRECTIONAL 1\n#define LIGHT_TYPE_POINT 2\n#define LIGHT_TYPE_SPOT 3\n\n// PBR Material uniforms\nstruct PBRMaterial {\n    vec3 baseColor;\n    float roughness;\n    float metallic;\n    float ambientOcclusion;\n    vec3 emissive;\n    \n    sampler2D albedoMap;\n    sampler2D normalMap;\n    sampler2D metallicMap;\n    sampler2D roughnessMap;\n    sampler2D aoMap;\n    sampler2D emissiveMap;\n    sampler2D emissiveStrengthMap;\n    \n    bool hasAlbedoMap;\n    bool hasNormalMap;\n    bool hasMetallicMap;\n    bool hasRoughnessMap;\n    bool hasAoMap;\n    bool hasEmissiveMap;\n    bool hasEmissiveStrengthMap;\n};\n\n// Light uniforms\nuniform int u_lightTypes[MAX_LIGHTS];\nuniform vec3 u_lightPositions[MAX_LIGHTS];\nuniform vec3 u_lightDirections[MAX_LIGHTS];\nuniform vec3 u_lightColors[MAX_LIGHTS];\nuniform float u_lightIntensities[MAX_LIGHTS];\nuniform float u_lightConstants[MAX_LIGHTS];\nuniform float u_lightLinears[MAX_LIGHTS];\nuniform float u_lightQuadratics[MAX_LIGHTS];\nuniform float u_lightCutOffs[MAX_LIGHTS];\nuniform float u_lightOuterCutOffs[MAX_LIGHTS];\nuniform int u_numLights;\n\n// Shadow mapping uniforms\nuniform sampler2D u_shadowMap0;\nuniform sampler2D u_shadowMap1;\nuniform sampler2D u_shadowMap2;\nuniform sampler2D u_shadowMap3;\nuniform mat4 u_lightSpaceMatrices[MAX_LIGHTS];\nuniform bool u_castsShadow[MAX_LIGHTS];\n\n// Environment mapping uniforms\nuniform samplerCube u_environmentMap;\nuniform samplerCube u_irradianceMap;\nuniform samplerCube u_prefilterMap;\nuniform sampler2D u_brdfLUT;\nuniform bool u_useEnvironmentMap;\n\n// Material uniforms\nuniform PBRMaterial u_material;\nuniform vec3 u_viewPos;\nuniform mat4 u_viewMatrix;\n\n// Varyings from vertex shader\nin vec3 v_normal;\nin vec2 v_texCoord;\nin vec3 v_worldPos;\nin mat3 v_tbn;\nin vec3 v_color;\n\n// Output\nout vec4 fragColor;\n\n// Utility function to get shadowmap value\nfloat getShadowMap(int index, vec2 coords) {\n    // We have to use a switch statement because WebGL2 requires constant array indices for samplers\n    // Note: Explicitly using .r component as we're using DEPTH_COMPONENT textures\n    switch(index) {\n        case 0: return texture(u_shadowMap0, coords).r;\n        case 1: return texture(u_shadowMap1, coords).r;\n        case 2: return texture(u_shadowMap2, coords).r;\n        case 3: return texture(u_shadowMap3, coords).r;\n        default: return 1.0; // No shadow if invalid index\n    }\n}\n\n// Shadow calculation function\nfloat ShadowCalculation(vec4 fragPosLightSpace, vec3 normal, vec3 lightDir, int shadowMapIndex) {\n    // Ensure we only process shadow maps that exist in the shader\n    if (shadowMapIndex > 3) {\n        return 0.0; // Return no shadow if the index is beyond the available shadow maps\n    }\n    \n    // Perform perspective divide\n    vec3 projCoords = fragPosLightSpace.xyz / fragPosLightSpace.w;\n    \n    // Transform to [0,1] range\n    projCoords = projCoords * 0.5 + 0.5;\n    \n    // Check if fragment is in light's view frustum\n    if (projCoords.x < 0.0 || projCoords.x > 1.0 || \n        projCoords.y < 0.0 || projCoords.y > 1.0 || \n        projCoords.z < 0.0 || projCoords.z > 1.0) {\n        return 0.0; // Not in shadow if outside frustum\n    }\n    \n    // Calculate bias based on surface angle to reduce shadow acne\n    // Use a smaller bias since we've improved shadow map precision\n    float bias = max(0.001 * (1.0 - dot(normal, lightDir)), 0.0005);\n    \n    // Get depth from shadow map\n    float closestDepth = getShadowMap(shadowMapIndex, projCoords.xy);\n    float currentDepth = projCoords.z;\n    \n    // Debug - uncomment to log values\n    // if (gl_FragCoord.x < 1.0 && gl_FragCoord.y < 1.0) {\n    //     float diff = currentDepth - closestDepth;\n    //     if (abs(diff) < 0.1) {\n    //         // Add code to print values if needed\n    //     }\n    // }\n    \n    // Simple shadow check with bias\n    // return (currentDepth - bias) > closestDepth ? 1.0 : 0.0;\n    \n    // PCF (Percentage Closer Filtering) with larger kernel for softer shadows\n    float shadow = 0.0;\n    vec2 texelSize = 1.0 / vec2(textureSize(u_shadowMap0, 0));\n    \n    for(int x = -2; x <= 2; ++x) {\n        for(int y = -2; y <= 2; ++y) {\n            float pcfDepth = getShadowMap(shadowMapIndex, projCoords.xy + vec2(x, y) * texelSize);\n            shadow += (currentDepth - bias) > pcfDepth ? 1.0 : 0.0;\n        }\n    }\n    \n    shadow /= 25.0; // 5x5 kernel\n    \n    // Fade out shadows at the edge of the light's frustum for smoother transitions\n    float fadeStart = 0.9;\n    float distanceFromCenter = length(vec2(0.5, 0.5) - projCoords.xy) * 2.0;\n    if (distanceFromCenter > fadeStart) {\n        float fadeRatio = (distanceFromCenter - fadeStart) / (1.0 - fadeStart);\n        shadow = mix(shadow, 0.0, fadeRatio);\n    }\n    \n    return shadow;\n}\n\n// PBR functions\n\n// Normal Distribution Function (GGX/Trowbridge-Reitz)\nfloat DistributionGGX(vec3 N, vec3 H, float roughness) {\n    float a = roughness * roughness;\n    float a2 = a * a;\n    float NdotH = max(dot(N, H), 0.0);\n    float NdotH2 = NdotH * NdotH;\n    \n    float denom = (NdotH2 * (a2 - 1.0) + 1.0);\n    denom = PI * denom * denom;\n    \n    return a2 / max(denom, 0.0000001);\n}\n\n// Geometry function (Smith model)\nfloat GeometrySchlickGGX(float NdotV, float roughness) {\n    float r = (roughness + 1.0);\n    float k = (r * r) / 8.0;\n    \n    float denom = NdotV * (1.0 - k) + k;\n    return NdotV / max(denom, 0.0000001);\n}\n\n// Combined Geometry function\nfloat GeometrySmith(vec3 N, vec3 V, vec3 L, float roughness) {\n    float NdotV = max(dot(N, V), 0.0);\n    float NdotL = max(dot(N, L), 0.0);\n    float ggx2 = GeometrySchlickGGX(NdotV, roughness);\n    float ggx1 = GeometrySchlickGGX(NdotL, roughness);\n    \n    return ggx1 * ggx2;\n}\n\n// Fresnel function (Schlick's approximation)\nvec3 FresnelSchlick(float cosTheta, vec3 F0) {\n    return F0 + (1.0 - F0) * pow(max(1.0 - cosTheta, 0.0), 5.0);\n}\n\n// Add roughness-aware Fresnel-Schlick\nvec3 fresnelSchlickRoughness(float cosTheta, vec3 F0, float roughness) {\n    return F0 + (max(vec3(1.0 - roughness), F0) - F0) * pow(clamp(1.0 - cosTheta, 0.0, 1.0), 5.0);\n}\n\n// Calculates radiance for a light source\nvec3 calculateRadiance(vec3 N, vec3 V, vec3 L, vec3 H, vec3 F0, \n                       vec3 albedo, float metallic, float roughness,\n                       vec3 lightColor, float lightIntensity,\n                       float attenuation) {\n    // Calculate light attenuation\n    float attenuatedIntensity = lightIntensity * attenuation;\n    \n    // Ensure roughness is never zero (to prevent divide-by-zero in GGX)\n    roughness = max(roughness, 0.01);\n    \n    // Cook-Torrance BRDF calculation\n    float NDF = DistributionGGX(N, H, roughness);\n    float G = GeometrySmith(N, V, L, roughness);\n    vec3 F = FresnelSchlick(max(dot(H, V), 0.0), F0);\n    \n    // Calculate specular component\n    vec3 numerator = NDF * G * F;\n    float denominator = 4.0 * max(dot(N, V), 0.0) * max(dot(N, L), 0.0);\n    vec3 specular = numerator / max(denominator, 0.0000001);\n    \n    // Prevent uncontrolled specular highlights by clamping\n    specular = min(specular, vec3(10.0));\n    \n    // For energy conservation\n    vec3 kS = F;\n    vec3 kD = vec3(1.0) - kS;\n    kD *= 1.0 - metallic; // Metallic materials don't have diffuse\n    \n    // Combine diffuse and specular terms\n    float NdotL = max(dot(N, L), 0.0);\n    return (kD * albedo / PI + specular) * lightColor * attenuatedIntensity * NdotL;\n}\n\nvoid main() {\n    // Get material properties, using textures if available\n    \n    // Base color (albedo)\n    vec3 albedo = u_material.baseColor;\n    if (u_material.hasAlbedoMap) {\n        albedo = texture(u_material.albedoMap, v_texCoord).rgb;\n    } else {\n        // Use vertex color if no albedo map is provided\n        albedo = v_color;\n    }\n    \n    // Metallic and roughness\n    float metallic = u_material.metallic;\n    float roughness = u_material.roughness;\n    \n    // Sample metallic map if available\n    if (u_material.hasMetallicMap) {\n        metallic = texture(u_material.metallicMap, v_texCoord).r;\n    }\n    \n    // Sample roughness map if available\n    if (u_material.hasRoughnessMap) {\n        roughness = texture(u_material.roughnessMap, v_texCoord).r;\n    }\n    \n    // Ambient occlusion\n    float ao = u_material.ambientOcclusion;\n    if (u_material.hasAoMap) {\n        ao = texture(u_material.aoMap, v_texCoord).r;\n    }\n    \n    // Normals (with normal mapping if available)\n    vec3 N = normalize(v_normal);\n    if (u_material.hasNormalMap) {\n        // Sample and decode normal map\n        vec3 normalMapValue = texture(u_material.normalMap, v_texCoord).rgb;\n        \n        // Convert from [0,1] to [-1,1] range and handle OpenGL coordinate system\n        normalMapValue = normalMapValue * 2.0 - 1.0;\n        normalMapValue.y = -normalMapValue.y;  // Flip Y component for OpenGL\n        \n        // Transform normal from tangent to world space\n        N = normalize(v_tbn * normalMapValue);\n    }\n    \n    // Emissive\n    vec3 emissive = u_material.emissive;\n    if (u_material.hasEmissiveMap) {\n        emissive = texture(u_material.emissiveMap, v_texCoord).rgb;\n    }\n    if (u_material.hasEmissiveStrengthMap) {\n        float emissiveStrength = texture(u_material.emissiveStrengthMap, v_texCoord).r;\n        emissive *= emissiveStrength;\n    }\n    \n    // Calculate view direction and reflection vector\n    vec3 V = normalize(u_viewPos - v_worldPos);\n    vec3 R = reflect(-V, normalize(v_normal));\n    \n    \n    // Calculate F0 (surface reflection at zero incidence)\n    vec3 F0 = vec3(0.04); \n    F0 = mix(F0, albedo, metallic);\n    \n    // Initialize result\n    vec3 Lo = vec3(0.0);\n    \n    // Calculate lighting contribution from each light\n    for(int i = 0; i < u_numLights; i++) {\n        if(i >= MAX_LIGHTS || u_lightTypes[i] == LIGHT_TYPE_INACTIVE) \n            continue;\n        \n        // Calculate light direction and intensity\n        vec3 L;\n        float attenuation = 1.0;\n        \n        if (u_lightTypes[i] == LIGHT_TYPE_DIRECTIONAL) {\n            // Directional light\n            L = normalize(-u_lightDirections[i]);\n        } \n        else if (u_lightTypes[i] == LIGHT_TYPE_POINT || u_lightTypes[i] == LIGHT_TYPE_SPOT) {\n            // Point or spot light\n            L = normalize(u_lightPositions[i] - v_worldPos);\n            \n            // Calculate attenuation\n            float distance = length(u_lightPositions[i] - v_worldPos);\n            attenuation = 1.0 / (u_lightConstants[i] + \n                                 u_lightLinears[i] * distance + \n                                 u_lightQuadratics[i] * distance * distance);\n            \n            // For spot lights, calculate spotlight intensity\n            if (u_lightTypes[i] == LIGHT_TYPE_SPOT) {\n                float theta = dot(L, normalize(-u_lightDirections[i]));\n                float epsilon = u_lightCutOffs[i] - u_lightOuterCutOffs[i];\n                float intensity = clamp((theta - u_lightOuterCutOffs[i]) / epsilon, 0.0, 1.0);\n                attenuation *= intensity;\n            }\n        }\n        else if (u_lightTypes[i] == LIGHT_TYPE_AMBIENT) {\n            // Ambient light (applied separately)\n            continue;\n        }\n        \n        // Calculate half vector\n        vec3 H = normalize(V + L);\n        \n        // Calculate shadow\n        float shadow = 0.0;\n        if(u_castsShadow[i]) {\n            vec4 fragPosLightSpace = u_lightSpaceMatrices[i] * vec4(v_worldPos, 1.0);\n            shadow = ShadowCalculation(fragPosLightSpace, N, L, i);\n        }\n        \n        // Add light contribution\n        vec3 radiance = calculateRadiance(N, V, L, H, F0, albedo, metallic, roughness,\n                                         u_lightColors[i], u_lightIntensities[i],\n                                         attenuation);\n        \n        Lo += radiance * (1.0 - shadow);\n    }\n    \n    // Calculate ambient lighting with environment mapping\n    vec3 ambient = vec3(0.03) * albedo; // Default ambient if no environment map\n    \n    // Apply ambient light from light sources\n    vec3 ambientContribution = vec3(0.0);\n    for(int i = 0; i < u_numLights; i++) {\n        if(i >= MAX_LIGHTS || u_lightTypes[i] != LIGHT_TYPE_AMBIENT) \n            continue;\n        \n        // Add ambient light contribution with light color and intensity\n        // Scale down the intensity significantly (divide by 3) to make it much more subtle\n        // This means a value of 1.0 is now only 33% as bright as before\n        ambientContribution += u_lightColors[i] * (min(u_lightIntensities[i], 1.0) / 3.0) * albedo;\n    }\n    \n    if (u_useEnvironmentMap) {\n        // Sample both the prefilter map and the BRDF lut and combine them together\n        vec3 F = fresnelSchlickRoughness(max(dot(N, V), 0.0), F0, roughness);\n        \n        vec3 kS = F;\n        vec3 kD = 1.0 - kS;\n        kD *= 1.0 - metallic;\n        \n        // Sample irradiance map for diffuse IBL\n        vec3 irradiance = texture(u_irradianceMap, N).rgb;\n        vec3 diffuse = irradiance * albedo;\n        \n        // Sample environment map with roughness-based LOD for specular IBL\n        vec3 prefilteredColor = textureLod(u_prefilterMap, R, roughness * MAX_REFLECTION_LOD).rgb;\n        vec2 brdf = texture(u_brdfLUT, vec2(max(dot(N, V), 0.0), roughness)).rg;\n        vec3 specular = prefilteredColor * (F * brdf.x + brdf.y);\n\n        // Add perfect reflection from environment map when roughness is very low\n        float perfectReflectionWeight = (1.0 - roughness) * (1.0 - roughness) * (1.0 - roughness) * (1.0 - roughness); // Stronger falloff\n        if (perfectReflectionWeight > 0.001) {\n            vec3 perfectReflection = texture(u_environmentMap, R).rgb;\n            specular = mix(specular, perfectReflection, perfectReflectionWeight * metallic);\n        }\n\n        // Apply environment map for ambient\n        ambient = (kD * diffuse + specular) * ao;\n        \n        // Add extremely subtle ambient contribution that preserves reflections\n        if (length(ambientContribution) > 0.0) {\n            // Use a very light mix that strongly favors environment mapping\n            // Non-metallic surfaces get slightly more ambient\n            float mixFactor = 0.85 + (metallic * 0.1); // 0.85-0.95 range based on metallic\n            ambient = mix(ambientContribution, ambient, mixFactor);\n        }\n    } else {\n        // If no environment map, use only ambient contribution (already scaled down)\n        ambient = ambientContribution;\n    }\n\n    // Combine all lighting contributions\n    vec3 color = ambient + Lo + emissive;\n\n    // Calculate rim lighting based on lights in the scene\n    vec3 rimColor = vec3(0.0);\n    float rimPower = 3.0; // Controls how sharp the rim effect is\n    float viewFacing = 1.0 - max(dot(N, V), 0.0);\n    \n    // Add rim contribution from each light\n    for(int i = 0; i < u_numLights; i++) {\n        if(i >= MAX_LIGHTS || u_lightTypes[i] == LIGHT_TYPE_INACTIVE || u_lightTypes[i] == LIGHT_TYPE_AMBIENT) \n            continue;\n            \n        vec3 L;\n        float rimStrength = 0.0;\n        \n        if (u_lightTypes[i] == LIGHT_TYPE_DIRECTIONAL) {\n            L = normalize(-u_lightDirections[i]);\n            rimStrength = u_lightIntensities[i] * 0.3; // Scale rim by light intensity\n        } \n        else if (u_lightTypes[i] == LIGHT_TYPE_POINT || u_lightTypes[i] == LIGHT_TYPE_SPOT) {\n            vec3 lightToPos = v_worldPos - u_lightPositions[i];\n            L = normalize(lightToPos);\n            \n            // Rim strength falls off with distance\n            float distance = length(lightToPos);\n            float attenuation = 1.0 / (u_lightConstants[i] + \n                                     u_lightLinears[i] * distance + \n                                     u_lightQuadratics[i] * distance * distance);\n                                     \n            rimStrength = u_lightIntensities[i] * attenuation * 0.3;\n            \n            // For spotlights, consider the cone angle\n            if (u_lightTypes[i] == LIGHT_TYPE_SPOT) {\n                float theta = dot(-L, normalize(u_lightDirections[i]));\n                float epsilon = u_lightCutOffs[i] - u_lightOuterCutOffs[i];\n                rimStrength *= clamp((theta - u_lightOuterCutOffs[i]) / epsilon, 0.0, 1.0);\n            }\n        }\n        \n        // Calculate rim contribution from this light\n        float lightRim = pow(viewFacing * max(dot(L, N), 0.0), rimPower) * rimStrength;\n        rimColor += u_lightColors[i] * lightRim;\n    }\n    \n    // Add rim lighting to final color\n    color += rimColor * albedo;\n\n    // Enhance colored light visibility\n    color = mix(color, color * 1.2, metallic);\n\n    // Prevent oversaturation by clamping extremely bright values\n    float maxLuminance = max(max(color.r, color.g), color.b);\n    if (maxLuminance > 10.0) {\n        color *= 10.0 / maxLuminance;\n    }\n\n    // Apply ACES filmic tone mapping for better dynamic range\n    // Source: https://knarkowicz.wordpress.com/2016/01/06/aces-filmic-tone-mapping-curve/\n    vec3 mapped = (color * (2.51 * color + 0.03)) / (color * (2.43 * color + 0.59) + 0.14);\n    mapped = clamp(mapped, 0.0, 1.0);\n\n    // Gamma correction\n    color = pow(mapped, vec3(1.0/2.2));\n\n    fragColor = vec4(color, 1.0);\n}";

// ts/classes/webgl2/shaders/debugDepthShader.ts
var debugDepthVertexShader = "#version 300 es\nprecision highp float;\n\nin vec2 a_position;\nin vec2 a_texCoord;\n\nout vec2 v_texCoord;\n\nvoid main() {\n    v_texCoord = a_texCoord;\n    gl_Position = vec4(a_position, 0.0, 1.0);\n}\n";
var debugDepthFragmentShader = "#version 300 es\nprecision highp float;\n\nuniform sampler2D u_texture;\nin vec2 v_texCoord;\nout vec4 fragColor;\n\nvoid main() {\n    float depth = texture(u_texture, v_texCoord).r;\n    \n    // Output raw depth values for better debugging\n    // Don't apply any transformations to better see the actual values\n    if (depth == 0.0) {\n        // Show black for zero depth - may indicate problems\n        fragColor = vec4(0.0, 0.0, 0.0, 1.0);\n    } else if (depth >= 1.0) {\n        // Show white for maximum depth\n        fragColor = vec4(1.0, 1.0, 1.0, 1.0);\n    } else {\n        // Apply gray scale for full depth range\n        fragColor = vec4(vec3(depth), 1.0);\n        \n        // Add grid lines for depth value reference\n        vec2 grid = fract(v_texCoord * 10.0);\n        float line = 0.05;\n        if (grid.x < line || grid.y < line) {\n            // Add slight color to grid lines\n            fragColor.rgb = mix(fragColor.rgb, vec3(0.5, 0.5, 1.0), 0.2);\n        }\n    }\n}\n";

// ts/classes/webgl2/initialise.ts
var WebGL2Initializer = class {
  constructor(canvas) {
    this.ctx = null;
    if (!canvas) {
      throw new Error("Canvas not found");
    }
    this.canvas = canvas;
    this.ctx = this.initializeWebGL2();
    this.shaderManager = new ShaderManager(this.ctx);
    this.vao = new VertexArray(this.ctx);
    this.vertexBuffer = new VertexBuffer(this.ctx);
    this.indexBuffer = new IndexBuffer(this.ctx);
    this.shaderManager.loadShaderProgram("basic", vertexShaderSource, fragmentShaderSource);
    this.shaderManager.loadShaderProgram("pbr", pbrVertexShader, pbrFragmentShader);
    this.shaderManager.loadShaderProgram("shadow", shadowVertexShaderSource, "#version 300 es\n            precision highp float;\n            out vec4 fragColor;\n            void main() {\n                // Explicitly output a color (not used) but required for valid fragment shader\n                // The actual depth is written automatically by WebGL\n                fragColor = vec4(1.0, 1.0, 1.0, 1.0);\n            }\n        ");
    this.shaderManager.loadShaderProgram("debug", debugDepthVertexShader, debugDepthFragmentShader);
    this.shaderManager.useProgram("pbr");
    const numLights = 10;
    const types = new Int32Array(numLights);
    const positions = new Float32Array(numLights * 3);
    const directions = new Float32Array(numLights * 3);
    const colors = new Float32Array(numLights * 3);
    const intensities = new Float32Array(numLights);
    const constants = new Float32Array(numLights);
    const linears = new Float32Array(numLights);
    const quadratics = new Float32Array(numLights);
    const cutOffs = new Float32Array(numLights);
    const outerCutOffs = new Float32Array(numLights);
    types.fill(-1);
    constants.fill(1);
    this.shaderManager.setUniform("u_numLights", 0);
    this.shaderManager.setUniform("u_lightTypes", types);
    this.shaderManager.setUniform("u_lightPositions", positions);
    this.shaderManager.setUniform("u_lightDirections", directions);
    this.shaderManager.setUniform("u_lightColors", colors);
    this.shaderManager.setUniform("u_lightIntensities", intensities);
    this.shaderManager.setUniform("u_lightConstants", constants);
    this.shaderManager.setUniform("u_lightLinears", linears);
    this.shaderManager.setUniform("u_lightQuadratics", quadratics);
    this.shaderManager.setUniform("u_lightCutOffs", cutOffs);
    this.shaderManager.setUniform("u_lightOuterCutOffs", outerCutOffs);
    const castsShadow = new Int32Array(numLights);
    const lightSpaceMatrices = new Float32Array(numLights * 16);
    castsShadow.fill(1);
    this.shaderManager.setUniform("u_castsShadow", castsShadow);
    this.shaderManager.setUniform("u_lightSpaceMatrices", lightSpaceMatrices);
    this.shaderManager.setUniform("u_material.baseColor", new Float32Array([0.8, 0.8, 0.8]));
    this.shaderManager.setUniform("u_material.roughness", 0.5);
    this.shaderManager.setUniform("u_material.metallic", 0);
    this.shaderManager.setUniform("u_material.ambientOcclusion", 1);
    this.shaderManager.setUniform("u_material.emissive", new Float32Array([0, 0, 0]));
    this.shaderManager.setUniform("u_material.hasAlbedoMap", 0);
    this.shaderManager.setUniform("u_material.hasNormalMap", 0);
    this.shaderManager.setUniform("u_material.hasMetallicMap", 0);
    this.shaderManager.setUniform("u_material.hasRoughnessMap", 0);
    this.shaderManager.setUniform("u_material.hasAoMap", 0);
    this.shaderManager.setUniform("u_material.hasEmissiveMap", 0);
    this.shaderManager.setUniform("u_useEnvironmentMap", 0);
    this.shaderManager.setUniform("u_environmentMap", 11);
    this.shaderManager.setUniform("u_irradianceMap", 12);
    this.shaderManager.setUniform("u_prefilterMap", 13);
    this.shaderManager.setUniform("u_brdfLUT", 14);
    this.shaderManager.setUniform("u_viewPos", new Float32Array([0, 1, 6]));
    this.ctx.enable(this.ctx.DEPTH_TEST);
    this.ctx.enable(this.ctx.CULL_FACE);
    this.ctx.blendFunc(this.ctx.SRC_ALPHA, this.ctx.ONE_MINUS_SRC_ALPHA);
    this.ctx.enable(this.ctx.BLEND);
  }
  initializeWebGL2() {
    const ctx = this.canvas.getContext("webgl2");
    if (!ctx) {
      throw new Error("WebGL 2 not supported");
    }
    return ctx;
  }
};

// ts/classes/elements/renderer.ts
var Renderer = class extends DomElement {
  constructor() {
    super("canvas");
    this.held = false;
    this.dom.style.position = "absolute";
    this.dom.style.pointerEvents = "all";
    this.dom.style.bottom = "0px";
    this.dom.style.touchAction = "none";
    this.dom.tabIndex = 1;
    this.webgl = new WebGL2Initializer(this.dom);
    window.addEventListener("resize", () => {
      this.resize();
    });
    glob.events.resize = new Events("resize");
    this.dom.addEventListener("mousedown", (e) => {
      this.lastClick = v2(e.offsetX / this.width, e.offsetY / this.height);
    });
    this.dom.addEventListener("touchstart", (e) => {
      this.lastClick = v2(e.touches[0].clientX / this.width, e.touches[0].clientY / this.height);
    });
    this.dom.addEventListener("mousemove", (e) => {
      if (this.lastClick) {
        this.lastClick = v2(e.offsetX / this.width, e.offsetY / this.height);
      }
    });
    this.dom.addEventListener("touchmove", (e) => {
      if (this.lastClick) {
        this.lastClick = v2(e.touches[0].clientX / this.width, e.touches[0].clientY / this.height);
      }
    });
    this.dom.addEventListener("mouseup", (e) => {
      this.lastClick = null;
    });
    this.dom.addEventListener("touchend", (e) => {
      this.lastClick = null;
    });
    this.resize();
  }
  get ctx() {
    return this.webgl.ctx;
  }
  get shaderManager() {
    return this.webgl.shaderManager;
  }
  resize() {
    this.size = v2(document.body.clientWidth, document.body.clientHeight);
    this.dom.style.width = "".concat(this.size.x, "px");
    this.dom.setAttribute("width", String(this.size.x));
    this.dom.style.height = "".concat(this.size.y, "px");
    this.dom.setAttribute("height", String(this.size.y));
    glob.events.resize.alert(this.size);
    this.ctx.viewport(0, 0, this.size.x, this.size.y);
  }
  get width() {
    return this.size.x;
  }
  set width(value) {
    this.dom.style.width = "".concat(value, "px");
    this.dom.setAttribute("width", String(value));
    this.size.x = value;
  }
  get height() {
    return this.size.y;
  }
  set height(value) {
    this.dom.style.height = "".concat(value, "px");
    this.dom.setAttribute("height", String(value));
    this.size.y = value;
  }
  tick(obj) {
    var _a, _b, _c;
    super.tick(obj);
    this.tickerData = obj;
    if (this.lastClick) {
      (_a = glob.game.active) == null ? void 0 : _a.click(this.lastClick);
    }
    (_b = glob.game.active) == null ? void 0 : _b.tick(obj);
    (_c = glob.game.active) == null ? void 0 : _c.afterTick(obj);
  }
};

// ts/classes/input/gamepad.ts
var Pad = class {
  constructor(gamepad) {
    this.gamepad = gamepad;
  }
  tick() {
    this.recentPad = navigator.getGamepads().find((g) => g.id === this.gamepad.id);
  }
};

// ts/classes/input/gamepadManager.ts
var PadManager = class {
  constructor() {
    this.pads = {};
    window.addEventListener("gamepadconnected", this.connect.bind(this));
    window.addEventListener("gamepaddisconnected", this.disconnect.bind(this));
  }
  connect(e) {
    this.pads[e.gamepad.id] = new Pad(e.gamepad);
  }
  disconnect(e) {
    delete this.pads[e.gamepad.id];
  }
  tick() {
    Object.values(this.pads).forEach((pad) => {
      pad.tick();
    });
  }
};

// ts/classes/input/input.ts
var InputReader = class {
  tick() {
  }
};
var Input = class {
  constructor(readers) {
    this.readers = readers;
  }
  tick() {
    this.readers.forEach((r) => {
      r.tick();
    });
  }
};
var JoyStick = class extends Input {
  get value() {
    let total = v2(0);
    this.readers.forEach((r) => {
      total = total.add(r.value);
    });
    return total;
  }
};
var Button = class extends Input {
  get value() {
    let total = 0;
    this.readers.forEach((r) => {
      total += r.value;
    });
    return total;
  }
};
var InputMap = class {
  constructor(joysticks = {}, buttons = {}) {
    this.joysticks = {};
    this.buttons = {};
    Object.entries(joysticks).forEach(([key, readers]) => {
      this.joysticks[key] = new JoyStick(readers);
    });
    Object.entries(buttons).forEach(([key, readers]) => {
      this.buttons[key] = new Button(readers);
    });
  }
  tick() {
    Object.values(this.joysticks).forEach((j) => {
      j.tick();
    });
    Object.values(this.buttons).forEach((j) => {
      j.tick();
    });
  }
  axis(key) {
    var _a;
    return (_a = this.joysticks[key]) == null ? void 0 : _a.value;
  }
  button(key) {
    var _a;
    return (_a = this.buttons[key]) == null ? void 0 : _a.value;
  }
};

// ts/classes/elements/domText.ts
var DomText = class extends DomElement {
  set color(v) {
    this.dom.style.color = v;
  }
  set fontSize(v) {
    this.dom.style.fontSize = String(v) + "px";
  }
  set fontWeight(v) {
    this.dom.style.fontWeight = String(v);
  }
  set fontFamily(v) {
    this.dom.style.fontFamily = v;
  }
  get text() {
    return this.dom.innerHTML;
  }
  set text(v) {
    this.dom.innerHTML = v ? v : "";
  }
  set padding(v) {
    this.dom.style.padding = v.join("px ") + "px";
  }
  constructor(attr = {}) {
    super("div", attr);
    this.color = attr.color;
    this.text = attr.text;
    this.fontSize = attr.fontSize;
    this.fontWeight = attr.fontWeight;
    this.fontFamily = attr.fontFamily;
    this.padding = attr.padding || [0, 0, 0, 0];
    this.dom.style.pointerEvents = "none";
    this.dom.style.userSelect = "none";
    this.dom.style.zIndex = "1";
    this.dom.style.whiteSpace = "pre-line";
  }
};

// ts/classes/input/inputDevices.ts
var Keyboard = class {
  constructor() {
    this.keyDown = {};
    this.keyUp = {};
  }
  ready() {
    glob.renderer.dom.addEventListener("keydown", (e) => {
      var _a;
      const k = e.key.toLowerCase();
      (_a = this.keyDown[k]) == null ? void 0 : _a.forEach((c) => {
        c(glob.frame);
      });
    });
    glob.renderer.dom.addEventListener("keyup", (e) => {
      var _a;
      const k = e.key.toLowerCase();
      (_a = this.keyUp[k]) == null ? void 0 : _a.forEach((c) => {
        c();
      });
    });
  }
  register(key, down, up) {
    const k = key.toLowerCase();
    if (this.keyDown[k])
      this.keyDown[k].push(down);
    else
      this.keyDown[k] = [down];
    if (this.keyUp[k])
      this.keyUp[k].push(up);
    else
      this.keyUp[k] = [up];
  }
};
var InputDevices = class {
  constructor() {
    this.keyboard = new Keyboard();
    this.overlay = new DomText({
      text: "Pauzed"
    });
    this.overlay.dom.setAttribute(
      "style",
      "\n            transform-origin: left bottom;\n            pointer-events: none;\n            bottom: 0px;\n            left: 0px;\n            user-select: none;\n            z-index: 999;\n            position: absolute;\n            height: 100vh;\n            width: 100vw;\n            color: white !important;\n            font-family: monospace;\n            font-weight: bold;\n            font-size: 40px;\n            padding-left: 50px;\n            padding-top: 20px;\n            box-sizing: border-box;\n            display: none;\n            text-transform: uppercase;"
    );
  }
  get locked() {
    return this._locked;
  }
  set locked(value) {
    this._locked = value;
  }
  ready() {
    window.addEventListener("contextmenu", (e) => e.preventDefault());
    this.mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (this.mobile) {
      this.locked = true;
    } else {
      document.body.appendChild(this.overlay.dom);
    }
    this.keyboard.ready();
  }
};

// ts/classes/util/utils.ts
var Util = class {
  static clamp(value, min2, max2) {
    return Math.max(Math.min(value, max2), min2);
  }
  static to0(value, tolerance = 0.1) {
    return Math.abs(value) < tolerance ? 0 : value;
  }
  static chunk(array, size) {
    const output = [];
    for (let i = 0; i < array.length; i += size) {
      output.push(array.slice(i, i + size));
    }
    return output;
  }
  static duplicate(array, size) {
    const output = [];
    array.forEach((v) => {
      for (let i = 0; i < size; i++) {
        output.push(v);
      }
    });
    return output;
  }
  static padArray(ar, b, len2) {
    return ar.concat(Array.from(Array(len2).fill(b))).slice(0, len2);
  }
  static addArrays(ar, br) {
    return ar.map((a, i) => a + br[i]);
  }
  static subtractArrays(ar, br) {
    return ar.map((a, i) => a - br[i]);
  }
  static multiplyArrays(ar, br) {
    return ar.map((a, i) => a * br[i]);
  }
  static scaleArrays(ar, b) {
    return ar.map((a, i) => a * b);
  }
  static radToDeg(r) {
    return r * 180 / Math.PI;
  }
  static degToRad(d) {
    return d * Math.PI / 180;
  }
  static closestVectorMagnitude(vectors, target) {
    let current;
    vectors.forEach((v) => {
      if (current === void 0 || Math.abs(v.magnitude()) < Math.abs(current.magnitude()))
        current = v;
    });
    return current;
  }
};

// ts/classes/util/math/vector3.ts
function v3(a, b, c) {
  if (typeof a === "number") {
    return Vector3.f(a, b, c);
  } else if (typeof a === "undefined") {
    return Vector3.f(0);
  } else {
    return Vector3.f(...a);
  }
}
var Vector3 = class _Vector3 {
  get pitch() {
    return this.x;
  }
  set pitch(value) {
    this.x = value;
  }
  get yaw() {
    return this.y;
  }
  set yaw(value) {
    this.y = value;
  }
  get roll() {
    return this.z;
  }
  set roll(value) {
    this.z = value;
  }
  get x() {
    return this.vec[0];
  }
  set x(value) {
    this.vec[0] = value;
  }
  get y() {
    return this.vec[1];
  }
  set y(value) {
    this.vec[1] = value;
  }
  get z() {
    return this.vec[2];
  }
  set z(value) {
    this.vec[2] = value;
  }
  get xy() {
    return v2(this.x, this.y);
  }
  set xy(v) {
    this.x = v.x;
    this.y = v.y;
  }
  get xz() {
    return v2(this.x, this.z);
  }
  set xz(v) {
    this.x = v.x;
    this.z = v.y;
  }
  get yx() {
    return v2(this.y, this.x);
  }
  set yx(v) {
    this.y = v.x;
    this.x = v.y;
  }
  get yz() {
    return v2(this.y, this.z);
  }
  set yz(v) {
    this.y = v.x;
    this.z = v.y;
  }
  get zx() {
    return v2(this.z, this.x);
  }
  set zx(v) {
    this.z = v.x;
    this.x = v.y;
  }
  get zy() {
    return v2(this.z, this.y);
  }
  set zy(v) {
    this.z = v.x;
    this.y = v.y;
  }
  get xzy() {
    return v3(this.x, this.z, this.y);
  }
  set xzy(v) {
    this.x = v.x;
    this.z = v.y;
    this.y = v.z;
  }
  get xyz() {
    return v3(this.x, this.y, this.z);
  }
  set xyz(v) {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
  }
  get yxz() {
    return v3(this.y, this.x, this.z);
  }
  set yxz(v) {
    this.y = v.x;
    this.x = v.y;
    this.z = v.z;
  }
  get yzx() {
    return v3(this.y, this.z, this.x);
  }
  set yzx(v) {
    this.y = v.x;
    this.z = v.y;
    this.x = v.z;
  }
  get zxy() {
    return v3(this.z, this.x, this.y);
  }
  set zxy(v) {
    this.z = v.x;
    this.x = v.y;
    this.y = v.z;
  }
  get zyx() {
    return v3(this.z, this.y, this.x);
  }
  set zyx(v) {
    this.z = v.x;
    this.y = v.y;
    this.x = v.z;
  }
  get str() {
    return this.vec.toString();
  }
  constructor(x = 0, y = 0, z = 0) {
    this.vec = [x, y, z];
  }
  static from2(vector, z = 0) {
    return new _Vector3(vector.x, vector.y, z);
  }
  static f(x = 0, y = x, z = x) {
    return new _Vector3(x, y, z);
  }
  static get forwards() {
    return new _Vector3(0, 0, 1);
  }
  static get backwards() {
    return new _Vector3(0, 0, -1);
  }
  static get up() {
    return new _Vector3(0, 1, 0);
  }
  static get down() {
    return new _Vector3(0, -1, 0);
  }
  static get left() {
    return new _Vector3(-1, 0, 0);
  }
  static get right() {
    return new _Vector3(1, 0, 0);
  }
  static get PI() {
    return new _Vector3(Math.PI, Math.PI, Math.PI);
  }
  static get TAU() {
    return _Vector3.PI.scale(0.5);
  }
  get array() {
    return [this.x, this.y, this.z];
  }
  set array(a) {
    [this.x, this.y, this.z] = a;
  }
  forEach(callbackfn) {
    this.array.forEach(callbackfn);
  }
  get c() {
    return this.clone();
  }
  equals(vector) {
    return this.x === vector.x && this.y === vector.y && this.z === vector.z;
  }
  clone() {
    return new _Vector3(
      this.x,
      this.y,
      this.z
    );
  }
  add(...vectors) {
    return new _Vector3(
      this.x + vectors.reduce((a, b) => a + b.x, 0),
      this.y + vectors.reduce((a, b) => a + b.y, 0),
      this.z + vectors.reduce((a, b) => a + b.z, 0)
    );
  }
  multiply(a, b, c) {
    const [x, y, z] = typeof a === "number" ? [a, b, c] : a.array;
    return new _Vector3(
      this.x * x,
      this.y * y,
      this.z * z
    );
  }
  subtract(...vectors) {
    return new _Vector3(
      this.x - vectors.reduce((a, b) => a + b.x, 0),
      this.y - vectors.reduce((a, b) => a + b.y, 0),
      this.z - vectors.reduce((a, b) => a + b.z, 0)
    );
  }
  scale(...scalars) {
    return new _Vector3(
      this.x * scalars.reduce((a, b) => a * b, 1),
      this.y * scalars.reduce((a, b) => a * b, 1),
      this.z * scalars.reduce((a, b) => a * b, 1)
    );
  }
  divide(...vectors) {
    return new _Vector3(
      this.x / vectors.reduce((a, b) => a * b.x, 1),
      this.y / vectors.reduce((a, b) => a * b.y, 1),
      this.z / vectors.reduce((a, b) => a * b.z, 1)
    );
  }
  rotateXY(rad) {
    const [a, b] = this.xy.rotate(rad).array;
    return new _Vector3(
      a,
      b,
      this.z
    );
  }
  rotateXZ(rad) {
    const [a, b] = this.xz.rotate(rad).array;
    return new _Vector3(
      a,
      this.y,
      b
    );
  }
  rotateYZ(rad) {
    const [a, b] = this.yz.rotate(rad).array;
    return new _Vector3(
      this.x,
      a,
      b
    );
  }
  magnitude() {
    return Math.sqrt(this.magnitudeSqr());
  }
  magnitudeSqr() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }
  mod(max2) {
    return new _Vector3(
      this.x % max2.x,
      this.y % max2.y,
      this.z % max2.z
    );
  }
  clamp(min2, max2) {
    return new _Vector3(
      Util.clamp(this.x, min2.x, max2.x),
      Util.clamp(this.y, min2.y, max2.y),
      Util.clamp(this.z, min2.z, max2.z)
    );
  }
  normalize() {
    let len2 = this.x * this.x + this.y * this.y + this.z * this.z;
    if (len2 > 0) {
      len2 = 1 / Math.sqrt(len2);
    }
    return v3(
      this.x * len2,
      this.y * len2,
      this.z * len2
    );
  }
  applyQuaternion(q) {
    const x = this.x;
    const y = this.y;
    const z = this.z;
    const qx = q.x;
    const qy = q.y;
    const qz = q.z;
    const qw = q.w;
    const ix = qw * x + qy * z - qz * y;
    const iy = qw * y + qz * x - qx * z;
    const iz = qw * z + qx * y - qy * x;
    const iw = -qx * x - qy * y - qz * z;
    return new _Vector3(
      ix * qw + iw * -qx + iy * -qz - iz * -qy,
      iy * qw + iw * -qy + iz * -qx - ix * -qz,
      iz * qw + iw * -qz + ix * -qy - iy * -qx
    );
  }
  cross(other) {
    return new _Vector3(
      this.y * other.z - this.z * other.y,
      this.z * other.x - this.x * other.z,
      this.x * other.y - this.y * other.x
    );
  }
  dot(other) {
    return this.x * other.x + this.y * other.y + this.z * other.z;
  }
  /**
   * Converts a screen space coordinate to a world position on a plane
   * @param screenPos Screen position in normalized coordinates (0-1)
   * @param camera Camera used for the projection
   * @param planeNormal Normal vector of the plane (must be normalized)
   * @param planeCoordinate The world coordinate value where the plane intersects the axis defined by the normal
   * @returns World position where the ray intersects the plane, or null if ray is parallel to plane
   */
  static screenToWorldPlane(screenPos, camera, planeNormal, planeCoordinate) {
    const ndcX = screenPos.x * 2 - 1;
    const ndcY = (1 - screenPos.y) * 2 - 1;
    const projMatrix = camera.getProjectionMatrix();
    const viewMatrix = camera.getViewMatrix();
    const invProj = projMatrix.clone().invert();
    const invView = viewMatrix.clone().invert();
    const nearPoint = v3(ndcX, ndcY, -1);
    const rayDir = v3(
      invProj.mat4[0] * nearPoint.x + invProj.mat4[4] * nearPoint.y + invProj.mat4[8] * nearPoint.z + invProj.mat4[12],
      invProj.mat4[1] * nearPoint.x + invProj.mat4[5] * nearPoint.y + invProj.mat4[9] * nearPoint.z + invProj.mat4[13],
      invProj.mat4[2] * nearPoint.x + invProj.mat4[6] * nearPoint.y + invProj.mat4[10] * nearPoint.z + invProj.mat4[14]
    ).normalize();
    const worldRayDir = v3(
      invView.mat4[0] * rayDir.x + invView.mat4[4] * rayDir.y + invView.mat4[8] * rayDir.z,
      invView.mat4[1] * rayDir.x + invView.mat4[5] * rayDir.y + invView.mat4[9] * rayDir.z,
      invView.mat4[2] * rayDir.x + invView.mat4[6] * rayDir.y + invView.mat4[10] * rayDir.z
    ).normalize();
    const rayOrigin = camera.getPosition();
    const denom = worldRayDir.dot(planeNormal);
    if (Math.abs(denom) < 1e-6) {
      return null;
    }
    const planePoint = planeNormal.scale(planeCoordinate);
    const t = planePoint.subtract(rayOrigin).dot(planeNormal) / denom;
    return rayOrigin.add(worldRayDir.scale(t));
  }
};

// node_modules/gl-matrix/esm/common.js
var EPSILON = 1e-6;
var ARRAY_TYPE = typeof Float32Array !== "undefined" ? Float32Array : Array;
var RANDOM = Math.random;
var degree = Math.PI / 180;
if (!Math.hypot)
  Math.hypot = function() {
    var y = 0, i = arguments.length;
    while (i--) {
      y += arguments[i] * arguments[i];
    }
    return Math.sqrt(y);
  };

// node_modules/gl-matrix/esm/mat4.js
var mat4_exports = {};
__export(mat4_exports, {
  add: () => add,
  adjoint: () => adjoint,
  clone: () => clone,
  copy: () => copy,
  create: () => create,
  determinant: () => determinant,
  equals: () => equals,
  exactEquals: () => exactEquals,
  frob: () => frob,
  fromQuat: () => fromQuat,
  fromQuat2: () => fromQuat2,
  fromRotation: () => fromRotation,
  fromRotationTranslation: () => fromRotationTranslation,
  fromRotationTranslationScale: () => fromRotationTranslationScale,
  fromRotationTranslationScaleOrigin: () => fromRotationTranslationScaleOrigin,
  fromScaling: () => fromScaling,
  fromTranslation: () => fromTranslation,
  fromValues: () => fromValues,
  fromXRotation: () => fromXRotation,
  fromYRotation: () => fromYRotation,
  fromZRotation: () => fromZRotation,
  frustum: () => frustum,
  getRotation: () => getRotation,
  getScaling: () => getScaling,
  getTranslation: () => getTranslation,
  identity: () => identity,
  invert: () => invert,
  lookAt: () => lookAt,
  mul: () => mul,
  multiply: () => multiply,
  multiplyScalar: () => multiplyScalar,
  multiplyScalarAndAdd: () => multiplyScalarAndAdd,
  ortho: () => ortho,
  orthoNO: () => orthoNO,
  orthoZO: () => orthoZO,
  perspective: () => perspective,
  perspectiveFromFieldOfView: () => perspectiveFromFieldOfView,
  perspectiveNO: () => perspectiveNO,
  perspectiveZO: () => perspectiveZO,
  rotate: () => rotate,
  rotateX: () => rotateX,
  rotateY: () => rotateY,
  rotateZ: () => rotateZ,
  scale: () => scale,
  set: () => set,
  str: () => str,
  sub: () => sub,
  subtract: () => subtract,
  targetTo: () => targetTo,
  translate: () => translate,
  transpose: () => transpose
});
function create() {
  var out = new ARRAY_TYPE(16);
  if (ARRAY_TYPE != Float32Array) {
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
  }
  out[0] = 1;
  out[5] = 1;
  out[10] = 1;
  out[15] = 1;
  return out;
}
function clone(a) {
  var out = new ARRAY_TYPE(16);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  out[9] = a[9];
  out[10] = a[10];
  out[11] = a[11];
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}
function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  out[9] = a[9];
  out[10] = a[10];
  out[11] = a[11];
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}
function fromValues(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
  var out = new ARRAY_TYPE(16);
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m03;
  out[4] = m10;
  out[5] = m11;
  out[6] = m12;
  out[7] = m13;
  out[8] = m20;
  out[9] = m21;
  out[10] = m22;
  out[11] = m23;
  out[12] = m30;
  out[13] = m31;
  out[14] = m32;
  out[15] = m33;
  return out;
}
function set(out, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m03;
  out[4] = m10;
  out[5] = m11;
  out[6] = m12;
  out[7] = m13;
  out[8] = m20;
  out[9] = m21;
  out[10] = m22;
  out[11] = m23;
  out[12] = m30;
  out[13] = m31;
  out[14] = m32;
  out[15] = m33;
  return out;
}
function identity(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
function transpose(out, a) {
  if (out === a) {
    var a01 = a[1], a02 = a[2], a03 = a[3];
    var a12 = a[6], a13 = a[7];
    var a23 = a[11];
    out[1] = a[4];
    out[2] = a[8];
    out[3] = a[12];
    out[4] = a01;
    out[6] = a[9];
    out[7] = a[13];
    out[8] = a02;
    out[9] = a12;
    out[11] = a[14];
    out[12] = a03;
    out[13] = a13;
    out[14] = a23;
  } else {
    out[0] = a[0];
    out[1] = a[4];
    out[2] = a[8];
    out[3] = a[12];
    out[4] = a[1];
    out[5] = a[5];
    out[6] = a[9];
    out[7] = a[13];
    out[8] = a[2];
    out[9] = a[6];
    out[10] = a[10];
    out[11] = a[14];
    out[12] = a[3];
    out[13] = a[7];
    out[14] = a[11];
    out[15] = a[15];
  }
  return out;
}
function invert(out, a) {
  var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
  var b00 = a00 * a11 - a01 * a10;
  var b01 = a00 * a12 - a02 * a10;
  var b02 = a00 * a13 - a03 * a10;
  var b03 = a01 * a12 - a02 * a11;
  var b04 = a01 * a13 - a03 * a11;
  var b05 = a02 * a13 - a03 * a12;
  var b06 = a20 * a31 - a21 * a30;
  var b07 = a20 * a32 - a22 * a30;
  var b08 = a20 * a33 - a23 * a30;
  var b09 = a21 * a32 - a22 * a31;
  var b10 = a21 * a33 - a23 * a31;
  var b11 = a22 * a33 - a23 * a32;
  var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
  if (!det) {
    return null;
  }
  det = 1 / det;
  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
  out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
  out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
  out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
  out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
  out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
  out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
  return out;
}
function adjoint(out, a) {
  var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
  out[0] = a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22);
  out[1] = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
  out[2] = a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12);
  out[3] = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
  out[4] = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
  out[5] = a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22);
  out[6] = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
  out[7] = a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12);
  out[8] = a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21);
  out[9] = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
  out[10] = a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11);
  out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
  out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
  out[13] = a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21);
  out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
  out[15] = a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11);
  return out;
}
function determinant(a) {
  var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
  var b00 = a00 * a11 - a01 * a10;
  var b01 = a00 * a12 - a02 * a10;
  var b02 = a00 * a13 - a03 * a10;
  var b03 = a01 * a12 - a02 * a11;
  var b04 = a01 * a13 - a03 * a11;
  var b05 = a02 * a13 - a03 * a12;
  var b06 = a20 * a31 - a21 * a30;
  var b07 = a20 * a32 - a22 * a30;
  var b08 = a20 * a33 - a23 * a30;
  var b09 = a21 * a32 - a22 * a31;
  var b10 = a21 * a33 - a23 * a31;
  var b11 = a22 * a33 - a23 * a32;
  return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
}
function multiply(out, a, b) {
  var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
  var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
  out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[4];
  b1 = b[5];
  b2 = b[6];
  b3 = b[7];
  out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[8];
  b1 = b[9];
  b2 = b[10];
  b3 = b[11];
  out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[12];
  b1 = b[13];
  b2 = b[14];
  b3 = b[15];
  out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  return out;
}
function translate(out, a, v) {
  var x = v[0], y = v[1], z = v[2];
  var a00, a01, a02, a03;
  var a10, a11, a12, a13;
  var a20, a21, a22, a23;
  if (a === out) {
    out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
    out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
    out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
    out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
  } else {
    a00 = a[0];
    a01 = a[1];
    a02 = a[2];
    a03 = a[3];
    a10 = a[4];
    a11 = a[5];
    a12 = a[6];
    a13 = a[7];
    a20 = a[8];
    a21 = a[9];
    a22 = a[10];
    a23 = a[11];
    out[0] = a00;
    out[1] = a01;
    out[2] = a02;
    out[3] = a03;
    out[4] = a10;
    out[5] = a11;
    out[6] = a12;
    out[7] = a13;
    out[8] = a20;
    out[9] = a21;
    out[10] = a22;
    out[11] = a23;
    out[12] = a00 * x + a10 * y + a20 * z + a[12];
    out[13] = a01 * x + a11 * y + a21 * z + a[13];
    out[14] = a02 * x + a12 * y + a22 * z + a[14];
    out[15] = a03 * x + a13 * y + a23 * z + a[15];
  }
  return out;
}
function scale(out, a, v) {
  var x = v[0], y = v[1], z = v[2];
  out[0] = a[0] * x;
  out[1] = a[1] * x;
  out[2] = a[2] * x;
  out[3] = a[3] * x;
  out[4] = a[4] * y;
  out[5] = a[5] * y;
  out[6] = a[6] * y;
  out[7] = a[7] * y;
  out[8] = a[8] * z;
  out[9] = a[9] * z;
  out[10] = a[10] * z;
  out[11] = a[11] * z;
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}
function rotate(out, a, rad, axis) {
  var x = axis[0], y = axis[1], z = axis[2];
  var len2 = Math.hypot(x, y, z);
  var s, c, t;
  var a00, a01, a02, a03;
  var a10, a11, a12, a13;
  var a20, a21, a22, a23;
  var b00, b01, b02;
  var b10, b11, b12;
  var b20, b21, b22;
  if (len2 < EPSILON) {
    return null;
  }
  len2 = 1 / len2;
  x *= len2;
  y *= len2;
  z *= len2;
  s = Math.sin(rad);
  c = Math.cos(rad);
  t = 1 - c;
  a00 = a[0];
  a01 = a[1];
  a02 = a[2];
  a03 = a[3];
  a10 = a[4];
  a11 = a[5];
  a12 = a[6];
  a13 = a[7];
  a20 = a[8];
  a21 = a[9];
  a22 = a[10];
  a23 = a[11];
  b00 = x * x * t + c;
  b01 = y * x * t + z * s;
  b02 = z * x * t - y * s;
  b10 = x * y * t - z * s;
  b11 = y * y * t + c;
  b12 = z * y * t + x * s;
  b20 = x * z * t + y * s;
  b21 = y * z * t - x * s;
  b22 = z * z * t + c;
  out[0] = a00 * b00 + a10 * b01 + a20 * b02;
  out[1] = a01 * b00 + a11 * b01 + a21 * b02;
  out[2] = a02 * b00 + a12 * b01 + a22 * b02;
  out[3] = a03 * b00 + a13 * b01 + a23 * b02;
  out[4] = a00 * b10 + a10 * b11 + a20 * b12;
  out[5] = a01 * b10 + a11 * b11 + a21 * b12;
  out[6] = a02 * b10 + a12 * b11 + a22 * b12;
  out[7] = a03 * b10 + a13 * b11 + a23 * b12;
  out[8] = a00 * b20 + a10 * b21 + a20 * b22;
  out[9] = a01 * b20 + a11 * b21 + a21 * b22;
  out[10] = a02 * b20 + a12 * b21 + a22 * b22;
  out[11] = a03 * b20 + a13 * b21 + a23 * b22;
  if (a !== out) {
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }
  return out;
}
function rotateX(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a10 = a[4];
  var a11 = a[5];
  var a12 = a[6];
  var a13 = a[7];
  var a20 = a[8];
  var a21 = a[9];
  var a22 = a[10];
  var a23 = a[11];
  if (a !== out) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }
  out[4] = a10 * c + a20 * s;
  out[5] = a11 * c + a21 * s;
  out[6] = a12 * c + a22 * s;
  out[7] = a13 * c + a23 * s;
  out[8] = a20 * c - a10 * s;
  out[9] = a21 * c - a11 * s;
  out[10] = a22 * c - a12 * s;
  out[11] = a23 * c - a13 * s;
  return out;
}
function rotateY(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a00 = a[0];
  var a01 = a[1];
  var a02 = a[2];
  var a03 = a[3];
  var a20 = a[8];
  var a21 = a[9];
  var a22 = a[10];
  var a23 = a[11];
  if (a !== out) {
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }
  out[0] = a00 * c - a20 * s;
  out[1] = a01 * c - a21 * s;
  out[2] = a02 * c - a22 * s;
  out[3] = a03 * c - a23 * s;
  out[8] = a00 * s + a20 * c;
  out[9] = a01 * s + a21 * c;
  out[10] = a02 * s + a22 * c;
  out[11] = a03 * s + a23 * c;
  return out;
}
function rotateZ(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a00 = a[0];
  var a01 = a[1];
  var a02 = a[2];
  var a03 = a[3];
  var a10 = a[4];
  var a11 = a[5];
  var a12 = a[6];
  var a13 = a[7];
  if (a !== out) {
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }
  out[0] = a00 * c + a10 * s;
  out[1] = a01 * c + a11 * s;
  out[2] = a02 * c + a12 * s;
  out[3] = a03 * c + a13 * s;
  out[4] = a10 * c - a00 * s;
  out[5] = a11 * c - a01 * s;
  out[6] = a12 * c - a02 * s;
  out[7] = a13 * c - a03 * s;
  return out;
}
function fromTranslation(out, v) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
}
function fromScaling(out, v) {
  out[0] = v[0];
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = v[1];
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = v[2];
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
function fromRotation(out, rad, axis) {
  var x = axis[0], y = axis[1], z = axis[2];
  var len2 = Math.hypot(x, y, z);
  var s, c, t;
  if (len2 < EPSILON) {
    return null;
  }
  len2 = 1 / len2;
  x *= len2;
  y *= len2;
  z *= len2;
  s = Math.sin(rad);
  c = Math.cos(rad);
  t = 1 - c;
  out[0] = x * x * t + c;
  out[1] = y * x * t + z * s;
  out[2] = z * x * t - y * s;
  out[3] = 0;
  out[4] = x * y * t - z * s;
  out[5] = y * y * t + c;
  out[6] = z * y * t + x * s;
  out[7] = 0;
  out[8] = x * z * t + y * s;
  out[9] = y * z * t - x * s;
  out[10] = z * z * t + c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
function fromXRotation(out, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = c;
  out[6] = s;
  out[7] = 0;
  out[8] = 0;
  out[9] = -s;
  out[10] = c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
function fromYRotation(out, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  out[0] = c;
  out[1] = 0;
  out[2] = -s;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = s;
  out[9] = 0;
  out[10] = c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
function fromZRotation(out, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  out[0] = c;
  out[1] = s;
  out[2] = 0;
  out[3] = 0;
  out[4] = -s;
  out[5] = c;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
function fromRotationTranslation(out, q, v) {
  var x = q[0], y = q[1], z = q[2], w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var xy = x * y2;
  var xz = x * z2;
  var yy = y * y2;
  var yz = y * z2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  out[0] = 1 - (yy + zz);
  out[1] = xy + wz;
  out[2] = xz - wy;
  out[3] = 0;
  out[4] = xy - wz;
  out[5] = 1 - (xx + zz);
  out[6] = yz + wx;
  out[7] = 0;
  out[8] = xz + wy;
  out[9] = yz - wx;
  out[10] = 1 - (xx + yy);
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
}
function fromQuat2(out, a) {
  var translation = new ARRAY_TYPE(3);
  var bx = -a[0], by = -a[1], bz = -a[2], bw = a[3], ax = a[4], ay = a[5], az = a[6], aw = a[7];
  var magnitude = bx * bx + by * by + bz * bz + bw * bw;
  if (magnitude > 0) {
    translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2 / magnitude;
    translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2 / magnitude;
    translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2 / magnitude;
  } else {
    translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2;
    translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2;
    translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2;
  }
  fromRotationTranslation(out, a, translation);
  return out;
}
function getTranslation(out, mat) {
  out[0] = mat[12];
  out[1] = mat[13];
  out[2] = mat[14];
  return out;
}
function getScaling(out, mat) {
  var m11 = mat[0];
  var m12 = mat[1];
  var m13 = mat[2];
  var m21 = mat[4];
  var m22 = mat[5];
  var m23 = mat[6];
  var m31 = mat[8];
  var m32 = mat[9];
  var m33 = mat[10];
  out[0] = Math.hypot(m11, m12, m13);
  out[1] = Math.hypot(m21, m22, m23);
  out[2] = Math.hypot(m31, m32, m33);
  return out;
}
function getRotation(out, mat) {
  var scaling = new ARRAY_TYPE(3);
  getScaling(scaling, mat);
  var is1 = 1 / scaling[0];
  var is2 = 1 / scaling[1];
  var is3 = 1 / scaling[2];
  var sm11 = mat[0] * is1;
  var sm12 = mat[1] * is2;
  var sm13 = mat[2] * is3;
  var sm21 = mat[4] * is1;
  var sm22 = mat[5] * is2;
  var sm23 = mat[6] * is3;
  var sm31 = mat[8] * is1;
  var sm32 = mat[9] * is2;
  var sm33 = mat[10] * is3;
  var trace = sm11 + sm22 + sm33;
  var S = 0;
  if (trace > 0) {
    S = Math.sqrt(trace + 1) * 2;
    out[3] = 0.25 * S;
    out[0] = (sm23 - sm32) / S;
    out[1] = (sm31 - sm13) / S;
    out[2] = (sm12 - sm21) / S;
  } else if (sm11 > sm22 && sm11 > sm33) {
    S = Math.sqrt(1 + sm11 - sm22 - sm33) * 2;
    out[3] = (sm23 - sm32) / S;
    out[0] = 0.25 * S;
    out[1] = (sm12 + sm21) / S;
    out[2] = (sm31 + sm13) / S;
  } else if (sm22 > sm33) {
    S = Math.sqrt(1 + sm22 - sm11 - sm33) * 2;
    out[3] = (sm31 - sm13) / S;
    out[0] = (sm12 + sm21) / S;
    out[1] = 0.25 * S;
    out[2] = (sm23 + sm32) / S;
  } else {
    S = Math.sqrt(1 + sm33 - sm11 - sm22) * 2;
    out[3] = (sm12 - sm21) / S;
    out[0] = (sm31 + sm13) / S;
    out[1] = (sm23 + sm32) / S;
    out[2] = 0.25 * S;
  }
  return out;
}
function fromRotationTranslationScale(out, q, v, s) {
  var x = q[0], y = q[1], z = q[2], w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var xy = x * y2;
  var xz = x * z2;
  var yy = y * y2;
  var yz = y * z2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  var sx = s[0];
  var sy = s[1];
  var sz = s[2];
  out[0] = (1 - (yy + zz)) * sx;
  out[1] = (xy + wz) * sx;
  out[2] = (xz - wy) * sx;
  out[3] = 0;
  out[4] = (xy - wz) * sy;
  out[5] = (1 - (xx + zz)) * sy;
  out[6] = (yz + wx) * sy;
  out[7] = 0;
  out[8] = (xz + wy) * sz;
  out[9] = (yz - wx) * sz;
  out[10] = (1 - (xx + yy)) * sz;
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
}
function fromRotationTranslationScaleOrigin(out, q, v, s, o) {
  var x = q[0], y = q[1], z = q[2], w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var xy = x * y2;
  var xz = x * z2;
  var yy = y * y2;
  var yz = y * z2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  var sx = s[0];
  var sy = s[1];
  var sz = s[2];
  var ox = o[0];
  var oy = o[1];
  var oz = o[2];
  var out0 = (1 - (yy + zz)) * sx;
  var out1 = (xy + wz) * sx;
  var out2 = (xz - wy) * sx;
  var out4 = (xy - wz) * sy;
  var out5 = (1 - (xx + zz)) * sy;
  var out6 = (yz + wx) * sy;
  var out8 = (xz + wy) * sz;
  var out9 = (yz - wx) * sz;
  var out10 = (1 - (xx + yy)) * sz;
  out[0] = out0;
  out[1] = out1;
  out[2] = out2;
  out[3] = 0;
  out[4] = out4;
  out[5] = out5;
  out[6] = out6;
  out[7] = 0;
  out[8] = out8;
  out[9] = out9;
  out[10] = out10;
  out[11] = 0;
  out[12] = v[0] + ox - (out0 * ox + out4 * oy + out8 * oz);
  out[13] = v[1] + oy - (out1 * ox + out5 * oy + out9 * oz);
  out[14] = v[2] + oz - (out2 * ox + out6 * oy + out10 * oz);
  out[15] = 1;
  return out;
}
function fromQuat(out, q) {
  var x = q[0], y = q[1], z = q[2], w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var yx = y * x2;
  var yy = y * y2;
  var zx = z * x2;
  var zy = z * y2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  out[0] = 1 - yy - zz;
  out[1] = yx + wz;
  out[2] = zx - wy;
  out[3] = 0;
  out[4] = yx - wz;
  out[5] = 1 - xx - zz;
  out[6] = zy + wx;
  out[7] = 0;
  out[8] = zx + wy;
  out[9] = zy - wx;
  out[10] = 1 - xx - yy;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
function frustum(out, left, right, bottom, top, near, far) {
  var rl = 1 / (right - left);
  var tb = 1 / (top - bottom);
  var nf = 1 / (near - far);
  out[0] = near * 2 * rl;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = near * 2 * tb;
  out[6] = 0;
  out[7] = 0;
  out[8] = (right + left) * rl;
  out[9] = (top + bottom) * tb;
  out[10] = (far + near) * nf;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[14] = far * near * 2 * nf;
  out[15] = 0;
  return out;
}
function perspectiveNO(out, fovy, aspect, near, far) {
  var f = 1 / Math.tan(fovy / 2), nf;
  out[0] = f / aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[15] = 0;
  if (far != null && far !== Infinity) {
    nf = 1 / (near - far);
    out[10] = (far + near) * nf;
    out[14] = 2 * far * near * nf;
  } else {
    out[10] = -1;
    out[14] = -2 * near;
  }
  return out;
}
var perspective = perspectiveNO;
function perspectiveZO(out, fovy, aspect, near, far) {
  var f = 1 / Math.tan(fovy / 2), nf;
  out[0] = f / aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[15] = 0;
  if (far != null && far !== Infinity) {
    nf = 1 / (near - far);
    out[10] = far * nf;
    out[14] = far * near * nf;
  } else {
    out[10] = -1;
    out[14] = -near;
  }
  return out;
}
function perspectiveFromFieldOfView(out, fov, near, far) {
  var upTan = Math.tan(fov.upDegrees * Math.PI / 180);
  var downTan = Math.tan(fov.downDegrees * Math.PI / 180);
  var leftTan = Math.tan(fov.leftDegrees * Math.PI / 180);
  var rightTan = Math.tan(fov.rightDegrees * Math.PI / 180);
  var xScale = 2 / (leftTan + rightTan);
  var yScale = 2 / (upTan + downTan);
  out[0] = xScale;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = yScale;
  out[6] = 0;
  out[7] = 0;
  out[8] = -((leftTan - rightTan) * xScale * 0.5);
  out[9] = (upTan - downTan) * yScale * 0.5;
  out[10] = far / (near - far);
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[14] = far * near / (near - far);
  out[15] = 0;
  return out;
}
function orthoNO(out, left, right, bottom, top, near, far) {
  var lr = 1 / (left - right);
  var bt = 1 / (bottom - top);
  var nf = 1 / (near - far);
  out[0] = -2 * lr;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = -2 * bt;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 2 * nf;
  out[11] = 0;
  out[12] = (left + right) * lr;
  out[13] = (top + bottom) * bt;
  out[14] = (far + near) * nf;
  out[15] = 1;
  return out;
}
var ortho = orthoNO;
function orthoZO(out, left, right, bottom, top, near, far) {
  var lr = 1 / (left - right);
  var bt = 1 / (bottom - top);
  var nf = 1 / (near - far);
  out[0] = -2 * lr;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = -2 * bt;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = nf;
  out[11] = 0;
  out[12] = (left + right) * lr;
  out[13] = (top + bottom) * bt;
  out[14] = near * nf;
  out[15] = 1;
  return out;
}
function lookAt(out, eye, center, up) {
  var x0, x1, x2, y0, y1, y2, z0, z1, z2, len2;
  var eyex = eye[0];
  var eyey = eye[1];
  var eyez = eye[2];
  var upx = up[0];
  var upy = up[1];
  var upz = up[2];
  var centerx = center[0];
  var centery = center[1];
  var centerz = center[2];
  if (Math.abs(eyex - centerx) < EPSILON && Math.abs(eyey - centery) < EPSILON && Math.abs(eyez - centerz) < EPSILON) {
    return identity(out);
  }
  z0 = eyex - centerx;
  z1 = eyey - centery;
  z2 = eyez - centerz;
  len2 = 1 / Math.hypot(z0, z1, z2);
  z0 *= len2;
  z1 *= len2;
  z2 *= len2;
  x0 = upy * z2 - upz * z1;
  x1 = upz * z0 - upx * z2;
  x2 = upx * z1 - upy * z0;
  len2 = Math.hypot(x0, x1, x2);
  if (!len2) {
    x0 = 0;
    x1 = 0;
    x2 = 0;
  } else {
    len2 = 1 / len2;
    x0 *= len2;
    x1 *= len2;
    x2 *= len2;
  }
  y0 = z1 * x2 - z2 * x1;
  y1 = z2 * x0 - z0 * x2;
  y2 = z0 * x1 - z1 * x0;
  len2 = Math.hypot(y0, y1, y2);
  if (!len2) {
    y0 = 0;
    y1 = 0;
    y2 = 0;
  } else {
    len2 = 1 / len2;
    y0 *= len2;
    y1 *= len2;
    y2 *= len2;
  }
  out[0] = x0;
  out[1] = y0;
  out[2] = z0;
  out[3] = 0;
  out[4] = x1;
  out[5] = y1;
  out[6] = z1;
  out[7] = 0;
  out[8] = x2;
  out[9] = y2;
  out[10] = z2;
  out[11] = 0;
  out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
  out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
  out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
  out[15] = 1;
  return out;
}
function targetTo(out, eye, target, up) {
  var eyex = eye[0], eyey = eye[1], eyez = eye[2], upx = up[0], upy = up[1], upz = up[2];
  var z0 = eyex - target[0], z1 = eyey - target[1], z2 = eyez - target[2];
  var len2 = z0 * z0 + z1 * z1 + z2 * z2;
  if (len2 > 0) {
    len2 = 1 / Math.sqrt(len2);
    z0 *= len2;
    z1 *= len2;
    z2 *= len2;
  }
  var x0 = upy * z2 - upz * z1, x1 = upz * z0 - upx * z2, x2 = upx * z1 - upy * z0;
  len2 = x0 * x0 + x1 * x1 + x2 * x2;
  if (len2 > 0) {
    len2 = 1 / Math.sqrt(len2);
    x0 *= len2;
    x1 *= len2;
    x2 *= len2;
  }
  out[0] = x0;
  out[1] = x1;
  out[2] = x2;
  out[3] = 0;
  out[4] = z1 * x2 - z2 * x1;
  out[5] = z2 * x0 - z0 * x2;
  out[6] = z0 * x1 - z1 * x0;
  out[7] = 0;
  out[8] = z0;
  out[9] = z1;
  out[10] = z2;
  out[11] = 0;
  out[12] = eyex;
  out[13] = eyey;
  out[14] = eyez;
  out[15] = 1;
  return out;
}
function str(a) {
  return "mat4(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ", " + a[6] + ", " + a[7] + ", " + a[8] + ", " + a[9] + ", " + a[10] + ", " + a[11] + ", " + a[12] + ", " + a[13] + ", " + a[14] + ", " + a[15] + ")";
}
function frob(a) {
  return Math.hypot(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9], a[10], a[11], a[12], a[13], a[14], a[15]);
}
function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  out[4] = a[4] + b[4];
  out[5] = a[5] + b[5];
  out[6] = a[6] + b[6];
  out[7] = a[7] + b[7];
  out[8] = a[8] + b[8];
  out[9] = a[9] + b[9];
  out[10] = a[10] + b[10];
  out[11] = a[11] + b[11];
  out[12] = a[12] + b[12];
  out[13] = a[13] + b[13];
  out[14] = a[14] + b[14];
  out[15] = a[15] + b[15];
  return out;
}
function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  out[4] = a[4] - b[4];
  out[5] = a[5] - b[5];
  out[6] = a[6] - b[6];
  out[7] = a[7] - b[7];
  out[8] = a[8] - b[8];
  out[9] = a[9] - b[9];
  out[10] = a[10] - b[10];
  out[11] = a[11] - b[11];
  out[12] = a[12] - b[12];
  out[13] = a[13] - b[13];
  out[14] = a[14] - b[14];
  out[15] = a[15] - b[15];
  return out;
}
function multiplyScalar(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  out[4] = a[4] * b;
  out[5] = a[5] * b;
  out[6] = a[6] * b;
  out[7] = a[7] * b;
  out[8] = a[8] * b;
  out[9] = a[9] * b;
  out[10] = a[10] * b;
  out[11] = a[11] * b;
  out[12] = a[12] * b;
  out[13] = a[13] * b;
  out[14] = a[14] * b;
  out[15] = a[15] * b;
  return out;
}
function multiplyScalarAndAdd(out, a, b, scale3) {
  out[0] = a[0] + b[0] * scale3;
  out[1] = a[1] + b[1] * scale3;
  out[2] = a[2] + b[2] * scale3;
  out[3] = a[3] + b[3] * scale3;
  out[4] = a[4] + b[4] * scale3;
  out[5] = a[5] + b[5] * scale3;
  out[6] = a[6] + b[6] * scale3;
  out[7] = a[7] + b[7] * scale3;
  out[8] = a[8] + b[8] * scale3;
  out[9] = a[9] + b[9] * scale3;
  out[10] = a[10] + b[10] * scale3;
  out[11] = a[11] + b[11] * scale3;
  out[12] = a[12] + b[12] * scale3;
  out[13] = a[13] + b[13] * scale3;
  out[14] = a[14] + b[14] * scale3;
  out[15] = a[15] + b[15] * scale3;
  return out;
}
function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] && a[8] === b[8] && a[9] === b[9] && a[10] === b[10] && a[11] === b[11] && a[12] === b[12] && a[13] === b[13] && a[14] === b[14] && a[15] === b[15];
}
function equals(a, b) {
  var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
  var a4 = a[4], a5 = a[5], a6 = a[6], a7 = a[7];
  var a8 = a[8], a9 = a[9], a10 = a[10], a11 = a[11];
  var a12 = a[12], a13 = a[13], a14 = a[14], a15 = a[15];
  var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
  var b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7];
  var b8 = b[8], b9 = b[9], b10 = b[10], b11 = b[11];
  var b12 = b[12], b13 = b[13], b14 = b[14], b15 = b[15];
  return Math.abs(a0 - b0) <= EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= EPSILON * Math.max(1, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= EPSILON * Math.max(1, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= EPSILON * Math.max(1, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= EPSILON * Math.max(1, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= EPSILON * Math.max(1, Math.abs(a7), Math.abs(b7)) && Math.abs(a8 - b8) <= EPSILON * Math.max(1, Math.abs(a8), Math.abs(b8)) && Math.abs(a9 - b9) <= EPSILON * Math.max(1, Math.abs(a9), Math.abs(b9)) && Math.abs(a10 - b10) <= EPSILON * Math.max(1, Math.abs(a10), Math.abs(b10)) && Math.abs(a11 - b11) <= EPSILON * Math.max(1, Math.abs(a11), Math.abs(b11)) && Math.abs(a12 - b12) <= EPSILON * Math.max(1, Math.abs(a12), Math.abs(b12)) && Math.abs(a13 - b13) <= EPSILON * Math.max(1, Math.abs(a13), Math.abs(b13)) && Math.abs(a14 - b14) <= EPSILON * Math.max(1, Math.abs(a14), Math.abs(b14)) && Math.abs(a15 - b15) <= EPSILON * Math.max(1, Math.abs(a15), Math.abs(b15));
}
var mul = multiply;
var sub = subtract;

// node_modules/gl-matrix/esm/vec3.js
var vec3_exports = {};
__export(vec3_exports, {
  add: () => add2,
  angle: () => angle,
  bezier: () => bezier,
  ceil: () => ceil,
  clone: () => clone2,
  copy: () => copy2,
  create: () => create2,
  cross: () => cross,
  dist: () => dist,
  distance: () => distance,
  div: () => div,
  divide: () => divide,
  dot: () => dot,
  equals: () => equals2,
  exactEquals: () => exactEquals2,
  floor: () => floor,
  forEach: () => forEach,
  fromValues: () => fromValues2,
  hermite: () => hermite,
  inverse: () => inverse,
  len: () => len,
  length: () => length,
  lerp: () => lerp,
  max: () => max,
  min: () => min,
  mul: () => mul2,
  multiply: () => multiply2,
  negate: () => negate,
  normalize: () => normalize,
  random: () => random,
  rotateX: () => rotateX2,
  rotateY: () => rotateY2,
  rotateZ: () => rotateZ2,
  round: () => round,
  scale: () => scale2,
  scaleAndAdd: () => scaleAndAdd,
  set: () => set2,
  sqrDist: () => sqrDist,
  sqrLen: () => sqrLen,
  squaredDistance: () => squaredDistance,
  squaredLength: () => squaredLength,
  str: () => str2,
  sub: () => sub2,
  subtract: () => subtract2,
  transformMat3: () => transformMat3,
  transformMat4: () => transformMat4,
  transformQuat: () => transformQuat,
  zero: () => zero
});
function create2() {
  var out = new ARRAY_TYPE(3);
  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
  }
  return out;
}
function clone2(a) {
  var out = new ARRAY_TYPE(3);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
}
function length(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  return Math.hypot(x, y, z);
}
function fromValues2(x, y, z) {
  var out = new ARRAY_TYPE(3);
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}
function copy2(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
}
function set2(out, x, y, z) {
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}
function add2(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  return out;
}
function subtract2(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  return out;
}
function multiply2(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  out[2] = a[2] * b[2];
  return out;
}
function divide(out, a, b) {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  out[2] = a[2] / b[2];
  return out;
}
function ceil(out, a) {
  out[0] = Math.ceil(a[0]);
  out[1] = Math.ceil(a[1]);
  out[2] = Math.ceil(a[2]);
  return out;
}
function floor(out, a) {
  out[0] = Math.floor(a[0]);
  out[1] = Math.floor(a[1]);
  out[2] = Math.floor(a[2]);
  return out;
}
function min(out, a, b) {
  out[0] = Math.min(a[0], b[0]);
  out[1] = Math.min(a[1], b[1]);
  out[2] = Math.min(a[2], b[2]);
  return out;
}
function max(out, a, b) {
  out[0] = Math.max(a[0], b[0]);
  out[1] = Math.max(a[1], b[1]);
  out[2] = Math.max(a[2], b[2]);
  return out;
}
function round(out, a) {
  out[0] = Math.round(a[0]);
  out[1] = Math.round(a[1]);
  out[2] = Math.round(a[2]);
  return out;
}
function scale2(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  return out;
}
function scaleAndAdd(out, a, b, scale3) {
  out[0] = a[0] + b[0] * scale3;
  out[1] = a[1] + b[1] * scale3;
  out[2] = a[2] + b[2] * scale3;
  return out;
}
function distance(a, b) {
  var x = b[0] - a[0];
  var y = b[1] - a[1];
  var z = b[2] - a[2];
  return Math.hypot(x, y, z);
}
function squaredDistance(a, b) {
  var x = b[0] - a[0];
  var y = b[1] - a[1];
  var z = b[2] - a[2];
  return x * x + y * y + z * z;
}
function squaredLength(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  return x * x + y * y + z * z;
}
function negate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  return out;
}
function inverse(out, a) {
  out[0] = 1 / a[0];
  out[1] = 1 / a[1];
  out[2] = 1 / a[2];
  return out;
}
function normalize(out, a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var len2 = x * x + y * y + z * z;
  if (len2 > 0) {
    len2 = 1 / Math.sqrt(len2);
  }
  out[0] = a[0] * len2;
  out[1] = a[1] * len2;
  out[2] = a[2] * len2;
  return out;
}
function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
function cross(out, a, b) {
  var ax = a[0], ay = a[1], az = a[2];
  var bx = b[0], by = b[1], bz = b[2];
  out[0] = ay * bz - az * by;
  out[1] = az * bx - ax * bz;
  out[2] = ax * by - ay * bx;
  return out;
}
function lerp(out, a, b, t) {
  var ax = a[0];
  var ay = a[1];
  var az = a[2];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  out[2] = az + t * (b[2] - az);
  return out;
}
function hermite(out, a, b, c, d, t) {
  var factorTimes2 = t * t;
  var factor1 = factorTimes2 * (2 * t - 3) + 1;
  var factor2 = factorTimes2 * (t - 2) + t;
  var factor3 = factorTimes2 * (t - 1);
  var factor4 = factorTimes2 * (3 - 2 * t);
  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
  return out;
}
function bezier(out, a, b, c, d, t) {
  var inverseFactor = 1 - t;
  var inverseFactorTimesTwo = inverseFactor * inverseFactor;
  var factorTimes2 = t * t;
  var factor1 = inverseFactorTimesTwo * inverseFactor;
  var factor2 = 3 * t * inverseFactorTimesTwo;
  var factor3 = 3 * factorTimes2 * inverseFactor;
  var factor4 = factorTimes2 * t;
  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
  return out;
}
function random(out, scale3) {
  scale3 = scale3 || 1;
  var r = RANDOM() * 2 * Math.PI;
  var z = RANDOM() * 2 - 1;
  var zScale = Math.sqrt(1 - z * z) * scale3;
  out[0] = Math.cos(r) * zScale;
  out[1] = Math.sin(r) * zScale;
  out[2] = z * scale3;
  return out;
}
function transformMat4(out, a, m) {
  var x = a[0], y = a[1], z = a[2];
  var w = m[3] * x + m[7] * y + m[11] * z + m[15];
  w = w || 1;
  out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
  out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
  out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
  return out;
}
function transformMat3(out, a, m) {
  var x = a[0], y = a[1], z = a[2];
  out[0] = x * m[0] + y * m[3] + z * m[6];
  out[1] = x * m[1] + y * m[4] + z * m[7];
  out[2] = x * m[2] + y * m[5] + z * m[8];
  return out;
}
function transformQuat(out, a, q) {
  var qx = q[0], qy = q[1], qz = q[2], qw = q[3];
  var x = a[0], y = a[1], z = a[2];
  var uvx = qy * z - qz * y, uvy = qz * x - qx * z, uvz = qx * y - qy * x;
  var uuvx = qy * uvz - qz * uvy, uuvy = qz * uvx - qx * uvz, uuvz = qx * uvy - qy * uvx;
  var w2 = qw * 2;
  uvx *= w2;
  uvy *= w2;
  uvz *= w2;
  uuvx *= 2;
  uuvy *= 2;
  uuvz *= 2;
  out[0] = x + uvx + uuvx;
  out[1] = y + uvy + uuvy;
  out[2] = z + uvz + uuvz;
  return out;
}
function rotateX2(out, a, b, rad) {
  var p = [], r = [];
  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2];
  r[0] = p[0];
  r[1] = p[1] * Math.cos(rad) - p[2] * Math.sin(rad);
  r[2] = p[1] * Math.sin(rad) + p[2] * Math.cos(rad);
  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
}
function rotateY2(out, a, b, rad) {
  var p = [], r = [];
  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2];
  r[0] = p[2] * Math.sin(rad) + p[0] * Math.cos(rad);
  r[1] = p[1];
  r[2] = p[2] * Math.cos(rad) - p[0] * Math.sin(rad);
  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
}
function rotateZ2(out, a, b, rad) {
  var p = [], r = [];
  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2];
  r[0] = p[0] * Math.cos(rad) - p[1] * Math.sin(rad);
  r[1] = p[0] * Math.sin(rad) + p[1] * Math.cos(rad);
  r[2] = p[2];
  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
}
function angle(a, b) {
  var ax = a[0], ay = a[1], az = a[2], bx = b[0], by = b[1], bz = b[2], mag1 = Math.sqrt(ax * ax + ay * ay + az * az), mag2 = Math.sqrt(bx * bx + by * by + bz * bz), mag = mag1 * mag2, cosine = mag && dot(a, b) / mag;
  return Math.acos(Math.min(Math.max(cosine, -1), 1));
}
function zero(out) {
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  return out;
}
function str2(a) {
  return "vec3(" + a[0] + ", " + a[1] + ", " + a[2] + ")";
}
function exactEquals2(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}
function equals2(a, b) {
  var a0 = a[0], a1 = a[1], a2 = a[2];
  var b0 = b[0], b1 = b[1], b2 = b[2];
  return Math.abs(a0 - b0) <= EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1, Math.abs(a2), Math.abs(b2));
}
var sub2 = subtract2;
var mul2 = multiply2;
var div = divide;
var dist = distance;
var sqrDist = squaredDistance;
var len = length;
var sqrLen = squaredLength;
var forEach = function() {
  var vec = create2();
  return function(a, stride, offset, count, fn, arg) {
    var i, l;
    if (!stride) {
      stride = 3;
    }
    if (!offset) {
      offset = 0;
    }
    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }
    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      vec[2] = a[i + 2];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
      a[i + 2] = vec[2];
    }
    return a;
  };
}();

// ts/classes/util/math/matrix4.ts
function m4() {
  return Matrix4.f();
}
var Matrix4 = class _Matrix4 {
  constructor(source) {
    this.mat4 = source ? mat4_exports.clone(source) : mat4_exports.create();
    return this;
  }
  static f() {
    return new _Matrix4();
  }
  add(mat) {
    mat4_exports.add(
      this.mat4,
      this.mat4,
      mat.mat4
    );
    return this;
  }
  subtract(mat) {
    mat4_exports.subtract(
      this.mat4,
      this.mat4,
      mat.mat4
    );
    return this;
  }
  multiply(mat) {
    mat4_exports.multiply(
      this.mat4,
      this.mat4,
      mat.mat4
    );
    return this;
  }
  scale(vector) {
    mat4_exports.scale(
      this.mat4,
      this.mat4,
      vector.vec
    );
    return this;
  }
  translate(vector) {
    mat4_exports.translate(
      this.mat4,
      this.mat4,
      vector.vec
    );
    return this;
  }
  invert() {
    mat4_exports.invert(
      this.mat4,
      this.mat4
    );
    return this;
  }
  transpose(mat) {
    mat4_exports.transpose(
      this.mat4,
      mat ? mat.mat4 : this.mat4
    );
    return this;
  }
  rotateAxis(angle2, axis) {
    mat4_exports.rotate(
      this.mat4,
      this.mat4,
      angle2,
      [[1, 0, 0], [0, 1, 0], [0, 0, 1]][axis]
    );
    return this;
  }
  rotate(rotation) {
    rotation.forEach((r, i) => {
      this.rotateAxis(r, i);
    });
    return this;
  }
  perspective(fov, near = 1, far = Infinity) {
    mat4_exports.perspective(
      this.mat4,
      fov,
      glob.renderer ? glob.renderer.width / glob.renderer.height : document.body.clientWidth / document.body.clientHeight,
      near,
      far
    );
    return this;
  }
  ortho(left, right, bottom, top, near = 1, far = Infinity) {
    mat4_exports.ortho(
      this.mat4,
      left,
      right,
      bottom,
      top,
      near,
      far
    );
    return this;
  }
  clone() {
    return new _Matrix4(this.mat4);
  }
  static lookAt(camera, target) {
    let matrix = m4();
    mat4_exports.lookAt(
      matrix.mat4,
      camera.vec,
      target.vec,
      v3(0, 1, 0).vec
    );
    return matrix;
  }
  get position() {
    return v3(this.mat4[12], this.mat4[13], this.mat4[14]);
  }
};

// ts/classes/util/math/quaternion.ts
var Quaternion = class _Quaternion {
  constructor(x = 0, y = 0, z = 0, w = 1) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }
  clone() {
    return new _Quaternion(this.x, this.y, this.z, this.w);
  }
  multiply(q) {
    const x = this.w * q.x + this.x * q.w + this.y * q.z - this.z * q.y;
    const y = this.w * q.y - this.x * q.z + this.y * q.w + this.z * q.x;
    const z = this.w * q.z + this.x * q.y - this.y * q.x + this.z * q.w;
    const w = this.w * q.w - this.x * q.x - this.y * q.y - this.z * q.z;
    return new _Quaternion(x, y, z, w);
  }
  toMatrix4() {
    const xx = this.x * this.x;
    const xy = this.x * this.y;
    const xz = this.x * this.z;
    const xw = this.x * this.w;
    const yy = this.y * this.y;
    const yz = this.y * this.z;
    const yw = this.y * this.w;
    const zz = this.z * this.z;
    const zw = this.z * this.w;
    return new Matrix4([
      1 - 2 * (yy + zz),
      2 * (xy - zw),
      2 * (xz + yw),
      0,
      2 * (xy + zw),
      1 - 2 * (xx + zz),
      2 * (yz - xw),
      0,
      2 * (xz - yw),
      2 * (yz + xw),
      1 - 2 * (xx + yy),
      0,
      0,
      0,
      0,
      1
    ]);
  }
  static fromEuler(x, y, z) {
    const cx = Math.cos(x * 0.5);
    const cy = Math.cos(y * 0.5);
    const cz = Math.cos(z * 0.5);
    const sx = Math.sin(x * 0.5);
    const sy = Math.sin(y * 0.5);
    const sz = Math.sin(z * 0.5);
    return new _Quaternion(
      sx * cy * cz + cx * sy * sz,
      cx * sy * cz - sx * cy * sz,
      cx * cy * sz + sx * sy * cz,
      cx * cy * cz - sx * sy * sz
    );
  }
  static fromMatrix(matrix) {
    return new _Quaternion();
  }
  static f(x, y = x, z = x, w = 1) {
    return new _Quaternion(x, y, z, w);
  }
  setAxisAngle(axis, angle2) {
    const halfAngle = angle2 * 0.5;
    const s = Math.sin(halfAngle);
    this.x = axis.x * s;
    this.y = axis.y * s;
    this.z = axis.z * s;
    this.w = Math.cos(halfAngle);
    return this;
  }
  toEuler() {
    const x = Math.atan2(2 * (this.w * this.x + this.y * this.z), 1 - 2 * (this.x * this.x + this.y * this.y));
    const y = Math.asin(2 * (this.w * this.y - this.z * this.x));
    const z = Math.atan2(2 * (this.w * this.z + this.x * this.y), 1 - 2 * (this.y * this.y + this.z * this.z));
    return new Vector3(x, y, z);
  }
};

// ts/classes/util/math/transform.ts
var Transform = class {
  constructor() {
    this._localPosition = v3(0);
    this._localRotation = new Quaternion();
    this._localScale = v3(1);
    this._anchor = v3(0);
    this._worldMatrix = m4();
    this._localMatrix = m4();
    this._isDirty = true;
    this._parent = null;
    this._children = [];
  }
  // Position methods
  setPosition(position) {
    this._localPosition = position;
    this._isDirty = true;
  }
  move(position) {
    this._localPosition = this._localPosition.add(position);
    this._isDirty = true;
  }
  getLocalPosition() {
    return this._localPosition.clone();
  }
  getWorldPosition() {
    return this.getWorldMatrix().position;
  }
  // Rotation methods
  setRotation(rotation) {
    this._localRotation = rotation;
    this._isDirty = true;
  }
  rotate(rotation) {
    this.setRotation(this._localRotation.multiply(rotation));
  }
  getLocalRotation() {
    return this._localRotation.clone();
  }
  getWorldRotation() {
    return Quaternion.fromMatrix(this.getWorldMatrix());
  }
  // Scale methods
  setScale(scale3) {
    this._localScale = scale3;
    this._isDirty = true;
  }
  getLocalScale() {
    return this._localScale.clone();
  }
  // Anchor point methods
  setAnchor(anchor) {
    this._anchor = anchor;
    this._isDirty = true;
  }
  // Hierarchy methods
  setParent(parent) {
    if (this._parent) {
      const index = this._parent._children.indexOf(this);
      if (index !== -1)
        this._parent._children.splice(index, 1);
    }
    this._parent = parent;
    if (parent) {
      parent._children.push(this);
    }
    this._isDirty = true;
  }
  // Matrix calculations
  updateLocalMatrix() {
    if (!this._isDirty)
      return;
    this._localMatrix = m4();
    if (!this._anchor.equals(v3(0))) {
      this._localMatrix.translate(this._anchor.scale(-1));
    }
    this._localMatrix.translate(this._localPosition);
    this._localMatrix.multiply(this._localRotation.toMatrix4());
    this._localMatrix.scale(this._localScale);
    if (!this._anchor.equals(v3(0))) {
      this._localMatrix.translate(this._anchor);
    }
    this._isDirty = false;
  }
  getLocalMatrix() {
    this.updateLocalMatrix();
    return this._localMatrix.clone();
  }
  getWorldMatrix() {
    this.updateLocalMatrix();
    if (this._parent) {
      return this._parent.getWorldMatrix().multiply(this._localMatrix);
    }
    return this._localMatrix.clone();
  }
  getScreenPosition(camera, scaleToScreen = false) {
    const worldPos = this.getWorldPosition().clone();
    const viewMatrix = camera.getViewMatrix().clone();
    const projectionMatrix = camera.getProjectionMatrix().clone();
    const viewProjectionMatrix = projectionMatrix.multiply(viewMatrix);
    const m = viewProjectionMatrix.mat4;
    const x = m[0] * worldPos.x + m[4] * worldPos.y + m[8] * worldPos.z + m[12];
    const y = m[1] * worldPos.x + m[5] * worldPos.y + m[9] * worldPos.z + m[13];
    const z = m[2] * worldPos.x + m[6] * worldPos.y + m[10] * worldPos.z + m[14];
    const w = m[3] * worldPos.x + m[7] * worldPos.y + m[11] * worldPos.z + m[15];
    if (Math.abs(w) < 1e-7)
      return v2(0);
    const ndcX = x / w;
    const ndcY = y / w;
    return v2(
      (ndcX + 1) * 0.5,
      (1 - ndcY) * 0.5
      // Flip Y because screen space is top-down
    ).multiply(scaleToScreen ? v2(glob.renderer.width, glob.renderer.height) : v2(1));
  }
};

// ts/classes/util/math/color.ts
function hslToRgb(h, s, l) {
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p2, q2, t) => {
      if (t < 0)
        t += 1;
      if (t > 1)
        t -= 1;
      if (t < 1 / 6)
        return p2 + (q2 - p2) * 6 * t;
      if (t < 1 / 2)
        return q2;
      if (t < 2 / 3)
        return p2 + (q2 - p2) * (2 / 3 - t) * 6;
      return p2;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return v3(r, g, b);
}

// ts/classes/webgl2/meshes/sceneObject.ts
var SceneObject = class {
  constructor(data, props = {}) {
    this.drawMode = glob.ctx.TRIANGLES;
    this.drawType = glob.ctx.UNSIGNED_SHORT;
    this.ignoreLighting = false;
    this.visible = true;
    var _a, _b;
    this.vao = data.vao;
    this.indexBuffer = data.indexBuffer;
    this.shaderManager = glob.shaderManager;
    this.drawCount = data.drawCount;
    this.ignoreLighting = (_a = data.ignoreLighting) != null ? _a : false;
    this.pickColor = (_b = props.pickColor) != null ? _b : 0;
    this.material = props.material;
    this.transform = new Transform();
    if (props.position)
      this.transform.setPosition(props.position);
    if (props.scale)
      this.transform.setScale(props.scale);
    if (props.rotation)
      this.transform.setRotation(props.rotation);
    if (props.parent) {
      this.transform.setParent(props.parent.transform);
    }
  }
  set pickColor(value) {
    if (value === 0) {
      this.pickColorArray = v3(1, 1, 1);
    } else if (value === -1) {
      this.pickColorArray = void 0;
    } else {
      this.pickColorArray = hslToRgb(value / 255, 1, 0.5);
    }
  }
  colorMatch(color) {
    if (!this.pickColorArray)
      return false;
    return this.pickColorArray.equals(color);
  }
  static getAttributeLocation(name) {
    return glob.shaderManager.getAttributeLocation("a_".concat(name));
  }
  render(obj, viewMatrix, projectionMatrix) {
    const modelMatrix = this.transform.getWorldMatrix();
    if (this.shaderManager.hasUniform("u_modelMatrix")) {
      this.shaderManager.setUniform("u_modelMatrix", modelMatrix.mat4);
    }
    if (this.shaderManager.hasUniform("u_viewMatrix")) {
      this.shaderManager.setUniform("u_viewMatrix", viewMatrix.mat4);
    }
    if (this.shaderManager.hasUniform("u_projectionMatrix")) {
      this.shaderManager.setUniform("u_projectionMatrix", projectionMatrix.mat4);
    }
    if (this.shaderManager.hasUniform("u_normalMatrix")) {
      const normalMatrix = modelMatrix.clone();
      normalMatrix.invert();
      normalMatrix.transpose();
      const normalMat3 = new Float32Array([
        normalMatrix.mat4[0],
        normalMatrix.mat4[1],
        normalMatrix.mat4[2],
        normalMatrix.mat4[4],
        normalMatrix.mat4[5],
        normalMatrix.mat4[6],
        normalMatrix.mat4[8],
        normalMatrix.mat4[9],
        normalMatrix.mat4[10]
      ]);
      this.shaderManager.setUniform("u_normalMatrix", normalMat3);
    }
    if (this.material && this.shaderManager.hasUniform("u_material.baseColor")) {
      this.shaderManager.setUniform("u_material.baseColor", new Float32Array(this.material.baseColor.vec));
      this.shaderManager.setUniform("u_material.roughness", this.material.roughness);
      this.shaderManager.setUniform("u_material.metallic", this.material.metallic);
      this.shaderManager.setUniform("u_material.ambientOcclusion", this.material.ambientOcclusion);
      this.shaderManager.setUniform("u_material.emissive", new Float32Array(this.material.emissive.vec));
      this.shaderManager.setUniform("u_material.hasAlbedoMap", this.material.albedoMap ? 1 : 0);
      this.shaderManager.setUniform("u_material.hasNormalMap", this.material.normalMap ? 1 : 0);
      this.shaderManager.setUniform("u_material.hasMetallicMap", this.material.metallicMap ? 1 : 0);
      this.shaderManager.setUniform("u_material.hasRoughnessMap", this.material.roughnessMap ? 1 : 0);
      this.shaderManager.setUniform("u_material.hasAoMap", this.material.aoMap ? 1 : 0);
      this.shaderManager.setUniform("u_material.hasEmissiveMap", this.material.emissiveMap ? 1 : 0);
      this.shaderManager.setUniform("u_material.hasEmissiveStrengthMap", this.material.emissiveStrengthMap ? 1 : 0);
      if (this.material.albedoMap) {
        glob.ctx.activeTexture(glob.ctx.TEXTURE0);
        glob.ctx.bindTexture(glob.ctx.TEXTURE_2D, this.material.albedoMap);
        this.shaderManager.setUniform("u_material.albedoMap", 0);
      }
      if (this.material.normalMap) {
        glob.ctx.activeTexture(glob.ctx.TEXTURE1);
        glob.ctx.bindTexture(glob.ctx.TEXTURE_2D, this.material.normalMap);
        this.shaderManager.setUniform("u_material.normalMap", 1);
      }
      if (this.material.metallicMap) {
        glob.ctx.activeTexture(glob.ctx.TEXTURE2);
        glob.ctx.bindTexture(glob.ctx.TEXTURE_2D, this.material.metallicMap);
        this.shaderManager.setUniform("u_material.metallicMap", 2);
      }
      if (this.material.roughnessMap) {
        glob.ctx.activeTexture(glob.ctx.TEXTURE3);
        glob.ctx.bindTexture(glob.ctx.TEXTURE_2D, this.material.roughnessMap);
        this.shaderManager.setUniform("u_material.roughnessMap", 3);
      }
      if (this.material.aoMap) {
        glob.ctx.activeTexture(glob.ctx.TEXTURE4);
        glob.ctx.bindTexture(glob.ctx.TEXTURE_2D, this.material.aoMap);
        this.shaderManager.setUniform("u_material.aoMap", 4);
      }
      if (this.material.emissiveMap) {
        glob.ctx.activeTexture(glob.ctx.TEXTURE5);
        glob.ctx.bindTexture(glob.ctx.TEXTURE_2D, this.material.emissiveMap);
        this.shaderManager.setUniform("u_material.emissiveMap", 5);
      }
      if (this.material.emissiveStrengthMap) {
        glob.ctx.activeTexture(glob.ctx.TEXTURE6);
        glob.ctx.bindTexture(glob.ctx.TEXTURE_2D, this.material.emissiveStrengthMap);
        this.shaderManager.setUniform("u_material.emissiveStrengthMap", 6);
      }
    }
    this.vao.bind();
    if (this.indexBuffer) {
      glob.ctx.drawElements(
        this.drawMode,
        this.drawCount,
        this.drawType || glob.ctx.UNSIGNED_INT,
        0
      );
    } else {
      glob.ctx.drawArrays(
        this.drawMode,
        0,
        this.drawCount
      );
    }
    this.vao.unbind();
  }
  build() {
  }
};

// ts/classes/webgl2/meshes/containerObject.ts
var ContainerObject = class extends SceneObject {
  constructor(props = {}) {
    const dummyData = {
      vao: null,
      indexBuffer: null,
      drawCount: 0,
      ignoreLighting: false
    };
    super(dummyData, props);
    this.children = [];
  }
  /**
   * Add a child object to this container
   */
  add(child) {
    if (Array.isArray(child)) {
      this.children.push(...child);
      child.forEach((c) => {
        c.transform.setParent(this.transform);
        c.parent = this;
        c.scene = this.scene;
        c.build();
      });
    } else {
      this.children.push(child);
      child.transform.setParent(this.transform);
      child.parent = this;
      child.scene = this.scene;
      child.build();
    }
  }
  /**
   * Remove a child object from this container
   */
  removeChild(child) {
    if (Array.isArray(child)) {
      child.forEach((c) => {
        const index = this.children.indexOf(c);
        if (index !== -1) {
          this.children.splice(index, 1);
          c.transform.setParent(null);
        }
      });
    } else {
      const index = this.children.indexOf(child);
      if (index !== -1) {
        this.children.splice(index, 1);
        child.transform.setParent(null);
      }
    }
  }
  /**
   * Override render to render all children
   */
  render(obj, viewMatrix, projectionMatrix) {
    for (const child of this.children) {
      child.render(obj, viewMatrix, projectionMatrix);
    }
  }
};

// ts/classes/webgl2/meshes/baseMesh.ts
var BaseMesh = class _BaseMesh extends SceneObject {
  static setupBuffers(meshData, props) {
    var _a;
    const vao = new VertexArray(glob.ctx);
    vao.bind();
    const vertexBuffer = new VertexBuffer(glob.ctx);
    vertexBuffer.setData(meshData.vertices);
    vao.setAttributePointer(
      SceneObject.getAttributeLocation("position"),
      3,
      glob.ctx.FLOAT,
      false,
      0,
      0
    );
    const colorBuffer = new VertexBuffer(glob.ctx);
    const colors = meshData.colors || new Float32Array(Array(meshData.vertices.length).fill(1));
    colorBuffer.setData(colors);
    vao.setAttributePointer(
      SceneObject.getAttributeLocation("color"),
      3,
      glob.ctx.FLOAT,
      false,
      0,
      0
    );
    const normalBuffer = new VertexBuffer(glob.ctx);
    const normals = meshData.normals || new Float32Array(Array(meshData.vertices.length).fill(0, 0, meshData.vertices.length / 3 * 3));
    normalBuffer.setData(normals);
    vao.setAttributePointer(
      SceneObject.getAttributeLocation("normal"),
      3,
      glob.ctx.FLOAT,
      false,
      0,
      0
    );
    const texCoordBuffer = new VertexBuffer(glob.ctx);
    const texCoords = meshData.texCoords || new Float32Array(Array(meshData.vertices.length / 3 * 2).fill(0));
    texCoordBuffer.setData(texCoords);
    vao.setAttributePointer(
      SceneObject.getAttributeLocation("texCoord"),
      2,
      glob.ctx.FLOAT,
      false,
      0,
      0
    );
    if (meshData.tangents) {
      const tangentBuffer = new VertexBuffer(glob.ctx);
      tangentBuffer.setData(meshData.tangents);
      vao.setAttributePointer(
        SceneObject.getAttributeLocation("tangent"),
        3,
        glob.ctx.FLOAT,
        false,
        0,
        0
      );
    }
    if (meshData.bitangents) {
      const bitangentBuffer = new VertexBuffer(glob.ctx);
      bitangentBuffer.setData(meshData.bitangents);
      vao.setAttributePointer(
        SceneObject.getAttributeLocation("bitangent"),
        3,
        glob.ctx.FLOAT,
        false,
        0,
        0
      );
    }
    const indexBuffer = new IndexBuffer(glob.ctx);
    indexBuffer.setData(meshData.indices);
    return {
      vao,
      indexBuffer,
      drawCount: meshData.indices.length,
      ignoreLighting: (_a = props.ignoreLighting) != null ? _a : false
    };
  }
  static createSceneObject(meshData, props) {
    const bufferData = this.setupBuffers(meshData, props);
    return new SceneObject(bufferData, props);
  }
  constructor(meshData, props = {}) {
    super(_BaseMesh.setupBuffers(meshData, props), props);
  }
};

// ts/classes/webgl2/material.ts
var _Material = class _Material {
  constructor({
    baseColor = v3(0.8, 0.8, 0.8),
    roughness = 0.5,
    metallic = 0,
    ambientOcclusion = 1,
    emissive = v3(0, 0, 0),
    albedoMap,
    normalMap,
    metallicMap,
    roughnessMap,
    aoMap,
    emissiveMap,
    emissiveStrengthMap
  } = {}) {
    this.baseColor = baseColor;
    this.roughness = roughness;
    this.metallic = metallic;
    this.ambientOcclusion = ambientOcclusion;
    this.emissive = emissive != null ? emissive : v3(0, 0, 0);
    this.albedoMap = albedoMap;
    this.normalMap = normalMap;
    this.metallicMap = metallicMap;
    this.roughnessMap = roughnessMap;
    this.aoMap = aoMap;
    this.emissiveMap = emissiveMap;
    this.emissiveStrengthMap = emissiveStrengthMap;
  }
  static library(name, color) {
    const material = new _Material(this._materials[name]);
    material.baseColor = color;
    return material;
  }
};
_Material._materials = {
  "plastic": {
    baseColor: v3(0.8, 0.8, 0.8),
    roughness: 0.4,
    metallic: 0.4,
    ambientOcclusion: 1,
    emissive: v3(0, 0, 0)
  },
  "metal": {
    baseColor: v3(0.8, 0.8, 0.8),
    roughness: 0.3,
    metallic: 1,
    ambientOcclusion: 1,
    emissive: v3(0, 0, 0)
  },
  "rough": {
    baseColor: v3(0.8, 0.8, 0.8),
    roughness: 0.4,
    metallic: 0.5,
    ambientOcclusion: 1,
    emissive: v3(0, 0, 0)
  }
};
var Material = _Material;

// ts/classes/webgl2/meshes/icoSphere.ts
var _IcoSphere = class _IcoSphere extends BaseMesh {
  static normalize(v) {
    const length2 = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    return [v[0] / length2, v[1] / length2, v[2] / length2];
  }
  static midpoint(v1, v22) {
    return this.normalize([
      (v1[0] + v22[0]) / 2,
      (v1[1] + v22[1]) / 2,
      (v1[2] + v22[2]) / 2
    ]);
  }
  static generateMeshData(subdivisions = 0, smoothShading = true, color = [0.8, 0.2, 0.2]) {
    let vertices = [...this.baseVertices];
    let indices = [...this.baseIndices];
    const vertexMap = /* @__PURE__ */ new Map();
    const getMiddlePoint = (v1Index, v2Index) => {
      const key = "".concat(Math.min(v1Index, v2Index), "_").concat(Math.max(v1Index, v2Index));
      if (vertexMap.has(key)) {
        return vertexMap.get(key);
      }
      const p1 = vertices[v1Index];
      const p2 = vertices[v2Index];
      const middle = this.midpoint(p1, p2);
      const i = vertices.length;
      vertices.push(middle);
      vertexMap.set(key, i);
      return i;
    };
    for (let i = 0; i < subdivisions; i++) {
      const newIndices = [];
      for (let j = 0; j < indices.length; j += 3) {
        const a = indices[j];
        const b = indices[j + 1];
        const c = indices[j + 2];
        const ab = getMiddlePoint(a, b);
        const bc = getMiddlePoint(b, c);
        const ca = getMiddlePoint(c, a);
        newIndices.push(
          a,
          ab,
          ca,
          b,
          bc,
          ab,
          c,
          ca,
          bc,
          ab,
          bc,
          ca
        );
      }
      indices = newIndices;
    }
    vertices = vertices.map((v) => [v[0] * 0.5, v[1] * 0.5, v[2] * 0.5]);
    const flatVertices = [];
    const normals = [];
    const generatedColors = [];
    const texCoords = [];
    const tangents = [];
    const bitangents = [];
    if (smoothShading) {
      vertices.forEach((v) => {
        flatVertices.push(...v);
        const normal = this.normalize(v);
        normals.push(...normal);
        generatedColors.push(...color);
        const u = 0.5 + Math.atan2(v[2], v[0]) / (2 * Math.PI);
        const vCoord = 0.5 - Math.asin(v[1]) / Math.PI;
        texCoords.push(u, vCoord);
        const tangent = [-v[2], 0, v[0]];
        const tangentLength = Math.sqrt(tangent[0] * tangent[0] + tangent[2] * tangent[2]);
        if (tangentLength > 0.01) {
          tangent[0] /= tangentLength;
          tangent[2] /= tangentLength;
        } else {
          tangent[0] = 1;
          tangent[1] = 0;
          tangent[2] = 0;
        }
        tangents.push(...tangent);
        const bitangent = [
          normal[1] * tangent[2] - normal[2] * tangent[1],
          normal[2] * tangent[0] - normal[0] * tangent[2],
          normal[0] * tangent[1] - normal[1] * tangent[0]
        ];
        bitangents.push(...bitangent);
      });
    } else {
      const newIndices = [];
      for (let i = 0; i < indices.length; i += 3) {
        const v1 = vertices[indices[i]];
        const v22 = vertices[indices[i + 1]];
        const v32 = vertices[indices[i + 2]];
        const dx1 = v22[0] - v1[0], dy1 = v22[1] - v1[1], dz1 = v22[2] - v1[2];
        const dx2 = v32[0] - v1[0], dy2 = v32[1] - v1[1], dz2 = v32[2] - v1[2];
        const normal = this.normalize([
          dy1 * dz2 - dz1 * dy2,
          dz1 * dx2 - dx1 * dz2,
          dx1 * dy2 - dy1 * dx2
        ]);
        const baseIndex = flatVertices.length / 3;
        const tangent = [1, 0, 0];
        const bitangent = [0, 1, 0];
        [v1, v22, v32].forEach((vertex) => {
          flatVertices.push(...vertex);
          normals.push(...normal);
          generatedColors.push(...color);
          const u = 0.5 + Math.atan2(vertex[2], vertex[0]) / (2 * Math.PI);
          const vCoord = 0.5 - Math.asin(vertex[1]) / Math.PI;
          texCoords.push(u, vCoord);
          tangents.push(...tangent);
          bitangents.push(...bitangent);
        });
        newIndices.push(baseIndex, baseIndex + 1, baseIndex + 2);
      }
      indices = newIndices;
    }
    return {
      vertices: new Float32Array(flatVertices),
      indices: new Uint16Array(indices),
      normals: new Float32Array(normals),
      colors: new Float32Array(generatedColors),
      texCoords: new Float32Array(texCoords),
      tangents: new Float32Array(tangents),
      bitangents: new Float32Array(bitangents)
    };
  }
  static create(props = {}) {
    var _a, _b;
    if (!props.material && props.color) {
      const baseColor = v3(props.color[0], props.color[1], props.color[2]);
      props = __spreadProps(__spreadValues({}, props), {
        material: new Material({
          baseColor,
          roughness: 0.5,
          metallic: 0,
          ambientOcclusion: 1,
          emissive: v3(0, 0, 0)
        })
      });
    }
    let meshColor;
    if (props.material) {
      const { baseColor } = props.material;
      meshColor = [baseColor.x, baseColor.y, baseColor.z];
    } else if (props.color) {
      meshColor = props.color;
    } else {
      meshColor = [0.8, 0.2, 0.2];
    }
    const meshData = this.generateMeshData(
      (_a = props.subdivisions) != null ? _a : 0,
      (_b = props.smoothShading) != null ? _b : true,
      meshColor
    );
    const sceneObject = this.createSceneObject(meshData, props);
    return sceneObject;
  }
};
_IcoSphere.X = 0.5257311121191336;
_IcoSphere.Z = 0.8506508083520399;
// Initial icosahedron vertices
_IcoSphere.baseVertices = [
  [-_IcoSphere.X, 0, _IcoSphere.Z],
  [_IcoSphere.X, 0, _IcoSphere.Z],
  [-_IcoSphere.X, 0, -_IcoSphere.Z],
  [_IcoSphere.X, 0, -_IcoSphere.Z],
  [0, _IcoSphere.Z, _IcoSphere.X],
  [0, _IcoSphere.Z, -_IcoSphere.X],
  [0, -_IcoSphere.Z, _IcoSphere.X],
  [0, -_IcoSphere.Z, -_IcoSphere.X],
  [_IcoSphere.Z, _IcoSphere.X, 0],
  [-_IcoSphere.Z, _IcoSphere.X, 0],
  [_IcoSphere.Z, -_IcoSphere.X, 0],
  [-_IcoSphere.Z, -_IcoSphere.X, 0]
];
// Initial icosahedron indices
_IcoSphere.baseIndices = [
  1,
  4,
  0,
  4,
  9,
  0,
  4,
  5,
  9,
  8,
  5,
  4,
  1,
  8,
  4,
  1,
  10,
  8,
  10,
  3,
  8,
  8,
  3,
  5,
  3,
  2,
  5,
  3,
  7,
  2,
  3,
  10,
  7,
  10,
  6,
  7,
  6,
  11,
  7,
  6,
  0,
  11,
  6,
  1,
  0,
  10,
  1,
  6,
  11,
  0,
  9,
  2,
  11,
  9,
  5,
  2,
  9,
  11,
  2,
  7
];
var IcoSphere = _IcoSphere;

// ts/classes/webgl2/lights/shadowMap.ts
var ShadowMap = class {
  constructor(gl, size = 2048) {
    this.size = size;
    this.depthTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.depthTexture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.DEPTH_COMPONENT24,
      // Use 24-bit depth for better precision
      size,
      size,
      0,
      gl.DEPTH_COMPONENT,
      gl.UNSIGNED_INT,
      // Use unsigned int format for wider range
      null
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    this.framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.DEPTH_ATTACHMENT,
      gl.TEXTURE_2D,
      this.depthTexture,
      0
    );
    gl.drawBuffers([gl.NONE]);
    gl.readBuffer(gl.NONE);
    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (status !== gl.FRAMEBUFFER_COMPLETE) {
      console.error("Framebuffer not complete:", status);
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);
  }
  bind(gl) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
    gl.viewport(0, 0, this.size, this.size);
    gl.clearDepth(1);
    gl.clear(gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LESS);
    gl.depthMask(true);
    gl.colorMask(false, false, false, false);
  }
  unbind(gl) {
    gl.colorMask(true, true, true, true);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }
  bindDepthTexture(gl, textureUnit) {
    gl.activeTexture(gl.TEXTURE0 + textureUnit);
    gl.bindTexture(gl.TEXTURE_2D, this.depthTexture);
  }
  getDepthTexture() {
    return this.depthTexture;
  }
  getSize() {
    return this.size;
  }
};

// ts/classes/webgl2/lights/light.ts
var Light = class {
  constructor({
    color = v3(1, 1, 1),
    intensity = 1,
    enabled = true
  } = {}) {
    this.enabled = true;
    this.color = color;
    this.intensity = intensity;
    this.enabled = enabled;
    this.type = 4 /* INACTIVE */;
  }
  getIntensity() {
    return this.enabled ? this.intensity : 0;
  }
  isEnabled() {
    return this.enabled;
  }
  setEnabled(enabled) {
    this.enabled = enabled;
  }
  getType() {
    return this.enabled ? this.type : 4 /* INACTIVE */;
  }
  getData() {
    return {
      color: this.color,
      intensity: this.getIntensity(),
      enabled: this.enabled
    };
  }
  getShadowMap() {
    return this.enabled ? null : null;
  }
  setColor(color) {
    this.color = color;
  }
};
var AmbientLight = class extends Light {
  constructor({ color = v3(1, 1, 1), intensity = 0.1 } = {}) {
    super({ color, intensity });
    this.type = 0 /* AMBIENT */;
  }
};
var DirectionalLight = class extends Light {
  constructor({
    direction = v3(0, -1, 0),
    color = v3(1, 1, 1),
    intensity = 1,
    enabled = true
  } = {}) {
    super({ color, intensity, enabled });
    this.direction = direction.normalize();
    this.type = 1 /* DIRECTIONAL */;
    this.shadowMap = new ShadowMap(glob.ctx, 4096);
    this.lightProjection = new Matrix4().ortho(
      -20,
      20,
      // left, right
      -20,
      20,
      // bottom, top
      0.1,
      200
      // near, far
    );
  }
  getData() {
    return __spreadProps(__spreadValues({}, super.getData()), {
      direction: this.direction
    });
  }
  getDirection() {
    return this.direction;
  }
  setDirection(direction) {
    this.direction = direction.normalize();
  }
  getLightSpaceMatrix() {
    const lightView = Matrix4.lookAt(
      this.direction.scale(-10),
      // Position light far enough away in opposite direction
      v3(0, 0, 0)
      // Look at scene center
    );
    return this.lightProjection.multiply(lightView);
  }
  getShadowMap() {
    return this.shadowMap;
  }
  lookAt(from, target) {
    const direction = target.subtract(from).normalize();
    const defaultDir = v3(0, -1, 0);
    const rotationAxis = defaultDir.cross(direction).normalize();
    const angle2 = Math.acos(defaultDir.y * direction.y + defaultDir.x * direction.x + defaultDir.z * direction.z);
    this.direction = new Quaternion().setAxisAngle(rotationAxis, angle2).toEuler();
  }
};
var PointLight = class extends Light {
  constructor({
    position = v3(0, 0, 0),
    color = v3(1, 1, 1),
    intensity = 5,
    // Increased intensity for PBR
    attenuation = { constant: 1, linear: 0.22, quadratic: 0.2 },
    // Better PBR attenuation values
    meshContainer,
    enabled = true
  } = {}) {
    super({ color, intensity, enabled });
    this.position = position;
    this.constant = attenuation.constant;
    this.linear = attenuation.linear;
    this.quadratic = attenuation.quadratic;
    this.type = 2 /* POINT */;
    this.shadowMap = new ShadowMap(glob.ctx, 4096);
    this.lightProjection = new Matrix4().ortho(
      -20,
      20,
      // left, right - doubled for wider coverage
      -20,
      20,
      // bottom, top - doubled for wider coverage
      0.1,
      200
      // near, far - increased far plane for deeper shadows
    );
    if (meshContainer) {
      meshContainer.add(this.mesh = IcoSphere.create({
        position,
        scale: v3(0.2, 0.2, 0.2),
        smoothShading: true,
        subdivisions: 0,
        ignoreLighting: false,
        pickColor: -1,
        color: [color.x, color.y, color.z]
      }));
    }
  }
  setPosition(position) {
    this.position = position;
    if (this.mesh) {
      this.mesh.transform.setPosition(position);
    }
  }
  getPosition() {
    return this.position;
  }
  getData() {
    return __spreadProps(__spreadValues({}, super.getData()), {
      position: this.position,
      constant: this.constant,
      linear: this.linear,
      quadratic: this.quadratic
    });
  }
  getLightSpaceMatrix() {
    const lightView = Matrix4.lookAt(
      this.position,
      // Light position
      v3(0, 0, 0)
      // Looking at scene center
    );
    const distanceToCenter = Math.sqrt(
      this.position.x * this.position.x + this.position.y * this.position.y + this.position.z * this.position.z
    );
    this.lightProjection = new Matrix4().ortho(
      -20,
      20,
      // Much wider left/right bounds
      -20,
      20,
      // Much wider top/bottom bounds
      0.01,
      // Much closer near plane (was 0.1 or higher)
      50
      // Much farther far plane 
    );
    return this.lightProjection.multiply(lightView);
  }
  getShadowMap() {
    return this.shadowMap;
  }
};

// ts/classes/webgl2/lights/lightManager.ts
var LightManager = class {
  constructor(shaderManager) {
    this.lights = [];
    this.ambientLight = null;
    this.MAX_LIGHTS = 10;
    this.shaderManager = shaderManager;
    this.setAmbientLight(new AmbientLight({
      color: v3(1, 1, 1),
      intensity: 0.03
      // Lower default ambient for PBR to emphasize directional lighting
    }));
  }
  /**
   * Sets the ambient light for the scene
   * For PBR, keep ambient light intensity low (0.01-0.05) to maintain physical accuracy
   */
  setAmbientLight(light) {
    this.ambientLight = light;
    this.updateShaderUniforms();
  }
  /**
   * Adds a light to the scene
   * Note: For PBR, use higher intensities (5-10) for point and spot lights
   */
  addLight(light) {
    if (light instanceof AmbientLight) {
      console.warn("Use setAmbientLight() to set the ambient light instead of addLight()");
      return;
    }
    if (this.lights.length >= this.MAX_LIGHTS) {
      console.warn("Maximum number of lights (".concat(this.MAX_LIGHTS, ") reached. Light not added."));
      return;
    }
    this.lights.push(light);
    this.updateShaderUniforms();
  }
  removeLight(light) {
    if (light instanceof AmbientLight) {
      console.warn("Cannot remove ambient light. Use setAmbientLight() to modify it instead");
      return;
    }
    const index = this.lights.indexOf(light);
    if (index !== -1) {
      this.lights.splice(index, 1);
      this.updateShaderUniforms();
    }
  }
  getLights() {
    return this.lights;
  }
  /**
   * Updates all light-related shader uniforms
   * This sets the PBR-optimized values for lights in the shader
   */
  updateShaderUniforms() {
    const types = new Int32Array(this.MAX_LIGHTS);
    const positions = new Float32Array(this.MAX_LIGHTS * 3);
    const directions = new Float32Array(this.MAX_LIGHTS * 3);
    const colors = new Float32Array(this.MAX_LIGHTS * 3);
    const intensities = new Float32Array(this.MAX_LIGHTS);
    const constants = new Float32Array(this.MAX_LIGHTS);
    const linears = new Float32Array(this.MAX_LIGHTS);
    const quadratics = new Float32Array(this.MAX_LIGHTS);
    const cutOffs = new Float32Array(this.MAX_LIGHTS);
    const outerCutOffs = new Float32Array(this.MAX_LIGHTS);
    types.fill(4 /* INACTIVE */);
    constants.fill(1);
    let currentIndex = 0;
    if (this.ambientLight && this.ambientLight.isEnabled()) {
      const data = this.ambientLight.getData();
      types[currentIndex] = 0 /* AMBIENT */;
      colors[currentIndex * 3] = data.color.x;
      colors[currentIndex * 3 + 1] = data.color.y;
      colors[currentIndex * 3 + 2] = data.color.z;
      intensities[currentIndex] = data.intensity;
      currentIndex++;
    }
    for (const light of this.lights) {
      if (!light.isEnabled())
        continue;
      if (currentIndex >= this.MAX_LIGHTS) {
        console.warn("Maximum number of lights (".concat(this.MAX_LIGHTS, ") reached. Some lights will not be rendered."));
        break;
      }
      const data = light.getData();
      types[currentIndex] = light.getType();
      const colorOffset = currentIndex * 3;
      colors[colorOffset] = data.color.x;
      colors[colorOffset + 1] = data.color.y;
      colors[colorOffset + 2] = data.color.z;
      intensities[currentIndex] = data.intensity;
      switch (light.getType()) {
        case 1 /* DIRECTIONAL */: {
          const dirLight = light;
          const dirData = dirLight.getData();
          const dirOffset = currentIndex * 3;
          directions[dirOffset] = dirData.direction.x;
          directions[dirOffset + 1] = dirData.direction.y;
          directions[dirOffset + 2] = dirData.direction.z;
          break;
        }
        case 2 /* POINT */: {
          const pointLight = light;
          const pointData = pointLight.getData();
          const posOffset = currentIndex * 3;
          positions[posOffset] = pointData.position.x;
          positions[posOffset + 1] = pointData.position.y;
          positions[posOffset + 2] = pointData.position.z;
          constants[currentIndex] = pointData.constant;
          linears[currentIndex] = pointData.linear;
          quadratics[currentIndex] = pointData.quadratic;
          break;
        }
        case 3 /* SPOT */: {
          const spotLight = light;
          const spotData = spotLight.getData();
          const posOffset = currentIndex * 3;
          const dirOffset = currentIndex * 3;
          positions[posOffset] = spotData.position.x;
          positions[posOffset + 1] = spotData.position.y;
          positions[posOffset + 2] = spotData.position.z;
          directions[dirOffset] = spotData.direction.x;
          directions[dirOffset + 1] = spotData.direction.y;
          directions[dirOffset + 2] = spotData.direction.z;
          constants[currentIndex] = spotData.constant;
          linears[currentIndex] = spotData.linear;
          quadratics[currentIndex] = spotData.quadratic;
          cutOffs[currentIndex] = spotData.cutOff;
          outerCutOffs[currentIndex] = spotData.outerCutOff;
          break;
        }
      }
      currentIndex++;
    }
    this.shaderManager.setUniform("u_numLights", currentIndex);
    this.shaderManager.setUniform("u_lightTypes", types);
    this.shaderManager.setUniform("u_lightPositions", positions);
    this.shaderManager.setUniform("u_lightDirections", directions);
    this.shaderManager.setUniform("u_lightColors", colors);
    this.shaderManager.setUniform("u_lightIntensities", intensities);
    this.shaderManager.setUniform("u_lightConstants", constants);
    this.shaderManager.setUniform("u_lightLinears", linears);
    this.shaderManager.setUniform("u_lightQuadratics", quadratics);
    this.shaderManager.setUniform("u_lightCutOffs", cutOffs);
    this.shaderManager.setUniform("u_lightOuterCutOffs", outerCutOffs);
  }
};

// ts/classes/webgl2/shaders/colorPickingShader.ts
var colorPickingVertexShader = "#version 300 es\nin vec3 a_position;\n\nuniform mat4 u_modelMatrix;\nuniform mat4 u_viewMatrix;\nuniform mat4 u_projectionMatrix;\n\nvoid main() {\n    gl_Position = u_projectionMatrix * u_viewMatrix * u_modelMatrix * vec4(a_position, 1.0);\n}";
var colorPickingFragmentShader = "#version 300 es\nprecision highp float;\n\nuniform vec3 u_pickingColor;\nout vec4 fragColor;\n\nvoid main() {\n    fragColor = vec4(u_pickingColor, 1.0);\n}";

// ts/classes/util/urlUtils.ts
var UrlUtils = class {
  /**
   * Gets the base URL for the application, considering base tags and current location
   */
  static getBaseUrl() {
    const baseTag = document.querySelector("base");
    if (baseTag && baseTag.href) {
      return baseTag.href;
    }
    const href = window.location.href;
    const cleanHref = href.split(/[?#]/)[0];
    return cleanHref.endsWith("/") ? cleanHref : cleanHref.substring(0, cleanHref.lastIndexOf("/") + 1);
  }
  /**
   * Resolve a relative URL against the application's base URL
   * @param url The URL to resolve
   * @returns The fully resolved URL
   */
  static resolveUrl(url) {
    if (url.match(/^(https?:)?\/\//)) {
      return url;
    }
    if (url.startsWith("/")) {
      return new URL(url, window.location.origin).href;
    }
    return new URL(url, this.getBaseUrl()).href;
  }
};

// ts/classes/webgl2/environmentMap.ts
var EnvironmentMap = class {
  constructor() {
    const gl = glob.ctx;
    this.cubemapTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.cubemapTexture);
    const faces = [
      gl.TEXTURE_CUBE_MAP_POSITIVE_X,
      gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
      gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
      gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
      gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
      gl.TEXTURE_CUBE_MAP_NEGATIVE_Z
    ];
    faces.forEach((face) => {
      gl.texImage2D(face, 0, gl.RGBA8, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255]));
    });
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
    this.irradianceTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.irradianceTexture);
    faces.forEach((face) => {
      gl.texImage2D(face, 0, gl.RGBA8, 32, 32, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    });
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
    this.prefilterTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.prefilterTexture);
    faces.forEach((face) => {
      gl.texImage2D(face, 0, gl.RGBA8, 128, 128, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    });
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
    gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
    this.brdfLUTTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.brdfLUTTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, 512, 512, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  }
  async loadFromUrls(urls) {
    if (urls.length !== 6) {
      throw new Error("Environment map requires exactly 6 image URLs for the cubemap faces");
    }
    const gl = glob.ctx;
    const faces = [
      gl.TEXTURE_CUBE_MAP_POSITIVE_X,
      gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
      gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
      gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
      gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
      gl.TEXTURE_CUBE_MAP_NEGATIVE_Z
    ];
    const imagePromises = urls.map((url, index) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = (err) => {
          console.error("Failed to load cubemap image: ".concat(url), err);
          const colors = [
            [255, 0, 0, 255],
            // positiveX - red
            [0, 255, 0, 255],
            // negativeX - green
            [0, 0, 255, 255],
            // positiveY - blue
            [255, 255, 0, 255],
            // negativeY - yellow
            [255, 0, 255, 255],
            // positiveZ - magenta
            [0, 255, 255, 255]
            // negativeZ - cyan
          ];
          const canvas = document.createElement("canvas");
          canvas.width = 64;
          canvas.height = 64;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.fillStyle = "rgba(".concat(colors[index].join(","), ")");
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "black";
            ctx.font = "10px Arial";
            ctx.fillText("Load Error", 5, 32);
          }
          resolve(canvas);
        };
        img.src = url;
      });
    });
    try {
      const images = await Promise.all(imagePromises);
      gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.cubemapTexture);
      images.forEach((image, i) => {
        gl.texImage2D(faces[i], 0, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, image);
      });
      gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
    } catch (error) {
      console.error("Failed to load environment map images:", error);
      throw error;
    }
  }
  bind(unit = 0) {
    const gl = glob.ctx;
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.cubemapTexture);
    gl.activeTexture(gl.TEXTURE0 + unit + 1);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.irradianceTexture);
    gl.activeTexture(gl.TEXTURE0 + unit + 2);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.prefilterTexture);
    gl.activeTexture(gl.TEXTURE0 + unit + 3);
    gl.bindTexture(gl.TEXTURE_2D, this.brdfLUTTexture);
  }
  /**
   * Binds only the main cubemap texture (for skybox)
   * @param unit The texture unit to bind to
   */
  bindCubemap(unit = 0) {
    const gl = glob.ctx;
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.cubemapTexture);
  }
};
var EnvironmentMapLoader = class {
  static async loadFromUrls(urls) {
    const envMap = new EnvironmentMap();
    const urlArray = [
      UrlUtils.resolveUrl(urls.positiveX),
      UrlUtils.resolveUrl(urls.negativeX),
      UrlUtils.resolveUrl(urls.positiveY),
      UrlUtils.resolveUrl(urls.negativeY),
      UrlUtils.resolveUrl(urls.positiveZ),
      UrlUtils.resolveUrl(urls.negativeZ)
    ];
    await envMap.loadFromUrls(urlArray);
    return envMap;
  }
  static async loadFromDirectory(baseUrl, format = "png") {
    const texturePath = baseUrl.replace(/^\//, "");
    const fullBaseUrl = UrlUtils.resolveUrl(texturePath);
    return this.loadFromUrls({
      positiveX: "".concat(fullBaseUrl, "/px.").concat(format),
      negativeX: "".concat(fullBaseUrl, "/nx.").concat(format),
      positiveY: "".concat(fullBaseUrl, "/py.").concat(format),
      negativeY: "".concat(fullBaseUrl, "/ny.").concat(format),
      positiveZ: "".concat(fullBaseUrl, "/pz.").concat(format),
      negativeZ: "".concat(fullBaseUrl, "/nz.").concat(format)
    });
  }
};

// ts/classes/webgl2/shaders/skyboxVertexShader.ts
var skyboxVertexShader = "#version 300 es\nprecision highp float;\n\n// Attributes\nin vec3 a_position;\n\n// Uniforms\nuniform mat4 u_viewMatrix;\nuniform mat4 u_projectionMatrix;\n\n// Output to fragment shader\nout vec3 v_texCoord;\n\nvoid main() {\n    // Use position as texture coordinate for cubemap sampling\n    v_texCoord = a_position;\n    \n    // Remove translation from view matrix to keep skybox centered on camera\n    mat4 viewMatrixNoTranslation = mat4(\n        vec4(u_viewMatrix[0].xyz, 0.0),\n        vec4(u_viewMatrix[1].xyz, 0.0),\n        vec4(u_viewMatrix[2].xyz, 0.0),\n        vec4(0.0, 0.0, 0.0, 1.0)\n    );\n    \n    // Position vertices at the far plane\n    vec4 pos = u_projectionMatrix * viewMatrixNoTranslation * vec4(a_position, 1.0);\n    \n    // Set z equal to w to ensure skybox is always at the far plane\n    gl_Position = pos.xyww;\n}";

// ts/classes/webgl2/shaders/skyboxFragmentShader.ts
var skyboxFragmentShader = "#version 300 es\nprecision highp float;\n\n// Input from vertex shader\nin vec3 v_texCoord;\n\n// Environment map\nuniform samplerCube u_environmentMap;\n\n// Output\nout vec4 fragColor;\n\nvoid main() {\n    // Sample environment map (skybox) using direction vector\n    vec3 color = texture(u_environmentMap, v_texCoord).rgb;\n    \n    // Apply tone mapping\n    // color = color / (color + vec3(1.0)); // Reinhard tone mapping\n\n    // Gamma correction\n    color = pow(color, vec3(1.0/2.2));\n    \n    fragColor = vec4(color, 1.0);\n}";

// ts/classes/webgl2/skybox.ts
var Skybox = class {
  constructor() {
    this.environmentMap = null;
    try {
      glob.shaderManager.useProgram("skybox");
    } catch (error) {
      glob.shaderManager.loadShaderProgram("skybox", skyboxVertexShader, skyboxFragmentShader);
    }
    this.vao = new VertexArray(glob.ctx);
    this.initCube();
  }
  initCube() {
    const vertices = new Float32Array([
      // Positions          
      -1,
      1,
      -1,
      -1,
      -1,
      -1,
      1,
      -1,
      -1,
      1,
      -1,
      -1,
      1,
      1,
      -1,
      -1,
      1,
      -1,
      -1,
      -1,
      1,
      -1,
      -1,
      -1,
      -1,
      1,
      -1,
      -1,
      1,
      -1,
      -1,
      1,
      1,
      -1,
      -1,
      1,
      1,
      -1,
      -1,
      1,
      -1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      -1,
      1,
      -1,
      -1,
      -1,
      -1,
      1,
      -1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      -1,
      1,
      -1,
      -1,
      1,
      -1,
      1,
      -1,
      1,
      1,
      -1,
      1,
      1,
      1,
      1,
      1,
      1,
      -1,
      1,
      1,
      -1,
      1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      1,
      1,
      -1,
      -1,
      1,
      -1,
      -1,
      -1,
      -1,
      1,
      1,
      -1,
      1
    ]);
    this.vao.bind();
    const positionBuffer = glob.ctx.createBuffer();
    glob.ctx.bindBuffer(glob.ctx.ARRAY_BUFFER, positionBuffer);
    glob.ctx.bufferData(glob.ctx.ARRAY_BUFFER, vertices, glob.ctx.STATIC_DRAW);
    glob.ctx.enableVertexAttribArray(0);
    glob.ctx.vertexAttribPointer(0, 3, glob.ctx.FLOAT, false, 0, 0);
    this.vao.unbind();
  }
  setEnvironmentMap(environmentMap) {
    this.environmentMap = environmentMap;
  }
  render(viewMatrix, projectionMatrix) {
    if (!this.environmentMap)
      return;
    const gl = glob.ctx;
    gl.depthMask(false);
    gl.depthFunc(gl.LEQUAL);
    glob.shaderManager.useProgram("skybox");
    glob.shaderManager.setUniform("u_viewMatrix", viewMatrix);
    glob.shaderManager.setUniform("u_projectionMatrix", projectionMatrix);
    gl.activeTexture(gl.TEXTURE0);
    this.environmentMap.bindCubemap(0);
    glob.shaderManager.setUniform("u_environmentMap", 0);
    this.vao.bind();
    gl.drawArrays(gl.TRIANGLES, 0, 36);
    this.vao.unbind();
    gl.depthMask(true);
    gl.depthFunc(gl.LESS);
  }
  dispose() {
    this.vao.dispose();
  }
};

// ts/classes/webgl2/scene.ts
var Scene = class extends ContainerObject {
  constructor(camera, options = {}) {
    var _a, _b;
    super();
    this.clearColor = [0, 0, 0, 1];
    this.showColorPicking = true;
    this.pickingFramebuffer = null;
    this.pickingTexture = null;
    this.pickingDepthBuffer = null;
    this.showShadowMap = false;
    this.frameCount = 0;
    this.debugShadowMap = false;
    this.debugLightIndex = 0;
    this.fullScreenQuadVAO = null;
    this.passes = {
      shadow: true,
      picking: false,
      render: true
    };
    this.camera = camera;
    this.scene = this;
    this.lightManager = new LightManager(glob.shaderManager);
    this.inputMap = (_a = options.inputMap) != null ? _a : new InputMap();
    this.ambientLight = new AmbientLight({ color: options.ambientLightColor || v3(1, 1, 1), intensity: (_b = options.ambientLightIntensity) != null ? _b : 0.1 });
    this.environmentMap = options.environmentMap;
    this.skybox = new Skybox();
    if (this.environmentMap) {
      this.skybox.setEnvironmentMap(this.environmentMap);
    }
    glob.shaderManager.loadShaderProgram("picking", colorPickingVertexShader, colorPickingFragmentShader);
    glob.events.resize.subscribe("level", this.resize.bind(this));
  }
  get ambientLight() {
    return this._ambientLight;
  }
  set ambientLight(value) {
    this._ambientLight = value;
    this.lightManager.setAmbientLight(this.ambientLight);
  }
  click(vector2) {
    this.lastClick = vector2;
  }
  getLights() {
    return this.lightManager.getLights();
  }
  render(obj) {
    const gl = glob.ctx;
    this.camera.tick(obj);
    const viewMatrix = this.camera.getViewMatrix();
    const projectionMatrix = this.camera.getProjectionMatrix();
    if (this.passes.picking) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.pickingFramebuffer);
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.clearColor(0, 0, 0, 1);
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
      glob.shaderManager.useProgram("picking");
      for (const object of this.children) {
        if (!object.vao || object.pickColorArray === void 0)
          continue;
        glob.shaderManager.setUniform("u_pickingColor", new Float32Array(object.pickColorArray.vec));
        object.render(obj, viewMatrix, projectionMatrix);
      }
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    const shadowCastingLights = this.passes.shadow ? this.getLights().filter(
      (light) => light instanceof PointLight && light.isEnabled() && light.getIntensity() > 1e-4
      // Only cast shadows for lights that are actually contributing
    ) : [];
    const castsShadow = new Array(10).fill(false);
    const lightSpaceMatrices = new Float32Array(10 * 16);
    const hasAmbientLight = this.ambientLight !== null && this.ambientLight.isEnabled();
    const indexOffset = hasAmbientLight ? 1 : 0;
    for (let i = 0; i < shadowCastingLights.length; i++) {
      const light = shadowCastingLights[i];
      const lightIndex = i + indexOffset;
      const shadowMap = light.getShadowMap();
      shadowMap.bind(glob.ctx);
      shadowMap.bindDepthTexture(glob.ctx, 0);
      glob.shaderManager.useProgram("shadow");
      const lightSpaceMatrix = light.getLightSpaceMatrix();
      glob.shaderManager.setUniform("u_lightSpaceMatrix", lightSpaceMatrix.mat4);
      glob.ctx.enable(glob.ctx.DEPTH_TEST);
      glob.ctx.depthFunc(glob.ctx.LESS);
      glob.ctx.depthMask(true);
      glob.ctx.clearDepth(1);
      glob.ctx.clear(glob.ctx.DEPTH_BUFFER_BIT);
      lightSpaceMatrix.mat4.forEach((value, index) => {
        lightSpaceMatrices[lightIndex * 16 + index] = value;
      });
      castsShadow[lightIndex] = true;
      for (const object of this.children) {
        if (!object.vao)
          continue;
        glob.shaderManager.setUniform("u_modelMatrix", object.transform.getWorldMatrix().mat4);
        object.vao.bind();
        if (object.indexBuffer) {
          glob.ctx.drawElements(glob.ctx.TRIANGLES, object.indexBuffer.getCount(), glob.ctx.UNSIGNED_SHORT, 0);
        } else {
          glob.ctx.drawArrays(glob.ctx.TRIANGLES, 0, object.drawCount);
        }
      }
      shadowMap.unbind(glob.ctx);
    }
    if (this.passes.render) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      gl.clearColor(...this.clearColor);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LESS);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      if (this.environmentMap) {
        this.skybox.render(viewMatrix.mat4, projectionMatrix.mat4);
      }
      glob.shaderManager.useProgram("pbr");
      this.lightManager.updateShaderUniforms();
      glob.shaderManager.setUniform("u_lightSpaceMatrices", lightSpaceMatrices);
      glob.shaderManager.setUniform("u_castsShadow", castsShadow);
      shadowCastingLights.forEach((light, i) => {
        if (light instanceof PointLight) {
          const lightIndex = i + indexOffset;
          const shadowMap = light.getShadowMap();
          shadowMap.bindDepthTexture(glob.ctx, lightIndex + 5);
          if (lightIndex < 4) {
            glob.shaderManager.setUniform("u_shadowMap".concat(lightIndex), lightIndex + 5);
            const lightSpaceMatrix = light.getLightSpaceMatrix();
            for (let j = 0; j < 16; j++) {
              lightSpaceMatrices[lightIndex * 16 + j] = lightSpaceMatrix.mat4[j];
            }
            castsShadow[lightIndex] = true;
          }
        }
      });
      glob.shaderManager.setUniform("u_lightSpaceMatrices", lightSpaceMatrices);
      glob.shaderManager.setUniform("u_castsShadow", castsShadow);
      if (this.environmentMap) {
        this.environmentMap.bind(11);
        glob.shaderManager.setUniform("u_environmentMap", 11);
        glob.shaderManager.setUniform("u_irradianceMap", 12);
        glob.shaderManager.setUniform("u_prefilterMap", 13);
        glob.shaderManager.setUniform("u_brdfLUT", 14);
        glob.shaderManager.setUniform("u_useEnvironmentMap", 1);
      } else {
        glob.shaderManager.setUniform("u_useEnvironmentMap", 0);
      }
      const cameraPosition = this.camera.getPosition();
      glob.shaderManager.setUniform("u_viewPos", new Float32Array([cameraPosition.x, cameraPosition.y, cameraPosition.z]));
      for (const object of this.children) {
        object.render(obj, viewMatrix, projectionMatrix);
      }
    }
    this.frameCount++;
  }
  dispose() {
    var _a;
    for (const object of this.children) {
      object.vao.dispose();
      (_a = object.indexBuffer) == null ? void 0 : _a.dispose();
    }
    this.skybox.dispose();
    this.children = [];
  }
  tick(obj) {
  }
  afterTick(obj) {
    this.render(obj);
  }
  resize() {
    this.camera.updateProjectionMatrix();
    const gl = glob.ctx;
    gl.bindTexture(gl.TEXTURE_2D, this.pickingTexture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.canvas.width,
      gl.canvas.height,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null
    );
    gl.bindRenderbuffer(gl.RENDERBUFFER, this.pickingDepthBuffer);
    gl.renderbufferStorage(
      gl.RENDERBUFFER,
      gl.DEPTH_COMPONENT16,
      gl.canvas.width,
      gl.canvas.height
    );
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
  }
  getActualColor(vector2, range = 1) {
    const gl = glob.ctx;
    const pixelData = new Uint8Array(4);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.pickingFramebuffer);
    const rect = gl.canvas.getBoundingClientRect();
    const x = Math.round(vector2.x - rect.left);
    const y = Math.round(gl.canvas.height - (vector2.y - rect.top));
    gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixelData);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    let color = v3(
      pixelData[0],
      pixelData[1],
      pixelData[2]
    );
    if (range === 1) {
      color = color.scale(1 / 255);
    }
    return color;
  }
  getColor(vector2) {
    const color = this.getActualColor(vector2);
    if (color.equals(v3(0, 0, 0)) || color.equals(v3(1, 1, 1)))
      return void 0;
    for (const object of this.children) {
      if (object.colorMatch(color)) {
        return object;
      }
    }
    return void 0;
  }
  addLight(light) {
    if (light instanceof AmbientLight) {
      console.warn("Use setAmbientLight() to set the ambient light instead of addLight()");
      return;
    }
    this.lightManager.addLight(light);
  }
  removeLight(light) {
    if (light instanceof AmbientLight) {
      console.warn("Cannot remove ambient light. Use setAmbientLight() to modify it instead");
      return;
    }
    this.lightManager.removeLight(light);
  }
  // Add method to toggle color picking visualization
  toggleColorPicking() {
    this.showColorPicking = !this.showColorPicking;
  }
  async setEnvironmentMap(envMapUrl) {
    const envMap = await EnvironmentMapLoader.loadFromDirectory(envMapUrl);
    this.environmentMap = envMap;
    this.skybox.setEnvironmentMap(envMap);
  }
};

// ts/classes/webgl2/camera.ts
var Camera = class {
  get fov() {
    return this._fov;
  }
  set fov(value) {
    this._fov = value;
    this.updateProjectionMatrix();
  }
  get near() {
    return this._near;
  }
  set near(value) {
    this._near = value;
    this.updateProjectionMatrix();
  }
  get far() {
    return this._far;
  }
  set far(value) {
    this._far = value;
    this.updateProjectionMatrix();
  }
  constructor({ position = v3(0, 0, 5), target = v3(0, 0, 0), fov = 60, near = 0.1, far = 1e3 } = {}) {
    this.position = position;
    this.target = target;
    this.fov = fov;
    this.near = near;
    this.far = far;
    this.updateViewMatrix();
    this.updateProjectionMatrix();
  }
  updateViewMatrix() {
    this.viewMatrix = Matrix4.lookAt(this.position, this.target);
  }
  updateProjectionMatrix() {
    this.projectionMatrix = m4().perspective(
      this.fov * Math.PI / 180,
      this.near,
      this.far
    );
  }
  setPosition(position) {
    this.position = position;
    this.updateViewMatrix();
  }
  setTarget(target) {
    this.target = target;
    this.updateViewMatrix();
  }
  setFov(fov) {
    this.fov = fov;
    this.updateProjectionMatrix();
  }
  getViewMatrix() {
    return this.viewMatrix;
  }
  getProjectionMatrix() {
    return this.projectionMatrix;
  }
  getPosition() {
    return this.position;
  }
  getTarget() {
    return this.target;
  }
  getAngle() {
    return this.target.subtract(this.position).normalize();
  }
  tick(obj) {
  }
};

// ts/classes/actor/actor.ts
var Actor = class extends ContainerObject {
  constructor(props = {}) {
    var _a;
    super(props);
    this.controllers = [];
    this.controllerList = {
      preTick: [],
      postTick: [],
      preRender: [],
      postRender: []
    };
    (_a = props.controllers) == null ? void 0 : _a.forEach((controller) => {
      this.addController(controller);
    });
  }
  build() {
    this.controllers.forEach((controller) => {
      var _a;
      (_a = controller.build) == null ? void 0 : _a.call(controller);
    });
  }
  addController(controller) {
    this.controllers.push(controller);
    controller.register(this);
    this.controllerList[controller.order].push(controller);
  }
  removeController(controller) {
    this.controllers = this.controllers.filter((c) => c !== controller);
    controller.unregister(this);
    this.controllerList[controller.props.order] = this.controllerList[controller.props.order].filter((c) => c !== controller);
  }
  render(obj, viewMatrix, projectionMatrix) {
    this.controllerList.preTick.forEach((controller) => {
      controller.tick(obj);
    });
    this.tick(obj);
    this.controllerList.postTick.forEach((controller) => {
      controller.tick(obj);
    });
    this.controllerList.preRender.forEach((controller) => {
      controller.tick(obj);
    });
    super.render(obj, viewMatrix, projectionMatrix);
    this.controllerList.postRender.forEach((controller) => {
      controller.tick(obj);
    });
  }
  tick(obj) {
  }
};

// ts/classes/actor/controller.ts
var Controller = class {
  constructor(props = {}) {
    var _a;
    this.props = props;
    this.order = (_a = props.order) != null ? _a : "preTick";
  }
  register(actor) {
    this.actor = actor;
  }
  unregister(actor) {
    this.actor = null;
  }
  tick(obj) {
  }
  build() {
  }
};

// ts/classes/elements/UI.ts
var UI = class extends DomElement {
  constructor(attr = {}) {
    super("div", attr);
    this._expanded = false;
    this.dom.classList.add("ui_container");
    this.collapseDiv = document.createElement("div");
    this.collapseDiv.classList.add("ui_collapse_div");
    this.dom.appendChild(this.collapseDiv);
    const collapseButton = document.createElement("div");
    collapseButton.classList.add("ui_collapse_button");
    collapseButton.addEventListener("click", () => {
      this.expanded = !this.expanded;
    });
    this.collapseDiv.appendChild(collapseButton);
    this.bottomDiv = document.createElement("div");
    this.bottomDiv.classList.add("ui_bottom_div");
    this.dom.appendChild(this.bottomDiv);
    this.touchControls = document.createElement("div");
    this.dom.appendChild(this.touchControls);
  }
  get expanded() {
    return this._expanded;
  }
  set expanded(value) {
    this._expanded = value;
    this.collapseDiv.classList.toggle("ui_collapse_div_expanded", value);
  }
  add(element, location2 = "collapse") {
    if (location2 === "collapse") {
      this.collapseDiv.appendChild(element.dom);
    } else {
      this.bottomDiv.appendChild(element.dom);
    }
  }
  static slider(data) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
    const wrapper = document.createElement("div");
    wrapper.classList.add("ui_slider_wrap");
    if (data.position) {
      wrapper.style.position = "absolute";
      wrapper.style[data.position.anchor.includes("top") ? "top" : "bottom"] = "".concat(data.position.y, "px");
      wrapper.style[data.position.anchor.includes("left") ? "left" : "right"] = "".concat(data.position.x, "px");
    }
    const valueDiv = document.createElement("input");
    valueDiv.type = "number";
    valueDiv.value = (_b = (_a = data.value) == null ? void 0 : _a.toString()) != null ? _b : data.min.toString();
    valueDiv.step = (_d = (_c = data.step) == null ? void 0 : _c.toString()) != null ? _d : "1";
    valueDiv.style.maxWidth = data.max.toString().length * 15 + 6 + "px";
    valueDiv.addEventListener("input", (e) => {
      data.onChange(Number(valueDiv.value));
    });
    wrapper.appendChild(valueDiv);
    valueDiv.classList.add("ui_slider_value");
    const slider = document.createElement("input");
    slider.type = "range";
    slider.min = data.min.toString();
    slider.max = data.max.toString();
    slider.value = (_f = (_e = data.value) == null ? void 0 : _e.toString()) != null ? _f : data.min.toString();
    slider.step = (_h = (_g = data.step) == null ? void 0 : _g.toString()) != null ? _h : "1";
    slider.addEventListener("input", (e) => {
      data.onChange(Number(slider.value));
      valueDiv.value = slider.value;
    });
    slider.style.width = (_j = (_i = data.width) == null ? void 0 : _i.toString()) != null ? _j : "100px";
    slider.classList.add("ui_slider_input");
    if (data.label) {
      const label = document.createElement("div");
      label.textContent = data.label;
      label.classList.add("ui_slider_label");
      wrapper.appendChild(label);
    }
    wrapper.appendChild(slider);
    return {
      dom: wrapper,
      change: (value) => {
        slider.value = value.toString();
        valueDiv.value = value.toString();
      }
    };
  }
  static data(data) {
    var _a, _b, _c, _d, _e, _f, _g;
    const wrapper = document.createElement("div");
    wrapper.classList.add("ui_data_wrap");
    wrapper.style.width = (_c = (_b = (_a = data.size) == null ? void 0 : _a.x) == null ? void 0 : _b.toString()) != null ? _c : "100px";
    wrapper.style.height = (_f = (_e = (_d = data.size) == null ? void 0 : _d.y) == null ? void 0 : _e.toString()) != null ? _f : "100px";
    if (data.position) {
      wrapper.style.position = "absolute";
      wrapper.style[data.position.anchor.includes("top") ? "top" : "bottom"] = "".concat(data.position.y, "px");
      wrapper.style[data.position.anchor.includes("left") ? "left" : "right"] = "".concat(data.position.x, "px");
    }
    if (data.label) {
      const label = document.createElement("div");
      label.textContent = data.label;
      label.classList.add("ui_data_label");
      wrapper.appendChild(label);
    }
    const valueDiv = document.createElement("div");
    valueDiv.textContent = (_g = data.value) != null ? _g : "";
    wrapper.appendChild(valueDiv);
    valueDiv.classList.add("ui_data_value");
    return {
      dom: wrapper,
      change: (value) => {
        valueDiv.textContent = value;
      }
    };
  }
};

// ts/classes/level/freeCam/freeCamController.ts
var PlaneController = class extends Controller {
  constructor() {
    super(...arguments);
    this.velocity = v3(0);
    this.speed = 4;
  }
  build() {
    super.build();
    this.actor.scene.ui.add(UI.slider({ value: this.speed, step: 0.1, label: "Speed", min: 0.2, max: 10, onChange: (value) => {
      this.speed = Math.max(value, 0.2);
    }, width: 600 }));
  }
  tick(obj) {
    var _a, _b;
    this.velocity = v3(
      (_a = glob.input.axis("movement")) == null ? void 0 : _a.x,
      glob.input.button("height"),
      -((_b = glob.input.axis("movement")) == null ? void 0 : _b.y)
    ).scale(this.speed).rotateXZ(this.actor.camera.angle - Math.PI / 2);
    if (this.velocity.magnitude() > 0) {
      this.actor.transform.setRotation(Quaternion.fromEuler(0, this.velocity.xz.angle(), 0));
    }
    this.actor.transform.setPosition(this.actor.transform.getLocalPosition().add(this.velocity.scale(obj.intervalS10 / 6)));
  }
};

// ts/classes/level/freeCam/camera.ts
var PlaneCamera = class extends Camera {
  constructor(scene, parent) {
    super({ position: v3(0, 20, 20), target: v3(0, 0, 0), fov: 50, near: 10, far: 1e4 });
    this.scene = scene;
    this.parent = parent;
    this.offset = v3(1e3, 100, 0);
    this.angle = 0;
  }
  tick(obj) {
    var _a, _b;
    this.angle += ((_a = glob.input.axis("camera")) == null ? void 0 : _a.x) * 0.01;
    this.offset.y += ((_b = glob.input.axis("camera")) == null ? void 0 : _b.y) * 2;
    this.offset.x += glob.input.button("cameraHeight") * 2;
    this.setPosition(this.parent.transform.getWorldPosition().add(this.offset.rotateXZ(this.angle)));
    this.setTarget(this.parent.transform.getWorldPosition());
  }
};

// ts/classes/level/freeCam/freeCam.ts
var Plane = class extends Actor {
  constructor() {
    super({
      position: v3(0, 200, 0),
      controllers: [
        new PlaneController()
      ]
    });
  }
  build() {
    super.build();
    this.add(IcoSphere.create({
      scale: v3(1, 1, 1),
      subdivisions: 4,
      smoothShading: true,
      material: new Material({
        baseColor: v3(1, 1, 1),
        roughness: 1,
        metallic: 0,
        ambientOcclusion: 0
      })
    }));
    this.camera = new PlaneCamera(this.scene, this);
    this.scene.camera = this.camera;
  }
  tick(obj) {
    super.tick(obj);
  }
};

// ts/classes/webgl2/meshes/plane.ts
var PlaneMesh = class extends BaseMesh {
  static generateIndices(flipNormal) {
    return new Uint16Array(
      flipNormal ? [0, 1, 2, 2, 3, 0] : [0, 2, 1, 0, 3, 2]
      // counter-clockwise winding for top visibility
    );
  }
  static generateNormals(flipNormal) {
    const normalY = flipNormal ? -1 : 1;
    return new Float32Array([
      0,
      normalY,
      0,
      0,
      normalY,
      0,
      0,
      normalY,
      0,
      0,
      normalY,
      0
    ]);
  }
  // Generate tangents for normal mapping
  static generateTangents() {
    return new Float32Array([
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0
    ]);
  }
  // Generate bitangents for normal mapping
  static generateBitangents(flipNormal) {
    const bitangentZ = flipNormal ? -1 : 1;
    return new Float32Array([
      0,
      0,
      bitangentZ,
      0,
      0,
      bitangentZ,
      0,
      0,
      bitangentZ,
      0,
      0,
      bitangentZ
    ]);
  }
  static generateColors(material) {
    const defaultColor = vec3_exports.fromValues(0.8, 0.8, 0.8);
    const color = material ? material.baseColor.vec : defaultColor;
    return new Float32Array([
      color[0],
      color[1],
      color[2],
      color[0],
      color[1],
      color[2],
      color[0],
      color[1],
      color[2],
      color[0],
      color[1],
      color[2]
    ]);
  }
  static createMeshData(props = {}) {
    const flipNormal = props.flipNormal || false;
    return {
      vertices: this.vertices,
      indices: this.generateIndices(flipNormal),
      normals: this.generateNormals(flipNormal),
      texCoords: this.texCoords,
      colors: this.generateColors(props.material),
      tangents: this.generateTangents(),
      bitangents: this.generateBitangents(flipNormal)
    };
  }
  static create(props = {}) {
    var _a, _b, _c, _d;
    if (!props.material && !props.texture) {
      props.material = new Material();
    }
    const meshData = this.createMeshData(props);
    const sceneObject = this.createSceneObject(meshData, __spreadProps(__spreadValues({}, props), { scale: v3((_b = (_a = props.scale) == null ? void 0 : _a.x) != null ? _b : 1, 1, (_d = (_c = props.scale) == null ? void 0 : _c.y) != null ? _d : 1) }));
    return sceneObject;
  }
};
PlaneMesh.vertices = new Float32Array([
  // Single face (square)
  -0.5,
  0,
  -0.5,
  // bottom-left
  0.5,
  0,
  -0.5,
  // bottom-right
  0.5,
  0,
  0.5,
  // top-right
  -0.5,
  0,
  0.5
  // top-left
]);
PlaneMesh.texCoords = new Float32Array([
  0,
  0,
  1,
  0,
  1,
  1,
  0,
  1
]);

// ts/classes/level/world/ocean.ts
var Ocean = class extends Actor {
  constructor() {
    super();
    this.add(this.waterPlane = PlaneMesh.create({
      position: v3(0, 10, 0),
      // Lower position for better sky reflections - world position affects reflection quality
      material: {
        baseColor: v3(0.4, 0.8, 0.9),
        // Deep blue-green tint for ocean
        roughness: 0.5,
        // Smoother surface for calm water, but not perfectly reflective
        metallic: 0.8,
        // Good reflection without being too mirror-like
        ambientOcclusion: 0.99,
        emissive: v3(0.01, 0.03, 0.05)
        // Subtle glow for depth
      },
      scale: v2(1e5, 1e5)
      // Adjust scale to see more of the reflection
    }));
  }
  tick(obj) {
    super.tick(obj);
    this.waterPlane.transform.setPosition(v3(0, Math.sin(obj.total * 1e-3) * 15 + 10, 0));
  }
};

// ts/classes/webgl2/meshes/fbxLoader.ts
var FBXParser = __toESM(require_lib2(), 1);
var _FBXLoader = class _FBXLoader extends BaseMesh {
  // Maximum vertices per chunk
  static async processFBXData(fbxData) {
    var _a;
    const objectsNode = fbxData.find((node) => node.name === "Objects");
    const connectionsNode = fbxData.find((node) => node.name === "Connections");
    if (!objectsNode)
      throw new Error("No Objects node found in FBX file");
    if (!connectionsNode)
      throw new Error("No Connections node found in FBX file");
    const geometries = objectsNode.nodes.filter((node) => node.name === "Geometry");
    const materialNodes = objectsNode.nodes.filter((node) => node.name === "Material");
    const materials = /* @__PURE__ */ new Map();
    for (const matNode of materialNodes) {
      const matId = matNode.props[0];
      const material = await this.parseMaterial(matNode, fbxData);
      materials.set(matId, material);
    }
    const geometryMaterialMap = /* @__PURE__ */ new Map();
    const typeConnections = /* @__PURE__ */ new Map();
    for (const conn of connectionsNode.nodes) {
      const props = conn.props;
      const sourceId = props[0];
      const destId = props[1];
      const type = props[2];
      if (type) {
        if (!typeConnections.has(type)) {
          typeConnections.set(type, /* @__PURE__ */ new Set());
        }
        (_a = typeConnections.get(type)) == null ? void 0 : _a.add(destId);
      }
    }
    for (const [type, connectedIds] of typeConnections) {
      const materialId = Array.from(connectedIds).find((id) => materials.has(id));
      if (materialId) {
        const material = materials.get(materialId);
        if (material) {
          const geometryIds = Array.from(connectedIds).filter(
            (id) => geometries.some((g) => g.props[0] === id)
          );
          for (const geometryId of geometryIds) {
            geometryMaterialMap.set(geometryId, material);
          }
        }
      }
    }
    return {
      geometries,
      materials,
      geometryMaterialMap
    };
  }
  static chunkMesh(vertices, indices, normals, texCoords, tangents, bitangents) {
    const chunks = [];
    const vertexCount = vertices.length / 3;
    if (vertexCount <= _FBXLoader.CHUNK_SIZE) {
      return [{
        vertices: new Float32Array(vertices),
        indices: new Uint16Array(indices),
        normals: new Float32Array(normals),
        texCoords: new Float32Array(texCoords),
        tangents: new Float32Array(tangents),
        bitangents: new Float32Array(bitangents)
      }];
    }
    let currentChunkVertices = [];
    let currentChunkIndices = [];
    let currentChunkNormals = [];
    let currentChunkTexCoords = [];
    let currentChunkTangents = [];
    let currentChunkBitangents = [];
    let vertexIndexMap = /* @__PURE__ */ new Map();
    let nextIndex = 0;
    for (let i = 0; i < indices.length; i += 3) {
      const faceIndices = [indices[i], indices[i + 1], indices[i + 2]];
      const faceVertCount = currentChunkVertices.length / 3;
      if (faceVertCount + 3 > _FBXLoader.CHUNK_SIZE) {
        chunks.push({
          vertices: new Float32Array(currentChunkVertices),
          indices: new Uint16Array(currentChunkIndices),
          normals: new Float32Array(currentChunkNormals),
          texCoords: new Float32Array(currentChunkTexCoords),
          tangents: new Float32Array(currentChunkTangents),
          bitangents: new Float32Array(currentChunkBitangents)
        });
        currentChunkVertices = [];
        currentChunkIndices = [];
        currentChunkNormals = [];
        currentChunkTexCoords = [];
        currentChunkTangents = [];
        currentChunkBitangents = [];
        vertexIndexMap.clear();
        nextIndex = 0;
      }
      for (const oldIndex of faceIndices) {
        let newIndex = vertexIndexMap.get(oldIndex);
        if (newIndex === void 0) {
          newIndex = nextIndex++;
          vertexIndexMap.set(oldIndex, newIndex);
          const vIdx = oldIndex * 3;
          currentChunkVertices.push(vertices[vIdx], vertices[vIdx + 1], vertices[vIdx + 2]);
          currentChunkNormals.push(normals[vIdx], normals[vIdx + 1], normals[vIdx + 2]);
          const tIdx = oldIndex * 2;
          currentChunkTexCoords.push(texCoords[tIdx], texCoords[tIdx + 1]);
          const tanIdx = oldIndex * 3;
          currentChunkTangents.push(tangents[tanIdx], tangents[tanIdx + 1], tangents[tanIdx + 2]);
          currentChunkBitangents.push(bitangents[tanIdx], bitangents[tanIdx + 1], bitangents[tanIdx + 2]);
        }
        currentChunkIndices.push(newIndex);
      }
    }
    if (currentChunkVertices.length > 0) {
      chunks.push({
        vertices: new Float32Array(currentChunkVertices),
        indices: new Uint16Array(currentChunkIndices),
        normals: new Float32Array(currentChunkNormals),
        texCoords: new Float32Array(currentChunkTexCoords),
        tangents: new Float32Array(currentChunkTangents),
        bitangents: new Float32Array(currentChunkBitangents)
      });
    }
    return chunks;
  }
  static parseMesh(fbxMesh, smoothShading = true) {
    const verticesNode = fbxMesh.nodes.find((n) => n.name === "Vertices");
    const vertices = (verticesNode == null ? void 0 : verticesNode.props[0]) || [];
    const indicesNode = fbxMesh.nodes.find((n) => n.name === "PolygonVertexIndex");
    const rawIndices = (indicesNode == null ? void 0 : indicesNode.props[0]) || [];
    const indices = [];
    let currentPolygon = [];
    rawIndices.forEach((index) => {
      const actualIndex = index < 0 ? -index - 1 : index;
      currentPolygon.push(actualIndex);
      if (index < 0) {
        for (let i = 1; i < currentPolygon.length - 1; i++) {
          indices.push(
            currentPolygon[0],
            currentPolygon[i],
            currentPolygon[i + 1]
          );
        }
        currentPolygon = [];
      }
    });
    const layerElementUV = fbxMesh.nodes.find((n) => n.name === "LayerElementUV");
    const uvsNode = layerElementUV == null ? void 0 : layerElementUV.nodes.find((n) => n.name === "UV");
    const uvIndexNode = layerElementUV == null ? void 0 : layerElementUV.nodes.find((n) => n.name === "UVIndex");
    const uvs = (uvsNode == null ? void 0 : uvsNode.props[0]) || [];
    const uvIndices = (uvIndexNode == null ? void 0 : uvIndexNode.props[0]) || indices;
    const uvPairs = Util.duplicate(
      Util.chunk(uvs, 2).map(([u, v]) => [u, 1 - v]),
      1
    );
    const normalizeVector = (x, y, z) => {
      const length2 = Math.sqrt(x * x + y * y + z * z);
      if (length2 === 0)
        return [0, 1, 0];
      return [x / length2, y / length2, z / length2];
    };
    const transformVertex = (x, y, z) => {
      return [x, z, -y];
    };
    const flatVertices = [];
    const flatNormals = [];
    const flatIndices = [];
    const flatTexCoords = [];
    const flatTangents = [];
    const flatBitangents = [];
    for (let i = 0; i < indices.length; i += 3) {
      const v1Index = indices[i] * 3;
      const v2Index = indices[i + 1] * 3;
      const v3Index = indices[i + 2] * 3;
      const v1 = transformVertex(
        vertices[v1Index],
        vertices[v1Index + 1],
        vertices[v1Index + 2]
      );
      const v22 = transformVertex(
        vertices[v2Index],
        vertices[v2Index + 1],
        vertices[v2Index + 2]
      );
      const v32 = transformVertex(
        vertices[v3Index],
        vertices[v3Index + 1],
        vertices[v3Index + 2]
      );
      const uv1 = uvPairs[uvIndices[i]] || [0, 0];
      const uv2 = uvPairs[uvIndices[i + 1]] || [0, 0];
      const uv3 = uvPairs[uvIndices[i + 2]] || [0, 0];
      const edge1 = [v22[0] - v1[0], v22[1] - v1[1], v22[2] - v1[2]];
      const edge2 = [v32[0] - v1[0], v32[1] - v1[1], v32[2] - v1[2]];
      const normal = normalizeVector(
        edge1[1] * edge2[2] - edge1[2] * edge2[1],
        edge1[2] * edge2[0] - edge1[0] * edge2[2],
        edge1[0] * edge2[1] - edge1[1] * edge2[0]
      );
      const deltaUV1 = [uv2[0] - uv1[0], uv2[1] - uv1[1]];
      const deltaUV2 = [uv3[0] - uv1[0], uv3[1] - uv1[1]];
      const f = 1 / (deltaUV1[0] * deltaUV2[1] - deltaUV2[0] * deltaUV1[1] || 1);
      const tangent = normalizeVector(
        f * (deltaUV2[1] * edge1[0] - deltaUV1[1] * edge2[0]),
        f * (deltaUV2[1] * edge1[1] - deltaUV1[1] * edge2[1]),
        f * (deltaUV2[1] * edge1[2] - deltaUV1[1] * edge2[2])
      );
      const bitangent = normalizeVector(
        f * (-deltaUV2[0] * edge1[0] + deltaUV1[0] * edge2[0]),
        f * (-deltaUV2[0] * edge1[1] + deltaUV1[0] * edge2[1]),
        f * (-deltaUV2[0] * edge1[2] + deltaUV1[0] * edge2[2])
      );
      const vertexCount = Math.floor(flatVertices.length / 3);
      flatVertices.push(...v1, ...v22, ...v32);
      flatTexCoords.push(...uv1, ...uv2, ...uv3);
      flatNormals.push(...normal, ...normal, ...normal);
      flatTangents.push(...tangent, ...tangent, ...tangent);
      flatBitangents.push(...bitangent, ...bitangent, ...bitangent);
      flatIndices.push(vertexCount, vertexCount + 1, vertexCount + 2);
    }
    return _FBXLoader.chunkMesh(
      flatVertices,
      flatIndices,
      flatNormals,
      flatTexCoords,
      flatTangents,
      flatBitangents
    );
  }
  static async parseMaterial(fbxMaterial, fbxData) {
    var _a, _b, _c, _d;
    const properties = ((_a = fbxMaterial.nodes.find((n) => n.name === "Properties70")) == null ? void 0 : _a.nodes) || [];
    let baseColor = v3(0.8, 0.2, 0.2);
    let roughness = 1;
    let metallic = 0;
    let ambientOcclusion = 1;
    let emissive = v3(0, 0, 0);
    let albedoMap;
    let metallicMap;
    let roughnessMap;
    let normalMap;
    let emissiveMap;
    let emissiveStrengthMap;
    const objectsNode = fbxData.find((node) => node.name === "Objects");
    const connectionsNode = fbxData.find((node) => node.name === "Connections");
    const textures = objectsNode.nodes.filter((n) => n.name === "Texture");
    const materialId = fbxMaterial.props[0];
    const textureConnections = connectionsNode.nodes.filter((c) => {
      const conn = c;
      const isConnectedToMaterial = conn.props[0] === materialId || conn.props[1] === materialId;
      const isConnectedToTexture = textures.some((t) => {
        const textureId = t.props[0];
        return conn.props[0] === textureId || conn.props[1] === textureId;
      });
      return isConnectedToMaterial || isConnectedToTexture;
    });
    for (const connection of textureConnections) {
      const textureNode = textures.find((t) => {
        const textureId = t.props[0];
        return textureId === connection.props[0] || textureId === connection.props[1];
      });
      if (textureNode) {
        const textureName = (_b = textureNode.nodes.find((n) => n.name === "TextureName")) == null ? void 0 : _b.props[0];
        const relativeFilename = (_c = textureNode.nodes.find((n) => n.name === "RelativeFilename")) == null ? void 0 : _c.props[0];
        if (relativeFilename) {
          try {
            const texture = await this.createTextureFromFile(relativeFilename);
            if ((textureName == null ? void 0 : textureName.toLowerCase().includes("diffuse")) || (textureName == null ? void 0 : textureName.toLowerCase().includes("base_color"))) {
              albedoMap = texture;
              baseColor = v3(1, 1, 1);
            } else if ((textureName == null ? void 0 : textureName.toLowerCase().includes("metallic")) || (textureName == null ? void 0 : textureName.toLowerCase().includes("metalness"))) {
              metallicMap = texture;
              metallic = 1;
            } else if (textureName == null ? void 0 : textureName.toLowerCase().includes("roughness")) {
              roughnessMap = texture;
              roughness = 1;
            } else if ((textureName == null ? void 0 : textureName.toLowerCase().includes("normal")) || (textureName == null ? void 0 : textureName.toLowerCase().includes("bump"))) {
              normalMap = texture;
            } else if ((textureName == null ? void 0 : textureName.toLowerCase().includes("emission")) || (textureName == null ? void 0 : textureName.toLowerCase().includes("emissive"))) {
              if (textureName == null ? void 0 : textureName.toLowerCase().includes("strength")) {
                emissiveStrengthMap = texture;
              } else {
                emissiveMap = texture;
                emissive = v3(1, 1, 1);
              }
            }
          } catch (error) {
            console.error("Failed to load texture:", error);
          }
        }
      }
    }
    for (const prop of properties) {
      if (!Array.isArray(prop.props))
        continue;
      const propName = prop.props[0];
      const propType = prop.props[1];
      const isColorProp = propType === "Color" || propType === "ColorRGB";
      const colorValues = isColorProp ? [
        prop.props[4],
        prop.props[5],
        prop.props[6]
      ] : null;
      switch (propName) {
        case "DiffuseColor":
        case "Diffuse":
          if (colorValues && !albedoMap) {
            baseColor = v3(colorValues[0], colorValues[1], colorValues[2]);
          }
          break;
        case "Roughness":
        case "Roughness Factor":
          roughness = Number(prop.props[4]) || 0.5;
          break;
        case "ShininessExponent":
          const shininess = Number(prop.props[4]) || 50;
          roughness = 1 - Math.min(shininess / 100, 1);
          break;
        case "Metallic":
        case "MetallicFactor":
          metallic = Number(prop.props[4]) || 0;
          break;
        case "SpecularFactor":
          metallic = Math.min(Number(prop.props[4]) || 0, 1);
          break;
        case "AmbientColor":
        case "Ambient":
          if (colorValues) {
            ambientOcclusion = (colorValues[0] + colorValues[1] + colorValues[2]) / 3;
          }
          break;
        case "EmissiveColor":
        case "Emissive":
          if (colorValues) {
            const emissiveFactor = ((_d = properties.find(
              (p) => p.props[0] === "EmissiveFactor"
            )) == null ? void 0 : _d.props[4]) || 1;
            emissive = v3(
              colorValues[0] * emissiveFactor,
              colorValues[1] * emissiveFactor,
              colorValues[2] * emissiveFactor
            );
          }
          break;
      }
    }
    return new Material({
      baseColor,
      roughness,
      metallic,
      ambientOcclusion,
      emissive,
      albedoMap,
      metallicMap,
      roughnessMap,
      normalMap,
      emissiveMap,
      emissiveStrengthMap
    });
  }
  // Helper function to create a texture from a file
  static async createTextureFromFile(filename) {
    const image = new Image();
    const texturePromise = new Promise((resolve, reject) => {
      image.onload = () => {
        try {
          const gl = glob.ctx;
          if (!gl) {
            throw new Error("WebGL context not available");
          }
          const texture = gl.createTexture();
          if (!texture) {
            throw new Error("Failed to create texture");
          }
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
          gl.generateMipmap(gl.TEXTURE_2D);
          resolve(texture);
        } catch (error) {
          reject(error);
        }
      };
      image.onerror = (err) => {
        console.error("Failed to load texture: ".concat(filename), err);
        reject(new Error("Failed to load texture: ".concat(filename)));
      };
    });
    const texturePath = "fbx/".concat(filename).replace(/^\//, "");
    image.src = UrlUtils.resolveUrl(texturePath);
    return texturePromise;
  }
  static async loadFromBuffer(buffer, props = {}) {
    try {
      const fbxData = FBXParser.parseBinary(new Uint8Array(buffer));
      const processedData = await this.processFBXData(fbxData);
      const objects = [];
      for (const geometry of processedData.geometries) {
        const geometryId = geometry.props[0];
        const material = processedData.geometryMaterialMap.get(geometryId);
        const meshDataChunks = this.parseMesh(geometry);
        for (const meshData of meshDataChunks) {
          const sceneObject = this.createSceneObject(meshData, __spreadProps(__spreadValues({}, props), {
            material
          }));
          objects.push(sceneObject);
        }
      }
      return objects;
    } catch (error) {
      console.error("Error loading FBX:", error);
      throw error;
    }
  }
  static async loadFromUrl(url, props = {}) {
    try {
      const fullUrl = UrlUtils.resolveUrl(url);
      const response = await fetch(fullUrl);
      if (!response.ok) {
        console.error("Failed to fetch FBX file: ".concat(response.statusText, " (").concat(response.status, ") from ").concat(fullUrl));
        throw new Error("Failed to fetch FBX file: ".concat(response.statusText, " (").concat(response.status, ")"));
      }
      const buffer = await response.arrayBuffer();
      const data = await this.loadFromBuffer(buffer, props);
      return data;
    } catch (error) {
      console.error("Error loading FBX from URL: ".concat(url), error);
      throw error;
    }
  }
};
_FBXLoader.CHUNK_SIZE = 65536;
var FBXLoader = _FBXLoader;

// ts/classes/webgl2/meshes/fbx.ts
var FBX = class _FBX extends ContainerObject {
  constructor(url, props = {}) {
    super(props);
    this.loadFbx(url);
  }
  async loadFbx(url) {
    const data = await FBXLoader.loadFromUrl(url);
    this.add(data);
  }
  static create(url, props = {}) {
    const fbx = new _FBX(url, props);
    return fbx;
  }
};

// ts/classes/level/world/island.ts
var Island = class extends Actor {
  constructor() {
    super();
    this.add(FBX.create("fbx/island1.fbx", {
      position: v3(0, 0, 0),
      rotation: Quaternion.fromEuler(0, 0, 0)
    }));
    this.add(FBX.create("fbx/island2.fbx", {
      position: v3(0, 0, 0),
      rotation: Quaternion.fromEuler(0, 0, 0)
    }));
    this.add(FBX.create("fbx/island3.fbx", {
      position: v3(0, 0, 0),
      rotation: Quaternion.fromEuler(0, 0, 0)
    }));
  }
};

// ts/classes/level/world/sky.ts
var Sky = class extends ContainerObject {
  constructor(level) {
    super();
    level.setEnvironmentMap("textures/envmap/sky");
    level.addLight(this.sun = new DirectionalLight({
      direction: v3(0.2, -0.5, -1.3).rotateXZ(-0.7).normalize(),
      // Match sun position in skybox
      color: v3(1, 0.98, 0.95),
      // Slightly warm sunlight
      intensity: 2,
      // Increased intensity
      enabled: true
    }));
    level.addLight(new DirectionalLight({
      direction: v3(-0.2, -0.5, 1.3).rotateXZ(-0.7).normalize(),
      // Match sun position in skybox
      color: v3(0.95, 0.98, 1),
      // Slightly blue skylight
      intensity: 0.2,
      // Increased intensity
      enabled: true
    }));
  }
};

// ts/classes/input/keyboardReader.ts
var KeyboardJoyStickReader = class extends InputReader {
  constructor(keys) {
    super();
    this._state = [[false, false], [false, false]];
    this._vector = v2(0);
    this._frameFired = [0, 0];
    keys.forEach((k, i) => {
      glob.device.keyboard.register(
        k,
        () => {
          if (!this._state[Math.floor(i / 2)][i % 2]) {
            this._frameFired[i] = glob.frame;
          }
          this._state[Math.floor(i / 2)][i % 2] = true;
          this.setVector();
        },
        () => {
          this._state[Math.floor(i / 2)][i % 2] = false;
          this._frameFired[i] = void 0;
          this.setVector();
        }
      );
    });
  }
  setVector() {
    this._vector = v2(
      -this._state[0][0] + +this._state[0][1],
      -this._state[1][0] + +this._state[1][1]
    );
  }
  get value() {
    return this._vector;
  }
  get first() {
    return this._frameFired[0] === glob.frame || this._frameFired[1] === glob.frame;
  }
};
var KeyboardAxisReader = class extends InputReader {
  constructor(keys) {
    super();
    this._state = [false, false];
    this._value = 0;
    this._frameFired = [0, 0];
    keys.forEach((k, i) => {
      glob.device.keyboard.register(
        k,
        (frame) => {
          if (!this._state[i]) {
            this._frameFired[i] = frame;
          }
          this._state[i] = true;
          this.setValue();
        },
        () => {
          this._state[i] = false;
          this._frameFired[i] = void 0;
          this.setValue();
        }
      );
    });
  }
  setValue() {
    this._value = -this._state[0] + +this._state[1];
  }
  get value() {
    return this._value;
  }
  get first() {
    return this._frameFired[0] === glob.frame || this._frameFired[1] === glob.frame;
  }
};

// ts/classes/level/testLevel.ts
var TestLevel = class extends Scene {
  constructor() {
    super(new Camera({ position: v3(0, 100, 200), target: v3(0, 0, 0), fov: 40 }), {
      ambientLightColor: v3(0.4, 0.8, 0.9),
      ambientLightIntensity: 0.7,
      // Very subtle ambient lighting,
      inputMap: new InputMap(
        {
          "movement": [new KeyboardJoyStickReader(["a", "d", "s", "w"])],
          "camera": [new KeyboardJoyStickReader(["4", "6", "8", "2"])]
        },
        {
          "cameraHeight": [new KeyboardAxisReader(["9", "3"])],
          "height": [new KeyboardAxisReader(["q", "e"])]
        }
      )
    });
    this.clearColor = [0.2, 0.3, 0.5, 1];
    // Match sky color
    this.ui = new UI();
    this.add(new Ocean());
    this.add(new Island());
    this.add(new Sky(this));
    this.add(this.plane = new Plane());
    const data = UI.data({ value: "0", label: "precision", size: v2(400, 100) });
    this.ui.add(UI.slider({ value: this.camera.near, step: 1, label: "Near", min: 0, max: 100, onChange: (value) => {
      this.nearPlane = Math.max(value, 0.1);
      data.change((this.camera.far / this.camera.near).toString());
    }, width: 600 }));
    this.ui.add(UI.slider({ value: this.camera.far, step: 100, label: "Far ", min: 0, max: 1e5, onChange: (value) => {
      this.farPlane = Math.max(value, 0.1);
      data.change((this.camera.far / this.camera.near).toString());
    }, width: 600 }));
    this.ui.add(data);
    this.ui.add(UI.slider({ value: this.camera.fov, label: "FOV ", min: 1, max: 100, onChange: (value) => {
      this.fov = value;
    }, width: 600 }));
    this.ui.add(this.positionData = UI.data({ label: "P", size: v2(400, 100) }), "bottom");
    this.ui.add(this.rotationData = UI.data({ label: "R", size: v2(400, 100) }), "bottom");
    this.ui.add(this.fpsData = UI.data({ label: "FPS", size: v2(400, 100) }), "bottom");
    this.ui.expanded = false;
  }
  set nearPlane(value) {
    this.camera.near = value;
  }
  set farPlane(value) {
    this.camera.far = value;
  }
  set fov(value) {
    this.camera.fov = value;
  }
  tick(obj) {
    super.tick(obj);
    this.positionData.change(
      this.plane.transform.getWorldPosition().array.map((v) => v.toFixed(0)).join("m, ") + "m"
    );
    this.rotationData.change(
      this.plane.camera.getAngle().array.map((v) => v.toFixed(2)).join(", ")
    );
    this.fpsData.change(obj.frameRate.toFixed(2) + "/" + obj.maxRate.toFixed(2));
  }
};

// ts/classes/ticker.ts
var Ticker = class {
  constructor() {
    this._running = false;
    this.started = false;
    this.pauzedTime = 0;
    this.intervalKeeper = [];
    this.maxRate = 0;
    this.callbacks = [];
    this.frameN = 0;
    document.addEventListener("visibilitychange", () => {
      if (this.started) {
        this.running = !document.hidden;
      }
    });
  }
  get running() {
    return this._running;
  }
  set running(value) {
    this._running = value;
    if (value) {
      this.pTime = performance.now() - this.pauzedTime;
      this.id = window.requestAnimationFrame(this.frame.bind(this));
    } else {
      window.cancelAnimationFrame(this.id);
      this.pauzedTime = performance.now() - this.pTime;
    }
  }
  get startTime() {
    return this.sTime;
  }
  get eTime() {
    return performance.now() - this.sTime;
  }
  averagedInterval(count, interval) {
    const average = this.intervalKeeper.slice(0, count).reduce((partialSum, a) => partialSum + a, 0) / count;
    return Math.abs(interval - average) > 10 ? interval : average;
  }
  frame(timeStamp) {
    if (this.running) {
      const interval = timeStamp - this.pTime;
      this.intervalKeeper.push(interval);
      this.intervalKeeper = this.intervalKeeper.slice(0, 20);
      while (this.intervalKeeper.length < 20) {
        this.intervalKeeper.push(this.intervalKeeper[0]);
      }
      this.pTime = timeStamp;
      this.frameN++;
      this.maxRate = Math.max(this.maxRate, 1e3 / interval);
      glob.frame = this.frameN;
      const o = {
        interval,
        total: this.eTime,
        frameRate: 1e3 / interval,
        frame: this.frameN,
        intervalS3: this.averagedInterval(3, interval),
        intervalS10: this.averagedInterval(5, interval),
        intervalS20: this.averagedInterval(20, interval),
        maxRate: this.maxRate
      };
      this.callbacks.forEach((c) => {
        c(o);
      });
      this.id = window.requestAnimationFrame(this.frame.bind(this));
    }
  }
  start() {
    this.started = true;
    this._running = true;
    this.sTime = performance.now();
    this.pTime = performance.now();
    this.id = window.requestAnimationFrame(this.frame.bind(this));
  }
  add(callback) {
    this.callbacks.push(callback);
  }
};

// ts/classes/util/loader.ts
var Loader = class extends DomElement {
  constructor() {
    super("div", {
      position: new Vector2(5, 5),
      size: new Vector2(600, 70),
      background: "#272727"
    });
    this.bar = new DomElement("div", {
      size: new Vector2(600, 70),
      background: "#80808070"
    });
    this.dom.appendChild(this.bar.dom);
    this.text = new DomText({
      text: "",
      fontSize: 35,
      fontWeight: 900,
      color: "white",
      size: new Vector2(600, 70),
      position: new Vector2(30, -10),
      fontFamily: "monospace"
    });
    this.dom.appendChild(this.text.dom);
  }
  update(value, total) {
    this.text.text = "loaded ".concat(total - value, " out of ").concat(total, " assets");
    this.bar.width = 600 * (total - value) / total;
  }
};

// ts/game.ts
var glob = new class {
  constructor() {
    this.device = new InputDevices();
    this.frame = 0;
    this.events = {};
    this.input = new InputMap();
  }
  get renderer() {
    return this.game.renderer;
  }
  get shaderManager() {
    return this.renderer.shaderManager;
  }
  get mobile() {
    return this.device.mobile;
  }
  get ctx() {
    return this.renderer.ctx;
  }
}();
var Game = class {
  constructor() {
    this.readyToStart = false;
    this._waitCount = 0;
    this.started = false;
    this.total = 0;
    this.levels = {};
    this.padManager = new PadManager();
    glob.game = this;
    this.init();
    glob.device.ready();
  }
  get t() {
    return this.renderer.tickerData;
  }
  get waitCount() {
    return this._waitCount;
  }
  set waitCount(value) {
    if (value > this._waitCount) {
      this.total++;
    }
    if (!this.started) {
      if (value === 0 && this.readyToStart) {
        this.start();
      } else {
        this.loader.update(value, this.total);
      }
    }
    this._waitCount = value;
  }
  init() {
    this.renderer = new Renderer();
    this.loader = new Loader();
    this.renderer.addChild(this.loader);
    this.ticker = new Ticker();
    this.ticker.add(this.tick.bind(this));
    this.addLevel("test", new TestLevel());
    if (this.waitCount === 0) {
      this.start();
    } else {
      this.readyToStart = true;
    }
  }
  tick(obj) {
    this.renderer.tick(obj);
  }
  addLevel(s, level) {
    this.levels[s] = level;
    if (level.ui) {
      document.body.appendChild(level.ui.dom);
    }
    this.active = level;
    glob.input = this.active.inputMap;
  }
  get level() {
    return this.active;
  }
  start() {
    this.started = true;
    this.loader.visible = false;
    this.ticker.start();
  }
};

// ts/index.ts
document.addEventListener("DOMContentLoaded", async () => {
  if (location.hostname !== "localhost") {
    const base = document.createElement("base");
    base.href = "https://basamols.github.io/BWGL2/dist/";
    document.head.appendChild(base);
  }
  const g = new Game();
  document.body.appendChild(g.renderer.dom);
});
//# sourceMappingURL=index.js.map
