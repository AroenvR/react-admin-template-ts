import { isTruthy } from "../util/util";

describe("isTruthy", () => {

    test('handles TRUTHY  data correctly', () => {
        let truthyBool: boolean = true;
        let truthyNumber: number = 1;
        let shouldBeTruthyNumber: number = 0;
        let truthyString: string = "foo";
        let truthyObject: object = { id: 1, data: "bar" };
        let truthyArray: Array<number> = [1, 2, 3];
        let truthyTwoDArray: Array<number[]> = [[], [], [], [1], []];
        let truthyMultiDArray: Array<any[]> = [ [[], [[], []], []], [[], [[], [[]]], [truthyObject]] ];

        expect(isTruthy(truthyBool)).toEqual(true);
        expect(isTruthy(truthyNumber)).toEqual(true);
        expect(isTruthy(shouldBeTruthyNumber)).toEqual(true);
        expect(isTruthy(truthyString)).toEqual(true);
        expect(isTruthy(truthyObject)).toEqual(true);
        expect(isTruthy(truthyArray)).toEqual(true);
        expect(isTruthy(truthyTwoDArray)).toEqual(true);
        expect(isTruthy(truthyMultiDArray)).toEqual(true);
    });

    // --------------------------------------------------

    test('handles FALSY data correctly', () => {
        let falsyBool: boolean = false;
        let falsyString: string = "";
        let falsyObject: object = {};
        let emptyArray: Array<any> = [];
        let emptyTwoDArray: Array<any[]> = [[], [], []];
        let undef = undefined;
        let nul = null;
        let notANumber = NaN;
        let emptyMultiDArray: Array<any[]> = [ [[falsyBool], [[falsyString]], [falsyObject], emptyTwoDArray], [[undef], [[[nul]]], [notANumber]] ];

        expect(isTruthy(falsyBool)).toEqual(false);
        expect(isTruthy(falsyString)).toEqual(false);
        expect(isTruthy(falsyObject)).toEqual(false);
        expect(isTruthy(emptyArray)).toEqual(false);
        expect(isTruthy(emptyTwoDArray)).toEqual(false);
        expect(isTruthy(emptyMultiDArray)).toEqual(false);
        expect(isTruthy(undef)).toEqual(false);
        expect(isTruthy(nul)).toEqual(false);
        expect(isTruthy(notANumber)).toEqual(false);
    });

});