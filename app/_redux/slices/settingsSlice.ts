import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { RootState } from "../store";
import { persistReducer } from "redux-persist";
import { NodeType } from "@/lib/services/NodeService";

type ColorMapType = {
    [key in NodeType]: string;
};

export const BASE_THICKNESS = 10;

const settingsSlice = createSlice({
    name: "settings",
    initialState: {
        colorMap: {} as ColorMapType,
        dashedTypes: [] as NodeType[],
        edgeThickness: BASE_THICKNESS,
    },
    reducers: {
        setColors: (state, action: PayloadAction<ColorMapType>) => {
            state.colorMap = action.payload;
        },
        addDashedType: (state, action: PayloadAction<NodeType>) => {
            state.dashedTypes.push(action.payload);
        },
        removeDashedType: (state, action: PayloadAction<NodeType>) => {
            state.dashedTypes = state.dashedTypes.filter(
                (type) => type !== action.payload
            );
        },
        setEdgeThickness: (state, action: PayloadAction<number>) => {
            state.edgeThickness = action.payload;
        }
    }
});

export const { setColors, addDashedType, removeDashedType, setEdgeThickness } = settingsSlice.actions;

export const selectColors = (state: RootState) => state.settings.colorMap;
export const selectDashedTypes = (state: RootState) => state.settings.dashedTypes;
export const selectEdgeThickness = (state: RootState) => state.settings.edgeThickness;

const settingsReducer = settingsSlice.reducer;

const settingsPersistConfig = {
    key: "settings",
    storage,
};

export default persistReducer(settingsPersistConfig, settingsReducer);
