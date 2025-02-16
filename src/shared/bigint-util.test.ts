import { bigIntReplacer, convertBigIntToString } from "./bigint-util"

const BIG_INT_VALUE = BigInt(10 ** 20)
const BIG_INT_STRING_VALUE = "100000000000000000000"

describe("bigIntReplacer", () => {
	it("should convert bigint to string", () => {
		const sut = {
			key: BIG_INT_VALUE,
			nestedKey: {
				key: BIG_INT_VALUE,
			},
		}
		const result = JSON.stringify(sut, bigIntReplacer)
		expect(result).toBe(`{"key":"${BIG_INT_STRING_VALUE}","nestedKey":{"key":"${BIG_INT_STRING_VALUE}"}}`)
	})

	it("should return value as is if not a bigint", () => {
		const sut = {
			key: 100,
		}
		const result = JSON.stringify(sut, bigIntReplacer)
		expect(result).toBe('{"key":100}')
	})
})

describe("convertBigIntToString", () => {
	it("should convert bigint to string", () => {
		const result = convertBigIntToString(BIG_INT_VALUE)
		expect(result).toBe(BIG_INT_STRING_VALUE)
	})

	it("should convert bigint in array to string", () => {
		const result = convertBigIntToString([BIG_INT_VALUE, 123])
		expect(result).toEqual([BIG_INT_STRING_VALUE, 123])
	})

	it("should convert bigint in object to string", () => {
		const result = convertBigIntToString({ key: BIG_INT_VALUE, anotherKey: 123 })
		expect(result).toEqual({ key: BIG_INT_STRING_VALUE, anotherKey: 123 })
	})

	it("should handle nested structures", () => {
		const data = {
			key: BIG_INT_VALUE,
			nested: {
				anotherKey: BIG_INT_VALUE,
				array: [BIG_INT_VALUE, 123],
			},
		}
		const expected = {
			key: BIG_INT_STRING_VALUE,
			nested: {
				anotherKey: BIG_INT_STRING_VALUE,
				array: [BIG_INT_STRING_VALUE, 123],
			},
		}
		const result = convertBigIntToString(data)
		expect(result).toEqual(expected)
	})

	it("should return non-bigint values as is", () => {
		const result = convertBigIntToString(123)
		expect(result).toBe(123)
	})
})
