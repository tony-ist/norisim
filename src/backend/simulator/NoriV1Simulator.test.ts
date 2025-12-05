import { describe, expect, it } from "vitest";
import { defaultNoriV1SimulatorState, NoriV1Simulator } from "./NoriV1Simulator";

describe('NoriV1Simulator', () => {
    it('should load immediate', () => {
        const code = `
            lim r1, 5
        `;
        const simulator = new NoriV1Simulator(code);
        simulator.step();
        expect(simulator.getState()).toEqual({
            ...defaultNoriV1SimulatorState(),
            registers: [0, 5, 0, 0, 0, 0, 0, 0],
        });
    });
});