import { useAppDispatch, useAppSelector } from "@/app/_redux/hooks";
import { useCallback, useEffect, useRef, useState } from "react";
import { addSearchHistoryEntry, deleteAtTimestamp, selectSearchHistory, selectSearchQuery, setSearchQuery } from "@/app/_redux/slices/searchSlice";
import AutocompleteService, { AutocompleteResp, QueryType } from "@/lib/services/AutocompleteService";
import { debounce } from "@/lib/utils";
import classNames from "classnames";
import { useRouter } from "next13-progressbar";
import Skeleton from 'react-loading-skeleton';

function SearchSuggestionDivider({ text }: { text: string }) {
    return (
        <div className="flex items-center my-1">
            <div className="text-gray-500 text-sm">{text}</div>
        </div>
    );
}

function SearchSuggestionBase({
    icon,
    text,
    desc,
    rightAdornment,
    onClick,
}: {
    icon: React.ReactNode;
    text: string;
    desc: string;
    rightAdornment?: React.ReactNode;
    onClick: () => void;
}) {
    return (
        <div
            className="cursor-pointer hover:bg-gray-100 p-1 rounded-xl flex flex-row justify-between items-center"
            onClick={onClick}
        >
            <div className="flex items-center gap-x-2">
                <div className="flex-shrink-0">{icon}</div>
                <div>
                    <div className="text-sm font-medium">{text}</div>
                    <div className="text-xs text-gray-500">{desc}</div>
                </div>
            </div>
            <div onClick={e => e.stopPropagation()}>
                {rightAdornment}
            </div>
        </div>
    );
}

type TypeToEmoji = {
    [key in QueryType]: string;
};

const typeToEmoji: TypeToEmoji = {
    gene: "🧬",
    "ontology term": "📚",
    protein: "💪",
};

type ResultStatus = "idle" | "loading" | "fulfilled" | "empty";

export default function MainSearchBar() {
    const dispatch = useAppDispatch();
    const searchQuery = useAppSelector(selectSearchQuery);
    const recentSearches = useAppSelector(selectSearchHistory);
    const router = useRouter();

    const [focused, setFocused] = useState(false);
    const [resultsStatus, setResultsStatus] = useState<ResultStatus>("idle");
    const [results, setResults] = useState<AutocompleteResp[]>([]);

    const containerRef = useRef<HTMLDivElement>(null);

    const renderSearchSuggestions = () => {
        if (resultsStatus === "loading") return (
            <Skeleton count={6} height={26} style={{ marginTop: 18, }} />
        );
        if (resultsStatus === "empty") return (
            <div className="flex items-center my-1">
                <div className="text-gray-500 text-sm">No results found.</div>
            </div>
        );

        const suggestions: React.ReactNode[] = [];
        // render slash search filters (e.g. /gene, /variant, /disease)
        // render up to last 6 searches + example searches if focused but no input
        // render search results

        if (resultsStatus === "fulfilled") {
            suggestions.push(
                <SearchSuggestionDivider text="Search Results" key="searchResults" />
            );

            for (let i = 0; i < Math.min(results.length, 6); i++) {
                const result = results[i];
                if (!result) continue;
                suggestions.push(
                    <SearchSuggestionBase
                        icon={<div className="text-gray-500 text-sm">{typeToEmoji[result.type] || '🔎'}</div>}
                        text={result.term}
                        desc={result.type}
                        onClick={() => {
                            dispatch(addSearchHistoryEntry({
                                result,
                                timestamp: Date.now(),
                            }));
                            router.push(result.uri)
                        }}
                        key={`searchResult-${i}`}
                    />
                );
            }

            return suggestions;
        }

        if (recentSearches.length > 0) {
            suggestions.push(
                <SearchSuggestionDivider text="Recent Searches" key="recentSearches" />
            );
            for (let i = 0; i < Math.min(recentSearches.length, 6); i++) {
                const res = recentSearches[i];
                if (!res) continue;
                suggestions.push(
                    <SearchSuggestionBase
                        text={res.result.term}
                        desc={res.result.type}
                        icon={<div className="text-gray-500 text-sm">{typeToEmoji[res.result.type] || '🔎'}</div>}
                        onClick={() => {
                            dispatch(addSearchHistoryEntry({
                                result: res.result,
                                timestamp: Date.now(),
                            }));
                            router.push(res.result.uri)
                        }}
                        rightAdornment={
                            <div className="text-xs text-gray-500" onClick={() => {
                                dispatch(deleteAtTimestamp(res.timestamp));
                            }}>
                                Delete
                            </div>
                        }
                        key={`recentSearch-${i}`}
                    />
                );
            }
        }

        suggestions.push(
            <SearchSuggestionDivider text="Filters" key="filters" />
        );

        AutocompleteService.allTypes.forEach((type) => {
            suggestions.push(
                <SearchSuggestionBase
                    icon={<div className="text-gray-500 text-sm">{typeToEmoji[type] || '🔎'}</div>}
                    text={`/${type}`}
                    desc="Search by type"
                    onClick={() => {
                        dispatch(setSearchQuery(`/${type}`));
                    }}
                    key={`filter-${type}`}
                />
            );
        });

        return suggestions;
    }

    const updateSearch = async (query: string) => {
        if (!query.length) {
            setResultsStatus("idle");
            setResults([]);
            return;
        }
        const data = await AutocompleteService.getAutocompleteResults(query);

        setResults(data);

        setResultsStatus(data.length > 0 ? "fulfilled" : "empty");
    };

    const debouncedUpdateSearch = useCallback(debounce(updateSearch, 500), []);

    useEffect(() => {
        debouncedUpdateSearch(searchQuery);
        if (searchQuery.length > 0) {
            setResultsStatus("loading");
            setFocused(true);
        }
    }, [searchQuery]);

    useEffect(() => {
        function handleClickOutside(event: any) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setFocused(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [containerRef]);

    const expanded = focused || searchQuery.length > 0;

    return (
        <div className="relative" ref={containerRef}>
            <div className="relative mt-2 rounded-2xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                </div>
                <input
                    type="text"
                    id="search-query"
                    className={classNames(
                        "outline-none block w-full text-2xl rounded-2xl h-14 border-0 py-1.5 pl-11 pr-11 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400sm:text-sm sm:leading-6",
                        { "rounded-b-none": expanded }
                    )}
                    placeholder="1433B_HUMAN, rs78196225..."
                    onFocus={() => setFocused(true)}
                    onChange={(e) => {
                        dispatch(setSearchQuery(e.target.value));
                    }}
                    value={searchQuery}
                    autoComplete="off"
                />
                {(searchQuery.length > 0 || focused) && (
                    <div
                        className="cursor-pointer absolute inset-y-0 right-0 flex items-center pr-3"
                        onClick={() => {
                            dispatch(setSearchQuery(""));
                            setFocused(false);
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                )}
            </div>
            {expanded &&
                <div className="absolute w-full border p-2 py-3 rounded-b-2xl bg-white">
                    {renderSearchSuggestions()}
                </div>
            }
        </div>
    );
}
