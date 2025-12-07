import { TextField } from "@mui/material";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import codeSlice, { setSourceCode } from "../../store/slices/codeSlice";
import { RootState } from "../../store";

export interface CodeEditorProps {
    initialCode?: string;
}

export function CodeEditor(props: CodeEditorProps) {
    const { initialCode } = props;

    const dispatch = useAppDispatch();
    const sourceCode = useAppSelector((state: RootState) => state.code.sourceCode);

    function setCode(code: string) {
        dispatch(setSourceCode(code));
    }
    
    return (
        <TextField
            label='Code Editor'
            value={sourceCode}
            onChange={(textArea) => setCode(textArea.target.value)}
            multiline
            fullWidth
        />
    );
}