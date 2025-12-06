import { describe, expect, it } from "vitest";
import { defaultNoriV1SimulatorState, NoriV1Simulator } from "./NoriV1Simulator";

describe('NoriV1Simulator', () => {
    it('should load immediate', () => {
        const code = `
            lim r1, 5
        `;
        const simulator = new NoriV1Simulator(code);
        simulator.getState().registers[1] = 1;
        simulator.step();
        expect(simulator.getState()).toEqual({
            ...defaultNoriV1SimulatorState(),
            registers: [0, 5, 0, 0, 0, 0, 0, 0],
        });
    });

    it('should add immediate', () => {
        const code = `
            addi r1, 5
        `;
        const simulator = new NoriV1Simulator(code);
        simulator.getState().registers[1] = 1;
        simulator.step();
        expect(simulator.getState()).toEqual({
            ...defaultNoriV1SimulatorState(),
            registers: [0, 6, 0, 0, 0, 0, 0, 0],
        });
    });
});