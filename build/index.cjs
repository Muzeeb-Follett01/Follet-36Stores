#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/zod/v3/helpers/util.js
var util, objectUtil, ZodParsedType, getParsedType;
var init_util = __esm({
  "node_modules/zod/v3/helpers/util.js"() {
    (function(util2) {
      util2.assertEqual = (_) => {
      };
      function assertIs(_arg) {
      }
      util2.assertIs = assertIs;
      function assertNever(_x) {
        throw new Error();
      }
      util2.assertNever = assertNever;
      util2.arrayToEnum = (items) => {
        const obj = {};
        for (const item of items) {
          obj[item] = item;
        }
        return obj;
      };
      util2.getValidEnumValues = (obj) => {
        const validKeys = util2.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
        const filtered = {};
        for (const k of validKeys) {
          filtered[k] = obj[k];
        }
        return util2.objectValues(filtered);
      };
      util2.objectValues = (obj) => {
        return util2.objectKeys(obj).map(function(e) {
          return obj[e];
        });
      };
      util2.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object) => {
        const keys = [];
        for (const key in object) {
          if (Object.prototype.hasOwnProperty.call(object, key)) {
            keys.push(key);
          }
        }
        return keys;
      };
      util2.find = (arr, checker) => {
        for (const item of arr) {
          if (checker(item))
            return item;
        }
        return void 0;
      };
      util2.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && Number.isFinite(val) && Math.floor(val) === val;
      function joinValues(array, separator = " | ") {
        return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
      }
      util2.joinValues = joinValues;
      util2.jsonStringifyReplacer = (_, value) => {
        if (typeof value === "bigint") {
          return value.toString();
        }
        return value;
      };
    })(util || (util = {}));
    (function(objectUtil2) {
      objectUtil2.mergeShapes = (first, second) => {
        return {
          ...first,
          ...second
          // second overwrites first
        };
      };
    })(objectUtil || (objectUtil = {}));
    ZodParsedType = util.arrayToEnum([
      "string",
      "nan",
      "number",
      "integer",
      "float",
      "boolean",
      "date",
      "bigint",
      "symbol",
      "function",
      "undefined",
      "null",
      "array",
      "object",
      "unknown",
      "promise",
      "void",
      "never",
      "map",
      "set"
    ]);
    getParsedType = (data) => {
      const t = typeof data;
      switch (t) {
        case "undefined":
          return ZodParsedType.undefined;
        case "string":
          return ZodParsedType.string;
        case "number":
          return Number.isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
        case "boolean":
          return ZodParsedType.boolean;
        case "function":
          return ZodParsedType.function;
        case "bigint":
          return ZodParsedType.bigint;
        case "symbol":
          return ZodParsedType.symbol;
        case "object":
          if (Array.isArray(data)) {
            return ZodParsedType.array;
          }
          if (data === null) {
            return ZodParsedType.null;
          }
          if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
            return ZodParsedType.promise;
          }
          if (typeof Map !== "undefined" && data instanceof Map) {
            return ZodParsedType.map;
          }
          if (typeof Set !== "undefined" && data instanceof Set) {
            return ZodParsedType.set;
          }
          if (typeof Date !== "undefined" && data instanceof Date) {
            return ZodParsedType.date;
          }
          return ZodParsedType.object;
        default:
          return ZodParsedType.unknown;
      }
    };
  }
});

// node_modules/zod/v3/ZodError.js
var ZodIssueCode, quotelessJson, ZodError;
var init_ZodError = __esm({
  "node_modules/zod/v3/ZodError.js"() {
    init_util();
    ZodIssueCode = util.arrayToEnum([
      "invalid_type",
      "invalid_literal",
      "custom",
      "invalid_union",
      "invalid_union_discriminator",
      "invalid_enum_value",
      "unrecognized_keys",
      "invalid_arguments",
      "invalid_return_type",
      "invalid_date",
      "invalid_string",
      "too_small",
      "too_big",
      "invalid_intersection_types",
      "not_multiple_of",
      "not_finite"
    ]);
    quotelessJson = (obj) => {
      const json = JSON.stringify(obj, null, 2);
      return json.replace(/"([^"]+)":/g, "$1:");
    };
    ZodError = class _ZodError extends Error {
      get errors() {
        return this.issues;
      }
      constructor(issues) {
        super();
        this.issues = [];
        this.addIssue = (sub) => {
          this.issues = [...this.issues, sub];
        };
        this.addIssues = (subs = []) => {
          this.issues = [...this.issues, ...subs];
        };
        const actualProto = new.target.prototype;
        if (Object.setPrototypeOf) {
          Object.setPrototypeOf(this, actualProto);
        } else {
          this.__proto__ = actualProto;
        }
        this.name = "ZodError";
        this.issues = issues;
      }
      format(_mapper) {
        const mapper = _mapper || function(issue) {
          return issue.message;
        };
        const fieldErrors = { _errors: [] };
        const processError = (error) => {
          for (const issue of error.issues) {
            if (issue.code === "invalid_union") {
              issue.unionErrors.map(processError);
            } else if (issue.code === "invalid_return_type") {
              processError(issue.returnTypeError);
            } else if (issue.code === "invalid_arguments") {
              processError(issue.argumentsError);
            } else if (issue.path.length === 0) {
              fieldErrors._errors.push(mapper(issue));
            } else {
              let curr = fieldErrors;
              let i = 0;
              while (i < issue.path.length) {
                const el = issue.path[i];
                const terminal = i === issue.path.length - 1;
                if (!terminal) {
                  curr[el] = curr[el] || { _errors: [] };
                } else {
                  curr[el] = curr[el] || { _errors: [] };
                  curr[el]._errors.push(mapper(issue));
                }
                curr = curr[el];
                i++;
              }
            }
          }
        };
        processError(this);
        return fieldErrors;
      }
      static assert(value) {
        if (!(value instanceof _ZodError)) {
          throw new Error(`Not a ZodError: ${value}`);
        }
      }
      toString() {
        return this.message;
      }
      get message() {
        return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
      }
      get isEmpty() {
        return this.issues.length === 0;
      }
      flatten(mapper = (issue) => issue.message) {
        const fieldErrors = {};
        const formErrors = [];
        for (const sub of this.issues) {
          if (sub.path.length > 0) {
            const firstEl = sub.path[0];
            fieldErrors[firstEl] = fieldErrors[firstEl] || [];
            fieldErrors[firstEl].push(mapper(sub));
          } else {
            formErrors.push(mapper(sub));
          }
        }
        return { formErrors, fieldErrors };
      }
      get formErrors() {
        return this.flatten();
      }
    };
    ZodError.create = (issues) => {
      const error = new ZodError(issues);
      return error;
    };
  }
});

// node_modules/zod/v3/locales/en.js
var errorMap, en_default;
var init_en = __esm({
  "node_modules/zod/v3/locales/en.js"() {
    init_ZodError();
    init_util();
    errorMap = (issue, _ctx) => {
      let message;
      switch (issue.code) {
        case ZodIssueCode.invalid_type:
          if (issue.received === ZodParsedType.undefined) {
            message = "Required";
          } else {
            message = `Expected ${issue.expected}, received ${issue.received}`;
          }
          break;
        case ZodIssueCode.invalid_literal:
          message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
          break;
        case ZodIssueCode.unrecognized_keys:
          message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
          break;
        case ZodIssueCode.invalid_union:
          message = `Invalid input`;
          break;
        case ZodIssueCode.invalid_union_discriminator:
          message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
          break;
        case ZodIssueCode.invalid_enum_value:
          message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
          break;
        case ZodIssueCode.invalid_arguments:
          message = `Invalid function arguments`;
          break;
        case ZodIssueCode.invalid_return_type:
          message = `Invalid function return type`;
          break;
        case ZodIssueCode.invalid_date:
          message = `Invalid date`;
          break;
        case ZodIssueCode.invalid_string:
          if (typeof issue.validation === "object") {
            if ("includes" in issue.validation) {
              message = `Invalid input: must include "${issue.validation.includes}"`;
              if (typeof issue.validation.position === "number") {
                message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
              }
            } else if ("startsWith" in issue.validation) {
              message = `Invalid input: must start with "${issue.validation.startsWith}"`;
            } else if ("endsWith" in issue.validation) {
              message = `Invalid input: must end with "${issue.validation.endsWith}"`;
            } else {
              util.assertNever(issue.validation);
            }
          } else if (issue.validation !== "regex") {
            message = `Invalid ${issue.validation}`;
          } else {
            message = "Invalid";
          }
          break;
        case ZodIssueCode.too_small:
          if (issue.type === "array")
            message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
          else if (issue.type === "string")
            message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
          else if (issue.type === "number")
            message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
          else if (issue.type === "bigint")
            message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
          else if (issue.type === "date")
            message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
          else
            message = "Invalid input";
          break;
        case ZodIssueCode.too_big:
          if (issue.type === "array")
            message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
          else if (issue.type === "string")
            message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
          else if (issue.type === "number")
            message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
          else if (issue.type === "bigint")
            message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
          else if (issue.type === "date")
            message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
          else
            message = "Invalid input";
          break;
        case ZodIssueCode.custom:
          message = `Invalid input`;
          break;
        case ZodIssueCode.invalid_intersection_types:
          message = `Intersection results could not be merged`;
          break;
        case ZodIssueCode.not_multiple_of:
          message = `Number must be a multiple of ${issue.multipleOf}`;
          break;
        case ZodIssueCode.not_finite:
          message = "Number must be finite";
          break;
        default:
          message = _ctx.defaultError;
          util.assertNever(issue);
      }
      return { message };
    };
    en_default = errorMap;
  }
});

// node_modules/zod/v3/errors.js
function setErrorMap(map) {
  overrideErrorMap = map;
}
function getErrorMap() {
  return overrideErrorMap;
}
var overrideErrorMap;
var init_errors = __esm({
  "node_modules/zod/v3/errors.js"() {
    init_en();
    overrideErrorMap = en_default;
  }
});

// node_modules/zod/v3/helpers/parseUtil.js
function addIssueToContext(ctx, issueData) {
  const overrideMap = getErrorMap();
  const issue = makeIssue({
    issueData,
    data: ctx.data,
    path: ctx.path,
    errorMaps: [
      ctx.common.contextualErrorMap,
      // contextual error map is first priority
      ctx.schemaErrorMap,
      // then schema-bound map if available
      overrideMap,
      // then global override map
      overrideMap === en_default ? void 0 : en_default
      // then global default map
    ].filter((x) => !!x)
  });
  ctx.common.issues.push(issue);
}
var makeIssue, EMPTY_PATH, ParseStatus, INVALID, DIRTY, OK, isAborted, isDirty, isValid, isAsync;
var init_parseUtil = __esm({
  "node_modules/zod/v3/helpers/parseUtil.js"() {
    init_errors();
    init_en();
    makeIssue = (params) => {
      const { data, path: path6, errorMaps, issueData } = params;
      const fullPath = [...path6, ...issueData.path || []];
      const fullIssue = {
        ...issueData,
        path: fullPath
      };
      if (issueData.message !== void 0) {
        return {
          ...issueData,
          path: fullPath,
          message: issueData.message
        };
      }
      let errorMessage = "";
      const maps = errorMaps.filter((m) => !!m).slice().reverse();
      for (const map of maps) {
        errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
      }
      return {
        ...issueData,
        path: fullPath,
        message: errorMessage
      };
    };
    EMPTY_PATH = [];
    ParseStatus = class _ParseStatus {
      constructor() {
        this.value = "valid";
      }
      dirty() {
        if (this.value === "valid")
          this.value = "dirty";
      }
      abort() {
        if (this.value !== "aborted")
          this.value = "aborted";
      }
      static mergeArray(status, results) {
        const arrayValue = [];
        for (const s of results) {
          if (s.status === "aborted")
            return INVALID;
          if (s.status === "dirty")
            status.dirty();
          arrayValue.push(s.value);
        }
        return { status: status.value, value: arrayValue };
      }
      static async mergeObjectAsync(status, pairs) {
        const syncPairs = [];
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          syncPairs.push({
            key,
            value
          });
        }
        return _ParseStatus.mergeObjectSync(status, syncPairs);
      }
      static mergeObjectSync(status, pairs) {
        const finalObject = {};
        for (const pair of pairs) {
          const { key, value } = pair;
          if (key.status === "aborted")
            return INVALID;
          if (value.status === "aborted")
            return INVALID;
          if (key.status === "dirty")
            status.dirty();
          if (value.status === "dirty")
            status.dirty();
          if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
            finalObject[key.value] = value.value;
          }
        }
        return { status: status.value, value: finalObject };
      }
    };
    INVALID = Object.freeze({
      status: "aborted"
    });
    DIRTY = (value) => ({ status: "dirty", value });
    OK = (value) => ({ status: "valid", value });
    isAborted = (x) => x.status === "aborted";
    isDirty = (x) => x.status === "dirty";
    isValid = (x) => x.status === "valid";
    isAsync = (x) => typeof Promise !== "undefined" && x instanceof Promise;
  }
});

// node_modules/zod/v3/helpers/typeAliases.js
var init_typeAliases = __esm({
  "node_modules/zod/v3/helpers/typeAliases.js"() {
  }
});

// node_modules/zod/v3/helpers/errorUtil.js
var errorUtil;
var init_errorUtil = __esm({
  "node_modules/zod/v3/helpers/errorUtil.js"() {
    (function(errorUtil2) {
      errorUtil2.errToObj = (message) => typeof message === "string" ? { message } : message || {};
      errorUtil2.toString = (message) => typeof message === "string" ? message : message?.message;
    })(errorUtil || (errorUtil = {}));
  }
});

// node_modules/zod/v3/types.js
function processCreateParams(params) {
  if (!params)
    return {};
  const { errorMap: errorMap2, invalid_type_error, required_error, description } = params;
  if (errorMap2 && (invalid_type_error || required_error)) {
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  }
  if (errorMap2)
    return { errorMap: errorMap2, description };
  const customMap = (iss, ctx) => {
    const { message } = params;
    if (iss.code === "invalid_enum_value") {
      return { message: message ?? ctx.defaultError };
    }
    if (typeof ctx.data === "undefined") {
      return { message: message ?? required_error ?? ctx.defaultError };
    }
    if (iss.code !== "invalid_type")
      return { message: ctx.defaultError };
    return { message: message ?? invalid_type_error ?? ctx.defaultError };
  };
  return { errorMap: customMap, description };
}
function timeRegexSource(args) {
  let secondsRegexSource = `[0-5]\\d`;
  if (args.precision) {
    secondsRegexSource = `${secondsRegexSource}\\.\\d{${args.precision}}`;
  } else if (args.precision == null) {
    secondsRegexSource = `${secondsRegexSource}(\\.\\d+)?`;
  }
  const secondsQuantifier = args.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${secondsRegexSource})${secondsQuantifier}`;
}
function timeRegex(args) {
  return new RegExp(`^${timeRegexSource(args)}$`);
}
function datetimeRegex(args) {
  let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
  const opts = [];
  opts.push(args.local ? `Z?` : `Z`);
  if (args.offset)
    opts.push(`([+-]\\d{2}:?\\d{2})`);
  regex = `${regex}(${opts.join("|")})`;
  return new RegExp(`^${regex}$`);
}
function isValidIP(ip, version) {
  if ((version === "v4" || !version) && ipv4Regex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6Regex.test(ip)) {
    return true;
  }
  return false;
}
function isValidJWT(jwt, alg) {
  if (!jwtRegex.test(jwt))
    return false;
  try {
    const [header] = jwt.split(".");
    if (!header)
      return false;
    const base64 = header.replace(/-/g, "+").replace(/_/g, "/").padEnd(header.length + (4 - header.length % 4) % 4, "=");
    const decoded = JSON.parse(atob(base64));
    if (typeof decoded !== "object" || decoded === null)
      return false;
    if ("typ" in decoded && decoded?.typ !== "JWT")
      return false;
    if (!decoded.alg)
      return false;
    if (alg && decoded.alg !== alg)
      return false;
    return true;
  } catch {
    return false;
  }
}
function isValidCidr(ip, version) {
  if ((version === "v4" || !version) && ipv4CidrRegex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6CidrRegex.test(ip)) {
    return true;
  }
  return false;
}
function floatSafeRemainder(val, step) {
  const valDecCount = (val.toString().split(".")[1] || "").length;
  const stepDecCount = (step.toString().split(".")[1] || "").length;
  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  const valInt = Number.parseInt(val.toFixed(decCount).replace(".", ""));
  const stepInt = Number.parseInt(step.toFixed(decCount).replace(".", ""));
  return valInt % stepInt / 10 ** decCount;
}
function deepPartialify(schema) {
  if (schema instanceof ZodObject) {
    const newShape = {};
    for (const key in schema.shape) {
      const fieldSchema = schema.shape[key];
      newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
    }
    return new ZodObject({
      ...schema._def,
      shape: () => newShape
    });
  } else if (schema instanceof ZodArray) {
    return new ZodArray({
      ...schema._def,
      type: deepPartialify(schema.element)
    });
  } else if (schema instanceof ZodOptional) {
    return ZodOptional.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodNullable) {
    return ZodNullable.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodTuple) {
    return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
  } else {
    return schema;
  }
}
function mergeValues(a, b) {
  const aType = getParsedType(a);
  const bType = getParsedType(b);
  if (a === b) {
    return { valid: true, data: a };
  } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
    const bKeys = util.objectKeys(b);
    const sharedKeys = util.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a, ...b };
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a[key], b[key]);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
    if (a.length !== b.length) {
      return { valid: false };
    }
    const newArray = [];
    for (let index = 0; index < a.length; index++) {
      const itemA = a[index];
      const itemB = b[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a === +b) {
    return { valid: true, data: a };
  } else {
    return { valid: false };
  }
}
function createZodEnum(values, params) {
  return new ZodEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodEnum,
    ...processCreateParams(params)
  });
}
function cleanParams(params, data) {
  const p = typeof params === "function" ? params(data) : typeof params === "string" ? { message: params } : params;
  const p2 = typeof p === "string" ? { message: p } : p;
  return p2;
}
function custom(check, _params = {}, fatal) {
  if (check)
    return ZodAny.create().superRefine((data, ctx) => {
      const r = check(data);
      if (r instanceof Promise) {
        return r.then((r2) => {
          if (!r2) {
            const params = cleanParams(_params, data);
            const _fatal = params.fatal ?? fatal ?? true;
            ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
          }
        });
      }
      if (!r) {
        const params = cleanParams(_params, data);
        const _fatal = params.fatal ?? fatal ?? true;
        ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
      }
      return;
    });
  return ZodAny.create();
}
var ParseInputLazyPath, handleResult, ZodType, cuidRegex, cuid2Regex, ulidRegex, uuidRegex, nanoidRegex, jwtRegex, durationRegex, emailRegex, _emojiRegex, emojiRegex, ipv4Regex, ipv4CidrRegex, ipv6Regex, ipv6CidrRegex, base64Regex, base64urlRegex, dateRegexSource, dateRegex, ZodString, ZodNumber, ZodBigInt, ZodBoolean, ZodDate, ZodSymbol, ZodUndefined, ZodNull, ZodAny, ZodUnknown, ZodNever, ZodVoid, ZodArray, ZodObject, ZodUnion, getDiscriminator, ZodDiscriminatedUnion, ZodIntersection, ZodTuple, ZodRecord, ZodMap, ZodSet, ZodFunction, ZodLazy, ZodLiteral, ZodEnum, ZodNativeEnum, ZodPromise, ZodEffects, ZodOptional, ZodNullable, ZodDefault, ZodCatch, ZodNaN, BRAND, ZodBranded, ZodPipeline, ZodReadonly, late, ZodFirstPartyTypeKind, instanceOfType, stringType, numberType, nanType, bigIntType, booleanType, dateType, symbolType, undefinedType, nullType, anyType, unknownType, neverType, voidType, arrayType, objectType, strictObjectType, unionType, discriminatedUnionType, intersectionType, tupleType, recordType, mapType, setType, functionType, lazyType, literalType, enumType, nativeEnumType, promiseType, effectsType, optionalType, nullableType, preprocessType, pipelineType, ostring, onumber, oboolean, coerce, NEVER;
var init_types = __esm({
  "node_modules/zod/v3/types.js"() {
    init_ZodError();
    init_errors();
    init_errorUtil();
    init_parseUtil();
    init_util();
    ParseInputLazyPath = class {
      constructor(parent, value, path6, key) {
        this._cachedPath = [];
        this.parent = parent;
        this.data = value;
        this._path = path6;
        this._key = key;
      }
      get path() {
        if (!this._cachedPath.length) {
          if (Array.isArray(this._key)) {
            this._cachedPath.push(...this._path, ...this._key);
          } else {
            this._cachedPath.push(...this._path, this._key);
          }
        }
        return this._cachedPath;
      }
    };
    handleResult = (ctx, result) => {
      if (isValid(result)) {
        return { success: true, data: result.value };
      } else {
        if (!ctx.common.issues.length) {
          throw new Error("Validation failed but no issues detected.");
        }
        return {
          success: false,
          get error() {
            if (this._error)
              return this._error;
            const error = new ZodError(ctx.common.issues);
            this._error = error;
            return this._error;
          }
        };
      }
    };
    ZodType = class {
      get description() {
        return this._def.description;
      }
      _getType(input) {
        return getParsedType(input.data);
      }
      _getOrReturnCtx(input, ctx) {
        return ctx || {
          common: input.parent.common,
          data: input.data,
          parsedType: getParsedType(input.data),
          schemaErrorMap: this._def.errorMap,
          path: input.path,
          parent: input.parent
        };
      }
      _processInputParams(input) {
        return {
          status: new ParseStatus(),
          ctx: {
            common: input.parent.common,
            data: input.data,
            parsedType: getParsedType(input.data),
            schemaErrorMap: this._def.errorMap,
            path: input.path,
            parent: input.parent
          }
        };
      }
      _parseSync(input) {
        const result = this._parse(input);
        if (isAsync(result)) {
          throw new Error("Synchronous parse encountered promise.");
        }
        return result;
      }
      _parseAsync(input) {
        const result = this._parse(input);
        return Promise.resolve(result);
      }
      parse(data, params) {
        const result = this.safeParse(data, params);
        if (result.success)
          return result.data;
        throw result.error;
      }
      safeParse(data, params) {
        const ctx = {
          common: {
            issues: [],
            async: params?.async ?? false,
            contextualErrorMap: params?.errorMap
          },
          path: params?.path || [],
          schemaErrorMap: this._def.errorMap,
          parent: null,
          data,
          parsedType: getParsedType(data)
        };
        const result = this._parseSync({ data, path: ctx.path, parent: ctx });
        return handleResult(ctx, result);
      }
      "~validate"(data) {
        const ctx = {
          common: {
            issues: [],
            async: !!this["~standard"].async
          },
          path: [],
          schemaErrorMap: this._def.errorMap,
          parent: null,
          data,
          parsedType: getParsedType(data)
        };
        if (!this["~standard"].async) {
          try {
            const result = this._parseSync({ data, path: [], parent: ctx });
            return isValid(result) ? {
              value: result.value
            } : {
              issues: ctx.common.issues
            };
          } catch (err) {
            if (err?.message?.toLowerCase()?.includes("encountered")) {
              this["~standard"].async = true;
            }
            ctx.common = {
              issues: [],
              async: true
            };
          }
        }
        return this._parseAsync({ data, path: [], parent: ctx }).then((result) => isValid(result) ? {
          value: result.value
        } : {
          issues: ctx.common.issues
        });
      }
      async parseAsync(data, params) {
        const result = await this.safeParseAsync(data, params);
        if (result.success)
          return result.data;
        throw result.error;
      }
      async safeParseAsync(data, params) {
        const ctx = {
          common: {
            issues: [],
            contextualErrorMap: params?.errorMap,
            async: true
          },
          path: params?.path || [],
          schemaErrorMap: this._def.errorMap,
          parent: null,
          data,
          parsedType: getParsedType(data)
        };
        const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
        const result = await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
        return handleResult(ctx, result);
      }
      refine(check, message) {
        const getIssueProperties = (val) => {
          if (typeof message === "string" || typeof message === "undefined") {
            return { message };
          } else if (typeof message === "function") {
            return message(val);
          } else {
            return message;
          }
        };
        return this._refinement((val, ctx) => {
          const result = check(val);
          const setError = () => ctx.addIssue({
            code: ZodIssueCode.custom,
            ...getIssueProperties(val)
          });
          if (typeof Promise !== "undefined" && result instanceof Promise) {
            return result.then((data) => {
              if (!data) {
                setError();
                return false;
              } else {
                return true;
              }
            });
          }
          if (!result) {
            setError();
            return false;
          } else {
            return true;
          }
        });
      }
      refinement(check, refinementData) {
        return this._refinement((val, ctx) => {
          if (!check(val)) {
            ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
            return false;
          } else {
            return true;
          }
        });
      }
      _refinement(refinement) {
        return new ZodEffects({
          schema: this,
          typeName: ZodFirstPartyTypeKind.ZodEffects,
          effect: { type: "refinement", refinement }
        });
      }
      superRefine(refinement) {
        return this._refinement(refinement);
      }
      constructor(def) {
        this.spa = this.safeParseAsync;
        this._def = def;
        this.parse = this.parse.bind(this);
        this.safeParse = this.safeParse.bind(this);
        this.parseAsync = this.parseAsync.bind(this);
        this.safeParseAsync = this.safeParseAsync.bind(this);
        this.spa = this.spa.bind(this);
        this.refine = this.refine.bind(this);
        this.refinement = this.refinement.bind(this);
        this.superRefine = this.superRefine.bind(this);
        this.optional = this.optional.bind(this);
        this.nullable = this.nullable.bind(this);
        this.nullish = this.nullish.bind(this);
        this.array = this.array.bind(this);
        this.promise = this.promise.bind(this);
        this.or = this.or.bind(this);
        this.and = this.and.bind(this);
        this.transform = this.transform.bind(this);
        this.brand = this.brand.bind(this);
        this.default = this.default.bind(this);
        this.catch = this.catch.bind(this);
        this.describe = this.describe.bind(this);
        this.pipe = this.pipe.bind(this);
        this.readonly = this.readonly.bind(this);
        this.isNullable = this.isNullable.bind(this);
        this.isOptional = this.isOptional.bind(this);
        this["~standard"] = {
          version: 1,
          vendor: "zod",
          validate: (data) => this["~validate"](data)
        };
      }
      optional() {
        return ZodOptional.create(this, this._def);
      }
      nullable() {
        return ZodNullable.create(this, this._def);
      }
      nullish() {
        return this.nullable().optional();
      }
      array() {
        return ZodArray.create(this);
      }
      promise() {
        return ZodPromise.create(this, this._def);
      }
      or(option) {
        return ZodUnion.create([this, option], this._def);
      }
      and(incoming) {
        return ZodIntersection.create(this, incoming, this._def);
      }
      transform(transform) {
        return new ZodEffects({
          ...processCreateParams(this._def),
          schema: this,
          typeName: ZodFirstPartyTypeKind.ZodEffects,
          effect: { type: "transform", transform }
        });
      }
      default(def) {
        const defaultValueFunc = typeof def === "function" ? def : () => def;
        return new ZodDefault({
          ...processCreateParams(this._def),
          innerType: this,
          defaultValue: defaultValueFunc,
          typeName: ZodFirstPartyTypeKind.ZodDefault
        });
      }
      brand() {
        return new ZodBranded({
          typeName: ZodFirstPartyTypeKind.ZodBranded,
          type: this,
          ...processCreateParams(this._def)
        });
      }
      catch(def) {
        const catchValueFunc = typeof def === "function" ? def : () => def;
        return new ZodCatch({
          ...processCreateParams(this._def),
          innerType: this,
          catchValue: catchValueFunc,
          typeName: ZodFirstPartyTypeKind.ZodCatch
        });
      }
      describe(description) {
        const This = this.constructor;
        return new This({
          ...this._def,
          description
        });
      }
      pipe(target) {
        return ZodPipeline.create(this, target);
      }
      readonly() {
        return ZodReadonly.create(this);
      }
      isOptional() {
        return this.safeParse(void 0).success;
      }
      isNullable() {
        return this.safeParse(null).success;
      }
    };
    cuidRegex = /^c[^\s-]{8,}$/i;
    cuid2Regex = /^[0-9a-z]+$/;
    ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
    uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
    nanoidRegex = /^[a-z0-9_-]{21}$/i;
    jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
    durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
    emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
    _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
    ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
    ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
    ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
    ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
    base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
    base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
    dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
    dateRegex = new RegExp(`^${dateRegexSource}$`);
    ZodString = class _ZodString extends ZodType {
      _parse(input) {
        if (this._def.coerce) {
          input.data = String(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.string) {
          const ctx2 = this._getOrReturnCtx(input);
          addIssueToContext(ctx2, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.string,
            received: ctx2.parsedType
          });
          return INVALID;
        }
        const status = new ParseStatus();
        let ctx = void 0;
        for (const check of this._def.checks) {
          if (check.kind === "min") {
            if (input.data.length < check.value) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_small,
                minimum: check.value,
                type: "string",
                inclusive: true,
                exact: false,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "max") {
            if (input.data.length > check.value) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_big,
                maximum: check.value,
                type: "string",
                inclusive: true,
                exact: false,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "length") {
            const tooBig = input.data.length > check.value;
            const tooSmall = input.data.length < check.value;
            if (tooBig || tooSmall) {
              ctx = this._getOrReturnCtx(input, ctx);
              if (tooBig) {
                addIssueToContext(ctx, {
                  code: ZodIssueCode.too_big,
                  maximum: check.value,
                  type: "string",
                  inclusive: true,
                  exact: true,
                  message: check.message
                });
              } else if (tooSmall) {
                addIssueToContext(ctx, {
                  code: ZodIssueCode.too_small,
                  minimum: check.value,
                  type: "string",
                  inclusive: true,
                  exact: true,
                  message: check.message
                });
              }
              status.dirty();
            }
          } else if (check.kind === "email") {
            if (!emailRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "email",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "emoji") {
            if (!emojiRegex) {
              emojiRegex = new RegExp(_emojiRegex, "u");
            }
            if (!emojiRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "emoji",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "uuid") {
            if (!uuidRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "uuid",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "nanoid") {
            if (!nanoidRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "nanoid",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "cuid") {
            if (!cuidRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "cuid",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "cuid2") {
            if (!cuid2Regex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "cuid2",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "ulid") {
            if (!ulidRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "ulid",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "url") {
            try {
              new URL(input.data);
            } catch {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "url",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "regex") {
            check.regex.lastIndex = 0;
            const testResult = check.regex.test(input.data);
            if (!testResult) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "regex",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "trim") {
            input.data = input.data.trim();
          } else if (check.kind === "includes") {
            if (!input.data.includes(check.value, check.position)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_string,
                validation: { includes: check.value, position: check.position },
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "toLowerCase") {
            input.data = input.data.toLowerCase();
          } else if (check.kind === "toUpperCase") {
            input.data = input.data.toUpperCase();
          } else if (check.kind === "startsWith") {
            if (!input.data.startsWith(check.value)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_string,
                validation: { startsWith: check.value },
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "endsWith") {
            if (!input.data.endsWith(check.value)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_string,
                validation: { endsWith: check.value },
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "datetime") {
            const regex = datetimeRegex(check);
            if (!regex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_string,
                validation: "datetime",
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "date") {
            const regex = dateRegex;
            if (!regex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_string,
                validation: "date",
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "time") {
            const regex = timeRegex(check);
            if (!regex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_string,
                validation: "time",
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "duration") {
            if (!durationRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "duration",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "ip") {
            if (!isValidIP(input.data, check.version)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "ip",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "jwt") {
            if (!isValidJWT(input.data, check.alg)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "jwt",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "cidr") {
            if (!isValidCidr(input.data, check.version)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "cidr",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "base64") {
            if (!base64Regex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "base64",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "base64url") {
            if (!base64urlRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "base64url",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else {
            util.assertNever(check);
          }
        }
        return { status: status.value, value: input.data };
      }
      _regex(regex, validation, message) {
        return this.refinement((data) => regex.test(data), {
          validation,
          code: ZodIssueCode.invalid_string,
          ...errorUtil.errToObj(message)
        });
      }
      _addCheck(check) {
        return new _ZodString({
          ...this._def,
          checks: [...this._def.checks, check]
        });
      }
      email(message) {
        return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
      }
      url(message) {
        return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
      }
      emoji(message) {
        return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) });
      }
      uuid(message) {
        return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
      }
      nanoid(message) {
        return this._addCheck({ kind: "nanoid", ...errorUtil.errToObj(message) });
      }
      cuid(message) {
        return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
      }
      cuid2(message) {
        return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
      }
      ulid(message) {
        return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) });
      }
      base64(message) {
        return this._addCheck({ kind: "base64", ...errorUtil.errToObj(message) });
      }
      base64url(message) {
        return this._addCheck({
          kind: "base64url",
          ...errorUtil.errToObj(message)
        });
      }
      jwt(options2) {
        return this._addCheck({ kind: "jwt", ...errorUtil.errToObj(options2) });
      }
      ip(options2) {
        return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options2) });
      }
      cidr(options2) {
        return this._addCheck({ kind: "cidr", ...errorUtil.errToObj(options2) });
      }
      datetime(options2) {
        if (typeof options2 === "string") {
          return this._addCheck({
            kind: "datetime",
            precision: null,
            offset: false,
            local: false,
            message: options2
          });
        }
        return this._addCheck({
          kind: "datetime",
          precision: typeof options2?.precision === "undefined" ? null : options2?.precision,
          offset: options2?.offset ?? false,
          local: options2?.local ?? false,
          ...errorUtil.errToObj(options2?.message)
        });
      }
      date(message) {
        return this._addCheck({ kind: "date", message });
      }
      time(options2) {
        if (typeof options2 === "string") {
          return this._addCheck({
            kind: "time",
            precision: null,
            message: options2
          });
        }
        return this._addCheck({
          kind: "time",
          precision: typeof options2?.precision === "undefined" ? null : options2?.precision,
          ...errorUtil.errToObj(options2?.message)
        });
      }
      duration(message) {
        return this._addCheck({ kind: "duration", ...errorUtil.errToObj(message) });
      }
      regex(regex, message) {
        return this._addCheck({
          kind: "regex",
          regex,
          ...errorUtil.errToObj(message)
        });
      }
      includes(value, options2) {
        return this._addCheck({
          kind: "includes",
          value,
          position: options2?.position,
          ...errorUtil.errToObj(options2?.message)
        });
      }
      startsWith(value, message) {
        return this._addCheck({
          kind: "startsWith",
          value,
          ...errorUtil.errToObj(message)
        });
      }
      endsWith(value, message) {
        return this._addCheck({
          kind: "endsWith",
          value,
          ...errorUtil.errToObj(message)
        });
      }
      min(minLength, message) {
        return this._addCheck({
          kind: "min",
          value: minLength,
          ...errorUtil.errToObj(message)
        });
      }
      max(maxLength, message) {
        return this._addCheck({
          kind: "max",
          value: maxLength,
          ...errorUtil.errToObj(message)
        });
      }
      length(len, message) {
        return this._addCheck({
          kind: "length",
          value: len,
          ...errorUtil.errToObj(message)
        });
      }
      /**
       * Equivalent to `.min(1)`
       */
      nonempty(message) {
        return this.min(1, errorUtil.errToObj(message));
      }
      trim() {
        return new _ZodString({
          ...this._def,
          checks: [...this._def.checks, { kind: "trim" }]
        });
      }
      toLowerCase() {
        return new _ZodString({
          ...this._def,
          checks: [...this._def.checks, { kind: "toLowerCase" }]
        });
      }
      toUpperCase() {
        return new _ZodString({
          ...this._def,
          checks: [...this._def.checks, { kind: "toUpperCase" }]
        });
      }
      get isDatetime() {
        return !!this._def.checks.find((ch) => ch.kind === "datetime");
      }
      get isDate() {
        return !!this._def.checks.find((ch) => ch.kind === "date");
      }
      get isTime() {
        return !!this._def.checks.find((ch) => ch.kind === "time");
      }
      get isDuration() {
        return !!this._def.checks.find((ch) => ch.kind === "duration");
      }
      get isEmail() {
        return !!this._def.checks.find((ch) => ch.kind === "email");
      }
      get isURL() {
        return !!this._def.checks.find((ch) => ch.kind === "url");
      }
      get isEmoji() {
        return !!this._def.checks.find((ch) => ch.kind === "emoji");
      }
      get isUUID() {
        return !!this._def.checks.find((ch) => ch.kind === "uuid");
      }
      get isNANOID() {
        return !!this._def.checks.find((ch) => ch.kind === "nanoid");
      }
      get isCUID() {
        return !!this._def.checks.find((ch) => ch.kind === "cuid");
      }
      get isCUID2() {
        return !!this._def.checks.find((ch) => ch.kind === "cuid2");
      }
      get isULID() {
        return !!this._def.checks.find((ch) => ch.kind === "ulid");
      }
      get isIP() {
        return !!this._def.checks.find((ch) => ch.kind === "ip");
      }
      get isCIDR() {
        return !!this._def.checks.find((ch) => ch.kind === "cidr");
      }
      get isBase64() {
        return !!this._def.checks.find((ch) => ch.kind === "base64");
      }
      get isBase64url() {
        return !!this._def.checks.find((ch) => ch.kind === "base64url");
      }
      get minLength() {
        let min = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "min") {
            if (min === null || ch.value > min)
              min = ch.value;
          }
        }
        return min;
      }
      get maxLength() {
        let max = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "max") {
            if (max === null || ch.value < max)
              max = ch.value;
          }
        }
        return max;
      }
    };
    ZodString.create = (params) => {
      return new ZodString({
        checks: [],
        typeName: ZodFirstPartyTypeKind.ZodString,
        coerce: params?.coerce ?? false,
        ...processCreateParams(params)
      });
    };
    ZodNumber = class _ZodNumber extends ZodType {
      constructor() {
        super(...arguments);
        this.min = this.gte;
        this.max = this.lte;
        this.step = this.multipleOf;
      }
      _parse(input) {
        if (this._def.coerce) {
          input.data = Number(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.number) {
          const ctx2 = this._getOrReturnCtx(input);
          addIssueToContext(ctx2, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.number,
            received: ctx2.parsedType
          });
          return INVALID;
        }
        let ctx = void 0;
        const status = new ParseStatus();
        for (const check of this._def.checks) {
          if (check.kind === "int") {
            if (!util.isInteger(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: "integer",
                received: "float",
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "min") {
            const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
            if (tooSmall) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_small,
                minimum: check.value,
                type: "number",
                inclusive: check.inclusive,
                exact: false,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "max") {
            const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
            if (tooBig) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_big,
                maximum: check.value,
                type: "number",
                inclusive: check.inclusive,
                exact: false,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "multipleOf") {
            if (floatSafeRemainder(input.data, check.value) !== 0) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.not_multiple_of,
                multipleOf: check.value,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "finite") {
            if (!Number.isFinite(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.not_finite,
                message: check.message
              });
              status.dirty();
            }
          } else {
            util.assertNever(check);
          }
        }
        return { status: status.value, value: input.data };
      }
      gte(value, message) {
        return this.setLimit("min", value, true, errorUtil.toString(message));
      }
      gt(value, message) {
        return this.setLimit("min", value, false, errorUtil.toString(message));
      }
      lte(value, message) {
        return this.setLimit("max", value, true, errorUtil.toString(message));
      }
      lt(value, message) {
        return this.setLimit("max", value, false, errorUtil.toString(message));
      }
      setLimit(kind, value, inclusive, message) {
        return new _ZodNumber({
          ...this._def,
          checks: [
            ...this._def.checks,
            {
              kind,
              value,
              inclusive,
              message: errorUtil.toString(message)
            }
          ]
        });
      }
      _addCheck(check) {
        return new _ZodNumber({
          ...this._def,
          checks: [...this._def.checks, check]
        });
      }
      int(message) {
        return this._addCheck({
          kind: "int",
          message: errorUtil.toString(message)
        });
      }
      positive(message) {
        return this._addCheck({
          kind: "min",
          value: 0,
          inclusive: false,
          message: errorUtil.toString(message)
        });
      }
      negative(message) {
        return this._addCheck({
          kind: "max",
          value: 0,
          inclusive: false,
          message: errorUtil.toString(message)
        });
      }
      nonpositive(message) {
        return this._addCheck({
          kind: "max",
          value: 0,
          inclusive: true,
          message: errorUtil.toString(message)
        });
      }
      nonnegative(message) {
        return this._addCheck({
          kind: "min",
          value: 0,
          inclusive: true,
          message: errorUtil.toString(message)
        });
      }
      multipleOf(value, message) {
        return this._addCheck({
          kind: "multipleOf",
          value,
          message: errorUtil.toString(message)
        });
      }
      finite(message) {
        return this._addCheck({
          kind: "finite",
          message: errorUtil.toString(message)
        });
      }
      safe(message) {
        return this._addCheck({
          kind: "min",
          inclusive: true,
          value: Number.MIN_SAFE_INTEGER,
          message: errorUtil.toString(message)
        })._addCheck({
          kind: "max",
          inclusive: true,
          value: Number.MAX_SAFE_INTEGER,
          message: errorUtil.toString(message)
        });
      }
      get minValue() {
        let min = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "min") {
            if (min === null || ch.value > min)
              min = ch.value;
          }
        }
        return min;
      }
      get maxValue() {
        let max = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "max") {
            if (max === null || ch.value < max)
              max = ch.value;
          }
        }
        return max;
      }
      get isInt() {
        return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util.isInteger(ch.value));
      }
      get isFinite() {
        let max = null;
        let min = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
            return true;
          } else if (ch.kind === "min") {
            if (min === null || ch.value > min)
              min = ch.value;
          } else if (ch.kind === "max") {
            if (max === null || ch.value < max)
              max = ch.value;
          }
        }
        return Number.isFinite(min) && Number.isFinite(max);
      }
    };
    ZodNumber.create = (params) => {
      return new ZodNumber({
        checks: [],
        typeName: ZodFirstPartyTypeKind.ZodNumber,
        coerce: params?.coerce || false,
        ...processCreateParams(params)
      });
    };
    ZodBigInt = class _ZodBigInt extends ZodType {
      constructor() {
        super(...arguments);
        this.min = this.gte;
        this.max = this.lte;
      }
      _parse(input) {
        if (this._def.coerce) {
          try {
            input.data = BigInt(input.data);
          } catch {
            return this._getInvalidInput(input);
          }
        }
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.bigint) {
          return this._getInvalidInput(input);
        }
        let ctx = void 0;
        const status = new ParseStatus();
        for (const check of this._def.checks) {
          if (check.kind === "min") {
            const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
            if (tooSmall) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_small,
                type: "bigint",
                minimum: check.value,
                inclusive: check.inclusive,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "max") {
            const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
            if (tooBig) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_big,
                type: "bigint",
                maximum: check.value,
                inclusive: check.inclusive,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "multipleOf") {
            if (input.data % check.value !== BigInt(0)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.not_multiple_of,
                multipleOf: check.value,
                message: check.message
              });
              status.dirty();
            }
          } else {
            util.assertNever(check);
          }
        }
        return { status: status.value, value: input.data };
      }
      _getInvalidInput(input) {
        const ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.bigint,
          received: ctx.parsedType
        });
        return INVALID;
      }
      gte(value, message) {
        return this.setLimit("min", value, true, errorUtil.toString(message));
      }
      gt(value, message) {
        return this.setLimit("min", value, false, errorUtil.toString(message));
      }
      lte(value, message) {
        return this.setLimit("max", value, true, errorUtil.toString(message));
      }
      lt(value, message) {
        return this.setLimit("max", value, false, errorUtil.toString(message));
      }
      setLimit(kind, value, inclusive, message) {
        return new _ZodBigInt({
          ...this._def,
          checks: [
            ...this._def.checks,
            {
              kind,
              value,
              inclusive,
              message: errorUtil.toString(message)
            }
          ]
        });
      }
      _addCheck(check) {
        return new _ZodBigInt({
          ...this._def,
          checks: [...this._def.checks, check]
        });
      }
      positive(message) {
        return this._addCheck({
          kind: "min",
          value: BigInt(0),
          inclusive: false,
          message: errorUtil.toString(message)
        });
      }
      negative(message) {
        return this._addCheck({
          kind: "max",
          value: BigInt(0),
          inclusive: false,
          message: errorUtil.toString(message)
        });
      }
      nonpositive(message) {
        return this._addCheck({
          kind: "max",
          value: BigInt(0),
          inclusive: true,
          message: errorUtil.toString(message)
        });
      }
      nonnegative(message) {
        return this._addCheck({
          kind: "min",
          value: BigInt(0),
          inclusive: true,
          message: errorUtil.toString(message)
        });
      }
      multipleOf(value, message) {
        return this._addCheck({
          kind: "multipleOf",
          value,
          message: errorUtil.toString(message)
        });
      }
      get minValue() {
        let min = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "min") {
            if (min === null || ch.value > min)
              min = ch.value;
          }
        }
        return min;
      }
      get maxValue() {
        let max = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "max") {
            if (max === null || ch.value < max)
              max = ch.value;
          }
        }
        return max;
      }
    };
    ZodBigInt.create = (params) => {
      return new ZodBigInt({
        checks: [],
        typeName: ZodFirstPartyTypeKind.ZodBigInt,
        coerce: params?.coerce ?? false,
        ...processCreateParams(params)
      });
    };
    ZodBoolean = class extends ZodType {
      _parse(input) {
        if (this._def.coerce) {
          input.data = Boolean(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.boolean) {
          const ctx = this._getOrReturnCtx(input);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.boolean,
            received: ctx.parsedType
          });
          return INVALID;
        }
        return OK(input.data);
      }
    };
    ZodBoolean.create = (params) => {
      return new ZodBoolean({
        typeName: ZodFirstPartyTypeKind.ZodBoolean,
        coerce: params?.coerce || false,
        ...processCreateParams(params)
      });
    };
    ZodDate = class _ZodDate extends ZodType {
      _parse(input) {
        if (this._def.coerce) {
          input.data = new Date(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.date) {
          const ctx2 = this._getOrReturnCtx(input);
          addIssueToContext(ctx2, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.date,
            received: ctx2.parsedType
          });
          return INVALID;
        }
        if (Number.isNaN(input.data.getTime())) {
          const ctx2 = this._getOrReturnCtx(input);
          addIssueToContext(ctx2, {
            code: ZodIssueCode.invalid_date
          });
          return INVALID;
        }
        const status = new ParseStatus();
        let ctx = void 0;
        for (const check of this._def.checks) {
          if (check.kind === "min") {
            if (input.data.getTime() < check.value) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_small,
                message: check.message,
                inclusive: true,
                exact: false,
                minimum: check.value,
                type: "date"
              });
              status.dirty();
            }
          } else if (check.kind === "max") {
            if (input.data.getTime() > check.value) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_big,
                message: check.message,
                inclusive: true,
                exact: false,
                maximum: check.value,
                type: "date"
              });
              status.dirty();
            }
          } else {
            util.assertNever(check);
          }
        }
        return {
          status: status.value,
          value: new Date(input.data.getTime())
        };
      }
      _addCheck(check) {
        return new _ZodDate({
          ...this._def,
          checks: [...this._def.checks, check]
        });
      }
      min(minDate, message) {
        return this._addCheck({
          kind: "min",
          value: minDate.getTime(),
          message: errorUtil.toString(message)
        });
      }
      max(maxDate, message) {
        return this._addCheck({
          kind: "max",
          value: maxDate.getTime(),
          message: errorUtil.toString(message)
        });
      }
      get minDate() {
        let min = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "min") {
            if (min === null || ch.value > min)
              min = ch.value;
          }
        }
        return min != null ? new Date(min) : null;
      }
      get maxDate() {
        let max = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "max") {
            if (max === null || ch.value < max)
              max = ch.value;
          }
        }
        return max != null ? new Date(max) : null;
      }
    };
    ZodDate.create = (params) => {
      return new ZodDate({
        checks: [],
        coerce: params?.coerce || false,
        typeName: ZodFirstPartyTypeKind.ZodDate,
        ...processCreateParams(params)
      });
    };
    ZodSymbol = class extends ZodType {
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.symbol) {
          const ctx = this._getOrReturnCtx(input);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.symbol,
            received: ctx.parsedType
          });
          return INVALID;
        }
        return OK(input.data);
      }
    };
    ZodSymbol.create = (params) => {
      return new ZodSymbol({
        typeName: ZodFirstPartyTypeKind.ZodSymbol,
        ...processCreateParams(params)
      });
    };
    ZodUndefined = class extends ZodType {
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.undefined) {
          const ctx = this._getOrReturnCtx(input);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.undefined,
            received: ctx.parsedType
          });
          return INVALID;
        }
        return OK(input.data);
      }
    };
    ZodUndefined.create = (params) => {
      return new ZodUndefined({
        typeName: ZodFirstPartyTypeKind.ZodUndefined,
        ...processCreateParams(params)
      });
    };
    ZodNull = class extends ZodType {
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.null) {
          const ctx = this._getOrReturnCtx(input);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.null,
            received: ctx.parsedType
          });
          return INVALID;
        }
        return OK(input.data);
      }
    };
    ZodNull.create = (params) => {
      return new ZodNull({
        typeName: ZodFirstPartyTypeKind.ZodNull,
        ...processCreateParams(params)
      });
    };
    ZodAny = class extends ZodType {
      constructor() {
        super(...arguments);
        this._any = true;
      }
      _parse(input) {
        return OK(input.data);
      }
    };
    ZodAny.create = (params) => {
      return new ZodAny({
        typeName: ZodFirstPartyTypeKind.ZodAny,
        ...processCreateParams(params)
      });
    };
    ZodUnknown = class extends ZodType {
      constructor() {
        super(...arguments);
        this._unknown = true;
      }
      _parse(input) {
        return OK(input.data);
      }
    };
    ZodUnknown.create = (params) => {
      return new ZodUnknown({
        typeName: ZodFirstPartyTypeKind.ZodUnknown,
        ...processCreateParams(params)
      });
    };
    ZodNever = class extends ZodType {
      _parse(input) {
        const ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.never,
          received: ctx.parsedType
        });
        return INVALID;
      }
    };
    ZodNever.create = (params) => {
      return new ZodNever({
        typeName: ZodFirstPartyTypeKind.ZodNever,
        ...processCreateParams(params)
      });
    };
    ZodVoid = class extends ZodType {
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.undefined) {
          const ctx = this._getOrReturnCtx(input);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.void,
            received: ctx.parsedType
          });
          return INVALID;
        }
        return OK(input.data);
      }
    };
    ZodVoid.create = (params) => {
      return new ZodVoid({
        typeName: ZodFirstPartyTypeKind.ZodVoid,
        ...processCreateParams(params)
      });
    };
    ZodArray = class _ZodArray extends ZodType {
      _parse(input) {
        const { ctx, status } = this._processInputParams(input);
        const def = this._def;
        if (ctx.parsedType !== ZodParsedType.array) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.array,
            received: ctx.parsedType
          });
          return INVALID;
        }
        if (def.exactLength !== null) {
          const tooBig = ctx.data.length > def.exactLength.value;
          const tooSmall = ctx.data.length < def.exactLength.value;
          if (tooBig || tooSmall) {
            addIssueToContext(ctx, {
              code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
              minimum: tooSmall ? def.exactLength.value : void 0,
              maximum: tooBig ? def.exactLength.value : void 0,
              type: "array",
              inclusive: true,
              exact: true,
              message: def.exactLength.message
            });
            status.dirty();
          }
        }
        if (def.minLength !== null) {
          if (ctx.data.length < def.minLength.value) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: def.minLength.value,
              type: "array",
              inclusive: true,
              exact: false,
              message: def.minLength.message
            });
            status.dirty();
          }
        }
        if (def.maxLength !== null) {
          if (ctx.data.length > def.maxLength.value) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: def.maxLength.value,
              type: "array",
              inclusive: true,
              exact: false,
              message: def.maxLength.message
            });
            status.dirty();
          }
        }
        if (ctx.common.async) {
          return Promise.all([...ctx.data].map((item, i) => {
            return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
          })).then((result2) => {
            return ParseStatus.mergeArray(status, result2);
          });
        }
        const result = [...ctx.data].map((item, i) => {
          return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
        });
        return ParseStatus.mergeArray(status, result);
      }
      get element() {
        return this._def.type;
      }
      min(minLength, message) {
        return new _ZodArray({
          ...this._def,
          minLength: { value: minLength, message: errorUtil.toString(message) }
        });
      }
      max(maxLength, message) {
        return new _ZodArray({
          ...this._def,
          maxLength: { value: maxLength, message: errorUtil.toString(message) }
        });
      }
      length(len, message) {
        return new _ZodArray({
          ...this._def,
          exactLength: { value: len, message: errorUtil.toString(message) }
        });
      }
      nonempty(message) {
        return this.min(1, message);
      }
    };
    ZodArray.create = (schema, params) => {
      return new ZodArray({
        type: schema,
        minLength: null,
        maxLength: null,
        exactLength: null,
        typeName: ZodFirstPartyTypeKind.ZodArray,
        ...processCreateParams(params)
      });
    };
    ZodObject = class _ZodObject extends ZodType {
      constructor() {
        super(...arguments);
        this._cached = null;
        this.nonstrict = this.passthrough;
        this.augment = this.extend;
      }
      _getCached() {
        if (this._cached !== null)
          return this._cached;
        const shape = this._def.shape();
        const keys = util.objectKeys(shape);
        this._cached = { shape, keys };
        return this._cached;
      }
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.object) {
          const ctx2 = this._getOrReturnCtx(input);
          addIssueToContext(ctx2, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.object,
            received: ctx2.parsedType
          });
          return INVALID;
        }
        const { status, ctx } = this._processInputParams(input);
        const { shape, keys: shapeKeys } = this._getCached();
        const extraKeys = [];
        if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
          for (const key in ctx.data) {
            if (!shapeKeys.includes(key)) {
              extraKeys.push(key);
            }
          }
        }
        const pairs = [];
        for (const key of shapeKeys) {
          const keyValidator = shape[key];
          const value = ctx.data[key];
          pairs.push({
            key: { status: "valid", value: key },
            value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
            alwaysSet: key in ctx.data
          });
        }
        if (this._def.catchall instanceof ZodNever) {
          const unknownKeys = this._def.unknownKeys;
          if (unknownKeys === "passthrough") {
            for (const key of extraKeys) {
              pairs.push({
                key: { status: "valid", value: key },
                value: { status: "valid", value: ctx.data[key] }
              });
            }
          } else if (unknownKeys === "strict") {
            if (extraKeys.length > 0) {
              addIssueToContext(ctx, {
                code: ZodIssueCode.unrecognized_keys,
                keys: extraKeys
              });
              status.dirty();
            }
          } else if (unknownKeys === "strip") {
          } else {
            throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
          }
        } else {
          const catchall = this._def.catchall;
          for (const key of extraKeys) {
            const value = ctx.data[key];
            pairs.push({
              key: { status: "valid", value: key },
              value: catchall._parse(
                new ParseInputLazyPath(ctx, value, ctx.path, key)
                //, ctx.child(key), value, getParsedType(value)
              ),
              alwaysSet: key in ctx.data
            });
          }
        }
        if (ctx.common.async) {
          return Promise.resolve().then(async () => {
            const syncPairs = [];
            for (const pair of pairs) {
              const key = await pair.key;
              const value = await pair.value;
              syncPairs.push({
                key,
                value,
                alwaysSet: pair.alwaysSet
              });
            }
            return syncPairs;
          }).then((syncPairs) => {
            return ParseStatus.mergeObjectSync(status, syncPairs);
          });
        } else {
          return ParseStatus.mergeObjectSync(status, pairs);
        }
      }
      get shape() {
        return this._def.shape();
      }
      strict(message) {
        errorUtil.errToObj;
        return new _ZodObject({
          ...this._def,
          unknownKeys: "strict",
          ...message !== void 0 ? {
            errorMap: (issue, ctx) => {
              const defaultError = this._def.errorMap?.(issue, ctx).message ?? ctx.defaultError;
              if (issue.code === "unrecognized_keys")
                return {
                  message: errorUtil.errToObj(message).message ?? defaultError
                };
              return {
                message: defaultError
              };
            }
          } : {}
        });
      }
      strip() {
        return new _ZodObject({
          ...this._def,
          unknownKeys: "strip"
        });
      }
      passthrough() {
        return new _ZodObject({
          ...this._def,
          unknownKeys: "passthrough"
        });
      }
      // const AugmentFactory =
      //   <Def extends ZodObjectDef>(def: Def) =>
      //   <Augmentation extends ZodRawShape>(
      //     augmentation: Augmentation
      //   ): ZodObject<
      //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
      //     Def["unknownKeys"],
      //     Def["catchall"]
      //   > => {
      //     return new ZodObject({
      //       ...def,
      //       shape: () => ({
      //         ...def.shape(),
      //         ...augmentation,
      //       }),
      //     }) as any;
      //   };
      extend(augmentation) {
        return new _ZodObject({
          ...this._def,
          shape: () => ({
            ...this._def.shape(),
            ...augmentation
          })
        });
      }
      /**
       * Prior to zod@1.0.12 there was a bug in the
       * inferred type of merged objects. Please
       * upgrade if you are experiencing issues.
       */
      merge(merging) {
        const merged = new _ZodObject({
          unknownKeys: merging._def.unknownKeys,
          catchall: merging._def.catchall,
          shape: () => ({
            ...this._def.shape(),
            ...merging._def.shape()
          }),
          typeName: ZodFirstPartyTypeKind.ZodObject
        });
        return merged;
      }
      // merge<
      //   Incoming extends AnyZodObject,
      //   Augmentation extends Incoming["shape"],
      //   NewOutput extends {
      //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
      //       ? Augmentation[k]["_output"]
      //       : k extends keyof Output
      //       ? Output[k]
      //       : never;
      //   },
      //   NewInput extends {
      //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
      //       ? Augmentation[k]["_input"]
      //       : k extends keyof Input
      //       ? Input[k]
      //       : never;
      //   }
      // >(
      //   merging: Incoming
      // ): ZodObject<
      //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
      //   Incoming["_def"]["unknownKeys"],
      //   Incoming["_def"]["catchall"],
      //   NewOutput,
      //   NewInput
      // > {
      //   const merged: any = new ZodObject({
      //     unknownKeys: merging._def.unknownKeys,
      //     catchall: merging._def.catchall,
      //     shape: () =>
      //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
      //     typeName: ZodFirstPartyTypeKind.ZodObject,
      //   }) as any;
      //   return merged;
      // }
      setKey(key, schema) {
        return this.augment({ [key]: schema });
      }
      // merge<Incoming extends AnyZodObject>(
      //   merging: Incoming
      // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
      // ZodObject<
      //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
      //   Incoming["_def"]["unknownKeys"],
      //   Incoming["_def"]["catchall"]
      // > {
      //   // const mergedShape = objectUtil.mergeShapes(
      //   //   this._def.shape(),
      //   //   merging._def.shape()
      //   // );
      //   const merged: any = new ZodObject({
      //     unknownKeys: merging._def.unknownKeys,
      //     catchall: merging._def.catchall,
      //     shape: () =>
      //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
      //     typeName: ZodFirstPartyTypeKind.ZodObject,
      //   }) as any;
      //   return merged;
      // }
      catchall(index) {
        return new _ZodObject({
          ...this._def,
          catchall: index
        });
      }
      pick(mask) {
        const shape = {};
        for (const key of util.objectKeys(mask)) {
          if (mask[key] && this.shape[key]) {
            shape[key] = this.shape[key];
          }
        }
        return new _ZodObject({
          ...this._def,
          shape: () => shape
        });
      }
      omit(mask) {
        const shape = {};
        for (const key of util.objectKeys(this.shape)) {
          if (!mask[key]) {
            shape[key] = this.shape[key];
          }
        }
        return new _ZodObject({
          ...this._def,
          shape: () => shape
        });
      }
      /**
       * @deprecated
       */
      deepPartial() {
        return deepPartialify(this);
      }
      partial(mask) {
        const newShape = {};
        for (const key of util.objectKeys(this.shape)) {
          const fieldSchema = this.shape[key];
          if (mask && !mask[key]) {
            newShape[key] = fieldSchema;
          } else {
            newShape[key] = fieldSchema.optional();
          }
        }
        return new _ZodObject({
          ...this._def,
          shape: () => newShape
        });
      }
      required(mask) {
        const newShape = {};
        for (const key of util.objectKeys(this.shape)) {
          if (mask && !mask[key]) {
            newShape[key] = this.shape[key];
          } else {
            const fieldSchema = this.shape[key];
            let newField = fieldSchema;
            while (newField instanceof ZodOptional) {
              newField = newField._def.innerType;
            }
            newShape[key] = newField;
          }
        }
        return new _ZodObject({
          ...this._def,
          shape: () => newShape
        });
      }
      keyof() {
        return createZodEnum(util.objectKeys(this.shape));
      }
    };
    ZodObject.create = (shape, params) => {
      return new ZodObject({
        shape: () => shape,
        unknownKeys: "strip",
        catchall: ZodNever.create(),
        typeName: ZodFirstPartyTypeKind.ZodObject,
        ...processCreateParams(params)
      });
    };
    ZodObject.strictCreate = (shape, params) => {
      return new ZodObject({
        shape: () => shape,
        unknownKeys: "strict",
        catchall: ZodNever.create(),
        typeName: ZodFirstPartyTypeKind.ZodObject,
        ...processCreateParams(params)
      });
    };
    ZodObject.lazycreate = (shape, params) => {
      return new ZodObject({
        shape,
        unknownKeys: "strip",
        catchall: ZodNever.create(),
        typeName: ZodFirstPartyTypeKind.ZodObject,
        ...processCreateParams(params)
      });
    };
    ZodUnion = class extends ZodType {
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        const options2 = this._def.options;
        function handleResults(results) {
          for (const result of results) {
            if (result.result.status === "valid") {
              return result.result;
            }
          }
          for (const result of results) {
            if (result.result.status === "dirty") {
              ctx.common.issues.push(...result.ctx.common.issues);
              return result.result;
            }
          }
          const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_union,
            unionErrors
          });
          return INVALID;
        }
        if (ctx.common.async) {
          return Promise.all(options2.map(async (option) => {
            const childCtx = {
              ...ctx,
              common: {
                ...ctx.common,
                issues: []
              },
              parent: null
            };
            return {
              result: await option._parseAsync({
                data: ctx.data,
                path: ctx.path,
                parent: childCtx
              }),
              ctx: childCtx
            };
          })).then(handleResults);
        } else {
          let dirty = void 0;
          const issues = [];
          for (const option of options2) {
            const childCtx = {
              ...ctx,
              common: {
                ...ctx.common,
                issues: []
              },
              parent: null
            };
            const result = option._parseSync({
              data: ctx.data,
              path: ctx.path,
              parent: childCtx
            });
            if (result.status === "valid") {
              return result;
            } else if (result.status === "dirty" && !dirty) {
              dirty = { result, ctx: childCtx };
            }
            if (childCtx.common.issues.length) {
              issues.push(childCtx.common.issues);
            }
          }
          if (dirty) {
            ctx.common.issues.push(...dirty.ctx.common.issues);
            return dirty.result;
          }
          const unionErrors = issues.map((issues2) => new ZodError(issues2));
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_union,
            unionErrors
          });
          return INVALID;
        }
      }
      get options() {
        return this._def.options;
      }
    };
    ZodUnion.create = (types, params) => {
      return new ZodUnion({
        options: types,
        typeName: ZodFirstPartyTypeKind.ZodUnion,
        ...processCreateParams(params)
      });
    };
    getDiscriminator = (type) => {
      if (type instanceof ZodLazy) {
        return getDiscriminator(type.schema);
      } else if (type instanceof ZodEffects) {
        return getDiscriminator(type.innerType());
      } else if (type instanceof ZodLiteral) {
        return [type.value];
      } else if (type instanceof ZodEnum) {
        return type.options;
      } else if (type instanceof ZodNativeEnum) {
        return util.objectValues(type.enum);
      } else if (type instanceof ZodDefault) {
        return getDiscriminator(type._def.innerType);
      } else if (type instanceof ZodUndefined) {
        return [void 0];
      } else if (type instanceof ZodNull) {
        return [null];
      } else if (type instanceof ZodOptional) {
        return [void 0, ...getDiscriminator(type.unwrap())];
      } else if (type instanceof ZodNullable) {
        return [null, ...getDiscriminator(type.unwrap())];
      } else if (type instanceof ZodBranded) {
        return getDiscriminator(type.unwrap());
      } else if (type instanceof ZodReadonly) {
        return getDiscriminator(type.unwrap());
      } else if (type instanceof ZodCatch) {
        return getDiscriminator(type._def.innerType);
      } else {
        return [];
      }
    };
    ZodDiscriminatedUnion = class _ZodDiscriminatedUnion extends ZodType {
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.object) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.object,
            received: ctx.parsedType
          });
          return INVALID;
        }
        const discriminator = this.discriminator;
        const discriminatorValue = ctx.data[discriminator];
        const option = this.optionsMap.get(discriminatorValue);
        if (!option) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_union_discriminator,
            options: Array.from(this.optionsMap.keys()),
            path: [discriminator]
          });
          return INVALID;
        }
        if (ctx.common.async) {
          return option._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          });
        } else {
          return option._parseSync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          });
        }
      }
      get discriminator() {
        return this._def.discriminator;
      }
      get options() {
        return this._def.options;
      }
      get optionsMap() {
        return this._def.optionsMap;
      }
      /**
       * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
       * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
       * have a different value for each object in the union.
       * @param discriminator the name of the discriminator property
       * @param types an array of object schemas
       * @param params
       */
      static create(discriminator, options2, params) {
        const optionsMap = /* @__PURE__ */ new Map();
        for (const type of options2) {
          const discriminatorValues = getDiscriminator(type.shape[discriminator]);
          if (!discriminatorValues.length) {
            throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
          }
          for (const value of discriminatorValues) {
            if (optionsMap.has(value)) {
              throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
            }
            optionsMap.set(value, type);
          }
        }
        return new _ZodDiscriminatedUnion({
          typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
          discriminator,
          options: options2,
          optionsMap,
          ...processCreateParams(params)
        });
      }
    };
    ZodIntersection = class extends ZodType {
      _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        const handleParsed = (parsedLeft, parsedRight) => {
          if (isAborted(parsedLeft) || isAborted(parsedRight)) {
            return INVALID;
          }
          const merged = mergeValues(parsedLeft.value, parsedRight.value);
          if (!merged.valid) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_intersection_types
            });
            return INVALID;
          }
          if (isDirty(parsedLeft) || isDirty(parsedRight)) {
            status.dirty();
          }
          return { status: status.value, value: merged.data };
        };
        if (ctx.common.async) {
          return Promise.all([
            this._def.left._parseAsync({
              data: ctx.data,
              path: ctx.path,
              parent: ctx
            }),
            this._def.right._parseAsync({
              data: ctx.data,
              path: ctx.path,
              parent: ctx
            })
          ]).then(([left, right]) => handleParsed(left, right));
        } else {
          return handleParsed(this._def.left._parseSync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          }), this._def.right._parseSync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          }));
        }
      }
    };
    ZodIntersection.create = (left, right, params) => {
      return new ZodIntersection({
        left,
        right,
        typeName: ZodFirstPartyTypeKind.ZodIntersection,
        ...processCreateParams(params)
      });
    };
    ZodTuple = class _ZodTuple extends ZodType {
      _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.array) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.array,
            received: ctx.parsedType
          });
          return INVALID;
        }
        if (ctx.data.length < this._def.items.length) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: this._def.items.length,
            inclusive: true,
            exact: false,
            type: "array"
          });
          return INVALID;
        }
        const rest = this._def.rest;
        if (!rest && ctx.data.length > this._def.items.length) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: this._def.items.length,
            inclusive: true,
            exact: false,
            type: "array"
          });
          status.dirty();
        }
        const items = [...ctx.data].map((item, itemIndex) => {
          const schema = this._def.items[itemIndex] || this._def.rest;
          if (!schema)
            return null;
          return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
        }).filter((x) => !!x);
        if (ctx.common.async) {
          return Promise.all(items).then((results) => {
            return ParseStatus.mergeArray(status, results);
          });
        } else {
          return ParseStatus.mergeArray(status, items);
        }
      }
      get items() {
        return this._def.items;
      }
      rest(rest) {
        return new _ZodTuple({
          ...this._def,
          rest
        });
      }
    };
    ZodTuple.create = (schemas, params) => {
      if (!Array.isArray(schemas)) {
        throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
      }
      return new ZodTuple({
        items: schemas,
        typeName: ZodFirstPartyTypeKind.ZodTuple,
        rest: null,
        ...processCreateParams(params)
      });
    };
    ZodRecord = class _ZodRecord extends ZodType {
      get keySchema() {
        return this._def.keyType;
      }
      get valueSchema() {
        return this._def.valueType;
      }
      _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.object) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.object,
            received: ctx.parsedType
          });
          return INVALID;
        }
        const pairs = [];
        const keyType = this._def.keyType;
        const valueType = this._def.valueType;
        for (const key in ctx.data) {
          pairs.push({
            key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
            value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
            alwaysSet: key in ctx.data
          });
        }
        if (ctx.common.async) {
          return ParseStatus.mergeObjectAsync(status, pairs);
        } else {
          return ParseStatus.mergeObjectSync(status, pairs);
        }
      }
      get element() {
        return this._def.valueType;
      }
      static create(first, second, third) {
        if (second instanceof ZodType) {
          return new _ZodRecord({
            keyType: first,
            valueType: second,
            typeName: ZodFirstPartyTypeKind.ZodRecord,
            ...processCreateParams(third)
          });
        }
        return new _ZodRecord({
          keyType: ZodString.create(),
          valueType: first,
          typeName: ZodFirstPartyTypeKind.ZodRecord,
          ...processCreateParams(second)
        });
      }
    };
    ZodMap = class extends ZodType {
      get keySchema() {
        return this._def.keyType;
      }
      get valueSchema() {
        return this._def.valueType;
      }
      _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.map) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.map,
            received: ctx.parsedType
          });
          return INVALID;
        }
        const keyType = this._def.keyType;
        const valueType = this._def.valueType;
        const pairs = [...ctx.data.entries()].map(([key, value], index) => {
          return {
            key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
            value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"]))
          };
        });
        if (ctx.common.async) {
          const finalMap = /* @__PURE__ */ new Map();
          return Promise.resolve().then(async () => {
            for (const pair of pairs) {
              const key = await pair.key;
              const value = await pair.value;
              if (key.status === "aborted" || value.status === "aborted") {
                return INVALID;
              }
              if (key.status === "dirty" || value.status === "dirty") {
                status.dirty();
              }
              finalMap.set(key.value, value.value);
            }
            return { status: status.value, value: finalMap };
          });
        } else {
          const finalMap = /* @__PURE__ */ new Map();
          for (const pair of pairs) {
            const key = pair.key;
            const value = pair.value;
            if (key.status === "aborted" || value.status === "aborted") {
              return INVALID;
            }
            if (key.status === "dirty" || value.status === "dirty") {
              status.dirty();
            }
            finalMap.set(key.value, value.value);
          }
          return { status: status.value, value: finalMap };
        }
      }
    };
    ZodMap.create = (keyType, valueType, params) => {
      return new ZodMap({
        valueType,
        keyType,
        typeName: ZodFirstPartyTypeKind.ZodMap,
        ...processCreateParams(params)
      });
    };
    ZodSet = class _ZodSet extends ZodType {
      _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.set) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.set,
            received: ctx.parsedType
          });
          return INVALID;
        }
        const def = this._def;
        if (def.minSize !== null) {
          if (ctx.data.size < def.minSize.value) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: def.minSize.value,
              type: "set",
              inclusive: true,
              exact: false,
              message: def.minSize.message
            });
            status.dirty();
          }
        }
        if (def.maxSize !== null) {
          if (ctx.data.size > def.maxSize.value) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: def.maxSize.value,
              type: "set",
              inclusive: true,
              exact: false,
              message: def.maxSize.message
            });
            status.dirty();
          }
        }
        const valueType = this._def.valueType;
        function finalizeSet(elements2) {
          const parsedSet = /* @__PURE__ */ new Set();
          for (const element of elements2) {
            if (element.status === "aborted")
              return INVALID;
            if (element.status === "dirty")
              status.dirty();
            parsedSet.add(element.value);
          }
          return { status: status.value, value: parsedSet };
        }
        const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
        if (ctx.common.async) {
          return Promise.all(elements).then((elements2) => finalizeSet(elements2));
        } else {
          return finalizeSet(elements);
        }
      }
      min(minSize, message) {
        return new _ZodSet({
          ...this._def,
          minSize: { value: minSize, message: errorUtil.toString(message) }
        });
      }
      max(maxSize, message) {
        return new _ZodSet({
          ...this._def,
          maxSize: { value: maxSize, message: errorUtil.toString(message) }
        });
      }
      size(size, message) {
        return this.min(size, message).max(size, message);
      }
      nonempty(message) {
        return this.min(1, message);
      }
    };
    ZodSet.create = (valueType, params) => {
      return new ZodSet({
        valueType,
        minSize: null,
        maxSize: null,
        typeName: ZodFirstPartyTypeKind.ZodSet,
        ...processCreateParams(params)
      });
    };
    ZodFunction = class _ZodFunction extends ZodType {
      constructor() {
        super(...arguments);
        this.validate = this.implement;
      }
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.function) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.function,
            received: ctx.parsedType
          });
          return INVALID;
        }
        function makeArgsIssue(args, error) {
          return makeIssue({
            data: args,
            path: ctx.path,
            errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
            issueData: {
              code: ZodIssueCode.invalid_arguments,
              argumentsError: error
            }
          });
        }
        function makeReturnsIssue(returns, error) {
          return makeIssue({
            data: returns,
            path: ctx.path,
            errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
            issueData: {
              code: ZodIssueCode.invalid_return_type,
              returnTypeError: error
            }
          });
        }
        const params = { errorMap: ctx.common.contextualErrorMap };
        const fn = ctx.data;
        if (this._def.returns instanceof ZodPromise) {
          const me = this;
          return OK(async function(...args) {
            const error = new ZodError([]);
            const parsedArgs = await me._def.args.parseAsync(args, params).catch((e) => {
              error.addIssue(makeArgsIssue(args, e));
              throw error;
            });
            const result = await Reflect.apply(fn, this, parsedArgs);
            const parsedReturns = await me._def.returns._def.type.parseAsync(result, params).catch((e) => {
              error.addIssue(makeReturnsIssue(result, e));
              throw error;
            });
            return parsedReturns;
          });
        } else {
          const me = this;
          return OK(function(...args) {
            const parsedArgs = me._def.args.safeParse(args, params);
            if (!parsedArgs.success) {
              throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
            }
            const result = Reflect.apply(fn, this, parsedArgs.data);
            const parsedReturns = me._def.returns.safeParse(result, params);
            if (!parsedReturns.success) {
              throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
            }
            return parsedReturns.data;
          });
        }
      }
      parameters() {
        return this._def.args;
      }
      returnType() {
        return this._def.returns;
      }
      args(...items) {
        return new _ZodFunction({
          ...this._def,
          args: ZodTuple.create(items).rest(ZodUnknown.create())
        });
      }
      returns(returnType) {
        return new _ZodFunction({
          ...this._def,
          returns: returnType
        });
      }
      implement(func) {
        const validatedFunc = this.parse(func);
        return validatedFunc;
      }
      strictImplement(func) {
        const validatedFunc = this.parse(func);
        return validatedFunc;
      }
      static create(args, returns, params) {
        return new _ZodFunction({
          args: args ? args : ZodTuple.create([]).rest(ZodUnknown.create()),
          returns: returns || ZodUnknown.create(),
          typeName: ZodFirstPartyTypeKind.ZodFunction,
          ...processCreateParams(params)
        });
      }
    };
    ZodLazy = class extends ZodType {
      get schema() {
        return this._def.getter();
      }
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        const lazySchema = this._def.getter();
        return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
      }
    };
    ZodLazy.create = (getter, params) => {
      return new ZodLazy({
        getter,
        typeName: ZodFirstPartyTypeKind.ZodLazy,
        ...processCreateParams(params)
      });
    };
    ZodLiteral = class extends ZodType {
      _parse(input) {
        if (input.data !== this._def.value) {
          const ctx = this._getOrReturnCtx(input);
          addIssueToContext(ctx, {
            received: ctx.data,
            code: ZodIssueCode.invalid_literal,
            expected: this._def.value
          });
          return INVALID;
        }
        return { status: "valid", value: input.data };
      }
      get value() {
        return this._def.value;
      }
    };
    ZodLiteral.create = (value, params) => {
      return new ZodLiteral({
        value,
        typeName: ZodFirstPartyTypeKind.ZodLiteral,
        ...processCreateParams(params)
      });
    };
    ZodEnum = class _ZodEnum extends ZodType {
      _parse(input) {
        if (typeof input.data !== "string") {
          const ctx = this._getOrReturnCtx(input);
          const expectedValues = this._def.values;
          addIssueToContext(ctx, {
            expected: util.joinValues(expectedValues),
            received: ctx.parsedType,
            code: ZodIssueCode.invalid_type
          });
          return INVALID;
        }
        if (!this._cache) {
          this._cache = new Set(this._def.values);
        }
        if (!this._cache.has(input.data)) {
          const ctx = this._getOrReturnCtx(input);
          const expectedValues = this._def.values;
          addIssueToContext(ctx, {
            received: ctx.data,
            code: ZodIssueCode.invalid_enum_value,
            options: expectedValues
          });
          return INVALID;
        }
        return OK(input.data);
      }
      get options() {
        return this._def.values;
      }
      get enum() {
        const enumValues = {};
        for (const val of this._def.values) {
          enumValues[val] = val;
        }
        return enumValues;
      }
      get Values() {
        const enumValues = {};
        for (const val of this._def.values) {
          enumValues[val] = val;
        }
        return enumValues;
      }
      get Enum() {
        const enumValues = {};
        for (const val of this._def.values) {
          enumValues[val] = val;
        }
        return enumValues;
      }
      extract(values, newDef = this._def) {
        return _ZodEnum.create(values, {
          ...this._def,
          ...newDef
        });
      }
      exclude(values, newDef = this._def) {
        return _ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
          ...this._def,
          ...newDef
        });
      }
    };
    ZodEnum.create = createZodEnum;
    ZodNativeEnum = class extends ZodType {
      _parse(input) {
        const nativeEnumValues = util.getValidEnumValues(this._def.values);
        const ctx = this._getOrReturnCtx(input);
        if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
          const expectedValues = util.objectValues(nativeEnumValues);
          addIssueToContext(ctx, {
            expected: util.joinValues(expectedValues),
            received: ctx.parsedType,
            code: ZodIssueCode.invalid_type
          });
          return INVALID;
        }
        if (!this._cache) {
          this._cache = new Set(util.getValidEnumValues(this._def.values));
        }
        if (!this._cache.has(input.data)) {
          const expectedValues = util.objectValues(nativeEnumValues);
          addIssueToContext(ctx, {
            received: ctx.data,
            code: ZodIssueCode.invalid_enum_value,
            options: expectedValues
          });
          return INVALID;
        }
        return OK(input.data);
      }
      get enum() {
        return this._def.values;
      }
    };
    ZodNativeEnum.create = (values, params) => {
      return new ZodNativeEnum({
        values,
        typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
        ...processCreateParams(params)
      });
    };
    ZodPromise = class extends ZodType {
      unwrap() {
        return this._def.type;
      }
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.promise,
            received: ctx.parsedType
          });
          return INVALID;
        }
        const promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
        return OK(promisified.then((data) => {
          return this._def.type.parseAsync(data, {
            path: ctx.path,
            errorMap: ctx.common.contextualErrorMap
          });
        }));
      }
    };
    ZodPromise.create = (schema, params) => {
      return new ZodPromise({
        type: schema,
        typeName: ZodFirstPartyTypeKind.ZodPromise,
        ...processCreateParams(params)
      });
    };
    ZodEffects = class extends ZodType {
      innerType() {
        return this._def.schema;
      }
      sourceType() {
        return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
      }
      _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        const effect = this._def.effect || null;
        const checkCtx = {
          addIssue: (arg) => {
            addIssueToContext(ctx, arg);
            if (arg.fatal) {
              status.abort();
            } else {
              status.dirty();
            }
          },
          get path() {
            return ctx.path;
          }
        };
        checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
        if (effect.type === "preprocess") {
          const processed = effect.transform(ctx.data, checkCtx);
          if (ctx.common.async) {
            return Promise.resolve(processed).then(async (processed2) => {
              if (status.value === "aborted")
                return INVALID;
              const result = await this._def.schema._parseAsync({
                data: processed2,
                path: ctx.path,
                parent: ctx
              });
              if (result.status === "aborted")
                return INVALID;
              if (result.status === "dirty")
                return DIRTY(result.value);
              if (status.value === "dirty")
                return DIRTY(result.value);
              return result;
            });
          } else {
            if (status.value === "aborted")
              return INVALID;
            const result = this._def.schema._parseSync({
              data: processed,
              path: ctx.path,
              parent: ctx
            });
            if (result.status === "aborted")
              return INVALID;
            if (result.status === "dirty")
              return DIRTY(result.value);
            if (status.value === "dirty")
              return DIRTY(result.value);
            return result;
          }
        }
        if (effect.type === "refinement") {
          const executeRefinement = (acc) => {
            const result = effect.refinement(acc, checkCtx);
            if (ctx.common.async) {
              return Promise.resolve(result);
            }
            if (result instanceof Promise) {
              throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
            }
            return acc;
          };
          if (ctx.common.async === false) {
            const inner = this._def.schema._parseSync({
              data: ctx.data,
              path: ctx.path,
              parent: ctx
            });
            if (inner.status === "aborted")
              return INVALID;
            if (inner.status === "dirty")
              status.dirty();
            executeRefinement(inner.value);
            return { status: status.value, value: inner.value };
          } else {
            return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
              if (inner.status === "aborted")
                return INVALID;
              if (inner.status === "dirty")
                status.dirty();
              return executeRefinement(inner.value).then(() => {
                return { status: status.value, value: inner.value };
              });
            });
          }
        }
        if (effect.type === "transform") {
          if (ctx.common.async === false) {
            const base = this._def.schema._parseSync({
              data: ctx.data,
              path: ctx.path,
              parent: ctx
            });
            if (!isValid(base))
              return INVALID;
            const result = effect.transform(base.value, checkCtx);
            if (result instanceof Promise) {
              throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
            }
            return { status: status.value, value: result };
          } else {
            return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
              if (!isValid(base))
                return INVALID;
              return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({
                status: status.value,
                value: result
              }));
            });
          }
        }
        util.assertNever(effect);
      }
    };
    ZodEffects.create = (schema, effect, params) => {
      return new ZodEffects({
        schema,
        typeName: ZodFirstPartyTypeKind.ZodEffects,
        effect,
        ...processCreateParams(params)
      });
    };
    ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
      return new ZodEffects({
        schema,
        effect: { type: "preprocess", transform: preprocess },
        typeName: ZodFirstPartyTypeKind.ZodEffects,
        ...processCreateParams(params)
      });
    };
    ZodOptional = class extends ZodType {
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType === ZodParsedType.undefined) {
          return OK(void 0);
        }
        return this._def.innerType._parse(input);
      }
      unwrap() {
        return this._def.innerType;
      }
    };
    ZodOptional.create = (type, params) => {
      return new ZodOptional({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodOptional,
        ...processCreateParams(params)
      });
    };
    ZodNullable = class extends ZodType {
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType === ZodParsedType.null) {
          return OK(null);
        }
        return this._def.innerType._parse(input);
      }
      unwrap() {
        return this._def.innerType;
      }
    };
    ZodNullable.create = (type, params) => {
      return new ZodNullable({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodNullable,
        ...processCreateParams(params)
      });
    };
    ZodDefault = class extends ZodType {
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        let data = ctx.data;
        if (ctx.parsedType === ZodParsedType.undefined) {
          data = this._def.defaultValue();
        }
        return this._def.innerType._parse({
          data,
          path: ctx.path,
          parent: ctx
        });
      }
      removeDefault() {
        return this._def.innerType;
      }
    };
    ZodDefault.create = (type, params) => {
      return new ZodDefault({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodDefault,
        defaultValue: typeof params.default === "function" ? params.default : () => params.default,
        ...processCreateParams(params)
      });
    };
    ZodCatch = class extends ZodType {
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        const newCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          }
        };
        const result = this._def.innerType._parse({
          data: newCtx.data,
          path: newCtx.path,
          parent: {
            ...newCtx
          }
        });
        if (isAsync(result)) {
          return result.then((result2) => {
            return {
              status: "valid",
              value: result2.status === "valid" ? result2.value : this._def.catchValue({
                get error() {
                  return new ZodError(newCtx.common.issues);
                },
                input: newCtx.data
              })
            };
          });
        } else {
          return {
            status: "valid",
            value: result.status === "valid" ? result.value : this._def.catchValue({
              get error() {
                return new ZodError(newCtx.common.issues);
              },
              input: newCtx.data
            })
          };
        }
      }
      removeCatch() {
        return this._def.innerType;
      }
    };
    ZodCatch.create = (type, params) => {
      return new ZodCatch({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodCatch,
        catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
        ...processCreateParams(params)
      });
    };
    ZodNaN = class extends ZodType {
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.nan) {
          const ctx = this._getOrReturnCtx(input);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.nan,
            received: ctx.parsedType
          });
          return INVALID;
        }
        return { status: "valid", value: input.data };
      }
    };
    ZodNaN.create = (params) => {
      return new ZodNaN({
        typeName: ZodFirstPartyTypeKind.ZodNaN,
        ...processCreateParams(params)
      });
    };
    BRAND = Symbol("zod_brand");
    ZodBranded = class extends ZodType {
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        const data = ctx.data;
        return this._def.type._parse({
          data,
          path: ctx.path,
          parent: ctx
        });
      }
      unwrap() {
        return this._def.type;
      }
    };
    ZodPipeline = class _ZodPipeline extends ZodType {
      _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.common.async) {
          const handleAsync = async () => {
            const inResult = await this._def.in._parseAsync({
              data: ctx.data,
              path: ctx.path,
              parent: ctx
            });
            if (inResult.status === "aborted")
              return INVALID;
            if (inResult.status === "dirty") {
              status.dirty();
              return DIRTY(inResult.value);
            } else {
              return this._def.out._parseAsync({
                data: inResult.value,
                path: ctx.path,
                parent: ctx
              });
            }
          };
          return handleAsync();
        } else {
          const inResult = this._def.in._parseSync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          });
          if (inResult.status === "aborted")
            return INVALID;
          if (inResult.status === "dirty") {
            status.dirty();
            return {
              status: "dirty",
              value: inResult.value
            };
          } else {
            return this._def.out._parseSync({
              data: inResult.value,
              path: ctx.path,
              parent: ctx
            });
          }
        }
      }
      static create(a, b) {
        return new _ZodPipeline({
          in: a,
          out: b,
          typeName: ZodFirstPartyTypeKind.ZodPipeline
        });
      }
    };
    ZodReadonly = class extends ZodType {
      _parse(input) {
        const result = this._def.innerType._parse(input);
        const freeze = (data) => {
          if (isValid(data)) {
            data.value = Object.freeze(data.value);
          }
          return data;
        };
        return isAsync(result) ? result.then((data) => freeze(data)) : freeze(result);
      }
      unwrap() {
        return this._def.innerType;
      }
    };
    ZodReadonly.create = (type, params) => {
      return new ZodReadonly({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodReadonly,
        ...processCreateParams(params)
      });
    };
    late = {
      object: ZodObject.lazycreate
    };
    (function(ZodFirstPartyTypeKind2) {
      ZodFirstPartyTypeKind2["ZodString"] = "ZodString";
      ZodFirstPartyTypeKind2["ZodNumber"] = "ZodNumber";
      ZodFirstPartyTypeKind2["ZodNaN"] = "ZodNaN";
      ZodFirstPartyTypeKind2["ZodBigInt"] = "ZodBigInt";
      ZodFirstPartyTypeKind2["ZodBoolean"] = "ZodBoolean";
      ZodFirstPartyTypeKind2["ZodDate"] = "ZodDate";
      ZodFirstPartyTypeKind2["ZodSymbol"] = "ZodSymbol";
      ZodFirstPartyTypeKind2["ZodUndefined"] = "ZodUndefined";
      ZodFirstPartyTypeKind2["ZodNull"] = "ZodNull";
      ZodFirstPartyTypeKind2["ZodAny"] = "ZodAny";
      ZodFirstPartyTypeKind2["ZodUnknown"] = "ZodUnknown";
      ZodFirstPartyTypeKind2["ZodNever"] = "ZodNever";
      ZodFirstPartyTypeKind2["ZodVoid"] = "ZodVoid";
      ZodFirstPartyTypeKind2["ZodArray"] = "ZodArray";
      ZodFirstPartyTypeKind2["ZodObject"] = "ZodObject";
      ZodFirstPartyTypeKind2["ZodUnion"] = "ZodUnion";
      ZodFirstPartyTypeKind2["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
      ZodFirstPartyTypeKind2["ZodIntersection"] = "ZodIntersection";
      ZodFirstPartyTypeKind2["ZodTuple"] = "ZodTuple";
      ZodFirstPartyTypeKind2["ZodRecord"] = "ZodRecord";
      ZodFirstPartyTypeKind2["ZodMap"] = "ZodMap";
      ZodFirstPartyTypeKind2["ZodSet"] = "ZodSet";
      ZodFirstPartyTypeKind2["ZodFunction"] = "ZodFunction";
      ZodFirstPartyTypeKind2["ZodLazy"] = "ZodLazy";
      ZodFirstPartyTypeKind2["ZodLiteral"] = "ZodLiteral";
      ZodFirstPartyTypeKind2["ZodEnum"] = "ZodEnum";
      ZodFirstPartyTypeKind2["ZodEffects"] = "ZodEffects";
      ZodFirstPartyTypeKind2["ZodNativeEnum"] = "ZodNativeEnum";
      ZodFirstPartyTypeKind2["ZodOptional"] = "ZodOptional";
      ZodFirstPartyTypeKind2["ZodNullable"] = "ZodNullable";
      ZodFirstPartyTypeKind2["ZodDefault"] = "ZodDefault";
      ZodFirstPartyTypeKind2["ZodCatch"] = "ZodCatch";
      ZodFirstPartyTypeKind2["ZodPromise"] = "ZodPromise";
      ZodFirstPartyTypeKind2["ZodBranded"] = "ZodBranded";
      ZodFirstPartyTypeKind2["ZodPipeline"] = "ZodPipeline";
      ZodFirstPartyTypeKind2["ZodReadonly"] = "ZodReadonly";
    })(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
    instanceOfType = (cls, params = {
      message: `Input not instance of ${cls.name}`
    }) => custom((data) => data instanceof cls, params);
    stringType = ZodString.create;
    numberType = ZodNumber.create;
    nanType = ZodNaN.create;
    bigIntType = ZodBigInt.create;
    booleanType = ZodBoolean.create;
    dateType = ZodDate.create;
    symbolType = ZodSymbol.create;
    undefinedType = ZodUndefined.create;
    nullType = ZodNull.create;
    anyType = ZodAny.create;
    unknownType = ZodUnknown.create;
    neverType = ZodNever.create;
    voidType = ZodVoid.create;
    arrayType = ZodArray.create;
    objectType = ZodObject.create;
    strictObjectType = ZodObject.strictCreate;
    unionType = ZodUnion.create;
    discriminatedUnionType = ZodDiscriminatedUnion.create;
    intersectionType = ZodIntersection.create;
    tupleType = ZodTuple.create;
    recordType = ZodRecord.create;
    mapType = ZodMap.create;
    setType = ZodSet.create;
    functionType = ZodFunction.create;
    lazyType = ZodLazy.create;
    literalType = ZodLiteral.create;
    enumType = ZodEnum.create;
    nativeEnumType = ZodNativeEnum.create;
    promiseType = ZodPromise.create;
    effectsType = ZodEffects.create;
    optionalType = ZodOptional.create;
    nullableType = ZodNullable.create;
    preprocessType = ZodEffects.createWithPreprocess;
    pipelineType = ZodPipeline.create;
    ostring = () => stringType().optional();
    onumber = () => numberType().optional();
    oboolean = () => booleanType().optional();
    coerce = {
      string: ((arg) => ZodString.create({ ...arg, coerce: true })),
      number: ((arg) => ZodNumber.create({ ...arg, coerce: true })),
      boolean: ((arg) => ZodBoolean.create({
        ...arg,
        coerce: true
      })),
      bigint: ((arg) => ZodBigInt.create({ ...arg, coerce: true })),
      date: ((arg) => ZodDate.create({ ...arg, coerce: true }))
    };
    NEVER = INVALID;
  }
});

// node_modules/zod/v3/external.js
var external_exports = {};
__export(external_exports, {
  BRAND: () => BRAND,
  DIRTY: () => DIRTY,
  EMPTY_PATH: () => EMPTY_PATH,
  INVALID: () => INVALID,
  NEVER: () => NEVER,
  OK: () => OK,
  ParseStatus: () => ParseStatus,
  Schema: () => ZodType,
  ZodAny: () => ZodAny,
  ZodArray: () => ZodArray,
  ZodBigInt: () => ZodBigInt,
  ZodBoolean: () => ZodBoolean,
  ZodBranded: () => ZodBranded,
  ZodCatch: () => ZodCatch,
  ZodDate: () => ZodDate,
  ZodDefault: () => ZodDefault,
  ZodDiscriminatedUnion: () => ZodDiscriminatedUnion,
  ZodEffects: () => ZodEffects,
  ZodEnum: () => ZodEnum,
  ZodError: () => ZodError,
  ZodFirstPartyTypeKind: () => ZodFirstPartyTypeKind,
  ZodFunction: () => ZodFunction,
  ZodIntersection: () => ZodIntersection,
  ZodIssueCode: () => ZodIssueCode,
  ZodLazy: () => ZodLazy,
  ZodLiteral: () => ZodLiteral,
  ZodMap: () => ZodMap,
  ZodNaN: () => ZodNaN,
  ZodNativeEnum: () => ZodNativeEnum,
  ZodNever: () => ZodNever,
  ZodNull: () => ZodNull,
  ZodNullable: () => ZodNullable,
  ZodNumber: () => ZodNumber,
  ZodObject: () => ZodObject,
  ZodOptional: () => ZodOptional,
  ZodParsedType: () => ZodParsedType,
  ZodPipeline: () => ZodPipeline,
  ZodPromise: () => ZodPromise,
  ZodReadonly: () => ZodReadonly,
  ZodRecord: () => ZodRecord,
  ZodSchema: () => ZodType,
  ZodSet: () => ZodSet,
  ZodString: () => ZodString,
  ZodSymbol: () => ZodSymbol,
  ZodTransformer: () => ZodEffects,
  ZodTuple: () => ZodTuple,
  ZodType: () => ZodType,
  ZodUndefined: () => ZodUndefined,
  ZodUnion: () => ZodUnion,
  ZodUnknown: () => ZodUnknown,
  ZodVoid: () => ZodVoid,
  addIssueToContext: () => addIssueToContext,
  any: () => anyType,
  array: () => arrayType,
  bigint: () => bigIntType,
  boolean: () => booleanType,
  coerce: () => coerce,
  custom: () => custom,
  date: () => dateType,
  datetimeRegex: () => datetimeRegex,
  defaultErrorMap: () => en_default,
  discriminatedUnion: () => discriminatedUnionType,
  effect: () => effectsType,
  enum: () => enumType,
  function: () => functionType,
  getErrorMap: () => getErrorMap,
  getParsedType: () => getParsedType,
  instanceof: () => instanceOfType,
  intersection: () => intersectionType,
  isAborted: () => isAborted,
  isAsync: () => isAsync,
  isDirty: () => isDirty,
  isValid: () => isValid,
  late: () => late,
  lazy: () => lazyType,
  literal: () => literalType,
  makeIssue: () => makeIssue,
  map: () => mapType,
  nan: () => nanType,
  nativeEnum: () => nativeEnumType,
  never: () => neverType,
  null: () => nullType,
  nullable: () => nullableType,
  number: () => numberType,
  object: () => objectType,
  objectUtil: () => objectUtil,
  oboolean: () => oboolean,
  onumber: () => onumber,
  optional: () => optionalType,
  ostring: () => ostring,
  pipeline: () => pipelineType,
  preprocess: () => preprocessType,
  promise: () => promiseType,
  quotelessJson: () => quotelessJson,
  record: () => recordType,
  set: () => setType,
  setErrorMap: () => setErrorMap,
  strictObject: () => strictObjectType,
  string: () => stringType,
  symbol: () => symbolType,
  transformer: () => effectsType,
  tuple: () => tupleType,
  undefined: () => undefinedType,
  union: () => unionType,
  unknown: () => unknownType,
  util: () => util,
  void: () => voidType
});
var init_external = __esm({
  "node_modules/zod/v3/external.js"() {
    init_errors();
    init_parseUtil();
    init_typeAliases();
    init_util();
    init_types();
    init_ZodError();
  }
});

// node_modules/zod/index.js
var init_zod = __esm({
  "node_modules/zod/index.js"() {
    init_external();
    init_external();
  }
});

// node_modules/xml2js/lib/defaults.js
var require_defaults = __commonJS({
  "node_modules/xml2js/lib/defaults.js"(exports2) {
    (function() {
      exports2.defaults = {
        "0.1": {
          explicitCharkey: false,
          trim: true,
          normalize: true,
          normalizeTags: false,
          attrkey: "@",
          charkey: "#",
          explicitArray: false,
          ignoreAttrs: false,
          mergeAttrs: false,
          explicitRoot: false,
          validator: null,
          xmlns: false,
          explicitChildren: false,
          childkey: "@@",
          charsAsChildren: false,
          includeWhiteChars: false,
          async: false,
          strict: true,
          attrNameProcessors: null,
          attrValueProcessors: null,
          tagNameProcessors: null,
          valueProcessors: null,
          emptyTag: ""
        },
        "0.2": {
          explicitCharkey: false,
          trim: false,
          normalize: false,
          normalizeTags: false,
          attrkey: "$",
          charkey: "_",
          explicitArray: true,
          ignoreAttrs: false,
          mergeAttrs: false,
          explicitRoot: true,
          validator: null,
          xmlns: false,
          explicitChildren: false,
          preserveChildrenOrder: false,
          childkey: "$$",
          charsAsChildren: false,
          includeWhiteChars: false,
          async: false,
          strict: true,
          attrNameProcessors: null,
          attrValueProcessors: null,
          tagNameProcessors: null,
          valueProcessors: null,
          rootName: "root",
          xmldec: {
            "version": "1.0",
            "encoding": "UTF-8",
            "standalone": true
          },
          doctype: null,
          renderOpts: {
            "pretty": true,
            "indent": "  ",
            "newline": "\n"
          },
          headless: false,
          chunkSize: 1e4,
          emptyTag: "",
          cdata: false
        }
      };
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/Utility.js
var require_Utility = __commonJS({
  "node_modules/xmlbuilder/lib/Utility.js"(exports2, module2) {
    (function() {
      var assign, getValue, isArray, isEmpty, isFunction, isObject, isPlainObject, slice = [].slice, hasProp = {}.hasOwnProperty;
      assign = function() {
        var i, key, len, source, sources, target;
        target = arguments[0], sources = 2 <= arguments.length ? slice.call(arguments, 1) : [];
        if (isFunction(Object.assign)) {
          Object.assign.apply(null, arguments);
        } else {
          for (i = 0, len = sources.length; i < len; i++) {
            source = sources[i];
            if (source != null) {
              for (key in source) {
                if (!hasProp.call(source, key)) continue;
                target[key] = source[key];
              }
            }
          }
        }
        return target;
      };
      isFunction = function(val) {
        return !!val && Object.prototype.toString.call(val) === "[object Function]";
      };
      isObject = function(val) {
        var ref;
        return !!val && ((ref = typeof val) === "function" || ref === "object");
      };
      isArray = function(val) {
        if (isFunction(Array.isArray)) {
          return Array.isArray(val);
        } else {
          return Object.prototype.toString.call(val) === "[object Array]";
        }
      };
      isEmpty = function(val) {
        var key;
        if (isArray(val)) {
          return !val.length;
        } else {
          for (key in val) {
            if (!hasProp.call(val, key)) continue;
            return false;
          }
          return true;
        }
      };
      isPlainObject = function(val) {
        var ctor, proto;
        return isObject(val) && (proto = Object.getPrototypeOf(val)) && (ctor = proto.constructor) && typeof ctor === "function" && ctor instanceof ctor && Function.prototype.toString.call(ctor) === Function.prototype.toString.call(Object);
      };
      getValue = function(obj) {
        if (isFunction(obj.valueOf)) {
          return obj.valueOf();
        } else {
          return obj;
        }
      };
      module2.exports.assign = assign;
      module2.exports.isFunction = isFunction;
      module2.exports.isObject = isObject;
      module2.exports.isArray = isArray;
      module2.exports.isEmpty = isEmpty;
      module2.exports.isPlainObject = isPlainObject;
      module2.exports.getValue = getValue;
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLDOMImplementation.js
var require_XMLDOMImplementation = __commonJS({
  "node_modules/xmlbuilder/lib/XMLDOMImplementation.js"(exports2, module2) {
    (function() {
      var XMLDOMImplementation;
      module2.exports = XMLDOMImplementation = (function() {
        function XMLDOMImplementation2() {
        }
        XMLDOMImplementation2.prototype.hasFeature = function(feature, version) {
          return true;
        };
        XMLDOMImplementation2.prototype.createDocumentType = function(qualifiedName, publicId, systemId) {
          throw new Error("This DOM method is not implemented.");
        };
        XMLDOMImplementation2.prototype.createDocument = function(namespaceURI, qualifiedName, doctype) {
          throw new Error("This DOM method is not implemented.");
        };
        XMLDOMImplementation2.prototype.createHTMLDocument = function(title) {
          throw new Error("This DOM method is not implemented.");
        };
        XMLDOMImplementation2.prototype.getFeature = function(feature, version) {
          throw new Error("This DOM method is not implemented.");
        };
        return XMLDOMImplementation2;
      })();
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLDOMErrorHandler.js
var require_XMLDOMErrorHandler = __commonJS({
  "node_modules/xmlbuilder/lib/XMLDOMErrorHandler.js"(exports2, module2) {
    (function() {
      var XMLDOMErrorHandler;
      module2.exports = XMLDOMErrorHandler = (function() {
        function XMLDOMErrorHandler2() {
        }
        XMLDOMErrorHandler2.prototype.handleError = function(error) {
          throw new Error(error);
        };
        return XMLDOMErrorHandler2;
      })();
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLDOMStringList.js
var require_XMLDOMStringList = __commonJS({
  "node_modules/xmlbuilder/lib/XMLDOMStringList.js"(exports2, module2) {
    (function() {
      var XMLDOMStringList;
      module2.exports = XMLDOMStringList = (function() {
        function XMLDOMStringList2(arr) {
          this.arr = arr || [];
        }
        Object.defineProperty(XMLDOMStringList2.prototype, "length", {
          get: function() {
            return this.arr.length;
          }
        });
        XMLDOMStringList2.prototype.item = function(index) {
          return this.arr[index] || null;
        };
        XMLDOMStringList2.prototype.contains = function(str) {
          return this.arr.indexOf(str) !== -1;
        };
        return XMLDOMStringList2;
      })();
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLDOMConfiguration.js
var require_XMLDOMConfiguration = __commonJS({
  "node_modules/xmlbuilder/lib/XMLDOMConfiguration.js"(exports2, module2) {
    (function() {
      var XMLDOMConfiguration, XMLDOMErrorHandler, XMLDOMStringList;
      XMLDOMErrorHandler = require_XMLDOMErrorHandler();
      XMLDOMStringList = require_XMLDOMStringList();
      module2.exports = XMLDOMConfiguration = (function() {
        function XMLDOMConfiguration2() {
          var clonedSelf;
          this.defaultParams = {
            "canonical-form": false,
            "cdata-sections": false,
            "comments": false,
            "datatype-normalization": false,
            "element-content-whitespace": true,
            "entities": true,
            "error-handler": new XMLDOMErrorHandler(),
            "infoset": true,
            "validate-if-schema": false,
            "namespaces": true,
            "namespace-declarations": true,
            "normalize-characters": false,
            "schema-location": "",
            "schema-type": "",
            "split-cdata-sections": true,
            "validate": false,
            "well-formed": true
          };
          this.params = clonedSelf = Object.create(this.defaultParams);
        }
        Object.defineProperty(XMLDOMConfiguration2.prototype, "parameterNames", {
          get: function() {
            return new XMLDOMStringList(Object.keys(this.defaultParams));
          }
        });
        XMLDOMConfiguration2.prototype.getParameter = function(name) {
          if (this.params.hasOwnProperty(name)) {
            return this.params[name];
          } else {
            return null;
          }
        };
        XMLDOMConfiguration2.prototype.canSetParameter = function(name, value) {
          return true;
        };
        XMLDOMConfiguration2.prototype.setParameter = function(name, value) {
          if (value != null) {
            return this.params[name] = value;
          } else {
            return delete this.params[name];
          }
        };
        return XMLDOMConfiguration2;
      })();
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/NodeType.js
var require_NodeType = __commonJS({
  "node_modules/xmlbuilder/lib/NodeType.js"(exports2, module2) {
    (function() {
      module2.exports = {
        Element: 1,
        Attribute: 2,
        Text: 3,
        CData: 4,
        EntityReference: 5,
        EntityDeclaration: 6,
        ProcessingInstruction: 7,
        Comment: 8,
        Document: 9,
        DocType: 10,
        DocumentFragment: 11,
        NotationDeclaration: 12,
        Declaration: 201,
        Raw: 202,
        AttributeDeclaration: 203,
        ElementDeclaration: 204,
        Dummy: 205
      };
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLAttribute.js
var require_XMLAttribute = __commonJS({
  "node_modules/xmlbuilder/lib/XMLAttribute.js"(exports2, module2) {
    (function() {
      var NodeType, XMLAttribute, XMLNode;
      NodeType = require_NodeType();
      XMLNode = require_XMLNode();
      module2.exports = XMLAttribute = (function() {
        function XMLAttribute2(parent, name, value) {
          this.parent = parent;
          if (this.parent) {
            this.options = this.parent.options;
            this.stringify = this.parent.stringify;
          }
          if (name == null) {
            throw new Error("Missing attribute name. " + this.debugInfo(name));
          }
          this.name = this.stringify.name(name);
          this.value = this.stringify.attValue(value);
          this.type = NodeType.Attribute;
          this.isId = false;
          this.schemaTypeInfo = null;
        }
        Object.defineProperty(XMLAttribute2.prototype, "nodeType", {
          get: function() {
            return this.type;
          }
        });
        Object.defineProperty(XMLAttribute2.prototype, "ownerElement", {
          get: function() {
            return this.parent;
          }
        });
        Object.defineProperty(XMLAttribute2.prototype, "textContent", {
          get: function() {
            return this.value;
          },
          set: function(value) {
            return this.value = value || "";
          }
        });
        Object.defineProperty(XMLAttribute2.prototype, "namespaceURI", {
          get: function() {
            return "";
          }
        });
        Object.defineProperty(XMLAttribute2.prototype, "prefix", {
          get: function() {
            return "";
          }
        });
        Object.defineProperty(XMLAttribute2.prototype, "localName", {
          get: function() {
            return this.name;
          }
        });
        Object.defineProperty(XMLAttribute2.prototype, "specified", {
          get: function() {
            return true;
          }
        });
        XMLAttribute2.prototype.clone = function() {
          return Object.create(this);
        };
        XMLAttribute2.prototype.toString = function(options2) {
          return this.options.writer.attribute(this, this.options.writer.filterOptions(options2));
        };
        XMLAttribute2.prototype.debugInfo = function(name) {
          name = name || this.name;
          if (name == null) {
            return "parent: <" + this.parent.name + ">";
          } else {
            return "attribute: {" + name + "}, parent: <" + this.parent.name + ">";
          }
        };
        XMLAttribute2.prototype.isEqualNode = function(node) {
          if (node.namespaceURI !== this.namespaceURI) {
            return false;
          }
          if (node.prefix !== this.prefix) {
            return false;
          }
          if (node.localName !== this.localName) {
            return false;
          }
          if (node.value !== this.value) {
            return false;
          }
          return true;
        };
        return XMLAttribute2;
      })();
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLNamedNodeMap.js
var require_XMLNamedNodeMap = __commonJS({
  "node_modules/xmlbuilder/lib/XMLNamedNodeMap.js"(exports2, module2) {
    (function() {
      var XMLNamedNodeMap;
      module2.exports = XMLNamedNodeMap = (function() {
        function XMLNamedNodeMap2(nodes) {
          this.nodes = nodes;
        }
        Object.defineProperty(XMLNamedNodeMap2.prototype, "length", {
          get: function() {
            return Object.keys(this.nodes).length || 0;
          }
        });
        XMLNamedNodeMap2.prototype.clone = function() {
          return this.nodes = null;
        };
        XMLNamedNodeMap2.prototype.getNamedItem = function(name) {
          return this.nodes[name];
        };
        XMLNamedNodeMap2.prototype.setNamedItem = function(node) {
          var oldNode;
          oldNode = this.nodes[node.nodeName];
          this.nodes[node.nodeName] = node;
          return oldNode || null;
        };
        XMLNamedNodeMap2.prototype.removeNamedItem = function(name) {
          var oldNode;
          oldNode = this.nodes[name];
          delete this.nodes[name];
          return oldNode || null;
        };
        XMLNamedNodeMap2.prototype.item = function(index) {
          return this.nodes[Object.keys(this.nodes)[index]] || null;
        };
        XMLNamedNodeMap2.prototype.getNamedItemNS = function(namespaceURI, localName) {
          throw new Error("This DOM method is not implemented.");
        };
        XMLNamedNodeMap2.prototype.setNamedItemNS = function(node) {
          throw new Error("This DOM method is not implemented.");
        };
        XMLNamedNodeMap2.prototype.removeNamedItemNS = function(namespaceURI, localName) {
          throw new Error("This DOM method is not implemented.");
        };
        return XMLNamedNodeMap2;
      })();
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLElement.js
var require_XMLElement = __commonJS({
  "node_modules/xmlbuilder/lib/XMLElement.js"(exports2, module2) {
    (function() {
      var NodeType, XMLAttribute, XMLElement, XMLNamedNodeMap, XMLNode, getValue, isFunction, isObject, ref, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      ref = require_Utility(), isObject = ref.isObject, isFunction = ref.isFunction, getValue = ref.getValue;
      XMLNode = require_XMLNode();
      NodeType = require_NodeType();
      XMLAttribute = require_XMLAttribute();
      XMLNamedNodeMap = require_XMLNamedNodeMap();
      module2.exports = XMLElement = (function(superClass) {
        extend(XMLElement2, superClass);
        function XMLElement2(parent, name, attributes) {
          var child, j, len, ref1;
          XMLElement2.__super__.constructor.call(this, parent);
          if (name == null) {
            throw new Error("Missing element name. " + this.debugInfo());
          }
          this.name = this.stringify.name(name);
          this.type = NodeType.Element;
          this.attribs = {};
          this.schemaTypeInfo = null;
          if (attributes != null) {
            this.attribute(attributes);
          }
          if (parent.type === NodeType.Document) {
            this.isRoot = true;
            this.documentObject = parent;
            parent.rootObject = this;
            if (parent.children) {
              ref1 = parent.children;
              for (j = 0, len = ref1.length; j < len; j++) {
                child = ref1[j];
                if (child.type === NodeType.DocType) {
                  child.name = this.name;
                  break;
                }
              }
            }
          }
        }
        Object.defineProperty(XMLElement2.prototype, "tagName", {
          get: function() {
            return this.name;
          }
        });
        Object.defineProperty(XMLElement2.prototype, "namespaceURI", {
          get: function() {
            return "";
          }
        });
        Object.defineProperty(XMLElement2.prototype, "prefix", {
          get: function() {
            return "";
          }
        });
        Object.defineProperty(XMLElement2.prototype, "localName", {
          get: function() {
            return this.name;
          }
        });
        Object.defineProperty(XMLElement2.prototype, "id", {
          get: function() {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
        });
        Object.defineProperty(XMLElement2.prototype, "className", {
          get: function() {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
        });
        Object.defineProperty(XMLElement2.prototype, "classList", {
          get: function() {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
        });
        Object.defineProperty(XMLElement2.prototype, "attributes", {
          get: function() {
            if (!this.attributeMap || !this.attributeMap.nodes) {
              this.attributeMap = new XMLNamedNodeMap(this.attribs);
            }
            return this.attributeMap;
          }
        });
        XMLElement2.prototype.clone = function() {
          var att, attName, clonedSelf, ref1;
          clonedSelf = Object.create(this);
          if (clonedSelf.isRoot) {
            clonedSelf.documentObject = null;
          }
          clonedSelf.attribs = {};
          ref1 = this.attribs;
          for (attName in ref1) {
            if (!hasProp.call(ref1, attName)) continue;
            att = ref1[attName];
            clonedSelf.attribs[attName] = att.clone();
          }
          clonedSelf.children = [];
          this.children.forEach(function(child) {
            var clonedChild;
            clonedChild = child.clone();
            clonedChild.parent = clonedSelf;
            return clonedSelf.children.push(clonedChild);
          });
          return clonedSelf;
        };
        XMLElement2.prototype.attribute = function(name, value) {
          var attName, attValue;
          if (name != null) {
            name = getValue(name);
          }
          if (isObject(name)) {
            for (attName in name) {
              if (!hasProp.call(name, attName)) continue;
              attValue = name[attName];
              this.attribute(attName, attValue);
            }
          } else {
            if (isFunction(value)) {
              value = value.apply();
            }
            if (this.options.keepNullAttributes && value == null) {
              this.attribs[name] = new XMLAttribute(this, name, "");
            } else if (value != null) {
              this.attribs[name] = new XMLAttribute(this, name, value);
            }
          }
          return this;
        };
        XMLElement2.prototype.removeAttribute = function(name) {
          var attName, j, len;
          if (name == null) {
            throw new Error("Missing attribute name. " + this.debugInfo());
          }
          name = getValue(name);
          if (Array.isArray(name)) {
            for (j = 0, len = name.length; j < len; j++) {
              attName = name[j];
              delete this.attribs[attName];
            }
          } else {
            delete this.attribs[name];
          }
          return this;
        };
        XMLElement2.prototype.toString = function(options2) {
          return this.options.writer.element(this, this.options.writer.filterOptions(options2));
        };
        XMLElement2.prototype.att = function(name, value) {
          return this.attribute(name, value);
        };
        XMLElement2.prototype.a = function(name, value) {
          return this.attribute(name, value);
        };
        XMLElement2.prototype.getAttribute = function(name) {
          if (this.attribs.hasOwnProperty(name)) {
            return this.attribs[name].value;
          } else {
            return null;
          }
        };
        XMLElement2.prototype.setAttribute = function(name, value) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLElement2.prototype.getAttributeNode = function(name) {
          if (this.attribs.hasOwnProperty(name)) {
            return this.attribs[name];
          } else {
            return null;
          }
        };
        XMLElement2.prototype.setAttributeNode = function(newAttr) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLElement2.prototype.removeAttributeNode = function(oldAttr) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLElement2.prototype.getElementsByTagName = function(name) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLElement2.prototype.getAttributeNS = function(namespaceURI, localName) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLElement2.prototype.setAttributeNS = function(namespaceURI, qualifiedName, value) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLElement2.prototype.removeAttributeNS = function(namespaceURI, localName) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLElement2.prototype.getAttributeNodeNS = function(namespaceURI, localName) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLElement2.prototype.setAttributeNodeNS = function(newAttr) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLElement2.prototype.getElementsByTagNameNS = function(namespaceURI, localName) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLElement2.prototype.hasAttribute = function(name) {
          return this.attribs.hasOwnProperty(name);
        };
        XMLElement2.prototype.hasAttributeNS = function(namespaceURI, localName) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLElement2.prototype.setIdAttribute = function(name, isId) {
          if (this.attribs.hasOwnProperty(name)) {
            return this.attribs[name].isId;
          } else {
            return isId;
          }
        };
        XMLElement2.prototype.setIdAttributeNS = function(namespaceURI, localName, isId) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLElement2.prototype.setIdAttributeNode = function(idAttr, isId) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLElement2.prototype.getElementsByTagName = function(tagname) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLElement2.prototype.getElementsByTagNameNS = function(namespaceURI, localName) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLElement2.prototype.getElementsByClassName = function(classNames) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLElement2.prototype.isEqualNode = function(node) {
          var i, j, ref1;
          if (!XMLElement2.__super__.isEqualNode.apply(this, arguments).isEqualNode(node)) {
            return false;
          }
          if (node.namespaceURI !== this.namespaceURI) {
            return false;
          }
          if (node.prefix !== this.prefix) {
            return false;
          }
          if (node.localName !== this.localName) {
            return false;
          }
          if (node.attribs.length !== this.attribs.length) {
            return false;
          }
          for (i = j = 0, ref1 = this.attribs.length - 1; 0 <= ref1 ? j <= ref1 : j >= ref1; i = 0 <= ref1 ? ++j : --j) {
            if (!this.attribs[i].isEqualNode(node.attribs[i])) {
              return false;
            }
          }
          return true;
        };
        return XMLElement2;
      })(XMLNode);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLCharacterData.js
var require_XMLCharacterData = __commonJS({
  "node_modules/xmlbuilder/lib/XMLCharacterData.js"(exports2, module2) {
    (function() {
      var XMLCharacterData, XMLNode, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      XMLNode = require_XMLNode();
      module2.exports = XMLCharacterData = (function(superClass) {
        extend(XMLCharacterData2, superClass);
        function XMLCharacterData2(parent) {
          XMLCharacterData2.__super__.constructor.call(this, parent);
          this.value = "";
        }
        Object.defineProperty(XMLCharacterData2.prototype, "data", {
          get: function() {
            return this.value;
          },
          set: function(value) {
            return this.value = value || "";
          }
        });
        Object.defineProperty(XMLCharacterData2.prototype, "length", {
          get: function() {
            return this.value.length;
          }
        });
        Object.defineProperty(XMLCharacterData2.prototype, "textContent", {
          get: function() {
            return this.value;
          },
          set: function(value) {
            return this.value = value || "";
          }
        });
        XMLCharacterData2.prototype.clone = function() {
          return Object.create(this);
        };
        XMLCharacterData2.prototype.substringData = function(offset, count) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLCharacterData2.prototype.appendData = function(arg) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLCharacterData2.prototype.insertData = function(offset, arg) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLCharacterData2.prototype.deleteData = function(offset, count) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLCharacterData2.prototype.replaceData = function(offset, count, arg) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLCharacterData2.prototype.isEqualNode = function(node) {
          if (!XMLCharacterData2.__super__.isEqualNode.apply(this, arguments).isEqualNode(node)) {
            return false;
          }
          if (node.data !== this.data) {
            return false;
          }
          return true;
        };
        return XMLCharacterData2;
      })(XMLNode);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLCData.js
var require_XMLCData = __commonJS({
  "node_modules/xmlbuilder/lib/XMLCData.js"(exports2, module2) {
    (function() {
      var NodeType, XMLCData, XMLCharacterData, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      NodeType = require_NodeType();
      XMLCharacterData = require_XMLCharacterData();
      module2.exports = XMLCData = (function(superClass) {
        extend(XMLCData2, superClass);
        function XMLCData2(parent, text) {
          XMLCData2.__super__.constructor.call(this, parent);
          if (text == null) {
            throw new Error("Missing CDATA text. " + this.debugInfo());
          }
          this.name = "#cdata-section";
          this.type = NodeType.CData;
          this.value = this.stringify.cdata(text);
        }
        XMLCData2.prototype.clone = function() {
          return Object.create(this);
        };
        XMLCData2.prototype.toString = function(options2) {
          return this.options.writer.cdata(this, this.options.writer.filterOptions(options2));
        };
        return XMLCData2;
      })(XMLCharacterData);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLComment.js
var require_XMLComment = __commonJS({
  "node_modules/xmlbuilder/lib/XMLComment.js"(exports2, module2) {
    (function() {
      var NodeType, XMLCharacterData, XMLComment, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      NodeType = require_NodeType();
      XMLCharacterData = require_XMLCharacterData();
      module2.exports = XMLComment = (function(superClass) {
        extend(XMLComment2, superClass);
        function XMLComment2(parent, text) {
          XMLComment2.__super__.constructor.call(this, parent);
          if (text == null) {
            throw new Error("Missing comment text. " + this.debugInfo());
          }
          this.name = "#comment";
          this.type = NodeType.Comment;
          this.value = this.stringify.comment(text);
        }
        XMLComment2.prototype.clone = function() {
          return Object.create(this);
        };
        XMLComment2.prototype.toString = function(options2) {
          return this.options.writer.comment(this, this.options.writer.filterOptions(options2));
        };
        return XMLComment2;
      })(XMLCharacterData);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLDeclaration.js
var require_XMLDeclaration = __commonJS({
  "node_modules/xmlbuilder/lib/XMLDeclaration.js"(exports2, module2) {
    (function() {
      var NodeType, XMLDeclaration, XMLNode, isObject, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      isObject = require_Utility().isObject;
      XMLNode = require_XMLNode();
      NodeType = require_NodeType();
      module2.exports = XMLDeclaration = (function(superClass) {
        extend(XMLDeclaration2, superClass);
        function XMLDeclaration2(parent, version, encoding, standalone) {
          var ref;
          XMLDeclaration2.__super__.constructor.call(this, parent);
          if (isObject(version)) {
            ref = version, version = ref.version, encoding = ref.encoding, standalone = ref.standalone;
          }
          if (!version) {
            version = "1.0";
          }
          this.type = NodeType.Declaration;
          this.version = this.stringify.xmlVersion(version);
          if (encoding != null) {
            this.encoding = this.stringify.xmlEncoding(encoding);
          }
          if (standalone != null) {
            this.standalone = this.stringify.xmlStandalone(standalone);
          }
        }
        XMLDeclaration2.prototype.toString = function(options2) {
          return this.options.writer.declaration(this, this.options.writer.filterOptions(options2));
        };
        return XMLDeclaration2;
      })(XMLNode);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLDTDAttList.js
var require_XMLDTDAttList = __commonJS({
  "node_modules/xmlbuilder/lib/XMLDTDAttList.js"(exports2, module2) {
    (function() {
      var NodeType, XMLDTDAttList, XMLNode, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      XMLNode = require_XMLNode();
      NodeType = require_NodeType();
      module2.exports = XMLDTDAttList = (function(superClass) {
        extend(XMLDTDAttList2, superClass);
        function XMLDTDAttList2(parent, elementName, attributeName, attributeType, defaultValueType, defaultValue) {
          XMLDTDAttList2.__super__.constructor.call(this, parent);
          if (elementName == null) {
            throw new Error("Missing DTD element name. " + this.debugInfo());
          }
          if (attributeName == null) {
            throw new Error("Missing DTD attribute name. " + this.debugInfo(elementName));
          }
          if (!attributeType) {
            throw new Error("Missing DTD attribute type. " + this.debugInfo(elementName));
          }
          if (!defaultValueType) {
            throw new Error("Missing DTD attribute default. " + this.debugInfo(elementName));
          }
          if (defaultValueType.indexOf("#") !== 0) {
            defaultValueType = "#" + defaultValueType;
          }
          if (!defaultValueType.match(/^(#REQUIRED|#IMPLIED|#FIXED|#DEFAULT)$/)) {
            throw new Error("Invalid default value type; expected: #REQUIRED, #IMPLIED, #FIXED or #DEFAULT. " + this.debugInfo(elementName));
          }
          if (defaultValue && !defaultValueType.match(/^(#FIXED|#DEFAULT)$/)) {
            throw new Error("Default value only applies to #FIXED or #DEFAULT. " + this.debugInfo(elementName));
          }
          this.elementName = this.stringify.name(elementName);
          this.type = NodeType.AttributeDeclaration;
          this.attributeName = this.stringify.name(attributeName);
          this.attributeType = this.stringify.dtdAttType(attributeType);
          if (defaultValue) {
            this.defaultValue = this.stringify.dtdAttDefault(defaultValue);
          }
          this.defaultValueType = defaultValueType;
        }
        XMLDTDAttList2.prototype.toString = function(options2) {
          return this.options.writer.dtdAttList(this, this.options.writer.filterOptions(options2));
        };
        return XMLDTDAttList2;
      })(XMLNode);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLDTDEntity.js
var require_XMLDTDEntity = __commonJS({
  "node_modules/xmlbuilder/lib/XMLDTDEntity.js"(exports2, module2) {
    (function() {
      var NodeType, XMLDTDEntity, XMLNode, isObject, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      isObject = require_Utility().isObject;
      XMLNode = require_XMLNode();
      NodeType = require_NodeType();
      module2.exports = XMLDTDEntity = (function(superClass) {
        extend(XMLDTDEntity2, superClass);
        function XMLDTDEntity2(parent, pe, name, value) {
          XMLDTDEntity2.__super__.constructor.call(this, parent);
          if (name == null) {
            throw new Error("Missing DTD entity name. " + this.debugInfo(name));
          }
          if (value == null) {
            throw new Error("Missing DTD entity value. " + this.debugInfo(name));
          }
          this.pe = !!pe;
          this.name = this.stringify.name(name);
          this.type = NodeType.EntityDeclaration;
          if (!isObject(value)) {
            this.value = this.stringify.dtdEntityValue(value);
            this.internal = true;
          } else {
            if (!value.pubID && !value.sysID) {
              throw new Error("Public and/or system identifiers are required for an external entity. " + this.debugInfo(name));
            }
            if (value.pubID && !value.sysID) {
              throw new Error("System identifier is required for a public external entity. " + this.debugInfo(name));
            }
            this.internal = false;
            if (value.pubID != null) {
              this.pubID = this.stringify.dtdPubID(value.pubID);
            }
            if (value.sysID != null) {
              this.sysID = this.stringify.dtdSysID(value.sysID);
            }
            if (value.nData != null) {
              this.nData = this.stringify.dtdNData(value.nData);
            }
            if (this.pe && this.nData) {
              throw new Error("Notation declaration is not allowed in a parameter entity. " + this.debugInfo(name));
            }
          }
        }
        Object.defineProperty(XMLDTDEntity2.prototype, "publicId", {
          get: function() {
            return this.pubID;
          }
        });
        Object.defineProperty(XMLDTDEntity2.prototype, "systemId", {
          get: function() {
            return this.sysID;
          }
        });
        Object.defineProperty(XMLDTDEntity2.prototype, "notationName", {
          get: function() {
            return this.nData || null;
          }
        });
        Object.defineProperty(XMLDTDEntity2.prototype, "inputEncoding", {
          get: function() {
            return null;
          }
        });
        Object.defineProperty(XMLDTDEntity2.prototype, "xmlEncoding", {
          get: function() {
            return null;
          }
        });
        Object.defineProperty(XMLDTDEntity2.prototype, "xmlVersion", {
          get: function() {
            return null;
          }
        });
        XMLDTDEntity2.prototype.toString = function(options2) {
          return this.options.writer.dtdEntity(this, this.options.writer.filterOptions(options2));
        };
        return XMLDTDEntity2;
      })(XMLNode);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLDTDElement.js
var require_XMLDTDElement = __commonJS({
  "node_modules/xmlbuilder/lib/XMLDTDElement.js"(exports2, module2) {
    (function() {
      var NodeType, XMLDTDElement, XMLNode, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      XMLNode = require_XMLNode();
      NodeType = require_NodeType();
      module2.exports = XMLDTDElement = (function(superClass) {
        extend(XMLDTDElement2, superClass);
        function XMLDTDElement2(parent, name, value) {
          XMLDTDElement2.__super__.constructor.call(this, parent);
          if (name == null) {
            throw new Error("Missing DTD element name. " + this.debugInfo());
          }
          if (!value) {
            value = "(#PCDATA)";
          }
          if (Array.isArray(value)) {
            value = "(" + value.join(",") + ")";
          }
          this.name = this.stringify.name(name);
          this.type = NodeType.ElementDeclaration;
          this.value = this.stringify.dtdElementValue(value);
        }
        XMLDTDElement2.prototype.toString = function(options2) {
          return this.options.writer.dtdElement(this, this.options.writer.filterOptions(options2));
        };
        return XMLDTDElement2;
      })(XMLNode);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLDTDNotation.js
var require_XMLDTDNotation = __commonJS({
  "node_modules/xmlbuilder/lib/XMLDTDNotation.js"(exports2, module2) {
    (function() {
      var NodeType, XMLDTDNotation, XMLNode, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      XMLNode = require_XMLNode();
      NodeType = require_NodeType();
      module2.exports = XMLDTDNotation = (function(superClass) {
        extend(XMLDTDNotation2, superClass);
        function XMLDTDNotation2(parent, name, value) {
          XMLDTDNotation2.__super__.constructor.call(this, parent);
          if (name == null) {
            throw new Error("Missing DTD notation name. " + this.debugInfo(name));
          }
          if (!value.pubID && !value.sysID) {
            throw new Error("Public or system identifiers are required for an external entity. " + this.debugInfo(name));
          }
          this.name = this.stringify.name(name);
          this.type = NodeType.NotationDeclaration;
          if (value.pubID != null) {
            this.pubID = this.stringify.dtdPubID(value.pubID);
          }
          if (value.sysID != null) {
            this.sysID = this.stringify.dtdSysID(value.sysID);
          }
        }
        Object.defineProperty(XMLDTDNotation2.prototype, "publicId", {
          get: function() {
            return this.pubID;
          }
        });
        Object.defineProperty(XMLDTDNotation2.prototype, "systemId", {
          get: function() {
            return this.sysID;
          }
        });
        XMLDTDNotation2.prototype.toString = function(options2) {
          return this.options.writer.dtdNotation(this, this.options.writer.filterOptions(options2));
        };
        return XMLDTDNotation2;
      })(XMLNode);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLDocType.js
var require_XMLDocType = __commonJS({
  "node_modules/xmlbuilder/lib/XMLDocType.js"(exports2, module2) {
    (function() {
      var NodeType, XMLDTDAttList, XMLDTDElement, XMLDTDEntity, XMLDTDNotation, XMLDocType, XMLNamedNodeMap, XMLNode, isObject, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      isObject = require_Utility().isObject;
      XMLNode = require_XMLNode();
      NodeType = require_NodeType();
      XMLDTDAttList = require_XMLDTDAttList();
      XMLDTDEntity = require_XMLDTDEntity();
      XMLDTDElement = require_XMLDTDElement();
      XMLDTDNotation = require_XMLDTDNotation();
      XMLNamedNodeMap = require_XMLNamedNodeMap();
      module2.exports = XMLDocType = (function(superClass) {
        extend(XMLDocType2, superClass);
        function XMLDocType2(parent, pubID, sysID) {
          var child, i, len, ref, ref1, ref2;
          XMLDocType2.__super__.constructor.call(this, parent);
          this.type = NodeType.DocType;
          if (parent.children) {
            ref = parent.children;
            for (i = 0, len = ref.length; i < len; i++) {
              child = ref[i];
              if (child.type === NodeType.Element) {
                this.name = child.name;
                break;
              }
            }
          }
          this.documentObject = parent;
          if (isObject(pubID)) {
            ref1 = pubID, pubID = ref1.pubID, sysID = ref1.sysID;
          }
          if (sysID == null) {
            ref2 = [pubID, sysID], sysID = ref2[0], pubID = ref2[1];
          }
          if (pubID != null) {
            this.pubID = this.stringify.dtdPubID(pubID);
          }
          if (sysID != null) {
            this.sysID = this.stringify.dtdSysID(sysID);
          }
        }
        Object.defineProperty(XMLDocType2.prototype, "entities", {
          get: function() {
            var child, i, len, nodes, ref;
            nodes = {};
            ref = this.children;
            for (i = 0, len = ref.length; i < len; i++) {
              child = ref[i];
              if (child.type === NodeType.EntityDeclaration && !child.pe) {
                nodes[child.name] = child;
              }
            }
            return new XMLNamedNodeMap(nodes);
          }
        });
        Object.defineProperty(XMLDocType2.prototype, "notations", {
          get: function() {
            var child, i, len, nodes, ref;
            nodes = {};
            ref = this.children;
            for (i = 0, len = ref.length; i < len; i++) {
              child = ref[i];
              if (child.type === NodeType.NotationDeclaration) {
                nodes[child.name] = child;
              }
            }
            return new XMLNamedNodeMap(nodes);
          }
        });
        Object.defineProperty(XMLDocType2.prototype, "publicId", {
          get: function() {
            return this.pubID;
          }
        });
        Object.defineProperty(XMLDocType2.prototype, "systemId", {
          get: function() {
            return this.sysID;
          }
        });
        Object.defineProperty(XMLDocType2.prototype, "internalSubset", {
          get: function() {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
        });
        XMLDocType2.prototype.element = function(name, value) {
          var child;
          child = new XMLDTDElement(this, name, value);
          this.children.push(child);
          return this;
        };
        XMLDocType2.prototype.attList = function(elementName, attributeName, attributeType, defaultValueType, defaultValue) {
          var child;
          child = new XMLDTDAttList(this, elementName, attributeName, attributeType, defaultValueType, defaultValue);
          this.children.push(child);
          return this;
        };
        XMLDocType2.prototype.entity = function(name, value) {
          var child;
          child = new XMLDTDEntity(this, false, name, value);
          this.children.push(child);
          return this;
        };
        XMLDocType2.prototype.pEntity = function(name, value) {
          var child;
          child = new XMLDTDEntity(this, true, name, value);
          this.children.push(child);
          return this;
        };
        XMLDocType2.prototype.notation = function(name, value) {
          var child;
          child = new XMLDTDNotation(this, name, value);
          this.children.push(child);
          return this;
        };
        XMLDocType2.prototype.toString = function(options2) {
          return this.options.writer.docType(this, this.options.writer.filterOptions(options2));
        };
        XMLDocType2.prototype.ele = function(name, value) {
          return this.element(name, value);
        };
        XMLDocType2.prototype.att = function(elementName, attributeName, attributeType, defaultValueType, defaultValue) {
          return this.attList(elementName, attributeName, attributeType, defaultValueType, defaultValue);
        };
        XMLDocType2.prototype.ent = function(name, value) {
          return this.entity(name, value);
        };
        XMLDocType2.prototype.pent = function(name, value) {
          return this.pEntity(name, value);
        };
        XMLDocType2.prototype.not = function(name, value) {
          return this.notation(name, value);
        };
        XMLDocType2.prototype.up = function() {
          return this.root() || this.documentObject;
        };
        XMLDocType2.prototype.isEqualNode = function(node) {
          if (!XMLDocType2.__super__.isEqualNode.apply(this, arguments).isEqualNode(node)) {
            return false;
          }
          if (node.name !== this.name) {
            return false;
          }
          if (node.publicId !== this.publicId) {
            return false;
          }
          if (node.systemId !== this.systemId) {
            return false;
          }
          return true;
        };
        return XMLDocType2;
      })(XMLNode);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLRaw.js
var require_XMLRaw = __commonJS({
  "node_modules/xmlbuilder/lib/XMLRaw.js"(exports2, module2) {
    (function() {
      var NodeType, XMLNode, XMLRaw, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      NodeType = require_NodeType();
      XMLNode = require_XMLNode();
      module2.exports = XMLRaw = (function(superClass) {
        extend(XMLRaw2, superClass);
        function XMLRaw2(parent, text) {
          XMLRaw2.__super__.constructor.call(this, parent);
          if (text == null) {
            throw new Error("Missing raw text. " + this.debugInfo());
          }
          this.type = NodeType.Raw;
          this.value = this.stringify.raw(text);
        }
        XMLRaw2.prototype.clone = function() {
          return Object.create(this);
        };
        XMLRaw2.prototype.toString = function(options2) {
          return this.options.writer.raw(this, this.options.writer.filterOptions(options2));
        };
        return XMLRaw2;
      })(XMLNode);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLText.js
var require_XMLText = __commonJS({
  "node_modules/xmlbuilder/lib/XMLText.js"(exports2, module2) {
    (function() {
      var NodeType, XMLCharacterData, XMLText, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      NodeType = require_NodeType();
      XMLCharacterData = require_XMLCharacterData();
      module2.exports = XMLText = (function(superClass) {
        extend(XMLText2, superClass);
        function XMLText2(parent, text) {
          XMLText2.__super__.constructor.call(this, parent);
          if (text == null) {
            throw new Error("Missing element text. " + this.debugInfo());
          }
          this.name = "#text";
          this.type = NodeType.Text;
          this.value = this.stringify.text(text);
        }
        Object.defineProperty(XMLText2.prototype, "isElementContentWhitespace", {
          get: function() {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
        });
        Object.defineProperty(XMLText2.prototype, "wholeText", {
          get: function() {
            var next, prev, str;
            str = "";
            prev = this.previousSibling;
            while (prev) {
              str = prev.data + str;
              prev = prev.previousSibling;
            }
            str += this.data;
            next = this.nextSibling;
            while (next) {
              str = str + next.data;
              next = next.nextSibling;
            }
            return str;
          }
        });
        XMLText2.prototype.clone = function() {
          return Object.create(this);
        };
        XMLText2.prototype.toString = function(options2) {
          return this.options.writer.text(this, this.options.writer.filterOptions(options2));
        };
        XMLText2.prototype.splitText = function(offset) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLText2.prototype.replaceWholeText = function(content) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        return XMLText2;
      })(XMLCharacterData);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLProcessingInstruction.js
var require_XMLProcessingInstruction = __commonJS({
  "node_modules/xmlbuilder/lib/XMLProcessingInstruction.js"(exports2, module2) {
    (function() {
      var NodeType, XMLCharacterData, XMLProcessingInstruction, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      NodeType = require_NodeType();
      XMLCharacterData = require_XMLCharacterData();
      module2.exports = XMLProcessingInstruction = (function(superClass) {
        extend(XMLProcessingInstruction2, superClass);
        function XMLProcessingInstruction2(parent, target, value) {
          XMLProcessingInstruction2.__super__.constructor.call(this, parent);
          if (target == null) {
            throw new Error("Missing instruction target. " + this.debugInfo());
          }
          this.type = NodeType.ProcessingInstruction;
          this.target = this.stringify.insTarget(target);
          this.name = this.target;
          if (value) {
            this.value = this.stringify.insValue(value);
          }
        }
        XMLProcessingInstruction2.prototype.clone = function() {
          return Object.create(this);
        };
        XMLProcessingInstruction2.prototype.toString = function(options2) {
          return this.options.writer.processingInstruction(this, this.options.writer.filterOptions(options2));
        };
        XMLProcessingInstruction2.prototype.isEqualNode = function(node) {
          if (!XMLProcessingInstruction2.__super__.isEqualNode.apply(this, arguments).isEqualNode(node)) {
            return false;
          }
          if (node.target !== this.target) {
            return false;
          }
          return true;
        };
        return XMLProcessingInstruction2;
      })(XMLCharacterData);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLDummy.js
var require_XMLDummy = __commonJS({
  "node_modules/xmlbuilder/lib/XMLDummy.js"(exports2, module2) {
    (function() {
      var NodeType, XMLDummy, XMLNode, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      XMLNode = require_XMLNode();
      NodeType = require_NodeType();
      module2.exports = XMLDummy = (function(superClass) {
        extend(XMLDummy2, superClass);
        function XMLDummy2(parent) {
          XMLDummy2.__super__.constructor.call(this, parent);
          this.type = NodeType.Dummy;
        }
        XMLDummy2.prototype.clone = function() {
          return Object.create(this);
        };
        XMLDummy2.prototype.toString = function(options2) {
          return "";
        };
        return XMLDummy2;
      })(XMLNode);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLNodeList.js
var require_XMLNodeList = __commonJS({
  "node_modules/xmlbuilder/lib/XMLNodeList.js"(exports2, module2) {
    (function() {
      var XMLNodeList;
      module2.exports = XMLNodeList = (function() {
        function XMLNodeList2(nodes) {
          this.nodes = nodes;
        }
        Object.defineProperty(XMLNodeList2.prototype, "length", {
          get: function() {
            return this.nodes.length || 0;
          }
        });
        XMLNodeList2.prototype.clone = function() {
          return this.nodes = null;
        };
        XMLNodeList2.prototype.item = function(index) {
          return this.nodes[index] || null;
        };
        return XMLNodeList2;
      })();
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/DocumentPosition.js
var require_DocumentPosition = __commonJS({
  "node_modules/xmlbuilder/lib/DocumentPosition.js"(exports2, module2) {
    (function() {
      module2.exports = {
        Disconnected: 1,
        Preceding: 2,
        Following: 4,
        Contains: 8,
        ContainedBy: 16,
        ImplementationSpecific: 32
      };
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLNode.js
var require_XMLNode = __commonJS({
  "node_modules/xmlbuilder/lib/XMLNode.js"(exports2, module2) {
    (function() {
      var DocumentPosition, NodeType, XMLCData, XMLComment, XMLDeclaration, XMLDocType, XMLDummy, XMLElement, XMLNamedNodeMap, XMLNode, XMLNodeList, XMLProcessingInstruction, XMLRaw, XMLText, getValue, isEmpty, isFunction, isObject, ref1, hasProp = {}.hasOwnProperty;
      ref1 = require_Utility(), isObject = ref1.isObject, isFunction = ref1.isFunction, isEmpty = ref1.isEmpty, getValue = ref1.getValue;
      XMLElement = null;
      XMLCData = null;
      XMLComment = null;
      XMLDeclaration = null;
      XMLDocType = null;
      XMLRaw = null;
      XMLText = null;
      XMLProcessingInstruction = null;
      XMLDummy = null;
      NodeType = null;
      XMLNodeList = null;
      XMLNamedNodeMap = null;
      DocumentPosition = null;
      module2.exports = XMLNode = (function() {
        function XMLNode2(parent1) {
          this.parent = parent1;
          if (this.parent) {
            this.options = this.parent.options;
            this.stringify = this.parent.stringify;
          }
          this.value = null;
          this.children = [];
          this.baseURI = null;
          if (!XMLElement) {
            XMLElement = require_XMLElement();
            XMLCData = require_XMLCData();
            XMLComment = require_XMLComment();
            XMLDeclaration = require_XMLDeclaration();
            XMLDocType = require_XMLDocType();
            XMLRaw = require_XMLRaw();
            XMLText = require_XMLText();
            XMLProcessingInstruction = require_XMLProcessingInstruction();
            XMLDummy = require_XMLDummy();
            NodeType = require_NodeType();
            XMLNodeList = require_XMLNodeList();
            XMLNamedNodeMap = require_XMLNamedNodeMap();
            DocumentPosition = require_DocumentPosition();
          }
        }
        Object.defineProperty(XMLNode2.prototype, "nodeName", {
          get: function() {
            return this.name;
          }
        });
        Object.defineProperty(XMLNode2.prototype, "nodeType", {
          get: function() {
            return this.type;
          }
        });
        Object.defineProperty(XMLNode2.prototype, "nodeValue", {
          get: function() {
            return this.value;
          }
        });
        Object.defineProperty(XMLNode2.prototype, "parentNode", {
          get: function() {
            return this.parent;
          }
        });
        Object.defineProperty(XMLNode2.prototype, "childNodes", {
          get: function() {
            if (!this.childNodeList || !this.childNodeList.nodes) {
              this.childNodeList = new XMLNodeList(this.children);
            }
            return this.childNodeList;
          }
        });
        Object.defineProperty(XMLNode2.prototype, "firstChild", {
          get: function() {
            return this.children[0] || null;
          }
        });
        Object.defineProperty(XMLNode2.prototype, "lastChild", {
          get: function() {
            return this.children[this.children.length - 1] || null;
          }
        });
        Object.defineProperty(XMLNode2.prototype, "previousSibling", {
          get: function() {
            var i;
            i = this.parent.children.indexOf(this);
            return this.parent.children[i - 1] || null;
          }
        });
        Object.defineProperty(XMLNode2.prototype, "nextSibling", {
          get: function() {
            var i;
            i = this.parent.children.indexOf(this);
            return this.parent.children[i + 1] || null;
          }
        });
        Object.defineProperty(XMLNode2.prototype, "ownerDocument", {
          get: function() {
            return this.document() || null;
          }
        });
        Object.defineProperty(XMLNode2.prototype, "textContent", {
          get: function() {
            var child, j, len, ref2, str;
            if (this.nodeType === NodeType.Element || this.nodeType === NodeType.DocumentFragment) {
              str = "";
              ref2 = this.children;
              for (j = 0, len = ref2.length; j < len; j++) {
                child = ref2[j];
                if (child.textContent) {
                  str += child.textContent;
                }
              }
              return str;
            } else {
              return null;
            }
          },
          set: function(value) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
        });
        XMLNode2.prototype.setParent = function(parent) {
          var child, j, len, ref2, results;
          this.parent = parent;
          if (parent) {
            this.options = parent.options;
            this.stringify = parent.stringify;
          }
          ref2 = this.children;
          results = [];
          for (j = 0, len = ref2.length; j < len; j++) {
            child = ref2[j];
            results.push(child.setParent(this));
          }
          return results;
        };
        XMLNode2.prototype.element = function(name, attributes, text) {
          var childNode, item, j, k, key, lastChild, len, len1, ref2, ref3, val;
          lastChild = null;
          if (attributes === null && text == null) {
            ref2 = [{}, null], attributes = ref2[0], text = ref2[1];
          }
          if (attributes == null) {
            attributes = {};
          }
          attributes = getValue(attributes);
          if (!isObject(attributes)) {
            ref3 = [attributes, text], text = ref3[0], attributes = ref3[1];
          }
          if (name != null) {
            name = getValue(name);
          }
          if (Array.isArray(name)) {
            for (j = 0, len = name.length; j < len; j++) {
              item = name[j];
              lastChild = this.element(item);
            }
          } else if (isFunction(name)) {
            lastChild = this.element(name.apply());
          } else if (isObject(name)) {
            for (key in name) {
              if (!hasProp.call(name, key)) continue;
              val = name[key];
              if (isFunction(val)) {
                val = val.apply();
              }
              if (!this.options.ignoreDecorators && this.stringify.convertAttKey && key.indexOf(this.stringify.convertAttKey) === 0) {
                lastChild = this.attribute(key.substr(this.stringify.convertAttKey.length), val);
              } else if (!this.options.separateArrayItems && Array.isArray(val) && isEmpty(val)) {
                lastChild = this.dummy();
              } else if (isObject(val) && isEmpty(val)) {
                lastChild = this.element(key);
              } else if (!this.options.keepNullNodes && val == null) {
                lastChild = this.dummy();
              } else if (!this.options.separateArrayItems && Array.isArray(val)) {
                for (k = 0, len1 = val.length; k < len1; k++) {
                  item = val[k];
                  childNode = {};
                  childNode[key] = item;
                  lastChild = this.element(childNode);
                }
              } else if (isObject(val)) {
                if (!this.options.ignoreDecorators && this.stringify.convertTextKey && key.indexOf(this.stringify.convertTextKey) === 0) {
                  lastChild = this.element(val);
                } else {
                  lastChild = this.element(key);
                  lastChild.element(val);
                }
              } else {
                lastChild = this.element(key, val);
              }
            }
          } else if (!this.options.keepNullNodes && text === null) {
            lastChild = this.dummy();
          } else {
            if (!this.options.ignoreDecorators && this.stringify.convertTextKey && name.indexOf(this.stringify.convertTextKey) === 0) {
              lastChild = this.text(text);
            } else if (!this.options.ignoreDecorators && this.stringify.convertCDataKey && name.indexOf(this.stringify.convertCDataKey) === 0) {
              lastChild = this.cdata(text);
            } else if (!this.options.ignoreDecorators && this.stringify.convertCommentKey && name.indexOf(this.stringify.convertCommentKey) === 0) {
              lastChild = this.comment(text);
            } else if (!this.options.ignoreDecorators && this.stringify.convertRawKey && name.indexOf(this.stringify.convertRawKey) === 0) {
              lastChild = this.raw(text);
            } else if (!this.options.ignoreDecorators && this.stringify.convertPIKey && name.indexOf(this.stringify.convertPIKey) === 0) {
              lastChild = this.instruction(name.substr(this.stringify.convertPIKey.length), text);
            } else {
              lastChild = this.node(name, attributes, text);
            }
          }
          if (lastChild == null) {
            throw new Error("Could not create any elements with: " + name + ". " + this.debugInfo());
          }
          return lastChild;
        };
        XMLNode2.prototype.insertBefore = function(name, attributes, text) {
          var child, i, newChild, refChild, removed;
          if (name != null ? name.type : void 0) {
            newChild = name;
            refChild = attributes;
            newChild.setParent(this);
            if (refChild) {
              i = children.indexOf(refChild);
              removed = children.splice(i);
              children.push(newChild);
              Array.prototype.push.apply(children, removed);
            } else {
              children.push(newChild);
            }
            return newChild;
          } else {
            if (this.isRoot) {
              throw new Error("Cannot insert elements at root level. " + this.debugInfo(name));
            }
            i = this.parent.children.indexOf(this);
            removed = this.parent.children.splice(i);
            child = this.parent.element(name, attributes, text);
            Array.prototype.push.apply(this.parent.children, removed);
            return child;
          }
        };
        XMLNode2.prototype.insertAfter = function(name, attributes, text) {
          var child, i, removed;
          if (this.isRoot) {
            throw new Error("Cannot insert elements at root level. " + this.debugInfo(name));
          }
          i = this.parent.children.indexOf(this);
          removed = this.parent.children.splice(i + 1);
          child = this.parent.element(name, attributes, text);
          Array.prototype.push.apply(this.parent.children, removed);
          return child;
        };
        XMLNode2.prototype.remove = function() {
          var i, ref2;
          if (this.isRoot) {
            throw new Error("Cannot remove the root element. " + this.debugInfo());
          }
          i = this.parent.children.indexOf(this);
          [].splice.apply(this.parent.children, [i, i - i + 1].concat(ref2 = [])), ref2;
          return this.parent;
        };
        XMLNode2.prototype.node = function(name, attributes, text) {
          var child, ref2;
          if (name != null) {
            name = getValue(name);
          }
          attributes || (attributes = {});
          attributes = getValue(attributes);
          if (!isObject(attributes)) {
            ref2 = [attributes, text], text = ref2[0], attributes = ref2[1];
          }
          child = new XMLElement(this, name, attributes);
          if (text != null) {
            child.text(text);
          }
          this.children.push(child);
          return child;
        };
        XMLNode2.prototype.text = function(value) {
          var child;
          if (isObject(value)) {
            this.element(value);
          }
          child = new XMLText(this, value);
          this.children.push(child);
          return this;
        };
        XMLNode2.prototype.cdata = function(value) {
          var child;
          child = new XMLCData(this, value);
          this.children.push(child);
          return this;
        };
        XMLNode2.prototype.comment = function(value) {
          var child;
          child = new XMLComment(this, value);
          this.children.push(child);
          return this;
        };
        XMLNode2.prototype.commentBefore = function(value) {
          var child, i, removed;
          i = this.parent.children.indexOf(this);
          removed = this.parent.children.splice(i);
          child = this.parent.comment(value);
          Array.prototype.push.apply(this.parent.children, removed);
          return this;
        };
        XMLNode2.prototype.commentAfter = function(value) {
          var child, i, removed;
          i = this.parent.children.indexOf(this);
          removed = this.parent.children.splice(i + 1);
          child = this.parent.comment(value);
          Array.prototype.push.apply(this.parent.children, removed);
          return this;
        };
        XMLNode2.prototype.raw = function(value) {
          var child;
          child = new XMLRaw(this, value);
          this.children.push(child);
          return this;
        };
        XMLNode2.prototype.dummy = function() {
          var child;
          child = new XMLDummy(this);
          return child;
        };
        XMLNode2.prototype.instruction = function(target, value) {
          var insTarget, insValue, instruction, j, len;
          if (target != null) {
            target = getValue(target);
          }
          if (value != null) {
            value = getValue(value);
          }
          if (Array.isArray(target)) {
            for (j = 0, len = target.length; j < len; j++) {
              insTarget = target[j];
              this.instruction(insTarget);
            }
          } else if (isObject(target)) {
            for (insTarget in target) {
              if (!hasProp.call(target, insTarget)) continue;
              insValue = target[insTarget];
              this.instruction(insTarget, insValue);
            }
          } else {
            if (isFunction(value)) {
              value = value.apply();
            }
            instruction = new XMLProcessingInstruction(this, target, value);
            this.children.push(instruction);
          }
          return this;
        };
        XMLNode2.prototype.instructionBefore = function(target, value) {
          var child, i, removed;
          i = this.parent.children.indexOf(this);
          removed = this.parent.children.splice(i);
          child = this.parent.instruction(target, value);
          Array.prototype.push.apply(this.parent.children, removed);
          return this;
        };
        XMLNode2.prototype.instructionAfter = function(target, value) {
          var child, i, removed;
          i = this.parent.children.indexOf(this);
          removed = this.parent.children.splice(i + 1);
          child = this.parent.instruction(target, value);
          Array.prototype.push.apply(this.parent.children, removed);
          return this;
        };
        XMLNode2.prototype.declaration = function(version, encoding, standalone) {
          var doc, xmldec;
          doc = this.document();
          xmldec = new XMLDeclaration(doc, version, encoding, standalone);
          if (doc.children.length === 0) {
            doc.children.unshift(xmldec);
          } else if (doc.children[0].type === NodeType.Declaration) {
            doc.children[0] = xmldec;
          } else {
            doc.children.unshift(xmldec);
          }
          return doc.root() || doc;
        };
        XMLNode2.prototype.dtd = function(pubID, sysID) {
          var child, doc, doctype, i, j, k, len, len1, ref2, ref3;
          doc = this.document();
          doctype = new XMLDocType(doc, pubID, sysID);
          ref2 = doc.children;
          for (i = j = 0, len = ref2.length; j < len; i = ++j) {
            child = ref2[i];
            if (child.type === NodeType.DocType) {
              doc.children[i] = doctype;
              return doctype;
            }
          }
          ref3 = doc.children;
          for (i = k = 0, len1 = ref3.length; k < len1; i = ++k) {
            child = ref3[i];
            if (child.isRoot) {
              doc.children.splice(i, 0, doctype);
              return doctype;
            }
          }
          doc.children.push(doctype);
          return doctype;
        };
        XMLNode2.prototype.up = function() {
          if (this.isRoot) {
            throw new Error("The root node has no parent. Use doc() if you need to get the document object.");
          }
          return this.parent;
        };
        XMLNode2.prototype.root = function() {
          var node;
          node = this;
          while (node) {
            if (node.type === NodeType.Document) {
              return node.rootObject;
            } else if (node.isRoot) {
              return node;
            } else {
              node = node.parent;
            }
          }
        };
        XMLNode2.prototype.document = function() {
          var node;
          node = this;
          while (node) {
            if (node.type === NodeType.Document) {
              return node;
            } else {
              node = node.parent;
            }
          }
        };
        XMLNode2.prototype.end = function(options2) {
          return this.document().end(options2);
        };
        XMLNode2.prototype.prev = function() {
          var i;
          i = this.parent.children.indexOf(this);
          if (i < 1) {
            throw new Error("Already at the first node. " + this.debugInfo());
          }
          return this.parent.children[i - 1];
        };
        XMLNode2.prototype.next = function() {
          var i;
          i = this.parent.children.indexOf(this);
          if (i === -1 || i === this.parent.children.length - 1) {
            throw new Error("Already at the last node. " + this.debugInfo());
          }
          return this.parent.children[i + 1];
        };
        XMLNode2.prototype.importDocument = function(doc) {
          var clonedRoot;
          clonedRoot = doc.root().clone();
          clonedRoot.parent = this;
          clonedRoot.isRoot = false;
          this.children.push(clonedRoot);
          return this;
        };
        XMLNode2.prototype.debugInfo = function(name) {
          var ref2, ref3;
          name = name || this.name;
          if (name == null && !((ref2 = this.parent) != null ? ref2.name : void 0)) {
            return "";
          } else if (name == null) {
            return "parent: <" + this.parent.name + ">";
          } else if (!((ref3 = this.parent) != null ? ref3.name : void 0)) {
            return "node: <" + name + ">";
          } else {
            return "node: <" + name + ">, parent: <" + this.parent.name + ">";
          }
        };
        XMLNode2.prototype.ele = function(name, attributes, text) {
          return this.element(name, attributes, text);
        };
        XMLNode2.prototype.nod = function(name, attributes, text) {
          return this.node(name, attributes, text);
        };
        XMLNode2.prototype.txt = function(value) {
          return this.text(value);
        };
        XMLNode2.prototype.dat = function(value) {
          return this.cdata(value);
        };
        XMLNode2.prototype.com = function(value) {
          return this.comment(value);
        };
        XMLNode2.prototype.ins = function(target, value) {
          return this.instruction(target, value);
        };
        XMLNode2.prototype.doc = function() {
          return this.document();
        };
        XMLNode2.prototype.dec = function(version, encoding, standalone) {
          return this.declaration(version, encoding, standalone);
        };
        XMLNode2.prototype.e = function(name, attributes, text) {
          return this.element(name, attributes, text);
        };
        XMLNode2.prototype.n = function(name, attributes, text) {
          return this.node(name, attributes, text);
        };
        XMLNode2.prototype.t = function(value) {
          return this.text(value);
        };
        XMLNode2.prototype.d = function(value) {
          return this.cdata(value);
        };
        XMLNode2.prototype.c = function(value) {
          return this.comment(value);
        };
        XMLNode2.prototype.r = function(value) {
          return this.raw(value);
        };
        XMLNode2.prototype.i = function(target, value) {
          return this.instruction(target, value);
        };
        XMLNode2.prototype.u = function() {
          return this.up();
        };
        XMLNode2.prototype.importXMLBuilder = function(doc) {
          return this.importDocument(doc);
        };
        XMLNode2.prototype.replaceChild = function(newChild, oldChild) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLNode2.prototype.removeChild = function(oldChild) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLNode2.prototype.appendChild = function(newChild) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLNode2.prototype.hasChildNodes = function() {
          return this.children.length !== 0;
        };
        XMLNode2.prototype.cloneNode = function(deep) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLNode2.prototype.normalize = function() {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLNode2.prototype.isSupported = function(feature, version) {
          return true;
        };
        XMLNode2.prototype.hasAttributes = function() {
          return this.attribs.length !== 0;
        };
        XMLNode2.prototype.compareDocumentPosition = function(other) {
          var ref, res;
          ref = this;
          if (ref === other) {
            return 0;
          } else if (this.document() !== other.document()) {
            res = DocumentPosition.Disconnected | DocumentPosition.ImplementationSpecific;
            if (Math.random() < 0.5) {
              res |= DocumentPosition.Preceding;
            } else {
              res |= DocumentPosition.Following;
            }
            return res;
          } else if (ref.isAncestor(other)) {
            return DocumentPosition.Contains | DocumentPosition.Preceding;
          } else if (ref.isDescendant(other)) {
            return DocumentPosition.Contains | DocumentPosition.Following;
          } else if (ref.isPreceding(other)) {
            return DocumentPosition.Preceding;
          } else {
            return DocumentPosition.Following;
          }
        };
        XMLNode2.prototype.isSameNode = function(other) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLNode2.prototype.lookupPrefix = function(namespaceURI) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLNode2.prototype.isDefaultNamespace = function(namespaceURI) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLNode2.prototype.lookupNamespaceURI = function(prefix) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLNode2.prototype.isEqualNode = function(node) {
          var i, j, ref2;
          if (node.nodeType !== this.nodeType) {
            return false;
          }
          if (node.children.length !== this.children.length) {
            return false;
          }
          for (i = j = 0, ref2 = this.children.length - 1; 0 <= ref2 ? j <= ref2 : j >= ref2; i = 0 <= ref2 ? ++j : --j) {
            if (!this.children[i].isEqualNode(node.children[i])) {
              return false;
            }
          }
          return true;
        };
        XMLNode2.prototype.getFeature = function(feature, version) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLNode2.prototype.setUserData = function(key, data, handler) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLNode2.prototype.getUserData = function(key) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLNode2.prototype.contains = function(other) {
          if (!other) {
            return false;
          }
          return other === this || this.isDescendant(other);
        };
        XMLNode2.prototype.isDescendant = function(node) {
          var child, isDescendantChild, j, len, ref2;
          ref2 = this.children;
          for (j = 0, len = ref2.length; j < len; j++) {
            child = ref2[j];
            if (node === child) {
              return true;
            }
            isDescendantChild = child.isDescendant(node);
            if (isDescendantChild) {
              return true;
            }
          }
          return false;
        };
        XMLNode2.prototype.isAncestor = function(node) {
          return node.isDescendant(this);
        };
        XMLNode2.prototype.isPreceding = function(node) {
          var nodePos, thisPos;
          nodePos = this.treePosition(node);
          thisPos = this.treePosition(this);
          if (nodePos === -1 || thisPos === -1) {
            return false;
          } else {
            return nodePos < thisPos;
          }
        };
        XMLNode2.prototype.isFollowing = function(node) {
          var nodePos, thisPos;
          nodePos = this.treePosition(node);
          thisPos = this.treePosition(this);
          if (nodePos === -1 || thisPos === -1) {
            return false;
          } else {
            return nodePos > thisPos;
          }
        };
        XMLNode2.prototype.treePosition = function(node) {
          var found, pos;
          pos = 0;
          found = false;
          this.foreachTreeNode(this.document(), function(childNode) {
            pos++;
            if (!found && childNode === node) {
              return found = true;
            }
          });
          if (found) {
            return pos;
          } else {
            return -1;
          }
        };
        XMLNode2.prototype.foreachTreeNode = function(node, func) {
          var child, j, len, ref2, res;
          node || (node = this.document());
          ref2 = node.children;
          for (j = 0, len = ref2.length; j < len; j++) {
            child = ref2[j];
            if (res = func(child)) {
              return res;
            } else {
              res = this.foreachTreeNode(child, func);
              if (res) {
                return res;
              }
            }
          }
        };
        return XMLNode2;
      })();
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLStringifier.js
var require_XMLStringifier = __commonJS({
  "node_modules/xmlbuilder/lib/XMLStringifier.js"(exports2, module2) {
    (function() {
      var XMLStringifier, bind = function(fn, me) {
        return function() {
          return fn.apply(me, arguments);
        };
      }, hasProp = {}.hasOwnProperty;
      module2.exports = XMLStringifier = (function() {
        function XMLStringifier2(options2) {
          this.assertLegalName = bind(this.assertLegalName, this);
          this.assertLegalChar = bind(this.assertLegalChar, this);
          var key, ref, value;
          options2 || (options2 = {});
          this.options = options2;
          if (!this.options.version) {
            this.options.version = "1.0";
          }
          ref = options2.stringify || {};
          for (key in ref) {
            if (!hasProp.call(ref, key)) continue;
            value = ref[key];
            this[key] = value;
          }
        }
        XMLStringifier2.prototype.name = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          return this.assertLegalName("" + val || "");
        };
        XMLStringifier2.prototype.text = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          return this.assertLegalChar(this.textEscape("" + val || ""));
        };
        XMLStringifier2.prototype.cdata = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          val = "" + val || "";
          val = val.replace("]]>", "]]]]><![CDATA[>");
          return this.assertLegalChar(val);
        };
        XMLStringifier2.prototype.comment = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          val = "" + val || "";
          if (val.match(/--/)) {
            throw new Error("Comment text cannot contain double-hypen: " + val);
          }
          return this.assertLegalChar(val);
        };
        XMLStringifier2.prototype.raw = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          return "" + val || "";
        };
        XMLStringifier2.prototype.attValue = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          return this.assertLegalChar(this.attEscape(val = "" + val || ""));
        };
        XMLStringifier2.prototype.insTarget = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          return this.assertLegalChar("" + val || "");
        };
        XMLStringifier2.prototype.insValue = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          val = "" + val || "";
          if (val.match(/\?>/)) {
            throw new Error("Invalid processing instruction value: " + val);
          }
          return this.assertLegalChar(val);
        };
        XMLStringifier2.prototype.xmlVersion = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          val = "" + val || "";
          if (!val.match(/1\.[0-9]+/)) {
            throw new Error("Invalid version number: " + val);
          }
          return val;
        };
        XMLStringifier2.prototype.xmlEncoding = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          val = "" + val || "";
          if (!val.match(/^[A-Za-z](?:[A-Za-z0-9._-])*$/)) {
            throw new Error("Invalid encoding: " + val);
          }
          return this.assertLegalChar(val);
        };
        XMLStringifier2.prototype.xmlStandalone = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          if (val) {
            return "yes";
          } else {
            return "no";
          }
        };
        XMLStringifier2.prototype.dtdPubID = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          return this.assertLegalChar("" + val || "");
        };
        XMLStringifier2.prototype.dtdSysID = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          return this.assertLegalChar("" + val || "");
        };
        XMLStringifier2.prototype.dtdElementValue = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          return this.assertLegalChar("" + val || "");
        };
        XMLStringifier2.prototype.dtdAttType = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          return this.assertLegalChar("" + val || "");
        };
        XMLStringifier2.prototype.dtdAttDefault = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          return this.assertLegalChar("" + val || "");
        };
        XMLStringifier2.prototype.dtdEntityValue = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          return this.assertLegalChar("" + val || "");
        };
        XMLStringifier2.prototype.dtdNData = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          return this.assertLegalChar("" + val || "");
        };
        XMLStringifier2.prototype.convertAttKey = "@";
        XMLStringifier2.prototype.convertPIKey = "?";
        XMLStringifier2.prototype.convertTextKey = "#text";
        XMLStringifier2.prototype.convertCDataKey = "#cdata";
        XMLStringifier2.prototype.convertCommentKey = "#comment";
        XMLStringifier2.prototype.convertRawKey = "#raw";
        XMLStringifier2.prototype.assertLegalChar = function(str) {
          var regex, res;
          if (this.options.noValidation) {
            return str;
          }
          regex = "";
          if (this.options.version === "1.0") {
            regex = /[\0-\x08\x0B\f\x0E-\x1F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
            if (res = str.match(regex)) {
              throw new Error("Invalid character in string: " + str + " at index " + res.index);
            }
          } else if (this.options.version === "1.1") {
            regex = /[\0\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
            if (res = str.match(regex)) {
              throw new Error("Invalid character in string: " + str + " at index " + res.index);
            }
          }
          return str;
        };
        XMLStringifier2.prototype.assertLegalName = function(str) {
          var regex;
          if (this.options.noValidation) {
            return str;
          }
          this.assertLegalChar(str);
          regex = /^([:A-Z_a-z\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])([\x2D\.0-:A-Z_a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*$/;
          if (!str.match(regex)) {
            throw new Error("Invalid character in name");
          }
          return str;
        };
        XMLStringifier2.prototype.textEscape = function(str) {
          var ampregex;
          if (this.options.noValidation) {
            return str;
          }
          ampregex = this.options.noDoubleEncoding ? /(?!&\S+;)&/g : /&/g;
          return str.replace(ampregex, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\r/g, "&#xD;");
        };
        XMLStringifier2.prototype.attEscape = function(str) {
          var ampregex;
          if (this.options.noValidation) {
            return str;
          }
          ampregex = this.options.noDoubleEncoding ? /(?!&\S+;)&/g : /&/g;
          return str.replace(ampregex, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;").replace(/\t/g, "&#x9;").replace(/\n/g, "&#xA;").replace(/\r/g, "&#xD;");
        };
        return XMLStringifier2;
      })();
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/WriterState.js
var require_WriterState = __commonJS({
  "node_modules/xmlbuilder/lib/WriterState.js"(exports2, module2) {
    (function() {
      module2.exports = {
        None: 0,
        OpenTag: 1,
        InsideTag: 2,
        CloseTag: 3
      };
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLWriterBase.js
var require_XMLWriterBase = __commonJS({
  "node_modules/xmlbuilder/lib/XMLWriterBase.js"(exports2, module2) {
    (function() {
      var NodeType, WriterState, XMLCData, XMLComment, XMLDTDAttList, XMLDTDElement, XMLDTDEntity, XMLDTDNotation, XMLDeclaration, XMLDocType, XMLDummy, XMLElement, XMLProcessingInstruction, XMLRaw, XMLText, XMLWriterBase, assign, hasProp = {}.hasOwnProperty;
      assign = require_Utility().assign;
      NodeType = require_NodeType();
      XMLDeclaration = require_XMLDeclaration();
      XMLDocType = require_XMLDocType();
      XMLCData = require_XMLCData();
      XMLComment = require_XMLComment();
      XMLElement = require_XMLElement();
      XMLRaw = require_XMLRaw();
      XMLText = require_XMLText();
      XMLProcessingInstruction = require_XMLProcessingInstruction();
      XMLDummy = require_XMLDummy();
      XMLDTDAttList = require_XMLDTDAttList();
      XMLDTDElement = require_XMLDTDElement();
      XMLDTDEntity = require_XMLDTDEntity();
      XMLDTDNotation = require_XMLDTDNotation();
      WriterState = require_WriterState();
      module2.exports = XMLWriterBase = (function() {
        function XMLWriterBase2(options2) {
          var key, ref, value;
          options2 || (options2 = {});
          this.options = options2;
          ref = options2.writer || {};
          for (key in ref) {
            if (!hasProp.call(ref, key)) continue;
            value = ref[key];
            this["_" + key] = this[key];
            this[key] = value;
          }
        }
        XMLWriterBase2.prototype.filterOptions = function(options2) {
          var filteredOptions, ref, ref1, ref2, ref3, ref4, ref5, ref6;
          options2 || (options2 = {});
          options2 = assign({}, this.options, options2);
          filteredOptions = {
            writer: this
          };
          filteredOptions.pretty = options2.pretty || false;
          filteredOptions.allowEmpty = options2.allowEmpty || false;
          filteredOptions.indent = (ref = options2.indent) != null ? ref : "  ";
          filteredOptions.newline = (ref1 = options2.newline) != null ? ref1 : "\n";
          filteredOptions.offset = (ref2 = options2.offset) != null ? ref2 : 0;
          filteredOptions.dontPrettyTextNodes = (ref3 = (ref4 = options2.dontPrettyTextNodes) != null ? ref4 : options2.dontprettytextnodes) != null ? ref3 : 0;
          filteredOptions.spaceBeforeSlash = (ref5 = (ref6 = options2.spaceBeforeSlash) != null ? ref6 : options2.spacebeforeslash) != null ? ref5 : "";
          if (filteredOptions.spaceBeforeSlash === true) {
            filteredOptions.spaceBeforeSlash = " ";
          }
          filteredOptions.suppressPrettyCount = 0;
          filteredOptions.user = {};
          filteredOptions.state = WriterState.None;
          return filteredOptions;
        };
        XMLWriterBase2.prototype.indent = function(node, options2, level) {
          var indentLevel;
          if (!options2.pretty || options2.suppressPrettyCount) {
            return "";
          } else if (options2.pretty) {
            indentLevel = (level || 0) + options2.offset + 1;
            if (indentLevel > 0) {
              return new Array(indentLevel).join(options2.indent);
            }
          }
          return "";
        };
        XMLWriterBase2.prototype.endline = function(node, options2, level) {
          if (!options2.pretty || options2.suppressPrettyCount) {
            return "";
          } else {
            return options2.newline;
          }
        };
        XMLWriterBase2.prototype.attribute = function(att, options2, level) {
          var r;
          this.openAttribute(att, options2, level);
          r = " " + att.name + '="' + att.value + '"';
          this.closeAttribute(att, options2, level);
          return r;
        };
        XMLWriterBase2.prototype.cdata = function(node, options2, level) {
          var r;
          this.openNode(node, options2, level);
          options2.state = WriterState.OpenTag;
          r = this.indent(node, options2, level) + "<![CDATA[";
          options2.state = WriterState.InsideTag;
          r += node.value;
          options2.state = WriterState.CloseTag;
          r += "]]>" + this.endline(node, options2, level);
          options2.state = WriterState.None;
          this.closeNode(node, options2, level);
          return r;
        };
        XMLWriterBase2.prototype.comment = function(node, options2, level) {
          var r;
          this.openNode(node, options2, level);
          options2.state = WriterState.OpenTag;
          r = this.indent(node, options2, level) + "<!-- ";
          options2.state = WriterState.InsideTag;
          r += node.value;
          options2.state = WriterState.CloseTag;
          r += " -->" + this.endline(node, options2, level);
          options2.state = WriterState.None;
          this.closeNode(node, options2, level);
          return r;
        };
        XMLWriterBase2.prototype.declaration = function(node, options2, level) {
          var r;
          this.openNode(node, options2, level);
          options2.state = WriterState.OpenTag;
          r = this.indent(node, options2, level) + "<?xml";
          options2.state = WriterState.InsideTag;
          r += ' version="' + node.version + '"';
          if (node.encoding != null) {
            r += ' encoding="' + node.encoding + '"';
          }
          if (node.standalone != null) {
            r += ' standalone="' + node.standalone + '"';
          }
          options2.state = WriterState.CloseTag;
          r += options2.spaceBeforeSlash + "?>";
          r += this.endline(node, options2, level);
          options2.state = WriterState.None;
          this.closeNode(node, options2, level);
          return r;
        };
        XMLWriterBase2.prototype.docType = function(node, options2, level) {
          var child, i, len, r, ref;
          level || (level = 0);
          this.openNode(node, options2, level);
          options2.state = WriterState.OpenTag;
          r = this.indent(node, options2, level);
          r += "<!DOCTYPE " + node.root().name;
          if (node.pubID && node.sysID) {
            r += ' PUBLIC "' + node.pubID + '" "' + node.sysID + '"';
          } else if (node.sysID) {
            r += ' SYSTEM "' + node.sysID + '"';
          }
          if (node.children.length > 0) {
            r += " [";
            r += this.endline(node, options2, level);
            options2.state = WriterState.InsideTag;
            ref = node.children;
            for (i = 0, len = ref.length; i < len; i++) {
              child = ref[i];
              r += this.writeChildNode(child, options2, level + 1);
            }
            options2.state = WriterState.CloseTag;
            r += "]";
          }
          options2.state = WriterState.CloseTag;
          r += options2.spaceBeforeSlash + ">";
          r += this.endline(node, options2, level);
          options2.state = WriterState.None;
          this.closeNode(node, options2, level);
          return r;
        };
        XMLWriterBase2.prototype.element = function(node, options2, level) {
          var att, child, childNodeCount, firstChildNode, i, j, len, len1, name, prettySuppressed, r, ref, ref1, ref2;
          level || (level = 0);
          prettySuppressed = false;
          r = "";
          this.openNode(node, options2, level);
          options2.state = WriterState.OpenTag;
          r += this.indent(node, options2, level) + "<" + node.name;
          ref = node.attribs;
          for (name in ref) {
            if (!hasProp.call(ref, name)) continue;
            att = ref[name];
            r += this.attribute(att, options2, level);
          }
          childNodeCount = node.children.length;
          firstChildNode = childNodeCount === 0 ? null : node.children[0];
          if (childNodeCount === 0 || node.children.every(function(e) {
            return (e.type === NodeType.Text || e.type === NodeType.Raw) && e.value === "";
          })) {
            if (options2.allowEmpty) {
              r += ">";
              options2.state = WriterState.CloseTag;
              r += "</" + node.name + ">" + this.endline(node, options2, level);
            } else {
              options2.state = WriterState.CloseTag;
              r += options2.spaceBeforeSlash + "/>" + this.endline(node, options2, level);
            }
          } else if (options2.pretty && childNodeCount === 1 && (firstChildNode.type === NodeType.Text || firstChildNode.type === NodeType.Raw) && firstChildNode.value != null) {
            r += ">";
            options2.state = WriterState.InsideTag;
            options2.suppressPrettyCount++;
            prettySuppressed = true;
            r += this.writeChildNode(firstChildNode, options2, level + 1);
            options2.suppressPrettyCount--;
            prettySuppressed = false;
            options2.state = WriterState.CloseTag;
            r += "</" + node.name + ">" + this.endline(node, options2, level);
          } else {
            if (options2.dontPrettyTextNodes) {
              ref1 = node.children;
              for (i = 0, len = ref1.length; i < len; i++) {
                child = ref1[i];
                if ((child.type === NodeType.Text || child.type === NodeType.Raw) && child.value != null) {
                  options2.suppressPrettyCount++;
                  prettySuppressed = true;
                  break;
                }
              }
            }
            r += ">" + this.endline(node, options2, level);
            options2.state = WriterState.InsideTag;
            ref2 = node.children;
            for (j = 0, len1 = ref2.length; j < len1; j++) {
              child = ref2[j];
              r += this.writeChildNode(child, options2, level + 1);
            }
            options2.state = WriterState.CloseTag;
            r += this.indent(node, options2, level) + "</" + node.name + ">";
            if (prettySuppressed) {
              options2.suppressPrettyCount--;
            }
            r += this.endline(node, options2, level);
            options2.state = WriterState.None;
          }
          this.closeNode(node, options2, level);
          return r;
        };
        XMLWriterBase2.prototype.writeChildNode = function(node, options2, level) {
          switch (node.type) {
            case NodeType.CData:
              return this.cdata(node, options2, level);
            case NodeType.Comment:
              return this.comment(node, options2, level);
            case NodeType.Element:
              return this.element(node, options2, level);
            case NodeType.Raw:
              return this.raw(node, options2, level);
            case NodeType.Text:
              return this.text(node, options2, level);
            case NodeType.ProcessingInstruction:
              return this.processingInstruction(node, options2, level);
            case NodeType.Dummy:
              return "";
            case NodeType.Declaration:
              return this.declaration(node, options2, level);
            case NodeType.DocType:
              return this.docType(node, options2, level);
            case NodeType.AttributeDeclaration:
              return this.dtdAttList(node, options2, level);
            case NodeType.ElementDeclaration:
              return this.dtdElement(node, options2, level);
            case NodeType.EntityDeclaration:
              return this.dtdEntity(node, options2, level);
            case NodeType.NotationDeclaration:
              return this.dtdNotation(node, options2, level);
            default:
              throw new Error("Unknown XML node type: " + node.constructor.name);
          }
        };
        XMLWriterBase2.prototype.processingInstruction = function(node, options2, level) {
          var r;
          this.openNode(node, options2, level);
          options2.state = WriterState.OpenTag;
          r = this.indent(node, options2, level) + "<?";
          options2.state = WriterState.InsideTag;
          r += node.target;
          if (node.value) {
            r += " " + node.value;
          }
          options2.state = WriterState.CloseTag;
          r += options2.spaceBeforeSlash + "?>";
          r += this.endline(node, options2, level);
          options2.state = WriterState.None;
          this.closeNode(node, options2, level);
          return r;
        };
        XMLWriterBase2.prototype.raw = function(node, options2, level) {
          var r;
          this.openNode(node, options2, level);
          options2.state = WriterState.OpenTag;
          r = this.indent(node, options2, level);
          options2.state = WriterState.InsideTag;
          r += node.value;
          options2.state = WriterState.CloseTag;
          r += this.endline(node, options2, level);
          options2.state = WriterState.None;
          this.closeNode(node, options2, level);
          return r;
        };
        XMLWriterBase2.prototype.text = function(node, options2, level) {
          var r;
          this.openNode(node, options2, level);
          options2.state = WriterState.OpenTag;
          r = this.indent(node, options2, level);
          options2.state = WriterState.InsideTag;
          r += node.value;
          options2.state = WriterState.CloseTag;
          r += this.endline(node, options2, level);
          options2.state = WriterState.None;
          this.closeNode(node, options2, level);
          return r;
        };
        XMLWriterBase2.prototype.dtdAttList = function(node, options2, level) {
          var r;
          this.openNode(node, options2, level);
          options2.state = WriterState.OpenTag;
          r = this.indent(node, options2, level) + "<!ATTLIST";
          options2.state = WriterState.InsideTag;
          r += " " + node.elementName + " " + node.attributeName + " " + node.attributeType;
          if (node.defaultValueType !== "#DEFAULT") {
            r += " " + node.defaultValueType;
          }
          if (node.defaultValue) {
            r += ' "' + node.defaultValue + '"';
          }
          options2.state = WriterState.CloseTag;
          r += options2.spaceBeforeSlash + ">" + this.endline(node, options2, level);
          options2.state = WriterState.None;
          this.closeNode(node, options2, level);
          return r;
        };
        XMLWriterBase2.prototype.dtdElement = function(node, options2, level) {
          var r;
          this.openNode(node, options2, level);
          options2.state = WriterState.OpenTag;
          r = this.indent(node, options2, level) + "<!ELEMENT";
          options2.state = WriterState.InsideTag;
          r += " " + node.name + " " + node.value;
          options2.state = WriterState.CloseTag;
          r += options2.spaceBeforeSlash + ">" + this.endline(node, options2, level);
          options2.state = WriterState.None;
          this.closeNode(node, options2, level);
          return r;
        };
        XMLWriterBase2.prototype.dtdEntity = function(node, options2, level) {
          var r;
          this.openNode(node, options2, level);
          options2.state = WriterState.OpenTag;
          r = this.indent(node, options2, level) + "<!ENTITY";
          options2.state = WriterState.InsideTag;
          if (node.pe) {
            r += " %";
          }
          r += " " + node.name;
          if (node.value) {
            r += ' "' + node.value + '"';
          } else {
            if (node.pubID && node.sysID) {
              r += ' PUBLIC "' + node.pubID + '" "' + node.sysID + '"';
            } else if (node.sysID) {
              r += ' SYSTEM "' + node.sysID + '"';
            }
            if (node.nData) {
              r += " NDATA " + node.nData;
            }
          }
          options2.state = WriterState.CloseTag;
          r += options2.spaceBeforeSlash + ">" + this.endline(node, options2, level);
          options2.state = WriterState.None;
          this.closeNode(node, options2, level);
          return r;
        };
        XMLWriterBase2.prototype.dtdNotation = function(node, options2, level) {
          var r;
          this.openNode(node, options2, level);
          options2.state = WriterState.OpenTag;
          r = this.indent(node, options2, level) + "<!NOTATION";
          options2.state = WriterState.InsideTag;
          r += " " + node.name;
          if (node.pubID && node.sysID) {
            r += ' PUBLIC "' + node.pubID + '" "' + node.sysID + '"';
          } else if (node.pubID) {
            r += ' PUBLIC "' + node.pubID + '"';
          } else if (node.sysID) {
            r += ' SYSTEM "' + node.sysID + '"';
          }
          options2.state = WriterState.CloseTag;
          r += options2.spaceBeforeSlash + ">" + this.endline(node, options2, level);
          options2.state = WriterState.None;
          this.closeNode(node, options2, level);
          return r;
        };
        XMLWriterBase2.prototype.openNode = function(node, options2, level) {
        };
        XMLWriterBase2.prototype.closeNode = function(node, options2, level) {
        };
        XMLWriterBase2.prototype.openAttribute = function(att, options2, level) {
        };
        XMLWriterBase2.prototype.closeAttribute = function(att, options2, level) {
        };
        return XMLWriterBase2;
      })();
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLStringWriter.js
var require_XMLStringWriter = __commonJS({
  "node_modules/xmlbuilder/lib/XMLStringWriter.js"(exports2, module2) {
    (function() {
      var XMLStringWriter, XMLWriterBase, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      XMLWriterBase = require_XMLWriterBase();
      module2.exports = XMLStringWriter = (function(superClass) {
        extend(XMLStringWriter2, superClass);
        function XMLStringWriter2(options2) {
          XMLStringWriter2.__super__.constructor.call(this, options2);
        }
        XMLStringWriter2.prototype.document = function(doc, options2) {
          var child, i, len, r, ref;
          options2 = this.filterOptions(options2);
          r = "";
          ref = doc.children;
          for (i = 0, len = ref.length; i < len; i++) {
            child = ref[i];
            r += this.writeChildNode(child, options2, 0);
          }
          if (options2.pretty && r.slice(-options2.newline.length) === options2.newline) {
            r = r.slice(0, -options2.newline.length);
          }
          return r;
        };
        return XMLStringWriter2;
      })(XMLWriterBase);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLDocument.js
var require_XMLDocument = __commonJS({
  "node_modules/xmlbuilder/lib/XMLDocument.js"(exports2, module2) {
    (function() {
      var NodeType, XMLDOMConfiguration, XMLDOMImplementation, XMLDocument, XMLNode, XMLStringWriter, XMLStringifier, isPlainObject, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      isPlainObject = require_Utility().isPlainObject;
      XMLDOMImplementation = require_XMLDOMImplementation();
      XMLDOMConfiguration = require_XMLDOMConfiguration();
      XMLNode = require_XMLNode();
      NodeType = require_NodeType();
      XMLStringifier = require_XMLStringifier();
      XMLStringWriter = require_XMLStringWriter();
      module2.exports = XMLDocument = (function(superClass) {
        extend(XMLDocument2, superClass);
        function XMLDocument2(options2) {
          XMLDocument2.__super__.constructor.call(this, null);
          this.name = "#document";
          this.type = NodeType.Document;
          this.documentURI = null;
          this.domConfig = new XMLDOMConfiguration();
          options2 || (options2 = {});
          if (!options2.writer) {
            options2.writer = new XMLStringWriter();
          }
          this.options = options2;
          this.stringify = new XMLStringifier(options2);
        }
        Object.defineProperty(XMLDocument2.prototype, "implementation", {
          value: new XMLDOMImplementation()
        });
        Object.defineProperty(XMLDocument2.prototype, "doctype", {
          get: function() {
            var child, i, len, ref;
            ref = this.children;
            for (i = 0, len = ref.length; i < len; i++) {
              child = ref[i];
              if (child.type === NodeType.DocType) {
                return child;
              }
            }
            return null;
          }
        });
        Object.defineProperty(XMLDocument2.prototype, "documentElement", {
          get: function() {
            return this.rootObject || null;
          }
        });
        Object.defineProperty(XMLDocument2.prototype, "inputEncoding", {
          get: function() {
            return null;
          }
        });
        Object.defineProperty(XMLDocument2.prototype, "strictErrorChecking", {
          get: function() {
            return false;
          }
        });
        Object.defineProperty(XMLDocument2.prototype, "xmlEncoding", {
          get: function() {
            if (this.children.length !== 0 && this.children[0].type === NodeType.Declaration) {
              return this.children[0].encoding;
            } else {
              return null;
            }
          }
        });
        Object.defineProperty(XMLDocument2.prototype, "xmlStandalone", {
          get: function() {
            if (this.children.length !== 0 && this.children[0].type === NodeType.Declaration) {
              return this.children[0].standalone === "yes";
            } else {
              return false;
            }
          }
        });
        Object.defineProperty(XMLDocument2.prototype, "xmlVersion", {
          get: function() {
            if (this.children.length !== 0 && this.children[0].type === NodeType.Declaration) {
              return this.children[0].version;
            } else {
              return "1.0";
            }
          }
        });
        Object.defineProperty(XMLDocument2.prototype, "URL", {
          get: function() {
            return this.documentURI;
          }
        });
        Object.defineProperty(XMLDocument2.prototype, "origin", {
          get: function() {
            return null;
          }
        });
        Object.defineProperty(XMLDocument2.prototype, "compatMode", {
          get: function() {
            return null;
          }
        });
        Object.defineProperty(XMLDocument2.prototype, "characterSet", {
          get: function() {
            return null;
          }
        });
        Object.defineProperty(XMLDocument2.prototype, "contentType", {
          get: function() {
            return null;
          }
        });
        XMLDocument2.prototype.end = function(writer) {
          var writerOptions;
          writerOptions = {};
          if (!writer) {
            writer = this.options.writer;
          } else if (isPlainObject(writer)) {
            writerOptions = writer;
            writer = this.options.writer;
          }
          return writer.document(this, writer.filterOptions(writerOptions));
        };
        XMLDocument2.prototype.toString = function(options2) {
          return this.options.writer.document(this, this.options.writer.filterOptions(options2));
        };
        XMLDocument2.prototype.createElement = function(tagName) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.createDocumentFragment = function() {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.createTextNode = function(data) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.createComment = function(data) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.createCDATASection = function(data) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.createProcessingInstruction = function(target, data) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.createAttribute = function(name) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.createEntityReference = function(name) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.getElementsByTagName = function(tagname) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.importNode = function(importedNode, deep) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.createElementNS = function(namespaceURI, qualifiedName) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.createAttributeNS = function(namespaceURI, qualifiedName) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.getElementsByTagNameNS = function(namespaceURI, localName) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.getElementById = function(elementId) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.adoptNode = function(source) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.normalizeDocument = function() {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.renameNode = function(node, namespaceURI, qualifiedName) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.getElementsByClassName = function(classNames) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.createEvent = function(eventInterface) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.createRange = function() {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.createNodeIterator = function(root, whatToShow, filter) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.createTreeWalker = function(root, whatToShow, filter) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        return XMLDocument2;
      })(XMLNode);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLDocumentCB.js
var require_XMLDocumentCB = __commonJS({
  "node_modules/xmlbuilder/lib/XMLDocumentCB.js"(exports2, module2) {
    (function() {
      var NodeType, WriterState, XMLAttribute, XMLCData, XMLComment, XMLDTDAttList, XMLDTDElement, XMLDTDEntity, XMLDTDNotation, XMLDeclaration, XMLDocType, XMLDocument, XMLDocumentCB, XMLElement, XMLProcessingInstruction, XMLRaw, XMLStringWriter, XMLStringifier, XMLText, getValue, isFunction, isObject, isPlainObject, ref, hasProp = {}.hasOwnProperty;
      ref = require_Utility(), isObject = ref.isObject, isFunction = ref.isFunction, isPlainObject = ref.isPlainObject, getValue = ref.getValue;
      NodeType = require_NodeType();
      XMLDocument = require_XMLDocument();
      XMLElement = require_XMLElement();
      XMLCData = require_XMLCData();
      XMLComment = require_XMLComment();
      XMLRaw = require_XMLRaw();
      XMLText = require_XMLText();
      XMLProcessingInstruction = require_XMLProcessingInstruction();
      XMLDeclaration = require_XMLDeclaration();
      XMLDocType = require_XMLDocType();
      XMLDTDAttList = require_XMLDTDAttList();
      XMLDTDEntity = require_XMLDTDEntity();
      XMLDTDElement = require_XMLDTDElement();
      XMLDTDNotation = require_XMLDTDNotation();
      XMLAttribute = require_XMLAttribute();
      XMLStringifier = require_XMLStringifier();
      XMLStringWriter = require_XMLStringWriter();
      WriterState = require_WriterState();
      module2.exports = XMLDocumentCB = (function() {
        function XMLDocumentCB2(options2, onData, onEnd) {
          var writerOptions;
          this.name = "?xml";
          this.type = NodeType.Document;
          options2 || (options2 = {});
          writerOptions = {};
          if (!options2.writer) {
            options2.writer = new XMLStringWriter();
          } else if (isPlainObject(options2.writer)) {
            writerOptions = options2.writer;
            options2.writer = new XMLStringWriter();
          }
          this.options = options2;
          this.writer = options2.writer;
          this.writerOptions = this.writer.filterOptions(writerOptions);
          this.stringify = new XMLStringifier(options2);
          this.onDataCallback = onData || function() {
          };
          this.onEndCallback = onEnd || function() {
          };
          this.currentNode = null;
          this.currentLevel = -1;
          this.openTags = {};
          this.documentStarted = false;
          this.documentCompleted = false;
          this.root = null;
        }
        XMLDocumentCB2.prototype.createChildNode = function(node) {
          var att, attName, attributes, child, i, len, ref1, ref2;
          switch (node.type) {
            case NodeType.CData:
              this.cdata(node.value);
              break;
            case NodeType.Comment:
              this.comment(node.value);
              break;
            case NodeType.Element:
              attributes = {};
              ref1 = node.attribs;
              for (attName in ref1) {
                if (!hasProp.call(ref1, attName)) continue;
                att = ref1[attName];
                attributes[attName] = att.value;
              }
              this.node(node.name, attributes);
              break;
            case NodeType.Dummy:
              this.dummy();
              break;
            case NodeType.Raw:
              this.raw(node.value);
              break;
            case NodeType.Text:
              this.text(node.value);
              break;
            case NodeType.ProcessingInstruction:
              this.instruction(node.target, node.value);
              break;
            default:
              throw new Error("This XML node type is not supported in a JS object: " + node.constructor.name);
          }
          ref2 = node.children;
          for (i = 0, len = ref2.length; i < len; i++) {
            child = ref2[i];
            this.createChildNode(child);
            if (child.type === NodeType.Element) {
              this.up();
            }
          }
          return this;
        };
        XMLDocumentCB2.prototype.dummy = function() {
          return this;
        };
        XMLDocumentCB2.prototype.node = function(name, attributes, text) {
          var ref1;
          if (name == null) {
            throw new Error("Missing node name.");
          }
          if (this.root && this.currentLevel === -1) {
            throw new Error("Document can only have one root node. " + this.debugInfo(name));
          }
          this.openCurrent();
          name = getValue(name);
          if (attributes == null) {
            attributes = {};
          }
          attributes = getValue(attributes);
          if (!isObject(attributes)) {
            ref1 = [attributes, text], text = ref1[0], attributes = ref1[1];
          }
          this.currentNode = new XMLElement(this, name, attributes);
          this.currentNode.children = false;
          this.currentLevel++;
          this.openTags[this.currentLevel] = this.currentNode;
          if (text != null) {
            this.text(text);
          }
          return this;
        };
        XMLDocumentCB2.prototype.element = function(name, attributes, text) {
          var child, i, len, oldValidationFlag, ref1, root;
          if (this.currentNode && this.currentNode.type === NodeType.DocType) {
            this.dtdElement.apply(this, arguments);
          } else {
            if (Array.isArray(name) || isObject(name) || isFunction(name)) {
              oldValidationFlag = this.options.noValidation;
              this.options.noValidation = true;
              root = new XMLDocument(this.options).element("TEMP_ROOT");
              root.element(name);
              this.options.noValidation = oldValidationFlag;
              ref1 = root.children;
              for (i = 0, len = ref1.length; i < len; i++) {
                child = ref1[i];
                this.createChildNode(child);
                if (child.type === NodeType.Element) {
                  this.up();
                }
              }
            } else {
              this.node(name, attributes, text);
            }
          }
          return this;
        };
        XMLDocumentCB2.prototype.attribute = function(name, value) {
          var attName, attValue;
          if (!this.currentNode || this.currentNode.children) {
            throw new Error("att() can only be used immediately after an ele() call in callback mode. " + this.debugInfo(name));
          }
          if (name != null) {
            name = getValue(name);
          }
          if (isObject(name)) {
            for (attName in name) {
              if (!hasProp.call(name, attName)) continue;
              attValue = name[attName];
              this.attribute(attName, attValue);
            }
          } else {
            if (isFunction(value)) {
              value = value.apply();
            }
            if (this.options.keepNullAttributes && value == null) {
              this.currentNode.attribs[name] = new XMLAttribute(this, name, "");
            } else if (value != null) {
              this.currentNode.attribs[name] = new XMLAttribute(this, name, value);
            }
          }
          return this;
        };
        XMLDocumentCB2.prototype.text = function(value) {
          var node;
          this.openCurrent();
          node = new XMLText(this, value);
          this.onData(this.writer.text(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
          return this;
        };
        XMLDocumentCB2.prototype.cdata = function(value) {
          var node;
          this.openCurrent();
          node = new XMLCData(this, value);
          this.onData(this.writer.cdata(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
          return this;
        };
        XMLDocumentCB2.prototype.comment = function(value) {
          var node;
          this.openCurrent();
          node = new XMLComment(this, value);
          this.onData(this.writer.comment(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
          return this;
        };
        XMLDocumentCB2.prototype.raw = function(value) {
          var node;
          this.openCurrent();
          node = new XMLRaw(this, value);
          this.onData(this.writer.raw(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
          return this;
        };
        XMLDocumentCB2.prototype.instruction = function(target, value) {
          var i, insTarget, insValue, len, node;
          this.openCurrent();
          if (target != null) {
            target = getValue(target);
          }
          if (value != null) {
            value = getValue(value);
          }
          if (Array.isArray(target)) {
            for (i = 0, len = target.length; i < len; i++) {
              insTarget = target[i];
              this.instruction(insTarget);
            }
          } else if (isObject(target)) {
            for (insTarget in target) {
              if (!hasProp.call(target, insTarget)) continue;
              insValue = target[insTarget];
              this.instruction(insTarget, insValue);
            }
          } else {
            if (isFunction(value)) {
              value = value.apply();
            }
            node = new XMLProcessingInstruction(this, target, value);
            this.onData(this.writer.processingInstruction(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
          }
          return this;
        };
        XMLDocumentCB2.prototype.declaration = function(version, encoding, standalone) {
          var node;
          this.openCurrent();
          if (this.documentStarted) {
            throw new Error("declaration() must be the first node.");
          }
          node = new XMLDeclaration(this, version, encoding, standalone);
          this.onData(this.writer.declaration(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
          return this;
        };
        XMLDocumentCB2.prototype.doctype = function(root, pubID, sysID) {
          this.openCurrent();
          if (root == null) {
            throw new Error("Missing root node name.");
          }
          if (this.root) {
            throw new Error("dtd() must come before the root node.");
          }
          this.currentNode = new XMLDocType(this, pubID, sysID);
          this.currentNode.rootNodeName = root;
          this.currentNode.children = false;
          this.currentLevel++;
          this.openTags[this.currentLevel] = this.currentNode;
          return this;
        };
        XMLDocumentCB2.prototype.dtdElement = function(name, value) {
          var node;
          this.openCurrent();
          node = new XMLDTDElement(this, name, value);
          this.onData(this.writer.dtdElement(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
          return this;
        };
        XMLDocumentCB2.prototype.attList = function(elementName, attributeName, attributeType, defaultValueType, defaultValue) {
          var node;
          this.openCurrent();
          node = new XMLDTDAttList(this, elementName, attributeName, attributeType, defaultValueType, defaultValue);
          this.onData(this.writer.dtdAttList(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
          return this;
        };
        XMLDocumentCB2.prototype.entity = function(name, value) {
          var node;
          this.openCurrent();
          node = new XMLDTDEntity(this, false, name, value);
          this.onData(this.writer.dtdEntity(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
          return this;
        };
        XMLDocumentCB2.prototype.pEntity = function(name, value) {
          var node;
          this.openCurrent();
          node = new XMLDTDEntity(this, true, name, value);
          this.onData(this.writer.dtdEntity(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
          return this;
        };
        XMLDocumentCB2.prototype.notation = function(name, value) {
          var node;
          this.openCurrent();
          node = new XMLDTDNotation(this, name, value);
          this.onData(this.writer.dtdNotation(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
          return this;
        };
        XMLDocumentCB2.prototype.up = function() {
          if (this.currentLevel < 0) {
            throw new Error("The document node has no parent.");
          }
          if (this.currentNode) {
            if (this.currentNode.children) {
              this.closeNode(this.currentNode);
            } else {
              this.openNode(this.currentNode);
            }
            this.currentNode = null;
          } else {
            this.closeNode(this.openTags[this.currentLevel]);
          }
          delete this.openTags[this.currentLevel];
          this.currentLevel--;
          return this;
        };
        XMLDocumentCB2.prototype.end = function() {
          while (this.currentLevel >= 0) {
            this.up();
          }
          return this.onEnd();
        };
        XMLDocumentCB2.prototype.openCurrent = function() {
          if (this.currentNode) {
            this.currentNode.children = true;
            return this.openNode(this.currentNode);
          }
        };
        XMLDocumentCB2.prototype.openNode = function(node) {
          var att, chunk, name, ref1;
          if (!node.isOpen) {
            if (!this.root && this.currentLevel === 0 && node.type === NodeType.Element) {
              this.root = node;
            }
            chunk = "";
            if (node.type === NodeType.Element) {
              this.writerOptions.state = WriterState.OpenTag;
              chunk = this.writer.indent(node, this.writerOptions, this.currentLevel) + "<" + node.name;
              ref1 = node.attribs;
              for (name in ref1) {
                if (!hasProp.call(ref1, name)) continue;
                att = ref1[name];
                chunk += this.writer.attribute(att, this.writerOptions, this.currentLevel);
              }
              chunk += (node.children ? ">" : "/>") + this.writer.endline(node, this.writerOptions, this.currentLevel);
              this.writerOptions.state = WriterState.InsideTag;
            } else {
              this.writerOptions.state = WriterState.OpenTag;
              chunk = this.writer.indent(node, this.writerOptions, this.currentLevel) + "<!DOCTYPE " + node.rootNodeName;
              if (node.pubID && node.sysID) {
                chunk += ' PUBLIC "' + node.pubID + '" "' + node.sysID + '"';
              } else if (node.sysID) {
                chunk += ' SYSTEM "' + node.sysID + '"';
              }
              if (node.children) {
                chunk += " [";
                this.writerOptions.state = WriterState.InsideTag;
              } else {
                this.writerOptions.state = WriterState.CloseTag;
                chunk += ">";
              }
              chunk += this.writer.endline(node, this.writerOptions, this.currentLevel);
            }
            this.onData(chunk, this.currentLevel);
            return node.isOpen = true;
          }
        };
        XMLDocumentCB2.prototype.closeNode = function(node) {
          var chunk;
          if (!node.isClosed) {
            chunk = "";
            this.writerOptions.state = WriterState.CloseTag;
            if (node.type === NodeType.Element) {
              chunk = this.writer.indent(node, this.writerOptions, this.currentLevel) + "</" + node.name + ">" + this.writer.endline(node, this.writerOptions, this.currentLevel);
            } else {
              chunk = this.writer.indent(node, this.writerOptions, this.currentLevel) + "]>" + this.writer.endline(node, this.writerOptions, this.currentLevel);
            }
            this.writerOptions.state = WriterState.None;
            this.onData(chunk, this.currentLevel);
            return node.isClosed = true;
          }
        };
        XMLDocumentCB2.prototype.onData = function(chunk, level) {
          this.documentStarted = true;
          return this.onDataCallback(chunk, level + 1);
        };
        XMLDocumentCB2.prototype.onEnd = function() {
          this.documentCompleted = true;
          return this.onEndCallback();
        };
        XMLDocumentCB2.prototype.debugInfo = function(name) {
          if (name == null) {
            return "";
          } else {
            return "node: <" + name + ">";
          }
        };
        XMLDocumentCB2.prototype.ele = function() {
          return this.element.apply(this, arguments);
        };
        XMLDocumentCB2.prototype.nod = function(name, attributes, text) {
          return this.node(name, attributes, text);
        };
        XMLDocumentCB2.prototype.txt = function(value) {
          return this.text(value);
        };
        XMLDocumentCB2.prototype.dat = function(value) {
          return this.cdata(value);
        };
        XMLDocumentCB2.prototype.com = function(value) {
          return this.comment(value);
        };
        XMLDocumentCB2.prototype.ins = function(target, value) {
          return this.instruction(target, value);
        };
        XMLDocumentCB2.prototype.dec = function(version, encoding, standalone) {
          return this.declaration(version, encoding, standalone);
        };
        XMLDocumentCB2.prototype.dtd = function(root, pubID, sysID) {
          return this.doctype(root, pubID, sysID);
        };
        XMLDocumentCB2.prototype.e = function(name, attributes, text) {
          return this.element(name, attributes, text);
        };
        XMLDocumentCB2.prototype.n = function(name, attributes, text) {
          return this.node(name, attributes, text);
        };
        XMLDocumentCB2.prototype.t = function(value) {
          return this.text(value);
        };
        XMLDocumentCB2.prototype.d = function(value) {
          return this.cdata(value);
        };
        XMLDocumentCB2.prototype.c = function(value) {
          return this.comment(value);
        };
        XMLDocumentCB2.prototype.r = function(value) {
          return this.raw(value);
        };
        XMLDocumentCB2.prototype.i = function(target, value) {
          return this.instruction(target, value);
        };
        XMLDocumentCB2.prototype.att = function() {
          if (this.currentNode && this.currentNode.type === NodeType.DocType) {
            return this.attList.apply(this, arguments);
          } else {
            return this.attribute.apply(this, arguments);
          }
        };
        XMLDocumentCB2.prototype.a = function() {
          if (this.currentNode && this.currentNode.type === NodeType.DocType) {
            return this.attList.apply(this, arguments);
          } else {
            return this.attribute.apply(this, arguments);
          }
        };
        XMLDocumentCB2.prototype.ent = function(name, value) {
          return this.entity(name, value);
        };
        XMLDocumentCB2.prototype.pent = function(name, value) {
          return this.pEntity(name, value);
        };
        XMLDocumentCB2.prototype.not = function(name, value) {
          return this.notation(name, value);
        };
        return XMLDocumentCB2;
      })();
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLStreamWriter.js
var require_XMLStreamWriter = __commonJS({
  "node_modules/xmlbuilder/lib/XMLStreamWriter.js"(exports2, module2) {
    (function() {
      var NodeType, WriterState, XMLStreamWriter, XMLWriterBase, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      NodeType = require_NodeType();
      XMLWriterBase = require_XMLWriterBase();
      WriterState = require_WriterState();
      module2.exports = XMLStreamWriter = (function(superClass) {
        extend(XMLStreamWriter2, superClass);
        function XMLStreamWriter2(stream, options2) {
          this.stream = stream;
          XMLStreamWriter2.__super__.constructor.call(this, options2);
        }
        XMLStreamWriter2.prototype.endline = function(node, options2, level) {
          if (node.isLastRootNode && options2.state === WriterState.CloseTag) {
            return "";
          } else {
            return XMLStreamWriter2.__super__.endline.call(this, node, options2, level);
          }
        };
        XMLStreamWriter2.prototype.document = function(doc, options2) {
          var child, i, j, k, len, len1, ref, ref1, results;
          ref = doc.children;
          for (i = j = 0, len = ref.length; j < len; i = ++j) {
            child = ref[i];
            child.isLastRootNode = i === doc.children.length - 1;
          }
          options2 = this.filterOptions(options2);
          ref1 = doc.children;
          results = [];
          for (k = 0, len1 = ref1.length; k < len1; k++) {
            child = ref1[k];
            results.push(this.writeChildNode(child, options2, 0));
          }
          return results;
        };
        XMLStreamWriter2.prototype.attribute = function(att, options2, level) {
          return this.stream.write(XMLStreamWriter2.__super__.attribute.call(this, att, options2, level));
        };
        XMLStreamWriter2.prototype.cdata = function(node, options2, level) {
          return this.stream.write(XMLStreamWriter2.__super__.cdata.call(this, node, options2, level));
        };
        XMLStreamWriter2.prototype.comment = function(node, options2, level) {
          return this.stream.write(XMLStreamWriter2.__super__.comment.call(this, node, options2, level));
        };
        XMLStreamWriter2.prototype.declaration = function(node, options2, level) {
          return this.stream.write(XMLStreamWriter2.__super__.declaration.call(this, node, options2, level));
        };
        XMLStreamWriter2.prototype.docType = function(node, options2, level) {
          var child, j, len, ref;
          level || (level = 0);
          this.openNode(node, options2, level);
          options2.state = WriterState.OpenTag;
          this.stream.write(this.indent(node, options2, level));
          this.stream.write("<!DOCTYPE " + node.root().name);
          if (node.pubID && node.sysID) {
            this.stream.write(' PUBLIC "' + node.pubID + '" "' + node.sysID + '"');
          } else if (node.sysID) {
            this.stream.write(' SYSTEM "' + node.sysID + '"');
          }
          if (node.children.length > 0) {
            this.stream.write(" [");
            this.stream.write(this.endline(node, options2, level));
            options2.state = WriterState.InsideTag;
            ref = node.children;
            for (j = 0, len = ref.length; j < len; j++) {
              child = ref[j];
              this.writeChildNode(child, options2, level + 1);
            }
            options2.state = WriterState.CloseTag;
            this.stream.write("]");
          }
          options2.state = WriterState.CloseTag;
          this.stream.write(options2.spaceBeforeSlash + ">");
          this.stream.write(this.endline(node, options2, level));
          options2.state = WriterState.None;
          return this.closeNode(node, options2, level);
        };
        XMLStreamWriter2.prototype.element = function(node, options2, level) {
          var att, child, childNodeCount, firstChildNode, j, len, name, prettySuppressed, ref, ref1;
          level || (level = 0);
          this.openNode(node, options2, level);
          options2.state = WriterState.OpenTag;
          this.stream.write(this.indent(node, options2, level) + "<" + node.name);
          ref = node.attribs;
          for (name in ref) {
            if (!hasProp.call(ref, name)) continue;
            att = ref[name];
            this.attribute(att, options2, level);
          }
          childNodeCount = node.children.length;
          firstChildNode = childNodeCount === 0 ? null : node.children[0];
          if (childNodeCount === 0 || node.children.every(function(e) {
            return (e.type === NodeType.Text || e.type === NodeType.Raw) && e.value === "";
          })) {
            if (options2.allowEmpty) {
              this.stream.write(">");
              options2.state = WriterState.CloseTag;
              this.stream.write("</" + node.name + ">");
            } else {
              options2.state = WriterState.CloseTag;
              this.stream.write(options2.spaceBeforeSlash + "/>");
            }
          } else if (options2.pretty && childNodeCount === 1 && (firstChildNode.type === NodeType.Text || firstChildNode.type === NodeType.Raw) && firstChildNode.value != null) {
            this.stream.write(">");
            options2.state = WriterState.InsideTag;
            options2.suppressPrettyCount++;
            prettySuppressed = true;
            this.writeChildNode(firstChildNode, options2, level + 1);
            options2.suppressPrettyCount--;
            prettySuppressed = false;
            options2.state = WriterState.CloseTag;
            this.stream.write("</" + node.name + ">");
          } else {
            this.stream.write(">" + this.endline(node, options2, level));
            options2.state = WriterState.InsideTag;
            ref1 = node.children;
            for (j = 0, len = ref1.length; j < len; j++) {
              child = ref1[j];
              this.writeChildNode(child, options2, level + 1);
            }
            options2.state = WriterState.CloseTag;
            this.stream.write(this.indent(node, options2, level) + "</" + node.name + ">");
          }
          this.stream.write(this.endline(node, options2, level));
          options2.state = WriterState.None;
          return this.closeNode(node, options2, level);
        };
        XMLStreamWriter2.prototype.processingInstruction = function(node, options2, level) {
          return this.stream.write(XMLStreamWriter2.__super__.processingInstruction.call(this, node, options2, level));
        };
        XMLStreamWriter2.prototype.raw = function(node, options2, level) {
          return this.stream.write(XMLStreamWriter2.__super__.raw.call(this, node, options2, level));
        };
        XMLStreamWriter2.prototype.text = function(node, options2, level) {
          return this.stream.write(XMLStreamWriter2.__super__.text.call(this, node, options2, level));
        };
        XMLStreamWriter2.prototype.dtdAttList = function(node, options2, level) {
          return this.stream.write(XMLStreamWriter2.__super__.dtdAttList.call(this, node, options2, level));
        };
        XMLStreamWriter2.prototype.dtdElement = function(node, options2, level) {
          return this.stream.write(XMLStreamWriter2.__super__.dtdElement.call(this, node, options2, level));
        };
        XMLStreamWriter2.prototype.dtdEntity = function(node, options2, level) {
          return this.stream.write(XMLStreamWriter2.__super__.dtdEntity.call(this, node, options2, level));
        };
        XMLStreamWriter2.prototype.dtdNotation = function(node, options2, level) {
          return this.stream.write(XMLStreamWriter2.__super__.dtdNotation.call(this, node, options2, level));
        };
        return XMLStreamWriter2;
      })(XMLWriterBase);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/index.js
var require_lib = __commonJS({
  "node_modules/xmlbuilder/lib/index.js"(exports2, module2) {
    (function() {
      var NodeType, WriterState, XMLDOMImplementation, XMLDocument, XMLDocumentCB, XMLStreamWriter, XMLStringWriter, assign, isFunction, ref;
      ref = require_Utility(), assign = ref.assign, isFunction = ref.isFunction;
      XMLDOMImplementation = require_XMLDOMImplementation();
      XMLDocument = require_XMLDocument();
      XMLDocumentCB = require_XMLDocumentCB();
      XMLStringWriter = require_XMLStringWriter();
      XMLStreamWriter = require_XMLStreamWriter();
      NodeType = require_NodeType();
      WriterState = require_WriterState();
      module2.exports.create = function(name, xmldec, doctype, options2) {
        var doc, root;
        if (name == null) {
          throw new Error("Root element needs a name.");
        }
        options2 = assign({}, xmldec, doctype, options2);
        doc = new XMLDocument(options2);
        root = doc.element(name);
        if (!options2.headless) {
          doc.declaration(options2);
          if (options2.pubID != null || options2.sysID != null) {
            doc.dtd(options2);
          }
        }
        return root;
      };
      module2.exports.begin = function(options2, onData, onEnd) {
        var ref1;
        if (isFunction(options2)) {
          ref1 = [options2, onData], onData = ref1[0], onEnd = ref1[1];
          options2 = {};
        }
        if (onData) {
          return new XMLDocumentCB(options2, onData, onEnd);
        } else {
          return new XMLDocument(options2);
        }
      };
      module2.exports.stringWriter = function(options2) {
        return new XMLStringWriter(options2);
      };
      module2.exports.streamWriter = function(stream, options2) {
        return new XMLStreamWriter(stream, options2);
      };
      module2.exports.implementation = new XMLDOMImplementation();
      module2.exports.nodeType = NodeType;
      module2.exports.writerState = WriterState;
    }).call(exports2);
  }
});

// node_modules/xml2js/lib/builder.js
var require_builder = __commonJS({
  "node_modules/xml2js/lib/builder.js"(exports2) {
    (function() {
      "use strict";
      var builder, defaults, escapeCDATA, requiresCDATA, wrapCDATA, hasProp = {}.hasOwnProperty;
      builder = require_lib();
      defaults = require_defaults().defaults;
      requiresCDATA = function(entry) {
        return typeof entry === "string" && (entry.indexOf("&") >= 0 || entry.indexOf(">") >= 0 || entry.indexOf("<") >= 0);
      };
      wrapCDATA = function(entry) {
        return "<![CDATA[" + escapeCDATA(entry) + "]]>";
      };
      escapeCDATA = function(entry) {
        return entry.replace("]]>", "]]]]><![CDATA[>");
      };
      exports2.Builder = (function() {
        function Builder(opts) {
          var key, ref, value;
          this.options = {};
          ref = defaults["0.2"];
          for (key in ref) {
            if (!hasProp.call(ref, key)) continue;
            value = ref[key];
            this.options[key] = value;
          }
          for (key in opts) {
            if (!hasProp.call(opts, key)) continue;
            value = opts[key];
            this.options[key] = value;
          }
        }
        Builder.prototype.buildObject = function(rootObj) {
          var attrkey, charkey, render, rootElement, rootName;
          attrkey = this.options.attrkey;
          charkey = this.options.charkey;
          if (Object.keys(rootObj).length === 1 && this.options.rootName === defaults["0.2"].rootName) {
            rootName = Object.keys(rootObj)[0];
            rootObj = rootObj[rootName];
          } else {
            rootName = this.options.rootName;
          }
          render = /* @__PURE__ */ (function(_this) {
            return function(element, obj) {
              var attr, child, entry, index, key, value;
              if (typeof obj !== "object") {
                if (_this.options.cdata && requiresCDATA(obj)) {
                  element.raw(wrapCDATA(obj));
                } else {
                  element.txt(obj);
                }
              } else if (Array.isArray(obj)) {
                for (index in obj) {
                  if (!hasProp.call(obj, index)) continue;
                  child = obj[index];
                  for (key in child) {
                    entry = child[key];
                    element = render(element.ele(key), entry).up();
                  }
                }
              } else {
                for (key in obj) {
                  if (!hasProp.call(obj, key)) continue;
                  child = obj[key];
                  if (key === attrkey) {
                    if (typeof child === "object") {
                      for (attr in child) {
                        value = child[attr];
                        element = element.att(attr, value);
                      }
                    }
                  } else if (key === charkey) {
                    if (_this.options.cdata && requiresCDATA(child)) {
                      element = element.raw(wrapCDATA(child));
                    } else {
                      element = element.txt(child);
                    }
                  } else if (Array.isArray(child)) {
                    for (index in child) {
                      if (!hasProp.call(child, index)) continue;
                      entry = child[index];
                      if (typeof entry === "string") {
                        if (_this.options.cdata && requiresCDATA(entry)) {
                          element = element.ele(key).raw(wrapCDATA(entry)).up();
                        } else {
                          element = element.ele(key, entry).up();
                        }
                      } else {
                        element = render(element.ele(key), entry).up();
                      }
                    }
                  } else if (typeof child === "object") {
                    element = render(element.ele(key), child).up();
                  } else {
                    if (typeof child === "string" && _this.options.cdata && requiresCDATA(child)) {
                      element = element.ele(key).raw(wrapCDATA(child)).up();
                    } else {
                      if (child == null) {
                        child = "";
                      }
                      element = element.ele(key, child.toString()).up();
                    }
                  }
                }
              }
              return element;
            };
          })(this);
          rootElement = builder.create(rootName, this.options.xmldec, this.options.doctype, {
            headless: this.options.headless,
            allowSurrogateChars: this.options.allowSurrogateChars
          });
          return render(rootElement, rootObj).end(this.options.renderOpts);
        };
        return Builder;
      })();
    }).call(exports2);
  }
});

// node_modules/sax/lib/sax.js
var require_sax = __commonJS({
  "node_modules/sax/lib/sax.js"(exports2) {
    (function(sax) {
      sax.parser = function(strict, opt) {
        return new SAXParser(strict, opt);
      };
      sax.SAXParser = SAXParser;
      sax.SAXStream = SAXStream;
      sax.createStream = createStream;
      sax.MAX_BUFFER_LENGTH = 64 * 1024;
      var buffers = [
        "comment",
        "sgmlDecl",
        "textNode",
        "tagName",
        "doctype",
        "procInstName",
        "procInstBody",
        "entity",
        "attribName",
        "attribValue",
        "cdata",
        "script"
      ];
      sax.EVENTS = [
        "text",
        "processinginstruction",
        "sgmldeclaration",
        "doctype",
        "comment",
        "opentagstart",
        "attribute",
        "opentag",
        "closetag",
        "opencdata",
        "cdata",
        "closecdata",
        "error",
        "end",
        "ready",
        "script",
        "opennamespace",
        "closenamespace"
      ];
      function SAXParser(strict, opt) {
        if (!(this instanceof SAXParser)) {
          return new SAXParser(strict, opt);
        }
        var parser = this;
        clearBuffers(parser);
        parser.q = parser.c = "";
        parser.bufferCheckPosition = sax.MAX_BUFFER_LENGTH;
        parser.opt = opt || {};
        parser.opt.lowercase = parser.opt.lowercase || parser.opt.lowercasetags;
        parser.looseCase = parser.opt.lowercase ? "toLowerCase" : "toUpperCase";
        parser.tags = [];
        parser.closed = parser.closedRoot = parser.sawRoot = false;
        parser.tag = parser.error = null;
        parser.strict = !!strict;
        parser.noscript = !!(strict || parser.opt.noscript);
        parser.state = S.BEGIN;
        parser.strictEntities = parser.opt.strictEntities;
        parser.ENTITIES = parser.strictEntities ? Object.create(sax.XML_ENTITIES) : Object.create(sax.ENTITIES);
        parser.attribList = [];
        if (parser.opt.xmlns) {
          parser.ns = Object.create(rootNS);
        }
        if (parser.opt.unquotedAttributeValues === void 0) {
          parser.opt.unquotedAttributeValues = !strict;
        }
        parser.trackPosition = parser.opt.position !== false;
        if (parser.trackPosition) {
          parser.position = parser.line = parser.column = 0;
        }
        emit(parser, "onready");
      }
      if (!Object.create) {
        Object.create = function(o) {
          function F() {
          }
          F.prototype = o;
          var newf = new F();
          return newf;
        };
      }
      if (!Object.keys) {
        Object.keys = function(o) {
          var a = [];
          for (var i in o) if (o.hasOwnProperty(i)) a.push(i);
          return a;
        };
      }
      function checkBufferLength(parser) {
        var maxAllowed = Math.max(sax.MAX_BUFFER_LENGTH, 10);
        var maxActual = 0;
        for (var i = 0, l = buffers.length; i < l; i++) {
          var len = parser[buffers[i]].length;
          if (len > maxAllowed) {
            switch (buffers[i]) {
              case "textNode":
                closeText(parser);
                break;
              case "cdata":
                emitNode(parser, "oncdata", parser.cdata);
                parser.cdata = "";
                break;
              case "script":
                emitNode(parser, "onscript", parser.script);
                parser.script = "";
                break;
              default:
                error(parser, "Max buffer length exceeded: " + buffers[i]);
            }
          }
          maxActual = Math.max(maxActual, len);
        }
        var m = sax.MAX_BUFFER_LENGTH - maxActual;
        parser.bufferCheckPosition = m + parser.position;
      }
      function clearBuffers(parser) {
        for (var i = 0, l = buffers.length; i < l; i++) {
          parser[buffers[i]] = "";
        }
      }
      function flushBuffers(parser) {
        closeText(parser);
        if (parser.cdata !== "") {
          emitNode(parser, "oncdata", parser.cdata);
          parser.cdata = "";
        }
        if (parser.script !== "") {
          emitNode(parser, "onscript", parser.script);
          parser.script = "";
        }
      }
      SAXParser.prototype = {
        end: function() {
          end(this);
        },
        write,
        resume: function() {
          this.error = null;
          return this;
        },
        close: function() {
          return this.write(null);
        },
        flush: function() {
          flushBuffers(this);
        }
      };
      var Stream;
      try {
        Stream = require("stream").Stream;
      } catch (ex) {
        Stream = function() {
        };
      }
      if (!Stream) Stream = function() {
      };
      var streamWraps = sax.EVENTS.filter(function(ev) {
        return ev !== "error" && ev !== "end";
      });
      function createStream(strict, opt) {
        return new SAXStream(strict, opt);
      }
      function SAXStream(strict, opt) {
        if (!(this instanceof SAXStream)) {
          return new SAXStream(strict, opt);
        }
        Stream.apply(this);
        this._parser = new SAXParser(strict, opt);
        this.writable = true;
        this.readable = true;
        var me = this;
        this._parser.onend = function() {
          me.emit("end");
        };
        this._parser.onerror = function(er) {
          me.emit("error", er);
          me._parser.error = null;
        };
        this._decoder = null;
        streamWraps.forEach(function(ev) {
          Object.defineProperty(me, "on" + ev, {
            get: function() {
              return me._parser["on" + ev];
            },
            set: function(h) {
              if (!h) {
                me.removeAllListeners(ev);
                me._parser["on" + ev] = h;
                return h;
              }
              me.on(ev, h);
            },
            enumerable: true,
            configurable: false
          });
        });
      }
      SAXStream.prototype = Object.create(Stream.prototype, {
        constructor: {
          value: SAXStream
        }
      });
      SAXStream.prototype.write = function(data) {
        if (typeof Buffer === "function" && typeof Buffer.isBuffer === "function" && Buffer.isBuffer(data)) {
          if (!this._decoder) {
            this._decoder = new TextDecoder("utf8");
          }
          data = this._decoder.decode(data, { stream: true });
        }
        this._parser.write(data.toString());
        this.emit("data", data);
        return true;
      };
      SAXStream.prototype.end = function(chunk) {
        if (chunk && chunk.length) {
          this.write(chunk);
        }
        if (this._decoder) {
          var remaining = this._decoder.decode();
          if (remaining) {
            this._parser.write(remaining);
            this.emit("data", remaining);
          }
        }
        this._parser.end();
        return true;
      };
      SAXStream.prototype.on = function(ev, handler) {
        var me = this;
        if (!me._parser["on" + ev] && streamWraps.indexOf(ev) !== -1) {
          me._parser["on" + ev] = function() {
            var args = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
            args.splice(0, 0, ev);
            me.emit.apply(me, args);
          };
        }
        return Stream.prototype.on.call(me, ev, handler);
      };
      var CDATA = "[CDATA[";
      var DOCTYPE = "DOCTYPE";
      var XML_NAMESPACE = "http://www.w3.org/XML/1998/namespace";
      var XMLNS_NAMESPACE = "http://www.w3.org/2000/xmlns/";
      var rootNS = { xml: XML_NAMESPACE, xmlns: XMLNS_NAMESPACE };
      var nameStart = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/;
      var nameBody = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
      var entityStart = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/;
      var entityBody = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
      function isWhitespace(c) {
        return c === " " || c === "\n" || c === "\r" || c === "	";
      }
      function isQuote(c) {
        return c === '"' || c === "'";
      }
      function isAttribEnd(c) {
        return c === ">" || isWhitespace(c);
      }
      function isMatch(regex, c) {
        return regex.test(c);
      }
      function notMatch(regex, c) {
        return !isMatch(regex, c);
      }
      var S = 0;
      sax.STATE = {
        BEGIN: S++,
        // leading byte order mark or whitespace
        BEGIN_WHITESPACE: S++,
        // leading whitespace
        TEXT: S++,
        // general stuff
        TEXT_ENTITY: S++,
        // &amp and such.
        OPEN_WAKA: S++,
        // <
        SGML_DECL: S++,
        // <!BLARG
        SGML_DECL_QUOTED: S++,
        // <!BLARG foo "bar
        DOCTYPE: S++,
        // <!DOCTYPE
        DOCTYPE_QUOTED: S++,
        // <!DOCTYPE "//blah
        DOCTYPE_DTD: S++,
        // <!DOCTYPE "//blah" [ ...
        DOCTYPE_DTD_QUOTED: S++,
        // <!DOCTYPE "//blah" [ "foo
        COMMENT_STARTING: S++,
        // <!-
        COMMENT: S++,
        // <!--
        COMMENT_ENDING: S++,
        // <!-- blah -
        COMMENT_ENDED: S++,
        // <!-- blah --
        CDATA: S++,
        // <![CDATA[ something
        CDATA_ENDING: S++,
        // ]
        CDATA_ENDING_2: S++,
        // ]]
        PROC_INST: S++,
        // <?hi
        PROC_INST_BODY: S++,
        // <?hi there
        PROC_INST_ENDING: S++,
        // <?hi "there" ?
        OPEN_TAG: S++,
        // <strong
        OPEN_TAG_SLASH: S++,
        // <strong /
        ATTRIB: S++,
        // <a
        ATTRIB_NAME: S++,
        // <a foo
        ATTRIB_NAME_SAW_WHITE: S++,
        // <a foo _
        ATTRIB_VALUE: S++,
        // <a foo=
        ATTRIB_VALUE_QUOTED: S++,
        // <a foo="bar
        ATTRIB_VALUE_CLOSED: S++,
        // <a foo="bar"
        ATTRIB_VALUE_UNQUOTED: S++,
        // <a foo=bar
        ATTRIB_VALUE_ENTITY_Q: S++,
        // <foo bar="&quot;"
        ATTRIB_VALUE_ENTITY_U: S++,
        // <foo bar=&quot
        CLOSE_TAG: S++,
        // </a
        CLOSE_TAG_SAW_WHITE: S++,
        // </a   >
        SCRIPT: S++,
        // <script> ...
        SCRIPT_ENDING: S++
        // <script> ... <
      };
      sax.XML_ENTITIES = {
        amp: "&",
        gt: ">",
        lt: "<",
        quot: '"',
        apos: "'"
      };
      sax.ENTITIES = {
        amp: "&",
        gt: ">",
        lt: "<",
        quot: '"',
        apos: "'",
        AElig: 198,
        Aacute: 193,
        Acirc: 194,
        Agrave: 192,
        Aring: 197,
        Atilde: 195,
        Auml: 196,
        Ccedil: 199,
        ETH: 208,
        Eacute: 201,
        Ecirc: 202,
        Egrave: 200,
        Euml: 203,
        Iacute: 205,
        Icirc: 206,
        Igrave: 204,
        Iuml: 207,
        Ntilde: 209,
        Oacute: 211,
        Ocirc: 212,
        Ograve: 210,
        Oslash: 216,
        Otilde: 213,
        Ouml: 214,
        THORN: 222,
        Uacute: 218,
        Ucirc: 219,
        Ugrave: 217,
        Uuml: 220,
        Yacute: 221,
        aacute: 225,
        acirc: 226,
        aelig: 230,
        agrave: 224,
        aring: 229,
        atilde: 227,
        auml: 228,
        ccedil: 231,
        eacute: 233,
        ecirc: 234,
        egrave: 232,
        eth: 240,
        euml: 235,
        iacute: 237,
        icirc: 238,
        igrave: 236,
        iuml: 239,
        ntilde: 241,
        oacute: 243,
        ocirc: 244,
        ograve: 242,
        oslash: 248,
        otilde: 245,
        ouml: 246,
        szlig: 223,
        thorn: 254,
        uacute: 250,
        ucirc: 251,
        ugrave: 249,
        uuml: 252,
        yacute: 253,
        yuml: 255,
        copy: 169,
        reg: 174,
        nbsp: 160,
        iexcl: 161,
        cent: 162,
        pound: 163,
        curren: 164,
        yen: 165,
        brvbar: 166,
        sect: 167,
        uml: 168,
        ordf: 170,
        laquo: 171,
        not: 172,
        shy: 173,
        macr: 175,
        deg: 176,
        plusmn: 177,
        sup1: 185,
        sup2: 178,
        sup3: 179,
        acute: 180,
        micro: 181,
        para: 182,
        middot: 183,
        cedil: 184,
        ordm: 186,
        raquo: 187,
        frac14: 188,
        frac12: 189,
        frac34: 190,
        iquest: 191,
        times: 215,
        divide: 247,
        OElig: 338,
        oelig: 339,
        Scaron: 352,
        scaron: 353,
        Yuml: 376,
        fnof: 402,
        circ: 710,
        tilde: 732,
        Alpha: 913,
        Beta: 914,
        Gamma: 915,
        Delta: 916,
        Epsilon: 917,
        Zeta: 918,
        Eta: 919,
        Theta: 920,
        Iota: 921,
        Kappa: 922,
        Lambda: 923,
        Mu: 924,
        Nu: 925,
        Xi: 926,
        Omicron: 927,
        Pi: 928,
        Rho: 929,
        Sigma: 931,
        Tau: 932,
        Upsilon: 933,
        Phi: 934,
        Chi: 935,
        Psi: 936,
        Omega: 937,
        alpha: 945,
        beta: 946,
        gamma: 947,
        delta: 948,
        epsilon: 949,
        zeta: 950,
        eta: 951,
        theta: 952,
        iota: 953,
        kappa: 954,
        lambda: 955,
        mu: 956,
        nu: 957,
        xi: 958,
        omicron: 959,
        pi: 960,
        rho: 961,
        sigmaf: 962,
        sigma: 963,
        tau: 964,
        upsilon: 965,
        phi: 966,
        chi: 967,
        psi: 968,
        omega: 969,
        thetasym: 977,
        upsih: 978,
        piv: 982,
        ensp: 8194,
        emsp: 8195,
        thinsp: 8201,
        zwnj: 8204,
        zwj: 8205,
        lrm: 8206,
        rlm: 8207,
        ndash: 8211,
        mdash: 8212,
        lsquo: 8216,
        rsquo: 8217,
        sbquo: 8218,
        ldquo: 8220,
        rdquo: 8221,
        bdquo: 8222,
        dagger: 8224,
        Dagger: 8225,
        bull: 8226,
        hellip: 8230,
        permil: 8240,
        prime: 8242,
        Prime: 8243,
        lsaquo: 8249,
        rsaquo: 8250,
        oline: 8254,
        frasl: 8260,
        euro: 8364,
        image: 8465,
        weierp: 8472,
        real: 8476,
        trade: 8482,
        alefsym: 8501,
        larr: 8592,
        uarr: 8593,
        rarr: 8594,
        darr: 8595,
        harr: 8596,
        crarr: 8629,
        lArr: 8656,
        uArr: 8657,
        rArr: 8658,
        dArr: 8659,
        hArr: 8660,
        forall: 8704,
        part: 8706,
        exist: 8707,
        empty: 8709,
        nabla: 8711,
        isin: 8712,
        notin: 8713,
        ni: 8715,
        prod: 8719,
        sum: 8721,
        minus: 8722,
        lowast: 8727,
        radic: 8730,
        prop: 8733,
        infin: 8734,
        ang: 8736,
        and: 8743,
        or: 8744,
        cap: 8745,
        cup: 8746,
        int: 8747,
        there4: 8756,
        sim: 8764,
        cong: 8773,
        asymp: 8776,
        ne: 8800,
        equiv: 8801,
        le: 8804,
        ge: 8805,
        sub: 8834,
        sup: 8835,
        nsub: 8836,
        sube: 8838,
        supe: 8839,
        oplus: 8853,
        otimes: 8855,
        perp: 8869,
        sdot: 8901,
        lceil: 8968,
        rceil: 8969,
        lfloor: 8970,
        rfloor: 8971,
        lang: 9001,
        rang: 9002,
        loz: 9674,
        spades: 9824,
        clubs: 9827,
        hearts: 9829,
        diams: 9830
      };
      Object.keys(sax.ENTITIES).forEach(function(key) {
        var e = sax.ENTITIES[key];
        var s2 = typeof e === "number" ? String.fromCharCode(e) : e;
        sax.ENTITIES[key] = s2;
      });
      for (var s in sax.STATE) {
        sax.STATE[sax.STATE[s]] = s;
      }
      S = sax.STATE;
      function emit(parser, event, data) {
        parser[event] && parser[event](data);
      }
      function emitNode(parser, nodeType, data) {
        if (parser.textNode) closeText(parser);
        emit(parser, nodeType, data);
      }
      function closeText(parser) {
        parser.textNode = textopts(parser.opt, parser.textNode);
        if (parser.textNode) emit(parser, "ontext", parser.textNode);
        parser.textNode = "";
      }
      function textopts(opt, text) {
        if (opt.trim) text = text.trim();
        if (opt.normalize) text = text.replace(/\s+/g, " ");
        return text;
      }
      function error(parser, er) {
        closeText(parser);
        if (parser.trackPosition) {
          er += "\nLine: " + parser.line + "\nColumn: " + parser.column + "\nChar: " + parser.c;
        }
        er = new Error(er);
        parser.error = er;
        emit(parser, "onerror", er);
        return parser;
      }
      function end(parser) {
        if (parser.sawRoot && !parser.closedRoot)
          strictFail(parser, "Unclosed root tag");
        if (parser.state !== S.BEGIN && parser.state !== S.BEGIN_WHITESPACE && parser.state !== S.TEXT) {
          error(parser, "Unexpected end");
        }
        closeText(parser);
        parser.c = "";
        parser.closed = true;
        emit(parser, "onend");
        SAXParser.call(parser, parser.strict, parser.opt);
        return parser;
      }
      function strictFail(parser, message) {
        if (typeof parser !== "object" || !(parser instanceof SAXParser)) {
          throw new Error("bad call to strictFail");
        }
        if (parser.strict) {
          error(parser, message);
        }
      }
      function newTag(parser) {
        if (!parser.strict) parser.tagName = parser.tagName[parser.looseCase]();
        var parent = parser.tags[parser.tags.length - 1] || parser;
        var tag = parser.tag = { name: parser.tagName, attributes: {} };
        if (parser.opt.xmlns) {
          tag.ns = parent.ns;
        }
        parser.attribList.length = 0;
        emitNode(parser, "onopentagstart", tag);
      }
      function qname(name, attribute) {
        var i = name.indexOf(":");
        var qualName = i < 0 ? ["", name] : name.split(":");
        var prefix = qualName[0];
        var local = qualName[1];
        if (attribute && name === "xmlns") {
          prefix = "xmlns";
          local = "";
        }
        return { prefix, local };
      }
      function attrib(parser) {
        if (!parser.strict) {
          parser.attribName = parser.attribName[parser.looseCase]();
        }
        if (parser.attribList.indexOf(parser.attribName) !== -1 || parser.tag.attributes.hasOwnProperty(parser.attribName)) {
          parser.attribName = parser.attribValue = "";
          return;
        }
        if (parser.opt.xmlns) {
          var qn = qname(parser.attribName, true);
          var prefix = qn.prefix;
          var local = qn.local;
          if (prefix === "xmlns") {
            if (local === "xml" && parser.attribValue !== XML_NAMESPACE) {
              strictFail(
                parser,
                "xml: prefix must be bound to " + XML_NAMESPACE + "\nActual: " + parser.attribValue
              );
            } else if (local === "xmlns" && parser.attribValue !== XMLNS_NAMESPACE) {
              strictFail(
                parser,
                "xmlns: prefix must be bound to " + XMLNS_NAMESPACE + "\nActual: " + parser.attribValue
              );
            } else {
              var tag = parser.tag;
              var parent = parser.tags[parser.tags.length - 1] || parser;
              if (tag.ns === parent.ns) {
                tag.ns = Object.create(parent.ns);
              }
              tag.ns[local] = parser.attribValue;
            }
          }
          parser.attribList.push([parser.attribName, parser.attribValue]);
        } else {
          parser.tag.attributes[parser.attribName] = parser.attribValue;
          emitNode(parser, "onattribute", {
            name: parser.attribName,
            value: parser.attribValue
          });
        }
        parser.attribName = parser.attribValue = "";
      }
      function openTag(parser, selfClosing) {
        if (parser.opt.xmlns) {
          var tag = parser.tag;
          var qn = qname(parser.tagName);
          tag.prefix = qn.prefix;
          tag.local = qn.local;
          tag.uri = tag.ns[qn.prefix] || "";
          if (tag.prefix && !tag.uri) {
            strictFail(
              parser,
              "Unbound namespace prefix: " + JSON.stringify(parser.tagName)
            );
            tag.uri = qn.prefix;
          }
          var parent = parser.tags[parser.tags.length - 1] || parser;
          if (tag.ns && parent.ns !== tag.ns) {
            Object.keys(tag.ns).forEach(function(p) {
              emitNode(parser, "onopennamespace", {
                prefix: p,
                uri: tag.ns[p]
              });
            });
          }
          for (var i = 0, l = parser.attribList.length; i < l; i++) {
            var nv = parser.attribList[i];
            var name = nv[0];
            var value = nv[1];
            var qualName = qname(name, true);
            var prefix = qualName.prefix;
            var local = qualName.local;
            var uri = prefix === "" ? "" : tag.ns[prefix] || "";
            var a = {
              name,
              value,
              prefix,
              local,
              uri
            };
            if (prefix && prefix !== "xmlns" && !uri) {
              strictFail(
                parser,
                "Unbound namespace prefix: " + JSON.stringify(prefix)
              );
              a.uri = prefix;
            }
            parser.tag.attributes[name] = a;
            emitNode(parser, "onattribute", a);
          }
          parser.attribList.length = 0;
        }
        parser.tag.isSelfClosing = !!selfClosing;
        parser.sawRoot = true;
        parser.tags.push(parser.tag);
        emitNode(parser, "onopentag", parser.tag);
        if (!selfClosing) {
          if (!parser.noscript && parser.tagName.toLowerCase() === "script") {
            parser.state = S.SCRIPT;
          } else {
            parser.state = S.TEXT;
          }
          parser.tag = null;
          parser.tagName = "";
        }
        parser.attribName = parser.attribValue = "";
        parser.attribList.length = 0;
      }
      function closeTag(parser) {
        if (!parser.tagName) {
          strictFail(parser, "Weird empty close tag.");
          parser.textNode += "</>";
          parser.state = S.TEXT;
          return;
        }
        if (parser.script) {
          if (parser.tagName !== "script") {
            parser.script += "</" + parser.tagName + ">";
            parser.tagName = "";
            parser.state = S.SCRIPT;
            return;
          }
          emitNode(parser, "onscript", parser.script);
          parser.script = "";
        }
        var t = parser.tags.length;
        var tagName = parser.tagName;
        if (!parser.strict) {
          tagName = tagName[parser.looseCase]();
        }
        var closeTo = tagName;
        while (t--) {
          var close = parser.tags[t];
          if (close.name !== closeTo) {
            strictFail(parser, "Unexpected close tag");
          } else {
            break;
          }
        }
        if (t < 0) {
          strictFail(parser, "Unmatched closing tag: " + parser.tagName);
          parser.textNode += "</" + parser.tagName + ">";
          parser.state = S.TEXT;
          return;
        }
        parser.tagName = tagName;
        var s2 = parser.tags.length;
        while (s2-- > t) {
          var tag = parser.tag = parser.tags.pop();
          parser.tagName = parser.tag.name;
          emitNode(parser, "onclosetag", parser.tagName);
          var x = {};
          for (var i in tag.ns) {
            x[i] = tag.ns[i];
          }
          var parent = parser.tags[parser.tags.length - 1] || parser;
          if (parser.opt.xmlns && tag.ns !== parent.ns) {
            Object.keys(tag.ns).forEach(function(p) {
              var n = tag.ns[p];
              emitNode(parser, "onclosenamespace", { prefix: p, uri: n });
            });
          }
        }
        if (t === 0) parser.closedRoot = true;
        parser.tagName = parser.attribValue = parser.attribName = "";
        parser.attribList.length = 0;
        parser.state = S.TEXT;
      }
      function parseEntity(parser) {
        var entity = parser.entity;
        var entityLC = entity.toLowerCase();
        var num;
        var numStr = "";
        if (parser.ENTITIES[entity]) {
          return parser.ENTITIES[entity];
        }
        if (parser.ENTITIES[entityLC]) {
          return parser.ENTITIES[entityLC];
        }
        entity = entityLC;
        if (entity.charAt(0) === "#") {
          if (entity.charAt(1) === "x") {
            entity = entity.slice(2);
            num = parseInt(entity, 16);
            numStr = num.toString(16);
          } else {
            entity = entity.slice(1);
            num = parseInt(entity, 10);
            numStr = num.toString(10);
          }
        }
        entity = entity.replace(/^0+/, "");
        if (isNaN(num) || numStr.toLowerCase() !== entity || num < 0 || num > 1114111) {
          strictFail(parser, "Invalid character entity");
          return "&" + parser.entity + ";";
        }
        return String.fromCodePoint(num);
      }
      function beginWhiteSpace(parser, c) {
        if (c === "<") {
          parser.state = S.OPEN_WAKA;
          parser.startTagPosition = parser.position;
        } else if (!isWhitespace(c)) {
          strictFail(parser, "Non-whitespace before first tag.");
          parser.textNode = c;
          parser.state = S.TEXT;
        }
      }
      function charAt(chunk, i) {
        var result = "";
        if (i < chunk.length) {
          result = chunk.charAt(i);
        }
        return result;
      }
      function write(chunk) {
        var parser = this;
        if (this.error) {
          throw this.error;
        }
        if (parser.closed) {
          return error(
            parser,
            "Cannot write after close. Assign an onready handler."
          );
        }
        if (chunk === null) {
          return end(parser);
        }
        if (typeof chunk === "object") {
          chunk = chunk.toString();
        }
        var i = 0;
        var c = "";
        while (true) {
          c = charAt(chunk, i++);
          parser.c = c;
          if (!c) {
            break;
          }
          if (parser.trackPosition) {
            parser.position++;
            if (c === "\n") {
              parser.line++;
              parser.column = 0;
            } else {
              parser.column++;
            }
          }
          switch (parser.state) {
            case S.BEGIN:
              parser.state = S.BEGIN_WHITESPACE;
              if (c === "\uFEFF") {
                continue;
              }
              beginWhiteSpace(parser, c);
              continue;
            case S.BEGIN_WHITESPACE:
              beginWhiteSpace(parser, c);
              continue;
            case S.TEXT:
              if (parser.sawRoot && !parser.closedRoot) {
                var starti = i - 1;
                while (c && c !== "<" && c !== "&") {
                  c = charAt(chunk, i++);
                  if (c && parser.trackPosition) {
                    parser.position++;
                    if (c === "\n") {
                      parser.line++;
                      parser.column = 0;
                    } else {
                      parser.column++;
                    }
                  }
                }
                parser.textNode += chunk.substring(starti, i - 1);
              }
              if (c === "<" && !(parser.sawRoot && parser.closedRoot && !parser.strict)) {
                parser.state = S.OPEN_WAKA;
                parser.startTagPosition = parser.position;
              } else {
                if (!isWhitespace(c) && (!parser.sawRoot || parser.closedRoot)) {
                  strictFail(parser, "Text data outside of root node.");
                }
                if (c === "&") {
                  parser.state = S.TEXT_ENTITY;
                } else {
                  parser.textNode += c;
                }
              }
              continue;
            case S.SCRIPT:
              if (c === "<") {
                parser.state = S.SCRIPT_ENDING;
              } else {
                parser.script += c;
              }
              continue;
            case S.SCRIPT_ENDING:
              if (c === "/") {
                parser.state = S.CLOSE_TAG;
              } else {
                parser.script += "<" + c;
                parser.state = S.SCRIPT;
              }
              continue;
            case S.OPEN_WAKA:
              if (c === "!") {
                parser.state = S.SGML_DECL;
                parser.sgmlDecl = "";
              } else if (isWhitespace(c)) {
              } else if (isMatch(nameStart, c)) {
                parser.state = S.OPEN_TAG;
                parser.tagName = c;
              } else if (c === "/") {
                parser.state = S.CLOSE_TAG;
                parser.tagName = "";
              } else if (c === "?") {
                parser.state = S.PROC_INST;
                parser.procInstName = parser.procInstBody = "";
              } else {
                strictFail(parser, "Unencoded <");
                if (parser.startTagPosition + 1 < parser.position) {
                  var pad = parser.position - parser.startTagPosition;
                  c = new Array(pad).join(" ") + c;
                }
                parser.textNode += "<" + c;
                parser.state = S.TEXT;
              }
              continue;
            case S.SGML_DECL:
              if (parser.sgmlDecl + c === "--") {
                parser.state = S.COMMENT;
                parser.comment = "";
                parser.sgmlDecl = "";
                continue;
              }
              if (parser.doctype && parser.doctype !== true && parser.sgmlDecl) {
                parser.state = S.DOCTYPE_DTD;
                parser.doctype += "<!" + parser.sgmlDecl + c;
                parser.sgmlDecl = "";
              } else if ((parser.sgmlDecl + c).toUpperCase() === CDATA) {
                emitNode(parser, "onopencdata");
                parser.state = S.CDATA;
                parser.sgmlDecl = "";
                parser.cdata = "";
              } else if ((parser.sgmlDecl + c).toUpperCase() === DOCTYPE) {
                parser.state = S.DOCTYPE;
                if (parser.doctype || parser.sawRoot) {
                  strictFail(
                    parser,
                    "Inappropriately located doctype declaration"
                  );
                }
                parser.doctype = "";
                parser.sgmlDecl = "";
              } else if (c === ">") {
                emitNode(parser, "onsgmldeclaration", parser.sgmlDecl);
                parser.sgmlDecl = "";
                parser.state = S.TEXT;
              } else if (isQuote(c)) {
                parser.state = S.SGML_DECL_QUOTED;
                parser.sgmlDecl += c;
              } else {
                parser.sgmlDecl += c;
              }
              continue;
            case S.SGML_DECL_QUOTED:
              if (c === parser.q) {
                parser.state = S.SGML_DECL;
                parser.q = "";
              }
              parser.sgmlDecl += c;
              continue;
            case S.DOCTYPE:
              if (c === ">") {
                parser.state = S.TEXT;
                emitNode(parser, "ondoctype", parser.doctype);
                parser.doctype = true;
              } else {
                parser.doctype += c;
                if (c === "[") {
                  parser.state = S.DOCTYPE_DTD;
                } else if (isQuote(c)) {
                  parser.state = S.DOCTYPE_QUOTED;
                  parser.q = c;
                }
              }
              continue;
            case S.DOCTYPE_QUOTED:
              parser.doctype += c;
              if (c === parser.q) {
                parser.q = "";
                parser.state = S.DOCTYPE;
              }
              continue;
            case S.DOCTYPE_DTD:
              if (c === "]") {
                parser.doctype += c;
                parser.state = S.DOCTYPE;
              } else if (c === "<") {
                parser.state = S.OPEN_WAKA;
                parser.startTagPosition = parser.position;
              } else if (isQuote(c)) {
                parser.doctype += c;
                parser.state = S.DOCTYPE_DTD_QUOTED;
                parser.q = c;
              } else {
                parser.doctype += c;
              }
              continue;
            case S.DOCTYPE_DTD_QUOTED:
              parser.doctype += c;
              if (c === parser.q) {
                parser.state = S.DOCTYPE_DTD;
                parser.q = "";
              }
              continue;
            case S.COMMENT:
              if (c === "-") {
                parser.state = S.COMMENT_ENDING;
              } else {
                parser.comment += c;
              }
              continue;
            case S.COMMENT_ENDING:
              if (c === "-") {
                parser.state = S.COMMENT_ENDED;
                parser.comment = textopts(parser.opt, parser.comment);
                if (parser.comment) {
                  emitNode(parser, "oncomment", parser.comment);
                }
                parser.comment = "";
              } else {
                parser.comment += "-" + c;
                parser.state = S.COMMENT;
              }
              continue;
            case S.COMMENT_ENDED:
              if (c !== ">") {
                strictFail(parser, "Malformed comment");
                parser.comment += "--" + c;
                parser.state = S.COMMENT;
              } else if (parser.doctype && parser.doctype !== true) {
                parser.state = S.DOCTYPE_DTD;
              } else {
                parser.state = S.TEXT;
              }
              continue;
            case S.CDATA:
              var starti = i - 1;
              while (c && c !== "]") {
                c = charAt(chunk, i++);
                if (c && parser.trackPosition) {
                  parser.position++;
                  if (c === "\n") {
                    parser.line++;
                    parser.column = 0;
                  } else {
                    parser.column++;
                  }
                }
              }
              parser.cdata += chunk.substring(starti, i - 1);
              if (c === "]") {
                parser.state = S.CDATA_ENDING;
              }
              continue;
            case S.CDATA_ENDING:
              if (c === "]") {
                parser.state = S.CDATA_ENDING_2;
              } else {
                parser.cdata += "]" + c;
                parser.state = S.CDATA;
              }
              continue;
            case S.CDATA_ENDING_2:
              if (c === ">") {
                if (parser.cdata) {
                  emitNode(parser, "oncdata", parser.cdata);
                }
                emitNode(parser, "onclosecdata");
                parser.cdata = "";
                parser.state = S.TEXT;
              } else if (c === "]") {
                parser.cdata += "]";
              } else {
                parser.cdata += "]]" + c;
                parser.state = S.CDATA;
              }
              continue;
            case S.PROC_INST:
              if (c === "?") {
                parser.state = S.PROC_INST_ENDING;
              } else if (isWhitespace(c)) {
                parser.state = S.PROC_INST_BODY;
              } else {
                parser.procInstName += c;
              }
              continue;
            case S.PROC_INST_BODY:
              if (!parser.procInstBody && isWhitespace(c)) {
                continue;
              } else if (c === "?") {
                parser.state = S.PROC_INST_ENDING;
              } else {
                parser.procInstBody += c;
              }
              continue;
            case S.PROC_INST_ENDING:
              if (c === ">") {
                emitNode(parser, "onprocessinginstruction", {
                  name: parser.procInstName,
                  body: parser.procInstBody
                });
                parser.procInstName = parser.procInstBody = "";
                parser.state = S.TEXT;
              } else {
                parser.procInstBody += "?" + c;
                parser.state = S.PROC_INST_BODY;
              }
              continue;
            case S.OPEN_TAG:
              if (isMatch(nameBody, c)) {
                parser.tagName += c;
              } else {
                newTag(parser);
                if (c === ">") {
                  openTag(parser);
                } else if (c === "/") {
                  parser.state = S.OPEN_TAG_SLASH;
                } else {
                  if (!isWhitespace(c)) {
                    strictFail(parser, "Invalid character in tag name");
                  }
                  parser.state = S.ATTRIB;
                }
              }
              continue;
            case S.OPEN_TAG_SLASH:
              if (c === ">") {
                openTag(parser, true);
                closeTag(parser);
              } else {
                strictFail(
                  parser,
                  "Forward-slash in opening tag not followed by >"
                );
                parser.state = S.ATTRIB;
              }
              continue;
            case S.ATTRIB:
              if (isWhitespace(c)) {
                continue;
              } else if (c === ">") {
                openTag(parser);
              } else if (c === "/") {
                parser.state = S.OPEN_TAG_SLASH;
              } else if (isMatch(nameStart, c)) {
                parser.attribName = c;
                parser.attribValue = "";
                parser.state = S.ATTRIB_NAME;
              } else {
                strictFail(parser, "Invalid attribute name");
              }
              continue;
            case S.ATTRIB_NAME:
              if (c === "=") {
                parser.state = S.ATTRIB_VALUE;
              } else if (c === ">") {
                strictFail(parser, "Attribute without value");
                parser.attribValue = parser.attribName;
                attrib(parser);
                openTag(parser);
              } else if (isWhitespace(c)) {
                parser.state = S.ATTRIB_NAME_SAW_WHITE;
              } else if (isMatch(nameBody, c)) {
                parser.attribName += c;
              } else {
                strictFail(parser, "Invalid attribute name");
              }
              continue;
            case S.ATTRIB_NAME_SAW_WHITE:
              if (c === "=") {
                parser.state = S.ATTRIB_VALUE;
              } else if (isWhitespace(c)) {
                continue;
              } else {
                strictFail(parser, "Attribute without value");
                parser.tag.attributes[parser.attribName] = "";
                parser.attribValue = "";
                emitNode(parser, "onattribute", {
                  name: parser.attribName,
                  value: ""
                });
                parser.attribName = "";
                if (c === ">") {
                  openTag(parser);
                } else if (isMatch(nameStart, c)) {
                  parser.attribName = c;
                  parser.state = S.ATTRIB_NAME;
                } else {
                  strictFail(parser, "Invalid attribute name");
                  parser.state = S.ATTRIB;
                }
              }
              continue;
            case S.ATTRIB_VALUE:
              if (isWhitespace(c)) {
                continue;
              } else if (isQuote(c)) {
                parser.q = c;
                parser.state = S.ATTRIB_VALUE_QUOTED;
              } else {
                if (!parser.opt.unquotedAttributeValues) {
                  error(parser, "Unquoted attribute value");
                }
                parser.state = S.ATTRIB_VALUE_UNQUOTED;
                parser.attribValue = c;
              }
              continue;
            case S.ATTRIB_VALUE_QUOTED:
              if (c !== parser.q) {
                if (c === "&") {
                  parser.state = S.ATTRIB_VALUE_ENTITY_Q;
                } else {
                  parser.attribValue += c;
                }
                continue;
              }
              attrib(parser);
              parser.q = "";
              parser.state = S.ATTRIB_VALUE_CLOSED;
              continue;
            case S.ATTRIB_VALUE_CLOSED:
              if (isWhitespace(c)) {
                parser.state = S.ATTRIB;
              } else if (c === ">") {
                openTag(parser);
              } else if (c === "/") {
                parser.state = S.OPEN_TAG_SLASH;
              } else if (isMatch(nameStart, c)) {
                strictFail(parser, "No whitespace between attributes");
                parser.attribName = c;
                parser.attribValue = "";
                parser.state = S.ATTRIB_NAME;
              } else {
                strictFail(parser, "Invalid attribute name");
              }
              continue;
            case S.ATTRIB_VALUE_UNQUOTED:
              if (!isAttribEnd(c)) {
                if (c === "&") {
                  parser.state = S.ATTRIB_VALUE_ENTITY_U;
                } else {
                  parser.attribValue += c;
                }
                continue;
              }
              attrib(parser);
              if (c === ">") {
                openTag(parser);
              } else {
                parser.state = S.ATTRIB;
              }
              continue;
            case S.CLOSE_TAG:
              if (!parser.tagName) {
                if (isWhitespace(c)) {
                  continue;
                } else if (notMatch(nameStart, c)) {
                  if (parser.script) {
                    parser.script += "</" + c;
                    parser.state = S.SCRIPT;
                  } else {
                    strictFail(parser, "Invalid tagname in closing tag.");
                  }
                } else {
                  parser.tagName = c;
                }
              } else if (c === ">") {
                closeTag(parser);
              } else if (isMatch(nameBody, c)) {
                parser.tagName += c;
              } else if (parser.script) {
                parser.script += "</" + parser.tagName + c;
                parser.tagName = "";
                parser.state = S.SCRIPT;
              } else {
                if (!isWhitespace(c)) {
                  strictFail(parser, "Invalid tagname in closing tag");
                }
                parser.state = S.CLOSE_TAG_SAW_WHITE;
              }
              continue;
            case S.CLOSE_TAG_SAW_WHITE:
              if (isWhitespace(c)) {
                continue;
              }
              if (c === ">") {
                closeTag(parser);
              } else {
                strictFail(parser, "Invalid characters in closing tag");
              }
              continue;
            case S.TEXT_ENTITY:
            case S.ATTRIB_VALUE_ENTITY_Q:
            case S.ATTRIB_VALUE_ENTITY_U:
              var returnState;
              var buffer;
              switch (parser.state) {
                case S.TEXT_ENTITY:
                  returnState = S.TEXT;
                  buffer = "textNode";
                  break;
                case S.ATTRIB_VALUE_ENTITY_Q:
                  returnState = S.ATTRIB_VALUE_QUOTED;
                  buffer = "attribValue";
                  break;
                case S.ATTRIB_VALUE_ENTITY_U:
                  returnState = S.ATTRIB_VALUE_UNQUOTED;
                  buffer = "attribValue";
                  break;
              }
              if (c === ";") {
                var parsedEntity = parseEntity(parser);
                if (parser.opt.unparsedEntities && !Object.values(sax.XML_ENTITIES).includes(parsedEntity)) {
                  parser.entity = "";
                  parser.state = returnState;
                  parser.write(parsedEntity);
                } else {
                  parser[buffer] += parsedEntity;
                  parser.entity = "";
                  parser.state = returnState;
                }
              } else if (isMatch(parser.entity.length ? entityBody : entityStart, c)) {
                parser.entity += c;
              } else {
                strictFail(parser, "Invalid character in entity name");
                parser[buffer] += "&" + parser.entity + c;
                parser.entity = "";
                parser.state = returnState;
              }
              continue;
            default: {
              throw new Error(parser, "Unknown state: " + parser.state);
            }
          }
        }
        if (parser.position >= parser.bufferCheckPosition) {
          checkBufferLength(parser);
        }
        return parser;
      }
      if (!String.fromCodePoint) {
        ;
        (function() {
          var stringFromCharCode = String.fromCharCode;
          var floor = Math.floor;
          var fromCodePoint = function() {
            var MAX_SIZE = 16384;
            var codeUnits = [];
            var highSurrogate;
            var lowSurrogate;
            var index = -1;
            var length = arguments.length;
            if (!length) {
              return "";
            }
            var result = "";
            while (++index < length) {
              var codePoint = Number(arguments[index]);
              if (!isFinite(codePoint) || // `NaN`, `+Infinity`, or `-Infinity`
              codePoint < 0 || // not a valid Unicode code point
              codePoint > 1114111 || // not a valid Unicode code point
              floor(codePoint) !== codePoint) {
                throw RangeError("Invalid code point: " + codePoint);
              }
              if (codePoint <= 65535) {
                codeUnits.push(codePoint);
              } else {
                codePoint -= 65536;
                highSurrogate = (codePoint >> 10) + 55296;
                lowSurrogate = codePoint % 1024 + 56320;
                codeUnits.push(highSurrogate, lowSurrogate);
              }
              if (index + 1 === length || codeUnits.length > MAX_SIZE) {
                result += stringFromCharCode.apply(null, codeUnits);
                codeUnits.length = 0;
              }
            }
            return result;
          };
          if (Object.defineProperty) {
            Object.defineProperty(String, "fromCodePoint", {
              value: fromCodePoint,
              configurable: true,
              writable: true
            });
          } else {
            String.fromCodePoint = fromCodePoint;
          }
        })();
      }
    })(typeof exports2 === "undefined" ? exports2.sax = {} : exports2);
  }
});

// node_modules/xml2js/lib/bom.js
var require_bom = __commonJS({
  "node_modules/xml2js/lib/bom.js"(exports2) {
    (function() {
      "use strict";
      exports2.stripBOM = function(str) {
        if (str[0] === "\uFEFF") {
          return str.substring(1);
        } else {
          return str;
        }
      };
    }).call(exports2);
  }
});

// node_modules/xml2js/lib/processors.js
var require_processors = __commonJS({
  "node_modules/xml2js/lib/processors.js"(exports2) {
    (function() {
      "use strict";
      var prefixMatch;
      prefixMatch = new RegExp(/(?!xmlns)^.*:/);
      exports2.normalize = function(str) {
        return str.toLowerCase();
      };
      exports2.firstCharLowerCase = function(str) {
        return str.charAt(0).toLowerCase() + str.slice(1);
      };
      exports2.stripPrefix = function(str) {
        return str.replace(prefixMatch, "");
      };
      exports2.parseNumbers = function(str) {
        if (!isNaN(str)) {
          str = str % 1 === 0 ? parseInt(str, 10) : parseFloat(str);
        }
        return str;
      };
      exports2.parseBooleans = function(str) {
        if (/^(?:true|false)$/i.test(str)) {
          str = str.toLowerCase() === "true";
        }
        return str;
      };
    }).call(exports2);
  }
});

// node_modules/xml2js/lib/parser.js
var require_parser = __commonJS({
  "node_modules/xml2js/lib/parser.js"(exports2) {
    (function() {
      "use strict";
      var bom, defaults, defineProperty, events, isEmpty, processItem, processors, sax, setImmediate, bind = function(fn, me) {
        return function() {
          return fn.apply(me, arguments);
        };
      }, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      sax = require_sax();
      events = require("events");
      bom = require_bom();
      processors = require_processors();
      setImmediate = require("timers").setImmediate;
      defaults = require_defaults().defaults;
      isEmpty = function(thing) {
        return typeof thing === "object" && thing != null && Object.keys(thing).length === 0;
      };
      processItem = function(processors2, item, key) {
        var i, len, process3;
        for (i = 0, len = processors2.length; i < len; i++) {
          process3 = processors2[i];
          item = process3(item, key);
        }
        return item;
      };
      defineProperty = function(obj, key, value) {
        var descriptor;
        descriptor = /* @__PURE__ */ Object.create(null);
        descriptor.value = value;
        descriptor.writable = true;
        descriptor.enumerable = true;
        descriptor.configurable = true;
        return Object.defineProperty(obj, key, descriptor);
      };
      exports2.Parser = (function(superClass) {
        extend(Parser, superClass);
        function Parser(opts) {
          this.parseStringPromise = bind(this.parseStringPromise, this);
          this.parseString = bind(this.parseString, this);
          this.reset = bind(this.reset, this);
          this.assignOrPush = bind(this.assignOrPush, this);
          this.processAsync = bind(this.processAsync, this);
          var key, ref, value;
          if (!(this instanceof exports2.Parser)) {
            return new exports2.Parser(opts);
          }
          this.options = {};
          ref = defaults["0.2"];
          for (key in ref) {
            if (!hasProp.call(ref, key)) continue;
            value = ref[key];
            this.options[key] = value;
          }
          for (key in opts) {
            if (!hasProp.call(opts, key)) continue;
            value = opts[key];
            this.options[key] = value;
          }
          if (this.options.xmlns) {
            this.options.xmlnskey = this.options.attrkey + "ns";
          }
          if (this.options.normalizeTags) {
            if (!this.options.tagNameProcessors) {
              this.options.tagNameProcessors = [];
            }
            this.options.tagNameProcessors.unshift(processors.normalize);
          }
          this.reset();
        }
        Parser.prototype.processAsync = function() {
          var chunk, err;
          try {
            if (this.remaining.length <= this.options.chunkSize) {
              chunk = this.remaining;
              this.remaining = "";
              this.saxParser = this.saxParser.write(chunk);
              return this.saxParser.close();
            } else {
              chunk = this.remaining.substr(0, this.options.chunkSize);
              this.remaining = this.remaining.substr(this.options.chunkSize, this.remaining.length);
              this.saxParser = this.saxParser.write(chunk);
              return setImmediate(this.processAsync);
            }
          } catch (error1) {
            err = error1;
            if (!this.saxParser.errThrown) {
              this.saxParser.errThrown = true;
              return this.emit(err);
            }
          }
        };
        Parser.prototype.assignOrPush = function(obj, key, newValue) {
          if (!(key in obj)) {
            if (!this.options.explicitArray) {
              return defineProperty(obj, key, newValue);
            } else {
              return defineProperty(obj, key, [newValue]);
            }
          } else {
            if (!(obj[key] instanceof Array)) {
              defineProperty(obj, key, [obj[key]]);
            }
            return obj[key].push(newValue);
          }
        };
        Parser.prototype.reset = function() {
          var attrkey, charkey, ontext, stack;
          this.removeAllListeners();
          this.saxParser = sax.parser(this.options.strict, {
            trim: false,
            normalize: false,
            xmlns: this.options.xmlns
          });
          this.saxParser.errThrown = false;
          this.saxParser.onerror = /* @__PURE__ */ (function(_this) {
            return function(error) {
              _this.saxParser.resume();
              if (!_this.saxParser.errThrown) {
                _this.saxParser.errThrown = true;
                return _this.emit("error", error);
              }
            };
          })(this);
          this.saxParser.onend = /* @__PURE__ */ (function(_this) {
            return function() {
              if (!_this.saxParser.ended) {
                _this.saxParser.ended = true;
                return _this.emit("end", _this.resultObject);
              }
            };
          })(this);
          this.saxParser.ended = false;
          this.EXPLICIT_CHARKEY = this.options.explicitCharkey;
          this.resultObject = null;
          stack = [];
          attrkey = this.options.attrkey;
          charkey = this.options.charkey;
          this.saxParser.onopentag = /* @__PURE__ */ (function(_this) {
            return function(node) {
              var key, newValue, obj, processedKey, ref;
              obj = {};
              obj[charkey] = "";
              if (!_this.options.ignoreAttrs) {
                ref = node.attributes;
                for (key in ref) {
                  if (!hasProp.call(ref, key)) continue;
                  if (!(attrkey in obj) && !_this.options.mergeAttrs) {
                    obj[attrkey] = {};
                  }
                  newValue = _this.options.attrValueProcessors ? processItem(_this.options.attrValueProcessors, node.attributes[key], key) : node.attributes[key];
                  processedKey = _this.options.attrNameProcessors ? processItem(_this.options.attrNameProcessors, key) : key;
                  if (_this.options.mergeAttrs) {
                    _this.assignOrPush(obj, processedKey, newValue);
                  } else {
                    defineProperty(obj[attrkey], processedKey, newValue);
                  }
                }
              }
              obj["#name"] = _this.options.tagNameProcessors ? processItem(_this.options.tagNameProcessors, node.name) : node.name;
              if (_this.options.xmlns) {
                obj[_this.options.xmlnskey] = {
                  uri: node.uri,
                  local: node.local
                };
              }
              return stack.push(obj);
            };
          })(this);
          this.saxParser.onclosetag = /* @__PURE__ */ (function(_this) {
            return function() {
              var cdata, emptyStr, key, node, nodeName, obj, objClone, old, s, xpath;
              obj = stack.pop();
              nodeName = obj["#name"];
              if (!_this.options.explicitChildren || !_this.options.preserveChildrenOrder) {
                delete obj["#name"];
              }
              if (obj.cdata === true) {
                cdata = obj.cdata;
                delete obj.cdata;
              }
              s = stack[stack.length - 1];
              if (obj[charkey].match(/^\s*$/) && !cdata) {
                emptyStr = obj[charkey];
                delete obj[charkey];
              } else {
                if (_this.options.trim) {
                  obj[charkey] = obj[charkey].trim();
                }
                if (_this.options.normalize) {
                  obj[charkey] = obj[charkey].replace(/\s{2,}/g, " ").trim();
                }
                obj[charkey] = _this.options.valueProcessors ? processItem(_this.options.valueProcessors, obj[charkey], nodeName) : obj[charkey];
                if (Object.keys(obj).length === 1 && charkey in obj && !_this.EXPLICIT_CHARKEY) {
                  obj = obj[charkey];
                }
              }
              if (isEmpty(obj)) {
                if (typeof _this.options.emptyTag === "function") {
                  obj = _this.options.emptyTag();
                } else {
                  obj = _this.options.emptyTag !== "" ? _this.options.emptyTag : emptyStr;
                }
              }
              if (_this.options.validator != null) {
                xpath = "/" + (function() {
                  var i, len, results;
                  results = [];
                  for (i = 0, len = stack.length; i < len; i++) {
                    node = stack[i];
                    results.push(node["#name"]);
                  }
                  return results;
                })().concat(nodeName).join("/");
                (function() {
                  var err;
                  try {
                    return obj = _this.options.validator(xpath, s && s[nodeName], obj);
                  } catch (error1) {
                    err = error1;
                    return _this.emit("error", err);
                  }
                })();
              }
              if (_this.options.explicitChildren && !_this.options.mergeAttrs && typeof obj === "object") {
                if (!_this.options.preserveChildrenOrder) {
                  node = {};
                  if (_this.options.attrkey in obj) {
                    node[_this.options.attrkey] = obj[_this.options.attrkey];
                    delete obj[_this.options.attrkey];
                  }
                  if (!_this.options.charsAsChildren && _this.options.charkey in obj) {
                    node[_this.options.charkey] = obj[_this.options.charkey];
                    delete obj[_this.options.charkey];
                  }
                  if (Object.getOwnPropertyNames(obj).length > 0) {
                    node[_this.options.childkey] = obj;
                  }
                  obj = node;
                } else if (s) {
                  s[_this.options.childkey] = s[_this.options.childkey] || [];
                  objClone = {};
                  for (key in obj) {
                    if (!hasProp.call(obj, key)) continue;
                    defineProperty(objClone, key, obj[key]);
                  }
                  s[_this.options.childkey].push(objClone);
                  delete obj["#name"];
                  if (Object.keys(obj).length === 1 && charkey in obj && !_this.EXPLICIT_CHARKEY) {
                    obj = obj[charkey];
                  }
                }
              }
              if (stack.length > 0) {
                return _this.assignOrPush(s, nodeName, obj);
              } else {
                if (_this.options.explicitRoot) {
                  old = obj;
                  obj = {};
                  defineProperty(obj, nodeName, old);
                }
                _this.resultObject = obj;
                _this.saxParser.ended = true;
                return _this.emit("end", _this.resultObject);
              }
            };
          })(this);
          ontext = /* @__PURE__ */ (function(_this) {
            return function(text) {
              var charChild, s;
              s = stack[stack.length - 1];
              if (s) {
                s[charkey] += text;
                if (_this.options.explicitChildren && _this.options.preserveChildrenOrder && _this.options.charsAsChildren && (_this.options.includeWhiteChars || text.replace(/\\n/g, "").trim() !== "")) {
                  s[_this.options.childkey] = s[_this.options.childkey] || [];
                  charChild = {
                    "#name": "__text__"
                  };
                  charChild[charkey] = text;
                  if (_this.options.normalize) {
                    charChild[charkey] = charChild[charkey].replace(/\s{2,}/g, " ").trim();
                  }
                  s[_this.options.childkey].push(charChild);
                }
                return s;
              }
            };
          })(this);
          this.saxParser.ontext = ontext;
          return this.saxParser.oncdata = /* @__PURE__ */ (function(_this) {
            return function(text) {
              var s;
              s = ontext(text);
              if (s) {
                return s.cdata = true;
              }
            };
          })(this);
        };
        Parser.prototype.parseString = function(str, cb) {
          var err;
          if (cb != null && typeof cb === "function") {
            this.on("end", function(result) {
              this.reset();
              return cb(null, result);
            });
            this.on("error", function(err2) {
              this.reset();
              return cb(err2);
            });
          }
          try {
            str = str.toString();
            if (str.trim() === "") {
              this.emit("end", null);
              return true;
            }
            str = bom.stripBOM(str);
            if (this.options.async) {
              this.remaining = str;
              setImmediate(this.processAsync);
              return this.saxParser;
            }
            return this.saxParser.write(str).close();
          } catch (error1) {
            err = error1;
            if (!(this.saxParser.errThrown || this.saxParser.ended)) {
              this.emit("error", err);
              return this.saxParser.errThrown = true;
            } else if (this.saxParser.ended) {
              throw err;
            }
          }
        };
        Parser.prototype.parseStringPromise = function(str) {
          return new Promise(/* @__PURE__ */ (function(_this) {
            return function(resolve, reject) {
              return _this.parseString(str, function(err, value) {
                if (err) {
                  return reject(err);
                } else {
                  return resolve(value);
                }
              });
            };
          })(this));
        };
        return Parser;
      })(events);
      exports2.parseString = function(str, a, b) {
        var cb, options2, parser;
        if (b != null) {
          if (typeof b === "function") {
            cb = b;
          }
          if (typeof a === "object") {
            options2 = a;
          }
        } else {
          if (typeof a === "function") {
            cb = a;
          }
          options2 = {};
        }
        parser = new exports2.Parser(options2);
        return parser.parseString(str, cb);
      };
      exports2.parseStringPromise = function(str, a) {
        var options2, parser;
        if (typeof a === "object") {
          options2 = a;
        }
        parser = new exports2.Parser(options2);
        return parser.parseStringPromise(str);
      };
    }).call(exports2);
  }
});

// node_modules/xml2js/lib/xml2js.js
var require_xml2js = __commonJS({
  "node_modules/xml2js/lib/xml2js.js"(exports2) {
    (function() {
      "use strict";
      var builder, defaults, parser, processors, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      defaults = require_defaults();
      builder = require_builder();
      parser = require_parser();
      processors = require_processors();
      exports2.defaults = defaults.defaults;
      exports2.processors = processors;
      exports2.ValidationError = (function(superClass) {
        extend(ValidationError, superClass);
        function ValidationError(message) {
          this.message = message;
        }
        return ValidationError;
      })(Error);
      exports2.Builder = builder.Builder;
      exports2.Parser = parser.Parser;
      exports2.parseString = parser.parseString;
      exports2.parseStringPromise = parser.parseStringPromise;
    }).call(exports2);
  }
});

// node_modules/@modelcontextprotocol/sdk/dist/types.js
var types_exports = {};
__export(types_exports, {
  BlobResourceContentsSchema: () => BlobResourceContentsSchema,
  CallToolRequestSchema: () => CallToolRequestSchema,
  CallToolResultSchema: () => CallToolResultSchema,
  CancelledNotificationSchema: () => CancelledNotificationSchema,
  ClientCapabilitiesSchema: () => ClientCapabilitiesSchema,
  ClientNotificationSchema: () => ClientNotificationSchema,
  ClientRequestSchema: () => ClientRequestSchema,
  ClientResultSchema: () => ClientResultSchema,
  CompatibilityCallToolResultSchema: () => CompatibilityCallToolResultSchema,
  CompleteRequestSchema: () => CompleteRequestSchema,
  CompleteResultSchema: () => CompleteResultSchema,
  CreateMessageRequestSchema: () => CreateMessageRequestSchema,
  CreateMessageResultSchema: () => CreateMessageResultSchema,
  CursorSchema: () => CursorSchema,
  EmbeddedResourceSchema: () => EmbeddedResourceSchema,
  EmptyResultSchema: () => EmptyResultSchema,
  ErrorCode: () => ErrorCode,
  GetPromptRequestSchema: () => GetPromptRequestSchema,
  GetPromptResultSchema: () => GetPromptResultSchema,
  ImageContentSchema: () => ImageContentSchema,
  ImplementationSchema: () => ImplementationSchema,
  InitializeRequestSchema: () => InitializeRequestSchema,
  InitializeResultSchema: () => InitializeResultSchema,
  InitializedNotificationSchema: () => InitializedNotificationSchema,
  JSONRPCErrorSchema: () => JSONRPCErrorSchema,
  JSONRPCMessageSchema: () => JSONRPCMessageSchema,
  JSONRPCNotificationSchema: () => JSONRPCNotificationSchema,
  JSONRPCRequestSchema: () => JSONRPCRequestSchema,
  JSONRPCResponseSchema: () => JSONRPCResponseSchema,
  JSONRPC_VERSION: () => JSONRPC_VERSION,
  LATEST_PROTOCOL_VERSION: () => LATEST_PROTOCOL_VERSION,
  ListPromptsRequestSchema: () => ListPromptsRequestSchema,
  ListPromptsResultSchema: () => ListPromptsResultSchema,
  ListResourceTemplatesRequestSchema: () => ListResourceTemplatesRequestSchema,
  ListResourceTemplatesResultSchema: () => ListResourceTemplatesResultSchema,
  ListResourcesRequestSchema: () => ListResourcesRequestSchema,
  ListResourcesResultSchema: () => ListResourcesResultSchema,
  ListRootsRequestSchema: () => ListRootsRequestSchema,
  ListRootsResultSchema: () => ListRootsResultSchema,
  ListToolsRequestSchema: () => ListToolsRequestSchema,
  ListToolsResultSchema: () => ListToolsResultSchema,
  LoggingLevelSchema: () => LoggingLevelSchema,
  LoggingMessageNotificationSchema: () => LoggingMessageNotificationSchema,
  McpError: () => McpError,
  ModelHintSchema: () => ModelHintSchema,
  ModelPreferencesSchema: () => ModelPreferencesSchema,
  NotificationSchema: () => NotificationSchema,
  PaginatedRequestSchema: () => PaginatedRequestSchema,
  PaginatedResultSchema: () => PaginatedResultSchema,
  PingRequestSchema: () => PingRequestSchema,
  ProgressNotificationSchema: () => ProgressNotificationSchema,
  ProgressSchema: () => ProgressSchema,
  ProgressTokenSchema: () => ProgressTokenSchema,
  PromptArgumentSchema: () => PromptArgumentSchema,
  PromptListChangedNotificationSchema: () => PromptListChangedNotificationSchema,
  PromptMessageSchema: () => PromptMessageSchema,
  PromptReferenceSchema: () => PromptReferenceSchema,
  PromptSchema: () => PromptSchema,
  ReadResourceRequestSchema: () => ReadResourceRequestSchema,
  ReadResourceResultSchema: () => ReadResourceResultSchema,
  RequestIdSchema: () => RequestIdSchema,
  RequestSchema: () => RequestSchema,
  ResourceContentsSchema: () => ResourceContentsSchema,
  ResourceListChangedNotificationSchema: () => ResourceListChangedNotificationSchema,
  ResourceReferenceSchema: () => ResourceReferenceSchema,
  ResourceSchema: () => ResourceSchema,
  ResourceTemplateSchema: () => ResourceTemplateSchema,
  ResourceUpdatedNotificationSchema: () => ResourceUpdatedNotificationSchema,
  ResultSchema: () => ResultSchema,
  RootSchema: () => RootSchema,
  RootsListChangedNotificationSchema: () => RootsListChangedNotificationSchema,
  SUPPORTED_PROTOCOL_VERSIONS: () => SUPPORTED_PROTOCOL_VERSIONS,
  SamplingMessageSchema: () => SamplingMessageSchema,
  ServerCapabilitiesSchema: () => ServerCapabilitiesSchema,
  ServerNotificationSchema: () => ServerNotificationSchema,
  ServerRequestSchema: () => ServerRequestSchema,
  ServerResultSchema: () => ServerResultSchema,
  SetLevelRequestSchema: () => SetLevelRequestSchema,
  SubscribeRequestSchema: () => SubscribeRequestSchema,
  TextContentSchema: () => TextContentSchema,
  TextResourceContentsSchema: () => TextResourceContentsSchema,
  ToolListChangedNotificationSchema: () => ToolListChangedNotificationSchema,
  ToolSchema: () => ToolSchema,
  UnsubscribeRequestSchema: () => UnsubscribeRequestSchema
});
var LATEST_PROTOCOL_VERSION, SUPPORTED_PROTOCOL_VERSIONS, JSONRPC_VERSION, ProgressTokenSchema, CursorSchema, BaseRequestParamsSchema, RequestSchema, BaseNotificationParamsSchema, NotificationSchema, ResultSchema, RequestIdSchema, JSONRPCRequestSchema, JSONRPCNotificationSchema, JSONRPCResponseSchema, ErrorCode, JSONRPCErrorSchema, JSONRPCMessageSchema, EmptyResultSchema, CancelledNotificationSchema, ImplementationSchema, ClientCapabilitiesSchema, InitializeRequestSchema, ServerCapabilitiesSchema, InitializeResultSchema, InitializedNotificationSchema, PingRequestSchema, ProgressSchema, ProgressNotificationSchema, PaginatedRequestSchema, PaginatedResultSchema, ResourceContentsSchema, TextResourceContentsSchema, BlobResourceContentsSchema, ResourceSchema, ResourceTemplateSchema, ListResourcesRequestSchema, ListResourcesResultSchema, ListResourceTemplatesRequestSchema, ListResourceTemplatesResultSchema, ReadResourceRequestSchema, ReadResourceResultSchema, ResourceListChangedNotificationSchema, SubscribeRequestSchema, UnsubscribeRequestSchema, ResourceUpdatedNotificationSchema, PromptArgumentSchema, PromptSchema, ListPromptsRequestSchema, ListPromptsResultSchema, GetPromptRequestSchema, TextContentSchema, ImageContentSchema, EmbeddedResourceSchema, PromptMessageSchema, GetPromptResultSchema, PromptListChangedNotificationSchema, ToolSchema, ListToolsRequestSchema, ListToolsResultSchema, CallToolResultSchema, CompatibilityCallToolResultSchema, CallToolRequestSchema, ToolListChangedNotificationSchema, LoggingLevelSchema, SetLevelRequestSchema, LoggingMessageNotificationSchema, ModelHintSchema, ModelPreferencesSchema, SamplingMessageSchema, CreateMessageRequestSchema, CreateMessageResultSchema, ResourceReferenceSchema, PromptReferenceSchema, CompleteRequestSchema, CompleteResultSchema, RootSchema, ListRootsRequestSchema, ListRootsResultSchema, RootsListChangedNotificationSchema, ClientRequestSchema, ClientNotificationSchema, ClientResultSchema, ServerRequestSchema, ServerNotificationSchema, ServerResultSchema, McpError;
var init_types2 = __esm({
  "node_modules/@modelcontextprotocol/sdk/dist/types.js"() {
    init_zod();
    LATEST_PROTOCOL_VERSION = "2024-11-05";
    SUPPORTED_PROTOCOL_VERSIONS = [
      LATEST_PROTOCOL_VERSION,
      "2024-10-07"
    ];
    JSONRPC_VERSION = "2.0";
    ProgressTokenSchema = external_exports.union([external_exports.string(), external_exports.number().int()]);
    CursorSchema = external_exports.string();
    BaseRequestParamsSchema = external_exports.object({
      _meta: external_exports.optional(external_exports.object({
        /**
         * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
         */
        progressToken: external_exports.optional(ProgressTokenSchema)
      }).passthrough())
    }).passthrough();
    RequestSchema = external_exports.object({
      method: external_exports.string(),
      params: external_exports.optional(BaseRequestParamsSchema)
    });
    BaseNotificationParamsSchema = external_exports.object({
      /**
       * This parameter name is reserved by MCP to allow clients and servers to attach additional metadata to their notifications.
       */
      _meta: external_exports.optional(external_exports.object({}).passthrough())
    }).passthrough();
    NotificationSchema = external_exports.object({
      method: external_exports.string(),
      params: external_exports.optional(BaseNotificationParamsSchema)
    });
    ResultSchema = external_exports.object({
      /**
       * This result property is reserved by the protocol to allow clients and servers to attach additional metadata to their responses.
       */
      _meta: external_exports.optional(external_exports.object({}).passthrough())
    }).passthrough();
    RequestIdSchema = external_exports.union([external_exports.string(), external_exports.number().int()]);
    JSONRPCRequestSchema = external_exports.object({
      jsonrpc: external_exports.literal(JSONRPC_VERSION),
      id: RequestIdSchema
    }).merge(RequestSchema).strict();
    JSONRPCNotificationSchema = external_exports.object({
      jsonrpc: external_exports.literal(JSONRPC_VERSION)
    }).merge(NotificationSchema).strict();
    JSONRPCResponseSchema = external_exports.object({
      jsonrpc: external_exports.literal(JSONRPC_VERSION),
      id: RequestIdSchema,
      result: ResultSchema
    }).strict();
    (function(ErrorCode2) {
      ErrorCode2[ErrorCode2["ConnectionClosed"] = -1] = "ConnectionClosed";
      ErrorCode2[ErrorCode2["RequestTimeout"] = -2] = "RequestTimeout";
      ErrorCode2[ErrorCode2["ParseError"] = -32700] = "ParseError";
      ErrorCode2[ErrorCode2["InvalidRequest"] = -32600] = "InvalidRequest";
      ErrorCode2[ErrorCode2["MethodNotFound"] = -32601] = "MethodNotFound";
      ErrorCode2[ErrorCode2["InvalidParams"] = -32602] = "InvalidParams";
      ErrorCode2[ErrorCode2["InternalError"] = -32603] = "InternalError";
    })(ErrorCode || (ErrorCode = {}));
    JSONRPCErrorSchema = external_exports.object({
      jsonrpc: external_exports.literal(JSONRPC_VERSION),
      id: RequestIdSchema,
      error: external_exports.object({
        /**
         * The error type that occurred.
         */
        code: external_exports.number().int(),
        /**
         * A short description of the error. The message SHOULD be limited to a concise single sentence.
         */
        message: external_exports.string(),
        /**
         * Additional information about the error. The value of this member is defined by the sender (e.g. detailed error information, nested errors etc.).
         */
        data: external_exports.optional(external_exports.unknown())
      })
    }).strict();
    JSONRPCMessageSchema = external_exports.union([
      JSONRPCRequestSchema,
      JSONRPCNotificationSchema,
      JSONRPCResponseSchema,
      JSONRPCErrorSchema
    ]);
    EmptyResultSchema = ResultSchema.strict();
    CancelledNotificationSchema = NotificationSchema.extend({
      method: external_exports.literal("notifications/cancelled"),
      params: BaseNotificationParamsSchema.extend({
        /**
         * The ID of the request to cancel.
         *
         * This MUST correspond to the ID of a request previously issued in the same direction.
         */
        requestId: RequestIdSchema,
        /**
         * An optional string describing the reason for the cancellation. This MAY be logged or presented to the user.
         */
        reason: external_exports.string().optional()
      })
    });
    ImplementationSchema = external_exports.object({
      name: external_exports.string(),
      version: external_exports.string()
    }).passthrough();
    ClientCapabilitiesSchema = external_exports.object({
      /**
       * Experimental, non-standard capabilities that the client supports.
       */
      experimental: external_exports.optional(external_exports.object({}).passthrough()),
      /**
       * Present if the client supports sampling from an LLM.
       */
      sampling: external_exports.optional(external_exports.object({}).passthrough()),
      /**
       * Present if the client supports listing roots.
       */
      roots: external_exports.optional(external_exports.object({
        /**
         * Whether the client supports issuing notifications for changes to the roots list.
         */
        listChanged: external_exports.optional(external_exports.boolean())
      }).passthrough())
    }).passthrough();
    InitializeRequestSchema = RequestSchema.extend({
      method: external_exports.literal("initialize"),
      params: BaseRequestParamsSchema.extend({
        /**
         * The latest version of the Model Context Protocol that the client supports. The client MAY decide to support older versions as well.
         */
        protocolVersion: external_exports.string(),
        capabilities: ClientCapabilitiesSchema,
        clientInfo: ImplementationSchema
      })
    });
    ServerCapabilitiesSchema = external_exports.object({
      /**
       * Experimental, non-standard capabilities that the server supports.
       */
      experimental: external_exports.optional(external_exports.object({}).passthrough()),
      /**
       * Present if the server supports sending log messages to the client.
       */
      logging: external_exports.optional(external_exports.object({}).passthrough()),
      /**
       * Present if the server offers any prompt templates.
       */
      prompts: external_exports.optional(external_exports.object({
        /**
         * Whether this server supports issuing notifications for changes to the prompt list.
         */
        listChanged: external_exports.optional(external_exports.boolean())
      }).passthrough()),
      /**
       * Present if the server offers any resources to read.
       */
      resources: external_exports.optional(external_exports.object({
        /**
         * Whether this server supports clients subscribing to resource updates.
         */
        subscribe: external_exports.optional(external_exports.boolean()),
        /**
         * Whether this server supports issuing notifications for changes to the resource list.
         */
        listChanged: external_exports.optional(external_exports.boolean())
      }).passthrough()),
      /**
       * Present if the server offers any tools to call.
       */
      tools: external_exports.optional(external_exports.object({
        /**
         * Whether this server supports issuing notifications for changes to the tool list.
         */
        listChanged: external_exports.optional(external_exports.boolean())
      }).passthrough())
    }).passthrough();
    InitializeResultSchema = ResultSchema.extend({
      /**
       * The version of the Model Context Protocol that the server wants to use. This may not match the version that the client requested. If the client cannot support this version, it MUST disconnect.
       */
      protocolVersion: external_exports.string(),
      capabilities: ServerCapabilitiesSchema,
      serverInfo: ImplementationSchema
    });
    InitializedNotificationSchema = NotificationSchema.extend({
      method: external_exports.literal("notifications/initialized")
    });
    PingRequestSchema = RequestSchema.extend({
      method: external_exports.literal("ping")
    });
    ProgressSchema = external_exports.object({
      /**
       * The progress thus far. This should increase every time progress is made, even if the total is unknown.
       */
      progress: external_exports.number(),
      /**
       * Total number of items to process (or total progress required), if known.
       */
      total: external_exports.optional(external_exports.number())
    }).passthrough();
    ProgressNotificationSchema = NotificationSchema.extend({
      method: external_exports.literal("notifications/progress"),
      params: BaseNotificationParamsSchema.merge(ProgressSchema).extend({
        /**
         * The progress token which was given in the initial request, used to associate this notification with the request that is proceeding.
         */
        progressToken: ProgressTokenSchema
      })
    });
    PaginatedRequestSchema = RequestSchema.extend({
      params: BaseRequestParamsSchema.extend({
        /**
         * An opaque token representing the current pagination position.
         * If provided, the server should return results starting after this cursor.
         */
        cursor: external_exports.optional(CursorSchema)
      }).optional()
    });
    PaginatedResultSchema = ResultSchema.extend({
      /**
       * An opaque token representing the pagination position after the last returned result.
       * If present, there may be more results available.
       */
      nextCursor: external_exports.optional(CursorSchema)
    });
    ResourceContentsSchema = external_exports.object({
      /**
       * The URI of this resource.
       */
      uri: external_exports.string(),
      /**
       * The MIME type of this resource, if known.
       */
      mimeType: external_exports.optional(external_exports.string())
    }).passthrough();
    TextResourceContentsSchema = ResourceContentsSchema.extend({
      /**
       * The text of the item. This must only be set if the item can actually be represented as text (not binary data).
       */
      text: external_exports.string()
    });
    BlobResourceContentsSchema = ResourceContentsSchema.extend({
      /**
       * A base64-encoded string representing the binary data of the item.
       */
      blob: external_exports.string().base64()
    });
    ResourceSchema = external_exports.object({
      /**
       * The URI of this resource.
       */
      uri: external_exports.string(),
      /**
       * A human-readable name for this resource.
       *
       * This can be used by clients to populate UI elements.
       */
      name: external_exports.string(),
      /**
       * A description of what this resource represents.
       *
       * This can be used by clients to improve the LLM's understanding of available resources. It can be thought of like a "hint" to the model.
       */
      description: external_exports.optional(external_exports.string()),
      /**
       * The MIME type of this resource, if known.
       */
      mimeType: external_exports.optional(external_exports.string())
    }).passthrough();
    ResourceTemplateSchema = external_exports.object({
      /**
       * A URI template (according to RFC 6570) that can be used to construct resource URIs.
       */
      uriTemplate: external_exports.string(),
      /**
       * A human-readable name for the type of resource this template refers to.
       *
       * This can be used by clients to populate UI elements.
       */
      name: external_exports.string(),
      /**
       * A description of what this template is for.
       *
       * This can be used by clients to improve the LLM's understanding of available resources. It can be thought of like a "hint" to the model.
       */
      description: external_exports.optional(external_exports.string()),
      /**
       * The MIME type for all resources that match this template. This should only be included if all resources matching this template have the same type.
       */
      mimeType: external_exports.optional(external_exports.string())
    }).passthrough();
    ListResourcesRequestSchema = PaginatedRequestSchema.extend({
      method: external_exports.literal("resources/list")
    });
    ListResourcesResultSchema = PaginatedResultSchema.extend({
      resources: external_exports.array(ResourceSchema)
    });
    ListResourceTemplatesRequestSchema = PaginatedRequestSchema.extend({
      method: external_exports.literal("resources/templates/list")
    });
    ListResourceTemplatesResultSchema = PaginatedResultSchema.extend({
      resourceTemplates: external_exports.array(ResourceTemplateSchema)
    });
    ReadResourceRequestSchema = RequestSchema.extend({
      method: external_exports.literal("resources/read"),
      params: BaseRequestParamsSchema.extend({
        /**
         * The URI of the resource to read. The URI can use any protocol; it is up to the server how to interpret it.
         */
        uri: external_exports.string()
      })
    });
    ReadResourceResultSchema = ResultSchema.extend({
      contents: external_exports.array(external_exports.union([TextResourceContentsSchema, BlobResourceContentsSchema]))
    });
    ResourceListChangedNotificationSchema = NotificationSchema.extend({
      method: external_exports.literal("notifications/resources/list_changed")
    });
    SubscribeRequestSchema = RequestSchema.extend({
      method: external_exports.literal("resources/subscribe"),
      params: BaseRequestParamsSchema.extend({
        /**
         * The URI of the resource to subscribe to. The URI can use any protocol; it is up to the server how to interpret it.
         */
        uri: external_exports.string()
      })
    });
    UnsubscribeRequestSchema = RequestSchema.extend({
      method: external_exports.literal("resources/unsubscribe"),
      params: BaseRequestParamsSchema.extend({
        /**
         * The URI of the resource to unsubscribe from.
         */
        uri: external_exports.string()
      })
    });
    ResourceUpdatedNotificationSchema = NotificationSchema.extend({
      method: external_exports.literal("notifications/resources/updated"),
      params: BaseNotificationParamsSchema.extend({
        /**
         * The URI of the resource that has been updated. This might be a sub-resource of the one that the client actually subscribed to.
         */
        uri: external_exports.string()
      })
    });
    PromptArgumentSchema = external_exports.object({
      /**
       * The name of the argument.
       */
      name: external_exports.string(),
      /**
       * A human-readable description of the argument.
       */
      description: external_exports.optional(external_exports.string()),
      /**
       * Whether this argument must be provided.
       */
      required: external_exports.optional(external_exports.boolean())
    }).passthrough();
    PromptSchema = external_exports.object({
      /**
       * The name of the prompt or prompt template.
       */
      name: external_exports.string(),
      /**
       * An optional description of what this prompt provides
       */
      description: external_exports.optional(external_exports.string()),
      /**
       * A list of arguments to use for templating the prompt.
       */
      arguments: external_exports.optional(external_exports.array(PromptArgumentSchema))
    }).passthrough();
    ListPromptsRequestSchema = PaginatedRequestSchema.extend({
      method: external_exports.literal("prompts/list")
    });
    ListPromptsResultSchema = PaginatedResultSchema.extend({
      prompts: external_exports.array(PromptSchema)
    });
    GetPromptRequestSchema = RequestSchema.extend({
      method: external_exports.literal("prompts/get"),
      params: BaseRequestParamsSchema.extend({
        /**
         * The name of the prompt or prompt template.
         */
        name: external_exports.string(),
        /**
         * Arguments to use for templating the prompt.
         */
        arguments: external_exports.optional(external_exports.record(external_exports.string()))
      })
    });
    TextContentSchema = external_exports.object({
      type: external_exports.literal("text"),
      /**
       * The text content of the message.
       */
      text: external_exports.string()
    }).passthrough();
    ImageContentSchema = external_exports.object({
      type: external_exports.literal("image"),
      /**
       * The base64-encoded image data.
       */
      data: external_exports.string().base64(),
      /**
       * The MIME type of the image. Different providers may support different image types.
       */
      mimeType: external_exports.string()
    }).passthrough();
    EmbeddedResourceSchema = external_exports.object({
      type: external_exports.literal("resource"),
      resource: external_exports.union([TextResourceContentsSchema, BlobResourceContentsSchema])
    }).passthrough();
    PromptMessageSchema = external_exports.object({
      role: external_exports.enum(["user", "assistant"]),
      content: external_exports.union([
        TextContentSchema,
        ImageContentSchema,
        EmbeddedResourceSchema
      ])
    }).passthrough();
    GetPromptResultSchema = ResultSchema.extend({
      /**
       * An optional description for the prompt.
       */
      description: external_exports.optional(external_exports.string()),
      messages: external_exports.array(PromptMessageSchema)
    });
    PromptListChangedNotificationSchema = NotificationSchema.extend({
      method: external_exports.literal("notifications/prompts/list_changed")
    });
    ToolSchema = external_exports.object({
      /**
       * The name of the tool.
       */
      name: external_exports.string(),
      /**
       * A human-readable description of the tool.
       */
      description: external_exports.optional(external_exports.string()),
      /**
       * A JSON Schema object defining the expected parameters for the tool.
       */
      inputSchema: external_exports.object({
        type: external_exports.literal("object"),
        properties: external_exports.optional(external_exports.object({}).passthrough())
      }).passthrough()
    }).passthrough();
    ListToolsRequestSchema = PaginatedRequestSchema.extend({
      method: external_exports.literal("tools/list")
    });
    ListToolsResultSchema = PaginatedResultSchema.extend({
      tools: external_exports.array(ToolSchema)
    });
    CallToolResultSchema = ResultSchema.extend({
      content: external_exports.array(external_exports.union([TextContentSchema, ImageContentSchema, EmbeddedResourceSchema])),
      isError: external_exports.boolean().default(false).optional()
    });
    CompatibilityCallToolResultSchema = CallToolResultSchema.or(ResultSchema.extend({
      toolResult: external_exports.unknown()
    }));
    CallToolRequestSchema = RequestSchema.extend({
      method: external_exports.literal("tools/call"),
      params: BaseRequestParamsSchema.extend({
        name: external_exports.string(),
        arguments: external_exports.optional(external_exports.record(external_exports.unknown()))
      })
    });
    ToolListChangedNotificationSchema = NotificationSchema.extend({
      method: external_exports.literal("notifications/tools/list_changed")
    });
    LoggingLevelSchema = external_exports.enum([
      "debug",
      "info",
      "notice",
      "warning",
      "error",
      "critical",
      "alert",
      "emergency"
    ]);
    SetLevelRequestSchema = RequestSchema.extend({
      method: external_exports.literal("logging/setLevel"),
      params: BaseRequestParamsSchema.extend({
        /**
         * The level of logging that the client wants to receive from the server. The server should send all logs at this level and higher (i.e., more severe) to the client as notifications/logging/message.
         */
        level: LoggingLevelSchema
      })
    });
    LoggingMessageNotificationSchema = NotificationSchema.extend({
      method: external_exports.literal("notifications/message"),
      params: BaseNotificationParamsSchema.extend({
        /**
         * The severity of this log message.
         */
        level: LoggingLevelSchema,
        /**
         * An optional name of the logger issuing this message.
         */
        logger: external_exports.optional(external_exports.string()),
        /**
         * The data to be logged, such as a string message or an object. Any JSON serializable type is allowed here.
         */
        data: external_exports.unknown()
      })
    });
    ModelHintSchema = external_exports.object({
      /**
       * A hint for a model name.
       */
      name: external_exports.string().optional()
    }).passthrough();
    ModelPreferencesSchema = external_exports.object({
      /**
       * Optional hints to use for model selection.
       */
      hints: external_exports.optional(external_exports.array(ModelHintSchema)),
      /**
       * How much to prioritize cost when selecting a model.
       */
      costPriority: external_exports.optional(external_exports.number().min(0).max(1)),
      /**
       * How much to prioritize sampling speed (latency) when selecting a model.
       */
      speedPriority: external_exports.optional(external_exports.number().min(0).max(1)),
      /**
       * How much to prioritize intelligence and capabilities when selecting a model.
       */
      intelligencePriority: external_exports.optional(external_exports.number().min(0).max(1))
    }).passthrough();
    SamplingMessageSchema = external_exports.object({
      role: external_exports.enum(["user", "assistant"]),
      content: external_exports.union([TextContentSchema, ImageContentSchema])
    }).passthrough();
    CreateMessageRequestSchema = RequestSchema.extend({
      method: external_exports.literal("sampling/createMessage"),
      params: BaseRequestParamsSchema.extend({
        messages: external_exports.array(SamplingMessageSchema),
        /**
         * An optional system prompt the server wants to use for sampling. The client MAY modify or omit this prompt.
         */
        systemPrompt: external_exports.optional(external_exports.string()),
        /**
         * A request to include context from one or more MCP servers (including the caller), to be attached to the prompt. The client MAY ignore this request.
         */
        includeContext: external_exports.optional(external_exports.enum(["none", "thisServer", "allServers"])),
        temperature: external_exports.optional(external_exports.number()),
        /**
         * The maximum number of tokens to sample, as requested by the server. The client MAY choose to sample fewer tokens than requested.
         */
        maxTokens: external_exports.number().int(),
        stopSequences: external_exports.optional(external_exports.array(external_exports.string())),
        /**
         * Optional metadata to pass through to the LLM provider. The format of this metadata is provider-specific.
         */
        metadata: external_exports.optional(external_exports.object({}).passthrough()),
        /**
         * The server's preferences for which model to select.
         */
        modelPreferences: external_exports.optional(ModelPreferencesSchema)
      })
    });
    CreateMessageResultSchema = ResultSchema.extend({
      /**
       * The name of the model that generated the message.
       */
      model: external_exports.string(),
      /**
       * The reason why sampling stopped.
       */
      stopReason: external_exports.optional(external_exports.enum(["endTurn", "stopSequence", "maxTokens"]).or(external_exports.string())),
      role: external_exports.enum(["user", "assistant"]),
      content: external_exports.discriminatedUnion("type", [
        TextContentSchema,
        ImageContentSchema
      ])
    });
    ResourceReferenceSchema = external_exports.object({
      type: external_exports.literal("ref/resource"),
      /**
       * The URI or URI template of the resource.
       */
      uri: external_exports.string()
    }).passthrough();
    PromptReferenceSchema = external_exports.object({
      type: external_exports.literal("ref/prompt"),
      /**
       * The name of the prompt or prompt template
       */
      name: external_exports.string()
    }).passthrough();
    CompleteRequestSchema = RequestSchema.extend({
      method: external_exports.literal("completion/complete"),
      params: BaseRequestParamsSchema.extend({
        ref: external_exports.union([PromptReferenceSchema, ResourceReferenceSchema]),
        /**
         * The argument's information
         */
        argument: external_exports.object({
          /**
           * The name of the argument
           */
          name: external_exports.string(),
          /**
           * The value of the argument to use for completion matching.
           */
          value: external_exports.string()
        }).passthrough()
      })
    });
    CompleteResultSchema = ResultSchema.extend({
      completion: external_exports.object({
        /**
         * An array of completion values. Must not exceed 100 items.
         */
        values: external_exports.array(external_exports.string()).max(100),
        /**
         * The total number of completion options available. This can exceed the number of values actually sent in the response.
         */
        total: external_exports.optional(external_exports.number().int()),
        /**
         * Indicates whether there are additional completion options beyond those provided in the current response, even if the exact total is unknown.
         */
        hasMore: external_exports.optional(external_exports.boolean())
      }).passthrough()
    });
    RootSchema = external_exports.object({
      /**
       * The URI identifying the root. This *must* start with file:// for now.
       */
      uri: external_exports.string().startsWith("file://"),
      /**
       * An optional name for the root.
       */
      name: external_exports.optional(external_exports.string())
    }).passthrough();
    ListRootsRequestSchema = RequestSchema.extend({
      method: external_exports.literal("roots/list")
    });
    ListRootsResultSchema = ResultSchema.extend({
      roots: external_exports.array(RootSchema)
    });
    RootsListChangedNotificationSchema = NotificationSchema.extend({
      method: external_exports.literal("notifications/roots/list_changed")
    });
    ClientRequestSchema = external_exports.union([
      PingRequestSchema,
      InitializeRequestSchema,
      CompleteRequestSchema,
      SetLevelRequestSchema,
      GetPromptRequestSchema,
      ListPromptsRequestSchema,
      ListResourcesRequestSchema,
      ListResourceTemplatesRequestSchema,
      ReadResourceRequestSchema,
      SubscribeRequestSchema,
      UnsubscribeRequestSchema,
      CallToolRequestSchema,
      ListToolsRequestSchema
    ]);
    ClientNotificationSchema = external_exports.union([
      CancelledNotificationSchema,
      ProgressNotificationSchema,
      InitializedNotificationSchema,
      RootsListChangedNotificationSchema
    ]);
    ClientResultSchema = external_exports.union([
      EmptyResultSchema,
      CreateMessageResultSchema,
      ListRootsResultSchema
    ]);
    ServerRequestSchema = external_exports.union([
      PingRequestSchema,
      CreateMessageRequestSchema,
      ListRootsRequestSchema
    ]);
    ServerNotificationSchema = external_exports.union([
      CancelledNotificationSchema,
      ProgressNotificationSchema,
      LoggingMessageNotificationSchema,
      ResourceUpdatedNotificationSchema,
      ResourceListChangedNotificationSchema,
      ToolListChangedNotificationSchema,
      PromptListChangedNotificationSchema
    ]);
    ServerResultSchema = external_exports.union([
      EmptyResultSchema,
      InitializeResultSchema,
      CompleteResultSchema,
      GetPromptResultSchema,
      ListPromptsResultSchema,
      ListResourcesResultSchema,
      ListResourceTemplatesResultSchema,
      ReadResourceResultSchema,
      CallToolResultSchema,
      ListToolsResultSchema
    ]);
    McpError = class extends Error {
      constructor(code, message, data) {
        super(`MCP error ${code}: ${message}`);
        this.code = code;
        this.data = data;
      }
    };
  }
});

// node_modules/@modelcontextprotocol/sdk/dist/shared/protocol.js
var DEFAULT_REQUEST_TIMEOUT_MSEC, Protocol;
var init_protocol = __esm({
  "node_modules/@modelcontextprotocol/sdk/dist/shared/protocol.js"() {
    init_types2();
    DEFAULT_REQUEST_TIMEOUT_MSEC = 6e4;
    Protocol = class {
      constructor(_options) {
        this._options = _options;
        this._requestMessageId = 0;
        this._requestHandlers = /* @__PURE__ */ new Map();
        this._requestHandlerAbortControllers = /* @__PURE__ */ new Map();
        this._notificationHandlers = /* @__PURE__ */ new Map();
        this._responseHandlers = /* @__PURE__ */ new Map();
        this._progressHandlers = /* @__PURE__ */ new Map();
        this.setNotificationHandler(CancelledNotificationSchema, (notification) => {
          const controller = this._requestHandlerAbortControllers.get(notification.params.requestId);
          controller === null || controller === void 0 ? void 0 : controller.abort(notification.params.reason);
        });
        this.setNotificationHandler(ProgressNotificationSchema, (notification) => {
          this._onprogress(notification);
        });
        this.setRequestHandler(
          PingRequestSchema,
          // Automatic pong by default.
          (_request) => ({})
        );
      }
      /**
       * Attaches to the given transport, starts it, and starts listening for messages.
       *
       * The Protocol object assumes ownership of the Transport, replacing any callbacks that have already been set, and expects that it is the only user of the Transport instance going forward.
       */
      async connect(transport) {
        this._transport = transport;
        this._transport.onclose = () => {
          this._onclose();
        };
        this._transport.onerror = (error) => {
          this._onerror(error);
        };
        this._transport.onmessage = (message) => {
          if (!("method" in message)) {
            this._onresponse(message);
          } else if ("id" in message) {
            this._onrequest(message);
          } else {
            this._onnotification(message);
          }
        };
        await this._transport.start();
      }
      _onclose() {
        var _a;
        const responseHandlers = this._responseHandlers;
        this._responseHandlers = /* @__PURE__ */ new Map();
        this._progressHandlers.clear();
        this._transport = void 0;
        (_a = this.onclose) === null || _a === void 0 ? void 0 : _a.call(this);
        const error = new McpError(ErrorCode.ConnectionClosed, "Connection closed");
        for (const handler of responseHandlers.values()) {
          handler(error);
        }
      }
      _onerror(error) {
        var _a;
        (_a = this.onerror) === null || _a === void 0 ? void 0 : _a.call(this, error);
      }
      _onnotification(notification) {
        var _a;
        const handler = (_a = this._notificationHandlers.get(notification.method)) !== null && _a !== void 0 ? _a : this.fallbackNotificationHandler;
        if (handler === void 0) {
          return;
        }
        Promise.resolve().then(() => handler(notification)).catch((error) => this._onerror(new Error(`Uncaught error in notification handler: ${error}`)));
      }
      _onrequest(request) {
        var _a, _b;
        const handler = (_a = this._requestHandlers.get(request.method)) !== null && _a !== void 0 ? _a : this.fallbackRequestHandler;
        if (handler === void 0) {
          (_b = this._transport) === null || _b === void 0 ? void 0 : _b.send({
            jsonrpc: "2.0",
            id: request.id,
            error: {
              code: ErrorCode.MethodNotFound,
              message: "Method not found"
            }
          }).catch((error) => this._onerror(new Error(`Failed to send an error response: ${error}`)));
          return;
        }
        const abortController = new AbortController();
        this._requestHandlerAbortControllers.set(request.id, abortController);
        Promise.resolve().then(() => handler(request, { signal: abortController.signal })).then((result) => {
          var _a2;
          if (abortController.signal.aborted) {
            return;
          }
          return (_a2 = this._transport) === null || _a2 === void 0 ? void 0 : _a2.send({
            result,
            jsonrpc: "2.0",
            id: request.id
          });
        }, (error) => {
          var _a2, _b2;
          if (abortController.signal.aborted) {
            return;
          }
          return (_a2 = this._transport) === null || _a2 === void 0 ? void 0 : _a2.send({
            jsonrpc: "2.0",
            id: request.id,
            error: {
              code: Number.isSafeInteger(error["code"]) ? error["code"] : ErrorCode.InternalError,
              message: (_b2 = error.message) !== null && _b2 !== void 0 ? _b2 : "Internal error"
            }
          });
        }).catch((error) => this._onerror(new Error(`Failed to send response: ${error}`))).finally(() => {
          this._requestHandlerAbortControllers.delete(request.id);
        });
      }
      _onprogress(notification) {
        const { progress, total, progressToken } = notification.params;
        const handler = this._progressHandlers.get(Number(progressToken));
        if (handler === void 0) {
          this._onerror(new Error(`Received a progress notification for an unknown token: ${JSON.stringify(notification)}`));
          return;
        }
        handler({ progress, total });
      }
      _onresponse(response) {
        const messageId = response.id;
        const handler = this._responseHandlers.get(Number(messageId));
        if (handler === void 0) {
          this._onerror(new Error(`Received a response for an unknown message ID: ${JSON.stringify(response)}`));
          return;
        }
        this._responseHandlers.delete(Number(messageId));
        this._progressHandlers.delete(Number(messageId));
        if ("result" in response) {
          handler(response);
        } else {
          const error = new McpError(response.error.code, response.error.message, response.error.data);
          handler(error);
        }
      }
      get transport() {
        return this._transport;
      }
      /**
       * Closes the connection.
       */
      async close() {
        var _a;
        await ((_a = this._transport) === null || _a === void 0 ? void 0 : _a.close());
      }
      /**
       * Sends a request and wait for a response.
       *
       * Do not use this method to emit notifications! Use notification() instead.
       */
      request(request, resultSchema, options2) {
        return new Promise((resolve, reject) => {
          var _a, _b, _c, _d;
          if (!this._transport) {
            reject(new Error("Not connected"));
            return;
          }
          if (((_a = this._options) === null || _a === void 0 ? void 0 : _a.enforceStrictCapabilities) === true) {
            this.assertCapabilityForMethod(request.method);
          }
          (_b = options2 === null || options2 === void 0 ? void 0 : options2.signal) === null || _b === void 0 ? void 0 : _b.throwIfAborted();
          const messageId = this._requestMessageId++;
          const jsonrpcRequest = {
            ...request,
            jsonrpc: "2.0",
            id: messageId
          };
          if (options2 === null || options2 === void 0 ? void 0 : options2.onprogress) {
            this._progressHandlers.set(messageId, options2.onprogress);
            jsonrpcRequest.params = {
              ...request.params,
              _meta: { progressToken: messageId }
            };
          }
          let timeoutId = void 0;
          this._responseHandlers.set(messageId, (response) => {
            var _a2;
            if (timeoutId !== void 0) {
              clearTimeout(timeoutId);
            }
            if ((_a2 = options2 === null || options2 === void 0 ? void 0 : options2.signal) === null || _a2 === void 0 ? void 0 : _a2.aborted) {
              return;
            }
            if (response instanceof Error) {
              return reject(response);
            }
            try {
              const result = resultSchema.parse(response.result);
              resolve(result);
            } catch (error) {
              reject(error);
            }
          });
          const cancel = (reason) => {
            var _a2;
            this._responseHandlers.delete(messageId);
            this._progressHandlers.delete(messageId);
            (_a2 = this._transport) === null || _a2 === void 0 ? void 0 : _a2.send({
              jsonrpc: "2.0",
              method: "cancelled",
              params: {
                requestId: messageId,
                reason: String(reason)
              }
            }).catch((error) => this._onerror(new Error(`Failed to send cancellation: ${error}`)));
            reject(reason);
          };
          (_c = options2 === null || options2 === void 0 ? void 0 : options2.signal) === null || _c === void 0 ? void 0 : _c.addEventListener("abort", () => {
            var _a2;
            if (timeoutId !== void 0) {
              clearTimeout(timeoutId);
            }
            cancel((_a2 = options2 === null || options2 === void 0 ? void 0 : options2.signal) === null || _a2 === void 0 ? void 0 : _a2.reason);
          });
          const timeout = (_d = options2 === null || options2 === void 0 ? void 0 : options2.timeout) !== null && _d !== void 0 ? _d : DEFAULT_REQUEST_TIMEOUT_MSEC;
          timeoutId = setTimeout(() => cancel(new McpError(ErrorCode.RequestTimeout, "Request timed out", {
            timeout
          })), timeout);
          this._transport.send(jsonrpcRequest).catch((error) => {
            if (timeoutId !== void 0) {
              clearTimeout(timeoutId);
            }
            reject(error);
          });
        });
      }
      /**
       * Emits a notification, which is a one-way message that does not expect a response.
       */
      async notification(notification) {
        if (!this._transport) {
          throw new Error("Not connected");
        }
        this.assertNotificationCapability(notification.method);
        const jsonrpcNotification = {
          ...notification,
          jsonrpc: "2.0"
        };
        await this._transport.send(jsonrpcNotification);
      }
      /**
       * Registers a handler to invoke when this protocol object receives a request with the given method.
       *
       * Note that this will replace any previous request handler for the same method.
       */
      setRequestHandler(requestSchema, handler) {
        const method = requestSchema.shape.method.value;
        this.assertRequestHandlerCapability(method);
        this._requestHandlers.set(method, (request, extra) => Promise.resolve(handler(requestSchema.parse(request), extra)));
      }
      /**
       * Removes the request handler for the given method.
       */
      removeRequestHandler(method) {
        this._requestHandlers.delete(method);
      }
      /**
       * Registers a handler to invoke when this protocol object receives a notification with the given method.
       *
       * Note that this will replace any previous notification handler for the same method.
       */
      setNotificationHandler(notificationSchema, handler) {
        this._notificationHandlers.set(notificationSchema.shape.method.value, (notification) => Promise.resolve(handler(notificationSchema.parse(notification))));
      }
      /**
       * Removes the notification handler for the given method.
       */
      removeNotificationHandler(method) {
        this._notificationHandlers.delete(method);
      }
    };
  }
});

// node_modules/@modelcontextprotocol/sdk/dist/server/index.js
var server_exports = {};
__export(server_exports, {
  Server: () => Server
});
var Server;
var init_server = __esm({
  "node_modules/@modelcontextprotocol/sdk/dist/server/index.js"() {
    init_protocol();
    init_types2();
    Server = class extends Protocol {
      /**
       * Initializes this server with the given name and version information.
       */
      constructor(_serverInfo, options2) {
        super(options2);
        this._serverInfo = _serverInfo;
        this._capabilities = options2.capabilities;
        this.setRequestHandler(InitializeRequestSchema, (request) => this._oninitialize(request));
        this.setNotificationHandler(InitializedNotificationSchema, () => {
          var _a;
          return (_a = this.oninitialized) === null || _a === void 0 ? void 0 : _a.call(this);
        });
      }
      assertCapabilityForMethod(method) {
        var _a, _b;
        switch (method) {
          case "sampling/createMessage":
            if (!((_a = this._clientCapabilities) === null || _a === void 0 ? void 0 : _a.sampling)) {
              throw new Error(`Client does not support sampling (required for ${method})`);
            }
            break;
          case "roots/list":
            if (!((_b = this._clientCapabilities) === null || _b === void 0 ? void 0 : _b.roots)) {
              throw new Error(`Client does not support listing roots (required for ${method})`);
            }
            break;
          case "ping":
            break;
        }
      }
      assertNotificationCapability(method) {
        switch (method) {
          case "notifications/message":
            if (!this._capabilities.logging) {
              throw new Error(`Server does not support logging (required for ${method})`);
            }
            break;
          case "notifications/resources/updated":
          case "notifications/resources/list_changed":
            if (!this._capabilities.resources) {
              throw new Error(`Server does not support notifying about resources (required for ${method})`);
            }
            break;
          case "notifications/tools/list_changed":
            if (!this._capabilities.tools) {
              throw new Error(`Server does not support notifying of tool list changes (required for ${method})`);
            }
            break;
          case "notifications/prompts/list_changed":
            if (!this._capabilities.prompts) {
              throw new Error(`Server does not support notifying of prompt list changes (required for ${method})`);
            }
            break;
          case "notifications/cancelled":
            break;
          case "notifications/progress":
            break;
        }
      }
      assertRequestHandlerCapability(method) {
        switch (method) {
          case "sampling/createMessage":
            if (!this._capabilities.sampling) {
              throw new Error(`Server does not support sampling (required for ${method})`);
            }
            break;
          case "logging/setLevel":
            if (!this._capabilities.logging) {
              throw new Error(`Server does not support logging (required for ${method})`);
            }
            break;
          case "prompts/get":
          case "prompts/list":
            if (!this._capabilities.prompts) {
              throw new Error(`Server does not support prompts (required for ${method})`);
            }
            break;
          case "resources/list":
          case "resources/templates/list":
          case "resources/read":
            if (!this._capabilities.resources) {
              throw new Error(`Server does not support resources (required for ${method})`);
            }
            break;
          case "tools/call":
          case "tools/list":
            if (!this._capabilities.tools) {
              throw new Error(`Server does not support tools (required for ${method})`);
            }
            break;
          case "ping":
          case "initialize":
            break;
        }
      }
      async _oninitialize(request) {
        const requestedVersion = request.params.protocolVersion;
        this._clientCapabilities = request.params.capabilities;
        this._clientVersion = request.params.clientInfo;
        return {
          protocolVersion: SUPPORTED_PROTOCOL_VERSIONS.includes(requestedVersion) ? requestedVersion : LATEST_PROTOCOL_VERSION,
          capabilities: this.getCapabilities(),
          serverInfo: this._serverInfo
        };
      }
      /**
       * After initialization has completed, this will be populated with the client's reported capabilities.
       */
      getClientCapabilities() {
        return this._clientCapabilities;
      }
      /**
       * After initialization has completed, this will be populated with information about the client's name and version.
       */
      getClientVersion() {
        return this._clientVersion;
      }
      getCapabilities() {
        return this._capabilities;
      }
      async ping() {
        return this.request({ method: "ping" }, EmptyResultSchema);
      }
      async createMessage(params, options2) {
        return this.request({ method: "sampling/createMessage", params }, CreateMessageResultSchema, options2);
      }
      async listRoots(params, options2) {
        return this.request({ method: "roots/list", params }, ListRootsResultSchema, options2);
      }
      async sendLoggingMessage(params) {
        return this.notification({ method: "notifications/message", params });
      }
      async sendResourceUpdated(params) {
        return this.notification({
          method: "notifications/resources/updated",
          params
        });
      }
      async sendResourceListChanged() {
        return this.notification({
          method: "notifications/resources/list_changed"
        });
      }
      async sendToolListChanged() {
        return this.notification({ method: "notifications/tools/list_changed" });
      }
      async sendPromptListChanged() {
        return this.notification({ method: "notifications/prompts/list_changed" });
      }
    };
  }
});

// node_modules/@modelcontextprotocol/sdk/dist/shared/stdio.js
function deserializeMessage(line) {
  return JSONRPCMessageSchema.parse(JSON.parse(line));
}
function serializeMessage(message) {
  return JSON.stringify(message) + "\n";
}
var ReadBuffer;
var init_stdio = __esm({
  "node_modules/@modelcontextprotocol/sdk/dist/shared/stdio.js"() {
    init_types2();
    ReadBuffer = class {
      append(chunk) {
        this._buffer = this._buffer ? Buffer.concat([this._buffer, chunk]) : chunk;
      }
      readMessage() {
        if (!this._buffer) {
          return null;
        }
        const index = this._buffer.indexOf("\n");
        if (index === -1) {
          return null;
        }
        const line = this._buffer.toString("utf8", 0, index);
        this._buffer = this._buffer.subarray(index + 1);
        return deserializeMessage(line);
      }
      clear() {
        this._buffer = void 0;
      }
    };
  }
});

// node_modules/@modelcontextprotocol/sdk/dist/server/stdio.js
var stdio_exports = {};
__export(stdio_exports, {
  StdioServerTransport: () => StdioServerTransport
});
var import_node_process, StdioServerTransport;
var init_stdio2 = __esm({
  "node_modules/@modelcontextprotocol/sdk/dist/server/stdio.js"() {
    import_node_process = __toESM(require("node:process"), 1);
    init_stdio();
    StdioServerTransport = class {
      constructor(_stdin = import_node_process.default.stdin, _stdout = import_node_process.default.stdout) {
        this._stdin = _stdin;
        this._stdout = _stdout;
        this._readBuffer = new ReadBuffer();
        this._started = false;
        this._ondata = (chunk) => {
          this._readBuffer.append(chunk);
          this.processReadBuffer();
        };
        this._onerror = (error) => {
          var _a;
          (_a = this.onerror) === null || _a === void 0 ? void 0 : _a.call(this, error);
        };
      }
      /**
       * Starts listening for messages on stdin.
       */
      async start() {
        if (this._started) {
          throw new Error("StdioServerTransport already started! If using Server class, note that connect() calls start() automatically.");
        }
        this._started = true;
        this._stdin.on("data", this._ondata);
        this._stdin.on("error", this._onerror);
      }
      processReadBuffer() {
        var _a, _b;
        while (true) {
          try {
            const message = this._readBuffer.readMessage();
            if (message === null) {
              break;
            }
            (_a = this.onmessage) === null || _a === void 0 ? void 0 : _a.call(this, message);
          } catch (error) {
            (_b = this.onerror) === null || _b === void 0 ? void 0 : _b.call(this, error);
          }
        }
      }
      async close() {
        var _a;
        this._stdin.off("data", this._ondata);
        this._stdin.off("error", this._onerror);
        this._readBuffer.clear();
        (_a = this.onclose) === null || _a === void 0 ? void 0 : _a.call(this);
      }
      send(message) {
        return new Promise((resolve) => {
          const json = serializeMessage(message);
          if (this._stdout.write(json)) {
            resolve();
          } else {
            this._stdout.once("drain", resolve);
          }
        });
      }
    };
  }
});

// src/index.ts
var index_exports = {};
__export(index_exports, {
  validateLicenseKey: () => validateLicenseKey
});
module.exports = __toCommonJS(index_exports);
var import_commander = require("commander");

// src/tools/apitools/tools/generateAPICypressTest.ts
init_zod();

// src/tools/apitools/utils/assertionGenerators.ts
function generateCypressAssertions(responseBody, useParameterizedData = true, testData) {
  const assertions = [];
  function traverseForCypress(obj, path6 = []) {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = [...path6, key];
      const accessor = `response.body${currentPath.map((k) => `["${k}"]`).join("")}`;
      const testDataAccessor = currentPath.length === 1 ? `testEntry.expectedData.${key}` : `testEntry.expectedData${currentPath.map((k) => `["${k}"]`).join("")}`;
      assertions.push(`      cy.wrap(${accessor}).should('exist');`);
      if (value === null) {
        assertions.push(`      cy.wrap(${accessor}).should('be.null');`);
      } else if (Array.isArray(value)) {
        assertions.push(`      cy.wrap(${accessor}).should('be.an', 'array');`);
        if (value.length > 0) {
          assertions.push(`      cy.wrap(${accessor}).should('have.length', ${value.length});`);
          if (typeof value[0] === "object") {
            traverseForCypress(value[0], [...currentPath, "0"]);
          }
        }
      } else if (typeof value === "object") {
        assertions.push(`      cy.wrap(${accessor}).should('be.an', 'object');`);
        traverseForCypress(value, currentPath);
      } else if (typeof value === "string") {
        assertions.push(`      cy.wrap(${accessor}).should('be.a', 'string');`);
        if (useParameterizedData) {
          const hasTestDataField = testData?.hasOwnProperty(key);
          if (hasTestDataField) {
          } else {
            if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
              assertions.push(`      cy.wrap(${accessor}).should('match', /^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}/); // ISO date format`);
            } else if (/^\d+$/.test(value)) {
              assertions.push(`      cy.wrap(${accessor}).should('match', /^\\d+$/); // numeric string`);
            } else {
              assertions.push(`      cy.wrap(${accessor}).should('not.be.empty');`);
            }
          }
          assertions.push(`      cy.wrap(${accessor}).should('equal', ${testDataAccessor});`);
        }
      } else if (typeof value === "number") {
        assertions.push(`      cy.wrap(${accessor}).should('be.a', 'number');`);
        if (useParameterizedData) {
          const hasTestDataField = testData?.hasOwnProperty(key);
          if (hasTestDataField) {
          } else {
            if (Number.isInteger(value)) {
              assertions.push(`      cy.wrap(${accessor}).should('satisfy', (num) => Number.isInteger(num)); // integer check`);
            }
            assertions.push(`      cy.wrap(${accessor}).should('be.gte', 0); // non-negative check`);
          }
          assertions.push(`      cy.wrap(${accessor}).should('equal', ${testDataAccessor});`);
        }
      } else if (typeof value === "boolean") {
        assertions.push(`      cy.wrap(${accessor}).should('be.a', 'boolean');`);
        if (useParameterizedData) {
          const hasTestDataField = testData?.hasOwnProperty(key);
          if (hasTestDataField) {
          } else {
          }
          assertions.push(`      cy.wrap(${accessor}).should('equal', ${testDataAccessor});`);
        }
      }
    }
  }
  if (responseBody && typeof responseBody === "object") {
    traverseForCypress(responseBody);
  }
  return assertions;
}
function generatePlaywrightAssertions(responseBody, useParameterizedData = true, testData) {
  const assertions = [];
  function traverseForPlaywright(obj, path6 = []) {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = [...path6, key];
      const accessor = `body${currentPath.map((k) => `["${k}"]`).join("")}`;
      const testDataAccessor = currentPath.length === 1 ? `testEntry.expectedData.${key}` : `testEntry.expectedData${currentPath.map((k) => `["${k}"]`).join("")}`;
      assertions.push(`    expect(${accessor}).toBeDefined();`);
      if (value === null) {
        assertions.push(`    expect(${accessor}).toBeNull();`);
      } else if (Array.isArray(value)) {
        assertions.push(`    expect(Array.isArray(${accessor})).toBe(true);`);
        if (value.length > 0) {
          assertions.push(`    expect(${accessor}).toHaveLength(${value.length});`);
          if (typeof value[0] === "object") {
            traverseForPlaywright(value[0], [...currentPath, "0"]);
          }
        }
      } else if (typeof value === "object") {
        assertions.push(`    expect(typeof ${accessor}).toBe('object');`);
        traverseForPlaywright(value, currentPath);
      } else if (typeof value === "string") {
        assertions.push(`    expect(typeof ${accessor}).toBe('string');`);
        if (useParameterizedData) {
          const hasTestDataField = testData?.hasOwnProperty(key);
          if (hasTestDataField) {
          } else {
            if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
              assertions.push(`    expect(${accessor}).toMatch(/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}/); // ISO date format`);
            } else if (/^\d+$/.test(value)) {
              assertions.push(`    expect(${accessor}).toMatch(/^\\d+$/); // numeric string`);
            } else {
              assertions.push(`    expect(${accessor}.length).toBeGreaterThan(0);`);
            }
          }
          assertions.push(`    expect(${accessor}).toBe(${testDataAccessor});`);
        }
      } else if (typeof value === "number") {
        assertions.push(`    expect(typeof ${accessor}).toBe('number');`);
        if (useParameterizedData) {
          const hasTestDataField = testData?.hasOwnProperty(key);
          if (hasTestDataField) {
            if (Number.isInteger(value)) {
            }
            assertions.push(`      expect(${accessor}).toBeGreaterThanOrEqual(0); // non-negative check`);
            assertions.push(`    }`);
          } else {
            if (Number.isInteger(value)) {
            }
            assertions.push(`    expect(${accessor}).toBeGreaterThanOrEqual(0); // non-negative check`);
          }
          assertions.push(`    expect(${accessor}).toBe(${testDataAccessor});`);
        }
      } else if (typeof value === "boolean") {
        assertions.push(`    expect(typeof ${accessor}).toBe('boolean');`);
        if (useParameterizedData) {
          const hasTestDataField = testData?.hasOwnProperty(key);
          if (hasTestDataField) {
          } else {
          }
          assertions.push(`    expect(${accessor}).toBe(${testDataAccessor});`);
        }
      }
    }
  }
  if (responseBody && typeof responseBody === "object") {
    traverseForPlaywright(responseBody);
  }
  return assertions;
}

// src/tools/apitools/utils/helpers.ts
function generateTestDataVariations(originalBody) {
  if (!originalBody || Object.keys(originalBody).length === 0) {
    return [{ description: "Empty body", data: {} }];
  }
  const variations = [];
  const keys = Object.keys(originalBody);
  for (const key of keys) {
    const value = originalBody[key];
    const fieldType = typeof value;
    switch (fieldType) {
      case "string":
        variations.push({
          description: `Alternative string value for ${key}`,
          data: { ...originalBody, [key]: `test_${key}_${Math.random().toString(36).substr(2, 8)}` }
        });
        break;
      case "number":
        variations.push({
          description: `Alternative number value for ${key}`,
          data: { ...originalBody, [key]: Math.floor(Math.random() * 1e3) + 1 }
        });
        break;
      case "boolean":
        variations.push({
          description: `Opposite boolean value for ${key}`,
          data: { ...originalBody, [key]: !value }
        });
        break;
    }
  }
  return variations;
}
function extractDataFromUrl(urlStr) {
  const url = new URL(urlStr);
  const pathParts = url.pathname.split("/").filter(Boolean);
  const queryParams = Object.fromEntries(url.searchParams.entries());
  const pathData = {};
  if (pathParts.length >= 2) {
    const key = pathParts[pathParts.length - 2];
    const value = pathParts[pathParts.length - 1];
    pathData[key.endsWith("s") ? key.slice(0, -1) : key] = isNaN(Number(value)) ? value : Number(value);
  }
  return { ...pathData, ...queryParams };
}

// src/tools/apitools/utils/testCodeGenerators.ts
function generateCypressTest(testName, request, response, useParameterizedData = true, includeDataVariations = false) {
  const { method, url, headers = {}, body = {}, auth } = request;
  const processedHeaders = headers;
  const hasBody = body && Object.keys(body).length > 0;
  const hasAuth = auth && auth.token;
  const allHeaders = { ...headers, "User-Agent": "CypressTest" };
  if (hasAuth) {
    allHeaders["Authorization"] = auth.type === "basic" ? `Basic ${auth.token}` : `Bearer ${auth.token}`;
  }
  const hasHeaders = allHeaders && Object.keys(allHeaders).length > 0;
  const apiConfig = {
    url,
    headers: allHeaders,
    auth
  };
  const urlData = extractDataFromUrl(url);
  const testDataEntry = {
    ...urlData,
    ...body,
    description: `${method} request with provided data`,
    expectedData: response?.body || {}
  };
  const testVariations = includeDataVariations && hasBody ? generateTestDataVariations(body).map((variation) => ({
    ...variation,
    expectedData: {}
    // Empty expectedData for variations since we don't know the values
  })) : [];
  const allTestData = [testDataEntry, ...testVariations];
  const dynamicAssertions = response ? generateCypressAssertions(response.body, useParameterizedData, testDataEntry) : ["      // Add your assertions here"];
  const code = `/// <reference types="cypress" />

describe('${testName}', () => {
  // API Configuration
  const apiConfig = ${JSON.stringify(apiConfig, null, 2)};

  // Test data for parameterized testing
  const testData = ${JSON.stringify(allTestData, null, 2)};

  testData.forEach((testEntry) => {
    it('Specific value and structure validation', () => {
      const startTime = Date.now();
      
      cy.request({
        method: '${method}',
        url: apiConfig.url,${hasHeaders ? `
        headers: apiConfig.headers,` : ""}${hasBody && method !== "GET" ? `
        body: {
          ${Object.keys(body).map((key) => `${key}: testEntry.${key} || ${JSON.stringify(body[key])}`).join(",\n          ")}
        },` : ""}
      }).then((response) => {
        const responseTime = Date.now() - startTime;
        
        // Status code assertion
        cy.wrap(response.status).should('equal', ${response?.status || 200});
        
        // Response time validation - Ensure API responds within 2 seconds
        cy.wrap(responseTime).should('be.lessThan', 2000);
        
        // Validate against expected data if available
        if (testEntry.expectedData && Object.keys(testEntry.expectedData).length > 0) {
          for (const [key, value] of Object.entries(testEntry.expectedData)) {
            if (value !== undefined) {
              if (typeof value === 'string' && /^d{4}-d{2}-d{2}Td{2}:d{2}:d{2}/.test(value)) {
                cy.wrap(response.body[key]).should('match', /^d{4}-d{2}-d{2}Td{2}:d{2}:d{2}/);
              } else if (typeof value === 'string' && /^d+$/.test(value)) {
                cy.wrap(response.body[key]).should('match', /^d+$/);
              } else {
                cy.wrap(response.body[key]).should('deep.equal', value);
              }
            }
          }
        }

        // Response structure assertions
        cy.wrap(response.body).should('be.an', 'object');
        
        // Comprehensive response body assertions
        ${dynamicAssertions.join("\n")}

      });
    });
  });

});`;
  return code;
}
function generatePlaywrightTest(testName, lastTestedRequest, lastTestedResponse, useParameterizedData = true, includeDataVariations = false) {
  const { method, url, headers = {}, body = {}, auth } = lastTestedRequest;
  const hasBody = body && Object.keys(body).length > 0;
  const hasAuth = auth && auth.token;
  const allHeaders = { ...headers };
  if (hasAuth) {
    allHeaders["Authorization"] = auth.type === "basic" ? `Basic ${auth.token}` : `Bearer ${auth.token}`;
  }
  const hasHeaders = allHeaders && Object.keys(allHeaders).length > 0;
  const apiConfig = {
    url,
    headers: allHeaders,
    auth
  };
  const urlData = extractDataFromUrl(url);
  const testDataEntry = {
    ...urlData,
    ...body,
    description: `${method} request with provided data`,
    expectedData: lastTestedResponse?.body || {}
  };
  const testVariations = includeDataVariations && hasBody ? generateTestDataVariations(body).map((variation) => ({
    ...variation,
    expectedData: {}
    // Empty expectedData for variations since we don't know the values
  })) : [];
  const allTestData = [testDataEntry, ...testVariations];
  const generateSpecificValueAssertions = (responseBody, testData) => {
    const assertions = [];
    if (!responseBody || typeof responseBody !== "object") {
      return assertions;
    }
    function traverseForSpecificValues(obj, path6 = []) {
      for (const [key, value] of Object.entries(obj)) {
        const currentPath = [...path6, key];
        const accessor = `body${currentPath.map((k) => `["${k}"]`).join("")}`;
        if (value === null) {
          assertions.push(`    expect(${accessor}).toBeNull();`);
        } else if (Array.isArray(value)) {
          assertions.push(`    expect(${accessor}).toEqual(${JSON.stringify(value)});`);
        } else if (typeof value === "object") {
          traverseForSpecificValues(value, currentPath);
        } else if (typeof value === "string") {
          if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value) && (key.toLowerCase().includes("date") || key.toLowerCase().includes("time") || key.toLowerCase().includes("at"))) {
            assertions.push(`    expect(${accessor}).toMatch(/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}/); // Validate timestamp format`);
          } else if (/^\d+$/.test(value) && (key.toLowerCase() === "id" || key.toLowerCase().endsWith("id"))) {
            assertions.push(`    expect(${accessor}).toMatch(/^\\d+$/); // Validate ID is numeric`);
            assertions.push(`    expect(${accessor}).toBeTruthy(); // ID should not be empty`);
          } else {
            if (testData && testData.hasOwnProperty(key)) {
              assertions.push(`    // Parameterized value assertion for ${key}`);
              assertions.push(`    if (testData[0].${key}) {`);
              assertions.push(`      expect(${accessor}).toBe(testData[0].${key});`);
              assertions.push(`    } else {`);
              assertions.push(`      expect(${accessor}).toBe(${JSON.stringify(value)});`);
              assertions.push(`    }`);
            } else {
              assertions.push(`    expect(${accessor}).toBe(${JSON.stringify(value)});`);
            }
          }
        } else if (typeof value === "number") {
          if (testData && testData.hasOwnProperty(key)) {
            assertions.push(`    // Parameterized value assertion for ${key}`);
            assertions.push(`    if (testData[0].${key} !== undefined) {`);
            assertions.push(`      expect(${accessor}).toBe(testData[0].${key});`);
            assertions.push(`    } else {`);
            assertions.push(`      expect(${accessor}).toBe(${value});`);
            assertions.push(`    }`);
          } else {
            assertions.push(`    expect(${accessor}).toBe(${value});`);
          }
        } else if (typeof value === "boolean") {
          if (testData && testData.hasOwnProperty(key)) {
            assertions.push(`    // Parameterized value assertion for ${key}`);
            assertions.push(`    if (testData[0].${key} !== undefined) {`);
            assertions.push(`      expect(${accessor}).toBe(testData[0].${key});`);
            assertions.push(`    } else {`);
            assertions.push(`      expect(${accessor}).toBe(${value});`);
            assertions.push(`    }`);
          } else {
            assertions.push(`    expect(${accessor}).toBe(${value});`);
          }
        }
      }
    }
    traverseForSpecificValues(responseBody);
    return assertions;
  };
  const dynamicAssertions = lastTestedResponse ? generatePlaywrightAssertions(lastTestedResponse.body, useParameterizedData, testDataEntry) : ["    // Add your assertions here"];
  const specificValueAssertions = lastTestedResponse && lastTestedResponse.body ? generateSpecificValueAssertions(lastTestedResponse.body, testDataEntry) : ["    // Add specific value assertions here"];
  const code = `import { test, expect } from '@playwright/test';

test.describe('${testName}', () => {
  // API Configuration
  const apiConfig = ${JSON.stringify(apiConfig, null, 2)};

  // Test data for parameterized testing
  const testData = ${JSON.stringify(allTestData, null, 2)};

  testData.forEach((testEntry) => {
    test('Specific value and structure validation', async ({ request }) => {
      const startTime = Date.now();
      
      const response = await request.${method.toLowerCase()}(apiConfig.url, {${hasHeaders ? `
        headers: apiConfig.headers,` : ""}${hasBody && method !== "GET" ? `
        data: {
          ${Object.keys(body).map((key) => `${key}: testEntry.${key} || ${JSON.stringify(body[key])}`).join(",\n          ")}
        },` : ""}
      });
      
      const responseTime = Date.now() - startTime;
      
      // Status code assertion
      expect(response.status()).toBe(${lastTestedResponse?.status || 200});
      
      // Response time validation - Ensure API responds within 2 seconds
      expect(responseTime).toBeLessThan(2000);
      
      // Get response body
      const body = await response.json();
      
      // Validate against expected data if available
      if (testEntry.expectedData && Object.keys(testEntry.expectedData).length > 0) {
        for (const [key, value] of Object.entries(testEntry.expectedData)) {
          if (value !== undefined) {
            if (typeof value === 'string' && /^d{4}-d{2}-d{2}Td{2}:d{2}:d{2}/.test(value)) {
              expect(body[key]).toMatch(/^d{4}-d{2}-d{2}Td{2}:d{2}:d{2}/);
            } else if (typeof value === 'string' && /^d+$/.test(value)) {
              expect(body[key]).toMatch(/^d+$/);
            } else {
              expect(body[key]).toStrictEqual(value);
            }
          }
        }
      }

      // Response structure assertions
      expect(typeof body).toBe('object');
      
      // Comprehensive response body assertions
      ${dynamicAssertions.join("\n")}
      
    });
  });
});`;
  return code;
}
var getEndpointPattern = (url) => {
  try {
    const urlPath = url.includes("://") ? new URL(url).pathname : url.startsWith("/") ? url : "/" + url;
    const parts = urlPath.split("/").filter(Boolean);
    const params = {};
    const parameterizedParts = parts.map((part, index) => {
      if (/^\d+$/.test(part)) {
        const paramName = index > 0 ? `${parts[index - 1].replace(/s$/, "")}Id` : "id";
        params[paramName] = part;
        return `<${paramName}>`;
      }
      return part;
    });
    return {
      pattern: parameterizedParts.length > 0 ? `{base_url}/${parameterizedParts.join("/")}` : "{base_url}",
      params
    };
  } catch (e) {
    const parts = url.split("/").filter(Boolean);
    const params = {};
    const parameterizedParts = parts.map((part, index) => {
      if (/^\d+$/.test(part)) {
        const paramName = index > 0 ? `${parts[index - 1].replace(/s$/, "")}Id` : "id";
        params[paramName] = part;
        return `<${paramName}>`;
      }
      return part;
    });
    return {
      pattern: parameterizedParts.length > 0 ? `{base_url}/${parameterizedParts.join("/")}` : "{base_url}",
      params
    };
  }
};
function generateRestAssuredTest(testName, request, response, useParameterizedData = true, includeDataVariations = false) {
  testName = testName || "API_Test_Scenario";
  const { method, url, headers = {}, body = {}, auth } = request;
  const hasBody = body && Object.keys(body).length > 0;
  const hasAuth = auth && auth.token;
  const allHeaders = { ...headers };
  if (hasAuth) {
    allHeaders["Authorization"] = auth.type === "basic" ? `Basic ${auth.token}` : `Bearer ${auth.token}`;
  }
  const hasHeaders = allHeaders && Object.keys(allHeaders).length > 0;
  const { pattern: endpointPattern, params } = getEndpointPattern(url);
  const responsePayload = response?.body ? typeof response.body === "string" ? response.body : JSON.stringify(response.body, null, 2) : "{}";
  const requestPayload = hasBody ? typeof body === "string" ? body : JSON.stringify(body, null, 2) : "{}";
  const paramNames = Object.keys(params);
  const methodUpper = method.toUpperCase();
  let featureContent = "";
  if (methodUpper === "GET") {
    featureContent = `
Feature: ${testName}

  Scenario Outline: Verify ${testName} for different ${paramNames.length > 0 ? paramNames.join(", ") : "inputs"}
    Given the API endpoint is "${endpointPattern}"
    When I send a GET request to the endpoint
    Then the response status code should be <statusCode>
    And the response should match the expected payload from "<ResponseFile>"

    Examples:
      | ${[...paramNames, "statusCode", "ResponseFile"].join(" | ")} |
      | ${[...paramNames.map((param) => params[param]), response?.status || 200, "response.json"].join(" | ")} |
    `;
  } else if (["POST", "PUT", "PATCH"].includes(methodUpper)) {
    featureContent = `
Feature: ${testName}

  Scenario Outline: Verify ${testName} for different ${paramNames.length > 0 ? paramNames.join(", ") : "inputs"}
    Given the API endpoint is "${endpointPattern}"
    When I send a ${methodUpper} request to the endpoint with payload from "<RequestFile>"
    Then the response status code should be <statusCode>
    And the response should match the expected payload from "<ResponseFile>"

    Examples:
      | ${[...paramNames, "statusCode", "RequestFile", "ResponseFile"].join(" | ")} |
      | ${[...paramNames.map((param) => params[param]), response?.status || 200, "request.json", "response.json"].join(" | ")} |
    `;
  }
  const stepDefinitions = `package stepDefinitions;

import io.cucumber.java.en.*;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import org.junit.Assert;
import java.nio.file.*;
import java.util.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;

public class ${testName.replace(/\s+/g, "")}Steps {
    private RequestSpecification request;
    private Response response;
    private String requestBody;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Given("the API endpoint is {string}")
    public void setApiEndpoint(String endpoint) {
        // Always read base URL from .env file
        String baseUrl;
        try {
            Properties props = new Properties();
            props.load(Files.newInputStream(Paths.get(".env")));
            baseUrl = props.getProperty("API_BASE_URL");
            if (baseUrl == null || baseUrl.trim().isEmpty()) {
                throw new IllegalStateException("API_BASE_URL not found in .env file. Please configure the base URL in .env file.");
            }
            // Remove trailing slash from base URL if present
            baseUrl = baseUrl.replaceAll("/+$", "");
        } catch (Exception e) {
            throw new IllegalStateException("Failed to read API_BASE_URL from .env file. Please ensure .env file exists and contains API_BASE_URL.", e);
        }

        // Initialize request with content type
        request = RestAssured.given().contentType(ContentType.JSON);

        // Replace the {base_url} placeholder with actual base URL and handle URL formation
        String finalEndpoint;
        try {
            String processedEndpoint = endpoint.replace("{base_url}", baseUrl);
            // Handle relative vs absolute URLs
            if (processedEndpoint.matches("^https?://.*")) {
                finalEndpoint = processedEndpoint; // Already a full URL
            } else {
                finalEndpoint = baseUrl + (processedEndpoint.startsWith("/") ? processedEndpoint : "/" + processedEndpoint);
            }

            // Set headers if present
            if (${hasHeaders}) {
                Map<String, String> headers = new HashMap<>();
                ${Object.entries(allHeaders).map(([k, v]) => `headers.put("${k}", "${v}");`).join("\n                ")}
                request.headers(headers);
            }

            // Set the base URI last to ensure proper URL formation
            request.baseUri(finalEndpoint);
        } catch (Exception e) {
            throw new IllegalStateException("Failed to process endpoint URL: " + endpoint, e);
        }
    }

    @Given("I have the request payload:")
    public void setRequestBody(String body) {
        requestBody = body;
        request.body(body);
    }

    @When("I send a {word} request to the endpoint")
    public void sendRequest(String method) {
        switch (method.toUpperCase()) {
            case "GET":
                response = request.get();
                break;
            case "POST":
                response = request.post();
                break;
            case "PUT":
                response = request.put();
                break;
            case "PATCH":
                response = request.patch();
                break;
            case "DELETE":
                response = request.delete();
                break;
            default:
                throw new IllegalArgumentException("Unsupported HTTP method: " + method);
        }
    }

    @Then("the response status code should be {int}")
    public void verifyStatusCode(int expectedStatusCode) {
        Assert.assertEquals(expectedStatusCode, response.getStatusCode());
    }

    @Then("the response should match:")
    public void verifyResponseBody(String expectedBody) throws Exception {
        JsonNode expected = objectMapper.readTree(expectedBody);
        JsonNode actual = objectMapper.readTree(response.asString());
        Assert.assertEquals(
            objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(expected),
            objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(actual)
        );
    }

    @Then("the response should match the expected payload")
    public void verifyResponseMatchesPayload() throws Exception {
        JsonNode actual = objectMapper.readTree(response.asString());
        String expected = ${JSON.stringify(responsePayload)};
        JsonNode expectedNode = objectMapper.readTree(expected);
        
        Assert.assertEquals(
            objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(expectedNode),
            objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(actual)
        );
    }
}`;
  return {
    featureFile: featureContent,
    stepDefinitions
  };
}
function generateNegativeTestSuiteCode(scenarios, framework, suiteName) {
  let suiteCode = "";
  if (framework === "playwright") {
    suiteCode = `import { test, expect } from '@playwright/test';

test.describe('${suiteName}', () => {
`;
    for (const scenario of scenarios) {
      const { url, method, headers, auth, body } = scenario.request;
      const expectedStatus = scenario.expected?.status;
      let apiCall = `const response = await request.${method.toLowerCase()}('${url}', {`;
      if (headers && Object.keys(headers).length > 0) {
        apiCall += `
      headers: ${JSON.stringify(headers)},`;
      }
      if (auth && auth.token) {
        apiCall += `
      headers: { ...(headers || {}), Authorization: '${auth.type === "basic" ? `Basic ${auth.token}` : `Bearer ${auth.token}`}' },`;
      }
      if (body && method !== "GET" && Object.keys(body).length > 0) {
        apiCall += `
      data: ${JSON.stringify(body)},`;
      }
      apiCall += `
    });`;
      suiteCode += `  test('${scenario.description}', async ({ request }) => {
    ${apiCall}
    expect(response.status()).${expectedStatus === 200 ? "toBe(200)" : "not.toBe(200)"};
  });

`;
    }
    suiteCode += `});`;
  } else {
    suiteCode = `describe('${suiteName}', () => {
`;
    for (const scenario of scenarios) {
      const { url, method, headers, auth, body } = scenario.request;
      const expectedStatus = scenario.expected?.status;
      let cyOptions = [`url: '${url}'`, `method: '${method}'`, `failOnStatusCode: false`];
      if (headers && Object.keys(headers).length > 0) {
        cyOptions.push(`headers: ${JSON.stringify(headers)}`);
      }
      if (auth && auth.token) {
        cyOptions.push(`headers: { ...(headers || {}), Authorization: '${auth.type === "basic" ? `Basic ${auth.token}` : `Bearer ${auth.token}`}' }`);
      }
      if (body && method !== "GET" && Object.keys(body).length > 0) {
        cyOptions.push(`body: ${JSON.stringify(body)}`);
      }
      suiteCode += `  it('${scenario.description}', () => {
    cy.request({ ${cyOptions.join(", ")} }).then((response) => {
      expect(response.status).${expectedStatus === 200 ? "to.eq(200)" : "not.to.eq(200)"};
    });
  });

`;
    }
    suiteCode += `});`;
  }
  return suiteCode;
}
function generateStepDefinitions(testName = "API Test Scenario", request, response, packageName, configKey = "", configPath = "src/test/resources/config/test-config.properties", payloadPath = "src/test/resources/payloads/response") {
  const testConfigKey = configKey || testName.replace(/[^a-z0-9_\-]/gi, "_").toLowerCase();
  return `package ${packageName};

import io.cucumber.java.Before;
import io.cucumber.java.Scenario;
import io.cucumber.java.en.*;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import org.junit.Assert;
import java.nio.file.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;

public class ${testName.replace(/\s+/g, "")}Steps {
    private RequestSpecification request;
    private Response response;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private JsonNode testConfig;
    private String baseUrl;
    private String currentFeatureName;

    @Before
    public void setUp(Scenario scenario) {
        // Extract feature name from scenario URI
        String featureUri = scenario.getUri().toString();
        // Feature URI format: "file:///path/to/features/GetUserById.feature" or "classpath:features/GetUserById.feature"
        if (featureUri.contains(".feature")) {
            // Extract just the filename without path and extension
            String featurePath = featureUri;
            if (featurePath.contains("/")) {
                featurePath = featurePath.substring(featurePath.lastIndexOf("/") + 1);
            }
            if (featurePath.contains("\\\\")) {
                featurePath = featurePath.substring(featurePath.lastIndexOf("\\\\") + 1);
            }
            currentFeatureName = featurePath.substring(0, featurePath.indexOf(".feature"));
        } else {
            // Fallback: use a default feature name
            currentFeatureName = "APITest";
        }
    }

    @Given("the API endpoint is {string}")
    public void setApiEndpoint(String endpoint) {
        try {
            // Read test.env.json file
            String configPath = Paths.get("src", "test", "resources", "test.env.json").toString();
            
            if (!Files.exists(Paths.get(configPath))) {
                throw new IllegalStateException("test.env.json not found at: " + configPath + 
                    ". Please ensure the test.env.json file exists in src/test/resources/ directory.");
            }
            
            String configContent = new String(Files.readAllBytes(Paths.get(configPath)));
            JsonNode config = objectMapper.readTree(configContent);
            
            // Get base URL
            baseUrl = config.path("api").path("baseUrl").asText();
            if (baseUrl == null || baseUrl.trim().isEmpty()) {
                throw new IllegalStateException("api.baseUrl not found in test.env.json");
            }
            
            // Remove trailing slash from base URL if present
            baseUrl = baseUrl.replaceAll("/+$", "");
            
            // Find test configuration by key from test.env.json using dynamic feature name
            testConfig = config.path("tests").path(currentFeatureName);
            
            if (testConfig.isMissingNode()) {
                throw new IllegalStateException("Test configuration for '" + currentFeatureName + "' not found in test.env.json. " +
                    "Please ensure test.env.json contains a '" + currentFeatureName + "' entry under 'tests' section.");
            }
            
            // Replace API_BASE_URL placeholder with actual base URL
            String finalEndpoint = endpoint.replace("API_BASE_URL", baseUrl);
            
            // Ensure proper URL formation
            if (!finalEndpoint.startsWith("http")) {
                finalEndpoint = baseUrl + (finalEndpoint.startsWith("/") ? finalEndpoint : "/" + finalEndpoint);
            }
            
            request = RestAssured.given().contentType(ContentType.JSON).baseUri(finalEndpoint);
            
            // Add headers from test config
            JsonNode headersNode = testConfig.path("headers");
            if (!headersNode.isMissingNode() && headersNode.isObject()) {
                headersNode.fields().forEachRemaining(header -> {
                    request.header(header.getKey(), header.getValue().asText());
                });
            }
            
        } catch (Exception e) {
            throw new IllegalStateException("Failed to read configuration from test.env.json: " + e.getMessage(), e);
        }
    }

    private JsonNode readDatasetFromFile(String datasetIdentifier, String fileType) throws Exception {
        String fileName = testConfig.path(fileType + "File").asText();
        
        if (fileName == null || fileName.isEmpty()) {
            throw new IllegalStateException(fileType + " file not configured for this test");
        }
        
        String fullPath = Paths.get("src", "test", "resources", "payloads", fileType, fileName).toString();
        
        if (!Files.exists(Paths.get(fullPath))) {
            throw new IllegalStateException(fileType + " payload file not found: " + fullPath + 
                ". Please ensure the file exists in src/test/resources/payloads/" + fileType + "/ directory.");
        }
        
        // Read the file content
        String content = new String(Files.readAllBytes(Paths.get(fullPath)));
        
        // Parse the JSON file as an object with dataset keys
        JsonNode fileData = objectMapper.readTree(content);
        
        // Get the dataset by identifier
        JsonNode dataset = fileData.get(datasetIdentifier);
        
        if (dataset == null || dataset.isMissingNode()) {
            throw new IllegalStateException("Dataset '" + datasetIdentifier + "' not found in file: " + fullPath);
        }
        
        return dataset;
    }

    @When("I send a {word} request to the endpoint")
    public void sendRequest(String method) {
        switch (method.toUpperCase()) {
            case "GET":
                response = request.get();
                break;
            case "POST":
                response = request.post();
                break;
            case "PUT":
                response = request.put();
                break;
            case "PATCH":
                response = request.patch();
                break;
            case "DELETE":
                response = request.delete();
                break;
            default:
                throw new IllegalArgumentException("Unsupported HTTP method: " + method);
        }
    }

    @When("I send a {word} request to the endpoint with payload from {string}")
    public void sendRequestWithPayload(String method, String datasetIdentifier) throws Exception {
        // Load request payload dataset from file
        JsonNode requestData = readDatasetFromFile(datasetIdentifier, "request");
        request.body(objectMapper.writeValueAsString(requestData));
        sendRequest(method);
    }

    @Then("the response status code should be {int}")
    public void verifyStatusCode(int expectedStatusCode) {
        Assert.assertEquals(expectedStatusCode, response.getStatusCode());
    }

    @Then("the response should match the expected payload from {string}")
    public void verifyResponseMatchesPayload(String datasetIdentifier) throws Exception {
        // Load expected response dataset from file
        JsonNode expected = readDatasetFromFile(datasetIdentifier, "response");
        JsonNode actual = objectMapper.readTree(response.asString());
        
        // Iterate through expected fields only, allowing partial matching
        expected.fields().forEachRemaining(field -> {
            String fieldName = field.getKey();
            // Skip comment fields that start with //
            if (!fieldName.startsWith("//")) {
                JsonNode expectedValue = field.getValue();
                JsonNode actualValue = actual.get(fieldName);
                Assert.assertNotNull("Field '" + fieldName + "' not found in response", actualValue);
                Assert.assertEquals(
                    "Field '" + fieldName + "' value mismatch",
                    expectedValue,
                    actualValue
                );
            }
        });
    }
}`;
}

// src/tools/apitools/utils/testScenarioGenerators.ts
var MAX_URL_LENGTH = 100;
var MAX_QUERY_PARAMS = 15;
var MAX_HEADERS = 15;
var MAX_HEADER_VALUE_LENGTH = 512;
var MAX_BODY_SIZE_KB = 512;
function truncateUrl(url, maxLength = MAX_URL_LENGTH) {
  if (url.length <= maxLength) return url;
  try {
    const urlObj = new URL(url);
    const baseUrl = `${urlObj.protocol}//${urlObj.host}`;
    const availableLength = maxLength - baseUrl.length - 10;
    if (urlObj.pathname.length > availableLength) {
      const truncatedPath = urlObj.pathname.substring(0, availableLength - 3) + "...";
      return `${baseUrl}${truncatedPath}`;
    }
    if (urlObj.search) {
      const maxQueryLength = availableLength - urlObj.pathname.length;
      const truncatedQuery = urlObj.search.substring(0, maxQueryLength - 3) + "...";
      return `${baseUrl}${urlObj.pathname}${truncatedQuery}`;
    }
    return url;
  } catch (error) {
    return url.substring(0, maxLength - 3) + "...";
  }
}
function reduceQueryParams(url, maxParams = MAX_QUERY_PARAMS) {
  try {
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);
    const paramEntries = Array.from(params.entries());
    if (paramEntries.length <= maxParams) return url;
    const reducedParams = new URLSearchParams();
    paramEntries.slice(0, maxParams).forEach(([key, value]) => {
      reducedParams.append(key, value);
    });
    urlObj.search = reducedParams.toString();
    return urlObj.toString();
  } catch (error) {
    return url;
  }
}
function reduceHeaders(headers, maxHeaders = MAX_HEADERS) {
  const headerEntries = Object.entries(headers);
  if (headerEntries.length <= maxHeaders) return headers;
  const importantHeaders = ["authorization", "content-type", "accept", "user-agent"];
  const important = headerEntries.filter(
    ([key]) => importantHeaders.includes(key.toLowerCase()) || key.toLowerCase().includes("auth")
  );
  const others = headerEntries.filter(
    ([key]) => !importantHeaders.includes(key.toLowerCase()) && !key.toLowerCase().includes("auth")
  );
  const maxOthers = Math.max(0, maxHeaders - important.length);
  const selectedHeaders = [...important, ...others.slice(0, maxOthers)];
  return Object.fromEntries(selectedHeaders);
}
function truncateHeaderValues(headers, maxLength = MAX_HEADER_VALUE_LENGTH) {
  const result = {};
  for (const [key, value] of Object.entries(headers)) {
    if (value && value.length > maxLength) {
      result[key] = value.substring(0, maxLength - 3) + "...";
    } else {
      result[key] = value;
    }
  }
  return result;
}
function reduceBodySize(body, maxSizeKB = MAX_BODY_SIZE_KB) {
  const jsonString = JSON.stringify(body);
  const currentSizeKB = new Blob([jsonString]).size / 1024;
  if (currentSizeKB <= maxSizeKB) return body;
  const result = { ...body };
  const entries = Object.entries(result);
  const essentialFields = ["id", "name", "email", "username", "type"];
  const nonEssential = entries.filter(([key]) => !essentialFields.includes(key.toLowerCase()));
  let fieldsToRemove = Math.ceil(nonEssential.length / 2);
  while (fieldsToRemove > 0 && JSON.stringify(result).length / 1024 > maxSizeKB) {
    const fieldToRemove = nonEssential[nonEssential.length - fieldsToRemove];
    if (fieldToRemove) {
      delete result[fieldToRemove[0]];
    }
    fieldsToRemove--;
  }
  for (const [key, value] of Object.entries(result)) {
    if (typeof value === "string" && value.length > 1e3) {
      result[key] = value.substring(0, 1e3) + "...";
    }
  }
  return result;
}
function generateNegativeTestScenarios(method, url, headers = {}, auth, body) {
  const variations = [];
  const urlObj = new URL(url);
  const urlSegments = url.split("/").filter(Boolean);
  const lastSegment = urlSegments[urlSegments.length - 1];
  let inputType = "string";
  if (!isNaN(Number(lastSegment)) && lastSegment.trim() !== "") {
    inputType = "number";
  }
  let negativeInputs = [];
  if (inputType === "number") {
    negativeInputs = ["abc", "@@", "0", "-1", "999999", "", "null"];
  } else {
    negativeInputs = ["123", "@@", "zzzzzz", "", "null"];
  }
  if (method === "GET") {
    for (const negInput of negativeInputs) {
      const negUrl = urlSegments.slice(0, -1).concat(negInput).join("/");
      variations.push({
        type: "negative",
        description: `Negative test for input: ${negInput} (GET)`,
        request: { method, url: negUrl, headers },
        expected: { status: 400, error: `Invalid resource ID or input: ${negInput}` }
      });
    }
    const urlWithInvalidQuery = `${url}${url.includes("?") ? "&" : "?"}invalid=`;
    variations.push({
      type: "negative",
      description: "Invalid query parameter value",
      request: { method, url: urlWithInvalidQuery, headers },
      expected: { status: 400, error: "Invalid query parameter" }
    });
    variations.push({
      type: "negative",
      description: "Corrupted query parameters",
      request: { method, url: `${url}${url.includes("?") ? "&" : "?"}%ZZ`, headers },
      expected: { status: 400, error: "Invalid query parameter format" }
    });
  }
  if (["POST", "PUT", "PATCH"].includes(method)) {
    const isResourceId = !isNaN(Number(lastSegment)) && lastSegment.trim() !== "";
    if (isResourceId) {
      for (const negInput of negativeInputs) {
        const negUrl = urlSegments.slice(0, -1).concat(negInput).join("/");
        variations.push({
          type: "negative",
          description: `Negative test for input: ${negInput} (${method})`,
          request: { method, url: negUrl, headers, body },
          expected: { status: 400, error: `Invalid resource ID or input: ${negInput}` }
        });
      }
    }
    variations.push({
      type: "negative",
      description: "Missing request body",
      request: { method, url, headers },
      expected: { status: 400, error: "Request body is required" }
    });
    variations.push({
      type: "negative",
      description: "Invalid JSON in request body",
      request: { method, url, headers, body: "invalid-json" },
      expected: { status: 400, error: "Invalid JSON format" }
    });
    if (body && Object.keys(body).length > 0) {
      const keys = Object.keys(body);
      for (const key of keys) {
        variations.push({
          type: "negative",
          description: `Missing required field: ${key}`,
          request: { method, url, headers, body: Object.fromEntries(Object.entries(body).filter(([k]) => k !== key)) },
          expected: { status: 400, error: `${key} is required` }
        });
      }
      for (const [key, value] of Object.entries(body)) {
        if (typeof value === "string") {
          variations.push({
            type: "negative",
            description: `Invalid type for ${key} - number instead of string`,
            request: { method, url, headers, body: { ...body, [key]: 123 } },
            expected: { status: 400, error: `${key} must be a string` }
          });
        } else if (typeof value === "number") {
          variations.push({
            type: "negative",
            description: `Invalid type for ${key} - string instead of number`,
            request: { method, url, headers, body: { ...body, [key]: "not-a-number" } },
            expected: { status: 400, error: `${key} must be a number` }
          });
        }
      }
    }
    variations.push({
      type: "negative",
      description: "Missing Content-Type header",
      request: { method, url, headers: Object.fromEntries(Object.entries(headers).filter(([k]) => k.toLowerCase() !== "content-type")), body },
      expected: { status: 400, error: "Content-Type header required" }
    });
    variations.push({
      type: "negative",
      description: "Invalid Content-Type",
      request: { method, url, headers: { ...headers, "Content-Type": "text/plain" }, body },
      expected: { status: 415, error: "Unsupported media type" }
    });
  }
  variations.push({
    type: "negative",
    description: "Invalid URL - malformed",
    request: { method, url: "invalid-url", headers },
    expected: { status: 400, error: "Invalid URL format" }
  });
  variations.push({
    type: "negative",
    description: "Non-existent endpoint",
    request: { method, url: `${urlObj.origin}/nonexistent-endpoint`, headers },
    expected: { status: 404, error: "Endpoint not found" }
  });
  variations.push({
    type: "negative",
    description: "Invalid Accept header",
    request: { method, url, headers: { ...headers, "Accept": "text/html" } },
    expected: { status: 406, error: "Not Acceptable" }
  });
  const requiredHeaderKeys = Object.keys(headers);
  for (const key of requiredHeaderKeys) {
    variations.push({
      type: "negative",
      description: `Missing required header: ${key}`,
      request: { method, url, headers: Object.fromEntries(Object.entries(headers).filter(([k]) => k !== key)), body },
      expected: { status: 400, error: `${key} header is required` }
    });
  }
  const hasAuthHeader = Object.keys(headers).some((k) => k.toLowerCase().includes("authorization"));
  const hasAuthBody = body && Object.keys(body).some((k) => k.toLowerCase().includes("auth"));
  if (hasAuthHeader || hasAuthBody || auth && auth.token) {
    variations.push({
      type: "negative",
      description: "Unauthorized access - missing authentication",
      request: { method, url, headers: Object.fromEntries(Object.entries(headers).filter(([k]) => k.toLowerCase() !== "authorization")), body },
      expected: { status: 401, error: "Authentication required" }
    });
    variations.push({
      type: "negative",
      description: "Unauthorized access - invalid token",
      request: { method, url, headers: { ...headers, "Authorization": "Bearer invalid-token" }, body },
      expected: { status: 401, error: "Invalid authentication token" }
    });
  }
  return variations.map((v) => ({ ...v, type: "negative" }));
}
function generateEdgeCaseTestScenarios(method, url, headers = {}, auth, body) {
  const variations = [];
  const urlObj = new URL(url);
  const urlSegments = url.split("/").filter(Boolean);
  const lastSegment = urlSegments[urlSegments.length - 1];
  if (["POST", "PUT", "PATCH"].includes(method) && body) {
    const largeBody = { ...body };
    for (let i = 0; i < 1e3; i++) {
      largeBody[`field${i}`] = "x".repeat(1e3);
    }
    const reducedLargeBody = reduceBodySize(largeBody, 100);
    variations.push({
      type: "edge",
      description: "Extremely large request body",
      request: {
        method,
        url,
        headers: truncateHeaderValues(reduceHeaders(headers)),
        body: reducedLargeBody
      },
      expected: {
        status: 413,
        error: "Payload Too Large"
      },
      note: `Original body would be ~1MB, reduced to manageable size for testing`
    });
    for (const [key, value] of Object.entries(body)) {
      if (typeof value === "string") {
        const veryLongString = "a".repeat(1e4);
        const truncatedString = veryLongString.substring(0, 50) + "...";
        variations.push({
          type: "edge",
          description: `Very long string value for ${key}`,
          request: {
            method,
            url,
            headers: truncateHeaderValues(reduceHeaders(headers)),
            body: { ...reduceBodySize(body), [key]: truncatedString }
          },
          expected: {
            status: 400,
            error: `${key} exceeds maximum length`
          },
          note: `String truncated from 10000 to 5000 characters for testing`
        });
        variations.push({
          type: "edge",
          description: `Empty string for ${key}`,
          request: {
            method,
            url,
            headers: truncateHeaderValues(reduceHeaders(headers)),
            body: { ...reduceBodySize(body), [key]: "" }
          },
          expected: {
            status: 400,
            error: `${key} cannot be empty`
          }
        });
      }
      if (typeof value === "number") {
        variations.push({
          type: "edge",
          description: `Maximum safe integer for ${key}`,
          request: {
            method,
            url,
            headers: truncateHeaderValues(reduceHeaders(headers)),
            body: { ...reduceBodySize(body), [key]: Number.MAX_SAFE_INTEGER }
          },
          expected: {
            status: 400,
            error: `${key} exceeds maximum value`
          }
        });
        variations.push({
          type: "edge",
          description: `Zero value for ${key}`,
          request: {
            method,
            url,
            headers: truncateHeaderValues(reduceHeaders(headers)),
            body: { ...reduceBodySize(body), [key]: 0 }
          },
          expected: {
            status: 400,
            error: `${key} cannot be zero`
          }
        });
        variations.push({
          type: "edge",
          description: `Negative value for ${key}`,
          request: {
            method,
            url,
            headers: truncateHeaderValues(reduceHeaders(headers)),
            body: { ...reduceBodySize(body), [key]: -1 }
          },
          expected: {
            status: 400,
            error: `${key} cannot be negative`
          }
        });
      }
    }
    for (const key of Object.keys(body)) {
      variations.push({
        type: "edge",
        description: `Null value for ${key}`,
        request: {
          method,
          url,
          headers: truncateHeaderValues(reduceHeaders(headers)),
          body: { ...reduceBodySize(body), [key]: null }
        },
        expected: {
          status: 400,
          error: `${key} cannot be null`
        }
      });
    }
    variations.push({
      type: "edge",
      description: "Unsupported content encoding",
      request: {
        method,
        url,
        headers: { ...truncateHeaderValues(reduceHeaders(headers)), "Content-Encoding": "gzip" },
        body: reduceBodySize(body)
      },
      expected: {
        status: 415,
        error: "Unsupported content encoding"
      }
    });
  }
  if (method === "GET") {
    const longQueryValue = "a".repeat(8e3);
    const truncatedQueryValue = longQueryValue.substring(0, 50) + "...";
    const urlWithLongQuery = `${url}${url.includes("?") ? "&" : "?"}longparam=${truncatedQueryValue}`;
    const finalUrl = truncateUrl(urlWithLongQuery);
    variations.push({
      type: "edge",
      description: "Extremely long query parameter value",
      request: {
        method,
        url: finalUrl,
        headers: truncateHeaderValues(reduceHeaders(headers))
      },
      expected: {
        status: 414,
        error: "URI Too Long"
      },
      note: `Query value truncated from 8000 to manageable size for testing`
    });
    const specialQuery = encodeURIComponent("test=value&hack=true");
    variations.push({
      type: "edge",
      description: "Special characters in query parameters",
      request: {
        method,
        url: `${url}${url.includes("?") ? "&" : "?"}special=${specialQuery}`,
        headers: truncateHeaderValues(reduceHeaders(headers))
      },
      expected: {
        status: 400,
        note: "Should handle encoded special characters"
      }
    });
  }
  const allowedMethods = ["GET", "POST", "PUT", "PATCH"];
  let wrongMethod = "POST";
  if (method === "POST") wrongMethod = "GET";
  else if (method === "PUT") wrongMethod = "GET";
  else if (method === "PATCH") wrongMethod = "GET";
  else if (method === "GET") wrongMethod = "POST";
  variations.push({
    type: "edge",
    description: `Wrong HTTP method (${wrongMethod} on ${method} endpoint)`,
    request: {
      method: wrongMethod,
      url,
      headers: truncateHeaderValues(reduceHeaders(headers)),
      body: wrongMethod !== "GET" && body ? reduceBodySize(body) : void 0
    },
    expected: {
      status: 405,
      error: "Method Not Allowed"
    },
    note: `Validates API response to unsupported HTTP method.`
  });
  const veryLongPath = "/very-long-path/" + "a".repeat(2e3);
  const longUrl = `${urlObj.origin}${veryLongPath}`;
  const truncatedLongUrl = truncateUrl(longUrl);
  variations.push({
    type: "edge",
    description: "Extremely long URL path",
    request: {
      method,
      url: truncatedLongUrl,
      headers: truncateHeaderValues(reduceHeaders(headers)),
      body: method !== "GET" ? body ? reduceBodySize(body) : void 0 : void 0
    },
    expected: {
      status: 414,
      error: "URI Too Long"
    },
    note: `Original URL would be ${longUrl.length} characters, truncated to ${truncatedLongUrl.length} for testing`
  });
  const manyQueryParams = new Array(10).fill(0).map((_, i) => `param${i}=value${i}`).join("&");
  const urlWithManyParams = `${url}${url.includes("?") ? "&" : "?"}${manyQueryParams}`;
  const reducedParamsUrl = reduceQueryParams(urlWithManyParams);
  variations.push({
    type: "edge",
    description: "Excessive number of query parameters",
    request: {
      method,
      url: reducedParamsUrl,
      headers: truncateHeaderValues(reduceHeaders(headers)),
      body: method !== "GET" ? body ? reduceBodySize(body) : void 0 : void 0
    },
    expected: {
      status: 400,
      error: "Too many query parameters"
    },
    note: `Original would have 100 parameters, reduced to manageable amount for testing`
  });
  const specialCharsUrl = url.replace(/\/([^\/]+)$/, "/\u6D4B\u8BD5-\xE9moji-special%20chars");
  variations.push({
    type: "edge",
    description: "Special characters and Unicode in URL",
    request: {
      method,
      url: specialCharsUrl,
      headers: truncateHeaderValues(reduceHeaders(headers)),
      body: method !== "GET" ? body ? reduceBodySize(body) : void 0 : void 0
    },
    expected: {
      status: 400,
      note: "Should handle Unicode characters properly"
    }
  });
  const largeHeaderValue = "x".repeat(8192);
  const truncatedHeaderValue = largeHeaderValue.substring(0, MAX_HEADER_VALUE_LENGTH - 3) + "...";
  variations.push({
    type: "edge",
    description: "Extremely large header value",
    request: {
      method,
      url,
      headers: { ...truncateHeaderValues(reduceHeaders(headers)), "X-Large-Header": truncatedHeaderValue },
      body: method !== "GET" ? body ? reduceBodySize(body) : void 0 : void 0
    },
    expected: {
      status: 431,
      error: "Request Header Fields Too Large"
    },
    note: `Original header would be ${largeHeaderValue.length} characters, truncated to ${truncatedHeaderValue.length}`
  });
  const manyHeaders = { ...headers };
  for (let i = 0; i < 100; i++) {
    manyHeaders[`X-Custom-Header-${i}`] = `value${i}`;
  }
  const reducedHeaders = reduceHeaders(manyHeaders);
  variations.push({
    type: "edge",
    description: "Excessive number of headers",
    request: {
      method,
      url,
      headers: reducedHeaders,
      body: method !== "GET" ? body ? reduceBodySize(body) : void 0 : void 0
    },
    expected: {
      status: 431,
      error: "Request Header Fields Too Large"
    },
    note: `Original would have ${Object.keys(manyHeaders).length} headers, reduced to ${Object.keys(reducedHeaders).length}`
  });
  variations.push({
    type: "edge",
    description: "Simulate concurrent requests",
    request: {
      method,
      url,
      headers: { ...truncateHeaderValues(reduceHeaders(headers)), "X-Concurrent-Test": "true" },
      body: method !== "GET" ? body ? reduceBodySize(body) : void 0 : void 0
    },
    expected: {
      status: 200,
      note: "Should handle concurrent requests properly"
    }
  });
  variations.push({
    type: "edge",
    description: "Request with potential timeout",
    request: {
      method,
      url,
      headers: { ...truncateHeaderValues(reduceHeaders(headers)), "X-Simulate-Delay": "30000" },
      body: method !== "GET" ? body ? reduceBodySize(body) : void 0 : void 0
    },
    expected: {
      status: 408,
      error: "Request Timeout"
    }
  });
  return variations.map((v) => ({ ...v, type: "edge" }));
}

// src/tools/apitools/tools/generateAPICypressTest.ts
function registerGenerateAPICypressTest(server, getLastTestedRequest, getLastTestedResponse) {
  server.registerTool(
    "generateAPICypressTest",
    {
      title: "Cypress Test Generator",
      description: "Generates a Cypress test script for the last tested API scenario with parameterized input and assertions",
      inputSchema: {
        testName: external_exports.string().default("API Test Scenario"),
        useParameterizedData: external_exports.boolean().default(true),
        includeDataVariations: external_exports.boolean().default(false)
      }
    },
    async ({ testName, useParameterizedData = true, includeDataVariations = false }) => {
      const lastTestedRequest = getLastTestedRequest();
      const lastTestedResponse = getLastTestedResponse();
      if (!lastTestedRequest) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                error: "No previous API test found. Please run a test first using the testAPI tool."
              }, null, 2)
            }
          ]
        };
      }
      const code = generateCypressTest(testName, lastTestedRequest, lastTestedResponse, true, includeDataVariations);
      return {
        content: [
          {
            type: "text",
            text: code
          }
        ]
      };
    }
  );
}

// src/tools/apitools/tools/generateAPIPlaywrightTest.ts
init_zod();
function registerGenerateAPIPlaywrightTest(server, getLastTestedRequest, getLastTestedResponse) {
  server.registerTool(
    "generateAPIPlaywrightTest",
    {
      title: "Playwright Test Generator",
      description: "Generates a Playwright test script for the last tested API scenario with parameterized input and assertions",
      inputSchema: {
        testName: external_exports.string().default("API Test Scenario"),
        useParameterizedData: external_exports.boolean().default(true),
        includeDataVariations: external_exports.boolean().default(false)
      }
    },
    async ({ testName, useParameterizedData = true, includeDataVariations = false }) => {
      const lastTestedRequest = getLastTestedRequest();
      const lastTestedResponse = getLastTestedResponse();
      if (!lastTestedRequest) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                error: "No previous API test found. Please run a test first using the testAPI tool."
              }, null, 2)
            }
          ]
        };
      }
      const code = generatePlaywrightTest(testName, lastTestedRequest, lastTestedResponse, true, includeDataVariations);
      return {
        content: [
          {
            type: "text",
            text: code
          }
        ]
      };
    }
  );
}

// src/tools/apitools/tools/generateAPIRestAssuredTest.ts
init_zod();
function registerGenerateAPIRestAssuredTest(server, getLastTestedRequest, getLastTestedResponse) {
  server.registerTool(
    "generateAPIRestAssuredTest",
    {
      title: "RestAssured Test Generator",
      description: "Generates a RestAssured (JUnit) test script for the last tested API scenario with parameterized input and assertions",
      inputSchema: {
        testName: external_exports.string().default("API Test Scenario"),
        useParameterizedData: external_exports.boolean().default(true),
        includeDataVariations: external_exports.boolean().default(false)
      }
    },
    async ({ testName, useParameterizedData = true, includeDataVariations = false }) => {
      const lastTestedRequest = getLastTestedRequest();
      const lastTestedResponse = getLastTestedResponse();
      if (!lastTestedRequest) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                error: "No previous API test found. Please run a test first using the testAPI tool."
              }, null, 2)
            }
          ]
        };
      }
      const code = generateRestAssuredTest(testName, lastTestedRequest, lastTestedResponse, useParameterizedData, includeDataVariations);
      return {
        content: [
          {
            type: "text",
            text: code
          }
        ]
      };
    }
  );
}

// src/tools/apitools/tools/generateAPIRestAssuredBDD.ts
init_zod();
var getEndpointPattern2 = (fullUrl) => {
  try {
    const parsed = new URL(fullUrl);
    const parts = parsed.pathname.split("/").filter(Boolean);
    const params = {};
    const parameterizedParts = parts.map((part, index) => {
      if (/^\d+$/.test(part)) {
        const paramName = index > 0 ? `${parts[index - 1].replace(/s$/, "")}Id` : "id";
        params[paramName] = part;
        return `<${paramName}>`;
      }
      return part;
    });
    return {
      pattern: `API_BASE_URL/${parameterizedParts.join("/")}`,
      params
    };
  } catch (e) {
    return { pattern: fullUrl, params: {} };
  }
};
function registerGenerateAPIRestAssuredBDD(server, getLastTestedRequest, getLastTestedResponse) {
  server.registerTool(
    "generateAPIRestAssuredBDD",
    {
      title: "RestAssured BDD Test Generator",
      description: "Generates BDD-style feature files and step definitions for RestAssured using the last tested API scenario",
      inputSchema: {
        testName: external_exports.string().default("API Test Scenario"),
        packageName: external_exports.string().default("test.java.stepDefinitions"),
        configPath: external_exports.string().default("src/test/resources/config/test-config.properties"),
        payloadPath: external_exports.string().default("payloads"),
        scenarioDescription: external_exports.string().optional()
      }
    },
    async ({ testName, packageName = "com.api.test.stepDefinitions", configPath = "src/test/resources/config/test-config.properties", payloadPath = "payloads", scenarioDescription }) => {
      const lastTestedRequest = getLastTestedRequest();
      const lastTestedResponse = getLastTestedResponse();
      if (!lastTestedRequest) {
        return {
          content: [
            { type: "text", text: JSON.stringify({ error: "No previous API test found. Please run a test first using the testAPI tool." }, null, 2) }
          ]
        };
      }
      const fs6 = await import("fs");
      const path6 = await import("path");
      try {
        const requestDir = path6.resolve(process.cwd(), "src", "test", "resources", "payloads", "request");
        const responseDir = path6.resolve(process.cwd(), "src", "test", "resources", "payloads", "response");
        if (!fs6.existsSync(requestDir)) fs6.mkdirSync(requestDir, { recursive: true });
        if (!fs6.existsSync(responseDir)) fs6.mkdirSync(responseDir, { recursive: true });
        const sanitized = (scenarioDescription || testName).replace(/[^a-z0-9_\-]/gi, "_").toLowerCase();
        const datasetName = `${testName}_1`;
        const requestFilename = `${testName}_request.json`;
        const responseFilename = `${testName}_response.json`;
        const requestFilePath = path6.join(requestDir, requestFilename);
        const responseFilePath = path6.join(responseDir, responseFilename);
        const configPath2 = path6.resolve(process.cwd(), "src", "test", "resources", "test.env.json");
        let config = {};
        if (fs6.existsSync(configPath2)) {
          try {
            const existingContent = fs6.readFileSync(configPath2, { encoding: "utf8" });
            config = JSON.parse(existingContent);
          } catch (e) {
            console.warn("Warning: Failed to parse existing test.env.json, creating new one");
            config = {};
          }
        }
        if (!config.api) config.api = {};
        if (!config.tests) config.tests = {};
        if (!config.api.baseUrl) {
          const baseUrl = new URL(lastTestedRequest.url || "").origin;
          config.api.baseUrl = baseUrl;
        }
        const headers = {};
        if (lastTestedRequest.headers && Object.keys(lastTestedRequest.headers).length > 0) {
          for (const [headerName, headerValue] of Object.entries(lastTestedRequest.headers)) {
            if (headerName.toLowerCase() !== "content-type") {
              headers[headerName] = headerValue;
            }
          }
        }
        config.tests[testName] = {
          description: scenarioDescription || testName,
          headers: Object.keys(headers).length > 0 ? headers : void 0,
          requestFile: lastTestedRequest.body ? requestFilename : void 0,
          responseFile: responseFilename
        };
        try {
          if (!fs6.existsSync(path6.dirname(configPath2))) {
            fs6.mkdirSync(path6.dirname(configPath2), { recursive: true });
          }
          fs6.writeFileSync(configPath2, JSON.stringify(config, null, 2), { encoding: "utf8" });
        } catch (e) {
          console.warn("Warning: Failed to update test.env.json file");
        }
        let responsePayload = {};
        if (fs6.existsSync(responseFilePath)) {
          try {
            const existingContent = fs6.readFileSync(responseFilePath, { encoding: "utf8" });
            responsePayload = JSON.parse(existingContent);
          } catch (e) {
            console.warn("Warning: Failed to parse existing response file, creating new one");
            responsePayload = {};
          }
        }
        if (lastTestedResponse && lastTestedResponse.body) {
          const body = typeof lastTestedResponse.body === "string" ? JSON.parse(lastTestedResponse.body) : lastTestedResponse.body;
          responsePayload[datasetName] = body;
        } else {
          responsePayload[datasetName] = {};
        }
        const responsePayloadJson = JSON.stringify(responsePayload, null, 2);
        try {
          fs6.writeFileSync(responseFilePath, responsePayloadJson, { encoding: "utf8" });
        } catch (e) {
        }
        if (lastTestedRequest.body) {
          let requestPayload = {};
          if (fs6.existsSync(requestFilePath)) {
            try {
              const existingContent = fs6.readFileSync(requestFilePath, { encoding: "utf8" });
              requestPayload = JSON.parse(existingContent);
            } catch (e) {
              console.warn("Warning: Failed to parse existing request file, creating new one");
              requestPayload = {};
            }
          }
          const requestBody = typeof lastTestedRequest.body === "string" ? JSON.parse(lastTestedRequest.body) : lastTestedRequest.body;
          requestPayload[datasetName] = requestBody;
          const requestJson = JSON.stringify(requestPayload, null, 2);
          try {
            fs6.writeFileSync(requestFilePath, requestJson, { encoding: "utf8" });
          } catch (e) {
          }
        }
        const sanitizedRequest = { method: lastTestedRequest.method, url: lastTestedRequest.url, headers: lastTestedRequest.headers, body: lastTestedRequest.body, auth: lastTestedRequest.auth };
        const sanitizedResponse = { status: lastTestedResponse && typeof lastTestedResponse.status === "number" ? lastTestedResponse.status : 200, body: lastTestedResponse?.body };
        const method = sanitizedRequest.method?.toUpperCase();
        const scenarioDesc = scenarioDescription || testName;
        const { pattern: endpointPattern, params } = getEndpointPattern2(lastTestedRequest.url || "");
        const paramNames = Object.keys(params);
        let feature;
        const exampleRows = [
          `      | ${[...paramNames.map((param) => params[param]), sanitizedResponse.status, datasetName].join(" | ")} |`
        ];
        if (method === "GET") {
          feature = `
Feature: ${testName}

  Scenario Outline: ${scenarioDesc}
    Given the API endpoint is "${endpointPattern}"
    When I send a GET request to the endpoint
    Then the response status code should be <statusCode>
    And the response should match the expected payload from "<Response_Dataset>"

    Examples:
      | ${[...paramNames, "statusCode", "Response_Dataset"].join(" | ")} |
${exampleRows.join("\n")}
`.trim();
        } else if (["POST", "PUT", "PATCH"].includes(method)) {
          feature = `
Feature: ${testName}

  Scenario Outline: ${scenarioDesc}
    Given the API endpoint is "${endpointPattern}"
    When I send a ${method} request to the endpoint with payload from "<Request_Dataset>"
    Then the response status code should be <statusCode>
    And the response should match the expected payload from "<Response_Dataset>"

    Examples:
      | ${[...paramNames, "statusCode", "Request_Dataset", "Response_Dataset"].join(" | ")} |
${exampleRows.join("\n")}
`.trim();
        } else {
          feature = `
Feature: ${testName}

  Scenario Outline: ${scenarioDesc}
    Given the API endpoint is "${endpointPattern}"
    When I send a ${method} request to the endpoint
    Then the response status code should be <statusCode>
    And the response should match the expected payload from "<Response_Dataset>"

    Examples:
      | ${[...paramNames, "statusCode", "Response_Dataset"].join(" | ")} |
${exampleRows.join("\n")}
`.trim();
        }
        const steps = generateStepDefinitions(testName, sanitizedRequest, sanitizedResponse, packageName, sanitized);
        return {
          feature: { content: feature, filename: `${testName}.feature`, path: "src/test/resources/features" },
          stepDefinitions: { content: steps, filename: `${testName}Steps.java`, path: "src/test/java/stepDefinitions" }
        };
      } catch (err) {
        return { content: [{ type: "text", text: String(err) }] };
      }
    }
  );
}

// src/tools/apitools/tools/testAPI.ts
init_zod();
function registerTestAPITool(server, setLastTestedRequest, setLastTestedResponse, playwrightManager) {
  server.registerTool(
    "testAPI",
    {
      title: "API Test Tool",
      description: "Sends a GET, POST, PUT, or PATCH request to a URL with optional headers, auth, and body",
      inputSchema: {
        method: external_exports.enum(["GET", "POST", "PUT", "PATCH"]),
        url: external_exports.string().url(),
        headers: external_exports.record(external_exports.string()).optional(),
        auth: external_exports.object({
          type: external_exports.enum(["basic", "bearer"]),
          token: external_exports.string()
        }).optional(),
        body: external_exports.record(external_exports.any()).optional()
      }
    },
    async (input) => {
      const { method, url, headers = {}, auth, body } = input;
      setLastTestedRequest({ method, url, headers, body, auth });
      const finalHeaders = { ...headers };
      if (auth) {
        finalHeaders["Authorization"] = auth.type === "basic" ? `Basic ${auth.token}` : `Bearer ${auth.token}`;
      }
      if (method !== "GET") {
        finalHeaders["Content-Type"] = finalHeaders["Content-Type"] || "application/json";
      }
      try {
        const options2 = {
          method,
          headers: finalHeaders
        };
        if (method !== "GET") {
          options2.body = JSON.stringify(body || {});
        }
        const response = await fetch(url, options2);
        if (!response) {
          return {
            content: [
              {
                type: "text",
                text: "Error: No response received from fetch."
              }
            ]
          };
        }
        const text = await response.text();
        let jsonResponse;
        try {
          jsonResponse = JSON.parse(text);
        } catch {
          jsonResponse = text;
        }
        const responseData = {
          status: response.status,
          body: jsonResponse
        };
        setLastTestedResponse(responseData);
        if (playwrightManager && playwrightManager.getRecordingManager) {
          const recordingManager = playwrightManager.getRecordingManager();
          if (recordingManager) {
            recordingManager.recordApiCall(
              method,
              url,
              { headers: finalHeaders, body, auth },
              responseData
            );
          }
        }
        return {
          content: [
            {
              type: "text",
              text: `Status: ${response.status}

Response:
${text}`
            }
          ]
        };
      } catch (err) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${err instanceof Error ? err.message : String(err)}`
            }
          ]
        };
      }
    }
  );
}

// src/tools/apitools/tools/generateAPICypressNegative.ts
init_zod();
function registerGenerateAPICypressNegative(server, getLastTestedRequest) {
  server.registerTool(
    "generateAPICypressNegative",
    {
      title: "Cypress Negative Test Suite Generator",
      description: "Generates a complete Cypress test suite for all negative test scenarios based on the last tested API",
      inputSchema: {
        testSuiteName: external_exports.string().optional(),
        groupByScenario: external_exports.boolean().default(true)
      }
    },
    async (args) => {
      if (typeof args === "string") {
        args = {};
      }
      if (typeof args === "object" && args && Object.keys(args).length === 0) {
        args = {};
      }
      const lastTestedRequest = getLastTestedRequest();
      if (!lastTestedRequest) {
        return {
          content: [
            {
              type: "text",
              text: "Error: No previous API test found. Please run testAPI first before generating test suites."
            }
          ]
        };
      }
      const scenarios = generateNegativeTestScenarios(
        lastTestedRequest.method,
        lastTestedRequest.url,
        lastTestedRequest.headers || {},
        lastTestedRequest.auth,
        lastTestedRequest.body
      );
      const suiteName = args.testSuiteName || `CypressNegativeTestSuite_${lastTestedRequest.url.split("/").pop()}`;
      const suiteCode = generateNegativeTestSuiteCode(scenarios, "cypress", suiteName);
      return { content: [{ type: "text", text: suiteCode }] };
    }
  );
}

// src/tools/apitools/tools/generateAPIPlaywrightNegative.ts
init_zod();
function registerGenerateAPIPlaywrightNegative(server, getLastTestedRequest) {
  server.registerTool(
    "generateAPIPlaywrightNegative",
    {
      title: "Playwright Negative Test Suite Generator",
      description: "Generates a complete Playwright test suite for all negative test scenarios based on the last tested API",
      inputSchema: {
        testSuiteName: external_exports.string().optional(),
        groupByScenario: external_exports.boolean().default(true)
      }
    },
    async (args) => {
      if (typeof args === "string") {
        args = {};
      }
      if (typeof args === "object" && args && Object.keys(args).length === 0) {
        args = {};
      }
      const lastTestedRequest = getLastTestedRequest();
      if (!lastTestedRequest) {
        return {
          content: [
            {
              type: "text",
              text: "Error: No previous API test found. Please run testAPI first before generating test suites."
            }
          ]
        };
      }
      const scenarios = generateNegativeTestScenarios(
        lastTestedRequest.method,
        lastTestedRequest.url,
        lastTestedRequest.headers || {},
        lastTestedRequest.auth,
        lastTestedRequest.body
      );
      const suiteName = args.testSuiteName || `PlaywrightNegativeTestSuite_${lastTestedRequest.url.split("/").pop()}`;
      const suiteCode = generateNegativeTestSuiteCode(scenarios, "playwright", suiteName);
      return { content: [{ type: "text", text: suiteCode }] };
    }
  );
}

// src/tools/apitools/tools/generateAPICypressEdgeCase.ts
init_zod();
function registerGenerateAPICypressEdgeCase(server, getLastTestedRequest) {
  server.registerTool(
    "generateAPICypressEdgeCase",
    {
      title: "Cypress Edge Case Test Suite Generator",
      description: "Generates a complete Cypress test suite for all edge case test scenarios based on the last tested API",
      inputSchema: {
        testSuiteName: external_exports.string().optional(),
        groupByScenario: external_exports.boolean().default(true)
      }
    },
    async (args) => {
      if (typeof args === "string" || typeof args === "object" && args && Object.keys(args).length === 0) {
        args = {};
      }
      const lastTestedRequest = getLastTestedRequest();
      if (!lastTestedRequest) {
        return {
          content: [
            {
              type: "text",
              text: "Error: No previous API test found. Please run testAPI first before generating test suites."
            }
          ]
        };
      }
      const scenarios = generateEdgeCaseTestScenarios(
        lastTestedRequest.method,
        lastTestedRequest.url,
        lastTestedRequest.headers || {},
        lastTestedRequest.auth,
        lastTestedRequest.body
      );
      const suiteName = args.testSuiteName || `CypressEdgeCaseTestSuite_${lastTestedRequest.url.split("/").pop()}`;
      const suiteCode = generateNegativeTestSuiteCode(scenarios, "cypress", suiteName);
      return { content: [{ type: "text", text: suiteCode }] };
    }
  );
}

// src/tools/apitools/tools/generateAPIPlaywrightEdgeCase.ts
init_zod();
function registerGenerateAPIPlaywrightEdgeCase(server, getLastTestedRequest) {
  server.registerTool(
    "generateAPIPlaywrightEdgeCase",
    {
      title: "Playwright Edge Case Test Suite Generator",
      description: "Generates a complete Playwright test suite for all edge case test scenarios based on the last tested API",
      inputSchema: {
        testSuiteName: external_exports.string().optional(),
        groupByScenario: external_exports.boolean().default(true)
      }
    },
    async (args) => {
      if (typeof args === "string" || typeof args === "object" && args && Object.keys(args).length === 0) {
        args = {};
      }
      const lastTestedRequest = getLastTestedRequest();
      if (!lastTestedRequest) {
        return {
          content: [
            {
              type: "text",
              text: "Error: No previous API test found. Please run testAPI first before generating test suites."
            }
          ]
        };
      }
      const scenarios = generateEdgeCaseTestScenarios(
        lastTestedRequest.method,
        lastTestedRequest.url,
        lastTestedRequest.headers || {},
        lastTestedRequest.auth,
        lastTestedRequest.body
      );
      const suiteName = args.testSuiteName || `PlaywrightEdgeCaseTestSuite_${lastTestedRequest.url.split("/").pop()}`;
      const suiteCode = generateNegativeTestSuiteCode(scenarios, "playwright", suiteName);
      return { content: [{ type: "text", text: suiteCode }] };
    }
  );
}

// src/tools/webtools/tools/generatePlaywrightScript.ts
init_zod();

// src/tools/webtools/utils/testDataExtractor.ts
function extractTestData(steps) {
  const testData = {};
  const seenValues = /* @__PURE__ */ new Set();
  steps.forEach((step, index) => {
    if (step.action === "type" && step.data?.text) {
      const text = step.data.text.trim();
      if (text && text.length > 1 && !seenValues.has(text)) {
        seenValues.add(text);
        const paramName = generateParameterName(step.element?.humanDescription, text, index);
        testData[paramName] = text;
      }
    }
    if (step.action === "select_option" && step.data?.values && Array.isArray(step.data.values)) {
      step.data.values.forEach((value, valueIndex) => {
        if (value && value.length > 0 && !seenValues.has(value)) {
          seenValues.add(value);
          const paramName = generateParameterName(step.element?.humanDescription, value, index + valueIndex);
          testData[paramName] = value;
        }
      });
    }
    if (step.action === "navigate" && step.data?.url) {
      const url = step.data.url;
      if (!testData.baseUrl && !url.includes("about:blank")) {
        testData.baseUrl = url;
      }
    }
    if (step.playwrightCode) {
      extractValuesFromPlaywrightCode(step.playwrightCode, testData, seenValues);
    }
  });
  return testData;
}
function generateParameterName(elementDesc, value, index) {
  if (!elementDesc) return `input_${index}`;
  const desc = elementDesc.toLowerCase();
  if (desc.includes("country") || desc.includes("nation")) {
    return "selectedCountry";
  }
  if (desc.includes("state") || desc.includes("province")) {
    return "selectedState";
  }
  if (desc.includes("city")) {
    return "selectedCity";
  }
  if (desc.includes("category")) {
    return "selectedCategory";
  }
  if (desc.includes("option") || desc.includes("dropdown") || desc.includes("select")) {
    return "selectedOption";
  }
  if (desc.includes("email") || value.includes("@")) {
    return "email";
  }
  if (desc.includes("name") || /^[a-zA-Z\s]+$/.test(value)) {
    if (desc.includes("first")) return "firstName";
    if (desc.includes("last")) return "lastName";
    return "name";
  }
  if (desc.includes("address") || value.includes("Street") || value.includes("Ave")) {
    return "address";
  }
  if (desc.includes("phone") || /^\+?[\d\s\-\(\)]+$/.test(value)) {
    return "phone";
  }
  if (value.includes("$") || value.includes("\u20AC") || value.includes("\xA3")) {
    return "price";
  }
  if (/laptop|phone|computer|product/i.test(value)) {
    return "productName";
  }
  const fieldName = desc.replace(/[^a-zA-Z]/g, "").replace(/input|field|text/gi, "");
  return fieldName || `value_${index}`;
}
function extractValuesFromPlaywrightCode(code, testData, seenValues) {
  const expectMatches = code.match(/expect\([^)]+\)\.toContain\(['"`]([^'"`]+)['"`]\)/g);
  if (expectMatches) {
    expectMatches.forEach((match) => {
      const valueMatch = match.match(/['"`]([^'"`]+)['"`]/);
      if (valueMatch) {
        const value = valueMatch[1];
        if (value.length > 2 && !seenValues.has(value)) {
          seenValues.add(value);
          if (value.includes("$")) {
            testData.expectedPrice = value;
          } else if (/^[A-Z][a-z]+(\s[A-Z][a-z]+)*$/.test(value)) {
            testData.expectedProductName = value;
          }
        }
      }
    });
  }
}
function findParameterKey(testData, value) {
  for (const [key, paramValue] of Object.entries(testData)) {
    if (String(paramValue) === value) {
      return key;
    }
  }
  return null;
}

// src/tools/webtools/utils/playwrightUtils/commentGenerator.ts
function getCleanStepDescription(step, stepNumber) {
  switch (step.action) {
    case "navigate":
      return generateNavigationComment(step.data?.url);
    case "click":
      return generateClickComment(step.element?.humanDescription, stepNumber);
    case "type":
      return generateTypeComment(step.element?.humanDescription, step.data?.text, stepNumber);
    case "testAPI":
      return generateAPIComment(step.data?.url, step.data?.method);
    default:
      return null;
  }
}
function generateNavigationComment(url) {
  if (!url) return "Navigate to page";
  try {
    const urlObj = new URL(url, "http://localhost");
    const hostname = urlObj.hostname;
    const pathname = urlObj.pathname;
    if (hostname === "localhost" || hostname.startsWith("127.0.0.1")) {
      if (pathname === "/" || pathname === "") {
        return "Navigate to application home page";
      } else if (pathname.includes("admin")) {
        return "Navigate to admin section";
      } else if (pathname.includes("login")) {
        return "Navigate to login page";
      } else if (pathname.includes("checkout")) {
        return "Navigate to checkout page";
      } else if (pathname.includes("cart")) {
        return "Navigate to shopping cart";
      } else if (pathname.includes("profile")) {
        return "Navigate to user profile";
      } else if (pathname.includes("settings")) {
        return "Navigate to settings page";
      } else {
        const pageName = pathname.split("/").filter(Boolean).pop() || "page";
        return `Navigate to ${pageName.replace(/[_-]/g, " ")} page`;
      }
    } else {
      if (hostname.includes("google")) {
        return "Navigate to Google";
      } else if (hostname.includes("github")) {
        return "Navigate to GitHub";
      } else {
        return `Navigate to ${hostname}`;
      }
    }
  } catch {
    return `Navigate to ${url}`;
  }
}
function generateClickComment(elementDesc, stepNumber) {
  if (!elementDesc) return "Click element";
  const desc = elementDesc.toLowerCase();
  if (isFormSubmissionAction(desc)) {
    return "Process transaction";
  } else if (isNavigationAction(desc)) {
    return "Navigate to page";
  } else if (isDataModificationAction(desc)) {
    return "Add item";
  } else if (desc.includes("close") || desc.includes("dismiss")) {
    return "Close dialog";
  } else if (desc.includes("expand") || desc.includes("collapse")) {
    return "Toggle section";
  } else {
    if (desc.includes("button")) {
      const actionMatch = desc.match(/(add|remove|delete|edit|save|submit|send|create|update)/);
      if (actionMatch) {
        return `${actionMatch[1].charAt(0).toUpperCase() + actionMatch[1].slice(1)} action`;
      }
    }
    return `Click ${elementDesc}`;
  }
}
function generateTypeComment(elementDesc, text, stepNumber) {
  if (!elementDesc) return "Fill input field";
  const desc = elementDesc.toLowerCase();
  if (isPersonalInfoField(desc)) {
    return "Fill personal information";
  } else if (isAuthField(desc)) {
    return "Enter credentials";
  } else if (isSearchField(desc)) {
    return "Enter search criteria";
  } else if (isConfigurationField(desc)) {
    return "Configure settings";
  } else if (desc.includes("message") || desc.includes("comment") || desc.includes("note")) {
    return "Enter message";
  } else {
    return `Fill ${elementDesc}`;
  }
}
function generateAPIComment(url, method) {
  if (!url) return "API call";
  const methodUpper = (method || "GET").toUpperCase();
  try {
    const urlObj = new URL(url, "http://localhost");
    const pathname = urlObj.pathname;
    if (pathname.includes("login") || pathname.includes("auth")) {
      return `${methodUpper} authenticate user`;
    } else if (pathname.includes("user")) {
      if (methodUpper === "POST") return `${methodUpper} create user`;
      if (methodUpper === "GET") return `${methodUpper} retrieve user data`;
      if (methodUpper === "PUT") return `${methodUpper} update user`;
      if (methodUpper === "DELETE") return `${methodUpper} delete user`;
    } else if (pathname.includes("order")) {
      if (methodUpper === "POST") return `${methodUpper} create new resource`;
      if (methodUpper === "GET") return `${methodUpper} retrieve resource`;
      if (methodUpper === "PUT") return `${methodUpper} update resource`;
    } else if (pathname.includes("search")) {
      return `${methodUpper} search data`;
    } else if (pathname.includes("upload")) {
      return `${methodUpper} upload file`;
    } else {
      const endpoint = pathname.split("/").filter(Boolean).pop() || "resource";
      return `${methodUpper} ${endpoint.replace(/[_-]/g, " ")}`;
    }
  } catch {
    return `${methodUpper} ${url}`;
  }
  return `${methodUpper} request`;
}
function isFormSubmissionAction(desc) {
  return desc.includes("submit") || desc.includes("save") || desc.includes("send") || desc.includes("confirm") || desc.includes("apply") || desc.includes("create") || desc.includes("place order") || desc.includes("checkout") || desc.includes("complete") || desc.includes("finish");
}
function isNavigationAction(desc) {
  return desc.includes("link") || desc.includes("menu") || desc.includes("tab") || desc.includes("navigate") || desc.includes("go to") || desc.includes("view") || desc.includes("open") || desc.includes("back") || desc.includes("next") || desc.includes("home") || desc.includes("page");
}
function isDataModificationAction(desc) {
  return desc.includes("add") || desc.includes("remove") || desc.includes("delete") || desc.includes("edit") || desc.includes("update") || desc.includes("modify") || desc.includes("change") || desc.includes("upload") || desc.includes("select") || desc.includes("choose");
}
function isPersonalInfoField(desc) {
  return desc.includes("name") || desc.includes("email") || desc.includes("phone") || desc.includes("address") || desc.includes("zip") || desc.includes("postal") || desc.includes("city") || desc.includes("state") || desc.includes("country") || desc.includes("birth") || desc.includes("age");
}
function isAuthField(desc) {
  return desc.includes("password") || desc.includes("username") || desc.includes("login") || desc.includes("auth") || desc.includes("token") || desc.includes("key") || desc.includes("secret");
}
function isSearchField(desc) {
  return desc.includes("search") || desc.includes("query") || desc.includes("find") || desc.includes("filter") || desc.includes("lookup");
}
function isConfigurationField(desc) {
  return desc.includes("setting") || desc.includes("config") || desc.includes("preference") || desc.includes("option") || desc.includes("parameter");
}

// src/tools/webtools/utils/playwrightUtils/selectorExtractor.ts
function extractSelectorFromPlaywrightCode(playwrightCode) {
  if (!playwrightCode || !playwrightCode.trim()) {
    console.warn(`\u274C Empty or null Playwright code provided`);
    return null;
  }
  const cleanCode = playwrightCode.trim().replace(/^await\s+/, "");
  const patterns = [
    // page.getByRole('button', { name: 'Text' }) - HIGHEST PRIORITY
    {
      pattern: /page\.getByRole\(([^)]+)\)/,
      extract: (match) => {
        const result = `page.getByRole(${match[1]})`;
        return result;
      }
    },
    // page.getByText('text') or page.getByText(/regex/)
    {
      pattern: /page\.getByText\(([^)]+)\)/,
      extract: (match) => {
        const result = `page.getByText(${match[1]})`;
        console.log(`\u2705 Extracted getByText selector: ${result}`);
        return result;
      }
    },
    // page.getByLabel('label')
    {
      pattern: /page\.getByLabel\(([^)]+)\)/,
      extract: (match) => {
        const result = `page.getByLabel(${match[1]})`;
        console.log(`\u2705 Extracted getByLabel selector: ${result}`);
        return result;
      }
    },
    // page.getByPlaceholder('placeholder')
    {
      pattern: /page\.getByPlaceholder\(([^)]+)\)/,
      extract: (match) => {
        const result = `page.getByPlaceholder(${match[1]})`;
        console.log(`\u2705 Extracted getByPlaceholder selector: ${result}`);
        return result;
      }
    },
    // page.getByTestId('testid')
    {
      pattern: /page\.getByTestId\(([^)]+)\)/,
      extract: (match) => {
        const result = `page.getByTestId(${match[1]})`;
        console.log(`\u2705 Extracted getByTestId selector: ${result}`);
        return result;
      }
    },
    // page.locator('#id') or page.locator('.class') or page.locator('[attr]')
    {
      pattern: /page\.locator\(['"`]([^'"`]+)['"`]\)/,
      extract: (match) => {
        const result = `page.locator('${match[1]}')`;
        console.log(`\u2705 Extracted locator selector: ${result}`);
        return result;
      }
    },
    // Complex chained selectors: page.locator('span').filter({ hasText: 'text' })
    {
      pattern: /(page\.locator\([^)]+\)(?:\.[^(]+\([^)]*\))*)/,
      extract: (match) => {
        const result = match[1];
        console.log(`\u2705 Extracted complex selector: ${result}`);
        return result;
      }
    },
    // page.click('#id') - direct selector (extract locator equivalent)
    {
      pattern: /page\.click\(['"`]([^'"`]+)['"`]\)/,
      extract: (match) => {
        const result = `page.locator('${match[1]}')`;
        console.log(`\u2705 Extracted selector from click: ${result}`);
        return result;
      }
    },
    // page.fill('#id', 'value') - direct selector (extract locator equivalent)
    {
      pattern: /page\.fill\(['"`]([^'"`]+)['"`]/,
      extract: (match) => {
        const result = `page.locator('${match[1]}')`;
        console.log(`\u2705 Extracted selector from fill: ${result}`);
        return result;
      }
    }
  ];
  for (const { pattern, extract } of patterns) {
    const match = cleanCode.match(pattern);
    if (match) {
      try {
        return extract(match);
      } catch (error) {
        console.warn(`Error extracting selector from pattern ${pattern}:`, error);
        continue;
      }
    }
  }
  console.warn(`\u274C Could not extract selector from Playwright code: ${cleanCode}`);
  return null;
}
function generateSelectorFromRef(ref, elementDescription) {
  console.log(`\u{1F50D} Generating fallback selector for ref: ${ref}, description: ${elementDescription}`);
  if (elementDescription) {
    const desc = elementDescription.toLowerCase();
    if (desc.includes("button")) {
      const textMatch = desc.match(/button[^"]*"([^"]+)"/i) || desc.match(/([^"\s]+)\s+button/i);
      if (textMatch) {
        const buttonText = textMatch[1];
        console.log(`\u{1F3AF} Generated button selector with text: ${buttonText}`);
        return `page.getByRole('button', { name: '${buttonText}' })`;
      }
      console.log(`\u{1F3AF} Generated generic button selector`);
      return `page.getByRole('button')`;
    }
    if (desc.includes("link")) {
      const textMatch = desc.match(/link[^"]*"([^"]+)"/i) || desc.match(/([^"\s]+)\s+link/i);
      if (textMatch) {
        const linkText = textMatch[1];
        console.log(`\u{1F3AF} Generated link selector with text: ${linkText}`);
        return `page.getByRole('link', { name: '${linkText}' })`;
      }
      return `page.getByRole('link')`;
    }
    if (desc.includes("textbox") || desc.includes("input")) {
      if (desc.includes("username") || desc.toLowerCase().includes("user name")) {
        console.log(`\u{1F3AF} Generated username textbox selector`);
        return `page.getByRole('textbox', { name: /username/i })`;
      }
      if (desc.includes("password")) {
        console.log(`\u{1F3AF} Generated password textbox selector`);
        return `page.getByRole('textbox', { name: /password/i })`;
      }
      if (desc.includes("email")) {
        console.log(`\u{1F3AF} Generated email textbox selector`);
        return `page.getByRole('textbox', { name: /email/i })`;
      }
      if (desc.includes("name") && !desc.includes("username")) {
        console.log(`\u{1F3AF} Generated name textbox selector`);
        return `page.getByRole('textbox', { name: /name/i })`;
      }
      if (desc.includes("address")) {
        console.log(`\u{1F3AF} Generated address textbox selector`);
        return `page.getByRole('textbox', { name: /address/i })`;
      }
      const fieldMatch = desc.match(/([^"\s]+)\s+(?:textbox|input)/i);
      if (fieldMatch) {
        const fieldName = fieldMatch[1];
        console.log(`\u{1F3AF} Generated textbox selector with extracted name: ${fieldName}`);
        return `page.getByRole('textbox', { name: /${fieldName}/i })`;
      }
      console.log(`\u{1F3AF} Generated generic textbox selector`);
      return `page.getByRole('textbox')`;
    }
  }
  if (ref.startsWith("e") && /^\d+$/.test(ref.slice(1))) {
    console.warn(`\u26A0\uFE0F Using generated ref ID ${ref} as selector - this may be unreliable`);
    return `page.locator('#${ref}')`;
  }
  if (ref.startsWith("#") || ref.startsWith(".") || ref.startsWith("[")) {
    console.log(`\u{1F3AF} Generated CSS selector from ref: ${ref}`);
    return `page.locator('${ref}')`;
  }
  console.warn(`\u26A0\uFE0F Using last resort selector for ref: ${ref}`);
  return `page.locator('[data-testid="${ref}"], [aria-label="${ref}"], [title="${ref}"]')`;
}

// src/tools/webtools/utils/playwrightUtils/utils.ts
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// src/tools/webtools/utils/playwrightUtils/stepGenerators.ts
function generateNavigationStep(step, testData, includeWaits) {
  const lines = [];
  if (step.playwrightCode) {
    let navCode = step.playwrightCode;
    if (testData.baseUrl && step.data?.url) {
      navCode = navCode.replace(`'${step.data.url}'`, "testData.baseUrl");
      navCode = navCode.replace(`"${step.data.url}"`, "testData.baseUrl");
    }
    lines.push(`  ${navCode}`);
  } else {
    const urlToUse = testData.baseUrl ? "testData.baseUrl" : `'${step.data?.url}'`;
    lines.push(`  await page.goto(${urlToUse});`);
  }
  if (includeWaits && !step.playwrightCode?.includes("waitFor")) {
    lines.push(`  await page.waitForLoadState('domcontentloaded');`);
  }
  return lines;
}
function generateClickStep(step, includeAssertions, includeWaits) {
  const lines = [];
  if (step.playwrightCode && step.playwrightCode.trim()) {
    const clickCode = step.playwrightCode.trim();
    const selector2 = extractSelectorFromPlaywrightCode(step.playwrightCode);
    if (includeAssertions && selector2) {
      lines.push(`  await expect(${selector2}).toBeVisible({ timeout: 10000 });`);
    }
    lines.push(`  ${clickCode}`);
    if (includeWaits && !step.playwrightCode.includes("waitFor")) {
      if (isLikelyNavigation(step.element?.humanDescription)) {
        lines.push(`  await page.waitForLoadState('domcontentloaded');`);
      }
    }
    return lines;
  }
  const elementDesc = step.element?.humanDescription || "";
  let selector = "";
  if (elementDesc.toLowerCase().includes("login") && elementDesc.toLowerCase().includes("button")) {
    selector = `page.getByRole('button', { name: 'Login' })`;
  } else if (elementDesc.toLowerCase().includes("submit") && elementDesc.toLowerCase().includes("button")) {
    selector = `page.getByRole('button', { name: 'Submit' })`;
  } else if (elementDesc.toLowerCase().includes("save") && elementDesc.toLowerCase().includes("button")) {
    selector = `page.getByRole('button', { name: 'Save' })`;
  } else if (elementDesc.toLowerCase().includes("button")) {
    const buttonMatch = elementDesc.match(/(.+?)\s+button/i) || elementDesc.match(/button\s+(.+)/i);
    if (buttonMatch) {
      const buttonText = buttonMatch[1].replace(/"/g, "");
      selector = `page.getByRole('button', { name: '${buttonText}' })`;
    } else {
      selector = `page.getByRole('button')`;
    }
  } else if (elementDesc.toLowerCase().includes("link")) {
    const linkMatch = elementDesc.match(/(.+?)\s+link/i) || elementDesc.match(/link\s+(.+)/i);
    if (linkMatch) {
      const linkText = linkMatch[1].replace(/"/g, "");
      selector = `page.getByRole('link', { name: '${linkText}' })`;
    } else {
      selector = `page.getByRole('link')`;
    }
  } else {
    selector = generateSelectorFromRef(step.element?.ref || "", elementDesc);
  }
  if (includeAssertions) {
    lines.push(`  await expect(${selector}).toBeVisible({ timeout: 10000 });`);
  }
  lines.push(`  await ${selector}.click();`);
  if (includeWaits) {
    if (isLikelyNavigation(elementDesc)) {
      lines.push(`  await page.waitForLoadState('domcontentloaded');`);
    }
  }
  return lines;
}
function generateTypeStep(step, testData, includeAssertions) {
  const lines = [];
  if (step.playwrightCode && step.playwrightCode.trim()) {
    let parameterizedCode = step.playwrightCode.trim();
    Object.entries(testData).forEach(([key, value]) => {
      const valueStr = String(value);
      if (valueStr.length > 2) {
        parameterizedCode = parameterizedCode.replace(
          new RegExp(`'${escapeRegex(valueStr)}'`, "g"),
          `testData.${key}`
        );
        parameterizedCode = parameterizedCode.replace(
          new RegExp(`"${escapeRegex(valueStr)}"`, "g"),
          `testData.${key}`
        );
      }
    });
    const selector2 = extractSelectorFromPlaywrightCode(step.playwrightCode);
    if (includeAssertions && selector2) {
      lines.push(`  await expect(${selector2}).toBeVisible({ timeout: 10000 });`);
    }
    lines.push(`  ${parameterizedCode}`);
    return lines;
  }
  const elementDesc = step.element?.humanDescription || "";
  const inputValue = step.data?.text || "";
  let selector = "";
  if (elementDesc.toLowerCase().includes("username")) {
    selector = `page.getByRole('textbox', { name: 'Username' })`;
  } else if (elementDesc.toLowerCase().includes("password")) {
    selector = `page.getByRole('textbox', { name: 'Password' })`;
  } else if (elementDesc.toLowerCase().includes("email")) {
    selector = `page.getByRole('textbox', { name: /email/i })`;
  } else if (elementDesc.toLowerCase().includes("name") && !elementDesc.toLowerCase().includes("username")) {
    selector = `page.getByRole('textbox', { name: /name/i })`;
  } else if (elementDesc.toLowerCase().includes("textbox")) {
    const textboxMatch = elementDesc.match(/(\w+)\s+textbox/i);
    if (textboxMatch) {
      const fieldName = textboxMatch[1];
      selector = `page.getByRole('textbox', { name: '${fieldName}' })`;
    } else {
      selector = `page.getByRole('textbox')`;
    }
  } else {
    selector = generateSelectorFromRef(step.element?.ref || "", elementDesc);
  }
  const paramKey = findParameterKey(testData, inputValue);
  const valueToUse = paramKey ? `testData.${paramKey}` : `'${inputValue}'`;
  if (includeAssertions) {
    lines.push(`  await expect(${selector}).toBeVisible({ timeout: 10000 });`);
  }
  lines.push(`  await ${selector}.fill(${valueToUse});`);
  return lines;
}
function generateSelectStep(step, testData, includeAssertions) {
  const lines = [];
  let selector = null;
  let selectCode = null;
  if (step.playwrightCode) {
    selector = extractSelectorFromPlaywrightCode(step.playwrightCode);
    let parameterizedCode = step.playwrightCode;
    if (step.data?.values && Array.isArray(step.data.values)) {
      step.data.values.forEach((value) => {
        const paramKey = findParameterKey(testData, value);
        if (paramKey) {
          parameterizedCode = parameterizedCode.replace(
            new RegExp(`'${escapeRegex(value)}'`, "g"),
            `testData.${paramKey}`
          );
          parameterizedCode = parameterizedCode.replace(
            new RegExp(`"${escapeRegex(value)}"`, "g"),
            `testData.${paramKey}`
          );
        }
      });
    }
    selectCode = parameterizedCode;
  }
  if (!selector && step.element?.ref) {
    selector = generateSelectorFromRef(step.element.ref, step.element.humanDescription);
    const values = step.data?.values || [];
    if (values.length === 1) {
      const value = values[0];
      const paramKey = findParameterKey(testData, value);
      const valueToUse = paramKey ? `testData.${paramKey}` : `'${value}'`;
      selectCode = `await ${selector}.selectOption(${valueToUse});`;
    } else if (values.length > 1) {
      const valuesCode = values.map((value) => {
        const paramKey = findParameterKey(testData, value);
        return paramKey ? `testData.${paramKey}` : `'${value}'`;
      }).join(", ");
      selectCode = `await ${selector}.selectOption([${valuesCode}]);`;
    } else {
      selectCode = `await ${selector}.selectOption('');`;
    }
  }
  if (includeAssertions && selector) {
    lines.push(`  await expect(${selector}).toBeVisible({ timeout: 10000 });`);
  }
  if (selectCode) {
    lines.push(`  ${selectCode}`);
  } else {
    const values = step.data?.values || [];
    const valuesStr = values.length > 0 ? values.join(", ") : "option";
    lines.push(`  // TODO: Add proper selector for ${step.element?.humanDescription || "select dropdown"}`);
    lines.push(`  // await page.selectOption('selector-here', '${valuesStr}');`);
  }
  return lines;
}
function generateAPIStep(step, usedVariableNames) {
  const lines = [];
  if (!step.data?.url) {
    lines.push(`  // TODO: Invalid API step - missing URL`);
    return lines;
  }
  const method = (step.data.method || "GET").toLowerCase();
  const url = `'${step.data.url}'`;
  const { responseName, dataName } = generateUniqueApiVariableNames(
    step.data.url,
    step.data.method || "GET",
    usedVariableNames
  );
  lines.push(`  const ${responseName} = await page.request.${method}(${url}, {`);
  if (step.data.body && Object.keys(step.data.body).length > 0) {
    lines.push(`    data: ${JSON.stringify(step.data.body, null, 4).split("\n").join("\n    ")},`);
  }
  if (step.data.headers && Object.keys(step.data.headers).length > 0) {
    lines.push(`    headers: ${JSON.stringify(step.data.headers, null, 4).split("\n").join("\n    ")}`);
  }
  lines.push(`  });`);
  lines.push(``);
  if (step.response) {
    lines.push(`  // Validate API response`);
    lines.push(`  expect(${responseName}.status()).toBe(${step.response.status});`);
    if (step.response.body) {
      lines.push(`  const ${dataName} = await ${responseName}.json();`);
      if (typeof step.response.body === "object") {
        Object.entries(step.response.body).forEach(([key, value]) => {
          if (typeof value === "string") {
            lines.push(`  expect(${dataName}.${key}).toBe('${value}');`);
          } else if (typeof value === "number") {
            lines.push(`  expect(${dataName}.${key}).toBe(${value});`);
          } else if (typeof value === "boolean") {
            lines.push(`  expect(${dataName}.${key}).toBe(${value});`);
          }
        });
      }
    }
  }
  return lines;
}
function isLikelyNavigation(elementDesc) {
  if (!elementDesc) return false;
  const desc = elementDesc.toLowerCase();
  return desc.includes("link") || desc.includes("navigate") || desc.includes("go to") || desc.includes("menu") || desc.includes("tab");
}
function generateUniqueApiVariableNames(url, method, usedVariableNames) {
  const urlParts = url.split("/");
  const endpoint = urlParts.pop() || "api";
  const methodLower = method.toLowerCase();
  let baseName = "";
  if (endpoint.includes("token")) {
    baseName = "token";
  } else if (endpoint.includes("order_status") || endpoint.includes("order-status")) {
    baseName = "orderStatus";
  } else if (endpoint.includes("user")) {
    baseName = "user";
  } else if (endpoint.includes("login")) {
    baseName = "login";
  } else if (endpoint.includes("auth")) {
    baseName = "auth";
  } else {
    baseName = endpoint.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    if (!baseName) baseName = "api";
  }
  let responseName = `${baseName}Response`;
  let dataName = `${baseName}Data`;
  let counter = 1;
  const originalResponseName = responseName;
  const originalDataName = dataName;
  while (usedVariableNames.has(responseName) || usedVariableNames.has(dataName)) {
    counter++;
    responseName = `${originalResponseName}${counter}`;
    dataName = `${originalDataName}${counter}`;
  }
  usedVariableNames.add(responseName);
  usedVariableNames.add(dataName);
  return { responseName, dataName };
}
function generateFormFillStep(step, testData, includeAssertions) {
  const lines = [];
  if (step.playwrightCode) {
    const playwrightLines = step.playwrightCode.split("\n").filter((line) => line.trim());
    playwrightLines.forEach((line) => {
      let processedLine = line.trim();
      Object.entries(testData).forEach(([key, value]) => {
        const valueStr = String(value);
        if (valueStr.length > 2) {
          processedLine = processedLine.replace(
            new RegExp(`'${escapeRegex(valueStr)}'`, "g"),
            `testData.${key}`
          );
          processedLine = processedLine.replace(
            new RegExp(`"${escapeRegex(valueStr)}"`, "g"),
            `testData.${key}`
          );
        }
      });
      if (includeAssertions) {
        const selector = extractSelectorFromPlaywrightCode(processedLine);
        if (selector) {
          lines.push(`  await expect(${selector}).toBeVisible({ timeout: 10000 });`);
        }
      }
      lines.push(`  ${processedLine}`);
    });
    return lines;
  }
  const fields = step.data?.fields || [];
  if (fields.length === 0) {
    lines.push(`  // TODO: No form fields data available`);
    return lines;
  }
  lines.push(`  // Fill form fields`);
  fields.forEach((field, index) => {
    const fieldName = field.name || `field${index + 1}`;
    const fieldRef = field.ref || "";
    const fieldValue = field.value || "";
    let selector = "page.locator('input')";
    if (fieldName.toLowerCase().includes("username") || fieldName.toLowerCase() === "username") {
      selector = "page.getByRole('textbox', { name: /username/i })";
    } else if (fieldName.toLowerCase().includes("password") || fieldName.toLowerCase() === "password") {
      selector = "page.getByRole('textbox', { name: /password/i })";
    } else if (fieldName.toLowerCase().includes("email")) {
      selector = "page.getByRole('textbox', { name: /email/i })";
    } else if (fieldName.toLowerCase().includes("name") && !fieldName.toLowerCase().includes("username")) {
      selector = "page.getByRole('textbox', { name: /name/i })";
    } else if (fieldRef && fieldRef.startsWith("e") && /^\d+$/.test(fieldRef.slice(1))) {
      selector = `page.locator('#${fieldRef}')`;
    }
    const paramKey = findParameterKey(testData, fieldValue);
    const valueToUse = paramKey ? `testData.${paramKey}` : `'${fieldValue}'`;
    if (includeAssertions) {
      lines.push(`  await expect(${selector}).toBeVisible({ timeout: 10000 });`);
    }
    lines.push(`  await ${selector}.fill(${valueToUse});`);
  });
  return lines;
}
function generatePressKeyStep(step) {
  const lines = [];
  if (step.playwrightCode && step.playwrightCode.trim()) {
    lines.push(`  ${step.playwrightCode.trim()}`);
    return lines;
  }
  const key = step.data?.key || "Enter";
  lines.push(`  await page.keyboard.press('${key}');`);
  return lines;
}
function generateVerifyElementVisibleStep(step, includeAssertions) {
  const lines = [];
  if (step.playwrightCode && step.playwrightCode.trim()) {
    lines.push(`  ${step.playwrightCode.trim()}`);
    return lines;
  }
  const elementDesc = step.element?.humanDescription || "";
  let selector = "";
  if (step.element?.playwrightLocator?.type && step.element?.playwrightLocator?.value) {
    const locatorType = step.element.playwrightLocator.type;
    const locatorValue = step.element.playwrightLocator.value;
    const locatorName = step.element.playwrightLocator.name;
    if (locatorType === "role" && locatorName) {
      selector = `page.getByRole('${locatorValue}', { name: '${locatorName}' })`;
    } else if (locatorType === "role") {
      selector = `page.getByRole('${locatorValue}')`;
    } else if (locatorType === "text") {
      selector = `page.getByText('${locatorValue}')`;
    } else if (locatorType === "label") {
      selector = `page.getByLabel('${locatorValue}')`;
    }
  }
  if (!selector) {
    if (elementDesc.toLowerCase().includes("button")) {
      const buttonMatch = elementDesc.match(/(.+?)\s+button/i) || elementDesc.match(/button\s+(.+)/i);
      if (buttonMatch) {
        const buttonText = buttonMatch[1].replace(/"/g, "").trim();
        selector = `page.getByRole('button', { name: '${buttonText}' })`;
      } else {
        selector = `page.getByRole('button')`;
      }
    } else if (elementDesc.toLowerCase().includes("link")) {
      const linkMatch = elementDesc.match(/(.+?)\s+link/i) || elementDesc.match(/link\s+(.+)/i);
      if (linkMatch) {
        const linkText = linkMatch[1].replace(/"/g, "").trim();
        selector = `page.getByRole('link', { name: '${linkText}' })`;
      } else {
        selector = `page.getByRole('link')`;
      }
    } else if (elementDesc.toLowerCase().includes("heading")) {
      const headingMatch = elementDesc.match(/(.+?)\s+heading/i) || elementDesc.match(/heading\s+(.+)/i);
      if (headingMatch) {
        const headingText = headingMatch[1].replace(/"/g, "").trim();
        selector = `page.getByRole('heading', { name: '${headingText}' })`;
      } else {
        selector = `page.getByRole('heading')`;
      }
    } else if (elementDesc.toLowerCase().includes("text") || elementDesc.trim().length > 0) {
      const cleanText = elementDesc.replace(/\s+(text|element)$/i, "").trim();
      if (cleanText) {
        selector = `page.getByText('${cleanText}')`;
      }
    }
    if (!selector) {
      selector = generateSelectorFromRef(step.element?.ref || "", elementDesc);
    }
  }
  if (includeAssertions && selector) {
    lines.push(`  await expect(${selector}).toBeVisible({ timeout: 10000 });`);
  } else if (selector) {
    lines.push(`  await expect(${selector}).toBeVisible({ timeout: 10000 });`);
  } else {
    lines.push(`  // TODO: Add proper selector for element visibility verification`);
  }
  return lines;
}
function generateVerifyTextVisibleStep(step, includeAssertions) {
  const lines = [];
  if (step.playwrightCode && step.playwrightCode.trim()) {
    lines.push(`  ${step.playwrightCode.trim()}`);
    return lines;
  }
  const textToVerify = step.data?.text || step.element?.humanDescription || "";
  if (textToVerify) {
    const escapedText = escapeRegex(textToVerify);
    lines.push(`  await expect(page.getByText('${escapedText}')).toBeVisible({ timeout: 10000 });`);
  } else {
    lines.push(`  // TODO: Add text to verify visibility`);
  }
  return lines;
}
function generateFileUploadStep(step, testData, includeAssertions) {
  const lines = [];
  let selector = 'input[type="file"]';
  if (step.element?.playwrightLocator?.type === "testid" && step.element?.playwrightLocator?.value) {
    selector = `[data-testid="${step.element.playwrightLocator.value}"]`;
  }
  const filePath = step.data?.filePath || "path/to/your/file.txt";
  if (includeAssertions) {
    lines.push(`  await expect(page.locator('${selector}')).toBeVisible({ timeout: 10000 });`);
  }
  lines.push(`  await page.setInputFiles('${selector}', '${filePath}');`);
  return lines;
}

// src/tools/webtools/utils/playwrightUtils/generator.ts
function generatePlaywrightScript(session, testName, includeAssertions, includeWaits) {
  const steps = session.steps || [];
  console.log(`\u{1F50D} DEBUG: Generating script for session with ${steps.length} steps`);
  steps.forEach((step, index) => {
  });
  const testData = extractTestData(steps);
  const usedVariableNames = /* @__PURE__ */ new Set();
  const scriptLines = [];
  scriptLines.push(`import { test, expect } from '@playwright/test';`);
  scriptLines.push(``);
  scriptLines.push(`test('${testName}', async ({ page }) => {`);
  if (Object.keys(testData).length > 0) {
    scriptLines.push(`  // Test data - modify these values as needed`);
    scriptLines.push(`  const testData = {`);
    Object.entries(testData).forEach(([key, value]) => {
      if (typeof value === "string") {
        scriptLines.push(`    ${key}: '${value}',`);
      } else if (typeof value === "number") {
        scriptLines.push(`    ${key}: ${value},`);
      } else {
        scriptLines.push(`    ${key}: '${String(value)}',`);
      }
    });
    scriptLines.push(`  };`);
    scriptLines.push(``);
  }
  let stepCounter = 1;
  steps.forEach((step) => {
    const stepDescription = getCleanStepDescription(step, stepCounter);
    if (stepDescription) {
      scriptLines.push(`  // ${stepDescription}`);
    }
    let stepLines = [];
    switch (step.action) {
      case "navigate":
        stepLines = generateNavigationStep(step, testData, includeWaits);
        break;
      case "click":
        stepLines = generateClickStep(step, includeAssertions, includeWaits);
        break;
      case "type":
        stepLines = generateTypeStep(step, testData, includeAssertions);
        break;
      case "select_option":
        stepLines = generateSelectStep(step, testData, includeAssertions);
        break;
      case "fill_form":
        stepLines = generateFormFillStep(step, testData, includeAssertions);
        break;
      case "press_key":
        stepLines = generatePressKeyStep(step);
        break;
      case "testAPI":
        stepLines = generateAPIStep(step, usedVariableNames);
        break;
      case "verify_element_visible":
        stepLines = generateVerifyElementVisibleStep(step, includeAssertions);
        break;
      case "verify_text_visible":
        stepLines = generateVerifyTextVisibleStep(step, includeAssertions);
        break;
      case "file_upload":
        stepLines = generateFileUploadStep(step, testData, includeAssertions);
        break;
      default:
        stepLines = [`  // TODO: Implement ${step.action} action`];
    }
    scriptLines.push(...stepLines);
    scriptLines.push(``);
    stepCounter++;
  });
  scriptLines.push(`});`);
  return scriptLines.join("\n");
}

// src/tools/webtools/tools/generatePlaywrightScript.ts
var generateScriptSchema = external_exports.object({
  sessionId: external_exports.string().optional().describe("ID of the recorded session (uses latest if not provided)"),
  testName: external_exports.string().optional().describe("Name for the generated test"),
  includeAssertions: external_exports.boolean().default(true).describe("Whether to include comprehensive assertions and validations"),
  includeWaits: external_exports.boolean().default(true).describe("Whether to include reliability wait strategies")
});
function registerGeneratePlaywrightScript(server, playwrightManager) {
  server.registerTool("generatePlaywrightScript", {
    description: "Generate production-ready Playwright TypeScript test script from recorded browser sessions.",
    inputSchema: generateScriptSchema
  }, async (args) => {
    try {
      const recordingManager = playwrightManager.getRecordingManager();
      if (!recordingManager) {
        return {
          content: [{ type: "text", text: "Recording manager not available. Cannot access recorded sessions." }],
          isError: true
        };
      }
      const session = recordingManager.getInMemorySession();
      if (!session) {
        return {
          content: [{ type: "text", text: "No in-memory recording session found. Perform browser actions (navigate, click, type) to record steps first." }],
          isError: true
        };
      }
      if (!session.steps || session.steps.length === 0) {
        return {
          content: [{ type: "text", text: `Session "${session.name}" has no recorded steps to generate from.

Make sure to use browser_navigate and browser_click actions to record steps.` }],
          isError: true
        };
      }
      const testName = args.testName || session.name.replace(/\s+/g, "_").toLowerCase();
      const includeAssertions = args.includeAssertions !== void 0 ? args.includeAssertions : true;
      const includeWaits = args.includeWaits !== void 0 ? args.includeWaits : true;
      const script = generatePlaywrightScript(session, testName, includeAssertions, includeWaits);
      return {
        content: [{ type: "text", text: `\`\`\`typescript
${script}
\`\`\`` }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Failed to generate Playwright script: ${error instanceof Error ? error.message : String(error)}` }],
        isError: true
      };
    }
  });
}

// src/tools/mobiletools/tools/generateTestNGMavenProject.ts
init_zod();

// src/tools/mobiletools/utils/javaGeneratorUtils.ts
function generateTestNgJavaClass(className, body, imports = [], extendsClass) {
  const defaultImports = [
    "org.testng.annotations.Test",
    "org.testng.Assert"
  ];
  const allImports = Array.from(/* @__PURE__ */ new Set([...defaultImports, ...imports]));
  const importLines = allImports.map((i) => `import ${i};`).join("\n");
  const extendsClause = extendsClass ? ` extends ${extendsClass}` : "";
  return `${importLines}

public class ${className}${extendsClause} {
${body}
}`;
}
function testNgMethod(name, body) {
  return `    @Test
    public void ${name}() {
${body}
    }`;
}

// src/tools/mobiletools/utils/mavenGeneratorUtils.ts
function generatePomXml(options2) {
  const appiumJavaVersion = options2?.appiumJavaVersion || "8.6.0";
  const seleniumVersion = options2?.seleniumVersion || "4.13.0";
  const testngVersion = options2?.testngVersion || "7.10.2";
  const jacksonVersion = options2?.jacksonVersion || "2.18.0";
  return `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <groupId>com.example</groupId>
  <artifactId>mobile-automation</artifactId>
  <version>1.0.0</version>
  <packaging>jar</packaging>

  <properties>
    <maven.compiler.source>11</maven.compiler.source>
    <maven.compiler.target>11</maven.compiler.target>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <appium.version>${appiumJavaVersion}</appium.version>
    <selenium.version>${seleniumVersion}</selenium.version>
    <testng.version>${testngVersion}</testng.version>
    <jackson.version>${jacksonVersion}</jackson.version>
  </properties>

  <dependencies>
    <!-- Appium Java Client -->
    <dependency>
      <groupId>io.appium</groupId>
      <artifactId>java-client</artifactId>
      <version>\${appium.version}</version>
    </dependency>

    <!-- Selenium Java -->
    <dependency>
      <groupId>org.seleniumhq.selenium</groupId>
      <artifactId>selenium-java</artifactId>
      <version>\${selenium.version}</version>
    </dependency>

    <!-- TestNG -->
    <dependency>
      <groupId>org.testng</groupId>
      <artifactId>testng</artifactId>
      <version>\${testng.version}</version>
      <scope>test</scope>
    </dependency>

    <!-- Jackson for JSON parsing (config.json) -->
    <dependency>
      <groupId>com.fasterxml.jackson.core</groupId>
      <artifactId>jackson-databind</artifactId>
      <version>\${jackson.version}</version>
    </dependency>

    <!-- SLF4J API for logging -->
    <dependency>
      <groupId>org.slf4j</groupId>
      <artifactId>slf4j-api</artifactId>
      <version>2.0.16</version>
    </dependency>

    <!-- Logback as SLF4J implementation -->
    <dependency>
      <groupId>ch.qos.logback</groupId>
      <artifactId>logback-classic</artifactId>
      <version>1.5.8</version>
    </dependency>
  </dependencies>

  <build>
    <plugins>
      <!-- Maven Compiler Plugin -->
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-compiler-plugin</artifactId>
        <version>3.13.0</version>
        <configuration>
          <source>11</source>
          <target>11</target>
          <encoding>UTF-8</encoding>
        </configuration>
      </plugin>

      <!-- Maven Surefire Plugin for running tests -->
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-surefire-plugin</artifactId>
        <version>3.5.1</version>
        <configuration>
          <suiteXmlFiles>
            <suiteXmlFile>testng.xml</suiteXmlFile>
          </suiteXmlFiles>
          <includes>
            <include>**/*Test.java</include>
            <include>**/*Tests.java</include>
          </includes>
          <testFailureIgnore>false</testFailureIgnore>
        </configuration>
      </plugin>
    </plugins>
  </build>
</project>`;
}
function generateTestngXml(suiteName = "MobileSuite", testName = "MobileTests", packageName = "com.automation.mobile.tests") {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE suite SYSTEM "https://testng.org/testng-1.0.dtd" >
<suite name="${suiteName}" verbose="1">
  <test name="${testName}">
    <packages>
      <package name="${packageName}" />
    </packages>
  </test>
</suite>`;
}

// src/utils/logger.ts
var Logger = class {
  logLevel = 0 /* ERROR */;
  // Default to minimal logging
  setLogLevel(level) {
    this.logLevel = level;
  }
  getLogLevel() {
    return this.logLevel;
  }
  error(...args) {
    if (this.logLevel >= 0 /* ERROR */) {
      console.error(...args);
    }
  }
  warn(...args) {
    if (this.logLevel >= 1 /* WARN */) {
      console.warn(...args);
    }
  }
  info(...args) {
    if (this.logLevel >= 2 /* INFO */) {
      console.log(...args);
    }
  }
  debug(...args) {
    if (this.logLevel >= 3 /* DEBUG */) {
      console.log(...args);
    }
  }
};
var logger = new Logger();
var envLogLevel = process.env.MCP_LOG_LEVEL?.toUpperCase();
if (envLogLevel && logger.getLogLevel() === 0 /* ERROR */) {
  switch (envLogLevel) {
    case "ERROR":
      logger.setLogLevel(0 /* ERROR */);
      break;
    case "WARN":
      logger.setLogLevel(1 /* WARN */);
      break;
    case "INFO":
      logger.setLogLevel(2 /* INFO */);
      break;
    case "DEBUG":
      logger.setLogLevel(3 /* DEBUG */);
      break;
  }
}

// src/tools/mobiletools/utils/locatorStrategyUtils.ts
function generateLocators(node) {
  const strategies = [];
  const hasHint = node.hint;
  const isWebView = (!node.identifier || node.identifier === "") && (hasHint || node.type?.includes("widget"));
  const accessibilityId = node["content-desc"] || node.contentDescription || node.accessibilityLabel || node.label;
  const cleanAccessibilityId = accessibilityId && accessibilityId.trim() ? accessibilityId.trim() : null;
  logger.debug(`\u{1F50D} Analyzing element for locators:`, {
    identifier: node.identifier,
    accessibilityId: cleanAccessibilityId,
    hint: hasHint,
    isWebView,
    "content-desc": node["content-desc"],
    contentDescription: node.contentDescription,
    label: node.label,
    accessibilityLabel: node.accessibilityLabel,
    name: node.name,
    type: node.type,
    bounds: node.bounds
  });
  if (hasHint) {
    strategies.push({
      by: "xpath",
      value: `//*[@hint='${node.hint}']`,
      confidence: 0.92,
      reason: "XPath with hint attribute (WebView input field, very stable)"
    });
    logger.info(`\u2705 PRIORITY 0.5 (WebView): Added hint-based XPath locator: "@hint='${node.hint}'"`);
  }
  if (cleanAccessibilityId) {
    if (isWebView && !hasHint) {
      strategies.push({
        by: "xpath",
        value: `//*[@class='${node.type}' and @hint='${cleanAccessibilityId}']`,
        confidence: 0.9,
        reason: "XPath with hint (WebView element, stable locator)"
      });
      logger.info(`\u2705 PRIORITY 1 (WebView): Added hint-based XPath locator: "@hint='${cleanAccessibilityId}'"`);
    } else if (!isWebView) {
      strategies.push({
        by: "accessibilityId",
        value: cleanAccessibilityId,
        confidence: 0.98,
        reason: "Accessibility ID (cross-platform, accessibility-friendly, most stable)"
      });
      logger.info(`\u2705 PRIORITY 1 (Native): Added accessibility ID locator: "${cleanAccessibilityId}"`);
    }
    if (node.identifier) {
      strategies.push({
        by: "id",
        value: node.identifier,
        confidence: 0.7,
        // Reduced confidence when accessibility ID is available
        reason: "Resource ID (backup to accessibility ID)"
      });
      logger.info(`\u2705 BACKUP: Added resource ID locator: "${node.identifier}" (as backup only)`);
    }
    logger.info(`\u{1F6AB} Skipping XPath strategies - accessibility ID available`);
  } else {
    logger.warn(`\u274C No accessibility ID found - this will reduce cross-platform compatibility`);
    if (node.identifier) {
      strategies.push({
        by: "id",
        value: node.identifier,
        confidence: 0.85,
        reason: "Resource ID (no accessibility ID available)"
      });
      logger.info(`\u2705 PRIORITY 2: Added resource ID locator: "${node.identifier}"`);
    } else {
      logger.warn(`\u274C No resource ID found either`);
    }
    if (!cleanAccessibilityId && !node.identifier) {
      if (node.type && node.name) {
        let xpathValue = "";
        if (node["content-desc"] || node.contentDescription) {
          const contentDesc = node["content-desc"] || node.contentDescription;
          xpathValue = `//*[@content-desc='${contentDesc}']`;
          strategies.push({
            by: "xpath",
            value: xpathValue,
            confidence: 0.75,
            reason: "XPath with content-desc (partial accessibility support)"
          });
        } else {
          xpathValue = `//*[@class='${node.type}' and (@text='${node.name}' or @name='${node.name}')]`;
          strategies.push({
            by: "xpath",
            value: xpathValue,
            confidence: 0.6,
            reason: "XPath with type + text (fallback only)"
          });
        }
        logger.warn(`\u26A0\uFE0F PRIORITY 3: Added XPath locator (fallback): ${xpathValue}`);
      }
      if (node.bounds) {
        const boundsXpath = `//*[@bounds='${node.bounds}']`;
        strategies.push({
          by: "xpath",
          value: boundsXpath,
          confidence: 0.3,
          reason: "Bounds fallback (extremely unstable, last resort only)"
        });
        logger.warn(`\u26A0\uFE0F LAST RESORT: Added bounds XPath locator: ${boundsXpath}`);
      }
    }
  }
  if (cleanAccessibilityId) {
    logger.info(`\u{1F3AF} SUCCESS: Generated ${strategies.length} strategies with ACCESSIBILITY ID as primary choice`);
  } else {
    logger.warn(`\u26A0\uFE0F WARNING: Generated ${strategies.length} strategies WITHOUT accessibility ID - cross-platform compatibility compromised`);
  }
  logger.debug(
    `\u{1F3AF} All strategies:`,
    strategies.map((s) => `${s.by}="${s.value}" (confidence: ${s.confidence})`)
  );
  return strategies;
}
function pickBestLocator(strategies) {
  if (!strategies.length) {
    logger.warn("\u26A0\uFE0F No locator strategies available to pick from");
    return null;
  }
  const accessibilityIdStrategy = strategies.find((s) => s.by === "accessibilityId");
  if (accessibilityIdStrategy) {
    logger.info(`\u{1F3AF} ENFORCED: Selected accessibility ID locator for cross-platform compatibility: "${accessibilityIdStrategy.value}" (confidence: ${accessibilityIdStrategy.confidence})`);
    return accessibilityIdStrategy;
  }
  logger.warn("\u26A0\uFE0F WARNING: No accessibility ID strategy available - falling back to next best option");
  const sorted = strategies.sort((a, b) => b.confidence - a.confidence);
  const best = sorted[0];
  logger.info(`\u2705 Selected fallback locator: ${best.by} (confidence: ${best.confidence}) - ${best.reason}`);
  return best;
}
function validateAccessibilityReadiness(node) {
  const issues = [];
  const recommendations = [];
  const accessibilityId = node["content-desc"] || node.contentDescription || node.accessibilityLabel || node.label;
  if (!accessibilityId || !accessibilityId.trim()) {
    issues.push("No accessibility identifier found");
    recommendations.push("Add content-desc (Android) or accessibilityLabel (iOS) to the element");
  } else {
    const cleanId = accessibilityId.trim();
    if (cleanId.length < 2) {
      issues.push("Accessibility identifier too short");
      recommendations.push('Use descriptive accessibility identifiers (e.g., "Login Button", "Username Input")');
    }
    if (/^\d+$/.test(cleanId)) {
      issues.push("Accessibility identifier is numeric only");
      recommendations.push("Use descriptive text instead of numbers for accessibility identifiers");
    }
  }
  if (!node.identifier) {
    issues.push("No resource ID found");
    recommendations.push("Consider adding resource-id as backup locator strategy");
  }
  const isReady = issues.length === 0 || !!accessibilityId && accessibilityId.trim().length > 1;
  return { isReady, issues, recommendations };
}

// src/tools/mobiletools/utils/projectStructureDetector.ts
var import_promises = __toESM(require("fs/promises"), 1);
var import_path = __toESM(require("path"), 1);
async function isMavenProject(directory) {
  try {
    const pomPath = import_path.default.join(directory, "pom.xml");
    await import_promises.default.access(pomPath);
    return true;
  } catch {
    return false;
  }
}
async function findMavenProjectRoot(startDir) {
  let currentDir = import_path.default.resolve(startDir);
  const root = import_path.default.parse(currentDir).root;
  while (currentDir !== root) {
    if (await isMavenProject(currentDir)) {
      return currentDir;
    }
    currentDir = import_path.default.dirname(currentDir);
  }
  return null;
}
async function parsePomXml(pomXmlPath) {
  try {
    const pomContent = await import_promises.default.readFile(pomXmlPath, "utf8");
    const extractTag = (tag, content) => {
      const regex = new RegExp(`<${tag}>([^<]+)</${tag}>`, "i");
      const match = content.match(regex);
      return match ? match[1].trim() : null;
    };
    const extractDependencies = (content) => {
      const deps = [];
      const depRegex = /<dependency>[\s\S]*?<\/dependency>/gi;
      const matches = content.match(depRegex) || [];
      for (const dep of matches) {
        const groupId = extractTag("groupId", dep);
        const artifactId = extractTag("artifactId", dep);
        if (groupId || artifactId) {
          deps.push({ groupId: groupId || void 0, artifactId: artifactId || void 0 });
        }
      }
      return deps;
    };
    return {
      groupId: extractTag("groupId", pomContent),
      artifactId: extractTag("artifactId", pomContent),
      version: extractTag("version", pomContent),
      sourceDirectory: extractTag("sourceDirectory", pomContent),
      testSourceDirectory: extractTag("testSourceDirectory", pomContent),
      buildDirectory: extractTag("directory", pomContent),
      dependencies: extractDependencies(pomContent)
    };
  } catch (error) {
    logger.error("Failed to parse pom.xml:", error);
    return null;
  }
}
async function detectProjectStructure(projectRoot) {
  const pomXmlPath = import_path.default.join(projectRoot, "pom.xml");
  try {
    const pomData = await parsePomXml(pomXmlPath);
    if (!pomData) {
      return null;
    }
    const groupId = pomData.groupId || "";
    const artifactId = pomData.artifactId || "";
    const version = pomData.version || "";
    const sourceDirectory = pomData.sourceDirectory || "src/main/java";
    const testSourceDirectory = pomData.testSourceDirectory || "src/test/java";
    const resourcesDirectory = "src/main/resources";
    const testResourcesDirectory = "src/test/resources";
    const buildDirectory = pomData.buildDirectory || "target";
    const dependencies = pomData.dependencies || [];
    const hasTestNG = dependencies.some(
      (dep) => dep.artifactId?.toLowerCase().includes("testng")
    );
    const hasJUnit = dependencies.some(
      (dep) => dep.artifactId?.toLowerCase().includes("junit")
    );
    const hasAppium = dependencies.some(
      (dep) => dep.artifactId?.toLowerCase().includes("appium") || dep.groupId?.toLowerCase().includes("appium")
    );
    const testSourcePath = import_path.default.join(projectRoot, testSourceDirectory);
    const packages = await scanPackages(testSourcePath);
    return {
      projectRoot,
      pomXmlPath,
      sourceDirectory: import_path.default.join(projectRoot, sourceDirectory),
      testSourceDirectory: import_path.default.join(projectRoot, testSourceDirectory),
      resourcesDirectory: import_path.default.join(projectRoot, resourcesDirectory),
      testResourcesDirectory: import_path.default.join(projectRoot, testResourcesDirectory),
      packages,
      groupId,
      artifactId,
      version,
      hasTestNG,
      hasJUnit,
      hasAppium,
      buildDirectory: import_path.default.join(projectRoot, buildDirectory)
    };
  } catch (error) {
    logger.error("Failed to detect project structure:", error);
    return null;
  }
}
async function scanPackages(baseDir) {
  const packages = [];
  try {
    await import_promises.default.access(baseDir);
  } catch {
    return packages;
  }
  async function scan(dir, currentPackage = "") {
    try {
      const entries = await import_promises.default.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const newPackage = currentPackage ? `${currentPackage}.${entry.name}` : entry.name;
          const fullPath = import_path.default.join(dir, entry.name);
          const files = await import_promises.default.readdir(fullPath);
          const hasJavaFiles = files.some((f) => f.endsWith(".java"));
          if (hasJavaFiles && !packages.includes(newPackage)) {
            packages.push(newPackage);
          }
          await scan(fullPath, newPackage);
        }
      }
    } catch (error) {
    }
  }
  await scan(baseDir);
  return packages;
}

// src/tools/mobiletools/utils/pageSourceParser.ts
var import_xml2js = __toESM(require_xml2js(), 1);
function parseBounds(boundsStr) {
  const match = boundsStr.match(/\[(\d+),(\d+)\]\[(\d+),(\d+)\]/);
  if (!match) return null;
  return {
    left: parseInt(match[1]),
    top: parseInt(match[2]),
    right: parseInt(match[3]),
    bottom: parseInt(match[4])
  };
}
function isPointInBounds(x, y, bounds) {
  return x >= bounds.left && x <= bounds.right && y >= bounds.top && y <= bounds.bottom;
}
function flattenElements(node, elements = []) {
  if (!node) return elements;
  if (node.$ && node.$.bounds) {
    elements.push(node.$);
  }
  if (node.node && Array.isArray(node.node)) {
    for (const child of node.node) {
      flattenElements(child, elements);
    }
  }
  return elements;
}
async function findElementInPageSource(pageSourceXml, x, y) {
  try {
    const parsed = await (0, import_xml2js.parseStringPromise)(pageSourceXml, {
      explicitArray: true,
      mergeAttrs: false,
      explicitChildren: true,
      preserveChildrenOrder: true,
      charsAsChildren: false
    });
    const hierarchy = parsed.hierarchy;
    if (!hierarchy) {
      console.error("\u26A0\uFE0F No hierarchy found in page source XML");
      return null;
    }
    const allElements = [];
    flattenElements(hierarchy, allElements);
    console.error(`\u{1F4C4} Found ${allElements.length} elements in page source`);
    let matchedElement = null;
    let smallestArea = Infinity;
    for (const element of allElements) {
      const boundsStr = element.bounds;
      if (!boundsStr) continue;
      const bounds = parseBounds(boundsStr);
      if (!bounds) continue;
      if (isPointInBounds(x, y, bounds)) {
        const area = (bounds.right - bounds.left) * (bounds.bottom - bounds.top);
        if (area < smallestArea) {
          smallestArea = area;
          matchedElement = element;
        }
      }
    }
    if (!matchedElement) {
      console.error(`\u26A0\uFE0F No element found at coordinates (${x}, ${y}) in page source`);
      return null;
    }
    const result = {
      class: matchedElement.class || "",
      text: matchedElement.text || "",
      hint: matchedElement.hint || void 0,
      "content-desc": matchedElement["content-desc"] || void 0,
      "resource-id": matchedElement["resource-id"] || void 0,
      bounds: matchedElement.bounds,
      password: matchedElement.password === "true",
      clickable: matchedElement.clickable === "true",
      enabled: matchedElement.enabled === "true",
      focusable: matchedElement.focusable === "true",
      focused: matchedElement.focused === "true",
      "input-type": matchedElement["input-type"] || void 0
    };
    console.error(`\u2705 Found element in page source: class="${result.class}", hint="${result.hint}", password=${result.password}`);
    return result;
  } catch (error) {
    console.error("\u274C Error parsing page source XML:", error);
    return null;
  }
}

// src/tools/mobiletools/tools/generateTestNGMavenProject.ts
var import_promises2 = __toESM(require("fs/promises"), 1);
var import_path2 = __toESM(require("path"), 1);
var projectSchema = external_exports.object({
  projectName: external_exports.string().optional().describe("Name of the project (default: mobile-automation-framework)"),
  packageName: external_exports.string().optional().describe("Java package name (default: com.automation.mobile)"),
  platform: external_exports.enum(["android", "ios", "both"]).default("android").describe("Target platform(s)"),
  outputDir: external_exports.string().optional().describe("Output directory (default: current directory)"),
  cloudProvider: external_exports.enum(["local", "browserstack", "saucelabs", "headspin", "lambdatest"]).optional().describe("Cloud provider for configuration")
});
function pkgToPath(pkg) {
  return pkg.replace(/\./g, import_path2.default.sep);
}
function generateBaseTestClass(packageName) {
  return `package ${packageName}.base;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.ios.IOSDriver;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Optional;
import org.testng.annotations.Parameters;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.File;
import java.net.MalformedURLException;
import java.net.URL;
import java.time.Duration;

/**
 * BaseTest - Base class for all test classes
 * Handles driver initialization, configuration loading, and teardown
 * Uses Appium 8.6.0 with Selenium 4.15.0
 * 
 * IMPORTANT: Driver Lifecycle Management
 * - The 'driver' instance is initialized ONCE per test class in @BeforeClass setUp()
 * - All test methods in the same class share this single driver instance
 * - Page objects MUST be initialized within each @Test method using this driver
 * - This ensures proper driver scope and prevents initialization conflicts
 * 
 * Example Pattern in Test Classes:
 * 
 *   @Test
 *   public void testLogin() {
 *       // Initialize page objects with driver from BaseTest
 *       initializePages();  // Creates page objects using 'this.driver'
 *       
 *       // Perform actions (all use the same driver)
 *       performTestActions();
 *       
 *       // Verify results (assertions use the same driver)
 *       Assert.assertTrue(homePage.isDisplayed());
 *   }
 */
public class BaseTest {
    protected AppiumDriver driver;
    protected JsonNode config;
    protected String platform;
    protected String executionType;

    /**
     * Setup method - Initializes driver before each test class
     * This driver instance is shared by all test methods in the class
     * 
     * Priority order for configuration (highest to lowest):
     * 1. Maven command-line system properties (-DexecutionType=cloud -DcloudProvider=headspin -Dplatform=android)
     * 2. TestNG XML parameters
     * 3. config.json values
     * 4. Default values
     * 
     * Example Maven command:
     * mvn clean test -DexecutionType=cloud -DcloudProvider=headspin -Dplatform=android
     * 
     * @param platformParam Platform to test (android/ios) - can be overridden via TestNG parameter or Maven -Dplatform
     * @param executionTypeParam Execution type (local/cloud) - can be overridden via TestNG parameter or Maven -DexecutionType
     */
    @BeforeClass(alwaysRun = true)
    @Parameters({"platform", "executionType"})
    public void setUp(@Optional("android") String platformParam, @Optional("local") String executionTypeParam) throws Exception {
        // Load configuration
        loadConfiguration();
        
        // Set platform - Priority: Maven system property > TestNG parameter > config.json > default
        this.platform = System.getProperty("platform", 
            platformParam != null ? platformParam : getConfigValue("platform", "android"));
        
        // Set execution type - Priority: Maven system property > TestNG parameter > config.json > default
        this.executionType = System.getProperty("executionType", 
            executionTypeParam != null ? executionTypeParam : getConfigValue("executionType", "local"));
        
        System.out.println("\u{1F4CB} Configuration Source Priority: Maven CLI > TestNG XML > config.json > defaults");
        System.out.println("\u{1F527} Platform: " + this.platform + " (from " + getConfigSource("platform", platformParam) + ")");
        System.out.println("\u{1F527} Execution Type: " + this.executionType + " (from " + getConfigSource("executionType", executionTypeParam) + ")");
        
        // Initialize driver
        driver = createDriver(this.platform, this.executionType);
        
        // Set implicit wait
        int implicitWait = config.has("implicitWait") ? config.get("implicitWait").asInt() : 10;
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(implicitWait));
        
        System.out.println("\u2705 Driver initialized for platform: " + this.platform + ", execution: " + this.executionType);
    }

    /**
     * Teardown method - Quits driver after each test class
     */
    @AfterClass(alwaysRun = true)
    public void tearDown() {
        if (driver != null) {
            driver.quit();
            System.out.println("\u{1F6D1} Driver quit successfully");
        }
    }

    /**
     * Load configuration from config.json
     */
    private void loadConfiguration() throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        File configFile = new File("src/test/resources/config.json");
        
        if (!configFile.exists()) {
            throw new RuntimeException("Configuration file not found: " + configFile.getAbsolutePath());
        }
        
        config = mapper.readTree(configFile);
        System.out.println("\u{1F4C4} Configuration loaded from: " + configFile.getAbsolutePath());
    }

    /**
     * Get configuration value with fallback
     */
    protected String getConfigValue(String key, String defaultValue) {
        if (config.has(key)) {
            return config.get(key).asText();
        }
        return defaultValue;
    }

    /**
     * Helper method to identify the source of a configuration value
     * Used for debugging and logging configuration priority
     */
    private String getConfigSource(String propertyName, String testNgParam) {
        if (System.getProperty(propertyName) != null) {
            return "Maven CLI (-D" + propertyName + ")";
        } else if (testNgParam != null && !"android".equals(testNgParam) && !"local".equals(testNgParam)) {
            return "TestNG XML parameter";
        } else if (config.has(propertyName)) {
            return "config.json";
        } else {
            return "default value";
        }
    }

    /**
     * Create AppiumDriver based on platform and execution type
     * Uses Appium 8.6.0 with DesiredCapabilities
     * Supports local and cloud (Headspin/BrowserStack/SauceLabs) execution
     * 
     * Supports Maven command-line override:
     * mvn clean test -DcloudProvider=headspin -Dplatform=android -DexecutionType=cloud
     */
    private AppiumDriver createDriver(String platform, String executionType) throws MalformedURLException {
        String serverUrl;
        DesiredCapabilities capabilities = new DesiredCapabilities();
        
        // Determine cloud provider - Priority: Maven system property > config.json > default
        String cloudProvider = System.getProperty("cloudProvider", 
            getConfigValue("cloudProvider", "local"));
        
        System.out.println("\u{1F527} Cloud Provider: " + cloudProvider + " (from " + 
            (System.getProperty("cloudProvider") != null ? "Maven CLI (-DcloudProvider)" : "config.json") + ")");
        
        boolean isHeadspin = cloudProvider.equalsIgnoreCase("headspin");
        
        // Create platform-specific driver
        if (platform.equalsIgnoreCase("android")) {
            JsonNode androidConfig = config.has("android") ? config.get("android") : null;
            JsonNode platformConfig = null;
            
            // For Headspin, use headspin-specific config; otherwise use local config
            if (androidConfig != null) {
                if (isHeadspin && androidConfig.has("headspin")) {
                    platformConfig = androidConfig.get("headspin");
                    
                    // For Headspin, set capabilities from config
                    if (platformConfig.has("capabilities")) {
                        JsonNode headspinCaps = platformConfig.get("capabilities");
                        headspinCaps.fields().forEachRemaining(entry -> {
                            String key = entry.getKey();
                            JsonNode valueNode = entry.getValue();
                            
                            if (valueNode.isBoolean()) {
                                capabilities.setCapability(key, valueNode.asBoolean());
                            } else if (valueNode.isNumber()) {
                                capabilities.setCapability(key, valueNode.asInt());
                            } else {
                                capabilities.setCapability(key, valueNode.asText());
                            }
                        });
                    }
                    
                    // Get Headspin WebDriver URL
                    serverUrl = platformConfig.has("webdriverUrl") ? 
                        platformConfig.get("webdriverUrl").asText() : 
                        "http://127.0.0.1:4723";
                    
                    // Replace {TOKEN} placeholder with actual token from config
                    if (config.has("headspin") && config.get("headspin").has("token")) {
                        String token = config.get("headspin").get("token").asText();
                        serverUrl = serverUrl.replace("{TOKEN}", token);
                    }
                } else if (androidConfig.has("local")) {
                    platformConfig = androidConfig.get("local");
                    
                    // Set local Android capabilities
                    capabilities.setCapability("platformName", "Android");
                    capabilities.setCapability("automationName", 
                        platformConfig.has("automationName") ? platformConfig.get("automationName").asText() : "UiAutomator2");
                    capabilities.setCapability("deviceName", 
                        platformConfig.has("deviceName") ? platformConfig.get("deviceName").asText() : "Android Emulator");
                    
                    if (platformConfig.has("platformVersion")) {
                        capabilities.setCapability("platformVersion", platformConfig.get("platformVersion").asText());
                    }
                    if (platformConfig.has("appPackage")) {
                        capabilities.setCapability("appPackage", platformConfig.get("appPackage").asText());
                    }
                    if (platformConfig.has("appActivity")) {
                        capabilities.setCapability("appActivity", platformConfig.get("appActivity").asText());
                    }
                    if (platformConfig.has("app")) {
                        capabilities.setCapability("app", platformConfig.get("app").asText());
                    }
                    if (platformConfig.has("noReset")) {
                        capabilities.setCapability("noReset", platformConfig.get("noReset").asBoolean());
                    }
                    if (platformConfig.has("fullReset")) {
                        capabilities.setCapability("fullReset", platformConfig.get("fullReset").asBoolean());
                    }
                    if (platformConfig.has("newCommandTimeout")) {
                        capabilities.setCapability("newCommandTimeout", platformConfig.get("newCommandTimeout").asInt());
                    }
                    if (platformConfig.has("udid")) {
                        capabilities.setCapability("udid", platformConfig.get("udid").asText());
                    }
                    
                    serverUrl = getLocalServerUrl();
                } else {
                    // Fallback for backward compatibility
                    capabilities.setCapability("platformName", "Android");
                    capabilities.setCapability("automationName", "UiAutomator2");
                    capabilities.setCapability("deviceName", "Android Emulator");
                    serverUrl = getLocalServerUrl();
                }
            } else {
                capabilities.setCapability("platformName", "Android");
                capabilities.setCapability("automationName", "UiAutomator2");
                capabilities.setCapability("deviceName", "Android Emulator");
                serverUrl = getLocalServerUrl();
            }
            
            System.out.println("\u{1F517} Connecting to: " + serverUrl);
            System.out.println("\u{1F4F1} Capabilities: " + capabilities);
            
            return new AndroidDriver(new URL(serverUrl), capabilities);
            
        } else if (platform.equalsIgnoreCase("ios")) {
            JsonNode iosConfig = config.has("ios") ? config.get("ios") : null;
            JsonNode platformConfig = null;
            
            // For Headspin, use headspin-specific config; otherwise use local config
            if (iosConfig != null) {
                if (isHeadspin && iosConfig.has("headspin")) {
                    platformConfig = iosConfig.get("headspin");
                    
                    // For Headspin, set capabilities from config
                    if (platformConfig.has("capabilities")) {
                        JsonNode headspinCaps = platformConfig.get("capabilities");
                        headspinCaps.fields().forEachRemaining(entry -> {
                            String key = entry.getKey();
                            JsonNode valueNode = entry.getValue();
                            
                            if (valueNode.isBoolean()) {
                                capabilities.setCapability(key, valueNode.asBoolean());
                            } else if (valueNode.isNumber()) {
                                capabilities.setCapability(key, valueNode.asInt());
                            } else {
                                capabilities.setCapability(key, valueNode.asText());
                            }
                        });
                    }
                    
                    // Get Headspin WebDriver URL
                    serverUrl = platformConfig.has("webdriverUrl") ? 
                        platformConfig.get("webdriverUrl").asText() : 
                        "http://127.0.0.1:4723";
                    
                    // Replace {TOKEN} placeholder with actual token from config
                    if (config.has("headspin") && config.get("headspin").has("token")) {
                        String token = config.get("headspin").get("token").asText();
                        serverUrl = serverUrl.replace("{TOKEN}", token);
                    }
                } else if (iosConfig.has("local")) {
                    platformConfig = iosConfig.get("local");
                    
                    // Set local iOS capabilities
                    capabilities.setCapability("platformName", "iOS");
                    capabilities.setCapability("automationName", 
                        platformConfig.has("automationName") ? platformConfig.get("automationName").asText() : "XCUITest");
                    capabilities.setCapability("deviceName", 
                        platformConfig.has("deviceName") ? platformConfig.get("deviceName").asText() : "iPhone Simulator");
                    
                    if (platformConfig.has("platformVersion")) {
                        capabilities.setCapability("platformVersion", platformConfig.get("platformVersion").asText());
                    }
                    if (platformConfig.has("bundleId")) {
                        capabilities.setCapability("bundleId", platformConfig.get("bundleId").asText());
                    }
                    if (platformConfig.has("app")) {
                        capabilities.setCapability("app", platformConfig.get("app").asText());
                    }
                    if (platformConfig.has("noReset")) {
                        capabilities.setCapability("noReset", platformConfig.get("noReset").asBoolean());
                    }
                    if (platformConfig.has("fullReset")) {
                        capabilities.setCapability("fullReset", platformConfig.get("fullReset").asBoolean());
                    }
                    if (platformConfig.has("newCommandTimeout")) {
                        capabilities.setCapability("newCommandTimeout", platformConfig.get("newCommandTimeout").asInt());
                    }
                    if (platformConfig.has("udid")) {
                        capabilities.setCapability("udid", platformConfig.get("udid").asText());
                    }
                    if (platformConfig.has("xcodeOrgId")) {
                        capabilities.setCapability("xcodeOrgId", platformConfig.get("xcodeOrgId").asText());
                    }
                    if (platformConfig.has("xcodeSigningId")) {
                        capabilities.setCapability("xcodeSigningId", platformConfig.get("xcodeSigningId").asText());
                    }
                    
                    serverUrl = getLocalServerUrl();
                } else {
                    // Fallback for backward compatibility
                    capabilities.setCapability("platformName", "iOS");
                    capabilities.setCapability("automationName", "XCUITest");
                    capabilities.setCapability("deviceName", "iPhone Simulator");
                    serverUrl = getLocalServerUrl();
                }
            } else {
                capabilities.setCapability("platformName", "iOS");
                capabilities.setCapability("automationName", "XCUITest");
                capabilities.setCapability("deviceName", "iPhone Simulator");
                serverUrl = getLocalServerUrl();
            }
            
            System.out.println("\u{1F517} Connecting to: " + serverUrl);
            System.out.println("\u{1F4F1} Capabilities: " + capabilities);
            
            return new IOSDriver(new URL(serverUrl), capabilities);
        } else {
            throw new RuntimeException("Unsupported platform: " + platform);
        }
    }
    
    /**
     * Get local Appium server URL
     */
    private String getLocalServerUrl() {
        if (config.has("appium") && config.get("appium").has("local")) {
            JsonNode localConfig = config.get("appium").get("local");
            String host = localConfig.has("host") ? localConfig.get("host").asText() : "127.0.0.1";
            String port = localConfig.has("port") ? localConfig.get("port").asText() : "4723";
            return "http://" + host + ":" + port + "/";
        }
        return "http://127.0.0.1:4723/";
    }

    /**
     * Get Appium server URL based on execution type
     */
    private String getServerUrl(String executionType) {
        if (executionType.equalsIgnoreCase("cloud")) {
            String cloudProvider = getConfigValue("cloudProvider", "browserstack");
            
            if (config.has("cloud") && config.get("cloud").has(cloudProvider)) {
                JsonNode cloudConfig = config.get("cloud").get(cloudProvider);
                
                if (cloudConfig.has("url")) {
                    return cloudConfig.get("url").asText();
                }
            }
            
            // Default cloud URLs
            switch (cloudProvider.toLowerCase()) {
                case "browserstack":
                    return "https://hub-cloud.browserstack.com/wd/hub";
                case "saucelabs":
                    return "https://ondemand.saucelabs.com:443/wd/hub";
                case "headspin":
                    return "https://cloud.headspin.io/v0/wd/hub";
                case "lambdatest":
                    return "https://mobile-hub.lambdatest.com/wd/hub";
                default:
                    return "http://127.0.0.1:4723/";
            }
        }
        
        // Local execution
        String host = getConfigValue("appium.host", "127.0.0.1");
        String port = getConfigValue("appium.port", "4723");
        return "http://" + host + ":" + port + "/";
    }

    /**
     * Wait for specified duration
     */
    protected void waitFor(int seconds) {
        try {
            Thread.sleep(seconds * 1000L);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    /**
     * Take screenshot
     */
    protected void takeScreenshot(String fileName) {
        // TODO: Implement screenshot capture
        System.out.println("\u{1F4F8} Screenshot: " + fileName);
    }
}
`;
}
function generateConfigJson(platform, cloudProvider) {
  const config = {
    platform: platform === "both" ? "android" : platform,
    executionType: "local",
    cloudProvider: cloudProvider || "local",
    implicitWait: 10,
    newCommandTimeout: 300,
    noReset: true,
    fullReset: false,
    headspin: {
      token: "240f6bb2a3c54979b2ff0b7f6549067f"
    },
    appium: {
      local: {
        host: "127.0.0.1",
        port: "4723"
      }
    },
    android: {
      local: {
        platformVersion: "16.0",
        deviceName: "Android Emulator",
        automationName: "UiAutomator2",
        app: "path/to/your/app.apk",
        appPackage: "com.example.app",
        appActivity: "com.example.app.MainActivity"
      },
      headspin: {
        webdriverUrl: "https://dev-us-riv-0.headspin.io:7003/v0/{TOKEN}/wd/hub",
        capabilities: {
          automationName: "uiautomator2",
          platformName: "android",
          deviceName: "Pixel 4 XL",
          udid: "9A291FFBA002B8",
          "headspin:app.id": "322042ba-59b5-4e6e-8e33-b834260ef098",
          appPackage: "com.swaglabsmobileapp",
          appActivity: "com.swaglabsmobileapp.SplashActivity",
          "headspin:capture": true
        }
      }
    }
  };
  if (platform === "ios" || platform === "both") {
    config.ios = {
      local: {
        platformVersion: "16.0",
        deviceName: "iPhone 14",
        automationName: "XCUITest",
        app: "path/to/your/app.app",
        bundleId: "com.example.app"
      },
      headspin: {
        webdriverUrl: "https://dev-us-sny-5.headspin.io:7012/v0/{TOKEN}/wd/hub",
        capabilities: {
          automationName: "xcuitest",
          platformVersion: "18.1",
          platformName: "ios",
          deviceName: "iPhone 14",
          udid: "00008110-001444DE113A401E",
          "headspin:app.id": "6914bafa-1369-4757-9c9a-d3eed02f86fb",
          appPackage: "com.saucelabs.SwagLabsMobileApp",
          "headspin:capture": true
        }
      }
    };
  }
  if (cloudProvider && cloudProvider !== "local" && cloudProvider !== "headspin") {
    config.cloud = {
      [cloudProvider]: {
        url: getCloudUrl(cloudProvider),
        username: "YOUR_USERNAME",
        accessKey: "YOUR_ACCESS_KEY"
      }
    };
  }
  return JSON.stringify(config, null, 2);
}
function getCloudUrl(provider) {
  switch (provider) {
    case "browserstack":
      return "https://YOUR_USERNAME:YOUR_ACCESS_KEY@hub-cloud.browserstack.com/wd/hub";
    case "saucelabs":
      return "https://YOUR_USERNAME:YOUR_ACCESS_KEY@ondemand.saucelabs.com:443/wd/hub";
    case "headspin":
      return "https://YOUR_ACCESS_KEY@cloud.headspin.io/v0/wd/hub";
    case "lambdatest":
      return "https://YOUR_USERNAME:YOUR_ACCESS_KEY@mobile-hub.lambdatest.com/wd/hub";
    default:
      return "http://127.0.0.1:4723/";
  }
}
function generateReadme(projectName, packageName, platform) {
  return `# ${projectName}

Mobile Automation Framework using Java + Maven + TestNG + Appium

## Project Structure

\`\`\`
${projectName}/
\u251C\u2500\u2500 src/
\u2502   \u2514\u2500\u2500 test/
\u2502       \u251C\u2500\u2500 java/
\u2502       \u2502   \u2514\u2500\u2500 ${packageName.replace(/\./g, "/")}/
\u2502       \u2502       \u251C\u2500\u2500 base/
\u2502       \u2502       \u2502   \u2514\u2500\u2500 BaseTest.java        \u2190 Driver & config management
\u2502       \u2502       \u251C\u2500\u2500 pages/                   \u2190 Page Objects (generated separately)
\u2502       \u2502       \u251C\u2500\u2500 tests/                   \u2190 Test Classes (generated separately)
\u2502       \u2502       \u2514\u2500\u2500 utils/                   \u2190 Utility classes
\u2502       \u2514\u2500\u2500 resources/
\u2502           \u2514\u2500\u2500 config.json                  \u2190 Test configuration
\u251C\u2500\u2500 pom.xml                                  \u2190 Maven dependencies
\u251C\u2500\u2500 testng.xml                               \u2190 TestNG suite
\u2514\u2500\u2500 README.md
\`\`\`

## Features

\u2705 **Cross-platform support** (${platform === "both" ? "Android & iOS" : platform})  
\u2705 **Page Object Model** pattern  
\u2705 **TestNG** framework with parallel execution  
\u2705 **Maven** dependency management  
\u2705 **Configuration-driven** via config.json  
\u2705 **Cloud execution** support (BrowserStack, SauceLabs, HeadSpin, LambdaTest)  
\u2705 **Base Test class** with driver management  

## Prerequisites

- Java 11 or higher
- Maven 3.6 or higher
- Appium Server 2.x (for local execution)
- Android SDK (for Android testing)
- Xcode (for iOS testing on macOS)

## Setup

### 1. Install Dependencies

\`\`\`bash
mvn clean install
\`\`\`

### 2. Configure Test Environment

Edit \`src/test/resources/config.json\`:

\`\`\`json
{
  "platform": "${platform === "both" ? "android" : platform}",
  "executionType": "local",
  "appium": {
    "host": "localhost",
    "port": "4723"
  }
}
\`\`\`

### 3. Update App Path

- For Android: Update \`android.app\` path in config.json
- For iOS: Update \`ios.app\` path in config.json

## Generating Page Objects and Tests

Use the \`generateMobileAutomationTest\` tool to generate page objects and tests:

\`\`\`typescript
// Example: Generate from recorded session
{
  "useRecording": true,
  "packageName": "${packageName}",
  "outputDir": "${projectName}"
}

// Example: Generate from UI hierarchy
{
  "useMobileMcp": true,
  "steps": ["Login", "Navigate to home"],
  "packageName": "${packageName}",
  "outputDir": "${projectName}"
}
\`\`\`

This will automatically create page objects and test classes that integrate with the BaseTest framework.

## Running Tests

### Run all tests

\`\`\`bash
mvn clean test
\`\`\`

### Run specific test

\`\`\`bash
mvn clean test -Dtest=YourTestClass
\`\`\`

### Run with Maven command-line parameters

The framework supports Maven system properties that override config.json and TestNG XML settings:

**Priority Order (highest to lowest):**
1. Maven command-line properties (\`-D\` flags)
2. TestNG XML parameters
3. config.json values
4. Default values

**Available Maven Parameters:**

\`\`\`bash
# Platform selection
-Dplatform=android          # or ios

# Execution type
-DexecutionType=local       # or cloud

# Cloud provider (when executionType=cloud)
-DcloudProvider=headspin    # or browserstack, saucelabs, lambdatest, local
\`\`\`

**Examples:**

\`\`\`bash
# Run on local Android device
mvn clean test -Dplatform=android -DexecutionType=local

# Run on Headspin cloud
mvn clean test -Dplatform=android -DexecutionType=cloud -DcloudProvider=headspin

# Run on BrowserStack
mvn clean test -DexecutionType=cloud -DcloudProvider=browserstack

# Run specific test on iOS local
mvn clean test -Dtest=LoginTest -Dplatform=ios -DexecutionType=local

# Override all settings for cloud execution
mvn clean test -Dplatform=android -DexecutionType=cloud -DcloudProvider=headspin
\`\`\`

### Run on cloud (BrowserStack example)

\`\`\`bash
mvn clean test -DexecutionType=cloud -DcloudProvider=browserstack
\`\`\`

## TestNG XML Configuration

Run tests via TestNG XML:

\`\`\`bash
mvn clean test -DsuiteXmlFile=testng.xml
\`\`\`

## Configuration Options

### Local Execution

Set \`cloudProvider\` to \`"local"\` in config.json:

\`\`\`json
{
  "platform": "android",
  "executionType": "local",
  "cloudProvider": "local",
  "appium": {
    "local": {
      "host": "localhost",
      "port": "4723"
    }
  },
  "android": {
    "local": {
      "platformVersion": "12.0",
      "deviceName": "Android Emulator",
      "automationName": "UiAutomator2",
      "app": "path/to/your/app.apk",
      "appPackage": "com.example.app",
      "appActivity": "com.example.app.MainActivity"
    }
  }
}
\`\`\`

**Run locally:**
\`\`\`bash
mvn clean test
\`\`\`

### Headspin Cloud Execution

Set \`cloudProvider\` to \`"headspin"\` in config.json and configure your Headspin details:

\`\`\`json
{
  "platform": "android",
  "executionType": "cloud",
  "cloudProvider": "headspin",
  "android": {
    "headspin": {
      "webdriverUrl": "https://dev-us-riv-0.headspin.io:7003/v0/YOUR_TOKEN/wd/hub",
      "capabilities": {
        "automationName": "uiautomator2",
        "platformName": "android",
        "deviceName": "Pixel 4 XL",
        "udid": "9A291FFBA002B8",
        "headspin:app.id": "322042ba-59b5-4e6e-8e33-b834260ef098",
        "appPackage": "com.swaglabsmobileapp",
        "appActivity": "com.swaglabsmobileapp.SplashActivity",
        "headspin:capture": true
      }
    }
  },
  "ios": {
    "headspin": {
      "webdriverUrl": "https://dev-us-sny-5.headspin.io:7012/v0/YOUR_TOKEN/wd/hub",
      "capabilities": {
        "automationName": "xcuitest",
        "platformVersion": "18.1",
        "platformName": "ios",
        "deviceName": "iPhone 14",
        "udid": "00008110-001444DE113A401E",
        "headspin:app.id": "6914bafa-1369-4757-9c9a-d3eed02f86fb",
        "appPackage": "com.saucelabs.SwagLabsMobileApp",
        "headspin:capture": true
      }
    }
  }
}
\`\`\`

**Replace:**
- \`YOUR_TOKEN\` - Your Headspin API token
- \`udid\` - Your device UDID from Headspin dashboard
- \`headspin:app.id\` - Your uploaded app ID from Headspin

**Run on Headspin:**
\`\`\`bash
mvn clean test -DcloudProvider=headspin
\`\`\`

Or edit config.json to set \`"cloudProvider": "headspin"\` permanently.

### Other Cloud Providers

For BrowserStack, SauceLabs, etc., use the traditional cloud configuration:

\`\`\`json
{
  "executionType": "cloud",
  "cloudProvider": "browserstack",
  "appium": {
    "local": {
      "host": "localhost",
      "port": "4723"
  }
}
\`\`\`

### Cloud Execution

\`\`\`json
{
  "executionType": "cloud",
  "cloudProvider": "browserstack",
  "cloud": {
    "browserstack": {
      "url": "https://USERNAME:ACCESS_KEY@hub-cloud.browserstack.com/wd/hub",
      "username": "YOUR_USERNAME",
      "accessKey": "YOUR_ACCESS_KEY"
    }
  }
}
\`\`\`

## Supported Cloud Providers

- **HeadSpin** (full configuration support with webdriverUrl and capabilities)
- BrowserStack
- SauceLabs
- LambdaTest

## Switching Between Local and Headspin

### Quick Switch via Maven Command Line (Recommended)

**This is the easiest and most flexible way to switch configurations without editing files.**

**Local execution:**
\`\`\`bash
mvn clean test -DexecutionType=local -DcloudProvider=local -Dplatform=android
\`\`\`

**Headspin execution:**
\`\`\`bash
mvn clean test -DexecutionType=cloud -DcloudProvider=headspin -Dplatform=android
\`\`\`

**BrowserStack execution:**
\`\`\`bash
mvn clean test -DexecutionType=cloud -DcloudProvider=browserstack -Dplatform=android
\`\`\`

### Permanent Configuration via config.json

If you prefer not to use command-line parameters, edit \`src/test/resources/config.json\` and change the \`cloudProvider\` value:

**For Local:**
\`\`\`json
{
  "cloudProvider": "local",
  "executionType": "local"
}
\`\`\`

**For Headspin:**
\`\`\`json
{
  "cloudProvider": "headspin",
  "executionType": "cloud"
}
\`\`\`

Then run:
\`\`\`bash
mvn clean test
\`\`\`

### Configuration Priority

The framework uses the following priority (highest to lowest):
1. **Maven CLI**: \`-DcloudProvider=headspin -DexecutionType=cloud -Dplatform=android\`
2. **TestNG XML**: Parameters defined in testng.xml
3. **config.json**: Values in src/test/resources/config.json
4. **Defaults**: Built-in default values (android, local)

### Configuration File Structure

Your config.json contains **both** local and Headspin configurations:

\`\`\`json
{
  "cloudProvider": "local",  // Change this to switch environments
  "android": {
    "local": { /* local device config */ },
    "headspin": { /* Headspin device config with webdriverUrl */ }
  }
}
\`\`\`

## Best Practices

1. **Always extend BaseTest** for test classes
2. **Use Page Factory** pattern for element initialization
3. **Add meaningful assertions** in tests
4. **Use explicit waits** when needed
5. **Keep config.json** out of version control (use .gitignore)
6. **Use cross-platform locators** (@AndroidFindBy and @iOSXCUITFindBy)
7. **Generate tests using generateMobileAutomationTest** tool for automation

## Troubleshooting

### Appium Connection Issues

- Ensure Appium server is running: \`appium\`
- Check port availability: \`lsof -i :4723\`

### Driver Initialization Errors

- Verify config.json exists in src/test/resources/
- Check app path is correct
- Ensure device/emulator is running

### Element Not Found

- Use Appium Inspector to verify locators
- Add implicit/explicit waits
- Check if element is in correct context (NATIVE_APP vs WEBVIEW)

## Next Steps

1. Update config.json with your app details
2. Use \`generateMobileAutomationTest\` tool to create page objects and tests
3. Run tests with \`mvn clean test\`

## License

MIT License
`;
}
function generateGitignore() {
  return `# Maven
target/
pom.xml.tag
pom.xml.releaseBackup
pom.xml.versionsBackup
pom.xml.next
release.properties
dependency-reduced-pom.xml
buildNumber.properties
.mvn/timing.properties

# IntelliJ IDEA
.idea/
*.iml
*.iws
*.ipr
out/

# Eclipse
.classpath
.project
.settings/
bin/

# VS Code
.vscode/

# Logs
*.log

# OS
.DS_Store
Thumbs.db

# Test outputs
test-output/
screenshots/
reports/

# Sensitive configuration
src/test/resources/config.json
*-credentials.json
`;
}
function registerGenerateTestNGMavenProject(server) {
  server.registerTool(
    "generateTestNGMavenProject",
    {
      description: "Generate a complete Java Maven TestNG mobile automation framework with folder structure, base classes, configuration, and example tests",
      inputSchema: projectSchema
    },
    async (args) => {
      const projectName = args.projectName || "mobile-automation-framework";
      const packageName = args.packageName || "com.automation.mobile";
      const platform = args.platform || "android";
      const cloudProvider = args.cloudProvider;
      try {
        const baseDir = import_path2.default.resolve(process.cwd(), args.outputDir || projectName);
        const srcDir = import_path2.default.join(baseDir, "src", "test", "java");
        const resourcesDir = import_path2.default.join(baseDir, "src", "test", "resources");
        const pkgPath = import_path2.default.join(srcDir, pkgToPath(packageName));
        const baseDir_path = import_path2.default.join(pkgPath, "base");
        const pagesDir = import_path2.default.join(pkgPath, "pages");
        const testsDir = import_path2.default.join(pkgPath, "tests");
        const utilsDir = import_path2.default.join(pkgPath, "utils");
        await import_promises2.default.mkdir(baseDir, { recursive: true });
        await import_promises2.default.mkdir(baseDir_path, { recursive: true });
        await import_promises2.default.mkdir(pagesDir, { recursive: true });
        await import_promises2.default.mkdir(testsDir, { recursive: true });
        await import_promises2.default.mkdir(utilsDir, { recursive: true });
        await import_promises2.default.mkdir(resourcesDir, { recursive: true });
        logger.info(`\u{1F4C1} Created project structure at: ${baseDir}`);
        const pomXml = generatePomXml();
        await import_promises2.default.writeFile(import_path2.default.join(baseDir, "pom.xml"), pomXml, "utf8");
        logger.info("\u2705 Generated pom.xml");
        const testngXml = generateTestngXml(
          "MobileTestSuite",
          "MobileTests",
          `${packageName}.tests`
        );
        await import_promises2.default.writeFile(import_path2.default.join(baseDir, "testng.xml"), testngXml, "utf8");
        logger.info("\u2705 Generated testng.xml");
        const baseTestClass = generateBaseTestClass(packageName);
        await import_promises2.default.writeFile(import_path2.default.join(baseDir_path, "BaseTest.java"), baseTestClass, "utf8");
        logger.info("\u2705 Generated BaseTest.java");
        const configJson = generateConfigJson(platform, cloudProvider);
        await import_promises2.default.writeFile(import_path2.default.join(resourcesDir, "config.json"), configJson, "utf8");
        logger.info("\u2705 Generated config.json");
        const readme = generateReadme(projectName, packageName, platform);
        await import_promises2.default.writeFile(import_path2.default.join(baseDir, "README.md"), readme, "utf8");
        logger.info("\u2705 Generated README.md");
        const gitignore = generateGitignore();
        await import_promises2.default.writeFile(import_path2.default.join(baseDir, ".gitignore"), gitignore, "utf8");
        logger.info("\u2705 Generated .gitignore");
        await import_promises2.default.writeFile(
          import_path2.default.join(pagesDir, ".gitkeep"),
          "# Page Object classes will be generated here using generateMobileAutomationTest tool\n",
          "utf8"
        );
        await import_promises2.default.writeFile(
          import_path2.default.join(testsDir, ".gitkeep"),
          "# Test classes will be generated here using generateMobileAutomationTest tool\n",
          "utf8"
        );
        await import_promises2.default.writeFile(
          import_path2.default.join(utilsDir, ".gitkeep"),
          "# Utility classes go here\n",
          "utf8"
        );
        const files = [
          "pom.xml",
          "testng.xml",
          "README.md",
          ".gitignore",
          "src/test/java/" + pkgToPath(packageName) + "/base/BaseTest.java",
          "src/test/resources/config.json",
          "src/test/java/" + pkgToPath(packageName) + "/pages/",
          "src/test/java/" + pkgToPath(packageName) + "/tests/",
          "src/test/java/" + pkgToPath(packageName) + "/utils/"
        ];
        const fileList = files.map((f) => `  \u2713 ${f}`).join("\n");
        const nextSteps = `
\u{1F4E6} Framework created successfully!

\u{1F4C2} Location: ${baseDir}

\u{1F4DD} Next Steps:
  1. cd ${projectName}
  2. Update src/test/resources/config.json with your app details
  3. mvn clean install
  4. Use generateMobileAutomationTest tool to create page objects and tests
  5. mvn clean test

\u{1F527} Configuration:
  \u2022 Platform: ${platform}
  \u2022 Package: ${packageName}
  \u2022 Cloud: ${cloudProvider || "Local execution"}

\u{1F4D6} Framework Structure:
  \u2022 BaseTest.java - Driver management and configuration loading
  \u2022 config.json - Environment and capability settings
  \u2022 pages/ - Page objects (generate using generateMobileAutomationTest)
  \u2022 tests/ - Test classes (generate using generateMobileAutomationTest)

\u{1F680} Generate Tests:
   Use the generateMobileAutomationTest tool with:
   - useRecording: true (from recorded session)
   - useMobileMcp: true (from UI hierarchy)
   - steps: [...] (from predefined steps)

\u{1F4D6} See README.md for detailed instructions
`;
        return {
          content: [
            { type: "text", text: "\u2705 Mobile Automation Framework Generated" },
            { type: "text", text: "\nGenerated Files:\n" + fileList },
            { type: "text", text: nextSteps }
          ]
        };
      } catch (error) {
        logger.error("\u274C Failed to generate project:", error);
        return {
          content: [{
            type: "text",
            text: `Failed to generate project: ${error instanceof Error ? error.message : String(error)}`
          }],
          isError: true
        };
      }
    }
  );
}

// src/tools/mobiletools/tools/generateAppiumTest.ts
init_zod();
var import_promises3 = __toESM(require("fs/promises"), 1);
var import_path3 = __toESM(require("path"), 1);
var generateAppiumTestSchema = external_exports.object({
  projectPath: external_exports.string().describe("Path to Maven/TestNG project"),
  testName: external_exports.string().optional().default("RecordedTest").describe("Name for the test"),
  packageName: external_exports.string().optional().default("com.automation.mobile").describe("Java package name"),
  overwritePages: external_exports.boolean().optional().default(false).describe("Overwrite existing page objects"),
  platform: external_exports.enum(["android", "ios", "both"]).optional().default("android").describe("Target platform")
});
function toCamelCase(str) {
  return str.replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase()).replace(/^[A-Z]/, (c) => c.toLowerCase()).replace(/[^a-zA-Z0-9]/g, "");
}
function generateElementName(description, mobileEl) {
  const genericDescriptions = ["clicked element", "tapped element", "element", "view", "clicked", "tapped"];
  const cleanDesc = description.toLowerCase().trim();
  if (mobileEl["resource-id"]) {
    const parts = mobileEl["resource-id"].split(":id/");
    if (parts.length > 1 && parts[1].length > 0) {
      const name = toCamelCase(parts[1]);
      if (name.match(/(Button|Field|Input|Text|Label|Image|Icon|View)$/i)) {
        return name;
      }
      return name + "Element";
    }
  }
  if (mobileEl["text"] && mobileEl["text"].length > 0) {
    const text = mobileEl["text"].toLowerCase().trim();
    const genericTexts = ["ok", "cancel", "yes", "no", "submit", "click", "tap", "button", "text"];
    if (!genericTexts.includes(text) && text.length > 1 && text.length < 30) {
      return toCamelCase(mobileEl["text"]) + "Element";
    }
  }
  if (mobileEl["content-desc"] && mobileEl["content-desc"].length > 0) {
    const contentDesc = mobileEl["content-desc"].toLowerCase().trim();
    if (!genericDescriptions.includes(contentDesc) && contentDesc.length > 2) {
      return toCamelCase(mobileEl["content-desc"]) + "Element";
    }
  }
  if (!genericDescriptions.includes(cleanDesc) && description.length > 3) {
    return toCamelCase(description) + "Element";
  }
  if (mobileEl["class"]) {
    const className = mobileEl["class"].split(".").pop();
    if (className && className.length > 0) {
      return toCamelCase(className) + "Element";
    }
  }
  return "element" + Date.now().toString().slice(-6);
}
function determineElementType(action, mobileEl) {
  const className = mobileEl["class"]?.toLowerCase() || "";
  const text = mobileEl["text"]?.toLowerCase() || "";
  const contentDesc = mobileEl["content-desc"]?.toLowerCase() || "";
  const resourceId = mobileEl["resource-id"]?.toLowerCase() || "";
  const textFieldKeywords = [
    "edittext",
    "textfield",
    "textinput",
    "input",
    "username",
    "password",
    "email",
    "search",
    "text_field",
    "edit_text",
    "input_field",
    "login",
    "signin",
    "name",
    "phone",
    "address"
  ];
  if (className.includes("edittext") || className.includes("textfield") || className.includes("textinput")) {
    return "textField";
  }
  if (className.includes("button") || className.includes("btn")) return "button";
  if (className.includes("textview") || className.includes("label")) return "text";
  if (className.includes("checkbox")) return "checkbox";
  if (className.includes("switch")) return "switch";
  if (className.includes("image")) return "image";
  if (textFieldKeywords.some((keyword) => resourceId.includes(keyword))) {
    return "textField";
  }
  if (textFieldKeywords.some((keyword) => text.includes(keyword) || contentDesc.includes(keyword))) {
    return "textField";
  }
  const actionLower = action.toLowerCase();
  if (actionLower.includes("type") || actionLower.includes("sendkeys") || actionLower.includes("input"))
    return "textField";
  if (actionLower.includes("click") || actionLower.includes("tap"))
    return "button";
  return "element";
}
function extractElementInfo(step, platform) {
  if (!step.element?.mobileElement) return null;
  const mobileEl = step.element.mobileElement;
  let boundsStr;
  if (mobileEl["bounds"]) {
    if (typeof mobileEl["bounds"] === "string") {
      boundsStr = mobileEl["bounds"];
    } else if (typeof mobileEl["bounds"] === "object") {
      const b = mobileEl["bounds"];
      if (b.x !== void 0 && b.y !== void 0 && b.width !== void 0 && b.height !== void 0) {
        boundsStr = `[${b.x},${b.y}][${b.x + b.width},${b.y + b.height}]`;
      } else if (b.left !== void 0 && b.top !== void 0 && b.right !== void 0 && b.bottom !== void 0) {
        boundsStr = `[${b.left},${b.top}][${b.right},${b.bottom}]`;
      } else {
        boundsStr = JSON.stringify(b);
      }
    }
  }
  const viewNode = {
    identifier: mobileEl["resource-id"],
    name: mobileEl["text"],
    type: mobileEl["class"],
    bounds: boundsStr,
    "content-desc": mobileEl["content-desc"],
    contentDescription: mobileEl["content-desc"],
    accessibilityLabel: mobileEl["content-desc"],
    label: mobileEl["content-desc"]
  };
  const strategies = generateLocators(viewNode);
  const bestStrategy = pickBestLocator(strategies);
  if (!bestStrategy) {
    logger.warn(`No valid locator found for element: ${generateElementName(step.element.humanDescription, mobileEl)}, skipping`);
    return null;
  }
  const validation = validateAccessibilityReadiness(viewNode);
  if (!validation.isReady) {
    logger.warn(`\u26A0\uFE0F Element "${generateElementName(step.element.humanDescription, mobileEl)}" not accessibility-ready: ${validation.issues.join(", ")}`);
  }
  return {
    name: generateElementName(step.element.humanDescription, mobileEl),
    description: step.element.humanDescription,
    locatorType: bestStrategy.by,
    locatorValue: bestStrategy.value,
    elementType: determineElementType(step.action, mobileEl),
    confidence: bestStrategy.confidence
  };
}
function escapeJavaString(text) {
  return text.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function sanitizePageName(name) {
  return name.replace(/[^a-zA-Z0-9]/g, "");
}
function isPageTransition(step) {
  const action = step.action.toLowerCase();
  const description = step.element?.humanDescription?.toLowerCase() || "";
  const text = step.element?.mobileElement?.["text"]?.toLowerCase() || "";
  const contentDesc = step.element?.mobileElement?.["content-desc"]?.toLowerCase() || "";
  const allText = `${description} ${text} ${contentDesc}`;
  if (action.includes("navigate") || action.includes("back") || action.includes("app_launch") || action.includes("deep_link")) {
    return true;
  }
  const transitionKeywords = [
    "login",
    "sign in",
    "signin",
    "log in",
    "submit",
    "continue",
    "next",
    "proceed",
    "register",
    "sign up",
    "signup",
    "confirm",
    "accept",
    "agree",
    "done",
    "finish",
    "complete",
    "go to",
    "open",
    "navigate"
  ];
  return transitionKeywords.some((keyword) => allText.includes(keyword));
}
function extractPageName(step, counter) {
  const description = step.element?.humanDescription?.toLowerCase() || "";
  const text = step.element?.mobileElement?.["text"]?.toLowerCase() || "";
  const contentDesc = step.element?.mobileElement?.["content-desc"]?.toLowerCase() || "";
  const allText = `${description} ${text} ${contentDesc}`;
  const pageMapping = [
    { keywords: ["login", "sign in", "signin", "log in"], name: "Login" },
    { keywords: ["home", "main", "dashboard"], name: "Home" },
    { keywords: ["profile", "account", "settings"], name: "Profile" },
    { keywords: ["register", "signup", "sign up"], name: "Registration" },
    { keywords: ["checkout", "payment", "cart"], name: "Checkout" },
    { keywords: ["product", "item", "detail"], name: "Product" },
    { keywords: ["search", "find"], name: "Search" },
    { keywords: ["welcome", "intro", "onboarding"], name: "Welcome" }
  ];
  for (const mapping of pageMapping) {
    if (mapping.keywords.some((keyword) => allText.includes(keyword))) {
      return mapping.name;
    }
  }
  if (text && text.length > 2 && text.length < 20) {
    const cleaned = text.trim();
    if (!["ok", "yes", "no", "cancel", "submit"].includes(cleaned)) {
      return capitalize(toCamelCase(cleaned));
    }
  }
  return `Page${counter}`;
}
function analyzeRecordingAndExtractPages(steps, platform) {
  const pages = /* @__PURE__ */ new Map();
  let currentPageName = "MainPage";
  let pageCounter = 1;
  let currentPage = {
    pageName: currentPageName,
    className: `${currentPageName}Page`,
    elements: /* @__PURE__ */ new Map()
  };
  pages.set(currentPageName, currentPage);
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    if (step.element?.mobileElement) {
      const elementInfo = extractElementInfo(step, platform);
      if (elementInfo) {
        const existingElement = currentPage.elements.get(elementInfo.name);
        if (existingElement) {
          if (i < steps.length - 1) {
            const nextStep = steps[i + 1];
            const nextAction = nextStep.action.toLowerCase();
            const currentAction = step.action.toLowerCase();
            if ((currentAction.includes("click") || currentAction.includes("tap")) && (nextAction.includes("type") || nextAction.includes("sendkeys") || nextAction.includes("input"))) {
              existingElement.elementType = "textField";
            }
          }
        } else {
          currentPage.elements.set(elementInfo.name, elementInfo);
        }
      }
    }
    if (isPageTransition(step)) {
      const oldPageName = currentPageName;
      pageCounter++;
      currentPageName = extractPageName(step, pageCounter);
      logger.info(`\u{1F504} Page transition detected: "${oldPageName}" \u2192 "${currentPageName}"`);
      logger.info(`   Trigger: ${step.action} on "${step.element?.humanDescription}"`);
      logger.info(`   Elements in ${oldPageName}: ${currentPage.elements.size}`);
      if (!pages.has(currentPageName)) {
        currentPage = {
          pageName: currentPageName,
          className: `${currentPageName}Page`,
          elements: /* @__PURE__ */ new Map()
        };
        pages.set(currentPageName, currentPage);
      } else {
        currentPage = pages.get(currentPageName);
      }
    }
  }
  const pagesSummary = Array.from(pages.values()).map((p) => ({
    name: p.pageName,
    elements: p.elements.size,
    elementNames: Array.from(p.elements.keys())
  }));
  logger.info(`
\u{1F4CA} Page Analysis Summary:`);
  logger.info(`   Total Pages: ${pagesSummary.length}`);
  pagesSummary.forEach((p) => {
    logger.info(`   - ${p.name}: ${p.elements} elements`);
    logger.info(`     Elements: ${p.elementNames.join(", ")}`);
  });
  return Array.from(pages.values());
}
function generateActionMethods(pageObj, elements) {
  const methods = [];
  for (const el of elements) {
    if (el.elementType === "button") {
      methods.push(`    /**
     * Clicks on ${el.description}
     */
    public void click${capitalize(el.name)}() {
        wait.until(ExpectedConditions.elementToBeClickable(${el.name}));
        ${el.name}.click();
    }`);
    } else if (el.elementType === "textField") {
      methods.push(`    /**
     * Clicks on ${el.description}
     */
    public void click${capitalize(el.name)}() {
        wait.until(ExpectedConditions.elementToBeClickable(${el.name}));
        ${el.name}.click();
    }
    
    /**
     * Enters text into ${el.description}
     * @param text The text to enter
     */
    public void enter${capitalize(el.name)}(String text) {
        wait.until(ExpectedConditions.visibilityOf(${el.name}));
        ${el.name}.clear();
        ${el.name}.sendKeys(text);
    }`);
    } else if (el.elementType === "text") {
      methods.push(`    /**
     * Gets text from ${el.description}
     * @return The text content
     */
    public String get${capitalize(el.name)}Text() {
        wait.until(ExpectedConditions.visibilityOf(${el.name}));
        return ${el.name}.getText();
    }`);
    } else if (el.elementType === "checkbox" || el.elementType === "switch") {
      methods.push(`    /**
     * Toggles ${el.description}
     */
    public void toggle${capitalize(el.name)}() {
        wait.until(ExpectedConditions.elementToBeClickable(${el.name}));
        ${el.name}.click();
    }
    
    /**
     * Checks if ${el.description} is selected
     * @return true if selected, false otherwise
     */
    public boolean is${capitalize(el.name)}Selected() {
        return ${el.name}.isSelected();
    }`);
    } else {
      methods.push(`    /**
     * Interacts with ${el.description}
     */
    public void click${capitalize(el.name)}() {
        wait.until(ExpectedConditions.elementToBeClickable(${el.name}));
        ${el.name}.click();
    }`);
    }
  }
  return methods.length > 0 ? methods.join("\n\n") : "    // No action methods generated";
}
function generateVerificationMethods(elements) {
  const methods = [];
  methods.push(`    /**
     * Verifies if the page is displayed
     * @return true if page is displayed, false otherwise
     */
    public boolean isDisplayed() {
        try {
            ${elements.length > 0 ? `return ${elements[0].name}.isDisplayed();` : "return true;"}
        } catch (Exception e) {
            return false;
        }
    }`);
  for (const el of elements) {
    if (el.elementType === "text" || el.elementType === "textField") {
      methods.push(`    /**
     * Gets text from ${el.description}
     * @return The text content
     */
    public String get${capitalize(el.name)}Text() {
        wait.until(ExpectedConditions.visibilityOf(${el.name}));
        return ${el.name}.getText();
    }`);
    }
    methods.push(`    /**
     * Checks if ${el.description} is displayed
     * @return true if visible, false otherwise
     */
    public boolean is${capitalize(el.name)}Displayed() {
        try {
            return ${el.name}.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }`);
  }
  return methods.join("\n\n");
}
function generatePageObjectJavaCode(packageName, pageObj) {
  const elements = Array.from(pageObj.elements.values());
  const elementDeclarations = elements.map((el) => {
    let androidFindBy = "";
    let iosFindBy = "";
    switch (el.locatorType) {
      case "accessibilityId":
        androidFindBy = `@AndroidFindBy(accessibility = "${el.locatorValue}")`;
        iosFindBy = `@iOSXCUITFindBy(accessibility = "${el.locatorValue}")`;
        break;
      case "id":
        androidFindBy = `@AndroidFindBy(id = "${el.locatorValue}")`;
        iosFindBy = `@iOSXCUITFindBy(id = "${el.locatorValue}")`;
        break;
      case "xpath":
        androidFindBy = `@AndroidFindBy(xpath = "${el.locatorValue}")`;
        iosFindBy = `@iOSXCUITFindBy(xpath = "${el.locatorValue}")`;
        break;
    }
    return `    ${androidFindBy}
    ${iosFindBy}
    private WebElement ${el.name};`;
  }).join("\n\n");
  const actionMethods = generateActionMethods(pageObj, elements);
  const verificationMethods = generateVerificationMethods(elements);
  return `package ${packageName}.pages;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import io.appium.java_client.pagefactory.AppiumFieldDecorator;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import java.time.Duration;

public class ${pageObj.className} {
    private AppiumDriver driver;
    private WebDriverWait wait;

    // ==================== Page Elements ====================
${elementDeclarations}

    // ==================== Constructor ====================
    public ${pageObj.className}(AppiumDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        PageFactory.initElements(new AppiumFieldDecorator(driver), this);
    }

    // ==================== Action Methods ====================
${actionMethods}

    // ==================== Verification Methods ====================
${verificationMethods}
}`;
}
async function generatePageObjects(projectStructure, packageName, pageObjects, overwritePages) {
  const generatedFiles = [];
  const pagesDir = import_path3.default.join(
    projectStructure.testSourceDirectory,
    packageName.replace(/\./g, import_path3.default.sep),
    "pages"
  );
  await import_promises3.default.mkdir(pagesDir, { recursive: true });
  for (const pageObj of pageObjects) {
    const filePath = import_path3.default.join(pagesDir, `${pageObj.className}.java`);
    if (!overwritePages) {
      try {
        await import_promises3.default.access(filePath);
        console.error(`\u26A0\uFE0F  Skipping ${pageObj.className}.java (already exists)`);
        continue;
      } catch {
      }
    }
    const javaCode = generatePageObjectJavaCode(packageName, pageObj);
    await import_promises3.default.writeFile(filePath, javaCode, "utf8");
    generatedFiles.push(filePath);
  }
  return generatedFiles;
}
function generateTestMethodFromSteps(steps, pageObjects, testName) {
  const testSteps = [];
  const assertions = [];
  let currentPageIndex = 0;
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    if (i > 0 && isPageTransition(steps[i - 1])) {
      currentPageIndex = Math.min(currentPageIndex + 1, pageObjects.length - 1);
      const nextPage = pageObjects[currentPageIndex];
      const nextPageVarName = nextPage.pageName.toLowerCase() + "Page";
      assertions.push(`        Assert.assertTrue(${nextPageVarName}.isDisplayed(), "${nextPage.pageName} page should be displayed");`);
    }
    const currentPage = pageObjects[currentPageIndex];
    const pageVarName = currentPage.pageName.toLowerCase() + "Page";
    const actionName = step.action.toLowerCase();
    if (actionName.includes("click") || actionName.includes("tap")) {
      if (step.element?.mobileElement) {
        const elementName = generateElementName(step.element.humanDescription, step.element.mobileElement);
        const elementInfo = currentPage.elements.get(elementName);
        if (elementInfo) {
          let skipClick = false;
          if (i < steps.length - 1) {
            const nextStep = steps[i + 1];
            const nextAction = nextStep.action.toLowerCase();
            if ((nextAction.includes("type") || nextAction.includes("sendkeys") || nextAction.includes("input")) && nextStep.element?.mobileElement) {
              const nextElementName = generateElementName(nextStep.element.humanDescription, nextStep.element.mobileElement);
              if (nextElementName === elementName) {
                skipClick = true;
              }
            }
          }
          if (!skipClick) {
            testSteps.push(`        ${pageVarName}.click${capitalize(elementInfo.name)}();`);
          }
        }
      }
    } else if (actionName.includes("type") || actionName.includes("sendkeys") || actionName.includes("input")) {
      if (step.data?.text && step.element?.mobileElement) {
        const elementName = generateElementName(step.element.humanDescription, step.element.mobileElement);
        const elementInfo = currentPage.elements.get(elementName);
        if (elementInfo) {
          const escapedText = escapeJavaString(step.data.text);
          testSteps.push(`        ${pageVarName}.enter${capitalize(elementInfo.name)}("${escapedText}");`);
        }
      }
    } else if (actionName.includes("swipe")) {
      testSteps.push(`        // TODO: Implement swipe action`);
    } else if (actionName.includes("scroll")) {
      testSteps.push(`        // TODO: Implement scroll action`);
    }
  }
  return { name: `test${sanitizePageName(testName)}`, steps: testSteps, assertions };
}
function generateTestClassJavaCode(packageName, className, testMethod, pageObjects) {
  const pageImports = pageObjects.map(
    (po) => `${packageName}.pages.${po.className}`
  );
  const pageDeclarations = pageObjects.map((po) => {
    const varName = po.pageName.toLowerCase() + "Page";
    return `    private ${po.className} ${varName};`;
  }).join("\n");
  const pageInitializations = pageObjects.map((po) => {
    const varName = po.pageName.toLowerCase() + "Page";
    return `        ${varName} = new ${po.className}(driver);`;
  }).join("\n");
  const testMethodBody = `        // Initialize page objects using driver from BaseTest
        initializePages();
        
        // Execute test steps (dynamically generated from recording)
${testMethod.steps.join("\n")}
        
        // Verify results (dynamically generated assertions)
${testMethod.assertions.length > 0 ? testMethod.assertions.join("\n") : "        // Add assertions as needed"}`;
  const classBody = `    
    // ==================== Page Objects ====================
${pageDeclarations}

    // ==================== Setup ====================
    /**
     * Initializes all page objects with the driver from BaseTest
     * Must be called at the start of each test method
     */
    private void initializePages() {
${pageInitializations}
    }

    // ==================== Test Methods ====================
${testNgMethod(testMethod.name, testMethodBody)}`;
  const allImports = [
    `${packageName}.base.BaseTest`,
    ...pageImports
  ];
  const javaClass = generateTestNgJavaClass(className, classBody, allImports, "BaseTest");
  return `package ${packageName}.tests;

${javaClass}`;
}
async function generateTestClass(projectStructure, packageName, testName, testMethod, pageObjects) {
  const testsDir = import_path3.default.join(
    projectStructure.testSourceDirectory,
    packageName.replace(/\./g, import_path3.default.sep),
    "tests"
  );
  await import_promises3.default.mkdir(testsDir, { recursive: true });
  const className = `${sanitizePageName(testName)}Test`;
  const filePath = import_path3.default.join(testsDir, `${className}.java`);
  const javaCode = generateTestClassJavaCode(packageName, className, testMethod, pageObjects);
  await import_promises3.default.writeFile(filePath, javaCode, "utf8");
  return filePath;
}
function generateLocalAppiumConfig() {
  return {
    implicitWait: 10,
    newCommandTimeout: 300,
    noReset: true,
    fullReset: false,
    appium: {
      local: {
        host: "127.0.0.1",
        port: "4723",
        url: "http://127.0.0.1:4723/"
      }
    }
  };
}
function generateAndroidCapabilities() {
  return {
    local: {
      platformVersion: "16.0",
      deviceName: "Android Emulator",
      automationName: "UiAutomator2",
      app: "path/to/your/app.apk",
      appPackage: "com.example.app",
      appActivity: "com.example.app.MainActivity"
    },
    headspin: {
      webdriverUrl: "https://dev-us-riv-0.headspin.io:7003/v0/{TOKEN}/wd/hub",
      capabilities: {
        automationName: "uiautomator2",
        platformName: "android",
        deviceName: "Pixel 4 XL",
        udid: "DEVICE_UDID",
        "headspin:app.id": "APP_ID",
        appPackage: "com.example.app",
        appActivity: "com.example.app.MainActivity",
        "headspin:capture": true
      }
    }
  };
}
function generateIOSCapabilities() {
  return {
    local: {
      platformVersion: "17.0",
      deviceName: "iPhone 15",
      automationName: "XCUITest",
      app: "path/to/your/app.app",
      bundleId: "com.example.app"
    },
    headspin: {
      webdriverUrl: "https://dev-us-riv-0.headspin.io:7003/v0/{TOKEN}/wd/hub",
      capabilities: {
        automationName: "XCUITest",
        platformName: "iOS",
        deviceName: "iPhone 15 Pro",
        udid: "DEVICE_UDID",
        "headspin:app.id": "APP_ID",
        bundleId: "com.example.app",
        "headspin:capture": true
      }
    }
  };
}
async function generateConfigFile(projectRoot, platform) {
  const resourcesDir = import_path3.default.join(projectRoot, "src", "test", "resources");
  await import_promises3.default.mkdir(resourcesDir, { recursive: true });
  const configPath = import_path3.default.join(resourcesDir, "config.json");
  const config = {
    platform: platform === "both" ? "android" : platform,
    executionType: "local",
    cloudProvider: "local",
    // Add Appium server config
    ...generateLocalAppiumConfig(),
    // Add platform-specific capabilities
    ...platform === "android" || platform === "both" ? { android: generateAndroidCapabilities() } : {},
    ...platform === "ios" || platform === "both" ? { ios: generateIOSCapabilities() } : {}
  };
  await import_promises3.default.writeFile(configPath, JSON.stringify(config, null, 2), "utf8");
  return configPath;
}
async function handleGenerateAppiumTest(args, appiumManager) {
  const { projectPath, testName, packageName, overwritePages, platform } = args;
  try {
    const recordingManager = appiumManager?.getRecordingManager();
    if (!recordingManager) {
      return {
        content: [{
          type: "text",
          text: "\u274C Recording manager not available. Cannot access recorded mobile sessions."
        }],
        isError: true
      };
    }
    const session = recordingManager.getInMemorySession();
    if (!session || !session.steps || session.steps.length === 0) {
      return {
        content: [{
          type: "text",
          text: "\u274C No recorded steps found.\n\n\u{1F4A1} Use mobile actions (mobile_tap, mobile_type, etc.) to record test steps first."
        }],
        isError: true
      };
    }
    console.error(`
\u{1F4CA} Recording session found: ${session.steps.length} steps recorded`);
    const projectRoot = await findMavenProjectRoot(projectPath);
    if (!projectRoot) {
      return {
        content: [{
          type: "text",
          text: `\u274C No Maven project found at: ${projectPath}

\u{1F4A1} Create one using generateTestNGMavenProject tool first.`
        }],
        isError: true
      };
    }
    const projectStructure = await detectProjectStructure(projectRoot);
    if (!projectStructure) {
      return {
        content: [{
          type: "text",
          text: `\u274C Failed to detect project structure at: ${projectRoot}`
        }],
        isError: true
      };
    }
    console.error(`\u2705 Maven project detected at: ${projectRoot}`);
    const pageObjects = analyzeRecordingAndExtractPages(session.steps, platform);
    console.error(`\u2705 Analyzed recording: ${pageObjects.length} pages identified`);
    const pageFiles = await generatePageObjects(projectStructure, packageName, pageObjects, overwritePages);
    console.error(`\u2705 Generated ${pageFiles.length} page object files`);
    const testMethod = generateTestMethodFromSteps(session.steps, pageObjects, testName);
    const testFile = await generateTestClass(projectStructure, packageName, testName, testMethod, pageObjects);
    console.error(`\u2705 Generated test class: ${import_path3.default.basename(testFile)}`);
    const configFile = await generateConfigFile(projectRoot, platform);
    console.error(`\u2705 Generated configuration: config.json`);
    const stepsBeforeClear = session.steps.length;
    logger.info("\u{1F5D1}\uFE0F  Clearing recording session after test generation");
    console.error(`\u{1F5D1}\uFE0F  Clearing recording session (had ${stepsBeforeClear} steps)`);
    recordingManager.clearInMemorySession();
    const newSession = recordingManager.getInMemorySession();
    console.error(`\u2705 Recording session cleared and reset for next recording (current steps: ${newSession?.steps.length || 0})`);
    const pageFileNames = pageFiles.map((f) => `   \u2022 ${import_path3.default.basename(f)}`).join("\n");
    return {
      content: [{
        type: "text",
        text: `\u2705 **Appium Test Generation Complete**

\u{1F4CA} **Summary:**
   \u2022 Test Name: ${testName}
   \u2022 Recorded Steps: ${stepsBeforeClear}
   \u2022 Pages Generated: ${pageObjects.length}
   \u2022 Platform: ${platform === "both" ? "Android & iOS (cross-platform)" : capitalize(platform)}

\u{1F4C4} **Generated Files:**

**Page Objects:**
${pageFileNames}

**Test Class:**
   \u2022 ${import_path3.default.basename(testFile)}

**Configuration:**
   \u2022 config.json

\u{1F3AF} **Next Steps:**
1. Update config.json with your actual app details:
   - Set correct app path (APK/IPA)
   - Set appPackage and appActivity (Android)
   - Set bundleId (iOS)

2. Run the test:
   mvn clean test -Dtest=${sanitizePageName(testName)}Test

3. For cloud execution (Headspin):
   mvn clean test -DexecutionType=cloud -DcloudProvider=headspin

\u{1F5D1}\uFE0F **Recording memory has been cleared and is ready for new recordings.**

\u{1F4A1} **Tips:**
   - Page objects use Page Factory pattern with @FindBy annotations
   - Tests extend BaseTest which handles driver lifecycle
   - Locators prioritized: **accessibilityId > id > xpath** (cross-platform first)
   - All tests work cross-platform (Android & iOS)
   - Uses locatorStrategyUtils for intelligent locator selection
`
      }]
    };
  } catch (error) {
    logger.error("Failed to generate Appium test:", error);
    return {
      content: [{
        type: "text",
        text: `\u274C Failed to generate Appium test: ${error.message}

${error.stack}`
      }],
      isError: true
    };
  }
}
function registerGenerateAppiumTest(server, appiumManager) {
  server.registerTool("generateAppiumTest", {
    description: "Generate Java Appium automation scripts with Page Object Model from recorded mobile app sessions. Creates page objects only for accessed pages and generates TestNG test classes.",
    inputSchema: generateAppiumTestSchema
  }, async (args) => {
    return await handleGenerateAppiumTest(args, appiumManager);
  });
}

// src/tools/other/tools/clearRecording.ts
init_zod();
var clearRecordingSchema = external_exports.object({
  confirmClear: external_exports.boolean().optional().default(true).describe("Confirm clearing the recording session (default: true)")
});
function registerClearRecording(server, playwrightManager, appiumManager) {
  server.registerTool("clearRecording", {
    description: "Clear all recorded steps from the current in-memory recording session. Use this to start fresh recording or after generating test scripts.",
    inputSchema: clearRecordingSchema
  }, async (args) => {
    try {
      const confirmClear = args.confirmClear !== void 0 ? args.confirmClear : true;
      if (!confirmClear) {
        return {
          content: [{
            type: "text",
            text: "\u274C Clear operation cancelled. Set confirmClear: true to proceed."
          }],
          isError: false
        };
      }
      const playwrightRecordingManager = playwrightManager?.getRecordingManager();
      const appiumRecordingManager = appiumManager?.getRecordingManager();
      let stepsBeforeClear = 0;
      let sessionName = "Unknown";
      if (playwrightRecordingManager) {
        const session = playwrightRecordingManager.getInMemorySession();
        if (session) {
          stepsBeforeClear = session.steps.length;
          sessionName = session.name;
        }
      } else if (appiumRecordingManager) {
        const session = appiumRecordingManager.getInMemorySession();
        if (session) {
          stepsBeforeClear = session.steps.length;
          sessionName = session.name;
        }
      }
      if (playwrightRecordingManager) {
        playwrightRecordingManager.clearInMemorySession();
      }
      if (appiumRecordingManager && appiumRecordingManager !== playwrightRecordingManager) {
        appiumRecordingManager.clearInMemorySession();
      }
      let newSession = null;
      if (playwrightRecordingManager) {
        newSession = playwrightRecordingManager.getInMemorySession();
      } else if (appiumRecordingManager) {
        newSession = appiumRecordingManager.getInMemorySession();
      }
      const newStepCount = newSession?.steps.length || 0;
      const newSessionName = newSession?.name || "Unknown";
      return {
        content: [{
          type: "text",
          text: `\u2705 Recording session cleared successfully!

\u{1F4CA} Summary:
- Previous session: "${sessionName}"
- Steps cleared: ${stepsBeforeClear}
- New session: "${newSessionName}"
- Current steps: ${newStepCount}

\u{1F3AC} Ready to record new test actions!`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `\u274C Failed to clear recording: ${error instanceof Error ? error.message : String(error)}`
        }],
        isError: true
      };
    }
  });
}

// src/tools/other/tools/generateTestReport.ts
init_zod();
var fs4 = __toESM(require("fs"), 1);
var path4 = __toESM(require("path"), 1);
function registerGenerateTestReport(server, playwrightManager, appiumManager, recordingManager) {
  server.registerTool(
    "generateTestReport",
    {
      title: "Generate Test Report",
      description: "Generates a comprehensive HTML test report for the executed test scenario with summary statistics and detailed step information. Can auto-generate from recorded test execution or accept manual step data.",
      inputSchema: {
        scenarioName: external_exports.string().optional().describe("Name of the test scenario (auto-generated if not provided)"),
        useRecordedData: external_exports.boolean().optional().describe("Use data from RecordingManager (default: false). Set to true to auto-generate report from recorded test execution."),
        workspacePath: external_exports.string().optional().describe("Workspace path where report folder should be created (defaults to current working directory)"),
        applicationName: external_exports.string().optional().describe("Name of the application being tested (auto-detected if using recorded data)"),
        baseUrl: external_exports.string().optional().describe("Base URL of the application (auto-detected if using recorded data)"),
        loginCredentials: external_exports.object({
          username: external_exports.string().optional(),
          password: external_exports.string().optional()
        }).optional().describe("Login credentials used in testing (auto-detected if using recorded data)"),
        browser: external_exports.string().optional().describe("Browser used for testing (e.g., chromium, firefox, webkit) (auto-detected if using recorded data)"),
        platform: external_exports.string().optional().describe("Platform used for testing (e.g., Android, iOS, Web) (auto-detected if using recorded data)"),
        device: external_exports.string().optional().describe("Device identifier for mobile testing (auto-detected if using recorded data)"),
        steps: external_exports.array(external_exports.object({
          step: external_exports.number().optional(),
          stepNumber: external_exports.number().optional(),
          command: external_exports.string(),
          mcpTool: external_exports.string().optional().describe("MCP tool name used to execute this step"),
          testData: external_exports.string().optional(),
          timeTaken: external_exports.union([external_exports.number(), external_exports.string()]).optional().describe("Time taken (number in milliseconds or string like '950ms', '1.2s'). Defaults to 0 if not provided."),
          status: external_exports.enum(["passed", "failed", "missed"]),
          errorMessage: external_exports.string().optional()
        })).optional().describe("Array of test steps executed (optional if useRecordedData is true)")
      }
    },
    async (input) => {
      try {
        let steps;
        let metadata;
        let summary;
        if (input.useRecordedData && recordingManager) {
          const reportData = recordingManager.getReportData();
          steps = reportData.steps.map((step, index) => ({
            stepNumber: step.stepNumber || index + 1,
            command: generateCommandDescription(step),
            testData: generateTestDataString(step),
            timeTaken: step.executionTimeMs || 0,
            status: step.status || "passed",
            errorMessage: step.error?.message
          }));
          metadata = {
            scenarioName: input.scenarioName || reportData.metadata.scenarioName || "Test Execution Report",
            applicationName: input.applicationName || reportData.metadata.applicationName,
            baseUrl: input.baseUrl || reportData.metadata.baseUrl,
            loginCredentials: input.loginCredentials || reportData.metadata.loginCredentials,
            browser: input.browser || reportData.metadata.browser,
            platform: input.platform || reportData.metadata.platform,
            device: input.device || reportData.metadata.device
          };
          summary = {
            totalSteps: reportData.summary.totalSteps,
            passedSteps: reportData.summary.passedSteps,
            failedSteps: reportData.summary.failedSteps,
            missedSteps: reportData.summary.missedSteps,
            totalTimeTaken: reportData.summary.totalTimeMs
          };
        } else {
          const stepsInput = input.steps;
          if (!stepsInput) {
            throw new Error("steps parameter is required when useRecordedData is false");
          }
          steps = typeof stepsInput === "string" ? JSON.parse(stepsInput) : stepsInput;
          steps = typeof stepsInput === "string" ? JSON.parse(stepsInput) : stepsInput;
          summary = {
            totalSteps: steps.length,
            passedSteps: steps.filter((s) => s.status === "passed").length,
            failedSteps: steps.filter((s) => s.status === "failed").length,
            missedSteps: steps.filter((s) => s.status === "missed").length,
            totalTimeTaken: steps.reduce((acc, step) => acc + parseTimeToMilliseconds(step.timeTaken), 0)
          };
          metadata = {
            scenarioName: input.scenarioName || generateScenarioName(steps, input.applicationName, input.baseUrl),
            applicationName: input.applicationName,
            baseUrl: input.baseUrl,
            loginCredentials: input.loginCredentials,
            browser: input.browser,
            platform: input.platform,
            device: input.device
          };
        }
        const scenarioName = metadata.scenarioName || generateScenarioName(steps, metadata.applicationName, metadata.baseUrl);
        const htmlContent = generateHTMLReport(metadata, summary, steps);
        const rootDir = input.workspacePath || process.cwd();
        const reportsDir = path4.join(rootDir, "tested_scenario_reports");
        if (!fs4.existsSync(reportsDir)) {
          fs4.mkdirSync(reportsDir, { recursive: true });
        }
        const timestamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-").replace("T", "_").split(".")[0];
        const sanitizedScenarioName = scenarioName.replace(/[^a-zA-Z0-9-_]/g, "_");
        const filename = `${sanitizedScenarioName}_${timestamp}.html`;
        const filepath = path4.join(reportsDir, filename);
        fs4.writeFileSync(filepath, htmlContent, "utf-8");
        const passRate = summary.totalSteps > 0 ? (summary.passedSteps / summary.totalSteps * 100).toFixed(2) : "0.00";
        return {
          content: [
            {
              type: "text",
              text: `\u2705 Test Report Generated Successfully!

\u{1F4CA} Summary:
   \u2022 Scenario: ${scenarioName}
   \u2022 Total Steps: ${summary.totalSteps}
   \u2022 Passed: ${summary.passedSteps} \u2713
   \u2022 Failed: ${summary.failedSteps} \u2717
   \u2022 Missed: ${summary.missedSteps} \u2298
   \u2022 Pass Rate: ${passRate}%
   \u2022 Total Time: ${formatTime(summary.totalTimeTaken)}

\u{1F4C1} Report Location: ${filepath}

Open the HTML file in your browser to view the detailed report.`
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `\u274C Error generating test report: ${error.message}

Stack trace: ${error.stack}`
            }
          ],
          isError: true
        };
      }
    }
  );
}
function generateHTMLReport(metadata, summary, steps) {
  let template = getHTMLTemplate();
  const timestamp = (/* @__PURE__ */ new Date()).toLocaleString();
  const passRate = summary.totalSteps > 0 ? (summary.passedSteps / summary.totalSteps * 100).toFixed(2) : "0.00";
  template = template.replaceAll("{{SCENARIO_NAME}}", escapeHtml(metadata.scenarioName));
  template = template.replace("{{TIMESTAMP}}", escapeHtml(timestamp));
  template = template.replace("{{APPLICATION_NAME}}", escapeHtml(metadata.applicationName || "N/A"));
  template = template.replace("{{BASE_URL}}", escapeHtml(metadata.baseUrl || "N/A"));
  template = template.replace("{{LOGIN_USERNAME}}", escapeHtml(metadata.loginCredentials?.username || "N/A"));
  template = template.replace("{{LOGIN_PASSWORD}}", metadata.loginCredentials?.password ? "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" : "N/A");
  template = template.replace("{{BROWSER}}", escapeHtml(metadata.browser || metadata.platform || "N/A"));
  template = template.replace("{{DEVICE}}", escapeHtml(metadata.device || "N/A"));
  template = template.replace("{{TOTAL_STEPS}}", summary.totalSteps.toString());
  template = template.replace("{{PASSED_STEPS}}", summary.passedSteps.toString());
  template = template.replace("{{FAILED_STEPS}}", summary.failedSteps.toString());
  template = template.replace("{{MISSED_STEPS}}", summary.missedSteps.toString());
  template = template.replace("{{TOTAL_TIME}}", formatTime(summary.totalTimeTaken));
  template = template.replace("{{PASS_RATE}}", passRate);
  const stepsHtml = steps.map((step) => {
    const statusClass = step.status === "passed" ? "status-passed" : step.status === "failed" ? "status-failed" : "status-missed";
    const statusIcon = step.status === "passed" ? "\u2713" : step.status === "failed" ? "\u2717" : "\u2298";
    const stepNum = step.step || step.stepNumber || 0;
    return `
      <tr class="${statusClass}">
        <td>${stepNum}</td>
        <td><span class="status-badge ${statusClass}">${statusIcon} ${step.status.toUpperCase()}</span></td>
        <td><code>${escapeHtml(step.command)}</code></td>
        <td>${escapeHtml(step.mcpTool || "N/A")}</td>
        <td>${escapeHtml(step.testData || "N/A")}</td>
        <td>${formatTime(step.timeTaken)}</td>
        <td>${step.errorMessage ? `<span class="error-message">${escapeHtml(step.errorMessage)}</span>` : "-"}</td>
      </tr>
    `;
  }).join("");
  template = template.replace("{{STEPS_TABLE_ROWS}}", stepsHtml);
  return template;
}
function generateScenarioName(steps, applicationName, baseUrl) {
  if (steps.length === 0) {
    return "Test Scenario Report";
  }
  let appName = "";
  if (applicationName) {
    appName = applicationName;
  } else if (baseUrl) {
    try {
      const url = new URL(baseUrl);
      const hostname = url.hostname.replace("www.", "");
      appName = hostname.split(".")[0];
      appName = appName.charAt(0).toUpperCase() + appName.slice(1);
    } catch {
      appName = baseUrl;
    }
  }
  const commandsText = steps.map((s) => s.command?.toLowerCase() || "").join(" ");
  const scenarioPatterns = [
    { keywords: ["login", "sign in", "authenticate"], name: "Login Test" },
    { keywords: ["logout", "sign out"], name: "Logout Test" },
    { keywords: ["register", "sign up", "create account"], name: "Registration Test" },
    { keywords: ["search", "find"], name: "Search Functionality Test" },
    { keywords: ["add to cart", "purchase", "checkout", "buy"], name: "Purchase Flow Test" },
    { keywords: ["upload", "attach"], name: "File Upload Test" },
    { keywords: ["download"], name: "Download Test" },
    { keywords: ["form", "submit", "fill"], name: "Form Submission Test" },
    { keywords: ["navigate", "click", "verify"], name: "Navigation Test" },
    { keywords: ["edit", "update", "modify"], name: "Edit Functionality Test" },
    { keywords: ["delete", "remove"], name: "Delete Functionality Test" },
    { keywords: ["create", "add"], name: "Create Functionality Test" },
    { keywords: ["filter", "sort"], name: "Filter/Sort Test" },
    { keywords: ["pagination", "page"], name: "Pagination Test" },
    { keywords: ["responsive", "resize"], name: "Responsive Design Test" },
    { keywords: ["api", "request", "response"], name: "API Test" }
  ];
  let scenarioType = "Functional Test";
  for (const pattern of scenarioPatterns) {
    if (pattern.keywords.some((keyword) => commandsText.includes(keyword))) {
      scenarioType = pattern.name;
      break;
    }
  }
  if (appName) {
    return `${appName} - ${scenarioType}`;
  } else {
    return scenarioType;
  }
}
function getHTMLTemplate() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Report - {{SCENARIO_NAME}}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            min-height: 100vh;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }

        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
        }

        .header .timestamp {
            font-size: 1.1em;
            opacity: 0.9;
            margin-top: 10px;
        }

        .metadata-section {
            padding: 30px 40px;
            background: #f8f9fa;
            border-bottom: 2px solid #e9ecef;
        }

        .metadata-section h2 {
            color: #495057;
            margin-bottom: 20px;
            font-size: 1.8em;
            border-left: 4px solid #667eea;
            padding-left: 15px;
        }

        .metadata-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }

        .metadata-item {
            background: white;
            padding: 15px 20px;
            border-radius: 8px;
            border-left: 4px solid #667eea;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .metadata-item label {
            display: block;
            font-weight: 600;
            color: #6c757d;
            font-size: 0.85em;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
        }

        .metadata-item .value {
            color: #212529;
            font-size: 1.1em;
            word-break: break-word;
        }

        .summary-section {
            padding: 30px 40px;
            background: white;
        }

        .summary-section h2 {
            color: #495057;
            margin-bottom: 25px;
            font-size: 1.8em;
            border-left: 4px solid #28a745;
            padding-left: 15px;
        }

        .summary-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .summary-card {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            padding: 25px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .summary-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }

        .summary-card.total {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }

        .summary-card.passed {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            color: white;
        }

        .summary-card.failed {
            background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%);
            color: white;
        }

        .summary-card.missed {
            background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
            color: white;
        }

        .summary-card.time {
            background: linear-gradient(135deg, #17a2b8 0%, #007bff 100%);
            color: white;
        }

        .summary-card .label {
            font-size: 0.9em;
            opacity: 0.9;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 600;
        }

        .summary-card .value {
            font-size: 2.5em;
            font-weight: 700;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
        }

        .pass-rate {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            margin-top: 20px;
        }

        .pass-rate .label {
            font-size: 1.1em;
            color: #6c757d;
            margin-bottom: 10px;
            font-weight: 600;
        }

        .pass-rate .value {
            font-size: 3em;
            font-weight: 700;
            color: #28a745;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
        }

        .steps-section {
            padding: 30px 40px 40px;
            background: #f8f9fa;
        }

        .steps-section h2 {
            color: #495057;
            margin-bottom: 25px;
            font-size: 1.8em;
            border-left: 4px solid #17a2b8;
            padding-left: 15px;
        }

        .table-container {
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        thead {
            background: linear-gradient(135deg, #495057 0%, #343a40 100%);
            color: white;
        }

        thead th {
            padding: 18px 15px;
            text-align: left;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 0.85em;
            letter-spacing: 0.5px;
        }

        tbody tr {
            border-bottom: 1px solid #e9ecef;
            transition: background-color 0.2s ease;
        }

        tbody tr:hover {
            background-color: #f8f9fa;
        }

        tbody td {
            padding: 15px;
            color: #495057;
        }

        tbody tr.status-passed {
            border-left: 4px solid #28a745;
        }

        tbody tr.status-failed {
            border-left: 4px solid #dc3545;
        }

        tbody tr.status-missed {
            border-left: 4px solid #ffc107;
        }

        .status-badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 0.85em;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .status-badge.status-passed {
            background: #d4edda;
            color: #155724;
        }

        .status-badge.status-failed {
            background: #f8d7da;
            color: #721c24;
        }

        .status-badge.status-missed {
            background: #fff3cd;
            color: #856404;
        }

        code {
            background: #f4f4f4;
            padding: 4px 8px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
            color: #e83e8c;
        }

        .error-message {
            color: #dc3545;
            font-weight: 600;
            display: block;
            margin-top: 5px;
            font-size: 0.9em;
        }

        .footer {
            background: #343a40;
            color: white;
            padding: 20px;
            text-align: center;
            font-size: 0.9em;
        }

        @media print {
            body {
                background: white;
                padding: 0;
            }

            .container {
                box-shadow: none;
            }

            .summary-card:hover,
            tbody tr:hover {
                transform: none;
                background-color: inherit;
            }
        }

        @media (max-width: 768px) {
            .header h1 {
                font-size: 1.8em;
            }

            .metadata-grid,
            .summary-cards {
                grid-template-columns: 1fr;
            }

            table {
                font-size: 0.85em;
            }

            thead th,
            tbody td {
                padding: 10px 8px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>\u{1F9EA} Test Execution Report</h1>
            <h2>{{SCENARIO_NAME}}</h2>
            <div class="timestamp">\u{1F4C5} Generated on: {{TIMESTAMP}}</div>
        </div>

        <!-- Metadata Section -->
        <div class="metadata-section">
            <h2>\u{1F4CB} Test Configuration</h2>
            <div class="metadata-grid">
                <div class="metadata-item">
                    <label>Application Name</label>
                    <div class="value">{{APPLICATION_NAME}}</div>
                </div>
                <div class="metadata-item">
                    <label>Base URL</label>
                    <div class="value">{{BASE_URL}}</div>
                </div>
                <div class="metadata-item">
                    <label>Browser/Platform</label>
                    <div class="value">{{BROWSER}}</div>
                </div>
                <div class="metadata-item">
                    <label>Device</label>
                    <div class="value">{{DEVICE}}</div>
                </div>
                <div class="metadata-item">
                    <label>Login Username</label>
                    <div class="value">{{LOGIN_USERNAME}}</div>
                </div>
                <div class="metadata-item">
                    <label>Login Password</label>
                    <div class="value">{{LOGIN_PASSWORD}}</div>
                </div>
            </div>
        </div>

        <!-- Summary Section -->
        <div class="summary-section">
            <h2>\u{1F4CA} Execution Summary</h2>
            <div class="summary-cards">
                <div class="summary-card total">
                    <div class="label">Total Steps</div>
                    <div class="value">{{TOTAL_STEPS}}</div>
                </div>
                <div class="summary-card passed">
                    <div class="label">Passed</div>
                    <div class="value">{{PASSED_STEPS}}</div>
                </div>
                <div class="summary-card failed">
                    <div class="label">Failed</div>
                    <div class="value">{{FAILED_STEPS}}</div>
                </div>
                <div class="summary-card missed">
                    <div class="label">Missed</div>
                    <div class="value">{{MISSED_STEPS}}</div>
                </div>
                <div class="summary-card time">
                    <div class="label">Total Time</div>
                    <div class="value" style="font-size: 1.8em;">{{TOTAL_TIME}}</div>
                </div>
            </div>
            <div class="pass-rate">
                <div class="label">Pass Rate</div>
                <div class="value">{{PASS_RATE}}%</div>
            </div>
        </div>

        <!-- Detailed Steps Section -->
        <div class="steps-section">
            <h2>\u{1F4DD} Detailed Step Execution</h2>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Step #</th>
                            <th>Status</th>
                            <th>Command</th>
                            <th>MCP Tool</th>
                            <th>Test Data</th>
                            <th>Time Taken</th>
                            <th>Error Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {{STEPS_TABLE_ROWS}}
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>Generated by Capgemini UnifiedMCP Test Automation Framework | \xA9 2025</p>
        </div>
    </div>
</body>
</html>`;
}
function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}
function parseTimeToMilliseconds(time) {
  if (time === void 0 || time === null || time === "") {
    return 0;
  }
  if (typeof time === "number") {
    return time;
  }
  const timeStr = time.toString().toLowerCase().trim();
  if (timeStr.includes("nan")) {
    return 0;
  }
  let totalMs = 0;
  const minutesMatch = timeStr.match(/(\d+(?:\.\d+)?)\s*m/);
  const secondsMatch = timeStr.match(/(\d+(?:\.\d+)?)\s*s/);
  const millisecondsMatch = timeStr.match(/(\d+(?:\.\d+)?)\s*ms/);
  if (minutesMatch) {
    totalMs += parseFloat(minutesMatch[1]) * 6e4;
  }
  if (secondsMatch && !timeStr.includes("ms")) {
    totalMs += parseFloat(secondsMatch[1]) * 1e3;
  }
  if (millisecondsMatch) {
    totalMs += parseFloat(millisecondsMatch[1]);
  }
  if (totalMs === 0) {
    const numMatch = timeStr.match(/(\d+(?:\.\d+)?)/);
    if (numMatch) {
      totalMs = parseFloat(numMatch[1]);
    }
  }
  return totalMs;
}
function formatTime(milliseconds) {
  const ms = parseTimeToMilliseconds(milliseconds);
  if (ms < 1e3) {
    return `${ms}ms`;
  } else if (ms < 6e4) {
    return `${(ms / 1e3).toFixed(2)}s`;
  } else {
    const minutes = Math.floor(ms / 6e4);
    const seconds = (ms % 6e4 / 1e3).toFixed(2);
    return `${minutes}m ${seconds}s`;
  }
}
function generateCommandDescription(step) {
  const action = step.action;
  const element = step.element?.humanDescription;
  const url = step.data?.url;
  switch (action) {
    case "navigate":
      return `Navigate to ${url}`;
    case "click":
      return `Click "${element || "element"}"`;
    case "type":
      return `Type into "${element || "input"}"`;
    case "fill":
      return `Fill "${element || "field"}"`;
    case "select_option":
      return `Select option in "${element || "dropdown"}"`;
    case "testAPI":
      return `API ${step.data?.method} ${step.data?.url}`;
    default:
      return action;
  }
}
function generateTestDataString(step) {
  const parts = [];
  if (step.data?.url) {
    parts.push(step.data.url);
  }
  if (step.data?.text) {
    if (step.isSensitiveData) {
      parts.push("\u2022\u2022\u2022\u2022\u2022\u2022\u2022 (masked)");
    } else {
      parts.push(step.data.text);
    }
  }
  if (step.data?.values && Array.isArray(step.data.values)) {
    parts.push(step.data.values.join(", "));
  }
  if (step.data?.method && step.data?.url) {
    parts.push(`${step.data.method} ${step.data.url}`);
  }
  if (step.response?.status) {
    parts.push(`Status: ${step.response.status}`);
  }
  return parts.join(" | ") || "-";
}
function registerGetTestReportData(server, playwrightManager, appiumManager, recordingManager) {
  server.registerTool(
    "getTestReportData",
    {
      title: "Get Test Report Data",
      description: "Returns structured JSON data containing test execution metadata, summary statistics, and detailed step information. This data can be used to generate custom reports using reportTemplate.html or other formats. Can auto-generate from recorded test execution or accept manual step data.",
      inputSchema: {
        scenarioName: external_exports.string().optional().describe("Name of the test scenario (auto-generated if not provided)"),
        useRecordedData: external_exports.boolean().optional().describe("Use data from RecordingManager (default: false). Set to true to auto-generate data from recorded test execution."),
        applicationName: external_exports.string().optional().describe("Name of the application being tested (auto-detected if using recorded data)"),
        baseUrl: external_exports.string().optional().describe("Base URL of the application (auto-detected if using recorded data)"),
        loginCredentials: external_exports.object({
          username: external_exports.string().optional(),
          password: external_exports.string().optional()
        }).optional().describe("Login credentials used in testing (auto-detected if using recorded data)"),
        browser: external_exports.string().optional().describe("Browser used for testing (e.g., chromium, firefox, webkit) (auto-detected if using recorded data)"),
        platform: external_exports.string().optional().describe("Platform used for testing (e.g., Android, iOS, Web) (auto-detected if using recorded data)"),
        device: external_exports.string().optional().describe("Device identifier for mobile testing (auto-detected if using recorded data)"),
        steps: external_exports.array(external_exports.object({
          step: external_exports.number().optional(),
          stepNumber: external_exports.number().optional(),
          command: external_exports.string(),
          mcpTool: external_exports.string().optional().describe("MCP tool name used to execute this step"),
          testData: external_exports.string().optional(),
          timeTaken: external_exports.union([external_exports.number(), external_exports.string()]).optional().describe("Time taken (number in milliseconds or string like '950ms', '1.2s'). Defaults to 0 if not provided."),
          status: external_exports.enum(["passed", "failed", "missed"]),
          errorMessage: external_exports.string().optional()
        })).optional().describe("Array of test steps executed (optional if useRecordedData is true)")
      }
    },
    async (input) => {
      try {
        let steps;
        let metadata;
        let summary;
        if (input.useRecordedData && recordingManager) {
          const reportData2 = recordingManager.getReportData();
          steps = reportData2.steps.map((step, index) => ({
            stepNumber: step.stepNumber || index + 1,
            command: generateCommandDescription(step),
            mcpTool: step.mcpTool || step.tool,
            testData: generateTestDataString(step),
            timeTaken: step.executionTimeMs || 0,
            status: step.status || "passed",
            errorMessage: step.error?.message
          }));
          metadata = {
            scenarioName: input.scenarioName || reportData2.metadata.scenarioName || "Test Execution Report",
            applicationName: input.applicationName || reportData2.metadata.applicationName,
            baseUrl: input.baseUrl || reportData2.metadata.baseUrl,
            loginCredentials: input.loginCredentials || reportData2.metadata.loginCredentials,
            browser: input.browser || reportData2.metadata.browser,
            platform: input.platform || reportData2.metadata.platform,
            device: input.device || reportData2.metadata.device
          };
          summary = {
            totalSteps: reportData2.summary.totalSteps,
            passedSteps: reportData2.summary.passedSteps,
            failedSteps: reportData2.summary.failedSteps,
            missedSteps: reportData2.summary.missedSteps,
            totalTimeTaken: reportData2.summary.totalTimeMs
          };
        } else {
          const stepsInput = input.steps;
          if (!stepsInput) {
            throw new Error("steps parameter is required when useRecordedData is false");
          }
          steps = typeof stepsInput === "string" ? JSON.parse(stepsInput) : stepsInput;
          summary = {
            totalSteps: steps.length,
            passedSteps: steps.filter((s) => s.status === "passed").length,
            failedSteps: steps.filter((s) => s.status === "failed").length,
            missedSteps: steps.filter((s) => s.status === "missed").length,
            totalTimeTaken: steps.reduce((acc, step) => acc + parseTimeToMilliseconds(step.timeTaken), 0)
          };
          metadata = {
            scenarioName: input.scenarioName || generateScenarioName(steps, input.applicationName, input.baseUrl),
            applicationName: input.applicationName,
            baseUrl: input.baseUrl,
            loginCredentials: input.loginCredentials,
            browser: input.browser,
            platform: input.platform,
            device: input.device
          };
        }
        const scenarioName = metadata.scenarioName || generateScenarioName(steps, metadata.applicationName, metadata.baseUrl);
        metadata.scenarioName = scenarioName;
        const passRate = summary.totalSteps > 0 ? (summary.passedSteps / summary.totalSteps * 100).toFixed(2) : "0.00";
        const timestamp = (/* @__PURE__ */ new Date()).toISOString();
        const formattedTimestamp = (/* @__PURE__ */ new Date()).toLocaleString();
        const formattedSteps = steps.map((step, index) => ({
          stepNumber: step.step || step.stepNumber || index + 1,
          command: step.command,
          mcpTool: step.mcpTool || "N/A",
          testData: step.testData || "N/A",
          timeTaken: formatTime(step.timeTaken),
          timeInMs: parseTimeToMilliseconds(step.timeTaken),
          status: step.status,
          errorMessage: step.errorMessage || ""
        }));
        const reportData = {
          metadata: {
            scenarioName,
            applicationName: metadata.applicationName || "N/A",
            baseUrl: metadata.baseUrl || "N/A",
            loginCredentials: {
              username: metadata.loginCredentials?.username || "N/A",
              password: metadata.loginCredentials?.password ? "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" : "N/A"
            },
            browser: metadata.browser || metadata.platform || "N/A",
            platform: metadata.platform || "N/A",
            device: metadata.device || "N/A",
            generatedAt: formattedTimestamp,
            timestamp
          },
          summary: {
            totalSteps: summary.totalSteps,
            passedSteps: summary.passedSteps,
            failedSteps: summary.failedSteps,
            missedSteps: summary.missedSteps,
            totalTimeTaken: formatTime(summary.totalTimeTaken),
            totalTimeMs: summary.totalTimeTaken,
            passRate
          },
          steps: formattedSteps
        };
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(reportData, null, 2)
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `\u274C Error generating test report data: ${error.message}

Stack trace: ${error.stack}`
            }
          ],
          isError: true
        };
      }
    }
  );
}

// src/tools/index.ts
function registerAllTools(server, getLastTestedRequest, getLastTestedResponse, setLastTestedRequest, setLastTestedResponse, playwrightManager, appiumManager) {
  if (setLastTestedRequest && setLastTestedResponse) {
    registerTestAPITool(server, setLastTestedRequest, setLastTestedResponse, playwrightManager);
  }
  registerGenerateAPICypressTest(server, getLastTestedRequest, getLastTestedResponse);
  registerGenerateAPIPlaywrightTest(server, getLastTestedRequest, getLastTestedResponse);
  registerGenerateAPIRestAssuredTest(server, getLastTestedRequest, getLastTestedResponse);
  registerGenerateAPIRestAssuredBDD(server, getLastTestedRequest, getLastTestedResponse);
  registerGenerateAPICypressNegative(server, getLastTestedRequest);
  registerGenerateAPIPlaywrightNegative(server, getLastTestedRequest);
  registerGenerateAPICypressEdgeCase(server, getLastTestedRequest);
  registerGenerateAPIPlaywrightEdgeCase(server, getLastTestedRequest);
  registerGeneratePlaywrightScript(server, playwrightManager);
  registerGenerateTestNGMavenProject(server);
  registerGenerateAppiumTest(server, appiumManager);
  registerClearRecording(server, playwrightManager, appiumManager);
  const recordingManager = playwrightManager?.getRecordingManager?.();
  registerGenerateTestReport(server, playwrightManager, appiumManager, recordingManager);
  registerGetTestReportData(server, playwrightManager, appiumManager, recordingManager);
}

// src/adapters/recording-manager.ts
var RecordingManager = class {
  inMemorySession = null;
  isRecording = false;
  autoRecording = true;
  apiCallCounters = /* @__PURE__ */ new Map();
  // Track API endpoint usage for unique variable names
  lastKnownElements = [];
  // Cache of most recent mobile elements
  sessionMetadata;
  stepCounter = 0;
  // Sequential step counter
  constructor() {
    this.sessionMetadata = {
      browser: "chromium",
      platform: "web",
      device: "Desktop",
      sessionStartTime: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.startInMemoryRecording();
  }
  startInMemoryRecording() {
    const sessionId = `auto_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const sessionName = `Auto Recording ${(/* @__PURE__ */ new Date()).toLocaleString()}`;
    this.inMemorySession = {
      id: sessionId,
      name: sessionName,
      steps: [],
      createdAt: /* @__PURE__ */ new Date(),
      metadata: {
        browser: "chromium"
      }
    };
    this.isRecording = true;
  }
  clearInMemorySession() {
    this.inMemorySession = null;
    this.isRecording = false;
    this.apiCallCounters.clear();
    this.stepCounter = 0;
    this.sessionMetadata = {
      browser: this.sessionMetadata.browser,
      platform: this.sessionMetadata.platform,
      device: this.sessionMetadata.device,
      sessionStartTime: (/* @__PURE__ */ new Date()).toISOString()
    };
    console.error(`\u{1F5D1}\uFE0F Cleared in-memory session data`);
    this.startInMemoryRecording();
  }
  startRecording(sessionName = "Manual Recording", browser = "chromium") {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.inMemorySession = {
      id: sessionId,
      name: sessionName,
      steps: [],
      createdAt: /* @__PURE__ */ new Date(),
      metadata: {
        browser
      }
    };
    this.isRecording = true;
    return sessionId;
  }
  stopRecording() {
    if (!this.isRecording || !this.inMemorySession) {
      throw new Error("No recording in progress");
    }
    const session = this.inMemorySession;
    this.isRecording = false;
    console.error(`\u{1F6D1} Stopped recording session: ${session.name} (${session.steps.length} steps)`);
    return session;
  }
  // Public method to update cached elements for coordinate matching
  updateLastKnownElements(elements) {
    if (Array.isArray(elements) && elements.length > 0) {
      this.lastKnownElements = elements.map((el) => ({
        ...el,
        // Keep all original properties
        // Add normalized properties for compatibility
        "resource-id": el.identifier || el["resource-id"],
        "content-desc": el.label || el["content-desc"],
        "class": el.type || el.class,
        "bounds": this.convertCoordinatesToBounds(el.coordinates || el.bounds)
      }));
    }
  }
  recordStep(action, args, context = {}) {
    if (!this.inMemorySession) {
      return "";
    }
    if (action === "mobile_list_elements_on_screen" && context.result && Array.isArray(context.result)) {
      this.lastKnownElements = context.result.map((el) => ({
        ...el,
        // Keep all original properties
        // Add normalized properties for compatibility
        "resource-id": el.identifier || el["resource-id"],
        "content-desc": el.label || el["content-desc"],
        "class": el.type || el.class,
        "bounds": this.convertCoordinatesToBounds(el.coordinates || el.bounds)
      }));
    }
    const stepId = `step_${Date.now()}_${this.inMemorySession.steps.length + 1}`;
    let step = {
      id: stepId,
      timestamp: /* @__PURE__ */ new Date(),
      action: action.replace("browser_", ""),
      // Clean action names
      context: {
        pageUrl: context.pageUrl,
        pageTitle: context.pageTitle
      }
    };
    switch (action) {
      case "browser_navigate":
        step.data = {
          url: args.url
        };
        this.updatePageContext(args.url);
        break;
      case "browser_click":
        step.element = {
          selector: args.ref || "",
          humanDescription: args.element || "Unknown element",
          ref: args.ref || ""
        };
        step.element.playwrightLocator = {};
        if (args.role) {
          step.element.playwrightLocator.type = "role";
          step.element.playwrightLocator.value = args.role;
        }
        if (args.name) {
          step.element.playwrightLocator.name = args.name;
        }
        if (args.label) {
          step.element.playwrightLocator.type = "label";
          step.element.playwrightLocator.value = args.label;
        }
        if (args.text) {
          step.element.playwrightLocator.type = "text";
          step.element.playwrightLocator.value = args.text;
        }
        break;
      case "browser_type":
        step.element = {
          selector: args.ref || "",
          humanDescription: args.element || "Input field",
          ref: args.ref || ""
        };
        step.data = {
          text: args.text
        };
        step.element.playwrightLocator = {};
        if (args.role) {
          step.element.playwrightLocator.type = "role";
          step.element.playwrightLocator.value = args.role;
        }
        if (args.name) {
          step.element.playwrightLocator.name = args.name;
        }
        if (args.label) {
          step.element.playwrightLocator.type = "label";
          step.element.playwrightLocator.value = args.label;
        }
        if (args.text) {
          step.element.playwrightLocator.type = "text";
          step.element.playwrightLocator.value = args.text;
        }
        break;
      case "browser_select_option":
        step.element = {
          selector: args.ref || "",
          humanDescription: args.element || "Select dropdown",
          ref: args.ref || ""
        };
        step.data = {
          values: args.values || []
        };
        step.element.playwrightLocator = {};
        if (args.role) {
          step.element.playwrightLocator.type = "role";
          step.element.playwrightLocator.value = args.role;
        }
        if (args.name) {
          step.element.playwrightLocator.name = args.name;
        }
        if (args.label) {
          step.element.playwrightLocator.type = "label";
          step.element.playwrightLocator.value = args.label;
        }
        break;
      case "browser_fill_form":
        step.element = {
          selector: "form",
          humanDescription: `Form with ${args.fields?.length || 0} fields`,
          ref: "form"
        };
        step.data = {
          fields: args.fields || []
        };
        break;
      case "browser_press_key":
        step.data = {
          key: args.key
        };
        break;
      case "browser_tabs":
      case "browser_switch_window":
        step.data = {
          action: args.action,
          index: args.index
        };
        break;
      case "testAPI":
        step.data = {
          url: args.url,
          method: args.method || "GET",
          body: args.body,
          headers: args.headers,
          auth: args.auth
        };
        break;
      case "browser_verify_element_visible":
        step.action = "verify_element_visible";
        step.element = {
          selector: args.ref || "",
          humanDescription: args.element || "Element",
          ref: args.ref || ""
        };
        step.element.playwrightLocator = {};
        if (args.role) {
          step.element.playwrightLocator.type = "role";
          step.element.playwrightLocator.value = args.role;
        }
        if (args.accessibleName) {
          step.element.playwrightLocator.name = args.accessibleName;
        }
        break;
      case "browser_verify_text_visible":
        step.action = "verify_text_visible";
        step.data = {
          text: args.text
        };
        break;
      // Mobile automation actions
      case "mobile_tap":
      case "appium_tap":
      case "mobile_click":
      case "mobile_click_on_screen_at_coordinates":
      case "mobile_double_click_on_screen_at_coordinates":
      case "mobile_long_press_on_screen_at_coordinates":
        step.element = {
          selector: args.selector || args.element || "",
          humanDescription: args.description || args.humanDescription || "Mobile element",
          ref: args.ref || ""
        };
        if (args.elementInfo) {
          step.element.mobileElement = {
            "content-desc": args.elementInfo["content-desc"],
            "resource-id": args.elementInfo["resource-id"],
            "class": args.elementInfo["class"],
            "text": args.elementInfo["text"],
            "bounds": args.elementInfo["bounds"],
            "clickable": args.elementInfo["clickable"],
            "enabled": args.elementInfo["enabled"]
          };
          step.element.selector = args.selector || this.buildSelectorFromElement(args.elementInfo);
          step.element.humanDescription = args.humanDescription || args.elementInfo.text || args.elementInfo["content-desc"] || args.elementInfo["resource-id"] || "Element";
          console.error(`\u2705 Recording: Element-based click with selector: ${step.element.selector}`);
        } else {
          step.element.mobileElement = {};
          if (args["content-desc"]) step.element.mobileElement["content-desc"] = args["content-desc"];
          if (args["resource-id"]) step.element.mobileElement["resource-id"] = args["resource-id"];
          if (args.contentDescription) step.element.mobileElement["content-desc"] = args.contentDescription;
          if (args.resourceId) step.element.mobileElement["resource-id"] = args.resourceId;
          if (args.text) step.element.mobileElement["text"] = args.text;
          if (args.className) step.element.mobileElement["class"] = args.className;
          if (args.bounds) step.element.mobileElement["bounds"] = args.bounds;
          if ((action === "mobile_click_on_screen_at_coordinates" || action === "mobile_double_click_on_screen_at_coordinates" || action === "mobile_long_press_on_screen_at_coordinates") && args.x !== void 0 && args.y !== void 0) {
            const clickedElement = this.findElementAtCoordinates(args.x, args.y);
            if (clickedElement) {
              step.element.mobileElement = { ...step.element.mobileElement, ...clickedElement };
              step.element.humanDescription = clickedElement.text || clickedElement["content-desc"] || clickedElement["resource-id"] || "Clicked element";
              step.element.selector = this.buildSelectorFromElement(clickedElement);
              console.error(`\u2705 Recording: Matched coordinate (${args.x},${args.y}) to element: ${step.element.selector}`);
            } else {
              step.element.selector = `coordinates:${args.x},${args.y}`;
              step.element.humanDescription = `Click at coordinates (${args.x}, ${args.y})`;
              console.error(`\u26A0\uFE0F Recording: No element found for coordinates (${args.x},${args.y}) - using coordinates only`);
            }
          }
        }
        break;
      case "mobile_type":
      case "appium_type":
      case "mobile_sendKeys":
      case "mobile_type_keys":
        step.element = {
          selector: args.selector || args.element || "",
          humanDescription: args.description || args.humanDescription || "Mobile input field",
          ref: args.ref || ""
        };
        step.data = {
          text: args.text || args.value || ""
        };
        if (args.elementInfo) {
          step.element.mobileElement = {
            "content-desc": args.elementInfo["content-desc"],
            "resource-id": args.elementInfo["resource-id"],
            "class": args.elementInfo["class"],
            "text": args.elementInfo["text"],
            "bounds": args.elementInfo["bounds"]
          };
        } else {
          step.element.mobileElement = {};
          if (args["content-desc"]) step.element.mobileElement["content-desc"] = args["content-desc"];
          if (args["resource-id"]) step.element.mobileElement["resource-id"] = args["resource-id"];
          if (args.contentDescription) step.element.mobileElement["content-desc"] = args.contentDescription;
          if (args.resourceId) step.element.mobileElement["resource-id"] = args.resourceId;
          if (args.className) step.element.mobileElement["class"] = args.className;
          if (args.bounds) step.element.mobileElement["bounds"] = args.bounds;
        }
        break;
      case "mobile_swipe":
      case "appium_swipe":
        step.data = {
          startX: args.startX,
          startY: args.startY,
          endX: args.endX,
          endY: args.endY,
          duration: args.duration
        };
        break;
      case "browser_file_upload":
        step.action = "file_upload";
        step.element = {
          selector: args.ref || "",
          humanDescription: args.element || "File input",
          ref: args.ref || ""
        };
        step.element.playwrightLocator = {};
        if (args.role) {
          step.element.playwrightLocator.type = "role";
          step.element.playwrightLocator.value = args.role;
        }
        if (args.name) {
          step.element.playwrightLocator.name = args.name;
        }
        if (args.label) {
          step.element.playwrightLocator.type = "label";
          step.element.playwrightLocator.value = args.label;
        }
        if (args.testid) {
          step.element.playwrightLocator.type = "testid";
          step.element.playwrightLocator.value = args.testid;
        }
        step.data = {
          filePath: args.paths && args.paths[0] ? args.paths[0] : ""
        };
        break;
    }
    this.inMemorySession.steps.push(step);
    console.error(`\u{1F4DD} Auto-recorded step ${this.inMemorySession.steps.length}: ${step.action}`);
    return stepId;
  }
  // NEW: Method to update a step with the actual Playwright code executed
  updateStepWithPlaywrightCode(stepId, playwrightCode) {
    if (!this.inMemorySession) return;
    const step = this.inMemorySession.steps.find((s) => s.id === stepId);
    if (step) {
      step.playwrightCode = playwrightCode;
    }
  }
  // NEW: Method to update a step with API response data
  updateStepWithApiResponse(stepId, response) {
    if (!this.inMemorySession) return;
    const step = this.inMemorySession.steps.find((s) => s.id === stepId);
    if (step) {
      step.response = response;
      console.error(`\u{1F310} Updated step ${stepId} with API response: ${response.status}`);
    }
  }
  updateStepWithMobileElement(stepId, mobileElement) {
    if (!this.inMemorySession) return;
    const step = this.inMemorySession.steps.find((s) => s.id === stepId);
    if (step) {
      if (!step.element) {
        step.element = {
          selector: "",
          humanDescription: "",
          ref: ""
        };
      }
      step.element.mobileElement = {
        ...step.element.mobileElement,
        ...mobileElement
      };
    }
  }
  /**
   * Convert coordinates object to bounds string format
   * Converts {x, y, width, height} to [left,top][right,bottom] format
   */
  convertCoordinatesToBounds(coords) {
    if (!coords) return void 0;
    if (typeof coords === "string") return coords;
    if (coords.x !== void 0 && coords.y !== void 0 && coords.width !== void 0 && coords.height !== void 0) {
      return `[${coords.x},${coords.y}][${coords.x + coords.width},${coords.y + coords.height}]`;
    }
    if (coords.left !== void 0 && coords.top !== void 0 && coords.right !== void 0 && coords.bottom !== void 0) {
      return `[${coords.left},${coords.top}][${coords.right},${coords.bottom}]`;
    }
    return void 0;
  }
  // Helper to build a proper selector from mobile element attributes
  buildSelectorFromElement(element) {
    const contentDesc = element.label || element["content-desc"];
    const resourceId = element.identifier || element["resource-id"];
    if (contentDesc) {
      return `~${contentDesc}`;
    }
    if (resourceId) {
      return `resource-id=${resourceId}`;
    }
    if (element.xpath) {
      return element.xpath;
    }
    if (element.text) {
      return `text=${element.text}`;
    }
    if (element.type || element.class || element.className) {
      return `class=${element.type || element.class || element.className}`;
    }
    return "unknown";
  }
  // Helper method to normalize headers for comparison
  normalizeHeaders(headers) {
    if (!headers) return {};
    const normalized = {};
    Object.keys(headers).sort().forEach((key) => {
      normalized[key.toLowerCase()] = headers[key];
    });
    return normalized;
  }
  // NEW: Method to record complete API call with request and response
  recordApiCall(method, url, requestData, response) {
    if (!this.inMemorySession) return "";
    const normalizedHeaders = this.normalizeHeaders(requestData.headers);
    const isDuplicate = this.inMemorySession.steps.some(
      (existingStep) => existingStep.action === "testAPI" && existingStep.data?.url === url && existingStep.data?.method === method && JSON.stringify(existingStep.data?.body) === JSON.stringify(requestData.body) && JSON.stringify(this.normalizeHeaders(existingStep.data?.headers)) === JSON.stringify(normalizedHeaders)
    );
    if (isDuplicate) {
      console.error(`\u{1F6AB} Skipping duplicate API call: ${method} ${url}`);
      return "";
    }
    const stepId = `api_${Date.now()}_${this.inMemorySession.steps.length + 1}`;
    const step = {
      id: stepId,
      timestamp: /* @__PURE__ */ new Date(),
      action: "testAPI",
      data: {
        url,
        method,
        body: requestData.body,
        headers: normalizedHeaders,
        // Use normalized headers
        auth: requestData.auth
      },
      response: {
        status: response.status,
        body: response.body,
        headers: response.headers
      },
      context: {}
    };
    this.inMemorySession.steps.push(step);
    console.error(`\u{1F4DD} Recorded complete API call: ${method} ${url} \u2192 ${response.status}`);
    return stepId;
  }
  updatePageContext(url, title) {
  }
  // NEW: Generate unique variable names for API calls
  generateUniqueVariableName(url, method) {
    const urlPath = url.split("/").pop() || "api";
    const baseKey = `${method.toLowerCase()}_${urlPath.replace(/[^a-zA-Z0-9]/g, "_")}`;
    const currentCount = this.apiCallCounters.get(baseKey) || 0;
    this.apiCallCounters.set(baseKey, currentCount + 1);
    let suffix = "";
    if (currentCount > 0) {
      suffix = `_${currentCount + 1}`;
    }
    const responseName = `${baseKey}Response${suffix}`;
    const dataName = `${baseKey}Data${suffix}`;
    return { responseName, dataName };
  }
  isCurrentlyRecording() {
    return this.isRecording;
  }
  getCurrentSession() {
    return this.inMemorySession;
  }
  getInMemorySession() {
    return this.inMemorySession;
  }
  // Legacy methods for compatibility (no file operations)
  listSessions() {
    return this.inMemorySession ? [this.inMemorySession] : [];
  }
  getSession(sessionId) {
    if (this.inMemorySession && this.inMemorySession.id === sessionId) {
      return this.inMemorySession;
    }
    return null;
  }
  // NEW: Method to preserve session across different tool calls
  preserveSession() {
    if (!this.inMemorySession) {
      this.startInMemoryRecording();
    }
    console.error(`\u{1F512} Session preserved: ${this.inMemorySession?.name} (${this.inMemorySession?.steps.length} steps)`);
  }
  // NEW: Method to get session summary for debugging
  getSessionSummary() {
    if (!this.inMemorySession) {
      return "No active recording session";
    }
    const stepSummary = this.inMemorySession.steps.map((step) => {
      if (step.action === "testAPI") {
        return `${step.data?.method} ${step.data?.url} \u2192 ${step.response?.status}`;
      }
      return `${step.action}${step.data?.url ? ` (${step.data.url})` : ""}${step.data?.text ? ` (${step.data.text.substring(0, 20)}...)` : ""}${step.data?.values ? ` (${step.data.values.join(", ")})` : ""}`;
    }).join(", ");
    return `Session: ${this.inMemorySession.name}, Steps: ${this.inMemorySession.steps.length} [${stepSummary}]`;
  }
  /**
   * Find the mobile element at the given coordinates by checking bounds from lastKnownElements
   */
  findElementAtCoordinates(x, y) {
    if (!this.lastKnownElements || this.lastKnownElements.length === 0) {
      return null;
    }
    for (let i = 0; i < this.lastKnownElements.length; i++) {
      const element = this.lastKnownElements[i];
      if (element.bounds) {
        let bounds = null;
        if (typeof element.bounds === "string") {
          const boundsMatch = element.bounds.match(/\[(\d+),(\d+)\]\[(\d+),(\d+)\]/);
          if (boundsMatch) {
            bounds = {
              left: parseInt(boundsMatch[1]),
              top: parseInt(boundsMatch[2]),
              right: parseInt(boundsMatch[3]),
              bottom: parseInt(boundsMatch[4])
            };
          }
        } else if (typeof element.bounds === "object") {
          if (element.bounds.x !== void 0 && element.bounds.y !== void 0 && element.bounds.width !== void 0 && element.bounds.height !== void 0) {
            bounds = {
              left: element.bounds.x,
              top: element.bounds.y,
              right: element.bounds.x + element.bounds.width,
              bottom: element.bounds.y + element.bounds.height
            };
          } else if (element.bounds.left !== void 0 && element.bounds.top !== void 0) {
            bounds = element.bounds;
          }
        }
        if (bounds) {
          const isMatch = x >= bounds.left && x <= bounds.right && y >= bounds.top && y <= bounds.bottom;
          if (isMatch) {
            return element;
          }
        }
      }
    }
    return null;
  }
  /**
   * Record the result of a tool execution - useful for caching mobile elements
   */
  recordToolResult(action, result) {
    if (action === "mobile_list_elements_on_screen" && Array.isArray(result)) {
      this.lastKnownElements = result.map((el) => ({
        ...el,
        // Keep all original properties
        // Add normalized properties for compatibility
        "resource-id": el.identifier || el["resource-id"],
        "content-desc": el.label || el["content-desc"],
        "class": el.type || el.class,
        "bounds": this.convertCoordinatesToBounds(el.coordinates || el.bounds)
      }));
    }
  }
  // =============== NEW: Session Metadata & Execution Wrapper Methods ===============
  /**
   * Register adapter information (called by adapters during initialization)
   */
  registerAdapter(info) {
    this.sessionMetadata.platform = info.platform;
    this.sessionMetadata.browser = info.browser;
    this.sessionMetadata.device = info.device;
    logger.debug(`\u{1F4DD} Adapter registered: ${info.platform} | ${info.browser} | ${info.device}`);
  }
  /**
   * Set session metadata (can be called by user or auto-detected)
   */
  setSessionMetadata(key, value) {
    this.sessionMetadata[key] = value;
  }
  /**
   * Start a new session with optional metadata
   */
  startSession(metadata) {
    if (metadata) {
      this.sessionMetadata = {
        ...this.sessionMetadata,
        ...metadata,
        sessionStartTime: (/* @__PURE__ */ new Date()).toISOString()
      };
    }
    this.stepCounter = 0;
    this.startInMemoryRecording();
  }
  /**
   * End the current session
   */
  endSession() {
    this.sessionMetadata.sessionEndTime = (/* @__PURE__ */ new Date()).toISOString();
  }
  /**
   * Wrap tool execution with automatic timing and status tracking
   */
  async wrapToolExecution(toolName, toolParams, executionFn) {
    const startTime = performance.now();
    this.stepCounter++;
    const stepNumber = this.stepCounter;
    try {
      const result = await executionFn();
      const executionTimeMs = Math.round(performance.now() - startTime);
      if (this.inMemorySession && this.inMemorySession.steps.length > 0) {
        const lastStep = this.inMemorySession.steps[this.inMemorySession.steps.length - 1];
        lastStep.stepNumber = stepNumber;
        lastStep.status = "passed";
        lastStep.executionTimeMs = executionTimeMs;
        if (lastStep.element?.humanDescription?.toLowerCase().includes("password") || lastStep.data?.text && toolName.includes("type")) {
          lastStep.isSensitiveData = true;
        }
      }
      return result;
    } catch (error) {
      const executionTimeMs = Math.round(performance.now() - startTime);
      if (this.inMemorySession && this.inMemorySession.steps.length > 0) {
        const lastStep = this.inMemorySession.steps[this.inMemorySession.steps.length - 1];
        lastStep.stepNumber = stepNumber;
        lastStep.status = "failed";
        lastStep.executionTimeMs = executionTimeMs;
        lastStep.error = {
          message: error.message || "Unknown error",
          stack: error.stack
        };
      }
      throw error;
    }
  }
  /**
   * Auto-enrich metadata from recorded steps
   */
  enrichMetadata() {
    if (!this.inMemorySession || !this.inMemorySession.steps.length) return;
    const firstNav = this.inMemorySession.steps.find((s) => s.action === "navigate");
    if (firstNav && firstNav.data?.url && !this.sessionMetadata.baseUrl) {
      this.sessionMetadata.baseUrl = firstNav.data.url;
      try {
        const domain = new URL(firstNav.data.url).hostname;
        this.sessionMetadata.applicationName = domain.replace("www.", "").split(".")[0];
      } catch (e) {
      }
    }
    const emailField = this.inMemorySession.steps.find(
      (s) => (s.action === "type" || s.action === "fill") && s.element?.humanDescription?.toLowerCase().includes("email")
    );
    const passwordField = this.inMemorySession.steps.find(
      (s) => (s.action === "type" || s.action === "fill") && s.element?.humanDescription?.toLowerCase().includes("password")
    );
    if (emailField?.data?.text || passwordField?.data?.text) {
      this.sessionMetadata.loginCredentials = {
        username: emailField?.data?.text,
        password: passwordField?.data?.text
      };
    }
  }
  /**
   * Get complete report data for HTML report generation
   */
  getReportData() {
    this.enrichMetadata();
    if (!this.inMemorySession) {
      return {
        metadata: this.sessionMetadata,
        steps: [],
        summary: {
          totalSteps: 0,
          passedSteps: 0,
          failedSteps: 0,
          missedSteps: 0,
          totalTimeMs: 0,
          passRate: 0
        }
      };
    }
    const steps = this.inMemorySession.steps;
    const passedSteps = steps.filter((s) => s.status === "passed").length;
    const failedSteps = steps.filter((s) => s.status === "failed").length;
    const missedSteps = steps.filter((s) => s.status === "missed").length;
    const totalTimeMs = steps.reduce((sum, s) => sum + (s.executionTimeMs || 0), 0);
    const passRate = steps.length > 0 ? Math.round(passedSteps / steps.length * 100) : 0;
    return {
      metadata: this.sessionMetadata,
      steps,
      summary: {
        totalSteps: steps.length,
        passedSteps,
        failedSteps,
        missedSteps,
        totalTimeMs,
        passRate
      }
    };
  }
};

// src/adapters/api-adapter.ts
var APIAdapter = class {
  tools = [];
  mockServer;
  lastTestedRequest = null;
  lastTestedResponse = null;
  playwrightManager = null;
  // Store reference to playwright manager
  appiumManager = null;
  // Store reference to appium manager
  recordingManager;
  constructor(recordingManager) {
    this.recordingManager = recordingManager || new RecordingManager();
    this.recordingManager.registerAdapter({
      platform: "api",
      browser: "REST Client",
      device: "N/A"
    });
    this.mockServer = {
      tools: /* @__PURE__ */ new Map(),
      registerTool: (name, schema, handler) => {
        this.mockServer.tools.set(name, { schema, handler });
        const mcpTool = {
          name,
          description: schema.description || schema.title || `Tool: ${name}`,
          inputSchema: this.convertSchemaToMCP(schema.inputSchema, name)
        };
        this.tools.push(mcpTool);
      }
    };
  }
  convertSchemaToMCP(zodSchema, toolName) {
    if (!zodSchema) {
      return {
        type: "object",
        properties: {},
        additionalProperties: true
      };
    }
    const properties = {};
    const required = [];
    let schemaShape = zodSchema.shape;
    if (!schemaShape && zodSchema._def && zodSchema._def.shape) {
      schemaShape = zodSchema._def.shape;
    }
    if (!schemaShape && zodSchema && typeof zodSchema === "object") {
      const hasFieldSchemas = Object.values(zodSchema).some(
        (value) => value && typeof value === "object" && value._def && value._def.typeName
      );
      if (hasFieldSchemas) {
        schemaShape = zodSchema;
      }
    }
    if (schemaShape) {
      for (const [key, value] of Object.entries(schemaShape)) {
        const fieldSchema = value;
        if (fieldSchema._def) {
          const def = fieldSchema._def;
          switch (def.typeName) {
            case "ZodString":
              properties[key] = { type: "string" };
              if (def.checks) {
                const urlCheck = def.checks.find((c) => c.kind === "url");
                if (urlCheck) {
                  properties[key].format = "uri";
                }
              }
              break;
            case "ZodEnum":
              properties[key] = { type: "string", enum: def.values };
              break;
            case "ZodBoolean":
              properties[key] = { type: "boolean" };
              break;
            case "ZodNumber":
              properties[key] = { type: "number" };
              break;
            case "ZodObject":
              properties[key] = { type: "object", additionalProperties: true };
              break;
            case "ZodRecord":
              properties[key] = { type: "object", additionalProperties: true };
              break;
            case "ZodOptional":
              const innerType = def.innerType._def;
              if (innerType.typeName === "ZodObject" || innerType.typeName === "ZodRecord") {
                properties[key] = { type: "object", additionalProperties: true };
              } else if (innerType.typeName === "ZodString") {
                properties[key] = { type: "string" };
                if (innerType.checks) {
                  const urlCheck = innerType.checks.find((c) => c.kind === "url");
                  if (urlCheck) {
                    properties[key].format = "uri";
                  }
                }
              } else if (innerType.typeName === "ZodEnum") {
                properties[key] = { type: "string", enum: innerType.values };
              } else if (innerType.typeName === "ZodBoolean") {
                properties[key] = { type: "boolean" };
              } else if (innerType.typeName === "ZodNumber") {
                properties[key] = { type: "number" };
              } else {
                properties[key] = { type: "string" };
              }
              break;
            case "ZodDefault":
              const defaultInnerType = def.innerType._def;
              if (defaultInnerType.typeName === "ZodBoolean") {
                properties[key] = { type: "boolean" };
              } else if (defaultInnerType.typeName === "ZodNumber") {
                properties[key] = { type: "number" };
              } else if (defaultInnerType.typeName === "ZodString") {
                properties[key] = { type: "string" };
              } else {
                properties[key] = { type: "string" };
              }
              required.push(key);
              break;
            default:
              properties[key] = { type: "string" };
          }
          if (def.typeName !== "ZodOptional" && def.typeName !== "ZodDefault") {
            required.push(key);
          }
        }
      }
    }
    const isTestAPI = toolName === "testAPI";
    return {
      type: "object",
      properties,
      required: required.length > 0 ? required : void 0,
      additionalProperties: isTestAPI ? true : false
    };
  }
  async initialize(playwrightManager, appiumManager) {
    this.playwrightManager = playwrightManager;
    this.appiumManager = appiumManager;
    registerAllTools(
      this.mockServer,
      () => this.lastTestedRequest,
      () => this.lastTestedResponse,
      (req) => {
        this.lastTestedRequest = req;
      },
      (res) => {
        this.lastTestedResponse = res;
      },
      playwrightManager,
      // Pass playwright manager for recording tools
      appiumManager
      // Pass appium manager for mobile tools
    );
    console.error("[DEBUG] Number of API tools registered:", this.tools.length);
  }
  getTools() {
    return this.tools;
  }
  async callTool(toolName, args) {
    const tool = this.mockServer.tools.get(toolName);
    if (!tool) {
      throw new Error(`Unknown API tool: ${toolName}`);
    }
    return this.recordingManager.wrapToolExecution(
      toolName,
      args,
      async () => {
        try {
          const result = await tool.handler(args);
          if (toolName === "testAPI" && this.playwrightManager?.getRecordingManager) {
            const recordingManager = this.playwrightManager.getRecordingManager();
            if (recordingManager && this.lastTestedRequest && this.lastTestedResponse) {
              recordingManager.recordApiCall(
                this.lastTestedRequest.method || "GET",
                this.lastTestedRequest.url,
                {
                  headers: this.lastTestedRequest.headers,
                  body: this.lastTestedRequest.body,
                  auth: this.lastTestedRequest.auth
                },
                {
                  status: this.lastTestedResponse.status,
                  body: this.lastTestedResponse.body,
                  headers: this.lastTestedResponse.headers
                }
              );
            }
          }
          if ((toolName === "generatePlaywrightScript" || toolName === "generateCypressScript") && this.playwrightManager?.getRecordingManager) {
            const recordingManager = this.playwrightManager.getRecordingManager();
            if (recordingManager) {
              recordingManager.startInMemoryRecording();
            }
          }
          if (result && result.content) {
            return {
              content: result.content,
              isError: false
            };
          }
          return {
            content: [
              {
                type: "text",
                text: typeof result === "string" ? result : JSON.stringify(result, null, 2)
              }
            ]
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `API tool execution failed: ${error instanceof Error ? error.message : String(error)}`
              }
            ],
            isError: true
          };
        }
      }
      // End inner async function
    );
  }
  getRecordingManager() {
    return this.recordingManager;
  }
};

// src/adapters/playwright-process.ts
var import_child_process = require("child_process");
var import_path4 = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var PlaywrightProcessManager = class {
  constructor(options2 = {}, recordingManager) {
    this.options = options2;
    this.recordingManager = recordingManager || new RecordingManager();
    this.storageStatePath = this.options.storageState;
    this.config = {
      version: this.options.version || "latest",
      // Dynamic version support
      timeouts: {
        startup: this.options.timeouts?.startup || 3e4,
        // Increased from 15000
        initialization: this.options.timeouts?.initialization || 1e4,
        // Increased from 5000
        toolCall: this.options.timeouts?.toolCall || 6e4,
        // Increased from 30000
        gracePeriod: this.options.timeouts?.gracePeriod || 5e3
        // Increased from 3000
      },
      protocolVersion: this.options.protocolVersion || "2024-11-05",
      // Configurable protocol version
      retryAttempts: this.options.retryAttempts || 3,
      verboseLogging: this.options.verboseLogging || false
    };
    if (this.config.verboseLogging) {
    }
  }
  process = null;
  tools = [];
  isReady = false;
  messageId = 0;
  pendingRequests = /* @__PURE__ */ new Map();
  recordingManager;
  currentPageContext = { url: "", title: "" };
  storageStatePath;
  // Store the storage state path from options
  isSavingStorageState = false;
  // Prevent recursive saves
  /**
   * Ensures storage state file exists, creates empty one if not
   */
  ensureStorageStateFile(storageStatePath) {
    try {
      if (!import_fs.default.existsSync(storageStatePath)) {
        const dir = import_path4.default.dirname(storageStatePath);
        if (!import_fs.default.existsSync(dir)) {
          import_fs.default.mkdirSync(dir, { recursive: true });
          logger.info(`\u{1F4C1} Created storage state directory: ${dir}`);
        }
        const emptyStorageState = {
          cookies: [],
          origins: []
        };
        import_fs.default.writeFileSync(storageStatePath, JSON.stringify(emptyStorageState, null, 2), "utf-8");
        logger.info(`\u2705 Created empty storage state file: ${storageStatePath}`);
        logger.info("\u{1F4A1} This file will be populated when you save your authentication state");
      } else {
        logger.info(`\u{1F4C4} Using existing storage state: ${storageStatePath}`);
      }
    } catch (error) {
      logger.warn(`\u26A0\uFE0F  Could not ensure storage state file: ${error.message}`);
    }
  }
  /**
   * Check if storage state file has actual data (cookies or origins)
   */
  hasStorageStateData(storageStatePath) {
    try {
      if (!import_fs.default.existsSync(storageStatePath)) {
        return false;
      }
      const content = import_fs.default.readFileSync(storageStatePath, "utf-8");
      const state = JSON.parse(content);
      const hasCookies = state.cookies && state.cookies.length > 0;
      const hasOrigins = state.origins && state.origins.length > 0;
      return hasCookies || hasOrigins;
    } catch (error) {
      logger.warn(`\u26A0\uFE0F  Could not read storage state file: ${error.message}`);
      return false;
    }
  }
  // Enhanced configuration with defaults
  config;
  async start() {
    if (this.config.verboseLogging) {
    }
    let lastError = null;
    for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
      try {
        if (this.config.verboseLogging && attempt > 1) {
        }
        await this.startWithRetry();
        if (this.config.verboseLogging) {
        }
        return;
      } catch (error) {
        lastError = error;
        if (this.config.verboseLogging) {
          console.error(`\u274C Attempt ${attempt} failed:`, error.message);
        }
        if (attempt < this.config.retryAttempts) {
          const delay = Math.min(1e3 * Math.pow(2, attempt - 1), 5e3);
          if (this.config.verboseLogging) {
          }
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }
    throw new Error(`Failed to start Playwright MCP after ${this.config.retryAttempts} attempts. Last error: ${lastError?.message}`);
  }
  async startWithRetry() {
    try {
      const playwrightPackage = this.config.version === "latest" ? "@playwright/mcp@latest" : `@playwright/mcp@${this.config.version}`;
      const args = [playwrightPackage];
      if (this.options.browser) {
        args.push("--browser", this.options.browser);
      }
      if (!this.options.headless) {
      } else {
        args.push("--headless");
      }
      if (this.options.isolated) {
        args.push("--isolated");
      }
      if (this.options.useExtension) {
        args.push("--extension");
        if (this.options.extensionToken) {
        }
      }
      if (this.options.userDataDir) {
        args.push("--user-data-dir", this.options.userDataDir);
      }
      if (this.options.storageState) {
        this.ensureStorageStateFile(this.options.storageState);
        const hasStorageData = this.hasStorageStateData(this.options.storageState);
        if (hasStorageData) {
          logger.info(`\u{1F4C4} Loading existing storage state from: ${this.options.storageState}`);
          args.push("--storage-state", this.options.storageState);
        } else {
          logger.info(`\u{1F4A1} Storage state file is empty, will capture fresh authentication`);
          logger.info(`\u{1F4BE} Use browser_save_storage_state after logging in to save the session`);
        }
      }
      args.push("--ignore-https-errors");
      args.push("--caps=testing");
      let command = "npx";
      let spawnArgs = args;
      if (process.platform === "win32") {
        command = "npx.cmd";
      }
      if (this.config.verboseLogging) {
      }
      const env = {
        ...process.env,
        PATH: process.env.PATH + (process.platform === "win32" ? ";" : ":") + process.env.npm_config_prefix + (process.platform === "win32" ? "\\bin" : "/bin"),
        // Extension token support
        ...this.options.extensionToken ? { PLAYWRIGHT_MCP_EXTENSION_TOKEN: this.options.extensionToken } : {},
        // Enhanced debugging
        ...this.config.verboseLogging ? { DEBUG: "pw:mcp*", DEBUG_COLORS: "0" } : {}
      };
      this.process = (0, import_child_process.spawn)(command, spawnArgs, {
        stdio: ["pipe", "pipe", "pipe"],
        env,
        shell: process.platform === "win32"
        // Use shell on Windows
      });
      if (!this.process.stdout || !this.process.stdin) {
        throw new Error("Failed to create Playwright process streams");
      }
      this.setupProcessCommunication();
      await this.waitForReady();
      await this.loadTools();
    } catch (error) {
      if (this.config.verboseLogging) {
        console.error("\u274C Failed to start Playwright process:", error);
      }
      if (error.message?.includes("protocol") || error.message?.includes("version")) {
        throw new Error(`Protocol version mismatch detected. Current protocol: ${this.config.protocolVersion}, Package version: ${this.config.version}. ${error.message}`);
      }
      if (error.code === "ENOENT") {
        if (this.config.verboseLogging) {
          console.error("\u{1F4DD} npx not found, trying alternative approach...");
        }
        await this.startWithNodeDirectly();
      } else {
        throw error;
      }
    }
  }
  async startWithNodeDirectly() {
    try {
      const playwrightMcpPath = require.resolve("@playwright/mcp");
      const args = [playwrightMcpPath];
      if (this.options.browser) {
        args.push("--browser", this.options.browser);
      }
      if (this.options.headless) {
        args.push("--headless");
      }
      if (this.options.isolated) {
        args.push("--isolated");
      }
      if (this.options.useExtension) {
        args.push("--extension");
      }
      if (this.options.userDataDir) {
        args.push("--user-data-dir", this.options.userDataDir);
      }
      if (this.options.storageState) {
        args.push("--storage-state", this.options.storageState);
      }
      args.push("--ignore-https-errors");
      args.push("--caps=testing");
      if (this.config.verboseLogging) {
      }
      const env = {
        ...process.env,
        ...this.options.extensionToken ? { PLAYWRIGHT_MCP_EXTENSION_TOKEN: this.options.extensionToken } : {},
        ...this.config.verboseLogging ? { DEBUG: "pw:mcp*", DEBUG_COLORS: "0" } : {}
      };
      this.process = (0, import_child_process.spawn)("node", args, {
        stdio: ["pipe", "pipe", "pipe"],
        env
      });
      if (!this.process.stdout || !this.process.stdin) {
        throw new Error("Failed to create Playwright process streams");
      }
      this.setupProcessCommunication();
      await this.waitForReady();
      await this.loadTools();
    } catch (fallbackError) {
      console.error("\u274C Fallback approach also failed:", fallbackError);
      throw new Error(`Failed to start Playwright MCP process: ${fallbackError.message}`);
    }
  }
  async stop() {
    if (this.process) {
      if (this.options.storageState) {
        try {
          await this.saveStorageState();
        } catch (error) {
        }
      }
      this.process.kill();
      this.process = null;
      this.isReady = false;
    }
  }
  // 🔒 NEW: Explicitly save storage state to file
  async saveStorageState() {
    if (!this.storageStatePath) {
      throw new Error("Storage state path not configured");
    }
    try {
      logger.info(`\u{1F3AD} Saving storage state to: ${this.storageStatePath}`);
      const saveCode = `
const fs = require('fs');
const path = require('path');

// Get storage state from the current context
const storageState = await page.context().storageState();

// Ensure directory exists
const storageStatePath = '${this.storageStatePath.replace(/\\/g, "\\\\")}';
const dir = path.dirname(storageStatePath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Write storage state to file
fs.writeFileSync(storageStatePath, JSON.stringify(storageState, null, 2), 'utf-8');

\`\u2705 Saved \${storageState.cookies?.length || 0} cookies and \${storageState.origins?.length || 0} origins to \${storageStatePath}\`
`;
      const result = await this.callTool("browser_run_code", { code: saveCode });
      if (result?.content?.[0]?.text) {
        logger.info(`\u2705 ${result.content[0].text}`);
      }
    } catch (error) {
      throw new Error(`Failed to save storage state: ${error.message}`);
    }
  }
  // 🔒 NEW: Background storage state save (non-blocking)
  saveStorageStateBackground() {
    if (this.isSavingStorageState) {
      logger.info("\u{1F4BE} Storage state save already in progress, skipping...");
      return;
    }
    this.isSavingStorageState = true;
    this.saveStorageState().then(() => {
      logger.info("\u2705 Storage state auto-saved in background");
    }).catch((error) => {
      logger.warn(`\u26A0\uFE0F  Background storage state save failed: ${error.message}`);
    }).finally(() => {
      this.isSavingStorageState = false;
    });
  }
  /**
   * Send a direct request to save storage state without nested tool calls
   * This is more reliable than calling browser_run_code from within saveStorageState
   */
  async sendDirectStorageStateRequest() {
    try {
      if (!this.storageStatePath) {
        throw new Error("Storage state path not configured");
      }
      const fs6 = await import("fs/promises");
      const path6 = await import("path");
      const dir = path6.dirname(this.storageStatePath);
      await fs6.mkdir(dir, { recursive: true });
      return {
        content: [{
          type: "text",
          text: `\u2705 Storage state will be saved to: ${this.storageStatePath}

Note: The storage state is automatically saved when:
- The browser context closes
- You explicitly save using page.context().storageState()

Storage state path is configured and writable.`
        }]
      };
    } catch (error) {
      throw new Error(`Failed to configure storage state: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  getTools() {
    return this.tools;
  }
  async callTool(toolName, args) {
    if (!this.isReady || !this.process) {
      throw new Error("Playwright process not ready");
    }
    return this.recordingManager.wrapToolExecution(
      toolName,
      args,
      async () => {
        if (toolName === "browser_save_storage_state") {
          const maxRetries = 3;
          let lastError = null;
          for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
              logger.info(`\u{1F4BE} Attempting to save storage state (attempt ${attempt}/${maxRetries})...`);
              await this.saveStorageState();
              if (this.options.storageState && import_fs.default.existsSync(this.options.storageState)) {
                const fileContent = import_fs.default.readFileSync(this.options.storageState, "utf-8");
                const state = JSON.parse(fileContent);
                return {
                  content: [{
                    type: "text",
                    text: `\u2705 Storage state saved successfully to: ${this.options.storageState}

\u{1F4CA} Saved ${state.cookies?.length || 0} cookies and ${state.origins?.length || 0} origins.

The current browser session (cookies, localStorage, sessionStorage) has been persisted. Next time you start the browser with the same --storage-state configuration, you will be automatically authenticated.`
                  }]
                };
              }
            } catch (error) {
              lastError = error;
              logger.warn(`\u26A0\uFE0F  Attempt ${attempt} failed: ${error.message}`);
              if (attempt < maxRetries) {
                const waitTime = Math.min(1e3 * Math.pow(2, attempt - 1), 5e3);
                logger.info(`\u23F3 Waiting ${waitTime}ms before retry...`);
                await new Promise((resolve) => setTimeout(resolve, waitTime));
              }
            }
          }
          return {
            content: [{
              type: "text",
              text: `\u274C Failed to save storage state after ${maxRetries} attempts: ${lastError?.message || "Unknown error"}

\u{1F4A1} Troubleshooting tips:
- Ensure the browser page is loaded and active
- Check that the storage state path is writable
- Try navigating to a page first before saving state
- Verify the Playwright process is responsive`
            }],
            isError: true
          };
        }
        let stepId;
        if (this.shouldRecordAction(toolName) && toolName !== "testAPI") {
          stepId = this.recordingManager.recordStep(toolName, args, this.currentPageContext);
        }
        return new Promise((resolve, reject) => {
          const id = ++this.messageId;
          this.pendingRequests.set(id, {
            resolve: async (result) => {
              if (stepId && this.shouldRecordAction(toolName)) {
                const playwrightCode = this.extractPlaywrightCodeFromResult(result);
                if (playwrightCode) {
                  this.recordingManager.updateStepWithPlaywrightCode(stepId, playwrightCode);
                } else {
                }
              }
              resolve(result);
            },
            reject
          });
          const request = {
            jsonrpc: "2.0",
            id,
            method: "tools/call",
            params: {
              name: toolName,
              arguments: args
            }
          };
          const message = JSON.stringify(request) + "\n";
          this.process.stdin.write(message);
          setTimeout(() => {
            if (this.pendingRequests.has(id)) {
              this.pendingRequests.delete(id);
              if (this.config.verboseLogging) {
                console.error(`\u{1F3AD} Tool call timeout after ${this.config.timeouts.toolCall}ms: ${toolName}`);
              }
              reject(new Error(`Tool call timeout: ${toolName}`));
            }
          }, this.config.timeouts.toolCall);
        });
      }
      // End inner async function
    );
  }
  // NEW: Extract Playwright code from MCP result
  extractPlaywrightCodeFromResult(result) {
    try {
      if (result?.content) {
        for (const item of result.content) {
          if (item.type === "text" && item.text) {
            const patterns = [
              /### Ran Playwright code\s*```js\s*(.*?)\s*```/s,
              /- Ran Playwright code:\s*```js\s*(.*?)\s*```/s,
              /Ran Playwright code\s*```js\s*(.*?)\s*```/s,
              /```js\s*(.*?)\s*```/s
            ];
            for (const pattern of patterns) {
              const match = item.text.match(pattern);
              if (match && match[1]) {
                const code = match[1].trim();
                return code;
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Failed to extract Playwright code:", error);
    }
    return null;
  }
  shouldRecordAction(toolName) {
    const recordableActions = [
      // Core browser actions
      "browser_navigate",
      "browser_navigate_back",
      "browser_click",
      "browser_type",
      "browser_select_option",
      "browser_hover",
      "browser_drag",
      "browser_press_key",
      "browser_resize",
      "browser_file_upload",
      "browser_fill_form",
      "browser_handle_dialog",
      "browser_wait_for",
      "browser_tabs",
      "browser_switch_window",
      "browser_verify_element_visible",
      "browser_verify_text_visible",
      "browser_verify_list_visible"
    ];
    return this.recordingManager.isCurrentlyRecording() && recordableActions.includes(toolName);
  }
  updatePageContext(url, title) {
    if (url) this.currentPageContext.url = url;
    if (title) this.currentPageContext.title = title;
  }
  // Recording management methods
  startRecording(sessionName) {
    return this.recordingManager.startRecording(sessionName, this.options.browser || "chromium");
  }
  stopRecording() {
    return this.recordingManager.stopRecording();
  }
  listRecordings() {
    return this.recordingManager.listSessions();
  }
  getRecording(sessionId) {
    return this.recordingManager.getSession(sessionId);
  }
  isRecording() {
    return this.recordingManager.isCurrentlyRecording();
  }
  getRecordingManager() {
    return this.recordingManager;
  }
  setupProcessCommunication() {
    if (!this.process || !this.process.stdout) return;
    let buffer = "";
    this.process.stdout.on("data", (data) => {
      buffer += data.toString();
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";
      for (const line of lines) {
        if (line.trim()) {
          try {
            const message = JSON.parse(line);
            this.handleMessage(message);
          } catch (error) {
            if (this.config.verboseLogging) {
              console.error("\u{1F4E8} Playwright stdout:", line.trim());
            }
          }
        }
      }
    });
    this.process.stderr?.on("data", (data) => {
      const message = data.toString();
      if (this.config.verboseLogging) {
      }
      if (message.includes("Server ready") || message.includes("listening") || message.includes("MCP server started") || message.includes("Server started")) {
        if (this.config.verboseLogging) {
          console.log("\u2705 Detected Playwright server ready signal");
        }
        this.isReady = true;
      }
    });
    this.process.on("error", (error) => {
      if (this.config.verboseLogging) {
        console.error("\u274C Playwright process error:", error);
      }
      this.isReady = false;
    });
    this.process.on("exit", (code) => {
      if (this.config.verboseLogging) {
        console.error(`\u{1F3AD} Playwright process exited with code ${code}`);
      }
      this.isReady = false;
      for (const [id, { reject }] of this.pendingRequests) {
        reject(new Error("Playwright process exited"));
      }
      this.pendingRequests.clear();
    });
    setTimeout(() => {
      if (!this.isReady) {
        if (this.config.verboseLogging) {
          console.log(`\u23F0 Grace period (${this.config.timeouts.gracePeriod}ms) elapsed, assuming Playwright is ready`);
        }
        this.isReady = true;
      }
    }, this.config.timeouts.gracePeriod);
  }
  handleMessage(message) {
    if (this.config.verboseLogging) {
    }
    if (message.id && this.pendingRequests.has(message.id)) {
      const { resolve, reject } = this.pendingRequests.get(message.id);
      this.pendingRequests.delete(message.id);
      if (message.error) {
        if (this.config.verboseLogging) {
          console.error("\u{1F3AD} Message error:", message.error);
        }
        reject(new Error(message.error.message || "Unknown error"));
      } else {
        if (this.config.verboseLogging) {
        }
        resolve(message.result);
      }
    }
  }
  async waitForReady() {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        if (this.config.verboseLogging) {
          console.error(`\u{1F3AD} Timeout waiting for process ready after ${this.config.timeouts.startup}ms`);
        }
        reject(new Error("Timeout waiting for Playwright process to be ready"));
      }, this.config.timeouts.startup);
      const checkReady = async () => {
        if (this.isReady) {
          clearTimeout(timeout);
          try {
            if (this.config.verboseLogging) {
              console.log("\u{1F9EA} Testing Playwright communication...");
            }
            await this.sendInitializationMessage();
            if (this.config.verboseLogging) {
              console.log("\u2705 Playwright communication test successful");
            }
            resolve();
          } catch (error) {
            if (this.config.verboseLogging) {
              console.error("\u26A0\uFE0F Communication test failed, but continuing anyway:", error);
            }
            resolve();
          }
        } else {
          setTimeout(checkReady, 100);
        }
      };
      checkReady();
    });
  }
  async sendInitializationMessage() {
    if (!this.process || !this.process.stdin) {
      throw new Error("Process not ready");
    }
    const initMessage = {
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: this.options.protocolVersion || "2024-11-05",
        capabilities: {},
        clientInfo: {
          name: "unified-mcp-server",
          version: this.options.version || "1.0.0"
        }
      }
    };
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        if (this.config.verboseLogging) {
          console.error(`\u{1F3AD} Initialize message timeout after ${this.config.timeouts.toolCall}ms`);
        }
        reject(new Error("Initialize message timeout"));
      }, this.config.timeouts.toolCall);
      this.pendingRequests.set(1, {
        resolve: () => {
          clearTimeout(timeout);
          if (this.config.verboseLogging) {
            console.log("\u{1F3AD} Initialize message successful");
          }
          resolve();
        },
        reject: (error) => {
          clearTimeout(timeout);
          if (this.config.verboseLogging) {
            console.error("\u{1F3AD} Initialize message failed:", error);
          }
          reject(error);
        }
      });
      const message = JSON.stringify(initMessage) + "\n";
      if (this.config.verboseLogging) {
      }
      this.process.stdin.write(message);
    });
  }
  async loadTools() {
    try {
      const response = await this.sendRequest("tools/list", {});
      this.tools = response.tools || [];
    } catch (error) {
      console.error("\u274C Failed to load Playwright tools:", error);
      this.tools = [];
    }
  }
  async sendRequest(method, params) {
    return new Promise((resolve, reject) => {
      if (!this.process || !this.isReady) {
        reject(new Error("Playwright process not ready"));
        return;
      }
      const id = ++this.messageId;
      this.pendingRequests.set(id, { resolve, reject });
      const request = {
        jsonrpc: "2.0",
        id,
        method,
        params
      };
      const message = JSON.stringify(request) + "\n";
      this.process.stdin.write(message);
      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          if (this.config.verboseLogging) {
            console.error(`\u{1F3AD} Request timeout after ${this.config.timeouts.toolCall}ms: ${method}`);
          }
          reject(new Error(`Request timeout: ${method}`));
        }
      }, this.config.timeouts.toolCall);
    });
  }
  // Handle testWeb tool directly in Playwright adapter
  async handleTestWeb(args) {
    try {
      const { workflow } = args;
      if (!workflow) {
        return {
          content: [{
            type: "text",
            text: "Error: workflow parameter is required for testWeb tool"
          }],
          isError: true
        };
      }
      const actions = this.parseWebWorkflow(workflow);
      if (actions.length === 0) {
        return {
          content: [{
            type: "text",
            text: "Error: Could not parse workflow steps. Please provide clear instructions like '1. Navigate to URL 2. Click element 3. Fill form' etc."
          }],
          isError: true
        };
      }
      let executionLog = [];
      let stepCount = 0;
      for (const action of actions) {
        stepCount++;
        try {
          let result;
          switch (action.type) {
            case "navigate":
              result = await this.callBrowserTool("browser_navigate", { url: action.url });
              executionLog.push(`Step ${stepCount}: Navigated to ${action.url}`);
              break;
            case "click":
              result = await this.callBrowserTool("browser_click", {
                element: action.element,
                ref: action.ref || action.element
              });
              executionLog.push(`Step ${stepCount}: Clicked ${action.element}`);
              break;
            case "type":
              result = await this.callBrowserTool("browser_type", {
                element: action.element,
                ref: action.ref || action.element,
                text: action.text
              });
              executionLog.push(`Step ${stepCount}: Filled ${action.element} with "${action.text}"`);
              break;
            case "fillForm":
              for (const field of action.fields) {
                await this.callBrowserTool("browser_type", {
                  element: field.selector,
                  ref: field.selector,
                  text: field.value
                });
              }
              executionLog.push(`Step ${stepCount}: Filled form with ${action.fields.length} fields`);
              break;
            case "screenshot":
              result = await this.callBrowserTool("browser_take_screenshot", {});
              executionLog.push(`Step ${stepCount}: Took screenshot`);
              break;
            case "snapshot":
              result = await this.callBrowserTool("browser_snapshot", {});
              executionLog.push(`Step ${stepCount}: Took page snapshot`);
              break;
            case "wait":
              result = await this.callBrowserTool("browser_wait_for", {
                time: action.time || 2,
                text: action.condition
              });
              executionLog.push(`Step ${stepCount}: Waited for ${action.condition || "page to load"}`);
              break;
            default:
              executionLog.push(`Step ${stepCount}: Skipped unknown action type: ${action.type}`);
          }
        } catch (error) {
          executionLog.push(`Step ${stepCount}: Error - ${error.message}`);
        }
      }
      return {
        content: [{
          type: "text",
          text: `Web workflow completed successfully!

Execution Summary:
${executionLog.join("\n")}

Total steps executed: ${stepCount}

Note: All browser actions have been recorded and can be used with #generateScript to create test code.`
        }],
        isError: false
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error executing web workflow: ${error.message}`
        }],
        isError: true
      };
    }
  }
  // Helper method to call browser tools through the MCP process
  async callBrowserTool(toolName, args) {
    const toolMapping = {
      "browser_navigate": "browser_navigate",
      "browser_click": "browser_click",
      "browser_type": "browser_type",
      "browser_take_screenshot": "browser_take_screenshot",
      "browser_snapshot": "browser_snapshot",
      "browser_wait_for": "browser_wait_for",
      "browser_tabs": "browser_tabs",
      "browser_switch_window": "browser_tabs"
    };
    const mcpToolName = toolMapping[toolName] || toolName;
    return new Promise((resolve, reject) => {
      const id = ++this.messageId;
      this.pendingRequests.set(id, { resolve, reject });
      const request = {
        jsonrpc: "2.0",
        id,
        method: "tools/call",
        params: {
          name: mcpToolName,
          arguments: args
        }
      };
      const message = JSON.stringify(request) + "\n";
      this.process.stdin.write(message);
      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          if (this.config.verboseLogging) {
            console.error(`\u{1F3AD} Browser tool call timeout after ${this.config.timeouts.toolCall}ms: ${toolName}`);
          }
          reject(new Error(`Browser tool call timeout: ${toolName}`));
        }
      }, this.config.timeouts.toolCall);
    });
  }
  // Parse natural language workflow into actionable steps
  parseWebWorkflow(workflow) {
    const actions = [];
    const lines = workflow.split("\n").map((line) => line.trim()).filter((line) => line.length > 0);
    for (const line of lines) {
      const lowerLine = line.toLowerCase();
      if (lowerLine.includes("navigate to") || lowerLine.includes("go to") || lowerLine.includes("visit")) {
        const url = this.extractUrl(line);
        if (url) {
          actions.push({ type: "navigate", url });
        }
      } else if (lowerLine.includes("click")) {
        const element = this.extractElementDescription(line);
        actions.push({ type: "click", element: element || "button" });
      } else if (lowerLine.includes("fill") && (lowerLine.includes("form") || lowerLine.includes("field"))) {
        const fields = this.extractFormFields(line);
        if (fields.length > 0) {
          actions.push({ type: "fillForm", fields });
        } else {
          const element = this.extractElementDescription(line);
          const text = this.extractTextValue(line);
          if (element && text) {
            actions.push({ type: "type", element, text });
          }
        }
      } else if (lowerLine.includes("type") || lowerLine.includes("enter") || lowerLine.includes("input")) {
        const element = this.extractElementDescription(line);
        const text = this.extractTextValue(line);
        if (element && text) {
          actions.push({ type: "type", element, text });
        }
      } else if (lowerLine.includes("screenshot") || lowerLine.includes("capture")) {
        actions.push({ type: "screenshot" });
      } else if (lowerLine.includes("snapshot") || lowerLine.includes("see page structure")) {
        actions.push({ type: "snapshot" });
      } else if (lowerLine.includes("wait for")) {
        const condition = this.extractWaitCondition(line);
        actions.push({ type: "wait", condition: condition || "page to load", time: 2 });
      }
    }
    return actions;
  }
  // Helper functions for parsing workflow
  extractUrl(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/i;
    const match = text.match(urlRegex);
    return match ? match[1] : null;
  }
  extractElementDescription(text) {
    const patterns = [
      /click (?:on |the )?(.*?)(?:\s|$)/i,
      /fill (.*?) (?:field|with)/i,
      /(.*?) button/i,
      /(.*?) field/i,
      /(?:the |a )?(.*)/i
    ];
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    return text.trim();
  }
  extractTextValue(text) {
    const patterns = [
      /with ['"]([^'"]+)['"]/i,
      /enter ['"]([^'"]+)['"]/i,
      /type ['"]([^'"]+)['"]/i,
      /value ['"]([^'"]+)['"]/i
    ];
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  }
  extractFormFields(text) {
    const fields = [];
    if (text.includes("username") && text.includes("password")) {
      const usernameMatch = text.match(/username\s+['"]?([^'"]+)['"]?/i);
      const passwordMatch = text.match(/password\s+['"]?([^'"]+)['"]?/i);
      if (usernameMatch) {
        fields.push({ selector: "username field", value: usernameMatch[1] });
      }
      if (passwordMatch) {
        fields.push({ selector: "password field", value: passwordMatch[1] });
      }
    }
    const emailMatch = text.match(/email\s+['"]?([^'"]+)['"]?/i);
    if (emailMatch) {
      fields.push({ selector: "email field", value: emailMatch[1] });
    }
    return fields;
  }
  extractWaitCondition(text) {
    const match = text.match(/wait for (.*?)(?:\s|$)/i);
    return match ? match[1].trim() : null;
  }
};

// src/adapters/appium-process.ts
var import_child_process2 = require("child_process");
var AppiumProcessManager = class {
  // Cache for UI elements
  constructor(options2 = {}, recordingManager) {
    this.options = options2;
    this.recordingManager = recordingManager || new RecordingManager();
    this.recordingManager.registerAdapter({
      platform: "mobile",
      browser: options2.deviceType || "Android",
      device: options2.deviceType === "ios" ? "iOS Device" : "Android Device"
    });
  }
  process = null;
  tools = [];
  isReady = false;
  messageId = 0;
  pendingRequests = /* @__PURE__ */ new Map();
  recordingManager;
  currentContext = { screen: "", app: "" };
  elementCache = [];
  async start() {
    try {
      const args = ["-y", "@mobilenext/mobile-mcp@latest"];
      let command = "npx";
      let spawnArgs = args;
      if (process.platform === "win32") {
        command = "npx.cmd";
      }
      this.process = (0, import_child_process2.spawn)(command, spawnArgs, {
        stdio: ["pipe", "pipe", "pipe"],
        env: {
          ...process.env,
          PATH: process.env.PATH + (process.platform === "win32" ? ";" : ":") + process.env.npm_config_prefix + (process.platform === "win32" ? "\\bin" : "/bin")
        },
        shell: process.platform === "win32"
        // Use shell on Windows
      });
      if (!this.process.stdout || !this.process.stdin) {
        throw new Error("Failed to create mobile-mcp process streams");
      }
      this.setupProcessCommunication();
      await this.waitForReady();
      await this.loadTools();
    } catch (error) {
      console.error("\u274C Failed to start mobile-mcp process:", error);
      if (error.code === "ENOENT") {
        await this.startWithNodeDirectly();
      } else {
        throw error;
      }
    }
  }
  async startWithNodeDirectly() {
    try {
      const mobileMcpPath = require.resolve("@mobilenext/mobile-mcp");
      const args = [mobileMcpPath];
      this.process = (0, import_child_process2.spawn)("node", args, {
        stdio: ["pipe", "pipe", "pipe"],
        env: { ...process.env }
      });
      if (!this.process.stdout || !this.process.stdin) {
        throw new Error("Failed to create mobile-mcp process streams");
      }
      this.setupProcessCommunication();
      await this.waitForReady();
      await this.loadTools();
    } catch (fallbackError) {
      console.error("\u274C Fallback approach also failed:", fallbackError);
      throw new Error(`Failed to start mobile-mcp process: ${fallbackError.message}`);
    }
  }
  async stop() {
    if (this.process) {
      this.process.kill();
      this.process = null;
      this.isReady = false;
    }
  }
  getTools() {
    return this.tools;
  }
  hasTool(name) {
    return this.tools.some((t) => t.name === name);
  }
  async callTool(toolName, args) {
    if (!this.isReady || !this.process) {
      throw new Error("mobile-mcp process not ready");
    }
    return this.recordingManager.wrapToolExecution(
      toolName,
      args,
      async () => {
        if ((toolName === "mobile_click_on_screen_at_coordinates" || toolName === "mobile_double_click_on_screen_at_coordinates" || toolName === "mobile_long_press_on_screen_at_coordinates") && args.x !== void 0 && args.y !== void 0) {
          if (!this.elementCache || this.elementCache.length === 0) {
            console.error("\u{1F4CB} Element cache empty, fetching screen elements for enrichment...");
            try {
              await this.callTool("mobile_list_elements_on_screen", {});
            } catch (error) {
              console.error("\u26A0\uFE0F Failed to fetch elements for enrichment:", error);
            }
          }
          const elementInfo = this.findElementByCoordinates(args.x, args.y);
          if (elementInfo) {
            const foundElement = elementInfo.mobileElement;
            args.elementInfo = {
              ...foundElement,
              // Keep all original properties
              // Add normalized properties
              "resource-id": foundElement.identifier || foundElement["resource-id"],
              "content-desc": foundElement.label || foundElement["content-desc"],
              "class": foundElement.type || foundElement.class,
              "bounds": this.convertCoordinatesToBounds(foundElement.coordinates || foundElement.bounds),
              "text": foundElement.text
            };
            const hasProperIdentifier = args.elementInfo["content-desc"] || args.elementInfo["resource-id"];
            if (!hasProperIdentifier) {
              console.error("\u{1F50D} Element lacks identifier (WebView detected), checking page source for hint/password attributes...");
              try {
                const pageSourceElement = await this.fetchElementAttributesFromPageSource(args.x, args.y);
                if (pageSourceElement) {
                  args.elementInfo = {
                    ...args.elementInfo,
                    hint: pageSourceElement.hint,
                    password: pageSourceElement.password,
                    clickable: pageSourceElement.clickable,
                    enabled: pageSourceElement.enabled,
                    "input-type": pageSourceElement["input-type"]
                  };
                  if (pageSourceElement["content-desc"]) {
                    args.elementInfo["content-desc"] = pageSourceElement["content-desc"];
                  }
                  if (pageSourceElement["resource-id"]) {
                    args.elementInfo["resource-id"] = pageSourceElement["resource-id"];
                  }
                  console.error(`\u2705 Enhanced with page source: hint="${pageSourceElement.hint}", password=${pageSourceElement.password}`);
                }
              } catch (error) {
              }
            }
            args.selector = elementInfo.selector;
            args.humanDescription = elementInfo.humanDescription;
            console.error(`\u2705 Enriched coordinate click (${args.x},${args.y}) with element: ${args.selector}`);
          } else {
            console.error(`\u26A0\uFE0F No element found at coordinates (${args.x}, ${args.y}) - will record coordinates only`);
          }
        }
        let stepId;
        if (this.shouldRecordAction(toolName)) {
          stepId = this.recordingManager.recordStep(toolName, args, this.currentContext);
        }
        return new Promise((resolve, reject) => {
          const id = ++this.messageId;
          this.pendingRequests.set(id, {
            resolve: (result) => {
              if (toolName === "mobile_list_elements_on_screen" && result) {
                this.extractAndCacheElements(result);
              }
              if (stepId && this.shouldRecordAction(toolName)) {
                this.updateRecordedStepWithElementInfo(stepId, result, args);
              }
              resolve(result);
            },
            reject
          });
          const request = {
            jsonrpc: "2.0",
            id,
            method: "tools/call",
            params: {
              name: toolName,
              arguments: args
            }
          };
          const message = JSON.stringify(request) + "\n";
          this.process.stdin.write(message);
          setTimeout(() => {
            if (this.pendingRequests.has(id)) {
              this.pendingRequests.delete(id);
              reject(new Error(`Tool call timeout: ${toolName}`));
            }
          }, 3e4);
        });
      }
      // End inner async function
    );
  }
  /**
   * Extract mobile element information from result and update recorded step
   */
  updateRecordedStepWithElementInfo(stepId, result, args) {
    try {
      if (result && typeof result === "object") {
        let elementData = null;
        if (result.element) {
          elementData = result.element;
        } else if (result.elements && result.elements.length > 0) {
          elementData = result.elements[0];
        } else if (result.data && result.data.element) {
          elementData = result.data.element;
        } else if (result.content && typeof result.content === "string") {
          try {
            const parsed = JSON.parse(result.content);
            if (parsed.element) {
              elementData = parsed.element;
            } else if (parsed.elements && parsed.elements.length > 0) {
              elementData = parsed.elements[0];
            }
          } catch (e) {
          }
        }
        if (elementData) {
          const mobileElement = this.extractMobileElementFromData(elementData);
          if (mobileElement) {
            this.recordingManager.updateStepWithMobileElement(stepId, mobileElement);
          }
        }
      }
    } catch (error) {
      console.error("Error updating recorded step with element info:", error);
    }
  }
  /**
   * Extract elements from mobile_list_elements_on_screen result and populate cache
   * This is CRITICAL for coordinate-based clicks to work properly
   */
  extractAndCacheElements(result) {
    try {
      let elements = [];
      if (result && result.content) {
        const textContent = result.content.find((c) => c.type === "text");
        if (textContent && textContent.text) {
          const text = textContent.text;
          try {
            const parsed = JSON.parse(text);
            if (Array.isArray(parsed)) {
              elements = parsed;
            } else if (parsed.elements && Array.isArray(parsed.elements)) {
              elements = parsed.elements;
            }
          } catch (parseError) {
            elements = this.parseElementsFromText(text);
          }
        }
      } else if (Array.isArray(result)) {
        elements = result;
      } else if (result && result.elements && Array.isArray(result.elements)) {
        elements = result.elements;
      }
      if (elements.length > 0) {
        this.updateElementCache(elements);
        this.recordingManager.updateLastKnownElements(elements);
      }
    } catch (error) {
      console.error("\u274C Error extracting and caching elements:", error);
    }
  }
  /**
   * Extract mobile element properties from element data
   */
  extractMobileElementFromData(elementData) {
    const mobileElement = {};
    if (elementData.attributes) {
      const attrs = elementData.attributes;
      if (attrs["accessibility-id"]) {
        mobileElement.accessibilityId = attrs["accessibility-id"];
      } else if (attrs["content-desc"]) {
        mobileElement.accessibilityId = attrs["content-desc"];
      } else if (attrs.contentDescription) {
        mobileElement.accessibilityId = attrs.contentDescription;
      }
      if (attrs["resource-id"]) {
        mobileElement.resourceId = attrs["resource-id"];
      } else if (attrs.resourceId) {
        mobileElement.resourceId = attrs.resourceId;
      }
      if (attrs.text) {
        mobileElement.text = attrs.text;
      }
      if (attrs.class || attrs.className) {
        mobileElement.className = attrs.class || attrs.className;
      }
      if (attrs.bounds) {
        mobileElement.bounds = attrs.bounds;
      }
      if (attrs.xpath) {
        mobileElement.xpath = attrs.xpath;
      }
    }
    if (elementData.accessibilityId) {
      mobileElement.accessibilityId = elementData.accessibilityId;
    }
    if (elementData.resourceId) {
      mobileElement.resourceId = elementData.resourceId;
    }
    if (elementData.text) {
      mobileElement.text = elementData.text;
    }
    if (elementData.className) {
      mobileElement.className = elementData.className;
    }
    if (elementData.bounds) {
      mobileElement.bounds = elementData.bounds;
    }
    if (elementData.xpath) {
      mobileElement.xpath = elementData.xpath;
    }
    if (Object.keys(mobileElement).length > 0) {
      return mobileElement;
    }
    return null;
  }
  shouldRecordAction(toolName) {
    const recordableActions = [
      // Core mobile actions
      "mobile_open_app",
      "mobile_launch_app",
      "mobile_tap",
      "mobile_click",
      "mobile_click_on_screen_at_coordinates",
      "mobile_click_on_element",
      "mobile_double_click_on_screen_at_coordinates",
      "mobile_long_press_on_screen_at_coordinates",
      "mobile_type",
      "mobile_type_keys",
      "mobile_swipe",
      "mobile_swipe_on_screen",
      "mobile_scroll",
      "mobile_back",
      "mobile_home",
      "mobile_press_button",
      // MCP mobile specific
      "mcp_mobile_tap",
      "mcp_mobile_type",
      "mcp_mobile_swipe",
      // Appium specific
      "appium_tap",
      "appium_type",
      "appium_swipe"
    ];
    return this.recordingManager.isCurrentlyRecording() && recordableActions.includes(toolName);
  }
  updateContext(screen, app) {
    if (screen) this.currentContext.screen = screen;
    if (app) this.currentContext.app = app;
  }
  // Recording management methods
  startRecording(sessionName) {
    return this.recordingManager.startRecording(sessionName, this.options.platform || "android");
  }
  stopRecording() {
    return this.recordingManager.stopRecording();
  }
  listRecordings() {
    return this.recordingManager.listSessions();
  }
  getRecording(sessionId) {
    return this.recordingManager.getSession(sessionId);
  }
  isRecording() {
    return this.recordingManager.isCurrentlyRecording();
  }
  getRecordingManager() {
    return this.recordingManager;
  }
  setupProcessCommunication() {
    if (!this.process || !this.process.stdout) return;
    let buffer = "";
    this.process.stdout.on("data", (data) => {
      buffer += data.toString();
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";
      for (const line of lines) {
        if (line.trim()) {
          try {
            const message = JSON.parse(line);
            this.handleMessage(message);
          } catch (error) {
          }
        }
      }
    });
    this.process.stderr?.on("data", (data) => {
      const message = data.toString();
      if (message.includes("Server ready") || message.includes("listening") || message.includes("MCP server started") || message.includes("Server started") || message.includes("Mobile MCP Server")) {
        this.isReady = true;
      }
    });
    this.process.on("error", (error) => {
      console.error("\u274C mobile-mcp process error:", error);
      this.isReady = false;
    });
    this.process.on("exit", (code) => {
      console.error(`\uFFFD mobile-mcp process exited with code ${code}`);
      this.isReady = false;
      for (const [id, { reject }] of this.pendingRequests) {
        reject(new Error("mobile-mcp process exited"));
      }
      this.pendingRequests.clear();
    });
    setTimeout(() => {
      if (!this.isReady) {
        this.isReady = true;
      }
    }, 3e3);
  }
  handleMessage(message) {
    if (message.id && this.pendingRequests.has(message.id)) {
      const { resolve, reject } = this.pendingRequests.get(message.id);
      this.pendingRequests.delete(message.id);
      if (message.error) {
        console.error(`\u274C Error response for id ${message.id}:`, message.error);
        reject(new Error(message.error.message || "Unknown error"));
      } else {
        resolve(message.result);
      }
    }
  }
  async waitForReady() {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.isReady = true;
        resolve();
      }, 2e4);
      const checkReady = async () => {
        if (this.isReady) {
          clearTimeout(timeout);
          try {
            await this.sendInitializationMessage();
            resolve();
          } catch (error) {
            try {
              await this.loadTools();
              if (this.tools.length > 0) {
                resolve();
              } else {
                resolve();
              }
            } catch (toolError) {
              resolve();
            }
          }
        } else {
          setTimeout(checkReady, 100);
        }
      };
      checkReady();
    });
  }
  async sendInitializationMessage() {
    if (!this.process || !this.process.stdin) {
      throw new Error("Process not ready");
    }
    const initMessage = {
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2024-11-05",
        capabilities: {},
        clientInfo: {
          name: "unified-mcp-server",
          version: "1.0.0"
        }
      }
    };
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Initialize message timeout after 10s"));
      }, 1e4);
      this.pendingRequests.set(1, {
        resolve: () => {
          clearTimeout(timeout);
          resolve();
        },
        reject: (error) => {
          clearTimeout(timeout);
          reject(error);
        }
      });
      const message = JSON.stringify(initMessage) + "\n";
      this.process.stdin.write(message);
    });
  }
  async loadTools() {
    try {
      const response = await this.sendRequest("tools/list", {});
      this.tools = response.tools || [];
    } catch (error) {
      console.error("\u274C Failed to load mobile-mcp tools:", error);
      this.tools = [];
    }
  }
  async sendRequest(method, params) {
    return new Promise((resolve, reject) => {
      if (!this.process) {
        reject(new Error("mobile-mcp process not started"));
        return;
      }
      const id = ++this.messageId;
      this.pendingRequests.set(id, { resolve, reject });
      const request = { jsonrpc: "2.0", id, method, params };
      const message = JSON.stringify(request) + "\n";
      this.process.stdin.write(message);
      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          reject(new Error(`Request timeout: ${method}`));
        }
      }, 15e3);
    });
  }
  /**
   * Get the current screen hierarchy from the device
   * This fetches fresh UI element data from the mobile device
   */
  async getScreenHierarchy() {
    try {
      const result = await this.callTool("mobile_list_elements_on_screen", {
        device: "auto-detect"
        // Let mobile-mcp handle device detection
      });
      if (result && result.content) {
        const textContent = result.content.find((c) => c.type === "text");
        if (textContent && textContent.text) {
          try {
            return JSON.parse(textContent.text);
          } catch (e) {
            console.error("Failed to parse screen hierarchy:", e);
            return [];
          }
        }
      }
      return [];
    } catch (error) {
      console.error("Failed to get screen hierarchy:", error);
      return [];
    }
  }
  /**
   * Update the internal element cache with fresh UI hierarchy data
   * @param hierarchy - The UI hierarchy data (array of elements)
   */
  updateElementCache(hierarchy) {
    if (Array.isArray(hierarchy)) {
      this.elementCache = hierarchy;
    } else if (hierarchy && typeof hierarchy === "object") {
      if (Array.isArray(hierarchy.elements)) {
        this.elementCache = hierarchy.elements;
      } else {
        this.elementCache = [hierarchy];
      }
    }
  }
  /**
   * Find an element in the cache by screen coordinates
   * @param x - X coordinate
   * @param y - Y coordinate
   * @returns The element at the coordinates, or null if not found
   */
  findElementByCoordinates(x, y) {
    if (!this.elementCache || this.elementCache.length === 0) {
      return null;
    }
    for (let i = 0; i < this.elementCache.length; i++) {
      const element = this.elementCache[i];
      if (this.isPointInElement(x, y, element)) {
        return {
          selector: this.generateSelectorForElement(element),
          humanDescription: this.generateHumanDescription(element),
          mobileElement: element,
          coordinates: { x, y }
        };
      }
    }
    return null;
  }
  /**
   * Check if a point (x, y) is within an element's bounds
   */
  isPointInElement(x, y, element) {
    let bounds = element.bounds || element.rect || element.coordinates;
    if (!bounds) {
      return false;
    }
    if (bounds.x !== void 0 && bounds.y !== void 0 && bounds.width !== void 0 && bounds.height !== void 0) {
      return x >= bounds.x && x <= bounds.x + bounds.width && y >= bounds.y && y <= bounds.y + bounds.height;
    }
    if (bounds.left !== void 0 && bounds.top !== void 0 && bounds.right !== void 0 && bounds.bottom !== void 0) {
      return x >= bounds.left && x <= bounds.right && y >= bounds.top && y <= bounds.bottom;
    }
    if (typeof bounds === "string") {
      try {
        const match = bounds.match(/\[(\d+),(\d+)\]\[(\d+),(\d+)\]/);
        if (match) {
          const [_, left, top, right, bottom] = match.map(Number);
          return x >= left && x <= right && y >= top && y <= bottom;
        }
      } catch (e) {
      }
    }
    return false;
  }
  /**
   * Convert coordinates object to bounds string format
   * Converts {x, y, width, height} to [left,top][right,bottom] format
   */
  convertCoordinatesToBounds(coords) {
    if (!coords) return void 0;
    if (typeof coords === "string") return coords;
    if (coords.x !== void 0 && coords.y !== void 0 && coords.width !== void 0 && coords.height !== void 0) {
      return `[${coords.x},${coords.y}][${coords.x + coords.width},${coords.y + coords.height}]`;
    }
    if (coords.left !== void 0 && coords.top !== void 0 && coords.right !== void 0 && coords.bottom !== void 0) {
      return `[${coords.left},${coords.top}][${coords.right},${coords.bottom}]`;
    }
    return void 0;
  }
  /**
   * Fetch element attributes from page source XML (WebView fallback)
   * Only called when element lacks proper identifiers (no content-desc, no resource-id)
   * Extracts WebView-specific attributes: hint, password, input-type, etc.
   */
  async fetchElementAttributesFromPageSource(x, y) {
    try {
      if (!this.hasTool("mobile_get_source") && !this.hasTool("mobile_get_page_source")) {
        return null;
      }
      console.error(`\u{1F50D} Fetching page source to extract WebView element attributes at (${x}, ${y})...`);
      const toolName = this.hasTool("mobile_get_source") ? "mobile_get_source" : "mobile_get_page_source";
      const result = await this.callToolInternal(toolName, {});
      if (!result || !result.content || result.content.length === 0) {
        console.error("\u26A0\uFE0F Page source is empty or unavailable");
        return null;
      }
      const pageSourceXml = result.content[0].text || "";
      if (!pageSourceXml) {
        console.error("\u26A0\uFE0F Page source text is empty");
        return null;
      }
      const element = await findElementInPageSource(pageSourceXml, x, y);
      if (element) {
        console.error(`\u2705 Page source enrichment successful: hint="${element.hint}", password=${element.password}, class="${element.class}"`);
      }
      return element;
    } catch (error) {
      console.error("\u274C Failed to fetch element attributes from page source:", error);
      return null;
    }
  }
  /**
   * Internal call to mobile-mcp tool without recording
   * Used for page source fetching to avoid infinite recursion
   */
  async callToolInternal(toolName, args) {
    if (!this.isReady || !this.process) {
      throw new Error("mobile-mcp process not ready");
    }
    const id = ++this.messageId;
    const message = {
      jsonrpc: "2.0",
      id,
      method: "tools/call",
      params: {
        name: toolName,
        arguments: args
      }
    };
    return new Promise((resolve, reject) => {
      this.pendingRequests.set(id, { resolve, reject });
      this.process.stdin.write(JSON.stringify(message) + "\n");
      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          reject(new Error(`Tool call timeout: ${toolName}`));
        }
      }, 6e4);
    });
  }
  /**
   * Generate a selector string for an element using locatorStrategyUtils
   * This uses the SAME logic as code generation for consistency
   */
  generateSelectorForElement(element) {
    const viewNode = {
      identifier: element.identifier || element["resource-id"] || element.resourceId,
      name: element.text,
      type: element.type || element.className || element.class,
      bounds: this.convertCoordinatesToBounds(element.coordinates || element.bounds),
      "content-desc": element.label || element["content-desc"],
      contentDescription: element.label || element["content-desc"],
      accessibilityLabel: element.label || element["content-desc"] || element.accessibilityId,
      label: element.label || element["content-desc"] || element.accessibilityId
    };
    const strategies = generateLocators(viewNode);
    const bestStrategy = pickBestLocator(strategies);
    if (!bestStrategy) {
      return "unknown";
    }
    return this.strategyToAppiumSelector(bestStrategy);
  }
  /**
   * Convert a LocatorStrategy to Appium selector string format
   */
  strategyToAppiumSelector(strategy) {
    switch (strategy.by) {
      case "accessibilityId":
        return `~${strategy.value}`;
      case "id":
        return `id:${strategy.value}`;
      case "xpath":
        return strategy.value;
      default:
        return "unknown";
    }
  }
  /**
   * Generate a human-readable description of an element
   */
  generateHumanDescription(element) {
    const parts = [];
    if (element.text) {
      parts.push(`"${element.text}"`);
    }
    if (element["content-desc"] || element.accessibilityId) {
      parts.push(`(${element["content-desc"] || element.accessibilityId})`);
    }
    const type = element.className || element.class || element.type;
    if (type) {
      const simpleName = type.split(".").pop() || type;
      parts.push(simpleName);
    }
    return parts.length > 0 ? parts.join(" ") : "Unknown element";
  }
  /**
   * Get the current activity name (Android) or screen name (iOS)
   */
  async getCurrentActivity() {
    return this.currentContext.screen || "Unknown";
  }
  /**
   * Get the current page title or app name
   */
  async getPageTitle() {
    return this.currentContext.app || "Unknown";
  }
  /**
   * Click at specific coordinates
   */
  async click(x, y) {
    await this.callTool("mobile_click_on_screen_at_coordinates", { x, y });
  }
  /**
   * Double click at specific coordinates
   */
  async doubleClick(x, y) {
    await this.callTool("mobile_double_click_on_screen_at_coordinates", { x, y });
  }
  /**
   * Long press at specific coordinates
   */
  async longPress(x, y, duration = 1e3) {
    await this.callTool("mobile_long_press_on_screen_at_coordinates", { x, y, duration });
  }
  /**
   * Parse elements from formatted text response (when JSON parsing fails)
   * Mobile-mcp returns: "Found these elements on screen: [{...}, {...}]"
   */
  parseElementsFromText(text) {
    const elements = [];
    try {
      const jsonStartIndex = text.indexOf("[");
      if (jsonStartIndex === -1) {
        return elements;
      }
      const jsonPart = text.substring(jsonStartIndex);
      const parsed = JSON.parse(jsonPart);
      if (!Array.isArray(parsed)) {
        return elements;
      }
      for (const elem of parsed) {
        const coordinates = elem.coordinates || {};
        const x = coordinates.x || 0;
        const y = coordinates.y || 0;
        const width = coordinates.width || 0;
        const height = coordinates.height || 0;
        const element = {
          type: elem.type,
          text: elem.text || "",
          label: elem.label || "",
          resourceId: elem.identifier || "",
          accessibilityId: elem.label || "",
          className: elem.type,
          // CRITICAL FIX: Use {x, y, width, height} format to match isPointInElement() check
          // Previous: {x1, y1, x2, y2} which was never matched!
          bounds: {
            x,
            y,
            width,
            height
          },
          center: {
            x: x + width / 2,
            y: y + height / 2
          },
          coordinates
        };
        elements.push(element);
      }
    } catch (error) {
    }
    return elements;
  }
};

// src/prompts/index.ts
var ALL_PROMPTS = [
  // executeAndFixPrompt, // COMMENTED OUT: Prompt not working as expected - agent not following MCP execution instructions
  // Add more prompts here as you create them
];
function getPromptByName(name) {
  return ALL_PROMPTS.find((p) => p.name === name);
}
function renderPrompt(prompt, args) {
  const messages = prompt.getMessages(args);
  return {
    description: prompt.description,
    messages
  };
}

// src/unified-server.ts
var UnifiedMCPServer = class {
  constructor(options2 = {}) {
    this.options = options2;
    this.mobileArgs = this.parseMobileArgsFromProcess();
    this.options.executionType = this.options.executionType || this.mobileArgs.executionType;
    this.options.cloudProvider = this.options.cloudProvider || this.mobileArgs.cloudProvider;
    this.options.deviceType = this.options.deviceType || this.mobileArgs.deviceType;
    this.options.appPath = this.options.appPath || this.mobileArgs.appPath;
    this.options.enablePlaywrightTools = this.options.enablePlaywrightTools ?? true;
    this.options.enableMobileTools = this.options.enableMobileTools ?? true;
    this.options.enableCustomTools = this.options.enableCustomTools ?? true;
    this.recordingManager = new RecordingManager();
    this.apiAdapter = new APIAdapter(this.recordingManager);
    this.playwrightManager = new PlaywrightProcessManager({
      ...options2,
      version: "0.0.47",
      verboseLogging: true,
      timeouts: {
        startup: 35e3,
        toolCall: 6e4
      },
      // Pass through Playwright v0.0.47 features
      storageState: options2.storageState,
      userDataDir: options2.userDataDir
    }, this.recordingManager);
    const platform = this.options.deviceType === "ios" ? "ios" : "android";
    this.appiumManager = new AppiumProcessManager({ platform }, this.recordingManager);
    console.error(`[MCP Args] executionType=${this.options.executionType || ""}, cloudProvider=${this.options.cloudProvider || ""}, deviceType=${this.options.deviceType || ""}, appPath=${this.options.appPath || ""}`);
    console.error(`[Tool Sources] Playwright=${this.options.enablePlaywrightTools}, Mobile=${this.options.enableMobileTools}, Custom=${this.options.enableCustomTools}`);
  }
  server;
  apiAdapter;
  playwrightManager;
  appiumManager;
  recordingManager;
  // Shared RecordingManager
  allTools = [];
  allPrompts = [];
  Server;
  StdioServerTransport;
  CallToolRequestSchema;
  ListToolsRequestSchema;
  ListPromptsRequestSchema;
  GetPromptRequestSchema;
  // Hold parsed mobile args from mcp.json args
  mobileArgs = {};
  getArgValue(flag) {
    const idx = process.argv.findIndex((a) => a === flag);
    if (idx !== -1 && process.argv.length > idx + 1) {
      return process.argv[idx + 1];
    }
    return void 0;
  }
  parseMobileArgsFromProcess() {
    return {
      executionType: this.getArgValue("--executionType"),
      cloudProvider: this.getArgValue("--cloudProvider"),
      deviceType: this.getArgValue("--deviceType"),
      appPath: this.getArgValue("--appPath")
    };
  }
  async initializeMCP() {
    const { Server: Server2 } = await Promise.resolve().then(() => (init_server(), server_exports));
    const { StdioServerTransport: StdioServerTransport2 } = await Promise.resolve().then(() => (init_stdio2(), stdio_exports));
    const {
      CallToolRequestSchema: CallToolRequestSchema2,
      ListToolsRequestSchema: ListToolsRequestSchema2,
      ListPromptsRequestSchema: ListPromptsRequestSchema2,
      GetPromptRequestSchema: GetPromptRequestSchema2
    } = await Promise.resolve().then(() => (init_types2(), types_exports));
    this.Server = Server2;
    this.StdioServerTransport = StdioServerTransport2;
    this.CallToolRequestSchema = CallToolRequestSchema2;
    this.ListToolsRequestSchema = ListToolsRequestSchema2;
    this.ListPromptsRequestSchema = ListPromptsRequestSchema2;
    this.GetPromptRequestSchema = GetPromptRequestSchema2;
    this.server = new this.Server(
      { name: "unified-mcp-server", version: "1.0.0" },
      {
        capabilities: {
          tools: {}
          // prompts: {  // COMMENTED OUT: Prompts disabled
          //   listChanged: true
          // }
        }
      }
    );
  }
  async start() {
    console.error("\u{1F527} Initializing Unified MCP Server...");
    try {
      await this.initializeMCP();
      await this.apiAdapter.initialize(this.playwrightManager, this.appiumManager);
      const playwrightTools = [];
      const mobileTools = [];
      if (this.options.enablePlaywrightTools) {
        await this.playwrightManager.start();
        const tools = await this.playwrightManager.getTools();
        playwrightTools.push(...tools);
        console.error(`\u{1F3AD} Playwright Tools: ${playwrightTools.length}`);
      } else {
        console.error("\u23ED\uFE0F  Playwright tools disabled (to enable, set enablePlaywrightTools: true)");
      }
      if (this.options.enableMobileTools) {
        await this.appiumManager.start();
        const tools = await this.appiumManager.getTools();
        mobileTools.push(...tools);
        console.error(`\u{1F4F1} Mobile Tools: ${mobileTools.length}`);
      } else {
        console.error("\u23ED\uFE0F  Mobile tools disabled (to enable, set enableMobileTools: true)");
      }
      const apiTools = this.options.enableCustomTools ? this.apiAdapter.getTools() : [];
      if (this.options.enableCustomTools) {
        console.error(`\u{1F4CA} Custom Tools: ${apiTools.length}`);
      } else {
        console.error("\u23ED\uFE0F  Custom tools disabled");
      }
      this.allTools = [...apiTools, ...playwrightTools, ...mobileTools];
      const MCP_TOOL_LIMIT = 128;
      if (this.allTools.length > MCP_TOOL_LIMIT) {
        console.error(`\u26A0\uFE0F  WARNING: Tool count (${this.allTools.length}) exceeds MCP limit of ${MCP_TOOL_LIMIT}!`);
        console.error(`\u26A0\uFE0F  Automatically truncating to ${MCP_TOOL_LIMIT} tools...`);
        console.error(`\u26A0\uFE0F  Priority: Custom (${apiTools.length}) \u2192 Mobile (${mobileTools.length}) \u2192 Playwright (${playwrightTools.length})`);
        this.allTools = this.allTools.slice(0, MCP_TOOL_LIMIT);
        console.error(`\u2702\uFE0F  Truncated to ${this.allTools.length} tools`);
      }
      console.error(`\u{1F6E0}\uFE0F Total Tools Available: ${this.allTools.length}`);
      this.setupRequestHandlers();
      console.error("\u{1F50C} Connecting to MCP transport...");
      const transport = new this.StdioServerTransport();
      transport.onerror = (error) => {
        console.error("\u274C MCP Transport error:", error);
      };
      await this.server.connect(transport);
      console.error("\u2705 MCP server connected successfully");
    } catch (error) {
      console.error("Failed to start Unified MCP Server:", error);
      throw error;
    }
  }
  async stop() {
    console.error("\u{1F6D1} Stopping Unified MCP Server...");
    if (this.playwrightManager) {
      await this.playwrightManager.stop();
    }
    if (this.appiumManager) {
      await this.appiumManager.stop();
    }
    await this.server.close();
  }
  setupRequestHandlers() {
    this.server.setRequestHandler(this.ListToolsRequestSchema, async () => {
      console.error("\u{1F4CB} Listing tools...");
      return { tools: this.allTools };
    });
    this.server.setRequestHandler(this.CallToolRequestSchema, async (request) => {
      const toolName = request.params?.name || "unknown";
      const args = request.params?.arguments || {};
      console.error(`\u{1F527} [START] Calling tool: ${toolName} with args:`, JSON.stringify(args).substring(0, 100));
      try {
        if (!request.params || !request.params.name) {
          throw new Error("Invalid request: missing tool name");
        }
        if (!this.apiAdapter || !this.playwrightManager || !this.appiumManager) {
          throw new Error("Server managers not fully initialized");
        }
        let result;
        if (this.appiumManager && typeof this.appiumManager.hasTool === "function" && this.appiumManager.hasTool(toolName)) {
          result = await Promise.race([
            this.appiumManager.callTool(toolName, args),
            new Promise(
              (_, reject) => setTimeout(() => reject(new Error("Tool call timeout (60s)")), 6e4)
            )
          ]);
        } else if (this.playwrightManager && typeof this.playwrightManager.hasTool === "function" && this.playwrightManager.hasTool(toolName)) {
          result = await Promise.race([
            this.playwrightManager.callTool(toolName, args),
            new Promise(
              (_, reject) => setTimeout(() => reject(new Error("Tool call timeout (60s)")), 6e4)
            )
          ]);
        } else if (this.apiAdapter && typeof this.apiAdapter.getTools === "function" && this.apiAdapter.getTools().some((t) => t.name === toolName)) {
          result = await Promise.race([
            this.apiAdapter.callTool(toolName, args),
            new Promise(
              (_, reject) => setTimeout(() => reject(new Error("Tool call timeout (60s)")), 6e4)
            )
          ]);
        } else if (toolName.startsWith("browser_")) {
          result = await Promise.race([
            this.playwrightManager.callTool(toolName, args),
            new Promise(
              (_, reject) => setTimeout(() => reject(new Error("Tool call timeout (60s)")), 6e4)
            )
          ]);
        } else if (toolName.toLowerCase().includes("api") || toolName === "generateCypressScript" || toolName === "generatePlaywrightScript" || toolName.includes("Mobile") || toolName.includes("Java") || toolName.includes("TestNG") || toolName === "generateAppiumTest") {
          result = await Promise.race([
            this.apiAdapter.callTool(toolName, args),
            new Promise(
              (_, reject) => setTimeout(() => reject(new Error("Tool call timeout (60s)")), 6e4)
            )
          ]);
        } else {
          throw new Error(`Unknown tool: ${toolName}`);
        }
        if (!result || typeof result !== "object") {
          console.error(`\u26A0\uFE0F Invalid result structure from ${toolName}:`, typeof result);
          throw new Error("Invalid tool result: must be an object");
        }
        console.error(`\u2705 [SUCCESS] Tool ${toolName} executed successfully`);
        result = this.truncateLargeResponse(result, toolName);
        const formattedResult = {
          content: Array.isArray(result.content) ? result.content : [
            {
              type: "text",
              text: typeof result === "string" ? result : JSON.stringify(result)
            }
          ],
          isError: result.isError || false
        };
        console.error(`\u{1F527} [END] Returning result for ${toolName}`);
        return formattedResult;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const errorStack = error instanceof Error ? error.stack : void 0;
        console.error(`\u274C [ERROR] Tool execution failed for ${toolName}:`, errorMessage);
        if (errorStack) {
          console.error("Stack trace:", errorStack);
        }
        const errorResult = {
          content: [
            {
              type: "text",
              text: `Error executing ${toolName}: ${errorMessage}

Please try again or check the server logs for details.`
            }
          ],
          isError: true
        };
        console.error(`\u{1F527} [END ERROR] Returning error for ${toolName}`);
        return errorResult;
      }
    });
  }
  truncateLargeResponse(result, toolName) {
    const MAX_TEXT_LENGTH = 5e4;
    const MAX_TOTAL_SIZE = 1e5;
    if (!result || !result.content) return result;
    let totalSize = 0;
    const truncatedContent = result.content.map((item, index) => {
      if (item.type === "text" && item.text) {
        const textSize = item.text.length;
        totalSize += textSize;
        if (textSize > MAX_TEXT_LENGTH) {
          const truncatedText = item.text.substring(0, MAX_TEXT_LENGTH);
          const elementCount = (item.text.match(/<[^>]+>/g) || []).length;
          if (!toolName.toLowerCase().includes("screenshot")) {
            console.error(`\u26A0\uFE0F Truncated large response from ${toolName}: ${textSize} -> ${MAX_TEXT_LENGTH} chars (${elementCount} elements)`);
          }
          return {
            ...item,
            text: truncatedText + `

... [Response truncated: ${textSize - MAX_TEXT_LENGTH} characters omitted. Original had ~${elementCount} UI elements. Consider using more specific selectors or querying smaller parts of the UI hierarchy.]`
          };
        }
      } else if (item.type === "image" && item.data) {
        const imageSize = item.data.length;
        totalSize += imageSize;
        if (imageSize > MAX_TEXT_LENGTH) {
          if (!toolName.toLowerCase().includes("screenshot")) {
            console.error(`\u26A0\uFE0F Large image response from ${toolName}: ${imageSize} chars`);
          }
        }
      }
      return item;
    });
    if (totalSize > MAX_TOTAL_SIZE) {
      if (!toolName.toLowerCase().includes("screenshot")) {
        console.error(`\u26A0\uFE0F Total response too large from ${toolName}: ${totalSize} chars, limiting to first items`);
      }
      let cumulativeSize = 0;
      const limitedContent = [];
      for (const item of truncatedContent) {
        const itemSize = item.text ? item.text.length : item.data ? item.data.length : 0;
        if (cumulativeSize + itemSize > MAX_TOTAL_SIZE) break;
        limitedContent.push(item);
        cumulativeSize += itemSize;
      }
      if (limitedContent.length < truncatedContent.length) {
        limitedContent.push({
          type: "text",
          text: `
[${truncatedContent.length - limitedContent.length} additional items omitted due to size constraints]`
        });
      }
      return {
        ...result,
        content: limitedContent
      };
    }
    return {
      ...result,
      content: truncatedContent
    };
  }
  setupPromptHandlers() {
    this.server.setRequestHandler(this.ListPromptsRequestSchema, async () => {
      console.error("\u{1F4CB} Listing prompts...");
      return { prompts: this.allPrompts };
    });
    this.server.setRequestHandler(this.GetPromptRequestSchema, async (request) => {
      const promptName = request.params.name;
      const args = request.params.arguments || {};
      console.error(`\u{1F4AC} Getting prompt: ${promptName}`);
      try {
        const prompt = getPromptByName(promptName);
        if (!prompt) {
          throw new Error(`Prompt not found: ${promptName}`);
        }
        const rendered = renderPrompt(prompt, args);
        return rendered;
      } catch (error) {
        console.error(`\u274C Prompt retrieval failed: ${error}`);
        throw error;
      }
    });
  }
};

// src/index.ts
var import_os = __toESM(require("os"), 1);
var import_crypto = __toESM(require("crypto"), 1);
function getLicenseKeyFromConfig() {
  const licenseArgIndex = process.argv.findIndex((arg) => arg === "--licensekey");
  if (licenseArgIndex !== -1 && process.argv.length > licenseArgIndex + 1) {
    const licenseKey = process.argv[licenseArgIndex + 1].trim();
    console.error("\u{1F535} License key found in arguments");
    return licenseKey;
  }
  console.error("\u{1F534} License key not found in arguments");
  return null;
}
function validateLicenseKey() {
  console.error("\u{1F50D} Starting license validation...");
  const licenseKey = getLicenseKeyFromConfig();
  if (!licenseKey) {
    throw new Error("Missing license key. Please provide a valid license key.");
  }
  console.error("\u{1F4DD} Received license key:", licenseKey);
  try {
    const [dataBase64, signature] = licenseKey.split(".");
    if (!dataBase64 || !signature) {
      throw new Error("Invalid license key format");
    }
    const data = Buffer.from(dataBase64, "base64").toString();
    const [identifier, expiresAt] = data.split("|");
    console.error("\u{1F4BB} License details:", {
      identifier,
      expiresAt: new Date(parseInt(expiresAt)).toLocaleString()
    });
    const username = import_os.default.userInfo().username;
    const hostname = import_os.default.hostname();
    const currentIdentifier = `${username}@${hostname}`;
    console.error("\u{1F4BB} Current machine identifier:", currentIdentifier);
    const secret = "your-secret-key";
    const expectedSignature = import_crypto.default.createHmac("sha256", secret).update(data).digest("hex");
    if (signature !== expectedSignature) {
      throw new Error("Invalid license signature");
    }
    if (identifier !== currentIdentifier) {
      throw new Error("License is not valid for this machine");
    }
    const now = Date.now();
    if (now > parseInt(expiresAt)) {
      throw new Error(`License expired on ${new Date(parseInt(expiresAt)).toLocaleString()}`);
    }
    const daysRemaining = Math.ceil((parseInt(expiresAt) - now) / (1e3 * 60 * 60 * 24));
    if (daysRemaining <= 7) {
      console.error(`\u26A0\uFE0F WARNING: License will expire in ${daysRemaining} days`);
    }
    console.error("\u2705 License validated successfully");
  } catch (error) {
    console.error("\u274C License validation failed:", error.message);
    throw new Error("Invalid license key: " + error.message);
  }
}
import_commander.program.name("unified-mcp-server").description("Unified MCP Server with Browser and API tools").version("1.0.0").option("--head", "run browser in headed mode").option("--browser <browser>", "browser to use (chromium, firefox, webkit)", "chromium").option("--isolated", "run browser in isolated mode").option("--port <port>", "port for HTTP transport (optional)").option("--licensekey <licensekey>", "license key for authentication").option("--loglevel <level>", "log level (error, warn, info, debug)", "error").option("--executionType <type>", "execution type (local, cloud)", "local").option("--cloudProvider <provider>", "cloud provider (headspin, browserstack, saucelabs)", "").option("--deviceType <type>", "device type (android, ios)", "android").option("--appPath <path>", "path to mobile app file (.apk or .ipa)", "").option("--enable-mobile", "enable mobile/appium tools (default: true)").option("--enable-playwright", "enable playwright browser tools (default: true)").option("--enable-custom", "enable custom API/test generation tools (default: true)").option("--storage-state <path>", "path to storage state JSON file (cookies, localStorage)").option("--user-data-dir <path>", "path to persistent browser profile directory").parse();
var options = import_commander.program.opts();
function setLogLevel(level) {
  const normalizedLevel = level.toLowerCase();
  switch (normalizedLevel) {
    case "error":
      logger.setLogLevel(0 /* ERROR */);
      break;
    case "warn":
      logger.setLogLevel(1 /* WARN */);
      break;
    case "info":
      logger.setLogLevel(2 /* INFO */);
      break;
    case "debug":
      logger.setLogLevel(3 /* DEBUG */);
      break;
    default:
      console.error(`\u26A0\uFE0F Invalid log level: ${level}. Using default 'error' level.`);
      logger.setLogLevel(0 /* ERROR */);
  }
  console.error(`\u{1F4CA} Log level set to: ${normalizedLevel}`);
}
async function main() {
  setLogLevel(options.loglevel || "error");
  console.error("\u{1F680} Starting Unified MCP Server...");
  try {
    const server = new UnifiedMCPServer({
      headless: !options.head,
      browser: options.browser,
      isolated: options.isolated,
      port: options.port ? parseInt(options.port) : void 0,
      // Mobile testing options
      executionType: options.executionType,
      cloudProvider: options.cloudProvider,
      deviceType: options.deviceType,
      appPath: options.appPath,
      // Tool source toggles
      enablePlaywrightTools: options.enablePlaywright,
      enableMobileTools: options.enableMobile !== false,
      // default true unless explicitly disabled
      enableCustomTools: options.enableCustom !== false,
      // default true unless explicitly disabled
      // Playwright v0.0.47 features
      storageState: options.storageState,
      userDataDir: options.userDataDir
    });
    await server.start();
    console.error("\u2705 Unified MCP Server started successfully");
    process.on("uncaughtException", (error) => {
      console.error("\u274C Uncaught Exception:", error);
    });
    process.on("unhandledRejection", (reason, promise) => {
      console.error("\u274C Unhandled Rejection at:", promise, "reason:", reason);
    });
    process.on("SIGINT", async () => {
      console.error("\u{1F6D1} Shutting down Unified MCP Server...");
      await server.stop();
      process.exit(0);
    });
  } catch (error) {
    console.error("\u{1F4A5} Failed to start Unified MCP Server:", error);
    process.exit(1);
  }
}
main().catch(console.error);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  validateLicenseKey
});
/*! Bundled license information:

sax/lib/sax.js:
  (*! http://mths.be/fromcodepoint v0.1.0 by @mathias *)
*/
