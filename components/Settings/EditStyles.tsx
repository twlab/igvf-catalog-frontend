"use client";

import { useAppDispatch, useAppSelector } from '@/app/_redux/hooks';
import { BASE_THICKNESS, addDashedType, removeDashedType, selectColors, selectDashedTypes, selectEdgeThickness, setColors, setEdgeThickness } from '@/app/_redux/slices/settingsSlice';
import { NodeType, NodeTypes } from '@/lib/services/NodeService';
import React, { useEffect, useState } from 'react';


export default function EditColors() {
    const dispatch = useAppDispatch();
    const colorMap = useAppSelector(selectColors);
    const dashedTypes = useAppSelector(selectDashedTypes);
    const edgeThickness = useAppSelector(selectEdgeThickness);
    const [nodeType, setNodeType] = useState<NodeType>('gene');
    const [color, setColor] = useState<string>('');
    const [thickness, setThickness] = useState<number>(edgeThickness);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleNodeTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setNodeType(e.target.value as NodeType);
    };

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setColor(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!color) return;
        dispatch(setColors({ ...colorMap, [nodeType]: color }));
    };

    const handleRemoveColor = (nodeTypeToRemove: NodeType) => {
        const updatedColorMap = { ...colorMap };
        delete updatedColorMap[nodeTypeToRemove];
        dispatch(setColors(updatedColorMap));
    };

    const handleToggleDashedType = (type: NodeType) => {
        if (dashedTypes.includes(type)) {
            dispatch(removeDashedType(type));
        } else {
            dispatch(addDashedType(type));
        }
    };

    const handleThicknessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newThickness = parseInt(e.target.value);
        if (!isNaN(newThickness)) {
            setThickness(newThickness);
            dispatch(setEdgeThickness(newThickness));
        }
    };

    const handleResetThickness = () => {
        setThickness(BASE_THICKNESS);
        dispatch(setEdgeThickness(BASE_THICKNESS));
    }

    if (!isMounted) return null;

    return (
        <div>
            <div>
                <h2 className='text-2xl mb-2'>Edit Node Styles</h2>
                <form onSubmit={handleSubmit}>
                    <div className='space-x-4 flex flex-row items-center'>
                        <label>
                            <span className='mr-2'>Node Type:</span>
                            <select value={nodeType} onChange={handleNodeTypeChange} className='border border-black'>
                                <option value="gene">Gene</option>
                                <option value="protein">Protein</option>
                                <option value="transcript">Transcript</option>
                                <option value="drug">Drug</option>
                                <option value="variant">Variant</option>
                                <option value="study">Study</option>
                            </select>
                        </label>
                        <label>
                            <span className='mr-2'>Color:</span>
                            <input type="color" value={color} onChange={handleColorChange} />
                        </label>
                        <button type="submit" className='px-2 py-0.5 bg-primary text-white rounded-md'>Set Color</button>
                    </div>
                </form>
                <h3 className='text-xl my-2'>Current Colors</h3>
                <ul className='space-y-2 w-fit'>
                    {Object.entries(colorMap).map(([key, value]) => (
                        <li key={key} className='w-full flex flex-row justify-between'>
                            <span className='capitalize mr-2'>{key}: </span><span style={{ color: value }}>{value}</span>
                            <button
                                onClick={() => handleRemoveColor(key as NodeType)}
                                className='px-2 py-0.5 bg-primary text-white rounded-md ml-2'
                            >Remove</button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className='my-4'>
                <h3 className='text-xl mb-2'>Display with Dashed Lines</h3>
                <ul className='space-y-2'>
                    {NodeTypes.map((type) => (
                        <li key={type}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={dashedTypes.includes(type as NodeType)}
                                    onChange={() => handleToggleDashedType(type as NodeType)}
                                />
                                <span className='ml-2 capitalize'>{type}</span>
                            </label>
                        </li>
                    ))}
                </ul>
            </div>
            <div className='my-4'>
                <h3 className='text-xl mb-2'>Edge Thickness</h3>
                <p className='text-sm mb-2 text-slate-500'>Values between 5 and 15 are recommended. 10 is the default.</p>
                <input
                    type="number"
                    value={thickness}
                    onChange={handleThicknessChange}
                    className='border border-black'
                />
                <button
                    onClick={handleResetThickness}
                    className='px-2 py-0.5 bg-primary text-white rounded-md ml-2'
                >Reset</button>
            </div>
        </div>
    );
}
