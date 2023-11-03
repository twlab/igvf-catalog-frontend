import { PayloadAction, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { RootState } from "../store";
import { QueryType } from "@/lib/services/AutocompleteService";
import { exactTypes } from "@/components/MainSearchBar";
import { persistReducer } from "redux-persist";

interface SearchHistoryEntryType {
    term: string,
    uri: string,
    type: QueryType | keyof typeof exactTypes;
}

export interface SearchHistoryEntry {
    result: SearchHistoryEntryType;
    timestamp: number;
}

export type SlashCommandType = QueryType;

const searchHistoryAdapter = createEntityAdapter<SearchHistoryEntry>({
    selectId: (entry) => entry.timestamp,
    sortComparer: (a, b) => b.timestamp - a.timestamp,
});

const maxHistoryLength = 24;

export const searchSlice = createSlice({
    name: "search",
    initialState: {
        searchHistory: searchHistoryAdapter.getInitialState(),
        searchQuery: "",
        slashCommand: null as SlashCommandType | null,
    },
    reducers: {
        addSearchHistoryEntry: (state, action: PayloadAction<SearchHistoryEntry>) => {
            const curHistory = searchHistoryAdapter.getSelectors().selectAll(state.searchHistory);
            let toRemove: SearchHistoryEntry[] = [];
            if (curHistory.find((e) => e.result.uri === action.payload.result.uri)) {
                toRemove.push(...curHistory.filter((e) => e.result.uri === action.payload.result.uri));
            }
            if (curHistory.length > maxHistoryLength) {
                toRemove.push(...curHistory.slice(maxHistoryLength));
            }
            searchHistoryAdapter.removeMany(state.searchHistory, toRemove.map((e) => e.timestamp));
            searchHistoryAdapter.addOne(state.searchHistory, action.payload);
        },
        deleteAtTimestamp: (state, action: PayloadAction<number>) => {
            searchHistoryAdapter.removeOne(state.searchHistory, action.payload);
        },
        clearSearchHistory: (state) => {
            searchHistoryAdapter.removeAll(state.searchHistory);
        },
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
        },
        setSlashCommand: (state, action: PayloadAction<SlashCommandType | null>) => {
            state.slashCommand = action.payload;
        }
    }
});

export const { addSearchHistoryEntry, clearSearchHistory, setSearchQuery, deleteAtTimestamp, setSlashCommand } = searchSlice.actions;

export const searchHistorySelectors = searchHistoryAdapter.getSelectors<RootState>(
    (state) => state.search.searchHistory
);

export const selectSearchHistory = searchHistorySelectors.selectAll;
export const selectSearchQuery = (state: RootState) => state.search.searchQuery;
export const selectSlashCommand = (state: RootState) => state.search.slashCommand;

const searchReducer = searchSlice.reducer;

const searchPersistConfig = {
    key: "search",
    storage,
    blacklist: ["searchQuery", "slashCommand"],
};

export default persistReducer(searchPersistConfig, searchReducer);
