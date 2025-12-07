import { describe, expect, it } from "vitest";
import { defaultNoriSimulatorState, NoriSimulator } from "./NoriSimulator";

describe('NoriV1Simulator', () => {
    it('should load immediate', () => {
        const code = `
            lim r1, 5
        `;
        const simulator = new NoriSimulator(code);
        simulator.getState().registers[1] = 1;
        simulator.step();
        expect(simulator.getState()).toEqual({
            ...defaultNoriSimulatorState(),
            registers: [0, 5, 0, 0, 0, 0, 0, 0],
        });
    });

    it('should add immediate', () => {
        const code = `
            addi r1, 5
        `;
        const simulator = new NoriSimulator(code);
        simulator.getState().registers[1] = 1;
        simulator.step();
        expect(simulator.getState()).toEqual({
            ...defaultNoriSimulatorState(),
            registers: [0, 6, 0, 0, 0, 0, 0, 0],
        });
    });
});